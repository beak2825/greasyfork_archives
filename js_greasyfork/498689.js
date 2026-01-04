// ==UserScript==
// @name         Clear YouTube Playlist
// @namespace    http://github.com/lugosieben
// @version      1.1
// @description  Adds a button!
// @author       lugosieben
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/498689/Clear%20YouTube%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/498689/Clear%20YouTube%20Playlist.meta.js
// ==/UserScript==

(function() {
    var latestParagraph;
    var interval;
    function run () {
    if (latestParagraph) latestParagraph.remove()
    setTimeout(() => {
        'use strict';

    let descriptionElement = document.getElementsByClassName("description")[0]
    if (!descriptionElement) return;
    let descriptionSpan = descriptionElement.querySelector("#snippet").querySelector("#snippet-text").querySelector("#plain-snippet-text")

    let paragraph = document.createElement("p")
    paragraph.innerHTML = "<a><u>Clear this playlist</u></a>"
    paragraph.class = "clear-youtube-playlist-paragraph"
    paragraph.style = "cursor:pointer"
    paragraph.onclick = () => {
    interval = setInterval(function () {
            let video = document.getElementsByTagName('ytd-playlist-video-renderer')[0];

            video.querySelector('#primary button[aria-label="Action menu"]').click();

            var things = document.evaluate(
                '//span[contains(text(),"Remove from")]',
                document,
                null,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null
            );

            for (var i = 0; i < things.snapshotLength; i++)
            {
                things.snapshotItem(i).click();
            }
        }, 250);
    }

    descriptionSpan.appendChild(paragraph)
    latestParagraph = paragraph
    }, 0)
}
    run()
    document.addEventListener('yt-navigate-finish', function() {
  run()
  clearInterval(interval)
});
})();