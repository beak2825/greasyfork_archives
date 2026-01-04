// ==UserScript==
// @name         AO3: [Wrangling] Wrangling Page Info Box
// @description  Adds a customisable info box to the wrangling edit page
// @author       Ebonwing
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
     
// @match        *://*.archiveofourown.org/tags/*/edit
// @grant        none
// @version 0.0.1.20211105173749
// @downloadURL https://update.greasyfork.org/scripts/435046/AO3%3A%20%5BWrangling%5D%20Wrangling%20Page%20Info%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/435046/AO3%3A%20%5BWrangling%5D%20Wrangling%20Page%20Info%20Box.meta.js
// ==/UserScript==


var settings = {};

/*********************
*
*
* Customise the tags you want infoboxes on and the infobox text here.
*
*
**********************/

//Replace the settings with tags and infotexts of your choosing. Copy and paste each new setting on a new line if you want more. 
//Inserting <br> makes a line break.
//The tags in the brackets are not case sensitive.

//If you want an infobox on all tags containing a specific keyword, do this.
settings["example"] = "This setting inserts this text into all urls that include the word example.";

//If you want to use a key term that has a space in it, replace the space(s) with %20
settings["Dean%20Winchester"] = "This appears on any tag that contains 'Dean Winchester'.";

//For key terms with slashes, use *s*
settings["Dean*s*Sam"] = "This appears on any tag that contains 'Dean/Sam'.";

//If you want a box only on specific tags, paste the entire link into the brackets. 
settings["https://archiveofourown.org/tags/ExampleTag/edit"] = "This tag appears only on the tag with that specific link.";


//Example use cases:
settings["edging"] = "Edging does not syn to edgeplay but to orgasm delay/denial.<br>";
settings["aro"] = "Aroace tags aren't synned to ace tags.<br>";



var default_text = "This is a default text that appears on all noncanonical tags.";
//If you don't want this to be shown on tags that have specific infoboxes, change the true value underneath this line to false.
var always_show_default_text = true;


/*********************
*
*
* Customise the style of your infobox here.
*
*
**********************/

//default style: cyan background, black border. Change the hex code after background: to customise it.
var style = "background:#d1fcf6; border:1px solid black; padding:10px;";

//style that mimics AO3's default design, so it will appear as a plain sentence.
//var style = "background:#dddddd;";

//Reversi compatible style:
//var style = "background:#000;";


/*********************
*
*
* End of the customisation section
*
*
**********************/


var text = "";
for (const [key, value] of Object.entries(settings)) {
  var url = window.location.href.toLowerCase();
  var tag = url.split("tags/")[1].split("/")[0];
  if(url == key){
   text = text + value; 
  } else if(tag.includes(key)){
    text = text + value; 
  }
}


if(!document.getElementById("tag_canonical").checked && always_show_default_text){
  text = text + default_text;
}

if(text != ""){
  	const div = document.createElement('div');
		div.id = "cheat_sheet";
  	if (typeof style === 'undefined') {
      var style = "background:#d1fcf6; border:1px solid black; padding:10px;";
    }
		div.style = style;
	
		div.innerHTML = text;

		var main = document.getElementById("main");
		var content = main.getElementsByTagName('dl');
  	//content[0].parentNode.insertBefore(div, content[0]);

  	//checks if tag is in a fandom, since that changes the node placement
 	  if(content[0].childNodes.length == 21){
 	   content[0].childNodes[15].childNodes[3].parentNode.replaceChild(div, content[0].childNodes[15].childNodes[3]);
  	} else if(content[0].childNodes.length == 25){
   	 content[0].childNodes[19].childNodes[3].parentNode.replaceChild(div, content[0].childNodes[19].childNodes[3]);
  	}

}