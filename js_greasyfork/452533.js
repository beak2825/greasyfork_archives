// ==UserScript==
// @name         Anobii Anobian Ratio
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  this script calculates the ratio of # book read and # books in common 
// @author       Michele
// @match        https://www.anobii.com/*/anobians**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anobii.com
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452533/Anobii%20Anobian%20Ratio.user.js
// @updateURL https://update.greasyfork.org/scripts/452533/Anobii%20Anobian%20Ratio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery(jQuery("app-table-field-filter")[0]).append("<button id='processRatioButton'>Calculate Ratio</button>");

    jQuery("button#processRatioButton").click(function(){
        jQuery("tr.hoverDiv a").each((k, v) => {
            var reads = parseInt(jQuery(jQuery(v).children("td")[2]).text().replace(",","").trim());
            var commons = parseInt(jQuery(jQuery(v).children("td")[4]).text().replace(",","").trim());
            var ratio = Math.round(commons/reads*100*100)/100;
            var commonsText = jQuery(jQuery(v).children("td")[4]).text();
            jQuery(jQuery(v).children("td")[4]).text(commonsText + " | " + ratio + "%");
        });
    });
})();