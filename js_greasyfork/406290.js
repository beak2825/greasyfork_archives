// ==UserScript==
// @name         个人脚本 PLus Max Pro 版
// @namespace    http://github.com/binjoo
// @version      0.1
// @description  个人使用的脚本，其他人慎用。
// @author       雷恩
// @match        *://*.inoreader.com/*
// @@require     https://cdn.staticfile.org/jquery/3.5.1/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406290/%E4%B8%AA%E4%BA%BA%E8%84%9A%E6%9C%AC%20PLus%20Max%20Pro%20%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/406290/%E4%B8%AA%E4%BA%BA%E8%84%9A%E6%9C%AC%20PLus%20Max%20Pro%20%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).on('dblclick', '.article_subscribed', function(){
        return toggle_articleview($(this).data("aid"), false, null, false)
    });
})();