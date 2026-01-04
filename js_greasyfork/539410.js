// ==UserScript==
// @name        公需::ggfw.gdhrss
// @namespace    https://greasyfork.org/
// @version      1.5.2
// @description  gd gx
// @author       xd0g
// @icon         https://ggfw.gdhrss.gov.cn/favicon.ico
// @match        http*://ggfw.gdhrss.gov.cn/zxpx/auc/play*
// @match        http*://ggfw.hrss.gd.gov.cn/zxpx/auc/play*
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/539410/%E5%85%AC%E9%9C%80%3A%3Aggfwgdhrss.user.js
// @updateURL https://update.greasyfork.org/scripts/539410/%E5%85%AC%E9%9C%80%3A%3Aggfwgdhrss.meta.js
// ==/UserScript==


setTimeout(function () {
    //静音
    p.tag.muted = true;
    //删题
    (function() {
    'use strict';

    const script = document.createElement('script');
    script.textContent = `
        // 替换 map 变量
        if (typeof map !== 'undefined') {
            map = {};
        }
    `;
    document.body.appendChild(script);
    })();
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
        //console.log($('.learnpercent').text().indexOf('已完成') != -1)
    }, 500)//错误自动刷新
}, 1000);//延时1秒进行