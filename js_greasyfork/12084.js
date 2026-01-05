// ==UserScript==
// @name		MTurk HIT Database Goals Edition (Beta)
// @namespace https://greasyfork.org/users/12875
// @description Adds Today's Goal and Longterm Goal, as well as bonus tracking, to the venerable HIT Database script, which originally included: Extended ability to search HITs you have worked on and other useful tools (CSV export/import, requester notes, requester block, pending/projected earnings)
// @include	 https://www.mturk.com/mturk/searchbar*
// @include	 https://www.mturk.com/mturk/findhits*
// @include	 https://www.mturk.com/mturk/viewhits*
// @include	 https://www.mturk.com/mturk/viewsearchbar*
// @include	 https://www.mturk.com/mturk/sortsearchbar*
// @include	 https://www.mturk.com/mturk/sorthits*
// @include	 https://www.mturk.com/mturk/dashboard
// @include	 https://www.mturk.com/mturk/preview?*
// @include	 https://www.mturk.com/mturk/return*
// @include	 https://www.mturk.com/mturk/submit*
// @include	 https://www.mturk.com/mturk/status*
// @include	 https://www.mturk.com/mturk/deletefromdb*
// @include	 https://www.mturk.com/hitdb*
// @version	 1.10.0.008
// @grant		GM_log
// @require	 https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.js
// @require	 https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.1/js/jquery.tablesorter.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.2/js/jquery.tablesorter.widgets.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.2/js/extras/jquery.tablesorter.pager.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.2/js/widgets/widget-math.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.3/js/widgets/widget-output.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/qtip2/2.2.1/jquery.qtip.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.0/moment-timezone-with-data-2010-2020.js
// @require	 https://greasyfork.org/scripts/2351-jsdiff/code/jsdiff.js?version=6256
// @require	 https://greasyfork.org/scripts/2350-filesaver-js/code/filesaverjs.js?version=6255
// @require	 http://code.highcharts.com/highcharts.js
// @downloadURL https://update.greasyfork.org/scripts/12084/MTurk%20HIT%20Database%20Goals%20Edition%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12084/MTurk%20HIT%20Database%20Goals%20Edition%20%28Beta%29.meta.js
// ==/UserScript==

// **** NOTE about Goals Edition ****
// Goals Edition incorporates changes by Kevin Schumacher/tubedogg on greasyfork and MTG. These changes are primarily centered around the display of projected/pending earnings and goals (called target in the previous version) on the MTurk dashboard.
// The changelog that was previously here (from 2012/2013) has been moved to the bottom of the script.
// **** ************************ ****

// ************** CHANGELOG (Goals Edition) **************
// v1.10.0	Firefox compatibility! Revamped search and overview screens with sortable and filter-able columns.
//          Enhanced backup including bonuses and settings. Tutorial for new users. Many other small changes.
// v1.9.7.8 Fix typo in deletion link.
// v1.9.7.7 Further revised utility function for checking database and added ability to delete errant HITs that are in
//			the HIT DB but not actually found on MTurk.
// v1.9.7.6 Enhanced utility function for checking database.
// v1.9.7.5 Added utility function to view items listed as pending in HITDB database (to compare against numbers on
//			MTurk); taking another stab at resolving loading issues.
// v1.9.7.4 Bug fixes for loading projected earnings that will hopefully resolve some of the loading issues users have
//			been experiencing.
// v1.9.7.3 More robust error reporting in Console.
// v1.9.7.2 Bug fix for setting today vs longterm goal amount.
// v1.9.7   Major update. Goals tracking is now automatic. Bonuses can now be tracked day-by-day for any day visible on
//			the MTurk Dashboard and Status pages.
// v1.9.6.2 Initial release. Adds more robust goal tracking, adds option for longterm goal and bonus tracking for
//			today/longterm.
// ************** ************************* **************

var currentVersion = '1.10.0';

var isFirefox = typeof InstallTrigger !== 'undefined';
var DAYS_TO_FETCH = [];
var DAYS_TO_FETCH_CHECK;
var progressbar;

var buttonFuncs = {};
var utilities = {};
var imports = {};
var exports = {csv: {}};
var dialogs = {utils: {}};

var impexSettings = ['goal_daily_target', 'goal_longterm_startdate', 'goal_longterm_target', 'settings_showhide_earningspending', 'settings_showhide_earningstodate', 'settings_showhide_extraheader', 'settings_statuspage', 'update_auto', 'settings_bonusreload'];

var HITStorage = {};
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange;
HITStorage.IDBTransactionModes = {"READ_ONLY": "readonly", "READ_WRITE": "readwrite", "VERSION_CHANGE": "versionchange"};
var IDBKeyRange = window.IDBKeyRange;

HITStorage.indexedDB = {};
HITStorage.indexedDB.db = null;

HITStorage.indexedDB.onerror = function(e) {
	console.log(e);
};
var v = 6;

function getLocal(key) {
	value = localStorage.getItem(key);
	return value;
}

function setLocal(key, value) {
	localStorage.setItem(key, value);
}

$.fn.ignore = function(sel) {
	return this.clone().find(sel || ">*").remove().end();
};

var titles = {
	req: {
		link: {
			summary: 'View requester details and summary of HITs completed',
			to: 'View all reviews of requester on Turkopticon',
			toReview: 'Review this requester on Turkopticon',
			contact: 'Contact the requester regarding this HIT'
		},
		search: {
			hit: {
				all: 'View all HITs completed for this requester',
				pending: 'View all HITs pending with this requester',
				rejected: 'View all HITs rejected by this requester',
				title: 'Search for this HIT title in the database'
			},
			date: {
				all: 'View all HITs completed on this date',
				pending: 'View HITs from this that are still pending',
				rejected: 'View HITs from this date that were rejected',
				approved: 'View HITs from this date that were approved',
				
			}
		}
	},
	filter: {
		name: 'Filter by requester name',
		id: 'Filter by requester ID',
		number: 'Filter by number',
		amount: 'Filter by amount',
		date: 'Filter by date'
	}
};

// clean up HITDB keys and normalize the naming convention
if (localStorage.getItem('hitdb_version') === null) {
	localStorage.setItem('hitdb_version', currentVersion);
	var keysToRemove = [];
	var newKey = null;
	for (var i = 0; i < localStorage.length; i++) {
		switch (localStorage.key(i)) {
			case "HITDB AUTO UPDATE":
				newKey = 'hitdb_update_auto';
				break;
			case "HITDB AUTOUPDATE PAGES":
				newKey = 'hitdb_update_auto_pages';
				break;
			case "HITDB TIMESTAMP":
				newKey = 'hitdb_updated_timestamp';
				break;
			case "HITDB UPDATED":
				newKey = 'hitdb_updated_datetime';
				break;
			case "LONGTERM START":
				newKey = 'hitdb_goal_longterm_startdate';
				break;
			case "LONGTERM TARGET":
				newKey = 'hitdb_goal_longterm_target';
				break;
			case "SPECIFIC BONUS":
			case "TODAYS BONUS":
			case "TODAYS PREV":
			case "TODAYS PROJECTED":
			case '20150602alert':
			case '20150602fix':
				newKey = 'remove_me';
				break;
			case "TODAYS TARGET":
				newKey = 'hitdb_goal_daily_target';
				break;
			default:
				newKey = null;
		}
		if (newKey !== null) {
			if (newKey !== 'remove_me') {
				localStorage.setItem(newKey, localStorage.getItem(localStorage.key(i)));
			}
			keysToRemove.push(localStorage.key(i));
		}
	}
	for (var i = 0; i < keysToRemove.length; i++) {
		localStorage.removeItem(keysToRemove[i]);
	}
	window['newHITDB'] = 1;
} else if (localStorage.getItem('hitdb_version') != currentVersion) {
	localStorage.setItem('hitdb_version', currentVersion);
	window['newHITDB'] = 2;
}

function newUserOrientation(step) {
	step = step || 1;
	gmd = $("#generic_modal_dialog");
	if (!gmd.dialog("isOpen")) {
		gmd.dialog("open");
	}

	instruction = [];
	title = [];
	instruction[0] = '';
	title[0] = '';

	if (window['newHITDB'] === 1) {
		extra = "It appears this is your first time using HIT Database Goals Edition. If so, welcome.<br /><br />";
		extra2 = "(<span style='font-style: italic;'>If you're not new to HIT Database Goals Edition, feel free to press Close on this dialog.</span>)";
	} else {
		extra = '';
		extra2 = '';
	}
	instruction[1] = extra + "To make it easier to follow along with this tutorial, it's recommended that you <a href='https://www.mturk.com/mturk/dashboard' target='_blank'>click here</a> to open your Dashboard again in a new tab or window. Then click Next to continue with a tutorial.<br /><br />" + extra2;
	title[1] = "Welcome to HIT Database Goals Edition";

	instruction[2] = "As a new user, the first thing you should do is scroll to the bottom of the dashboard and find the Update Database button in the Maintenance section. This is how HIT Database learns about all of the HITs you have done.<br /><br />Note that, if you have worked for Mechanical Turk for more than 45 days, HIT Database will not be able to learn your entire work history. This is due to limitations of the Mechanical Turk website. But don't worry - HIT Database will grab all of the information it can from your history, and will track all your HITs from today going forward.";
	title[2] = "First Steps";

	instruction[3] = "The first time you use Update Database, depending on how long you have worked on Mechanical Turk and the number of HITs you have completed, the process may take a while. You may want to do it when you're about to step away from the computer for a few minutes.<br /><br />Anytime you run Update Database, make sure there is nothing running in the background that accesses Mechanical Turk, such as Turkmaster or HIT Scraper. If there is, it can cause page errors and your database won't be updated properly, or it may stop in the middle of the update. If this happens, the best idea is to close all tabs/windows except this one, and run it again.<br /><br />To make it easier to follow along with the rest of this tutorial, we suggest you run Update Database now, and then come back to this tab when it's done.";
	title[3] = "What To Expect When Updating";

	instruction[4] = "Once you have done your first update, you might be wondering - 'If I have to click Update Database every time I complete a HIT, how will I ever get any work done?'<br /><br />The good news is you really only need to run Update Database about once a day. In between those updates, you can use Auto Update. This feature keeps track of your progress throughout the day automatically. Click Next to learn how to use it.";
	title[4] = "An Update A Day...";

	instruction[5] = "To use Auto Update, first open the <a href='https://www.mturk.com/mturk/findhits?match=true' target='_blank'>HITs Available</a> screen. You'll see an Auto Update button that says 'Auto Update is OFF'. Click it once, and then click OK. Now the button should say 'Auto Update is ON'.<br /><br />Next you'll need to set up this tab to automatically refresh every few minutes. For Chrome, a free extension that does this is <a href='https://chrome.google.com/webstore/detail/refresh-monkey/ljngnafhejmefmijjoedbclkadhacebd?hl=en' target='_blank'>Refresh Monkey</a>. For Firefox, try <a href='https://addons.mozilla.org/En-us/firefox/addon/tab-auto-reload/' target='_blank'>Tab Auto Reload</a>.<br /><br />Leave that tab open all day and just forget it's there - that's how the magic works.";
	title[5] = "Setting Up Auto Update";

	instruction[6] = "Auto Update running is great, but what does that do for you? Like we said before, it keeps track of your progress from today, so you can refresh your Dashboard and see updated information (like goal progress and projected earnings) throughout the day. What it doesn't do is retrieve information about previous days.<br /><br />So if, for example, you had 100 HITs from yesterday still pending, and they got approved today, HIT Database won't know that until you run Update Database. But if you complete 5 HITs right now, they'll show up as pending as soon as the Auto Update page refreshes. And if they're approved an hour later, the next refresh after they are approved will update your database with that information.";
	title[6] = "What Auto Update Can't Do";

	instruction[7] = "HIT Database is a powerful tool to help you keep track of the work you've done, and motivate yourself with goals. There are two goals that you can set - Today (aka Daily), and Longterm.<br /><br />Today, or Daily, is an amount that you want to hit on a daily basis. It refreshes every night at midnight Pacific time (when the Mechanical Turk day changes).<br />Longterm lets you set a start date, and earnings are automatically tracked from that date through the current date. So if you want to earn a certain amount each week, starting a Longterm goal each Sunday would help you see your progress throughout the week.";
	title[7] = "I Was Told There Would Be Goals And Cookies";

	instruction[8] = "To set your first goal, find the Projected Earnings and Goals section on the Dashboard. (It should be toward the top.) Hover your mouse over the button that says <span style='font-style: italic;'>Actions</span> across from <span style='font-style: italic;'>Today's Projected Earnings and Goal Progress</span>. Then click Set Daily Target. You choose the amount - just make sure you don't put in a dollar sign. Click OK.<br /><br />If you've already run Update Database and had completed work today, you should now see a progress bar showing you how close you are to meeting the goal you just entered. If you didn't do any work yet today, don't worry. As soon as you do and it's picked up by HIT Database (either through Update Database or Auto Update), you'll see it the next time you refresh your dashboard.";
	title[8] = "Getting Your Goal On";

	instruction[9] = "Setting a Longterm goal is very similar to setting a Daily goal, but it involves one extra step.<br /><br />To tell HIT Database what date you want to start tracking from, find the <span style='font-style: italic;'>Actions</span> button across from <span style='font-style: italic;'>Longterm (LT) Goal Progress</span>. Hover over the button and then click Start Longterm Goal.<br /><br />Choose a date (" + moment().subtract(3, 'days').format('YYYY-MM-DD') + " seems like a good one to us) and enter it, making sure to follow the format shown. You can change this date at any time. For demonstration purposes, we suggest you pick a date in the past so you can see the automatic goal tracking in action. Click Save, and you'll then be prompted to enter your goal amount. This can be any number your heart desires.<br /><br />";
	title[9] = 'Make it a Longterm Relationship';

	instruction[10] = "You've now seen how Goals work. You can change your goal amounts or Longterm goal start date at any time, and without losing any data, since everything is calculated from your database each time you load the page. Having a rough day and want to see what it looks like when you go over goal? Go ahead, change your goal amount to something less than you've already made.<br /><br />In the next few screens, we'll talk about some of the search features to find who you've done HITs for, when, and who still owes you money.";
	title[10] = "The Goal Line";

	instruction[11] = "One of the best things about having HIT Database track everything is you can tell, at a glance, what HITs are still pending and for how much. To do this, go to the bottom of the dashboard and click on Overviews. There are three types - Pending, Requester, and Daily. For right now, click on Pending.<br /><br />Note that if you haven't yet run Update Database, Pending Overview won't show you anything. You can run Update Database now. We'll wait.<br /><br />The Pending Overview screen may take a moment to load if you've been a busy bee and have a lot of HITs pending approval. Once it does, though, you should see a list of requesters, the number of HITs you have pending with each, and the total amounts that those HITs are worth.";
	title[11] = "Where's My Money, Punk?";

	instruction[12] = "Clicking on a requester name will launch a window showing you all of the HITs you've ever done for them, summarized by month, as well as some other links to Mechanical Turk and Turkopticon searches. If you click on the number of HITs pending, though, it will bring up screen that shows you each individual HIT pending for that requester.<br /><br />Most Overview and Search screens will have a table that looks similar to this, and buttons at the top and bottom of the table to move through pages of information if needed. You can change the number of requesters or HITs shown on each page by using the drop-down to the far right, and page through by using the First, Previous, Next, and Last buttons - they all have triangles on them.<br /><br />You can also jump to a particular row by typing it in the box (next to 'to ## of ## matching') and pressing Enter. The screen will then jump to the page containing that row.";
	title[12] = "So They Owe Me $57, But What Was That For?";

	instruction[13] = 'Looking back to the dashboard, the Requester Overview button lets you see all of the requesters you have ever worked for, and how many HITs you have done for each one (as well as how many they have rejected, and the rejection percentage).<br /><br />Daily Overview, in turn, shows you a list of every day that HIT Database knows about. For each day, you can view how many HITs were done, if any are still pending, and how much money has been paid out for that day.';
	title[13] = 'What About the Other Overviews?';

	instruction[14] = "Searching for HITs you've done is easy. From the dashboard, click on Search (toward the bottom) and then enter your desired criteria (or just click Search). A new window will open with the results, and you can sort and filter it any way you like.<br /><br />That reminds us - we never talked about filtering. Nearly every search result screen, including the Overviews, can be filtered right on the screen. You should wait until all results have loaded before you try to filter. You can tell everything has loaded because the 'Loading' message at the top will disappear when it's ready. Once it is, type something in one of the boxes at the top of a column, and watch with amazement as the results are filtered down to only ones that match what you typed.";
	title[14] = "Filtering Isn't Really Magic, But It Plays A Magician On TV";

	instruction[15] = "There are a lot of advanced filtering tricks, but we've read through 15 pages, and this was supposed to be a quick tutorial. You've got the basics down, so let's wrap up here for now.<br /><br />Feel free to visit the <a href='http://www.mturkgrind.com/threads/hit-database-goals-edition.28453' target='_blank'>support thread</a> for HIT Database Goals Edition on MTurkGrind to talk to fellow users, learn tips and tricks, and get assistance with problems.<br /><br /><span style='font-weight: bold;'>Thanks for using HIT Database Goals Edition.</span>";
	title[15] = "Figures, Just When It Was Getting Good";

	thisStep = instruction[step];
	$("#generic_modal_dialog_instructions").html(thisStep);
	gmd.dialog("option", "title", title[step]);
	gmd.dialog("option", "height", 350);
	gmd.dialog("option", "width", 500);

	gmd.dialog("option", "buttons", [
		{
			text: "Back",
			click: function() {
				newUserOrientation(step - 1);
			},
			disabled: (step === 1 ? true : false)
		},
		{
			text: "Next",
			click: function() {
				newUserOrientation(step + 1);
			},
			disabled: (step === 15 ? true : false)
		},
		{
			text: "Close",
			click: function() {
				gmd.dialog("close");
			}
		}
	]);
}

function launchNewUserOrientation(step) {
	return function() {
		event.preventDefault();
		newUserOrientation(step);
	};
}

