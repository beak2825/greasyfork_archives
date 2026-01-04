// ==UserScript==
// @name         微信公众号文章（易百教程）代码复制
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  针对微信的通用代码复制
// @author       nobody
// @match        https://mp.weixin.qq.com/**
// @match        https://www.yiibai.com/**
// @match        https://yiibai.com/**
// @match        https://www.ddkk.com/**
// @match        https://ddkk.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469271/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%EF%BC%88%E6%98%93%E7%99%BE%E6%95%99%E7%A8%8B%EF%BC%89%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/469271/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%EF%BC%88%E6%98%93%E7%99%BE%E6%95%99%E7%A8%8B%EF%BC%89%E4%BB%A3%E7%A0%81%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //微信复制脚本
    function copyToClipboard(content) {
        if (window.clipboardData) {
            window.clipboardData.setData('text', content);
        } else {
            (function(content) {
                document.oncopy = function(e) {
                    e.clipboardData.setData('text', content);
                    e.preventDefault();
                    document.oncopy = null;
                };
            })(content);
            document.execCommand('Copy');
        }
    }

    Array.from(document.getElementsByTagName("pre")).forEach(item => {
        item.style.position = "relative";
        let copyButton = document.createElement("span");
        copyButton.style.cssText = 'border-radius: 4px;position:absolute;right:10px;top:10px;cursor:pointer;background-color:#282C34;color:#34C443;';
        copyButton.innerHTML = "复制";
        copyButton.onclick = function() {
            let copyData = "";
            Array.from(item.getElementsByTagName("code")).forEach(code => {
                copyData += code.innerText + "\n";
            });
            copyToClipboard(copyData.trim());
            copyButton.innerHTML = "复制成功";
            setTimeout(function() {
                copyButton.innerHTML = "复制";
            }, 2000);
        };
        item.appendChild(copyButton);
    });
})();