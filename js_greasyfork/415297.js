// ==UserScript==
// @namespace yunyuyuan
// @name smartCopy
// @description 一键复制文本，360doc，segmentfalut都可复制。
// @include *
// @version 0.0.1.20201201144033
// @downloadURL https://update.greasyfork.org/scripts/415297/smartCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/415297/smartCopy.meta.js
// ==/UserScript==

(function (){
    'use strict';
    window.onload = function (){
        document.addEventListener('copy', function (e){
            e.stopPropagation();
        }, true);
    }
})()