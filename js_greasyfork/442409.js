// ==UserScript==
// @name         统计考勤
// @version      6
// @namespace    Frank
// @description  用于统计考勤时间是否达到标准
// @author       Frank
// @match        https://ssomanager.133.cn/manager/views/inner.html
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442409/%E7%BB%9F%E8%AE%A1%E8%80%83%E5%8B%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/442409/%E7%BB%9F%E8%AE%A1%E8%80%83%E5%8B%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let toS = function (str) {
        let hour = parseInt(str.split(":")[0])
        let min = parseInt(str.split(":")[1])
        let seconds = parseInt(str.split(":")[2])
        return hour * 3600 + min * 60 + seconds;
    };

    let clickMenu = () => {
        let items = []

        let buttonPrev = document.querySelector('.fc-prev-button');
        if (buttonPrev) {
            buttonPrev.click();
        }

        setTimeout(() => {
            items.push(...document.querySelectorAll(".fc-day"))
            let buttonNext = document.querySelector('.fc-next-button');
            if (buttonNext) {
                buttonNext.click();
            }
        }, 500)

        setTimeout(() => {
            items.push(...document.querySelectorAll(".fc-day"))

            let workTimeRequire = 8 * 60 * 60

            let select = document.getElementById('id_select');
            let sleepHour = select.options[select.selectedIndex].value;

            let alertText = ""
            let time = 0;
            let start = false;
            items
                .forEach(item => {
                try {
                    let log = ""

                    let date = item.getAttribute("data-date")
                    let type = item.childNodes[0].innerText
                    if (type) {
                        log += `${date}`;
                    }
                    if (date.indexOf("-28") !== -1) {
                        start = !start;
                    }

                    if (start) {
                        item = item.childNodes[1].childNodes[1]

                    let tip = item.childNodes[0].innerText
                    let start = toS(item.childNodes[1].childNodes[0].innerText.replace("上:", "")
                                    .replace("异:", ""))
                    let end = toS(item.childNodes[1].childNodes[1].innerText.replace("下:", "")
                                  .replace("异:", ""))

                    let workTime
                    if (end <= 12 * 60 * 60) {
                        workTime = end - start
                    } else if (end <= 12 * 60 * 60 + sleepHour * 60 * 60) {
                        workTime = 12 * 60 * 60 - start
                    } else {
                        workTime = end - start - sleepHour * 60 * 60
                    }

                    let timeDay
                    if (tip === "补") {
                        timeDay = parseInt((workTime - workTimeRequire) / 60 - 30)
                        log += ` 距离8小时标准，${timeDay > 0 ? '超过' :
                        '还差'}${Math.abs(timeDay)}分钟（忘打卡扣除30分钟）`
                        } else if (tip === "假") {
                            timeDay = 0
                            log += " 请假"
                        } else {
                            timeDay = parseInt((workTime - workTimeRequire) / 60)
                            log += ` 距离8小时标准，${timeDay > 0 ? '超过' : '还差'}${Math.abs(timeDay)}分钟`
                        }
                    time = time + timeDay
                    console.log(log)
                    alertText += log
                    alertText += "\n"
                    }
                } catch (e) {

                }
            })
            let textAll = time >= 0 ? `日均8小时标准，已超过${time}分钟，恭喜你可以早点下班了` :
            `日均8小时标准，还差${Math.abs(time)}分钟`

            console.log(textAll)
            alertText += textAll
            alert(alertText)
        }, 1000)
    }


    let createElement = () => {
        let menu = document.querySelector('.custom-content-con');

        let div = document.createElement("div");
        div.style.cssText = "height: 54px;display: flex;align-items: center;";

        let font = document.createElement("font");
        font.innerText = "午休："
        div.appendChild(font)

        let select = document.createElement("select");
        select.setAttribute("id", "id_select")

        let option2 = document.createElement("option");
        option2.setAttribute("value", "2")
        option2.innerText = "2小时"
        select.appendChild(option2)

        let option1 = document.createElement("option");
        option1.setAttribute("value", "1")
        option1.innerText = "1小时"
        select.appendChild(option1)

        div.appendChild(select)

        let submit = document.createElement("a");
        submit.style.cssText = "margin-left: 16px;margin-right: 64px;"
        submit.innerText = "统计考勤"
        submit.onclick = clickMenu
        div.appendChild(submit)

        menu.appendChild(div);
    }

    setTimeout(() => {
        createElement()
    }, 1000)
})();