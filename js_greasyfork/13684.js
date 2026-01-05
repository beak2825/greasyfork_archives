// ==UserScript==
// @name         Slack Full Theme plugin
// @namespace    http://mrkannah.com/
// @version      1.0.2
// @description  Applies the side bar colors for slack to the entire application
// @author       Fadee Kannah
// @match        https://*.slack.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/13684/Slack%20Full%20Theme%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/13684/Slack%20Full%20Theme%20plugin.meta.js
// ==/UserScript==

$(document).ready(function(){
    var checkInterval = setInterval(function(){
        if(Ready()){
            var colors = GM_getValue('ST_Colors').toString().split(',');
            clearInterval(checkInterval);
            if(colors){
                setUp(colors);
            }
            else{
                setTimeout(function(){
                    colors = getColors();
                    setTimeout(setUp(colors),300);
                },100);
            }
        }
    },200);
});

function setUp(colors){
    applyColors(colors);
    addListner();
}

function Ready(){
    return parseInt($('#loading_welcome').css('opacity')) ? 0 : 1;
}

function getColors(){
    $('#team_menu')[0].click();
    $('#member_prefs_item > a')[0].click();
    var colors = $('#sidebar_theme_custom').val().toString().split(',');
    $('.dialog_go ')[0].click();
    return colors;
    /* Array Index
0 Col BG
1 Menu BG
2 Active Item
3 Active Text
4 Hover Item
5 Text Color
6 Active precesne
7 mention Badge
*/
}

function applyColors(colors){
    GM_setValue('ST_Colors',colors);
    console.log(colors);
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'fullThemePlugin';

    //header & footer styles
    style.innerHTML = '#header{ background:'+colors[1]+'}' +
        '#end_div{background:'+colors[1]+'}' +
        '#channel_members_toggle{ background:'+colors[1]+'!important}'+
        '#footer{background:'+colors[0]+'}'+
        '#primary_file_button:hover {background:'+colors[4]+';color: '+colors[5]+';border-color:'+colors[4]+'}';

    //divier styles
    style.innerHTML +='.day_divider{background:'+colors[0]+' !important}' +
        '.day_divider_label{background:'+colors[0] +'!important;color:'+colors[3]+'}';

    //messages styles
    style.innerHTML += '.msgs_holder{background:'+colors[0]+'}'+
        '.mention{color:'+colors[1]+';background:'+colors[7]+'!important}' +
        '.light_theme .message_sender {color:'+colors[3]+' !important}' +
        '.message_content{color:'+colors[5]+'}';

    //Global Styles
    style.innerHTML += 'a{color:'+colors[2]+'!important}'+
        '.msg_inline_file_preview_title{color:'+colors[2]+'!important}'+
        'body{background:'+colors[0]+'}';

    //scroll bar styles
    style.innerHTML += '.monkey_scroll_handle_inner{background:'+colors[2]+'!important;border:0!important}' +
        '.monkey_scroll_handle{position:relative;left:-1px!important;width:10px!important}';

    head.appendChild(style);

    return $(style);

}

function addListner(){
    $('#team_menu').on('click',function(){
        $('#member_prefs_item > a').on('click',function(){
            setTimeout(function(){
                $('.color_hex').on('input',function(){
                    changeColors();
                });
                $('input[name="sidebar_theme_rd"]').on('change',function(){
                    changeColors();
                });
                $('#sidebar_theme_custom').on('input change',function() {
                    changeColors();
                });
                $('.color_swatch').on('click', function(){
                    setTimeout(function(){
                        changeColors();
                    },700);
                });
            },500);
        });
    });
}

function changeColors(){
    var colors = $('#sidebar_theme_custom').val().split(',');
    $('#fullThemePlugin').remove();
    applyColors(colors);
}
