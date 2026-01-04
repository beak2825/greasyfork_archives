// ==UserScript==
// @name         auto next
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       You
// @match        https://*.protobowl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400308/auto%20next.user.js
// @updateURL https://update.greasyfork.org/scripts/400308/auto%20next.meta.js
// ==/UserScript==



var auto = document.createElement("p");
auto.setAttribute("id", "auto");
auto.setAttribute("style", "float: left;display: block;padding: 5px 3.5% 0px;margin-bottom:0;font-size: small font-weight: 200;color: #545454;text-shadow: 0 1px 0 #ffffff;font-family: Helvetica Neue,Helvetica,Arial,sans-serif;")
var aauto = document.createTextNode('autonext on');
auto.appendChild(aauto);
document.getElementsByClassName("row buttonbar")[0].appendChild(auto);
auto.style.display = "none"


document.addEventListener("keydown", event => {
  if (event.keyCode === 49) {
      if (auto.style.display == "none") {
          auto.style.display = 'block'
      } else {
          auto.style.display ="none"
      }
  }
});


const targetNode = document.getElementsByClassName('btn btn-info nextbtn')[0];

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
            if (targetNode.style.display == "inline-block" && auto.style.display == "block") {
                targetNode.click();
            }
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);