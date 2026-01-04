// ==UserScript==
// @name         [GMT] Highlight changes in upload snatches
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.00.0
// @match        https://*/torrents.php?*
// @run-at       document-end
// @author       Anakunda
// @copyright    2021, Anakunda (https://greasyfork.org/users/321857-anakunda)
// @license      GPL-3.0-or-later
// @description  Highlight changes in own upload snatches
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/436736/%5BGMT%5D%20Highlight%20changes%20in%20upload%20snatches.user.js
// @updateURL https://update.greasyfork.org/scripts/436736/%5BGMT%5D%20Highlight%20changes%20in%20upload%20snatches.meta.js
// ==/UserScript==

(function() {
  'use strict';

	const params = new URLSearchParams(document.location.search);
	let snapshot, touched = false, counter = 0;

	function getTorrentId(node) {
		if (node instanceof HTMLElement) for (let a of node.getElementsByTagName('A')) {
			if (a.pathname != '/torrents.php') continue;
			let torrentId = new URLSearchParams(a.search).get('torrentid');
			if (torrentId) return parseInt(torrentId);
		}
	}

	function foo(torrentId, snatchesColumn) {
		if (!torrentId || !(snatchesColumn instanceof HTMLElement)) return; // assertion failed
		const snatches = parseInt(snatchesColumn.textContent);
		if (!(snatches >= 0) || snatches == snapshot[torrentId]) return;
		if (snapshot[torrentId] >= 0) {
			++counter;
			let span = document.createElement('span');
			span.textContent = snatches > snapshot[torrentId] ?
				'+' + (snatches - snapshot[torrentId]) : snatches - snapshot[torrentId];
			span.style = `
margin-left: 4px; border: solid 1px black;
padding: 0 3px; font-weight: 600;
background-color: yellow; color: black;
`;
			span.className = 'delta';
			snatchesColumn.append(span);
		}
		snapshot[torrentId] = snatches; touched = true;
	}

	switch (document.location.pathname.slice(1)) {
		case 'torrents.php':
			if (params.get('type') == 'uploaded') {
				var selector = 'table.torrent_table > tbody > tr.torrent';
				snapshot = GM_getValue(document.domain, { });
				for (let tr of document.body.querySelectorAll(selector)) {
					const torrentId = getTorrentId(tr);
					if (torrentId > 0) foo(torrentId, tr.children[4]);
					const leechers = parseInt(tr.children[6].textContent);
					if (leechers > 0) tr.children[6].style = 'color: green; font-weight: bold;';
				}
			} else if (params.get('id') > 0) {
				selector = 'table#torrent_details > tbody > tr.torrent_row';
				snapshot = GM_getValue(document.domain, { });
				for (let tr of document.body.querySelectorAll(selector)) {
					if (tr.querySelector('span.torrent_action_buttons > a.button_rm') == null) continue; // not own upload
					let torrentId = /^(?:torrent(\d+))$/i.exec(tr.id);
					if (torrentId != null) foo(parseInt(torrentId[1]), tr.children[2]);
					const leechers = parseInt(tr.children[4].textContent);
					if (leechers > 0) tr.children[4].style = 'color: green; font-weight: bold;';
				}
			}
			break;
	}
	if (touched > 0) GM_setValue(document.domain, snapshot);
	if (counter > 0) {
		let div = document.createElement('DIV');
		div.innerHTML = '<span class="deltacounter">' + counter + '</span> ' +
			(counter != 1 ? 'changes' : 'change') + ' in snatches';
		div.style = `
position: fixed; right: 20px; top: 20px;
opacity: 1; transition: opacity 1s ease-in-out;
border: solid 3px darkorange;
padding: 5px;
color: darkorange; background: antiquewhite;
font: 12pt bold;
box-shadow: 0 0 10px orange;
cursor: pointer;
z-index: 999999;
`;
		if (selector) div.onclick = function(evt) {
			for (let elem of document.body.querySelectorAll(selector))
				if (elem.querySelector('span.delta') == null) elem.style.visibility = 'collapse';
			if (evt.currentTarget.hTimer) clearTimeout(evt.currentTarget.hTimer);
			evt.currentTarget.remove();
		};
		document.body.append(div);
		const delay = GM_getValue('toast_timeout', 10);
		if (delay > 0) {
			//setTimeout(div => { div.style.opacity = 1 }, 0, div);
			div.hTimer = setTimeout(div => {
				div.style.opacity = 0;
				div.hTimer = setTimeout(div => { div.remove() }, 1000, div);
			}, (delay + 1) * 1000, div);
		}
	}
})();
