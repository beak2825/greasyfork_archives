// ==UserScript==
// @name         Fixed Element Hider
// @namespace    https://github.com/ephanoco
// @version      0.1
// @description  Hide annoying fixed elements when scrolling through the page.
// @author       Samuel
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/474301/Fixed%20Element%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/474301/Fixed%20Element%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.indexOf('https://zhuanlan.zhihu.com/p/') !== -1) {
        var header = document.querySelector('.ColumnPageHeader-Wrapper')
        header.style.display = 'none'
        var actions = document.querySelector('.RichContent-actions')
        actions.style.display = 'none'
    } else if (window.location.href.indexOf('https://blog.csdn.net/') !== -1) {
        var toolbar = document.querySelector('#csdn-toolbar')
        toolbar.style.display = 'none'
        var toolbox = document.querySelector('.left-toolbox')
        toolbox.style.display = 'none'
    }
})();