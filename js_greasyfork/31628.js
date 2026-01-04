// ==UserScript==
// @name         Accupass Infinite Scrolling
// @name:zh-TW   活動通 (Accupass) 無限捲頁 (自動加載下一頁)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Load next event page automatically when scroll to bottom of the page on [Accupass](https://www.accupass.com/).
// @description:zh-TW  在[活動通]((https://www.accupass.com/))瀏覽活動時，當頁面捲到頁面底部，將會自動加載下一頁活動內容，而不用手動點擊分頁按鈕
// @author       Siyuan
// @match        https://old.accupass.com/search/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.18.10/URI.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/31628/Accupass%20Infinite%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/31628/Accupass%20Infinite%20Scrolling.meta.js
// ==/UserScript==

(function ($, undefined) {
  $(function () {

var loading = false;
var initNexturl = false;
var nexturl = null;

$(document).ready(function () {
   // repack pushState for clearing loading page when changed search arguments
    (function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        initNexturl = false;
        nexturl = null;
        return pushState.apply(history, arguments);
    };
})(window.history);

   $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() > $(document).height() - 600) {
          doLoadNext();
      }
   });

});

function fixAuccpassStupidErr(uri){
    // Fixed date error cause by Accupass .../search/changeconditions/r/0/0/6/0/4/1/20170727/20170713?q= to /search/changeconditions/r/0/0/6/0/4/1/20170713/20170727?q=
    var u = new URI(uri);
    var d = u.pathname().split('/');
    if (d.length >= 2){
        var d1 = moment(d[d.length - 2], 'YYYYMMDD');
        var d2 = moment(d[d.length - 1], 'YYYYMMDD');
        if (d1.isValid() && d2.isValid()){
           if (!d1.isBefore(d2)){
               d[d.length - 2] = d2.format('YYYYMMDD');
               d[d.length - 1] = d1.format('YYYYMMDD');
               u.pathname(d.join('/'));
           }
        }
    }
    return u.toString();
}

function getNextPageUrl(dom){
    if (!dom){
        dom = $(document);
    }

    var a = dom.find("ul.pagination li.active");
    if (a.length){
        a = a.next();
        if (a.length){
        var h = a.find('a').attr('href');
        if(h.length){
            if (h.length >= 7)
            {
                if (h.indexOf('/search/') === 0)
                {
                    h = h.substring(0, 7) + '/changeconditions' + h.substring(7);
                    return fixAuccpassStupidErr(h);
                }
            }
        }
    }
        return '';
    }

    return null;
}

function doLoadNext(){
    if (loading)
        return;

    if (!initNexturl)
    {
        nexturl = getNextPageUrl();
        initNexturl = nexturl !== null;
        if (initNexturl){
            console.log("Next: " + nexturl);
        }
    }

    if (!nexturl)
        return;

    loading = true;

    // Not sure how to bind data within angular view , so use string replace to build final HTML here
    var previousSibling = $('section div[ga-hover="Page"]');
    $loader = $('<div class="clearfix"/><div class="row" style="text-align: center;">Loading...<img src="https://i0.wp.com/cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif?resize=24%2C24"></div>');
    $loader.insertBefore(previousSibling);

    $.ajax({
        url: nexturl,
    }).always(function() {
        loading = false;
        $loader.remove();
    }).done(function(html){
        var dom = $($.parseHTML(html));
        var template = `
     <div class="apcss-activity-card-header">
        <a class="apcss-activity-card-image" href="/event/register/JSON:eventIdNumber" target="_self">
            <img alt="JSON:name" src="JSON:photoUrl">
        </a>
        <span class="apcss-activity-pageview">
            <i class="icon-eye-open"></i>JSON:pageview
        </span>
    </div>
    <div class="apcss-activity-card-body">
        <a href="/event/register/JSON:eventIdNumber" target="_self">
            <h3 class="apcss-activity-card-title">JSON:name</h3>
        </a>
        <p class="apcss-activity-card-date">JSON:fullDateTimeStr</p>
        JSON:summary
    </div>
    <div class="apcss-activity-card-footer">
        <div class="row">
            <div class="col-xs-6">
                <i class="icon-heart"></i>
                <span class="apcss-activity-card-like"> JSON:likeCount Likes</span>
            </div>
            <div class="col-xs-6">JSON:StateButton
            </div>
        </div>
    </div>
`;

        dom.find('div[event-card]').each(function(){
            var raw = $(this).attr('event-row');
            var e = JSON.parse(raw);

            var bh = template;
            var buttonTemplate = '';
            if (e.remainingTicket > 0){
                if (e.eventCardStatus == 2) {
                    buttonTemplate = '<a class="apcss-btn apcss-btn-block activity-card-status-ready" target="_self" href="/event/register/JSON:eventIdNumber">On Sale (JSON:remainingTicket)</a>';
                } else {
                    buttonTemplate = '<a class="apcss-btn apcss-btn-block activity-card-status-hot" target="_self" href="/event/register/JSON:eventIdNumber">On Sale (JSON:remainingTicket)</a>';
                }
            }else{
                buttonTemplate = '<a class="apcss-btn apcss-btn-block activity-card-status-end" target="_self" href="/event/register/JSON:eventIdNumber">Sold Out</a>';
            }

            bh = bh.replace(/JSON:StateButton/g, buttonTemplate);
            bh = bh.replace(/JSON:remainingTicket/g, e.remainingTicket);
            bh = bh.replace(/JSON:eventIdNumber/g, e.eventIdNumber);
            bh = bh.replace(/JSON:name/g, e.name);
            bh = bh.replace(/JSON:photoUrl/g, e.photoUrl);
            bh = bh.replace(/JSON:pageview/g, e.pageview);
            bh = bh.replace(/JSON:fullDateTimeStr/g, e.fullDateTimeStr);
            bh = bh.replace(/JSON:summary/g, e.summary);
            bh = bh.replace(/JSON:likeCount/g, e.likeCount);

            $(this).addClass('apcss-activity-card');
            $(this).append($(bh));           
            $(this).parent().insertBefore(previousSibling);

        });

        nexturl = getNextPageUrl(dom);

        if (nexturl !== null && nexturl.length <= 0)
        {
            console.log("End");
            $end = $('<div class="clearfix"/><div class="row" style="text-align: center;">--End--</div>');
            $end.insertBefore(previousSibling);
        }
        else
        {
            console.log("Next: " + nexturl);
        }
    });
}
  });
})(window.jQuery.noConflict(true));
