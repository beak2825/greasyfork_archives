// ==UserScript==
// @name iFramer
// @version 2.1.0
// @description Adds buttons to load iFrames for Bonnamassa, IPD, SWAZD and XGAB
// @namespace Violentmonkey Scripts
// @match https://aut.service-now.com/incident.do*
// @match https://aut.service-now.com/sc_task.do*
// @downloadURL https://update.greasyfork.org/scripts/418467/iFramer.user.js
// @updateURL https://update.greasyfork.org/scripts/418467/iFramer.meta.js
// ==/UserScript==

var type = document.getElementById("sys_target").value;
var short_desc_div = document.getElementById("element." + type + ".short_description").parentElement

/*
 * BONNAMASSA IFRAME 
 */
if( document.getElementById("sys_display." + type + ".location").value != "" && document.getElementById("sys_display." + type + ".location").value != null )
{
  var room = document.getElementById("sys_display." + type + ".location").value;
  var location_elem = document.getElementById("element." + type + ".location");

  // create and insert the timetable iframe
  var timetable_iframe = document.createElement("iframe");
  timetable_iframe.setAttribute("title", "Bonnamassa Timetable Iframe");
  timetable_iframe.setAttribute("id", "timetable_iframe");
  timetable_iframe.setAttribute("height", 750);
  timetable_iframe.setAttribute("width", "100%");
  // http://zerosixthree.se/snippets/get-week-of-the-year-with-jquery/
  // easiest way to get the week of the year as an int
  Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
  }
  var today = new Date();
  var week_number = today.getWeek();

  timetable_iframe.setAttribute("src", "https://bonnamassa.aut.ac.nz/TimetableWebView2021/Reports/Calendar.aspx?objects=" + room + "&weeks=" + week_number + "&days=0-7&periods=1-30&template=location_grid");

  function location_iframe_toggle()
  {
    if( document.getElementById("timetable_iframe") != null )
    {
      document.getElementById("timetable_iframe").toggle();
    }
    else
    {
      short_desc_div.insertAdjacentElement("beforebegin", timetable_iframe);
    }
  }

  // should prolly just create a new one instead of cloning the existing button - which I did but it always loaded the 'new ticket' page when clicked after firing it's function...
  // should prolly change the icon or add a label but i cbf rn
  var location_iframe_button = location_elem.childNodes[2].childNodes[0].childNodes[0].cloneNode(true);
  location_iframe_button.setAttribute("id", "view_timetable");
  location_iframe_button.setAttribute("name", "View Timetable");
  location_iframe_button.setAttribute("value", "View Timetable");
  location_iframe_button.setAttribute("data-original-title", "View Timetable");
  location_iframe_button.setAttribute("aria-label", "Timetable");
  location_iframe_button.setAttribute("class", "btn btn-default btn-ref icon icon-menu");
  location_iframe_button.setAttribute("title", "View Timetable");
  location_iframe_button.setAttribute("data-table", type);
  location_iframe_button.setAttribute("data-ref", type + ".location");
  location_iframe_button.setAttribute("innerHTML", "Timetable");
  location_iframe_button.removeAttribute("data-form");
  location_iframe_button.removeAttribute("data-type");
  location_iframe_button.removeAttribute("aria-haspopup");
  location_iframe_button.onclick = location_iframe_toggle;

  location_elem.childNodes[2].insertAdjacentElement("beforeend", location_iframe_button);
  
}
/*
 * END BONNAMASSA IFRAME
 */

/*
 * IPD
 */

