// ==UserScript==
// @name         主责人工作量
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jira.mingyuanyun.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374404/%E4%B8%BB%E8%B4%A3%E4%BA%BA%E5%B7%A5%E4%BD%9C%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/374404/%E4%B8%BB%E8%B4%A3%E4%BA%BA%E5%B7%A5%E4%BD%9C%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $el = $('<div style="padding:10px 0 10px 20px;border-bottom:1px solid #bababa;">总工作量：<span id="totalTime"></span>天</div>');
    $('.results-panel.navigator-item').before($el)
    var $totalTime = $("#totalTime");

    $totalTime.ajaxComplete(function(){
        var totalTime = $('.aggregatetimeoriginalestimate').map((i,el)=>{  return el.innerText.trim().replace('日','') } ).get().reduce(function(total,n){return parseFloat(total) + parseFloat(n)});

        $totalTime.text(totalTime.toFixed(2))
    });

    // Your code here...
})();