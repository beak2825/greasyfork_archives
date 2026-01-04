// ==UserScript==
// @name         MCBBS红字按钮
// @namespace    https://www.mcbbs.net/?3074655
// @version      0.1
// @description  在编辑器高级模式中添加红字按钮
// @author       开心的阿诺
// @match        https://www.mcbbs.net/*
// @icon         https://www.mcbbs.net/favicon.ico
// @grant        unsafeWindow
// @run-at       document-body
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/471667/MCBBS%E7%BA%A2%E5%AD%97%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/471667/MCBBS%E7%BA%A2%E5%AD%97%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (typeof jQuery == "undefined") return;
    let $ = unsafeWindow.jQuery;
    $(document).ready(() => {
        if (!$('#editorbox')[0]) return;
        $('#e_adv_s1')[0].innerHTML += `<a id="e_red" title="文字最大字号红色加粗" init="true" style="background:red;" href="javascript:;" onclick="discuzcode('fontsize', 7);discuzcode('bold');discuzcode('forecolor', 'Red');">红字</a>`;
    });
})();