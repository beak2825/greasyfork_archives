// ==UserScript==
// @name         团队自动打开
// @namespace    http://tampermonkey.net/
// @version      2024-07-10
// @description  添加一个"团队作业"按钮
// @author       zhao_daodao
// @match        https://www.luogu.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487930/%E5%9B%A2%E9%98%9F%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/487930/%E5%9B%A2%E9%98%9F%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pos=document.querySelector("#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.tiny > div.container > div.link-container");
    let butt=document.createElement('button');
    butt.innerText='团队作业';
    butt.id='free';
    butt.className = 'btn btn-primary';
    butt.style.padding = "10px 17px";
    butt.style.backgroundColor = "#ffffff";
    butt.style.color = "rgb(35, 35, 35)";
    butt.style.border = "none";
    butt.style.borderRadius = "5px";
    butt.style.fontSize = "16px";
    butt.style.cursor = "pointer";
    butt.addEventListener('mouseover', function() {
        this.style.backgroundColor = "#ffffff";
    });
    butt.style.position = "relative";
    butt.style.left = "-20px";
    butt.addEventListener('mouseout', function() {
        this.style.backgroundColor = "#ffffff";
    });
    butt.addEventListener('click',function(){
        window.open('https://www.luogu.com.cn/team/47449#homework', '_blank');
    });
    pos.appendChild(butt);
})();