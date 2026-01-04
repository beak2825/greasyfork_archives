// ==UserScript==
// @name         Astarte L-Gen Shortcut
// @namespace    http://github.com/cutls
// @version      1.0.0
// @description  Ctrl+Shift+Lでローカル限定のトゥートができるようになるスクリプト
// @author       Cutls P
// @match        https://kirishima.cloud/*
// @match        https://*.kirishima.cloud/*
// @license       MIT License
// @downloadURL https://update.greasyfork.org/scripts/382962/Astarte%20L-Gen%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/382962/Astarte%20L-Gen%20Shortcut.meta.js
// ==/UserScript==

window.addEventListener('keydown', function () {
    if (event.metaKey || event.ctrlKey) {
        if (event.shiftKey) {
            if (event.keyCode === 76) {
                var txt = document.querySelector('.composer--textarea textarea');
                if(txt.value){
                    txt.value = txt.value + " 👁";
                    document.querySelector('.composer--publisher button.primary').click();
                    return false;
                }
            }
        }
    }
});