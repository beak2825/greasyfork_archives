// ==UserScript==
// @name         Anonymous Zhihu
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  我只想专心看答案，不想知道你是谁。
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @require  https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @downloadURL https://update.greasyfork.org/scripts/369537/Anonymous%20Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/369537/Anonymous%20Zhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TODO:
    // 去掉鼠标悬浮时用户信息的加载

    // Your code here...
    var hiddenClassNames = [
        // index page
        'Voters',
        'ContentItem-actions',
        'Question-sideColumn',
        'GlobalSideBar-categoryList',

        // feed page
        'author-info',
        'zm-side-section-inner',
        'zm-item-answer-author-info',
        'zm-item-link-avatar',
        'zm-item-vote-info',
    ];

    var mentionClassNames = [
        'member_mention',
    ];

    var anonymousAvatar = 'https://pic1.zhimg.com/aadd7b895_xs.jpg';

    waitForKeyElements('.AuthorInfo-avatar', function(elem){
        elem.attr('src', anonymousAvatar,);
        elem.attr('srcset', anonymousAvatar);
    });

    waitForKeyElements('.AuthorInfo-head', function(elem) {
        elem.text('小明');
    });

    waitForKeyElements('.AuthorInfo-detail', function(elem) {
        elem.empty();
    });

    waitForKeyElements('.UserLink-link', function(elem) {
        var text = elem.text();
        elem.attr('href', '#');
        if(text[0] == '@') {
            elem.text('@小明');
            elem.attr('href', '#');
        }
    });

    hiddenClassNames.forEach(function(name) {
        waitForKeyElements('.'+name, function(elem) {
            elem.css('display', 'none');
        });
    });

    mentionClassNames.forEach(function(name) {
        waitForKeyElements('.'+name, function(elem) {
            elem.text('@小明');
            elem.attr('href', '#');
        });
    });
})();