// ==UserScript==
// @name                MMR Russia WME Requests
// @namespace           https://greasyfork.org/ru/scripts/5085-mmr-wme-requests
// @description         Opens the Requests module with precompiled fields to submit an request
// @include             https://*.waze.com/editor*
// @include             https://*.waze.com/*/editor*
// @include             https://*.waze.com/map-editor*
// @include             https://*.waze.com/beta_editor*
// @include             http://fias.nalog.ru/*
// @grant               none
// @author              skirda alexletov
// @version             2.13.2.1f
// @downloadURL https://update.greasyfork.org/scripts/38044/MMR%20Russia%20WME%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/38044/MMR%20Russia%20WME%20Requests.meta.js
// ==/UserScript==

var mmrwmer_Version = '2.13.2.1';

if (location.hostname === "fias.nalog.ru")
{
	if (window.location.search && window.location.search[0]==='?')
	{
		setTimeout(function(){
			var s=unescape(decodeURI(window.location.search.substr(1)));
			$("#MainForm").find(".rcbInput").val(s).change();
			$("#MainForm").find(".rcbArrowCell").find("A")[0].click();
		},1000);
	}
	return;
}


var CL=new Array(
	{
		c:'Russia',
		cc:'ru',
		al:'ru_RU',

		// Запрос на добавление населенного пункта
		f:'https://docs.google.com/forms/d/1ck0cCIV6vPy16YQZJvfmM0clOdAE2Z-kDsXn06ZwQ1s/viewform',      // форма
		d:'https://docs.google.com/spreadsheets/d/1ddcW8EmNjojJp7EQ4AYPdfBqNWe28WqRaQ_RtkB8JAU',        // таблица
		l:'https://script.google.com/macros/s/AKfycbzqA15-fy4g4StdRUmnuMj9z6rJ56gQPjCYpgCMni7h/exec',   // Level5
		// WME Request (ответы)
		fr:'https://docs.google.com/forms/d/e/1FAIpQLSfU4pyWTchXq2-vRBtVIasJ9MKzmaieksiXG_-TLZgJB79vRg/viewform',     // форма
		dr:'https://docs.google.com/spreadsheets/d/1zhERSjusXXsXYGwuJaTEVgL_lMg2_ey-7gA_R4iPn1g',   // таблица

		cs:'https://script.google.com/macros/s/AKfycbzqA15-fy4g4StdRUmnuMj9z6rJ56gQPjCYpgCMni7h/exec', // change state

		ttst:'Marussia',
		ttsd:'', // TTS таблица               RU
		ttsf:'' // TTS форма  RU
	}
);

//var wner_TTS_d="https://docs.google.com/spreadsheets/d/16rSWBWfRi5gXhywAlTGu6O3c3kH0B49ksp56hdh-xlI";
//var wner_TTS_f="https://docs.google.com/forms/d/e/1FAIpQLSfUdwm1Jlv5h_tauxcWZRDnFSOv2QR8vzi2XcjWPe-TKnxzMQ/viewform";

// через солько дней вернуть лок обратно
var mmrwmer_CountDays = 5;
var mmrwmer_UserCache = new Array();
var mmrwmer_LanguageRU = false;
var mmrwmer_Debug = false;
var mmrwmer_MousePos = '';
var mmrwmer_MapCenter = false;
var MMRmmrwmerequestEmail='';
var MMRmmrwmerequestCountry=0;


/* helper function */
function getElementsByClassName(classname, node)
{
	if(!node)
		node = document.getElementsByTagName("body")[0];
	var a = [];
	var re = new RegExp('\\b' + classname + '\\b');
	var els = node.getElementsByTagName("*");
	for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	return a;
}


function mmrwmer_getUsername()
{
	var thisUser = Waze.loginManager.user;
	if (thisUser === null)
	{
		alert(mmrwmer_LanguageRU?'Невозможно получить имя текущего пользователя':'Nobody\'s logged in.');
		return "";
	}
	return Waze.loginManager.user.userName;
}

function timeConverter(UNIX_timestamp)
{
	var datetime = new Date();
	var mEpoch = parseInt(UNIX_timestamp);
	if (mEpoch<10000000000) mEpoch *= 1000;
	datetime.setTime(mEpoch);
	// !!! UTC !!!
	return datetime.getUTCFullYear()+"-"+('0' + (datetime.getUTCMonth() + 1)).slice(-2)+"-"+('0' + datetime.getUTCDate()).slice(-2)+"+"+('0' + datetime.getUTCHours()).slice(-2) + ':' + ('0' + datetime.getUTCMinutes()).slice(-2);

}

function mmrwmer_getCCSD(segment) // BUBBUB!!! need use "hasOwnProperty" or "in"
{
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'start mmrwmer_getCCSD');

	var oID="";
	var streetName="";
	var cityName="";
	var countryName="";
	var countryID="";
	var description="";
	var typeName= "";
	var stateID="";
	var stateName="";
	var cityID="";
	var userID="";
	var forumUserID="";
	var userName="";
	var updatedOn="";
	var poiaddress="";

	try {
		typeName=segment.type;
		/*
		"segment"
		"venue"
		"node"
		"camera" typeName: "Speed camera"
		"bigJunction"
		*/
		oID=segment.attributes.id;
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': oID=' + oID);

		if(segment.attributes.hasOwnProperty('updatedOn'))
			updatedOn=segment.attributes.updatedOn;
		else
			updatedOn=segment.attributes.createdOn;

		if (segment.attributes.hasOwnProperty('primaryStreetID'))
		{
//Waze.model.streets.get(Waze.selectionManager.selectedItems[0].model.attributes.primaryStreetID).cityID
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'found street');
			var sID=segment.attributes.primaryStreetID;
			if (sID)
			{
				var streetsObj = Waze.model.streets.get(sID);
				if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'typeof streetsObj='+(typeof streetsObj));
				if (typeof streetsObj !== "undefined")
				{
					cityID=streetsObj.cityID;
					streetName=streetsObj.name;
				}
			}
		}
		else if (typeName === "camera")
		{
//Waze.selectionManager.selectedItems[0].model.model.cities.additionalInfo[0].id
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'found camera');
			streetName=segment.typeName;
			description= "\n  "+(mmrwmer_LanguageRU?'Скорость':'Speed')+": "+segment.attributes.speed
						+"\n  "+(mmrwmer_LanguageRU?'Подтверждено':'Approved')+": "+segment.attributes.validated
						+"\n  "+(mmrwmer_LanguageRU?'Тип':'Type')+": "+I18n.translations[mmrwmer_LanguageRU?"ru":window.I18n.currentLocale()].edit.camera.fields.type[segment.attributes.type];
					//  +"\n  "+(mmrwmer_LanguageRU?'Азимут':'Azymuth')+": "+segment.attributes.azymuth
			//if(segment.attributes.hasOwnProperty('updatedOn'))
				cityID=segment.model.cities.additionalInfo[0].id;
			if (cityID == null)
				cityID="";
		}
		else if (typeName === "node")
		{
//Waze.selectionManager.selectedItems[0].model.segments.topCityID
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'found node');
			cityID=''+segment.model.segments.topCityID;

			if (cityID == null)
				cityID="";
			description="\n  count segment(s)="+segment.attributes.segIDs.length;
		}
		else if(typeName === "bigJunction")
		{
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'found bigJunction');
			cityID=''+segment.model.segments.topCityID;
			if (cityID == null)
				cityID="";
			description="\n  count segment(s)="+segment.attributes.segIDs.length;
		}
		else // "venue"
		{
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'found POI ('+typeName+')');
//Waze.model.streets.get(Waze.selectionManager.selectedItems[0].attributes.streetID).cityID
			var sID=segment.attributes.streetID;
			if (sID == null)
				cityID="";
			else
				cityID=Waze.model.streets.get(sID).cityID;

			if (sID == null)
				cityID="";

			if (cityID !== "")
			{
				var cityObj=Waze.model.cities.get(cityID);
				if (typeof cityObj !== "undefined")
				{
					countryID=cityObj.getAttributes().countryID;
					stateID=cityObj.getAttributes().stateID;
					cityName=cityObj.getAttributes().name;

					var stateObj=Waze.model.states.get(stateID);
					if (typeof stateObj !== "undefined")
						stateName=stateObj.getAttributes().name;

					var countriesObj=Waze.model.countries.get(countryID);
					if(mmrwmer_Debug) console.log(countriesObj);
					if (typeof countriesObj !== "undefined")
						countryName = countriesObj.name;
				}
			}

			if (typeof Waze.selectionManager.selectedItems[0].model.attributes.categories === "undefined")
			{
				if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'categories=undefined');
				if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'segment.attributes.description='+segment.attributes.description);

			}
			else
			{
				var vcats=segment.attributes.categories;
				var arrvcats=[];
				for(var i=0; i < vcats.length; ++i)
				{
					//if(mmrwmer_Debug) console.log("segment.attributes.categories["+i+"]='"+segment.attributes.categories[i]+"'")
					arrvcats.push(window.I18n.translations[mmrwmer_LanguageRU?"ru":window.I18n.currentLocale()].venues.categories[vcats[i]]);
					//if(mmrwmer_Debug) console.log("segment.attributes.categories["+i+"]='"+segment.attributes.categories[i]+"'")
				}
				description='\n  '+(mmrwmer_LanguageRU?'Категории':'Categories')+': '+(arrvcats.length > 0?arrvcats.join(';')+'.':'')+'\n  ' + segment.attributes.description;
				//if(mmrwmer_Debug) console.log(description)
				arrvcats=[];


				if (segment.attributes.categories.indexOf("GAS_STATION") != -1) // Gas Station
				{
					typeName="gas_station";
					description="\n  "+(mmrwmer_LanguageRU?'Брэнд':'Brand')+": "+segment.attributes.brand
							+ "\n  "+(mmrwmer_LanguageRU?'Адрес':'Address')+": " + segment.attributes.address
							+ "\n  "+(mmrwmer_LanguageRU?'Описание':'Description')+": " + segment.attributes.description;
				}
			}

			if(segment.attributes.hasOwnProperty('streetID'))
			{
				var name=Waze.model.streets.get(segment.attributes.streetID).name;
				poiaddress+=name?name:"";
			}
			if(segment.attributes.hasOwnProperty('houseNumber'))
			{
				if(poiaddress.length > 0)
					poiaddress+= " ";
				poiaddress+=segment.attributes.houseNumber;
			}
			streetName=segment.attributes.name;
		}

		if (!(/*typeName === "camera" || */typeName === "node" || cityID === "")) // BUGBUG!!!
		{
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': cityID=' + cityID);
			var cityObj=Waze.model.cities.get(cityID);
			if (typeof cityObj !== "undefined")
			{
				countryID=cityObj.getAttributes().countryID;
				stateID=cityObj.getAttributes().stateID;
				cityName=cityObj.getAttributes().name;

				var stateObj=Waze.model.states.get(stateID);
				if (typeof stateObj !== "undefined")
					stateName=stateObj.getAttributes().name;

				var countriesObj=Waze.model.countries.get(countryID);
				if(mmrwmer_Debug) console.log(countriesObj);
				if (typeof countriesObj !== "undefined")
					countryName = countriesObj.name;
			}
		}

		if (!(typeName === "node"))
		{
			userID=segment.attributes.updatedBy;
			if (userID === null)
				userID=segment.attributes.createdBy;

			if (userID==-1 || userID === null)
			{
				userID=segment.attributes.createdBy;
				if (userID==-1)
				{
					if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Do not PM Admin!');
				}
			}

			userName=Waze.model.users.get(userID).userName;
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'userName='+userName);
		}
		else
			userID="-1";

		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'userID=' +userID);

	}
	catch (err) {
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': error['+err.columnNumber+','+err.lineNumber+']: ' +err.name);
	}

	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'return from mmrwmer_getCCSD');
	return {
		objid       : oID,
		type        : typeName,
		street      : streetName,
		city        : cityName,
		cityID      : cityID,
		stateID     : stateID,
		stateName   : stateName,
		country     : countryName,
		description : description,
	    username    : userName,
		userID      : userID,
		forumuserID : forumUserID,
		updatedOn   : updatedOn,
		poiaddress  : poiaddress
	};
}


