// ==UserScript==
// @name         Zhihu Anonymous Answer Filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Show anonymous answer in zhihu.com only !
// @author       Zhao Yuting
// @match        https://www.zhihu.com/question/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403051/Zhihu%20Anonymous%20Answer%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/403051/Zhihu%20Anonymous%20Answer%20Filter.meta.js
// ==/UserScript==



// 功能
// 按键句号筛选匿名用户的答案
// （按时间排序情况下）按键左 上一页；  按键右 下一页；
(function() {
    'use strict';
    let doAnonymousAnswer = function() {
        $('div.List-item').each(function(i){
            if( $('meta[itemprop="name"][content="匿名用户"]', this).length > 0 ) {
                $(this).show();
            }else{
                $(this).hide();
            }
        });
    };
    let doNextPage = function(){
        $('button').filter(function(i){
            return $(this).text() == '下一页';
        }).each(function(i){
            $(this).click();
        });
    };
    let doPrevPage = function(){
        $('button').filter(function(i){
            return $(this).text() == '上一页';
        }).each(function(i){
            $(this).click();
        });
    };
    $(document).keydown(function(event){
        console.log(event.keyCode);
        if(event.keyCode == 190){ // key .
            doAnonymousAnswer();
        }  else if(event.keyCode == 39){ // key -->
            doNextPage();
        }else if(event.keyCode == 37){ // key <--
            doPrevPage();
        }
    });
})();