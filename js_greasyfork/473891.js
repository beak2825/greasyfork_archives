// ==UserScript==
// @name         GC - Quickstock Keeper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set ignore lists to keep specific items in the inventory
// @author       jess (wibreth)
// @match        https://www.grundos.cafe/quickstock*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/473891/GC%20-%20Quickstock%20Keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/473891/GC%20-%20Quickstock%20Keeper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $ */

    $(document).ready(() => {

        function ignoreItems(ignore) {
            $('input[disabled]').prop('disabled', false);
            $('.data.justify-right.align-right span').each(function() {
                if (ignore.indexOf($(this).text()) >= 0) {
                    const id = $(this).data('itemid');
                    $(`input[name="${id}"]`).prop('disabled', true);
                }
            });

        }

        let ignore = GM_getValue('ignore', []).join(',');

        GM_registerMenuCommand('Set Ignore List', function() {
            let value = prompt('Enter a comma separated list of which items to ignore', GM_getValue('ignore', []).join(','));
            if (value) {
                ignore = [];
                for (const item of value.split(','))
                    ignore.push(item.trim());
                GM_setValue('ignore', ignore);
                ignoreItems(ignore);
            }
        }, 'i');

        ignoreItems(ignore);
        $('.action input').change(() => {
            $('input[disabled]').prop('checked', false);
        });
    });
})();