// ==UserScript==
// @name         上海科技大学选课系统查看和打印课表时添加时间
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在上海科技大学选课系统研究生综合管理页面查看课表子页面添加每节课对应的时间
// @author       liguohan
// @match        https://grad.shanghaitech.edu.cn/public/WitMis_LookCourseTable.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnplugins.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450723/%E4%B8%8A%E6%B5%B7%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E6%9F%A5%E7%9C%8B%E5%92%8C%E6%89%93%E5%8D%B0%E8%AF%BE%E8%A1%A8%E6%97%B6%E6%B7%BB%E5%8A%A0%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/450723/%E4%B8%8A%E6%B5%B7%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E6%9F%A5%E7%9C%8B%E5%92%8C%E6%89%93%E5%8D%B0%E8%AF%BE%E8%A1%A8%E6%97%B6%E6%B7%BB%E5%8A%A0%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let courseStartTime = [null,'8:15-9:00','9:10-9:55','10:15-11:00','11:10-11:55','13:00-13:45','13:55-14:40','15:00-15:45',
               '15:55-16:40','16:50-17:35','18:00-18:45','18:55-19:40','19:50-20:35','20:45-21:30'];
    let table = document.getElementById('tabCT');
    if(table){
        let rows = table.querySelectorAll('tr');
        rows.forEach((item,index)=>{
            if(index!==0){
                let td = item.querySelector('td');
                td.innerHTML = td.innerHTML + '<br>' + courseStartTime[index];
            }
        })
    }
})();