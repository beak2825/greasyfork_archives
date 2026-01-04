// ==UserScript==
// @name         HF Contract PM Cleaner
// @namespace    https://hackforums.net
// @version      0.1
// @description  Cleans up old contract PMs
// @author       tslam
// @match        https://hackforums.net/private.php
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/379014/HF%20Contract%20PM%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/379014/HF%20Contract%20PM%20Cleaner.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {
    'use strict';
    $('#content > div > div.oc-container > div:nth-child(2) > form > fieldset > span.smalltext').append(' | <a href="#" class="clean-contracts">Clean Contract PMs</a>')

    $('.clean-contracts').click(function() {
        $('table').eq(4).find('tr').each((i, a) => {
            let isHelpBot = $(a).find('td').eq(3).text().trim() === 'Help Bot';
            let isContractNotif = $(a).find('td').eq(2).text().indexOf('Contract') !== -1;

            if (isHelpBot && isContractNotif) {
                $(a).find('input').prop('checked', true);
            }
        })

        $('input[name="delete"]').click();
    })
})();