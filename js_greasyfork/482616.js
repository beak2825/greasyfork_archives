// ==UserScript==
// @name         Suzhou eFlow Enhancement for 报废申请
// @namespace    http://tampermonkey.net/
// @version      20240704
// @description  Suzhou eFlow enhancement
// @author       Ryan SUN (ryan.sun@philips.com)
// @match        https://share.philips.com/sites/SuzhoueFlow/Lists/Scrap%20Application%20v3/Item/newifs.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482616/Suzhou%20eFlow%20Enhancement%20for%20%E6%8A%A5%E5%BA%9F%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/482616/Suzhou%20eFlow%20Enhancement%20for%20%E6%8A%A5%E5%BA%9F%E7%94%B3%E8%AF%B7.meta.js
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
            console.log('Start row:', startRow, 'Start col:', startCol);

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

                    var $input = $('tr').eq(1).find('tr').eq(12+startRow+r).find('td').eq(startCol + c).find('input')
                    if ($input.length && !$input.prop('readonly') && $input.attr('scriptclass') === 'TextBox' && 10+startRow+r < 37 ) {
                        // console.log('Setting value for row', startRow + r, 'col', startCol + c, 'to', cols[c]);
                        $input.val(cols[c]);
                        // console.log('Click cell', startRow + r, 'col', startCol + c, 'to', cols[c]);
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