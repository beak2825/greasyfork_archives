// ==UserScript==
// @name         Youtube_Playlist_Clear_All
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.2.0
// @description  Add a button to clear all items from a Youtube Playlist.
// @match        https://*.youtube.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/36049/Youtube_Playlist_Clear_All.user.js
// @updateURL https://update.greasyfork.org/scripts/36049/Youtube_Playlist_Clear_All.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var removing = false;
    var videos = [];

    function addButton(){
        if(window.location.pathname.match('^/playlist')) {
            $('.playlist-menu > .yt-uix-menu-content')
                .append('<button type="button" class="yt-ui-menu-item yt-uix-menu-trigger yt-ui-menu-item" id="delmain_clearall"><span class="yt-ui-menu-item-label">Clear all</span></button>');
            $('#delmain_clearall').click(clearList);
            console.log('Playlist Clear All: Clear Playlist Button Added');
        } else {
            console.log('Playlist Clear All: Not a Playlist Page');
        }
    }

    function clearList() {
        var intervalId = setInterval(function() {
            if($('.pl-video').length === 0) {
                clearInterval(intervalId);
            } else if(!removing) {
                removeVideos();
            }
        }, 50);
    }

    function removeVideos() {
        removing = true;
        var token = $('#pl-video-list').attr('data-playlist-edit-xsrf-token');
        var playlist = $('.pl-video-list').attr('data-playlist-id');
        var headers = {
            'x-chrome-uma-enabled': 1,
            'x-youtube-client-name': yt.config_.INNERTUBE_CONTEXT_CLIENT_NAME,
            'x-youtube-client-version': yt.config_.INNERTUBE_CONTEXT_CLIENT_VERSION,
            'x-youtube-identity-token': yt.config_.ID_TOKEN,
            'x-youtube-page-cl': yt.config_.PAGE_CL,
            'x-youtube-page-label': yt.config_.PAGE_BUILD_LABEL,
            'x-youtube-variants-checksum': yt.config_.VARIANTS_CHECKSUM
        };

        $('.pl-video').each(function(i, e) {
            var setVideoId = $(e).attr('data-set-video-id');

            videos.push(getAjax(setVideoId, token, playlist, headers));
        });

        if(videos.length > 0) {
            $.ajax(videos.shift());
        }
    }

    function getAjax(setVideoId, token, playlist, headers) {
        var data = 'playlist_id=' + playlist + '&set_video_id=' + setVideoId + '&session_token=' + encodeURIComponent(token);
        return {
            type: "POST",
            url: '/playlist_edit_service_ajax/?action_remove_video=1',
            data: data,
            headers: headers,
            success: function(response) {
                $('.pl-video[data-set-video-id="' + setVideoId + '"]').remove();
            },
            error: function(xhr, status, error) {
                console.log('Error: ' + status + ' - ' + error);
                videos.push(getAjax(setVideoId));
            },
            complete: function(xhr) {
                if(videos.length === 0) {
                    var response = JSON.parse(xhr.response);
                    $('#pl-header').replaceWith(response.header_html);
                    addButton();
                    removing = false;
                } else {
                    $.ajax(videos.shift());
                }
            },
            // 'xhr' option overrides jQuery's default
            // factory for the XMLHttpRequest object.
            // Use either in global settings or individual call as shown here.
            xhr: function() {
                // Get new xhr object using default factory
                var xhr = jQuery.ajaxSettings.xhr();
                // Copy the browser's native setRequestHeader method
                var setRequestHeader = xhr.setRequestHeader;
                // Replace with a wrapper
                xhr.setRequestHeader = function(name, value) {
                    // Ignore the X-Requested-With header
                    if (name == 'X-Requested-With') return;
                    // Otherwise call the native setRequestHeader method
                    // Note: setRequestHeader requires its 'this' to be the xhr object,
                    // which is what 'this' is here when executed.
                    setRequestHeader.call(this, name, value);
                };
                // pass it on to jQuery
                return xhr;
            }
        };
    }

    $(document).ready(function() {
        console.log('Page Loaded... ' + window.location);
        setTimeout(addButton, 500);

        $(window).bind('spfdone', function() {
            videos = [];
            setTimeout(addButton, 500);
        });
    });
})();