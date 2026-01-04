// ==UserScript==
// @name         leetcode-cn辅助
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  leetcode-cn刷题辅助脚本
// @author       You
// @match        https://leetcode-cn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/426225/leetcode-cn%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/426225/leetcode-cn%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

let featured = new Set([838,1469,1469,1681,1681,1538,1538,1906,1906,1669,1669,1582,1582,1581,1581,1448,1448,1542,1542,1638,1638,1590,1590,1679,1679,1484,1484,1651,1651,1630,1630,1592,1592,1384,1384,1485,1485,1682,1682,1533,1533,1676,1676,999,999,1540,1540,1628,1628,1571,1571,1579,1579,1536,1536,821,821,485,485,1541,1541,1444,1444,1586,1586,1665,1665,1645,1645,1606,1606,1519,1519,1620,1620,1653,1653,1591,1591,1622,1622,1531,1531,1636,1636,1602,1602,1650,1650,111,111,1222,1222,1555,1555,730,730,1362,1362,1522,1522,1505,1505,1641,1641,1908,1908,1625,1625,1660,1660,1196,1196,1662,1662,1011,1011,1475,1475,1907,1907,1903,1903,1300,1300,1486,1486,1539,1539,1546,1546,1356,1356,1178,1178,1044,1044,1290,1290,1457,1457,1495,1495,1605,1605,1397,1397,1454,1454,1904,1904,978,978,1673,1673,1532,1532,1610,1610,1142,1142,1593,1593,1570,1570,1634,1634,1623,1623,1248,1248,1916,1916,1911,1911,1637,1637,1471,1471,1463,1463,93,93,1144,1144,1240,1240,1247,1247,1199,1199,1621,1621,1477,1477,1644,1644,1564,1564,1476,1476,84,84,1598,1598,1629,1629,1924,1924,1910,1910,1609,1609,1172,1172,1036,1036,1668,1668,1014,1014,1578,1578,1550,1550,1337,1337,1282,1282,102,102,1028,1028,91,91,1378,1378,933,933,1909,1909,1545,1545,1667,1667,1152,1152,1666,1666,1180,1180,1678,1678,1923,1923,1268,1268,101,101,1613,1613,812,812,108,108,1446,1446,1253,1253,1234,1234,1298,1298,1420,1420,1511,1511,1604,1604,1547,1547,1424,1424,1534,1534,1159,1159,1474,1474,701,701,1245,1245,1462,1462,1135,1135,1368,1368,313,313,1518,1518,916,916,133,133,1306,1306,1639,1639,1567,1567,1059,1059,1350,1350,182,182,1588,1588,1921,1921,776,776,395,395,1174,1174,781,781,1648,1648,1284,1284,831,831,1611,1611,799,799,1595,1595,1914,1914,1315,1315,1575,1575,1635,1635,885,885,1191,1191,1241,1241,949,949,1557,1557,846,846,326,326,1913,1913,953,953,96,96,95,95,864,864,1607,1607,1308,1308,473,473,693,693,1912,1912,1263,1263,110,110,713,713,892,892,1120,1120,1322,1322,79,79,1464,1464,341,341,1252,1252,1537,1537,995,995,1012,1012,132,132,1347,1347,849,849,617,617,637,637,1286,1286,1019,1019,1554,1554,939,939,475,475,137,137,439,439,1672,1672,1824,1824,757,757,1603,1603,721,721,121,121,959,959,452,452,441,441,425,425,359,359,697,697,1915,1915,573,573,809,809,166,166,1353,1353,99,99,472,472,311,311,72,72,1790,1790,1568,1568,1766,1766,1052,1052,1093,1093,1287,1287,528,528,187,187,1183,1183,162,162,902,902,1323,1323,1319,1319,481,481,1239,1239,1553,1553,1150,1150,245,245,1655,1655,1920,1920,1095,1095,1373,1373,1405,1405,642,642,1740,1740,1302,1302,331,331,815,815,1365,1365,1377,1377,1004,1004,703,703,1880,1880,493,493,144,144,1425,1425,769,769,1888,1888,1366,1366,1922,1922,1359,1359,1341,1341,413,413,1255,1255,737,737,828,828,496,496,1260,1260,1018,1018,1033,1033,773,773,135,135,1407,1407,1429,1429,555,555,1140,1140,1048,1048,105,105,852,852,1181,1181,1069,1069,71,71,714,714,129,129,1431,1431,300,300]);
let too_easy = new Set();

(function() {
    'use strict';

    read_config();

    // 注册监听
    when(detectTable, () => {
        let tableObserver = new MutationObserver(process_problem_list);
        let options = {childList: true};
        let table = get_problem_list_dom();
        let tbody = table.getElementsByTagName('tbody')[0];
        tableObserver.observe(tbody, options);
    });
    when(detectTable, process_problem_list);
})();

