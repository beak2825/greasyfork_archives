// ==UserScript==
// @name Ethical Assistant
// @version 1.0.0
// @description Autofill Ethical Fields
// @namespace Violentmonkey Scripts
// @match https://ethical.aut.ac.nz/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/391983/Ethical%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/391983/Ethical%20Assistant.meta.js
// ==/UserScript==

//second page
//ID: DISPLAY
//ID: DISPLAYASCII
//ID: LABEL

function fill_first_page()
{  
  title_bar.insertAdjacentElement("afterend",i_mac);
  title_bar.insertAdjacentElement("afterend",i_room);
  title_bar.insertAdjacentElement("afterend",i_ext);
  title_bar.insertAdjacentElement("afterend",i_name);
  
  input_name = document.getElementById("i_name").value;
  input_ext = document.getElementById("i_ext").value;
  input_room = document.getElementById("i_room").value;
  input_mac_address = document.getElementById("i_mac").value;
  
  var mac_address = input_mac_address.replace(/:/g, "").toUpperCase();
  var input_room = input_room.toUpperCase();
  document.getElementById("NAME").value = mac_address;
  desc_field = "("+input_room+") "+input_name;
  document.getElementById("DESCRIPTION").value = desc_field;
  
  //Device Pool
  document.getElementById("FKDEVICEPOOL")[1].selected = true;
  
  //Phone Button Template
  //Select first option
  document.getElementById("FKPHONETEMPLATE")[1].selected = true;

  //Calling Search Space
  var call_type_dropdown = document.getElementById("call_types");
  var call_types = call_type_dropdown.options[call_type_dropdown.selectedIndex].value;
  if(call_types == "national")
  {
    document.getElementById("FKCALLINGSEARCHSPACE")[1].selected = true;
  }
  else if(call_types == "international")
  {
    document.getElementById("FKCALLINGSEARCHSPACE")[5].selected = true;
  }
  
  //Owner to Anonymous
  document.getElementById("phoneForm_userphoner0").checked = true;
  //document.getElementById("phoneForm_userphoner0").focus()
  //document.getElementById("phoneForm_userphoner0").blur()
  
  //Device Security Profile
  if(document.getElementById("FKSECURITYPROFILE"))
  {
    document.getElementById("FKSECURITYPROFILE")[1].selected = true;   
  }
  
  //SIP Profile
  if(document.getElementById("FKSIPPROFILE"))
  {
    document.getElementById("FKSIPPROFILE")[2].selected = true;
  }
  
  //SSH Info - doesn't seem to do anything (due to it being a Chrome autofill feature, that also may only load after the script does?) so we'll comment it out to prevent possible mishaps in the future
  //document.getElementById("SSHUSERID").value = "";
  //document.getElementById("SSHPASSWORD").value = "";

  //Voicemail settings (for the next page)
  var voicemail_dropdown = document.getElementById("voicemail_req");
  var voicemail_setting = voicemail_dropdown.options[voicemail_dropdown.selectedIndex].value;
  
  GM_deleteValue("phone_details")
  GM_setValue("phone_details", {name:input_name, ext:input_ext, room:input_room, mac:input_mac_address, call_types:call_types, voicemail:voicemail_setting})
  
  alert("THIS WILL NOW BE FILLED IN, PLEASE MAKE SURE TO DOUBLE CHECK IT AND THEN CLICK SAVE");
}

