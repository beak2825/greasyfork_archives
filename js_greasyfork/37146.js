// ==UserScript==
// @name         MouseHunt - Tournament Time Helper
// @author       Jia Hao (Limerence#0448 @Discord)
// @namespace    https://greasyfork.org/en/users/165918-jia-hao
// @version      1.81
// @description  Automatically converts "Begins in:" to your local time as well as adding the end time for tournaments.
// @include      http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/locale/en-ie.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/37146/MouseHunt%20-%20Tournament%20Time%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/37146/MouseHunt%20-%20Tournament%20Time%20Helper.meta.js
// ==/UserScript==

function saveTimeFormat() {
    var tournaments = document.getElementsByClassName("tournamentPage-tournamentRow tournamentPage-tournamentData basic pending");
    var timeFormatCheckbox = document.getElementById('timeformat');
    var startTime, endTime, day, date, time;

    if (timeFormatCheckbox.checked) {
        window.localStorage.setItem('timeformat', '24-hour'); //save settings
        for (i = 0; i < tournaments.length; i++) {
            startTime = tournaments[i].children[3].innerHTML.split("<br>");
            endTime = tournaments[i].children[4].innerHTML.split("<br>");
            day = startTime[0];
            date = startTime[1];
            time = startTime[2];
            tournaments[i].children[3].innerHTML = moment(day + " " + date + " " + time, "dddd D MMM YYYY h:mm A").format("dddd<br>D MMM YYYY<br>HH:mm").concat(" hrs");
            day = endTime[0];
            date = endTime[1];
            time = endTime[2];
            tournaments[i].children[4].innerHTML = moment(day + " " + date + " " + time, "dddd D MMM YYYY h:mm A").format("dddd<br>D MMM YYYY<br>HH:mm").concat(" hrs");
        }
    } else {
        window.localStorage.setItem('timeformat', '12-hour'); //save settings
        for (i = 0; i < tournaments.length; i++) {
            startTime = tournaments[i].children[3].innerHTML.split("<br>");
            endTime = tournaments[i].children[4].innerHTML.split("<br>");
            day = startTime[0];
            date = startTime[1];
            time = startTime[2];
            tournaments[i].children[3].innerHTML = moment(day + " " + date + " " + time + " hrs", "dddd D MMM YYYY HH:mm").format("dddd<br>D MMM YYYY<br>h:mm A");
            day = endTime[0];
            date = endTime[1];
            time = endTime[2];
            tournaments[i].children[4].innerHTML = moment(day + " " + date + " " + time + " hrs", "dddd D MMM YYYY HH:mm").format("dddd<br>D MMM YYYY<br>h:mm A");
        }
    }
}

