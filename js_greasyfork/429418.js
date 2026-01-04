// ==UserScript==
// @name         潍坊职业培训考试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速跳转页面到潍坊职业培训考试
// @author       You
// @match        https://www.wfjtip.com/lessondetail*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/429418/%E6%BD%8D%E5%9D%8A%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/429418/%E6%BD%8D%E5%9D%8A%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.window.toastr_lesson();
})();