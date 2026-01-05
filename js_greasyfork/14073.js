// ==UserScript==
// @name        Coordinator
// @namespace   bitbucket.org/Odahviing
// @description Small fleet utility to increase effective
// @include     http://www.war-facts.com/fleet.php?fleet=*
// @include     http://www.war-facts.com/fleet/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14073/Coordinator.user.js
// @updateURL https://update.greasyfork.org/scripts/14073/Coordinator.meta.js
// ==/UserScript==


// Version 1.0  - Basic version - will make it much bigger
// Version 1.1  - Added random cords generator
// Version 1.2  - Limiting Z axi + Fix issue with "next explorer script"
// Version 1.21 - Bug fix for some of the fleet status
// Version 1.3  - Bug fix to all kind of fleets status


window.setTimeout(main,500); // For loading issues

function detectLine(lines)
{
   var startLine = 4;
   var ahref = lines[4].getElementsByTagName('a')[0];
  
  if (ahref != undefined  && ahref.innerHTML.indexOf('global') != -1) return ahref;
   var ahref = lines[5].getElementsByTagName('a')[0];
    if (ahref != undefined && ahref.innerHTML.indexOf('global') != -1) return ahref;
   var ahref = lines[6].getElementsByTagName('a')[0];
   if (ahref != undefined && ahref.innerHTML.indexOf('global') != -1) return ahref;
}

function coordCopy()
{
  // Get cords and copy
  var lines = document.getElementsByClassName('light tbborder padding5');
  var ahref = detectLine(lines);
  var change = document.getElementById('textcoords').value;
  
  var coords = ahref.innerHTML.substring(0, ahref.innerHTML.indexOf('g')-1);  
  
  if (change == "")
  {
    document.getElementById('xyz').value=coords;  
  }
  else
  {
    var eachCoord = coords.replace(",","").replace(",","").split(' ');
    
    var xCoord = parseInt(eachCoord[0]);
    var yCoord = parseInt(eachCoord[1]);
    var zCoord = parseInt(eachCoord[2]);
    
    var amountChange = parseInt(change);
    
    
    if (amountChange > 15000)
    {
        var zChange = 5000;
        amountChange -= zChange;
        var xChange = Math.ceil(amountChange / 2);
        var yChange = Math.floor(amountChange / 2);      
    }
    else
    {
        var zChange = Math.floor(amountChange /3);
        var xChange = Math.ceil(amountChange / 3);
        var yChange = Math.floor(amountChange / 3);
    }
    

    
    xCoord += Math.round((2 * Math.random() - 1) * xChange);
    
    yCoord += Math.round((2 * Math.random() - 1) * yChange);
    zCoord += Math.round((2 * Math.random() - 1) * zChange);
    
    document.getElementById('xyz').value= xCoord + ", " + yCoord + ", " + zCoord;
    
  }
}

function main()
{
  // Make New Button
  var newButton = document.createElement('input');
  newButton.setAttribute("class", "submit darkbutton");
  newButton.setAttribute("type", "button");
  newButton.setAttribute("id", "buttoncopy");
  newButton.setAttribute("value", "Current");
  newButton.addEventListener("click", coordCopy, false);
  
  var newLine = document.createElement('input');
  newLine.setAttribute("class", "darkinput text");
  newLine.setAttribute("style", "width: 80px;");
  newLine.setAttribute("type", "text");
  newLine.setAttribute("id", "textcoords");
  newLine.setAttribute("value", "");
  
  // Attach Button
  var coordLine = document.getElementById('mCoordinates');
  coordLine.appendChild(newButton); 
  coordLine.appendChild(newLine);
 
  
}


