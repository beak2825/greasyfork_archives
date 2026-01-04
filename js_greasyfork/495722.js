// ==UserScript==
// @name        Search Only 24 Bit Flac RED
// @namespace   Violentmonkey Scripts
// @match       https://redacted.ch/torrents.php*
// @grant       none
// @version     1.0
// @author      -
// @description 1/19/2024, 11:36:59 PM
// @downloadURL https://update.greasyfork.org/scripts/495722/Search%20Only%2024%20Bit%20Flac%20RED.user.js
// @updateURL https://update.greasyfork.org/scripts/495722/Search%20Only%2024%20Bit%20Flac%20RED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply red background to elements with a given groupid
    function applyRedBackgroundToGroupid(groupid) {
        var elements = document.querySelectorAll("[class*='" + groupid + "']");
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            // element.style.backgroundColor = "red";
            element.style.display = "none";
        }
    }

    // Function to get groupid from an element's class attribute
    function getGroupIDFromClass(element) {
        // Check if the element is defined and not null
        if (element && element.className) {
            var classAttribute = element.className;
            var match = classAttribute.match(/groupid_\d+/);
            return match ? match[0] : null;
        } else {
            return null; // Return null if the element is undefined or null
        }
    }

    // Iterate through elements with specific criteria
    document.querySelectorAll(".group_torrent[class*='edition_']").forEach((elm) => {
        let getWeb = elm.querySelector("td:nth-child(1) > a[href*='torrents.php?id=']").textContent;

        if (getWeb.includes("/ Lossless")) {
            var groupid = getGroupIDFromClass(elm);

            if (groupid) {
              document.querySelector("#" + groupid.replace("groupid", "showimg")).parentNode.parentNode.style.display="none";

              // let groupid = "showimg" + groupid;



                applyRedBackgroundToGroupid(groupid);
                console.log("Found Group ID:", groupid);
            } else {
                console.log("Group ID not found");
            }
        }

            if (getWeb.includes("24bit Lossless")) {
             elm.querySelector("td:nth-child(1) > a[href*='torrents.php?id=']").parentNode.parentNode.style.backgroundColor = "#abf7c9";
        }
    });

})();
