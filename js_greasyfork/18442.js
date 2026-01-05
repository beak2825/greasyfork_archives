"use strict";
// ==UserScript==
// @name            Zoom function for YouTube
// @name:ja         YouTubeで動画をズーム
// @description     YouTube video zoom feature
// @description:ja  YouTubeの動画プレイヤーにズーム機能を追加します
// @version         2.0.3
// @include         /https?:\/\/www\.youtube\.com.*/
// @author          sititou70
// @namespace       https://github.com/sititou70/
// @run-at          document-idle
// @license         MIT; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/18442/Zoom%20function%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/18442/Zoom%20function%20for%20YouTube.meta.js
// ==/UserScript==
(function () {
    // consts
    var SCRIPT_NAME = 'youtube video zoom';
    var VIDEO_CONTAINER_SELECTOR = '#movie_player';
    var VIDEO_SELECTOR = VIDEO_CONTAINER_SELECTOR + " video";
    // functions
    var getScaleFromVideo = function (video) {
        var scale_string = video.style.transform.match(/scale\((.+?)\)/);
        if (scale_string === null)
            return 1;
        var scale = parseFloat(scale_string[1]);
        if (isNaN(scale))
            return 1;
        return scale;
    };
    var zoomVideoToRect = function (video, rect) {
        var video_scale = getScaleFromVideo(video);
        var video_client_rect = video.getBoundingClientRect();
        var video_rect = {
            width: video_client_rect.width / video_scale,
            height: video_client_rect.height / video_scale,
        };
        var player_aspect_ratio = video_rect.width / video_rect.height;
        var selected_aspect_ratio = rect.width / rect.height;
        var fit_width = player_aspect_ratio < selected_aspect_ratio; // or height?
        var scale = fit_width
            ? video_rect.width / rect.width
            : video_rect.height / rect.height;
        video.style.transform = "translateX(" + (video_rect.width / 2 - (rect.top_left.x + rect.width / 2)) * scale + "px) translateY(" + (video_rect.height / 2 - (rect.top_left.y + rect.height / 2)) * scale + "px) scale(" + scale + ")";
        video.style.transition = 'all 0.3s ease';
    };
    var drag_start_position;
    var handleDragStart = function (e) {
        var video = e.target;
        var video_rect = video.getBoundingClientRect();
        var scale = getScaleFromVideo(video);
        drag_start_position = {
            x: (e.clientX - video_rect.x) / scale,
            y: (e.clientY - video_rect.y) / scale,
        };
    };
    var handleDragEnd = function (e) {
        var video = e.target;
        var video_rect = video.getBoundingClientRect();
        var scale = getScaleFromVideo(video);
        var drag_end_position = {
            x: (e.clientX - video_rect.x) / scale,
            y: (e.clientY - video_rect.y) / scale,
        };
        var top_left = {
            x: Math.min(drag_start_position.x, drag_end_position.x),
            y: Math.min(drag_start_position.y, drag_end_position.y),
        };
        var bottom_right = {
            x: Math.max(drag_start_position.x, drag_end_position.x),
            y: Math.max(drag_start_position.y, drag_end_position.y),
        };
        var selected_rect = {
            top_left: top_left,
            bottom_right: bottom_right,
            width: bottom_right.x - top_left.x,
            height: bottom_right.y - top_left.y,
        };
        if (selected_rect.width <= 10 || selected_rect.height <= 10)
            return;
        zoomVideoToRect(video, selected_rect);
        video.click();
    };
    var setupZoomFeature = function () {
        var video = document.querySelector(VIDEO_SELECTOR);
        if (video === null)
            return;
        video.addEventListener('mousedown', handleDragStart);
        video.addEventListener('mouseup', handleDragEnd);
    };
    var onKeyPress = function (e) {
        var video = document.querySelector(VIDEO_SELECTOR);
        if (video === null)
            return;
        if (e.key === 'r')
            video.style.transform = '';
    };
    // main
    var main = function () {
        var document_observer = new MutationObserver(setupZoomFeature);
        document_observer.observe(document.body, {
            attributes: true,
        });
        document.addEventListener('keypress', onKeyPress);
    };
    console.log("[" + SCRIPT_NAME + "] loaded.");
    main();
})();
