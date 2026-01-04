// ==UserScript==
// @name Fix Provide Support Tickets
// @version 1.0.0
// @description Fix Provide support for student system general request
// @namespace Violentmonkey Scripts
// @match https://aut.service-now.com/sc_task.do*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/396371/Fix%20Provide%20Support%20Tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/396371/Fix%20Provide%20Support%20Tickets.meta.js
// ==/UserScript==

//
// Add Create Appointment button
// 
//https://www.w3schools.com/jsref/met_node_appendchild.asp
var fix_button = document.createElement("button");
fix_button.style = "white-space: nowrap";
fix_button.innerHTML = "Fix Ticket";
fix_button.id = "fix_ticket";
fix_button.onClick = "fix_ticket()";
//inject our button to the left of the save button, cheers Owen
//document.getElementById("sysverb_update_and_stay").insertAdjacentElement("beforebegin", fix_button);
document.getElementById("save_incident").insertAdjacentElement("beforebegin", fix_button);

button = document.getElementById("fix_ticket");
button.addEventListener("click", fix_ticket, false);

function fix_ticket()
{
    document.getElementsByClassName("tabs2_tab default-focus-outline")[0].click()
    document.getElementById("sc_task.short_description").value = document.getElementsByClassName("cat_item_option sc-content-pad form-control disabled readonly")[0].value;
    document.getElementById("sc_task.description").value = document.getElementsByClassName("question_textarea_input cat_item_option form-control disabled readonly")[0].value;
}