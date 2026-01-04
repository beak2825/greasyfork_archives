// ==UserScript==
// @name         Abstract Emoji encryptor
// @namespace    https://bgm.tv
// @version      1.0
// @description  Fff**k.
// @author       Rin
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524124/Abstract%20Emoji%20encryptor.user.js
// @updateURL https://update.greasyfork.org/scripts/524124/Abstract%20Emoji%20encryptor.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const hostname=window.location.hostname;
    let settings = {
        promptTemplate: GM_getValue("promptTemplate", '你的好朋友是二次元婆罗门论坛bangumi上的动漫高手，阅番无数，无人能及，就连站长sai见了都要尊称一句性焦虑领域大神。依次使用下面给出的符号，编写一段话送给你的好朋友，请注意在合适的位置插入符号以保持它们的顺序。\n符号顺序为:'),//如果不存在则使用默认值
    };
    GM_registerMenuCommand('设置提示模板', function() {
        let promptTemplate = prompt("", settings.promptTemplate);
        if (promptTemplate) {
          GM_setValue("promptTemplate", promptTemplate);
          settings.promptTemplate=GM_getValue("promptTemplate", '你的好朋友是二次元婆罗门论坛bangumi上的动漫高手，阅番无数，无人能及，就连站长sai见了都要尊称一句性焦虑领域大神。依次使用下面给出的符号，编写一段话送给你的好朋友，请注意在合适的位置插入符号以保持它们的顺序。\n符号顺序为:');
        }
    });
    window.onerror = function(message, source, lineno, colno, error) {
      if(source.includes("Abstract%20Emoji%20encryptor"))
        alert(`Error:${error.message}`);
    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const createElement = (tag, props = {}, styles = {}) => {
        const el = Object.assign(document.createElement(tag), props);//创建元素
        Object.assign(el.style, styles);//配置styles
        return el;
    };
    const gbkDecoder = new TextDecoder('gb18030');//能解码gbk不支持的符号，比如欧元、表意文字
    const ranges = [
      [0xA1, 0xA9,  0xA1, 0xFE],
      [0xB0, 0xF7,  0xA1, 0xFE],
      [0x81, 0xA0,  0x40, 0xFE],//从这里开始的三个扩展区，第二个字节要排除0x7F
      [0xAA, 0xFE,  0x40, 0xA0],
      [0xA8, 0xA9,  0x40, 0xA0],
    ];
    const characterSet = ["~","？","………","⚡","⭐","😆","😗","👣","😨","🤓","🤣","😘‖","🥵","😉","🚀","😀","😋","😂","😅","😭","😇","🔥","😍","😡","😠","🤬","😈","👿","😤","💀","☠️","😻","😽","👹","👽","👻","👾","🤖","🤡","💩","🙊","🙉","🙈","💌","💘","💞","💕","💟","❣️","💔","❤️","💙","💚","💜","🖤","🤍","👁️‍🗨️","💤","💦","🕳️","💫","💥","💢","💯","💋","🎄","🎊","🎇","✨","🎈","🎉","🎁","🎀","🎐","🎃","🧧","🥇","🎖️","🏅","🏆","⚽","🏀","🥊","🤿","🎣","🪁","🎯","🎮","🔮","🎲","🧸","♥️","🎭","🎨","🧵","🧶","👓","🕶️","🥽","👔","👗","👘","🧣","🧤","🧦","🩲","🩱","👜","🎒","🩰","👙","👑","🎩","📿","💄","💍","💎","🔔","🔊","📣","📢","🎼","🎵","🎶","🎧","🎤","🎻","🎺","🥁","📱","📞","⌨️","💻","📷","📼","🎬","🏮","🕯️","🔎","💡","🔦","📕","📔","📖","📚","📜","💰","💵","💸","✉️","📧","📦","✏️","🖍️","🖌️","✒️","📝","📍","💼","📆","📈","📉","🗑️","🔑","🗝️","🔒","🔐","⚖️","🧲","🔗","🛡️","🏹","⚔️","🗡️","🔧","⚙️","🛠️","⛏️","🪓","🔨","💣","🧬","🔭","📡","💉","🩸","💊","🩹","🩺","🛏️","🚿","🚽","🛋️","🚪","🛁","🧹","🧻","🧽","🧼","🚬","⚰️","♿","🔞","🚫","⚠️","⛔","⬆️","➡️","🛐","✡️","✝️","🔁","▶️","◀️","⏩","⏫","♂️","♾️","❗","❕","❓","❔","‼️","⁉️","💲","✅","☑️","✔️","❌","❎","⭕","♻️","⚜️","➿","➰","🆒","🆕","🆚","🆗","🆘","🆙","🆓","ℹ️","🔴","⚫","⚪","🔷","🟥","⬛","⬜","💠","🔳","🚩","🏁","🏳️‍🌈","‍🏴‍☠️"];
    sort(hostname,characterSet);
    let codes,table;
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
        table = new Uint16Array(65509);//gbk包含¤，小到164，将164左移到0也才省一点点空间
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

    async function encode(str) {
        let result = '';
        let data= encodeToGBK(str);
        await sort(hostname,data);
        for (let b of data) {
            result += characterSet[b & 0xFF] + '  ';
        }
        return result.trimEnd();
    }
    async function encrypt() {
        const userInput = prompt("🔒（可在扩展管理界面设置提示模板）");
        if(userInput){
          const emoji=await encode(userInput);
          if(isMobile)
            alert(`成功！请手动复制下面的内容\n${settings.promptTemplate}${emoji}`);
          else {
            await navigator.clipboard.writeText(settings.promptTemplate+emoji);
            alert('成功！Emoji已复制到剪切板');
          }
        }

    }
    async function decrypt() {
      const userInput = prompt("🗝️");
      if(userInput){
        let list = [];
        let maxCharLength = 7;
        for (let i = 0; i < userInput.length; i++) {
          for (let j = maxCharLength; j >= 1; j--) {
            if (i + j <= userInput.length) {
              let subString = userInput.substring(i, i + j);
              let index = characterSet.indexOf(subString);
              if (index !== -1) {
                list.push(index);
                i += j - 1;
                break;
              }
            }
          }
        }
        const origin=new Uint8Array(list);
        await resort(hostname,origin);
        alert(gbkDecoder.decode(origin));
      }
    }
    async function sort(obfuscator,target) {
      const msgUint8 = new TextEncoder().encode(obfuscator); // 编码为 Uint8Array
      const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8);//哪怕可以基于target长度使用位数更少的sha256，但是解码的时候对于targer长度是不确定的
      const uint8Array = new Uint8Array(hashBuffer);
      const bitArray=new Uint8Array(512);let k=0;
      for (let i = 0; i < uint8Array.length; i++) {
        const byte = uint8Array[i];
        for (let j = 7; j >= 0; j--) // 从高位到低位遍历每个比特
          bitArray[k++]=(byte >> j) & 1;
      }
      for(let i=0;i<target.length-2;i++)
        if(bitArray[i]===1){
          const t=target[i];
          target[i]=target[i+1];
          target[i+1]=t;
        }
        else{
          const t=target[i];
          target[i]=target[i+2];
          target[i+2]=t;
        }
    }
    async function resort(obfuscator,target){
      const msgUint8 = new TextEncoder().encode(obfuscator); // 编码为 Uint8Array
      const hashBuffer = await crypto.subtle.digest('SHA-512', msgUint8);//哪怕可以基于target长度使用位数更少的sha256，但是解码的时候对于targer长度是不确定的
      const uint8Array = new Uint8Array(hashBuffer);
      const bitArray=new Uint8Array(512);let k=0;
      for (let i = 0; i < uint8Array.length; i++) {
        const byte = uint8Array[i];
        for (let j = 7; j >= 0; j--) // 从高位到低位遍历每个比特
          bitArray[k++]=(byte >> j) & 1;
      }
      for(let i=target.length-3;i>=0;i--)
          if(bitArray[i]===1){
            const t=target[i];
            target[i]=target[i+1];
            target[i+1]=t;
          }
          else{
            const t=target[i];
            target[i]=target[i+2];
            target[i+2]=t;
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
})();