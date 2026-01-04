// ==UserScript==
// @name         HEU成绩助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简单的统计和计算成绩，输出到控制台
// @author       HC
// @match        http://edusys.hrbeu.edu.cn/jsxsd/kscj/cjcx_list
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428383/HEU%E6%88%90%E7%BB%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428383/HEU%E6%88%90%E7%BB%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 解析表格
const table = [];
for (let tr of document.querySelector('#dataList > tbody').children) {
    const row = [];
    for (const th of tr.children) {
        row.push(th.innerText);
    }
    table.push(row);
}
const title = table[0]; // 表格的第一行，标题内容
const course = table.slice(1);  // 截取课程内容

function findTitle(name) {
    for (let i = 0; i < title.length; i++) {
        if (title[i] === name) return i;
    }
    console.error('未找到' + name + '，解析失败！');
    return -1;
}

// 表格数据加工
(function () {
    // 将评级转化为分数
    let index1 = findTitle('成绩');
    if (index1 === -1) return 0;
    for (let tr of course) {
        switch (tr[index1]) {
            case '优秀':
                tr[index1] = 95;
                break;
            case '良好':
                tr[index1] = 85;
                break;
            case '中等':
                tr[index1] = 75;
                break;
            case '及格':
                tr[index1] = 65;
                break;
            case '不及格':
                tr[index1] = 30;
                break;
            default:
                tr[index1] = parseInt(tr[index1]);
                if (isNaN(tr[index1])) {
                    tr[index1] = 0; // 无法转化成数字的，就当做0处理
                }
        }
    }

    // 剔除重复内容（补考/刷分，取最高分）;
    let index2 = findTitle('课程编号');
    if (index2 === -1) return 0;
    course.sort((a, b) => a[index2] - b[index2]); // 按课程编号从小到大排序
    for (let i = 1; i < course.length; i++) {
        if (course[i - 1][index2] === course[i][index2]) {
            console.log("检测到重复课程数据，将自动保留最高分，剔除低分数据：", course[i - 1], course[i]);
            if (course[i - 1][index1] < course[i][index1]) {
                course.splice(i - 1, 1);
            } else course.splice(i, 1);
            i--;
        }
    }

    // 将学分转化为数字
    index1 = findTitle('学分');
    if (index1 === -1) return 0;
    for (const tr of course) {
        tr[index1] = parseFloat(tr[index1]);
    }
})();

// 课程分类与整理
const mustCourse = [];  // 必修
const publicCourse = [];// 公选
const otherCourse = []; // 其他
(function () {
    let index1 = findTitle('课程名称');
    let index2 = findTitle('成绩');
    let index3 = findTitle('学分');
    let index4 = findTitle('课程属性');
    let index5 = findTitle('课程性质');
    let index6 = findTitle('通识教育选修课程类别');
    if (index1 === -1 || index2 === -1 || index3 === -1 || index4 === -1 || index5 === -1 || index6 === -1) return 0;

    for (let tr of course) {
        if (tr[index4] === '必修') {
            mustCourse.push([tr[index1], tr[index2], tr[index3], tr[index5]]);
        } else if (tr[index4] === '公选') {
            publicCourse.push([tr[index1], tr[index2], tr[index3], tr[index5], tr[index6]])
        } else {    // 其它
            otherCourse.push([tr[index1], tr[index2], tr[index3], tr[index5]]);
        }
    }
    console.log('必修课程：', mustCourse);
    console.log('公选课程：', publicCourse);
    console.log('其它课程：', otherCourse);
})();

// 成绩计算与统计
(function () {
    // 统计必修课成绩
    const must = [0, 0];
    for (let tr of mustCourse) {
        must[0] += tr[1] * tr[2];
        must[1] += tr[2];
    }
    console.log('必修课成绩:', '加权平均分：' + must[0] / must[1], '总学分：' + must[1]);

    // 统计公选课程
    const publicC = [0, 0];
    for (let tr of publicCourse) {
        publicC[0] += tr[1] * tr[2];
        publicC[1] += tr[2];
    }
    console.log('公选课成绩:', '加权平均分：' + publicC[0] / publicC[1], '总学分：' + publicC[1]);

    // 统计其它专选课
    const other = [0, 0];
    for (let tr of otherCourse) {
        other[0] += tr[1] * tr[2];
        other[1] += tr[2];
    }
    console.log('其它课成绩:', '加权平均分：' + other[0] / other[1], '总学分：' + other[1]);

    console.log('公选课加上其它课成绩:', '加权平均分：' + (must[0] + other[0]) / (must[1] + other[1]), '总学分：' + (must[1] + other[1]));
})()