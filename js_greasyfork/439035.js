// ==UserScript==
// @name         pcbeta去提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  远景去广告的弹窗
// @author       不知道是谁写的
// @match        *://bbs.pcbeta.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439035/pcbeta%E5%8E%BB%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/439035/pcbeta%E5%8E%BB%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
if (document.querySelector("#append_parent")!=null)
    {
        document.querySelector("#append_parent").remove()
    };
})();