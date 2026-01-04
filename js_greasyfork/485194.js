// ==UserScript==
// @name        Random Project Button
// @namespace    http://tampermonkey.net/
// @version      2024-1-23
// @description  Adds a random project button to penguinmod.com
// @author       UnluckyCrafter
// @match        https://penguinmod.com/*
// @match        https://studio.penguinmod.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=penguinmod.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485194/Random%20Project%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/485194/Random%20Project%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
     async function rnd() {
    try {
      const response = await fetch(`https://projects.penguinmod.com/api/projects/search?random=true`);

      if (!response.ok) {
        throw new Error('Failed to fetch random project ID');
      }

      const data = await response.json();

      const id = data.id;

      return JSON.stringify(id);
    } catch (error) {
      console.error('Error fetching project ID: ' + error);
      return '';
    }
  }
//function checkLoad(){
//    console.log("fart")
// if(!document.querySelector("div").querySelectorAll("div")[2].querySelectorAll("button")[5].innerHTML.includes("Sign in")){
//     console.log(document.querySelector("div").querySelectorAll("div")[2].querySelectorAll("button")[5].innerHTML)
//
// setTimeout(checkLoad,100)
// return;
//}
setInterval(()=>{
    console.log("e")
try{if(document.getElementById("farterMachine"))return}catch{}
var rndButton = document.createElement("button")
rndButton.innerHTML = "Random Project"
rndButton.id="farterMachine"
rndButton.onclick = async ()=>{
    var id = await rnd()
    if(window.location.host=="studio.penguinmod.com"){
        window.location.assign("https://studio.penguinmod.com/#"+id)
    }else{
        window.open("https://studio.penguinmod.com/#"+id)
    }
}

try{document.querySelector("div").querySelectorAll("div")[2].appendChild(rndButton)}catch(err){}
try{document.getElementById("app").querySelector("div").querySelector("div").querySelector("div").querySelector("div").appendChild(rndButton)}catch(err){}

},500)
//}

//checkLoad()



})();