HITStorage.indexedDB.create = function() {
	var request = indexedDB.open("HITDB", v);

	request.onupgradeneeded = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var new_empty_db = false;
		var store;

		if (!db.objectStoreNames.contains("HIT")) {
			store = db.createObjectStore("HIT", {keyPath: "hitId"});

			store.createIndex("date", "date", {unique: false});
			store.createIndex("requesterName", "requesterName", {unique: false});
			store.createIndex("title", "title", {unique: false});
			store.createIndex("reward", "reward", {unique: false});
			store.createIndex("status", "status", {unique: false});
			store.createIndex("requesterId", "requesterId", {unique: false});

			new_empty_db = true;

			// At first update try to get few extra days that do not show on status page
			localStorage.setItem('hitdb_temp_updated_tryextra', 'YES');
			localStorage.setItem('hitdb_migrate', '110');
		}
		if (!db.objectStoreNames.contains("STATS")) {
			store = db.createObjectStore("STATS", {keyPath: "date"});
		}
		if (!db.objectStoreNames.contains("NOTES")) {
			store = db.createObjectStore("NOTES", {keyPath: "requesterId"});
		}
		if (!db.objectStoreNames.contains("BLOCKS")) {
			store = db.createObjectStore("BLOCKS", {keyPath: "id", autoIncrement: true});

			store.createIndex("requesterId", "requesterId", {unique: false});
		}

		if (db.objectStoreNames.contains("BONUSES")) {
			db.deleteObjectStore("BONUSES");
		}
		if (!db.objectStoreNames.contains("BONUS")) {
			store = db.createObjectStore("BONUS", {keyPath: "date"});
		}

		/*if (!db.objectStoreNames.contains("REQ_STATS")) {
			store = db.createObjectStore("REQ_STATS", {keyPath: "requesterId"});
		}*/

		if (new_empty_db === false) {
			alert("HIT Database date format must be upgraded (MMDDYYYY => YYYY-MM-DD)\n" + "Please don't close or reload this page until it's done.\n" + "Press OK to start. This shouldn't take long. (few minutes max)" + "Sorry for the inconvenience.");
			HITStorage.update_date_format(true);
		} else {
			window['newHITDB'] = 1;
		}
		db.close();
		//alert("Database upgraded to version " + v + '!');
	};

	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		db.close();
	};

	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.migrateStats_part1 = function() {
	if (localStorage.getItem('hitdb_migrate' == 110)) {
		return false;
	}
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["STATS"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("STATS");

		var totalDays = store.count();
		var perDay = ((100 - progressbar.progressbar('value')) * 0.15) / totalDays;
		var tempProgressUpdate = progressbar.progressbar('value');
		var req = store.openCursor();
		var results = [];
		var from_date = '2020-01-01';
		var to_date = '2000-01-01';
		req.onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				results.push(cursor.value);
				if (moment(cursor.value.date).isBefore(moment(from_date), 'day')) {
					from_date = cursor.value.date;
				}
				if (moment(cursor.value.date).isAfter(moment(to_date), 'day')) {
					to_date = cursor.value.date;
				}
				tempProgressUpdate += perDay;
				if (tempProgressUpdate >= progressbar.progressbar('value') + 1) {
					updateProgressBar(progressbar, '+', tempProgressUpdate);
				}
				cursor.continue();
			} else {
				stats = {};
				if (results.length > 0) {
					for (var i = 0; i < results.length; i++) {
						stats[results[i].date] = results[i];
						stats[results[i].date].submitted_reward = 0;
						stats[results[i].date].approved_reward = 0;
						stats[results[i].date].pending_reward = 0;
						stats[results[i].date].rejected_reward = 0;
					}
				}
			}
		};
		trans.oncomplete = function(event) {
			if (_.size(stats) > 0) {
				HITStorage.indexedDB.migrateStats_part2(stats, from_date, to_date);
			}
		};
		db.close();
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.migrateStats_part2 = function(stats, from_date, to_date) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db2 = e.target.result;
		var db = HITStorage.indexedDB.db2;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("HIT");

		index = store.index('date');
		range = IDBKeyRange.bound(from_date, to_date, false, false);

		var totalHits = index.count(range);

		var req = index.openCursor(range);

		var perHit = ((100 - progressbar.progressbar('value')) * 0.25) / totalHits;
		var tempProgressUpdate = progressbar.progressbar('value');
		var lastDate = '';
		req.onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				thisDate = cursor.value.date;
				thisReward = cursor.value.reward;
				thisStatus = cursor.value.status;
				if (!stats[thisDate]) {
					cursor.continue();
				}
				stats[thisDate].submitted_reward += thisReward;
				stats[thisDate].rejected_reward += (thisStatus == 'Rejected' ? thisReward : 0);
				stats[thisDate].approved_reward += (thisStatus == 'Paid' || thisStatus.search('Approved') > -1 ? thisReward : 0);
				stats[thisDate].pending_reward += (thisStatus == 'Pending Approval' ? thisReward : 0);
				lastDate = thisDate;
				tempProgressUpdate += perHit;
				if (tempProgressUpdate >= progressbar.progressbar('value') + 1) {
					updateProgressBar(progressbar, '+', tempProgressUpdate);
				}
				cursor.continue();
			} else {
				tempProgressUpdate = progressbar.progressbar('value');
				perStat = ((100 - progressbar.progressbar('value')) * 0.75) / _.size(stats);
				if (_.size(stats) > 0) {
					$.each(stats, function(key, value) {
						tempProgressUpdate += perStat;
						if (tempProgressUpdate >= progressbar.progressbar('value') + 1) {
							updateProgressBar(progressbar, '+', tempProgressUpdate);
						}

						value.submitted_reward = +(value.submitted_reward.toFixed(2));
						value.rejected_reward = +(value.rejected_reward.toFixed(2));
						value.approved_reward = +(value.approved_reward.toFixed(2));
						value.pending_reward = +(value.pending_reward.toFixed(2));
						HITStorage.indexedDB.updateHITStats(value);
					});
				}
			}
		};
		trans.oncomplete = function(e) {
			localStorage.setItem('hitdb_migrate', 110);
		};
		db.close();
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.addHIT = function(hitData) {
	// Temporary extra check
	if (hitData.date.indexOf('-') < 0) {
		alert('Wrong date format in addHIT()!');
		return;
	}

	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("HIT");

		var request = store.put(hitData);

		request.onsuccess = function(e) {
			db.close();
		};

		request.onerror = function(e) {
			console.log("Error Adding: ", e);
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.importHITs = function(hitData) {
	var hits = hitData.length;
	var label = document.getElementById('status_label');
	window.lastUpdate = 5;

	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("HIT");

		putNextHIT();

		function putNextHIT() {
			if (hitData.length > 0) {
				store.put(hitData.pop()).onsuccess = putNextHIT;
				if ((95 / hits) * (hits - hitData.length) > (1 + window.lastUpdate)) {
					updateProgressBar(progressbar, '+', (98 / hits) * (hits - hitData.length));
					window.lastUpdate = Math.floor((98 / hits) * (hits - hitData.length));
				}
			} else {
				$("#progressbar").progressbar("option", "complete", function() {return false;});
				updateProgressBar(progressbar, '=', 100);
				$("#progress_dialog").dialog("option", "height", 300);
				HITStorage.updateStatusLabel('Import complete. Please click OK to refresh the page to view the results.');
				$("#progress_dialog").dialog("option", "buttons", {
					"OK": function() {
						setTimeout(function() { location.reload(); }, 1000);
						$("#progress_dialog").dialog("option", "buttons", {});
					}
				});
				db.close();
			}
		}
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.addHITs = function(hitData, day_to_fetch, days_to_update) {
	var hits = hitData.length;
	if (day_to_fetch) {
		var label = document.getElementById('status_label');
	}

	var request = indexedDB.open("HITDB", v);
	if (day_to_fetch) {
		day_to_fetch.submitted_reward = 0;
		day_to_fetch.rejected_reward = 0;
		day_to_fetch.approved_reward = 0;
		day_to_fetch.pending_reward = 0;
	}
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("HIT");

		putNextHIT();

		function putNextHIT() {
			if (hitData.length > 0) {
				thisHit = hitData.pop();
				store.put(thisHit).onsuccess = putNextHIT;
				if (day_to_fetch) {
					day_to_fetch.submitted_reward += thisHit.reward;
					day_to_fetch.rejected_reward += (thisHit.status == 'Rejected' ? thisHit.reward : 0);
					day_to_fetch.approved_reward += (thisHit.status == 'Paid' || thisHit.status.search('Approved') > -1 ? thisHit.reward : 0);
					day_to_fetch.pending_reward += (thisHit.status == 'Pending Approval' ? thisHit.reward : 0);
					label.innerHTML = 'Saving ' + day_to_fetch.date + ': ' + progress_bar(((hits - hitData.length) / hits * 40), 40, '█', '█', '#7fb448', 'grey');
				}
			} else {
				// move to next day
				if (day_to_fetch) {
					HITStorage.indexedDB.updateHITStats(day_to_fetch);
					setTimeout(function() { HITStorage.executeUpdate(days_to_update); }, 2000);
					HITStorage.updateStatusLabel('Script monkeys are taking naps ?');
				}
				db.close();
			}
		}
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.updateHITStats = function(date) {
	// Temporary extra check
	if (date.date.indexOf('-') < 0) {
		alert('Wrong date format in updateHITStats()!');
		return;
	}

	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["STATS"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("STATS");

		var request = store.put(date);

		request.onsuccess = function(e) {
			db.close();
		};

		request.onerror = function(e) {
			console.log("Error Adding: ", e);
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.importBonuses = function(bonusData) {
	var bonuses = bonusData.length;

	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["BONUS"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("BONUS");

		putNextBonus();

		function putNextBonus() {
			if (bonusData.length > 0) {
				store.put(bonusData.pop()).onsuccess = putNextBonus;
				if ((95 / bonuses) * (bonuses - bonusData.length) > (1 + window.lastUpdate)) {
					updateProgressBar(progressbar, '+', (98 / hits) * (bonuses - bonusData.length));
					window.lastUpdate = Math.floor((98 / hits) * (bonuses - bonusData.length));
				}
			} else {
				$("#progressbar").progressbar("option", "complete", function() {return false;});
				updateProgressBar(progressbar, '=', 100);
				$("#progress_dialog").dialog("option", "height", 300);
				HITStorage.updateStatusLabel('Import complete. Please click OK to refresh the page to view the results.');
				$("#progress_dialog").dialog("option", "buttons", {
					"OK": function() {
						setTimeout(function() { location.reload(); }, 1000);
						$("#progress_dialog").dialog("option", "buttons", {});
					}
				});
				db.close();
			}
		}
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.prepareUpdateCheckPendingPayments = function() {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");
		var index = store.index('status');
		var range = IDBKeyRange.only('Approved&nbsp;- Pending&nbsp;Payment');

		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor && DAYS_TO_FETCH.length > 0) {
				for (var i = 0; i < DAYS_TO_FETCH.length; i++) {
					if (cursor.value.date == DAYS_TO_FETCH[i].date && cursor.value.reward > 0) {
						DAYS_TO_FETCH[i].pending_payments = true;
					}
				}
				cursor.continue();
			} else {
				if (DAYS_TO_FETCH.length > 0) {
					db.close();
					HITStorage.updateStatusLabel('Script monkeys are planning to fetch relevant status pages');
					updateProgressBar(progressbar, '+', 1);
					setTimeout(function() { HITStorage.prepareToUpdate(); }, 100);
				} else {
					db.close();
					HITStorage.updateCompleted();
				}
			}
		};
	};
};

// check that number of hits in DB matches what is available
HITStorage.checkUpdate = function() {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.updateStatusLabel('Please wait: checking database', 'red');
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");
		var index = store.index('date');
		var range = IDBKeyRange.bound(DAYS_TO_FETCH_CHECK[DAYS_TO_FETCH_CHECK.length - 1].date, DAYS_TO_FETCH_CHECK[0].date, false, false);

		index.count(range).onsuccess = function(event) {
			var count = event.target.result;
			var submitted_hits = 0;

			for (var i = 0; i < DAYS_TO_FETCH_CHECK.length; i++) {
				submitted_hits += DAYS_TO_FETCH_CHECK[i].submitted;
			}

			if (submitted_hits == count) {
				db.close();
				HITStorage.updateCompleted();
			} else {
				if (confirm("? ERROR! Number of HITs in Database does not match number of HITs available! (" + count + " != " + submitted_hits + ")\n" + "Would you like to refetch all status pages now?")) {
					db.close();
					DAYS_TO_FETCH = DAYS_TO_FETCH_CHECK.slice(0);
					HITStorage.updateStatusLabel('New script monkeys are fetching relevant status pages');
					updateProgressBar(progressbar, '=', 0);
					setTimeout(function() { HITStorage.executeUpdate(DAYS_TO_FETCH.length); }, 100);
				} else {
					db.close();
					HITStorage.updateCompleted();
				}
			}
		};
	};
};

HITStorage.prepareToUpdate = function() {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["STATS"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("STATS");
		var range = IDBKeyRange.bound(DAYS_TO_FETCH[DAYS_TO_FETCH.length - 1].date, DAYS_TO_FETCH[0].date, false, false);

		store.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor && DAYS_TO_FETCH.length > 0) {
				for (var i = 0; i < DAYS_TO_FETCH.length; i++) {
					if (cursor.value.date == DAYS_TO_FETCH[i].date && cursor.value.submitted == DAYS_TO_FETCH[i].submitted && cursor.value.approved == DAYS_TO_FETCH[i].approved && cursor.value.rejected == DAYS_TO_FETCH[i].rejected && cursor.value.pending == DAYS_TO_FETCH[i].pending) {
						// This day is already in DB and stats match => no need to fetch
						// unless there are 'Approved - Pending Payment' HITs
						if (DAYS_TO_FETCH[i].pending_payments === undefined || DAYS_TO_FETCH[i].pending_payments === false) {
							DAYS_TO_FETCH.splice(i,1);
						}
					}
				}
				cursor.continue();
			} else {
				if (DAYS_TO_FETCH.length > 0) {
					db.close();
					setTimeout(function() { HITStorage.executeUpdate(DAYS_TO_FETCH.length); }, 100);
				} else {
					db.close();
					HITStorage.updateCompleted();
				}
			}
		};
	};
};

HITStorage.indexedDB.term_matches_HIT = function(term, hit) {
	var keys = ['title', 'feedback', 'requesterName'];
	var re = new RegExp(escapeRegExp(term),"ig");
	for (var k in keys) {
		//for testing
		if (hit[keys[k]] !== null && re.test(hit[keys[k]].trim())) {
			return true;
		}
	}
	return false;
};

function escapeRegExp(str) {
	return str.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

HITStorage.indexedDB.matchHIT = function(hit, options) {
	if (options.status == '---' || hit.status.match(options.status) || (hit.status === 'Paid' && options.status === 'Approved')) {
		if (!options.searchterm || HITStorage.indexedDB.term_matches_HIT(options.searchterm, hit)) {
			if (options.index === undefined || options.index === null || hit[options.index] == options.term) {
				return true;
			}
		}
	}
	return false;
};

function checkDate(dateToCheck, options) {
	if (!options.from_date && !options.to_date) {
		return true;
	} else {
		if (!options.from_date) {
			options.from_date = '2005-01-01';
		}
		if (!options.to_date) {
			options.to_date = '2050-12-31';
		}
		from_date = moment(options.from_date).subtract(1, 'day');
		to_date = moment(options.to_date).add(1, 'day');

		return moment(dateToCheck).isBetween(from_date, to_date);
	}
}

function hit_sort_func() {
	return function(a, b) {
		if (a.date == b.date) {
			if (a.requesterName < b.requesterName) {
				return -1;
			}
			if (a.requesterName > b.requesterName) {
				return 1;
			}
			if (a.title < b.title) {
				return -1;
			}
			if (a.title > b.title) {
				return 1;
			}
			if (a.status < b.status) {
				return -1;
			}
			if (a.status > b.status) {
				return 1;
			}
		}
		if (a.date > b.date) {
			return 1;
		}
		if (a.date < b.date) {
			return -1;
		}
	};
}

function createPager(type) {
	var pager = $("<div></div>")
		.css({'width': '90%', 'margin': '0 auto', 'display': 'block', 'padding-bottom': '3px', 'padding-top': '3px'})
		.attr({'id': type})
		.append(
			$("<div></div>")
				.css({'float': 'left', 'font-style': 'italic', 'font-weight': 'bold', 'font-size': (type == 'head' ? '18px' : '12px'), 'width': '35%', 'vertical-align': 'top', 'margin': '0', 'padding': '0px'})
				.attr({'id': (type == 'head' ? 'head' : 'foot') + '_left_float'})
				.append(
					$("<span></span>")
						.attr({'id': (type == 'head' ? 'head' : 'foot') + 'er'}),
					$("<span></span>")
						.css({'font-size': '12px'})
						.attr({'id': (type == 'head' ? 'head' : 'foot') + '_status'})
				),
			$("<div></div>")
				.addClass('pager')
				.css({'float': 'right', 'width': '40%', 'text-align': 'right', 'padding-top': '0px', 'padding-bottom': '0px', 'white-space': 'nowrap'})
				.attr({'id': (type == 'head' ? 'head' : 'foot') + '_pager'})
				.append(
					$("<form></form>")
						.append(
							$("<img />")
								.attr({'src': 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.2/css/images/first.png'})
								.addClass('first'),
							$("<img />")
								.attr({'src': 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.2/css/images/prev.png'})
								.addClass('prev'),
							$("<span></span>")
								.addClass('pagedisplay'),
							$("<img />")
								.attr({'src': 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.2/css/images/next.png'})
								.addClass('next'),
							$("<img />")
								.attr({'src': 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.2/css/images/last.png'})
								.addClass('last'),
							$("<select></select>")
								.addClass('pagesize')
								.append(
									$("<option></option>")
										.val('20').text('20'),
									$("<option></option>")
										.val('50').text('50'),
									$("<option></option>")
										.val('100').text('100'),
									$("<option></option>")
										.val('200').text('200')
								)
						)
				),
			$("<div></div>")
				.attr({'id': (type == 'head' ? 'head' : 'foot') + 'output_section'})
				.css({'margin': '0 25%', 'text-align': 'center'})
				.append(
					$("<button></button>")
						.attr({'id': 'download_csv'})
						.text('Download CSV')
						.css({'font-size': '12px', 'width': '130px', 'height': '24px'})
				),
			$("<div></div>")
				.css({'clear': 'both'})
		);
	if (type == 'head') {
		pager.find("#" + (type == 'head' ? 'head' : 'foot') + "output_section").remove();
	}
	return pager;
}

function initTablesorter(word, showPager) {
	var tablesorterOptions = {
			//debug: true,
			theme: 'jui',
			widthFixed: true,
			headerTemplate: '{content} {icon}',
			widgets: ['stickyHeaders', 'filter', 'zebra', 'uitheme', 'math', 'output'],
			widgetOptions: {
				zebra: ["even", "odd"],
				filter_columnFilters: true,
				filter_filteredRow: 'filtered',
				math_complete: function($cell, wo, result, value, arry) {
					prefix = ($cell.data('math-footer') !== undefined ? $cell.data('math-footer') : '');
			    	if ($cell.hasClass('currency') && result != 'none') {
			    		return prefix + '$' + result;
			    	}
					return prefix + result;
			    },
				output_delivery: 'download',
				output_saveFileName: 'hitdb_export.csv',
				output_dataAttrib: 'data-text'
			},
			/*textExtraction: function(node, table, cellIndex) {
				if ($(node).children().hasClass('value')) {
					return $(node).children("[class*='value']").first().text();
				}
				return $(node).text();
			}*/
	};

	$("#outertable").tablesorter(tablesorterOptions);

	if (showPager !== false) {
		var pagerOptions = {
			container: $(".pager"),
			output: '{startRow:input} to {endRow} of {filteredRows} matching ' + word,
			savePages: false,
			removeRows: false,
			size: 20,
			cssErrorRow: 'tablesorter-errorRow',
			cssDisabled: 'disabled',
			cssFirst: '.first',
			cssPrev: '.prev',
			cssNext: '.next',
			cssLast: '.last',
			cssGoto: '.gotoPage',
			cssPageDisplay: '.pagedisplay',
			cssPageSize: '.pagesize'
		};
		$("#outertable").tablesorterPager(pagerOptions);
	}

	$("#download_csv").button().click(function() { $("#outertable").trigger('outputTable'); });
}

function initTablesorterMath() {
	var mathOptions = {
		math_complete: function($cell, wo, result, value, arry) {
			prefix = ($cell.data('math-footer') !== undefined ? $cell.data('math-footer') : '');
	    	if ($cell.hasClass('currency') && result != 'none') {
	    		return prefix + '$' + result;
	    	}
			return prefix + result;
	    },
	};

	$.extend($("#outertable").data("tablesorter").widgetOptions, mathOptions);
	$("#outertable").data("tablesorter").widgets = ['stickyHeaders', 'filter', 'zebra', 'uitheme', 'math'];
	$('#outertable').trigger('applyWidgets');
}

function initTooltips(selector) {
	$(selector).each(function() {
		$(this).qtip({
			content: {
				text: $("#buttons-" + $(this).attr('id'))
			},
			style: {
				//classes: 'ui-widget ui-tooltip-rounded ui-tooltip-shadow ui-tooltip-dark',
				widget: true,
				def: false
			},
			position: {
				my: 'center left',
				at: 'center right'
			},
			hide: {
				fixed: true,
				delay: 750
			},
			show: {
				solo: true
			}
		});
	});
}

HITStorage.indexedDB.exportBonuses = function() {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["BONUS"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("BONUS");

		var req;
		var results = [];
		var range;

		req = store.openCursor();
		req.onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				results.push(cursor.value);
				cursor.continue();
			} else {
				exports.csv.bonuses(results);
			}
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.search = function(options) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");

		var req;
		var results = [];
		var index;
		var range;
		var usedIndex = '';

		if (options.index && options.index !== '') {
			index = store.index(options.index);
			range = IDBKeyRange.only(options.term);
			req = index.openCursor(range);
		} else if (options.from_date || options.to_date) {
			usedIndex = 'date';
			index = store.index('date');
			if (options.from_date == options.to_date) {
				range = IDBKeyRange.only(options.from_date);
			} else if (options.from_date && options.to_date) {
				range = IDBKeyRange.bound(options.from_date, options.to_date, false, false);
			} else if (!options.from_date && options.to_date) {
				range = IDBKeyRange.upperBound(options.to_date, false);
				options.from_date = 'Beginning';
			} else {
				range = IDBKeyRange.lowerBound(options.from_date, false);
				options.to_date = moment().format('YYYY-MM-DD');
			}
			req = index.openCursor(range);
		} else if (options.status == 'Rejected' || options.status == 'Pending Approval' || options.status == 'Approved' || options.status == 'Paid') {
			var s = (options.status == 'Approved') ? 'Approved&nbsp;- Pending&nbsp;Payment' : options.status;
			options.index = 'status';
			index = store.index(options.index);
			range = IDBKeyRange.only(s);
			req = index.openCursor(range);
		} else {
			req = store.openCursor();
		}

		var page = 0,
			sum_rejected = 0,
			sum_pending = 0,
			sum_approved = 0,
			sum = 0;
		HITStorage.searchResults_Skeleton(options);
		req.onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (HITStorage.indexedDB.matchHIT(cursor.value, options) && checkDate(cursor.value.date, options)) {
					results.push(cursor.value);
					if (!options.export_csv) {
						sum += cursor.value.reward;
						if (cursor.value.status == 'Rejected') {
							sum_rejected += cursor.value.reward;
						} else if (cursor.value.status == 'Pending Approval') {
							sum_pending += cursor.value.reward;
						} else {
							sum_approved += cursor.value.reward;
						}

						if (results.length % 25 === 0) {
							HITStorage.searchResults_Push(results, page);
							if (results.length === 25) {
								initTablesorter('HITs');
							}
							page += 1;
						}
					} else if (results.length % 500 === 0) {
						updateProgressBar(progressbar, '+', 1);
					}
				}
				cursor.continue();
			} else {
				if (!options.export_csv) {
					if ($("#outertable").attr('role') !== 'grid') {
						initTablesorter('HITs');
					}

					HITStorage.searchResults_Push(results, page);

					if (options.index === 'requesterId') {
						sortList = [[0,1]];
					} else if (options.term) {
						sortList = [[3,0],[0,1]];
					} else if (options.index === 'reward') {
						sortList = [[4,0],[0,1]];
					} else if (options.index === 'feedback') {
						sortList = [[6,0],[3,0],[0,1]];
					} else {
						sortList = [[0,1]];
					}
					$("#outertable").trigger("sorton", [sortList]);

					$("#sum_earnings").attr({'data-math': 'col-sum', 'data-math-mask': '0.00'});
				    $("#outertable").trigger("update", [true, function () {
				        setTimeout(function () {
				            $('#outertable').trigger('recalculate');
				        }, 500);
				    }]);

					initTooltips('.reqtip');

					$("#head_status").text('');
				} else {
					updateProgressBar(progressbar, '=', 10);
					exports.csv.HITs(results);
				}

				if (options.donut == '---') {
					document.getElementById('container').style.display = 'none';
				} else if (options.donut !== undefined) {
					HITStorage.prepare_donut(results, options.donut);
				}
			}
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.searchResults_Skeleton = function(options) {
	if (options.export_csv === true) {
		return false;
	}

	b.append(
		$("<table></table>")
			.attr('id', 'outertable')
			.addClass('tablesorter')
			.css({'width': '90%', 'margin-left': 'auto', 'margin-right': 'auto'})
	);

	ot = $("#outertable");
	ot.append(
		$("<thead></thead>")
			.append(
				$("<tr></tr>")
					.append(
						$("<th></th>")
							.text('Date')
							.data({placeholder: 'Filter by date'})
							.addClass('left'),
						$("<th></th>")
							.text('Requester')
							.data({placeholder: 'Filter by requester'})
							.addClass('left'),
						$("<th></th>")
							.text('HIT Title')
							.data({placeholder: 'Filter by title'})
							.addClass('left'),
						$("<th></th>")
							.text('Reward')
							.data({placeholder: 'Filter by amount'})
							.addClass('left'),
						$("<th></th>")
							.text('Status')
							.data({placeholder: 'Filter by status'})
							.addClass('left'),
						$("<th></th>")
							.text('Feedback')
							.data({placeholder: 'Filter by feedback text'})
							.addClass('sorter-false left defaultCursor')
					)
			),
		$("<tbody></tbody>")
			.attr({'id': 'results_area'}),
		$("<tfoot></tfoot>")
			.append(
				$("<tr></tr>")
					.css({'font-size': '1.1em'})
					.append(
						$("<td></td>")
							.attr({'colspan': '3'}),
						$("<td></td>")
							.attr({'id': 'sum_earnings'})
							.addClass('right currency'),
						$("<td></td>")
							.attr({'colspan': '2'})
					)
			)
	);

	ot.before(createPager('head')).after(createPager('foot'));
	$("#header").text('HITs Matching Your Search');
	$("#head_status").text(' - Loading...');
};

HITStorage.searchResults_Push = function(results, page) {
	var forLength = (((page * 25) + 25) > results.length ? results.length : (page * 25) + 25);
	for (var j = (page * 25); j < forLength; j++) {
		if (!results[j]) {
			break;
		}

		$("#results_area").append(HITStorage.searchResults_Format(results[j], HITStorage.status_color(results[j].status)));
		$("#hits-" + results[j].hitId).button().click(launch_hit_search(results[j].requesterId, 'requesterId'));
		$("#to-" + results[j].hitId).button().click(open_link('http://turkopticon.differenceengines.com/' + results[j].requesterId.trim()));
		$("#rev-" + results[j].hitId).button().click(open_link(TO_report_link(results[j].requesterId, results[j].requesterName)));
		$("#con-" + results[j].hitId).button().click(open_link(results[j].requesterLink));
	}
	if ((isFirefox && (results.length % 100 === 0 || results.length % 25 !== 0)) || !isFirefox) {
		$("#outertable").find('tbody').trigger('updateRows');
	}
};

HITStorage.searchResults_Format = function(hit, status_color) {
	var line = $("<tr></tr>").css({'vertical-align': 'top'});

	line.append(
		$("<td></td>")
			.attr({'data-text': hit.date})
			.text(moment(hit.date).format('MMMM D, YYYY'))
			.css({'white-space': 'nowrap', 'vertical-align': 'top'})
	);
	line.append(
		$("<td></td>")
			.attr({'data-text': hit.requesterName})
			.append(
				$("<span></span>")
					.attr({'id': 'req-' + hit.hitId, 'title': 'View requester details and summary of HITs'})
					.text(hit.requesterName)
					.click(buttonFuncs.showRequester(hit.requesterId))
					.addClass('pointer reqtip'),
				$("<div></div>")
					.attr({'id': 'buttons-req-' + hit.hitId})
					.hide()
					.append(
						$("<div></div>")
							.css({'margin': 'auto'})
							.append(
								$("<button></button>")
									.prop('type', 'button')
									.attr({'title': titles.req.search.hit.all, 'id': ('hits-' + hit.hitId)})
									.addClass('standard-button')
									.html('H'),
								$("<br />"),
								$("<button></button>")
									.prop('type', 'button')
									.attr({'title': titles.req.link.to, 'id': 'to-' + hit.hitId})
									.addClass('standard-button')
									.html('T'),
								$("<br />"),
								$("<button></button>")
									.prop('type', 'button')
									.attr({'title': titles.req.link.toReview, 'id': 'rev-' + hit.hitId})
									.addClass('standard-button')
									.html('V')
							)
					)
			)
	);
	line.append(
		$("<td></td>")
			.attr({'data-text': hit.title})
			.append(
				$("<span></span>")
					.html('&nbsp;' + hit.title)
					.click(launch_hit_search(null, null, null, null, null, hit.title))
					.attr({'title': titles.req.search.hit.title, 'id': 'title-' + hit.hitId})
					.addClass('pointer reqtip'),
				$("<div></div>")
					.attr({'id': 'buttons-title-' + hit.hitId})
					.hide()
					.append(
						$("<button></button>")
							.prop('type', 'button')
							.attr({'title': titles.req.link.contact, 'id': 'con-' + hit.hitId})
							.css({'height': '16px', 'font-size': '8px', 'padding': '0px'})
							.html('C')
					)
			)
			.css({'vertical-align': 'top'})
	);
	line.append(
		$("<td></td>")
			.attr({'data-text': (hit.reward).toFixed(2)})
			.css({'text-align': 'right', 'vertical-align': 'top'})
			.text('$' + (hit.reward).toFixed(2))
	);
	line.append(
		$("<td></td>")
			.css({'color': status_color, 'vertical-align': 'top', 'white-space': 'nowrap'})
			.html((hit.status.search('Approved') > -1 ? 'Approved' : hit.status))
	);
	line.append(
		$("<td></td>")
			.css({'vertical-align': 'top'})
			.append(
				$("<div></div>")
					.css({'overflow': 'hidden'})
					.text(hit.feedback)
			)
	);

	return line;
};

// Show summary of all requesters
HITStorage.indexedDB.overviewRequester = function(options) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");
		var index;
		var req;
		var items = ['requesterId','requesterName','hits','reward','rejected','pending'];

		HITStorage.overviewRequesterResults_Skeleton(options);

		var results = [];
		if (options.from_date || options.to_date) {
			index = store.index('date');
			if (options.from_date == options.to_date) {
				range = IDBKeyRange.only(options.from_date);
			} else if (options.from_date !== undefined && options.to_date !== undefined) {
				range = IDBKeyRange.bound(options.from_date, options.to_date, false, false);
			} else if (options.from_date === undefined && options.to_date !== undefined) {
				range = IDBKeyRange.upperBound(options.to_date, false);
				options.from_date = 'Beginning';
			} else {
				range = IDBKeyRange.lowerBound(options.from_date, false);
				options.to_date = moment().format('YYYY-MM-DD');
			}
			req = index.openCursor(range);

			req.onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor) {
					var hit = cursor.value;
					var rejected = (hit.status == 'Rejected') ? 1 : 0;
					var pending = (hit.status.match(/Approved|Paid|Rejected/) === null) ? 1 : 0;
					var reward = (pending > 0 || rejected > 0) ? 0 : hit.reward;
					if (results.length === 0) {
						results.push([{
							requesterId: hit.requesterId,
							requesterName: hit.requesterName,
							hits: 1,
							reward: reward,
							rejected: rejected,
							pending: pending
						}]);
					} else if (results[0].requesterId == hit.requesterId) {
						results[0].hits += 1;
						results[0].reward += reward;
						results[0].rejected += rejected;
						results[0].pending += pending;
					} else {
						if (results.length % 25 === 0 && !options.export_csv) {
							if (page === 0) {
								initTablesorter('requesters');
							}
							HITStorage.overviewRequesterResults_Push(results, page);
							page += 1;
						}
						results.unshift([{
							requesterId: hit.requesterId,
							requesterName: hit.requesterName,
							hits: 1,
							reward: reward,
							rejected: rejected,
							pending: pending
						}]);
					}

					cursor.continue();
				} else {
					if (options.export_csv === true) {
						updateProgressBar(progressbar, '=', 10);
						exports.csv.generic(results, items, 'requesters_overview.csv');
					} else if (results.length) {
						if ($("#outertable").attr('role') !== 'grid') {
							initTablesorter('requesters');
						}

						HITStorage.overviewRequesterResults_Push(results, page);
						$("#outertable").trigger("sorton", [[[3,1], [1,1]]]);

						$("#outertable").bind("recalculate", function(e, t) {
							$("#sum_rejectedPercentage").text((parseInt($("#sum_rejectedHits").text()) / parseInt($("#sum_totalHits").text()) * 100).toFixed(2) + '%');
						});
						$("#sum_totalHits").attr({'data-math': 'col-sum', 'data-math-mask': '#0'});
						$("#sum_pendingHits").attr({'data-math': 'col-sum', 'data-math-mask': '#0'});
						$("#sum_dollars").attr({'data-math': 'col-sum', 'data-math-mask': '$##.#0.00'});
						$("#sum_rejectedHits").attr({'data-math': 'col-sum', 'data-math-mask': '#0'});
					    $("#outertable").trigger("update", [true, function () {
					        setTimeout(function () {
					            $('#outertable').trigger('recalculate');
					        }, 500);
					    }]);
						$("#head_status").text('');

						initTooltips('.reqtip');
					} else {
						// TODO: no results
					}
				}
				db.close();
			};
		} else {
			index = store.index('requesterId');
			req = index.openCursor();
			var page = 0;
			req.onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor) {
					var hit = cursor.value;
					var rejected = (hit.status == 'Rejected') ? 1 : 0;
					var pending = (hit.status.match(/Approved|Paid|Rejected/) === null) ? 1 : 0;
					var reward = (pending > 0 || rejected > 0) ? 0 : hit.reward;
					if (results.length === 0) {
						results.push({
							requesterId: hit.requesterId,
							requesterName: hit.requesterName,
							hits: 1,
							reward: reward,
							rejected: rejected,
							pending: pending
						});
					} else if (results[0].requesterId == hit.requesterId) {
						results[0].hits += 1;
						results[0].reward += reward;
						results[0].rejected += rejected;
						results[0].pending += pending;
					} else {
						if (results.length % 25 === 0 && !options.export_csv) {
							if (page === 0) {
								initTablesorter('requesters');
							}
							HITStorage.overviewRequesterResults_Push(results, page);
							page += 1;
						}
						results.unshift({
							requesterId: hit.requesterId,
							requesterName: hit.requesterName,
							hits: 1,
							reward: reward,
							rejected: rejected,
							pending: pending
						});
					}

					cursor.continue();
				} else {
					if (options.export_csv === true) {
						updateProgressBar(progressbar, '=', 10);
						exports.csv.generic(results, items, 'requesters_overview.csv');
					} else if (results.length) {
						if ($("#outertable").attr('role') !== 'grid') {
							initTablesorter('requesters');
						}

						HITStorage.overviewRequesterResults_Push(results, page);
						$("#outertable").trigger("sorton", [[[3,1], [1,1]]]);

						$("#outertable").bind("recalculate", function(e, t) {
							$("#sum_rejectedPercentage").text((parseInt($("#sum_rejectedHits").text()) / parseInt($("#sum_totalHits").text()) * 100).toFixed(2) + '%');
						});
						$("#sum_totalHits").attr({'data-math': 'col-sum', 'data-math-mask': '#0'});
						$("#sum_pendingHits").attr({'data-math': 'col-sum', 'data-math-mask': '#0'});
						$("#sum_dollars").attr({'data-math': 'col-sum', 'data-math-mask': '$##.#0.00'});
						$("#sum_rejectedHits").attr({'data-math': 'col-sum', 'data-math-mask': '#0'});
					    $("#outertable").trigger("update", [true, function () {
					        setTimeout(function () {
					            $('#outertable').trigger('recalculate');
					        }, 500);
					    }]);
						$("#head_status").text('');

						initTooltips('.reqtip');
					} else {
						// TODO: no results
					}
				}
				db.close();
			};
		}
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.overviewRequesterResults_Skeleton = function(options) {
	if (options.export_csv === true) {
		return false;
	}

	b.append(
		$("<table></table>")
			.attr({'id': 'outertable'})
			.addClass('tablesorter')
	);

	var ot = $("#outertable");
	ot.append(
		$("<thead></thead>")
			.append(
				$("<tr></tr>")
					.append(
						$("<th></th>").text('Requester').addClass('left')
							.data({placeholder: titles.filter.name}),
						$("<th></th>").text('Submitted').addClass('left')
							.data({placeholder: titles.filter.number}),
						$("<th></th>").text('Pending').addClass('left')
							.data({placeholder: titles.filter.number}),
						$("<th></th>").text('Rewards').addClass('left')
							.data({placeholder: titles.filter.amount}),
						$("<th></th>").text('Rejected').addClass('left')
							.data({placeholder: titles.filter.number}),
						$("<th></th>").text('Rej %').addClass('left')
							.data({placeholder: titles.filter.number})
					)
			),
		$("<tbody></tbody>")
			.attr({'id': 'results_area'}),
		$("<tfoot></tfoot>")
			.append(
				$("<tr></tr>")
					.css({'font-size': '1.1em'})
					.append(
						$("<td></td>"),
						//$("<td></td>"),
						$("<td></td>")
							.attr({'id': 'sum_totalHits'})
							.addClass('right'),
						$("<td></td>")
							.attr({'id': 'sum_pendingHits'})
							.addClass('right'),
						$("<td></td>")
							.attr({'id': 'sum_dollars'})
							.addClass('right'),
						$("<td></td>")
							.attr({'id': 'sum_rejectedHits'})
							.addClass('right'),
						$("<td></td>")
							.attr({'id': 'sum_rejectedPercentage'})
							.addClass('right')
					)
			)
	);

	ot.before(createPager('head')).after(createPager('foot'));
	$("#header").text('Requester Overview');
	$("#head_status").text(' - Loading...');
	$("#footer").html("<span style='font-weight: bold;'>Reward includes all 'Paid' and 'Approved - Pending Payment' HITs. Reward does not include any bonuses.</span>");
};

HITStorage.overviewRequesterResults_Push = function(results, page) {
	forLength = (results.length % 25 === 0 ? 25 : results.length % 25);
	for (var j = 0; j < forLength; j++) {
		if (!results[j]) {
			break;
		}

		$("#results_area").append(HITStorage.overviewRequesterResults_Format(results[j], j));

		$("#r-" + results[j].requesterId).button().click(buttonFuncs.showRequester(results[j].requesterId));
		$("#c-" + results[j].requesterId).button().click(open_link('https://www.mturk.com/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT&requesterId=' + results[j].requesterId));
		$("#to-" + results[j].requesterId).button().click(open_link('http://turkopticon.differenceengines.com/' + results[j].requesterId.trim()));
		$("#rev-" + results[j].requesterId).button().click(open_link(TO_report_link(results[j].requesterId, results[j].requesterName)));
	}

	if ((isFirefox && (results.length % 100 === 0 || results.length % 25 !== 0)) || !isFirefox) {
		$("#outertable").find('tbody').trigger('updateRows');
	}
};

HITStorage.overviewRequesterResults_Format = function(req, i) {
	var line = $("<tr></tr>");

	line.append(
		$("<td></td>")
			.attr({'data-text': req.requesterName})
			.append(
				$("<span></span>")
					.attr({'title': titles.req.link.summary, 'id': 'req-' + req.requesterId})
					.text(req.requesterName.trim())
					.click(buttonFuncs.showRequester(req.requesterId))
					.addClass('pointer reqtip'),
				$("<div></div>")
					.hide()
					.attr({'id': 'buttons-req-' + req.requesterId})
					.hide()
					.append(
						$("<button></button>")
							.prop('type', 'button')
							.attr({'title': titles.req.link.contact, 'id': 'r-' + req.requesterId})
							.addClass('standard-button')
							.html('R'),
						$("<br />"),
						$("<button></button>")
							.prop('type', 'button')
							.attr({'title': titles.req.link.contact, 'id': 'c-' + req.requesterId})
							.addClass('standard-button')
							.html('C'),
						$("<br />"),
						$("<button></button>")
							.prop('type', 'button')
							.attr({'title': titles.req.link.to, 'id': 'to-' + req.requesterId})
							.addClass('standard-button')
							.html('T'),
						$("<br />"),
						$("<button></button>")
							.prop('type', 'button')
							.attr({'title': titles.req.link.toReview, 'id': 'rev-' + req.requesterId})
							.addClass('standard-button')
							.html('V')
					)
			)
	);
	line.append(
		$("<td></td>")
			.css({'text-align': 'right'})
			.text(req.hits)
			.click(launch_hit_search(req.requesterId, 'requesterId'))
			.attr({'title': titles.req.search.hit.all})
			.addClass('pointer')
	);
	line.append(
		$("<td></td>")
			.css({'text-align': 'right'})
			.text(req.pending)
			.click(launch_hit_search(req.requesterId, 'requesterId', null, null, 'Pending'))
			.attr({'title': titles.req.search.hit.pending})
			.addClass('pointer')
	);
	line.append(
		$("<td></td>")
			.attr({'data-text': (req.reward).toFixed(2)})
			.css({'text-align': 'right'})
			.text('$' + (req.reward.toFixed(2)))
	);
	var p = (req.rejected / req.hits * 100).toFixed(2);
	var pc = (p > 0) ? 'red' : 'green';
	line.append(
		$("<td></td>")
			.css({'text-align': 'right', 'color': pc})
			.text(req.rejected)
			.click(launch_hit_search(req.requesterId, 'requesterId', null, null, 'Rejected'))
			.attr({'title': titles.req.search.hit.rejected})
			.addClass('pointer')
	);
	line.append(
		$("<td></td>")
			.css({'text-align': 'right', 'color': pc})
			.text(p + '%')
	);
	return line;
};

// Show summary of pending HITs
HITStorage.indexedDB.overviewPending = function(options) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");
		var index;
		var req;

		var results = [];
		var tmp_results = {};
		var sum = 0;
		var all_pending = 0;
		var items = ["requesterId","requesterName","pending","reward"];

		index = store.index('status');
		range = IDBKeyRange.only('Pending Approval');
		HITStorage.overviewPendingResults_Skeleton(options);
		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				var hit = cursor.value;
				if (tmp_results[hit.requesterId] === undefined) {
					tmp_results[hit.requesterId] = {};
					tmp_results[hit.requesterId].requesterId = hit.requesterId;
					tmp_results[hit.requesterId].requesterName = hit.requesterName;
					tmp_results[hit.requesterId].pending = 1;
					tmp_results[hit.requesterId].reward = hit.reward;
				} else {
					tmp_results[hit.requesterId].requesterName = hit.requesterName;
					tmp_results[hit.requesterId].pending += 1;
					tmp_results[hit.requesterId].reward += hit.reward;
				}

				cursor.continue();
			} else {
				for (var key in tmp_results) {
					results.push(tmp_results[key]);
				}

				if (options.export_csv === true) {
					updateProgressBar(progressbar, '=', 10);
					exports.csv.generic(results, items, 'pending_overview.csv');
				} else if (results.length) {
					HITStorage.overviewPendingResults_Push(results);

					initTablesorter('requesters');

					$("#outertable").trigger('sorton', [[[2,1], [3,1]]]);

					initTooltips('.reqtip');
					$("#head_status").text('');
				} else {
					// TODO: no results
				}
			}
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.overviewPendingResults_Skeleton = function(options) {
	if (options.export_csv) {
		return false;
	}

	b.append(
		$("<table></table>")
			.attr('id', 'outertable')
			.addClass('tablesorter')
	);

	ot = $("#outertable");
	ot.append(
		$("<thead></thead>")
			.append(
				$("<tr></tr>")
					.append(
						$("<th>Requester</th>")
							.addClass('left')
							.data({placeholder: titles.filter.name}),
						$("<th>Pending</th>")
							.addClass('left')
							.data({placeholder: titles.filter.number}),
						$("<th>Rewards</th>")
							.addClass('left')
							.data({placeholder: titles.filter.amount})
					)
			),
		$("<tbody></tbody>")
			.attr({'id': 'results_area'}),
		$("<tfoot></tfoot>")
			.append(
				$("<tr></tr>")
					.addClass('font12')
					.append(
						$("<td></td>"),
						$("<td></td>")
							.attr({'data-math': 'col-sum', 'data-math-mask': '#0'})
							.addClass('right'),
						$("<td></td>")
							.attr({'data-math': 'col-sum'})
							.addClass('right currency')
					)
			)
	);

	ot.before(createPager('head')).after(createPager('foot'));
	$("#header").text('Summary of Pending HITs');
	$("#head_status").text(' - Loading...');
};

HITStorage.overviewPendingResults_Push = function(results) {
	for (var i = 0; i < results.length; i++) {
		$("#results_area").append(HITStorage.overviewPendingResults_Format(results[i], i));
		$("#r-" + results[i].requesterId).button().click(buttonFuncs.showRequester(results[i].requesterId));
		$("#to-" + results[i].requesterId).button().click(open_link('http://turkopticon.differenceengines.com/' + results[i].requesterId.trim()));
		$("#rev-" + results[i].requesterId).button().click(open_link(TO_report_link(results[i].requesterId, results[i].requesterName)));
	}
	$("#outertable").find('tbody').trigger('updateRows');
};

HITStorage.overviewPendingResults_Format = function(req, i) {
	var line = $("<tr></tr>");

	line.append(
		$("<td></td>")
			.attr({'data-text': req.requesterName})
			.append(
				$("<span></span>")
					.attr({'id': 'req-' + req.requesterId})
					.text(req.requesterName.trim())
					.click(buttonFuncs.showRequester(req.requesterId))
					.addClass('pointer value reqtip'),
				$("<div></div>")
					.hide()
					.attr({'id': 'buttons-req-' + req.requesterId})
					.append(
						$("<button></button>")
							.prop('type', 'button')
							.attr({'title': titles.req.link.summary, 'id': 'r-' + req.requesterId})
							.addClass('pointer standard-button')
							.text('R'),
						$("<br />"),
						$("<button></button>")
							.prop('type', 'button')
							.attr({'title': titles.req.link.to, 'id': 'to-' + req.requesterId})
							.addClass('pointer standard-button')
							.text('T'),
						$("<br />"),
						$("<button></button>")
							.prop('type', 'button')
							.attr({'title': titles.req.link.toReview, 'id': 'rev-' + req.requesterId})
							.addClass('pointer standard-button')
							.text('V')
					)
			)
	);
	line.append(
		$("<td></td>")
			.addClass('right pointer value').text(req.pending)
			.click(launch_hit_search(req.requesterId, 'requesterId', null, null, 'Pending'))
	);
	line.append(
		$("<td></td>")
			.addClass('right value').text('$' + req.reward.toFixed(2))
	);

	return line;
};

// Show summary of daily stats
HITStorage.indexedDB.overviewDaily = function(options) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["STATS"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("STATS");
		var req;
		var results = [];

		if (options.from_date || options.to_date) {
			if (options.from_date == options.to_date) {
				range = IDBKeyRange.only(options.from_date);
			} else if (options.from_date && options.to_date) {
				range = IDBKeyRange.bound(options.from_date, options.to_date, false, false);
			} else if (!options.from_date && options.to_date) {
				range = IDBKeyRange.upperBound(options.to_date, false);
			} else {
				range = IDBKeyRange.lowerBound(options.from_date, false);
			}
			req = store.openCursor(range);
		} else {
			req = store.openCursor();
		}

		var page = 0;
		HITStorage.overviewDailyResults_Skeleton(options);
		req.onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (cursor.value.submitted > 0) {
					results.push(cursor.value);
					if (!options.export_csv) {
						if (results.length % 25 === 0) {
							if (results.length === 25) {
								initTablesorter('days');
							}
							HITStorage.overviewDailyResults_Push(results, page);
							page += 1;
						}
					}
				}
				cursor.continue();
			} else {
				if (options.export_csv) {
					updateProgressBar(progressbar, '=', 10);
					items = ['date','submitted','approved','rejected','pending','earnings'];
					exports.csv.generic(results, items, 'daily_overview.csv');
				} else if (results.length) {
					if ($("#outertable").attr('role') !== 'grid') {
						initTablesorter('days');
					}

					HITStorage.overviewDailyResults_Push(results, page);

					$(".data-math-col-sum-num").each(function(index, element) {
						$(this).attr({'data-math': 'col-sum', 'data-math-mask': '#0'});
					});
					$(".data-math-col-sum-currency").each(function(index, element) {
						$(this).attr({'data-math': 'col-sum', 'data-math-mask': '0.00'});
					});
					$("#outertable").trigger('sorton', [[[0,1]]]);

				    $("#outertable").trigger("update", [true, function () {
				        setTimeout(function () {
				            $('#outertable').trigger('recalculate');
				        }, 500);
				    }]);

					$("#head_status").text('');
				} else {
					// show that nothing was returned
				}
			}
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.overviewDailyResults_Skeleton = function(options) {
	if (options.export_csv === true) {
		return false;
	}
	$("head>title").text('Daily Overview - HIT Database');

	b.append(
		$("<table></table>")
			.attr('id', 'outertable')
			.addClass('tablesorter')
			.css({'width': '90%', 'margin-left': 'auto', 'margin-right': 'auto'})
	);

	ot = $("#outertable");
	ot.append(
		$("<thead></thead>")
			.append(
				$("<tr></tr>")
					.addClass('tablesorter-ignoreRow')
					.append(
						$("<th></th>")
							.addClass('sorter-false'),
						$("<th></th>")
							.attr({'colspan': '4'})
							.addClass('sorter-false')
							.css({'text-align': 'center'})
							.text('HITs'),
						$("<th></th>")
							.attr({'colspan': '4'})
							.addClass('sorter-false')
							.css({'text-align': 'center'})
							.text('Dollars')
					),
				$("<tr></tr>")
					.append(
						$("<th></th>").text('Date').addClass('left')
							.data({placeholder: titles.filter.date}),
						$("<th></th>").text('Submitted').addClass('left')
							.data({placeholder: titles.filter.number}),
						$("<th></th>").text('Pending').addClass('left')
							.data({placeholder: titles.filter.number}),
						$("<th></th>").text('Approved').addClass('left')
							.data({placeholder: titles.filter.number}),
						$("<th></th>").text('Rejected').addClass('left')
							.data({placeholder: titles.filter.number}),
						$("<th></th>").text('Submitted').addClass('left')
							.data({placeholder: titles.filter.amount}),
						$("<th></th>").text('Pending').addClass('left')
							.data({placeholder: titles.filter.amount}),
						$("<th></th>").text('Approved').addClass('left')
							.data({placeholder: titles.filter.amount}),
						$("<th></th>").text('Rejected').addClass('left')
							.data({placeholder: titles.filter.amount})
					)
			),
		$("<tbody></tbody>")
			.attr({'id': 'results_area'}),
		$("<tfoot></tfoot>")
			.append(
				$("<tr></tr>")
					.css({'font-size': '1.1em'})
					.append(
						$("<td></td>").text(''),
						$("<td></td>")
							.addClass('right data-math-col-sum-num'),
						$("<td></td>")
							.addClass('right data-math-col-sum-num'),
						$("<td></td>")
							.addClass('right data-math-col-sum-num'),
						$("<td></td>")
							.addClass('right data-math-col-sum-num'),
						$("<td></td>")
							.addClass('right currency data-math-col-sum-currency'),
						$("<td></td>")
							.addClass('right currency data-math-col-sum-currency'),
						$("<td></td>")
							.addClass('right currency data-math-col-sum-currency'),
						$("<td></td>")
							.addClass('right currency data-math-col-sum-currency')
					)
			)
	);

	ot.before(createPager('head')).after(createPager('foot'));
	$("#header").text('Daily HIT Stats');
	$("#head_status").text(' - Loading...');
	$("#footer").html('<span style="font-weight: bold;">Earnings do not include bonuses.</span>');
};

HITStorage.overviewDailyResults_Push = function(results, page) {
	for (var i = page * 25; i < results.length; i++) {
		newline = HITStorage.overviewDailyResults_Format(results[i]);
		$("#results_area").append(newline);
	}
	$("#outertable").find('tbody').trigger('updateRows');
};

HITStorage.overviewDailyResults_Format = function(d) {
	var line = $("<tr></tr>");

	if (!d.submitted_reward && d.submitted_reward !== 0) {
		d.submitted_reward = 0;
	}
	if (!d.pending_reward && d.pending_reward !== 0) {
		d.pending_reward = 0;
	}
	if (!d.approved_reward && d.approved_reward !== 0) {
		d.approved_reward = 0;
	}
	if (!d.rejected_reward && d.rejected_reward !== 0) {
		d.rejected_reward = 0;
	}

	line.append(
		$("<td></td>")
			.attr({'data-text': d.date})
			.text(moment(d.date).format('MMMM D, YYYY'))
			.click(launch_hit_search(null, null, d.date, d.date))
			.addClass('pointer')
	);
	line.append(
		$("<td></td>")
			.text(d.submitted)
			.addClass('right pointer')
			.click(launch_hit_search(null, null, d.date, d.date))
			.attr({'title': titles.req.search.date.all})
	);
	line.append(
		$("<td></td>")
			.text(d.pending)
			.addClass('right pointer')
			.click(launch_hit_search(null, null, d.date, d.date, 'Pending'))
			.attr({'title': titles.req.search.date.pending})
	);
	line.append(
		$("<td></td>")
			.text(d.approved)
			.addClass('right pointer')
			.click(launch_hit_search(null, null, d.date, d.date, 'Approved'))
			.attr({'title': titles.req.search.date.approved})
	);
	line.append(
		$("<td></td>")
			.text(d.rejected)
			.addClass('right pointer')
			.click(launch_hit_search(null, null, d.date, d.date, 'Rejected'))
			.attr({'title': titles.req.search.date.rejected})
	);
	line.append(
		$("<td></td>")
			.attr({'data-text': (d.submitted_reward).toFixed(2)})
			.text('$' + (d.submitted_reward).toFixed(2))
			.addClass('right')
	);
	line.append(
		$("<td></td>")
			.attr({'data-text': (d.pending_reward).toFixed(2)})
			.text('$' + (d.pending_reward).toFixed(2))
			.addClass('right')
	);
	line.append(
		$("<td></td>")
			.attr({'data-text': (d.approved_reward).toFixed(2)})
			.text('$' + (d.approved_reward).toFixed(2))
			.addClass('right')
	);
	line.append(
		$("<td></td>")
			.attr({'data-text': (d.rejected_reward).toFixed(2)})
			.text('$' + (d.rejected_reward).toFixed(2))
			.addClass('right')
	);

	return line;
};

HITStorage.indexedDB.requester = function(requesterId) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");
		var index;
		var results = [];

		index = store.index('requesterId');
		var range = IDBKeyRange.only(requesterId);
		var page = 0,
			all_rejected = 0,
			all_approved = 0,
			all_pending = 0,
			all_hits = 0,
			sum = 0,
			firstDate = '',
			lastDate = '',
			month_year = {};
		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (all_hits === 0) {
					firstDate = cursor.value.date;
					lastDate = firstDate;
					requesterName = cursor.value.requesterName;
					HITStorage.requesterResults_Skeleton(requesterId, requesterName);
				}
				if (moment(firstDate).isAfter(moment(cursor.value.date))) {
					firstDate = cursor.value.date;
				}

				thisMonthYear = moment(cursor.value.date).format('YYYY-MM');
				if (!month_year[thisMonthYear]) {
					month_year[thisMonthYear] = {'all': 0, 'pending': 0, 'approved': 0, 'rejected': 0, 'reward': 0};
				}

				if (cursor.value.status == 'Rejected') {
					all_rejected++;
					month_year[thisMonthYear].rejected += 1;
				} else if (cursor.value.status == 'Pending Approval') {
					all_pending++;
					month_year[thisMonthYear].pending += 1;
				} else {
					all_approved++;
					month_year[thisMonthYear].approved += 1;

					sum += cursor.value.reward;
					month_year[thisMonthYear].reward += cursor.value.reward;
				}
				all_hits += 1;
				month_year[thisMonthYear].all += 1;

				if (moment(lastDate).isBefore(moment(cursor.value.date))) {
					lastDate = cursor.value.date;
				}
				cursor.continue();
			} else {
				initTablesorter('months');

				HITStorage.requesterResults_Push(month_year, requesterId);

				$("#outertable").trigger('sorton', [[[0,1]]]);

			    $("#outertable").trigger("update", [true, function () {
			        setTimeout(function () {
			            $('#outertable').trigger('recalculate');
			        }, 500);
			    }]);

				$("#head_status").text('');
				subheaderHtml = 'You have <a href="/hitdb/search/status=---/index=requesterId/term=' + requesterId;
				subheaderHtml += '">submitted ' + all_hits + ' HIT';
				subheaderHtml += (all_hits > 1 ? 's' : '') + '</a> to this requester ';
				subheaderHtml += (firstDate == lastDate ? ('on ' + moment(firstDate).format('MMMM D, YYYY')) : ('between ' + moment(firstDate).format('MMMM D, YYYY') + ' and ' + moment(lastDate).format('MMMM D, YYYY'))) + '.';
				subheaderHtml += '<br /><a href="https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=' + requesterId + '">Find HITs currently available on Mechanical Turk from this requester.</a><br />';
				subheaderHtml += '<a href="http://turkopticon.differenceengines.com/' + requesterId + '">See reviews about this requester</a> or <a href="' + TO_report_link(requesterId, requesterName) + '">review this requestor</a> on Turkopticon.';
				$("#footer").html(subheaderHtml);
			}
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.requesterResults_Skeleton = function(requesterId, requesterName) {
	$("head>title").text(requesterName + ' - Requester Information - HIT Database');

	b.append(
		$("<table></table>")
			.attr({'id': 'outertable'})
			.css({'margin-right': 'auto', 'margin-left': 'auto', 'width': '90%'})
	);

	ot = $("#outertable");
	ot.append(
		$("<thead></thead>")
			.append(
				$("<tr></tr>")
					.append(
						$("<th></th>").text('Month'),
						$("<th></th>").text('Submitted'),
						$("<th></th>").text('Approved'),
						$("<th></th>").text('Rejected'),
						$("<th></th>").text('Pending'),
						$("<th></th>").text('Earnings')
					)
			)
	);

	ot.append(
		$("<tbody></tbody>")
			.attr({'id': 'results_area'}),
		$("<tfoot></tfoot>")
			.append(
				$("<tr></tr>")
					.css({'font-size': '1.1em'})
					.append(
						$("<td></td>").text(''),
						$("<td></td>")
							.attr({'data-math': 'col-sum', 'data-math-mask': '#0'})
							.addClass('right'),
						$("<td></td>")
							.attr({'data-math': 'col-sum', 'data-math-mask': '#0'})
							.addClass('right'),
						$("<td></td>")
							.attr({'data-math': 'col-sum', 'data-math-mask': '#0'})
							.addClass('right'),
						$("<td></td>")
							.attr({'data-math': 'col-sum', 'data-math-mask': '#0'})
							.addClass('right'),
						$("<td></td>")
							.attr({'data-math': 'col-sum', 'data-math-mask': '0.00'})
							.addClass('right currency')
					)
			)
	);

	ot.before(createPager()).after(createPager(false));
	$("#header").text('Requester: ' + requesterName + ' (' + requesterId + ')');
	$("#head_status").text(' - Loading...');
};

HITStorage.requesterResults_Push = function(month_year, requesterId) {
	for (var i = 0; i < _.size(month_year); i++) {
		key = Object.keys(month_year)[i];
		$("#results_area").append(
			$("<tr></tr>")
				.append(
					$("<td></td>")
						.attr({'data-text': key})
						.addClass('left')
						.text(moment(key + '-01').format('MMMM, YYYY')),
					$("<td></td>")
						.addClass('right pointer')
						.attr({'title': 'View all HITs submitted to this requester for ' + moment(key + '-01').format('MMMM, YYYY')})
						.text(month_year[key].all)
						.click(launch_hit_search(requesterId, 'requesterId', key + '-01', moment(key + '-01').endOf('month').format('YYYY-MM-DD'))),
					$("<td></td>")
						.addClass('right pointer')
						.attr({'title': 'View all HITs submitted to this requester for ' + moment(key + '-01').format('MMMM, YYYY') + ' that were approved'})
						.text(month_year[key].approved)
						.click(launch_hit_search(requesterId, 'requesterId', key + '-01', moment(key + '-01').endOf('month').format('YYYY-MM-DD'), 'Approved')),
					$("<td></td>")
						.addClass('right pointer')
						.attr({'title': 'View all HITs submitted to this requester for ' + moment(key + '-01').format('MMMM, YYYY') + ' that were rejected'})
						.text(month_year[key].rejected)
						.click(launch_hit_search(requesterId, 'requesterId', key + '-01', moment(key + '-01').endOf('month').format('YYYY-MM-DD'), 'Rejected')),
					$("<td></td>")
						.addClass('right pointer')
						.attr({'title': 'View all HITs submitted to this requester for ' + moment(key + '-01').format('MMMM, YYYY') + ' that are still pending'})
						.text(month_year[key].pending)
						.click(launch_hit_search(requesterId, 'requesterId', key + '-01', moment(key + '-01').endOf('month').format('YYYY-MM-DD'), 'Pending')),
					$("<td></td>")
						.attr({'data-text': (month_year[key].reward).toFixed(2)})
						.addClass('right')
						.text('$' + (month_year[key].reward).toFixed(2))
				)
		);
	}
	$("#outertable").find('tbody').trigger('updateRows');
};

HITStorage.indexedDB.getHIT = function(id) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");

		var request = store.get(id);

		request.onsuccess = function(e) {
			db.close();
			showDetails(e.target.result.note);
		};

		request.onerror = function(e) {
			console.log("Error Getting: ", e);
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.addNote = function(id, note) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["NOTES"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("NOTES");
		var request;

		if (note === '') {
			request = store.delete(id);
		} else {
			request = store.put({requesterId: id, note: note});
		}

		request.onsuccess = function(e) {
			db.close();
		};

		request.onerror = function(e) {
			console.log("Error Adding: ", e);
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.isHitBlocked = function(requesterId, requesterName, title, hitElement) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;

		if (!db.objectStoreNames.contains("BLOCKS")) {
			db.close();
			return;
		}
		var trans = db.transaction(["BLOCKS"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("BLOCKS");
		var index = store.index("requesterId");
		var range = IDBKeyRange.only(requesterId);

		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				re = new RegExp(cursor.value.re);
				if (re.test(title) || cursor.value.re === '') {
					dataParent = hitElement.find('table').first().children('tbody').first();
					dataParent.children('tr').eq(2).hide();
					dataParent.children('tr').eq(1).find('td').eq(3).hide();
					dataParent.children('tr').eq(1).find('td').eq(1).css({'font-size': 'small'});
					dataParent.children('tr').eq(1).find('td').eq(1).find('a').first().click(dialog_requester_unblock(requesterId, requesterName, title, (cursor.value.re === '' ? 'all' : 'title'))).append('<span style="color: red; font-variant: small-caps;"> blocked - click to unblock</span>');
					dataParent.children('tr').eq(1).find('td').eq(1).append(dataParent.find('[id*="notelabel"]'));

					// move blocked hits to the bottom
					hitElement.parent().append(hitElement);
				} else {
					cursor.continue();
				}
			} else {
				db.close();
			}
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.addBlock = function(requesterId, re) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["BLOCKS"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("BLOCKS");
		var request;

		request = store.put({requesterId: requesterId, re: re});

		request.onsuccess = function(e) {
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

// Removes all blocks for requesterId, where RE matches this HIT title
HITStorage.indexedDB.removeBlocks = function(requesterId, title, blockAll) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		if (!db.objectStoreNames.contains("BLOCKS")) {
			db.close();
			return;
		}
		var trans = db.transaction(["BLOCKS"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("BLOCKS");
		var index = store.index("requesterId");
		var range = IDBKeyRange.only(requesterId);

		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				re = new RegExp(cursor.value.re);
				if (re.test(title) || blockAll === true) {
					store.delete(cursor.value.id);
				}
			}
		};
		db.close();
		dialogs.refreshPage();
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.updateNoteButton = function(id, label) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;

		if (!db.objectStoreNames.contains("NOTES")) {
			label.title = 'Update HIT Database on statusdetail page to use this feature';
			db.close();
			return;
		}
		var trans = db.transaction(["NOTES"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("NOTES");

		store.get(id).onsuccess = function(event) {
			if (event.target.result === undefined) {
				label.text('');
			} else {
				var note = event.target.result.note;
				label.text(note).css({'border': '1px dotted', 'color': (note.indexOf('!') >= 0 ? 'red' : 'black')});
			}
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.colorRequesterButton = function(id, button) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		if (!db.objectStoreNames.contains("HIT")) {
			button.title = 'Update HIT database on statusdetail page to use this feature';
			db.close();
			return;
		}
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");

		var index = store.index("requesterId");
		index.get(id).onsuccess = function(event) {
			if (event.target.result === undefined) {
				$("#" + button).css({'color': 'red'});
			} else {
				$("#" + button).css({'color': 'darkgreen', 'font-weight': 'bold'});
			}
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.colorTitleButton = function(title, button) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		if (!db.objectStoreNames.contains("HIT")) {
			button.title = 'Update HIT database on statusdetail page to use this feature';
			db.close();
			return;
		}
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");

		var index = store.index("title");
		index.get(title).onsuccess = function(event) {
			if (event.target.result === undefined) {
				$("#" + button).css({'color': 'red'});
			} else {
				$("#" + button).css({'color': 'darkgreen', 'font-weight': 'bold'});
			}

			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.deleteDB = function() {
	var deleteRequest = indexedDB.deleteDatabase("HITDB");
	deleteRequest.onsuccess = function(e) {
		alert("deleted");
	};
	deleteRequest.onblocked = function(e) {
		alert("blocked");
	};
	deleteRequest.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.get_pending_approvals = function() {
	var element = document.getElementById('pending_earnings_value');
	var header_element = document.getElementById('pending_earnings_header');
	if (element === null) {
		return;
	}

	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");

		var result = 0;
		var index;
		var range;

		index = store.index('status');
		range = IDBKeyRange.only('Pending Approval');

		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				result += cursor.value.reward;
				cursor.continue();
			} else {
				element.textContent = '$' + result.toFixed(2);
				if (header_element !== null) {
					header_element.textContent = 'Pending earnings';
					header_element.setAttribute('title', 'Upd: ' + localStorage.getItem('hitdb_updated_datetime'));
				}
			}
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.get_pending_payments = function() {
	var element = document.getElementById('pending_earnings_value');
	if (element === null) {
		return;
	}

	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");

		var result = 0;
		var index;
		var range;

		index = store.index('status');
		range = IDBKeyRange.only('Approved&nbsp;- Pending&nbsp;Payment');

		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				result += cursor.value.reward;
				cursor.continue();
			} else {
				element.title = 'Approved - Pending Payment: $' + result.toFixed(2);
			}
		};
		db.close();
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.prepare_projected_earnings = function(date, update_to_screen, longtermOnly) {
	date = date || '';
	if (update_to_screen !== false) {
		update_to_screen = true;
	}
	if (longtermOnly !== true) {
		longtermOnly = false;
	}

	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");

		var result = 0;
		var rejected = 0;
		var index;
		var range;

		index = store.index('date');
		range = IDBKeyRange.only(date);

		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (cursor.value.date == date || date === '') {
					if (cursor.value.status == 'Rejected') {
						rejected += cursor.value.reward;
					} else {
						result += cursor.value.reward;
					}
				}
				cursor.continue();
			} else {
				if (update_to_screen) {
					var target, bonus, span_to_delete, no_break, progress;
					if (localStorage.getItem('hitdb_goal_daily_target') !== null && !longtermOnly) {
						target = parseFloat(+localStorage.getItem('hitdb_goal_daily_target'));
						if ($("#total_row1").length && localStorage.getItem('hitdb_goal_settings_ltadd') === 'yes') {
							var yesterdaysTake = parseFloat($("#total_row1").text());
							if (yesterdaysTake.toFixed(2) < target.toFixed(2)) {
								target = target + (target - yesterdaysTake);
							}
						}
						var bonus_field = $("#bonus_row0");
						var goal_header = $("#goal_header");
						var goal_value = $("#goal_value");
						span_to_delete = $("#progress_bar_today");
						bonus = (isNaN(+bonus_field.text())) ? 0 : +bonus_field.text();
						var todays_money = +(parseFloat(result + bonus).toFixed(2));
						no_break = false;
						progress = Math.floor((+todays_money) / target * 80);

						if (progress > 80) {
							progress = 80;
						}

						if (span_to_delete.length) {
							span_to_delete.remove();
							no_break = true;
						}

						if (!no_break) {
							goal_header.append("<br />");
						}

						goal_header.append(
							$("<div></div>")
								.attr('id', 'progress_bar_today')
								.css({'line-height': '14px', 'margin-top': '3px', 'font-size': '9px'})
								.html(progress_bar(progress, 80, '█', '█', '#7fb448', 'grey') + '&nbsp;' + ((todays_money > target) ? '+$' + ((todays_money - target).toFixed(2)) + ' above $' : ('$' + (target - todays_money).toFixed(2)) + ' left to $') + target.toFixed(2))
						);

						if (todays_money > target && localStorage.getItem('hitdb_goal_settings_displaystyle') === 'remaining') {
							// plus display
							newAmount = (todays_money - target).toFixed(2);
							goal_value.css('color', 'green').text('+$' + newAmount);
						} else if (todays_money > target) {
							newAmount = todays_money.toFixed(2);
							goal_value.css('color', 'green').text('$' + newAmount);
						} else if (localStorage.getItem('hitdb_goal_settings_displaystyle') === 'earned' || localStorage.getItem('hitdb_goal_settings_displaystyle') === null) {
							newAmount = todays_money.toFixed(2);
							goal_value.text('$' + newAmount).css('color', 'black');
						} else {
							newAmount = (target - todays_money).toFixed(2);
							goal_value.css('color', 'red').text('-$' + newAmount);
						}
						if ($("#goal_value:hidden").length) {
							$("#goal_value_in_header").text('$' + newAmount);
						}
					} else if (!longtermOnly) {
						$("#goal_value").text('$' + result.toFixed(2));
						if ($("#goal_value:hidden").length) {
							$("#goal_value_in_header").text('- Today: $' + result.toFixed(2));
						}
					}
					updateProgressBar(progressbar, 'r*', 0.5);

					if (localStorage.getItem('hitdb_goal_longterm_target') !== null && localStorage.getItem('hitdb_goal_longterm_startdate') !== null && localStorage.getItem('hitdb_temp_longterm_bonus') !== null) {
						target = +localStorage.getItem('hitdb_goal_longterm_target');
						bonus = (isNaN(localStorage.getItem('hitdb_temp_longterm_bonus'))) ? 0 : +localStorage.getItem('hitdb_temp_longterm_bonus');
						localStorage.removeItem('hitdb_temp_longterm_bonus');
						var prev = (isNaN(localStorage.getItem('hitdb_temp_longterm_earn'))) ? 0 : +localStorage.getItem('hitdb_temp_longterm_earn');
						localStorage.removeItem('hitdb_temp_longterm_earn');
						var earned_money = +(parseFloat(bonus + prev).toFixed(2));
						var longterm_goal_header = $("#longterm_goal_header");
						var longterm_goal_value = $("#longterm_goal_value");
						span_to_delete = $("#progress_bar_longterm");
						no_break = false;
						progress = Math.floor((+earned_money) / target * 80);

						if (progress > 80) {
							progress = 80;
						}

						if (span_to_delete.length) {
							span_to_delete.remove();
							no_break = true;
						}

						if (!no_break) {
							longterm_goal_header.append("<br />");
						}

						longterm_goal_header.append(
							$("<div></div>")
								.attr('id', 'progress_bar_longterm')
								.css({'line-height': '14px', 'margin-top': '3px', 'font-size': '9px'})
								.html(progress_bar(progress, 80, '█', '█', '#7fb448', 'grey') + '&nbsp;' + ((earned_money > target) ? '+$' + ((earned_money - target).toFixed(2)) + ' above $' : ('$' + (target - earned_money).toFixed(2)) + ' left to $') + target.toFixed(2))
						);

						if (earned_money > target && localStorage.getItem('hitdb_goal_settings_displaystyle') === 'remaining') {
							// plus display
							newAmount = (earned_money - target).toFixed(2);
							longterm_goal_value.css('color', 'green').text('+$' + newAmount);
						} else if (earned_money > target) {
							newAmount = earned_money.toFixed(2);
							longterm_goal_value.css('color', 'green').text('$' + newAmount);
						} else if (localStorage.getItem('hitdb_goal_settings_displaystyle') === 'earned' || localStorage.getItem('hitdb_goal_settings_displaystyle') === null) {
							newAmount = earned_money.toFixed(2);
							longterm_goal_value.text('$' + newAmount).css('color', 'black');
						} else {
							newAmount = (target - earned_money).toFixed(2);
							longterm_goal_value.css('color', 'red').text('-$' + newAmount);
							newAmount = '-' + newAmount;
						}
						if ($("#longterm_goal_value:hidden").length) {
							$("#longterm_goal_value_in_header").text(' - LT: $' + newAmount + '/$' + target.toFixed(2));
						}
					}
					updateProgressBar(progressbar, '=', 99);
					//element.title = '$' + rejected.toFixed(2) + ' rejected';
				} else {
					localStorage.setItem('hitdb_temp_projected', parseFloat(result));
				}
			}
		};
		db.close();
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.get_earnings_ranged = function(options) {
	if (options.output !== false) {
		options.output = true;
	}
	var dateIndex = {};
	if (options.dateIndex) {
		dateIndex = options.dateIndex;
	} else if (options.target_row) {
		var from_date = options.from_date;
		var target_row = options.target_row;
		dateIndex[from_date] = target_row;
	}

	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");
		var req;

		var results = [];

		index = store.index('date');
		if (options.from_date || options.to_date) {
				if (options.from_date == options.to_date) {
					range = IDBKeyRange.only(options.from_date);
				} else if (options.from_date && options.to_date) {
					range = IDBKeyRange.bound(options.from_date, options.to_date, false, false);
				} else if (!options.from_date && options.to_date) {
					range = IDBKeyRange.upperBound(options.to_date, false);
				} else {
					range = IDBKeyRange.lowerBound(options.from_date, false);
				}
				req = store.openCursor(range);
		}
		var rejected = {};
		var pending = {};
		var paid = {};
		var total = {};
		var submitted = {};
		for (i = 0, len = Object.keys(dateIndex).length; i < len; i++) {
			keyIndex = Object.keys(dateIndex)[i];
			rowIndex = dateIndex[keyIndex];
			rejected[rowIndex] = 0;
			pending[rowIndex] = 0;
			paid[rowIndex] = 0;
			total[rowIndex] = 0;
			submitted[rowIndex] = 0;
		}
		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				curIndex = dateIndex[cursor.value.date];
				if (cursor.value.status === 'Rejected') {
					rejected[curIndex] += cursor.value.reward;
				} else if (cursor.value.status === 'Paid' || cursor.value.status === 'Approved&nbsp;- Pending&nbsp;Payment') {
					paid[curIndex] += cursor.value.reward;
				} else if (cursor.value.status === 'Pending Approval') {
					pending[curIndex] += cursor.value.reward;
				}
				if (cursor.value.status !== 'Rejected') {
					total[curIndex] += cursor.value.reward;
				}
				submitted[curIndex] += cursor.value.reward;
				cursor.continue();
			} else {
				if (options.output === true) {
					for (i = 0, len = Object.keys(dateIndex).length; i < len; i++) {
						keyIndex = Object.keys(dateIndex)[i];
						rowIndex = dateIndex[keyIndex];
						$("#submitted_row" + rowIndex).text(((isNaN(submitted[rowIndex])) ? 0 : +submitted[rowIndex]).toFixed(2));
						$("#paid_row" + rowIndex).text(((isNaN(paid[rowIndex])) ? 0 : +paid[rowIndex]).toFixed(2));
						$("#pending_row" + rowIndex).text(((isNaN(pending[rowIndex])) ? 0 : +pending[rowIndex]).toFixed(2));
						rejected_val = ((isNaN(rejected[rowIndex])) ? 0 : +rejected[rowIndex]).toFixed(2);
						if (rejected_val > 0) {
							$("#rejected_row" + rowIndex).parent().css('color', 'red');
						} else {
							$("#rejected_row" + rowIndex).parent().css('color', 'green');
						}
						$("#rejected_row" + rowIndex).text(rejected_val);
						$("#total_row" + rowIndex).text(((isNaN(total[rowIndex])) ? 0 : +total[rowIndex]).toFixed(2));
					}
				} else {
					var total_earnings = 0;
					for (var l = 0, len = Object.keys(total).length; l < len; l++) {
						keyIndex = Object.keys(total)[l];
						total_earnings += (isNaN(total[keyIndex]) ? 0 : +total[keyIndex]);
					}
					localStorage.setItem('hitdb_temp_longterm_earn', (isNaN(total_earnings) ? 0 : total_earnings));
				}
			}
		};
		db.close();
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.get_bonuses_ranged = function(options) {
	if (options.output !== false) {
		options.output = true;
	}
	var dateIndex = {};
	if (options.dateIndex) {
		dateIndex = options.dateIndex;
	} else if (options.target_row) {
		var from_date = options.from_date;
		var target_row = options.target_row;
		dateIndex[from_date] = target_row;
	}

	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["BONUS"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("BONUS");
		var req;

		var results = [];

		if (options.from_date || options.to_date) {
			if (options.from_date == options.to_date) {
				range = IDBKeyRange.only(options.from_date);
			} else if (options.from_date && options.to_date) {
				range = IDBKeyRange.bound(options.from_date, options.to_date, false, false);
			} else if (!options.from_date && options.to_date) {
				range = IDBKeyRange.upperBound(options.to_date, false);
			} else {
				range = IDBKeyRange.lowerBound(options.from_date, false);
			}
			req = store.openCursor(range);
		}
		var bonus = {};
		for (i = 0, len = Object.keys(dateIndex).length; i < len; i++) {
			keyIndex = Object.keys(dateIndex)[i];
			rowIndex = dateIndex[keyIndex];
			bonus[rowIndex] = 0;
		}
		store.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				curIndex = dateIndex[cursor.value.date];
				bonus[curIndex] = parseFloat(cursor.value.bonus);
				cursor.continue();
			} else {
				if (options.output === true) {
					for (i = 0, len = Object.keys(dateIndex).length; i < len; i++) {
						keyIndex = Object.keys(dateIndex)[i];
						rowIndex = dateIndex[keyIndex];
						if (!isNaN(bonus[rowIndex])) {
							$("#bonus_row" + rowIndex).text((+bonus[rowIndex]).toFixed(2));
							if (target_row) {
								var submit = parseFloat(+$("#submitted_row" + rowIndex).text());
								var reject = parseFloat(+$("#rejected_row" + rowIndex).text());
								var subtotal = submit - reject;
								grand_total = subtotal + (+bonus[rowIndex]);
							} else {
								var total = parseFloat(+$("#total_row" + rowIndex).text());
								grand_total = total + (+bonus[rowIndex]);
							}
							$("#total_row" + rowIndex).text((+grand_total).toFixed(2));
						}
					}
				} else {
					var total_earnings = 0;
					for (var m = 0, len = Object.keys(bonus).length; m < len; m++) {
						keyIndex = Object.keys(bonus)[m];
						total_earnings += (isNaN(bonus[keyIndex]) ? 0 : +bonus[keyIndex]);
					}
					localStorage.setItem('hitdb_temp_longterm_bonus', (isNaN(total_earnings) ? 0 : total_earnings));
				}
			}
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

HITStorage.indexedDB.update_bonus = function(options) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["BONUS"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("BONUS");
		var request;

		request = store.put({date: options.date, bonus: options.bonus});

		request.onsuccess = function(e) {
			db.close();
		};
	};
	request.onerror = HITStorage.indexedDB.onerror;
};

// Update database date format from MMDDYYYY to YYYY-MM-DD
// Shouldn't break anything even if used on already updated db
HITStorage.update_date_format = function(verbose) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("HIT");

		store.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (cursor.value.date.indexOf('-') < 0) {
					var i = cursor.value;
					i.date = convert_date(i.date);
					i.requesterName = i.requesterName.trim();
					i.title = i.title.trim();
					cursor.update(i);
				}
				cursor.continue();
			} else {
				db.close();
				HITStorage.update_stats_date_format(verbose);
			}
		};
	};
};

HITStorage.update_stats_date_format = function(verbose) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["STATS"], HITStorage.IDBTransactionModes.READ_WRITE);
		var store = trans.objectStore("STATS");

		store.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (cursor.value.date.indexOf('-') < 0) {
					var i = cursor.value;
					i.date = convert_date(i.date);
					cursor.delete();
					store.put(i);
				}
				cursor.continue();
			} else {
				// DB should be fully updated
				db.close();
				if (verbose === true) {
					alert('Date conversion done.');
				}
			}
		};
	};
};

HITStorage.exportStats = function(verbose) {
	var request = indexedDB.open("HITDB", v);
	request.onsuccess = function(e) {
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["STATS"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("STATS");

		var results = [];
		store.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				results.push(cursor.value);
				cursor.continue();
			} else {
				exportStatsCSV(results);
				db.close();
			}
		};
	};
};


/* ------------------------------------------------------------- */

HITStorage.prepare_donut = function(donutData, type) {
	if (type == '---') {
		return;
	}
	var countHits = true;
	if (type.match('REWARDS')) {
		countHits = false;
	}

	var tmpData = {};
	var topRequesters = [];
	var topHits = [];
	var sum = 0;

	for (var i = 0; i < donutData.length; i++) {
		var requesterName = donutData[i].requesterName.trim() + " (" + donutData[i].requesterId + ")";
		var hitTitle = donutData[i].title;
		var hitReward = donutData[i].reward;
		sum += (countHits) ? 1 : hitReward;

		if (tmpData[requesterName]) {
			tmpData[requesterName].HITS += (countHits) ? 1 : hitReward;
		} else {
			tmpData[requesterName] = {};
			tmpData[requesterName].HITS = (countHits) ? 1 : hitReward;
		}
		if (tmpData[requesterName][hitTitle]) {
			tmpData[requesterName][hitTitle] += (countHits) ? 1 : hitReward;
		} else {
			tmpData[requesterName][hitTitle] = (countHits) ? 1 : hitReward;
		}
	}

	for (var key in tmpData) {
		topRequesters.push({name: key, y: tmpData[key].HITS});
	}
	topRequesters.sort(function(a, b) { return b.y - a.y; });

	var colors = Highcharts.getOptions().colors;

	for (var n = 0; n < topRequesters.length; n++) {
		var tmpHits = [];
		topRequesters[n].color = colors[n];
		for (var key2 in tmpData[topRequesters[n].name]) {
			if (key2 != 'HITS') {
				tmpHits.push({name: key2, y: tmpData[topRequesters[n].name][key2], color: colors[n]});
			}
		}
		tmpHits.sort(function(a, b) { return b.y - a.y; });
		for (var j = 0; j < tmpHits.length ; j++) {
			var brightness = 0.2 - (j / tmpHits.length) / 5;
			tmpHits[j].color = Highcharts.Color(colors[i]).brighten(brightness).get();
		}
		topHits = topHits.concat(tmpHits);
	}

	document.getElementById('container').style.display = 'block';

	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'container',
			type: 'pie'
		},
		title: {
			text: 'Requesters and HITs matching your latest search'
		},
		yAxis: {
			title: {
				text: ''
			}
		},
		plotOptions: {
			pie: {
				shadow: false,
				dataLabels: {
					enabled: true
				}
			}
		},
		tooltip: {
			animation: false,
			valuePrefix: (countHits) ? '' : '$',
			valueSuffix: (countHits) ? ' HITs' : '',
			valueDecimals: (countHits) ? 0 : 2,
			pointFormat: (countHits) ? '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> (of all ' + sum + ' HITs)<br/>' :
			'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> (of all $' + sum.toFixed(2) + ')<br/>'
		},
		series: [{
			name: 'Requesters',
			data: topRequesters,
			size: '60%',
			dataLabels: {
				formatter: function() {
					if (countHits) {
						return this.y / sum >= 0.20 ? this.point.name : null;
					} else {
						return this.y / sum >= 0.20 ? this.point.name : null;
					}
				},
				color: 'black',
				distance: -10
			}
		}, {
			name: 'HITs',
			data: topHits,
			innerSize: '60%',
			dataLabels: {
				formatter: function() {
					if (countHits) {
						return this.y / sum > 0.05 ? this.point.name : null;
					} else {
						return this.y / sum > 0.05 ? this.point.name : null;
					}
				},
				color: 'black',
			}
		}]
	});
};

// Stolen from Today's Projected Earnings (http://userscripts.org/scripts/show/95331)
HITStorage.getHTTPObject = function() {
	if (typeof XMLHttpRequest != 'undefined') {
		return new XMLHttpRequest();
	}
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {}
	}
	return false;
};

// Stolen from Today's Projected Earnings (http://userscripts.org/scripts/show/95331)
// date format MMDDYYYY!
HITStorage.processPage = function(link, date, hitData) {
	var page = HITStorage.getHTTPObject();
	page.open("GET", link, false);
	page.send(null);
	return HITStorage.parse_data(page.responseText, date, hitData);
};

// Partly stolen from Today's Projected Earnings (http://userscripts.org/scripts/show/95331)
// date format MMDDYYYY!
HITStorage.parse_data = function(page_text, date, hitData) {
	var index  = 0;
	var index2 = 0;
	var page_html = document.createElement('div');
	page_html.innerHTML = page_text;

	var requesters = page_html.getElementsByClassName('statusdetailRequesterColumnValue');
	var titles = page_html.getElementsByClassName('statusdetailTitleColumnValue');
	var amounts = page_html.getElementsByClassName('statusdetailAmountColumnValue');
	var statuses = page_html.getElementsByClassName('statusdetailStatusColumnValue');
	var feedbacks = page_html.getElementsByClassName('statusdetailRequesterFeedbackColumnValue');

	var requesterName;
	var hitTitle;
	var hitReward;
	var hitStatus;
	var requesterId;
	var hitId;

	for (var k = 0; k < amounts.length; k++) {
		requesterName	= requesters[k].textContent;
		requesterLink	= requesters[k].childNodes[1].href;
		hitTitle		= titles[k].textContent;
		index			= amounts[k].innerHTML.indexOf('$');
		hitReward		= parseFloat(amounts[k].innerHTML.substring(index + 1));
		hitStatus		= statuses[k].innerHTML;
		hitFeedback		= feedbacks[k].textContent;

		requesterId = getQueryVariable(requesterLink,"requesterId");
		subject = getQueryVariable(requesterLink,"subject");
		subject = subject.split("+");
		hitId = subject[subject.length - 1];

		var hit = {
			hitId: hitId,
			date: convert_date(date),
			requesterName: requesterName.trim(),
			requesterLink: requesterLink.trim(),
			title: hitTitle.trim(),
			reward: hitReward,
			status: hitStatus,
			feedback: hitFeedback.trim(),
			requesterId: requesterId
		};

		//HITStorage.indexedDB.addHIT(hitData);
		hitData.push(hit);
	}

	return amounts.length;
};

//Used to simplify getting requester ID's and such
function getQueryVariable(url, variable) {
	var query = url.substring(1);
	var vars = query.split("?")[1].split("&");
	for (var i = 0; i < vars.length; i++)  {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return (false);
}

// Returns available days (YYYY-MM-DD)
HITStorage.getAllAvailableDays = function(try_extra_days) {
	var days = [];

	var page = HITStorage.getHTTPObject();
	page.open("GET", 'https://www.mturk.com/mturk/status', false);
	page.send(null);

	var page_html = document.createElement('div');
	page_html.innerHTML = page.responseText;

	var dateElements = page_html.getElementsByClassName('statusDateColumnValue');
	var submittedElements = page_html.getElementsByClassName('statusSubmittedColumnValue');
	var approvedElements = page_html.getElementsByClassName('statusApprovedColumnValue');
	var rejectedElements = page_html.getElementsByClassName('statusRejectedColumnValue');
	var pendingElements = page_html.getElementsByClassName('statusPendingColumnValue');
	var earningsElements = page_html.getElementsByClassName('statusEarningsColumnValue');

	var date;
	for (var i = 0; i < dateElements.length; i++) {
		date = dateElements[i].childNodes[1].href.substr(53);
		date = convert_date(date);

		days.push({
			date: date,
			submitted: parseInt(submittedElements[i].textContent),
			approved: parseInt(approvedElements[i].textContent),
			rejected: parseInt(rejectedElements[i].textContent),
			pending: parseInt(pendingElements[i].textContent),
			earnings: parseFloat(earningsElements[i].textContent.slice(1))
		});
	}

	if (try_extra_days > 0) {
		date = days[days.length - 1].date;
		var d = new Date();
		d.setFullYear(parseInt(date.substr(0, 4)), parseInt(date.substr(5, 2)) - 1, parseInt(date.substr(8, 2)));

		for (var j = 0; j < try_extra_days; j++) {
			d.setDate(d.getDate() - 1);
			var month = '0' + (d.getMonth() + 1);
			var day = '0' + d.getDate();
			if (month.length > 2) {
				month = month.substr(1);
			}
			if (day.length > 2) {
				day = day.substr(1);
			}
			date = '' + d.getFullYear() + '-' + month + '-' + day;

			days.push({
				date: date,
				submitted: -1,
				approved: -1,
				rejected: -1,
				pending: -1,
				earnings: -1
			});
		}
	}

	return days;
};

HITStorage.getLatestHITs = function() {
	if (localStorage.getItem('hitdb_update_auto') === null || localStorage.getItem('hitdb_update_auto') == 'OFF') {
		return;
	}

	if (localStorage.getItem('hitdb_updated_timestamp') !== null) {
		if (new Date().getTime() < new Date(parseInt(localStorage.getItem('hitdb_updated_timestamp'))).getTime() + 90000) {
			return;
		}
	}
	localStorage.setItem('hitdb_updated_timestamp', new Date().getTime());

	var auto_button = document.getElementById('auto_button');
	var page = HITStorage.getHTTPObject();
	page.open("GET", 'https://www.mturk.com/mturk/status', false);
	page.send(null);
	auto_button.textContent += ' +';

	var page_html = document.createElement('div');
	page_html.innerHTML = page.responseText;

	var dateElements = page_html.getElementsByClassName('statusDateColumnValue');
	var submittedElements = page_html.getElementsByClassName('statusSubmittedColumnValue');
	var approvedElements = page_html.getElementsByClassName('statusApprovedColumnValue');
	var rejectedElements = page_html.getElementsByClassName('statusRejectedColumnValue');
	var pendingElements = page_html.getElementsByClassName('statusPendingColumnValue');
	var earningsElements = page_html.getElementsByClassName('statusEarningsColumnValue');

	if (dateElements[0].childNodes[1].textContent.trim() != 'Today') {
		return;
	}

	var url = dateElements[0].childNodes[1].href;
	var date = url.substr(53); // keep MMDDYYYY
	var submitted = parseInt(submittedElements[0].textContent);
	//var approved = parseInt(approvedElements[0].textContent);
	//var rejected = parseInt(rejectedElements[0].textContent);
	//var pending  = parseInt(pendingElements[0].textContent);
	//var earnings = parseFloat(earningsElements[0].textContent.slice(1));
	var pages_done = null;
	if (localStorage.getItem('hitdb_update_auto_pages') !== null) {
		pages_done = JSON.parse(localStorage.getItem('hitdb_update_auto_pages'));
	}
	if (pages_done === null || pages_done.date != date) {
		pages_done = {date: date};
	}

	var new_hits = 0;
	page = 1 + Math.floor(submitted / 25);
	page = (page < 1) ? 1 : page;

	var hitData = [];
	if (submitted != pages_done.submitted) {
		url = "https://www.mturk.com/mturk/statusdetail?sortType=All&pageNumber=" + page + "&encodedDate=" + date;
		HITStorage.processPage(url, date, hitData);
		new_hits += submitted - pages_done.submitted;
		pages_done.submitted = submitted;
		localStorage.setItem('hitdb_update_auto_pages', JSON.stringify(pages_done));
		auto_button.textContent += '+';
	}

	if (page > 1) {
		extra_page = page - 1;

		while (extra_page >= 1) {
			if (pages_done[extra_page] !== true) {
				url = "https://www.mturk.com/mturk/statusdetail?sortType=All&pageNumber=" + extra_page + "&encodedDate=" + date;
				if (HITStorage.processPage(url, date, hitData) == 25) {
					pages_done[extra_page] = true;
					localStorage.setItem('hitdb_update_auto_pages', JSON.stringify(pages_done));
					auto_button.textContent += '+';
				}
				break;
			}
			extra_page -= 1;
		}
	}
	HITStorage.indexedDB.addHITs(hitData);
};

// Gets status details for given date (MMDDYYYY)
// Collects all HITs for given date to hitData array
HITStorage.getHITData = function(day_to_fetch, hitData, page, days_to_update) {
	var dataDate = convert_iso_date(day_to_fetch.date);
	page = page || 1;
	detailed_status_page_link = "https://www.mturk.com/mturk/statusdetail?sortType=All&pageNumber=" + page + "&encodedDate=" + dataDate;

	if (HITStorage.processPage(detailed_status_page_link, dataDate, hitData) === 0) {
		if (day_to_fetch.submitted == -1 || hitData.length == day_to_fetch.submitted) {
			setTimeout(function() { HITStorage.indexedDB.addHITs(hitData, day_to_fetch, days_to_update); }, 1000);
		} else {
			alert("There was an error while fetching HITs for date: " + day_to_fetch.date + ".\n" + "Script monkeys expected " + day_to_fetch.submitted + " bananas, but got " + hitData.length + "! ?");
			HITStorage.updateCompleted();
		}
	} else {
		per_day = Math.floor(92 / days_to_update);
		per_page = (day_to_fetch.submitted > 0 ? (25 / day_to_fetch.submitted) : 0);
		update_now = +(per_page * per_day);
		updateProgressBar(progressbar, '+', update_now);
		HITStorage.updateStatusLabel('Script monkeys are fetching status pages:<br />' + day_to_fetch.date + ', page ' + page);
		setTimeout(function() { HITStorage.getHITData(day_to_fetch, hitData, page + 1, days_to_update); }, 1000);
	}
};

HITStorage.formatTime = function(msec) {
	if (isNaN(msec)) {
		return "-";
	}
	var seconds = Math.floor(msec / 1000) % 60;
	var minutes = Math.floor((msec / 1000) / 60) % 60;
	var hours = Math.floor(((msec / 1000) / 60) / 60) % 24;
	var days = Math.floor(((msec / 1000) / 60) / 60 / 24);

	if (hours > 0) {
		seconds = "";
	} else {
		seconds = "" + seconds + "s";
	}
	minutes = (minutes === 0 ? "" : "" + minutes + "m ");
	hours = (hours === 0 ? "" : "" + hours + "h ");

	if (days > 0) {
		return '' + days + ' day' + ((days > 1) ? 's' : ' ') + hours;
	}
	return hours + minutes + seconds;
};

HITStorage.updateStatusLabel = function(new_status, color) {
	$("#status_label").html(new_status).css('color', color || 'black');
};

// Accepts YYYY-MM-DD
HITStorage.validate_date = function(input, showError) {
	$("#generic_modal_dialog_error").html('');
	date = input.val();
	if (date.match(/^[01]\d\/[0123]\d\/20\d\d$/) !== null) {
		var d = date.split('\/');
		date = d[2] + '-' + d[0] + '-' + d[1];
		input.val(date);
	}

	if (date.match(/^$|^20\d\d\-[01]\d\-[0123]\d$/) !== null) {
		input.css('background-color', 'white');
		return true;
	}
	input.css('background-color', 'pink');
	if (showError) {
		dialogs.error('Invalid Date', 'You entered an invalid date. Please try again (ensuring the date is in the format YYYY-MM-DD) or use the date picker.', input);
	}
	return false;
};

HITStorage.validate_dates = function(from, to) {
	$("#generic_modal_dialog_error").html('');
	if (HITStorage.validate_date($(from)) && HITStorage.validate_date($(to))) {
		if ($(from).val() > $(to).val() && $(to).val() !== '') {
			dialogs.error('Invalid Date', 'You entered an invalid date. Please try again (ensuring the date is in the format YYYY-MM-DD) or use the date picker.');
			return false;
		}
		return true;
	}
	dialogs.error('Invalid Date', 'You entered an invalid date. Please try again (ensuring the date is in the format YYYY-MM-DD) or use the date picker.');
	return false;
};

HITStorage.status_color = function(status) {
	var color = "green";

	if (status.match("Pending Approval")) {
		color = "goldenrod";
	} else if (status.match("Rejected")) {
		color = "red";
	}

	return color;
};

function TO_report_link(requesterId, requesterName) {
	return 'http://turkopticon.differenceengines.com/report?requester[amzn_id]=' + requesterId +
		'&requester[amzn_name]=' + encodeURI(requesterName.trim());
}

exports.csv.generic = function(results, items, filename) {
	var csvData = [];
	csvData.push(items);
	progressPerItem = results.length / 90;
	tempProgressUpdate = 0;
	for (var i = 0; i < results.length; i++) {
		tempProgressUpdate = progressPerItem + tempProgressUpdate;
		if (tempProgressUpdate >= progressbar.progressbar('value') + 1) {
			updateProgressBar(progressbar, '+', tempProgressUpdate);
			tempProgressUpdate = 0;
		}
		csvData.push(exports.csv.genericFormat(results[i], items));
	}
	var blob = new Blob([csvData.join('\n')], {type: "text/csv;charset=utf-8"});

	HITStorage.updateStatusLabel('Your file should now be downloading, or your browser will prompt you to save it. Click OK when you are done.');
	$("#progress_dialog").dialog("option", "height", 200);
	$("#progress_dialog").dialog("option", "buttons", {
		"OK": function() {
			HITStorage.updateStatusLabel('Search powered by non-Amazonian script monkeys');
			$("#progress_dialog").dialog("close");
		}
	});
	$("#progressbar").progressbar("option", "complete", function() { return false; });
	updateProgressBar(progressbar, '=', 100);

	saveAs(blob, filename);
};

exports.csv.genericFormat = function(result, items) {
	line = '';
	for (j = 0; j < items.length; j++) {
		if ((items[j] == 'reward' || items[j] == 'earnings')) {
			result[items[j]] = (result[items[j]]).toFixed(2);
		}
		line += (items[j].search('Name') > -1 ? '"' + result[items[j]] + '"' : result[items[j]]);
		line += (j+1 == items.length ? '' : ',');
	}
	return [line];
};

exports.csv.HITs = function(results) {
	var csvData = [];
	HITStorage.updateStatusLabel('Formatting records...');
	items = ['hitId','date','requesterName','requesterId','title','reward','status','feedback'];
	csvData.push(items);
	for (var i = 0; i < results.length; i++) {
		csvData.push(exports.csv.HITsFormat(results[i], items));
	}
	var blob = new Blob([csvData.join('\n')], {type: "text/csv;charset=utf-8"});
	HITStorage.updateStatusLabel('Your file should now be downloading, or your browser will prompt you to save it. Click OK when you are done.');
	$("#progress_dialog").dialog("option", "height", 200);
	$("#progress_dialog").dialog("option", "buttons", {
		"OK": function() {
			HITStorage.updateStatusLabel('Search powered by non-Amazonian script monkeys');
			$("#progress_dialog").dialog("close");
		}
	});
	$("#progressbar").progressbar("option", "complete", function() { return false; });
	updateProgressBar(progressbar, '=', 100);
	saveAs(blob, "hit_database.csv");
};

exports.csv.HITsFormat = function(hit, items) {
	var line = '';
	var rplc = ['requesterName', 'title', 'feedback'];
	for (var j = 0; j < items.length; j++) {
		cur = items[j];
		if (hit[cur] !== undefined) {
			if (_.contains(rplc, cur)) {
				line += '"' + hit[cur].trim().replace(/"/g, '&quot;') + '"';
			} else if (cur == 'reward') {
				line += hit.reward.toFixed(2);
			} else {
				line += '"' + hit[cur].trim() + '"';
			}
		} else {
			line += '"(no data found)"';
		}
		line += (j <= 6 ? ',' : '');
	}
	return line;
};

exports.csv.bonuses = function(results) {
	updateProgressBar(progressbar, '+', 45);
	var csvData = [];
	csvData.push(['date','bonus']);
	for (var i = 0; i < results.length; i++) {
		updateProgressBar(progressbar, '+', 2);
		csvData.push('"' + results[i].date + '",' + results[i].bonus.toFixed(2));
	}
	var blob = new Blob([csvData.join('\n')], {type: "text/csv;charset=utf-8"});

	saveAs(blob, "hit_database_bonus.csv");
	HITStorage.updateStatusLabel('Your file should now be downloading, or your browser will prompt you to save it. Click OK when you are done.');
	$("#progress_dialog").dialog("option", "height", 200);
	$("#progress_dialog").dialog("option", "buttons", {
		"OK": function() {
			HITStorage.updateStatusLabel('Search powered by non-Amazonian script monkeys');
			$("#progress_dialog").dialog("close");
		}
	});
	$("#progressbar").progressbar("option", "complete", function() { return false; });
	updateProgressBar(progressbar, '=', 100);
	$("#button_exportBonus").blur();
};

exports.csv.settings = function() {
	var csvData = [['key', 'value']];
	for (var i = 0; i < _.size(localStorage); i++) {
		if (localStorage.key(i).substr(0, 5) == 'hitdb') {
			if (_.find(impexSettings, function(num) { return num == localStorage.key(i).substr(6); })) {
				csvData.push([localStorage.key(i), localStorage.getItem(localStorage.key(i))]);
			}
		}
	}
	var blob = new Blob([csvData.join('\n')], {type: "text/csv;charset=utf-8"});

	saveAs(blob, 'hit_database_settings.csv');
	HITStorage.updateStatusLabel('Your file should now be downloading, or your browser will prompt you to save it. Click OK when you are done.');

	$("#progress_dialog").dialog("option", "height", 200);
	$("#progress_dialog").dialog("option", "buttons", {
		"OK": function() {
			HITStorage.updateStatusLabel('Search powered by non-Amazonian script monkeys');
			$("#progress_dialog").dialog("close");
		}
	});
	$("#progressbar").progressbar("option", "complete", function() { return false; });
	updateProgressBar(progressbar, '=', 100);
	$("#button_exportBonus").blur();
};

HITStorage.executeUpdate = function(days_to_update) {
	if (DAYS_TO_FETCH.length < 1) {
		HITStorage.checkUpdate();
		return;
	}
	HITStorage.updateStatusLabel('Please wait a moment...');

	var hits = [];
	updateProgressBar(progressbar, '+', 1);
	setTimeout(function() { HITStorage.getHITData(DAYS_TO_FETCH.shift(), hits, 1, days_to_update); }, 2000);
};

HITStorage.updateCompleted = function() {
	HITStorage.updateStatusLabel('Script monkeys have updated your local database', 'green');

	localStorage.setItem('hitdb_updated_datetime', new Date().toString());

	setTimeout(function() { HITStorage.updateStatusLabel('Please wait - reloading page in 3 seconds to reflect changes', 'red'); }, 1000);
	$("#progressbar").progressbar("option", "complete", function() { return false; });
	updateProgressBar(progressbar, '=', 100);
	setTimeout(function() {location.reload();}, 2500);
};

HITStorage.updateDatabase = function() {
	if (localStorage.getItem('hitdb_temp_updated_tryextra') == 'YES') {
		DAYS_TO_FETCH = HITStorage.getAllAvailableDays(20);
		localStorage.removeItem('hitdb_temp_updated_tryextra');
	} else {
		DAYS_TO_FETCH = HITStorage.getAllAvailableDays();
	}
	DAYS_TO_FETCH_CHECK = DAYS_TO_FETCH.slice(0);

	// remove extra days from checklist
	for (var i = 0; i < DAYS_TO_FETCH_CHECK.length; i++) {
		if (DAYS_TO_FETCH_CHECK[i].submitted == -1) {
			DAYS_TO_FETCH_CHECK = DAYS_TO_FETCH_CHECK.slice(0, i);
			break;
		}
	}

	DAYS_TO_FETCH = DAYS_TO_FETCH_CHECK.slice(0);
	HITStorage.updateStatusLabel('Please wait: script monkeys are preparing to start working', 'red');

	dialogs.progress('Updating HIT Database');
	var pb = $("#progress_dialog");
	pb.dialog("option", "dialogClass", "no-close");
	pb.dialog("option", "closeOnEscape", false);
	pb.append($("<br />"), $("#status_label"));

	setTimeout(function() { HITStorage.prepareUpdateCheckPendingPayments(); }, 500);
};

dialogs.import = function(type) {
	var title = 'Import ' + type + ' from CSV Backup';
	var instructions = 'Paste the contents of your CSV file into the text box below.<br /><br />CSV Separator: <input type="text" name="csv_sep" id="csv_sep" maxLength="1" size="1" value="," /><br /><textarea name="csv_data" id="csv_data" autofocus tabindex="1" />';

	gmd = $("#generic_modal_dialog");
	gmd.on('dialogopen', function(event, ui){ setTimeout(function(){ $('#csv_data').focus(); }, 10); });
	gmd.dialog("open");
	$("#generic_modal_dialog_instructions").html(instructions);
	gmd.dialog("option", "title", title);
	gmd.dialog("option", "width", 800);
	gmd.dialog("option", "height", 550);
	gmd.dialog("option", "minHeight", 550);
	gmd.dialog("option", "buttons", {
		"Import HITs": function() {
			if (type == 'HITs') {
				imports.verifyHITs($("#csv_data").val(), $("#csv_sep").val());
			} else if (type == 'Bonuses') {
				imports.verifyBonus($("#csv_data").val(), $("#csv_sep").val());
			} else if (type == 'Settings') {
				imports.verifySettings($("#csv_data").val(), $("#csv_sep").val());
			}
		},
		"Cancel": function() {
			gmd.dialog("close");
		}
	});

	$("#csv_data").css({'height': '350px', 'width': '95%'});
};

/*
 * CSVToArray() function is taken from:
 *
 * 	Blog Entry:
 * 	Ask Ben: Parsing CSV Strings With Javascript Exec() Regular Expression Command
 *
 *	 Author:
 *	 Ben Nadel / Kinky Solutions
 *
 *	 Link:
 *	 http://www.bennadel.com/index.cfm?event=blog.view&id=1504
 *
 *	 Date Posted:
 *	 Feb 19, 2009 at 10:03 AM
 */
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
utilities.CSVToArray = function(strData, strDelimiter) {
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || ",");

	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp(
		(
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"
		),
		"gi"
	);

	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];

	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;

	var strMatchedValue;
	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec(strData)) {

		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[1];

		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push([]);
		}

		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[2]) {
			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
		} else {
			// We found a non-quoted value.
			strMatchedValue = arrMatches[3];
		}

		// Now that we have our value string, let's add
		// it to the data array.
		arrData[arrData.length - 1].push(strMatchedValue);
	}

	// Return the parsed data.
	return arrData;
};

