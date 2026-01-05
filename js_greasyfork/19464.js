// ==UserScript==
// @name         Block From Profile
// @namespace    pxgamer
// @version      0.5
// @description  Block users from on their profile
// @author       pxgamer
// @include      *kat.cr/user/*/
// @require      https://greasyfork.org/scripts/19498-get-blocked-users/code/Get%20Blocked%20Users.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19464/Block%20From%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/19464/Block%20From%20Profile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var blockedArray = gbu();
    var who  = $.trim($("h1.nickname").html().split('<')[0]);
    var bm   = $('a.kaButton.smallButton.normalText[href^="/bookmarks/"');
    var hash = bm.attr('href').split('/')[4];
    if(blockedArray.indexOf(who) !== -1){bm.after(' <span title="unblock user" class="kaButton smallButton greenButton normalText unBlockUser"><i id="unBlockUser" data-whoBlock="'+hash+'" class="ka ka-delete"></i> unblock user</span>');}
    else{bm.after(' <span title="block user" class="kaButton smallButton redButton normalText blockUser"><i id="blockUser" data-whoBlock="'+who+'" class="ka ka-delete"></i> block user</span>');}
    var csrf = $('form input[name="csrf_token"]').val();

    // POST
    $('.blockUser').on('click', function() {
        $.ajax({
            type: "POST",
            url: "/settings/privacy/",
            data: { blockuser: $.trim($("h1.nickname").html().split('<')[0]), csrf_token: csrf, block: true },
            success: function (data) { location.reload(); },
            returnData: "json"
        });
    });
    $('.unBlockUser').click(function() {
        var csrf = $('form input[name="csrf_token"]').val();
        var hash = $(this).find('i').attr('data-whoblock');
        $.ajax({
            type: "POST",
            url: "/settings/privacy/",
            data: { unblock: hash, csrf_token: csrf },
            success: function (data) { location.reload(); },
            returnData: "json"
        });
    });

})();