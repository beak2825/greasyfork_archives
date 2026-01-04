// ==UserScript==
// @name          洛谷讨论区显示时间改成具体时间
// @namespace     https://www.luogu.com.cn/user/542457
// @description   将原本的“……前”改为具体的时间
// @author        cff_0102
// @run-at        document-start
// @version       2.0.2
// @license       MIT
// @match         https://www.luogu.com/*
// @match         https://www.luogu.com.cn/*
// @icon          https://www.luogu.com.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/474901/%E6%B4%9B%E8%B0%B7%E8%AE%A8%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4%E6%94%B9%E6%88%90%E5%85%B7%E4%BD%93%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/474901/%E6%B4%9B%E8%B0%B7%E8%AE%A8%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4%E6%94%B9%E6%88%90%E5%85%B7%E4%BD%93%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {

    'use strict';

    // 下面这个变量控制是否要修改个人主页动态中的时间为具体时间，可手动更改为 0
    const chbb = 1;

    // 下面这个函数可以关闭广告。不想关的话注释掉就行了。
    function closeDivsWithAttributes() {
        let attributeValue = '';
        var divElements = document.getElementsByTagName('div');
        for (var i = 0; i < divElements.length; i++) {
            var div = divElements[i];
            if (div.getAttribute('data-v-fdcd5a58') === attributeValue) {
                div.remove();
            }
            if (div.getAttribute('data-v-0a593618') === attributeValue) {
                div.remove();
            }
        }
    }
    setInterval(closeDivsWithAttributes, 500);

    function formatTime(isoDatetime) {
        const date = new Date(isoDatetime);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // 更改时间显示

    function changeTimeText() {
        let timeElements = document.querySelectorAll('time[data-v-f9624136][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
        timeElements = document.querySelectorAll('time[data-v-65a77fa1][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
        timeElements = document.querySelectorAll('time[data-v-85ede732][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
        timeElements = document.querySelectorAll('time[data-v-6784177c][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
        timeElements = document.querySelectorAll('time[data-v-1052ea08][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
        timeElements = document.querySelectorAll('time[data-v-4af4731c][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
        timeElements = document.querySelectorAll('time[data-v-0197ce51][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
        timeElements = document.querySelectorAll('time[data-v-0fca37c7][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
        timeElements = document.querySelectorAll('time[data-v-2fea9e9e][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
        timeElements = document.querySelectorAll('time[data-v-710aa612][datetime]');
        timeElements.forEach((timeElement) => {
            const datetime = timeElement.getAttribute('datetime');
            const formattedTime = formatTime(datetime);
            timeElement.textContent = formattedTime;
        });
    }


    function extractTimeText(element) {
        const timeElement = element.querySelector('.time');
        return timeElement ? timeElement.getAttribute('title') : null;
    }

    // 更新时间文本

    function updateLastReplyText() {
        const elements = document.querySelectorAll('div[data-v-e01570a1][data-v-66e61e01][data-v-5c428514-s].l-card');
        var cnt=0;
        elements.forEach((element) => {
            const linkElement = element.querySelector('div.row.row-space-between.bottom a.row.content-left.title.link');
            if(linkElement){
                const linkElement1 = linkElement.querySelector('div[data-v-66e61e01].time time');
                if(linkElement1){
                    const timeText = linkElement1.title;
                    if (timeText) {
                        const titleText = `最后回复于 ${timeText}`;
                        if (linkElement1) {
                            linkElement1.textContent = titleText;cnt++;
                        }
                    }
                }
            }
        });
        if(cnt){elements.forEach((element) => {
            const linkElement = element.querySelector('div[data-v-66e61e01].row.content-left');
            const linkElement1 = linkElement.querySelector('div[data-v-66e61e01].time time');
            const timeText = linkElement1.title;
            if (timeText) {
                const titleText = `发表于 ${timeText}`;
                if (linkElement1) {
                    linkElement1.textContent = titleText;
                }
            }
        });}
    }

    function work(){
        changeTimeText();
        updateLastReplyText();
    }
    setInterval(work, 500);

    function benben(){
        // 找到所有 class 为 span.lfe-caption 的元素
        var elements = document.querySelectorAll('span.lfe-caption');

        // 遍历每个元素并进行操作
        elements.forEach(function(element) {
            var temp = element.textContent;
            // 提取 title 属性中的数字
            var title = element.getAttribute('title');
            if(title){
                var numbers = title.match(/\d+/g);

                if (numbers && numbers.length >= 5) {
                    // 提取第三个数字和第四个数字
                    var thirdNumber = parseInt(numbers[2]);
                    var fourthNumber = parseInt(numbers[3]);

                    // 处理日凌晨的情况
                    if (title.includes("日凌晨")) {
                        if (fourthNumber === 12) {
                            fourthNumber = "0";
                        } else {
                            //fourthNumber = fourthNumber < 10 ? "0" + fourthNumber : fourthNumber.toString();
                        }
                    }

                    // 处理日早上、日上午、日下午、日晚上的情况
                    if (title.includes("日早上") || title.includes("日上午")) {
                        //fourthNumber = fourthNumber < 10 ? "0" + fourthNumber : fourthNumber.toString();
                    } else if (title.includes("日下午") || title.includes("日晚上")) {
                        fourthNumber += 12;
                    }

                    // 补全第二个数和第三个数并更新 text
                    var secondNumber = parseInt(numbers[1]);
                    var secondNumberStr = secondNumber < 10 ? "0" + secondNumber : secondNumber.toString();
                    var thirdNumberStr = thirdNumber < 10 ? "0" + thirdNumber : thirdNumber.toString();
                    var fourthNumberStr = parseInt(fourthNumber) < 10 ? "0" + fourthNumber : fourthNumber.toString();
                    if(fourthNumberStr=="24")fourthNumberStr="12";

                    var newText = `${numbers[0]}-${secondNumberStr}-${thirdNumberStr} ${fourthNumberStr}:${numbers[4]}`;

                    // 更新元素的 text
                    element.textContent = newText;
                    element.setAttribute('title',temp);
                }
            }
        });

    }
    if(chbb)setInterval(benben, 500);

})();