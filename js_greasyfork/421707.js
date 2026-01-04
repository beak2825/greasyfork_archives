// ==UserScript==
// @name         Halo Faction
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @grant        none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/421707/Halo%20Faction.user.js
// @updateURL https://update.greasyfork.org/scripts/421707/Halo%20Faction.meta.js
// ==/UserScript==

(function() {
    'use strict';
var ajax_item = [];
    $(document).ajaxComplete(function(e,v,r)
{
console.log(e);

if(!ajax_item.hasOwnProperty(e.currentTarget.URL)){ajax_item[e.currentTarget.URL] = [];}
if (ajax_item[e.currentTarget.URL].hasOwnProperty('timestamp'))
{
if(ajax_item[e.currentTarget.URL].timestamp<=parseInt(e.timeStamp))
{
ajax_item[e.currentTarget.URL].timestamp = parseInt(e.timeStamp);
if(e.currentTarget.URL === 'https://www.torn.com/factions.php?step=your#/tab=controls&option=members'){Members_Menu(e.target,e.currentTarget.URL);}
}
}
else
{ //console.log(e.target.body);
ajax_item[e.currentTarget.URL].timestamp = parseInt(e.timeStamp);
if(e.currentTarget.URL === 'https://www.torn.com/factions.php?step=your#/tab=controls&option=members'){Members_Menu(e.target,e.currentTarget.URL);}
}

   });
function Members_Menu(briefcase,target)
{
if(briefcase.getElementById("option-members-root")&&briefcase.getElementById("option-members-root").children[0].className.includes("membersWrapper"))
{
for (var briefcse_index = 0; briefcse_index < briefcase.getElementById("option-members-root").children[0].children.length; briefcse_index++)
{
if(briefcase.getElementById("option-members-root").children[0].children[briefcse_index].className.includes("rowsWrapper"))
{
//OK HERE We have the list of members.
console.log(briefcase.getElementById("option-members-root").children[0].children[briefcse_index].children);
}
}


    }
//console.log(ajax_item[target]);
}
    // Your code here...e.currentTarget.URL
})();
/*
https://www.torn.com/factions.php?step=your#/tab=controls&option=members
*/