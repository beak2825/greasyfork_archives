// ==UserScript==
// @name        PotPlayer forum breadcrumbs
// @namespace   V@no
// @description Add breadcrumbs on PotPlayer's forum
// @include     https://potplayer.daum.net/forum/*
// @version     1.5.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29732/PotPlayer%20forum%20breadcrumbs.user.js
// @updateURL https://update.greasyfork.org/scripts/29732/PotPlayer%20forum%20breadcrumbs.meta.js
// ==/UserScript==

var inToolbar = true; //show it at top toolbar? (true or false)


var betaUrl = "http://t2.daumcdn.net/potplayer/beta/PotPlayerSetup.exe",
		bc = document.getElementsByClassName("btn-breadcrumb"),
		style = document.createElement("style"),
		css;


function _$(id)
{
	return document.getElementById(id);
}

function log(t)
{
	console.log(t);
}

function cs(id, data)
{
	let r = null;
	if (typeof(data) == "undefined")
	{
		r = cs.cookies(id);
		try
		{
			r = JSON.parse(r);
		}catch(e){}
	}
	else
	{
		try
		{
			r = cs.cookies(id, JSON.stringify(data));
		}
		catch(e){}
	}
	return r;
}
//https://gist.github.com/bronson/6707533
cs.cookies = function(name, value, ms)
{
	if(arguments.length < 2)
	{
		// read cookie
		let cookies = document.cookie.split(';');
		for(let i=0; i < cookies.length; i++)
		{
			let c = cookies[i].replace(/^\s+/, '');
			if(c.indexOf(name + '=') == 0)
			{
				return decodeURIComponent(c.substring(name.length+1).split('+').join(' '));
			}
		}
		return null;
	}

	// write cookie
	let date = new Date();
	if (typeof(ms) == "undefined")
		ms = 864000000000;

	date.setTime(date.getTime() + ms);
	document.cookie = name + "=" + encodeURIComponent(value) + (ms ? ";expires=" + date.toGMTString() : '') + ";path=/";
	return true;
}

function ls(id, data)
{
	let r;
	if (typeof(data) == "undefined")
	{
		try
		{
			r = localStorage.getItem(id);
		}
		catch(e)
		{
			return cs(id);
		}
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
		catch(e)
		{
			r = cs(id, data);
		}
	}
	return r;
}

function multiline(func, ws)
{
	func = func.toString();
	func = func.slice(func.indexOf("/*") + 2, func.lastIndexOf("*/")).split("*//*").join("*/");
	return ws ? func : func.replace(/[\n\t]*/g, "");
}

//set link on logo to home page
document.getElementsByClassName("navbar-header")[0].getElementsByTagName("a")[0].setAttribute("href", "../");

var inToolbar,
		bcBefore;


if (bc.length && _$("search"))
{
	inToolbar = _$("search").nextSibling;
	bcBefore = bc[0].nextSibling;
}

css = multiline(function(){/*
/* center breadcrumbs in the toolbar *//*
body[bc="1"] .btn-breadcrumb
{
	margin-top: 8px;
	margin-left: -10px;
}

/* move everything else down *//*
#content-wrapper:not([bc="1"])
{
	margin-top: 50px;
}

/* disallow menu bar wrap if it doesn't fit into window *//*
body:not([bc="1"]) .navbar-fixed-top
{
	max-height: 50px;
}

/* move everything else down *//*
body[bc="2"] #content-wrapper
{
	margin-top: 83px;
}

/* make breadcrumbs at fixed position so it always visible *//*
body[bc="2"] .btn-breadcrumb
{
	margin-top: -33px;
	position: fixed;
	z-index: 9999;
}

li.checkbox
{
	margin: 0;
}
.dropdown-menu > li > label
{
	display: block;
	padding-right: 20px;
	padding-left: 20px;
	clear: both;
	font-weight: 400;
	line-height: 1.42857143;
	color: #333;
	white-space: nowrap;
}
*/});

style.innerHTML = css;
document.getElementsByTagName("head")[0].appendChild(style);

//latest beta
let nav, ul, lis;
if ((nav = document.evaluate('.//nav[@class="navbar navbar-default navbar-fixed-bottom hidden-sm hidden-xs"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0))
		&& (ul = nav.getElementsByTagName("ul")[0])
		&& (lis = ul.getElementsByTagName("li")).length)
{
	let li = document.createElement("li"),
			a = document.createElement("a");

	li.appendChild(a);
	a.href = betaUrl;
	a.innerHTML = '<i class="fa fa-download"></i> Latest Beta';
	ul.appendChild(li);
}

//auto login checkbox
let pass = _$("navloginform"),
		found = false;

if (pass)
{
	let inputs = pass.getElementsByTagName("input");

	for(let i = 0; i < inputs.length; i++)
	{
		if (inputs[i].name == "autologin")
			found = i;

		if (inputs[i].name == "password")
			pass = inputs[i];
	}
	if (found === false)
	{
		let checkbox = document.createElement("div");
		checkbox.className = "checkbox";
		checkbox.innerHTML = '<label for="autologin"><input name="autologin" id="autologin" tabindex="4" type="checkbox"> Log me on automatically each visit</label><br><label for="viewonline"><input name="viewonline" id="viewonline" tabindex="5" type="checkbox"> Hide my online status this session</label>';
		_$("navloginform").insertBefore(checkbox, pass.nextSibling);
	}
}

//private messages counter
try
{
	let numObj = document.getElementsByClassName("label label-primary"),
			btn = document.getElementsByClassName("btn btn-primary btn-labeled navbar-btn dropdown-toggle");
	if (numObj.length && btn.length)
	{
		numObj = numObj[0].getElementsByTagName("strong")[0].cloneNode(true);
		let num = parseInt(numObj.textContent),
				btnObj = btn[0].getElementsByClassName("btn-label")[0];

		numObj.style.paddingLeft = "5px";
		if (num > 0)
		{
			btn[0].className = btn[0].className.replace("btn-primary", "btn-danger");
			btnObj.appendChild(numObj);
		}
	}
}
catch(e)
{
	log(e);
}

let menu = document.evaluate('.//ul[@class="dropdown-menu"]//li[@class="divider"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0),
		li = document.createElement("li"),
		label = document.createElement("label"),
		input = document.createElement("input");

input.type = "checkbox";
label.textContent = "Breadcrumbs on top";
label.insertBefore(input, label.firstChild);
li.appendChild(label);
li.className = "checkbox";
menu.parentNode.insertBefore(li, menu.nextSibling);

label.addEventListener("click", function(e)
{
	e.stopPropagation();
}, true);
input.addEventListener("input", function(e)
{
	e.preventDefault();
	if (++input.value > 2)
		input.value = 0;

	checkboxToolbar(input.value);
}, true);

function checkboxToolbar(val)
{
	if (!inToolbar)
		return;

	if (typeof(val) == "undefined")
	{
		val = Number(ls("breadCrumbs"));
		if (typeof(val) != "number")
			val = 1;

	}
	else
	{
		val = Number(val);
		if (typeof(val) != "number")
			val = 1;

		ls("breadCrumbs", val);
	}
 	if (val == 1)
	{
		//insert breadcrumbs to top toolbar
		inToolbar.parentNode.insertBefore(bc[0], inToolbar);
	}
	else
	{
		bcBefore.parentNode.insertBefore(bc[0], bcBefore);
	}
	input.indeterminate = (val == 2);
	if (val)
		input.checked = true;
	else
		input.checked = false;

	input.value = val;
	document.body.setAttribute("bc", val);
}
checkboxToolbar();

