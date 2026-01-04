// ==UserScript==
// @name         steam成就按时间倒序排列
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在steam成就页面内将成就按解锁时间倒序排列
// @author       TinyGiant
// @match        https://steamcommunity.com/*/achievements/
// @exclude      https://steamcommunity.com/stats/*/achievements/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498481/steam%E6%88%90%E5%B0%B1%E6%8C%89%E6%97%B6%E9%97%B4%E5%80%92%E5%BA%8F%E6%8E%92%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/498481/steam%E6%88%90%E5%B0%B1%E6%8C%89%E6%97%B6%E9%97%B4%E5%80%92%E5%BA%8F%E6%8E%92%E5%88%97.meta.js
// ==/UserScript==

(function() {
    var box = document.getElementById('personalAchieve');
    var year_now = new Date().getFullYear();
    var array_element_time = document.getElementsByClassName('achieveUnlockTime');
    var array_time = Array();
    var length_array = array_element_time.length;
    for (let i = 0; i < length_array; i++) {
        let array_time_each = array_element_time[i].innerText.replaceAll(/\s/g, '').replace('年', ' ').replace('月', ' ').replace('日', ' ').replace(':', ' ').replace('解锁', '').replace('解鎖於', '').split(' ');
        if (array_time_each.length == 4) {
            array_time_each.unshift(year_now);
        }
        array_time_each[3] = String(Number(array_time_each[3].replace('12', '0').slice(2)) + (array_time_each[3].includes('下午') ? 12 : 0));
        for (let i = 1; i < 5; i++) {
            array_time_each[i] = `${array_time_each[i].length == 1 ? '0' : ''}${array_time_each[i]}`;
        }
        let time_each = `${array_time_each[0]}/${array_time_each[1]}/${array_time_each[2]} ${array_time_each[3]}:${array_time_each[4]}`;
        array_element_time[i].innerText = time_each.replace(`${year_now}/`, '');
        array_time.push(time_each);
    }
    for (let i = 1; i < length_array; i++) {
        for (let j = 0; j < i; j++) {
            if (array_time[i] > array_time[j]) {
                box.insertBefore(box.children[i], box.children[j]);
                array_time.splice(j, 0, array_time[i]);
                array_time.splice(i + 1, 1);
                break;
            }
        }
    }
})();