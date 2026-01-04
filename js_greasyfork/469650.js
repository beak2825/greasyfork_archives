// ==UserScript==
// @name         好好看看数据范围
// @namespace    Ocyss
// @version      0.1
// @description  看好范围很重要~
// @author       Ocyss
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/469650/%E5%A5%BD%E5%A5%BD%E7%9C%8B%E7%9C%8B%E6%95%B0%E6%8D%AE%E8%8C%83%E5%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/469650/%E5%A5%BD%E5%A5%BD%E7%9C%8B%E7%9C%8B%E6%95%B0%E6%8D%AE%E8%8C%83%E5%9B%B4.meta.js
// ==/UserScript==

(function() {
    let t = setInterval(()=>{
        let ts = document.getElementsByName("description")[0].content.split("提示：")[1]
        if (ts != undefined){
            alert("睁大你的狗眼看清楚范围："+ts)
            clearInterval(t)
        }
    },2000);
})();


