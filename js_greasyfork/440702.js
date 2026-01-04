// ==UserScript==
// @name         Code Golf text area resize
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Code golf text area increase
// @author       You
// @match        https://code.golf/*
// @icon         https://code.golf/icon.svg
// @grant        none
// @license      Boost
// @downloadURL https://update.greasyfork.org/scripts/440702/Code%20Golf%20text%20area%20resize.user.js
// @updateURL https://update.greasyfork.org/scripts/440702/Code%20Golf%20text%20area%20resize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var editorDiv = document.getElementById("editor");
    editorDiv.style.height = null;
    editorDiv.style.resize = "both";
})();