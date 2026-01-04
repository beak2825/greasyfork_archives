// ==UserScript==
// @name              connected papers Fake Premium
// @name:zh-cn        connected papers 假装VIP
// @namespace         taozhiyu.github.io
// @version           0.1
// @description       remove limit
// @description:zh-cn 去除限制
// @author            涛之雨
// @match             https://www.connectedpapers.com/*
// @icon              http://connectedpapers.com/favicon.ico
// @require           https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @grant             none
// @license           WTFPL
// @downloadURL https://update.greasyfork.org/scripts/466687/connected%20papers%20Fake%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/466687/connected%20papers%20Fake%20Premium.meta.js
// ==/UserScript==

/* global ajaxHooker*/
(function () {
    'use strict';
    let islogin = false;
    const cookieDesc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
        Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
    if (cookieDesc && cookieDesc.configurable) {
        Object.defineProperty(document, 'cookie', {
            get: () => cookieDesc.get.call(document),
            set(val) {
                !islogin && val.includes("graph_visit_timestamps") || cookieDesc.set.call(document, val);
            }
        });
    }
    const originalSetItem = localStorage.setItem;

    localStorage.setItem = function (key, value) {
        !islogin && key === "graph_visit_timestamps" || originalSetItem.call(localStorage, key, value);
    };

    ajaxHooker.hook(request => {
        if (request.url.endsWith('login')) {
            request.response = res => {
                islogin = true;
                const json = JSON.parse(res.responseText);
                json.premium_valid_until = 9e11;
                res.responseText = JSON.stringify(json);
            };
        }
    });
})();