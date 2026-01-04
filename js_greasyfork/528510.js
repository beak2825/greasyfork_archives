// ==UserScript==
// @name         Resizable Textarea from prompts and negative promts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hacer que el textarea de prompts y negative prompts redimensionables uwu
// @author       Abejita
// @match        https://pixai.art/generator/image
// @match        https://pixai.art/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528510/Resizable%20Textarea%20from%20prompts%20and%20negative%20promts.user.js
// @updateURL https://update.greasyfork.org/scripts/528510/Resizable%20Textarea%20from%20prompts%20and%20negative%20promts.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function makeResizableVertical(selector, maxHeight) {
        const checkExist = setInterval(function() {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(el => {
                    el.style.resize = 'vertical';
                    el.style.overflow = 'auto';
                    el.style.maxHeight = maxHeight;
                });
                clearInterval(checkExist);
            }
        }, 100);
        setTimeout(function() {
            clearInterval(checkExist);
        }, 10000);
    }
   window.addEventListener('load', function() {
        makeResizableVertical('.sc-iTFTee.sc-dwnOUR.lfbXAG.iIeQrX.MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputMultiline', '300px');
        makeResizableVertical('textarea.w-full.min-h-\\[3em\\].max-h-\\[9em\\].dense\\:max-h-\\[5em\\].bg-transparent.outline-none.resize-none', '500px');
    });
})();