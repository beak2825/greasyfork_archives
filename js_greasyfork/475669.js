// ==UserScript==
// @name         radiko change timetable width/height
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  radiko の番組表の幅と高さを変更
// @author       aossy
// @match        *://radiko.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475669/radiko%20change%20timetable%20widthheight.user.js
// @updateURL https://update.greasyfork.org/scripts/475669/radiko%20change%20timetable%20widthheight.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 番組表の元の高さからの割合
  const scale = 0.2;

  // timetable_scroll.js の timeShiftScroll.itemHoueHeight (default 3000) で番組表の1時間の高さを決定
  // 番組表描画以外に、番組表の現在時刻へのスクロールへも影響するため最初に変更しておく
  timeShiftScroll.itemHourHeight = timeShiftScroll.itemHourHeight * scale;

  function change_timetable_height() {
    if (document.getElementById('program-table').getElementsByClassName('item-outer').length > 0) {
      $("div.item-outer").children("div").each(function () {
        $(this).css({ "min-height": "" });
        $(this).children("div.contents:first").css({ "max-height": $(this).css("height"), "overflow": "hidden" });
      });
    }
    else {
      setTimeout(change_timetable_height, 1000)
    };
  }

  function change_timetable_width() {
    $("div.content__inner").css({ "width": "80%", "min-width": "1000px" });
    $("div.program-table__outer").css({ "width": "100%", "min-width": "1000px" });
  }

  const target = document.getElementById('contents');
  const observer = new MutationObserver(function (mutations) {
    // 番組表の幅を変更
    change_timetable_width();
    // 番組表の高さを変更
    change_timetable_height();
  });

  const config = { childList: true };
  observer.observe(target, config);
})();