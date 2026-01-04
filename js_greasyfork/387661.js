// ==UserScript==
// @name         chinahrt自动播放插件
// @include      http://web.chinahrt.com
// @include      https://web.chinahrt.com
// @version      1.2
// @description  autoplay
// @author       JoshuaYang
// @match        http://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        http://videoadmin.chinahrt.com/videoPlay/play*
// @match        https://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        https://videoadmin.chinahrt.com/videoPlay/play*
// @grant        none
// @namespace http://web.chinahrt.com
// @downloadURL https://update.greasyfork.org/scripts/387661/chinahrt%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/387661/chinahrt%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onfocus = function(){console.log('on focus')};
    window.onblur = function(){console.log('on blur')};
})();