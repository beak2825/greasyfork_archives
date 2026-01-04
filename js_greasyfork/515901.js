// ==UserScript==
// @name         AppLink 自動關分頁
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自動把擾人的AppLink分頁關閉
// @author       Arxing
// @match        https://app.asana.com/-/desktop_app_link*
// @match        https://www.figma.com/design/*
// @match        https://pinkoi.slack.com/archives/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=asana.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515901/AppLink%20%E8%87%AA%E5%8B%95%E9%97%9C%E5%88%86%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/515901/AppLink%20%E8%87%AA%E5%8B%95%E9%97%9C%E5%88%86%E9%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        window.close();
    }, 2000);
})();