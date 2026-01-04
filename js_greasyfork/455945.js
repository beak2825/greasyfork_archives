// ==UserScript==
// @name         wan-SVIP
// @namespace    svip.wo1wan.taozhiyu.gitee.io
// @version      0.1
// @description  一直解锁一直爽
// @author       涛之雨
// @match        https://play.wo1wan.com/*
// @icon         https://static.wo1wan.com/headimg/s1/svip/1.gif
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @grant        unsafeWindow
// @run-at       document-start
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/455945/wan-SVIP.user.js
// @updateURL https://update.greasyfork.org/scripts/455945/wan-SVIP.meta.js
// ==/UserScript==

/* global ajaxHooker*/
(function() {
    'use strict';
    // cxxjackie 牛逼
    ajaxHooker.hook(request => {
        if (request.url.endsWith('userinfo')) {
            request.response = res => {
                const a=JSON.parse(res.responseText);
                a.info.LevelInfo.VipLevel=10;
                a.info.LevelInfo.Svip=1;
                res.responseText=JSON.stringify(a);
            };
        }
    });
})();