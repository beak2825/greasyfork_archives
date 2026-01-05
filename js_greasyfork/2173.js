// ==UserScript==
// @name          Google - Change "Videos" tab to "YouTube"
// @namespace     http://userscripts.org/users/23652
// @description   Replaces the "Videos" navigation tab with "YouTube" so you can easily go to YouTube with your Google search query
// @include       http://www.google.com/search?*q=*
// @include       https://www.google.com/search?*q=*
// @copyright     JoeSimmons
// @version       1.0.2
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/2173/Google%20-%20Change%20%22Videos%22%20tab%20to%20%22YouTube%22.user.js
// @updateURL https://update.greasyfork.org/scripts/2173/Google%20-%20Change%20%22Videos%22%20tab%20to%20%22YouTube%22.meta.js
// ==/UserScript==

(function () {
    var videosLink = document.querySelector('#hdtb-msb .hdtb-mitem a[href*="&tbm=vid"]'),
        intv;

    function changeLink() {
        if (videosLink.firstChild.data === 'YouTube' && videosLink.href.indexOf('youtube.com') !== -1) {
            return window.clearInterval(intv);
        }

        // change the link's text
        videosLink.firstChild.data = 'YouTube';

        // change the link's url
        videosLink.href = 'https://www.youtube.com/results?search_query=' + location.href.match(/[?&]?q=([^&]*)/)[1];
    }

    // make sure the page is not in a frame
    // and if there is a "Videos" link
    if (window.frameElement || window !== window.top || !videosLink) { return; }

    // change the link's text
    // keep changing it until it actually changes... sometimes it doesn't work right away

    intv =  window.setInterval(changeLink, 500);
}());