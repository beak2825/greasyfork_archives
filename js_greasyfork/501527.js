// ==UserScript==
// @name         通用酒馆rpg插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license GPL
// @description  配合酒馆游玩
// @author       从前跟你一样
// @grant        unsafeWindow
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      vagrantup.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      sd则此处换成你的电脑域名ip、不需要带端口。
// @connect       *
// @connect      192.168.10.2
// @connect      127.0.0.1
// @connect      novelai.net
// @match        *://*/*
// @description  Save user settings
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/501527/%E9%80%9A%E7%94%A8%E9%85%92%E9%A6%86rpg%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/501527/%E9%80%9A%E7%94%A8%E9%85%92%E9%A6%86rpg%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let rpgster="";

    // 添加点击事件监听器到您的按钮或元素上
    $(document).ready(function() {
        rpgster= setInterval(addNewElement, 2000);
    });
    // 定义默认设置
    const defaultSettings = {
        say:"测试",
        key:"测试"
    };
    let settings = {};
    for (const [key, defaultValue] of Object.entries(defaultSettings)) {
        settings[key] = GM_getValue(key, defaultValue);
        // 如果没有读取到值，就使用默认值并保存
        if (settings[key] === defaultValue) {
            GM_setValue(key, defaultValue);
        }
    }
    function addNewElement() {
        const targetElement = document.querySelector('#option_toggle_AN');
        if (targetElement) {
            clearInterval(rpgster);
            const newElement = document.createElement('a');
            newElement.id = 'option_toggle_AN3';

            const icon = document.createElement('i');
            icon.className = 'fa-lg fa-solid fa-note-sticky';
            newElement.appendChild(icon);

            const span = document.createElement('span');
            span.setAttribute('data-i18n', "打开设置");
            span.textContent = '打开rpg工具';
            newElement.appendChild(span);
            // return  true; // 表示操作成功完成

            targetElement.parentNode.insertBefore(newElement, targetElement.nextSibling);
            console.log("New element added successfully");
            document.getElementById('option_toggle_AN3').addEventListener('click', showSettingsPanel);
        }
    }

    function createrpgSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'rpgsettings-panel';
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
    #rpgsettings-panel input, #settings-panel select {
      background-color: #444;
      color: white;
      background-color: black;
      border: none;
      padding: 5px;
      margin: 5px 0;
    }
    #rpgsettings-panel button {
      background-color: #444;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
    }
    #rpgsettings-panel button:hover {
      background-color: #555;
    }
  </style>
