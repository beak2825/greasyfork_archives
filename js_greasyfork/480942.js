// ==UserScript==
// @name         autokf
// @namespace    autokf
// @version      2.0
// @description  Авто-хайд для КФ
// @author       spark, Патруль
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        unsafeWindow
// @license      Patryl
// @downloadURL https://update.greasyfork.org/scripts/480942/autokf.user.js
// @updateURL https://update.greasyfork.org/scripts/480942/autokf.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const button = document.querySelector('button.lzt-fe-se-sendMessageButton');
    const div = document.querySelector('div.fr-element.fr-view.fr-element-scroll-visible');
    if (button && div) {
        button.addEventListener('click', function() {
            const elements = [];
            const childElements = div.children;
            for (var i = 0; i < childElements.length; i++) elements.push(childElements[i].outerHTML);
            if(elements.length != 0) div.innerHTML = `[club=align=left]3213423423[/club]`
            setTimeout(function(){
                div.innerHTML = ``;
            }, 1);
        });
    }
})();