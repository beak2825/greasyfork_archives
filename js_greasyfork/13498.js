// ==UserScript==
// @name        customclipb
// @namespace   namesp
// @description descr
// @include     http://g.e-hentai.org/g/*
// @include     http://exhentai.org/g/*
// @version     1.0.0.1
// @grant    GM_setClipboard
// @grant    GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/13498/customclipb.user.js
// @updateURL https://update.greasyfork.org/scripts/13498/customclipb.meta.js
// ==/UserScript==


// http://stackoverflow.com/questions/13075645/how-to-copy-data-to-the-clipboard-with-greasemonkey

var pageUrl = window.location.href
var englishTitle = document.getElementById("gn").textContent;
var japaneseTitle = document.getElementById("gj").textContent;
var textToCopy = pageUrl+"\n"+englishTitle+"\n"+japaneseTitle;


//* start copy text to clipboard
(function(){
document.addEventListener('keydown', function(e) {
  // pressed ctrl+shift+c
  if (e.keyCode == 67 && e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
   GM_setClipboard(textToCopy);
   //document.getElementById("favoritelink").click();
   // unfortunately, this gets blocked by popup blockers
   //GM_openInTab(document.getElementById("favoritelink").textContent);
   // if this one actually works, then a new tab would be opened in a different tab group. not good
  }
}, false);
})();
// end copy */


/* v2. now start by getting the gallery link. then add tags to it
//
(function(){
document.addEventListener('keydown', function(e) {
  // pressed ctrl+shift+c
  if (e.keyCode == 67 && e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
   //GM_setClipboard(textToCopy);
   //document.getElementById("favoritelink").click();
   // unfortunately, this gets blocked by popup blockers
   
   var regex = document.getElementById("favoritelink").outerHTML;
   var regex2 = regex.replace(/&amp;/g, "&");
   var regex3 = regex2.match(/g\.e\-hentai.org\/gallerypopups.php\?.+addfav/);
   GM_setClipboard(regex3);
   window.open(regex3);
  }
}, false);
})();
// end copy */




/* start debug code
GM_setClipboard(textToCopy);
alert(textToCopy);
// end debug code */


/*
(function(){
document.addEventListener('keydown', function(e) {
  // pressed alt+g
  if (e.keyCode == 71 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
   window.location = "http://google.com"; // go to google.
  }
}, false);
})();
// */



/*
//this provides the framework to match a valid gallery
var regex = document.getElementById("favoritelink").outerHTML;
console.log(regex);
regex.match(/\'.+\'/)
regex.match(/g\.e\-hentai.org\/gallerypopups.php\?.+addfav/)
regex.match(/hentai/)
var regex2 = regex.replace("&amp;", "sexsexsex");
+ this will only work for the first occurance
+ also, replace cannot be used AFTER match for some reason. it can only be used BEFORE match
+_ maybe I have to do regex3[0]
var regex2 = regex.replace(/&amp;/g, "sexsexsex");
+ this will work for all occurances
+ // http://stackoverflow.com/questions/2116558/fastest-method-to-replace-all-instances-of-a-character-in-a-string
var regex2 = regex.replace(/&amp;/g, "&");
+ this will replace all &amp; with just &
var regex3 = regex2.match(/g\.e\-hentai.org\/gallerypopups.php\?.+addfav/);
+ this will get the correct gallery
var regex10 = regex.match(/hentai/)
// <a id="favoritelink" href="#" onclick="return popUp('http://g.e-hentai.org/gallerypopups.php?gid=610647&amp;t=21b4149c56&amp;act=addfav',675,415)"><img src="http://ehgt.org/g/mr.gif"> Add to Favorites</a>
console.log(regex2);
http://g.e-hentai.org/gallerypopups.php?gid=610647&t=21b4149c56&act=addfav
http://g.e-hentai.org/gallerypopups.php?gid=610647&amp;t=21b4149c56&amp;act=addfav



//this attempts to remove stuff around return popup to clean up the onclick function. gave up
var regex = document.getElementById("favoritelink").outerHTML;
var regex2 = regex.replace(/&amp;/g, "&");
var regex4 = regex2.replace(/return popUp/, "window.open");
var regex5 = regex4.replace(/\'\,[0-9]+\,[0-9]+/, "");
var regex3 = regex2.match(/g\.e\-hentai.org\/gallerypopups.php\?.+addfav/);
onclick="return popUp('http://g.e-hentai.org/gallerypopups.php?gid=610647&t=21b4149c56&act=addfav',675,415)"


//this attempts to replace popup with window.open.
//although I suspect popup blocker will still block this because there's no button to onclick.
var regex = document.getElementById("favoritelink").outerHTML;
var regex2 = regex.replace(/&amp;/g, "&");
var regex4 = regex2.replace(/"return popUp.+"/, "\"window.open(regex3)\"");
// run regex4 before regex3 because you cannot replace after match
var regex3 = regex2.match(/g\.e\-hentai.org\/gallerypopups.php\?.+addfav/);
document.getElementById("favoritelink").outerHTML.replace(/"return popUp.+"/, "\"window.open(regex3)\"");
document.getElementById("favoritelink").append = ("asdasd")
onclick="return popUp('http://g.e-hentai.org/gallerypopups.php?gid=610647&t=21b4149c56&act=addfav',675,415)"
//back:	[/id="previousbutton" onclick="javascript:window.location='(.+?)';"/, 1],
//+ got this line from webcomic reader


//this successfully creates an html element button although it's a small button
var element = document.createElement("button");
var foo = document.getElementById("favoritelink");
foo.appendChild(element);

// */



