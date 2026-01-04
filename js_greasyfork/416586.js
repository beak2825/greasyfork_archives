/*
==Installation instructions==
===Firefox===
If you don't have it already, you'll need to install [https://addons.mozilla.org/en-US/firefox/addon/748 Greasemonkey], then restart Firefox and return to this page.

Then, just click on <span class="plainlinks">[{{fullurl:{{FULLPAGENAME}}|action=raw&ctype=text/javascript&cachedodge=4.4.101&fakeextension=.user.js}} this link]</span> to install the script.

To upgrade a new version when it's updated, just click the install link again &ndash; it'll automagically replace the old version. If the option is enabled, the script will automatically check for updates for you.

===Chrome===
This script can be installed as [https://chrome.google.com/webstore/detail/homestar-all-in-one/ekecfcebbojjfaiendgjgcadampmppdb an extension from the Chrome Web Store]. Chrome will then automatically keep it up-to-date for you via the normal update process.

==Script code==
<pre>*/

// Homestar All-In-One
// version 4.4
// 2018-03-11
// Copyright (c) Phillip Bradbury, Loafing
//
// --------------------------------------------------------------------
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          Homestar All-In-One
// @namespace     http://www.hrwiki.org/
// @description   Combination of many Homestar Runner scripts. Version 4.4.
// @version       4.4.101
// @icon          http://www.hrwiki.org/w/images/thumb/1/1b/logo.png/32px-logo.png
// @match         http://homestarrunner.com/*
// @match         https://homestarrunner.com/*
// @match         http://www.homestarrunner.com/*
// @match         https://www.homestarrunner.com/*
// @match         http://podstar.homestarrunner.com/*
// @match         https://podstar.homestarrunner.com/*
// @match         http://videlectrix.com/*
// @match         https://videlectrix.com/*
// @match         http://www.videlectrix.com/*
// @match         https://www.videlectrix.com/*
// @match         http://hrwiki.org/mirror/*
// @match         https://hrwiki.org/mirror/*
// @match         http://www.hrwiki.org/mirror/*
// @match         https://www.hrwiki.org/mirror/*
// @match         https://secure.homestarrunner.com/heythanks.html*
// @match         http://www.homestarrunner.kitkorp.com/*
// @match         http://thoraxcorp.com/*
// @match         https://old.homestarrunner.com/*
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM.xmlHttpRequest
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/416586/Homestar%20All-In-One.user.js
// @updateURL https://update.greasyfork.org/scripts/416586/Homestar%20All-In-One.meta.js
// ==/UserScript==

