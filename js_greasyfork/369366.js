// ==UserScript==
// @name         YouTube, Load More Videos
// @namespace    driver8.net
// @version      0.1.1
// @description  Load more videos onto a YouTube channel's videos page without having to scroll. Click the "LOAD MORE" button next to "PLAY ALL" at the top of the video list to be prompted for the number of additional pages of videos to load. If you don't see the button, reload the page.
// @author       driver8
// @match        *://*.youtube.com/user/*/videos*
// @match        *://*.youtube.com/channel/*/videos*
// @match        *://*.youtube.com/c/*/videos*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369366/YouTube%2C%20Load%20More%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/369366/YouTube%2C%20Load%20More%20Videos.meta.js
// ==/UserScript==
(function() {
'use strict';

    console.log('hi, load more');

    var PAUSE_TIME = 10;
    var DEFAULT_PAGES = 5;

    var button_html = `<div id="load-more" class="style-scope ytd-channel-sub-menu-renderer">
<ytd-button-renderer button-renderer="" class="style-scope ytd-channel-sub-menu-renderer style-text" is-paper-button="">
<a class="yt-simple-endpoint style-scope ytd-button-renderer" tabindex="-1">
<paper-button role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" id="button" class="style-scope ytd-button-renderer style-text">
Load more
</paper-button>
</a>
</ytd-button-renderer>
</div>`
    var new_div = document.createElement('div');
    new_div.innerHTML = button_html.trim();
    new_div = new_div.firstElementChild;
    var temp1 = new_div.firstElementChild.innerHTML;
    document.querySelector('#primary-items').appendChild(new_div);
    window.setTimeout(function test1() {
        new_div.firstElementChild.innerHTML = temp1;
    }, 20);
    new_div.onclick = function() {
        var desired_pages = parseInt(prompt('Load how many pages', DEFAULT_PAGES));
        if (desired_pages > 0) {
            start_load(desired_pages);
        }
    };

    function start_load(num) {
        var i = 0,
            cont = document.getElementsByTagName('yt-next-continuation')[0],
            spin = document.getElementsByTagName('paper-spinner')[0];
        (function load_page() {
            if (spin.attributes['aria-hidden']) {
                cont.onShow();
                i++;
            }
            if (i < num) {
                window.setTimeout(load_page, PAUSE_TIME);
            }
        })();
    }
})();