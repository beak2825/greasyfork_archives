// ==UserScript==
// @name           varroa musica
// @namespace      varroa
// @description    Adds a VM link for each torrent, to send directly to varroa musica.
// @include        http*://*redacted.ch/*
// @include        http*://*notwhat.cd/*
// @include        http*://*apollo.rip/*
// @version        22
// @date           2018-03
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_notification
// @grant          GM_addStyle
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.notification
// @grant          GM.addStyle
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/33369/varroa%20musica.user.js
// @updateURL https://update.greasyfork.org/scripts/33369/varroa%20musica.meta.js
// ==/UserScript==

// with some help from `xo --fix send_to_varroa.js`
/* global window document MutationObserver GM WebSocket */
/* eslint new-cap: "off" */

(async function () {
	const linkregex = /torrents\.php\?action=download.*?id=(\d+).*?authkey=.*?torrent_pass=(?=([a-z0-9]+))\2(?!&)/i;
	const divider = ' | ';

// Get userid
	const userinfoElement = document.getElementsByClassName('username')[0];
	const userid = userinfoElement.href.match(/user\.php\?id=(\d+)/)[1];
// Get current hostname
	const siteHostname = window.location.host;
// Get domain-specific settings prefix to make this script multi-site
	const settingsNamePrefix = siteHostname + '_' + userid + '_';
// Settings
	const settings = await getSettings();
// Checks for current page
	const settingsPage = window.location.href.match('user.php\\?action=edit&userid=');
	const userPage = window.location.href.match('user.php\\?id=' + userid);
	const torrentPage = window.location.href.match('torrents.php$');
	const torrentUserPage = window.location.href.match('torrents.php?(.*)&userid');
// Check if tokens are available
	const FLTokensAvailable = await areFLTokensAvailable();
// Misc strings
	const vmUnknown = 'Pinging VM...';
	const vmOK = 'VM is up.';
	const vmKO = 'VM is offline (click to check again).';
	const vmGet = 'VM: sent torrent with ID #';
	const vmCannotGet = 'VM is offline, cannot get torrent (click to check again).';
	const vmLinkInfo = 'Send to varroa musica';

	const notification = 0;
	const statsInfo = 1;

	let obsElem;
	const linkLabel = 'VM';
	const linkLabelFL = 'VM FL';
	let isWebSocketConnected = false;
	let vmStatusDiv = null;
	let vmStatusInfoDiv = null;
	let sock;
	let hello;
	let getInfo;
	let alreadyAddedLinks = false;

	if (settings) {
		if (settings.https === true) {
			hello = {
				Command: 'hello',
				Token: settings.token,
				Site: settings.site
			};
			getInfo = {
				Command: 'stats',
				Token: settings.token,
				Site: settings.site
			};
		// Open the websocket to varroa
			newSocket();
		} else {
			// Add http links
			addLinks();
		}
	// Add stats if on user page
		addStatsToUserPage();
	}
	if (settingsPage) {
		await appendSettings();
		document.getElementById('varroa_settings_token').addEventListener('change', saveSettings, false);
		document.getElementById('varroa_settings_url').addEventListener('change', saveSettings, false);
		document.getElementById('varroa_settings_port').addEventListener('change', saveSettings, false);
		document.getElementById('varroa_settings_https').addEventListener('change', saveSettings, false);
		document.getElementById('varroa_settings_site').addEventListener('change', saveSettings, false);
	}
	if (!settings && !settingsPage) {
		GM.notification({
			text: 'Missing configuration\nClick to visit user settings and setup',
			title: 'Varroa Musica:',
			timeout: 6000,
			onclick: () => {
				window.location = window.location.origin + '/user.php?action=edit#varroa_settings';
			}
		});
	}

	function addLinks() {
		if (alreadyAddedLinks === true) {
			return;
		}
		const alltorrents = [];
		for (let i = 0; i < document.links.length; i++) {
			alltorrents.push(document.links[i]);
		}

		for (let i = 0; i < alltorrents.length; i++) {
			if (linkregex.exec(alltorrents[i])) {
				const id = RegExp.$1;
				createLink(alltorrents[i], id, false);
				if (FLTokensAvailable) {
					createLink(alltorrents[i], id, true);
				}
			}
		}

		MutationObserver = window.MutationObserver || window.WebKitMutationObserver; // eslint-disable-line no-global-assign
		const obs = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				mutation.addedNodes.forEach(node => {
					if (linkregex.exec(node.querySelector('a'))) {
						const id = RegExp.$1;
						createLink(node.querySelector('a'), id, false);
						if (FLTokensAvailable) {
							createLink(node.querySelector('a'), id, true);
						}
					}
				});
			});
		});

		if (torrentPage) {
			obsElem = document.querySelector('#torrent_table > tbody'); // eslint-disable-line no-unused-vars
		} else if (torrentUserPage) {
			obsElem = document.querySelector('.torrent_table > tbody'); // eslint-disable-line no-unused-vars
		}
		if (obsElem) { // eslint-disable-line no-undef
			obs.observe(obsElem, { // eslint-disable-line no-undef
				childList: true
			});
		}

		alreadyAddedLinks = true;
	}

	function makeStatsLink(label, filename) {
		let link = settings.url + ':' + settings.port + '/getStats/' + filename + '?token=' + settings.token + '&site=' + settings.site;
		if (settings.https === true) {
			link = 'https://' + link;
		} else {
			link = 'http://' + link;
		}
		return label + `:  <a href="javascript:void(0);" onclick="BBCode.spoiler(this);">Show</a><blockquote class="hidden spoiler"><div style="text-align: center;"><img class="scale_image" onclick="lightbox.init(this, $(this).width());" alt="` + link + `" src="` + link + `" /></div></blockquote>`;
	}

	function addStatsToUserPage() {
		if (userPage) {
			const main = document.getElementsByClassName('main_column')[0];
			const newBox = document.createElement('div');
			newBox.className = 'box';
			const newBoxHead = document.createElement('div');
			newBoxHead.className = 'head';
			newBoxHead.innerHTML = `Varroa Musica Stats<span style="float: right;"><a href="#" onclick="$('#varroa_stats').gtoggle(); this.innerHTML = (this.innerHTML == 'Hide' ? 'Show' : 'Hide'); return false;" class="brackets">Hide</a></span>&nbsp;`;
			newBox.appendChild(newBoxHead);
			const newBoxContent = document.createElement('div');
			newBoxContent.className = 'pad profileinfo';
			newBoxContent.id = 'varroa_stats';
			newBoxContent.innerHTML += `<br />
			<table class="torrent_table" cellpadding="0" cellspacing="0" border="0">
			        <tr class="colhead_dark"><td width="100%" colspan=4><strong>Graphs</strong></td></tr>
					<tr><td style="width: 20%;"><strong>Full Stats</strong></td><td>` + makeStatsLink('Full Stats', 'stats.png') + `</td><td></td><td></td></tr>
					<tr class="rowb"><td style="width: 20%;"><strong>Buffer</strong></td><td>` + makeStatsLink('Overall', 'overall_buffer.png') + `</td><td>` + makeStatsLink('Last Month', 'lastmonth_buffer.png') + `</td><td>` + makeStatsLink('Last Week', 'lastweek_buffer.png') + `</td></tr>
				    <tr><td style="width: 20%;"><strong>Buffer/period</strong></td><td>` + makeStatsLink('Buffer/day', 'overall_per_day_buffer.png') + `</td><td>` + makeStatsLink('Buffer/week', 'overall_per_week_buffer.png') + `</td><td>` + makeStatsLink('Buffer/month', 'overall_per_month_buffer.png') + `</td></tr>
					<tr class="rowb"><td style="width: 20%;"><strong>Upload</strong></td><td>` + makeStatsLink('Overall', 'overall_up.png') + `</td><td>` + makeStatsLink('Last Month', 'lastmonth_up.png') + `</td><td>` + makeStatsLink('Last Week', 'lastweek_up.png') + `</td></tr>
				    <tr><td style="width: 20%;"><strong>Upload/period</strong></td><td>` + makeStatsLink('Upload/day', 'overall_per_day_up.png') + `</td><td>` + makeStatsLink('Upload/week', 'overall_per_week_up.png') + `</td><td>` + makeStatsLink('Upload/month', 'overall_per_month_up.png') + `</td></tr>
					<tr class="rowb"><td style="width: 20%;"><strong>Download</strong></td><td>` + makeStatsLink('Overall', 'overall_down.png') + `</td><td>` + makeStatsLink('Last Month', 'lastmonth_down.png') + `</td><td>` + makeStatsLink('Last Week', 'lastweek_down.png') + `</td></tr>
				    <tr><td style="width: 20%;"><strong>Download/period</strong></td><td>` + makeStatsLink('Download/day', 'overall_per_day_down.png') + `</td><td>` + makeStatsLink('Download/week', 'overall_per_week_down.png') + `</td><td>` + makeStatsLink('Download/month', 'overall_per_month_down.png') + `</td></tr>
					<tr class="rowb"><td style="width: 20%;"><strong>Ratio</strong></td><td>` + makeStatsLink('Overall', 'overall_ratio.png') + `</td><td>` + makeStatsLink('Last Month', 'lastmonth_ratio.png') + `</td><td>` + makeStatsLink('Last Week', 'lastweek_ratio.png') + `</td></tr>
				    <tr><td style="width: 20%;"><strong>Ratio/period</strong></td><td>` + makeStatsLink('Ratio/day', 'overall_per_day_ratio.png') + `</td><td>` + makeStatsLink('Ratio/week', 'overall_per_week_ratio.png') + `</td><td>` + makeStatsLink('Ratio/month', 'overall_per_month_ratio.png') + `</td></tr>
 					<tr class="rowb"><td style="width: 20%;">` + makeStatsLink('Snatched/day', 'snatches_per_day.png') + `</td><td>` + makeStatsLink('Size snatched/day', 'size_snatched_per_day.png') + `</td><td>` + makeStatsLink('Top Tags', 'top_tags.png') + `</td><td>` + makeStatsLink('Snatched/filter', 'total_snatched_by_filter.png') + `</td></tr>
			</table>`;

			newBox.appendChild(newBoxContent);
			main.insertBefore(newBox, main.children[1]);
			if (settings.https) {
				setVMStatusInfo('varroa musica status.');
			}
		}
	}

	function askForStatusInfoOnceConnected() {
		if (isWebSocketConnected) {
			sock.send(JSON.stringify(getInfo));
		} else {
			setTimeout(askForStatusInfoOnceConnected, 100);
		}
	}

	function newSocket() {
		// TODO use settings.token
		sock = new WebSocket('wss://' + settings.url + ':' + settings.port + '/ws');
		// Add unknown indicator
		setVMStatus(vmUnknown);

		sock.onopen = function () {
			console.log('Connected to the server');
			isWebSocketConnected = true;
			// Send the msg object as a JSON-formatted string.
			sock.send(JSON.stringify(hello));
			if (userPage) {
				askForStatusInfoOnceConnected();
			}
		};
		sock.onerror = () => {
			console.log('Websocket error.');
			isWebSocketConnected = false;
			setVMStatus(vmKO);
		};
		sock.onmessage = function (evt) {
			console.log(evt.data);
			const msg = JSON.parse(evt.data);
			if (msg.Status === 0) {
				if (msg.Target === notification || msg.Target === undefined) {
					if (msg.Message === 'hello') {
						setVMStatus(vmOK);
						// Safe to add links
						addLinks();
					} else {
						// TODO change back after a while
						setVMStatus('VM: ' + msg.Message);
					}
				} else if (msg.Target === statsInfo && userPage) {
					setVMStatusInfo(msg.Message);
				}
			}
		};
		sock.onclose = function () {
			console.log('Server connection closed.');
			isWebSocketConnected = false;
			setVMStatus(vmKO);
			setTimeout(() => {
				newSocket();
			}, 5000);
		};
	}

	function createLink(linkelement, id, useFLToken) {
		let link = '';
		if (useFLToken) {
			link = document.createElement('varroa_fl_' + id);
		} else {
			link = document.createElement('varroa_' + id);
		}
		let a = '';
		a = document.createElement('a');
		a.className = 'varroa_link';
		link.appendChild(a);
		if (useFLToken) {
			link.firstChild.appendChild(document.createTextNode(linkLabelFL));
		} else {
			link.firstChild.appendChild(document.createTextNode(linkLabel));
		}
		link.appendChild(document.createTextNode(divider));
		if (settings.https === true && isWebSocketConnected) {
			if (useFLToken) {
				link.addEventListener('click', getTorrentWithFLToken, false);
			} else {
				link.addEventListener('click', getTorrent, false);
			}
		} else {
			link.firstChild.href = 'http://' + settings.url + ':' + settings.port + '/get/' + id + '?token=' + settings.token + '&site=' + settings.site;
			if (useFLToken) {
				link.firstChild.href += '&fltoken=true';
			}
		}
		link.firstChild.target = '_blank';
		link.firstChild.title = vmLinkInfo;
		linkelement.parentNode.insertBefore(link, linkelement);
	}

	function getTorrent() {
		getTorrentAux(this.nodeName, 'varroa_', false);
	}

	function getTorrentWithFLToken() {
		getTorrentAux(this.nodeName, 'varroa_fl_', true);
	}

	function getTorrentAux(nodename, prefix, useFLToken) {
		if (isWebSocketConnected) {
			const id = nodename.toLowerCase().replace(prefix, '');
			console.log('Getting torrent with id: ' + id);
			const get = {
				Command: 'get',
				Token: settings.token,
				Args: [id],
				Site: settings.site,
				FLToken: useFLToken
			};
			sock.send(JSON.stringify(get));
			setVMStatus(vmGet + id);
		} else {
			setVMStatus(vmCannotGet);
		}
	}

	async function areFLTokensAvailable() {
		const tokens = document.getElementById('fl_tokens');
		if (tokens === null) {
			return false;
		}
		return tokens.getElementsByClassName('stat')[0].getElementsByTagName('a')[0].innerHTML != '';
	}

    // -- Status Info -------------------------------------------------------------------

	function setVMStatusInfo(label) {
		const a = document.createElement('a');
		a.innerHTML = label.replace(/\n/g, '<br />');
		if (settings.https === true) {
			a.addEventListener('click', newSocket, false);
		}
		if (vmStatusInfoDiv === null) {
			vmStatusInfoDiv = document.createElement('div');
			vmStatusInfoDiv.appendChild(a);
			const mainVMStatsDiv = document.getElementById('varroa_stats');
			mainVMStatsDiv.insertBefore(vmStatusInfoDiv, mainVMStatsDiv.firstChild);
		} else {
			vmStatusInfoDiv.replaceChild(a, vmStatusInfoDiv.lastChild);
		}
	}

	// -- Status Info -------------------------------------------------------------------

	function setVMStatus(label) {
		const a = document.createElement('a');
		a.innerHTML = label.replace(/\n/g, '<br />');
		if (settings.https === true) {
			a.addEventListener('click', newSocket, false);
		}
		if (vmStatusDiv === null) {
			vmStatusDiv = document.createElement('div');
			vmStatusDiv.id = 'varroa';
			const vmStatusP = document.createElement('p');
			vmStatusP.innerHTML = 'varroa musica';
			vmStatusDiv.appendChild(vmStatusP);

			vmStatusDiv.appendChild(a);
			document.body.appendChild(vmStatusDiv);
		} else {
			vmStatusDiv.replaceChild(a, vmStatusDiv.lastChild);
		}
	}

	(function () {
		'use strict';
		const css = '#varroa {bottom: 20px; left: 20px; position: fixed; width: 310px; height: auto; margin: 0px; list-style-type: none; z-index: 10000000;background-color: #FFFFFF;color: #000000; border: 2px solid #6D6D6D; padding: 5px; border-radius: 5px; } ';
		const css2 = '#varroa a {bottom: 0; left: 0px; position: relative; width: auto; height: auto; margin: 0px; background-color: #FFFFFF ;color: #000000; cursor: pointer }';
		const css3 = '#varroa p {bottom: 0; left: 0px; position: relative; width: auto; height: auto; margin: 0px; background-color: #FFFFFF ;color: #000000;text-decoration: underline; }';
		const css4 = '.varroa_link:hover  {cursor:pointer;}';
		GM.addStyle(css);
		GM.addStyle(css2);
		GM.addStyle(css3);
		GM.addStyle(css4);
	})();

