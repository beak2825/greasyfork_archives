// ==UserScript==
// @name         Torn Stats Downloader
// @version      0.2.1
// @description  Downloads stats of torn users between specified dates.
// @author       Zanoab
// @match        http://www.torn.com/personalstats.php?ID=*
// @grant        none
// @namespace https://greasyfork.org/users/10403
// @downloadURL https://update.greasyfork.org/scripts/13904/Torn%20Stats%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/13904/Torn%20Stats%20Downloader.meta.js
// ==/UserScript==

$(function() {
	var join = function(sep, data) {
		var a = "";
		for (var i=0;i<data.length;i++) {
			if (i > 0) a += sep;
			a += data[i] == null ? "" : data[i];
		}
		return a;
	}, rfcv = function() {
		return document.cookie.match(/rfc_v=([^;]*);?/)[1];
	};
	
	$('.personal-stats').append('<hr class="delimiter-999 m-top10 m-bottom10">').append("<div class='statistic-title title-black top-round'>Stat Downloader</div>");
	var a = $("<div class='statistic cont-gray bottom-round'></div>").appendTo('.personal-stats');
	
	var b = $("<span></span>").appendTo(a);
	var statSelect = $("<select name='stat'></select>").append("<option value=''></option>").appendTo(b);
	$(".personal-stats>.statistic>.statistic-cont>.statistic-kind").not(".t-hide").children().each(function(i, element) {
		var $ele = $(element), $name = $ele.children(".name"), name, value = $ele.attr('data-val');
		if (value == null) return;
		try {
			name = $name.text().match(/([^:]+):?/)[1];
		} catch(e) {
			console.error(e);
			return;
		}
		$("<option></option>").text(name).attr('value', value).appendTo(statSelect);
	});
	var startDate = $('<input type="text" name="start" style="width: 6em;"></input>').appendTo($("<span style='margin-left: 5px;'>Start Date: </span>").appendTo(b)).datepicker({
		dateFormat: "yy-mm-dd",
	});
	var endDate = $('<input type="text" name="end" style="width: 6em;"></input>').appendTo($("<span style='margin-left: 5px;'>End Date: </span>").appendTo(b)).datepicker({
		dateFormat: "yy-mm-dd",
	});
	var searchBtn = $("<button>Download</button>").appendTo(a).click(function(evt) {
		var reset = function() {
			searchBtn.removeAttr('disabled');
		};
		searchBtn.attr('disabled', '');
		var stat = statSelect.children('[selected]').val(), from = startDate.val(), to = endDate.val();
		if (!stat.length || !from.length || !to.length) {
			alert("Please fill in all fields!");
			reset();
			evt.preventDefault();
			return false;
		}
		console.debug("Field checks complete!");
		
		var results = [];
		var playerIndexes = {};
		var playerQueue = [];
		var a = playerInput.val().split('\n');
		for (var i=0;i<a.length;i++) {
			var b = a[i].trim(), c = Number(b);
			if (b.length && c != NaN) {
				if (!playerIndexes[b]) {
					playerIndexes[c] = [];
					playerQueue.push(c);
				}
				playerIndexes[c].push(i);
			}
		}
		console.debug("Download initialized!");
		
		var scrape = function(callback) {
			if (!playerQueue.length) return callback();
			var slice = playerQueue.splice(0, 20);
			var data = {
				userids: join(',', slice),
				field: stat,
				from: from,
				to: to,
				rfcv: rfcv(),
			};
			console.debug("Downloading data: "+slice.length);
			$.ajax({
				url: '/torncity/stats/data',
				type: 'GET',
				data: data,
				crossDomain: true,
			}).done(function(response) {
				console.debug(response);
				var data = response;
				// var data = JSON.parse(response);
				for (var i=0;i<data.datasets.length;i++) {
					var a = data.datasets[i];
					if (a.data.length) {
						var b = {
							id: a.id,
							start: a.data[0],
							end: a.data[a.data.length-1],
						};
						var c = playerIndexes[b.id];
						if (c) {
							for (var j=0;j<c.length;j++) {
								results[c[j]] = b;
							}
						}
						console.debug("Data retrieved user: "+b.id);
					}
				}
				scrape(callback);
			});
		};
		
		scrape(function() {
			console.debug("Download complete!");
			var raw = [];
			for (var i=0;i<a.length;i++) {
				var b = results[i] || {};
				raw.push(join("\t", [
					b.start,
					b.end,
				]));
			}
			playerOutput.val(join("\n", raw));
			alert("Download complete!");
			reset();
		});
		
		evt.preventDefault();
		return false;
	});
	a.append('<br>');
	
	b = $("<div></div>").appendTo(a);
	var playerInput = $('<textarea style="width:25%;height:6em;"></textarea>').appendTo($("<div style='display: inline;'></div>").appendTo(b));
	var playerOutput = $('<textarea style="width:70%;height:6em;"></textarea>').appendTo($("<div style='display: inline;'></div>").appendTo(b));
	
	// $("<link rel='stylesheet' href='https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css'></link>").appendTo(a);
});