// ==UserScript==
// @name         Improve Chinese text on Firefox
// @namespace    http://tampermonkey.net/
// @version      2024-10-26-04
// @description  Change lang="zh" attribute to lang="zh-cn" so Firefox can style it correctly
// @author       bellisk
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@a03933c5e42343b434c7800eb2777575342d8287/waitForKeyElements.js
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/514177/Improve%20Chinese%20text%20on%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/514177/Improve%20Chinese%20text%20on%20Firefox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements("*:lang(zh)", (element) => {
        element.lang = "zh-cn";
    })
})();
