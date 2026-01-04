// ==UserScript==
// @name         选饭
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  公司选饭
// @author       xiedi
// @match        https://wj.qq.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/372414/%E9%80%89%E9%A5%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/372414/%E9%80%89%E9%A5%AD.meta.js
// ==/UserScript==

GM_addStyle(`
.food_btn:hover {
  background-color: #008FFF;
}

.food_btn {
  cursor: pointer;
  display: inline-block;
  *display: inline;
  zoom: 1;
  background-color: #2863F3;
  border-radius: 3px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-weight: bold;
  margin: 0 10px;
  width: 85px;
  padding: 0 10px;
  font-size: 14px;
  color: #fff !important;
}
`);

(function() {
    'use strict';

    function setSelectedTag() {
        var questions = document.querySelector('.question-list').querySelectorAll("section");
        for (const question of questions) {
            if (question.querySelector(".selectbox") != null) {
                continue;
            }
            if (question.querySelector(".checkbox-option") != null) {
                var questionBody = question.querySelector(".question-body");
                var option_items = questionBody.querySelectorAll(".checkbox-option");
                for (var i = 0; i < option_items.length; i++) {
                    var label = option_items[i].querySelector("label");
                    label.onclick = function(body, index) {
                        return function() {
                            body.setAttribute("selected-index", index);
                        }
                    }(questionBody, i);
                }
            }
        }
    }

    function getSelectedResult() {
        var result = {
            username: "",
            foods: new Array()
        };
        var questions = document.querySelector('.question-list').querySelectorAll("section");
        for (const question of questions) {
            if (question.querySelector(".selectbox") != null) {
                result.username = question.querySelector(".select-result").textContent.trim();
                continue;
            }

            if (question.querySelector(".checkbox-option") != null) {
                var title = question.querySelector(".question-head").querySelector(".question-title").textContent.trim();
                var foodInfo = getFoodInfoFromTitle(title);
                var questionBody = question.querySelector(".question-body");
                var index = parseInt(questionBody.getAttribute("selected-index"));
                var option_items = questionBody.querySelectorAll(".checkbox-option");
                var option_item = option_items[index];
                foodInfo.content = option_item.textContent.trim();
                if (foodInfo.content.includes("不吃")) {
                    foodInfo.not_eat = true;
                }
                result.foods.push(foodInfo);
            }
        }

        result.foods.sort(function(a, b) {
            if (a.year < b.year) {
                return -1
            } else if (a.year > b.year) {
                return 1
            }

            if (a.month < b.month) {
                return -1
            } else if (a.month > b.month) {
                return 1
            }

            if (a.day < b.day) {
                return -1
            } else if (a.day > b.day) {
                return 1
            }

            if (a.am < b.am) {
                return -1
            } else if (a.am > b.am) {
                return 1
            }

            return 0;
        });

        return result;
    }

    function getFoodInfoFromTitle(title) {
        var foodInfo = {
            year: 0,
            month: 0,
            day: 0,
            am: 0,
            not_eat: false,
            content: ""
        };
        var monthArray = title.split('月');
        foodInfo.month = getNumberByStr(monthArray[0]);
        foodInfo.day = getNumberByStr(monthArray[1].split('日')[0]);
        var now = new Date();
        foodInfo.year = now.getFullYear();
        if ((11 == now.getMonth()) && (1 == foodInfo.month)) {
            // 进入第二年
            foodInfo.year += 1
        }
        if (title.includes("晚")) {
            foodInfo.am = 1;
        }
        return foodInfo;
    }

    function getNumberByStr(str) {
        str = str.trim();
        var num = 0;
        var char;
        if (str.length > 0) {
            num += charToNum(str[str.length - 1], 1)
        }
        if (str.length > 1) {
            num += charToNum(str[str.length - 2], 10)
        }
        return num;
    }

    function charToNum(x, scale) {
        var parsed = parseInt(x, 10);
        if (isNaN(parsed)) {
            return 0;
        }
        return parsed * scale;
    }

    function showTxtResult(result) {
        var showValue = "";
        var newline = "\n";
        if (navigator.platform.includes("Win")) {
            newline = "\r\n";
        }
        showValue += result.username + newline;

        result.foods.forEach(function(food) {
            if (0 == food.am) {
                showValue += food.year + "年" + food.month + "月" + food.day + "日" + newline + "午餐：" + food.content + newline;
            } else {
                showValue += "晚餐：" + food.content + newline;
            }
        });

        console.log(showValue);

        return showValue;
    }

    function showIcsResult(result) {
        var showValue = "BEGIN:VCALENDAR\n" +
            "PRODID:-//Web Environment//Tampermonkey//EN\n" +
            "VERSION:2.0\n";
        result.foods.forEach(function(food) {
            if (!food.not_eat) {
                showValue += createIcsEvent(food);
            }
        });
        showValue += "END:VCALENDAR";
        return showValue;
    }

    function createIcsEvent(food) {
        var ics_event = "BEGIN:VEVENT\n";
        var foodTime = new Date();
        var nowTZ = getTZDate(foodTime, true);
        ics_event += "DTSTAMP:" + nowTZ + "\n" +
            "CREATED:" + nowTZ + "\n" +
            "UID:" + guid() + "\n" +
            "SEQUENCE:1\n" +
            "LAST-MODIFIED:" + nowTZ + "\n";

        foodTime.setFullYear(food.year);
        foodTime.setMonth(food.month - 1);
        foodTime.setDate(food.day);

        if (0 == food.am) {
            foodTime.setHours(12, 0, 0, 0);
            ics_event += "SUMMARY:午餐\n";
        } else {
            foodTime.setHours(18, 0, 0, 0);
            ics_event += "SUMMARY:晚餐\n";
        }

        ics_event += "DESCRIPTION:" + food.content + "\n";

        ics_event += "DTSTART;TZID=Asia/Shanghai:" + getTZDate(foodTime, false) + "\n";
        foodTime.setMinutes(30 + foodTime.getMinutes());
        ics_event += "DTEND;TZID=Asia/Shanghai:" + getTZDate(foodTime, false) + "\n";

        ics_event += "BEGIN:VALARM\n" +
            "DESCRIPTION:\n" +
            "ACTION:DISPLAY\n" +
            "TRIGGER;VALUE=DURATION:-PT5M\n" +
            "END:VALARM\n" +
            "END:VEVENT\n";
        return ics_event;
    }

    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    function getTZDate(date, withZ) {
        var tz = "" + date.getUTCFullYear() +
            pad(date.getMonth() + 1) +
            pad(date.getDate()) + "T" +
            pad(date.getHours()) +
            pad(date.getMinutes()) +
            pad(date.getSeconds());
        if (withZ) {
            tz += "Z";
        }
        return tz;
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    function downloadResult(filename, text, suffix) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:' + suffix + ';charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    function getLocalStorageUsername() {
        return localStorage.getItem('food_username');
    }

    function setLocalStorageUsername(username) {
        localStorage.setItem('food_username', username);
    }

    function autoSelectUsername(username) {
        var selectList = document.querySelector(".question-list").querySelector(".question-select-list");
        var users = selectList.querySelectorAll('li');
        for (const user of users) {
            var tempText = user.textContent.trim();
            if (tempText.startsWith("--")) {
                continue;
            }
            user.onclick = function(name) {
                return function() {
                    setLocalStorageUsername(name);
                }
            }(tempText);
            if (username == tempText) {
                user.click()
            }
        }
    }

    function oneKeySelect(content) {
        var questions = document.querySelector('.question-list').querySelectorAll("section");
        for (const question of questions) {
            var option_items = question.querySelectorAll(".checkbox-option");
            for (const option_item of option_items) {
                if (option_item.textContent.trim().includes(content)) {
                    option_item.querySelector("label").click();
                    break;
                }
            }
        }
        window.scrollTo(0, document.querySelector(".survey-container").scrollHeight);
    }

    function createFoodBtn(title) {
        var button = document.createElement("a");
        button.className = "food_btn";
        button.href = "javascript:;";
        button.textContent = title;
        button.title = title;
        return button
    }

    function addExportTxtBtn(title) {
        var export_btn = createFoodBtn("导出文本");
        export_btn.onclick = function() {
            var result = getSelectedResult();
            downloadResult(title + ".txt", showTxtResult(result), "text/plain");
        };
        var submit_btn = document.querySelector(".btn-submit");
        submit_btn.parentNode.insertBefore(export_btn, submit_btn);
    }

    function addExportIcsBtn(title) {
        var export_btn = createFoodBtn("导出日历");
        export_btn.onclick = function() {
            var result = getSelectedResult();
            downloadResult(title + ".ics", showIcsResult(result), "text/calendar");
        };
        var submit_btn = document.querySelector(".btn-submit");
        submit_btn.parentNode.insertBefore(export_btn, submit_btn);
    }

    function addOneKeyBuffet() {
        var buffet_btn = createFoodBtn("一键自助");
        buffet_btn.onclick = function() {
            oneKeySelect("自助餐");
        };
        var question_list = document.querySelector(".question-list");
        question_list.parentNode.insertBefore(buffet_btn, question_list);
    }

    function addOneKeyReduceWeight() {
        var reduce_btn = createFoodBtn("一键减肥");
        reduce_btn.onclick = function() {
            oneKeySelect("不吃");
        };
        var question_list = document.querySelector(".question-list");
        question_list.parentNode.insertBefore(reduce_btn, question_list);
    }

    function loadMain() {
        var title = document.querySelector(".survey-header-title").textContent.trim();
        if (title.includes("选饭")) {
            addOneKeyBuffet();
            addOneKeyReduceWeight();
            autoSelectUsername(getLocalStorageUsername());
            setSelectedTag();
            addExportTxtBtn(title);
            addExportIcsBtn(title);
        }
    }

    function main() {
        var title = document.querySelector("title").textContent.trim();
        if (title.includes("选饭")) {
            var endTitle = document.querySelector(".page-end-title");
            if (endTitle != null) {
                var button = document.querySelector(".page-btn");
                button.onclick = function() {
                    loadMain();
                };
            } else {
                loadMain();
            }
        }
    }

    setTimeout(main, 2000);

})();