// ==UserScript==
// @name         PM Tracker
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0.2
// @description  Alerts when your pm is read
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/12355/PM%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/12355/PM%20Tracker.meta.js
// ==/UserScript==

var scope;
console.log("PM Tracker activated!");

//Get the list of tracked reports
var pmJSON = GM_getValue("em_pmList");
if (pmJSON) {
	pmJSON = JSON.parse(pmJSON);
}
else {
	pmJSON = {data: []};
    GM_setValue("em_pmList", JSON.stringify(pmJSON));
}
//console.log(pmJSON);
var pmList = pmJSON.data;

//Set the checker interval
var checkInt = setInterval(function() {
	pmJSON = GM_getValue("em_pmList");
	pmJSON = JSON.parse(pmJSON);
	pmList = pmJSON.data;
	
	var tempJSON = pmJSON;
	
	for (var index in pmList) {
		var pmObj = pmList[index];
		(function(pm, i){
			$.get("/message/" + pm.id, function(data){
				var readbys = 0;
				for (var user in data[1].targets) {
					if (data[1].targets[user].opened) {
						if (!tempJSON.data[i].recips[data[1].targets[user].id]) {
							//console.log("Message read by " + data[1].targets[user].username);
							//errordisplay("Message read by " + data[1].targets[user].username);
							alert("Message read by " + data[1].targets[user].username);
							tempJSON.data[i].recips[data[1].targets[user].id] = true;
						}
						readbys++;
					}
				}
				if (readbys == data[1].targets.length) {
					tempJSON.data.splice(i, 1);
				}
				GM_setValue("em_pmList", JSON.stringify(tempJSON));
			});
		})(pmObj, index);
	}
}, 5000);

//Override scope.submitMessage()

function trackMsg() {
	console.log('test');
	setTimeout(function() {
		scope = $("#send_message_form").scope();
		var ref, results, k, v;
		
		scope.submitMessage = function() {
			ref = scope.recipients;
			results = [];
			for (k in ref) {
				v = ref[k];
				results.push(parseInt(k));
			}
			scope.sending_message = true;
			$.ajax({
				method: 'POST',
				url: "/message",
				contentType: 'application/x-www-form-urlencoded',
				data: {
					msg: scope.msg,
					subject: scope.subject,
					recipients: results
				}
			}).done(function(o) {
				var msg, status;
				status = o[0], msg = o[1];
				if (status) {
					$("[ng-class*='{sel: $parent.type==\'inbox\'}']").click();
					errordisplay('.error', "You sent a message!");
					$.get("/message/fetch/sent", function(data) {
						var recips = {};
						for (var recip in results) {
							recips[results[recip]] = false;
						}
						pmJSON.data.push({ id: data[1].data[0].id, recips: recips });
						GM_setValue("em_pmList", JSON.stringify(pmJSON));
					});
				} else {
					errordisplay('.error', msg);
				}
				return scope.sending_message = false;
			});
			return false;
		};
	}, 500);
}

if (location.pathname == '/message') {
	setTimeout(function() {
		$("[href*='compose']").click(function() {
			trackMsg();
		});
		$("[href*='/message']").click(function() {
			setTimeout(function() {
				$("[href*='compose'].redbutton").click(function() {
					trackMsg();
				});
			}, 500);
		});
	}, 500);
}
