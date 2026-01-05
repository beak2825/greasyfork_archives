// ==UserScript==
// @name         icpmp.com获取番号及日期
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       ZMeng
// @match        http://www.icpmp.com/*
// @include      http://www.icpmp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28708/icpmpcom%E8%8E%B7%E5%8F%96%E7%95%AA%E5%8F%B7%E5%8F%8A%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/28708/icpmpcom%E8%8E%B7%E5%8F%96%E7%95%AA%E5%8F%B7%E5%8F%8A%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.clear();
    var result = $('.mod_film').eq(0).find('.movie_list li').map(function(){
        var code = $(this).find('h4.name a').text();
        var date = $(this).find('span.update_time .txt').text();
        return code + ' ' + date + '\r\n';
    }).get().join('');
    console.log(result);
    // Your code here...
})();