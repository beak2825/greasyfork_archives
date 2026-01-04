// ==UserScript==
// @name 			GetDataFromTests
// @namespace		http://hajnrych.pl/
// @description		New script for testing
// @author          Marek 'hajnr' Hajnrych
// @include			*gpro.net/*/Testing.asp*
// @require 		https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version			0.98.61
// @grant 			GM.setValue
// @grant 			GM.getValue
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/35189/GetDataFromTests.user.js
// @updateURL https://update.greasyfork.org/scripts/35189/GetDataFromTests.meta.js
// ==/UserScript==

var jq = jQuery.noConflict();

var protocol = location.protocol;
var hostname = location.hostname;

var mainurl = protocol + '//' + hostname + '/gb/gpro.asp';
var profile = protocol + '//' + hostname + '/gb/ManagerProfile.asp?IDM=';
var facilities = protocol + '//' + hostname + '/gb/StaffAndFacilities.asp';
var driverprofile = protocol + '//' + hostname + '/gb/DriverProfile.asp?ID=';
var tdprofile = protocol + '//' + hostname + '/gb/TechDProfile.asp?ID=';
var savelink = 'http://hajnr2.ayz.pl/prt/testing/save';
var checklink = 'http://hajnr2.ayz.pl/prt/testing/check';

jq(document).ready(function() {

	var ref = document.referrer;
	var url = document.URL;
    
	//console.log(ref);
	//console.log(url);

    // Ikonki i animacja
    jq("input[name='DriveStint']").after("<img id='ajax-load' src='http://hajnrych.pl/prt/users/hajnr/testing/ajax-loader.gif'>");
    jq("input[name='DriveStint']").attr('onclick', null);
    //jq("input[name='DriveStint']").after("<a href='http://localhost/test/gpro/testing/Testing.html'>ref</a>")
	// Usunięcie guzika "TESTING" w celu uniknięcia powtórnego
	// przesłania zapytania AJAX
	//jq(".subnavigation li:eq(1)").remove();

	jq.get(mainurl).done(function(data) {

		
		var msr = getManagerIdAndRaceNumber(data);
		profile += (msr.id).toString();
		//console.log("S"+msr.season + "R" + msr.race);

		jq.get(profile).done(function(data) {

			var team = getStaffID(data);
			//console.log(team);
			driverprofile += (team.driver).toString();

			jq.get(driverprofile).done(function(data){

				var driver_skills = getDriverSkills(data);
				//console.log(skills);

				jq.get(facilities).done(function(data){

					var staff_skills = getStaffSkills(data);
					var test_pts = getCurrentPoints();
					var car_parts = getCurrentCar();
					//var prior = getPriority();

					if(team.td>0) {

						tdprofile += (team.td).toString();
						
						jq.get(tdprofile).done(function(data){

							var tech_skills = getTDSkills(data);

							var sendThisData = manualSerialization(msr, team, staff_skills, driver_skills, tech_skills, car_parts, null, test_pts);
							
							databasesave(sendThisData, msr);
							manualsave(sendThisData, msr);

							if(typeof GM.getValue('wasClicked') !== 'undefined') {
								if((ref.localeCompare(url) === 0) && (GM.getValue('wasClicked') == 1)) {
									console.log('Wykonuje autosave');
									var pobierzLap = getLastStint();
									var sendData = manualSerialization(msr, team, staff_skills, driver_skills, tech_skills, car_parts, pobierzLap, test_pts);
									autosave(sendData);
								}
							}

						}).fail(function(data){
							console.log('TD fail');
							delAjaxLoaderGif("Nie mogę pobrać TD");
						});

					} else {

						var sendThisData = manualSerialization(msr, team, staff_skills, driver_skills, null, car_parts, null, test_pts);
											
						databasesave(sendThisData, msr);
						manualsave(sendThisData, msr);

						if(typeof GM.getValue('wasClicked') !== 'undefined') {
							if((ref.localeCompare(url) === 0) && (GM.getValue('wasClicked') == 1)) {
								console.log('Wykonuje autosave');
								var pobierzLap = getLastStint();
								var sendData = manualSerialization(msr, team, staff_skills, driver_skills, null, car_parts, pobierzLap, test_pts);
								autosave(sendData);
							}
						}

					}
					

				}).fail(function(data){
					console.log('Facilities Fail');
					delAjaxLoaderGif("Nie mogę pobrać StaffAndFacilities!");
				});


			}).fail(function(data){
				console.log('Driver fail');
				delAjaxLoaderGif("Nie mogę pobrać Drivera!");
			});

		}).fail(function(data){
			console.log('Profile fail:');
			delAjaxLoaderGif("Nie mogę otworzyć Twojego profilu!");
		}); 

	}).fail(function(data){
		console.log("Menu fail!");
		delAjaxLoaderGif("Nie mogę otworzyć Twojego głównego menu!");
	});

});

