// ==UserScript==
// @name          pixiv direct original image link
// @namespace     pixiv
// @version       1.92
// @description   On page with thumbnails of all works makes thumbnails link to actual fullsize images
// @homepage      https://greasyfork.org/ru/scripts/108-pixiv-direct-original-image-link
// @match         http://www.pixiv.net/member_illust.php*id*
// @match         http://*.pixiv.net/img*
// @run_at        document_end
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/108/pixiv%20direct%20original%20image%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/108/pixiv%20direct%20original%20image%20link.meta.js
// ==/UserScript==

if(document.location.hostname != "www.pixiv.net") // manga fix
{
	if(document.body.innerHTML.indexOf("This Page is Not Found") == 4 && document.referrer.indexOf("http://www.pixiv.net/member_illust.php?id=") == 0)
	{
		var newpage = document.location.href.substr(document.location.href.lastIndexOf("/")+1);
		newpage = newpage.substring(0, newpage.indexOf('.'));
		document.location.replace("http://www.pixiv.net/member_illust.php?mode=manga&illust_id=" + newpage);
	}
	return false;
}
else if(document.referrer.indexOf("http://www.pixiv.net/") != 0 && document.querySelector("div.errorArea"))
{
	var newpage = document.location.href.substr(document.location.href.lastIndexOf("=")+1);
	window.history.pushState(null,null,"http://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + newpage); // referrer spoof
	document.location.replace("http://www.pixiv.net/member_illust.php?mode=ugoira_view&illust_id=" + newpage);
	return false;
}

var allImgs, thisImgDiv, src, txt, elmNewContent, profIMG, mangafix = false;

profIMG = document.body.querySelector("img.user-image");
if(!profIMG){return false;}
else{profIMG = profIMG.src;}
if(profIMG.indexOf("http://source.pixiv.net") == -1)
{
	profIMG = profIMG.substring(0, profIMG.lastIndexOf('/')) + "/";
	profIMG = profIMG.replace('profile', 'img');
}
else // no avatar, use BG
{
	var fn;
	var f = document.getElementsByTagName("style");
	for(c=0;c<f.length;c++) 
	{
		fn = f[c].innerHTML.indexOf('url(');
		if(fn != -1)
		{
			profIMG = f[c].innerHTML.substr(fn+5, f[c].innerHTML.indexOf(')', fn+6)-fn-6);
			profIMG = profIMG.replace('/profile/', '/img/');
			profIMG = profIMG.substring(0, profIMG.lastIndexOf('/')+1);
			break;
		}
	}
}

allImgs = document.body.querySelectorAll("img._thumbnail");

for (var i = 0; i < allImgs.length; i++) 
{
    var thisImgDiv = allImgs[i].parentNode;
	if(allImgs[i].src.indexOf("_master") != -1) // new
	{
		if(thisImgDiv.parentNode.className.indexOf(" multiple ") != -1)
		{
			thisImgDiv.parentNode.href = "http://www.pixiv.net/member_illust.php?mode=manga&illust_id=" + thisImgDiv.parentNode.href.substr(thisImgDiv.parentNode.href.lastIndexOf("=")+1);
		}
		else
		{
			var original_image = allImgs[i].src.replace('img-master', 'img-original');
			original_image = original_image.replace('c/150x150', '');
			original_image = original_image.replace('_master1200', '');
			original_image = original_image.replace('t//', 't/');
			original_image = original_image.replace('.jpg', '.png');
			thisImgDiv.parentNode.href = original_image;
		}
	}
	else // old, still used
	{
		var number = allImgs[i].src.substr(allImgs[i].src.lastIndexOf("/")+1);
		number = number.replace('_s', '');
		thisImgDiv.parentNode.href = profIMG + number;
	}
			
	thisImgDiv.parentNode.target = "_blank";
}
