// ==UserScript==
// @name        File Karelia randomizer
// @description Just random links. If link is valid - left's it here
// @match       http://file.karelia.ru/*
// @grant       GM_addStyle
// @grant       GM_openInTab
// @version     1
// @license     MIT
// @namespace https://greasyfork.org/users/205894
// @downloadURL https://update.greasyfork.org/scripts/459431/File%20Karelia%20randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/459431/File%20Karelia%20randomizer.meta.js
// ==/UserScript==

//Create a button in a container div
var zNode       = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'For Pete\'s sake, don\'t click me!</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);
Reload();

function Reload(){
var element =  document.getElementById('mainContent');
if (typeof(element) != 'undefined' && element != null)
{
    document.getElementById("myButton").click();
}
else
{
    document.getElementById("myButton").click();
}
}

function ButtonClickAction (zEvent) {
   //There is Actions for click
   const newSshotUrl = `http://file.karelia.ru/${makeid()}`;
    var element =  document.getElementById('mainContent');
if (typeof(element) != 'undefined' && element != null)
{
     GM_openInTab(newSshotUrl);
}
else
{
             console.error(newSshotUrl);
     console.error(makeid());
    GM_openInTab(newSshotUrl);
    window.close()
}
    document.getElementById ("myContainer").appendChild (zNode);
}
function reloadPage() {
    window.location.reload();
  }
function makeid() {
    let length = 6;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}