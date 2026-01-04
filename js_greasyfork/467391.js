// ==UserScript==
// @name         bilibili选集视频进度统计
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为选集视频课添加全局的进度统计，方便你按照总进度安排学习计划。
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       window-load
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467391/bilibili%E9%80%89%E9%9B%86%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/467391/bilibili%E9%80%89%E9%9B%86%E8%A7%86%E9%A2%91%E8%BF%9B%E5%BA%A6%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function convertSecondsToHoursMinutes(seconds) {
        var hours = Math.floor(seconds / 3600); // 将总秒数转换为小时数
        var minutes = Math.floor((seconds % 3600) / 60); // 计算剩余秒数转换为分钟数

        return hours + "小时" + minutes + "分钟";
    }

    let bvPattern = /BV([0-9a-zA-Z])+/g;
    let aidPattern = /"aid":(\d+)/;
    let url = window.location.href;
    let matchResult = bvPattern.exec(url)[0]
    console.log("https://www.bilibili.com/video/"+matchResult+"/")
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "https://www.bilibili.com/video/"+matchResult+"/", true)
    xhr.onload = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let responseData = xhr.responseText;
            let aid = aidPattern.exec(responseData)[1]
            let listRequest = new XMLHttpRequest();
            listRequest.open('GET', "https://api.bilibili.com/x/web-interface/view?aid="+aid, true)
            listRequest.onload = function(){
                if (listRequest.readyState === XMLHttpRequest.DONE && listRequest.status === 200) {
                    let resData = JSON.parse(listRequest.responseText);
                    let totalDuration = 0;
                    let pList = resData.data.pages;
                    for (const p of pList) {
                        totalDuration += p.duration
                    }
                    let cum = 0;
                    for (const p of pList) {
                        cum += p.duration
                        let percent = parseFloat((cum * 100 / totalDuration)).toFixed(2);
                        console.log(percent)
                        p.percent = percent
                    }
                    console.log()
                    let newDiv = document.createElement('div')
                    newDiv.textContent = convertSecondsToHoursMinutes(cum)
                    let headCon = document.querySelector('.head-con')
                    headCon.insertBefore(newDiv,headCon.querySelector('.head-right'));

                    let liElements = document.getElementById('multi_page').querySelectorAll('li');
                    console.log(liElements)
                    for (let i=0; i < liElements.length; i++){
                        const li = liElements[i]
                        let pageNum = li.querySelector('.page-num')
                        pageNum.textContent = pList[i].percent + '% ' + pageNum.textContent
                    }

                }

            }
            listRequest.send()
        }
    }
    xhr.send();



})();