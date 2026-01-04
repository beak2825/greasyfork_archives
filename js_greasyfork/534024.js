// ==UserScript==
// @name         B站分P视频时长计算器
// @namespace    yuhuangmeng
// @version      1.0.3
// @description  对B站分p的视频指定范围，计算指定范围 p1-p2 之间视频的时长（包括p1, p2）
// @author       yuhuangmeng
// @homepageURL  https://greasyfork.org/zh-CN/users/1065289-yuhuangmeng
// @match        https://www.bilibili.com/video/*/?p=*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/video/*p=*
// @icon         https://upload.wikimedia.org/wikipedia/commons/2/2b/Eo_circle_pink_letter-y.svg
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534024/B%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534024/B%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

/**
 * Forked from https://greasyfork.org/zh-CN/scripts/453414-%E8%AE%A1%E7%AE%97b%E7%AB%99%E5%88%86p%E8%A7%86%E9%A2%91%E5%9C%A8%E8%87%AA%E5%B7%B1%E6%89%80%E7%9C%8Bp%E6%95%B0%E7%9A%84%E8%A7%86%E9%A2%91%E5%89%A9%E4%BD%99%E6%97%B6%E9%95%BF
 * Original author: YuuRa1n
 * Modified by: yuhuangmeng
 * Changes: add more features
 */


(function() {
    setTimeout(function(){
        let html = '<span><span class="item-text sumtime"></span></span>';
        $(".video-title").after(html);
        const videoDataList = $("div.video-data-list");
        const videoData = $("div.video-data");
        if (videoDataList.length > 0) {
            console.log("新版本");
            html = '<span><span class="item-text lefttime"></span></span>';
            videoDataList.append(html);
        } else if (videoData.length > 0) {
            console.log("旧版本");
            html = '<span><span class="dm lefttime"></span></span>';
            videoData.append('&nbsp&nbsp&nbsp' + html);
        }
        const timeParams = allTimeList();
        totalTime(timeParams);
        lastTime(timeParams);
        givenTime(timeParams);
    }, 2000);

    $("ul.list-box li").on("click", function(){
        lastTime(timeParams);
    });
})();

function allTimeList(){
    // 获取所有的时间列表
    const timeList = $("div.duration").toArray().map(function(element) {
        const time = $(element).text();
        const list = time.split(":");
        if (list.length === 3) {
            return {
                hours: parseInt(list[0], 10),
                minutes: parseInt(list[1], 10),
                seconds: parseInt(list[2], 10)
            };
        } else {
            return {
                hours: 0,
                minutes: parseInt(list[0], 10),
                seconds: parseInt(list[1], 10)
            };
        }
    });

    return timeList;
}

function totalTime(timeList){
    // 计算视频总时长
    const sumTime = calcTime(timeList);
    $("span.sumtime").html("视频总时长：" + sumTime);
}

function lastTime(timeList){
    // 获取当前播放视频位置（第几条）和总视频数
    const page = $(".cur-page").text();
    const pageNum = page.split("/");
    const curPageNum = parseInt(pageNum[0].substring(1), 10);

    // 计算视频剩余时间
    const subTimeList = timeList.slice(curPageNum - 1);
    const leftTime = calcTime(subTimeList);
    $("span.lefttime").html("剩余时长：" + leftTime);
}

function givenTime(timeList){
    // 创建样式标签并添加样式
    const style = document.createElement('style');
    style.innerHTML = `
        #draggable-widget {
            position: absolute;
            top: 200px;
            right: 50px;
            z-index: 9999;
            background-color: #fc80a1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: move;
            color: white;
            font-weight: bold;
            font-size: 14px;
            text-align: center;
            width: auto;  /* Make width flexible based on content */
            max-width: 150px;  /* Set a maximum width to avoid collapsing too much */
            word-wrap: break-word;
        }
        #number-input-widget {
            z-index: 9999;
            background-color: #fff;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 150px;
            word-wrap: break-word;
            display: none;
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);

    // Create draggable widget container
    const widgetContainer_outer = document.createElement('div');
    widgetContainer_outer.id = 'draggable-widget';
    widgetContainer_outer.textContent = 'Time Calculator';
    document.body.appendChild(widgetContainer_outer);
    $(widgetContainer_outer).draggable({
        drag: function() {
            // Update the position of widgetContainer to remain attached to the bottom of widgetContainer_outer
            const rect = widgetContainer_outer.getBoundingClientRect();
            widgetContainer.style.top = rect.bottom + 'px'; // Position just below widgetContainer_outer
            widgetContainer.style.left = rect.left + 'px';  // Align with the left edge of widgetContainer_outer
        }
    });

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'number-input-widget';
    document.body.appendChild(widgetContainer);

    // create input fields and button
    const input1 = document.createElement('input');
    input1.type = 'number';
    input1.placeholder = 'P1';
    input1.style.width = '53.0px';
    widgetContainer.appendChild(input1);

    const input2 = document.createElement('input');
    input2.type = 'number';
    input2.placeholder = 'P2';
    input2.style.width = '53.0px';
    widgetContainer.appendChild(input2);

    const button = document.createElement('button');
    button.textContent = '确定';
    widgetContainer.appendChild(button);

    // create message box
    const messageBox = document.createElement('div');
    messageBox.id = 'message-box';
    widgetContainer.appendChild(messageBox);

    // Set the position of widgetContainer just below widgetContainer_outer
    widgetContainer_outer.addEventListener('click', function() {
        const rect = widgetContainer_outer.getBoundingClientRect();
        if (widgetContainer.style.display === 'none') {
            widgetContainer.style.display = 'block';
            widgetContainer.style.position = 'absolute';
            widgetContainer.style.top = rect.bottom + 'px'; // Position just below widgetContainer_outer
            widgetContainer.style.left = rect.left + 'px';  // Align with the left edge of widgetContainer_outer
        } else {
            widgetContainer.style.display = 'none';
        }
    });

    // add event listener to button
    button.addEventListener('click', () => {
        const p1 = parseInt(input1.value);
        const p2 = parseInt(input2.value);

        const givenTimeList = timeList.slice(p1 - 1, p2);
        const gTime = calcTime(givenTimeList);
        messageBox.textContent = "指定时长：" + gTime;
    });
}

// 给定时间数组和秒数组，数组长度必须相等，计算剩余时间
function calcTime(timeList){
    const sum = timeList.reduce(function(acc, time) {
        return {
            hours: acc.hours + time.hours,
            minutes: acc.minutes + time.minutes,
            seconds: acc.seconds + time.seconds
        };
    }, { hours: 0, minutes: 0, seconds: 0 });

    let { hours, minutes, seconds } = sum;

    minutes += Math.floor(seconds / 60);
    seconds = seconds % 60;
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;

    const formattedTime = [hours, minutes, seconds]
        .map(function(time) {
            return time < 10 ? "0" + time : time;
        })
        .join(":");

    return formattedTime;
}