// ==UserScript==
// @name         onliner filter
// @namespace    onliner
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.onliner.by/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29094/onliner%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/29094/onliner%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
        var spammers = {'monstr':'2095842', 'tp':'1054792', 'govnokrat':'1575514', 'спокойный':'610780', 'розовый':'1555901','панда':'437342', 'дура':'748844','голубое неба':'1990414', 'шар с глазаме':'480212',
                       'трусы':'163816', 'бык':'1937669', 'майонез':'2299968'};
        var arr_of_spammers = $.map(spammers, function(el) {return el;});
        var toggle = "off";
        $.each(arr_of_spammers, function(i, e){
            var div = $("div.b-mtauthor[data-user_id='" + e + "']");
            $.each(div, function(k, l){
                var blahDiv = $(l.parentNode).find('.msgpost-txt-i');
                blahDiv.attr('data-old-text', blahDiv.html());
                blahDiv.on('dblclick', function(){if (toggle=="off") {$(this).html($(this).attr('data-old-text')); toggle = "on";} else {$(this).text('censored'); toggle = "off";}});
                blahDiv.text('censored');
            });
        });
    } catch (ignore){}   
})();