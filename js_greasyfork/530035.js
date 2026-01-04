// ==UserScript==
// @name         场地预约助手
// @namespace    https://pecg.hust.edu.cn/
// @version      1.17
// @description  自动预约运动场地
// @author       Jia
// @license GPL-3.0-or-later
// @match        https://pecg.hust.edu.cn/cggl/front/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/530035/%E5%9C%BA%E5%9C%B0%E9%A2%84%E7%BA%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530035/%E5%9C%BA%E5%9C%B0%E9%A2%84%E7%BA%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let cdbh;
    let expectDate;
    let orderTime;
    let intervalCount; // 用于存储 setInterval 的返回值

    let $ = window.jQuery.noConflict(true);

    function storeGlobals() {
        GM_setValue('cdbh', cdbh);
        GM_setValue('expectDate', expectDate);
        GM_setValue('orderTime', orderTime);
    }

    function loadGlobals() {
        cdbh = GM_getValue('cdbh');
        expectDate = GM_getValue('expectDate');
        orderTime = GM_getValue('orderTime');
    }

    function createControlPanel() {
            var controlPanelHTML = `
            <div id="bookingControlPanel" style="position: fixed; top: 10px; right: 10px; background: white; padding: 10px; border: 1px solid black; z-index: 9999;">
                <h3>运动场地预约助手</h3>
                <label for="sportType">选择运动类型:</label>
                <select id="sportType" style="width: 200px;">
                    <option value="69">西体羽毛球</option>
                    <option value="45">光体羽毛球</option>
                    <option value="117">游泳馆羽毛球</option>
                    <option value="72">西操网球</option>
                </select><br>
                <label for="expectDate">选择日期:</label>
                <input type="date" id="expectDate" style="width: 200px;"><br>
                <label for="orderTime">选择时间:</label>
                <select id="orderTime" style="width: 200px;">
                    <option value="08:00:00">8:00</option>
                    <option value="10:00:00">10:00</option>
                    <option value="12:00:00">12:00</option>
                    <option value="14:00:00">14:00</option>
                    <option value="16:00:00">16:00</option>
                    <option value="18:00:00">18:00</option>
                    <option value="20:00:00">20:00</option>
                </select><br>
                <label for="startTime">开抢时间:</label>
                <input type="datetime-local" id="startTime" style="width: 200px;"><br>
                <label for="advanceTime">提前时间(ms):</label>
                <input type="text" id="advanceTime" readonly style="width: 100px;"><br>
                <button id="startCountdown">开始倒计时</button><br>
                <div id="countdownDisplay" style="margin-top: 10px; font-weight: bold;"></div>
                <div id="errorMessage" style="margin-top: 10px; color: red;"></div>
            </div>
        `;
        $('body').append(controlPanelHTML);
        initControlPanel();
    }

    function initControlPanel() {
        var minAdvanceTime = 50; // 设置最小提前时间
        var maxAdvanceTime = 70; // 设置最大提前时间

        var sportTypeInput = $('#sportType');
        var expectDateInput = $('#expectDate');
        var orderTimeInput = $('#orderTime');
        var startTimeInput = $('#startTime');
        var startCountdownButton = $('#startCountdown');
        var countdownDisplay = $('#countdownDisplay');
        var errorMessage = $('#errorMessage');
        // 设置 advanceTime 的值为区间
        $('#advanceTime').val(`${minAdvanceTime}-${maxAdvanceTime}`);

        var now = new Date();
        var offsetMin = now.getTimezoneOffset(); // 单位是分钟
        var offsetHour = offsetMin / 60; // 计算时区偏移小时数
        var defaultDate = new Date(now.getTime() - offsetMin * 60000 + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // 两天后
        var localNow = new Date(now.getTime() - offsetMin * 60000); // 本地时间
        localNow.setHours(8 - offsetHour, 0, 0, 0); // 设置时间为08:00:00
        startTimeInput.val(localNow.toISOString().slice(0, 16));
        expectDateInput.val(defaultDate);

        startCountdownButton.click(function() {
            var startTime = new Date(startTimeInput.val()).getTime();
            cdbh = sportTypeInput.val(); // 更新全局变量cdbh
            expectDate = expectDateInput.val(); // 更新全局变量expectDate
            orderTime = orderTimeInput.val(); // 更新全局变量orderTime

            // Store values:
            storeGlobals();

            // 清除现有的定时器，以确保多次点击不会导致定时器问题
            if (intervalCount) {
                clearInterval(intervalCount);
            }

            // 重置显示区域和错误信息
            errorMessage.text('');
            countdownDisplay.text('');

            getServerTime(function(serverTime) {
                syncTime(serverTime, startTime, minAdvanceTime, maxAdvanceTime);
            }, function() {
                handleError(startTime, minAdvanceTime, maxAdvanceTime);
            });
        });
    }

    function getServerTime(successCallback, errorCallback) {
        GM_xmlhttpRequest({
            method: "HEAD",
            url: window.location.href,
            onload: function(response) {
                // console.log('Response Headers:', response.responseHeaders); // Debugging line
                var serverDateMatch = response.responseHeaders.match(/date:\s*(.*)$/mi);
                if (serverDateMatch) {
                    var serverTime = new Date(serverDateMatch[1]).getTime();
                    console.log('Server Time:', new Date(serverTime).toString()); // Debugging line
                    successCallback(serverTime);
                } else {
                    console.error('Date header not found in response'); // Debugging line
                    errorCallback();
                }
            },
            onerror: function() {
                errorCallback();
            }
        });
    }

    function handleError(startTime, minAdvanceTime, maxAdvanceTime) {
        $('#errorMessage').text("无法获取服务器时间，将使用本地时间进行倒计时。");
        syncTime(null, startTime, minAdvanceTime, maxAdvanceTime);
    }

    function syncTime(serverTime, startTime, minAdvanceTime, maxAdvanceTime) {
        var machineTime = new Date().getTime();
        var displayInterval = 400; // 设定显示频率
        var accuTimeDiff = 0; // 累计时间差
        var intervalTime = maxAdvanceTime - minAdvanceTime

        intervalCount = setInterval(function() {
            var effectiveTime = serverTime ? serverTime + (new Date().getTime() - machineTime) : new Date().getTime();
            var timeDifference = startTime - effectiveTime - intervalTime;

            if (timeDifference <= minAdvanceTime) {
                clearInterval(intervalCount);
                executeBooking();
            } else {
                // 仅在达到显示间隔或最后一个interval的时候更新显示
                if (accuTimeDiff >= displayInterval || timeDifference - intervalTime <= minAdvanceTime) {
                    $('#countdownDisplay').text("倒计时: " + timeDifference + " ms");
                    accuTimeDiff = 0;
                }  else {
                    accuTimeDiff += intervalTime; // 累加时间差
                }
                // console.log("倒计时: " + timeDifference + " ms");
            }
        }, intervalTime);
    }

    function executeBooking() {
        console.log("开始预约...");
        var bookingButton = document.querySelector(`a[href="/cggl/front/syqk?cdbh=${cdbh}"]`);
        if (bookingButton) {
            bookingButton.click();
            console.log("预约按钮已点击");
        } else {
            console.log("未找到预约按钮");
        }
    }

    function confirmBooking() {
        var checkbox = $('#submitchk');
        var submitButton = $('#submitbtn');
        checkbox.prop('checked', true);
        submitButton.prop('disabled', false);
        submitButton.click();
        console.log("确认通知已提交");
    }

    function nextDay() {
        var nextDayButton = document.querySelector('.next_day');
        if (nextDayButton) {
            nextDayButton.click();
            console.log("点击下一天按钮");
        } else {
            console.log("未找到下一天按钮");
        }
    }

    function preDay() {
        var preDayButton = document.querySelector('.pre_day');
        if (preDayButton) {
            preDayButton.click();
            console.log("点击上一天按钮");
        } else {
            console.log("未找到上一天按钮");
        }
    }

    function selectTime(orderTime) {
        console.log("选择场地时间段");

        // Find the select element by its ID
        var startTimeDropdown = document.getElementById("starttime");

        if (startTimeDropdown) {
            // Iterate through the options and select the one matching orderTime
            var options = startTimeDropdown.options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].value == orderTime) {
                    startTimeDropdown.selectedIndex = i;
                    console.log("选择时间段: " + orderTime);
                    // Trigger the onchange event
                    startTimeDropdown.onchange();
                    break;
                }
            }
        } else {
            console.log("未找到时间选择下拉菜单");
        }
    }

    function selectIdentity(identity) {
        console.log("选择身份...");
        var identityRadioButton = document.querySelector(`input[name="partnerCardtype"][value="${identity}"]`);
        if (identityRadioButton) {
            identityRadioButton.checked = true;
            console.log(`选择身份: ${identityRadioButton.value}`);
            // Trigger change event
            identityRadioButton.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.log("未找到身份选择按钮");
        }
    }

    function observeElements(selector, areaCallback) {
        const observer = new MutationObserver((mutations, obs) => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                obs.disconnect(); // Stop observing
                areaCallback(elements);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function selectArea() {
        console.log("选择场地...");
        selectIdentity(1); // 1 for 学生身份
        observeElements('td.getajax.appointmentopen', processAreaSelection);
    }


    function getPriorityOrder(cdbh) {
        let priorityOrder = [];
        if (cdbh === "69") {
            priorityOrder = [5, 4, 3, 2, 8, 1, 6, 7, 9];
        } else if (cdbh === "45") {
            priorityOrder = [13, 18, 8, 14, 19, 9, 12, 17, 7, 3, 2, 4, 22, 15, 16, 10, 11, 6, 20, 21, 1, 5];
        } else {
            priorityOrder = [];
        }
        return priorityOrder;
    }

    function processAreaSelection(areaCells) {
        console.log("area length:", areaCells.length);
        if (areaCells.length == 0) {
            console.log("未找到可预约的场地");
            // Dynamically create and display an error message in the center of the page
            var errorMessageDiv = document.createElement('div');
            errorMessageDiv.style.position = 'fixed';
            errorMessageDiv.style.top = '50%';
            errorMessageDiv.style.left = '50%';
            errorMessageDiv.style.transform = 'translate(-50%, -50%)';
            errorMessageDiv.style.backgroundColor = '#ffcccc';
            errorMessageDiv.style.padding = '10px';
            errorMessageDiv.style.border = '1px solid red';
            errorMessageDiv.style.zIndex = '9999';
            errorMessageDiv.style.textAlign = 'center';
            errorMessageDiv.innerText = '未找到可预约的场地，请稍后重试。';
            document.body.appendChild(errorMessageDiv);

            // Remove the error message after 2 seconds
            setTimeout(function() {
                errorMessageDiv.remove();
            }, 2000);
            return;
        }
        // 进入该函数的都是可预约区域
        var priorityOrder = getPriorityOrder(cdbh);
        var availableAreas = {}; // 存放符合优先顺序的可预约场地
        var otherAvailable = []; // 存放其他可预约场地

        for (var i = 0; i < areaCells.length; i++) {
            var cell = areaCells[i];
            var title = cell.getAttribute('title');
            // var spaceStatus = cell.querySelector('.spacezt').innerText;

            console.log(`检查单元格 ${i}: title="${title}"`);

            var areaNumber_1 = getAreaNumber(title);
            console.log(`可预约的场地编号: ${areaNumber_1}`);
            if (priorityOrder.includes(areaNumber_1)) {
                availableAreas[areaNumber_1] = cell;
            } else {
                otherAvailable.push(cell);
            }
        }

        // 记录符合优先顺序的可预约场地和其他可预约场地
        console.log("符合优先顺序的可预约场地:", availableAreas);
        console.log("其他可预约场地:", otherAvailable);

        // 根据优先顺序选择场地
        for (var j = 0; j < priorityOrder.length; j++) {
            var areaNumber = priorityOrder[j];
            if (availableAreas[areaNumber]) {
                selectCell(availableAreas[areaNumber]);
                return;
            }
        }

        // 如果没有符合优先顺序的场地，选择第一个可预约场地
        selectCell(otherAvailable[0]);
    }

    // 从 title 属性提取场地编号
    function getAreaNumber(title) {
        // Use regular expression to match digits only
        var match = title.match(/\d+/);
        return match ? parseInt(match[0], 10) : null;
    }

    // 选择单元格并执行必要操作来选择场地
    function selectCell(cell) {
        console.log("选择单元格中的复选框...");
        var checkbox = cell.querySelector('input.choosetime');
        if (checkbox) {
            checkbox.checked = true;
            // 添加显示复选框已选中的类
            cell.classList.add('input_checked');
            // 检查 checkbox.onchange 是否存在并且是一个函数
            if (typeof checkbox.onchange === 'function') {
                checkbox.onchange(); // 触发变动事件（如果存在）
            } else {
                // 手动创建并触发 change 事件
                var event = new Event('change', { bubbles: true });
                checkbox.dispatchEvent(event);
            }
            console.log("已选择场地编号: " + checkbox.value);
        } else {
            console.log("未在选定的单元格中找到复选框");
        }
        submitBooking()
    }

    // 提交预约
    function submitBooking() {
        console.log("确认预约按钮...");
        var submitButton = document.querySelector('.star_app input[type="submit"]');
        if (submitButton) {
            submitButton.click();
            console.log("确认预约按钮已点击");
        } else {
            console.log("未找到确认预约按钮");
        }
    }

    function startOrderProcess() {
        var now = new Date();
        var today = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
        var expectDateArray = expectDate.split("-");
        var expectDateObject = new Date(expectDateArray[0], expectDateArray[1] - 1, expectDateArray[2]);

        console.log("cdbh: " + cdbh);
        console.log("today: " + today);
        console.log("expectDate: " + expectDate);
        console.log("expectDateObject: " + expectDateObject);
        console.log("orderTime: " + orderTime);
        if (window.location.href == "https://pecg.hust.edu.cn/cggl/front/syqk?cdbh=" + cdbh) {
            selectDateInDatePicker(expectDateObject);
        } else {
            // 网页链接带日期，例如 https://pecg.hust.edu.cn/cggl/front/syqk?date=2025-03-14&type=1&cdbh=69
            selectTime(orderTime);
        }
    }

    function selectDateExc(year, month, day) {
        console.log("选择日期: " + year + "-" + month + "-" + day);
        var currentYear = parseInt(document.querySelector('.year-name').getAttribute('year'), 10);
        var currentMonth = parseInt(document.querySelector('.month-name').getAttribute('month'), 10); // JavaScript 中的月份从 0 开始
        console.log("month:", month, "currentMonth:", currentMonth)
        // Adjust year if necessary
        while (currentYear !== year) {
            // console.log("currentYear: " + currentYear + ", year: " + year);
            if (currentYear < year) {
                document.querySelector('.year-nav .next').click();
            } else {
                document.querySelector('.year-nav .prev').click();
            }
            currentYear = parseInt(document.querySelector('.year-name').getAttribute('year'), 10);
        }

        // Adjust month if necessary
        while (currentMonth !== month) {
            // console.log("currentMonth: " + currentMonth + ", month: " + month);
            if (currentMonth < month) {
                document.querySelector('.month-nav .next').click();
            } else {
                document.querySelector('.month-nav .prev').click();
            }
            currentMonth = parseInt(document.querySelector('.month-name').getAttribute('month'), 10) + 1;
        }

        // Select the day
        var dayElements = document.querySelectorAll('#days a');
        // console.log("dayElements:", dayElements);
        console.log("length:", dayElements.length);
        for (var i = 0; i < dayElements.length; i++) {
            var dayElement = dayElements[i];
            var tdElement = dayElement.parentElement; // 获取父元素 <td>
            if (parseInt(dayElement.getAttribute('day'), 10) === day && !tdElement.classList.contains('un-day')) {
                dayElement.click();
                console.log("跳转到目标日期: " + year + "-" + month + "-" + day);
                break;
            }
        }

    }

    function selectDateInDatePicker(targetDate) {
        var year = targetDate.getFullYear();
        var month = targetDate.getMonth();
        var day = targetDate.getDate();

        // Click the input element to show the datepicker
        var dateInput = document.getElementById('rq');
        if (dateInput) {
            dateInput.click();
            console.log("点击日期输入框");
        } else {
            console.error("未找到日期输入框");
            return;
        }

        var datepicker = document.getElementById('datepicker');
        if (datepicker && datepicker.style.display !== 'none') {
            console.log("日期选择器已显示");
            selectDateExc(year, month, day);
        } else {
            // Use MutationObserver to wait for the datepicker to appear
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    console.log("检测到的变化:", mutation);
                    if (mutation.target.id === 'datepicker' && mutation.target.style.display !== 'none') {
                        observer.disconnect();
                        console.log("日期选择器已加载");
                        selectDateExc(year, month, day);
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['id', 'class']
            });
        }
    }

    function payMoney() {
        console.log("支付中...");

        // 选择统一支付方式
        var payTypeLabel = document.querySelector('label input[type="radio"][name="select_pay_type"][value="-2"]');
        if (payTypeLabel) {
            payTypeLabel.click();
            console.log("已选择统一支付方式");

            // 点击提交按钮
            var submitButton = document.getElementById('submitbtn');
            if (submitButton) {
                submitButton.click();
                console.log("已点击提交按钮");
            } else {
                console.error("未找到提交按钮");
            }
        } else {
            console.error("未找到统一支付方式的选项");
        }
    }

    function init() {
        console.log("运动场地预约助手已加载");
        console.log("当前URL: " + window.location.href);

        // Load global variables:
        loadGlobals();

        if (window.location.href.includes('pecg.hust.edu.cn/cggl/front/yuyuexz')) {
            console.log("准备");
            createControlPanel();
        }

        if (window.location.href.includes("pecg.hust.edu.cn/cggl/front/getcdyuyuexz?cdbh=")) {
            console.log("确认通知");
            confirmBooking();
        }

        if (window.location.href.includes("pecg.hust.edu.cn/cggl/front/syqk")) {
            if (window.location.href.includes("starttime=")) {
                console.log("已选时间段，直接选场地");
                selectArea();
            } else {
                console.log("开始预约");
                startOrderProcess();
            }
        }

        if (window.location.href.includes("pecg.hust.edu.cn/cggl/front/step2")) {
            console.log("开始付款");
            payMoney();
        }

    }

    $(document).ready(init);
})();