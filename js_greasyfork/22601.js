// ==UserScript==
// @name        Qzone_Mod+NoAD(GM)
// @namespace   Qzone_Mod+NoAD(GM)
// @description Qzone_Mod+NoAD样式去广告辅助脚本
// @homepageURL https://greasyfork.org/zh-CN/scripts/22601-qzone-mod-noad-gm
// @author      Special-Denise
// @include     http://user.qzone.qq.com/*
// @include     https://user.qzone.qq.com/*
// @version     0.0.5
// @lastupdate  2017-03-31
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22601/Qzone_Mod%2BNoAD%28GM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22601/Qzone_Mod%2BNoAD%28GM%29.meta.js
// ==/UserScript==
var VideoAD = document.querySelector('.f-single-top').parentNode;
//VideoAD.parentNode.removeChild(VideoAD);
VideoAD.innerHTML = '<center style="margin-top: -16px;"><a href="https://userstyles.org/styles/113708/qzone-mod-noad">Qzone_Mod+NoAD</a><a href="https://greasyfork.org/zh-CN/scripts/22601-qzone-mod-noad-gm">(GM)</a>：好友热播模块已屏蔽</center>';