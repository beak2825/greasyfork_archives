// ==UserScript==
// @name         侦听innerHTML
// @namespace    https://leochan.me
// @version      1.1.0
// @description  侦听元素innerHTML变化
// @author       Leo
// @match        *://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @licesen      GPLv2
// @grant        none
// ==/UserScript==

function leoChanWatchInnerHTML(selector, cb){
    let targetElement = document.querySelector(selector);
    if(!targetElement){
        return;
    }
    let previousInnerHTML = targetElement.innerHTML;
    let timer = null;
    targetElement.addEventListener('DOMSubtreeModified', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (targetElement.innerHTML !== previousInnerHTML) {
                cb()
            }
            previousInnerHTML = targetElement.innerHTML;
        }, 100);
    });
}