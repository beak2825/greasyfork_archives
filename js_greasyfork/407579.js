// ==UserScript==
// @name Checklist De-spaminator
// @namespace Violentmonkey Scripts
// @description Removes the spam notes created by checklists in SNow tickets
// @match https://aut.service-now.com/u_request.do*
// @match https://aut.service-now.com/incident.do*
// @match https://aut.service-now.com/nav_to.do*
// @match https://aut.service-now.com/*
// @match https://autkingston.service-now.com/*
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/407579/Checklist%20De-spaminator.user.js
// @updateURL https://update.greasyfork.org/scripts/407579/Checklist%20De-spaminator.meta.js
// ==/UserScript==

var type = document.getElementById("sys_target").value; //will be either 'incident' or 'u_request'

let checklist_item_msgs = ['Checklist item checked off:', 'Checklist item updated:', 'Checklist item added:', 'Checklist item deleted:', 'Checklist item unchecked:']

//
// Search through the notes and remove any that contain checklist item messages
//https://stackoverflow.com/questions/1324676/what-is-a-word-boundary-in-regexes
//
if (type == "incident")
{
  //For INCs
  var inc_card_search = "h-card h-card_md h-card_comments";
  var inc_cards = document.getElementsByClassName(inc_card_search);
  var inc_search = "sn-widget-textblock-body sn-widget-textblock-body_formatted";
  var inc_text = document.getElementsByClassName(inc_search);
  var indexINC;
  
  // console.log(inc_cards.length);
  for(indexINC = inc_cards.length - 1; indexINC >= 0 ; indexINC--)
  {
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(\d\d-(PURC|\d{4})-\d{4})/ig, "<a href=\"https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi?v1=$1&q1=all&Rows=50&Set=0\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(([0-9A-F]{2}[:-]){5}([0-9A-F]){2})/ig, "<a href=\"https://netmon.aut.ac.nz/admin/monitor/FindMacAddress.pl?macaddress=$1\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(REQ\d{6,7})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=u_request.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(SCTASK\d{8})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=sc_task.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(INC\d{8})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(KB\d{7})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=%2Fkb_knowledge_list.do%3Fsysparm_clear_stack%3Dtrue%26sysparm_userpref_module%3D2180b621ff0131009b20ffffffffffc5%26sysparm_list_mode%3Dgrid%26sysparm_query%3D%255EGOTO123TEXTQUERY321%253D$1%26sysparm_offset%3D\" target=\"_blank\">$1</a>");
    // console.log(document.getElementsByClassName(inc_card_search)[indexINC].innerHTML);
    if (checklist_item_msgs.some( v => document.getElementsByClassName(inc_card_search)[indexINC].innerHTML.includes(v))) {
      // console.log("=========== CHECKLIST MATCH =============");
      document.getElementsByClassName(inc_card_search)[indexINC].remove();
    }
  }
}
else
{
  //For REQs
  var req_card_search = "h-card h-card_md h-card_comments";
  var req_cards = document.getElementsByClassName(req_card_search);
  var req_search = "sn-form-inline-stream-entries sn-form-inline-stream-entries-only col-xs-10 col-md-9 col-lg-8 form-field";
  var req_text = document.getElementsByClassName(req_search);
  var indexREQ;
  
  // console.log(req_cards.length);
  for(indexREQ = req_cards.length - 1; indexREQ >= 0 ; indexREQ--)
  {
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(\d\d-(PURC|\d{4})-\d{4})/ig, "<a href=\"https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi?v1=$1&q1=all&Rows=50&Set=0\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(([0-9A-F]{2}[:-]){5}([0-9A-F]){2})/ig, "<a href=\"https://netmon.aut.ac.nz/admin/monitor/FindMacAddress.pl?macaddress=$1\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(REQ\d{6,7})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=u_request.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(SCTASK\d{8})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=sc_task.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(INC\d{8})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
    // document.getElementsByClassName(inc_search)[indexINC].innerHTML = document.getElementsByClassName(inc_search)[indexINC].innerHTML.replace(/(KB\d{7})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=%2Fkb_knowledge_list.do%3Fsysparm_clear_stack%3Dtrue%26sysparm_userpref_module%3D2180b621ff0131009b20ffffffffffc5%26sysparm_list_mode%3Dgrid%26sysparm_query%3D%255EGOTO123TEXTQUERY321%253D$1%26sysparm_offset%3D\" target=\"_blank\">$1</a>");
    // console.log(document.getElementsByClassName(inc_card_search)[indexINC].innerHTML);
    if (checklist_item_msgs.some( v => document.getElementsByClassName(req_card_search)[indexREQ].innerHTML.includes(v))) {
      // console.log("=========== CHECKLIST MATCH =============");
      document.getElementsByClassName(req_card_search)[indexREQ].remove();
    }
  }
  
  // for(indexREQ = 0; indexREQ < req_text.length; indexREQ++)
  // {
  //   document.getElementsByClassName(req_search)[indexREQ].innerHTML = document.getElementsByClassName(req_search)[indexREQ].innerHTML.replace(/(\d\d-(PURC|\d{4})-\d{4})/ig, "<a href=\"https://webadmin.aut.ac.nz/admin/db/ipd/ipd.cgi?v1=$1&q1=all&Rows=50&Set=0\" target=\"_blank\">$1</a>");
  //   document.getElementsByClassName(req_search)[indexREQ].innerHTML = document.getElementsByClassName(req_search)[indexREQ].innerHTML.replace(/(([0-9A-F]{2}[:-]){5}([0-9A-F]){2})/ig, "<a href=\"https://netmon.aut.ac.nz/admin/monitor/FindMacAddress.pl?macaddress=$1\" target=\"_blank\">$1</a>");
  //   document.getElementsByClassName(req_search)[indexREQ].innerHTML = document.getElementsByClassName(req_search)[indexREQ].innerHTML.replace(/(REQ\d{6,7})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=u_request.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
  //   document.getElementsByClassName(req_search)[indexREQ].innerHTML = document.getElementsByClassName(req_search)[indexREQ].innerHTML.replace(/(SCTASK\d{8})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=sc_task.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
  //   document.getElementsByClassName(req_search)[indexREQ].innerHTML = document.getElementsByClassName(req_search)[indexREQ].innerHTML.replace(/(INC\d{8})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number=$1&sysparm_view=\" target=\"_blank\">$1</a>");
  //   document.getElementsByClassName(req_search)[indexREQ].innerHTML = document.getElementsByClassName(req_search)[indexREQ].innerHTML.replace(/(KB\d{7})/ig, "<a href=\"https://aut.service-now.com/nav_to.do?uri=%2Fkb_knowledge_list.do%3Fsysparm_clear_stack%3Dtrue%26sysparm_userpref_module%3D2180b621ff0131009b20ffffffffffc5%26sysparm_list_mode%3Dgrid%26sysparm_query%3D%255EGOTO123TEXTQUERY321%253D$1%26sysparm_offset%3D\" target=\"_blank\">$1</a>");
  // }
}