// ==UserScript==
// @name         SWUST西南科技大学课程表导出JSON
// @namespace    https://note.shirakawatyu.top/#/article/45
// @version      0.2
// @description  把教务系统上面的课程表导出JSON
// @author       ShirakawaTyu
// @match        https://matrix.dean.swust.edu.cn/acadmicManager/index.cfm?event=studentPortal:courseTable
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450742/SWUST%E8%A5%BF%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BAJSON.user.js
// @updateURL https://update.greasyfork.org/scripts/450742/SWUST%E8%A5%BF%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%AF%BE%E7%A8%8B%E8%A1%A8%E5%AF%BC%E5%87%BAJSON.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个按钮
    var button = document.createElement("button");
    button.textContent = " 课表导出JSON ";
    button.style.width = "100px";
    button.style.height = "28px";
    button.style.align = "center";
    button.style.color = "white";
    button.style.background = "#39C5BB";
    button.addEventListener("click", getJSON);
    var area = document.getElementById('headArea');
    area.appendChild(button);

    // 创建lessons列表，存储课程
    var lessons = [];

    // 取得课程的JSON
    function getJSON() {
        // 拿到课程表的表格
        let box = document.getElementsByClassName('UICourseTable');
        // 外层循环i对应某行
        for (let i = 1; i <= 11; i+=2) {
            let day = 1;    // 星期
            // 内层循环j对应某列
            for (let j = 5; j <= 17; j+=2) {
                // 拿到该行的所有节点
                let childNodes = box[0].childNodes[3].childNodes[i].childNodes;

                let s;
                // 因为可能会存在“上午”之类的格子，如果存在的话这行的node总数为19，不存在则为17
                // 不存在的时候需要将下标-2
                if(childNodes.length === 19) {
                    s = childNodes[j].innerText;
                }else {
                    s = childNodes[j-2].innerText;
                }
                // 如果这个格子有内容则创建lesson对象并塞进lessons数组
                if(s !== '') {
                    s = s.split("\n");
                    let lesson = {};
                    lesson.day = day;
                    lesson.name = s[0].substring(0, s[0].indexOf("["));
                    lesson.position = s[2];
                    lesson.sectionContinue = 2;
                    lesson.sectionStart = i;
                    lesson.teacher = s[0].substring(s[0].indexOf(" - ") + 3);
                    lesson.week = [];
                    let start = Number.parseInt(s[1].substring(0, s[1].indexOf("-")));
                    let end = Number.parseInt(s[1].substring(s[1].indexOf("-") + 1));
                    // 周，从这个表格拿到的课大概都是连续的，出问题再改
                    for (let k = start; k <= end; k++) {
                        lesson.week.push(k);
                    }
                    lessons.push(lesson);
                }
                day += 1;
            }
        }
        // 将JSON导出到json文件
        download(JSON.stringify(lessons))
    }

    function download(JSONStr) {
        let file = new File([JSONStr], getDate() + ".json", { type: 'text/plain' })
        // let blob = new Blob([JSONStr]);
        const tmp = document.createElement('a');
        let link = URL.createObjectURL(file);
        tmp.href = link;
        tmp.download = getDate() + ".json";
        tmp.click();
        URL.revokeObjectURL(link);
    }

    function getDate() {
        let date = new Date();
        let yy = date.getFullYear().toString();
        let mm = (date.getMonth() + 1).toString();
        let dd = date.getDate().toString();
        return yy + '-' + mm + '-' + dd
    }
})();