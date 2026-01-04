// ==UserScript==
// @name Cosmetic Ticket Improvements
// @namespace Violentmonkey Scripts
// @description Cosmetic Improvements to Tickets
// @match https://aut.service-now.com/incident.do*
// @match https://aut.service-now.com/sc_task.do*
// @grant GM_xmlhttpRequest
// @version 3.2.3
// @downloadURL https://update.greasyfork.org/scripts/388086/Cosmetic%20Ticket%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/388086/Cosmetic%20Ticket%20Improvements.meta.js
// ==/UserScript==
 
 
// "1st Level Support Group" / "2nd Level Support Group" / "3rd Level Support Group"
var my_team = "2nd Level Support Group";
 
var type = document.getElementById("sys_target").value; //will be either 'incident' or 'sc_task'
 
// delete that dumb ass cancel button (doesn't seem to always be there on sc_tasks)
if (document.getElementById("cancel_inc"))
{
  document.getElementById("cancel_inc").remove();
}
 
//
// Add DNS name under barcode
//
// https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore - to add copy buttons to text field
//
/*
var machine_info = g_form.getReference('cmdb_ci');
var asset_tag_field = document.getElementById(`${type}.cmdb_ci.asset_tag`);
if( document.getElementById(`${type}.cmdb_ci.asset_tag`).value != "" )
{
  var hostname_field = asset_tag_field.cloneNode(true);
 
  hostname_field.id = `${type}.cmdb_ci.hostname`;
  hostname_field.value = machine_info.dns_domain;
 
  asset_tag_field.after(hostname_field);
}
*/
 
//
// Add username under full name
//

if (document.getElementById(`sys_display.${type}.caller_id`))
{
  var affected_contact_info = g_form.getReference('caller_id');
  var affected_contact_field = document.getElementById('sys_display.incident.caller_id');
  var affected_contact_elem = document.getElementById("element.incident.caller_id");
  
  /*
  var clone_elem = document.getElementById("element.incident.caller_id.phone");
  var elem_insert_point = "afterend";
  
  var username_field = clone_elem.cloneNode(true);
  // ugly as all hell, but removes (most) references to other fields to avoid future issues
  username_field.id = "sys_display.affected_contact.username";
  username_field.childNodes[2].remove();
  username_field.childNodes[1].childNodes[0].remove();
  username_field.childNodes[1].childNodes[0].setAttribute("id", "sys_display.affected_contact.username");
  username_field.childNodes[1].childNodes[0].setAttribute("name", "sys_display.affected_contact.username");
  username_field.childNodes[1].childNodes[0].setAttribute("onChange", "");
  username_field.childNodes[1].childNodes[0].setAttribute("value", affected_contact_info.user_name);
  username_field.childNodes[0].setAttribute("id", "sys_display.affected_contact.username");
  username_field.childNodes[0].childNodes[0].removeAttribute("for");
  username_field.childNodes[0].childNodes[0].childNodes[1].remove();
  username_field.childNodes[0].childNodes[0].setAttribute("id", "sys_display.affected_contact.username");
  username_field.childNodes[0].childNodes[0].childNodes[0].setAttribute("id", "sys_display.affected_contact.username");
 
  username_field.disabled = true;
  username_field.childNodes[1].childNodes[0].value = affected_contact_info.user_name;
  username_field.childNodes[0].childNodes[0].childNodes[0].innerHTML = "Login"
  affected_contact_elem.insertAdjacentElement(elem_insert_point, username_field);
  */
}
else
{
  var affected_contact_info = g_form.getReference('request_item.request.requested_for');
  var affected_contact_field = document.getElementById('sys_display.sc_task.request_item.request.requested_for');
  var affected_contact_elem = document.getElementsByClassName("vsplit col-sm-6")[2];
  
  /*
  var clone_elem = document.getElementById("element.sc_task.number");
  var elem_insert_point = "beforeend";
  
  var username_field = clone_elem.cloneNode(true);
  username_field.id = "sys_display.affected_contact.username";
  username_field.childNodes[2].remove();
  username_field.childNodes[1].childNodes[2].remove();
  username_field.childNodes[1].childNodes[0].remove();
  username_field.childNodes[0].childNodes[0].childNodes[0].remove();
  username_field.childNodes[0].setAttribute("id", "sys_display.affected_contact.username");
  username_field.childNodes[0].childNodes[0].setAttribute("for", "");
  username_field.childNodes[0].childNodes[0].setAttribute("onclick", "");
  username_field.childNodes[1].childNodes[0].setAttribute("id", "");
  username_field.childNodes[0].childNodes[0].setAttribute("id", "sys_display.affected_contact.username");
  username_field.childNodes[1].childNodes[0].setAttribute("value", affected_contact_info.user_name);
 
 
  username_field.disabled = true;
  username_field.childNodes[1].childNodes[0].value = affected_contact_info.user_name;
  username_field.childNodes[0].childNodes[0].childNodes[0].innerHTML = "Login"
  affected_contact_elem.insertAdjacentElement(elem_insert_point, username_field);
  */
}


