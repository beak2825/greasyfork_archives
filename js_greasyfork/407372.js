// ==UserScript==
// @name         四六级英语考试抢报
// @namespace    http://www.u-fox.cn
// @version      1.0
// @description  在抢报前一分钟：选中要填报的科目->设置间隔时间（建议50-500ms)->开始抢报
// @author       u-fox
// @match        *://cet-bm.neea.edu.cn/Student/DetailsRW?r=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407372/%E5%9B%9B%E5%85%AD%E7%BA%A7%E8%8B%B1%E8%AF%AD%E8%80%83%E8%AF%95%E6%8A%A2%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/407372/%E5%9B%9B%E5%85%AD%E7%BA%A7%E8%8B%B1%E8%AF%AD%E8%80%83%E8%AF%95%E6%8A%A2%E6%8A%A5.meta.js
// ==/UserScript==


// 对save函数进行装饰，实现计数
let times = 0;
let btnDom_times = document.getElementsByClassName('zc_button')[1];
function save_plus() {
    save();
    times ++;
    btnDom_times.text = '已抢' + times + '次';
    console.log('已抢' + times + '次');
}
// 定义开抢和停止函数
let timerObj = null;
function begin() {
    btnDom.text = "停止";
    btnDom.onclick = over;
    timerObj = setInterval(save_plus, window.prompt('请输入两次模拟点击的时间间隔，建议为50~500（单位：ms）', '100'));
}
function over() {
    btnDom.text = "重新开抢";
    btnDom.onclick = begin;
    clearInterval(timerObj);
}
// 重置复选框列表，将disabled属性设为false
let testList = document.querySelectorAll('.md-check');
for (let i = 0; i < testList.length; i ++) {
    let test = testList[i];
    test.disabled = false;
}
// 重置提交按钮
let btnDom = document.getElementById('btnSearch');
// -更改按钮id以去除点击后按钮动态效果
btnDom.id = 'btnSearch_plus';
btnDom.text = "已选好，开抢";
btnDom.onclick = begin;