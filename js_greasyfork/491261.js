// ==UserScript==
// @name         Faction members selector
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a checkbox next to faction members name. Build a list of selected members in a floating textarea.
// @author       Raffy
// @match        https://www.torn.com/factions.php?step=profile&*ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491261/Faction%20members%20selector.user.js
// @updateURL https://update.greasyfork.org/scripts/491261/Faction%20members%20selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let handleOnchange = function(){
        $('#fms-paste-into').val(Array.from($('.fms-checkbox:visible:checked')).map((el)=>$(el).val()).join(" "));
    }

    let handleAllOnchange = function(e){
        e.stopPropagation();

        $('.fms-checkbox').attr('checked', $('.fms-checkbox-all').prop('checked'));

        handleOnchange();
    }

    let watchInterval = window.setInterval(function(){

        if($('.members-list .table-body .table-row .tt-member-index').length > 0){

            let uniqueid = 1;

            window.clearInterval(watchInterval);

            $('#memberFilter :input').change(function(){window.setTimeout(handleOnchange, 50)});
            $('#memberFilter .handle').mousemove(function(){window.setTimeout(handleOnchange, 50)});

            $('.members-list').append('<textarea id="fms-paste-into" style="position:fixed; width:300px; height:100px; right:10px; top:100px"></textarea>');

            $('.members-list .table-header .position').html('<input name="fms-checkbox-all" class="fms-checkbox-all" type="checkbox"> &nbsp; Position').click(handleAllOnchange);

            $('.members-list .table-body .table-row').each(function(){

                let username = $(this).find('.member .honor-text-wrap img').attr('alt');

                let userid = $(this).find('a[href^=\'/profiles\']').attr('href').match(/\?XID=(.*)/)[1];

                $(this).find('.position .ellipsis').prepend('<input name="fms-checkbox" class="fms-checkbox" type="checkbox" value="' + userid + '"> &nbsp;').click(handleOnchange);

            });

        }

    }, 200);
})();