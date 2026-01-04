// ==UserScript==
// @name         Hide Solutions
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  Hide the link to solutions on Luogu and Atcoder
// @author       limesarine
// @match        *://www.luogu.com.cn/*
// @match        *://atcoder.jp/*
// @license      © 2024 Limesarine. All rights reserved.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485421/Hide%20Solutions.user.js
// @updateURL https://update.greasyfork.org/scripts/485421/Hide%20Solutions.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const observer=new MutationObserver(()=>{
        let tmp=document.getElementsByTagName('a');
        for(let i in tmp) {
            if(tmp[i] && tmp[i].innerHTML && (tmp[i].innerHTML.includes('Editorial') || tmp[i].innerHTML.includes('查看题解'))) {
                tmp[i].style.display='none';
            }
        }

    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
})();