imports.verifyHITs = function(input, separator) {
	var lines = [];
	var hits = [];
	var dates = [];

	if (input.length > 0) {
		lines = utilities.CSVToArray(input, separator);
	}

	gmd = $("#generic_modal_dialog");
	var errors = 0, hit, status;
	for (var i = 0; i < lines.length; i++) {
		var error = false;
		try {
			if (lines[i][0] === null || lines[i][0] == 'hitId') {
				continue;
			}

			if (lines[i][6] == 'Approved - Pending Payment') {
				lines[i][6] = 'Approved&nbsp;- Pending&nbsp;Payment';
			}

			if (lines[i].length != 8) {
				error = true;
			}

			hit = {
				hitId: lines[i][0],
				date: convert_date(lines[i][1]),
				requesterName: lines[i][2],
				//This line was null in the version I was using. I added it in, giving it the proper format.
				//This setting is for the links to contact the requester in the status window
				requesterLink: "https://www.mturk.com/mturk/contact?subject=Regarding+Amazon+Mechanical+Turk+HIT+" + lines[i][0] + "&requesterId=" + lines[i][3] + "&requesterName=" + lines[i][2].replace(" ", "+"),
				requesterId: lines[i][3],
				title: lines[i][4],
				reward: parseFloat(lines[i][5]),
				status: lines[i][6],
				feedback: lines[i][7] || "" // If no feedback, put empty string
			};
			//This status thing is actually for the Hit Status page (daily overview). It was non-existent with the current version, I added the functionality in here.
			//This sets up a simple associative array for the initial "date" entry for the hit stats. See below for implementation
			status = {
				date: hit.date,
				approved: (hit.status != "Rejected" ? 1 : 0),
				earnings: (hit.status != "Rejected" ? hit.reward : 0),
				pending: (hit.status != "Pending" ? 0 : 1),
				rejected: (hit.status == "Rejected" ? 1 : 0),
				submitted: 1
			};
		} catch (err) { error = true; }

		if (error === false) {
			hits.push(hit);
			//Implementation of status stuff. First I see if the object exists in my "dates" array,
			var index = utilities.lookup(hit.date, "date", dates);
			if (index != -1) {
				//if it does, add each value except date to update it. The values will either be 1 or 0, so just += should give the proper values (and it does based on testing
				for (var key in dates[index]) {
					if (key != "date") {
						dates[index][key] += status[key];
					}
				}
			} else {
				dates.push(status); //if the date doesn't exist in the array, add it as an initial object
			}
		} else {
			errors++;
		}
	}
	if (hits.length < 1) {
		$("#generic_modal_dialog_error_text").text('No HITs found in the data. Please try again.');
		return;
	} else {
		$("#generic_modal_dialog_instructions").html('Found ' + hits.length + ' HITs' + (errors > 0 ? ' and ' + errors + (errors == 1 ? ' error' : ' errors') : '') + '.<br /><br /><span style="color: red; font-weight: bold;">Do not reload this page until the import is complete.</span><br /><br />Press Continue to begin the import.');
		gmd.dialog("option", "title", "Confirm Import");
		gmd.dialog("option", "width", 400);
		gmd.dialog("option", "minHeight", 200);
		gmd.dialog("option", "height", 200);
		gmd.dialog("option", "buttons", {
			"Continue": function() {
				gmd.dialog("close");
				dialogs.progress('Importing HITs');
				$("#progress_dialog").append($("#status_label"));
				HITStorage.updateStatusLabel('Importing records...');
				setTimeout(updateProgressBar, 500, progressbar, '=', 2);
				setTimeout(HITStorage.indexedDB.importHITs, 1000, hits);
				//You have to call updateHITstats on a date object:
				//object = { date:"yyyy-mm-dd", (approved|pending|rejected):int num(Approved|Pending|Rejected), earnings:float totalEarningsForDay, submitted:int numHitsSubmittedThatDay }
				//Easiest hack to do so, parse over the dates objects I manipulated above, call update hit stats on each of them.
				for (var i = 0; i < dates.length; i++) {
					HITStorage.indexedDB.updateHITStats(dates[i]);
				}
			},
			"Cancel": function() {
				gmd.dialog("close");
			}
		});
	}
};

