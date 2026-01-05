// ==UserScript==
// @name         Chrono-reader
// @namespace    https://github.com/piomar123/
// @version      1.1.0
// @description  Przeglądanie powiadomień na wykop.pl w kolejności chronologicznej
// @author       piomar123
// @match        http://www.wykop.pl/*
// @match        https://www.wykop.pl/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @name:en         Chrono-reader
// @description:en  Chronological tag notification reader for wykop.pl
// @downloadURL https://update.greasyfork.org/scripts/28766/Chrono-reader.user.js
// @updateURL https://update.greasyfork.org/scripts/28766/Chrono-reader.meta.js
// ==/UserScript==
// Badge bullet style by krejdd

var jq = $.noConflict();

jq('div#nav ul.clearfix:last > li.notification.m-tag').last().before(jq('<li/>', {
    id: 'chronoTag',
    html: '<a id="chronoTagButton" class="dropdown-show hashtag" href="#"><b id="chronoTagBullet" style="background:#0080FF; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
    class: "notification m-tag piomar-chronotag",
    title: "Najstarszy nieprzeczytany tag",
    alt: "Najstarszy nieprzeczytany tag"
}));

jq("#chronoTagButton").click(function(event){
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
    jq.ajax(tagiURL)
        .done(firstPageDownloaded(data))
        .fail(handleFail);

    function firstPageDownloaded(data){
        return function(html){
            html = parse(html);
            data.unreadCount = Number(jq('#hashtagsNotificationsCount', html).html());
            var notifications = jq(notificationSelector, html);
            data.currentTotal = notifications.length;
            data.oldestUrl = notifications.last().attr("href");
            if(data.currentTotal < data.unreadCount){
                downloadPage(data, 2);
                return;
            }
            if(data.unreadCount === 0){
                alert("Wszystko przeczytane");
                return;
            }
            if(!data.oldestUrl){
                alert(noUnreadMessage);
                return;
            }
            window.location.href = data.oldestUrl;
        };
    }

    function downloadPage(data, page){
        jq.ajax(tagiURL + "strona/" + page + "/")
            .done(nextPageDownloaded(data, page))
            .fail(handleFail);
    }

    function nextPageDownloaded(data, page){
        return function(html){
            html = parse(html);
            //data.unreadCount = Number($('#hashtagsNotificationsCount', html).html());
            var notifications = jq(notificationSelector, html);
            // possible race condition
            data.currentTotal += notifications.length;
            data.oldestUrl = notifications.last().attr("href") || data.oldestUrl;
            if(data.currentTotal < data.unreadCount && page < maxPage && checkPageNotEmpty(html)){
                downloadPage(data, page+1);
                return;
            }
            if(!data.oldestUrl){
                alert(noUnreadMessage);
                return;
            }
            window.location.href = data.oldestUrl;
        };
    }

    function parse(html){
        html = html.replace(/<img[^>]*>/g, "");
        return jq.parseHTML(html);
    }

    function checkPageNotEmpty(html){
        return jq(emptyPageAlertSelector, html).length === 0;
    }

    function handleFail(jqXHR, textStatus, err){
        alert(textStatus + ": " + err);
    }
});
