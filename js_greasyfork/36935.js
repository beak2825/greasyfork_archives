// ==UserScript==
// @name        Absolute Power Tool
// @description Display all of your Absolute Power tasks in a single table view.
// @include     https://wf.my.com/absolutepower/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/moment@2.18.1/min/moment-with-locales.min.js
// @version     5
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @namespace https://greasyfork.org/users/165232
// @downloadURL https://update.greasyfork.org/scripts/36935/Absolute%20Power%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/36935/Absolute%20Power%20Tool.meta.js
// ==/UserScript==

// mess.
// if ( you are a JS developer ) { i warned you }

var gmPopupVisible = GM_getValue("gmAPPopupVisible", true);
var autoSyncTimer = false;
moment.locale(window.navigator.userLanguage || window.navigator.language);

$("body").append('                                                          \
	<div id="gmPopupButton">                                                  \
	<form>                                                                  \
	<button id="gmCloseDlgBtn" type="button">Show/Hide all tasks</button> \
	<button id="gmReloadBtn" type="button">Reload page</button> \
	</form>                                                                 \
	</div>                                                                    \
	\
	<div id="gmPopupContainer">                                               \
	<p id="gmPopupTasks">&nbsp;</p>                                         \
	</div>                                                                    \
	');

GM_addStyle("                                                 \
	#gmPopupContainer {                                         \
	position:               absolute;                          \
	top:                    90px;                           \
	left:                   370px;                          \
	padding:                5px;                            \
	overflow-x:hidden;                                      \
	overflow-y:visible;                                     \
	background: rgba(8, 32, 30, 0.9) url('https://wf.cdn.gmru.net/minigames/battlepass_v3/static/wf/build/interfaces/images/elements/dots_pattern.png') repeat scroll 0px 0px; \
	border: 1px solid rgba(80, 252, 245, 0.5);              \
	border-radius: 5px;                                     \
	z-index:                3;                              \
	}                                                           \
	#gmPopupButton {                                            \
	position:               absolute;                          \
	top:                    35px;                           \
	left:                   370px;                          \
	width: 295px;                                           \
	height: 50px;                                           \
	padding:                2px;                            \
	background: rgba(8, 32, 30, 0.5) url('https://wf.cdn.gmru.net/minigames/battlepass_v3/static/wf/build/interfaces/images/elements/dots_pattern.png') repeat scroll 0px 0px; \
	border: 1px solid rgba(80, 252, 245, 0.5);              \
	border-radius: 5px;                                     \
	z-index:                3;                              \
	}                                                           \
	#gmPopupButton button{                                      \
	cursor:                 pointer;                        \
	margin:                 6px 6px 0;                      \
	border:                 1px outset buttonface;          \
	width: 130px; \
	height: 32px;\
	}                                                           \
    .w3-container,.w3-panel{padding:0.01em 16px}.w3-panel{margin-top:16px;margin-bottom:16px}\
    .w3-light-grey,.w3-hover-light-grey:hover,.w3-light-gray,.w3-hover-light-gray:hover{color:#000!important;background-color:#aaaaaa!important}\
    .w3-tiny{font-size:9px!important}.w3-small{font-size:12px!important}.w3-medium{font-size:15px!important}.w3-large{font-size:18px!important}\
    .w3-green,.w3-hover-green:hover{color:#fff!important;background-color:#ccff33!important}");

function getTaskDifficulty(t) {

	if (t.difficulty == 'easy') {
		return 0;
	} else if (t.difficulty == 'normal') {
		return 1;
	} else if (t.difficulty == 'hard') {
		return 2;
	} else if (t.difficulty == 'impossible') {
		return 3;
	} else if (t.difficulty == 'universal') {
		return 4;
	} else if (t.difficulty == 'class') {
		return 5;
	} else if (t.difficulty == 'elite') {
		return 6;
	}

	return 0;
}

function getTaskStateSortable(t) {

	if (t.state == 'wait') {
		return 0;
	} else if (t.state == 'failed') {
		return 1;
	} else if (t.state == 'success') {
		return 2;
	} else if (t.state == 'progress') {
		return 3;
	} else if (t.state == 'new') {
		return 4;
	} else if (t.state == 'completed') {
		return 5;
	}

	return 0;
}

