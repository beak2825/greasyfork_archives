// ==UserScript==
// @name        マクロミルのアンケートを旧UIで表示する
// @namespace   macromill old ui
// @include     https://monitor.macromill.com/airs/exec/smartRsAction.do?rid=*
// @description マクロミルのアンケートを旧UIで表示します
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/374281/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%E3%81%AE%E3%82%A2%E3%83%B3%E3%82%B1%E3%83%BC%E3%83%88%E3%82%92%E6%97%A7UI%E3%81%A7%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/374281/%E3%83%9E%E3%82%AF%E3%83%AD%E3%83%9F%E3%83%AB%E3%81%AE%E3%82%A2%E3%83%B3%E3%82%B1%E3%83%BC%E3%83%88%E3%82%92%E6%97%A7UI%E3%81%A7%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==
location.replace(location.href.replace("smartR", "r"));