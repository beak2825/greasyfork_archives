// ==UserScript==
// @name        Filter Me
// @namespace   pendevin
// @description adds a filter me button to the infobar
// @include     http://boards.endoftheinter.net/showmessages.php*
// @include     http://archives.endoftheinter.net/showmessages.php*
// @include     https://boards.endoftheinter.net/showmessages.php*
// @include     https://archives.endoftheinter.net/showmessages.php*
// @version     1.1
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/11095/Filter%20Me.user.js
// @updateURL https://update.greasyfork.org/scripts/11095/Filter%20Me.meta.js
// ==/UserScript==

//ll breaks without noconflict jquery
this.$ = this.jQuery = jQuery.noConflict(true);

//get our userid from the profile link
var userid = $('.userbar > a').first().attr('href');
userid = userid.substring(userid.indexOf('user=') + 5);
//we'll stick this on the infobar because that's traditional i guess
var infobar = $('#u0_2');
//add the filter to the url
var place = location.href.replace(/(topic=\d+)/, '$1&u=' + userid);
//add the thing eh
infobar.append('<span class="filter_me"> | <a href="' + place + '">Filter Me</a></span>');