// make sure there's actually a barcode to work with
if( g_form.getReference('cmdb_ci').asset_tag != undefined )
{
  var barcode = g_form.getReference('cmdb_ci').asset_tag;
}
if( barcode != null )
{
  // create and insert the IPD iframe
  var ipd_iframe = document.createElement("iframe");
  ipd_iframe.setAttribute("title", "IPD Iframe");
  ipd_iframe.setAttribute("id", "ipd_iframe");
  ipd_iframe.setAttribute("height", 750);
  ipd_iframe.setAttribute("width", "100%");
  ipd_iframe.setAttribute("src", `https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi?e=${g_form.getReference('cmdb_ci').name}`);

  function ipd_iframe_toggle()
  {
    if( document.getElementById("ipd_iframe") != null )
    {
      document.getElementById("ipd_iframe").toggle();
    }
    else
    {
      short_desc_div.insertAdjacentElement("beforebegin", ipd_iframe);
    }
  }

  var affected_ci_elem = document.getElementById("element." + type + ".cmdb_ci");

  var ipd_button = affected_ci_elem.childNodes[2].childNodes[0].childNodes[0].cloneNode(true);
  ipd_button.setAttribute("id", "view_ipd");
  ipd_button.setAttribute("name", "View IPD");
  ipd_button.setAttribute("value", "View IPD");
  ipd_button.setAttribute("data-original-title", "View IPD");
  ipd_button.setAttribute("aria-label", "IPD");
  ipd_button.setAttribute("class", "btn btn-default btn-ref icon icon-menu");
  ipd_button.setAttribute("title", "View IPD");
  ipd_button.setAttribute("data-table", type);
  ipd_button.setAttribute("data-ref", type + ".ipd");
  ipd_button.setAttribute("innerHTML", "IPD");
  ipd_button.removeAttribute("data-form");
  ipd_button.removeAttribute("data-type");
  ipd_button.removeAttribute("aria-haspopup");
  ipd_button.onclick = ipd_iframe_toggle;
  affected_ci_elem.childNodes[2].insertAdjacentElement("beforeend", ipd_button);
}
/*
 * END IPD
 */

/*
 * SWAZD & XGAB
 */

if( type == "sc_task" )
{
  var full_name = document.getElementById("sys_display.sc_task.request_item.request.requested_for").value;
}
else if( type == "incident" )
{
  var full_name = document.getElementById("sys_display.incident.caller_id").value;
}

if (document.getElementById(`sys_display.${type}.caller_id`))
{
  var affected_contact_info = g_form.getReference('caller_id');
}
else
{
  var affected_contact_info = g_form.getReference('request_item.request.requested_for');
}

var swazd_id = affected_contact_info.user_name;
var xgab_id = affected_contact_info.u_xgabid;

// create and insert the swazd iframe
var swazd_iframe = document.createElement("iframe");
swazd_iframe.setAttribute("title", "swazd Iframe");
swazd_iframe.setAttribute("id", "swazd_iframe");
swazd_iframe.setAttribute("height", 750);
swazd_iframe.setAttribute("width", "100%");
swazd_iframe.setAttribute("src", `https://webadmin.aut.ac.nz/admin/utils/swazd/swazd.cgi?id=${swazd_id}`);

// create and insert the xgab iframe
var xgab_iframe = document.createElement("iframe");
xgab_iframe.setAttribute("title", "xgab Iframe");
xgab_iframe.setAttribute("id", "xgab_iframe");
xgab_iframe.setAttribute("height", 750);
xgab_iframe.setAttribute("width", "100%");
xgab_iframe.setAttribute("src", `https://webadmin.aut.ac.nz/admin/db/xgab/xgab.cgi?q=${xgab_id};qq=${xgab_id}`);

function swazd_iframe_toggle()
{
  if( document.getElementById("swazd_iframe") != null )
  {
    document.getElementById("swazd_iframe").toggle();
  }
  else
  {
    short_desc_div.insertAdjacentElement("beforebegin", swazd_iframe);
  }
}

function xgab_iframe_toggle()
{
  if( document.getElementById("xgab_iframe") != null )
  {
    document.getElementById("xgab_iframe").toggle();
  }
  else
  {
    short_desc_div.insertAdjacentElement("beforebegin", xgab_iframe);
  }
}

if( type == "sc_task" )
{
  var affected_ci_elem = document.getElementById("element.sc_task.request_item.request.requested_for");
  var swazd_button = affected_ci_elem.childNodes[2].childNodes[0].childNodes[0].cloneNode(true);
}
else if( type == "incident" )
{
  var affected_ci_elem = document.getElementById("element.incident.caller_id");
  var swazd_button = affected_ci_elem.childNodes[2].childNodes[0].cloneNode(true);
}

