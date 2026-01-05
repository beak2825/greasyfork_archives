// ==UserScript==
// @author      ZSMTurker
// @name       ZSMTurker's VQ Script
// @version    0.1
// @description x
// @require     http://code.jquery.com/jquery-latest.min.js
// @match      https://www.mturk.com/mturk/previewandaccept?groupId=3EM4DVSA8U8J6KF08Q5EM8I2NYE308
// @namespace x
// @downloadURL https://update.greasyfork.org/scripts/2559/ZSMTurker%27s%20VQ%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/2559/ZSMTurker%27s%20VQ%20Script.meta.js
// ==/UserScript==

document.addEventListener( "keydown", kas, false);
var ev = $.Event('keypress');

function kas(i) {   
if ( i.keyCode == 65 ) { //A Key - Yes
    $('input[name="Answer_1"]').eq(0).click();
    $('input[name="/submit"]').eq(0).click();
       }
 if ( i.keyCode == 70 ) { //F Key - No
   $('input[name="Answer_1"]').eq(1).click();
   $('input[name="/submit"]').eq(0).click();

    }
   }