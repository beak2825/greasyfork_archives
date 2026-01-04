// ==UserScript==
// @name         Local File Link convert For FF
// @version      0.1
// @description  Change link 'file://' to 'file://///'
// @author       Mitsuya Tsujikawa
// @require      https://code.jquery.com/jquery-1.12.4.js
// @include      *
// @namespace https://greasyfork.org/users/292663
// @downloadURL https://update.greasyfork.org/scripts/381945/Local%20File%20Link%20convert%20For%20FF.user.js
// @updateURL https://update.greasyfork.org/scripts/381945/Local%20File%20Link%20convert%20For%20FF.meta.js
// ==/UserScript==

$(function(){

    var links, a;
    links = document.getElementsByTagName('a');

    for (var i = 0; i < links.length; i++) {
        a = links[i];
        a.attributes.href.nodeValue = a.attributes.href.nodeValue.replace(/^file:\/{2}/,'file://///');
    }

});
