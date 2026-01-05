// ==UserScript==
// @name         Block From Profile and Posts
// @namespace    pxgamer
// @version      1.3
// @description  Block users from on their profile and/or posts
// @author       pxgamer & Keka
// @include      *kat.cr/*
// @require      https://greasyfork.org/scripts/19498-get-blocked-users/code/Get%20Blocked%20Users.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19516/Block%20From%20Profile%20and%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/19516/Block%20From%20Profile%20and%20Posts.meta.js
// ==/UserScript==

var hideBlocked = false; // true hides blocked users posts / false shows them with a green blocked icon

/////////////// Do NOT Edit Below This Line ///////////////
var blockedArray = gbu(); // blocked users list

$(window).load(function(){
    if (window.location.href.search("\/user\/") != -1){
        var who  = $.trim($("h1.nickname").html().split('<')[0]);
        var bm   = $('a.kaButton.smallButton.normalText[href^="/bookmarks/"');
        var hash = bm.attr('href').split('/')[4];
        if(blockedArray.indexOf(who) !== -1){bm.after(' <span title="unblock user" class="kaButton smallButton greenButton normalText unBlockUser"><i id="unBlockUser" data-whoBlock="'+hash+'" class="ka ka-delete"></i> unblock user</span>');}
        else{bm.after(' <span title="block user" class="kaButton smallButton redButton normalText blockUser"><i id="blockUser" data-whoBlock="'+who+'" class="ka ka-delete"></i> block user</span>');}
    }
    if (window.location.href.search("\/community\/") != -1){
        $("div[id^='post']").each(function(){
            var thisPost = $(this);
            var who;
            if($(this).find('.userPic i.ka-message').length){
                who = $(this).find('.userPic i.ka-message').parent('a').attr('href').split('/')[3];
                //$(this).find('.userPic i.ka-community').parent().after('<span title="block user" class="blockUser"><i id="blockUser" data-whoBlock="'+who+'" class="ka ka-red icon16 ka16 ka-community"></i></span>');
            }
            if(blockedArray.indexOf(who) == -1){
                $(this).find('.userPic i.ka-community').parent().after('<span title="block user" class="blockUser"><i id="blockUser" data-whoBlock="'+who+'" class="ka ka-red icon16 ka16 ka-community"></i></span>');
            }
            else{
                if(hideBlocked === true){
                    thisPost.hide();
                    thisPost.prev('div.commentHeadLine').text('Blocked User Post ('+who+')');}
                else{
                    thisPost.find('.rate').hide();
                    thisPost.find(".commentcontent div:last-child").hide();
                    $(this).find('.userPic i.ka-community').parent().after('<span title="blocked user"><i data-whoBlock="'+who+'" class="ka ka-green icon16 ka16 ka-community"></i></span>');}
            }
        });
    }
    
    /* Functions */
    $('.blockUser').click(function() {
        var csrf = $('form input[name="csrf_token"]').val();
        var user = $(this).find('i').attr('data-whoblock');
        $.ajax({
            type: "POST",
            url: "/settings/privacy/",
            data: { blockuser: user, csrf_token: csrf, block: true },
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
});