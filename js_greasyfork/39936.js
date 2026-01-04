// ==UserScript==
// @namespace           https://greasyfork.org/scripts/39936-pressreader-nicematin-delocker
// @grant               GM_xmlhttpRequest
// @grant               GM_deleteValue
// @grant               GM_getValue
// @grant               GM_setValue
// @version             20180326.1001
//
// @name                PressReader Nicematin delocker
// @description         Allow reading of magazine online without subscribing
// @include             http*://*pressreader.com/*
// @include             http*://*nicematin.com/*
// @downloadURL https://update.greasyfork.org/scripts/39936/PressReader%20Nicematin%20delocker.user.js
// @updateURL https://update.greasyfork.org/scripts/39936/PressReader%20Nicematin%20delocker.meta.js
// ==/UserScript==
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function run() {
	window.setTimeout(run, 10000);
	console.debug(new Date(Date.now()),      'Starting run() from ', document.location.href);
	window.oncontextmenu = null;

	var elements           = document.getElementsByClassName("page-tint")    ;
	if (elements)    {
		console.info('Found ',elements.length ,' page-tint Class: ' ,elements );
		while(elements.length > 0){			elements[0].parentNode.removeChild(elements[0]);      }
	}

	var elements           = document.getElementsByClassName("layout zoom")    ;
	if (elements)    {
		console.info('Found ',elements.length ,' layout zoom Class: ' ,elements );
		while(elements.length > 0){			elements[0].parentNode.removeChild(elements[0]);      }
	}

    // Remove POPUP BLOCKER from NICEMATIN.com
    var elements           = document.getElementsByClassName("RhooBg")    ;
	if (elements)    {
		console.info('Found ',elements.length ,' RhooBg Class: ' ,elements );
		while(elements.length > 0){			elements[0].parentNode.removeChild(elements[0]);      }
	}
    var elements           = document.getElementsByClassName("modalRhoo")    ;
	if (elements)    {
		console.info('Found ',elements.length ,' modalRhoo Class: ' ,elements );
		while(elements.length > 0){			elements[0].parentNode.removeChild(elements[0]);      }
	}

	// FROM https://gist.github.com/sbmzhcn/8278871
	setInterval("document.oncontextmenu=null;document.contextmenu=null;document.ondragstart=null;document.onkeydown=null;document.onmousedown=null;document.onmousemove=null;document.onmouseup=null;document.onselectstart=null;document.selectstart=null;window.oncopy=null;document.oncopy=null;document.body.oncopy=null;document.body.onselect=null;document.body.onbeforecopy=null;document.body.contextmenu=null;document.body.oncontextmenu=null;document.body.ondragstart=null;document.body.onkeydown=null;document.body.onmousedown=null;document.body.onmousemove=null;document.body.onmouseup=null;document.body.selectstart=null;document.body.onselectstart=null;window.contextmenu=null;window.oncontextmenu=null;window.ondragstart=null;window.onkeydown=null;window.onmousedown=null;window.onmousemove=null;window.onmouseup=null;window.selectstart=null;window.onselectstart=null;window.onbeforeprint=null;",1000);
	var all = document.getElementsByTagName("*");
	for (var i=0, max=all.length; i < max; i++) {
		all[i].onmousedown = null;
		all[i].onselectstart = null;
	}
	function addGlobalStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) { return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
	addGlobalStyle("html,body {display:block;-moz-user-select: text !important; -khtml-user-select: text !important;-webkit-user-select:text !important;user-select: text !important;}");
	//--- END GITHUB

} //--- END run()

//------------------------------------------------------------------------------

run()
