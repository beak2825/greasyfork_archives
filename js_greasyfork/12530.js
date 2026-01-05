// ==UserScript==
// @name         LogView
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0
// @description  Shows the stats of mod logs
// @author       Croned
// @match        https://epicmafia.com/user/*/statistics
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12530/LogView.user.js
// @updateURL https://update.greasyfork.org/scripts/12530/LogView.meta.js
// ==/UserScript==

var name = $("h2").text();
var dateNow = new Date();
GM_xmlhttpRequest({
	url:"https://api.myjson.com/bins/smao",
	method:"GET",
	onload: function(res) {
		res = JSON.parse(res.responseText);
		for (var i in res) {
			if (res[i].name == name) {
				var userURL = res[i].url;
				GM_xmlhttpRequest({
					url: res[i].url,
					method:"GET",
					onload: function(data) {
						data = JSON.parse(data.responseText);
						console.log(data);
						
						$("#user_container").append("<div id='dateNow'></div><div id='logMng'><button id='clearLog'>Clear Log</button></div><div class='tableContainer'><table id='stat1' class='logTable'><tr><th>Join</th><th>Leave</th></tr></table><table id='stat2' class='logTable'><tr><th>Seen By</th></tr><tr><td> </td></tr></table></div>");
						$("head").append("<style type='text/css'>#logMng button {border: none; background-color: #b11; border-radius: 3px; color: white; padding: 3px; font-size: 20px; cursor: pointer; margin: 5px;}#stat2 {margin-left: 10px;}.tableContainer {text-align: center}.logTable {display: inline-block;}#logMng {text-align: center; margin-bottom: 30px;}#dateNow {text-align: center; font-size: 20px; margin: 820px 0px 30px 0px;}table tr:nth-child(even) {background-color: #eee;}table tr:nth-child(odd) {background-color: #fff;}table th {color: white;background-color: #b11;} td, th {padding: 5px; width: 235px;}</style>");
						$("#dateNow").text(dateNow.toUTCString());
						
						if (name == $(".userteeny").text()) {
							$("#logMng").append("<button id='clearAllLogs'>Clear All Logs</button>");
						}
						
						$("#clearLog").click(function() {
							console.log("Clearing log...");
							var tempJSON = {name: name, self: [], others: {}};
							tempJSON = JSON.stringify(tempJSON);
							GM_xmlhttpRequest({
								url: userURL,
								method:"PUT",
								data: tempJSON,
								headers:{"Content-Type": "application/json; charset=utf-8"},
								onload: function() {
									location.reload();
									console.log("Log cleared!");
								}
							});
						});
						
						$("#clearAllLogs").click(function() {
							console.log("Clearing all logs...");
							for (var user in res) {
								var tempJSON = {name: res[user].name, self: [], others: {}};
								tempJSON = JSON.stringify(tempJSON);
								var usersCleared = 0;
								GM_xmlhttpRequest({
									url: res[user].url,
									method:"PUT",
									data: tempJSON,
									headers:{"Content-Type": "application/json; charset=utf-8"},
									onload: function() {
										console.log("All logs cleared!");
										usersCleared ++;
										if (usersCleared == res.length) {
											console.log("All logs cleared!");
											location.reload();
										}
									}
								});
							}
						});
						
						for (var j in data.self) {
							$("#stat1").append("<tr><td>" + data.self[j].join + "</td><td>" + data.self[j].leave + "</td></tr>");
						}
						if (data.self.length == 0) {
							$("#stat1").append("<tr><td>No data</td><td>No data</td></tr>");
						}
						
						for (var user in res) {
							if (res[user].name != name) {
								GM_xmlhttpRequest({
									url: res[user].url,
									method:"GET",
									onload: function(data2) {
										data2 = JSON.parse(data2.responseText);
										console.log(data2);
										var id = location.pathname.split("/")[2];
										if (data2.others[id]) {
											if (data2.others[id].length > 0) {
												$("#stat2").append("<tr><th>" + data2.name + "</th></tr>");
												for (var record in data2.others[id]) {
													$("#stat2").append("<tr><td>" + data2.others[id][record] + "</td></tr>");
												}
											}
										}
									}
								});
							}
						}
					}
				});
			}
		}
	}
});
