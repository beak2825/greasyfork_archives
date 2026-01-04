// ==UserScript==
// @name         Multi Tab Visibility
// @copyright    Ojo Ngono
// @namespace    violentmonkey/tampermonkey script 
// @version      1.2.8.5
// @description  allowing to open many tabs without browser's knowing 
// @author       Ojo Ngono
// @include      *://*/*
// @grant        none
// @@license     Copyright OjoNgono
// @downloadURL https://update.greasyfork.org/scripts/494562/Multi%20Tab%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/494562/Multi%20Tab%20Visibility.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self) return;

    const blockEvents = [
        "visibilitychange", "webkitvisibilitychange", "mozvisibilitychange",
        "blur", "focus", "mouseleave", "focusin", "focusout"
    ];

    // 
    Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
    Object.defineProperty(document, "visibilityState", { get: () => "visible", configurable: true });
    document.hasFocus = () => true;

    // 
    const _addEvent = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
        if (blockEvents.includes(type)) {
            const wrapped = function (e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
            };
            return _addEvent.call(this, type, wrapped, options);
        }
        return _addEvent.call(this, type, listener, options);
    };

    // 
    const _IO = window.IntersectionObserver;
    window.IntersectionObserver = class extends _IO {
        constructor(callback, options) {
            super((entries, observer) => {
                entries = entries.map(entry => Object.assign(entry, {
                    isIntersecting: true,
                    intersectionRatio: 1
                }));
                callback(entries, observer);
            }, options);
        }
    };

    // === Fake Activity Mode Cerdas ===
    let lastUserAction = Date.now();
    let fakeActivityInterval = null;

    function updateLastAction() {
        lastUserAction = Date.now();
    }

    // 
    ["mousemove", "keydown", "mousedown", "touchstart"].forEach(evt => {
        document.addEventListener(evt, updateLastAction, { passive: true });
    });

    function fakeMouseMove() {
        const event = new MouseEvent("mousemove", {
            bubbles: true,
            cancelable: true,
            clientX: Math.floor(Math.random() * window.innerWidth),
            clientY: Math.floor(Math.random() * window.innerHeight)
        });
        document.dispatchEvent(event);
    }

    function fakeClick() {
        const x = Math.floor(window.innerWidth / 2 + (Math.random() * 100 - 50));
        const y = Math.floor(window.innerHeight / 2 + (Math.random() * 100 - 50));
        const event = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            button: 0
        });
        document.dispatchEvent(event);
    }

    function fakeKeyPress() {
        const keys = [" ", "ArrowUp", "ArrowDown"];
        const key = keys[Math.floor(Math.random() * keys.length)];
        const event = new KeyboardEvent("keydown", { key, bubbles: true });
        document.dispatchEvent(event);
    }

    function startFakeActivity() {
        if (fakeActivityInterval) return; // sudah berjalan
        fakeActivityInterval = setInterval(() => {
            const idleTime = Date.now() - lastUserAction;
            if (idleTime > 10000) { // user idle > 10 detik
                fakeMouseMove();
                if (Math.random() < 0.3) fakeClick();
                if (Math.random() < 0.2) fakeKeyPress();
            }
        }, Math.random() * 5000 + 3000); // interval acak 3-8 detik
    }

    function stopFakeActivity() {
        if (fakeActivityInterval) {
            clearInterval(fakeActivityInterval);
            fakeActivityInterval = null;
        }
    }

    // 
    setInterval(() => {
        const idleTime = Date.now() - lastUserAction;
        if (idleTime > 10000) {
            startFakeActivity();
        } else {
            stopFakeActivity();
        }
    }, 1000);

})();