function mmrwmer_userRank(segment)
{
	var usrRank = 0;
    /*
	if (segment.attributes.lockRank)
	{
		var updatedBy = Waze.model.users.get(segment.attributes.updatedBy);
		return updatedBy != null ? updatedBy.rank : 0;
	}
	return 0;
    */
    if (Waze.selectionManager.selectedItems[0].model.attributes.hasOwnProperty('lockRank'))
    	return segment.attributes.lockRank;
	else
		return 0;
}

//It returns the maximum lock level
function mmrwmer_GetLevel() {
	//attributes.rank dovrebbe essere il road rank
	var sel = Waze.selectionManager.selectedItems;
	var maxR = mmrwmer_userRank(sel[0].model);

	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_GetLevel() maxR='+maxR);
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_GetLevel() sel.length='+sel.length);

	for (i = 1; i < sel.length; i++)
	{
		if (maxR == 5)
		{
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_GetLevel() return 6');
			return 6;
		}
		var usrRank = mmrwmer_userRank(sel[i].model);
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_GetLevel() usrRank='+usrRank);
		if (usrRank > maxR) {
			maxR = usrRank;
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_GetLevel() '+maxR);
		}
	}
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_GetLevel() return [maxR + 1] = '+(maxR + 1));
	return maxR + 1;
}

// получить данные имени НП у OSM
function mmrwmer_GetCityFromOSM(ll,zoom,country)
{
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_GetCityFromOSM([lat='+ll.lat+',lon='+ll.lon+'],'+zoom+',"'+country+'")');
	var cityName='';
	var country_code='';
	var address_json='';

	if (country === '')
	{
		if (MMRmmrwmerequestCountry >= 0 && MMRmmrwmerequestCountry < CL.length)
			country=CL[MMRmmrwmerequestCountry].c;
    }
    zoom += 7;
    var url = 'https://nominatim.openstreetmap.org/reverse';
    var data = {
        "lat": ll.lat,
        "lon": ll.lon,
        "zoom": zoom,
		"format": "json",
		"addressdetails": 1,
        "countrycodes": (MMRmmrwmerequestCountry >= 0 && MMRmmrwmerequestCountry < CL.length?CL[MMRmmrwmerequestCountry].cc:"ru"),
        "accept-language": (MMRmmrwmerequestCountry >= 0 && MMRmmrwmerequestCountry < CL.length?CL[MMRmmrwmerequestCountry].al:"ru_RU")
        // https://www.fincher.org/Utilities/CountryLanguageList.shtml
	};

    $.ajax({
		dataType: "json",
		cache: false,
		url: url,
		async: false,
		data: data,
		error: function() {
		},
		success: function(json) {
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_GetCityFromOSM(): json='+json);
            if (json.display_name !== undefined) {
                var li = '';
				if(mmrwmer_Debug) console.dir(json);
				// json.address.country_code
				// json.address.state
				// json.address.region
				// json.address.city_district
				// json.address.suburb
				if (json.address.country_code !== undefined) {
					country_code=json.address.country_code;
				}
				address_json=json.address;

				if (json.address.city !== undefined) {
					li = json.address.city;
				}
				else if (json.address.town !== undefined) {
					li = json.address.town;
				}
				else if (json.address.village !== undefined) {
					li = json.address.village;
				}
				else if (json.address.hamlet !== undefined) {
					li = json.address.hamlet;
				}

				if (mmrwmer_AddCounty && li.length > 0 && json.address.county !== undefined) {
//console.log("country=",country)
					if (country==='Russia')
					{
						li += " (" + json.address.county.replace("район","").replace("область","").replace("городской округ","");
	                	//if (json.address.state !== undefined) {li += " / " + json.address.state; }
						//li += ")";
						li=li.trim();
					}
					else if (country==='Lithuania')
					{
						if(mmrwmer_Debug) console.dir(json.address);
						// {village: "Sujainiai", county: "Paliepių seniūnija", state_district: "Raseinių rajono savivaldybė", state: "Kauno apskritis", country: "Lietuva", country_code: "lt"}
						li += ", " + json.address.county.replace("seniūnija","sen.").replace("rajono","r.").replace("savivaldybė","sav.").replace("apskritis","aps.");
						//Sujainiai, Paliepių seniūnija, Raseinių rajono savivaldybė, Kauno apskritis, Lietuva
	                	//if (json.address.state !== undefined) {li += " / " + json.address.state; }
						//li += ")";
						li=li.trim();
					}
					else
					{
						li += " (" + json.address.county.replace("район","р-н").replace("область","обл.").replace("городской округ","р-н");
	                	//if (json.address.state !== undefined) {li += " / " + json.address.state; }
						li += ")";
					}
				}

				if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_GetCityFromOSM(): li='+li);

                //$('#topbar-container .topbar .location-info-region .alt-location-info').html(alispan);
                cityName=li;
            }
		}
	});

	return {cityName:cityName,country_code:country_code,address_json:address_json};
}


function PtInPoly(x, y, components)
{
	npol = components.length;
	jj = npol - 1;
	var c = 0;
	for (var ii = 0; ii < npol;ii++)
	{
		if ((((components[ii].y<=y) && (y<components[jj].y)) || ((components[jj].y<=y) && (y<components[ii].y))) &&
			(x > (components[jj].x - components[ii].x) * (y - components[ii].y) / (components[jj].y - components[ii].y) + components[ii].x))
		{
			c = !c;
		}
		jj = ii;
	}
	return c;
}

function checkPosKG(ll)
{
	var p=[{x:33.545723,y:46.0000621},{x:33.5925865,y:46.0695387},{x:33.5961914,y:46.0775176},{x:33.5941315,y:46.0858525},{x:33.5924149,y:46.0875788},{x:33.5927582,y:46.1139437},{x:33.6037445,y:46.1303633},{x:33.610611,y:46.1339321},{x:33.6373901,y:46.1405933},{x:33.6178207,y:46.2135757},{x:33.6160183,y:46.2131599},{x:33.61413,y:46.2123878},{x:33.6128426,y:46.212863},{x:33.6133575,y:46.2138132},{x:33.6139584,y:46.2144666},{x:33.6172199,y:46.2153574},{x:33.6143875,y:46.2264623},{x:33.6461449,y:46.2293718},{x:33.6508656,y:46.2264623},{x:33.6551571,y:46.2247403},{x:33.6583328,y:46.2227807},{x:33.6642551,y:46.2217118},{x:33.674469,y:46.2151199},{x:33.6811638,y:46.2092993},{x:33.6857128,y:46.2060323},{x:33.6888027,y:46.2044879},{x:33.696785,y:46.2034186},{x:33.7084579,y:46.1999731},{x:33.7359238,y:46.1859512},{x:33.738842,y:46.1851788},{x:33.7409878,y:46.1850005},{x:33.7502575,y:46.188031},{x:33.7567806,y:46.191299},{x:33.7744617,y:46.1988444},{x:33.7851048,y:46.2014583},{x:33.7966919,y:46.2030028},{x:33.8113689,y:46.2035968},{x:33.8264751,y:46.2034186},{x:33.8388348,y:46.2018147},{x:33.8487053,y:46.1994979},{x:33.8618374,y:46.1941509},{x:33.9044952,y:46.1658034},{x:33.9177132,y:46.1585507},{x:33.9377975,y:46.150762},{x:33.961916,y:46.14321},{x:33.9851761,y:46.1343485},{x:34.0131569,y:46.1185845},{x:34.0213966,y:46.1143602},{x:34.0280914,y:46.1117422},{x:34.0356445,y:46.1101951},{x:34.0439701,y:46.109124},{x:34.0525532,y:46.1090645},{x:34.0565872,y:46.1099571},{x:34.0653419,y:46.1148362},{x:34.0695477,y:46.1162047},{x:34.0741825,y:46.1173946},{x:34.0812206,y:46.1172161},{x:34.091177,y:46.1156097},{x:34.1224194,y:46.1054941},{x:34.1291142,y:46.1015663},{x:34.1351223,y:46.0971621},{x:34.1409588,y:46.0913886},{x:34.1450787,y:46.0861502},{x:34.1502285,y:46.082102},{x:34.15658,y:46.078887},{x:34.1721153,y:46.0728734},{x:34.1776943,y:46.0693601},{x:34.1830158,y:46.0670377},{x:34.1866207,y:46.0660849},{x:34.1976929,y:46.0651916},{x:34.2121124,y:46.0627499},{x:34.2249012,y:46.0583426},{x:34.2339134,y:46.0557219},{x:34.247303,y:46.0530415},{x:34.2535686,y:46.0529224},{x:34.2642975,y:46.0543519},{x:34.2909908,y:46.0592956},{x:34.306097,y:46.0612014},{x:34.3175125,y:46.0614992},{x:34.3246365,y:46.061261},{x:34.3295288,y:46.0604272},{x:34.3405151,y:46.0576279},{x:34.3625736,y:46.0482165},{x:34.3809414,y:46.0369564},{x:34.39785,y:46.0214626},{x:34.4082355,y:46.0037586},{x:34.4124413,y:45.9900445},{x:34.4163036,y:45.9852736},{x:34.4254017,y:45.9760885},{x:34.4411945,y:45.9627255},{x:34.4570732,y:45.9520448},{x:34.4660854,y:45.9473303},{x:34.4773293,y:45.9433913},{x:34.4841957,y:45.942317},{x:34.4909763,y:45.9421976},{x:34.4974136,y:45.9429138},{x:34.5029068,y:45.94363},{x:34.5100307,y:45.9470319},{x:34.5228195,y:45.9550285},{x:34.5481396,y:45.9793691},{x:34.5511436,y:45.9867049},{x:34.5532036,y:45.9893289},{x:34.5601559,y:45.9929665},{x:34.5669365,y:45.9948747},{x:34.5747471,y:45.9955902},{x:34.5835018,y:45.9957691},{x:34.5995522,y:45.9945169},{x:34.6073627,y:45.9929069},{x:34.6297646,y:45.9859297},{x:34.6582603,y:45.97412},{x:34.6691608,y:45.968095},{x:34.7247791,y:45.9287071},{x:34.7531891,y:45.9100179},{x:34.8019409,y:45.902433},{x:34.7999668,y:45.8046917},{x:34.8609924,y:45.7945192},{x:34.8807335,y:45.7888935},{x:34.8975563,y:45.7824294},{x:34.9585819,y:45.7593198},{x:35.053854,y:45.787517},{x:36.7630005,y:45.8000844},{x:36.6778564,y:45.395316},{x:36.6081619,y:45.321013},{x:36.5068817,y:45.2903466},{x:36.529541,y:44.1664447},{x:31.9921875,y:44.1703849},{x:32.0361328,y:45.7253564},{x:33.545723,y:46.0000621}];
	if (PtInPoly(ll.lon, ll.lat, p))
	{
		return true;
	}

	return false;
}

