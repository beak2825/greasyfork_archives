// ==UserScript==
// @name         Unspoil matches in Cagematch
// @description  Unspoils matches in cards and wrestler pages
// @version      1.9
// @match        https://www.cagematch.net/?id=1&nr=*
// @icon         https://www.google.com/s2/favicons?domain=www.cagematch.net
// @license      GPL-3
// @namespace    https://greasyfork.org/users/1336798
// @downloadURL https://update.greasyfork.org/scripts/523918/Unspoil%20matches%20in%20Cagematch.user.js
// @updateURL https://update.greasyfork.org/scripts/523918/Unspoil%20matches%20in%20Cagematch.meta.js
// ==/UserScript==

// Store original content
const originalContent = new Map();
// Add toggle button
const toggleButton = document.createElement('button');
toggleButton.innerHTML = 'Toggle Spoilers';
toggleButton.style.marginLeft = '10px';
toggleButton.style.padding = '2px 8px';

// Find NavigationTreeBranch and insert button after it
const navTreeBranch = document.querySelector('.NavigationTreeBranch:last-child');
if (navTreeBranch) {
    navTreeBranch.parentNode.insertBefore(toggleButton, navTreeBranch.nextSibling);
}
let spoilersHidden = true;
function toggleSpoilers() {
    if (spoilersHidden) {
        showSpoilers();
        spoilersHidden = false;
        toggleButton.innerHTML = 'Hide Spoilers';
    } else {
        hideSpoilers();
        spoilersHidden = true;
        toggleButton.innerHTML = 'Show Spoilers';
    }
}

function hideSpoilers() {
    document.querySelectorAll('.MatchNotes').forEach(el => {
        if (!el.innerText.includes("Info:")) {
            if (!originalContent.has(el)) {
                originalContent.set(el, { display: el.style.display, content: el.innerHTML });
            }
            displayNone(el);
        }
    });

    document.querySelectorAll('.MatchResults, .MatchCard').forEach(el => {
        if (!originalContent.has(el)) {
            originalContent.set(el, { display: el.style.display, content: el.innerHTML });
        }
        clean(el);
    });
}

function showSpoilers() {
    originalContent.forEach((value, element) => {
        element.style.display = value.display;
        element.innerHTML = value.content;
    });
}

function displayNone(el) {
    el.style.display = 'none';
}

function unspoil(html) {
    return html.replace(/ defeats? | besieg(?:en|t) /gmi, ' vs. ').replace(/ [au]nd /gm, ' vs. ').split(' vs. ').sort().join(' vs. ');
}
function clean(el) {
    var newHtml = el.innerHTML;
    newHtml = newHtml.replace(/ \[.*?\]/g, "");
    newHtml = newHtml.replace(/TITELWECHSEL !!!/g, "");
    newHtml = newHtml.replace(/( ?:- )?(?:No Contest|Time Limit Draw|by referee's decision|by Count Out|by Referee Stoppage|Double Count Out|Draw|Double Count Out|Draw|Double Knock Out|Double Knockout|Double KO|Double Pinfall|by DQ|by TKO|Double Pin|by KO|Double DQ|by forfeit|Curfew Time Limit Draw|by points|by Ringrichterenstcheid|Double Give Up|durch DQ| - )/gi, "");
    var timeMatch = newHtml.match(/ (?<time>\(\d+):\d{2}\)/);
    if (timeMatch !== null) {
        var time = timeMatch.groups["time"];
        newHtml = unspoil(newHtml.replace(/ (?<time>\(\d+:\d{2}\)).*/, '').trimEnd()).concat(' ').concat(time).concat('m)');
    } else {
        newHtml = unspoil(newHtml);
    }
    el.innerHTML = newHtml;
}

// Event Listener for the button
toggleButton.addEventListener('click', toggleSpoilers);

// Initial hide spoilers
hideSpoilers();