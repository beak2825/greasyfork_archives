// ==UserScript==
// @name           STORAGE DUPE
// @description    xyz
// @version 4.7
// @namespace      cam4_goes_droopy
// @include        http://bounsr.com/cx4/
// @require        https://code.jquery.com/jquery-3.1.0.js
// @require        https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_getResourceText
// @grant          GM_getResourceURL
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_setClipboard
// @grant          GM_info
// @grant          GM_getMetadata
// @icon           https://www.google.com/s2/favicons?domain=www.cam4.com
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/446759/STORAGE%20DUPE.user.js
// @updateURL https://update.greasyfork.org/scripts/446759/STORAGE%20DUPE.meta.js
// ==/UserScript==



// =======================================================================
$(function(){

    console.log('=============||||| C4 BOUNSR | Highlight Faves |||||==============');




  // Faves Function ===========================================================

    function faves() {
        console.log('~~~~~~~~~~~~~~ Faves Function');

        $('.profile').removeClass('fave');

        $('.profile').each(function() {

            var username = $(this).find('.user').text().trim().toLowerCase();

            var gmStorage_faves = GM_getValue('favesList');

            var i;
            for (i = 0; i < gmStorage_faves.length; i++) {
                if( username === gmStorage_faves[i].trim().toLowerCase() ) {
                    $(this).addClass('fave');
                }
            }

        });

    }




    // Faves Button ===========================================================
    function faveButtons() {

        $('.faveBtnOFF').click(function(){
            console.log("faveBtnOFF clicked");
            var faveUser = $(this).parents('.userInfo').find('.user').text();

            var favesList = GM_getValue('favesList');
            favesList.push(faveUser);

            GM_setValue('favesList', favesList);

            faves();
        });

        $('.faveBtnON').click(function(){
            console.log("faveBtnON clicked");
            var faveUser = $(this).parents('.userInfo').find('.user').text();

            var favesList = GM_getValue('favesList');
            favesList.splice( $.inArray(faveUser, favesList), 1 );
            console.log(favesList);

            GM_setValue('favesList', favesList);

            faves();
        });

    }







    setTimeout(function(){
        faves();
    }, 3500);


    setTimeout(function(){
        faveButtons();
    }, 4500);


});
// =====================================================================================================================================
// =====================================================================================================================================
// =====================================================================================================================================
// =====================================================================================================================================