imports.verifyBonus = function(input, separator) {
	var lines = [];
	var bonuses = [];

	if (input.length > 0) {
		lines = utilities.CSVToArray(input, separator);
	}

	gmd = $("#generic_modal_dialog");
	var errors = 0, bonus, status;
	for (var i = 0; i < lines.length; i++) {
		var error = false;
		try {
			if (lines[i][0] === null || lines[i][0] == 'date') {
				continue;
			}

			if (lines[i].length != 2) {
				error = true;
			}

			bonus = {
				date: lines[i][0],
				bonus: lines[i][1],
			};
		} catch (err) { error = true; }

		if (error === false) {
			bonuses.push(bonus);
		} else {
			errors++;
		}
	}
	if (bonuses.length < 1) {
		$("#generic_modal_dialog_error_text").text('No bonuses found in the data. Please try again.');
		return;
	} else {
		$("#generic_modal_dialog_instructions").html('Found ' + bonuses.length + ' bonuses' + (errors > 0 ? ' and ' + errors + (errors == 1 ? ' error' : ' errors') : '') + '.<br /><br /><span style="color: red; font-weight: bold;">Do not reload this page until the import is complete.</span><br /><br />Press Continue to begin the import.');
		gmd.dialog("option", "title", "Confirm Import");
		gmd.dialog("option", "width", 400);
		gmd.dialog("option", "minHeight", 200);
		gmd.dialog("option", "height", 200);
		gmd.dialog("option", "buttons", {
			"Continue": function() {
				gmd.dialog("close");
				dialogs.progress('Importing Bonuses');
				$("#progress_dialog").append($("#status_label"));
				HITStorage.updateStatusLabel('Importing records...');
				setTimeout(updateProgressBar, 30, progressbar, '=', 5);
				setTimeout(HITStorage.indexedDB.importBonuses, 1000, bonuses);
			},
			"Cancel": function() {
				gmd.dialog("close");
			}
		});
	}
};

