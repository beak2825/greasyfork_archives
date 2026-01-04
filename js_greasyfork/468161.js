// ==UserScript==
// @name                [F2] Reset Page Title
// @name:zh-CN          [F2] 重设页面标题
// @description         Press F2 to reset the tab title
// @description:zh-CN   按F2重新设置标签页标题

// @author              Moshel
// @namespace           https://hzy.pw
// @supportURL          https://github.com/h2y/link-fix
// @license             GPL-3.0

// @version      1.0.0
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-body
// @require      https://cdn.staticfile.org/keymaster/1.6.1/keymaster.min.js
// @downloadURL https://update.greasyfork.org/scripts/468161/%5BF2%5D%20Reset%20Page%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/468161/%5BF2%5D%20Reset%20Page%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let defaultTitle = document.title;
    let title = sessionStorage.getItem('title_by_userscript');
    let intervalID = null;
    if (title) {
        startInterval(title);
    }

    function startInterval(newTitle) {
        title = newTitle;
        sessionStorage.setItem('title_by_userscript', newTitle);
        document.title = newTitle;
        if (!intervalID) {
            intervalID = setInterval(() => {
                document.title = title;
            }, 6666);
        }
    }

    key("f2", _ => {
        let newTitle = prompt('请为页面设置一个标题', title ? title : document.title);
        if (newTitle) {
            startInterval(newTitle);
        } else {
            clearInterval(intervalID);
            intervalID = null;
            document.title = defaultTitle;
        }
    });
})();
