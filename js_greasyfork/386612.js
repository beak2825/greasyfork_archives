// ==UserScript==
// @name         MuchosCleaner
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://downloads.muchohentai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386612/MuchosCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/386612/MuchosCleaner.meta.js
// ==/UserScript==


function changeButtonText(myText)
{
    var tt = document.getElementsByClassName('btn');
    var intText = "Start Download";

    for (var i = 0; i < tt.length; i++) {
        var yy = tt[i].value;

        if (yy.includes(intText))
        {
           tt[i].value= myText
        }
    }
}


function removeIframe() {

	var ads1 = "a.adtng.com";
	var ads2 = "eki.trafficsan.com";
        var ads3 = "juicyads.com";
        var ads4 = "chaturbate.com";

	var iframes = document.querySelectorAll('iframe');

	for (var i = 0; i < iframes.length; i++) {
		var txt = iframes[i].src;
		if (txt.includes(ads1)||txt.includes(ads2)||txt.includes(ads3)||txt.includes(ads4)) {
		iframes[i].parentNode.removeChild(iframes[i]);
		}
	}
}


if (window.location.hostname=="downloads.muchohentai.com")
{
	// window.alert("correct");
	document.title="Hello World";

	var mySearch = document.getElementsByClassName("title m-b-md")
	mySearch[0].innerText="Download"

    var mySearch2 = document.getElementsByClassName("subtitle m-b-md")
	mySearch2[0].innerText="You can download it only 2 at the same time"

    removeIframe();
    changeButtonText("Take it");
}
