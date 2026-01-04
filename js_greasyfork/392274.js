// ==UserScript==
// @name     Venus RISC-V basic code dumping
// @description Output basic RISC-V code in Venus
// @version  1
// @grant    none
// @match *://venus.cs61c.org/*
// @namespace https://greasyfork.org/users/248188
// @downloadURL https://update.greasyfork.org/scripts/392274/Venus%20RISC-V%20basic%20code%20dumping.user.js
// @updateURL https://update.greasyfork.org/scripts/392274/Venus%20RISC-V%20basic%20code%20dumping.meta.js
// ==/UserScript==

(function(){

  
  function exe(){
let stmts = [];

for (let s of document.getElementById("program-listing-body").children){
  stmts.push(s.children[2].innerText);
}

const code = stmts.join("\n");
  document.getElementById("console-output").value = code;
  }

  // create hookinh element
  let elem = document.createElement("div");
  elem.className = "control";
  let button = document.createElement("button");
  button.id = "simulator-tomcode";
  button.className = "button is-info";
  button.innerHTML = "Output Basic"
  button.addEventListener("click", exe);
  elem.appendChild(button);
  document.getElementById("simulator-buttons").appendChild(elem);
  
})()
