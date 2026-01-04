// ==UserScript==
// @license MIT
// @name         快速跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  快速跳转企业信息
// @author       lemondqs
// @match        https://www.tianyancha.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tianyancha.com
// @grant        none

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/461273/%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/461273/%E5%BF%AB%E9%80%9F%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    // 'use strict';
$(function(){

    var target = $('.index_search-box__7YVh6:first').find('a.index_alink__zcia5');
    target.css('background', 'yellow');
    var url = target.attr('href')
    console.info( target.attr('href') )
    setTimeout(()=>{location.href = url;}, 1000)

});
    // Your code here...
})();