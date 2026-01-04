// ==UserScript==
// @name         Infiniti Service Schedule Automater
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  Infiniti West Chester Service Schedule Automater. Creates a button on a vehicle's RO page which when clicked, will check for scheduled services (brake fluid, coolant, spark plugs, etc.) based on whether services haven't been recommended in scheduled time or if services were previously declined and vehicle is currently still due.
// @author       Peter Savarese
// @match        https://menu.flathatsystems.com/merlin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flathatsystems.com
// @grant        GM_xmlhttpRequest
// @grant 	  	 GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/497493/Infiniti%20Service%20Schedule%20Automater.user.js
// @updateURL https://update.greasyfork.org/scripts/497493/Infiniti%20Service%20Schedule%20Automater.meta.js
// ==/UserScript==

/**
 * Represents an RO repair suggestion line.
 *
 * @class
 * @classdesc Represents a car and its attributes.
 * @property {number} mileage Mileage of car at time of repair suggestion.
 * @property {string} ro RO number repair suggestion was madeon.
 * @property {string} date Date of repair suggestion.
 * @property {boolean} wasDeclined Whether repair suggestion was declined.
 * @property {string} tech Technician who made repair suggestion.
 * @property {boolean} manuallyCorrelated True if repair suggestion had no opcode and was manually correlated based on correction line.
 * @property {string} correction Correction line of repair suggestion.
 */
class Service {
	constructor(mileage, ro, date, wasDeclined, tech, manuallyCorrelated, correction, opcode) {
		this.mileage = mileage;
		this.roNumber = ro;
		this.date = new Date(date); // Assuming date is passed as a string
		this.wasDeclined = wasDeclined;
		this.tech = tech;
		this.manuallyCorrelated = manuallyCorrelated;
		this.correction = correction;
		this.opcode = opcode;
	}
}

