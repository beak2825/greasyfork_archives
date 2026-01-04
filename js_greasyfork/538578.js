// ==UserScript==
// @name         Rule34Video - Automatic Best Quality Selector
// @namespace    http://tampermonkey.net/
// @version      3.1.2
// @description  Automatically sets the best available quality (4K, 1080p, 720p, or 480p) on Rule34Video.com.
// @author       LoopFix
// @match        https://rule34video.com/video/*
// @icon         https://i.ibb.co/RTQLcyFm/favicon-32x32.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538578/Rule34Video%20-%20Automatic%20Best%20Quality%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/538578/Rule34Video%20-%20Automatic%20Best%20Quality%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- SCRIPT CONFIGURATION ---
    const LOCAL_STORAGE_KEY = 'kvsplayer_selected_format';
    const QUALITY_ELEMENT_XPATH = '//*[@id="tab_video_info"]/div[5]/div/a[1]';

    // This is our lookup table. It maps the text found on the page
    // to the value the player understands in localStorage.
    const qualityMap = {
        '2160p': '4k',
        '1080p': '1080p',
        '720p':  '720p',
        '480p':  '480p' // Added 480p support
    };

    let hasCompleted = false;

    console.log('[Auto Quality] Script starting, using multi-quality XPath method.');

    function findElementByXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    function setBestAvailableQuality() {
        if (hasCompleted) {
            return;
        }

        const highestQualityLink = findElementByXPath(QUALITY_ELEMENT_XPATH);

        if (!highestQualityLink) {
            console.log(`[Auto Quality] XPath element ('${QUALITY_ELEMENT_XPATH}') not found yet. Waiting...`);
            return;
        }

        console.log('[Auto Quality] Found element via XPath!');
        if (observer) {
            observer.disconnect();
            console.log('[Auto Quality] Observer disconnected to save resources.');
        }
        hasCompleted = true;

        const linkText = highestQualityLink.textContent.trim();
        console.log(`[Auto Quality] Highest quality link text is: "${linkText}"`);

        let qualityWasSet = false;

        for (const qualityText in qualityMap) {
            if (linkText.includes(qualityText)) {
                const formatToSet = qualityMap[qualityText];
                localStorage.setItem(LOCAL_STORAGE_KEY, formatToSet);
                console.log(`%c[Auto Quality] SUCCESS: Found "${qualityText}" and set preference to "${formatToSet}".`, 'color: green; font-weight: bold;');
                qualityWasSet = true;
                break;
            }
        }

        if (!qualityWasSet) {
            console.warn(`[Auto Quality] NOTE: Highest quality found ("${linkText}") is not a targeted quality. No preference was set.`);
        }
    }

    const observer = new MutationObserver(() => {
        setBestAvailableQuality();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setBestAvailableQuality();

})();