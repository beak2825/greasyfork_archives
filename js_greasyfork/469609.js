// ==UserScript==
// @name         虚拟生产线自动开始和关闭
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  元宇宙自动开启结束工作!
// @author       LaYa
// @match        https://metawork.99.com/**
// @match        https://uc-component.sdp.101.com/**
// @match        https://uc-component.sdp.101.com/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT LICENSE
// @downloadURL https://update.greasyfork.org/scripts/518179/%E8%99%9A%E6%8B%9F%E7%94%9F%E4%BA%A7%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%BC%80%E5%A7%8B%E5%92%8C%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/518179/%E8%99%9A%E6%8B%9F%E7%94%9F%E4%BA%A7%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%BC%80%E5%A7%8B%E5%92%8C%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // http://timor.tech/api/holiday/
    // 数据来源 http://timor.tech/api/holiday/year/2024/ 当前仅有 2024 的节假日，请在 2025-01-01 更新该数据
    let yearHolidayRepo = {
        "2024": { "01-01": { "holiday": true, "name": "元旦", "wage": 3, "date": "2024-01-01", "rest": 1 }, "02-04": { "holiday": false, "name": "春节前补班", "wage": 1, "after": false, "target": "春节", "date": "2024-02-04", "rest": 34 }, "02-10": { "holiday": true, "name": "初一", "wage": 3, "date": "2024-02-10", "rest": 40 }, "02-11": { "holiday": true, "name": "初二", "wage": 3, "date": "2024-02-11" }, "02-12": { "holiday": true, "name": "初三", "wage": 3, "date": "2024-02-12" }, "02-13": { "holiday": true, "name": "初四", "wage": 2, "date": "2024-02-13" }, "02-14": { "holiday": true, "name": "初五", "wage": 2, "date": "2024-02-14" }, "02-15": { "holiday": true, "name": "初六", "wage": 2, "date": "2024-02-15" }, "02-16": { "holiday": true, "name": "初七", "wage": 2, "date": "2024-02-16" }, "02-17": { "holiday": true, "name": "初八", "wage": 2, "date": "2024-02-17" }, "02-18": { "holiday": false, "name": "春节后补班", "wage": 1, "after": true, "target": "春节", "date": "2024-02-18" }, "04-04": { "holiday": true, "name": "清明节", "wage": 3, "date": "2024-04-04", "rest": 46 }, "04-05": { "holiday": true, "name": "清明节", "wage": 2, "date": "2024-04-05" }, "04-06": { "holiday": true, "name": "清明节", "wage": 2, "date": "2024-04-06" }, "04-07": { "holiday": false, "name": "清明节后补班", "wage": 1, "target": "清明节", "after": true, "date": "2024-04-07" }, "04-28": { "holiday": false, "name": "劳动节前补班", "wage": 1, "target": "劳动节", "after": false, "date": "2024-04-28" }, "05-01": { "holiday": true, "name": "劳动节", "wage": 3, "date": "2024-05-01" }, "05-02": { "holiday": true, "name": "劳动节", "wage": 2, "date": "2024-05-02" }, "05-03": { "holiday": true, "name": "劳动节", "wage": 3, "date": "2024-05-03" }, "05-04": { "holiday": true, "name": "劳动节", "wage": 3, "date": "2024-05-04" }, "05-05": { "holiday": true, "name": "劳动节", "wage": 3, "date": "2024-05-05" }, "05-11": { "holiday": false, "name": "劳动节后补班", "after": true, "wage": 1, "target": "劳动节", "date": "2024-05-11" }, "06-08": { "holiday": true, "name": "端午节", "wage": 2, "date": "2024-06-08" }, "06-09": { "holiday": true, "name": "端午节", "wage": 2, "date": "2024-06-09" }, "06-10": { "holiday": true, "name": "端午节", "wage": 3, "date": "2024-06-10" }, "09-14": { "holiday": false, "name": "中秋节前补班", "after": false, "wage": 1, "target": "中秋节", "date": "2024-09-14" }, "09-15": { "holiday": true, "name": "中秋节", "wage": 2, "date": "2024-09-15" }, "09-16": { "holiday": true, "name": "中秋节", "wage": 2, "date": "2024-09-16" }, "09-17": { "holiday": true, "name": "中秋节", "wage": 3, "date": "2024-09-17" }, "09-29": { "holiday": false, "name": "国庆节前补班", "after": false, "wage": 1, "target": "国庆节", "date": "2024-09-29" }, "10-01": { "holiday": true, "name": "国庆节", "wage": 3, "date": "2024-10-01" }, "10-02": { "holiday": true, "name": "国庆节", "wage": 3, "date": "2024-10-02", "rest": 1 }, "10-03": { "holiday": true, "name": "国庆节", "wage": 3, "date": "2024-10-03" }, "10-04": { "holiday": true, "name": "国庆节", "wage": 2, "date": "2024-10-04" }, "10-05": { "holiday": true, "name": "国庆节", "wage": 2, "date": "2024-10-05" }, "10-06": { "holiday": true, "name": "国庆节", "wage": 2, "date": "2024-10-06", "rest": 1 }, "10-07": { "holiday": true, "name": "国庆节", "wage": 2, "date": "2024-10-07", "rest": 1 }, "10-12": { "holiday": false, "after": true, "wage": 1, "name": "国庆节后补班", "target": "国庆节", "date": "2024-10-12" } },
        "2025": {"01-01":{"holiday":true,"name":"元旦","wage":3,"date":"2025-01-01","rest":86},"01-26":{"holiday":false,"name":"春节前补班","wage":1,"after":false,"target":"春节","date":"2025-01-26","rest":15},"01-28":{"holiday":true,"name":"除夕","wage":2,"date":"2025-01-28","rest":17},"01-29":{"holiday":true,"name":"初一","wage":3,"date":"2025-01-29","rest":1},"01-30":{"holiday":true,"name":"初二","wage":3,"date":"2025-01-30","rest":1},"01-31":{"holiday":true,"name":"初三","wage":3,"date":"2025-01-31","rest":1},"02-01":{"holiday":true,"name":"初四","wage":2,"date":"2025-02-01","rest":1},"02-02":{"holiday":true,"name":"初五","wage":2,"date":"2025-02-02","rest":1},"02-03":{"holiday":true,"name":"初六","wage":2,"date":"2025-02-03","rest":1},"02-04":{"holiday":true,"name":"初七","wage":2,"date":"2025-02-04","rest":1},"02-08":{"holiday":false,"name":"春节后补班","wage":1,"target":"春节","after":true,"date":"2025-02-08","rest":1},"04-04":{"holiday":true,"name":"清明节","wage":3,"date":"2025-04-04","rest":55},"04-05":{"holiday":true,"name":"清明节","wage":2,"date":"2025-04-05","rest":1},"04-06":{"holiday":true,"name":"清明节","wage":2,"date":"2025-04-06","rest":1},"04-27":{"holiday":false,"name":"劳动节前补班","wage":1,"target":"劳动节","after":false,"date":"2025-04-27","rest":3},"05-01":{"holiday":true,"name":"劳动节","wage":3,"date":"2025-05-01","rest":7},"05-02":{"holiday":true,"name":"劳动节","wage":2,"date":"2025-05-02","rest":1},"05-03":{"holiday":true,"name":"劳动节","wage":3,"date":"2025-05-03","rest":1},"05-04":{"holiday":true,"name":"劳动节","wage":3,"date":"2025-05-04","rest":1},"05-05":{"holiday":true,"name":"劳动节","wage":3,"date":"2025-05-05","rest":1},"05-31":{"holiday":true,"name":"端午节","wage":3,"date":"2025-05-31","rest":20},"06-01":{"holiday":true,"name":"端午节","wage":2,"date":"2025-06-01","rest":1},"06-02":{"holiday":true,"name":"端午节","wage":2,"date":"2025-06-02","rest":1},"09-28":{"holiday":false,"name":"国庆节前补班","after":false,"wage":1,"target":"国庆节","date":"2025-09-28","rest":58},"10-01":{"holiday":true,"name":"国庆节","wage":3,"date":"2025-10-01","rest":61},"10-02":{"holiday":true,"name":"国庆节","wage":3,"date":"2025-10-02","rest":1},"10-03":{"holiday":true,"name":"国庆节","wage":3,"date":"2025-10-03","rest":1},"10-04":{"holiday":true,"name":"国庆节","wage":2,"date":"2025-10-04","rest":1},"10-05":{"holiday":true,"name":"国庆节","wage":2,"date":"2025-10-05","rest":1},"10-06":{"holiday":true,"name":"中秋节","wage":2,"date":"2025-10-06","rest":1},"10-07":{"holiday":true,"name":"国庆节","wage":2,"date":"2025-10-07","rest":1},"10-08":{"holiday":true,"name":"国庆节","wage":2,"date":"2025-10-08","rest":1},"10-11":{"holiday":false,"after":true,"wage":1,"name":"国庆节后补班","target":"国庆节","date":"2025-10-11"}}
    }

    // 开始工作和结果工作的配置 说明
    // startH：开始小时 startM：开始分钟
    // endH：结束小时 endM：结束分钟
    // work：true 工作 | false 不工作
    // 如果没在配置中的都默认关闭工作
    let workTime = [
        { startH: 9, startM: 40, endH: 11, endM: 50, work: true },
        { startH: 11, startM: 50, endH: 13, endM: 30, work: false },
        { startH: 13, startM: 30, endH: 19, endM: 30, work: true }
    ];
    let messageRepo = {
        'show': false,
        'holiday': '状态: <span style="color:green">正常</span>',
        'rule': '',
        'work': '',
    }

    // 在这里输入 99 帐号的用户名密码
    let username = '';
    // 密码，请使用 base64 转码下 https://base64.us/
    let password = atob('');

    if (messageRepo.show) {
        openMessage();
    }

    // Your code here...
    setTimeout(() => {
        gotoLogin()
        autoLogin()
    }, 2000)

    // 定时任务，每10s运行一次
    setInterval(function () {
        reloadMessagee()
        autoOpenClose()
    }, 10000); // 10000ms = 10s



    function openMessage() {
        // 创建样式
        const style = `
            #custom-info-box {
                position: fixed;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 50%;
                background-color: rgba(0, 0, 0, 0.5); /* 设置透明度为50% */
                color: white;
                font-size: 16px;
                padding: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
                z-index: 10000;
                text-align: center;
                border-radius: 5px; /* 可选：增加圆角 */
            }
            #custom-info-box a {
                color: #4caf50;
                text-decoration: underline;
            }
            #custom-info-box .close-btn {
                position: absolute;
                top: 5px;
                right: 10px;
                background: transparent;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
            }
        `;

        // 创建样式节点
        const styleNode = document.createElement('style');
        styleNode.textContent = style;
        document.head.appendChild(styleNode);

        // 创建信息框
        const infoBox = document.createElement('div');
        infoBox.id = 'custom-info-box';
        // infoBox.innerHTML = `状态 ${statusMessage} | ${formatWorkTime(workTime)} `;

        // 将信息框插入到页面中
        document.body.appendChild(infoBox);
        reloadMessagee()
    }

    function reloadMessagee() {
        formatWorkTime(workTime)
        getHolidayInfo(new Date())
        let closeBtnHtml = `<button class="close-btn">×</button>`
        if (messageRepo.show) {
            const infoBox = $('#custom-info-box').html(`${closeBtnHtml} ${messageRepo.holiday} | ${messageRepo.work} <br /> ${messageRepo.rule}`)
            $('#custom-info-box').click((_this) => {
                $('#custom-info-box').remove()
                messageRepo.show = false
            })
        }
    }

    // 构造显示信息
    function formatWorkTime(times) {
        // 格式化时间函数
        function formatTime(hour, minute) {
            const h = String(hour).padStart(2, '0');
            const m = String(minute).padStart(2, '0');
            return `${h}:${m}`;
        }

        let html = '';
        let totalMinutes = 0; // 总工作分钟数

        times.forEach(({ startH, startM, endH, endM, work }) => {
            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;

            if (work) {
                totalMinutes += endMinutes - startMinutes;
            }

            html += ` ${formatTime(startH, startM)} ~ ${formatTime(endH, endM)} 【${work ? '工作' : '休息'}】&nbsp; |`;
        });

        // 计算总工作小时和分钟
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        html += `<br>总工作时间：${totalHours} 小时 ${remainingMinutes} 分钟`;
        messageRepo.work = html
    };

    function autoOpenClose() {
        gotoLogin()
        autoLogin()


        const now = new Date();
        let isHoliday = getHolidayInfo(now)
        if (isHoliday) {
            consolePrint(`今天节假日`)
            if (!stopCheck()) {
                stopWork();
            }
            return
        }

        let unexpectedTime = true
        workTime.forEach((item) => {
            let start = new Date();
            start.setHours(item.startH, item.startM, 0);
            let end = new Date();
            end.setHours(item.endH, item.endM, 0);
            if (now >= start && now < end) {
                if (item.work) {
                    if (!startCheck()) {
                        startWork();
                    }
                } else {
                    if (!stopCheck()) {
                        stopWork();
                    }
                }

                unexpectedTime = false
                consolePrint(`命中规则(${JSON.stringify(item)})`)
                return;
            }
        })

        if (unexpectedTime) {
            if (!stopCheck()) {
                stopWork();
            }
        }

    }

    function consolePrint(message) {
        let now = new Date();

        let year = now.getFullYear(); // 年
        let month = now.getMonth() + 1; // 月
        let day = now.getDate(); // 日
        let hour = now.getHours(); // 时
        let minute = now.getMinutes(); // 分
        let second = now.getSeconds(); // 秒
        let time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        let printRuleMessage = `当前时间 ${time} 节假日 ${getHolidayInfo(now)} => ${message}`
        messageRepo.rule = printRuleMessage
        console.log(printRuleMessage)
    }

    function gotoLogin() {
        const loginDiv = $('div[class="login"]').last();
        const usernameInput = $('#orgUserCode');
        if (loginDiv.length === 1 && loginDiv.css('display') !== 'none' && usernameInput.length === 0) {
            console.log('需要重新登录')
            loginDiv.find('button').eq(0).click()
        }
    }

    function autoLogin() {
        const usernameInput = $('#orgUserCode');
        const passwordInput = $('#password');
        const loginBtn = $('.submit-button');
        if (usernameInput.length === 1 && passwordInput.length === 1 && loginBtn.length === 1) {
            // 找到输入框元素
            var usernameIn = document.getElementById('orgUserCode');
            // 修改输入框的值
            usernameIn.value = username;
            // 触发 blur 事件，让 React 组件更新状态
            var event = new Event('blur', { bubbles: true });
            usernameIn.dispatchEvent(event);

            var passwordIn = document.getElementById('password');
            passwordIn.value = password;
            passwordIn.dispatchEvent(event);


            loginBtn.find('button').click()
        }
    }

    function stopWork() {

        //const span = $('span[class=""]').filter(':contains("暂停工作")');
        const span = $('div[class="task-bar work"]').find('span').filter(':contains("暂停工作")');
        // Check if the span element exists
        if (span.length == 1) {
            // Click the parent node of the span element
            $(span).parent().click();
        } else {
            consolePrint('已经结束工作，跳过')
        }
    }
    function stopCheck() {
        const span = $('div[class="task-bar continue"]').find('span').filter(':contains("继续工作")');
        let isStop = span.length == 1
        consolePrint(`停止工作检查，当前状态 【${isStop ? '已停止' : '未停止'}】`)
        return isStop
    }

    function startCheck() {
        const span = $('div[class="task-bar work"]').find('span').filter(':contains("暂停工作")');
        let isStart = span.length == 1
        consolePrint(`开始工作检查，当前状态 【${isStart ? '已开始' : '未开始'}】`)
        return isStart
    }

    function startWork() {

        const span = $('div[class="task-bar continue"]').find('span').filter(':contains("继续工作")');

        // Check if the span element exists
        if (span.length > 0) {
            // Click the parent node of the span element
            $(span.eq(span.length - 1)).parent().click();
        } else {
            consolePrint('已经开始工作，跳过')
        }
    }

    function getHolidayInfo(now) {
        //return axios.get(`https://timor.tech/api/holiday/info/${date}`);
        const year = new Date().getFullYear()
        if (!yearHolidayRepo[year]) {
            messageRepo.holiday = '状态: <span style="color:red">异常，节假日数据未找到</span>'
            throw "异常，节假日数据未找到";
        } else {
            messageRepo.holiday = '状态: <span style="color:green">正常</span>'
        }
        const yearHoliday = yearHolidayRepo[year]
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const monthAndDay = `${month}-${day}`
        const dayOfWeek = now.getDay();
        return yearHoliday[monthAndDay] ? yearHoliday[monthAndDay].holiday : (dayOfWeek === 0 || dayOfWeek === 6) ? true : false;
    }



})();