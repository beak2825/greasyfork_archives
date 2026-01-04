// ==UserScript==
// @name         CloudCampus云校园助手
// @namespace    CloudCampus云校园助手

// @version      1.0

// @description  自动填入当天课程对应的频道号并自动跳转到直播间

// @author       bz2021
// @match        https://www.cloudcampus.com.cn/*

// @require      https://code.jquery.com/jquery-1.12.4.min.js

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/451455/CloudCampus%E4%BA%91%E6%A0%A1%E5%9B%AD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/451455/CloudCampus%E4%BA%91%E6%A0%A1%E5%9B%AD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var EnglishName = 'Amy 王梅';  //这里填入你进入频道后希望显示的名字

    let course = new Map([
        ['Monday', { Channelid: '2812950', Teacher: 'Mile' }],
        ['Wednesday', { Channelid: '2524708', Teacher: 'Lizelle' }],
        ['Thursday', { Channelid: '2521643', Teacher: 'Molly' }],
        ['Friday', { Channelid: '2521643', Teacher: 'Molly' }]
    ])
    // 在这里填写各天的频道号和老师的名字 更改单引号中的内容 注意格式 当天没有课的不需要填
    // 星期数请使用首字母大写的英文单词 否则会导致不能正常使用

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    $(document).ready(function () {

        $("body").append(" <button id = 'mybtn' style='opacity: 0;left: 10px;top: 10px;background: lightgreen;color:#ffffff;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 240px;height: 40px;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px;border-top-left-radius: 6px;border-top-right-radius: 6px;'></button>");

        var x = document.getElementById("mybtn");

        setInterval(() => {
            if (document.querySelector("#page-header-nav > div > div > div > a > img") != null) x.style.opacity = 1;
            if (document.querySelector("#page-header > div > div > div:nth-child(1) > div > a > img") != null) x.style.opacity = 0;
        }, 300)

        var url = window.location.href;

        if (url == 'https://www.cloudcampus.com.cn/login/') {

            x.innerHTML = "Login To Live Classroom"

            x.addEventListener('click', () => {

                window.location.href = 'https://www.cloudcampus.com.cn/login/index2.php';
            })

        }

        if (url.includes('login/index2')) {

            var d = new Date();

            var today = weekday[d.getDay()];

            var content = '';
            var classnum = '';

            if (course.get(today) == null) {
                content = 'No Course Today';
            }
            else {
                classnum = course.get(today).Channelid;
                content = `Jump To ${course.get(today).Teacher}'s Course`;
            }
            x.innerHTML = content;
            x.addEventListener('click', () => {
                if (classnum == '') alert('No Course Today');
                else {
                    document.querySelector("#channel_id").value = classnum;
                    document.querySelector("#ename").value = EnglishName;

                    setTimeout(() => { document.querySelector("#loginbtn").click(); x.remove() }, 1000);
                }
            })

        }

    });


})();