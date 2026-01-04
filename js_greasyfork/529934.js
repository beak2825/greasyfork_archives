// ==UserScript==
// @name         RPCS3 Compatibility Checker(Game Page)
// @namespace    https://github.com/Satanarious
// @version      0.2
// @description  Check and display the compatibility status of RPCS3 games on the PS3 page of RomsPure Game Page
// @author       Satanarious
// @license      MIT License
// @copyright    2023+, Satyam Singh Niranjan, https://github.com/Satanarious
// @exclude        https://romspure.cc/roms/sony-playstation-3/page/*
// @exclude        https://romspure.cc/roms/sony-playstation-3/?*
// @match        https://romspure.cc/roms/sony-playstation-3/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=romspure.cc
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/529934/RPCS3%20Compatibility%20Checker%28Game%20Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529934/RPCS3%20Compatibility%20Checker%28Game%20Page%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Add a button to each game row
  const form = document.getElementsByTagName("form")[0];
  form.innerHTML +=
    "<h4>Border Colours for RPCS3 Compatibility are as follows:<br></h4>";
  form.innerHTML +=
    "<h5><div id='p' style='display:inline-block;color:#24e275;text-decoration:underline;'>Playable</div> : Games that can be completed with playable performance and no game breaking glitches</h5>";
  form.innerHTML +=
    "<h5><div id='p' style='display:inline-block;color:#007dfb;text-decoration:underline;'>Ingame</div> : Games that either can't be finished, have serious glitches or have insufficient performance</h5>";
  form.innerHTML +=
    "<h5><div id='p' style='display:inline-block;color:#faa607;text-decoration:underline;'>Intro</div> : Games that display image but don't make it past the menus</h5>";
  form.innerHTML +=
    "<h5><div id='p' style='display:inline-block;color:#ee301d;text-decoration:underline;'>Loadable</div> : Games that display a black screen with a framerate on the window's title</h5>";
  // Add Currently Opened Game Compatibility Status
  const currentGameName = document.querySelector("#primary > h1").textContent;
  const tableBody = document.getElementsByTagName("table")[0];

  checkCompatibility(currentGameName)
    .then((compatibility) => {
      const colour = getColourForStatus(compatibility);
      tableBody.innerHTML += `<tr><th style='color:#6c757d'>RPCS3 Compatibility<td>
      <a href='https://rpcs3.net/compatibility?g=${currentGameName}#jump' style='color:${colour}'>
      <div style='border:2px solid ${colour}; width:100px; height: 40px; border-radius:20px;display: flex;justify-content: center;align-items: center;'> ${compatibility}</div></a></tr>`;
    })
    .catch((error) => {
      console.error("Error fetching compatibility status:", error);
    });

  // Function to fetch compatibility status
  function checkCompatibility(gameName) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://rpcs3.net/compatibility?g=${gameName}&type=1`,
        onload: function (response) {
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(
            response.responseText,
            "text/html"
          );
          const compatibilityStatus =
            htmlDoc.querySelector(
              "div.compat-table-cell.compat-table-cell-status > div"
            )?.textContent || "Unknown";
          resolve(compatibilityStatus);
        },
        onerror: function (error) {
          reject(error);
        },
      });
    });
  }

  // Function to get color based on compatibility status
  function getColourForStatus(status) {
    switch (status) {
      case "Playable":
        return "#24e275";
      case "Ingame":
        return "#007dfb";
      case "Intro":
        return "#faa607";
      case "Loadable":
        return "#ee301d";
      default:
        return "#000000"; // Default color
    }
  }
})();
