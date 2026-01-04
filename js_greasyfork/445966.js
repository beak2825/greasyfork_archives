// ==UserScript==
// @name         View revivability
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Allow anyone to see if people can be revived.
// @author       olesien
// @match        https://www.torn.com/factions.php?step=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445966/View%20revivability.user.js
// @updateURL https://update.greasyfork.org/scripts/445966/View%20revivability.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //Note on api key: Use an api key from a friend that is not in a faction. Minimal access is fine. Person HAS to have the ability to revive.
         let apiKey = String(localStorage.getItem("rev-key"));
     if (apiKey.length < 10) {
        let key = prompt("Please enter key (public is ok)", "");
        console.log(key);
        if (key.length > 10) {
            console.log("setting....");
            localStorage.setItem("rev-key", key);
            apiKey = key;
        } else {
            alert("That is not a key");
        }
    }
    const delay = 2000;
    let isRunning = false;
    const checkUser = async (row) => {
        const userElement = row.querySelector('[class^="honorWrap"] > a');
        console.log(userElement.href);
        const userId = Number(userElement.href.replace(/\D/g,''));
             fetch(`https://api.torn.com/user/${userId}?selections=&key=${apiKey}`)
   .then(response => response.json())
   .then(data => {
       if (data && "revivable" in data) {
           console.log(userId);
           console.log(data.revivable);
           const revivable = data.revivable === 1;
           if (revivable) {
               row.style.backgroundColor = "rgba(176, 16, 16, 0.35)";
           } else {
              row.style.backgroundColor = "rgba(96, 176, 16, 0.35)";
           }
       } else {
           row.style.backgroundColor = "orange";
       }
   });
    }

    const start = setTimeout(() => {
        const rows = Array.from(document.querySelectorAll(".table-row"));

        const memberIconsEl = document.querySelector(".member-icons");
        console.log(rows);

        const element = document.createElement("button");
        element.innerText = "Check for revivability";
        memberIconsEl.appendChild(element);

        element.addEventListener('click', () => {
            if (isRunning) return;
           rows.forEach((row, index) => {
               isRunning = true;
              const timeout = setTimeout(() => {
                 checkUser(row);
                  if (index + 1 === rows.length) {
                     isRunning = false;
                  }
              }, delay * index)

        })
        })


    }, 2000)


})();