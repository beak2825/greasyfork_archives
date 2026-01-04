// ==UserScript==
// @name         Attack links on faction page
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  On faction member list page it replaces the first cell contents with hyperlink to attack loader
// @author       Raffy
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470892/Attack%20links%20on%20faction%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/470892/Attack%20links%20on%20faction%20page.meta.js
// ==/UserScript==

'use strict';

window.addEventListener('load', function(){

    let watchInterval = window.setInterval(function(){

        if($('.members-list .table-body .table-row .tt-member-index').length > 0){

            let uniqueid = 1;

            window.clearInterval(watchInterval);

            $('.members-list .table-body .table-row').each(function(){

                let attackLoaderUrl = $(this).find('a[href^=\'/profiles\']').attr('href').replace('/profiles.php?XID=', '/loader.php?sid=attack&user2ID=');

                let newLinkContent = '<ul class="big svg" style="display: inline-block;"><li id="icon13_custom_' + (uniqueid++)
                + '" class="iconShow" style="margin-bottom: 0px;"><a href="' + attackLoaderUrl + '" target="_blank"></a></li></ul>';

                $(this).find('.tt-member-index').addClass('icons').html(newLinkContent);

            });

        }

    }, 200);
});