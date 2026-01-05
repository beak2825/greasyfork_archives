// ==UserScript==
// @name                WME Requests
// @namespace           https://greasyfork.org/ru/scripts/5085-wme-requests
// @description         Opens the Requests module with precompiled fields to submit an request
// @include             https://*.waze.com/editor*
// @include             https://*.waze.com/*/editor*
// @include             https://*.waze.com/map-editor*
// @include             https://*.waze.com/beta_editor*
// @include             https://fias.nalog.ru/*
// @grant               none
// @author              skirda
// @version             2.15.2.0
// @downloadURL https://update.greasyfork.org/scripts/5085/WME%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/5085/WME%20Requests.meta.js
// ==/UserScript==

var wmer_Version = '2.15.2.0';

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
		fr:'https://docs.google.com/forms/d/1QzvF3-lH8MuuEaSw0GA6LgLW62EiSHzQXBmG5-rQdIQ/viewform',     // форма
		dr:'https://docs.google.com/spreadsheet/ccc?key=0AtcEFFDNcic4dEE2UFh5X0lDdlRZbno3YVFYUkg0Unc',   // таблица

		cs:'https://script.google.com/macros/s/AKfycbzqA15-fy4g4StdRUmnuMj9z6rJ56gQPjCYpgCMni7h/exec', // change state

		ttst:'Marussia',
		ttsd:'https://docs.google.com/spreadsheets/d/16rSWBWfRi5gXhywAlTGu6O3c3kH0B49ksp56hdh-xlI', // TTS таблица               RU
		ttsf:'https://docs.google.com/forms/d/e/1FAIpQLSfUdwm1Jlv5h_tauxcWZRDnFSOv2QR8vzi2XcjWPe-TKnxzMQ/viewform' // TTS форма  RU
	},
	{
		c:'Belarus',
		cc:'by',
		al:'be_BY', // ru_BY

		// Запрос на добавление населенного пункта
		f:'https://docs.google.com/forms/d/1a7g7ONWOIHfxr8ZEXKxRXUkIxFF7xFb-2uX4LlydWXo/viewform',
		d:'https://docs.google.com/spreadsheets/d/1uuRY8ib5h_8xMfpzgXG2N78foMtftUNkPzJxP56mDXI',
		l:'https://script.google.com/macros/s/AKfycbz8_xLefn_06nLRsfwnupviEEStCXfttg777KryBMnD/exec',
		// WME Request (ответы)
		fr:'https://docs.google.com/forms/d/1a9wXzngDV_KGoYZC65X_-xAUfcyA7vgftaEBC9aHAMM/viewform',
		dr:'https://docs.google.com/spreadsheets/d/1gge9vlSuDrxkzH0ubiRGcx3VOawYA-Hub7EZzP94siI',

		cs: '', // change state

		ttst:'Marussia',
		ttsd:'https://docs.google.com/spreadsheets/d/16rSWBWfRi5gXhywAlTGu6O3c3kH0B49ksp56hdh-xlI', // TTS таблица               RU
		ttsf:'https://docs.google.com/forms/d/e/1FAIpQLSfUdwm1Jlv5h_tauxcWZRDnFSOv2QR8vzi2XcjWPe-TKnxzMQ/viewform' // TTS форма  RU
	},
	{
		c:'Uzbekistan',
		cc:'uz',
		al:'uz_UZ', //

		// Запрос на добавление населенного пункта
		f:'https://docs.google.com/forms/d/1wr3Bjkm1SKbThThdZ0ea80iriuoX9JJ4xRvutXcPGws/viewform', //
		d:'https://docs.google.com/spreadsheets/d/1sjniZzrQT5ygaZaMUzXKeoPFweASF7S7QPebNrHLo0Y', //
		l:'https://script.google.com/macros/s/AKfycbwKbjrauFor_XH4woPWrW9mkqvYCGzGXFoi6saWync/exec', //
		// WME Request (ответы)
		fr:'https://docs.google.com/forms/d/12oEAxVdrQZPUwHWK2AxKH0pIQwzG9UagRO0_ehRoaa4/viewform', //
		dr:'https://docs.google.com/spreadsheets/d/1wDYm7BKOpktL7MACucV-p94n-6M4HuyJy8HGntbumY4', //

		cs: '', // change state

		ttst:'Marussia',
		ttsd:'https://docs.google.com/spreadsheets/d/16rSWBWfRi5gXhywAlTGu6O3c3kH0B49ksp56hdh-xlI', // TTS таблица               RU
		ttsf:'https://docs.google.com/forms/d/e/1FAIpQLSfUdwm1Jlv5h_tauxcWZRDnFSOv2QR8vzi2XcjWPe-TKnxzMQ/viewform' // TTS форма  RU
	},
	{
		c:'Kazakhstan',
		cc:'kz',
		al:'kk_KZ', // ru_KZ

		// Запрос на добавление населенного пункта
		f:'https://docs.google.com/forms/d/1zdqseCwkJqxkmb7w9geTcKI-VKA5dNl-QKvuIw1rObg/viewform',//
		d:'https://docs.google.com/spreadsheets/d/1rmmxyNOh7zSYU0U9v0nN0yx8ZOW9Vr83YepmC3vt8ms', //
		l:'https://script.google.com/macros/s/AKfycbyvmneTt9c8HuwuDevm5tGB8vBvkL9lHu9Bl_JWrNo/exec', //
		// WME Request (ответы)
		fr:'https://docs.google.com/forms/d/1Ap4i0pSbBc7OKfggSao8XmirjdlxQWIBEVQ1Cq1WYyQ/viewform', //
		dr:'https://docs.google.com/spreadsheets/d/1Vl1sXOCRK4eTCihfHJPB5oI2nDu9g7cVIu0gpcxI0-g', //

		cs: '', // change state

		ttst:'Marussia',
		ttsd:'https://docs.google.com/spreadsheets/d/16rSWBWfRi5gXhywAlTGu6O3c3kH0B49ksp56hdh-xlI', // TTS таблица               RU
		ttsf:'https://docs.google.com/forms/d/e/1FAIpQLSfUdwm1Jlv5h_tauxcWZRDnFSOv2QR8vzi2XcjWPe-TKnxzMQ/viewform' // TTS форма  RU
	},
	{
		c:'Ukraine',
		cc:'ua',// uk
		al:'uk_UA',

		// Запрос на добавление населенного пункта
		f:'https://docs.google.com/forms/d/13BWQv9Kvwzii8IDyCBfztLqBAoQnI-dDLL4exTv4DOw/viewform',//
		d:'https://docs.google.com/spreadsheets/d/1C6P-VmSTR2KTS9LMIFZFQyf7r57ki9Mzi7B-HNwjBbM', //
		l:'https://script.google.com/macros/s/AKfycby2OUnHmGkbTNeJDBcXu4zZ6eyNngh6XHpkcU_tsoVSmHn-NzY/exec', //
		// WME Request (ответы)
		fr:'https://docs.google.com/forms/d/1VLcIJAFKrLumCINck6bWKJAXvHiJPriZKam3k309--k/viewform', //
		dr:'https://docs.google.com/spreadsheets/d/1_R8f_0_j57gU7EYKYBCaiIWi-vKWsPgtM-xuEBNGfks', //

		cs: '', // change state

		ttst:'Марічка',
		ttsd:'https://docs.google.com/spreadsheets/d/1B2xEnhZmiJa1rUAdrQa-kbBZANyU3uxBLWoNzlm3_4o', // TTS таблица               UA
		ttsf:'https://docs.google.com/forms/d/e/1FAIpQLSepm_CwbQEyAIr-w8DqCXZsSgyEjSJIPG1AAigvOxwmXayADg/viewform' // TTS форма  UA
	},
	{
		c:'Lithuania',
		cc:'lt',
		al:'lt_LT',

		// Запрос на добавление населенного пункта
		f:'https://docs.google.com/forms/d/e/1FAIpQLSdiCSLrUX_mWGPzkCDzqmb_qvfY66Qgczz-AlvGN2ZLM7T5vg/viewform',//
		d:'https://docs.google.com/spreadsheets/d/1fKYvSYi2Hr8C8tiOVKr3IvpWvuwNtlm-kEBvsHSzljA', //
		l:'https://script.google.com/macros/s/AKfycbyt6joK8cqU3nLZwvi2DlFEGd9QjV0Sw5WbSuGrLjhK9fHBUO9Y/exec', //
		 //https://script.google.com/macros/s/AKfycbztAHmVTR94oKtNo4pbx2ZCg30sjhYD59qMvQsKp1ob/dev
		// WME Request (ответы)
		fr:'https://docs.google.com/forms/d/e/1FAIpQLSf7karoWLOdSqthcdVpEG0VohJOZ8g33fvzRifMZMAun78nOg/viewform', //
		dr:'https://docs.google.com/spreadsheets/d/1TkvBW7Zc3thL9w44Hs42LVquhivibQwMrdEkCiLlSuM', //

		cs: '', // change state

		ttst:'Marussia',
		ttsd:'https://docs.google.com/spreadsheets/d/16rSWBWfRi5gXhywAlTGu6O3c3kH0B49ksp56hdh-xlI', // TTS таблица               RU
		ttsf:'https://docs.google.com/forms/d/e/1FAIpQLSfUdwm1Jlv5h_tauxcWZRDnFSOv2QR8vzi2XcjWPe-TKnxzMQ/viewform' // TTS форма  RU
	},
	{
		c:'Azerbaijan',
		cc:'az',
		al:'az-AZ',

		// Запрос на добавление населенного пункта
		f:'https://docs.google.com/forms/d/e/1FAIpQLSceifAdBt5c58QOkuoTQUdi_ZJPG3LrM8ifb7veyBYinojD0A/viewform',//
		d:'https://docs.google.com/spreadsheets/d/1FFjON6qvEtpArEjEgy2oc11ua_q_GCddS6VQYQcQPWg', //
		l:'https://script.google.com/macros/s/AKfycbxgKPsxEwGviJnVBJyq53Uv8u__saiYNqnXhv0s54UOUL-L_utB/exec', //
		 //https://script.google.com/macros/s/AKfycbztAHmVTR94oKtNo4pbx2ZCg30sjhYD59qMvQsKp1ob/dev
		// WME Request (ответы)
		fr:'https://docs.google.com/forms/d/e/1FAIpQLSdMzsss3xWRUtvtf_Uf58xoeSnKVQRq25mQ8QYeEP7pE8kWig/viewform', //
		dr:'https://docs.google.com/spreadsheets/d/18RYz0iX5AUBzn7Fm6GY7VwTctM0x_Tb9SjobJz6wiBQ', //

		cs: '', // change state

		ttst:'Marussia',
		ttsd:'https://docs.google.com/spreadsheets/d/16rSWBWfRi5gXhywAlTGu6O3c3kH0B49ksp56hdh-xlI', // TTS таблица               RU
		ttsf:'https://docs.google.com/forms/d/e/1FAIpQLSfUdwm1Jlv5h_tauxcWZRDnFSOv2QR8vzi2XcjWPe-TKnxzMQ/viewform' // TTS форма  RU
	}
);

