// ==UserScript==
// @name        Default Raffle Entries - scrap.tf
// @description Allows users to specify default value of "Maximum Entries".
// @namespace   Violentmonkey Scripts
// @match	https://scrap.tf/settings*
// @include	https://scrap.tf/raffles/create
// @grant       GM.getValue
// @grant       GM.setValue
// @version     1.0
// @license     MIT
// @author      U.N.Owen
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/439480/Default%20Raffle%20Entries%20-%20scraptf.user.js
// @updateURL https://update.greasyfork.org/scripts/439480/Default%20Raffle%20Entries%20-%20scraptf.meta.js
// ==/UserScript==

async function load_raffle_entries(){
  var entries = await GM.getValue('default_entries');
  if(entries != null){
    $("#raffle-maxentries").val(entries);
    $("#puzzle-raffle-maxentries").val(entries);
  }
};

async function add_settings(){
  var raffle_entry_div = $("<div></div>").addClass("form-group");
  raffle_entry_div.append($("<label>").attr("for","default-raffle-entries").text("Default Raffle Entries"));
  var raffle_entry_input = $("<input>").attr("class","form-control").attr("placeholder","100").attr("min","1")
  .attr("max","100000").attr("type","number").attr("id","default-raffle-entries").attr("onchange","ScrapTF.Raffles.ValidateMaxEntries(this)");
  var entries = await GM.getValue('default_entries');
  if(entries != null){
  	raffle_entry_input.val(entries);
  }
  raffle_entry_div.append(raffle_entry_input);
  $("#s2id_site-theme").parent().before(raffle_entry_div);

  $("#btn-settings-save").click(async function(){
    await GM.setValue('default_entries', raffle_entry_input.val());
  });
};

$(document).ready(function(){
  if(window.location.href.includes("create")){
    load_raffle_entries();
  }
  if(window.location.href.includes("settings")){
    add_settings();
  }
});