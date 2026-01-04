// ==UserScript==
// @name         神器/LOGO隐藏/LOGO移除
// @namespace
// @version      0.8
// @description  科学摸鱼必备！上班的时候不想让老板看到网站LOGO，怎么办就是它了~
// @author       FlyArtist
// @match        *
// @icon
// @grant        none
// @include      *
// @license MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/438397/%E7%A5%9E%E5%99%A8LOGO%E9%9A%90%E8%97%8FLOGO%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/438397/%E7%A5%9E%E5%99%A8LOGO%E9%9A%90%E8%97%8FLOGO%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clearLogo() {
        var docs = document.querySelectorAll('#logo,.logo,.navbar_logo,.nav-logo,.website-logo,[aria-label="知乎"],[aria-label="Weibo"],[aria-label="微博"],[title="到贴吧首页"],[title="豆瓣网"],.bbs-post-web-main-title,.downloadFixed,.top-nav-logo,.auto-header-logo,.mini-logo');
        for (var i = 0; i < docs.length; i++) {
            docs[i].setAttribute('style', 'display:none')
        }
    }

    clearLogo();
    setInterval(clearLogo, 300)
})();