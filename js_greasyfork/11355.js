// ==UserScript==
// @name        Hack Forums - Community Radio
// @namespace   Doctor Blue
// @description Adds a link to start the Hack Forums Community Radio player in a new window.
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @include     *hackforums.net*
// @exclude     *wiki.hackforums.net*
// @version     1.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11355/Hack%20Forums%20-%20Community%20Radio.user.js
// @updateURL https://update.greasyfork.org/scripts/11355/Hack%20Forums%20-%20Community%20Radio.meta.js
// ==/UserScript==

$j = $.noConflict(true)

$j('#header > .menu > ul').append('<li><a id="openRadio" class="navButton" href="" style="color: #4EC7FF" target=>Radio</a></li>')
$j('#openRadio').on('click', function() {
  window.open('http://tunein.com/embed/station/250935?autoplay=true&size=small','player','width=550,height=157,scrollbars=no')
  return false
})