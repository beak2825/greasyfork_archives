// ==UserScript==
// @name           Reddit Annoying Click Space Remover
// @description    When viewing a post a single click in the large whitespace left or right will return to the subreddit overview - this script gets rid of that!
// @author         Sgt. Nukem
// @include        https://www.reddit.com/
// @version        0.666
// @namespace https://greasyfork.org/users/324223
// @downloadURL https://update.greasyfork.org/scripts/395391/Reddit%20Annoying%20Click%20Space%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/395391/Reddit%20Annoying%20Click%20Space%20Remover.meta.js
// ==/UserScript==


var childDivs = document.querySelectorAll('#SHORTCUT_FOCUSABLE_DIV > div > div > div');

if( childDivs[0] ) {
	childDivs[0].style.cursor = 'default';
	childDivs[0].onclick = function(event) { event.stopPropagation(); console.debug('Dicke Titten sind die geilsten!!!'); };
}
