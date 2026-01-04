// ==UserScript==
// @name         Suzhou eFlow Enhancement for 倒账申请
// @namespace    http://tampermonkey.net/
// @version      2023-12-18
// @description  Suzhou eFlow enhancement
// @author       Ryan SUN (ryan.sun@philips.com)
// @match        https://share.philips.com/sites/SuzhoueFlow/Lists/SAPReverseApplication_submit/Item/newifs.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482617/Suzhou%20eFlow%20Enhancement%20for%20%E5%80%92%E8%B4%A6%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/482617/Suzhou%20eFlow%20Enhancement%20for%20%E5%80%92%E8%B4%A6%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to load jQuery
    function loadJQuery(callback) {
        var jq = document.createElement('script');
        jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
        jq.onload = callback; // Set the callback to be executed after jQuery loads
        document.getElementsByTagName('head')[0].appendChild(jq);
    }

    // Function to handle paste events on input elements
    function handlePasteEvent() {
        $('input').on('paste', function(e) {
            var data = e.originalEvent.clipboardData.getData('Text');
            var rows = data.split('\r\n'); // Split into rows
            // console.log('Pasted data:', data);
            // console.log('Rows:', rows);

            var startCol = $(this).closest('td').index();
            var startRow = $(this).closest('tr').index();
            // console.log('Start row:', startRow, 'Start col:', startCol);

            for (var r = 0; r < rows.length; r++) {
                var cols = rows[r].split('\t'); // Split each row into columns
                // Check if the last element is an empty string
                if (cols[cols.length - 1] === '') {
                    cols.pop(); // Remove the last element
                }
                // console.log('Data for row', r, ':', cols);
                for (var c = 0; c < cols.length; c++) {
                    // Remove "\r" character
                    cols[c] = cols[c].replace('\r', '');

                    var $input = $('tr').eq(1).find('tr').eq(11+startRow+r).find('td').eq(startCol + c).find('input')
                    if ($input.length && 10+startRow+r < 31 ) {
                        // console.log('Setting value for row', startRow + r, 'col', startCol + c, 'to', cols[c]);
                        $input.val(cols[c]);
                        $input.click(); // Trigger a click event on the input
                        $input.focus(); // Trigger a click event on the input
                    } else {
                        // console.log('No input for row', startRow + r, 'col', startCol + c);
                    }
                }
            }

            return false; // Prevent the default paste action
        });
    }

    // Load jQuery and then set up the paste event handler
    loadJQuery(handlePasteEvent);

})();