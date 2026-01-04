// ==UserScript==
// @name         清华本科生选课系统-课程时间冲突提示
// @version      2.2
// @namespace    http://tampermonkey.net/
// @author       Siyuan
// @description  将课表保存到本地，检测课程时间冲突
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=kbSearch*
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
// @downloadURL https://update.greasyfork.org/scripts/482967/%E6%B8%85%E5%8D%8E%E6%9C%AC%E7%A7%91%E7%94%9F%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F-%E8%AF%BE%E7%A8%8B%E6%97%B6%E9%97%B4%E5%86%B2%E7%AA%81%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/482967/%E6%B8%85%E5%8D%8E%E6%9C%AC%E7%A7%91%E7%94%9F%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F-%E8%AF%BE%E7%A8%8B%E6%97%B6%E9%97%B4%E5%86%B2%E7%AA%81%E6%8F%90%E7%A4%BA.meta.js
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
            attr.target_column = 7;
            attr.get_child = get_child_1_layer;
            break;
        case 'sports':
            attr.start_row = 0;
            attr.target_column = 6;
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
function add_mode_button(type) {
    let mode = document.createElement('p');
    mode.innerHTML = '<span padding="15px">整行标记</span><input type="checkbox" style="zoom:150%" id="full_line">';
    if (type == 'primary') {
        document.querySelector("body > div > form > div > div > div > div > div:nth-child(3)").appendChild(mode);
    } else if (type == 'spare') {
        let div = document.querySelector("#pathTd > div.window_neirong > div > form > div > div > div > div > div > div:nth-child(1) > div");
        div.insertBefore(mode, div.lastElementChild.previousElementSibling);
    } else if (type == 'sports' || type == 'bxr') {
        mode = document.createElement('td');
        mode.innerHTML = '<span padding="15px">整行标记</span><input type="checkbox" style="zoom:150%" id="full_line">';
        mode.style.padding = '2px';
        let div = document.querySelector("#a > div > div > div.tabdiv > div:nth-child(1) > table:nth-child(1) > tbody > tr") ??
                  document.querySelector("#a > div > div > div.keH.clearfix > div > div.tabdiv > div:nth-child(1) > table:nth-child(1) > tbody > tr") ??
                  document.querySelector("#a > div > div > div.keH.clearfix > div.tabdiv > div:nth-child(1) > table.order > tbody > tr");
        div.appendChild(mode);
    }
}
let attr = {}
let table = undefined;
let type = '';

function render() {
    if (localStorage.getItem('courses') == undefined) {
        console.log('courses not found in localStorage');
        return;
    }
    let courses = JSON.parse(localStorage.getItem('courses'));
    //console.log(courses);


    if (table == undefined) {
        return;
    }
    //console.log(table);
    let size = table.rows.length;
    //console.log(col);
    for (let i = attr.start_row; i < size; i++) {
        let cell = attr.get_child(table.rows[i].cells[attr.target_column]);
        //console.log(cell);
        let time_str = '';
        if (cell.getAttribute('original') == undefined) {
            time_str = cell.title == '' ? cell.innerText : cell.title;
        } else {
            time_str = cell.getAttribute('original');
            //console.log(time_str);
        }
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
            let color = waiting ? 'blue' : 'red';
            let checked = document.getElementById('full_line').checked;
            for (let j = 0; j < table.rows[i].cells.length; j++) {
                let cur = table.rows[i].cells[j];
                let cur_color = (checked || j == attr.target_column) ? color : '';
                if (cur.firstElementChild != undefined) {
                    if (cur.firstElementChild.firstElementChild != undefined) {
                        cur.firstElementChild.firstElementChild.style.color = cur_color;
                    } else {
                        cur.firstElementChild.style.color = cur_color;
                    }
                } else {
                    cur.style.color = cur_color;
                }
            }
            if (cell.getAttribute('original') == undefined) {
                cell.title += (cell.title == '' ? '' : ', ');
                cell.title += conflict.join(', ');
            }
        }
        cell.setAttribute('original', time_str);
    }
}
function prepare() {
    table = document.querySelector('#table_sy > table') ??
        document.querySelector("#a > div > div > div.keH.clearfix > div.tabdiv > div:nth-child(1) > table.table1") ??
        document.querySelector('#table_h') ??
        document.querySelector("#pathTd > div.window_neirong > div > form > div > div > div > div > div > div.tabdiv > div:nth-child(1) > table");
    if (table == undefined) {
        console.log('error: no table found');
        return;
    }
    if (table.rows[0].cells[0].innerText == '开课院系') {
        type = 'primary';
    } else if (table.rows[0].cells[0].innerText == '课程号') {
        type = 'spare';
    } else if (table.rows[0].cells[6].innerText == '上课时间') {
        type = 'sports';
    } else if (table.rows[0].cells[7].innerText == '上课时间') {
        type = 'bxr';
    } else {
        console.log('error: cannot recognize page type');
        return;
    }
    console.log('page type:', type);
    set_page_attr(type, attr);
    table = switch_table(type, table);
    add_mode_button(type);

    render();
    document.getElementById('full_line').onclick = render;

}

