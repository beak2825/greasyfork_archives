// ==UserScript==
// @name         TMVN Match Event(CN Beta)
// @version      9.2024062801
// @description  Trophymanager: show main events of the match. So you can easy research tactics of other clubs and your tactics rules happened as expected or not.
// @namespace    https://trophymanager.com
// @include      *trophymanager.com/matches/*
// @downloadURL https://update.greasyfork.org/scripts/439866/TMVN%20Match%20Event%28CN%20Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439866/TMVN%20Match%20Event%28CN%20Beta%29.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const MENTALITY_MAP = new Map()
		.set("1", "重视防守")
		.set("2", "防守")
		.set("3", "略偏防守")
		.set("4", "正常")
		.set("5", "略偏进攻")
		.set("6", "进攻")
		.set("7", "重视进攻");

	const STYLE_MAP = new Map()
		.set("1", "平衡")
		.set("2", "直接/反击")
		.set("3", "边路突破")
		.set("4", "短传渗透")
		.set("5", "长传冲吊")
		.set("6", "直传身后");

	const GOAL_STYLE_MAP = new Map()
		.set("p_s", "点球")
		.set("kco", "门将手抛反击")
		.set("klo", "门将大脚反击")
		.set("doe", "角球")
		.set("cou", "直接/反击")
		.set("dir", "任意球")
		.set("win", "边路突破")
		.set("sho", "短传渗透")
		.set("lon", "长传冲吊")
		.set("thr", "直传身后");

	const FOCUS_MAP = new Map()
		.set("1", "平衡")
		.set("2", "左路")
		.set("3", "中路")
		.set("4", "右路");

	const INGJURY_MAP = new Map()
		.set("虽然问题不大，但他这场比赛估计是上不了了。", "1")
		.set("从队医的面部表情来看似乎问题不严重。", "2")
		.set("他在队医搀扶下一瘸一拐的走下了球场。", "3")
		.set("他可能要在场边休息一段时间了。", "4")
		.set("恐怕要为这次受伤增加伤停补时时间了。", "5")
		.set("看起来情形不太妙啊？", "6")
		.set("伤情显然不容乐观，裁判向场外示意担架进场！", "7")
        .set("好像蛮严重的，看来这场比赛他无法在上场了。", "8")
		.set("队医示意救护车入场，糟糕了，他直接被送去医院了。", "9")
		.set("他表情异常痛苦~天哪~不会有后遗症吧~", "10");


	const EVENT_TYPE = {
		GOAL: 'goal',
		RED_CARD: 'red card',
        YELLOW_CARD: 'yellow card',
		MENTALITY: 'mentality',
		STYLE: 'style',
		POSITION: 'position',
		SUBTITION: 'subtition',
		INJURY: 'injury'
	}

	var mainEventHTML = "";

	var matchUrl = location.href.split('/');
	var matchId,
	url;
	if (isNaN(matchUrl[4])) {
		matchId = matchUrl[5];
		url = 'https://trophymanager.com/ajax/match.ajax.php?id=nt' + matchId;
	} else {
		matchId = matchUrl[4];
		url = 'https://trophymanager.com/ajax/match.ajax.php?id=' + matchId;
	}

	var xhr = new XMLHttpRequest();
	var homeStartStyle,
	homeStartMentality,
	homeFocus,
	awayStartStyle,
	awayStartMentality,
	awayFocus;

	xhr.open('GET', url, true);
	xhr.send();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText);

			var report = data.report;
			if (Object.keys(report).length <= 3) {
				return; //because don't have datas of match
			}

			homeStartStyle = data.match_data.attacking_style.home;
			if (homeStartStyle == "0") {
				homeStartStyle = "1"; //bug of TM
			}
			awayStartStyle = data.match_data.attacking_style.away;
			if (awayStartStyle == "0") {
				awayStartStyle = "1"; //bug of TM
			}
			homeStartMentality = data.match_data.mentality.home.toString();
			awayStartMentality = data.match_data.mentality.away.toString();
			homeFocus = data.match_data.focus_side.home;
			awayFocus = data.match_data.focus_side.away;

			var homeClubId = data.club.home.id;
			var awayClubId = data.club.away.id;

			var homeLineup = data.lineup.home;
			var awayLineup = data.lineup.away;
			var homePlayerIds = Object.getOwnPropertyNames(homeLineup);
			var awayPlayerIds = Object.getOwnPropertyNames(awayLineup);
			var homePlayer = new Map(),
			awayPlayer = new Map();
			homePlayerIds.forEach((playerId) => {
				homePlayer.set(playerId, homeLineup[playerId].name);
			});
			awayPlayerIds.forEach((playerId) => {
				awayPlayer.set(playerId, awayLineup[playerId].name);
			});

			var homeGoal = 0,
			awayGoal = 0;
			var eventReport = [];
			Object.keys(report).forEach(function (key, index) {
				var minuteArr = report[key];
				for (var i = 0; i < minuteArr.length; i++) {
					var paramArr = minuteArr[i].parameters;
					if (paramArr) {
						for (var j = 0; j < paramArr.length; j++) {
							var paramObj = paramArr[j];
							if (paramObj.goal) {
								if (homePlayer.has(paramObj.goal.player)) {
									homeGoal++;
									let goalStyle = "";
									let chanceType = minuteArr[i].type;
									if (chanceType) {
										chanceType = chanceType.substring(0, 3);
										if (GOAL_STYLE_MAP.has(chanceType)) {
											goalStyle = GOAL_STYLE_MAP.get(chanceType);
										}
									}

									eventReport.push({
										minute: key,
										type: EVENT_TYPE.GOAL,
										home: true,
										content: "[进球] " +
										homePlayer.get(paramObj.goal.player) +
										(paramObj.goal.assist ? " (" + homePlayer.get(paramObj.goal.assist) + ") " : " ") +
										(goalStyle != "" ? " [" + goalStyle + "] " : " ") +
										paramObj.goal.score[0] + " - " + paramObj.goal.score[1]
									});
								} else {
									awayGoal++;
									let goalStyle = "";
									let chanceType = minuteArr[i].type;
									if (chanceType) {
										chanceType = chanceType.substring(0, 3);
										if (GOAL_STYLE_MAP.has(chanceType)) {
											goalStyle = GOAL_STYLE_MAP.get(chanceType);
										}
									}

									eventReport.push({
										minute: key,
										type: EVENT_TYPE.GOAL,
										home: false,
										content: "[进球] " +
										awayPlayer.get(paramObj.goal.player) +
										(paramObj.goal.assist ? " (" + awayPlayer.get(paramObj.goal.assist) + ") " : " ") +
										(goalStyle != "" ? " [" + goalStyle + "] " : " ") +
										paramObj.goal.score[0] + " - " + paramObj.goal.score[1]
									});
								}
                            } else if (paramObj.yellow) {
								if (homePlayer.has(paramObj.yellow)) {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.YELLOW_CARD,
										home: true,
										content: "[黄牌] " +
										homePlayer.get(paramObj.yellow)
									});
								} else {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.YELLOW_CARD,
										home: false,
										content: "[黄牌] " +
										awayPlayer.get(paramObj.yellow)
									});
								}
							} else if (paramObj.red) {
								if (homePlayer.has(paramObj.red)) {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.RED_CARD,
										home: true,
										content: "[红牌] " +
										homePlayer.get(paramObj.red)
									});
								} else {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.RED_CARD,
										home: false,
										content: "[红牌] " +
										awayPlayer.get(paramObj.red)
									});
								}
							} else if (paramObj.yellow_red) {
								if (homePlayer.has(paramObj.yellow_red)) {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.RED_CARD,
										home: true,
										content: "[红牌(两黄)]" +
										homePlayer.get(paramObj.yellow_red)
									});
								} else {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.RED_CARD,
										home: false,
										content: "[红牌(两黄)]" +
										awayPlayer.get(paramObj.yellow_red)
									});
								}
							} else if (paramObj.mentality_change) {
								if (paramObj.mentality_change.mentality) {
									if (paramObj.mentality_change.team == homeClubId) {
										eventReport.push({
											minute: key,
											type: EVENT_TYPE.MENTALITY,
											home: true,
											content: "[心态调整] 心态调整为 " + MENTALITY_MAP.get(paramObj.mentality_change.mentality)
										});
									} else {
										eventReport.push({
											minute: key,
											type: EVENT_TYPE.MENTALITY,
											home: false,
											content: "[心态调整] 心态调整为 " + MENTALITY_MAP.get(paramObj.mentality_change.mentality)
										});
									}
								} else if (paramObj.mentality_change.style) {
									if (paramObj.mentality_change.team == homeClubId) {
										eventReport.push({
											minute: key,
											type: EVENT_TYPE.STYLE,
											home: true,
											content: "[战术调整] 进攻方式调整为 " + STYLE_MAP.get(paramObj.mentality_change.style)
										});
									} else {
										eventReport.push({
											minute: key,
											type: EVENT_TYPE.STYLE,
											home: false,
											content: "[战术调整] 进攻方式调整为 " + STYLE_MAP.get(paramObj.mentality_change.style)
										});
									}
								}
							} else if (paramObj.player_change) {
								if (homePlayer.has(paramObj.player_change.player)) {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.POSITION,
										home: true,
										content: "[位置调整] " + homePlayer.get(paramObj.player_change.player) + " 调整至 " + (paramObj.player_change.position !== undefined ? paramObj.player_change.position.toUpperCase() : "")
									});
								} else {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.POSITION,
										home: false,
										content: "[位置调整] " + awayPlayer.get(paramObj.player_change.player) + " 调整至 " + (paramObj.player_change.position !== undefined ? paramObj.player_change.position.toUpperCase() : "")
									});
								}
							} else if (paramObj.sub && paramObj.sub.player_in && paramObj.sub.player_out) {
								if (homePlayer.has(paramObj.sub.player_in)) {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.SUBTITION,
										home: true,
										content: "[换人] " + homePlayer.get(paramObj.sub.player_in) + " 替换为 " + homePlayer.get(paramObj.sub.player_out) + (paramObj.sub.player_position !== undefined ? " , 位置为 " + paramObj.sub.player_position.toUpperCase() : "")
									});
								} else {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.SUBTITION,
										home: false,
										content: "[换人] " + awayPlayer.get(paramObj.sub.player_in) + " 替换为 " + awayPlayer.get(paramObj.sub.player_out) + (paramObj.sub.player_position !== undefined ? " , 位置为 " + paramObj.sub.player_position.toUpperCase() : "")
									});
								}
							} else if (paramObj.injury) {
								if (homePlayer.has(paramObj.injury)) {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.INJURY,
										home: true,
										content: "[受伤] " + homePlayer.get(paramObj.injury)+ " 受伤描述： " + minuteArr[i].chance.text[minuteArr[i].chance.text.length-2] + check_injury(minuteArr[i].chance.text)
									});
								} else {
									eventReport.push({
										minute: key,
										type: EVENT_TYPE.INJURY,
										home: false,
										content: "[受伤] " + awayPlayer.get(paramObj.injury)+ " 受伤描述： " + minuteArr[i].chance.text[minuteArr[i].chance.text.length-2] + check_injury(minuteArr[i].chance.text)
									});
								}
							}
						}
					}
				}
			});

			if (eventReport.length > 0) {
				mainEventHTML += '<li style="color:burlywood"><table><tbody><tr><td align="left">' +
				'0. 心态: ' + MENTALITY_MAP.get(homeStartMentality) +
				'. 进攻方式: ' + STYLE_MAP.get(homeStartStyle) +
				'. 重点方向: ' + FOCUS_MAP.get(homeFocus) +
				'</td><td align="right">' +
				'心态: ' + MENTALITY_MAP.get(awayStartMentality) +
				'. 进攻方式: ' + STYLE_MAP.get(awayStartStyle) +
				'. 重点方向: ' + FOCUS_MAP.get(awayFocus) +
				' .0' +
				'</td></tr></tbody></table></li>';
				eventReport.forEach((event) => {
					if (event.home) {
						let color;
						switch (event.type) {
						case EVENT_TYPE.GOAL:
							color = "style='color:Aqua;'";
							break;
						case EVENT_TYPE.RED_CARD:
							color = "style='color:Brown;'";
							break;
                        case EVENT_TYPE.YELLOW_CARD:
							color = "style='color:Yellow;'";
							break;
						case EVENT_TYPE.MENTALITY:
							color = "style='color:Orange;'";
							break;
						case EVENT_TYPE.STYLE:
							color = "style='color:Yellow;'";
							break;
						case EVENT_TYPE.POSITION:
							color = "style='color:GreenYellow;'";
							break;
						case EVENT_TYPE.INJURY:
							color = "style='color:Brown;'";
							break;
						default:
							color = "";
						}
						mainEventHTML +=
						"<li align='left' " + color + ">" +
						event.minute +
						". " +
						event.content +
						"</li>";
					} else {
						let color;
						switch (event.type) {
						case EVENT_TYPE.GOAL:
							color = "style='color:Aqua;'";
							break;
						case EVENT_TYPE.RED_CARD:
							color = "style='color:Brown;'";
							break;
                        case EVENT_TYPE.YELLOW_CARD:
							color = "style='color:Yellow;'";
							break;
						case EVENT_TYPE.MENTALITY:
							color = "style='color:Orange;'";
							break;
						case EVENT_TYPE.STYLE:
							color = "style='color:Yellow;'";
							break;
						case EVENT_TYPE.POSITION:
							color = "style='color:GreenYellow;'";
							break;
						case EVENT_TYPE.INJURY:
							color = "style='color:Brown;'";
							break;
						default:
							color = "";
						}
						mainEventHTML +=
						"<li align='right' " + color + ">" +
						event.content +
						" ." +
						event.minute +
						"</li>";
					}
				});
			}
		}
	}

	var myInterval = setInterval(display, 1000);
	var pause = false;
	function display() {
		if (mainEventHTML !== "" && $('.box_body.mv_bottom').length > 0) {
			if ($('.post_report').length > 0) {
				let divArea = $('div.half')[0];
				divArea.innerHTML =divArea.innerHTML+
					'<div class="mega_headline tcenter report_section_header dark_bg">主要事件</div><div><ul class="clean underlined large_padding">' +
					mainEventHTML +
					'</ul></div>'
					;
				clearInterval(myInterval);
			} else if (!pause) {
				let divArea = $('.content')[0];
				divArea.innerHTML =divArea.innerHTML+
					'<div class="mega_headline tcenter report_section_header dark_bg">主要事件</div><div><ul class="clean underlined large_padding">' +
					mainEventHTML +
					'</ul></div>'
					;
				pause = true;
			}
		}
	}

	function check_injury(injuryMessage) {
        for (const [key, value] of INGJURY_MAP) {
            for (const injurySign of injuryMessage) {
                if (injurySign.includes(key)) {
                    return " 受伤场次："+value;
                }
            }
        }
        return "";
    }
})();