// ==UserScript==
// @name         Automatyczne PVP...
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Atakuje ludzi z którymi masz WARA
// @author       Vomar
// @match        https://kosmiczni.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21372/Automatyczne%20PVP.user.js
// @updateURL https://update.greasyfork.org/scripts/21372/Automatyczne%20PVP.meta.js
// ==/UserScript==

function attack() {
//if ($(".firstIcon > img[src*='war.png']").length) 
{
    $( "a[id^='quickpvpattack']" ).trigger('click');
	$( "a[id^='npvpattack']" ).trigger('click');
}
}
setInterval(attack,1);
