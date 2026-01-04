// ==UserScript==
// @name           Victory: Расширение предприятий
// @author         BioHazard
// @version        1.00
// @namespace      Victory
// @description    Расширение предприятий на произвольную величину
// @include        /http.://virtonomic.\.\w+/\w+/\w+/unit/upgrade/\d+$/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/379361/Victory%3A%20%D0%A0%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/379361/Victory%3A%20%D0%A0%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let unitID = location.href.match(/\d+/g)[0],
        blocksToBuild,
        blocks;

    $('.buttonset').last().parent().parent().prepend('<tr><td><input id="manualSet" type="radio" name="upgrade[delta]" value="0"></td><td><input id="manualSetField" type="text" size="10"></td></tr>');

    $('#manualSetField')
        .on('change',function(){
        $('#manualSet').val($(this).val());
    })
        .on('click',function(){
        $('#manualSet').attr('checked',true);
    });

    $('.buttonset').last().find('input[type="submit"]').on('click', function (event) {
        blocksToBuild=$('#manualSet').val();
        if (Math.abs(blocksToBuild)>100000) {
            event.preventDefault();
            while (blocksToBuild !== 0){
                blocks = blocksToBuild;
                if (blocksToBuild >= 100000)
                {
                    blocks = 100000;
                }
                if (blocksToBuild <= -100000)
                {
                    blocks = -100000;
                }
                blocksToBuild = blocksToBuild - blocks;
                sendBlocks(unitID,blocks);
            }
            window.close();

        }
    });

    function sendBlocks(unitID,blocks){
        $.ajax({
            url: 'https://virtonomica.ru/olga/window/unit/upgrade/' + unitID,
            type: 'post',
            async: false,
            data: 'upgrade[delta]=' + blocks
        });
    }

})();