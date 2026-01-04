// ==UserScript==
// @name         Mission Motorcycle Booking Helper
// @namespace    https://github.com/jsnfwlr/missionmotorcycle
// @version      0.1.1
// @description  Help motorcyclists get a booking at one of the WA DOT Centers.
// @author       jsnfwlr <jason@jsnfwlr.com>
// @match        https://online.transport.wa.gov.au/pdabooking/manage/wicket/page*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423038/Mission%20Motorcycle%20Booking%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/423038/Mission%20Motorcycle%20Booking%20Helper.meta.js
// ==/UserScript==
//
// Once you've successfully logged in to the PDA booking site, this userscript will
// add the dialog shown in the screenshot, allowing you to automatically check for
// available time slots that meet your preferred dates and times. Once you click Go
// the script will continue to check each of the selected centres every 5 minutes
// until a time slot is found or you click Stop.
// Once a time slot is found, it will be selected and confirmed for you. If multiple
// time slots are found, the first one that meets your criteria will be booked for
// you.
// Given the poor availability of time slots, it is suggested you make a booking
// for any time slot you can get then use this userscript to try and get a better
// booking.

(function () {
	'use strict';
	const missionSiteCode = "select[name$=':siteCode']";
	const missionSearchBtn = "input[value='Search']";
	const missionSearchResult = "input[name$=':searchResultGroup']";
	const missionCenterCodes = "select[name$=':siteCode'] option";
	const missionConfirmBtn = "input[value='Confirm Booking']";
	var missionTimer
	function missionSleep (ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	async function missionSearch (centers, afterDate) {
		let center = centers[0];
		for (let index = 0; index < centers.length; index++) {
			center = centers[index];
			// console.log("Setting center to " + center);
			$(missionSiteCode).val(center);
			$(missionSiteCode).change();
			await missionSleep(2000);
			$(missionSearchBtn).click();
			// console.log("Searching for available time slots at " + center);
			await missionSleep(2000);
			if ($(missionSearchResult).length > 0) {
				// console.log("Found some time slots at " + center);
				let regex = /(\d\d)\/(\d\d)\/(\d\d\d\d)\s+at\s+(\d+):(\d+)\s+(\w+)/g
				$(missionSearchResult).each((i, e) => {
					let matches = [];
					while ((matches = regex.exec($(e).next().text())) !== null) {
						let testDate = new Date(matches[2] + "/" + matches[1] + "/" + matches[3] + " " + matches[4] + ":" + matches[5] + ":00 " + matches[6])
						if (Date.parse((testDate).toString()) >= Date.parse((afterDate).toString()) && (testDate.getHours() >= afterDate.getHours() && testDate.getMinutes() >= afterDate.getMinutes())) {
							window.clearInterval(missionTimer)
							$(e).click()
							$(missionConfirmBtn).click()
						}
					}
				});
			}
		}
	}

	function getMissionDaysOfMonth () {
		let days31 = ["Jan", "Mar", "May", "Jul", "Aug", "Oct", "Dec"];
		let DaysOfMonth = "";
		for (var i = 1; i < 29; i++) {
			DaysOfMonth += "<option value='" + i + "'>" + i + "</option>";
		}
		if ($("#missionMonth").val() != "Feb" || ($("#missionYear").val() % 4) == 0) {
			DaysOfMonth += "<option value='29'>29</option>";
		}
		if ($("#missionMonth").val() != "Feb") {
			DaysOfMonth += "<option value='30'>30</option>";
		}
		if (days31.includes($("#missionMonth").val())) {
			DaysOfMonth += "<option value='31'>31</option>";
		}
		$("#missionDay").html(DaysOfMonth);
	}

	function getMissionCenters () {
		let options = "";
		$(missionCenterCodes).each((i, e) => {
			if ($(e).val() != "") {
				if ($(e).val() == "KELM" || $(e).val() == "SUC" || $(e).val() == "CAN") {
					options += "<label style='display: inline-block; margin-right: 1em;'><input type='checkbox' name='missionCenter' checked='checked' value='" + $(e).val() + "' />" + $(e).text() + "</label>";
				} else {
					options += "<label style='display: inline-block; margin-right: 1em;'><input type='checkbox' name='missionCenter' value='" + $(e).val() + "' />" + $(e).text() + "</label>";
				}
			}
		})
		return options;
	}

	function sortMissionCeners (a, b) {
		if (a === "KELM") {
			return -1
		} else if (b === "KELM") {
			return 1
		} else if (a === "SUC") {
			return -1
		} else if (b === "SUC") {
			return 1
		} else if (a === "CAN") {
			return -1
		} else if (b === "CAN") {
			return 1
		}
		return 1
	}

	function runMissionSearch () {
		if (missionTimer != undefined) {
			window.clearInterval(missionTimer)
			missionTimer = undefined
			$("#missionGo").html("Go");
		} else {
			$("#missionGo").html("Stop");
			let afterDate = new Date($("#missionDay").val() + " " + $("#missionMonth").val() + " " + $("#missionYear").val() + " " + $("#missionHour").val() + ":" + $("#missionMinute").val() + ":00 " + $("#missionNoon").val())
			let centers = [];
			$("#missionBooking input[name='missionCenter']:checked").each((i, e) => {
				centers.push($(e).val())
			})
			centers.sort(sortMissionCeners)

			missionSearch(centers, afterDate)
			missionTimer = window.setInterval((() => { missionSearch(centers, afterDate) }), 30000)
		}
	}

	function addMissionDialog () {
		$('body #missionBooking').remove()
		let dialog = "<div style='position: fixed; top: 0; right: 0; width: 100%; background: #dedede;' id='missionBooking'>" +
			"<span class='section-title' style='margin: 0'>Mission Motorcycle Training Booking Helper</span>" +
			"<div style='padding: 1em; display: flex; flex-wrap: nowrap;'>" +
			"<div style='flex: 1 1 100%;'>" +
			"<div style=''>" +
			"I would like to book a test after " +
			"<select id='missionMonth'><option value='Jan'>Jan</option><option value='Feb'>Feb</option><option value='Mar'>Mar</option><option value='Apr'>Apr</option><option value='May'>May</option><option value='Jun'>Jun</option><option value='Jul'>Jul</option><option value='Aug'>Aug</option><option value='Sep'>Sep</option><option value='Oct'>Oct</option><option value='Nov'>Nov</option><option value='Dec'>Dec</option></select>&nbsp;" +
			"<select id='missionDay'></select>&nbsp;" +
			"<select id='missionYear'><option value='" + new Date().getFullYear() + "'>This year</option><option value='" + (new Date().getFullYear() + 1) + "'>Next year</option></select>&nbsp;" +
			" no earlier than " +
			"<input type='text' id='missionHour' value='7' style='width: 3em' />:<input type='text' id='missionMinute' value='00' style='width: 3em' /> <select id='missionNoon'><option value='AM'>AM</option><option value='PM'>PM</option></select>" +
			"</div>" +
			"<div style=''>" + getMissionCenters() + "</div>" +
			"</div>" +
			"<div style='flex: 1 1 100px'> " +
			"<div id='missionGo' class='licensing-button-short' style='margin: 0 1em'>Go</div>" +
			"</div>" +
			"</div>" +
			"</div>";
		$('body').append(dialog);
		$('#missionYear').change(function () {
			getMissionDaysOfMonth();
		});
		$('#missionMonth').change(function () {
			getMissionDaysOfMonth();
		});
		$('#missionGo').click(function () {
			runMissionSearch();
		})
		getMissionDaysOfMonth();
	}

	addMissionDialog();

})();
