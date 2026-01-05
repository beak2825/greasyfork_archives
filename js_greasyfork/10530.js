// ==UserScript==
// @name         Pound Adopt Linker
// @version      0.0.1
// @description  When you adopt a adoptable, it links to the adoptable page.
// @author 		 Seiryuu
// @author       Richard Min
// @match        http://*.clickcritters.com/pound.php?act=adopt*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @namespace https://greasyfork.org/users/12560
// @downloadURL https://update.greasyfork.org/scripts/10530/Pound%20Adopt%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/10530/Pound%20Adopt%20Linker.meta.js
// ==/UserScript==
var f = $("td:contains('from your account and given you the following adoptable:')"); //find the div where the image is located


if(f.length) //if the page is the adopt page
{
	var img = f.find('img');
	var id = img.attr('src');
	id = id.substring(47,id.length-4); //extract the adopt id

	var url = '<a href="http://www.clickcritters.com/youradoptables.php?act=code&id='+id+'">'+'</a>';
	img.wrap(url);

}