// ==UserScript==
// @name         NullPress remove adblock
// @namespace    https://greasyfork.org/en/scripts/407715-nullpress-remove-adblock/
// @version      0.2
// @description  remove adblock from nullpress.net
// @author       TechComet
// @match        https://nullpress.net/*
// @match        https://*.nullpress.net/*
// @supportURL   https://greasyfork.org/en/scripts/407715-nullpress-remove-adblock/feedback
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407715/NullPress%20remove%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/407715/NullPress%20remove%20adblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var element = document.getElementsByTagName("script"), index;

    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }


})();