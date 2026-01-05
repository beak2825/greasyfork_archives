// ==UserScript==
// @name         OrlyGift - Voter
// @icon         https://www.orlygift.com/favicon.ico
// @namespace    Royalgamer06
// @author       Royalgamer06
// @version      1.1
// @description  Automatically vote for you
// @include      https://www.orlygift.com/voting
// @grant        none
// @run-at       document-idle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://greasyfork.org/scripts/18449-recaptcha-helper/code/reCAPTCHA%20Helper.user.js
// @downloadURL https://update.greasyfork.org/scripts/28901/OrlyGift%20-%20Voter.user.js
// @updateURL https://update.greasyfork.org/scripts/28901/OrlyGift%20-%20Voter.meta.js
// ==/UserScript==

var rate = 1; //1 = good, -1 = bad

this.$ = this.jQuery = jQuery.noConflict(true);
function vote() {
    $.get("/voting", function(data) {
        if ($("#voting-claim-button", data).length === 0) {
            var appid = $("input[name=steam_id]", data).val();
            var token = $("input[name=_token]", data).val();
            $.post("/voting/rate", { _token: token, rate: 1, steam_id: appid }, function() {
                vote();
            });
        } else {
            location.href = "https://www.orlygift.com/voting";
        }
    });
}
if ($("#voting-claim-button").length === 0) {
    vote();
} else {
    $("#voting-claim-button").click();
}