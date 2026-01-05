// ==UserScript==
// @name        Howrse Pack
// @namespace   myHowrse
// @author      daexion
// @description Collection of small scripts into one script
// @include     http://*.howrse.com/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/2157/Howrse%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/2157/Howrse%20Pack.meta.js
// ==/UserScript==
setTimeout(bannerBorder,500);

//	Modifies the properties of the element that lets you give tickets to players on your friend list
if(document.URL.indexOf("/operation/tombola/") > 0)
{
	moduleList = document.getElementsByClassName("module-pattern spacer-large-bottom ra-m pa-m fz-m ba-green-dark bo-n co-green");

	for(i = 0;i < moduleList.length;++i)
	{
		moduleList[i].setAttribute("class","module-pattern spacer-large-bottom ra-m pa-m fz-m ba-green-light bo-n co-n");
	}
}
//	Modifies the horse links on your EC horses page to link to the private page instead of the public page.
if(document.URL.indexOf("howrse.com/centre/chevaux/") > 0)
{
	horsesList = document.getElementsByClassName("horsename");
	for(i = 0;i < horsesList.length;++i)
	{
		oldSrc = horsesList[i].getAttribute("href");
		horsesList[i].setAttribute("href","/elevage/chevaux/cheval?id" + oldSrc.substring(oldSrc.indexOf("="),oldSrc.length));
	}
}

//	Modifies the banner ad div
function bannerBorder()
{
	bannerAd = document.getElementById("banner");
	if(bannerAd.getAttribute("style") == "margin-left: 8em;")
	{
		subBanner = bannerAd.getElementsByTagName("div");
		subBanner[1].setAttribute("style","min-height:94px;");
	}
	else bannerAd.setAttribute("style","");
}