// ==UserScript==
// @name Customer Comms Templates Beta
// @description Customer Comms Templates with dropdown - Not in beta, can't change cause URL
// @namespace Violentmonkey Scripts
// @match https://aut.service-now.com/incident.do*
// @match https://aut.service-now.com/sc_task.do*
// @grant none
// @version 1.0.0
// @downloadURL https://update.greasyfork.org/scripts/388089/Customer%20Comms%20Templates%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/388089/Customer%20Comms%20Templates%20Beta.meta.js
// ==/UserScript==
// 
var type = document.getElementById("sys_target").value; //will be either 'incident' or 'sc_task'?

var template_to_use = "General Template";

//Gotta do it this way cause otherwise it'll crash here and not run the rest
if (String(document.getElementById(`${type}.short_description`)).includes("IT Account Setup/Reactivation: "))
{
  var short_desc = document.getElementById("${type}.description").value;
  var short_desc_split = short_desc.split("\n");
  //because there could be text above this line
  index = short_desc_split.indexOf("Employee Details:")
  var name_first = short_desc_split[index+3].substring(15);
  template_to_use = "New Account Template";
}


//
// Add cust comms template button
//

var requestor_info = g_form.getReference('opened_by');
var requestor_name = requestor_info.first_name + " " + requestor_info.last_name;

if (document.getElementById(`sys_display.${type}.caller_id`))
{
  //var affected_contact = document.getElementById(`sys_display.${type}.caller_id`).value;
  var affected_contact_info = g_form.getReference('caller_id');
}
else
{
  //var affected_contact = document.getElementById(`sys_display.sc_task.request_item.request.requested_for`).value;
  var affected_contact_info = g_form.getReference('request_item.request.requested_for');
}

// set their_name to the affected contact, though this could be changed to 'all' if there are multiple people in the watch list?
var their_name = affected_contact_info.first_name;

var general_template = `Hi ${their_name}, 

Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

var file_access_template = `Hi ${their_name}, 
Which network drive are you trying to access?
You'll only be able to access them through the drive letters in My PC when you're on campus, however if you browse to [code]<a href="https://fileaccess.aut.ac.nz" target="_blank">File Access</a>[/code] and log in 
using "AUTUNI\\username" (without the quotes) you'll be able to access your drives from anywhere.
Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

var adobe_upgrade_template = `Hi ${their_name}, 
If your Adobe is claiming that it will expire on the 29th please follow these steps:

Make sure you have quit all Office programs (Word, Outlook, Excel, Powerpoint, ...)

For Windows PCs
- Open up the program called "Software Centre"
- Search for Adobe 
- Click on the result named "Adobe Creative Cloud 2020 FULL - Named User License"
- This will uninstall your expiring Adobe suite and install the updated version which has the continued AUT license.

For Macs
- Open up the program "AUT Self Service"
- Login to your account and then search for Adobe
  - If it's for a shared machine, install "Adobe CC 2020 - shared/lab Macs only"
  - Otherwise install "Adobe CC 2020 - Staff"
Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

var remote_access_template = `Hi ${their_name}, 
In order to be able to grant you access to remote systems, we need your manager's permission. To that end I've looped them in on this ticket. 
Once we have that we can move forward. 
Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

var outlook_password_template = `Hi ${their_name}, 
It sounds like an issue that occasionally happens after a password reset, please try these steps and let me know if it fixes it:
1) Close all office programs
2) Open Word
3) Open a blank document > File > Account > Sign Out
4) Sign In
5) Enter your log in details
6) Open Outlook and test if it's working
If you run into any issues I'll be happy to remote in and have a look for you.
Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

var appointment_request_template = `Hi ${their_name}, 
When would be a good time for me to come by and have a look at this for you? 
Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

var remote_request_template = `Hi ${their_name}, 
When would be a good time for me to remote in and have a look at this for you? 
Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

if (document.getElementById(`${type}.short_description`).value.substring(0,31) == "IT Account Setup/Reactivation: ")
{
  var user_new_account_is_for = document.getElementById(`${type}.short_description`).value.split(": ")[1];
}
else
{
  //not great but fits grammatically and might save on crashes
  var user_new_account_is_for = "you";
}

var new_account_template = `Hi All, 
I've created the account for ${user_new_account_is_for} with the following details and will send the welcome email with the details to all of you. 
The password will expire in two weeks, so please make sure they register their account and change their password on the [code]<a href="https://networkservices.aut.ac.nz">Network Services</a>[/code] page. 

PASTE_HERE_double_click_to_select
Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

//pretty up the type for the template
var job_type = "request";
var action_type = "completed"
if (type == "incident")
{
  job_type = type;
  action_type = "resolved"
}

var closing_comms_template = `Hi ${their_name}, 
Thanks for contacting the service desk, your ${job_type} has now been ${action_type}.
Solution: 

If you have any further issues or queries, please don't hesitate to contact us at x9888, or submit a job via [code]<a href="https://ithelp.aut.ac.nz">IT Help</a>[/code].
Thanks, 
${g_user.firstName}`

var follow_up_template = `Hi ${their_name}, 
I'm just following up on this job, are you still experiencing this issue since the fix I applied?
Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

var awaiting_response_template = `Hi ${their_name}, 
Sounds good, I'll wait to hear back from you about this. 
Please don't hesitate to let me know if you have any issues or questions. 
Thanks, 
${g_user.firstName}`

//https://stackoverflow.com/questions/24181244/create-a-drop-down-list-with-options-through-document-createelement
var dropdown_element = document.createElement("select");
// Use the Option constructor: args text (what the user will see), value (name of the template's var), defaultSelected, selected
var option = new Option('-- Template To Use --', '', true, false);
dropdown_element.appendChild(option);
var option = new Option('General', 'general_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('File Access', 'file_access_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('Adobe Upgrade', 'adobe_upgrade_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('Remote Access', 'remote_access_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('Outlook Password', 'outlook_password_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('Appointment Request', 'appointment_request_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('Remote In Request', 'remote_request_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('Close Ticket', 'closing_comms_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('New Account', 'new_account_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('Follow Up', 'follow_up_template', false, false);
dropdown_element.appendChild(option);
var option = new Option('Awaiting Response', 'awaiting_response_template', false, false);
dropdown_element.appendChild(option);

dropdown_element.addEventListener("change", fill_template_from_template);

function fill_template_from_template(template_option) 
{
  if (`${template_option.target.value}` != "")
  {
    g_form.setValue('comments', eval(`${template_option.target.value}`));
  }
  else
  {
    g_form.setValue('comments', '');
  }
};

document.getElementsByClassName("icon-stream-one-input btn-default btn")[0].insertAdjacentElement("afterend", dropdown_element);