imports.verifySettings = function(input, separator) {
	var lines = [];
	var settings = [];

	if (input.length > 0) {
		lines = utilities.CSVToArray(input, separator);
	}

	gmd = $("#generic_modal_dialog");
	var errors = 0, success = 0, setting, status;
	for (var i = 0; i < lines.length; i++) {
		var error = false;
		try { 
			if (lines[i][0] === null || lines[i][0] == 'key') {
				continue;
			}

			if (lines[i].length != 2) {
				error = true;
			}

			//localStorage.setItem(lines[i][0], lines[i][1]);
			success++;
		} catch (err) { error = true; }

		if (error !== false) {
			errors++;
		}
	}

	if (success === 0) {
		$("#generic_modal_dialog_error_text").text('No settings found in the data. Please try again.');
		return;		
	} else {
		$("#generic_modal_dialog_instructions").html('Imported ' + success + ' settings' + (errors > 0 ? ' and found ' + errors + (errors == 1 ? ' error' : ' errors') : '') + '.');
		gmd.dialog("option", "title", "Import Completed");
		gmd.dialog("option", "width", 400);
		gmd.dialog("option", "minHeight", 200);
		gmd.dialog("option", "height", 200);
		gmd.dialog("option", "buttons", {
			"OK": function() {
				dialogs.refreshPage();
			}
		});
	}
};

//simple lookup function for searching I'm reusing.
utilities.lookup = function(needle, key, haystack) {
	for (var i = 0; i < haystack.length; i++) {
		if (haystack[i][key] == needle) {
			return i;
		}
	}
	return -1;
};

utilities.getRequesterIdFromURL = function(s) {
	var idx = 12 + s.search('requesterId=');
	return s.substr(idx);
}

function open_link(link) {
	return function() {
		window.open(link);
	};
}

function launch_hit_search(key, index, d1, d2, hitStatus, searchTerm) {
	d1 = d1 || '';
	d2 = d2 || d1;
	return function() {
		url = 'https://www.mturk.com/hitdb/search';
		url += '/status=' + (hitStatus ? hitStatus : '---');
		url += (d1 ? '/from_date=' + d1 : '');
		url += (d2 ? '/to_date=' + d2 : '');
		url += (index && key ? '/index=' + encodeURIComponent(index) + '/term=' + encodeURIComponent(key) : '');
		url += (searchTerm ? '/searchterm=' + encodeURIComponent(searchTerm) : '');
		window.open(url, 'search');
	};
}

buttonFuncs.overview = function(overviewType) {
	return function() {
		if (HITStorage.validate_dates('#overview_from_date', '#overview_to_date') === false) {
			return;
		}

		if ($("#overview_export_csv").prop('checked') === false) {
			url = 'https://www.mturk.com/hitdb/overview/' + overviewType.toLowerCase();
			url += ($("#overview_from_date").val() ? '/from_date=' + $("#overview_from_date").val() : '');
			url += ($("#overview_to_date").val() ? '/to_date=' + $("#overview_to_date").val() : '');
			window.open(url, 'hitdb_daily');
		} else {
			options = {};
			options.from_date = $("#overview_from_date").val();
			options.to_date = $("#overview_to_date").val();
			options.export_csv = true;
			dialogs.progress('Exporting Daily Overview');
			$("#progress_dialog").append($("#status_label"));
			$("#progress_dialog").dialog('option', 'buttons', {});
			HITStorage.updateStatusLabel('Compiling records...');
			setTimeout(function() { HITStorage.indexedDB['overview' + overviewType](options); }, 1000);
		}
	};
};

buttonFuncs.showRequester = function(requesterId) {
	return function() {
		window.open('https://www.mturk.com/hitdb/requester/' + requesterId, 'requester');
	};
};

buttonFuncs.search = function(event) {
	if (HITStorage.validate_dates('#from_date', '#to_date') === false) {
		console.log('bad dates');
		return;
	}

	var options = {};
	options.term = $("#search_term").val() || null;
	options.status = $("#status_select").val() || null;
	options.donut = $("#donut_select").val() || null;
	options.from_date = $("#from_date").val() || null;
	options.to_date = $("#to_date").val() || null;
	if (event) {
		if (event.data) {
			if (event.data.csv === true) {
				options.export_csv = true;
			} else {
				options.export_csv = false;
			}
		}
	}
	options.export_csv = options.export_csv || $("#export_csv").is(":checked") || false;

	key = null;
	index = null;
	if (options.status && options.status != '---') {
		key = options.status;
		index = 'status';
		options.status = null;
	}

	if (options.export_csv === true) {
		dialogs.progress('Exporting Database');
		$("#progress_dialog").append($("#status_label"));
		HITStorage.updateStatusLabel('Compiling records...');
		setTimeout(function() { HITStorage.indexedDB.search(options); }, 1000);
	} else {
		x = launch_hit_search(key, index, options.from_date, options.to_date, options.status, options.term);
		setTimeout(function() { x(); }, 500);
	}
};

buttonFuncs.delete = function() {
	return function() {
		if (confirm('This will remove your local HIT Database!\nContinue?')) {
			HITStorage.indexedDB.deleteDB();
		}
	};
};

buttonFuncs.import = function(type) {
	return function() {
		dialogs.import(type);
	};
};

buttonFuncs.exportBonuses = function() {
	dialogs.progress('Exporting Bonuses to CSV');
	$("#progress_dialog").append($("#status_label"));
	HITStorage.updateStatusLabel('Compiling records...');
	setTimeout(function() { HITStorage.indexedDB.exportBonuses(); }, 1000);
};

buttonFuncs.exportSettings = function() {
	dialogs.progress('Exporting Settings');
	$("#progress_dialog").append($("#status_label"));
	HITStorage.updateStatusLabel('Compiling records...');
	setTimeout(function() { exports.csv.settings(); }, 1000);		
};

buttonFuncs.autoUpdate = function() {
	autoButton = $("#auto_button");
	if (localStorage.getItem('hitdb_update_auto') === null) {
		alert('Enable Hit Database Auto Update\nWhen enabled, script will fetch last statusdetail pages and add them to database when this page is reloaded and at least two minutes have passed from last update. You still need to  do full update from dashboard every now and then.');
		autoButton.text('Auto Update is ON');
		autoButton.css({'color': 'green'});
		localStorage.setItem('hitdb_update_auto', 'ON');
	} else if (localStorage.getItem('hitdb_update_auto') == 'ON') {
		autoButton.text('Auto Update is OFF');
		autoButton.css({'color': 'red'});
		localStorage.setItem('hitdb_update_auto', 'OFF');
	} else {
		autoButton.text('Auto Update is ON');
		autoButton.css({'color': 'green'});
		localStorage.setItem('hitdb_update_auto', 'ON');
	}
};

function showhide_elements_callback(intervalId4, date, longtermOnly) {
	if ($("#goal_value").text().search('$') > -1) {
		window['prepare_wait' + intervalId4] = null;
		clearInterval(intervalId4);
		HITStorage.updateStatusLabel('Almost done...');
		if (localStorage.getItem('hitdb_settings_showhide_earningspending') == 'hide' && $("#earnings_pending_showhide").text() == '-') {
			toggle1 = toggle_hidden_earningspending();
			toggle1();
		}
		if (localStorage.getItem('hitdb_settings_showhide_earningstodate') == 'hide' && $("#earnings_to_date_showhide").text() == '-') {
			toggle2 = toggle_hidden_earningstodate();
			toggle2();
		}
		if (localStorage.getItem('hitdb_settings_showhide_extraheader') == 'hide' && $("#extra_header_showhide").text() == '-') {
			toggle3 = toggle_hidden_extraheader();
			toggle3();
		}
		if (localStorage.getItem('hitdb_settings_showhide_projected') == 'hide' && $("#projected_header_showhide").text() == '-') {
			toggle4 = toggle_hidden_projected();
			toggle4();
		}
		updateProgressBar(progressbar, '=', 100);
		HITStorage.updateStatusLabel('Loading completed!', 'green');
		if (window['newHITDB']) {
			$("#progress_dialog").dialog("option", "close", function() {
				newUserOrientation();
			});
		}
		setTimeout(function() {HITStorage.updateStatusLabel('Search powered by non-Amazonian script monkeys'); }, 990);
	} else {
		if (window['prepare_wait' + intervalId4] === undefined || window['prepare_wait' + intervalId4] === null) {
			window['prepare_wait' + intervalId4] = 0;
		} else {
			window['prepare_wait' + intervalId4] += 1;
		}
		updateProgressBar(progressbar, 'r*', 0.03);
		if (window['prepare_wait' + intervalId4] > 25) {
			// something went wrong, should not be taking this long
			window['prepare_wait' + intervalId4] = null;
			console.log('abandoned waiting for projected to finish');
			console.log('date: ' + date + ' / longtermOnly: ' + longtermOnly);
			HITStorage.updateStatusLabel('An error occurred while loading HIT Database Goals Edition. Please <a href="#" onclick="location.reload();">click here</a> to reload the page.<br /><br />Error code: prepare_wait4', 'red');
			clearInterval(intervalId3);
		}
	}
}

function prepare_projected_callback(date, intervalId, longtermOnly, data, retry) {
	retry = retry || 25;
	if (localStorage.getItem('hitdb_temp_longterm_bonus') !== null && localStorage.getItem('hitdb_temp_longterm_earn') !== null) {
		window['projected' + intervalId] = null;
		clearInterval(intervalId);
		updateProgressBar(progressbar, 'r*', 0.15);
		HITStorage.indexedDB.prepare_projected_earnings(date, true, longtermOnly);
		HITStorage.updateStatusLabel('Preparing projected earnings display...');
		intervalId4 = setInterval(function() {
			showhide_elements_callback(intervalId4, date, longtermOnly);
		}, 300);
	} else {
		if (window['projected' + intervalId] === undefined || window['projected' + intervalId] === null) {
			window['projected' + intervalId] = 0;
		} else {
			window['projected' + intervalId] += 1;
		}
		updateProgressBar(progressbar, 'r*', 0.03);
		if (window['projected' + intervalId] % 10 === 0) {
			console.log('checked ' + window['projected' + intervalId] + ' times for projected earnings & bonuses to be ready...continuing to wait');
		} else if (window['projected' + intervalId] % 3 === 0) {
			$("#status_label").text($("#status_label").text() + '.');
		}
		if (window['projected' + intervalId] > retry) {
			// something went wrong, should not be taking this long
			window['projected' + intervalId] = null;
			HITStorage.updateStatusLabel('An error occurred while loading HIT Database Goals Edition. Please <a href="#" onclick="location.reload();">click here</a> to reload the page.<br /><br />Error code: projected0', 'red');
			console.log('data:');
			console.log(data);
			console.log('date: ' + date + ' / longtermOnly: ' + longtermOnly);
			clearInterval(intervalId);
			console.log('abandoned preparing projected earnings');
		}
	}
}

function prepare_projected(date, dateIndex) {
	updateProgressBar(progressbar, 'r*', 0.1);
	longtermOnly = false;
	var nowPac = moment().tz('US/Pacific').format('D');
	var nowLocal = moment().format('D');
	// if passed date is before today's date, and we are still on Amazon's day, then we want a past date
	if (nowPac == nowLocal) {
		// our date matches Amazon's, even if we are in different timezones
		if (moment(date).isBefore(moment(), 'day')) {
			longtermOnly = true;
		}
	} else {
		// our date does not match Amazon's; we are past midnight but Amazon's day change has not yet occurred
		// so subtract a day from our date and see if they are still different
		if (moment(date).isBefore(moment().subtract(1, 'day'), 'day')) {
			longtermOnly = true;
		}
	}

	data = {};
	data.output = false;
	if (!date) {
		date = moment().format('YYYY-MM-DD');
	}
	data.from_date = (localStorage.getItem('hitdb_goal_longterm_startdate') ? localStorage.getItem('hitdb_goal_longterm_startdate') : date);
	if (moment(data.from_date).isAfter(moment(date), 'day')) {
		data.to_date = data.from_date;
		//data.from_date = date;
	} else {
		data.to_date = date;
	}
	data.dateIndex = getDatesBetween(moment(data.to_date), moment(data.from_date).subtract(1, 'day'));
	dates = _.size(data.dateIndex);
	retry = (dates * 3 < 4500 ? 4500 : dates * 3);

	HITStorage.indexedDB.get_earnings_ranged(data);
	HITStorage.indexedDB.get_bonuses_ranged(data);
	HITStorage.updateStatusLabel('Fetching earnings and bonuses for goals...');
	intervalId = setInterval(function() {
		prepare_projected_callback(date, intervalId, longtermOnly, data, retry);
	}, 300);
}

function prepare_projected_wait_callback(date, dateIndex, intervalId3) {
	if ($("#bonus_row0").text() !== '') {
		updateProgressBar(progressbar, 'r*', 0.05);
		window['prepare_wait' + intervalId3] = null;
		clearInterval(intervalId3);
		prepare_projected(date, dateIndex);
		HITStorage.updateStatusLabel('Preparing projected earnings...');
	} else {
		if (window['prepare_wait' + intervalId3] === undefined || window['prepare_wait' + intervalId3] === null) {
			window['prepare_wait' + intervalId3] = 0;
		} else {
			window['prepare_wait' + intervalId3] += 1;
		}
		updateProgressBar(progressbar, 'r*', 0.03);
		if (window['prepare_wait' + intervalId3] > 25) {
			// something went wrong, should not be taking this long
			window['prepare_wait' + intervalId3] = null;
			HITStorage.updateStatusLabel('An error occurred while loading HIT Database Goals Edition. Please <a href="#" onclick="location.reload();">click here</a> to reload the page.<br /><br />Error code: prepare_wait3', 'red');
			console.log('abandoned waiting to prepare projected');
			console.log('date: ' + date);
			console.log('dateIndex:');
			console.log(dateIndex);
			clearInterval(intervalId3);
		}
	}
}

function prepare_projected_wait(date, dateIndex) {
	if ($("#bonus_row0").text() === '') {
		updateProgressBar(progressbar, '+', 3);
		intervalId3 = setInterval(function() {
			prepare_projected_wait_callback(date, dateIndex, intervalId3);
		}, 300);
	} else {
		updateProgressBar(progressbar, '+', 10);
		HITStorage.updateStatusLabel('Preparing projected earnings display...');
		prepare_projected(date, dateIndex);
	}
}

