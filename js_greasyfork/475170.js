// ==UserScript==
 // @name AgarSkin
 // @namespace https://legendmod.ml // @version 0.1
 // @description Get all skins for free!
 // @author Jimboy3100
 // @match https://agar.io/*
 // @run-at document-end
 // @grant none
// @version 0.0.1.20230913033215
// @downloadURL https://update.greasyfork.org/scripts/475170/AgarSkin.user.js
// @updateURL https://update.greasyfork.org/scripts/475170/AgarSkin.meta.js
 // ==/UserScript==
 var tamp=setInterval(function(){ if(document.getElementsByClassName('circle bordered skinWrapper').length>0){ clearInterval(tamp); var elem = document.body; var script = document.createElement('script'); script.innerHTML =`var version="v15/10328";var speed=1000;var images=["mr_puzzled.png","funky_angel.png"]; var skins=["mr_puzzled","funky_angel"];var t="1694575312555";var errorMsg="Your code is outdated, go to the SKIN ROTATOR website to update it.";
var exp = 0;
var d = (new Date).getTime();
if (typeof al == "undefined" && parseInt(t) + parseInt("43200000") < d) {
  var al = document.createElement("font");
  al.innerHTML = errorMsg;
  al.color = "#FF0000";
  
  exp = 1;
}

var init = setInterval(function() {
  if (typeof window.core !== "undefined" && exp == 0) {
    clearInterval(init);
    if (typeof interval !== "undefined") {
      clearInterval(interval);
    }  
    var i = 0;
    var tempName5;
    document.getElementById("play").addEventListener("click", function() {
      tempName5 = document.getElementById("nick").value;
    });  
    var interval = setInterval(function() {
      if (i >= skins.length) {       
        i = 0;
      }
      window.core.loadSkin("%" + skins[i]);
      document.getElementsByClassName("circle bordered skinWrapper")[0].innerHTML = "<img src=\'https://configs-web.agario.miniclippt.com/live/" + version + "/" + images[i].replace(/.png/gi, "_low.png") + "\' crossorigin=\'anonymous\' style=\'width: 46px; height: 46px;\'>";
	  document.getElementsByClassName("circle bordered skinWrapper")[0].children[0].style.width
      i++;
    }, speed);
  }
}, 100);`; elem.appendChild(script); } }, 100)