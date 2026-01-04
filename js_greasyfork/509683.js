// ==UserScript==
// @name Notion.so Colored Checklist with No Strikethrough 
// @description This script prevents Notion from adding a strikethrough style to checked items in a todo list, while retaining any custom text colors.
// @namespace Tampermonkey Scripts
// @match https://www.notion.so/*
// @grant none
// @version 1.0.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509683/Notionso%20Colored%20Checklist%20with%20No%20Strikethrough.user.js
// @updateURL https://update.greasyfork.org/scripts/509683/Notionso%20Colored%20Checklist%20with%20No%20Strikethrough.meta.js
// ==/UserScript==
// 

function restyleCheckedTodos(elements){
  elements.forEach((e) => {
    if(e.style.textDecoration.includes('line-through')){
      e.style.textDecoration = 'none';
    }
  });
}

let config = {
  attributes: true,
  attributeFilter: ["style"],
  childList: true,
  subtree: true
};

let observer = new MutationObserver((mutationsList, observer) => {
	// Any elements recently added or edited.
	restyleCheckedTodos(mutationsList.map((m) => m.target));
	// Anything that was missed by the above.
    restyleCheckedTodos(document.querySelectorAll("[contenteditable]"));
});

observer.observe(document, config);