function prepare_hit_status_display_callback_statuspage(intervalId3, retry, wait_length, options) {
	if ($("#bonus_row" + (wait_length - 1)) !== '') {
		window['prepare_wait' + intervalId3] = null;
		clearInterval(intervalId3);
		updateProgressBar(progressbar, '=', 99);
		HITStorage.updateStatusLabel('Almost done...');

		$("[id*='_row']").each(function() {
			var word = $(this).attr('id').split('_');
			newVal = parseFloat((+$("#sum_" + word[0]).text()) + (+$(this).text())).toFixed(2);
			$("#sum_" + word[0]).text(newVal);
		});
		if ($("#sum_rejected").text() != '0.00') {
			$("#sum_rejected").parent().css('color', 'red');
		}

		updateProgressBar(progressbar, '=', 100);
		HITStorage.updateStatusLabel('Loading completed!');
		setTimeout(function() {$("#status_label").hide();}, 990);
	} else {
		if (window['prepare_wait' + intervalId3] === undefined || window['prepare_wait' + intervalId3] === null) {
			window['prepare_wait' + intervalId3] = 0;
		} else {
			window['prepare_wait' + intervalId3] += 1;
		}

		if (window['prepare_wait' + intervalId3] % 10 === 0) {
			console.log('checked ' + window['prepare_wait' + intervalId3] + ' times for projected earnings & bonuses to be ready...continuing to wait');
		} else if (window['prepare_wait' + intervalId3] % 3 === 0) {
			$("#status_label").text($("#status_label").text() + '.');
		}

		updateProgressBar(progressbar, 'r*', 0.2);
		if (window['prepare_wait' + intervalId3] > wait_length) {
			// something went wrong, should not be taking this long
			window['prepare_wait' + intervalId3] = null;
			HITStorage.updateStatusLabel('An error occurred while loading HIT Database Goals Edition. Please <a href="#" onclick="location.reload();">click here</a> to reload the page.<br /><br />Error code: prepare_status3', 'red');
			console.log('abandoned waiting to prepare projected');
			console.log('options:');
			console.log(options);
			clearInterval(intervalId3);
		}
	}
}

function prepare_hit_status_display_callback(options, retry, intervalId2) {
	if ($("#total_row0").text() !== '') {
		clearInterval(intervalId2);
		HITStorage.indexedDB.get_bonuses_ranged(options, progressbar);
		wait_length = options.dateIndex.length;
		HITStorage.updateStatusLabel('Fetching bonuses for HIT status display...');
		if (document.location.href.match('https://www.mturk.com/mturk/status')) {
			updateProgressBar(progressbar, 'r*', 0.25);
			retry = (wait_length * 3 < 4500 ? 4500 : wait_length * 3);
			intervalId3 = setInterval(function() {
				prepare_hit_status_display_callback_statuspage(intervalId3, retry, wait_length, options);
			});
		} else {
			updateProgressBar(progressbar, 'r*', 0.05);
		}
	} else {
		if (window['hit_status' + intervalId2] === undefined || window['hit_status' + intervalId2] === null) {
			window['hit_status' + intervalId2] = 0;
		} else {
			window['hit_status' + intervalId2] += 1;
		}

		if (window['hit_status' + intervalId2] % 10 === 0) {
			console.log('checked ' + window['hit_status' + intervalId2] + ' times for projected earnings to be ready...continuing to wait');
		} else if (window['hit_status' + intervalId2] % 3 === 0) {
			$("#status_label").text($("#status_label").text() + '.');
		}

		updateProgressBar(progressbar, 'r*', 0.05);
		if (window['hit_status' + intervalId2] > retry) {
			// something went wrong, should not be taking this long
			window['hit_status' + intervalId2] = null;
			HITStorage.updateStatusLabel('An error occurred while loading HIT Database Goals Edition. Please <a href="#" onclick="location.reload();">click here</a> to reload the page.<br /><br />Error code: prepare_status2', 'red');
			console.log('abandoned preparing hit status display');
			console.log('options:');
			console.log(options);
			clearInterval(intervalId2);
		}
	}
}

function prepare_hit_status_display(options) {
	if (options) {
		HITStorage.indexedDB.get_earnings_ranged(options);
		updateProgressBar(progressbar, '+', 2);
		HITStorage.updateStatusLabel('Fetching earnings for HIT status display...');

		dates = moment(options.from_date).diff(moment(options.to_date), 'days');
		retry = (dates * 3 < 4500 ? 4500 : dates * 3);

		intervalId2 = setInterval(function() {
			prepare_hit_status_display_callback(options, retry, intervalId2);
		}, 300);
	}
}

function set_target_func(date, target, value, today) {
	if (target.substr(0, 5) == 'bonus') {
		target_name = 'hitdb_temp_specific_bonus';
		target_string = target.split('|');
		targetNo = target_string[1];
	} else {
		target_name = 'hitdb_goal_' + target + '_target';
	}

	value = parseFloat(value);

	if (target_name === 'hitdb_temp_specific_bonus') {
		HITStorage.indexedDB.update_bonus({'date': date, 'bonus': value});
		setTimeout(HITStorage.indexedDB.get_bonuses_ranged, 1000, {'from_date': date, 'to_date': date, 'target_row': targetNo});
	} else {
		localStorage.setItem(target_name, value.toFixed(2));
	}

	dateIndex = {};
	if (target === 'longterm') {
		if (localStorage.getItem('hitdb_goal_longterm_startdate') === null) {
			localStorage.setItem('hitdb_goal_longterm_startdate', today);
		}
		if (localStorage.getItem('hitdb_goal_longterm_startdate') !== today) {
			dateIndex = getDatesBetween(moment(), moment(localStorage.getItem('hitdb_goal_longterm_startdate')).subtract(1, 'day'));
		} else {
			dateIndex[today] = 0;
		}
	} else if (target === 'daily') {
		dateIndex[today] = 0;
	} else {
		dateIndex[date] = targetNo;
	}

	if (document.location.href.match('https://www.mturk.com/mturk/dashboard') && localStorage.getItem('hitdb_settings_bonusreload') !== 'enabled') {
		$("#generic_modal_dialog").dialog("close");
		setTimeout(prepare_projected, 1000, date, dateIndex);
	} else {
		dialogs.refreshPage();
	}
}

function getDatesBetween(currentDate, stopDate) {
	var dateObject	= {},
		i			= 0;
	while (currentDate.isAfter(moment(stopDate), 'day')) {
		dateObject[moment(currentDate).format('YYYY-MM-DD')] = i;
		currentDate.subtract(1, 'day');
		i++;
	}
	return dateObject;
}

function getLongtermStartFormatted() {
	return moment(localStorage.getItem('hitdb_goal_longterm_startdate') + 'T12:00:00').format('MMM D, YYYY');
}

function random_face() {
	var faces = ['?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?'];
	var n = Math.floor((Math.random() * faces.length));
	return '<span style="color: black; font-weight: normal;" title="Featured non-Amazonian script ' + ((n > 11) ? '... kitten?' : 'monkey') + '">' + faces[n] + '</span>';
}

function progress_bar(done, max, full, empty, c1, c2) {
	max = (max < 1) ? 1 : max;
	done = (done < 0) ? 0 : done;
	done = (done > max) ? max : done;

	var bar = '<span style="color: ' + (c1 || 'green') + '">';
	for (var i = 0; i < done; i++) {
		bar += full || '■';
	}
	bar += '</span><span style="color: ' + (c2 || 'black') + '">';
	for (var j = done; j < max; j++) {
		bar += empty || '⬜';
	}
	bar += '</span>';
	return bar;
}

// convert date to more practical form (MMDDYYYY => YYYY-MM-DD)
function convert_date(date) {
	if (date.indexOf('-') > 0) {
		return date;
	}
	var day   = date.substr(2,2);
	var month = date.substr(0,2);
	var year  = date.substr(4,4);
	return year + '-' + month + '-' + day;
}

// convert date from YYYY-MM-DD to MMDDYYYY if it isn't already
function convert_iso_date(date) {
	if (date.indexOf('-') < 0) {
		return date;
	}
	var t = date.split('-');
	return t[1] + t[2] + t[0];
}

// Format date for display YYYY-MM-DD, DD/MM/YYYY or DD.MM.YYYY
function display_date(date, format) {
	if (format === undefined || format === null) {
		return date;
	}

	var d = date.split('-');

	if (format == 'little') {
		return d[2] + '.' + d[1] + '.' + d[0];
	}
	if (format == 'middle') {
		return d[1] + '/' + d[2] + '/' + d[0];
	}
}

HITStorage.indexedDB.create();

// Backup plan
//HITStorage.update_date_format(true);

function updateProgressBar(progressbar, operation, value) {
	var hasWidget = null;
	if (progressbar) {
		hasWidget = progressbar.is(':ui-progressbar');
	}
	if (hasWidget) {
		var oldValue = progressbar.progressbar('value') || 0;
		var newValue = oldValue;
		if (operation == '+') {
			newValue = oldValue + value;
		} else if (operation == '*') {
			newValue = oldValue * value;
		} else if (operation == 'r*') {
			newValue = ((100 - oldValue) * value) + oldValue;
		} else if (operation == '=') {
			newValue = value;
		}
		newValue = Math.floor(newValue);

		if (operation != '=' && newValue > 99) {
			newValue = 99;
		}
		if (newValue < oldValue) {
			newValue = oldValue;
		}
		progressbar.progressbar("value", newValue);
	}
}

function toggle_hidden_projected() {
	return function() {
		if ($("#goal_row:hidden").length) {
			$("#projected_header_showhide").text('-');
			$("#projected_header_showhide").parent().removeAttr('colspan');
			$("#projected_header_showhide").parent().next().show();
			$("#goal_value_in_header").text('');
			$("#longterm_goal_value_in_header").text('');
			$("#goal_row").show();
			$("#longterm_row").show();
			$("#projected_header_row_text").html('&nbsp;Projected Earnings and Goals&nbsp;');
			localStorage.setItem('hitdb_settings_showhide_projected', 'show');
		} else {
			$("#projected_header_showhide").text('+');
			$("#projected_header_showhide").parent().next().hide();
			$("#projected_header_showhide").parent().attr({'colspan': '2'});
			$("#projected_header_row_text").html('&nbsp;Projected Earnings&nbsp;');
			if (localStorage.getItem('hitdb_goal_daily_target') !== null) {
				$("#goal_value_in_header").text('- Today: ' + $("#goal_value").text() + '/$' + parseFloat(localStorage.getItem('hitdb_goal_daily_target')).toFixed(2));
			} else {
				$("#goal_value_in_header").text('- Today: ' + $("#goal_value").text());
			}
			if (localStorage.getItem('hitdb_goal_longterm_target') !== null) {
				$("#longterm_goal_value_in_header").text(' - LT: ' + $("#longterm_goal_value").text() + '/$' + parseFloat(localStorage.getItem('hitdb_goal_longterm_target')).toFixed(2));
			}
			$("#goal_row").hide();
			$("#longterm_row").hide();
			localStorage.setItem('hitdb_settings_showhide_projected', 'hide');
		}
	};
}

function toggle_hidden_earningspending() {
	return function() {
		if ($("#pending_row:hidden").length) {
			$("#earnings_pending_header_text").parent().removeAttr('colspan');
			$("#earnings_pending_header_text").parent().next().show();
			$("#earnings_pending_header_text").html('&nbsp;Earnings Pending & Available');
			$("#earnings_pending_showhide").text('-');
			$("#pending_row").show();
			$("#available_earnings_row").show();
			$("#available_earnings_row").next().show();
			localStorage.setItem('hitdb_settings_showhide_earningspending', 'show');
		} else {
			$("#earnings_pending_header_text").parent().next().hide();
			$("#earnings_pending_header_text").parent().attr({'colspan': '2'});
			$("#earnings_pending_header_text").html('&nbsp;Pend. ' + $("#pending_earnings_value").text() + ' & Avail. ' + $("#transfer_earnings").text() + " (<a href='https://www.mturk.com/mturk/transferearnings' target='_blank'>Transfer</a>)");
			$("#earnings_pending_showhide").text('+');
			$("#pending_row").hide();
			$("#available_earnings_row").next().hide();
			$("#available_earnings_row").hide();
			localStorage.setItem('hitdb_settings_showhide_earningspending', 'hide');
		}
	};
}

function toggle_hidden_earningstodate() {
	return function() {
		var header_row;
		if ($("#earnings_to_date_showhide").text() == '+') {
			$("#earnings_to_date_showhide").text('-');
			header_row = $("#earnings_to_date_showhide").parent().parent().parent();
			header_row.children('tr').not(":eq(0)").show();
			$("#earnings_to_date_showhide").parent().removeAttr('colspan');
			$("#earnings_to_date_showhide").parent().next().show();
			localStorage.setItem('hitdb_settings_showhide_earningstodate', 'show');
		} else {
			$("#earnings_to_date_showhide").text('+');
			header_row = $("#earnings_to_date_showhide").parent().parent().parent();
			header_row.children('tr').not(":eq(0)").hide();
			$("#earnings_to_date_showhide").parent().attr({'colspan': '2'});
			$("#earnings_to_date_showhide").parent().next().hide();
			localStorage.setItem('hitdb_settings_showhide_earningstodate', 'hide');
		}
	};
}

function toggle_hidden_extraheader() {
	return function() {
		if ($("#extra_header_row:hidden").length) {
			$("#extra_header_showhide").text('-');
			$("#extra_header_row").show();
			localStorage.setItem('hitdb_settings_showhide_extraheader', 'show');
		} else {
			$("#extra_header_showhide").text('+');
			$("#extra_header_row").hide();
			localStorage.setItem('hitdb_settings_showhide_extraheader', 'hide');
		}
	};
}

function specific_bonus_dialog(thisDate, today, index) {
	return function() {
		var set_specific_bonus_title = 'Set Bonus For ';
		var set_specific_bonus_instructions = 'Enter any bonuses and other external payments to include in projected earnings.<br /><br />The below form has a basic calculator function. Enter the amount to add or subtract in the second box, then click the + or - button to add or subtract that amount from your Current Amount. <span style="font-style: italic;">You must still click Save to save your changes!</span><br /><br />For <span id="replacedate"></span>, you currently have $<span id="replacebonus"></span>.<br /><br /><input type="text" max="8" width="8" name="hitdb_bonus_calc" id="hitdb_bonus_calc" /> <button id="plus" class="plusMinus standard-button" style="height: 18px !important;" title="Enter an amount to the left, then click this button to add it to your bonus.">+</button> <button id="minus" class="plusMinus standard-button" style="height: 18px !important;" title="Enter an amount to the left, then click this button to subtract it from your bonus.">-</button><br /><input type="text" max="8" width="8" name="hitdb_bonus_new" id="hitdb_bonus_new" value="' + $("#bonus_row" + index).text() + '" autofocus /> Amount to save';

		$("#generic_modal_dialog").on('dialogopen', function(event, ui){ setTimeout(function(){ $('#hitdb_bonus_calc').focus(); }, 10); });

		$("#generic_modal_dialog").dialog("open");
		$("#generic_modal_dialog_instructions").html(set_specific_bonus_instructions);
		$(".plusMinus").button();
		$("#plus").click(function() {
			$("#hitdb_bonus_new").val(((+$("#hitdb_bonus_new").val()) + (+$("#hitdb_bonus_calc").val())).toFixed(2));
		});
		$("#minus").click(function() {
			$("#hitdb_bonus_new").val(((+$("#hitdb_bonus_new").val()) - (+$("#hitdb_bonus_calc").val())).toFixed(2));
		});
		$("#replacedate").text(moment(thisDate).format('MMM D, YYYY'));
		$("#replacebonus").text($("#bonus_row" + index).text());
		$("#hitdb_bonus_new").text($("#bonus_row" + index).text());
		$("#generic_modal_dialog")
			.dialog("option", "title", set_specific_bonus_title + moment(today).format('MMM D, YYYY'));
		$("#generic_modal_dialog")
			.dialog("option", "buttons", {
				'Save': function() {
					if ($("#hitdb_bonus_new").val().match(/[0-9]{1,7}\.?[0-9]{0,2}/)) {
						set_target_func(thisDate, 'bonus|' + index, $("#hitdb_bonus_new").val(), today);
					} else {
						$("#generic_modal_dialog_error").html("You did not enter a number in the correct format. Please ensure you enter a number in the format 1.23 with no dollar sign.<br /><br />");
					}
				},
				'Cancel': function() {
					$("#generic_modal_dialog").dialog("close");
				}
			});
		$("#hitdb_bonus_new").keydown(function(event) {
			if (event.which == 13) {
				if ($("#hitdb_bonus_new").val() !== '') {
					event.preventDefault();
					$("#eneric_modal_dialog_error").html("You did not enter anything. Please enter a number, or press the Cancel button or Escape key to continue.");
				} else {
					event.preventDefault();
					$("span.ui-button-text:contains('Save')").parent().trigger('click');
				}
			}
		});
	};
}

function set_target_dialog(type, today, date) {
	return function() {
		if (type == 'longterm' && localStorage.getItem('hitdb_goal_longterm_startdate') === null) {
			x = dialogs.startLongtermGoal(today, date, true);
			x();
		} else {
		
			if (type == 'daily') {
				instructions = 'Set your goal amount for today. Do not add a dollar sign.<br /><br /><input type="text" max="8" width="8" name="hitdb_daily_target_new" id="hitdb_daily_target_new" autofocus />';
				title = 'Set Daily Goal';
			} else {
				instructions = 'Set your longterm goal amount.<br /><br />Note that setting this does not change the period for which earnings are counted against your goal. If you want to start a new goal today, click the Start Longterm Goal item in the Actions menu across from Longterm (LT) Goal Progress.<br /><br /><input type="text" max="8" width="8" name="hitdb_longterm_target_new" id="hitdb_longterm_target_new" autofocus />';
				title = 'Set Longterm Goal';
			}

			$("#generic_modal_dialog").dialog("open");
			$("#generic_modal_dialog_instructions").html(instructions);
			$("#hitdb_" + type + "_target_new").val(localStorage.getItem("hitdb_goal_" + type + "_target")).focus();
			$("#generic_modal_dialog").dialog("option", "title", title);
			$("#generic_modal_dialog")
				.dialog("option", "buttons", {
					'Save': function() {
						if ($("#hitdb_" + type + "_target_new").val().match(/[0-9]{1,7}\.?[0-9]{0,2}/)) {
							set_target_func(date, type, $("#hitdb_" + type + "_target_new").val(), today);
							$("#generic_modal_dialog").dialog("close");
						} else {
							$("#generic_modal_dialog_error")
								.html('You did you enter a number in the correct format. Please ensure you enter a number in the format 1.23 with no dollar sign.<br /><br />');
						}
					},
					'Cancel': function() {
						$("#generic_modal_dialog").dialog("close");
					}
				});
		}
	};
}

function set_cumulative_goal_tracking() {
	return function() {
		var cumulative_goal_tracking_title = 'Make the daily goal cumulative?';
		var cumulative_goal_tracking_instructions = 'Each day your projected earnings are compared against your goal and shown on the screen.<br /><br />If you don\'t reach your goal for a day, do you want the unearned amount to be added into the next day\'s goal?<br /><br />For example, if your goal today is $50.00 and you earn $25.00, do you want the daily goal to show as $75.00 tomorrow? Note that this will not change your stored goal amount, simply the display on the screen.';

		$("#generic_modal_dialog").dialog("open");
		$("#generic_modal_dialog_instructions").html(cumulative_goal_tracking_instructions);
		$("#generic_modal_dialog").dialog("option", "title", cumulative_goal_tracking_title);
		$("#generic_modal_dialog")
			.dialog("option", "buttons", {
				'Yes': function() {
					dialogs.utils.toggleStoredSetting('hitdb_goal_settings_ltadd', 'no', 'yes', true);
				},
				'No': function() {
					dialogs.utils.toggleStoredSetting('hitdb_goal_settings_ltadd', 'yes', 'no', true);
				}
			});
	};
}

function set_amount_remaining_display() {
	return function() {
		var longterm_amount_remaining_title = 'Display Amount Remaining or Amount Earned';
		var longterm_amount_remaining_instructions = 'For your goals, you can choose between showing the amount earned so far, or the amount remaining to meet your goal. Click the appropriate button below to make your selection.<br /><br />For example, if you set a goal of $500 and have earned $200, selecting Show Amount Remaining will show your progress as <span style="color: red; white-space:nowrap;">-$300.00</span>. Selecting Show Amount Earned would show $200.00. In either case, when you exceed your goal, it will be displayed in the format <span style="color: green;">+$10.00</span>.';

		$("#generic_modal_dialog").dialog("open");
		$("#generic_modal_dialog_instructions").html(longterm_amount_remaining_instructions);
		$("#generic_modal_dialog").dialog("option", "title", longterm_amount_remaining_title);
		$("#generic_modal_dialog")
			.dialog("option", "buttons", {
				"Show Remaining": function() {
					dialogs.utils.toggleStoredSetting('hitdb_goal_settings_displaystyle', 'earned', 'remaining', true);
				},
				"Show Earned": function() {
					dialogs.utils.toggleStoredSetting('hitdb_goal_settings_displaystyle', 'remaining', 'earned', true);
				}
			});
	};
}

function set_disable_hitdb_statuspage() {
	return function() {
		var longterm_amount_remaining_title = 'Disable HIT Database on Status Page';
		var longterm_amount_remaining_instructions = 'Due to the amount of data that needs to be gathered for the proper display, having HIT Database enabled on the <a href="https://www.mturk.com/mturk/status" target="_blank">Status page</a> may cause it to not load (particularly in Firefox, and particularly if you complete in excess of a few hundred HITs a day).<br /><br />Click the appropriate button below to determine whether HIT Database will load on this screen.';

		$("#generic_modal_dialog").dialog("open");
		$("#generic_modal_dialog_instructions").html(longterm_amount_remaining_instructions);
		$("#generic_modal_dialog").dialog("option", "title", longterm_amount_remaining_title);
		$("#generic_modal_dialog")
			.dialog("option", "buttons", {
				"Enable": function() {
					dialogs.utils.toggleStoredSetting('hitdb_settings_statuspage', 'disabled', 'enabled');
				},
				"Disable": function() {
					dialogs.utils.toggleStoredSetting('hitdb_settings_statuspage', 'enabled', 'disabled');
				}
			});
	};
}

function set_reload_after_bonus() {
	return function() {
		var longterm_amount_remaining_title = 'Reload Dashboard After Adding Bonus';
		var longterm_amount_remaining_instructions = 'For a limited number of users, the Goals and Bonus amount might not update correctly on the dashboard after entering a bonus amount.<br /></br />If this is happening to you, you can enable this setting to force a page refresh after entering bonuses, which resolves the issue.<br /><br />If this is not happening to you, it is suggested you leave this setting disabled, as there\'s no need for it to be on.';

		$("#generic_modal_dialog").dialog("open");
		$("#generic_modal_dialog_instructions").html(longterm_amount_remaining_instructions);
		$("#generic_modal_dialog").dialog("option", "title", longterm_amount_remaining_title);
		$("#generic_modal_dialog")
			.dialog("option", "buttons", {
				"Enable": function() {
					dialogs.utils.toggleStoredSetting('hitdb_settings_bonusreload', 'disabled', 'enabled');
				},
				"Disable": function() {
					dialogs.utils.toggleStoredSetting('hitdb_settings_bonusreload', 'enabled', 'disabled');
				}
			});
	};
}

dialogs.startLongtermGoal = function(today, firstDate, extra) {
	return function() {
		var set_longterm_goal_start_title = 'Start New Longterm Goal';
		var set_longterm_goal_start_instructions = '';
		if (extra === true) {
			set_longterm_goal_start_instructions += '<span style="color: red;">You attempted to set a longterm goal target amount without starting a longterm goal. Please complete the below form, which will then take you to enter a longterm goal target amount.</span><br /><br />';
		}
		set_longterm_goal_start_instructions += 'Are you sure you want to start a new longterm goal? (All earnings from the date you enter below through today will be included in your longterm earnings immediately.)<br /><br />After clicking Save, you will also be prompted to confirm or change your longterm goal amount.<br /><br />Enter the start date for your longterm goal below. It MUST be in the format YYYY-MM-DD. Your current longterm goal start date (if any) is listed in the box.<br /><br /><input type="text" max="8" width="8" name="hitdb_longterm_target_new" id="hitdb_longterm_startdate_new" autofocus />';

		$("#generic_modal_dialog").dialog("open");
		$("#generic_modal_dialog_instructions").html(set_longterm_goal_start_instructions);
		$("#hitdb_longterm_target_new").val(localStorage.getItem("hitdb_goal_longterm_startdate")).focus();

		$("#hitdb_longterm_startdate_new").datepicker().next('button').button({
		    icons: {
		        primary: 'ui-icon-calendar'
		    }, text:false
		}).addClass('height18');

		$("#generic_modal_dialog").dialog("option", "title", set_longterm_goal_start_title);
		$("#generic_modal_dialog")
			.dialog("option", "buttons", {
				'Save': function() {
					if ($("#hitdb_longterm_startdate_new").val().match(/\d{4}-\d{2}-\d{2}/) && $("#hitdb_longterm_startdate_new").val().length == 10) {
						$("#hitdb_longterm_startdate_new").datepicker("destroy");
						if ($("#hitdb_longterm_startdate_new").val() == localStorage.getItem('hitdb_goal_longterm_startdate') && localStorage.getItem('hitdb_goal_longterm_target') !== null) {
							$("#generic_modal_dialog").dialog("close");
						} else {
							localStorage.setItem('hitdb_goal_longterm_startdate', $("#hitdb_longterm_startdate_new").val());
							var myDate = getLongtermStartFormatted();
							$("#longterm_start").html('(since ' + myDate + ')');
							$("#generic_modal_dialog_error").text('');
							$("#generic_modal_dialog").dialog("close");
							x = set_target_dialog('longterm', today, firstDate);
							x();
						}
					} else {
						$("#generic_modal_dialog_error").html('You did you enter a date in the correct format. Please ensure you enter a date in the format YYYY-MM-DD.<br /><br />');
					}
				},
				'Cancel': function() {
					$("#generic_modal_dialog").dialog("close");
				}
			});
	};
};

function dialog_requester_note(requesterId, requesterName, labelId) {
	return function() {
		var title = 'Note for Requester "' + requesterName + '"';
		var instructions = 'Enter the note that you wish to show next to each of this requester\'s HITs. If you include an exclamation mark in your text, it will be colored red; otherwise, it will be black.<br /><br /><input type="hidden" name="requester_id" id="requester_id" value="' + requesterId + '" /><input type="text" name="requester_note" id="requester_note" max="200" value="' + $("#notelabel" + labelId).text() + '" placeholder="Enter a note..." style="width: 250px" />';

		$("#generic_modal_dialog").dialog("open");
		$("#generic_modal_dialog_instructions").html(instructions);
		$("#generic_modal_dialog").dialog("option", "title", title);
		$("#generic_modal_dialog")
			.dialog("option", "buttons", {
				"Save": function() {
					if ($("#requester_note").val() === '') {
						$("#generic_modal_dialog_error").html('').html('You did not enter a note. If you want to remove an existing note, click Remove Note. If you want to proceed without adding a note, please click Cancel.<br /><br />');
					} else {
						$("#generic_modal_dialog_error").html('');
						HITStorage.indexedDB.addNote($("#requester_id").val(), $("#requester_note").val());
						$("#notelabel" + labelId).text($("#requester_note").val()).css({'border': '1px dotted', 'color': ($("#requester_note").val().indexOf("!") >= 0 ? 'red' : 'black')});
					}
					$("#generic_modal_dialog").dialog("close");
				},
				"Remove Note": function() {
					HITStorage.indexedDB.addNote($("#requester_id").val(), '');
					$("#notelabel" + labelId).text('').css({'border': 'none'});
					$("#generic_modal_dialog").dialog("close");
				},
				"Cancel": function() {
					$("#generic_modal_dialog").dialog("close");
				}
			});
	};
}

function dialog_requester_block(requesterId, requesterName, hitTitle) {
	return function() {
		var title = 'Block HITs from Requester "' + requesterName + '"';
		var instructions = "You can 'block' all HITs from a particular requester, or just those matching both a requester and particular HIT title. Due to the way Mechanical Turk functions, this 'block' does not actually remove the HITs from the page, it simply collapses them to a single row and puts them at the bottom of a HIT search results or HITs available page.<br /><br />To block <i>all</i> HITs from a particular requester, click Block All.<br /><br />To block only specific HITs, (optionally) edit the regular expression in the box, and click Block Title. (Note that this still matches against the requester ID, so a HIT posted by another requester with the same HIT title will not be blocked.)<br /><br /><input type='hidden' name='requester_id' id='requester_id' value='" + requesterId + "' /><input type='text' name='hit_title' id='hit_title' value='^" + hitTitle.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1") + "$' style='width: 350px' />";

		$("#generic_modal_dialog").dialog("open");
		$("#generic_modal_dialog_instructions").html(instructions);
		$("#generic_modal_dialog").dialog("option", "title", title);
		$("#generic_modal_dialog")
			.dialog("option", "buttons", {
				"Block Title": function() {
					re = new RegExp($("#hit_title").val());
					if ($("#hit_title").val() === '') {
						$("#generic_modal_dialog_error").html('').html('You did not enter a HIT title. To block all HITs by this requester, click Block All.<br /><br />');
					} else if (!re.test(hitTitle) && !$("#block_second").val()) {
						$("#generic_modal_dialog_error").html('').html('Your regular expression does not the HIT title. If you wish to proceed anyway, click Block Title again.<br /><br />');
						$("#requester_id").before(
							$("<input></input>")
								.prop('type', 'hidden')
								.attr({'name': 'block_second', 'id': 'block_second'})
								.val('1')
						);
					} else {
						$("#generic_modal_dialog_error").html('');
						HITStorage.indexedDB.addBlock(requesterId, $("#hit_title").val());
						dialogs.refreshPage();
					}
				},
				"Block All": function() {
					HITStorage.indexedDB.addBlock(requesterId, '');
					dialogs.refreshPage();
				},
				"Cancel": function() {
					$("#generic_modal_dialog").dialog("close");
				}
			});
	};
}

