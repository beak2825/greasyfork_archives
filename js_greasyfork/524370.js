// ==UserScript==
// @name YouTube Helper
// @namespace ccn0
// @version 8
// @description Quality of life changes to YouTube
// @author CCN0
// @license MIT
// @match *://*.youtube.com/*
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAS1BMVEVHcEz/ADP/ADP/ADP/ADP/ADP/ADP/ADP/ADP/ADP/ADP/ADP/ADP/ADP/////AC//DUX/ACD/6+//RGP/ztf/q7n/hpn/H0n/Z35pZ192AAAADXRSTlMAZEr3h8U0rO3dGpd77vd9UAAAAXZJREFUWIXtlsl2hCAQRZkLZHBs7f//0mAn8ZBOF9CSRRa+pZ66Yg3UI+TSpX+lTilGqbAAUhpjtObcH+Jc6/hQSgArKGVKdU/hDoxOAkri2oBLwkV9aCrRGH8QTsd/E87He994AO/3TMoWgIz1Ny0A0xH1Rvl/SyvCWuK9Z4Si7/oaAMWLMFQRBLHY97dlHssISwADDCHc5rEEALQNdkCY1rHPn0ISrA0egIi451NhSoAQliGXCkN0CRBTseGp0ARrxAQQlhU9BEeHOQVExB1DVAL2/3hNqAaEpQ2AlrMOgDcUrynj3tJ4FcqA7FCVO3Fas71s8sMUptuYn2mZByxzYRgjIHMfTBU3CqA3kt9WpPd+yBKHveorLrR9NeG3cpVo615Q7ZupbTfKrnE7Q1zvTUlgu8PAxqlC+mFxzqeRq0+Xdfon2OFS4cQhOKRuVVGQb+RCS6DqpWHuFIuO2TkhhI22+UvW2vjAueiSmeqebfKlS3+gDxqiielmSzQ+AAAAAElFTkSuQmCC
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/524370/YouTube%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/524370/YouTube%20Helper.meta.js
// ==/UserScript==

(function() {
    const YTHELPERINTERVAL = setInterval(youTubeHelper, 500);

    function youTubeHelper() {
        /* make player have sharp corners */
        if (document.querySelector('ytd-player')) {
            document.querySelector('ytd-player').style.borderRadius = "0";
        };
        /* make notifications badge white */
        if (document.querySelector('.yt-spec-icon-badge-shape__badge')) {
            document.querySelector('.yt-spec-icon-badge-shape__badge').style.color = "#fff";
        };
        /* hides notification amount in tab title */
        document.title = document.title.replace(/^\([0-9]*\)\s/, "");

        function removeElements(...selectors) {
            selectors.forEach(selector=>{
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.remove();
                });
            });
        };

        /* REMOVES:
         * Voice Search button
         * Thanks button
         * Join button
         * Infocards menu
         * Hashtags
         * Channel Watermark
         * YouTube Shorts section
         * YouTube Playables section
         * and all other rich sections
         * Mix playlists
         * AI Video summary
        */
        removeElements(
            'button[aria-label="Search with your voice"]',
            'button[aria-label="Thanks"]',
            'button[aria-label="Join this channel"]',
            'ytd-video-description-infocards-section-renderer',
            'a.yt-simple-endpoint.style-scope.yt-formatted-string.bold',
            'a.yt-simple-endpoint.bold.style-scope.yt-formatted-string',
            '.ytd-watch-info-text>a',
            'button:has([aria-label="Channel watermark"])',
            'ytd-rich-section-renderer',
            'ytd-reel-shelf-renderer',
            "ytd-rich-item-renderer:has(h3[title^='Mix - '])",
            "[has-video-summary]");

        /* remove link referrals */
        document.querySelectorAll('a[href*="://www.youtube.com/redirect?"]').forEach(link => {
            if (link.getAttribute('href')) {
                const urlParams = new URLSearchParams(link.getAttribute('href'));
                const qParam = decodeURIComponent(urlParams.get('q'));

                if (qParam) {
                    link.setAttribute('href', qParam);
                };
            };
        });

        /* share prompt shows URL without referral*/
        const shareUrlInput = document.getElementById('share-url');
        if (shareUrlInput) {
            let currentUrl = shareUrlInput.value;
            currentUrl = currentUrl.replace(/(\?|\&)si=[^&]*/g, '');
            shareUrlInput.value = currentUrl;
        };

        /* redirects from shorts player to normal player */
        if (window.location.href.includes('shorts/')) {
            let noshortsurl = window.location.href.replace('shorts/', 'watch?v=');
            clearInterval(YTHELPERINTERVAL);
            window.location.href = noshortsurl;
        };

        /* skip gate for restricted videos */
        const reasonText = document.querySelector("#reason");
        if (reasonText) {
            if (reasonText.textContent == "This video may be inappropriate for some users.") {
                const url = new URL(window.location.href);
                url.searchParams.set('rco', '1');
                clearInterval(YTHELPERINTERVAL);
                window.location.href = url.toString();
            };
        };
    };
})();