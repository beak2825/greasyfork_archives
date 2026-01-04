// ==UserScript==
// @name         清华选课系统课程冲突
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  利用课表信息标记选课时间冲突
// @author       Siyuan
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksJxjhBs.do
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksJxjhBs.do?m=kkxxSearch*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=xkqkSearch*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=bxSearch*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=xxSearch*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=rxSearch*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=tySearch*
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482959/%E6%B8%85%E5%8D%8E%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E5%86%B2%E7%AA%81.user.js
// @updateURL https://update.greasyfork.org/scripts/482959/%E6%B8%85%E5%8D%8E%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E5%86%B2%E7%AA%81.meta.js
// ==/UserScript==

function get_child_2_layers(node) {
    return node.firstElementChild.firstElementChild;
}
function get_child_1_layer(node) {
    return node.firstElementChild;
}
function set_page_attr(type, attr) {
    switch (type) {
        case 'bxr':
            attr.start_row = 0;
            attr.target_column = 6;
            attr.get_child = get_child_1_layer;
            break;
        case 'sports':
            attr.start_row = 0;
            attr.target_column = 5;
            attr.get_child = get_child_1_layer;
            break;
        case 'primary':
            attr.start_row = 1;
            attr.target_column = 10;
            attr.get_child = get_child_2_layers;
            break;
        case 'spare':
            attr.start_row = 0;
            attr.target_column = 7;
            attr.get_child = get_child_1_layer;
            break;
    }
}
function switch_table(type, table) {
    if (type == 'bxr') {
        return document.querySelector("#table_t");
    } else if (type == 'sports') {
        return document.querySelector('#content_1 > table');
    } else if (type == 'spare') {
        return document.querySelector('#content_1 > table');
    } else {
        return table;
    }
}
function conflict_courses() {
    if (localStorage.getItem('courses') == undefined) {
        console.log('courses not found in localStorage');
        return;
    }
    let courses = JSON.parse(localStorage.getItem('courses'));
    console.log(courses);
    let table = document.querySelector('#table_sy > table') ??
                document.querySelector("#a > div > div > div.keH.clearfix > div.tabdiv > div:nth-child(1) > table.table1") ??
                document.querySelector('#table_h') ??
                document.querySelector("#pathTd > div.window_neirong > div > form > div > div > div > div > div > div.tabdiv > div:nth-child(1) > table");
    if (table == undefined) {
        console.log('error: no table found');
        return;
    }
    //console.log(table.ownerDocument.URL);
    let type = '';
    console.log(table);
    if (table.rows[0].cells[0].innerText == '开课院系') {
        type = 'primary';
    } else if (table.rows[0].cells[0].innerText == '课程号') {
        type = 'spare';
    } else if (table.rows[0].cells[5].innerText == '上课时间') {
        type = 'sports';
    } else if (table.rows[0].cells[6].innerText == '上课时间') {
        type = 'bxr';
    } else {
        console.log('error: cannot recognize page type');
        return;
    }
    console.log('page type:', type);
    let attr = {};
    set_page_attr(type, attr);
    table = switch_table(type, table);
    if (table == undefined) {
        return;
    }
    let size = table.rows.length;
    //console.log(col);
    for (let i = attr.start_row; i < size; i++) {
        let cell = attr.get_child(table.rows[i].cells[attr.target_column]);
        //console.log(cell);
        let time_str = cell.title == '' ? cell.innerText : cell.title;
        let times = time_str.replaceAll(/\([^\(\)]+\)/g, '').split(',');
        let conflict = [];
        for (let j = 0; j < times.length; j++) {
            times[j] = trim(times[j]);
            if (times[j].length >= 3) {
                //console.log(times[j]);
                let p = parseInt(times[j][0]);
                let q = parseInt(times[j][2]);
                conflict = conflict.concat(courses[p][q]);
            }
        }
        function onlyUnique(value, index, array) {
            return array.indexOf(value) === index;
        }
        conflict = conflict.filter(onlyUnique);
        if (conflict.length > 0) {
            let waiting = true;
            for (let j = 0; j < conflict.length; j++) {
                if (!conflict[j].startsWith('候选：')) {
                    waiting = false;
                    break;
                }
            }
            cell.style.color = waiting ? 'blue' : 'red';
            cell.title += (cell.title == '' ? '' : ', ');
            //console.log(times, conflict);
            cell.title += conflict.join(', ');
        }
    }

}
(function() {
    'use strict';
    conflict_courses();
    // Your code here...
})();