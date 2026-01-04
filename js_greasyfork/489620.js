// ==UserScript==
// @name        hairCut
// @namespace   kidstudio
// @match       http://10.6.189.105/haircut/#/pcReserve-parent/pcReserve
// @grant       none
// @version     1.1
// @author      KID
// @description 2024/3/8 10:36:45
// @downloadURL https://update.greasyfork.org/scripts/489620/hairCut.user.js
// @updateURL https://update.greasyfork.org/scripts/489620/hairCut.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    var refreshFunc = function refresh() {
        console.log("refresh");
        window.location.reload(true);
    }

    var t2 = window.setInterval(refreshFunc, 300000);

    //设置候选时间
    var needTimes = ["12:30", "18:00", "18:30", "13:00"];
    var needWeekDay = ["周一", "周二", "周三", "周四", "周五"];
    console.log("候选时间" + needWeekDay + " - " + needTimes);

    //初始定义
    var allWeek = ["周一", "周二", "周三", "周四", "周五", "周六"];
    var delay = (n) => new Promise(r => setTimeout(r, n * 1000));
    var thisWeekDay = function (i) {
        if (i == -1) {
            i = allWeek.length - 1;
        } else if (i == allWeek.length) {
            i = 0;
        }
        return allWeek[i];
    };

    console.log("开始，等待页面刷新完毕");
    await delay(4);

    //选择日期
    var dataItems = document.getElementsByClassName("el-tabs__item");
    console.log(dataItems);
    for (let itime = 0; itime < dataItems.length; itime++) {
        var dateItem = dataItems[itime];

        //判断星期
        var weekDay;
        var temp = dateItem.firstChild.innerText;
        if (temp == "今天") {
            var tempNextDay = dataItems[itime + 1].firstChild.innerText;
            var indexNextDay = allWeek.indexOf(tempNextDay)
            weekDay = await thisWeekDay(indexNextDay - 1);
        } else {
            weekDay = temp;
        }
        console.log(weekDay);

        //判断是否是候选日期
        if (needWeekDay.indexOf(weekDay) == -1) {
            continue;
        }

        dateItem.click();
        console.log("等待日期点击" + dateItem.getAttribute("id"));
        await delay(4);

        //判断是否候选时间
        var timeItems = document.getElementsByClassName("el-checkbox-group")[0];
        var persons = document.getElementsByClassName("el-checkbox-group")[1].firstChild;

        for (let i = 0; i < timeItems.childNodes.length; i++) {
            var time = timeItems.childNodes[i];
            if (!time.classList.contains("is-disabled")) {
                var timeText = time.childNodes[1].innerText.trim();
                console.log("可用时间" + timeText);
                if (needTimes.indexOf(timeText) != -1) {
                    time.click();
                    console.log("点击时间" + timeText);
                    await delay(1);

                    //选择人员
                    for (let j = 0; j < persons.childNodes.length; j++) {
                        var person = persons.childNodes[j];
                        var personText = person.childNodes[1].children[1].innerText.trim();
                        if (!person.classList.contains("is-disabled")) {
                            console.log("可用人员" + personText);
                            person.click();
                            console.log("等待人员点击" + personText);
                            await delay(1);

                            //点击提交
                            var submit = document.getElementsByClassName("el-button--primary")[0];
                            submit.click();
                            await delay(1);
                            alert("提交");
                            break;
                        }
                    }
                }
            }
        }

    }


})();
