// ==UserScript==
// @name         GGn Copy Links From Page
// @namespace    https://greasyfork.org
// @version      0.3
// @license      MIT
// @description  Copy Download links from https://gazellegames.net/torrents.php to clipboard based on a max file size limit (in MB) you specify. Also, calculates the total size of all torrents on the page.
// @author       yoshijulas
// @match        https://gazellegames.net/torrents.php*
// @match        https://gazellegames.net/better.php*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/523991/GGn%20Copy%20Links%20From%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/523991/GGn%20Copy%20Links%20From%20Page.meta.js
// ==/UserScript==

(() => {
	const SIZE_REGEX = /(\d+\.\d+|\d+)\s?(KB|MB|GB)/;

	const toMB = (value, unit) => {
		if (unit === "GB") return value * 1024;
		if (unit === "KB") return value / 1024;
		return value;
	};

	// Check if pages exists
	const torrentbrowse = document.querySelector("div#torrentbrowse");
	const better = document.querySelector("a[href='better.php']");

	if (!torrentbrowse && !better) return;

	$(document).ready(() => {
		const $linkBox = $("#content .linkbox");
		$linkBox.append(`
      <br>
      <input type="button" style="border: 1px solid #ccc; border-radius: 4px; " id="copyDownloadLinks" value="Copy Links">
      <br>
      <input type="text" id="maxFileSize" style="text-align: center" placeholder="Max file size (MB)">
      <br>
      <span id="totalSize" style="color: white;"></span>
    `);

		const torrentData = [];

		const processTorrentBrowseRows = () => {
			const rows = document.querySelectorAll("tr.group_torrent");

			for (const row of rows) {
				const torrentLink = row.querySelector("td span a");
				const sizeElements = row.querySelectorAll("td.nobr");

				for (const sizeElement of sizeElements) {
					// Match size format (e.g., 42.50 KB, 1.2 MB, etc.)
					const match = sizeElement.innerHTML.match(SIZE_REGEX);

					if (torrentLink && match) {
						const size = toMB(Number.parseFloat(match[1]), match[2]);
						torrentData.push({ link: torrentLink, size });
					}
				}
			}
		};

		const processBetterRows = () => {
			const rows = document.querySelectorAll("tr.torrent_row");

			for (const row of rows) {
				const torrentLink = row.querySelector(
					"span.torrent_links_block a.brackets",
				);
				// Match size format (e.g., 42.50 KB, 1.2 MB, etc.)
				const sizeElement = row.innerHTML.match(SIZE_REGEX);

				if (torrentLink && sizeElement) {
					const size = toMB(Number.parseFloat(sizeElement[1]), sizeElement[2]);
					torrentData.push({ link: torrentLink.href, size });
				}
			}
		};

		// calculate depending on which page we are on
		if (torrentbrowse) {
			processTorrentBrowseRows();
		} else if (better) {
			processBetterRows();
		}

		const calculateTotalSize = (maxSizeMB = Number.POSITIVE_INFINITY) =>
			torrentData.reduce(
				(total, { size }) => (size <= maxSizeMB ? total + size : total),
				0,
			);

		const updateTotalSizeDisplay = (maxSizeMB) => {
			const total = calculateTotalSize(maxSizeMB);
			$("#totalSize").text(
				`Total size: ${total.toFixed(2)} MB${Number.isFinite(maxSizeMB) ? ` (limit: ${maxSizeMB} MB)` : ""}`,
			);
		};

		// Initial display
		updateTotalSizeDisplay();

		// Update total size on input
		$("#maxFileSize").on("input", (event) => {
			const maxSizeMB = Number.parseFloat(event.target.value);
			updateTotalSizeDisplay(
				Number.isNaN(maxSizeMB) ? Number.POSITIVE_INFINITY : maxSizeMB,
			);
		});

		$("#copyDownloadLinks").click(() => {
			let maxSizeMB = Number.parseFloat($("#maxFileSize").val());
			if (Number.isNaN(maxSizeMB)) {
				maxSizeMB = Number.POSITIVE_INFINITY;
			}

			const filteredLinks = torrentData
				.filter(({ size }) => size <= maxSizeMB)
				.map(({ link }) => link);

			if (filteredLinks.length === 0) {
				alert("No links match the specified size limit.");
				return;
			}

			navigator.clipboard
				.writeText(filteredLinks.join("\n"))
				.then(() => {
					alert(`Copied ${filteredLinks.length} links to clipboard.`);
				})
				.catch(() => {
					alert("Failed to copy links to clipboard.");
				});
		});
	});
})();