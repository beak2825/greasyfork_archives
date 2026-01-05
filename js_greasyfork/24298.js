// ==UserScript==
// @name        Pardus Gossip Logger
// @author      Math (Orion)
// @namespace   fear.math@gmail.com
// @description Logs pilot locations given out by gossipers on the planet and SB screens.
// @include     http*://orion.pardus.at/planet.php*
// @include     http*://orion.pardus.at/starbase.php*
// @version     1.34
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24298/Pardus%20Gossip%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/24298/Pardus%20Gossip%20Logger.meta.js
// ==/UserScript==

//Tells the script where in the google form to put the data
var gossipEntry = 874984780;

//Find and store the div elements which contain gossip in an array called rumours.
var divs = document.getElementsByTagName("div");
var rumours = [];
var style;
for (var i=0; i<divs.length; i++) {
  style = divs[i].style.cssText;
  if (style.indexOf('rgba(0, 0, 0, 0.4)') > -1) {
    rumours.push(divs[i]);
  }
}

//For each rumour, check if it's of a type that lists a pilot's location, and if so grab the relevant info.
var gossipData = "";
var name, loc, gossiperType, links, text, start, end, buildingType;
for (var i=0; i<rumours.length; i++) {
  gossiperType = rumours[i].firstChild.title;
  text = rumours[i].innerHTML;
  if (gossiperType.indexOf("Hunter") > -1 && text.indexOf("Tearing down") > -1) {
    
    //The Bounty Hunter's message for bountied buildings
    
    //name
    links = rumours[i].getElementsByTagName("a");
    name = links[0].innerHTML + " Building";
    
    //building type
    start = text.indexOf('</a> ') + 5; //5 is the length of "</a> "
    end = text.indexOf('</b>', start);
    buildingType = text.substring(start,end);
    
    //location
    start = text.lastIndexOf('<b>') + 3; //3 is the length of "<b>"
    end = text.lastIndexOf('</b>');
    loc = text.substring(start,end);
    
    gossipData = gossipData + ":" + name + ";" + buildingType + " at " + loc;
    
  } else if (gossiperType.indexOf("Activist") > -1 || (gossiperType.indexOf("Trader") > -1 && text.indexOf("starbase") == -1 && text.indexOf("planet") == -1)) {
      
    //The Trader or Activist's message for a building
      
    //name
    links = rumours[i].getElementsByTagName("a");
    name = links[0].innerHTML + "'s Building";
    
    //building type
    start = text.indexOf('<b>') + 3; //3 is the length of "<b>"
    end = text.indexOf('</b>');
    buildingType = text.substring(start,end);
      
    //location
    start = text.indexOf('<b>', start) + 3; //This is the start of the pilot name
    start = text.indexOf('<b>', start) + 3; //3 is the length of "<b>"
    end = text.indexOf('</b>', start);
    loc = text.substring(start,end);
      
    gossipData = gossipData + ":" + name + ";" + buildingType + " at " + loc;
    
  } else if (gossiperType.indexOf("Gossiper") == -1 && gossiperType.indexOf("Trader") == -1) {

    //The gossiper and non-Building Trader give useless info, but everything else left we can treat the same way
    
    //name
    links = rumours[i].getElementsByTagName("a");
    name = links[0].innerHTML;
    
    //location
    start = text.lastIndexOf('<b>') + 3; //3 is the length of "<b>"
    end = text.lastIndexOf('</b>');
    loc = text.substring(start,end);

    gossipData = gossipData + ":" + name + ";" + loc;

  }
}

//Send data to spreadsheet
if (gossipData.length > 0) {
  gossipData = "entry." + gossipEntry + "=" + gossipData.replace(/:/,'');
  GM_xmlhttpRequest({
      method: "POST",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSedYc0y5T3pfw6FOAWr4ZsRDueuvIk2xhD5NKLpKMMtwxeceQ/formResponse",
      data: gossipData,
      headers: {
          "Content-Type": "application/x-www-form-urlencoded"
      },
  });
}
