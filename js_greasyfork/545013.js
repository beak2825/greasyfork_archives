// ==UserScript==
// @name         去掉萌娘百科的背景喵～
// @namespace    https://blockydeer.me/
// @version      2025-07-24
// @description  去掉萌娘百科的背景
// @author       BlockyDeer
// @match        *://zh.moegirl.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moegirl.org.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545013/%E5%8E%BB%E6%8E%89%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E7%9A%84%E8%83%8C%E6%99%AF%E5%96%B5%EF%BD%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/545013/%E5%8E%BB%E6%8E%89%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E7%9A%84%E8%83%8C%E6%99%AF%E5%96%B5%EF%BD%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let attempts = 0;
    const max_attempts = 10;
    let counter = 0;

    let selector_to_delete = new Array();
    selector_to_delete.push("#moe-global-background");

    function delete_element() {
        selector_to_delete.forEach(function (item) {
            const element = document.querySelector(item);
            if (element) {
                element.remove();
                console.log(`Removed selector to ${item}`);
                counter++;
            }
        });
        return counter == selector_to_delete.length;
    }

    if (delete_element()) return;
    const observer = new MutationObserver(function() {
        attempts++;
        if (delete_element() || attempts >= max_attempts) {
            observer.disconnect();
            if (attempts >= max_attempts) {
                console.warn("Reaches attempting trying limitation. Dismatch elements.");
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    setTimeout(() => {
        observer.disconnect();
        console.warn("Observer timeout!");
    }, 10000);
})();