function dialog_requester_unblock(requesterId, requesterName, hitTitle, blockType) {
	return function() {
		var title = 'Remove Block for Requester "' + requesterName + '"';
		var instructions = (blockType == 'all' ? "This HIT was hidden because the requester is blocked.<br /><br />" : "This HIT was hidden because it matched a HIT title block.<br/ ><br />Clicking Remove HIT Block will remove all blocks that match this requester ID and HIT title combination.") + " If you want to remove all blocks for this requester, click Remove Requester Blocks.";

		gmd = $("#generic_modal_dialog");
		gmd.dialog("open");
		$("#generic_modal_dialog_instructions").html(instructions);
		gmd.dialog("option", "title", title);
		gmd.dialog("option", "buttons", [{
					text: "Remove HIT Block",
					click: function() {
						HITStorage.indexedDB.removeBlocks(requesterId, hitTitle);
					},
					disabled: (blockType == 'all' ? true : false)
				},
				{
					text: "Remove Requester Blocks",
					click: function() {
						HITStorage.indexedDB.removeBlocks(requesterId, hitTitle, true);
					}
				},
				{
					text: "Cancel",
					click: function() {
						$("#generic_modal_dialog").dialog("close");
					}
				}
			]);
	};
}

dialogs.refreshPage = function(seconds) {
	seconds = seconds || 2;
	$("#generic_modal_dialog").dialog('option', 'buttons', {});
	$("#generic_modal_dialog").dialog('option', 'title', 'Please wait');
	$("#generic_modal_dialog").dialog('option', 'closeOnEscape', false);
	$("#generic_modal_dialog_instructions").html('Please wait - the page will refresh in ' + seconds + ' seconds to reflect your change.');
	setTimeout(function() {location.reload();}, seconds * 1000);
};

dialogs.utils.toggleStoredSetting = function(setting, value_a, value_b, reloadPage) {
	reloadPage = reloadPage || false;
	if (localStorage.getItem(setting) === value_a || localStorage.getItem(setting) === null) {
		localStorage.setItem(setting, value_b);
		if (reloadPage === true) {
			dialogs.refreshPage();
		}
	} else {
		$("#generic_modal_dialog").dialog("close");
	}
}

dialogs.progress = function(title) {
	var progresslabel = $("#progressbar_label");
	progressbar = $("#progressbar");
	progressbar.progressbar({
		value: 5,
		change: function() {
			progresslabel.text(progressbar.progressbar("value") + "%");
		},
		complete: function() {
			progresslabel.text("Complete!");
			setTimeout(function() {
				$("#progress_dialog").dialog("close");
			}, 1000);
		}
	});
	$("#progress_dialog").dialog({
		resizable: false,
		height: 150,
		width: 400,
		modal: true,
		autoOpen: true,
		closeOnEscape: false,
		dialogClass: "no-close",
		title: title,
		position: {my: 'top+10', at: 'top+10'},
		beforeClose: function(event, ui) {
			if ($("#progress_dialog").find("#status_label").length) {
				$("#label_div").append($("#status_label"));
			}
		}
	});
}

dialogs.error = function(title, text, input) {
	gmd = $("#generic_modal_dialog");
	if (!gmd.dialog('isOpen')) {
		gmd.dialog('open');
		gmd.dialog('option', 'buttons', {
			'OK': function() {
				gmd.dialog('close');
			}
		});
		gmd.dialog("option", "title", title);
	}
	$("#generic_modal_dialog_error").html('<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>' + text + '<br /><br />');
	if (input) {
		gmd.on('dialogclose', function() { input.focus(); });
	}
}

var today = null;
var e = $("a:contains('Today')").last();
if (e.length && e.text().trim() == 'Today') {
	today = convert_date(e.attr('href').slice(-8));
}

var firstDate = null;
var f = $("a[href*=statusdetail]").first();
if (f.length) {
	firstDate = convert_date(f.attr('href').slice(-8));
}

