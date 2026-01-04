// ==UserScript==
// @name        Github Auto Confirm
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.1
// @description Automatically enter confirmation text in Github
// @author      wzshiming
// @match       *://github.com/*
// @grant       none
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/431484/Github%20Auto%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/431484/Github%20Auto%20Confirm.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var items = document.getElementsByTagName("button");
    for (var i in items) {
        let item = items[i]
        if (item && item.hasAttribute && item.hasAttribute("data-disable-invalid") && item.hasAttribute("disabled") &&
            item.previousElementSibling && item.previousElementSibling.children &&
            item.parentElement && item.parentElement.previousElementSibling && item.parentElement.previousElementSibling.children) {
            item.removeAttribute("disabled");
            item.previousElementSibling.children[0].value = item.parentElement.previousElementSibling.children[0].innerText;
        }
    }
})();
