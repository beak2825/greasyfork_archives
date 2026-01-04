// ==UserScript==
// @name         Gemmy Button Bar
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  >you will NOT gem up the sharty buttons
// @author       Unknown
// @match        https://soyjak.party/*
// @icon         https://www.google.com/s2/favicons?domain=soyjak.party
// @grant        none
// @license      wtfpl
// @downloadURL https://update.greasyfork.org/scripts/458433/Gemmy%20Button%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/458433/Gemmy%20Button%20Bar.meta.js
// ==/UserScript==

(function () {
  function insert_after(new_node, ref_node) {
    ref_node.parentNode.insertBefore(new_node, ref_node.nextSibling);
  }
  function con_cat(value)
  {
    let form_textarea = document.getElementById('body');
    form_textarea.value += value;
    form_textarea.focus();
  }
  function mass_reply() {
    let form_textarea = document.getElementById('body');

    let post_no_nodes = document.getElementsByClassName("post_no");
    for(const node of post_no_nodes) {
      let post_no_text = node.textContent;
      if(!post_no_text.includes("No")) {
        form_textarea.value += `>>${post_no_text} (You)\n`;
      }
    }
    form_textarea.focus();
  }
  function nlq(str){
    return str.replace(/(?:\r\n|\r|\n)/g, '\n>');
  }
  function quote() {
    let form_textarea = document.getElementById('body');
    form_textarea.value = ">" + nlq(form_textarea.value);
    form_textarea.focus();
  }
  function bumo() {
    con_cat("Bumo ");
  }
  function go_up() {
    con_cat("Go up ");
  }
  function shes_right() {
    con_cat("she's right ");
  }
  function tsmt() {
    con_cat("tsmt ");
  }
  function ker() {
    con_cat("you were one i ker ");
  }
  function HWABAG() {
    con_cat("HWABAG ");
  }
  function BBC() {
    con_cat("BBC ");
  }
  function VC1() {
    con_cat("Hop on VC ");
  }
  function VC2() {
    con_cat("They're laughing at you on VC ");
  }
  function new_toss() {
    con_cat("new 'toss ");
  }
  function meds() {
    con_cat("meds ");
  }
  function ratio() {
    var L = "+ L + ratio "
    if (Math.random() < 0.25) L += "bozo ";
    con_cat(L);
  }
  let ref_node = document.getElementById('body');
  function button_cons(value, click_event){
    let button_el = document.createElement("input");
    button_el.type = "button";
    button_el.value = value;
    button_el.addEventListener("click", click_event, false);
    insert_after(button_el, ref_node);
  }
  button_cons("new 'toss", new_toss);
  button_cons("ratio", ratio);
  button_cons("VC2", VC2);
  button_cons("VC1", VC1);
  button_cons("BBC", BBC);
  button_cons("meds", meds);
  button_cons("HWABAG", HWABAG);
  button_cons("ker", ker);
  button_cons("tsmt", tsmt);
  button_cons("she's right", shes_right);
  button_cons("Bumo", bumo);
  button_cons("Go up", go_up);
  button_cons(">",quote);
  button_cons("Mass Reply", mass_reply);
})();