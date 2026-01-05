// ==UserScript==
// @name         Travel Links
// @namespace    testspace
// @version      0.1
// @description  Add forum link to travel page
// @author       tos
// @match        http://www.torn.com/index.php
// @match        https://www.torn.com/index.php
// @match        http://torn.com/index.php
// @match        https://torn.com/index.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23777/Travel%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/23777/Travel%20Links.meta.js
// ==/UserScript==


function main() {
    var travelLinks = document.getElementById('top-page-links-list');
    var eventsLink = travelLinks.childNodes[9];
    
    var forumsLink = document.createElement('a');
    var span_iconWrap = document.createElement('span');
    var span_button = document.createElement('span');
    
    span_iconWrap.setAttribute('class', 'icon-wrap');
    span_iconWrap.innerHTML = '<i class="new-thread-icon"></i>';
    span_button.setAttribute('role', 'button');
    span_button.innerHTML = ' Forums';
    
    forumsLink.setAttribute('role', 'listitem');
    forumsLink.setAttribute('class', 'forums t-clear h c-pointer  m-icon line-h24 right last');
    forumsLink.setAttribute('href', 'forums.php');
    forumsLink.appendChild(span_iconWrap);
    forumsLink.appendChild(span_button);
    
    travelLinks.insertBefore(forumsLink, eventsLink);
}
$(main);