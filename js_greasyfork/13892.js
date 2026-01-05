// ==UserScript==
// @name        Starlog Manager
// @namespace   Odahviing
// @author      Odahviing
// @include     http://www.war-facts.com/starlog.php*
// @include     http://www.war-facts.com/player.php
// @version     2.2
// @grant       GM_getValue
// @grant       GM_setValue
// @description Starlog addon
// @downloadURL https://update.greasyfork.org/scripts/13892/Starlog%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/13892/Starlog%20Manager.meta.js
// ==/UserScript==

// Version 1.0  - Inital Script - Player filter + Real Time
// Version 1.1  - Minor Changes on menus
// Version 1.11 - Bug fix - not showing "hour"
// Version 2.0 -  Major upgrade: Remove starlog text with + button, rewrite the script
// Version 2.1 -  Bug fix - not showing all player messages
// Version 2.11+ - Updates on Greasy Fork

// Features So Far
// --- Ability to filter with "player" messages only
// --- Show/Hide stargroup long tezxt
// --- Ability to filter with "starlog" messages only


main();

function main()
{
  // Loading Groups Data
  if (document.URL.indexOf("player.php") != -1)
  {
    saveGroups();
  }
  
  addingButtons(); // Make the new menu   
  //addStarlogGroupsBoxs(); // Add buttons to filter by each group 

  var index = document.URL.indexOf("?");
  if (index != -1)
  {
      var requestType = document.URL.substring(index + 1);
    
      requestType = requestType.replace("offset=100", "");
    
      if (requestType == "type=2") // Show Stargroup Option
      {
        removeSinglePlayerMessages();
      }
      else if (requestType == "type=2&extra=1") // Show Player Option
      {
        showOnlyPlayerMessages();
      }
      // Not Active Option
      else if (requestType == ""){}
      else if (requestType.indexOf("#") == -1)
      {
        //     removeSinglePlayerMessages();
        //     keepOnlyGroup(getType.substring(getType.indexOf("#") +1));
      }  
  }
  else
  {
      removeStarlogText();
      var allExplore = document.getElementsByClassName('fullwidth dark tbborder starlog_explore');
      for (let index = 0 ; index < allExplore.length; index++)
          allExplore[index].style.display = "none";
  }
  
  addRealDates(); // Add real time dates to messages
}

/* Load Functions */

function saveGroups()
{
  var groupsNames = document.getElementsByName('editstarloggroupname');
  var groupsId = document.getElementsByName('editstarloggroup');
  
  var arrayList = [];
  for (var index = 0 ; index < groupsNames.length; index ++)
  {
    var newItem = [groupsId[index].value, groupsNames[index].value];
    arrayList.push(newItem);
  }
  GM_setValue("stargroupNames", arrayList);
}

function addingButtons()
{
  // Make Player button
  var newLink = document.createElement('a');
  newLink.setAttribute('class', "darkbutton smalltext");
  newLink.innerHTML = "Player";
  newLink.addEventListener("click", loadOnlyPlayer);
  
  // Add it
  var linksObject = document.getElementsByClassName('left starlog_right box dark padding5 minheight60')[0];
  linksObject.insertBefore(newLink, linksObject.firstChild);

  var outbox  = linksObject.children[3];
  linksObject.insertBefore(outbox, null);
  outbox = linksObject.children[3];
  linksObject.insertBefore(outbox, null);

  linksObject.children[1].innerHTML = "Stargroup";  
}

// Based of guardian21 script
function addRealDates()
{
    //Set Time zone Difference
    var currentdate = new Date(); 
    var timeZoneDiff = currentdate.getTimezoneOffset() / 60;	// Difference between user time and UTC time in hours
      timeZoneDiff = -timeZoneDiff;	// I want to know user compared to utc, not utc compared to user
      timeZoneDiff += 5;	//Difference between UTC and EST (server is in EST)  
  
   var divs = document.getElementById("midcolumn").getElementsByTagName("div")[0].getElementsByTagName("div");
   var i, current_div, realTimeEST,timetext,timeDateSpan,temp;

   //For each starlog entry
   for (i = 3; i < divs.length; i+=3) 
   {	//i=3 because first are headers 

      current_div = divs[i].children[0];

      timeDateSpan = current_div.getElementsByTagName("span")[0];
      if (timeDateSpan === undefined)
      {
        if (i + 1 < divs.length)
        {
          i = i + 1;
          current_div = divs[i].children[0];
          timeDateSpan = current_div.getElementsByTagName("span")[0];
        }
        else
        {
          break;
        }
      }

      realTimeEST = timeDateSpan.title;

      //Process real time. Add the timezone diffrence, change Date if needed
      var thehours = parseInt(realTimeEST.substr(0,2));
      var dateString =  realTimeEST.substr(9,2);  
      thedate  = parseInt(dateString);
      thehours += timeZoneDiff;

      if (thehours >= 24) 
      {
        thehours -= 24; thedate ++ ;
        dateString = thedate.toString();
        if (thedate < 10) { dateString = "0" + dateString;}
      }

      var hoursString = thehours.toString();
      if (thehours < 10) { hoursString = "0" + hoursString;}

      var myTimeDate = dateString + realTimeEST.substring(11,19) + "  " + hoursString + realTimeEST.substring(2,8);
      var myp = document.createElement("p");
      myp.style.color = "yellow";
      myp.innerHTML = myTimeDate;
     
      current_div.appendChild(myp);
   }
  
}

function removeStarlogText()
{
  var allMessages = document.getElementsByClassName('fullwidth dark tbborder');
  var count = 1;
  for (var index = 0; index < allMessages.length; index ++)
  {
    var theGroup = allMessages[index].getElementsByClassName('groupmessageheader');
    if (theGroup.length == 1)  makeShowHideGroup(theGroup[0], ++count);
  }
}


