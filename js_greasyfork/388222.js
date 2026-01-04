// ==UserScript==
// @name Assign To Me
// @description Add assign to me button [BETA]
// @namespace Violentmonkey Scripts
// @match https://aut.service-now.com/*
// @grant none
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/388222/Assign%20To%20Me.user.js
// @updateURL https://update.greasyfork.org/scripts/388222/Assign%20To%20Me.meta.js
// ==/UserScript==
// 
var type = document.getElementById("sys_target").value; //will be either 'incident' or 'u_request'

var full_name_regex = /data-user="(.*?)"/;
var full_name = full_name_regex.exec(document.body.innerHTML)[1];

//
//https://www.w3schools.com/jsref/met_node_appendchild.asp
//
var assign_to_me_button = document.createElement("button");
assign_to_me_button.style = "white-space: nowrap; float: right";
assign_to_me_button.innerHTML = "Assign To Me";
assign_to_me_button.id = "create_assign_button";
assign_to_me_button.onClick = "create_assign_button();";
//assign_to_me_button.class = "";

//The only location/combo shit that _actually works_
document.getElementById(`status.${type}.group_list`).insertAdjacentElement("afterend", assign_to_me_button);

button = document.getElementById("create_assign_button");
button.addEventListener("click", create_assign_button, false);

function create_assign_button()
{
  document.getElementById(`sys_display.${type}.assigned_to`).value = full_name;
  //document.getElementById(`ni.${type}.u_effortdur_min`).value = "02";
  //onChange('incident.state')
  /* //Ideally we'd use this to check if the status is "new" and if yes then change to in progress buuuut we can't check that
  if (document.getElementById(`${type}.incident.state`).value == "something")
  {
    document.getElementById(`${type}.u_next_step`).value = "10";
  }*/
};
