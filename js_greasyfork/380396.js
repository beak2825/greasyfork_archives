// ==UserScript==
// @name         超简易解除网页限制_精简_改版
// @namespace    https://greasyfork.org/zh-CN/users/269998-hu71e
// @version      1.1.1
// @description  解除网页的复制、拖动、选中、右键、粘贴等限制。hunter原作28行，由xinggsf精简至16行。增加解除CSS限制。
// @author       hunter && xinggsf
// @include      *
// @exclude      *baidu.com*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/380396/%E8%B6%85%E7%AE%80%E6%98%93%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6_%E7%B2%BE%E7%AE%80_%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/380396/%E8%B6%85%E7%AE%80%E6%98%93%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6_%E7%B2%BE%E7%AE%80_%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var $ = window.jQuery,
    events = ['contextmenu', 'dragstart', 'mouseup', 'copy', 'beforecopy', 'selectstart', 'select', 'keydown'];
    function unbind(ele) {
        events.forEach(function (evt) {
            ele['on' + evt] = null;
            if ($) $(ele).unbind(evt);
        });
    };
    function runScript() {
        [window, document].forEach(unbind);
        events.forEach.call(document.querySelectorAll('*'), unbind);
    }
    window.onload = runScript;
    window.onhashchange = function () {
        setTimeout(runScript, 300);
    };

	GM_addStyle(
		`html, * {
			-webkit-user-select:text !important;
			-moz-user-select:text !important;
            -ms-user-select:text !important;
			user-select:text !important;
		}
		::-moz-selection {color:#111 !important; background:#05D3F9 !important;}
		::selection {color:#111 !important; background:#05D3F9 !important;}`
	);

})();