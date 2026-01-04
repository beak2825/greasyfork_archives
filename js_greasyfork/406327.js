// ==UserScript==
// @name         Respec Remover
// @namespace    mailto:noonoo@gmail.com
// @version      1.1
// @description  removes respec button
// @author       NooNoo
// @match        https://trimps.github.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406327/Respec%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/406327/Respec%20Remover.meta.js
// ==/UserScript==

(function init() {
    let button = document.getElementById('talentRespecBtn');
    if (button) {
        button.style.visibility = "hidden";
    } else {
        setTimeout(init, 60000);
    }
})();