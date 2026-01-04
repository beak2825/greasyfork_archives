// ==UserScript==
// @name        lk
// @namespace    http://tampermonkey.net/
// @version      2525-10-04
// @description  用于下载轻之国度小说的一个小脚本,点击标题即可下载
// @author       nost
// @match        https://www.lightnovel.us/cn/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lightnovel.us
// @grant        none
// @license      personal
// @downloadURL https://update.greasyfork.org/scripts/509755/lk.user.js
// @updateURL https://update.greasyfork.org/scripts/509755/lk.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let txt=document.getElementsByClassName('article-content')[0].innerText;
    let btn=document.getElementsByClassName('article-title')[0];
    btn.onclick=()=>{
        const blob=new Blob([txt],{
            type:"text/plain;charset=utf-8"
        });
        const objURL=URL.createObjectURL(blob);
        const a=document.createElement('a');
        a.href=objURL;
        a.download=btn.innerText+'.txt';
        a.click();
        URL.revokeObjectURL(objURL);
    };
})();