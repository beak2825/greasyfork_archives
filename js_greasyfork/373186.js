// ==UserScript==
// @name                Trick or Treating Enhancements (DNC Assist and Grudge List)
// @name:en             Trick or Treating Enhancements (DNC Assist and Grudge List)
// @description         A script to remove the "Trick or Treat" button for specified users. 
//                      Replace the user ids where the script says to. 
//                      Disclaimer: I take no responsibility if the script fails on you. It is meant to assist, not replace, user caution.
//                      It is somewhat customizable, feel free to edit the messages for the removed buttons or set it to remove buttons for grudges.
//                      Sometimes doesn't work well with the TOT autorefresh. I recommend manually refreshing the page if you have DNCs and still exercising caution.
// @namespace           http://www.aywas.com/
// @version             2.6
// @include             *://www.aywas.com/tot
// @include             *://www.aywas.com/tot/*
// @include             *://www.aywas.com/tot#*
// @author              Hamner (#13)
// @copyright           Creative Commons, Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
// @license             Creative Commons, Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)
// @require             http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @require             https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/373186/Trick%20or%20Treating%20Enhancements%20%28DNC%20Assist%20and%20Grudge%20List%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373186/Trick%20or%20Treating%20Enhancements%20%28DNC%20Assist%20and%20Grudge%20List%29.meta.js
// ==/UserScript==

function getDncs() {
  var dncs = [
    /*******************************************************************
     REPLACE THE FOLLOWING LINES WITH THE USER ID(S) YOU HAVE A DNC WITH
    ********************************************************************/
    //These users will have a bright red background if they appear at your door and their button will be removed in the TOT list.
    "77777777",
    "88888888",
    "99999999"
    //The last line does not end in a comma
    /***************************************************************
     REPLACE THE ABOVE LINES WITH THE USER ID(S) YOU HAVE A DNC WITH
    ****************************************************************/
  ];
  return dncs;
}

function getGrudges() {
  var grudge = [
    /*************************************************************************
     REPLACE THE FOLLOWING LINES WITH THE USER ID(S) YOU HAVE A GRUDGE AGAINST
    **************************************************************************/
    //These users will have a pale red background at your door and in the TOT list.
    "77777777",
    "88888888",
    "99999999"
    //The last line does not end in a comma
    /*********************************************************************
     REPLACE THE ABOVE LINES WITH THE USER ID(S) YOU HAVE A GRUDGE AGAINST
    **********************************************************************/
  ];
  return grudge;
}

/*******************************************************************
 REPLACE THE FOLLOWING LINES WITH ANY CUSTOMIZATION OPTIONS
********************************************************************/
function getDncColour() {
  //Bright red
  return "#FF0000";
}

function getGrudgeColour() {
  //Pale red
  return "#FFAAAA";
}

function getNpcColour() {
  //Orange
  return "#FFDDAA";
}

function isRemoveDncButton() {
  return true;
}

function getRemovedDncButtonText() {
  //displayed in place of the button for DNC users
  return "You can't use this door (DNC)";
}

function isRemoveGrudgeButton() {
  //Change to true if you want to remove their button
  return false;
}

function getRemovedGrudgeButtonText() {
  //displayed in place of the button if isRemoveGrudgeButton is set to true
  return "You've got a grudge.";
}

function removeNpcs() {
  //Change to true if you want them out of your door entirely
  //Otherwise, they get a background. Not everyone wants to spend money treating NPCs
  return false;
}

/*********************************************************************
 REPLACE THE ABOVE LINES WITH CUSTOMIZATION OPTIONS
**********************************************************************/

function containsUser(node, userIds) {
  for(var i=0; i < userIds.length; i++){
    var userId = "(#" + userIds[i] + ")";
    var userIdIndex = node.innerHTML.indexOf(userId);
    if( userIdIndex !== -1 ) {
      return true;
    }
  }
  return false;
}

function removeButtonsOnDoor(door, message){
  var buttons = door.getElementsByTagName('button');
  if(buttons.length > 0){
    for(var j = buttons.length - 1; j >= 0; j--) {
      door.removeChild(buttons[j]);
    }
    var dncNode = document.createElement("p");
    var dncText = document.createTextNode(message);
    dncNode.appendChild(dncText);
    door.appendChild(dncNode);
  }
}

function vandalizeTheirDoor() {
  
  var doors = document.getElementsByClassName("user");
  
  for(var i=0; i < doors.length; i++){
    var door = doors[i];
    if( containsUser( door, getDncs() ) ) {
      if( isRemoveDncButton() ) {
        removeButtonsOnDoor( door, getRemovedDncButtonText() );
      }
      door.style="background-color: "+getDncColour()+";";
    }
    else if( containsUser( door, getGrudges() ) ) {
      if( isRemoveGrudgeButton() ) {
        removeButtonsOnDoor( door, getRemovedGrudgeButtonText() );
      }
      door.style="background-color: "+getGrudgeColour()+";";
    }
    else{
      door.style="";
    }
  }
}

function vandalizeTheirFace() {
  var toters = document.getElementsByClassName('name');
  
  for(var i=0; i < toters.length; i++){
    var toter = toters[i];
    if( containsUser( toter, getDncs() ) ) {
      toter.parentNode.parentNode.style="background-color: "+getDncColour()+";";
    }
    else if( containsUser( toter, getGrudges() ) ) {
      toter.parentNode.parentNode.style="background-color: "+getGrudgeColour()+";";
    }
    else{
      toter.parentNode.parentNode.style="";
    }
  }
}

function markNpcs() {
  var toters = document.getElementsByClassName('name');
  var npcs = [];
  for(var i=0; i < toters.length; i++){
    if( !containsUserId( toter ) ) {
       npcs.push(toter.parentNode);
    }
  }
  for(var i=0; i < npcs.length; i++){
    var npc=npcs[i].parentNode;
    if( removeNpcs() ) {
        npc.parentNode.removeChild( npcs[i] );
    }
    else{
      npc.parentNode.style="background-color: "+getNpcColour()+";";
    }
  }
}

function containsUserId(node) {
  var idIndex=node.innerHTML.indexOf("(#");
  return idIndex !== -1;
}

function showScriptSuccessfullyRunning() {
  var content = document.getElementById('content');
  
  if( content != null ) {
    var scriptNode = document.createElement("h1");
    var scriptText = document.createTextNode("Trick or Treating Enhancements (DNC Assist and Grudge List) is active");
    scriptNode.appendChild(scriptText);
    content.insertBefore(scriptNode, content.firstChild);
  }
}

function vandalizeAll(jNode) {
  vandalizeTheirDoor();
  vandalizeTheirFace();
  markNpcs();
}

waitForKeyElements("div", vandalizeAll);
window.setInterval(function(){
  vandalizeAll(null);
}, 5000);
showScriptSuccessfullyRunning();