// ==UserScript==
// @name         toutiao full screan
// @namespace    http://www.netroby.com/
// @version      0.0.1
// @description  干净清爽的全屏阅读头条文章
// @author       wing
// @match        https://www.toutiao.com/i*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420526/toutiao%20full%20screan.user.js
// @updateURL https://update.greasyfork.org/scripts/420526/toutiao%20full%20screan.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".toutiao-header").style.display = "none"
    document.querySelector(".question-form-wrapper").style.display = "none"
    document.querySelector(".tools-wrapper").style.display = "none"
    document.querySelector(".media-info-wrapper").style.display = "none"
    document.querySelector(".article-content").style.float = "unset"
    document.querySelector(".article-content").style.width = "100%"
    document.querySelector(".toolbar").style.display = "none"
    // Your code here...
})();