class Car {
	constructor(make, model, year, engine, lastOilChangeMileage, lastOilChangeDate, tireSpecs, brakeSpecs, ignore) {
		this.make = make;
		this.model = model;
		this.year = year;
		this.engine = engine;

		this.lastOilChangeMileage = lastOilChangeMileage;
		this.lastOilChangeDate = lastOilChangeDate;
		this.tireSpecs = tireSpecs;
		this.brakeSpecs = brakeSpecs;
		this.ignore = ignore;
	}
}

	(function () {
		'use strict';

		let debugCurCarInfo;
		let serviceSchedule; // Updated by fetch request upon initial load
		let wasBtnPressedGlobal = false; // Hacky fix so that modal auto opens when check scheduled services btn is clicked
		let currentCarROs = {};
		let currentCarPrevRecs = {};
		let currentMenuId = 0; // Updated by 'initInterceptMenuId' function
		let currentCarInfo = {
			"make": "",
			"model": "",
			"year": 0,
			"engine": "",
			"lastOilChangeMileage": new Date(0),
			"lastOilChangeDate": 0,
			"tireSpecs": {
				"lastTireSpecDate": new Date(0),
				"tireSpecResults": {
					"frontLeft": "",
					"frontRight": "",
					"rearLeft": "",
					"rearRight": ""
				}
			},
			"brakeSpecs": {
				"lastBrakeSpecDate": new Date(0),
				"brakeSpecResults": {
					"frontLeft": "",
					"frontRight": "",
					"rearLeft": "",
					"rearRight": ""
				}
			},
			"ignore": false
		}

		function displayAlert(message) {
			alert(`(IOWC Service Schedule Automater) ${message}`);
		}

		function displayAlertChoice(message, tureCallback, falseCallback) {
			if (confirm(`(IOWC Service Schedule Automater) ${message}`)) {
				tureCallback();
			} else {
				falseCallback();
			}
		}

		/**
		 * Correlates correction string to an opcode based off keywords in correction line text.
		 * 
		 * @param {string} correctionStr - Correction line text entered string.
		 * @returns {string|undefined} Correlated opcode. Null or undefined if the correction string is doesn't have keywords to extract, empty, null.
		 */
		function correlateOpCode(correctionStr, mileage, date) {
			if (correctionStr === "" || correctionStr == null) { return; }
			correctionStr = correctionStr.toLowerCase();

			if (correctionStr.includes("w0003") || correctionStr.includes("yw15aa") || (correctionStr.includes("engine") && correctionStr.includes("oil"))) {
				if (currentCarInfo.lastOilChangeMileage >= mileage || currentCarInfo.lastOilChangeDate >= date) { return; }
				
				currentCarInfo.lastOilChangeMileage = mileage;
				currentCarInfo.lastOilChangeDate = date;

				return;
			}

			const keywords = {
				PLUGS: [["spark", "plug"], ["plugs"]],
				MICRO: [["micro"], ["cabin"]],
				AIR: [["engine", "filter", "air"]],
				BFLUS: [["brake", "fluid"]],
				AWD: [["awd"], ["all wheel drive"], ["transfer case"], ["differential"]],
				BLUE: [["coolant", "drain"], ["coolant", "flush"], ["water pump"]],
				BELTS: [["drive", "belt"], ["serpentine", "belt"]],
				TFLUS: [["transmission", "fluid"], ["transmission", "flush"], ["transmission", "service"], ["cvt", "fluid"]],
			};

			// Used for excluding certain keywords from being correlated to an opcode. If an opcode is found with 
			// matching keywords, but also contains an excluded keyword, it will not be correlated.
			const excludedKeywords = {
				AWD: ["seal"],
			};

			correctionStr = correctionStr.toLowerCase();

			for (const [opCode, phrases] of Object.entries(keywords)) {
				for (const phrase of phrases) {
					if (phrase.every(word => correctionStr.includes(word)) || correctionStr.includes(opCode.toLocaleLowerCase())) {
						if (excludedKeywords[opCode] && excludedKeywords[opCode].some(keyword => correctionStr.includes(keyword))) {
							continue;
						}

						return opCode;
					}
				}
			}

			// console.log("Unable to correlate OPCODE for " + correctionStr);

			return;
		}

		/**
		 * Clears previous services for a given car model, year, and engine.
		 *
		 * @param {string} model
		 * @param {number} year
		 * @param {string} engine
		 */
		function clearServiceSchedule(model, year, engine) {
			let carServiceSchedule = getServiceSchedule(model, year, engine);

			if (carServiceSchedule === null) { return; }

			for (let opcode in carServiceSchedule) {
				carServiceSchedule[opcode].services = [];
			}
		}

		function checkForUpdateNotes() {
			var currentVersion = GM_info.script.version;
			var storedVersion = GM_getValue('version', '0');

			if (storedVersion !== currentVersion) {
				createUpdateNotesModal();
				GM_setValue('version', currentVersion);
			}
		}

		/**
		 * Process initial repair lines for when an RO was initially created, and adds them to the corresponding service schedule
		 * based off car model, year, engine, and opcode.
		 * 
		 * @param {*} initialROLines 
		 * @param {*} carServiceSchedule 
		 * @param {*} roInfo 
		 */
		function processInitialROLines(initialROLines, roInfo) {
			initialROLines.forEach(function (lineItem) {
				let carServiceSchedule = getServiceSchedule(currentCarInfo.model, currentCarInfo.year, currentCarInfo.engine);
				let lineOpCode = lineItem.opCode ? lineItem.opCode : lineItem.opcode; // Older ROs use 'opcode' instead of 'opCode'. Idk bro
				let lineOpCodeManuallyCorrelated = false;

				if (!carServiceSchedule[lineOpCode]) {
					if (lineOpCode == "included" || lineItem.type == "concern") {
						lineOpCode = correlateOpCode(lineItem.name ? lineItem.name : lineItem.description, roInfo.miles, roInfo.roDate); // Use description if name is empty, usually for lines that are marked type "concern"
					} else {
						lineOpCode = correlateOpCode(lineOpCode, roInfo.miles, roInfo.roDate);
					}

					lineOpCodeManuallyCorrelated = true;
				}

				if (!carServiceSchedule[lineOpCode]) { 
					// No associated service schedule for opcode. Add to list of recommendations with no opcode.

					return; 
				}

				let serviceItem = carServiceSchedule[lineOpCode];
				if (serviceItem.services.some(service => service.roNumber == roInfo.roNumber && service.opcode == lineOpCode)) { return }

				if (serviceItem.lastPerformedMiles < roInfo.miles || serviceItem.lastPerformedDate < roInfo.roDate) {
					serviceItem.lastPerformedMiles = roInfo.miles;
					serviceItem.lastPerformedDate = roInfo.roDate;
				}

				serviceItem.services.push(new Service(roInfo.miles, roInfo.roNumber, roInfo.roDate, false, roInfo.techName, lineOpCodeManuallyCorrelated, lineItem.description, lineOpCode));
			});
		}

		/**
		 * Process repair suggestion/additional lines on ROs, and adds them to the corresponding 
		 * service schedule based off car model, year, engine, and opcode.
		 * 
		 * @param {*} initialROLines 
		 * @param {*} carServiceSchedule 
		 * @param {*} roInfo 
		 */
		function processRORecommendationLines(recommendedLines, roInfo) {
			recommendedLines.forEach(function (lineItem) {
				let carServiceSchedule = getServiceSchedule(currentCarInfo.model, currentCarInfo.year, currentCarInfo.engine);

				if (!lineItem.inspectionLine) { return; }
				let lineInspectionLine = lineItem.inspectionLine;

				if (lineInspectionLine.cause == "" && lineInspectionLine.correction == null) { return; }

				let lineOpCode = lineInspectionLine.opcode ? lineInspectionLine.opcode : "";
				let lineOpCodeManuallyCorrelated = false;
				let wasDeclined = (lineItem.status === "declined") ? true : false;

				if (!carServiceSchedule[lineOpCode]) {
					lineOpCode = correlateOpCode(lineInspectionLine.correction, roInfo.miles, roInfo.roDate);
					lineOpCodeManuallyCorrelated = true;
				}

				// No associated service schedule for opcode

				if (!carServiceSchedule[lineOpCode]) {
					if (lineInspectionLine.cause == undefined || 
						lineInspectionLine.cause == "" ||
						lineInspectionLine.correction == undefined || 
						lineInspectionLine.correction == "" ||
						wasDeclined == false) { 
						return; 
					}
				 
					// No associated service schedule for opcode. Add to list of recommendations with no opcode.
					console.log(`$$ CAUSE $$ ${lineInspectionLine.cause} $WITH REC$ ${lineInspectionLine.correction} $DECLINED$ ${wasDeclined}`);

					if (!currentCarPrevRecs[roInfo.roNumber]) {
						currentCarPrevRecs[roInfo.roNumber] = {
							roInfo: {
								roNumber: roInfo.roNumber,
								miles: roInfo.miles,
								roDate: roInfo.roDate,
								tech: roInfo.techName
							},
							recommendations: []
						};
					}

					currentCarPrevRecs[roInfo.roNumber].recommendations.push({
						title: lineItem.title,
						cause: lineInspectionLine.cause,
						correction: lineInspectionLine.correction,
						partsList: JSON.parse(lineInspectionLine.partsList),
						wasDeclined: wasDeclined
					});

					return;
				}


				let serviceItem = carServiceSchedule[lineOpCode];
				if (serviceItem.services.some(service => service.roNumber == roInfo.roNumber && service.opcode == lineOpCode)) { return }

				if (!wasDeclined && (serviceItem.lastPerformedMiles < roInfo.miles || serviceItem.lastPerformedDate < roInfo.roDate)) {
					serviceItem.lastPerformedMiles = roInfo.miles;
					serviceItem.lastPerformedDate = roInfo.roDate;
				}

				serviceItem.services.push(new Service(roInfo.miles, roInfo.roNumber, roInfo.roDate, wasDeclined, roInfo.techName, lineOpCodeManuallyCorrelated, lineInspectionLine.correction, lineOpCode));
			});
		}

		/**
		 * Go through car service history after all raw info has been retrieved
		 * and process the service history.
		 */
		function processROLineReccomendations(isFromBtnClick) {
			let carServiceSchedule = getServiceSchedule(currentCarInfo.model, currentCarInfo.year, currentCarInfo.engine);

			if (carServiceSchedule === null) {
				currentCarInfo.ignore = true;

				displayAlertChoice(`Could not find service schedule for ${currentCarInfo.year} ${currentCarInfo.model} ${currentCarInfo.engine}\n\n Press "Ok" to select a different service schedule and/or report a missing make/model/year, or cancel to dismiss this alert.`, 
					function () {
						if ($("#serviceScheduleModal").length > 0) {
							$("#serviceScheduleModal").modal("hide");
						}
			
						openManualSelectCarModal();
					}, function() {}
				)

				return;
			}
		
			Object.keys(currentCarROs).forEach(function (key) {
				let roInfo = currentCarROs[key];
				let initialROLines = roInfo.initialROLines;
				let recommendedItems = roInfo.recommendedItems;

				processInitialROLines(initialROLines, roInfo.roInfo);
				processRORecommendationLines(recommendedItems, roInfo.roInfo);
			});

			console.log(currentCarROs)

			if (isFromBtnClick || wasBtnPressedGlobal) {
				createServiceHistoryModal();
				wasBtnPressedGlobal = false;
			}
		}

		/**
		 * Setups intercept for vehicle history AJAX requests and processes the response data.
		 * Processes and stores initial RO lines and repair suggestion lines, then shows modal to display service history.
		 */
		function initVehicleHistoryAjaxIntercept() {
			$(document).ajaxComplete(function (event, xhr, settings) {
				if (settings.url !== "/history/byMenuId/2477/?menuId=" + currentMenuId) { return; }
				if (Object.keys(currentCarROs).length > 0) { return; } // When an RO is expanded, it will make this same AJAX response even though RO history is already loaded.

				processHistoryBlocks(JSON.parse(replaceDateInJson(xhr.responseText)).data.visits);
			});
		}

		function processVisitNoMenu(parsedJson) {
			const visit = parsedJson.data.visit;
			let initialROLines = visit.ro.lines;

			let roInfo = {
				miles: visit.ro.mileageIn,
				roNumber: visit.ro.roNumber,
				roDate: visit.ro.date,
				techName: visit.ro.lines[0] && visit.ro.lines[0].dmsTech ? visit.ro.lines[0].dmsTech.name : "Unknown"
			}

			let arrToInsert = {
				roInfo: roInfo,
				initialROLines: initialROLines,
				recommendedItems: []
			};

			currentCarROs[roInfo.roNumber] = arrToInsert;

			// currentCarInfo.make = visit.menu.makeText;
			// currentCarInfo.model = visit.menu.modelText;
			// currentCarInfo.year = parseInt(visit.menu.yearText);
			// currentCarInfo.engine = JSON.parse(visit.menu.path)[3];
		}

		function processHistoryBlocks(visitHistory) {
			let promises = [];
			clearServiceSchedule(currentCarInfo.model, currentCarInfo.year, currentCarInfo.engine);

			Object.keys(visitHistory).forEach(function (key) {
				if (!visitHistory[key].ro) { return; }

				let repairOrderId = visitHistory[key].ro.id;

				let promise = new Promise(function (resolve, reject) {
					// Make ajax request using DMS repair order ID to fetch data for specific RO
					$.ajax({
						url: `/history/visit/2477/?menuId=&dmsRepairOrderId=${repairOrderId}`,
						method: "GET",
						success: function (response) {
							let parsedJson = JSON.parse(replaceDateInJson(response));
							debugCurCarInfo = parsedJson;

							if (!parsedJson.data || !parsedJson.data.visit || !parsedJson.data.visit.detail || !parsedJson.data.visit.detail.items) {
								processVisitNoMenu(parsedJson)
								
								resolve();
								return;
							}

							const visit = parsedJson.data.visit;
							let recommendedItems = visit.detail.items;
							let initialROLines = visit.menu.lines;

							let roInfo = {
								miles: visit.menu.miles,
								roNumber: visit.menu.roNumber,
								roDate: visit.ro.date,
								techName: visit.ro.lines[0] && visit.ro.lines[0].dmsTech ? visit.ro.lines[0].dmsTech.name : "Unknown"
							}

							currentCarInfo.make = visit.menu.makeText;
							currentCarInfo.model = visit.menu.modelText;
							currentCarInfo.year = parseInt(visit.menu.yearText);
							currentCarInfo.engine = JSON.parse(visit.menu.path)[3];

							// God help me.
							// TODO: FIND A BETTER WAY THAN WHATEVER THIS IS
							if (visit.detail && visit.detail.items && new Date(visit.ro.date) > currentCarInfo.tireSpecs.lastTireSpecDate) {
								let tireInspectionItem = visit.detail.items.find(item => item.title === "Tire Inspection");

								if (tireInspectionItem) {
									const tireInspecItemResults = tireInspectionItem.result.TreadDepth;

									if (tireInspecItemResults) {
										const frontLeft = tireInspecItemResults.FrontDriver.note ? tireInspecItemResults.FrontDriver.note : tireInspecItemResults.FrontDriver.measurements;
										const frontRight = tireInspecItemResults.FrontPassenger.note ? tireInspecItemResults.FrontPassenger.note : tireInspecItemResults.FrontPassenger.measurements;
										const rearLeft = tireInspecItemResults.BackDriver.note ? tireInspecItemResults.BackDriver.note : tireInspecItemResults.BackDriver.measurements;
										const rearRight = tireInspecItemResults.BackPassenger.note ? tireInspecItemResults.BackPassenger.note : tireInspecItemResults.BackPassenger.measurements;

										if (frontLeft && frontRight && rearLeft && rearRight) {
											currentCarInfo.tireSpecs.lastTireSpecDate = new Date(visit.ro.date);

											currentCarInfo.tireSpecs.tireSpecResults.frontLeft = frontLeft;
											currentCarInfo.tireSpecs.tireSpecResults.frontRight = frontRight;
											currentCarInfo.tireSpecs.tireSpecResults.rearLeft = rearLeft;
											currentCarInfo.tireSpecs.tireSpecResults.rearRight = rearRight;
										}
									}
								}
							}

							if (visit.detail && visit.detail.items && new Date(visit.ro.date) > currentCarInfo.brakeSpecs.lastBrakeSpecDate) {

								let frontBrakeItem = visit.detail.items.find(item => item.title === "Front Brakes");
								let rearBrakeItem = visit.detail.items.find(item => item.title === "Rear Brakes");

								if (frontBrakeItem.result.measurements && rearBrakeItem.result.measurements) {
									let frontBrakeItemMeasurements = frontBrakeItem.result.measurements;
									let rearBrakeItemMeasurements = rearBrakeItem.result.measurements;

									currentCarInfo.brakeSpecs.lastBrakeSpecDate = new Date(visit.ro.date);

									currentCarInfo.brakeSpecs.brakeSpecResults.frontLeft = frontBrakeItemMeasurements.driver.pad ? frontBrakeItemMeasurements.driver.pad : "N/A";
									currentCarInfo.brakeSpecs.brakeSpecResults.frontRight = frontBrakeItemMeasurements.passenger.pad ? frontBrakeItemMeasurements.passenger.pad : "N/A";
									currentCarInfo.brakeSpecs.brakeSpecResults.rearLeft = rearBrakeItemMeasurements.driver.pad ? rearBrakeItemMeasurements.driver.pad : "N/A";
									currentCarInfo.brakeSpecs.brakeSpecResults.rearRight = rearBrakeItemMeasurements.passenger.pad ? rearBrakeItemMeasurements.passenger.pad : "N/A";
								}
							}

							let arrToInsert = {
								roInfo: roInfo,
								initialROLines: initialROLines,
								recommendedItems: recommendedItems
							};

							currentCarROs[roInfo.roNumber] = arrToInsert;

							resolve();
						},
						error: function (xhr, status, error) {
							displayAlert(`AJAX GET request failure while fetching DMS Repair Order data:\n\n ${error} - ${status} - ${xhr.responseText}`);
							reject();
						}
					});
				});

				promises.push(promise);
			});

			Promise.all(promises).then(function () {
				processROLineReccomendations();
				promises = [];
			});
		}

		/*
		* Updates menu id for current page and clears repair history
		*
		* @param {number} menuId - Menu ID to update to.
		*/
		function updateMenuId(menuId) {
			if (menuId == currentMenuId) { return; }
		
			if ($("#serviceScheduleModal").length) {
				$("#serviceScheduleModal").remove();
			}

			console.log(`Menu ID changed from ${currentMenuId} to ${menuId}`);

			currentCarInfo.ignore = false; // TODO: Hacky way to reset the ignore flag when car is switched
			currentMenuId = menuId;
			currentCarROs = {};
			currentCarPrevRecs = {};

			// Shitty way to clear previous specs
			// TODO: Make better
			currentCarInfo.lastOilChangeDate = new Date(0);
			currentCarInfo.lastOilChangeMileage = 0;

			currentCarInfo.tireSpecs.lastTireSpecDate = new Date(0);
			Object.keys(currentCarInfo.tireSpecs.tireSpecResults).forEach(function(key) {
				currentCarInfo.tireSpecs.tireSpecResults[key] = "N/A";
			});

			currentCarInfo.brakeSpecs.lastBrakeSpecDate = new Date(0);
			Object.keys(currentCarInfo.brakeSpecs.brakeSpecResults).forEach(function(key) {
				currentCarInfo.brakeSpecs.brakeSpecResults[key] = "N/A";
			});
		}

		/**
		 * Intercepts `menuId` parameter from AJAX requests when an RO is loaded.
		 */
		function initInterceptMenuId() {
			$(document).ajaxSend(function (event, xhr, settings) {
				let menuIdMatch = settings.url.match(/(?:\?|&)menuId=([^&]*)&loginId=([^&]*)/);

				if (!menuIdMatch || menuIdMatch[1].length === 0) { return; }

				updateMenuId(menuIdMatch[1]);
			});
		}

		/**
		 * Retrieves service schedule for given car model, year, and engine.
		 *
		 * @param {string} model - Car model.
		 * @param {number} year - Car year.
		 * @param {string} engine - Car engine.
		 * @returns {object|null} - Service schedule for given car model, year, and engine, or null if not found.
		 */
		function getServiceSchedule(model, year, engine) {
			// Fuck you Infiniti, I'm not copying entire service schedules for 1 model year.
			// Map of model and year correlations
			const modelYearMap = {
				"JX35": { model: "QX60", year: 2014 },
				"JX 35": { model: "QX60", year: 2014 },
				"FX37": { model: "QX70", year: 2014 },
				"FX 37": { model: "QX70", year: 2014 },
				"Q60 COUPE": { model: "G37", year: 2015 },
				"Q70L": { model: "Q70", year: 2017 }
			};

			if (modelYearMap.hasOwnProperty(model)) {
				let newYear = modelYearMap[model].year // For some reason if year is sent directly to value in map, it just says its undefined :shrug:

				model = modelYearMap[model].model;
				year = newYear;
			}

			let modelSchedule = serviceSchedule[model];

			if (!modelSchedule) {
				return null;
			}

			for (let yearRange in modelSchedule) {
				let years = yearRange.split("-");
				let startYear = parseInt(years[0]);
				let endYear = parseInt(years[1]);

				if (year >= startYear && year <= endYear) {
					let engineSchedule = modelSchedule[yearRange][engine];

					if (engineSchedule) {
						return engineSchedule;
					}
				}
			}

			return null;
		}

		/**
		 * Replaces date strings in JSON string with ISO 8601 formatted date strings.
		 * Date strings in the format "new Date(...)" or "new: Date(...)" are replaced.
		 * If date string contains comma-separated values, its treated as an array of values.
		 * If date string is a single number, its treated as a timestamp.
		 * @param {string} json - JSON string to process.
		 * @returns {string} - JSON string with date strings replaced by ISO 8601 formatted date strings.
		 */
		function replaceDateInJson(json) {
			return json.replace(/new\s+(?::?Date)?\([^)]*\)/g, function (match) {
				let timestampMatch = match.match(/\(([^)]*)\)/);

				if (timestampMatch) {
					let timestamp = timestampMatch[1];

					if (timestamp.includes(",")) {
						let values = timestamp.split(",");

						return '"' + new Date(values[0], values[1], values[2], values[3], values[4], values[5], values[6]).toISOString() + '"';;
					} else {
						return '"' + new Date(parseInt(timestamp)).toISOString() + '"';
					}
				}
				return match;
			});
		}

		/*
		* Adds custom CSS to the page
		*/
		function addCustomCSS() {
			let css = `
				/* Header/Quick Actions Bar */
				.header-container {
						padding: 10px;
						background-color: #272532;
						color: white;
						transition: all 0.3s ease;
				}

				.header-content {
						display: flex;
						align-items: center;
						justify-content: space-between;
				}

				.logo-title {
						display: flex;
						align-items: center;
				}

				#headerImage {
						height: 100px;
						margin-right: 10px;
						transition: height 0.3s ease;
				}

				h2 {
						margin: 0;
				}

				.button-container {
						display: flex;
						gap: 10px;
						margin-top: 10px;
						transition: opacity 0.3s ease;
				}

				.toggle-button {
						background: none;
						border: none;
						color: white;
						font-size: 20px;
						cursor: pointer;
						padding: 5px;
						margin-top: 10px;
				}

				.collapsed .button-container {
						display: none;
				}

				.collapsed #headerImage {
						height: 50px;
				}

				.collapsed .toggle-button {
						transform: rotate(180deg);
				}

				.iowc-button {
					margin: 0 0 0 .5rem;
					padding: 10px 20px;
					background-color: #4CAF50;
					color: white;
					text-decoration: none;
					border: none;
					border-radius: 5px;
				}

				.iowc-button:disabled {
					background-color: rgb(96, 100, 101);
				}

				.check-scheduled-services-btn {
					width: fit-content;
					margin: 0px;
				}

				.recommend-btn-not-due {
					background-color: #FF9800;
				}

				.recommend-btn-is-due {
					background-color: #4CAF50;
				}

				.modal-body-header-container {
						display: flex;
						justify-content: center;
						align-items: flex-start;
						gap: 20px; /* This creates space between the items */
				}

				.modal-body-header-info {
						display: flex;
						flex-direction: column;
						align-items: center;
						width: 200px;
						border-radius: 4px;
						box-shadow: 0 0 8px rgba(0, 0, 0, .1), 0 0 0 1px #ccc;
						text-align: center; 
						padding: 20px;
						max-width: 300px; /* Adjust as needed */
				}
				
				.modal-body .accordion {
					width: 100%;
					margin: 5px auto;
					color: black;
					background-color: white;
					padding: 10px;
				}
				
				.modal-body .accordion .container {
					border-radius: 4px;
					position: relative;
					margin: 10px 10px;
					box-shadow: 0 0 8px rgba(0, 0, 0, .1), 0 0 0 1px #ccc;
				}
				
				.modal-warning {
					margin: 15px 20px;
					font-size: 1em;
					color: #333;
				}
				
				.modal-body .accordion .label {
					border-radius: 4px;
					background-color: #ecf0f4;
					position: relative;
					padding: 10px;
					font-size: 1em;
					color: #333;
					cursor: pointer;
				}
				
				.modal-body .accordion .label::before {
					content: '+';
					color: black;
					position: absolute;
					top: 45%;
					right: 10px;
					font-size: 30px;
					transform: translateY(-50%);
				}
				
				.modal-body .accordion .content {
					border-radius: 4px;
					position: relative;
					background: white;
					height: 0;
					font-size: 1em;
					text-align: justify;
					width: 100%;
					overflow: hidden;
					padding: 0px 10px 0px 10px;
					/* transition: 0.5s; */
					;
				}
				
				.modal-body .accordion .isDue {
					border-radius: 4px;
					border-left: 5px solid rgb(244, 77, 77);
				}
				
				.modal-body .accordion hr {
					width: 100;
					margin-left: 0;
					border: 1px solid grey;
				}
				
				.modal-body .accordion .container.active .content {
					height: 100%;
				}
				
				.modal-body .accordion .container.active .label::before {
					content: '-';
					font-size: 30px;
				}

				/* The snackbar - position it at the bottom and in the middle of the screen */
				#snackbar {
					visibility: hidden;
					min-width: 250px;
					margin-left: -250px;
					color: #fff;
					text-align: center;
					border-radius: 2px;
					padding: 16px;
					position: fixed;
					z-index: 999999;
					left: 50%;
					top: 30px;
				}
				
				/* Show the snackbar when clicking on a button (class added with JavaScript) */
				#snackbar.fadein {
					visibility: visible;
					/* Add animation: Take 0.5 seconds to fade in and out the snackbar.
					However, delay the fade out process for 2.5 seconds */
					-webkit-animation: fadein 0.5s;
					animation: fadein 0.5s;
				}

				#snackbar.fadeout {
					visibility: visible;
					-webkit-animation: fadeout 0.5s ;
					animation: fadeout 0.5s;
				}
				
				/* Animations to fade the snackbar in and out */
				@-webkit-keyframes fadein {
					from {top: 0; opacity: 0;}
					to {top: 30px; opacity: 1;}
				}
				
				@keyframes fadein {
					from {top: 0; opacity: 0;}
					to {top: 30px; opacity: 1;}
				}
				
				@-webkit-keyframes fadeout {
					from {top: 30px; opacity: 1;}
					to {top: 0; opacity: 0;}
				}
				
				@keyframes fadeout {
					from {top: 30px; opacity: 1;}
					to {top: 0; opacity: 0;}
				}
			`;

			let style = document.createElement("style");

			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			document.head.appendChild(style);
		}

		function quickReccomendLineItem(opCode) {
			// Maps opcodes to the header text of inspection line
			let opCodeMap = {
				"AIR": "Engine Air Filter",
				"BFLUS": "Brake Fluid",
				"BLUE": "Coolant",
				"MICRO": "In-Cabin Microfilter",
				"BELTS": "Drive Belts",
				"TFLUS": "Automatic Transmission Fluid",
				"Z0971": "Power Steering Fluid",
				"AWD": "ADD_REPAIR",
				"PLUGS": "ADD_REPAIR",
			};

			const titleText = opCodeMap[opCode];

			if (titleText) {
				$(this).prop("disabled", true);

				if (titleText === "ADD_REPAIR") {
					addAdditionalRepairLine(opCode);
				} else {
					clickRedLightButtonByTitle(titleText, opCode);
				}

				toastNotify("success", `Added additional repair for ${opCode}`);
			}
		}
		
		function quickReccomendLineItemNoOpCode(roNumber, index) {
			// Maps opcodes to the header text of inspection line
			const recInfo = currentCarPrevRecs[roNumber].recommendations[index];

			console.log(recInfo)

			$(this).prop("disabled", true);

			if (recInfo.title === "Additional Service Repair" || recInfo.title.length > 90) {
				// Shitty fix. Some titles will be customer concern
				addAdditionalRepairLineNoOpcode(roNumber, index);
			} else {
				clickRedLightButtonByTitle(recInfo.title, recInfo.title);
			}

			toastNotify("success", `Added previously recommended repair for ${recInfo.title}`);
		}

		/*
		* Adds toast snackbar html div
		*/
		function createToastTable() {
			let html = `
				<div id="snackbar">Service schedule updated successfully!</div>
			`;

			document.body.insertAdjacentHTML("afterbegin", html);
		}

		/*
		* Display toast notification
		*/
		function toastNotify(type, notification) {
			const toastTypes = {
				"alert": "rgb(244, 194, 66)",
				"success": "rgb(76, 138, 73)",
				"error": "rgb(244, 77, 77)"
			};

			let snackbarDiv = $("#snackbar");
			snackbarDiv.text(notification);
			snackbarDiv.css("background-color", toastTypes[type]);
			snackbarDiv.css("margin-left", -(snackbarDiv.width() / 2) + "px");

			// Reset dismiss timer
			if (snackbarDiv.hasClass("fadein")) {
				clearTimeout(snackbarDiv.data("timer"));
			}

			snackbarDiv.addClass("fadein");

			// 3 second timer to fade out
			let timer = setTimeout(function () {
				snackbarDiv.removeClass("fadein");
				snackbarDiv.addClass("fadeout")

				setTimeout(function () { snackbarDiv.removeClass("fadeout") }, 450);
			}, 3000);

			// Store the timer in the data attribute of the snackbarDiv
			snackbarDiv.data("timer", timer);
		}

		function createUpdateNotesModal() {
			$("#updateNotesModal").remove();

			GM_xmlhttpRequest({
				method: "GET",
				url: "https://greasyfork.org/en/scripts/497493-infiniti-service-schedule-automater/versions",
				onload: function(response) {
						const parser = new DOMParser();
						const doc = parser.parseFromString(response.responseText, "text/html");
						
						const latestVersion = doc.querySelector('.history_versions li');
						if (latestVersion) {
							const changes = latestVersion.querySelector('.version-changelog').innerHTML;

							let modalHTML = `
							<div class="modal fade" id="updateNotesModal" tabindex="-1" role="dialog" aria-labelledby="updateNotesModal" aria-hidden="true">
								<div class="modal-dialog" style="min-width:75%;" role="document">
										<div class="modal-content">
												<div class="modal-header">
														<h5 class="modal-title">Update Notes</h5>
												</div>
												<div class="modal-body">
													<div style="text-align: center">
														<h3>Check Out What's New!</h3>
														<img style="height: 250px" src="https://i.imgur.com/yXmKA9E.png" alt="Logo">
													</div>
													<br>
													IOWC SSA Has been updated to version <b>${GM_info.script.version}</b>. Below are notes from the latest update.</b>
													${changes}
												</div>
												<div class="modal-footer">
													<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
												</div>
										</div>
								</div>
						</div>
					`
		
					document.body.insertAdjacentHTML("beforeend", modalHTML);
		
					$("#updateNotesModal").modal("show");
						}
				}
			});
		}

		function createNotDueModal(opCode) {
			$("#serviceNotDueModal").remove();

			const serviceItem = getServiceSchedule(currentCarInfo.model, currentCarInfo.year, currentCarInfo.engine)[opCode];

			let nextServiceMiles = serviceItem.lastPerformedMiles ? + serviceItem.lastPerformedMiles + serviceItem.mileInterval : serviceItem.mileInterval;
			let nextDueDate = serviceItem.lastPerformedDate ? new Date(serviceItem.lastPerformedDate.getTime()) : new Date(currentCarInfo.year, 0);
			nextDueDate.setMonth(nextDueDate.getMonth() + serviceItem.monthInterval);

			let currentDate = new Date();
			let daysUntilDue = Math.ceil((nextDueDate - currentDate) / (1000 * 60 * 60 * 24));
			let milesUntilDue = nextServiceMiles - parseInt($("dt.label:contains('Odometer:')").next("dd.description").text());

			let modalBodyContent = `
				<b>${serviceItem.title}</b> is not due for service on this vehicle as per Infiniti's scheduled maintenance. Its next scheduled service is on <b>${nextDueDate.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })}</b> at <b>${nextServiceMiles.toLocaleString()} miles</b>. Vehicle will be due for service in <b>${daysUntilDue} days</b> or <b>${milesUntilDue.toLocaleString()} miles</b>.
				<br><br>
				Would you like to recommend this service anyway?
			`;

			let modalHTML = `
					<div class="modal fade" id="serviceNotDueModal" tabindex="-1" role="dialog" aria-labelledby="serviceNotDueModal" aria-hidden="true">
						<div class="modal-dialog" style="min-width:75%;" role="document">
								<div class="modal-content">
										<div class="modal-header">
												<h5 class="modal-title">Service Not Due</h5>
										</div>
										<div class="modal-body">
											${modalBodyContent}
										</div>
										<div class="modal-footer">
											<button id="override-recommend-for-service" type="button" class="btn btn-secondary" data-dismiss="modal">Recommend Anyway</button>
											<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
										</div>
								</div>
						</div>
				</div>`

			document.body.insertAdjacentHTML("beforeend", modalHTML);

			$("#serviceNotDueModal").on("hidden.bs.modal", function () {
				$("#serviceScheduleModal").modal("show");
			});

			$("#override-recommend-for-service").on("click", function () {
				quickReccomendLineItem(opCode);
			});

			$("#serviceNotDueModal").modal("show");
		}

		function createDebugModal() {
			$("#debugPanelModal").remove();

			let modalBodyContent = `
				<b>Current Menu ID:</b> <input type="text" class="form-control" disabled value="${currentMenuId}">
				<br>
				<b>Current RO RAW JSON:</b><br>
				<textarea id="ro-raw-json-textarea" style="min-height: 350px;" class="form-control" disabled>${JSON.stringify(debugCurCarInfo)}</textarea>
				<button id="copy-debug-btn" data-txtarea="ro-raw-json-textarea" class="btn btn-primary">Copy RO JSON</button>
				<br>
				<b>Current Car Info RAW JSON:</b><br>
				<textarea id="car-info-raw-json" class="form-control" disabled>${JSON.stringify(currentCarInfo)}</textarea>
				<button id="copy-debug-btn" data-txtarea="car-info-raw-json" class="btn btn-primary">Copy Car Info JSON</button>
				<br>
				<b>Current Service Schedule RAW JSON:</b><br>
				<textarea id="service-schedule-raw-json" style="min-height: 250px;" class="form-control" disabled>${JSON.stringify(getServiceSchedule(currentCarInfo.model, currentCarInfo.year, currentCarInfo.engine))}</textarea>
				<button id="copy-debug-btn" data-txtarea="service-schedule-raw-json" class="btn btn-primary">Copy Service Schedule JSON</button>
				<br>
				`;

			let modalHTML = `
					<div class="modal fade" id="debugPanelModal" tabindex="-1" role="dialog" aria-labelledby="debugPanelModal" aria-hidden="true">
						<div class="modal-dialog" style="min-width:75%;" role="document">
								<div class="modal-content">
										<div class="modal-header">
												<h5 class="modal-title">Debug Panel</h5>
										</div>
										<div class="modal-body">
											${modalBodyContent}
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
										</div>
								</div>
						</div>
				</div>
				`

			document.body.insertAdjacentHTML("beforeend", modalHTML);

			$("#debugPanelModal").modal("show");

			$(document).on("click", "#copy-debug-btn", function(e) {
				navigator.clipboard.writeText($(`#${$(e.target).data("txtarea")}`).val());
				toastNotify("success", "Copied debug info to clipboard.");
			});
		}

		/**
		 * Creates bootstrap modal service schedule information and suggestion history.
		 */
		function createServiceHistoryModal() {
			let modalBodyContent = "";
			let currentMiles = parseInt($("dt.label:contains('Odometer:')").next("dd.description").text());
			let carServiceSchedule = getServiceSchedule(currentCarInfo.model, currentCarInfo.year, currentCarInfo.engine);
			let tireSpecs = currentCarInfo.tireSpecs;
			let brakeSpecs = currentCarInfo.brakeSpecs;

			console.log(currentCarPrevRecs);

			// First start with previous recommendations without opcodes
			modalBodyContent += `
			<div class="container ${Object.keys(currentCarPrevRecs).length > 0 ? "isDue" : ""}">
				<div class="label">Previous Recommendations${Object.keys(currentCarPrevRecs).length > 0 ? " <span style=\"color:rgb(244, 77, 77)\"><b>RECS MADE LAST 3 VISITS</b></span>" : ""}</div>
				<div class="content">
					${Object.entries(currentCarPrevRecs)
					.sort(([, a], [, b]) => new Date(b.roInfo.roDate) - new Date(a.roInfo.roDate)) // Sort by date descending
					.slice(0, 3) // Take only first 3 entries
					.map(([roNumber, data]) => `
						<h2>RO #: ${data.roInfo.roNumber}</h2>
						<div class="ro-info">
							<span>Date: ${new Date(data.roInfo.roDate).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span> |
							<span>Miles: ${data.roInfo.miles.toLocaleString()}</span> |
							<span>Tech: ${data.roInfo.tech}</span>
						</div>
						${data.recommendations.map((rec, index) => `
							<div class="service-item background-red" style="border-radius:4px;margin-bottom:5px">
								<h5 class="service-item_title">${rec.title}</h5>
								<div class="service-item_section">
									<span class="note -cause">${rec.cause}</span>
								</div>
								<div class="service-item_section">
									<span class="note -correction">${rec.correction}</span>
								</div>
								<div class="service-item_section">
									<button class="iowc-button recommend-btn-is-due" id="recommend-item-noopcode" style="margin:0px 0px 5px 0px;" data-ro-number="${data.roInfo.roNumber}" data-rec-index="${index}">Recommend</button>
								</div>
							</div>
						`).join("")}
					`).join("")}
				</div>
			</div>
		`;

			for (let key in carServiceSchedule) {
				if (carServiceSchedule.hasOwnProperty(key)) {
					carServiceSchedule[key].services.sort(function (a, b) { return b.roNumber - a.roNumber }); // Hacky way to sort and updater lastPerformed since the AJAX Promises seem to run out-of-order

					let item = carServiceSchedule[key];

					if (item.services[0] && !item.services[0].wasDeclined) {
						item.lastPerformedMiles = item.services[0].mileage;
						item.lastPerformedDate = item.services[0].date;
					}

					let currentDate = new Date();
					let lastPerformedDate = new Date(item.lastPerformedDate);

					let nextServiceMiles = item.lastPerformedMiles + item.mileInterval;
					let nextDueDate = new Date(lastPerformedDate.getTime());
					nextDueDate.setMonth(nextDueDate.getMonth() + item.monthInterval);

					let isDue = currentMiles >= nextServiceMiles || currentDate >= nextDueDate;
					if (item.lastPerformedMiles === 0 && item.lastPerformedDate === 0) {
						if (currentMiles >= item.mileInterval || currentDate >= new Date(currentCarInfo.year, currentDate.getMonth() + item.monthInterval, currentDate.getDate())) {
							isDue = true;
						} else {
							isDue = false;
						}
					}

					let lastServiedLine = "";

					if (item.lastPerformedMiles === 0 && item.lastPerformedDate === 0) {
						lastServiedLine += `No approved service history.`;
					} else {
						lastServiedLine += `<b>Last Serviced:</b> ${lastPerformedDate.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${item.lastPerformedMiles ? item.lastPerformedMiles.toLocaleString() : 0} miles. Next due on ${nextDueDate.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${nextServiceMiles.toLocaleString()} miles.`;
					}

					let $description = item.description ? item.description + "<br><br>" : "";

					modalBodyContent += `
						<div class="container ${isDue ? "isDue" : ""}">
								<div class="label">${item.title} ${isDue ? " <span style=\"color:rgb(244, 77, 77)\"><b>SERVICE DUE</b></span>" : ""}</div>
								<div class="content ">
										${$description}
										<b>Service Due:</b> Every ${item.mileInterval.toLocaleString()} miles or ${item.monthInterval} months (${(item.monthInterval / 12).toFixed(item.monthInterval % 12 === 0 ? 0 : 1)} years).
										<br> <br>
										${lastServiedLine}
										<br> <br>
										<b>Service History:</b>
										<ul>
												${item.services.map(service => `<li>RO ${service.roNumber} - ${service.wasDeclined ? "(DECLINED)" : "(APPROVED)"} ${service.mileage ? service.mileage.toLocaleString() : 0} miles on ${service.date.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })} by ${service.tech} ${service.manuallyCorrelated ? "<b>(Manually Correlated)</b> Original Correction: " + service.correction : ""}</li>`).join("")}
										</ul>
										<button class="iowc-button ${isDue ? `recommend-btn-is-due` : "recommend-btn-not-due"}" id="recommend-item" style="margin:0px 0px 5px 0px;" data-rec-opcode="${key}" data-is-due="${isDue}">Recommend</button>
								</div>
						</div>
					`;
				}
			}

			// Create modal HTML
			let modalHTML = `
				<div class="modal fade" id="serviceScheduleModal" tabindex="-1" role="dialog" aria-labelledby="serviceScheduleModal" aria-hidden="true">
						<div class="modal-dialog" style="min-width:75%;" role="document">
								<div class="modal-content">
										<div class="modal-header">
												<h5 class="modal-title">Scheduled Services (${currentMiles.toLocaleString()} miles)</h5>
												<!--
												<button type="button" class="close" data-dismiss="modal" aria-label="Close">
													<span aria-hidden="true">&times;</span>
												</button>
												-->
										</div>
										<div class="modal-body">
												<p class="modal-warning"><b>Be aware: </b>The engine, year, and model are manually inputted by advisors on DealerLogix during the check-in and may not be accurate. Double-check the vehicle info below before making any recommendations. If the info is inaccurate, let the advisor know. You can change the service schedule used by clicking the button at the bottom.</p>
												<p class="modal-warning"><b>Engine/Trans:</b> ${currentCarInfo.engine} | <b>Year:</b> ${currentCarInfo.year} | <b>Model:</b> ${currentCarInfo.model}</p>
												<p class="modal-warning"><b>Be aware: </b>This is still being tested. Double-check that the called services correlate to the vehicle type. <b>Ex:</b> This popup may not tell the difference between AWD and FWD when calling for AWD service. Previous services that weren't entered with an OP code may be manually correlated based on the entered correction. If noted, double-check the correction before making a recommendation.</p>
											
												<center>
														<div class="modal-body-header-container">
																<div class="modal-body-header-info">
																		<i class="fas fa-oil-can" style="font-size: 48px;"></i>
																		<p style="margin-top: 15px;">Last Oil Change: ${currentCarInfo.lastOilChangeMileage.toLocaleString()} on ${new Date(currentCarInfo.lastOilChangeDate).toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
																</div>
																<div class="modal-body-header-info">
																		<i class="fas fa-tire" style="font-size: 48px;"></i>
																		<p style="margin-top: 15px;">Last Tire Specs:
																			<br>
																			Front (${tireSpecs.tireSpecResults.frontLeft}, ${tireSpecs.tireSpecResults.frontRight})
																			<br>
																			Rear (${tireSpecs.tireSpecResults.rearLeft}, ${tireSpecs.tireSpecResults.rearRight})
																		</p>
																</div>
																<div class="modal-body-header-info">
																		<i class="fa-regular fa-brake-warning" style="font-size: 48px;"></i>
																		<p style="margin-top: 15px;">Last Brake Specs:
																			<br>
																			Front (${brakeSpecs.brakeSpecResults.frontLeft}, ${brakeSpecs.brakeSpecResults.frontRight})
																			<br>
																			Rear (${brakeSpecs.brakeSpecResults.rearLeft}, ${brakeSpecs.brakeSpecResults.rearRight})
																		</p>
																</div>
														</div>
												</center>

												<div class="accordion-body">
												<div class="accordion">
														${modalBodyContent}
												</div>
										</div>
										<div class="modal-footer" style="justify-content: space-between">
												<div>
													<button id="open-debug-info" type="button" class="btn btn-secondary mr-auto">Show Debug Panel</button>
													<a class="btn btn-secondary" href="https://forms.gle/RGtFuRDtRGem9dMk9" role="button" target="_blank">Report Bug</a>
												</div>
												<div>
													<button id="change-service-schdule-modal" type="button" class="btn btn-secondary" data-dismiss="modal">Change Service Schedule</button>
													<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
												</div>
										</div>
								</div>
						</div>
				</div>
			`;

			let labels = document.getElementsByClassName("label");

			// Append modal to body
			document.body.insertAdjacentHTML("beforeend", modalHTML);

			for (let i = 0; i < labels.length; i++) {
				labels[i].addEventListener("click", function () {
					this.parentNode.classList.toggle("active");
				});
			}

			$("#open-debug-info").on("click", function () {
				createDebugModal();
			});

			$("button#recommend-item").on("click", function () {
				let opCode = $(this).data("rec-opcode");
				let isDue = Boolean($(this).data("is-due"));

				if (!isDue) {
					$("#serviceScheduleModal").modal("hide");
					createNotDueModal(opCode);

					return;
				}

				quickReccomendLineItem(opCode);
			});

			$("button#recommend-item-noopcode").on("click", function () {
				let roNumber = $(this).data("ro-number");
				let recIndex = $(this).data("rec-index");

				console.log(`Recommendation for RO: ${roNumber} at index: ${recIndex}`);

				quickReccomendLineItemNoOpCode(roNumber, recIndex);
			});

			$("#change-service-schdule-modal").on("click", function () {
				if ($("#serviceScheduleModal").length > 0) {
					$("#serviceScheduleModal").modal("hide");
				}

				openManualSelectCarModal();
			});

			$("#serviceScheduleModal").modal("show");
		}

		/**
		 * Interact with MerlinApp javascript to add product to inspection line.
		 *
		 * @param {string|null} opcode - Opcode to apply to inspection line (can be null for no-opcode recommendations).
		 * @param {string} textCause - The initial value of the cause text area.
		 * @param {string} dataRowId - The ID of the data row.
		 * @param {Array|null} partsList - List of parts to add to the inspection line.
		 * @param {Object|null} customParts - Custom parts information for no-opcode scenarios.
		 */
		function addProductToInspectionLine(opcode, textCause, dataRowId, partsList = null, customParts = null) {
			let inspectionLineDiv = document.querySelector('div[data-rowid="' + dataRowId + '"]') || document.querySelector('li[data-rowid="' + dataRowId + '"]');

			if (!inspectionLineDiv) {
				displayAlert(`Deal line element not found for Row ID: ${dataRowId}`);
				return;
			}

			let inspectionLine = app.activeDisplay.lineByDOM(inspectionLineDiv);

			if (partsList) {
				// Reset parts list and add each item manually
				inspectionLine.livePartsList.reset([]);

				partsList.forEach(part => {
					inspectionLine.livePartsList.add({
						id: (new Date).getTime(),
						desc: part.description,
						partNumber: part.partNumber,
						qty: part.quantity,
						price: "",
						total: "",
					});
				});

				// If no opcode, use custom parts info for correction and labor hours
				if (!opcode && customParts) {
					inspectionLine.setValues({
						correction: customParts.correctionText,
						laborHours: customParts.laborHours,
					});
				}
			}

			// Set product only if opcode is provided
			if (opcode) {
				let opCodeProduct = app.data.openDeal.products.find(product => product.opcode === opcode);
				app.activeDisplay.setProduct(inspectionLine, opCodeProduct);
			}

			inspectionLine.setValues({
				cause: textCause,
			});
			inspectionLine.save();
		}

		// Updated addAdditionalRepairLine
		function addAdditionalRepairLine(opCode, partsList) {
			$('body').find('a[data-tab="inspection"]')[0].click();
			$(".btn-add-line").click();

			let carServiceSchedule = getServiceSchedule(currentCarInfo.model, currentCarInfo.year, currentCarInfo.engine)[opCode];

			let textAreaCause = `Due for replacement by age and mileage (every ${carServiceSchedule.mileInterval.toLocaleString()} miles or ${carServiceSchedule.monthInterval} months).`
			if (carServiceSchedule.lastPerformedMiles !== 0 && carServiceSchedule.lastPerformedDate !== 0) {
				textAreaCause += ` Last serviced on ${carServiceSchedule.lastPerformedDate.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${carServiceSchedule.lastPerformedMiles.toLocaleString()} miles (RO ${carServiceSchedule.services[0].roNumber}).`;
			}

			// TODO: Figure out better way than this to get deal line
			// Could add MutationObserver
			setTimeout(function () {
				let lastLiElement = $("ul.additional-repairs li.deal-line").last();
				const dataRowId = lastLiElement.attr("data-rowid");

				addProductToInspectionLine(opCode, textAreaCause, dataRowId, partsList);
			}, 500);
		}

		// Updated addAdditionalRepairLineNoOpcode
		function addAdditionalRepairLineNoOpcode(roNumber, index) {
			$('body').find('a[data-tab="inspection"]')[0].click();
			$(".btn-add-line").click();

			const recInfo = currentCarPrevRecs[roNumber].recommendations[index];

			// TODO: Figure out better way than this to get deal line
			// Could add MutationObserver
			setTimeout(function () {
				let lastLiElement = $("ul.additional-repairs li.deal-line").last();
				const dataRowId = lastLiElement.attr("data-rowid");

				// For no-opcode, pass null as opcode and the parts list
				addProductToInspectionLine(
					null, 
					recInfo.cause, 
					dataRowId, 
					recInfo.partsList, 
					{
						correctionText: `${recInfo.correction}`,
						laborHours: "" // You might want to add a way to specify labor hours
					}
				);
			}, 500);
		}

		/**
		 * Clicks the red status button for an inspection line based off of opcode.
		 * Inspection line is found by matching title text from corresponding opcode.
		 * Interaction for updating inspection line handled by addProductToInspectionLine.
		 *
		 * @param {string} titleText text of the title to match.
		 * @param {string} opCode operation code to use in correction.
		 */
		function clickRedLightButtonByTitle(titleText, opCode) {
			$('body').find('a[data-tab="inspection"]')[0].click();

			const titles = document.querySelectorAll(".deal-line_title");

			titles.forEach((title) => {
				if (title.textContent.trim() !== titleText) { return; }
				if (!title.closest(".inspection-items_item")) { displayAlert(`Deal line element not found for: ${titleText}`); return; }

				// Find the closest parent element with the class 'inspection-items_item'
				const dataRowId = $(title).parent().attr("data-rowid");
				const inspectionItem = title.closest(".inspection-items_item");
				const redLightButton = inspectionItem.querySelector(".light.-red");
				const carServiceSchedule = getServiceSchedule(currentCarInfo.model, currentCarInfo.year, currentCarInfo.engine)[opCode];

				if (!redLightButton) { return; }

				// Click the red light button
				redLightButton.click();

				let textAreaCause = `Due for replacement by age and mileage (every ${carServiceSchedule.mileInterval.toLocaleString()} miles or ${carServiceSchedule.monthInterval} months).`
				if (carServiceSchedule.lastPerformedMiles !== 0 && carServiceSchedule.lastPerformedDate !== 0) {
					textAreaCause += ` Last serviced on ${carServiceSchedule.lastPerformedDate.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" })} at ${carServiceSchedule.lastPerformedMiles.toLocaleString()} miles (RO ${carServiceSchedule.services[0].roNumber}).`;
				}
				
				addProductToInspectionLine(opCode, textAreaCause, dataRowId);

				return;
			});
		}

		/**
		 * Creates <option> elements for <select> dropdown when changing service schedule.
		 */
		function createSelectOptions(data) {
			return Object.keys(data)
				.map(key => `<option value="${key}">${key}</option>`)
				.join('');
		}

		/**
		 * Creates dropdown menu <select> cars in the service schedule.
		 * 
		 * @returns {string} HTML content of dropdown menu with <select> and <options>.
		 */
		function createManualModelDropdown() {
			const modelOptions = Object.keys(serviceSchedule)
				.map(model => `<option value="${model}">${model}</option>`)
				.join('');

			let modalBodyContent = `
				<div>
						<label for="model">Model:</label>
						<select name="model" id="model-select">
							<option value="" selected disabled></option>
							${modelOptions}
						</select>
						<br>
						<label for="year-range">Year Range:</label>
						<select name="year-range" id="year-range-select" disabled>
						</select>
						<br>
						<label for="engine-trans">Engine/Trans:</label>
						<select name="engine-trans" id="engine-trans-select" disabled>
						</select>
				</div>
			`;

			return modalBodyContent;
		}

		/**
		 * Creates bootstrap modal for manually selecting car's service schedule.
		 * Called when user clicks "Change Service Schedule" button on service schedule modal
		 * because the car's service schedule couldn't be found, usually due to wrong car info
		 * entered by advisor.
		 * 
		 * @function createManualSelectCarModal
		 */
		function createManualSelectCarModal() {
			let modalBodyContent = createManualModelDropdown();
			let modalHTML = `
						<div class="modal fade" id="manualSelectCarServiceSchedule" tabindex="-1" role="dialog" aria-labelledby="manualSelectCarServiceSchedule" aria-hidden="true">
								<div class="modal-dialog" style="min-width:75%;" role="document">
										<div class="modal-content">
												<div class="modal-header">
														<h5 class="modal-title">Change Car Service Schedule</h5>
														<!--
														<button type="button" class="close" data-dismiss="modal" aria-label="Close">
															<span aria-hidden="true">&times;</span>
														</button>
														-->
												</div>
												<div id="manual-model-select-body" class="modal-body">
														${modalBodyContent}
												</div>
												<div class="modal-footer">
														<a class="btn btn-secondary" href="https://forms.gle/RGtFuRDtRGem9dMk9" role="button" target="_blank">Report Missing Model/Year/Engine</a>
														<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
														<button type="button" id="update-service-schedule" class="btn btn-primary" data-dismiss="modal">Update</button>
												</div>
										</div>
								</div>
						</div>
				`;

			document.body.insertAdjacentHTML("beforeend", modalHTML);

			$("#manualSelectCarServiceSchedule").on("change", function (e) {
				let target = $(e.target);

				if (target.is("#model-select")) {
					let selectedModel = target.val();
					let yearRangeSelect = $("#year-range-select");

					yearRangeSelect.prop("disabled", false).html(createSelectOptions(serviceSchedule[selectedModel]));
					yearRangeSelect.val(yearRangeSelect.find("option:first").val());
					yearRangeSelect.trigger("change");
				} else if (target.is("#year-range-select")) {
					let selectedModel = $("#model-select").val();
					let selectedYearRange = target.val();

					$("#engine-trans-select").prop("disabled", false).html(createSelectOptions(serviceSchedule[selectedModel][selectedYearRange]));
				}
			});

			$("#manualSelectCarServiceSchedule").on("click", "#update-service-schedule", function (e) {
				currentCarInfo.model = $("#model-select").val();
				currentCarInfo.engine = $("#engine-trans-select").val();

				if ($("#serviceScheduleModal").length > 0) {
					$("#serviceScheduleModal").modal("hide");
					$("#serviceScheduleModal").remove();
				}

				processROLineReccomendations();
			});
		}

		/**
		 * Opens the manual select car modal. If already open, removes and reopens.
		 * 
		 * @returns {void}
		 */
		function openManualSelectCarModal() {
			let manualSelectModal = $("#manualSelectCarServiceSchedule");

			if (manualSelectModal.length > 0) {
				manualSelectModal.modal('toggle');
				manualSelectModal.remove();

				$(".modal-backdrop.fade.show").remove(); // Stupid fix but fixes backdrops overlapping if previous selection couldn't be found
			}

			createManualSelectCarModal();

			$("#manualSelectCarServiceSchedule").modal("show");
		}

		/**
		 * Creates button on header of vehicle RO page to check for service history.
		 */
		function createButton() {
			const headerHtml = `
				<div id="collapsibleHeader" class="header-container">
						<div class="header-content">
								<div class="logo-title">
										<button id="toggleButton" class="toggle-button">▲</button>
										<img id="headerImage" src="https://i.imgur.com/yXmKA9E.png" alt="Logo">
										<h2>IOWC SSA Quick Actions</h2>
								</div>
								<div id="buttonContainer" class="button-container">
										<button id="injectedHistoryCheck" class="iowc-button check-scheduled-services-btn">Check Scheduled Services</button>
										<button id="showDebugPanel" class="iowc-button check-scheduled-services-btn">Show Debug Panel</button>
										<a class="btn btn-secondary" href="https://forms.gle/RGtFuRDtRGem9dMk9" role="button" target="_blank">Report Bug</a>
										<a class="btn btn-secondary" href="https://greasyfork.org/en/scripts/497493-infiniti-service-schedule-automater/versions" role="button" target="_blank">View Changelog</a>
								</div>
						</div>
				</div>
			`

			$(".header-wrapper").after(headerHtml);
		
			const header = document.getElementById('collapsibleHeader');
			const toggleButton = document.getElementById('toggleButton');

			toggleButton.addEventListener('click', () => {
					header.classList.toggle('collapsed');
					if (header.classList.contains('collapsed')) {
							toggleButton.textContent = '▼';
					} else {
							toggleButton.textContent = '▲';
					}
			})

			$("#showDebugPanel").on("click", function() {
				if (Object.keys(currentCarROs).length === 0) {
					toastNotify("error", "Service history not loaded yet! Click 'Check Scheduled Services' to load vehicle info.");
					
					return;
				}

				createDebugModal();
			});

			$("#injectedHistoryCheck").on("click", function(event) {
				event.preventDefault();

				if (Object.keys(currentCarROs).length === 0) {
					const historyTab = $('a[data-tab="history"]').first();

					if (historyTab.length) {
						historyTab[0].click();
						wasBtnPressedGlobal = true;
					}
				} else {
					if ($("#serviceScheduleModal").length > 0) {
						$("#serviceScheduleModal").modal("show");
					} else {
						processROLineReccomendations(true);
					}
				}
			});
		}

		// Initial script loading
		fetch("https://petersav.com/iowc-api/infiniti-schedule.json?t=" + new Date().getTime())
			.then(response => response.json())
			.then(data => {
				serviceSchedule = data;

				// If we start on a vehicle RO page instead of dashboard, check for menu-id
				let menuIdMatch = window.location.href.match(/menu-id=([^&]*)/);

				if (menuIdMatch) {
					updateMenuId(menuIdMatch[1]);
				}

				GM_addStyle(`
					@import url('https://site-assets.fontawesome.com/releases/v6.6.0/css/all.css');
				`);

				initInterceptMenuId();
				initVehicleHistoryAjaxIntercept();
				addCustomCSS();
				createButton();
				createToastTable();
				checkForUpdateNotes();
			})
			.catch(error => {
				displayAlert("Error fetching service schedule: " + error);

				throw new Error("Error fetching service schedule: " + error);
			});
	})();