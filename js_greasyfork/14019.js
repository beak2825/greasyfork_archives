// ==UserScript==
// @name         EpisodeCalendar Torrentz Download links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds 'Tz' links to the calendar next to each episode for fast downloading on episodecalendar.com
// @author       Zarnaik
// @match        http://episodecalendar.com/calendar
// @match        http://episodecalendar.com/en/calendar
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14019/EpisodeCalendar%20Torrentz%20Download%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/14019/EpisodeCalendar%20Torrentz%20Download%20links.meta.js
// ==/UserScript==

var baseURL = 'https://torrentz.eu/search?q=';
var shows = document.querySelectorAll('.episode-item');

for (var i = 0; i < shows.length; i++){
	var showString = shows[i].children[2].children[0].innerHTML + '+' + shows[i].children[3].innerHTML.substring(shows[i].children[3].innerHTML.lastIndexOf(" (s"));
	var torrentzSearch = baseURL + showString;
	var elem = document.createElement('a');
	elem.style.color = '#DA0C87';
	elem.innerHTML = 'Tz';
	elem.href = torrentzSearch;
	elem.target = '_blank';
	shows[i].appendChild(elem);
}