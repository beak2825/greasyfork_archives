// ==UserScript==
// @name         User RSS on Profile
// @namespace    pxgamer
// @version      0.1
// @description  Adds user uploads RSS button to their profile.
// @author       pxgamer
// @include      *kat.cr/user/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20237/User%20RSS%20on%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/20237/User%20RSS%20on%20Profile.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    var nick = $('h1.nickname').html().split('<span ')[0].trim();
    if (nick == $('span.usernameProfile.menuItem').text()) {
        $('div.profileBody').before('<div class="botmarg10px" style="margin-left: 5px"><a href="http://kat.cr/usearch/user%3A'+nick+'/?rss=1" target="_blank" class="kaButton smallButton normalText ka-red"><i class="ka ka-icon16 ka-rss"></i> My Upload RSS</a></div>');
    }
    else {
        $('div.userPic.floatleft.userPicSize100px').next('div.botmarg10px').append('<a href="http://kat.cr/usearch/user%3A'+nick+'/?rss=1" target="_blank" class="ka-red kaButton smallButton normalText"><i class="ka ka-icon16 ka-rss"></i> User Upload RSS</a>');
    }
})();
