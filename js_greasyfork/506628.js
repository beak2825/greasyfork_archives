// ==UserScript==
// @name         98堂搜索结果过滤
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除隐藏内容的帖子
// @author       TheZeroMR
// @match        *://*.sehuatang.org/search.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sehuatang.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506628/98%E5%A0%82%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/506628/98%E5%A0%82%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const results = document.querySelectorAll("li.pbw > p:nth-child(3)")
    results.forEach(r=>{
        if(r.innerText.indexOf('内容隐藏') != -1){
            console.log(r.parentElement.remove())
        }
    })


})();