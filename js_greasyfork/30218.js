// ==UserScript==
// @name         Morgenrot
// @namespace    https://aurora.iguw.tuwien.ac.at/
// @version      0.10
// @description  Enhancements for TU Vienna's Aurora
// @author       Schnitzeldude
// @match        https://aurora.iguw.tuwien.ac.at/*
// @locale       en
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30218/Morgenrot.user.js
// @updateURL https://update.greasyfork.org/scripts/30218/Morgenrot.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var selector = $('<a id=course_selector>(other course)</a>');

    if(course_short_title == 'gsi') {
        selector.attr('href', document.location.href.replace('gsi', 'hci')).text('(switch to hci)');
    } else {
        selector.attr('href', document.location.href.replace('hci', 'gsi')).text('(switch to gsi)');
    }

    $(`<style>
.shrinked, .course_selected > a > span:first-child, .long_title_text {display:none !important}
.short_title_text {
display:inline !important;
text-transform: none !important;
}
.course_selected { position: relative !important }
.feed_header, .pagehead, .pagebottom, .filterbar {
background-image: none !important; background: #243D2A !important;
border-radius: 0 !important;
text-shadow: none !important;
}
.user_info { background-size: 48px !important; width: 48px; height: 48px; }
.user_info .profile_link { display: none !important; }
.user_info .user_nick { max-width: 48px; overflow: hidden; }
.logout_button { right: 53px !important; bottom: auto; top: 10px !important; }
.pagehead > ul { left: 200px; bottom: auto; top: 10px !important; }
.pagehead {min-height: 48px !important; }
.response_deleter ~ a { display: none; }

#notification_area {
clear: both; height: 300px; overflow-y: auto;
animation: fadein 0.3s;
}
#notification_area:empty { display: none }


@keyframes fadein {
from { height: 0px; }
to   { height: 300px; }
}
#notification_area .loading { margin-top: 10px; font-size: 70px; color: #eee; text-align: center; }
</style>
`).appendTo('head');

    var initScript = function() {
        $('.course_selected').after(selector);
        $('a[href^="https://"], a[href^="http://"]').not('[href^="https://aurora.iguw.tuwien.ac.at/"]').attr('target', '_blank');
        $('.filterbar').each(function() {
            if($('.stack.finished.filter_' + $(this).data('filter')).length > 0) {
                $('.stack.filter_' + $(this).data('filter')).addClass('shrinked');
                $(this).addClass('fa-angle-down').removeClass('fa-angle-up');
            }
        });
        $('.response_deleter, .comment_deleter').closest('.comment, .response').children('.response_body, .comment_body, .response_top, .comment_top').hide();
        if(typeof COMMENTS !== 'undefined') {
            COMMENTS.registerStartPolling = COMMENTS.startPolling = function() {};
            COMMENTS.stopPolling();
        }
        $('.pagehead').before(`
<style>
#notification_area .RSS {
float:right;
}

#notification_area .RSS i {
vertical-align:middle;
}

#notification_area .notificationList {
margin-top:15px;
clear:both;
}

#notification_area .notiTop {
max-width:960px;
}

#notification_area .notification.read {
color:#999;
}

@media all and (max-width: 959px) {

#notification_area .not_head_line {
width:100%;
}

#notification_area .notification {
min-height: 30px;
width:100%;
overflow: hidden;	
border-bottom:1px solid #eee;
position:relative;
}

#notification_area .notification_text {
padding:5px;
overflow: hidden;
line-height:20px;
max-width:75%;
float:left;
}

#notification_area .darkRow {
background:#eee;
}

#notification_area .notification img {
width: 60px;
height:60px;
float: left;
vertical-align:middle;
box-sizing: border-box;
-moz-box-sizing: border-box;
-webkit-box-sizing: border-box;
}

#notification_area .notification.unread img {
border-left:3px solid rgb(58,201,88);
}

#notification_area .notification.read img {
opacity: 0.5;
}
}


#notification_area .glow {
box-shadow: 0 0 10px 3px rgb(58,201,88);
background:rgba(0,0,0,0.5);
color:black;
}

#notification_area .glow a {color:rgb(58,201,88);}


@media all and (min-width: 960px) {

#notification_area .not_head_line {
width:950px;
}

#notification_area .notification {
min-height: 30px;
width:920px;
margin-left:24px;
overflow: hidden;
border-bottom:1px solid #eee;
position:relative;
}

#notification_area .notification_text {
padding:5px;
overflow: hidden;
line-height:20px;
max-width:650px;
float:left;
}

#notification_area .notification img {
width: 30px;
height:30px;
float: left;
vertical-align:middle;
box-sizing: border-box;
-moz-box-sizing: border-box;
-webkit-box-sizing: border-box;
}

#notification_area .glow {
box-shadow: 0 0 10px rgb(58,201,88);
}
}

#notification_area a {
text-decoration:none;
color:black;
}


#notification_area .notification_time {
padding:5px;
line-height:20px;
position:absolute;
right:0;
bottom:0;
}

#notification_area #read_all_button {
margin-left:15px;
-webkit-appearance:none;
-moz-appearance:none;
appearance:none;
background-color:white;
border:none;
text-transform:uppercase;
color:rgb(58,201,88);
font-size:10px;
font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

</style>
<div id=notification_area />
`);

        var area = $('#notification_area');
        var content = area.parent().nextAll();
        $('#unread_notifications').on('click', function(e) {
            var elem = $(this);
            if(area.text().length > 0) { area.html(''); content.css('opacity', 1); return false; }

            content.css('opacity', 0.3);
            area.html('<div class=loading>loading</div>');
            $.ajax(elem.attr('href'))
                .done(function(data) {
                area.html($(data).find('#read_all_button, .RSS, a[href*="/notifications/?"]'));
            })
                .fail(function() {
                location.href = elem.attr('href');
            });
            return false;
        });
    };

    $(document).ready(initScript);
})();