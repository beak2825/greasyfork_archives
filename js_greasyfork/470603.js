// ==UserScript==
// @name        Watch on Piped button
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      jside
// @description adds a watch on Piped button
// @downloadURL https://update.greasyfork.org/scripts/470603/Watch%20on%20Piped%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/470603/Watch%20on%20Piped%20button.meta.js
// ==/UserScript==

function WaitForElement(selector, callback) { // @_@
    if (document.querySelector(selector)) {
        callback();
    } else {
        setTimeout(function() {
            WaitForElement(selector, callback);
        }, 100);
    }
}

let css = `
.script-button-css {
  background-color: #98789d !important;
  color: #0f0f0f !important;
  margin-right: 8px;

}

.script-button-css:hover {
  background-color: #79607d !important;
}
`;

GM_addStyle(css)

function likeSegmentFound() {

    var like = document.getElementById("segmented-buttons-wrapper");
    var button = document.createElement("a");
    button.innerText = "Watch on Piped"
    button.classList = "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m script-button-css";

    button.onclick = function () {
        if (window.location.href.indexOf('youtube.com/watch') > -1) {
            window.location.replace(window.location.toString().replace('www.youtube.com', 'piped.video'));
        }
    };

  like.prepend(button); // does not need to be reapplied for some reason :)
}


WaitForElement("#segmented-buttons-wrapper", likeSegmentFound);