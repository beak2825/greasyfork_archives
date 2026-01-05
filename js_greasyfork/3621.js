// ==UserScript==
// @name        block_faltu_on_projanmo
// @namespace   block_faltu
// @include     http://forum.projanmo.com/search-recent.html
// @description Block (hide) topics created by annoyed user on Recent Topic page 
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3621/block_faltu_on_projanmo.user.js
// @updateURL https://update.greasyfork.org/scripts/3621/block_faltu_on_projanmo.meta.js
// ==/UserScript==

function remove(){
	try
	{
		var faltu_users = ["zamanriyad1", "ভেজা বিড়াল"]; //Add users here 
		
		var elements = document.body.getElementsByClassName("item-starter");
		for (var j = 0, length_u = faltu_users.length; j < length_u; j++)
		{
			for (var i = 0, length = elements.length; i < length; i++)
			{                   
				if (elements[i].innerHTML.trim() == "লিখেছেন "+faltu_users[j])
				{
					elements[i].parentNode.parentNode.parentNode.style.display = "none";
				}
			}
		};
	}
	catch(err)
	{
		//bad luck!
	}
	
}
remove();