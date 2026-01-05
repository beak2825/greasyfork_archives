// ==UserScript==
// @name           Change Image Link To Image
// @namespace      http://userscripts.org/users/531617
// @description    replace full-size image from web
// @include        
// @copyright      2013 by Mizuho
// @license        (CC) Attribution Non-Commercial Share Alike; http://creativecommons.org/licenses/by-nc-sa/2.0/kr/
// @version        0.524
// @injectframes   1
// @downloadURL https://update.greasyfork.org/scripts/15230/Change%20Image%20Link%20To%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/15230/Change%20Image%20Link%20To%20Image.meta.js
// ==/UserScript==

(function()
{
	start();

	function start()
	{
		// Change Image Link To Image
		for( var i = 0; i < document.links.length; ++i )
		{
			var link = document.links[i].href;
// 2015.08.23
// fix image link detected
			if( /[.](jpg|jpeg|gif|png)/gi.test(link) )
//			if( /[.][jgp][pin][e]*[gf]/gi.test(link) )
			{
				if( !/searchbyimage/gi.test(link) )
				{
					var newlink = link.substring(link.lastIndexOf("http"), link.length);
// 2014.09.14
// 2ch jump link parsing
					newlink = newlink.replace(/(jump.2ch.net[\/][\?])/g, "");
					newlink = newlink.replace(/(http:[\/][\/]ime.nu[\/])/g, "http:\/\/");
// 2015.06.07
// 2ch.io
					newlink = newlink.replace(/(http:[\/][\/]2ch.io[\/])/g, "http:\/\/");
					newlink = newlink.replace(/([?].jpg)/g, "");
					newlink = newlink.replace(/(:large)$/g, ":orig");
// 2014.09.14 end
					newlink = decodeURIComponent(newlink.replace(/\+/g,  " "));
					var linklength = newlink.lastIndexOf("&title=");
					if( linklength < 0 )
						linklength = newlink.length;
					newlink = newlink.substring(0, linklength);
					document.links[i].outerHTML = "<img src='" + newlink + "'>";
					--i;
				}
			}
			else if(/image\d+\.html$/gi.test(link))
			{
				var style = document.links[i].getAttribute("style");
				regexp = /background-image\s*:.*url\((.*)\)/;
				results = regexp.exec(style);
				if (results !== null) {
					var newlink = results[1].replace(/^(\d+)_\d+(\..+)$/, "$1_615$2");
					document.links[i].outerHTML = "<img src='" + newlink + "' style='height:140px;width:140px'>";
					--i;
				}
			}
		}

// 2015.12.20
// replace forwarding image link
		var reg = /http:\/\/.+(http:\/\/.+)[.](jpg|jpeg|gif|png).+/;
		for( i = 0; i < document.images.length; ++i )
		{
			var imgobj = document.images[i];
			if( imgobj !== null )
			{
				link = imgobj.getAttribute('src');
				var result = decodeURIComponent(link).match(reg);
				if( result != null )
				{
					link = result[1] + '.' + result[2];
					imgobj.setAttribute('src', link);
				}
			}
		}
// 2015.12.20 end
	}
})();