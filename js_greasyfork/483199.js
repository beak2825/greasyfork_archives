// ==UserScript==
// @name         Epoch Darwin Helper
// @version      0.1
// @author       fanglinbj
// @match        https://darwin.zhenguanyu.com/*
// @match        https://site-test.zhenguanyu.com/tutor-darwin-web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhenguanyu.com
// @grant        none
// @description  针对darwin的辅助工具
// @namespace    epoch-fe-helper
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483199/Epoch%20Darwin%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/483199/Epoch%20Darwin%20Helper.meta.js
// ==/UserScript==

(function() {
    var _script = document.createElement("script");
    window.__tutorDarwinHelperLdapListUrl__ = 'https://m.yuanfudao.biz/tutor-web-basis/api/configs/epoch-darwin-helper-ldap-list';
    _script.src = 'https://mkta.fbcontent.cn/2023/7/581bd0fcaea8.js';
    document.head.appendChild(_script);
})();