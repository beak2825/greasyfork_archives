// ==UserScript==
// @name        Unhide hidden links
// @namespace   www.twitter.com/silentguy
// @include     http://www.steamgifts.com/*
// @include     https://www.steamgifts.com/*
// @include     http://www.itstoohard.com/*
// @include     https://www.itstoohard.com/*
// @description Modify links related to SteamGifts in a way to see hidden links etc
// @author      SilentGuy
// @version     0.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10119/Unhide%20hidden%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/10119/Unhide%20hidden%20links.meta.js
// ==/UserScript==

var links = document.links;
var link;
for(var i=links.length-1; i >=0; i--){
  link = links[i];
  h1=link.getAttribute("href");
  if (link.textContent.match(/^\s*$/)  && link.childElementCount===0 && !(link.nextSibling && link.nextSibling.href && link.nextSibling.href==link.href)) {
    if (h1==link.href){
      link.textContent="§";
      link.title="{"+h1+"}";
    } else {
      link.textContent="{"+h1+"}";
    }
  } else if (link.childElementCount===0 && link.previousSibling && link.previousSibling.href && link.previousSibling.href!=link.href) {
    var textnode = document.createTextNode("§");  // Create a text node
    link.parentElement.insertBefore(textnode,link);
  } else if (link.childElementCount===0 && link.textContent.match(/^(www\.|http:\/\/)/) && 
             link.href!=link.textContent && link.href+"/"!=link.textContent && link.href!=link.textContent+"/") {
    console.log(link.href+"~"+link.textContent);
    var linknode = document.createElement("a");
    linknode.textContent="~";
    if (link.textContent.match(/^www\./)) linknode.href="http://"+link.textContent;
    else linknode.href=link.textContent;
    link.parentElement.insertBefore(linknode,link);
  }
}

var images = document.getElementsByTagName('img'); 
for(var i = 0; i < images.length; i++) {
    im=images[i];
    if (im.title){
        if (im.parentElement.previousSibling && im.parentElement.previousSibling.textContent && im.parentElement.previousSibling.textContent=="View attached image.") {
            im.parentElement.previousSibling.textContent+="  -  "+im.title;
        }
    }
}

