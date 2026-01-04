// ==UserScript==
// @name          DD-WRT PIA VPN Server List
// @namespace     https://www.greasyfork.org/en/scripts/372887-dd-wrt-pia-vpn-server-list
// @author        ScottAllyn
//
// @description	  Replaces DD-WRT's Services->VPN->Server IP/Name textbox with a drop-down list of current PIA servers
//
// @include       http://192.168.1.1/*
// @include       https://192.168.1.1/*
//
// @version		  0.8.1
// @downloadURL https://update.greasyfork.org/scripts/372887/DD-WRT%20PIA%20VPN%20Server%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/372887/DD-WRT%20PIA%20VPN%20Server%20List.meta.js
// ==/UserScript==

// List up to date as of 05-Oct-2018

// Edit the two @include lines above to match the address of your DD-WRT installation.

(function() {
   'use strict';

   var serverTextBox = document.getElementsByName("openvpncl_remoteip")[0];

   var serverDropDown = document.createElement('select');
   serverDropDown.setAttribute("name", "openvpncl_remoteip");
   serverDropDown.innerHTML =
      '<option value="">Select A Server...</option>\n' +
      '<option value="aus-melbourne.privateinternetaccess.com">Australia (Melbourne)</option>\n' +
      '<option value="aus-sydney.privateinternetaccess.com">Australia (Sydney)</option>\n' +
      '<option value="austria.privateinternetaccess.com">Austria</option>\n' +
      '<option value="belgium.privateinternetaccess.com">Belgium</option>\n' +
      '<option value="brazil.privateinternetaccess.com">Brazil</option>\n' +
      '<option value="ca-montreal.privateinternetaccess.com">Canada (Montreal)</option>\n' +
      '<option value="ca-toronto.privateinternetaccess.com">Canada (Toronto)</option>\n' +
      '<option value="ca-vancouver.privateinternetaccess.com">Canada (Vancouver)</option>\n' +
      '<option value="czech.privateinternetaccess.com">Czech Republic</option>\n' +
      '<option value="denmark.privateinternetaccess.com">Denmark</option>\n' +
      '<option value="fi.privateinternetaccess.com">Finland</option>\n' +
      '<option value="france.privateinternetaccess.com">France</option>\n' +
      '<option value="germany.privateinternetaccess.com">Germany</option>\n' +
      '<option value="hk.privateinternetaccess.com">Hong Kong</option>\n' +
      '<option value="hungary.privateinternetaccess.com">Hungary</option>\n' +
      '<option value="in.privateinternetaccess.com">India</option>\n' +
      '<option value="ireland.privateinternetaccess.com">Ireland</option>\n' +
      '<option value="israel.privateinternetaccess.com">Israel</option>\n' +
      '<option value="italy.privateinternetaccess.com">Italy</option>\n' +
      '<option value="japan.privateinternetaccess.com">Japan</option>\n' +
      '<option value="mexico.privateinternetaccess.com">Mexico</option>\n' +
      '<option value="luxembourg.privateinternetaccess.com">Luxembourg</option>\n' +
      '<option value="nl.privateinternetaccess.com">Netherlands</option>\n' +
      '<option value="nz.privateinternetaccess.com">New Zealand</option>\n' +
      '<option value="no.privateinternetaccess.com">Norway</option>\n' +
      '<option value="poland.privateinternetaccess.com">Poland</option>\n' +
      '<option value="ro.privateinternetaccess.com">Romania</option>\n' +
      '<option value="sg.privateinternetaccess.com">Singapore</option>\n' +
      '<option value="za.privateinternetaccess.com">South Africa</option>\n' +
      '<option value="spain.privateinternetaccess.com">Spain</option>\n' +
      '<option value="sweden.privateinternetaccess.com">Sweden</option>\n' +
      '<option value="swiss.privateinternetaccess.com">Switzerland</option>\n' +
      '<option value="turkey.privateinternetaccess.com">Turkey</option>\n' +
      '<option value="uk-london.privateinternetaccess.com">UK (London)</option>\n' +
      '<option value="uk-manchester.privateinternetaccess.com">UK (Manchester)</option>\n' +
      '<option value="uk-southampton.privateinternetaccess.com">UK (South Hampton)</option>\n' +
      '<option value="ae.privateinternetaccess.com">United Arab Emirates</option>\n' +
      '<option value="us-atlanta.privateinternetaccess.com">US (Atlanta)</option>\n' +
      '<option value="us-california.privateinternetaccess.com">US (California)</option>\n' +
      '<option value="us-chicago.privateinternetaccess.com">US (Chicago)</option>\n' +
      '<option value="us-denver.privateinternetaccess.com">US (Denver)</option>\n' +
      '<option value="us-east.privateinternetaccess.com">US (East)</option>\n' +
      '<option value="us-florida.privateinternetaccess.com">US (Florida)</option>\n' +
      '<option value="us-houston.privateinternetaccess.com">US (Houston)</option>\n' +
      '<option value="us-lasvegas.privateinternetaccess.com">US (Las Vegas)</option>\n' +
      '<option value="us-midwest.privateinternetaccess.com">US (Midwest)</option>\n' +
      '<option value="us-newyorkcity.privateinternetaccess.com">US (New York)</option>\n' +
      '<option value="us-seattle.privateinternetaccess.com">US (Seattle)</option>\n' +
      '<option value="us-siliconvalley.privateinternetaccess.com">US (Silicon Valley)</option>\n' +
      '<option value="us-texas.privateinternetaccess.com">US (Texas)</option>\n' +
      '<option value="us-washingtondc.privateinternetaccess.com">US (Washington)</option>\n' +
      '<option value="us-west.privateinternetaccess.com">US (West)</option>\n';
   serverDropDown.value = serverTextBox.value;

   serverTextBox.parentNode.replaceChild(serverDropDown, serverTextBox);
})();