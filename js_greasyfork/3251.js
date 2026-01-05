// ==UserScript==
// @name        Mturk Expanded Header (Cached)
// @namespace   DonovanM
// @author		DonovanM (dnast)
// @description Gives you an expanded header on Mturk (Mechanical Turk) with transfer balance and Worker ID without polling on every page load. This will reduce maximum request rate errors for people that use expanded header scripts. This also works on the latest Firefox (the other scripts will break soon).
// @include     https://www.mturk.com/mturk/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @version     0.9.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3251/Mturk%20Expanded%20Header%20%28Cached%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3251/Mturk%20Expanded%20Header%20%28Cached%29.meta.js
// ==/UserScript==


/** Users can change the values below to their liking. The cache_time is the
    number of minutes before the balance is checked again. For the colors
    you can use hex i.e. "#ABC123" or RBG(A) i.e. "rgba(100,255,220, .8)".
	Just make sure the color values are in quotes (but not the cache time).
**/
var UserSettings = { };
UserSettings.cache_time = 5;			// Minutes to wait between updating
UserSettings.idColor = "#c60";			// Color of the WorkerId highlight
UserSettings.balanceColor = "#03B603";	// Color of the balance amount. Use "#000" to go back to black
/** End of user settings **/


var LOCAL_STORAGE = "expanded_header_data";

$(document).ready(function() {
	var header = new Header();

	// Update the values in the header when another page does an update
	window.addEventListener('storage', function(e) {
		if (e.key === LOCAL_STORAGE)
			header.setValues(JSON.parse(e.newValue));
		}, false);
});

function Header() {
	this.DASHBOARD = "https://www.mturk.com/mturk/dashboard";
	this.CACHE_TIME = UserSettings.cache_time * 60000; // Convert mins to millis
	this.isSignedIn = false;
	this.init();
}

Header.prototype.init = function() {
	this.addStyle();
	this.addDiv();
	this.getData();
}

Header.prototype.addDiv = function() {
	// Get the place in the document to add the header
	var container = $("#user_name_field").parent();

	if (container.length === 0)
		container = $("#lnkWorkerSignin").parent();
	else
		this.isSignedIn = true;

	// Create the div
	var div = $("<div>").attr('id', "expandedHeader")
		.append(
			"Transfer Balance: ",
			$("<span>").addClass("balance"),
			" | Worker ID: ",
			$("<input>").addClass("workerId").prop('readonly', true)
				.hover(function() {	$(this).select(); }, function() { $(this).focus(); $(this).blur(); })
		);

	// Add the div to the page
	container.append(div);
}

Header.prototype.getData = function() {
	// Get cached data from local storage and get the current time
	var data = JSON.parse(localStorage.getItem(LOCAL_STORAGE));
	var currentTime = new Date().getTime();

	if (document.URL === this.DASHBOARD) {
		// If we're already on the dashboard then just get the info from this page
		var values = this.getValues($("body").html());
		this.setValues(values);
		this.storeData(values);

	} else if ((data !== null) && (!this.isSignedIn || (currentTime - data.timestamp < this.CACHE_TIME))) {
		// If the info is cached but the cache time hasn't been exceeded, load the cached values.
		// Or if user isn't logged in, use cached values no matter how old.
		this.setValues(data);

	} else if (this.isSignedIn) {
		// Otherwise load the data from mturk.com (if signed in)
		var self = this;

		this.loadData(function(results) {
			self.setValues(results);
			self.storeData(results);
		});
	} else {
		console.log("Not logged in and no cached data");
	}
}

Header.prototype.getValues = function(data) {
	var balance = $("#transfer_earnings .reward", data).text();
	var workerId = data.match(/Your Worker ID: ([0-9A-Z]+)/)[1];

	return { balance: balance, workerId: workerId };
}

Header.prototype.setValues = function(values) {
	$("#expandedHeader .balance").text(values.balance);
	$("#expandedHeader .workerId").attr('value', values.workerId);
}

Header.prototype.storeData = function(values) {
	localStorage.setItem(
		LOCAL_STORAGE,
		JSON.stringify({
			balance: values.balance,
			workerId: values.workerId,
			timestamp: new Date().getTime()
		})
	);	
}

Header.prototype.loadData = function(callback) {
	var self = this;

	$.get(this.DASHBOARD, function(data) {
		var values = self.getValues(data);
		callback({ workerId: values.workerId, balance: values.balance});
	})
}

Header.prototype.addStyle = function() {
 $("head").append("\
 	<style type=\"text/css\">\
 	#expandedHeader { margin: 1px }\
 	#expandedHeader .balance { font-weight: bold; color: " + UserSettings.balanceColor + " }\
 	#expandedHeader .workerId { font-weight: bold; border: none; width: 115px; color: " + UserSettings.idColor + " }\
 	</style>\
 	");
}
