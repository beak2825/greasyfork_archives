// ==UserScript==
// @name           YouTube Popout Button [mashup]
// @description    Provides a button to pop out the YouTube video in a separate window.
// @version        2.0.3
// @author         joeytwiddle
// @contributor    Alek_T, tehnicallyrite
// @license        ISC
// @include        http://*.youtube.com/watch*
// @include        http://youtube.com/watch*
// @include        https://*.youtube.com/watch*
// @include        https://youtube.com/watch*
// @grant          none
// @namespace      https://greasyfork.org/users/8615
// @downloadURL https://update.greasyfork.org/scripts/401907/YouTube%20Popout%20Button%20%5Bmashup%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/401907/YouTube%20Popout%20Button%20%5Bmashup%5D.meta.js
// ==/UserScript==

// This is a combination of two scripts I found:
// - http://userscripts-mirror.org/scripts/show/75815#YouTube:_Pop-out_Video
// - http://userscripts-mirror.org/scripts/show/69687#YouTube_Popout
// For a while I think I hosted it here (but it never got mirrored):
// - http://userscripts.org/scripts/show/150631#YouTube_Popout_Button

// Known issues:
// - The popout window displays the location bar.  I have been unable to hide it.

let numAttempts = 0;

function tryToAdd() {
    numAttempts++;

    var divWatchHeadline = document.querySelector('.ytp-right-controls');
    var settingsButton = document.querySelector('.ytp-miniplayer-button');

    if (!divWatchHeadline || !settingsButton) {
        if (numAttempts >= 50) {
            console.warn('[YoUTube Popout Button] Giving up. Never found the divWatchHeadline or the settingsButton.');
            return;
        }
        setTimeout(tryToAdd, 250 * 1.05 ** numAttempts);
        return;
    }

    var buttonPopout = document.createElement("button");
    buttonPopout.setAttribute('aria-label', "Pop-out Video");
    buttonPopout.title = "Pop-out Video";

    buttonPopout.className = 'ytp-popout-button ytp-button';
    buttonPopout.style.padding = '0 4px';
    buttonPopout.innerHTML = `<svg viewBox="0 0 36 36" height="100%" width="100%"><path d="M 27.020989,25.020001 H 9.0209895 v -14.05 L 20.278056,10.969089 20.27853,8.9999999 H 8.9544297 c -1.0730594,0 -1.9334402,0.9 -1.9334402,2.0000001 v 14 c 0,1.1 0.8603808,2 1.9334402,2 H 27.045569 c 1.063393,0 1.97421,-0.885891 1.968683,-1.985877 l 0.0018,-7.014124 h -1.991386 z m -4.80902,-16.0200011 -0.01053,1.9774681 3.525926,-0.0018 -9.547729,9.854341 1.363076,1.41 9.481183,-9.799226 v 3.59 l 1.993516,-0.0095 0.0039,-7.0250141 z" fill="#fff" /></svg>`;

    divWatchHeadline.insertBefore(buttonPopout, settingsButton);

    buttonPopout.addEventListener("click", popOutVideo, false);

    function popOutVideo() {
        // Grabbing Video Id
        function gup(name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.href);
            return results && results[1];
        }

        var ytvidid = gup('v');

        if (ytvidid) {
            //var link = "http://www.youtube.com/watch_popup?v=";
            //var flink = link+ytvidid;
            // The above URL gets redirected to https://www.youtube.com/embed/bNcWVUfwmS4&autoplay=1#at=6
            // And the redirect causes autoplay to not work.  So let's go directly to the target URL.
            var flink = "https://www.youtube.com/embed/" + ytvidid + "?autoplay=1";
            var lcheck = location.href;
            // I think this used to prevent infinite loops when the script was auto-forwarding
            if (lcheck !== flink) {
                try {
                    var player = window.document.getElementById('movie_player');
                    if (player) {
                        // If we are in Greasemonkey's sandbox, we need to get out!
                        if (player.wrappedJSObject) {
                            player = player.wrappedJSObject;
                        }
                        player.pauseVideo();
                        var time = player.getCurrentTime();
                        flink += "#at=" + (time | 0);
                    }
                } catch (e) {
                    console.error("" + e);
                }

                // window.location = flink;
                // Change "YoutubePopout" to "_blank" if you want new popouts to appear in a separate window from the existing popout.
                window.open(flink, "YoutubePopout", "popup=yes,menubar=no,location=no,resizable=yes,status=no,toolbar=no,personalbar=no");
            }
        }
    }
}

tryToAdd();
