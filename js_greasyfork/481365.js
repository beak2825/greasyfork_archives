// ==UserScript==
// @name         HoldGrip Tweaks
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  tweaks for holdgrip
// @author       Californ1a
// @match        https://holdgrip.seekr.pw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seekr.pw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481365/HoldGrip%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/481365/HoldGrip%20Tweaks.meta.js
// ==/UserScript==

(function() {
	const css = `
.custom-header {
  cursor: pointer;
}
.custom-header.custom-down::after {
  content: '▾';
}
.custom-header.custom-up::after {
  content: '▴';
}
.custom-header:hover {
  color: #eee;
}
.custom-header:active {
  color: #fff;
}
	`.split("\n").filter((e) => e !== "").join("\n");
	if (typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	} else if (typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	} else if (typeof addStyle != "undefined") {
		addStyle(css);
	} else {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			heads[0].appendChild(node);
		} else {
			// no head yet, stick it whereever
			document.documentElement.appendChild(node);
		}
	}
})();

function compareRows(rows1, rows2) {
	if (rows1.length !== rows2.length) return false;
	for (let i = 0; i < rows1.length; i++) {
		if (!rows1[i].isEqualNode(rows2[i])) return false;
	}
	return true;
}

function parseDuration(durationString) {
  // Split the string into parts using ':' as the separator
  const parts = durationString.split(':');

  // Initialize variables for hours, minutes, seconds, and hundredths of a second
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let hundredths = 0;

  if (parts.length === 1) {
    // If there's only one part, it represents seconds and hundredths
    const secondsAndHundredths = parts[0].split('.');
    if (secondsAndHundredths.length === 2) {
      seconds = parseInt(secondsAndHundredths[0], 10);
      hundredths = parseInt(secondsAndHundredths[1], 10) || 0;
    } else {
      throw new Error('Invalid duration format');
    }
  } else if (parts.length === 2) {
    // If there are two parts, they represent minutes and seconds
    minutes = parseInt(parts[0], 10);
    const secondsAndHundredths = parts[1].split('.');
    if (secondsAndHundredths.length === 2) {
      seconds = parseInt(secondsAndHundredths[0], 10);
      hundredths = parseInt(secondsAndHundredths[1], 10) || 0;
    } else {
      throw new Error('Invalid duration format');
    }
  } else if (parts.length === 3) {
    // If there are three parts, they represent hours, minutes, and seconds
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
    const secondsAndHundredths = parts[2].split('.');
    if (secondsAndHundredths.length === 2) {
      seconds = parseInt(secondsAndHundredths[0], 10);
      hundredths = parseInt(secondsAndHundredths[1], 10) || 0;
    } else {
      throw new Error('Invalid duration format');
    }
  } else {
    throw new Error('Invalid duration format');
  }

  // Calculate the total duration in milliseconds
  const totalMilliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000) + hundredths * 10;

  return totalMilliseconds;
}

function sortRows(headers, rows, i) {
	for (const header of headers) {
		header.classList.remove("custom-down", "custom-up");
	}
	let customClass = "custom-down";
	const rowsCopy = [...rows];
	rows.sort((a, b) => {
		const aCompare = a.children[i].innerText;
		const bCompare = b.children[i].innerText;
		if (i === 0) {
			return (aCompare < bCompare) ? -1 : (aCompare > bCompare) ? 1 : 0;
		}
		if (i === 3) {
			return parseDuration(aCompare) - parseDuration(bCompare);
		}
		return parseInt(aCompare.replace(",", ""), 10) - parseInt(bCompare.replace(",", ""), 10);
	});
	if (compareRows(rows, rowsCopy)) {
		rows = rows.reverse();
		customClass = "custom-up";
	}
	headers[i].classList.add(customClass);
	const tbody = rows[0].parentElement;
	for (const row of rows) {
		row.remove();
		tbody.appendChild(row);
	}
}

(function() {
	const h = document.location.href;
	const pageType = (h.match(/\/player\/\d+\//)) ? "player" : (h.match(/\/tracks\/(sprint|challenge|stunt)\/\d+$/)) ? "track" : null;
	if (!pageType) return;
	if (pageType === "player") {
		const statsTable = document.querySelector(".stats:not(.small)");
		const headerRow = statsTable.children[0].children[0];
		const statsTableRows = Array.from(statsTable.children[0].children).slice(1);
		for (let i = 0; i < headerRow.children.length; i++) {
			headerRow.children[i].addEventListener("click", () => sortRows(headerRow.children, statsTableRows, i));
			headerRow.children[i].classList.add("custom-header");
			if (headerRow.children[i].innerText === "Track weight") {
				headerRow.children[i].classList.add("custom-up");
			}
		}
	}
})();