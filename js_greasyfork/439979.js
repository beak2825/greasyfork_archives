// ==UserScript==
// @name         Discuz!论坛助手 Discuz Helper 🦊
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  针对部分Discuz论坛，提供一键回复，评分，新窗口打开等功能 (◕ᴗ◕✿)
// @match        http://www.fuman-8.com/*
// @match        https://www.tt1069.com/bbs/*
// @icon         data:image/png;base64,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
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/439979/Discuz%21%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B%20Discuz%20Helper%20%F0%9F%A6%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/439979/Discuz%21%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B%20Discuz%20Helper%20%F0%9F%A6%8A.meta.js
// ==/UserScript==

(() => {
  ("use strict");

  const name = "🦊";
  const logPrefix = [
    "%c" + name,
    `background:#ebebeb;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`,
  ];
  function log(...args) {
    console.log(...logPrefix, ...args);
  }

  const baseUrl = "http://www.fuman-8.com";

  // /^https:\/\/.+\.fuman[5-12]\.com\/.*$/

  function searchHandle() {
    log("searchHandle...");

    //搜索框定位
    var search = document.querySelector("#scbar_txt");
    document.addEventListener("keyup", function (e) {
      if (e.keyCode === 83) {
        search.focus();
      }
    });

    //清除搜索框旁原文字
    var scbarHot = document.getElementById("scbar_hot");
    var ent = scbarHot.parentNode;
    if (scbarHot) {
      // log(ent);
      ent.className = "scbar_ent_td";
      scbarHot.remove();
    }

    var sa = document.querySelector("#searchArea");
    sa.onclick = function (e) {
      e.preventDefault();
    };

    //搜索条长度
    document.getElementById("scbar_txt").style.width = "357px";
  }

  function addFirstButton() {
    log("addFirstButton...");

    //添加搜索区域的一排按钮
    var searchArea = document.createElement("div");
    var td = document.createElement("td");
    td.className = "scbar_noci_td";
    td.style.width = "18px";
    td.style.background = "transparent";
    var ent = document.getElementById("scbar_hot").parentNode;
    var tr = ent.parentNode;
    tr.appendChild(td);
    searchArea.setAttribute("id", "searchArea");
    ent.appendChild(searchArea);
    var d = document.getElementById("searchArea");
    if (d) {
      d.style.display = "flex";
      d.appendChild(button1);
      d.appendChild(button2);
      d.appendChild(button3);
      d.appendChild(button4);
      d.appendChild(button5);
      d.appendChild(button6);
    }

    //定位
    button1.onclick = function () {
      if (document.getElementById("filter_special")) {
        document.getElementById("filter_special").scrollIntoView();
      }
      if (
        !document.getElementById("filter_special") &&
        document.getElementById("seccheck_fastpost")
      ) {
        document.getElementById("seccheck_fastpost").scrollIntoView();
      }
      if (document.getElementById("e_controls")) {
        document.getElementById("e_controls").scrollIntoView();
      }
    };

    //BL最新贴
    button2.onclick = function () {
      window.location.href =
        baseUrl +
        "/forum.php?mod=forumdisplay&fid=86&filter=author&orderby=dateline";
    };

    //动画最新贴
    button3.onclick = function () {
      window.location.href =
        baseUrl +
        "/forum.php?mod=forumdisplay&fid=159&filter=author&orderby=dateline";
    };

    //DRAMA最新贴
    button4.onclick = function () {
      window.location.href =
        baseUrl +
        "/forum.php?mod=forumdisplay&fid=160&filter=author&orderby=dateline";
    };

    //文学最新贴
    button5.onclick = function () {
      window.location.href =
        baseUrl +
        "/forum.php?mod=forumdisplay&fid=179&filter=author&orderby=dateline";
    };

    //游戏最新贴
    button6.onclick = function () {
      window.location.href =
        baseUrl +
        "/forum.php?mod=forumdisplay&fid=87&filter=author&orderby=dateline";
    };
  }

  function addSecondButton() {
    log("addSecondButton...");

    //添加按钮
    var title = document.getElementsByClassName("plc ptm pbn vwthd")[0];
    if (title) {
      title.appendChild(button);
      title.appendChild(button_);
    }

    //一键回复
    button.onclick = function () {
      log("button.onclick......");
      if (document.getElementById("ls_username")) {
        toastr.info("请先登录哦凸(｀0´)凸！！！");
        return;
      }
      if (document.querySelector("textarea")) {
        document.querySelector("textarea").innerText =
          "谢谢大大无私的分享，炒鸡感谢鸭 (＾ω＾) ";
        document.getElementById("fastpostsubmit").click();
      }
    };

    //一键评分
    button_.onclick = function () {
      document.getElementById("ak_rate").click();
      log("开始评分。。。");
      setTimeout(function () {
        if (document.getElementById("fwin_rate")) {
          var todayLeft =
            document.getElementsByClassName("dt mbm")[0].children[0];
          var coinLeft = todayLeft.children[1].children[3].innerHTML;
          log("coinLeft:" + coinLeft);
          var charmLeft = todayLeft.children[2].children[3].innerHTML;
          log("charmLeft:" + charmLeft);
          var vitalityLeft = todayLeft.children[3].children[3].innerHTML;
          log("vitalityLeft:" + vitalityLeft);

          if (coinLeft < 2) {
            alert("今日剩余金币太少辣，明天再来评分吧 ฅ•̀∀•́ฅ !!!");
            document.getElementsByClassName("flbc")[0].click();
            return;
          }

          var coin = (document.getElementById("score2").value = 5);
          var charm = (document.getElementById("score4").value = 1);
          var vitality = (document.getElementById("score7").value = 1);
          if (coinLeft < coin) coin = coinLeft;
          else coin = 5; //<----------自定义评分 金币个数
          if (charmLeft < charm) charm = charmLeft;
          else charm = 1; //<----------自定义评分 魅力个数
          if (vitalityLeft < vitality) vitality = vitalityLeft;
          else vitality = 1; //<----------自定义评分 活力个数
          document.getElementById("reason").value =
            "超级棒的资源，感谢楼主大大 (＾▽＾) "; //<----------自定义评分 评分理由
          document.getElementsByClassName("pn pnc")[0].click();
        }
      }, 2000);
    };
  }

  //设定按钮样式
  var styleMap = {
    border: "3px solid #1670af",
    background: "#ffffff",
    borderRadius: "4px",
    marginLeft: "5px",
  };

  var button = document.createElement("button");
  var button_ = document.createElement("button");
  var button1 = document.createElement("button");
  var button2 = document.createElement("button");
  var button3 = document.createElement("button");
  var button4 = document.createElement("button");
  var button5 = document.createElement("button");
  var button6 = document.createElement("button");

  for (let i in styleMap) {
    button.style[i] = styleMap[i];
    button_.style[i] = styleMap[i];
    button1.style[i] = styleMap[i];
    button2.style[i] = styleMap[i];
    button3.style[i] = styleMap[i];
    button4.style[i] = styleMap[i];
    button5.style[i] = styleMap[i];
    button6.style[i] = styleMap[i];
  }

  button.innerHTML = "一键回复";
  button_.innerHTML = "一键评分";
  button1.innerHTML = "<b>定位</b>";
  button2.innerHTML = "BL最新贴";
  button3.innerHTML = "动画最新贴";
  button4.innerHTML = "DRAMA最新贴";
  button5.innerHTML = "文学最新贴";
  button6.innerHTML = "游戏最新贴";

  button.style.border = "3px solid #ff0000";
  button_.style.border = "3px solid #ff0000";
  button1.style.color = "#1670af";

  function linkNewWindow() {
    log("linkNewWindow...");

    var links = document.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      if (links[i].parentNode.className == "fpd") {
        log("Comment Area: [" + links[i].innerText + "] skipped...");
      } else if (links[i].parentNode.parentNode.id == "scrolltop") {
        log("Scroll Top: [" + links[i].innerText + "] skipped...");
      } else if (links[i].id == "k_favorite") {
        log("Favorite: [" + links[i].title + "] skipped...");
      } else {
        links[i].target = "_blank";
        links[i].removeAttribute("onclick");
      }
    }
  }

  window.onload = () => {
    log("window.onload...");

    if (/fuman-8.com/.test(window.location.href)) {
      searchHandle();
      addFirstButton();
      addSecondButton();
    }

    if (/tt1069.com/.test(window.location.href)) {
      linkNewWindow();
      addSecondButton();
    }
  };

  // Your code here...
})();
