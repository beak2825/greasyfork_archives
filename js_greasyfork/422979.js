// ==UserScript==
// @name         UCAS选课显示时间
// @namespace    https://github.com/tylzh97/
// @version      0.2
// @description  UCAS 国科大 选课系统看不到课程时间? 想看时间还要点开课程详情？这个脚本帮你解决！
// @author       Birkhoff
// @match        jwxk.ucas.ac.cn/courseManage/selectCourse*
// @require      https://unpkg.com/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/422979/UCAS%E9%80%89%E8%AF%BE%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/422979/UCAS%E9%80%89%E8%AF%BE%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = () => {
        // console.log($);
        console.log('Hello World!');
        const courseAimIndex = 4;
        const insertInex = 5;
        const table = document.getElementsByClassName('table table-striped table-bordered table-advance table-hover')[0];
        // 处理thead
        // table.getElementsByTagName('thead')[0].innerHTML = '<tr><th>选课</th><th>学位</th><th>关注</th><th>课程编码</th><th>课程名称</th><th>上课时间</th><th>课时</th><th>学分</th><th>限选</th><th>已选</th><th>课程属性</th><th>授课方式</th><th>考试方式</th><th>主讲教师</th></tr>';
        // console.log(table.getElementsByTagName('thead')[0].firstElementChild.children);
        const headInsertPoint = table.getElementsByTagName('thead')[0].firstElementChild.children[insertInex];
        const newTH = document.createElement('th');
        newTH.innerHTML = "上课时间";
        table.getElementsByTagName('thead')[0].firstElementChild.insertBefore(newTH, headInsertPoint);
        // 处理tbody
        const tbody = table.getElementsByTagName('tbody')[0];
        const tbody_tr = tbody.getElementsByTagName('tr');
        // console.log(tbody_tr);
        for (let i in tbody_tr) {
            // console.log(tbody_tr[i]);
            const tr = tbody_tr[i];
            if(!tr.getElementsByTagName) {
                break;
            }
            // console.log(tr);
            const tds = tr.getElementsByTagName('td');
            // console.log('tds', tds);
            const aim_td = tds[courseAimIndex];
            const insertPoint = tds[insertInex];
            $.get(aim_td.firstChild.href, (data, status) => {
                // console.log(data, status);
                const re = />上课时间<\/th>[\s\S]*?<td>(.+)<\/td>/ig;
                let array = data.match(re);
                // console.log(array);
                const courseTime = RegExp.$1;
                // console.log(courseTime);
                const newTD = document.createElement('td');
                newTD.innerHTML = '<span>' + courseTime.slice(0, courseTime.length-1) + '</span>';
                tr.insertBefore(newTD, insertPoint);
            })
        }
    }
})();
