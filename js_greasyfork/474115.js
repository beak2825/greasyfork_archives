// ==UserScript==
// @name         Hide facebook timelines
// @namespace    https://ahmed.rocks
// @version      0.11
// @description  Facebook minus any distractions
// @author       Ahmed Hassanein
// @match        https://*.facebook.com/*
// @icon         https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.facebook.com&size=64
// @grant        GM_addStyle
// @grant        window.onurlchange
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474115/Hide%20facebook%20timelines.user.js
// @updateURL https://update.greasyfork.org/scripts/474115/Hide%20facebook%20timelines.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const hideMainSection = "[role=main] { display: none !important; }"
    const hideTopNavigation = "[role=navigation] { display: none !important; }"
    const showMainSection = "[role=main] { display: flex !important; }"
    const hideMobile = "#MComposer, #MStoriesTray, #MFirstBatch { display: none !important; }"

    function onUrlChange({url}) {
        console.log('onUrlChange',url)
        //GM_addStyle(hideTopNavigation);

        const shouldHide = ['https://www.facebook.com/groups/feed/',
                            'https://www.facebook.com/groups/feed',
                            'https://www.facebook.com/',
                            'https://www.facebook.com',
                            'https://www.facebook.com/watch/?ref=tab',
                            'https://www.facebook.com/watch/',
                            'https://www.facebook.com/watch'
                           ].includes(url)

        if (shouldHide){
            GM_addStyle(hideMainSection);
        }else{
            GM_addStyle(showMainSection);
        }

        if(['https://m.facebook.com/', 'https://m.facebook.com'].includes(url)){
            GM_addStyle(hideMobile);
            try {
                document.querySelector("[aria-label=\"Make a Post on Facebook\"]").parentElement.parentElement.parentElement.style.display = 'none';
            } catch (e){}

            try {
                // stories
                document.querySelector("[data-mcomponent=\"ImageArea\"]").parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none';
            } catch (e){}

            GM_addStyle("[data-tracking-duration-id] { visibility: hidden !important; }");
        } else {
            GM_addStyle("[data-tracking-duration-id] { visibility: flex !important; }");
        }
    }

    window.addEventListener('urlchange', onUrlChange);

    onUrlChange({url: window.location.href})
})();