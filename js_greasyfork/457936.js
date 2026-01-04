// ==UserScript==
// @name        Glassfrog Projects sort by timestamp
// @namespace   https://github.com/pusi77
// @match       https://app.glassfrog.com/organizations/*/orgnav/roles/*/projects*
// @grant       none
// @version     1.4
// @author      pusi77
// @description Sorts projects from Projects page based on the creation date
// @downloadURL https://update.greasyfork.org/scripts/457936/Glassfrog%20Projects%20sort%20by%20timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/457936/Glassfrog%20Projects%20sort%20by%20timestamp.meta.js
// ==/UserScript==
const delay = ms => new Promise(res => setTimeout(res, ms));

function parseDateFromString(dateString) {
    const parts = dateString.match(/(\d+) (\w+) old/);
    if (!parts) return null;

    const amount = parseInt(parts[1]);
    const unit = parts[2];

    const currentDate = new Date();
    if (unit.includes("year")) {
        currentDate.setFullYear(currentDate.getFullYear() - amount);
    } else if (unit.includes("month")) {
        currentDate.setMonth(currentDate.getMonth() - amount);
    } else if (unit.includes("day")) {
        currentDate.setDate(currentDate.getDate() - amount);
    }

    return currentDate;
}

window.addEventListener('load', async function() {
    await delay(5000); // wait for other Javascript to do its magic

    console.log("Sorting...");

    var projectsTab = document.getElementById("projects-tab");
    array = Array.from(projectsTab.querySelectorAll("*[class^=\"item--\"]"))
        .sort((a, b) => {
            var firstDateStr = a.querySelectorAll("*[class^=\"itemDetailRow--\"]")[0].children[2].textContent;
            var secondDateStr = b.querySelectorAll("*[class^=\"itemDetailRow--\"]")[0].children[2].textContent;

            // Parse the date strings into Date objects
            var firstDate = parseDateFromString(firstDateStr);
            var secondDate = parseDateFromString(secondDateStr);

            // Compare the Date objects
            if (firstDate && secondDate) {
                return secondDate - firstDate;
            } else {
                // Handle cases where date parsing fails
                return 0;
            }
        })
        .forEach(li => projectsTab.getElementsByTagName("li")[0].parentElement.appendChild(li));

    console.log("Sorting completed!");
}, false);
