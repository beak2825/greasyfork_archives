// ==UserScript==
// @name         [GreasyFork] highlight stats changes in own scripts
// @namespace    https://greasyfork.org/users/321857-anakunda
// @version      1.05
// @description  try to take over the world!
// @author       Anakunda
// @iconURL      https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png
// @match        https://greasyfork.org/*/users/*
// @match        https://greasyfork.org/users/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/396473/%5BGreasyFork%5D%20highlight%20stats%20changes%20in%20own%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/396473/%5BGreasyFork%5D%20highlight%20stats%20changes%20in%20own%20scripts.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const pageReloadInterval = 5; // reloan listing after n minutes if no changes detected, 0 to turn off
	const dismissNotificationInterval = 60; // dismiss changes notification after n seconds

	const daysSpan = 4;
	let scripts = document.querySelectorAll('ol#user-script-list > li > article, ol#user-unlisted-script-list > li > article');
	if (scripts.length <= 0) return;
	try { var lastStats = new Map(JSON.parse(GM_getValue('stats'))) } catch(e) { lastStats = new Map() }
	let updateCounter = 0;
	let articles = Array.from(scripts).map(article => queryStats(article.parentNode.dataset.scriptId).then(function(statData) {
		const id = parseInt(article.parentNode.dataset.scriptId);
		const installs = parseInt(article.parentNode.dataset.scriptTotalInstalls);
		const rating = parseFloat(article.parentNode.dataset.scriptRatingScore);
		const todayActiveStyle = 'color: darkorange; font-weight: 900;';
		var ref, _lastStats = lastStats.get(id) || {};
		if (statData.installs_total != installs) console.warn('Script ' + id + ' total installs inconsistency:',
																													statData.installs_total, '≠', installs);
		if ((ref = article.querySelector('dd.script-list-total-installs')) != null) {
			ref.innerHTML = '<span itemprop="installs-today" style="' +
				(statData.installs_today > 0 ? todayActiveStyle : '') + '">' + statData.installs_today +
				'</span> / <span itemprop="installs-total">' + statData.installs_total + '</span>';
			if (_lastStats.installs != undefined && statData.installs_total /*installs*/ != _lastStats.installs) {
				++updateCounter;
				ref.style.backgroundColor = 'greenyellow';
				var span = document.createElement('span');
				span.innerHTML = ' (<b>+'.concat((statData.installs_total /*installs*/ - (_lastStats.installs || 0)), '</b>)');
				ref.append(span);
				article.classList.add('changed');
			}
		}
		if (_lastStats.rating != undefined && rating != _lastStats.rating
				&& (ref = article.querySelector('dd.script-list-ratings')) != null) {
			++updateCounter;
			ref.style.backgroundColor = 'greenyellow';
			let span = document.createElement('span');
			span.setAttribute('itemprop', 'installs-delta');
			let delta = rating - _lastStats.rating;
			if (delta > 0) delta = '+'.concat(delta);
			span.innerHTML = ' (<b>' + delta + '</b>)';
			ref.append(span);
			article.classList.add('changed');
		}
		if ((ref = article.querySelector('dl.inline-script-stats')) != null) {
			var className = 'script-list-update-checks';
			let elem = document.createElement('dt');
			elem.className = className;
			elem.innerHTML = '<span>Kontroly aktualizací</span>';
			ref.append(elem);
			elem = document.createElement('dd');
			elem.className = className;
			elem.innerHTML = '<span itemprop="update-checks-today" style="' +
				(statData.update_checks_today > 0 ? todayActiveStyle : '') + '">' + statData.update_checks_today +
				'</span> / <span itemprop="update-checks-total">' + statData.update_checks_total + '</span>';
			if (_lastStats.update_checks != undefined && statData.update_checks_total != _lastStats.update_checks) {
				++updateCounter;
				let span = document.createElement('span');
				span.setAttribute('itemprop', 'update-checks-delta');
				span.innerHTML = ' (<b>+' + (statData.update_checks_total - (_lastStats.update_checks || 0)) + '</b>)';
				elem.append(span);
				elem.style.backgroundColor = 'greenyellow';
				article.classList.add('changed');
			}
			ref.append(elem);
			if (statData.installs_total > 0 && !isNaN(statData.steady_users)) {
				className = 'script-list-usage-stats';
				elem = document.createElement('dt');
				elem.className = className;
				elem.innerHTML = '<span>Odhad uživatelů</span>';
				ref.append(elem);
				elem = document.createElement('dd');
				elem.className = className;
				elem.innerHTML = '<span itemprop="active-users-estimation">' + statData.steady_users + ' (' +
					Math.round(statData.steady_users * 100 / statData.installs_total) + '%)</span>';
				ref.append(elem);
			}
		}
		return lastStats.set(id, {
			installs: statData.installs_total /*installs*/,
			update_checks: statData.update_checks_total,
			rating: rating,
		});
	}));
	let ref = document.body.querySelector('section.text-content'), newDiscussion = false,
			userId = /\/users\/(\d+)\b/.test(document.location.pathname) ? parseInt(RegExp.$1) : undefined;
	if (userId > 0) {
		let lastDiscussion = document.querySelector('div.discussion-list-container > div.discussion-list-item:first-of-type > div.discussion-meta');
		if (lastDiscussion != null) {
			lastDiscussion = lastDiscussion.querySelectorAll('div.discussion-meta-item > gf-relative-time[datetime]');
			if (lastDiscussion.length > 0) {
				lastDiscussion = lastDiscussion[lastDiscussion.length - 1];
				let timeStamp = lastDiscussion.date;
				if (!isNaN(timeStamp)) {
					timeStamp = timeStamp.getTime();
					let dateTime = GM_getValue('last_discussion_' + userId);
					if (dateTime > 0 && timeStamp <= dateTime)
						lastDiscussion.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
					else {
						if (dateTime > 0) {
							newDiscussion = true;
							if (ref != null) {
								let div = document.createElement('div');
								div.textContent = 'There is new discussion';
								div.style = 'color: #2196F3; font-weight: bolder; font-family: "Segoe UI"; ' +
									'border: solid #2196F3 4px; background-color: antiquewhite; ' +
									'padding: 10px; position: fixed; top: 80px; right: 20px; cursor: pointer;';
								div.onclick = function(evt) { document.location.assign('#user-discussions-on-scripts-written') };
								ref.append(div);
								if (!(pageReloadInterval > 0) && dismissNotificationInterval > 0)
									setTimeout(function() { div.remove() }, dismissNotificationInterval * 1000);
							}
							GM_notification({ highlight: true, silent: false });
						}
						GM_setValue('last_discussion_' + userId, timeStamp);
					}
				}
			}
		}
	}
	Promise.all(articles).then(function(results) {
		if (updateCounter > 0) {
			let div = document.createElement('div');
			div.textContent = 'There are updates (' + updateCounter + ')';
			div.style = 'color: darkorange; font-weight: bolder; font-family: "Segoe UI"; ' +
				'border: solid lightsalmon 4px; background-color: antiquewhite; ' +
				'padding: 10px; position: fixed; top: 20px; right: 20px; cursor: pointer;';
			div.onclick = function(evt) {
				if (evt.target.classList.contains('filtered')) return document.location.reload();
				scripts.forEach(function(script) {
					if (!script.classList.contains('changed')) script.parentNode.style.display = 'none';
				});
				evt.target.style.color = 'gray';
				evt.target.classList.add('filtered');
				document.location.assign('#user-script-list');
			};
			document.body.append(div);
			if (!(pageReloadInterval > 0) && dismissNotificationInterval > 0)
				setTimeout(function() { div.remove() }, dismissNotificationInterval * 1000);
			GM_notification({ highlight: true, silent: false });
		} else if (!newDiscussion && pageReloadInterval > 0)
			setTimeout(function() { document.location.reload() }, pageReloadInterval * 60000);
		GM_setValue('stats', JSON.stringify(Array.from(lastStats.entries())));
	});
	let userProfileLink = document.querySelector('span.user-profile-link > a');
	//if (userProfileLink != null) userProfileLink.hash = 'user-discussions';
	return;

	function queryStats(scriptId) {
		return new Promise(function(resolve, reject) {
			let xhr = new XMLHttpRequest;
			xhr.open('GET', '/scripts/' + scriptId + '/stats.json', true);
			xhr.onload = function() {
				if (xhr.status != 200) return reject(defaultErrorHandler(xhr));
				const values = Array.from(Object.values(xhr.response));
				resolve({
					installs_total: values.reduce((acc, item) => acc + parseInt(item.installs || 0), 0),
					installs_today: values[values.length - 1].installs,
					update_checks_total: values.reduce((acc, item) => acc + parseInt(item.update_checks || 0), 0),
					update_checks_today: values[values.length - 1].update_checks,
					steady_users: values.length >= daysSpan ?
					values.slice(-daysSpan).reduce((acc, item) => acc + parseInt(item.update_checks || 0), 0) : NaN,
				});
			};
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.responseType = 'json';
			xhr.timeout = 20000;
			xhr.send();
		})
	}
})();
