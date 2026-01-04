// ==UserScript==
// @name         Show hidden introduction
// @namespace    http://tampermonkey.net/
// @version      v1.0.0.2
// @description  show the hidden introduction on Luogu
// @author       limesarine
// @match        https://www.luogu.com.cn/user/*
// @license      © 2024 Limesarine. All rights reserved.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485420/Show%20hidden%20introduction.user.js
// @updateURL https://update.greasyfork.org/scripts/485420/Show%20hidden%20introduction.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const observer=new MutationObserver(()=>{
        const introduction=document.getElementsByClassName("introduction marked")[0];
        if(introduction)
        {
            introduction.style.display='block';
            introduction.parentElement.childNodes[4].style.display='none'
        }
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
})();