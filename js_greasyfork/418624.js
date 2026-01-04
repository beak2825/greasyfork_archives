// ==UserScript==
// @name         openclash更新所有三方规则脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *://*/cgi-bin/luci/admin/services/openclash/rule-providers-manage
// @match        *://*/cgi-bin/luci/admin/services/openclash/game-rules-manage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418624/openclash%E6%9B%B4%E6%96%B0%E6%89%80%E6%9C%89%E4%B8%89%E6%96%B9%E8%A7%84%E5%88%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/418624/openclash%E6%9B%B4%E6%96%B0%E6%89%80%E6%9C%89%E4%B8%89%E6%96%B9%E8%A7%84%E5%88%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

for (var i=0;i<=document.getElementsByClassName("cbi-button cbi-input-reload").length;i++)
{ document.getElementsByClassName("cbi-button cbi-input-reload")[i].click()
}// Your code here...
})();