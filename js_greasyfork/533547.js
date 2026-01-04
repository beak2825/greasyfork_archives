// ==UserScript==
// @name         dpm auto focus search bar
// @namespace    dpm_qol
// @version      1.0
// @description  auto focuses search bar of dpm.lol
// @author       Tzakazuki
// @match        https://dpm.lol/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533547/dpm%20auto%20focus%20search%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/533547/dpm%20auto%20focus%20search%20bar.meta.js
// ==/UserScript==

(function() {
    const el = document.querySelector(".rounded-lg.bg-blue-300\\/10");

    if (!el) {
        console.log("Element NOT found");
        return;
    }

    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const target = document.elementFromPoint(x, y);

    if (!target) {
        console.log("elementFromPoint failed");
        return;
    }

    // Simulate a real user-like click
    ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(type => {
        const event = new MouseEvent(type, {
            clientX: x,
            clientY: y,
            bubbles: true,
            cancelable: true,
            view: window
        });
        target.dispatchEvent(event);
    });
})();