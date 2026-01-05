// ==UserScript==
// @name         Remove Vipers Grid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *https://viper.works/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29401/Remove%20Vipers%20Grid.user.js
// @updateURL https://update.greasyfork.org/scripts/29401/Remove%20Vipers%20Grid.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".grid").hide();
})();