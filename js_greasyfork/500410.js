// ==UserScript==
// @name         Torn Crimes Hide Outcome Flavor Text
// @namespace    https://github.com/SOLiNARY
// @version      0.3.1
// @description  Allows to toggle (hide/show) visibility for crimes outcome flavor text
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/500410/Torn%20Crimes%20Hide%20Outcome%20Flavor%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/500410/Torn%20Crimes%20Hide%20Outcome%20Flavor%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';

    let tornPdaLoadedFlag = false;
    if (tornPdaLoadedFlag || isTampermonkeyEnabled ? unsafeWindow.tornCrimesHideOutcomeFlavorTextLoadedFlag : window.tornCrimesHideOutcomeFlavorTextLoadedFlag){
        return;
    }
    tornPdaLoadedFlag = true;
    setScriptLoadState();

    GM_addStyle(`
        div.silmarilPopOutText {
            position: absolute;
            color: #37b24d;
            font-size: 16px;
            display: none;
            user-select: none;
            pointer-events: none;
            text-shadow: 0.5px 0.5px 0.5px black, 0 0 1em black, 0 0 0.2em black;
        }`);
    const hideOutcomeFlavorTextFlagRaw = localStorage.getItem("silmaril-torn-hide-crimes-outcome-flavor-text") ?? true;
    let hideOutcomeFlavorTextFlag = hideOutcomeFlavorTextFlagRaw !== 'false';

    toggleOutcomeFlavorTextVisibility();

    $("div.crimes-app").on("click", "[class*=heading___]", function(event) {
        hideOutcomeFlavorTextFlag = !hideOutcomeFlavorTextFlag;
        localStorage.setItem("silmaril-torn-hide-crimes-outcome-flavor-text", hideOutcomeFlavorTextFlag);
        showPopOutText(hideOutcomeFlavorTextFlag ? 'HIDING outcome flavor text!' : 'SHOWING outcome flavor text!', event.clientX, event.clientY, hideOutcomeFlavorTextFlag);
        toggleOutcomeFlavorTextVisibility();
    });

    function toggleOutcomeFlavorTextVisibility(){
        GM_addStyle(`
            div[class*=outcome___] p[class*=story___] {
                display: ${hideOutcomeFlavorTextFlag ? 'none' : 'block'};
            }
        `);
    }

    function showPopOutText(text, mouseX, mouseY, isSuccess = true, delay = 2000) {
        // Create pop-out text element
        let popOutText = document.createElement('div');
        popOutText.className = 'silmarilPopOutText';
        popOutText.style.color = isSuccess ? '#37b24d' : '#f03e3e';
        popOutText.innerText = text;

        // Append element to the body
        document.body.appendChild(popOutText);

        // Adjust for scroll position
        let scrollX = window.scrollX || window.pageXOffset;
        let scrollY = window.scrollY || window.pageYOffset;

        // Set random position within a specific radius
        let minAngle = 0.99; // Adjust this angle as needed
        let maxAngle = 0.99;
        let minRadius = 30; // Adjust this radius as needed
        let maxRadius = 40;
        let angle = (Math.random() * (maxAngle - minAngle) + minAngle) * Math.PI * 2;
        let radius = (Math.random() * (maxRadius - minRadius) + minRadius);
        let randomX = mouseX + Math.cos(angle) * radius + scrollX;
        let randomY = mouseY + Math.sin(angle) * radius + scrollY;

        // Set pop-out text position
        popOutText.style.left = randomX + 'px';
        popOutText.style.top = randomY + 'px';

        // Show pop-out text
        popOutText.style.display = 'block';

        // Fade away and disappear after a few seconds
        setTimeout(function() {
            popOutText.style.opacity = 0;
            setTimeout(function() {
                document.body.removeChild(popOutText);
            }, 500); // 500ms delay for removal after fade
        }, delay); // 2000ms (2 seconds) delay for fade
    }

    function setScriptLoadState() {
        try {
            if (isTampermonkeyEnabled) {
                unsafeWindow.tornCrimesHideOutcomeFlavorTextLoadedFlag = tornPdaLoadedFlag;
            } else {
                window.tornCrimesHideOutcomeFlavorTextLoadedFlag = tornPdaLoadedFlag;
            }
        } catch (e) {
            console.error('[TornCrimesHideOutcomeFlavorText] Failed to get script load state!', e);
        }
    }
})();