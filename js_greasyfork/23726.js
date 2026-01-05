// ==UserScript==
// @name		RIT MnC timetracker better time input
// @namespace	harry
// @version		0.1.2
// @include     /^https:\/\/www\.rit\.edu\/marketing\/timetracker\/projects\/[0-9]+.*$/
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @description	use harry's old style of time input from batbox
// @downloadURL https://update.greasyfork.org/scripts/23726/RIT%20MnC%20timetracker%20better%20time%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/23726/RIT%20MnC%20timetracker%20better%20time%20input.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var form = $('#time-log'),
        startInput = form.find('#start'),
        endInput = form.find('#end');
    
    startInput.add(endInput).val('').attr('type', 'text').attr('placeholder', '').on('change', function(e) {
        var me = $(this),
            val = me.val(),
            h, h1, m, ampm;

        if ($.isNumeric(val) && (val.length <= 4)) {
            if (val.length == 1 || val.length == 2) {
                h = val;
                m = '00';
            } else if (val.length == 3) {
                h = val.substr(0, 1);
                m = val.substr(1);
            } else if (val.length == 4) {
                h = val.substr(0, 2);
                m = val.substr(2);
            }

            
            h1 = h;

            if (h < 8 || h == 12) {
                ampm = 'pm';
                if (h1 != 12) {
                    h1 = parseInt(h1)+12;
                }
            } else {
                ampm = 'am';
            }
            
            if (h1 < 10) {
                h1 = '0'+h1;
            }
            
            me.data('militaryTime', h1+':'+m);
            me.val(h+':'+m+ampm);
            me.trigger('change');
        }
    });
    
    form.submit(function() {
        startInput.val(startInput.data('militaryTime'));
        endInput.val(endInput.data('militaryTime'));
    });
}());