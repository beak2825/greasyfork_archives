// ==UserScript==
// @license     MIT
// @include     https://*.ogame.gameforge.com/*
// @description Custom commands to help with OGAME
// @name        Vidkov OGAME Toolbox
// @version     5
// @grant       GM.setValue
// @grant       GM.getValue
// @namespace https://greasyfork.org/users/1204615
// @downloadURL https://update.greasyfork.org/scripts/478345/Vidkov%20OGAME%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/478345/Vidkov%20OGAME%20Toolbox.meta.js
// ==/UserScript==

// Copies OGK data from local storage to the clipboard with a excel friendly formatting
function read_OGK_to_clipboard() {
  let ogk = JSON.parse(localStorage.getItem("ogk-data"));
	let csv = ogk.empire.reduce((acc, planet) => {
		acc += planet.name + "\tStorage\t-1\t-" + Math.ceil(planet.metal/1000) + "\t-" + Math.ceil(planet.crystal/1000) + "\t-" + Math.ceil(planet.deuterium/1000) + "\tGATHERING_RES\r\n";
		return acc;
	}, "");  
  navigator.clipboard.writeText(csv);
};

// Creates the visitation list GM variable and starts processing the list
async function start_raise_activity() {
  let anchor_node_list = document.querySelectorAll("a:is(.planetlink, .moonlink)");
  let link_arr = [];
  for (const anchor of anchor_node_list.entries()) {
    link_arr.push(anchor[1].href);
	}
  await GM.setValue("visitation_list", link_arr);
  await process_visitation_list();
}

// Navigates the window to the next link in the visitation list
async function process_visitation_list() {
  let link_arr = await GM.getValue("visitation_list");
  if (Array.isArray(link_arr) && link_arr.length > 0) {
    let visit = link_arr.pop();
    await GM.setValue("visitation_list", link_arr);
    console.log("CHANGING WINDOW LOCATION TO", visit);
    window.location.href = visit;
  }
}

// This creates a command aas button in the side bar
// after all the default items
function create_command(name, callback_fn) {
 	let ul = document.getElementById("menuTable"); 
  
  let li = document.createElement("li"); 
  ul.appendChild(li); 
  
  let span = document.createElement("span");  
  span.classList.add("menu_icon");
  li.appendChild(span); 
  
  let anchor = document.createElement("a");
  anchor.classList.add("menubutton", "ipHintable");
  anchor.href = "#";
  anchor.onclick = callback_fn;
  li.appendChild(anchor);
  
  let text_label = document.createElement("span");
  text_label.classList.add("textLabel");
  text_label.innerText = name;
  anchor.appendChild(text_label);
}

(async () => {
  await process_visitation_list();

  create_command("Copy OGK", read_OGK_to_clipboard);
  create_command("Raise Activity", start_raise_activity);
})();