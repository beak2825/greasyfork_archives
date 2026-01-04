// ==UserScript==
// @name         GC - Gormball character selector and prize logger
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Remembers your last played character and up to 100 prizes
// @author       wibreth
// @match        https://www.grundos.cafe/games/gormball/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/454771/GC%20-%20Gormball%20character%20selector%20and%20prize%20logger.user.js
// @updateURL https://update.greasyfork.org/scripts/454771/GC%20-%20Gormball%20character%20selector%20and%20prize%20logger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $:false */

    GM_addStyle('#prize-list {\
    max-width: 200px;\
    font-size: .8em;\
    max-height: 200px;\
    overflow: auto;\
    border: 1px solid #000;\
    position: absolute;\
    background: #fff;\
    padding: 5px 5px 5px 35px;\
    z-index: 3;\
    right: 0;\
}\
#prize-list-btn, #clear-list-btn {\
    float: right;\
    margin-top: -6px;\
}\
#page_content > p:first-of-type {\
    position: relative;\
}\
img[src$="gorm.gif"] {\
    cursor: pointer;\
}');


    $('document').ready(() => {
        let listLoaded = false;
        let listVisible = false;

        // log prizes
        if ($('strong:contains("Your Prize")').length != 0) { //win page
            let prizeList = GM_getValue("prizeList", []);
            if (prizeList.push($('.mt-1 strong').text()) > 100) // max of 100 items stored
                prizeList.shift();
            GM_setValue("prizeList", prizeList);
        }

        // show prizes
        let showbtn = $('<input type="button" id="prize-list-btn" value="Show Prize Log">');
        showbtn.click(() => {
            if (listVisible) {
                $('#prize-list').hide();
                listVisible = false;
                return;
            }
            if (listLoaded) {
                $('#prize-list').show();
                listVisible = true;
                return;
            }
            let prizeList = GM_getValue("prizeList", []);
            let $prizeList = $('<ol id="prize-list">');
            if (!prizeList.length)
                $prizeList.append('<li>none!</li>');
            for (const prize of prizeList)
                $prizeList.append(`<li>${prize}</li>`);
            $('#page_content > p:first-of-type').append($prizeList);
            listLoaded = true;
            listVisible = true;
        });
        let clearbtn = $('<input type="button" id="clear-list-btn" value="Clear Prize Log">');
        clearbtn.click((e) => {
            if (!confirm("Are you sure you want to clear the prize log?")) {
                e.preventDefault();
                return;
            }
            if (listLoaded)
                $('#prize-list').empty();
            GM_setValue("prizeList", []);
        });
        $('#page_content > p:first-of-type').append(showbtn);
        $('#page_content > p:first-of-type').append(clearbtn);


        if ($('img[src$="gorm.gif"]').length == 0)
            return; //not on the character select page

        let playerDD = GM_getValue("playerDD", 1); //default Thyassa
        $('#playerDD').val(playerDD);

        $('.gormball_player').click(function() {
            playerDD = $(this).data('id');
            GM_setValue("playerDD", playerDD);
        });

        let clicked = false;
        $('img[src$="gorm.gif"]').click(() => {
            if (clicked)
                return;
            clicked = true;
            $('form#play_gormball').submit();
        });


    });
})();