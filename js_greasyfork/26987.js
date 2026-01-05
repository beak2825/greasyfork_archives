// ==UserScript==
// @name         hover for link
// @namespace    https://github.com/Khdoop
// @version      0.5
// @description  try to take over the world!
// @author       Khdoop
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/26987/hover%20for%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/26987/hover%20for%20link.meta.js
// ==/UserScript==


var body = $(document.body);
console.log('1111111', body);
var anchors = body.find('a');
var box = $('<div class="link-tooltip"></div>').appendTo(body);

box.css({
	display: 'block',
	position: 'absolute',
	right: 0,
	padding: '5px',
	'font-size': '18px',
	background: 'white',
	border: '1px solid black',
	opacity: 0.9,
	'word-break': 'break-all',
	'z-index': 99999
});

anchors.on('mouseover', function() {
	box.css({display: 'block', bottom: body.scrollTop() * -1}).text($(this)[0].href);
}).on('mouseleave', function() {
	box.css({display: 'none'});
});
