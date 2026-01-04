// ==UserScript==
// @name TopAndDownButtonsEverywhere
// @namespace      https://greasyfork.org/en/users/28298
// @description Top and Down buttons everywhere
// @version 1.71
// @author 2018++ Jerry, 2018+ Volkan K., 2014-2016 Max Max
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @include *
// @run-at document-end
// @grant unsafeWindow
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js
// @downloadURL https://update.greasyfork.org/scripts/441713/TopAndDownButtonsEverywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/441713/TopAndDownButtonsEverywhere.meta.js
// ==/UserScript==

var RANDOM=Math.floor(Math.random()*1234567890);

// [1] skip all iframe 
if (window.self != window.top) {
	return
}

// create element
function ce(n) {
	return $('<' + n + '>')[0];
} // end of function

// add style
function addStyle(css) {
	var head = $('head')[0];
	if (head) {
		var style = ce("style");
		style.type = "text/css";
		style.appendChild(document.createTextNode(css));
		head.appendChild(style);
	} // end if
} // end of function

// global variables
var position,
	// figure out if this is moz || IE because they use documentElement
	el = document.documentElement || document.body,
	// timer
	t1, t2,
	// speed by
	speed_by_click = 500, // edit this value
	speed_by_over = 100, // edit this value
	// z-index
	zIindex = 1001; // edit this value

// move up
function move_up() {
	position = document.documentElement.scrollTop || document.body.scrollTop;
	window.scrollTo(0, position - 1);
	t1 = setTimeout(move_up, speed_by_over);
} // end of function

// move downn
function move_dn() {
	position = document.documentElement.scrollTop || document.body.scrollTop;
	window.scrollTo(0, position + 1);
	t2 = setTimeout(move_dn, speed_by_over);
} // end of function

function goto_up () {
	scrollTo(el, 0, speed_by_click);
}

function goto_dn () {
	scrollTo(el, getDocumentHeight(), speed_by_click);
}

// document height
function getDocumentHeight() {
	var body = $('body')[0];
	return (body.scrollHeight > body.offsetHeight) ? body.scrollHeight : body.offsetHeight;
} // end of function

// document scroll
function get_scroll(a) {
	var d = document,
		b = d.body,
		e = d.documentElement,
		c = "client" + a,
		a = "scroll" + a;
	return /CSS/.test(d.compatMode) ? (e[c] < e[a]) : (b[c] < b[a])
} // end of function

function scrollTo(element, to, duration) {
	return $(element).scrollTo(to,duration);
}

// add css
function shareCSS() {
	// variables
	var s = '',
		img_up, img_dn;

	// img vs button
	img_up = 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB+SURBVDhPY1i1atV/amAGahgCMoNhaIGlS5cKAp19BoRBbLJcj2QILDJINwzoAmMgfoclIkBixkS5DI8hMJcRNgxoSBoOl6CnNZBhaVhdBjWE1MSJahjQkA4KEmYH2GUrV66cSYEhYB+AzKBtFiHkQqKiH6Ro1CDCQTWgYQQAs81DU0G/83sAAAAASUVORK5CYII=';
	img_dn = 'data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACPSURBVDhPY2DAAlatWvUfH8amB6vYqEGEg2pgw4iQ7cTKM6xcuXImsYpxqQOZAQ4woIIOCgzrQAl1oEFpZBiWhitFgwx7R4SBIDXYDYGZDFRgTMAwkCHGhBMRJMxwGUa8ITCbli5dKgg08AySN8+AxIhyCboiJMPIN4Qsm6miiYioxltawvSDYogohYTUAQC80UNTOht/YwAAAABJRU5ErkJggg==';
	// button id
	s += '#play_btn_up'+RANDOM+' { position:fixed; right:45%; bottom:90%;z-index:' + zIindex + '; height:50px; width:10%; cursor:pointer; background:url(' + img_up + ') no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7); border-radius:5px 5px 5px 5px; margin-top:-24px; }';
	s += '#play_btn_dn'+RANDOM+' { position:fixed; right:45%; top:90%;   z-index:' + zIindex + '; height:50px; width:10%; cursor:pointer; background:url(' + img_dn + ') no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7); border-radius:5px 5px 5px 5px; margin-top:-24px; }';
	// button class
	s += '.play_btn'+RANDOM+' { -webkit-transition-duration:0.5s linear; -o-transition-duration:0.5s linear; -moz-transition-duration:0.5s linear; transition-duration:0.5s linear; opacity:0.01; }';
	s += '.play_btn'+RANDOM+':hover { opacity:1; }';
	// append
	addStyle('' + s);
} // end of function

// main
function create_btn_element() {
	// get scroll
	var up, dn,
		scrolled,
		h = get_scroll('Height');
	// exit
	if (!h) {
		return;
	} // end if

	// add css
	shareCSS();

	// if 
	if (el) {
		// create DOM element
		up = ce('span');
		dn = ce('span');
		// set attribute
		up.setAttribute('id', 'play_btn_up'+RANDOM);
		dn.setAttribute('id', 'play_btn_dn'+RANDOM);
		// set class
		up.className = "play_btn"+RANDOM;
		dn.className = "play_btn"+RANDOM;
		// append element
		document.body.appendChild(up);
		document.body.appendChild(dn);

		// scroll
		scrolled = window.pageYOffset || document.documentElement.scrollTop;
		// if scroll 
		up.style.display = (scrolled > 0) ? "" : "none";

		// add event over
		up.addEventListener('mouseover', move_up, false);
		dn.addEventListener('mouseover', move_dn, false);
		// add event out
		up.addEventListener('mouseout', function() {
			clearTimeout(t1);
		}, false);
		dn.addEventListener('mouseout', function() {
			clearTimeout(t2);
		}, false);
		// add event click
		up.addEventListener('click', goto_up, false);
		dn.addEventListener('click', goto_dn, false);

		// add event scroll
		window.onscroll = function() {
			var scrolled = window.pageYOffset || document.documentElement.scrollTop,
				diffHeight = document.body.scrollHeight - window.innerHeight;
			// if scroll up
			up.style.display = (scrolled > 0) ? "" : "none";
			// if scroll dn
			dn.style.display = (diffHeight > scrolled) ? "" : "none";
		}; // end of function
	} // end if
} // end of function

// run it
create_btn_element();

