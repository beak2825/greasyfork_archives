// ==UserScript==
// @name        Fallen London - Visible Air (Remake) - Upgrade to Mutation Observer 
// @namespace   com.delgadomartins.rafael
// @match       http*://www.fallenlondon.com/
// @version     1.2
// @author      Rafael Delgado Martins / Upgrade by Ceratius
// @description A remake of Traver's script: uses the Airs of London text to display the Airs range in the result summary.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538745/Fallen%20London%20-%20Visible%20Air%20%28Remake%29%20-%20Upgrade%20to%20Mutation%20Observer.user.js
// @updateURL https://update.greasyfork.org/scripts/538745/Fallen%20London%20-%20Visible%20Air%20%28Remake%29%20-%20Upgrade%20to%20Mutation%20Observer.meta.js
// ==/UserScript==

/*
 * Loosely based on logic from the original script by Travers (2015 version).
 * This version was written from scratch to work with the Fallen London redesigned page.
 * Also, some ideas were based/copied from Curwen Corey' scripts.
 */

const theAirsOfLondon = {
    "Ou": '0',
    "A bat": '1 - 10',
    "The s": '11 - 13',
    "I": '14 - 15',
    "A sm": '16 - 17',
    "A sh": '18 - 19',
    "A d": '20',
    "Sh": '21 - 30',
    "A rav": '31 - 32',
    "The wa": '33 - 40',
    "P": '41 - 42',
    "So": '43 - 44',
    "H": '45 - 46',
    "A w": '47 - 50',
    "Today, s": '51 - 60',
    "On": '61 - 62',
    "Oo": '63 - 65',
    "A gl": '66 - 68',
    "The c": '69 - 70',
    "A ca": '71 - 72',
    "St": '73',
    "A bar": '74 - 75',
    "A scu": '76 - 80',
    "The l": '81 - 82',
    "A ph": '83',
    "Tw": '84 - 88',
    "A po": '89',
    "Today, w": '91',
    "A rat": '90',
    "A cr": '92',
    "A ch": '93',
    "D": '94',
    "A h": '95',
    "The wi": '96',
    "A go": '97',
    "A sco": '99',
    "A be": '98',
    "Al": '100',
};

// Use MutationObserver to observe changes in the DOM
const observer = new MutationObserver(renderPreReqs);
observer.observe(document.body, { childList: true, subtree: true });

// Also, re-render after changing active tab (required to support Plans rendering)
let navLinks = document.querySelectorAll('li.nav__item');
if (navLinks.length) {
    for (let t = 0; t < navLinks.length; t++) {
        navLinks[t].addEventListener("click", renderPreReqs, false);
    }
}

function renderPreReqs() {
    // Search for the Airs of London quality update
    const qualityUpdateIconDiv = document.querySelector('div[aria-label="The Airs of London"]');

    // If the element exists
    if (qualityUpdateIconDiv) {
        // Get the innerText from the em element
        const qualityUpdateDiv = qualityUpdateIconDiv.closest('div.quality-update');
        const qualityUpdateBodyEm = qualityUpdateDiv.querySelector('em:not([airs-of-london])');

        // If the element was not updated yet
        if (qualityUpdateBodyEm) {
            const qualityUpdateBodyEmInnerText = qualityUpdateBodyEm.innerText;

            // Get the Airs Of London number
            let airsOfLondonNumber;

            for (const [text, numbers] of Object.entries(theAirsOfLondon)) {
                if (qualityUpdateBodyEmInnerText.startsWith(text)) {
                    airsOfLondonNumber = numbers;
                    break;
                }
            }

            // If the airsOfLondonNumber was found
            if (airsOfLondonNumber) {
                // Prepend the Airs Of London number before the original text
                qualityUpdateBodyEm.setAttribute('airs-of-london', 'visible');
                qualityUpdateBodyEm.innerText = `[${airsOfLondonNumber}] ${qualityUpdateBodyEmInnerText}`;
            } else {
                // Mark the element as updated and log a message
                qualityUpdateBodyEm.setAttribute('airs-of-london', 'not-found');
                console.warn('Airs Of London number not found!');
            }
        }
    }
}
