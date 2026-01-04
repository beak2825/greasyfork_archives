// ==UserScript==
// @name         TimerCountDown
// @version      0.1
// @description  for friends
// @author       Sergio222
// @match        https://prod.uhrs.playmsn.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/308379
// @downloadURL https://update.greasyfork.org/scripts/444165/TimerCountDown.user.js
// @updateURL https://update.greasyfork.org/scripts/444165/TimerCountDown.meta.js
// ==/UserScript==

(function() {
    'use strict';

     let timing = 0;

    // TIMER CONTAINER
    const timerContainer = document.createElement("div");
    timerContainer.classList.add("timer-container");
    timerContainer.id = "timer-id";
    timerContainer.innerHTML = "SERGIO";

    //TIMER SHOW
    const timerShow = document.createElement("div");
    timerShow.innerHTML = "0 Segundos";

    // TIMER RESET BUTTON
    const timerResetButton = document.createElement("button");
    timerResetButton.innerHTML = "RESET TIMER";
    timerResetButton.addEventListener("click", () => {
    	timing = 0;
      timerShow.innerHTML = "0 Segundos";
      //resetTimmer();
    });

    let intervalId;

    const timerFunction = () => {
     		timing++;
        timerShow.innerHTML = `${timing} Segundos`
    }

    setInterval(timerFunction, 1000);

    const resetTimmer = () => {
     // TODO: MEJORAR ESTO
     // clearInterval(intervalId);
     // intervalId = setInterval(timerFunction, 1000);
    }


    timerContainer.append(timerShow);
    timerContainer.append(timerResetButton);
    document.body.prepend(timerContainer);

       GM_addStyle(`
        #timer-id {
        height: 50px;
        background-color: white;
        }
    `);
})();