//var wner_TTS_d="https://docs.google.com/spreadsheets/d/16rSWBWfRi5gXhywAlTGu6O3c3kH0B49ksp56hdh-xlI";
//var wner_TTS_f="https://docs.google.com/forms/d/e/1FAIpQLSfUdwm1Jlv5h_tauxcWZRDnFSOv2QR8vzi2XcjWPe-TKnxzMQ/viewform";


// через солько дней вернуть лок обратно
var wmer_CountDays = 5;
var wmer_UserCache = new Array();
var wmer_LanguageRU = false;
var wmer_Debug = false;
var wmer_MousePos = '';
var wmer_MapCenter = false;
var wmer_AddCounty=false;
var WMERequestEmail='';
var WMERequestCountry=0;
var wmer_SendDiscord = false;

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


function wmer_getUsername()
{
	var thisUser = W.loginManager.user;
	if (thisUser === null)
	{
		alert(wmer_LanguageRU?'Невозможно получить имя текущего пользователя':'Nobody\'s logged in.');
		return "";
	}
	return W.loginManager.user.userName;
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

function GetWMESelected()
{
	return W.selectionManager.getSelectedFeatures();
}

function wmer_getCCSD(segment) // BUBBUB!!! need use "hasOwnProperty" or "in"
{
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'start wmer_getCCSD');

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
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': oID=' + oID);

		if(segment.attributes.hasOwnProperty('updatedOn'))
			updatedOn=segment.attributes.updatedOn;
		else
			updatedOn=segment.attributes.createdOn;

		if (segment.attributes.hasOwnProperty('primaryStreetID'))
		{
//W.model.streets.get(GetWMESelected()[0].model.attributes.primaryStreetID).cityID
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'found street');
			var sID=segment.attributes.primaryStreetID;
			if (sID)
			{
				var streetsObj = W.model.streets.getObjectById(sID);
				if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'typeof streetsObj='+(typeof streetsObj));
				if (typeof streetsObj !== "undefined")
				{
					cityID=streetsObj.cityID;
					streetName=streetsObj.name;
				}
			}
		}
		else if (typeName === "camera")
		{
//GetWMESelected()[0].model.model.cities.additionalInfo[0].id
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'found camera');
			streetName=segment.typeName;
			description= "\n  "+(wmer_LanguageRU?'Скорость':'Speed')+": "+segment.attributes.speed
						+"\n  "+(wmer_LanguageRU?'Подтверждено':'Approved')+": "+segment.attributes.validated
						+"\n  "+(wmer_LanguageRU?'Тип':'Type')+": "+I18n.translations[wmer_LanguageRU?"ru":window.I18n.currentLocale()].edit.camera.fields.type[segment.attributes.type];
					//  +"\n  "+(wmer_LanguageRU?'Азимут':'Azymuth')+": "+segment.attributes.azymuth
			//if(segment.attributes.hasOwnProperty('updatedOn'))
				cityID=segment.model.cities.additionalInfo[0].id;
			if (cityID == null)
				cityID="";
		}
		else if (typeName === "node")
		{
//GetWMESelected()[0].model.segments.topCityID
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'found node');
			cityID=''+segment.model.segments.topCityID;

			if (cityID == null)
				cityID="";
			description="\n  count segment(s)="+segment.attributes.segIDs.length;
		}
		else if(typeName === "bigJunction")
		{
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'found bigJunction');
			cityID=''+segment.model.segments.topCityID;
			if (cityID == null)
				cityID="";
			description="\n  count segment(s)="+segment.attributes.segIDs.length;
		}
		else // "venue"
		{
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'found POI ('+typeName+')');
//W.model.streets.get(GetWMESelected()[0].attributes.streetID).cityID
			let sID=segment.attributes.streetID;
			if (sID == null)
				cityID="";
			else
				cityID=W.model.streets.getObjectById(sID).cityID;

			if (sID == null)
				cityID="";

			if (cityID !== "")
			{
				var cityObj=W.model.cities.getObjectById(cityID);
				if (typeof cityObj !== "undefined")
				{
					countryID=cityObj.getAttributes().countryID;
					stateID=cityObj.getAttributes().stateID;
					cityName=cityObj.getAttributes().name;

					var stateObj=W.model.states.getObjectById(stateID);
					if (typeof stateObj !== "undefined")
						stateName=stateObj.getAttributes().name;

					var countriesObj=W.model.countries.getObjectById(countryID);
					if(wmer_Debug) console.log(countriesObj);
					if (typeof countriesObj !== "undefined")
						countryName = countriesObj.name;
				}
			}

			if (typeof GetWMESelected()[0].model.attributes.categories === "undefined")
			{
				if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'categories=undefined');
				if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'segment.attributes.description='+segment.attributes.description);

			}
			else
			{
				var vcats=segment.attributes.categories;
				var arrvcats=[];
				for(var i=0; i < vcats.length; ++i)
				{
					//if(wmer_Debug) console.log("segment.attributes.categories["+i+"]='"+segment.attributes.categories[i]+"'")
					arrvcats.push(window.I18n.translations[wmer_LanguageRU?"ru":window.I18n.currentLocale()].venues.categories[vcats[i]]);
					//if(wmer_Debug) console.log("segment.attributes.categories["+i+"]='"+segment.attributes.categories[i]+"'")
				}
				description='\n  '+(wmer_LanguageRU?'Категории':'Categories')+': '+(arrvcats.length > 0?arrvcats.join(';')+'.':'')+'\n  ' + segment.attributes.description;
				//if(wmer_Debug) console.log(description)
				arrvcats=[];


				if (segment.attributes.categories.indexOf("GAS_STATION") != -1) // Gas Station
				{
					typeName="gas_station";
					description="\n  "+(wmer_LanguageRU?'Брэнд':'Brand')+": "+segment.attributes.brand
							+ "\n  "+(wmer_LanguageRU?'Адрес':'Address')+": " + segment.attributes.address
							+ "\n  "+(wmer_LanguageRU?'Описание':'Description')+": " + segment.attributes.description;
				}
			}

			if(segment.attributes.hasOwnProperty('streetID'))
			{
				var name=W.model.streets.getObjectById(segment.attributes.streetID).name;
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
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': cityID=' + cityID);
			let cityObj=W.model.cities.getObjectById(cityID);
			if (typeof cityObj !== "undefined")
			{
				countryID=cityObj.attributes.countryID;
				stateID=cityObj.attributes.stateID;
				cityName=cityObj.attributes.name;

				let stateObj=W.model.states.getObjectById(stateID);
				if (typeof stateObj !== "undefined")
					stateName=stateObj.name;

				let countriesObj=W.model.countries.getObjectById(countryID);
				if(wmer_Debug) console.log(countriesObj);
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
					if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'Do not PM Admin!');
				}
			}

			userName=W.model.users.getObjectById(userID).userName;
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'userName='+userName);
		}
		else
			userID="-1";

		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'userID=' +userID);

	}
	catch (err) {
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': error['+err.columnNumber+','+err.lineNumber+']: ' +err.name);
	}

	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'return from wmer_getCCSD');
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


