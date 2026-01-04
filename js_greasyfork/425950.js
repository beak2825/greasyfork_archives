// ==UserScript==
// @name         Kubernetes Dashboard Login Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  On Login page auto-selects Kubeconfig radio (instead of Token)
// @author       You
// @match        https://*.dev.asf.telekom.de/
// @icon         https://simpleicons.org/icons/kubernetes.svg
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425950/Kubernetes%20Dashboard%20Login%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/425950/Kubernetes%20Dashboard%20Login%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectKubeconfig = function() {
        console.log(window.location.href);
        console.log(document.querySelector("kd-login"));
        if (document.querySelector("kd-login")) {
            let i = document.querySelector('input[type="radio"][value="kubeconfig"]');
            console.log(i);
            if (i) {
                i.dispatchEvent(new MouseEvent('click', {bubbles: true}));
            }
            else window.setTimeout(selectKubeconfig, 250);
        }
    };

    window.setTimeout(selectKubeconfig, 500);
})();