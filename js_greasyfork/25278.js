// ==UserScript==
// @name         Pixlr Apps Ad Remover
// @namespace    http://lukaszmical.pl/
// @version      0.3.1
// @description  Remove Ad in Pixlr Apps
// @author       Łukasz
// @match        https://pixlr.com/*/editor/*
// @match        https://pixlr.com/*/express/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25278/Pixlr%20Apps%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/25278/Pixlr%20Apps%20Ad%20Remover.meta.js
// ==/UserScript==
 
let ready = false;

function removeAdd() {
  if(ready){
    return;
  }
  const workspace = document.querySelector('#workspace');
  const addContainer = document.querySelector('#right-space');

    
  console.log({workspace, addContainer});
    
  if (workspace) {
    workspace.style.right = "0";
  }
  if (addContainer) {
    addContainer.parentNode.removeChild(addContainer);
    ready = true;
  } else {
    setTimeout(removeAdd, 1000);
  }
}

removeAdd();