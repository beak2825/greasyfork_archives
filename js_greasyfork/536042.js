// ==UserScript==
// @name         Change Page Name
// @name:zh-CN   自动更改页面名称
// @namespace    https://greasyfork.org/en/scripts/536042-change-page-name/
// @version      2025-05-16
// @description  change any page title with tampermonkey
// @description:zh-cn  通过油猴自动修改页面名称
// @author       opzc35
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/536042/Change%20Page%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/536042/Change%20Page%20Name.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const newTitle = "E - Fruit Lineup";
    document.title = newTitle;
    const observer = new MutationObserver(() => {
        if (document.title !== newTitle) {
            document.title = newTitle;
        }
    });
    observer.observe(document.querySelector('title'), {
        childList: true
    });
})();