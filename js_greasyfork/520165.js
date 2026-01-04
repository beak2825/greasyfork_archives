// ==UserScript==
// @name         Hebraicize Typing.com
// @namespace    http://github.com/emosenkis
// @version      2024-12-08
// @description  Converts Typing.com to Hebrew keyboard.
// @author       emosenkis
// @include      https://www.typing.com/*/lesson/*
// @include      https://typing.com/*/lesson/*
// @match        http*://www.typing.com/*/lesson/*
// @match        http*://typing.com/*/lesson/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520165/Hebraicize%20Typingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/520165/Hebraicize%20Typingcom.meta.js
// ==/UserScript==

(function(){
    const en = "QWERTYUIOP[ASDFGHJKL;'ZXCVBNM,./";
    const he = "/'קראטוןםפ][שדגכעיחלךף,זסבהנמצתץ.";
    function hebraicize() {
        const els = document.querySelectorAll(".key-label, .letter");
        for(const el of els) {
            if (el.innerText == null || el.hebraicized === el.innerText) { continue }
            el.hebraicized = el.innerText;
            const it = el.innerText.trim();
            if (it.length !== 1) { continue };
            const idx = en.indexOf(it.toUpperCase());
            if (idx === -1) { continue };
            console.log(it + " -> " + he[idx]);
            el.innerText = el.innerText.replace(it, he[idx])
        }
    }
    hebraicize();
    new MutationObserver(hebraicize).observe(document, {childList:true,subtree:true})
}())