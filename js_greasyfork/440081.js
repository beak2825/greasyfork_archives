// ==UserScript==
// @name           IMDb to Rarbg & Subscene
// @namespace      MrHama007
// @description    An Userscript for redirecting from IMDb to Rarbg and Subscene (+1337x soon) & other website can be added through editing the script
// @match     *://*.imdb.com/title/*
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/440081/IMDb%20to%20Rarbg%20%20Subscene.user.js
// @updateURL https://update.greasyfork.org/scripts/440081/IMDb%20to%20Rarbg%20%20Subscene.meta.js
// ==/UserScript==
(function() {

	'use strict';

	// Possible placeholders in URL: %id, %title and %title[padding] (e.g. %title[_])
	// Inserting null creates a seperator.
	// Favicon converter: http://dataurl.net/#dataurlmaker

var sites = [
        {name:'Rarbg', url:'https://rarbg.best/search?q=%title%20%year', icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABlElEQVR4AYWRAUQEQRiFL0lcAA7ACaGDwEngQLAADCADiAVigeQcThwHLARWklgAGwgDYAAxEFgBVsixnCSvN/+No2vS4zM7///Pmze2A2CL9MkluSbTCOfkQGY38AYn5An/a0GuyM6mwQV5N66ByizU+CeaZLmD7wfNowaVbTDUBqPUcI1TGjFZksPfCWwjhxOSzRy4F3i71NiTNC1E51GDJDNCXjoEfTUN5Cmsy+r31CRqoPzQhkFdt7x5VU9n6wT6bwMOj3Mr8StT8zmW9QojXaGoxHhB9hE3qIQkLTFQxYpEENOgafwvmJqDOfqjGYYqR6IL+SZS908Jtx9EDUrG6w4yIR2XoGT1+94wY6oCQY9kN2JgOZyi29dIs9Vw27YYJuN1PRh7TSMGBp2+QqenoLMc1CdZWlejN9Dohl5eVAjSZGdtUJQ06I4Elc5AvZFL8sFDPCw9rgkqY0G9kjNvcEps07Sw1sGQum5APYeYcwLr3LrvmIp6IaoTho7IDbknd+SWHIfeHpmQB98LM0Xob38DPLQTObhgZngAAAAASUVORK5CYII' },
		{name:'Subscene', url:'https://subf2m.co/subtitles/searchbytitle?query=%title', icon:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwEHAQkIAQgKCgkLDRYPDQEMDRsUFQQWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Kzc3Kzc3Nzc3Nzc3Nys3Nzc3Nzc3Kzc3NzcrNys3Nzc3Nzc3Nzc3Nzc3Nzc3Nys3N//AABEIABAAEAMBIgACEQEDEQH/xAAWAAEBAQAAAAAAAAAAAAAAAAAFBAL/xAAqEAAABAQEBAcAAAAAAAAAAAABAgMRBAUGBwATITEIQVFxEhQXGCIjMv/EABQBAQAAAAAAAAAAAAAAAAAAAAX/xAAXEQADAQAAAAAAAAAAAAAAAAABAhIA/9oADAMBAAIRAxEAPwA6ioCxs04oPLXuAD/ScyFsTKCmE7VD8kEwag+u3TB1Sp0lD8QyyNKS9aX5bAeyiqnjGEM2rDzDpvjMjX4WE7hH92JIrJMQQTrOFMAHlZ+RmHdu+KK2n1BTy7cMe3OedOGhiIeqkQ2bOhB/kZu+ECTWMVRG/9k='}




    ];



    var id = location.pathname.match(/\/tt(\d+)\//)[1];
    var title = document.title.match(/^(.*?)\s\(.*\d{4}.*\)(?=\s\-\sIMDb)/)[1];
    var year = document.title.match(/\(.*(\d{4}).*\)(?=\s\-\sIMDb)/)[0];
    	if (year.match(/\((\d{4})\)/)) {
			year = year.replace(year, RegExp.$1);
		} else {
			year = year.replace(year, '');
		}
	function html() {
		var h = '';
		for(var i = 0, len = sites.length; i < len; i++) {
			var s = sites[i];
			h += s ? '<span><a href="' + url(s) + '" target="_blank"><img src="' + s.icon + '" title="' + s.name + '"><\/a>&nbsp;</span>' : '&nbsp;&nbsp;';
		}
		return h;
	}
	function url(site) {
		var u = site.url.replace(/%id/, id);
		if (u.match(/%title\[(.*?)\]/)) {
			u = u.replace(/%title\[.*?\]/, encodeURIComponent(title.replace(/ /g, RegExp.$1)));
		} else {
			u = u.replace(/%title/, encodeURIComponent(title));
		}
		if (u.match(/\(?%year\)?/)) {
            u = u.replace(/\(?%year\)?/, encodeURIComponent(year));
		}
		return u;
	}

	var bar = document.createElement('div');
	bar.style.cssText = 'position:relative; text-align:left;';
	bar.innerHTML = html();
	var h1 = document.querySelector('h1');
	h1.style.position = 'relative';
	h1.appendChild(bar);

})();
