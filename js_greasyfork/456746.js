// ==UserScript==
// @name         Provisoire Appointment Eyes
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  AppointmentEyesWithActivator
// @author       You
// @match        https://algeria.blsspainvisa.com/appointment_family.php
// @match        https://algeria.blsspainvisa.com/login.php
// @match        https://algeria.blsspainvisa.com/appointment.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blsspainvisa.com
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       God
// @downloadURL https://update.greasyfork.org/scripts/456746/Provisoire%20Appointment%20Eyes.user.js
// @updateURL https://update.greasyfork.org/scripts/456746/Provisoire%20Appointment%20Eyes.meta.js
// ==/UserScript==


var loc = window.location.href;
var appointment = loc.indexOf('/appointment');
var login = loc.indexOf('login.php');
/*Login*/
/*Restart Eyes Bls Status Off*/
if (login !== -1) {
	GM_deleteValue('Eyes');
};
/*Appointment*/
if (appointment !== -1) {
	var waiteForActivation = setInterval(function() {
		if (GM_getValue('Eyes') !== undefined) {
			document.getElementById('mcode').value = '111';
			document.getElementById('captcha').value = '111';
			btnClient.style.background = '#409e21';
			btnClient.innerHTML = 'Provisoir Eyes Started';
			btnClient.style.width = (btnClient.innerHTML.length * 15) + 'px'; // setting the width to 200px

			setTimeout(function() {
				if (document.getElementById("app_time") == null) {
					window.location.reload();
				}
			}, 19 * 1000);


			;
			clearInterval(waiteForActivation);
		}
	}, 1000)


	/*Buttont*/
	let btnClient = document.createElement("Score");
	btnClient.innerHTML = 'Start Provisoir Eyes';
	btnClient.setAttribute('id', 'Eyes');
	btnClient.style.cursor = "pointer";
	btnClient.setAttribute("title", 'Click too Start Provisoir Eyes');
	btnClient.style.position = 'absolute';
	btnClient.style.width = (btnClient.innerHTML.length * 15) + 'px'; // setting the width to 200px
	btnClient.style.height = '35px'; // setting the height to 200px
	btnClient.style.left = '1100px';
	btnClient.style.top = '100px';
	btnClient.style.background = 'red'; // setting the background color to teal
	btnClient.style.borderRadius = '25px';
	btnClient.style.border = '3px solid lightblue';
	btnClient.style.color = 'white'; // setting the color to white
	btnClient.style.fontSize = '25px'; // setting the font size to 20px
	btnClient.style.fontWeight = "bold";
	btnClient.style.textAlign = ('center');
	btnClient.style.verticalAlign = "bottom";
	btnClient.onclick = function() {
		GM_setValue('Eyes', 'Started');
		btnClient.innerHTML = 'Provisoir Eyes Started';
		btnClient.style.background = '#409e21';
	};
	document.body.appendChild(btnClient);

	/*Buttont2*/
	let btnClient2 = document.createElement("Score");
	btnClient2.innerHTML = 'Stop Provisoir Eyes';
	btnClient2.setAttribute('id', 'Eyes');
	btnClient2.style.cursor = "pointer";
	btnClient2.setAttribute("title", 'Click too Start Provisoir Eyes');
	btnClient2.style.position = 'absolute';
	btnClient2.style.width = (btnClient2.innerHTML.length * 15) + 'px'; // setting the width to 200px
	btnClient2.style.height = '35px'; // setting the height to 200px
	btnClient2.style.left = '1100px';
	btnClient2.style.top = '140px';
	btnClient2.style.background = 'pink'; // setting the background color to teal
	btnClient2.style.borderRadius = '25px';
	btnClient2.style.border = '3px solid lightblue';
	btnClient2.style.color = 'white'; // setting the color to white
	btnClient2.style.fontSize = '25px'; // setting the font size to 20px
	btnClient2.style.fontWeight = "bold";
	btnClient2.style.textAlign = ('center');
	btnClient2.style.verticalAlign = "bottom";
	btnClient2.onclick = function() {
		GM_deleteValue('Eyes');
		btnClient.style.background = 'red';
	};
	document.body.appendChild(btnClient2);
};