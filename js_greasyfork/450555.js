// ==UserScript==
// @name         gaoqingFM
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  gaoqingFM 添加關聯豆瓣按鈕
// @author       backrock12
// @match        https://gaoqing.fm/
// @match        https://gaoqing.fm/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaoqing.fm
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450555/gaoqingFM.user.js
// @updateURL https://update.greasyfork.org/scripts/450555/gaoqingFM.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let isrun = false;
  function sethomepage() {
    if (isrun) return;
    isrun = true;
    console.log("1");
    // const i = $('.pg-items');
    // if (i.attr('gaoqingFM')) return;
    // i.attr('gaoqingFM', true)
    const list = $("#result1 > li > div:nth-child(1) > div:nth-child(2) > p ");
    console.log(list);
    $.each(list, function (index, element) {
      if ($(element).attr("gaoqingFM")) return;
      $(element).attr("gaoqingFM", true);
      const name = $(element).find("a").text();
      console.log(name);
      const aurl =
        "<a href='https://www.douban.com/search?cat=1002&q=" +
        name +
        "#autoselect' target='_blank' > <img src='https://www.douban.com/favicon.ico' style='width:24px;' alt='豆瓣' /> </a>";
      $(element).append(aurl);
    });
    isrun = false;
  }

  function subnoad() {
    const adlist = [
      "#notice",
      "ul.navbar-nav:nth-child(2)",
      "#cililian > a:nth-child(3)",
      "#sidebar",
    ];

    GM_addStyle(adlist.join(",") + " { display:none  !important; }");
  }

  function setitempage() {
    const ent = $(".col-md-12 > h2");
    console.log(ent);
    const name = $(ent).find("a").text();
    console.log(name);
    const aurl =
      "<a href='https://www.douban.com/search?cat=1002&q=" +
      name +
      "#autoselect' target='_blank' > <img src='https://www.douban.com/favicon.ico' style='width:32px;' alt='豆瓣' /> </a>";
    $(ent).append(aurl);
  }

  function run() {
    subnoad();
    if (/view/.test(location.href)) {
      setitempage();
    } else {
      sethomepage();

      const config = {
        //attributes: true,
        childList: true,
        //subtree: true
      };
      const observer = new MutationObserver(sethomepage);
      observer.observe($("#result1")[0], config);
    }
  }

  run();
})();
