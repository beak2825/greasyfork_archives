// ==UserScript==
// @name        pepecine: no embeded viewing, follow link instead + minor tweaks
// @namespace   nil
// @description Enable viewing on remote backend instead of the slow embeded viewing + minor tweaks(WIP)
// @include     http://pepecine.net/episodio-online/*
// @include     http://pepecine.net/ver-pelicula-online/*
// @version     0.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25671/pepecine%3A%20no%20embeded%20viewing%2C%20follow%20link%20instead%20%2B%20minor%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/25671/pepecine%3A%20no%20embeded%20viewing%2C%20follow%20link%20instead%20%2B%20minor%20tweaks.meta.js
// ==/UserScript==

function delete_social() {
  // delete social divs
  var ids = ["fblikebg", "fblikepop", "social"];
  ids.forEach(function delnodebyid(id) {
    node = document.getElementById(id);
    if (!node) return;
    node.parentNode.removeChild(node);
  });
}

function disable_embededviewing() {
  var links2embeded_vid = Array.filter(document.getElementsByTagName('a'), function is_link2embededvid(elt) {
    //if (location.href.indexOf(elt.href) !== 0) return false;
    if (elt.rel !== "nofollow") return false;
    if (elt.dataset.bind.indexOf("click: renderTab.bind(") !== 0) return false;
    return true;
  });
  //console.log("nb: " + links2embeded_vid.length);
  links2embeded_vid.forEach(function makeDirectLink(a, i){
    var bind = a.dataset.bind;
    var dest_url = bind.substr(bind.indexOf("'") + 1);
    dest_url = dest_url.substr(0, dest_url.indexOf("'"));
    a.href = dest_url;
    delete a.dataset.bind;
    a.target = "_blank";
    a.addEventListener('click', function click(e) {
      e.preventDefault();
      location.href = this.href;
    }, false);
  });
  
      
  var imgs = Array.filter(document.getElementsByTagName("img"), function has_datasetbind() {
    if (img.dataset.bind.length > 0) return true;
    return false;
  });
  console.log("nb img:" + imgs.length);
  imgs.forEach(function delnode(node) {
    node.parentNode.removeChild(node);
  });
}

function init_lighter_pepe() {
  delete_social();
  disable_embededviewing();
}
 
document.addEventListener('DOMContentLoaded', init_lighter_pepe);
