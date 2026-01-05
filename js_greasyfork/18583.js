// ==UserScript==
// @name         MTurk Goals
// @namespace    http://greasyfork.org/
// @version      0.7
// @description  Add goals and progess bars to the mTurk Dashboard and Status pages.
// @author       Jacob Valenta
// @include      https://www.mturk.com/mturk/dashboard
// @include      https://www.mturk.com/mturk/status
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18583/MTurk%20Goals.user.js
// @updateURL https://update.greasyfork.org/scripts/18583/MTurk%20Goals.meta.js
// ==/UserScript==

var getJsonFromUrl = function(url){
    // Get GET parameters from a url as JSON
    // http://stackoverflow.com/a/8486146
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
        url = url,
        params = {},
        match;
    while(match = regex.exec(url)) {
        params[match[1]] = match[2];
    }
    return params;
};

var setGoal = function(newGoal){
    localStorage.setItem("mturk-goal", parseFloat(newGoal).toFixed(2).toString());
};

var getGoal = function(){
    if (localStorage.getItem("mturk-goal") === null) {
        setGoal(10.00);
        return 10.00;
    }else{
        return parseFloat(localStorage.getItem("mturk-goal"));
    }
};

var percentColors = [
    { pct: 0.0, color: { r: 0xc0, g: 0x50, b: 0x50 } },
    { pct: 0.5, color: { r: 0xc0, g: 0xc0, b: 0x50 } },
    { pct: 1.0, color: { r: 0x50, g: 0xc0, b: 0x50 } } ];

var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
};

var getPendingHitsForDate = function(date, pages, callback, prog_container, earned) {
    // Hastily written. I will work on refactoring this.

    // I gave up on javascript's Dates and UTC vs PDT and PST
    // Screw that, just parse the date out of amazon's url...
	var currentPage = 1;

    while (currentPage <= pages){
		var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            var requestedDate = this._date;

            if (request.readyState == 4 && request.status == 200) {
                var response = request.responseXML;
                var pending = 0.00;

                var hits = response.getElementById("dailyActivityTable").querySelectorAll("tr");
                for (var i = 1; i <= hits.length - 1; ++i) {
                    row = hits[i];

                    var value_column = row.querySelectorAll("td")[2];

                    if (value_column != undefined){
                        var amount = Math.round(100 * parseFloat(value_column.querySelector("span").innerText.replace('$', ''))) / 100;
                        pending += amount;
                    }

                }
                callback(pending, prog_container, earned);
            }
        };

		request.open("GET", "https://www.mturk.com/mturk/statusdetail?encodedDate=" + date + "&sortType=Pending&pageNumber=" + currentPage, true);
        request._date = date;
        request.responseType = "document";
		request.send();

        currentPage += 1;
	}
};

(function() {
    'use strict';

    var page, width, metrics, goal;
    if (location.pathname == "/mturk/dashboard"){
        page = "dashboard";
        width = "200";
    }
    else if (location.pathname == "/mturk/status"){
        page = "status";
        width = "100";
    }

    goal = getGoal();

    if (page == "dashboard"){
        metrics = document.querySelectorAll(".metrics-table")[3].querySelectorAll("tr");

        // Add a change goal button to the bottom of the Dashboard
        var change_goal = document.createElement("td");
        change_goal.innerHTML = 'Goal: <input id="goal" style="width:50px;" value="'+goal.toFixed(2)+'" />&nbsp;<input id="goal-button" type="button" value="Set" style="border: 2px outset buttonface; background-color: buttonface" />';
        var last_td = metrics[metrics.length - 1].querySelectorAll("td")[0];
        last_td.setAttribute("colspan", "9");

        metrics[metrics.length -1].insertBefore(change_goal, last_td);

        // Add click callback
        document.getElementById("goal-button").addEventListener("click", function(){
            // Set goal from input and refresh page
            setGoal(document.getElementById("goal").value);
            location.reload();
        });
    }
    else if (page == "status"){
        metrics = document.querySelectorAll('table')[6].querySelectorAll("tr");
    }

    for (var i = 1; i < metrics.length - 1; ++i) {
        var row = metrics[i];
        var earned = parseFloat(row.querySelectorAll("td:last-child")[0].innerText.replace('$', ''));

        var fraction = (earned / goal);

        var prog = fraction * width;

        var progress_container = document.createElement('div');
        var progress = document.createElement('div');
        var progress_label = document.createElement('div');

        // TODO: Add actual CSS and classes to DOM.
        progress_container.setAttribute("style", "display: inline-block; float: right; width: " + width + "px; height: 6px; background-color: #eee; border: 1px solid #888; margin-top: 3px; border-radius: 1px");
        progress.setAttribute("style", "width: " + prog + "px; max-width: "+width+"px; height: 6px; background-color: "+ getColorForPercentage(fraction) + ";");      

        progress_label.setAttribute("style", "float: right; display: inline-block;");
        progress_label.innerHTML = (Math.round((fraction * 100) * 10) / 10).toFixed(1).toString() + "%&nbsp;&nbsp;";

        progress_container.appendChild(progress);

        row.querySelectorAll("td")[0].appendChild(progress_label).appendChild(progress_container);

        // Get pending hits and add another progress bar
        var dateString = getJsonFromUrl(row.querySelector('td a').getAttribute("href"));
        var pendingHits = parseInt(row.querySelectorAll("td")[4].innerText);
        var pages = Math.ceil(pendingHits / 25);
        if (pendingHits > 0){
            getPendingHitsForDate(dateString.encodedDate, pages, function(amount, container, accepted){
                var pending_earned = accepted + amount;
                var pending_fraction = (pending_earned / goal);
                var pending_prog = pending_fraction * width;

                var pending_progress = document.createElement('div');
                pending_progress.setAttribute("style", "margin-top: -6px; max-width:"+width+"px; height: 6px; opacity: 0.5");
                pending_progress.style.width = pending_prog;
                pending_progress.style["background-color"] = getColorForPercentage(pending_fraction);

               container.appendChild(pending_progress);
            }, progress_container, earned);
        }
    }
})();