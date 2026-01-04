// ==UserScript==
// @name         Google超链接从空白标签打开
// @namespace    https://github.com/yeomanye
// @version      0.3.2
// @description  点击超链接从新标签页打开，支持google
// @author       Ming Ye
// @match        https://www.google.com
// @include      https://www.google*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35230/Google%E8%B6%85%E9%93%BE%E6%8E%A5%E4%BB%8E%E7%A9%BA%E7%99%BD%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/35230/Google%E8%B6%85%E9%93%BE%E6%8E%A5%E4%BB%8E%E7%A9%BA%E7%99%BD%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.getElementsByTagName('a');
    for (var i = 0, len = links.length; i < len; i++) {
        links[i].setAttribute('target', '_blank');
    }
})();