// ==UserScript==
// @name        林科大教务处快捷操作
// @namespace   https://github.com/ahao268
// @include     https://jwc.csuft.edu.cn/
// @include     http://ehall.csuft.edu.cn/new/index.html
// @include     http://authserver.csuft.edu.cn/authserver/*
// @include     http://jwgl.csuft.edu.cn/jsxsd/*
// @include     http://authserver.csuft.edu.cn/authserver/index.do
// @grant       none
// @version     0.2
// @author      Dowell
// @description 进入官网后快捷到达指定页面
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451772/%E6%9E%97%E7%A7%91%E5%A4%A7%E6%95%99%E5%8A%A1%E5%A4%84%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/451772/%E6%9E%97%E7%A7%91%E5%A4%A7%E6%95%99%E5%8A%A1%E5%A4%84%E5%BF%AB%E6%8D%B7%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==
;(function () {
  "use strict"
  let currentUrl="https://jwc.csuft.edu.cn"
  let middleUrl="http://authserver.csuft.edu.cn/authserver/login"
  let nextUrl="http://ehall.csuft.edu.cn/new/index.html"
  if(location.href.startsWith(currentUrl)){
    location.replace(middleUrl)
  }
  if(location.href.startsWith(middleUrl)){
    let username=document.getElementById("username")
    let password=document.getElementById("password")
    //let fo=document.getElementById("casLoginForm")
    //username.value=""//这里填入用户名
    //password.value=""//这里填入教务处密码
    //let btn=fo.getElementsByTagName("button")[0]
    //btn.click()
  }
    let errorUrl="http://authserver.csuft.edu.cn/authserver/index.do"
  if(location.href.startsWith(errorUrl)){
    location.replace(nextUrl)
  }
  if(location.href.startsWith(nextUrl)){
    let schedule="http://jwgl.csuft.edu.cn/jsxsd/xskb/xskb_list.do"
    let selectCourse="http://jwgl.csuft.edu.cn/jsxsd/xsxk/xklc_list"
    let grades="http://jwgl.csuft.edu.cn/jsxsd/kscj/cjcx_frm"
    let i = prompt("输入跳转页面序号:\n1:成绩页面\n2:课表页面\n3:选课页面\n")
    if(i==="1"){
      location.href=grades
    }else if(i==="2"){
      location.href=schedule
    }else if(i==="3"){
      location.href=selectCourse
    }else{
      alert("您输入了无效字符!")
    }
  }
  let sameUrl="http://jwgl.csuft.edu.cn/jsxsd"
  if(location.href.startsWith(sameUrl)){
    window.onload=function(){
      console.log("1111")
      if(location.href.indexOf("#")==-1){
        //在当前页面地址加入"#"，使下次不再进入此判断
        location.href=location.href+"#"
        setTimeout(function(){location.reload()},200)
      }
    }
  }
})()