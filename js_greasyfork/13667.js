// ==UserScript==
// @name        Starlog Group Sender
// @namespace   bitbucket.org/Odahviing
// @include     http://www.war-facts.com/player.php
// @include     http://www.war-facts.com/bptrade.php?*
// @include     http://www.war-facts.com/sdtrade.php?*
// @description Add the ability to send blueprints (from any kind) to starlog groups
// @version     1.11
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/13667/Starlog%20Group%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/13667/Starlog%20Group%20Sender.meta.js
// ==/UserScript==

// Version 1.0  - Support on blueprint trade and ship design trade, not best implemented, will make it better in the future (use same button)
// Version 1.1  - Integrated the two buttons to one, still need better response message
// Version 1.11 - Bug fix - send ship design didn't work

/* Settings */
var ButtonName = "buttonGM";
var PlayerSettings = "player";
var BlueprintSendName = "bptrade";
var BlueprintSendSelect = "bpplayer";
var ShipDesignSendName = "sdtrade";
var ShipDesignSendSelect = "sdplayer";
/* End Settings */
    
function saveGroups()
{
  var groupsNames = document.getElementsByName('editstarloggroupname');
  var groupsId = document.getElementsByName('editstarloggroup');
  
  var arrayList = [];
  for (var index = 0 ; index < groupsId.length; index ++)
  {
    var singleArray = [groupsId[index].value, groupsNames[index].value];
    var playersList = document.getElementById("starloggroup" + groupsId[index].value);
  
    var playersSpan = playersList.getElementsByTagName('span');
    for (var sIndex = 0; sIndex < playersSpan.length; sIndex ++)
    {
      var finalId = playersSpan[sIndex].id.substring(3, playersSpan[sIndex].id.indexOf('-'));
      singleArray.push(finalId);
    } 
    arrayList.push(singleArray);
  }
  GM_setValue("stargroupId", arrayList);
}

function addGroupsOptions(selectName)
{
  var loadedData = GM_getValue("stargroupId");
  var select = document.getElementsByName(selectName);
  
  var docfrag = document.createDocumentFragment();
  
  for (var index = 0; index < loadedData.length; index ++)
  {
       docfrag.appendChild(
         new Option("Starlog Group: " + loadedData[index][1], loadedData[index][0]));
  }
  select[0].insertBefore(docfrag,select[0].firstChild);
}

// Old Function - Version 1.0
function drawButton(Name, Select)
{
  var row = document.getElementsByTagName('form');
  row[0].innerHTML = row[0].innerHTML + 
    "<input id='" + ButtonName + "' name='Submit' value='Send To Group' type='button'>";
  document.getElementById(ButtonName).addEventListener("click", function(){
    sendToGroup(Name, Select)}, 
    false);  
}

function changeButton(Name, Select)
{
  var row = document.getElementsByName('Submit');
  row[0].type = "button";
  row[0].addEventListener("click", function(){
    sendToGroup(Name, Select)}, 
    false);  
}

function getInputValues(form, page)
{
  var inputValues = form.getElementsByTagName('input');
  var values = [];
  switch(page)
  {
    case ShipDesignSendName:
      values = [inputValues[0].value, inputValues[1].value];
      return "Submit=Give&tradeid=" + values[0] + "&type=" + values[1] + "&" + ShipDesignSendSelect +"=";
    case BlueprintSendName:
      values = [inputValues[0].value, inputValues[1].value, inputValues[2].value];
      return "Submit=Give&tradeid=" + values[0] + "&type=" + values[1] + "&subtype=" + values[2] + "&" + BlueprintSendSelect + "=";
  }  
}

function sendToGroup(page, selector)
{
  
  var loadedData = GM_getValue("stargroupId");  
  var select = document.getElementsByName(selector);
  var regForm = document.getElementsByTagName('form');
   
  var groupId = select[0].value;
  var neededIndex = -1;
  for (var index = 0; index < loadedData.length; index ++)
  {
    if (loadedData[index][0] == groupId)
      neededIndex = index;
  }

  if (neededIndex == -1)
  {
    regForm[0].submit();
    return;
  }
  
  baseParams = getInputValues(regForm[0], page);
  var playerAmount = loadedData[neededIndex].length - 2;
  for (var sIndex = 0; sIndex < playerAmount; sIndex ++)
  {
    var params = baseParams + loadedData[neededIndex][sIndex + 2];
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", page + ".php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
  }
  
  alert("Finish Sending Blueprint To '" + 
        loadedData[neededIndex][1] + 
        "' Group (" + 
        playerAmount.toString() + 
        " Players)");
  
  regForm[0].submit();
}


function main()
{
   var page = document.URL.substring(document.URL.indexOf("/"));
   if (page.includes(PlayerSettings))
   {
     saveGroups();
   }
   else if (page.includes(BlueprintSendName))
   {
     changeButton(BlueprintSendName, BlueprintSendSelect);
     addGroupsOptions(BlueprintSendSelect);
   }
   else if (page.includes(ShipDesignSendName))
   {
     changeButton(ShipDesignSendName, ShipDesignSendSelect);
     addGroupsOptions(ShipDesignSendSelect);
   }  
}

main();