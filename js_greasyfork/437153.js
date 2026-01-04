// ==UserScript==
// @name        Soyjak.party Mass Reply
// @namespace   Soyjak.party
// @match       https://soyjak.party/*/res/*
// @match       http://soyjak.party/*/res/*
// @match       https://www.soyjak.party/*/res/*
// @match       http://www.soyjak.party/*/res/*
// @grant       none
// @license     MIT 
// @version     1.0.3
// @author      thoughever
// @description Mass reply on soyjak.party
// @downloadURL https://update.greasyfork.org/scripts/437153/Soyjakparty%20Mass%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/437153/Soyjakparty%20Mass%20Reply.meta.js
// ==/UserScript==

(function () {
  function insert_after(new_node, ref_node) {
    ref_node.parentNode.insertBefore(new_node, ref_node.nextSibling);
  }
  function mass_reply() {
    let form_textarea = document.getElementById('body');

    let post_no_nodes = document.getElementsByClassName("post_no");
    for(const node of post_no_nodes) {
      let post_no_text = node.textContent;
      if(!post_no_text.includes("No")) {
        form_textarea.value += `>>${post_no_text}\n`;
      }
    }
    form_textarea.focus();
  }
  
  function add_button() {
    let ref_node = document.querySelectorAll(".op .intro .post_no")[1];
    let button = document.createElement("input");
    button.type = "button";
    button.value = "Mass Reply";
    button.style.marginLeft = "5px";
    button.addEventListener("click", function() {
      mass_reply();
    }, false);
    
    insert_after(button, ref_node);
  }
  
  add_button();
})();