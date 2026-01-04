// ==UserScript==
// @name           Reddit Comment Delete
// @description Automatically removes all comments one-by-one from the reddit profile page. THIS WILL RUN IF THE SCRIPT IS ENABLED!
// @license        GNU GPLv3
// @namespace      https://greasyfork.org/en/scripts/475588-reddit-comment-delete
// @match        https://www.reddit.com/user/*
// @version 1.1
// @downloadURL https://update.greasyfork.org/scripts/475588/Reddit%20Comment%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/475588/Reddit%20Comment%20Delete.meta.js
// ==/UserScript==

location.href = "javascript:(" + function() 
{



		var deleted = 0;
		var links = document.getElementsByTagName("a");
		var i = 0;
		var d = 0;
	
		for (i = 0; i < links.length; i++) 
		{
			
			var l = links[i];
			if (l.href) 
			{
				if (l.innerHTML == "delete") 
				{
					toggle(l);   
					d = 1;  
				}  
				if (d && (l.innerHTML == "yes")) 
				{ 
					deleted++;
					
					
					l.id='xxx'+i;

					var butter="document.getElementById('xxx"+i+"')";
					
					var f=function(a)
					{
						hide_thing(a);						
					};
					
					setTimeout("change_state( "+butter+", 'del', hide_thing)", 1000*deleted); 		
					
					d=0;
				} 
			} 
			
		} 
		
		if(deleted>0)
		{
			setTimeout("location.reload(true);",1000*(deleted+1));
		}
		
} + ")()";	

		
