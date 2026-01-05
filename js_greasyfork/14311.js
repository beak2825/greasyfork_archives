// ==UserScript==
// @namespace   Mikhoul
// @name PageZipper UserScript
// @description Runs the PageZipper bookmarklet from http://www.printwhatyoulike.com/pagezipper
// @include       http://www.MyWebSite.com   
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/14311/PageZipper%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/14311/PageZipper%20UserScript.meta.js
// ==/UserScript==

javascript:(function(){if(window['pgzp']){_pgzpToggleBookmarklet();}else{window._page_zipper_is_bookmarklet=true;window._page_zipper=document.createElement('script');window._page_zipper.type='text/javascript';window._page_zipper.src='//www.printwhatyoulike.com/static/pagezipper/pagezipper_10.js';document.getElementsByTagName('head')[0].appendChild(window._page_zipper);}})();
//.user.js