// ==UserScript==
// @name Abema 区域限制v
// @description 解除Abema区域限制
// @version 1.0.0
// @run-at document-end
// @namespace Violentmonkey Scripts
// @match https://abema.tv/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/422135/Abema%20%E5%8C%BA%E5%9F%9F%E9%99%90%E5%88%B6v.user.js
// @updateURL https://update.greasyfork.org/scripts/422135/Abema%20%E5%8C%BA%E5%9F%9F%E9%99%90%E5%88%B6v.meta.js
// ==/UserScript==
Object.defineProperty(__CLIENT_REGION__, 'isAllowed', {
get: () => true
});
Object.defineProperty(__CLIENT_REGION__, 'status', {
get: () => false
});
