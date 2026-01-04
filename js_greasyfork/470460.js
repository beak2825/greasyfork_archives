// ==UserScript==
// @name         添加月历
// @namespace    http://www.github.com/awyugan
// @version      0.1.2
// @description  在指定页面上添加一个月历，并根据点击的日期修改后缀的内容为完整的日期格式
// @author       awyugan
// @match        https://nightly.changelog.com/*
// @match        https://huggingface.co/papers?date=*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470460/%E6%B7%BB%E5%8A%A0%E6%9C%88%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/470460/%E6%B7%BB%E5%8A%A0%E6%9C%88%E5%8E%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建选择框
    function createSelect(start, end, initialValue) {
        var select = document.createElement('select');

        for (var i = start; i <= end; i++) {
            var option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            select.appendChild(option);
        }

        select.value = initialValue;

        return select;
    }

    // 新的函数，用来根据当前网址确定 URL 格式
    function getURLFormat() {
        var url = window.location.href;

        if (url.includes('huggingface.co')) {
            return 'huggingface';
        } else if (url.includes('nightly.changelog.com')) {
            return 'changelog';
        }

        // 默认返回 'changelog'
        return 'changelog';
    }

    // 创建月历
    function createCalendar() {
        // 获取当前日期
        var currentDate = new Date();

        // 从URL中获取日期
        var urlParts = window.location.href.split('/');
        var urlYear, urlMonth, urlDay;
        var urlFormat = getURLFormat();

        if (urlFormat === 'huggingface') {
            var dateParam = new URL(window.location.href).searchParams.get('date');
            var dateParts = dateParam.split('-');
            urlYear = parseInt(dateParts[0]);
            urlMonth = parseInt(dateParts[1]);
            urlDay = parseInt(dateParts[2]);
        } else { // 'changelog'
            urlYear = parseInt(urlParts[3]);
            urlMonth = parseInt(urlParts[4]);
            urlDay = parseInt(urlParts[5]);
        }

        // 创建月历元素
        var calendar = document.createElement('div');
        calendar.id = 'calendar';
        calendar.style.position = 'fixed';
        calendar.style.top = '10px';
        calendar.style.right = '10px';
        calendar.style.padding = '10px';
        calendar.style.background = 'white';
        calendar.style.border = '1px solid black';

        // 创建标题元素
        var title = document.createElement('h3');

        // 创建年份和月份选择框
        var selectYear = createSelect(2000, 2100, urlYear || currentDate.getFullYear());
        var selectMonth = createSelect(1, 12, urlMonth || currentDate.getMonth() + 1);

        // 将选择框添加到标题元素
        title.appendChild(selectYear);
        title.appendChild(document.createTextNode('/'));
        title.appendChild(selectMonth);

        // 创建跳转到当前月份的链接
        var currentMonthLink = document.createElement('a');
        currentMonthLink.href = '#';
        currentMonthLink.textContent = '跳转到当前月份';

        // 点击链接时更新选择框的值为当前月份
        currentMonthLink.addEventListener('click', function(event) {
            event.preventDefault();
            selectYear.value = currentDate.getFullYear();
            selectMonth.value = currentDate.getMonth() + 1;
            updateCalendar();
        });

        // 将链接添加到标题元素
        title.appendChild(currentMonthLink);

        // 将标题元素添加到月历
        calendar.appendChild(title);

        // 创建星期数元素
        var weekdays = ['一', '二', '三', '四', '五', '六', '日'];
        var weekRow = document.createElement('div');
        weekRow.style.display = 'grid';
        weekRow.style.gridTemplateColumns = 'repeat(7, 1fr)';

        for (var k = 0; k < 7; k++) {
            var weekday = document.createElement('div');
            weekday.textContent = weekdays[k];
            weekday.style.textAlign = 'center';
            weekRow.appendChild(weekday);
        }

        // 将星期数元素添加到月历
        calendar.appendChild(weekRow);

        // 创建日期元素
        var days = document.createElement('div');
        days.id = 'calendar-days';
        days.style.display = 'grid';
        days.style.gridTemplateColumns = 'repeat(7, 1fr)';
        calendar.appendChild(days);

        // 更新月历
        function updateCalendar() {
            var selectedYear = parseInt(selectYear.value);
            var selectedMonth = parseInt(selectMonth.value);

            // 清空日期元素
            days.innerHTML = '';

            // 获取当前月份的第一天的日期
            var firstDay = new Date(selectedYear, selectedMonth - 1, 1);

            // 获取当前月份的最后一天的日期
            var lastDay = new Date(selectedYear, selectedMonth, 0);

            // 获取当前月份的天数
            var numDays = lastDay.getDate();

            // 获取当前月份的第一天是星期几
            var firstDayOfWeek = firstDay.getDay();

            // 创建日期格子
            var dayIndex = 1 - firstDayOfWeek; // 第一个日期格子的索引
            for (var row = 0; row < 6; row++) {
                for (var col = 0; col < 7; col++) {
                    var day = document.createElement('div');

                    if (dayIndex >= 1 && dayIndex <= numDays) {
                        day.textContent = dayIndex;
                        day.style.padding = '5px';
                        day.style.textAlign = 'center';
                        day.style.cursor = 'pointer';

                        // 根据当前日期高亮显示今天的日期
                        if (
                            selectedYear === currentDate.getFullYear() &&
                            selectedMonth -1 === currentDate.getMonth() &&
                            dayIndex === currentDate.getDate()
                        ) {
                            day.style.background = 'yellow';
                        }

                        // 根据网址中的日期高亮显示
                        if (
                            urlYear === selectedYear &&
                            urlMonth === selectedMonth &&
                            urlDay === dayIndex
                        ) {
                            day.style.background = 'green';
                        }

                        // 添加点击事件
                        day.addEventListener('click', function(event) {
                            var clickedDate = event.target.textContent;
                            var clickedYear = selectYear.value;
                            var clickedMonth = selectMonth.value < 10 ? '0' + selectMonth.value : selectMonth.value;
                            var clickedDay = clickedDate < 10 ? '0' + clickedDate : clickedDate;

                            var url;
                            if (urlFormat === 'huggingface') {
                                url = 'https://huggingface.co/papers?date=' + clickedYear + '-' + clickedMonth + '-' + clickedDay;
                            } else { // 'changelog'
                                url = 'https://nightly.changelog.com/' + clickedYear + '/' + clickedMonth + '/' + clickedDay;
                            }

                            window.location.href = url;
                        });
                    }

                    days.appendChild(day);
                    dayIndex++;
                }
            }
        }

        // 监听选择框变化事件，更新月历
        selectYear.addEventListener('change', updateCalendar);
        selectMonth.addEventListener('change', updateCalendar);

        // 初始化月历
        updateCalendar();

        // 将月历添加到页面中
        document.body.appendChild(calendar);
    }

    // 等待页面加载完成后创建月历
    window.addEventListener('load', createCalendar);
})();
