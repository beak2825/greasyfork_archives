// ==UserScript==
// @name                423Down - Skip transfer
// @name:zh-CN          423Down - 跳过中转
// @namespace           https://greasyfork.org/zh-CN/users/193133-pana
// @homepage            https://www.sailboatweb.com
// @version             1.1.1
// @description         Bypass the transfer of go.php
// @description:zh-CN   绕过 go.php 的中转
// @author              pana
// @license             GNU General Public License v3.0 or later
// @match               *://*.423down.com/*
// @match               *://*.potplayer.org/*
// @icon                https://cdn.jsdelivr.net/gh/423down/files@master/img/favicon.ico
// @grant               none
// @compatible          chrome
// @compatible          firefox
// @downloadURL https://update.greasyfork.org/scripts/424321/423Down%20-%20Skip%20transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/424321/423Down%20-%20Skip%20transfer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  document.querySelectorAll('a').forEach(ele => {
    if (ele.href && ele.href.includes('go.php?url')) {
      if (ele.textContent && ele.textContent.match(/^https?:\/\//)) {
        ele.href = ele.textContent;
      } else if (ele.href.match(/url=((?:https?:\/\/)?[\w./-])/)) {
        ele.href = 'http://' + ele.href.match(/url=(?:https?:\/\/)?([\w./-]+)/)[1];
      }
    }
  });
})();
