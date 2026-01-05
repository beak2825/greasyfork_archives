// ==UserScript==
// @author        Xiphias[187717]
// @name          Torn City - User Profiles Extension
// @namespace     Xiphias[187717]
// @description   Quickly see stats on a player on their user profile page
// @include       http://www.torn.com/profiles.php*
// @include       http://torn.com/profiles.php*
// @include       https://www.torn.com/profiles.php*
// @include       https://torn.com/profiles.php*
// @include       *.torn.com/personalstats.php*
// @include       https://torn.com/personalstats.php*
// @version       1.0.5
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/23250/Torn%20City%20-%20User%20Profiles%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/23250/Torn%20City%20-%20User%20Profiles%20Extension.meta.js
// ==/UserScript==

function DEBUG(obj) {
    // console.log prints a snapshot of the object, but may not log the correct state
    // so use this hack to log the actual state
    console.log(JSON.parse(JSON.stringify(obj)));
}


function getUserIDFromStatsPage(url) {
    var regex = /ID=\d+,(\d+)/g;

    var match = regex.exec(url);
    if (match != null) {
        return parseInt(match[1]);
    }
    console.log(" No User ID found.");
    return 0;
}

function insertAttackButtonInStatsPage(userId){
   var attack_button = $('<a id="myattackbutton" class=" awards t-clear h c-pointer  m-icon line-h24 right last" href=""><span>Attack</span></a>');
   attack_button.attr("href", "https://www.torn.com/loader2.php?sid=getInAttack&user2ID=" + userId.toString());
   $("#custom_stats").after(attack_button);
}

var APIKEY = "";


// implementation

const noop = () => {}

const custom_fetch = (fetch, {
	onrequest = noop,
	onresponse = noop,
	onresult = noop,
	onbody = [],
}) => async (input, init) => {
	onrequest(input, init)
	const response = await fetch(input, init)
	onresponse(response)

	for (const handler of onbody) {
		if (handler.match(response)) {
			Promise.resolve(handler.execute(response.clone()))
				.then((result) => onresult(result))
		}
	}

	return response
}

const intercept_fetch = (options) => (window.fetch = custom_fetch(fetch, options))

// usage

intercept_fetch({
	onrequest: (input, init) => noop,
	onresponse: (response) => noop,

	onbody: [{
		match: (response) => response.url.includes('personalstats.php'),
		execute: (response) => response.json().then((json) => {
            DEBUG('got request - parsing started');

            DEBUG(json);
            callbackDefends(json, 0);
            /*saveData(json).then(([parsed_data, isActive]) => {
                createPlot(parsed_data, isActive);
            }).catch(err => {
                DEBUG("Error")
                DEBUG(err);
            });*/
            }),
	}],
})




$(document).ready(function () {
	runScript();
});

function getUserID() {
	var url = window.location.href;
	var regex = /XID=(\d+)/g;

	var match = regex.exec(url);
	if (match != null) {
		return parseInt(match[1]);
	}
	console.log(" No User ID found.");
	return 0;
}

function getStats(userID) {
	var response = $.ajax({
			type : 'GET',
			url : '//api.torn.com/user/' + userID.toString() + "?selections=personalstats&key=" + APIKEY,
			async : false,
		}).responseText;

	return JSON.parse(response);
}

function callback(data) {
	var userID = data;

	if (userID == -1 || userID === undefined || userID == null) {
		console.log("callback: You are not going anywhere");
	} else {
		console.log("callback: Whats going on: " + userID);
		window.location.href = "//www.torn.com/profiles.php?XID=" + userID;
	}
	return data;
}

function findNextUser(userID, callback) {
	var json = getStats(userID);
	if (json) {
		if (json.error && json.error.error == "Incorrect ID") {
			setTimeout(function () {
				var userid = findNextUser(userID + 1, callback);
				callback(userid);
			}, 500);
		} else if (json.error && json.error.error == "Too many requests") {
			setTimeout(function () {
				var userid = findNextUser(userID, callback);
				callback(userid);
			}, 3000);
		} else {
			return userID;
		}
	} else {
		console.log("Something went wrong with findNextUser or getStats");
		return -1;
	}
}

function isUserNotFound() {
	return $("#mainContainer").find(".msg.right-round").text().trim().startsWith("User could not be");
}

