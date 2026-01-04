// ==UserScript==
// @name         CSDN博客免登陆
// @namespace    https://coding.net/u/BackRunner/p/GreaseMonkey-JS/git
// @version      1.0
// @description  Fuck it up!
// @author       BackRunenr
// @include      *://blog.csdn.net/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375156/CSDN%E5%8D%9A%E5%AE%A2%E5%85%8D%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/375156/CSDN%E5%8D%9A%E5%AE%A2%E5%85%8D%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.csdn.anonymousUserLimit = "no";
})();