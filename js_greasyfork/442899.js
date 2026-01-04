// ==UserScript==
// @name         PlaysTV Download Helper
// @namespace    localhost
// @version      1.2
// @description  helps the user download plays tv videos easier
// @author       mydadcutstrees
// @include      *https://web.archive.org*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442899/PlaysTV%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/442899/PlaysTV%20Download%20Helper.meta.js
// ==/UserScript==

'use strict';

function NavigateToVideo() {
    //guard clause
    if(!$('#searchHome > form > button:nth-child(2)').length) return;

    //navigate to video
    var rawURL = window.location.href; //get url
    var rawURL_trimmed = rawURL.split('?from=user')[0]; //trim url
    window.location.href = rawURL_trimmed; //navigate to url
}

function GetVideoSource() {
    //get video source
    var baseURL = window.location.href.split('/https://plays.tv/video')[0];
    var videoURL = ($("#A > div:nth-child(1) > div > div.bd > ul > li > div:nth-child(2) > div.video > div > video > source:nth-child(1)").prop('src'));
    var VideoSource = baseURL + 'im_/' + videoURL;
    return VideoSource;
}

function GetVideoTitle() {
    //get video title
    var videoTitle = $('#A > div:nth-child(1) > div > div.bd > ul > li > div:nth-child(2) > div.lower-wrap > div.video-info > div > p > span').html().trim();
    return videoTitle;
}

function SaveVideo(VideoSource, videoTitle) {
    //guard clause
    if(!$('#A > div:nth-child(1) > div > div.bd > ul > li > div:nth-child(2) > div.lower-wrap > div:nth-child(2) > div > div.social-line > div.social > div.social-btn-wrapper.reactions > button.social-btn.react-text.text.icn-before > span').length) return;

    //download video
    var a = document.createElement("a");
    a.href = VideoSource;
    a.setAttribute("download", videoTitle + ".mp4");
    a.click();
}

//run it
NavigateToVideo();
SaveVideo(GetVideoSource(), GetVideoTitle());