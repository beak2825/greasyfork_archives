// ==UserScript==
// @name        Fullscreen VoiceTube
// @namespace   fullscreen.voicetube
// @description Make VoiceTube Video FullScreen !
// @include     https://*.voicetube.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     1.3
// @grant       none
// @icon        http://tw.blog.voicetube.com/wp-content/uploads/2014/07/unnamed-2.png
// @downloadURL https://update.greasyfork.org/scripts/12832/Fullscreen%20VoiceTube.user.js
// @updateURL https://update.greasyfork.org/scripts/12832/Fullscreen%20VoiceTube.meta.js
// ==/UserScript==

jQuery.noConflict()

if (location.hostname.charAt(0) == "w") {
    subdomain = "www"
    fullscreen = "Fullscreen"
} else if (location.hostname.charAt(0) == "t") {
    subdomain = "tw"
    fullscreen = "全螢幕播放"
}

if (location.pathname.search(/videos/) >= 0) {
    var VideoPATH = location.pathname
    var VideoID = VideoPATH.substring(VideoPATH.indexOf("s/") + 2, VideoPATH.indexOf("s/") + 7)
    var EmbedURL = 'https://' + subdomain + '.voicetube.com/embed/' + VideoID
    jQuery('#embed-section').append('<a href="javascript:;" id="fullscreenBtn">&nbsp;' + fullscreen + '</a>')
    jQuery('#fullscreenBtn').click(function() {
        window.open(EmbedURL, '_blank')
    })
} else if (location.pathname.search(/embed/) >= 0) {
    var browserHeight = jQuery(window).height()
    var YTContainerHeight = browserHeight * 0.85
    jQuery('#youtube').css("height", YTContainerHeight + 'px')
    jQuery('#caption_block').css({
        "font-size": "200%",
        "line-height": "150%"
    })
};
