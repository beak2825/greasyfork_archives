// ==UserScript==
// @name IPD Host Type Search Fix
// @version 1.0.0
// @description Swap input field to dropdown when searching by host type
// @namespace Violentmonkey Scripts
// @match https://webadmin.aut.ac.nz/admin/db/ipd/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/411403/IPD%20Host%20Type%20Search%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/411403/IPD%20Host%20Type%20Search%20Fix.meta.js
// ==/UserScript==

q1_type = "textbox";
q2_type = "textbox";
q3_type = "textbox";

all_host_types = {"M":"Monitor(M)", "NF":"Phone CISCO IP(NF)", "VF":"AV-Flat Screen(VF)", "VM":"AV-Media Player(VM)", "VN":"AV-Network Controlle(VN)", "VP":"AV-Data Projector(VP)", "W":"Workstation(W)", "WI":"Workstation MACLAP(WI)", "WK":"Workstation Kiosk(WK)", "WM":"Workstation MAC(WM)", "WP":"Workstation LAPTOP(WP)", "WT":"Workstation TABLET(WT)", "?":"Unknown(?)", "B":"Hosted Service(B)", "C":"Cluster(C)", "D":"Dialin(D)", "FA":"Phone Analog(FA)", "FM":"Phone Mobile(FM)", "FX":"Phone Generic(FX)", "JD":"Database(JD)", "LC":"Security Controller(LC)", "LS":"Security Server(LS)", "LV":"Security Video Camer(LV)", "N":"Network(N)", "NA":"Network Cisco ATA(NA)", "NG":"Network GADGET(NG)", "NH":"Network HUB(NH)", "NM":"Network MEDIA(NM)", "NR":"Network ROUTER(NR)", "NS":"Network SWITCH(NS)", "NV":"Network Voice(NV)", "NW":"Network WIRELESS AP(NW)", "NX":"Network Fire Panel(NX)", "P":"Printer(P)", "PC":"Printer COPIER(PC)", "PF":"Printer FAX(PF)", "PJ":"Printer JETDIRECT(PJ)", "PS":"Printer SCANNER(PS)", "PT":"Printer TERMINAL(PT)", "Q":"Peripheral(Q)", "S":"Server Other(S)", "SA":"Server MACINTOSH(SA)", "SL":"Server LINUX(SL)", "SM":"Server MICROSOFT(SM)", "SN":"Server NOVELL(SN)", "SS":"Server Storage(SS)", "SU":"Server UNIX(SU)", "U":"UPS(U)", "VD":"AV-Document Camera(VD)", "WF":"Workstation FXLAPTOP(WF)", "WL":"Workstation LINUX(WL)", "WS":"Workstation SGI(WS)", "X":"In Storage(X)", "Z":"Reserved(Z)", "ZO":"Zombie Record(ZO)"}

document.getElementsByName("q1")[0].addEventListener("change", function() 
{
  if( this.value == "ht" && q1_type == "textbox")
  {
    // changed to host type
    q1_type = "dropdown";

    curr_textbox = document.getElementsByName("v1")[0];

    ht_dropdown = document.createElement("select");
    ht_dropdown.name = "v1";

    for (const [key, value] of Object.entries(all_host_types)) 
    {
      var op = new Option();
      op.value = key;
      op.text = value;
      ht_dropdown.options.add(op); 
    }

    curr_textbox.parentNode.replaceChild(ht_dropdown, curr_textbox);
  }
  else if( this.value != "ht" && q1_type == "dropdown")
  {
    // changed from host type
    q1_type = "textbox";

    curr_dropdown = document.getElementsByName("v1")[0];

    new_textbox = document.createElement("input");
    new_textbox.name = "v1";
    curr_dropdown.parentNode.replaceChild(new_textbox, curr_dropdown);
  }
});
document.getElementsByName("q1")[0][0].selected = true

// repeat cause it doesn't like iterating over that
document.getElementsByName("q2")[0].addEventListener("change", function() 
{
  if( this.value == "ht" && q2_type == "textbox")
  {
    // changed to host type
    q2_type = "dropdown";

    curr_textbox = document.getElementsByName("v2")[0];

    ht_dropdown = document.createElement("select");
    ht_dropdown.name = "v2";

    for (const [key, value] of Object.entries(all_host_types)) 
    {
      var op = new Option();
      op.value = key;
      op.text = value;
      ht_dropdown.options.add(op); 
    }

    curr_textbox.parentNode.replaceChild(ht_dropdown, curr_textbox);
  }
  else if( this.value != "ht" && q2_type == "dropdown")
  {
    // changed from host type
    q2_type = "textbox";

    curr_dropdown = document.getElementsByName("v2")[0];

    new_textbox = document.createElement("input");
    new_textbox.name = "v2";
    curr_dropdown.parentNode.replaceChild(new_textbox, curr_dropdown);
  }
});
document.getElementsByName("q2")[0][0].selected = true

// and once more
document.getElementsByName("q3")[0].addEventListener("change", function() 
{
  if( this.value == "ht" && q3_type == "textbox")
  {
    // changed to host type
    q1_type = "dropdown";

    curr_textbox = document.getElementsByName("v3")[0];

    ht_dropdown = document.createElement("select");
    ht_dropdown.name = "v3";

    for (const [key, value] of Object.entries(all_host_types)) 
    {
      var op = new Option();
      op.value = key;
      op.text = value;
      ht_dropdown.options.add(op); 
    }

    curr_textbox.parentNode.replaceChild(ht_dropdown, curr_textbox);
  }
  else if( this.value != "ht" && q3_type == "dropdown")
  {
    // changed from host type
    q3_type = "textbox";

    curr_dropdown = document.getElementsByName("v3")[0];

    new_textbox = document.createElement("input");
    new_textbox.name = "v3";
    curr_dropdown.parentNode.replaceChild(new_textbox, curr_dropdown);
  }
});
document.getElementsByName("q3")[0][0].selected = true