// ==UserScript==
// @name         resource.AddWorkshop Generator
// @version      1.0.1
// @description  Extract item IDs and names for Garry's Mod to help quickly create a resource.AddWorkshop lua file.
// @author       Eggroll & ChatGPT
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @grant        none
// @namespace https://greasyfork.org/users/1248228
// @downloadURL https://update.greasyfork.org/scripts/484882/resourceAddWorkshop%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/484882/resourceAddWorkshop%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the subscribeCollection element is present
    var subscribeCollection = document.querySelector('.subscribeCollection');
    if (subscribeCollection) {
        // Your code here
        var mods = Array.from(document.querySelectorAll('[id^="sharedfile_"]')).map(mod => {
            var modId = mod.id.replace('sharedfile_', '');
            var modName = mod.querySelector('.workshopItemTitle').textContent;
            return { id: modId, name: modName };
        });

        var luaOutput = mods.map(mod => `resource.AddWorkshop( "${mod.id}" ) -- ${mod.name}`).join('\n');

        // Create a button
        var button = document.createElement('button');
        button.textContent = 'Copy GLua List';

        // Copy styles from the general_btn subscribe button
        var referenceButton = document.querySelector('.general_btn.subscribe');
        if (referenceButton) {
            var computedStyles = window.getComputedStyle(referenceButton);
            for (var i = 0; i < computedStyles.length; i++) {
                button.style[computedStyles[i]] = computedStyles.getPropertyValue(computedStyles[i]);
            }
        }

        // Explicitly set white-space property to nowrap
        button.style.whiteSpace = 'nowrap';

        // Set text-align to center
        button.style.textAlign = 'center';

        // Attach the button to the subscribeCollection element
        subscribeCollection.appendChild(button);

        // Add hover styles
        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = '#97C0E3';
            button.style.setProperty('-webkit-text-fill-color', '#3C3D3E', 'important'); // Why not just use color? hhh
        });

        // Set padding to 0 on both x and y axes
        button.style.padding = '0';

        button.style.width = '126px';

        // Add mouseout styles
        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = '#0e1720'; // Revert to default
            button.style.setProperty('-webkit-text-fill-color', '#939393', 'important');
        });

        // Add a click event listener to the button
        button.addEventListener('click', function() {
            // Print the lua code in console as a fallback in case this fails for some reason
            console.log(`${luaOutput}`);
            // Copy luaOutput to clipboard
            navigator.clipboard.writeText(luaOutput.replace(/^\s*[\r\n]/gm, '')).then(function() { // Need to use replace to remove empty line breaks because for some reason they exist. bug?
                // Change button text after copying
                button.textContent = 'Copied!';
                // Reset button text after 2 seconds
                setTimeout(function() {
                    button.textContent = 'Copy Glua List';
                }, 2000);
            }).catch(function(err) {
                console.error('Unable to copy text to clipboard!!!', err);
            });
        });
    }
})();