function wmer_userRank(segment)
{
	var usrRank = 0;
    /*
	if (segment.attributes.lockRank)
	{
		var updatedBy = W.model.users.getObjectById(segment.attributes.updatedBy);
		return updatedBy != null ? updatedBy.rank : 0;
	}
	return 0;
    */
    if (GetWMESelected()[0].model.attributes.hasOwnProperty('lockRank'))
    	return segment.attributes.lockRank;
	else
		return 0;
}

//It returns the maximum lock level
function wmer_GetLevel() {
	//attributes.rank dovrebbe essere il road rank
	var sel = GetWMESelected();
	var maxR = wmer_userRank(sel[0].model);

	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'wmer_GetLevel() maxR='+maxR);
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'wmer_GetLevel() sel.length='+sel.length);

	for (let i = 1; i < sel.length; i++)
	{
		if (maxR == 5)
		{
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'wmer_GetLevel() return 6');
			return 6;
		}
		var usrRank = wmer_userRank(sel[i].model);
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'wmer_GetLevel() usrRank='+usrRank);
		if (usrRank > maxR) {
			maxR = usrRank;
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'wmer_GetLevel() '+maxR);
		}
	}
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'wmer_GetLevel() return [maxR + 1] = '+(maxR + 1));
	return maxR + 1;
}

// получить данные имени НП у OSM
function WmeR_GetCityFromOSM(ll,zoom,country)
{
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'WmeR_GetCityFromOSM([lat='+ll.lat+',lon='+ll.lon+'],'+zoom+',"'+country+'")');
	var cityName='';
	var country_code='';
	var address_json='';

	if (country === '')
	{
		if (WMERequestCountry >= 0 && WMERequestCountry < CL.length)
			country=CL[WMERequestCountry].c;
    }
    zoom += 7;
    var url = 'https://nominatim.openstreetmap.org/reverse';
    var data = {
        "lat": ll.lat,
        "lon": ll.lon,
        "zoom": zoom,
		"format": "json",
		"addressdetails": 1,
        "countrycodes": (WMERequestCountry >= 0 && WMERequestCountry < CL.length?CL[WMERequestCountry].cc:"ru"),
        "accept-language": (WMERequestCountry >= 0 && WMERequestCountry < CL.length?CL[WMERequestCountry].al:"ru_RU")
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
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'WmeR_GetCityFromOSM(): json='+json);
            if (json.display_name !== undefined) {
                var li = '';
				if(wmer_Debug) console.dir(json);
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

				if (wmer_AddCounty && li.length > 0 && json.address.county !== undefined) {
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
						if(wmer_Debug) console.dir(json.address);
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

				if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'WmeR_GetCityFromOSM(): li='+li);

                //$('#topbar-container .topbar .location-info-region .alt-location-info').html(alispan);
                cityName=li;
            }
		}
	});

	return {cityName:cityName,country_code:country_code,address_json:address_json};
}


function PtInPoly(x, y, components)
{
	let npol = components.length;
	let jj = npol - 1;
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

function click_WMERequest() {
	var RenamePref="";

	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'click_WMERequest()::Action: '+this.id);
	if (typeof W.selectionManager === "undefined")
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'W.selectionManager not found');
		return;
	}
	if (GetWMESelected().length == 0)
	{
		alert(wmer_LanguageRU?'Нет выделенных объектов':'No selected segments.');
		return;
	}
	if (GetWMESelected().length < 2 && this.id === 'wmerBtn_join')
	{
		alert(wmer_LanguageRU?'Вы должны выделить 2 сегмента':'You must select 2 segments.');
		return;
	}

	var username = wmer_getUsername();
	var sccObj = wmer_getCCSD(GetWMESelected()[0].model);
	if(wmer_Debug) console.log("sccObj="+JSON.stringify(sccObj));
	if(sccObj.city && sccObj.city.length > 0)
		RenamePref="Rename: '" + sccObj.city + "' => '";

	var lockLevel = wmer_GetLevel();
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'lockLevel= '+lockLevel);
	if (lockLevel == 1 && this.id == 'wmerBtn_lock')
	{
		alert(wmer_LanguageRU?'Выбранные сегменты уже разблокированы':'Selected segments are already unlocked');
		return;
	}

	var normalizedLevel=W.loginManager.user.normalizedLevel;
	//normalizedLevel=2;
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'My level: '+normalizedLevel);
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'Lock level: '+lockLevel);

	if (lockLevel <= normalizedLevel && this.id == 'wmerBtn_lock') {
		alert(wmer_LanguageRU?'Выбранные сегменты имеют доступный вам уровень блокировки':'Selected segments have a lock level that is less or equal to yours');
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

	var permalink = wmer_generate_permalink();

	// попытка центрировать...
	var urPos;
	if(!wmer_MapCenter) //???
		urPos=new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
	else
	{
		var wmeSelected=GetWMESelected();
		urPos=new OpenLayers.LonLat(
			wmeSelected[0].geometry.bounds.left+(wmeSelected[0].geometry.bounds.right-wmeSelected[0].geometry.bounds.left)/2,
			wmeSelected[0].geometry.bounds.top-(wmeSelected[0].geometry.bounds.top-wmeSelected[0].geometry.bounds.bottom)/2
		);
	}
	urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));

	var venues0='';
	if(getQueryString(permalink, 'venues') != -1)
		venues0="&venues=" + getQueryString(permalink, 'venues');
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'venues0: '+venues0);

	// https://www.waze.com/editor/?env=row&lon=36.11483&lat=53.96670&zoom=4&marker=yes
	var segments0='';
	if(getQueryString(permalink, 'segments') != -1)
		segments0="&segments=" + getQueryString(permalink, 'segments');
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'segments0: '+segments0);


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

	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'permalink=' + permalink);
    var permalinkDiscord = permalink5;
	permalink  = preparePermalink(permalink);
	permalink5 = preparePermalink(permalink5);

	//You can get entry numbers in google stylesheet: "Answers->Get precompiled URL"
	var curDate=new Date();
	curDate.setDate(curDate.getDate() + wmer_CountDays);

	var action="";
	switch(this.id)
	{
		case 'wmerBtn_lock':
			action='lock';
			break;
		case 'wmerBtn_join':
			action='join';
			break;
		case 'wmerBtn_dir':
			action='direction';
			break;
		case 'wmerBtn_turn':
			action='turn';
			break;
		case 'wmerBtn_closures':
			action='closures';
			break;

	}

	function zero2(d){
		if((""+d).length == 1)
			d="0" + "" + d;
		return d;
	}

	// для автозаполнения имени НП в форме
	var osmName=WmeR_GetCityFromOSM(urPos,parseInt(getQueryString(permalink50, 'zoom')),sccObj.country);

	var suffix="";
	var suffixCS="";

	if(sccObj.country === '')
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': sccObj.country=""; work with osmName!!!');
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
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': idCL = ' +idCL + ', sccObj.countryName='+sccObj.country);
		return;
	}

	if(this.id === 'wmerBtn_tts')
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
			'&entry.846152130=' + WMERequestEmail +
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


	if(wmer_Debug) console.log("--- osmName & sccObj ---");
	if(wmer_Debug) console.log(osmName);
	if(wmer_Debug) console.log(sccObj);

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
			'&entry.1797072526=' + WMERequestEmail +
			'&entry.571885954='+curDate.getUTCFullYear()+'-'+zero2(curDate.getUTCMonth()+1)+'-'+zero2(curDate.getUTCDate()) +
			'';

	// CL: always zoom = 4
	var urlCL = CL[idCL].f +
			'?entry.1109766685=' + username +
			'&entry.1785513403=' + WMERequestEmail +
			'&entry.1300384005=' + permalink5.replace(/zoom\%3D([0-9]+)\%26/,"zoom%3D4%26") +
			'&entry.1967623256=' + RenamePref+ sccObj.city + suffix + (RenamePref.length>0?"'":"") +
			'&entry.1393986642=' + sccObj.stateID +