`;
        panel.innerHTML = `
    <h2>设置面板</h2>

    <br><br>
    <label>说明：<input type="text" id="say" value="${settings.say}"></label><br>
    <label>秘钥：<input type="text" id="key" value="${settings.key}"></label><br>
     <button id="save-AESEword">加密世界书</button>
     <button id="save-AESDword">解密世界书</button><br>
     <button id="save-AESErole">加密角色栏</button>
     <button id="save-AESDrole">解密角色栏</button><br>
    <button id="close-rpgsettings">关闭</button>
    <a id="visit-website-link" href="https://asgdd1kjanhq.sg.larksuite.com/wiki/I5e5wz7BDiVouJk5DQBlDwcJgAg?from=from_copylink" target="_blank">帮助</a>
    <a id="visit-website-link" href="https://discord.com/channels/1134557553011998840/1264813484437409813/1264813484437409813" target="_blank">dc讨论</a>
    <a id="visit-website-link">BY从前我跟你一样</a>
  `;
        const style = document.createElement('style');
        style.textContent = `
   #rpgsettings-panel input {
    background-color: black !important;
    color: white;
    border: none;
    padding: 5px;
    margin: 5px 0;
  }
   #rpgsettings-panel input, #settings-panel select {
      background-color: #444;
      color: white;
      background-color: black;
      border: none;
      padding: 5px;
      margin: 5px 0;
    }
    #rpgsettings-panel button {
      background-color: #444;
      color: white;
      border: none;
      padding: 5px 10px;
      cursor: pointer;
    }
    #rpgsettings-panel button:hover {
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
        document.getElementById('save-AESEword').addEventListener('click', aesEword);
        document.getElementById('save-AESDword').addEventListener('click', aesDword);
        document.getElementById('save-AESErole').addEventListener('click', aesErole);
        document.getElementById('save-AESDrole').addEventListener('click', aesDrole);
        document.getElementById('close-rpgsettings').addEventListener('click', hideSettingsPanel);
        // 添加滑块切换事件监听器
        return panel;
    }

    // 定义加密函数
    function aesEncrypt(plaintext, key, iv) {
        const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

    // 定义解密函数
    function aesDecrypt(ciphertext, key, iv) {
        const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let txt= "";
        try {
            txt=  decrypted.toString(CryptoJS.enc.Utf8);
        } catch (e) {
            throw e;
        }
        return  txt
    }

    const secretIv = '1234567890123456';
    function aesEword() {
        const key = document.getElementById("key");
        let secretKey= key.value
        // 使用 querySelectorAll 查找所有匹配的元素
        const elements = document.querySelectorAll('[data-i18n="[placeholder]What this keyword should mean to the AI, sent verbatim"]');
        // 遍历找到的元素
        let p=false;
        if(!(elements.length > 0)){
            alert("未找到加密文本")
            return;

        }
        elements.forEach(element => {
            // 打印元素的 placeholder 属性值
            if(p){
                return;
            }
            if(element.value==""){
                return;
            }
            if(isEncrypted(removeExplanation(element.value))){
                alert("已经加密")
                p=true;
                return;
            }
            let  aesEtxt ="";
            try {
                aesEtxt = aesEncrypt(element.value, secretKey, secretIv);
            } catch (e) {
                alert("加密出错")
                p=true;
                return ;
            }
            element.value=addExplanation(aesEtxt,document.getElementById("say").value);
            element.dispatchEvent(new Event('input'));
        });
        if(!p){
            saveSettings()
            alert("加密成功")
        }

    }

    function aesErole() {
        const key = document.getElementById("key");
        let secretKey= key.value
        const element2 = document.getElementById("description_textarea");
        const element3 = document.getElementById("firstmessage_textarea");
        // 使用 querySelectorAll 查找所有匹配的元素
        if(!element2||!element3){
            alert("未找到加密文本")
            return;
        }
        if(element2.value !=""){
            if(isEncrypted(removeExplanation(element2.value))){
                alert("已经加密")
            }else{
                let  aesEtxt ="";
                try {
                    aesEtxt = aesEncrypt(element2.value, secretKey, secretIv);
                } catch (e) {
                    alert("加密出错")
                    return ;
                }
                element2.value=addExplanation(aesEtxt,document.getElementById("say").value);
                element2.dispatchEvent(new Event('input'));
            }
        }
        if(element3.value !=""){
            if(isEncrypted(removeExplanation(element3.value))){
                alert("已经加密")
            }else{
                let  aesEtxt ="";
                try {
                    aesEtxt = aesEncrypt(element3.value, secretKey, secretIv);
                } catch (e) {
                    alert("加密出错")
                    return ;
                }
                element3.value=addExplanation(aesEtxt,document.getElementById("say").value);
                element3.dispatchEvent(new Event('input'));
            }
        }

        saveSettings()
        alert("加密成功")
    }
    function aesDword() {
        const txt = document.getElementById("key");
        let secretKey= txt.value
        const elements = document.querySelectorAll('[data-i18n="[placeholder]What this keyword should mean to the AI, sent verbatim"]');
        let p=false;
        if(!(elements.length > 0)){
            alert("未找到加密文本")
            return;
        }
        elements.forEach (element => {
            // 打印元素的 placeholder 属性值

            if(element.value==""){
                return;
            }
            let value= removeExplanation(element.value);
            if(!isEncrypted(value)){
                p=true;
                return;
            }
            try {
                element.value= aesDecrypt(value, secretKey, secretIv);
            } catch (e) {
                if(p){
                    return;
                }
                alert("秘钥错误")
                p=true;
                return ;
            }
            element.dispatchEvent(new Event('input'));
            console.log(element.value);
        });
            alert("解密成功")

    }
    function aesDrole() {
        const key = document.getElementById("key");
        let secretKey= key.value
        const element2 = document.getElementById("description_textarea");
        const element3 = document.getElementById("firstmessage_textarea");
        // 使用 querySelectorAll 查找所有匹配的元素
        if(!element2||!element3){
            alert("未找到解密文本")
            return;
        }
        if(element2.value !=""){
            let value=removeExplanation(element2.value);

            if(!isEncrypted(value)){

            }else{
                let  aesDtxt ="";
                try {
                    aesDtxt = aesDecrypt(value, secretKey, secretIv);
                } catch (e) {
                    alert("秘钥错误")
                    return ;
                }
                element2.value=aesDtxt
                element2.dispatchEvent(new Event('input'));
            }
        }
        if(element3.value !=""){
            let value=removeExplanation(element3.value);
            if(!isEncrypted(value)){

            }else{
                let  aesDtxt ="";
                try {
                    aesDtxt = aesDecrypt(value, secretKey, secretIv);
                } catch (e) {
                    alert("秘钥错误")
                    return ;
                }
                element3.value=aesDtxt
                element3.dispatchEvent(new Event('input'));
            }
        }


        alert("解密成功")
    }

    function isEncrypted(str) {
        // 检查字符串是否只包含 Base64 字符
        const base64Regex = /^[A-Za-z0-9+/=]+$/;
        if (!base64Regex.test(str)) {
            return false;
        }

        // 检查字符串长度是否为 4 的倍数
        if (str.length % 4 !== 0) {
            return false;
        }

        return true;
    }
    function saveSettings() {
        for (const key of Object.keys(defaultSettings)) {
            const element = document.getElementById(key);
            if (element) {
                settings[key] = element.value;
                GM_setValue(key, element.value);
            }
        }
        console.log('rpgSettings saved');
        //  hideSettingsPanel();
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
        const panel = document.getElementById('rpgsettings-panel');
        if (!panel) {
            createrpgSettingsPanel();
        }
        document.getElementById('rpgsettings-panel').style.display = 'block';
    }

    function hideSettingsPanel() {
        document.getElementById('rpgsettings-panel').style.display = 'none';
    }
    // Your code here...

    // 函数1:在字符串中添加<说明>标签
    function addExplanation(str, explanation) {
        return "<说明>" + explanation + "</说明>"+str;
    }

    // 函数2:去除字符串中的<说明>标签及其内容
    function removeExplanation(str) {
        return str.replace(/<说明>.*?<\/说明>/g, "");
    }















})();