// ==UserScript==
// @name         超星学习通
// @namespace      https://greasyfork.org/users/3128
// @version      0.1
// @description  题库答案转换
// @author       You
// @match        https://mooc2-ans.chaoxing.com/qbank/view-question?courseid=*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437616/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/437616/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let answer_text=$('.stem_answer').text().trim().replace(/^ +/mg,'').replace(/^\r/mg,'').replace(/[ABCD]．/g, '');
    answer_text=answer_text.replace(/\n+/g,'\t');
    let answer_paper=$('<textarea style="width:100%;border: solid 2px;">').val(answer_text).click(function(){
        GM_setClipboard($(this).val());
    });
    $('.eidt_stem').click(function(){
        GM_setClipboard($(this).text().trim().replace(/^\([^)]+\)\s+/,''));
    })

    $('.answer_tit').before('点击文本框复制答案：', answer_paper);

    let u=unsafeWindow,
        webHost=location.host.toLowerCase(),
        webPath=location.pathname.toLowerCase();

})();