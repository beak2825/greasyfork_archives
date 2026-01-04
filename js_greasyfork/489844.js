// ==UserScript==
// @name         Auto refresh
// @name:zh-CN   自动刷新
// @description  Automatically refresh current page with required number of times.
// @description:zh-CN  自动刷新当前页面所需的次数。
// @namespace    myway42.auto-refresh
// @version      0.0.4
// @author       myway42
// @homepage     https://github.com/myway42/Auto-refresh
// @license      MIT
// @match        *://*/*
// @icon         data:image/png;base64,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
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/489844/Auto%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/489844/Auto%20refresh.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const ORIGIN = window.location.href;
    let t = GM_getValue(ORIGIN);
    if (!t) t = +prompt("Enter refresh times", "refresh times");
    if (!(typeof t === 'number' && t > 0)) return;
    t--;
    GM_setValue(ORIGIN, t);
    window.location.reload();
})();
