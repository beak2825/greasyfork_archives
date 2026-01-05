// ==UserScript==
// @name			Ignorator
// @namespace		cloaknsmoke
// @description 	A normal ignorator, but just automatically hides posts by users. You can unhide the messages individually.
// @include			http://boards.endoftheinter.net/*
// @include			http://archives.endoftheinter.net/*
// @include			https://boards.endoftheinter.net/*
// @include			https://archives.endoftheinter.net/*
// @grant			GM_getValue
// @grant			GM_setValue
// @version			4
// @downloadURL https://update.greasyfork.org/scripts/11010/Ignorator.user.js
// @updateURL https://update.greasyfork.org/scripts/11010/Ignorator.meta.js
// ==/UserScript==

function createButton(element, string, func)
{
	var text = document.createElement("span"); 
	text.innerHTML = "&nbsp;| "; 
	element.appendChild(text); 
	var link = document.createElement("a");
	link.href = "javascript:void(0)";
	link.innerHTML = string;
	element.appendChild(link);
	link.addEventListener("click", func, false);
}

function replaceButton(element, oldButton, string, func)
{
	var link = document.createElement("a");
	link.href = "javascript:void(0)";
	link.innerHTML = string;
	element.replaceChild(link, oldButton);
	link.addEventListener("click", func, false);
}

function findIgnoreButton(element)
{
	var siblings = element.children;
	for(var i = 0; i < siblings.length; i++)
		if(siblings[i].tagName == 'A' && (siblings[i].innerHTML == "Ignorate" || siblings[i].innerHTML == "Unignorate"))
			return siblings[i]
}

function ignorate(element)
{
	var user = ""
	for(var i = 0; i < element.parentNode.children.length;i++)
	{
		var el = element.parentNode.children[i]
		if(el instanceof HTMLAnchorElement && el.href.indexOf("user") != -1)
			user = el.href
	}
	user = user.substring(user.indexOf("=")+1)
	var messages = document.getElementsByClassName("message-container"); 
	for (var i = 0; i < messages.length; i++) 
	{ 
		var post = messages[i]; 
		for (var j = 0; j < post.childNodes.length; j++) 
		{ 
			var mt = post.childNodes[j];
			if (mt.nodeName.toUpperCase() != "#TEXT" && mt.className.indexOf("message-top") >= 0) 
			{
				for(var k = 0;k < mt.children.length;k++)
				{
					el = mt.children[k]
					if(el instanceof HTMLAnchorElement && el.href.indexOf("user=") != -1)
						if(el.href.indexOf(user) != -1)
						{
							toggleHide(mt.firstChild, "hide")
							replaceButton(mt, findIgnoreButton(mt), "Unignorate", function(){unignorate(this)})
						}
				}
				
			}
		}
	}
	
	var users = GM_getValue('users')
	if(users == undefined)
	{
		users = ""
	}
	if(users.indexOf(user) == -1)
	{
		users = users + " " + user
		GM_setValue('users', users)
	}
}

function unignorate(element)
{
	var user = ""
	for(var i = 0; i < element.parentNode.children.length;i++)
	{
		var el = element.parentNode.children[i]
		if(el instanceof HTMLAnchorElement && el.href.indexOf("user") != -1)
			user = el.href
	}
	user = user.substring(user.indexOf("=")+1)
	var messages = document.getElementsByClassName("message-container"); 
	for (var i = 0; i < messages.length; i++) 
	{ 
		var post = messages[i]; 
		for (var j = 0; j < post.childNodes.length; j++) 
		{ 
			var mt = post.childNodes[j];
			if (mt.nodeName.toUpperCase() != "#TEXT" && mt.className.indexOf("message-top") >= 0) 
			{
				for(var k = 0;k < mt.children.length;k++)
				{
					el = mt.children[k]
					if(el instanceof HTMLAnchorElement && el.href.indexOf("user=") != -1)
						if(el.href.indexOf(user) != -1)
						{
							toggleHide(mt.firstChild, "unhide")
							replaceButton(mt, findIgnoreButton(mt), "Ignorate", function(){ignorate(this)})
						}
				}
			}
		}
	}
	
	var users = GM_getValue('users')
	if(users == undefined)
	{
		GM_setValue('users',"")
		return
	}
	if(users.indexOf(user) != -1)
	{
		users  = users.replace(user,"").replace("  ", " ").trim()
		GM_setValue('users', users)
	}
}

function toggleHide(element, string)
{
	//if you have the post hider script it will toggle to hide/unhide message
	var siblings = element.parentNode.children;
	var hide = false
	var foundButton = false
	for(var i = 0; i < siblings.length; i++)
	{
		if(siblings[i].tagName == 'A' && (siblings[i].innerHTML == "Hide Message" || siblings[i].innerHTML == "Unhide Message"))
		{
			if(string == "hide")
			{
				siblings[i].innerHTML = "Unhide Message"
				hide = true
			} else
			{
				siblings[i].innerHTML = "Hide Message"
				hide = false
			}
			foundButton = true
		}
	}
	var sib = element.parentNode.nextSibling;
	if(!foundButton)
		if(sib.getAttribute("hidden") == "hidden")
			sib.removeAttribute("hidden")
		else
			sib.setAttribute("hidden", "hidden")
	else
		if(hide)
			sib.setAttribute("hidden", "hidden")
		else
			sib.removeAttribute("hidden")
}

