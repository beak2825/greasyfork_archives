// ==UserScript==
// @name         BTN MediaInfo Beautifier
// @namespace    http://tampermonkey.net/
// @version      2025-02-17
// @description  Gives a torrent mediaInfo summary, which can be switched to full. Alongside a copy button for the full mediaInfo.
// @author       BibliophilicOtter
// @match        https://broadcasthe.net/torrents.php?id=*
// @icon         https://broadcasthe.net/favicon.ico
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527180/BTN%20MediaInfo%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/527180/BTN%20MediaInfo%20Beautifier.meta.js
// ==/UserScript==

// To change the default view to full, find and change the line
// blockquote.dataset.view = "summary";
// into
// blockquote.dataset.view = "full";
(function() {
    'use strict';
    let allblockquotes = document.querySelectorAll("blockquote");
    for (let blockquote of allblockquotes) {
        if (blockquote && blockquote.textContent.includes("Unique ID")) {
            let originalMediaInfo = blockquote.innerHTML.trim(); // Save original formatting
            let mediaInfo = blockquote.textContent.trim();
            blockquote.style.display = "block"; // Default: Show summary as a table

            // Create a button to show/hide the blockquote
            let toggleMediaInfoButton = document.createElement("button");
            toggleMediaInfoButton.textContent = "Show Full";
            toggleMediaInfoButton.className = "button";
            toggleMediaInfoButton.name = "toggleMediaInfoButton";

            // Create and show the summary table by default
            let table = convertMediaInfoToTable(mediaInfo);
            blockquote.innerHTML = ""; // Clear old text
            blockquote.appendChild(table);

            // Add click event to toggle between table and full text
            toggleMediaInfoButton.addEventListener("click", function () {
                if (blockquote.dataset.view === "summary") {
                    // Restore original MediaInfo exactly as it was
                    blockquote.innerHTML = originalMediaInfo;
                    blockquote.dataset.view = "full";
                    toggleMediaInfoButton.textContent = "Show Summary";
                } else {
                    // Switch back to summary table
                    blockquote.innerHTML = ""; // Clear current content
                    blockquote.appendChild(convertMediaInfoToTable(mediaInfo));
                    blockquote.dataset.view = "summary";
                    toggleMediaInfoButton.textContent = "Show Full";
                }
            });

            // Create a button to copy MediaInfo to clipboard
            let copyMediaInfoButton = document.createElement("button");
            copyMediaInfoButton.textContent = "Copy MediaInfo";
            copyMediaInfoButton.className = "button";
            copyMediaInfoButton.name = "copyMediaInfoButton";

            copyMediaInfoButton.addEventListener("click", function () {
                let checkmark = document.createElement("span");
                checkmark.textContent = " ✅";
                GM_setClipboard(mediaInfo);

                // Add the checkmark next to the button
                copyMediaInfoButton.appendChild(checkmark);

                // Remove checkmark after 1 second
                setTimeout(() => {
                    checkmark.remove();
                }, 1000);
            });

            // Insert buttons before the blockquote
            blockquote.parentNode.insertBefore(toggleMediaInfoButton, blockquote);
            blockquote.parentNode.insertBefore(copyMediaInfoButton, blockquote);
            blockquote.dataset.view = "summary"; // Set default view
        }
    }



    /**
     * Parses MediaInfo text and converts it into an HTML table
     */
   function convertMediaInfoToTable(mediaInfoText) {
       let general = {};
       let video = {};
       let audioTracks = [];
       let currentSection = null;

       let lines = mediaInfoText.split("\n");
       for (let line of lines) {
           line = line.trim();
           if (!line) continue;

           if (line.startsWith("General")) {
               currentSection = "general";
               continue;
           } else if (line.startsWith("Video")) {
               currentSection = "video";
               continue;
           } else if (line.startsWith("Audio")) {
               currentSection = "audio";
               audioTracks.push({});
               continue;
           } else if (line.startsWith("Text")) {
               break;
           }

           let parts = line.split(":");
           if (parts.length < 2) continue;
           let key = parts[0].trim();
           let value = parts.slice(1).join(":").trim();

           if (currentSection === "general") {
               if (["Format", "Duration", "File size"].includes(key)) {
                   general[key] = value;
               }
           } else if (currentSection === "video") {
               if (key == "Format"){
                   switch (value) {
                       case "AVC":
                           video[key] = "H.264";
                           break;
                       case "HVEC":
                           video[key] = "x265";
                           break;
                       default:
                           video[key] = value;
                   }
               } else if (key == "Width" || key == "Height") {
                   video[key] = parseInt(value.replace(/\D/g, ""), 10);
               } else if (key == "Frame rate") {
                   video[key] = value.replace(/\s*\(.*?\)\s*/g, " ");
               } else if (["Display aspect ratio", "Bit rate"].includes(key)) {
                   video[key] = value;
               }
           } else if (currentSection === "audio") {
               let lastAudio = audioTracks[audioTracks.length - 1];
               if (key == "Channel(s)") {
                   let channelCount = parseInt(value.replace(/\D/g, ""), 10);
                   switch (channelCount) {
                       case 3:
                           lastAudio[key] = "2.1";
                           break;
                       case 4:
                           lastAudio[key] = "3.1";
                           break;
                       case 6:
                           lastAudio[key] = "5.1";
                           break;
                       case 8:
                           lastAudio[key] = "7.1";
                           break;
                       default:
                           lastAudio[key] = channelCount;
                   }
               } else if (["Language", "Channel(s)", "Format", "Bit rate"].includes(key)) {
                   lastAudio[key] = value;
               }
           }
       }

       function createInnerTable(data) {
           let innerTable = `<table style="width: 100%; border-collapse: collapse; border: none; border-spacing: 0px; box-shadow: none;">`;
           for (let key in data) {
               innerTable += `
            <tr style="border: none;">
                <td style="text-align: left; font-weight: bold; padding-right: 5px; border: none; box-shadow: none;">${key}:</td>
                <td style="text-align: left; border: none; box-shadow: none;">${data[key]}</td>
            </tr>
        `;
           }
           innerTable += `</table>`;
           return innerTable;
       }

       function createInnerTableAudio(data) {
           let innerTable = `<table style="width: 100%; border-collapse: collapse; border: none; border-spacing: 0px; box-shadow: none;">`;
           for (let key in data) {
               innerTable += `
            <tr style="border: none;">
                <td style="text-align: left; border: none; box-shadow: none;">${data[key]}</td>
            </tr>
        `;
           }
           innerTable += `</table>`;
           return innerTable;
       }

       // **Format multiple audio tracks for the table**
       let audioData = {};
       audioTracks.forEach((track, index) => {
           audioData[`Track ${index + 1}`] = `${track.Language || "N/A"} ${track["Channel(s)"] || "N/A"} ${track.Format || "N/A"} ${track["Bit rate"] || "N/A"}`;
       });

       let table = document.createElement("table");
       table.style.width = "100%";
       table.style.borderCollapse = "collapse";
       table.style.marginTop = "10px";
       table.style.border = "none";
       table.style.borderSpacing = "0px";

       let thead = document.createElement("thead");
       let headerRow = document.createElement("tr");

       ["General", "Video", "Audio"].forEach((heading) => {
           let th = document.createElement("th");
           th.textContent = heading;
           th.style.padding = "5px";
           th.style.border = "none";
           th.style.textAlign = "center";
           headerRow.appendChild(th);
       });

       thead.appendChild(headerRow);
       table.appendChild(thead);

       let tbody = document.createElement("tbody");

       let row = document.createElement("tr");
       row.style.border = "none";

       let generalTd = document.createElement("td");
       generalTd.style.border = "none";
       generalTd.innerHTML = createInnerTable({
           "Container": general.Format || "N/A",
           "Runtime": general.Duration || "N/A",
           "Size": general["File size"] || "N/A"
       });
       row.appendChild(generalTd);

       let videoTd = document.createElement("td");
       videoTd.style.border = "none";
       videoTd.innerHTML = createInnerTable({
           "Codec": video.Format || "N/A",
           "Resolution": `${video.Width || "N/A"}x${video.Height || "N/A"}`,
           "Aspect Ratio": video["Display aspect ratio"] || "N/A",
           "Frame Rate": video["Frame rate"] || "N/A",
           "Bitrate": video["Bit rate"] || "N/A"
       });
       row.appendChild(videoTd);

       // **Audio Column (All tracks combined in one cell)**
       let audioTd = document.createElement("td");
       audioTd.style.border = "none";
       audioTd.style.padding = "5px";
       audioTd.innerHTML = createInnerTableAudio(audioData);
       row.appendChild(audioTd);

       tbody.appendChild(row);

       table.appendChild(tbody);
       return table;
   }
})();