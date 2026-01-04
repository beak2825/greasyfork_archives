// ==UserScript==
// @name         Mark `.freezed.dart` and `.gr.dart` files as "Viewed" on G pressed, Mark `.lock` files on L pressed
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Simplify review by skipping generated files
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446786/Mark%20%60freezeddart%60%20and%20%60grdart%60%20files%20as%20%22Viewed%22%20on%20G%20pressed%2C%20Mark%20%60lock%60%20files%20on%20L%20pressed.user.js
// @updateURL https://update.greasyfork.org/scripts/446786/Mark%20%60freezeddart%60%20and%20%60grdart%60%20files%20as%20%22Viewed%22%20on%20G%20pressed%2C%20Mark%20%60lock%60%20files%20on%20L%20pressed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onG() {
        const items = document.querySelectorAll('.file-header');
        items.forEach((element) => {
            const fileName = element.querySelector('.Link--primary').innerHTML
            if (fileName.endsWith('.freezed.dart') || fileName.endsWith('.gr.dart') || fileName.endsWith('.g.dart') || fileName.endsWith('.graphql') || fileName.endsWith('.gql.dart')) {
                const checkbox = element.querySelector('.js-reviewed-checkbox');
                if (!checkbox.checked) {
                    checkbox.click();
                }

            }
        })
    }
    function onL() {
        const items = document.querySelectorAll('.file-header');
        items.forEach((element) => {
            const fileName = element.querySelector('.Link--primary').innerHTML
            if (fileName.endsWith('.lock')) {
                const checkbox = element.querySelector('.js-reviewed-checkbox');
                if (!checkbox.checked) {
                    checkbox.click();
                }

            }
        })
    }
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys

        const isText = evt.target instanceof HTMLInputElement && obj.type == 'text';
        const isTextArea = evt.target instanceof HTMLTextAreaElement;
        if (isText || isTextArea) {
            return;
        }

        if (evt.keyCode == 71) {
            onG();
        }
        if (evt.keyCode == 76) {
            onL();
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();