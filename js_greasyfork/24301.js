// ==UserScript==
// @name         linkedIn learning video download
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Allows to download learning videos you see on LinkedIn. Must be logged in.
// @author       rightDroid
// @include      https://www.linkedin.com/learning/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24301/linkedIn%20learning%20video%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/24301/linkedIn%20learning%20video%20download.meta.js
// ==/UserScript==


$('body').ready(function(){
(function() {
    var download_button = `<li class="course-banner__action-item download_video_button">
<button title="Right click, Save as ..." class="disabled add-menu-dropdown__trigger btn-tertiary btn-large btn-inverse dropdown-trigger ember-view"><li-icon aria-hidden="true" type="ribbon-icon" size="large"><svg fill="#FFF" class="svg-icon" viewBox="0 0 20 20">
<path d="M17.064,4.656l-2.05-2.035C14.936,2.544,14.831,2.5,14.721,2.5H3.854c-0.229,0-0.417,0.188-0.417,0.417v14.167c0,0.229,0.188,0.417,0.417,0.417h12.917c0.229,0,0.416-0.188,0.416-0.417V4.952C17.188,4.84,17.144,4.733,17.064,4.656M6.354,3.333h7.917V10H6.354V3.333z M16.354,16.667H4.271V3.333h1.25v7.083c0,0.229,0.188,0.417,0.417,0.417h8.75c0.229,0,0.416-0.188,0.416-0.417V3.886l1.25,1.239V16.667z M13.402,4.688v3.958c0,0.229-0.186,0.417-0.417,0.417c-0.229,0-0.417-0.188-0.417-0.417V4.688c0-0.229,0.188-0.417,0.417-0.417C13.217,4.271,13.402,4.458,13.402,4.688"></path>
</svg> </li-icon>
<span class="text" aria-hidden="true">Download</span>
<span class="visually-hidden">Download Video</span>
</button></li>`;
    addDownloadButton = function(){
        $('.course-banner__actions').prepend(download_button);
        $('li.download_video_button > button').wrap('<a href="#"></a>');
        $('li.download_video_button').off();
        $('li.download_video_button').unbind();
        $('li.download_video_button').children().off();
        $('li.download_video_button').children().unbind();
    };
    checkIfReadyToLoad = function(){
        if($('.course-banner__actions').length && $('.download_video_button').length == 0){
            addDownloadButton();
        }
        else{
            setTimeout(checkIfReadyToLoad,2000);
        }
    };
    checkIfReadyToLoad();
    checkForVideoPlayer = function(){

        if($('video').length){
            var vid_source = $('video').attr('src');
            $('.download_video_button > a').attr('href', vid_source);
            var vid_name = vid_source;
            $('.download_video_button > a').attr('download', vid_name);
            $('.download_video_button > a > button').removeClass('disabled');
        }
        else
        {
            $('.download_video_button > a > button').addClass('disabled');
        }
    };
    $('body').on('mouseover', 'li.download_video_button', function(){
        checkForVideoPlayer();
    });
    $('body').on('mouseover', '.course-body__content', function(){
        checkIfReadyToLoad();
    });

})();

});