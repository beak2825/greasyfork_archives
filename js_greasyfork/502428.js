// ==UserScript==
// @name         测试
// @namespace    http://tampermonkey.net/
// @version      25
// @license GPL
// @description  免费或者使用sd的api或使用novelai3配合ai生成插图
// @author       从前跟你一样
// @grant        unsafeWindow
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      vagrantup.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect       *
// @connect      127.0.0.1
// @connect      novelai.net
// @match        *://*/*
// @description  Save user settings
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue

// @downloadURL https://update.greasyfork.org/scripts/502428/%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/502428/%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==




//开启脚本后点击酒馆左下角的三条杠，文生图设置，不需要修改脚步！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
( function() {
    'use strict';
    let ster="";
    let images="";
    let imagesid="";
    let db=""
    let objectStorereadwrite="";
    let  objectStorereadonly="";
    let  xiancheng=true;

    // 添加点击事件监听器到您的按钮或元素上
    $(document).ready(function() {
       ster= setInterval(addNewElement, 2000);
    });
    const dbName = 'tupian';
    const dbVersion = 1;
    const objectStoreName = 'tupianhuancun';
 async function Storereadwrite(data){//使用数据库
    const request = indexedDB.open(dbName, dbVersion);
    request.onerror = function(event) {
    console.error('Failed to open database:', event.target.error);
    };
    request.onsuccess = function(event) {
        db = event.target.result;
     const dbeadwrite = db.transaction([`${objectStoreName}`], 'readwrite');
     objectStorereadwrite = dbeadwrite.objectStore(`${objectStoreName}`);
     objectStorereadwrite.put(data);

    };
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        // 判断对象存储是否存在
        if (!db.objectStoreNames.contains(objectStoreName)) {
          // 如果对象存储不存在，则创建它
          const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id' });
          console.log('Object store created:', objectStoreName);
        } else {
          console.log('Object store already exists:', objectStoreName);
        }
      };

 }

 async function Storereadonly(id){//使用数据库
   return new Promise((resolve, reject) => {
     const request = indexedDB.open(dbName, dbVersion);
    request.onerror = function(event) {
    console.error('Failed to open database:', event.target.error);
    };
     request.onerror = function(event) {
              reject(event.target.error);
     };
     request.onupgradeneeded = function(event) {
                const db = event.target.result;
                // 判断对象存储是否存在
                if (!db.objectStoreNames.contains(objectStoreName)) {
                  // 如果对象存储不存在，则创建它
                  const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id' });
                  console.log('Object store created:', objectStoreName);
                } else {
                  console.log('Object store already exists:', objectStoreName);
                }
     };
        
     request.onsuccess = function(event) {
                const db = event.target.result;
                const dbreadonly = db.transaction([`${objectStoreName}`], 'readonly');
                objectStorereadonly = dbreadonly.objectStore(`${objectStoreName}`);
               const req =objectStorereadonly.get(id)
               req.onsuccess = function(event) {
                const data = event.target.result;
                resolve(data);
              };
       };
     

});
}
async function Storedelete(id){//使用数据库
     const request = indexedDB.open(dbName, dbVersion);
    request.onerror = function(event) {
    console.error('Failed to open database:', event.target.error);
    };
     request.onerror = function(event) {
              reject(event.target.error);
     };
     request.onupgradeneeded = function(event) {
                const db = event.target.result;
                // 判断对象存储是否存在
                if (!db.objectStoreNames.contains(objectStoreName)) {
                  // 如果对象存储不存在，则创建它
                  const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id' });
                  console.log('Object store created:', objectStoreName);
                } else {
                  console.log('Object store already exists:', objectStoreName);
                }
     };
        
      request.onsuccess = function(event) {
                const dbreadonly = db.transaction([`${objectStoreName}`], 'readwrite');
                const readwrite = dbreadonly.objectStore(`${objectStoreName}`);
                readwrite.delete(id);
       };  

}

    // 定义默认设置
    const defaultSettings = {
        scriptEnabled:false,
        mode: 'free',
        cache: "1",
        sdUrl: 'http://localhost:7860',
        novelaiApi: '000000',
        startTag: 'image',
        endTag: '}',
        fixedPrompt: '',
        nai3Scale: '10',
        sdCfgScale: '7',
        sm:false,
        cfg_rescale:'0.18',
        UCP:'bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap',
        AQT:'best quality, amazing quality, very aesthetic, absurdres',
        steps: '28',
        width: '1024',
        height: '1024',
        seed: '0',
        restoreFaces: 'false',
        samplerName: 'DPM++ 2M',
        sampler:"k_euler",
        negativePrompt: ''
    };
    let settings = {};
    for (const [key, defaultValue] of Object.entries(defaultSettings)) {

        settings[key] = GM_getValue(key, defaultValue);
        if(key=="startTag"){//更新截取方式
            if(settings[key]=="image:{"||settings[key]=="image：{"){

                settings[key]="image";

            }

        }

       if(key=="negativePrompt"){//更新提示词
            if(settings[key]=="bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap"){

                settings[key]="";

            }

        }

         if(key=="fixedPrompt"){//更新提示词
            if(settings[key]=="best quality, amazing quality, very aesthetic, absurdres"){

                settings[key]="";

            }

        }

        // 如果没有读取到值，就使用默认值并保存
        if (settings[key] === defaultValue) {
            GM_setValue(key, defaultValue);
        }
    }
    function addNewElement() {
        const targetElement = document.querySelector('#option_toggle_AN');
        if (targetElement) {
            clearInterval(ster);
            const newElement = document.createElement('a');
            newElement.id = 'option_toggle_AN2';

            const icon = document.createElement('i');
            icon.className = 'fa-lg fa-solid fa-note-sticky';
            newElement.appendChild(icon);

            const span = document.createElement('span');
            span.setAttribute('data-i18n', "打开设置");
            span.textContent = '打开文生图设置';
            newElement.appendChild(span);
            // return  true; // 表示操作成功完成
            targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
            console.log("New element added successfully");
            document.getElementById('option_toggle_AN2').addEventListener('click', showSettingsPanel);
       }
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'settings-panel';
        panel.style.position = 'absolute';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.backgroundColor = 'black';  // 设置背景为黑色
        panel.style.color = 'white';// 设置字体为白色
        panel.style.padding = '20px';
        panel.style.border = '1px solid white';// 设置边框为白色
        panel.style.zIndex = '10000';
        panel.style.display = 'none';
        panel.style.overflowY = 'auto';
        panel.style.maxHeight = '80vh';
        panel.innerHTML += `
  <style>
    #settings-panel input, #settings-panel select {
      background-color: #444;
      color: white;
      background-color: black;
      border: none;
      padding: 5px;
      margin: 5px 0;
    }
    #settings-panel button {
      background-color: #444;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
    }
    #settings-panel button:hover {
      background-color: #555;
    }
  </style>
`;

        panel.innerHTML = `
    <h2>设置面板</h2>
        <label class="switch">
      <input type="checkbox" id="scriptToggle" ${settings.scriptEnabled ? 'checked' : ''}>
      <span class="slider"></span>
    </label>
    <label for="scriptToggle" style="display: inline-block; margin-left: 10px;">启用脚本</label>
    <br><br>
    <label>模式：
      <select id="mode">
        <option value="sd" ${settings.mode === 'sd' ? 'selected' : ''}>SD</option>
        <option value="novelai" ${settings.mode === 'novelai' ? 'selected' : ''}>NovelAI</option>
        <option value="free" ${settings.mode === 'free' ? 'selected' : ''}>Free</option>
      </select>
    </label><br>
    <label>缓存：
      <select id="cache">
        <option value="0" ${settings.cache === '0' ? 'selected' : ''}>不缓存</option>
        <option value="1" ${settings.cache === '1' ? 'selected' : ''}>缓存一天</option>
        <option value="7" ${settings.cache === '7' ? 'selected' : ''}>缓存一星期</option>
        <option value="30" ${settings.cache === '30' ? 'selected' : ''}>缓存一个月</option>
        <option value="365" ${settings.cache === '365' ? 'selected' : ''}>缓存一年</option>
      </select>
    </label><br>

    <label>SD URL：<input type="text" id="sdUrl" value="${settings.sdUrl}"></label><br>
    <label>NovelAI API：<input type="text" id="novelaiApi" value="${settings.novelaiApi}"></label><br>
    <label>开始标记：<input type="text" id="startTag" value="${settings.startTag}"></label><br>
    <label>结束标记：<input type="text" id="endTag" value="${settings.endTag}"></label><br>
    <label>固定正面prompt：<input type="text" id="fixedPrompt" value="${settings.fixedPrompt}"></label><br>
    <label>NAI3关键词关联性Prompt Guidance：<input type="number" id="nai3Scale" value="${settings.nai3Scale}"></label><br>
    <label>NAI3关键词重调Prompt Guidance Rescale：<input type="number" id="cfg_rescale" value="${settings.cfg_rescale}"></label><br>
    <label>SD关键词关联性cfg_scale：<input type="number" id="sdCfgScale" value="${settings.sdCfgScale}"></label><br>
    <label>生成步数steps：<input type="number" id="steps" value="${settings.steps}"></label><br>
    <label>宽度width：<input type="number" id="width" value="${settings.width}"></label><br>
    <label>高度height：<input type="number" id="height" value="${settings.height}"></label><br>
    <label>生成种子seed：<input type="number" id="seed" value="${settings.seed}"></label><br>
    <label>SD面部修复restore_faces：
      <select id="restoreFaces">
        <option value="true" ${settings.restoreFaces === 'true' ? 'selected' : ''}>True</option>
        <option value="false" ${settings.restoreFaces === 'false' ? 'selected' : ''}>False</option>
      </select>
    </label><br>
    <label>SD采样方式sampler_name：<input type="text" id="samplerName" value="${settings.samplerName}"></label><br>
    <label>nai3采样方式：
    <select id="sampler">
        <option value="k_euler" ${settings.sampler === 'k_euler' ? 'selected' : ''}>k_euler</option>
        <option value="k_dpm_2" ${settings.sampler === 'k_dpm_2' ? 'selected' : ''}>k_dpm_2</option>
        <option value="ddim_v3" ${settings.sampler === 'ddim_v3' ? 'selected' : ''}>ddim_v3</option>
        <option value="k_dpmpp_2s_ancestral" ${settings.sampler === 'k_dpmpp_2s_ancestral' ? 'selected' : ''}>k_dpmpp_2s_ancestral</option>
        <option value="k_dpmpp_2m" ${settings.sampler === 'k_dpmpp_2m' ? 'selected' : ''}>k_dpmpp_2m</option>
      </select>
    </label><br>
            <label>nai3sm：
      <select id="sm">
        <option value="true" ${settings.sm === 'true' ? 'selected' : ''}>True</option>
        <option value="false" ${settings.sm === 'false' ? 'selected' : ''}>False</option>
      </select>
    </label><br>
          <label>正面预设：
      <select id="AQT">
        <option value="best quality, amazing quality, very aesthetic, absurdres" ${settings.AQT === 'best quality, amazing quality, very aesthetic, absurdres' ? 'selected' : ''}>True</option>
        <option value="" ${settings.AQT === '' ? 'selected' : ''}>False</option>
      </select>
    </label><br>
      <label>负面预设：
      <select id="UCP">
       <option value="" ${settings.UCP === '' ? 'selected' : ''}>无</option>
        <option value="lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]" ${settings.UCP === 'lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]' ? 'selected' : ''}>Heavy</option>
        <option value="lowres, jpeg artifacts, worst quality, watermark, blurry, very displeasing" ${settings.UCP === 'lowres, jpeg artifacts, worst quality, watermark, blurry, very displeasing' ? 'selected' : ''}>Light</option>
        <option value="lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract], bad anatomy, bad hands, @_@, mismatched pupils, heart-shaped pupils, glowing eyes" ${settings.UCP === 'lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract], bad anatomy, bad hands, @_@, mismatched pupils, heart-shaped pupils, glowing eyes' ? 'selected' : ''}>Human Focus</option>
        <option value="bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap" ${settings.UCP === 'bad proportions, out of focus, username, text, bad anatomy, lowres, worstquality, watermark, cropped, bad body, deformed, mutated, disfigured, poorly drawn face, malformed hands, extra arms, extra limb, missing limb, too many fingers, extra legs, bad feet, missing fingers, fused fingers, acnes, floating limbs, disconnected limbs, long neck, long body, mutation, ugly, blurry, low quality, sketches, normal quality, monochrome, grayscale, signature, logo, jpeg artifacts, unfinished, displeasing, chromatic aberration, extra digits, artistic error, scan, abstract, photo, realism, screencap' ? 'selected' : ''}>作者预设</option>
     </select>
    </label><br>
    <label>负面提示词：<input type="text" id="negativePrompt" value="${settings.negativePrompt}"></label><br>
    <button id="Clear-Cache">清除图片缓存</button><br>
    <button id="save-settings">保存设置</button>
    <button id="close-settings">关闭</button>
    <a id="visit-website-link" href="https://asgdd1kjanhq.sg.larksuite.com/wiki/MqOIw9n3qisWc9kXNhdlkoKCguu?from=from_copylink" target="_blank">帮助</a>
    <a id="visit-website-link" href="https://discord.com/channels/1134557553011998840/1215675312721887272/1215675312721887272" target="_blank">dc讨论</a>
    <a id="visit-website-link">BY从前我跟你一样</a>
  `;
        const style = document.createElement('style');
        style.textContent = `
    #settings-panel input, #settings-panel select {
      background-color: #444;
      color: white;
      background-color: black;
      border: none;
      padding: 5px;
      margin: 5px 0;
    }
    #settings-panel button {
      background-color: #444;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
    }
    #settings-panel button:hover {
      background-color: #555;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 34px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    input:checked + .slider {
      background-color: #2196F3;
    }
    input:checked + .slider:before {
      transform: translateX(26px);
    }
  `;

        document.body.appendChild(panel);
        document.head.appendChild(style);
        document.getElementById('save-settings').addEventListener('click', saveSettings);
        document.getElementById('close-settings').addEventListener('click', closeSettings);
        document.getElementById('Clear-Cache').addEventListener('click', clearCache);
        // 添加滑块切换事件监听器
        document.getElementById('scriptToggle').addEventListener('change', function() {
            settings.scriptEnabled = this.checked;
            GM_setValue('scriptEnabled', this.checked);
            console.log('Script ' + (this.checked ? 'enabled' : 'disabled'));
        });
        return panel;
    }

    function clearCache() {
     GM_deleteValue("图片");

    if(imagesid!=""){
            for (let [key, value] of Object.entries(imagesid)) {

                GM_deleteValue(key);


            }
            imagesid={};
            GM_deleteValue("图片属性");
      }
      alert("已清除图片缓存");

    }

    function saveSettings() {
        for (const key of Object.keys(defaultSettings)) {
            const element = document.getElementById(key);
            if (element) {

                if(key=="sdUrl"){

                   if(element.value !== settings[key]){
                       if(!confirm("你修改了url,请确认是否为http://192.168.10.2:7860 这种http://+ip/网址+端口的模式，确认？如果不清楚请刷新网页恢复默认！")){
                          return;
                       }
                      // return false;

                   }

                   }
                if(key=="samplerName"){

                       if(element.value !== settings[key]){
                       if(!confirm("你修改了sd的采样方式，请注意输入是否正确，确认？如果不清楚请点取消刷新网页恢复默认！")){
                          return;
                       }
                      // return false;

                   }

                }
                if(key=="steps"){

                       if((element.value !== settings[key])&&(Number(element.value)>28)&&(settings["mode"]=="novelai")){
                       if(!confirm("你修改了nai3的步数并且大于28，大于28将会收费，确认？如果不清楚请点取消刷新网页恢复默认！")){
                          return;
                       }
                      // return false;

                   }

                }
               if(key=="height"||key=="width"){

                       if(element.value !== settings[key]&&(Number(element.value)>1024)&&(settings["mode"]=="novelai")||key=="width"&&Number(element.value)>1024&&settings["mode"]=="novelai"){
                       if(!confirm("你修改了nai3的宽高并且大于1024，大于1024将会收费，确认？如果不清楚请点取消刷新网页恢复默认！")){
                          return;
                       }
                      // return false;

                   }

                }

                settings[key] = element.value;
                GM_setValue(key, element.value);
            }
        }
        console.log('Settings saved');
        hideSettingsPanel();
    }
    function closeSettings() {
        hideSettingsPanel();
    }




    function showSettingsPanel() {
        for (const key of Object.keys(defaultSettings)) {
            const element = document.getElementById(key);
            if (element) {
                settings[key] = element.value;
                GM_setValue(key, element.value);
            }
        }
        console.log('Settings saved:', settings);
        const panel = document.getElementById('settings-panel');
        if (!panel) {
            createSettingsPanel();
        }
        document.getElementById('settings-panel').style.display = 'block';
    }

    function hideSettingsPanel() {
        document.getElementById('settings-panel').style.display = 'none';
    }


    function unzipFile(arrayBuffer) {
        return new Promise((resolve, reject) => {
            JSZip.loadAsync(arrayBuffer)
                .then(function(zip) {
                console.log("ZIP 文件加载成功");

                // 遍历 ZIP 文件中的所有文件
                zip.forEach(function (relativePath, zipEntry) {
                    console.log("文件名:", zipEntry.name);

                    // // 解压每个文件
                    // zipEntry.async('blob').then(function(blob) {
                    //     console.log("文件大小:", blob.size);
                    //     // 处理解压后的文件内容

                    //     resolve(blob);
                    // });
                    zipEntry.async('base64').then(function(base64String) {
                        console.log("文件大小:", base64String.size);
                        resolve(base64String);
                    });
                });
            }).catch(reject);
        }) }
    function extractPrompt(str, start, end) {
        // const startIndex = str.indexOf(start);
        // if (startIndex === -1) return str; // 如果没有找到开始标记,返回原字符串

        // const endIndex = str.lastIndexOf(end);
        // if (endIndex === -1 || endIndex <= startIndex) return str; // 如果没有找到结束标记或结束标记在开始标记之前,返回原字符串

        // return str.slice(startIndex + start.length, endIndex);
        return str.replace(":", '').replace("：", '').replace("{", '').replace("}", '');
    }



    async function replaceWithnovelai() {
        if(!settings.scriptEnabled){
            return;
        }
        if(checkSendBuClass()){
            return;
        }
        unsafeWindow.模式=settings.mode; //sd  novelai  free  使用sd 或novelai 或 免费的  novelai需要获取api    sd启动器需要启用api功能。例如绘世启动器中 的高级选项  启用api选择开启。
        unsafeWindow.start=settings.startTag;//检测ai输出的提示词以什么开头  会被去除；可以自定义。
        unsafeWindow.end=settings.endTag;///检测ai输出的提示词以什么结尾，不去除，可以自定义。提示词会采用两者之间的文字。
        // 以下为novelai的设置  注意更改脚本设置 需要刷新网页。
        var ps = document.getElementsByClassName("mes_text");
        for (var i = 0; i < ps.length; i++) {
            var p = ps[i];
            var linkText = p.textContent;
            var regex = new RegExp(`${unsafeWindow.start}(.*?)${unsafeWindow.end}`);
            var matches = linkText.match(regex);
            if(matches){
                var targetText = matches[1];
                var link = extractPrompt(targetText,unsafeWindow.start,unsafeWindow.end);
                //alert(targetText)
                const button = document.createElement('button');
                var uniqueId = "button_image" + Math.random().toString(36).substr(2, 9);
                button.id = uniqueId;
                button.textContent = '生成图片';
                button.dataset.link = link;
                const imgSpan = document.createElement('span');
                imgSpan.id="span_" + Math.random().toString(36).substr(2, 9);
                button.name=imgSpan.id;
                let  re=new RegExp(`${unsafeWindow.start}(.*?)${unsafeWindow.end}`);
                let Text=p.innerHTML.match(re)[0];
                console.log("Text",p.innerHTML.match(re));

                p.innerHTML = p.innerHTML.replace(Text, button.outerHTML);
                // alert(targetText);
                // 重新找到新创建的按钮
                var newbutton = document.getElementById(uniqueId);
                if(!p.hasclik){
                p.hasclik=true;
                p.addEventListener('click', async function(event) {
                      if (event.target.tagName === 'BUTTON') {
                          // 获取按钮的id
                      }else{

                      return;
                      }

                     var button1=event.target;
                     if(!button1.id.includes("image")){
                      return;
                     }


                    let access_token = settings.novelaiApi//填写你的novelai的apikey，在官方网站的设置  Account 里 Get Persistent API Token
                    button1.textContent="加载中";
                    let model = "nai-diffusion-3"//使用的模型  多个选  择 "safe-diffusion"   "nai-diffusion"   "nai-diffusion-furry"  "furry-diffusion-inpainting" "nai-diffusion-2"  "nai-diffusion-3-inpainting"  "nai-diffusion-furry-3-inpainting"

                    let prompt=await zhengmian(settings.fixedPrompt,button1.dataset.link,settings.AQT);                    //固定正面提示词
                    let  negative_prompt=await fumian(settings.negativePrompt,settings.UCP);
                    let preset_data = {"params_version":1,
                                       "width":settings.width,
                           "height":settings.height,
                           "scale":settings.nai3Scale,//提示词关联性
                           "sampler":settings.sampler, //"k_euler",//使用的采样器   "k_dpm_2"   "k_dpmpp_2m"    "ddim_v3"  "k_dpmpp_2s_ancestral"
                           "steps":settings.steps,//生成的步数
                           "n_samples":1,
                           "ucPreset":1,//预设
                           "qualityToggle":true,
                           "sm":settings.sm,
                           "sm_dyn":false,
                           "dynamic_thresholding":false,
                           "controlnet_strength":1,
                           "legacy":false,
                           "add_original_image":true,
                           "cfg_rescale":settings.cfg_rescale,//关联性调整
                           "noise_schedule":"native",
                           "legacy_v3_extend":false,
                           "seed": settings.seed === "0"||settings.seed === "" ? 0 : settings.seed,//生成的种子，下面是固定的负面提示词
                           "negative_prompt":negative_prompt,
                           "reference_image_multiple":[],
                           "reference_information_extracted_multiple":[],
                           "reference_strength_multiple":[]}
                    const payload = preset_data;
                    const urlObj = new URL("https://api.novelai.net/ai/generate-image");
                    const Authorization="Bearer "+access_token;
                    const data11 = {
                        "input": prompt,//+
                        "model": "nai-diffusion-3",
                        "action": "generate",
                        "parameters": preset_data
                    }
                    let abc=true;
                   while(abc){
                    if(xiancheng){
                        abc=false;
                    }else{

                       await sleep(1000);
                    }
                    
                    };

                    try {
                        xiancheng=false;
                        const response = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: urlObj,
                                data: JSON.stringify(data11),
                                responseType: "arraybuffer",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization":Authorization
                                },
                                onload: function(response) {
                                    if (response.status >= 200 && response.status < 400) {
                                        resolve(response);
                                        button1.textContent="生成图片";
                                        //alert("以成功返回"+response.status);
                                    } else {
                                        button1.textContent="生成图片";
                                        if(response.status==400){
                                            alert("验证错误");
                                        }
                                        if(response.status==401){
                                            alert("api错误请检测api是否正确");
                                        }
                                        if(response.status==402){
                                            alert("需要有效订阅才能访问此端点。");
                                        }
                                        if(response.status==409){
                                            alert("发生冲突错误");
                                        }
                                        if(response.status==500){
                                            alert("未知错误");
                                        }
                                        if(response.status==429){
                                            alert("请求过多");
                                        }
                                        //alert("响应内容:", response.responseText);
                                        reject(new Error(`请求失败,状态码: ${response.status}`));
                                    }
                                },
                                onerror: function(error,response) {
                                     button1.textContent="生成图片";
                                    alert("请求错误，请检查代理");
                                    reject(error);
                                }
                            });
                        });
                        const data123 = await response.response;
                        let re= await unzipFile(data123);
                        let imageUrl="data:image/png;base64," + re;
                        xiancheng=true;
                       await setItemImg(button.dataset.link,imageUrl);
                        // let blob = new Blob([re], { type: 'image/png' });
                        // let imageUrl = URL.createObjectURL(blob);

                        button1.textContent="生成图片";
                        let imgSpan = document.getElementById(button1.name);
                        const img2 = document.createElement('img');
                        img2.src=imageUrl;
                        img2.alt = "Generated Image2";
                        imgSpan.innerHTML = '';
                        imgSpan.appendChild(img2);

                    } catch (error) {
                        button1.textContent="生成图片";
                        console.error('Error generating image:', error);
                    }
                });}
                console.log('imgSpan',imgSpan);

                newbutton.parentNode.insertBefore(imgSpan, newbutton.nextSibling);

                let loadimg=await getItemImg(link)
                console.log('loadimg',loadimg);
                if(loadimg){
                    const dataURL = loadimg;
                    let imgSpan = document.getElementById(button.name);
                    const img = document.createElement('img');
                    img.src = dataURL;
                    img.alt = "Generated Image";
                    imgSpan.innerHTML = '';
                    imgSpan.appendChild(img);

                }

            }
        }
    }

