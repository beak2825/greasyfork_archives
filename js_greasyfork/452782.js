// ==UserScript==
// @name        华理图书馆自动预约
// @namespace   Violentmonkey Scripts
// @match       http://mjyylib.ncst.edu.cn/book/more/type/4/lib/11
// @match       http://mjyylib.ncst.edu.cn/home/book/more/lib/11/type/4/day/*
// @match       http://mjyylib.ncst.edu.cn/book/notice/act_id/***/type/4/lib/11
// @match       http://mjyylib.ncst.edu.cn/book/notice/act_id/**/type/4/lib/11
// @grant       none
// @version     1.3.13
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @author      野生铁丝
// @description 自动完成明天三次的预约，为华理考研人准备
// @license MIT
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/452782/%E5%8D%8E%E7%90%86%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/452782/%E5%8D%8E%E7%90%86%E5%9B%BE%E4%B9%A6%E9%A6%86%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==

var num=0
// day为1为明天的预约，为2为今天预约
day=1
// 默认情况,单人预约请修改u1，并将twopeople变量置零。
var twopeople=0

u1= "12345"
p1="1234@12345"

u2 = "12345"
p2="1234@12345"

userID = u1
password=p1

// 如果是两个个人的话请为1.
if(twopeople){

  // 如果存储为空，则注入数据
  if(GM_listValues().length ==  0){
    GM_setValue("changePeople", 1)
  }

  if(GM_getValue("changePeople")){
    GM_setValue("changePeople", 0)
    userID = u1
    password=p1
  }
  else{
    GM_setValue("changePeople", 1)
    userID = u2
    password=p2
  }
}

// 我是真的搞不懂，这里动态链接的目的是什么，就不怕数据重复吗
// 其实真正牛的是对这个网页的完全包装，验证码等关键要素不变，但是将连接和ajax从页面中抽离出来避免过多的跳转而浪费时间，直接搞一个新的页面布局。
// 不知道我修改cookie用户相关的信息，是否可以保留登录信息，以至于很久不用登陆，从而将网页真正的程序化，获得登录状态的cookie后，其他服务器或者电脑能够登陆吗


function geturllist(){
  // 难道这里的时间算法有问题？为什么凌晨1点登录，动态路由不会变
  dayNum = Math.ceil((new Date() - new Date(new Date().getFullYear().toString())) / (24 * 60 * 60 * 1000)) + 1;
  console.log(dayNum)
  if(day==1){
    var num1 = dayNum - 198
    var num2 = dayNum + 16
    var num3 = dayNum + 595
  }
  else if(day==2) {
    var num1 = dayNum - 199
    var num2 = dayNum + 15
    var num3 = dayNum + 594

  }

  temurl1 = "http://mjyylib.ncst.edu.cn/book/notice/act_id/" + num1 + "/type/4/lib/11"
  temurl2 = "http://mjyylib.ncst.edu.cn/book/notice/act_id/" + num2 + "/type/4/lib/11"
  temurl3 = "http://mjyylib.ncst.edu.cn/book/notice/act_id/" + num3 + "/type/4/lib/11"
  temurl=temurl1
  console.log(temurl1,temurl2,temurl3)
  urllist = new Array(temurl1, temurl2, temurl3)

}
// // 设置cookie在当天指定时间点过期
// function setCookie(name,value,Deadline){
//   // 获取当前日期对象
//   var curDate = new Date();
//   // 获取当前日期对应的时间戳
//   var curTime = curDate.getTime();
//   // 获取指定时间的时间戳
//   var endTime = convertTime(curDate,Deadline);
//   // 计算出指定时间与当前时间的时间差
//   var disTime = endTime - curTime;
//   // 设置cookie过期时间
//   document.setCookie = name + '=' + value + ';expires=' + disTime;
//   console.log("cookie!")
// }

// 获取指定时间的时间戳
// function convertTime(nowDate,Deadline){
//     // 分割参数Deadline
//     var _dateArr = Deadline.split(':');
//     // 分别获取参数中对应的时、分、秒
//     var hours = parseInt(_dateArr[0]);
//     var minutes = parseInt(_dateArr[1]);
//     var seconds = parseInt(_dateArr[2]);
//     // 设置对应时分秒
//     nowDate.setHours(hours);
//     nowDate.setMinutes(minutes);
//     nowDate.setSeconds(seconds);
//     // 获取当前天中指定时分秒对应的毫秒数
//     var result = Date.parse(nowDate);
//     return result;
// }

// 用于实现自动跳转
// 应该写一个函数，如果是今天早少要预约的界面，先判断是不是有cookie，没有cookie刷新一下，才对。这样就避免了页面重复出现验证码的问题。
function logKey(e) {
  num+=1
  setTimeout(function () {
    if(num==4){
      console.log("finish！")
      var tembt=document.getElementsByClassName("ui-dialog-autofocus")[0].click();
      // 执行登录之后进行cookie的状态设定，防止随着页面的刷新出现新的登录弹窗。进行页面的切换
      setTimeout(function () {
        // var temurl1="http://mjyylib.ncst.edu.cn/book/notice/act_id/83/type/4/lib/11"
        window.location = temurl1
      },1600)

    }
  }, 100)
}

