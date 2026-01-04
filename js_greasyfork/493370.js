// ==UserScript==
// @name         CTU Extend
// @namespace    https://psushko.com
// @homepage     https://github.com/Pavel-Sushko/ctu-extend
// @website      https://psushko.com
// @source       https://github.com/Pavel-Sushko/ctu-extend
// @version      0.2.0
// @description  Extends the functionality of the CTU website
// @author       Pavel Sushko <github@psushko.com>
// @license      MIT
// @match        https://studentlogin.coloradotech.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coloradotech.edu
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/493370/CTU%20Extend.user.js
// @updateURL https://update.greasyfork.org/scripts/493370/CTU%20Extend.meta.js
// ==/UserScript==

GM_addElement('script', {
	src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.1/math.js',
	type: 'text/javascript',
});

const PAGES = {
	home: /^https?:\/\/studentlogin\.coloradotech\.edu\/\?.+#\/home\/active\/all$/i,
	gradebook: /^https?:\/\/studentlogin\.coloradotech\.edu\/\?.+#\/class\/\d+\/gradebook$/i,
	degreePlan: /^https?:\/\/studentlogin\.coloradotech\.edu\/\?.+#\/portal\/my-program\/degree-plan$/i,
};

// #region DOM Manipulation

/**
 * Get the first element that contains the lookup string
 *
 * @param {String} tag The tag to search for
 * @param {String} lookupString The string to search for
 * @returns {Element} The first element that contains the lookup string
 */
const getElement = (tag, lookupString) => {
	for (const element of document.querySelectorAll(tag))
		if (element.textContent.includes(lookupString)) return element;
};

// Function to create a tooltip
const createTooltip = (element, tooltipText) => {
	const tooltip = document.createElement('span');
	tooltip.className = 'tooltip-text';
	tooltip.innerText = tooltipText;

	element.style.position = 'relative';
	element.appendChild(tooltip);

	element.onmouseover = () => {
		tooltip.style.visibility = 'visible';
		tooltip.style.opacity = '1';
	};

	element.onmouseout = () => {
		tooltip.style.visibility = 'hidden';
		tooltip.style.opacity = '0';
	};
};

// Add CSS for tooltip
const addTooltipStyles = () => {
	const style = document.createElement('style');
	style.innerHTML = `
		.tooltip-text {
			visibility: hidden;
			width: 120px;
			background-color: black;
			color: #fff;
			text-align: center;
			border-radius: 6px;
			padding: 5px 0;
			position: absolute;
			z-index: 1;
			bottom: 110%; /* Position the tooltip above the text */
			left: 50%;
			margin-left: -60px;
			opacity: 0;
			transition: opacity 0.3s;
		}

		.tooltip-text::after {
			content: '';
			position: absolute;
			top: 100%; /* At the bottom of the tooltip */
			left: 50%;
			margin-left: -5px;
			border-width: 5px;
			border-style: solid;
			border-color: black transparent transparent transparent;
		}

		.tooltip:hover .tooltip-text {
			visibility: visible;
			opacity: 1;
		}
	`;
	document.head.appendChild(style);
};

const createId = (string) =>
	string
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s/g, '-')
		.replace(/-+/g, '-');

// #endregion

// #region Page Handlers

/**
 * Handles the home page
 */
const handleHome = async () => {
	addTooltipStyles();

	const SELECTORS = {
		earnedCredit: '.credit-item-title',
		requiredCredit: '.credits-required',
		donut: 'pec-donut-chart',
	};

	let creditsEarnedElement = document.querySelector(SELECTORS.earnedCredit);
	let creditsRequiredElement = document.querySelector(SELECTORS.requiredCredit);
	let donut = document.querySelector(SELECTORS.donut);

	while (!creditsEarnedElement || !creditsRequiredElement || !donut) {
		await new Promise((r) => setTimeout(r, 100));

		creditsEarnedElement = document.querySelector(SELECTORS.earnedCredit);
		creditsRequiredElement = document.querySelector(SELECTORS.requiredCredit);
		donut = document.querySelector(SELECTORS.donut);
	}

	const result = math.evaluate(creditsEarnedElement.innerText + creditsRequiredElement.innerText) * 100;
	const resultPercentage = `${result.toFixed(2)}%`;

	createTooltip(donut, resultPercentage);

	// TODO: Create honours tracking
};

