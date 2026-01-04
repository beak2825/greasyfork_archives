// ==UserScript==
// @name         Huya Styles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  update huya styles
// @author       You
// @match        *://www.huya.com/*
// @match        *://huya.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460608/Huya%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/460608/Huya%20Styles.meta.js
// ==/UserScript==

function repeat(handler, times) {
    let count = 0;

    handler();

    const interval = setInterval(() => {
        handler();
        count++;

        if (count > times) {
           clearInterval(interval);
        }
    }, 60);
}

function deleteElements(selectors) {
    selectors.map(selector => {
        try {
            document.querySelector(selector).style.display = 'none';
        } catch (err) {
            // do noting
        }
    });
}

function setStyles(elements) {
    elements.map(([selector, key, value]) => {
        try {
            document.querySelector(selector).style[key] = value;
        } catch (err) {
            // do noting
        }
    });

}

function init() {
    deleteElements([
        '.mod-sidebar',
        '.hy-nav-item-youliao.hy-nav-item',
        '.wrap-ext.chat-wrap-panel',
        '.diy-comps-wrap',
        '#player-mouse-event-wrap',
        '.J_comp_2.diy-comp',
        '.dot--g92BzaqFUtbPTJytM_job.NavItem--1jr9x80QTPbnrDwqn834hF',
        '#duya-header-logo',
        '.player-gift-wrap',
    ]);

    setStyles([
        ["#main_col", "paddingTop", "32px"],
        ["#J_mainRoom", "minWidth", "0px"],
    ]);
}

(function() {
    'use strict';

    repeat(init, 100);
})();

