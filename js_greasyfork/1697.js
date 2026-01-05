// ==UserScript==
// @name        BBG Hide Blocked GeekList Items
// @namespace   dschachtler.dssr.ch
// @include     http://www.boardgamegeek.com/geeklist/*
// @include     http://boardgamegeek.com/geeklist/*
// @include     http://www.videogamegeek.com/geeklist/*
// @include     http://videogamegeek.com/geeklist/*
// @include     http://www.rpggeek.com/geeklist/*
// @include     http://rpggeek.com/geeklist/*
// @version     5
// @description Collapses blocked geeklist items on BoardGameGeek.com and it's sister sites.
// @downloadURL https://update.greasyfork.org/scripts/1697/BBG%20Hide%20Blocked%20GeekList%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/1697/BBG%20Hide%20Blocked%20GeekList%20Items.meta.js
// ==/UserScript==

//unsafeWindow.GL_HideAllComments();

var items = document.getElementsByClassName("mb5");
for (var i = 0; i < items.length; i++)
{
	var item = items[i];
	var cmd = item.getElementsByClassName('commands');
	if (cmd && cmd.length > 0)
	{
		if (cmd[0].innerHTML.indexOf("Unblock") >= 0)
		{
			hideItem(item);
		}
	}
}
scrollToAnchor();

function hideItem(item)
{
	var id = item.getAttribute('id').substr(4);
	
	var comments = document.getElementById('comments_' + id);
	if (comments) comments.style.display = "none";
	
	var body = document.getElementById('body_listitem' + id);
	if (body)
	{
		for (var c = 0; c < body.childNodes.length; c++)
		{
			var child = body.childNodes[c];
			if (child.nodeName == "DD" && child.style) child.style.display = "none";
		}
	}
}

function scrollToAnchor()
{
	if (window.location.href.indexOf("#") >= 0)
	{
		window.location.href = window.location.href;
	}
}