// ==UserScript==
// @name         Lichess broadcast full screen.
// @description  Lichess broadcast, please use my available screen space, thank you.
// @match        https://lichess.org/broadcast/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @version 0.0.1.20181109183043
// @namespace https://greasyfork.org/users/224806
// @downloadURL https://update.greasyfork.org/scripts/374183/Lichess%20broadcast%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/374183/Lichess%20broadcast%20full%20screen.meta.js
// ==/UserScript==

// Ririn @schachhobbyist share the code :)
// schachhobbyist @Ririn here have code :)

// its dirty, fix bugs on your own :-p

(function() {
    'use strict';
    setTimeout(function(){
        $.noConflict(); // https://api.jquery.com/jQuery.noConflict/
        jQuery(document).ready(function($) { // https://api.jquery.com/ready/

            let head = $('html > head').eq(0);

            function addStyle(style){
                head.append(
                    '<style type="text/css">' + style + '</style>'
                );
            }


            // remove or comment out the '//// ... ////' part you dont want.

            //// Remove the friend box
            $('#friend_box').remove();
            ////

            //// Remove that box under the board
            $('.underboard').remove();
            ////

            //// Remove the engine stuff over the notation (i dont need it, i let my chess software run on second screen)
            $('.ceval_box').remove();
            ////

            //// Move the 'Lichess.org' link to the very top left
            addStyle(
                '.board_left > h1 {position:absolute!important; top:-55px!important;left:0!important;}' +
                '.board_left > h1 * {font-size:18px!important;}' +
                '.side_box.study_box {margin-top:0!important;}'
            );
            ////

            //// Make the box above the chat box smaller
            addStyle('.side_box.study_box > .list.chapters {max-height:60px!important;}');
            $('.list.chapters').eq(0).addClass('scroll-shadow-soft');
            ////

            //// Make the boxes left and right of the board use the available space
            addStyle(
                'body > .content {width:95vw!important;overflow:visible!important;}' +
                '#site_header {width:calc(98vw - 512px - 30vw)!important;padding-right:15px!important; min-width:210px!important;}' +
                '.side_box.study_box, #chat, .under_chat {margin-left:0!important; width:100%!important;}' +
                '#chat {height:460px!important;}' +
                '.lichess_ground {width:30vw!important; min-width:265px!important; height:600px!important;}' +
                '#lichess {margin-left:calc(98vw - 512px - 30vw)!important;}' // fix mouse hover
            );
            ////

            //// Make the player names be aligned with the rest
            addStyle(
                '.player_bar.black {top:0!important;}' +
                '.lichess_board {top:26px!important;}' +
                '.player_bar.white{bottom:-52px!important;}'
            );
            ////

            //// clean up the top menu a little bit
            addStyle(
                '#top {width:96.5vw!important;}' +
                '#topmenu {left:calc(95vw - 840px)!important;}'
            );
            ////

            //// Make scrollbars twice as fat
            addStyle(
                'body ::-webkit-scrollbar,body ::-webkit-scrollbar-corner {width: 16px!important;}'
            );
            ////

            //// finally move everything a bit to the top
            addStyle(
                '.content.is2d {margin-top:15px!important;}' +
                '.board_left > h1 {top:-35px!important;}'
            );
            ////

        });
    }, 1000);
})();