// ==UserScript==
// @name         Emphasize Quotes
// @namespace    ChatFormatting
// @match        https://*.character.ai/*
// @grant        none
// @license      MIT
// @version      1.2
// @author       upa
// @description  Makes surrounding text lighter while making text within quotations stand out. Supports Safari and works with FixSpacing.
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/544771/Emphasize%20Quotes.user.js
// @updateURL https://update.greasyfork.org/scripts/544771/Emphasize%20Quotes.meta.js
// ==/UserScript==

// Color of text wrapped in quotations
// Default: "#FFFFFF";
const quoteColor = "#FFFFFF";

// Color of surrounding text
// Default: "#B2B2B2";
const textColor = "#B2B2B2";

// How big do you want quoted text to be? (Non-Safari ONLY!)
// Default: "1.05em";
const fontSize = "1.05em";

(function () {

    // Apply the base CSS for gray text and better spacing
    let css = `
        .markdown-wrapper p { color: ${textColor}; }
    `;

    var head = document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.setAttribute("type", 'text/css');
    style.innerHTML = css;
    head.appendChild(style);

    // Check if an element is visible
    function isVisible(elem) {
        return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
    }

    // Emphasize quotes by making them the specified color
    let timeoutId;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    function changeColors() {
        clearTimeout(timeoutId);
        const pTags = document.querySelectorAll('.markdown-wrapper p[node="[object Object]"]:not([data-color-changed="true"])');
        let changed = false;
        const regex = /(["“”«»].*?["“”«»])/g;

        for (let pTag of pTags) {
            if (!isVisible(pTag)) {
                continue;
            }

            let text = pTag.innerHTML;
            if (regex.test(text)) {
                text = text.replace(regex, '<span style="color: ' + quoteColor + (isSafari ? '' : '; font-size: ' + fontSize) + '">$1</span>');
                pTag.innerHTML = text;
                pTag.dataset.colorChanged = 'true';
                changed = true;
            }
        }
    }

    function checkForChanges(mutations) {
        if (mutations.length > 0) {
            changeColors();
        }
    }

    const observer = new MutationObserver(checkForChanges);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

})();