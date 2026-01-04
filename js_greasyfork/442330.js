// ==UserScript==
// @name             Fake PerformanceObserver
// @description      Unblock pages broken by dom.enable_performance_observer = false
// @author           xiaoxiaoflood
// @match            https://*.github.com/*
// @match            https://help.shopee.com.br/*
// @version          2022.03.29
// @run-at           document-start
// @namespace https://greasyfork.org/users/5802
// @downloadURL https://update.greasyfork.org/scripts/442330/Fake%20PerformanceObserver.user.js
// @updateURL https://update.greasyfork.org/scripts/442330/Fake%20PerformanceObserver.meta.js
// ==/UserScript==

unsafeWindow.PerformanceObserver = exportFunction(function(){}, unsafeWindow);