function click_MMRmmrwmerequest() {
	var RenamePref="";

	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'click_MMRmmrwmerequest()::Action: '+this.id);
	if (typeof Waze.selectionManager === "undefined")
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Waze.selectionManager not found');
		return;
	}
	if (Waze.selectionManager.selectedItems.length == 0)
	{
		alert(mmrwmer_LanguageRU?'Нет выделенных объектов':'No selected segments.');
		return;
	}
	if (Waze.selectionManager.selectedItems.length < 2 && this.id === 'mmrwmerBtn_join')
	{
		alert(mmrwmer_LanguageRU?'Вы должны выделить 2 сегмента':'You must select 2 segments.');
		return;
	}

	var username = mmrwmer_getUsername();
	var sccObj = mmrwmer_getCCSD(Waze.selectionManager.selectedItems[0].model);
	if(mmrwmer_Debug) console.log("sccObj="+JSON.stringify(sccObj));
	if(sccObj.city && sccObj.city.length > 0)
		RenamePref="Rename: '" + sccObj.city + "' => '";

	var lockLevel = mmrwmer_GetLevel();
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'lockLevel= '+lockLevel);
	if (lockLevel == 1 && this.id == 'mmrwmerBtn_lock')
	{
		alert(mmrwmer_LanguageRU?'Выбранные сегменты уже разблокированы':'Selected segments are already unlocked');
		return;
	}

	var normalizedLevel=Waze.loginManager.user.normalizedLevel;
	//normalizedLevel=2;
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'My level: '+normalizedLevel);
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Lock level: '+lockLevel);

	if (lockLevel <= normalizedLevel && this.id == 'mmrwmerBtn_lock') {
		alert(mmrwmer_LanguageRU?'Выбранные сегменты имеют доступный вам уровень блокировки':'Selected segments have a lock level that is less or equal to yours');
		return;
	}

	lockLevel=normalizedLevel;

	var description='type: ' + sccObj.type + '\r' +
					'country: '+ sccObj.country + '\r' +
					'city: ' + sccObj.city + '\r' +
					'street/name: ' + sccObj.street + '\r' +
					'description: ' + sccObj.description;

	description = description.replace(/%/g, '%25');
	description = description.replace(/\+/g, '%2B');   // +
	description = description.replace(' ', '%20');   // ' '
	description = description.replace(/\r\n/g, '\r');  // '\r\n'
	description = description.replace(/\r/g, '%0A');  // '\n'
	description = description.replace(/&/g, '%26');
	description = description.replace(/</g, '%3C');
	description = description.replace(/\>/g, '%3E');
	description = description.replace(/\?/g, '%3F');
	description = description.replace(/=/g, '%3D');

	var permalink = mmrwmer_generate_permalink();

	// попытка центрировать...
	var urPos;
	if(mmrwmer_MapCenter)
		urPos=new OpenLayers.LonLat(Waze.map.center.lon,Waze.map.center.lat);
	else
		urPos=new OpenLayers.LonLat(
			Waze.selectionManager.selectedItems[0].geometry.bounds.left+(Waze.selectionManager.selectedItems[0].geometry.bounds.right-Waze.selectionManager.selectedItems[0].geometry.bounds.left)/2,
			Waze.selectionManager.selectedItems[0].geometry.bounds.top-(Waze.selectionManager.selectedItems[0].geometry.bounds.top-Waze.selectionManager.selectedItems[0].geometry.bounds.bottom)/2
		);
	urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));

	var venues0='';
	if(getQueryString(permalink, 'venues') != -1)
		venues0="&venues=" + getQueryString(permalink, 'venues');
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'venues0: '+venues0);

	// https://www.waze.com/editor/?env=row&lon=36.11483&lat=53.96670&zoom=4&marker=yes
	var segments0='';
	if(getQueryString(permalink, 'segments') != -1)
		segments0="&segments=" + getQueryString(permalink, 'segments');
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'segments0: '+segments0);


	var permalink5=permalink.split("&")[0] +
			"&zoom=" + parseInt(getQueryString(permalink, 'zoom')) +
			"&lon=" + urPos.lon +
			"&lat=" + urPos.lat +
			segments0 +
			venues0;
	var permalink50=permalink5;

	function preparePermalink(s)
	{
		s = s.replace(/%/g, '%25'); //???
		s = s.replace(/&/g, '%26');
		s = s.replace(/\?/g, '%3F');
		s = s.replace(/=/g, '%3D');
		s = s.replace(/</g, '%3C');
		s = s.replace(/\>/g, '%3E');
		return s;
	}

	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'permalink=' + permalink);
	permalink  = preparePermalink(permalink);
	permalink5 = preparePermalink(permalink5);

	//You can get entry numbers in google stylesheet: "Answers->Get precompiled URL"
	var curDate=new Date();
	curDate.setDate(curDate.getDate() + mmrwmer_CountDays);

	var action="";
	switch(this.id)
	{
		case 'mmrwmerBtn_lock':
			action='lock';
			break;
		case 'mmrwmerBtn_join':
			action='join';
			break;
		case 'mmrwmerBtn_dir':
			action='direction';
			break;
		case 'mmrwmerBtn_turn':
			action='turn';
			break;
		case 'mmrwmerBtn_closures':
			action='closures';
			break;

	}

	function zero2(d){
		if((""+d).length == 1)
			d="0" + "" + d;
		return d;
	}

	// для автозаполнения имени НП в форме
	var osmName=mmrwmer_GetCityFromOSM(urPos,parseInt(getQueryString(permalink50, 'zoom')),sccObj.country);

	var suffix="";
	var suffixCS="";

	if(sccObj.country === '')
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': sccObj.country=""; work with osmName!!!');
		switch(osmName.country_code)
		{
			case 'ru': sccObj.country='Russia'; break;
			case 'by': sccObj.country='Belarus'; break;
			case 'uz': sccObj.country='Uzbekistan'; break;
			case 'kz': sccObj.country='Kazakhstan'; break;
			case 'ua': sccObj.country='Ukraine'; break;
			case 'lt': sccObj.country='Lithuania'; break;
			case 'az': sccObj.country='Azerbaijan'; break;
		}
	}

	if (checkPosKG(urPos) && sccObj.country==='Ukraine')
	{
		sccObj.country='Russia';
		suffix=" / Крым";
	}



	var idCL=(sccObj.country=='Russia'?0:(sccObj.country=='Belarus'?1:(sccObj.country=='Uzbekistan'?2:(sccObj.country==='Kazakhstan'?3:(sccObj.country==='Ukraine'?4:(sccObj.country==='Lithuania'?5:(sccObj.country==='Azerbaijan'?6:-1)))))));
	if(idCL == -1)
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': idCL = ' +idCL + ', sccObj.countryName='+sccObj.country);
		return;
	}

	if(this.id === 'mmrwmerBtn_tts')
	{
/*
entry.587168531=nik
entry.846152130=email
entry.1316827755=country
entry.1780120881=Какое действие предпринять
entry.722429754=Название сегмента как на карте
entry.543004173=Сейчас произноситься так
entry.495130616=...должно звучать так
entry.1226154757=permalink
entry.1360508522=remark
*/
		description='';

		// TTS: always zoom = 4
		var urlTTS=CL[idCL].ttsf +
			'?entry.587168531=' + username +
			'&entry.846152130=' + MMRmmrwmerequestEmail +
			'&entry.1226154757=' + permalink5.replace(/zoom\%3D([0-9]+)\%26/,"zoom%3D4%26") +
			'&entry.1316827755=' + sccObj.country +
			//'&entry.1780120881=' + // Какое действие предпринять
			'&entry.722429754=' + sccObj.street + // Название сегмента как на карте
			'&entry.543004173=' + sccObj.street + // Сейчас произноситься так
			'&entry.495130616=' + sccObj.street + // ...должно звучать так
			'';

		window.open(urlTTS, '_blank');

		return;
	}


	if(mmrwmer_Debug) console.log("--- osmName & sccObj ---");
	if(mmrwmer_Debug) console.log(osmName);
	if(mmrwmer_Debug) console.log(sccObj);

	if (!sccObj.city || sccObj.city.length === 0)
	{
		sccObj.city=osmName.cityName;
	}

	if (!sccObj.city || (typeof sccObj.city === "undefined"))
		sccObj.city='';

/*
entry.1230839078			username
entry.1797072526			e-mail
entry.390417455				permalink
entry.1508498769			Country
entry.1856604039			Action
entry.1939939237			Start Closures
entry.1229617197			End Closures
entry.1746680078			Причина перекрытия
entry.1224334113			locklevel
entry.571885954				EndUnlock
entry.2082027069			Узел
entry.259824358				Description
*/
	// !!!
	var url = CL[idCL].fr +
			'?entry.1230839078=' + username +
			'&entry.390417455=' + permalink5 +
			'&entry.1224334113=' + lockLevel +
			'&entry.1508498769=' + sccObj.country +
			'&entry.1856604039=' + action +
			'&entry.259824358=' + description + suffix +
			'&entry.1797072526=' + MMRmmrwmerequestEmail +
			'&entry.571885954='+curDate.getUTCFullYear()+'-'+zero2(curDate.getUTCMonth()+1)+'-'+zero2(curDate.getUTCDate()) +
			'';

	// CL: always zoom = 4
	var urlCL = CL[idCL].f +
			'?entry.1109766685=' + username +
			'&entry.1785513403=' + MMRmmrwmerequestEmail +
			'&entry.1300384005=' + permalink5.replace(/zoom\%3D([0-9]+)\%26/,"zoom%3D4%26") +
			'&entry.1967623256=' + RenamePref+ sccObj.city + suffix + (RenamePref.length>0?"'":"") +
			'&entry.1393986642=' + sccObj.stateID +
