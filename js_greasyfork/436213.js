// ==UserScript==
// @name        北京继续教育网chinahrt自动播放插件
// @include      http://web.chinahrt.com
// @include      https://web.chinahrt.com
// @version      1.0
// @description  北京继续教育网后台自动播放插件
// @author       Yang Kang
// @match        http://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        http://videoadmin.chinahrt.com/videoPlay/play*
// @match        https://videoadmin.chinahrt.com.cn/videoPlay/play*
// @match        https://videoadmin.chinahrt.com/videoPlay/play*
// @grant        none
// @license MIT
// @namespace http://web.chinahrt.com
// @downloadURL https://update.greasyfork.org/scripts/436213/%E5%8C%97%E4%BA%AC%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91chinahrt%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/436213/%E5%8C%97%E4%BA%AC%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91chinahrt%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onfocus = function(){console.log('on focus')};
    window.onblur = function(){console.log('on blur')};
})();