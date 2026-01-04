// ==UserScript==
// @name         侦听网页节点变化
// @namespace    https://leochan.me
// @version      1.0.0
// @description  侦听节点变化
// @author       Leo
// @match        *://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @homepage     https://leochan.me
// @licesen      GPLv2
// @grant        none
// ==/UserScript==
 
function leoChanWatchTargetElement(selector, cb){
    const targetElement = document.querySelector(selector);
    if(!targetElement){
        return;
    }
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver(cb);
    observer.observe(targetElement, config);
    return observer;
}