// ==UserScript==
// @name     网页字体替换微软雅黑并加阴影
// @namespace  star29
// @description 网页字体替换成微软雅黑并加上阴影
// @include        *:*
// @author        star29
// @homepage  
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/40951/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91%E5%B9%B6%E5%8A%A0%E9%98%B4%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/40951/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%BE%AE%E8%BD%AF%E9%9B%85%E9%BB%91%E5%B9%B6%E5%8A%A0%E9%98%B4%E5%BD%B1.meta.js
// ==/UserScript==
(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle('* {font-family : "Microsoft YaHei","iconfont","FontAwesome"}');
    addStyle('* {text-shadow : 0.01em 0.01em 0.01em #999999}');
})();