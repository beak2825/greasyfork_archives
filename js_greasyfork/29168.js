// ==UserScript==
// @name         YT - Watch Later
// @version      0.3.2
// @description  Adds all your unwatched subscriptions to Watch Later
// @author       Cáno
// @match        https://www.youtube.com/feed/subscriptions
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/29168/YT%20-%20Watch%20Later.user.js
// @updateURL https://update.greasyfork.org/scripts/29168/YT%20-%20Watch%20Later.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var delay = 0;

    setTimeout(function () {
        var els = document.getElementsByClassName("addto-watch-later-button");

        Array.prototype.forEach.call(els, function(el) {
            delay += 500;
            var elem = $(el).parent().parent();
            //console.log(elem.find('.yt-uix-livereminder').length);
            setTimeout(function () {
                if (el.parentElement.getElementsByClassName("yt-uix-sessionlink")[0].getElementsByClassName("watched-badge")[0] === undefined &&
                    el.parentElement.getElementsByClassName("resume-playback-progress-bar")[0] === undefined &&
                    elem.find('.yt-lockup-meta-info li:last-child').text().substr(0, 10) !== "Transmisja" &&
                    elem.find('.yt-uix-livereminder').length === 0 &&
                    elem.find('span[title="Requires payment to watch"]').length === 0 &&
                    elem.find('.yt-badge').length === 0
                   ) {
                    el.click();
                }
            }, delay);
        });
    }, 3200);

})();