// ==UserScript==
// @name           delete all reddit comments
// @description deletes all reddit comments, enable this script to scrub your comment history
// @namespace      http://blah
// @include        http://www.reddit.com/user/*
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/1870/delete%20all%20reddit%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/1870/delete%20all%20reddit%20comments.meta.js
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

		
