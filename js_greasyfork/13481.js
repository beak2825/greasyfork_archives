// ==UserScript==
// @name        anidb-listcovers
// @description	Replace text lists and search results as covers
// @namespace   periselene@yandex.com
// @include     http://anidb.net/*
// @version     1.04
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_getResourceURL 
// @downloadURL https://update.greasyfork.org/scripts/13481/anidb-listcovers.user.js
// @updateURL https://update.greasyfork.org/scripts/13481/anidb-listcovers.meta.js
// ==/UserScript==

var button = document.createElement("a");
var show = false;
var first = true;
var protocl = (("https:" == document.location.protocol) ?
    "https://" : "http://");
button.innerHTML = "show as coverGMs";
button.id = "coverGMButton";
button.className = "button";
document.body.appendChild(button);
button.addEventListener("click", replaceWithCovers);
GM_addStyle("	.coverGMTopGM{\
			margin: 	-5px;\
			position: 	relative;\
			float: 		left;\
		}\
		.coverGMListGM{\
			position: 	relative;\
			float: 		left;\
			width: 		100%;\
		}\
		.paginatorGM{\
			float: 		left;\
		}\
		.coverGM{\
			background: 	#52667C;\
			border-radius: 	5px;\
			border: 	4px outset #52667C;\
			position: 	relative;\
			min-height:		350px;\
			min-width:	250px;\
			text-align: 	center;\
			\
			display:	table-cell;\
			vertical-align:	middle;\
		}\
		.bthumbGM{\
		height:		350px;\
		}\
		.hideThisGM{\
			display:	none;\
			}\
		.hideRowGM{\
			display:	none;\
			}\
		.infoGM{\
			background: 	rgb(240, 243, 247);\
			width: 		100%;\
			text-align: 	center;\
			position: 	absolute;\
			bottom: 	25px;\
			z-index: 	1;\
			padding: 	0.5em 0;\
			text-shadow: 	2px 2px 5px #F0F3F7;\
			display:	none;\
			color:		#52667C;\
			font-weight:	bold;\
			line-height: 	1em;\
		}\
		.infoGMmy{\
			background: 	#A7DDA7;\
		}\
		.coverGMmy{\
			 border-color:	 #A7DDA7;\
		}\
		.infoGMwish{\
			background: 	#D7DD9E;\
		}\
		.coverGMwish{\
			 border-color:	 #D7DD9E;\
		}\
		.coverGM:hover .infoGM{\
			display:	block;\
		}\
		#coverGMButton{\
			position: 	fixed;\
			top: 		0px;\
			right: 		0px;\
		}\
		.series_rows_table{\
			float: 		left;\
			}\
		");

///////////////////////////////////////////////////////////

function replaceWithCovers()
{
if(first){
 	console.log(" 0"  );
	
	var coverGMListGM = document.createElement("div");
	coverGMListGM.className = "coverGMListGM";
 	console.log(" 00"  );
	var animelist = document.querySelectorAll('table.animelist')[0];
	var isChar =  ( document.URL.indexOf('characterlist') != -1 || document.URL.indexOf('chartb') != -1 )&& animelist == undefined;
 	console.log(" 000: " +animelist );
	var isChar =  document.URL.indexOf('chartb') != -1 || animelist == undefined;
	if(isChar )
		animelist = document.querySelectorAll('.characterlist tbody')[0];
	var isCrea =  document.URL.indexOf('creatorid') != -1 && animelist == undefined;
	if(isCrea )
	{
		animelist = document.querySelectorAll('#stafflist_0 > tbody:nth-child(2)')[0];
		if(!animelist )
		{
			console.log(" 001a: "  );
			animelist = document.querySelectorAll('#stafflist_major > tbody')[0];
		}
	}
	var ismywishlist =  ( document.URL.indexOf('mywishlist') != -1  );
	if(ismywishlist )
	{
			console.log(" 001b: "  );
		animelist =  document.querySelectorAll('#wishlist')[0];
	}
	//#wishlist > tbody:nth-child(2)
 	console.log(" 000: " +animelist );
 	console.log(" 0000: " + isChar + isCrea );
	var rows = animelist.getElementsByTagName('tr');
 	console.log(" 1: " +rows.length );
	for (i = 1; i < rows.length; i++) 
	{
		populateCovers(rows[i], coverGMListGM , isChar, isCrea );
	}
 	console.log(" 2"  );
	
	animelist.parentNode.insertBefore(coverGMListGM, animelist);
	GM_addStyle(".coverGMTopGM{margin: 5px;}");
	animelist.className = "hideThisGM";
	first = false;
}
	console.log(" TODO switch back"  );//TODO switch back
	show = !show;
	
}

function populateCovers(element, coverGMListGM, isChar, isCrea)
{
	var nameNode = element.querySelectorAll('.name a')[0];
	if(!nameNode)
	{
	console.log('!nameNode'  );
		return;
	}
	var coverGMTopGM = document.createElement("div");
	coverGMTopGM.className = "coverGMTopGM " ;
	var coverGM = document.createElement("div");
	var img = document.createElement("img");
	var link = document.createElement("a");
	var span = document.createElement("span");
	link.appendChild(img);
	coverGM.appendChild(link);
	coverGMTopGM.appendChild(coverGM);
	coverGMListGM.appendChild(coverGMTopGM);
	link.appendChild(span);
	link.href = nameNode.href;
	
	var text = nameNode.textContent   ;
	console.log(text  );
	coverGM.className = "coverGM";
	var regex = /(^https?:\/\/[a-z0-9\.]+\/pics\/anime\/)thumbs\/[0-9]+x[0-9]+\/([0-9]+\.(jpg|gif|png|jpeg))-thumb\.jpg$/;
	var imgNode = element.querySelectorAll('.thumb img')[0];
        var match = imgNode.src.match(regex);
	console.log('lol'  );
	
        if (match)
		img.src = match[1] + match[2];
	else
		img.src = imgNode.src;
	img.className = "bthumbGM";
	var textnode = document.createTextNode(text);
	span.appendChild(textnode);
	console.log('lol1'  );
	
        var br = document.createElement("br");
	span.appendChild(br);
	var text = '\n';
	if(element.getElementsByClassName('type').length)
	{
		text=text+element.getElementsByClassName('type')[0].textContent;
	}
	console.log('lol2'  );
	
	if(isChar)
		text = text +' '+element.getElementsByClassName('nametype')[0].textContent+' '+element.getElementsByClassName('gender')[0].textContent;
	textnode = document.createTextNode(text);
	span.appendChild(textnode);
		span.className = "infoGM";
	console.log('lol4'  );
	
	if(element.className.search('mylist') >= 0)
	{
		span.className = "infoGM infoGMmy" ;
		coverGM.className = "coverGM coverGMmy";
	}
	if(element.className.search('wishlist') >= 0)
	{
		span.className = "infoGM infoGMwish" ;
		coverGM.className = "coverGM coverGMwish";
	}
	console.log('end'  );
}