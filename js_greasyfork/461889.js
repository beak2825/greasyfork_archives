// ==UserScript==
// @name ClanActivity
// @namespace ClanActivity
// @version 0.1.1
// @author Komdosh
// @description Информация об активности игроков клана
// @homepage https://greasyfork.org/ru/scripts/437378

// @include http*://*.heroeswm.ru/clan_info.php*

// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461889/ClanActivity.user.js
// @updateURL https://update.greasyfork.org/scripts/461889/ClanActivity.meta.js
// ==/UserScript==
(function () {
	const charsRows = document.querySelectorAll('table[style="border-top: none;"] tr');

	const charsTable = document.querySelector('table[style="border-top: none;"]');
	const actionRow = document.createElement('tr');
	actionRow.append(document.createElement('td'));
	actionRow.append(document.createElement('td'));
	actionRow.append(document.createElement('td'));
	actionRow.append(document.createElement('td'));
	const lastTd = document.createElement('td');
	lastTd.style = 'text-align: right';
	const getInfoButton = document.createElement('span');
	getInfoButton.style = 'cursor:pointer;';
	let isActivated = false;
	getInfoButton.onclick = () => {
		if (isActivated) {
			return;
		}
		isActivated = true;
		actionRow.remove();
		displayUserActivity();
	};
	getInfoButton.innerText = 'ЗАГРУЗИТЬ даты посещения!';
	lastTd.append(getInfoButton);
	actionRow.append(lastTd);
	charsTable.insertBefore(actionRow, charsTable.firstChild);

	let indexTimeout = 0;

	function displayUserActivity() {
		for (const row of charsRows) {
			const children = row.children;
			const tdClassName = children[0].className;
			const isOnline = tdClassName == 'wblight';

			const activityTd = document.createElement('td');
			activityTd.className = tdClassName;
			if (!isOnline) {
				setTimeout(() => {
					whenOnline(children[2].children[0].href).then(days => {
						if (!days) {
							daysSpan.innerHTML = '';
							return;
						}
						const daysSpan = document.createElement('span');
						if (days < 7) {
							daysSpan.style = 'color: #5800ff;';
						} else if (days < 14) {
							daysSpan.style = 'color: #ff9a00;';
						} else {
							daysSpan.style = 'color: #e70606; font-weight: 700;';
						}
						daysSpan.innerHTML = `${days} д.`;
						activityTd.append(daysSpan);
					});
				}, indexTimeout * 100);
			} else {
				activityTd.innerText = '';
			}
			row.append(activityTd);
		}
	}

	async function whenOnline(userInfoUrl) {
		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', encodeURI(userInfoUrl));
			xhr.onload = function () {
				if (xhr.status === 200) {
					var div = document.createElement('div');
					div.id = 'kom-clanActivity';
					div.style.display = 'none';
					div.innerHTML = xhr.responseText;
					document.getElementsByTagName('body')[0].appendChild(div);

					const lastTimeElement = div.querySelector('i');
					if (lastTimeElement == null) {
						resolve(null);
						return;
					}
					const whenOnlineLastTimeText = lastTimeElement.innerText;
					let time = whenOnlineLastTimeText.split(' ');
					time = time[time.length - 2];
					let date = whenOnlineLastTimeText.split(' ');
					date = date[date.length - 1].split('-');
					const whenOnlineLastTime = new Date(`${time} ${date[1]}-${date[0]}-${date[2]}`);

					const diffTime = Math.abs(Date.now() - whenOnlineLastTime);
					const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

					resolve(diffDays);
				} else {
					console.log('Request failed.  Returned status of ' + xhr.status);
					resolve(null);
				}
			};
			xhr.send();
		});
	}
})();