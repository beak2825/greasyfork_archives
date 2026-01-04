// ==UserScript==
// @name         聚凤阁
// @license      聚凤阁
// @author       You
// @namespace    http://tampermonkey.net/
// @version      1.1.15
// @description  加速浏览

// @scriptUrl    https://greasyfork.org/zh-CN/script_versions
// @match        *jfg66.xyz/index.php*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/455143/%E8%81%9A%E5%87%A4%E9%98%81.user.js
// @updateURL https://update.greasyfork.org/scripts/455143/%E8%81%9A%E5%87%A4%E9%98%81.meta.js
// ==/UserScript==


(function() {
    'use strict';

    
    // document.onreadystatechange = function () {
    //     //当页面加载状态为完全结束时进入 
    //     if (document.readyState == "complete") { 
    //        const  messageData = document.querySelector("meta[name = 'description']").getAttribute("content");
    //        console.log(messageData);
    //        alert(messageData);
    //     };
    // };



    const  messageData = document.querySelector("meta[name = 'description']").getAttribute("content");
    console.log(messageData);
    alert(messageData);       



    // Your code here...
})();