function checkSendBuClass() {
  const element = document.getElementById('send_but');
  if (element && element.className.includes('displayNone')) {
    return true;
  }
  return false;
}



    async function replaceSpansWithImagesst() {

        if(!settings.scriptEnabled){
            return;
        }
        if(checkSendBuClass()){
            return;
        }
        //以下为sd的设置
        unsafeWindow.start=settings.startTag;
        unsafeWindow.end=settings.endTag;
        unsafeWindow.url = settings.sdUrl;//sd地址 记得要修改上面的connect 的sd域名才能访问 此处要带端口！
        unsafeWindow.prompts = settings.fixedPrompt; //额外固定的提示词 nsfw?    也可以固定你要的 lora 。每次都会加载提示词后面。下面是反向提示词
        unsafeWindow.negative_prompt =settings.negativePrompt
        unsafeWindow.cfg_scale = settings.sdCfgScale;//关键词关联性
        unsafeWindow.width = settings.width; //宽度
        unsafeWindow.height = settings.height;//长度
        unsafeWindow.restore_faces = settings.restoreFaces; //面部修复
        unsafeWindow.steps = settings.steps;//步数
        unsafeWindow.sampler_name=settings.samplerName ; //采样方式
        var ps = document.getElementsByClassName("mes_text");
        for (var i = 0; i < ps.length; i++) {
            var p = ps[i];
            var linkText = p.textContent;
            var regex = new RegExp(`${unsafeWindow.start}(.*?)${unsafeWindow.end}`);
            var matches = linkText.match(regex);
            if(matches){
                var targetText = matches[1];
                var link = extractPrompt(targetText,unsafeWindow.start,unsafeWindow.end);
                const button = document.createElement('button');
                var uniqueId = "button_image" + Math.random().toString(36).substr(2, 9);
                button.id = uniqueId;
                button.textContent = '生成图片';

                const imgSpan = document.createElement('span');
                imgSpan.id="span_" + Math.random().toString(36).substr(2, 9);

                button.name=imgSpan.id;
                button.dataset.link = link;
                let  re=new RegExp(`${unsafeWindow.start}(.*?)${unsafeWindow.end}`);
                let Text=p.innerHTML.match(re)[0];
                console.log("Text",p.innerHTML.match(re));

                p.innerHTML = p.innerHTML.replace(Text, button.outerHTML);
                // alert(targetText);
                // 重新找到新创建的按钮
                var newbutton = document.getElementById(uniqueId);

                newbutton.spanid=imgSpan.id;
                if(!p.hasclik){
                p.hasclik=true;
                p.addEventListener('click', async function(event) {


                    if (event.target.tagName === 'BUTTON') {
                        // 获取按钮的id

                    }else{

                        return;
                    }

                    var button1=event.target;
                    if(!button1.id.includes("image")){
                        return;
                    }

                    const url = unsafeWindow.url;
                    button1.textContent="加载中";
                    let prompt=await zhengmian(settings.fixedPrompt,button1.dataset.link,settings.AQT);                    //固定正面提示词
                    let  negative_prompt=await fumian(settings.negativePrompt,settings.UCP);


                    const payload = {
                        "prompt": prompt,
                        "negative_prompt": negative_prompt,
                        "steps": unsafeWindow.steps,
                        "sampler_name": unsafeWindow.sampler_name,
                        "width": unsafeWindow.width,
                        "height": unsafeWindow.height,
                        "restore_faces": unsafeWindow.restore_faces,
                        "cfg_scale":unsafeWindow.cfg_scale,
                        "seed":settings.seed === 0||settings.seed === "0"||settings.seed === "" ? -1 : settings.seed
                    };

                    console.log("payload",payload);
                    //alert(payload.prompt);
                    const urlObj = new URL(url+"/sdapi/v1/txt2img");
                    try {
                        const response = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: urlObj,
                                data: JSON.stringify(payload),
                                headers: {
                                    "Content-Type": "application/json",

                                    "Access-Control-Allow-Origin": "*"
                                },
                                onload: function(response) {
                                    if (response.status >= 200 && response.status < 400) {
                                        button1.textContent="生成图片";
                                        resolve(response);
                                    } else {
                                        button1.textContent="生成图片";
                                        alert("响应内容:", "sd返回错误可能是你输入参数有误");
                                        reject(new Error(`请求失败,状态码: ${response.status}`));

                                    }
                                },
                                onerror: function(error,response) {

                                     var newbutton1 = document.getElementById(uniqueId);
                                     button1.textContent="生成图片";
                                    alert("请求错误。请检测地址是否正确.或sd已正确开启，sd启动器需要启用api功能。例如绘世启动器中 的高级选项  启用api选择开启。并且启动器需要重启生效");
                                    reject(error);
                                }
                            });
                        });

                        const r = JSON.parse(response.responseText);

                        for (let i of r['images']) {
                            const png_payload = {
                                "image": "data:image/png;base64," + i
                            };

                            const response2 = await new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: "POST",
                                    url: `${url}/sdapi/v1/png-info`,
                                    data: JSON.stringify(png_payload),
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    onload: resolve,
                                    onerror: reject
                                });
                            });
                            button1.textContent="生成图片";
                            const pngInfo = JSON.parse(response2.responseText).info;
                            const dataURL = "data:image/png;base64," + i;

                            await setItemImg(button1.dataset.link,dataURL);
                            //let imgSpan = button1.nextElementSibling;
                            let imgSpan = document.getElementById(button1.name);
                            const img = document.createElement('img');

                            img.src = dataURL;
                            img.alt = "Generated Image";
                            img.dataset.parameters = pngInfo;

                            imgSpan.innerHTML = '';
                            imgSpan.appendChild(img);

                        }
                    } catch (error) {
                        console.error('Error generating image:', error);
                    }
                });
                }
                //   p.parentNode.replaceChild(button, span);


                newbutton.parentNode.insertBefore(imgSpan, newbutton.nextSibling);

                let loadimg=await getItemImg(link)
                console.log('loadimg',loadimg);
                if(loadimg){
                    const dataURL = loadimg;
                    let imgSpan = document.getElementById(button.name);
                    const img = document.createElement('img');
                    img.src = dataURL;
                    img.alt = "Generated Image";
                    imgSpan.innerHTML = '';
                    imgSpan.appendChild(img);

                }

            }
        }
    }

    async function replaceSpansWithImagesfree() {
        if(!settings.scriptEnabled){
            return;
        }
        if(checkSendBuClass()){
            return;
        }
        unsafeWindow.start=settings.startTag;
        unsafeWindow.end=settings.endTag;
        unsafeWindow.url = settings.sdUrl;//sd地址 记得要修改上面的connect 的sd域名才能访问 此处要带端口！
        unsafeWindow.prompts = settings.fixedPrompt; //额外固定的提示词 nsfw?    也可以固定你要的 lora 。每次都会加载提示词后面。下面是反向提示词
        unsafeWindow.negative_prompt =settings.negativePrompt
        unsafeWindow.cfg_scale = settings.sdCfgScale;//关键词关联性
        unsafeWindow.width = settings.width; //宽度
        unsafeWindow.height = settings.height;//长度
        unsafeWindow.restore_faces = settings.restoreFaces; //面部修复
        unsafeWindow.steps = settings.steps;//步数
        unsafeWindow.sampler_name=settings.samplerName ; //采样方式
        var ps = document.getElementsByClassName("mes_text");
        for (var i = 0; i < ps.length; i++) {
            var p = ps[i];
            var linkText = p.textContent;
            var regex = new RegExp(`${unsafeWindow.start}(.*?)${unsafeWindow.end}`);
            var matches = linkText.match(regex);
            if(matches){
                var targetText = matches[0];
                var link =  extractPrompt(targetText,unsafeWindow.start,unsafeWindow.end);
                const button = document.createElement('button');
                var uniqueId = "button_image" + Math.random().toString(36).substr(2, 9);
                button.id = uniqueId;
                button.textContent = '生成图片';
                 const imgSpan = document.createElement('span');
                imgSpan.id="span_" + Math.random().toString(36).substr(2, 9);

                button.name=imgSpan.id;

                button.dataset.link = link;
                let  re=new RegExp(`${unsafeWindow.start}(.*?)${unsafeWindow.end}`);
                let Text=p.innerHTML.match(re)[0];
                console.log("Text",p.innerHTML.match(re));

                p.innerHTML = p.innerHTML.replace(Text, button.outerHTML);
                // alert(targetText);
                // 重新找到新创建的按钮
                var newbutton = document.getElementById(uniqueId);
                if(!p.hasclik){
                p.hasclik=true;
                p.addEventListener('click', async function() {
                          if (event.target.tagName === 'BUTTON') {
                          // 获取按钮的id

                      }else{

                      return;
                      }

                    var button1=event.target;
                    if(!button1.id.includes("image")){
                        return;
                    }
                    var ran = Math.floor(Math.random() * 10000).toString();
                   //固定正面提示词

                    const prompt = ran+zhengmian(settings.fixedPrompt,button1.dataset.link,settings.AQT);
                    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
                    const img = document.createElement('img');

                    img.src = url;
                    img.alt = "Generated Image";
                    let imgSpan = document.getElementById(button1.name);
                    imgSpan.innerHTML = '';
                    imgSpan.appendChild(img);

                });}

                newbutton.parentNode.insertBefore(imgSpan, newbutton.nextSibling);

                let loadimg=getItemImg(link)
                console.log('loadimg',loadimg);
                if(loadimg){
                    let blob = new Blob([loadimg], { type: 'image/png' });
                    let imageUrl = URL.createObjectURL(blob);
                    let imgSpan = document.getElementById(button.name);
                    const img2 = document.createElement('img');
                    img2.src=imageUrl;
                    img2.alt = "Generated Image2";
                    imgSpan.innerHTML = '';
                    imgSpan.appendChild(img2);
                }
            }
        }
    }

  async function chenk(){
        if(settings.mode=="sd"){
        replaceSpansWithImagesst();
    }else if(settings.mode=="novelai"){
        replaceWithnovelai();
    }else{
        replaceSpansWithImagesfree();
    }
    }

    setInterval(chenk, 2000);


 async function setItemImg(tag,img){
       let md5=CryptoJS.MD5(tag).toString();
       if(imagesid==""){

        imagesid={};

       }

      let  time=new Date().getTime();
    //   console.log("md5",md5);
    //   console.log("time",time);
    //   console.log("img",img);

      console.log("imagesid",imagesid);
      imagesid[md5]=[time];
      //console.log("imagesmd5",images[md5]);
    const data = { id: `${md5}`, tupian: `${img}` };
    const data2 = { id: "tupianshuju", shuju: `${JSON.stringify(imagesid)}` };
    Storereadwrite(data);
    Storereadwrite(data2);

      //  GM_setValue("图片",JSON.stringify(images));

    };
 async function getItemImg(tag){

        let md5=CryptoJS.MD5(tag).toString();
        if(imagesid==""){//载入图片数据
        let image;
        image=GM_getValue("图片数据","无");
        let imageid=await Storereadonly("tupianshuju");

        console.log("imageid",imageid);
        // console.log("image",image);
        // console.log("imageid",imageid);
        if(image==""&&!imageid){
            return false;
        }
        console.log("image",image);
       
        if(image!="无"){//转移旧数据
            let json=JSON.parse(image);
            alert("数据转移");

            for (let [key, value] of Object.entries(json)) {

                if(await delDate(value)){

                 Reflect.deleteProperty(json, key);
                GM_deleteValue(key);

                }

            }
            imagesid={};
            for (let [key, value] of Object.entries(json)) {
                console.log(key + ': ' + value);
                    imagesid[key]=value;
                   let tupian= GM_getValue(key,"");
                    const data={ id: `${key}`, tupian: `${tupian}` }
                    await Storereadwrite(data);
              }

           // GM_setValue("图片数据",JSON.stringify(imagesid));
            const data = { id: "tupianshuju", shuju: `${JSON.stringify(imagesid)}` };
            await Storereadwrite(data);

            GM_deleteValue("图片数据");
            console.log("imagesid",imagesid);
        }else{
            imagesid={};
            imagesid=JSON.parse(imageid.shuju);
    }
    for (let [key, value] of Object.entries(imagesid)) {

        if(await delDate(value)){

         Reflect.deleteProperty(imagesid, key);
         await Storedelete(key);

        }

        }


    }
    console.log("md5",md5);
    if(imagesid.hasOwnProperty(md5)){
            console.log("存在！");
            let image=await Storereadonly(md5);
            console.log("image",image);
            return  image.tupian;

        }

        return false;
   };


  async function delDate(tagdate){

            // 获取当前日期
            const currentDate = new Date();

            // 计算当前日期和目标日期之间的差值 (以毫秒为单位)
            const timeDiff = currentDate.getTime() - Number(tagdate);

            // 将毫秒转换为天数
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            // 判断是否超过缓存时间
            if (daysDiff > Number(settings.cache)) {
               return true;
            } else {
               return false;
            }

   }
  async function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
 async function zhengmian(text,prom,AQT) {

     if(text==''){

        return  prom+", "+AQT;
     }else{

        return  text+", "+prom+", "+AQT;
     }

  }
 async  function fumian(text,UCP){

    if(text==""){

        return UCP;
        

    }else{

       return  UCP+", "+text;
    }

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



})();