//
// Check the user's Online Network Accounts
//
 
// first just create an empty thingy and then once we click on it, we'll pull the data
 
// seems dicky, basically cloning a node to 'before', or something similar is a royal PITA, so instead we clone it to 'after' and then basically swap the names
var curr_logins_bar;
if(type == "incident")
{
  curr_logins_bar = document.getElementsByClassName("row")[9];
}
else
{
  curr_logins_bar = document.getElementsByClassName("row")[8];
}
curr_logins_bar.id = "curr_logins_collapsible";
 
var ticket_details_bar = curr_logins_bar.cloneNode(true);
ticket_details_bar.id = "ticket_details_collapsible";
 
// https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
curr_logins_bar.insertAdjacentElement('afterend', ticket_details_bar);
 
curr_logins_bar.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].data = "+ Current Logins / Online Network Accounts";
 
curr_logins_bar.onclick = function(event) {
  if(!document.getElementById("user_connections_list"))
  {
    retrieve_connection_data();
  }
  else
  {
    document.getElementById("user_connections_list").toggle();
  }
  if(curr_logins_bar.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].data == "+ Current Logins / Online Network Accounts")
  {
    curr_logins_bar.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].data = "- Current Logins / Online Network Accounts";
  }
  else
  {
    curr_logins_bar.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].data = "+ Current Logins / Online Network Accounts";
  }
}
 
function retrieve_connection_data()
{
  var connection_data = [];
 
  GM_xmlhttpRequest({
    method: "GET",
    url: `https://webadmin.aut.ac.nz/admin/utils/swazd/online.cgi?Q=${affected_contact_info.user_name}&contenttable_length=10`,
    onload: function(response) 
    {
      var today = new Date();
      var year = today.getFullYear();
      var month = today.getMonth() + 1;
      var day = today.getDate();
      var iso_date = [year, month.toString().padStart(2, '0'), day.toString().padStart(2, '0')].join('-');
 
      // the dataSet variable stores an array of json with the info about the 10 most recent connections
      const regex_dataset = /var dataSet = \[(.*)\]/i
      var connections_list = response.responseText.match(regex_dataset)[1];
      // first use regex to replace the "},{" with "},,{" - this is because if we try and split it on commas it'll fuck our shit up, this way we split it into different objects
      connections_list_array = connections_list.replace(/},{/g, "},,{").split(',,');
      connections_list_array.forEach(element => {
        conn_data = JSON.parse(element);
        
        if(conn_data["LoginTime"].includes(' ')) // indicates there's a date, as well as a time
        {
          var ip_data = conn_data["IPAddress"].replace('/admin/db/ipd/ipd.cgi?e=', 'https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi?e=');
          connection_data[conn_data["LoginTime"]] = {"ip":ip_data, "mac":conn_data["MAC"], "location":conn_data["Location"], "remaining_time":conn_data["Remaining"]};
        }
        else // we can assume the connection was today
        {
          var ip_data = conn_data["IPAddress"].replace('/admin/db/ipd/ipd.cgi?e=', 'https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi?e=');
          connection_data[`${iso_date} ${conn_data["LoginTime"]}`] = {"ip":ip_data, "mac":conn_data["MAC"], "location":conn_data["Location"], "remaining_time":conn_data["Remaining"]};
        }
      });
      // for SOME FUCKING REASON, js decides that connection_data is actually an OBJECT INSTEAD OF A FUCKING ARRAY LIKE I DECLARED IT
      // so we'll convert it and then work with it
      // https://www.samanthaming.com/tidbits/76-converting-object-to-array/
      var conn_data_array = Object.entries(connection_data);
      conn_data_array.sort();
      conn_data_array = conn_data_array.reverse(); // put the highest numerical date (i.e. most recent) at the top
      conn_data_array = conn_data_array.slice(0, 10); // just want the 10 most recent
 
      var users_connections_div = document.createElement("div");
      users_connections_div.id = "user_connections_list";
      var all_conn_info = `<table border='1'><tr> <th style="padding:2px;text-align:center">Location</th> <th style="padding:2px;text-align:center">IP</th> <th style="padding:2px;text-align:center">MAC</th> <th style="padding:2px;text-align:center">Login Time</th> <th style="padding:2px;text-align:center">Remaining Time</th> </tr>`;
      var index = 0;
      while(index < conn_data_array.length)
      {
        all_conn_info += `<tr> <td style="padding:2px;text-align:center">${conn_data_array[index][1]["location"]}</td> <td style="padding:2px;text-align:center">${conn_data_array[index][1]["ip"]}</td> <td style="padding:2px;text-align:center">${conn_data_array[index][1]["mac"]}</td> <td style="padding:2px;text-align:center">${conn_data_array[index][0]}</td> <td style="padding:2px;text-align:center">${conn_data_array[index][1]["remaining_time"]}</td> </tr>`;
        index++;
      }
 
      all_conn_info += "</table></br>";
 
      users_connections_div.innerHTML = all_conn_info;
      
      curr_logins_bar.insertAdjacentElement('afterend', users_connections_div);
      // don't need to start it hidden as it starts off not existing, so when it's generated is also when we want to see it
      //document.getElementById("user_connections_list").style.display = "none";
    }
  });
}
 
