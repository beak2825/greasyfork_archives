// ==UserScript==
// @name         Gazelle Trackers: Highlight changes in upload snatches
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.00.0
// @match        https://*/torrents.php?*
// @run-at       document-end
// @author       Anakunda
// @copyright    2021, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @grant        GM_getValue
// @grant        GM_setValue
// @description  no description at all
// @downloadURL https://update.greasyfork.org/scripts/426974/Gazelle%20Trackers%3A%20Highlight%20changes%20in%20upload%20snatches.user.js
// @updateURL https://update.greasyfork.org/scripts/426974/Gazelle%20Trackers%3A%20Highlight%20changes%20in%20upload%20snatches.meta.js
// ==/UserScript==

(function() {
  'use strict';

	function getTorrentId(node) {
		if (node instanceof HTMLElement) for (let a of node.getElementsByTagName('A')) {
			if (a.pathname != '/torrents.php') continue;
			let torrentId = new URLSearchParams(a.search).get('torrentid');
			if (torrentId) return parseInt(torrentId);
		}
	}

	let snapshot, touched = false, counter = 0;
	const params = new URLSearchParams(document.location.search);
	switch (document.location.pathname.slice(1)) {
		case 'torrents.php':
			if (params.get('type') == 'uploaded') {
				snapshot = GM_getValue(document.domain, { });
				for (let tr of document.body.querySelectorAll('table.torrent_table > tbody > tr.torrent')) {
					const torrentId = getTorrentId(tr);
					if (!torrentId) continue;
					const snatchesColumn = tr.children[4], snatches = parseInt(snatchesColumn.textContent);
					if (!(snatches >= 0) || snatches == snapshot[torrentId]) continue;
					if (snapshot[torrentId] > 0) {
						++counter;
						let span = document.createElement('span');
						span.textContent = snatches > snapshot[torrentId] ?
							'+' + (snatches - snapshot[torrentId]) : snatches - snapshot[torrentId];
						span.style = 'border: solid 1px black; background-color: yellow; color: black; padding: 0 3px; font-weight: 600;';
						span.className = 'delta';
						snatchesColumn.append(span);
					}
					snapshot[torrentId] = snatches; touched = true;
				}
			} else if (params.get('id') > 0) {
				snapshot = GM_getValue(document.domain, { });
				for (let tr of document.body.querySelectorAll('table#torrent_details > tbody > tr.torrent_row')) {
					if (tr.querySelector('span.torrent_action_buttons > a.button_rm') == null) continue; // not own upload
					let torrentId = /^(?:torrent(\d+))$/i.exec(tr.id);
					if (torrentId != null) torrentId = parseInt(torrentId[1]); else continue;
					const snatchesColumn = tr.children[2], snatches = parseInt(snatchesColumn.textContent);
					if (!(snatches >= 0) || snatches == snapshot[torrentId]) continue;
					if (snapshot[torrentId] > 0) {
						++counter;
						let span = document.createElement('span');
						span.textContent = snatches > snapshot[torrentId] ?
							'+' + (snatches - snapshot[torrentId]) : snatches - snapshot[torrentId];
						span.style = 'border: solid 1px black; background-color: yellow; color: black; padding: 0 3px; font-weight: 600;';
						span.className = 'delta';
						snatchesColumn.append(span);
					}
					snapshot[torrentId] = snatches; touched = true;
				}
			}
			break;
	}
	if (touched > 0) GM_setValue(document.domain, snapshot);
	if (counter > 0) {
		let div = document.createElement('DIV');
		div.innerHTML = '<span class="deltacounter">' + counter + '</span> ' +
			(counter != 1 ? 'changes' : 'change') + ' in snatches';
		div.style = 'position: fixed; right: 20px; top: 20px; border: solid 3px orange; color: orange; background: antiquewhite; font-size: 12pt; font-weight: bold; padding: 5px; z-index: 999999; transition: opacity 1s ease-in-out;';
		document.body.append(div);
		setTimeout(div => {
			div.style.opacity = 0;
			setTimeout(div => { div.remove() }, 1000, div);
		}, 10000, div);
	}
})();
