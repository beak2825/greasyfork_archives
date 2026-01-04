// ==UserScript==
// @name            Download on QNAP NAS
// @description     Download links or magnet links on QNAP NAS via Download Station, you can input url manually or right-click on the link and then hit on "Download from Last Link"
// @version         1.03
// @match           *://*/*
// @run-at          document-end
// @grant           none
// @copyright       2024, MSerj
// @license         MIT
//
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_xmlhttpRequest

// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAACu1BMVEUAAABAvD9AvD9AvD8/uz4rrytCvUFCvUEtsC1AvD9CvUEssCwtsC0/uz5CvUEsrytBvEBBvUEtsC0sryxBvUBBvUAssCwssCxCvUEsrytCvUFCvUFBvEBBvEArrytAvD9AvD8tsC0tsC1AvD8tsC1AvD8usS4usS4/uz4/uz4usS4tsC0usS4usS4rrysusS5CvUEtsC0rrysrrystsC1CvUErrysrrytCvUFBvUFBvEAssCwssCwssCwsrywssCwssCxBvUBBvUAsrywsrywsryxBvEAsrytBvEBBvEArrytBvEBCvUFCvUErrysrrytCvUFCvUErrytCvUFCvUErrysrrytAvD8/uz5axVmM1ot+0X4+uz2C04H////d890+uj2C0oE9uj2B0oE9ujw8ujw8uTuB0oDd89w7uTuA0oDc89w7uTo6uDqA0YDc8tw6uDmA0X85uDl/0X85uDh/0X45tzh/0H44tzhRwFHa8drk9eTu+e76/fqX2Zc4tzdUwVP+//6x47Gh3aDp9+lNv0w3tzev4q/v+e9WwlY3tjc5tzm857zz+/NhxWE3tjY8uDvK7Mn5/flryWo/uT7U79T9/v10zHM2tjZEu0Q2tjVMvkvj9eOO1o42tTVSv1Ls+Oye2541tTVZwlms4axixmL3/Pe35bc1tTRvym7E6sQ6tzk0tTR8z3zR7tE8uDyI04jb8ttAuUA0tDSU2JTi9OJGukY0tDOk3aRPvk4ztDOz47Pw+fBXwVfB6MFfxF8ztDI4tjfK7MppyGg/uD7T79N2zXYyszJDuUPe896E0YRJu0n8/vyL1IsyszE1tDRawllCuUExszExsjAwsjCR1pGF0oXz+vPn9ucwsi8vsi8vsS99zn2C0IJ4zXgusS4tsC0ssCwsrywsrysrrytCvUFBvUBBvEBBvUENG05pAAAAV3RSTlMAAjd4rNLt+ByH4hOV+VbrVwSXCrMEsZhXWRPr7RWXHvqHAuM3eXis0+z5+ezTrHl4ODcC44cc+ZWXE+xYWpiZBrEKtrQFmFjrWRSX+RyI5AI3eazS7vpT2p0DAAADLklEQVR4XrTQwQpAQBhF4bsypRJFafAONgq7UYlQNN5/N3gMUURYmf9b3d2pi5t+iOVoMPUDM0YZDz2+dImpNDGTDm942iqN2pTjwQqUZoGPOydbCGQOLgp3IuEWOHliIiI8HMqZTHk07JlQjV1eUUbCCJtm28SHrbTNsQ2AIABE0Q/SUDADJMQEJjqF/fewtqO5t8CrTVatAllmGUKXWQ9E2UVu2V2kxy4x/Mlg+pNJ8SeF8+Bdf/t44eNuTq0AgEEAhjJo73v/CapLTRSC+LwfcDG9ZXzaIAVXNYJPG6ThukbwKQP3Ifh0hEzch+BTFm4r5ODTD3J5m5McAGEgBoLzXfY9EAK8nSPIkaI+Td/tsgpXC9LgpbW4DMFLH6TD9YIMeOmDjLhJEbz0QWbcoghe2orbFMFLC7hdEbz0QY5S8UxflyB3+vWUbuxlbE6yCAaAIAz3SR2BrY0XiFkEiBmCgAAxg6vZeQjd9e+rPoUrGPKAhbkbHlEioKFGWSTG5o9DRiLJvlCKL50BDC3Ln5AulMuLRqGo84mIXioLhlHRhagqVvOxRsgrPlBdrtHkkJZ8QG2gTve/0QP2ZCL1tX/GAJljiDm0fhujFISMsSaBX8Z0Bo3JBpsbbmOxxLYwYq9cxnoDTsmB234Zuz26pAPe8cNQT/CQznjO5c243vChC+Ey7y/DepzxntzNxw2AMBAF0a10O+FAE9Rjosk50wxCXBeJjyUfeAXMkEL4Ad+cUAFIQaKYL16iEKQxacbMbq4hpEFFxmWlMVSjmrarQdRb8KPJYAGNFjxMqumr+f1k4a9WabKJDCZCjXaRwUSo2ZkcIoPJSdscmwAMAlAQvdIilRsooqBKCLj/JJpklCxgGuHfAPcWtx9kzN3uFZIfeZmqRypNjzSSHkmceiRyvfICvquN7sGpEQeYojWKATi0iP3GAALc1g9pCKy5GcDAhpaW2DJAgTjt7LBngAEHMVrZIebAAAfCzo9oAlyEGZCAqx0t7LBzZUAF7vyPqQz4JRkwgJec+RMqAnM5LwZswMzPn1pW+PuZMeACxkZBeqyhYZQYHxbKqhdkZMyADAAP0l3lyubY0gAAAABJRU5ErkJggg==