swazd_button.setAttribute("id", "view_swazd");
swazd_button.setAttribute("name", "View swazd");
swazd_button.setAttribute("value", "View swazd");
swazd_button.setAttribute("data-original-title", "View swazd");
swazd_button.setAttribute("aria-label", "swazd");
swazd_button.setAttribute("class", "btn btn-default btn-ref icon icon-menu");
swazd_button.setAttribute("title", "SWAZD");
swazd_button.setAttribute("data-table", type);
swazd_button.setAttribute("data-ref", type + ".swazd");
swazd_button.setAttribute("innerHTML", "SWAZD");
swazd_button.removeAttribute("data-form");
swazd_button.removeAttribute("data-type");
swazd_button.removeAttribute("aria-haspopup");
swazd_button.onclick = swazd_iframe_toggle;
affected_ci_elem.childNodes[2].insertAdjacentElement("beforeend", swazd_button);

var xgab_button = swazd_button.cloneNode(true);
xgab_button.setAttribute("id", "view_xgab");
xgab_button.setAttribute("name", "View xgab");
xgab_button.setAttribute("value", "View xgab");
xgab_button.setAttribute("data-original-title", "View xgab");
xgab_button.setAttribute("aria-label", "xgab");
xgab_button.setAttribute("class", "btn btn-default btn-ref icon icon-menu");
xgab_button.setAttribute("title", "XGAB");
xgab_button.setAttribute("data-table", type);
xgab_button.setAttribute("data-ref", type + ".xgab");
xgab_button.setAttribute("innerHTML", "XGAB");
xgab_button.removeAttribute("data-form");
xgab_button.removeAttribute("data-type");
xgab_button.removeAttribute("aria-haspopup");
xgab_button.onclick = xgab_iframe_toggle;
affected_ci_elem.childNodes[2].insertAdjacentElement("beforeend", xgab_button);

/*
 * END SWAZD & XGAB
 */

/*
 * REQUEST ITEM
 */
/*

if(type === 'sc_task' && document.getElementById("sys_display.sc_task.request_item").value != "") {
  
  var ritmNumber = document.getElementById("sys_display.sc_task.request_item").value;
  
  var ritm_iframe = document.createElement("iframe");
  ritm_iframe.setAttribute("title", "Request Item Iframe");
  ritm_iframe.setAttribute("id", "ritm_iframe");
  ritm_iframe.setAttribute("height", 750);
  ritm_iframe.setAttribute("width", "100%");
  ritm_iframe.setAttribute("src", `https://aut.service-now.com/sc_req_item.do?sysparm_query=number=${ritmNumber}`)
  
  function ritm_iframe_toggle()
  {
    if( document.getElementById("ritm_iframe") != null)
    {
      document.getElementById("ritm_iframe").toggle();
    }
    else
    {
      short_desc_div.insertAdjacentElement("beforebegin", ritm_iframe);
    }
  }
  
  var affected_ci_elem = document.getElementById("element." + type + ".request_item");
  
  var ritm_button = affected_ci_elem.childNodes[2].childNodes[0].childNodes[0].cloneNode(true);
  
  ritm_button.setAttribute("id", "view_ritm");
  ritm_button.setAttribute("name", "View Request Item");
  ritm_button.setAttribute("value", "View Request Item");
  ritm_button.setAttribute("data-original-title", "View Request Item");
  ritm_button.setAttribute("aria-label", "RITM");
  ritm_button.setAttribute("class", "btn btn-default btn-ref icon icon-menu");
  ritm_button.setAttribute("title", "View Request Item");
  ritm_button.setAttribute("data-table", type);
  ritm_button.setAttribute("data-ref", type + ".ritm");
  ritm_button.setAttribute("innerHTML", "RITM");
  ritm_button.removeAttribute("data-form");
  ritm_button.removeAttribute("data-type");
  ritm_button.removeAttribute("aria-haspopup");
  ritm_button.onclick = ritm_iframe_toggle;
  
  var request_item_elem = document.getElementById("element.sc_task.request_item");
  request_item_elem.childNodes[2].insertAdjacentElement("beforeend", ritm_button)
}
*/
/*
 * END REQUEST ITEM 
 */