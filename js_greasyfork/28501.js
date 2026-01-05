// ==UserScript==
// @name         Steam Community - Group Messsenger and Twitch Spam alert
// @namespace    XXL-MAN
// @version      1.0
// @description  Send a message to multiple steam friends at once through steam web chat (https://steamcommunity.com/chat)
// @author       XXL-MAN
// @include      /^https?:\/\/steamcommunity.com\/chat\/?$/
// @grant        none
// @run-at       document-idle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28501/Steam%20Community%20-%20Group%20Messsenger%20and%20Twitch%20Spam%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/28501/Steam%20Community%20-%20Group%20Messsenger%20and%20Twitch%20Spam%20alert.meta.js
// ==/UserScript==

const TwitchSpamENG = "My stream is ON. Please follow me on ";
const TwitchSpamESP = "Ahora en streaming. Por favor sígueme en ";
const mystream = "https://www.twitch.tv/TheXXLMAN" ;
const TwitchSpam = TwitchSpamENG;

$(".friendslist_entry").before('<input type="checkbox" style="float: left; margin-top: 12px; margin-left: -12px;">');
$(".chatform_footer").append("<button id='spamFriends' class='btn_darkblue_white_innerfade btn_medium'><span>SEND TO SELECTED</span></button>");
$(".chatform_footer").append("<button id='invertSelection' class='btn_darkblue_white_innerfade btn_medium'><span>INVERT SELECT</span></button>");
$(".chatform_footer").append("<button id='twitch' class='btn_darkblue_white_innerfade btn_medium'><span>TWITCH</span></button>");
$("#invertSelection").click(function(ev) {
    ev.preventDefault();
    $("[type=checkbox]").each(function() {
        this.checked = !this.checked;
    });
    return false;
});
$("#spamFriends").click(function(ev) {
    ev.preventDefault();
    var msg = $("#chatmessage").val();
    $("[type=checkbox]:checked").each(function(i) {
        $(this).next().click();
        $("#chatmessage").val(msg);
        $(".chatform_footer button").first().click();
    });
    return false;
});
$("#twitch").click(function(ev) {
    ev.preventDefault();
    var msg = TwitchSpam + mystream;
    $("[type=checkbox]:checked").each(function(i) {
        $(this).next().click();
        $("#chatmessage").val(msg);
        $(".chatform_footer button").first().click();
    });
    return false;
});