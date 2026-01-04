// ==UserScript==
// @name         FocusInput
// @namespace    https://berkantkz.github.io
// @version      0.1
// @description  Focus to the very first text input on a web page on any key press
// @author       berkantkz
// @match        *://*/*
// @homepage     https://gist.github.com/berkantkz/cfa31157d8e54d821f1ddf345a93d36a
// @icon         https://berkantkz.github.io/kz.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460355/FocusInput.user.js
// @updateURL https://update.greasyfork.org/scripts/460355/FocusInput.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onkeypress=function(k) {
        if (k.code !== "Space"){
            if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA" || document.activeElement.contentEditable == "true") return;

            var i;
            var item = document.getElementsByTagName('input');
            var l = document.getElementsByTagName('input').length;
            var n;

            for (i=0; i<l; i++) {
                if (item[i].placeholder !== '' || item[i].value !== '') {
                    console.log(item[i]);
                    n = item[i];
                    break;
                }
            }

            if (n !== document.activeElement) {
                n.value = "";
                n.focus();
            }
        }
    };
})();