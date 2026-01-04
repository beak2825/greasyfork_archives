// ==UserScript==
// @name         Discuz！ Emoji display
// @namespace    Discuz！ Emoji display
// @version      0.0.5
// @icon         https://www.discuz.net/favicon.ico
// @description  修复部分Diszuz！论坛的Emoji显示问题 Fixed an issue where Emoji could not be displayed normally in some forums based on Discuz!
// @author       mxdh
// @match        https://kafan.cn/thread-*.html
// @match        https://kafan.cn/forum.php?mod=viewthread&tid=*
// @match        https://bbs.kafan.cn/home.php?mod=space&do=pm&subop=view&touid=*
// @match        https://bbs.kafan.cn/home.php?mod=space&do=pm&subop=view&plid=*
// @match        https://*/thread-*.html
// @match        https://*/forum.php?mod=viewthread&tid=*
// @match        https://*/home.php?mod=space&do=pm&subop=view&touid=*
// @match        https://*/home.php?mod=space&do=pm&subop=view&plid=*
// @match        http://*/thread-*.html
// @match        http://*/forum.php?mod=viewthread&tid=*
// @match        http://*/home.php?mod=space&do=pm&subop=view&touid=*
// @match        http://*/home.php?mod=space&do=pm&subop=view&plid=*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/423209/Discuz%EF%BC%81%20Emoji%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/423209/Discuz%EF%BC%81%20Emoji%20display.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Display Emoji
  const tf = document.getElementsByClassName("t_f");
  const sign = document.getElementsByClassName("sign");
  const xg1 = document.getElementsByClassName("xg1");
  const ptm = document.getElementsByClassName("ptm");
  const mbm = document.getElementsByClassName("mbm");
  const content = [...tf, ...sign, ...ptm, ...mbm];
  for (let i = 0; i < content.length; i++) {
    content[i].innerHTML = content[i].innerHTML.replace(/\&amp;#.*?;/g, function (char) {
      if (char.length === 13) {
        return String.fromCodePoint(parseInt(char.match(/[0-9]+/)));
      }
      return char;
    });
  }
  for (let i = 0; i < xg1.length; i++) {
    xg1[i].innerHTML = xg1[i].innerHTML.replace(/\&amp;amp;#.*?;/g, function (char) {
      if (char.length === 17) {
        return String.fromCodePoint(parseInt(char.match(/[0-9]+/)));
      }
      return char;
    });
  }
})();