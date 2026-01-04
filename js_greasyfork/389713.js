// ==UserScript==
// @name         煎蛋打开所有吐槽
// @namespace    http://ts8zs.com/
// @version      0.2
// @description  一键打开煎蛋所有吐槽框
// @author       Ts8zs
// @match        http://jandan.net/*
// @downloadURL https://update.greasyfork.org/scripts/389713/%E7%85%8E%E8%9B%8B%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E5%90%90%E6%A7%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/389713/%E7%85%8E%E8%9B%8B%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E5%90%90%E6%A7%BD.meta.js
// ==/UserScript==

(function() {
    if(document.querySelector('.tucao-btn')){
        var btn=document.createElement('button');
        btn.onclick=()=>{document.querySelectorAll(".tucao-btn").forEach((e)=>{e.click()})};
        btn.innerText+=`打开所有吐槽`;
        document.querySelector('.post.f').appendChild(btn);
    }
})();