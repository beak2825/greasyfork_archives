// ==UserScript==
// @name         zkh防止强制关闭
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  主动点击防止页面强制关闭
// @author       You
// @match        https://*.zkh360.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zkh360.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451036/zkh%E9%98%B2%E6%AD%A2%E5%BC%BA%E5%88%B6%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/451036/zkh%E9%98%B2%E6%AD%A2%E5%BC%BA%E5%88%B6%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function tip(content){
        var tip = document.createElement("div");
        tip.id = "onceTip"
        tip.style = "border: 1px solid rgb(221, 227, 231); border-radius: 14px; z-index: 9999; right: 40%; top: 10%; width: 20%; padding: 12px;/* height: 8%; */ background-color: rgba(99, 143, 180, 0.53); cursor: pointer; text-align: center; font-size: 30px; /* line-height: 40px; */ position: fixed !important;";
        tip.innerText=content
        document.body.appendChild(tip);
        setTimeout(function(){
            document.getElementById('onceTip').hidden = true
        }, 3000)
    }

    function doSomething(){
        window.isCloseHint = true;
        window.addEventListener("beforeunload", function(e) {
            if (window.isCloseHint) {
                var confirmationMessage = "要记得保存！你确定要离开我吗？";
                (e || window.event).returnValue = confirmationMessage; // 兼容 Gecko + IE
                return confirmationMessage; // 兼容 Gecko + Webkit, Safari, Chrome
            }
        });
        tip('防止强制关闭成功')
    }
    const div = document.createElement("div");
    div.id = "tbButton"
    div.style = "border: 1px solid #dde3e7;border-radius: 4px;z-index: 9999;right: 0px;top: 100px;width: 16px;height: 16px;background-color: rgb(99 143 180);position: fixed !important; cursor: pointer;";
    div.title = '关闭二次确认'
    div.onclick=doSomething
    document.body.appendChild(div);

    // Your code here...
})();