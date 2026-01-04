// ==UserScript==
// @name         自动审核实习
// @namespace    http://fastcenter.cn/
// @version      0.1
// @description  自动审核实习所有学生的信息
// @author       barret
// @match        http://wdsj.3enetwork.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      barret
// @downloadURL https://update.greasyfork.org/scripts/485165/%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8%E5%AE%9E%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/485165/%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8%E5%AE%9E%E4%B9%A0.meta.js
// ==/UserScript==
 
// 计算表格有效数据共多少行
let rows_info;
//表格的列数(从第9列开始计算)
let column_num = 8;
 
 
(function () {
 
 
  'use strict';
 
  // 用于手动切换到未审核栏目并设置页数为最大预留5秒操作时间
  setTimeout(function () {
    getTaskNum()
  }, 5000)
 
  // 每隔6秒时间执行下一行
  function getTaskNum() {
    setInterval(function () {
      rows_info = document.querySelector('.el-table__body').rows;
      column_num++;
      if (column_num !== 13) {
        console.log("表格行数为 ==== ", rows_info.length + "列数为 ====", column_num);
        taskss();
      } else {
        column_num = 8;
      }
    }, 6000);
 
  }
 
  function taskss() {
    // console.log('run taskss,表行信息为：', rowss[i].cells[num].innerHTML);
    if (rows_info[0].cells[column_num].innerHTML.includes("未审核") === true || rows_info[0].cells[column_num].innerHTML.includes("审核不通过") === true) {
      console.log('当前审核任务数是 === ' + (i + 1));
      let text = rows_info[0].cells[column_num];
      taskA(column_num, text).then(taskB).then(taskC).then(taskD);
    } else {
      console.log('当前第' + column_num + '列的任务已审核通过！');
    }
  }
 
 
  let taskA = (i, text) => new Promise((resolve, reject) => {
    console.log('run task A');
    setTimeout(function () {
      if (text.innerHTML.includes("未审核") === true || text.innerHTML.includes("审核不通过") === true) {
        console.log('task A 审核中');
        text.querySelector(".el-table_1_column_" + (column_num + 1) + " .el-tag .ri-checkbox-circle-fill").click();
        resolve();
      }
    }, 1000);
  });
 
  let taskB = () => new Promise((resolve, reject) => {
    console.log('run task B');
    setTimeout(function () {
      document.querySelector(".el-button--success").click();
      resolve();
    }, 1000);
  });
 
  let taskC = () => new Promise((resolve, reject) => {
    console.log('run task C');
    setTimeout(function () {
      document.querySelector(".el-switch__label--right").click();
      resolve();
    }, 1000);
  });
 
  let taskD = () => new Promise((resolve, reject) => {
    console.log('run task D');
    setTimeout(function () {
      document.querySelector(".dialog-footer .el-button--primary").click();
      resolve();
    }, 1000);
  });
 
})();