// ==UserScript==
// @name         StoragedIptData Check
// @namespace    http://tampermonkey.net/
// @version      2024-05-31
// @description  Manage StoragedIptData.
// @author       You
// @include      *://*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493662/StoragedIptData%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/493662/StoragedIptData%20Check.meta.js
// ==/UserScript==

String.prototype.replaceAll = function(org,tgt){
    return this.split(org).join(tgt);
}
String.prototype.insert = function(start, newStr) {
    return this.slice(0, start) + newStr + this.slice(start);
};
Date.prototype.format = function(fmt) {
  function getYearWeek(date) {
    var date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var date2 = new Date(date.getFullYear(), 0, 1);

    //获取1月1号星期（以周一为第一天，0周一~6周日）
    var dateWeekNum = date2.getDay() - 1;
    if (dateWeekNum < 0) {
      dateWeekNum = 6;
    }
    if (dateWeekNum < 4) {
      //前移日期
      date2.setDate(date2.getDate() - dateWeekNum);
    } else {
      //后移日期
      date2.setDate(date2.getDate() + 7 - dateWeekNum);
    }
    var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    if (d < 0) {
      var date3 = new Date(date1.getFullYear() - 1, 11, 31);
      return getYearWeek(date3);
    } else {
      //得到年数周数
      var year = date1.getFullYear();
      var week = Math.ceil((d + 1) / 7);
      return week;
    }
  }

  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
    "W+": getYearWeek(this), //周数
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  return fmt;
};
Number.prototype.az = function(n = 2) {
    let s = "";
    for (let i = 1; i < n; i++) {
        s += '0';
    }
    return (s + this).slice(-1 * n);
}

(function() {
    let storagedInput={};
    function loadInput(){
        storagedInput=JSON.parse(atob(localStorage.getItem(`storagedIptData`)));
        if(!storagedInput){
            storagedInput={};
            saveInput();
        }
        return storagedInput;
    }
    function saveInput(){
        localStorage.setItem(`storagedIptData`,btoa(JSON.stringify(storagedInput)));
        return true;
    }
    'use strict';
    console.log(`Imported.`);
    function catchInput(e){
        let el=e.target;
        let data={
            tag:el.tagName,
            id:el.id,
            name:el.name,
            className:el.className,
            value:el.value,
            html:el.innerHTML,
        }
        let cts=parseInt(new Date().getTime() / 1000);
        let mts=`${cts}`.slice(0,8)+`00`;
        let key=`${data.tag}|${data.id}|${data.name}|${data.className}|${mts}`; // for multi ipt repeat
        //let key=el.outerHTML;
        storagedInput[key]=data;
        saveInput();
    }
    loadInput();
    try{
        let ipt=document.querySelectorAll(`input`);
        ipt.forEach((i)=>{
            i.addEventListener(`input`,catchInput);
        });
    }catch(e){}
    try{
        let txt=document.querySelectorAll(`textarea`);
        txt.forEach((i)=>{
            i.addEventListener(`input`,catchInput);
        });
    }catch(e){}
    try{
        let sel=document.querySelectorAll(`select`);
        sel.forEach((i)=>{
            i.addEventListener(`input`,catchInput);
        });
    }catch(e){}
})();