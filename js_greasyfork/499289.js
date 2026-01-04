// ==UserScript==
// @name         test removAd to CSDN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  csdn 去广告!
// @author       xPang
// @match        https://blog.csdn.net/*/article/details/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/499289/test%20removAd%20to%20CSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/499289/test%20removAd%20to%20CSDN.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var $ = unsafeWindow.$
    function removeAsideBox(){
        $('aside').remove()
        $('.recommend-right').remove()
        $('.fourth_column').remove()
        $('.pulllog-box').remove()
        $('.indexSuperise').remove()
        $('#btn-readmore').click();
        $('main').css('width','auto')
    }
    removeAsideBox()
    // Your code here...
})();