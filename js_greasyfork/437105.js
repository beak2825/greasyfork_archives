// ==UserScript==
// @name         虚幻官网 在线课程 视频窗口放大
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Zealots
// @match        *://learn.unrealengine.com/*
// @description  虚幻官网在线课程视频窗口放大
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437105/%E8%99%9A%E5%B9%BB%E5%AE%98%E7%BD%91%20%E5%9C%A8%E7%BA%BF%E8%AF%BE%E7%A8%8B%20%E8%A7%86%E9%A2%91%E7%AA%97%E5%8F%A3%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/437105/%E8%99%9A%E5%B9%BB%E5%AE%98%E7%BD%91%20%E5%9C%A8%E7%BA%BF%E8%AF%BE%E7%A8%8B%20%E8%A7%86%E9%A2%91%E7%AA%97%E5%8F%A3%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function AddStyle(){
        $('div.col-md-8.col-md-offset-2.panel-body').css('margin-left','0px').css('width','100%');
    }

    AddStyle();
})();