// ==UserScript==
// @name         RPCS3 Compatibility Checker(Search)
// @namespace    https://github.com/Satanarious
// @version      0.2
// @description  Check and display the compatibility status of RPCS3 games on the PS3 page of RomsPure Search
// @author       Satanarious
// @license      MIT License
// @copyright    2023+, Satyam Singh Niranjan, https://github.com/Satanarious
// @match        https://romspure.cc/roms/sony-playstation-3/page/*
// @match        https://romspure.cc/roms/sony-playstation-3/*
// @match        https://romspure.cc/roms/sony-playstation-3
// @icon         https://www.google.com/s2/favicons?sz=64&domain=romspure.cc
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/529933/RPCS3%20Compatibility%20Checker%28Search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529933/RPCS3%20Compatibility%20Checker%28Search%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Add colour legends
  const form = document.createElement("div");
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

  try {
    document.getElementsByClassName("filters")[0].appendChild(form);
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    document.getElementById("primary").insertBefore(form, document.getElementsByClassName("related-roms")[0]);
    form.innerHTML += "<br><br>"
  }

  const gameRows = document.getElementsByClassName("col-archive-item");
  Array.prototype.slice.call(gameRows).forEach((row, index) => {
    const gameArtSelector = gameRows[index].querySelector("div > a > div");
    const gameName = gameRows[index].querySelector(
      "div > a > h3"
    ).textContent;
    checkCompatibility(gameName)
      .then((compatibilityStatus) => {
        gameArtSelector.style.border = `4px solid ${getColourForStatus(
          compatibilityStatus)}`;
        gameArtSelector.style.borderRadius = "5px";

        // console.log(
        //   `Compatibility status for ${gameName}: ${compatibilityStatus}`
        // );
      })
      .catch((error) => {
        console.error("Error fetching compatibility status:", error);
      });
  });

  // Function to fetch compatibility status from RPCS3
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
