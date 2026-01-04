// ==UserScript==
// @name         Venus Smart Planning DEV ONLY
// @namespace    http://tampermonkey.net/
// @version      1.26
// @description  Improves Venus printable planning, based of Venus API and HTML datas. !It does not change serverside code!
// @author       Valentin
// @match        http://10.1.74.201/venus/*planning_main_listing*
// @grant        none
// @license		 GNU
// @downloadURL https://update.greasyfork.org/scripts/444962/Venus%20Smart%20Planning%20DEV%20ONLY.user.js
// @updateURL https://update.greasyfork.org/scripts/444962/Venus%20Smart%20Planning%20DEV%20ONLY.meta.js
// ==/UserScript==

/*	TODO LIST
	logo black and white print improvement
	duplicate name search on short names
	printable display 
*/

var $ = window.jQuery;

//once HTML finished the load
$(document).ready( function() {
	var startOfScript = new Date().getTime();
	console.log('Smart planning : initializing...');

	/*extract plannings's data from HTML. Returns array of Planning
	Planning
		planning.name string
		planning.nameHtml string
		planning.appointments[] Appointment

	Appointment
		appointment.hour string
		appointment.patientName string
		appointment.familyNames string;
		appointment.firstNames string;
		appointment.regex string;
		appointment.duplicatedName array;
		appointment.warning boolean
		appointment.examNumber int
		appointment.examName string
		appointment.doctorRequired boolean
		appointment.planning string
	*/

	function getPlannings() {
		var htmlPlannings = $('#resultat > div'); //get HTML plannings per service
		var plannings = [];
		var knownPatients = [];

		for (var i = 2; i < htmlPlannings.length; i++) { //each planning
			var htmlPlanning = htmlPlannings.eq(i);

			var planning = new Object();
			planning.name = htmlPlanning.find('div > center > b').html(); //get the name of the service
			planning.nameHtml = htmlPlanning.find('div').eq(0).prop("outerHTML"); //get the HTML of the name
			planning.appointments = [];

			var appointments = htmlPlannings.eq(i).children('div'); //get the appointments for the service

			for (var j = 1; j < appointments.length; j++) { //each appointment
				var hour = (planningShort)
					? appointments.eq(j).find('td').eq(0).find('[class*=small]')
					: appointments.eq(j).find('table tr').eq(0).find('td').eq(0).find('p');

				if (hour.length == 0) continue; //if no hour found, then wrong HTML element

				var appointment = new Object();

				appointment.hour = hour.html(); //get the hour

				var names = (planningShort) //get correctly parsed names of patient
					? parseNames(appointments.eq(j).find('td').eq(1).find('b').eq(0).html())
					: parseNames(appointments.eq(j).find('table tr').eq(0).find('td').eq(3).find('b').html());
				
				if (!planningShort) {
					var doctorHTML = appointments.eq(j).find('table tr').eq(0).find('td').eq(1).find('p').html().match(new RegExp('\\[([a-z]+)','i'));
					var secretaryHTML = appointments.eq(j).find('table tr').eq(0).find('td').eq(1).find('p').html().match(new RegExp('([a-z]+)]','i'));
					
					appointment.doctor = (doctorHTML == null) ? false : doctorHTML[1];
					appointment.secretary = (secretaryHTML == null) ? false : secretaryHTML[1];
				}
				else {
					appointment.doctor = false;
					appointment.secretary = false;
				}

				appointment.patientName = names[0]; //optimization purpose
				appointment.familyNames = names[1];
				appointment.firstNames = names[2];
				appointment.regex = names[3];
				appointment.duplicatedName = [];
				appointment.planning = planning.name;
				appointment.warning = [];

				appointment.examNumber = 1; //number of exams for the patient
				appointment.examName = (planningShort) //get the name of the exam
					? appointments.eq(j).find('td').eq(1).find('b').eq(1).html()
					: appointments.eq(j).find('table tr').eq(0).find('td').eq(2).find('b').html();
				appointment.examName = parseExamName(appointment.examName.trim());

				appointment.birthday = (planningShort) ? false : appointments.eq(j).find('table tr').eq(0).find('td').eq(4).find('span').html();
				appointment.age = (planningShort) ? false : getAge(appointment.birthday);
				appointment.cellphone = (planningShort) ? false : appointments.eq(j).find('table tr').eq(0).find('td').eq(5).find('span').html();
				appointment.comment = (planningShort) ? false : appointments.eq(j).find('table tr').eq(3).find('td').html().substring(14);

				appointment.doctorRequired = false;
				if (planning.name.match(new RegExp('e\\.|mam|hosp', 'gi'))) //echography planning = doctor
					appointment.doctorRequired = true;
				else if(appointment.examName.match(new RegExp('hys|art|infil|ifl|togd|cyst', 'gi'))) //infiltration planning = doctor
					appointment.doctorRequired = true;

				//set multi appointements for the same patient AND extraction of all unique patient names (performance issues)
				knownPatients[appointment.patientName] = (isNaN(knownPatients[appointment.patientName])) ? 1 : knownPatients[appointment.patientName] + 1;

				planning.appointments.push(appointment);
			}

			plannings.push(planning);
		}

		//setting multi appointements for the same patient
		for (var i = 0; i < plannings.length; i++) {
			for (var j = 0; j < plannings[i].appointments.length; j++) {
				if (knownPatients[plannings[i].appointments[j].patientName] > 1) {
					plannings[i].appointments[j].examNumber = knownPatients[plannings[i].appointments[j].patientName];
				}
			}
		}

		// multiple patients with a same name
		var knownNames = Object.keys(knownPatients); //get each unique name

		for (var i = 0; i < plannings.length; i++) {
			for (var j = 0; j < plannings[i].appointments.length; j++) { //each appointement (aka exam of a patient)
				for (var k = 0; k < knownNames.length; k++) { //each unique name (aka patient)
					if (knownNames[k] != plannings[i].appointments[j].patientName) { //not the same patient
						var duplicatedName = knownNames[k].match(new RegExp (plannings[i].appointments[j].regex, 'g'));

						if (duplicatedName) { //the names match
							for (var l = 0; l < duplicatedName.length; l++) {
								if (plannings[i].appointments[j].duplicatedName.indexOf(duplicatedName[l]) == -1) //name not referenced
									plannings[i].appointments[j].duplicatedName.push(duplicatedName[l]);
							}
						}
					}
				}
			}
		}

		return plannings;
	}

	//plannings : raw data extract from venus HTML planning
	function planningsToArray(plannings) {
		var planningsRows = [];
		var examDuration = 5; //in minutes
		var startOfDay = 8 * 60; //hour
		var endOfDay = 19 * 60; //hour

		for (var key = 0; key < endOfDay; key += examDuration) { //set the maximum planning size, key is the minute if the day for its exam (memory allocation)
			planningsRows[key] = [];

			for (var planning in plannings) { //set a cell for each planning in each row (performance issues)
				planningsRows[key][plannings[planning].name] = [];
			}
			if (key == 0) key = startOfDay - examDuration; //unsheduled appointments at key 0
		}

		for (var planning in plannings) { //each planning
			for (var appointment in plannings[planning].appointments) { //each appointment
				var appointmentToAdd = plannings[planning].appointments[appointment];
				var rowId = getRowId(plannings[planning].appointments[appointment].hour);
				var planningName = plannings[planning].name;

				planningsRows[rowId][planningName].push(appointmentToAdd);
			}
		}

		return planningsRows;
	}

	//doctorOnly = get the doctor required exams only
	function planningsToHTML(rows, plannings, planningType) {
		//each non-empty row of planning gets a TR
		//each planning gets a TD, even if empty
		var doctorOnly = (planningType == 'doctor') ? true : false;
		var val = (planningType == 'val') ? true : false;
		var afternoonBegins = 780; //1pm (13h*60min)
		var lunchBrake = false;
		var firstExam = true;

		var examCount = [];
		for (planning in plannings) {
			examCount[plannings[planning].name + 'am'] = 0;
			examCount[plannings[planning].name + 'ami'] = 0;
			examCount[plannings[planning].name + 'amin'] = 0;
			examCount[plannings[planning].name + 'pm'] = 0;
			examCount[plannings[planning].name + 'pmi'] = 0;
			examCount[plannings[planning].name + 'pmin'] = 0;
			examCount[plannings[planning].name + 'doctorAm'] = false;
			examCount[plannings[planning].name + 'doctorPm'] = false;
		}

		var tableTopHTML = '<table id="appointements" class="' + ((planningShort) ? 'short' : 'detailed') + ((val) ? ' val' : '') + '"><tbody>';
		var tableAmHTML = '';
		var tableHTML = '';

		//TR building
		for (var row in rows) {
			var noAppointment = true; //no appointement found > no TR
			rowHTML = '';
			
			//split table after lunchbreak for lazyness purpose
			if (row >= afternoonBegins && lunchBrake == false) {
				tableAmHTML = tableHTML;
				tableHTML = '';
				lunchBrake = true;
				
				tableAmHTML += '<tr>';
				var planningCount = 0;
				for (var planning in rows[row]) {
					tableAmHTML += '<td class="empty daybreak am">';
					if (planningCount == 0) tableAmHTML += '<span class="left_foldable_mark">--</span>';
					if (planningCount == plannings.length - 1) tableAmHTML += '<span class="right_foldable_mark">--</span>';
					tableAmHTML += '</td>';
					
					planningCount++;
					if (planningCount < plannings.length)
						tableAmHTML += '<td class="empty separator"></td>';
				}
				tableAmHTML += '</tr>';
			}

			//morning or afternoon, 14H * 60min = 840min
			rowHTML += '<tr id="exam_row_' + row + '" class="' + ((row < afternoonBegins) ? 'am' : 'pm') + '">';
			
			//TD building > 1 TD for each planning
			var planningCount = 0;
			for (var planning in rows[row]) {
				var planningHTML = '';
				var planningClasses = '';
				var empty = true; //no appointement > TD declared empty

				//TD content building > each exam appointement get stacked
				for (var appointment in rows[row][planning]) {
					if (!doctorOnly || doctorOnly && rows[row][planning][appointment].doctorRequired) { //default planning OR doctor required planning
						noAppointment = false;
						empty = false;
						var warningsHTML = '';
						var appointmentClasses = 'appointment';
						if (planningShort) appointmentClasses += ' short';
						
						if (false == examCount[rows[row][planning][appointment].planning + 'doctorAm'] && row < afternoonBegins)
							examCount[rows[row][planning][appointment].planning + 'doctorAm'] = rows[row][planning][appointment].doctor;
						
						if (false == examCount[rows[row][planning][appointment].planning + 'doctorPm'] && row >= afternoonBegins)
							examCount[rows[row][planning][appointment].planning + 'doctorPm'] = rows[row][planning][appointment].doctor;

						if (rows[row][planning][appointment].doctorRequired)
							planningClasses += ' doctor_required';
						
						if (rows[row][planning][appointment].duplicatedName.length > 0)
							warningsHTML += '&#9888';
						if (val && rows[row][planning][appointment].age < 18)
							warningsHTML += '&#9786;';

						//highlight duplicated family names for multiple patients
						var familiyNamesHTML = rows[row][planning][appointment].familyNames;
						for (var i = 0; i < rows[row][planning][appointment].duplicatedName.length; i++)
							familiyNamesHTML = familiyNamesHTML.replace(new RegExp(rows[row][planning][appointment].duplicatedName[i],'g') , '<span class="duplicated">' + rows[row][planning][appointment].duplicatedName[i] + '</span>');

						//HTML build from minimzed parsed HTML
						if(planningShort){ // new radio style
						planningHTML += '<div class="' + appointmentClasses + '"><div class="infos"><table class="petit"><tbody><tr><td><p class="xsmall hour">' + rows[row][planning][appointment].hour + '</p></td><td class="exam">';
						planningHTML += '<div class="patient"><span class="family_name">' + familiyNamesHTML + '</span> <span class="first_names">' + rows[row][planning][appointment].firstNames + '</span></div>';
						planningHTML += '<div class="name">' + rows[row][planning][appointment].examName + ((rows[row][planning][appointment].examNumber > 1) ? ' <span class="number">[' + rows[row][planning][appointment].examNumber + ']</span>' : '') + '</div>';
						planningHTML += '</td></tr></tbody></table></div>';
						planningHTML += '<div class="warnings">' + warningsHTML + '</div>';
						planningHTML += '</div>';
						}
						else {
						//old venus style
						planningHTML += '<div class="' + appointmentClasses + '">';
						planningHTML += '<table class="petit"><tbody><tr>';
						planningHTML += '<td class="hour"><p class="xsmall">' + rows[row][planning][appointment].hour + '</p></td>';
						planningHTML += '<td class="name"><span class="';
						
						if (isInjected(rows[row][planning][appointment].examName)) {
							planningHTML +=' injected';
							examCount[rows[row][planning][appointment].planning + ((row < afternoonBegins) ? 'ami' : 'pmi')]++;
						}
						if (needInjector(rows[row][planning][appointment].examName)) {
							planningHTML +=' injector';
							examCount[rows[row][planning][appointment].planning + ((row < afternoonBegins) ? 'amin' : 'pmin')]++;
						}
						if (needMaterial(rows[row][planning][appointment].examName))
							planningHTML +=' material';
						
						examCount[rows[row][planning][appointment].planning + ((row < afternoonBegins) ? 'am' : 'pm')]++;

						planningHTML += '">' + rows[row][planning][appointment].examName + '</span></td>';
						planningHTML += '<td class="patient"><span class="family_name">' + familiyNamesHTML + '</span> <span class="first_names">' + rows[row][planning][appointment].firstNames + '</span></td>';
						planningHTML += '<td class="warnings"><span>' + ((rows[row][planning][appointment].examNumber > 1) ? '<span class="number">[' + rows[row][planning][appointment].examNumber + ']</span> ' : '') + warningsHTML + '</span></td>';
						planningHTML += '<td class="birthday"><span>' + rows[row][planning][appointment].birthday + '</span></td>';
						if (!val) planningHTML += '<td class="cellphone"><span>' + rows[row][planning][appointment].cellphone + '</span></td>';
						if (val) planningHTML += '<td class="age"><span class="' + (checkPregnancy(rows[row][planning][appointment].age) ? 'possiblePregnancy' : '') + ((rows[row][planning][appointment].age < 18) ? ' underage' : '') + (birthdayToday(rows[row][planning][appointment].birthday) ? ' birthdayToday' : '') + '">' + rows[row][planning][appointment].age + '</span></td>';
						planningHTML += '</tr><tr><td colspan="100" class="comment"><span>' + rows[row][planning][appointment].comment + '</span></td>';
						planningHTML += '</tr></tbody></table>';
						planningHTML += '</div>';
						}
					}
				}

				planningClasses += (empty) ? ' empty' : ' full';

				rowHTML += '<td class="' + planningClasses + '">' + planningHTML + '</td>';
				
				planningCount++;
				if (planningCount < plannings.length)
					rowHTML += '<td class="empty separator"></td>';
			}

			rowHTML += '</tr>';

			if(noAppointment) continue;

			tableHTML += rowHTML;
		}

		tableHTML += '</tbody></table></div>';

		//TH row building
		tableTopHTML += '<tr class="am">';
		var planningCount = 0;
		for (planning in plannings) {
			tableTopHTML += '<th><span class="planning_name">' + plannings[planning].name + '</span>';
			if (val) {
				tableTopHTML += ' - <span class="planning_doctor">' + examCount[plannings[planning].name + 'doctorAm'] + '</span>';
				tableTopHTML += '<span class="countsInjection">';
				tableTopHTML += ' (<span class="countInjected">' + examCount[plannings[planning].name + 'ami'] + '</span>';
				tableTopHTML += ' injecté' + (examCount[plannings[planning].name + 'ami'] > 1 ? 's' : '') + ' / ';
				tableTopHTML += '<span class="countInjector">' + examCount[plannings[planning].name + 'amin'] + '</span>';
				tableTopHTML += ' injecteur' + (examCount[plannings[planning].name + 'amin'] > 1 ? 's' : '') + ')</span>';
				tableTopHTML += '<span class="countExam">(' + examCount[plannings[planning].name + 'am'] + ' examen' + (examCount[plannings[planning].name + 'am'] > 1 ? 's' : '') + ')</span>';
			}
			tableTopHTML += '</th>';
			planningCount++;
			if (planningCount < plannings.length)
				tableTopHTML += '<th class="empty separator"></th>';
		}
		tableTopHTML += '</tr>';
		
		planningCount = 0;
		var tableTopPmHTML = '<tr class="pm">';
		for (planning in plannings) {
			tableTopPmHTML += '<th><span class="planning_name">' + plannings[planning].name + '</span>';
			if (val) {
				tableTopPmHTML += ' - <span class="planning_doctor">' + examCount[plannings[planning].name + 'doctorPm'] + '</span>';
				tableTopPmHTML += '<span class="countsInjection">';
				tableTopPmHTML += ' (<span class="countInjected">' + examCount[plannings[planning].name + 'pmi'] + '</span>';
				tableTopPmHTML += ' injecté' + (examCount[plannings[planning].name + 'pmi'] > 1 ? 's' : '') + ' / ';
				tableTopPmHTML += '<span class="countInjector">' + examCount[plannings[planning].name + 'pmin'] + '</span>';
				tableTopPmHTML += ' injecteur' + (examCount[plannings[planning].name + 'pmin'] > 1 ? 's' : '') + ')</span>';
				tableTopPmHTML += '<span class="countExam">(' + examCount[plannings[planning].name + 'pm'] + ' examen' + (examCount[plannings[planning].name + 'pm'] > 1 ? 's' : '') + ')</span>';
			}
			tableTopPmHTML += '</th>';
			planningCount++;
			if (planningCount < plannings.length)
				tableTopPmHTML += '<th class="empty separator"></th>';
		}
		tableTopPmHTML += '</tr>';

		return tableTopHTML + tableAmHTML + tableTopPmHTML + tableHTML;
	}

	//input format hh:mm
	//returns corresponding minute of the day, wrong input = 0
	function getRowId(examHour) {
		var minute = 0;

		var serializedMinute = examHour.match(new RegExp('[0-9]{2}', 'g'));

		if(serializedMinute == null) return 0;

		minute = parseInt(serializedMinute[0]) * 60;
		unroundedMinutes = parseInt(serializedMinute[1]);

		if ((unroundedMinutes % 5) == 0)//already rounded
			minute += unroundedMinutes;
		else
			if ((unroundedMinutes % 5) > 2) //round to first quarter to handle unconvenient appointment hour
				minute += (5 - (unroundedMinutes % 5)) + unroundedMinutes;
			else
				minute += unroundedMinutes - (unroundedMinutes % 5);

		return minute;
	}
	
	//returns short exam name
	function parseExamName(examName) {
		if (examName.match(new RegExp('\\(','gi'))) {
			examNames = examName.split(new RegExp('[\\s|\\t]+', 'g'));
			examName = examNames[0];
			
			for (var i = 1; i < examNames.length; i++) {
				if (examNames[i].slice(-1) !== ')')
					examName +=  ' ' + examNames[i];
			}
		}
		
		return examName;
	}

	//returns array of string names
	//return [names, familyNames, firstNames, regex]
	function parseNames(unparsedName) {
		unparsedName = unparsedName.split(new RegExp('[\\s|\\t]+', 'g'));
		var smallNameLength = 2; //length of small name
		var regexLength = 10; //number of names set for the search on patient family names
		var names = '';
		var familyNames = [];
		var firstNames = '';
		var regex = '';
		var onlySmallNames = true;

		//name parsing
		for (var i = 0; i < unparsedName.length; i++) {
			if (unparsedName[i] == '') continue;

			if (unparsedName[i].match(new RegExp('^[A-Z|À-ÿ|-]+$'))) { //uppercase or lowercase but with accent only -> Familly name
				familyNames.push(unparsedName[i]);

				if (unparsedName[i].length > smallNameLength) onlySmallNames = false;
			}
			else
				firstNames += unparsedName[i] + ' ';
		}

		//regex and familyNames building
		var familyNamesString = '';
		for (var i = 0; i < familyNames.length; i++) {
			if (onlySmallNames || familyNames[i].length > smallNameLength) { //avoid the search on short names under 2 char length, unless if the names are only made of 2 char words
				regex += familyNames[i] + '|';
			}

			familyNamesString += familyNames[i] + ' ';
		}

		familyNamesString = familyNamesString.substring(0, familyNamesString.length - 1);
		firstNames = firstNames.substring(0, firstNames.length - 1);
		names = familyNamesString + ' ' + firstNames;
		regex = '\\b(' + regex.substring(0, regex.length - 1) + ')\\b';

		return [names,familyNamesString,firstNames,regex];
	}

	//return true if injection needed
	function isInjected(examName) {
		if (examName.match(new RegExp('([^umo]i|orl|tho|k|hyp|tsa|ep|mam|iv|pancreas|urosc)$|lomi|jami|coro|ang|pro|ren|ent|par', 'i')) !== null)
			return true;

		return false;
	}

	//return true if injector needed
	function needInjector(examName) {
		if (examName.match(new RegExp('coro|ang[^c]|pro|ren|abd[^o]{0,}$|bil|par|tsa|mam|urosc', 'i')) !== null)
			return true;

		return false;
	}
	
	//return true if material needed
	function needMaterial(examName) {
		if (examName.match(new RegExp('colo|ent', 'i')) !== null)
			return true;

		return false;
	}

	//return the age for the given date
	function getAge(birthDate) {
		var today = new Date();
		var birthday = new Date(birthDate.substring(6,10),parseInt(birthDate.substring(3,5)) - 1,birthDate.substring(0,2));
		var age = today.getFullYear() - birthday.getFullYear();
		var month = today.getMonth() - birthday.getMonth();
		var day = today.getDate() - birthday.getDate();

		if (month < 0 || day < 0)
			age--;

		return (age > 0) ? age : 0;
	}

	//happy birthday
	function birthdayToday(birthDate) {
		var today = new Date();
		var day = today.getDate() - parseInt(birthDate.substring(0,2));
		var month = today.getMonth() - (parseInt(birthDate.substring(3,5)) - 1);

		if (month == 0 && day == 0)
			return true;

		return false;
	}

	//true if possible pregnancy for the given age
	function checkPregnancy(age) {
		var beginning = 13;
		var end = 52;

		if (age >= beginning && age <= end) return true;

		return false;
	}

	//set the checkbox inputs for the script
	function setCheckboxes() {
		var inputForm = ' Planning docteur : <input type="checkbox" id="require_doctor"><input type="checkbox" id="val_planning"><span title="Val Corporation, all rights reserved.">Smart Planning&trade;</span> : <input type="checkbox" id="show_smart_planning" checked="checked">';

		$('#chk_pm').after(inputForm);

		$('#require_doctor').click(function() { //handle doctor required planning display
			if($('#require_doctor').is(':checked')) {
				replacePlannings('doctor');
			}
			else {
				replacePlannings('default');
			}
		});

		$('#val_planning').click(function() { //handle val planning display
			if($('#val_planning').is(':checked')) {
				replacePlannings('val');
				$('#smart_planning').addClass('val');
			}
			else {
				replacePlannings('default');
				$('#smart_planning').removeClass('val');
			}
		});

		$('#show_smart_planning').click(function() { //hanlde Venus/Smart planning switch display
			if($('#show_smart_planning').is(':checked')) {
				$('#smart_planning').show();
				$('#resultat').hide();
				$('#require_doctor').prop('disabled', false);
			}
			else {
				$('#smart_planning').hide();
				$('#resultat').show();
				$('#require_doctor').prop('disabled', true);
			}
		});

		$('.alt_vac').click(function() { //handle the refresh of the patient count when showing/hiding part of planning
			if($('#show_smart_planning').is(':checked'))
				refreshPatientCounter();
		});
	}

	//val code listener
	var lastPressed = '';
	function setValListener() {
		$(document).keyup(function(e) {
			lastPressed = (lastPressed + e.which).slice(-6);

			if (lastPressed == 866576) {// 'val' pressed
				var room = $('#room_opt').val();
				var ok = true;
				
				for (var i = 0; i < room.length; i++) {
					if (room[i] != 4 && room[i] != 5 && room[i] != 27)
						ok = false;
				}
				
				if (!ok) {// ugly but lazy : if scan/IRM planning not showed, reload page to get them
				//checking right checkboxes for scan/IRM planning
					if ($('#ui-multiselect-room_opt-option-0').is(':checked') == false)
						$('#ui-multiselect-room_opt-option-0').click();
					if ($('#ui-multiselect-room_opt-option-1').is(':checked') == true)
						$('#ui-multiselect-room_opt-option-1').click();
					if ($('#ui-multiselect-room_opt-option-2').is(':checked') == false)
						$('#ui-multiselect-room_opt-option-2').click();
					if ($('#ui-multiselect-room_opt-option-3').is(':checked') == false)
						$('#ui-multiselect-room_opt-option-3').click();
					if ($('#ui-multiselect-room_opt-option-4').is(':checked') == true)
						$('#ui-multiselect-room_opt-option-4').click();
					if ($('#ui-multiselect-room_opt-option-5').is(':checked') == true)
						$('#ui-multiselect-room_opt-option-5').click();
					if ($('#ui-multiselect-room_opt-option-6').is(':checked') == true)
						$('#ui-multiselect-room_opt-option-6').click();
					if ($('#ui-multiselect-room_opt-option-7').is(':checked') == true)
						$('#ui-multiselect-room_opt-option-7').click();
					if ($('#ui-multiselect-room_opt-option-8').is(':checked') == true)
						$('#ui-multiselect-room_opt-option-8').click();
					if ($('#ui-multiselect-room_opt-option-9').is(':checked') == true)
						$('#ui-multiselect-room_opt-option-9').click();
					if ($('#ui-multiselect-room_opt-option-10').is(':checked') == true)
						$('#ui-multiselect-room_opt-option-10').click();
					if ($('#ui-multiselect-room_opt-option-11').is(':checked') == true)
						$('#ui-multiselect-room_opt-option-11').click();
					
					localStorage.setItem('val', '1');				
					$('#valid').click();
				}
				else //display purpose
					$('#val_planning').click();
			}
		});
	}
	function valHandler() {
		if (localStorage.getItem('val') == '1') {
			$('#val_planning').click();
			localStorage.setItem('val', '0');
		}
	}

	//need to be global for perfomance issues
	var plannings = [];
	var planningsArray = [];
	var planningShort;

	//get the data from the Venus's HTML
	function getData() {
		planningShort = (window.location.href.match(new RegExp('planning_main_listing_journee', 'gi'))) ? false : true;
		plannings = getPlannings();
		planningsArray = planningsToArray(plannings);
    }

	//set the HTML element for the script
	function setHTML() {
		var style = '<style>#smart_planning #appointements th .countsInjection {font-weight: normal;float:left;width:150px;text-align: left;}#smart_planning #appointements th .countExam {font-weight: normal;float:right;width:100px;text-align: right;}#smart_planning #appointements th .planning_name {margin-left: -50px;}#smart_planning #appointements .left_foldable_mark {float:left;vertical-align: middle;margin-left:-10px;}#smart_planning #appointements .right_foldable_mark {float:right;vertical-align: middle;margin-right:-10px;}#smart_planning #appointements th {font-size: 10pt;background-color: lightblue;border: solid 1px black;text-align: center;}#smart_planning.val .injected {border: 1px solid black;padding: 0px 1px 0px 1px;}#smart_planning.val .injector {color: white;background-color: black;}#val_planning {display: none;}#smart_planning .possiblePregnancy{text-decoration:underline;}#smart_planning .birthdayToday{text-decoration:wavy underline;}#smart_planning .underage{font-weight:bold;}#smart_planning #bottom_header #patient_count{display:none;}#smart_planning #bottom_header #legend{float:right;}#smart_planning #bottom_header{margin-top:10px;}#smart_planning #bottom_header #valcorp_logo{float:left;}#smart_planning #bottom_header #infos{float:right;}#smart_planning #appointements {border-collapse:collapse;margin-left:10px;}#smart_planning #appointements td {border:1px solid black;height:100%;}#smart_planning #appointements .petit td {border:none;}#smart_planning #appointements .empty {border:1px dashed grey;}#smart_planning #appointements .daybreak {border:none;height:15px;}#smart_planning #appointements .separator {width:20px;border:none;background:none;}#smart_planning #appointements.short th div {padding-left:10px;padding-right:10px;}#smart_planning #appointements.short .appointment{width:200px;}#smart_planning #appointements .warnings {float:right;font-size:15pt;width:20px;}#smart_planning #appointements .petit {margin:-3px 0 -3px 0;}#smart_planning #appointements.val .comment span {width:auto;display:block;}#smart_planning #appointements.val .hour {width:50px;}#smart_planning #appointements.val .name {width:100px;}#smart_planning #appointements.val .age {width:30px;}}#smart_planning #appointements.val .birthday {width:80px;}#smart_planning #appointements.short .infos {float:left;overflow:hidden;}#smart_planning #appointements.short .infos {width:180px;}#smart_planning #appointements.short .hour {padding-right:4px;}#smart_planning #appointements.short .patient {font-size:9pt;white-space:nowrap;overflow:hidden;max-width:350px;}#smart_planning #appointements .name {font-size:9pt;font-weight:bold;}#smart_planning #appointements .family_name {font-weight: bold;}#smart_planning #appointements .family_name .duplicated {text-decoration: underline;}#smart_planning #appointements .number {font-size:9pt;margin-left:3px;}#smart_planning #appointements .comment {font-size:8pt;}#smart_planning #appointements .cellphone, #smart_planning #appointements .birthday {font-size:9pt;}#smart_planning #appointements.detailed .hour {width:50px;}#smart_planning #appointements.detailed .name {width:100px;}#smart_planning #appointements.detailed .patient {width:300px;}#smart_planning #appointements.detailed .warnings {width:100px;}#smart_planning #appointements.detailed .birthday {width:80px;}#smart_planning #appointements.detailed .cellphone {width:100px;}@media print {#smart_planning {position:absolute;top:150px;left:0px;padding:10px;}#smart_planning.val {top:0px;}#smart_planning.val #top_header {display:none;}#fixed_header {display:none;}#smart_planning.val #bottom_header #legend, #smart_planning.val #bottom_header #valcorp_logo{display:none;}#smart_planning #appointements {width:100%;margin:0px;}@page {margin-top: 1cm;margin-bottom: 1cm;margin-left: 1cm;margin-right: 1cm;}}</style>';
		var date = $('#resultat > div').eq(0).prop('outerHTML');

		$('body').append(style);
		$('body').append('<div id="smart_planning"><div id="top_header">' + date + '</div><div id="bottom_header"><img id="valcorp_logo" src="https://i.ibb.co/2N11DDr/val-corp-final.png" alt="val incorporation"><table id="infos"><tbody><tr><td><div id="patient_count"><span id="patient_counter"></span> examen(s).</div></td></tr><tr><td><div id="legend"><sup>1</sup> [2<sup>+</sup>] nombre d\'examens du patient.</br><sup>2</sup> &#9888 multiples patients avec le même <u>nom</u>.</div></td></tr></tbody></table></div></div>');
		setCheckboxes();
		setValListener();
		$('#resultat').hide();
	}

	function refreshPatientCounter() { //delay de refresh because of execution time issues
		setTimeout( function(){
			$('#patient_counter').html($('.appointment:visible').length);
		}, 200);
	}

	//build and display the new planning
	//doctorOnly = get the doctor required exams only
	function replacePlannings(planningType) {
		var htmlTable = planningsToHTML(planningsArray, plannings, planningType);

		$('#smart_planning #appointements').remove(); //remove in case of already displayed (display issues if just hided/shown)
		$('#smart_planning #top_header').after(htmlTable);
		refreshPatientCounter();
	}

	getData();
	setHTML();
	replacePlannings('default');
	valHandler();
	
	console.log('Smart planning started in : ' + (new Date().getTime() - startOfScript) + ' ms');
	console.log('Smart planning running...');
});