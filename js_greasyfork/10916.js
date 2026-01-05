// ==UserScript==
// @name          Promoted Post Buster
// @author        Prisencolinensinainciusol
// @namespace     http://imgur.com/user/Prisencolinensinainciusol
// @version       0.9.5
// @description   Hello Fine People Of Imgur We Brought You A Banana
// @include       http://imgur.com/*
// @require       http://code.jquery.com/jquery-latest.js
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/10916/Promoted%20Post%20Buster.user.js
// @updateURL https://update.greasyfork.org/scripts/10916/Promoted%20Post%20Buster.meta.js
// ==/UserScript==
 
if($(".promoted-tag").length > 0){
    $("#mainUpArrow").click();
    $(".navNext:first").click();
    window.alert("Hello");
}