//			'&entry.address_json=' + JSON.stringify(osmName.address_json) +
			'';

	if (this.id == 'mmrwmerA_cl') // доп проверка
	{
		if (sccObj.username === '' || sccObj.city === '' || sccObj.cityID === '')
		{
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ALERT!!! ' + 'sccObj.username=',sccObj.username,"sccObj.city=",sccObj.city,"sccObj.cityID=",sccObj.cityID);
			alert(mmrwmer_LanguageRU?"Внимание! Не полные данные (UserName, City или CityID). Сохранение не возможно.":"Attention! UserName, City or CityID ==> empty. Saving is not possible.");
			return;
		}
	}

	var urlL5 = CL[idCL].l +
			'?func=saveLevel5' +
			'&p1=' + sccObj.username +
			'&p2=' + sccObj.city + suffix +
			'&p3=' + permalink5 +
			'&p4=' + timeConverter(sccObj.updatedOn) +
			'&p5=' + sccObj.cityID +
			'&p6=' + sccObj.stateID +
			'';


	var urlCS = null;
	if (CL[idCL].cs !== '')
		urlCS = CL[idCL].cs +
			'?p1=' + username +
			'&p2=' + MMRmmrwmerequestEmail +
			'&p3=' + permalink5 +
			'&p4=' + sccObj.city + ': изменить регион' +
			'&p5=' + sccObj.stateID +
			'&p6=' + sccObj.cityID +
			'';

	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'urlL5=' + urlL5);

	if(this.id === 'mmrwmerA_cl')
	{
		if(sccObj.city === null || sccObj.city === '')
		{
			alert(mmrwmer_LanguageRU?"Внимание! Имя НП пустое. Сохранение не возможно.":"Attention! The name of the city is empty. Saving is not possible.");
			return;
		}
	}

	if(this.id === 'mmrwmerCS_cl')
	{
		if(urlCS === null || sccObj.stateName === null || sccObj.stateName === '')
		{
			alert(mmrwmer_LanguageRU?"Внимание! Имя Района пустое. Сохранение не возможно.":"Attention! The name of the state is empty. Saving is not possible.");
			return;
		}
	}


	window.open(this.id == 'mmrwmerBtn_cl'?urlCL:(this.id == 'mmrwmerA_cl'?urlL5:(this.id == 'mmrwmerCS_cl'?urlCS:url)), '_blank');
}

function getQueryString(link, name)
{
	if (link.indexOf( name + '=' ) <= 0)
		return -1;
	var pos = link.indexOf( name + '=' ) + name.length + 1;
	var len = link.substr(pos).indexOf('&');
	return (len == -1)?link.substr(pos):link.substr(pos,len);
}

function mmrwmer_generate_permalink() {
  	var wcp=document.getElementsByClassName('WazeControlPermalink');
  	for(var i=0; i < wcp.length; ++i)
  		for (var j=0; j < wcp[i].getElementsByTagName('a').length;++j)
  		{
  			var href=wcp[i].getElementsByTagName('a')[j].href;
			if (href.indexOf(".waze.com/") > 0 && href.indexOf("/editor") > 0)
			{
				// kill "/ru/", kill "layers"
				href=href.replace("/ru/","/").replace(/layers=([0-9]+)\&/,"") + "&marker=yes";
				if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'href=' + href);
				return href;
			}
		}
	return "";
}

function CreateID()
{
	return 'MMR-WME-Request-' + mmrwmer_Version.replace(/\./g,"-");
}


function mmrwmer_insertButton(z)
{
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'mmrwmer_insertButton()',Waze.selectionManager.selectedItems.length);
	/*{
		var permalink=mmrwmer_generate_permalink();
		var p = document.getElementsByClassName('WazeControlMousePosition')[0].lastChild.innerHTML.split(' ');
		permalink=permalink.replace(/#/g, "").replace(/&lat=([0-9\.]+)/g, '&lat='+p[1]).replace(/&lon=([0-9\.]+)/g, '&lon='+p[0]);
	}*/

