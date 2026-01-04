// ==UserScript==
// @name SN Cut Replies Down To Size
// @version 1.1.4
// @description Cut replies down to size
// @namespace Violentmonkey Scripts
// @match https://aut.service-now.com/sc_task.do?*
// @match https://aut.service-now.com/incident.do?*
// @match https://aut.service-now.com/*
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @require https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/401851/SN%20Cut%20Replies%20Down%20To%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/401851/SN%20Cut%20Replies%20Down%20To%20Size.meta.js
// ==/UserScript==

var cust_comms = document.getElementsByClassName("h-card h-card_md h-card_comments");

for (i = 0; i < cust_comms.length; i++)
{
  // split *after* the 'from' 
  var cc = "";
  if (cust_comms[i].innerHTML.includes(" AUT Support Services &lt;aut.support.services@aut.ac.nz"))
  {
    cc = cust_comms[i].innerHTML.split(" AUT Support Services &lt;aut.support.services@aut.ac.nz")[0];
  }
  else if (cust_comms[i].innerHTML.includes("Sent from my iPhone"))
  {
    cc = cust_comms[i].innerHTML.split("Sent from my iPhone")[0];
  }
  
  // this is because for if it doesn't find one of the things above, it'll set cc as undefined and replace the first system message with that and then crash
  if (cc != "")
  {
    cc += "</span></div></div>" + cust_comms[i].childNodes[3].outerHTML;
    cust_comms[i].innerHTML = cc;
    cc = "";
  }
  
  if (cust_comms[i].childNodes[0].innerText.split("\n")[1] == "system")
  {      
    if (cust_comms[i].childNodes[2].innerText.split("\n")[2] == undefined)
    {
      // this is in case it's an image
      // do nothing. not very pretty, but pretty effective
    }
    else if (cust_comms[i].childNodes[2].innerText.split("\n")[2].includes("has a new comment"))
    {
      cust_comms[i].childNodes[2].innerText = "Your assigned task has a new comment";
    }
    else if (cust_comms[i].childNodes[2].innerText.split("\n")[0].includes("Email sent"))
    {
      cust_comms[i].childNodes[2].innerText = "Email sent";
    }
    else if (cust_comms[i].childNodes[2].innerText.split("\n")[0].includes("Email received"))
    {
      // this doesn't work properly but idgaf, been looking into it, can't find the reason  and it's not a major
      cust_comms[i].childNodes[2].innerText = "Email received";
    }
    else if (cust_comms[i].childNodes[2].innerText.split("\n")[2].includes("notification"))
    {
      cust_comms[i].childNodes[2].innerText = "Task notification";
    }
    else if (cust_comms[i].childNodes[2].innerText.split("\n")[2].includes("has been assigned to you"))
    {
      cust_comms[i].childNodes[2].innerText = "Ticket has been assigned to you";
    }
    else if (cust_comms[i].childNodes[2].innerText.split("\n")[2].includes("has been assigned to group"))
    {
      cust_comms[i].childNodes[2].innerText = "Ticket assigned to " + cust_comms[i].childNodes[2].innerText.split("\n")[2].split("assigned to group ")[1];
    }
  }
}





