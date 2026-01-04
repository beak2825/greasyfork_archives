// ==UserScript==
// @name          Facepunch - Add a logout link
// @description	  Adds a logout link, like seriously the hell you expecting?
// @version       0.01
// @match       https://facepunch.com
// @match       https://www.facepunch.com/
// @match       http://facepunch.com/
// @match       http://www.facepunch.com/
// @include		http://facepunch.com/*
// @include		http://www.facepunch.com/*
// @include		https://facepunch.com/*
// @include		https://www.facepunch.com/*
// @run-at      document-end
// @require     //ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @namespace https://greasyfork.org/users/8353
// @downloadURL https://update.greasyfork.org/scripts/32450/Facepunch%20-%20Add%20a%20logout%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/32450/Facepunch%20-%20Add%20a%20logout%20link.meta.js
// ==/UserScript==

$('#navbar-login').append('<br /><a href="/login.php?do=logout" style="float: right; margin-right: 5px; clear: both; font-weight: bold;">Fuck off</a>');