// ==UserScript==
// @name         阮一峰 blog ad
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  防止 阮一峰 博客屏蔽adblock
// @author       You
// @match        *://www.ruanyifeng.com/*
// @match        *://*.ruanyifeng.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375685/%E9%98%AE%E4%B8%80%E5%B3%B0%20blog%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/375685/%E9%98%AE%E4%B8%80%E5%B3%B0%20blog%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // console.info('Hello Tampermonkey');

    var img = document.createElement('img');
    img.setAttribute('src', 'wangbase.com/blogimg/asset/');
    img.width = 0;
    img.height = 0;
    var a = document.createElement('a');
    a.appendChild(img)
    document.body.insertBefore(a, document.body.firstChild);

    var oldGetComputedStyle = window.getComputedStyle;

    window.getComputedStyle = function(dom) {
        if (dom == img) {
			return {
				display: 'block'
			};
		} else {
			return oldGetComputedStyle(dom);
		}
    };

})();