// ==UserScript==
// @name         orlygift-expansion
// @namespace    https://github.com/SolarPolarMan/orlygift-expansion
// @version      0.1
// @description  A grease monkey script for adding functionality to orlygift.
// @author       SolarPolarMan
// @match        https://github.com/SolarPolarMan/orlygift-expansion
// @grant        none
// @include      https://www.orlygift.com*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/22191/orlygift-expansion.user.js
// @updateURL https://update.greasyfork.org/scripts/22191/orlygift-expansion.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var credits = $(".info-box-number").text().split(" ")[0];
    var data = $(".progress-description strong");
    var users = data[0].outerText.split(" ")[0];
    var avrgCredits = data[1].outerText.split(" ")[0];
    var totalCredits = avrgCredits * users;
    $(".progress-description").html($(".progress-description").html() + "Chance: " + Math.round(((credits/totalCredits) + 0.00001) * 100) / 100 + "%");
})();
