// ==UserScript==
// @name        PMC randomiser planetminecraft.com
// @namespace   Violentmonkey Scripts
// @match       *://*.planetminecraft.com/*
// @grant       none
// @version     1.1
// @license MIT
// @icon        https://www.google.com/s2/favicons?sz=64&domain=planetminecraft.com
// @author      RedStrider
// @description Adds a random post button.
// @downloadURL https://update.greasyfork.org/scripts/511142/PMC%20randomiser%20planetminecraftcom.user.js
// @updateURL https://update.greasyfork.org/scripts/511142/PMC%20randomiser%20planetminecraftcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
  //Appologies for my bad ai riddled code.

  console.log("Planet Minecraft Randomiser is working.");

  function gotoRandomPage(){
    const numResultsElement = document.querySelector('.num_results');

    const textContent = numResultsElement.textContent;

    const match = textContent.match(/of ([\d,]+)/);

    let totalResults = match ? match[1].replace(/,/g, '') : null;

    totalResults = totalResults ? parseInt(totalResults, 10) : null;

    sessionStorage.setItem("randomiseStage", "setRandomPage");

    setURLParameter("p", getRandomInt(Math.ceil(totalResults/25)));
    window.location.reload();


  }

  function getRandomPost(){
    const resources = document.querySelector('.resource_list').querySelectorAll('[data-type="resource"]');
    return resources[getRandomInt(resources.length)];
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function setURLParameter(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.replaceState({}, '', url);
  }

  window.addEventListener('load', function() {
    // Insert random post button to page.

    const ranPostButton = `<button class="site_btn_medium" style="font-size: large; font-weight:bold;" id="randomPostGrabber">🎲 Get Random Post</button>`;

    let buttonContainer = document.getElementById("full_screen");
    if(!buttonContainer && document.querySelector('.setDisplayMode')){
      buttonContainer = document.getElementById("center");
    }

    buttonContainer.insertAdjacentHTML("afterbegin", ranPostButton);

    document.getElementById("randomPostGrabber").addEventListener("click", () => {
      gotoRandomPage();
    })


    // Check if in grid page before swapping to random page
    if (document.querySelector('.setDisplayMode')) {

      let randomiseStage = sessionStorage.getItem("randomiseStage")
//       if(randomiseStage == null || randomiseStage == "end"){
//         console.log("Asking if get random post.")

//         let answer = window.confirm("Get random post?");
//         if (answer) {
//           gotoRandomPage();
//         } else {
//           // User clicked Cancel
//         }
//       } else

       if(randomiseStage == "setRandomPage"){
        console.log("Opening random page.")

        // wait 500 ms for page load
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const waitThenOpenPost = async () => {
          await delay(500);
          let randomPost = getRandomPost();
          let postLink = randomPost.querySelector('div:nth-child(2) > a:nth-child(1)');

          sessionStorage.setItem("randomiseStage", "end");

          postLink.click();
        };

        waitThenOpenPost();
      }
    }

  });

})();