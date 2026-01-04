// ==UserScript==
// @name           Discuz!论坛字体大小调整
// @author       仙圣
// @namespace https://greasyfork.org/users/76579
// @include        */forum*
// @include        */viewthread.php*
// @include        */thread*
// @include        */redirect.php*
// @include        */bbs/forum*
// @include        */bbs/viewthread.php*
// @include        */bbs/thread*
// @include        */bbs/redirect.php*
// @version        0.2
// @description    调整了主题标题、具体页正文的字体大小和行距，看着更顺眼一点。
// @downloadURL https://update.greasyfork.org/scripts/392986/Discuz%21%E8%AE%BA%E5%9D%9B%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/392986/Discuz%21%E8%AE%BA%E5%9D%9B%E5%AD%97%E4%BD%93%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }

    addStyle('.xst,#thread_subject,.t_f { line-height: 30px;font-size: 18px;}');
})();