// ==UserScript==
// @name         Qidian Translation Enabler
// @version      2025-07-23
// @description  Allow translation on qidian.com
// @author       Aersuy
// @namespace    Aersuy
// @license      MIT
// @match        https://www.qidian.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qidian.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543408/Qidian%20Translation%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/543408/Qidian%20Translation%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let html_tag = document.getElementsByTagName("html")[0];
    if (html_tag) {

        html_tag.setAttribute("translate", "yes");

        if (html_tag.classList.contains("notranslate")) {
            html_tag.classList.remove("notranslate");
        }
    }


    let elements = document.querySelectorAll(".notranslate");
    elements.forEach(element => {
        element.classList.remove("notranslate");
    });
})();
