// ==UserScript==
// @name        Add Random Problem Button
// @namespace   Violentmonkey Scripts
// @match       https://seanprashad.com/leetcode-patterns/
// @grant       none
// @version     1.0
// @author      Mauville@Github
// @description Adds a button to choose a problem at random.
// @downloadURL https://update.greasyfork.org/scripts/428376/Add%20Random%20Problem%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/428376/Add%20Random%20Problem%20Button.meta.js
// ==/UserScript==
let randomProblem = () =>{
  let problems = document.querySelectorAll("tbody tr :nth-Child(2) a")
  let randomProb = problems[Math.floor(Math.random()*problems.length)];
  window.open(randomProb.getAttribute("href"), '_blank');
  
}

let navbar = document.querySelector(".nav, .navtabs")
let buttchild = document.createElement("li")
buttchild.innerHTML = '<button class="btn btn-primary">Random from Selection</button>'
buttchild.onclick = randomProblem;
navbar.appendChild(buttchild)
