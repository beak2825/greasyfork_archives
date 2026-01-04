// ==UserScript==
// @name         bypass www.crainsdetroit.com paywall
// @version      0.3
// @description  crainsdetroit.com paywall bypass
// @author       g
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        https://crainsdetroit.com/*
// @match        https://www.crainsdetroit.com/*
// @run-at document-end
// @namespace https://greasyfork.org/users/229847
// @downloadURL https://update.greasyfork.org/scripts/388126/bypass%20wwwcrainsdetroitcom%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/388126/bypass%20wwwcrainsdetroitcom%20paywall.meta.js
// ==/UserScript==


(function() {
    $(window).load(function(){
	document.getElementById('mm-0').style.overflow = 'scroll';
    document.getElementsByClassName("layout-container")[0].style.overflow = '';
    document.getElementsByClassName("porte-modal-porte")[0].style.display='none';
    })
}());