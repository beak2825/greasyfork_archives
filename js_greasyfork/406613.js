// ==UserScript==
// @name         Raid Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove everything not okay after clicking skull icon
// @author       PsycWard
// @include      https://www.torn.com/factions.php?step=your*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406613/Raid%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/406613/Raid%20Filter.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';

    $("i.raid-war-icon").click(function(){$("div.status.left.ok").parent().css("display","");$("div.status.left.not-ok").parent().css("display","none");});
})();