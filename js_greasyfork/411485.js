// ==UserScript==
// @name         SpringSunday-Torrents-Batch-Select
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       陶陶滔滔涛
// @match        https://springsunday.net/torrents.php*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411485/SpringSunday-Torrents-Batch-Select.user.js
// @updateURL https://update.greasyfork.org/scripts/411485/SpringSunday-Torrents-Batch-Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var action = $('.torrents .colhead:last');
    if ($(action).text() == '行为') {
        $(action).html('行为<input type="checkbox" id="batchSelect"/>');
        $('#batchSelect').click(function() {
            var value = $(this).prop('checked');
                $('input[name="ids[]"]').each(function (index, item) { $(item).prop('checked', value);})
        });
    }
})();