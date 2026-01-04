// ==UserScript==
// @name SNAPASS
// @namespace Violentmonkey Scripts
// @description Service Now APpointment ASSistant - create appointments from Service Now tickets
// @match https://aut.service-now.com/incident.do*
// @match https://aut.service-now.com/sc_task.do*
// @version 2.1.1
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/391948/SNAPASS.user.js
// @updateURL https://update.greasyfork.org/scripts/391948/SNAPASS.meta.js
// ==/UserScript==

var type = document.getElementById("sys_target").value; //will be either 'incident' or 'sc_task'

var ticket_id = document.getElementById(`${type}.number`).value;
var priority = document.getElementById(`${type}.priority`).value;
var short_desc = document.getElementById(`${type}.short_description`).value;

function sleep(seconds){
    var waitUntil = new Date().getTime() + seconds*1000;
    while(new Date().getTime() < waitUntil) true;
}

//tidy up the subject a little
var strip_from_subject = {};
  strip_from_subject["Self-Service Enquiry: "] = "";
  strip_from_subject["SSR Generic Mailbox Request: "] = "Mailbox Req: ";
  strip_from_subject["[SSR] Setup File/Folder Access : "] = "File Access: ";
  strip_from_subject["[SSR] New Desk Phone Request for : "] = "New Phone: ";
  strip_from_subject["[SSR] Modify Existing Phone Connection"] = "Modify Phone";
  strip_from_subject["Video Conference - "] = "Zoom: ";
for (var key in strip_from_subject)
{
  short_desc = short_desc.replace(key, strip_from_subject[key])
}
//plenty of encodeURIComponent in use, as we're passing all the details via a URL, so we gotta
var subject = encodeURIComponent(`${ticket_id} P${priority} ${short_desc} [AUTO]`);

var location = document.getElementById(`sys_display.${type}.location`).value;

if( type == "sc_task")
{
  var affcon_info = g_form.getReference('request_item.request.requested_for');
}
else
{
  var affcon_info = g_form.getReference('caller_id');
}

var affcon_username = affcon_info.user_name;
var affcon_name = affcon_info.first_name + " " + affcon_info.last_name;
var phone = affcon_info.phone;
var mobile_number = affcon_info.mobile_phone;

var requestor_info = g_form.getReference('opened_by');
var requestor_name = requestor_info.first_name + " " + requestor_info.last_name;

if(requestor_info.user_name == affcon_username)
{  
  if(phone != "")
  {
    var body = encodeURIComponent(`${affcon_name} // ${affcon_username} // ext ${phone}`);
  }
  else
  {
    var body = encodeURIComponent(`${affcon_name} // ${affcon_username}`);
  }
  if(mobile_number != "")
  {
    body += ` // ${mobile_number}`;
  }
  
  body += encodeURIComponent(`<br><a href="https://webadmin.aut.ac.nz/admin/db/xgab/xgab.cgi?q=${requestor_info.user_name}">XGAB</a>`);
  body += encodeURIComponent(`<br><a href="https://webadmin.aut.ac.nz/admin/utils/swazd/swazd.cgi?id=${affcon_username}">SwazD</a>`);
  body += encodeURIComponent(`<br><a href="https://webadmin.aut.ac.nz/admin/db/xiud/xiud.cgi?q=${affcon_username}">XIUD</a><br>`);
}
else
{  
  if(phone != "")
  {
    var body = encodeURIComponent(`REQUESTOR: ${requestor_name}`);
    body += encodeURIComponent(`<br>AFFCON: ${affcon_name} // ${affcon_username} // ext ${phone}`);
  }
  else
  {
    var body = encodeURIComponent(`REQUESTOR: ${requestor_name}`);
    body += encodeURIComponent(`<br>AFFCON: ${affcon_name} // ${affcon_username}`);
  }
  if(mobile_number != "")
  {
    body += ` // ${mobile_number}`;
  }
  
  body += encodeURIComponent(`<br><a href="https://webadmin.aut.ac.nz/admin/db/xgab/xgab.cgi?q=${affcon_username}">AFFCON XGAB</a>`);
  body += encodeURIComponent(`<br><a href="https://webadmin.aut.ac.nz/admin/utils/swazd/swazd.cgi?id=${affcon_username}">AFFCON SwazD</a>`);
  body += encodeURIComponent(`<br><a href="https://webadmin.aut.ac.nz/admin/db/xiud/xiud.cgi?q=${affcon_username}">AFFCON XIUD</a><br>`);
}

