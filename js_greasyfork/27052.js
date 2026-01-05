// ==UserScript==
// @name 			QEnergy
// @namespace		http://hajnrych.pl/
// @description		Collecting energy data from Quali
// @author          Marek 'hajnr' Hajnrych
// @include			*gpro.net/*/Qualify.asp*
// @include			*gpro.net/*/Qualify2.asp*
// @require 		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version			0.1.51
// @grant 			GM_setValue
// @grant 			GM_getValue
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/27052/QEnergy.user.js
// @updateURL https://update.greasyfork.org/scripts/27052/QEnergy.meta.js
// ==/UserScript==

var jq = jQuery.noConflict();
var protocol = location.protocol;
var hostname = location.hostname;

var ref = document.referrer;
var currenturl = document.URL;
var currentpath = (location.pathname).substr(4);

var mainurl = protocol + '//' + hostname + '/gb/gpro.asp';
var profile = protocol + '//' + hostname + '/gb/ManagerProfile.asp?IDM=';
var driverprofile = protocol + '//' + hostname + '/gb/DriverProfile.asp?ID=';
var savelink = 'http://thewhocrew.pl/prt/quali/save';
var ajaxdata = {
	risk: 0,
	driver: '',
	user_id: 0,
	season_nr: 0,
	race_nr: 0
};

jq(document).ready(function(){

	if(currentpath.localeCompare('Qualify.asp') === 0) {

		// czy guzik driver zostal likniety, jesli tak to pobierz info o energy i zrob save
		// jesli nie to sprawdz czy zaznaczone ze chcemy pojechac Q1, w przypadku zmiany
		// pobierz dane o energy i dopiero zezwol na wykonanie Q.
		if(typeof GM_getValue('qDone') !== 'undefined') {
			if((GM_getValue('qDone') == 1) && (ref.localeCompare(currenturl) === 0)) {
				getEnergyData();
			}
		} else {
			console.log(typeof GM_getValue('qDone'));
		}
		
		/*if(typeof GM_getValue('qDone') !== 'undefined') {
			if((ref.localeCompare(currenturl) == 0) && (GM_getValue('qDone') == 1)) {
				console.log('Autosave!');
				getEnergyData();
				GM_setValue('qDone', 0);
				autosave(manualserialize(ajaxdata));
			}
		} else { */
			jq("input[name='TypeLap']").change(function(){
				if(jq('#radioQual').prop('checked')) {
					ajaxdata.risk = getRisk();
					getEnergyData();
				}
	
				jq("select[name='Risk']").change(function(){
					ajaxdata.risk = getRisk();
					//console.log(manualserialize(ajaxdata));
				});
			});
		//}

	} else if(currentpath.localeCompare('Qualify2.asp') === 0) {

		// testowanie apki na Q2 zeby nie robic za duzo 
		//getEnergyData();
		if((GM_getValue('qDone') == 1) && (ref.localeCompare(currenturl) === 0)) {
			getEnergyData();
		}
		jq("select[name='Risk']").change(function(){
			ajaxdata.risk = getRisk();
			//console.log(manualserialize(ajaxdata));
		});
		getEnergyData();

	} else {
		console.log('Error: incorrect pathname!');
	}

});

