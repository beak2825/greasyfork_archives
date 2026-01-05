// ==UserScript==
// @name         totally doesn't break agar :D - ☑
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Adds CSStyle/ExtremeDarkTheme™ To Agario and Removes Ads
// @author       Tom Burris + Jack Burch
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22024/totally%20doesn%27t%20break%20agar%20%3AD%20-%20%E2%98%91.user.js
// @updateURL https://update.greasyfork.org/scripts/22024/totally%20doesn%27t%20break%20agar%20%3AD%20-%20%E2%98%91.meta.js
// ==/UserScript==
console.log(document.getElementsByClassName("agario-wallet-plus")[0]);
document.getElementById("nick").styler = true;
setTimeout(function() {
 'use strict';
 var music = document.getElementById("nick").music;
 console.log("music is: "+music);

 var panels = $(".agario-panel");

 for (var n = 0;n<panels.length;n++) {
  panels[n].style.backgroundColor = "black";
  panels[n].style.color = "white";
  panels[n].style.outline = "1px solid white";
  panels[n].style.borderRadius = "0px";
 }

 remove();

 $("#settings").show();
 $("#instructions").show();

 document.getElementsByClassName("btn btn-info btn-settings")[0].addEventListener('click', function() {$("#instructions").show();});

 var inputs = document.getElementsByTagName("input");

 for (var n = 0; n < inputs.length; n++) {
  if (inputs[n].type == "text" || (inputs[n].type != "radio" && inputs[n].type != "checkbox")) {
   inputs[n].style.backgroundColor = "black";
   inputs[n].style.color = "white";
   if (inputs[n].id===null || inputs[n].id === "") {
    inputs[n].id = "uniqueID"+n;
   }
   document.styleSheets[document.styleSheets.length-1].addRule('#'+inputs[n].id+'::selection','background: green');
  }
 }

 //document.styleSheets[document.styleSheets.length-1].insertRule('#nick::focus {outline:0px none transparent;}', 0);
 document.getElementById("nick").style.backgroundColor = "black";
 document.getElementById("nick").style.color = "white";
 document.getElementById("nick").style.borderRadius = "0px";
 document.getElementById("gamemode").style.backgroundColor = "black";
 document.getElementById("gamemode").style.color = "white";
 document.getElementById("gamemode").style.borderRadius = "0px";
 //document.styleSheets[document.styleSheets.length-1].addRule('option::hover','background: green');
 document.getElementById("region").style.backgroundColor = "black";
 document.getElementById("region").style.color = "white";
 document.getElementById("region").style.borderRadius = "0px";
 document.getElementById("quality").style.borderRadius = "0px";
 document.getElementById("quality").style.backgroundColor = "black";
 document.getElementById("quality").style.color = "white";
 document.getElementsByClassName("agario-exp-bar progress")[0].style.backgroundColor = "black";
 document.getElementsByClassName("agario-exp-bar progress")[0].style.borderColor = "black";
 document.getElementsByClassName("progress-bar progress-bar-striped")[0].style.backgroundColor = "#FFFFFF";
 document.getElementsByClassName("progress-bar progress-bar-striped")[0].style.borderRadius = "0px";
 document.getElementsByClassName("agario-exp-bar progress")[0].style.backgroundColor = "black";
 document.getElementsByClassName("agario-exp-bar progress")[0].style.borderColor = "white";
 document.getElementsByClassName("agario-exp-bar progress")[0].style.borderRadius = "0px";
 document.getElementsByClassName("agario-wallet-container")[0].style.borderColor = "white";
 document.getElementsByClassName("agario-wallet-container")[0].style.borderRadius = "0px";
 document.getElementsByClassName("agario-wallet-plus")[0].childNodes[1].style.color = "black";
 document.getElementsByClassName("agario-wallet-plus")[0].style.color = "black";
 document.getElementsByClassName("agario-wallet-plus")[0].style.backgroundColor = "white";
 document.getElementsByClassName("agario-wallet-plus")[0].style.borderRadius = "0px";
 document.getElementsByClassName("agario-wallet-plus")[0].style.borderColor = "white";
 document.getElementsByClassName("agario-profile-picture")[0].style.borderRadius = "0px";/*
 document.getElementsByClassName("btn").style.backgroundColor = "black";
 document.getElementsByClassName("btn").style.borderRadius = "0px";
 document.getElementsByClassName("btn").style.borderColor = "white";*/
 document.getElementById("freeCoins").style.backgroundColor = "white";
 document.getElementById("freeCoins").style.borderRadius = "0px";
 document.getElementById("freeCoins").style.borderColor = "black";
 document.getElementById("freeCoins").style.color = "black";
 document.getElementById("openShopBtn").style.backgroundColor = "white";
 document.getElementById("openShopBtn").style.borderRadius = "0px";
 document.getElementById("openShopBtn").style.borderColor = "black";
 document.getElementById("openShopBtn").style.color = "black";
 
 var step;
 for(step = 0; step < document.getElementsByClassName("btn").length; step++) {
     document.getElementsByClassName("btn")[step].style.borderColor = "white";
     document.getElementsByClassName("btn")[step].style.borderRadius = "0px";
     document.getElementsByClassName("btn")[step].style.backgroundColor = "white";
     document.getElementsByClassName("btn")[step].style.color = "black";
 }
 var step2;
 for(step2 = 0; step2 < document.getElementsByClassName("circle green").length; step++) {
     document.getElementsByClassName("circle green")[step2].style.backgroundColor = "white";
     document.getElementsByClassName("circle green")[step2].style.borderColor = "black";
 }
 
 var u = document.getElementsByClassName("form-group clearfix")[0];
 var v = u.childNodes[1];
 v.style.marginLeft = "100px";
 
 var subs = document.getElementById("stats").getElementsByTagName("span");
 for (var n = 0; n < subs.length; n++) {
  if (subs[n].id == "statsSubtext" || subs[n].id == "statsText") {
   subs[n].style.color = "white";
   subs[n].style.opacity = 0.5;
  }
 }
    
    Element.prototype.remove = function() {
    this.parentNode.removeChild(this);
    };
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentNode) {
           this[i].parentNode.removeChild(this[i]);
        }
    }
    };
    
 function remove() {
        document.getElementById("advertisement").style.display = "none";
        document.getElementById("advertisement").id += "8==========D";
        document.getElementById("adsBottom").style.display = "none";
        document.getElementById("adsBottom").id += "8==========D";
        document.getElementById("promo-badge-container").style.display = "none";
        document.getElementById("promo-badge-container").id += "8==========D";
        document.getElementById("agarYoutube").parentNode.style.display = "none";
        $(".agario-promo").hide();
        $(".diep-cross").hide();
  if (!music) {
   document.getElementsByTagName("hr")[1].parentNode.removeChild(document.getElementsByTagName("hr")[1]);
  }

  //document.getElementsByClassName("row")[0].removeChild(document.getElementsByClassName("btn btn-info btn-settings")[0]);
 }
}, 100);