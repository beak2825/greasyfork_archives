// ==UserScript==
// @name         RelieveCopy
// @namespace    
// @version      0.1
// @description  复制知乎问题文本
// @author       gxr
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395450/RelieveCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/395450/RelieveCopy.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log('RelieveCopy: copy事件已被阻止');
    var firstChild = document.firstElementChild;
    firstChild.addEventListener('copy',function (e) {
        e.stopPropagation();
        return false;
    })
})();