// ==UserScript==
// @name         ITeye 自动展开
// @namespace    iteye
// @version      0.1
// @description  ITeye 自动展开阅读
// @author       gorgias
// @match        *://*.iteye.com/blog/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375516/ITeye%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/375516/ITeye%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var iteye = setInterval(function(){
        document.getElementById('btn-readmore').click()
    }, 100);
})();