//			'&entry.address_json=' + JSON.stringify(osmName.address_json) +
			'';

	if (this.id == 'wmerA_cl') // доп проверка
	{
		if (sccObj.username === '' || sccObj.city === '' || sccObj.cityID === '')
		{
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ALERT!!! ' + 'sccObj.username=',sccObj.username,"sccObj.city=",sccObj.city,"sccObj.cityID=",sccObj.cityID);
			alert(wmer_LanguageRU?"Внимание! Не полные данные (UserName, City или CityID). Сохранение не возможно.":"Attention! UserName, City or CityID ==> empty. Saving is not possible.");
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
			'&p2=' + WMERequestEmail +
			'&p3=' + permalink5 +
			'&p4=' + sccObj.city + ': изменить регион' +
			'&p5=' + sccObj.stateID +
			'&p6=' + sccObj.cityID +
			'';

	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'urlL5=' + urlL5);

	if(this.id === 'wmerA_cl')
	{
		if(sccObj.city === null || sccObj.city === '')
		{
			alert(wmer_LanguageRU?"Внимание! Имя НП пустое. Сохранение не возможно.":"Attention! The name of the city is empty. Saving is not possible.");
			return;
		}
	}

	if(this.id === 'wmerCS_cl')
	{
		if(urlCS === null || sccObj.stateName === null || sccObj.stateName === '')
		{
			alert(wmer_LanguageRU?"Внимание! Имя Района пустое. Сохранение не возможно.":"Attention! The name of the state is empty. Saving is not possible.");
			return;
		}
	}

    if (wmer_SendDiscord && !(this.id == 'wmerBtn_cl' || this.id == 'wmerA_cl' || this.id == 'wmerCS_cl'))
    {
        SendMessageToDiscord(1,"WME Request from @"+username+"\n"+action+" ("+sccObj.country+")"+": " +permalinkDiscord+"\nMax Lock Level = "+wmer_GetLevel());
    }

	window.open(this.id == 'wmerBtn_cl'?urlCL:(this.id == 'wmerA_cl'?urlL5:(this.id == 'wmerCS_cl'?urlCS:url)), '_blank');
}

function SendMessageToDiscord(chanel,msg)
{
    var url;
//https://discordapp.com/channels/378452611621191682/381408318624628738 - tts-marussia
    switch(chanel)
    {
        case 1:
            //url='https://discordapp.com/api/webhooks/379735358440472578/mmOSttTGc9lmURBGssDJICODzibzVLw8HKB70_BehPV0d_Pbi8luspMsWdz3VlEyczX9'; // lipetsk
            url='https://discordapp.com/api/webhooks/475921451791155231/oIKmOQCS0Ml--4diyS32tYDRC0AbiKu_OVoHdlz2C5b20lfKeB0TnARobWeH5KrXlKE0'; // Order
            break;
        default:
            url="";
            break;
    }
    if (url != "")
    {
        $.ajax({
            type: 'POST',
            url: url,
            contentType: 'application/json',
            data: JSON.stringify({
                username: 'WME Request Bot',
                avatar_url: 'https://cdn.discordapp.com/avatars/475921451791155231/597a85c13b8cb5707c34fef291f85832.png',
                content: msg,
            }),
            success: function (data) { },
            error: function (data) {
                if(wmer_Debug) console.log("from Discord:",data.responseText);
            }
        });
    }
}


function getQueryString(link, name)
{
	if (link.indexOf( name + '=' ) <= 0)
		return -1;
	var pos = link.indexOf( name + '=' ) + name.length + 1;
	var len = link.substr(pos).indexOf('&');
	return (len == -1)?link.substr(pos):link.substr(pos,len);
}

function wmer_generate_permalink() {
  	var wcp=document.getElementsByClassName('WazeControlPermalink');
  	for(var i=0; i < wcp.length; ++i)
  		for (var j=0; j < wcp[i].getElementsByTagName('a').length;++j)
  		{
  			var href=wcp[i].getElementsByTagName('a')[j].href;
			if (href.indexOf(".waze.com/") > 0 && href.indexOf("/editor") > 0)
			{
				// kill "/ru/", kill "layers"
				href=href.replace("/ru/","/").replace(/layers=([0-9]+)\&/,"") + "&marker=yes";
				if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'href=' + href);
				return href;
			}
		}
	return "";
}

function CreateID()
{
	return 'WME-Request-' + wmer_Version.replace(/\./g,"-");
}