//	if(document.getElementById(CreateID()) != null)
//		document.getElementById(CreateID()).setAttribute('style', 'display:'+(Waze.selectionManager && Waze.selectionManager.selectedItems.length == 0?'none':'')+';');

	if(Waze.selectionManager.selectedItems.length <= 0)
		return;

	if (typeof Waze.selectionManager.selectedItems[0].model === "undefined")
		return;

	switch(Waze.selectionManager.selectedItems[0].model.type)
	{
		case "segment":
		case "venue":
			break;
		case "city":
			/*
			attributes:
				countryID: 186
				englishName: null
				id: 1501075
				isEmpty: false
				name: "Веселовский (Чертковский р-н)"
				permissions: -1
				rank: 4
				stateID: 1839712
				geometry:
					bounds: null
					id: "OpenLayers.Geometry.Point_910"
					x: 4518527.665247766
					y: 6312163.836996106
			*/
		case "camera":
		case "node":
		case "bigJunction":
		case "country":
		case "houseNumber":
		case "junction":
		case "mapProblem":
		case "roadClosure":
		case "state":
		default:
			return;
	}


      //
      if (Waze.selectionManager.selectedItems[0].model.type === "venue")
      {
      	var area_poi=document.getElementById('WME.PlaceNames-Square');
      	if(!area_poi)
      	{
	      	var wcp=document.getElementsByClassName('additional-attributes list-unstyled side-panel-section');
	      	if (wcp)
	      	{
				var li=document.createElement("LI");
				li.setAttribute('id', 'WME.PlaceNames-Square');
	      		wcp[0].appendChild(li);
	      		area_poi=document.getElementById('WME.PlaceNames-Square');
	      	}
	      }

			if(area_poi)
			{
				var v_id=Waze.selectionManager.selectedItems[0].model.attributes.id;
				if (typeof Waze.model.venues.get(v_id).geometry.getGeodesicArea === "undefined")
					area_poi.innerHTML="";
				else
				{
					var square=Waze.model.venues.get(v_id).geometry.getGeodesicArea(Waze.map.getProjectionObject());
					area_poi.style=(square < 650)?"color: red;":"color: black;";
					area_poi.innerHTML="Площадь: " + square.toFixed(2) + " м&#178;";
				}
			}

		}
        /*
		else if (Waze.selectionManager.selectedItems[0].model.type === "camera") // camera-edit-general
		{
      		var cam=document.getElementsByClassName('additional-attributes list-unstyled side-panel-section');
      		if (cam && cam.length > 0)
      		{
	      		var camDate = Waze.selectionManager.selectedItems[0].model.attributes.updatedOn;
	      		if (!camDate)
	      			camDate = Waze.selectionManager.selectedItems[0].model.attributes.createdOn;
				if (camDate)
				{
					var dateNow = new Date();
	      			var age=Math.floor((dateNow.getTime() - camDate) / 86400000);
					var li=document.createElement("LI");
					li.setAttribute('id', 'WME.Age');
	    		  	cam[0].appendChild(li);
	      			camage=document.getElementById('WME.Age');
		      		camage.innerHTML="Age: " + age + " day(s)";
				}

      		}

		}
        */
      //

	var editPanelID='';
	var disabled=false;
	var disabledjoin=false;
	var disabledLock=false;
	var disabledPM=false;

	if (document.getElementById('segment-edit-general') !== null)
	{
		editPanelID='segment-edit-general';
		disabled=false;
		disabledjoin=false;
		disabledLock=false;
	}
	else if (document.getElementById('landmark-edit-general') !== null)
	{
		editPanelID='landmark-edit-general';
		disabledLock=false;
		disabledjoin=true;
		disabled=true;
	}
	else if (document.getElementById('node-edit-general') !== null)
	{
		editPanelID='node-edit-general';
		disabled=true;
		disabledjoin=true;
		disabledPM=true;
		disabledLock=true;
	}
	else if (document.getElementById('edit-panel') !== null)
	{
		editPanelID='edit-panel';
		disabled=true;
		disabledjoin=true;
		disabledLock=true;
	}


	var sccObj = mmrwmer_getCCSD(Waze.selectionManager.selectedItems[0].model);
	if(mmrwmer_Debug) console.dir(sccObj);

	var urPos;
	if(mmrwmer_MapCenter)
		urPos=new OpenLayers.LonLat(Waze.map.center.lon,Waze.map.center.lat);
	else
		urPos=new OpenLayers.LonLat(
			Waze.selectionManager.selectedItems[0].geometry.bounds.left+(Waze.selectionManager.selectedItems[0].geometry.bounds.right-Waze.selectionManager.selectedItems[0].geometry.bounds.left)/2,
			Waze.selectionManager.selectedItems[0].geometry.bounds.top-(Waze.selectionManager.selectedItems[0].geometry.bounds.top-Waze.selectionManager.selectedItems[0].geometry.bounds.bottom)/2
		);
	urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));

	var osmName=mmrwmer_GetCityFromOSM(urPos,parseInt(getQueryString(mmrwmer_generate_permalink(), 'zoom')),sccObj.country);
	if(sccObj.country === '')
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': sccObj.country=""; work with osmName!!!');
		// попытка центрировать...
		//var osmName=mmrwmer_GetCityFromOSM(urPos,parseInt(getQueryString(mmrwmer_generate_permalink(), 'zoom')),sccObj.country);
		switch(osmName.country_code)
		{
			case 'ru': sccObj.country='Russia'; break;
			case 'by': sccObj.country='Belarus'; break;
			case 'uz': sccObj.country='Uzbekistan'; break;
			case 'kz': sccObj.country='Kazakhstan'; break;
			case 'ua': sccObj.country='Ukraine'; break;
			case 'lt': sccObj.country='Lithuania'; break;
			case 'az': sccObj.country='Azerbaijan'; break;
		}
	}
	if (checkPosKG(urPos) && sccObj.country==='Ukraine')
	{
		sccObj.country='Russia';
	}

	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': sccObj.cityID=' + sccObj.cityID + ', sccObj.country='+sccObj.country);
	var idCL=(sccObj.country=='Russia'?0:(sccObj.country=='Belarus'?1:(sccObj.country=='Uzbekistan'?2:(sccObj.country=='Kazakhstan'?3:(sccObj.country==='Ukraine'?4:(sccObj.country==='Lithuania'?5:(sccObj.country==='Azerbaijan'?6:-1)))))));
	if(idCL == -1)
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': idCL = ' +idCL + ', sccObj.country='+sccObj.country);
		idCL=0;
	}

	if(!document.getElementById(CreateID()))
	{
		// add new edit tab to left of the map
		var srsCtrl = document.createElement('div');
		srsCtrl.id = CreateID();

		// inject new tab
		var userTabs = document.getElementById('edit-panel');
		var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': typeof navTabs=' + (typeof navTabs));
		if (typeof navTabs !== "undefined")
		{
			var tabContent = getElementsByClassName('tab-content', userTabs)[0];

			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': typeof tabContent=' + (typeof tabContent));
			if (typeof tabContent !== "undefined")
			{
				newtab = document.createElement('li');
				newtab.innerHTML = '<a href="#' + CreateID() + '" id="pmmrwmerequest" data-toggle="tab">'+(mmrwmer_LanguageRU?'MMR Запросы':'MMR Requests')+'</a>';
				navTabs.appendChild(newtab);

				var padding="padding:5px 9px";
				var html= /*'<hr>'+*/
					'<div class="form-group">'+
					'<h4>MMR WME Requests <sup>' + mmrwmer_Version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/ru/scripts/38044-mmr-russia-wme-requests" title="Link" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>'+
					'<form class="attributes-form side-panel-section" action="javascript:return false;">'+
					'<div class="controls-container">';

				// --- Общее ---
				html += ''+
					'<div class="form-group">'+
					'<label class="control-label">' + (mmrwmer_LanguageRU?'Общие':'Common') +'</label>' +
					'<label><a href="' + CL[idCL].dr + '" id="mmrwmerA_dr" target="_gdocRequest" title="' + sccObj.country + '">' + (mmrwmer_LanguageRU?'Таблица':'Table') +'</a></label> | '+
					'<label><a href="https://www.waze.com/forum/viewtopic.php?p=662218#p662218" title="City Lock ' + mmrwmer_Version + '" target="_blank">' + (mmrwmer_LanguageRU?'О проекте':'About') +'</a></label></br>'+
					'<button id="mmrwmerBtn_lock" class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(mmrwmer_LanguageRU?'Отправить запрос на изменение уровня блокировки объектов':'Send a request to lock/unlock segment(s)')+
						'"><i class="fa fa-unlock"></i>&nbsp;Lock</button>&nbsp;' +
					'<button id="mmrwmerBtn_join" class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(mmrwmer_LanguageRU?'Отправить запрос на присоединение сегментов':'Send a request to join several segments')+
						'"><i class="fa fa-cogs"></i>&nbsp;Join</button>&nbsp;' +
					'<button id="mmrwmerBtn_dir"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(mmrwmer_LanguageRU?'Отправить запрос на изменение направления движения сегментов':'Send a request to change the direction of segment(s)')+
						'"><i class="fa fa-random"></i>&nbsp;Dir</button>&nbsp;' +
					'<button id="mmrwmerBtn_turn"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(mmrwmer_LanguageRU?'Отправить запрос на изменение разрешения поворотов':'Send a request to change the turn restriction.')+
						'"><i class="fa fa-arrows-alt"></i>&nbsp;Turn</button>&nbsp;' +
					'<button id="mmrwmerBtn_closures"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(mmrwmer_LanguageRU?'Отправить запрос на изменение перекрытие сегментов':'Send a request to change the Real Time Closures.')+
						'"><i class="fa fa-calendar"></i>&nbsp;Closures</button>' +
					'</div></div>';


				// --- CityLock ---
				html += ''+
					'<div class="form-group">'+
					'<label class="control-label">' + (mmrwmer_LanguageRU?'CityLock':'CityLock') +'</label>' +
					'<div class="controls-container">' +
					'<label><a href="' + CL[idCL].d + '" id="mmrwmerA_d" target="_gdocRequest" title="' + sccObj.country + '">' + (mmrwmer_LanguageRU?'Таблица':'Table') +'</a></label> | '+
					'<label><a href="https://www.waze.com/forum/viewtopic.php?f=787&t=105793" title="City Lock ' + mmrwmer_Version + '" target="_blank">' + (mmrwmer_LanguageRU?'О проекте':'About') +'</a></label></br>'+
					'<button id="mmrwmerBtn_cl"   class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(mmrwmer_LanguageRU?'Отправить запрос на изменение наименования населенного пункта':'Send a request to CityLock')+
						'"><i class="fa fa-home"></i>&nbsp;City</button>'+
					'&nbsp;<span id="mmrwmerChangeState0"></span>' +
					'&nbsp;<span id="mmrwmerCitySave0"></span></br>' +
					'<label><span id="mmrwmerCityID"></span><br>'+
					'<span id="mmrwmerStateID"></span></label>'+
					'<div class="controls-container">' +
					'<label>Language from OSM:</label>' +
					'<select class="form-control" id="mmrwmerEdt_country" title="Для запросов по созданию/изменению НП принудительно задавать язык получемых данных из OSM">';

					for(var cli=0; cli < CL.length; ++cli)
						html+='<option value="'+cli+'">'+CL[cli].c+'</option>';

				html += ''+
					'</select>'+
					'</div>'+
					'<div class="controls-container" style="display:none">' +
					'<input name="mmrwmerChk_county" value="" id="mmrwmerChk_county" type="checkbox"><label for="mmrwmerChk_county" title="'+(mmrwmer_LanguageRU?'Добавлять РАЙОН в название НП':'Adding DISTRICT in the name of the locality')+'">&nbsp;'+(mmrwmer_LanguageRU?'Добавлять район':'Add District')+'</label><br>' +
					'</div>' +
					//'</br><label><span id="mmrwmerLatLon"></span></label>'+
					'</div></div>';

				// --- TTS ---
				/*html += ''+
					'<div class="form-group">'+
					'<label class="control-label">TTS Requests</label>' +
					'<div class="controls-container">' +
					'<label><a href="' + CL[idCL].ttsd + '" id="mmrwmerTTS_d" target="_gdocRequest" title="TTS '+CL[idCL].ttst +'">' + (mmrwmer_LanguageRU?'Таблица':'Table') +'</a></label> | '+
					'<label><a href="https://www.waze.com/forum/viewtopic.php?f=785&t=148400" title="'+CL[idCL].ttst +' - новый TTS-голос" target="_blank">' + (mmrwmer_LanguageRU?'О проекте':'About') +'</a></label></br>'+
					//'<select class="form-control" id="mmrwmerEdt_TTSSelect" title="">'+
					//'<option value="Marussia">Маруся</option>'+
					//'<option value="Марічка">Марічка</option>'+
					//'</select>'+
					'<button id="mmrwmerBtn_tts"   class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(mmrwmer_LanguageRU?'Отправить запрос по проблеме произношения или сокращения в Waze TTS '+CL[idCL].ttst:'Send a request to the pronunciation problem or reduction in Waze TTS '+CL[idCL].ttst)+
						'"><i class="fa fa-volume-up"></i>&nbsp;TTS</button></br>' +
					'</div></div>';*/

				// --- Прочее ---
				/*html += ''+
					'<div class="form-group">'+
					'<label class="control-label">' + (mmrwmer_LanguageRU?'Прочее':'Other') +'</label>' +
					'<div class="controls-container">' +
					'<button id="mmrwmerBtn_pm"   class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(mmrwmer_LanguageRU?'Отправить приватное сообщение в форум авторам выделенных объектов':'Send (in forum) a Private Message to the author of the segment')+
						'"><li class="fa fa-envelope"></li>&nbsp;PM</button>'+
					'</div></div>';*/



				// --- Настройки ---
				html += ''+
					'<div class="form-group">' +
					'<label class="control-label">' + (mmrwmer_LanguageRU?'Настройки':'Config') +'</label>';

				html += ''+
					'<div class="controls-container">' +
					'<label>E-mail:' +
					'<input  title="' + (mmrwmer_LanguageRU?'Ваш e-mail адрес':'Your e-mail address') +'" type="text" class="form-control" autocomplete="off" id="mmrwmerEdt_email" name="mmrwmerEdt_email" value="" size="15"/></label><br>' +
					'</div>'+
					'<div class="controls-container">' +
					'<input name="mmrwmerChk_mapcenter" value="" id="mmrwmerChk_mapcenter" type="checkbox"><label for="mmrwmerChk_mapcenter" title="'+(mmrwmer_LanguageRU?'Брать координаты центра карты':'Брать координаты центра карты')+'">Map Center</label>' +
					'</div>'+
					'<div class="controls-container">' +
					'<input name="mmrwmerEdt_lang" value="" id="mmrwmerEdt_lang" type="checkbox"><label for="mmrwmerEdt_lang" title="'+(mmrwmer_LanguageRU?'Принудительно использовать русскоязычный интерфейс для WME Request':'Forced to use Russian-language interface for WM Request')+'">Russian UI</label>' +
					'</div>'+
					'<div class="controls-container">' +
					'<input name="mmrwmerChk_debug" value="" id="mmrwmerChk_debug" type="checkbox"><label for="mmrwmerChk_debug" title="'+(mmrwmer_LanguageRU?'Включить логирование':'Enable debug script')+'">Debug script</label><br>' +
					'</div>';

				html += ''+
					'</div>' +
					'</form>'+
					'</div>' +
					'';

				srsCtrl.innerHTML = html;
				//srsCtrl.id = "sidepanel-mmrwmerequest";
				srsCtrl.className = "tab-pane";
				tabContent.appendChild(srsCtrl);
			}
			else
				srsCtrl.id='';
		}
		else
			srsCtrl.id='';
		//http://www.earthtools.org/sun/51.65500265464235/39.18297673378902/22/1/99/0
		//document.getElementById(editPanelID).appendChild(srsCtrl);

		if(srsCtrl.id !== '')
		{
			document.getElementById('mmrwmerBtn_lock').onclick = click_MMRmmrwmerequest;
			document.getElementById('mmrwmerBtn_dir').onclick  = click_MMRmmrwmerequest;
			document.getElementById('mmrwmerBtn_turn').onclick  = click_MMRmmrwmerequest;
			document.getElementById('mmrwmerBtn_closures').onclick  = click_MMRmmrwmerequest;
			document.getElementById('mmrwmerBtn_join').onclick = click_MMRmmrwmerequest;
			//document.getElementById('mmrwmerBtn_pm').onclick   = click_submitPMForm;
			document.getElementById('mmrwmerBtn_cl').onclick   = click_MMRmmrwmerequest;
			//document.getElementById('mmrwmerBtn_tts').onclick   = click_MMRmmrwmerequest;
		}

		//var permalink=mmrwmer_generate_permalink();
		//var p = document.getElementsByClassName('WazeControlMousePosition')[0].innerHTML.replace(' ', '').split(',');
		//var p = document.getElementsByClassName('WazeControlMousePosition')[0].lastChild.innerHTML.split(' ');
		//permalink=permalink.replace(/#/g, "").replace(/&lat=([0-9\.]+)/g, '&lat='+p[1]).replace(/&lon=([0-9\.]+)/g, '&lon='+p[0]);
        /*
		if (typeof Waze.selectionManager.selectedItems[0].geometry.x !== "undefined")
		{
			// корректировка пермалинка для камеры, жанкшина и Place (point)
			var urPos=new OpenLayers.LonLat(Waze.selectionManager.selectedItems[0].geometry.x,Waze.selectionManager.selectedItems[0].geometry.y);
			urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326")); // {lon, lat}
			permalink=permalink.replace(/#/g, "").replace(/&lat=([0-9\.]+)/g, '&lat='+urPos.lat).replace(/&lon=([0-9\.]+)/g, '&lon='+urPos.lon);
		}
        */
		//document.getElementById('mmrwmerCityID').innerHTML='<small><a href="'+permalink+'">cityID: '+sccObj.cityID+'</a></small>';
		//document.getElementById('mmrwmerCityID').innerHTML='<small>cityID: '+sccObj.cityID+'</small>';
        /*
		if(Waze.loginManager.user.rank >= 4)
		{
			document.getElementById('mmrwmerCityID').innerHTML+='&nbsp;(<small><a style="cursor: pointer" title="Save the name of the new city in the Google Table" id="mmrwmerA_cl">save</a></small>)';
			document.getElementById('mmrwmerA_cl').onclick   = click_MMRmmrwmerequest;
		}
        */

		//document.getElementById('mmrwmerLatLon').innerHTML='<small>'+p[0]+','+p[1]+'</a></small>';

		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'initialised');
	}

	if(document.getElementById(CreateID()) != null)
	{

		// ********************
		if(document.getElementById('mmrwmerA_dr'))
		{
			document.getElementById('mmrwmerA_dr').href=CL[idCL].dr;
			document.getElementById('mmrwmerA_dr').title=sccObj.country;
		}
		if(document.getElementById('mmrwmerA_d'))
		{
			document.getElementById('mmrwmerA_d').href=CL[idCL].d;
			document.getElementById('mmrwmerA_d').title=sccObj.country;
		}

		// ********************
		if(document.getElementById('mmrwmerCityID'))
		{
		//console.log("osmName.cityName=",osmName.cityName)
			if (sccObj.country === 'Russia') // need script!
				//document.getElementById('mmrwmerCityID').innerHTML='<small>cityID: <a href="http://fias.nalog.ru/?'+osmName.cityName+'" target="_blank">'+sccObj.cityID+'</a></small>';
				document.getElementById('mmrwmerCityID').innerHTML='<small><a href="http://fias.nalog.ru/?'+sccObj.city+' ('+sccObj.stateName+'" title="Проверить имя в fias" target="_blank">cityID:</a> <span id="__clpCI" style="cursor:pointer;" title="Копировать CityID">'+sccObj.cityID+'</span></small>';
			else
				document.getElementById('mmrwmerCityID').innerHTML='<small>cityID: <span id="__clpCI" style="cursor:pointer;" title="Копировать cityID">'+sccObj.cityID+'</span></small>';
			document.getElementById('__clpCI').onclick=function(){clipboard.copy(this.innerText);}
		}
		if(document.getElementById('mmrwmerStateID'))
		{
			document.getElementById('mmrwmerStateID').innerHTML='<small>stateID: <span id="__clpSI" style="cursor:pointer;" title="Копировать stateID">'+sccObj.stateID+'</span></small>';
			document.getElementById('__clpSI').onclick=function(){clipboard.copy(this.innerText);}
		}


		// ********************
        // config e-mail
        if(document.getElementById('mmrwmerEdt_email'))
        {
			document.getElementById('mmrwmerEdt_email').value=MMRmmrwmerequestEmail;
			document.getElementById('mmrwmerEdt_email').onchange=function(){MMRmmrwmerequestEmail=this.value;localStorage.setItem('MMRmmrwmerequestEmail', MMRmmrwmerequestEmail);}
		}

        if(document.getElementById('mmrwmerEdt_country'))
        {
            document.getElementById("mmrwmerEdt_country").selectedIndex = MMRmmrwmerequestCountry;
            document.getElementById("mmrwmerEdt_country").onchange = function(){MMRmmrwmerequestCountry=parseInt(this.value);localStorage.setItem("MMRmmrwmerequestCountry",MMRmmrwmerequestCountry);};
		}

		// ********************
		// config language
		if (document.getElementById('mmrwmerEdt_lang'))
		{
			var WMELanguageRU=localStorage.getItem("WMELanguageRU");
			if (WMELanguageRU)
				mmrwmer_LanguageRU=WMELanguageRU === "1"?true:false;
			document.getElementById('mmrwmerEdt_lang').checked=mmrwmer_LanguageRU;
			document.getElementById('mmrwmerEdt_lang').onchange=function(){mmrwmer_LanguageRU=this.checked;localStorage.setItem('WMELanguageRU', mmrwmer_LanguageRU?"1":"0");}
		}

		// ********************
		// config debug
		document.getElementById('mmrwmerChk_debug').checked=mmrwmer_Debug;
		document.getElementById('mmrwmerChk_debug').onchange=function(){mmrwmer_Debug=this.checked;localStorage.setItem('mmrwmer_Debug', mmrwmer_Debug?"1":"0");}


		document.getElementById('mmrwmerChk_mapcenter').checked=mmrwmer_MapCenter;
		document.getElementById('mmrwmerChk_mapcenter').onchange=function(){mmrwmer_MapCenter=this.checked;localStorage.setItem('MMRmmrwmerequestMapCenter', mmrwmer_MapCenter?"1":"0");}

		// ********************
		// config debug AddCounty
		document.getElementById('mmrwmerChk_county').checked=mmrwmer_AddCounty;
		document.getElementById('mmrwmerChk_county').onchange=function(){mmrwmer_AddCounty=this.checked;localStorage.setItem('MMRmmrwmerequestAddCounty', mmrwmer_AddCounty?"1":"0");}


		// ********************
		if(sccObj.country==='Russia')
		{
			document.getElementById('mmrwmerChangeState0').innerHTML=
			'<button id="mmrwmerCS_cl"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
				(mmrwmer_LanguageRU?'Изменить район':'Change State')+
				'"><i class="fa fa-map-marker"></i>&nbsp;State</button>';

			document.getElementById('mmrwmerCS_cl').onclick   = click_MMRmmrwmerequest;
		}

		if(Waze.loginManager.user.rank >= 4 || (sccObj.country=='Belarus' && Waze.loginManager.user.rank >= 3)) // ??? Uzbekistan ???
		{
			document.getElementById('mmrwmerCitySave0').innerHTML=
			'<button id="mmrwmerA_cl"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
				(mmrwmer_LanguageRU?'Сохранить имя нового НП в Google-таблице':'Save the name of the new city in the Google Table')+
				'"><i class="fa fa-floppy-o"></i>&nbsp;Save</button>';

			//document.getElementById('mmrwmerCityID').innerHTML+='&nbsp;(<small><a style="cursor: pointer" title="Save the name of the new city in the Google Table" id="mmrwmerA_cl">save</a></small>)';
			document.getElementById('mmrwmerA_cl').onclick   = click_MMRmmrwmerequest;
		}
	}

	if(document.getElementById(CreateID()) != null)
	{
		document.getElementById('mmrwmerBtn_lock').disabled=disabledLock;
		document.getElementById('mmrwmerBtn_dir').disabled=disabled;
		document.getElementById('mmrwmerBtn_turn').disabled=disabled;
		document.getElementById('mmrwmerBtn_closures').disabled=disabled;
		document.getElementById('mmrwmerBtn_join').disabled=disabled;
		//document.getElementById('mmrwmerBtn_pm').disabled=disabledPM;
		document.getElementById('mmrwmerBtn_cl').disabled=disabled;
		//document.getElementById('mmrwmerBtn_tts').disabled=disabled;
		if(document.getElementById('mmrwmerA_cl'))
			document.getElementById('mmrwmerA_cl').disabled=disabled;
		if(document.getElementById('mmrwmerCS_cl'))
			document.getElementById('mmrwmerCS_cl').disabled=disabled;

	}
}


