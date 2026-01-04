// ==UserScript==
// @name         4.直播简化
// @namespace    td
// @version      2.1.6
// @description  yj1211助手
// @author       ch
// @run-at document-body
// @grant       GM_addStyle
// @match        *://*.yj1211.work/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/461442/4%E7%9B%B4%E6%92%AD%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461442/4%E7%9B%B4%E6%92%AD%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  if( new RegExp("live.yj1211.work/index/liveRoom").test(window.location.href)){
    
      var mask = document.createElement("div");
      mask.classList.add("masking");
      mask.innerHTML = "加载中";
      document.body.appendChild(mask);
      GM_addStyle(
        ".masking{top: 0;left: 0;background: black;width: 100vw;height: 100vh;position: absolute;z-index: 9999999; line-height: 100vh;font-size: 2.5vw;color: white;text-align: center;}"
      );
    }


  setTimeout(() => {
    if (document.querySelector(".masking")) {
      setTimeout(() => {
        document.querySelector(".masking").remove();
      }, 350);
      clearInterval(maskClearInt);
      maskClearInt = null;
    }
  }, 10000);
  let maskClearInt = setInterval(() => {
    console.log(777)
    if (document.getElementsByTagName("video")[0]) {
      if (
        document.getElementsByTagName("video")[0].currentTime > 0 &&
        document.getElementsByTagName("video")[0].paused == false 
      ) {
        if (document.querySelector(".masking")) {
          setTimeout(() => {
            document.querySelector(".masking").remove();
          }, 350);
          clearInterval(maskClearInt);
          maskClearInt = null;
        }
      }
    }
    if(document.querySelector(".room-left-video-notLive")){
      if (document.querySelector(".masking")) {
        setTimeout(() => {
          document.querySelector(".masking").remove();
        }, 350);
        clearInterval(maskClearInt);
        maskClearInt = null;
      }
      

    }
  }, 100);

  GM_addStyle(".room-right{display:none;}");
  GM_addStyle(".room-left-info{display:none;}");
  GM_addStyle(
    ".room-left-video{width:100vw !important; height:100vh !important;}"
  );
  GM_addStyle(
    ".room-left-video-notLive{width:100vw !important; height:100vh !important;}"
  );

  GM_addStyle(".item_active{background:black !important; color:red; }");

  window.onload = () => {
    setTimeout(() => {
      if (document.body.classList[0] == "el-popup-parent--hidden") {
        document.getElementsByClassName("el-button--primary")[3].click();
      }
    }, 1000);
  };
  var num = 5;
  console.log("yj1211");
  var lhref = window.location.href;
  var Cla = {};
  var alert = function () {
    return 1;
  };
  var confirm = function () {
    return 1;
  };
  var prompt = function () {
    return 1;
  };
  var peertitle = "";
  var peerid = 0;
  var reflesh = 30 * 60; //刷新间隔秒
  function UrlChange() {
    window.setInterval(function () {
      var lhref1 = window.location.href;

      if (lhref1 != lhref) {
        lhref = lhref1;

        location.reload();
      }
    }, 500);
  }

  UrlChange();
  var word = "测试";
  var time = 10; //时间间隔秒
  function videoPage() {
    //视频界面

    if (
      !location.href.includes("/home/recommend") &&
      !location.href.includes("/index/home/")
    )
      return;

    let css = `

     .divpoint .el-card__body{color: #e90c0c ; }

       .divpoint{transform: scale(1.2);}

       .platform-room-list{top:10px !important;}

    `;

    GM_addStyle(css);

    window.setInterval(function () {
      if ($(".home-aside").length > 0) {
        $(".home-aside").remove();
      }
      if ($("header").length > 0) {
        $("header").remove();
      }
      if ($(".area-types").length > 0) {
        $(".area-types").remove();
      }
      if ($(".platform-room-name").length > 0) {
        $(".platform-room-name").remove();
      }
      if ($("div.recommend-big-word").length > 0) {
        $("div.recommend-big-word").remove();
      }
      if ($(".el-switch").length > 0) {
        $(".el-switch").remove();
      }
      if ($("#count-down").length > 0) {
        $("#count-down").click();
      }
      if ($(".areaAll-room-name").length > 0) {
        $(".areaAll-room-name").remove();
      }
      if (
        $(".icon-danmukaiqi").length > 0 &&
        $(".art-control-control9").attr("ts") != 1
      ) {
        $(".art-control-control9").click();

        $(".art-control-control9").attr("ts", 1);
      }
      if (
        $(".icon-danmukaiqi").length > 0 &&
        $(".art-control-control9").attr("ts") != 1
      ) {
        $(".art-control-control9").click();

        $(".art-control-control9").attr("ts", 1);
      }
      if (
        $(".art-icon-fullscreenWebOn").length > 0 &&
        $(".art-control-fullscreenWeb").attr("ts") != 1
      ) {
        $(".art-control-fullscreenWeb").click();

        $(".art-control-fullscreenWeb").attr("ts", 1);
      }
      if ($(".divpoint").length == 0)
        $(".recommend-room-col:first").addClass("divpoint");

      $(".container-xl>.row-cards>div").not(":first").remove();
    }, 0.2 * 1000);
  }

  function playPage() {
    //视频界面

    if (!location.href.includes("/index/liveRoom")) return;

    let css = `
     .divpoint .el-card__body{color: #e90c0c ; }
       .divpoint{transform: scale(1.2);}
       .platform-room-list{top:10px !important;}
       .room-right{top:5px !important;}


    `;

    GM_addStyle(css);
    window.setInterval(function () {
      if ($(".home-aside").length > 0) {
        $(".home-aside").remove();
      }
      if ($("header").length > 0) {
        $("header").remove();
      }
      if ($(".area-types").length > 0) {
        $(".area-types").remove();
      }
      if ($(".platform-room-name").length > 0) {
        $(".platform-room-name").remove();
      }
      if ($("div.recommend-big-word").length > 0) {
        $("div.recommend-big-word").remove();
      }
      if ($(".el-switch").length > 0) {
        $(".el-switch").remove();
      }
      if ($("#count-down").length > 0) {
        $("#count-down").click();
      }
      if ($(".areaAll-room-name").length > 0) {
        $(".areaAll-room-name").remove();
      }
      if ($(".room-left-info-right").length > 0) {
        $(".room-left-info-right").remove();
      }
      if (
        $(".icon-danmukaiqi").length > 0 &&
        $(".art-control-control9").attr("ts") != 1
      ) {
        $(".art-control-control9").click();

        $(".art-control-control9").attr("ts", 1);
      }

      //if ($('.art-icon-fullscreenWebOn').length > 0 && $('.art-control-fullscreenWeb').attr('ts') != 1) {

      //    $('.art-control-fullscreenWeb').click();

      //    $('.art-control-fullscreenWeb').attr('ts', 1);

      //}
    }, 0.2 * 1000);
  }

  function getnum() {
    var top = $(".recommend-room-col:eq(0)").offset().top;

    $(".recommend-room-col").each(function (index, element) {
      var ttop = $(this).offset().top;

      if (ttop - top > 50) {
        num = index + 1;

        return false;
      }
    });
  }

  function getsroll() {
    var th = $(".divpoint").offset().top;

    var th1 = $(".divpoint").height();

    var whg = $(window).height();

    if (th < 0) {
      $("#home-main").scrollTop(
        $("#home-main").scrollTop() - Math.abs(th) - th1
      );
    }

    if (whg - th < 0) {
      $("#home-main").scrollTop(
        $("#home-main").scrollTop() + whg / 2 + Math.abs(whg - th) + 2 * th1
      );
    }
  }

  function getnode(type) {
    var ncur;

    //getnum();

    var cindex = $(".divpoint").index();

    if (type == 1) {
      //上
      if (cindex - num >= -1)
        ncur = $(".recommend-room-col").eq(cindex - num + 1);
      else return;
    }
    if (type == 2) {
      //下
      if (cindex + num - 2 < $(".recommend-room-col").length)
        ncur = $(".recommend-room-col").eq(cindex + num - 1);
      else return;
    }
    if (type == 3) {
      if ($(".divpoint").prev().length > 0) ncur = $(".divpoint").prev();
    }
    if (type == 4) {
      if ($(".divpoint").next().length > 0) ncur = $(".divpoint").next();
    }
    if (ncur.length > 0 && ncur.hasClass("recommend-room-col")) {
      $(".divpoint").removeClass("divpoint");

      ncur.addClass("divpoint");
    }

    getsroll();
  }

  function menuCreate() {
    let menuItemOne = ["回到小太阳", "下一个直播", "弹幕"];
    let menuItemTwo = ["其他直播"];

    let menu = document.createElement("div");
    menu.classList.add("menu-box");

    for (const item of menuItemOne) {
      let concern = document.createElement("a");

      concern.classList.add("item");

      concern.innerHTML = item;
      menu.appendChild(concern);
    }

    let lineTwo = document.createElement("div");
    lineTwo.classList.add("line_two");

    for (const item of menuItemTwo) {
      let concern = document.createElement("a");

      concern.classList.add("item");

      concern.innerHTML = item;
      lineTwo.appendChild(concern);
    }
    menu.appendChild(lineTwo);

    document.body.appendChild(menu);
    document.getElementsByClassName("menu-box")[0].style.display = "none";

    GM_addStyle(
      ".menu-box{ display:flex; position: fixed;z-index: 99;font-size: 36px;top: 70%;left: 50%;  padding:20px;transform: translateX(-50%);}"
    );
    GM_addStyle(".concern{   background:#25252b; color: black;}");
    GM_addStyle(".item{background:white; width: fit-content;height: 4vh;font-size: 1.5vw;padding: 3px 10px;line-height: 2vh;border-radius: 5px;border: none; margin-left:1vw;}");
    GM_addStyle(".line_two{  margin-top:2vh;}");
  }

  function isMenuBlock() {
    if (new RegExp("live.yj1211").test(window.location.href)) {
      if (
        document
          .getElementsByClassName("art-control-fullscreen")[0]
          .getAttribute("aria-label") == "退出全屏"
      ) {
      }

      if (document.getElementsByClassName("menu-box")[0]) {
        if (
          document.getElementsByClassName("menu-box")[0].style.display == "block"
        ) {
          document.getElementsByClassName("menu-box")[0].style.display = "none";
        } else {
          document.getElementsByClassName("menu-box")[0].style.display = "block";
        }
      } else {
      }
    }
  }

  let menuIndex = 0;
  function showCurrentItem() {
    const btnList = document.querySelectorAll(".menu-box .item");

    for (const item of btnList) {
      item.classList.remove("item_active");
    }
    btnList[menuIndex].classList.add("item_active");
  }

  let isArrowUp = false;

  document.body.addEventListener(
    "keydown",
    (event) => event.stopImmediatePropagation(),
    true
  )

  window.onkeyup = () => {
    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    var doc = document.querySelector(".menu-box");

    if ($(".divpoint").length == 0) {
      $(".el-card__body:first").addClass("divpoint");
    }

    if (code == 38 && isArrowUp) {
      if (doc.style.display !== "block") {
        window.location.href = "http://sun.20001027.com/";
        clearInterval(interval);
      }
    }
    if (code == 38 && doc.style.display == "block") {
      if (menuIndex < 3) {
        doc.style.display = "none";
      } else {
        menuIndex = 0;
        showCurrentItem();
      }
      return;
    }

    if (code == 38) {
      //向上

      let i = 0;
      var interval = setInterval(() => {
        if (i < 2) {
          if (doc.style.display !== "block") isArrowUp = true;
        } else {
          isArrowUp = false;
          getnode(1);
          isMenuBlock();
          document.onkeydown = null;
          clearInterval(interval);
          interval = null;
        }
        i++;
      }, 350);

      return false;
    }
    if (code == 40) {
      if (doc.style.display == "block") {
        menuIndex = 3;
        showCurrentItem();
      }
      // getnode(2);
      return false;
    }
    if (code == 37) {
      //向下
      // getnode(3);

      if (doc.style.display == "none") {
        document.querySelector(".art-control.art-control-control9").click();
      } else {
        if (menuIndex > 0) menuIndex--;
        showCurrentItem();
      }

      return false;
    }
    if (code == 39) {
      //向下
      // getnode(4);
      if (doc.style.display == "none") {
      } else {
        if (menuIndex < 3) menuIndex++;
        showCurrentItem();
      }
      return false;
    }
    if (code == 13) {
      // //向下
      // if ($(".divpoint").length > 0) $(".divpoint a")[0].click();

      if (doc.style.display == "block") {
        switch (menuIndex) {
          case 0:
            window.location.href = "https://sun.20001027.com/";
            break;
          case 1:
            break;
          case 2:
            document.querySelector(".art-control.art-control-control9").click();

            break;
          case 3:
            break;

          default:
            break;
        }
      }
      return false;
    }
  };

  playPage();
  videoPage();
  menuCreate();
  showCurrentItem();
})();

//http://live.yj1211.work/index/home/huya

//http://live.yj1211.work/

//http://live.yj1211.work/index/home/areasAll?typeName=%E6%89%8B%E6%B8%B8%E4%BC%91%E9%97%B2&areaName=%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80
