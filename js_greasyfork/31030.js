// ==UserScript==
// @name         去掉搜索结果下划线
// @namespace    ilikemeat@qq.com
// @create       2017-6-30
// @version      1.2
// @description  去掉下划线
// @author       ilikemeat
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @include         http://www.sogou.com/*
// @include         https://www.sogou.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31030/%E5%8E%BB%E6%8E%89%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%8B%E5%88%92%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/31030/%E5%8E%BB%E6%8E%89%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%8B%E5%88%92%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    function addStyle(css) {
        var pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        return document.insertBefore(pi, document.documentElement);
    }
    addStyle("a{text-decoration:none !important}");
    addStyle("em{text-decoration:none !important}");
})();