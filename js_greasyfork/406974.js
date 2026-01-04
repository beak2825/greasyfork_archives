// ==UserScript==
// @name         xHamster Exclude Extender
// @version      0.1
// @description  Allows you to add more then 60 characters to exclude for Video search.
// @author       DayZeroKing
// @match        https://xhamster.com/search/*
// @grant        none
// @namespace https://greasyfork.org/users/666437
// @downloadURL https://update.greasyfork.org/scripts/406974/xHamster%20Exclude%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/406974/xHamster%20Exclude%20Extender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByName("exclude")[0].maxLength = 6000;
})();