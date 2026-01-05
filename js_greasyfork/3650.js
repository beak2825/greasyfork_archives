// ==UserScript==
// @name           Get Fullsize Image for Naver
// @namespace      http://userscripts.org/users/mizuho
// @description    Get original image file link in Naver
// @include        http://blog.naver.com/*
// @include        http://cafe.naver.com/*
// @copyright      2013 by Mizuho
// @license        (CC) Attribution Non-Commercial Share Alike; http://creativecommons.org/licenses/by-nc-sa/2.0/kr/
// @version        1258306524560; Mon Nov 16 2009 02:35:24 GMT+0900
// @injectframes   1
// @downloadURL https://update.greasyfork.org/scripts/3650/Get%20Fullsize%20Image%20for%20Naver.user.js
// @updateURL https://update.greasyfork.org/scripts/3650/Get%20Fullsize%20Image%20for%20Naver.meta.js
// ==/UserScript==

(function()
{

	var intervalID;
	var domain = window.location.host;

	start();

	function start()
	{
		// For Blog
		if (domain.toLowerCase().indexOf("blog.")>-1)
		{
			var pagecontainer=document;
			if (!pagecontainer) return;
			for (var i=0; i<pagecontainer.images.length; i++) 
			{
				var imgobj = pagecontainer.images[i];
				if (imgobj != null) 
				{
					var link = imgobj.getAttribute('src');
					var newlink = link.replace(/postfiles([0-9]+)/gi, "blogfiles");
					link = newlink.replace(/[?]type=w([0-9]+)/gi, "");
					imgobj.setAttribute('src', link);
				}
			}
		}

		/* For Cafe */
		if (domain.toLowerCase().indexOf("cafe.")>-1)
		{
			var pagecontainer=document.getElementById('cafe_main').contentWindow.document;
			if (!pagecontainer) return;
			for (var i=0; i<pagecontainer.images.length; i++) 
			{
				var imgobj = pagecontainer.images[i];
				if (imgobj != null) 
				{
					var link = imgobj.getAttribute('src');
					if (link == null) continue;
					var newlink = link.replace(/cafeptthumb([0-9]+).phinf/gi, "cafefiles");
					link = newlink.replace(/[?]type=w([0-9]+)/gi, "");
					imgobj.setAttribute('src', link);
				}
			}

			for (var i=0; i<pagecontainer.embeds.length; ++i) 
			{
				var obj = pagecontainer.embeds[i];
				if (obj != null) 
				{
					var param_movie = "";
					var param_var = "";
					for (var o_i = 0; o_i<obj.parentElement.children.length; ++o_i)
					{
						var child_obj = obj.parentElement.children[o_i];
						if (child_obj.name == "movie" && /videofarm.daum.net/gi.test(child_obj.value))
							param_movie = child_obj.value;
						else if (child_obj.name == "flashvars")
							param_var = child_obj.value;
					}
					if (param_movie != "" && param_var != "")
					{
						obj.parentElement.outerHTML = "<a href='" + param_movie + "?" + param_var + "' target='blank'>영상 보기</a>";
						--i;
					}
				}
			}
		}
	}
})();