// ==UserScript==
// @name            What.CD Inbox: Select System Messages
// @description     Adds a button to your inbox view to select all messages from "System"
// @version         1.0.21
// @author          phracker <phracker@bk.ru>
// @namespace       https://github.com/phracker
// @grant           none
//
// @include         http*://*what.cd/inbox.php*
// @downloadURL https://update.greasyfork.org/scripts/4971/WhatCD%20Inbox%3A%20Select%20System%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/4971/WhatCD%20Inbox%3A%20Select%20System%20Messages.meta.js
// ==/UserScript==

function toggle_sysmsg() {
  var messages = document.getElementsByClassName('message_table').item(0).getElementsByTagName('tr');
  // iterate through each table on the page
  for (var i = messages.length - 1; i >= 0; i--) {
    var message = messages.item(i);
    if (message.class != 'colhead') {
      var sender = message.getElementsByTagName('td').item(2);
      var checkbox = message.getElementsByTagName('input').item(0);
      if(sender.textContent == 'System') {
        if(checkbox.checked == false) { checkbox.checked = true; }
        else { checkbox.checked = false; }
      }
    }
  }
  // Swap hide/show text
  try {
    var toggle_link_text = document.getElementById('toggle_sysmsg').value;
    var toggled_text = '';
    if (toggle_link_text == 'Unselect System Messages') {
      toggled_text = 'Select System Messages';
    } else {
      toggled_text = 'Unselect System Messages';
    };
    document.getElementById('toggle_sysmsg').value = toggled_text;
  } catch (e) {};
};

// add script to the page
var sysmsg_script = document.createElement('script');
sysmsg_script.appendChild(document.createTextNode( toggle_sysmsg ));
(document.body || document.head || document.documentElement).appendChild(sysmsg_script);

// create button
var toggle_sysmsg_button = document.createElement('input');
toggle_sysmsg_button.type = "button";
toggle_sysmsg_button.value = "Select System Messages";
toggle_sysmsg_button.onclick = toggle_sysmsg;
toggle_sysmsg_button.id = 'toggle_sysmsg';
var space = document.createElement('span');
var space2 = document.createElement('span');
space.textContent = " \n      ";
space2.textContent = " \n      ";
space.appendChild(space2);
// add button to page
document.getElementsByClassName('manage_form').item(0).insertBefore(toggle_sysmsg_button,document.getElementsByClassName('manage_form').item(0).getElementsByTagName('input').item(3));
document.getElementsByClassName('manage_form').item(0).insertBefore(space,document.getElementsByClassName('manage_form').item(0).getElementsByTagName('input').item(4));