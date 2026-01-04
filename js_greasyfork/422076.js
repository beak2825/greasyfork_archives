// ==UserScript==
// @name         虎牙直播插件合集
// @namespace    http://tampermonkey.net/
// @version      0.634
// @description  免登录=>更改虎牙弹幕大小，屏蔽弹幕，精简，自动切换最高清晰度。 作者拿来看武林外传用的，用来专心看直播
// @author       饺子
// @include      https://www.huya.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_listValues

// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/422076/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%8F%92%E4%BB%B6%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/422076/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%8F%92%E4%BB%B6%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

(function () {
  "use strict";
  //------初始数据------
  let keywords = GM_getValue("keywords") || ["♥", "/{", "msstatic"];
  let danmuSize = GM_getValue("danmuSize") || 50;
  //------结束初始------

  //-------开关合集------
  // let isTipsOrChart = GM_getValue("isTipsOrChart") || true;
  // let isChatHostPic = GM_getValue("isChatHostPic") || true;
  //------结束开关合集-------

  //------虎牙精简 来自：G-uang------
  let css = "{display:none !important;height:0 !important}";

  css += "#J_roomWeeklyRankList{display:none !important;}";
  css += "#wrap-income > iframe{display:none !important;}";
  css += "#chatRoom{height:50% !important;}";
  css += "#chatRoom > div{height:100% !important;}";
  css += ".room-footer{display:none !important;}";
  css += "#J-room-chat-color{display:none !important;}";
  css += "#share-entrance{display:none !important;}";
  css += "#J_hySide{display:none !important;}";
  css += "#hy-nav-download{display:none !important;}";
  // css += "#player-gift-wrap{display:none !important;}";
  css += ".gift-info-wrap{display:none !important;}";
  css += "#wrap-notice{display:none !important;}";
  css += "#J_roomGgTop{display:none !important;}";
  css += "#J_adCategory{display:none !important;}";
  css += "#avatar-img{display:none !important;}";
  css += "#banner-ab{display:none !important;}";
  css +=
    "#huya-ab > div.banner-ab-warp > div.ab-close-btn:last-child{display:none !important;}";
  css +=
    "#chat-room__list > li.J_msg:first-child > p{display:none !important;}";
  css +=
    "#duya-header > div.duya-header-wrap.clearfix > div.duya-header-bd.clearfix > div.duya-header-ad:last-child > a.duya-header-ad-link.j_duya-header-ad > img.duya-header-ad-img{display:none !important;}";
  css +=
    "#main_col > div.room-backToTop.j_room-backToTop:last-child{display:none !important;}";
  css +=
    "#J_playerMain > div.room-player-gift-placeholder:first-child{display:none !important;}";
  css +=
    "#J_roomHeader > div.room-hd-r:last-child > div.host-control.J_roomHdCtrl > div.jump-to-phone:nth-child(4){display:none !important;}";
  css += "#matchMain > div.diy-comps-wrap{display:none !important;}";
  css += "#J_spbg{display:none !important;}";
  css += "#chatRoom > div.room-gg-chat:last-child{display:none !important;}";
  css += "#player-resource-wrap{display:none !important;}";
  css += "#J_mainRoom > div.box-crumb:first-child{display:none !important;}";
  css +=
    "#wrap-ext > div.popup-44f9e031 > section > iframe{display:none !important;}";
  css +=
    "#J_roomHeader > div.room-hd-r:last-child > div.host-control.J_roomHdCtrl > div.room-business-game:last-child > a.game--3vukE-yU-mjmYLSnLDfHYm{display:none !important;}";
  css +=
    "#player-ext-wrap > div.popup-44f9e031 > section > iframe{display:none !important;}";
  css +=
    "#player-ctrl-wrap > div.player-app-qrcode:nth-child(4){display:none !important;}";
  css += "#gift-show-btn{display:none !important;}";
  // if (!isTipsOrChart)
  //   css +=
  //     "#tipsOrchat > div.chat-room__ft > div.chat-room__ft__chat:last-child{display:none !important;}"; //弹幕文字输入框
  // if (!isChatHostPic) css += "#chatHostPic{display:none !important;}"; //粉丝徽章

  loadStyle(css);
  function loadStyle(css) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.rel = "stylesheet";
    style.appendChild(document.createTextNode(css));
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
  }

  // //m开关弹幕
  // var selector = {
  //   "www.huya.com": {
  //     on: "div[class='danmu-show-btn'][title='关闭弹幕']",
  //     off: "div[class='danmu-show-btn danmu-hide-btn'][title='开启弹幕']",
  //   },
  // };
  // var live_site = document.domain;
  // function danmaku_switcher(player) {
  //   if (document.querySelector(player.on) != null) {
  //     document.querySelector(player.on).click();
  //   } else if (document.querySelector(player.off) != null) {
  //     document.querySelector(player.off).click();
  //   }
  // }
  // $(document).keypress(function (key) {
  //   if (key.which === 77 || key.which === 109) {
  //     danmaku_switcher(selector[live_site]);
  //   }
  // });

  //自动切换最高画质（原作者CosilC，如有疑问联系我删除）
  $(function () {
    var t1 = setInterval(function () {
      console.log("自动切换最高画质检查器在运行");
      if (
        $(".player-videotype-cur").html() !=
        $(".player-videotype-list li:first").html()
      ) {
        $(".player-videotype-list li:first").click();
        var watch = setInterval(function () {
          if ($("#player-btn")[0].title === "开始观看") {
            $("#player-btn").click();
            $("#player-community-contaier").remove();
            clearInterval(watch);
          }
        }, 1000);
      } else {
        clearInterval(t1);
      }
    }, 2000);
  });

  //---精简所有remove---
  var giftWrap = setInterval(function () {
    if ($("#player-gift-wrap").children().length >= 1){
      $("#player-gift-wrap").children().hide(); //隐藏礼品栏里所有的子item
      $("#player-gift-wrap").css(
        "background-color",
        $("body").css("background-color")
      );
      clearInterval(giftWrap)
    }
  },1000);
  //---结束精简所有remove---
  //------结束虎牙精简------

  //------CSS 控制区------
  GM_addStyle(`
   .nav_btn {
        position: absolute;
        top: 0;
        right: 8rem;
    }
    .nav-expand-list ul > li:hover {
        background-color: grey;
    }
    .nav-expand-list ul > li > a {
        display: inline-block;
        width: 100%;
        text-decoration: none;
        line-height: 3rem;
        color: black;
    }
    #mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .3);
        display: none;
        z-index: 2147483647;
        color: #010101;
    }

   #mask a:hover {
        text-decoration: underline;
    }

    #dialog {
        position: absolute;
        width: 35rem;
        min-height: 15rem;
        background-color: #ffffff;
        border-radius: 10px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 5rem;
        box-sizing: border-box;
        user-select: none;
        display:flex;
        flex-direction: column;
        justify-content: center;
    }

    .words {
        display: inline-block;
        padding: .2rem;
        border: 2px solid #999;
        margin: 0 0 1rem 1rem;
        border-radius: 3px;
    }

    .words > svg {
        width: 1rem;
        height: 1rem;
        margin-left: 1.5rem;
    }

    .ex_input {
        outline: none;
        margin: 5% 0;
        height: 1.7rem;
        width: 70%;
        font-size: 1.3rem;

        border: none;
        border-radius: 4px;
        border-bottom: 1px solid grey;
        
    }

    .ex_button {
        margin: auto; /*will be center*/
        background: none;
        color: #b06530;
        border: 2px solid;
        border-radius:4px;
        height: 1.7rem;
        width: 25%;
        font-size: 1em;
    }
    .remove {
        cursor: pointer;
    }

    #exist {
        margin: 2rem 0;
    }

    #exist > div {
        margin: 1rem 0 0 5%;
        width: 80%;
        border: 1px solid #666;
        border-radius: 3px;
        padding: 1rem;
    }
    
    #blacklistL {
        margin: 2rem 0;
    }

    #blacklistL > div {
        margin: 1rem 0 0 5%;
        width: 80%;
        border: 1px solid #666;
        border-radius: 3px;
        padding: 1rem;
    }

    .controlSwitch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }
    
    .controlSwitch input {display:none;}
    
    .controlSlider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      border-radius: 34px;
      -webkit-transition: .4s;
      transition: .4s;
    }
    
    .controlSlider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      border-radius: 50%;
      -webkit-transition: .4s;
      transition: .4s;
    }
    
    input:checked + .controlSlider {
      background-color: #2196F3;
    }
    
    input:focus + .controlSlider {
      box-shadow: 0 0 1px #2196F3;
    }
    
    input:checked + .controlSlider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }
  
    `);
  //------结束CSS 控制区------

  //------监听区域------
  // 弹幕监听放大器
  let observer = new MutationObserver(() => {
    $("#danmudiv > .danmu-item").css("font-size", `${danmuSize}px`);
    $("#danmudiv > .danmu-item").css("line-height", `${danmuSize + 25}px`);
    let danmus = document.querySelectorAll(".danmu-item");
    for (let item of danmus) {
      for (let word of keywords) {
        if (item.querySelector("span").innerHTML.indexOf(word) !== -1) {
          console.log(
            "!!!已过滤一条弹幕，内容是： ",
            item.querySelector("span").innerHTML
          );
          item.remove();
          break;
        }
      }
    }
  });
  // 快捷键监听
  $(document).keydown(function (key) {
    if (key.altKey && key.which === 82) {
      // alt+r 刷新视频不刷新网页
      $(".player-refresh-btn").click();
    }
  });
  //------监听区域结束------

  //------前端区域------
  setTimeout(() => {
    createElement();

    // const plbtn = document.getElementById("player-btn");
    // if (plbtn.title === "开始观看") plbtn.click();

    let $edit = $("#edit");
    let danmudiv = document.querySelector("#danmudiv");
    let $mask = $("#mask");
    let $exist = $("#exist > div");

    //初始化pannel里的屏蔽词
    for (let index = 0; index < keywords.length; index++) {
      insertToExist(keywords[index], index, $exist);
    }

    $edit.click(() => {
      $mask.css("display", "block");
    });

    //点击dialog以外的地方关闭窗口
    $(document).mouseup(function (e) {
      var _con = $("#dialog"); // 设置目标区域
      if (!_con.is(e.target) && _con.has(e.target).length === 0) {
        $("#mask").css("display", "none");
      }
    });

    $("#exist > #clear").click(() => {
      if (confirm("确定要移除所有的屏蔽词吗？")) {
        $exist.empty();
        keywords.length = 0;
        GM_setValue("keywords", keywords);
      }
    });
    //点击移除keywords
    $exist.on("click", ".words", function () {
      $(this).remove();
      keywords.splice(parseInt($(this).attr("data-index")), 1);
      GM_setValue("keywords", keywords);
    });

    //保存屏蔽词
    $("#save > button").click(() => {
      let val = $("#save > input").val();

      if (val.trim() === "") {
        return alert("请输入有效的屏蔽词");
      } else if (keywords.some((item) => item === val)) {
        return alert("已存在，请勿重复添加");
      }
      insertToExist(val, keywords.length, $exist);
      keywords.push(val);
      $("#save > input").val("");
      GM_setValue("keywords", keywords);
    });

    //保存弹幕大小
    $("#danmuSize > button").click(() => {
      danmuSize = parseInt($("#danmuSize > input").val());
      GM_setValue("danmuSize", danmuSize);
    });

    //---开关---
    // $("#isTipsOrChart").click(() => {
    //   isTipsOrChart = clickSwitch("#isTipsOrChart");
    //   GM_setValue("isTipsOrChart", isTipsOrChart);
    // });

    // var clickSwitch = function (item) {
    //   if ($(item).is(":checked")) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // };
    //---结束开关---

    observer.observe(danmudiv, { childList: true });
  }, 3000);
  //------结束dom区------

  //------html 显示区------
  function createElement() {
    $(".duya-header-wrap").append(`
    <div class="hy-nav-right nav_btn">
        <a class="hy-nav-title" href="javascript:;">
            <span class="title" id="keywords">屏蔽词</span>
        </a>
        <div class="nav-expand-list">
            <i class="arrow"style="margin-left: -1.5rem;"></i>
            <div style="padding: 1rem;">
                <ul>
                    <li><a href="javascript:;" id="edit">编辑器</a></li>
                </ul>
            </div>
    </div>`);

    $("body").append(`
    <div id="mask">
        <div id="dialog">
            
  
            <div id="save">
                <input class="ex_input" type="text" placeholder="请输入屏蔽关键词">
                <button class="ex_button">添加</button>
            </div>

            <div id="danmuSize">
                <input class="ex_input" type="number" value="${danmuSize}">
                <button class="ex_button">更改文字大小</button>
            </div>
            <div id="exist">
                <span style="font-size: 14px;">已添加的屏蔽词</span>
                <a href="javascript:;" style="color: deepskyblue;font-size: 14px;float: right; border: 2px solid; border-radius:4px;text-align: right" id="clear">清除所有</a>

                <div>
                </div>
            </div>
        </div>
    </div>
`);
  }
  //------结束html显示区------

  function insertToExist(val, index, $parent) {
    let $item = `<span class="words" data-index="${index}">${val}</span>`;
    $parent.append($item);
  }
})();
