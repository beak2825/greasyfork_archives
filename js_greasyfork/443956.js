// ==UserScript==
// @name         Tony自动刷新淘宝页面，保持一天不掉线
// @namespace    https://www.tonyblog.cn/
// @version      1.0
// @description  Tony自动刷新淘宝页面，保持一天不掉线!
// @author       Tony Liu
// @match        https://i.taobao.com/my_taobao.htm*
// @icon         https://www.tonyblog.cn/favicon.ico
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/443956/Tony%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E6%B7%98%E5%AE%9D%E9%A1%B5%E9%9D%A2%EF%BC%8C%E4%BF%9D%E6%8C%81%E4%B8%80%E5%A4%A9%E4%B8%8D%E6%8E%89%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/443956/Tony%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E6%B7%98%E5%AE%9D%E9%A1%B5%E9%9D%A2%EF%BC%8C%E4%BF%9D%E6%8C%81%E4%B8%80%E5%A4%A9%E4%B8%8D%E6%8E%89%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function(){location.reload()},1000*60*15)
})();