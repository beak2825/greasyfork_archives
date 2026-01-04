// ==UserScript==
// @name          Close useless tabs in 163 mail
// @namespace     https://github.com/zklhp
// @icon          https://mail.163.com/favicon.ico
// @version       3.3.0
// @description   Close useless tabs
// @homepageURL   https://gist.github.com/zklhp/c1a358f026358786bef58b49f65d8333
// @author        Chris Zheng <https://chriszheng.science/>
// @match         *://mail.163.com/*
// @downloadURL https://update.greasyfork.org/scripts/388689/Close%20useless%20tabs%20in%20163%20mail.user.js
// @updateURL https://update.greasyfork.org/scripts/388689/Close%20useless%20tabs%20in%20163%20mail.meta.js
// ==/UserScript==

/* jshint esversion: 10 */
(() => {
  var to_close = ["#_mail_link_2_135", "#_mail_link_2_137", "#_mail_link_4_125", "#_mail_link_3_122"];

  for (let x of to_close) {
    try {
      document.querySelector(x).click();
    } catch {}
  }
})();