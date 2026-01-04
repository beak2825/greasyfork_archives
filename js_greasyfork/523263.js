// ==UserScript==
// @name         洛谷提交记录颜色渲染
// @version      0.5
// @description  提交记录颜色渲染
// @match        https://www.luogu.com.cn/record$
// @match        https://www.luogu.com.cn/record/*
// @author       MlkMathew
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/1068192
// @downloadURL https://update.greasyfork.org/scripts/523263/%E6%B4%9B%E8%B0%B7%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95%E9%A2%9C%E8%89%B2%E6%B8%B2%E6%9F%93.user.js
// @updateURL https://update.greasyfork.org/scripts/523263/%E6%B4%9B%E8%B0%B7%E6%8F%90%E4%BA%A4%E8%AE%B0%E5%BD%95%E9%A2%9C%E8%89%B2%E6%B8%B2%E6%9F%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const col=["rgb(191,191,191)","rgb(254,76,97)","rgb(243,156,17)","rgb(255,193,22)","rgb(82,196,26)","rgb(52,152,219)","rgb(157,61,207)","rgb(14,29,105)"];
    function work(){
        let res=window._feInjection.currentData.records.result;
        let n=res.length;
        let pid=document.querySelectorAll(".pid");
        for(let i=0;i<n;i++)
        {
            pid[i].style="font-weight:bold;color:"+col[res[i].problem.difficulty];
        }
    }
    function reload(){
        location.reload();
    }
    function Reload(){
        setTimeout(reload,1000);
    }
    function init(){
        work();
        const bar=document.querySelector("#app > div.main-container > main > div.full-container > div > div > div.bottom > div > div > div").children;
        for(let i=0;i<bar.length;i++)
        {
            bar[i].addEventListener("click",Reload);
        }
    }
    setTimeout(init,300);
})();