// @namespace       https://greasyfork.org/en/users/1321619-mserj
// @downloadURL https://update.greasyfork.org/scripts/515906/Download%20on%20QNAP%20NAS.user.js
// @updateURL https://update.greasyfork.org/scripts/515906/Download%20on%20QNAP%20NAS.meta.js
// ==/UserScript==

// Set up the NAS configuration prompts
async function setUpNasSettings() {
  const nasIP = prompt("Enter your NAS IP address:", GM_getValue("nasIP", ""));
  const nasPort = prompt("Enter your NAS port (default 8080):", GM_getValue("nasPort", "8080"));
  const nasProtocol = prompt("Connection protocol (default https):", GM_getValue("nasProtocol", "https"));
  const username = prompt("Enter your NAS username:", GM_getValue("username", ""));
  const password = prompt("Enter your NAS password:", GM_getValue("password", ""));
  const tempLocation = prompt("Location of Temporary Files:", GM_getValue("tempLocation", ""));
  const moveLocation = prompt("Move the completed downloads to:", GM_getValue("moveLocation", ""));
  const moveLocationAlternative = prompt("Move the completed downloads to (alternative):", GM_getValue("moveLocationAlternative", ""));
  
  GM_setValue("nasIP", nasIP);
  GM_setValue("nasPort", nasPort);
  GM_setValue("nasProtocol", nasProtocol);
  GM_setValue("username", username);
  GM_setValue("password", password);
  GM_setValue("tempLocation", tempLocation);
  GM_setValue("moveLocation", moveLocation);
  GM_setValue("moveLocationAlternative", moveLocationAlternative);
  alert("NAS settings saved.");
}

// Function to send download link to QNAP Download Station
function sendToNas(downloadUrl, useAlternativeLocation = false) {
  const nasIP = GM_getValue("nasIP");
  const nasPort = GM_getValue("nasPort");
  const nasProtocol = GM_getValue("nasProtocol");
  const username = GM_getValue("username");
  const password = GM_getValue("password");
  const tempLocation = GM_getValue("tempLocation");
  const moveLocation = GM_getValue("moveLocation");
  const moveLocationAlternative = GM_getValue("moveLocationAlternative");
  
  if (!nasIP || !nasPort || !username || !password) {
    alert("Please configure your NAS settings first.");
    setUpNasSettings();
    return;
  }
  
  // Authenticate with QNAP to get a session token
  GM_xmlhttpRequest({
    method: "POST",
    url: `${nasProtocol}://${nasIP}:${nasPort}/downloadstation/V5/Misc/Login`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: `user=${username}&pass=${btoa(password)}`,
    onload: function({response}) {
      const sid = JSON.parse(response || {})?.sid
      if (sid) {
        // Start the download task using the acquired session token (sid)
        GM_xmlhttpRequest({
          method: "GET",
          url: `${nasProtocol}://${nasIP}:${nasPort}/downloadstation/V5/Task/AddUrl?sid=${sid}&url=${encodeURIComponent(downloadUrl)}&temp=${tempLocation}&move=${useAlternativeLocation ? moveLocationAlternative : moveLocation}`,
          onload: function({response}) {
            const taskData = JSON.parse(response || {});
            if (taskData && taskData.error === 0) {
              alert("Download started on NAS!");
            } else {
              alert("Failed to start download. Please check the link and NAS settings.");
            }
          },
          onerror: function() {
            alert("Error adding the download task to NAS.");
          }
        });
      } else {
        alert("Failed to authenticate with NAS. Please check your credentials.");
      }
    },
    onerror: function() {
      alert("Error connecting to NAS for authentication.");
    }
  });
}

// Add event listener to detect right-click on links
document.addEventListener("contextmenu", (event) => {
  const target = event.target.closest("a");
  if (target && target.href) {
    // If right-clicked target is a link, create the menu command for "Download on NAS"
    GM_registerMenuCommand("Download from Last Link", () => {
      sendToNas(target.href);
    });
    GM_registerMenuCommand("Download from Last Link (alternative)", () => {
      sendToNas(target.href, true);
    });
  }
});

// Menu command to configure NAS settings
GM_registerMenuCommand("Configure NAS Settings", setUpNasSettings);

// Menu command to manually enter a link for download
GM_registerMenuCommand("Download from Manual Link", () => {
  const manualLink = prompt("Enter the URL or magnet link to download:");
  const useAlternativeLocation = prompt("Use alternative location? (y/n)");
  if (manualLink) {
    sendToNas(manualLink, !(['n', 'no', ''].some(answer => useAlternativeLocation ? answer === useAlternativeLocation?.toLowerCase() : true)));
  } else {
    alert("No link provided.");
  }
});
