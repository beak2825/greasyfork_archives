// ==UserScript==
// @name         Change Chat Key
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  change the key that focuses the chat box
// @author       Justin1L8
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423192/Change%20Chat%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/423192/Change%20Chat%20Key.meta.js
// ==/UserScript==

// this number is the keycode for the key to replace enter
// to find it, type a key into jstris's controls and copy the number to the right
// default (84) is t

const chatKeyCode = 84

// ignore the rest //

let key_input_2 = Game.prototype.keyInput2;
Game.prototype.keyInput2 = function() {
    let key = arguments[0];

    // open chat if new chat key is pressed
    if (key.keyCode == chatKeyCode && this.focustState !== 1) {
        this.setFocusState(1);
        var t = this;
        setTimeout(function() {t.Live.chatInput.focus()}, 0) // setTimeout to prevent the key from being typed
    }

    // ignore enter key
    if (key.keyCode == 13) return;

    // process key normally
    return key_input_2.apply(this, arguments);
}