function getCookie (name) {
    if (document.cookie.length > 0) {
      var start = document.cookie.indexOf(name + '=')
      if (start !== -1) {
        start = start + name.length + 1
        let end = document.cookie.indexOf(';', start)
        if (end === -1) end = document.cookie.length
        return unescape(document.cookie.substring(start, end))
      }
    }
    return ''
  }
// 用于日期格式化，以后可能用来指定日期预约
// function fix(num, length) {
//   return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
// }

function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}
function closeWin(){
	window.opener=null;
  window.open('','_self');
  window.close();
}
function simulateClick(){
  var test = window.location.href;
  if(test==temurl1){
    console.log("准备进行早上预约")
    // 首先进行验证，防止出现两次验证码
    var cookie=getCookie("userid")
    if(cookie!=""){
      var signUpbt=document.querySelector('#signUp');
      console.log(signUpbt.style.display)
      if(signUpbt.style.display!="none"){
      signUpbt.click();
      var temobject1=document.getElementsByClassName("ui-dialog-button")[0]
      var bt1=temobject1.getElementsByTagName('button')[1]

      bt1.click();}
      // 预约完成之后进行中午的预约

      setTimeout(function () {
        window.location = temurl2
      },210)

    }
    // 如何避免重复刷新呢，就怕用户直接从早上的网址进入（因为用户可能输出错误的验证码，导致页面跳转），导致页面重复刷新，还得进行时间上的判读。关键还是得判断今天到底登没登陆。
    // else{
    //   location.reload();
    // }

  }
  else if(test==temurl2){
    console.log("准备进行中午预约")

    var signUpbt=document.querySelector('#signUp');
    console.log(signUpbt.style.display)
    if(signUpbt.style.display!="none"){
      signUpbt.click();
      var temobject1=document.getElementsByClassName("ui-dialog-button")[0]
      var bt1=temobject1.getElementsByTagName('button')[1]
      bt1.click(); }
      setTimeout(function () {
      window.location = temurl3

      },200)

  }
  else if(test==temurl3){
    console.log("准备进行晚上预约")
    var signUpbt=document.querySelector('#signUp');
    console.log(signUpbt.style.display)
    if(signUpbt.style.display!="none"){
      signUpbt.click();
      var temobject1=document.getElementsByClassName("ui-dialog-button")[0]
      var bt1=temobject1.getElementsByTagName('button')[1]
      bt1.click(); }
      setTimeout(function () {
          closeWin()
      },200)

  }

}

// 下次获取元素 var input=document.querySelector('#input');
$(function () {
  console.log("finish！")
  geturllist()
  // setCookie('logstate','true','24:00:00');
  // 进行cookie的读取，用cookie来判断是否执行下面的操作
  var cookie=getCookie("userid")
  console.log(cookie)
  if(cookie!=""){
    console.log("have")
    // 需要跳转页面
    // var myDate = new Date();
    // var year=myDate.getFullYear();
    // var mon=fix(myDate.getMonth()+1, 2);
    // var day=fix(myDate.getDate()+1, 2);
    // console.log(year,mon,day)
    // var timestr=year+"-"+mon+"-"+day
    // var temurl="http://mjyylib.ncst.edu.cn/home/book/more/lib/11/type/4/day/"+timestr
    // var test = window.location.href;
    // if(test==temurl){
    //   console.log("准备进行预约")
    // }
    // else{
    //   console.log("跳转")
    //   window.location = temurl
    // }
    // 登录之后，进行页面跳转，如果在跳转之后的页面，进行预约操作
    var test = window.location.href;
    // var urllist=new Array("http://mjyylib.ncst.edu.cn/book/notice/act_id/83/type/4/lib/11","http://mjyylib.ncst.edu.cn/book/notice/act_id/297/type/4/lib/11","http://mjyylib.ncst.edu.cn/book/notice/act_id/876/type/4/lib/11")
    var havestate = isInArray(urllist,test)
    if(havestate){
      console.log("不需要跳转")
      // 这个时候开始调用点击预约函数
      simulateClick()
    }
    else{
      console.log("需要跳转")
      // var temurl="http://mjyylib.ncst.edu.cn/book/notice/act_id/83/type/4/lib/11"
      setTimeout(function () {
        window.location = temurl
      }, 100)


    }
  }
  else{
    setTimeout(function () {
      document.getElementsByClassName("login-btn")[0].click();
      //$(".login-btn,.login_click")[0].css("background-color","yellow").trigger("click")
      var temobject1=document.getElementsByClassName("login_username")[0]
      var temobject2=temobject1.getElementsByTagName('input')[0].value=userID
      var temobject3=document.getElementsByClassName("login_pwd")[0]
      var temobject4=temobject3.getElementsByTagName('input')[0].value=password
      var temobject5=document.getElementsByClassName("login_check")[0]
      var temobject6=temobject5.getElementsByTagName('input')[0]
      // temobject6.onchange=function(){
      // 	console.log("变化了");
      // }
      temobject6.focus()
      temobject6.addEventListener('keydown', logKey);

    }, 100)
  }

})