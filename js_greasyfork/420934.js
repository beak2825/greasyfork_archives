// ==UserScript==
// @name         Reshet 13 - Full windowed video
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Strip everything around the video container and fit the video to the entire window (in Reshet TV / Reshet 13 / 13tv), so you can enjoy the live stream in windowed-mode while doing other things. (to be used with an 'Always On Top' utility)
// @author       Ziv Motola
// @match        https://13tv.co.il/live/
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/420934/Reshet%2013%20-%20Full%20windowed%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/420934/Reshet%2013%20-%20Full%20windowed%20video.meta.js
// ==/UserScript==

window.setTimeout(Apply, 7000);


function Apply() {
    jQuery('.Headerstyles__Container-sc-4iuelt-21').hide();
    jQuery('.cgsMWy').css('margin-top','-110px');
    jQuery('.gOUPRB').css('margin','unset');
    jQuery('.Footerstripstyles__Container-sc-7dn5cj-0').hide();
    jQuery('.SubTitlesBtn__SubtitlesWrp-sc-tg37vr-0').hide();
    jQuery('#accessibility').hide();


    /* the following part tries to undo the auto-pause when leaving window */
    window.onblur = function() {
        var isVideoPlaying = jQuery('.playkit-is-playing').length > 0;
        if (isVideoPlaying)
        {
            window.setTimeout(
                function() {
                    var isVideoPlaying = jQuery('.playkit-is-playing').length > 0;
                    if (!isVideoPlaying)
                    {
                        jQuery('.playkit-icon-play')[1].click();
                    }
                }
                , 200
            );
        }
    };
};