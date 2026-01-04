// ==UserScript==
// @name         Filman Ad Banner Remover
// @namespace    http://tampermonkey.net/
// @version      2025-03-30
// @description  Ad banner remover
// @author       lxst-one
// @match        https://filman.cc/*
// @icon         https://filman.cc/public/dist/images/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531370/Filman%20Ad%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/531370/Filman%20Ad%20Banner%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('kam-ban-player').style.display = 'none';
})();