// ==UserScript==
// @name         CnBeta去除屏蔽Adblock提示
// @version      0.02
// @description 去除cnBeta屏蔽Adblock的红色提示
// @author       ANDY
// @match        http://*.cnbeta.com/articles/*
// @grant         unsafeWindow
// @run-at       document-body
// @namespace https://greasyfork.org/users/110968
// @downloadURL https://update.greasyfork.org/scripts/28256/CnBeta%E5%8E%BB%E9%99%A4%E5%B1%8F%E8%94%BDAdblock%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/28256/CnBeta%E5%8E%BB%E9%99%A4%E5%B1%8F%E8%94%BDAdblock%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var uw = this;
    (function() {
        uw[atob("cmFuZG9tU3RyaW5n")] = function() {
            throw 'Fuck cnbeta to anti Adblock!';
        };
    })();
}).apply(unsafeWindow);