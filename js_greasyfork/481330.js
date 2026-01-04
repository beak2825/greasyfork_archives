// ==UserScript==
// @name         Mute football commercials on YT.TV
// @namespace    http://tampermonkey.net/
// @description  Works on YouTube TV. Turn on Closed Captions. When the captions disappear or move to the bottom of the screen, it is a commercial break, and volume is automatically set very low. Otherwise volume is returned to 100%.
// @version      1.0
// @author       Someone who hates loud commercials
// @match        https://tv.youtube.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481330/Mute%20football%20commercials%20on%20YTTV.user.js
// @updateURL https://update.greasyfork.org/scripts/481330/Mute%20football%20commercials%20on%20YTTV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // i don't code in javascript and most of this was written in chatgpt, but it works in principle
    // same idea works for amazon thursday night football
    // once the commercials are unskippable or unmuteable, i'm done with football....
    // enjoy while it lasts.

    // check for banned words appearing in the captions
    let bannedTerms = ["our best deals", "iphone", "guaranteed.", "with any popular plan", "at&t", "whopper"];

    // adjust the muted/unmuted volume to your preference
    const mutedVolume = 0.05;
    const fullVolume = 1.0;

    var lastCaption = '';

    function containsBannedTerm(str, bannedTerms) {
        const lowerCaseStr = str.toLowerCase();

        for (let term of bannedTerms) {
            if (lowerCaseStr.includes(term)) {
                return true;
            }
        }
        return false;
    }

    function setVolume()
    {
        var video = document.querySelector('video.html5-main-video');

        if (video)
        {
            var caption = document.querySelector('span.ytp-caption-segment');
            var captionWindow = document.querySelector('div.caption-window');

            if (captionWindow)
            {
                // make the caption overlay invisible (it may flash briefly because the element is removed/recreated when the captions change)
                captionWindow.style.visibility = 'hidden';
            }

            if (captionWindow && captionWindow.textContent && !captionWindow.style.bottom && !containsBannedTerm(captionWindow.textContent, bannedTerms))
            {
                if (caption.textContent != lastCaption)
                {
                    // log the captions to the console so more banned words can be added, if necessary.
                    lastCaption = caption.textContent;
                    console.log(caption.textContent);
                }

                video.volume = fullVolume;
            }
            else
            {
                // if the captions are missing, or appearing at the bottom of the screen, mute the playback
                video.volume = mutedVolume;
            }
        }
    }

    // check the caption content every 10 milliseconds
    window.setVolume = setInterval(setVolume, 10);

})();
