// ==UserScript==
// @name           YouTube Downloader Converter MP3
// @description    A download button will be added to YouTube videos that allow you to download the video in MP3-format. No java required!
// @include        http://*youtube.*/*watch*
// @include        https://*youtube.*/*watch*
// @version        1.4.0
// @namespace https://greasyfork.org/users/31593
// @downloadURL https://update.greasyfork.org/scripts/17389/YouTube%20Downloader%20Converter%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/17389/YouTube%20Downloader%20Converter%20MP3.meta.js
// ==/UserScript==

// ==ChangeLog==
// @history        1.4.0  Server upgrade
// @history        1.3.1  Quick tweak
// @history        1.3.0  Compatible with the latest update
// @history        1.2.2  Server update
// @history        1.2.1  Server update
// @history        1.11 Server edit
// @history        1.00 Initial release.
// ==/ChangeLog==



function addbutton(){
console.log("dasd");
if (window.location.href.match(/youtube.com/i)) {
var DIV = document.createElement('span');
	//DIV.innerHTML = '';
	DIV.appendChild(document.createTextNode(''));
	DIV.style.cssFloat = "";
var divp = document.getElementById("watch7-user-header");
if (divp)
	divp.appendChild(DIV);

var url = encodeURIComponent(window.location);


var INAU = document.createElement('input');
	INAU.setAttribute('type','button');
	INAU.setAttribute('name','INAU');
	INAU.setAttribute('value','Download');
	INAU.setAttribute('class','yt-uix-tooltip-reverse yt-uix-button yt-uix-button-default yt-uix-tooltip');
	INAU.style.borderLeft = "";
	INAU.style.marginRight = "";
	INAU.style.marginLeft = "";
	INAU.style.borderRadius = "0 3px 3px 0";
	DIV.appendChild(INAU);
	INAU.addEventListener('click', function(){window.open("http://www.mp3convert.me/index.php?url=" + url + ""); self.focus();}, false);
}
}


if (window.location.href.match(/youtube.com/i)) {
var DIV = document.createElement('span');
	//DIV.innerHTML = '';
	DIV.appendChild(document.createTextNode(''));
	DIV.style.cssFloat = "";
var divp = document.getElementById("watch7-user-header");
if (divp)
	divp.appendChild(DIV);

var url = encodeURIComponent(window.location);


var INAU = document.createElement('input');
	INAU.setAttribute('type','button');
	INAU.setAttribute('name','INAU');
	INAU.setAttribute('value','Download');
	INAU.setAttribute('class','yt-uix-tooltip-reverse yt-uix-button yt-uix-button-default yt-uix-tooltip');
	INAU.style.borderLeft = "";
	INAU.style.marginRight = "";
	INAU.style.marginLeft = "";
	INAU.style.borderRadius = "0 3px 3px 0";
	DIV.appendChild(INAU);
	INAU.addEventListener('click', function(){window.open("http://www.mp3convert.me/index.php?url=" + url + ""); self.focus();}, false);

	
	var prevHash = window.location.href;
	//console.log(window.location.href);
	//console.log(prevHash);
        window.setInterval(function () {
		//console.log("setlocati:" + window.location.href);
		//console.log("sethash:" + prevHash);
           if (window.location.href != prevHash) {
              prevHash = window.location.href;
			  //console.log("hrefdiff");
				addbutton();
           }
        }, 2000);
}