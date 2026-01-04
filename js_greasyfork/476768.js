// ==UserScript==
// @name         DaemonPoplach
// @namespace    DaemonZaplach
// @version      2.0
// @description  Отстранение от общества клоунов
// @author       Patryl and des0late
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      Patryl
// @downloadURL https://update.greasyfork.org/scripts/476768/DaemonPoplach.user.js
// @updateURL https://update.greasyfork.org/scripts/476768/DaemonPoplach.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const userId = [3812139];
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