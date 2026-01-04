// ==UserScript==
// @name        斗鱼整人脚本（自动调整清晰度）
// @namespace   http://tampermonkey.net/
// @version     0.0.1
// @icon        http://www.douyutv.com/favicon.ico
// @description 当被整用户使用斗鱼观看直播，几分钟内就自动调整清晰度，达到影响用户体验的效果
// @author      bk
// @compatible  chrome
// @require http://cdn.bootcss.com/jquery.min.js
// @match       *://*.douyu.com/0*
// @match       *://*.douyu.com/1*
// @match       *://*.douyu.com/2*
// @match       *://*.douyu.com/3*
// @match       *://*.douyu.com/4*
// @match       *://*.douyu.com/5*
// @match       *://*.douyu.com/6*
// @match       *://*.douyu.com/7*
// @match       *://*.douyu.com/8*
// @match       *://*.douyu.com/9*
// @note        2020.08.06-V2.2.07      鱼粮不足会取消寻宝
// @downloadURL https://update.greasyfork.org/scripts/410227/%E6%96%97%E9%B1%BC%E6%95%B4%E4%BA%BA%E8%84%9A%E6%9C%AC%EF%BC%88%E8%87%AA%E5%8A%A8%E8%B0%83%E6%95%B4%E6%B8%85%E6%99%B0%E5%BA%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/410227/%E6%96%97%E9%B1%BC%E6%95%B4%E4%BA%BA%E8%84%9A%E6%9C%AC%EF%BC%88%E8%87%AA%E5%8A%A8%E8%B0%83%E6%95%B4%E6%B8%85%E6%99%B0%E5%BA%A6%EF%BC%89.meta.js
// ==/UserScript==

(function() {
setInterval(e => {
	$('.tip-e3420a li:last-of-type').click()
}, 60000 * 4)
})()