function getEnergyData() {

	jq("input[name='DriveLap']").after("<img id='ajax-load' src='http://hajnrych.pl/prt/users/hajnr/testing/ajax-loader.gif'>");
    jq("input[name='DriveLap']").attr('onclick', null);
    jq("input[name='DriveLap']").prop('disabled', true);

	jq.get(mainurl).done(function(data){
		var msr = getManagerIdAndRaceNumber(data);
		profile += (msr.id).toString();
		ajaxdata.user_id = msr.id;
		ajaxdata.season_nr = msr.season;
		ajaxdata.race_nr = msr.race;
		ajaxdata.risk = getRisk();

		jq.get(profile).done(function(data){
			var team = getStaffID(data);
			driverprofile += (team.driver).toString();

			jq.get(driverprofile).done(function(data){
				var driver_skills = getDriverSkills(data);
				ajaxdata.driver = driver_skills;
				//console.log(manualserialize(ajaxdata));
				if(typeof GM_getValue('qDone') !== 'undefined') {
					if((GM_getValue('qDone') == 1) && (ref.localeCompare(currenturl) === 0)) {
						autosave(manualserialize(ajaxdata), false);
						//GM_setValue('qDone', 0);
					}
				}
				delAjaxLoaderGif(null);
				jq("input[name='DriveLap']").prop('disabled', false)
											.click(function(event){
												event.preventDefault();
												autosave(manualserialize(ajaxdata), true);
												//GM_setValue('qDone', 1);
											});
			});
		});
	});
}

function getManagerIdAndRaceNumber(data) {
	var href;

	if(whatVersion(data) == 1) {
		href = jq("#item-1 h1 a:eq(1)", data).attr('href');
	} else {
		href = jq("#managerinformation a:eq(0)", data).attr('href');
	}	

	// regexp /(\d{1,3})/g
	var number = jq("#racebar h1:eq(0)", data).text();
	var temp_a = (number.indexOf('Season'))+7;
	var temp_b = number.indexOf(',');
	season = number.substring(temp_a, temp_b);

	temp_a = (number.indexOf('Race'))+5;
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

function whatVersion(data) {
	return parseInt(jq("#item-1", data).length);
}

function getIdFromLink(link) {
	var pos_temp = link.indexOf('=');
 	var len_temp = link.length;

 	return link.substring(pos_temp+1, len_temp);
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

function getDriverSkills(data) {

	var body = jq("#dvSkillsTable", data);
	var energy = (body.find("tr:eq(0) td:eq(0) div:eq(2)").text()).trim();
	energy = energy.substr(0, (energy.indexOf('%')));

	var driver = {
		eng: energy,
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

function getRisk() {
	return jq("select[name='Risk']").val();
}

function delAjaxLoaderGif(errmsg) {
	if(errmsg === null) {
		jq("#ajax-load").remove();
		jq("input[name='DriveLap']").after("<button type='button' id='crosajax'>GO!</button>");
	} else {
		jq("#ajax-load").remove();
		jq("input[name='DriveLap']").after("<span>Error: "+errmsg+"</span>");
	}
}

function manualserialize(data) {

	var str = 'user_id=' + data.user_id;
	str += '&season_nr=' + data.season_nr;
	str += '&race_nr=' + data.race_nr;
	str += '&risk=' + data.risk;
	str += '&driver_eng=' + data.driver.eng;
	str += '&driver_ov=' + data.driver.ov;
	str += '&driver_con=' + data.driver.con;
	str += '&driver_tal=' + data.driver.tal;
	str += '&driver_agg=' + data.driver.agg;
	str += '&driver_exp=' + data.driver.exp;
	str += '&driver_ti=' + data.driver.ti;
	str += '&driver_sta=' + data.driver.sta;
	str += '&driver_cha=' + data.driver.cha;
	str += '&driver_mot=' + data.driver.mot;
	str += '&driver_rep=' + data.driver.rep;
	str += '&driver_wei=' + data.driver.wei;
	str += '&driver_age=' + data.driver.age;

	return str;
}

function autosave(serializedata, btnClicked = flase) {

	console.log(serializedata);

	GM_xmlhttpRequest({
		method: 'POST',
		url: savelink,
		data: serializedata,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	        "Accept": "application/atom+xml,application/xml,text/xml"
		},
		onload: function(data) {
			if(btnClicked) {
				GM_setValue('qDone', 1);
				console.log('Clicked: ' + data.responseText);
				jq("form[name='formQual']").submit();
			} else {
				GM_setValue('qDone', 0);
				console.log('Autosave:' + data.responseText);
			}		
		}
	});

}
