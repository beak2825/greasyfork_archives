// ==UserScript==
// @name         VIchan Auto Post
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically post on VIchan sites after adding a file
// @author       kotlet
// @match        https://soyjak.party/*
// @icon         https://i.imgur.com/mLTRY2x.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496999/VIchan%20Auto%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/496999/VIchan%20Auto%20Post.meta.js
// ==/UserScript==

(function () {
  function insert_after(new_node, ref_node) {
    ref_node.parentNode.insertBefore(new_node, ref_node.nextSibling);
  }

  function con_cat(value) {
    let form_textarea = document.getElementById('body');
    form_textarea.value += value;
    form_textarea.focus();
  }

  function post() {
    let form_textarea = document.getElementById('body');
    let post_no_nodes = document.getElementsByClassName("post_no");
    for (const node of post_no_nodes) {
      let post_no_text = node.textContent;
      if (!post_no_text.includes("№")) {
        form_textarea.value += `>>${post_no_text}\n`;
      }
    }
    form_textarea.focus();

    // Trigger the post
    let post_button = document.querySelector('input[type="submit"], button[type="submit"]');
    if (post_button) {
      post_button.click();
    }
  }

  function nlq(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '\n>');
  }

  let ref_node = document.getElementById('body');
  
  function button_cons(value, click_event) {
    let button_el = document.createElement("input");
    button_el.type = "button";
    button_el.value = value;
    button_el.addEventListener("click", click_event, false);
    insert_after(button_el, ref_node);
  }

  button_cons("Post", post);
})();