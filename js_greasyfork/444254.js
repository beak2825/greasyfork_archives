// ==UserScript==
// @name        安徽专业技术人员继续教育在线-秒过课
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.21
// @author      -
// @match        *://*.zjzx.ah.cn/courseplay*
// @grant        none
// @license MIT
// @description 2022/4/30 09:10:15
// @downloadURL https://update.greasyfork.org/scripts/444254/%E5%AE%89%E5%BE%BD%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF-%E7%A7%92%E8%BF%87%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/444254/%E5%AE%89%E5%BE%BD%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9C%A8%E7%BA%BF-%E7%A7%92%E8%BF%87%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
   setInterval(function(){
   $('video').prop('volume', 0);
   $('video').get(0).play()
   $('video')[0].playbackRate=4
},3000)
})();