// ==UserScript==
// @name         HD Kinopoisk: Look titles & Stop at end of serie|film.
// @namespace    https://hd.kinopoisk.ru/
// @version      0.2
// @description  Pushes Look Titles and stops playing at end of serie|film!
// @author       Someone_Who_Care
// @match        https://hd.kinopoisk.ru/film/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438907/HD%20Kinopoisk%3A%20Look%20titles%20%20Stop%20at%20end%20of%20serie%7Cfilm.user.js
// @updateURL https://update.greasyfork.org/scripts/438907/HD%20Kinopoisk%3A%20Look%20titles%20%20Stop%20at%20end%20of%20serie%7Cfilm.meta.js
// ==/UserScript==

(function() {
    'use strict';
var vas_paused = 0;
var need_pause = 0;
var elem;
var vid;
function b_filter() {
    var i;
    var slider;
	elem = document.getElementsByTagName("BUTTON");
    vid = document.getElementsByTagName("VIDEO");
	for (i=0; i<elem.length; i++) {
		if (elem[i].className != undefined) {
			if (elem[i].className.search('SkippableButtons__cancel') != -1) {
				if (elem[i].innerText == "Смотреть титры") {
					elem[i].click();
				};
			};
            if (vid[0] != undefined) {
                if ((vid[0].duration - vid[0].currentTime) < 4) {
                    if (vas_paused == 0) {
                        need_pause = 1;
                    };
                };
            };
            if (need_pause) {
                if (elem[i].className.search('BaseControl__button') != -1) {
                    if (elem[i].childNodes[0] != undefined) {
                        if (elem[i].childNodes[0].childNodes[0].childNodes[0].className.search('root_type_play') != -1) {
                            //
                            console.log("Clicking 'Pause'");
                            elem[i].click();
                            vas_paused = 1;
                            need_pause = 0;
                        };
                    };
                };
            };
		};
	};
};
var ButtonTimer = setInterval(b_filter, 500);

})();