// ==UserScript==
// @name         Wykop tag slider
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Slide your tags like a boss!
// @author       @incognito_man
// @match        http://www.wykop.pl/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/14590/Wykop%20tag%20slider.user.js
// @updateURL https://update.greasyfork.org/scripts/14590/Wykop%20tag%20slider.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var $rightArrow = $('<div id="x-next-tag" style="position: fixed;top: 42%; right: 0; height: 100%; z-index: 1000"><a href="#"><img src="http://www.dmariecouture.com/wp-content/uploads/2012/09/arrow_right_thin-150x150.png"></a></div>'),
    refreshUrl = $('.notification.m-tag .hashtag.ajax').data('ajaxurl') +'/hash/' + wykop.params.hash;

GM_xmlhttpRequest({
    method: "GET",
    url: refreshUrl,
    onload: function(response) {
        var data = JSON.parse(response.responseText.substr(8));
        var html = data.operations[0].data.html;
        var lastUnreadEntry = $(html).find('li.type-light-warning a:last-child')[0];
        if(response.status == 200 && lastUnreadEntry != undefined) {
            var entryUrl = $(lastUnreadEntry).attr('href');
            $rightArrow.find('a').attr('href', entryUrl);
            $(document.body).append($rightArrow);
            $(document).keydown(function (e) {
                if(e.keyCode == 39 && document.body == e.target) {
                    document.location = entryUrl;
                }
            });
        }
    }
});