function upd_courses() {
    let courses = [];
    for (let i = 1; i <= 7; i++) {
        courses[i] = [null, [], [], [], [], [], []];
    }
    for (let i = 1; i <= 7; i++) {
        for (let j = 1; j <= 6; j++) {
            let cell = document.querySelector('body > div > form > div > div > div > div > div:nth-child(3) > table').rows[j].cells[i];
            for (let k = 0; k < cell.childNodes.length; k++) {
                if (cell.childNodes[k].nodeName == 'A') {
                    courses[i][j].push(cell.childNodes[k].innerText);
                }
            }
            //let name = cell.innerText;
            //name = trim(name);
            //if (name != '') {
            //    courses[i][j] = cell.firstElementChild.innerText;
            //}
        }
    }
    console.log(courses);
    console.log('all courses added into localStorage');
    localStorage.setItem('courses', JSON.stringify(courses));
    window.alert('课表信息已更新');
}
function del_courses() {
    console.log('all courses removed from localStorage');
    localStorage.removeItem('courses');
    window.alert('本地存储已清除');
}

(function() {
/*     console.log(document.frm.token.value);
    console.log($.post('https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksJxjhBs.do', {
m: 'kkxxSearch',
page: -1,
token: document.frm.token.value,
'p_sort.p1': '',
'p_sort.p2': '',
'p_sort.asc1': true,
'p_sort.asc2': true,
p_xnxq: '2023-2024-2',
pathContent: '%D2%BB%BC%B6%BF%CE%BF%AA%BF%CE%D0%C5%CF%A2',
showtitle: '',
p_kch: '',
p_kcm: '',
p_zjjsxm: '',
p_kkdwnm: '',
p_kcflm: '',
p_skxq: '',
p_skjc: '',
p_xkwzsm: '',
p_rxklxm: '',
p_kctsm: '',
p_ssnj: '',
p_bkskyl_ig: '',
p_yjskyl_ig: '',
goPageNumber: 1
    }).responseText) */
    'use strict';
    if (document.URL.startsWith('https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=kbSearch')) {
        let div = document.querySelector('body > div > form > div > div > div > div > div:nth-child(2)');
        let add = document.createElement('div');
        add.innerHTML = '<input type="button" value="更新" class="souSuo yahei" style="width:120px; text-align:center">';
        div.insertBefore(add, div.lastElementChild);
        add.children[0].onclick = upd_courses;
        let del = document.createElement('div');
        del.innerHTML = '<input type="button" value="清除" class="souSuo yahei" style="width:120px; text-align:center">';
        div.insertBefore(del, div.lastElementChild);
        del.children[0].onclick = del_courses;
    } else {
        prepare();
    }
})();