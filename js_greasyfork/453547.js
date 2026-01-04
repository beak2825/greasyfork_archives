// ==UserScript==
// @name         bilibili calculate sum duration of multi pages video
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  对B站分P视频计算总和时间
// @author       gusongen
// @match        https://www.bilibili.com/video/BV15f4y1v7pa/?vd_source=3a2eabba4bc77708d5c29c29b5699fbe
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/453547/bilibili%20calculate%20sum%20duration%20of%20multi%20pages%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/453547/bilibili%20calculate%20sum%20duration%20of%20multi%20pages%20video.meta.js
// ==/UserScript==

let str2seconds = (s) => {
    s = s.split(':').reverse()
    let ans = 0;
    for (let i = 0, w = 1; i < s.length; i++, w *= 60) {
        ans += s[i] * w;
    }
    return ans;
}
let seconds2str = (t) => {
    let h = parseInt(t / 3600);
    t -= h * 3600;
    let m = parseInt(t / 60);
    t -= m * 60;
    let s = t;
    let ans = h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
    return ans;
}

(function () {
    'use strict';
    if (!document.querySelector('#multi_page')) return;
    setTimeout(() => {
        let all_duration = [];
        document.querySelectorAll('#multi_page  .duration').forEach((item) => {
            console.log(item.textContent);
            all_duration.push(str2seconds(item.textContent));
        })
        console.log('@item' + all_duration.length);
        if (all_duration.length <= 0) return;
        let sum_duration = seconds2str(all_duration.reduce((x, y) => x + y, 0));
        console.log('@sum_duration', sum_duration);
        let s = document.querySelector('span.bui-dropdown-name').textContent;
        s = '总时长  ' + sum_duration + ' | ' + s;
        document.querySelector('span.bui-dropdown-name').textContent = s;
    }, 4000);
})();