function save_config() {
    GM_setValue('easy_list', too_easy);
}

function read_config() {
    too_easy = GM_getValue('easy_list');
    too_easy = new Set(too_easy);
    if (too_easy === undefined) {
        too_easy = new Set();
    }
}

// 用于判断表格是否被加载
function detectTable() {
    let table = get_problem_list_dom();
    if (table === undefined) {
        return false;
    }
    let tr = table.getElementsByTagName('tr')[0];
    if (tr === undefined) {
        return false;
    }
    return true;
}

function get_problem_list_dom() {
    return document.getElementsByClassName('table-striped')[0];
}

// 处理问题列表
function process_problem_list() {
    console.log('called');
    let table = get_problem_list_dom();
    let trs = table.getElementsByTagName('tr');

    for (let i = 1 ; i < trs.length-1 ; i++) {
        let row = get_row_data(trs[i]);
        console.log(row);
        // 删除操作
        if (should_delete_problem(row)) {
            delete_row(trs[i]);
            continue;
        }

        // 修改操作
        modify_row(trs[i], row);

    }
}

function should_delete_problem(row) {
    if (row.difficulty == '简单') return true;
    if (row.status == 'locked') return true;
    return false;
}

function get_row_data(tr) {
    let tds = tr.getElementsByTagName('td');
    let row = {};

    /*
    第一个字段，题目状态
    locked: 锁定题目
    solved: 已完成
    failed: 已尝试，未通过
    empty: 未尝试
    */
    let div = tds[0].firstElementChild;
    if (div.firstElementChild == null) {
        row.status = 'empty';
    } else {
        let span = div.firstElementChild;
        if (span.classList.contains('lock__13du')) {
            row.status = 'locked';
        } else if (span.classList.contains('text-success')) {
            row.status = 'solved';
        } else if (span.classList.contains('text-info')) {
            row.status = 'failed';
        } else {
            row.status = 'empty';
        }
    }

    /*
    第二个字段，id
    */
    let problem_id = Number(tds[1].innerText);
    row.problem_id = problem_id;

    /*
    第三个字段，题目名
    */
    let title = tds[2].getElementsByTagName('a')[0].innerText;
    row.title = title;

    /*
    第四个字段，题解数量
    */
    let num_of_solution = Number(tds[3].firstElementChild.innerText);
    row.solution_num = num_of_solution;

    /*
    第五个字段，通过率
    */
    let pass_rate = tds[4].innerText;
    row.pass_rate = pass_rate;

    /*
    第六个字段，难度
    */
    let difficulty = tds[5].firstElementChild.innerText;
    row.difficulty = difficulty;

    return row;
}

function modify_row(tr, row) {
    // 修改一行的显示
    // 1. 标记常考的题
    if (featured.has(row.problem_id)) {
        tr.style.backgroundColor = '#5ABE6F';
    }

    // 2. 修改链接，能够在新窗口打开
    let link_td = tr.children[2];
    // 移除原来的链接，添加新的链接
    let href = link_td.firstChild.firstChild.firstChild.href;
    let a = document.createElement('a');
    a.innerText = link_td.innerText;
    a.href = href;
    link_td.removeChild(link_td.firstChild);
    link_td.appendChild(a);

    // 3. 添加本地标记功能 TODO
    console.log(too_easy);
    if (too_easy.has(row.problem_id)) {
        add_easy_mark(tr.children[0]);
    }
    tr.children[0].addEventListener('click', () => {
        if (too_easy.has(row.problem_id)) {
            too_easy.delete(row.problem_id);
            remove_easy_mark(tr.children[0]);
        } else {
            too_easy.add(row.problem_id);
            add_easy_mark(tr.children[0]);
        }
        save_config();
        //add_easy_mark(tr.children[0]);
    });
}

function contains_easy_mark(td) {
    let div = td.firstElementChild;
    let spans = div.getElementsByClassName('fa-check-circle-o');
    return spans.length != 0;
}
function add_easy_mark(td) {
    let div = td.firstElementChild;
    let spans = div.getElementsByClassName('fa-check-circle-o');
    if (spans.length == 0) {
        let span = document.createElement('span');
        span.classList.add('fa');
        span.classList.add('fa-check-circle-o');
        div.appendChild(span);
    }
}

function remove_easy_mark(td) {
    let div = td.firstElementChild;
    let spans = div.getElementsByClassName('fa-check-circle-o');
    for (let i = 0 ; i < spans.length ; i++) {
        spans[i].remove();
    }
}

function delete_row(tr) {
    //tr.remove();
    tr.setAttribute('hidden', true);
}

function when(condition,func) {
    if (condition()) {
        func();
    } else {
        window.setTimeout(() => {when(condition, func)},1000);
    }
}
