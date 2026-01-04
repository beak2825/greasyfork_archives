// ==UserScript==
// @name        Edit with PageLayer
// @namespace   StephenP
// @match       https://example.com/*
// @grant       none
// @version     1.0
// @namespace   StephenP
// @description Adds an Edit with Pagelayer button on the top bar of a Wordpress site while editing it, so you don't have to go through the default editor to get to PageLayer.
// @license   CC-BY-NC-SA-4.0
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/497059/Edit%20with%20PageLayer.user.js
// @updateURL https://update.greasyfork.org/scripts/497059/Edit%20with%20PageLayer.meta.js
// ==/UserScript==
const editBtn=document.getElementById("wp-admin-bar-edit");
if(editBtn){
  let plBtn=editBtn.cloneNode(true);
  plBtn.id="wp-admin-bar-pagelayer-edit";
  plBtn.firstChild.href=window.location.href+"?&pagelayer-live=1";
  plBtn.firstChild.innerText=plBtn.firstChild.innerText+" (PageLayer)";
  editBtn.parentNode.appendChild(plBtn);
}