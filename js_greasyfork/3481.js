// ==UserScript==
// @name            Facebook HD Video Downloader (Not working!)
// @description     (Not working! Read more at Additional info.) Adds a download link for Facebook videos. Works for HD videos.
// @author          EThaiZone
// @include     http://facebook.com/video.php*
// @include     http://*.facebook.com/video.php*
// @include     https://facebook.com/video.php*
// @include     https://*.facebook.com/video.php*
// @include     http://facebook.com/video/*
// @include     http://*.facebook.com/video/*
// @include     https://facebook.com/video/*
// @include     https://*.facebook.com/video/*
// @include     http://facebook.com/*/videos/*
// @include     http://*.facebook.com/*/videos/*
// @include     https://facebook.com/*/videos/*
// @include     https://*.facebook.com/*/videos/*
// @include     https://*.facebook.com/*
// @version 0.1.6.8
// @namespace https://greasyfork.org/users/3747
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/3481/Facebook%20HD%20Video%20Downloader%20%28Not%20working%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3481/Facebook%20HD%20Video%20Downloader%20%28Not%20working%21%29.meta.js
// ==/UserScript==


// My code
(function () {

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    
    if (typeof jQuery == 'undefined') {
        alert('[Facebook HD Video Downloader]\n\nYour greasemonkey or tampermonkey is too old. Please update.');
        return;
    }

    var patternfbh = /facebook\.com\/(.*?)/;
    if (! document.URL.match(patternfbh)) {
        return;
    }

    jQuery('head').append('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">');

var css = "\
.dl {\
    display: inline-block;\
    width: 1em;\
    height: 1em;\
}\
.dl_container {\
    z-index: 9999;\
    position: relative;\
    float: right;\
    margin: 5px 5px 0 0;\
    padding: 2px 4px 2px 4px;\
    background: white;\
    border-radius: 4px;\
    opacity: 0.5;\
    transition: opacity 1s, max-width 1s ease-in-out;\
    -moz-transition: opacity 1s, max-width 1s ease-in-out;\
    -webkit-transition: opacity 1s, max-width 1s ease-in-out;\
    color: black !important;\
    text-decoration: none;\
    display: block;\
    height: 1.2em;\
    overflow: hidden;\
    text-align: center;\
    max-width: 1em;\
    white-space: nowrap;\
}\
span[display=\"inline\"] .dl_container {\
    margin: 5px 30px 0 0;\
    display: none !important;\
}\
.dl_container:hover {\
    max-width: 140px;\
    opacity: 1;\
    text-decoration: none;\
}\
";

    jQuery('head').append('<style type="text/css">' + css + '</style>');

    var iconDownload = jQuery('<div/>');
    iconDownload = jQuery('<i class="fa fa-download dl"></i>');
    
    function renderFBDownloader(counter) {

        // Get the base so we can append to it later
        var base = jQuery('.comment_link').parent('span').parent('div');
        if (base.length === 0) {
            base = jQuery('.UFILikeLink').parent('div').parent('span').parent('div'); // check link like 
        }
        if (base.length === 0) {
            base = jQuery('.userContent'); // or else I will attach to userContent.
        }
        base = base[0];

        /*
         * NOTE: Don't use jquery on <video>, it will broke them.
         */

        // Get all the <embed> elements
        var videoElements = document.querySelectorAll('video:not([fb_download_link_ethaizone])');
        var embedElements = document.querySelectorAll('embed[flashvars]');

        for (var i = 0; i < videoElements.length; i++) {

            var embed = videoElements[i].querySelectorAll('embed[flashvars]');

            if (embed.length === 0) {
                continue;
            }

            videoElements[i].setAttribute('fb_download_link_ethaizone', '1');

            embed = embed[0];

            // Get the flashvars attribute and decode it
            var flashvars = decodeURIComponent(embed.getAttribute('flashvars'));

            // Check if this string contains the code we're looking for
            var hd_src_index = flashvars.indexOf('hd_src');
            var p_width_index = flashvars.indexOf('&width=');
            if (hd_src_index > -1 && p_width_index > -1) {
                // This string contains the payload we are looking for so parse it
                var obj = JSON.parse(flashvars.slice(7, p_width_index));

                if (typeof obj.video_data.progressive == 'undefined') {
                    log('Something wrong in obj.');
                    console.log(obj);
                    continue;
                }
                var video_data = obj.video_data.progressive;

                //console.log(video_data);
                
                if (typeof video_data.video_id == 'undefined') {
                    console.log(video_data);
                } else {
                    var title = video_data.video_id;
                }
                //var title = document.querySelectorAll('h2.uiHeaderTitle')[0].innerText;

                // thank css style from fork of nhtera.
                var link = jQuery('<a/>');
                link.addClass('dl_container');
                link.addClass('fbPhotosPhotoActionsItem');
                link.addClass('fb_download_link_ethaizone');
                link.attr('fb_download_link_ethaizone');
                link.append(iconDownload[0].outerHTML);
                link.append('&nbsp;');

                var labelText = null;
                var downloadUrl = null;
                var filename = null;

                // High Def
                if (typeof video_data.hd_src != 'undefined' && video_data.hd_src) {
                    labelText = 'Download (HD)';
                    filename = title + '_hd.mp4';
                    downloadUrl = video_data.hd_src;
                } else if (typeof video_data.sd_src != 'undefined' && video_data.sd_src) {
                    labelText = 'Download (SD)';
                    filename = title + '_sd.mp4';
                    downloadUrl = video_data.sd_src;
                }

                if (downloadUrl) {
                    link.append('<span class="status">' + labelText + '</span>');
                    link.prop('download', filename);
                    link.prop('href', downloadUrl);
                    link.prop('target', '_blank');
                    insertAfter(link[0], videoElements[i]);
                } else {
                    log('Something wrong in video_data.');
                    console.log(video_data);
                    continue;
                }

                log('Success.');
            } // end if

        } // end loop

        return videoElements.length;
    }

    var counter = 0;
    var delay = 1500;
    function doExec() {
        if (jQuery('#mainContainer').length < 1) {
            // log('No maincontaimer.');
            return false;
        }
        counter++;
        try {
            var found = renderFBDownloader(counter);
            // if (found !== 0 && delay == 1000) {
            //     delay = 3000;
            //     log('First found. Decrease delay. ('+ delay +')');
            // }

            // if (counter > 10 && delay == 1000) {
            //     delay = 5000;
            //     log('Too long and not found anything. Decrease delay. ('+ delay +')');
            // }
            // if (counter < 30) {
            //     setTimeout(doExec, delay);
            // }
            setTimeout(doExec, delay);
            // log('Check!! No:'+counter+' Found: ' + renderFBDownloader(counter));
        } catch(e) {
            log("Found error!");
            console.log(e);
            //setTimeout(doExec, 1000);
        }

        return true;
    }

    function log(msg) {
        //alert(msg);
        console.log("[FB Video Downloader] " + msg);
    }
    if (doExec()) {
        var myVersion = GM_info.script.version;
        log("First start. Version "+myVersion);
    }
})();