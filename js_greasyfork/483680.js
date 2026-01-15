// ==UserScript==
// @name         B站统计观看时长
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  try to take over the world!
// @author       _zgy_
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483680/B%E7%AB%99%E7%BB%9F%E8%AE%A1%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/483680/B%E7%AB%99%E7%BB%9F%E8%AE%A1%E8%A7%82%E7%9C%8B%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==


setTimeout(function(){
    var flag = 0;
    // 获取目标元素
    var targetElement = document.querySelector(".video-info-detail-list"); // 根据id获取元素
    //var targetElement = document.querySelector("#viewbox_report"); // 根据id获取元素
    // 创建新的按钮元素
    var newButton = document.createElement("button");
    newButton.textContent = "手动刷新学习进度";
    //targetElement.parentNode.insertBefore(newButton, targetElement);
    targetElement.appendChild(newButton);
    // 创建新的span元素
    var newDiv = document.createElement("div");
    // 设置div元素的ID属性
    newDiv.setAttribute("id", "str1");
    // 获取要插入的目标节点
    var targetNode = document.getElementById("multi_page");
    if(targetNode == null){
        targetNode = document.getElementsByClassName("video-pod")[0];
        flag = 1;
    }
    // 将新创建的div元素插入到目标节点之前
    targetNode.parentNode.insertBefore(newDiv, targetNode);
    // 创建新的span元素
    var newDiv2 = document.createElement("div");
    // 设置div元素的ID属性
    newDiv2.setAttribute("id", "str2");
    newDiv.parentNode.insertBefore(newDiv2, newDiv);
    // 创建新的span元素
    var newDiv3 = document.createElement("div");
    // 设置div元素的ID属性
    newDiv3.setAttribute("id", "str3");
    newDiv2.parentNode.insertBefore(newDiv3, newDiv2);

    newButton.onclick = function(){
        if(flag == 0){
            shuaxin();
        }else{
            shuaxin1();
        }
    };

    if(flag == 0){
        shuaxin();
    }else{
        shuaxin1();
    }

    //获取当前视频序号结点
    var currentNumberNode;
    //获取内容
    var currentNumberContent;
    //分割后的数字
    var currentNumber;
    //上一个视频是第几个
    var previousNumber = 1;
    //检测是否切换视频
    function videoChange() {
        //获取当前是第几个视频
        currentNumberNode = document.getElementsByClassName("amt")[0];
        currentNumberContent = currentNumberNode.textContent;
        currentNumber = currentNumberContent.split('/')[0].split('（')[1];
        if(previousNumber != currentNumber){
            if(flag == 0){
                shuaxin();
            }else{
                shuaxin1();
            }
            previousNumber = currentNumber;
        }
    };

    // 设置定时器，每隔1000毫秒（即1秒）调用一次videoChange
    setInterval(videoChange, 1000);


},6000);

//这个函数没用了
function shuaxin(){
    // 选择页面上所有的视频列表元素
        var videoList = document.querySelectorAll('.video-pod__body>.video-pod__list');
        // 初始化总时长和已观看时长为0
        var totalDuration = 0;
        var watchedDuration = 0;
        // 遍历每个视频列表元素
        for(var video of videoList) {
            //获取视频时长的文本内容
            var duration = video.querySelector('.video-pod__item>.stats>.duration').textContent;
            var minute = duration.split(':')[0];
            var second = duration.split(':')[1];
            totalDuration += minute*60+parseInt(second);
            if(video.classList.contains('on')){
                watchedDuration = totalDuration - (minute*60+parseInt(second));
            }
        }
        // 计算剩余未观看的时长，即总时长减去已观看时长
        var remainingDuration = totalDuration - watchedDuration;
    var str1 = "总 时 长：" + Math.floor(totalDuration/3600) + ':' + Math.floor(totalDuration%3600/60) + ':' + totalDuration%60;
    var str2 = "已学时长：" + Math.floor(watchedDuration/3600) + ':' + Math.floor(watchedDuration%3600/60) + ':' + watchedDuration%60;
    var str3 = "剩余时长：" + Math.floor(remainingDuration/3600) + ':' + Math.floor(remainingDuration%3600/60) + ':' + remainingDuration%60;
    document.getElementById("str1").textContent = str1;
    document.getElementById("str3").textContent = str3;
    document.getElementById("str2").textContent = str2;
        // 在浏览器的控制台输出计算结果，方便查看和调试
        console.log('Total Duration: ' + Math.floor(totalDuration/3600) + ':' + Math.floor(totalDuration%3600/60) + ':' + totalDuration%60); // 总时长（秒）
        console.log('Watched Duration: ' + Math.floor(watchedDuration/3600) + ':' + Math.floor(watchedDuration%3600/60) + ':' + watchedDuration%60); // 已观看时长（秒）
        console.log('Remaining Duration: ' + Math.floor(remainingDuration/3600) + ':' + Math.floor(remainingDuration%3600/60) + ':' + remainingDuration%60); // 剩余时长（秒）
}
function shuaxin1(){
    // 选择页面上所有的视频列表元素
        var videoList = document.querySelectorAll('.video-pod__body>.video-pod__list>.video-pod__item');
        // 初始化总时长和已观看时长为0
        var totalDuration = 0;
        var watchedDuration = 0;
        // 遍历每个视频列表元素
        for(var video of videoList) {
            //获取视频时长的文本内容
            var duration = video.querySelector('.stats>.duration').textContent;
            var timesplit = duration.split(':');
            if(timesplit.length == 2){
                var minute = timesplit[0];
                var second = timesplit[1];
                totalDuration += minute*60+parseInt(second);
                if(video.classList.contains('active') || video.getAttribute('data-scrolled') == 'true'){
                     watchedDuration = totalDuration - (minute*60+parseInt(second));
                }
            }else{
                var hour = timesplit[0];
                var minute = timesplit[1];
                var second = timesplit[2];
                totalDuration += hour*60*60+minute*60+parseInt(second);
                if(video.classList.contains('active') || video.getAttribute('data-scrolled') == 'true'){
                    watchedDuration = totalDuration - (hour*60*60+minute*60+parseInt(second));
                }
            }
        }
        // 计算剩余未观看的时长，即总时长减去已观看时长
        var remainingDuration = totalDuration - watchedDuration;
    var str1 = "总 时 长：" + Math.floor(totalDuration/3600) + ':' + Math.floor(totalDuration%3600/60) + ':' + totalDuration%60;
    var str2 = "已学时长：" + Math.floor(watchedDuration/3600) + ':' + Math.floor(watchedDuration%3600/60) + ':' + watchedDuration%60;
    var str3 = "剩余时长：" + Math.floor(remainingDuration/3600) + ':' + Math.floor(remainingDuration%3600/60) + ':' + remainingDuration%60;
    document.getElementById("str1").textContent = str1;
    document.getElementById("str3").textContent = str3;
    document.getElementById("str2").textContent = str2;
        // 在浏览器的控制台输出计算结果，方便查看和调试
        console.log('Total Duration: ' + Math.floor(totalDuration/3600) + ':' + Math.floor(totalDuration%3600/60) + ':' + totalDuration%60); // 总时长（秒）
        console.log('Watched Duration: ' + Math.floor(watchedDuration/3600) + ':' + Math.floor(watchedDuration%3600/60) + ':' + watchedDuration%60); // 已观看时长（秒）
        console.log('Remaining Duration: ' + Math.floor(remainingDuration/3600) + ':' + Math.floor(remainingDuration%3600/60) + ':' + remainingDuration%60); // 剩余时长（秒）
}
