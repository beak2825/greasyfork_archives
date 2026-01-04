// ==UserScript==
// @name         GameWith Auto Open Deck Link
// @namespace    https://shadowverse.gamewith.jp/
// @version      0.1
// @description  Automatically open Shadowverse Portal links on GameWith page
// @author       Toka-MK
// @match        https://shadowverse.gamewith.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402654/GameWith%20Auto%20Open%20Deck%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/402654/GameWith%20Auto%20Open%20Deck%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var htmlCollection = document.getElementsByClassName('gdb-btn--green');
    var buttons = [].slice.call(htmlCollection);
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent == 'デッキコードを発行') {
            buttons[i].click();
        }
    }
})();