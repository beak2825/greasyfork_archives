// ==UserScript==
// @name         YouTube Uploader Videos Channel Playlist 
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      1.2
// @description  Creates playlist link of all videos from an uploader's channel (using page load trick)
// @include      https://www.youtube.com/user/*/videos
// @include      https://www.youtube.com/c/*/videos
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       drhouse
// @grant        GM_registerMenuCommand
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/444534/YouTube%20Uploader%20Videos%20Channel%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/444534/YouTube%20Uploader%20Videos%20Channel%20Playlist.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function($){
    
    var theurl = document.URL;

    function uploader(){
        window.location.href = (theurl + "?view=57")
    }

    GM_registerMenuCommand ("Uploader Playlist", uploader, "u");

})(jQuery);