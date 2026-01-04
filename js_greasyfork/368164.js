// ==UserScript==
// @name         Google machine-learning course helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将谷歌机器学习教程的wiki英文链接改成中文链接，点击链接将在新标签页中打开，同时点击右上角的wiki图标可在新标签页中打开原wiki英文链接
// @author       You
// @match        https://developers.google.cn/machine-learning/crash-course/prereqs-and-prework
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/368164/Google%20machine-learning%20course%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/368164/Google%20machine-learning%20course%20helper.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';
    // Your code here...
    $('a[href]').each(function(){
        let href=$(this).attr('href');
        if(href&&href.indexOf('https://wikipedia.org/wiki/')==0){
            $(this).attr('href','https://zh.wikipedia.org/wiki/'+$(this).html());
            $(this).attr('target','_blank');
            $(this).after('<a target="_blank" href="'+href+'"><img src="https://en.wikipedia.org/static/favicon/wikipedia.ico" width="12px" height="12px" style="vertical-align:top"/></a>');
        }
    });
})();