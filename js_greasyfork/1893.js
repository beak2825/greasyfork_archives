// ==UserScript==
// @name           RU-Board WhosOnline mod
// @author         Zloy_Gelud
// @license        MIT
// @namespace      https://greasyfork.org/scripts/1893-ru-board-whosonline-mod
// @description    Скрипт добавляет значок справа от имени юзера зеленого цвета - пользователь в онлайне, красного - модератор в онлайне, серого - оба в офлайне
// @icon           http://forum.ru-board.com/favicon.ico
// @encoding 	   utf-8
// @include        http*://forum.ru-board.com/topic.cgi?forum=*
// @include        http*://72.233.112.78/topic.cgi?forum=*
// @include        http*://forum.ru-board.com/forum.cgi?forum=*
// @include        http*://72.233.112.78/forum.cgi?forum=*
// @require        http://code.jquery.com/jquery-2.1.1.min.js
// @screenshot     http://s3.amazonaws.com/uso_ss/25950/large.png
// @version        0.4.4
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/1893/RU-Board%20WhosOnline%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/1893/RU-Board%20WhosOnline%20mod.meta.js
// ==/UserScript==
if ((document.cookie.indexOf('amembernamecookie') >= 0) && (document.cookie.indexOf('apasswordcookie') >= 0)) {
    var OnlineUsers = [];
    var Protocol = window.location.protocol;
    //console.time('RBWO-AJAX');
    $.ajax({
        type: 'GET',
        url: Protocol + '//forum.ru-board.com/whosonline.cgi',
        dataType: 'html',
        cache: false,
        success: function (html) {
            $('tr.dats td:first-child > b > a', html).each(function () {
                var Name = $('font', this);
                if (Name.length > 0) {
                    OnlineUsers[$(Name).html()] = 'mod';
                } else {
                    OnlineUsers[$(this).html()] = 'mem';
                }
            });
        }
    });
    //console.timeEnd('RBWO-AJAX');
    
    $(document).ajaxComplete(function (e) {
        //console.time('RBWO-Draw-Icons');
        $('a.m > b, tr[bgcolor="#FFFFFF"] td:last-child.dats > a', 'table').each(function (user) {
            var Icon = $('<div/>'),
                Status = OnlineUsers[$(this).html()];
            Icon.attr({
                style: 'width:4px;height:4px;left:4px;top:-1px;border-radius:100%;position:relative;display:inline-block;'
            });

            switch (Status) {
            case 'mod':
                $(Icon).css({
                    'background': '#cc4f4f',
                    'border': '1px solid #ff3126',
                    'box-shadow': '0 0 2px rgba(125,0,0,0.9)'
                });
                $(Icon).attr({
                    title: 'Moderator online'
                });
                break;
            case 'mem':
                $(Icon).css({
                    'background': '#7AC774',
                    'border': '1px solid #54B94E',
                    'box-shadow': '0 0 2px rgba(0,125,0,0.9)'
                });
                $(Icon).attr({
                    title: 'User online'
                });
                break;
            default:
                $(Icon).css({
                    'background': '#C0C0C0',
                    'border': '1px solid #A0A0A0',
                    'box-shadow': '0 0 2px rgba(51,51,51,0.9)'
                });
                $(Icon).attr({
                    title: 'User offline'
                });
            }
            $(Icon).appendTo($(this).parent());
        });
        //console.timeEnd('RBWO-Draw-Icons');
    });
}