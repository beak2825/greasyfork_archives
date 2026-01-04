// ==UserScript==
// @name     Reddit embed liveleak
// @description Adds a button to view liveleak videos
// @version  1
// @grant    none
// @include http*://www.reddit.com*
// @namespace rebuilders
// @downloadURL https://update.greasyfork.org/scripts/39717/Reddit%20embed%20liveleak.user.js
// @updateURL https://update.greasyfork.org/scripts/39717/Reddit%20embed%20liveleak.meta.js
// ==/UserScript==

window.addEventListener('load', main , false);

function main() {
var things = document.getElementsByClassName("thing");

//Find all posts for liveleak
for( var i = 0; i < things.length; i++){
  var domain = things[i].getAttribute("data-domain");
  if(domain == "liveleak.com" || domain == "m.liveleak.com"){
    //Create the expando-button
    console.log(things[i].getAttribute("data-url").split("=")[1]);
    var vidid = things[i].getAttribute("data-url").split("=")[1];
    var div = document.createElement("div");
    var content = document.createElement("div");
    var iframe = document.createElement("iframe");
    div.setAttribute("class", "expando-button hide-when-pinned video collapsed");
    content.setAttribute("class", "expando");
    content.setAttribute("style", "display: none;");
    content.setAttribute("data-pin-condition", "function() {return this.style.display != 'none';}");
    content.setAttribute("data-cachedhtml", ' <iframe src="//www.liveleak.com/e/' + vidid + '" class="media-embed" width="640" height="360" border="0" frameBorder="0" scrolling="no"; allowfullscreen></iframe> ');
    
    //Add to DOM
    var entry = getSubTag(things[i], "entry");
    entry.appendChild(content);
    var top = getSubTag(entry, "top-matter");
    var tagline = getSubTag(top, "tagline");
    top.insertBefore(div, tagline);
  }
}
}
        
function getSubTag(tag, classname){
 	var children = tag.childNodes;
  for(var j = 0; j < children.length; j++){
   	if(children[j].classList.contains(classname)){
    	return children[j];   
    }
  }
  return null;
}
