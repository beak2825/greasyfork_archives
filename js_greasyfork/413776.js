// ==UserScript==
// @name         Tweak YunERP
// @namespace    stph
// @version      0.1
// @description  try to take over the world!
// @author       aligo
// @match        http://erp.yiwen.com.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/413776/Tweak%20YunERP.user.js
// @updateURL https://update.greasyfork.org/scripts/413776/Tweak%20YunERP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var setStyle = function(el, attr, value) {
        el.style[attr] = value || null;
    };
    var clearStyles = function() {
        document.querySelectorAll('.mini-datagrid').forEach(function(el) {
            var parentEl = el.parentNode;
            if (parentEl.tagName == 'DIV') {
                setStyle(parentEl, 'width');
                setStyle(parentEl, 'height');
            }
        });
    }
    clearStyles();
})();