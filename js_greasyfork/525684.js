// ==UserScript==
// @name         StegLLM
// @namespace    https://github.com/Rin313
// @version      1.03
// @description  此脚本已不再维护，最新项目详见https://github.com/Rin313/StegLLM。This script is no longer maintenance, please refer to the https://github.com/Rin313/StegLLM for the latest project
// @author       Rin
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/xxhash-wasm@1.1.0/umd/xxhash-wasm.min.js
// @downloadURL https://update.greasyfork.org/scripts/525684/StegLLM.user.js
// @updateURL https://update.greasyfork.org/scripts/525684/StegLLM.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const hostname=window.location.hostname;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    window.onerror = function(message, source, lineno, colno, error) {
      if(!source)return;
      if(source.includes("StegLLM"))
        alert(`Error:${error.message}`);
    }
    const createElement = (tag, props = {}, styles = {}) => {
        const el = Object.assign(document.createElement(tag), props);//创建元素
        Object.assign(el.style, styles);//配置styles
        return el;
    };
    let settings = {
        prompt: GM_getValue("prompt", '续写这段散文：'),//如果不存在则使用默认值
    };
    GM_registerMenuCommand('prompt setting', function() {
        let customPrompt = prompt("", settings.prompt);
        if (customPrompt) {
          GM_setValue("prompt", customPrompt);
          settings.prompt=customPrompt;
        }
    });
    const gbkDecoder = new TextDecoder('gb18030');//能解码gbk不支持的符号，比如欧元、表意文字
    const utf8Encoder= new TextEncoder();
    const ranges = [
      [0xA1, 0xA9,  0xA1, 0xFE],
      [0xB0, 0xF7,  0xA1, 0xFE],
      [0x81, 0xA0,  0x40, 0xFE],//从这里开始的三个扩展区，第二个字节要排除0x7F
      [0xAA, 0xFE,  0x40, 0xA0],
      [0xA8, 0xA9,  0x40, 0xA0],
    ];
    let codes,table;
    const punctuations=["？","?","！","!","。","）",")","……"];//,"\n"
    const logitBias=[["　",false],[" ",false],["   ",false],["\n\n",false],["  \n",false],[" \n",false],["�",false],[" �",false],["．",false],["【",false],["】",false],["〈",false],["〉",false]]
    const intercept=2;
    const tokens=1;// const tokens=Math.ceil(intercept/0.75);
    const probs=10;
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1)); // 生成 0 到 i 之间的随机整数
          [array[i], array[j]] = [array[j], array[i]]; // 交换元素
      }
      return array;
    }
    function encodeToGBK(str) {
      if(!codes){
        codes=new Uint16Array(22046);//先把全部gbk字符都保存到一个16位整型数组里
        let i = 0,t;
        for (const [b1Begin, b1End, b2Begin, b2End] of ranges) {
          for (let b2 = b2Begin; b2 <= b2End; b2++) {
            if (b2 !== 0x7F) {//反过来遍历，减少判断0x7F的次数
              t = b2 << 8; //不能用16位的codes[i]
              for (let b1 = b1Begin; b1 <= b1End; b1++)
                codes[i++] = t | b1;
            }
          }
        }
      }
      if(!table){
        table = new Uint16Array(65509);//gbk包含¤164，将164左移到0也才省一点点空间
        const str = gbkDecoder.decode(codes);//解码为包含全部gbk字符的字符串
        for (let i = 0; i < str.length; i++){
          table[str.charCodeAt(i)] = codes[i];//unicode到gbk的映射
        }
      }
      const buf = new Uint8Array(str.length * 2);
      let n = 0;
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code < 128)
          buf[n++] = code;
        else{
              const gbk = table[code];
              if (gbk === 0)
                throw new Error("文本中存在不支持的符号");//有些编码器会用问号替换来避免报错，但这实际已经发生信息丢失了，不能容忍
              else {
                buf[n++] = gbk;
                buf[n++] = gbk >> 8;
              }
        }
      }
      return buf.subarray(0, n);
    }
    async function readStream(stream) {
      const reader = stream.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
      }
      const compressedData = new Uint8Array(chunks.reduce((acc, val) => acc + val.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        compressedData.set(chunk, offset);
        offset += chunk.length;
      }
      return compressedData;
    }
    async function decompress(stream) {
      const ds = new DecompressionStream("deflate-raw");
      const decompressedStream = stream.pipeThrough(ds);
      return readStream(decompressedStream).then(data => {
        return data; // 或者在这里进行一些额外的处理
      });
    }
    // async function passwordToAesCtrKey(password) {
    //   const passwordBuffer = utf8Encoder.encode(password);
    //   // 使用 PBKDF2 算法从密码派生密钥
    //   const keyMaterial = await crypto.subtle.importKey(
    //     "raw",
    //     passwordBuffer,
    //     { name: "PBKDF2" },
    //     false,
    //     ["deriveKey"]
    //   );
    //   // 使用 PBKDF2 派生 AES-CTR 密钥
    //   const aesCtrKey = await crypto.subtle.deriveKey(
    //     {
    //     name: "PBKDF2",
    //     salt: new Uint8Array(0), // 空盐值
    //     iterations: 1000, // 较低的迭代次数
    //     hash: "SHA-256",
    //     },
    //     keyMaterial,
    //     { name: "AES-CTR", length: 256 }, // 指定 AES-CTR 算法和密钥长度 (256位)
    //     true, // 密钥可导出
    //     ["encrypt", "decrypt"] // 密钥用途
    //   );
    //   return aesCtrKey;
    // }
    async function encryptAesCtr(data, str) {
      const buffer=await crypto.subtle.digest('SHA-256', utf8Encoder.encode(str));
      const iv=new Uint8Array(buffer).subarray(0, 16);
      const key= await crypto.subtle.importKey(
        "raw",
        buffer,
        { name: "AES-CTR", length: 256},
        false,
        ["encrypt", "decrypt"]
      );
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-CTR",
          counter: iv,
          length: 64, // 计数器块大小（以位为单位），通常为 64 或 128
        },
        key,data
      );
      return new Uint8Array(encrypted);
    }
    async function decryptAesCtr(data, str) {
      const buffer=await crypto.subtle.digest('SHA-256', utf8Encoder.encode(str));
      const iv=new Uint8Array(buffer).subarray(0, 16);
      const key= await crypto.subtle.importKey(
        "raw",
        buffer,
        { name: "AES-CTR", length: 256},
        false,
        ["encrypt", "decrypt"]
      );
      const decrypted = await crypto.subtle.decrypt(
        {
        name: "AES-CTR",
        counter: iv,
        length: 64,
        },
        key,
        data
      );
      return new Uint8Array(decrypted);
    }
    async function chat(str,complete=false) {
      const body={//有些参数不生效，响应格式也和llama.cpp的api略有不同//在api中设置system_prompt会导致性能严重下降
          // "stream": true,
          "n_predict": tokens,//生成的token数，-1-2048
          "temperature": 1.4,//影响文本的随机性，0-2//较高的温度会增加计算量，较低的温度会导致重复
          // "stop": punctuations,
          "repeat_last_n": 256,
          "repeat_penalty": 1.18,//重复惩罚，1.0为无惩罚
          // "top_p": 0.95,//默认0.95，增大后似乎能增加更多的选词可能性
          // "min_p": 0.05,
          // "tfs_z": 1,
          // "typical_p": 1,
          // "presence_penalty": 0,
          // "frequency_penalty": 0,
          // "mirostat": 0,//关闭mirostat
          // "mirostat_tau": 5,
          // "mirostat_eta": 0.1,
          // "grammar": "",
          // "min_keep": 0,
          // "image_data": [],
          "cache_prompt": true,//提示词复用
          "api_key": "",
          "slot_id": -1,
          "prompt": str,//支持输入多个prompt
          // "response_fields": ["content"],//不生效？
          "top_k": probs,//选词范围，默认40
          "n_probs": probs,//按概率排序的前10个选词，太大或太小都会降低隐写效果
          "logit_bias": logitBias//禁用一些不自然的字符，注意空白符有非常多种
      }
      if(complete){
        body["n_predict"]=9;
        body["stop"]=punctuations;//动态截断
        body["n_probs"]=0;
        body["top_k"]=40;
      }
      const response = await fetch('http://localhost:8080/completion', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      if(!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const json=(await response.json());
      if(complete)
        return json.content+json.stopping_word;
      const t=json.completion_probabilities[0];
      if(!t)return chat(str);
      else return shuffle(t.probs);
    }
    async function encrypt() {
        const plainText = (await createCustomPrompt("🔒"));
        if(plainText){
          const { h32 } = await xxhash();
          let bytes= encodeToGBK(plainText);
          console.log(bytes);
          const stream=new ReadableStream({
            start(controller) {
              controller.enqueue(bytes);
              controller.close();
            }
          });
          const compressedStream = stream.pipeThrough(new CompressionStream("deflate-raw"),);
          const result=await readStream(compressedStream);
          if(bytes.length>result.length)
            bytes=result;
          console.log(bytes);
          bytes=(await encryptAesCtr(bytes,hostname));
          console.log(bytes);
          let base2=[];
          for (let b of bytes) {
            for(let i=7;i>=0;i--){
              base2.push(b>>i & 0x01);
            }
          }
          console.log(base2);
          const counts=new Uint8Array(base2.length);
          let coverText='';
          for(let i=0;i<base2.length;i++){
            const list=(await chat(settings.prompt+coverText));
            let j=0;
            aaa:for(;j<list.length;j++){
              const t=list[j].tok_str;
              if(t.length===2&&!t.includes("\uFFFD")&&h32(t)%2===base2[i]){
                coverText+=t;
                break;
              }
              else if(t.length===1){
                const list2=(await chat(settings.prompt+coverText+t));
                for(let k=0;k<list2.length;k++){
                  const t2=list2[k].tok_str;
                  if(t2.length===1&&!t2.includes("\uFFFD")&&h32(t+t2)%2===base2[i]){
                    coverText+=t+t2;
                    break aaa;
                  }
                }
              }
            }
            if(j===list.length){
              alert("选词失败，请重新再试");
              return;
            }

          }
          console.log(coverText.length);
          if(!punctuations.includes(coverText[coverText.length-1])){
            for(;;){
              const t=(await chat(settings.prompt+coverText,true));
              if(punctuations.includes(t[t.length-1])){
                coverText+=t;
                break;
              }
            }
          }
          showCustomAlert(coverText);
        }
    }
    async function decrypt() {
      const userInput=(await createCustomPrompt("🗝️"));//粘贴到prompt会导致空白字符等丢失//粘贴到input会导致换行符丢失
      if(userInput){
        const { h32 } = await xxhash();
        let base2 = [];
        let t='';
        //console.log(userInput)
        console.log(userInput.length);
        for (let i = 0; i < userInput.length; i++) {
          t+=userInput[i];
          if(t.length===intercept){
            //console.log(t+" "+t.length)
            base2.push(h32(t)%2);
            t='';
          }
        }
        let bytes = new Uint8Array(base2.length/8);let k=0;
        console.log(base2);
        for(let i=0;i<base2.length;){
          bytes[k++]=base2[i]*128+base2[i+1]*64+base2[i+2]*32+base2[i+3]*16+base2[i+4]*8+base2[i+5]*4+base2[i+6]*2+base2[i+7];
          i+=8;
        }
        console.log(bytes)
        bytes=(await decryptAesCtr(bytes,hostname));
        console.log(bytes)
        const stream=new ReadableStream({
            start(controller) {
              controller.enqueue(bytes);
              controller.close();
            }
        });
        await decompress(stream)
          .then(data=>{bytes=data;})
          .catch(error=>{console.log(error)});
        console.log(bytes)
        alert(gbkDecoder.decode(bytes));
      }
    }
    function swapColors(){
      let t=sidebarButton1.style.backgroundColor;
      sidebarButton1.style.backgroundColor=sidebarButton2.style.backgroundColor;
      sidebarButton2.style.backgroundColor=t;
    }
    const buttonStyles1 = {
      position: 'fixed',
      right: '0', //固定右侧
      zIndex: '9999', // 确保不被覆盖
      cursor: 'pointer',//显示可点击光标
      backgroundColor:'#f56c73',
      border: 'none',
      top:   '42%',
      height: '25px',
      width: '25px',
      overflow: 'hidden',
    };
    const buttonStyles2 = {
        position: 'fixed',
        right: '0', //固定右侧
        zIndex: '9999', // 确保不被覆盖
        cursor: 'pointer',//显示可点击光标
        backgroundColor:'#d87b83',
        border: 'none',
        top:   '47%',
        height: '25px',
        width: '25px',
        overflow: 'hidden',
      };
    const sidebarButton1 = createElement('button', {}, buttonStyles1);
    const sidebarButton2 = createElement('button', {}, buttonStyles2);
    sidebarButton1.addEventListener('mouseenter', () => swapColors() );
    sidebarButton2.addEventListener('mouseenter', () => swapColors() );
    sidebarButton1.addEventListener('click', () => encrypt());
    sidebarButton2.addEventListener('click', () => decrypt());
    document.body.append(sidebarButton1, sidebarButton2);
const showCustomAlert = (text) => {
    // 创建遮罩层
    const overlay = createElement('div', {}, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    });

    // 创建弹出框容器
    const alertBox = createElement('div', {}, {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        width: '300px',
    });

    // 创建显示的文本
    const message = createElement('p', { textContent: text }, {
        margin: '0 0 20px',
        fontSize: '16px',
        color: '#333',
        wordBreak: 'break-word',
    });

    // 创建按钮容器
    const buttonContainer = createElement('div', {}, {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px',
    });

    // 创建复制按钮
    const copyButton = createElement('button', { textContent: 'Copy' }, {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        flex: '1',
        marginRight: '10px',
    });

    // 按钮点击事件 - 复制文本
    copyButton.onclick = () => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
            document.body.removeChild(overlay);
        });
    };

    // 创建关闭按钮
    const closeButton = createElement('button', { textContent: 'Close' }, {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        flex: '1',
    });

    // 关闭按钮点击事件
    closeButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    // 组装按钮容器
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(closeButton);

    // 组装弹出框
    alertBox.appendChild(message);
    alertBox.appendChild(buttonContainer);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
};
const createCustomPrompt = (placeholder = "请输入内容...") => {
  return new Promise((resolve) => {
    // 创建一个覆盖整个页面的背景遮罩
    const overlay = createElement('div', {}, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '1000',
    });

    // 创建一个容器来放置textarea和按钮
    const promptContainer = createElement('div', {}, {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '300px',
    });

    // 创建textarea
    const textarea = createElement(
      'textarea',
      {
        placeholder: placeholder,
      },
      {
        width: '100%',
        height: '100px',
        marginBottom: '10px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        outline: 'none',
        resize: 'none',
      }
    );

    // 创建提交按钮
    const submitButton = createElement(
      'button',
      {
        innerText: '提交',
        onclick: () => {
          const value = textarea.value;
          resolve(value); // 当点击提交时，resolve Promise 并返回值
          document.body.removeChild(overlay); // 移除遮罩层
        },
      },
      {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }
    );

    // 提交按钮 hover 样式
    submitButton.addEventListener('mouseover', () => {
      submitButton.style.backgroundColor = '#0056b3';
    });
    submitButton.addEventListener('mouseout', () => {
      submitButton.style.backgroundColor = '#007BFF';
    });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        resolve(null); // 用户取消操作时，返回 null
        document.body.removeChild(overlay); // 移除遮罩层
      }
    });
    // 把textarea和按钮添加到容器中
    promptContainer.appendChild(textarea);
    promptContainer.appendChild(submitButton);

    // 把容器添加到遮罩层中
    overlay.appendChild(promptContainer);

    // 把遮罩层添加到body中
    document.body.appendChild(overlay);
  });
};
})();