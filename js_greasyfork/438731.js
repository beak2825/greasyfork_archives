// ==UserScript==
// @name         9anime Auto-1080p Select (Vidstream/Mcloud)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  auto-selects 1080p (or highest available quality) instead of the recent default 720p
// @include      https://vidstream.pro/*
// @include      https://vidstreamz.online/*
// @include      https://mcloud.to/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=9anime.to
// @downloadURL https://update.greasyfork.org/scripts/438731/9anime%20Auto-1080p%20Select%20%28VidstreamMcloud%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438731/9anime%20Auto-1080p%20Select%20%28VidstreamMcloud%29.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function($){

    const myInterval = setInterval(myTimer, 1000);

    function myTimer() {
        var $highest_check = $('#jw-settings-submenu-quality > div:nth-child(1) > button:nth-child(2)').attr('aria-checked')
        var $auto_check = $('#jw-settings-submenu-quality > div:nth-child(1) > button:nth-child(1)').text()
        //$('div.jw-icon:nth-child(14)')[0].click()
        
        if ($auto_check === 'Auto'){
            if ($highest_check === "true"){
                //$('div.jw-icon:nth-child(14)')[0].click()
                clearInterval(myInterval);
            } else {
                $('#jw-settings-submenu-quality > div:nth-child(1) > button:nth-child(2)').click()
            }
        } else {
            //$('div.jw-icon:nth-child(14)')[0].click()
            clearInterval(myInterval);
        }
    }

})(jQuery);