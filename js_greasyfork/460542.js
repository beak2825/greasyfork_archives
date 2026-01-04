// ==UserScript==
// @name         openAi 自动改缓存（还在测试）
// @namespace    https://github.com/qdchenyixuan/Userscript-JS
// @version      0.11
// @description  openAi 自动改缓存~
// @author       clear
// @match        https://chat.openai.com/*
// @grant        GM_log
// @grant        GM_addStyle
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/460542/openAi%20%E8%87%AA%E5%8A%A8%E6%94%B9%E7%BC%93%E5%AD%98%EF%BC%88%E8%BF%98%E5%9C%A8%E6%B5%8B%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/460542/openAi%20%E8%87%AA%E5%8A%A8%E6%94%B9%E7%BC%93%E5%AD%98%EF%BC%88%E8%BF%98%E5%9C%A8%E6%B5%8B%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
  javascript: window.localStorage.removeItem(Object.keys(window.localStorage).find(i => i.startsWith('@@auth0spajs')));
})();
