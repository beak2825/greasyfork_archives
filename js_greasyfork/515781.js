// ==UserScript==
// @name         Armor Visuals be Gone
// @version      1.0
// @description  Deletes armor images from the player models (Loader and Item Page)
// @author       ShadowBirb
// @match        http*://www.torn.com/*
// @namespace https://greasyfork.org/users/1389667
// @downloadURL https://update.greasyfork.org/scripts/515781/Armor%20Visuals%20be%20Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/515781/Armor%20Visuals%20be%20Gone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of image IDs to target
    const targetIDs = [
        32, 34, 49, 50, 176, 178, 332, 333, 334, 348, 538, 640, 641, 647, 650,
        651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664,
        665, 666, 669, 670, 671, 672, 673, 674, 675, 676, 679, 680, 681, 682,
        683, 684, 1307, 1308, 1309, 1310, 1311, 1355, 1356, 1357, 1358, 1359
    ];

    function deleteTargetImages() {
        console.log("Looking for target image containers...");

        let found = false;
        document.querySelectorAll("div.armour___fLnYY img").forEach(img => {
            const src = img.getAttribute("src");
            const match = src ? src.match(/ID=(\d+)/) : null;

            if (match) {
                const imgID = parseInt(match[1], 10);
                console.log(`Detected image with ID: ${imgID} in src attribute`);

                // Check if the ID is in the target list
                if (targetIDs.includes(imgID)) {
                    const parentDiv = img.closest("div.armour___fLnYY");
                    if (parentDiv) {
                        parentDiv.remove();
                        console.log(`Successfully deleted image ID: ${imgID}`);
                        found = true;
                    } else {
                        console.warn(`Failed to find container for image ID: ${imgID}`);
                    }
                } else {
                    console.info(`Image ID: ${imgID} is not in the target list, no action taken`);
                }
            } else {
                console.warn("No valid ID found in src attribute or src attribute missing");
            }
        });

        if (!found) {
            console.warn("No image containers were found. Retrying in 1 second...");
            setTimeout(deleteTargetImages, 1000); // Retry after 1 second if no elements found
        } else {
            console.log("Finished all target images.");
        }
    }

    // Run the function after page load
    window.addEventListener('load', deleteTargetImages);
})();
