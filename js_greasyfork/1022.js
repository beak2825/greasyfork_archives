// ==UserScript==
// @id             GAF-QQRE
// @name           NeoGAF: Quick Quote, Reply, and Edit
// @namespace      hateradio)))
// @author         hateradio
// @version        10.1
// @description    This script adds the ability to quickly quote, reply, and edit posts on NeoGAF. Just click and go.
// @homepage       https://greasyfork.org/scripts/1022-neogaf-quick-quote-reply-and-edit
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGRjg5NTBEMDYwODdFMDExQkE4RUNGOEQ3QzZENjU2MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NzUyNDZBRTg3RDkxMUUwQkE0Q0QyRjcyMEQwQUNDOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NzUyNDZBRDg3RDkxMUUwQkE0Q0QyRjcyMEQwQUNDOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5RTgyRDgxNkQ5ODdFMDExOTI4RUREM0QyQUUxREY5NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRjg5NTBEMDYwODdFMDExQkE4RUNGOEQ3QzZENjU2MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PggNsxcAAAu4SURBVHja7FtbbBzVGf7OXPbmW+3EduI4N0KggSaBpHG4lgBtWglQQULtGy+0EjQSFFVtxUsfCupDH1qJ9q1vhQqqImiRqqpVSQA1JJAACSYUK3fba4d1YnvXXu/u3E6/c2Z2vVl8iUMMduORjmd35pz//P/332fWQkqJq/kwcJUfSwAsAXCVH1b5gxBiyQKuagu43EO+/+svVQCx7Wefb325Dqh2gZHXG/TZS/zkNmHYeyzhbQvcAq3FXzRG7fsyOzGePfaHl/Y/++wLH/Xxkqv0dekApH7+jG15TyN32sRYP1DKRcsXeuFEOQyCYCWARDMcaY+/8s9PHv/Bc92v8eY4RzCrC0jzsQdjwfDTSH9oYvg4TaHIZV7t2gWMgUkQKJqdQiy5vH7nxthzN61vSB85PXY4AkHOCIBwx59E/pyJ8xTeHaM9KQCCKbQ/XeaQs9y/Umtm8gSbfCueCYYfb969telRApDmhVPKu2cOgs7YGmQ51y2Gw3PIH4lpdxERj6KcP6tkuILuMVNaVvtMdb+8v9DOHcaDUh6Bo4KCuIZ/V3IMRFYwgwv4jBdunovcEMUgEl5UaV6ZWRkIxYy+L2eJE+KzSq6dXxFMTC+kqLWWKsHVfaUs5a4+FW0GlMeDL2WcF1V0j80eAzxfwFOCk5gfDU3ciJgyQgB0xBVV/AeTTMwEgKy19KnM3yirsmaOnMJ1ZNVHxXfVGs0/QfCkiOQ1Zq8DZBTvKkNFVqURI/QpdRY2MlmBLENELh+gbZmJ1W2TGs2OB8iMBEjEBFa3h3v2fRqgSHNsazHRVM+14xKZYZ9zEM2Z1Prx3gC5CYmEbaCxUaCxwUDmPOkxuK9uM1ByJHoHw7Tc1iKQI61iibTo+quXl2UQoRKD6QPX7ADIquBvlgGIYe8hD9097kXL1nRYeGh3vbaAve+O48yAj7UrTXSuiGu59h7MY3hMYsdmA7dvT2D/kTx6TrtooXCPPJTUqfij4w7e6y5x3iTXLY0GWltt9JwsYe0qG527G/Hqv0fx6ZCPOAF58Jv12HdgAiNcs3Gdgc5lBqVUriAmZZhTJSirQRAhISW4Ft7Wwh+NhN+xNUXkJbo/KeBM2sOhbhc7tiS1phWNtmUxkrFh0m+HcyEnjQ0xkrQwRAHUnA3r4vCNOI525/HW4YKes0JZVEdM02lqsHCsh8GM5t3aYuP1tycwmKG2EwLf/VYTljebJDOhabU2WSzXJCzpV7zy8gAoL1Z0ZOT30qRZC615ZQu3bW/AzVtS2jv6+5XWfJQIRkCgBjOe1mgjmReGib5zXoWuuqbAvJALmWwgIOeHA7x5KE/NCWy+PoFdO1NhBFDETQtvvZvVoSWTcWhZjjbk27c3E5AYKfkYzQWa3VaCIVTNIqoUKacHYWYXqCymuAEHBTnc44Fuizr69s1fq4NBrgwZ4uTxs0oYfQSjXGEqBpWw2ZxDUuG1zvY4+tNFxqvwe1OdgRMnJvSaZNzArq46CuHTasK9+9Kl0JX550QfaVO6u7oaccO1Se7t48xgyJOm3WbCCNyQIaPKlefUDQa1cUBUzj30a8YfrFuZ0HOMaE7OZeDjvkVG3fNZH8P8PMxrymQF72dGXGSpmCaaqFp3ftRHjt/VUDHiyImC/tzWntD0TEzuPzQagMsxwvujpDnq0cQZHMvgT0wEmqfGlKFTtvBkmLpVBpByRhCMGS3Ar8kG/K60QuWjpZ6Bxg+Jn6LGMzRnNWXlsjgujHq6fGius/QaBUA/XcLhuaHO1uvOEw16C9qX2XpOibGmxPv1iq6s2pvnC1lPy+LxczxmUCaBj08Wwjm8MUrkFGDXreBfV0bpG1EKnDkGTG8B04wzjDWnWCOdpc+KCKgDHxcojEBzvYVNaxI6lamEYRnh5kVKNjjs8btAx3Jbr8kwAJr83hA3VUcG2xD6ey/NPaxzRKXw+XTI01nk6xtSuPumRpR4+b1+hzHE00KuYYb49s1JdF1nadfR6Ps1SpxTDKjNBLqyEprwiiYDH1wI8GcKrRLEhBvg9eNFze73v9GoGR4jhyfYPZ8pBug8OIZuWsiJUYlOrt16DS3Ac9Gb95EuCexootbI9LpVcbx/tID+AQ8Dr4xiy6oYhmhVd341juMMridJb3uKmYHxo7fIOo07Hugp4p5NNn6zdxzdQwF+eruN3RuDSZ5V7LIuIwjq9cp0/ahtCMo+5eJHt8bRx4h7jEXJi8cKEWGBh29IYvtaG4br4o6NMTx/pIAMHfP37+Q1zdXM5Y/eUYckVWI4Pvb1R0UMywYUXNy7KY69p0qabppx5o10mA5vXMUMkA7ndhCsdU0SK1ssfEwLerm7gOWJAEczoYPnC7riI99Bxb41Dv5cAfBDeVWAEUEEgKJkBag3XPzu/jjePgscHZA4OOhoQF7+bwEDWQfPfCeBNnrB899L4sP05K5d64RuqQ1ajMoGv7zLItACN7Yq5y4hRRv/7QOsBbgm70wWazvXCPzq7oSeu7k90M3ZL+6K4eQFqeNb12rgie0Wkkw292zgNTeILDaK3dFXOZc6oMSIa6qAR+0b9DEjSlcaGeXXRPiWDhtdnSZ+KFJ4jcXP+wMuHtliwyt4Oi/XcdqtK6EZ1we1Y8jQp9RpZ3t0T9KYtSGFXeaWZtZwjAVSRNUcU/4tHVLrQLcadKt2RuG2DhG2HLSyB6+X2u0FLcugtCq9ar2pM/l1vaibv1QA8qr7ZRecdCIQlDWIMLAIRihpGPT/QPcEhAcPbADuv5bVGPtOyVDv13Z4UU1QuV7TzvqV7q9crRuVtkAFyLCxlReFJ1F+ihXR1tE8CHQtoYYCV/VzDuUoUQZnLgDkuMjPh89BYsoaiKRuo6xAc6VYkgppwwhlocYUoyE/UciVmL5fn7IFVyYrwnjFL6rZNEMcdOoVoiz0Z3tCWenCQ+GVNXiM0A7XT5DuGDOX480BgGxJFRe0AHZ6CS5UjXSMAcG2Qk0oRnUJEGUHETWKukGmhYjpBJUX9/1lpoModQd0Wj/yV1UBW6baF0yRUUo1apJUNDeQ1aRDeqowYpOKcdIYpyUX5gLAa6eBdw4z5/dyMS2hWKxV3mRvPtULlUt74ywv8RrwDbbZr94fgmJE25VBU2auQMtTwD1vAP8aiBpXCq5a5680sbhiQPK8udYBl/ok7wt4vb5rRVgFWtHzmLLWGfNQpGCq7nhyP7Dv3JfwYuSLOLYui55umWHAFFF6U8EtS+vc8x9g/9CX9GZovo8mVs7XN1dSe+UJnDL7IgP0jw9cvvCLAoDbWsmknKzGy2HCpSk8ReHfOPf56C/4l6P3smCKRxlGNUlGFCufeBv4R/r//O2wyv93d4Ttd+VxLoV/jAHv1b4F8nZ4Po9t9P0V8bAOMaNnBI8fBP7Su4Bej8/ncctyCh9pX7Uhew4BL/Ve2T0WNAD3sZmyI7/fw8Lsxd4rv8eCBaCZ7W1Xc9iSP/4e8Kez87PPgg2Cuxj9baX5D4AXzs7fPgsWgPuY//ccAf54Zn73WZAuoBqevw9duVS36CxANTpfhPCLohJcAmAJgCUAlgD4PMdsv4E2plskRPiurvx5sQqv5TDFHAGg4JZtwrRMGIaxqEAo82qZBmzyr85KhiAI5CUXQvl8YYRE1icTcTiOF75oCAJ2ZMHiAEApkMInk3E9FP8lxx3G5LvimQFIDwz+LR6LbWtoSOnFNq2hDMRC/yer0OQNxGI26lJJfjZRKjne8HDuI4Q/kHQumj/Vj6VTqVTL5k1r/ur58k6fmvc8H67raytYyACUzb/s976vNO8EY7nxNy+MjL3CKfs4jleDMCUAkWV0rF/b/hTDxMOBlK2+H8SDYHG4gDooV973vKGx8cKbE4XSUV5iX4kPOUZQ9QZmOgDUoZ5EqZ8+rudYq1p0hD8zXSwpQfm7+pGBemh+mkM11aOo+qH0bACoQz2MTXE0ciSwSF6kRIcSTP2YcYIjx1HEVO/eFkNgW6oElwBYAmD+ssbSf49f5cf/BBgAlKO7u4jI694AAAAASUVORK5CYII=
// @screenshot     https://raw.githubusercontent.com/hateradio/qqre/master/screenshot.png

// @include        http*://*neogaf.com/forum/showthread.php?*
// @include        http*://*neogaf.com/forum/newreply.php*
// @include        http*://*neogaf.com/forum/editpost.php*
// @include        http*://*neogaf.com/forum/newthread.php*
// @include        http*://*neogaf.com/forum/subscription.php*
// @include        http*://*neogaf.com/forum/showpost.php*
// @include        http*://*neogaf.com/forum/private.php*

// @match          *://*.neogaf.com/forum/showthread.php?*
// @match          *://*.neogaf.com/forum/newreply.php*
// @match          *://*.neogaf.com/forum/editpost.php*
// @match          *://*.neogaf.com/forum/newthread.php*
// @match          *://*.neogaf.com/forum/subscription.php*
// @match          *://*.neogaf.com/forum/showpost.php*
// @match          *://*.neogaf.com/forum/private.php*

// @grant          GM_log

// @updated        04 OCT 2017
// @since          30 OCT 2010
// (c) 2010+, hateradio
// @downloadURL https://update.greasyfork.org/scripts/1022/NeoGAF%3A%20Quick%20Quote%2C%20Reply%2C%20and%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/1022/NeoGAF%3A%20Quick%20Quote%2C%20Reply%2C%20and%20Edit.meta.js
// ==/UserScript==

/*

## Updates

### 10.1
* **New**: Adds new emoji!
* **Fix**: Inserting emoji will no longer add a space between emoji
* Adds ESLint support

### 10.0.2
* **New**: Adds Grunt for task management -- generates readme.md and update.json
* **Fix**: Safari - Shortcuts now work
* - Note: `CMD+M` and `CMD+H` cannot be overriden. Please use `CTRL+H` and `CTRL+M`
* **Fix**: Safari - Textareas in PMs now display
* Removed extraneous elements and added `placeholder` text to input fields

### 10.0.1
* **Fix**: Search input now matches the style of the site
* **Fix**: Quick Editor now toggling correctly

### 10
* **New**: Emoji toolbar to toggle which emoji to display
* **New**: Adds the `[NOPARSE]` tag -- won't parse any BBCode within it
* **Fix**: Posts without user names won't stop the script execution

### 9.0.2
* **FIX**: HTTPS for NeoGAF

### 9.0.1
* **FIX**: Saved text would appear in the title field instead of the textarea.

### 9.0
*  **New**: Keyboard toggle for images in quotes is now ALT+SHIFT+T instead of ALT+T for greater compatibility.
*  **New**: Improved shortcuts for Mac (eg, CMD+B for Bold)
*  **New**: Temporary storage saves text as it is written.
*  **New**: Subscription setting overhauled.
*  -  Will now only provide an override option, as all posts made will default to the settings provided by the [User Control Panel](http://www.neogaf.com/forum/profile.php?do=editoptions#sel_autosubscribe)
*  **New**: Middle clicking on Emoji will link to [CodePoints.net](https://codepoints.net) for information about that character
*  **New**: AutoPager & Live Update extension support
*  **New**: Informs anonymous users to sign in before submitting posts
*  **New**: Resize toggle added to Emoji box
*  **New**: Tabbing will send the focus from the textarea to the Submit button
*  **New**: Routing mechanism to load the different code on the different pages
*  **New**: New Form class to create Quick Reply and Edit forms
*  **New**: Character escaping mechanism to convert JavaScript characters to HTML entities for AJAX transmissions; removes VB method
*  **Fix**: Removed vertical alignment of inputs
*  **Fix**: Posts that have been saved now clear after the post has been processed
*  Renames "Delete" button with "Clear"
*  Restructure of the code base

### 8.0

*  **New**: Emoji picker!
*  **New**: (Windows) Emoji support to Chrome-based browsers!
*  -   _Note 1_: Segoe UI Symbol, Segoe UI Emoji and Symbola added to the font list
*  -   _Note 2_: This may change default fonts a bit
*  -   _Note 3_: Windows 7 users who have issues displaying Emoji should install [Symbola](http://users.teilar.gr/~g1951d/)
*  **New**: USC-2 decoder and entity encoder to work with forum AJAX to transmit Emoji data
*  **Fix**: Removing recursive quotes no longer causes an error

### 7.4.1

*   Chrome fix for greaseWindow

### 7.4

*   Fixes quotes when user has ignored others
*   Fixes for getting user key

### 7.3

*   Fixes update notification
*   Closed threads do not show the reply box
*   Changes to form to match new dark theme
*   Improves quick quote text replacements

### 7.1 - 7.2

*   Changes for Chrome extension
*   Changes to form to match new dark theme
*   Improves quick quote text replacements

### 7.0

*   Fix for new site
*   Fix for quick reply AJAX response (no more `responseXML`)

### 6.3

*   Chrome 27+, no more `window` access
*   Added message listener
*   Chanced to dropboxusercontent.com, since it's now used by dropbox

### 6.1.2 - 6.2

*   Chrome - button issues, again

### 6.1

*   Chrome - button issues

### 6.0

*   Removes quick reply bar, now uses the native button to create the quick editor
*   The editor starts when pressing the Edit+ link
*   Incorporates some of the site's native AJAX functionality
*   [IMG] to [URL] replacement now creates "Link : Image" when an image is inside a link
*   Fixes integration with Smilies script, data image links will be removed
*   Updates the Extra reply button code
*   Enhances compatibility with Opera
*   Adds keyboad shortcut list
*   Adds keyboard shortcut (`ALT+T`) for toggling "Auto-convert IMG to URL tags" checkbox

(DLs: 4,156)

// #Updates
// todo implement preview


*/

