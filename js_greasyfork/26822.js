// ==UserScript==
// @name         Comcast Internet Usage Percent
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  display percent in larger usage meter, also show where you should be based on number of days in the month
// @author       Harry Groover
// @match        https://customer.xfinity.com/MyServices/Internet/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26822/Comcast%20Internet%20Usage%20Percent.user.js
// @updateURL https://update.greasyfork.org/scripts/26822/Comcast%20Internet%20Usage%20Percent.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer = setInterval(updateMeter, 250),
        d = new Date(),
        m = d.getMonth(),
        dotm = d.getDate()+(d.getHours()/24)+(d.getMinutes()/6000), // append current hours and minutes for more accuracy
        lastDay = new Date(d.getYear(), m+1, 0).getDate(),
        datePercent = Math.round((dotm/(lastDay+1))*100); // add one to calculate end of the day instead of beginning
    
    function updateMeter() {
        var usageBar = $('.usage-meter-widget').find('.cui-usage-bar'),
            dateBar,
            percentUsed, plan, usage;

        if (usageBar.length > 0) {
            plan = usageBar.data('plan');
            usage = usageBar.children().data('used');
            percentUsed = Math.round(usage/plan*100);
            
            usageBar.css('height', '30px');
            usageBar.children().css('width', percentUsed+'%').append('<span style="font-size: 1.2em; margin-top: 6.5px; margin-right: 10px; display: block; text-align: right; color: #ffffff;">'+percentUsed+'%</span>');
            
            dateBar = usageBar.clone();
            dateBar.children().css('width', datePercent+'%').find('span').text(datePercent+'%');
            dateBar.insertAfter(usageBar);
            
            $('<h5>What You Should Be Under</h5>').insertBefore(dateBar);
            
            clearInterval(timer);
        }
    }
    
})();