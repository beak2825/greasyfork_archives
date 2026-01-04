// ==UserScript==
// @name         抖音弹幕关键词屏蔽
// @namespace    抖音弹幕关键词屏蔽
// @version      2.6
// @description  去除抖音不想看的弹幕
// @author       食翔狂魔
// @match        *douyin.com/*
// @include      *douyin.com/*
// @grant        none
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477419/%E6%8A%96%E9%9F%B3%E5%BC%B9%E5%B9%95%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/477419/%E6%8A%96%E9%9F%B3%E5%BC%B9%E5%B9%95%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
  //'use strict';
  var count = 0;
  top.delDm = function () {
    let keyword = localStorage.getItem("keyword");
    if (!keyword) {
      return;
    }
    let restr = new RegExp(`(${JSON.parse(keyword).join('|')})`, "g");
    let c1 = document.querySelectorAll(".xgplayer-danmu div")
    //let c2 = document.querySelectorAll(".webcast-chatroom___item")
    let c = [...c1];
    for (let i = 0; i < c.length; i++) {
      let d = c[i];
      if (restr.test(d?.innerText)) {
        console.log("检测到屏蔽词，已删除：" + d.innerText + "！");
        c[i].remove();
      }
    }
  }
  top.startDealDm = function () {
    top.ivlId = setInterval(() => {
      let str = `狂魔提示：脚本已执行${count++}次！`;
      $("#tip").text(str);
      console.log(str);
      top.delDm();
    }, 300)
  }
  top.startDealDm();
  //window.onload = function(){
  var $div = $(`
      <div id="bigbox" style="z-index:10022;position:fixed;top:100px;right:20px;padding:10px;background:aliceblue">
        <div class="">
          <div class="jsname">
            <span>抖音弹幕关键词屏蔽2.5</span>
          </div>
          <div class="jsname" style="font-size: 10px;">
            <span>按下Ctrl+B控制此浮窗显隐</span>
          </div>
          <div style="margin-top:10px;">
            请输入要屏蔽的词(多个用英文逗号隔开)：
          </div>
          <div style="margin-top: 5px;">
            <textarea id="dmNr" rows="5" placeholder="请输入屏蔽词" />
          </div>
          <div class="jsdiv" id="jsdiv1" style="padding:5px;text-align:center;">
            <span class="sure" id="sure">确定</span>
          </div>
          
          <div class="box">
            <div style="padding:0px;background: aquamarine;width:fit-content;">
              <span>有问题请联系食翔狂魔反馈</span>
            </div>
          </div>
          <div class="box">
            <span id="tip"></span>
          </div>
        </div>
      </div>
    `);

  var $style = `
      <style type="text/css">
      .jsdiv:{
        background: aqua;
        display:flex;
        justify-content: center;
        align-items: center;
        margin-top:10px;
      }
      .box{
        display:flex;
        justify-content: center;
        align-items: center;
        width:100%;
        margin-top:10px;
      }
      .sure{
        color: #fff;
        background-color: #2d8cf0;
        border-color: #2d8cf0;
        padding: 4px 8px;
        font-size: 12px;
        margin-top:10px;
      }
      .sure:hover {
        color: #fff;
        background-color: #57a3f3;
        border-color: #57a3f3;
        cursor: pointer;
      }
      #dmNr{
        width:100%;
      }
      .jsname{
        text-align:center;
        width:100%;
        color:red;
        font-weight:bold;
      }
      #tip{
        font-size:11px;
      }
      </style>
    `


  $('body').append($div);
  $('head').append($style);
  console.log("注入元素和样式！");
  let keyword = localStorage.getItem("keyword");
  let isshowdy = localStorage.getItem("isshowdy");
  if (isshowdy == "show" || isshowdy == null) {
    $("#bigbox").css("display", "block");
  } else {
    $("#bigbox").css("display", "none");
  }
  if (keyword) {
    let arr = JSON.parse(keyword);
    $("#dmNr").val(arr.join(","));
  }
  $("#sure").click(function () {
    let val = $("#dmNr").val();
    if (val) {
      localStorage.setItem("keyword", JSON.stringify(val.split(",")));
    }
    console.log(localStorage.getItem("keyword"));
  })
  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && (event.key === 'b' || event.code === 'KeyB')) {
      if ($("#bigbox").css("display") == "none") {
        $("#bigbox").css("display", "block");
        localStorage.setItem("isshowdy", "show");
      } else {
        $("#bigbox").css("display", "none");
        localStorage.setItem("isshowdy", "none");
      }
    }
  });
}) ();