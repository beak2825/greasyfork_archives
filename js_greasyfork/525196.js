// ==UserScript==
// @name        Canvas Grade Calculator for CMU
// @description Calculate grade totals for Canvas courses that have it disabled for CMU.
// @namespace   https://github.com/uncenter/canvas-grade-calculator
// @match       https://*.cmu.edu/courses/*/grades
// @grant       GM_registerMenuCommand
// @homepageURL https://github.com/uncenter/canvas-grade-calculator
// @version     0.3.1
// @author      chizhang
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/525196/Canvas%20Grade%20Calculator%20for%20CMU.user.js
// @updateURL https://update.greasyfork.org/scripts/525196/Canvas%20Grade%20Calculator%20for%20CMU.meta.js
// ==/UserScript==

function parseCanvasDate(input) {
	if (input === '') return;

	let year = new Date().getFullYear().toString();
	let [date, time] = input.includes('by')
		? input.split(' by ')
		: input.split(' at ');
	if (date.includes(',')) {
		[date, year] = date.split(', ');
	}
	let [month, day] = date.split(' ');
	const period = time.match(/am|pm/)[0];
	let hour = time.replace(period, '');
	let minute = 0;
	if (hour.includes(':')) {
		[hour, minute] = hour.split(':');
	}

	return new Date(
		Number.parseInt(year),
		[
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		].indexOf(month),
		Number.parseInt(day),
		Number.parseInt(hour) +
			(period === 'pm' && Number.parseInt(hour) !== 12 ? 12 : 0),
		Number.parseInt(minute)
	).getTime();
}

function toKebabCase(string) {
	return string
		.toLowerCase()
		.replaceAll(/\s+|_+/g, '-')
		.replaceAll(/[^\da-z-]+/g, '');
}

function downloadFile(data, filename) {
	const blob = new Blob([data], { type: 'text/plain' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}

function getWeights() {
	const weights = {};

	const table =
		document.querySelector('[aria-label="Grading Period Weights"]') ||
		document.querySelector('[aria-label="Assignment Weights"]');

	// Scrape weights table for category/group names and percentages.
	for (const element of table.querySelectorAll('table tbody > tr')) {
		const group = element.querySelector('th').textContent;
		if (group === 'Total') continue;
		const weight =
			Number.parseFloat(element.querySelector('td').textContent.slice(0, 2)) /
			100;
		weights[group] = weight;
	}

	return weights;
}

function getAssignments() {
	const assignments = [];

	// Scrape assignments table for graded assignments.
	for (const assignment of document.querySelectorAll(
		'#grades_summary tr.assignment_graded.student_assignment'
	)) {
		let earned, available, title, group;

		const a = assignment.querySelector('th.title');
		title = a.querySelector('a').textContent;
		group = a.querySelector('div.context').textContent;

		const due = parseCanvasDate(
			assignment.querySelector('.due').textContent.trim()
		);
		const submitted = parseCanvasDate(
			assignment.querySelector('.submitted').textContent.trim()
		);

		const grades = assignment.querySelector('td.assignment_score span.grade');

		// Submitted but not yet graded
		if (grades.querySelector('.submission_icon')) continue;

		// Complete or incomplete
		if (grades.querySelector('.graded_icon')) {
			earned = Number.parseFloat(
				assignment.querySelector('.original_points').textContent.trim()
			);
			available = earned;
		} else {
			const score = [...grades.childNodes]
				.find(
					(node) =>
						node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
				)
				?.textContent.trim();

			if (
				score.includes('%') ||
				!grades.nextElementSibling.textContent.includes('/')
			) {
				earned = Number.parseFloat(score.replace('%', ''));
				available = 100;
			} else {
				earned = Number.parseFloat(score);
				if (typeof earned !== 'number' || Number.isNaN(earned)) continue;

				available = Number.parseFloat(
					grades.nextElementSibling.textContent.replace('/', '').trim()
				);
			}
		}

		let countsTowardFinalGrade =
			assignment
				.querySelector(
					'[aria-label="This assignment does not count toward the final grade."]'
				)
				.getAttribute('style') === 'visibility: hidden;';

		const comments = [];
		const table =
			assignment.nextElementSibling.nextElementSibling.nextElementSibling.querySelector(
				'td > table > tbody'
			);
		if (table) {
			for (const element of table.querySelectorAll('tr')) {
				let [comment, details] = element.querySelectorAll('td');
				let text = comment.querySelector('span').textContent;
				let [name, ...date] = details.textContent.trim().split(',');
				date = parseCanvasDate(date.join(',').trim());
				comments.push({
					text,
					name: name.trim(),
					date,
				});
			}
		}

		assignments.push({
			earned,
			available,
			countsTowardFinalGrade,
			title,
			group,
			due,
			submitted,
			comments,
		});
	}

	return assignments;
}

function calculate() {
	const weights = getWeights();
	const assignments = getAssignments();

	if (assignments.length === 0) {
		console.warn('No graded assignments found!');
		return;
	}

	/* eslint-disable unicorn/prevent-abbreviations, unicorn/no-array-reduce */
	// Convert assignments array into an object of type { [category]: { totalEarned: number, totalAvailable: number }].
	const totalsPerGroup = assignments
		.filter((assignment) => assignment.countsTowardFinalGrade)
		.reduce((acc, { group, earned, available }) => {
			acc[group] = acc[group] || { totalEarned: 0, totalAvailable: 0 };
			acc[group].totalEarned += earned;
			acc[group].totalAvailable += available;
			return acc;
		}, {});
	/* eslint-enable */

	// Convert available out of total for each group into percentage values.
	const groupPercentages = {};
	for (const group in totalsPerGroup) {
		const { totalEarned, totalAvailable } = totalsPerGroup[group];
		groupPercentages[group] = (totalEarned / totalAvailable) * 100 || undefined;
	}

	let grade = 0;
	if (Object.entries(weights).length === 0) {
		// No weights, so we can just take total earned and available combined from all groups and get the percentage.
		console.log('Assignment groups / categories are not weighted.');
		let totalAvailable = 0;
		let totalEarned = 0;
		for (const group of Object.values(totalsPerGroup)) {
			totalEarned += group.totalEarned;
			totalAvailable += group.totalAvailable;
		}
		grade = (totalEarned / totalAvailable) * 100;
	} else {
		// Weights, so multiply each group's percentage by that group's weight and add to total, while keeping in mind that with some groups lacking assignments not all weights will be used (so use sum of weights given as denominator).
		let totalWeights = 0;
		for (const group in groupPercentages) {
			grade += groupPercentages[group] * weights[group];
			totalWeights += weights[group];
		}
		grade = grade / totalWeights;
	}

	return { grade: grade.toFixed(2), assignments };
}

function exportAndDownloadAssignments(assignments) {
	const course = document.querySelector('#course_select_menu').value;
	downloadFile(
		JSON.stringify(assignments),
		toKebabCase(course) + '-assignments.json'
	);
}

function ensureOnCanvasGrades() {
	if (!document.querySelector('.ic-app-main-content')) {
		throw new Error('Not on Canvas!');
	}
	if (!document.querySelector('#grade-summary-content')) {
		throw new Error('Not on grades page!');
	}
}

GM_registerMenuCommand('Export assignments', () => {
	ensureOnCanvasGrades();
	exportAndDownloadAssignments(calculate().assignments);
});

const result = calculate();

if (result) {
	console.log(result);
	(
		document.querySelector('#student-grades-final') ||
		document.querySelector('.student_assignment.final_grade')
	).outerHTML = `<div class="student_assignment final_grade">Total: <span class="grade">${result.grade}%</span></div>`;
}
