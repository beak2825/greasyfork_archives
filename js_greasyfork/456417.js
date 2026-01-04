// ==UserScript==
// @name         SubmiteScore
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Chalenges Score
// @author       MeGaBoUsSOl
// @match        https://algeria.blsspainvisa.com/index.php
// @match        https://algeria.blsspainvisa.com/appointment.php*
// @match        https://algeria.blsspainvisa.com/appointment_family.php*
// @icon         https://media2.giphy.com/media/Wp1KN1fJiVsx1tOu0k/200w.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456417/SubmiteScore.user.js
// @updateURL https://update.greasyfork.org/scripts/456417/SubmiteScore.meta.js
// ==/UserScript==


if (localStorage.getItem('BestScore') == null) {
	localStorage.setItem('BestScore', 99)
};
/*Constants*/
var loc = window.location.href;
var index = loc.indexOf('index.php');
var login = loc.indexOf('/appointmen');

/*AddEvent Login*/
if (login !== -1) {
	document.querySelector("#new > input.btn.primary-btn").addEventListener("click", function() {

		if (document.querySelector("body > header > div > div > div.pull_right.paddingInBox.paddingRightNone.paddingBottomNone > div > h3").outerText.substring('0', '2') < localStorage.getItem('BestScore').substring('0', '2')) {
			localStorage.setItem('BestScore', (document.querySelector("body > header > div > div > div.pull_right.paddingInBox.paddingRightNone.paddingBottomNone > div > h3").outerText));
			localStorage.setItem('LastScore', (document.querySelector("body > header > div > div > div.pull_right.paddingInBox.paddingRightNone.paddingBottomNone > div > h3").outerText));
		} else {
			localStorage.setItem('LastScore', (document.querySelector("body > header > div > div > div.pull_right.paddingInBox.paddingRightNone.paddingBottomNone > div > h3").outerText))
		}
	});

}



/*ButtonClient*/
let btnClient = document.createElement("Score");
btnClient.innerHTML = 'Last Score is: ' + localStorage.getItem('LastScore');
btnClient.setAttribute('id', 'Time');
btnClient.style.cursor = "pointer";
btnClient.setAttribute("title", 'Click too see the best Score ');
btnClient.style.position = 'absolute';
btnClient.style.width = (btnClient.innerHTML.length * 15) + 'px'; // setting the width to 200px
btnClient.style.height = '35px'; // setting the height to 200px
btnClient.style.left = '0px';
btnClient.style.top = '100px';
btnClient.style.background = '#696969'; // setting the background color to teal
btnClient.style.borderRadius = '25px';
btnClient.style.border = '3px solid lightblue';
btnClient.style.color = 'black'; // setting the color to white
btnClient.style.fontSize = '25px'; // setting the font size to 20px
btnClient.style.fontWeight = "bold";
btnClient.style.textAlign = ('center');
btnClient.style.verticalAlign = "bottom";
btnClient.onclick = function() {
	btnClient.innerHTML = 'Best Score is: ' + localStorage.getItem('BestScore');
	btnClient.style.background = '#7CFC00';
};
document.body.appendChild(btnClient);