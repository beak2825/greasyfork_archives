// ==UserScript==
// @name         SDUQD-羽毛球预约
// @namespace    http://tampermonkey.net/
// @version      2024-07-25
// @description  111
// @author       You
// @match        https://cgyy.qd.sdu.edu.cn/venue/venue-reservation/4
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501828/SDUQD-%E7%BE%BD%E6%AF%9B%E7%90%83%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/501828/SDUQD-%E7%BE%BD%E6%AF%9B%E7%90%83%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==

(function() {
    let shouldStop = false; // 标志位，用于控制整个脚本的执行

    function isElementClickable(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.disabled !== true;
    }

    function clickForwardArrow() {
        const forwardArrowSpan = document.querySelector('span.pull-right > i.ivu-icon.ivu-icon-ios-arrow-forward');
        if (forwardArrowSpan && isElementClickable(forwardArrowSpan)) {
            forwardArrowSpan.parentElement.click(); // 点击包含箭头的 span 元素
            return true; // 表示已经点击了箭头元素
        }
        return false; // 没有找到或没有点击箭头元素
    }

    function clickDateButton(date) {
        const dateButtons = document.querySelectorAll('div.date_box > div');
        if (dateButtons.length > 1) {
            if (date === 1) {
                dateButtons[0].click(); // 点击今天的按钮
            } else if (date === 2) {
                dateButtons[1].click(); // 点击明天的按钮
            }
        }
    }

    function checkClickableElements() {
        if (clickForwardArrow()) {
            console.log("Clicked forward arrow, waiting for 10 seconds before checking clickable elements.");
            setTimeout(findClickableElements, 10000);
        }
    }

    function findAvailableToday() {
        const clickableElements = [];
        const rows = document.querySelectorAll('tr[data-v-4d7ee43f]');  // 选择所有的指定的 tr 元素
        for (let row of rows) {
            const tdElements = row.querySelectorAll('td[data-v-4d7ee43f]');
            for (let td of tdElements) {
                const clickableDiv = td.querySelector('.reserveBlock.position.free');
                if (clickableDiv && isElementClickable(clickableDiv)) {
                    clickableElements.push(clickableDiv);
                }
            }
        }

        if (clickableElements.length > 0) {
            console.log('Clickable elements found:', clickableElements);

            // 检查浏览器是否支持通知
            if ("Notification" in window) {
                // 请求通知权限
                Notification.requestPermission().then(function(permission) {
                    if (permission === "granted") {
                        new Notification("今日出现空余", {
                            body: `发现 ${clickableElements.length} 个空余位置`,
                        });
                    }
                });
            }
        } else {
            console.log('No clickable elements found, refreshing the page.');
            // 没有找到可点击元素，刷新页面
            location.reload();
        }
    }

    function findAvailableTommorow() {
        const clickableElements = [];
        const rows = document.querySelectorAll('tr[data-v-4d7ee43f]');  // 选择所有的指定的 tr 元素
        for (let row of rows) {
            const tdElements = row.querySelectorAll('td[data-v-4d7ee43f]');
            for (let td of tdElements) {
                const clickableDiv = td.querySelector('.reserveBlock.position.free');
                if (clickableDiv && isElementClickable(clickableDiv)) {
                    clickableElements.push(clickableDiv);
                }
            }
        }

        if (clickableElements.length > 0) {
            console.log('Clickable elements found:', clickableElements);

            // 检查浏览器是否支持通知
            if ("Notification" in window) {
                // 请求通知权限
                Notification.requestPermission().then(function(permission) {
                    if (permission === "granted") {
                        new Notification("明日发现空余", {
                            body: `发现 ${clickableElements.length} 个空余位置`,
                        });
                    }
                });
            }
        } else {
            console.log('No clickable elements found, refreshing the page.');
            // 没有找到可点击元素，刷新页面
            location.reload();
        }
    }

    function findAvailableTwoday() {
        console.log("zhaojintian")
        const clickableElements = [];
        const rows = document.querySelectorAll('tr[data-v-4d7ee43f]');  // 选择所有的指定的 tr 元素
        for (let row of rows) {
            const tdElements = row.querySelectorAll('td[data-v-4d7ee43f]');
            for (let td of tdElements) {
                const clickableDiv = td.querySelector('.reserveBlock.position.free');
                if (clickableDiv && isElementClickable(clickableDiv)) {
                    clickableElements.push(clickableDiv);
                }
            }
        }

        if (clickableElements.length > 0) {
            console.log('Clickable elements found:', clickableElements);

            // 检查浏览器是否支持通知
            if ("Notification" in window) {
                // 请求通知权限
                Notification.requestPermission().then(function(permission) {
                    if (permission === "granted") {
                        new Notification("今日出现空余", {
                            body: `发现 ${clickableElements.length} 个空余位置`,
                        });
                    }
                });
            }
        }
        else {
            console.log("zhaomingtian")
            clickDateButton(2)
            if (setTimeout(clickForwardArrow, 2000)) {
                console.log("Clicked forward arrow, waiting for 5 seconds before checking clickable elements.");
                setTimeout(function() {
                    const clickableElements = [];
                    const rows = document.querySelectorAll('tr[data-v-4d7ee43f]');  // 选择所有的指定的 tr 元素
                    for (let row of rows) {
                        const tdElements = row.querySelectorAll('td[data-v-4d7ee43f]');
                        for (let td of tdElements) {
                            const clickableDiv = td.querySelector('.reserveBlock.position.free');
                            if (clickableDiv && isElementClickable(clickableDiv)) {
                                clickableElements.push(clickableDiv);
                            }
                        }
                    }
                    if (clickableElements.length > 0) {
                        console.log('Clickable elements found:', clickableElements);

                        // 检查浏览器是否支持通知
                        if ("Notification" in window) {
                            // 请求通知权限
                            Notification.requestPermission().then(function(permission) {
                                if (permission === "granted") {
                                    new Notification("明日发现空余", {
                                        body: `发现 ${clickableElements.length} 个空余位置`,
                                    });
                                }
                            });
                        }
                    }
                    else {
                        console.log('No clickable elements found, refreshing the page.');
                        // 没有找到可点击元素，刷新页面
                        location.reload();
                    }
                }, 5000);
            }
        }
    }

    function Today() {
        if (clickForwardArrow()) {
            console.log("Clicked forward arrow, waiting for 10 seconds before checking clickable elements.");
            setTimeout(findAvailableToday, 10000);
        }
    }

    function Tommorow() {
        clickDateButton(2)
        if (setTimeout(clickForwardArrow, 2000)) {
            console.log("Clicked forward arrow, waiting for 10 seconds before checking clickable elements.");
            setTimeout(findAvailableTommorow, 8000);
        }
    }

    function Twoday() {
        if (clickForwardArrow()) {
            console.log("Clicked forward arrow, waiting for 5 seconds before checking clickable elements.");
            setTimeout(findAvailableTwoday, 5000);
        }
    }

    var date = 3; //输入查找日期：1=今天；2=明天；3=今明两天

    if (date == 1) {
        setTimeout(Today, 5000);
    } else if (date == 2) {
        setTimeout(Tommorow, 5000);
    } else if (date == 3) {
        setTimeout(Twoday, 5000);
    }
})();






