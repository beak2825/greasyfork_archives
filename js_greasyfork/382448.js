// ==UserScript==
// @name デジタル時計(Feederチャット)
// @author 帰ってきた自称初投稿マン
// @version 0.7.2
// @description サイトの右側にデジタル時計を追加します。
// @match *.x-feeder.info/*/
// @exclude *.x-feeder.info/*/*/*
// @namespace https://greasyfork.org/users/297030
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/382448/%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E6%99%82%E8%A8%88%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382448/%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E6%99%82%E8%A8%88%28Feeder%E3%83%81%E3%83%A3%E3%83%83%E3%83%88%29.meta.js
// ==/UserScript==
(() => {
  'use strict';
  const div = $("<div>").prependTo($("#main_right"));
  const main = () => {
    const now = new Date().toString().match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)[0];
    div.text(now).css("color", "#44ff11").css("background-color", "#000000").css("text-align","center").css("font-size","x-large");
  };
  setInterval(main, 1000);
})();