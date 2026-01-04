// ==UserScript==
// @name         ResetEra 2.0 Thread Unread Button
// @version      0.1
// @description  Switches out the avatars for an unread button and changes thread title link to first post.
// @author       domthybomb
// @include      https://*.resetera.com/forums/*
// @include      https://*.resetera.com/watched/threads
// @include      https://*.resetera.com/trending/*
// @namespace https://greasyfork.org/users/230187
// @downloadURL https://update.greasyfork.org/scripts/375291/ResetEra%2020%20Thread%20Unread%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/375291/ResetEra%2020%20Thread%20Unread%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var titleLink = document.querySelectorAll('div.structItem-title > a');
    var unreadDiv = document.querySelectorAll('div.structItem--thread');

    for(var i=0;i<titleLink.length;i++){
        var unreadText = document.createElement("div");

        unreadText.className = ("unreadIcon unread"+[i]);
        unreadText.innerHTML = '<a href="' + titleLink[i].href + '"></a>';
        unreadDiv[i].appendChild(unreadText);
        titleLink[i].href = titleLink[i].href.replace('/unread','');
    }

})();