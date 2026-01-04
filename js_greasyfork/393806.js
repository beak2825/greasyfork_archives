// ==UserScript==
// @name        c3 Favorites
// @namespace   Violentmonkey Scripts
// @match       https://fahrplan.events.ccc.de/*
// @match       https://programm.froscon.de/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/15/2019, 2:37:06 PM
// @downloadURL https://update.greasyfork.org/scripts/393806/c3%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/393806/c3%20Favorites.meta.js
// ==/UserScript==


var links = document.getElementsByTagName("a");
var event_links = [];
window.faved_events = [];

var myRegexp = /^.*fahrplan\.events\.ccc\.de\/(.*events\/([0-9]*))\.html$/;

for(var i=0; i<links.length; i++) {
  var isEventlink = myRegexp.test(links[i].href);
  var isNoIcon = (links[i].querySelectorAll(".image.small").length == 0);
    if (isEventlink && isNoIcon){
        event_links.push(links[i]);
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function save() {
  localStorage.setItem('faved_events', JSON.stringify(faved_events));
}

function load() {
  if(localStorage.faved_events){
  var loaded_faved_events = localStorage.getItem('faved_events');
  faved_events = JSON.parse(loaded_faved_events);
 }
}

load();


window.favour_fav = function(eventId, el) {
  var index = faved_events.indexOf(eventId); //check state before load. this way we don't toggle state, but change it to the opposite of what's currently reflected in the UI
  //SMELL: only helps the first element that's wrong XD
  
  load();
    if ( index != -1){
       // console.log("un-faving "+eventId);
      faved_events.splice(index,1);
      
    el.setAttribute("class", "favor_favable");
      
    }else{
       // console.log("faving "+eventId);
      faved_events.push(eventId);
    el.setAttribute("class", "favor_faved");
    }
    save();
    return;
}

function makeFavable(originalElement, eventId){
    var el = document.createElement("span");
    el.innerHTML = " ";
    el.setAttribute("eventID", eventId);
    var index = faved_events.indexOf(eventId);
    if ( index != -1){
    el.setAttribute("class", "favor_faved");
    }else{
    el.setAttribute("class", "favor_favable");
    }
    el.setAttribute("onclick", "favour_fav('"+eventId+"',this)");
    insertAfter(el, originalElement);
}


for(var i=0; i<event_links.length; i++) {
  var eventLink = event_links[i].href;
    var match = myRegexp.exec(eventLink);
    var eventId = match[2];  
    makeFavable(event_links[i], eventId);
}

if(myRegexp.test(window.location.href)){
    var match = myRegexp.exec(window.location.href);
    var eventId = match[2];
   el = document.getElementsByTagName("h2")[0];
    makeFavable(el, eventId);
} 



