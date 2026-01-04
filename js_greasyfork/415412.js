// ==UserScript==
// @name         Twitch - Refresh on Advert
// @version      0.72
// @description  Detects placeholder ads and refreshes the page, or for FFZ users, resets the player.
// @author       CodingAndAlgorithm - videoPlayerObserver is based on code written by SimpleHacker
// @match        https://www.twitch.tv/*
// @namespace    https://greasyfork.org/users/701035
// @downloadURL https://update.greasyfork.org/scripts/415412/Twitch%20-%20Refresh%20on%20Advert.user.js
// @updateURL https://update.greasyfork.org/scripts/415412/Twitch%20-%20Refresh%20on%20Advert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let awaitingCompressorRestore = false;
    let awaitingVolumeRestore = false;
    let skippedFirstMutation = false;
    let volumeHolder = 0.5;
    let adTimestamp = null;
    let overlay = null;

    window.onload = function() {
        let player = getVideoPlayer();
        if(player) {
            videoPlayerObserver.observe(player, {
                childList: true,
                subtree: true
            });
        }
        logTime("Twitch - Refresh on Advert");
    }

    const videoPlayerObserver = new MutationObserver(function(mutations) {
        mutations.forEach((mutation) => {

            // Restore volume after a specific series of mutations that occur when the player is reset.
            if(awaitingVolumeRestore && mutation.removedNodes.length == 1)
            {
                if(mutation.target.className == "tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-top-0 video-player__overlay"
                && mutation.previousSibling.className == "tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-top-0")
                {
                    if(skippedFirstMutation)
                    {
                        restoreVolume();
                    }
                    else
                    {
                        skippedFirstMutation = true;
                    }
                    return;
                }
            }

            // Wait for the compressor warning message to be removed before restoring.
            if(awaitingCompressorRestore && mutation.removedNodes.length == 1)
            {
                var targetNode = mutation.removedNodes[0];
                if(targetNode.nodeType == Node.TEXT_NODE)
                {
                    if(targetNode.textContent == "Audio Compressor cannot be enabled when viewing Clips.")
                    {
                        restoreCompressorState();
                        return;
                    }
                }
            }

            // Listen for adverts
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE)
                {
                    let adBanner = node.querySelector('[data-test-selector="ad-banner-default-text"]');
                    if (adBanner)
                    {
                        // Let the ads run if blocking fails, an ad is better than the player constantly resfreshing for the duration of the ad.
                        // Twitch is routinely breaking the custom UBlockOrigin script.
                        let lastAdTime = adTimestamp;
                        adTimestamp = new Date();
                        if(lastAdTime != null && (adTimestamp - lastAdTime) / 1000 < 10)
                        {
                            logTime("UBlock Failed");
                            showOverlay();
                            setTimeout(hideOverlay, 15000);
                            return;
                        }

                        if (getFFZResetButton())
                        {
                            logTime("Advert Blocked")
                            // Hold our audio settings
                            // Player.volume has already been modified at this point, take the value from the volume slider instead.
                            volumeHolder = getVolumeSlider().value;
                            // Reset player
                            var dblClickEvent = document.createEvent ('MouseEvents');
                            dblClickEvent.initEvent ("dblclick", true, true);
                            getFFZResetButton().dispatchEvent(dblClickEvent);
                            awaitingCompressorRestore = isFFZCompressorActive();
                            awaitingVolumeRestore = true;
                            skippedFirstMutation = false;
                        }
                        else
                        {
                            window.location.reload();
                        }
                    }
                }
            });
        });
    });

    function restoreVolume()
    {
        // Restore player volume & slider position
        getVideo().volume = volumeHolder;
        getVolumeSlider().value = volumeHolder;
        awaitingVolumeRestore = false;
        console.log("Restored Volume: " + Math.round(volumeHolder * 100) + "%");
    }

    function restoreCompressorState()
    {
        getFFZCompressorButton().click();
        awaitingCompressorRestore = false;
        console.log("Restored Compressor");
    }


    function logTime(message) {
        console.log(new Date().toLocaleTimeString() + ": "+ message);
    }

    // TODO: Add lazy loading for getElement functions.
    function getFFZCompressorButton() {
        return document.querySelector('[data-a-target="ffz-player-comp-button"]');
    }

    function getFFZResetButton() {
        return document.querySelector('[data-a-target="ffz-player-reset-button"]');
    }

    function getVideoPlayer() {
        return document.querySelector('[data-a-target="video-player"]');
    }

    function getVideo() {
        return document.querySelector('video');
    }

    function getVolumeSlider() {
        return document.querySelector('[data-a-target="player-volume-slider"]');

    }

    function isFFZCompressorActive() {
        return document.getElementsByClassName("ffz-player-icon ffz-i-comp-on")[0] != null;
    }

    function getOverlayParent() {
        return document.getElementsByClassName("tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-top-0 video-player__overlay")[0];
    }

    function showOverlay() {
        if(overlay == null)
        {
            overlay = document.createElement("div");
            overlay.style.position = "absolute";
            overlay.style.left = "0px"
            overlay.style.top = "50%"
            overlay.style.height = "140px";
            overlay.style.margin = "-70px 0 0 0"
            overlay.style.width = "100%";
            overlay.style.background = "#000000cc";

            var message = document.createElement("h4");
            message.innerHTML = "Twitch - Refresh on Advert depends on u/thesbros UBlock script, which Twitch is routinely bypassing.<br>This script will resume normal functionality once UBlock is up and running again.<br>Stay up to date by purging & updating your UBlock filter list regularly.";
            message.style.padding = "30px 60px"
            message.style.pointerEvents = "none"
            overlay.appendChild(message);

            getOverlayParent().appendChild(overlay);
        }
        overlay.style.display = "block";
    }

    function hideOverlay() {

        if(overlay)
        {
            overlay.style.display = "none";
        }
    }
})();