// ==UserScript==
// @name         Torn Gym Disabler
// @namespace    https://www.torn.com/profiles.php?XID=2029670
// @version      1.1
// @description  Disables the gym page
// @author       MikePence [2029670]
// @match        https://www.torn.com/gym.php
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/390081/Torn%20Gym%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/390081/Torn%20Gym%20Disabler.meta.js
// ==/UserScript==

$(document).ready(function(){
    var disabled = GM_getValue("disabled");
    if(disabled === null || disabled === "" || disabled === "undefined"){
        disabled = "false";
        GM_setValue("disabled", disabled);
    }

    if(disabled) {
        $('#gymroot').html('<div class="info-msg-cont border-round m-top10 red"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round"><p>You should not be training!</p><p><a id="enable" href="#">Actually, I should!</a></p></div></div></div></div>');
    }
    else {
        $('#gymroot').prepend('<div class="info-msg-cont border-round m-top10"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round"><p><a id="disable" href="#">I should stop training!</a></p></div></div></div></div>');
    }
});

$('#enable').click(function(){
    GM_setValue("disabled", false);
    location.reload();
});

$('#disable').click(function(){
    GM_setValue("disabled", true);
    location.reload();
});