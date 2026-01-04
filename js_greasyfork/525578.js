// ==UserScript==
// @name         PTP - HDR format info table
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Look at mediainfo and output HDR formats used
// @author       darisk
// @match        https://passthepopcorn.me/torrents.php?id*
// @icon         https://passthepopcorn.me/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525578/PTP%20-%20HDR%20format%20info%20table.user.js
// @updateURL https://update.greasyfork.org/scripts/525578/PTP%20-%20HDR%20format%20info%20table.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createHDRSection(label, value) {
        const hdrSection = document.createElement("td");

        const hdrTable = document.createElement("table");
        hdrTable.classList.add("nobr", "mediainfo__section"); // Match existing style

        const caption = document.createElement("caption");
        caption.classList.add("mediainfo__section__caption");
        caption.textContent = "HDR"; // Section title

        const tbody = document.createElement("tbody");
        const row = document.createElement("tr");

        const labelCell = document.createElement("td");
        const valueCell = document.createElement("td");

        labelCell.textContent = `${label}:`;
        valueCell.textContent = value;

        row.appendChild(labelCell);
        row.appendChild(valueCell);
        tbody.appendChild(row);

        hdrTable.appendChild(caption);
        hdrTable.appendChild(tbody);
        hdrSection.appendChild(hdrTable);

        return hdrSection;
    }

    function addHDRToVideoSection(torrentInfoRow, label, value) {
        const mediaInfoTable = torrentInfoRow.querySelector("table.mediainfo--in-release-description");
        if (!mediaInfoTable) {
            console.error("No MediaInfo table found in torrent info row.");
            return;
        }

        // Locate the "Video" section
        const videoSection = [...mediaInfoTable.querySelectorAll("table.mediainfo__section")]
        .find(section => section.querySelector("caption")?.textContent.trim() === "Video");

        if (!videoSection) {
            console.error("No Video section found in MediaInfo.");
            return;
        }

        const tbody = videoSection.querySelector("tbody");

        // Check if HDR info is already present
        if ([...tbody.querySelectorAll("tr td:first-child")].some(td => td.textContent.includes(label))) {
            console.log("HDR info already exists.");
            return;
        }

        // Create new row for HDR
        const newRow = document.createElement("tr");

        const labelCell = document.createElement("td");
        const valueCell = document.createElement("td");

        labelCell.textContent = `${label}:`;
        valueCell.textContent = value;

        newRow.appendChild(labelCell);
        newRow.appendChild(valueCell);
        tbody.appendChild(newRow);

        console.log(`Added ${label}: ${value} to Video section.`);
    }



    function extractHDRFormat(content, torrentInfoRow) {
        const blockquotes = content.querySelectorAll("blockquote.spoiler.hidden");
        if (!blockquotes.length) {
            console.log("No blockquote elements found inside bbcode-table-guard.");
            return;
        }

        let hdrLine = null;

        for (const blockquote of blockquotes) {
            const lines = blockquote.innerText.split("\n").map(line => line.trim());
            hdrLine = lines.find(line => /^HDR\s*format/i.test(line));
            if (hdrLine) break;
        }

        if (hdrLine) {
            console.log("Found HDR Line:", hdrLine);
            const normalizedLine = hdrLine.replace(/\s+/g, " ").trim();

            const hdrProfiles = [];

            const dolbyVisionMatch = normalizedLine.match(/Dolby\s*Vision.*?dvhe\.(\d{2})\.(\d{2})/);
            if (dolbyVisionMatch) {
                const profile = dolbyVisionMatch[1].replace(/^0/, ""); // Remove leading zero
                addHDRToVideoSection(torrentInfoRow, "Dolby Vision", `DV P${profile}`);
            }

            if (normalizedLine.includes("HDR10+")) hdrProfiles.push("HDR10+");
            if (normalizedLine.includes("HDR10")) hdrProfiles.push("HDR10");

            if (hdrProfiles.length > 0) {
                addHDRToVideoSection(torrentInfoRow, "HDR profile", hdrProfiles.join(", "));
            }

        } else {
            console.log("No HDR-related line found, moving to next check...");

            let commercialName = null;
            for (const blockquote of blockquotes) {
                const lines = blockquote.innerText.split("\n").map(line => line.trim());
                commercialName = lines.find(line => /Commercial\s*name/i.test(line));
                if (commercialName) break;
            }

            if (commercialName) {
                console.log("Found Commercial Name:", commercialName);
                const cleanCommercialName = commercialName.replace(/Commercial\s*name\s*[:\-]?\s*/i, "").trim();

                const validHdrFormats = ["HDR10", "HDR10+", "Dolby Vision", "HLG"];
                const isValidHdrFormat = validHdrFormats.some(format => cleanCommercialName.includes(format));

                if (isValidHdrFormat) {
                    addHDRToVideoSection(torrentInfoRow, "HDR Profile", cleanCommercialName);
                    return; // Stop further processing since we already found a valid HDR profile
                }
                else {
                    console.log("Commercial Name does not match valid HDR formats");
                }
            } else {
                console.log("No Commercial Name found, analyzing Transfer Characteristics...");
            }

            const normalizedLines = Array.from(blockquotes).map(blockquote => blockquote.innerText.trim()).join(" ");

            const colorPrimariesMatch = normalizedLines.match(/Color\s*primaries\s*[:\-]?\s*(\w+\.\d+)/i) || normalizedLines.match(/colorprim\s*=\s*(\d+)/i);
            const transferCharacteristicsMatch = normalizedLines.match(/Transfer characteristics\s*:\s*(.*)/i) || normalizedLines.match(/transfer\s*=\s*(\d+)/i);
            const transferCharacteristicsOriginalMatch = normalizedLines.match(/transfer_characteristics_Original\s*:\s*(.*)/i);

            if (colorPrimariesMatch) {
                console.log("Color Primaries:", colorPrimariesMatch[1]);
            } else {
                console.log("No Color Primaries found");
            }

            if (transferCharacteristicsMatch) {
                console.log("Transfer Characteristics:", transferCharacteristicsMatch[1]);
            } else {
                console.log("No Transfer Characteristics found");
            }

            if (colorPrimariesMatch && transferCharacteristicsMatch) {
                const colorPrimariesText = colorPrimariesMatch[1].trim();
                const transferCharacteristicsText = transferCharacteristicsMatch[1].trim();

                // Match for HDR10
                if (colorPrimariesText.includes("BT.2020") && (transferCharacteristicsText.includes("PQ") || transferCharacteristicsText.includes("SMPTE ST 2084"))) {
                    addHDRToVideoSection(torrentInfoRow, "HDR profile", "HDR10");
                }
                // Match for HLG
                else if (
                    (transferCharacteristicsMatch && transferCharacteristicsMatch[1].includes("HLG")) ||
                    (transferCharacteristicsOriginalMatch && transferCharacteristicsOriginalMatch[1].includes("HLG"))
                ) {
                    console.log("Detected HLG HDR format.");
                    addHDRToVideoSection(torrentInfoRow, "HDR profile", "HLG");
                }

                // Additional matching for transfer characteristics and color primaries
                if (transferCharacteristicsMatch && transferCharacteristicsMatch[1].includes("16") && (colorPrimariesMatch && (colorPrimariesMatch[1].includes("9") || colorPrimariesMatch[1].includes("BT.2020")))) {
                    console.log("Detected HDR10 format based on transfer=16 and colorprim=9 or BT.2020.");
                    addHDRToVideoSection(torrentInfoRow, "HDR profile", "HDR10");
                }

            }}}


    function extractMediaInfo(torrentInfoRow) {
        const bbcodeTableGuard = torrentInfoRow.querySelector(".bbcode-table-guard");
        if (!bbcodeTableGuard) return console.error("No bbcode-table-guard found in the torrent info row.");

        const isContentLoaded = bbcodeTableGuard.querySelector("blockquote");
        if (isContentLoaded) {
            extractHDRFormat(bbcodeTableGuard, torrentInfoRow);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList" && bbcodeTableGuard.innerHTML.trim() !== "") {
                    const mediaInfoBlockquote = bbcodeTableGuard.querySelector("blockquote");
                    if (mediaInfoBlockquote) extractHDRFormat(bbcodeTableGuard, torrentInfoRow);
                    observer.disconnect();
                    break;
                }
            }
        });

        observer.observe(bbcodeTableGuard, { childList: true, subtree: true });
    }

    window.addEventListener("load", () => {
        document.querySelectorAll(".group_torrent").forEach((groupTorrentRow) => {
            const torrentId = groupTorrentRow.id.replace("group_torrent_header_", "");
            const torrentInfoRow = document.querySelector(`#torrent_${torrentId}`);

            if (torrentInfoRow && !torrentInfoRow.classList.contains("hidden")) {
                extractMediaInfo(torrentInfoRow);
            }
            groupTorrentRow.addEventListener("click", () => {
                if (torrentInfoRow && !torrentInfoRow.classList.contains("hidden")) {
                    extractMediaInfo(torrentInfoRow);
                }
            });
        });
    });


})();
