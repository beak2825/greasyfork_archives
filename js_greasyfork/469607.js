// ==UserScript==
// @name         B站合集进度查看
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  B站集合时长信息查看：全部时长、已看时长、当前视频时长、之后剩余时频时长；
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469607/B%E7%AB%99%E5%90%88%E9%9B%86%E8%BF%9B%E5%BA%A6%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/469607/B%E7%AB%99%E5%90%88%E9%9B%86%E8%BF%9B%E5%BA%A6%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    var muti_list = document.getElementById("multi_page");
    if (muti_list){

        function formatTime(hours, minutes, seconds) {
            var hoursString = hours.toString().padStart(2, "0");
            var minutesString = minutes.toString().padStart(2, "0");
            var secondsString = seconds.toString().padStart(2, "0");

            return hoursString + ":" + minutesString + ":" + secondsString;
        }

        function addTime(time1, time2) {
            var timeParts1 = time1.split(":");
            var timeParts2 = time2.split(":");

            var hours = parseInt(timeParts1[0]) + parseInt(timeParts2[0]);
            var minutes = parseInt(timeParts1[1]) + parseInt(timeParts2[1]);
            var seconds = parseInt(timeParts1[2]) + parseInt(timeParts2[2]);

            if (seconds >= 60) {
                minutes += Math.floor(seconds / 60);
                seconds = seconds % 60;
            }

            if (minutes >= 60) {
                hours += Math.floor(minutes / 60);
                minutes = minutes % 60;
            }

            var result = formatTime(hours, minutes, seconds);
            return result;
        }

        function subtractTime(time1, time2) {
            var timeParts1 = time1.split(":");
            var timeParts2 = time2.split(":");

            var hours1 = parseInt(timeParts1[0]);
            var minutes1 = parseInt(timeParts1[1]);
            var seconds1 = parseInt(timeParts1[2]);

            var hours2 = parseInt(timeParts2[0]);
            var minutes2 = parseInt(timeParts2[1]);
            var seconds2 = parseInt(timeParts2[2]);

            var totalSeconds1 = (hours1 * 3600) + (minutes1 * 60) + seconds1;
            var totalSeconds2 = (hours2 * 3600) + (minutes2 * 60) + seconds2;
            var diffSeconds = totalSeconds1 - totalSeconds2;

            var hours = Math.floor(diffSeconds / 3600);
            var minutes = Math.floor((diffSeconds % 3600) / 60);
            var seconds = diffSeconds % 60;

            var result = formatTime(hours, minutes, seconds);
            return result;
        }

        function getElementByXPath(parent, xpath) {
            const result = document.evaluate(xpath, parent, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            return result.singleNodeValue;
        }

        const button = document.createElement("button");
        button.innerText = "查看进度"; 

        button.style.position = "fixed";
        button.style.bottom = "20px";
        button.style.right = "20px";
        button.style.padding = "10px";
        button.style.backgroundColor = "blue";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";

        document.body.appendChild(button);

        var span = document.createElement("div");
        span.innerText = ""; 


        span.style.position = "fixed";
        span.style.bottom = "20px";
        span.style.left = "20px";
        span.style.padding = "10px";
        span.style.color = "black";
        span.style.border = "none";
        span.style.borderRadius = "5px";
        span.style.cursor = "pointer";
        span.id = "my_time_info";

        document.body.appendChild(span);

        function update_time_info(){

            const xpathExpression = "//*[@id='multi_page']/div[2]/ul";
            const element = getElementByXPath(document, xpathExpression);
            if (element) {

                const elements = element.children;
                var date = "0:0:0";
                var Pasedate = "0:0:0";
                var onDate = "0:0:0";

                for (let i = 0; i < elements.length; i++) {

                    const childElement = elements[i];
                    var str = getElementByXPath(childElement, "a/div/div[2]").innerText;
                    var str_arr = str.split(":");
                    if (str_arr.length == 2){
                        str = "0:"+ str;
                    }
                    if (str_arr.length == 1){
                        str = "0:0:"+ str;
                    }

                    date = addTime(date, str);

                    if (childElement.classList.contains("on")){
                        Pasedate = date;
                        onDate = str;
                    }

                }

                var time_info = "总长：" + date + "\n已看：" + subtractTime(Pasedate, onDate) + "\n当前：" + onDate + "\n剩余："+ subtractTime(date, Pasedate);

                span.innerText = time_info; 

            }
        }

        button.addEventListener("click", function() {
            update_time_info();
        });

        span.addEventListener("click", function() {
            span.innerText = "";
        });

        var list = document.querySelector("#multi_page > div.cur-list > ul");
        list.addEventListener("click", function() {
            update_time_info();
        });

    }
})();
