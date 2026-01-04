// ==UserScript==
// @name          YouTube - Video Download Buttons
// @description   Adds download buttons for all items on the videos page of a channel as well as in the top bar of each individual video
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://www.youtube.com/*/videos*
// @match         https://www.youtube.com/watch*
// @version       1.2
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @require       https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @run-at        document-body
// @grant         GM_xmlhttpRequest
// @grant         GM_download
// @downloadURL https://update.greasyfork.org/scripts/458907/YouTube%20-%20Video%20Download%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/458907/YouTube%20-%20Video%20Download%20Buttons.meta.js
// ==/UserScript==

// Workaround to get rid of "is not defined" warnings
/* globals $, jQuery */

// Wait until DOM element becomes available
function waitForEl(selector, callback, maxtries = false, interval = 100) {
    const poller = setInterval(() => {
        const el = $(selector)
        const retry = maxtries === false || maxtries-- > 0
        if (retry && el.length < 1) return
        clearInterval(poller)
        callback(el || null)
    }, interval)
}

// Download video
function dlVideo(videoUrl, videoTitle) {
    GM_xmlhttpRequest( {
        method: "GET",
        responseType: "json",
        headers: { "Referer": "https://en1.y2mate.is/" },
        url: "https://srvcdn7.2convert.me/api/json?url=" + videoUrl,
        onload: function(response) {
            if (response.status == 200) {
                let videos = JSON.parse(response.responseText).formats.video.filter(({needConvert}) => needConvert === false);

                const url = videos.sort(function(a, b) {
                    return parseInt(b.quality) - parseInt(a.quality);
                } )[0].url;

                const details = { url: url,
                                 name: videoTitle.replace(/[\\\?\.\*<>]/g, '').replace(/[\|:/]/g, ' - ').replace(/[\s]{2,}/g, ' ') + '.mp4',
                                 saveAs: true };
                GM_download(details);
            }
        }
    } );
}

// Add download buttons for all items on the video page of a channel
if (window.location.pathname.match(/\/@.+\/videos/)) {

    function addDLButtons() {
        $(selector + '> #contents > ytd-rich-item-renderer').each(function() {
            if ($('#metadata-line > span', this).length != 2) return;
            if ($('#thumbnail > #overlays > ytd-thumbnail-overlay-time-status-renderer', this).attr('overlay-style') == 'UPCOMING') return;

            const elem = $('#metadata-line > span + span', this);

            elem.after('<span class="ytd-video-meta-block video-download-button" style="color:white; font-size: 120%;">🖫</span>');

            elem.next().hover(function() {
                $(this).css("font-weight", "bold");
            }, function(){
                $(this).css("font-weight", "normal");
            } );

            const title = $('#meta > h3 > a', this).attr('title');
            const url = $('#meta > h3 > a', this).attr('href');
            elem.next().on('click', function(event) {
                event.stopPropagation();
                $(this).effect('bounce');
                dlVideo('https://youtube.com' + url, title);
            } );
        } );
    }

    const selector = '#primary > ytd-rich-grid-renderer > #contents > ytd-rich-grid-row';

    waitForEl(selector + ':nth-child(7)', function() {
        addDLButtons();
    }, 100, 100);

    let contents = $(selector).length;
    let timer;
    $(window).on('scroll', function() {
        if (timer) {
            window.clearTimeout(timer);
        }

        timer = window.setTimeout( function() {
            if (contents != $(selector).length) {
                contents = $(selector).length;
                addDLButtons();
            }
        }, 200);
    } );

}

// Add a download button in the top bar of each individual video
if (window.location.pathname.match(/\/watch/)) {

    function addDLButton() {
        const button = '<div id="video-download-button" style="color:white; font-size:24px; margin-bottom: 4px; margin-right: 20px;">🖫</div>';
        $('#end:first > #buttons').before(button);

        $('#video-download-button').hover(function() {
            $(this).css("font-weight", "bold");
        }, function(){
            $(this).css("font-weight", "normal");
        } );

        const title = $('meta[itemprop="name"]').prop('content');
        const videoId = $('meta[itemprop="videoId"]').prop('content');
        $('#video-download-button').on('click', function(event) {
            event.stopPropagation();
            $(this).effect('bounce');
            dlVideo('https://www.youtube.com/watch?v=' + videoId, title);
        } );
    }

    waitForEl('#end:first > #buttons', function() {
        addDLButton();
    }, 100, 100);

}
