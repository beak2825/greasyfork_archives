// ==UserScript==
// @name        Youth Hostels
// @namespace   popmundo
// @include     http://*.popmundo.com/World/Popmundo.aspx/City*
// @description Lugar de descanso da família Haliwell
// @version     2.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/19264/Youth%20Hostels.user.js
// @updateURL https://update.greasyfork.org/scripts/19264/Youth%20Hostels.meta.js
// ==/UserScript==
var HOSTELS = { // idCity : idLocal
	8 : 	3153952, // Amsterdam, Simone Simons
	35 : 	3172031, // Ankara, Jonathan Halliwell
	61 : 	3171831, // Antalya, Jonathan Halliwell
	58 : 	3171870, // Baku, Jonathan Halliwell
	9 : 	3157108, // Barcelona, Jonathan Halliwell
	36 : 	3141262, // Belgrade, Simone Simons
	7 : 	3153271, // Berlin, Simone Simons
	33 : 	3160243, // Brussels, Luke Halliwell
	46 : 	3161713, // Bucharest, Peter Halliwell
	42 : 	3153434, // Budapest, Jonathan Halliwell
	17 : 	3156675, // Buenos Aires, Simone Simons
	60 : 	2985160, // Chicago, Amalthea l'Amoureux
	22 : 	3128483, // Copenhagen, Lucy Halliwell
	29 : 	3161715, // Dubrovnik, Quinn Halliwell
	27 :	3161711, // Glasgow, Michael Halliwell
	19 :	1173622, // Helsinki, Einari Kyöttilä ***************
	30 : 	3076371, // Istanbul, Simone Simons
	47 : 	3149666, // Izmir, Jonathan Halliwell
	55 : 	2366752, // Jakarta, Pekka Ruonela
	51 : 	3152439, // Johannesburg, Simone Simons
	56 : 	3171965, // Kiev, Jonathan Halliwell
	5 : 	234234,  // London, Portal
	14 : 	3147049, // Los Angeles, Daniel Walker
	24 : 	3152565, // Madrid, Simone Simons
	54 : 	3108747, // Manila, Nico Craw
	10 : 	3155716, // Melbourne, Simone Simons
	32 : 	3156147, // Mexico City, Simone Simons
	52 : 	3160146, // Milan, Simone Simons
	38 : 	3104528, // Montreal, Becky Borgo
	18 : 	3154895, // Moscow, Simone Simons
	11: 	3152069, // Nashville, Simone Simons
	6: 		3151979, // New York, Jonathan Halliwell
	20: 	3039028, // Paris, Jonathan Halliwell
	31: 	3161703, // Porto, David Halliwell
	25: 	3055535, // Rio de Janeiro, Simone Simons
	23: 	3160165, // Rome, Jonathan Halliwell
	21: 	3035671, // São Paulo, Dean Barton
	49: 	3117380, // Sarajevo, Federico Neri
	50: 	2649052, // Seattle, Marloes Paalvast
	45: 	675717, // Shanghai, Mason Bolger
	39: 	3151157, // Singapore, Simone Simons Halliwell
	53: 	3155118, // Sofia, Jonathan Halliwell
	1: 		3089444, // Stockholm, Jonathan Halliwell
	34: 	3153221, // Tallinn, Simone Simons
	62: 	3160195, // Tokyo, Becky Borgo
	16: 	3161717, // Toronto, Bruce Dickinson
	26: 	3153354, // Tromsø, Jonathan Halliwell
	28: 	3198221, // Vilnius, Emma Halliwell
	48: 	3214325, // Warsaw, Jonathan Simons Halliwell
};
var localesLink = document.querySelector('#sidemenu a[href*="/World/Popmundo.aspx/City/Locales/"]'),
	cityId = localesLink.href.match(/(\d+)$/)[1];

if (!cityId || !HOSTELS[cityId]) {
	return;
}

var li = document.createElement('li'),
	a = document.createElement('a');

a.textContent = 'Youth Hostel';
a.href = '/World/Popmundo.aspx/Locale/' + HOSTELS[cityId];
li.appendChild(a);
localesLink.parentNode.parentNode.insertBefore(li, localesLink.parentNode.nextSibling);


/*
	begin copy & paste from numeric grades
*/

var scriptData = {
	optionsNamespace: 'youth_hostels_options',
	updateNotificationText: 'Youth Hostels Update Available',
	url: "https://greasyfork.org/scripts/19264-youth-hostels/code/Youth%20Hostels.user.js",
	updateUrl: "https://greasyfork.org/scripts/19264-youth-hostels/code/Youth%20Hostels.user.js",
	lastCheck: 0,
	updateAvailable: false,
	version: 2.0
};

var notify = function () {
	var aClose = document.createElement('div');
	aClose.textContent = scriptData.updateNotificationText;
	aClose.classList.add('notification-success');
	aClose.onclick = function (t) {
		options.set('updateAvailable',false);
		GM_openInTab(scriptData.url);
		t.target.parentNode.removeChild(t.target);
		if (document.querySelectorAll('#notifications > div').length < 1) {
			document.getElementById('notifications').classList.add('hidden');
			document.getElementById('notifications').style.display = 'none';
		}
	};
	var nots = document.getElementById('notifications');
	nots.appendChild(aClose);
	nots.classList.remove('hidden');
	nots.style.display = 'block';
};

var options = {
	set: function (option, value) {
		if (!option || value === null) return false;
		// because I don't want to save default values
		var data = this.load();
		scriptData[option] = value;
		data[option] = value;
		this.save(data);
		return true;
	},
	get: function (option) {
	},
	save: function (data) {
		if (!data) return undefined;
		GM_setValue(scriptData.optionsNamespace, JSON.stringify(data));
		return true;
	},
	load: function () {
		var data = GM_getValue(scriptData.optionsNamespace,'{}');
		if (data.length < 1) data = '{}';
		data = JSON.parse(data);
		for (var i in data) {
			scriptData[i] = data[i];
		}
		return data;
	}
};


if (scriptData.updateAvailable) {
	notify();
}
else if (parseInt(+new Date().valueOf() - scriptData.lastCheck) > 604800000) { // 1 week
	GM_xmlhttpRequest({
		method: 'GET',
		url: scriptData.updateUrl,
		onload: function (res) {
			options.set('lastCheck', new Date().valueOf());
			var remoteVersion = res.responseText.match(/\/\/\s+@version\s+([\d\.]+)$/mi);
			if (!remoteVersion) {
				GM_log('Error parsing remote file!');
				return;
			}
			if (remoteVersion[1] > scriptData.version) {
				options.set('updateAvailable',true);
				notify();
			}
		}
	});
}