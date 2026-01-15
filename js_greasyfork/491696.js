// ==UserScript==
// @name         Color Dashboard V2.3.2
// @namespace    https://github.com/R0g3rT
// @version      2.3.2
// @description  burn rubber not your soul!!
// @author       R0g3rT
// @license MIT
// @match        https://partner.jifeline.com/portal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jifeline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491696/Color%20Dashboard%20V232.user.js
// @updateURL https://update.greasyfork.org/scripts/491696/Color%20Dashboard%20V232.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Variablen
  let ispause = null;
  let isstate = "";
  const n = "HitchCoder Saalfeld";
  const on = "Rameder Connect";
  let lastCheckMinute = -1;
  let isFullscreenInitialized = false;
  const logSend = true; // Setze auf true um Logs zu aktivieren

  // Logging Funktion
  function Log(message, data){

    if (logSend) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }

  }

  // Prüfe ob Fullscreen-Modus aktiv ist
  function isFullscreenMode() {
    return document.querySelector("body > app-root > app-layout > div > div > div > div > div > app-dashboard > div > app-wall-screen > div > div > div.header.d-flex.justify-content-between.align-items-center.pb-4.mb-4 > div:nth-child(1) > strong") !== null;
  }

  // Initialisiere Status aus localStorage
  function initializeFromLocalStorage() {
    const storedState = localStorage.getItem('Cstate');
    const storedPause = localStorage.getItem('Cpause');

    Log("Initializing from localStorage:", { storedState, storedPause });

    if (storedState) {
      isstate = storedState === 'close' ? 'closed' : storedState;
      ispause = storedPause !== 'null' && storedPause !== null ? storedPause : null;
      modifyCSS();
    }

    isFullscreenInitialized = true;
  }

  // Hole Status von der API
  function getStatus() {
    Log("Fetching status from API...");

    return fetch(
      "https://partner.jifeline.com/api/provider/private/provider/service_center"
    )
      .then((response) => response.json())
      .then((data) => {
        const newState = data.service_center_state;
        const newPause = data.service_center_paused_until;

        Log("API Response:", { state: newState, pause: newPause });

        // Nur bei Statusänderung CSS anpassen
        if (isstate !== newState || ispause !== newPause) {
          Log("Status changed:", {
            oldState: isstate,
            newState: newState,
            oldPause: ispause,
            newPause: newPause
          });
          isstate = newState;
          ispause = newPause;
          modifyCSS();
        } else {
          Log("Status unchanged, skipping CSS modification");
        }
      })
      .catch((error) => console.error("Error fetching status:", error));
  }

  // Ersetze Textinhalte
  function replaceText() {
    const elements = document.querySelectorAll(".title");
    elements.forEach((element) => {
      if (element.textContent.trim() === on) {
        element.textContent = n;
      }
    });
  }

  // Modifiziere CSS basierend auf Status
  function modifyCSS() {
    const Copen = "green";
    const Cscheduled = "cadetblue";
    const Cclosed = "lightgray";

    const setStatus = document.querySelector(
      "app-wall-screen .ms-1.ng-star-inserted"
    );
    const wallScreen = document.querySelector(".wall-screen");
    const ticketCount = document.querySelector(".operator-ticket-count .badge");

    if (!setStatus || !wallScreen) {
      Log("Wall screen elements not found yet, will retry...");
      return;
    }

    // Bestimme aktuellen Status
    let currentStatus = "";

    if (ispause !== null && ispause !== "") {
      currentStatus = "scheduled";
    } else if (isstate === "open") {
      currentStatus = "open";
    } else if (isstate === "closed" || isstate === "close") {
      currentStatus = "close";
    }

    Log("Applying CSS for status:", currentStatus);

    // Entferne vorherige Animationen
    const elementsToBlink = document.querySelectorAll(
      "app-wall-screen .ms-1.ng-star-inserted"
    );
    elementsToBlink.forEach((element) => {
      element.style.animation = "";
    });

    // Wende CSS basierend auf Status an
    if (currentStatus === "open") {
      setTimeout(() => {
        if (setStatus.textContent.trim() !== "Open") {
          setStatus.textContent = "Open";
        }
      }, 2000);

      wallScreen.style.background = Copen;
      if (ticketCount) ticketCount.style.background = Copen;
       setStatus.style.setProperty('background-color', Copen, 'important');
      applyBlinkAnimation();
      localStorage.setItem('Cstate', 'open');
      localStorage.setItem('Cpause', 'null');

    } else if (currentStatus === "scheduled") {
      setTimeout(() => {
        if (setStatus.textContent.trim() !== "Scheduled") {
          setStatus.textContent = "Scheduled";
        }
      }, 2000);

      wallScreen.style.background = Cscheduled;
      if (ticketCount) ticketCount.style.background = Cscheduled;
      setStatus.style.setProperty('background-color', '#f39c12', 'important');
      localStorage.setItem('Cstate', 'scheduled');
      localStorage.setItem('Cpause', ispause);

    } else if (currentStatus === "close") {
      setTimeout(() => {
        if (setStatus.textContent.trim() !== "Closed") {
          setStatus.textContent = "Closed";
        }
      }, 2000);

      wallScreen.style.background = Cclosed;
      if (ticketCount) ticketCount.style.background = Cclosed;
      setStatus.style.setProperty('background-color', 'red', 'important');
      localStorage.setItem('Cstate', 'close');
      localStorage.setItem('Cpause', 'null');
    }
  }

  // Füge Blink-Animation hinzu
  function applyBlinkAnimation() {

    if (document.getElementById('blink-animation')) {
      const elementsToBlink = document.querySelectorAll(
        "app-wall-screen .ms-1.ng-star-inserted"
      );
      elementsToBlink.forEach((element) => {
        element.style.animation = "blink 3s infinite";
      });
      return;
    }

    const blinkKeyframes = `
      @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
      }
    `;

    const styleElement = document.createElement("style");
    styleElement.id = 'blink-animation';
    styleElement.textContent = blinkKeyframes;
    document.head.appendChild(styleElement);

    const elementsToBlink = document.querySelectorAll(
      "app-wall-screen .ms-1.ng-star-inserted"
    );
    elementsToBlink.forEach((element) => {
      element.style.animation = "blink 3s infinite";
    });
  }

  // Überprüfe die Zeit und rufe API zu bestimmten Zeiten ab
  function checkTime() {
    // const timeElement = document.querySelector(
    //   "body > app-root > app-layout > div > div > div > div > div > app-dashboard > div > app-wall-screen > div > div > div.header.d-flex.justify-content-between.align-items-center.pb-4.mb-4 > div:nth-child(2)"
    // );


    // if (!timeElement) return;

    // const timeText = timeElement.textContent.trim();
    const date = new Date(); //new Date(timeText);

    const currentMinute = date.getHours() * 60 + date.getMinutes();


    if (currentMinute === lastCheckMinute) return;

    const currentTime = date.getHours() * 100 + date.getMinutes();


    if (currentTime === 800 || currentTime === 1230 || currentTime === 1330 || currentTime === 1700) {

      lastCheckMinute = currentMinute;
      setTimeout(() => {
          let currentTimetoString = currentTime.toString();
          let currentTimeformat = currentTimetoString.slice(0, 2) + ":" + currentTimetoString.slice(2);
        getStatus();
           Log("Time check started at:", currentTimeformat);
      }, 2000);
    }else {
    // Log("No time check needed at:", date.getHours() + ":" + date.getMinutes());
    }
  }

  // Beobachte DOM-Änderungen für Fullscreen-Modus
  const observer = new MutationObserver(() => {
    if (isFullscreenMode() && !isFullscreenInitialized) {
      Log("Fullscreen mode detected, initializing from localStorage...");
      initializeFromLocalStorage();
      // Direkt nach Fullscreen-Start auch einmal API aufrufen
      setTimeout(() => {
        getStatus();
        checkTime();
      }, 2000);
    } else if (!isFullscreenMode()) {
      isFullscreenInitialized = false;
    }
  });

  // Starte Beobachtung
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Initialisierung beim Start (falls schon im Fullscreen)
  setTimeout(() => {
    if (isFullscreenMode()) {
      Log("Starting in fullscreen mode");
      initializeFromLocalStorage();
      // Initial API Call
      setTimeout(() => {
        getStatus();
        //checkTime();
       }, 2000);
     }
  }, 500);

  // Hauptschleife
  setInterval(() => {
    replaceText();
    checkTime();


    // Wenn Fullscreen-Elemente existieren aber noch nicht initialisiert
    if (isFullscreenMode() && !isFullscreenInitialized) {
      initializeFromLocalStorage();
    }
  }, 1000);

})();