// ==UserScript==
// @name         YouTube Age Bypass
// @description  shitty but works in 2018 (requires to manually reload page)
// @version      1.0.1
// @grant        none
// @include	     https://www.youtube.com/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/149768
// @downloadURL https://update.greasyfork.org/scripts/371261/YouTube%20Age%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/371261/YouTube%20Age%20Bypass.meta.js
// ==/UserScript==
(function() {
    "use strict";

    const inject = function() {
        "use strict";

        var overriddenVideo = null

        function haveVideoData() {
            return typeof window.ytInitialPlayerResponse != 'undefined' && window.ytInitialPlayerResponse != null;
        }

        function isCurrentVideoAgeRestricted() {
            return typeof window.ytInitialPlayerResponse.playabilityStatus.desktopLegacyAgeGateReason != 'undefined' && window.ytInitialPlayerResponse.playabilityStatus.desktopLegacyAgeGateReason;
        }

        function getVideoId() {
            return window.ytInitialPlayerResponse.videoDetails.videoId;
        }

        function removeNode(n) {
            if (n != null) n.parentNode.removeChild(n);
        }

        function waitForNodeId(node, cb) {
            var ival = setInterval(function(node, cb) {
                if (document.getElementById(node) != null) {
                    clearInterval(ival);
                    cb();
                }
            }, 100, node, cb);
        }

        function checkAndUnrestrict() {

            if (overriddenVideo != null) { // if we have injected a video and navigate away, we need to clean up
                console.log("Navigating away from page, removing iframe");
                removeNode(overriddenVideo);
            }

            if (!haveVideoData() || !isCurrentVideoAgeRestricted()) {
                return;
            }

            console.log("Is video age restricted: " + isCurrentVideoAgeRestricted())

            waitForNodeId('player-container', function() {
                console.log("Found player container");
                removeNode(document.getElementById('error-screen'));

                waitForNodeId('container', function() {
                    console.log("Found movie player");

                    var oldplayer = document.getElementById('container');
                    var container = document.querySelector('div.ytd-player');

                    var videoplayer = document.createElement('div');
                    videoplayer.className = "html5-video-player ytp-transparent ytp-hide-info-bar ytp-large-width-mode iv-module-loaded paused-mode";

                    //

                    var playercontent = document.createElement('div');
                    playercontent.className = "ytp-player-content ytp-iv-player-content";


                    var playerframe = window.document.createElement("iframe");
                    playerframe.setAttribute("src", "//www.youtube.com/embed/" + getVideoId() + "?autoplay=1&showinfo=0&rel=0");
                    playerframe.setAttribute("id", "movie_player");
                    playerframe.setAttribute("frameBorder", "0");
                    playerframe.setAttribute("width", "100%");
                    playerframe.setAttribute("height", "100%");

                    container.appendChild(videoplayer);
                    videoplayer.appendChild(playercontent);
                    playercontent.appendChild(playerframe);

                    waitForNodeId('player', function() {
                        removeNode(document.getElementById('player'));
                    });

                    overriddenVideo = playerframe;
                    console.log("injected new video");

                });


            });
        }

        checkAndUnrestrict();
    }


    const script = document.createElement("script");
    const target = document.head || document.documentElement;
    script.text = "(" + inject.toString() + ")();";

    target.appendChild(script);
    target.removeChild(script);
})();