// ==UserScript==
// @name          最好的视频去广告，收费和VIP视频免费看插件，使用html5播放器电脑不发热不发烧
// @description   支持所有热门视频网站，优酷，爱奇艺，腾讯，搜狐，乐视，pptv，芒果tv，1905，暴风等
// @license       MIT
// @version       1.0.3
// @match        *://v.youku.com/*
// @match        *://*.iqiyi.com/v*
// @match        *://v.qq.com/x/cover*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/v/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.pptv.com/show/*
// @match        *://*.mgtv.com/b/*
// @match        *://vip.1905.com/play/*
// @match        *://*.baofeng.com/*
// @grant none
// @namespace https://openuserjs.org/users/gg1aa1
// @downloadURL https://update.greasyfork.org/scripts/420602/%E6%9C%80%E5%A5%BD%E7%9A%84%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%94%B6%E8%B4%B9%E5%92%8CVIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%E6%8F%92%E4%BB%B6%EF%BC%8C%E4%BD%BF%E7%94%A8html5%E6%92%AD%E6%94%BE%E5%99%A8%E7%94%B5%E8%84%91%E4%B8%8D%E5%8F%91%E7%83%AD%E4%B8%8D%E5%8F%91%E7%83%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/420602/%E6%9C%80%E5%A5%BD%E7%9A%84%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%94%B6%E8%B4%B9%E5%92%8CVIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B%E6%8F%92%E4%BB%B6%EF%BC%8C%E4%BD%BF%E7%94%A8html5%E6%92%AD%E6%94%BE%E5%99%A8%E7%94%B5%E8%84%91%E4%B8%8D%E5%8F%91%E7%83%AD%E4%B8%8D%E5%8F%91%E7%83%A7.meta.js
// ==/UserScript==
 
 
(function() {
  'use strict';
    let ok = confirm('请点击确定或按下回车，即可无广告免费播放VIP和收费视频哦！\n若无法观看请点取消，祝您观影愉快', '???'); if(ok){vz1123870210391232()};
    var vip = "<div style='background: #00ffe4; color: #292d00;position: absolute; right: 50px; top: 50px; z-index:9999; border-radius: 2px;box-shadow: 0 0 5px #000; padding: 10px 20px; cursor: pointer;font-size: 15px;'>使用VIP去广告插件观看</div>";var div=document.createElement("div");;div.innerHTML = vip;;div.onclick = vz1123870210391232;document.body.insertBefore(div, document.body.firstElementChild);;function vz1123870210391232() {window.location.href = "https://z1.im1907.top/?a=1&jx=" + window.location.href}
    // div
 
})();