function fill_second_page()
{
  var details = GM_getValue("phone_details");
  
  //Directory Number
  document.getElementById("DNORPATTERN").value = details["ext"];
  
  //Route Partition
  document.getElementById("FKROUTEPARTITION")[1].selected = true;

  //Description, Alerting Name, ASCII Alerting Name
  var name_ext = details["name"] + " " + details["ext"];
  document.getElementById("DESCRIPTION").value = name_ext;
  document.getElementById("ALERTINGNAME").value = name_ext;
  document.getElementById("ALERTINGNAMEASCII").value = name_ext;
  
  //Voice Mail Profile
  if(details["voicemail"] == "voicemail")
  {
    document.getElementById("FKVOICEMESSAGINGPROFILE")[6].selected = true;
  }
  else
  {
    document.getElementById("FKVOICEMESSAGINGPROFILE")[4].selected = true;
  }
              
  //Check all the boxes
  document.getElementById("CFBINTVOICEMAILENABLED").checked = true;
  document.getElementById("CFBVOICEMAILENABLED").checked = true;
  document.getElementById("CFNAINTVOICEMAILENABLED").checked = true;
  document.getElementById("CFNAVOICEMAILENABLED").checked = true;
  document.getElementById("PFFINTVOICEMAILENABLED").checked = true;
  document.getElementById("PFFVOICEMAILENABLED").checked = true;
  document.getElementById("CFDFVOICEMAILENABLED").checked = true;
  document.getElementById("CFURINTVOICEMAILENABLED").checked = true;
  document.getElementById("CFURVOICEMAILENABLED").checked = true;
  
  //Set all the dropdowns to A1_Standard
  document.getElementById("FKCALLINGSEARCHSPACE_CFA")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_SCFA")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_CFBINT")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_CFB")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_CFNAINT")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_CFNA")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_PFFINT")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_PFF")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_DEVICEFAILURE")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_CFURINT")[1].selected = true;
  document.getElementById("FKCALLINGSEARCHSPACE_CFUR")[1].selected = true;
  
  document.getElementById("FKCALLINGSEARCHSPACE_SHAREDLINEAPPEAR")[1].selected = true;
  
  document.getElementById("DISPLAY").value = name_ext;
  document.getElementById("DISPLAYASCII").value = name_ext;
  document.getElementById("LABEL").value = name_ext;
}


var title_bar = document.getElementsByClassName("titlebar")[0];

var assistant_button = document.createElement("button");
assistant_button.innerHTML = "AUTOFILL";
if(document.location.href.includes("https://ethical.aut.ac.nz/ccmadmin/phoneEdit.do") && document.body.innerText.includes("Phone Configuration"))
{
  //get all the data we'll need, i_ being input
  var i_name = document.createElement("input");
  i_name.setAttribute("id", "i_name");
  i_name.setAttribute("placeholder", "FULL NAME");
  i_name.setAttribute("type", "text");
  
  var i_ext = document.createElement("input");
  i_ext.setAttribute("id", "i_ext");
  i_ext.setAttribute("placeholder", "EXT");
  i_ext.setAttribute("type", "text");
  
  var i_room = document.createElement("input");
  i_room.setAttribute("id", "i_room");
  i_room.setAttribute("placeholder", "ROOM");
  i_room.setAttribute("type", "text");
  
  var i_mac = document.createElement("input");
  i_mac.setAttribute("id", "i_mac");
  i_mac.setAttribute("placeholder", "MAC (with or without colons)");
  i_mac.setAttribute("type", "text");
  
  var call_types = document.createElement("select");
  call_types.setAttribute("id", "call_types");
  var option = new Option("National Calls", "national", false, false);
  call_types.appendChild(option);
  var option = new Option("International Calls", "international", false, false);
  call_types.appendChild(option);
  
  var voicemail_req = document.createElement("select");
  voicemail_req.setAttribute("id", "voicemail_req");
  var option = new Option("Voicemail", "voicemail", false, false);
  voicemail_req.appendChild(option);
  var option = new Option("No Voicemail", "no voicemail", false, false);
  voicemail_req.appendChild(option);
  
  assistant_button.onclick = fill_first_page;
  
  title_bar.insertAdjacentElement("afterend",assistant_button);
  title_bar.insertAdjacentElement("afterend",voicemail_req);
  title_bar.insertAdjacentElement("afterend",call_types);
  title_bar.insertAdjacentElement("afterend",i_mac);
  title_bar.insertAdjacentElement("afterend",i_room);
  title_bar.insertAdjacentElement("afterend",i_ext);
  title_bar.insertAdjacentElement("afterend",i_name);
}
else if (document.location.href.includes("https://ethical.aut.ac.nz/ccmadmin/directoryNumberEdit.do"))
{
  assistant_button.onclick = fill_second_page;
  title_bar.insertAdjacentElement("afterend",assistant_button);
}