/* Button Functions */

function loadOnlyPlayer()
{
  window.location.replace("http://www.war-facts.com/starlog.php?type=2&extra=1");
}


function removeSinglePlayerMessages()
{
  var allMessages = document.getElementsByClassName('fullwidth dark tbborder');
  var removeList = [];
  var count = 1;
  
  for (var index = 0; index < allMessages.length; index ++)
  {
    var isGroup = allMessages[index].getElementsByClassName('groupmessageheader');
    if (isGroup.length == 0) removeList.push(allMessages[index]);
    else makeShowHideGroup(isGroup[0], ++count);
  }
  
  for (index = 0; index < removeList.length; index++) removeList[index].remove();
}

function makeShowHideGroup(elem, count)
{
    count = padCount(count);
    var workingText = elem.innerHTML;
    var newText = workingText.substring(workingText.indexOf('(') + 1, workingText.indexOf('</a>') + 4);
    var groupId = workingText.substring(workingText.indexOf('syncGroup') + 10, workingText.indexOf("\">") - 1);
    elem.innerHTML = "<label id='label" + count + groupId + "'>+</label>" + workingText.substring(0,workingText.indexOf('('));  
    elem.outerHTML += "<label id='hiddentext" + count + groupId + "' class='groupmessageheader' style='display:none'>" + newText + "</label>";
    var text = document.getElementById('label' + count + groupId);
    text.addEventListener("click", changeTextView, true);  
}

function padCount(count)
{
  if (count < 10) return "00" + count;
  if (count <100) return "0" + count;
  return count;
}

function changeTextView(e)
{
  var id = e.target.id.substring(5);
  var currentObject = document.getElementById('hiddentext' + id);
  if (currentObject.style.display == "block")
    currentObject.style.display = "none";
  else
    currentObject.style.display = "block";

}

function showOnlyPlayerMessages()
{
  var allLines = document.getElementsByClassName('shadow');
  var groups = ["fleet", "explore", "colony", "empire", "science"];
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://www.war-facts.com/starlog.php?offset=100&type=2", false);
  xhttp.send();  
  
  var div = document.createElement('div');
  div.innerHTML = xhttp.responseText; 
  
  var moreValues = div.getElementsByClassName('fullwidth dark tbborder');
  for (index = 0; index < moreValues.length; index++)  allLines[1].appendChild(moreValues[index]);
  
  var removeList = [];
 
  for (var groupsIndex = 0; groupsIndex < groups.length; groupsIndex ++)
  {
    var lines =  allLines[1].getElementsByClassName('fullwidth dark tbborder starlog_' + groups[groupsIndex]);
    for (var index = 0; index < lines.length; index++)  removeList.push(lines[index]);    
  }    
  for (index = 0; index < removeList.length; index++) removeList[index].remove();
  var left = document.getElementsByClassName('fullwidth dark tbborder');
  for (index = 0; index < left.length; index++) 
  {
    var isGroup = left[index].getElementsByClassName('groupmessageheader');
    if (isGroup.length == 1) removeList.push(left[index]);
  }
  for (index = 0; index < removeList.length; index++) removeList[index].remove();
}

function changeStatus(name, status)
{
  if (status == true) return;
    
  
  var allMessages = document.getElementsByClassName('fullwidth dark tbborder');
  var removeList = [];
  
  for (var index = 0; index < allMessages.length; index ++)
  {
    var innerText = allMessages[index].getElementsByClassName('groupmessageheader');
 alert(innerText[0].innerHTML);
    alert(name);
    var index = innerText[0].innerHTML.indexOf("syncGroup" + name);
    
    
    alert("index is: " + index );
    if (index != -1) removeList.push(allMessages[index]);
  }
  
  for (index = 0; index < removeList.length; index++) removeList[index].remove();
}

/* Private Stargroup Functions */

function addCheckBoxs()
{ 
  var allMessages = document.getElementsByClassName('left starlog_right box dark padding5 minheight60');
  var  arrayList = GM_getValue("stargroupNames");
  if (arrayList == undefined) return;
  var addText = "<div class='left starlog_left box light padding10 hide_mobile'></div><div class='left starlog_right box dark padding5 minheight60'>";
  
  for (var index = 0; index < arrayList.length; index++)
  {
    var newText = "<a class='darkbutton smalltext' id='text" + arrayList[index][0] + "'>" + arrayList[index][1] + "</a>";
    addText += newText;
  }
  addText += "</div>";
  allMessages[0].outerHTML = allMessages[0].outerHTML + addText;
  
  for (index = 0; index < arrayList.length; index++)
    {
      var label = document.getElementById('text' + arrayList[index][0]);
      label.addEventListener("click", function(){alert('1');loadStarGroup(arrayList[index][0]);alert('1');}, false);
    }
}

function loadStarGroup(groupNumber)
{
  window.location.replace("http://www.war-facts.com/starlog.php?#" + groupNumber);
}

function keepOnlyGroup(groupKey)
{
  var allMessages = document.getElementsByClassName('fullwidth dark tbborder');
  var removeList = [];
  
  for (var index = 0; index < allMessages.length; index ++)
  {
    var isGroup = allMessages[index].getElementsByClassName('groupmessageheader');
    if (isGroup.length != 0) 
    {
         var value = isGroup[0].getElementsByTagName("a")[0].href;
         var group = value.substring(value.indexOf('(') + 1, ')' - 1);
         if (group != groupKey) removeList.push(allMessages[index]);

    }
  }
  
  for (index = 0; index < removeList.length; index++) removeList[index].remove(); 
}






