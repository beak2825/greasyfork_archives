// ==UserScript==
// @name         计算B站分P视频在自己所看P数的视频剩余时长
// @namespace    YuuRa1n
// @version      0.6.2
// @description  获取分P视频剩余时间
// @author       YuuRa1n
// @homepageURL  https://greasyfork.org/zh-CN/users/972997-yuura1n
// @match        https://www.bilibili.com/video/*/?p=*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453414/%E8%AE%A1%E7%AE%97B%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E5%9C%A8%E8%87%AA%E5%B7%B1%E6%89%80%E7%9C%8BP%E6%95%B0%E7%9A%84%E8%A7%86%E9%A2%91%E5%89%A9%E4%BD%99%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/453414/%E8%AE%A1%E7%AE%97B%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E5%9C%A8%E8%87%AA%E5%B7%B1%E6%89%80%E7%9C%8BP%E6%95%B0%E7%9A%84%E8%A7%86%E9%A2%91%E5%89%A9%E4%BD%99%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

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
        //givenTime(timeParams);
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
        #number-input-widget {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background-color: #fff;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
    `;
    document.head.appendChild(style);

    // 创建部件容器
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'number-input-widget';
    document.body.appendChild(widgetContainer);

    // 创建输入框1
    const input1 = document.createElement('input');
    input1.type = 'number';
    input1.placeholder = 'P1';
    widgetContainer.appendChild(input1);

    // 创建输入框2
    const input2 = document.createElement('input');
    input2.type = 'number';
    input2.placeholder = 'P2';
    widgetContainer.appendChild(input2);

    // 创建确定按钮
    const button = document.createElement('button');
    button.textContent = '确定';
    widgetContainer.appendChild(button);

    // 创建消息框
    const messageBox = document.createElement('div');
    messageBox.id = 'message-box';
    widgetContainer.appendChild(messageBox);

    // 点击事件处理
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