// ==UserScript==
// @name         To Do list title - Canvas Instructure
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      5
// @description  Shows the full TO Do task title when you hover over it on the instructure.com dashboard of your course.
// @author       hacker09
// @match        https://*.instructure.com/*
// @icon         https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438333/To%20Do%20list%20title%20-%20Canvas%20Instructure.user.js
// @updateURL https://update.greasyfork.org/scripts/438333/To%20Do%20list%20title%20-%20Canvas%20Instructure.meta.js
// ==/UserScript==

setTimeout(async function() {
  'use strict';
  document.querySelectorAll("div.ToDoSidebarItem__Title").forEach(el => el.title = el.querySelector('div > a > span').innerText); //Fully show each title on hover

  new MutationObserver(async function() { //Se uma quantidade diferente for selecionada
    document.querySelectorAll("div.ToDoSidebarItem__Title").forEach(el => el.title = el.querySelector('div > a > span').innerText); //Fully show each title on hover
  }).observe(document.querySelector("#planner-todosidebar-item-list"), { //Defines the element and the characteristics to be observed
    attributes: false,
    attributeOldValue: false,
    characterData: false,
    characterDataOldValue: false,
    childList: true,
    subtree: true
  }); //Finishes the definitions to be observed
}, 3000);