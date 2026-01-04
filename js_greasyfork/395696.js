// ==UserScript==
// @name         MCBBS Banner屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  广告司马
// @author       You
// @match        https://www.mcbbs.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395696/MCBBS%20Banner%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/395696/MCBBS%20Banner%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jq('script[src="static/js/jquery.cycle.all.min.js"]').parent().css('display','none');
})();