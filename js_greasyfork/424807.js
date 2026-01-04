// ==UserScript==
// @name         澳洲同城去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉澳洲同城的垃圾广告!
// @author       小当家
// @match        https://www.iyingshi9.tv/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/424807/%E6%BE%B3%E6%B4%B2%E5%90%8C%E5%9F%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/424807/%E6%BE%B3%E6%B4%B2%E5%90%8C%E5%9F%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    $("#ads").remove()
         $("#ads1").remove()
         $("#ads2").remove()
         $("#clickdiv").remove()
         console.log("ads hidden")




})();