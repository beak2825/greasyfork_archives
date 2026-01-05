// ==UserScript==
// @name			Blankpost Hider
// @namespace		cloaknsmoke
// @description 	Hides posts that contain nothing but a sig.
// @include			http://boards.endoftheinter.net/showmessages.php*
// @include			http://archives.endoftheinter.net/showmessages.php*
// @include			https://boards.endoftheinter.net/showmessages.php*
// @include			https://archives.endoftheinter.net/showmessages.php*
// @grant			none
// @version			2
// @downloadURL https://update.greasyfork.org/scripts/13476/Blankpost%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/13476/Blankpost%20Hider.meta.js
// ==/UserScript==

function hidePost(post)
{
	post.lastChild.setAttribute("hidden", "hidden")
	//look for hider button
	headers = post.firstChild.children
	for(var x in headers)
	{
		if(headers[x] instanceof HTMLAnchorElement && headers[x].innerHTML == "Hide Message")
		{
			headers[x].innerHTML = "Unhide Message"
		}
	}
}

function blank(post)
{
	message = post.getElementsByClassName("message")[0]
	concat = ""
	for(var x in message.childNodes)
	{
		elem = message.childNodes[x]
		if(elem instanceof HTMLDivElement && elem.className == "imgs")
			concat += "image"
		else
			concat += printInner(elem)
	}
	if(concat.indexOf("---") == -1)
		message = concat
	else
		message = concat.substring(0,concat.lastIndexOf("---")).trim()
	return message == ""
}

function printInner(elem)
{
	if(elem instanceof Text)
		return elem.data
	if(elem instanceof HTMLElement)
	{
		if(elem.childNodes.length == 0)
			return elem.innerHTML
		else
		{
			concat = ""
			for(var x in elem.childNodes)
				concat += printInner(elem.childNodes[x])
			return concat
		}
	} else
		return ""
}

var messages = document.getElementsByClassName("message-container")

for(var x in messages)
	if(messages[x] instanceof HTMLDivElement && blank(messages[x]))
		hidePost(messages[x])
lastMessage = document.URL
if(lastMessage.indexOf("#m") != -1)
	lastMessage = lastMessage.substring(lastMessage.indexOf('#m'))
else
	lastMessage = undefined
if(lastMessage != undefined)
	location.href = lastMessage

//support livelinks
var mut = new MutationObserver(function(a)
{
	a.forEach(function(val, i)
	{
		for(var x in val.addedNodes)
		{
			var node = val.addedNodes[x]
			if(node instanceof HTMLDivElement)
			{
				node = node.getElementsByClassName("message-container")[0]
				if(blank(node))
					hidePost(node)
			}
		}
	});
})
var config = { childList: true, subtree: true };
var divs = document.getElementsByTagName("div")
for(var i = 0; i < divs.length; i++)
{
    if(divs[i].id == "u0_1")
        mut.observe(divs[i],config);
}