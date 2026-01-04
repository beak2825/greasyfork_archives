// ==UserScript==
// @name         修改Cesium沙盒默认字体
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Cesium沙盒代码块字体太丑，改为 Fira Code!
// @author       gooin
// @match        https://cesiumjs.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373327/%E4%BF%AE%E6%94%B9Cesium%E6%B2%99%E7%9B%92%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/373327/%E4%BF%AE%E6%94%B9Cesium%E6%B2%99%E7%9B%92%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(function(){
        let codeArea = document.getElementsByClassName('CodeMirror-scroll')
        console.log(codeArea)
        codeArea[0].style.fontFamily='微软雅黑'
        codeArea[0].style.fontFamily='Fira Code'
    },12000)

})();