if (document.location.href.match('https://www.mturk.com/hitdb')) {
	var style = ":focus {outline:none;}\
::-moz-focus-inner {border:0;}\
body, td {\
	font-family: Helvetica, Arial, Verdana;\
	-font-size: 1em;\
}\
.tablesorter-filter.disabled {\
	display: none;\
}\
.hideme {\
	background-color: #F6F6F6 !important;\
}\
.pointer {\
	cursor: pointer !important;\
}\
.left {\
	text-align: left !important;\
}\
.right {\
	text-align: right !important;\
}\
table.tablesorter {\
	margin: 0px auto 0px auto;\
	width: 90%;\
}\
table.tablesorter tfoot tr td {\
	padding: 4px;\
	background: #F6F6F6 url('https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/flick/images/ui-bg_highlight-soft_100_f6f6f6_1x100.png') repeat-x scroll 50% 50%;\
	border: 1px solid #DDD;\
	font-weight: bold;\
	color: #FF0084;\
}\
.standard-button {\
	height: 16px !important;\
	font-size: 8px !important;\
	padding: 0px !important;\
	width: 24px !important;\
}\
.font12 {\
	font-size: 12px;\
}\
.pager1-left {\
	float: left;\
	margin: 0;\
	width: 33%;\
}\
#head_pager form, #foot_pager form {\
	margin-bottom: 0px;\
}\
 - end";
	$("head").html('');
	$("head").append(
		$("<style type='text/css'></style>")
			.text(style)
	);
	$("head").append(
		$("<link></link>")
			.attr('rel', 'stylesheet')
			.attr('href', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/flick/jquery-ui.css')
			.prop('type', 'text/css'),
		$("<link></link>")
			.attr('rel', 'stylesheet')
			.attr('href', 'https://cdnjs.cloudflare.com/ajax/libs/qtip2/2.2.1/jquery.qtip.css')
			.prop('type', 'text/css'),
		$("<link></link>")
			.attr('rel', 'stylesheet')
			.attr('href', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.2/css/theme.jui.min.css')
			.prop('type', 'text/css'),
		$("<link></link>")
			.attr('rel', 'stylesheet')
			.attr('href', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.2/css/jquery.tablesorter.pager.min.css')
			.prop('type', 'text/css')
	);
} else {
	var style = '<style type="text/css">\
.ui-menu .ui-menu-icon { right: 0px; }\
.no-close .ui-dialog-titlebar-close { display: none; }\
#progressbar { width: 80%; margin: 0 auto; position: relative; }\
.progress-label { position: absolute; text-align: center; width: 95%; top: 5px; left: 12px; font-weight: bold; text-shadow: 1px 1px 0 #fff; }\
.ui-front { z-index: 1000 !important; }\
.ui-dialog { z-index: 1001 !important; }\
.ui-selectmenu-button { font-size: 87% !important; vertical-align: middle; }\
h3 { text-align: left; }\
:focus {outline:none;}\
::-moz-focus-inner {border:0;}\
.ui-selectmenu-menu>.ui-menu>.ui-menu-item { font-size: 87% !important; }\
.ui-selectmenu-menu>.ui-menu>.ui-state-focus { font-weight: normal !important; }\
.pointer { cursor: pointer !important; }\
.height18 { height: 18px; }\
.ui-dialog { position: fixed !important; }\
</style>';
	$("head").append(style);
	$("head").append(
		$("<link></link>")
			.attr('rel', 'stylesheet')
			.attr('href', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/flick/jquery-ui.css')
			.prop('type', 'text/css')
	);
}

if (document.location.href.match('https://www.mturk.com/mturk/dashboard')) {

	var label = $("<label></label>")
		.attr({'id': 'status_label'})
		.css({'margin-left': 'auto', 'margin-right': 'auto', 'text-align': 'center'})
		.text('Search powered by non-Amazonian script monkeys');

	$("head").append(
		$("<link></link>")
			.attr('rel', 'stylesheet')
			.attr('href', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/flick/jquery-ui.css')
			.prop('type', 'text/css')
	);

	$("body").children().first().before(
		$("<div></div>")
			.attr('id', 'progress_dialog')
			.append(
				$("<div></div>")
					.attr('id', 'progressbar')
					.append(
						$("<div></div>")
							.attr('id', 'progressbar_label')
							.addClass('progress-label')
							.text('Loading...')
					),
				label
			)
	);

	dialogs.progress('Loading HIT Database Goals Edition v' + localStorage.getItem('hitdb_version'));

	if (localStorage.getItem('hitdb_migrate') != 110) {
		setTimeout(function() {
			HITStorage.updateStatusLabel('There are some database changes necessary to migrate you to v1.10.0. Please wait while these changes are made.');
			HITStorage.indexedDB.migrateStats_part1();
			migrateIntervalId = setInterval(function() {
				if (localStorage.getItem('hitdb_migrate') == 110) {
					clearInterval(migrateIntervalId);
					loadDashboard();
				}
			}, 1000);
		}, 500);
	} else {
		setTimeout(function() { loadDashboard(); }, 500);
	}

	loadDashboard = function() {
		var footer = $("table:contains('HIT Totals')");
		if (footer === null) {
			return;
		}

		var extra_table = $("<table></table>")
			.attr({'width': '760', 'cellspacing': '0', 'cellpadding': '0', 'align': 'center'});

		var row1 = $("<tr></tr>")
			.css({'height': '25px'});
		var row2 = $("<tr></tr>");

		var td0 = $("<td></td>").attr({'width': '10'}).css({'background-color': '#7fb448', 'padding-left': '10px'});
		var td1 = $("<td></td>")
			.css({'background-color': '#7fb448'})
			.addClass('white_text_14_bold')
			.attr({'width': '100%'})
			.html('HIT Database Goals Edition ' + random_face() + ' ');
		var td2 = $("<td></td>").attr({'width': '10', 'align': 'right'}).css({'background-color': '#7fb448'});

		var content_td = $("<td></td>")
			.attr({'colspan': '3'})
			.addClass('container-content');
		var whatsthis = $("<a></a>")
			.attr({'href': 'https://greasyfork.org/en/scripts/11374-mturk-hit-database-goals-edition'})
			.addClass('whatis')
			.text('(More Information)');
		var tutorial = $("<a></a>")
			.attr({'href': '#'})
			.click(function(event) { event.preventDefault(); newUserOrientation(1); })
			.addClass('whatis')
			.text('(Tutorial)');

		var my_bar = $("<div></div>")
			.attr({'id': 'accordion'})
			.css({'margin-left': 'auto', 'margin-right': 'auto', 'text-align': 'center'});
		var button_search = $("<button></button>")
			.attr({'id': 'button_search', 'title': "Search from local HIT database\nYou can set time limits and export as CSV-file"})
			.text('Search');
		var label2 = $("<label></label>")
			.text(' HITs matching:');
		var search_term = $("<input></input>")
			.attr({'id': 'search_term'});
		var csv_label = $("<label></label>")
			.attr({'title': 'Export results in a comma-separated value (CSV) file', 'for': 'export_csv'})
			.text('Export CSV')
			.css({'vertical-align': 'middle', 'margin-left': '50px'});
		var csv = $("<input></input>")
			.attr({'title': 'Export results in a comma-separated value (CSV) file', 'type': 'checkbox', 'id': 'export_csv'})
			.css({'vertical-align': 'middle'});

		var button_overviewPending = $("<button></button>")
			.attr({'id': 'button_overviewPending', 'title': "Summary of all pending HITs"})
			.text('Pending Overview')
			.css({'margin': '0px 5px 5px 5px'});
		var button_overviewDaily = $("<button></button>")
			.attr({'id': 'button_overviewDaily', 'title': "Summary of each day you have worked on MTurk"})
			.text('Daily Overview')
			.css({'margin': '0px 5px 5px 5px'});
		var button_overviewRequester = $("<button></button>")
			.attr({'id': 'button_overviewRequester', 'title': "Summary of all requesters you have worked for"})
			.text('Requester Overview')
			.css({'margin': '0px 5px 5px 5px'});
		var overview_csv_label = $("<label></label>")
			.attr({'title': 'Export results in a comma-separated value (CSV) file', 'for': 'overview_export_csv'})
			.text('Export CSV')
			.css({'vertical-align': 'middle', 'margin-left': '50px'});
		var overview_csv = $("<input></input>")
			.attr({'title': 'Export results in a comma-separated value (CSV) file', 'type': 'checkbox', 'id': 'overview_export_csv'})
			.css({'vertical-align': 'middle'});

		var button_delete = $("<button></button>")
			.attr({'id': 'button_delete', 'title': 'Delete local database!'})
			.text('Delete Database')
			.css({'color': 'red', 'margin': '5px'});
		var button_update = $("<button></button>")
			.attr({'id': 'button_update', 'title': "Fetch status pages and copy HITs to local database.\nFirst time may take several minutes!"})
			.text('Update Database')
			.css({'color': 'green', 'margin': '5px'});
		var button_importHits = $("<button></button>")
			.attr({'id': 'button_importHits', 'title': 'Import HIT data from backup CSV file'})
			.text('Import HITs')
			.css({'margin': '5px'});
		var button_importBonus = $("<button></button>")
			.attr({'id': 'button_importBonus', 'title': 'Import bonuses from backup CSV file'})
			.text('Import Bonuses')
			.css({'margin': '5px'});
		var button_importSettings = $("<button></button>")
			.attr({'id': 'button_importSettings', 'title': 'Import settings from backup CSV file'})
			.text('Import Settings')
			.css({'margin': '5px'});
		var button_exportHits = $("<button></button>")
			.attr({'id': 'button_exportHits', 'title': 'Export HIT data to a CSV file for backup'})
			.text('Export HITs')
			.css({'margin': '5px'});
		var button_exportBonus = $("<button></button>")
			.attr({'id': 'button_exportBonus', 'title': 'Export bonuses to a CSV file for backup'})
			.text('Export Bonuses')
			.css({'margin': '5px'});
		var button_exportSettings = $("<button></button>")
			.attr({'id': 'button_exportSettings', 'title': 'Export settings to a file for backup'})
			.text('Export Settings')
			.css({'margin': '5px'});

		var from_input = $("<input></input>")
			.attr({'id': 'from_date', 'maxlength': '10', 'size': '10', 'title': 'Date format YYYY-MM-DD\nThis field is optional'});
		var to_input = $("<input></input>")
			.attr({'id': 'to_date', 'maxlength': '10', 'size': '10', 'title': 'Date format YYYY-MM-DD\nThis field is optional'});
		var date_label1 = $("<label></label>").text(' from date ');
		var date_label2 = $("<label></label>").text(' to ');

		var overview_from_input = $("<input></input>")
			.attr({'id': 'overview_from_date', 'maxlength': '10', 'size': '10', 'title': 'Date format YYYY-MM-DD\nThis field is optional'});
		var overview_to_input = $("<input></input>")
			.attr({'id': 'overview_to_date', 'maxlength': '10', 'size': '10', 'title': 'Date format YYYY-MM-DD\nThis field is optional'});
		var overview_date_label1 = $("<label></label>").text('From date ');
		var overview_date_label2 = $("<label></label>").text(' to ');

		var donut_select = $("<select></select>").attr('id', 'donut_select').append(
			$("<option></option>")
				.val('---')
				.text('No Donut Chart'),
			$("<option></option>")
				.val('HITS')
				.text('Donut Chart HITs'),
			$("<option></option>")
				.val('REWARDS')
				.text('Donut Chart Rewards')
		);

		var status_select = $("<select></select>").attr('id', 'status_select').append(
			$("<option></option>")
				.val('---')
				.text('(HIT Status) All'),
			$("<option></option>")
				.val('Pending Approval')
				.text('Pending Approval')
				.css('color', 'orange'),
			$("<option></option>")
				.val('Rejected')
				.text('Rejected')
				.css('color', 'red'),
			$("<option></option>")
				.val('Approved')
				.text('Approved - Pending Payment')
				.css('color', 'green'),
			$("<option></option>")
				.val('Paid')
				.text('Paid')
				.css('color', 'green'),
			$("<option></option>")
				.val('Paid|Approved')
				.text('Paid and Approved')
				.css('color', 'green')
		);

		var donut = $("<div></div>").attr('id', 'container').css('display', 'none');

		extra_table.append(
			row1.append(
				td0,
				td1.append(
					tutorial,
					document.createTextNode(' '),
					whatsthis
				),
				td2
			),
			row2.append(
				content_td.append(
					my_bar.append(
						$("<h3></h3>").append(
							$("<a></a>")
								.attr('href', '#')
								.text('Overviews')
						),
						$("<div></div>").css({'line-height': '34px'}).append(
							overview_date_label1,
							overview_from_input,
							overview_date_label2,
							overview_to_input,
							overview_csv_label,
							overview_csv,
							$("<br />"),
							button_overviewPending,
							button_overviewRequester,
							button_overviewDaily
						),
						$("<h3></h3>").append(
							$("<a></a>")
								.attr('href', '#')
								.text('Search')
						),
						$("<div></div>").append(
							label2,
							search_term,
							date_label1,
							from_input,
							date_label2,
							to_input,
							csv_label,
							csv,
							$("<br />"),
							donut_select,
							status_select,
							button_search
						),
						$("<h3></h3>").append(
							$("<a></a>")
								.attr('href', '#')
								.text('Maintenance')
						),
						$("<div></div>").append(
							button_delete,
							button_update
						),
						$("<h3></h3>").append(
							$("<a></a>")
								.attr('href', '#')
								.text('Import/Export')
						),
						$("<div></div>").append(
							button_importHits,
							button_importBonus,
							button_importSettings,
							$("<br />"),
							button_exportHits,
							button_exportBonus,
							button_exportSettings
						)
					),
					$("<br />"),
					$("<div></div>").attr('id', 'label_div')
				)
			)
		);
		footer.after(extra_table, donut);

		$("div.tooltip").each(function() {
			$(this).remove();
		});

		$("body").append(
			$("<div></div>")
				.attr('id', 'generic_modal_dialog')
				.append(
					$("<p></p>")
						.append("<span id='generic_modal_dialog_error' style='color: red;'></span>")
						.append("<span id='generic_modal_dialog_instructions'></span>")
				)
		);

		if ($("th[id='total_earnings.title_column_header.tooltip']").length) {
			var earnings_to_date = $("th[id='total_earnings.title_column_header.tooltip']").eq(0);
			var earnings_available = $("th[id='total_earnings.title_column_header.tooltip']").eq(1);
			var earnings_panda = earnings_available.parent().parent();
			earnings_to_date.attr('id', 'earnings_to_date_header').text('').append(
				$("<span><span>")
					.attr('id', 'earnings_to_date_showhide')
					.text('-')
					.css({'cursor': 'pointer'})
					.click(toggle_hidden_earningstodate()),
				$("<span></span>")
					.attr('id', 'earnings_to_date_text')
					.html("&nbsp;Earnings to Date")
			);
			earnings_to_date.parent().parent().parent().parent().css('padding-left', '0px');
			earnings_to_date.parent().css('border-left', '0px');
			earnings_available.attr('id', 'earnings_available_header').text('').append(
				$("<span></span>")
					.attr('id', 'earnings_pending_showhide')
					.text('-')
					.css({'cursor': 'pointer'})
					.click(toggle_hidden_earningspending()),
				$("<span></span>")
					.attr('id', 'earnings_pending_header_text')
					.html("&nbsp;Earnings Pending & Available")
			);
			earnings_available.parent().parent().parent().parent().css('padding-right', '0px');
			earnings_panda.children().eq(1)
				.attr('id', 'available_earnings_row')
				.before(
					$("<tr></tr>")
						.attr('id', 'pending_row')
						.attr('class', 'even')
						.append(
							$("<td></td>")
								.attr({'id': 'pending_earnings_header', 'class': 'metrics-table-first-value', 'title': ((localStorage.getItem('hitdb_updated_datetime') !== null) ? ('Upd: ' + localStorage.getItem('hitdb_updated_datetime')) : '')})
								.text('Earnings Pending Approval'),
							$("<td></td>")
								.attr({'id': 'pending_earnings_value', 'title': 'This value can be inaccurate if HITDB has not been updated recently'})
								.text('ಠ_ಠ')
						)
				);

			if (localStorage.getItem('hitdb_goal_longterm_startdate') !== null) {
				myDate = getLongtermStartFormatted();
				longterm_text = '(since ' + myDate + ')';
			} else {
				longterm_text = '(no goal started yet)';
			}
			var earnings_table = earnings_panda.parent().parent().parent().parent().parent().parent();
			earnings_table.append(
				$("<table></table>")
						.attr({'id': 'projected_table', 'class': 'metrics-table', 'width': '100%'})
						.append(
							$("<tr></tr>")
								.attr({'id': 'projected_header_row', 'class': 'metrics-table-header-row'})
								.append(
									$("<th></th>")
										.attr({'id': 'projected_header_row_left', 'class': 'metrics-table-first-header'})
										.append(
											$("<span></span>")
												.attr('id', 'projected_header_showhide')
												.text('-')
												.css({'cursor': 'pointer'})
												.click(toggle_hidden_projected()),
											$("<span></span>")
												.attr('id', 'projected_header_row_text')
												.html('&nbsp;Projected Earnings and Goals&nbsp;'),
											$("<span></span>")
												.attr('id', 'goal_value_in_header'),
											$("<span></span>")
												.attr('id', 'longterm_goal_value_in_header'),
											$("<ul></ul>")
												.attr('id', 'drop_settings')
												.css({'float': 'right', 'line-height': '0.8em'})
												.append(
													$("<li></li>")
														.css({'padding-top': '0px', 'padding-bottom': '0px'})
														.append(
															$("<span></span>")
																.text("Settings "),
															$("<ul></ul>")
																.css({'width': '200px'})
																.append(
																	$("<li></li>")
																		.text('Cumulative goal tracking')
																		.click(set_cumulative_goal_tracking()),
																	$("<li></li>")
																		.text('Show amount remaining?')
																		.click(set_amount_remaining_display()),
																	$("<li></li>")
																		.text('Disable Status Page Display')
																		.click(set_disable_hitdb_statuspage()),
																	$("<li></li>")
																		.text('Reload After Bonus')
																		.click(set_reload_after_bonus())
																)
														)
												)
										),
									$("<th></th>").attr('id', 'projected_header_row_value').text('Value')
								),
							$("<tr></tr>")
								.attr({'id': 'goal_row', 'class': 'even'})
								.append(
									$("<td></td>")
										.attr({'id': 'goal_header', 'class': 'metrics-table-first-value'})
										.append(
											$("<span></span>")
												.attr('id', 'goal_text')
												.html('Today\'s Projected Earnings and Goal Progress &nbsp;'),
											$("<ul></ul>")
												.attr({'id': 'drop_goal_today'})
												.css({'float': 'right', 'line-height': '0.8em'})
												.append(
													$("<li></li>")
														.css({'padding-top': '0px', 'padding-bottom': '0px'})
														.append(
															$("<span></span>")
																.text("Actions "),
															$("<ul></ul>")
																.css({'width': '200px'})
																.append(
																	$("<li></li>")
																		.text('Set Daily Target')
																		.click(set_target_dialog('daily', today, today)),
																	$("<li></li>")
																		.text('Adjust Today\'s Bonus Earnings')
																		.click(specific_bonus_dialog(today, today, 0))
																)
														)
												)
										),
										$("<td></td>")
											.attr('id', 'goal_value')
											.attr('title', 'This value can be inaccurate if HITDB has not been updated recently')
											.text('ಠ_ಠ')
								),
							$("<tr></tr>")
								.attr({'id': 'longterm_row', 'class': 'odd'})
								.append(
									$("<td></td>")
										.attr('id', 'longterm_goal_header')
										.attr('class', 'metrics-table-first-value')
										.append(
											$("<span></span>")
												.attr('id', 'longterm_text')
												.html("Longterm (LT) Goal Progress&nbsp;"),
											$("<span></span>")
												.attr('id', 'longterm_start')
												.html(longterm_text),
											$("<ul></ul>")
												.attr({'id': 'drop_goal_longterm'})
												.css({'float': 'right', 'line-height': '0.8em'})
												.append(
													$("<li></li>")
														.css({'padding-top': '0px', 'padding-bottom': '0px'})
														.append(
															$("<span></span>")
																.text("Actions "),
															$("<ul></ul>")
																.css({'width': '200px'})
																.append(
																	$("<li></li>")
																		.attr('id', 'set_longterm_target')
																		.text('Set Longterm Target')
																		.click(set_target_dialog('longterm', today, firstDate)),
																	$("<li></li>")
																		.text('Start Longterm Goal')
																		.click(dialogs.startLongtermGoal(today, firstDate))
																)
														)
												)
										),
										$("<td></td>")
											.attr('id', 'longterm_goal_value')
											.text('ಠ_ಠ')
								)
						)
			);

			$(function() {
				$("#drop_settings").menu();
				$("#drop_goal_today").menu();
				$("#drop_goal_longterm").menu();

				$("#status_select").selectmenu();
				$("#donut_select").selectmenu();

				$("#generic_modal_dialog").dialog({
					resizable: true,
					width: 400,
					modal: true,
					autoOpen: false,
					position: { my: 'top+10', at: 'top+10' }
				});

				$.datepicker.setDefaults({
					showButtonPanel: true,
					showOn: 'both',
					dateFormat: 'yy-mm-dd',
					onClose: function (dateString, datePicker) {
						HITStorage.validate_date($(this), true);
					}
				});

				$("#overview_from_date").datepicker().next('button').button({
				    icons: {
				        primary: 'ui-icon-calendar'
				    }, text:false
				}).addClass('height18');
				$("#overview_to_date").datepicker().next('button').button({
				    icons: {
				        primary: 'ui-icon-calendar'
				    }, text:false
				}).addClass('height18');
				$("#from_date").datepicker().next('button').button({
				    icons: {
				        primary: 'ui-icon-calendar'
				    }, text:false
				}).addClass('height18');
				$("#to_date").datepicker().next('button').button({
				    icons: {
				        primary: 'ui-icon-calendar'
				    }, text:false
				}).addClass('height18');

				$("#button_overviewPending").button().click(buttonFuncs.overview('Pending'));
				$("#button_overviewRequester").button().click(buttonFuncs.overview('Requester'));
				$("#button_overviewDaily").button().click(buttonFuncs.overview('Daily'));

				$("#button_search").button().click(buttonFuncs.search);

				$("#button_update").button().click(HITStorage.updateDatabase);
				$("#button_delete").button().click(buttonFuncs.delete());
				$("#button_importHits").button().click(buttonFuncs.import('HITs'));
				$("#button_importBonus").button().click(buttonFuncs.import('Bonuses'));
				$("#button_importSettings").button().click(buttonFuncs.import('Settings'));
				$("#button_exportHits").button().click({csv: true}, buttonFuncs.search);
				$("#button_exportBonus").button().click(buttonFuncs.exportBonuses);
				$("#button_exportSettings").button().click(buttonFuncs.exportSettings);

				$("#accordion").accordion();
			});

			updateProgressBar(progressbar, '+', 5);
			var hitStatusTable = $("td:contains('Your HIT Status')").closest('table');
			var interiorTable = hitStatusTable.find("table").eq(0);
			var start_end = {}, dateIndex = {};
			if (interiorTable) {
				var headerRow = interiorTable.children().eq(0).children().eq(0);
				headerRow.children().eq(0).text('').append(
					$("<span></span>")
						.attr('id', 'extra_header_showhide')
						.text('-')
						.addClass('pointer')
						.click(toggle_hidden_extraheader())
						.attr('title', 'Hides "HITs" and "Dollars" header'),
					$("<span></span>")
						.html("&nbsp;Date")
				);
				headerRow.before(
					$("<tr></tr>")
						.attr('class', 'metrics-table-header-row')
						.attr('id', 'extra_header_row')
						.append(
							$("<th></th>")
								.css({'backgroundColor': 'transparent', 'width': '10%'}),
							$("<th></th>")
								.attr('colspan', '4')
								.css({'textAlign': 'center', 'width': '35%'})
								.text('HITs'),
							$("<th></th>")
								.attr('colspan', '6')
								.css({'textAlign': 'center', 'width': '55%'})
								.text('Dollars')
						)
				);
				var total_cell = $("th[id='user_activities.earnings_column_header.tooltip']");
				total_cell.text("Total");
				total_cell.prev().text("Pend");
				total_cell.prev().prev().text("Reject");
				total_cell.prev().prev().prev().text("Approve");
				total_cell.prev().prev().prev().prev().text("Submit");
				$("th[id='user_activities.earnings_column_header.tooltip']").before(
					$("<th></th>")
						.text("Submit")
						.attr('title', 'This includes all HITs submitted on this date, including those that have since been rejected'),
					$("<th></th>")
						.text("Approve")
						.attr('title', 'This includes HITs that are Paid and HITs that are Approved-Pending Payment'),
					$("<th></th>")
						.text("Reject"),
					$("<th></th>")
						.text("Bonus")
						.attr('title', 'Any bonuses or external payments that you entered for this date'),
					$("<th></th>")
						.text("Pend")
				);

				interiorTable.children().eq(0).children().filter("tr.odd, tr.even").each(function(index, element) {
					var thisDate = $(this).children().first().children().first();
					thisDate = thisDate.attr('href').replace('/mturk/statusdetail?encodedDate=', '');
					var origDate = thisDate;
					thisDate = convert_date(thisDate);

					$(this).children().last().attr('id', 'total_cell' + index).before(
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.append("<span class='reward' id='submitted_row" + index + "'></span>"),
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.append("<span class='reward' id='paid_row" + index + "'></span>"),
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.append("<span class='reward' id='rejected_row" + index + "'></span>"),
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.append("<span class='reward' id='bonus_row" + index + "'></span>")
							.click(specific_bonus_dialog(thisDate, (today ? today : thisDate), index)),
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.append("<span class='reward' id='pending_row" + index + "'></span>")
					);

					$("#total_cell" + index)
						.text("$")
						.css('verticalAlign', 'top')
						.append(
							$("<span></span>").attr('id', 'total_row' + index).attr('class', 'reward')
						);

					dateIndex[thisDate] = index;
					if (index === 0) {
						start_end.end_date = thisDate;
					} else if (index === 4) {
						start_end.start_date = thisDate;
					}
					updateProgressBar(progressbar, '+', 2);
				});
				if (start_end) {
					prepare_hit_status_display({'from_date': start_end.start_date, 'to_date': start_end.end_date, 'dateIndex': dateIndex});
				} else {
					update_status_label('An error occurred while loading HIT Database Goals Edition. Please <a href="#" onclick="location.reload();">click here</a> to reload the page.<br /><br />Error code: start_end', 'red');
				}
			}

			if (today) {
				prepare_projected_wait(today, dateIndex);
			} else if (start_end.end_date) {
				prepare_projected_wait(start_end.end_date, dateIndex);
			}
			HITStorage.indexedDB.get_pending_approvals();
			HITStorage.indexedDB.get_pending_payments();
		}
	};
} else if (document.location.href == 'https://www.mturk.com/mturk/status') {
	// ************************************************* //
	// ************************************************* //
	// ****************** STATUS PAGE ****************** //
	// ************************************************* //
	// ************************************************* //

	if (localStorage.getItem('hitdb_settings_statuspage') !== 'disabled') {
		
		var label = $("<label></label>")
			.attr({'id': 'status_label'})
			.css({'margin-left': 'auto', 'margin-right': 'auto', 'text-align': 'center'})
			.text('Search powered by non-Amazonian script monkeys');

		$("head").append(
			$("<link></link>")
				.attr('rel', 'stylesheet')
				.attr('href', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/flick/jquery-ui.css')
				.prop('type', 'text/css')
		);

		$("body").append(
			$("<div></div>")
				.attr('id', 'progress_dialog')
				.append(
					$("<div></div>")
						.attr('id', 'progressbar')
						.append(
							$("<div></div>")
								.attr('id', 'progressbar_label')
								.addClass('progress-label')
								.text('Loading...')
						),
						label
				)
		);

		dialogs.progress('Loading HIT Database Goals Edition v' + localStorage.getItem('hitdb_version'));

		setTimeout(function() { after_progress_loaded(); }, 500);

		after_progress_loaded = function() {
			$("body").append(
				$("<div></div>")
					.attr('id', 'generic_modal_dialog')
					.append(
						$("<p></p>")
							.append("<span id='generic_modal_dialog_error' style='color: red;'></span>")
							.append("<span id='generic_modal_dialog_instructions'></span>")
					)
			);

			$(function() {
				$("#generic_modal_dialog").dialog({
					resizable: true,
					width: 400,
					modal: true,
					autoOpen: false
				});
			});

			$("table[width='700']").attr('width', '740');
			$("table[width='740']").children().eq(0).children().eq(0).children().eq(1).attr('width', '720');
			var dateCell = $("a[id='date_column_header.tooltip']");
			var interiorTable = dateCell.parent().parent().parent();
			if (interiorTable) {
				var headerRow = interiorTable.children().eq(0);
				headerRow.before(
					$("<tr></tr>")
						.attr('class', 'metrics-table-header-row')
						.append(
							$("<th></th>"),
							$("<th></th>")
								.attr('colspan', '4')
								.css('textAlign', 'center')
								.text('HITs'),
							$("<th></th>")
								.attr('colspan', '6')
								.css('textAlign', 'center')
								.text('Dollars')
						)
				);
				var footerRow = interiorTable.children().last();
				footerRow.children().last().text("$").append("<span id='sum_total' class='reward'></span>").before(
					$("<td></td>")
						.text("$")
						.append($("<span id='sum_submitted' class='reward'></span>").text('0.00'))
						.css({'text-align': 'right'}),
					$("<td></td>")
						.text("$")
						.append($("<span id='sum_paid' class='reward'></span>").text('0.00'))
						.css({'text-align': 'right'}),
					$("<td></td>")
						.text("$")
						.append($("<span id='sum_rejected' class='reward'></span>").text('0.00'))
						.css({'text-align': 'right'}),
					$("<td></td>")
						.text("$")
						.append($("<span id='sum_bonus' class='reward'></span>").text('0.00'))
						.css({'text-align': 'right'}),
					$("<td></td>")
						.text("$")
						.append($("<span id='sum_pending' class='reward'></span>").text('0.00'))
						.css({'text-align': 'right'})
				);
				$("#statusEarningsColumnValueTotal").css({'text-align': 'right'});
				var total_cell = $("a[id='earnings_column_header.tooltip']").parent();
				total_cell.text("Total");
				total_cell.prev().text("Pend");
				total_cell.prev().prev().text("Reject");
				total_cell.prev().prev().prev().text("Approve");
				total_cell.prev().prev().prev().prev().text("Submit");
				total_cell.before(
					$("<th></th>")
						.text("Submit")
						.attr('title', 'This includes all HITs submitted on this date, including those that have since been rejected'),
					$("<th></th>")
						.text("Approve")
						.attr('title', 'This includes HITs that are Paid and HITs that are Approved-Pending Payment'),
					$("<th></th>")
						.text("Reject"),
					$("<th></th>")
						.text("Bonus")
						.attr('title', 'Any bonuses or external payments that you entered for this date'),
					$("<th></th>")
						.text("Pend")
				);

				var start_end = {},
					dateIndex = {};
				interiorTable.children().filter("tr.odd, tr.even").each(function(index, element) {
					var thisDate = $(this).children().first().children().first();
					thisDate = thisDate.attr('href').replace('/mturk/statusdetail?encodedDate=', '');
					var origDate = thisDate;
					thisDate = convert_date(thisDate);

					$(this).children().first().children().first().wrapInner("<span style='white-space: nowrap'></span>");
					$(this).children().last().attr('id', 'total_cell' + index)
						.text("$")
						.css('verticalAlign', 'top')
						.css('textAlign', 'right')
						.append($("<span></span>").attr('id', 'total_row' + index).attr('class', 'reward'))
						.before(
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.css('textAlign', 'right')
							.append("<span class='reward' id='submitted_row" + index + "'></span>"),
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.css('textAlign', 'right')
							.append("<span class='reward' id='paid_row" + index + "'></span>"),
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.css('textAlign', 'right')
							.append("<span class='reward' id='rejected_row" + index + "'></span>"),
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.css('textAlign', 'right')
							.append("<span class='reward' id='bonus_row" + index + "'></span>")
							.click(specific_bonus_dialog(thisDate, today, index)),
						$("<td></td>")
							.text("$")
							.css('verticalAlign', 'top')
							.css('textAlign', 'right')
							.append("<span class='reward' id='pending_row" + index + "'></span>")
					);

					dateIndex[thisDate] = index;
					if (index === 0) {
						start_end.end_date = thisDate;
					} else if (index === (interiorTable.children().length - 4)) {
						start_end.start_date = thisDate;
					}
				});
				prepare_hit_status_display({'from_date': start_end.start_date, 'to_date': start_end.end_date, 'dateIndex': dateIndex});
			}
		}
	}
} else if (document.location.href.match('https://www.mturk.com/mturk/preview') || document.location.href.match('https://www.mturk.com/mturk/return') || document.location.href.match('https://www.mturk.com/mturk/submit')) {
	if ($(":contains('Want to work on this HIT')").length) {
		var requesterId = document.getElementsByName('requesterId')[0].value;
		var auto_approve = parseInt(document.getElementsByName('hitAutoAppDelayInSeconds')[0].value);
		var title = $("td.capsulelink_bold").ignore("a").text().trim();
		var table = $("a[id='requester.tooltip']").closest("table");
		table.attr('id', 'test');

		var extra_row = $("<tr></tr>");
		extra_row.append(
			$("<td></td>").attr({'colspan': '3'}),
			$("<td></td>")
				.html('<span class="capsule_field_title">Auto-Approval:</span>&nbsp;&nbsp;' + HITStorage.formatTime(auto_approve * 1000))
				.attr({'colspan': '8'})
		);

		var buttons = [];
		var b = ['Requester', 'HIT Title'];
		for (var i = 0; i < 2; i++) {
			button = $("<button></button>").attr({'id': 'Button' + i, 'form': 'NOThitForm'}).text(b[i]);
			button.css({'font-size': '10px', 'height': '18px', 'width': '80px', 'background-color': 'lightgrey'});
			extra_row.children().eq(0).append(button);
		}

		table.append(extra_row);

		$("#Button0").attr({'title': 'Search requester ' + requesterId + ' in HIT Database'});
		$("#Button1").attr({'title': 'Search title \'' + title + '\' in HIT Database'});
		$("#Button0").button().click(launch_hit_search(requesterId, 'requesterId'));
		$("#Button1").button().click(launch_hit_search(title, 'title'));

		HITStorage.indexedDB.colorRequesterButton(requesterId, 'Button0');
		HITStorage.indexedDB.colorTitleButton(title, 'Button1');
	}
} else if (document.location.href == 'https://www.mturk.com/mturk/status?checkdb') {

	$("table[width='700']").attr('width', '740');
	$("table[width='740']").children().eq(0).children().eq(0).children().eq(1).attr('width', '720');
	var dateCell = $("a[id='date_column_header.tooltip']");
	var interiorTable = dateCell.parent().parent().parent();
	if (interiorTable) {
		var headerRow = interiorTable.children().eq(0);
		headerRow.before(
			$("<tr></tr>")
				.attr('class', 'metrics-table-header-row')
				.append(
					$("<th></th>"),
					$("<th></th>")
						.attr('colspan', '4')
						.css('textAlign', 'center')
						.text('MTurk'),
					$("<th></th>")
						.attr('colspan', '4')
						.css('textAlign', 'center')
						.text('HIT Database'),
					$("<th></th>")
				)
		);
		var footerRow = interiorTable.children().last();
		footerRow.children().last().text("$").append("<span id='sum_total' class='reward'></span>").before(
			$("<td></td>")
				.css({'text-align': 'right'}),
			$("<td></td>")
				.css({'text-align': 'right'}),
			$("<td></td>")
				.css({'text-align': 'right'}),
			$("<td></td>")
				.css({'text-align': 'right'})
		);
		$("#statusEarningsColumnValueTotal").css({'text-align': 'right'});
		var total_cell = $("a[id='earnings_column_header.tooltip']").parent();
		total_cell.text("Total");
		total_cell.prev().text("Pend");
		total_cell.prev().prev().text("Reject");
		total_cell.prev().prev().prev().text("Approve");
		total_cell.prev().prev().prev().prev().text("Submit");
		total_cell.before(
			$("<th></th>")
				.text("Submit")
				.attr('title', 'This includes all HITs submitted on this date, including those that have since been rejected'),
			$("<th></th>")
				.text("Approve")
				.attr('title', 'This includes HITs that are Paid and HITs that are Approved-Pending Payment'),
			$("<th></th>")
				.text("Reject"),
			$("<th></th>")
				.text("Pend")
		);

		interiorTable.children().filter("tr.odd, tr.even").each(function(index, element) {
			var thisDate = $(this).children().first().children().first();
			thisDate = thisDate.attr('href').replace('/mturk/statusdetail?encodedDate=', '');
			var origDate = thisDate;
			thisDate = convert_date(thisDate);

			$(this).attr('id', 'row_' + thisDate);
			$(this).children().first().children().first().wrapInner("<span style='white-space: nowrap'></span>");
			$(this).children().last().attr('id', 'total_cell' + index)
				.before(
					$("<td></td>")
						.attr('id', 'submit_' + thisDate),
					$("<td></td>")
						.attr('id', 'approve_' + thisDate),
					$("<td></td>")
						.attr('id', 'reject_' + thisDate),
					$("<td></td>")
						.attr('id', 'pending_' + thisDate)
				);
			$(this).children().filter('td').each(function(index2, element2) {
				if (!$(this).children().filter('a').length) {
					if (index2 === 1) {
						$(this).attr('id', 'turk_submit_' + thisDate);
					} else if (index2 === 2) {
						$(this).attr('id', 'turk_approve_' + thisDate);
					} else if (index2 === 3) {
						$(this).attr('id', 'turk_reject_' + thisDate);
					} else if (index2 === 4) {
						$(this).attr('id', 'turk_pending_' + thisDate);
					}
					$(this).css({'verticalAlign': 'top', 'textAlign': 'right'});
				}
			});
		});
		interiorTable.children().filter("tr.odd, tr.even").last().attr('role', 'lastrow');
	}

	var request = indexedDB.open("HITDB", v);

	request.onsuccess = function(e) {
		//HITStorage.updateStatusLabel('Please wait: checking database', 'red');
		HITStorage.indexedDB.db = e.target.result;
		var db = HITStorage.indexedDB.db;
		var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
		var store = trans.objectStore("HIT");
		var index = store.index('date');
		var lastdate = moment().format('YYYY-MM-DD');//.subtract(45, 'days')
		var range = IDBKeyRange.upperBound(lastdate, false);
		var req;
		var badHits = {};
		var allHits = {};

		index.openCursor(range).onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (allHits[cursor.value.date] === undefined) {
					allHits[cursor.value.date] = {'reject': 0, 'pending': 0, 'submit': 0, 'approve': 0};
				}
				allHits[cursor.value.date].submit += 1;
				if (cursor.value.status === 'Rejected') {
					allHits[cursor.value.date].reject += 1;
				} else if (cursor.value.status === 'Pending Approval') {
					allHits[cursor.value.date].pending += 1;
				} else {
					allHits[cursor.value.date].approve += 1;
				}
				cursor.continue();
			} else {
				for (var i = 0; i < _.size(allHits); i++) {
					key = Object.keys(allHits)[i];
					if (!$("#row_" + key).length) {
						curDate = moment(key).format('MMM D, YYYY');
						thisClass = $("tr[role='lastrow']").next().attr('class');
						if (thisClass == 'grayHead') {
							thisClass = $("tr[role='lastrow']").attr('class');
						}
						newClass = (thisClass == 'odd' ? 'even' : 'odd');
						$("tr[role='lastrow']").after(
							$("<tr id='row_" + key + "' class='" + newClass + "'></tr>")
								.append("<td id='date_" + key + "'></td>", "<td></td>", "<td></td>", "<td></td>", "<td></td>", "<td id='submit_" + key + "' style='text-align: right;'></td>", "<td id='approve_" + key + "' style='text-align: right;'></td>", "<td id='reject_" + key + "' style='text-align: right;'></td>", "<td id='pending_" + key + "' style='text-align: right;'></td>", "<td></td>"));
						$("#date_" + key).text(curDate);
					}
					$("#submit_" + key).text(allHits[key].submit);
					if ($("#turk_submit_" + key).text() != allHits[key].submit) {
						$("#submit_" + key).css('background-color', 'red');
					}
					$("#pending_" + key).text(allHits[key].pending);
					if ($("#turk_pending_" + key).text() != allHits[key].pending) {
						$("#pending_" + key).css('background-color', 'red');
					}
					$("#approve_" + key).text(allHits[key].approve);
					if ($("#turk_approve_" + key).text() != allHits[key].approve) {
						$("#approve_" + key).css('background-color', 'red');
					}
					$("#reject_" + key).text(allHits[key].reject);
					if ($("#turk_reject_" + key).text() != allHits[key].reject) {
						$("#reject_" + key).css('background-color', 'red');
					}
				}
			}
		};
		db.close();
	};
	request.onerror = HITStorage.indexedDB.onerror;
} else if (document.location.href.match('https://www.mturk.com/mturk/status') && document.location.href.match('checkdb')) {
	getUrlVars = function() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	var hitData = [];
	var onlyDate = getUrlVars().date;

	$("body").html('');
	$("body").append("<h1>All HITs for " + getUrlVars().date + "</h1>");
	$("body").append($("<br><br />"), $("<br />"), $("<span id='loading'>Loading...</span>"));
	$("body").append("<ul id='allhits'></ul>");

	getHITDataTemp = function(day_to_fetch, hitData, page) {
		var dataDate = convert_iso_date(day_to_fetch);
		page = page || 1;
		detailed_status_page_link = "https://www.mturk.com/mturk/statusdetail?sortType=All&pageNumber=" + page + "&encodedDate=" + dataDate;

		if (HITStorage.processPage(detailed_status_page_link, dataDate, hitData) === 0) {
			var request = indexedDB.open("HITDB", v);

			request.onsuccess = function(e) {
				//HITStorage.updateStatusLabel('Please wait: checking database', 'red');
				HITStorage.indexedDB.db = e.target.result;
				var db = HITStorage.indexedDB.db;
				var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
				var store = trans.objectStore("HIT");
				var index = store.index('date');
				//var lastdate = moment().format('YYYY-MM-DD');
				var range = IDBKeyRange.only(onlyDate);
				var req;
				var allHits = [];

				index.openCursor(range).onsuccess = function(event) {
					var cursor = event.target.result;
					if (cursor) {
						allHits.push(cursor.value);
						cursor.continue();
					} else {
						$("#loading").text('');
						for (var i = 0; i < hitData.length; i++) {
							$("#allhits").append($("<li></li>").html('HIT ID: <span id="id_' + hitData[i].hitId + '" style="background-color: red; color: white;">' + hitData[i].hitId + '</span> / Status: <span id="status_' + hitData[i].hitId + '" style="background-color: red; color: white;">' + hitData[i].status + '</span>'));
						}
						for (var j = 0; j < allHits.length; j++) {
							if ($("#id_" + allHits[j].hitId).length) {
								$("#id_" + allHits[j].hitId).css({'background-color': 'green'});
								if ($("#status_" + allHits[j].hitId).text() == allHits[j].status) {
									$("#status_" + allHits[j].hitId).css({'background-color': 'green'});
								}
							} else {
								$("#allhits").append($("<li></li>").html('HIT ID: <span style="background-color: red; color: white;" id="id_' + allHits[j].hitId + '">' + allHits[j].hitId + '</span> / <span style="background-color: red; color: white;" id="status_' + allHits[j].hitId + '">Status: ' + allHits[j].status + '<br /><a href="https://www.mturk.com/mturk/deletefromdb?date=' + onlyDate + '&hitId=' + allHits[j].hitId + '" target="_blank">Not found on MTurk - Delete HIT from Database?</a>'));
							}
						}
					}
				};
				db.close();
			};
			request.onerror = HITStorage.indexedDB.onerror;
		} else {
			// next page
			setTimeout(function() { getHITDataTemp(day_to_fetch, hitData, page + 1); }, 1000);
		}
	};

	getHITDataTemp(onlyDate, hitData);
} else if (document.location.href.match('https://www.mturk.com/mturk/deletefromdb')) {
	getUrlVars = function() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	$("body").html('');
	$("body").append("<h1>Delete HIT From Database</h1>");// (Older than " + moment().subtract(45, 'days').format('YYYY-MM-DD') + ")</h1>");

	if (getUrlVars().hitId && getUrlVars().date) {
		$("body").append($("<br />"), $("<br />"), $("<span id='loading'>Deleting HIT ID " + getUrlVars().hitId + "...</span>"));
		var request = indexedDB.open("HITDB", v);
		request.onsuccess = function(e) {
			HITStorage.indexedDB.db = e.target.result;
			var db = HITStorage.indexedDB.db;
			var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_WRITE);
			var store = trans.objectStore("HIT");
			var request;

			request = store.delete(getUrlVars()['hitId']);

			request.onsuccess = function(e) {
				$("#loading").text($("#loading").text() + 'done!');
				db.close();
			};

			request.onerror = function(e) {
				console.log("Error deleting HIT: ", e);
			};
		};
		request.onerror = HITStorage.indexedDB.onerror;
	} else {
		$("body").append($("<br />"), $("<br />"), $("<span>The URL is missing information. Please try again.</span>"));
	}
} else if (document.location.href.match('https://www.mturk.com/mturk/checkvars')) {
	// nothing yet
} else if (document.location.href.match('https://www.mturk.com/hitdb/overview/requester')) {
	$("head").append("<title>Requester Overview - HIT Database</title>");
	var b = $("body");
	b.html('');

	options = {};
	urlOptions = document.location.href.split('/');
	for (var i = 6; i < urlOptions.length; i++) {
		varVal = urlOptions[i].split('=');
		options[varVal[0]] = decodeURIComponent(varVal[1]);
	}
	HITStorage.indexedDB.overviewRequester(options);
} else if (document.location.href.match('https://www.mturk.com/hitdb/overview/pending')) {
	$("head").append("<title>Pending Overview - HIT Database</title>");
	var b = $("body");
	b.html('');

	HITStorage.indexedDB.overviewPending({});
} else if (document.location.href.match('https://www.mturk.com/hitdb/overview/daily')) {
	$("head").append("<title>Daily Overview - HIT Database</title>");
	var b = $("body");
	b.html('');

	options = {};
	urlOptions = document.location.href.split('/');
	for (var i = 6; i < urlOptions.length; i++) {
		varVal = urlOptions[i].split('=');
		options[varVal[0]] = decodeURIComponent(varVal[1]);
	}
	HITStorage.indexedDB.overviewDaily(options);
} else if (document.location.href.match('https://www.mturk.com/hitdb/search')) {
	$("head").append("<title>HITs Matching Your Search - HIT Database</title>");
	var b = $("body");
	b.html('');

	options = {};
	urlOptions = document.location.href.split('/');
	for (var i = 5; i < urlOptions.length; i++) {
		varVal = urlOptions[i].split('=');
		options[varVal[0]] = decodeURIComponent(varVal[1]);
	}
	HITStorage.indexedDB.search(options);
} else if (document.location.href.match('https://www.mturk.com/hitdb/requester')) {
	$("head").append("<title>Requester Information - HIT Database</title>");
	var b = $("body");
	b.html('');

	urlOptions = document.location.href.split('/');
	requesterId = urlOptions[urlOptions.length - 1];
	HITStorage.indexedDB.requester(requesterId);
} else {
	$("body").append(
		$("<div></div>")
			.attr('id', 'generic_modal_dialog')
			.append(
				$("<p></p>")
					.append("<span id='generic_modal_dialog_error' style='color: red;'></span>")
					.append("<span id='generic_modal_dialog_instructions'></span>")
			)
	);

	$(function() {
		$("#generic_modal_dialog").dialog({
			resizable: true,
			width: 400,
			modal: true,
			autoOpen: false
		});
	});

	for (var item = 0; item < 10; item++) {
		if (!$("[id='requester.tooltip--" + item + "']").length) {
			continue;
		}
		var title = $("#capsule" + item + "-0").text().trim();
		var emptySpace = $("[id='requester.tooltip--" + item + "']").parents("tr").eq(0).parents("tr").eq(0).parent();

		var hitItem = $("table[cellspacing=5]").first().children().first().children().eq(item);

		var requesterLabel = $("[id='requester.tooltip--" + item + "']").parent();
		var requesterIdA = requesterLabel.next().children("a").first();
		requesterId = utilities.getRequesterIdFromURL(requesterIdA.attr('href'));
		requesterName = requesterIdA.text();

		var buttons = [];
		var row = $("<tr></tr>");
		var div = $("<div></div>").css({'margin': '0px'}).attr({'id': 'div-' + item});
		row.append(div);
		emptySpace.append(row);

		HITStorage.indexedDB.isHitBlocked(requesterId, requesterName, title, hitItem);

		var b = ['R', 'T', 'N', 'B'];
		var b_t = ['Search for HITs by requester ' + requesterId + ' in HIT database', 'Search HIT title \'' + title + '\' in HIT database', 'Add a requester note', '"Block" requester'];
		for (var i = 0; i < b.length; i++) {
			buttons[i] = $("<button></button>").text(b[i]).attr({'id': b[i] + 'Button' + item, 'title': b_t[i]});
			buttons[i].css({'height': '18px', 'font-size': '10px'});
			div.append(buttons[i]);
		}

		var notelabel = $("<label></label>").text('').attr({'id': 'notelabel' + item});
		notelabel.css({'height': '18px', 'font-size': '10px', 'margin-left': '10px', 'padding': '1px', 'background-color': 'transparent'});
		HITStorage.indexedDB.updateNoteButton(requesterId, notelabel);
		div.append(notelabel);

		HITStorage.indexedDB.colorRequesterButton(requesterId, 'RButton' + item);
		HITStorage.indexedDB.colorTitleButton(title, 'TButton' + item);
		$("#RButton" + item).button().click(launch_hit_search(requesterId, 'requesterId'));
		$("#TButton" + item).button().click(launch_hit_search(title, 'title'));
		$("#NButton" + item).button().click(dialog_requester_note(requesterId, requesterName, item)).hide();
		$("#BButton" + item).button().click(dialog_requester_block(requesterId, requesterName, title)).hide();

		div.mouseover(function() {
			id = $(this).attr("id").substr(-1);
			$("#NButton" + id).show();
			$("#BButton" + id).show();
		});
		div.mouseout(function() {
			id = $(this).attr("id").substr(-1);
			$("#NButton" + id).hide();
			$("#BButton" + id).hide();
		});
	}

	var auto_button = $("<button></button>").attr({'id': 'auto_button', 'title': 'HIT Database Auto Update\nAutomagically update newest HITs to database when reloading this page'});

	if (localStorage.getItem('hitdb_update_auto') === null) {
		auto_button.text('Auto update ?').css({'color': 'red'});
	} else if (localStorage.getItem('hitdb_update_auto') == 'ON') {
		auto_button.text('Auto Update is ON').css({'color': 'green'});
	} else {
		auto_button.text('Auto Update is OFF').css({'color': 'red'});
	}

	$("[name='/sort']").first().parent().parent().append($("<span>&nbsp;&nbsp;</span>"), auto_button);
	auto_button.button().click(buttonFuncs.autoUpdate).css({'padding': '4px', 'font-size': '0.9em', 'width': '135px'});

	setTimeout(HITStorage.getLatestHITs, 100);
}

//
// 2012-10-03 0.9.7: This is rewrite of MTurk Extended HIT Search (http://userscripts.org/scripts/show/146277)
//				   with some extra features (and some missing for now: search by date).
//				   It now uses IndexedDB (http://en.wikipedia.org/wiki/Indexed_Database_API)
//
// 2012-10-04 0.9.8: Improved use of indexes, check Pending Payment HITs
//			0.9.9: Minor improvements
//
// 2012-10-04 0.10:  Added date options
//
// 2012-10-07 0.11:  Requester notes, bug fixes
//			0.12:  CSV export
//
// 2012-10-09 0.13: "Block" requesters or specific HITs
//
// 2012-10-10 0.14: Requester Overview, shows summary of all requesters in DB
//
// 2012-10-11 0.15: Blocked HITs are always on bottom of the page
//
// 2012-10-14 0.16: Requester Overview improvements
//
// 2012-10-17 0.17: Bug fixes and error checks
//
// 2012-10-18 0.18: Import HIT data from MTurk Extended HIT Search script
//
// 2012-10-21 0.19: Moved main interface to dashboard, show pending earnings on dashboard,
//				  summary of all requesters with pending HITs.
//
// 2012-10-23 0.20: Added Turkopticon (http://turkopticon.differenceengines.com/) links to overview pages
//			0.21: Fixed overview pages reward to include only 'Paid' and 'Approved - Pending Payment' HITs.
//
// 2012-10-28 0.22: Limited Auto Update.
//			0.23: Minor improvements
//
// 2012-10-30 0.24: Projected earnings for today
//
// 2012-11-02 0.25: Smarter Auto Update
//
// 2012-11-03 0.26: GUI update
//
// 2012-11-05 0.30: Extra non-Amazonian script monkeys
//
// 2012-11-06 0.31: Projected earnings progress bar
//
// 2012-11-08 0.32: Minor GUI fixes to look better on Chrome. Looks like it now works on stable Chrome!
//
// 2012-11-13 0.33: Time limits now work with Requester Overview
//
// 2012-11-15 0.34: Bug/compatibility fixes
//
// 2012-11-18 0.40: Daily Overview, update database to use YYYY-MM-DD date format.
//
// 2012-11-22 0.41: R and T button on HIT preview page. Auto-Approval time.
//
// 2012-11-30 0.42: Changes on MTurk pages. Status page in now on one page!
//
// 2012-12-02 1.0: Added @downloadURL and @updateURL
//
// 2012-12-06 1.1: Requester details.
//				 Try to fetch few extra days at first update (not showing on status page).
//
// 2012-12-11 1.2: Import HITs from previously exported CSV-files.
//			 Removed Extended HIT Search import.
//
// 2012-12-13 1.3: Fix CSV-import to put empty string instead if undefined if feedback is empty.
//
// 2012-12-14 1.4: Rewritten database update more properly.
//
// 2012-12-16 1.5: Fixed broken Auto Update (forgot to check that on pervious update).
//
// 2013-02-26 1.6: Fixed IDBTransactionModes for Chrome (note this breaks it for Firefox)
//
// 2013-02-27 1.7: Changed UI bars back to what they used to be.
//
