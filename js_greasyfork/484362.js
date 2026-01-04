// ==UserScript==
// @name         Logs Check
// @namespace    http://tampermonkey.net/
// @version      2024-02-06
// @description  try to take over the world!
// @author       Artem_Tankov
// @match        https://logs.blackrussia.online/gslogs/*
// @icon         https://icons.iconarchive.com/icons/hopstarter/adobe-cs4/256/File-Adobe-Dreamweaver-XML-01-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484362/Logs%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/484362/Logs%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

        const LoadingDocument = document.getElementById("loading-overlay")
        const LoadTable = document.getElementById("loading-overlay-container")
        const a = document.getElementById("next-page-btn")
        const ButtonNextPage = window.getComputedStyle(a);
        const LoadDocOff = window.getComputedStyle(LoadingDocument)
        const i = document.querySelector(".collapse.navbar-collapse")
        const AllLogsButton = document.createElement("button")
        const OffAllLogsButton = document.createElement("button")
        var lol = 1;

        AllLogsButton.style.marginRight = "70px"
        AllLogsButton.style.borderRadius = "10px"

        OffAllLogsButton.style.position = "fixed"
        OffAllLogsButton.style.top = "550px"
        OffAllLogsButton.style.borderRadius = "10px"

        AllLogsButton.textContent = "Все логи";
        OffAllLogsButton.textContent = "Остановить";

        i.prepend(AllLogsButton);
        LoadTable.prepend(OffAllLogsButton);

        function AllLogs() {
            if (ButtonNextPage.display == "block" && lol == 1) {
                setTimeout(function() {
                    console.log("Нажал");
                    a.click();
                    AllLogs();
                }, 3000);
            }
        }

        function OffAllLogs() {
            lol = 0
            setTimeout(function() {
                lol = 1
         }, 4000);
            console.log("Остановись")
      }

        AllLogsButton.addEventListener('click', () => {
            AllLogs()
            AllLogsButton.style.background = "#d0db02"
                                                      })
        OffAllLogsButton.addEventListener("click", () => {
            AllLogsButton.style.background = "#fff"
            OffAllLogs()
                                                      })
})();