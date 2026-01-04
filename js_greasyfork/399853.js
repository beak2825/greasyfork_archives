// ==UserScript==
// @name         BVtoAV
// @namespace    jssm_patch
// @version      0.1
// @description  b站恢复av号
// @author       JSSMME
// @match        *www.bilibili.com/video/BV*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399853/BVtoAV.user.js
// @updateURL https://update.greasyfork.org/scripts/399853/BVtoAV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var str=document.getElementsByTagName('html')[0].innerHTML;
    var n = str.indexOf("https://www.bilibili.com/video/av");
    var m = str.indexOf("\"><meta data-vue-meta=\"true\" itemprop=\"i");
    n = n+31;
    var av = str.slice(n,m);
    //alert(av);
    window.location.href=av;

})();