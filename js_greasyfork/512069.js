// ==UserScript==
// @name         Redmine加班工时统计
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  方便统计
// @author       Zack
// @match        http://redmine-pa.mxnavi.com/projects/rd013001/time_entries*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512069/Redmine%E5%8A%A0%E7%8F%AD%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/512069/Redmine%E5%8A%A0%E7%8F%AD%E5%B7%A5%E6%97%B6%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
 
    (function () {
        'use strict';

        var label = document.createElement("label");
        label.style.position = "fixed";
        label.style.top = "200px";
        label.style.right = "60px";
        label.style.fontSize = "14px";
        label.style.webkitTextStroke = "1px crimson";
        label.style.webkitTextFillColor = "white";
        document.body.appendChild(label);

        // 调休工作日，一年得更新一次
        var workDays = ['2024-10-12'];

        // 只总计当前月的
        var currentMonth = new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, 0);

        function calcOvertime() {
            var totalOvertime = 0; // 总加班
            var totalDays = 0; // 总工作日
            var dict = {}; // 所以工作了的日期字典
            document.querySelector(".list.odd-even.time-entries").querySelector("tbody").querySelectorAll(".time-entry").forEach((element, index) => {
                var date = element.querySelector(".spent_on").innerHTML;
                var hours = element.querySelector(".hours").innerHTML;
                if (date.startsWith(currentMonth)) {
                    // 只统计当前月的
                    if (dict[date]) {
                        dict[date] += Math.round(Number(hours) * 100);
                    } else {
                        dict[date] = Math.round(Number(hours) * 100);
                    }
                }
            });

            for (let day of Object.getOwnPropertyNames(dict)) {
                var weekDay = new Date(day).getDay();
                if (weekDay === 0 || weekDay === 6) {
                    // 如果是周六周日
                    if (workDays.includes(day)) {
                        // 调休日
                        totalOvertime += dict[day] > 800 ? dict[day] - 800 : 0;
                    } else {
                        totalOvertime += dict[day];
                    }
                } else {
                    totalOvertime += dict[day] > 800 ? dict[day] - 800 : 0;
                }
            }

            label.innerHTML = '累加加班:' + (totalOvertime / 100).toFixed(2) + 'h<br>(确认本月工时都在当前页面下显示,请假工时需自行扣除)';
        }
        setTimeout(() => {
            calcOvertime();
        }, 1000);
    })();