// ==UserScript==
// @name         Get On LeakBin
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Downloads leaked logins for any site instantly.
// @author       sevenworks.eu.org
// @match        *://*/*
// @license      GNU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491207/Get%20On%20LeakBin.user.js
// @updateURL https://update.greasyfork.org/scripts/491207/Get%20On%20LeakBin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let aa = false, bb = false;
    document.addEventListener('keydown', function(event) {
        if (event.code === 'ControlRight') aa = true;
        else if (event.code === 'ShiftRight') bb = true;
        if (aa && bb) {
            let x = window.open(`https://leakbin.sevenworks.eu.org/?p=download&leak=${window.location.hostname.replace("www.","")}`, '_blank', 'width=300,height=100,top=0,left=0');
            setTimeout(() => x.close(), 1420);
            aa = bb = false;
        }
    });
    document.addEventListener('keyup', function(event) {if (event.code === 'ControlRight') aa = false; else if (event.code === 'ShiftRight') bb = false;});
})();