// ==UserScript==
// @name          网页复制解除（浮游 bug 版）
// @namespace     https://subei.me
// @version       0.1
// @description   编辑当前页面，使之可以自由编辑，复制，黏贴。
// @author        花似
// @compatible    chrome
// @compatible    firefox
// @icon          https://secure.gravatar.com/avatar/b1339689c9960745b25439993dd88289?s=200&r=G&d=
// @include       *
// @downloadURL https://update.greasyfork.org/scripts/376046/%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E8%A7%A3%E9%99%A4%EF%BC%88%E6%B5%AE%E6%B8%B8%20bug%20%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/376046/%E7%BD%91%E9%A1%B5%E5%A4%8D%E5%88%B6%E8%A7%A3%E9%99%A4%EF%BC%88%E6%B5%AE%E6%B8%B8%20bug%20%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
//  _                 _  _
// | |__  _   _  __ _| || |
// | '_ \| | | |/ _` | || |_
// | | | | |_| | (_| |__   _|
// |_| |_|\__,_|\__,_|  |_|
location.href = "javascript:document.body.contentEditable = 'true'; document.designMode='on'; void 0";