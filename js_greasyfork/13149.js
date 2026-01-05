// ==UserScript==
// @name			ETI Image Transload
// @namespace		cloaknsmoke
// @description 	Adds a context menu item for transloading images
// @require			https://greasyfork.org/scripts/7079-binary-library/code/Binary%20library.js?version=28932
// @include			*
// @exclude			http://endoftheinter.net*
// @exclude			https://endoftheinter.net*
// @exclude			http://*.endoftheinter.net*
// @exclude			https://*.endoftheinter.net*
// @grant			GM_xmlhttpRequest
// @version			3
// @downloadURL https://update.greasyfork.org/scripts/13151/ETI%20Image%20Transload.user.js
// @updateURL https://update.greasyfork.org/scripts/13151/ETI%20Image%20Transload.meta.js
// ==/UserScript==

last_clicked = undefined
document.addEventListener("contextmenu", function(e)
{
	if(e.target instanceof HTMLImageElement)
	{
		last_clicked = e.target.src
		if(e.target.parentNode instanceof HTMLAnchorElement)
			div = find_closest_div(e.target)
		else
			div = e.target
		if(div != undefined && !div.hasAttribute("contextmenu"))
		{
			div.setAttribute("contextmenu", "ETI_transload")
			menu = document.createElement("menu")
			menu.setAttribute("type", "context")
			menu.setAttribute("id", "ETI_transload")
			menu_item = document.createElement("menuitem")
			menu_item.setAttribute("label", "Transload")
			menu.appendChild(menu_item)
			div.appendChild(menu)
		}
	}
})

document.addEventListener("click", function(e)
{
	if(e.target instanceof HTMLMenuItemElement && e.target.label == "Transload")
		transload(last_clicked)
})

function find_closest_div(element)
{
	if(element.parentNode == undefined)
		return undefined
	if(!(element.parentNode instanceof HTMLDivElement))
		return find_closest_div(element.parentNode)
	return element.parentNode
}

function transload (href)
{
	if(last_clicked == undefined)
	{
		alert("Can't find the image. Please report this to timewaster.")
		return
	}
	BinaryRes.get({url: href, callback: transload_got});
}

function transload_got (resp)
{
	filename = (resp.finalUrl.split('/') || ['something.jpg']).pop();
	BinaryRes.post(
	{
		url: 'http://u.endoftheinter.net/u.php',
		callback: transload_posted,
		data: 
		{
			file: 
			{
				value: BinaryRes._clean(resp.responseText),
				filename: filename,
				type: BinaryRes.guessType(resp.responseText)
			}
		}
	});
}

function transload_posted (resp) {
	document.body.style.cursor = 'default';
	var html = document.createElement('html');
	html.innerHTML = resp.responseText;
	// newly uploaded images are always the first to be returned
	var value = html.getElementsByClassName('img')[0].getElementsByTagName('input')[0].value;
	prompt('Here is your image', value);
}