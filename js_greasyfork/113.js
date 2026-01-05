// ==UserScript==
// @name          Handy ExHentai
// @namespace     handyexhentai
// @version       2024.01.30
// @description   Handy ExHentai.org
// @match         *://exhentai.org/s/*
// @match         *://g.e-hentai.org/s/*
// @match         *://exhentai.org/mpv/*
// @match         *://g.e-hentai.org/mpv/*
// @run-at        document-end
// @grant         unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/113/Handy%20ExHentai.user.js
// @updateURL https://update.greasyfork.org/scripts/113/Handy%20ExHentai.meta.js
// ==/UserScript==

function id(id) {return document.getElementById(id);}
if (typeof unsafeWindow === "undefined"){unsafeWindow = window;}

if(window.location.pathname.indexOf("/s/") == 0)
{
	// hide top panel
	id("i1").firstElementChild.style.display = "none";
	id("i2").style.display = "none";

	// hide scrollbar
	document.body.style.overflow = "hidden";
	function onkeydownP(b)
	{
		switch (b.keyCode)
		{
		case KeyEvent.DOM_VK_UP:
			window.scrollBy({
			  top: -150,
			  left: 0,
			  behavior: 'smooth'
			});
			cancelEvent(b);
			break;
		case KeyEvent.DOM_VK_DOWN:
			window.scrollBy({
			  top: 150,
			  left: 0,
			  behavior: 'smooth'
			});
			cancelEvent(b);
			break;
		case 112: // KeyEvent.DOM_VK_F1
			if(!document.webkitFullscreenElement && !document.mozFullScreenElement)
			{
				if(!document.documentElement.webkitRequestFullscreen){document.documentElement.webkitRequestFullscreen = document.documentElement.mozRequestFullScreen;}
				document.documentElement.webkitRequestFullscreen(window.ALLOW_KEYBOARD_INPUT);
			}
			else
			{
				if (document.webkitCancelFullScreen)
				{
					document.webkitCancelFullScreen();
				}
				else if (document.mozCancelFullScreen)
				{
					document.mozCancelFullScreen();
				}
			}
			cancelEvent(b);
			break;
		}
	}
	window.addEventListener("keydown", onkeydownP, true);
	if(navigator.userAgent.indexOf('Firefox') != -1) // firefox disables mouse wheel scroll if scrollbar is invisible, let's fix this
	{
		function onWheel(e)
		{
			window.scrollBy({
			  top: e.detail*2,
			  left: 0,
			  behavior: 'smooth'
			});
		}
		unsafeWindow.addEventListener ("MozMousePixelScroll", onWheel, false);
	}

	// auto detect failed images
	var DT;
	function ad()
	{
		if(DT){clearTimeout(DT);}
		DT = setTimeout(function() { console.warn("check");if(id("img").naturalWidth == 0){id("loadfail").click();}DT=0; }, 1500);
	}
	ad();

	// preload 1 next page
	var FireFox = ((navigator.userAgent.indexOf('Firefox') != -1) ? true : false);
	var adr, ifr_img;
	function makeframe()
	{
		var img = id("img");
		var preload = id("preload");
		if(!preload)
		{
			preload = document.createElement('iframe');
			preload.id = "preload";
			preload.style.display = "none";
			document.body.appendChild(preload);
		}
		if(history.length != 1) // no preload right after direct page open from gallery with CTRL
		{
			if(FireFox)
			{
				adr = preload.src;
				ifr_img = preload.contentDocument.img;
			}
			else
			{
				if(typeof preload.location !== 'undefined' ){adr = preload.location.href;}
				ifr_img = preload.img;
			}
			if(!adr || parseInt(img.parentNode.href.split("-").pop()) > parseInt(adr.split("-").pop())) // not: reached last page || going backwards
			{
				if(typeof ifr_img === 'undefined' || ifr_img.complete || !ifr_img.naturalWidth) // image loaded or not started loading
				{
					preload.setAttribute("src", img.parentNode.href);
				}
				else
				{
					setTimeout(function() { makeframe(); }, 555);
				}
			}
		}
	}

	if (typeof exportFunction === "undefined")
	{
		delete unsafeWindow.history.replaceState;
		unsafeWindow.history.EXreplaceState = unsafeWindow.history.replaceState;

		unsafeWindow.history.__proto__.replaceState = function (a,b,c)
		{
			unsafeWindow.history.EXreplaceState(a,b,c);
			setTimeout(function() { makeframe(); }, 222);
			ad();
		}
	}
	else // FF 31
	{
		function RS(a,b,c)
		{
			//unsafeWindow.history.EXreplaceState(a,b,c); // no idea, wtf firefox?
			setTimeout(function() { makeframe(); }, 222);
			ad();
		}
		unsafeWindow.history.EXreplaceState = unsafeWindow.history.replaceState;
		exportFunction(RS, unsafeWindow.history.__proto__, {defineAs: "replaceState"});
	}
}
else // MPV
{
	id("bar1").remove(); // settings pane at right
	id("pane_thumbs").remove(); // thumbnails at left
	// centering
	id("pane_images").style.position="absolute";
	id("pane_images").style.top="0px";
	id("pane_images").style.left="0px";
	id("pane_images").style.right="0px";
	id("pane_images").style.bottom="0px";
	id("pane_images").style.margin="auto auto";



	// auto detect failed images
	if (typeof exportFunction === "undefined")
	{
		unsafeWindow.Rrescale_image = unsafeWindow.rescale_image;
		unsafeWindow.rescale_image= function (a,b)
		{
			unsafeWindow.Rrescale_image(a,b);
			setTimeout(function() { if(b.naturalWidth == 0){unsafeWindow.action_reload(a); }}, 2000);
		}

		unsafeWindow.sync_thumbpane = function(){}; // - errors
		unsafeWindow.preload_scroll_thumbs = function(){}; // - errors
	}
	else // FF 31
	{
		function rescale_image(a,b)
		{
			unsafeWindow.Rrescale_image(a,b);
			setTimeout(function() { if(b.naturalWidth == 0){unsafeWindow.action_reload(a); }}, 2000);
		}
		unsafeWindow.Rrescale_image = unsafeWindow.rescale_image;
		exportFunction(rescale_image, unsafeWindow, {defineAs: "rescale_image"});

		exportFunction(function(){}, unsafeWindow, {defineAs: "sync_thumbpane"}); // - errors
		exportFunction(function(){}, unsafeWindow, {defineAs: "preload_scroll_thumbs"}); // - errors
	}

	// F1 hotkey to FullScreen
	function onkeydownP(b)
	{
		switch (b.keyCode)
		{
		case 112: // KeyEvent.DOM_VK_F1
		document.styleSheets[1].cssRules[0].style.setProperty("border","0px solid rgb(227, 224, 209)"); // no border on images
			if(!document.webkitFullscreenElement && !document.mozFullScreenElement)
			{
				if(!document.documentElement.webkitRequestFullscreen){document.documentElement.webkitRequestFullscreen = document.documentElement.mozRequestFullScreen;}
				document.documentElement.webkitRequestFullscreen(window.ALLOW_KEYBOARD_INPUT);
			}
			else
			{
				if (document.webkitCancelFullScreen)
				{
					document.webkitCancelFullScreen();
				}
				else if (document.mozCancelFullScreen)
				{
					document.mozCancelFullScreen();
				}
			}
			cancelEvent(b);
			break;
		}
	}
	window.addEventListener("keydown", onkeydownP, true);
}