// ==UserScript==
// @name        Plex now playing badge
// @namespace   V@no
// @description Display a badge on favicon with a number of users streaming from the server
// @license     MIT
// @include     http://localhost:32400/web/*
// @include     http://127.0.0.1:32400/web/*
// @include     https://localhost:32400/web/*
// @include     https://127.0.0.1:32400/web/*
// @include     https://app.plex.tv/desktop
// @include     https://app.plex.tv/desktop/*
// @include     https://app.plex.tv/desktop#*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACVklEQVRYhc2Xy08TURTGZ6NAn7RMp1xo587ChVUTY9mCCfFPMFZicGlMNNGli7YoIsYBNDyCDyKmQVGpQMJC0aVuTKCkoFCbEhQoCNrUkBDWn4uWR8s0tHVu603O+vzuPed857scpRTFDO6/Bxi4VIWAhyjGpJvglENkC1B3UsSEWxkg4CHwX6liC0Apxc2ztowAU02VcNXZ2QIcPUIxmfYKU16CYLMVM3cEfG6yQpIYN2Grqzrl1tO3rfh6V8CcbMG3Dh5yI2ELIEkUn24QBLwE082J5KE2HuEHFYh0mRHpNMN5LPeGzGkMz9XaEbxViS+tAuaSyee7zfj+sByLT4x457awBaCUYvgawew9C8L3d5Mv9RkRfWbAqk+PC2eq2QI4HSJmZR6RTjMWek1YTCb/OaDD+qAW4UeGnBoyLyWUGwnme0z48bgc0f5E8l8vtYj5NYiPlKHrssAWQJIogjKPpT4jVnx6rA9qERvS4M9oKTbGShAfLUXNiey0Ie9d0FBvw/LT5O1faREfLsPGWAk23x7G1vtD+NhhYAtAKcW4h8facx1+v9bgA8flFf8EUHNcRNSnR2yo2AD+XYBsjyoA414eay90KS9QMICGehui/YZ9PbB9OI5TDFUAJIki2FaRMgUFBZAvEiz0mlJ04KASqAbgdIgItfM7SricVMKCAYxcJwi1798FmQBULYGr1o6ZFqviNmQOsG1IMvkB5iXYsWQZHBFTgHRTmu4JJ1oEtmOoZMv3uuLzp23sAA76mLy5mnDDzKQ4269ZUZbR3ijKOlYD4C/uwVlNS+Cv+wAAAABJRU5ErkJggg==
// @ require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @author      V@no
// @version     2.5.0
// @grant       GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/32785/Plex%20now%20playing%20badge.user.js
// @updateURL https://update.greasyfork.org/scripts/32785/Plex%20now%20playing%20badge.meta.js
// ==/UserScript==

var log = console.log.bind(console),
		prefsDefault = {
			position: 2, //0 = top-left, 1 = top-right, 2 = bottom-right, 3 = bottom-left
			offsetX: 0, //move badge away from x egde
			offsetY: 0, //move badge away from y edge
			textSize: 0, //text size, 0 = auto, 1 = 5px, 2 = 10px, so on
			textMargin: -1, //margin around text, use negative number for auto scale based on text size
			textColor: "#000000", // text color
			backgroundColor: "#FFFFFF", //background color
			borderColor: "#B90000", //border color
			borderWidth: -1, //border width, -1 = auto based on text size
			borderRadius: 0, //border corners radius
			sizeIcon: 16, //image size in pixels, 0 = original
		},
		optionsMenu = (function()
		{
			let a = document.createElement("button");
			a.innerText = "Plex Badge Config";
			a.href = "#";
			a.addEventListener("click", function(e)
			{
				e.preventDefault();
				configOpen();
			}, false);
			return a;
		})();

function clone(orig)
{
	let obj = {};
	for (let n in orig)
		obj[n] = orig[n];

	return obj;
}

