// ==UserScript==
// @name         Дисциплины по семестру СФ УУНиТ
// @namespace    https://github.com/WolfySoCute
// @version      0.1.2
// @description  Отображение дисциплин сортированных по семестрам СФ УУНиТ
// @author       Wolfy
// @match        *://account.struust.ru/Journals/DisciplinesStudent
// @match        *://account.strbsu.ru/Journals/DisciplinesStudent
// @match        *://account.str.uust.ru/Journals/DisciplinesStudent
// @icon         https://account.str.uust.ru/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/487753/%D0%94%D0%B8%D1%81%D1%86%D0%B8%D0%BF%D0%BB%D0%B8%D0%BD%D1%8B%20%D0%BF%D0%BE%20%D1%81%D0%B5%D0%BC%D0%B5%D1%81%D1%82%D1%80%D1%83%20%D0%A1%D0%A4%20%D0%A3%D0%A3%D0%9D%D0%B8%D0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/487753/%D0%94%D0%B8%D1%81%D1%86%D0%B8%D0%BF%D0%BB%D0%B8%D0%BD%D1%8B%20%D0%BF%D0%BE%20%D1%81%D0%B5%D0%BC%D0%B5%D1%81%D1%82%D1%80%D1%83%20%D0%A1%D0%A4%20%D0%A3%D0%A3%D0%9D%D0%B8%D0%A2.meta.js
// ==/UserScript==

const reverseObj = (obj) => {
	const reversedArray = Object.keys(obj)
	  .reverse()
	  .map((key) => ({ key, value: obj[key] }));

	return reversedArray;
};

(function() {
    'use strict';

    const semesters = {};
	let header;

	const tableNode = document.getElementsByClassName("table")[0];

	for (const tr of tableNode.getElementsByTagName('tr')) {
		const text = tr.children[2].textContent;
		if (isNaN(text)) {
			header = tr;
			continue;
		}

		const number = text
		if (!semesters[number]) {
			semesters[number] = [tr]
		} else {
			semesters[number].push(tr);
		}
	}

	const reversedResult = reverseObj(semesters);

	const div = document.createElement('div');
	for (const semester of reversedResult) {
		const tableDiv = document.createElement('div');
		tableDiv.style = 'margin-top: 20px';

		const title = document.createElement('h3');
		title.innerText = `${semester.key} семестр`;

		const thead = document.createElement('thead');
		thead.append(header.cloneNode(true));

		const tbody = document.createElement('tbody');
		tbody.append(...semester.value);

		const table = document.createElement('table');
		table.className = 'table';

		table.append(thead, tbody);
		tableDiv.append(title, table);

		div.append(tableDiv);
	}

	header.remove();
	const hr = document.getElementsByClassName('container')[1].getElementsByTagName('hr')[0];
	hr.before(div);
})();