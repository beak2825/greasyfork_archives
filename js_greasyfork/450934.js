// ==UserScript==
// @name     vulkan plan filter
// @version  0.2.0
// @grant    none
// @match http://www.batory.edu.pl/plan/*/index.html
// @match http://www.batory.edu.pl/plan/*/plany/o*.html
// @namespace https://greasyfork.org/users/853831
// @description Filter your plan in vulkan by subject groups
// @downloadURL https://update.greasyfork.org/scripts/450934/vulkan%20plan%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/450934/vulkan%20plan%20filter.meta.js
// ==/UserScript==


// config
let groups = {
  "MAT": 2,
  "GR3": 3,
  "GR4": 3,
  "GR6": 2,
  "POL": 1,
  "ENG": 3,
  "TOK": 3,
  "WF": 3,
  "GW": 2,
  "CAS": 2,
};

console.log("plan filter");

window.addEventListener("load", LocalMain, false);

function LocalMain () {
  let plan_window = null;
  if (document.URL.includes("plany")) {
    plan_window = window;
  } else {
  	plan_window = window.frames[1];
  }
  console.log(window);
  
  let cells = plan_window.document.querySelectorAll(".l");
//   console.log(cells);

  for (i=0; i<cells.length; i++) {    
    let children = cells[i].children; 
//     console.log(children);
    
    for (j=0; j<children.length; j++) {
      if (children[j].localName === "br") {
        continue;
      }
      
     	let text = children[j].children[0].innerText;
      
      let subject = text.split("-")[0];
      let group = text.split("-")[1].split("/")[0];
      
//       console.log(subject);
//       console.log(group);
      
      if (groups[subject] && groups[subject] != group) {
        children[j].innerText = "";
      }
    }
  }
  
  console.log("cleared plan");
}
