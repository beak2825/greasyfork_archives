// ==UserScript==
// @name        AniDB — Combine Eps and Seen in MyList
// @namespace   AquaWolfGuy
// @description Shows seen, collected, and total episode count in one column instead of two, and highlights new episodes.
// @icon        https://static.anidb.net/css/icons/touch/apple-touch-icon.png
// @author      AquaWolfGuy
// @copyright   2019, AquaWolfGuy
// @license     GPL-3.0-only
// @match       https://anidb.net/*/mylist*
// @version     1.0.0
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/390391/AniDB%20%E2%80%94%20Combine%20Eps%20and%20Seen%20in%20MyList.user.js
// @updateURL https://update.greasyfork.org/scripts/390391/AniDB%20%E2%80%94%20Combine%20Eps%20and%20Seen%20in%20MyList.meta.js
// ==/UserScript==

const matchRe = /^(.*?)\/(.*?)(?:\+(.*))?$/;

function handleRow(row) {
	if (row.querySelector("tr.eps_seen") !== null) {
		return;
	}
	const seenCell = row.querySelector("td.seen");
	const epsCell  = row.querySelector("td.eps");
	let [, seenSeen, seenHave, seenSpecial] = seenCell.textContent.trim().match(matchRe);
	let [, epsHave,  epsTotal, epsSpecial ] = epsCell .textContent.trim().match(matchRe);
	if (seenHave !== epsHave) {
		console.error("Inconsistent entry. %s !== %s.", seenHave, epsHave, row);
		return;
	}
	if (seenSeen !== seenHave) {
		if (seenSeen < seenHave-1) {
			seenSeen = "<b>" + seenSeen + "</b>";
		}
		seenHave = epsHave = "<b>" + seenHave + "</b>";
	}
	if (seenSpecial !== epsSpecial) {
		if (seenSpecial && seenSpecial < epsSpecial-1) {
			seenSpecial = "<b>" + seenSpecial + "</b>";
		}
		if (epsSpecial) {
			epsSpecial  = "<b>" + epsSpecial  + "</b>";
		}
	}
	const seen = seenSeen + ((seenSpecial) ? ("+" + seenSpecial) : "");
	const have = seenHave + ((epsSpecial ) ? ("+" + epsSpecial ) : "");
	const total = epsTotal;
	const newCell = document.createElement("TD");
	newCell.classList = "stats eps_seen"
	newCell.innerHTML = seen + " / " + have + " / " + total;
	epsCell.style.display = "none";
	if (seenCell.nextElementSibling === epsCell || epsCell.nextElementSibling === seenCell) {
		newCell.colSpan = 2;
		seenCell.style.display = "none";
	} else {
		seenCell.innerText = "";
	}
	row.insertBefore(newCell, seenCell);
}

function handleMutation(mutationList) {
	for (const mutationRecord of mutationList) {
		console.log(mutationRecord);
		for (const row of mutationRecord.addedNodes) {
			try {
				handleRow(row);
			} catch (error) {
				console.error(error);
			}
		}
	}
}

const mylist = document.querySelector(".mylist_list #animelist tbody");
if (mylist !== null) {
	new MutationObserver(handleMutation).observe(mylist, {childList: true});
	for (const row of mylist.children) {
		try {
			handleRow(row);
		} catch (error) {
			console.error(error);
		}
	}
}
