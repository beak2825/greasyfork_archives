// ==UserScript==
// @name         StackOverflow净化器
// @namespace    https://github.com/EternalPhane/UserScripts/
// @version      0.2.4
// @description  屏蔽某个智障用户Ciro Santilli
// @author       EternalPhane
// @include      /^https?:\/\/(\w+\.)?stack(overflow|exchange)\.com\//
// @include      /^https?:\/\/(\w+\.)?askubuntu\.com\//
// @include      /^https?:\/\/(\w+\.)?serverfault\.com\//
// @downloadURL https://update.greasyfork.org/scripts/32236/StackOverflow%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/32236/StackOverflow%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(() => {
    'use strict';
    $(() => {
        $('.user-info:contains(Ciro Santilli)').remove();
        $('.comment-user:contains(Ciro Santilli)').remove();
    });
})();
