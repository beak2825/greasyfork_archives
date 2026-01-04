// ==UserScript==
// @name         ms自动保存
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Metersphere自动保存功能测试用例，默认每隔60秒保存一次
// @author       9tester
// @match        ms.dev.9ji.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9ji.com
// @grant        none
// @license    GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/442293/ms%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/442293/ms%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==
setInterval(() => {
    document.querySelector('.save-btn').click()
}, 1000 * 60)