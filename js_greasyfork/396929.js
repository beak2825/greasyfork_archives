// ==UserScript==
// @name         斗鱼自动选择最高画质+网页全屏
// @namespace    https://github.com/qianjiachun
// @version      0.0.4
// @description  自动选择最高画质，自动网页全屏
// @author       小淳
// @match			*://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @match			*://*.douyu.com/topic/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/396929/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%2B%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/396929/%E6%96%97%E9%B1%BC%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%2B%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let intID1 = setInterval(() => {
                if (document.getElementsByClassName("wfs-2a8e83").length > 0) {
                    clearInterval(intID1);
                    document.querySelector('div.wfs-2a8e83').click();
					document.querySelectorAll(".tipItem-898596 > ul > li")[0].click();
                }
            }, 1000);

})();