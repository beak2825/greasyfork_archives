// ==UserScript==
// @name         just translate
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  just translate crates.io
// @author       jelipo(https://github.com/jelipo)
// @match        https://crates.io/*
// @icon         https://crates.io/favicon.ico
// @grant        none
// @license      MIT
// @repo         https://github.com/jelipo/translate-crates-io
// @downloadURL https://update.greasyfork.org/scripts/458412/just%20translate.user.js
// @updateURL https://update.greasyfork.org/scripts/458412/just%20translate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var html = document.children.item("html");
    if (html !== undefined) {
        html.attributes.removeNamedItem("translate");
        html.classList.remove("notranslate");
    }
})();
