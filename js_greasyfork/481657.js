// ==UserScript==
// @name         Omegabait Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds "omegabait please use a lit m80 firecracker as a sounding rod" to any post at the click of a button.
// @author       Cobson1997
// @match        https://soyjak.party/*
// @icon         https://i.imgur.com/pnoLTxP.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481657/Omegabait%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/481657/Omegabait%20Button.meta.js
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
    let textarea = document.getElementById('body');
    let email = document.getElementById('email_selectbox');
    textarea.value = "omegabait please use a lit m80 firecracker as a sounding rod";
    email.value = "sage";
    form_textarea.focus();
  }
  function nlq(str){
    return str.replace(/(?:\r\n|\r|\n)/g, '\n>');
  }
  let ref_node = document.getElementById('body');
  function button_cons(value, click_event){
    let button_el = document.createElement("input");
    button_el.type = "button";
    button_el.value = value;
    button_el.addEventListener("click", click_event, false);
    insert_after(button_el, ref_node);
  }
  button_cons("Bait", mass_reply);
})();