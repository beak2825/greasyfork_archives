// ==UserScript==
// @name         2v2.io Edit-on-Release
// @description  Automatically confirms edits on release in 2v2.io, supports right mouse button
// @author       myrrr
// @match        *://*2v2.io/*
// @grant        none
// @version 0.0.1.20250804150231
// @namespace https://greasyfork.org/users/1330310
// @downloadURL https://update.greasyfork.org/scripts/544629/2v2io%20Edit-on-Release.user.js
// @updateURL https://update.greasyfork.org/scripts/544629/2v2io%20Edit-on-Release.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**********************
     * Set your edit key here
     **********************/
    const KEY_EDIT = 'e'; // 'e' for keyboard, 'rightmouse' for right-click

    /**********************
     * Don't touch anything below
     **********************/
    let editing = false;

    const pressKey = (key) => {
        const code = "Key" + key.toUpperCase();
        const keyCode = key.toUpperCase().charCodeAt(0);

        ["keydown", "keyup"].forEach(type => {
            const evt = new KeyboardEvent(type, {
                key: key,
                code,
                keyCode,
                which: keyCode,
                bubbles: true
            });
            window.dispatchEvent(evt);
        });
    };

    function simulateRightClick(target) {
        const canvas = target || document.querySelector('canvas');
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const optionsDown = {
            bubbles: true,
            cancelable: true,
            pointerId: 1,
            pointerType: "mouse",
            isPrimary: true,
            button: 2,
            buttons: 2,
            clientX: x,
            clientY: y
        };

        const optionsUp = {
            ...optionsDown,
            buttons: 0
        };

        ["pointerdown", "mousedown"].forEach(type => {
            canvas.dispatchEvent(new PointerEvent(type, optionsDown));
        });

        ["pointerup", "mouseup", "click", "contextmenu"].forEach(type => {
            canvas.dispatchEvent(new PointerEvent(type, optionsUp));
        });
    }

    document.addEventListener("keydown", (e) => {
        if (KEY_EDIT !== 'rightmouse' && e.key.toLowerCase() === KEY_EDIT) {
            editing = true;
        }
    });

    document.addEventListener("mousedown", (e) => {
        if (KEY_EDIT === 'rightmouse' && e.button === 2) {
            editing = true;
        }
        if (editing && e.button === 0) {
            document.addEventListener("mouseup", handleRelease, { once: true });
        }
    });

    function handleRelease() {
        if (KEY_EDIT === 'rightmouse') {
            simulateRightClick();
        } else {
            pressKey(KEY_EDIT);
        }
        editing = false;
    }
})();