// <WME Fancy permalink> - http://userscripts.org/users/548866
function getId(node) {
  return document.getElementById(node);
}

function getForumUserIdFromID(wmeUserID)
{
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'call getForumUserIdFromID(' + wmeUserID + ')');
	var userName=Waze.model.users.get(wmeUserID);
	if(mmrwmer_Debug) console.dir(userName);
	return (getForumUserIdFromName(userName.userName));
}

function getForumUserIdFromName(userName)
{
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'call getForumUserIdFromName(' + userName + ')');
	var forumID=-1;
	var forumIDs=new Array();

	if (userName.indexOf('/')!=-1)
	{
		var userNames=userName.split('/');
		for (var i=0; i<userNames.length; i++)
		{
			forumID=getForumUserIdFromName(userNames[i]);
			forumIDs[i]=forumID[0];
		}
		return forumIDs;
	}

	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'looking for ' + userName + ' in the forum.');

	var xhr3_object;

	if(window.XMLHttpRequest) // Firefox & Chrome
		xhr3_object = new XMLHttpRequest();
	else if(window.ActiveXObject) // Internet Explorer
		xhr3_object = new ActiveXObject("Microsoft.XMLHTTP");

	xhr3_object.open("GET", "https://www.waze.com/forum/memberlist.php?username=" + userName, false);

	xhr3_object.onreadystatechange = function() {
		if(xhr3_object.readyState == 4)
		{
			var test = xhr3_object.responseText.match(/u=([0-9]+)"/g);
			if (test==null)
			{
				if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Forum return null');
				return(-1); // no match
			}
			if (test.length>1)
			{
				if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Forum return multiple match:');
				if(mmrwmer_Debug) console.dir(test);
				return(-2); // multiple match
			}
			forumID=test[0].substring(2, test[0].length-1);
		}
	};

	if(mmrwmer_Debug) console.dir(xhr3_object);

	try {
		xhr3_object.send(null);
	}
	catch (err) {
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'XMLHttpRequest error: ' +err.name);
		if(mmrwmer_Debug) console.dir(err);
		return(-3);
	}
	forumIDs[0]=forumID;
	return (forumIDs);
}

