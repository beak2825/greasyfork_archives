// ==UserScript==
// @name         greasefork成人脚本跳转按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  浏览greasefork时增加一个进入sleazyfork的按钮
// @author       __Kirie__
// @match        https://greasyfork.org/*
// @match        https://sleazyfork.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449346/greasefork%E6%88%90%E4%BA%BA%E8%84%9A%E6%9C%AC%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/449346/greasefork%E6%88%90%E4%BA%BA%E8%84%9A%E6%9C%AC%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(document).ready(function () {
        const log = console.log;


        var href = window.location.href;
        var greasy = /.*greasy.*/;
        if(greasy.test(href)) {

            log($('#site-nav > nav'));
            var otona = '<li class="otona"><a href="https://www.sleazyfork.org" target="_blank">成人</a></li>';
            $('#site-nav > nav').append(otona);
        }else {

            log($('#site-nav > nav'));
            var kodomo = '<li class="kodomo"><a href="https://www.greasyfork.org" target="_blank">小孩</a></li>';
            $('#site-nav > nav').append(kodomo);
        }

        
        
    });
})();