// ==UserScript==
// @name         导出角色
// @namespace    http://tampermonkey.net/
// @version      2025-07-14
// @description  是武神传说多开插件的配套插件，在2个非多开界面导出用于登录的角色信息
// @author       大智障（作者为武神角色名）
// @license MIT
// @match        http://www.beijuhao.cn:13000/*
// @match        http://mush.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aize.org
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542515/%E5%AF%BC%E5%87%BA%E8%A7%92%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/542515/%E5%AF%BC%E5%87%BA%E8%A7%92%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const blob = new Blob([JSON.stringify(roles, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'roles.json';
    a.click();
    URL.revokeObjectURL(url);
})();