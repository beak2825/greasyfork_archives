// ==UserScript==
// @name         Hasura console nav bar color
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the nav bar to a different color based on the environment (using the API URL)
// @author       You
// @match        http://localhost:9695/console/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470250/Hasura%20console%20nav%20bar%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/470250/Hasura%20console%20nav%20bar%20color.meta.js
// ==/UserScript==

function changeColorWhenReady() {
  let expectedUrl = 'http://localhost:8080'; // Replace with your value
  let newColor = 'darkred'; // Replace with your color

  if (window.__env && window.__env.dataApiUrl === expectedUrl) {
    let divElement = document.querySelector("#auth-container > div > div > div.font-sans.bg-slate-700.text-slate-100.flex.h-16");
    if (divElement) {
      divElement.style.backgroundColor = newColor;
    } else {
      // If the element is not yet available, try again after 500 milliseconds
      setTimeout(changeColorWhenReady, 500);
    }
  } else {
    // If the environment variable is not yet set, try again after 500 milliseconds
    setTimeout(changeColorWhenReady, 500);
  }
}

// Start the polling process
changeColorWhenReady();
