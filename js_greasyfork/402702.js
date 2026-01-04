// ==UserScript==
// @name        Trim Comms ServiceNow
// @match       https://aut.service-now.com/*sc_task.do*
// @match       https://aut.service-now.com/*incident.do*
// @grant       none
// @version     2.0
// @description Trims customer comms to exclude email chains for SCTASKS
// @namespace https://greasyfork.org/users/453161
// @downloadURL https://update.greasyfork.org/scripts/402702/Trim%20Comms%20ServiceNow.user.js
// @updateURL https://update.greasyfork.org/scripts/402702/Trim%20Comms%20ServiceNow.meta.js
// ==/UserScript==

// get all textblock span objects. These are what contain comms.
var commsElements = document.getElementsByClassName("sn-widget-textblock-body sn-widget-textblock-body_formatted");

// loop through them. call formatComms function for each.
for (var i = 0; i < commsElements.length; i++)
{
    formatComms(commsElements[i]);
}

// function called with argument element.
// get the innerHTML value of each span element, modify to grab first "email" in chain, and set that as new innerHTML
function formatComms()
{
    var element = arguments[0];
    element.innerHTML = element.innerHTML.split("<br>________________________________")[0];
}