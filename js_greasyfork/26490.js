// ==UserScript==
// @name         YouTube Gaming link
// @namespace    http://thepsionic.com
// @version      0.1.3
// @description  Adds a YouTube Gaming link in the action button panel of a YouTube video
// @author       ThePsionic
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26490/YouTube%20Gaming%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/26490/YouTube%20Gaming%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var id = getParameterByName("v");
    var actionlist = document.getElementById("watch8-secondary-actions");
    actionlist.innerHTML = actionlist.innerHTML + "<div class='yt-uix-menu' id='gaming-link'><button class='yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-tooltip' title='Watch on YouTube Gaming' data-tooltip-text='Watch on YouTube Gaming' onclick='location.href=\"https://gaming.youtube.com/watch?v=" + id + "\"'>YouTube Gaming</a></div>";
})();

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}