function wmer_insertButton(z)
{
	//if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'wmer_insertButton()',GetWMESelected().length);
	/*{
		var permalink=wmer_generate_permalink();
		var p = document.getElementsByClassName('WazeControlMousePosition')[0].lastChild.innerHTML.split(' ');
		permalink=permalink.replace(/#/g, "").replace(/&lat=([0-9\.]+)/g, '&lat='+p[1]).replace(/&lon=([0-9\.]+)/g, '&lon='+p[0]);
	}*/

//	if(document.getElementById(CreateID()) != null)
//		document.getElementById(CreateID()).setAttribute('style', 'display:'+(W.selectionManager && GetWMESelected().length == 0?'none':'')+';');

	var wmeSelected=GetWMESelected();
	if(wmeSelected.length <= 0)
		return;

	if (typeof wmeSelected[0].model === "undefined")
		return;

	switch(wmeSelected[0].model.type)
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
      if (wmeSelected[0].model.type === "venue")
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
				var v_id=wmeSelected[0].model.attributes.id;
				if (typeof W.model.venues.getObjectById(v_id).geometry.getGeodesicArea === "undefined")
					area_poi.innerHTML="";
				else
				{
					var square=W.model.venues.getObjectById(v_id).geometry.getGeodesicArea(W.map.getProjectionObject());
					area_poi.style=(square < 650)?"color: red;":"color: black;";
					area_poi.innerHTML="Площадь: " + square.toFixed(2) + " м&#178;";
				}
			}

		}
        /*
		else if (wmeSelected[0].model.type === "camera") // camera-edit-general
		{
      		var cam=document.getElementsByClassName('additional-attributes list-unstyled side-panel-section');
      		if (cam && cam.length > 0)
      		{
	      		var camDate = wmeSelected[0].model.attributes.updatedOn;
	      		if (!camDate)
	      			camDate = wmeSelected[0].model.attributes.createdOn;
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


	var sccObj = wmer_getCCSD(wmeSelected[0].model);
	if(wmer_Debug) console.dir(sccObj);

	var urPos;
	if(wmer_MapCenter)
		urPos=new OpenLayers.LonLat(W.map.getCenter().lon,W.map.getCenter().lat);
	else
	{
		urPos=new OpenLayers.LonLat(
			wmeSelected[0].geometry.bounds.left+(wmeSelected[0].geometry.bounds.right-wmeSelected[0].geometry.bounds.left)/2,
			wmeSelected[0].geometry.bounds.top-(wmeSelected[0].geometry.bounds.top-wmeSelected[0].geometry.bounds.bottom)/2
		);
	}
	urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));

	var osmName=WmeR_GetCityFromOSM(urPos,parseInt(getQueryString(wmer_generate_permalink(), 'zoom')),sccObj.country);
	if(sccObj.country === '')
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': sccObj.country=""; work with osmName!!!');
		// попытка центрировать...
		//var osmName=WmeR_GetCityFromOSM(urPos,parseInt(getQueryString(wmer_generate_permalink(), 'zoom')),sccObj.country);
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

	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': sccObj.cityID=' + sccObj.cityID + ', sccObj.country='+sccObj.country);
	var idCL=(sccObj.country=='Russia'?0:(sccObj.country=='Belarus'?1:(sccObj.country=='Uzbekistan'?2:(sccObj.country=='Kazakhstan'?3:(sccObj.country==='Ukraine'?4:(sccObj.country==='Lithuania'?5:(sccObj.country==='Azerbaijan'?6:-1)))))));
	if(idCL == -1)
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': idCL = ' +idCL + ', sccObj.country='+sccObj.country);
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
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': typeof navTabs=' + (typeof navTabs));
		if (typeof navTabs !== "undefined")
		{
			var tabContent = getElementsByClassName('tab-content', userTabs)[0];

			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': typeof tabContent=' + (typeof tabContent));
			if (typeof tabContent !== "undefined")
			{
				let newtab = document.createElement('li');
				newtab.innerHTML = '<a href="#' + CreateID() + '" id="pwmerequest" data-toggle="tab">'+(wmer_LanguageRU?'Запросы':'Requests')+'</a>';
				navTabs.appendChild(newtab);

				var padding="padding:5px 9px";
				var html= /*'<hr>'+*/
					'<div class="form-group">'+
					'<h4>WME Requests <sup>' + wmer_Version + '</sup>&nbsp;<sub><a href="https://greasyfork.org/ru/scripts/5085-wme-requests" title="Link" target="_blank"><span class="fa fa-external-link"></span></a></sub></h4>'+
					'<form class="attributes-form side-panel-section" action="javascript:return false;">'+
					'<div class="controls-container">';

				// --- Общее ---
				html += ''+
					'<div class="form-group">'+
					'<label class="control-label">' + (wmer_LanguageRU?'Общие':'Common') +'</label>' +
					'<label><a href="' + CL[idCL].dr + '" id="wmerA_dr" target="_gdocRequest" title="' + sccObj.country + '">' + (wmer_LanguageRU?'Таблица':'Table') +'</a></label> | '+
					'<label><a href="https://www.waze.com/forum/viewtopic.php?p=662218#p662218" title="City Lock ' + wmer_Version + '" target="_blank">' + (wmer_LanguageRU?'О проекте':'About') +'</a></label></br>'+
					'<button id="wmerBtn_lock" class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(wmer_LanguageRU?'Отправить запрос на изменение уровня блокировки объектов':'Send a request to lock/unlock segment(s)')+
						'"><i class="fa fa-unlock"></i>&nbsp;Lock</button>&nbsp;' +
					'<button id="wmerBtn_join" class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(wmer_LanguageRU?'Отправить запрос на присоединение сегментов':'Send a request to join several segments')+
						'"><i class="fa fa-cogs"></i>&nbsp;Join</button>&nbsp;' +
					'<button id="wmerBtn_dir"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(wmer_LanguageRU?'Отправить запрос на изменение направления движения сегментов':'Send a request to change the direction of segment(s)')+
						'"><i class="fa fa-random"></i>&nbsp;Dir</button>&nbsp;' +
					'<button id="wmerBtn_turn"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(wmer_LanguageRU?'Отправить запрос на изменение разрешения поворотов':'Send a request to change the turn restriction.')+
						'"><i class="fa fa-arrows-alt"></i>&nbsp;Turn</button>&nbsp;' +
					'<button id="wmerBtn_closures"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(wmer_LanguageRU?'Отправить запрос на изменение перекрытие сегментов':'Send a request to change the Real Time Closures.')+
						'"><i class="fa fa-calendar"></i>&nbsp;Closures</button>' +
                    '<div class="controls-container">' +
					'<input name="wmerChk_discord" value="" id="wmerChk_discord" type="checkbox"><label for="wmerChk_discord" title="'+(wmer_LanguageRU?'Дублировать запрос в Discord':'Send to Discord')+'">Discord</label><br>' +
					'</div>'
                    '</div></div>';

				// --- CityLock ---
				html += ''+
					'<div class="form-group">'+
					'<label class="control-label">' + (wmer_LanguageRU?'CityLock':'CityLock') +'</label>' +
					'<div class="controls-container">' +
					'<label><a href="' + CL[idCL].d + '" id="wmerA_d" target="_gdocRequest" title="' + sccObj.country + '">' + (wmer_LanguageRU?'Таблица':'Table') +'</a></label> | '+
					'<label><a href="https://www.waze.com/forum/viewtopic.php?f=787&t=105793" title="City Lock ' + wmer_Version + '" target="_blank">' + (wmer_LanguageRU?'О проекте':'About') +'</a></label></br>'+
					'<button id="wmerBtn_cl"   class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(wmer_LanguageRU?'Отправить запрос на изменение наименования населенного пункта':'Send a request to CityLock')+
						'"><i class="fa fa-home"></i>&nbsp;City</button>'+
					'&nbsp;<span id="wmerChangeState0"></span>' +
					'&nbsp;<span id="wmerCitySave0"></span></br>' +
					'<label><span id="wmerCityID"></span><br>'+
					'<span id="wmerStateID"></span></label>'+
					'<div class="controls-container">' +
					'<label>Language from OSM:</label>' +
					'<select class="form-control" id="wmerEdt_country" title="Для запросов по созданию/изменению НП принудительно задавать язык получемых данных из OSM">';

					for(var cli=0; cli < CL.length; ++cli)
						html+='<option value="'+cli+'">'+CL[cli].c+'</option>';

				html += ''+
					'</select>'+
					'</div>'+
					'<div class="controls-container" style="display:none">' +
					'<input name="wmerChk_county" value="" id="wmerChk_county" type="checkbox"><label for="wmerChk_county" title="'+(wmer_LanguageRU?'Добавлять РАЙОН в название НП':'Adding DISTRICT in the name of the locality')+'">&nbsp;'+(wmer_LanguageRU?'Добавлять район':'Add District')+'</label><br>' +
					'</div>' +
					//'</br><label><span id="wmerLatLon"></span></label>'+
					'</div></div>';

				// --- TTS ---
				html += ''+
					'<div class="form-group">'+
					'<label class="control-label">TTS Requests</label>' +
					'<div class="controls-container">' +
					'<label><a href="' + CL[idCL].ttsd + '" id="wmerTTS_d" target="_gdocRequest" title="TTS '+CL[idCL].ttst +'">' + (wmer_LanguageRU?'Таблица':'Table') +'</a></label> | '+
					'<label><a href="https://www.waze.com/forum/viewtopic.php?f=785&t=148400" title="'+CL[idCL].ttst +' - новый TTS-голос" target="_blank">' + (wmer_LanguageRU?'О проекте':'About') +'</a></label></br>'+
					//'<select class="form-control" id="wmerEdt_TTSSelect" title="">'+
					//'<option value="Marussia">Маруся</option>'+
					//'<option value="Марічка">Марічка</option>'+
					//'</select>'+
					'<button id="wmerBtn_tts"   class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(wmer_LanguageRU?'Отправить запрос по проблеме произношения или сокращения в Waze TTS '+CL[idCL].ttst:'Send a request to the pronunciation problem or reduction in Waze TTS '+CL[idCL].ttst)+
						'"><i class="fa fa-volume-up"></i>&nbsp;TTS</button></br>' +
					'</div></div>';

				// --- Прочее ---
				html += ''+
					'<div class="form-group">'+
					'<label class="control-label">' + (wmer_LanguageRU?'Прочее':'Other') +'</label>' +
					'<div class="controls-container">' +
					'<button id="wmerBtn_pm"   class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
						(wmer_LanguageRU?'Отправить приватное сообщение в форум авторам выделенных объектов':'Send (in forum) a Private Message to the author of the segment')+
						'"><li class="fa fa-envelope"></li>&nbsp;PM</button>'+
					'</div></div>';



				// --- Настройки ---
				html += ''+
					'<div class="form-group">' +
					'<label class="control-label">' + (wmer_LanguageRU?'Настройки':'Config') +'</label>';

				html += ''+
					'<div class="controls-container">' +
					'<label>E-mail:' +
					'<input  title="' + (wmer_LanguageRU?'Ваш e-mail адрес':'Your e-mail address') +'" type="text" class="form-control" autocomplete="off" id="wmerEdt_email" name="wmerEdt_email" value="" size="15"/></label><br>' +
					'</div>'+
					'<div class="controls-container">' +
					'<input name="wmerChk_mapcenter" value="" id="wmerChk_mapcenter" type="checkbox"><label for="wmerChk_mapcenter" title="'+(wmer_LanguageRU?'Брать координаты центра карты':'Брать координаты центра карты')+'">Map Center</label>' +
					'</div>'+
					'<div class="controls-container">' +
					'<input name="wmerEdt_lang" value="" id="wmerEdt_lang" type="checkbox"><label for="wmerEdt_lang" title="'+(wmer_LanguageRU?'Принудительно использовать русскоязычный интерфейс для WME Request':'Forced to use Russian-language interface for WM Request')+'">Russian UI</label>' +
					'</div>'+
					'<div class="controls-container">' +
					'<input name="wmerChk_debug" value="" id="wmerChk_debug" type="checkbox"><label for="wmerChk_debug" title="'+(wmer_LanguageRU?'Включить логирование':'Enable debug script')+'">Debug script</label><br>' +
					'</div>';

				html += ''+
					'</div>' +
					'</form>'+
					'</div>' +
					'';

				srsCtrl.innerHTML = html;
				//srsCtrl.id = "sidepanel-wmerequest";
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
			document.getElementById('wmerBtn_lock').onclick = click_WMERequest;
			document.getElementById('wmerBtn_dir').onclick  = click_WMERequest;
			document.getElementById('wmerBtn_turn').onclick  = click_WMERequest;
			document.getElementById('wmerBtn_closures').onclick  = click_WMERequest;
			document.getElementById('wmerBtn_join').onclick = click_WMERequest;
			document.getElementById('wmerBtn_pm').onclick   = click_submitPMForm;
			document.getElementById('wmerBtn_cl').onclick   = click_WMERequest;
			document.getElementById('wmerBtn_tts').onclick   = click_WMERequest;
		}

		//var permalink=wmer_generate_permalink();
		//var p = document.getElementsByClassName('WazeControlMousePosition')[0].innerHTML.replace(' ', '').split(',');
		//var p = document.getElementsByClassName('WazeControlMousePosition')[0].lastChild.innerHTML.split(' ');
		//permalink=permalink.replace(/#/g, "").replace(/&lat=([0-9\.]+)/g, '&lat='+p[1]).replace(/&lon=([0-9\.]+)/g, '&lon='+p[0]);
        /*
		if (typeof GetWMESelected()[0].geometry.x !== "undefined")
		{
			// корректировка пермалинка для камеры, жанкшина и Place (point)
			var urPos=new OpenLayers.LonLat(GetWMESelected()[0].geometry.x,GetWMESelected()[0].geometry.y);
			urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326")); // {lon, lat}
			permalink=permalink.replace(/#/g, "").replace(/&lat=([0-9\.]+)/g, '&lat='+urPos.lat).replace(/&lon=([0-9\.]+)/g, '&lon='+urPos.lon);
		}
        */
		//document.getElementById('wmerCityID').innerHTML='<small><a href="'+permalink+'">cityID: '+sccObj.cityID+'</a></small>';
		//document.getElementById('wmerCityID').innerHTML='<small>cityID: '+sccObj.cityID+'</small>';
        /*
		if(W.loginManager.user.rank >= 4)
		{
			document.getElementById('wmerCityID').innerHTML+='&nbsp;(<small><a style="cursor: pointer" title="Save the name of the new city in the Google Table" id="wmerA_cl">save</a></small>)';
			document.getElementById('wmerA_cl').onclick   = click_WMERequest;
		}
        */

		//document.getElementById('wmerLatLon').innerHTML='<small>'+p[0]+','+p[1]+'</a></small>';

		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'initialised');
	}

	if(document.getElementById(CreateID()) != null)
	{

		// ********************
		if(document.getElementById('wmerA_dr'))
		{
			document.getElementById('wmerA_dr').href=CL[idCL].dr;
			document.getElementById('wmerA_dr').title=sccObj.country;
		}
		if(document.getElementById('wmerA_d'))
		{
			document.getElementById('wmerA_d').href=CL[idCL].d;
			document.getElementById('wmerA_d').title=sccObj.country;
		}

		// ********************
		if(document.getElementById('wmerCityID'))
		{
		//if(wmer_Debug) console.log("osmName.cityName=",osmName.cityName)
			if (sccObj.country === 'Russia') // need script!
				//document.getElementById('wmerCityID').innerHTML='<small>cityID: <a href="http://fias.nalog.ru/?'+osmName.cityName+'" target="_blank">'+sccObj.cityID+'</a></small>';
				document.getElementById('wmerCityID').innerHTML='<small><a href="http://fias.nalog.ru/?'+sccObj.city+' ('+sccObj.stateName+'" title="Проверить имя в fias" target="_blank">cityID:</a> <span id="__clpCI" style="cursor:pointer;" title="Копировать CityID">'+sccObj.cityID+'</span></small>';
			else
				document.getElementById('wmerCityID').innerHTML='<small>cityID: <span id="__clpCI" style="cursor:pointer;" title="Копировать cityID">'+sccObj.cityID+'</span></small>';
			document.getElementById('__clpCI').onclick=function(){clipboard.copy(this.innerText);}
		}
		if(document.getElementById('wmerStateID'))
		{
			document.getElementById('wmerStateID').innerHTML='<small>stateID: <span id="__clpSI" style="cursor:pointer;" title="Копировать stateID">'+sccObj.stateID+'</span></small>';
			document.getElementById('__clpSI').onclick=function(){clipboard.copy(this.innerText);}
		}


		// ********************
        // config e-mail
        if(document.getElementById('wmerEdt_email'))
        {
			document.getElementById('wmerEdt_email').value=WMERequestEmail;
			document.getElementById('wmerEdt_email').onchange=function(){WMERequestEmail=this.value;localStorage.setItem('WMERequestEmail', WMERequestEmail);}
		}

        if(document.getElementById('wmerEdt_country'))
        {
            document.getElementById("wmerEdt_country").selectedIndex = WMERequestCountry;
            document.getElementById("wmerEdt_country").onchange = function(){WMERequestCountry=parseInt(this.value);localStorage.setItem("WMERequestCountry",WMERequestCountry);};
		}

		// ********************
		// config language
		if (document.getElementById('wmerEdt_lang'))
		{
			var WMELanguageRU=localStorage.getItem("WMELanguageRU");
			if (WMELanguageRU)
				wmer_LanguageRU=WMELanguageRU === "1"?true:false;
			document.getElementById('wmerEdt_lang').checked=wmer_LanguageRU;
			document.getElementById('wmerEdt_lang').onchange=function(){wmer_LanguageRU=this.checked;localStorage.setItem('WMELanguageRU', wmer_LanguageRU?"1":"0");}
		}

		// ********************
		// config debug
		document.getElementById('wmerChk_debug').checked=wmer_Debug;
		document.getElementById('wmerChk_debug').onchange=function(){wmer_Debug=this.checked;localStorage.setItem('wmer_Debug', wmer_Debug?"1":"0");}

		// config send to discord
		document.getElementById('wmerChk_discord').checked=wmer_SendDiscord;
		document.getElementById('wmerChk_discord').onchange=function(){wmer_SendDiscord=this.checked;localStorage.setItem('wmer_SendDiscord', wmer_SendDiscord?"1":"0");}

		// config map center
		document.getElementById('wmerChk_mapcenter').checked=wmer_MapCenter;
		document.getElementById('wmerChk_mapcenter').onchange=function(){wmer_MapCenter=this.checked;localStorage.setItem('WMERequestMapCenter', wmer_MapCenter?"1":"0");}

		// config AddCounty
		document.getElementById('wmerChk_county').checked=wmer_AddCounty;
		document.getElementById('wmerChk_county').onchange=function(){wmer_AddCounty=this.checked;localStorage.setItem('WMERequestAddCounty', wmer_AddCounty?"1":"0");}


		// ********************
		if(sccObj.country==='Russia')
		{
			document.getElementById('wmerChangeState0').innerHTML=
			'<button id="wmerCS_cl"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
				(wmer_LanguageRU?'Изменить район':'Change State')+
				'"><i class="fa fa-map-marker"></i>&nbsp;State</button>';

			document.getElementById('wmerCS_cl').onclick   = click_WMERequest;
		}

		if(W.loginManager.user.rank >= 4 || (sccObj.country=='Belarus' && W.loginManager.user.rank >= 3)) // ??? Uzbekistan ???
		{
			document.getElementById('wmerCitySave0').innerHTML=
			'<button id="wmerA_cl"  class="btn btn-default" style="font-size:9px;'+padding+'" title="'+
				(wmer_LanguageRU?'Сохранить имя нового НП в Google-таблице':'Save the name of the new city in the Google Table')+
				'"><i class="fa fa-floppy-o"></i>&nbsp;Save</button>';

			//document.getElementById('wmerCityID').innerHTML+='&nbsp;(<small><a style="cursor: pointer" title="Save the name of the new city in the Google Table" id="wmerA_cl">save</a></small>)';
			document.getElementById('wmerA_cl').onclick   = click_WMERequest;
		}
	}

	if(document.getElementById(CreateID()) != null)
	{
		document.getElementById('wmerBtn_lock').disabled=disabledLock;
		document.getElementById('wmerBtn_dir').disabled=disabled;
		document.getElementById('wmerBtn_turn').disabled=disabled;
		document.getElementById('wmerBtn_closures').disabled=disabled;
		document.getElementById('wmerBtn_join').disabled=disabled;
		document.getElementById('wmerBtn_pm').disabled=disabledPM;
		document.getElementById('wmerBtn_cl').disabled=disabled;
		//document.getElementById('wmerBtn_tts').disabled=disabled;
		if(document.getElementById('wmerA_cl'))
			document.getElementById('wmerA_cl').disabled=disabled;
		if(document.getElementById('wmerCS_cl'))
			document.getElementById('wmerCS_cl').disabled=disabled;

	}
}


