// ==UserScript==
// @name         OpenProject状态颜色改变
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  OpenProject根据不同任务状态配置不同背景颜色。
// @author       Lazy_leopard
// @match        https://op.recgroup.cn/projects/*/work_packages*
// @grant        none
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/479673/OpenProject%E7%8A%B6%E6%80%81%E9%A2%9C%E8%89%B2%E6%94%B9%E5%8F%98.user.js
// @updateURL https://update.greasyfork.org/scripts/479673/OpenProject%E7%8A%B6%E6%80%81%E9%A2%9C%E8%89%B2%E6%94%B9%E5%8F%98.meta.js
// ==/UserScript==



(function() {
    'use strict';
// 同一月份格式 两位数
function doHandleMonth(month){
       var m = month;
       if(month.toString().length == 1){
          m = "0" + month;
       }
       return m;
}

// 获取当前时间
function getDay(){
       var today = new Date();

       var targetday_milliseconds=today.getTime();

       today.setTime(targetday_milliseconds);

       var tYear = today.getFullYear().toString();
       var tMonth = today.getMonth();
       var tDate = today.getDate().toString();

       tMonth = doHandleMonth(tMonth + 1).toString();
       tDate = doHandleMonth(tDate);
       return tYear+tMonth+tDate;
}

function ddl(i){
      return parseInt(document.getElementsByClassName("inline-edit--display-field dueDate -editable")[i].innerText.replace('/', '').replace('/', '').replace('/', '')) < parseInt(getDay().replace('/', '').replace('/', '').replace('/', ''));  // 未过期
}

function isClosed(i){
      return document.getElementsByClassName("inline-edit--display-field status -required -editable")[i].innerText == 'Closed';
}

function isInprogress(i){
      return document.getElementsByClassName("inline-edit--display-field status -required -editable")[i].innerText == 'In progress';
}

function isHigh(i){
      return document.getElementsByClassName("inline-edit--display-field priority -required -editable")[i].innerText == 'High';
}

function setColor(i,color){
    document.getElementsByClassName("results-tbody work-package--results-tbody")[0].children[i].style.backgroundColor=color;
}

setInterval(function () {
    //设定循环定时器，1000毫秒=1秒，1秒钟检查一次目标对象是否出现
    var i = 0
    for( i; i <document.getElementsByClassName("inline-edit--display-field status -required -editable").length;i++ ){
        if(ddl(i)&&!isClosed(i)){
            setColor(i,"#dc2121")
            continue;
        }else if( isHigh(i)&&!ddl(i)){
            setColor(i,"#83b584")
            continue;
        }else if( isInprogress(i)){
            setColor(i,"#e4c8de")
            continue;
        }
}

  }, 1000);




})();


