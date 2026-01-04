// ==UserScript==
// @name     Tiermaker Streaming Tools
// @version  3.4
// @include  https://tiermaker.com*
// @grant    none
// @license MIT
// @description A script to show the title of the next card in Tiermaker
// @namespace https://greasyfork.org/users/856630
// @downloadURL https://update.greasyfork.org/scripts/442332/Tiermaker%20Streaming%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/442332/Tiermaker%20Streaming%20Tools.meta.js
// ==/UserScript==
 
 
 
window.addEventListener('load', function() {
let tierlistContainer = document.querySelector("#create-image-carousel")

tierlistContainer.style.setProperty('margin-right', "30%")

var widthSlider = document.createElement("input");   
widthSlider.setAttribute("type","range")  
widthSlider.setAttribute("min","0")
widthSlider.setAttribute("max","69")  
widthSlider.setAttribute("value","30")   
widthSlider.setAttribute("id","widthSlider")  
widthSlider.oninput = updateWidth
  
function updateWidth(){
  
  tierlistContainer.style.setProperty('margin-right', this.value+"%")
  console.log(this.value)
}
                           
               
let tierlistOuterContainer = document.querySelector("#char-tier-outer-container-scroll")
tierlistOuterContainer.appendChild(widthSlider)
  
let tierlistRank = document.querySelector("#tier-wrap")  	
 
let character = tierlistContainer.querySelector(".character")
 
var title = document.createElement("h3");  
let firstElementURL = character.style.backgroundImage
let urlArray = firstElementURL.split("/")
let fileName = urlArray[urlArray.length-1].split(".")[0];
fileName = fileName.slice(0, -3);
console.log(fileName);
title.innerHTML = "<a target='_blank' rel='noopener noreferrer' href=https://lens.google.com/uploadbyurl?url=https://tiermaker.com"+firstElementURL.split("\"")[1]+">"+fileName+"</a>"
 
  
title.setAttribute('id', 'characterLabel');
tierlistRank.appendChild(title)
console.log(title)
  
// Select the node that will be observed for mutations
const targetNode = tierlistContainer
 
// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };
 
// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          	let character = tierlistContainer.querySelector(".character")
						let firstElementURL = character.style.backgroundImage
                        console.log("url",firstElementURL)
						let urlArray = firstElementURL.split("/");
            let fileName = urlArray[urlArray.length-1].split(".")[0];
						fileName = fileName.slice(0, -3);
						console.log(fileName);
            title.innerHTML = "<a target='_blank' rel='noopener noreferrer' href=https://lens.google.com/uploadbyurl?url=https://tiermaker.com"+firstElementURL.split("\"")[1]+">"+fileName+"</a>"
           
 
						console.log(tierlistContainer)
            console.log('A child node has been added or removed.');
        }
    }
};
 
 
// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
 
// Start observing the target node for configured mutations
observer.observe(targetNode, config);
 
}, false);
 