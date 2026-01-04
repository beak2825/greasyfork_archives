// ==UserScript==
// @name         煤炭行业现代远程教育培训网自动播放下一节视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  煤炭行业现代远程教育培训网自动播放下一节视频，配合globalspeed插件实现倍速，最大设置14倍速，再大的话就系统进度就不会变
// @author       yhr
// @match        https://www.coaledu.net/html/coursePlay.html*
// @run-at       document-end
// @icon         https://www.coaledu.net/favicon.ico
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530067/%E7%85%A4%E7%82%AD%E8%A1%8C%E4%B8%9A%E7%8E%B0%E4%BB%A3%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/530067/%E7%85%A4%E7%82%AD%E8%A1%8C%E4%B8%9A%E7%8E%B0%E4%BB%A3%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
(function () {
    'use strict';
    var timeout = setTimeout(function () {
        clearInterval(loop);
    }, 1000 * 10);

    var loop = setInterval(function () {
        var textToFind = "继续"; //继续看课弹窗
        var $spans = $("span:contains('" + textToFind + "')");
        var skipBtn = $spans.parent('button');
        if (skipBtn.is(':visible')) {
            skipBtn.click();
            clearInterval(loop);
        }
    }, 1000);

    var loop2 = setInterval(function () {
        //var current = document.querySelector('a.nowrap.on.subset-class');
      var current = $("a.nowrap.on.subset-class");
        findnext(current);
        var replayBtn = $('div.adrPlayBtn');
        if (replayBtn.is(':visible')) {
            location.reload();
        }
    }, 1000 * 5);

    var findnext = function (current) {
        var currentpercent = current.next().text();
        //alert(currentpercent);
        if (currentpercent.includes("100")) {
            var parent1 = current.parent('.row1');
            var next = parent1.next('.row1').children('a.nowrap.subset-class');
            if (next.length) {
                findnext(next);
            } else {
                var parent2 = parent1.parents('.row1');
                var next2 = parent2.next('.row1').find('a.nowrap.subset-class').first();
                if (next2.length) {
                    findnext(next2);
                } else {
                    clearInterval(loop2);
                    //alert("已看完，请选择新课程观看");
                    GM_notification({
                      text: "已看完，请选择新课程观看",
                      title: "已看完，请选择新课程观看"
                    });
                }
            }
        } else {
            current[0].click();
            var loop3 = setInterval(function () {
            var playBtn = $('.ccH5PlayBtn');
              if (playBtn.is(':visible')) {
                  playBtn.click();
                  clearInterval(loop3);
              }
            }, 2000);

        }
    }

})();
