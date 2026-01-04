// ==UserScript==
// @name         Anti_Rofl_Hide_by_el9in
// @namespace    Anti_Rofl_Hide_by_el9in
// @version      1.0
// @description  Auto hide for КрипКрипочек and RaysMorgan
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/466291/Anti_Rofl_Hide_by_el9in.user.js
// @updateURL https://update.greasyfork.org/scripts/466291/Anti_Rofl_Hide_by_el9in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const userId = [5350944,1];
    const button = document.querySelector('button.lzt-fe-se-sendMessageButton');
    const div = document.querySelector('div.fr-element.fr-view.fr-element-scroll-visible');
    if (button && div) {
        button.addEventListener('click', function() {
            const elements = [];
            const childElements = div.children;
            for (var i = 0; i < childElements.length; i++) elements.push(childElements[i].outerHTML);
            if(elements.length != 0) div.innerHTML = `[exceptids=${userId.join(",")}]` + elements.join("<br>") + "[/exceptids]"
            setTimeout(function(){
                div.innerHTML = ``;
            }, 1);
        });
    }
})();