function click_submitPMForm()
{
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'click_submitPMForm() start');
	if (typeof Waze.selectionManager === "undefined")
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Waze.selectionManager not found');
		return;
	}

	if (Waze.selectionManager.selectedItems.length == 0)
	{
		alert(mmrwmer_LanguageRU?'Сначала необходимо выделить сегмент':'Please, select one segment before');
		return false;
	}

	//-------------
	var sccObjs=new Array();
	for (var i=0; i < Waze.selectionManager.selectedItems.length; ++i)
	{
		var sccObj = mmrwmer_getCCSD(Waze.selectionManager.selectedItems[i].model);
		if (sccObj.userID==-1)
		{
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'PM request - Do not PM Admin!');
			alert("Can't PM admin!");
			return false;
		}

		var j;
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'sccObj.userID='+sccObj.userID);
		for (j=0; j < mmrwmer_UserCache.length; j+=2)
		{
			if (mmrwmer_UserCache[j] === sccObj.userID)
			{
				sccObj.forumuserID=mmrwmer_UserCache[j+1];
				if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'found ['+j+']'+mmrwmer_UserCache[j+1]);
				break;
			}
		}

		if (sccObj.forumuserID == "")
		{
			if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'not found '+sccObj.userID);
			sccObj.forumuserID=getForumUserIdFromID(sccObj.userID);
			mmrwmer_UserCache.push(sccObj.userID,sccObj.forumuserID);
		}

		sccObjs.push(sccObj);
	}

	var forumIDs=new Array();
	for (var i=0; i < sccObjs.length; ++i)
		forumIDs[i]=sccObjs[i].forumuserID;
	//-------------

	if (forumIDs.length==1 && forumIDs[0]==-1)
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'PM request - User never logged to the forum...');
		alert(mmrwmer_LanguageRU?'Автор сегмента не найден на форуме':'Sorry: unable to find the user in the forum');
		return false;
	}
	if (forumIDs.length==1 && forumIDs[0]==-2)
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'PM request - Several users match name. Should never happen :s');
		alert(mmrwmer_LanguageRU?'Найдено более одного пользователя\nОтправьте сообщение самостоятельно.':'Sorry: more than one user found in the forum.\nYou should look for him/her by yourself.');
		return false;
	}
	if (forumIDs.length==1 && forumIDs[0]==-3)
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'A network error occurred.');
		alert(mmrwmer_LanguageRU?'Сетевые проблемы\nОтправьте сообщение самостоятельно.':'Sorry: a network error occurred.\nYou should look for him/her by yourself.');
		return false;
	}

	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'PM request - all OK. go to PM!');

	var formID="mmrwmer-PM-FORM";

	var nodePM;

	if (getId("mmrwmer-PM-Send") == null)
	{
		nodePM= document.createElement('div');
		nodePM.id = 'mmrwmer-PM-Send';
		nodePM.style.display='hidden';
		getId(CreateID()).appendChild(nodePM);
	}
	else
	{
		nodePM=getId("mmrwmer-PM-Send");
	}

	var PMForm;
	PMForm='<form id="' + formID + '" target="_blank" method="post" style="display: inline">';
	PMForm+='<input id="' + formID + '-subject" type="hidden" name="subject" value="" />';
	PMForm+='<input type="hidden" name="addbbcode20" value="100" />';
	PMForm+='<input id="' + formID + '-message" type="hidden" name="message" value="" />';
	PMForm+='<input type="hidden" name="preview" value="Preview" />';
	PMForm+='<input type="hidden" name="attach_sig" value="on" />';
	PMForm+='<input id="' + formID + '-ct" type="hidden" name="creation_time" value="0" />';
	PMForm+='<input id="' + formID + '-lc" type="hidden" name="lastclick" value="0" />';
	for (var i=0; i<forumIDs.length; i++)
	{
		PMForm+='<input type="hidden" name="address_list[u]['+forumIDs[i]+']" value="to" />';
	}
	PMForm+='</form>';
	nodePM.innerHTML=PMForm;

	var permalink=mmrwmer_generate_permalink();
	//if(mmrwmer_Debug) console.log(permalink);
	var name_object=""
	linkParts=permalink.replace(/#/g, "").split('&');
	for (var j=0; j<linkParts.length; j++)
	{
		if (linkParts[j].indexOf("segments=")==0 || linkParts[j].indexOf("venues=")==0  || linkParts[j].indexOf("cameras=")==0 || linkParts[j].indexOf("bigJunctions=")==0)
		{
			name_object=linkParts[j].split('=')[0]
			linkParts.splice (j,1);
			break;
		}
	}
	permalink=linkParts.join('&');

	if(mmrwmer_Debug) console.dir(linkParts);

	var message=mmrwmer_LanguageRU?
		'Есть вопросы по правкам в [url=' + permalink + ']этой области редактирования[/url]:\n\n':
		'Some questions about [url=' + permalink + ']this area[/url]:\n\n';

	function NullToEmpty(s)
	{
		return !s?"":s;
	}
	function GetTypeName(s)
	{
		if(mmrwmer_LanguageRU)
		{
			switch(s)
			{
				case "segment":     return "сегмент"
				case "venue":       return "ПОИ"
				case "node":        return "узел"
				case "camera":      return "камера"
				case "bigJunction": return "развязка"
			}
		}
		return s
		//'+(mmrwmer_LanguageRU?'Категории':'Categories')+'
	}

	for (var i=0; i < sccObjs.length; ++i)
	{
		var on=sccObjs[i].type === "segment"?(mmrwmer_LanguageRU?'Улица':"Street"):(mmrwmer_LanguageRU?'Название':"Name");
		message += ''
		         + (mmrwmer_LanguageRU?'Автор':'Author')+': [b]' + sccObjs[i].username + '[/b]\n'
		         + (mmrwmer_LanguageRU?'Тип':'Type')+': [b]' + GetTypeName(sccObjs[i].type) + '[/b]\n'
         + (sccObj.country=='Belarus'?'':(mmrwmer_LanguageRU?'Страна':'Country')+': [b]' + sccObjs[i].country + '[/b]\n')
		         + (mmrwmer_LanguageRU?'НП':'City')+': [b]' + NullToEmpty(sccObjs[i].city) + '[/b]\n'
		         + (sccObjs[i].poiaddress.length > 0?(mmrwmer_LanguageRU?'Адрес':'Address')+': [b]'+sccObjs[i].poiaddress+'[/b]\n':'')
		         + on+ ': [b]' + NullToEmpty(sccObjs[i].street) + '[/b]\n'
		         + (mmrwmer_LanguageRU?'Дата':'Date')+': [b]' + timeConverter(sccObjs[i].updatedOn).replace('+',' ') + '[/b]\n'
		         + (mmrwmer_LanguageRU?'Ссылка':'Permalink')+': [url]' + permalink + '&' + name_object + '=' + sccObjs[i].objid + '[/url]\n'
		         + (mmrwmer_LanguageRU?'Дополнительно':'Description')+': {' + NullToEmpty(sccObjs[i].description) + '\n}\n'
		         + '\n';
	}
	//if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + message);

	getId(formID + '-message').value=message;
	var now=new Date().getTime();
	now /= 1000;
	now = Math.floor(now);
	getId(formID + '-ct').value=now;
	getId(formID + '-lc').value=now;

	getId(formID).action="https://www.waze.com/forum/ucp.php?i=pm&mode=compose&action=post";
	getId(formID + '-subject').value=
		mmrwmer_LanguageRU?
			'[WME Request] Уточнение по правкам':
			'[WME Request] Question about map edits';

	if(mmrwmer_Debug) console.dir(getId(formID));

	getId(formID).submit();
	return true; // this forces to open in new tab!
}
// </WME Fancy permalink>


function mmrwmer_WazeBits()
{
//	if (typeof Waze === "undefined")
//		Waze=unsafeWindow.Waze;

	if (typeof Waze === "undefined")
		Waze=window.Waze;
}


function mmrwmer_HandCreateRequest()
{
	if ((typeof arguments[0]) === "object")
	{
		switch(arguments[0].type)
		{
			case 'click': // click button
			{
				var e=document.getElementById(arguments[0].id);
				if(e)
					e.click();

				break;
			}
		}
	}
}

function mmrwmer_initBindKey() {
	var Config =[
		{handler: 'MMRmmrwmerequest_Lock',     title: "Запрос на изменение уровня блокировки объекта", func:mmrwmer_HandCreateRequest , key:-1, arg:{type:'click',id:'mmrwmerBtn_lock'}},
		{handler: 'MMRmmrwmerequest_Join',     title: "Запрос на присоединение сегментов", func:mmrwmer_HandCreateRequest , key:-1, arg:{type:'click',id:'mmrwmerBtn_join'}},
		{handler: 'MMRmmrwmerequest_Dir',      title: "Запрос на изменение направления сегментов", func:mmrwmer_HandCreateRequest , key:-1, arg:{type:'click',id:'mmrwmerBtn_dir'}},
		{handler: 'MMRmmrwmerequest_Turn',     title: "Запрос на изменение разрешения поворотов", func:mmrwmer_HandCreateRequest , key:-1, arg:{type:'click',id:'mmrwmerBtn_turn'}},
		{handler: 'MMRmmrwmerequest_Closures', title: "Запрос на перекрытие сегментов", func:mmrwmer_HandCreateRequest , key:-1, arg:{type:'click',id:'mmrwmerBtn_closures'}},
		{handler: 'MMRmmrwmerequest_City',     title: "Запрос на создание/изменение НП", func:mmrwmer_HandCreateRequest , key:-1, arg:{type:'click',id:'mmrwmerBtn_cl'}},
	];
/*
Waze.loginManager.user.editableCountryIDs
186 - Russia
180 - Poland
123 - Latvia
37  - Belarus
129 - Lithuania
232 - Ukraine
*/
	if(Waze.loginManager.user.rank >= 4 || (Waze.loginManager.user.editableCountryIDs.indexOf(37) >= 0 && Waze.loginManager.user.rank >= 3)) // ??? Uzbekistan ???
	{
		Config.push({handler: 'MMRmmrwmerequest_CitySave', title: "Сохранить название НП", func:mmrwmer_HandCreateRequest , key:-1, arg:{type:'click',id:'mmrwmerA_cl'}});
	}

	for(var i=0; i < Config.length; ++i)
	{
		WMEKSRegisterKeyboardShortcut('MMR-WME-Requests', 'MMR-WME-Requests', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
	}

    WMEKSLoadKeyboardShortcuts('MMR-WME-Requests');

	window.addEventListener("beforeunload", function() {
		WMEKSSaveKeyboardShortcuts('MMR-WME-Requests');
	}, false);

}

function mmrwmer_FakeLoad()
{
	mmrwmer_WazeBits();

	if (typeof Waze === "undefined")
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Waze not found, retrying in 500ms...');
		setTimeout(mmrwmer_FakeLoad,500);
		return;
	}
	if (typeof Waze.selectionManager === "undefined")
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Waze.selectionManager not found, retrying in 500ms...');
		setTimeout(mmrwmer_FakeLoad,500);
		return;
	}
	if (typeof Waze.model === "undefined")
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Waze.model not found, retrying in 500ms...');
		setTimeout(mmrwmer_FakeLoad,500);
		return;
	}
	if (typeof Waze.loginManager === "undefined")
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Waze.loginManager not found, retrying in 500ms...');
		setTimeout(mmrwmer_FakeLoad,500);
		return;
	}
	if (typeof Waze.loginManager.user === "undefined")
	{
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'Waze.loginManager.user not found, retrying in 500ms...');
		setTimeout(mmrwmer_FakeLoad,500);
		return;
	}

	try {
		Waze.selectionManager.events.register("selectionchanged", null, mmrwmer_insertButton);
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'added event handler for selectionchanged');
	}
	catch (err) {
		if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'added event handler error: ' +err.name);
	}
	setTimeout(mmrwmer_initBindKey, 500);
}


