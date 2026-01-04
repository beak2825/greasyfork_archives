// ==UserScript==
// @name         Custom elephant
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An attempt to create a custom, personal and better version of GGn elephant stylesheet with some tweaks in JQuery
// @author       HitZer0
// @include      https://gazellegames.net/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/38701/Custom%20elephant.user.js
// @updateURL https://update.greasyfork.org/scripts/38701/Custom%20elephant.meta.js
// ==/UserScript==

(function (){

$('.alertbar').css('margin', '25px'); /* Re-Positioning Toolbox */
$('.linkbox').css('margin', '25px'); /* Re-Sizing User Log & Item Effects */
$('#community_stats .stats').css({'float':'left', 'width':'21%', 'list-style':'none'}); /* Dividing User Stats In 4 Columns Indead Of Mono-Colomn */
$('#user .profile .sidebar').css('width', 'auto'); /* Now Gold Generation Table Fits Properly */
    
    /* For Index, Chat, Shop, Rules, Torrent, Upload Pages,
    The Top Margin Of Wrapper & Content IDs Should Be 120 Pixels */ 
$('#index #wrapper #content').css('margin-top', '120px');
$('#content #torrentbrowse').css('margin-top', '120px');
$('#chat #content .thin').css('margin-top', '120px');
$('#shop #content .thin').css('margin-top', '120px');
$('#rules #wrapper #content').css('margin-top', '120px');
$('#user #wrapper #content').css('margin-top', '120px');
$('#torrents #wrapper #content .thin').css('margin-top', '120px');
$('#upload #wrapper #content').css('margin-top', '120px');
    
$('#user #wrapper #content .thin h2').css('padding-left', '85px');

    /* Reverting Back To 0 That 85 Pixel That I Added Above */
$('#user #wrapper #content .inventory h2').css('padding-left', '0px');
$('#user #wrapper #content .thin .header h2').css('padding-left', '0px');

    /* Fixing Comment & Icon In A Torrent */
$('#torrents .forum_post .comment_rating').css('margin-top', '25px');
$('#torrents .forum_post .comment_rating img').css({'width':'25px', 'height':'25px'});
$('#torrents .forum_post .comment_rating p').css({'padding-left':'35px', 'padding-top': '4px'});

})();