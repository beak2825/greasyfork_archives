// ==UserScript==
// @name         在新标签页中打开
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在新标签页中打开scp-wiki-cn
// @author       502y
// @match        *://scp-wiki-cn.wikidot.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikidot.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495746/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/495746/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let count = 0;
    const maxCount = 1; 

    const intervalId = setInterval(function() {
        document.body.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                const anchorId = event.target.className;
                console.log(anchorId);
                // 检查 <a> 标签是否为按钮
                if (anchorId && anchorId.includes("btn")) {
                    return;
                }

                const targetUrl = event.target.href.toString();
                console.log(targetUrl);
                if(!targetUrl){
                    return;
                }

                let ifOffset = targetUrl.match(/^(https?:\/\/scp-wiki-cn\.wikidot\.com\/[a-zA-Z0-9\-]+)\/offset\/\d+$/i)?true:false;
                let ifJS = targetUrl.toLowerCase().includes("javascript:;");
                let ifSidebar = targetUrl.toLowerCase().includes("#side-bar")||targetUrl.toLowerCase().includes("###");
                let ifNavigator = targetUrl.toLowerCase().includes("#toc") || (targetUrl.match(/^(https?:\/\/scp-wiki-cn\.wikidot\.com\/[a-zA-Z0-9\-]+)#[a-zA-Z0-9]+$/i)?true:false);

                if (!ifOffset&&!ifJS&&!ifSidebar&&!ifNavigator) {
                    event.target.setAttribute('target', '_blank');
                }
            }
        });
        count++;

        if (count >= maxCount) {
            clearInterval(intervalId);
        }
    }, 200);

})();