function mmrwmer_Init() {
	if(mmrwmer_Debug) console.log('MMR WME Requests v.' + mmrwmer_Version + ': ' + 'init');
	setTimeout(mmrwmer_FakeLoad, 500);
}


function mmrwmer_bootstrap()
{
	mmrwmer_LanguageRU=I18n.locale === "ru"?true:false;

	mmrwmer_Debug      = __GetLocalStorageItem("MMRmmrwmer_Debug",'bool',false);
	WMELanguageRU   = __GetLocalStorageItem("MMRWMELanguageRU",'bool',false);
	mmrwmer_MapCenter  = __GetLocalStorageItem("MMRMMRmmrwmerequestMapCenter",'bool',false);
	mmrwmer_AddCounty  = true;//__GetLocalStorageItem("MMRmmrwmerequestAddCounty",'bool',false);
	MMRmmrwmerequestEmail = __GetLocalStorageItem("MMRMMRmmrwmerequestEmail",'string','');
	MMRmmrwmerequestCountry= __GetLocalStorageItem("MMRMMRmmrwmerequestCountry",'int',0);

	mmrwmer_Init();
}

mmrwmer_bootstrap();


function __GetLocalStorageItem(Name,Type,Def,Arr)
{
	//if (wme2GIS_debug) console.log("__GetLocalStorageItem(): Name="+Name+",Type="+Type+",Def="+Def+",Arr="+Arr);
	var tmp0=localStorage.getItem(Name);
	if (tmp0)
	{
		switch(Type)
		{
			case 'string':
				break;
			case 'bool':
				tmp0=(tmp0 === "true" || tmp0 === "1")?true:false;
				break;
			case 'int':
				tmp0=(!isNaN(parseInt(tmp0)))?parseInt(tmp0):0;
				break;
			case 'arr':
				if (tmp0.length > 0)
					if(!Arr[tmp0])
						tmp0=Def;
				break;
		}
	}
	else
		tmp0=Def;
	return tmp0;
}



// from: https://greasyfork.org/ru/scripts/16071-wme-keyboard-shortcuts (modify)
/*
when adding shortcuts each shortcut will need a uniuque name
the command to add links is mmrwmeregisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
	ScriptName: This is the name of your script used to track all of your shortcuts on load and save.
	ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
	ShortcutsHeader: this is the header that will show up in the keyboard editor
	NewShortcut: This is the name of the shortcut and needs to be uniuque from all of the other shortcuts, from other scripts, and WME
	ShortcutDescription: This wil show up as the text next to your shortcut
	FunctionToCall: this is the name of your function that will be called when the keyboard shortcut is presses
	ShortcutKeysObj: the is the object representing the keys watched set this to '-1' to let the users specify their own shortcuts.
	ShortcutKeysObj: The alt, shift, and ctrl keys are A=alt, S=shift, C=ctrl. for short cut to use "alt shift ctrl and l" the object would be 'ASC+l'
*/
function WMEKSRegisterKeyboardShortcut(a,b,c,d,e,f,g){try{I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members.length}catch(c){Waze.accelerators.Groups[a]=[],Waze.accelerators.Groups[a].members=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[a]=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].description=b,I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members=[]}if(e&&"function"==typeof e){I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members[c]=d,Waze.accelerators.addAction(c,{group:a});var i="-1",j={};j[i]=c,Waze.accelerators._registerShortcuts(j),null!==f&&(j={},j[f]=c,Waze.accelerators._registerShortcuts(j)),W.accelerators.events.register(c,null,function(){e(g)})}else alert("The function "+e+" has not been declared")}function WMEKSLoadKeyboardShortcuts(a){if(console.log("WMEKSLoadKeyboardShortcuts("+a+")"),localStorage[a+"KBS"])for(var b=JSON.parse(localStorage[a+"KBS"]),c=0;c<b.length;c++)try{Waze.accelerators._registerShortcuts(b[c])}catch(a){console.log(a)}}function WMEKSSaveKeyboardShortcuts(a){console.log("WMEKSSaveKeyboardShortcuts("+a+")");var b=[];for(var c in Waze.accelerators.Actions){var d="";if(Waze.accelerators.Actions[c].group==a){Waze.accelerators.Actions[c].shortcut?(Waze.accelerators.Actions[c].shortcut.altKey===!0&&(d+="A"),Waze.accelerators.Actions[c].shortcut.shiftKey===!0&&(d+="S"),Waze.accelerators.Actions[c].shortcut.ctrlKey===!0&&(d+="C"),""!==d&&(d+="+"),Waze.accelerators.Actions[c].shortcut.keyCode&&(d+=Waze.accelerators.Actions[c].shortcut.keyCode)):d="-1";var e={};e[d]=Waze.accelerators.Actions[c].id,b[b.length]=e}}localStorage[a+"KBS"]=JSON.stringify(b)}
/* ********************************************************** */

// from https://github.com/lgarron/clipboard.js/blob/master/clipboard.min.js
// АХТУНГ!!! если вызов в $.ajax, то ставим параметр "async: false,"
(function(f,c){"undefined"!==typeof module?module.exports=c():"function"===typeof define&&"object"===typeof define.amd?define(c):this[f]=c()})("clipboard",function(){if(!document.addEventListener)return null;var f={};f.copy=function(){function c(){d=!1;b=null;e&&window.getSelection().removeAllRanges();e=!1}var d=!1,b=null,e=!1;document.addEventListener("copy",function(c){if(d){for(var e in b)c.clipboardData.setData(e,b[e]);c.preventDefault()}});return function(g){return new Promise(function(k,f){d=!0;b="string"===typeof g?{"text/plain":g}:g instanceof Node?{"text/html":(new XMLSerializer).serializeToString(g)}:g;try{var n=document.getSelection();if(!document.queryCommandEnabled("copy")&&n.isCollapsed){var l=document.createRange();l.selectNodeContents(document.body);n.addRange(l);e=!0}if(document.execCommand("copy"))c(),k();else throw Error("Unable to copy. Perhaps it's not available in your browser?");}catch(p){c(),f(p)}})}}();f.paste=function(){var c=!1,d,b;document.addEventListener("paste",function(e){if(c){c=!1;e.preventDefault();var g=d;d=null;g(e.clipboardData.getData(b))}});return function(e){return new Promise(function(g,f){c=!0;d=g;b=e||"text/plain";try{document.execCommand("paste")||(c=!1,f(Error("Unable to paste. Pasting only works in Internet Explorer at the moment.")))}catch(m){c=!1,f(Error(m))}})}}();"undefined"===typeof ClipboardEvent&&"undefined"!==typeof window.clipboardData&&"undefined"!==typeof window.clipboardData.setData&&(function(c){function d(a,b){return function(){a.apply(b,arguments)}}function b(a){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof a)throw new TypeError("not a function");this._value=this._state=null;this._deferreds=[];l(a,d(f,this),d(k,this))}function e(a){var b=this;return null===this._state?void this._deferreds.push(a):void p(function(){var c=b._state?a.onFulfilled:a.onRejected;if(null===c)return void(b._state?a.resolve:a.reject)(b._value);var h;try{h=c(b._value)}catch(d){return void a.reject(d)}a.resolve(h)})}function f(a){try{if(a===this)throw new TypeError("A promise cannot be resolved with itself.");if(a&&("object"==typeof a||"function"==typeof a)){var b=a.then;if("function"==typeof b)return void l(d(b,a),d(f,this),d(k,this))}this._state=!0;this._value=a;m.call(this)}catch(c){k.call(this,c)}}function k(a){this._state=!1;this._value=a;m.call(this)}function m(){for(var a=0,b=this._deferreds.length;b>a;a++)e.call(this,this._deferreds[a]);this._deferreds=null}function n(a,b,c,h){this.onFulfilled="function"==typeof a?a:null;this.onRejected="function"==typeof b?b:null;this.resolve=c;this.reject=h}function l(a,b,c){var h=!1;try{a(function(a){h||(h=!0,b(a))},function(a){h||(h=!0,c(a))})}catch(d){h||(h=!0,c(d))}}var p=b.immediateFn||"function"==typeof setImmediate&&setImmediate||function(a){setTimeout(a,1)},q=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)};b.prototype["catch"]=function(a){return this.then(null,a)};b.prototype.then=function(a,c){var d=this;return new b(function(b,f){e.call(d,new n(a,c,b,f))})};b.all=function(){var a=Array.prototype.slice.call(1===arguments.length&&q(arguments[0])?arguments[0]:arguments);return new b(function(b,c){function d(e,g){try{if(g&&("object"==typeof g||"function"==typeof g)){var k=g.then;if("function"==typeof k)return void k.call(g,function(a){d(e,a)},c)}a[e]=g;0===--f&&b(a)}catch(l){c(l)}}if(0===a.length)return b([]);for(var f=a.length,e=0;e<a.length;e++)d(e,a[e])})};b.resolve=function(a){return a&&"object"==typeof a&&a.constructor===b?a:new b(function(b){b(a)})};b.reject=function(a){return new b(function(b,c){c(a)})};b.race=function(a){return new b(function(b,c){for(var d=0,e=a.length;e>d;d++)a[d].then(b,c)})};"undefined"!=typeof module&&module.exports?module.exports=b:c.Promise||(c.Promise=b)}(this),f.copy=function(c){return new Promise(function(d,b){if("string"!==typeof c&&!("text/plain"in c))throw Error("You must provide a text/plain type.");window.clipboardData.setData("Text","string"===typeof c?c:c["text/plain"])?d():b(Error("Copying was rejected."))})},f.paste=function(){return new Promise(function(c,d){var b=window.clipboardData.getData("Text");b?c(b):d(Error("Pasting was rejected."))})});return f});
/* ********************************************************** */