(async function(){
	function Utils()
	{
		this.guessisplaying = {
			lastframe: -1,
			lastframeat: new Date(),
			state: true
		};
	}
	
	// Taken from http://diveintogreasemonkey.org/patterns/add-css.html
	Utils.prototype.addGlobalStyle = function(css)
	{
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (!head) return;
		style = document.createElement('style');
		style.type = 'text/css';
		style.appendChild(document.createTextNode(css));
		head.appendChild(style);
	};
	
	// Based on http://userscripts.org/topics/41177
	Utils.prototype.useGMFunctions = async function useGMFunctions()
	{
		// We can't just test if GM_getValue exists, because in Chrome they do exist
		// but they don't actually do anything, just report failure to console.log
	
		// Have to do it like this instead of like "if(window.GM_getValue)"
		// because apparently this function isn't actually on "window", and I don't
		// know where it actually lives...
		if (typeof(GM) == "object" && GM.getValue && await GM.getValue("this-value-doesn't-exist-I-promise", true))
			return 2; // Use GM4 methods
		else if (typeof(GM_getValue) == "function" && GM_getValue("this-value-doesn't-exist-I-promise", true))
			return 1; // Use GM3 methods
		else
			return 0; // Use native methods
	
		return gmstorage;
	};
	// Only really need to do this once...
	Utils.prototype.useGMFunctions = await Utils.prototype.useGMFunctions();
	Utils.prototype.getPref = async function getPref(key, def)
	{
		if (this.useGMFunctions == 2)
			return await GM.getValue(key, def);
		else if (this.useGMFunctions == 1)
			return GM_getValue(key, def);
		else if (window.localStorage)
		{
			var value = localStorage.getItem("hr-allinone-" + key);
			if (value === null)
				return def;
			var type = value[0];
			value = value.substring(1);
			if (type == 'b')
				return Number(value) != 0;
			else if (type == 'n')
				return Number(value);
			else
				return value;
		}
		else
		{
			alert("Homestar Runner All-in-one is not supported on this platform");
			throw "Couldn't find a local storage provider";
		}
	};
	Utils.prototype.setPref = function(key, value)
	{
		if (this.useGMFunctions == 2)
			GM.setValue(key, value);
		else if (this.useGMFunctions == 1)
			GM_setValue(key, value);
		else if (window.localStorage)
		{
			if (typeof(value) == "string")
				localStorage.setItem("hr-allinone-" + key, "s" + value);
			else if (typeof(value) == "number")
				localStorage.setItem("hr-allinone-" + key, "n" + value);
			else if (typeof(value) == "boolean")
				localStorage.setItem("hr-allinone-" + key, "b" + (value ? 1 : 0));
			else
				throw "Unexpected type for storage: " + typeof(value);
		}
		else
		{
			alert("Homestar Runner All-in-one is not supported on this platform");
			throw "Couldn't find a local storage provider";
		}
	};
	
	Utils.prototype.downloadPage = function(url, method)
	{
		if (!method)
			method = 'GET';
		return new Promise((resolve, reject) => {
			if (typeof(GM) == "object" && GM.xmlHttpRequest) {
				GM.xmlHttpRequest({
					method: method,
					url: url,
					onload: res => resolve({text: res.responseText, status: res.status, statusText: res.statusText, headers: res.responseHeaders}),
					onerror: res => reject(`${res.status} ${res.statusText}`)
				});
			} else if (typeof(GM_xmlhttpRequest) == "function") {
				GM_xmlhttpRequest({
					method: method,
					url: url,
					onload: res => resolve({text: res.responseText, status: res.status, statusText: res.statusText, headers: res.responseHeaders}),
					onerror: res => reject(`${res.status} ${res.statusText}`)
				});
			} else {
				var xhr = new XMLHttpRequest();
				xhr.onload = () => resolve({text: xhr.responseText, status: xhr.status, statusText: xhr.statusText, headers: xhr.getAllResponseHeaders()});
				xhr.onerror = () => reject(`${xhr.status} ${xhr.statusText}`);
				xhr.open(method, url);
				xhr.send();
			}
		});
	};
	Utils.prototype.buildWikiUrl = function(page)
	{
		var url = escape(page.replace(/ /g, '_'));
		return "http://www.hrwiki.org/w/index.php?title=" + url + "&action=raw&source=allinone&cachedodge=" + this.getPref('cachedodge', 0);
	};
	Utils.prototype.downloadWiki = async function downloadWiki(page)
	{
		for (var timesredirected = 0; timesredirected < 3; timesredirected++) {
			var res = await this.downloadPage(this.buildWikiUrl(page));
	
			// check for redirects
			var matches = res.text.match(/^\s*#\s*REDIRECT\s*\[\[(.*)\]\]/i);
			if (matches)
			{
				// Get the page name out of the redirect text
				var text = matches[1];
				if ((matches = text.match(/^(.*)\|/)))
					text = matches[1];
				if ((matches = text.match(/^(.*)\#/)))
					text = matches[1];
				page = text.replace(/^\s+|\s+$/g, '');
			}
			else
				return res.text;
		}
		throw "Too many redirects";
	};
	Utils.prototype.parseWikiXML = function(text)
	{
		// strip various things - templates and <pre> tags for wiki formatting, and <noinclude> sections...
		// <includeonly> tags are stripped (but their contents kept) for consistency.
		text = text.replace(/{{.*?}}/g, "");
		text = text.replace(/<\/?pre[^>]*>/g, "");
		text = text.replace(/<noinclude[^>]*>.*?<\/noinclude[^>]*>/g, "");
		text = text.replace(/<includeonly[^>]*>(.*?)<\/includeonly[^>]*>/g, "$1");
		text = text.replace(/^\s+/g, "");
	
		var parser = new DOMParser();
		try
		{
			var doc = parser.parseFromString(text, "application/xml");
		}
		catch (e)
		{
			throw "Error in XML:\n" + e.toString();
		}
		// check if returned document is an error message
		if (doc.getElementsByTagName('parsererror').length > 0)
		{
			var error = doc.getElementsByTagName('parsererror')[0];
			if (error.firstChild.nodeType == doc.TEXT_NODE && error.lastChild.nodeType == doc.ELEMENT_NODE && error.lastChild.nodeName == "sourcetext")
			{
				// Firefox's errors look like this:
				// <parsererror>Error details<sourcetext>Source text</sourcetext></parsererror>
				throw (
					error.firstChild.nodeValue.replace(/Location: .*\n/, "") + "\n" +
					doc.documentElement.lastChild.textContent
				);
			}
			else if (error.getElementsByTagName('div').length > 0)
			{
				// Chrome's errors look like this:
				// <someRoot><parsererror style="..."><h3>Generic error message</h3><div style="...">Error details</div><h3>Generic footer</h3><attempted parsing of page/></someRoot>
				throw (
					"Error in XML:\n" +
					error.getElementsByTagName('div')[0].textContent
				);
			}
			else
			{
				// Try to at least return something
				throw (
					"Error in XML:\n" +
					error.textContent
				);
			}
		}
		return doc;
	};
	
	Utils.prototype.currentFrame = async function currentFrame(flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		if (flashmovie === globals.flashmovie && globals.is_puppets)
		{
			var a = await playercomm.targetCurrentFrame(flashmovie, "/videoplayer");
	
			// Keep track of whether the current frame is changing, for isPlaying()
			// If we stay on the same frame for more than, say, a second, guess
			// that we're paused.
			if (a != this.guessisplaying.lastframe)
			{
				this.guessisplaying.lastframe = a;
				this.guessisplaying.lastframeat = new Date();
				this.guessisplaying.state = true;
			}
			else if (new Date() - this.guessisplaying.lastframeat > 1000)
			{
				this.guessisplaying.state = false;
			}
	
			return a;
		}
		else
		{
			return await playercomm.currentFrame(flashmovie)
		}
	};
	Utils.prototype.totalFrames = async function totalFrames(flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		var a;
		if (flashmovie === globals.flashmovie && globals.is_puppets)
			return await playercomm.targetTotalFrames(flashmovie, "/videoplayer")
		else
			return await playercomm.totalFrames(flashmovie)
	};
	Utils.prototype.isPlaying = async function isPlaying(flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		if (flashmovie === globals.flashmovie && globals.is_puppets)
		{
			// There isn't a telltarget version of IsPlaying, there's no flag for it in
			// TGetProperty, and it doesn't seem to be gettable via GetVariable (though
			// it's possible I just haven't tried the right thing)...
			// So, for puppet toons, we need to try to track whether it seems to be playing...
			return this.guessisplaying.state;
		}
		else
		{
			return await playercomm.isPlaying(flashmovie);
		}
	};
	Utils.prototype.framesLoaded = async function framesLoaded(flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		if (flashmovie === globals.flashmovie && globals.is_puppets)
			return await playercomm.targetFramesLoaded(flashmovie, '/videoplayer')
		else
			return await playercomm.targetFramesLoaded(flashmovie, '/')
	};
	Utils.prototype.isLoaded = async function isLoaded(flashmovie)
	{
		var frame = await this.currentFrame(flashmovie);
		return frame >= 0;
	};
	Utils.prototype.waitLoaded = function(flashmovie)
	{
		var useglobal = false;
		if (!flashmovie) {
			useglobal = true;
			flashmovie = globals.flashmovie;
		}
		if (!flashmovie)
			return new Promise((resolve, reject) => reject());
	
		if (useglobal && this.loadedPromise)
			return this.loadedPromise;
	
		async function poll(resolve) {
			if (await this.isLoaded(flashmovie))
				resolve();
			else
				setTimeout(poll.bind(this, resolve), 100)
		}
		var promise = new Promise(poll.bind(this));
		if (useglobal)
			this.loadedPromise = promise;
		return promise;
	}
	Utils.prototype.stop = async function stop(flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		if (flashmovie === globals.flashmovie && globals.is_puppets)
		{
			await playercomm.targetStop(flashmovie, "/videoplayer");
	
			// make sure this.guessisplaying.lastframe is updated so that it doesn't
			// go back to state=true
			await this.currentFrame(flashmovie);
			this.guessisplaying.state = false;
		}
		else
		{
			await playercomm.stop(flashmovie);
		}
	};
	Utils.prototype.play = async function play(flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		if (flashmovie === globals.flashmovie && globals.is_puppets)
		{
			await playercomm.targetPlay(flashmovie, "/videoplayer");
			this.guessisplaying.state = true;
			this.guessisplaying.lastframeat = new Date();
		}
		else
		{
			await playercomm.play(flashmovie);
		}
	};
	Utils.prototype.goto = async function goto(frame, flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		if (flashmovie === globals.flashmovie && globals.is_puppets)
		{
			await playercomm.targetGoto(flashmovie, "/videoplayer", frame);
	
			// make sure this.guessisplaying.lastframe is updated so that it doesn't
			// go back to state=true
			await this.currentFrame(flashmovie);
			this.guessisplaying.state = false;
		}
		else
		{
			await playercomm.goto(flashmovie, frame);
		}
	};
	Utils.prototype.zoomOut = async function zoomOut(factor, flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		await playercomm.zoom(flashmovie, 100 * factor);
	};
	Utils.prototype.zoomIn = async function zoomIn(factor, flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		await playercomm.zoom(flashmovie, 100 / factor);
	};
	Utils.prototype.zoomReset = async function zoomReset(factor, flashmovie)
	{
		if (!flashmovie)
			flashmovie = globals.flashmovie;
		if (!flashmovie)
			return;
	
		await playercomm.zoom(flashmovie, 0);
	};
	
	Utils.prototype.insertAfter = function(newElement, referenceElement)
	{
		if(referenceElement.nextSibling)
			referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
		else
			referenceElement.parentNode.appendChild(newElement);
	};

	function Globals()
	{
		this.whichsite = 0;
		if (location.hostname.indexOf("podstar") >= 0) this.whichsite = 1;
		if (location.hostname.indexOf("videlectrix") >= 0) this.whichsite = 2;
		if (location.pathname.indexOf("/mirror/") >= 0) this.whichsite = 3;
	
		// icons, as Base64-encoded PNG files.
		this.images = {
			close:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAm' +
				'JLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfWBRkTNhxuPxLkAAAAHX' +
				'RFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBUaGUgR0lNUO9kJW4AAAEKSURBVCjPhdGxSgNBFA' +
				'XQMzpgYWwsLEQUDBJBQgqFIChZEPR7/DA/QCGQTgQtJE1ENoWohYUgbGKQyFjErNv52nObe1' +
				'9wqGWg7z0l5YVgVdOu+wUt507tqIVQ4Zodp861ooELe15M5KFI6Zfr9u25MIj6Jl4cmSIPBW' +
				'rq2o5cufO4aOJDYSozNTa2pK4t03PtwUdMKRRykAmW0dTRcyNXpBQpI8GJDTR050zkNzK0bM' +
				'MZLvUNZ8yCfy6Wvbc1NVyi4dloXjqWvds6uvp41pFmpVOKJWd6bgwxkmTMIotWKpwrfBkZl7' +
				'uMonUHf5wSlV2+fUZrjnXdzrmyy7djD8GWTW9e51z557o1Tz85FH/WkOkaHQAAAABJRU5Erk' +
				'Jggg==',
			ffwd:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABl' +
				'BMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAA' +
				'sTAQCanBgAAAAHdElNRQfeCgQNLh+v5c+DAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aC' +
				'BHSU1QV4EOFwAAAC9JREFUCNcVisENAEAIwjo6ozmKI/j0YfS4hAeUIhFBJlV0M8Mudz8uno' +
				'a+LFiTHqCuHAU1qtJ6AAAAAElFTkSuQmCC',
			hrwiki:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGX' +
				'RFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAm1QTFRF////2wAzgZDJAiGNAB' +
				'6Lenp6ABCEABKFAAyDjp3O8gAAipjLlaPPFUixAB6OAA6C/f//fY3JABaIhJXK///50gAn//' +
				'/4CymXyQAaAA+DOFCm1QAmDiuX//zvnV2IfI3IQ0h7ABSFN0+qZXm9ABSG9PTxABiK2wAkuQ' +
				'AdSWW5WGu4cILCgYy209PZGRdjABeH0AALDiyYASGOhJTL2bi8k5OTzgAj1QAdLkilAAiDAB' +
				'iQIiCBzwAbyAAk//31ABSO0gAXDB95c5nZDAxeoRhHOVCp7u3lfx1W1LrCxQYtwwApQVitwA' +
				'QpJj2bAAyFKSODfI3GYna86urqysfL9fT0NUyXMDGGNk6cxgASy9rkAB2OQ1qzTmOzu8Pa4d' +
				'/b+v//58zRFEqw09XR25yrIjyh9P//g5PLAAN+foy/uRY92treh6neAASDXXC9jJvKjJvL6e' +
				'npiJfKDzejNk6r2wE1N0+rABKEAB6KxAAn0tPWyQAZRFuvXXfB/f392AAgKiib2QAyABaJhJ' +
				'TH2XeNEy+ZzgAwBiSRKUOlgI27urrP7t/iCghS0AAfk3SoyBc+iChf3vH1VWq426GvgI/Hiz' +
				'duboDCPEOXABCDSmu/DyeD///6P2K4OUJ/HByRlKHOAB+O8AAA2QI1hZPHg5TI9PT0ABuJiZ' +
				'jM1tbdf43CzgApAB2We4vD7e3rwgAseInHAyGWi5rOUme3hIuqFTGaWG25dojDd5LQ5Ki1AA' +
				'yMASCNcYHEAyKOABqLACSWHDeR+vr6uwAiIyBjipnJ1AIyjZvMmJyaITylAByMAB2L5wAlHD' +
				'eeCCaUcHCjWGy4wBQy/7AMAgAAARFJREFUeNpiONFeuLWjfL4RM1/R4tXyx5kZdrNHZ8za5D' +
				'jT3n/KimUtLDsZhPbFJilY14d5cC3o1dRnaWPILaucozf3DAND3DmnxqWnmRjyd+046NzJwG' +
				'B6dMJ6xVNHJjPIrGvq1mVgYGBlZQg9xjlxD4MKh2+wKgMILLET00mPYmCqFpctYIAAEamz3A' +
				'zaG4TdgmohAllpgsoMbBw5y9fshwiEW0qyM7jGbIlMjWcQCOlKMKnR8rZgyDOe3e95oErCJq' +
				'LOPDGQ8xBDCv8qF9tWRkb1SStPTvNTU2JgK83OrDjMaKbB0Gwgt23zdIap83h9vBZKJ4MMdZ' +
				'/Bs5EhwHBvz9qSBoftDAx9olbFiwACDABkK1N43Z86KwAAAABJRU5ErkJggg==',
			next:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABl' +
				'BMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAA' +
				'sTAQCanBgAAAAHdElNRQfeCgQNLSOrp+DHAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aC' +
				'BHSU1QV4EOFwAAACtJREFUCNdjULBhMLBhsLBhsLFhsLNhsAeiPQz2f8BoD4hrB5ayACtTsA' +
				'EA6J8JvyvoxNYAAAAASUVORK5CYII=',
			pause:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABl' +
				'BMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAA' +
				'sTAQCanBgAAAAHdElNRQfeCgQNLS1MH83AAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aC' +
				'BHSU1QV4EOFwAAAA5JREFUCNdjsLFhIAUBALQwB4FBHjsqAAAAAElFTkSuQmCC',
			play:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABl' +
				'BMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAA' +
				'sTAQCanBgAAAAHdElNRQfeCgQNLjLqOpP2AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aC' +
				'BHSU1QV4EOFwAAACdJREFUCNcdirEJAAAMg/z/qpzUAwJpG3ARRTBgyCEyxCTFVX1yN7Ejqh' +
				'alykITkQAAAABJRU5ErkJggg==',
			prefs:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAll' +
				'BMVEUAGQASEhIfHx8fJy8pKSk2NjZBQUFJR0ZQUE9RUVFSUlJNX3NoaGhsaWdramlycG1meY' +
				'98fHx+fn5wgpV0iqKKh4R4jaR9jJx8kad9kad/mbONmaWEnrmEnrqkoZy3t7fIx8bKyMHT0c' +
				'3S0dDU09DV1NPP1t3W1dXY2Njb2tfe29bf3tzj4uHr6+js6+r39/f5+PgAAABrL3yvAAAAAX' +
				'RSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfWBR' +
				'oFKh31UQ8DAAAAgUlEQVQY022OxxLCMAwFRSc4BEIPJZQQ08v+/8+RsTExDDpIe3ijfSJ/hx' +
				'9g62Dt4GaAI+8YT0t27+BxxvvE/no5pYT10lGFrE34Ja40W3g1oMGmW7YZ6hnCYexKTPVkXi' +
				'vuvWe1Cz1aKqPNI3N0slI2TNYZiARJX30qERc7wBPKC4WRDzWdWHfmAAAAAElFTkSuQmCC',
			prev:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABl' +
				'BMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAA' +
				'sTAQCanBgAAAAHdElNRQfeCgQNLgFV6vLgAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aC' +
				'BHSU1QV4EOFwAAACxJREFUCNdjsGFhsOFhsJFhsLFhsKlhsPnDYPuHwR6MgAwgFyRoA1YAVM' +
				'YCABGLC3k4wQ8QAAAAAElFTkSuQmCC',
			rewind:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABl' +
				'BMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAA' +
				'sTAQCanBgAAAAHdElNRQfeCgQNLhgxgVogAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aC' +
				'BHSU1QV4EOFwAAAC9JREFUCNdjYGRkYGZmYGdn4OdnkJdnsLdnqK9n+P8fhIAMIBcoCJQCKg' +
				'AqY2QEALxwB9ke+WHMAAAAAElFTkSuQmCC',
			stop:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1' +
				'BMVEUAAACnej3aAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9' +
				'4KBA0uOX3oSn4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAADElEQV' +
				'QI12NgIA0AAAAwAAHHqoWOAAAAAElFTkSuQmCC',
			update:
				'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAMAAABG8BK2AAAC8V' +
				'BMVEUAAAD/AAD+AQH/AQH/AgL+AwP/AwP+BAT/BAT/BQX+Bgb/Bgb/Bwf+CAj/CAj/CQn/Cg' +
				'r+Cwv/Cwv+DAz/DAz/DQ3/Dg7+Dw//Dw//EBD+ERH/ERH/EhL/ExP+FBT/FRX/Fhb/Fxf+GB' +
				'j/GBj/GRn/Ghr/Gxv/HBz/HR3/Hh7/Hx//ICD+ISH/ISH/IiL/IyP/JCT/JSX/Jib/Jyf/KS' +
				'n/Kyv/LCz/LS3/Ly//MDD/MTH+MjL/MjL/MzP/NDT/NTX/Njb+Nzf/Nzf/ODj+OTn/OTn/Oj' +
				'r/PDz/Pj7/Pz//QUH/QkL+Q0P/RUX/Rkb/R0f/SEj/SUn/Skr/S0v/TEz/TU3/Tk7/T0//UF' +
				'D/UVH/UlL/VFT/VVX/Vlb/WFj/WVn/Wlr/W1v/XFz/XV3/Xl7/X1//YGD/YWH/YmL/Y2P/ZW' +
				'X/Zmb/Z2f/aGj/aWn/amr/a2v/bGz/bW3/bm7/b2//cHD/cXH/cnL/dHT/dnb/d3f/eHj/eX' +
				'n/e3v/fX3/fn7/f3//gID/gYH/goL/g4P/hIT/hob/h4f/iIj/iYn/ior/i4v/jIz/jY3/jo' +
				'7+kJD/kJD/kZH/kpL/lJT/lpb/l5f/mJj/mZn/mpr/m5v/nJz/nZ3/n5//oKD/oaH/oqL/o6' +
				'P/pqb/p6f/qKj/qan/qqr/q6v/rKz/ra3/r6//sLD/sbH/srL/s7P/tLT/tbX/trb/t7f/uL' +
				'j/urr/u7v/vLz/vb3/vr7/v7//wMD/wcH/wsL/w8P/xMT/xcX/xsb+x8f/x8f/yMj/ycn/ys' +
				'r/y8v/zMz/zc3/zs7/z8//0ND/0dH/0tL/09P+1NT/1NT/1tb/19f+2Nj/2Nj/2dn/29v/3N' +
				'z/3d3/39//4OD/4eH/4uL/4+P/5OT/5eX/5ub/5+f/6Oj/6en/6ur/6+v/7Oz/7e3/7u7/7+' +
				'/+8PD/8fH/8vL/8/P/9PT/9fX/9vb/9/f/+Pj/+fn/+vr/+/v//Pz//f3+/v7//v7////+AA' +
				'A5GkRyAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADzoAAA+IAUHKF/gAAA' +
				'AHdElNRQfXCRYICgxGxxkcAAAEL0lEQVRYw63Xe1wURRwA8Pm1G0KcHdGBkKAYjxC0yLJITU' +
				'l7cr7RUjAos4AuraCH2pWCVlZaRpD5AEXDwAemQRFdmgQeCgWUPKTk4JJHomAq5PBXu/fC2z' +
				't2Z7fdf+Y38/nc9zPz+83M7iEQ9VBDjCNxStKGG5xJSBSjWPV+c3m0nxNFDEP/XBf3ZkPLuv' +
				'GOigiG2oLrhyvVJX26abdzFXKGWtrUPRXA5aasRjyD5ijkzJjd/2aMNkXqhCiKoxAzU9bg3n' +
				'mDdXe1V4iZJIzTBnvhH9xrpxAzKbj1cYDY2Ww8AMuOL7NTiBg6koZX2rruhFhjLJsVP5iv8b' +
				'FTSBj6xxo/CHqxXftwYxFTKwhY/aj9iogYOgfrRwCM/vr0qXOmpUQ0pXAVYYZa19tuymc8xq' +
				'vY1u0nnOXCUQQZ6vnf/p5jiibpqgOYxqcctwRwFUEmqrD/1VvMYWppjGrUE7/ghkAHRYhxy8' +
				'QdG6x79u2DBbru/mLHuQgyr+H9HYatCkvv2U3Hdmv9nSgCzKyW/MnBpW1HvSz9gRHsMUAiGe' +
				'/1OA5A9XlX/TQv7pkmZtzB/Y1UNvBMP2NIDOVTeJjpT49lJNOjXHHq/Mb7eRQe5pnavAm2W3' +
				'jRt33Fjw2t8C3qG3z8AWvsOnFba6YbNZTCw9yYYsg2qkfabqpZPkPOhXc2ET2bk3FpAvDXSJ' +
				'BxbSsZ29O1fz2BwrtvVlzSNb60vX5ruEJI4WVUxxoTISSp46hWJaA4MtSw2dlVRXlq5jy6H6' +
				'5hRzw+XasSUBwYOu2rC4YO/bmWM0EesPRQsGnsZiGFy9AlVbmRzG9dQrMr1NSEE1OEs+uEoX' +
				'bivUGW+EBrIGh3KYkUDuP7bu3JPZ7mOKSsgFr4ggeRwmE87/FfW9Pqbb74vqgOg3Ay5XqGmp' +
				'Re9+U7vsvL/0oybZRE9rIhU65j6Az9tZL0ffn3jdtyadNdzEAaTiZVBhn6O9y+YBxAUw64fn' +
				'R+hxoUVXg5qWJjqBzcFsbutYrDwwBWHvr9rUrc5E+q2JjQExceYduHruQqBgAe3NhvLBhDrN' +
				'iYyD79agXzTtXg98xs9CIvcsXGRPzQc7F68R23NlxZQtk+pZEohnoyBuDuqI9P99Y244rhJP' +
				'eLMyZQ90exJgyUU/dgfPEpKYp5UeHak83fT2Tf0pXX8hMlKMj6Znu57HIMcwjmZmCcI15BVI' +
				'CvWfLK7ExmKnzbPH3fJ6IV9NzZLG/LKo4Y49kmOHKUaAVB2T8h1pzGGMeLrrSVmX71iPUzaO' +
				'afMyRk15Lios4EixONl0hU2ErldW82O5rOORIVU8ELDZ8xDq2sPRsmUTHvm8LuyvjFr/+Kc3' +
				'0kKpbtt6OuC+OefSOlKrYTHqf5MNVPsoLs/2QjGZj/oSB5FCSPguRRkDwKkkdB8ihIHgXJoy' +
				'B5FCSPguRRkDzKf7Z6NUd33kmjAAAAAElFTkSuQmCC'
		};
	
		// find flash objects
		var objs;
		switch (this.whichsite)
		{
			case 0: // www.homestarrunner.com
				objs = document.getElementsByTagName("EMBED");
				if (objs && objs.length >= 2)
				{
					this.flashmovie = objs[0];
					this.navbar = objs[1];
				}
				else if (objs && objs.length >= 1)
				{
					this.flashmovie = objs[0];
					this.navbar = false;
				}
				else
				{
					this.flashmovie = false;
					this.navbar = false;
				}
				if (!this.flashmovie)
				{
					objs = document.getElementsByTagName("OBJECT");
					if (objs && objs.length >= 1)
						this.flashmovie = objs[0];
				}
				break;
			case 1: // podstar.homestarrunner.com
				objs = document.getElementsByTagName("EMBED");
				this.flashmovie = false;
				if (objs && objs.length >= 1)
					this.navbar = objs[0];
				else
					this.navbar = false;
				break;
			case 2: // videlectrix
				objs = document.getElementsByTagName("EMBED");
				this.navbar = false;
				if (objs && objs.length >= 1)
					this.flashmovie = objs[0];
				else
					this.flashmovie = false;
				/*settings.navbar = false;*/
				break;
			case 3: // mirror
				objs = document.getElementsByTagName("EMBED");
				this.flashmovie = false;
				if (objs && objs.length >= 1)
					this.flashmovie = objs[0];
				if (!this.flashmovie)
				{
					objs = document.getElementsByTagName("OBJECT");
					if (objs && objs.length >= 1)
						this.flashmovie = objs[0];
				}
				this.navbar = document.getElementById('navbar');
				/*if (!this.navbar)
					settings.navbar = false;*/
				var flashcontainer = document.getElementById('flash');
				if (flashcontainer)
					flashcontainer.style.width = "auto";
				break;
		}
		if (this.flashmovie)
		{
			//expose Flash plugin-added methods
			if (this.flashmovie.wrappedJSObject)
				this.flashmovie = this.flashmovie.wrappedJSObject;
			
			// confirm that this is really a flash file
			// and not (for example) the embedded background sound on SB's website
			var src = this.flashmovie.getAttribute('src');
			if (this.flashmovie.nodeName.toLowerCase() == "object")
			{
				if (src)
				{
					if (src.substring(src.length - 4).toLowerCase() != ".swf")
						this.flashmovie = false;
				}
				else
				{
					var a = this.flashmovie.getElementsByTagName('param').namedItem("movie");
					if (!a || a.value.substring(a.value.length - 4).toLowerCase() != ".swf")
						this.flashmovie = false;
					else
						src = a.value;
				}
			}
			else if (this.flashmovie.nodeName.toLowerCase() == "embed")
			{
				if (!src || src.substring(src.length - 4).toLowerCase() != ".swf")
					this.flashmovie = false;
			}
	
			// puppet_background.swf is a wrapper around the puppet stuff popup toons
			// This flag tells things like seekbar to control the wrapped movie clip
			if (src)
				this.is_puppets = src == "puppet_background.swf" || src.substring(src.length - 22) == "/puppet_background.swf";
		}
		// Don't run large flash objects inline (gets rid of some extra padding from
		// having the movie sitting on the baseline)
		if (this.flashmovie)
		{
			this.flashmovie.style.display = "block";
			this.flashmovie.style.margin = "0 auto";
		}
		if (this.navbar)
		{
			this.navbar.style.display = "block";
			this.navbar.style.margin = "0 auto";
		}
	
		this.filename = window.location.pathname.toLowerCase();
		var i = this.filename.lastIndexOf('/');
		if (i >= 0)
			this.filename = this.filename.substr(i + 1);
		i = this.filename.lastIndexOf('.');
		if (i >= 0)
			this.filename = this.filename.substr(0,i);
	}
	Globals.prototype.initModules = async function initModules()
	{
		this.modules = {};
		this.modules.settingspane = new SettingsPane();
		this.modules.fullscreen = new Fullscreen();
		this.modules.seekbar = new Seekbar();
		this.modules.wikilink = new WikiLink();
		this.modules.nextprev = new NextPrev();
		this.modules.navbar = new Navbar();
		this.modules.subtitles = new Subtitles();
		this.modules.updates = new Updates();
		// Can load the preferences in each module in parallel
		var start = new Date();
		var loadpromises = []
		for (var i in this.modules)
			loadpromises.push(this.modules[i].load());
		await Promise.all(loadpromises)
		var end = new Date();
		console.log(`Loaded prefs in ${end - start}ms`);
		// Initialise each module in sequence
		for (var i in this.modules)
			await this.modules[i].init();
		this.modules.settingspane.initComplete();
	};

	function PlayerComm()
	{
	}
	PlayerComm.handlers = {};
	PlayerComm.prototype.init = function()
	{
		var script = document.createElement("script");
		script.appendChild(document.createTextNode("(" + this.inPageContext + ")();"));
		document.body.appendChild(script);
	
		this.origin = document.location.protocol + "//" + document.location.hostname;
		var defaultport = '';
		if (document.location.protocol == 'http:')
			defaultport = '80';
		else if (document.location.protocol == 'https:')
			defaultport = '443';
		if (document.location.port && document.location.port != defaultport)
			this.origin += ":" + document.location.port;
	
		this.callbacks = [];
		this.id_count = 0;
	
		window.addEventListener("message", this.receiveMessage.bind(this), false);
	}
	PlayerComm.prototype.inPageContext = function()
	{
		// This code is run in the page context (which in Chrome is the only one
		// allowed to communicate with the Flash object) to communicate with the script
	
		var origin = document.location.protocol + "//" + document.location.hostname;
		var defaultport = '';
		if (document.location.protocol == 'http:')
			defaultport = '80';
		else if (document.location.protocol == 'https:')
			defaultport = '443';
		if (document.location.port && document.location.port != defaultport)
			origin += ":" + document.location.port;
	
		var handlers = {}
	
		function receiveMessage(event)
		{
			if (event.origin !== origin)
				return;
			if (event.data.message.substring(0, 8) !== 'aio_req_')
				return;
	
			var message = event.data.message.substring(8);
			handlers[message](event.data);
		}
		window.addEventListener("message", receiveMessage, false);
	
		// Documentation for the Flash interface is really lacking...
		// Adobe removed the docs from their website.
		// Luckily, the Wayback Machine captures all
		// http://web.archive.org/web/20100710000820/http://www.adobe.com/support/flash/publishexport/scriptingwithflash/scriptingwithflash_03.html
		// http://web.archive.org/web/20090210205955/http://www.adobe.com/support/flash/publishexport/scriptingwithflash/scriptingwithflash_04.html
	
		handlers.currentFrame = function(data)
		{
			var elem = document.getElementById(data.id);
			var a = elem.CurrentFrame;
			if (typeof(a) == 'function')
				a = elem.CurrentFrame();
			if (typeof(a) !== 'number' || a < 0)
				a = -1;
	
			window.postMessage({
				message: "aio_resp_paramCallback",
				callback: data.callback,
				val: a
			}, origin);
		}
	
		handlers.targetCurrentFrame = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.TCurrentFrame) == 'function')
				a = elem.TCurrentFrame(data.target);
			else
				a = -1;
	
			window.postMessage({
				message: "aio_resp_paramCallback",
				callback: data.callback,
				val: a
			}, origin);
		}
	
		handlers.totalFrames = function(data)
		{
			var elem = document.getElementById(data.id);
			var a = elem.TotalFrames;
			if (typeof(a) == 'function')
				a = elem.TotalFrames();
			if (typeof(a) !== 'number' || a < 0)
				a = -1;
	
			window.postMessage({
				message: "aio_resp_paramCallback",
				callback: data.callback,
				val: a
			}, origin);
		}
	
		handlers.targetTotalFrames = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.TGetPropertyAsNumber) == 'function')
				a = elem.TGetPropertyAsNumber(data.target, 5);  // TOTAL_FRAMES
			else
				a = -1;
	
			window.postMessage({
				message: "aio_resp_paramCallback",
				callback: data.callback,
				val: a
			}, origin);
		}
	
		handlers.isPlaying = function(data)
		{
			var elem = document.getElementById(data.id);
			var a = elem.IsPlaying;
			if (typeof(a) == 'function')
				a = elem.IsPlaying();
			if (typeof(a) == 'number')
				a = (a != 0);
			else if (typeof(a) != 'boolean')
				a = false;
	
			window.postMessage({
				message: "aio_resp_paramCallback",
				callback: data.callback,
				val: a
			}, origin);
		}
	
		handlers.targetFramesLoaded = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.TGetPropertyAsNumber) == 'function')
				a = elem.TGetPropertyAsNumber(data.target, 12);  // FRAMES_LOADED
			else
				a = -1;
	
			window.postMessage({
				message: "aio_resp_paramCallback",
				callback: data.callback,
				val: a
			}, origin);
		}
	
		handlers.stop = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.StopPlay) == 'function')
				elem.StopPlay();
	
			window.postMessage({
				message: "aio_resp_basicCallback",
				callback: data.callback
			}, origin);
		}
	
		handlers.targetStop = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.TStopPlay) == 'function')
				elem.TStopPlay(data.target);
	
			window.postMessage({
				message: "aio_resp_basicCallback",
				callback: data.callback
			}, origin);
		}
	
		handlers.play = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.Play) == 'function')
				elem.Play();
	
			window.postMessage({
				message: "aio_resp_basicCallback",
				callback: data.callback
			}, origin);
		}
	
		handlers.targetPlay = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.TPlay) == 'function')
				elem.TPlay(data.target);
	
			window.postMessage({
				message: "aio_resp_basicCallback",
				callback: data.callback
			}, origin);
		}
	
		handlers.goto = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.GotoFrame) == 'function')
				elem.GotoFrame(data.frame);
	
			window.postMessage({
				message: "aio_resp_basicCallback",
				callback: data.callback
			}, origin);
		}
	
		handlers.targetGoto = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.TGotoFrame) == 'function')
				elem.TGotoFrame(data.target, data.frame);
	
			window.postMessage({
				message: "aio_resp_basicCallback",
				callback: data.callback
			}, origin);
		}
	
		handlers.zoom = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.Zoom) == 'function')
				elem.Zoom(data.zoom);
	
			window.postMessage({
				message: "aio_resp_basicCallback",
				callback: data.callback
			}, origin);
		}
	
		handlers.setScaleMode = function(data)
		{
			var elem = document.getElementById(data.id);
			if (typeof(elem.SetVariable) == 'function')
				elem.SetVariable("Stage.scaleMode", data.scaleMode);
	
			window.postMessage({
				message: "aio_resp_basicCallback",
				callback: data.callback
			}, origin);
		}
	}
	
	
	PlayerComm.prototype.currentFrame = function(elem)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_currentFrame",
			callback: this.storeCallback(resolve),
			id: this.getId(elem)
		}, this.origin));
	}
	
	PlayerComm.prototype.targetCurrentFrame = function(elem, target)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_targetCurrentFrame",
			callback: this.storeCallback(resolve),
			id: this.getId(elem),
			target: target
		}, this.origin));
	}
	
	PlayerComm.prototype.totalFrames = function(elem)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_totalFrames",
			callback: this.storeCallback(resolve),
			id: this.getId(elem)
		}, this.origin));
	}
	
	PlayerComm.prototype.targetTotalFrames = function(elem, target)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_targetTotalFrames",
			callback: this.storeCallback(resolve),
			id: this.getId(elem),
			target: target
		}, this.origin));
	}
	
	PlayerComm.prototype.isPlaying = function(elem)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_isPlaying",
			callback: this.storeCallback(resolve),
			id: this.getId(elem)
		}, this.origin));
	}
	
	PlayerComm.prototype.targetFramesLoaded = function(elem, target)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_targetFramesLoaded",
			callback: this.storeCallback(resolve),
			id: this.getId(elem),
			target: target
		}, this.origin));
	}
	
	PlayerComm.prototype.stop = function(elem)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_stop",
			callback: this.storeCallback(resolve),
			id: this.getId(elem)
		}, this.origin));
	}
	
	PlayerComm.prototype.targetStop = function(elem, target)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_targetStop",
			callback: this.storeCallback(resolve),
			id: this.getId(elem),
			target: target
		}, this.origin));
	}
	
	PlayerComm.prototype.play = function(elem)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_play",
			callback: this.storeCallback(resolve),
			id: this.getId(elem)
		}, this.origin));
	}
	
	PlayerComm.prototype.targetPlay = function(elem, target)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_targetPlay",
			callback: this.storeCallback(resolve),
			id: this.getId(elem),
			target: target
		}, this.origin));
	}
	
	PlayerComm.prototype.goto = function(elem, frame)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_goto",
			callback: this.storeCallback(resolve),
			id: this.getId(elem),
			frame: frame
		}, this.origin));
	}
	
	PlayerComm.prototype.targetGoto = function(elem, target, frame)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_targetGoto",
			callback: this.storeCallback(resolve),
			id: this.getId(elem),
			target: target,
			frame: frame
		}, this.origin));
	}
	
	PlayerComm.prototype.zoom = function(elem, zoom)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_zoom",
			callback: this.storeCallback(resolve),
			id: this.getId(elem),
			zoom: zoom
		}, this.origin));
	}
	
	PlayerComm.prototype.setScaleMode = function(elem, scaleMode)
	{
		return new Promise(resolve => window.postMessage({
			message: "aio_req_setScaleMode",
			callback: this.storeCallback(resolve),
			id: this.getId(elem),
			scaleMode: scaleMode
		}, this.origin));
	}
	
	PlayerComm.prototype.receiveMessage = function(event)
	{
		if (event.origin !== this.origin)
			return;
		if (event.data.message.substring(0, 9) !== 'aio_resp_')
			return;
	
		var message = event.data.message.substring(9);
		PlayerComm.handlers[message].call(this, event.data);
	}
	
	PlayerComm.handlers.basicCallback = function(data)
	{
		var callback = this.getCallback(data.callback);
		if (callback)
			callback();
	}
	
	PlayerComm.handlers.paramCallback = function(data)
	{
		var callback = this.getCallback(data.callback);
		if (callback)
			callback(data.val);
	}
	
	PlayerComm.prototype.storeCallback = function(callback)
	{
		if (!callback)
			return -1;
		var ix = 0;
		while (this.callbacks[ix] !== undefined)
			ix++;
		this.callbacks[ix] = callback;
		return ix;
	}
	PlayerComm.prototype.getCallback = function(ix)
	{
		if (ix < 0)
			return undefined;
		var callback = this.callbacks[ix];
		this.callbacks[ix] = undefined;
		return callback;
	}
	PlayerComm.prototype.getId = function(elem)
	{
		if (!elem.id)
		{
			this.id_count++;
			elem.id = "aio_id_" + this.id_count;
		}
		return elem.id;
	}

	function SettingsPane()
	{
	}
	SettingsPane.prototype.load = function()
	{
	}
	SettingsPane.prototype.init = function()
	{
		utils.addGlobalStyle(
			'#settingsbox, #settingslink\n' +
			'{\n' +
			'\tborder-right: 1px solid #666;\n' +
			'\tborder-bottom: 1px solid #666;\n' +
			'\tbackground: #EEE;\n' +
			'\tcolor: #000;\n' +
			'\tposition: fixed;\n' +
			'\toverflow: auto;\n' +
			'\tleft: 0;\n' +
			'\ttop: 0;\n' +
			'\tfont: 12px sans-serif;\n' +
			'\ttext-align: left;\n' +
			'\tz-index: 2;\n' +
			'}\n' +
			'#settingsbox\n' +
			'{\n' +
			'\twidth: 350px;\n' +
			'}\n' +
			'#settingstitlebar\n' +
			'{\n' +
			'\tfont-weight: bolder;\n' +
			'\tbackground: #CCC;\n' +
			'\tborder-bottom: 1px solid #666;\n' +
			'\tpadding: 3px;\n' +
			'}\n' +
			'#settingstitlebar img\n' +
			'{\n' +
			'\tvertical-align: text-bottom;\n' +
			'}\n' +
			'#settingstitlebar .prefsicon\n' +
			'{\n' +
			'\tfloat: left;\n' +
			'\tmargin-right: 0.5em;\n' +
			'}\n' +
			'#settingstitlebar .buttonimage, #settingslink .buttonimage\n' +
			'{\n' +
			'\tcursor: pointer;\n' +
			'\tdisplay: block;\n' +
			'}\n' +
			'#settingstitlebar .buttonimage\n' +
			'{\n' +
			'\tfloat: right;\n' +
			'}\n' +
			'#settingsbox form\n' +
			'{\n' +
			'\tmargin: 0;\n' +
			'\tpadding: 3px;\n' +
			'}\n' +
			'#settingsbox ul, #settingsbox li\n' +
			'{\n' +
			'\tlist-style: none;\n' +
			'\tmargin: 0;\n' +
			'\tpadding: 0;\n' +
			'}\n' +
			'#settingsbox ul ul\n' +
			'{\n' +
			'\tmargin-left: 2em;\n' +
			'}\n' +
			'#settingsbox input[type="checkbox"]\n' +
			'{\n' +
			'\tmargin-right: 0.25em;\n' +
			'}\n' +
			'#settingsbuttons\n' +
			'{\n' +
			'\ttext-align: center;\n' +
			'}\n' +
			'#settingslink\n' +
			'{\n' +
			'\tpadding: 3px;\n' +
			'}\n' +
			""
		);
		
		var settingsbox = document.createElement('div');
		this.settingsbox = settingsbox;
		settingsbox.id = 'settingsbox';
		settingsbox.style.display = 'none';
		document.body.appendChild(settingsbox);
		var titlebar = document.createElement('div');
		titlebar.id = 'settingstitlebar';
		settingsbox.appendChild(titlebar);
		var closebutton = document.createElement('img');
		closebutton.src = globals.images.close;
		closebutton.title = "Click to hide preferences";
		closebutton.className = 'buttonimage';
		closebutton.addEventListener('click', this.hidePane.bind(this), false);
		titlebar.appendChild(closebutton);
		var prefslogo = document.createElement('img');
		prefslogo.src = globals.images.prefs;
		prefslogo.className = 'prefsicon';
		titlebar.appendChild(prefslogo);
		titlebar.appendChild(document.createTextNode("Preferences"));
		var settingsform = document.createElement('form');
		settingsbox.appendChild(settingsform);
		var settingslist = document.createElement('ul');
		this.settingslist = settingslist;
		var a = window.innerHeight - 75;
		if (a < 40) a = 40;
		settingslist.style.maxHeight = a + 'px';
		settingslist.style.overflow = 'auto'; // vertical scrollbar if needed
		window.addEventListener('resize', this.resizeWindow.bind(this), true);
		settingsform.appendChild(settingslist);
	
		var div = document.createElement('div');
		div.id = 'settingsbuttons';
		settingsform.appendChild(div);
		var savebutton = document.createElement('input');
		savebutton.type = "submit";
		savebutton.value = "Save and Apply";
		div.appendChild(savebutton);
		var nocachebutton = document.createElement('input');
		nocachebutton.type = "submit";
		nocachebutton.value = "Clear subtitles cache";
		nocachebutton.addEventListener("click", this.cacheDodge.bind(this), false);
		div.appendChild(document.createTextNode(" "));
		div.appendChild(nocachebutton);
		settingsform.addEventListener("submit", this.saveSettings.bind(this), false);
		
		var settingslink = document.createElement('div');
		this.settingslink = settingslink;
		settingslink.id = 'settingslink';
		var settingslinkimage = document.createElement('img');
		settingslinkimage.src = globals.images.prefs;
		settingslinkimage.title = "Click to show preferences";
		settingslinkimage.className = 'prefsicon buttonimage';
		settingslinkimage.addEventListener('click', this.showPane.bind(this), false);
		settingslink.appendChild(settingslinkimage);
		document.body.appendChild(settingslink);
		
		this.hidePanels = [];
	};
	SettingsPane.prototype.saveSettings = function(e)
	{
		// stop the form from actually being submitted
		if (e && e.preventDefault)
			e.preventDefault();
		
		for (var i in globals.modules)
			globals.modules[i].updateSettings();
		
		return false;
	};
	SettingsPane.prototype.updateSettings = function(){};
	SettingsPane.prototype.showPane = function()
	{
		this.settingsbox.style.display = "block";
		this.settingslink.style.display = "none";
	};
	SettingsPane.prototype.hidePane = function()
	{
		this.settingsbox.style.display = "none";
		this.settingslink.style.display = "block";
	};
	SettingsPane.prototype.resizeWindow = function()
	{
		var a = window.innerHeight - 75;
		if (a < 40) a = 40;
		this.settingslist.style.maxHeight = a + 'px';
	};
	SettingsPane.prototype.cacheDodge = function(e)
	{
		if (e && e.preventDefault)
			e.preventDefault();
		utils.setPref("cachedodge", Math.random().toString());
		globals.modules.updates.cacheDodge();
	};
	
	SettingsPane.prototype.addSettingRow = function(parent)
	{
		if (!parent)
			parent = this.settingslist;
		else
		{
			var checkbox = undefined;
			if (parent.tagName.toLowerCase() == "input")
			{
				checkbox = parent;
				parent = parent.parentNode;
			}
			var ul = parent.getElementsByTagName("ul");
			if (ul.length)
				parent = ul[ul.length - 1];
			else
			{
				ul = document.createElement("ul");
				parent.appendChild(ul);
				parent = ul;
	
				if (checkbox)
				{
					this.hidePanels.push({checkbox: checkbox, panel: ul});
					checkbox.addEventListener("click", this.showHidePanel.bind(this, checkbox, ul), false);
				}
			}
		}
		var settingrow = document.createElement('li');
		parent.appendChild(settingrow);
		return settingrow;
	};
	SettingsPane.prototype.addCheckbox = function(id, label, title, checked, parent)
	{
		var settingrow = this.addSettingRow(parent);
		var settingcheckbox = document.createElement('input');
		settingcheckbox.type = 'checkbox';
		settingcheckbox.checked = checked;
		settingcheckbox.title = title;
		settingcheckbox.id = 'setting_' + id;
		settingrow.appendChild(settingcheckbox);
		var settinglabel = document.createElement('label');
		settinglabel.htmlFor = 'setting_' + id;
		settinglabel.appendChild(document.createTextNode(label));
		settinglabel.title = settingcheckbox.title;
		settingrow.appendChild(settinglabel);
		return settingcheckbox;
	};
	
	SettingsPane.prototype.showHidePanel = function(checkbox, panel)
	{
		panel.style.display = checkbox.checked ? "" : "none";
	};
	SettingsPane.prototype.initComplete = function()
	{
		for (var i = 0; i < this.hidePanels.length; i++)
			this.showHidePanel(this.hidePanels[i].checkbox, this.hidePanels[i].panel);
	};

	function Fullscreen()
	{
	}
	Fullscreen.prototype.load = async function load()
	{
		this.shouldresize = await utils.getPref('resize', true);
		this.noscale = await utils.getPref('noscale', false);
	}
	Fullscreen.prototype.init = async function init()
	{
		this.setting_main = globals.modules.settingspane.addCheckbox('resize', "Resize flash to full-screen", "Resizes the toon so it fills the entire window", this.shouldresize);
		this.setting_noscale = globals.modules.settingspane.addCheckbox('noscale', "Show behind the black", "Lets you see what's happening beyond the frames", this.noscale, this.setting_main);
		
		if (!globals.flashmovie)
			return;
	
		this.initwidth = globals.flashmovie.width;
		this.initheight = globals.flashmovie.height;
		if (this.initwidth.toString().indexOf('%') >= 0 || this.initwidth.toString().indexOf('%') >= 0)
		{
			this.isPercentage = true;
			this.aspect = 1.0;
		}
		else
		{
			this.isPercentage = false;
			this.aspect = this.initwidth / this.initheight;
		}
		window.addEventListener('resize', this.doResize.bind(this), true);
		this.doResize();
		if (this.noscale)
			await this.setScaleMode("noScale");
	};
	Fullscreen.prototype.doResize = function()
	{
		if (!globals.flashmovie)
			return;
		
		if (!this.shouldresize)
		{
			globals.flashmovie.style.width = this.initwidth + "px";
			globals.flashmovie.style.height = this.initheight + "px";
			if (globals.modules.seekbar.seekbar)
				globals.modules.seekbar.seekbar.style.width = Math.max(this.initwidth, 450) + "px";
			return;
		}
		
		var dw = window.innerWidth;
		var dh = window.innerHeight;
	
		var a = document.defaultView.getComputedStyle(document.body, null);
		// parseInt will take the number part at the start, turning eg "10px" into 10
		dw -= parseInt(a.marginLeft,10);
		dw -= parseInt(a.marginRight,10);
		dh -= parseInt(a.marginTop,10);
		dh -= parseInt(a.marginBottom,10);
	
		if (globals.navbar)
		{
			a = document.defaultView.getComputedStyle(globals.navbar, null);
			dh -= parseInt(a.height,10);
			dh -= parseInt(a.marginTop,10);
			dh -= parseInt(a.marginBottom,10);
		}
		if (globals.modules.seekbar.seekbar)
		{
			a = document.defaultView.getComputedStyle(globals.modules.seekbar.seekbar, null);
			dh -= parseInt(a.height,10);
			dh -= parseInt(a.marginTop,10);
			dh -= parseInt(a.marginBottom,10);
		}
		if (globals.modules.subtitles.subtitleholder)
		{
			a = document.defaultView.getComputedStyle(globals.modules.subtitles.subtitleholder, null);
			dh -= parseInt(a.height,10);
			dh -= parseInt(a.marginTop,10);
			dh -= parseInt(a.marginBottom,10);
		}
		if (globals.modules.subtitles.errorsholder)
		{
			a = document.defaultView.getComputedStyle(globals.modules.subtitles.errorsholder, null);
			dh -= parseInt(a.height,10);
			dh -= parseInt(a.marginTop,10);
			dh -= parseInt(a.marginBottom,10);
		}
		// enforce a (rather small) minimum size, regardless of how much crap is squeezed below the frame
		if (dw < 100) dw = 100;
		if (dh < 100) dh = 100;
		// if it was a percentage size, or we're looking outside the frame, just fill the whole window.
		// otherwise, keep the aspect ratio correct... "touch inside" style.
		if (!this.isPercentage && !this.noscale)
		{
			if(dw <= dh * this.aspect)
				dh = Math.floor(dw / this.aspect);
			else
				dw = Math.floor(dh * this.aspect);
		}
	
		// set embed's size
		globals.flashmovie.style.width = dw + "px";
		globals.flashmovie.style.height = dh + "px";
		if (globals.modules.seekbar.seekbar)
			globals.modules.seekbar.seekbar.style.width = Math.max(dw, 450) + "px";
	};
	Fullscreen.prototype.setScaleMode = async function setScaleMode(scaleMode)
	{
		await utils.waitLoaded();
		await playercomm.setScaleMode(globals.flashmovie, scaleMode);
	};
	Fullscreen.prototype.updateSettings = function()
	{
		this.shouldresize = this.setting_main.checked;
		utils.setPref("resize", this.shouldresize);
		var old_noscale = this.noscale;
		this.noscale = this.setting_noscale.checked;
		utils.setPref("noscale", this.noscale);
		this.doResize();
		if (this.noscale && !old_noscale)
			this.setScaleMode("noScale");
		else if (!this.noscale && old_noscale)
			this.setScaleMode("showAll");
	};

	function Seekbar()
	{
	}
	Seekbar.prototype.load = async function load() {
		this.enabled = await utils.getPref('seekbar', true);
		this.framecounter = await utils.getPref('frames', false);
		this.zoom = await utils.getPref('zoom', false);
	}
	Seekbar.prototype.init = async function init() {
		this.setting_enabled = globals.modules.settingspane.addCheckbox('seekbar', "Show seek bar", "Lets you fast forward and rewind", this.enabled);
		this.setting_framecounter = globals.modules.settingspane.addCheckbox('framecounter', "Show frame counter on seek bar", "Shows you exactly where you are", this.framecounter, this.setting_enabled);
		this.setting_zoom = globals.modules.settingspane.addCheckbox('zoom', "Show zooming controls", "Allows zooming in on the toon", this.zoom, this.setting_enabled);
		
		if (!globals.flashmovie)
			return;
	
		if (this.enabled)
			await this.addSeekbar();
	
		this.dragging = false;
		this.paused = !await utils.isPlaying();
		document.addEventListener("mousemove", this.dragMousemove.bind(this), false);
		document.addEventListener("mouseup", this.release.bind(this), false);
	
		window.setInterval(this.update.bind(this), 50);
	};
	Seekbar.prototype.updateSettings = function()
	{
		if (this.enabled)
			this.removeSeekbar();
		this.enabled = this.setting_enabled.checked;
		utils.setPref("seekbar", this.enabled);
		this.framecounter = this.setting_framecounter.checked;
		utils.setPref("frames", this.framecounter);
		this.zoom = this.setting_zoom.checked;
		utils.setPref("zoom", this.zoom);
		if (this.enabled && globals.flashmovie)
			this.addSeekbar();
	};
	Seekbar.prototype.addSeekbar = async function addSeekbar()
	{
		this.dragging = false;
		this.paused = !await utils.isPlaying();
	
		this.seekbar = document.createElement("div");
		var where = globals.flashmovie;
		while(where.parentNode.tagName.toLowerCase()=="object" || where.parentNode.tagName.toLowerCase()=="embed")
			where=where.parentNode;
		utils.insertAfter(this.seekbar, where);
		this.seekbar.style.width = globals.flashmovie.width;
		this.seekbar.style.margin = "0 auto";
	
		var table=document.createElement("table");
		table.style.width="100%";
		this.seekbar.appendChild(table);
		var row=table.insertRow();
		this.pauseButton=document.createElement("button");
		this.pauseButtonImg = document.createElement("img");
		this.pauseButtonImg.src = globals.images.pause;
		this.pauseButton.appendChild(this.pauseButtonImg);
		var buttonCell=row.insertCell();
		buttonCell.appendChild(this.pauseButton);
		var rewindCell=row.insertCell();
		this.rewindButton=document.createElement("button");
		var img = document.createElement("img");
		img.src = globals.images.rewind;
		this.rewindButton.appendChild(img);
		rewindCell.appendChild(this.rewindButton);
		var prevCell=row.insertCell();
		this.prevButton=document.createElement("button");
		img = document.createElement("img");
		img.src = globals.images.prev;
		this.prevButton.appendChild(img);
		prevCell.appendChild(this.prevButton);
	
		this.slider=row.insertCell();
		this.slider.width="100%";
		var visibleSlider=document.createElement("div");
		visibleSlider.style.position="relative";
		visibleSlider.style.height="0.5em";
		visibleSlider.style.width="100%";
		visibleSlider.style.borderRadius="0.25em";
		visibleSlider.style.background="#333";
		this.slider.appendChild(visibleSlider);
		this.loadmeter=document.createElement("div");
		this.loadmeter.style.position="absolute";
		this.loadmeter.style.top=this.loadmeter.style.left = "0";
		this.loadmeter.style.height="0.5em";
		this.loadmeter.style.width="0";
		this.loadmeter.style.borderRadius="0.25em";
		this.loadmeter.style.background="#aaa";
		visibleSlider.appendChild(this.loadmeter);
		this.thumb=document.createElement("div");
		this.thumb.style.position="absolute";
		this.thumb.style.height="1em";
		this.thumb.style.width="0.5em";
		this.thumb.style.top="-0.25em";
		this.thumb.style.borderRadius="0.25em";
		this.thumb.style.background="#666";
		visibleSlider.appendChild(this.thumb);
	
		var nextCell=row.insertCell();
		this.nextButton=document.createElement("button");
		img = document.createElement("img");
		img.src = globals.images.next;
		this.nextButton.appendChild(img);
		nextCell.appendChild(this.nextButton);
		var ffCell=row.insertCell();
		this.ffButton=document.createElement("button");
		img = document.createElement("img");
		img.src = globals.images.ffwd;
		this.ffButton.appendChild(img);
		ffCell.appendChild(this.ffButton);
	
		if (this.framecounter)
		{
			var frameCell=row.insertCell();
			var framediv=document.createElement("div");
			framediv.style.background="#ccc";
			framediv.style.color="#000";
			framediv.style.fontWeight="bold";
			framediv.style.padding = "0 5px";
			frameCell.appendChild(framediv);
			this.framecountertext=document.createTextNode("");
			framediv.appendChild(this.framecountertext);
		}
		else
			this.framecountertext = false;
	
		if (this.zoom && !globals.modules.fullscreen.noscale)
		{
			var zoomOutCell=row.insertCell();
			this.zoomOutButton=document.createElement("button");
			// \u2212 is &minus;
			this.zoomOutButton.appendChild(document.createTextNode("\u2212"));
			zoomOutCell.appendChild(this.zoomOutButton);
			var zoomNormalCell=row.insertCell();
			this.zoomNormalButton=document.createElement("button");
			this.zoomNormalButton.appendChild(document.createTextNode("0"));
			zoomNormalCell.appendChild(this.zoomNormalButton);
			var zoomInCell=row.insertCell();
			this.zoomInButton=document.createElement("button");
			this.zoomInButton.appendChild(document.createTextNode("+"));
			zoomInCell.appendChild(this.zoomInButton);
		}
		else
		{
			this.zoomOutButton = false;
			this.zoomNormalButton = false;
			this.zoomInButton = false;
		}
	
		this.slider.addEventListener("mousedown", this.drag.bind(this), false);
		this.pauseButton.addEventListener("click",this.pauseUnpause.bind(this),false);
		this.rewindButton.addEventListener("click",this.rewind.bind(this),false);
		this.prevButton.addEventListener("click",this.prevFrame.bind(this),false);
		this.nextButton.addEventListener("click",this.nextFrame.bind(this),false);
		this.ffButton.addEventListener("click",this.fastforward.bind(this),false);
		if (this.zoomOutButton)
		{
			this.zoomOutButton.addEventListener("click",this.zoomOut.bind(this),false);
			this.zoomNormalButton.addEventListener("click",this.zoomNormal.bind(this),false);
			this.zoomInButton.addEventListener("click",this.zoomIn.bind(this),false);
		}
	
		globals.modules.fullscreen.doResize();
	};
	Seekbar.prototype.removeSeekbar = function()
	{
		if (!this.seekbar)
			return;
		this.seekbar.parentNode.removeChild(this.seekbar);
		this.seekbar = undefined;
		globals.modules.fullscreen.doResize();
	};
	
	Seekbar.prototype.update = async function update()
	{
		if (!this.seekbar)
			return;
	
		var fullSliderWidth = parseInt(document.defaultView.getComputedStyle(this.slider, null).width, 10);
		var sliderWidth = fullSliderWidth - parseInt(document.defaultView.getComputedStyle(this.thumb, null).width, 10);
		var tot = await utils.totalFrames();
		if (tot > 0)
		{
			var frame = await utils.currentFrame();
			if (frame < 0)
				frame = 0;
			if (this.framecountertext)
			{
				var a = tot.toString();
				var b = (frame+1).toString();
				while (b.length < a.length)
					b = "\u2007" + b; // U+2007 FIGURE SPACE
				this.framecountertext.nodeValue = b+"/"+a;
			}
			if(!this.dragging)
			{
				if (tot > 1)
					this.thumb.style.left = (frame/(tot - 1)*sliderWidth)+"px";
				else
					this.thumb.style.left = "0";
				this.paused = !await utils.isPlaying();
				this.pauseButtonImg.src = this.paused ? globals.images.play : globals.images.pause;
			}
			var loaded = await utils.framesLoaded();
			this.loadmeter.style.width = (loaded/tot*fullSliderWidth)+"px";
		}
		else if (this.framecountertext)
		{
			this.framecountertext.nodeValue = "Loading...";
		}
	};
	
	Seekbar.prototype.pauseUnpause = async function pauseUnpause()
	{
		this.paused = await utils.isPlaying();
		this.pauseButtonImg.src = this.paused ? globals.images.play : globals.images.pause;
		if (this.paused)
			await utils.stop();
		else
			await utils.play();
	};
	Seekbar.prototype.rewind = async function rewind()
	{
		await utils.goto(0);
		await utils.play();
	};
	Seekbar.prototype.fastforward = async function fastforward()
	{
		var tot = await utils.totalFrames();
		await utils.goto(tot - 1);
	};
	Seekbar.prototype.prevFrame = async function prevFrame()
	{
		var frame = await utils.currentFrame();
		await utils.goto(frame - 1);
	};
	Seekbar.prototype.nextFrame = async function nextFrame()
	{
		var frame = await utils.currentFrame();
		await utils.goto(frame + 1);
	};
	Seekbar.prototype.zoomIn = async function zoomIn()
	{
		await utils.zoomIn(1.5);
	};
	Seekbar.prototype.zoomOut = async function zoomOut()
	{
		await utils.zoomOut(1.5);
	};
	Seekbar.prototype.zoomNormal = async function zoomNormal()
	{
		await utils.zoomReset();
	};
	
	Seekbar.prototype.drag = function(e)
	{
		this.dragging=true;
		this.dragMousemove(e);
		e.preventDefault();
		return false;
	};
	Seekbar.prototype.dragMousemove = async function dragMousemove(e)
	{
		if (!this.dragging) return;
		var pageX = e.clientX + document.body.scrollLeft;
		var rect = this.slider.getBoundingClientRect();
		var thumbWidth = parseInt(document.defaultView.getComputedStyle(this.thumb, null).width, 10);
		var width = rect.right - rect.left - thumbWidth;
		var pos = (pageX - rect.left - thumbWidth/2) / width;
		if (pos < 0)
			pos = 0;
		if (pos > 1)
			pos = 1;
		var t = await utils.totalFrames();
		if (t > 1)
		{
			var frame = Math.round(t * pos);
			await utils.goto(frame);
		}
		this.thumb.style.left = (pos * width) + "px";
	};
	Seekbar.prototype.release = function()
	{
		if (!this.dragging) return;
		if (!this.paused)
			utils.play();
		this.dragging = false;
	};

	function WikiLink()
	{
	}
	WikiLink.prototype.load = async function load() {
		this.enabled = await utils.getPref('hrwiki', true);
	}
	WikiLink.prototype.init = function()
	{
		this.setting_enabled = globals.modules.settingspane.addCheckbox('hrwiki', "Add HRWiki link", "Adds a link to the appropriate page on the Homestar Runner Wiki", this.enabled);
	
		this.buildWikiLink();
		this.showWikiLink();
	};
	WikiLink.prototype.updateSettings = function()
	{
		this.enabled = this.setting_enabled.checked;
		utils.setPref("hrwiki", this.enabled);
		// This is called before Subtitles.updateSettings, so delay until after that happens
		// so we can update the subtitles link as appropriate
		window.setTimeout(this.showWikiLink.bind(this), 0);
	};
	
	WikiLink.prototype.buildWikiLink = function()
	{
		// many pages on the mirror have an "info" link in the navbar (thanks Tom!)... use that
		if (globals.whichsite === 3)
		{
			var navbar;
			if (globals.modules.navbar && globals.modules.navbar.originalnavbar)
				navbar = globals.modules.navbar.originalnavbar;
			else
				navbar = globals.navbar;
			if (navbar)
			{
				var a = navbar.getElementsByTagName("a");
				for (var i = 0; i < a.length; i++)
				{
					if (a[i].firstChild.nodeType === 3 && a[i].firstChild.nodeValue === "info")
					{
						this.addHRWikiLink(a[i].href, true);
						return;
					}
				}
			}
		}
		
		// pull the filename from the url, use it as a link to HRWiki
		// all the filenames except a couple of special-cases are
		//  redirects to their articles
		// don't link to certain pages, they aren't redirects, but already existing pages
		// also detect a 404 error and special-case Strong Sad's Lament
		     if (document.title === "Oops! You bwoke it.")
			this.addHRWikiLink("404'd");
		else if (globals.filename === "interview")
			this.addHRWikiLink("The_Interview");
		else if (globals.filename === "fhqwhgads")
			this.addHRWikiLink("Everybody_to_the_Limit");
		else if (globals.filename === "trogdor")
			this.addHRWikiLink("TROGDOR!");
		else if (globals.filename === "marshie")
			this.addHRWikiLink("Meet_Marshie");
		else if (globals.filename === "eggs")
			this.addHRWikiLink("Eggs_(toon)");
		else if (globals.filename === "fireworks")
			this.addHRWikiLink("Happy_Fireworks");
		else if (globals.filename === "sbemail100")
			this.addHRWikiLink("Not_the_100th_Email!!!");
		else if (globals.filename === "sbemail200")
			this.addHRWikiLink("Page_Load_Error");
		else if (globals.filename === "sbcg4ap")
			this.addHRWikiLink("Strong_Bad's_Cool_Game_for_Attractive_People_Advertisement");
		else if (globals.filename === "dangeresque")
			this.addHRWikiLink("Dangeresque_Roomisode_1:_Behind_the_Dangerdesque");
		else if (location.pathname.substr(0, 12) === "/sadjournal/" && globals.filename != "wonderyears" && globals.filename != "super8")
			this.addHRWikiLink("Strong_Sad's_Lament");
		else if (location.pathname.substr(0,5) === "/vii/" && (globals.filename === "" || globals.filename === "index"))
			this.addHRWikiLink("Viidelectrix");
		else if (globals.filename === "" || globals.filename === "index")
		{
			if (document.location.pathname === "/slash/slash/")
				this.addHRWikiLink("Screenland_-_24_Apr_2017");
			else if (globals.whichsite === 0)
				this.addHRWikiLink("Index_Page");
			else if (globals.whichsite === 1)
				this.addHRWikiLink("Podstar_Runner");
			else if (globals.whichsite === 2)
				this.addHRWikiLink("Videlectrix");
			//else if (globals.whichsite === 3)
			//	; // this will be a 403 page - do nothing.
		}
		else
			this.addHRWikiLink(globals.filename);
	};
	
	WikiLink.prototype.addHRWikiLink = function(pagename, isurl)
	{
		this.linkdiv = document.createElement("div");
		this.linkdiv.style.borderLeft = this.linkdiv.style.borderBottom = '1px solid #666';
		this.linkdiv.style.background = '#EEE';
		this.linkdiv.style.position = "fixed";
		this.linkdiv.style.overflow = 'auto';
		this.linkdiv.style.right = "0px";
		this.linkdiv.style.top = "0px";
		this.linkdiv.style.padding = "3px";
		var link = document.createElement("a");
		if (isurl)
			link.href = pagename;
		else
			link.href = "http://www.hrwiki.org/wiki/" + escape(pagename.replace(/ /g, '_'));
		link.title = "See the HRWiki article for this page";
		link.style.display = "block";
		link.style.textDecoration = "none";
		this.linkdiv.appendChild(link);
		var img=document.createElement("img");
		img.style.border="0px";
		img.style.display="block";
		img.src=globals.images.hrwiki;
		link.appendChild(img);
		this.sublink = document.createElement("a");
		this.sublink.title = "See the HRWiki article for this page's subtitles";
		this.sublink.style.display = "block";
		this.sublink.style.textDecoration = "none";
		this.sublink.style.textAlign = "center";
		this.sublink.style.fontSize = this.sublink.style.lineHeight = "16px";
		this.sublink.style.marginTop = "3px";
		this.linkdiv.appendChild(this.sublink);
		this.sublink.appendChild(document.createTextNode('S'));
		document.body.appendChild(this.linkdiv);
	};
	
	WikiLink.prototype.showWikiLink = function()
	{
		if (this.enabled)
		{
			this.linkdiv.style.display = "block";
			if (globals.modules.subtitles && globals.modules.subtitles.enabled)
			{
				this.sublink.style.display = "block";
				this.sublink.href = "http://www.hrwiki.org/wiki/Subtitles:" + escape(globals.filename.replace(/ /g, '_')) + "/" + escape(globals.modules.subtitles.language);
			}
			else
				this.sublink.style.display = "none";
		}
		else
			this.linkdiv.style.display = "none";
	};

	function NextPrev()
	{
	}
	NextPrev.prototype.load = async function load() {
		this.enabled = await utils.getPref('prevnext', true);
		this.docheck = await utils.getPref('checknext', true);
	}
	NextPrev.prototype.init = function()
	{
		this.setting_enabled = globals.modules.settingspane.addCheckbox('prevnext', "Show previous/next buttons", "Lets you easily move through SBEmails, TGS, etc", this.enabled);
		this.setting_docheck = globals.modules.settingspane.addCheckbox('checknext', "Check if next exists", 'Doesn\'t add a "next" link on the latest SBEmail, etc', this.docheck, this.setting_enabled);
	
		this.createPrevNext();
		this.showPrevNext();
	};
	NextPrev.prototype.updateSettings = function()
	{
		this.enabled = this.setting_enabled.checked;
		utils.setPref("prevnext", this.enabled);
		this.docheck = this.setting_docheck.checked;
		utils.setPref("checknext", this.docheck);
		this.showPrevNext();
	};
	
	NextPrev.prototype.createPrevNext = function()
	{
		// this is coded like this instead of just looking for /(\d+)/ so that it
		// doesn't find pages like commandos3 or xmas04
		var result;
		if ((result = globals.filename.match(/^(sbemail|tgs|answer|bizcasfri|puppetjam|main)(\d+)$/)))
		{
			// sbemail100 and sbemail200 aren't actually sbemails
			if (!(result[1] == "sbemail" && (result[2] == "100" || result[2] == "200")))
				this.addPrevNextlinks(result[1],parseInt(result[2],10));
		}
		else if (globals.filename == "sbemailahundred")
			this.addPrevNextlinks("sbemail", 100);
		else if (globals.filename == "kotpoptoon")
			this.addPrevNextlinks("sbemail", 151);
		else if (globals.filename == "sbemailtwohundred")
			this.addPrevNextlinks("sbemail", 200);
		else if (globals.filename == "hremail3184")
			this.addPrevNextlinks("sbemail", 201);
		else if (globals.filename == "dween_tgs")
			this.addPrevNextlinks("tgs", 6);
	};
	NextPrev.prototype.addPrevNextlinks = function(series, num)
	{
		if (num > 1)
		{
			this.prevlink = document.createElement("a");
			this.prevlink.href = this.makeLink(series, num - 1);
			this.prevlink.style.position="fixed";
			this.prevlink.style.left="0px";
			this.prevlink.style.bottom="0px";
			this.prevlink.style.padding="3px";
			this.prevlink.style.background="white";
			this.prevlink.style.border="1px solid black";
			this.prevlink.style.textDecoration="none";
			this.prevlink.style.display = "none";
			var img = document.createElement("img");
			img.style.border = "none";
			img.src = globals.images.prev;
			this.prevlink.appendChild(img);
			document.body.appendChild(this.prevlink);
		}
	
		this.nextlink = document.createElement("a");
		this.nextlink.href = this.makeLink(series, num + 1);
		this.nextlink.style.position="fixed";
		this.nextlink.style.right="0px";
		this.nextlink.style.bottom="0px";
		this.nextlink.style.padding="3px";
		this.nextlink.style.background="white";
		this.nextlink.style.border="1px solid black";
		this.nextlink.style.textDecoration="none";
		this.nextlink.style.display = "none";
		img = document.createElement("img");
		img.style.border = "none";
		img.src = globals.images.next;
		this.nextlink.appendChild(img);
		document.body.appendChild(this.nextlink);
	
		this.checkedNext = false;
	};
	NextPrev.prototype.makeLink = function(series, num)
	{
		if (series == "sbemail" && num == 100)
			return "sbemailahundred.html";
		else if (series == "sbemail" && num == 151)
			return "kotpoptoon.html";
		else if (series == "sbemail" && num == 200)
			return "sbemailtwohundred.html";
		else if (series == "sbemail" && num == 201)
			return "hremail3184.html";
		else
			return series + num + ".html";
	};
	
	NextPrev.prototype.showPrevNext = function()
	{
		if (this.enabled)
		{
			if (this.prevlink)
				this.prevlink.style.display = "block";
			if (this.docheck && !this.checkedNext && this.nextlink)
				/*no await*/ this.doCheckNext();
			else if (this.nextlink)
				this.nextlink.style.display = "block";
		}
		else
		{
			if (this.prevlink)
				this.prevlink.style.display = "none";
			if (this.nextlink)
				this.nextlink.style.display = "none";
		}
	};
	NextPrev.prototype.doCheckNext = async function doCheckNext()
	{
		try {
			var res = await utils.downloadPage(this.nextlink.href + "?cachedodge=" + (await utils.getPref('cachedodge', 0)), "HEAD");
		} catch (e) {
			this.nextlink.parentNode.removeChild(this.nextlink);
			this.nextlink = undefined;
			return;
		}
	
		if (res.status == 200 && res.headers.indexOf("404error.html") < 0)
		{
			this.checkedNext = true;
			this.showPrevNext();
		}
		else if (this.nextlink)
		{
			this.nextlink.parentNode.removeChild(this.nextlink);
			this.nextlink = undefined;
		}
	};
	NextPrev.prototype.onCheckError = function()
	{
	};

	function Navbar()
	{
	}
	Navbar.prototype.SECTIONS = {
		t: "Big Toons",
		sh: "Shorts",
		ho: "Holday Toons",
		p: "Puppet Stuff",
		teh: "Powered by The Cheat",
		sb: "Strong Bad Emails",
		am: "Marzipan's Answering Machine",
		tgs: "Teen Girl Squad"
	};
	Navbar.prototype.MAIN_COUNT = 26;
	Navbar.prototype.load = async function load() {
		this.enabled = await utils.getPref('navbar', false);
		this.rando = {};
		for (var i in this.SECTIONS)
			this.rando[i] = await utils.getPref('rando' + i, true);
	}
	Navbar.prototype.init = function() {
		utils.addGlobalStyle(
			'#newnavbar\n' +
			'{\n' +
			'\tmargin: 0;\n' +
			'\tpadding: 0;\n' +
			'\ttext-align: center;\n' +
			'\ttext-transform: lowercase;\n' +
			'\theight: 10px;\n' +
			'\tfont: 10px/10px sans-serif;\n' +
			'}\n' +
			'#newnavbar li\n' +
			'{\n' +
			'\tmargin: 0;\n' +
			'\tpadding: 0;\n' +
			'\tdisplay: inline;\n' +
			'}\n' +
			'#newnavbar :link, #newnavbar :visited\n' +
			'{\n' +
			'\tcolor: #666;\n' +
			'\tfont-family: sans-serif;\n' +
			'\ttext-decoration: none;\n' +
			'\tpadding: 0 1em;\n' +
			'}\n' +
			'#newnavbar :link:hover, #newnavbar :visited:hover\n' +
			'{\n' +
			'\tcolor: #999;\n' +
			'}\n' +
			'\n' +
			"/* for overriding podstar's settings: */\n" +
			'#newnavbar :link, #newnavbar :visited\n' +
			'{\n' +
			'\tfont-weight: normal;\n' +
			'}\n' +
			'#newnavbar :link:hover, #newnavbar :visited:hover\n' +
			'{\n' +
			'\tbackground: transparent;\n' +
			'\tfont-weight: normal;\n' +
			'}\n' +
			""
		);
	
		this.setting_enabled = globals.modules.settingspane.addCheckbox('navbar', "Plain HTML navbar", "Replaces the flash navbar with normal links, so you can open in tabs, etc", this.enabled);
		this.setting_rando = {};
		for (var i in this.SECTIONS)
			this.setting_rando[i] = globals.modules.settingspane.addCheckbox('rando' + i, "Include " + this.SECTIONS[i] + " in rando", 'Limit the "rando" function to what you like to watch', this.rando[i], this.setting_enabled);
		
		this.allrandourls = false;
		this.randourls = false;
	
		this.originalnavbar = globals.navbar;
		this.newnavbar = this.buildNavbar(this.originalnavbar);
		this.showNavbar();
	};
	Navbar.prototype.updateSettings = function()
	{
		this.enabled = this.setting_enabled.checked;
		utils.setPref("navbar", this.enabled);
		for (var i in this.SECTIONS)
		{
			this.rando[i] = this.setting_rando[i].checked;
			utils.setPref("rando" + i, this.rando[i]);
		}
		this.filterRando();
		this.showNavbar();
	};
	
	Navbar.prototype.showNavbar = function()
	{
		if (this.enabled)
		{
			if (this.originalnavbar)
				this.originalnavbar.style.display = "none";
			this.newnavbar.style.display = "";
			this.newnavbar.style.marginTop = (globals.modules.seekbar.enabled ? "0" : "10px");
			globals.navbar = this.newnavbar;
			/*no await*/ this.loadRandoXML();
		}
		else
		{
			if (this.originalnavbar)
				this.originalnavbar.style.display = "";
			this.newnavbar.style.display = "none";
			globals.navbar = this.originalnavbar;
		}
		globals.modules.fullscreen.doResize();
	};
	
	Navbar.prototype.buildNavbar = function(where)
	{
		var newnavbar = document.createElement("ul");
		newnavbar.id = "newnavbar";
		if (where)
		{
			while(where.parentNode.tagName.toLowerCase() == "object")
				where = where.parentNode;
			utils.insertAfter(newnavbar, where);
		}
		else
			document.body.appendChild(newnavbar);
	
		this.mainlink = this.addnavbarlink(newnavbar, "https://homestarrunner.com/main" + Math.floor(Math.random() * this.MAIN_COUNT + 1) + ".html", "Main");
		// just for fun, re-randomise on each mouse-over (for the status bar)
		this.mainlink.addEventListener("mouseout", this.newMainLink.bind(this), false);
		this.addnavbarlink(newnavbar, "https://homestarrunner.com/toons.html", "Toons");
		this.addnavbarlink(newnavbar, "https://homestarrunner.com/games.html", "Games");
		this.addnavbarlink(newnavbar, "https://homestarrunner.com/characters2.html", "Characters");
		this.addnavbarlink(newnavbar, "https://homestarrunner.com/homester.html", "Downloads");
		this.addnavbarlink(newnavbar, "https://homestarrunner.com/store.html", "Store", "storelink");
		this.addnavbarlink(newnavbar, "https://homestarrunner.com/sbemail.html", "SB Emails");
		//this.addnavbarlink(newnavbar, "https://feeds.feedburner.com/HomestarRunner", "Subscribe");
		this.addnavbarlink(newnavbar, "https://www.youtube.com/user/homestarrunnerdotcom", "YouTube");
		this.addnavbarlink(newnavbar, "https://homestarrunner.com/email.html", "Contact");
		//this.addnavbarlink(newnavbar, "https://podstar.homestarrunner.com/", "Podcast");
		this.addnavbarlink(newnavbar, "https://homestarrunner.com/legal.html", "Legal");
		this.randolink = this.addnavbarlink(newnavbar, "javascript:void(alert('rando.xml not loaded yet... be patient'))", "Rando");
		this.randolink.addEventListener("mouseout", this.newRandoLink.bind(this), false);
	
		return newnavbar;
	};
	Navbar.prototype.addnavbarlink = function(ul, href, title, extraclass)
	{
		var li = document.createElement("li");
		var link = document.createElement("a");
		link.href = href;
		link.appendChild(document.createTextNode(title));
		if (extraclass)
			link.className = extraclass;
		li.appendChild(link);
		ul.appendChild(li);
		return link;
	};
	
	Navbar.prototype.newMainLink = function()
	{
		this.mainlink.href="https://homestarrunner.com/main" + Math.floor(Math.random() * this.MAIN_COUNT + 1) + ".html";
	};
	Navbar.prototype.newRandoLink = function()
	{
		if (!this.randourls)
			return;
	
		if (this.randourls.length > 0)
		{
			var r = this.randourls[Math.floor(Math.random() * this.randourls.length)];
			this.randolink.href = r.u;
			this.randolink.title = r.n;
		}
		else
		{
			this.randolink.href = "javascript:void(alert('Nothing to choose from'))";
			this.randolink.title = "Nothing to choose from";
		}
	};
	
	Navbar.prototype.loadRandoXML = async function loadRandoXML()
	{
		// Only run this once
		if (this.haveLoadedXML)
			return;
		this.haveLoadedXML = true;
	
		try {
			var res = await utils.downloadPage(
				"https://homestarrunner.com/rando.xml?cachedodge=" + (await utils.getPref('cachedodge', 0))
			);
	
			var parser = new DOMParser();
			// fix invalid XML...
			// add missing root element
			var doc = res.text.replace(/<\?xml.*?\?>/g, ""); // strip <?xml ?> tag
			doc = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<rando>" + doc + "</rando>";
			// fix bad ampersands
			doc = doc.replace(/&(?!\w*;)/g, "&amp;");
			doc = parser.parseFromString(doc, "application/xml");
			var sbemailcounter = 0;
			this.allrandourls = [];
			for (var i = 0; i < doc.documentElement.childNodes.length; i++)
			{
				var node = doc.documentElement.childNodes[i];
				if (node.nodeType == 1)
				{
					var type = node.nodeName.toLowerCase();
					var u = node.getAttribute('u');
					var n = node.getAttribute('n');
					if (!n) n = "Untitled";
					if (type == "sb")
					{
						sbemailcounter++;
						n = "SBEmail: " + n;
					}
					if (u)
						this.allrandourls.push({u: "https://homestarrunner.com/" + u, n: n, type: type});
					else
						this.allrandourls.push({u: "https://homestarrunner.com/sbemail" + sbemailcounter + ".html", n: n, type: type});
				}
			}
			this.filterRando();
		} catch (e) {
			this.randolink.href = "javascript:void(alert('Error loading rando.xml... try refreshing'))";
		}
	};
	Navbar.prototype.filterRando = function()
	{
		if (!this.allrandourls)
			return;
		this.randourls = [];
		for (var i in this.allrandourls)
		{
			var r = this.allrandourls[i];
			if (this.rando[r.type] === false) // === false so that it's considered "true" for undefined... if they add a new toon type
				continue;
			this.randourls.push(r);
		}
		this.newRandoLink();
	};

	function Subtitles()
	{
	}
	Subtitles.prototype.DEFAULTXML = escape('<?xml version="1.0" encoding="utf-8"?>\n<transcript xml:lang="en-us">\n<line start="" end="" speaker=""></line>\n</transcript>');
	Subtitles.prototype.NAMES_OPTS = ["Never", "Voiceovers", "Always"];
	Subtitles.prototype.NO_SUBTITLES = document.createComment("");
	Subtitles.prototype.load = async function load() {
		this.enabled = await utils.getPref('subtitles', false);
		this.captions = await utils.getPref('captions', true);
		this.colours = await utils.getPref('colours', true);
		this.testsubs = await utils.getPref('testsubs', false);
		this.language = await utils.getPref('language', "en");
		this.testsubsdata = unescape(await utils.getPref('testsubsdata', this.DEFAULTXML));
		this.names = await utils.getPref('names', 0);
	}
	Subtitles.prototype.init = function()
	{
		utils.addGlobalStyle(
			'.subtitles\n' +
			'{\n' +
			'\tbackground: black;\n' +
			'\tcolor: white;\n' +
			'\tfont: 20px/25px sans-serif;\n' +
			'\theight: 100px;\n' +
			'\ttext-align: center;\n' +
			'}\n' +
			'\n' +
			'.subtitle_errors\n' +
			'{\n' +
			'\tbackground: black;\n' +
			'\tcolor: red;\n' +
			'\tfont: 12pt sans-serif;\n' +
			'\ttext-align: left;\n' +
			'\tmargin: 0.5em;\n' +
			'}\n' +
			'\n' +
			'.subtitles .italic\n' +
			'{\n' +
			'\tfont-style: italic;\n' +
			'}\n' +
			'.subtitles .italic em, .subtitles .italic cite, .subtitles .italic i\n' +
			'{\n' +
			'\tfont-style: normal;\n' +
			'}\n' +
			""
		);
		
		this.setting_enabled = globals.modules.settingspane.addCheckbox('subtitles', "Show subtitles", "Shows subtitles or captions below the toon, if any are available", this.enabled);
	
		var settingrow = globals.modules.settingspane.addSettingRow(this.setting_enabled);
		var settinglabel = document.createElement('label');
		settinglabel.htmlFor = "setting_language";
		settinglabel.appendChild(document.createTextNode('Subtitle Language: '));
		settinglabel.title = 'Display subtitles in this language, if any';
		settingrow.appendChild(settinglabel);
		this.setting_language = document.createElement('select');
		this.setting_language.title = 'Display subtitles in this language, if any';
		this.setting_language.id = "setting_language";
		this.setting_language.disabled = true;
		settingrow.appendChild(this.setting_language);
	
		this.language_populated = false;
		/*no await*/ this.populateLanguage();
	
		this.setting_captions = globals.modules.settingspane.addCheckbox('captions', "Show captions", "Include sound effects in the subtitles", this.captions, this.setting_enabled);
		this.setting_colours = globals.modules.settingspane.addCheckbox('colours', "Use colours", "Distinguish characters by colour effects (turn off if colourblind)", this.colours, this.setting_enabled);
	
		settingrow = globals.modules.settingspane.addSettingRow(this.setting_enabled);
		settinglabel = document.createElement('label');
		settinglabel.htmlFor = "setting_names";
		settinglabel.appendChild(document.createTextNode('Show speakers\' names: '));
		settinglabel.title = 'Show the speakers\' names before their lines';
		settingrow.appendChild(settinglabel);
		this.setting_names = document.createElement('select');
		this.setting_names.title = 'Show the speakers\' names before their lines';
		this.setting_names.id = "setting_names";
		settingrow.appendChild(this.setting_names);
		for (var i = 0; i < this.NAMES_OPTS.length; i++)
		{
			var option = document.createElement('option');
			option.value = i;
			option.appendChild(document.createTextNode(this.NAMES_OPTS[i]));
			if (this.names == i)
				option.selected = true;
			this.setting_names.appendChild(option);
		}
	
		this.setting_testsubs = globals.modules.settingspane.addCheckbox('testsubs', "Test subtitles script", "Use this to test a subtitles script (copy/paste into a text box)", this.testsubs, this.setting_enabled);
	
		settingrow = globals.modules.settingspane.addSettingRow(this.setting_testsubs);
		this.setting_testsubsdata = document.createElement('textarea');
		this.setting_testsubsdata.title = 'Paste your XML data here';
		this.setting_testsubsdata.id = "setting_testsubsdata";
		this.setting_testsubsdata.style.width = "100%";
		this.setting_testsubsdata.style.height = "10em";
		this.setting_testsubsdata.style.fontSize = "8px";
		this.setting_testsubsdata.style.textAlign = "left";
		this.setting_testsubsdata.appendChild(document.createTextNode(this.testsubsdata));
		settingrow.appendChild(this.setting_testsubsdata);
	
		this.charsready = false;
		this.subsready = false;
	
		/*no await*/ this.setupSubtitles();
	
		window.setInterval(this.update.bind(this), 50);
	};
	Subtitles.prototype.updateSettings = function()
	{
		this.enabled = this.setting_enabled.checked;
		utils.setPref('subtitles', this.enabled);
		if (this.language_populated)
		{
			this.language = this.setting_language.value;
			utils.setPref('language', this.language);
		}
		this.captions = this.setting_captions.checked;
		utils.setPref('captions', this.captions);
		this.colours = this.setting_colours.checked;
		utils.setPref('colours', this.colours);
		this.names = this.setting_names.value;
		utils.setPref('names', this.names);
		this.testsubs = this.setting_testsubs.checked;
		utils.setPref('testsubs', this.testsubs);
		this.testsubsdata = this.setting_testsubsdata.value;
		utils.setPref('testsubsdata', escape(this.testsubsdata));
	
		/*no await*/ this.setupSubtitles();
	};
	
	Subtitles.prototype.populateLanguage = async function populateLanguage()
	{
		var option = document.createElement('option');
		option.appendChild(document.createTextNode("Loading..."));
		option.selected = true;
		this.setting_language.appendChild(option);
	
		try {
			var xml = await utils.downloadWiki("Subtitles:Languages");
			xml = utils.parseWikiXML(xml);
		} catch (e) {
			while (this.setting_language.firstChild)
				this.setting_language.removeChild(this.setting_language.firstChild);
			var option = document.createElement('option');
			option.appendChild(document.createTextNode("Error loading languages"));
			option.selected = true;
			this.setting_language.appendChild(option);
			return;
		}
	
		while (this.setting_language.firstChild)
			this.setting_language.removeChild(this.setting_language.firstChild);
	
		var languages = xml.getElementsByTagName('language');
		for (var i = 0; i < languages.length; i++)
		{
			var node = languages[i];
			// sanity-check the node
			if (node.hasAttribute('xml:lang') && node.firstChild && (node.firstChild.nodeType == xml.TEXT_NODE || node.firstChild.nodeType == xml.CDATA_SECTION_NODE))
			{
				var option = document.createElement('option');
				option.appendChild(document.createTextNode(node.firstChild.nodeValue));
				option.lang = option.value = node.getAttribute('xml:lang');
				if (option.lang == this.language)
					option.selected = true;
				option.dir = "ltr";
				if (node.hasAttribute('dir'))
					option.dir = node.getAttribute('dir');
				this.setting_language.appendChild(option);
			}
		}
		
		this.setting_language.disabled = false;
		this.language_populated = true;
	};
	
	Subtitles.prototype.removeSubtitles = function()
	{
		if (this.subtitleholder)
		{
			this.subtitleholder.parentNode.removeChild(this.subtitleholder);
			this.subtitleholder = undefined;
		}
		if (this.errorsholder)
		{
			this.errorsholder.parentNode.removeChild(this.errorsholder);
			this.errorsholder = undefined;
		}
	
		globals.modules.fullscreen.doResize();
	};
	Subtitles.prototype.createSubtitleHolder = function()
	{
		this.subtitleholder = document.createElement('div');
		this.subtitleholder.className = "subtitles";
		var where = globals.flashmovie;
		if (globals.modules.seekbar && globals.modules.seekbar.seekbar)
			where = globals.modules.seekbar.seekbar;
		while(where.parentNode.tagName.toLowerCase() == "object")
			where = where.parentNode;
		utils.insertAfter(this.subtitleholder, where);
		this.subtitleholder.appendChild(this.NO_SUBTITLES);
		this.currentsubtitles = this.NO_SUBTITLES;
	
		globals.modules.fullscreen.doResize();
	};
	Subtitles.prototype.createErrorsHolder = function()
	{
		this.errorsholder = document.createElement('div');
		this.errorsholder.className = "subtitle_errors";
		var where = globals.flashmovie;
		if (globals.modules.seekbar && globals.modules.seekbar.seekbar)
			where = globals.modules.seekbar.seekbar;
		while(where.parentNode.tagName.toLowerCase() == "object")
			where = where.parentNode;
		utils.insertAfter(this.errorsholder, where);
	
		globals.modules.fullscreen.doResize();
	};
	Subtitles.prototype.transcriptError = function(message)
	{
		if (!this.errorsholder)
			this.createErrorsHolder();
		var pre = document.createElement("pre");
		pre.appendChild(document.createTextNode(message));
		this.errorsholder.appendChild(pre);
	
		globals.modules.fullscreen.doResize();
	};
	
	Subtitles.prototype.setupSubtitles = async function setupSubtitles()
	{
		this.removeSubtitles();
	
		if (!this.enabled)
			return;
	
		this.createSubtitleHolder();
		this.setSubtitles(document.createTextNode("Loading subtitles..."));
		
		try {
			await this.loadCharacters();
			await this.reloadSubs();
		} catch (e) {
			this.removeSubtitles();
			if (this.testsubs)
				this.transcriptError(e.toString());
		}
	};
	Subtitles.prototype.loadCharacters = async function loadCharacters() {
		if (this.charsready)
			return;
	
		var xml = await utils.downloadWiki('Subtitles:Characters');
		xml = utils.parseWikiXML(xml);
	
		this.characters = {
			sfx: {
				color: "#FFF",
				sfx: true,
				name: {en: ""}
			}
		};
		var speakers = xml.getElementsByTagName("speaker");
		for (var i = 0; i < speakers.length; i++)
		{
			var speakername = speakers[i].getAttribute("id");
			this.characters[speakername] = {color: speakers[i].getAttribute("color"), sfx: speakers[i].hasAttribute("sfx"), name: {en: ""}};
			var names = speakers[i].getElementsByTagName("name");
			for (var j = 0; j < names.length; j++)
			{
				var lang = names[j].getAttribute("xml:lang");
				if (names[j].firstChild && (names[j].firstChild.nodeType == xml.TEXT_NODE || names[j].firstChild.nodeType == xml.CDATA_SECTION_NODE))
					this.characters[speakername].name[lang] = names[j].firstChild.nodeValue;
			}
		}
		this.charsready = true;
	}
	Subtitles.prototype.reloadSubs = async function reloadSubs()
	{
		if (!this.charsready)
			return;
		this.subsready = false;
	
		this.removeSubtitles();
		this.createSubtitleHolder();
		this.setSubtitles(document.createTextNode("Loading subtitles..."));
	
		var xml;
		if (!this.testsubs)
			xml = await utils.downloadWiki('Subtitles:' + globals.filename + '/' + this.language);
		else
			xml = this.testsubsdata;
		xml = utils.parseWikiXML(xml);
		this.parseTranscript(xml);
	
		this.subsready = true;
	};
	
	Subtitles.prototype.parseTranscript = function(xml)
	{
		// set some defaults
		if (!xml.documentElement.getAttribute("xml:lang")) xml.documentElement.setAttribute("xml:lang", this.language);
		if (!xml.documentElement.getAttribute("dir"))      xml.documentElement.setAttribute("dir",      "ltr");
		// inherit languages to all subnodes
		this.inheritLanguages(xml.documentElement);
		// now parse the lines into divs and get start and end frames
		var lines = xml.getElementsByTagName("line");
		var previousEnd = NaN;
		this.transcript = [];
		for (var i = 0; i < lines.length; i++)
		{
			var line = {};
			// ignore lines with missing start/end values
			// so you can add all the lines and not worry about timing them until later
			if (!lines[i].getAttribute("start") || !lines[i].getAttribute("end"))
				continue;
			line.start = parseInt(lines[i].getAttribute("start"), 10);
			line.end = parseInt(lines[i].getAttribute("end"), 10);
			if (this.testsubs)
			{
				if (isNaN(line.start))
					this.transcriptError("Start value \"" + lines[i].getAttribute("start") + "\" is not a number");
				if (isNaN(line.end))
					this.transcriptError("End value \"" + lines[i].getAttribute("end") + "\" is not a number");
				if (line.end < line.start)
					this.transcriptError("Line beginning frame " + line.start + " ends before it begins.");
				if (line.start < previousEnd)
					this.transcriptError("Line beginning frame " + line.start + " starts before the previous frame ends.");
				previousEnd = line.end;
			}
			line.text = this.importNodes(lines[i]);
			this.transcript.push(line);
		}
	};
	Subtitles.prototype.inheritLanguages = function(node)
	{
		for (var i = node.firstChild; i; i = i.nextSibling)
		{
			if (i.nodeType == i.ELEMENT_NODE)
			{
				if (!i.hasAttribute("xml:lang")) i.setAttribute("xml:lang", node.getAttribute("xml:lang"));
				if (!i.hasAttribute("dir"))      i.setAttribute("dir",      node.getAttribute("dir"));
				this.inheritLanguages(i);
			}
		}
	};
	Subtitles.prototype.importNodes = function(node)
	{
		var name = node.nodeName.toLowerCase();
		if (this.characters[name])
		{
			node.setAttribute("speaker", name);
			name = "speaker";
		}
		if (name == "line" || name == "speaker")
		{
			// format the speaker appropriately as a div
			var speaker = node.getAttribute("speaker");
			if (!this.captions && (speaker == "sfx" || node.hasAttribute("sfx")))
				return document.createComment(""); // return nothing
			newNode = document.createElement("div");
			var char = this.characters[speaker];
			if (!char)
			{
				if (this.testsubs && speaker)
				{
					var line = node;
					while (line && line.nodeName != "line")
						line = line.parentNode;
					if (line)
						this.transcriptError("Line beginning frame " + line.getAttribute("start") + " has an unrecognised speaker name \"" + speaker + '"');
				}
				char = {color: "#FFF", name: {en: ""}};
			}
			if (this.colours)
				newNode.style.color = char.color;
			if (node.hasAttribute("voiceover"))
				newNode.className = "italic";
			if (node.hasAttribute("volume"))
			{
				newNode.style.fontSize = (node.getAttribute("volume") * 100) + "%";
				newNode.style.lineHeight = "1.25em";
			}
			newNode.lang = node.getAttribute("xml:lang");
			newNode.dir = node.getAttribute("dir");
			var hasSpeakerChildren = false;
			for (var i = node.firstChild; i; i = i.nextSibling)
			{
				if (i.nodeType == i.ELEMENT_NODE)
				{
					newNode.appendChild(this.importNodes(i));
					var a = i.nodeName.toLowerCase();
					if (a == "line" || a == "speaker" || this.characters[a])
						hasSpeakerChildren = true;
				}
				else if (i.nodeType == i.TEXT_NODE || i.nodeType == i.CDATA_SECTION_NODE)
					newNode.appendChild(document.importNode(i, true));
			}
			if (!hasSpeakerChildren)
			{
				// this is a normal text node - do some extra text stuff
				if (char.sfx || node.hasAttribute("sfx"))
				{
					newNode.insertBefore(document.createTextNode('('), newNode.firstChild);
					newNode.appendChild(document.createTextNode(')'));
					newNode.className = "italic";
				}
				if (this.names == 2 || (node.hasAttribute("voiceover") && this.names == 1))
				{
					// find the language with the longest prefix match
					// fall back to "en" if none found
					var bestmatch = "en";
					var langbits = node.getAttribute("xml:lang").split("-");
					for (i = langbits.length; i >= 1; i--)
					{
						var lang = langbits.slice(0, i).join("-");
						if (char.name[lang])
						{
							bestmatch = lang;
							break;
						}
					}
					if (char.name[bestmatch] != '')
						newNode.insertBefore(document.createTextNode(char.name[bestmatch] + ": "), newNode.firstChild);
				}
			}
			return newNode;
		}
		else
		{
			// check element blacklist
			if (name == "script" ||
			    name == "style"  ||
			    name == "object" ||
			    name == "param"  ||
			    name == "embed"  ||
			    name == "a"      ||
			    name == "img"    ||
			    name == "applet" ||
			    name == "map"    ||
			    name == "frame"  ||
			    name == "iframe" ||
			    name == "meta"   ||
			    name == "link"   ||
			    name == "form"   ||
			    name == "input")
			{
				if (this.testsubs)
					this.transcriptError("Blacklisted element \"" + name + "\" stripped.");
				return document.createComment(""); // return nothing
			}
			var newNode = document.createElement(name);
			// copy across attributes
			for (i = 0; i < node.attributes.length; i++)
			{
				name = node.attributes[i].nodeName.toLowerCase();
				// check attribute blacklist
				// javascript, and anything that might load stuff from offsite
				if (name != "href" && name != "src" && name.substring(0, 2) != "on")
				{
					if (name == "style")
					{
						// regex taken from MediaWiki Sanitizer.php
						if (!node.attributes[i].value.match(/(expression|tps*:\/\/|url\\s*\()/i))
							newNode.setAttribute("style", node.attributes[i].value);
					}
					else if (name == "xml:lang")
					{
						newNode.lang = node.attributes[i].value;
					}
					else
						newNode.setAttribute(node.attributes[i].nodeName, node.attributes[i].value);
				}
				else if (this.testsubs)
					this.transcriptError("Blacklisted attribute \"" + name + "\" stripped.");
			}
			// copy across children
			for (i = node.firstChild; i; i = i.nextSibling)
			{
				if (i.nodeType == i.ELEMENT_NODE)
					newNode.appendChild(this.importNodes(i));
				else if (i.nodeType == i.TEXT_NODE || i.nodeType == i.CDATA_SECTION_NODE)
					newNode.appendChild(document.importNode(i, true));
			}
			return newNode;
		}
		return document.createComment(""); // fallthrough
	};
	
	Subtitles.prototype.update = async function update()
	{
		if (!this.enabled || !this.charsready || !this.subsready || !this.subtitleholder)
			return;
	
		var frame = await utils.currentFrame();
		if (frame < 0)
			return;
		frame++; // Make 1-based
		// binary search to find the right transcript line
		var first = 0;
		var last = this.transcript.length;
		while(first < (last - 1))
		{
			var mid = (first + last) >> 1;
			if (frame >= this.transcript[mid].start)
			{
				first = mid;
				if (frame <= this.transcript[mid].end)
					break;
			}
			else
				last = mid;
		}
		// should we actually show the line?
		if(this.transcript[first] && this.transcript[first].start <= frame && this.transcript[first].end >= frame)
			this.setSubtitles(this.transcript[first].text);
		else
			this.setSubtitles(false);
	};
	
	Subtitles.prototype.setSubtitles = function(node)
	{
		if (!this.subtitleholder)
			return;
		if (!node)
			node = this.NO_SUBTITLES;
		if (this.currentsubtitles != node)
		{
			this.subtitleholder.replaceChild(node, this.subtitleholder.firstChild);
			this.currentsubtitles = node;
		}
	};

	// Returned by Special:Getversion
	// <versionstring>4.4.101=http://www.hrwiki.org/w/index.php?title=User:Phlip/Greasemonkey&action=raw&ctype=text/javascript&fakeextension=.user.js</versionstring>
	
	function Updates()
	{
	}
	Updates.CURRENT_VERSION = [4, 4, 101];
	Updates.CHECK_INTERVAL = 24*60*60*1000; // once per day
	Updates.prototype.load = async function load() {
		this.enabled = await utils.getPref('updates', true);
	}
	Updates.prototype.init = function()
	{
		// We don't need to do this update checking on Chrome - the Chrome Web Store
		// will handle that for us
		if (!utils.useGMFunctions)
		{
			delete globals.modules.updates;
			return;
		}
	
		this.setting_enabled = globals.modules.settingspane.addCheckbox('updates', "Check for updates", "Regularly check for updates to the All-in-one script", this.enabled);
	
		/*no await*/ this.doCheck();
	};
	Updates.prototype.updateSettings = function()
	{
		this.enabled = this.setting_enabled.checked;
		utils.setPref("updates", this.enabled);
		this.doCheck();
	};
	
	Updates.prototype.doCheck = async function doCheck()
	{
		if (this.updatelink) {
			this.updatelink.parentNode.removeChild(this.updatelink);
			this.updatelink = null;
		}
	
		if (!this.enabled)
			return;
	
		var str;
		if (Date.now() - (await utils.getPref("lastchecktime", 0)) > Updates.CHECK_INTERVAL)
		{
			str = await utils.downloadPage("http://www.hrwiki.org/wiki/Special:Getversion/User:Phlip/Greasemonkey?cachedodge=" + Math.random());
			str = str.text;
			utils.setPref("lastchecktime", Date.now());
			utils.setPref("lastcheckstring", str);
		}
		else
			str = await utils.getPref("lastcheckstring", "");
	
		var parts = str.split("@@");
		for (var i = 0; i < parts.length; i++)
		{
			var matches = parts[i].match(/^(\d+)\.(\d+)\.(\d+)=(.*)$/);
			if (!matches) continue;
			if (matches[1] > Updates.CURRENT_VERSION[0] ||
			    (matches[1] == Updates.CURRENT_VERSION[0] && matches[2] > Updates.CURRENT_VERSION[1]) ||
			    (matches[1] == Updates.CURRENT_VERSION[0] && matches[2] == Updates.CURRENT_VERSION[1] && matches[3] > Updates.CURRENT_VERSION[2]))
			{
				var updatelink = document.createElement('a');
				updatelink.href=matches[4];
				updatelink.style.display = "block";
				updatelink.style.position = 'fixed';
				updatelink.style.left = '0px';
				updatelink.style.top = '0px';
				updatelink.style.border = 'none';
				updatelink.style.zIndex = 1;
				var updatelinkimage = document.createElement('img');
				updatelinkimage.src = globals.images.update;
				var oldversionstr = Updates.CURRENT_VERSION[0] + "." + Updates.CURRENT_VERSION[1] + "." + Updates.CURRENT_VERSION[2];
				var newversionstr = matches[1] + "." + matches[2] + "." + matches[3];
				updatelinkimage.title = "Click here to update from script version " + oldversionstr + " to " + newversionstr;
				updatelinkimage.style.display = "block";
				updatelinkimage.style.border = 'none';
				updatelink.appendChild(updatelinkimage);
				document.body.appendChild(updatelink);
				this.updatelink = updatelink;
				return;
			}
		}
	};
	
	Updates.prototype.cacheDodge = function()
	{
		utils.setPref("lastchecktime", 0);
		/*no await*/ this.doCheck();
	}

	// Podstar/Videlectrix (stock IIS), HRWiki and stock Apache error pages, respectively. Don't do anything on those pages.
	if (document.title == "The page cannot be found" || document.title == "Homestar Runner Wiki - 404 Not Found" || document.title == "404 Not Found")
		return;
	
	var utils = new Utils();
	var globals = new Globals();
	var playercomm = new PlayerComm();
	playercomm.init();
	await globals.initModules();
})();

/*</pre>*/