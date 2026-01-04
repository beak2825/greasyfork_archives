// ==UserScript==
// @name         Limpieza de ver mas tarde
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Elimina todos lo video de la lista de reproducción de "ver mas tarde" de youtube
// @author       flyyt4
// @match        https://www.youtube.com/playlist?list=WL*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      APACHE-2.0
// @downloadURL https://update.greasyfork.org/scripts/493706/Limpieza%20de%20ver%20mas%20tarde.user.js
// @updateURL https://update.greasyfork.org/scripts/493706/Limpieza%20de%20ver%20mas%20tarde.meta.js
// ==/UserScript==

(function () {
  "use strict";

  setTimeout(() => {
    (async () => {
      if (window.location.href.includes("youtube.com/playlist")) {
        const buttonsToDelete = document.querySelectorAll(
          "ytd-playlist-video-renderer > #menu > ytd-menu-renderer > yt-icon-button"
        );
        const menu = document.querySelector(
          "ytd-sort-filter-header-renderer > #header-container"
        );
        // const dropdownMenu = document.querySelector("tp-yt-paper-listbox#items");
        // if (!buttonsToDelete) return;
        if (!menu) return;
        const startAndStopButton = document.createElement("button");
        const scriptText = document.createElement("span");
        startAndStopButton.innerHTML = "Iniciar";
        scriptText.innerHTML = "Control de eliminación de todos los videos";
        startAndStopButton.style.outline = "none";
        startAndStopButton.style.border = "none";
        startAndStopButton.style.borderRadius = "5px";
        startAndStopButton.style.cursor = "pointer";
        startAndStopButton.style.padding = "5px";
        startAndStopButton.style.marginRight = "24px";
        startAndStopButton.style.color = "white";
        startAndStopButton.style.fontSize = "14px";
        startAndStopButton.style.backgroundColor = "rgb(64 134 37)";
        scriptText.style.marginLeft = "auto";
        scriptText.style.marginRight = "16px";
        scriptText.style.display = "flex";
        scriptText.style.alignItems = "center";
        scriptText.style.textAlign = "center";
        scriptText.style.color = "white";
        scriptText.style.fontSize = "14px";
        scriptText.style.fontWeight = "500";
        menu.appendChild(scriptText);
        menu.appendChild(startAndStopButton);
        let isPlaying = false;
        let i = 0;
        let intervalId;
        startAndStopButton.addEventListener("click", () => {
          isPlaying = !isPlaying;
          startAndStopButton.innerHTML = isPlaying ? "Parar" : "Iniciar";
          startAndStopButton.style.backgroundColor = isPlaying
            ? "rgb(255, 0, 0)"
            : "rgb(64 134 37)";
          // dropdownMenu.style.opacity = isPlaying ? "0" : "1";
          if (isPlaying) {
            intervalId = setInterval(() => {
              if (i === buttonsToDelete.length) {
                clearInterval(intervalId);
                scriptText.innerHTML = "Se han eliminado todos los videos";
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
                return;
              }
              buttonsToDelete[i].click();
              document
                .querySelector(
                  "#items > ytd-menu-service-item-renderer:nth-child(3) > tp-yt-paper-item"
                )
                .click();
              i++;
              scriptText.innerHTML = "Eliminando video #" + i;
            }, 1000);
          } else {
            clearInterval(intervalId);
          }
        });
      }
    })();
  }, 3000);
})();
