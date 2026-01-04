// ==UserScript==
// @name         NGA ReLocation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将不显示nga评论的页面重新定向到显示评论的页面!
// @author       Bigduck
// @match         *://bbs.nga.cn/*
// @match         *://ngabbs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=178.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450374/NGA%20ReLocation.user.js
// @updateURL https://update.greasyfork.org/scripts/450374/NGA%20ReLocation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.host='nga.178.com'
    // Your code here...
})();