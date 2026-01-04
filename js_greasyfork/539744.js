// ==UserScript==
// @name         m.YouTube.com open video links in new tab on subscriptions page
// @namespace    m-youtube-com-open-links-in-new-tab
// @version      1.0
// @description  Opens youtube video links in new tab on the subscriptions page. Works on mobile or tablet only (m.youtube.com).
// @author       hlorand.hu
// @match        https://m.youtube.com/feed/subscriptions
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/539744/mYouTubecom%20open%20video%20links%20in%20new%20tab%20on%20subscriptions%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/539744/mYouTubecom%20open%20video%20links%20in%20new%20tab%20on%20subscriptions%20page.meta.js
// ==/UserScript==


(function() {

    setInterval(() => {
        document.querySelectorAll('a[href*="watch?v="]:not([target="_blank"])').forEach(a => {
            a.setAttribute('target', '_blank');
        });
    }, 1000);

})();