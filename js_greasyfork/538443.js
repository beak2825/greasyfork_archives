// ==UserScript==
// @name         聚合相同用户和时间的帖子
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  合并相同发贴人和时间的帖子内容
// @author       You
// @match        https://nextptt.app/boards/*/post*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538443/%E8%81%9A%E5%90%88%E7%9B%B8%E5%90%8C%E7%94%A8%E6%88%B7%E5%92%8C%E6%97%B6%E9%97%B4%E7%9A%84%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/538443/%E8%81%9A%E5%90%88%E7%9B%B8%E5%90%8C%E7%94%A8%E6%88%B7%E5%92%8C%E6%97%B6%E9%97%B4%E7%9A%84%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addMinutes(timeStr, addMinute) {
        let [month, day, hour, minute] = timeStr.match(/\d+/g).map(Number);
        minute += addMinute;
        if (minute >= 60) { // 处理分钟溢出
            minute = minute % 60;
            hour += 1;
        }
        return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    let posts = document.querySelectorAll(".css-vhp0yr");
    let postMap = new Map();

    posts.forEach(post => {
        let user = post.querySelector(".chakra-text.css-1rr669u")?.innerText.trim();
        let time = post.querySelector(".chakra-text.css-emr6qx")?.innerText.trim();
        let contentElem = post.querySelector(".chakra-text.css-1yejqes");
        let content = contentElem?.innerText.trim();

        if (user && time && contentElem) {
            let time1 = addMinutes(time, 1);
            let time2 = addMinutes(time, 2);
            let time3 = addMinutes(time, 3);
            let time4 = addMinutes(time, 4);
            let key1 = `${user}||${time}`;
            let key2 = `${user}||${time1}`;
            let key3 = `${user}||${time2}`;
            let key4 = `${user}||${time3}`;
            let key5 = `${user}||${time4}`;

            if (postMap.has(key1)) {
                let existingElem = postMap.get(key1).querySelector(".chakra-text.css-1yejqes");
                existingElem.innerHTML += `<br>${content}`;
                post.remove();
            } else {
                postMap.set(key1, post);
                postMap.set(key2, post);
                postMap.set(key3, post);
                postMap.set(key4, post);
            }
        }
    });
})();
