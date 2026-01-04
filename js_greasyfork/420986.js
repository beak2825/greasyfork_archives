// ==UserScript==
// @name         Replace BHM
// @version      1.1
// @description  Replaces Youtube BHM logo with regular logo
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @include      https://www.youtube.com/*
// @include      http://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/733392
// @downloadURL https://update.greasyfork.org/scripts/420986/Replace%20BHM.user.js
// @updateURL https://update.greasyfork.org/scripts/420986/Replace%20BHM.meta.js
// ==/UserScript==

/*globals $*/

var old_url = "https://www.youtube.com/img/branding/desktop/bhm/yt_logo_v2_dark.png";
var new_url = "https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube-logo-full_color_dark.svg";
$(document).ready(
    function(){
        $("img[src='"+old_url+"']").attr("src", new_url);
        //document.getElementsByClassName('style-scope ytd-yoodle-renderer')[0].setAttribute("src", "https://www.youtube.com/about/static/svgs/icons/brand-resources/YouTube-logo-full_color_dark.svg");
        document.getElementsByClassName('style-scope ytd-yoodle-renderer')[0].setAttribute("width", "90");
        document.getElementsByClassName('style-scope ytd-yoodle-renderer')[0].setAttribute("height", "56");
    }
);