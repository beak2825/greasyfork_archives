// ==UserScript==
// @name         Средний балл СФ УУНиТ
// @namespace    https://github.com/WolfySoCute
// @version      0.4.3
// @description  Отображение среднего балла в журнале СФ УУНиТ
// @author       Wolfy
// @match        *://account.struust.ru/Journals/DisciplineGrades/*
// @match        *://account.strbsu.ru/Journals/DisciplineGrades/*
// @match        *://account.str.uust.ru/Journals/DisciplineGrades/*
// @icon         https://account.str.uust.ru/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/483334/%D0%A1%D1%80%D0%B5%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%B1%D0%B0%D0%BB%D0%BB%20%D0%A1%D0%A4%20%D0%A3%D0%A3%D0%9D%D0%B8%D0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/483334/%D0%A1%D1%80%D0%B5%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%B1%D0%B0%D0%BB%D0%BB%20%D0%A1%D0%A4%20%D0%A3%D0%A3%D0%9D%D0%B8%D0%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const journalNode = document.querySelector(".journal-student");
	const grades = [];

	if (journalNode) {
		for (const tr of journalNode.getElementsByTagName('tr')) {
			const gradeNode = tr.getElementsByClassName('journal-student-central')[2];
			if (gradeNode) {
				const grade = gradeNode.textContent.split(' / ');
				if (!isNaN(parseFloat(grade[0]))) grades.push(...grade.map(parseFloat));
			}
		}

		if (grades.length){
			const sum = grades.reduce((partialSum, a) => partialSum + Number(a), 0);
			const newTr = document.createElement('tr');
			newTr.innerHTML = `<td colspan="3" class="journal-student-central"><strong>Средний балл:</strong></td><td class="journal-student-central">${(sum / grades.length).toFixed(2)}</td>`;

			journalNode.firstElementChild.appendChild(newTr);
		}
	}
})();