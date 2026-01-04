// ==UserScript==
// @name         Increase Kibana option list width
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/kibana/app/kibana
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395508/Increase%20Kibana%20option%20list%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/395508/Increase%20Kibana%20option%20list%20width.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function() {
        let width = '40vw';

        $(".euiComboBoxOptionsList__rowWrap").width(width);
        $(".euiComboBoxOptionsList").width(width);
        $(".euiComboBoxOptionsList").css('max-width', width);
        $(".ReactVirtualized__List").width(width);
        $(".ReactVirtualized__Grid__innerScrollContainer").css('max-width', width);
        $(".ReactVirtualized__Grid__innerScrollContainer").width(width);
    }, 100);
})();