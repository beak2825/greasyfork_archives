// ==UserScript==
// @name         Text Changer
// @namespace    http://www.example.com/
// @version      1.1
// @description Allows you to change any text on a website by pressing the "Pos1" key. Change, use, modify the code as you wish, but if you post this script anywhere (modified or not), you MUST inform me. Failure to do so will be considered a violation of copyright laws and will be reported accordingly.
// @author       Cxsty
// @license MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466638/Text%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/466638/Text%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isTextEditingEnabled = false;

    function enableTextEditing() {
        isTextEditingEnabled = true;
        document.body.setAttribute('contenteditable', 'true');
    }

    function disableTextEditing() {
        isTextEditingEnabled = false;
        document.body.removeAttribute('contenteditable');
    }

    function handleKeyPress(event) {
        const isPos1Key = event.key === 'Home' || event.code === 'Numpad7';
        
        if (isPos1Key) {
            if (!isTextEditingEnabled) {
                enableTextEditing();
            } else {
                disableTextEditing();
            }
        }
    }

    document.addEventListener('keydown', handleKeyPress);
})();
