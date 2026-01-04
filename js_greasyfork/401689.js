// ==UserScript==
// @name         知乎便捷功能
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  知乎便捷功能 1.首页自动跳转到发现 2.自动关闭登录框 3.自动显示全部回答 4.问题日期显示在上方 5.去除外链的提示 6.去除广告
// @author       backrock12
// @match        *://*.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/401689/%E7%9F%A5%E4%B9%8E%E4%BE%BF%E6%8D%B7%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/401689/%E7%9F%A5%E4%B9%8E%E4%BE%BF%E6%8D%B7%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let autoclose_count = 0;
  const max_count = 30;
  let isrun = false;

  function autoclose() {
    if (isrun) return;
    isrun = true;
    console.log("autoclose");

    const ad1 = document.querySelector(".css-1hwwfws");
    if (ad1) {
      ad1.style.display = "none";
    }
    const ad2 = document.querySelector(".css-1ynzxqw");
    if (ad2) {
        console.groupEnd('1ynzxqw');
        ad2.style.display = "none";
    }

    const s3 = document.querySelector(".ViewAll-QuestionMainAction");
    if (s3) {
      s3.click();
      return;
    }

    const s4 = document.querySelector(".QuestionRichText-more");
    if (s4) {
      s4.click();
    }

    const s0 = document.querySelector(".SignContainer-content");
    if (s0) {
      const s1 = document.querySelector(".Modal-backdrop");
      if (s1) {
        s1.click();
      }

      const s2 = document.querySelector(".Modal-closeButton");
      if (s2) {
        s2.click();
      }
    }

    const s5 = document.querySelector("body > div:nth-child(14)");
    if (s5) {
      if (s5.querySelector(".signFlowModal")) {
        s5.innerHTML = "";
        console.log(s5);
      }
    }

    autoclose_count++;

    // if (autoclose_count > max_count) {
    //     document.querySelector('body').removeEventListener('DOMNodeInserted', autoclose);
    // }

    isrun = false;
  }

  function noad() {
    const ad1 = document.querySelector(".AppBanner");
    if (ad1) {
      ad1.style.display = "none";
    }

    const ad2 = document.querySelector("div.Card:nth-child(4)");
    if (ad2) {
      ad2.style.display = "none";
    }

    const ad3 = document.querySelector(".Card.Banner");
    if (ad3) {
      ad3.style.display = "none";
    }
    const ad4 = document.querySelector(".AdblockBanner");
    if (ad4) {
      ad4.style.display = "none";
    }
  }

  function nosign() {
    document
      .querySelector("body")
      .addEventListener("DOMNodeInserted", autoclose);
  }

  ///  跳转
  function nojump() {
    var documents = document.querySelectorAll("div a");
    for (var i = 0; i < documents.length; i++) {
      if (documents[i].href.split("http").length > 2) {
        documents[i].setAttribute(
          "href",
          decodeURIComponent("http" + documents[i].href.split("http")[2])
        );
      }
    }
  }

  function nohome() {
    // let reg = new RegExp('www.zhihu.com/sign*');
    // if (reg.test(location.href)) {
    location.href = "https://www.zhihu.com/explore";
    // }
  }

  function zhuanlan() {
    // let reg = new RegExp('zhuanlan.zhihu.com*');
    // if (reg.test(location.href)) {
    console.log("zhuanlan");
    const container = document.querySelector(".Post-Author");
    const time = document.querySelector(".ContentItem-time");
    var timediv = document.createElement("div");
    timediv.innerHTML = time.outerHTML;
    console.log(timediv);

    container.appendChild(timediv);
    //}
  }

  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  function timeFormat(time, fmt) {
    //author: meizz
    var o = {
      "M+": time.getMonth() + 1, //月份
      "d+": time.getDate(), //日
      "h+": time.getHours(), //小时
      "m+": time.getMinutes(), //分
      "s+": time.getSeconds(), //秒
      "q+": Math.floor((time.getMonth() + 3) / 3), //季度
      S: time.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (time.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  }

  function questiodate() {
    function QuestionPage() {
      const title = document.querySelector(".QuestionPage");
      if (title) {
        const dateCreated = title.querySelector(
          "[itemprop~=dateCreated][content]"
        ).content;
        const dateModified = title.querySelector(
          "[itemprop~=dateModified][content]"
        ).content;

        const ctime = timeFormat(new Date(dateCreated), "yyyy-MM-dd hh:mm:ss");
        const mtime = timeFormat(new Date(dateModified), "yyyy-MM-dd hh:mm:ss");
        const side = title.querySelector(".QuestionHeader-side");
        var timediv = document.createElement("div");
        timediv.innerHTML = `<p>创建时间: &nbsp;${ctime}</p><p>编辑时间: &nbsp;${mtime}</p>`;
        timediv.style.cssText = "color:#999";
        side.appendChild(timediv);
      }
    }

    let listnum = 0;
    function ContentItem() {
      //console.log('ContentItem');
      const list = document.querySelectorAll(".ContentItem");
      if (listnum != list.length) {
        listnum = list.length;
        for (var i = 0; i < list.length; i++) {
          const item = list[i];
          if (item.getAttribute("zh_date_mk") != "true") {
            const dateCreated = item.querySelector(
              "[itemprop~=dateCreated][content]"
            ).content;
            const dateModified = item.querySelector(
              "[itemprop~=dateModified][content]"
            ).content;

            const ctime = timeFormat(
              new Date(dateCreated),
              "yyyy-MM-dd hh:mm:ss"
            );
            const mtime = timeFormat(
              new Date(dateModified),
              "yyyy-MM-dd hh:mm:ss"
            );

            const sideitem = item.querySelector(".css-h5al4j");
            var timediv = document.createElement("span");
            timediv.innerHTML = `创建时间: ${ctime}&nbsp;&nbsp;编辑时间: ${mtime} `;
            timediv.class = "Voters";
            timediv.style.cssText = "color:#999;float:right;";
            sideitem.appendChild(timediv);
            item.setAttribute("zh_date_mk", "true");
          }
        }
      }
    }

    QuestionPage();
    document
      .querySelector(".Question-main")
      .addEventListener("DOMNodeInserted", ContentItem);
  }

  function start() {
    if (/www\.zhihu\.com\/sign*/.test(location.href)) {
      //首页跳转
      nohome();
    } else if (/zhuanlan\.zhihu\.com*/.test(location.href)) {
      //专栏日期
      zhuanlan();
      nosign();
    } else if (/www\.zhihu\.com\/questio*/.test(location.href)) {
      //登录框
      //广告
      setTimeout(noad, 500);
      //问题日期
      questiodate();
      nosign();
    } else {
      //登录框
      nosign();
    }

    //链接
    setTimeout(nojump, 500);
    console.log("zhihu");
  }

  start();
})();