function load() {

    //Get local time and time format preference
    var now = moment(new Date());
    if (Math.abs(moment(now).zone()) % 60 > 0) {
        now.add('minutes', 30);
    }
    var timeFormat = "12-hour";

    try {
        timeFormat = window.localStorage.getItem('timeformat');
        if (timeFormat === null) { //Default time format is 12-hour.
            window.localStorage.setItem('timeformat', '12-hour');
        }
    } catch (e) {
        console.log('Browser does not support localStorage');
    }

	try {

        //Checkbox for user time format preference
        if (!document.getElementById('timeformat')) {
            var tournamentHeading = document.getElementsByClassName("tournamentPage-tournamentHeading")[0];
            tournamentHeading.innerHTML += " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            tournamentHeading.innerHTML += "<input id='timeformat' type='checkbox'>Display timings in 24-hour format";
        }
        if (timeFormat === "24-hour") {
            document.getElementById('timeformat').checked = true;
        }
        $('#timeformat').click(function() {saveTimeFormat();});

		//Editing the Table
		//Shrinking tournament description to fit a new column
		var tournamentNames = document.getElementsByClassName("tournamentPage-tournament-column name");
		for (var i = 0; i < tournamentNames.length; i++) {
			tournamentNames[i].style.width = "35.5%";
		}

		//Changing the header "Begins in:" to "Begins at:"
		//Adding the header "Ends at:"
		//Looping since there are potentially special tournament tabs
		var beginsHeader = document.getElementsByClassName("tournamentPage-tournament-column label");
		for (i = 0; i < beginsHeader.length; i++) {
			if (beginsHeader[i].innerHTML === "Begins in:") {
                beginsHeader[i].style.marginRight = "0.15%";
                beginsHeader[i].insertAdjacentHTML('afterend', "<div class='tournamentPage-tournament-column label' style='margin-right:0.7%'>Begins at:</div><div class='tournamentPage-tournament-column label' style='margin-right:-0.55%'>Ends at:</div>");
			}
		}
        //Remove the labels "My Team" and "Action"
        beginsHeader[6].remove();
        beginsHeader[6].remove();

		//Replace starting times of each tournament
		var tournaments = document.getElementsByClassName("tournamentPage-tournamentRow tournamentPage-tournamentData basic pending");
		for (i = 0; i < tournaments.length; i++) {
			var beginsAt = tournaments[i].children[2].innerHTML;
			var duration = tournaments[i].children[3].innerHTML;
			var dayhourminute = beginsAt.split(" "); //[0][1] is first pair of [number][day/hour/minute left], [2][3] is second pair of [number][day/hour/minute left]
            if (dayhourminute.length == 2) {
                dayhourminute = [dayhourminute[0], dayhourminute[1], "0", "minute"];
            }
			var firstPair = [dayhourminute[0], dayhourminute[1]]; //firstPair[0] is numeric value, firstPair[1] is day/hour/minute
			var secondPair = [dayhourminute[2], dayhourminute[3]]; //secondPair[0] is numeric value, secondPair[1] is day/hour/minute
			var clonedTime = moment(now);
			var startTime = 0;
			var endTime = 0;
            clonedTime.startOf('second').startOf('minute');

			//Pluralize the words so that they can be used directly when adding time
			if (!firstPair[1].endsWith("s")) {
				firstPair[1] = firstPair[1].concat("s");
			}
			if (!secondPair[1].endsWith("s")) {
				secondPair[1] = secondPair[1].concat("s");
			}

			if (firstPair[1] === 'days' && secondPair[1] !== 'minutes') {
                //if time remaining starts with days, we have to round up the current hour
                clonedTime.add(1, 'hour').startOf('hour');

                //If there is a ".5" in the tournament name, add 30 minutes to the start time
                if (tournaments[i].children[1].text.includes('.5')) {
                    clonedTime.add(30, 'minute');
                }
			} else {
                //Since the starting time will not be exact to the second, add 1 minute to ensure that the hour displayed is 'overflowed'
                //(i.e The starting time will always be on the :59th minute, so adding 1 minute carries over to the next hour)
                clonedTime.add(1, 'minute');
            }


            //The start time of the tournament
			startTime = moment(clonedTime).add(firstPair[1], firstPair[0]).add(secondPair[1], secondPair[0]).startOf('minute').toDate();
            //End time of the tournament
			endTime = moment(startTime).add('hour', duration.split(" ")[0]);
			//Duration of the tournament
			tournaments[i].children[2].insertAdjacentHTML('afterend', "<div class='tournamentPage-tournament-column value'></div><div class='tournamentPage-tournament-column value'>" + duration + "</div>");

            if (timeFormat === '12-hour') {
                tournaments[i].children[3].innerHTML = moment(startTime).format("dddd<br>D MMM YYYY<br>h:mm A");
                tournaments[i].children[4].innerHTML = moment(endTime).format("dddd<br>D MMM YYYY<br>h:mm A");
            } else {
                tournaments[i].children[3].innerHTML = moment(startTime).format("dddd<br>D MMM YYYY<br>HH:mm").concat(" hrs");
                tournaments[i].children[4].innerHTML = moment(endTime).format("dddd<br>D MMM YYYY<br>HH:mm").concat(" hrs");
            }

		}
	} catch (err) {
		console.log(err);
	}
}


$(document).ready(function() {

    if ((window.location.href).includes("tournament.php")) {
        load();
    }

    var handle = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            var jsonString = JSON.parse(this.responseText);
            //First check is to see if user is at tournaments page, second check is to handle page 'refresh' after joining/leaving tournament
            if (jsonString.page_title === "MouseHunt | Tournaments" || jsonString.tournaments !== undefined) {
                load();
            }
        });
        handle.apply(this, arguments);
    };
});