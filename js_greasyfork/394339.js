// ==UserScript==
// @name         扇贝单词默认显示我的笔记
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  背单词时自动滚到页面底部并展示我的笔记
// @author       wowo878787
// @match        https://web.shanbay.com/wordsweb/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394339/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E6%88%91%E7%9A%84%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/394339/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E6%88%91%E7%9A%84%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    $("<style></style>").text(".Layout_page__2Wedt{padding-bottom:0}.index_left__3SFmQ{white-space:pre-line};").appendTo($("head"));

    will_scroll = false
    is_detail_old = 0

    var interval = setInterval(function(){
        is_detail = $('.VocabPronounce_word__17Tma').length

        // 判断是否在单词详情页, 并决定 scroll 到页面底部
        if(is_detail_old === 0 && is_detail === 1){
            will_scroll = true
            is_detail_old = is_detail
        }
        else if(is_detail_old === 1 && is_detail === 0){
            will_scroll = false
            is_detail_old = is_detail
        }
        else{
            will_scroll = false
        }

        if(will_scroll){
            $('.index_noteWrap__DZxrn .index_tabs__1CVfU .index_tab__37Cha:nth-child(2)').click();
            window.scrollTo(0,document.body.scrollHeight);
        }
    },500);
})();