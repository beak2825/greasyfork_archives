// ==UserScript==
// @name         Scrapy EMail
// @namespace    https://vkk.im/
// @version      3.4
// @description  利用google抓取终端客户的真实邮箱地址
// @author       Mr.Du
// @run-at       document-start
// @match        http*://www.google.*/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://fastly.jsdelivr.net/gh/hzdu/alberton_xyz@df9b677df150c6b7053742bf078098f56d0816aa/jquery.quickfill.js
// @grant        unsafeWindow
// @license Apache License 2.0
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_setClipboard
// @grant GM_getClipboard
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/446857/Scrapy%20EMail.user.js
// @updateURL https://update.greasyfork.org/scripts/446857/Scrapy%20EMail.meta.js
// ==/UserScript==

//History:
//v3.4: 
//1.修正首页不会自动提交的BUG
//2.添加了抓取后自动复制到系统剪切板的功能，方便黏贴
//v3.3: 
//1.做了几次打的修改都没有写记录，有些记不住了，3.3版本开始写更新记录
//2.添加了对iframe的判断，防止在非Google的网站上使用Google验证码的时候脚本被执行

'use strict';
var $ = $ || window.$;

// 删除数组中的重复元素
function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (array .indexOf(arr[i]) === -1) {
            array .push(arr[i])
        }
    }
    return array;
}

function loadcss(){
  let headcss = $(`
    <style>
      #mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      background: #666;
      opacity: 0.5;
      filter: alpha(opacity=50)-moz-opacity: 0.5;
      display: none;
      }
      .popup {
      position: absolute;
      left: 50%;
      width: 600px;
      height: 450px;
      background: #fff;
      z-index: 1000;
      border: 1px solid #333;
      display: none;
      }
      .btn_close {
      position: absolute;
      top: 5px;
      right: 5px;
      }
      #myemail{
        width:100%;
        height:100%;
      }
      .createsearch_btn, .getemails_btn, .emailtype, .websitelist, .keywordinp{
        width:120px;
        height:30px;
        line-height:30px;
        font-size:0.5rem;
        background-color: #4CAF50;
        cursor:pointer;
      }
      .emailtype, .websitelist{
        background-color: #FFF;
      }
      .keywordinp{
        border:0px;
        width:300px;
        background-color:#FFFFCC;
        border-bottom:1px #4CAF50 solid;
      }
      .keywordinp:focus {//获取焦点
        border:None;
        outline: None;
        border-bottom:1px #ea4335 solid;
      }
     </style>
  `)
  $("head").append(headcss);
}

function maskhtml(){
  let divhtml = $(`
    <div id="mask"></div>
    <div class="popup">
      <textarea id="myemail"></textarea>
    <button class="btn_close">x</button>
    </div>
  `)
  $("body").append(divhtml);
}

function loadEvent(){
  let btnhtml = $(`
    <select name="emailtype" class="emailtype">
      <option value="gmail.com" selected>Gmail</option>
      <option value="outlook.com">Outlook</option>
      <option value="hotmail.com">Hotmail</option>
      <option value="yahoo.com">Yahoo</option>
    </select>
    <select name="websitelist" class="websitelist">
      <option value="facebook.com" selected>Facebook</option>
      <option value="instagram.com">Instagram</option>
      <option value="quora.com">Quora</option>
      <option value="twitter.com">Twitter</option>
      <option value="amazon.com">Amazon</option>
      <option value="poshmark.com">Poshmark</option>
    </select>
    <input type="text" placeholder="关键词,填姓可以直接搜出很多终端用户的邮箱" class="keywordinp" id="i-d" />
    <button class="createsearch_btn">① Create search</button>
    <button class="getemails_btn">② Scrapy</button>
  `);
   
  let controlbar = $(`
    <div id="controlpanel" style="width:100%; height:35px; background:#FAFAFA;"></div>
  `)
  
  $("body").prepend(controlbar);
  $("#hdtb").prepend(controlbar);
  $("#controlpanel").append(btnhtml);
  
  maskhtml();
  
  $('.getemails_btn').click(function() {
    $("#myemail").val('');
    
    $('#mask').css({
      display: 'block',
      height: $(document).height()
    })
    var $Popup = $('.popup');
      $Popup.css({
      left: ($('body').width() - $Popup.width()) / 2+ 'px',
      top: ($(window).height() - $Popup.height()) / 2 + $(window).scrollTop() + 'px',
      display: 'block'
    })
    
    // 获取电子邮件列表
    var emails = $('#search').text();
    var regEmail = /(\w)+(\w|\-|\.)+@[\w]+\.[\w]{2,3}/g;
    var email = emails.match(regEmail);
    email = unique(email);
    // $("#myemail").val('共找到'+email.length+'条电子邮件地址');
    for (let index=0; index < email.length; index++) {
      var els = email[index];
      if($("#myemail").val().length === 0){
        $("#myemail").val(els);
      }else{
        $("#myemail").val($("#myemail").val() + "\n" + els);
      }
    }
    GM_setClipboard($("#myemail").val());
  })
  
  $(".createsearch_btn").click(function(){
    if($(".keywordinp").val().length==0){
      alert("关键词不允许为空");
      $(".keywordinp").focus();
      return;
    }
    $("input[name='q']").val('site:'+$(".websitelist").val()+' '+$(".keywordinp").val()+' "@'+$(".emailtype").val()+'"');
    if($("input[name='btnK']").length >0){
      $("input[name='btnK']").click();
    }else if($("button[type='submit']").length >0){
      $("button[type='submit']").click();
    }else{
      alert("程序找不到查询按钮，请手动点击查询");
    }
  })
  
  $(".keywordinp").keyup(function(event){  
    if(event.keyCode ==13){  
     $(".createsearch_btn").click();
    }  
  });
  
  $('.btn_close').click(function() {
    $('#mask,.popup').css('display', 'none');
  })
  
  $(".keywordinp").blur(function(){
    $(".x-l-1").hide();
  })
  
  // $(".keywordinp").quickfill(["昨天","今天", "明天", "大后天"]);
  
}


if (self != top) {
  return;
}
else{
  $(function(){
    console.clear();
    console.log("%c Scrapy EMail %c Copyright \xa9 2015-%s %s", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:64px;color:#6495ed;-webkit-text-fill-color:#6495ed;-webkit-text-stroke: 1px #6495ed;', "font-size:12px;color:#6495ed;", new Date().getFullYear(), "\n" + "Author:Mr.Du Website:https://vkk.im");
    console.log("[Scrapy EMail]: 利用Google获取终端客户的真实邮件地址");
    loadcss();
    loadEvent();
  })
}

// setTimeout(function(){

// } ,1000)//隔5秒之后执行