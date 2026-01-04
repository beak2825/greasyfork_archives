// ==UserScript==
// @name         百度云快捷转换(海外)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  编码转换(海外)
// @author       You
// @match        https://ysj-paas-tw.ucbj.net/*
// @match        https://oversea.armvm.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480623/%E7%99%BE%E5%BA%A6%E4%BA%91%E5%BF%AB%E6%8D%B7%E8%BD%AC%E6%8D%A2%28%E6%B5%B7%E5%A4%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480623/%E7%99%BE%E5%BA%A6%E4%BA%91%E5%BF%AB%E6%8D%B7%E8%BD%AC%E6%8D%A2%28%E6%B5%B7%E5%A4%96%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function copyToClipboard(value) {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    };

    // 主函数
    var value="";
    setTimeout(function() {
        // 查找 <input> 元素
        var inputElement = document.querySelector('input');
        // 添加 input 事件监听器
        inputElement.addEventListener('input', function(event) {
            // 在 input 事件触发时执行的逻辑
            console.log('Input changed:', event.target.value);
            value=event.target.value
            if(value.length == 7){
                var xhr = new XMLHttpRequest();
                console.log("https://ldq.ldcloud.net/auth/cph/device/info?deviceId=" + value)
                xhr.open("GET","https://ldq.ldcloud.net/auth/cph/device/info?deviceId=" + value,false);
                xhr.onreadystatechange = function() {
                    if (xhr.status === 200 && xhr.readyState === 4) {
                        var res =JSON.parse(xhr.responseText);
                        value=res.data.padCode;
                        copyToClipboard(value);
                        inputElement.value="";
                        inputElement.focus();
                    };
                };
                xhr.send();
            };
            console.log(event.target.value);
        });


    },2000)
    ;
})();