function revealTopics()
{
	var topics = document.getElementsByTagName("tbody")[1].children
	for(var i = 1;i < topics.length; i++)
	{
		var parent = topics[i].parentNode
		var topic = topics[i]
		for(var j = 0;j < topic.children.length;j++)
			if(topic.children[j].getAttribute("hidden") == "hidden")
				topic.children[j].removeAttribute("hidden")
	}
}

function topic()
{
	var messages = document.getElementsByClassName("message-container"); 
	for (var i = 0; i < messages.length; i++) 
	{ 
		var post = messages[i]; 
		for (var j = 0; j < post.childNodes.length; j++) 
		{ 
			var el = post.childNodes[j]; 
			if (el.nodeName.toUpperCase() != "#TEXT") 
				if (el.className.indexOf("message-top") >= 0) 
				{ 
					createButton(el, "Ignorate", function(){ignorate(this)})
				}
		}
	}
	//GM_setValue('users',"")
	var ar = GM_getValue('users')
	if(ar == undefined)
	{
		GM_setValue('users', "")
		ar = ""
	}
	ar = ar.split(" ")
	var messages = document.getElementsByClassName("message-container"); 
	for (var i = 0; i < messages.length; i++) 
	{
		var post = messages[i]; 
		for (var j = 0; j < post.childNodes.length; j++) 
		{ 
			var mt = post.childNodes[j];
			if (mt.nodeName.toUpperCase() != "#TEXT" && mt.className.indexOf("message-top") >= 0) 
			{
				var user = ""
				for(var k = 0;k < mt.children.length;k++)
				{
					var el = mt.children[k]
					if(el instanceof HTMLAnchorElement && el.href.indexOf("user=") != -1)
						user = el.href.substring(el.href.indexOf("=")+1)
				}
				if(ar.indexOf(user) != -1)
				{
					toggleHide(mt.firstChild, "hide")
					replaceButton(mt, findIgnoreButton(mt), "Unignorate", function(){unignorate(this)})
				}
			}
		}
	}
	var mut = new MutationObserver(function(a)
	{
		ar = GM_getValue('users')
		if(ar == undefined)
		{
			GM_setValue('users', "")
			ar = ""
		}
		ar = ar.split(" ")
		a.forEach(function(val, i)
		{
			if(val.addedNodes.length > 0 && !(val.addedNodes[0].tagName === undefined) && val.addedNodes[0].tagName == "DIV")
			{
				var mt = val.addedNodes[0].getElementsByClassName("message-top")[0];
				var user = ""
				for(var k = 0;k < mt.children.length;k++)
				{
					var el = mt.children[k]
					if(el instanceof HTMLAnchorElement && el.href.indexOf("user=") != -1)
						user = el.href.substring(el.href.indexOf("=")+1)
				}
				if(ar.indexOf(user) != -1)
				{
					toggleHide(mt.firstChild, "hide")
					createButton(mt, "Unignorate", function(){unignorate(this)})
				} else
					createButton(mt, "Ignorate", function(){ignorate(this)})
			}
		})
	})
	var config = { childList: true };
	var divs = document.getElementsByTagName("div")
	for(var i = 0; i < divs.length; i++)
	{
		if(divs[i].id == "u0_1")
		{
			mut.observe(divs[i],config);
		}
	}
}

function topicList()
{
	var ar = GM_getValue('users')
	if(ar == undefined)
	{
		GM_setValue('users', "")
		ar = ""
	}
	ar = ar.split(" ")
	var topics = document.getElementsByTagName("tbody")[1].children
	for(var i = 1;i < topics.length; i++)
	{
		var user = topics[i].children[1].firstChild.href
		if(user == undefined)
			continue
		user = user.substring(user.indexOf("=") + 1)
		if(ar.indexOf(user) != -1)
		{
			var parent = topics[i].parentNode
			var topic = topics[i]
			var brother = topic.nextSibling
			for(var j = 0;j < topic.children.length;j++)
				topic.children[j].setAttribute("hidden", "hidden")
		}
	}
	var userbar = document.getElementsByClassName("userbar")[0]
	var spacer = document.createElement("span")
	spacer.innerHTML = "&nbsp;|&nbsp;"
	var button = document.createElement("a")
	button.innerHTML = "Reveal Ignorated Topics"
	button.href = "javascript:void(0)"
	button.onclick = revealTopics
	userbar.appendChild(spacer)
	userbar.appendChild(button)
}
//create buttons if it's a topic
if(location.href.indexOf("showmessages") != -1)
{
	var temp = document.getElementsByTagName("h2")[0].firstChild.children
	var tags = []
	for(var i = 0;i < temp.length; i++)
	{
		if(temp[i].tagName.toUpperCase() == 'A')
			tags.push(temp[i].childNodes[0].data)
	}
	//this doesn't even make sense for anon
	if(tags.indexOf("Anonymous") == -1)
	{
		topic()
	}
}
//bubble topics to bottom and hide if topic list
if(location.href.indexOf("topics") != -1)
{
	topicList()
}