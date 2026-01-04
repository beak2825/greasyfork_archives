// ==UserScript==
// @name         9GAG Video Download Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Provides a download button for 9gag detail view.
// @author       Ragnar Lengson
// @match        https://9gag.com/gag/*
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/404107/9GAG%20Video%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/404107/9GAG%20Video%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Save video as button loaded');
    if($('.post-container source[type="video/mp4"]').length == 0)
    {
        return;
    }

    var videoPost = $('.post-container source[type="video/mp4"]')[0].src;
    var postContainer = $('.post-container');
    postContainer.append('<a class="btn btn-block" style="margin:0px 0px 10px 0px" target="_blank" type="application/octet-stream" href="'+videoPost+'" download>Save video as ...</a>');
})();