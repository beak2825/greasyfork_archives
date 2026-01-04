// ==UserScript==
// @name Abema 区域限制
// @version 1.0.0.1
// @description:zh-cn Abema TV 地区限制解除+
// @run-at document-end
// @namespace Violentmonkey Scripts
// @match https://abema.tv/*
// @grant none
// @description Abema TV 地区限制解除+
// @downloadURL https://update.greasyfork.org/scripts/422222/Abema%20%E5%8C%BA%E5%9F%9F%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/422222/Abema%20%E5%8C%BA%E5%9F%9F%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
Object.defineProperty(__CLIENT_REGION__, 'isAllowed', {
  get: () => true
});
Object.defineProperty(__CLIENT_REGION__, 'status', {
  get: () => false
});