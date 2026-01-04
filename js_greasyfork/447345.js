// ==UserScript==
// @name         MidJourney Auto-Click Save Icon Automation
// @namespace    http://drew3d.com/
// @version      0.1
// @description  Repeatedly click the "Save with prompt" button, then the "Previous" button.
// @author       @JustOurStyle#5471
// @match        https://www.midjourney.com/app/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447345/MidJourney%20Auto-Click%20Save%20Icon%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/447345/MidJourney%20Auto-Click%20Save%20Icon%20Automation.meta.js
// ==/UserScript==
/* globals jQuery, $ */

/*
    HOW TO USE

    1) Install this script with Tampermonkey (or other equivalent script utility).
    2) Go to your gallery on midjourney.com, enable this script, and refresh the page.
    3) Then click through to (embiggen) the oldest image you want to save.
    4) This script will click "Save with prompt" to save it, and then click "Previous".
    5) It will repeatedly do this until there is no more Previous button (i.e. your first image)
    6) This can take a while, so just wait until it is finished (usually 1-2 seconds per image)
    7) Then, disable the script and refresh the page to turn it off.

    NOTE: You may need to make sure downloads are set to Automatically save, and you may need to Allow multiple downloads.

    NOTE: As of July 2022, images with no text prompt are not saved due to a bug on the MidJourney site.

*/

(function() {
    'use strict';

    console.log('MidJourney Auto-Click Save Icon Automation');

    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    }).observe(document, {subtree: true, childList: true});

    function onUrlChange() {
        console.log('URL changed = ' + location.href);
        if (location.href.match(/https:\/\/www.midjourney.com\/app\/jobs\//))
        {
            console.log('URL match');
            setTimeout(function(){
                $('button[title="Save with prompt"]').trigger('click');
            }, 500);
        }
    }

    setInterval(function(){
        if (location.href.match(/https:\/\/www.midjourney.com\/app\/jobs\//))
        {
            if ($('button[title="Previous"]').length)
            {
                $('button[title="Previous"]').trigger('click');
            }
            else
            {
                clearInterval();
                console.log('MidJourney Auto-Click Save Icon: Batch download finished');
            }
        }
    }, 1500);


})();
