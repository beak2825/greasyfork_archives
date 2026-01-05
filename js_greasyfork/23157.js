// ==UserScript==
// @name         Harpocrates
// @namespace    mobiusevalon.tibbius.com
// @version      1.0-7
// @author       Mobius Evalon
// @description  Helps the Olympian scripts when they need GreaseMonkey functions
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @include      /^https{0,1}:\/\/\w{0,}\.?mturk\.com.+/
// @include      /^https{0,1}:\/\/\w*\.amazon\.com\/ap\/signin.*(?:openid\.assoc_handle|pf_rd_i)=amzn_mturk/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/23157/Harpocrates.user.js
// @updateURL https://update.greasyfork.org/scripts/23157/Harpocrates.meta.js
// ==/UserScript==

// use of unsafeWindow is necessary to get harpocrates into the un-sandboxed
// space with the rest of the olympian scripts
if(unsafeWindow.olympus === undefined) unsafeWindow.olympus = {};

unsafeWindow.olympus.harpocrates = {
	__name:"harpocrates",
	__version:"1.0-7",
	__href:"https://greasyfork.org/en/scripts/23157-harpocrates",
	__12_hrs:43200000,
	__stamp:function() {
		var s = (localStorage.harpocrates_login_timestamp*1);
		if($.type(s) === "number") return s;
		else return 0;
	},
	__init:function() {
		console.log("harpocrates init");
		if(/^https{0,1}:\/\/\w{0,}\.amazon\.com\/ap\/signin/i.test(window.location.href)) {
			$("#signInSubmit-input").click(function() {
				GM_setValue("login_timestamp",Date.now());
				GM_setValue("new_login","true");
			});
		}
		else {
			olympus.style.add(
				".red {color: #f00;}"+
				"#harpocrates_logout_time {margin-right: 4px;}"
			);
			if(GM_getValue("new_login","false") === "true") {
				localStorage.harpocrates_login_timestamp = GM_getValue("login_timestamp",0);
				GM_setValue("new_login","false");
			}
			$("span.header_links").append(
				$("<br/>"),
				$("<b/>")
					.attr({
						"id":"harpocrates_logout_time",
						"title":("You logged into Mechanical Turk on "+olympus.utilities.datetime.output(this.__stamp(),"d M \\a\\t H:i")+".\n\n"+
								 "The cookie for Mechanical Turk expires after 12 hours, which means you will be required to login again when this timer reaches zero.")
					})
			);
			this.update();
		}
	},
	update:function() {
		var stamp = olympus.harpocrates.__stamp();
		if(stamp > 0) {
			var time_left = ((olympus.harpocrates.__12_hrs-(Date.now()-stamp))/1000);
			$("#harpocrates_logout_time")
				.attr("class",((time_left <= 3600 ? " red" : "")+(time_left <= 1800 ? " anim_pulse" : "")))
				.text("Time to logout: "+(time_left <= 300 ? "any moment" : olympus.utilities.dhms(time_left)));
		}
		else $("#harpocrates_logout_time")
			.removeClass("red anim_pulse")
			.attr("title","")
			.text("");
		setTimeout(olympus.harpocrates.update,60000);
	}
};