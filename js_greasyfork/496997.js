// ==UserScript==
// @name         Sharty Mass Reply
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  *sharts on your post*
// @author       Chud
// @match        https://soyjak.party/*
// @icon         https://i.imgur.com/mLTRY2x.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496997/Sharty%20Mass%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/496997/Sharty%20Mass%20Reply.meta.js
// ==/UserScript==

(function () {
  // Function to insert new node after the reference node
  function insert_after(new_node, ref_node) {
    ref_node.parentNode.insertBefore(new_node, ref_node.nextSibling);
  }

  // Function to concatenate value to the form textarea
  function con_cat(value) {
    let form_textarea = document.getElementById('body');
    form_textarea.value += value;
    form_textarea.focus();
  }

  // Function to perform mass reply
  function mass_reply() {
    let form_textarea = document.getElementById('body');
    let post_no_nodes = document.getElementsByClassName("post_no");
    for (const node of post_no_nodes) {
      let post_no_text = node.textContent;
      if (!post_no_text.includes("№")) {
        form_textarea.value += `>>${post_no_text}\n`;
      }
    }
    form_textarea.focus();
  }

  // Function to replace newlines with newlines followed by '>'
  function nlq(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '\n>');
  }

  let ref_node = document.getElementById('body');

  // Function to create a button and attach an event listener to it
  function button_cons(value, click_event) {
    let button_el = document.createElement("input");
    button_el.type = "button";
    button_el.value = value;
    button_el.addEventListener("click", click_event, false);
    insert_after(button_el, ref_node);
  }

  // Adding Mass Reply button
  button_cons("Mass Reply", mass_reply);

  // Automatically post the form
  function auto_post() {
    mass_reply(); // Ensure mass_reply is called to fill the textarea
    setTimeout(() => {
      let form = document.querySelector('form[name="post"]');
      if (form) {
        form.submit();
      } else {
        console.error("Form not found!");
      }
    }, 2000); // Wait 2 seconds to ensure textarea is filled
  }

  // Trigger the automatic post function
  window.addEventListener('load', auto_post);

})();