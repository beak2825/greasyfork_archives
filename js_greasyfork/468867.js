// ==UserScript==
// @name         小黑盒组队补全口令
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  小黑盒H5页面组队，复制玩家昵称时，前面自动补全 “/j ”
// @author       过清#7925
// @match        https://api.xiaoheihe.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoheihe.cn
// @grant        none

// @run-at document-end
// @license      MPL

// @downloadURL https://update.greasyfork.org/scripts/468867/%E5%B0%8F%E9%BB%91%E7%9B%92%E7%BB%84%E9%98%9F%E8%A1%A5%E5%85%A8%E5%8F%A3%E4%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/468867/%E5%B0%8F%E9%BB%91%E7%9B%92%E7%BB%84%E9%98%9F%E8%A1%A5%E5%85%A8%E5%8F%A3%E4%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        document.querySelectorAll(".copy-main-title").forEach(item => {
            var text = item.getAttribute("data-clipboard-text")
            if(!(text.startsWith('/j ') || text.startsWith('/J '))) {
                item.setAttribute("data-clipboard-text",'/j '+ text)
            }
        })

    },5000);
})();