// ==UserScript==
// @name         YouTube, Filter Videos List
// @namespace    driver8.net
// @version      0.1.2
// @description  Filter the videos listed on a YouTube channel's videos page. Click "FILTER VIDEOS" next to "PLAY ALL" at the top of the videos list, then enter the string to search for. Start your entry with '!' to show only videos that DON'T contain that string.
// @author       driver8
// @match        *://*.youtube.com/user/*/videos*
// @match        *://*.youtube.com/channel/*/videos*
// @match        *://*.youtube.com/c/*/videos*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369364/YouTube%2C%20Filter%20Videos%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/369364/YouTube%2C%20Filter%20Videos%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('hi, filter videos');

    var filtered = [];
    var button_html = `<div id="load-more" class="style-scope ytd-channel-sub-menu-renderer">
<ytd-button-renderer button-renderer="" class="style-scope ytd-channel-sub-menu-renderer style-text" is-paper-button="">
<a class="yt-simple-endpoint style-scope ytd-button-renderer" tabindex="-1">
<paper-button role="button" tabindex="0" animated="" aria-disabled="false" elevation="0" id="button" class="style-scope ytd-button-renderer style-text">
Filter videos
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
    }, 50);
    new_div.onclick = filter_videos;

    function filter_videos() {
        var q = prompt('Enter word to filter', '');
        var neg = false;
        if (q.charAt(0) === '!') {
            neg = true;
            q = q.substr(1);
        }
        filtered.forEach(el => { el.hidden = false; });
        var vids = document.querySelectorAll('#content #items > ytd-grid-video-renderer.ytd-grid-renderer');
        if (vids.length < 1) { // page is using flow=list instead of grid
            vids = document.querySelectorAll('ytd-item-section-renderer');
        }
        vids = Array.from(vids);
        var good = vids.filter(el => el.offsetParent !== null);
        var re = new RegExp(q, 'i');
        filtered = good.filter(el => {
            var title = el.querySelector('a#video-title').textContent.trim();
            return neg ^ !re.test(title);
        });
        console.log('filtered', filtered);
        filtered.forEach(el => { el.hidden = true; });
    }
})();