// ==UserScript==
// @name         COVID 1 Out of Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://coronavirus.jhu.edu/testing/states-comparison
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406132/COVID%201%20Out%20of%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/406132/COVID%201%20Out%20of%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function AddNewTH(Name, SourceIndex) {
        var ThisNewTH = document.createElement('th');
        var ThisNewTHDiv = document.createElement('div');
        var ThisNewTHDivInner = document.createElement('div');
        $(ThisNewTHDivInner).text(Name);
        $(ThisNewTHDiv).addClass('TFormat_inactive__Nkaqk');
        $(ThisNewTHDiv).append($(ThisNewTHDivInner));
        $(ThisNewTH).append($(ThisNewTHDiv));
        console.log($($('.TFormat_main__35Moj > table > thead > tr > th')[SourceIndex]));
        ThisNewTH.addEventListener('click', function() {$($('.TFormat_main__35Moj > table > thead > tr > th')[SourceIndex]).trigger('click')}, true);

        $('.TFormat_main__35Moj > table > thead > tr').append($(ThisNewTH));

        $('.TFormat_main__35Moj > table > tbody > tr').each(function() {
            var ThisNewTD = document.createElement('td');
            var CasesNumber = $($(this).find('td')[SourceIndex]).text();
            var OutOfCount = Number.parseFloat(100000 / CasesNumber).toFixed(1);
            $(ThisNewTD).text(OutOfCount);
            $(this).append(ThisNewTD);
        });
    }

    AddNewTH('1 in (cases)', 2);
    AddNewTH('1 in (tests)', 1);
    AddNewTH('1 in (deaths)', 3);
})();