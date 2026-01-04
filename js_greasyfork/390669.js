// ==UserScript==
// @name         Move Youtube subtitle to the bottom of the viewport
// @namespace    https://gillesfiguiere.com/
// @version      0.1
// @description  Have you never been annoyed by youtube subtitles covering the video frame (and potentially other )? I made this script to push them to the bottom of the viewport
// @author       Gilles Figuière
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390669/Move%20Youtube%20subtitle%20to%20the%20bottom%20of%20the%20viewport.user.js
// @updateURL https://update.greasyfork.org/scripts/390669/Move%20Youtube%20subtitle%20to%20the%20bottom%20of%20the%20viewport.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll("#movie_player").forEach(element => {

        const observer = new MutationObserver(mutations => {
            console.log(mutations)
            mutations.forEach(mutation => {
                mutation.target.querySelectorAll(".caption-window").forEach(subtitlesPlaceHolder => {
                    subtitlesPlaceHolder.style.position = "fixed"
                    subtitlesPlaceHolder.style.bottom = "0"
                })
            })
        })

        observer.observe(element, {childList: true})
    })

})();