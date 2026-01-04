// ==UserScript==
// @name         add copy text to jira
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://jira.reflex-systems.nl/jira/secure/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reflex-systems.nl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452095/add%20copy%20text%20to%20jira.user.js
// @updateURL https://update.greasyfork.org/scripts/452095/add%20copy%20text%20to%20jira.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
  'use strict';

  function copy() {
    var titleText = document.querySelectorAll('[data-field-id="issuekey"]')[0].children[0].text;
    var summaryText = document.querySelectorAll('[data-field-id="summary"]')[0].textContent;

    navigator.clipboard.writeText(`${titleText} ${summaryText}`);
  }

  function createCopyButton() {
    let btn = document.createElement("button");
    btn.innerHTML = "Copy";
    btn.className = 'aui-button ghx-actions aui-button-compact';
    btn.id = 'copy-button';
    btn.addEventListener("click", copy);
      return btn;
  }



    const observer = new MutationObserver(mutations => {
        var x = document.querySelectorAll('#copy-button');
        if(x.length <= 0){
            var btn = createCopyButton();
            let z = document.getElementsByClassName('ghx-controls')[0];
            z.prepend(btn);
            console.log('hi');
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });




})