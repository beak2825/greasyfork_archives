// ==UserScript==
// @name           No MSN on HoTMaiL signout
// @description    Stops hotmail redirecting you to msn when you sign out
// @namespace      http://userscripts.org/users/7063
// @include        https://outlook.live.com/mail/ConsumerSignout.html*
// @version        20250427.1756
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/534/No%20MSN%20on%20HoTMaiL%20signout.user.js
// @updateURL https://update.greasyfork.org/scripts/534/No%20MSN%20on%20HoTMaiL%20signout.meta.js
// ==/UserScript==


window.location = 'http://www.hotmail.com/';


//tip:
//if you want a blank page use 'about:blank' instead of 'http://www.hotmail.com/'
