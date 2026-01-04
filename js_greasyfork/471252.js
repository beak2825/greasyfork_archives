// ==UserScript==
// @name         解决Google联想词自动上屏Bug
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license MIT
// @match        https://www.google.com/search*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @description 禁用Google搜索框的自动补全
// @downloadURL https://update.greasyfork.org/scripts/471252/%E8%A7%A3%E5%86%B3Google%E8%81%94%E6%83%B3%E8%AF%8D%E8%87%AA%E5%8A%A8%E4%B8%8A%E5%B1%8FBug.user.js
// @updateURL https://update.greasyfork.org/scripts/471252/%E8%A7%A3%E5%86%B3Google%E8%81%94%E6%83%B3%E8%AF%8D%E8%87%AA%E5%8A%A8%E4%B8%8A%E5%B1%8FBug.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .logo ~ div ~ div > div ~ div > div ~ div > div ~ div ul { pointer-events:none; }
    `);
})();