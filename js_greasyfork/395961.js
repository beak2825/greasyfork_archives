// ==UserScript==
// @name         OnCampusTweaks
// @namespace    https://*.myschoolapp.com
// @version      0.9.5
// @description  Change the way any myschoolappp based student website behaves.
// @author       Zack Sargent & N3
// @match        https://*.myschoolapp.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395961/OnCampusTweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/395961/OnCampusTweaks.meta.js
// ==/UserScript==
// THIS CODE IS RELEASED UNDER THE MIT LICENSE
// Find it on github: https://github.com/zsarge/OnCampusTweaks

/*     START SETTINGS   */

// This controls whether grades should be shown
// automatically when the progress page is opened.
// Can be true or false.
const shouldAlwaysShowGrades = true;

// This controls whether the assignment center should
// change to week view when it loads.
// Can be true or false.
const shouldChangeToWeekView = true;

/*      END SETTINGS     */

// Set task index based on hostname.
const index = window.location.hostname === "elderhs.myschoolapp.com" ? 3 : 4;

// Runs when page is fully loaded
// The website is set up in a way that window.onload triggers before the page is fully loaded.
// Thus, we must check independently to see if the full page has loaded.
var checkExist = setInterval(function () {
	// if the string "assignment-center" is in the url
	if (window.location.href.indexOf("assignment-center") > -1) {
		if (
			document.readyState === "ready" ||
			document.readyState === "complete"
		) {
			if (shouldChangeToWeekView) {
				changeToWeekView();
			}
			hideCompletedTasks();
			clearInterval(checkExist);
			// Run only one time. not needed to run again as the website saves your preferences for that session
		}
	}
}, 100); //100 ms

function changeToWeekView() {
	// if the string "assignment-center" is in the url
	if (window.location.href.indexOf("assignment-center") > -1) {
		document.getElementById("week-view").click();
		console.log("OnCampusTweaks: Changed to week view");
	}
}

// Hides completed tasks automatically in the assignment center.
// Unfortunately, upon marking a assignment as completed, it will not
// disappear. However I am not going to mess with this as its most likely
// by design of the website and some people could prefer to still see it.
function hideCompletedTasks() {
	if (window.location.href.indexOf("assignment-center") > -1) {
		document.getElementById("filter-status").click();

		// Create a list of all of the button elements that appear when you filter by status
		var buttonElements = document.getElementsByClassName(
			"pull-left btn btn-xs btn-approve status-button active"
		);
		buttonElements[index].click(); // Hides Completed tasks

		// We have to get the buttons again because clicking on them changes the class structure
		buttonElements = document.getElementsByClassName(
			"pull-left btn btn-xs btn-approve status-button active"
		);
		buttonElements[index].click(); // Hides Graded tasks

		document.getElementById("btn-filter-apply").click();

		submitToVerify();

		console.log("OnCampusTweaks: Hid completed tasks");
	}
}

function alwaysShowGrades() {
	if (window.location.href.indexOf("progress") > -1) {
		document.getElementById("showGrade").click();
		console.log("OnCampusTweaks: Grades Shown");
	}
}

// Sometimes the built in function does not work very well, so we have to try again.
function submitToVerify() {
	document.getElementById("filter-status").click();
	document.getElementById("btn-filter-apply").click();
}

// -------------------
// GPA Calculator
// -------------------

var checkGrades = setInterval(function () {
	// if the string "progress" is in the url
	if (window.location.href.indexOf("progress") > -1) {
		if (
			document.readyState === "ready" ||
			document.readyState === "complete"
		) {
			let courseDiv = document.getElementById("courses");
			let gradesArray = courseDiv.innerText.match(
				/([0-9][0-9][0-9]|[0-9][0-9])\%/gi
			);
			showGradeAverage(gradesArray);

			if (shouldAlwaysShowGrades) {
				alwaysShowGrades();
			}
		}
	}
}, 500); // check every 500ms

function showGradeAverage(gradesArray) {
	if (gradesArray) {
		runOnce(() => {
			let gpaDiv = getGPADiv();
			let gpa = getGPA(gradesArray);
			gpaDiv.textContent += `Grade Average: ${gpa}%\n | `;

			for (var i = 0; i < gradesArray.length; i++) {
				gradesArray[i] = parseInt(gradesArray[i]);
			}

			let min = Math.min(...gradesArray);
			gpaDiv.textContent += `Lowest grade: ${min}%\n | `;

			let max = Math.max(...gradesArray);
			gpaDiv.textContent += `Highest grade: ${max}%\n`;

			console.log(
				"OnCampusTweaks: Calculated and retrieved grade information"
			);
		});
	}
}

var hasRun = false;
function runOnce(func) {
	if (!hasRun) {
		func();
		hasRun = true;
	}
}

function getGPA(gradesArray) {
	const average = (array) => array.reduce((a, b) => a + b) / array.length;

	// turn array of strings into array of ints
	for (var i = 0; i < gradesArray.length; i++) {
		gradesArray[i] = gradesArray[i].replace("%", "");
		gradesArray[i] = parseInt(gradesArray[i]);
	}

	let gpa = average(gradesArray);
	return Math.round(gpa * 100) / 100;
	// round to two decimal places
}

function getGPADiv() {
	// Re-purposes unused Performance Div
	let div = document.createElement("div");
	div.id = "custom-grades";
	let performance = document.getElementById("performanceCollapse");
	performance.appendChild(div);
	return document.getElementById("custom-grades");
}
