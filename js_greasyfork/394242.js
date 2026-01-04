// ==UserScript==
// @name  Amazon No BS
// @namespace  Amazon
// @version  0.1
// @description  Hides Unnecessary Stuff  
// @author  KD
// @match   https:*.amazon.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394242/Amazon%20No%20BS.user.js
// @updateURL https://update.greasyfork.org/scripts/394242/Amazon%20No%20BS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set our list of sites and elements to block
  var blockList = [
"www.amazon.com###productDescription_feature_div",
"www.amazon.com##.dp-accordion-active.selected.rbbSection.a-box > .a-box-inner",
"www.amazon.com###navFooter",
"www.amazon.com##.cm_cr_grid_center_container.a-row",
"www.amazon.com###books-entity-teaser",
"www.amazon.com###reviewsMedley > .a-fixed-left-grid-inner",
"www.amazon.com##.rhf-frame",
"www.amazon.com##.bucket.vse-empty-view-container.a-section",
"www.amazon.com###rightCol",
   ];

    // Get the window's hostname
    var windowHostname = window.location.hostname;

    // Iterate through the blocklist, hiding elements as needed
    for(var i = 0; i < blockList.length; i++) {
        var entryParts = blockList[i].split('##');

        // Compare the hostnames; Only remove elements if they match
        if(windowHostname === entryParts[0]) {
            // Find the elements if they exists
            var matchedElements = document.querySelectorAll(entryParts[1]);

            // Actually remove the element(s) that match
            for(var j = 0; j < matchedElements.length; j++) {
                var matchedElem = matchedElements[j];

                matchedElem.parentNode.removeChild(matchedElem);
            }
        }
    }
})();