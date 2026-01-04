// ==UserScript==
// @name        智慧树挂机脚本
// @description 改自LengSword的脚本.支持见面课半自动挂机.主要功能为:跳过视频内试题 1.5倍加速 自动下一章 自动切换标清 允许右键菜单
// @icon        http://assets.zhihuishu.com/icon/favicon.ico
// @match	    *://*.zhihuishu.com/*
// @namespace   http://tampermonkey.net/
// @version	    1.62
// @author      simpsonlau & LengSword
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/381001/%E6%99%BA%E6%85%A7%E6%A0%91%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/381001/%E6%99%BA%E6%85%A7%E6%A0%91%E6%8C%82%E6%9C%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

//ablePlayerX('mediaplayer').options
//saveCacheIntervalTime
(function() {
    'use strict';
    const $ = window.jQuery;

    function query() {
        // 允许右键菜单 方便查找
        $("#mediaplayer").off('contextmenu');
        var doc = document;
            doc.oncontextmenu = doc.onpaste = doc.oncopy = doc.oncut = doc.onselectstart = null;

        // 模拟弹题答题测试
        if ($("#popbox_title").length > 0) {
            let popbox_iframe = $('#tmDialog_iframe').contents();

            popbox_iframe.find('.answerOption :input')[0].click()
            $(".popboxes_close")[0].click();
            // console.log('关闭窗口');
        }

        if ($("#chapterList .time_ico.fl").nextAll()[2].children[0].style.width === "100%" || $("video")[0].ended) {
            var num = -1;
            var text = $("#chapterList .time_ico.fl").parent().nextAll()[++num].id;
            while (text === "" ||
                   text.substr(0, 5) != "video" ||
                   text.substr(0, 7) === "video-0") {
                text = $("#chapterList .time_ico.fl").parent().nextAll()[++num].id;
            }
            $("#chapterList .time_ico.fl").parent().nextAll()[num].click();
        }
        // 高清则切换
        if($(".definiLines .active")[0].className === "line1gq active") {
            // console.log('切换到标清');
            $(".line1bq")[0].click();
        }

        if ($("video").length > 0 && $("video")[0].playbackRate != 1.5) {
            // console.log('切换到1.5倍');
            $(".speedTab15")[0].click();
        }

        if ($("video")[0].volume > 0) {
            $(".volumeIcon").click();
        }
    }

    function liveQuery() {
        $(".video_con").off('contextmenu');

        if($(".curVideo:not(.disNo)").prev().text() === "100%" || $("video")[0].ended) {
            var selector = $(".videomenu.current_player").next();
            var text = selector.text();
            if(text !== "") {
                selector.click();
            }
        }

        if($(".definiLines .active")[0].className === "line1gq active") {
            // console.log('切换到标清');
            $(".line1bq")[0].click();
        }

        if ($("video").length > 0 && $("video")[0].playbackRate != 1.5) {
            // console.log('切换到1.5倍');
            $(".speedTab15")[0].click();
        }

        if ($("video")[0].volume > 0) {
            $(".volumeIcon").click();
        }
        // 关弹幕
        $("#danmu").removeClass("bulletSwitchOn").addClass("bulletSwitchOff");

        // 签到达标则停止定时器的运行并暂停(你也可取消以下84行的代码来实现签到达标则直接关闭页面)
        if($(".finish_tishi")[0].className.indexOf("disNo") === -1) {
            window.clearInterval(liveQuery);
            $(".pauseButton").click();
            // window.close();
        }

    }

    if(window.location.href.indexOf("lc.zhihuishu.com/live/vod_room.html") !== -1) {
        window.setInterval(liveQuery, 1000);
    } else {
        window.setInterval(query, 1000);
    }

})();