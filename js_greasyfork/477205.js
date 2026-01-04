// ==UserScript==
// @name         Dreamwidth Formatting Fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  improve the overall UX on the Dreamwidth update/edit page
// @author       You
// @match        https://www.dreamwidth.org/update
// @match        https://www.dreamwidth.org/edit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dreamwidth.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477205/Dreamwidth%20Formatting%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/477205/Dreamwidth%20Formatting%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let a = document.querySelector('[role="navigation"]');
    a.style.cssText = 'position: fixed;top: 0px;'
        + 'width: 100%;'
        + 'margin: 0 0 0 -1rem;'
        + 'padding-left: 1rem;'
        + 'background: linear-gradient(0deg, #bfbfbf, #efefef, #ffffff, #efefef);'
        + 'font-size: .6rem;'
        + 'font-family: sans-serif';
    let b = a.querySelector('p');
    b.style.padding = '.5rem 0 1rem 0';
    b.style.margin = 0;
    b = a.querySelectorAll('p > a');
    b.forEach(c=>{
        c.style.padding = "0 1rem";
        c.style.color = "#00f";
    });
    a = document.querySelector('div[role="main"]');
    a.style.marginTop = "4rem";
    let i = document.querySelector('span.ljuser a img.ContextualPopup');
    i.style.transform = "scale(.6)";
    setTimeout(()=>{
        let a  = document.querySelector('#draft-container');
        console.log(a);
        a.style.transform = "scale(1.2)";
        a.style.transformOrigin = "top left";
        a  = document.querySelector('#options');
        a.style.marginTop = "4rem";
    }, 1000);
})();