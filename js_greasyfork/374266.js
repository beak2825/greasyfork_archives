// ==UserScript==
// @name        网页字体替换为微软&阴影
// @namespace   Muou
// @description 网页字体替换为微软雅黑并加入text-shadow
// @include  *:*
// @author Muou
// @homepage   https://greasyfork.org/zh-CN/scripts/374266-网页字体替换为微软-阴影
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/374266/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E4%B8%BA%E5%BE%AE%E8%BD%AF%E9%98%B4%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/374266/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2%E4%B8%BA%E5%BE%AE%E8%BD%AF%E9%98%B4%E5%BD%B1.meta.js
// ==/UserScript==
(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }
    addStyle('* {font-family : "Microsoft YaHei","iconfont","FontAwesome"}');
    addStyle('*:not([class*="bilibili-danmaku"]):not([style*="background: rgba"]){text-shadow: 0 0 0.02em rgba(0,0,0,0.3) !important;}');
})();