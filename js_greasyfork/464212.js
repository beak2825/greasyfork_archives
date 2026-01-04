

// ==UserScript==
// @name         重庆干部网络学院秒看视频、自动提交等。
// @namespace    zzy
// @version      0.9
// @description  重庆干部网络学院秒看视频
// @author       zzy
// @match        *cqgj.12371.gov.cn/*
// @icon         https://cqgj.12371.gov.cn/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464212/%E9%87%8D%E5%BA%86%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E7%A7%92%E7%9C%8B%E8%A7%86%E9%A2%91%E3%80%81%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E7%AD%89%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/464212/%E9%87%8D%E5%BA%86%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E7%A7%92%E7%9C%8B%E8%A7%86%E9%A2%91%E3%80%81%E8%87%AA%E5%8A%A8%E6%8F%90%E4%BA%A4%E7%AD%89%E3%80%82.meta.js
// ==/UserScript==
 
(function() {
  //'use strict';
window.onload = function(){
  function getUrlParams(pa) {
    // 通过 ? 分割获取后面的参数字符串
    let urlStr = window.location.href.split('?')[1]
    // 创建空对象存储参数
    let obj = {};
    // 再通过 & 将每一个参数单独分割出来
    let paramsArr = urlStr.split('&')
    for(let i = 0,len = paramsArr.length;i < len;i++){
      // 再通过 = 将每一个参数分割为 key:value 的形式
      let arr = paramsArr[i].split('=')
      obj[arr[0]] = arr[1];
    }
    return obj[pa]
  }
  window.getData = function(t, e, a,f) {
    var data = "string" != $.type(a) || $.isEmptyObject(a) ? "object" != $.type(a) || $.isEmptyObject(a) ? null : $.param(a) : a;
    $.ajax({
      url: t,
      type: e,
      timeout: 1e4,
      headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      data: data,
      success:f
    })
  }
  var tag = true;
  
  var jd = 0;
  
  
  var video
  var z
  var space
  var cur
  
  window.resub = function(obj){
    if(tag){
      console.log("开始提交");
      window.getData("/api/CourseProcess/SingleProcess","POST", obj,function(res){
        console.log(res);
        if(res.Content == "记录成功！"){
          jd = res.BrowseScore;
          if(jd>=100){
            jd = 100;
            tag = false;
            $("#tips")[0].innerText=`记录成功！当前进度：${jd}%,已完成。`;
          }else{
            $("#tips")[0].innerText=`记录成功！当前进度：${jd}%`;
          }
          window.getData("/api/Home/PlayJwplay","POST", {courseid: Number(getUrlParams("Id"))},function(res){
            
            if(res.Data.LastPostion !=0 ){
              cur = res.Data.LastPostion;
            }else{
              cur = cur + space;
            }
            obj["positionen"] = Math.ceil(cur+space).toString().rsaEnscrypt()
            setTimeout(() => {
              window.resub(obj)
            }, 2000);
          })
  
        }else{
          tag = false;
          $("#tips")[0].innerText=`记录失败！请重新点击开始。`;
        }
      })
    }
  }
  window.startSub = function(){
    var userid="";
    var courseid="";
    var PortalId="";
    var tk={};
    video = $("video")[0];
    z = video.duration;
    space = video.duration/10;
    cur = video.currentTime;
    window.getData("/api/Page/CourseContent","POST", {Id: getUrlParams("Id"), titleNav: '课程详情'},function(res){
      jd = res.Data.CourseModel.BrowseScore;
      $("#tips")[0].innerText=`记录成功！当前进度：${jd}%`;
    })
    window.getData("/api/Page/AntiForgeryToken","POST", {},function(res){
      $("body").append('<div class="preventorgery"></div>'),
      $(".preventorgery").html(res.html);
      var e = $(".preventorgery input").val(), t = $(".preventorgery input").attr("name");
      $("div.preventorgery").remove();
      tk[t] = e;
    })
    window.getData("/api/Home/PlayJwplay","POST", {courseid: Number(getUrlParams("Id"))},function(res){
      console.log(res);
      PortalId = res.Data.PortalId;
      courseid = res.Data.CourseId;
      userid = res.Data.UserId;
      cur = res.Data.LastPostion;
    })
    setTimeout(()=>{
      let obj = {
        PortalId:PortalId,
        courseid:courseid,
        positionen:Math.ceil(cur+space).toString().rsaEnscrypt(),
        userid:userid,
        __RequestVerificationToken:tk["__RequestVerificationToken"]
      }
      window.resub(obj);
    },2000)
  }
  var $div=$(`
  <div style="z-index:10022;position:fixed;top:50px;right:20px;padding:10px;background:aliceblue">
  <div class="jsdiv" id="jsdiv1" style="padding:5px;text-align: center;">
    <span>开始</span>
  </div>
  <div style="width:200px;">
  <span>提示：</span><span id="tips" style="color:red;"></span>
  </div>
  <div style="margin-top: 15px;text-align: end;">
    <span>有问题请反馈@zzy</span>
  </div>
  </div>
  
  
  `);
  
  var $style=`
        <style type="text/css">
        .jsdiv:{
          background: #e4f2ff;
        }
        .jsdiv:hover{
          background:#fff;
          cursor: pointer;
        }
        </style>
      `
  $('body').append($div);
  $('head').append($style);
  var jsdiv1 = document.getElementById("jsdiv1");
  var jsdiv2 = document.getElementById("jsdiv2");
  jsdiv1.addEventListener("click",function(){
    window.startSub();
  })

}
})();