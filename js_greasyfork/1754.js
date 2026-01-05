// ==UserScript==
// @name        Koperta na Wykopie
// @description Skrypt zmienia ikonę powiadomień w serwisie Wykop.pl
// @include     http://www.wykop.pl
// @include     http://www.wykop.pl*
// @version     1
// @grant       none
// @run-at 	document-end
// @namespace https://greasyfork.org/users/2250
// @downloadURL https://update.greasyfork.org/scripts/1754/Koperta%20na%20Wykopie.user.js
// @updateURL https://update.greasyfork.org/scripts/1754/Koperta%20na%20Wykopie.meta.js
// ==/UserScript==
// Pisane na szybko - proszę mnie nie osądzać

var bell = document.getElementsByClassName('fa-bell')[0];
bell.className = bell.className.replace('fa-bell', 'fa-envelope');

// $('.fa-bell').removeClass('fa-bell').addClass('fa-envelope');