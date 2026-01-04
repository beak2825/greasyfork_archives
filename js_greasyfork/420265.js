// ==UserScript==
// @name     网页字体替换可口可乐在乎体 楷体并加阴影
// @namespace   Echo
// @description 网页字体替换成可口可乐在乎体 楷体并加上阴影
// @include        *:*
// @author Echo
// @homepage  
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/420265/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%8F%AF%E5%8F%A3%E5%8F%AF%E4%B9%90%E5%9C%A8%E4%B9%8E%E4%BD%93%20%E6%A5%B7%E4%BD%93%E5%B9%B6%E5%8A%A0%E9%98%B4%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/420265/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E5%8F%AF%E5%8F%A3%E5%8F%AF%E4%B9%90%E5%9C%A8%E4%B9%8E%E4%BD%93%20%E6%A5%B7%E4%BD%93%E5%B9%B6%E5%8A%A0%E9%98%B4%E5%BD%B1.meta.js
// ==/UserScript==
(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle('* {font-family : "可口可乐在乎体 楷体","iconfont","FontAwesome"}');
    addStyle('* {text-shadow : 0.01em 0.01em 0.01em #999999}');
})();