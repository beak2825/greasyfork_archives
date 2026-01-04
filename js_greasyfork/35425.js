// ==UserScript==
// @name        ehall-drop-browser-block
// @namespace   njmu-ehall
// @description break browser block in njmu ehalj
// @include     http://ehall.njmu.edu.cn/*
// @version     1.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/35425/ehall-drop-browser-block.user.js
// @updateURL https://update.greasyfork.org/scripts/35425/ehall-drop-browser-block.meta.js
// ==/UserScript==
//
// 说明：取消ehall平台对于浏览器(特别是linux, mac平台)不支持限制
// 作者：南京医科大学2016级五年临床三班谢祯晖 <xiezh0831@yahoo.co.jp>
// Github: https://github.com/heyrict
//

window.navigator.__defineGetter__('userAgent', function () {
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
});
