// ==UserScript==
// @name         Prevent Fat Finger on PVE
// @namespace    https://tipsy.coffee/
// @version      0.1
// @description  Prevent Fat Finger to shutdown PVE host to save world
// @author       Haraguroicha
// @match        https://*/*
// @grant         unsafeWindow
// @run-at        document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/388010/Prevent%20Fat%20Finger%20on%20PVE.user.js
// @updateURL https://update.greasyfork.org/scripts/388010/Prevent%20Fat%20Finger%20on%20PVE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const preventFatFinger = () => {
        const targetNode = document.getElementById('content');
        const pve = unsafeWindow.PVE;
        const pveVer = pve.VersionInfo;
        if (!!pve && !!!pveVer) { return setTimeout(preventFatFinger, 500); }
        const config = { attributes: false, childList: true, subtree: true };
        const callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    (() => {
                        const a = document.querySelector('[id^="proxmoxButton"] span[data-ref="btnIconEl"].fa-power-off');
                        if (!!a) {
                            const b = a.parentElement.parentElement.parentElement;
                            ["x-btn-disabled", "x-unselectable", "x-item-disabled"].map(c => b.classList.add(c));
                        }
                    })()
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    };
    setTimeout(preventFatFinger, 100);
})();