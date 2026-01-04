// ==UserScript==
// @name         QQ邮箱自动跳过安全隐患
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       CXYD
// @match        https://mail.qq.com/cgi-bin/help_static_send*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41073/QQ%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%AE%89%E5%85%A8%E9%9A%90%E6%82%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/41073/QQ%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%AE%89%E5%85%A8%E9%9A%90%E6%82%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
      var link=document.getElementById("skip_btn").href;
        window.location.href=link;
})();