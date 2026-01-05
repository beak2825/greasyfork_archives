// ==UserScript==
// @name       Where Dreams Go To Die
// @namespace  http://ericfraze.com
// @version    0.1
// @description  (mTurk) This just adds some text under the Amazon mechanical turk logo. Made for sikk66 of http://www.mturkgrind.com/
// @match      https://www.mturk.com/mturk/*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5271/Where%20Dreams%20Go%20To%20Die.user.js
// @updateURL https://update.greasyfork.org/scripts/5271/Where%20Dreams%20Go%20To%20Die.meta.js
// ==/UserScript==

$(document).ready(function() {
    $(".logo").parent().append("<div id='custom-slogan'>Where dreams go to die</div>");
    $(".logo").parent().css('position','relative');
    $("#custom-slogan").css('position','absolute');
    $("#custom-slogan").css('left','65px');
    $("#custom-slogan").css('top','-7px');
    $("#custom-slogan").css('font-size','14px');
    $("#custom-slogan").css('background-color','white');
    $("#custom-slogan").css('width','188px');
    $("#custom-slogan").css('color','#81b0cf');
    $("#custom-slogan").css('text-align','right');
});