// ==UserScript==
// @name        FA Hours Highlight
// @namespace   https://violentmonkey.github.io
// @version     1.1.0
// @description Highlight overtime and start times if they are over a certain threshold.
// @author      Anton Grouchtchak
// @match       https://office.roofingsource.com/admin/Dispatch.php*
// @icon        https://office.roofingsource.com/images/roofing-source-logo.png
// @license     GPLv3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/511809/FA%20Hours%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/511809/FA%20Hours%20Highlight.meta.js
// ==/UserScript==

/* globals $ */

(() => {
	"use strict";

	const WARNING_HOURS = 40;
	const DANGER_HOURS = 50;
	const LATE_START_TIME = "07:30 AM";

	const base = new Date();
	base.setHours(0, 0, 0, 0); // Ensure that the sec and ms are zeroed for all future dates.

	const COLORS = {
		WARNING: { background: "#fef08a", text: "#713f12" },
		DANGER: { background: "#fecaca", text: "#7f1d1d" },
	};

	// Convert HH:MM format to decimal hours (15:18	-> 15.3).
	const timeStringToHours = (timeString) => {
		if (!timeString) {
			return 0;
		}

		const [hours, minutes] = timeString.split(":").map(Number);
		return hours + minutes / 60 || 0;
	};

	// Parse time string to Date object.
	const parseTimeString = (timeString) => {
		const [time, period] = timeString.split(" ");
		const [hours, minutes] = time.split(":").map(Number);

		let hour24 = hours % 12;
		if (period === "PM") {
			hour24 += 12;
		}

		const date = new Date(base.getTime());
		date.setHours(hour24, minutes, 0, 0);
		return date;
	};

	// Style cell based on hours.
	const styleCellBasedOnHours = (cell, hours) => {
		let style = null;

		if (hours >= DANGER_HOURS) {
			style = COLORS.DANGER;
		} else if (hours >= WARNING_HOURS) {
			style = COLORS.WARNING;
		}

		if (!style) return;

		cell.css("background-color", style.background);
		cell.find("a").css("color", style.text);
	};

	const LATE_START_TIME_DATE = parseTimeString(LATE_START_TIME);

	// Style cell based on start time.
	const styleCellBasedOnStartTime = (cell, startTime) => {
		if (startTime > LATE_START_TIME_DATE) {
			cell.css("background-color", COLORS.DANGER.background);
			cell.css("color", COLORS.DANGER.text);
		}
	};

	// Process a row in the hours table.
	const processHoursRow = (row) => {
		const cells = row.find("td");
		if (cells.length !== 5) return;

		const wk1Cell = cells.eq(3);
		const wk2Cell = cells.eq(4);

		const wk1Hours = timeStringToHours(wk1Cell.text().trim());
		const wk2Hours = timeStringToHours(wk2Cell.text().trim());

		styleCellBasedOnHours(wk1Cell, wk1Hours);
		styleCellBasedOnHours(wk2Cell, wk2Hours);
	};

	// Process a row in the start time table.
	const processStartTimeRow = (row) => {
		const cells = row.find("td");
		if (cells.length !== 3) return;

		const startTimeCell = cells.eq(2);
		const startTime = parseTimeString(startTimeCell.text().trim());
		styleCellBasedOnStartTime(startTimeCell, startTime);
	};

	// Process hours tables.
	const processHoursTable = (table) => {
		table.find("tr:gt(0)").each((_, row) => processHoursRow($(row)));
	};

	// Process start time table.
	const processStartTimeTable = (table) => {
		table.find("tr:gt(0)").each((_, row) => processStartTimeRow($(row)));
	};

	// FA and Crew tables.
	const hoursTableFA = $("#fa-techs-table");
	const hoursTableCrew = $("#crew-techs-table");

	// Today's Hours table.
	const startTimeTable = $("#todays-hours-table");

	$(document).on("ajaxComplete", (_event, _xhr, settings) => {
		if (settings.url !== "Ajax/AjaxDispatchTechStatus.php") return;

		// If Jquery objects exist, parse the tables.
		if (hoursTableFA.length) {
			processHoursTable(hoursTableFA);
		}

		if (hoursTableCrew.length) {
			processHoursTable(hoursTableCrew);
		}

		if (startTimeTable.length) {
			processStartTimeTable(startTimeTable);
		}
	});
})();
