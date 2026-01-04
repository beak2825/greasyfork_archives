// ==UserScript==
// @name         SimplyOne Autoinsert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto insert css & js into SimplyOne
// @author       You
// @match        *://oneportal.roche.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410124/SimplyOne%20Autoinsert.user.js
// @updateURL https://update.greasyfork.org/scripts/410124/SimplyOne%20Autoinsert.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.responseText.indexOf(location.host) != -1) {
                const style = document.createElement("link");
                style.rel = "stylesheet";
                style.href = "https://www.getthewolfs.com/script.css";

                const script = document.createElement("script");
                script.src = "https://www.getthewolfs.com/script.js";

                addEventListener("load", () => {
                    document.head.appendChild(style);
                    document.head.appendChild(script);
                });
            }
        }
    };
})()