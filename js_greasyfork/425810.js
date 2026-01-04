// ==UserScript==
// @name         TMVN Club Finance
// @namespace    https://trophymanager.com
// @version      1
// @description  Trophymanager: I use this script to estimate financial budget for the season. It helps me answer questions like: How much money can I use to buy stars? How much wage fund should be maintained? Need to trade how many players to afford to build facility? It cannot be completely accurate, but enough to give a approximate view of the club's finances.
// @include      https://trophymanager.com/club/*
// @include      https://trophymanager.com/club/*/
// @exclude      https://trophymanager.com/club/
// @exclude      https://trophymanager.com/club/*/squad/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425810/TMVN%20Club%20Finance.user.js
// @updateURL https://update.greasyfork.org/scripts/425810/TMVN%20Club%20Finance.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const NOTE = "Total Profit = Ticket Profit + Com(mercer) Profit + TV Money + Sponsors + Trade Player - Other Maintain - Player Wage - Staff Wage - Building - Buy Star + Other Adjust";

	const COLOR = {
		DEFAULT: "color:White;",
		SPECTATOR: "color:Orange;",
		COMMERCE: "color:Aqua;",
		SEAT: "color:Yellow;",
		INJURY: "color:GreenYellow;",
		YATG: "color:Yellow;",
		IN: "color:Blue;",
		OUT: "color:Black;",
		FINAL: "color:Darkred;",
		NOTE: "color:Darkgray"
	}

	const COMMERCE_PRICE = {
		FAST_FOOD_PLACE: 4,
		MERCHANDISE_STAND: 10,
		MERCHANDISE_STORE: 20,
		RESTAURANT: 5,
		SAUSAGE_STAND: 2.5
	}

	const COMMERCE_INCOME_FACTOR = {
		FAST_FOOD_PLACE: 17,
		MERCHANDISE_STAND: 17,
		MERCHANDISE_STORE: 12,
		RESTAURANT: 17,
		SAUSAGE_STAND: 17
	}

	const CALCULATE_EXTRA_MATCH = {
		FAST_FOOD_PLACE: 1,
		MERCHANDISE_STAND: 1,
		MERCHANDISE_STORE: 0,
		RESTAURANT: 1,
		SAUSAGE_STAND: 1
	}

	const COMMERCE_MAINTAIN = {
		FAST_FOOD_PLACE: 45000,
		MERCHANDISE_STAND: 112500,
		RESTAURANT: 56250,
		SAUSAGE_STAND: 28125
	}

	const TICKET_PRICE = 200;
	const SEAT_MAINTAIN = 35;

	const MERCHANDISE_STORE_MAINTAIN = [0, 50000, 150000, 250000, 350000, 450000, 550000, 650000, 750000, 850000, 950000];
	const PARKING_MAINTAIN = [0, 10000, 50000, 100000, 150000, 250000, 375000, 500000, 625000, 800000, 1000000];
	const TOILETS_MAINTAIN = [0, 10000, 50000, 100000, 150000, 250000, 375000, 500000, 625000, 800000, 1000000];
	const PHYSIO_MAINTAIN = [0, 10000, 50000, 100000, 150000, 250000, 375000, 500000, 625000, 800000, 1000000];

	const TRAINING_GROUNDS_MAINTAIN = [0, 30000, 185000, 612500, 1250000, 2150000, 3650000, 5350000, 7650000, 10250000, 13500000];
	const YOUTH_ACADEMY_MAINTAIN = [0, 25000, 150000, 500000, 1000000, 1750000, 3000000, 4350000, 6250000, 8350000, 11000000];
	const MEDICAL_CENTER_MAINTAIN = [0, 50000, 250000, 625000, 1250000, 2000000, 3000000, 4500000, 6000000, 8000000, 10000000];

	const FLOODLIGHTS_MAINTAIN = [0, 100000, 500000];
	const PITCH_DRAINING_MAINTAIN = [0, 50000];
	const PITCH_COVER_MAINTAIN = [0, 50000];
	const SPRINKLERS_MAINTAIN = [0, 50000];
	const HEATING_MAINTAIN = [0, 350000];

	const TV_MONEY = [0, 11000000, 10000000, 9500000, 9000000, 8500000, 8000000];
	const SPONSORS = [0, 25000000, 22500000, 20000000, 17500000, 15000000, 12500000];

	var physioLevel,
	pitchDrainingLevel,
	pitchCoverLevel,
	sprinklersLevel,
	heatingLevel,
	floodlightsLevel,
	parkingLevel,
	toiletsLevel,
	restaurantLevel,
	merchandiseStandLevel,
	fastFoodPlaceLevel,
	sausageStandLevel,
	merchandiseStoreLevel,
	medicalCenterLevel,
	youthAcademyLevel,
	trainingGroundsLevel;

	var estimateAttendance,
	averageAttendance,
	currentCapacity,
	recommendCapacity,
	ticketIncome,
	seatMantain,
	ticketProfit,
	commerceIncome,
	commerceMaintain,
	commerceProfit,
	tvMoney,
	sponsors,
	otherMaintain,
	totalProfit;

	var extraHomeMatch,
	tradePlayer,
	buyStar,
	playerWage,
	staffWage,
	building,
	adjust;
	extraHomeMatch = tradePlayer = buyStar = playerWage = staffWage = building = adjust = 0;

	var myClubId,
	clubId,
	division,
	fanBase = -1;
	var getHomeIdInterval = setInterval(getHomeId, 500);
	var mainInterval = setInterval(main, 500);

	function getHomeId() {
		if (myClubId != undefined) {
			clearInterval(getHomeIdInterval);
		} else {
			try {
				myClubId = $('.club.faux_link').attr('club');
			} catch (e) {}
		}
	}

	function main() {
		if (myClubId != '') {
			clearInterval(mainInterval);
			clubId = location.href.split('/')[4];
			division = $('.box_sub_header.align_center a')[$('.box_sub_header.align_center a').length - 1].getAttribute('division');

			var clubInfoArr = $('#club_info div')[0].innerText.split('\n');
			for (var i = clubInfoArr.length - 1; i >= 0; i--) {
				if (clubInfoArr[i].trim().startsWith('Fans: ')) {
					fanBase = clubInfoArr[i].trim().split(' ')[1].replace(/,/g, ''); //16,731
					if (isNaN(fanBase)) {
						fanBase = 0; //in Live Match time
					} else {
						fanBase = Number(fanBase);
					}
					break;
				}
			}
			if (fanBase == -1) { //b-team
				return;
			}

			if (myClubId == clubId) {
				//if club is mine get wage data from finance page include staff wage
				let playerWeekWage = -1,
				staffWeekWage = -1;
				$.ajaxSetup({
					async: false
				});

				$.ajax('https://trophymanager.com/finances/wages/', {
					type: "GET",
					dataType: 'html',
					crossDomain: true,
					success: function (response) {
						try {
							let playerWageTr = $('#tab0 tr', response)[$('#tab0 tr', response).length - 1];
							playerWeekWage = Number($('td', playerWageTr)[1].innerText.replace(/,/g, ''));
						} catch (e) {}

						try {
							let staffWageTr = $('#tab1 tr', response)[$('#tab1 tr', response).length - 1];
							staffWeekWage = Number($('td', staffWageTr)[2].innerText.replace(/,/g, ''));
						} catch (e) {}
					},
					error: function (e) {}
				});

				$.ajaxSetup({
					async: true
				});
				if (playerWeekWage != -1) {
					playerWage = playerWeekWage;
				}
				if (staffWeekWage != -1) {
					staffWage = staffWeekWage;
				}
			}

			parepareData();
			presentation();
		}
	}

	function parepareData() {
		$.ajaxSetup({
			async: false
		});

		$.ajax('https://trophymanager.com/stadium/' + clubId, {
			type: "GET",
			dataType: 'html',
			crossDomain: true,
			success: function (response) {
				let facility = $('map[name="facility_map"]', response)[0];

				let stadium = facility.children[0];

				let floodlights = facility.children[2];
				let parking = facility.children[6];
				let toilets = facility.children[9];

				let restaurant = facility.children[7];
				let merchandiseStand = facility.children[4];
				let fastFoodPlace = facility.children[1];
				let sausageStand = facility.children[8];
				let merchandiseStore = facility.children[5];

				let medicalCenter = facility.children[3];

				let youthAcademy = facility.children[11];
				let trainingGrounds = facility.children[10];

				let stadiumElementArr = $('p', new DOMParser().parseFromString(stadium.getAttribute('tooltip'), 'text/html'));

				currentCapacity = Number(stadiumElementArr[1].innerText.split(' ')[1].replace(/,/g, ''));

				let physioText = stadiumElementArr[2].innerText.trim();
				if (physioText == 'Physio') {
					physioLevel = 0;
				} else {
					physioLevel = Number(physioText.substr(8, physioText.length - 8 - 1)); //'Physio [' = 8
				}

				$('img', stadiumElementArr[4])[0].src.endsWith("small_red_x.png") ? pitchDrainingLevel = 0 : pitchDrainingLevel = 1;
				$('img', stadiumElementArr[5])[0].src.endsWith("small_red_x.png") ? pitchCoverLevel = 0 : pitchCoverLevel = 1;
				$('img', stadiumElementArr[6])[0].src.endsWith("small_red_x.png") ? sprinklersLevel = 0 : sprinklersLevel = 1;
				$('img', stadiumElementArr[7])[0].src.endsWith("small_red_x.png") ? heatingLevel = 0 : heatingLevel = 1;

				floodlightsLevel = identifyFacilityLevel(floodlights);
				parkingLevel = identifyFacilityLevel(parking);
				toiletsLevel = identifyFacilityLevel(toilets);

				restaurantLevel = identifyFacilityLevel(restaurant);
				merchandiseStandLevel = identifyFacilityLevel(merchandiseStand);
				fastFoodPlaceLevel = identifyFacilityLevel(fastFoodPlace);
				sausageStandLevel = identifyFacilityLevel(sausageStand);
				merchandiseStoreLevel = identifyFacilityLevel(merchandiseStore);

				medicalCenterLevel = identifyFacilityLevel(medicalCenter);

				youthAcademyLevel = identifyFacilityLevel(youthAcademy);
				trainingGroundsLevel = identifyFacilityLevel(trainingGrounds);

				averageAttendance = calculateAverageAttendance(parkingLevel, toiletsLevel, floodlightsLevel, fanBase, currentCapacity);
				estimateAttendance = calculateEstimateAttendance(parkingLevel, toiletsLevel, floodlightsLevel, fanBase, currentCapacity);
				recommendCapacity = calculateRecommendCapacity(parkingLevel, toiletsLevel, floodlightsLevel, fanBase);

				ticketIncome = calculateTicketIncome(extraHomeMatch, averageAttendance);
				seatMantain = calculateSeatMaintain(currentCapacity);
				ticketProfit = ticketIncome - seatMantain;

				commerceIncome = calculateCommerceIncome(extraHomeMatch, averageAttendance, restaurantLevel, merchandiseStandLevel, fastFoodPlaceLevel, sausageStandLevel, merchandiseStoreLevel);
				commerceMaintain = calculateCommerceMaintain(restaurantLevel, merchandiseStandLevel, fastFoodPlaceLevel, sausageStandLevel, merchandiseStoreLevel);
				commerceProfit = commerceIncome - commerceMaintain;

				tvMoney = calculateTVMoney(division);
				sponsors = calculateSponsors(division);
				otherMaintain = calculateOtherMaintain(physioLevel, pitchDrainingLevel, pitchCoverLevel, sprinklersLevel, heatingLevel, floodlightsLevel, parkingLevel, toiletsLevel, medicalCenterLevel, youthAcademyLevel, trainingGroundsLevel);

				try {
					if (playerWage == 0) { //not home club
						playerWage = JSON.parse(localStorage.getItem(clubId + "_SQUAD_VALUE")).Wage; //TMVN Squad Value script
					}
				} catch (e) {}

				totalProfit = ticketProfit + commerceProfit + tvMoney + sponsors + tradePlayer - otherMaintain - playerWage * 12 - staffWage * 12 - building - buyStar + adjust;

			},
			error: function (e) {}
		});

		$.ajaxSetup({
			async: true
		});
	}

	function presentation() {
		let stadiumArea =
			'<div class="box">' +
			'<div class="box_head"><h2 class="std">Finance</h2></div>' +
			'<div class="box_body">' +
			'<div class="box_shadow"></div>' +
			'<div id="tm_script_club_stadium_area_id" class="content_menu"></div>' +
			'<div class="box_footer"><div></div></div>' +
			'</div>';

		$(".column1").append(stadiumArea);

		let stadiumArea_content = "<table>";
		stadiumArea_content += '<tr><td style=' + COLOR.DEFAULT + '>Fanbase: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_fanbase" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.SPECTATOR + '>Current Capacity: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_current_capacity" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';

		stadiumArea_content += '<tr><td style=' + COLOR.SPECTATOR + '>Floodlights: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_floodlights" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.SPECTATOR + '>Parking: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_parking" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.SPECTATOR + '>Toilets: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_toilets" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';

		stadiumArea_content += '<tr><td style=' + COLOR.INJURY + '>Physio: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_physio" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.INJURY + '>Pitch Draining: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_pitch_draining" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.INJURY + '>Pitch Cover: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_pitch_cover" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.INJURY + '>Sprinklers: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_sprinklers" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.INJURY + '>Heating: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_heating" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.INJURY + '>Medical Center: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_medical_center" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';

		stadiumArea_content += '<tr><td style=' + COLOR.COMMERCE + '>Restaurant: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_restaurant" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.COMMERCE + '>Merchandise Stand: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_merchandise_stand" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.COMMERCE + '>Fast Food Place: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_fast_food_place" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.COMMERCE + '>Sausage Stand: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_sausage_stand" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.COMMERCE + '>Merchandise Store: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_merchandise_store" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';

		stadiumArea_content += '<tr><td style=' + COLOR.YATG + '>Youth Academy: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_youth_academy" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.YATG + '>Training Grounds: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_training_grounds" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';

		stadiumArea_content += '<tr><td style=' + COLOR.IN + '>Extra Home Match: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_extra_home_match" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.IN + '>Division: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_division" type="text" class="embossed" style="width: 50px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += "</table>";

		stadiumArea_content += "<table>";
		stadiumArea_content += '<tr><td style=' + COLOR.IN + '>Trade player: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_trade_player" type="text" class="embossed" style="width: 80px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.OUT + '>Buy Star: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_buy_star" type="text" class="embossed" style="width: 80px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.OUT + '>Player Wage: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_player_wage" type="text" class="embossed" style="width: 80px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.OUT + '>Staff Wage: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_staff_wage" type="text" class="embossed" style="width: 80px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.OUT + '>Building: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_building" type="text" class="embossed" style="width: 80px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';
		stadiumArea_content += '<tr><td style=' + COLOR.DEFAULT + '>Other Adjust: </td><td style="text-align: right"><span style="display: inline-block;"><input id="tm_script_input_adjust" type="text" class="embossed" style="width: 80px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td></tr>';

		stadiumArea_content += '<tr><td colspan="2" style="text-align: center;"><span id="tm_script_button_calculate" class="button" style="margin-left: 3px;"><span class="button_border">Calculate</span></span></td></tr>';
		stadiumArea_content += "</table>";

		stadiumArea_content += "<table>";
		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.SEAT + '><td>Average Attendance:</td><td style="text-align: right;"><span id="tm_script_span_average_attendance"></span></td></tr></table></td></tr>';
		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.SEAT + '><td>REC Capacity:</td><td style="text-align: right;"><span id="tm_script_span_recommend_capacity"></span></td></tr></table></td></tr>';

		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.SPECTATOR + '><td>Ticket Income:</td><td style="text-align: right;"><span id="tm_script_span_ticket_income"></span></td></tr></table></td></tr>';
		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.SPECTATOR + '><td>Seat Maintain:</td><td style="text-align: right;"><span id="tm_script_span_seat_maintain"></span></td></tr></table></td></tr>';
		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.SPECTATOR + '><td>Ticket Profit:</td><td style="text-align: right;"><span id="tm_script_span_ticket_profit"></span></td></tr></table></td></tr>';

		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.COMMERCE + '><td>Com Income:</td><td style="text-align: right;"><span id="tm_script_span_commerce_income"></span></td></tr></table></td></tr>';
		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.COMMERCE + '><td>Com Maintain:</td><td style="text-align: right;"><span id="tm_script_span_commerce_maintain"></span></td></tr></table></td></tr>';
		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.COMMERCE + '><td>Com Profit:</td><td style="text-align: right;"><span id="tm_script_span_commerce_profit"></span></td></tr></table></td></tr>';

		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.IN + '><td>TV Money:</td><td style="text-align: right;"><span id="tm_script_span_tv_money"></span></td></tr></table></td></tr>';
		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.IN + '><td>Sponsors:</td><td style="text-align: right;"><span id="tm_script_span_sponsors"></span></td></tr></table></td></tr>';
		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.OUT + '><td>Other Maintain:</td><td style="text-align: right;"><span id="tm_script_span_other_maintain"></span></td></tr></table></td></tr>';
		stadiumArea_content += '<tr><td><table><tr style=' + COLOR.FINAL + '><td>Total Profit:</td><td style="text-align: right;"><span id="tm_script_span_total_profit"></span></td></tr></table></td></tr>';
		stadiumArea_content += '<tr><td style="color:Darkgray; font-size:smaller; font-style:italic">' + NOTE + '</td></tr>';
		stadiumArea_content += "</table>";

		$("#tm_script_club_stadium_area_id").append(stadiumArea_content);

		$('#tm_script_input_fanbase').val(fanBase);
		$('#tm_script_input_current_capacity').val(currentCapacity);

		$('#tm_script_input_floodlights').val(floodlightsLevel);
		$('#tm_script_input_parking').val(parkingLevel);
		$('#tm_script_input_toilets').val(toiletsLevel);

		$('#tm_script_input_physio').val(physioLevel);
		$('#tm_script_input_pitch_draining').val(pitchDrainingLevel);
		$('#tm_script_input_pitch_cover').val(pitchCoverLevel);
		$('#tm_script_input_sprinklers').val(sprinklersLevel);
		$('#tm_script_input_heating').val(heatingLevel);
		$('#tm_script_input_medical_center').val(medicalCenterLevel);

		$('#tm_script_input_restaurant').val(restaurantLevel);
		$('#tm_script_input_merchandise_stand').val(merchandiseStandLevel);
		$('#tm_script_input_fast_food_place').val(fastFoodPlaceLevel);
		$('#tm_script_input_sausage_stand').val(sausageStandLevel);
		$('#tm_script_input_merchandise_store').val(merchandiseStoreLevel);

		$('#tm_script_input_youth_academy').val(youthAcademyLevel);
		$('#tm_script_input_training_grounds').val(trainingGroundsLevel);

		$('#tm_script_input_extra_home_match').val(extraHomeMatch);
		$('#tm_script_input_division').val(division);
		$('#tm_script_input_trade_player').val(tradePlayer);
		$('#tm_script_input_buy_star').val(buyStar);
		$('#tm_script_input_player_wage').val(playerWage);
		$('#tm_script_input_staff_wage').val(staffWage);
		$('#tm_script_input_building').val(building);
		$('#tm_script_input_adjust').val(adjust);

		$('#tm_script_span_average_attendance')[0].innerText = averageAttendance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_recommend_capacity')[0].innerText = recommendCapacity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		$('#tm_script_span_ticket_income')[0].innerText = ticketIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_seat_maintain')[0].innerText = seatMantain.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_ticket_profit')[0].innerText = ticketProfit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		$('#tm_script_span_commerce_income')[0].innerText = commerceIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_commerce_maintain')[0].innerText = commerceMaintain.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_commerce_profit')[0].innerText = commerceProfit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		$('#tm_script_span_tv_money')[0].innerText = tvMoney.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_sponsors')[0].innerText = sponsors.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_other_maintain')[0].innerText = otherMaintain.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_total_profit')[0].innerText = totalProfit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		document.getElementById('tm_script_button_calculate').addEventListener('click', (e) => {
			calculate();
		});
	}

	function calculate() {
		let fanBaseCal = $('#tm_script_input_fanbase')[0].value.trim();
		let currentCapacityCal = $('#tm_script_input_current_capacity')[0].value.trim();

		let floodlightsLevelCal = $('#tm_script_input_floodlights')[0].value.trim();
		let parkingLevelCal = $('#tm_script_input_parking')[0].value.trim();
		let toiletsLevelCal = $('#tm_script_input_toilets')[0].value.trim();

		let physioLevelCal = $('#tm_script_input_physio')[0].value.trim();
		let pitchDrainingLevelCal = $('#tm_script_input_pitch_draining')[0].value.trim();
		let pitchCoverLevelCal = $('#tm_script_input_pitch_cover')[0].value.trim();
		let sprinklersLevelCal = $('#tm_script_input_sprinklers')[0].value.trim();
		let heatingLevelCal = $('#tm_script_input_heating')[0].value.trim();
		let medicalCenterLevelCal = $('#tm_script_input_medical_center')[0].value.trim();

		let restaurantLevelCal = $('#tm_script_input_restaurant')[0].value.trim();
		let merchandiseStandLevelCal = $('#tm_script_input_merchandise_stand')[0].value.trim();
		let fastFoodPlaceLevelCal = $('#tm_script_input_fast_food_place')[0].value.trim();
		let sausageStandLevelCal = $('#tm_script_input_sausage_stand')[0].value.trim();
		let merchandiseStoreLevelCal = $('#tm_script_input_merchandise_store')[0].value.trim();

		let youthAcademyLevelCal = $('#tm_script_input_youth_academy')[0].value.trim();
		let trainingGroundsLevelCal = $('#tm_script_input_training_grounds')[0].value.trim();

		let extraHomeMatchCal = $('#tm_script_input_extra_home_match')[0].value.trim();
		let divisionCal = $('#tm_script_input_division')[0].value.trim();
		let tradePlayerCal = $('#tm_script_input_trade_player')[0].value.trim();
		let buyStarCal = $('#tm_script_input_buy_star')[0].value.trim();
		let playerWageCal = $('#tm_script_input_player_wage')[0].value.trim();
		let staffWageCal = $('#tm_script_input_staff_wage')[0].value.trim();
		let buildingCal = $('#tm_script_input_building')[0].value.trim();
		let adjustCal = $('#tm_script_input_adjust')[0].value.trim();

		if (fanBaseCal == '' || currentCapacityCal == '' || floodlightsLevelCal == '' || parkingLevelCal == '' || toiletsLevelCal == '' || physioLevelCal == '' || pitchDrainingLevelCal == '' || pitchCoverLevelCal == '' || sprinklersLevelCal == '' || heatingLevelCal == '' || medicalCenterLevelCal == '' || restaurantLevelCal == '' || merchandiseStandLevelCal == '' || fastFoodPlaceLevelCal == '' || sausageStandLevelCal == '' || merchandiseStoreLevelCal == '' || youthAcademyLevelCal == '' || trainingGroundsLevelCal == '' || extraHomeMatchCal == '' || divisionCal == '' || tradePlayerCal == '' || buyStarCal == '' || playerWageCal == '' || staffWageCal == '' || buildingCal == '' || adjustCal == '') {
			alert('Enter value for all textboxs');
			return;
		}

		if (isNaN(fanBaseCal) || isNaN(currentCapacityCal) || isNaN(floodlightsLevelCal) || isNaN(parkingLevelCal) || isNaN(toiletsLevelCal) || isNaN(physioLevelCal) || isNaN(pitchDrainingLevelCal) || isNaN(pitchCoverLevelCal) || isNaN(sprinklersLevelCal) || isNaN(heatingLevelCal) || isNaN(medicalCenterLevelCal) || isNaN(restaurantLevelCal) || isNaN(merchandiseStandLevelCal) || isNaN(fastFoodPlaceLevelCal) || isNaN(sausageStandLevelCal) || isNaN(merchandiseStoreLevelCal) || isNaN(youthAcademyLevelCal) || isNaN(trainingGroundsLevelCal) || isNaN(extraHomeMatchCal) || isNaN(divisionCal) || isNaN(tradePlayerCal) || isNaN(buyStarCal) || isNaN(playerWageCal) || isNaN(staffWageCal) || isNaN(buildingCal) || isNaN(adjustCal)) {
			alert('Values must be a integer');
			return;
		}

		if (!(isInt(fanBaseCal) && isInt(currentCapacityCal) && isInt(floodlightsLevelCal) && isInt(parkingLevelCal) && isInt(toiletsLevelCal) && isInt(physioLevelCal) && isInt(pitchDrainingLevelCal) && isInt(pitchCoverLevelCal) && isInt(sprinklersLevelCal) && isInt(heatingLevelCal) && isInt(medicalCenterLevelCal) && isInt(restaurantLevelCal) && isInt(merchandiseStandLevelCal) && isInt(fastFoodPlaceLevelCal) && isInt(sausageStandLevelCal) && isInt(merchandiseStoreLevelCal) && isInt(youthAcademyLevelCal) && isInt(trainingGroundsLevelCal) && isInt(extraHomeMatchCal) && isInt(divisionCal) && isInt(tradePlayerCal) && isInt(buyStarCal) && isInt(playerWageCal) && isInt(staffWageCal) && isInt(buildingCal) && isInt(adjustCal))) {
			alert('Values must be a integer');
			return;
		}

		if (fanBaseCal < 0 || fanBaseCal > 100000) {
			alert('Fanbase value is between 0 - 100000');
			return;
		}
		if (currentCapacityCal < 0 || currentCapacityCal > 200000) {
			alert('Current stadium capacity value is between 0 - 200000');
			return;
		}
		if (floodlightsLevelCal < 0 || floodlightsLevelCal > 2) {
			alert('Floodlights level value is between 0 - 2');
			return;
		}
		if (parkingLevelCal < 0 || parkingLevelCal > 10) {
			alert('Parking level value is between 0 - 10');
			return;
		}
		if (toiletsLevelCal < 0 || toiletsLevelCal > 10) {
			alert('Toilets level value is between 0 - 10');
			return;
		}
		if (physioLevelCal < 0 || physioLevelCal > 10) {
			alert('Physio level value is between 0 - 10');
			return;
		}
		if (pitchDrainingLevelCal < 0 || pitchDrainingLevelCal > 1) {
			alert('Pitch draining level value is between 0 - 1');
			return;
		}
		if (pitchCoverLevelCal < 0 || pitchCoverLevelCal > 1) {
			alert('Pitch cover level value is between 0 - 1');
			return;
		}
		if (sprinklersLevelCal < 0 || sprinklersLevelCal > 1) {
			alert('Sprinklers level value is between 0 - 1');
			return;
		}
		if (heatingLevelCal < 0 || heatingLevelCal > 1) {
			alert('Heating level value is between 0 - 1');
			return;
		}
		if (medicalCenterLevelCal < 0 || medicalCenterLevelCal > 10) {
			alert('Medical center level value is between 0 - 10');
			return;
		}
		if (restaurantLevelCal < 0 || restaurantLevelCal > 10) {
			alert('Restaurant level value is between 0 - 10');
			return;
		}
		if (merchandiseStandLevelCal < 0 || merchandiseStandLevelCal > 10) {
			alert('Merchandise stand level value is between 0 - 10');
			return;
		}
		if (fastFoodPlaceLevelCal < 0 || fastFoodPlaceLevelCal > 10) {
			alert('Fast food place level value is between 0 - 10');
			return;
		}
		if (sausageStandLevelCal < 0 || sausageStandLevelCal > 10) {
			alert('Sausage stand level value is between 0 - 10');
			return;
		}
		if (merchandiseStoreLevelCal < 0 || merchandiseStoreLevelCal > 10) {
			alert('Merchandise store level value is between 0 - 10');
			return;
		}
		if (youthAcademyLevelCal < 0 || youthAcademyLevelCal > 10) {
			alert('Youth academy level value is between 0 - 10');
			return;
		}
		if (trainingGroundsLevelCal < 0 || trainingGroundsLevelCal > 10) {
			alert('Training grounds level value is between 0 - 10');
			return;
		}
		if (extraHomeMatchCal < 0 || extraHomeMatchCal > 50) {
			alert('Extra home match value is between 0 - 50');
			return;
		}
		if (divisionCal < 1 || divisionCal > 6) {
			alert('Division value is between 1 - 6');
			return;
		}
		if (playerWageCal < 0) {
			alert('Player wage value must be >= 0');
			return;
		}
		if (staffWageCal < 0) {
			alert('Staff wage value must be >= 0');
			return;
		}
		if (buildingCal < 0) {
			alert('Building value must be >= 0');
			return;
		}

		let averageAttendanceCal = calculateAverageAttendance(parkingLevelCal, toiletsLevelCal, floodlightsLevelCal, fanBaseCal, currentCapacityCal);
		let estimateAttendanceCal = calculateEstimateAttendance(parkingLevelCal, toiletsLevelCal, floodlightsLevelCal, fanBaseCal, currentCapacityCal);
		let recommendCapacityCal = calculateRecommendCapacity(parkingLevelCal, toiletsLevelCal, floodlightsLevelCal, fanBaseCal);

		let ticketIncomeCal = calculateTicketIncome(extraHomeMatchCal, averageAttendanceCal);
		let seatMantainCal = calculateSeatMaintain(currentCapacityCal);
		let ticketProfitCal = ticketIncomeCal - seatMantainCal;

		let commerceIncomeCal = calculateCommerceIncome(extraHomeMatchCal, averageAttendanceCal, restaurantLevelCal, merchandiseStandLevelCal, fastFoodPlaceLevelCal, sausageStandLevelCal, merchandiseStoreLevelCal);
		let commerceMaintainCal = calculateCommerceMaintain(restaurantLevelCal, merchandiseStandLevelCal, fastFoodPlaceLevelCal, sausageStandLevelCal, merchandiseStoreLevelCal);
		let commerceProfitCal = commerceIncomeCal - commerceMaintainCal;

		let tvMoneyCal = calculateTVMoney(divisionCal);
		let sponsorsCal = calculateSponsors(divisionCal);

		let otherMaintainCal = calculateOtherMaintain(physioLevelCal, pitchDrainingLevelCal, pitchCoverLevelCal, sprinklersLevelCal, heatingLevelCal, floodlightsLevelCal, parkingLevelCal, toiletsLevelCal, medicalCenterLevelCal, youthAcademyLevelCal, trainingGroundsLevelCal);
		let totalProfitCal = ticketProfitCal + commerceProfitCal + tvMoneyCal + sponsorsCal + Number(tradePlayerCal) - otherMaintainCal - playerWageCal * 12 - staffWageCal * 12 - buildingCal - buyStarCal + Number(adjustCal);

		$('#tm_script_span_average_attendance')[0].innerText = averageAttendanceCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_recommend_capacity')[0].innerText = recommendCapacityCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		$('#tm_script_span_ticket_income')[0].innerText = ticketIncomeCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_seat_maintain')[0].innerText = seatMantainCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_ticket_profit')[0].innerText = ticketProfitCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		$('#tm_script_span_commerce_income')[0].innerText = commerceIncomeCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_commerce_maintain')[0].innerText = commerceMaintainCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_commerce_profit')[0].innerText = commerceProfitCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		$('#tm_script_span_tv_money')[0].innerText = tvMoneyCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_sponsors')[0].innerText = sponsorsCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_other_maintain')[0].innerText = otherMaintainCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		$('#tm_script_span_total_profit')[0].innerText = totalProfitCal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function identifyFacilityLevel(facility) {
		let tooltip = facility.getAttribute('tooltip');
		let fromIndex = tooltip.search('Level: ');
		let toIndex = tooltip.search(']</p>');
		let strLength = 'Level: '.length + 1;
		return Number(tooltip.substr(fromIndex + strLength, toIndex - fromIndex - strLength).replace(/,/g, ''));
	}

	function calculateEstimateAttendance(parking, toilets, floodlights, fan, capacity) {
		let factor = (1 + parking / 100) * (1 + toilets / 100) * (1 + floodlights / 100) * (fan * 2.2);
		return Math.round((capacity < factor ? capacity : factor) * (1 - 0.05 / 100));
	}

	function calculateAverageAttendance(parking, toilets, floodlights, fan, capacity) {
		let factor = (1 + parking / 100) * (1 + toilets / 100) * (1 + floodlights / 100) * (fan * 2.244) * (1 - 7.5 / 100);
		return Math.round((capacity < factor ? capacity : factor) * (1 - 0.05 / 100));
	}

	function calculateRecommendCapacity(parking, toilets, floodlights, fan) {
		return Math.round((1 + parking / 100) * (1 + toilets / 100) * (1 + floodlights / 100) * (fan * 2.25));
	}

	function calculateOtherMaintain(physioLevel, pitchDrainingLevel, pitchCoverLevel, sprinklersLevel, heatingLevel, floodlightsLevel, parkingLevel, toiletsLevel, medicalCenterLevel, youthAcademyLevel, trainingGroundsLevel) {
		return 12 * (
			PHYSIO_MAINTAIN[physioLevel] +
			PITCH_DRAINING_MAINTAIN[pitchDrainingLevel] +
			PITCH_COVER_MAINTAIN[pitchCoverLevel] +
			SPRINKLERS_MAINTAIN[sprinklersLevel] +
			HEATING_MAINTAIN[heatingLevel] +
			FLOODLIGHTS_MAINTAIN[floodlightsLevel] +
			PARKING_MAINTAIN[parkingLevel] +
			TOILETS_MAINTAIN[toiletsLevel] +
			MEDICAL_CENTER_MAINTAIN[medicalCenterLevel] +
			YOUTH_ACADEMY_MAINTAIN[youthAcademyLevel] +
			TRAINING_GROUNDS_MAINTAIN[trainingGroundsLevel]);
	}

	function calculateCommerceIncome(extra = 0, attendance, restaurant, merchandiseStand, fastFoodPlace, sausageStand, merchandiseStore) {
		return Math.round(attendance * (
				restaurant * COMMERCE_PRICE.RESTAURANT * (COMMERCE_INCOME_FACTOR.RESTAURANT + CALCULATE_EXTRA_MATCH.RESTAURANT * extra) +
				merchandiseStand * COMMERCE_PRICE.MERCHANDISE_STAND * (COMMERCE_INCOME_FACTOR.MERCHANDISE_STAND + CALCULATE_EXTRA_MATCH.MERCHANDISE_STAND * extra) +
				fastFoodPlace * COMMERCE_PRICE.FAST_FOOD_PLACE * (COMMERCE_INCOME_FACTOR.FAST_FOOD_PLACE + CALCULATE_EXTRA_MATCH.FAST_FOOD_PLACE * extra) +
				sausageStand * COMMERCE_PRICE.SAUSAGE_STAND * (COMMERCE_INCOME_FACTOR.SAUSAGE_STAND + CALCULATE_EXTRA_MATCH.SAUSAGE_STAND * extra) +
				merchandiseStore * COMMERCE_PRICE.MERCHANDISE_STORE * (COMMERCE_INCOME_FACTOR.MERCHANDISE_STORE + CALCULATE_EXTRA_MATCH.MERCHANDISE_STORE * extra)));
	}

	function calculateCommerceMaintain(restaurant, merchandiseStand, fastFoodPlace, sausageStand, merchandiseStore) {
		return 12 * (
			restaurant * COMMERCE_MAINTAIN.RESTAURANT +
			merchandiseStand * COMMERCE_MAINTAIN.MERCHANDISE_STAND +
			fastFoodPlace * COMMERCE_MAINTAIN.FAST_FOOD_PLACE +
			sausageStand * COMMERCE_MAINTAIN.SAUSAGE_STAND +
			MERCHANDISE_STORE_MAINTAIN[merchandiseStore]);
	}

	function calculateTicketIncome(extra = 0, attendance) {
		return attendance * TICKET_PRICE * (17 + Number(extra)); //17 home match in league, extra is home match in cup, national cup...
	}

	function calculateSeatMaintain(seat) {
		return seat * SEAT_MAINTAIN * 12; //12 month
	}

	function calculateTVMoney(div) {
		return TV_MONEY[div] * 12;
	}

	function calculateSponsors(div) {
		return Math.round(SPONSORS[div] * 12 * 7 / 10);
	}

	function isInt(n) {
		return n % 1 === 0;
	}
})();
