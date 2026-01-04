// ==UserScript==
// @name         编程猫反劫持脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  编程猫反帖子劫持脚本
// @author       Natriumchlorid
// @match        https://shequ.codemao.cn/community/*
// @icon         https://shequ.codemao.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457880/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%8F%8D%E5%8A%AB%E6%8C%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457880/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%8F%8D%E5%8A%AB%E6%8C%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(async function() {
    for(let k=0;k<100;k++){document.querySelectorAll("iframe").forEach(v=>{
        if(v.style.cssText=="position: fixed; left: 0px; top: 0px; width: 100%; height: 100vh; z-index: 100 !important;"){
            alert(`移除了一条指向${v.src}的劫持Iframe`);
            v.remove();
        };
    });await sleep(100);}
    async function sleep(ms){
        return new Promise((resolve)=>{setTimeout(()=>{resolve()},ms)});
    }
})();