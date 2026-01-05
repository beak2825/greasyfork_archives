// ==UserScript==
// @name        Imgur: Hide non-mature content
// @namespace   
// @description Adds a button to Imgur.com that hides all non-mature image links on the page
// @include     http://imgur.com/
// @include     http://imgur.com/new/*
// @include     http://imgur.com/hot/*
// @include     http://imgur.com/t/*
// @version     1
// @grant       none
// @author      drgonzo67
// @downloadURL https://update.greasyfork.org/scripts/28743/Imgur%3A%20Hide%20non-mature%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/28743/Imgur%3A%20Hide%20non-mature%20content.meta.js
// ==/UserScript==

document.getElementById('tags-current-list').style.display="none";
var secondaryNavPanel = document.getElementById('secondary-nav');
//alert(secondaryNavPanel);
var newItem = document.createElement("a");
var newItemText = document.createTextNode("Hide non-mature content");
newItem.setAttribute('onclick', "hideNonMatureElements();");
newItem.appendChild(newItemText);
secondaryNavPanel.appendChild(newItem);

var scriptCode = '\
function hideNonMatureElements() {\n\
	var cards = document.getElementsByClassName("cards");\n\
	for (var i in cards) {\n\
		var cardsHTML = cards[i].innerHTML;\n\
		var pieces = cardsHTML.match(/div id=\\"(.+)\\" class/g);\n\
		var imageIds = [];\n\
		for (var j in pieces) {\n\
			imageIds.push(pieces[j].split("\\"")[1]);\n\
		}\n\
		for (var j in imageIds) {\n\
			var imageId = imageIds[j];\n\
      if (document.getElementById(imageId).style.display==\"none\") continue;\n\
			var imageUrl = "http://imgur.com/gallery/" + imageId;\n\
			$.ajax({ url: imageUrl, async: false, success: function(data) {\n\
					var isMature = /mature-indicator/.test(data);\n\
					if (!isMature) {\n\
						document.getElementById(imageId).style.display=\"none\";\n\
					}\n\
			 }\n\
			});\n\
		}\n\
	}\n\
}';

var s = document.createElement("script");
s.innerHTML = scriptCode;
document.head.appendChild(s);