/**
 * Handles the gradebook page
 */
const handleGradebook = async () => {
	const gradeThresholds = [
		{ grade: 'A', threshold: 94 },
		{ grade: 'A-', threshold: 90 },
		{ grade: 'B+', threshold: 86 },
		{ grade: 'B', threshold: 83 },
		{ grade: 'B-', threshold: 80 },
		{ grade: 'C+', threshold: 76 },
		{ grade: 'C', threshold: 73 },
		{ grade: 'C-', threshold: 70 },
		{ grade: 'D+', threshold: 65 },
		{ grade: 'D', threshold: 60 },
		{ grade: 'F', threshold: 0 },
	];

	let addedPoints = 0;

	// #region Grade Calculations

	/**
	 * Get the current absolute grade percentage
	 *
	 * @param {Number} earnedPoints
	 * @param {Number} maxPoints
	 * @returns {Number} The current absolute grade percentage
	 */
	const getPercentage = (earnedPoints, maxPoints) => (earnedPoints / maxPoints) * 100;

	/**
	 * Get the letter grade based on the percentage
	 *
	 * @param {Number} percentage
	 * @returns {String} The letter grade
	 */
	const getLetterGrade = (percentage) =>
		gradeThresholds.find(({ threshold }) => percentage >= threshold)?.grade || 'Grade not found';

	/**
	 * Get the points needed to get an A
	 *
	 * @param {Number} earnedPoints
	 * @param {Number} maxPoints
	 * @returns {Number} The points needed to get an A
	 */
	const getPointsToA = (earnedPoints, maxPoints) =>
		Math.max(0, maxPoints * (gradeThresholds[0].threshold / 100) - earnedPoints);

	// #endregion

	// #region Main

	/**
	 * Get the points from the lookup string
	 *
	 * @param {String} lookupString
	 * @param {Boolean} child
	 * @returns {Number} The points from the lookup string
	 */
	const getPoints = async (lookupString, child) => {
		let span = getElement('span', lookupString);

		while (!span) {
			await new Promise((r) => setTimeout(r, 100));
			span = getElement('span', lookupString);
		}

		let spanText = child ? span.querySelector('span').innerText : span.nextElementSibling.innerText;

		return Number(spanText.includes('N/A') ? '0' : spanText);
	};

	// Define earnedPoints and maxPoints first
	let earnedPoints = await getPoints('Points Earned to Date:', true);
	let maxPoints = await getPoints('Total Points Possible in Course:');

	/**
	 * Append the grade to the page
	 *
	 * @param {Number} earnedPoints
	 * @param {Number} maxPoints
	 */
	const appendGrade = () => {
		const gradeDiv = getElement('strong', 'Current Course Grade:').parentElement;
		const absoluteGradeDiv = gradeDiv.cloneNode(true);

		const percentage = getPercentage(earnedPoints, maxPoints);
		const grade = getLetterGrade(percentage);

		absoluteGradeDiv.querySelector('strong').innerText = 'Absolute Course Grade:';
		absoluteGradeDiv.querySelector('span').innerText = `${grade} (${getPointsToA(earnedPoints, maxPoints).toFixed(
			2
		)} points to A)`;

		const bottomDiv = absoluteGradeDiv.querySelector('div');
		bottomDiv.innerHTML = bottomDiv.innerHTML.replace(/\/\s[^<]+/, `/ ${maxPoints} `).replace(' to Date', '');

		gradeDiv.after(absoluteGradeDiv);
	};

	/**
	 * Update the grade display when points are added/removed
	 *
	 * @param {Number} addedPoints
	 * @param {Number} earnedPoints
	 * @param {Number} maxPoints
	 */
	const updateGrade = (addedPoints) => {
		const updatedPercentage = getPercentage(earnedPoints + addedPoints, maxPoints);
		const updatedGrade = getLetterGrade(updatedPercentage);

		const absoluteGradeDiv = getElement('strong', 'Absolute Course Grade:').parentElement;
		absoluteGradeDiv.querySelector('span').innerText = `${updatedGrade} (${getPointsToA(
			earnedPoints + addedPoints,
			maxPoints
		).toFixed(2)} points to A)`;
	};

	/**
	 * Add a checkbox to each row to allow adding/removing points to the grade
	 *
	 * @param {HTMLElement} row
	 */
	const addCheckbox = (row) => {
		const td = document.createElement('td');

		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.id = createId(row.firstElementChild.innerText);
		checkbox.checked = false;

		checkbox.onclick = () => {
			let assignmentEarnedPoints = Number(row.children[3].innerText.replace(/[^0-9.]/g, ''));
			let possiblePoints = Number(row.children[4].innerText.replace(/[^0-9.]/g, ''));

			if (assignmentEarnedPoints !== 0) possiblePoints -= assignmentEarnedPoints;

			addedPoints += checkbox.checked ? possiblePoints : -possiblePoints;

			// Update the grade
			updateGrade(addedPoints);
		};

		td.appendChild(checkbox);
		row.prepend(td);
	};

	/**
	 * Add a new column to the grade table for checkboxes
	 *
	 * @param {HTMLElement} table
	 * @param {String} header
	 */
	const addColumn = (table, header) => {
		const th = document.createElement('th');
		th.innerText = header;

		table.querySelector('thead tr').prepend(th);

		for (const row of table.querySelectorAll('tbody tr')) {
			addCheckbox(row);
		}
	};

	appendGrade();
	addColumn(document.querySelector('table'), 'Add to Grade');
};