// -- Settings -----------------------------------------------------------------

	async function appendSettings() {
		const container = document.getElementsByClassName('main_column')[0];
		const lastTable = container.lastElementChild;
		let settingsHTML = '<a name="varroa_settings"></a>\n<table cellpadding="6" cellspacing="1" border="0" width="100%" class="layout border user_options" id="varroa_settings">\n';
		settingsHTML += '<tbody>\n<tr class="colhead_dark"><td colspan="2"><strong>Varroa Musica Settings (autosaved)</strong></td></tr>\n';
		settingsHTML += '<tr><td class="label" title="Webserver Token">Site</td><td><input type="text" id="varroa_settings_site" placeholder="site label" value="' + await GM.getValue(settingsNamePrefix + 'site', '') + '"></td></tr>\n';
		settingsHTML += '<tr><td class="label" title="Webserver Token">Token</td><td><input type="text" id="varroa_settings_token" placeholder="your token" value="' + await GM.getValue(settingsNamePrefix + 'token', '') + '"></td></tr>\n';
		settingsHTML += '<tr><td class="label" title="Webserver hostname (seedbox hostname)">Hostname</td><td><input type="text" id="varroa_settings_url" placeholder="hostname.com" value="' + await GM.getValue(settingsNamePrefix + 'url', '') + '"></td></tr>\n';
		settingsHTML += '<tr><td class="label" title="Webserver port">Port</td><td><input type="text" id="varroa_settings_port" placeholder="your chosen port" value="' + await GM.getValue(settingsNamePrefix + 'port', '') + '"></td></tr>\n';
		let checked = '';
		if (await GM.getValue(settingsNamePrefix + 'https', false) === true) {
			checked = 'checked';
		}
		settingsHTML += '<tr><td class="label" title="Webserver HTTPS enabled">HTTPS</td><td><input type="checkbox" id="varroa_settings_https" placeholder="true_or_false" value="HTTPS" ' + checked + '></td></tr>\n';
		settingsHTML += '</tbody>\n</table>';
		lastTable.insertAdjacentHTML('afterend', settingsHTML);

		const sectionsElem = document.querySelectorAll('#settings_sections > ul')[0];
		const sectionsHTML = '<h2><a href="#varroa_settings" class="tooltip" title="Varroa Musica Settings">Varroa Musica</a></h2>';
		const li = document.createElement('li');
		li.innerHTML = sectionsHTML;
		sectionsElem.insertBefore(li, document.querySelectorAll('#settings_sections > ul > li:nth-child(10)')[0]);
	}

	async function getSettings() {
		const token = await GM.getValue(settingsNamePrefix + 'token', '');
		const url = await GM.getValue(settingsNamePrefix + 'url', '');
		const port = await GM.getValue(settingsNamePrefix + 'port', '');
		const https = await GM.getValue(settingsNamePrefix + 'https', false);
		const site = await GM.getValue(settingsNamePrefix + 'site', '');
		if (token && url && port) {
			return {
				token,
				url,
				port,
				https,
				site
			};
		}
		return false;
	}

	async function saveSettings() {
		const elem = document.getElementById(this.id);
		const setting = this.id.replace('varroa_settings_', settingsNamePrefix);
		const border = elem.style.border;
		if (this.type === 'text') {
			GM.setValue(setting, elem.value);
			if (await GM.getValue(setting) === elem.value) {
				elem.style.border = '1px solid green';
				setTimeout(() => {
					elem.style.border = border;
				}, 2000);
			} else {
				elem.style.border = '1px solid red';
			}
		}
		if (this.type === 'checkbox') {
			GM.setValue(setting, elem.checked);
		}
	}
})();