//appointment made or not
if (document.getElementById(`${type}.state`).value == 99) //appointment made
{
  //service now's format: 01-11-2019 08:30:00
  //required format: 2019-11-01T19:00:00+13:00
  
  //easier doing it this way because I really shouldn't need a bloody library to do some basic date/time formatting
  //var date_time = (document.getElementById(`${type}.follow_up`).value).split(" ");
  var date_time = (document.getElementById(`${type}.expected_start`).value).split(" ");
  var date_array = date_time[0].split("/");
  //.replace() only replaces first instance by default...
  var time_string = date_time[1].replace(/:/g, "%3A")
  //HAVE to include the +13%3A00 as that's the timezone data that makes the whole thing correct
  var appointment_start = `${date_array[2]}-${date_array[1]}-${date_array[0]}T${time_string}+13%3A00`;

  //default appointment length is 30 minutes so we can ignore creating that
}
else
{
  //current date and time - should be auto generated anyway
}

if(document.getElementById(`${type}.cmdb_ci.asset_tag`).value != "")
{
  var barcode = document.getElementById(`${type}.cmdb_ci.asset_tag`).value;
  body += encodeURIComponent(`<br><a href="https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi?v1=${barcode}&q1=all&Rows=100&Set=0">IPD ${barcode}</a>`);
}

if (location != "")
{
  body += encodeURIComponent(`<br><a href="https://auti.aut.ac.nz/directorate/estates/iestates/pages/Room.aspx?spaceID=${location}">Estates Lookup</a>`);
}

// Canning this as it sometimes failed due to some tickets not having a sys_id in the url
//grab the ticket's internal(?) ID from the URL as it's the only thing we actually need to generate the link
//var url_decoded = decodeURIComponent(document.location.href);
//var sys_id_regex = /sys_id.(.{32})/;
//var sys_id = sys_id_regex.exec(url_decoded)[1];

if (document.body.innerText.includes("https://aut.zoom.us/j/"))
{
  var zoom_regex = /https:\/\/aut.zoom.us\/j\/(\d{11}\?pwd=.{32})/;
  var zoom_id = zoom_regex.exec(document.body.innerText)[1];
  var zoom_link = `https://aut.zoom.us/j/${zoom_id}`;
  
  var zoom_password_regex = /Passcode: (\d{6})/;
  var zoom_password = zoom_password_regex.exec(document.body.innerText)[1];
  
  var zoom_account_regex = /Web Conference (\d) is inviting you to a scheduled Zoom meeting./;
  var zoom_account = zoom_account_regex.exec(document.body.innerText)[1];
  var hostkey = "";
  switch(zoom_account)
  {
    case "1":
      hostkey = "560281";
      break;
    case "2":
      hostkey = "676587";
      break;
    case "3":
      hostkey = "866120";
      break;
    case "4":
      hostkey = "638663";
      break;
    case "5":
      hostkey = "224887";
      break;
  }
  
  //just to make it a bit easier to read at a glance
  var zoom_id_pretty = `${zoom_id.substring(0,3)}-${zoom_id.substring(3,7)}-${zoom_id.substring(7,11)}`;
  body += encodeURIComponent(`<br>Zoom <a href="${zoom_link}">${zoom_id_pretty}</a> | Password: ${zoom_password} | HostKey: ${hostkey}`);
}

//body += encodeURIComponent(`<br><a href="https://aut.service-now.com/nav_to.do?uri=/${type}.do?sys_id=${sys_id}&sysparm_stack=&sysparm_view=">Service Now</a>`);
body += encodeURIComponent(`<br><a href="https://webadmin.aut.ac.nz/admin/spong/search.cgi?q=${ticket_id}">Service Now</a>`);
body += encodeURIComponent(`<br>[THIS APPOINTMENT HAS BEEN MADE AUTOMATICALLY WITH A SCRIPT]`);
body += encodeURIComponent(`<br>[<a href="mailto:john.viaene@aut.ac.nz?subject=SNAPASS">SUPPORT</a>]`);

//
// Add Create Appointment button
// 
//https://www.w3schools.com/jsref/met_node_appendchild.asp
var appt_button = document.createElement("button");
appt_button.style = "white-space: nowrap";
appt_button.innerHTML = "Create Appointment";
appt_button.id = "create_appt";
appt_button.onClick = "create_appt()";

//inject our button to the left of the save button, cheers Owen
//document.getElementById("sysverb_update_and_stay").insertAdjacentElement("beforebegin", appt_button);
document.getElementById("save_incident").insertAdjacentElement("beforebegin", appt_button);

button = document.getElementById("create_appt");
button.addEventListener("click", create_appt, false);

function create_appt()
{
  var appt_link = `https://outlook.office.com/owa/?path=/calendar/action/compose&subject=${subject}&location=${location}&startdt=${appointment_start}&body=${body}`;
  window.open(appt_link);
}