// #endregion

// #endregion

/**
 * Handles the degree plan page
 */
const handleDegreePlan = async () => {
	addTooltipStyles();

	const SELECTORS = {
		earnedCredit: '.credit-item-title',
		requiredCredit: '.credits-required',
		donut: 'div.hide-on-mobile pec-donut-chart',
	};

	let creditsEarnedElement = document.querySelector(SELECTORS.earnedCredit);
	let creditsRequiredElement = document.querySelector(SELECTORS.requiredCredit);
	let donut = document.querySelector(SELECTORS.donut);

	while (!creditsEarnedElement || !creditsRequiredElement) {
		await new Promise((r) => setTimeout(r, 100));

		creditsEarnedElement = document.querySelector(SELECTORS.earnedCredit);
		creditsRequiredElement = document.querySelector(SELECTORS.requiredCredit);
	}

	const result = math.evaluate(creditsEarnedElement.innerText + creditsRequiredElement.innerText) * 100;
	const resultPercentage = `${result.toFixed(2)}%`;

	let creditsSpan = getElement('span', 'Credits Earned');

	while (!creditsSpan) {
		await new Promise((r) => setTimeout(r, 100));

		creditsSpan = getElement('span', 'Credits Earned');
	}

	while (!donut) {
		await new Promise((r) => setTimeout(r, 100));

		donut = document.querySelector(SELECTORS.donut);
	}

	creditsSpan.innerHTML += ` (${resultPercentage})`;
	createTooltip(donut, resultPercentage);
};

/**
 * Handles the pages
 */
const handlePages = async () => {
	let prevPage = '';

	while (true) {
		if (prevPage !== window.location.href) {
			switch (true) {
				case PAGES.home.test(window.location.href):
					await handleHome();
					break;
				case PAGES.gradebook.test(window.location.href):
					await handleGradebook();
					break;
				case PAGES.degreePlan.test(window.location.href):
					await handleDegreePlan();
					break;
				default:
					break;
			}
		}

		prevPage = window.location.href;

		await new Promise((r) => setTimeout(r, 300));
	}
};

// #endregion

/**
 * Entry point
 */
(async function () {
	handlePages();
})();
