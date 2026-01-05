// ==UserScript==
// @name        SteamGifts chance
// @namespace   Alpe
// @include     http://www.steamgifts.com/
// @include     http://www.steamgifts.com/giveaways/*
// @include     http://www.steamgifts.com/giveaway/*
// @include     http://www.steamgifts.com/user/*
// @include     http://www.steamgifts.com/group/*
// @version     1
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @grant       none
// @run-at      document-end
// @description:en Show chance of winning a giveaway.
// @description Show chance of winning a giveaway.
// @downloadURL https://update.greasyfork.org/scripts/15994/SteamGifts%20chance.user.js
// @updateURL https://update.greasyfork.org/scripts/15994/SteamGifts%20chance.meta.js
// ==/UserScript==

if (document.URL === "http://www.steamgifts.com/" || document.URL.substring(0, 43) === "http://www.steamgifts.com/giveaways/search?" || document.URL.substring(0, 31) === "http://www.steamgifts.com/user/" || document.URL.substring(0, 32) === "http://www.steamgifts.com/group/"){
  var entries = document.getElementsByClassName("giveaway__links");
  var titles = document.getElementsByClassName("giveaway__heading");
  var usercreated = document.baseURI.lastIndexOf($('.nav__avatar-outer-wrap')[0].href,0) === 0;
  
  for(var i = 0; i < entries.length; i++){
    entrynumber = parseInt(entries[i].childNodes[1].childNodes[2].innerHTML.replace(/\,/g,'').split(" ")[0]);
    
    if (!usercreated){
      if (document.getElementsByClassName("giveaway__row-inner-wrap")[i].className.indexOf("is-faded") == -1){
        if (document.getElementsByClassName("giveaway__columns")[i].children[0].textContent.indexOf("remaining") != -1){
          entrynumber++;
        }
      }
    }

    if(entrynumber != null){
      winpercent = (100 / entrynumber);
      if(titles[i].childNodes[2].innerHTML.indexOf("Copies") != -1){
        copies = parseInt(titles[i].childNodes[2].innerHTML.split(" Copies")[0].split("(")[1].replace(/\,/g,''));
        winpercent *= copies;
      }
      winpercent = Math.min(winpercent, 100);
      
      entries[i].childNodes[1].childNodes[2].innerHTML += " (" + parseFloat(winpercent.toFixed(3)) + "%)";
    }
  }
} else if (document.URL.substring(0, 43) === "http://www.steamgifts.com/giveaways/entered" || document.URL.substring(0, 43) === "http://www.steamgifts.com/giveaways/created"){
  var ga = document.getElementsByClassName("table__row-inner-wrap")
  
  for(var i = 0; i < ga.length; i++){
    var entrynumber = parseInt(ga[i].children[2].innerHTML.replace(/\,/g,''))
    
    winpercent = (100 / entrynumber);
    if(ga[i].children[1].children[0].textContent.indexOf(" Copies)") != -1){
      copies = parseInt(ga[i].children[1].children[0].textContent.split(" Copies)")[0].split("(")[1].replace(/\,/g,''));
      winpercent *= copies;
    }
    winpercent = Math.min(winpercent, 100);
    
    ga[i].children[2].innerHTML += " (" + parseFloat(winpercent.toFixed(3)) + "%)";
  }
} else if (document.URL.substring(0, 35) === "http://www.steamgifts.com/giveaway/"){
  var entrynumber = parseInt(document.getElementsByClassName("sidebar__navigation__item__count live__entry-count")[0].textContent.replace(/\,/g,''));
  
  if (document.getElementsByClassName("sidebar__entry-insert").length != 0){
    if (document.getElementsByClassName("sidebar__entry-insert")[0].className.indexOf("is-hidden") == -1){
      entrynumber++;
    }
  }
  
  winpercent = (100 / entrynumber);
  if (document.getElementsByClassName("featured__heading")[0].children[1].innerHTML.indexOf(" Copies)") != -1){
    copies = parseInt(document.getElementsByClassName("featured__heading")[0].children[1].innerHTML.split(" Copies)")[0].split("(")[1].replace(/\,/g,''));
    winpercent *= copies;
  }
  winpercent = Math.min(winpercent, 100);
  
  if(winpercent!="Infinity"){ document.getElementsByClassName("sidebar__navigation__item__count live__entry-count")[0].innerHTML += " (" + parseFloat(winpercent.toFixed(3)) + "%)"; }
}

$.noConflict();