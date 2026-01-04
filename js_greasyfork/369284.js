// ==UserScript==
// @name         Wykop tag slider (fix)
// @description  Slide your tags like a boss!
// @version      1.0.6
// @author       @incognito_man, opsomh
// @namespace    https://greasyfork.org/en/users/30-opsomh
// @match        https://www.wykop.pl/*
// @downloadURL https://update.greasyfork.org/scripts/369284/Wykop%20tag%20slider%20%28fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/369284/Wykop%20tag%20slider%20%28fix%29.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var $rightArrow = $('<div id="x-next-tag" style="position: fixed;bottom: -42%; right: 0; height: 100%; z-index: 1000; font-size: 150px;"><a href="#">〉</a></div>'),
    refreshUrl = $('.notification.m-tag .hashtag.ajax').data('ajaxurl') +'/hash/' + wykop.params.hash;

$.ajax({
    method: "GET",
    url: refreshUrl,
    complete: function(response) {
        var data = JSON.parse(response.responseText.substr(8));
        var html = data.operations[0].data.html;
        var lastUnreadEntry = $(html).find('li.type-light-warning a:last-child')[0];
        if(response.status == 200 && lastUnreadEntry !== undefined) {
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