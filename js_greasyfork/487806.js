// ==UserScript==
// @name         CSDN免登录复制【归忆_AC】
// @namespace    https://blog.csdn.net/qq1677852098
// @version      1.2
// @description  1.使得点击【登录复制】后可以直接复制，而不用登录; 2.设置整个页面的文本为可选中以及复制。
// @author       guiyi_ac
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license      MIT
// @thisURL      https://greasyfork.org/zh-CN/scripts/487806-csdn%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6-%E5%BD%92%E5%BF%86-ac
// @downloadURL https://update.greasyfork.org/scripts/487806/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E3%80%90%E5%BD%92%E5%BF%86_AC%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/487806/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E3%80%90%E5%BD%92%E5%BF%86_AC%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByTagName('pre');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        element.innerHTML = element.innerHTML.replace(/signin/g, 'copyCode');
    }

    window.oncontextmenu = document.oncontextmenu = document.oncopy = null;

    var bodies = document.querySelectorAll('body');
    bodies.forEach(function(body) {
        var displayStyle = body.style.display;
        body.style.display = 'none';
        void body.offsetWidth;
        body.style.display = displayStyle;
    });

    [...document.querySelectorAll('body, body *')].forEach(dom => {
        ['onselect', 'onselectstart', 'onselectend', 'ondragstart', 'ondragend', 'oncontextmenu', 'oncopy'].forEach(ev => dom.removeAttribute(ev));
        dom.style['user-select'] = 'auto';
    });
})();