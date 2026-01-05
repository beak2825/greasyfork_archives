// ==UserScript==
// @name         Virals Youtube Autoplay
// @version      0.1.3
// @description  Autoplay youtube video in virals
// @author       Saqfish
// @include      https://www.mturk.com/mturk/*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @namespace    saqfish
// @downloadURL https://update.greasyfork.org/scripts/12254/Virals%20Youtube%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/12254/Virals%20Youtube%20Autoplay.meta.js
// ==/UserScript==

$(document).ready(function(){
    var videoid = $('#directVideoLinkDiv > a').attr('href').match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/); 
    $('#ss-form > ol > div:nth-child(2) > div > div > div.ss-q-title > iframe').replaceWith('<iframe width="640" height="360" src="http://www.youtube.com/embed/' + videoid[1].substring(6) + '?autoplay=1" frameborder="0" allowfullscreen autoplay="1"></iframe>');
    });