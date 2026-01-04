// ==UserScript==
// @name         飞客论坛显示所有评论
// @namespace    Thomaskara
// @version      0.1
// @description  飞客信用卡论坛显示所有评论
// @author       Thomas Kara
// @match        http*://www.flyertea.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424115/%E9%A3%9E%E5%AE%A2%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/424115/%E9%A3%9E%E5%AE%A2%E8%AE%BA%E5%9D%9B%E6%98%BE%E7%A4%BA%E6%89%80%E6%9C%89%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jq(".comiis_width").find(".comiis_vrx").show();
})();