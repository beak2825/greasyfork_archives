// ==UserScript==
// @name         shumin-zhihu
// @namespace    https://stay.app/
// @version      0.1.1
// @description  自用，适配Safari
// @author       qianjunlang
// @match        *zhihu.com/*
// @grant        none
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @compatible   edge
// @compatible   chrome
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/456040/shumin-zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/456040/shumin-zhihu.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Your code here...
    setTimeout(function(){
        if(document.title.indexOf('(')==0)
            document.title = document.title.slice(document.title.indexOf(')')+1)
    },1000);


    let style = `font-weight: bold;font-size: 13px;padding: 1px 4px 0;border-radius: 2px;display: inline-block;vertical-align: top;margin: ${(location.pathname === '/search') ? '2' : '4'}px 4px 0 0;`
    document.body.appendChild(document.createElement('style')).textContent = `/* 区分问题文章 */
        .AnswerItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
        .TopstoryQuestionAskItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #ff5a4e;background-color: #ff5a4e33;${style}}
        .ZVideoItem .ContentItem-title a::before, .ZvideoItem .ContentItem-title a::before {content:'视频';color: #00BCD4;background-color: #00BCD433;${style}}
        .ArticleItem .ContentItem-title a::before {content:'文章';color: #2196F3;background-color: #2196F333;${style}}
    `;

})();
