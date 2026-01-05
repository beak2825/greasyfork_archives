// ==UserScript==
// @name         [Katcr.co] Old Header
// @namespace    pxgamer
// @version      0.6.1
// @description  Updates the header to be like the old one.
// @author       pxgamer
// @include      *katcr.co/community/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/22004/%5BKatcrco%5D%20Old%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/22004/%5BKatcrco%5D%20Old%20Header.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    let settings = {
        stickyHeader: true
    };

    let menu = {
        avatar: $('#upper_section .user .avatar img.avatar').attr('src'),
        bar: $('#main_menu').html(),
        sticky: '',
        mCount: $('#button_pm a span strong').text()
    };

    let links = {
        profile: 'https://katcr.co/community/index.php?action=profile',
        settings: 'https://katcr.co/community/index.php?action=profile;area=account',
        forumset: 'https://katcr.co/community/index.php?action=profile;area=forumprofile',
        logo: 'https://pximg.xyz/images/d2c1586c07034bc321ffb696f9929b47.png',
        logout: $('#button_logout a').attr('href'),
        replies: 'https://katcr.co/community/index.php?action=unreadreplies'
    };

    $('#header').html('');
    if (settings.stickyHeader){
        menu.sticky = 'position: fixed;';
    }
    $('#wrapper').before('<div id="new_nav" style="z-index: 1000; background: #594c2d; width: 100%; height: 50px; top: 0;'+menu.sticky+'"><div style="float: right;" class="mbar_div">'+menu.bar+'</div></div>');
    $('#button_home').remove();
    $('#new_nav').prepend('<a href="/community/" style="position: absolute;"><img src="'+links.logo+'" style="height: 40px; margin: 2% 5px; padding: 0;"/></a>');
    $('#button_profile').remove();
    $('#button_logout').remove();
    let calHtml = $('#button_calendar');
    $('#button_calendar').remove();
    $('#button_mlist').after(calHtml);
    $('#menu_nav').css('padding', '0');
    $('#button_pm ul li:first a').html('<i class="ka ka16 ka-list2 lower"></i>Dialogs');
    $('#button_pm ul li:last a').html('<i class="ka ka16 ka-message lower"></i>Create new');
    $('#menu_nav').append('<li id="button_user"> <a class="firstlevel" href="'+links.profile+'"><img src="'+menu.avatar+'" style="width:40px; height: 40px; border-radius: 50%; border: 2px solid #2c240f; margin: 5% auto; padding: 0;"></a> <ul style="right: 0;"><li> <a href="'+links.replies+'"><span class="last">Latest Replies</span></a></li><li><a href="'+links.forumset+'"><span>Forum Settings</span></a> </li><li> <a href="'+links.settings+'"><span class="last">Settings</span></a></li><li> <a href="'+links.logout+'"><span class="last">Logout</span></a></li>');
    if (menu.mCount !== '') {
        $('#button_pm a span').html('My Messages');
        $('#button_pm a').css('line-height', '3.9em');
        $('#button_pm a span').append(' <strong><sup class="" style="color: #FFA500;"><strong style="border-radius:50%; min-width: 10px; min-height: 10px; font-size: 18px; vertical-align: bottom;">*</strong>'+menu.mCount+'</sup></strong>');
    }
})();
