// ==UserScript==
// @name           Jeph Jacques comics bookmark
// @description    Adds a bookmark to the comic you've read last.
// @namespace      https://greasyfork.org/users/98-jonnyrobbie
// @author         JonnyRobbie
// @include        http://*questionablecontent.net/*
// @include        http://*alicegrove.com/*
// @grant          none
// @version        2.1
// @downloadURL https://update.greasyfork.org/scripts/4070/Jeph%20Jacques%20comics%20bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/4070/Jeph%20Jacques%20comics%20bookmark.meta.js
// ==/UserScript==

/*Changelog
2.1
-new site fix
2
-support for Alice Grove
1.3
-changed the bookmark text
1.2
-fix for main page
1.1
-redirect from 'questionablecontent.net/' to 'www.questionablecontent.net'
1.0
-initial release
*/

function main() {
	console.log("===\nMain bookmark script starting...");
	if(typeof(Storage)=="undefined") {
	   alert("Sorry, your browser doesn't spupport HTML5 localStorage.");
	}
	if (window.location.href == "http://questionablecontent.net/") window.location.href = "http://www.questionablecontent.net/"; //because these count as different subdomains having different localstorage namespace not being able to access one from the other. That would mean two sets of bookmarks. We need to unify it.
	if (window.location.href == "http://alicegroove.com/") window.location.href = "http://www.alicegroove.com/";
	var str = window.location.href;
	var qcmatch = /questionablecontent/;
	var agmatch = /alicegrove/;
	var page = ""
	if (str.match(qcmatch) !== null) page = "qclastvisit";
	if (str.match(agmatch) !== null) page = "aglastvisit";
	var comic=getComicNumber(page);
	console.log("Total comics: " + comic);
	processBook(page, comic);
}

function processBook(bmName, comic) {
	if(localStorage.getItem(bmName)==null) { //if we haven't visited here before
		localStorage[bmName]=0; //...set the default bookmark
	}
	if(comic!=0) { //if we are not on the homepage...
		if(localStorage[bmName]<comic) { //...and if we arleady caught up...
			localStorage[bmName]=comic; //...adjust the bookmark
		}
	} else {
		if(document.referrer == "http://www.alicegrove.com/page/2") {
			localStorage[bmName]=document.getElementsByClassName("comic-pagination")[0].getElementsByTagName("a")[0].href.substr(31, firstlink.length-31);
		}
	}
	last = localStorage[bmName];
	if(bmName=="qclastvisit") {
		console.log("Creating QC bookmark link");
		link = document.createElement("li"); //...and create a button for it
		link.innerHTML = '<a href="http://www.questionablecontent.net/view.php?comic=' + last + '">Bookmark (' + last + ')</a>';
		navig = document.getElementById("comicnav");
		navig.appendChild(link);
	}
	if(bmName=="aglastvisit") {
		
		console.log("Creating AG bookmark link");
		link = document.createElement("a");		
		firstlink = document.getElementsByClassName("comic-pagination")[0].getElementsByTagName("a")[0].href;
		firstNum = firstlink.substr(31, firstlink.length-31);
		console.log("Last: " + last);
		console.log("First num: " + firstNum);
		var book = (parseInt(firstNum) + 1 - parseInt(last));
		console.log("Book: " + book);
		link.innerHTML = "Bookmark (" + (-1*(book-1)) + ")";
		link.href = "http://www.alicegrove.com/page/" + book;
		link.style.color = "#000";
		link.style.fontSize = "14pt";
		navig = document.getElementsByClassName("comic-pagination")[0];
		navig.appendChild(link);
	}
}

function getComicNumber(bmName) {
	var comic;
	if(bmName=="qclastvisit") {
		number=document.getElementById("strip");
		if (number==null) {
			number = document.getElementById("container").getElementsByClassName("row")[0].getElementsByTagName("img")[0];
		}
		url=number.src;
		if(url.substr(7,3)=="www") {
			url = (url.substr(0,7) + url.substr(11,url.length-11));
		}
		comic = url.substr(38, url.length-42);
		
		url2=document.URL;
		if(url2.substr(url2.length-9)=="index.php") {
			comic=0; //we are on the latest homepage
		}
		if(url2.substr(url2.length-4)=="net/") {
			comic=0; //we are on the latest homepage
		}
	}
	if(bmName=="aglastvisit") {
		firstlink = document.getElementsByClassName("comic-pagination")[0].getElementsByTagName("a")[0].href;
		console.log("AG link href: " + firstlink);
		firstNum = firstlink.substr(31, firstlink.length-31);
		
		var str = window.location.href;
		var comMatch = /https?:\/\/www\.alicegrove\.com\/page\/([0-9]+)/;
		if(str.replace(comMatch, "$1") != "http://www.alicegrove.com/") {
			comic = (firstNum - str.replace(comMatch, "$1") + 1);
		} else {
			comic = 0;
		}
		console.log("Current comic: " + str.replace(comMatch, "$1"));
		console.log("Currnet comic (traditional numbering): " + comic);
		if(window.location.href == "http://www.alicegrove.com/") firstNum == "lastpg";
		console.log("window.location: " + window.location.href);
		console.log("AG comic number: " + firstNum);
	}
	return comic;
}

main();