(function () {
	'use strict';

	var $, greaseWindow, strg, update, Extra, Editor, Form, app, bond, emoji, dom;

	if (!String.prototype.trim) { String.prototype.trim = function () { return this.replace(/^\s+|\s+$/g, ''); }; }
	if (!Array.from) { Array.from = function (list) { return Array.prototype.slice.call(list); }; }

	function throttle(f, delay) {
		var timer = null;
		return function () {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = window.setTimeout(function () {
				f.apply(context, args);
			}, delay || 1000);
		};
	}

	bond = function (o, m) { return function () { return m.apply(o, arguments); }; };

	dom = {
		top: document.head || document.body,
		css: function (t) {
			if (!this.style) {
				this.style = document.createElement('style');
				this.style.type = 'text/css';
				this.top.appendChild(this.style);
			}
			this.style.appendChild(document.createTextNode(t + '\n'));
		},
		js: function (t) {
			var j = document.createElement('script');
			j.type = 'text/javascript';
			j[/^https?:\/\//i.test(t) ? 'src' : 'textContent'] = t;
			this.top.appendChild(j);
		}
	};

	// UCS-2 Decoder https://github.com/bestiejs/punycode.js
	function ucs2decode(string) {
		var output = [],
			counter = 0,
			length = string.length,
			value,
			extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if ((value & 0xF800) === 0xD800 && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) === 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					output.push(value, extra);
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	// Window | No longer works in Chrome 27+
	greaseWindow = {};

	function embedScript(func) {
		var script = document.createElement('script');
		script.type = 'application/javascript';
		script.textContent = '(' + func + ')();';
		document.body.appendChild(script);
		document.body.removeChild(script);
	}

	// S T O R A G E HANDLE
	strg = {
		on: (function () { try { var s = window.localStorage; return (s.getItem && s.setItem && s.removeItem); } catch (e) { return false; } }()),
		read: function (key) { return this.on ? JSON.parse(window.localStorage.getItem(key)) : false; },
		grab: function (key) { return this.read(key) || {}; },
		save: function (key, dat) { return this.on ? !window.localStorage.setItem(key, JSON.stringify(dat)) : false; },
		wipe: function (key) { return this.on ? !window.localStorage.removeItem(key) : false; },
		zero: function (obj) { var k; for (k in obj) { if (obj.hasOwnProperty(k)) { return false; } } return true; }
	};

	// U P D A T E HANDLE
	update = {
		name: 'NeoGAF: Quick Quote, Reply, and Edit',
		version: 10100,
		key: 'ujs_QQRE_UPDT',
		callback: 'qqreupdater',
		page: 'https://greasyfork.org/scripts/1022-neogaf-quick-quote-reply-and-edit',
		urij: 'https://hateradio.github.io/qqre/update.json',
		interval: 5,
		day: (new Date()).getTime(),
		time: function () { return new Date(this.day + (1000 * 60 * 60 * 24 * this.interval)).getTime(); },
		notification: function (j) {
			if (this.version < j.version) {
				strg.save(this.key, { date: this.time(), version: j.version, page: j.page });
				this.link();
			}
		},
		link: function () {
			this.csstxt();

			var a = document.createElement('a'), b = strg.read(this.key);
			a.href = b.page || '#';
			a.id = 'userscriptupdater2';
			a.title = 'Update now.';
			a.target = '_blank';
			a.textContent = 'An update for ' + this.name + ' is available.';
			a.addEventListener('click', function () { this.style.display = 'none'; }, false);
			document.body.appendChild(a);
		},
		xhr: function () {
			var x = new XMLHttpRequest();
			x.addEventListener('load', function () { update.notification(JSON.parse(this.responseText)); }, false);
			x.open('get', update.urij, true);
			x.send();
		},
		check: function (opt) {
			if (!strg.on) { return; }
			var stored = strg.read(this.key), page;

			if (opt || !stored || stored.date < this.day) {
				page = (stored && stored.page) || '#';
				strg.save(this.key, {date: this.time(), version: this.version, page: page});
				this.xhr();
			} else if (this.version < stored.version) {
				this.link();
			}
		},
		csstxt: function () {
			if (!this.pop) { this.pop = true; dom.css('#userscriptupdater2,#userscriptupdater2:visited{box-shadow:1px 1px 6px #7776;border-bottom:3px solid #d65e55;cursor:pointer;color:#555;font-family:sans-serif;font-size:12px;font-weight:700;text-align:justify;position:fixed;z-index:999999;right:10px;top:10px;background:#ebebeb url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTguODQ4NTMgMTk5LjM4MzA3Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNC4yNzYgLTE2LjM2NykiPjxjaXJjbGUgY3g9IjEwNC4zMjEiIGN5PSIxMTYuMzI3IiByPSI5OC4yNzQiIGZpbGw9IiNkNjVlNTUiLz48cGF0aCBmaWxsPSIjZTljZTAyIiBzdHJva2U9IiNlOWM4MDIiIHN0cm9rZS13aWR0aD0iMTYuNyIgZD0iTTE2Ni40NSAxNTcuMzEySDQxLjg5bDMxLjE0LTUzLjkzNSAzMS4xNC01My45MzUgMzEuMTM3IDUzLjkzNXoiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48dGV4dCB4PSI4NS42NDMiIHk9IjE1MS44NjYiIGZpbGw9IiNkNjVlNTUiIHN0cm9rZS13aWR0aD0iMS40NzciIHN0eWxlPSJsaW5lLWhlaWdodDoxLjI1Oy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0Jvb2sgQW50aXF1YSciIGZvbnQtd2VpZ2h0PSI0MDAiIGZvbnQtc2l6ZT0iNTkuMDg4IiBmb250LWZhbWlseT0iQm9vayBBbnRpcXVhIiBsZXR0ZXItc3BhY2luZz0iMCIgd29yZC1zcGFjaW5nPSIwIj48dHNwYW4geD0iODUuNjQzIiB5PSIxNTEuODY2IiBzdHlsZT0iLWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQm9vayBBbnRpcXVhJyIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIxMjYuMDU0Ij4hPC90c3Bhbj48L3RleHQ+PC9nPjwvc3ZnPg==) no-repeat 10px center;background-size:40px;padding:0 20px 0 60px;height:55px;line-height:55px}#userscriptupdater2:hover,#userscriptupdater2:visited:hover{color:#b33a3a !important;border-color:#ce4b30}'); }
		}
	};
	update.check();

	// DOM/HTML Helpers
	$ = {
		a: function (e) { var i = 1, j = arguments.length, f = document.createDocumentFragment(); for (i; i < j; i++) { f.appendChild(arguments[i]); } e.appendChild(f); return e; },
		e: function (t, o, e, p) { var a, b, c = document.createElement(t); if (typeof (o) === 'object') { for (a in o) { if (o.hasOwnProperty(a)) { b = a.charAt(0); switch (b) { case '_': c.style[a.substring(1)] = o[a]; break; case '$': c.setAttribute(a.substring(1), o[a]); break; default: c[a] = o[a]; break; } } } } if (e) { if (p) { c.appendChild(e); } else { e.appendChild(c); } } return c; },
		t: document.createElement('textarea'),
		h: function (t) { this.t.innerHTML = t; return this.t.value.trim(); },
		htmlEncode: function (text) {
			var chars = ucs2decode(text), c, i, j = chars.length, str = [];

			for (i = 0; i < j; i++) {
				c = chars[i];
				str.push(c >= 127 ? ('&#' + c + ';') : String.fromCharCode(c));
			}

			return str.join('');
		},
		uriHtmlEncode: function (text) { return encodeURIComponent(this.htmlEncode(text)); }
	};

	// Extra Reply Buttons
	Extra = (function () {
		function Extra(id, custom) {
			id = id || '001';
			this.editor = 'vB_Editor_' + id;
			this.custum = !!custom;
			this.txt = document.getElementById(this.editor + '_textarea');
			if (this.txt) {
				this.src = this.custum ? document.getElementById(this.editor + '_cmd_underline') : document.getElementById(this.editor + '_cmd_underline').parentNode;
				this.BB = {};
				this.add();
				this.setup();
			}
		}

		Extra.buttons = ['Spoiler', 'Highlight', 'Strike', 'NoParse'];
		Extra.images  = [
			'/forum/images/neogaf2/misc/spoiler.gif',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0QTZDNkZFMTMxOEFFMDExOEQ0RTk2MjY1NjVFQUVDQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozM0I5QzRFMjhBMzUxMUUwOEVEMUQ5RkU1NzlCRTAwRiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozM0I5QzRFMThBMzUxMUUwOEVEMUQ5RkU1NzlCRTAwRiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QTZDNkZFMTMxOEFFMDExOEQ0RTk2MjY1NjVFQUVDQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QTZDNkZFMTMxOEFFMDExOEQ0RTk2MjY1NjVFQUVDQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkUW7xgAAAB/SURBVHjaYvz//z8DtQETAw3ACDeUBZfEGUX1AiDljyZ8F4iVkfkm92+mEG0oEEwA4jggNoTyFYD4IRB/A2JOIP4OxI7keP8jEvshlP6JRg9wmGIB76E0PzVjXxCKP46MxA9Kp+pA/AGKzwHxHKjcByg9B5tGxtFSagQbChBgAHoVG8AVO051AAAAAElFTkSuQmCC',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0QTZDNkZFMTMxOEFFMDExOEQ0RTk2MjY1NjVFQUVDQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRjk5MzM3NjhBMzQxMUUwOTcxNkNDQzlBQjRERDVEMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRjk5MzM3NThBMzQxMUUwOTcxNkNDQzlBQjRERDVEMCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QTZDNkZFMTMxOEFFMDExOEQ0RTk2MjY1NjVFQUVDQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QTZDNkZFMTMxOEFFMDExOEQ0RTk2MjY1NjVFQUVDQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpIU3swAAAEzSURBVHjaYvz//z8DtQETAw3AqKG4QVhoKIOEuHgBIyPjfhDW09PrB/LXg8TxAlDs48Ia6ur1ICXiYmIOSkpKCkD2ekFBwf+hISF49eF16ZevXx1AtLqGhoKxkdEDOzu7RCD3AyHvM6KnUycnJzj74cOH8+/du5cAYsvIyBzQ09VtfPny5Qc+fv4LMDX79u3DMJQFh2VbgNhbXl6eAYShwOH7jx8OQANh/K1A7INNMy5DwYpFhIUNvn79+uDS5csJT548yQcKgcKVwcXZOfHvv38LyIr94ydO9P/69ctAVVV1gqOjoyIwksAGAS2Sx6cPw6XIYSQrK8tw9ty5fmAkBQINfMDGynoRJM7KxnYQW1gS8j4cAF36YM/eveeBTFDkKACTVyIQHyAp9kfz/ggyFCDAAMW7jH/4BUY6AAAAAElFTkSuQmCC',
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkM5NjZBNUEyNTI4MTFFNkI5OUE5QzcyOTIzQkVGRTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkM5NjZBNUIyNTI4MTFFNkI5OUE5QzcyOTIzQkVGRTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGQzk2NkE1ODI1MjgxMUU2Qjk5QTlDNzI5MjNCRUZFMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGQzk2NkE1OTI1MjgxMUU2Qjk5QTlDNzI5MjNCRUZFMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuG5jzQAAAJXSURBVHja5FS9T1pRFP89eMiTFq3ERKoMJDYOLxpCcOlSh9q4GD82HWpZaB0dXWypk39CKw6NU7cyuJjapQuLFkkTNH6gSQv4OkgJ6EPg8Tzn1TYQAiRNnXqTk3vfOb/ze+frXkHXdfzrZcItrFshFWu+Xjyp/pJJZkjGSbw3uijJBsl7kvgf5NuPjUkrmgbT2Bgqm5sBWCzLQm+vU+jpAbq6fgEyGa+uKF49lQqgVHpJ2BBh69IVqhtV9D/iLSDY7avmgQH8TCZxHoshe3Bg2DtJ5/B4cK+vDxrp9FzuOalDbe8+N66pVirJFWDZ7Hbjx+4uvoXDkYuTk2e+pSWBhc5hRyYDk9MJxjCWfZo2qlQszsDhcOZSKZxvb0csVutTz8LCOgoFIBIJekZGpjA6ip3FRTCGsYZPM9JysTgudnTgIpFAmyS9kf3+Y6gqtScaJPOr34Sd3d1hxjCWfZpHenXlFS0WaJTig4mJdbhcwP5+DSGt12SbZgxj2adV+uDIrDabsWNrq47QNzsbrMYYPi0ijRYUBXccDmT39j7UEU5OBnF5ybY5xjCWfVrVdCOXTkOSJK7bVA3hyooRoaoo/VTvecYwln3QbE7jHrtsFsVPLrfbaRsexpe1NVDHw6KuTxs/FYQ52uYpkodqNovvp6dnWrn8WI7l4g1Jv8qSMfxSe/vqfRrwu3yTqBkwm28GWaMalZCnJqXpYhRU1Rj+oXihSfrlMoYGB0N5uimJw8Oz5NER8pQiXU9D+Mw6tjGGsezTNP2dfuGvHhTfsd6Y9P97pK8FGADMrzoLJkd3DQAAAABJRU5ErkJggg=='
		];
		Extra.ctrl = { b: 'b', i: 'i', u: 'u', s: 'Strike', h: 'Highlight', p: 'Spoiler', l: 'url', m: 'img', e: 'save', d: 'clear' };
		Extra.mac = /(?:mac)/i.test(navigator.platform);
		Extra.moz = window.InstallTrigger !== undefined;
		Extra.keyEvent = Extra.moz ? 'keypress' : 'keydown';
		Extra.click = function (el) {
			try {
				el.click();
			} catch (e) {
				var evt = document.createEvent('MouseEvents');
				evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				// window.setTimeout(function () {
				el.dispatchEvent(evt);
				// }, 1);
			}
		};

		Extra.prototype = {
			constructor: Extra,
			insert: function (evt) { // based on: http://parentnode.org/javascript/working-with-the-cursor-position/ // gecko parts only
				var t = evt.target.getAttribute('alt').toUpperCase(), start, end, pos, temp;
				if (this.txt.selectionStart >= 0) {
					start = this.txt.selectionStart || 0;
					end = this.txt.selectionEnd || 0;
					temp = this.txt.value.substr(0, start) + '[' + t + ']' + this.txt.value.substr(start, end - start);
					pos = temp.length;
					this.txt.value = temp + '[/' + t + ']' + this.txt.value.substr(end, this.txt.value.length);
					this.txt.focus();
					start = start + 2 + t.length;
					this.txt.setSelectionRange(start, pos);
				}
			},
			add: function () {
				var i = Extra.buttons.length, div, td;
				while (i--) {
					div = $.e('div', {className: 'imagebutton', title: 'new'});
					this.BB[Extra.buttons[i]] = $.e('img', {height: 20, width: 21, src: Extra.images[i], alt: Extra.buttons[i], title: Extra.buttons[i]}, div);
					this.BB[Extra.buttons[i]].addEventListener('click', this.insert.bind(this), false);
					if (this.custum) {
						this.src.parentNode.insertBefore(div, this.src.nextSibling);
					} else {
						td = $.e('td', {className: 'imgbtnemu'}, div, true);
						this.src.parentNode.insertBefore(td, this.src.nextSibling);
					}
				}
			},
			keys: function (e) {
				if (!e.shiftKey && (e.ctrlKey || e.metaKey)) {
					// console.log('keys--which', e.which, e);
					var k = Extra.ctrl[String.fromCharCode(e.which).toLowerCase()];
					// console.log('k', k);
					if (k && (this.BB[k] || (e.metaKey && this.BB.meta[k]))) {
						// console.log('keys found');
						e.preventDefault();
						Extra.click(this.BB[k] || this.BB.meta[k]);
					}
				}
			},
			setup: function () {
				this.BB.meta = {};
				this.BB.b = document.getElementById(this.editor + '_cmd_bold');
				this.BB.i = document.getElementById(this.editor + '_cmd_italic');
				this.BB.u = document.getElementById(this.editor + '_cmd_underline');
				this.BB.img = document.getElementById(this.editor + '_cmd_insertimage');
				this.BB.url = document.getElementById(this.editor + '_cmd_createlink');

				this.BB.meta.b = this.BB.b;
				this.BB.meta.i = this.BB.i;
				this.BB.meta.u = this.BB.u;

				if (Extra.moz) {
					this.BB.b = this.BB.i = this.BB.u = null;
				}

				this.txt.addEventListener(Extra.keyEvent, this.keys.bind(this), false);
			}
		};
		return Extra;
	}());
	dom.css('td.imgbtnemu div:hover { border:1px solid #316ac5; margin: -1px; background: #c1d2ee; } td.imgbtnemu div:active { background: #98b5e2; } #vB_Editor_001_cmd_wrap0_spoiler { visibility:hidden !important } .quickreplyform_hotspot{text-align:center;margin-top:6px} .text_emo_container { text-align: center; margin-top: 8px; } .text_emo_container > div {vertical-align: top} .text_emo_container .text_emo_container_text {display:inline-block;margin: 0 0 0 4%;width:64%} .text_emo_container .text_emo_container_emo {width:27%;min-width:180px;margin: 0 0 0 1%;display:inline-block;overflow:hidden;font-size:13px} .text_emo_container_text textarea {width:99%} .gm_emoji {line-height: 1.3;overflow: hidden;resize:both} .gm_emoji a {font-size:13px;line-height:1.3;cursor:pointer} .gm_emoji_list {display:inline} .gm_emoji_box {height: 100px; overflow: auto; } .gm_emoji_toolbar { margin-bottom: 4px } .gm_emoji_search{margin:5px 0;box-sizing:border-box;width:95%}');

	// Emoji Stuff <3 OSX 10.9+ Command+Control+Space
	// http://konieczny.be/article/utf.php
	// http://apps.timwhitlock.info/emoji/tables/unicode
	emoji = {
		div: null,
		ranges: /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
		dbGenerator: function (ranges) {
			var list = [], i;

			ranges.forEach(function (range) {
				for (i = range[0]; i <= range[1]; i++) {
					list.push(i.toString(16));
				}
			});

			return list;
		},
		presentation: {
			nameReg: /([A-Z])/g,
			readableName: function (name) {
				var title = name.replace(emoji.presentation.nameReg,  ' & $1');
				title = title[0].toUpperCase() + title.slice(1);

				return title;
			},
			toolbarIcon: function (points, name) {
				var b = document.createElement('div'), point;

				if (typeof points === 'string' || points instanceof String) {
					point = points;
				} else {
					point = points[0];
				}

				b.innerHTML = '&#x' + point + ';';
				b.setAttribute('data-toolbar', name);
				b.title = emoji.presentation.readableName(name);
				b.className = 'gm_emoji_toolbar_button';
				return b;
			},
			icon: function (points) {
				var a = document.createElement('a'), title, point;

				if (typeof points === 'string' || points instanceof String) {
					point = points;
					title = 'U+' + points;
				} else {
					point = points[0];
					title = points[1];
				}

				a.innerHTML = '&#x' + point + ';';
				a.setAttribute('data-char', a.innerHTML);
				a.title = title;
				a.href = 'https://codepoints.net/U+' + point;
				return a;
			},
			panel: function (div) {
				var e, i, l, f = document.createDocumentFragment(), innerDiv, innerFragment, toolbar, search, emos, hide = false;

				toolbar = document.createElement('div');
				toolbar.className = 'gm_emoji_toolbar';

				search = document.createElement('input');
				search.setAttribute('type', 'text');
				search.className = 'biginput gm_emoji_search';
				search.placeholder = 'Search';

				emos = document.createElement('div');
				emos.className = 'gm_emoji_box';

				for (e in emoji.db) {
					if (emoji.db.hasOwnProperty(e)) {
						innerFragment = document.createDocumentFragment();

						innerDiv = document.createElement('div');

						if (hide) {
							innerDiv.className = 'gm_emoji_list gm_emoji_hidden gm_emoji_' + e;
						} else {
							hide = true;
							innerDiv.className = 'gm_emoji_list gm_emoji_' + e;
						}

						l = emoji.db[e];
						for (i = 0; i < l.length; i++) {
							if (i === 0) {
								toolbar.appendChild(emoji.presentation.toolbarIcon(l[i], e));
								toolbar.appendChild(document.createTextNode(' '));
							}
							innerFragment.appendChild(emoji.presentation.icon(l[i]));
							innerFragment.appendChild(document.createTextNode(' '));
						}
					}

					innerDiv.appendChild(innerFragment);
					f.appendChild(innerDiv);
				}
				div.appendChild(toolbar);
				div.appendChild(search);
				emos.appendChild(f);
				div.appendChild(emos);
				toolbar.querySelector('.gm_emoji_toolbar_button').classList.add('gm_emoji_selected');

				search.addEventListener(Extra.keyEvent, function (e) {
					if (e.keyCode === 13) {
						e.preventDefault();
						e.stopPropagation();
					}
				}, true);
				search.addEventListener(Extra.keyEvent, throttle(emoji.events.search, 500), false);
			}
		},
		db: {
			smileysPeople: [['1F600', 'Grinning Face'], ['1F601', 'Grinning Face With Smiling Eyes'], ['1F602', 'Face With Tears of Joy'], ['1F923', 'Rolling on the Floor Laughing'], ['1F603', 'Smiling Face With Open Mouth'], ['1F604', 'Smiling Face With Open Mouth & Smiling Eyes'], ['1F605', 'Smiling Face With Open Mouth & Cold Sweat'], ['1F606', 'Smiling Face With Open Mouth & Closed Eyes'], ['1F609', 'Winking Face'], ['1F60A', 'Smiling Face With Smiling Eyes'], ['1F60B', 'Face Savouring Delicious Food'], ['1F60E', 'Smiling Face With Sunglasses'], ['1F60D', 'Smiling Face With Heart-Eyes'], ['1F618', 'Face Blowing a Kiss'], ['1F617', 'Kissing Face'], ['1F619', 'Kissing Face With Smiling Eyes'], ['1F61A', 'Kissing Face With Closed Eyes'], ['263A', 'Smiling Face'], ['1F642', 'Slightly Smiling Face'], ['1F917', 'Hugging Face'], ['1F914', 'Thinking Face'], ['1F610', 'Neutral Face'], ['1F611', 'Expressionless Face'], ['1F636', 'Face Without Mouth'], ['1F644', 'Face With Rolling Eyes'], ['1F60F', 'Smirking Face'], ['1F623', 'Persevering Face'], ['1F625', 'Disappointed but Relieved Face'], ['1F62E', 'Face With Open Mouth'], ['1F910', 'Zipper-Mouth Face'], ['1F62F', 'Hushed Face'], ['1F62A', 'Sleepy Face'], ['1F62B', 'Tired Face'], ['1F634', 'Sleeping Face'], ['1F60C', 'Relieved Face'], ['1F61B', 'Face With Stuck-Out Tongue'], ['1F61C', 'Face With Stuck-Out Tongue & Winking Eye'], ['1F61D', 'Face With Stuck-Out Tongue & Closed Eyes'], ['1F924', 'Drooling Face'], ['1F612', 'Unamused Face'], ['1F613', 'Face With Cold Sweat'], ['1F614', 'Pensive Face'], ['1F615', 'Confused Face'], ['1F643', 'Upside-Down Face'], ['1F911', 'Money-Mouth Face'], ['1F632', 'Astonished Face'], ['2639', 'Frowning Face'], ['1F641', 'Slightly Frowning Face'], ['1F616', 'Confounded Face'], ['1F61E', 'Disappointed Face'], ['1F61F', 'Worried Face'], ['1F624', 'Face With Steam From Nose'], ['1F622', 'Crying Face'], ['1F62D', 'Loudly Crying Face'], ['1F626', 'Frowning Face With Open Mouth'], ['1F627', 'Anguished Face'], ['1F628', 'Fearful Face'], ['1F629', 'Weary Face'], ['1F62C', 'Grimacing Face'], ['1F630', 'Face With Open Mouth & Cold Sweat'], ['1F631', 'Face Screaming in Fear'], ['1F633', 'Flushed Face'], ['1F635', 'Dizzy Face'], ['1F621', 'Pouting Face'], ['1F620', 'Angry Face'], ['1F637', 'Face With Medical Mask'], ['1F912', 'Face With Thermometer'], ['1F915', 'Face With Head-Bandage'], ['1F922', 'Nauseated Face'], ['1F927', 'Sneezing Face'], ['1F607', 'Smiling Face With Halo'], ['1F920', 'Cowboy Hat Face'], ['1F921', 'Clown Face'], ['1F925', 'Lying Face'], ['1F913', 'Nerd Face'], ['1F608', 'Smiling Face With Horns'], ['1F47F', 'Angry Face With Horns'], ['1F479', 'Ogre'], ['1F47A', 'Goblin'], ['1F480', 'Skull'], ['1F47B', 'Ghost'], ['1F47D', 'Alien'], ['1F916', 'Robot Face'], ['1F4A9', 'Pile of Poo'], ['1F63A', 'Smiling Cat Face With Open Mouth'], ['1F638', 'Grinning Cat Face With Smiling Eyes'], ['1F639', 'Cat Face With Tears of Joy'], ['1F63B', 'Smiling Cat Face With Heart-Eyes'], ['1F63C', 'Cat Face With Wry Smile'], ['1F63D', 'Kissing Cat Face With Closed Eyes'], ['1F640', 'Weary Cat Face'], ['1F63F', 'Crying Cat Face'], ['1F63E', 'Pouting Cat Face'], ['1F476', 'Baby'], ['1F466', 'Boy'], ['1F467', 'Girl'], ['1F468', 'Man'], ['1F469', 'Woman'], ['1F474', 'Old Man'], ['1F475', 'Old Woman'], ['1F468;&#x200D;&#x2695;&#xFE0F', 'Man Health Worker'], ['1F469;&#x200D;&#x2695;&#xFE0F', 'Woman Health Worker'], ['1F468;&#x200D;&#x1F393', 'Man Student'], ['1F469;&#x200D;&#x1F393', 'Woman Student'], ['1F468;&#x200D;&#x2696;&#xFE0F', 'Man Judge'], ['1F469;&#x200D;&#x2696;&#xFE0F', 'Woman Judge'], ['1F468;&#x200D;&#x1F33E', 'Man Farmer'], ['1F469;&#x200D;&#x1F33E', 'Woman Farmer'], ['1F468;&#x200D;&#x1F373', 'Man Cook'], ['1F469;&#x200D;&#x1F373', 'Woman Cook'], ['1F468;&#x200D;&#x1F527', 'Man Mechanic'], ['1F469;&#x200D;&#x1F527', 'Woman Mechanic'], ['1F468;&#x200D;&#x1F3ED', 'Man Factory Worker'], ['1F469;&#x200D;&#x1F3ED', 'Woman Factory Worker'], ['1F468;&#x200D;&#x1F4BC', 'Man Office Worker'], ['1F469;&#x200D;&#x1F4BC', 'Woman Office Worker'], ['1F468;&#x200D;&#x1F52C', 'Man Scientist'], ['1F469;&#x200D;&#x1F52C', 'Woman Scientist'], ['1F468;&#x200D;&#x1F4BB', 'Man Technologist'], ['1F469;&#x200D;&#x1F4BB', 'Woman Technologist'], ['1F468;&#x200D;&#x1F3A4', 'Man Singer'], ['1F469;&#x200D;&#x1F3A4', 'Woman Singer'], ['1F468;&#x200D;&#x1F3A8', 'Man Artist'], ['1F469;&#x200D;&#x1F3A8', 'Woman Artist'], ['1F468;&#x200D;&#x2708;&#xFE0F', 'Man Pilot'], ['1F469;&#x200D;&#x2708;&#xFE0F', 'Woman Pilot'], ['1F468;&#x200D;&#x1F680', 'Man Astronaut'], ['1F469;&#x200D;&#x1F680', 'Woman Astronaut'], ['1F468;&#x200D;&#x1F692', 'Man Firefighter'], ['1F469;&#x200D;&#x1F692', 'Woman Firefighter'], ['1F46E', 'Police Officer'], ['1F46E;&#x200D;&#x2642;&#xFE0F', 'Man Police Officer'], ['1F46E;&#x200D;&#x2640;&#xFE0F', 'Woman Police Officer'], ['1F575', 'Detective'], ['1F575;&#xFE0F;&#x200D;&#x2642;&#xFE0F', 'Man Detective'], ['1F575;&#xFE0F;&#x200D;&#x2640;&#xFE0F', 'Woman Detective'], ['1F482', 'Guard'], ['1F482;&#x200D;&#x2642;&#xFE0F', 'Man Guard'], ['1F482;&#x200D;&#x2640;&#xFE0F', 'Woman Guard'], ['1F477', 'Construction Worker'], ['1F477;&#x200D;&#x2642;&#xFE0F', 'Man Construction Worker'], ['1F477;&#x200D;&#x2640;&#xFE0F', 'Woman Construction Worker'], ['1F934', 'Prince'], ['1F478', 'Princess'], ['1F473', 'Person Wearing Turban'], ['1F473;&#x200D;&#x2642;&#xFE0F', 'Man Wearing Turban'], ['1F473;&#x200D;&#x2640;&#xFE0F', 'Woman Wearing Turban'], ['1F472', 'Man With Chinese Cap'], ['1F471', 'Blond-Haired Person'], ['1F471;&#x200D;&#x2642;&#xFE0F', 'Blond-Haired Man'], ['1F471;&#x200D;&#x2640;&#xFE0F', 'Blond-Haired Woman'], ['1F935', 'Man in Tuxedo'], ['1F470', 'Bride With Veil'], ['1F930', 'Pregnant Woman'], ['1F47C', 'Baby Angel'], ['1F385', 'Santa Claus'], ['1F936', 'Mrs. Claus'], ['1F64D', 'Person Frowning'], ['1F64D;&#x200D;&#x2642;&#xFE0F', 'Man Frowning'], ['1F64D;&#x200D;&#x2640;&#xFE0F', 'Woman Frowning'], ['1F64E', 'Person Pouting'], ['1F64E;&#x200D;&#x2642;&#xFE0F', 'Man Pouting'], ['1F64E;&#x200D;&#x2640;&#xFE0F', 'Woman Pouting'], ['1F645', 'Person Gesturing No'], ['1F645;&#x200D;&#x2642;&#xFE0F', 'Man Gesturing No'], ['1F645;&#x200D;&#x2640;&#xFE0F', 'Woman Gesturing No'], ['1F646', 'Person Gesturing OK'], ['1F646;&#x200D;&#x2642;&#xFE0F', 'Man Gesturing OK'], ['1F646;&#x200D;&#x2640;&#xFE0F', 'Woman Gesturing OK'], ['1F481', 'Person Tipping Hand'], ['1F481;&#x200D;&#x2642;&#xFE0F', 'Man Tipping Hand'], ['1F481;&#x200D;&#x2640;&#xFE0F', 'Woman Tipping Hand'], ['1F64B', 'Person Raising Hand'], ['1F64B;&#x200D;&#x2642;&#xFE0F', 'Man Raising Hand'], ['1F64B;&#x200D;&#x2640;&#xFE0F', 'Woman Raising Hand'], ['1F647', 'Person Bowing'], ['1F647;&#x200D;&#x2642;&#xFE0F', 'Man Bowing'], ['1F647;&#x200D;&#x2640;&#xFE0F', 'Woman Bowing'], ['1F926', 'Person Facepalming'], ['1F926;&#x200D;&#x2642;&#xFE0F', 'Man Facepalming'], ['1F926;&#x200D;&#x2640;&#xFE0F', 'Woman Facepalming'], ['1F937', 'Person Shrugging'], ['1F937;&#x200D;&#x2642;&#xFE0F', 'Man Shrugging'], ['1F937;&#x200D;&#x2640;&#xFE0F', 'Woman Shrugging'], ['1F486', 'Person Getting Massage'], ['1F486;&#x200D;&#x2642;&#xFE0F', 'Man Getting Massage'], ['1F486;&#x200D;&#x2640;&#xFE0F', 'Woman Getting Massage'], ['1F487', 'Person Getting Haircut'], ['1F487;&#x200D;&#x2642;&#xFE0F', 'Man Getting Haircut'], ['1F487;&#x200D;&#x2640;&#xFE0F', 'Woman Getting Haircut'], ['1F6B6', 'Person Walking'], ['1F6B6;&#x200D;&#x2642;&#xFE0F', 'Man Walking'], ['1F6B6;&#x200D;&#x2640;&#xFE0F', 'Woman Walking'], ['1F3C3', 'Person Running'], ['1F3C3;&#x200D;&#x2642;&#xFE0F', 'Man Running'], ['1F3C3;&#x200D;&#x2640;&#xFE0F', 'Woman Running'], ['1F483', 'Woman Dancing'], ['1F57A', 'Man Dancing'], ['1F46F', 'People With Bunny Ears Partying'], ['1F46F;&#x200D;&#x2642;&#xFE0F', 'Men With Bunny Ears Partying'], ['1F46F;&#x200D;&#x2640;&#xFE0F', 'Women With Bunny Ears Partying'], ['1F574', 'Man in Business Suit Levitating'], ['1F5E3', 'Speaking Head'], ['1F464', 'Bust in Silhouette'], ['1F465', 'Busts in Silhouette'], ['1F46B', 'Man and Woman Holding Hands'], ['1F46C', 'Two Men Holding Hands'], ['1F46D', 'Two Women Holding Hands'], ['1F48F', 'Kiss'], ['1F468;&#x200D;&#x2764;&#xFE0F;&#x200D;&#x1F48B;&#x200D;&#x1F468', 'Kiss: Man, Man'], ['1F469;&#x200D;&#x2764;&#xFE0F;&#x200D;&#x1F48B;&#x200D;&#x1F469', 'Kiss: Woman, Woman'], ['1F491', 'Couple With Heart'], ['1F468;&#x200D;&#x2764;&#xFE0F;&#x200D;&#x1F468', 'Couple With Heart: Man, Man'], ['1F469;&#x200D;&#x2764;&#xFE0F;&#x200D;&#x1F469', 'Couple With Heart: Woman, Woman'], ['1F46A', 'Family'], ['1F468;&#x200D;&#x1F469;&#x200D;&#x1F466', 'Family: Man, Woman, Boy'], ['1F468;&#x200D;&#x1F469;&#x200D;&#x1F467', 'Family: Man, Woman, Girl'], ['1F468;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F466', 'Family: Man, Woman, Girl, Boy'], ['1F468;&#x200D;&#x1F469;&#x200D;&#x1F466;&#x200D;&#x1F466', 'Family: Man, Woman, Boy, Boy'], ['1F468;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F467', 'Family: Man, Woman, Girl, Girl'], ['1F468;&#x200D;&#x1F468;&#x200D;&#x1F466', 'Family: Man, Man, Boy'], ['1F468;&#x200D;&#x1F468;&#x200D;&#x1F467', 'Family: Man, Man, Girl'], ['1F468;&#x200D;&#x1F468;&#x200D;&#x1F467;&#x200D;&#x1F466', 'Family: Man, Man, Girl, Boy'], ['1F468;&#x200D;&#x1F468;&#x200D;&#x1F466;&#x200D;&#x1F466', 'Family: Man, Man, Boy, Boy'], ['1F468;&#x200D;&#x1F468;&#x200D;&#x1F467;&#x200D;&#x1F467', 'Family: Man, Man, Girl, Girl'], ['1F469;&#x200D;&#x1F469;&#x200D;&#x1F466', 'Family: Woman, Woman, Boy'], ['1F469;&#x200D;&#x1F469;&#x200D;&#x1F467', 'Family: Woman, Woman, Girl'], ['1F469;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F466', 'Family: Woman, Woman, Girl, Boy'], ['1F469;&#x200D;&#x1F469;&#x200D;&#x1F466;&#x200D;&#x1F466', 'Family: Woman, Woman, Boy, Boy'], ['1F469;&#x200D;&#x1F469;&#x200D;&#x1F467;&#x200D;&#x1F467', 'Family: Woman, Woman, Girl, Girl'], ['1F468;&#x200D;&#x1F466', 'Family: Man, Boy'], ['1F468;&#x200D;&#x1F466;&#x200D;&#x1F466', 'Family: Man, Boy, Boy'], ['1F468;&#x200D;&#x1F467', 'Family: Man, Girl'], ['1F468;&#x200D;&#x1F467;&#x200D;&#x1F466', 'Family: Man, Girl, Boy'], ['1F468;&#x200D;&#x1F467;&#x200D;&#x1F467', 'Family: Man, Girl, Girl'], ['1F469;&#x200D;&#x1F466', 'Family: Woman, Boy'], ['1F469;&#x200D;&#x1F466;&#x200D;&#x1F466', 'Family: Woman, Boy, Boy'], ['1F469;&#x200D;&#x1F467', 'Family: Woman, Girl'], ['1F469;&#x200D;&#x1F467;&#x200D;&#x1F466', 'Family: Woman, Girl, Boy'], ['1F469;&#x200D;&#x1F467;&#x200D;&#x1F467', 'Family: Woman, Girl, Girl'], ['1F933', 'Selfie'], ['1F4AA', 'Flexed Biceps'], ['1F448', 'Backhand Index Pointing Left'], ['1F449', 'Backhand Index Pointing Right'], ['261D', 'Index Pointing Up'], ['1F446', 'Backhand Index Pointing Up'], ['1F595', 'Middle Finger'], ['1F447', 'Backhand Index Pointing Down'], ['270C', 'Victory Hand'], ['1F91E', 'Crossed Fingers'], ['1F596', 'Vulcan Salute'], ['1F918', 'Sign of the Horns'], ['1F590', 'Raised Hand With Fingers Splayed'], ['270B', 'Raised Hand'], ['1F44C', 'OK Hand'], ['1F44D', 'Thumbs Up'], ['1F44E', 'Thumbs Down'], ['270A', 'Raised Fist'], ['1F44A', 'Oncoming Fist'], ['1F91B', 'Left-Facing Fist'], ['1F91C', 'Right-Facing Fist'], ['1F91A', 'Raised Back of Hand'], ['1F44B', 'Waving Hand'], ['270D', 'Writing Hand'], ['1F44F', 'Clapping Hands'], ['1F450', 'Open Hands'], ['1F64C', 'Raising Hands'], ['1F64F', 'Folded Hands'], ['1F91D', 'Handshake'], ['1F485', 'Nail Polish'], ['1F442', 'Ear'], ['1F443', 'Nose'], ['1F463', 'Footprints'], ['1F440', 'Eyes'], ['1F441', 'Eye'], ['1F445', 'Tongue'], ['1F444', 'Mouth'], ['1F48B', 'Kiss Mark'], ['1F453', 'Glasses'], ['1F576', 'Sunglasses'], ['1F454', 'Necktie'], ['1F455', 'T-Shirt'], ['1F456', 'Jeans'], ['1F457', 'Dress'], ['1F458', 'Kimono'], ['1F459', 'Bikini'], ['1F45A', 'Woman’s Clothes'], ['1F45B', 'Purse'], ['1F45C', 'Handbag'], ['1F45D', 'Clutch Bag'], ['1F392', 'School Backpack'], ['1F45E', 'Man’s Shoe'], ['1F45F', 'Running Shoe'], ['1F460', 'High-Heeled Shoe'], ['1F461', 'Woman’s Sandal'], ['1F462', 'Woman’s Boot'], ['1F451', 'Crown'], ['1F452', 'Woman’s Hat'], ['1F3A9', 'Top Hat'], ['1F393', 'Graduation Cap'], ['26D1', 'Rescue Worker’s Helmet'], ['1F484', 'Lipstick'], ['1F48D', 'Ring'], ['1F302', 'Closed Umbrella'], ['2602', 'Umbrella'], ['1F4BC', 'Briefcase']],
			animalsNature: [['1F648', 'See-No-Evil Monkey'], ['1F649', 'Hear-No-Evil Monkey'], ['1F64A', 'Speak-No-Evil Monkey'], ['1F4A5', 'Collision'], ['1F4A6', 'Sweat Droplets'], ['1F4A8', 'Dashing Away'], ['1F4AB', 'Dizzy'], ['1F435', 'Monkey Face'], ['1F412', 'Monkey'], ['1F98D', 'Gorilla'], ['1F436', 'Dog Face'], ['1F415', 'Dog'], ['1F429', 'Poodle'], ['1F43A', 'Wolf Face'], ['1F98A', 'Fox Face'], ['1F431', 'Cat Face'], ['1F408', 'Cat'], ['1F981', 'Lion Face'], ['1F42F', 'Tiger Face'], ['1F405', 'Tiger'], ['1F406', 'Leopard'], ['1F434', 'Horse Face'], ['1F40E', 'Horse'], ['1F984', 'Unicorn Face'], ['1F42E', 'Cow Face'], ['1F402', 'Ox'], ['1F403', 'Water Buffalo'], ['1F404', 'Cow'], ['1F437', 'Pig Face'], ['1F416', 'Pig'], ['1F417', 'Boar'], ['1F43D', 'Pig Nose'], ['1F40F', 'Ram'], ['1F411', 'Ewe'], ['1F410', 'Goat'], ['1F42A', 'Camel'], ['1F42B', 'Two-Hump Camel'], ['1F418', 'Elephant'], ['1F98F', 'Rhinoceros'], ['1F42D', 'Mouse Face'], ['1F401', 'Mouse'], ['1F400', 'Rat'], ['1F439', 'Hamster Face'], ['1F430', 'Rabbit Face'], ['1F407', 'Rabbit'], ['1F43F', 'Chipmunk'], ['1F987', 'Bat'], ['1F43B', 'Bear Face'], ['1F428', 'Koala'], ['1F43C', 'Panda Face'], ['1F43E', 'Paw Prints'], ['1F983', 'Turkey'], ['1F414', 'Chicken'], ['1F413', 'Rooster'], ['1F423', 'Hatching Chick'], ['1F424', 'Baby Chick'], ['1F425', 'Front-Facing Baby Chick'], ['1F426', 'Bird'], ['1F427', 'Penguin'], ['1F54A', 'Dove'], ['1F985', 'Eagle'], ['1F986', 'Duck'], ['1F989', 'Owl'], ['1F438', 'Frog Face'], ['1F40A', 'Crocodile'], ['1F422', 'Turtle'], ['1F98E', 'Lizard'], ['1F40D', 'Snake'], ['1F432', 'Dragon Face'], ['1F409', 'Dragon'], ['1F433', 'Spouting Whale'], ['1F40B', 'Whale'], ['1F42C', 'Dolphin'], ['1F41F', 'Fish'], ['1F420', 'Tropical Fish'], ['1F421', 'Blowfish'], ['1F988', 'Shark'], ['1F419', 'Octopus'], ['1F41A', 'Spiral Shell'], ['1F980', 'Crab'], ['1F990', 'Shrimp'], ['1F991', 'Squid'], ['1F40C', 'Snail'], ['1F98B', 'Butterfly'], ['1F41B', 'Bug'], ['1F41C', 'Ant'], ['1F41D', 'Honeybee'], ['1F41E', 'Lady Beetle'], ['1F577', 'Spider'], ['1F578', 'Spider Web'], ['1F982', 'Scorpion'], ['1F490', 'Bouquet'], ['1F338', 'Cherry Blossom'], ['1F4AE', 'White Flower'], ['1F3F5', 'Rosette'], ['1F339', 'Rose'], ['1F940', 'Wilted Flower'], ['1F33A', 'Hibiscus'], ['1F33B', 'Sunflower'], ['1F33C', 'Blossom'], ['1F337', 'Tulip'], ['1F331', 'Seedling'], ['1F332', 'Evergreen Tree'], ['1F333', 'Deciduous Tree'], ['1F334', 'Palm Tree'], ['1F335', 'Cactus'], ['1F33E', 'Sheaf of Rice'], ['1F33F', 'Herb'], ['2618', 'Shamrock'], ['1F340', 'Four Leaf Clover'], ['1F341', 'Maple Leaf'], ['1F342', 'Fallen Leaf'], ['1F343', 'Leaf Fluttering in Wind'], ['1F344', 'Mushroom'], ['1F330', 'Chestnut'], ['1F30D', 'Globe Showing Europe-Africa'], ['1F30E', 'Globe Showing Americas'], ['1F30F', 'Globe Showing Asia-Australia'], ['1F310', 'Globe With Meridians'], ['1F311', 'New Moon'], ['1F312', 'Waxing Crescent Moon'], ['1F313', 'First Quarter Moon'], ['1F314', 'Waxing Gibbous Moon'], ['1F315', 'Full Moon'], ['1F316', 'Waning Gibbous Moon'], ['1F317', 'Last Quarter Moon'], ['1F318', 'Waning Crescent Moon'], ['1F319', 'Crescent Moon'], ['1F31A', 'New Moon Face'], ['1F31B', 'First Quarter Moon With Face'], ['1F31C', 'Last Quarter Moon With Face'], ['2600', 'Sun'], ['1F31D', 'Full Moon With Face'], ['1F31E', 'Sun With Face'], ['2B50', 'White Medium Star'], ['1F31F', 'Glowing Star'], ['1F320', 'Shooting Star'], ['2601', 'Cloud'], ['26C5', 'Sun Behind Cloud'], ['26C8', 'Cloud With Lightning and Rain'], ['1F324', 'Sun Behind Small Cloud'], ['1F325', 'Sun Behind Large Cloud'], ['1F326', 'Sun Behind Rain Cloud'], ['1F327', 'Cloud With Rain'], ['1F328', 'Cloud With Snow'], ['1F329', 'Cloud With Lightning'], ['1F32A', 'Tornado'], ['1F32B', 'Fog'], ['1F32C', 'Wind Face'], ['1F308', 'Rainbow'], ['2602', 'Umbrella'], ['2614', 'Umbrella With Rain Drops'], ['26A1', 'High Voltage'], ['2744', 'Snowflake'], ['2603', 'Snowman'], ['26C4', 'Snowman Without Snow'], ['2604', 'Comet'], ['1F525', 'Fire'], ['1F4A7', 'Droplet'], ['1F30A', 'Water Wave'], ['1F384', 'Christmas Tree'], ['2728', 'Sparkles'], ['1F38B', 'Tanabata Tree'], ['1F38D', 'Pine Decoration']],
			foodDrink: [['1F347', 'Grapes'], ['1F348', 'Melon'], ['1F349', 'Watermelon'], ['1F34A', 'Tangerine'], ['1F34B', 'Lemon'], ['1F34C', 'Banana'], ['1F34D', 'Pineapple'], ['1F34E', 'Red Apple'], ['1F34F', 'Green Apple'], ['1F350', 'Pear'], ['1F351', 'Peach'], ['1F352', 'Cherries'], ['1F353', 'Strawberry'], ['1F95D', 'Kiwi Fruit'], ['1F345', 'Tomato'], ['1F951', 'Avocado'], ['1F346', 'Eggplant'], ['1F954', 'Potato'], ['1F955', 'Carrot'], ['1F33D', 'Ear of Corn'], ['1F336', 'Hot Pepper'], ['1F952', 'Cucumber'], ['1F344', 'Mushroom'], ['1F95C', 'Peanuts'], ['1F330', 'Chestnut'], ['1F35E', 'Bread'], ['1F950', 'Croissant'], ['1F956', 'Baguette Bread'], ['1F95E', 'Pancakes'], ['1F9C0', 'Cheese Wedge'], ['1F356', 'Meat on Bone'], ['1F357', 'Poultry Leg'], ['1F953', 'Bacon'], ['1F354', 'Hamburger'], ['1F35F', 'French Fries'], ['1F355', 'Pizza'], ['1F32D', 'Hot Dog'], ['1F32E', 'Taco'], ['1F32F', 'Burrito'], ['1F373', 'Cooking'], ['1F372', 'Pot of Food'], ['1F957', 'Green Salad'], ['1F37F', 'Popcorn'], ['1F371', 'Bento Box'], ['1F358', 'Rice Cracker'], ['1F359', 'Rice Ball'], ['1F35A', 'Cooked Rice'], ['1F35B', 'Curry Rice'], ['1F35C', 'Steaming Bowl'], ['1F35D', 'Spaghetti'], ['1F360', 'Roasted Sweet Potato'], ['1F362', 'Oden'], ['1F363', 'Sushi'], ['1F364', 'Fried Shrimp'], ['1F365', 'Fish Cake With Swirl'], ['1F361', 'Dango'], ['1F366', 'Soft Ice Cream'], ['1F367', 'Shaved Ice'], ['1F368', 'Ice Cream'], ['1F369', 'Doughnut'], ['1F36A', 'Cookie'], ['1F382', 'Birthday Cake'], ['1F370', 'Shortcake'], ['1F36B', 'Chocolate Bar'], ['1F36C', 'Candy'], ['1F36D', 'Lollipop'], ['1F36E', 'Custard'], ['1F36F', 'Honey Pot'], ['1F37C', 'Baby Bottle'], ['1F95B', 'Glass of Milk'], ['2615', 'Hot Beverage'], ['1F375', 'Teacup Without Handle'], ['1F376', 'Sake'], ['1F37E', 'Bottle With Popping Cork'], ['1F377', 'Wine Glass'], ['1F378', 'Cocktail Glass'], ['1F379', 'Tropical Drink'], ['1F37A', 'Beer Mug'], ['1F37B', 'Clinking Beer Mugs'], ['1F942', 'Clinking Glasses'], ['1F943', 'Tumbler Glass'], ['1F37D', 'Fork and Knife With Plate'], ['1F374', 'Fork and Knife'], ['1F944', 'Spoon']],
			activity: [['1F47E', 'Alien Monster'], ['1F574', 'Man in Business Suit Levitating'], ['1F3C7', 'Horse Racing'], ['26F7', 'Skier'], ['1F3C2', 'Snowboarder'], ['1F3CC', 'Person Golfing'], ['1F3CC;&#xFE0F;&#x200D;&#x2642;&#xFE0F', 'Man Golfing'], ['1F3CC;&#xFE0F;&#x200D;&#x2640;&#xFE0F', 'Woman Golfing'], ['1F3C4', 'Person Surfing'], ['1F3C4;&#x200D;&#x2642;&#xFE0F', 'Man Surfing'], ['1F3C4;&#x200D;&#x2640;&#xFE0F', 'Woman Surfing'], ['1F6A3', 'Person Rowing Boat'], ['1F6A3;&#x200D;&#x2642;&#xFE0F', 'Man Rowing Boat'], ['1F6A3;&#x200D;&#x2640;&#xFE0F', 'Woman Rowing Boat'], ['1F3CA', 'Person Swimming'], ['1F3CA;&#x200D;&#x2642;&#xFE0F', 'Man Swimming'], ['1F3CA;&#x200D;&#x2640;&#xFE0F', 'Woman Swimming'], ['26F9', 'Person Bouncing Ball'], ['26F9;&#xFE0F;&#x200D;&#x2642;&#xFE0F', 'Man Bouncing Ball'], ['26F9;&#xFE0F;&#x200D;&#x2640;&#xFE0F', 'Woman Bouncing Ball'], ['1F3CB', 'Person Lifting Weights'], ['1F3CB;&#xFE0F;&#x200D;&#x2642;&#xFE0F', 'Man Lifting Weights'], ['1F3CB;&#xFE0F;&#x200D;&#x2640;&#xFE0F', 'Woman Lifting Weights'], ['1F6B4', 'Person Biking'], ['1F6B4;&#x200D;&#x2642;&#xFE0F', 'Man Biking'], ['1F6B4;&#x200D;&#x2640;&#xFE0F', 'Woman Biking'], ['1F6B5', 'Person Mountain Biking'], ['1F6B5;&#x200D;&#x2642;&#xFE0F', 'Man Mountain Biking'], ['1F6B5;&#x200D;&#x2640;&#xFE0F', 'Woman Mountain Biking'], ['1F938', 'Person Cartwheeling'], ['1F938;&#x200D;&#x2642;&#xFE0F', 'Man Cartwheeling'], ['1F938;&#x200D;&#x2640;&#xFE0F', 'Woman Cartwheeling'], ['1F93C', 'People Wrestling'], ['1F93C;&#x200D;&#x2642;&#xFE0F', 'Men Wrestling'], ['1F93C;&#x200D;&#x2640;&#xFE0F', 'Women Wrestling'], ['1F93D', 'Person Playing Water Polo'], ['1F93D;&#x200D;&#x2642;&#xFE0F', 'Man Playing Water Polo'], ['1F93D;&#x200D;&#x2640;&#xFE0F', 'Woman Playing Water Polo'], ['1F93E', 'Person Playing Handball'], ['1F93E;&#x200D;&#x2642;&#xFE0F', 'Man Playing Handball'], ['1F93E;&#x200D;&#x2640;&#xFE0F', 'Woman Playing Handball'], ['1F939', 'Person Juggling'], ['1F939;&#x200D;&#x2642;&#xFE0F', 'Man Juggling'], ['1F939;&#x200D;&#x2640;&#xFE0F', 'Woman Juggling'], ['1F3AA', 'Circus Tent'], ['1F3AD', 'Performing Arts'], ['1F3A8', 'Artist Palette'], ['1F3B0', 'Slot Machine'], ['1F397', 'Reminder Ribbon'], ['1F39F', 'Admission Tickets'], ['1F3AB', 'Ticket'], ['1F396', 'Military Medal'], ['1F3C6', 'Trophy'], ['1F3C5', 'Sports Medal'], ['1F947', '1st Place Medal'], ['1F948', '2nd Place Medal'], ['1F949', '3rd Place Medal'], ['26BD', 'Soccer Ball'], ['26BE', 'Baseball'], ['1F3C0', 'Basketball'], ['1F3D0', 'Volleyball'], ['1F3C8', 'American Football'], ['1F3C9', 'Rugby Football'], ['1F3BE', 'Tennis'], ['1F3B1', 'Pool 8 Ball'], ['1F3B3', 'Bowling'], ['1F3CF', 'Cricket'], ['1F3D1', 'Field Hockey'], ['1F3D2', 'Ice Hockey'], ['1F3D3', 'Ping Pong'], ['1F3F8', 'Badminton'], ['1F94A', 'Boxing Glove'], ['1F94B', 'Martial Arts Uniform'], ['1F3AF', 'Direct Hit'], ['26F3', 'Flag in Hole'], ['26F8', 'Ice Skate'], ['1F3A3', 'Fishing Pole'], ['1F3BD', 'Running Shirt'], ['1F3BF', 'Skis'], ['1F3AE', 'Video Game'], ['1F3B2', 'Game Die'], ['1F3BC', 'Musical Score'], ['1F3A4', 'Microphone'], ['1F3A7', 'Headphone'], ['1F3B7', 'Saxophone'], ['1F3B8', 'Guitar'], ['1F3B9', 'Musical Keyboard'], ['1F3BA', 'Trumpet'], ['1F3BB', 'Violin'], ['1F941', 'Drum'], ['1F3AC', 'Clapper Board'], ['1F3F9', 'Bow and Arrow']],
			travelPlaces: [['1F6A3', 'Person Rowing Boat'], ['1F3CE', 'Racing Car'], ['1F3CD', 'Motorcycle'], ['1F5FE', 'Map of Japan'], ['1F3D4', 'Snow-Capped Mountain'], ['26F0', 'Mountain'], ['1F30B', 'Volcano'], ['1F5FB', 'Mount Fuji'], ['1F3D5', 'Camping'], ['1F3D6', 'Beach With Umbrella'], ['1F3DC', 'Desert'], ['1F3DD', 'Desert Island'], ['1F3DE', 'National Park'], ['1F3DF', 'Stadium'], ['1F3DB', 'Classical Building'], ['1F3D7', 'Building Construction'], ['1F3D8', 'House'], ['1F3D9', 'Cityscape'], ['1F3DA', 'Derelict House'], ['1F3E0', 'House'], ['1F3E1', 'House With Garden'], ['1F3E2', 'Office Building'], ['1F3E3', 'Japanese Post Office'], ['1F3E4', 'Post Office'], ['1F3E5', 'Hospital'], ['1F3E6', 'Bank'], ['1F3E8', 'Hotel'], ['1F3E9', 'Love Hotel'], ['1F3EA', 'Convenience Store'], ['1F3EB', 'School'], ['1F3EC', 'Department Store'], ['1F3ED', 'Factory'], ['1F3EF', 'Japanese Castle'], ['1F3F0', 'Castle'], ['1F492', 'Wedding'], ['1F5FC', 'Tokyo Tower'], ['1F5FD', 'Statue of Liberty'], ['26EA', 'Church'], ['1F54C', 'Mosque'], ['1F54D', 'Synagogue'], ['26E9', 'Shinto Shrine'], ['1F54B', 'Kaaba'], ['26F2', 'Fountain'], ['26FA', 'Tent'], ['1F301', 'Foggy'], ['1F303', 'Night With Stars'], ['1F304', 'Sunrise Over Mountains'], ['1F305', 'Sunrise'], ['1F306', 'Cityscape at Dusk'], ['1F307', 'Sunset'], ['1F309', 'Bridge at Night'], ['1F30C', 'Milky Way'], ['1F3A0', 'Carousel Horse'], ['1F3A1', 'Ferris Wheel'], ['1F3A2', 'Roller Coaster'], ['1F682', 'Locomotive'], ['1F683', 'Railway Car'], ['1F684', 'High-Speed Train'], ['1F685', 'High-Speed Train With Bullet Nose'], ['1F686', 'Train'], ['1F687', 'Metro'], ['1F688', 'Light Rail'], ['1F689', 'Station'], ['1F68A', 'Tram'], ['1F69D', 'Monorail'], ['1F69E', 'Mountain Railway'], ['1F68B', 'Tram Car'], ['1F68C', 'Bus'], ['1F68D', 'Oncoming Bus'], ['1F68E', 'Trolleybus'], ['1F690', 'Minibus'], ['1F691', 'Ambulance'], ['1F692', 'Fire Engine'], ['1F693', 'Police Car'], ['1F694', 'Oncoming Police Car'], ['1F695', 'Taxi'], ['1F696', 'Oncoming Taxi'], ['1F697', 'Automobile'], ['1F698', 'Oncoming Automobile'], ['1F69A', 'Delivery Truck'], ['1F69B', 'Articulated Lorry'], ['1F69C', 'Tractor'], ['1F6B2', 'Bicycle'], ['1F6F4', 'Kick Scooter'], ['1F6F5', 'Motor Scooter'], ['1F68F', 'Bus Stop'], ['1F6E4', 'Railway Track'], ['26FD', 'Fuel Pump'], ['1F6A8', 'Police Car Light'], ['1F6A5', 'Horizontal Traffic Light'], ['1F6A6', 'Vertical Traffic Light'], ['1F6A7', 'Construction'], ['2693', 'Anchor'], ['26F5', 'Sailboat'], ['1F6A4', 'Speedboat'], ['1F6F3', 'Passenger Ship'], ['26F4', 'Ferry'], ['1F6E5', 'Motor Boat'], ['1F6A2', 'Ship'], ['2708', 'Airplane'], ['1F6E9', 'Small Airplane'], ['1F6EB', 'Airplane Departure'], ['1F6EC', 'Airplane Arrival'], ['1F4BA', 'Seat'], ['1F681', 'Helicopter'], ['1F69F', 'Suspension Railway'], ['1F6A0', 'Mountain Cableway'], ['1F6A1', 'Aerial Tramway'], ['1F6F0', 'Satellite'], ['1F680', 'Rocket'], ['1F320', 'Shooting Star'], ['26F1', 'Umbrella on Ground'], ['1F386', 'Fireworks'], ['1F387', 'Sparkler'], ['1F391', 'Moon Viewing Ceremony'], ['1F4B4', 'Yen Banknote'], ['1F4B5', 'Dollar Banknote'], ['1F4B6', 'Euro Banknote'], ['1F4B7', 'Pound Banknote'], ['1F5FF', 'Moai'], ['1F6C2', 'Passport Control'], ['1F6C3', 'Customs'], ['1F6C4', 'Baggage Claim'], ['1F6C5', 'Left Luggage']],
			objects: [['2620', 'Skull and Crossbones'], ['1F6C0', 'Person Taking Bath'], ['1F6CC', 'Person in Bed'], ['1F48C', 'Love Letter'], ['1F4A3', 'Bomb'], ['1F573', 'Hole'], ['1F6CD', 'Shopping Bags'], ['1F4FF', 'Prayer Beads'], ['1F48E', 'Gem Stone'], ['1F52A', 'Kitchen Knife'], ['1F3FA', 'Amphora'], ['1F5FA', 'World Map'], ['1F488', 'Barber Pole'], ['1F5BC', 'Framed Picture'], ['1F6CE', 'Bellhop Bell'], ['1F6AA', 'Door'], ['1F6CF', 'Bed'], ['1F6CB', 'Couch and Lamp'], ['1F6BD', 'Toilet'], ['1F6BF', 'Shower'], ['1F6C1', 'Bathtub'], ['231B', 'Hourglass'], ['23F3', 'Hourglass With Flowing Sand'], ['231A', 'Watch'], ['23F0', 'Alarm Clock'], ['23F1', 'Stopwatch'], ['23F2', 'Timer Clock'], ['1F570', 'Mantelpiece Clock'], ['1F321', 'Thermometer'], ['26F1', 'Umbrella on Ground'], ['1F388', 'Balloon'], ['1F389', 'Party Popper'], ['1F38A', 'Confetti Ball'], ['1F38E', 'Japanese Dolls'], ['1F38F', 'Carp Streamer'], ['1F390', 'Wind Chime'], ['1F380', 'Ribbon'], ['1F381', 'Wrapped Gift'], ['1F579', 'Joystick'], ['1F4EF', 'Postal Horn'], ['1F399', 'Studio Microphone'], ['1F39A', 'Level Slider'], ['1F39B', 'Control Knobs'], ['1F4FB', 'Radio'], ['1F4F1', 'Mobile Phone'], ['1F4F2', 'Mobile Phone With Arrow'], ['260E', 'Telephone'], ['1F4DE', 'Telephone Receiver'], ['1F4DF', 'Pager'], ['1F4E0', 'Fax Machine'], ['1F50B', 'Battery'], ['1F50C', 'Electric Plug'], ['1F4BB', 'Laptop Computer'], ['1F5A5', 'Desktop Computer'], ['1F5A8', 'Printer'], ['2328', 'Keyboard'], ['1F5B1', 'Computer Mouse'], ['1F5B2', 'Trackball'], ['1F4BD', 'Computer Disk'], ['1F4BE', 'Floppy Disk'], ['1F4BF', 'Optical Disk'], ['1F4C0', 'DVD'], ['1F3A5', 'Movie Camera'], ['1F39E', 'Film Frames'], ['1F4FD', 'Film Projector'], ['1F4FA', 'Television'], ['1F4F7', 'Camera'], ['1F4F8', 'Camera With Flash'], ['1F4F9', 'Video Camera'], ['1F4FC', 'Videocassette'], ['1F50D', 'Left-Pointing Magnifying Glass'], ['1F50E', 'Right-Pointing Magnifying Glass'], ['1F52C', 'Microscope'], ['1F52D', 'Telescope'], ['1F4E1', 'Satellite Antenna'], ['1F56F', 'Candle'], ['1F4A1', 'Light Bulb'], ['1F526', 'Flashlight'], ['1F3EE', 'Red Paper Lantern'], ['1F4D4', 'Notebook With Decorative Cover'], ['1F4D5', 'Closed Book'], ['1F4D6', 'Open Book'], ['1F4D7', 'Green Book'], ['1F4D8', 'Blue Book'], ['1F4D9', 'Orange Book'], ['1F4DA', 'Books'], ['1F4D3', 'Notebook'], ['1F4C3', 'Page With Curl'], ['1F4DC', 'Scroll'], ['1F4C4', 'Page Facing Up'], ['1F4F0', 'Newspaper'], ['1F5DE', 'Rolled-Up Newspaper'], ['1F4D1', 'Bookmark Tabs'], ['1F516', 'Bookmark'], ['1F3F7', 'Label'], ['1F4B0', 'Money Bag'], ['1F4B4', 'Yen Banknote'], ['1F4B5', 'Dollar Banknote'], ['1F4B6', 'Euro Banknote'], ['1F4B7', 'Pound Banknote'], ['1F4B8', 'Money With Wings'], ['1F4B3', 'Credit Card'], ['2709', 'Envelope'], ['1F4E7', 'E-Mail'], ['1F4E8', 'Incoming Envelope'], ['1F4E9', 'Envelope With Arrow'], ['1F4E4', 'Outbox Tray'], ['1F4E5', 'Inbox Tray'], ['1F4E6', 'Package'], ['1F4EB', 'Closed Mailbox With Raised Flag'], ['1F4EA', 'Closed Mailbox With Lowered Flag'], ['1F4EC', 'Open Mailbox With Raised Flag'], ['1F4ED', 'Open Mailbox With Lowered Flag'], ['1F4EE', 'Postbox'], ['1F5F3', 'Ballot Box With Ballot'], ['270F', 'Pencil'], ['2712', 'Black Nib'], ['1F58B', 'Fountain Pen'], ['1F58A', 'Pen'], ['1F58C', 'Paintbrush'], ['1F58D', 'Crayon'], ['1F4DD', 'Memo'], ['1F4C1', 'File Folder'], ['1F4C2', 'Open File Folder'], ['1F5C2', 'Card Index Dividers'], ['1F4C5', 'Calendar'], ['1F4C6', 'Tear-Off Calendar'], ['1F5D2', 'Spiral Notepad'], ['1F5D3', 'Spiral Calendar'], ['1F4C7', 'Card Index'], ['1F4C8', 'Chart Increasing'], ['1F4C9', 'Chart Decreasing'], ['1F4CA', 'Bar Chart'], ['1F4CB', 'Clipboard'], ['1F4CC', 'Pushpin'], ['1F4CD', 'Round Pushpin'], ['1F4CE', 'Paperclip'], ['1F587', 'Linked Paperclips'], ['1F4CF', 'Straight Ruler'], ['1F4D0', 'Triangular Ruler'], ['2702', 'Scissors'], ['1F5C3', 'Card File Box'], ['1F5C4', 'File Cabinet'], ['1F5D1', 'Wastebasket'], ['1F512', 'Locked'], ['1F513', 'Unlocked'], ['1F50F', 'Locked With Pen'], ['1F510', 'Locked With Key'], ['1F511', 'Key'], ['1F5DD', 'Old Key'], ['1F528', 'Hammer'], ['26CF', 'Pick'], ['2692', 'Hammer and Pick'], ['1F6E0', 'Hammer and Wrench'], ['1F5E1', 'Dagger'], ['2694', 'Crossed Swords'], ['1F52B', 'Pistol'], ['1F6E1', 'Shield'], ['1F527', 'Wrench'], ['1F529', 'Nut and Bolt'], ['2699', 'Gear'], ['1F5DC', 'Clamp'], ['2697', 'Alembic'], ['2696', 'Balance Scale'], ['1F517', 'Link'], ['26D3', 'Chains'], ['1F489', 'Syringe'], ['1F48A', 'Pill'], ['1F6AC', 'Cigarette'], ['26B0', 'Coffin'], ['26B1', 'Funeral Urn'], ['1F5FF', 'Moai'], ['1F6E2', 'Oil Drum'], ['1F52E', 'Crystal Ball'], ['1F6B0', 'Potable Water'], ['1F3C1', 'Chequered Flag'], ['1F6A9', 'Triangular Flag'], ['1F38C', 'Crossed Flags'], ['1F3F4', 'Black Flag'], ['1F3F3', 'White Flag'], ['1F3F3;&#xFE0F;&#x200D;&#x1F308', 'Rainbow Flag']],
			symbols: [['1F441;&#xFE0F;&#x200D;&#x1F5E8;&#xFE0F', 'Eye in Speech Bubble'], ['1F498', 'Heart With Arrow'], ['2764', 'Red Heart'], ['1F493', 'Beating Heart'], ['1F494', 'Broken Heart'], ['1F495', 'Two Hearts'], ['1F496', 'Sparkling Heart'], ['1F497', 'Growing Heart'], ['1F499', 'Blue Heart'], ['1F49A', 'Green Heart'], ['1F49B', 'Yellow Heart'], ['1F49C', 'Purple Heart'], ['1F5A4', 'Black Heart'], ['1F49D', 'Heart With Ribbon'], ['1F49E', 'Revolving Hearts'], ['1F49F', 'Heart Decoration'], ['2763', 'Heavy Heart Exclamation'], ['1F4A4', 'Zzz'], ['1F4A2', 'Anger Symbol'], ['1F4AC', 'Speech Balloon'], ['1F5EF', 'Right Anger Bubble'], ['1F4AD', 'Thought Balloon'], ['1F4AE', 'White Flower'], ['2668', 'Hot Springs'], ['1F488', 'Barber Pole'], ['1F6D1', 'Stop Sign'], ['1F55B', 'Twelve O’clock'], ['1F567', 'Twelve-Thirty'], ['1F550', 'One O’clock'], ['1F55C', 'One-Thirty'], ['1F551', 'Two O’clock'], ['1F55D', 'Two-Thirty'], ['1F552', 'Three O’clock'], ['1F55E', 'Three-Thirty'], ['1F553', 'Four O’clock'], ['1F55F', 'Four-Thirty'], ['1F554', 'Five O’clock'], ['1F560', 'Five-Thirty'], ['1F555', 'Six O’clock'], ['1F561', 'Six-Thirty'], ['1F556', 'Seven O’clock'], ['1F562', 'Seven-Thirty'], ['1F557', 'Eight O’clock'], ['1F563', 'Eight-Thirty'], ['1F558', 'Nine O’clock'], ['1F564', 'Nine-Thirty'], ['1F559', 'Ten O’clock'], ['1F565', 'Ten-Thirty'], ['1F55A', 'Eleven O’clock'], ['1F566', 'Eleven-Thirty'], ['1F300', 'Cyclone'], ['2660', 'Spade Suit'], ['2665', 'Heart Suit'], ['2666', 'Diamond Suit'], ['2663', 'Club Suit'], ['1F0CF', 'Joker'], ['1F004', 'Mahjong Red Dragon'], ['1F3B4', 'Flower Playing Cards'], ['1F507', 'Muted Speaker'], ['1F508', 'Speaker Low Volume'], ['1F509', 'Speaker Medium Volume'], ['1F50A', 'Speaker High Volume'], ['1F4E2', 'Loudspeaker'], ['1F4E3', 'Megaphone'], ['1F4EF', 'Postal Horn'], ['1F514', 'Bell'], ['1F515', 'Bell With Slash'], ['1F3B5', 'Musical Note'], ['1F3B6', 'Musical Notes'], ['1F3E7', 'Atm Sign'], ['1F6AE', 'Litter in Bin Sign'], ['1F6B0', 'Potable Water'], ['267F', 'Wheelchair Symbol'], ['1F6B9', 'Men’s Room'], ['1F6BA', 'Women’s Room'], ['1F6BB', 'Restroom'], ['1F6BC', 'Baby Symbol'], ['1F6BE', 'Water Closet'], ['26A0', 'Warning'], ['1F6B8', 'Children Crossing'], ['26D4', 'No Entry'], ['1F6AB', 'Prohibited'], ['1F6B3', 'No Bicycles'], ['1F6AD', 'No Smoking'], ['1F6AF', 'No Littering'], ['1F6B1', 'Non-Potable Water'], ['1F6B7', 'No Pedestrians'], ['1F51E', 'No One Under Eighteen'], ['2622', 'Radioactive'], ['2623', 'Biohazard'], ['2B06', 'Up Arrow'], ['2197', 'Up-Right Arrow'], ['27A1', 'Right Arrow'], ['2198', 'Down-Right Arrow'], ['2B07', 'Down Arrow'], ['2199', 'Down-Left Arrow'], ['2B05', 'Left Arrow'], ['2196', 'Up-Left Arrow'], ['2195', 'Up-Down Arrow'], ['2194', 'Left-Right Arrow'], ['21A9', 'Right Arrow Curving Left'], ['21AA', 'Left Arrow Curving Right'], ['2934', 'Right Arrow Curving Up'], ['2935', 'Right Arrow Curving Down'], ['1F503', 'Clockwise Vertical Arrows'], ['1F504', 'Anticlockwise Arrows Button'], ['1F519', 'Back Arrow'], ['1F51A', 'End Arrow'], ['1F51B', 'On! Arrow'], ['1F51C', 'Soon Arrow'], ['1F51D', 'Top Arrow'], ['1F6D0', 'Place of Worship'], ['269B', 'Atom Symbol'], ['1F549', 'Om'], ['2721', 'Star of David'], ['2638', 'Wheel of Dharma'], ['262F', 'Yin Yang'], ['271D', 'Latin Cross'], ['2626', 'Orthodox Cross'], ['262A', 'Star and Crescent'], ['262E', 'Peace Symbol'], ['1F54E', 'Menorah'], ['1F52F', 'Dotted Six-Pointed Star'], ['2648', 'Aries'], ['2649', 'Taurus'], ['264A', 'Gemini'], ['264B', 'Cancer'], ['264C', 'Leo'], ['264D', 'Virgo'], ['264E', 'Libra'], ['264F', 'Scorpius'], ['2650', 'Sagittarius'], ['2651', 'Capricorn'], ['2652', 'Aquarius'], ['2653', 'Pisces'], ['26CE', 'Ophiuchus'], ['1F500', 'Shuffle Tracks Button'], ['1F501', 'Repeat Button'], ['1F502', 'Repeat Single Button'], ['25B6', 'Play Button'], ['23E9', 'Fast-Forward Button'], ['25C0', 'Reverse Button'], ['23EA', 'Fast Reverse Button'], ['1F53C', 'Up Button'], ['23EB', 'Fast Up Button'], ['1F53D', 'Down Button'], ['23EC', 'Fast Down Button'], ['23F9', 'Stop Button'], ['1F3A6', 'Cinema'], ['1F505', 'Dim Button'], ['1F506', 'Bright Button'], ['1F4F6', 'Antenna Bars'], ['1F4F3', 'Vibration Mode'], ['1F4F4', 'Mobile Phone Off'], ['267B', 'Recycling Symbol'], ['1F531', 'Trident Emblem'], ['1F4DB', 'Name Badge'], ['1F530', 'Japanese Symbol for Beginner'], ['2B55', 'Heavy Large Circle'], ['2705', 'White Heavy Check Mark'], ['2611', 'Ballot Box With Check'], ['2714', 'Heavy Check Mark'], ['2716', 'Heavy Multiplication X'], ['274C', 'Cross Mark'], ['274E', 'Cross Mark Button'], ['2795', 'Heavy Plus Sign'], ['2796', 'Heavy Minus Sign'], ['2797', 'Heavy Division Sign'], ['27B0', 'Curly Loop'], ['27BF', 'Double Curly Loop'], ['303D', 'Part Alternation Mark'], ['2733', 'Eight-Spoked Asterisk'], ['2734', 'Eight-Pointed Star'], ['2747', 'Sparkle'], ['203C', 'Double Exclamation Mark'], ['2049', 'Exclamation Question Mark'], ['2753', 'Question Mark'], ['2754', 'White Question Mark'], ['2755', 'White Exclamation Mark'], ['2757', 'Exclamation Mark'], ['A9', 'Copyright'], ['AE', 'Registered'], ['2122', 'Trade Mark'], ['23;&#xFE0F;&#x20E3', 'Keycap Number Sign'], ['30;&#xFE0F;&#x20E3', 'Keycap Digit Zero'], ['31;&#xFE0F;&#x20E3', 'Keycap Digit One'], ['32;&#xFE0F;&#x20E3', 'Keycap Digit Two'], ['33;&#xFE0F;&#x20E3', 'Keycap Digit Three'], ['34;&#xFE0F;&#x20E3', 'Keycap Digit Four'], ['35;&#xFE0F;&#x20E3', 'Keycap Digit Five'], ['36;&#xFE0F;&#x20E3', 'Keycap Digit Six'], ['37;&#xFE0F;&#x20E3', 'Keycap Digit Seven'], ['38;&#xFE0F;&#x20E3', 'Keycap Digit Eight'], ['39;&#xFE0F;&#x20E3', 'Keycap Digit Nine'], ['1F51F', 'Keycap 10'], ['1F4AF', 'Hundred Points'], ['1F520', 'Input Latin Uppercase'], ['1F521', 'Input Latin Lowercase'], ['1F522', 'Input Numbers'], ['1F523', 'Input Symbols'], ['1F524', 'Input Latin Letters'], ['1F170', 'A Button (blood Type)'], ['1F18E', 'Ab Button (blood Type)'], ['1F171', 'B Button (blood Type)'], ['1F191', 'CL Button'], ['1F192', 'Cool Button'], ['1F193', 'Free Button'], ['2139', 'Information'], ['1F194', 'ID Button'], ['24C2', 'Circled M'], ['1F195', 'New Button'], ['1F196', 'NG Button'], ['1F17E', 'O Button (blood Type)'], ['1F197', 'OK Button'], ['1F17F', 'P Button'], ['1F198', 'SOS Button'], ['1F199', 'Up! Button'], ['1F19A', 'Vs Button'], ['1F201', 'Japanese “here” Button'], ['1F202', 'Japanese “service Charge” Button'], ['1F237', 'Japanese “monthly Amount” Button'], ['1F236', 'Japanese “not Free of Charge” Button'], ['1F22F', 'Japanese “reserved” Button'], ['1F250', 'Japanese “bargain” Button'], ['1F239', 'Japanese “discount” Button'], ['1F21A', 'Japanese “free of Charge” Button'], ['1F232', 'Japanese “prohibited” Button'], ['1F251', 'Japanese “acceptable” Button'], ['1F238', 'Japanese “application” Button'], ['1F234', 'Japanese “passing Grade” Button'], ['1F233', 'Japanese “vacancy” Button'], ['3297', 'Japanese “congratulations” Button'], ['3299', 'Japanese “secret” Button'], ['1F23A', 'Japanese “open for Business” Button'], ['1F235', 'Japanese “no Vacancy” Button'], ['25AA', 'Black Small Square'], ['25AB', 'White Small Square'], ['25FB', 'White Medium Square'], ['25FC', 'Black Medium Square'], ['25FD', 'White Medium-Small Square'], ['25FE', 'Black Medium-Small Square'], ['2B1B', 'Black Large Square'], ['2B1C', 'White Large Square'], ['1F536', 'Large Orange Diamond'], ['1F537', 'Large Blue Diamond'], ['1F538', 'Small Orange Diamond'], ['1F539', 'Small Blue Diamond'], ['1F53A', 'Red Triangle Pointed Up'], ['1F53B', 'Red Triangle Pointed Down'], ['1F4A0', 'Diamond With a Dot'], ['1F532', 'Black Square Button'], ['1F533', 'White Square Button'], ['26AA', 'White Circle'], ['26AB', 'Black Circle'], ['1F534', 'Red Circle'], ['1F535', 'Blue Circle']],
			flags: [['1F3C1', 'Chequered Flag'], ['1F6A9', 'Triangular Flag'], ['1F38C', 'Crossed Flags'], ['1F3F4', 'Black Flag'], ['1F3F3', 'White Flag'], ['1F3F3;&#xFE0F;&#x200D;&#x1F308', 'Rainbow Flag'], ['1F1E6;&#x1F1E8', 'Ascension Island'], ['1F1E6;&#x1F1E9', 'Andorra'], ['1F1E6;&#x1F1EA', 'United Arab Emirates'], ['1F1E6;&#x1F1EB', 'Afghanistan'], ['1F1E6;&#x1F1EC', 'Antigua & Barbuda'], ['1F1E6;&#x1F1EE', 'Anguilla'], ['1F1E6;&#x1F1F1', 'Albania'], ['1F1E6;&#x1F1F2', 'Armenia'], ['1F1E6;&#x1F1F4', 'Angola'], ['1F1E6;&#x1F1F6', 'Antarctica'], ['1F1E6;&#x1F1F7', 'Argentina'], ['1F1E6;&#x1F1F8', 'American Samoa'], ['1F1E6;&#x1F1F9', 'Austria'], ['1F1E6;&#x1F1FA', 'Australia'], ['1F1E6;&#x1F1FC', 'Aruba'], ['1F1E6;&#x1F1FD', 'Åland Islands'], ['1F1E6;&#x1F1FF', 'Azerbaijan'], ['1F1E7;&#x1F1E6', 'Bosnia & Herzegovina'], ['1F1E7;&#x1F1E7', 'Barbados'], ['1F1E7;&#x1F1E9', 'Bangladesh'], ['1F1E7;&#x1F1EA', 'Belgium'], ['1F1E7;&#x1F1EB', 'Burkina Faso'], ['1F1E7;&#x1F1EC', 'Bulgaria'], ['1F1E7;&#x1F1ED', 'Bahrain'], ['1F1E7;&#x1F1EE', 'Burundi'], ['1F1E7;&#x1F1EF', 'Benin'], ['1F1E7;&#x1F1F1', 'St. Barthélemy'], ['1F1E7;&#x1F1F2', 'Bermuda'], ['1F1E7;&#x1F1F3', 'Brunei'], ['1F1E7;&#x1F1F4', 'Bolivia'], ['1F1E7;&#x1F1F6', 'Caribbean Netherlands'], ['1F1E7;&#x1F1F7', 'Brazil'], ['1F1E7;&#x1F1F8', 'Bahamas'], ['1F1E7;&#x1F1F9', 'Bhutan'], ['1F1E7;&#x1F1FB', 'Bouvet Island'], ['1F1E7;&#x1F1FC', 'Botswana'], ['1F1E7;&#x1F1FE', 'Belarus'], ['1F1E7;&#x1F1FF', 'Belize'], ['1F1E8;&#x1F1E6', 'Canada'], ['1F1E8;&#x1F1E8', 'Cocos (Keeling) Islands'], ['1F1E8;&#x1F1E9', 'Congo - Kinshasa'], ['1F1E8;&#x1F1EB', 'Central African Republic'], ['1F1E8;&#x1F1EC', 'Congo - Brazzaville'], ['1F1E8;&#x1F1ED', 'Switzerland'], ['1F1E8;&#x1F1EE', 'Côte D’Ivoire'], ['1F1E8;&#x1F1F0', 'Cook Islands'], ['1F1E8;&#x1F1F1', 'Chile'], ['1F1E8;&#x1F1F2', 'Cameroon'], ['1F1E8;&#x1F1F3', 'China'], ['1F1E8;&#x1F1F4', 'Colombia'], ['1F1E8;&#x1F1F5', 'Clipperton Island'], ['1F1E8;&#x1F1F7', 'Costa Rica'], ['1F1E8;&#x1F1FA', 'Cuba'], ['1F1E8;&#x1F1FB', 'Cape Verde'], ['1F1E8;&#x1F1FC', 'Curaçao'], ['1F1E8;&#x1F1FD', 'Christmas Island'], ['1F1E8;&#x1F1FE', 'Cyprus'], ['1F1E8;&#x1F1FF', 'Czechia'], ['1F1E9;&#x1F1EA', 'Germany'], ['1F1E9;&#x1F1EC', 'Diego Garcia'], ['1F1E9;&#x1F1EF', 'Djibouti'], ['1F1E9;&#x1F1F0', 'Denmark'], ['1F1E9;&#x1F1F2', 'Dominica'], ['1F1E9;&#x1F1F4', 'Dominican Republic'], ['1F1E9;&#x1F1FF', 'Algeria'], ['1F1EA;&#x1F1E6', 'Ceuta & Melilla'], ['1F1EA;&#x1F1E8', 'Ecuador'], ['1F1EA;&#x1F1EA', 'Estonia'], ['1F1EA;&#x1F1EC', 'Egypt'], ['1F1EA;&#x1F1ED', 'Western Sahara'], ['1F1EA;&#x1F1F7', 'Eritrea'], ['1F1EA;&#x1F1F8', 'Spain'], ['1F1EA;&#x1F1F9', 'Ethiopia'], ['1F1EA;&#x1F1FA', 'European Union'], ['1F1EB;&#x1F1EE', 'Finland'], ['1F1EB;&#x1F1EF', 'Fiji'], ['1F1EB;&#x1F1F0', 'Falkland Islands'], ['1F1EB;&#x1F1F2', 'Micronesia'], ['1F1EB;&#x1F1F4', 'Faroe Islands'], ['1F1EB;&#x1F1F7', 'France'], ['1F1EC;&#x1F1E6', 'Gabon'], ['1F1EC;&#x1F1E7', 'United Kingdom'], ['1F1EC;&#x1F1E9', 'Grenada'], ['1F1EC;&#x1F1EA', 'Georgia'], ['1F1EC;&#x1F1EB', 'French Guiana'], ['1F1EC;&#x1F1EC', 'Guernsey'], ['1F1EC;&#x1F1ED', 'Ghana'], ['1F1EC;&#x1F1EE', 'Gibraltar'], ['1F1EC;&#x1F1F1', 'Greenland'], ['1F1EC;&#x1F1F2', 'Gambia'], ['1F1EC;&#x1F1F3', 'Guinea'], ['1F1EC;&#x1F1F5', 'Guadeloupe'], ['1F1EC;&#x1F1F6', 'Equatorial Guinea'], ['1F1EC;&#x1F1F7', 'Greece'], ['1F1EC;&#x1F1F8', 'South Georgia & South Sandwich Islands'], ['1F1EC;&#x1F1F9', 'Guatemala'], ['1F1EC;&#x1F1FA', 'Guam'], ['1F1EC;&#x1F1FC', 'Guinea-Bissau'], ['1F1EC;&#x1F1FE', 'Guyana'], ['1F1ED;&#x1F1F0', 'Hong Kong Sar China'], ['1F1ED;&#x1F1F2', 'Heard & Mcdonald Islands'], ['1F1ED;&#x1F1F3', 'Honduras'], ['1F1ED;&#x1F1F7', 'Croatia'], ['1F1ED;&#x1F1F9', 'Haiti'], ['1F1ED;&#x1F1FA', 'Hungary'], ['1F1EE;&#x1F1E8', 'Canary Islands'], ['1F1EE;&#x1F1E9', 'Indonesia'], ['1F1EE;&#x1F1EA', 'Ireland'], ['1F1EE;&#x1F1F1', 'Israel'], ['1F1EE;&#x1F1F2', 'Isle of Man'], ['1F1EE;&#x1F1F3', 'India'], ['1F1EE;&#x1F1F4', 'British Indian Ocean Territory'], ['1F1EE;&#x1F1F6', 'Iraq'], ['1F1EE;&#x1F1F7', 'Iran'], ['1F1EE;&#x1F1F8', 'Iceland'], ['1F1EE;&#x1F1F9', 'Italy'], ['1F1EF;&#x1F1EA', 'Jersey'], ['1F1EF;&#x1F1F2', 'Jamaica'], ['1F1EF;&#x1F1F4', 'Jordan'], ['1F1EF;&#x1F1F5', 'Japan'], ['1F1F0;&#x1F1EA', 'Kenya'], ['1F1F0;&#x1F1EC', 'Kyrgyzstan'], ['1F1F0;&#x1F1ED', 'Cambodia'], ['1F1F0;&#x1F1EE', 'Kiribati'], ['1F1F0;&#x1F1F2', 'Comoros'], ['1F1F0;&#x1F1F3', 'St. Kitts & Nevis'], ['1F1F0;&#x1F1F5', 'North Korea'], ['1F1F0;&#x1F1F7', 'South Korea'], ['1F1F0;&#x1F1FC', 'Kuwait'], ['1F1F0;&#x1F1FE', 'Cayman Islands'], ['1F1F0;&#x1F1FF', 'Kazakhstan'], ['1F1F1;&#x1F1E6', 'Laos'], ['1F1F1;&#x1F1E7', 'Lebanon'], ['1F1F1;&#x1F1E8', 'St. Lucia'], ['1F1F1;&#x1F1EE', 'Liechtenstein'], ['1F1F1;&#x1F1F0', 'Sri Lanka'], ['1F1F1;&#x1F1F7', 'Liberia'], ['1F1F1;&#x1F1F8', 'Lesotho'], ['1F1F1;&#x1F1F9', 'Lithuania'], ['1F1F1;&#x1F1FA', 'Luxembourg'], ['1F1F1;&#x1F1FB', 'Latvia'], ['1F1F1;&#x1F1FE', 'Libya'], ['1F1F2;&#x1F1E6', 'Morocco'], ['1F1F2;&#x1F1E8', 'Monaco'], ['1F1F2;&#x1F1E9', 'Moldova'], ['1F1F2;&#x1F1EA', 'Montenegro'], ['1F1F2;&#x1F1EB', 'St. Martin'], ['1F1F2;&#x1F1EC', 'Madagascar'], ['1F1F2;&#x1F1ED', 'Marshall Islands'], ['1F1F2;&#x1F1F0', 'Macedonia'], ['1F1F2;&#x1F1F1', 'Mali'], ['1F1F2;&#x1F1F2', 'Myanmar (Burma)'], ['1F1F2;&#x1F1F3', 'Mongolia'], ['1F1F2;&#x1F1F4', 'Macau Sar China'], ['1F1F2;&#x1F1F5', 'Northern Mariana Islands'], ['1F1F2;&#x1F1F6', 'Martinique'], ['1F1F2;&#x1F1F7', 'Mauritania'], ['1F1F2;&#x1F1F8', 'Montserrat'], ['1F1F2;&#x1F1F9', 'Malta'], ['1F1F2;&#x1F1FA', 'Mauritius'], ['1F1F2;&#x1F1FB', 'Maldives'], ['1F1F2;&#x1F1FC', 'Malawi'], ['1F1F2;&#x1F1FD', 'Mexico'], ['1F1F2;&#x1F1FE', 'Malaysia'], ['1F1F2;&#x1F1FF', 'Mozambique'], ['1F1F3;&#x1F1E6', 'Namibia'], ['1F1F3;&#x1F1E8', 'New Caledonia'], ['1F1F3;&#x1F1EA', 'Niger'], ['1F1F3;&#x1F1EB', 'Norfolk Island'], ['1F1F3;&#x1F1EC', 'Nigeria'], ['1F1F3;&#x1F1EE', 'Nicaragua'], ['1F1F3;&#x1F1F1', 'Netherlands'], ['1F1F3;&#x1F1F4', 'Norway'], ['1F1F3;&#x1F1F5', 'Nepal'], ['1F1F3;&#x1F1F7', 'Nauru'], ['1F1F3;&#x1F1FA', 'Niue'], ['1F1F3;&#x1F1FF', 'New Zealand'], ['1F1F4;&#x1F1F2', 'Oman'], ['1F1F5;&#x1F1E6', 'Panama'], ['1F1F5;&#x1F1EA', 'Peru'], ['1F1F5;&#x1F1EB', 'French Polynesia'], ['1F1F5;&#x1F1EC', 'Papua New Guinea'], ['1F1F5;&#x1F1ED', 'Philippines'], ['1F1F5;&#x1F1F0', 'Pakistan'], ['1F1F5;&#x1F1F1', 'Poland'], ['1F1F5;&#x1F1F2', 'St. Pierre & Miquelon'], ['1F1F5;&#x1F1F3', 'Pitcairn Islands'], ['1F1F5;&#x1F1F7', 'Puerto Rico'], ['1F1F5;&#x1F1F8', 'Palestinian Territories'], ['1F1F5;&#x1F1F9', 'Portugal'], ['1F1F5;&#x1F1FC', 'Palau'], ['1F1F5;&#x1F1FE', 'Paraguay'], ['1F1F6;&#x1F1E6', 'Qatar'], ['1F1F7;&#x1F1EA', 'Réunion'], ['1F1F7;&#x1F1F4', 'Romania'], ['1F1F7;&#x1F1F8', 'Serbia'], ['1F1F7;&#x1F1FA', 'Russia'], ['1F1F7;&#x1F1FC', 'Rwanda'], ['1F1F8;&#x1F1E6', 'Saudi Arabia'], ['1F1F8;&#x1F1E7', 'Solomon Islands'], ['1F1F8;&#x1F1E8', 'Seychelles'], ['1F1F8;&#x1F1E9', 'Sudan'], ['1F1F8;&#x1F1EA', 'Sweden'], ['1F1F8;&#x1F1EC', 'Singapore'], ['1F1F8;&#x1F1ED', 'St. Helena'], ['1F1F8;&#x1F1EE', 'Slovenia'], ['1F1F8;&#x1F1EF', 'Svalbard & Jan Mayen'], ['1F1F8;&#x1F1F0', 'Slovakia'], ['1F1F8;&#x1F1F1', 'Sierra Leone'], ['1F1F8;&#x1F1F2', 'San Marino'], ['1F1F8;&#x1F1F3', 'Senegal'], ['1F1F8;&#x1F1F4', 'Somalia'], ['1F1F8;&#x1F1F7', 'Suriname'], ['1F1F8;&#x1F1F8', 'South Sudan'], ['1F1F8;&#x1F1F9', 'São Tomé & Príncipe'], ['1F1F8;&#x1F1FB', 'El Salvador'], ['1F1F8;&#x1F1FD', 'Sint Maarten'], ['1F1F8;&#x1F1FE', 'Syria'], ['1F1F8;&#x1F1FF', 'Swaziland'], ['1F1F9;&#x1F1E6', 'Tristan Da Cunha'], ['1F1F9;&#x1F1E8', 'Turks & Caicos Islands'], ['1F1F9;&#x1F1E9', 'Chad'], ['1F1F9;&#x1F1EB', 'French Southern Territories'], ['1F1F9;&#x1F1EC', 'Togo'], ['1F1F9;&#x1F1ED', 'Thailand'], ['1F1F9;&#x1F1EF', 'Tajikistan'], ['1F1F9;&#x1F1F0', 'Tokelau'], ['1F1F9;&#x1F1F1', 'Timor-Leste'], ['1F1F9;&#x1F1F2', 'Turkmenistan'], ['1F1F9;&#x1F1F3', 'Tunisia'], ['1F1F9;&#x1F1F4', 'Tonga'], ['1F1F9;&#x1F1F7', 'Turkey'], ['1F1F9;&#x1F1F9', 'Trinidad & Tobago'], ['1F1F9;&#x1F1FB', 'Tuvalu'], ['1F1F9;&#x1F1FC', 'Taiwan'], ['1F1F9;&#x1F1FF', 'Tanzania'], ['1F1FA;&#x1F1E6', 'Ukraine'], ['1F1FA;&#x1F1EC', 'Uganda'], ['1F1FA;&#x1F1F2', 'U.S. Outlying Islands'], ['1F1FA;&#x1F1F3', 'United Nations'], ['1F1FA;&#x1F1F8', 'United States'], ['1F1FA;&#x1F1FE', 'Uruguay'], ['1F1FA;&#x1F1FF', 'Uzbekistan'], ['1F1FB;&#x1F1E6', 'Vatican City'], ['1F1FB;&#x1F1E8', 'St. Vincent & Grenadines'], ['1F1FB;&#x1F1EA', 'Venezuela'], ['1F1FB;&#x1F1EC', 'British Virgin Islands'], ['1F1FB;&#x1F1EE', 'U.S. Virgin Islands'], ['1F1FB;&#x1F1F3', 'Vietnam'], ['1F1FB;&#x1F1FA', 'Vanuatu'], ['1F1FC;&#x1F1EB', 'Wallis & Futuna'], ['1F1FC;&#x1F1F8', 'Samoa'], ['1F1FD;&#x1F1F0', 'Kosovo'], ['1F1FE;&#x1F1EA', 'Yemen'], ['1F1FE;&#x1F1F9', 'Mayotte'], ['1F1FF;&#x1F1E6', 'South Africa'], ['1F1FF;&#x1F1F2', 'Zambia'], ['1F1FF;&#x1F1FC', 'Zimbabwe'], ['1F3F4;&#xE0067;&#xE0062;&#xE0065;&#xE006E;&#xE0067;&#xE007F', 'Flag for England (GB-ENG)'], ['1F3F4;&#xE0067;&#xE0062;&#xE0073;&#xE0063;&#xE0074;&#xE007F', 'Flag for Scotland (GB-SCT)'], ['1F3F4;&#xE0067;&#xE0062;&#xE0077;&#xE006C;&#xE0073;&#xE007F', 'Flag for Wales (GB-WLS)'], ['1F3F4;&#x200D;&#x2620;&#xFE0F', 'Pirate Flag']],
			dingbatsAndMore: (function () {
				var base = ['1f4b9', '1f4b2', '1f4b1', 'a9', 'ae', '1f518', '3030', '2588', '2318'], more = [[0x2600, 0x2647], [0x2654, 0x266F], [0xb0, 0xb0]], i;

				more.forEach(function (range) {
					for (i = range[0]; i <= range[1]; i++) {
						base.push(i.toString(16));
					}
				});

				return base;
			}())
		},
		events: {
			toolbar: function (e, parent) {
				e.preventDefault();

				if (e.target.classList.contains('gm_emoji_selected')) {
					return;
				}

				var css = '.gm_emoji_' + e.target.getAttribute('data-toolbar'), div = parent.querySelector(css);

				Array.from(parent.querySelectorAll('.gm_emoji_list a.gm_emoji_hidden')).forEach(function (e) {
					e.classList.remove('gm_emoji_hidden');
				});

				Array.from(parent.querySelectorAll('.gm_emoji_list:not(.gm_emoji_hidden):not(' + css + ')'))
					.forEach(function (e) { e.classList.add('gm_emoji_hidden'); });

				Array.from(parent.querySelectorAll('.gm_emoji_toolbar_button'))
					.forEach(function (e) { e.classList.remove('gm_emoji_selected'); });

				e.target.classList.add('gm_emoji_selected');
				div.classList.remove('gm_emoji_hidden');
			},
			search: function () {
				var title = this.value.trim(), reg, div = this.parentElement;

				Array.from(div.querySelectorAll('.gm_emoji_list.gm_emoji_hidden'))
					.forEach(function (e) { e.classList.remove('gm_emoji_hidden'); });

				if (title.length === 0) {
					Array.from(div.querySelectorAll('.gm_emoji_list a.gm_emoji_hidden')).forEach(function (e) {
						e.classList.remove('gm_emoji_hidden');
					});
				} else {
					reg = new RegExp(title, 'ig');

					Array.from(div.querySelectorAll('.gm_emoji_list a')).forEach(function (e) { // a:not([title*='${title}' i])
						if (reg.test(e.title)) {
							// console.log(e.title);
							e.classList.remove('gm_emoji_hidden');
						} else {
							e.classList.add('gm_emoji_hidden');
						}
					});

					div.querySelector('.gm_emoji_box').scrollTop = 0;
				}
			},
			insert: function (e, textarea) {
				var target = e.target.hasAttribute('data-char') ? e.target : e.target.parentElement, start, end, pre, post, point, emo, m;
				if (textarea.selectionStart < 0) { return; }
				if (target.hasAttribute('data-char')) {
					if (textarea.selectionEnd > textarea.value.length) {
						textarea.selectionEnd = textarea.value.length;
					}
					start = textarea.selectionStart || 0;
					end = textarea.selectionEnd || 0;
					pre = textarea.value.substring(0, start);

					point = ucs2decode(pre);
					point = point[point.length - 1] || 0;

					try {
						m = String.fromCodePoint(point).match(emoji.ranges);
						// console.log('pt:', String.fromCodePoint(point), point, m);
						emo = (point <= 32 || (m && m.length > 0) ? '' : ' ') + target.getAttribute('data-char');
					} catch (e) {
						// console.error(e);
						emo = (point <= 32 || point > 8500 ? '' : ' ') + target.getAttribute('data-char');
					}

					post = emo + textarea.value.substring(end);
					// console.log('pre:', pre, 'emo:', emo, 'post:', textarea.value.substring(end));
					textarea.value = pre + post;
					textarea.focus();
					textarea.setSelectionRange(start + emo.length, start + emo.length);
				}
			},
			wire: function (div, textarea) {
				div.addEventListener('click', function (e) {
					if (e.target.hasAttribute('data-toolbar')) {
						emoji.events.toolbar(e, div);
						return;
					}

					if (e.which === 1) {
						e.preventDefault();
						emoji.events.insert(e, textarea);
					}
				}, false);
			}
		},
		make: function (parent, textarea) {
			var div = $.e('div', { className: 'gm_emoji' });
			parent.appendChild(div);
			this.presentation.panel(div);
			this.events.wire(div, textarea);
		},
		css: (function () {

			dom.css('.gm_emoji_selected { opacity: .7; } .gm_emoji_toolbar_button { cursor: pointer; }');
			dom.css('.gm_emoji_hidden { display: none !important; }');
			dom.css('.gm_emoji_toolbar > div { display: inline-block; }');

			/* Windows Chromium Browser Emoji Fix
			 * Emoji in Chrome-based browsers!
			 *
			 * Modifies font-family to include fonts that display Emoji
			 *
			 * Windows 7 Users: Install Symbola.ttf if you do not see all Emoji
			 * Find it here: http://users.teilar.gr/~g1951d/
			 */
			if (window.chrome) { // && /(?:win)/i.test(navigator.platform)
				dom.css('.post, .postbit-post, .normal, textarea, input, .gm_emoji, a { font-family: "Helvetica Neue", sans-serif, "Apple Color Emoji", "Android Emoji", "Segoe UI Emoji", "Segoe UI Symbol", Symbola; }');
			}
		}())
	};

	// Quick Editor
	Editor = (function () {
		function Editor(el) {
			this.id = el.name.split('::')[2];
			this.show = 0;
			this.num = document.querySelector('a[href^="showpost.php?p=' + this.id + '&postcount="]').textContent; //.href.match(/(?:postcount=)(\d+)/)[1];
			this.dom(el);
			Editor.set[this.id] = this;
		}

		Editor.set = {};

		Editor.toggle = {
			displays : [
				['block', 'none', 'none'],
				['none', 'block', 'inline']
			],
			spin : ['none', 'inherit']
		};

		Editor.url = {
			gets  : 'ajax.php?do=quickedit&p=',
			posts : 'editpost.php?do=updatepost&postid=undefined'
		};

		Editor.fromLink = function (link) {
			link.textContent += '+';
			link.title = 'Quick Editor++';
			link.onclick = null;
			link.dataset.qqre = true;
			return new Editor(link);
		};

		Editor.fromOldLink = function (link) {
			return new Editor(link);
		};

		Editor.events = {
			quickEdit: function (e) {
				var qe;
				e.preventDefault();

				if (e.target && e.target.hasAttribute('data-qqre')) {
					qe = Editor.set[e.target.dataset.qqre] || Editor.fromOldLink(e.target);

					if (qe.x) {
						qe.toggle();
					} else {
						qe.gets();
					}
				}
			}
		};

		Editor.prototype = {
			constuctor: Editor,
			dom: function (el) {
				this.el = el;
				this.el.dataset.qqre = this.id;
				// this.el.addEventListener('click', Editor.events.quickEdit.bind(this), false);
				this.spin = document.getElementById('progress_' + this.id);
				this.post = document.getElementById('post_message_' + this.id);
				this.div = $.e('div', {className : 'inpost'}, this.post.parentNode);
			},
			gets: function () {
				this.x = new XMLHttpRequest();
				this.x.onprogress = bond(this, this.spinner)(true);
				this.x.open('POST', Editor.url.gets + this.id, true);
				this.x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //charset=UTF-8
				this.x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				this.x.onload = this.load.bind(this);
				this.x.onerror = this.error.bind(this);
				this.x.send('securitytoken=' + Form.token() + '&do=quickedit&p=' + this.id + '&editorid=vB_Editor_QE_1');
			},
			buildPost: function () {
				return [
					'securitytoken=',
					Form.token(),
					'&do=updatepost&ajax=1&postid=',
					this.id,
					'&wysiwyg=0&message=',
					$.uriHtmlEncode(this.div.querySelector('textarea').value),
					'&reason=',
					$.uriHtmlEncode(this.div.querySelector('input[name="reason"]').value),
					'&postcount=',
					this.num
				].join('');
			},
			posts : function (e) {
				e.preventDefault();
				var s = this.buildPost(); //.call(this);
				this.p = new XMLHttpRequest();
				this.p.open('POST', Editor.url.posts + this.id, true);
				this.p.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				this.p.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				this.p.setRequestHeader('Content-Length', s.length);
				this.p.onload = this.update.bind(this);
				this.p.onerror = this.error.bind(this);
				this.p.send(s);
			},
			toggle : function () {
				var toggle = Editor.toggle.displays[this.show];
				this.el.style.display = toggle[2];
				this.div.style.display = toggle[0];
				this.post.style.display = toggle[1];
				app.state.activeBox = this.show ? app.state.form.elements.message : this.text;
				this.show = Number(!this.show);
			},
			spinner : function (show) {
				this.spin.style.display = Editor.toggle.spin[Number(!!show)];
			},
			load: function () {
				var t = this.xmlhtml(this.x, 'editor', 'textarea'), f;
				if (t && t[0]) {
					f = new Form(this.id, this.div, t[0].value, false, true, t[1]);

					this.extra = new Extra(this.id, true);
					this.text = this.div.querySelector('textarea');

					this.div.querySelector('.cancel_button').addEventListener('click', this.toggle.bind(this), false);
					document.getElementById('vB_Editor_' + this.id + '_save').addEventListener('click', this.posts.bind(this), false);

					dom.js(';(function () { $vb_hook(' + this.id + '); }());');
				}
				this.spinner();
				this.toggle();
				return f;
			},
			update: function () {
				var post = this.xmlhtml(this.p, 'postbit', '.post');
				try {
					this.post.innerHTML = post[0].innerHTML;
					this.toggle();
				} catch (e) {} //console.log(e);
			},
			error : function () {
				alert('QQRE: Request failed.');
				this.spin.style.display = 'none';
				this.x = null;
			},
			xmlhtml : function (attr, b, selector) { // b may be unnecessary
				try {
					// console.log(attr, this[attr].responseXML);
					var div = $.e('div', {innerHTML: attr.responseText}), r = '';
					// div.innerHTML = attr.responseText;
					div = div.querySelector(b);
					try {
						r = div.querySelector('editor[reason]').getAttribute('reason');
					} catch (er) {}
					return [div.querySelector(selector), r];
				} catch (e) {}
			}
		};
		return Editor;
	}());

	// Form Maker
	Form = (function () {

		function Form(id, parent, message, title, edit, reason) {
			if (!id || !parent) { return; }

			this.id = id;
			this.el = parent;
			this.message = $.h(message || '');
			this.title = $.h(title || '');
			this.edit = !!edit;
			this.reason = $.h(reason || '');

			this.elements = {};

			this.make();
		}

		Form.PRIMARY = 'quickreplyform_primary';

		Form.POST_KEY = 'uQQR.post';

		Form.STORAGE_KEY = 'uQQR';

		Form.userStorage = strg.read(Form.STORAGE_KEY);

		Form.threadId = null;

		Form.postId = null;

		Form.shared = {
			elements: {
				main: document.querySelector('#main .wrap'),
				closed: !!document.querySelector('a.large-button.disabled'),
				logged: document.querySelector('#usercptools'),
				postbits: function () { return document.querySelectorAll('.postbit:not(.ignored):not([data-qqre])'); },
				editButtons: function () { return document.querySelectorAll('a[href*="editpost"]:not([data-qqre])'); }
			},
			scriptVersion: (function () {
				try {
					return '?v=' + document.querySelector('script[src*="v="]').src.split('v=')[1];
				} catch (e) { return ''; }
			}()),
			reg: {
				'<blockquote>' : '[indent]',
				'<blockquote class\\="quote code">[^]+?<pre>([^]+?)<\\/pre>[^]+?<\\/blockquote>' : '[code]$1[/code]',
				'<\\/blockquote>' : '[/indent]',
				'<li>' : '[*]',
				'<\\/li>' : '',
				'<b>' : '[b]',
				'<\\/b>' : '[/b]',
				'<i>' : '[i]',
				'<\\/i>' : '[/i]',
				'<strike>' : '[strike]',
				'<\\/strike>' : '[/strike]',
				'<u>' : '[u]',
				'<\\/u>' : '[/u]',
				'<ul>' : '[list]',
				'<\\/ul>' : '[/list]\n',
				'<ol [^]+?>' : '[list=1]',
				'<\\/ol>' : '[/list]\n',
				'<img[^]+?src\\="data\\:image[^]+?>' : '',
				'<img[^]+?src\\="([^]+?)"[^]+?>' : '[img]$1[/img]',
				'<a href\\="mailto\\:([^]+?)">([^]+?)<\\/a>' : '[email="$1"]$2[/email]',
				'<a[^]+?href\\="([^]+?)"[^]+?>' : '[url="$1"]',
				'</a>' : '[/url]',
				'<span style\\="color\\: #e21212">([^]+?)<\\/span>' : '$1',
				'<span class\\="?spoiler".*?>([^]+?)<\\/span>' : '[spoiler]$1[/spoiler]',
				'<span class\\="?spoiler .*?".*?>([^]+?)<\\/span>' : '[spoiler]$1[/spoiler]',
				'<span class\\="highlight">([^]+?)<\\/span>' : '[highlight]$1[/highlight]',
				'<br.?\\/?>' : '',
				'<span [^]+?<\\/span>' : '',
				'<div [^]+?<\\/div>' : '',
				'<.*?>' : '',
				'\\[I\'m an idiot\\.\\]' : 'lol'
			},
			buttons: ['removeformat', 'space', 'undo', 'redo', 'space', 'bold', 'italic', 'underline', 'space', 'insertorderedlist', 'insertunorderedlist', 'outdent', 'indent', 'space', 'createlink', 'unlink', 'email', 'insertimage', 'space', 'quote', 'code', 'space', 'resize'],
			quote: {
				$replaceImgWithUrlP1: function (text) {
					return text.replace(/\[img\]/i, 'Link[/url] : [url="');
				},
				replaceImgWithUrl: function (text) {
					return text.replace(/\[url=".+?"\]\[img\]/ig, Form.shared.quote.$replaceImgWithUrlP1)
						.replace(/\[\/img\]\[\/url/ig, '"]Image[/url')
						.replace(/(?:\[(\/?)img\])/ig, '[$1url]');
				},
				add: function (post) {
					if (Form.userStorage.u) {
						post = Form.shared.quote.replaceImgWithUrl(post);
					}

					app.state.activeBox.value += app.state.activeBox.value ? ('\n\n' + post) : post;

					if (app.state.activeBox.id === app.state.form.elements.message.id) {
						Form.events.saveStorage();
					}
				},
				unquote: function (post) {
					var div = $.e('div', {innerHTML: post}), e = div.querySelectorAll('.quote:not(.code)'), i = e.length;
					while (i--) {
						try {
							div.removeChild(e[i]);
						} catch (er) {}
					}
					return div.innerHTML;
				}
			},
			loadIds: function () {
				try {
					Form.threadId = +document.querySelector('.left a[href*="showthread.php?t="]').href.match(/t=(\d+)/)[1];
					Form.postId = +document.querySelector('a[href^="newreply.php?do=newreply&noquote=1&p="]').href.match(/p=(\d+)/)[1];
				} catch (e) {}
				return (Form.threadId && Form.postId);
			},
			tokenFromPage: function () {
				try {
					return document.getElementsByTagName('head')[0].textContent.match(/SECURITYTOKEN = "(.+?)"/)[1];
				} catch (e) { /*alert('Quick Quote, Reply and Edit encountered an error.'); */ return ''; }
			},
			loadScript: function () {
				var s = $.e('script', {type: 'text/javascript', src: '/forum/clientscript/vbulletin_textedit.js' + Form.shared.scriptVersion});
				s.addEventListener('load', function () {
					embedScript(function () {
						window.$vb_hook = function (id) {
							window.vB_Editor['vB_Editor_' + id] = new window.vB_Text_Editor('vB_Editor_' + id, 0, 3, 1);
						};

						var vbphrase = window.vbphrase || [];
						vbphrase.enter_list_item = 'Enter a list item.';
						vbphrase.message_too_short = 'Your message is too short.';
						vbphrase.enter_link_url = 'URL:';
						vbphrase.enter_image_url = 'Image URL:';
						vbphrase.enter_email_link = 'E-mail:';
						window.vbphrase = vbphrase;

						window.$vb_hook('001');
					});
				}, false);
				document.body.appendChild(s);
			}
		};

		Form.events = {
			clickDelegate: function (e) {
				if (e.target && e.target.title === 'Quick Quote') {
					Form.events.quickQuote(e);
				}
				if (e.target && e.target.title === 'Quick Editor++') {
					Editor.events.quickEdit(e);
				}
			},
			quickQuote: function (e) {
				// if (e.target && e.target.title === 'Quick Quote') {
				e = e.target;
				var user = e.getAttribute('data-user'), pid = e.getAttribute('data-post-id'), id = e.getAttribute('data-id'),
					i, re, post = Form.shared.quote.unquote(document.getElementById(pid).innerHTML);
				for (i in Form.shared.reg) {
					if (Form.shared.reg.hasOwnProperty(i)) {
						re = new RegExp(i, 'ig');
						post = post.replace(re, Form.shared.reg[i]);
					}
				}
				post = '[quote=' + user + ';' + id + ']' + $.h(post) + '[/quote]\n';
				e.className = 'multiquotelink quickquotes quickquoted';
				Form.shared.quote.add(post);
				// }
			},
			submit: function (e) {
				if (Form.shared.elements.logged) {
					strg.save(Form.POST_KEY, {threadId: Form.threadId});
				} else {
					e.preventDefault();
					document.location.hash = '#';
					alert('Please login!');
					document.location.hash = '#top';
					Form.events.saveStorage();
				}
			},
			toggleImageQuotes: function (e) {
				var k = String.fromCharCode(e.which).toLowerCase();
				if (e.altKey && e.shiftKey && (k === 't' || k === '\u02C7')) {
					e.preventDefault();
					Extra.click(app.state.form.elements.convert);
					alert('Notice: Converting IMG to URL ' + (app.state.form.elements.convert.checked ? 'enabled.' : 'disabled.'));
				}
			},
			saveStorage: function () {
				app.model.saveStorage();
			},
			clear: function () {
				if (this.value === 'Clear') {
					app.state.form.elements.title.value = app.state.form.elements.message.value = '';
					app.state.form.elements.message.focus();
				}
				app.model.clearStorage();
			},
			textStore: function (e) {
				sessionStorage.setItem('qqre-temp', JSON.stringify({
					id: Form.threadId,
					title: app.state.form.elements.title.value,
					text: e.target.value,
					z: +(new Date())
				}));
			}
		};

		Form.token = function () {
			var s = greaseWindow.SECURITYTOKEN;
			return typeof s === 'string' ? s : '';
		};

		Form.canAdd = function () {
			return Form.shared.elements.main && Form.shared.loadIds();
		};

		Form.removePreviousPost = function () {
			if (Form.hasJustPosted()) {
				// console.log('I think you have just posted, so I will clear previous post . . .');
				app.model.clearStorage();
			}
		};

		Form.hasJustPosted = function () {
			var id,
				tid = +strg.grab(Form.POST_KEY).threadId,
				hash = document.location.hash.substr(1),
				last = (function (posts) { return posts.length > 0 ? posts[posts.length - 1] : null; }(document.querySelectorAll('.mypost')));

			console.log('just posted?');
			if (tid === Form.threadId && last) {
				id = last.id;
				console.log(id, hash, tid);

				if (/(?:posted=1)/.test(document.location.href) && id === hash) {
					console.log('just posted : 1');
					return true;
				}
				if (/(?:post(\d+))/.test(document.location.hash) && id === hash) {
					console.log('just posted : 2');
					return true;
				}
			}
			return false;
		};

		Form.prototype = {
			constructor: Form,
			lastTabIndex: function () {
				var tabs = document.querySelectorAll('[tabindex]'), i, tabIndex = 0;

				for (i = 0; i < tabs.length; i++) {
					if (tabs[i].tabIndex > tabIndex) {
						tabIndex = tabs[i].tabIndex;
					}
				}

				return tabIndex;
			},
			make: function () {
				var	f = $.e('form', {className: 'quickreplyformp', action: this.id === '001' ? 'newreply.php?post=1' : 'editpost.php', name: 'vbform', method: 'post', onsubmit: 'return vB_Editor["vB_Editor_' + this.id + '"].prepare_submit(0, 1)'}, this.el),
					d = $.e('div', {className: this.id === '001' ? 'alt1 newreplybox' : 'alt2 newreplybox'}, f),
					p = $.e('p', null, d),
					editor = $.e('div', {id: 'vB_Editor_' + this.id, className: 'vBulletin_editor'}, d),
					container = $.e('div', {innerHTML: '<div class="text_emo_container"><div class="text_emo_container_text"></div><div class="text_emo_container_emo"></div></div>'}, d),
					r = $.e('div', {className: 'quickreplyform_hotspot'}, d),
					index = this.lastTabIndex() + 1;

				this.elements.buttons = $.e('div', {className: 'quickreplyform_buttons'}, r);
				this.elements.message = $.e('textarea', {dir: 'ltr', tabIndex: index, cols: 60, rows: 10, _width: '98%', _height: '150px', id: 'vB_Editor_' + this.id + '_textarea', name: 'message', value: this.message});
				this.elements.control = $.e('div', {id: 'vB_Editor_' + this.id + '_controls', className: 'control'}, editor);

				container.querySelector('.text_emo_container_text').appendChild(this.elements.message);
				emoji.make(container.querySelector('.text_emo_container_emo'), this.elements.message);

				if (this.edit) {
					this.elements.reason = $.e('input', {className: 'biginput', type: 'text', title: 'Optional', maxlength: 125, size: 50, name: 'reason', value: this.reason, placeholder: 'Reason for editing'}, p);
				} else {
					this.elements.title = $.e('input', {size: 50, name: 'title', className: 'biginput', type: 'text', value: this.title, placeholder: 'Title'}, p);
				}

				$.e('input', {type: 'hidden', name: 'securitytoken', id: '', value: Form.token()}, r);
				$.e('input', {type: 'hidden', name: 'wysiwyg', id: '', value: 0}, r);
				$.e('input', {type: 'hidden', name: 's', value: ''}, r);
				$.e('input', {type: 'hidden', name: 'do', value: this.id === '001' ? 'postreply' : 'updatepost'}, r);
				$.e('input', {type: 'hidden', name: 't', value: Form.threadId}, r);
				$.e('input', {type: 'hidden', name: 'p', value: this.id === '001' ? Form.postId : this.id}, r);
				$.e('input', {type: 'hidden', name: 'posthash', value: ''}, r);
				$.e('input', {type: 'hidden', name: 'poststarttime', value: ''}, r);
				$.e('input', {type: 'hidden', name: 'parseurl', value: 1}, r);

				this.elements.submit = $.e('input', {type: 'submit', name: 'sbutton', value: 'Submit', id: 'vB_Editor_' + this.id + '_save', className: 'large-button submit', tabIndex: index, accesskey: 's', title: 'Submit your reply.'}, this.elements.buttons);

				if (this.edit) {
					this.elements.cancel = $.e('input', {type: 'button', name: 'cancel', value: 'Cancel', className: 'large-button submit cancel_button', tabIndex: index, accesskey: 'c', title: 'Cancel your reply.'}, this.elements.buttons);
				}

				this.elements.preview = $.e('input', {type: 'submit', name: 'preview', value: 'Preview', className: 'large-button submit', tabIndex: index, accesskey: 'p', title: 'Preview your reply.'}, this.elements.buttons);

				$.e('div', {innerHTML: '<p style="text-align:center" onclick="this.nextSibling.style.display = this.nextSibling.style.display === \'block\' ? \'none\' : \'block\'"><span class="qqre_shortcuts" title="Click to see.">View <b class="qqreb">' + (Extra.mac ? '&#8984;' : 'CTRL') + '</b> Shortcuts</span></p><ul id="qqreshortcuts" style="display:none"><li><b class="qqreb">B</b> Bold</li><li><b class="qqreb">I</b> Italic</li><li><b class="qqreb">U</b> Underline</li><li><b class="qqreb">S</b> Strike</li><li><b class="qqreb">H</b> Highlight</li><li><b class="qqreb">P</b> Spoiler</li><li><b class="qqreb">L</b> URL</li><li><b class="qqreb">M</b> Image</li><li><b class="qqreb">E</b> Save*</li><li><b class="qqreb">D</b> Clear*</li><li>*Only for quick reply box.</li></ul>'}, r);

				this.addButtons();

				this.elements.body = f;
				this.elements.hotspot = r;
			},
			makePrimary: function () {
				this.elements.body.id = Form.PRIMARY;

				this.elements.save = $.e('input', {type: 'button', name: 'sbutton1', value: 'Save', id: 'quicksavebutton', className: 'large-button submit', tabIndex: this.elements.submit.tabIndex, title: 'Save your reply.', $action: 'save'});
				this.elements.buttons.insertBefore(this.elements.save, this.elements.submit.nextSibling);

				this.elements.clear = $.e('input', {type: 'button', name: 'sbutton2', value: 'Clear', id: 'quickclearbutton', className: 'large-button submit', tabIndex: this.elements.preview.tabIndex, title: 'Clear text.'}, this.elements.buttons);
				this.elements.temp = this.elements.message;

				this.elements.subscribe = $.e('div', {innerHTML: '<label><input type="checkbox"> Modify subscription<label><br>'}, this.elements.hotspot);
				this.elements.subscription = $.e('select', {id: 'qqre_subs', name: 'emailupdate', innerHTML: '<option value="9999">Do not subscribe</option> <option value="0">No email notification</option> <option value="1">Instant email notification</option> <option value="2">Daily email notification</option> <option value="3">Weekly email notification</option>'});
				this.elements.convert =	$.e('label', {'for': 'qqre_img', innerHTML: '<input type="checkbox" id="qqre_img"> Convert [IMG] to [URL] tags on quoted posts (ALT+SHIFT+T)', title: 'Convert [IMG] to [URL]', id: 'qqre_labelimg2url'}, this.elements.hotspot);
				this.elements.convert = app.state.form.elements.convert.querySelector('input');

				this.wire();
			},
			addButtons: function () {
				var i, j = Form.shared.buttons.length;

				for (i = 0; i < j; i++) {
					this.createButton(Form.shared.buttons[i]);
				}
			},
			createButton: function (type) {
				var buttonId;
				switch (type) {
				case 'space':
					$.e('img', {width: 6, height: 20, alt: '', src: 'images/neogaf/editor/separator.gif'}, $.e('div', false, this.elements.control));
					break;
				case 'quote':
				case 'code':
					buttonId = 'vB_Editor_' + this.id + '_cmd_wrap0_';
					break;
				case 'resize':
					$.a($.e('div', {className: 'imagebutton resize_merger'}, this.elements.control),
						$.e('div', {className: 'imagebutton', id: 'vB_Editor_' + this.id + '_cmd_resize_0_100'}, $.e('img', {src: 'images/neogaf/editor/resize_0.gif', height: 9, width: 21, alt: 'Decrease Size'}), true),
						$.e('div', {className: 'imagebutton', id: 'vB_Editor_' + this.id + '_cmd_resize_1_100'}, $.e('img', {src: 'images/neogaf/editor/resize_1.gif', width: 21, height: 9, alt: 'Increase Size'}), true));
					break;
				default:
					buttonId = 'vB_Editor_' + this.id + '_cmd_';
					break;
				}
				if (buttonId) {
					$.e('img', {src: 'images/neogaf/editor/' + type + '.gif', width: 21, height: 20, alt: type}, $.e('div', {className: 'imagebutton', id: buttonId + type}, this.elements.control));
				}
			},
			wire: function () {
				var sub = this.elements.subscribe;

				this.elements.message.addEventListener('input', throttle(Form.events.textStore, 250), false);
				this.elements.submit.addEventListener('click', Form.events.submit, false);
				this.elements.save.addEventListener('click', Form.events.saveStorage, false);
				this.elements.clear.addEventListener('click', Form.events.clear, false);
				this.elements.convert.addEventListener('click', Form.events.saveStorage, false);
				sub.querySelector('input[type="checkbox"]').addEventListener('click', function () {
					if (this.checked) {
						sub.appendChild(app.state.form.elements.subscription);
					} else {
						sub.removeChild(app.state.form.elements.subscription);
					}
				}, false);

				// document.addEventListener('click', Form.events.quickQuote, false);
				document.addEventListener('click', Form.events.clickDelegate, false);
				window.addEventListener(Extra.keyEvent, Form.events.toggleImageQuotes, false);
			}
		};

		return Form;

	}());

	app = {
		state: {
			activeBox: null,
			form: null
		},
		path: (function () {
			document.location.pathname.match(/(\w+)\.php/);
			return RegExp.lastParen;
		}()),
		main: function () {
			if (Form.token()) {
				app.go();
			} else {
				console.log('Token unavailable . . .');

				if (window.postMessage) {
					console.log('Adding message');

					window.addEventListener('message', function (event) { // add messenger listener to this page
						if (event.data.type && (event.data.type === 'QQRE_PAGE')) {
							greaseWindow[event.data.prop] = event.data.val;
							if (event.data.prop === 'SECURITYTOKEN') {
								app.go();
							}
						}
					}, false);

					// post message from page scope
					embedScript(function () {
						window.postMessage({ type: 'QQRE_PAGE', prop: 'SECURITYTOKEN', val: window.SECURITYTOKEN }, '*');
					});
				} else {
					Form.token = Form.shared.tokenFromPage;
					if (Form.token()) {
						app.go();
					}
				}
			}
			// console.log(app);
		},
		go: function () {
			(this.actions[this.path] || this.actions.$default)();
		},
		actions: {
			$default: function () {
				try {
					Form.threadId = +document.querySelector('[name="t"]').value;
				} catch (e) {}

				app.views.single(document.getElementById('vB_Editor_001_textarea'));
			},
			'private': function () {
				app.views.single(document.querySelector('#vB_Editor_QR_textarea, #vB_Editor_001_textarea'));
			},
			showthread: function () {
				app.views.quickReply();
			}
		},
		assets: {
			button: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGRjg5NTBEMDYwODdFMDExQkE4RUNGOEQ3QzZENjU2MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowN0ZGNkM2MERCMEUxMUUyOTQwNkExQjg0NkYxQ0M0OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowN0ZGNkM1RkRCMEUxMUUyOTQwNkExQjg0NkYxQ0M0OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBMDgyRDgxNkQ5ODdFMDExOTI4RUREM0QyQUUxREY5NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGRjg5NTBEMDYwODdFMDExQkE4RUNGOEQ3QzZENjU2MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoXp4HUAAAQmSURBVHjatJdPiBxFFMa/6q7umZ6emZ1d1EkwHmT3EKIkIkgMiLAERFZvwYPexD8n8RLQEC85JnowHr16UUEPhrgadfEiogYGMyaRkF33ICKLgpqd3Z0/3V35qrtmttMzu85mZh78mJ7urnqvvqr3qlo03nMwpBXJM2SePEIeJFPm2X9klfxMviWfk0ZfD8ICLAlIduVV8MWVCKLxzv86niNvkueJP2SwG+RDco4spyKgcxdwCoA7hQtXGA8i3h9Mnpwl18jLxN/l3Sy+aaPbnjN98b4CgighDImCjB/02yz5xEg9inG4eIM8RZ6L1RAmEINE0NfoUbJIqhif6YF8RxZILQ5CJWSnYI58Sap7kHtYqnHfAX1o52FyX8YXiXlG9nsxOdN9f0qfj5OtRAHVk+MMOZL6PykOc+RnennRON1bdL8SB5M2my4crwOvfOjCNWvZiqcgxCnimOvJE9FXhFOKa0Csn0RJKfy5hyKzo1kiUTlVdvpNOlCuhyhf3vjsurVfhgEWmI6+yjQSmdZKZaqq2L6nTDvb2u5DiO37vT40TPvIZi0K4LcDsSC32jiua4IKk1ctqWANCGBQIHEtYTv9q0cv2dZh57YArLRTg34PdpKVm0pgq4Xj4vA+7we6O5oemRhCbmWCUSkFdBBHKhHOzzfj627R63DUHXpdvGHj/VUPfsFHaaaMf5rRj/Jv4c8KIe5u0gc0OzS9ibCj5VDxY0qNjbbAxRsWTl/NoVTKo8ytIRAeWqI9K3OuUx5nlj08EyEKkinQynQ63JuN81zOBf3B83JwHQeddlCW43RetBXmym0IU2q1ApdWbLx11Y2d5/Mu18mdLnWgt8YVwGNTLfgWFzEDYCy49JuN12sOa4/DAPjLNMlM9y0ZKbXCi3vGEcCT0y1uKNxiuTq/WrXw6mUHjuvGkktpmyxSPWgrWoH6uBQ4NtNiiVP4+ncbL12m3By5lt227VQaqyR7kgDqOoClcTg/WAiw3w2x9IfEiz9Rbs51d853SbIlrdaiOcONVIrnp5tYWnPxSk3SqWVkl33FKzUFm2RRK7BOPhpVgQbT7bVfClA89eZz3ZHvWl/0oXVdPHCg2j35Xh9pO+bWFoTJAVPP+U7OHS5G3/c6laniQ81m+2a3ZOuj87ujKKDrnna8m/OUnSc342J64P770kcy7gs8sUzQqECdChybrpQ2qYBO2d4K2SInyPcTPBf+xbpzQi/AyCxGK/OCnoqnydoEnK+ZvpfvKMXpymSokSdIfcCzu6Vu+qylU7G7FwwyHaU+I7ytN7QRRt0xfRzNjrx3Ri0WvZ0a62+mb0yN0C8d3EOa6vX0AXmBfGz6SkZs2fG+kM/neFbg1/G+6tD7kP48fzbzeV4xz/7NfJ5fHPh5rj8WXYmCl0elUuGRLMRtAQYAYbshc70RBucAAAAASUVORK5CYII='
		},
		views: {
			single: function (textarea) {
				var parent, id, container;

				if (!textarea) { return; }

				parent = textarea.parentElement;
				container = $.e('div', {innerHTML: '<div class="text_emo_container"><div class="text_emo_container_text"></div><div class="text_emo_container_emo"></div></div>'});

				container.querySelector('.text_emo_container_text').appendChild(textarea);
				textarea.removeAttribute('style');
				parent.appendChild(container);
				emoji.make(container.querySelector('.text_emo_container_emo'), textarea);

				id = textarea.id.match(/vB_Editor_(\w+)_/)[1];

				if (document.getElementById('vB_Editor_001_save')) {
					document.getElementById('vB_Editor_001_save').addEventListener('click', Form.events.submit, false);
				}

				return new Extra(id);
			},
			quickReply: function () {
				if (Form.token() && !Form.shared.elements.closed) {
					dom.css('.quickreplyformp div.vBulletin_editor { background: transparent; border: 0; padding: 0 } #quickreplybox { position:fixed; top:0; left:0; width: 100%; background: transparent; text-align: center; } #quickreplybox span { background: #4aa4b7; color: #fff; padding: 3px; border-radius: 3px } #quickreplybox span:hover { background: #47a947; cursor: pointer} .hide { display: none; } .newreplybox { font-family: Arial, Verdana, sans-serif; max-width: 800px; margin: auto; padding: 9px 8px 6px} .inpost .newreplybox { width: 90% !important; border: 1px solid #ccc} .quickreplyformp textarea {font-size:110%; display:block; margin: auto} .newreplybox .vBulletin_editor { border: 0 none !important; } .newreplybox p { margin: .5em 0 .1em; text-align: center} .quickquotes, .quickquoted { cursor: pointer; background: url(' + app.assets.button + ') no-repeat; -moz-background-size: 16px 16px; background-size: 16px 16px; width:16px; height:16px; margin-right:2px; transition-duration: .2s; } .quickquotes:hover{opacity:.8} .quickquotes:active,.quickquoted,.quickquoted:hover{opacity:.5} #quickreplyformpoff { position: fixed; z-index: 1000; top: 28px; left: 150px; } #vB_Editor_001 { border: none; background: transparent; margin: 0; padding: 0 } \n.newreplybox .imagebutton { border: 0 !important; padding: 1px !important; margin: 0 2px;} .resize_merger.imagebutton { background: transparent !important; padding: 0 !important; vertical-align: middle; } .newreplybox .imagebutton:hover img { background-color: #C1D2EE; border-radius: 2px } .newreplybox .control { text-align:center; padding: 0px; margin: 4px auto 2px auto; } .newreplybox .control > div { display:inline-block } .newreplybox .large-button.submit:focus { outline: none;border-radius:3px; background-color:#01518E; border:0; color:#eee;} .newreplybox .large-button.submit:active{ outline: none; border-radius: 3px; background-color:#666; border:0; color:#fff; } \n.post { min-height: 108px } .editarea .newreplybox { width: 650px; margin: 12px 6px } .editarea textarea { width: 99% !important; } .editarea textarea, .biginput { border:1px solid #bbb } .newreplybox input[type="radio"],.newreplybox input[type="checkbox"]{width:13px;height:13px;padding:0;margin:0 0 0 4px;position:relative;top:-1px;}.inpost .newreplybox{width: 94%} .qqre_shortcuts {font-weight:bold;cursor:pointer} .qqre_shortcuts:hover {text-decoration:underline}  #qqreshortcuts { margin: 5px auto; padding: 0; text-align: center; width:500px} #qqreshortcuts li {text-align:left; display: inline-block; padding: 0 3px; width:7em} #qqreshortcuts li:last-child{text-align:center;display:block;width:auto} #vB_Editor_001_cmd_wrap0_spoiler { visibility:hidden !important } .qqreb {line-height:1.2;color:#333;font-family:"Andale Mono",Consolas,monospace;background: none repeat scroll 0 0 rgba(248, 245, 245, 0.62); border: 1px solid #b1b1b1; border-radius: 3px; display: inline-block; padding: 0 5px; }');

					app.views.editLinks();
					if (Form.canAdd()) {
						Form.removePreviousPost();
						app.views.initialForm();
					}
				}
			},
			initialForm: function () {
				if (!document.querySelector(Form.PRIMARY)) {
					// console.log('creating new primary form');

					app.state.form = new Form('001', Form.shared.elements.main);
					app.state.form.makePrimary();

					Form.shared.loadScript();

					app.state.form.extra = new Extra(app.state.form.id, true);
					app.state.form.extra.BB.clear = app.state.form.elements.clear;
					app.state.form.extra.BB.save = app.state.form.elements.save;

					app.model.init();

					app.state.form.elements.convert.checked = Form.userStorage.u;

					app.state.activeBox = app.state.form.elements.message;
					app.views.addQuickButtons();

					// document.dispatchEvent(new CustomEvent('LiveThreadUpdate'));
					document.addEventListener('LiveThreadUpdate', app.events.liveUpdate, false);
				}
			},
			editLinks: function () {
				embedScript(function () {
					// prevents Chrome from opening the default editor
					var i, a = document.querySelectorAll('a.post-button');
					for (i = 0; i < a.length; i++) {
						a[i].onclick = null;
					}
				});

				var buttons = Form.shared.elements.editButtons(), i = buttons.length;
				while (i--) {
					Editor.fromLink(buttons[i]);
				}
			},
			addQuickButtons: function () {
				return app.state.form && !Array.from(Form.shared.elements.postbits()).forEach(function (postbit) {
					var post, button, user, quick;

					postbit.dataset.qqre = true;
					button = postbit.querySelector('.multiquotelink, .post-button');

					if (button) {
						post = postbit.querySelector('.post');
						user = postbit.querySelector('.postbit-details-username a') || {};

						quick = $.e('i', { title: 'Quick Quote', '$data-user': user.textContent, '$data-post-id': post.id, '$data-id': post.id.match(/\d+/)[0], className: 'multiquotelink quickquotes' });
						button.parentElement.insertBefore(quick, button.parentElement.firstElementChild);
					}
				});
			}
		},
		model: {
			init: function () {
				if (strg.zero(Form.userStorage)) {
					app.model.saveStorage();
				}

				this.textLoad();
			},
			saveStorage: function () {
				Form.userStorage = {
					i: Form.threadId,
					t: app.state.form.elements.title.value,
					c: app.state.form.elements.message.value,
					u: app.state.form.elements.convert.checked,
					z: +(new Date())
				};

				strg.save(Form.STORAGE_KEY, Form.userStorage);
				// console.log('saveStorage', Form.userStorage);
			},
			clearStorage: function () {
				Form.userStorage = {i: 0, t: '', c: '', u: app.state.form ? app.state.form.elements.convert.checked : Form.userStorage.u};
				strg.save(Form.STORAGE_KEY, Form.userStorage);
				strg.wipe(Form.POST_KEY);
				sessionStorage.removeItem('qqre-temp');
			},
			textLoad: function () {
				var session = JSON.parse(sessionStorage.getItem('qqre-temp') || '{}'),
					load = {title: '', text: ''};

				if (Form.userStorage.i === Form.threadId) {
					load.title = Form.userStorage.t;
					load.text = Form.userStorage.c;
				}

				if (session.id === Form.threadId && (!Form.userStorage.z || Form.userStorage.z < session.z)) {
					load.text = session.text;
					load.title = session.title;
				}

				app.state.form.elements.title.value = load.title;
				app.state.form.elements.message.value = load.text;
			}
		},
		events: {
			liveUpdate: function () {
				console.log('qqre: live thread update');
				app.views.editLinks();
				app.views.addQuickButtons();
			}
		}
	};

	app.main();

}());
