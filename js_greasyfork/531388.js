// ==UserScript==
// @name         Mobile Bilibili Optimize
// @namespace    http://tampermonkey.net/
// @version      2025-03-12
// @description  BILIBILI
// @author       You
// @license      MIT
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531388/Mobile%20Bilibili%20Optimize.user.js
// @updateURL https://update.greasyfork.org/scripts/531388/Mobile%20Bilibili%20Optimize.meta.js
// ==/UserScript==

(function() {
    'use strict';
/**
    addCssBlock("#app > div > div.suspension > div > div.m-navbar > div > m-open-app");
    addCssBlock(".m-fixed-openapp");
    addCssBlock(".openapp-btn");

    const observer = new MutationObserver((MutationList)=>{
        for(const mutation of MutationList) {
            if(mutation.type === "attributes") {
               alert("hi")
            }
        }
    })
    const target = document.getElementByClassName("m-fixed-openapp");
    const config = {attributes:true};
    observer.observe(target,true);

    function addCssBlock(SelectorTxt) {
        // document.querySelector(SelectorTxt).style.display = "none"
        document.querySelector(SelectorTxt).hidden = true;
    }
    **/
    function addEleBlock(selector) {
        if(document.querySelector(selector)) {
            document.querySelector(selector).style.display = 'none'
        }
    }

    const observer = new MutationObserver(()=>{
        addEleBlock('div.m-fixed-openapp')
        addEleBlock('div.openapp-btn')
        addEleBlock('.slide-ad-exp')
        addEleBlock('.video-page-game-card-small')
        addEleBlock('.m-open-app.m-nav-openapp')
        addEleBlock('.openapp-dialog')
        console.log('屏蔽成功')
    })
    const observerOptions = {
      childList: true,
      subtree: true,
    };
    observer.observe(document.body,observerOptions);
    document.getElementsByTagName('title')[0].innerHTML = 'B站'
})();