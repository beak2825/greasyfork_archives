// ==UserScript==
// @name         知乎
// @namespace    zgzhihu
// @version      0.31
// @description  统计知乎回答时间
// @author       You
// @match        *://www.zhihu.com/people/*
// @match        *://www.zhihu.com/question/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/393177/%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/393177/%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function getDateStr(seconds){
        var date = new Date(seconds*1000)
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var currentTime = year + "-" + month + "-" + day + "  " + hour + ":" + minute + ":" + second;
        return currentTime
    }
    function utc2beijing(utc_datetime) {
        // 转为正常的时间格式 年-月-日 时:分:秒
        var T_pos = utc_datetime.indexOf('T');
        var Z_pos = utc_datetime.indexOf('Z');
        var year_month_day = utc_datetime.substr(0,T_pos);
        var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
        var new_datetime = year_month_day+" "+hour_minute_second;
        // 处理成为时间戳
        timestamp = new Date(Date.parse(new_datetime));
        timestamp = timestamp.getTime();
        timestamp = timestamp/1000;
        // 增加8个小时，北京时间比utc时间多八个时区
        var timestamp = timestamp+8*60*60;
        // 时间戳转为时间
        return getDateStr(timestamp);
        //var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        //return beijing_datetime;
    }

    //个人主页回答
    function loadPeopleContent() {
        let checkLoadListTimer = setInterval(function(){
            if(!$('.PlaceHolder.List-item').length) {
                clearInterval(checkLoadListTimer);
                let tabType = location.href.includes('/answers');
                //1回答 0文章
                $(".List-item").each(function() {
                    let createdTime = utc2beijing($(this).find("meta[itemprop="+(tabType ? "dateCreated" : "datePublished")+"]").eq(0).attr('content'));
                    let content = "<span style='color:#f00;font-weight:900'>"+createdTime+"</span>"
                    $(this).find(".AuthorInfo."+(tabType?"AnswerItem":"ArticleItem")+"-authorInfo").append(content);
                });
            }
        },200);
    }
    //翻页
    $('body').on('click', ".Pagination button", function(event) {
        loadPeopleContent();
    });

    //tab点击
    $('body').on('click', '.Tabs.ProfileMain-tabs li[aria-controls="Profile-answers"]', function(event) {
        loadPeopleContent();
    });
    $('body').on('click', '.Tabs.ProfileMain-tabs li[aria-controls="Profile-posts"]', function(event) {
        loadPeopleContent();
    });
    //排序
    $('body').on('click', ".Select-list button", function(event) {
        loadPeopleContent();
    });
    if(location.href.match(/www.zhihu.com\/people\/.+\/answers/) || location.href.match(/www.zhihu.com\/people\/.+\/posts/)) {
        loadPeopleContent();
    }



    //问题回答列表自动跳转到该回答底部
    setInterval(function(){
        let toAnswerBottomEle = $(".toAnswer-bottom");
        if(toAnswerBottomEle.parents(".is-fixed").length) {
            return;
        }else {
            toAnswerBottomEle.remove();
            $(".ContentItem-actions.Sticky.RichContent-actions.is-fixed.is-bottom Button.ContentItem-action.ContentItem-rightButton.Button--plain").before("<button class='toAnswer-bottom Button ContentItem-action Button--plain'>直达底部</button>");
        }
    }, 1000);

    $("#root").on("click", ".toAnswer-bottom", function() {
        let scrollEle = $(this).parents(".ContentItem.AnswerItem").find(".ContentItem-time");
        if(scrollEle&&scrollEle.length) {
            let offsetTop = scrollEle.offset().top - 0.8*document.documentElement.clientHeight;
            $('body,html').animate({scrollTop: offsetTop}, 50);
        }
    })



})();