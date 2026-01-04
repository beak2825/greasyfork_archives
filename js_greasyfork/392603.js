// ==UserScript==
// @namespace      https://blog.naibabiji.com
// @name           福步论坛帖子字体修改
// @description    替换福步论坛帖子内容字体为微软雅黑，增大字号和文本间距，参考了https://greasyfork.org/zh-CN/scripts/374194 的内容。
// @match          http://bbs.fobshanghai.com/*
// @author         naiba
// @homepage       https://blog.naibabiji.com
// @version        1.1
//@updateURL       https://greasyfork.org/scripts/392603-%E7%A6%8F%E6%AD%A5%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9/code/%E7%A6%8F%E6%AD%A5%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9.user.js
// @downloadURL https://update.greasyfork.org/scripts/392603/%E7%A6%8F%E6%AD%A5%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/392603/%E7%A6%8F%E6%AD%A5%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
(function() {
    function addStyle(rules) {
        var styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }

    addStyle('* {font-family : Segoe UI,"Microsoft Yahei",Arial,sans-serif;}');
    addStyle('.t_msgfont { line-height: 30px;font-size: 16px;}');
})();