//
//Convert INC/REQ/KB text to links to respective tickets/article search, barcodes to IPD search links and MAC addresses to Netmon Locator search links
//https://stackoverflow.com/questions/1324676/what-is-a-word-boundary-in-regexes
//
 
const regex_barcode   = /(\d\d-(PURC|\d{4})-\d{4})/ig
const regex_mac_addr  = /(([0-9A-F]{2}[:-]){5}([0-9A-F]){2})/ig
const regex_sctask    = /(SCTASK\d{8})/ig
const regex_ritm      = /(RITM\d{8})/ig
const regex_inc       = /(INC\d{8})/ig
const regex_kb        = /(KB\d{7})/ig
const regex_chg       = /(CHG\d{8})/ig
const regex_prb       = /(PRB\d{7})/ig
 
var comms_or_notes_card = "sn-widget-textblock-body sn-widget-textblock-body_formatted";
var inc_text = document.getElementsByClassName(comms_or_notes_card);
var card_index;
for(card_index = 0; card_index < inc_text.length; card_index++)
{
  document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML = document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML.replace(regex_barcode, "<a href=\"https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi?v1=$1&q1=all&Rows=50&Set=0\" target=\"_blank\">$1</a>");
  document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML = document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML.replace(regex_mac_addr, "<a href=\"https://netmon.aut.ac.nz/admin/monitor/FindMacAddress.pl?macaddress=$1\" target=\"_blank\">$1</a>");
  document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML = document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML.replace(regex_sctask, "<a href=\"https://aut.service-now.com/nav_to.do?uri=sc_task.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
  document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML = document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML.replace(regex_ritm, "<a href=\"https://aut.service-now.com/nav_to.do?uri=/sc_req_item.do?sys_id=$1&sysparm_view=\" target=\"_blank\">$1</a>");
  document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML = document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML.replace(regex_inc, "<a href=\"https://aut.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
  document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML = document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML.replace(regex_kb, "<a href=\"https://aut.service-now.com/nav_to.do?uri=%2Fkb_knowledge_list.do%3Fsysparm_clear_stack%3Dtrue%26sysparm_userpref_module%3D2180b621ff0131009b20ffffffffffc5%26sysparm_list_mode%3Dgrid%26sysparm_query%3D%255EGOTO123TEXTQUERY321%253D$1%26sysparm_offset%3D\" target=\"_blank\">$1</a>");
  document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML = document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML.replace(regex_chg, "<a href=\"https://aut.service-now.com/nav_to.do?uri=/change_request.do?sys_id=$1&sysparm_view=\" target=\"_blank\">$1</a>");
  document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML = document.getElementsByClassName(comms_or_notes_card)[card_index].innerHTML.replace(regex_prb, "<a href=\"https://aut.service-now.com/nav_to.do?uri=/problem_list.do?sys_id=$1&sysparm_view=\" target=\"_blank\">$1</a>");
}
 
//
//Remove the email sig spam
//
 
var image_cards = document.getElementsByClassName("h-card h-card_md h-card_comments");
var card_index;
var elements_to_remove = [];
for(card_index = 0; card_index < image_cards.length; card_index++)
{
  //All system posts
  if( document.getElementsByClassName("h-card h-card_md h-card_comments")[card_index].children[0].children[1].attributes[0].ownerElement.innerHTML == "system" )// && document.getElementsByClassName("h-card h-card_md h-card_comments")[card_index].children[2].attributes.length > 1)
  {
    // if it has a file with the show-image-modal
    // will have 8 attributes if it's an image, 1 if it's some other bullshit
    if(!document.getElementsByClassName("h-card h-card_md h-card_comments")[card_index].children[2].innerText)
    {
      if(document.getElementsByClassName("h-card h-card_md h-card_comments")[card_index].children[2].children[0].attributes.length == 8)
      //insert these with the last first in the array so that when we loop over them and remove them later we don't fuck up with indexing
      elements_to_remove.splice(0, 0, document.getElementsByClassName("h-card h-card_md h-card_comments")[card_index]);
    }
  } 
}
//actually delete the email sig spam
elements_to_remove.forEach(elem => {
  elem.remove();
});
 
// ADDS A SMALL INDICATOR FOR IF ONE SHOULD CHECK THE LEASE STATUS
// The actual lease expiry date doesn't seem to be in the pulled data, so I doubt it's actually stored in IPD...
var device_info = g_form.getReference('cmdb_ci');
if(device_info.asset_tag != "" && device_info.asset_tag != undefined)
{
  var date = new Date();
  var current_year = date.getFullYear().toString().substr(-2);
  var current_year_int = parseInt(current_year, 10);
 
  var barcode = document.getElementById(`${type}.cmdb_ci.asset_tag`).value;
  var barcode_date = barcode.substring(0,2);
  var barcode_date_int = parseInt(barcode_date, 10);
 
  var message = "";
  var color = "green";
 
  if((current_year_int - barcode_date_int) >= 3) 
  {
    if(barcode.includes("PURC"))
    {
      message = "PURCHASED DEVICE, OLDER THAN 3 YEARS";
      color = "orange";
    }
    else
    {
      message = "LEASE MAY BE EXPIRED";
      color = "red";
    }
  }
  else
  {
    if(barcode.includes("PURC"))
    {
      message = "PURCHASED DEVICE";
    }
    else
    {
      message = "LEASE IS CURRENT";
    }
 
  }
 
var ci_row = document.getElementById(`${type}.cmdb_ci.asset_tag`);
ci_row.insertAdjacentHTML("afterend", `<span style='color:${color}'>${message}</span>`);
}
 
//Check if there's anyone in the watch list, if yes, grab the names, split them, wipe the original list (cause they're in a <p> and we can't put links in it)
//then generate a link per name and append it after the element
if(document.getElementById(`${type}.watch_list_nonedit`).innerText != "")
{
  var watchlist_names_elem = document.getElementById(`${type}.watch_list_nonedit`);
  var watchlist_names = document.getElementById(`${type}.watch_list_nonedit`).innerText;
  document.getElementById(`${type}.watch_list_nonedit`).innerText = "";
  watchlist_names = watchlist_names.split(", ");
  var new_html = "";
  for (ii = 0; ii < watchlist_names.length; ii++)
  {
    var new_link = document.createElement("a");
    new_link.href = `https://webadmin.aut.ac.nz/admin/db/xgab/xgab.cgi?q=${watchlist_names[ii]}`;
    new_link.target = "_blank";
    if (ii != (watchlist_names.length - 1))
    {
      new_link.innerHTML = `${watchlist_names[ii]}, `;
    }
    else
    {
      new_link.innerHTML = `${watchlist_names[ii]}`;
    }
    watchlist_names_elem.appendChild(new_link);
  }  
}