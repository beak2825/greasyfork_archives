// ==UserScript==
// @name           No MSN on HoTMaiL signout
// @description    Stops hotmail redirecting you to msn when you sign out and goes to google home page
// @namespace      http://userscripts.org/users/7063
// @include        https://login.live.com/logout*
// @include        http://login.live.com/logout*
// @version        20120913.2350
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/404340/No%20MSN%20on%20HoTMaiL%20signout.user.js
// @updateURL https://update.greasyfork.org/scripts/404340/No%20MSN%20on%20HoTMaiL%20signout.meta.js
// ==/UserScript==


window.location = 'https://www.google.com/';


//tip:
//if you want a blank page use 'about:blank' instead of 'http://www.hotmail.com' or use 'https://www.google.com/'