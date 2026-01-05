// ==UserScript==
// @name        TVTropes 1.3 - Add "Troper Page" Link
// @namespace   TVTropes 1.3 Plus
// @description Adds links to a user's troper page, both in the user menu and their profile page
// @include     http://tvtropes.org/*
// @include     https://tvtropes.org/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16995/TVTropes%2013%20-%20Add%20%22Troper%20Page%22%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/16995/TVTropes%2013%20-%20Add%20%22Troper%20Page%22%20Link.meta.js
// ==/UserScript==

logoutLink = $('#header-new .dropdown-menu.pull-right li').last();
troperName = logoutLink.children().first().attr('href').split('=')[1];
logoutLink.before('<li><a href="http://tvtropes.org/pmwiki/pmwiki.php/Tropers/' + troperName + '">Troper Page</a></li>');

if (document.location.href == 'http://tvtropes.org/pmwiki/profile.php' || document.location.href == 'https://tvtropes.org/pmwiki/profile.php') {
   $('.mobile-dropDown-list .close-btn').before('<li style="display:inline-block;"><a href="http://tvtropes.org/pmwiki/pmwiki.php/Tropers/' + troperName + '"><i class="io icon-file-empty"></i> Troper Page</a></li>');
}