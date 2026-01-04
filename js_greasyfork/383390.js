// ==UserScript==
// @name         百度贴吧自动跳过核心区
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *tieba.baidu.com/*kw=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/383390/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E6%A0%B8%E5%BF%83%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/383390/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E6%A0%B8%E5%BF%83%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
var a = window.location.href
    if (a.search('tab=')==-1 && a.search('qw=')==-1)
    {
        window.location.href=a + '&tab=main'
    }
})();