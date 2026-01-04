// ==UserScript==
// @name         清华选课系统课表保存
// @version      1.3
// @namespace    http://tampermonkey.net/
// @author       Siyuan
// @description  将课表保存到本地，用于课程冲突检测
// @match        https://zhjwxk.cic.tsinghua.edu.cn/xkBks.vxkBksXkbBs.do?m=kbSearch*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482958/%E6%B8%85%E5%8D%8E%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E8%AF%BE%E8%A1%A8%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/482958/%E6%B8%85%E5%8D%8E%E9%80%89%E8%AF%BE%E7%B3%BB%E7%BB%9F%E8%AF%BE%E8%A1%A8%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==


function add_courses() {
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
    localStorage.setItem('courses',JSON.stringify(courses));
    window.alert('课表信息已保存');
}
function del_courses() {
    console.log('all courses removed from localStorage');
    localStorage.removeItem('courses');
    window.alert('本地存储已清除');
}

(function() {
    let add = document.createElement('div');
    add.innerHTML = '<input type="button" id="add_all_courses" value="添加所有课程" class="souSuo yahei" style="width:120px; text-align:center">';
    let del = document.createElement('div');
    del.innerHTML = '<input type="button" id="add_all_courses" value="清除本地存储" class="souSuo yahei" style="width:120px; text-align:center">';
    let div = document.querySelector('body > div > form > div > div > div > div > div:nth-child(2)');
    div.insertBefore(add, div.lastElementChild);
    div.insertBefore(del, div.lastElementChild);
    add.children[0].onclick = add_courses;
    del.children[0].onclick = del_courses;
    // Your code here...
})();