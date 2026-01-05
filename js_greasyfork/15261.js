// ==UserScript== 
// @namespace      Mikhoul 
// @name           Facebook Sort Recent NewsFeed by Default  
// @version        1.5  
// @description    Automatically changes facebook's url to show your Most Recent news feed by default instead of the Top Stories.  
// @include      https://www.facebook.com/
// @include      http://www.facebook.com/
// @include      https://www.facebook.com/home.php*
// @include      http://www.facebook.com/home.php*
// @include      http*://www.facebook.com/?ref=logo*
// @run-at document-start
// @grant none 
// @downloadURL https://update.greasyfork.org/scripts/15261/Facebook%20Sort%20Recent%20NewsFeed%20by%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/15261/Facebook%20Sort%20Recent%20NewsFeed%20by%20Default.meta.js
// ==/UserScript==     

window.location.href = "https://www.facebook.com/?sk=h_chr";