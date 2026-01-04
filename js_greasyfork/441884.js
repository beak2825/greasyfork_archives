// ==UserScript==
// @name         pixiv history (Trial) unlocker
// @namespace    https://greasyfork.org/en/scripts/441884
// @version      0.1
// @description  Simple jQuery script that turns greyed out posts in pixiv history to the actual link and nothing else.
// @author       coombrain
// @match        https://www.pixiv.net/history.php
// @icon         https://www.pixiv.net/favicon.ico
// @grant        none
// @license      MIT
// @require      http://code.jquery.com/jquery-latest.min.js

// @downloadURL https://update.greasyfork.org/scripts/441884/pixiv%20history%20%28Trial%29%20unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/441884/pixiv%20history%20%28Trial%29%20unlocker.meta.js
// ==/UserScript==
var $ = window.jQuery;

$(function() {
    'use strict';

    $(document).ready(function() {
        $("html").removeClass("trial");
        setTimeout(function() {
            $("._history-container .trial").each(function() {
                let nurl = $(this).css("background-image").replace("url(\"", "").replace("\")","");
                let illidx = nurl.lastIndexOf("/")+1;
                let fname = nurl.substr(illidx);
                illidx = fname.indexOf("_");
                let illid = fname.substr(0,illidx);

                $(this).wrap("<a href='/artworks/"+ illid +"' target='_blank'></a>");
                $(this).addClass("show-detail list-item");
                $(this).removeClass("trial");
            });
        }, 2000);
        clearTimeout();
  });
});