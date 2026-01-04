// ==UserScript==
// @name         Torn Xanax Usage Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  View individual Xanax usage on Faction page.
// @author       Microbes
// @match        https://www.torn.com/profiles.php?XID=*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/preferences.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476307/Torn%20Xanax%20Usage%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/476307/Torn%20Xanax%20Usage%20Viewer.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Get current setting if exist
	let apiKey = localStorage.getItem(`xanaxviewer_apikey`) || '';
	let autoLimit = localStorage.getItem(`xanaxviewer_autoLimit`) || '0';
	let showRelative = localStorage.getItem(`xanaxviewer_relative_values`) === 'true' || false;

	// Fetech our own stats
	let myInfo;
	$.get(`https://api.torn.com/user/?selections=basic,personalstats&key=${apiKey}&comment=xanaxviewer`, (data, status) => {
		if ("error" in data) {
			$(".content-title").first().append(`<p style="color: red;">XanaxViewerError: ${data["error"]["error"]}.</p>`);
		} else {
			XanaxViewerMain(data, apiKey, autoLimit, showRelative);
		}
	});

	// Perferences Page
	if (GetPageName() == "preferences.php") {
		$(".preferences-container").after(`
        <div class="xanaxviewer_container " data-feature="connect">
           <div class="xanaxviewer_head">
              <span class="xanaxviewer_title">Xanax Viewer Settings</span>
           </div>

           <div class="xanaxviewer_content">
             <br/>
             <p>API Key (Public Only): <input id="xanaxviewer_api" type="text" maxlength="16" required="" autocomplete="off" value="${apiKey}" style="color: rgb(0, 0, 0); border-width: 1px; border-style: solid; border-color: rgb(204, 204, 204); border-image: initial; width: 20em;"></p>

             <br/><br/>
             <p>Automatically fetch <span id="xanaxviewer_autolimit">${autoLimit}</span> users (cloesest level) when I visit a faction page.</p>
             <div class="slidecontainer">
          	     <input type="range" min="0" max="100" value="${autoLimit}" class="slider" id="xanaxviewer_autolimit_slider">
             </div>

             <br/>
             <p>Show Relative Value: <input id="xanaxviewer_relative_checkbox" type="checkbox" /></p>

             <br/><br/>
             <p><span id="xanaxviewer_storage_counter">250</span> Profiles saved. <a id="xanaxviewer_deleteall_btn">Delete all</a>?</p>

             <br/>
             <a id="xanaxviewer_update_btn" class="torn-btn btn-big update">Update</a>
             <span id="updateText">Updated successfully!</span>
           </div>
        </div>
        `);

		document.getElementById("xanaxviewer_autolimit_slider").oninput = function() {
			$("#xanaxviewer_autolimit").text(this.value);
		};

		$('#xanaxviewer_relative_checkbox').prop('checked', showRelative);

		let cache = GetXanaxViewerCache();
		$("#xanaxviewer_storage_counter").text(Object.keys(cache).length);
		$("#xanaxviewer_deleteall_btn").click(() => {
			localStorage.removeItem("xanaxviewer_cache");
			$("#xanaxviewer_storage_counter").text(0);
		});

		$("#xanaxviewer_update_btn").click(() => {
			localStorage.setItem(`xanaxviewer_apikey`, $("#xanaxviewer_api").val());
			localStorage.setItem(`xanaxviewer_autoLimit`, $("#xanaxviewer_autolimit_slider").val());
			localStorage.setItem(`xanaxviewer_relative_values`, $("#xanaxviewer_relative_checkbox").is(":checked"));
			$("#updateText").fadeIn();
		});

		$("#updateText").hide();
	}

	function XanaxViewerMain(myInfo, apiKey, autoLimit, showRelative) {
		if (GetPageName() == "profiles.php" && apiKey != '') {
			var uid = window.location.href.split("=").slice(-1);
			var selector = $("#profileroot .profile-buttons .title-black")

			GetUserStats(uid).then((stats) => {
				selector.append(`<span class="xanaxviewer-profile">${showRelative ? stats["xantaken"] - myInfo.personalstats.xantaken : stats["xantaken"]} Xanax</span>`);
				selector.append(`<span class="xanaxviewer-profile">${stats["refills"]} Refills</span>`);
			});
		} else if (GetPageName() == "factions.php" && apiKey != '') {

			let profiles = {};

			waitForElementToExist('.members-list .positionCol___Lk6E4').then((elm) => {
				delay(250).then(() => {
					$('.faction-info-wrap .table-header').append(`<li tabindex="0" class="table-cell xanaxviewer_header torn-divider divider-vertical c-pointer">Xanax<div class="sortIcon___ALgdi asc___bb84w"></div></li>`);

					// Add cached result or refresh button
					$('.faction-info-wrap .table-body').find(".table-row").each(function() {
						var uid = $(this).find("a").eq(1);
						uid = uid.attr('href').split("=").slice(-1);

						let info = GetXanaxViewerCache()[uid];

						if (info) {
							let xantaken = showRelative ? info["xantaken"] - myInfo.personalstats.xantaken : info["xantaken"];
							$(this).append(`<div class="table-cell xanaxviewer_header"><a class="xanaxviewer_refresh">${xantaken}</a></div>`);
						} else {
							$(this).append(`<div class="table-cell xanaxviewer_header"><a class="xanaxviewer_refresh">⟳</a></div>`);
						}

						// Add level into profiles, to auto refresh.
						var level = $(this).find(".lvl").first().text();
						if (level in profiles) {
							profiles[level].push(this);
						} else {
							profiles[level] = [this];
						}

						// XanaxViewerLog(level + ": " + profiles[level].length);
					});

					// On Refresh Clicked
					$(".xanaxviewer_refresh").click(function() {
						UpdateViewer(this, myInfo);
					});

					// Refresh autoLimit amonunt of Xanax field
					let memberCount = $(".members-list .c-pointer span").first();
					memberCount = memberCount.html().split("/")[0].replace(/ /g, '');

					if (autoLimit > memberCount) {
						autoLimit = memberCount;
					}

					if (autoLimit > 0) {
						let toBeRefreshed = [];
						let refreshed = 0;
						let level = myInfo.level;
						let cursorLevel = level;
						let generation = 0;
						let nextMinus = true;

						// XanaxViewerLog(Object.keys(profiles));

						while (refreshed < autoLimit) {
							if (nextMinus == true) {
								cursorLevel = level + generation;
								generation++;
							} else {
								cursorLevel = level - generation;
							}

							nextMinus = !nextMinus;

							if (cursorLevel in profiles) {
								profiles[cursorLevel].every(function(profile) {
									toBeRefreshed.push(profile);
									$(profile).find(".xanaxviewer_header").html(`<a class="xanaxviewer_refresh">L</a></div>`);
									refreshed++;

									if (refreshed >= autoLimit) {
										return false;
									}

									return true;
								});
							}
						}

						// XanaxViewerLog(toBeRefreshed.length);

						// Start refreshing
						StartRefreshing(toBeRefreshed, 0, myInfo);
					}
				});
			});
		}
	}

	function StartRefreshing(toBeRefreshed, counter, myInfo) {
		// XanaxViewerLog("updating " + counter);
		if (!counter in toBeRefreshed) return;

		let item = toBeRefreshed[counter];
		UpdateViewer($(item).find(".xanaxviewer_refresh"), myInfo).then(() => {
			if (counter < toBeRefreshed.length - 1) {
				StartRefreshing(toBeRefreshed, counter + 1, myInfo);
			}
		});
	}

	function XanaxViewerLog(data) {
		console.log("XanaxViewer: " + data);
	}

	function GetUserStats(uid) {
		let apiKey = localStorage.getItem(`xanaxviewer_apikey`) || '';

		if (apiKey == '') return;

		return new Promise(resolve => {
			$.get(`https://api.torn.com/user/${uid}?selections=personalstats&key=${apiKey}&comment=xanaxviewer`, function(data, status) {
				// XanaxViewerLog("Xanax Usage: " + data["personalstats"]["xantaken"]);

				let cache = GetXanaxViewerCache();

				cache[uid] = {
					"xantaken": data["personalstats"]["xantaken"],
					"cantaken": data["personalstats"]["xantaken"],
					"lsdtaken": data["personalstats"]["lsdtaken"],
					"refills": data["personalstats"]["refills"],
					"updated": Date.now()
				}

				localStorage.setItem(`xanaxviewer_cache`, JSON.stringify(cache));

				return resolve(data["personalstats"]);
			});
		});
	}

	function GetXanaxViewerCache() {
		let cache = localStorage.getItem(`xanaxviewer_cache`);

		if (cache) {
			cache = JSON.parse(cache);
		} else {
			cache = {};
		}

		return cache;
	}

	function UpdateViewer(element, myInfo) {
		var uid = $(element).parent().parent().find("a").eq(1);
		uid = uid.attr('href').split("=").slice(-1);

		XanaxViewerLog(myInfo.personalstats.xantaken);

		return new Promise(resolve => {
			GetUserStats(uid).then((stats) => {
				let xantaken = showRelative ? stats.xantaken - myInfo.personalstats.xantaken : stats.xantaken;
				$(element).html(`${xantaken}`);

				return resolve();
			});
		});
	}

	/* HELPERS */
	function GetPageName() {
		var path = window.location.pathname;
		var page = path.split("/").pop();

		return page;
	}

	function waitForElementToExist(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}

			const observer = new MutationObserver(() => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				}
			});

			observer.observe(document.body, {
				subtree: true,
				childList: true,
			});
		});
	}

	// Style
	function delay(time) {
		return new Promise(resolve => setTimeout(resolve, time));
	}

	function GM_addStyle(css) {
		const style = document.getElementById("GM_addStyleBy8626") || (function() {
			const style = document.createElement('style');
			style.type = 'text/css';
			style.id = "GM_addStyleBy8626";
			document.head.appendChild(style);
			return style;
		})();
		const sheet = style.sheet;
		sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
	}

	GM_addStyle(".xanaxviewer_header { width:6%; }");
	GM_addStyle(".xanaxviewer-profile { float: right; padding-right: 10px; color: red; }");
	GM_addStyle("#xanaxviewer_autolimit_slider { width: 20em; }");
	GM_addStyle(".member-icons { width: 25% !important; }");
	GM_addStyle(".xanaxviewer_container { margin-top: 10px; display: flex; flex-direction: column; box-sizing: border-box; }");
	GM_addStyle(".xanaxviewer_head { background: black; padding: 2px; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px; border-bottom: none; }");
	GM_addStyle(".xanaxviewer_title { color: var(--re-title-color); text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px; }");
	GM_addStyle(".xanaxviewer_content { background-color: grey; padding: 1em 2em; color: white; }");
	GM_addStyle("#xanaxviewer_storage_counter, #xanaxviewer_deleteall_btn { color: yellow; }");
	GM_addStyle("#xanaxviewer_deleteall_btn:hover { text-decoration: underline; }");
})();