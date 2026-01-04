// ==UserScript==
// @name         Clraik Trade Board Bumper - Tabs
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      0.8
// @description  Checks the last time you bumped your trade threads, if it's more than 5 hours ago, silently open background tabs and bump the threads
// @author       RealisticError
// @match        *://*/*
// @connect      clraik.com
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/372307/Clraik%20Trade%20Board%20Bumper%20-%20Tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/372307/Clraik%20Trade%20Board%20Bumper%20-%20Tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //User Settings
    var tradePagesToBump = ['http://clraik.com/forum/showthread.php?66199-RealisticError-s-Real-Goods-Store-Instant-Delivery-Included']; //clraik allows up to 3 trade pages bumped at a time ONLY PUT A MAXIMUM OF 3 LINKS HERE!
    var messageToBumpWith = 'Next Bump: Now';
    var alertWhenBumped = false; // set to true if you would like an alertbox to appear when your board is bumped.

    //Constants
    var FIVE_HOURS =  5.2 * 60 * 60 * 1000; //actually 5 hours and 12 minutes to ensure there's no overlap in edge cases.
    var lastBumpedDate = GM_getValue('ClraikBoardBumperAccessTime');

    var bumpFunction = function() {

        if($('.nextbumpbox div')[0].innerText.indexOf("Now") !== -1) {

            $('#cke_contents_vB_Editor_QR_editor > textarea').val(messageToBumpWith);
            $('#qr_submit').click();

        } else {

            //Only reset the bump time if nextbumpbox does not contain the word now.
            GM_setValue('ClraikBoardBumperAccessTime', lastBumpedDate);

        }

        //Ensure the post has been sent correctly before closing the tab
        setTimeout(close, 3500);
    }
console.log(new Date(GM_getValue('ClraikBoardBumperAccessTime')));
    console.log(FIVE_HOURS);
    console.log((new Date().valueOf() - GM_getValue('ClraikBoardBumperAccessTime')) - FIVE_HOURS);
    for(var i = 0; i < tradePagesToBump.length; i++) {

        if(window.location.href === tradePagesToBump[i]) {

            //Set the last bumped time.
            GM_setValue('ClraikBoardBumperAccessTime', new Date().valueOf());

            setTimeout(bumpFunction, 3500);

        } else if(GM_getValue('ClraikBoardBumperAccessTime', '').length === 0 || new Date().valueOf() - GM_getValue('ClraikBoardBumperAccessTime') > FIVE_HOURS) {

            GM_openInTab(tradePagesToBump[i], true);

            if(alertWhenBumped) {

                alert("Your CK Trade board is being bumped!");
            }

        }

    }

})();