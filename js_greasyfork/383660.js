// ==UserScript==
// @name         广东继续教育和公需课自动刷课::ggfw.gdhrss
// @namespace    https://greasyfork.org/
// @version      1.5.2
// @description  广东公需课和继教刷课，章节完成自动进入下章
// @author       Cosil.C
// @icon         https://ggfw.gdhrss.gov.cn/favicon.ico
// @match        http*://ggfw.gdhrss.gov.cn/zxpx/auc/play*
// @match        http*://ggfw.hrss.gd.gov.cn/zxpx/auc/play*
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/383660/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%92%8C%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%3A%3Aggfwgdhrss.user.js
// @updateURL https://update.greasyfork.org/scripts/383660/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%92%8C%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%3A%3Aggfwgdhrss.meta.js
// ==/UserScript==


setTimeout(function () {
    //静音
    p.tag.muted = true;
    //删题
    map = {};
    var errChecking = setInterval(function () {
        //if($(".prism-ErrorMessage").css("display")!='none'){
        //  location.reload();
        //}
        if ($('.learnpercent').text().indexOf('已完成') != -1) {
            var learnlist = $("a:contains('未完成')").length != 0 ? $("a:contains('未完成')") : $("a:contains('未开始')");
            if (learnlist.length == 0) {
                if (confirm('本课程全部学习完成!即将关闭页面！')) {
                    window.close();
                }
            } else {
                learnlist.each(function () {
                    this.click();
                })
            }
        }
        //暂停时自动开始播放
        if (p.paused()) {
            p.play()
        }
    }, 500)//错误自动刷新
}, 1000);//延时1秒进行