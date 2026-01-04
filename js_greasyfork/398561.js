// ==UserScript==
// @name         屏蔽知乎傻吊视频
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @include      *.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/398561/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%82%BB%E5%90%8A%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/398561/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E5%82%BB%E5%90%8A%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;
    setInterval(() => {

        $('.EduSectionItem').parent().parent().parent().hide();
        $('.ZVideoItem').parent().parent().hide();
        $('.VideoAnswerPlayer').parent().parent().parent().parent().hide();
    }, 500)
})();