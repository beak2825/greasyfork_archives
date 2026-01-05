  // ==UserScript==
// @name        GMail to Google Inbox
// @description Automaticaly redirects to Google Inbox if gmail is visited
// @author      Petr Katerinak
// @include     http*mail.google.com*
// @version     1
// @namespace https://greasyfork.org/users/12565
// @downloadURL https://update.greasyfork.org/scripts/10535/GMail%20to%20Google%20Inbox.user.js
// @updateURL https://update.greasyfork.org/scripts/10535/GMail%20to%20Google%20Inbox.meta.js
// ==/UserScript==

window.location.replace("https://inbox.google.com");
