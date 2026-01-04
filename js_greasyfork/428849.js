// ==UserScript==
// @name         打卡
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  金陵科技学院半自动一键打卡脚本
// @author       JiaNiuBi
// @match        http://*.jit.edu.cn/*
// @icon          http://ehall.jit.edu.cn/resources/app/5802229313231807/1.0_EM15/icon_72.png?_=1581666890000
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428849/%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/428849/%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==
var userInfo = {
  userId : '',
  userPwd : '',
     //是否异常（超过37.3℃）
    bodyWD : "否",
      //本人近14天内到访过的疫情严重地区
   ifYzdq : "无",
      //宁归来健康码（或苏康码）
     JkmColor :"绿色",
      //14天内是否去过南京以外城市
     ifToOther : "否",
      //次日是否返校
       ifBack : "否",
      //是否在南京
       ifInNanjing :  "否",
      //14天内是否一直在宁
     ifAlwasInNJ : "否",
      //所在地省份
      province : "",
      //所在地城市
       city : "",
      //所在地区县
      county  : "",
     //手机查询最近14天漫游地
     phoneCity : "",
    //详细地址
      detailedAddress : "",
};

(function() {
  let body = document.querySelector('body');
  let newB = document.createElement('div');
   let btnLogin = document.createElement('button');
  body.appendChild(newB);
  newB.setAttribute("id", "newB");
  newB.style.position = "absolute";
  newB.style.height = "26px"
  newB.style.width = "60px"
  newB.style.border = "1px solid black"
  newB.style.borderRadius = "13px";
  newB.style.top = "45%";
  newB.style.right = "0";
  newB.style.zIndex = "9999";
  newB.style.margin = "3px 2px 0";
  newB.style.backgroundColor = "#cee1fd"
  newB.style.textAlign = "center";
 newB.appendChild(btnLogin)
    //一键登陆按钮
  btnLogin.innerHTML = "一键按钮";
  btnLogin.style.float = "left";
 btnLogin.style.borderRadius = "13px";
     btnLogin.style.height = "26px"
  btnLogin.style.width = "60px"

    
       if(window.location.href == "http://authserver.jit.edu.cn/authserver/login?service=http%3A%2F%2Fehall.jit.edu.cn%2Flogin%3Fservice%3Dhttp%3A%2F%2Fehall.jit.edu.cn%2Fnew%2Findex.html"){
         let userName = document.getElementById('username');
let userPwd = document.getElementById('password');
   userName.value = userInfo.userId;
  userPwd.value = userInfo.userPwd;
document.getElementsByClassName("ipt_btn_dl")[0].click();

      }
   if(window.location.href == "http://ehall.jit.edu.cn/new/index.html")
   {
 

       document.getElementsByClassName("widget-information style-scope pc-card-html-4786697535230905-01")[3].click();

window.close();
   }
     else{
      
          setTimeout( function addNew() {
document.getElementsByClassName("bh-btn bh-btn-primary")[2].click();

 setTimeout(function addData100 () {
       let Data1 = document.getElementsByClassName('jqx-dropdownlist-content jqx-disableselect');

      //是否异常（超过37.3℃）
  Data1[7].innerText = userInfo.bodyWD;
      let Data7Value = Data1[7].parentNode.parentNode.parentNode.children[1]
      if( userInfo.bodyWD == "是"){
      Data7Value.value = "YES";
      }else{
          Data7Value.value = "NO";
      }
      //本人近14天内到访过的疫情严重地区
     Data1[9].innerText = userInfo.ifYzdq;
      //宁归来健康码（或苏康码）
       Data1[10].innerText = userInfo.JkmColor;
        let Data10Value = Data1[10].parentNode.parentNode.parentNode.children[1]
      if( userInfo.JkmColor == "绿色"){
      Data10Value.value = 1;
      }else if(userInfo.JkmColor == "黄色"){
          Data10Value.value = 2;
      }else{
       Data10Value.value = 3;
      }
      //14天内是否去过南京以外城市
       Data1[11].innerText = userInfo.ifToOther;
      let Data11Value = Data1[11].parentNode.parentNode.parentNode.children[1]
      if( userInfo.ifToOther == "是"){
      Data11Value.value = "YES";
      }else{
          Data11Value.value = "NO";
      }
      //次日是否返校
       Data1[12].innerText = userInfo.ifBack;
      //是否在南京
       Data1[13].innerText = userInfo.ifInNanjing;
      //14天内是否一直在宁
       Data1[14].innerText = userInfo.ifAlwasInNJ;
      //所在地省份
       Data1[15].innerText = userInfo.province;
      //所在地城市
       Data1[16].innerText = userInfo.city;
      //所在地区县
       Data1[17].innerText = userInfo.county;
    let Data2 = document.getElementsByClassName('bh-form-control jqx-widget-content jqx-input jqx-widget jqx-rc-all');
    //手机查询最近14天漫游地
     Data2[12].innerText = userInfo.phoneCity;
    //详细地址
      Data2[13].innerText = userInfo.detailedAddress;
 let enterBtn = document.getElementsByClassName('bh-btn bh-btn-primary')[4]
 enterBtn.click();
     let enterAgain = document.getElementsByClassName(' bh-dialog-btn bh-bg-primary bh-color-primary-5')[0];
    enterAgain.click();
     console.log("打卡完毕!");
window.close();
    },1000);
  },500)}
     
  
})();