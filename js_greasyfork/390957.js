// ==UserScript==
// @name         tower-wide-workspace
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tower wide workspace
// @author       Rex
// @match        https://tower.im/teams/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390957/tower-wide-workspace.user.js
// @updateURL https://update.greasyfork.org/scripts/390957/tower-wide-workspace.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('div.container, div.workspace').css('width', '90%')
})();