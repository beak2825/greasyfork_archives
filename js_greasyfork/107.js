// ==UserScript==
// @name           DeviantArt direct download image
// @namespace      devart
// @include        http://*.deviantart.com/*
// @match          http://*.deviantart.com/*
// @grant          unsafeWindow
// @version 0.0.1.20140803173200
// @description Makes "download image" open in same window not in new little one
// @downloadURL https://update.greasyfork.org/scripts/107/DeviantArt%20direct%20download%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/107/DeviantArt%20direct%20download%20image.meta.js
// ==/UserScript==

function ev(q){return document.evaluate(q,document.body,null,9,null).singleNodeValue;}

if (window.location.href.match('http:\/\/.*\.deviantart\.com\/.*art\/.*')) 
{
    var alink = ev('.//a[contains(@class,"download")]');
    if (alink) 
	{
        alink.outerHTML = alink.outerHTML.replace("return D", "return window.location.href=this; D");
    }   
}

// they made some stupid background-loading instead of normal one, switching back to normal
if (typeof unsafeWindow === "undefined"){unsafeWindow = window;}
if (typeof exportFunction === "undefined")
{
	unsafeWindow.window.history.__proto__.pushState= function (a,b,url)
	{
		window.location.href = url;
	}
}
else // FF 31
{
	function Opn(a,b,url)
	{
		window.location.href = url;
	}
	exportFunction(Opn, unsafeWindow.window.history.__proto__, {defineAs: "pushState"});
}