function prefsUpdate ()
{
	for(let n in prefs)
	{
		let pref = prefs[n];
		if (typeof(pref) == "object" || typeof(pref) == "function")
			continue;

		pref = $(configPrefix + n).value;
		pref = fixType.do(prefs[n], pref);

		if (n.indexOf("Color") != -1)
			pref = pref.replace(/[^#a-zA-Z0-9\-]+/g, "");

		if ($(configPrefix + n).value != pref)
			$(configPrefix + n).value = pref;

		prefs[n] = pref;
	}
}

function getPrefs()
{
	return prefs;
}
function drawText(text, prefs)
{
	if (!img.loaded)
		return;

	if (!prefs)
		prefs = getPrefs();

	if (prefs.sizeIcon)
		img.width = img.height = prefs.sizeIcon;
	else
	{
		img.width = img._width;
		img.height = img._height;
	}
	let size = img.height;
	canvas.width = canvas.height = size;
	ctx.save();
	ctx.drawImage(img, 0, 0, size, size);

	if (text)
	{
		let multi = prefs.textSize ? prefs.textSize : size / 16,
				textArray = text.toString().toUpperCase().split(''),
				textHeight = 0,
				textWidth = textArray.reduce(function (prev, cur)
				{
					let px = getPixelMap(cur);
					if (px.length * multi > textHeight)
						textHeight = px.length * multi;

					return prev + px[0].length * multi + 1;
				}, -1),
				borderWidth = prefs.borderWidth == -1 ? multi : prefs.borderWidth,
				textMargin = prefs.textMargin < 0 ? -prefs.textMargin * multi : prefs.textMargin,
				width = textWidth + textMargin * 2 + borderWidth,
				height = textHeight + textMargin * 2 + borderWidth,
				xy = -borderWidth / 2,
//				offsetX = prefs.offsetX < 0 ? -prefs.offsetX * multi : prefs.offsetX,
//				offsetY = prefs.offsetY < 0 ? -prefs.offsetY * multi : prefs.offsetY,
				offsetX = prefs.offsetX * multi,
				offsetY = prefs.offsetY * multi,
				x, y;

		switch (prefs.position)
		{
			case 0:
				x = borderWidth + offsetX;
				y = borderWidth + offsetY;
				break;
			case 1:
				x = size - width - offsetX;
				y = borderWidth + offsetY;
				break;
			default:
			case 2:
				x = size - width - offsetX;
				y = size - height - offsetY;
				break;
			case 3:
				x = borderWidth + offsetX;
				y = size - height - offsetX;
				break;
		}
		ctx.translate(x, y);

		// Draw Box
		ctx.fillStyle = hexToRgbA(prefs.backgroundColor);//backgborderRadius
		ctx.strokeStyle = hexToRgbA(prefs.borderColor);//border

		ctx.lineWidth = borderWidth;
		ctx.borderRadiusRect(xy, xy, width, height, prefs.borderRadius * multi).fill();
		if (borderWidth)
			ctx.borderRadiusRect(xy, xy, width, height, prefs.borderRadius * multi).stroke();

		// Draw Text
		ctx.fillStyle = hexToRgbA(prefs.textColor);
		ctx.translate(textMargin, textMargin);
		let pa = [];
		for(let i = 0; i < textArray.length; i++)
		{
			let px = getPixelMap(textArray[i]),
					_y = 0;

			for (let y = 0; y < px.length; y++)
			{
				let _x = 0;
				for (let x = 0; x < px[y].length; x++)
				{
					if (px[y] && px[y][x])
					{
						ctx.fillRect(_x, _y, 1, 1);
						for(let mx = 0; mx < multi; mx++)
						{
							for(let my = 0; my < multi; my++)
							{
								ctx.fillRect(_x + mx, _y + my, 1, 1);
							}
						}
					}
/*
// double, not bold
					if (multi)
					{
						if (px[y] && px[y][x])
						{
							if (x && px[y] && px[y][x-1])
								ctx.fillRect(_x-1, _y, 1, 1);

							if (y && px[y-1] && px[y-1][x])
								ctx.fillRect(_x, _y-1, 1, 1);
						}
						else
							if ((x && px[y] && px[y][x-1])
									&& (y && x && px[y-1] && px[y-1][x])
									&& !(y && x && px[y-1] && px[y-1][x-1])
								)
							{
								ctx.fillRect(_x-1, _y-1, 1, 1);
							}
					}
*/
					_x += multi;
				}
				_y += multi;

			}
			ctx.translate(px[0].length * multi + 1, 0);
		}
	}
	let data = canvas.toDataURL("image/x-icon");
	ctx.restore();
	ctx.clearRect(0, 0, size, size);
	return data;
}//drawText()

function hexToRgbA(hex)
{
	let c;
	if (/^#(([A-Fa-f0-9]{3}){1,2}|[A-Fa-f0-9]{7,8}|[A-Fa-f0-9]{4})$/.test(hex))
	{
		c = hex.substring(1).split('');
		if(c.length == 3)
				c= [c[0], c[0], c[1], c[1], c[2], c[2], "F", "F"];
		if(c.length == 4)
				c= [c[0], c[0], c[1], c[1], c[2], c[2], c[3], c[3]];

		if (c.length < 7)
			c = c.concat(["F", "F"]);
		else if (c.length < 8)
			c[7] = c[6];

		c = '0x' + c.join('');
		return 'rgba('+[(c>>24)&255, (c>>16)&255, (c>>8)&255, ((c&255)*100/255)/100].join(',') + ')';
	}
	return hex;
}

//borrowed from https://chrome.google.com/webstore/detail/favicon-badges/fjnaohmeicdkcipkhddeaibfhmbobbfm/related?hl=en-US
/**
 * Gets a character's pixel map
 */
function getPixelMap(sym)
{
	let px = PIXELMAPS[sym];
	if (!px)
		px = PIXELMAPS['0'];
	return px;
}
var PIXELMAPS = {
	'0': [
		[1,1,1],
		[1,0,1],
		[1,0,1],
		[1,0,1],
		[1,1,1]
	],
	'1': [
		[0,1,0],
		[1,1,0],
		[0,1,0],
		[0,1,0],
		[1,1,1]
	],
	'2': [
		[1,1,1],
		[0,0,1],
		[1,1,1],
		[1,0,0],
		[1,1,1]
	],
	'3': [
		[1,1,1],
		[0,0,1],
		[0,1,1],
		[0,0,1],
		[1,1,1]
	],
	'4': [
		[1,0,1],
		[1,0,1],
		[1,1,1],
		[0,0,1],
		[0,0,1]
	],
	'5': [
		[1,1,1],
		[1,0,0],
		[1,1,1],
		[0,0,1],
		[1,1,1]
	],
	'6': [
		[1,1,1],
		[1,0,0],
		[1,1,1],
		[1,0,1],
		[1,1,1]
	],
	'7': [
		[1,1,1],
		[0,0,1],
		[0,0,1],
		[0,1,0],
		[0,1,0]
	],
	'8': [
		[1,1,1],
		[1,0,1],
		[1,1,1],
		[1,0,1],
		[1,1,1]
	],
	'9': [
		[1,1,1],
		[1,0,1],
		[1,1,1],
		[0,0,1],
		[1,1,1]
	],
	'X': [
		[1,0,1],
		[0,1,0],
		[1,0,1]
	],
};

//https://stackoverflow.com/a/7838871/2930038
CanvasRenderingContext2D.prototype.borderRadiusRect = function (x, y, w, h, r)
{
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w,  y,   x+w, y+h, r);
	this.arcTo(x+w,  y+h, x,   y+h, r);
	this.arcTo(x,    y+h, x,   y,   r);
	this.arcTo(x,    y,   x+w, y,   r);
	this.closePath();
	return this;
};

(function loop()
{
	let button = $("id-7");
	if (!button)
		return setTimeout(loop, 100);

	button.addEventListener("click", function()
	{
		(function loop()
		{
			let n = $("id-9");
			n = n && n.getElementsByClassName("Menu-menuScroller-1TF6o Scroller-vertical-VScFL Scroller-scroller-3GqQc Scroller-vertical-VScFL Scroller-auto-LsWiW")[0];
			if (!n)
				return setTimeout(loop, 100);

			nav = n;
			let c = n.getElementsByClassName("MenuSeparator-separator-vr6OL");
			c = c && c[c.length-1];
			if (c)
			{
				c.parentNode.insertBefore(c.cloneNode(false), c);
				c.parentNode.insertBefore(optionsMenu, c);
				optionsMenu.className = "MenuItem-menuItem-1s02m MenuItem-default-2SKQ8 Link-link-2n0yJ Link-default-2XA2b";
			}
		})();
	}, true);
})();
function loop(conf)
{
	let isConf = typeof(conf) != "undefined";
	if (!isConf)
		clearTimeout(loop.timer);

	if (!link || link.parentNode !== head)
	{
		let links = document.getElementsByTagName("link");
		for(let i = 0; i < links.length; i++)
		{
			if (links[i].getAttribute("rel") == "shortcut icon")
			{
				link = links[i];
				break;
			}
		}
		if (link && !img.loaded)
		{
			img.setAttribute('crossOrigin','anonymous');
			img.src = link.href;
			img.onload = function()
			{
				img._width = img.width;
				img._height = img.height;
				img.loaded = true;
			};
		}
	}
	let data,
			act = ["NavBarActivityButton-label-2ZN0g", "activity-badge badge badge-transparent", "NavBarActivityButton-label-WHdP8x"],
			activityBox = null;
	
	for(let i = 0; i < act.length; i++)
	{
		let span = document.getElementsByClassName(act[i]);
		if (!span.length)
			continue;

		activityBox = span[0];
	}
	let badge = activityBox ? activityBox.innerText : "",
			text = parseInt(badge);

	if(conf === true)
	{
		text = testField.value === "" ? Math.floor(Math.random() * 99) + 1 : testField.value;
		prev = null;
	}
	else if ((isConf || configOpened) && conf !== false)
		text = testField.value === "" ? Math.floor(Math.random() * 99) + 1 : testField.value;


	if (isNaN(text))
		text = 0;

	if (prev != text && (data = drawText(text)))
	{
		link.href = data;
		testImg.src = data;
		prev = text;
	}
	// if (!nav)
	// {
		nav = document.querySelector(".Menu-menuPortal-EGqW0f");//$("nav-dropdown");
		if (nav)
		{
			let li = optionsMenu;//document.createElement("button"),
					b = nav.querySelector("button"),
					lis = nav.querySelector("button").parentNode.children;
			li.className = b.className;
			for(let i = lis.length - 1; i >= 0; i--)
			{
				let c = lis[i];
				if (c.classList.contains("MenuSeparator-separator-ljlcCS"))
				{
					// li.appendChild(optionsMenu);
					c.parentNode.insertBefore(c.cloneNode(false), c);
					c.parentNode.insertBefore(li, c);
					break;
				}
			}
		}
	// }
	if (!isConf)
		loop.timer = setTimeout(loop, 3000);
}

function $(id)
{
	return document.getElementById(id);
}

function configOpen()
{
	prefsClone = clone(prefs);
	configOpened = true;
	document.body.setAttribute("config", "");
	$("plexNPBConfigBase").style.marginLeft = -$("plexNPBConfigBase").offsetWidth / 2 + "px";
	$("plexNPBConfigBase").style.marginTop = -$("plexNPBConfigBase").offsetHeight / 2 + "px";
	for(let i in prefsDefault)
	{
		let pref = prefsDefault[i];
		$(configPrefix + i).value = prefs[i];
	}
	loop(null);
}

function configClose()
{
	configOpened = false;
	document.body.removeAttribute("config");
	prefs = clone(prefsClone);
	loop(false);
}

function configReset(e)
{
	for(let i in prefsDefault)
	{
		let pref = prefsDefault[i];
		$(configPrefix + i).value = prefsDefault[i];
	}
	prefsClone = clone(prefs);
	prefsUpdate();
	loop(true);
}

function configSave(e)
{
	prefsClone = clone(prefs);
	prefsUpdate();
	ls("pnpbPrefs", prefs);
	loop(true);
	configClose(e);
}

function configInput(e)
{
	if (e.target.id == configPrefix + "test")
	{
		let pos = e.target.selectionEnd, i = 0;
		e.target.value = e.target.value.replace(/[^0-9]+/g, function(a,b,c,d)
		{
			if (pos >= b)
				i += a.length;

			return "";
		}).substring(0, 3);
		e.target.selectionStart = e.target.selectionEnd = pos-i;
	}
	prefsUpdate();
	loop(true);
}

function ls(id, data)
{
	let r;
	if (typeof(data) == "undefined")
	{
		r = localStorage.getItem(id);
		try
		{
			r = JSON.parse(r);
		}catch(e){}
	}
	else
	{
		try
		{
			r = localStorage.setItem(id, JSON.stringify(data));
		}
		catch(e){}
	}
	return r;
}

function validateNumber(e)
{
	let key = e.keyCode,
			char = String.fromCharCode(e.charCode || e.which).toLowerCase();

	if ((char > "9" || char < "0") &&
			[e.DOM_VK_BACK_SPACE, e.DOM_VK_DELETE, e.DOM_VK_TAB, e.DOM_VK_RETURN, e.DOM_VK_ESCAPE,
					e.DOM_VK_LEFT, e.DOM_VK_RIGHT, e.DOM_VK_UP, e.DOM_VK_DOWN, e.DOM_VK_PAGE_UP,
					e.DOM_VK_PAGE_DOWN, e.DOM_VK_HOME, e.DOM_VK_END, e.DOM_VK_INSERT].indexOf(key) == -1 &&
			(key > e.DOM_VK_F22 || key < e.DOM_VK_F1) &&
			!((e.ctrlKey || e.metaKey) && !char != "c") && //copy
			!((e.ctrlKey || e.metaKey) && !char != "v") && //paste
			!((e.ctrlKey || e.metaKey) && !char != "x") && //cut
			!((e.ctrlKey || e.metaKey) && !char != "z") && //undo
			!((e.ctrlKey || e.metaKey) && !char != "y") //redo
			)
	{
		e.returnValue = false;
		e.preventDefault();
		e.stopPropagation();
	}
}

var prefs = {},
		_prefs = ls("pnpbPrefs") || {},
		prefsClone = {},
		configPrefix = "plexNPBConfig_",
		configOpened = false,
		fixType = {
			string: String,
			number: Number,
			boolean: Boolean,
			do: function(o, n)
			{
				if (typeof(o) in this)
					n = this[typeof(o)](n);

				return n;
			}
		},
		link = null,
		head = document.getElementsByTagName('head')[0],
		prev = null,
		img = new Image(),
		canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d'),
		size = 16,
		multi,
		nav,
		title = "Plex Badge Config",
		testImg = {},
		testField = {value:""},
		configBase = document.createElement("div"),
		plexNPBConfigBlur = document.createElement("div"),
		style = document.createElement("style");

head.appendChild(style);

plexNPBConfigBlur.id = "plexNPBConfigBlur";
plexNPBConfigBlur.addEventListener("click", function(){configClose();}, false);

configBase.id = "plexNPBConfigBase";
document.body.appendChild(plexNPBConfigBlur);
document.body.appendChild(configBase);
style.innerHTML = function(){/*
#plexNPBConfigBlur
{
	z-index: 99998;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background-color: grey;
	opacity: 0.6;
	display: none;
}
body[config] #plexNPBConfigBase,
body[config] #plexNPBConfigBlur
{
	display: block;
}

body[config] #plex > div
{
	filter: blur(5px);
}

#plexNPBConfigBase
{
	z-index: 99999;
	position: absolute;
	left: 50%;
	top: 50%;
	border: 1px solid black;
	background-color: white;
	padding: 7px;
	text-align: center;
	display: none;
	box-shadow: 10px 10px 50px 1px #000;
}
#plexNPBConfigBase *
{
	font-family: arial,tahoma,myriad pro,sans-serif;
	color: #000;
}

#plexNPBConfigBase .config_header
{
	font-size: 20pt;
	margin: 0;
	padding: 0;
	text-align: center;
}

.testicon > div
{
	display: inline-block;
/*
	position: absolute;
	top: 7px;
	left: 7px;
*//*
	width: 32px;
	height: 32px;
	text-align: end;
	vertical-align: middle;
}

.testicon img
{
	vertical-align: middle;
}

#plexNPBConfigBase .config_var
{
	display: table-row;
	margin: 0 0 4px;
}

#plexNPBConfigBase .config_var > *
{
	margin: 3px 3px 3px 0.5em;
	width: 90%;
}

#plexNPBConfigBase .config_var > label
{
	display: table-cell;
	white-space: nowrap;
	text-align: end;
	width: 0;
	vertical-align: middle;
	font-size: 12px;
	font-weight: bold;
	margin-right: 6px;
}

.testicon > div > div
{
	float: left;
}

#plexNPBConfigBase .config_buttons
{
	color: #000;
	text-align: center;
}
#plexNPBConfigBase input
{
	border-width: 1px;
	line-height: initial;
}
#plexNPBConfigBase .saveclose_buttons
{
	margin: 16px 0 10px;
	padding: 2px 12px;
	width: 45%
}
#plexNPBConfigBase #plexNPBConfig_saveBtn
{
	margin-right: 5px;
}
#plexNPBConfigBase #plexNPBConfig_cancelBtn
{
	margin-left: 5px;
}
#plexNPBConfig_test
{
	margin-top: 1em;
	width: 80%;
}
.reset_holder
{
	text-align: right;
}
*/}.toString().slice(14,-3).split("*//*").join("*/");

configBase.innerHTML = function(){/*
<DIV class="config_header block center">Plex Badge Config</DIV>
<DIV class="config_var">
	<LABEL for="##position" class="field_label">Position</LABEL>
	<SELECT id="##position">
		<OPTION value="0">Top-Left</OPTION>
		<OPTION value="1">Top-Right</OPTION>
		<OPTION value="2">Bottom-Right</OPTION>
		<OPTION value="3">Bottom-Left</OPTION>
	</SELECT>
</DIV>
<DIV class="config_var">
	<LABEL for="##offsetX" class="field_label">Offset X</LABEL>
	<SELECT id="##offsetX">
		<OPTION value="-8">-8</OPTION>
		<OPTION value="-7">-7</OPTION>
		<OPTION value="-6">-6</OPTION>
		<OPTION value="-5">-5</OPTION>
		<OPTION value="-4">-4</OPTION>
		<OPTION value="-3">-3</OPTION>
		<OPTION value="-2">-2</OPTION>
		<OPTION value="-1">-1</OPTION>
		<OPTION value="0">0</OPTION>
		<OPTION value="1">1</OPTION>
		<OPTION value="2">2</OPTION>
		<OPTION value="3">3</OPTION>
		<OPTION value="4">4</OPTION>
		<OPTION value="5">5</OPTION>
		<OPTION value="6">6</OPTION>
		<OPTION value="7">7</OPTION>
		<OPTION value="8">8</OPTION>
	</SELECT>
</DIV>
<DIV class="config_var">
	<LABEL for="##offsetY" class="field_label">Offset Y</LABEL>
	<SELECT id="##offsetY">
		<OPTION value="-8">-8</OPTION>
		<OPTION value="-7">-7</OPTION>
		<OPTION value="-6">-6</OPTION>
		<OPTION value="-5">-5</OPTION>
		<OPTION value="-4">-4</OPTION>
		<OPTION value="-3">-3</OPTION>
		<OPTION value="-2">-2</OPTION>
		<OPTION value="-1">-1</OPTION>
		<OPTION value="0">0</OPTION>
		<OPTION value="1">1</OPTION>
		<OPTION value="2">2</OPTION>
		<OPTION value="3">3</OPTION>
		<OPTION value="4">4</OPTION>
		<OPTION value="5">5</OPTION>
		<OPTION value="6">6</OPTION>
		<OPTION value="7">7</OPTION>
		<OPTION value="8">8</OPTION>
	</SELECT>
</DIV>
<DIV class="config_var">
	<LABEL for="##textSize" class="field_label">Text size</LABEL>
	<SELECT id="##textSize">
		<OPTION value="0">Auto</OPTION>
		<OPTION value="1">1</OPTION>
		<OPTION value="2">2</OPTION>
		<OPTION value="3">3</OPTION>
	</SELECT>
</DIV>
<DIV class="config_var">
	<LABEL for="##textMargin" class="field_label">Text margin</LABEL>
	<SELECT id="##textMargin">
		<OPTION value="-4">Auto x4</OPTION>
		<OPTION value="-3">Auto x3</OPTION>
		<OPTION value="-2">Auto x2</OPTION>
		<OPTION value="-1">Auto</OPTION>
		<OPTION value="0">0</OPTION>
		<OPTION value="1">1</OPTION>
		<OPTION value="2">2</OPTION>
		<OPTION value="3">3</OPTION>
		<OPTION value="4">4</OPTION>
	</SELECT>
</DIV>
<DIV class="config_var">
	<LABEL for="##textColor" class="field_label">Text color</LABEL>
	<INPUT id="##textColor" size="25" type="text">
</DIV>
<DIV class="config_var">
	<LABEL for="##backgroundColor" class="field_label">Background color</LABEL>
	<INPUT id="##backgroundColor" size="25" type="text">
</DIV>
<DIV class="config_var">
	<LABEL for="##borderColor" class="field_label">Border color</LABEL>
	<INPUT id="##borderColor" size="25" type="text">
</DIV>
<DIV class="config_var">
	<LABEL for="##borderWidth" class="field_label">Border width</LABEL>
	<SELECT id="##borderWidth">
		<OPTION value="-1">Auto</OPTION>
		<OPTION value="0">0</OPTION>
		<OPTION value="1">1</OPTION>
		<OPTION value="2">2</OPTION>
		<OPTION value="3">3</OPTION>
		<OPTION value="4">4</OPTION>
		<OPTION value="5">5</OPTION>
		<OPTION value="6">6</OPTION>
		<OPTION value="7">7</OPTION>
		<OPTION value="8">8</OPTION>
	</SELECT>
</DIV>
<DIV class="config_var">
	<LABEL for="##borderRadius" class="field_label">Border radius</LABEL>
	<SELECT id="##borderRadius">
		<OPTION value="0">0</OPTION>
		<OPTION value="1">1</OPTION>
		<OPTION value="2">2</OPTION>
		<OPTION value="3">3</OPTION>
		<OPTION value="4">4</OPTION>
		<OPTION value="5">5</OPTION>
	</SELECT>
</DIV>
<DIV class="config_var">
	<LABEL for="##sizeIcon" class="field_label">Icon size</LABEL>
	<SELECT id="##sizeIcon">
		<OPTION value="0">Original</OPTION>
		<OPTION value="16">16x16</OPTION>
		<OPTION value="32">32x32</OPTION>
	</SELECT>
</DIV>

<DIV class="testicon">
	<DIV>
		<IMG id="##testicon" name="##testicon">
	</DIV>
	<INPUT id="##test" type="text" placeholder="Enter any number for test">
</DIV>
<DIV class="config_buttons">
	<BUTTON id="##saveBtn" title="Save settings" class="saveclose_buttons">Save</BUTTON>
	<BUTTON id="##cancelBtn" title="Close window" class="saveclose_buttons">Cancel</BUTTON>
	<DIV class="reset_holder">
		<A id="##reset" href="#" title="Reset fields to default values" class="reset" name="##reset">Reset to defaults</A>
	</DIV>
</DIV>

*/}.toString().slice(14,-3).split("*//*").join("*/").replace(/##/g, configPrefix);

for(let i in prefsDefault)
{
	prefs[i] = i in _prefs ? _prefs[i] : prefsDefault[i];
	$(configPrefix + i).addEventListener("input", configInput, true);
	$(configPrefix + i).value = prefs[i];
}
prefsUpdate();

testField = $(configPrefix + "test");
testField.addEventListener("input", configInput, true);

$(configPrefix + "reset").addEventListener("click", function(e)
{
	e.preventDefault();
	e.stopPropagation();
	configReset(e);
}, false);

testField.addEventListener("keypress", validateNumber, false);
$(configPrefix + "saveBtn").addEventListener("click", configSave, false);
$(configPrefix + "cancelBtn").addEventListener("click", configClose, false);
document.body.addEventListener("keypress", function(e)
{
	if (configOpened && e.keyCode == e.DOM_VK_ESCAPE)
		configClose();

	if (configOpened && e.keyCode == e.DOM_VK_RETURN && e.target.id && e.target.id.replace(configPrefix, "") in prefs)
		configSave();

}, true);

testImg = $(configPrefix + "testicon");
loop();

GM_registerMenuCommand(title, function () { configOpen(); });




/*
setTimeout(function()
{
	let prefs = {
		position: 0, //0 = top-left, 1 = top-right, 2 = bottom-right, 3 = bottom-left
		offsetX: 0, //move badge away from x egde
		offsetY: 0, //move badge away from y edge
		textSize: 3, //text size, 0 = auto, 1 = 5px, 2 = 10px, so on
		textMargin: -1, //margin around text, use negative number for auto scale based on text size
		textColor: "#000000", // text color
		backgroundColor: "#FFFFFF", //background color
		borderColor: "#B90000", //border color
		borderWidth: 1, //border width, -1 = auto based on text size
		borderRadius: 0, //border corners radius
		sizeIcon: 32, //image size in pixels, 0 = original
	},
	opt = {
		"tl" : {
			position: 0,
		},
		"tr" : {
			position: 1,
		},
		"br" : {
			position: 2,
		},
		"bl" : {
			position: 3,
		},
		"stl" : {
			sizeIcon: 16,
			textSize: 0,
			position: 0,
		},
		"str" : {
			sizeIcon: 16,
			textSize: 0,
			position: 1,
		},
		"sbr" : {
			sizeIcon: 16,
			textSize: 0,
			position: 2,
		},
		"sbl" : {
			sizeIcon: 16,
			textSize: 0,
			position: 3,
		},
	},
	div = document.createElement("div");
	document.body.appendChild(div);
	div.style.position = "absolute";
	div.style.backgroundColor = "white";
	div.style.zIndex = 9999999;
	for(let o in opt)
	{
		for(let p in opt[o])
			prefs[p] = opt[o][p];

		for(let i = 0; i < 11; i++)
		{
			let img = document.createElement('img'),
					a = document.createElement("a"),
					p = clone(prefs),
					v = i < 10 ? i : "x";
			setTimeout(function()
			{
				img.src = drawText(String(v), p);
				a.href = img.src;
			},100);
			a.setAttribute("download", "plex_" + o + "_" + v + ".png");
			a.appendChild(img);
			div.appendChild(a);
		}
		div.appendChild(document.createElement("br"));
	}
	let im = document.createElement("img");
	im.src = img.src;
	div.appendChild(im);
}, 3000);
*/