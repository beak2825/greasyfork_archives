// ==UserScript==
// @name         格式化JaaS Status时间
// @name:en      Format DateTime of JaaS Status
// @name:zh      格式化JaaS Status时间
// @name:zh-CN   格式化JaaS Status时间
// @namespace    https://greasyfork.org/zh-CN/users/331591
// @version      1.0.1
// @description  格式化JaaS Status的日期时间，仅供SAP内部使用。
// @description:zh  格式化JaaS Status的日期时间，仅供SAP内部使用。
// @description:zh-CN  格式化JaaS Status的日期时间，仅供SAP内部使用。
// @description:en  Format DateTime of JaaS Status. Only for SAP internal using.
// @author       Hale Shaw
// @match        https://github.wdf.sap.corp/pages/pim/ciaas/status/index.html
// @icon         https://github.wdf.sap.corp/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391719/%E6%A0%BC%E5%BC%8F%E5%8C%96JaaS%20Status%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/391719/%E6%A0%BC%E5%BC%8F%E5%8C%96JaaS%20Status%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementsByClassName("up") && document.getElementsByClassName("up")[0] != undefined) {
        var ups = document.getElementsByClassName("up");
        var downs = document.getElementsByClassName("down");
        var issues = document.getElementsByClassName("issues");
        for (var i = 0; i < ups.length; i++) {
            replaceTime(ups[i]);
        }
        for (var j = 0; j < downs.length; j++) {
            replaceTime(downs[j]);
        }
        for (var k = 0; k < issues.length; k++) {
            replaceTime(issues[k]);
        }
    }

    /**
     * Replace td innerHTML by no error new time.
     * @param {Object} td
     */
    function replaceTime(td) {
        var str = td.innerHTML;
        if (str != "" && str != undefined) {
            var assemblyTime = assembleDateTime(str);
            var newTime = addTime(assemblyTime);
            var timeStr = dateFormat("YYYY-mm-dd HH:MM", newTime);
            if(timeStr.indexOf("NaN") == -1){
                td.innerHTML = timeStr;
            }
        }
    }

    /**
     * Assemble time by string.
     * @param {String} str
     */
    function assembleDateTime(str) {
        var strArr = str.split(" ");
        var assemblyTime = "";
        if (str.indexOf(".") != -1) {
            var date = strArr[1];
            var time = strArr[2];
            var dateArr = date.split(".");
            assemblyTime = dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0] + " " + time + ":00";
        } else {
            var day = strArr[1];
            var month = strArr[2];
            var newMonth = convertMonth(month);
            var year = strArr[3];
            var timeSecond = "";
            if (strArr.length == 4) {
                timeSecond = "00:00:00";
            } else if (strArr.length == 5) {
                timeSecond = strArr[4] + ":00";
            }
            assemblyTime = year + "/" + newMonth + "/" + day + " " + timeSecond;
        }
        return assemblyTime;
    }

    /**
 * Add 8 hours on the time string, and return a new Date Object.
 * @param {String} firstTime
 */
    function addTime(firstTime) {
        var firstTimestamp = new Date(firstTime).getTime();
        var lastTimestamp = firstTimestamp + 28800000;
        var newTime = new Date(lastTimestamp);
        return newTime;
    }

    /**
 * Convert the month by the string month name.
 * @param {String} str
 */
    function convertMonth(str) {
        var month = "";
        switch (str) {
            case "January":
            case "Jan":
                month = "01";
                break;
            case "February":
            case "Feb":
                month = "02";
                break;
            case "March":
            case "Mar":
                month = "03";
                break;
            case "April":
            case "Apr":
                month = "04";
                break;
            case "May":
                month = "05";
                break;
            case "June":
            case "Jun":
                month = "06";
                break;
            case "July":
            case "Jul":
                month = "07";
                break;
            case "August":
            case "Aug":
                month = "08";
                break;
            case "September":
            case "Septmber":
            case "Sep":
                month = "09";
                break;
            case "October":
            case "Oct":
                month = "10";
                break;
            case "November":
            case "Nov":
                month = "11";
                break;
            case "December":
            case "Dec":
                month = "12";
                break;
            default:
                break;
        }
        return month;
    }

    /**
 * Format the date by the formatter.
 * @param {String} fmt
 * @param {Date} date
 */
    function dateFormat(fmt, date) {
        var ret;
        var opt = {
            "Y+": date.getFullYear().toString(),
            "m+": (date.getMonth() + 1).toString(),
            "d+": date.getDate().toString(),
            "H+": date.getHours().toString(),
            "M+": date.getMinutes().toString(),
            "S+": date.getSeconds().toString()
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (var k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            }
        }
        return fmt;
    }
})();