// <WME Fancy permalink> - http://userscripts.org/users/548866
function getId(node) {
  return document.getElementById(node);
}

function getForumUserIdFromID(wmeUserID)
{
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'call getForumUserIdFromID(' + wmeUserID + ')');
	var userName=W.model.users.getObjectById(wmeUserID);
	if(wmer_Debug) console.dir(userName);
	return (getForumUserIdFromName(userName.userName));
}

function getForumUserIdFromName(userName)
{
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'call getForumUserIdFromName(' + userName + ')');
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

	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'looking for ' + userName + ' in the forum.');

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
				if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'Forum return null');
				return(-1); // no match
			}
			if (test.length>1)
			{
				if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'Forum return multiple match:');
				if(wmer_Debug) console.dir(test);
				return(-2); // multiple match
			}
			forumID=test[0].substring(2, test[0].length-1);
		}
	};

	if(wmer_Debug) console.dir(xhr3_object);

	try {
		xhr3_object.send(null);
	}
	catch (err) {
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'XMLHttpRequest error: ' +err.name);
		if(wmer_Debug) console.dir(err);
		return(-3);
	}
	forumIDs[0]=forumID;
	return (forumIDs);
}

function click_submitPMForm()
{
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'click_submitPMForm() start');
	if (typeof W.selectionManager === "undefined")
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'W.selectionManager not found');
		return;
	}

	var wmeSelected=GetWMESelected();
	if (!wmeSelected.length)
	{
		alert(wmer_LanguageRU?'Сначала необходимо выделить сегмент':'Please, select one segment before');
		return false;
	}

	//-------------
	var sccObjs=new Array();
	for (var i=0; i < wmeSelected.length; ++i)
	{
		var sccObj = wmer_getCCSD(wmeSelected[i].model);
		if (sccObj.userID==-1)
		{
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'PM request - Do not PM Admin!');
			alert("Can't PM admin!");
			return false;
		}

		var j;
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'sccObj.userID='+sccObj.userID);
		for (j=0; j < wmer_UserCache.length; j+=2)
		{
			if (wmer_UserCache[j] === sccObj.userID)
			{
				sccObj.forumuserID=wmer_UserCache[j+1];
				if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'found ['+j+']'+wmer_UserCache[j+1]);
				break;
			}
		}

		if (sccObj.forumuserID == "")
		{
			if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'not found '+sccObj.userID);
			sccObj.forumuserID=getForumUserIdFromID(sccObj.userID);
			wmer_UserCache.push(sccObj.userID,sccObj.forumuserID);
		}

		sccObjs.push(sccObj);
	}

	var forumIDs=new Array();
	for (let  i=0; i < sccObjs.length; ++i)
		forumIDs[i]=sccObjs[i].forumuserID;
	//-------------

	if (forumIDs.length==1 && forumIDs[0]==-1)
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'PM request - User never logged to the forum...');
		alert(wmer_LanguageRU?'Автор сегмента не найден на форуме':'Sorry: unable to find the user in the forum');
		return false;
	}
	if (forumIDs.length==1 && forumIDs[0]==-2)
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'PM request - Several users match name. Should never happen :s');
		alert(wmer_LanguageRU?'Найдено более одного пользователя\nОтправьте сообщение самостоятельно.':'Sorry: more than one user found in the forum.\nYou should look for him/her by yourself.');
		return false;
	}
	if (forumIDs.length==1 && forumIDs[0]==-3)
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'A network error occurred.');
		alert(wmer_LanguageRU?'Сетевые проблемы\nОтправьте сообщение самостоятельно.':'Sorry: a network error occurred.\nYou should look for him/her by yourself.');
		return false;
	}

	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'PM request - all OK. go to PM!');

	var formID="WMER-PM-FORM";

	var nodePM;

	if (getId("WMER-PM-Send") == null)
	{
		nodePM= document.createElement('div');
		nodePM.id = 'WMER-PM-Send';
		nodePM.style.display='hidden';
		getId(CreateID()).appendChild(nodePM);
	}
	else
	{
		nodePM=getId("WMER-PM-Send");
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
	for (let  i=0; i<forumIDs.length; i++)
	{
		PMForm+='<input type="hidden" name="address_list[u]['+forumIDs[i]+']" value="to" />';
	}
	PMForm+='</form>';
	nodePM.innerHTML=PMForm;

	var permalink=wmer_generate_permalink();
	//if(wmer_Debug) console.log(permalink);
	var name_object=""
	let linkParts=permalink.replace(/#/g, "").split('&');
	for (let j=0; j<linkParts.length; j++)
	{
		if (linkParts[j].indexOf("segments=")==0 || linkParts[j].indexOf("venues=")==0  || linkParts[j].indexOf("cameras=")==0 || linkParts[j].indexOf("bigJunctions=")==0)
		{
			name_object=linkParts[j].split('=')[0]
			linkParts.splice (j,1);
			break;
		}
	}
	permalink=linkParts.join('&');

	if(wmer_Debug) console.dir(linkParts);

	var message=wmer_LanguageRU?
		'Есть вопросы по правкам в [url=' + permalink + ']этой области редактирования[/url]:\n\n':
		'Some questions about [url=' + permalink + ']this area[/url]:\n\n';

	function NullToEmpty(s)
	{
		return !s?"":s;
	}
	function GetTypeName(s)
	{
		if(wmer_LanguageRU)
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
		//'+(wmer_LanguageRU?'Категории':'Categories')+'
	}

	for (let i=0; i < sccObjs.length; ++i)
	{
		var on=sccObjs[i].type === "segment"?(wmer_LanguageRU?'Улица':"Street"):(wmer_LanguageRU?'Название':"Name");
		message += ''
		         + (wmer_LanguageRU?'Автор':'Author')+': [b]' + sccObjs[i].username + '[/b]\n'
		         + (wmer_LanguageRU?'Тип':'Type')+': [b]' + GetTypeName(sccObjs[i].type) + '[/b]\n'
         + (sccObj.country=='Belarus'?'':(wmer_LanguageRU?'Страна':'Country')+': [b]' + sccObjs[i].country + '[/b]\n')
		         + (wmer_LanguageRU?'НП':'City')+': [b]' + NullToEmpty(sccObjs[i].city) + '[/b]\n'
		         + (sccObjs[i].poiaddress.length > 0?(wmer_LanguageRU?'Адрес':'Address')+': [b]'+sccObjs[i].poiaddress+'[/b]\n':'')
		         + on+ ': [b]' + NullToEmpty(sccObjs[i].street) + '[/b]\n'
		         + (wmer_LanguageRU?'Дата':'Date')+': [b]' + timeConverter(sccObjs[i].updatedOn).replace('+',' ') + '[/b]\n'
		         + (wmer_LanguageRU?'Ссылка':'Permalink')+': [url]' + permalink + '&' + name_object + '=' + sccObjs[i].objid + '[/url]\n'
		         + (wmer_LanguageRU?'Дополнительно':'Description')+': {' + NullToEmpty(sccObjs[i].description) + '\n}\n'
		         + '\n';
	}
	//if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + message);

	getId(formID + '-message').value=message;
	var now=new Date().getTime();
	now /= 1000;
	now = Math.floor(now);
	getId(formID + '-ct').value=now;
	getId(formID + '-lc').value=now;

	getId(formID).action="https://www.waze.com/forum/ucp.php?i=pm&mode=compose&action=post";
	getId(formID + '-subject').value=
		wmer_LanguageRU?
			'[WME Request] Уточнение по правкам':
			'[WME Request] Question about map edits';

	if(wmer_Debug) console.dir(getId(formID));

	getId(formID).submit();
	return true; // this forces to open in new tab!
}
// </WME Fancy permalink>


function wmer_HandCreateRequest()
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

function wmer_initBindKey() {
	var Config =[
		{handler: 'WMERequest_Lock',     title: "Запрос на изменение уровня блокировки объекта", func:wmer_HandCreateRequest , key:-1, arg:{type:'click',id:'wmerBtn_lock'}},
		{handler: 'WMERequest_Join',     title: "Запрос на присоединение сегментов", func:wmer_HandCreateRequest , key:-1, arg:{type:'click',id:'wmerBtn_join'}},
		{handler: 'WMERequest_Dir',      title: "Запрос на изменение направления сегментов", func:wmer_HandCreateRequest , key:-1, arg:{type:'click',id:'wmerBtn_dir'}},
		{handler: 'WMERequest_Turn',     title: "Запрос на изменение разрешения поворотов", func:wmer_HandCreateRequest , key:-1, arg:{type:'click',id:'wmerBtn_turn'}},
		{handler: 'WMERequest_Closures', title: "Запрос на перекрытие сегментов", func:wmer_HandCreateRequest , key:-1, arg:{type:'click',id:'wmerBtn_closures'}},
		{handler: 'WMERequest_City',     title: "Запрос на создание/изменение НП", func:wmer_HandCreateRequest , key:-1, arg:{type:'click',id:'wmerBtn_cl'}},
	];
/*
W.loginManager.user.editableCountryIDs
186 - Russia
180 - Poland
123 - Latvia
37  - Belarus
129 - Lithuania
232 - Ukraine
*/
	if(W.loginManager.user.rank >= 4 || (W.loginManager.user.editableCountryIDs.indexOf(37) >= 0 && W.loginManager.user.rank >= 3)) // ??? Uzbekistan ???
	{
		Config.push({handler: 'WMERequest_CitySave', title: "Сохранить название НП", func:wmer_HandCreateRequest , key:-1, arg:{type:'click',id:'wmerA_cl'}});
	}

	for(var i=0; i < Config.length; ++i)
	{
		WMEKSRegisterKeyboardShortcut('WME-Requests', 'WME-Requests', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
	}

    WMEKSLoadKeyboardShortcuts('WME-Requests');

	window.addEventListener("beforeunload", function() {
		WMEKSSaveKeyboardShortcuts('WME-Requests');
	}, false);

}

function wmer_FakeLoad()
{
	if (typeof W === "undefined")
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'Waze not found, retrying in 500ms...');
		setTimeout(wmer_FakeLoad,500);
		return;
	}
	if (typeof W.selectionManager === "undefined")
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'W.selectionManager not found, retrying in 500ms...');
		setTimeout(wmer_FakeLoad,500);
		return;
	}
	if (typeof W.model === "undefined")
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'W.model not found, retrying in 500ms...');
		setTimeout(wmer_FakeLoad,500);
		return;
	}
	if (typeof W.loginManager === "undefined")
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'W.loginManager not found, retrying in 500ms...');
		setTimeout(wmer_FakeLoad,500);
		return;
	}
	if (typeof W.loginManager.user === "undefined")
	{
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'W.loginManager.user not found, retrying in 500ms...');
		setTimeout(wmer_FakeLoad,500);
		return;
	}

	try {
		W.selectionManager.events.register("selectionchanged", null, wmer_insertButton);
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'added event handler for selectionchanged');
	}
	catch (err) {
		if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'added event handler error: ' +err.name);
	}
	setTimeout(wmer_initBindKey, 500);
}


