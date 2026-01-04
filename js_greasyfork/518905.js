// ==UserScript==
// @name        食安共治
// @namespace   Violentmonkey Scripts
// @match       https://sagz.hnocc.com/trainingServiceInfo*
// @grant       none
// @version     2
// @author      -
// @description 2024/11/26 11:27:20
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518905/%E9%A3%9F%E5%AE%89%E5%85%B1%E6%B2%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/518905/%E9%A3%9F%E5%AE%89%E5%85%B1%E6%B2%BB.meta.js
// ==/UserScript==
(function() {
    'use strict';
setInterval(()=>{ var v=document.querySelector("video");if(v){v.muted=true;v.playbackRate=10;v.play();}},3000)      //自动播放10倍速

 //  setInterval(()=>{

         // if(document.querySelector("div.el-progress__text").innerText != '100%'){document.querySelector("button.el-button.mr20.el-button--success.el-button--medium").click()}
   //        var yxw = document.querySelectorAll("span.study_Type.pass")   //已学完
   //        var wxw = document.querySelectorAll("span.study_Type.nerver") //未学完
   //        var kc  = document.querySelectorAll("div.line")          //所有课程数量
    //       if(kc[i].getElementsByClassName('study_Type')[0].innerText == '已学习'){i++;kc[i].click()}

    //       },500)


setInterval(()=>{
          var pj = document.querySelector("div.wrap")
          var pj1 = document.querySelectorAll("img.el-image__inner")[4]
          var pj2 = document.querySelectorAll("i.el-rate__icon.el-icon-star-off")[4]
          var pj3 = document.querySelector("button.el-button.submit.el-button--error.el-button--medium")  //提交评价
          if(pj1){pj1.click()}
          if(pj2){pj2.click()}
          if(pj3){pj3.click()}
          var wc = document.querySelector("div.el-message-box__content")
          var qd = document.querySelector("button.el-button.el-button--default.el-button--small.el-button--primary")  //确定
          var fh = document.querySelector("#app > div > div.sidebar-container.has-logo > div > div.scrollbar-wrapper.el-scrollbar__wrap > div > ul > div:nth-child(1) > a > li > span")  //返回个人中心
          if(wc){fh.click();qd.click();}

   },5000)
     // try{
  var ii=0;

  setInterval(()=>{
  var zj = document.querySelectorAll("div.el-collapse-item")  //章节 course_title flex flex-row-between
  var zjkc = zj[ii].getElementsByClassName('study_Type') //章节内课程
  var a = zjkc.length-1
 // var i=0;
  if(zjkc[a].innerText == '已学习'){ii++;zj[ii].getElementsByClassName('course_title flex flex-row-between')[0].click();}//切换章节
   // else{
  var zjkc1 = zj[ii].getElementsByClassName('study_Type') //章节内课程
  for(let i = 0;i <100;i++){if(zjkc1[i].innerText != '已学习'){zjkc1[i].click();break}  }

 //  if(zjkc1[i].innerText == '已学习'){i++;zjkc1[i].click()}

//}


  },2000)
     // } catch(err) {}
})();
