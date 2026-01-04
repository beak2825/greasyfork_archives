// ==UserScript==
// @name         NYC School Closure Dates
// @namespace    http://tampermonkey.net/
// @version      2024-02-16
// @description  Provide Google Calendar links for NYC school closures.
// @author       You
// @match        https://portal.311.nyc.gov/article/?kanumber=KA-02522
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyc.gov
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487473/NYC%20School%20Closure%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/487473/NYC%20School%20Closure%20Dates.meta.js
// ==/UserScript==

var tables = document.getElementsByClassName("tg");
for (var t = 0; t < tables.length; t++) {
	var rows = tables[t].getElementsByTagName("tr");
	for (var r = 0; r < rows.length; r++) {
		var range = rows[r].getElementsByTagName("td")[0];
		var year = new Date().getFullYear() - 1;
		if (t == 1) year = new Date().getFullYear();
		if (range) {
			var go = true;
			var subject = rows[r].getElementsByTagName("td")[1].textContent;
			if (subject.indexOf("All other public schools are open.") > -1) {
                // This is if your kid is in elementary school.
				if (subject.indexOf("elementary") == -1 || subject.indexOf("K–12 schools") == -1) {
					go = false;
				} else {
					subject = subject.split("Day")[0] + "Day";
				}
			}
			if (go) {
				subject = subject.replace(/ /g, "+");
				subject = subject.replace("/", "--");

				var temp = range.textContent.split(" ");
				var range1 = temp[0] + " " + temp[1] + " " + temp[2] + ", " + year;
                var range2 = range1;
				if (temp.length > 3) {
                    range2 = temp[4] + " " + temp[5] + " " + temp[6] + ", " + year;
				}

				var basedate = new Date(range1);
				var starting = basedate.toISOString();
				starting = starting.replace(/[-:]/g, "").substr(0,8);

				basedate.setHours(basedate.getHours() + 24);
				var ending = basedate.toISOString();
				ending = ending.replace(/[-:]/g, "").substr(0,8);

				var href = "https://www.google.com/calendar/render?action=TEMPLATE&text=" + subject + "&dates=" + starting + "%2F" + ending + "&src=kit.k.schelin@gmail.com";
				if (range2 != range1) {
					basedate = new Date(range2);
					var final = basedate.toISOString();
					final = final.replace(/[-:]/g, "").substr(0,8) + "T000000";
					href += "&recur=RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=" + final;
				}
				// Put it away now
				var newCell = document.createElement("td");
				var newLink = document.createElement("a");
				newLink.setAttribute("href", href);
				newLink.appendChild(document.createTextNode("GCal"));
				newCell.append(newLink);
				rows[r].appendChild(newCell);
			}
		}
	}
}
