// ==UserScript==
// @name               萌百_去黑幕
// @name:zh-CN         萌百_去黑幕
// @name:en-US         MoeGirl_Remove mask
// @description        去除萌娘百科的黑幕。
// @version            1.0.4
// @author             LiuliPack
// @license            WTFPL
// @namespace          https://gitlab.com/LiuliPack/UserScript
// @include            /(m)?zh.moegirl.org.cn/
// @grant              GM_addStyle
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/458616/%E8%90%8C%E7%99%BE_%E5%8E%BB%E9%BB%91%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/458616/%E8%90%8C%E7%99%BE_%E5%8E%BB%E9%BB%91%E5%B9%95.meta.js
// ==/UserScript==

'use strict';

// 修改样式
GM_addStyle('.heimu{color:#fff!important}.heimu a,.mw-body a.external:visited{color:#5b84c8!important}');

// 去除`title`属性。
document.querySelectorAll('.heimu').forEach(ele => {
    ele.removeAttribute('title');
});