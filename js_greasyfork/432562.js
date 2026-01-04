// ==UserScript==
// @name         All A Self
// @namespace    https://space.bilibili.com/52159566
// @version      0.1
// @description  [All A Self]
// @author       苏芣苡
// @match        *://*/*
// @icon         https://q.qlogo.cn/g?b=qq&s=100&nk=318328258
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/432562/All%20A%20Self.user.js
// @updateURL https://update.greasyfork.org/scripts/432562/All%20A%20Self.meta.js
// ==/UserScript==

Array.from(document.querySelectorAll('a')).forEach(a =>(a.target='_self'))