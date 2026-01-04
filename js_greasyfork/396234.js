// ==UserScript==
// @name         DoubanBroadcastTime.show()
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  显示豆瓣广播的发布时间
// @author       守夜岛岛主
// @match        https://www.douban.com/
// @match        https://www.douban.com/?p=*
// @match        https://www.douban.com/people/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396234/DoubanBroadcastTimeshow%28%29.user.js
// @updateURL https://update.greasyfork.org/scripts/396234/DoubanBroadcastTimeshow%28%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* -----显示设置----- */

    var displayFormat = 0;
    // 0: 最近的日期仍用昨天、今天表示
    // 1: 总是显示完整的日期时间，如1970-01-01 08:00:00

    var displayAMPM = 0;
    // 0: 24小时制
    // 1: 12小时制

    /* -----显示设置----- */
    function chkParam(){
        if (displayFormat != 0 && displayFormat != 1){
            displayFormat = 0;
        }
        if (displayAMPM != 0 && displayAMPM != 1){
            displayAMPM = 0;
        }
    }

    function processStr(original, datetime){
        var resultDate = "";
        var resultTime = "";
        switch(displayFormat){
            case 0: {
                resultDate = original + " ";
                break;
            }
            case 1: {
                resultDate = datetime.slice(0, 11);
                break;
            }
        }

        if (original.search("前") == -1){
            resultTime = datetime.slice(11, 16);
        }

        switch(displayAMPM){
            case 0: {
                break;
            }
            case 1: {
                var hour = parseInt(resultTime.slice(0, 2));
                if (original.search("前") == -1){
                    resultTime = (hour <= 12) ? "上午" + resultTime : "下午" + (hour - 12).toString() + resultTime.slice(2, 5);
                }
                break;
            }
        }

        return resultDate + resultTime;
    }

    function showDatetime() {
        var tag = document.getElementsByClassName("created_at");
        for( var i = 0 , j = tag.length ; i < j ; i++ ){
            var datetimeStr = tag[i].title; // 标准时间日期字符串
            var original = tag[i].getElementsByTagName("a")[0].text; // 原有的
            tag[i].getElementsByTagName("a")[0].text = processStr(original, datetimeStr);
        }
    }
    chkParam();
    showDatetime();
})();