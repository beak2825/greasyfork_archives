// ==UserScript==
// @name         AutoAAviewScript
// @namespace    http://devdev.nagoya/
// @version      0.99
// @description  @keage様公開のブックマークレット用スクリプトを読み込むためのスクリプト。
// @author       dev-nago
// @match        http://oyoguyaruo.blog72.fc2.com/blog-entry-*
// @match        http://mukankei151.blog47.fc2.com/blog-entry-*
// @match        http://himanatokiniyaruo.com/blog-entry-*
// @match        http://rusalka777.blog.fc2.com/blog-entry-*
// @match        http://katteniyaruo.blog69.fc2.com/blog-entry-*
// @match        http://yaruout.blog.fc2.com/blog-entry-*
// @match        http://yaranaioblog.blog14.fc2.com/blog-entry-*
// @match        http://n-yaruomatome.sakura.ne.jp/blog/*
// @match        http://gokumonan.blog87.fc2.com/blog-entry-*
// @match        http://yaruplus.blog.fc2.com/blog-entry-*
// @match        http://yarupon.blog134.fc2.com/blog-entry-*
// @match        http://yaruok.blog.fc2.com/blog-entry-*
// @match        http://yaruokei.blog.fc2.com/blog-entry-*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/24090/AutoAAviewScript.user.js
// @updateURL https://update.greasyfork.org/scripts/24090/AutoAAviewScript.meta.js
// ==/UserScript==
(function(){
    var d=document,e=d.createElement('script');
    e.setAttribute('src','https://keage.sakura.ne.jp/fonts/Saitamaar.js');
    e.setAttribute('charset','utf-8');
    d.getElementsByTagName('head')[0].appendChild(e);
})();