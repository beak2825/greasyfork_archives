// ==UserScript==
// @name         VTC_MyPortal_Attendance_Calculator
// @namespace    http://tampermonkey.net/
// @version      2025-5-14
// @description  計算出席率
// @author       GG
// @match        https://myportal.vtc.edu.hk/wps/myportal/sp/spostud/!ut/p/z1/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.hk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485036/VTC_MyPortal_Attendance_Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/485036/VTC_MyPortal_Attendance_Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const array = {};

    // console.log("Hello world");
    var original = document.querySelector("#viewns_Z7_60MAHK02O09VD0QM6ROE6S0000_\\:j_id_1t\\:j_id_2b\\:tbody_element").innerText;
    original = original.replace(/\s+/ig, " ")
    original = original.split(" ");
    // console.log([original])
    var status_present_times = 0
    var attend_time = 0
    var real_hour_time = 0
    var sum_hour_time = 0
    // 傳入 HH:MM 返回 Second
    function format2sec(format_time) {
        // 小時
        let hours = parseInt(format_time.slice(0, 2)) * 3600;
        // 分鐘
        let second = parseInt(format_time.slice(3, 5)) * 60;
        return hours + second;
    }
    var i = 0
    while (i < original.length) {
        // +2 狀態
        // +3 拍卡時間
        if (original[i + 2] == "Present" || original[i + 2] == "Absent" || original[i + 2] == "Late") {
            var timeDf = 0
            // 課堂開始時間
            let st = format2sec(original[i + 4])
            // 課堂結束時間
            let ed = format2sec(original[i + 6])
            sum_hour_time += ed - st
            if (original[i + 3] !== "-") {
                status_present_times += 1
                // 拍卡時間
                let tapCareTime = format2sec(original[i + 3])
                // 如果遲到 按照拍卡時間計算
                if (original[i + 2] === "Late") {
                    timeDf = ed - tapCareTime
                } else {
                    timeDf = ed - st
                }
                real_hour_time += timeDf
                // console.log("拍卡時間:", original[i+3], "上課時間",  original[i+4], "落堂時間:", original[i+6], "出席時數", (timeDf/3600).toFixed(1), "Hours")
            } else if (original[i + 2] === "Absent") {
                // console.log("未出席:", original[i])
            }
        }

        i++
    }
    // 上捨入結果
    var Abs = Math.ceil(100 - ((real_hour_time / 3600).toFixed(2) / (sum_hour_time / 3600).toFixed(2)).toFixed(3) * 100)
    // "<h3 style='color: red'>reference only</h3>"
    document.querySelector("#viewns_Z7_60MAHK02O09VD0QM6ROE6S0000_\\:j_id_1t > div:nth-child(7) > span").innerHTML +=
    "<span><mark>數據僅供參考！/For reference only! ---> "+"Abs(recent):"+ Abs.toString() + "%</mark></span>"
    document.querySelector("#viewns_Z7_60MAHK02O09VD0QM6ROE6S0000_\\:j_id_1t\\:j_id_2b\\:tbody_element").innerHTML += '<tr class="hkvtcsp_trow_color"><td style="text-align:center">>>>></td><td style="text-align:center">'+status_present_times.toString()+'</td><td style="text-align:center">'+(real_hour_time / 3600).toFixed(2).toString()+'Hours</td><td style="text-align:center">'+(sum_hour_time / 3600).toFixed(2).toString()+'Hours</td><td style="text-align:center"><<<<</td></tr>';
})();


