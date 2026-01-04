// ==UserScript==
// @name        Bing Videos redirector
// @match       https://www.bing.com/videos/*
// @grant       none
// @version     2.1
// @author      KZiad
// @license     MIT
// @description Redirects to youtube/tiktok when you open a video on bing videos. Credit goes to qoiqoi (https://greasyfork.org/en/users/1328793-qoiqoi) for making the script more reliable
// @namespace https://greasyfork.org/users/1090156
// @downloadURL https://update.greasyfork.org/scripts/467816/Bing%20Videos%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/467816/Bing%20Videos%20redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const regexPatternYT = /youtube\.com\/embed\/(.+)\?.*/;
    const regexPatternTiktok = /tiktok\.com\/embed\/v3\/(.+)\?.*/;

    const checkIframes = () => {
        const iframes = document.getElementsByTagName('iframe');
        for (let iframe of iframes) {
            //Youtube Match
            let matchYT = iframe.src.match(regexPatternYT);
            let matchTiktok = iframe.src.match(regexPatternTiktok);
            if (matchYT && matchYT[1]) {
                let newUrl = 'https://youtu.be/' + matchYT[1];
                history.replaceState(null, null, window.location.href);
                window.location.replace(newUrl);
                break;
            }
            else if (matchTiktok && matchTiktok[1]){
                let publishUser = document.getElementsByClassName("publishUser")[0].textContent;
                let newUrl = `https://www.tiktok.com/@${publishUser}/video/${matchTiktok[1]}?`;
                history.replaceState(null, null, window.location.href);
                window.location.replace(newUrl);
                break;
            }
        }
    };

    checkIframes();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                checkIframes();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();