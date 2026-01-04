// ==UserScript==
// @name        Fix image loading
// @namespace   Violentmonkey Scripts
// @match       https://readmanganato.com/manga*/*
// @match       https://mangakakalot.com/chapter/*
// @grant       none
// @version     1.6
// @author      Ost
// @description Fixes images not loading by using another server
// @downloadURL https://update.greasyfork.org/scripts/405406/Fix%20image%20loading.user.js
// @updateURL https://update.greasyfork.org/scripts/405406/Fix%20image%20loading.meta.js
// ==/UserScript==

// Default
changeServer(5);


function changeServer(server) {
  console.log("Switching servers to " + server)
  var regex = /(https:\/\/s\d*\.mkklcdnv\d*\.com)(.*)/gm;
  img = document.getElementsByTagName('img');
  for (var i = 0; i < img.length; i++) {
      img[i].src = img[i].src.replace(regex, "https://s"+server+".mkklcdnv"+server+".com$2");
  }
}

if (document.getElementsByClassName("server-image-caption")[0]){
  var caption = document.getElementsByClassName("server-image-caption")[0];
}
else {
  var caption = document.getElementsByClassName("option_wrap")[0];
}

var innerDiv = document.createElement('div');
innerDiv.className = "server-image-name";
innerDiv.innerHTML = "Additional image servers: "
caption.appendChild(innerDiv);

var i;
for (i = 0; i < 10; i++) {
  var child = document.createElement('button');
  //child.className = "server-image-btn isactive";
  child.className = "real-server";
  child.innerHTML = (i+1).toString();
  child.style.backgroundColor = "#27ae60";
  child.style.color = "white";
  child.style.padding = "6px 12px";
  child.style.margin = "4px 2px";
  child.style.cursor = "pointer";
  child.style.border = "none";
  child.onclick = function(){changeServer(this.innerHTML);};
  innerDiv.appendChild(child);
}

console.log("if image loading fails set network.http.referer.spoofSource to false");
console.log("if no referers are sent try setting network.http.referer.XOriginPolicy to 0");
