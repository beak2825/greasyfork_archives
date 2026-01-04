// ==UserScript==
// @name         按钮脚本模板
// @namespace    http://tampermonkey.net/
// @version      2024-02-21
// @description  zdd6310
// @author       zhao_daodao
// @match        https://www.luogu.com.cn/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487929/%E6%8C%89%E9%92%AE%E8%84%9A%E6%9C%AC%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/487929/%E6%8C%89%E9%92%AE%E8%84%9A%E6%9C%AC%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pos=document.querySelector("#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.tiny > div.container > div.link-container");
    let butt=document.createElement('button');
    butt.innerText='nboj';
    butt.id='free';
    butt.className = 'btn btn-primary';
    butt.style.padding = "10px 20px";
    butt.style.backgroundColor = "#ffffff";
    butt.style.color = "black";
    butt.style.border = "none";
    butt.style.borderRadius = "5px";
    butt.style.fontSize = "16px";
    butt.style.cursor = "pointer";
    butt.addEventListener('mouseover', function() {
        this.style.backgroundColor = "#ffffff";
    });
    butt.addEventListener('mouseout', function() {
        this.style.backgroundColor = "#ffffff";
    });
    butt.addEventListener('click',function(){
        // alert('fuck zwx');
        window.open('https://www.luogu.com.cn/chat', '_blank');
    });
    pos.appendChild(butt);
})();