function getTaskStateDisplay(t) {
	switch (t) {
	case 0:
		return "Claim reward";
	case 1:
		return "Failed";
	case 2:
		return "Succeeded";
	case 3:
		return "In progress";
	case 4:
		return "Available";
	case 5:
		return "Completed";
	case 6:
		return "Check result";
	}

	return "";
}

function getTaskPercentProgress(t) {
	if (t.target_count > 0) {
		var percent_progress = Math.ceil(t.progress / t.target_count * 100);
		if (percent_progress > 100)
			percent_progress = 100;
		return percent_progress;
	}

	return 0;
}

function sortTasks(a, b) {

	var leftState = getTaskStateSortable(a);
	var rightState = getTaskStateSortable(b);

	var sort_res = 0;
	if (leftState < rightState) {
		sort_res = -1;
	} else if (leftState > rightState) {
		sort_res = 1;
	}
	if (sort_res === 0) {
		var leftDiff = getTaskDifficulty(a);
		var rightDiff = getTaskDifficulty(b);

		if (leftDiff < rightDiff) {
			sort_res = -1;
		} else if (leftDiff > rightDiff) {
			sort_res = 1;
		}
	}
	if (sort_res === 0) {
		var leftProgress = getTaskPercentProgress(a);
		var rightProgress = getTaskPercentProgress(b);

		if (rightProgress < leftProgress) {
			sort_res = -1;
		} else if (rightProgress > leftProgress) {
			sort_res = 1;
		}
	}

	return sort_res;
}

function getRewardValue(t) {
	switch (t) {
	case "bp_inventory":
		return 2;
	case "bp_points":
		return 1;
	case "bp_chest":
		return 0;
	}
	return 0;
}

function getRewardDuration(r) {
	var s = r.duration + " ";
	if (!r.duration) {
		return "";
	}
	switch (r.duration_type) {
	case "day":
		s += " day(s)";
		break;
	case "hour":
		s += " hour(s)";
		break;
	}
	return s;
}

function updatePopupSize() {
	$("#gmPopupContainer").width($(window).width() - 745 + "px");
	$("#gmPopupContainer").height($(window).height() - 115 + "px");
}

