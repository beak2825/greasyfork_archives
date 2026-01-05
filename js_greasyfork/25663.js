// ==UserScript==
// @name         TabacooRecorder
// @namespace    https://greasyfork.org/users/86741
// @version      0.2
// @description  Record your tabacoo order
// @include      http://gdgz.xinshangmeng.com*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/25663/TabacooRecorder.user.js
// @updateURL https://update.greasyfork.org/scripts/25663/TabacooRecorder.meta.js
// ==/UserScript==

/****************************************
######## version 20161214 #########
保存在新商盟的最近一次下单记录
****************************************/
console.log("华哥的记录保存脚本开始执行!");

//注册菜单
GM_registerMenuCommand('保存输入',Save);
GM_registerMenuCommand('读取记录',Load);
GM_registerMenuCommand('控制台显示记录',ShowInConsole);
console.log('脚本菜单注册成功');

//全局变量,常量
var recordJson={}; //记录json
var _lastRecord='lastRecord'; //记录最后一次输入的数据名,_开头表示常量

//保存输入
function Save(){
  console.log('开始保存输入');
  for(var i=1;i<1024;i++){
    id='sort_'+i;
    li=document.getElementById(id);
    if(!li){
      break;
    }
    num=li.getElementsByTagName('input')[1].value;
    if(num>0){
      recordJson[li.title]=num;
    }
  }
  newRecord=JSON.stringify(recordJson);
  GM_setValue(_lastRecord,newRecord);
  console.log('保存输入成功!保存的json是:');
  console.log(newRecord);
}

//读取输入
function Load(){
  alert('注意!读取记录基于上次的网页编排\n,如编排被改变可能引发错误,请仔细核对!');
  console.log('开始读取输入');
  record=JSON.parse(GM_getValue(_lastRecord));
  console.log(record);
  for(var i=1;i<1024;i++){
    id='sort_'+i;
    li=document.getElementById(id);
    if(!li){
      break;
    }
    if(li.title in record){
      inputBox=li.getElementsByTagName('input')[1];
      inputBox.value=record[li.title];
      //必须让输入框获取焦点再失去焦点,数据才会更新
      inputBox.focus();
      inputBox.blur();
    }
  }
  console.log('读取输入成功');
}

//控制台查看保存记录
function ShowInConsole(){
  console.log('控制台显示保存记录:');
  record=GM_getValue(_lastRecord);
  console.log(record);
}