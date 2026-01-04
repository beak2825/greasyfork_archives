// ==UserScript==
// @name         Contexto Word Finder
// @namespace    http://tampermonkey.net/
// @version      2024-01-18
// @description  Finds the Contexto word answer based off the game number for you.
// @author       2 Koys
// @match        https://contexto.me/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=contexto.me
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485191/Contexto%20Word%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/485191/Contexto%20Word%20Finder.meta.js
// ==/UserScript==

(function() {
  const userInput = prompt("Enter game number:");

  if (userInput && /^[0-9]{3}$/.test(userInput)) {
    const apiUrl = `https://api.contexto.me/machado/en/giveup/${userInput}`;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        alert("Word: " + data.word);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  } else {
    alert("Invalid input. Please enter the game number");
  }
})();