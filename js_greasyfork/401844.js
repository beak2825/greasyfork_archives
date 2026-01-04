// ==UserScript==
// @name         Chrono-reader
// @namespace    https://github.com/piomar123/
// @version      1.0.0
// @description  Przeglądanie powiadomień na wykop.pl w kolejności chronologicznej
// @author       piomar123
// @match        http://www.wykop.pl/*
// @match        https://www.wykop.pl/*
// @grant        none
/// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @name:en         Chrono-reader
// @description:en  Chronological tag notification reader for wykop.pl
// @downloadURL https://update.greasyfork.org/scripts/401844/Chrono-reader.user.js
// @updateURL https://update.greasyfork.org/scripts/401844/Chrono-reader.meta.js
// ==/UserScript==
// Badge bullet style by krejdd

// $('div#nav ul.clearfix:last > li.notification.m-tag').last().before($('<li/>', {
//     id: 'chronoTag',
//     html: '<a id="chronoTagButton" class="dropdown-show hashtag" href="#"><b id="chronoTagBullet" style="background:#0080FF; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
//     class: "notification m-tag piomar-chronotag",
//     title: "Najstarszy nieprzeczytany tag",
//     alt: "Najstarszy nieprzeczytany tag"
// }));

$(document.body).append(
  '<div id="chronoTagButton" style="position: fixed;bottom: -42%; right: 0; height: 100%; z-index: 1000; font-size: 150px;">'+
  '<a href="#">〉</a></div>'
);


$("#chronoTagButton").click(function(event){
    event.preventDefault();
    var tagiURL = "/powiadomienia/tagi/";
    var notificationSelector = '#content ul.menu-list li.type-light-warning a[href*="pl/wpis/"]';
    var emptyPageAlertSelector = "#content ul.menu-list li.type-alert p.empty";
    var noUnreadMessage = "Nie znalazłem nowszych wpisów";
    var maxPage = 30;

    var data = {
        unreadCount: 0,
        currentTotal: 0,
        oldestUrl: null
    };
    $.ajax(tagiURL)
        .done(firstPageDownloaded(data))
        .fail(handleFail);

    function firstPageDownloaded(data){
        return function(html){
            html = parse(html);
            data.unreadCount = Number($('#hashtagsNotificationsCount', html).html());
            var notifications = $(notificationSelector, html);
            data.currentTotal = notifications.length;
            data.oldestUrl = notifications.last().attr("href");
            if(data.currentTotal < data.unreadCount){
                downloadPage(data, 2);
                return;
            }
            if(data.unreadCount === 0){
                //alert("Wszystko przeczytane");
                return;
            }
            if(!data.oldestUrl){
                //alert(noUnreadMessage);
                return;
            }
            window.location.href = data.oldestUrl;
        };
    }

    function downloadPage(data, page){
        $.ajax(tagiURL + "strona/" + page + "/")
            .done(nextPageDownloaded(data, page))
            .fail(handleFail);
    }

    function nextPageDownloaded(data, page){
        return function(html){
            html = parse(html);
            //data.unreadCount = Number($('#hashtagsNotificationsCount', html).html());
            var notifications = $(notificationSelector, html);
            // possible race condition
            data.currentTotal += notifications.length;
            data.oldestUrl = notifications.last().attr("href") || data.oldestUrl;
            if(data.currentTotal < data.unreadCount && page < maxPage && checkPageNotEmpty(html)){
                downloadPage(data, page+1);
                return;
            }
            if(!data.oldestUrl){
                //alert(noUnreadMessage);
                return;
            }
            window.location.href = data.oldestUrl;
        };
    }

    function parse(html){
        html = html.replace(/<img[^>]*>/g, "");
        return $.parseHTML(html);
    }

    function checkPageNotEmpty(html){
        return $(emptyPageAlertSelector, html).length === 0;
    }

    function handleFail(jqXHR, textStatus, err){
        alert(textStatus + ": " + err);
    }
});