function wmer_Init() {
	if(wmer_Debug) console.log('WME Requests v.' + wmer_Version + ': ' + 'init');
	setTimeout(wmer_FakeLoad, 500);
}


function wmer_bootstrap()
{
	wmer_LanguageRU=I18n.locale === "ru"?true:false;

	wmer_Debug      = __GetLocalStorageItem("wmer_Debug",'bool',false);
	//WMELanguageRU   = __GetLocalStorageItem("WMELanguageRU",'bool',false);
	wmer_MapCenter  = __GetLocalStorageItem("WMERequestMapCenter",'bool',false);
	wmer_AddCounty  = true;//__GetLocalStorageItem("WMERequestAddCounty",'bool',false);
	WMERequestEmail = __GetLocalStorageItem("WMERequestEmail",'string','');
	WMERequestCountry= __GetLocalStorageItem("WMERequestCountry",'int',0);
    wmer_SendDiscord  = __GetLocalStorageItem("wmer_SendDiscord",'bool',false);

	wmer_Init();
}

wmer_bootstrap();


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
the command to add links is WMERegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
	ScriptName: This is the name of your script used to track all of your shortcuts on load and save.
	ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
	ShortcutsHeader: this is the header that will show up in the keyboard editor
	NewShortcut: This is the name of the shortcut and needs to be uniuque from all of the other shortcuts, from other scripts, and WME
	ShortcutDescription: This wil show up as the text next to your shortcut
	FunctionToCall: this is the name of your function that will be called when the keyboard shortcut is presses
	ShortcutKeysObj: the is the object representing the keys watched set this to '-1' to let the users specify their own shortcuts.
	ShortcutKeysObj: The alt, shift, and ctrl keys are A=alt, S=shift, C=ctrl. for short cut to use "alt shift ctrl and l" the object would be 'ASC+l'
