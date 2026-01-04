// ==UserScript==
// @name       强制新窗口打开
// @namespace    none
// @version      1
// @description  所有网站强制新窗口打开
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377902/%E5%BC%BA%E5%88%B6%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/377902/%E5%BC%BA%E5%88%B6%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.getElementsByTagName('a');
    var len = links.length;
    for(var i = 0; i < len; i++){
        links[i].setAttribute('target','_blank');
    }
    // Your code here...
})();