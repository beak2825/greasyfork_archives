// ==UserScript==
// @name        nxs.com
// @description Removes ads and top bars from search results
// @namespace   newyorkscroll
// @version  1
// @grant    none
// @include  /^https://www\.xnxx\.com/video-.*$/
// @downloadURL https://update.greasyfork.org/scripts/473316/nxscom.user.js
// @updateURL https://update.greasyfork.org/scripts/473316/nxscom.meta.js
// ==/UserScript==

// set up infobox
var infoMsg = document.createElement("div");
var hep = document.createTextNode("text here")
var text_elem = infoMsg.appendChild(hep);
infoMsg.setAttribute("id", "infobox");
infoMsg.style.position = "absolute";
infoMsg.style.top = "10px";
infoMsg.style.left = "10px";
infoMsg.style.padding = "10px";
infoMsg.style.backgroundColor = "#ccc";
document.body.appendChild(infoMsg);

// remove top header from result pages
topbar = document.getElementById("header");
topbar.remove()

// find injected ad and remove it
function remove_ad() {
	var count = 0;

  tags = document.querySelectorAll("#video-player-bg");

  console.log("whee");
  console.log(tags);
  
  Array.prototype.forEach.call(tags, function(elem) {
    var removeElement = elem.parentNode.firstChild.nextSibling.nextSibling.nextSibling;
    
    // ntvF8d230E1f81e39b1
    // ntvDFEF
    console.log(removeElement);
    if (removeElement.className.substring(0,3) == "ntv") {
			count++;
		  text = count + " ads removed";
		  document.getElementById("infobox").innerHTML = text
			console.log(text);  
			removeElement.parentNode.removeChild(removeElement);
	  } else {
  	  setTimeout(remove_ad, 500);
    }
  });
  
}

setTimeout(remove_ad, 1000);
