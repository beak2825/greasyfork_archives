// ==UserScript==
// @name           AO3 Tag Highlighter
// @namespace      ao3taghighlighter
// @description    Highlights certain tags according to fandom.
// @version        1.0
// @include        https://archiveofourown.org/tags/*
// @include        https://archiveofourown.org/works?*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/396078/AO3%20Tag%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/396078/AO3%20Tag%20Highlighter.meta.js
// ==/UserScript==


// favorite characters
var cssCharColor = "#4E7632";
var aCharacters = new Array(
  'Jon Snow',
  'Arya Stark',
  'Tyrion Lannister',
  'Daenerys Targaryen'
);

// disliked characters
var cssBadCharColor = "#3C1C1E";
var aBadCharacters = new Array(
  	'Gendry Waters'
);

// favorite pairings
var cssPairColor = "#225500";
var aPairings = new Array(
  'Jon Snow/Arya Stark',
  'Arya Stark/Daenerys Targaryen'
);

// disliked pairings
var cssBadPairColor = "#2B1415";
var aBadPairings = new Array(
  'Arya Stark/Gendry Waters',
  'Jon Snow/Daenerys Targaryen'
);

//////////////////////////////////////////////////////////////////////
//			DO NOT EDIT BEYOND THIS LINE
//////////////////////////////////////////////////////////////////////

var charList = $("li.characters");
charList.each(function(idx, li) {
  	var character = $(li);
  		for(var i = 0; i < aCharacters.length; i++)
      {
        var charText = character.find("a.tag").text();
        	if(charText == aCharacters[i])
            character.find("a.tag").css("background-color", cssCharColor);
      }
  		for(var i = 0; i < aBadCharacters.length; i++)
      {
        var charText = character.find("a.tag").text();
        	if(charText == aBadCharacters[i])
            character.find("a.tag").css("background-color", cssBadCharColor);
      }
});

var pairList = $("li.relationships");
pairList.each(function(idx, li) {
  	var pairing = $(li);
  		for(var i = 0; i < aPairings.length; i++)
      {
        var pairText = pairing.find("a.tag").text();
        	if(pairText == aPairings[i])
            pairing.find("a.tag").css("background-color", cssPairColor);
      }
  		for(var i = 0; i < aBadPairings.length; i++)
      {
        var pairText = pairing.find("a.tag").text();
        	if(pairText == aBadPairings[i])
            pairing.find("a.tag").css("background-color", cssBadPairColor);
      }
});
