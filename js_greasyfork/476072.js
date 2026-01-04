// ==UserScript==
// @name         markVIP
// @namespace    http://markVIP.taozhiyu.github.io/
// @version      0.1
// @description  VIP for maxiang
// @author       涛之雨
// @match        https://maxiang.io/*
// @icon         http://maxiang.io/favicon.ico
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/476072/markVIP.user.js
// @updateURL https://update.greasyfork.org/scripts/476072/markVIP.meta.js
// ==/UserScript==

/* global ajaxHooker*/
(function() {
    'use strict';
    ajaxHooker.hook(request => {
        if (request.url.endsWith('/user')) {
            request.response = res => {
                const json = JSON.parse(res.responseText);
                json.vip={vip: '29999-12-31', days: 5201314, count: Math.floor(Math.random()*100), is_expired: false};
                res.responseText = JSON.stringify(json);
            };
        }
    });
})();