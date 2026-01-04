// ==UserScript==
// @name         Mass scavening tool 2
// @namespace    http://tampermonkey.net/
// @version      2024-04-09
// @description  tribal wars auto mass scavening tool 2
// @author       LZ
// @match        https://greasyfork.org/en
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @match        https://*/game.php?*screen=place&mode=scavenge_mass*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492309/Mass%20scavening%20tool%202.user.js
// @updateURL https://update.greasyfork.org/scripts/492309/Mass%20scavening%20tool%202.meta.js
// ==/UserScript==

console.log("Mass scavenging init");

// Set premium button enabled to false
var premiumBtnEnabled = false;

// Load external script
const RELOAD_IN_MINUTES = 5;
setTimeout(function () {
    // Reload the page
    location.reload();
}, RELOAD_IN_MINUTES * 60 * 1000); // reload period ms

$.getScript('https://shinko-to-kuma.com/scripts/massScavenge.js', function () {
    // After script is loaded, wait for 3 seconds
    setTimeout(function () {
        // Submit element with id "sendMass"
        document.getElementById('sendMass').click();

        // Wait for 8 seconds
        setTimeout(function () {
            // Submit all elements with id "sendMass" and class "btnSophie"
            var elements = document.querySelectorAll('.btnSophie#sendMass');
            var index = 0;
            var interval = setInterval(function () {
                if (index < elements.length) {
                    elements[index].click();
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, 500); // Pause between clicks
        }, 2000);
    }, 2000);
});

function hashString(s) {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function analyzeTable() {
    const table = document.querySelector('.vis.mass-scavenge-table');
    let classesString = '';

    // Iterate through each row
    table.querySelectorAll('tr').forEach(row => {
        // Iterate through each cell
        row.querySelectorAll('td').forEach(cell => {
            // Check for classes of interest and append them to the classesString
            const optionClasses = ['option-1', 'option-2', 'option-3', 'option-4'];
            const statusClasses = ['option-inactive', 'option-active', 'option-locked'];
            optionClasses.forEach(optionClass => {
                if (cell.classList.contains(optionClass)) {
                    statusClasses.forEach(statusClass => {
                        if (cell.classList.contains(statusClass)) {
                            classesString += `${optionClass} ${statusClass} `;
                        }
                    });
                }
            });
        });
    });

    // Hash the final string of classes
    return hashString(classesString.trim());
}

const firstHash = analyzeTable();
console.log(firstHash);
setInterval(function () {
    const lastHash = analyzeTable();
    console.log(lastHash);
    if (lastHash !== firstHash) {
        location.reload();
    }
}, 5 * 1000); // reload period ms

