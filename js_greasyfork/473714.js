// ==UserScript==
// @name         bLUE - Open All Unread Subscribes
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://websight.blue/multi/subscribed
// @match        https://websight.blue/world/subscribed
// @icon         https://lore.delivery/static/blueshi.png
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/473714/bLUE%20-%20Open%20All%20Unread%20Subscribes.user.js
// @updateURL https://update.greasyfork.org/scripts/473714/bLUE%20-%20Open%20All%20Unread%20Subscribes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the link with href="https://websight.blue/zones/mine"
    const postLink = document.querySelectorAll('a[href="https://websight.blue/zones/mine"]');

    // Create a new anchor tag
    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.textContent = '[New]';

    // Add an event listener to the anchor tag
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
                // Get all links in the page
        var links = document.getElementsByTagName("a");

        // Loop through all the links
        for (var i = 0; i < links.length; i++) {
            var linkText = links[i].textContent;
            //console.log("linkText: "+linkText);

            // Check if the link text has a + sign followed by a number
            if (linkText && linkText.match(/\+(\d+)/) && linkText!="+0") {
                // Get the href attribute of the link
                var href = links[i].getAttribute("href");

                // Check if the href attribute exists and is not empty
                if (href && href.trim() !== "") {
                    // Open the link in a new tab
                    console.log(href);
                    //window.open(href); // Old janky chrome implementation
                    GM_openInTab(href, {active: true});
                }
            }
        }
    });

    // Insert the anchor tag after the post link
    postLink[1].insertAdjacentElement('afterend', anchor);
    postLink[1].insertAdjacentText('afterend', " | ");


})();