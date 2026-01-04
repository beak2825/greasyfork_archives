// ==UserScript==
// @name Abema 区域限制
// @version 1.0.0
// @run-at document-end
// @namespace Violentmonkey Scripts
// @match https://abema.tv/*
// @grant none
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/406289/Abema%20%E5%8C%BA%E5%9F%9F%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/406289/Abema%20%E5%8C%BA%E5%9F%9F%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
Object.defineProperty(__CLIENT_REGION__, 'isAllowed', {
  get: () => true
});
Object.defineProperty(__CLIENT_REGION__, 'status', {
  get: () => false
})
