// ==UserScript==
// @name         Pixso Zoom Wheel
// @version      1.1
// @description  Add zoom functionality with Ctrl + Mouse Wheel on Pixso
// @author       letovsk1y
// @include      http*://pixso.*
// @grant        none
// @namespace https://greasyfork.org/users/1165695
// @downloadURL https://update.greasyfork.org/scripts/529771/Pixso%20Zoom%20Wheel.user.js
// @updateURL https://update.greasyfork.org/scripts/529771/Pixso%20Zoom%20Wheel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('wheel', function(event) {
        const focusEl = document.getElementsByClassName('focus-target__readwrite')[0]

        if (event.ctrlKey) {
            if (event.deltaY < 0) {
                const event = new KeyboardEvent('keydown', {
                    altKey: false,
                    charCode: 0,
                    code: "Equal",
                    composed: true,
                    ctrlKey: true,
                    isComposing: false,
                    key: '=',
                    keyCode: 187,
                    location: 0,
                    metaKey: false,
                    repeat: false,
                    shiftKey: false,
                    which: 187
                });

                focusEl.dispatchEvent(event);
            } else if (event.deltaY > 0) {
                  const event = new KeyboardEvent('keydown', {
                    altKey: false,
                    charCode: 0,
                    code: "Minus",
                    composed: true,
                    ctrlKey: true,
                    isComposing: false,
                    key: '-',
                    keyCode: 189,
                    location: 0,
                    metaKey: false,
                    repeat: false,
                    shiftKey: false,
                    which: 189
                });

                focusEl.dispatchEvent(event);
            }
        }
    });
})();