function runScript() {

    if (window.location.href.includes("personalstats.php")){
        var html = $('<div class="profile-left-wrapper"><div class="menu-header">Stats</div><div id="custom_stats" class="profile-container basic-info bottom-round"></div></div>');
        $("#chartSection").after(html);
    } else {

        var currentUserID = getUserID();

        if (isUserNotFound()) {
            var userID = findNextUser(currentUserID, callback);
            if (userID == -1 || userID === undefined || userID == null) {
                console.log("You are not going anywhere");
            } else {
                console.log("Whats going on: " + userID);
                window.location.href = "//www.torn.com/profiles.php?XID=" + userID;
            }

        } else {
            insertStatBox();
            insertNavigationButtons();
            var user_status = isValidUser();
            var tagged_status = isAlreadyTagged();
            if (tagged_status === null) {
                if (user_status === null) {
                    var json = getStats(currentUserID);
                    var stats = getInterestingStats(json);
                    $("#custom_stats").append("<p>" + stats + "</p>");
                } else {
                    $("#custom_stats").append("<p>" + user_status + "</p>");
                }
            } else {
                $("#custom_stats").append("<p>" + tagged_status + "</p>");
            }
        }
    }
}

function insertStatBox() {
	var html = $('<div class="profile-left-wrapper"><div class="menu-header">Stats</div><div id="custom_stats" class="profile-container basic-info bottom-round"></div></div>');
	$(".tutorial-cont.m-top10").after(html);
}

function insertNavigationButtons() {
	var userID = getUserID();
	var nextUser = '<a href="/profiles.php?XID=' + (userID + 1) + '" style="float: right;">Next User &gt; </a>';
	$("#35").after(nextUser);
}


function getInterestingStats(json) {
	var stats = json.personalstats;
	var obj = [];

	if (stats.xantaken) {
		obj.push("Xanax:   " + stats.xantaken);
	} else {
		obj.push("Xanax:   " + 0);
	}

	if (stats.refills) {
		obj.push("Refills:  " + stats.refills);
	} else {
		obj.push("Refills:  " + 0);
	}

	if (stats.defendswon) {
		obj.push("Defends won:  " + stats.defendswon);
	} else {
		obj.push("Defends won:  " + 0);
	}

	if (stats.defendslost) {
		obj.push("Defends lost:  " + stats.defendslost);
	} else {
		obj.push("Defends lost:  " + 0);
	}

	return obj;

}

function find_date_start_index(labels){
    var start_date_index = 0;
    for (var i = 0; i < labels.length; ++i){
        if (labels[i] === "2019-11-04") {
            start_date_index = i;
        }
    }

    return start_date_index;
}

function callbackDefends(data, actual_defends_lost) {

	if (data != null || data === undefined) {
		if (data.hasOwnProperty('datasets')) {

			var loss_data = data.datasets[1].data;
			//$("#custom_stats").append("<p>Def: " + data.toString() + "</p>");

            var labels = data.labels;
            var start_date_index = find_date_start_index(labels);
            insertAttackButtonInStatsPage(data.datasets[1].id);
            DEBUG("Start date index:");
            DEBUG(start_date_index);
			if (loss_data) {
				var a = loss_data;
                if (a[0] == a[start_date_index]) {
                    if (a[0] == a[a.length - 1]) {
                        $("#custom_stats").append("<p style='color: rgb(0,125,0); '>Def: " + loss_data.toString() + "</p>");
                    } else {
                        $("#custom_stats").append("<p style='color: rgb(0,125,0); '>Def: " + loss_data.toString() + "</p>");
                    }
                } else {
                    $("#custom_stats").append("<p style='color: rgb(125,0,0); '>Def: " + loss_data.toString() + "</p>");
                }
			} else {
				$("#custom_stats").append("<p style='color: rgb(125,0,0); '> Could not extract defends lost data." + "</p>");
			}

		}
	}
}

function isAlreadyTagged() {
	var dog_tag_status = $('.profile-container.competition-wrap.p10.dog-tags').find('.return-msg').text().trim();
	if (dog_tag_status.startsWith("You currently hold")) {
		return "You already have this persons tag!";
	}
	return null;
}

function isValidUser() {
	var is_valid = true;
	var status = $('.profile-status').find('.profile-container-description').text().trim();
	if (status.startsWith("In federal jail")) {
	 is_valid = false;
	} else if (status.startsWith("In hospital")) {
   is_valid = false;
	} else if (status.startsWith("Traveling to ")) {
   is_valid = false;
	} else if (status.startsWith("Traveling back to")) {
   is_valid = false;
	} else if (status.startsWith("Currently in ")) {
   is_valid = false;
	}
	if (is_valid) {
		return null;
	}
	return status;
}

