// ==UserScript==
// @name Youtube返回旧版布局(已失效)
// @name:zh-CN Youtube返回旧版布局(已失效)
// @name:zh-TW Youtube返回舊版佈局(已失效)
// @name:en Restore Old Youtube(void)
// @name:ko 올드 유튜브 복원(실패)
// @name:ja Youtube古いレイアウトに戻る(失敗)
// @name:es Restaurar el viejo Youtube (inválido)
// @description 将youtube返回旧版布局 (已失效)
// @description:zh-CN 将youtube返回旧版布局
// @description:zh-TW 將youtube返回舊版佈局
// @description:ja YouTubeを古いレイアウトに戻す
// @description:en Return Youtube to the old layout.
// @description:ko Youtube를 이전 레이아웃으로 되돌립니다.
// @description:es Regresa Youtube a la distribución anterior.
// @version 0.1.3
// @icon https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico
// @match *://www.youtube.com/*
// @exclude *://www.youtube.com/embed/*
// @grant none
// @run-at document-start
// @from ndogw
// @namespace Old youtube
// @downloadURL https://update.greasyfork.org/scripts/378118/Youtube%E8%BF%94%E5%9B%9E%E6%97%A7%E7%89%88%E5%B8%83%E5%B1%80%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/378118/Youtube%E8%BF%94%E5%9B%9E%E6%97%A7%E7%89%88%E5%B8%83%E5%B1%80%28%E5%B7%B2%E5%A4%B1%E6%95%88%29.meta.js
// ==/UserScript==


var url = window.location.href;
if (url.indexOf("disable_polymer") === -1) {
  if (url.indexOf("?") > 0) {
    url += "&";
  } else {
    url += "?";
  }
  url += "disable_polymer=1";
  window.location.href = url;
}