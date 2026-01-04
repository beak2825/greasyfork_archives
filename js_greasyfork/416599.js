// ==UserScript==
// @name         微信地址精简
// @namespace    http://domain.com/directory
// @version      0.2.1
// @description  去掉微信公众号文章地址的多余部分，减小长度。
// @author       幸福的赢得
// @include      https://mp.weixin.qq.com/s?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416599/%E5%BE%AE%E4%BF%A1%E5%9C%B0%E5%9D%80%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/416599/%E5%BE%AE%E4%BF%A1%E5%9C%B0%E5%9D%80%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==


if (/chksm/.test (location.href) ) {
    var plainPath =
    location.href.replace (/&chksm=.*/, "")
    history.pushState({}, '', plainPath);

}