// ==UserScript==
// @name        humanbenchmark.com Cheats
// @name:zh-CN  人类测试作弊工具
// @namespace   Violentmonkey Scripts
// @match       https://humanbenchmark.com/tests/reactiontime
// @grant       none
// @version     1.2
// @author      -
// @license     MIT
// @run-at      document-idle
// @description:zh-cn 尽情享受作弊之旅吧！
// @description 2023/10/21 08:20:09
// @downloadURL https://update.greasyfork.org/scripts/477907/humanbenchmarkcom%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/477907/humanbenchmarkcom%20Cheats.meta.js
// ==/UserScript==
'use strict';
const ev = new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
});
const _dd = document.querySelector('[data-test="true"]');
new MutationObserver(list => {
    if (list[0].target.classList[0] == "view-go")
        _dd.dispatchEvent(ev);

}).observe(_dd, {attributeFilter: ['class']});