/**
 * Zwraca wersje głównego manu (design)
 * @param  {[string]} data [Czysty HTML dla strony głównej]
 * @return {[int]}	[1 - nowe menu / 0 - stare menu]
 */
function whatVersion(data) {
	return parseInt(jq("#item-1", data).length);
}

function databasesave(thisdata, info) {

	delAjaxLoaderGif(null);

	jq("input[name='DriveStint']").click(function(event){
		event.preventDefault();

		// bug zwiazany z niepobieraniem priorytetu (chujowy ale fix)
		var p = getPriority();
		var prior = '&stint_priority_text=' + p.text;
			prior += '&stint_priority_nr=' + p.nr;

			GM_xmlhttpRequest({
	            method: 'POST',
	            url: savelink,
	            data: thisdata+prior,
	            headers: { 
	            	"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	            	'Accept': 'application/atom+xml,application/xml,text/xml' },
	            onload: function(data) {
	                console.log("Wynik: " + data.responseText);
	                GM.setValue('wasClicked', 1);
	                GM.setValue('raceNumber', info.race);
	                jq("#formQual").submit();             
	            } // zamyka onload
	        });
	        
	});

}

function autosave(thisdata) {

	var p = getPriority();
	var prior = '&stint_priority_text=' + p.text;
		prior += '&stint_priority_nr=' + p.nr;

	GM_xmlhttpRequest({
	            method: 'POST',
	            url: savelink,
	            data: thisdata+prior,
	            headers: { 
	            	"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	            	'Accept': 'application/atom+xml,application/xml,text/xml' },
	            onload: function(data) {
	                console.log("Autosave: " + data.responseText);
	                GM.setValue('wasClicked', 0);                
	            } // zamyka onload
	});
}

function manualsave(thisdata, info) {

	var table_pts = jq("table:eq(4)");
	var prior = '&stint_priority_text=OnlySave';
		prior += '&stint_priority_nr=255';

	var html_onlysave = "<tr><td colspan='5' class='center'>";

	checklink += '/' + info.id + '/' + info.season + '/' + info.race;

	if(typeof GM.getValue('raceNumber') === 'undefined') {

		// nie znam numeru - odpytuje serwer w zaleznosci od odpowiedzi, albo wyswietlam guzik z info, albo nie
		// ale moge znać numer, ale nie zgadza mi sie on z obecnym bo mialem niezamknieta przegladarke,
		// jeżli numery mi sie nie zgadzaja, to znów odpytuje serwer

		GM_xmlhttpRequest({
			method: 'GET',
			url: checklink,
			synchronous: false,
			onload: function(data) {
				console.log(parseInt(data.response));
				if((parseInt(data.response)) == 1) {

					GM.setValue('raceNumber', info.race);
					html_onlysave += "<button type='button' id='onlysave' disabled>Punkty zapisane!</button>";
					html_onlysave += "</td></tr>";
					table_pts.find("tr:last").after(html_onlysave);

				} else {
				
					html_onlysave += "<button type='button' id='onlysave'>Nie jadę, ale pkt zapisz!</button>";
					html_onlysave += "</td></tr>";

					table_pts.find("tr:last").after(html_onlysave);

					table_pts.on('click', 'button#onlysave', function() {

						jq("input[name='DriveStint']").next().remove();
						jq("input[name='DriveStint']").after("<img id='ajax-load' src='http://hajnrych.pl/prt/users/hajnr/testing/ajax-loader.gif'>");

						GM_xmlhttpRequest({
	        			    method: 'POST',
	        			    url: savelink,
	        			    data: thisdata+prior,
	        			    headers: { 
	        			    	"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	        			    	'Accept': 'application/atom+xml,application/xml,text/xml' },
	        			    onload: function(data) {
	        			        console.log("Manual Save: " + data.responseText);
	        			        GM.setValue('raceNumber', info.race);
	        			        delAjaxLoaderGif(null);
	        			        table_pts.find("#onlysave").prop('disabled',true).text('Punkty zapisane!');        
	        			    } // zamyka onload
						});

					});
				}
			},
			onabort: function() {
				console.log('abort');
			},
			onerror: function() {
				console.log('error');
			}
		});

	} else {

		if(GM.getValue('raceNumber') != info.race) {

			html_onlysave += "<button type='button' id='onlysave'>Nie jadę, ale pkt zapisz!</button>";
			html_onlysave += "</td></tr>";

			table_pts.find("tr:last").after(html_onlysave);

			table_pts.on('click', 'button#onlysave', function() {

				jq("input[name='DriveStint']").next().remove();
				jq("input[name='DriveStint']").after("<img id='ajax-load' src='http://hajnrych.pl/prt/users/hajnr/testing/ajax-loader.gif'>");

				GM_xmlhttpRequest({
	        	    method: 'POST',
	        	    url: savelink,
	        	    data: thisdata+prior,
	        	    headers: { 
	        	    	"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	        	    	'Accept': 'application/atom+xml,application/xml,text/xml' },
	        	    onload: function(data) {
	        	        console.log("Manual Save: " + data.responseText);
	        	        GM.setValue('raceNumber', info.race);
	        	        delAjaxLoaderGif(null);
	        	        table_pts.find("#onlysave").prop('disabled',true).text('Punkty zapisane!');             
	        	    } // zamyka onload
				});

			});

		} else {

			html_onlysave += "<button type='button' id='onlysave' disabled>Punkty zapisane!</button>";
			html_onlysave += "</td></tr>";
			table_pts.find("tr:last").after(html_onlysave);

		}
	}
}

function getManagerIdAndRaceNumber(data) {

	if(whatVersion(data) == 1) {
		var href = jq("#item-1 h1 a:eq(1)", data).attr('href');
	} else {
		var href = jq("#managerinformation a:eq(0)", data).attr('href');
	}	

	// regexp /(\d{1,3})/g
	var number = jq("#racebar h1:eq(0)", data).text();
	var temp_a = (number.indexOf('Season'))+7;
	var temp_b = number.indexOf(',');
	season = number.substring(temp_a, temp_b);

	var temp_a = (number.indexOf('Race'))+5;
	var race = number.substr(temp_a, 2);
	if(race.indexOf(':')>0) {
		race = race.substr(0,1);
	}
	if(race.length == 1) {
		race = '0' + race.toString();
	}

	var idnumber = {
		id: getIdFromLink(href),
		season: season,
		race: race 
	};

	return idnumber;

}

function getStaffID(data) {

	var driver = jq(".autowidths:last a:eq(0)", data).attr('href');
	var td = jq(".autowidths:last a:eq(1)", data).attr('href');

	driver = getIdFromLink(driver);
	if((typeof td !== 'string') || (td.indexOf("TeamId")>0)) {
		td = -1;
	} else {
		td = getIdFromLink(td);
	}

	var team = {
		driver: driver,
		td: td
	};

	return team;
}

function getIdFromLink(link) {

	var pos_temp = link.indexOf('=');
 	var len_temp = link.length;

 	return link.substring(pos_temp+1, len_temp);
}

function delAjaxLoaderGif(errmsg) {
	if(errmsg === null) {
		jq("#ajax-load").remove();
		jq("input[name='DriveStint']").after("<button type='button' id='crosajax'>GO!</button>");
	} else {
		jq("#ajax-load").remove();
		jq("input[name='DriveStint']").after("<span>Error: "+errmsg+"</span>");
	}
}



function getStaffSkills(data) {

	var body = jq(".column.left.halves.nomargin.height600", data);

	var staff = {
		ov: 		(body.find("tr:eq(0) td:eq(0)").text()).trim(),
		exp: 		(body.find("tr:eq(2) td:eq(0)").text()).trim(),
		mot: 		(body.find("tr:eq(4) td:eq(0)").text()).trim(),
		ti: 		(body.find("tr:eq(6) td:eq(0)").text()).trim(),
		stress: 	(body.find("tr:eq(9) td:eq(0)").text()).trim(),
		con: 		(body.find("tr:eq(11) td:eq(0)").text()).trim(),
		eff: 		(body.find("tr:eq(13) td:eq(0)").text()).trim(),
		windtunel: 	(body.find("tr:eq(15) td:eq(0)").text()).trim(),
		pitstop: 	(body.find("tr:eq(17) td:eq(0)").text()).trim(),
		workshop: 	(body.find("tr:eq(19) td:eq(0)").text()).trim(),
		design: 	(body.find("tr:eq(21) td:eq(0)").text()).trim(),
		engineering:(body.find("tr:eq(23) td:eq(0)").text()).trim(),
		alloy: 		(body.find("tr:eq(25) td:eq(0)").text()).trim(),
		commercial: (body.find("tr:eq(27) td:eq(0)").text()).trim()
	};

	return staff;

}

function getDriverSkills(data) {

	var body = jq("#dvSkillsTable", data);

	var driver = {
		ov:  (body.find("tr:eq(1) td:eq(0)").text()).trim(),
		con: (body.find("#Conc").text()).trim(),
		tal: (body.find("#Talent").text()).trim(),
		agg: (body.find("#Aggr").text()).trim(),
		exp: (body.find("#Experience").text()).trim(),
		ti:  (body.find("#TechI").text()).trim(),
		sta: (body.find("#Stamina").text()).trim(),
		cha: (body.find("#Charisma").text()).trim(),
		mot: (body.find("#Motivation").text()).trim(),
		rep: (body.find("tr:eq(11) td:eq(0)").text()).trim(),
		wei: (body.find("tr:eq(13) td:eq(0)").text()).trim(),
		age: (body.find("tr:eq(15) td:eq(0)").text()).trim()
	};

	return driver;

}

function getTDSkills(data) {

	var body = jq(".squashed.leftalign", data);

	var td = {
		ov: 	(body.find("tr:eq(0) td:eq(0)").text()).trim(),
		lead: 	(body.find("tr:eq(1) td:eq(0)").text()).trim(),
		mech: 	(body.find("tr:eq(2) td:eq(0)").text()).trim(),
		ele: 	(body.find("tr:eq(3) td:eq(0)").text()).trim(),
		aero: 	(body.find("tr:eq(4) td:eq(0)").text()).trim(),
		exp: 	(body.find("tr:eq(5) td:eq(0)").text()).trim(),
		pit: 	(body.find("tr:eq(6) td:eq(0)").text()).trim(),
		mot: 	(body.find("tr:eq(7) td:eq(0)").text()).trim(),
		age: 	(body.find("tr:eq(9) td:eq(0)").text()).trim(),
	};

	return td;

}

function getCurrentPoints() {

	var pts = jq("table:eq(4)");

	var points = {
		test_p: (pts.find("tr:eq(1) td:eq(0)").text()).trim(),
		test_h: (pts.find("tr:eq(1) td:eq(1)").text()).trim(),
		test_a: (pts.find("tr:eq(1) td:eq(2)").text()).trim(),

		rnd_p: (pts.find("tr:eq(2) td:eq(0)").text()).trim(),
		rnd_h: (pts.find("tr:eq(2) td:eq(1)").text()).trim(),
		rnd_a: (pts.find("tr:eq(2) td:eq(2)").text()).trim(),

		eng_p: (pts.find("tr:eq(3) td:eq(0)").text()).trim(),
		eng_h: (pts.find("tr:eq(3) td:eq(1)").text()).trim(),
		eng_a: (pts.find("tr:eq(3) td:eq(2)").text()).trim(),

		ccp_p: (pts.find("tr:eq(4) td:eq(0)").text()).trim(),
		ccp_h: (pts.find("tr:eq(4) td:eq(1)").text()).trim(),
		ccp_a: (pts.find("tr:eq(4) td:eq(2)").text()).trim()
	};

	return points;

}

function getCurrentCar() {
	
	var dudekTool = jq("#copypsfromtool").attr('href');
	var plusOne = 0;
	
	if(typeof dudekTool === 'string') {
		plusOne = 1;
	}

	var body = jq("table:last");

	var car = {
		fwing_lvl: 	(body.find("tr:eq("+(2+plusOne)+") td:eq(1)").text()).trim(),
		fwing_wear: (body.find("tr:eq("+(2+plusOne)+") td:eq(2)").text()).trim(),

		rwing_lvl: 	(body.find("tr:eq("+(3+plusOne)+") td:eq(1)").text()).trim(),
		rwing_wear: (body.find("tr:eq("+(3+plusOne)+") td:eq(2)").text()).trim(),

		eng_lvl: 	(body.find("tr:eq("+(4+plusOne)+") td:eq(1)").text()).trim(),
		eng_wear: 	(body.find("tr:eq("+(4+plusOne)+") td:eq(2)").text()).trim(),

		bra_lvl: 	(body.find("tr:eq("+(5+plusOne)+") td:eq(1)").text()).trim(),
		bra_wear: 	(body.find("tr:eq("+(5+plusOne)+") td:eq(2)").text()).trim(),

		gear_lvl: 	(body.find("tr:eq("+(6+plusOne)+") td:eq(1)").text()).trim(),
		gear_wear: 	(body.find("tr:eq("+(6+plusOne)+") td:eq(2)").text()).trim(),

		susp_lvl: 	(body.find("tr:eq("+(7+plusOne)+") td:eq(1)").text()).trim(),
		susp_wear: 	(body.find("tr:eq("+(7+plusOne)+") td:eq(2)").text()).trim(),

		cha_lvl: 	(body.find("tr:eq("+(2+plusOne)+") td:eq(5)").text()).trim(),
		cha_wear: 	(body.find("tr:eq("+(2+plusOne)+") td:eq(6)").text()).trim(),

		under_lvl: 	(body.find("tr:eq("+(3+plusOne)+") td:eq(5)").text()).trim(),
		under_wear: (body.find("tr:eq("+(3+plusOne)+") td:eq(6)").text()).trim(),

		sid_lvl: 	(body.find("tr:eq("+(4+plusOne)+") td:eq(5)").text()).trim(),
		sid_wear: 	(body.find("tr:eq("+(4+plusOne)+") td:eq(6)").text()).trim(),

		cool_lvl: 	(body.find("tr:eq("+(5+plusOne)+") td:eq(5)").text()).trim(),
		cool_wear: 	(body.find("tr:eq("+(5+plusOne)+") td:eq(6)").text()).trim(),

		ele_lvl: 	(body.find("tr:eq("+(6+plusOne)+") td:eq(5)").text()).trim(),
		ele_wear: 	(body.find("tr:eq("+(6+plusOne)+") td:eq(6)").text()).trim()

	};

	//console.log(car);
	
	return car;
}

function getPriority() {

	var nr = jq("#slResearchPriority").val();
	var text = jq("#slResearchPriority option[value='"+nr+"']").text();

	var priority = {
		nr: nr,
		text: text
	};

	return priority;
}

function getLastStint() {

	var body = jq("table:eq(5) tr:last");

	var stint = {
		lap: 		(body.find('td:eq(0)').text()).trim(),
		laps_done: 	(body.find('td:eq(1)').text()).trim(),
		best: 		(body.find('td:eq(2)').text()).trim(),
		mean: 		(body.find('td:eq(3)').text()).trim(),
		set_fwing: 	(body.find('td:eq(4)').text()).trim(),
		set_rwing: 	(body.find('td:eq(5)').text()).trim(),
		set_eng: 	(body.find('td:eq(6)').text()).trim(),
		set_bra: 	(body.find('td:eq(7)').text()).trim(),
		set_gear: 	(body.find('td:eq(8)').text()).trim(),
		set_susp: 	(body.find('td:eq(9)').text()).trim(),
		tyres:  	(body.find('td:eq(10)').text()).trim(),
		fuel: 		(body.find('td:eq(11)').text()).trim(),
		tyres_cond: (body.find('td:eq(12)').text()).trim(),
		fuel_left:  (body.find('td:eq(13)').text()).trim()
	};

	return stint;

}

function manualSerialization(msr, dt, staff, driver, td, car, stint, pts) {

	// dorzucić kilka ifów sprawdzajacych dane

	var str =  'gpro_id=' + msr.id;
		str += '&season_nr=' + msr.season;
		str += '&race_nr=' + msr.race;
		str += '&driver_id=' + dt.driver;
		str += '&driver_ov=' + driver.ov;
		str += '&driver_con=' + driver.con;
		str += '&driver_tal=' + driver.tal;
		str += '&driver_agg=' + driver.agg;
		str += '&driver_exp=' + driver.exp;
		str += '&driver_ti=' + driver.ti;
		str += '&driver_sta=' + driver.sta;
		str += '&driver_cha=' + driver.cha;
		str += '&driver_mot=' + driver.mot;
		str += '&driver_rep=' + driver.rep;
		str += '&driver_wei=' + driver.wei;
		str += '&driver_age=' + driver.age;
		if((dt.td != -1) && (td.ov !== null)) {
			str += '&td_id=' + dt.td;
			str += '&td_ov=' + td.ov;
			str += '&td_lead=' + td.lead;
			str += '&td_mech=' + td.mech;
			str += '&td_ele=' + td.ele;
			str += '&td_aero=' + td.aero;
			str += '&td_exp=' + td.exp;
			str += '&td_pit=' + td.pit;
			str += '&td_mot=' + td.mot;
			str += '&td_age=' + td.age;
		}
		str += '&staff_ov=' + staff.ov;
		str += '&staff_exp=' + staff.exp;
		str += '&staff_mot=' + staff.mot;
		str += '&staff_ti=' + staff.ti;
		str += '&staff_stress=' + staff.stress;
		str += '&staff_con=' + staff.con;
		str += '&staff_eff=' + staff.eff;
		str += '&staff_windtunel=' + staff.windtunel;
		str += '&staff_pitstop=' + staff.pitstop;
		str += '&staff_workshop=' + staff.workshop;
		str += '&staff_design=' + staff.design;
		str += '&staff_engineering=' + staff.engineering;
		str += '&staff_alloy=' + staff.alloy;
		str += '&staff_commercial=' + staff.commercial;
		str += '&car_fwing_lvl=' + car.fwing_lvl;
		str += '&car_fwing_wear=' + car.fwing_wear;
		str += '&car_rwing_lvl=' + car.rwing_lvl;
		str += '&car_rwing_wear=' + car.rwing_wear;
		str += '&car_eng_lvl=' + car.eng_lvl;
		str += '&car_eng_wear=' + car.eng_wear;
		str += '&car_bra_lvl=' + car.bra_lvl;
		str += '&car_bra_wear=' + car.bra_wear;
		str += '&car_gear_lvl=' + car.gear_lvl;
		str += '&car_gear_wear=' + car.gear_wear;
		str += '&car_susp_lvl=' + car.susp_lvl;
		str += '&car_susp_wear=' + car.susp_wear;
		str += '&car_cha_lvl=' + car.cha_lvl;
		str += '&car_cha_wear=' + car.cha_wear;
		str += '&car_under_lvl=' + car.under_lvl;
		str += '&car_under_wear=' + car.under_wear;
		str += '&car_sid_lvl=' + car.sid_lvl;
		str += '&car_sid_wear=' + car.sid_wear;
		str += '&car_cool_lvl=' + car.cool_lvl;
		str += '&car_cool_wear=' + car.cool_wear;
		str += '&car_ele_lvl=' + car.ele_lvl;
		str += '&car_ele_wear=' + car.ele_wear;
		if(stint !== null) {
			str += '&lap_nr=' + stint.lap;
			str += '&laps_done=' + stint.laps_done;
			str += '&best=' + stint.best;
			str += '&mean=' + stint.mean;
			str += '&set_fwing=' + stint.set_fwing;
			str += '&set_rwing=' + stint.set_rwing;
			str += '&set_eng=' + stint.set_eng;
			str += '&set_bra=' + stint.set_bra;
			str += '&set_gear=' + stint.set_gear;
			str += '&set_susp=' + stint.set_susp;
			str += '&tyres=' + stint.tyres;
			str += '&fuel=' + stint.fuel;
			str += '&tyres_cond=' + stint.tyres_cond;
			str += '&fuel_left=' + stint.fuel_left;
		}
		str += '&test_p=' + pts.test_p;
		str += '&test_h=' + pts.test_h;
		str += '&test_a=' + pts.test_a;
		str += '&rnd_p=' + pts.rnd_p;
		str += '&rnd_h=' + pts.rnd_h;
		str += '&rnd_a=' + pts.rnd_a;
		str += '&eng_p=' + pts.eng_p;
		str += '&eng_h=' + pts.eng_h;
		str += '&eng_a=' + pts.eng_a;
		str += '&ccp_p=' + pts.ccp_p;
		str += '&ccp_h=' + pts.ccp_h;
		str += '&ccp_a=' + pts.ccp_a;

	console.log(str);

	return str;

}
