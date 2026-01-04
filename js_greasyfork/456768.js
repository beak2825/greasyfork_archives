/* eslint-disable strict */
// ==UserScript==
// @name            B站顽固广告清除
// @version         1.1.2.20240827
// @namespace       laster2800
// @author          Laster2800
// @description     清除B站那些无法通过 AdGuard 等扩展移除的广告（普通广告不处理）
// @icon            https://www.bilibili.com/favicon.ico
// @homepageURL     https://greasyfork.org/zh-CN/scripts/456768
// @supportURL      https://greasyfork.org/zh-CN/scripts/456768/feedback
// @license         LGPL-3.0
// @noframes
// @include         *://search.bilibili.com/*
// @require         https://update.greasyfork.org/scripts/409641/1435266/UserscriptAPI.js
// @require         https://update.greasyfork.org/scripts/432002/1161015/UserscriptAPIWait.js
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/456768/B%E7%AB%99%E9%A1%BD%E5%9B%BA%E5%B9%BF%E5%91%8A%E6%B8%85%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/456768/B%E7%AB%99%E9%A1%BD%E5%9B%BA%E5%B9%BF%E5%91%8A%E6%B8%85%E9%99%A4.meta.js
// ==/UserScript==

/* global UserscriptAPI */
const selector = 'a[href*="cm.bilibili.com"][data-target-url]'
const callback = identity => { identity.closest('.bili-video-card').parentElement.style.display = 'none' }
new UserscriptAPI().wait.executeAfterElementLoaded({ selector, callback, multiple: true, repeat: true, timeout: 0 })
