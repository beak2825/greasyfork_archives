// ==UserScript==
// @name        CCG - Emoji size adjustment
// @namespace   ew0345
// @include     https://www.readlightnovel.me/*/*
// @grant       none
// @version     1.0
// @author      ew0345
// @description Adjust emoji size down to a customizable size in pixels (default of 16px), can be changed by changing the number in resizeEmoji().
// @downloadURL https://update.greasyfork.org/scripts/433892/CCG%20-%20Emoji%20size%20adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/433892/CCG%20-%20Emoji%20size%20adjustment.meta.js
// ==/UserScript==
var imgList = document.getElementsByTagName("img");

function resizeEmoji(emojiSize) {
	var emnum = 0;
	for (var i = 0; i < imgList.length; i++) {
	  for (var i2 = 0; i2 < imgList[i].attributes.length; i2++) {
	    if (imgList[i].attributes[i2].name.indexOf("src") >= 0 && imgList[i].attributes[i2].value.indexOf("emoji") >= 0) {
	    	imgList[i].style.width = ""+emojiSize+"px";
	    	emnum++;
	    }
	  }
	}
	console.log("Number of emojis adjusted: "+emnum);
}

resizeEmoji(16); //CHANGE THE NUMBER HERE TO INCREASE OR DECREASE THE SIZE OF EMOJIS