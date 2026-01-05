// ==UserScript==
// @name         OmniMod
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0.6
// @description  Tracks when mods are in the lobby
// @author       Croned
// @match        https://epicmafia.com/lobby
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12473/OmniMod.user.js
// @updateURL https://update.greasyfork.org/scripts/12473/OmniMod.meta.js
// ==/UserScript==

var scope = $("#lobby_container").scope();
var oldFn = scope.init_user;
scope.init_user = function(data) { checkUser(data); oldFn(data); };
var mods = [];
var sessionIndex;
GM_xmlhttpRequest({
	url: "https://api.myjson.com/bins/4s0c0",
	method:"GET",
	onload: function(res) {
		mods = JSON.parse(res.responseText);
	}
});
var name = $(".userteeny").text();
var storeURL = GM_getValue("em_storeURL");
console.log(storeURL);
if (!storeURL && name) {
	var tempDate = new Date();
	sessionIndex = 0;
	var tempJSON = {name: name, self: [{join: tempDate.toUTCString(), leave: null}], others: {}};
	tempJSON = JSON.stringify(tempJSON);
	GM_xmlhttpRequest({
		url:"https://api.myjson.com/bins",
		method:"POST",
		data: tempJSON,
		headers:{"Content-Type": "application/json; charset=utf-8"},
		onload: function(res){
			res = JSON.parse(res.responseText);
			res = res.uri;
			GM_setValue("em_storeURL", res);
			storeURL = res;
			GM_xmlhttpRequest({
				url:"https://api.myjson.com/bins/smao",
				method:"GET",
				onload: function(data) {
					data = JSON.parse(data.responseText);
					tempObj = {name: name, url: storeURL};
					data.push(tempObj);
					data = JSON.stringify(data);
					GM_xmlhttpRequest({
						url:"https://api.myjson.com/bins/smao",
						method:"PUT",
						data: data,
						headers:{"Content-Type": "application/json; charset=utf-8"}
					});
				}
			});
		}
	});  
}
else if (!name) {
	throw new Error("Can't detect username for initialization!");
}

for (var user in scope.user_hash) {
	var data = [user];
	checkUser(data);
}

if (storeURL) {
	GM_xmlhttpRequest({
		url: storeURL,
		method:"GET",
		onload: function(res) {
			var myLogs = JSON.parse(res.responseText);
			var tempDate = new Date();
			sessionIndex = myLogs.self.push({join: tempDate.toUTCString(), leave: null}) - 1;
			myLogs = JSON.stringify(myLogs);
			GM_xmlhttpRequest({
				url: storeURL,
				method:"PUT",
				data: myLogs,
				headers:{"Content-Type": "application/json; charset=utf-8"}
			});
		}
	});
}

window.addEventListener("beforeunload", function (e) {
	GM_xmlhttpRequest({
		url: storeURL,
		method:"GET",
		onload: function(res) {
			var myLogs = JSON.parse(res.responseText);
			var tempDate = new Date();
			myLogs.self[sessionIndex].leave = tempDate.toUTCString();
			myLogs = JSON.stringify(myLogs);
			GM_xmlhttpRequest({
				url: storeURL,
				method:"PUT",
				data: myLogs,
				headers:{"Content-Type": "application/json; charset=utf-8"}
			});
		}
	});
});

function checkUser(data) {
	var userId = data[0];
	var userDate;
	for (var mod in mods) {
		if (mods[mod] == userId && userId != scope.user) {
			GM_xmlhttpRequest({
				url: storeURL,
				method:"GET",
				onload: function(res) {
					var myLogs = JSON.parse(res.responseText);
					var tempDate = new Date();
					if (myLogs.others[userId]) {
						myLogs.others[userId].push(tempDate.toUTCString());
					} else {
						myLogs.others[userId] = [tempDate.toUTCString()];
					}
					myLogs = JSON.stringify(myLogs);
					GM_xmlhttpRequest({
						url: storeURL,
						method:"PUT",
						data: myLogs,
						headers:{"Content-Type": "application/json; charset=utf-8"}
					});
				}
			});
		}
	}
}

unsafeWindow.clearOld = function() {
	GM_setValue("em_storeURL", "");
}