*/
function WMEKSRegisterKeyboardShortcut(a,b,c,d,e,f,g){try{I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members.length}catch(c){W.accelerators.Groups[a]=[],W.accelerators.Groups[a].members=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[a]=[],I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].description=b,I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members=[]}if(e&&"function"==typeof e){I18n.translations[I18n.locale].keyboard_shortcuts.groups[a].members[c]=d,W.accelerators.addAction(c,{group:a});var i="-1",j={};j[i]=c,W.accelerators._registerShortcuts(j),null!==f&&(j={},j[f]=c,W.accelerators._registerShortcuts(j)),W.accelerators.events.register(c,null,function(){e(g)})}else alert("The function "+e+" has not been declared")}function WMEKSLoadKeyboardShortcuts(a){if(console.log("WMEKSLoadKeyboardShortcuts("+a+")"),localStorage[a+"KBS"])for(var b=JSON.parse(localStorage[a+"KBS"]),c=0;c<b.length;c++)try{W.accelerators._registerShortcuts(b[c])}catch(a){console.log(a)}}function WMEKSSaveKeyboardShortcuts(a){console.log("WMEKSSaveKeyboardShortcuts("+a+")");var b=[];for(var c in W.accelerators.Actions){var d="";if(W.accelerators.Actions[c].group==a){W.accelerators.Actions[c].shortcut?(W.accelerators.Actions[c].shortcut.altKey===!0&&(d+="A"),W.accelerators.Actions[c].shortcut.shiftKey===!0&&(d+="S"),W.accelerators.Actions[c].shortcut.ctrlKey===!0&&(d+="C"),""!==d&&(d+="+"),W.accelerators.Actions[c].shortcut.keyCode&&(d+=W.accelerators.Actions[c].shortcut.keyCode)):d="-1";var e={};e[d]=W.accelerators.Actions[c].id,b[b.length]=e}}localStorage[a+"KBS"]=JSON.stringify(b)}
/* ********************************************************** */

// from https://github.com/lgarron/clipboard.js/blob/master/clipboard.min.js
// АХТУНГ!!! если вызов в $.ajax, то ставим параметр "async: false,"
(function(f,c){"undefined"!==typeof module?module.exports=c():"function"===typeof define&&"object"===typeof define.amd?define(c):this[f]=c()})("clipboard",function(){if(!document.addEventListener)return null;var f={};f.copy=function(){function c(){d=!1;b=null;e&&window.getSelection().removeAllRanges();e=!1}var d=!1,b=null,e=!1;document.addEventListener("copy",function(c){if(d){for(var e in b)c.clipboardData.setData(e,b[e]);c.preventDefault()}});return function(g){return new Promise(function(k,f){d=!0;b="string"===typeof g?{"text/plain":g}:g instanceof Node?{"text/html":(new XMLSerializer).serializeToString(g)}:g;try{var n=document.getSelection();if(!document.queryCommandEnabled("copy")&&n.isCollapsed){var l=document.createRange();l.selectNodeContents(document.body);n.addRange(l);e=!0}if(document.execCommand("copy"))c(),k();else throw Error("Unable to copy. Perhaps it's not available in your browser?");}catch(p){c(),f(p)}})}}();f.paste=function(){var c=!1,d,b;document.addEventListener("paste",function(e){if(c){c=!1;e.preventDefault();var g=d;d=null;g(e.clipboardData.getData(b))}});return function(e){return new Promise(function(g,f){c=!0;d=g;b=e||"text/plain";try{document.execCommand("paste")||(c=!1,f(Error("Unable to paste. Pasting only works in Internet Explorer at the moment.")))}catch(m){c=!1,f(Error(m))}})}}();"undefined"===typeof ClipboardEvent&&"undefined"!==typeof window.clipboardData&&"undefined"!==typeof window.clipboardData.setData&&(function(c){function d(a,b){return function(){a.apply(b,arguments)}}function b(a){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof a)throw new TypeError("not a function");this._value=this._state=null;this._deferreds=[];l(a,d(f,this),d(k,this))}function e(a){var b=this;return null===this._state?void this._deferreds.push(a):void p(function(){var c=b._state?a.onFulfilled:a.onRejected;if(null===c)return void(b._state?a.resolve:a.reject)(b._value);var h;try{h=c(b._value)}catch(d){return void a.reject(d)}a.resolve(h)})}function f(a){try{if(a===this)throw new TypeError("A promise cannot be resolved with itself.");if(a&&("object"==typeof a||"function"==typeof a)){var b=a.then;if("function"==typeof b)return void l(d(b,a),d(f,this),d(k,this))}this._state=!0;this._value=a;m.call(this)}catch(c){k.call(this,c)}}function k(a){this._state=!1;this._value=a;m.call(this)}function m(){for(var a=0,b=this._deferreds.length;b>a;a++)e.call(this,this._deferreds[a]);this._deferreds=null}function n(a,b,c,h){this.onFulfilled="function"==typeof a?a:null;this.onRejected="function"==typeof b?b:null;this.resolve=c;this.reject=h}function l(a,b,c){var h=!1;try{a(function(a){h||(h=!0,b(a))},function(a){h||(h=!0,c(a))})}catch(d){h||(h=!0,c(d))}}var p=b.immediateFn||"function"==typeof setImmediate&&setImmediate||function(a){setTimeout(a,1)},q=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)};b.prototype["catch"]=function(a){return this.then(null,a)};b.prototype.then=function(a,c){var d=this;return new b(function(b,f){e.call(d,new n(a,c,b,f))})};b.all=function(){var a=Array.prototype.slice.call(1===arguments.length&&q(arguments[0])?arguments[0]:arguments);return new b(function(b,c){function d(e,g){try{if(g&&("object"==typeof g||"function"==typeof g)){var k=g.then;if("function"==typeof k)return void k.call(g,function(a){d(e,a)},c)}a[e]=g;0===--f&&b(a)}catch(l){c(l)}}if(0===a.length)return b([]);for(var f=a.length,e=0;e<a.length;e++)d(e,a[e])})};b.resolve=function(a){return a&&"object"==typeof a&&a.constructor===b?a:new b(function(b){b(a)})};b.reject=function(a){return new b(function(b,c){c(a)})};b.race=function(a){return new b(function(b,c){for(var d=0,e=a.length;e>d;d++)a[d].then(b,c)})};"undefined"!=typeof module&&module.exports?module.exports=b:c.Promise||(c.Promise=b)}(this),f.copy=function(c){return new Promise(function(d,b){if("string"!==typeof c&&!("text/plain"in c))throw Error("You must provide a text/plain type.");window.clipboardData.setData("Text","string"===typeof c?c:c["text/plain"])?d():b(Error("Copying was rejected."))})},f.paste=function(){return new Promise(function(c,d){var b=window.clipboardData.getData("Text");b?c(b):d(Error("Pasting was rejected."))})});return f});
/* ********************************************************** */
