// ==UserScript==
// @name         My Torn Time Table
// @namespace    https://bypxbyp.com
// @version      0.4.0
// @description  Shows your local time and a table to convert Torn time to your local time
// @license      MIT
// @author       BypXByp [3243346]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494773/My%20Torn%20Time%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/494773/My%20Torn%20Time%20Table.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    'use strict';

    var bShowOnLoad = 1; //Should the table automatically be expanded?  0=No, 1=Yes

    var theTimeTable;
    var timeSpan = document.querySelector('.server-date-time');

    if (timeSpan) {
        var timeString = timeSpan.textContent.trim();
        var timeRegex = /(\d{1,2}):(\d{2}):(\d{2})/;
        var match = timeString.match(timeRegex);
        if (match) {
            var hours = parseInt(match[1], 10);
            var minutes = parseInt(match[2], 10);
            var seconds = parseInt(match[3], 10);

            var currentDate = new Date();
            var timeZoneOffsetMinutes = currentDate.getTimezoneOffset();
            var timeZoneOffsetHours = -1 * (timeZoneOffsetMinutes / 60);
            var timeZoneOffsetHoursInteger = Math.round(timeZoneOffsetHours);

            var tl0 = hours + timeZoneOffsetHours;
            var tl1 = hours + timeZoneOffsetHours + 1;
            var tl2 = hours + timeZoneOffsetHours + 2;
            var tl3 = hours + timeZoneOffsetHours + 3;
            var tl4 = hours + timeZoneOffsetHours + 4;
            var tl5 = hours + timeZoneOffsetHours + 5;
            var tl6 = hours + timeZoneOffsetHours + 6;
            var tl7 = hours + timeZoneOffsetHours + 7;
            var tl8 = hours + timeZoneOffsetHours + 8;
            var tl9 = hours + timeZoneOffsetHours + 9;
            var tl10 = hours + timeZoneOffsetHours + 10;
            var tl11 = hours + timeZoneOffsetHours + 11;
            var tl12 = hours + timeZoneOffsetHours + 12;
            var tl13 = hours + timeZoneOffsetHours + 13;
            var tl14 = hours + timeZoneOffsetHours + 14;
            var tl15 = hours + timeZoneOffsetHours + 15;
            var tl16 = hours + timeZoneOffsetHours + 16;
            var tl17 = hours + timeZoneOffsetHours + 17;
            var tl18 = hours + timeZoneOffsetHours + 18;
            var tl19 = hours + timeZoneOffsetHours + 19;
            var tl20 = hours + timeZoneOffsetHours + 20;
            var tl21 = hours + timeZoneOffsetHours + 21;
            var tl22 = hours + timeZoneOffsetHours + 22;
            var tl23 = hours + timeZoneOffsetHours + 23;
            if (tl0 < 0) tl0 += 24;
            if (tl1 < 0) tl1 += 24;
            if (tl2 < 0) tl2 += 24;
            if (tl3 < 0) tl3 += 24;
            if (tl4 < 0) tl4 += 24;
            if (tl5 < 0) tl5 += 24;
            if (tl6 < 0) tl6 += 24;
            if (tl7 < 0) tl7 += 24;
            if (tl8 < 0) tl8 += 24;
            if (tl9 < 0) tl9 += 24;
            if (tl10 < 0) tl10 += 24;
            if (tl11 < 0) tl11 += 24;
            if (tl12 < 0) tl12 += 24;
            if (tl13 < 0) tl13 += 24;
            if (tl14 < 0) tl14 += 24;
            if (tl15 < 0) tl15 += 24;
            if (tl16 < 0) tl16 += 24;
            if (tl17 < 0) tl17 += 24;
            if (tl18 < 0) tl18 += 24;
            if (tl19 < 0) tl19 += 24;
            if (tl20 < 0) tl20 += 24;
            if (tl21 < 0) tl21 += 24;
            if (tl22 < 0) tl22 += 24;
            if (tl23 < 0) tl23 += 24;
            if (tl0 > 23) tl0 -= 24;
            if (tl1 > 23) tl1 -= 24;
            if (tl2 > 23) tl2 -= 24;
            if (tl3 > 23) tl3 -= 24;
            if (tl4 > 23) tl4 -= 24;
            if (tl5 > 23) tl5 -= 24;
            if (tl6 > 23) tl6 -= 24;
            if (tl7 > 23) tl7 -= 24;
            if (tl8 > 23) tl8 -= 24;
            if (tl9 > 23) tl9 -= 24;
            if (tl10 > 23) tl10 -= 24;
            if (tl11 > 23) tl11 -= 24;
            if (tl12 > 23) tl12 -= 24;
            if (tl13 > 23) tl13 -= 24;
            if (tl14 > 23) tl14 -= 24;
            if (tl15 > 23) tl15 -= 24;
            if (tl16 > 23) tl16 -= 24;
            if (tl17 > 23) tl17 -= 24;
            if (tl18 > 23) tl18 -= 24;
            if (tl19 > 23) tl19 -= 24;
            if (tl20 > 23) tl20 -= 24;
            if (tl21 > 23) tl21 -= 24;
            if (tl22 > 23) tl22 -= 24;
            if (tl23 > 23) tl23 -= 24;
            var tc0 = hours;
            var tc1 = hours + 1;
            var tc2 = hours + 2;
            var tc3 = hours + 3;
            var tc4 = hours + 4;
            var tc5 = hours + 5;
            var tc6 = hours + 6;
            var tc7 = hours + 7;
            var tc8 = hours + 8;
            var tc9 = hours + 9;
            var tc10 = hours + 10;
            var tc11 = hours + 11;
            var tc12 = hours + 12;
            var tc13 = hours + 13;
            var tc14 = hours + 14;
            var tc15 = hours + 15;
            var tc16 = hours + 16;
            var tc17 = hours + 17;
            var tc18 = hours + 18;
            var tc19 = hours + 19;
            var tc20 = hours + 20;
            var tc21 = hours + 21;
            var tc22 = hours + 22;
            var tc23 = hours + 23;
            if (tc0 > 23) tc0 -= 24;
            if (tc1 > 23) tc1 -= 24;
            if (tc2 > 23) tc2 -= 24;
            if (tc3 > 23) tc3 -= 24;
            if (tc4 > 23) tc4 -= 24;
            if (tc5 > 23) tc5 -= 24;
            if (tc6 > 23) tc6 -= 24;
            if (tc7 > 23) tc7 -= 24;
            if (tc8 > 23) tc8 -= 24;
            if (tc9 > 23) tc9 -= 24;
            if (tc10 > 23) tc10 -= 24;
            if (tc11 > 23) tc11 -= 24;
            if (tc12 > 23) tc12 -= 24;
            if (tc13 > 23) tc13 -= 24;
            if (tc14 > 23) tc14 -= 24;
            if (tc15 > 23) tc15 -= 24;
            if (tc16 > 23) tc16 -= 24;
            if (tc17 > 23) tc17 -= 24;
            if (tc18 > 23) tc18 -= 24;
            if (tc19 > 23) tc19 -= 24;
            if (tc20 > 23) tc20 -= 24;
            if (tc21 > 23) tc21 -= 24;
            if (tc22 > 23) tc22 -= 24;
            if (tc23 > 23) tc23 -= 24;

            var newHours = hours + timeZoneOffsetHours;
            var sMinutesLead = "";
            if (minutes < 10) sMinutesLead = "0";

            theTimeTable = '<div><div><a class="toggleCollapseTimeTable" style="cursor: pointer;">Toggle Time Table</a></div><table id="myTornTimeTable" style="color:#e3e3e3;text-align:center;width:100%;"><tr><td colspan=3 style="border-bottom: 1pt solid black;border-top: 1pt solid black;color:#e3e3e3;">Local: ' + tl0 + ':' + sMinutesLead + minutes + '</td></tr><tr><td style="color:#e3e3e3;" width=33%>Add</td><td style="color:#e3e3e3;" width=34%>TCT</td><td style="color:#e3e3e3;" width=33%>Local</td></tr><tr><td style="color:#e3e3e3;">1</td><td style="color:#e3e3e3;">' + tc1 + '</td><td style="color:#e3e3e3;">' + tl1 + '</td></tr><tr><td style="color:#e3e3e3;">2</td><td style="color:#e3e3e3;">' + tc2 + '</td><td style="color:#e3e3e3;">' + tl2 + '</td></tr><tr><td style="color:#e3e3e3;">3</td><td style="color:#e3e3e3;">' + tc3 + '</td><td style="color:#e3e3e3;">' + tl3 + '</td></tr><tr><td style="color:#e3e3e3;">4</td><td style="color:#e3e3e3;">' + tc4 + '</td><td style="color:#e3e3e3;">' + tl4 + '</td></tr><tr><td style="color:#e3e3e3;">5</td><td style="color:#e3e3e3;">' + tc5 + '</td><td style="color:#e3e3e3;">' + tl5 + '</td></tr><tr><td style="color:#e3e3e3;">6</td><td style="color:#e3e3e3;">' + tc6 + '</td><td style="color:#e3e3e3;">' + tl6 + '</td></tr><tr><td style="color:#e3e3e3;">7</td><td style="color:#e3e3e3;">' + tc7 + '</td><td style="color:#e3e3e3;">' + tl7 + '</td></tr><tr><td style="color:#e3e3e3;">8</td><td style="color:#e3e3e3;">' + tc8 + '</td><td style="color:#e3e3e3;">' + tl8 + '</td></tr><tr><td style="color:#e3e3e3;">9</td><td style="color:#e3e3e3;">' + tc9 + '</td><td style="color:#e3e3e3;">' + tl9 + '</td></tr><tr><td style="color:#e3e3e3;">10</td><td style="color:#e3e3e3;">' + tc10 + '</td><td style="color:#e3e3e3;">' + tl10 + '</td></tr><tr><td style="color:#e3e3e3;">11</td><td style="color:#e3e3e3;">' + tc11 + '</td><td style="color:#e3e3e3;">' + tl11 + '</td></tr><tr><td style="color:#e3e3e3;">12</td><td style="color:#e3e3e3;">' + tc12 + '</td><td style="color:#e3e3e3;">' + tl12 + '</td></tr><tr><td style="color:#e3e3e3;">13</td><td style="color:#e3e3e3;">' + tc13 + '</td><td style="color:#e3e3e3;">' + tl13 + '</td></tr><tr><td style="color:#e3e3e3;">14</td><td style="color:#e3e3e3;">' + tc14 + '</td><td style="color:#e3e3e3;">' + tl14 + '</td></tr><tr><td style="color:#e3e3e3;">15</td><td style="color:#e3e3e3;">' + tc15 + '</td><td style="color:#e3e3e3;">' + tl15 + '</td></tr><tr><td style="color:#e3e3e3;">16</td><td style="color:#e3e3e3;">' + tc16 + '</td><td style="color:#e3e3e3;">' + tl16 + '</td></tr><tr><td style="color:#e3e3e3;">17</td><td style="color:#e3e3e3;">' + tc17 + '</td><td style="color:#e3e3e3;">' + tl17 + '</td></tr><tr><td style="color:#e3e3e3;">18</td><td style="color:#e3e3e3;">' + tc18 + '</td><td style="color:#e3e3e3;">' + tl18 + '</td></tr><tr><td style="color:#e3e3e3;">19</td><td style="color:#e3e3e3;">' + tc19 + '</td><td style="color:#e3e3e3;">' + tl19 + '</td></tr><tr><td style="color:#e3e3e3;">20</td><td style="color:#e3e3e3;">' + tc20 + '</td><td style="color:#e3e3e3;">' + tl20 + '</td></tr><tr><td style="color:#e3e3e3;">21</td><td style="color:#e3e3e3;">' + tc21 + '</td><td style="color:#e3e3e3;">' + tl21 + '</td></tr><tr><td style="color:#e3e3e3;">22</td><td style="color:#e3e3e3;">' + tc22 + '</td><td style="color:#e3e3e3;">' + tl22 + '</td></tr><tr><td style="color:#e3e3e3;">23</td><td style="color:#e3e3e3;">' + tc23 + '</td><td style="color:#e3e3e3;">' + tl23 + '</td></tr></table></div>';
        } else {
            theTimeTable = 'Error (i2)';
        }
    } else {
        theTimeTable = 'Error (i1)';
    }

    var tempDiv = document.createElement('div');

    tempDiv.innerHTML = theTimeTable;

    while (tempDiv.firstChild) {
        timeSpan.parentNode.insertBefore(tempDiv.firstChild, timeSpan.nextSibling);
    }

    if (bShowOnLoad) {
		$('#myTornTimeTable').css('display', '');
	} else {
		$('#myTornTimeTable').css('display', 'none');
	}

	waitForElementToExist('.toggleCollapseTimeTable').then(()=>{
		$('.toggleCollapseTimeTable').on('click', function() {
			if ($('#myTornTimeTable').css('display') == 'none') {
				$('#myTornTimeTable').css('display', '');
			} else {
				$('#myTornTimeTable').css('display', 'none');
			}
		})
	})

	function waitForElementToExist(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}
			const observer = new MutationObserver(() => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				}
			});
			observer.observe(document.body, {
				subtree: true,
				childList: true,
			});
		});
	}
}, false);