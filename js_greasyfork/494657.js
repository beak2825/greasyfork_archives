
// ==UserScript==
// @name         小鹅通-2023大数据工程继续教育专业科目
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  2023大数据工程继续教育专业科目
// @author       https://github.com/iamzhaohaibo
// @match        https://*.pc.xiaoe-tech.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494657/%E5%B0%8F%E9%B9%85%E9%80%9A-2023%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%B7%A5%E7%A8%8B%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%B8%93%E4%B8%9A%E7%A7%91%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/494657/%E5%B0%8F%E9%B9%85%E9%80%9A-2023%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%B7%A5%E7%A8%8B%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E4%B8%93%E4%B8%9A%E7%A7%91%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...

    function course_is_finished(nowTime, totalTime) {
        if (nowTime == totalTime) {
            console.log('当前视频已经完成播放')
            return true;
        } else {
            let course_name = get_course_item_info()
            course_name = course_name.textContent
            course_name = course_name.replace(/^\s+/, '');
            console.log('当前视频：', course_name.split(' ')[0])
            console.log('当前视频进度：', nowTime)
            return false;
        }
    }

    function get_course_item_info() {
        let course_item = document.getElementById("section_item_location")
        // let course_item = document.querySelector("#section_item_location > div > div > div.cata_box > div.sections_title_info > div.sections_title.setions_text.scroll_height_light")
        return course_item
    }

    function isPaused() {
        let video = document.querySelector("#pc_course_fe > video")
        if (video.paused) {
            console.log('视频状态：暂停')
            
            return true
        }else{
            return false
        }
    }
    //
    function next_course() {
        var targetDiv = document.getElementById('section_item_location');

        if (targetDiv && targetDiv.parentNode.tagName.toLowerCase() === 'ul') {
            // 获取targetDiv的父元素，即ul元素
            var ulElement = targetDiv.parentNode;

            // 遍历ulElement的所有子元素，找到targetDiv之后的第一个div元素
            var nextDiv = null;
            var siblings = ulElement.children; // 获取所有子元素（包括非div元素）
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i] === targetDiv) {
                    // 如果找到了targetDiv，检查下一个元素是否是div
                    if (i + 1 < siblings.length && siblings[i + 1].tagName.toLowerCase() === 'div') {
                        nextDiv = siblings[i + 1];
                        break;
                    }
                }
            }

            // 如果找到了下一个div元素，输出它或者执行其他操作
            if (nextDiv) {
                console.log('找到下一个元素div', nextDiv)
                // console.log(nextDiv); // 输出下一个div元素
                console.log(nextDiv.id);
                console.log(nextDiv.textContent);
                var next = nextDiv.children[0]
                console.log('现在寻找里面的子div', next)
                next.click()

                // 关闭当前窗口
                
                window.close()

            } else {
                console.log('没有找到下一个同级别的div元素');
            }
        } else {
            console.log('未找到id为section_item_location的div元素,或者它不是ul的直接子元素');
        }
    }


    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function generateRandomNumber(min, max) {
        return Math.floor(getRandomArbitrary(min, max));
    }


    function run() {
        console.log('主函数开始')

        let timetip_now = document.querySelector("#pc_course_fe > xe-timetips > span.xeplayer-time-Tips") // 当前时间
        let timetip_total = document.querySelector("#pc_course_fe > xe-timetips > span:nth-child(2)") // 总时间
        var nowTime = timetip_now.textContent
        var totalTime = timetip_total.textContent
        
        
        // 判断当前视频状态：
        console.log('TIME:'+nowTime+' / '+ totalTime)
        // get_course_item_info.textContent.includes('当前浏览') // 获取当前浏览的课程信息元素
        let video = document.querySelector("#pc_course_fe > video")

        if (!course_is_finished(nowTime = nowTime, totalTime = totalTime) && video.paused) {
            // 下一课程条件：当前时间和总时长一致，并且处于暂停状态
            // next_course()
            video.play()
        }
        if (course_is_finished(nowTime = nowTime, totalTime = totalTime) && video.paused) {
            // 下一课程条件：当前时间和总时长一致，并且处于暂停状态
            next_course()
        }
    }
    function main() {
        // 主函数

        function tick() {
            var interval = generateRandomNumber(5000, 10000);
            console.log(interval)
            setTimeout(tick, interval);
            run()
        }
        tick()
    }
    window.onload = main;
})();