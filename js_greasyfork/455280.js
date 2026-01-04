// ==UserScript==
// @name         HOST_HUIJI
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description   HOST_HUIJI FILTER
// @author       backrock12
// @match        https://hots.huijiwiki.com/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huijiwiki.com
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455280/HOST_HUIJI.user.js
// @updateURL https://update.greasyfork.org/scripts/455280/HOST_HUIJI.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function h2_hide(sp_p) {
    const h2 = $(sp_p).parents("h2");
    if (h2.length > 0) {
      h2.hide();

      let nh2 = h2.next();
      while (nh2.prop("nodeName") == "P") {
        nh2.hide();
        nh2 = nh2.next();
      }
    } else {
      console.log(sp_p);
      alert(sp_p);
    }
  }

  function h3_hide(sp_p) {
    const h3 = $(sp_p).parents("h3");
    if (h3.length > 0) {
      h3.next().hide();
      h3.hide();
    } else {
      console.log(sp_p);
      alert(sp_p);
    }
  }

  function loop() {

    $(".bilibili").hide();
    $("div:contains('如果你要找的是'):last").hide();


    const h2 = $("#Level_20").parents("h3");
    console.log("h2", h2);
    let nh2 = h2.next();
    while (nh2 && nh2.length > 0) {
      if (nh2.prop("nodeName") != "DIV") {
        nh2.hide();
      }
      console.log("nh2", nh2);
      nh2 = nh2.next();
    }
  }

  function run() {
    loop();
    return;

    let sp_p = "#视频";
    h2_hide(sp_p);

    $(".bilibili").hide();

    sp_p = "#引用与注释";
    $(sp_p).parents("h2").hide();

    // const navbox = $("table.navbox")[1];
    // if (navbox.innerText.lastIndexOf("全部英雄与英雄单位") > 0) {
    //   $(navbox).hide();
    // } else {
    //   console.log(" navbox not ");
    //   alert(" navbox not ");
    // }

    const navbox = $("table.navbox");
    for (let index = 0; index < navbox.length; index++) {
      const element = navbox[index];
      if (element.innerText.lastIndexOf("全部英雄与英雄单位") > -1) {
        $(element).hide();
      }
    }

    sp_p = "#画廊";
    h2_hide(sp_p);

    let h3_p = "#技能";
    h3_hide(h3_p);

    sp_p = "#收藏";
    h2_hide(sp_p);

    h3_p = "#皮肤";
    h3_hide(h3_p);

    sp_p = "#英雄故事";
    h2_hide(sp_p);

    sp_p = "#攻略";
    h2_hide(sp_p);

    h3_p = "#擅长配合";
    h3_hide(h3_p);
  }

  run();
})();
