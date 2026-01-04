// ==UserScript==
// @name         Instagram Photo/Video Downloader
// @namespace    rfindley
// @version      1.0.0
// @description  Shift-click an image or video to open the original in a new window.
// @author       Robin Findley
// @match        *://*.instagram.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390523/Instagram%20PhotoVideo%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/390523/Instagram%20PhotoVideo%20Downloader.meta.js
// ==/UserScript==

/* globals $ */

window.instacap = {};

(function(gobj) {

    /* global $ */
    /* eslint no-multi-spaces: "off" */

	//########################################################################
	// Bootloader Startup
	//------------------------------
	function startup() {
        $('body').on('click', function(e){
            if (!e.shiftKey) return true;
            window.e = e;
            var video = e.target.parentElement.parentElement.parentElement.querySelector('video');
            if (video) {
                var source = video.querySelector('source');
                if (!source) source = video;
                var video_url = source.attributes.src.value;
                window.open(video_url, '_blank');
                return;
            }
            var img = e.target.parentElement.parentElement.parentElement.querySelector('img');
            if (img) {
                var img_url = img.attributes.srcset.value.split(',').sort(function(a,b){
                    var width_a = Number(a.split(' ')[1].match(/([0-9]+)w$/)[1]);
                    var width_b = Number(b.split(' ')[1].match(/([0-9]+)w$/)[1]);
                    return width_b - width_a;
                })[0].split(' ')[0];
                window.open(img_url, '_blank');
                return;
            }
        });
	}

    // Mark document state as 'ready'.
    if (document.readyState === 'complete') {
        startup();
    } else {
        window.addEventListener("load", startup, false); // Notify listeners that we are ready.
    }

})(window.instacap);