function updatePopupList() {

	updatePopupSize();
	var vapp_info = window.eval('app_info;');
	if (vapp_info !== null) {
		if (gmPopupVisible) {
			$("#gmPopupContainer").show();
		} else {
			$("#gmPopupContainer").hide();
		}
		$("#gmPopupButton").show();

		var html_tasks_begin = "\
			<style type='text/css'>\
			.tg  {border-collapse:collapse;border-spacing:0; -webkit-user-select: initial!important; -moz-user-select: initial!important; -ms-user-select: initial!important; -o-user-select: initial!important; user-select:initial!important;}\
			.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}\
			.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:bold;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}\
			.tg .tg-016x{color:#ffffff;}\
			.popup-task-url{text-decoration: none;}\
			.tg-class-icon{font-family:wf-battlepass-v3!important; font-style: normal!important; font-weight: 400!important; font-variant: normal!important; text-transform: none!important; font-size: 32px;color: #d3d3d3;}\
			.progress-bg {position: absolute; left: 0; top: 0; bottom: 0; background-color: #8ef; z-index: -1;}\
			.tg .tg-claim{color:#ffffff; background: rgba(80, 80, 0, 0.7);}\
			.tg .tg-progress{color:#ffffff; background: rgba(0, 0, 30, 0.7);}\
			.tg .tg-available{color:#ffffff; background: rgba(30, 30, 30, 0.7);}\
			.tg .tg-completed{color:#ffffff; background: rgba(0, 40, 0, 0.7);}\
			</style>\
			<table class='tg'>\
			<tr>\
			<th class='tg-016x' style='width: 95px;'>State</th>\
			<th class='tg-016x' style='width: 160px;'>Title</th>\
			<th class='tg-016x' style='width: 60px; '>Diff.</th>\
			<th class='tg-016x' style='width: 115px;'>Region</th>\
			<th class='tg-016x' style='width: 160px;'>Progress</th>\
			<th class='tg-016x' style='width: 305px;'>Description</th>\
			<th class='tg-016x' style='width: 270px;'>Reward / interesting items</th>\
			</tr>";
		var html_tasks_in = "";
		var html_tasks_end = "</table>";

		bonus_chests = {
			1: "Combat gear crate",
			2: "Weapon skin crate"
		};

		var user_tasks = vapp_info.userTasks.slice();
		user_tasks.sort(sortTasks);
		user_tasks.forEach(
			function (task) {
			var task_state = getTaskStateSortable(task);
			if (((task.difficulty == 'universal') || (task.difficulty == 'class') || (task.difficulty == 'elite')) && (task.percent_progress == 100) && (task.state == 'progress'))
				task_state = 6;
			html_tasks_in += "<tr class='" + ((task_state <= 2 || task_state == 6) ? " tg-claim" : "") + ((task_state == 3) ? " tg-progress" : "") + ((task_state == 4) ? " tg-available" : "") + ((task_state == 5) ? " tg-completed" : "") + "'>";
			html_tasks_in += "<td class='tg-016x'>" + getTaskStateDisplay(task_state) + "</td>";
			html_tasks_in += "<td class='tg-016x'><a href='#' class='popup-task-url' data-type='" + task.type + "' task='" + task.task_id + "'>" + task.title + "</a></td>";

			var task_icon_str = "";
			var task_diff_friendly = "";
			switch (task.difficulty) {
			case "easy":
				task_icon_str = "\x64";
				task_diff_friendly = "Easy";
				break;
			case "normal":
				task_icon_str = "\x65";
				task_diff_friendly = "Normal";
				break;
			case "hard":
				task_icon_str = "\x66";
				task_diff_friendly = "Hard";
				break;
			case "impossible":
				task_icon_str = "\x6a";
				task_diff_friendly = "Nightmare";
				break;
			case "universal":
				task_diff_friendly = "Universal";
				task_icon_str = "\x71";
				break;
			case "class":
				switch (task.property.class) {
				case "medic":
					task_icon_str = "\x6e";
					task_diff_friendly = "Medic";
					break;
				case "rifleman":
					task_icon_str = "\x6f";
					task_diff_friendly = "Rifleman";
					break;
				case "engineer":
					task_icon_str = "\x6d";
					task_diff_friendly = "Engineer";
					break;
				case "sniper":
					task_icon_str = "\x70";
					task_diff_friendly = "Sniper";
					break;
				}
				break;
			case "elite":
				task_icon_str = "\x6c";
				task_diff_friendly = "Elite";
				break;
			}
			html_tasks_in += "<td class='tg-016x' style='text-align: center;'><span title='" + task_diff_friendly + "' class='tg-class-icon'>" + task_icon_str + "</span></td>";
			var task_region_friendly = "";
			switch (task.region) {
			case "africa":
				task_region_friendly = "Africa";
				break;
			case "eurasia":
				task_region_friendly = "Eurasia";
				break;
			case "north_america":
				task_region_friendly = "North America";
				break;
			case "south_america":
				task_region_friendly = "South America";
				break;
			}
			html_tasks_in += "<td class='tg-016x'>" + task_region_friendly + "</td>";
			if ((task.difficulty == 'universal') || (task.difficulty == 'class') || (task.difficulty == 'elite')) {
				if (task.state == 'progress') {
					var dateString = (task.end_at > 1500000000) ? moment.unix(task.end_at).calendar() : "";
					html_tasks_in += "<td class='tg-016x' style='position: relative;'><div class='progress-bg' style='width: " + task.percent_progress + "%'></div><span>" + dateString + " (" + task.percent_progress + "%)</span></td>";
				} else {
					html_tasks_in += "<td class='tg-016x'></td>";
				}
			} else {
				var percent_progress = getTaskPercentProgress(task);
				var percent_progress_bg = percent_progress;
				var task_progress = task.progress;
				if (task_progress > task.target_count)
					task_progress = task.target_count;
				if (task.state == 'completed')
					percent_progress_bg = 0;
				html_tasks_in += "<td class='tg-016x' style='position: relative;'><div class='progress-bg' style='width: " + percent_progress_bg + "%'></div>" + task_progress + "/" + task.target_count + ((task.state == 'progress') ? " (" + percent_progress + "%)" : "") + "</td>";
			}
			html_tasks_in += "<td class='tg-016x'>" + ((task.descr !== null) ? task.descr : "") + "</td>";

			var html_rewards = "";
			if ((task.difficulty == 'universal') || (task.difficulty == 'class') || (task.difficulty == 'elite')) {
				var tasks_rewards = task.rewards.slice();
				tasks_rewards.sort(function (a, b) {
					var sort_res = 0;
					sort_res = (a.prize.value.permanent === b.prize.value.permanent) ? 0 : a.prize.value.permanent ? -1 : 1;
					if (sort_res === 0) {
						var leftVal = getRewardValue(a.prize.type);
						var rightVal = getRewardValue(b.prize.type);

						if (leftVal < rightVal)
							return -1;
						if (leftVal > rightVal)
							return 1;
						return 0;
					}
					return sort_res;
				});
				tasks_rewards.forEach(function (s) {
					switch (s.prize.type) {
					case "bp_inventory":
						if ((s.prize.value.permanent) || (s.prize.value.achievement) || (s.prize.value.consumable) || (s.prize.value.regular) || (s.title.includes("Gold")) || (s.title.includes("Absolute"))) {
							html_rewards += "<span " + ((s.prize.value.permanent || s.prize.value.regular) ? "style='font-weight:bold;'" : "") + ">";
							html_rewards += s.title + " ";
							html_rewards += getRewardDuration(s.prize.value);
							html_rewards += "</span><br/>";
						}
						break;
					case "bp_points":
						html_rewards += "<span>" + s.prize.value + " Battle points" + "</span><br/>";
						break;
					case "bp_chest":
						html_rewards += "<span style='font-weight:bold;'>" + bonus_chests[s.prize.value.chest_id] + "</span><br/>";
						break;
					}
				});
			} else {
				var t = task.rewards[0];
				var a = t.item;
				var item_title = t.title;

				if (a.consumable) {
					item_title = a.count + "x " + item_title;
				} else if (a.duration) {
					item_title += " " + getRewardDuration(a);
				}

				html_rewards += "<span " + ((a.permanent) ? "style='font-weight:bold;'" : "") + ">";
				html_rewards += item_title;
				html_rewards += "</span><br/>";
			}

			html_tasks_in += "<td class='tg-016x'>" + html_rewards + "</td></tr>";
		});
		var inner = html_tasks_begin + html_tasks_in + html_tasks_end;
		$("#gmPopupTasks").html(inner);
		$(".popup-task-url").click(function () {
			window.eval("var e = null; app_info.userTasks.forEach(function (task) { if(task.task_id == " + $(this).attr('task') + ") { e = task; } });  switch (e.type) { case \"in_game\": riot.mount(\"gametask\", { task: e }); break; case \"troops\": app_info[\"squad_mission\"] = e; riot.mount(\"screen\", { page: \"inner\", screen: \"squad_mission\" }); break }");
		});
		$(".squad__pvp__init").css("right", "130px");
		$(".squad__pvp__init").css("z-index", "101");

        var user_lvl = vapp_info.user.level;
        if(user_lvl < 100) {
            var xp_current_lvl = vapp_info.exp_levels[user_lvl];

            var percent_progress = Math.ceil((vapp_info.user.exp - xp_current_lvl) / (vapp_info.exp_levels[user_lvl+1] - xp_current_lvl) * 100);
            if (percent_progress > 100)
                percent_progress = 100;
            $("dl.user__stats span:first-child").css("top", "-10px");
            $("dl.user__stats span:first-child").children("dt").html("level <div class=\"w3-light-grey w3-tiny\" style=\"height: 4px;\"><div class=\"w3-container w3-green\" style=\"padding-left: 0px; padding-right: 0px; height: 4px; width:"+percent_progress+"%\"></div></div>");
        }		
		
		if (!autoSyncTimer) {
			setInterval(function () {
				updatePopupList();
			}, 2500);
			autoSyncTimer = true;
		}
	}

	return (vapp_info !== null);
}

function waitForElementToDisplay(selector, time) {
	if (document.querySelector(selector) !== null) {
		if (!updatePopupList()) {
			setTimeout(function () {
				waitForElementToDisplay(selector, time);
			}, time);
		}
		return;
	} else {
		setTimeout(function () {
			waitForElementToDisplay(selector, time);
		}, time);
	}
}

$("#gmCloseDlgBtn").click(function () {
	if (gmPopupVisible) {
		$("#gmPopupContainer").hide();
		gmPopupVisible = false;
	} else {
		$("#gmPopupContainer").show();
		gmPopupVisible = true;
	}
	GM_setValue("gmAPPopupVisible", gmPopupVisible);
});

$("#gmReloadBtn").click(function () {
	location.reload();
});

$("#gmPopupContainer").hide();
$("#gmPopupButton").hide();
waitForElementToDisplay(".user__info", 500);

$(window).on('resize', function () {
	updatePopupSize();
});
