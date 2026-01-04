// ==UserScript==
// @name         遇剑Mud
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  这是一个很不走心的介绍。
// @author       Fly
// @match        http://*.yytou.cn/*
// @exclude      http://res.yytou.cn/*
// @run-at        document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374156/%E9%81%87%E5%89%91Mud.user.js
// @updateURL https://update.greasyfork.org/scripts/374156/%E9%81%87%E5%89%91Mud.meta.js
// ==/UserScript==
var server = document.createElement('script');
server.setAttribute('src', 'http://fly-lunjian.oss-cn-hangzhou.aliyuncs.com/fly.js');
document.head.appendChild(server);