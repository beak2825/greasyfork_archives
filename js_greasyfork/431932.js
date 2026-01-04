// ==UserScript==
// @name         TMVN Players Train (CN beta 暂时不兼容暴力猴)
// @namespace    https://trophymanager.com
// @version      3.2024061601
// @description  Trophymanager: color skills by training type, synthesize scout information, calculate skill peak. If you have B-Team, please bookmark & open url https://trophymanager.com/players/#/a/true/b/true/ to see all players in team.
// @match        *trophymanager.com/players/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431932/TMVN%20Players%20Train%20%28CN%20beta%20%E6%9A%82%E6%97%B6%E4%B8%8D%E5%85%BC%E5%AE%B9%E6%9A%B4%E5%8A%9B%E7%8C%B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431932/TMVN%20Players%20Train%20%28CN%20beta%20%E6%9A%82%E6%97%B6%E4%B8%8D%E5%85%BC%E5%AE%B9%E6%9A%B4%E5%8A%9B%E7%8C%B4%29.meta.js
// ==/UserScript==

var DISPLAY_COLOR = parseInt(localStorage.getItem('TRAIN_WISH_COLOR'));

function createTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = message;
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '3px';
    tooltip.style.zIndex = '1000';
    tooltip.style.visibility = 'hidden';
    document.body.appendChild(tooltip);
    return tooltip;
}

function addHoverTooltip(element, message) {
    const tooltip = createTooltip(message);

    element.onmouseover = function(event) {
        tooltip.style.left = event.pageX + 'px';
        tooltip.style.top = event.pageY + 'px';
        tooltip.style.visibility = 'visible';
    };

    element.onmouseout = function() {
        tooltip.style.visibility = 'hidden';
    };
}

function insertAfter(newElement,targetElement){
    var parent = targetElement.parentNode;
    if(parent.lastChild == targetElement){
        parent.appendChild(newElement);
    }else{
        parent.insertBefore(newElement,targetElement.nextsibling);
    }
}

(function() {
    'use strict';
    console.log(DISPLAY_COLOR);
    const switchButton = document.createElement('a');
    const playerCountElement = document.querySelector('#player_count').parentElement;
    if (playerCountElement && playerCountElement.firstChild) {
        switchButton.textContent = (" 切换颜色(当前状态：" + (DISPLAY_COLOR === 0 ? "不显示颜色)" : "显示颜色)"));
        addHoverTooltip(switchButton, '黑色训练4 橘黄色训练3 黄色训练2 蓝绿色训练1 白色训练0');
        switchButton.href = '#';
        switchButton.addEventListener('click', function(event) {
            event.preventDefault(); // 阻止默认链接行为
            // 切换 LOCAL 的值
            if (DISPLAY_COLOR === 0) {
                DISPLAY_COLOR = 1;
            } else {
                DISPLAY_COLOR = 0;
            }
            console.log(DISPLAY_COLOR);
            localStorage.setItem('TRAIN_WISH_COLOR', DISPLAY_COLOR);
            // 重新加载

            location.reload();
        })
        insertAfter(switchButton, document.querySelector('#player_count').firstChild);
    }
})();


(function () {
	'use strict';

	const BUTTON_ID = {
		SCOUT: 'tmvn_player_train_script_scout_button',
		PEAK: 'tmvn_player_train_script_peak_button',
		RELIABLE: 'tmvn_player_train_script_reliable_button',
		SKILL: 'tmvn_player_train_script_skill_button'
	};
	const SKILL_PANEL_ID = 'sq';
	const ADDITION_PANEL_ID_PREFIX = 'tmvn_script_player_addition_panel'; //for get all addition panel in page (not only this script)
	const ADDITION_PANEL_ID = {
		SCOUT: 'tmvn_script_player_addition_panel_scout',
		PEAK: 'tmvn_script_player_addition_panel_peak',
		RELIABLE: 'tmvn_script_player_addition_panel_reliable'
	}

	const TRAIN_DOT_COLOR = ['white', 'aqua', 'yellow', 'orange', 'black']; //increasing from light to dark
	const TRAIN_DRILL_COLOR = 'blue';
	const TRAIN_DRILL = {
		TECHNICAL: '技术',
		FITNESS: '体能',
		TACTICAL: '战术',
		FINISHING: '射门',
		DEFENDING: '防守',
		WINGER: '边路',
		GOALKEEPING: '门将'
	};
	const TRAIN_DRILL_POINT = 100;
	const SKILL_COLUMN_INDEX = {
		STR: 4,
		STA: 5,
		PAC: 6,
		MAR: 7,
		TAC: 8,
		WOR: 9,
		POS: 10,
		PAS: 11,
		CRO: 12,
		TEC: 13,
		HEA: 14,
		FIN: 15,
		LON: 16,
		SET: 17
	}
	const SCOUT_RELIABLE_SKILL = {
		SENIORS: 20,
		YOUTHS: 20,
		DEVELOPMENT: 20,
		PHYSICAL: 20,
		TACTICAL: 20,
		TECHNICAL: 20,
		PSYCHOLOGY: 20
	};
	const PEAK_PHYSICAL_TEXT = {
		SPLENDID: ' - 出色的身体(4/4)',
		GOOD: ' - 良好的身体(3/4)',
		OK: ' - 一般的身体(2/4)',
		WEAK: ' - 较弱的身体(1/4)'
	}
	const PEAK_PHYSICAL_LEVEL = {
		SPLENDID: 4,
		GOOD: 3,
		OK: 2,
		WEAK: 1
	}
	const PEAK_TACTICAL_TEXT = {
		SPLENDID: ' - 出色的战术能力(4/4)',
		GOOD: ' - 良好的战术能力(3/4)',
		OK: ' - 一般的战术能力(2/4)',
		POOR: ' - 较弱的战术能力(1/4)'
	}
	const PEAK_TACTICAL_LEVEL = {
		SPLENDID: 4,
		GOOD: 3,
		OK: 2,
		POOR: 1
	}
	const PEAK_TECHNICAL_TEXT = {
		SPLENDID: ' - 出色的技术(4/4)',
		GOOD: ' - 良好的技术(3/4)',
		OK: ' - 一般的技术(2/4)',
		POOR: ' - 较弱的技术(1/4)'
	}
	const PEAK_TECHNICAL_LEVEL = {
		SPLENDID: 4,
		GOOD: 3,
		OK: 2,
		POOR: 1
	}

	const OUTFIELD_PEAK_PHYSICAL_SKILL_SUM = [44, 56, 68, 80];
	const OUTFIELD_PEAK_TACTICAL_SKILL_SUM = [44, 56, 68, 80];
	const OUTFIELD_PEAK_TECHNICAL_SKILL_SUM = [66, 84, 102, 120];
	const GK_PEAK_PHYSICAL_SKILL_SUM = [44, 56, 68, 80];
	const GK_PEAK_TACTICAL_SKILL_SUM = [44, 56, 68];
	const GK_PEAK_TECHNICAL_SKILL_SUM = [66, 84, 0];

	const OUTFIELD_SPECIALITY = ['', '力量', '耐力', '速度', '盯人', '抢断', '工投', '站位', '传球', '传中', '技术', '头球', '射门', '远射', '定位球'];
	const OUTFIELD_SPECIALITY_PHYSICAL_INDEX = [1, 2, 3, 11];
	const OUTFIELD_SPECIALITY_TACTICAL_INDEX = [4, 5, 6, 7];
	const OUTFIELD_SPECIALITY_TECHNICAL_INDEX = [8, 9, 10, 12, 13, 14];

	const GK_SPECIALITY = ['', '力量', '耐力', '速度', '接球', '一对一', '反应', '制空', '跳跃', '沟通', '大脚', '手抛球'];
	const GK_SPECIALITY_PHYSICAL_INDEX = [1, 2, 3, 8];
	const GK_SPECIALITY_TACTICAL_INDEX = [5, 7, 9];
	const GK_SPECIALITY_TECHNICAL_INDEX = [4, 6, 10, 11];

	const SCOUT_TABLE_BODY_ID = 'tmvn_script_scout_table_body';
	const PEAK_TABLE_BODY_ID = 'tmvn_script_peak_table_body';

	const LOCAL_STORAGE_KEY_VALUE = 'TMVN_SCRIPT_PLAYER_TRAIN_RELIABLE_INFO';
	const GK_POSITION_TO_CHECK = 'Gk';

	const SCOUT_LEVEL_COLOR = ['White', 'Aqua', 'Blue', 'Yellow', 'Black', 'Darkred'];
	const PERCENT_PEAK_COLOR = ['White', 'Aqua', 'Blue', 'Yellow', 'Black', 'Darkred'];

	const SCOUT_TABLE_TITLE = {
		PHYSICAL: '身体评分 报告 : 4 个等级，越高越好',
		TACTICAL: '战术评分 报告 : 4 个等级，越高越好',
		TECHNICAL: '技术评分 报告 : 4 个等级，越高越好',
		LEADERSHIP: '领导力 报告: 20 个等级，越高越好',
		PROFESSIONALISM: '职业性 报告: 20 个等级，越高越好',
		AGGRESSION: '侵略性 报告: 20 个等级，越低越好',
		LAS: '最近一次球探报告的球员年龄',
		TI: 'TI'
	}
	const PEAK_TABLE_TITLE = {
		PHYSICAL_SUM: 'Outfield: Strength, Stamina, Pace, Heading\nGK: Strength, Stamina, Pace, Jumping',
		TACTICAL_SUM: 'Outfield: Marking, Tackling, Positioning, Workrate\nGK: One On Ones, Aerial Ability, Communication',
		TECHNICAL_SUM: 'Outfield: Passing, Crossing, Technique, Finishing, Longshots, Set Pieces\nGK: Handling, Reflexes, Kicking, Throwing',

		CUSTOM_TRAIN_TYPE: 'Team 1: Strength, Workrate, Stamina\nTeam 2: Marking, Tackling\nTeam 3: Crossing, Pace\nTeam 4: Passing, Technique, Set Pieces\nTeam 5: Heading, Positioning\nTeam 6: Finishing, Longshots',
		NORMAL_TRAIN_TYPE_TECHNICAL: 'Technical Drills: Technique, Passing, Set Pieces',
		NORMAL_TRAIN_TYPE_FITNESS: 'Fitness Drills: Strength, Stamina, Pace, Workrate',
		NORMAL_TRAIN_TYPE_TACTICAL: 'Tactical Drills: Workrate, Positioning, Passing',
		NORMAL_TRAIN_TYPE_FINISHING: 'Finishing Drills: Finish, Long shot, Heading',
		NORMAL_TRAIN_TYPE_DEFENDING: 'Defending Drills: Marking, Tackling, Positioning, Heading',
		NORMAL_TRAIN_TYPE_WINGER: 'Winger Drills: Crossing, Pace, Technique',

		PHYSICAL_PEAK: 'Maximum physical skill sum can reach',
		TACTICAL_PEAK: 'Maximum tactical skill sum can reach',
		TECHNICAL_PEAK: 'Maximum technical skill sum can reach'
	}

	const BLOOM_STATUS_TEXT = {
		IN_LATE_BLOOM: '处于快速成长的最后阶段',
		IN_MIDDLE_BLOOM: '处于快速成长的中间阶段',
		IN_START_BLOOM: '处于快速成长的初始阶段',
		NOT_YET_LATE_BLOOMER: '还未开始快速成长 - 晚熟',
		NOT_YET_NORMAL_BLOOMER: '还未开始快速成长: 正常成长',
		NOT_YET_EARLY_BLOOMER: '还未开始快速成长 - 早熟',
		BLOOMED: '快速成长已经结束',
        //简写表示
        IN_LATE_BLOOM_SHORT: '最后阶段',
		IN_MIDDLE_BLOOM_SHORT: '中间阶段',
		IN_START_BLOOM_SHORT: '初始阶段',
		NOT_YET_LATE_BLOOMER_SHORT: '晚熟',
		NOT_YET_NORMAL_BLOOMER_SHORT: '正常',
		NOT_YET_EARLY_BLOOMER_SHORT: '早熟',
		BLOOMED_SHORT: '已经结束'
	}
	const BLOOM_STATUS_COLOR = {
		IN_LATE_BLOOM: 'Darkred',
		IN_MIDDLE_BLOOM: 'Black',
		IN_START_BLOOM: 'Orange',
		NOT_YET_BLOOM: 'Yellow',
		NOT_YET_LATE_BLOOMER: 'Blue',
		NOT_YET_NORMAL_BLOOMER: 'Aqua',
		NOT_YET_EARLY_BLOOMER: 'White',
		BLOOMED: 'Darkgray'
	}

	const DEVELOPMENT_STATUS_TEXT = {
		MOSTLY_AHEAD: '有很大的成长空间',
		MIDDLE: '一般的成长空间',
		MOSTLY_DONE: '没有多少成长空间',
		DONE: '成长已完成',
        //简写表示
        MOSTLY_AHEAD_SHORT: '很大空间',
		MIDDLE_SHORT: '一般空间',
		MOSTLY_DONE_SHORT: '没有空间',
		DONE_SHORT: '已完成'
	}
	const DEVELOPMENT_STATUS_COLOR = {
		MOSTLY_AHEAD: 'Darkred',
		MIDDLE: 'Black',
		MOSTLY_DONE: 'Yellow',
		DONE: 'Darkgray'
	}

	const TI_CLASS = {
		LEVEL_1: 25,
		LEVEL_2: 20,
		LEVEL_3: 15,
		LEVEL_4: 10,
		LEVEL_5: 5,
		LEVEL_6: 0,
		LEVEL_7: -10
	};
	const APP_COLOR = {
		LEVEL_1: "Darkred",
		LEVEL_2: "Black",
		LEVEL_3: "Orange",
		LEVEL_4: "Yellow",
		LEVEL_5: "Blue",
		LEVEL_6: "Aqua",
		LEVEL_7: "White"
	};
	var shortFlag = true;//当为true时简写，false不简写
	var finishScan = false;

	var playerIdArr = [];
	var playerMap = new Map();

	var trainMap = new Map();
	var reportMap = new Map();

	var scoutMap = new Map();
	var avaiableScoutCount = 0;

	//first, replace all star img for easy color and calculate
	$('img[src$="/pics/star_silver.png"]').replaceWith('19');
	$('img[src$="/pics/star.png"]').replaceWith('20');

	updateReliableSkillScount(); //update before query scout data
	getPlayerData();
	var myInterval = setInterval(loopCheck, 1000);

	function getPlayerData() {
		let trArr = $('table.hover.zebra tbody tr');
		for (let i = 0; i < trArr.length; i++) {
			try {
				let tr = trArr[i];
				if (tr.className.indexOf("header") >= 0) {
					continue;
				} else if (tr.children[0].className.indexOf("splitter") >= 0) {
					continue;
				}

				let player = {};
				let onclickNumberPlayer = tr.children[0].children[0].attributes[1].textContent; //example: pop_player_number(131171905,37,"Davide Quilici",0)
				let playerId = onclickNumberPlayer.substr(18, onclickNumberPlayer.indexOf(',') - 18);

				player.Id = playerId;
				player.Number = tr.children[0].children[0].textContent;
				player.Name = tr.children[1].children[0].children[1].innerText;
				player.Age = tr.children[2].innerText;
				player.Position = tr.children[3].children[0].children[0].innerText;

				let skill = {};
				let skillSum = {};
				if (player.Position != GK_POSITION_TO_CHECK) {
					skill.Strength = getSkill(tr.children[4].children[0]);
					skill.Stamina = getSkill(tr.children[5].children[0]);
					skill.Pace = getSkill(tr.children[6].children[0]);
					skill.Marking = getSkill(tr.children[7].children[0]);
					skill.Tackling = getSkill(tr.children[8].children[0]);
					skill.Workrate = getSkill(tr.children[9].children[0]);
					skill.Positioning = getSkill(tr.children[10].children[0]);
					skill.Passing = getSkill(tr.children[11].children[0]);
					skill.Crossing = getSkill(tr.children[12].children[0]);
					skill.Technique = getSkill(tr.children[13].children[0]);
					skill.Heading = getSkill(tr.children[14].children[0]);
					skill.Finishing = getSkill(tr.children[15].children[0]);
					skill.Longshots = getSkill(tr.children[16].children[0]);
					skill.SetPieces = getSkill(tr.children[17].children[0]);

					skillSum.Phy = skill.Strength + skill.Stamina + skill.Pace + skill.Heading;
					skillSum.Tac = skill.Marking + skill.Tackling + skill.Positioning + skill.Workrate;
					skillSum.Tec = skill.Passing + skill.Crossing + skill.Technique + skill.Finishing + skill.Longshots + skill.SetPieces;
					skillSum.PhyMax = 80;
					skillSum.TacMax = 80;
					skillSum.TecMax = 120;
				} else {
					skill.Strength = getSkill(tr.children[4].children[0]);
					skill.Stamina = getSkill(tr.children[5].children[0]);
					skill.Pace = getSkill(tr.children[6].children[0]);
					skill.Handling = getSkill(tr.children[7].children[0]);
					skill.OneOnOnes = getSkill(tr.children[8].children[0]);
					skill.Reflexes = getSkill(tr.children[9].children[0]);
					skill.AerialAbility = getSkill(tr.children[10].children[0]);
					skill.Jumping = getSkill(tr.children[11].children[0]);
					skill.Communication = getSkill(tr.children[12].children[0]);
					skill.Kicking = getSkill(tr.children[13].children[0]);
					skill.Throwing = getSkill(tr.children[14].children[0]);

					skillSum.Phy = skill.Strength + skill.Stamina + skill.Pace + skill.Jumping;
					skillSum.Tac = skill.OneOnOnes + skill.AerialAbility + skill.Communication;
					skillSum.Tec = skill.Handling + skill.Reflexes + skill.Kicking + skill.Throwing;
					skillSum.PhyMax = 80;
					skillSum.TacMax = 60;
					skillSum.TecMax = 80;
				}
				skillSum.PhyRatio = skillSum.Phy / skillSum.PhyMax;
				skillSum.TacRatio = skillSum.Tac / skillSum.TacMax;
				skillSum.TecRatio = skillSum.Tec / skillSum.TecMax;

				player.SkillSum = skillSum;
				player.Skill = skill;

				try {
					if (!isNaN(tr.children[18].innerText)) {
						player.Ti = Number(tr.children[18].innerText); //available if has proday
					}
				} catch (e) {}

				playerMap.set(playerId, player);

				playerIdArr.push(playerId);

				getTrainInfo(playerId);
				getScoutInfo(playerId);
			} catch (err) {}
		}
		finishScan = true;
	}

	function loopCheck() {
		if (finishScan && playerMap.size == trainMap.size && playerMap.size == reportMap.size) {
			clearInterval(myInterval);

			let skillBtn = document.createElement('span');
			skillBtn.id = BUTTON_ID.SKILL;
			skillBtn.className = 'button';
			skillBtn.style = 'margin-left: 3px;';
			skillBtn.innerHTML = '<span class="button_border">技能显示</span>';

			if ($('#' + BUTTON_ID.SKILL).length == 0) { //other scritps can have same button
				$('div.std')[0].parentNode.insertBefore(skillBtn, $('div.std')[0]);
				document.getElementById(BUTTON_ID.SKILL).addEventListener('click', (e) => {
					showSkillPanel();
				});
			}

			let scoutBtn = document.createElement('span');
			scoutBtn.id = BUTTON_ID.SCOUT;
			scoutBtn.className = 'button';
			scoutBtn.style = 'margin-left: 3px;';
			scoutBtn.innerHTML = '<span class="button_border">球探报告 [' + avaiableScoutCount + ']</span>';
			$('div.std')[0].parentNode.insertBefore(scoutBtn, $('div.std')[0]);

			let peakBtn = document.createElement('span');
			peakBtn.id = BUTTON_ID.PEAK;
			peakBtn.className = 'button';
			peakBtn.style = 'margin-left: 3px;';
			peakBtn.innerHTML = '<span class="button_border">三维属性</span>';
			$('div.std')[0].parentNode.insertBefore(peakBtn, $('div.std')[0]);

			let reliableBtn = document.createElement('span');
			reliableBtn.id = BUTTON_ID.RELIABLE;
			reliableBtn.className = 'button';
			reliableBtn.style = 'margin-left: 3px;';
			reliableBtn.innerHTML = '<span class="button_border">球探可信度</span>';
			$('div.std')[0].parentNode.insertBefore(reliableBtn, $('div.std')[0]);

			document.getElementById(BUTTON_ID.SCOUT).addEventListener('click', (e) => {
				showAdditionPanel(ADDITION_PANEL_ID.SCOUT);
			});
			document.getElementById(BUTTON_ID.PEAK).addEventListener('click', (e) => {
				showAdditionPanel(ADDITION_PANEL_ID.PEAK);
			});
			document.getElementById(BUTTON_ID.RELIABLE).addEventListener('click', (e) => {
				showAdditionPanel(ADDITION_PANEL_ID.RELIABLE);
			});

			addNewStyle('.position {width:85px !important;}');

			modifySkillPanel();
			presentScoutPanel();
			presentPeakPanel();
			presentReliablePanel();
		}
	}

	function showAdditionPanel(panelId) {
		hideSkillPanel(true);
		let panels = $('[id^=' + ADDITION_PANEL_ID_PREFIX + ']');
		for (let i = 0; i < panels.length; i++) {
			panels[i].style.display = 'none';
		}
		$('#' + panelId)[0].style.display = '';
	}

	function showSkillPanel() {
		let panels = $('[id^=' + ADDITION_PANEL_ID_PREFIX + ']');
		for (let i = 0; i < panels.length; i++) {
			panels[i].style.display = 'none';
		}
		hideSkillPanel(false);
	}

	function hideSkillPanel(hide = true) {
		if (hide) {
			$('#' + SKILL_PANEL_ID)[0].parentNode.style.display = 'none';
		} else {
			$('#' + SKILL_PANEL_ID)[0].parentNode.style.display = '';
		}
	}

	function getSkill(element) {
		let result = 0;
		try {
			if (element.childElementCount == 0) {
				result = Number(element.innerText);
			} else {
				let img = element.children[0].attributes[0].textContent;
				if (img.indexOf('star_silver.png') >= 0) {
					result = 19;
				} else {
					result = 20;
				}
			}
		} catch (err) {
			result = 0;
			console.log('Exception getSkill function: ' + err);
		}
		return result;
	}

	function getScoutInfo(playerId) {
		$.post("//trophymanager.com/ajax/players_get_info.ajax.php", {
			"type": "scout",
			"player_id": playerId
		}, function (response) {
			let data = JSON.parse(response);
			getScout(data);
			let player = playerMap.get(playerId);
			let reportObj = {};
			if (data.reports != undefined && data.reports.length > 0) {
				//array order by date desc
				for (let i = data.reports.length - 1; i >= 0; i--) {
					let report = data.reports[i];
					if (report.scoutid == '0' && report.scout_name == 'YD') {
						reportObj.YouthDevelopment = report.old_pot;
						continue; //with YD only get potential
					} else if (!scoutMap.has(report.scoutid)) {
						continue; //scout was not found, so the data is not reliable
					}

					let scout = scoutMap.get(report.scoutid);

					if (reportObj.LastScoutDate == undefined || reportObj.LastScoutDate < new Date(report.done)) {
						reportObj.LastScoutDate = new Date(report.done);
					}

					reportObj.LastAgeScout = Number(report.report_age);

					if ((scout.youths >= SCOUT_RELIABLE_SKILL.YOUTHS && scout.development >= SCOUT_RELIABLE_SKILL.DEVELOPMENT && Number(report.report_age) < 20) ||
						(scout.seniors >= SCOUT_RELIABLE_SKILL.SENIORS && scout.development >= SCOUT_RELIABLE_SKILL.DEVELOPMENT && Number(report.report_age) >= 20)) {
						reportObj.Rec = report.potential / 2;
						reportObj.Potential = report.old_pot;

						let startBloomAge = calculateBloomAge(report);

						if (report.bloom_status_txt == BLOOM_STATUS_TEXT.BLOOMED || (startBloomAge != null && (startBloomAge + 2 < Math.floor(player.Age)))) {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + shortWord(BLOOM_STATUS_TEXT.BLOOMED) + '</span>';
						} else if (startBloomAge != null) {
							let processBloomAge = startBloomAge + ' - ' + (startBloomAge + 2);
							if (startBloomAge == Math.floor(player.Age)) {
								reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_START_BLOOM + '">' + processBloomAge + '</span>';
							} else if (startBloomAge + 1 == Math.floor(player.Age)) {
								reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_MIDDLE_BLOOM + '">' + processBloomAge + '</span>';
							} else if (startBloomAge + 2 == Math.floor(player.Age)) {
								reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_LATE_BLOOM + '">' + processBloomAge + '</span>';
							} else {
								reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_BLOOM + '">' + processBloomAge + '</span>';
							}
						} else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_LATE_BLOOMER) {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_LATE_BLOOMER + '">' + '20/22-22/24' + '</span>';
						} else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_NORMAL_BLOOMER) {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_NORMAL_BLOOMER + '">' + '18/19-20/21' + '</span>';
						} else {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_EARLY_BLOOMER + '">' + '16/17-18/19' + '</span>';
						}

						if (report.dev_status == DEVELOPMENT_STATUS_TEXT.DONE) {
							reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.DONE + '">' + shortWord(report.dev_status) + '</span>';
						} else if (report.dev_status == DEVELOPMENT_STATUS_TEXT.MOSTLY_DONE) {
							reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.MOSTLY_DONE + '">' + shortWord(report.dev_status) + '</span>';
						} else if (report.dev_status == DEVELOPMENT_STATUS_TEXT.MIDDLE) {
							reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.MIDDLE + '">' + shortWord(report.dev_status) + '</span>';
						} else if (report.dev_status == DEVELOPMENT_STATUS_TEXT.MOSTLY_AHEAD) {
							reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.MOSTLY_AHEAD + '">' + shortWord(report.dev_status) + '</span>';
						} else {
							reportObj.DevStatus = '<span>' + shortWord(report.dev_status) + '</span>';
						}
					}
					if (Number(report.report_age) >= 25) {
                        reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + shortWord(BLOOM_STATUS_TEXT.BLOOMED) + '</span>';
                    }
                    if (scout.development >= SCOUT_RELIABLE_SKILL.DEVELOPMENT) {

						let startBloomAge = calculateBloomAge(report);

						if (report.bloom_status_txt == BLOOM_STATUS_TEXT.BLOOMED || (startBloomAge != null && (startBloomAge + 2 < Math.floor(player.Age)))) {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + shortWord(BLOOM_STATUS_TEXT.BLOOMED) + '</span>';
						}
                        else if (startBloomAge != null) {
							let processBloomAge = startBloomAge + ' - ' + (startBloomAge + 2);
							if (startBloomAge == Math.floor(player.Age)) {
								reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_START_BLOOM + '">' + processBloomAge + '</span>';
							}
                            else if (startBloomAge + 1 == Math.floor(player.Age)) {
								reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_MIDDLE_BLOOM + '">' + processBloomAge + '</span>';
							}
                            else if (startBloomAge + 2 == Math.floor(player.Age)) {
								reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.IN_LATE_BLOOM + '">' + processBloomAge + '</span>';
							}
                            else {
								reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_BLOOM + '">' + processBloomAge + '</span>';
							}
						}
                        else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_LATE_BLOOMER) {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_LATE_BLOOMER + '">' + '20/22-22/24' + '</span>';
						}
                        else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_NORMAL_BLOOMER) {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_NORMAL_BLOOMER + '">' + '18/19-20/21' + '</span>';
						}
                        else {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_EARLY_BLOOMER + '">' + '16/17-18/19' + '</span>';
						}
					}
					if (Number(scout.physical) >= SCOUT_RELIABLE_SKILL.PHYSICAL) {
						if (player.Position != GK_POSITION_TO_CHECK) {
							if (OUTFIELD_SPECIALITY_PHYSICAL_INDEX.includes(Number(report.specialist))) {
								reportObj.Specialty = OUTFIELD_SPECIALITY[Number(report.specialist)];
							}
						} else {
							if (GK_SPECIALITY_PHYSICAL_INDEX.includes(Number(report.specialist))) {
								reportObj.Specialty = GK_SPECIALITY[Number(report.specialist)];
							}
						}

						switch (report.peak_phy_txt) {
						case PEAK_PHYSICAL_TEXT.SPLENDID:
							reportObj.PeakPhysical = PEAK_PHYSICAL_LEVEL.SPLENDID;
							break;
						case PEAK_PHYSICAL_TEXT.GOOD:
							reportObj.PeakPhysical = PEAK_PHYSICAL_LEVEL.GOOD;
							break;
						case PEAK_PHYSICAL_TEXT.OK:
							reportObj.PeakPhysical = PEAK_PHYSICAL_LEVEL.OK;
							break;
						case PEAK_PHYSICAL_TEXT.WEAK:
							reportObj.PeakPhysical = PEAK_PHYSICAL_LEVEL.WEAK;
							break;
						}
					}
					if (Number(scout.tactical) >= SCOUT_RELIABLE_SKILL.TACTICAL) {
						if (player.Position != GK_POSITION_TO_CHECK) {
							if (OUTFIELD_SPECIALITY_TACTICAL_INDEX.includes(Number(report.specialist))) {
								reportObj.Specialty = OUTFIELD_SPECIALITY[Number(report.specialist)];
							}
						} else {
							if (GK_SPECIALITY_TACTICAL_INDEX.includes(Number(report.specialist))) {
								reportObj.Specialty = GK_SPECIALITY[Number(report.specialist)];
							}
						}

						switch (report.peak_tac_txt) {
						case PEAK_TACTICAL_TEXT.SPLENDID:
							reportObj.PeakTactical = PEAK_TACTICAL_LEVEL.SPLENDID;
							break;
						case PEAK_TACTICAL_TEXT.GOOD:
							reportObj.PeakTactical = PEAK_TACTICAL_LEVEL.GOOD;
							break;
						case PEAK_TACTICAL_TEXT.OK:
							reportObj.PeakTactical = PEAK_TACTICAL_LEVEL.OK;
							break;
						case PEAK_TACTICAL_TEXT.POOR:
							reportObj.PeakTactical = PEAK_TACTICAL_LEVEL.POOR;
							break;
						}
					}
					if (Number(scout.technical) >= SCOUT_RELIABLE_SKILL.TECHNICAL) {
						if (player.Position != GK_POSITION_TO_CHECK) {
							if (OUTFIELD_SPECIALITY_TECHNICAL_INDEX.includes(Number(report.specialist))) {
								reportObj.Specialty = OUTFIELD_SPECIALITY[Number(report.specialist)];
							}
						} else {
							if (GK_SPECIALITY_TECHNICAL_INDEX.includes(Number(report.specialist))) {
								reportObj.Specialty = GK_SPECIALITY[Number(report.specialist)];
							}
						}

						switch (report.peak_tec_txt) {
						case PEAK_TECHNICAL_TEXT.SPLENDID:
							reportObj.PeakTechnical = PEAK_TECHNICAL_LEVEL.SPLENDID;
							break;
						case PEAK_TECHNICAL_TEXT.GOOD:
							reportObj.PeakTechnical = PEAK_TECHNICAL_LEVEL.GOOD;
							break;
						case PEAK_TECHNICAL_TEXT.OK:
							reportObj.PeakTechnical = PEAK_TECHNICAL_LEVEL.OK;
							break;
						case PEAK_TECHNICAL_TEXT.POOR:
							reportObj.PeakTechnical = PEAK_TECHNICAL_LEVEL.POOR;
							break;
						}
					}
					if (scout.psychology >= SCOUT_RELIABLE_SKILL.PSYCHOLOGY) {
						reportObj.Leadership = report.charisma;
						reportObj.Profession = report.professionalism;
						reportObj.Aggression = report.aggression;
					}
				}
			}
			reportMap.set(playerId, reportObj);
		});
	}

	function calculateBloomAge(report) {
		let startBloomAge = null;
		if (report.bloom_status_txt == BLOOM_STATUS_TEXT.IN_LATE_BLOOM) {
			startBloomAge = Number(report.report_age) - 2;
		} else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.IN_MIDDLE_BLOOM) {
			startBloomAge = Number(report.report_age) - 1;
		} else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.IN_START_BLOOM) {
			startBloomAge = Number(report.report_age);
		} else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_LATE_BLOOMER && Number(report.report_age) == 21) {
			startBloomAge = 22;
		} else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_NORMAL_BLOOMER && Number(report.report_age) == 18) {
			startBloomAge = 19;
		} else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_EARLY_BLOOMER && Number(report.report_age) == 16) {
			startBloomAge = 17;
		}
		return startBloomAge;
	}

	function getScout(data) {
		try {
			if (scoutMap.size > 0)
				return; //because all response return same scout data
			for (let propt in data.scouts) {
				let scout = data.scouts[propt];
				scoutMap.set(scout.id, scout);
				let lastActionDate = new Date(scout.last_action);
				lastActionDate.setHours(0);
				lastActionDate.setDate(lastActionDate.getDate() + 2);
				let today = convertTZ(new Date(), "Europe/Copenhagen"); //change to TM time
				if (today >= lastActionDate) {
					avaiableScoutCount++;
				}
			}
		} catch (err) {
			console.log(err)
		}
	}

	function convertTZ(date, tzString) {
		return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
				timeZone: tzString
			}));
	}

	function getTrainInfo(playerId) {
		$.post("//trophymanager.com/ajax/players_get_info.ajax.php", {
			"type": "training",
			"player_id": playerId
		}, function (response) {
			let trainText = "";
			let data = JSON.parse(response);
			if (data.custom.team == "7") {
				trainText = TRAIN_DRILL.GOALKEEPING;
			} else if (data.custom.custom_on) {
				trainText = '' +
					data.custom.custom.team1.points +
					data.custom.custom.team2.points +
					data.custom.custom.team3.points +
					data.custom.custom.team4.points +
					data.custom.custom.team5.points +
					data.custom.custom.team6.points;
			} else {
				switch (data.custom.team) {
				case "1":
					trainText = TRAIN_DRILL.TECHNICAL;
					break;
				case "2":
					trainText = TRAIN_DRILL.FITNESS;
					break;
				case "3":
					trainText = TRAIN_DRILL.TACTICAL;
					break;
				case "4":
					trainText = TRAIN_DRILL.FINISHING;
					break;
				case "5":
					trainText = TRAIN_DRILL.DEFENDING;
					break;
				case "6":
					trainText = TRAIN_DRILL.WINGER;
					break;
				default:
					trainText = '';
				}
			}
			let point = calculatePoint(trainText);
			trainMap.set(playerId, {
				TrainText: trainText,
				Point: point
			});
		});
	}

	/*
	custom train = abcdef
	dot = xyzt
	x = 10 y = 7 z = 6 t = 2
	 */
	function calculatePoint(trainText) {
		let result = TRAIN_DRILL_POINT;
		if (trainText.length == 6) {
			let sum = 0;
			for (let i = 0; i < trainText.length; i++) {
				let value = Number(trainText.charAt(i));
				if (value == 4) {
					sum += 25;
				} else if (value == 3) {
					sum += 23;
				} else if (value == 2) {
					sum += 17;
				} else if (value == 1) {
					sum += 10;
				}
			}
			result = sum;
		}
		return result;
	}

	function presentScoutPanel() {
		let scoutDiv = document.createElement('div');
		scoutDiv.id = ADDITION_PANEL_ID.SCOUT;
		scoutDiv.className = 'std';
		scoutDiv.style.display = 'none';
		scoutDiv.innerHTML +=
		'<div>' +
		'<table class="hover zebra" cellspacing="0" cellpadding="0">' +
		'<tbody id="' + SCOUT_TABLE_BODY_ID + '">' +
		'<tr class="header">' +
		'<th title="Number">#</th>' +
		'<th title="">姓名</th>' +
		'<th title="">年龄</th>' +
		'<th title="Favorite position">位置</th>' +
		'<th title="青训基地初始潜力，仅对高等级青训有效">基地潜力</th>' +
		'<th title="Recommendation">评星</th>' +
		'<th title="Potential">潜力</th>' +
		'<th title="深红色表示在快速成长末期\n 黑色表示在快速成长中期 \n 橙色表示在快速成长初期 \n 黄色表示还未快速成长 \n 蓝色表示晚熟的球员 \n 水绿色表示正常成长的球员 \n 白色表示早熟的球员">快速成长类型</th>' +
		'<th title="">发展空间</th>' +
		'<th title="">特长</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.PHYSICAL + '">身体</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.TACTICAL + '">战术</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.TECHNICAL + '">技术</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.LEADERSHIP + '">领导力</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.PROFESSIONALISM + '">职业性</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.AGGRESSION + '">侵略性</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.LAS + '">报告年龄</th>' +
		'<th title="TI is only available if you have proday">TI</th>' +
		'</tr>' +
		'</tbody>' +
		'</table>' +
		'</div>';
		$('#' + SKILL_PANEL_ID)[0].parentNode.parentNode.appendChild(scoutDiv);
		for (let i = 0; i < playerIdArr.length; i++) {
			appendScoutTableRow(playerIdArr[i], i);
		}
	}

	function appendScoutTableRow(playerId, rowCount) {
		let player = playerMap.get(playerId);
		let report = reportMap.get(playerId);

		let tbody = $('#' + SCOUT_TABLE_BODY_ID)[0];
		let tr = document.createElement('tr');
		if ((rowCount % 2) == 1) {
			tr.className = 'odd';
		}

		let tdNumber = document.createElement('td');
		tdNumber.className = 'border minishirt small';
		tdNumber.innerText = player.Number;

		let tdName = document.createElement('td');
		tdName.className = 'left name text_fade';
		tdName.innerHTML =
			'<div class="name"> <a href="/players/' + player.Id + '/" player_link="' + player.Id + '" class="normal">' + player.Name + '</a></div>';

		let tdAge = document.createElement('td');
		tdAge.innerText = player.Age;

		let tdFp = document.createElement('td');
		tdFp.className = 'favposition short';
		tdFp.innerText = player.Position;

		let tdYouthDevelopment = document.createElement('td');
		tdYouthDevelopment.className = 'border';
		colorTd(tdYouthDevelopment, 'Potential', report.YouthDevelopment);
		tdYouthDevelopment.innerText = report.YouthDevelopment == undefined ? '' : report.YouthDevelopment;

		let tdRec = document.createElement('td');
		colorTd(tdRec, 'Rec', report.Rec);
		tdRec.innerText = report.Rec == undefined ? '' : report.Rec.toFixed(1);

		let tdPotential = document.createElement('td');
		tdPotential.className = 'border';
		colorTd(tdPotential, 'Potential', report.Potential);
		tdPotential.innerText = report.Potential == undefined ? '' : report.Potential;

		let tdBloomStatus = document.createElement('td');
		if(player.Age>=25) {
            tdBloomStatus.innerHTML = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + shortWord(BLOOM_STATUS_TEXT.BLOOMED) + '</span>';
        }
        else {
            tdBloomStatus.innerHTML = report.BloomStatus == undefined ? '' : report.BloomStatus;
        }

		let tdDevStatus = document.createElement('td');
		tdDevStatus.className = 'border';
		tdDevStatus.innerHTML = report.DevStatus == undefined ? '' : report.DevStatus;

		let tdSpecialty = document.createElement('td');
		tdSpecialty.className = 'border';
		tdSpecialty.innerText = report.Specialty == undefined ? '' : report.Specialty;

		let tdPeakPhysical = document.createElement('td');
		tdPeakPhysical.title = SCOUT_TABLE_TITLE.PHYSICAL;
		colorTd(tdPeakPhysical, 'PeakPhysical', report.PeakPhysical);
		tdPeakPhysical.innerText = report.PeakPhysical == undefined ? '' : report.PeakPhysical;

		let tdPeakTactical = document.createElement('td');
		tdPeakTactical.title = SCOUT_TABLE_TITLE.TACTICAL;
		colorTd(tdPeakTactical, 'PeakTactical', report.PeakTactical);
		tdPeakTactical.innerText = report.PeakTactical == undefined ? '' : report.PeakTactical;

		let tdPeakTechnical = document.createElement('td');
		tdPeakTechnical.title = SCOUT_TABLE_TITLE.TECHNICAL;
		tdPeakTechnical.className = 'border';
		colorTd(tdPeakTechnical, 'PeakTechnical', report.PeakTechnical);
		tdPeakTechnical.innerText = report.PeakTechnical == undefined ? '' : report.PeakTechnical;

		let tdLeadership = document.createElement('td');
		tdLeadership.title = SCOUT_TABLE_TITLE.LEADERSHIP;
		colorTd(tdLeadership, 'Leadership', report.Leadership);
		tdLeadership.innerText = report.Leadership == undefined ? '' : report.Leadership;

		let tdProfession = document.createElement('td');
		tdProfession.title = SCOUT_TABLE_TITLE.PROFESSIONALISM;
		colorTd(tdProfession, 'Profession', report.Profession);
		tdProfession.innerText = report.Profession == undefined ? '' : report.Profession;

		let tdAggression = document.createElement('td');
		tdAggression.title = SCOUT_TABLE_TITLE.AGGRESSION;
		tdAggression.className = 'border';
		colorTd(tdAggression, 'Aggression', report.Aggression);
		tdAggression.innerText = report.Aggression == undefined ? '' : report.Aggression;

		let tdLastAgeScout = document.createElement('td');
		tdLastAgeScout.title = SCOUT_TABLE_TITLE.LAS;
		if (report.LastAgeScout && report.LastAgeScout < Math.floor(player.Age) && (tdBloomStatus.innerText != BLOOM_STATUS_TEXT.BLOOMED || tdDevStatus.innerText != DEVELOPMENT_STATUS_TEXT.DONE)) {
			tdLastAgeScout.innerHTML = '<span style="color:Darkred">' + report.LastAgeScout + '</span>';
		} else {
			tdLastAgeScout.innerText = report.LastAgeScout == undefined ? '' : report.LastAgeScout;
		}

		let tdTi = document.createElement('td');
		tdTi.title = SCOUT_TABLE_TITLE.TI;
		tdTi.className = 'border';
		colorTd(tdTi, 'Ti', player.Ti);
		tdTi.innerText = player.Ti == undefined ? '' : player.Ti;

		tr.appendChild(tdNumber);
		tr.appendChild(tdName);
		tr.appendChild(tdAge);
		tr.appendChild(tdFp);
		tr.appendChild(tdYouthDevelopment);
		tr.appendChild(tdRec);
		tr.appendChild(tdPotential);
		tr.appendChild(tdBloomStatus);
		tr.appendChild(tdDevStatus);
		tr.appendChild(tdSpecialty);
		tr.appendChild(tdPeakPhysical);
		tr.appendChild(tdPeakTactical);
		tr.appendChild(tdPeakTechnical);
		tr.appendChild(tdLeadership);
		tr.appendChild(tdProfession);
		tr.appendChild(tdAggression);
		tr.appendChild(tdLastAgeScout);
		tr.appendChild(tdTi);

		tbody.appendChild(tr);
	}

	function presentPeakPanel() {
		let peakDiv = document.createElement('div');
		peakDiv.id = ADDITION_PANEL_ID.PEAK;
		peakDiv.className = 'std';
		peakDiv.style.display = 'none';
		peakDiv.innerHTML +=
		'<div>' +
		'<table class="hover zebra" cellspacing="0" cellpadding="0">' +
		'<tbody id="' + PEAK_TABLE_BODY_ID + '">' +
		'<tr class="header">' +
		'<th title="Number">#</th>' +
		'<th title="">姓名</th>' +
		'<th title="">年龄</th>' +
		'<th title="Favorite position">位置</th>' +
		'<th title="' + PEAK_TABLE_TITLE.PHYSICAL_SUM + '">身体属性和</th>' +
		'<th title="' + PEAK_TABLE_TITLE.TACTICAL_SUM + '">战术属性和</th>' +
		'<th title="' + PEAK_TABLE_TITLE.TECHNICAL_SUM + '">技术属性和</th>' +
		'<th title="' + PEAK_TABLE_TITLE.PHYSICAL_PEAK + '">身体属性上限</th>' +
		'<th title="' + PEAK_TABLE_TITLE.TACTICAL_PEAK + '">战术属性上限</th>' +
		'<th title="' + PEAK_TABLE_TITLE.TECHNICAL_PEAK + '">技术属性上限</th>' +
		'<th title="Percent Reach Peak">身体上限百分比</th>' +
		'<th title="Percent Reach Peak">战术上限百分比</th>' +
		'<th title="Percent Reach Peak">技术上限百分比</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.PHYSICAL + '">身体评分</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.TACTICAL + '">战术评分</th>' +
		'<th title="' + SCOUT_TABLE_TITLE.TECHNICAL + '">技术评分</th>' +
		'<th title="Custom Train\nTeam 1: Strength, Workrate, Stamina\nTeam 2: Marking, Tackling\nTeam 3: Crossing, Pace\nTeam 4: Passing, Technique, Set Pieces\nTeam 5: Heading, Positioning\nTeam 6: Finishing, Longshots\n\nNormal Train\nTech (Technical Drills): Technique, Passing, Set Pieces\nFit (Fitness Drills): Strength, Stamina, Pace, Workrate\nTac (Tactical Drills): Workrate, Positioning, Passing\nFin (Finishing Drills): Finish, Long shot, Heading\nDef (Defending Drills): Marking, Tackling, Positioning, Heading\nWing (Winger Drills): Crossing, Pace, Technique">训练方式</th>' +
		'</tr>' +
		'</tbody>' +
		'</table>' +
		'</div>';
		$('#' + SKILL_PANEL_ID)[0].parentNode.parentNode.appendChild(peakDiv);
		for (let i = 0; i < playerIdArr.length; i++) {
			appendPeakTableRow(playerIdArr[i], i);
		}
	}

	function appendPeakTableRow(playerId, rowCount) {
		let player = playerMap.get(playerId);
		let report = reportMap.get(playerId);

		let tbody = $('#' + PEAK_TABLE_BODY_ID)[0];
		let tr = document.createElement('tr');
		if ((rowCount % 2) == 1) {
			tr.className = 'odd';
		}

		let tdNumber = document.createElement('td');
		tdNumber.className = 'border minishirt small';
		tdNumber.innerText = player.Number;

		let tdName = document.createElement('td');
		tdName.className = 'left name text_fade';
		tdName.innerHTML =
			'<div class="name"> <a href="/players/' + player.Id + '/" player_link="' + player.Id + '" class="normal">' + player.Name + '</a></div>';

		let tdAge = document.createElement('td');
		tdAge.innerText = player.Age;

		let tdFp = document.createElement('td');
		tdFp.className = 'favposition short';
		tdFp.innerText = player.Position;

		let tdPhySum = document.createElement('td');
		tdPhySum.title = PEAK_TABLE_TITLE.PHYSICAL_SUM;
		tdPhySum.innerText = player.SkillSum.Phy + ' (' + Math.round(player.SkillSum.PhyRatio * 100) + '%)';
		colorTd(tdPhySum, 'RatioSkillSum', Math.round(player.SkillSum.PhyRatio * 100));

		let tdTacSum = document.createElement('td');
		tdTacSum.title = PEAK_TABLE_TITLE.TACTICAL_SUM;
		tdTacSum.innerText = player.SkillSum.Tac + ' (' + Math.round(player.SkillSum.TacRatio * 100) + '%)';
		colorTd(tdTacSum, 'RatioSkillSum', Math.round(player.SkillSum.TacRatio * 100));

		let tdTecSum = document.createElement('td');
		tdTecSum.title = PEAK_TABLE_TITLE.TECHNICAL_SUM;
		tdTecSum.className = 'border';
		tdTecSum.innerText = player.SkillSum.Tec + ' (' + Math.round(player.SkillSum.TecRatio * 100) + '%)';
		colorTd(tdTecSum, 'RatioSkillSum', Math.round(player.SkillSum.TecRatio * 100));

		let tdPhyPeak = document.createElement('td');
		tdPhyPeak.title = PEAK_TABLE_TITLE.PHYSICAL_PEAK;
		if (report.PeakPhysical != undefined) {
			if (player.Position != GK_POSITION_TO_CHECK) {
				tdPhyPeak.innerText = OUTFIELD_PEAK_PHYSICAL_SKILL_SUM[report.PeakPhysical - 1];
			} else {
				tdPhyPeak.innerText = GK_PEAK_PHYSICAL_SKILL_SUM[report.PeakPhysical - 1];
			}
		} else {
			tdPhyPeak.innerText = '';
		}
		colorTd(tdPhyPeak, 'PeakPhysical', report.PeakPhysical);

		let tdTacPeak = document.createElement('td');
		tdTacPeak.title = PEAK_TABLE_TITLE.TACTICAL_PEAK;
		if (report.PeakTactical != undefined) {
			if (player.Position != GK_POSITION_TO_CHECK) {
				tdTacPeak.innerText = OUTFIELD_PEAK_TACTICAL_SKILL_SUM[report.PeakTactical - 1];
			} else {
				tdTacPeak.innerText = GK_PEAK_TACTICAL_SKILL_SUM[report.PeakTactical - 1];
			}
		} else {
			tdTacPeak.innerText = '';
		}
		colorTd(tdTacPeak, 'PeakTactical', report.PeakTactical);

		let tdTecPeak = document.createElement('td');
		tdTecPeak.title = PEAK_TABLE_TITLE.TECHNICAL_PEAK;
		tdTecPeak.className = 'border';
		if (report.PeakTechnical != undefined) {
			if (player.Position != GK_POSITION_TO_CHECK) {
				tdTecPeak.innerText = OUTFIELD_PEAK_TECHNICAL_SKILL_SUM[report.PeakTechnical - 1];
			} else {
				tdTecPeak.innerText = GK_PEAK_TECHNICAL_SKILL_SUM[report.PeakTechnical - 1];
			}
		} else {
			tdTecPeak.innerText = '';
		}
		colorTd(tdTecPeak, 'PeakTechnical', report.PeakTechnical);

		let tdPhyReach = document.createElement('td');
		if (tdPhyPeak.innerText != '') {
			tdPhyReach.innerText = Math.round(player.SkillSum.Phy / Number(tdPhyPeak.innerText) * 100) + '%';
		} else {
			tdPhyReach.innerText = '';
		}
		colorTd(tdPhyReach, 'SumReachPeak', Math.round(player.SkillSum.Phy / Number(tdPhyPeak.innerText) * 100));

		let tdTacReach = document.createElement('td');
		if (tdTacPeak.innerText != '') {
			tdTacReach.innerText = Math.round(player.SkillSum.Tac / Number(tdTacPeak.innerText) * 100) + '%';
		} else {
			tdTacReach.innerText = '';
		}
		colorTd(tdTacReach, 'SumReachPeak', Math.round(player.SkillSum.Tac / Number(tdTacPeak.innerText) * 100));

		let tdTecReach = document.createElement('td');
		tdTecReach.className = 'border';
		if (tdTecPeak.innerText != '') {
			tdTecReach.innerText = Math.round(player.SkillSum.Tec / Number(tdTecPeak.innerText) * 100) + '%';
		} else {
			tdTecReach.innerText = '';
		}
		colorTd(tdTecReach, 'SumReachPeak', Math.round(player.SkillSum.Tec / Number(tdTecPeak.innerText) * 100));

		let tdPeakPhysical = document.createElement('td');
		tdPeakPhysical.title = SCOUT_TABLE_TITLE.PHYSICAL;
		colorTd(tdPeakPhysical, 'PeakPhysical', report.PeakPhysical);
		tdPeakPhysical.innerText = report.PeakPhysical == undefined ? '' : report.PeakPhysical;

		let tdPeakTactical = document.createElement('td');
		tdPeakTactical.title = SCOUT_TABLE_TITLE.TACTICAL;
		colorTd(tdPeakTactical, 'PeakTactical', report.PeakTactical);
		tdPeakTactical.innerText = report.PeakTactical == undefined ? '' : report.PeakTactical;

		let tdPeakTechnical = document.createElement('td');
		tdPeakTechnical.title = SCOUT_TABLE_TITLE.TECHNICAL;
		tdPeakTechnical.className = 'border';
		colorTd(tdPeakTechnical, 'PeakTechnical', report.PeakTechnical);
		tdPeakTechnical.innerText = report.PeakTechnical == undefined ? '' : report.PeakTechnical;

		let tdTrain = document.createElement('td');
		tdTrain.className = 'border';
		tdTrain.innerText = trainMap.get(playerId).TrainText == undefined ? '' : trainMap.get(playerId).TrainText;
		if (tdTrain.innerText.length == 6) {
			tdTrain.title = PEAK_TABLE_TITLE.CUSTOM_TRAIN_TYPE;
		} else if (tdTrain.innerText == TRAIN_DRILL.TECHNICAL) {
			tdTrain.title = PEAK_TABLE_TITLE.NORMAL_TRAIN_TYPE_TECHNICAL;
		} else if (tdTrain.innerText == TRAIN_DRILL.FITNESS) {
			tdTrain.title = PEAK_TABLE_TITLE.NORMAL_TRAIN_TYPE_FITNESS;
		} else if (tdTrain.innerText == TRAIN_DRILL.TACTICAL) {
			tdTrain.title = PEAK_TABLE_TITLE.NORMAL_TRAIN_TYPE_TACTICAL;
		} else if (tdTrain.innerText == TRAIN_DRILL.FINISHING) {
			tdTrain.title = PEAK_TABLE_TITLE.NORMAL_TRAIN_TYPE_FINISHING;
		} else if (tdTrain.innerText == TRAIN_DRILL.DEFENDING) {
			tdTrain.title = PEAK_TABLE_TITLE.NORMAL_TRAIN_TYPE_DEFENDING;
		} else if (tdTrain.innerText == TRAIN_DRILL.WINGER) {
			tdTrain.title = PEAK_TABLE_TITLE.NORMAL_TRAIN_TYPE_WINGER;
		}

		tr.appendChild(tdNumber);
		tr.appendChild(tdName);
		tr.appendChild(tdAge);
		tr.appendChild(tdFp);

		tr.appendChild(tdPhySum);
		tr.appendChild(tdTacSum);
		tr.appendChild(tdTecSum);

		tr.appendChild(tdPhyPeak);
		tr.appendChild(tdTacPeak);
		tr.appendChild(tdTecPeak);

		tr.appendChild(tdPhyReach);
		tr.appendChild(tdTacReach);
		tr.appendChild(tdTecReach);

		tr.appendChild(tdPeakPhysical);
		tr.appendChild(tdPeakTactical);
		tr.appendChild(tdPeakTechnical);

		tr.appendChild(tdTrain);

		tbody.appendChild(tr);
	}

	function presentReliablePanel() {
		let configDiv = document.createElement('div');
		configDiv.id = ADDITION_PANEL_ID.RELIABLE;
		configDiv.className = 'std';
		configDiv.style.display = 'none';
		configDiv.innerHTML +=
		'<div>' +
		'<table class="hover zebra" cellspacing="0" cellpadding="0">' +
		'<tbody>' +
		'<tr class="header">' +
		'<td colspan="8" class="left">设置可信任的球探属性。脚本只显示球探技能大于或等于设定值的球探的报告结果。</td>' +
		'</tr>' +
		'<tr>' +
		'<td class="left">成:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_seniors" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
		'<td class="left">青:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_youths" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
		'<td class="left">发:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_development" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
		'<td class="left">心:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_psychology" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
		'</tr>' +
		'<tr>' +
		'<td class="left">体:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_physical" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
		'<td class="left">战:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_tactical" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
		'<td class="left">技:</td><td><span style="display: inline-block;"><input id="tmvn_script_player_train_input_reliable_scout_technical" type="text" class="embossed" style="width: 100px; min-width: 50px; line-height: 100%; padding: 3px 3px 4px 3px; text-align: right;"></span></td>' +
		'<td class="left" colspan="2">' +
		'<span id="tmvn_script_player_train_button_save_reliable" class="button" style="margin-left: 3px;"><span class="button_border">保存</span></span>' +
		'<span id="tmvn_script_player_train_button_reset_reliable" class="button" style="margin-left: 3px;"><span class="button_border">重置</span></span>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>' +
		'</div>';
		$('#' + SKILL_PANEL_ID)[0].parentNode.parentNode.appendChild(configDiv);
		document.getElementById('tmvn_script_player_train_button_save_reliable').addEventListener('click', (e) => {
			saveReliableSkillScout();
		});
		document.getElementById('tmvn_script_player_train_button_reset_reliable').addEventListener('click', (e) => {
			resetReliableSkillScout();
		});

		updateReliableSkillScount();
		$('#tmvn_script_player_train_input_reliable_scout_seniors').val(SCOUT_RELIABLE_SKILL.SENIORS);
		$('#tmvn_script_player_train_input_reliable_scout_youths').val(SCOUT_RELIABLE_SKILL.YOUTHS);
		$('#tmvn_script_player_train_input_reliable_scout_development').val(SCOUT_RELIABLE_SKILL.DEVELOPMENT);
		$('#tmvn_script_player_train_input_reliable_scout_psychology').val(SCOUT_RELIABLE_SKILL.PSYCHOLOGY);
		$('#tmvn_script_player_train_input_reliable_scout_physical').val(SCOUT_RELIABLE_SKILL.PHYSICAL);
		$('#tmvn_script_player_train_input_reliable_scout_tactical').val(SCOUT_RELIABLE_SKILL.TACTICAL);
		$('#tmvn_script_player_train_input_reliable_scout_technical').val(SCOUT_RELIABLE_SKILL.TECHNICAL);
	}

	function updateReliableSkillScount() {
		let localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY_VALUE);
		if (localStorageData !== "" && localStorageData !== undefined && localStorageData !== null) {
			let reliableSkillScout = JSON.parse(localStorageData);

			SCOUT_RELIABLE_SKILL.SENIORS = reliableSkillScout.Seniors != undefined ? reliableSkillScout.Seniors : SCOUT_RELIABLE_SKILL.SENIORS;
			SCOUT_RELIABLE_SKILL.YOUTHS = reliableSkillScout.Youths != undefined ? reliableSkillScout.Youths : SCOUT_RELIABLE_SKILL.YOUTHS;
			SCOUT_RELIABLE_SKILL.DEVELOPMENT = reliableSkillScout.Development != undefined ? reliableSkillScout.Development : SCOUT_RELIABLE_SKILL.DEVELOPMENT;
			SCOUT_RELIABLE_SKILL.PSYCHOLOGY = reliableSkillScout.Psychology != undefined ? reliableSkillScout.Psychology : SCOUT_RELIABLE_SKILL.PSYCHOLOGY;
			SCOUT_RELIABLE_SKILL.PHYSICAL = reliableSkillScout.Physical != undefined ? reliableSkillScout.Physical : SCOUT_RELIABLE_SKILL.PHYSICAL;
			SCOUT_RELIABLE_SKILL.TACTICAL = reliableSkillScout.Tactical != undefined ? reliableSkillScout.Tactical : SCOUT_RELIABLE_SKILL.TACTICAL;
			SCOUT_RELIABLE_SKILL.TECHNICAL = reliableSkillScout.Technical != undefined ? reliableSkillScout.Technical : SCOUT_RELIABLE_SKILL.TECHNICAL;
		}
	}

	function resetReliableSkillScout() {
		localStorage.removeItem(LOCAL_STORAGE_KEY_VALUE);
		alert('Reset successful, please refresh');
	}

	function saveReliableSkillScout() {
		let seniors = $('#tmvn_script_player_train_input_reliable_scout_seniors')[0].value.trim();
		let youths = $('#tmvn_script_player_train_input_reliable_scout_youths')[0].value.trim();
		let development = $('#tmvn_script_player_train_input_reliable_scout_development')[0].value.trim();
		let psychology = $('#tmvn_script_player_train_input_reliable_scout_psychology')[0].value.trim();
		let physical = $('#tmvn_script_player_train_input_reliable_scout_physical')[0].value.trim();
		let tactical = $('#tmvn_script_player_train_input_reliable_scout_tactical')[0].value.trim();
		let technical = $('#tmvn_script_player_train_input_reliable_scout_technical')[0].value.trim();

		if (seniors == '' || youths == '' || development == '' || psychology == '' || physical == '' || tactical == '' || technical == '') {
			alert('Enter value for all textboxs');
			return;
		}

		if (isNaN(seniors) || isNaN(youths) || isNaN(development) || isNaN(psychology) || isNaN(physical) || isNaN(tactical) || isNaN(technical)) {
			alert('Values must be a integer');
			return;
		}

		if (!(isInt(seniors) && isInt(youths) && isInt(development) && isInt(psychology) && isInt(physical) && isInt(tactical) && isInt(technical))) {
			alert('Values must be a integer');
			return;
		}

		if (!(isValidSkill(seniors) && isValidSkill(youths) && isValidSkill(development) && isValidSkill(psychology) && isValidSkill(physical) && isValidSkill(tactical) && isValidSkill(technical))) {
			alert('Values are between 0 - 20');
			return;
		}

		let reliableSkillScout = {};
		reliableSkillScout.Seniors = seniors;
		reliableSkillScout.Youths = youths;
		reliableSkillScout.Development = development;
		reliableSkillScout.Psychology = psychology;
		reliableSkillScout.Physical = physical;
		reliableSkillScout.Tactical = tactical;
		reliableSkillScout.Technical = technical;

		localStorage.setItem(LOCAL_STORAGE_KEY_VALUE, JSON.stringify(reliableSkillScout));
		alert('Save successful');
	}

	function isValidSkill(skill) {
		return skill <= 20 && skill >= 0;
	}

	function isInt(n) {
		return n % 1 === 0;
	}

	function colorTd(td, type, value) {
		if (value) {
			if (type == 'Rec') {
				if (value == 5) {
					td.style.color = SCOUT_LEVEL_COLOR[5];
				} else if (value == 4.5) {
					td.style.color = SCOUT_LEVEL_COLOR[4];
				} else {
					td.style.color = SCOUT_LEVEL_COLOR[Math.round(value) - 1];
				}
			} else if (['Potential', 'Leadership', 'Profession'].includes(type)) {
				if (value >= 19) {
					td.style.color = SCOUT_LEVEL_COLOR[5];
				} else if (value >= 17) {
					td.style.color = SCOUT_LEVEL_COLOR[4];
				} else if (value >= 13) {
					td.style.color = SCOUT_LEVEL_COLOR[3];
				} else if (value >= 9) {
					td.style.color = SCOUT_LEVEL_COLOR[2];
				} else if (value >= 5) {
					td.style.color = SCOUT_LEVEL_COLOR[1];
				} else {
					td.style.color = SCOUT_LEVEL_COLOR[0];
				}
			} else if (['PeakPhysical', 'PeakTactical', 'PeakTechnical'].includes(type)) {
				if (value >= 4) {
					td.style.color = SCOUT_LEVEL_COLOR[5];
				} else if (value >= 3) {
					td.style.color = SCOUT_LEVEL_COLOR[3];
				} else if (value >= 2) {
					td.style.color = SCOUT_LEVEL_COLOR[1];
				} else {
					td.style.color = SCOUT_LEVEL_COLOR[0];
				}
			} else if (type == 'Aggression') {
				if (value <= 2) {
					td.style.color = SCOUT_LEVEL_COLOR[5];
				} else if (value <= 4) {
					td.style.color = SCOUT_LEVEL_COLOR[4];
				} else if (value <= 8) {
					td.style.color = SCOUT_LEVEL_COLOR[3];
				} else if (value <= 12) {
					td.style.color = SCOUT_LEVEL_COLOR[2];
				} else if (value <= 16) {
					td.style.color = SCOUT_LEVEL_COLOR[1];
				} else {
					td.style.color = SCOUT_LEVEL_COLOR[0];
				}
			} else if (['RatioSkillSum', 'SumReachPeak'].includes(type)) {
				if (value >= 90) {
					td.style.color = PERCENT_PEAK_COLOR[5];
				} else if (value >= 80) {
					td.style.color = PERCENT_PEAK_COLOR[4];
				} else if (value >= 70) {
					td.style.color = PERCENT_PEAK_COLOR[3];
				} else if (value >= 60) {
					td.style.color = PERCENT_PEAK_COLOR[2];
				} else if (value >= 50) {
					td.style.color = PERCENT_PEAK_COLOR[1];
				} else {
					td.style.color = PERCENT_PEAK_COLOR[0];
				}
			} else if (type == 'Ti') {
				if (value >= TI_CLASS.LEVEL_1) {
					td.style.color = APP_COLOR.LEVEL_1;
				} else if (value >= TI_CLASS.LEVEL_2) {
					td.style.color = APP_COLOR.LEVEL_2;
				} else if (value >= TI_CLASS.LEVEL_3) {
					td.style.color = APP_COLOR.LEVEL_3;
				} else if (value >= TI_CLASS.LEVEL_4) {
					td.style.color = APP_COLOR.LEVEL_4;
				} else if (value >= TI_CLASS.LEVEL_5) {
					td.style.color = APP_COLOR.LEVEL_5;
				} else if (value >= TI_CLASS.LEVEL_6) {
					td.style.color = APP_COLOR.LEVEL_6;
				} else {
					td.style.color = APP_COLOR.LEVEL_7;
				}
			}
		}
	}

	function modifySkillPanel() {
		let trArr = $('table.hover.zebra tbody tr');
		for (let i = 0; i < trArr.length; i++) {
			try {
				let tr = trArr[i];
				if (tr.className.indexOf("header") >= 0) {
					let trainTh = document.createElement("TH");
					trainTh.className = "border skill";
					trainTh.style.cursor = 'pointer';
					trainTh.innerHTML = '<div class="border skill">训练方式</div>';
					tr.appendChild(trainTh);

					let pointTh = document.createElement("TH");
					pointTh.className = "border skill";
					pointTh.style.cursor = 'pointer';
					pointTh.innerHTML = '<div class="border skill">效率</div>';
					tr.appendChild(pointTh);
				} else if (tr.children[0].className.indexOf("splitter") < 0) {
					let onclickNumberPlayer = tr.children[0].children[0].attributes[1].textContent; //example: pop_player_number(131171905,37,"Davide Quilici",0)
					let playerId = onclickNumberPlayer.substr(18, onclickNumberPlayer.indexOf(',') - 18);

					let trainText = trainMap.get(playerId).TrainText;
					let point = trainMap.get(playerId).Point;

					let trainTd = document.createElement("TD");
					trainTd.className = "border skill";
					trainTd.innerHTML = trainText;
					tr.appendChild(trainTd);

					let pointTd = document.createElement("TD");
					pointTd.className = "border skill";
					pointTd.innerHTML = point;
					tr.appendChild(pointTd);

					if (playerMap.get(playerId).Position != GK_POSITION_TO_CHECK) {
						colorSkill(tr, trainText);
					}

				}
			} catch (err) {}
		}
	}

	function colorSkill(tr, trainText) {
        console.log(DISPLAY_COLOR);
        if(DISPLAY_COLOR === 0){
            return;
        }
		if (trainText.length == 6) { //custom train 222222
			tr.children[SKILL_COLUMN_INDEX.STR].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(0))];
			tr.children[SKILL_COLUMN_INDEX.STA].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(0))];
			tr.children[SKILL_COLUMN_INDEX.WOR].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(0))];

			tr.children[SKILL_COLUMN_INDEX.MAR].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(1))];
			tr.children[SKILL_COLUMN_INDEX.TAC].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(1))];

			tr.children[SKILL_COLUMN_INDEX.PAC].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(2))];
			tr.children[SKILL_COLUMN_INDEX.CRO].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(2))];

			tr.children[SKILL_COLUMN_INDEX.PAS].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(3))];
			tr.children[SKILL_COLUMN_INDEX.TEC].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(3))];
			tr.children[SKILL_COLUMN_INDEX.SET].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(3))];

			tr.children[SKILL_COLUMN_INDEX.POS].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(4))];
			tr.children[SKILL_COLUMN_INDEX.HEA].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(4))];

			tr.children[SKILL_COLUMN_INDEX.FIN].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(5))];
			tr.children[SKILL_COLUMN_INDEX.LON].children[0].style.color = TRAIN_DOT_COLOR[Number(trainText.charAt(5))];
		} else {
			switch (trainText) {
			case TRAIN_DRILL.TECHNICAL:
				tr.children[SKILL_COLUMN_INDEX.TEC].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.PAS].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.SET].children[0].style.color = TRAIN_DRILL_COLOR;
				break;
			case TRAIN_DRILL.FITNESS:
				tr.children[SKILL_COLUMN_INDEX.STR].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.STA].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.WOR].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.PAC].children[0].style.color = TRAIN_DRILL_COLOR;
				break;
			case TRAIN_DRILL.TACTICAL:
				tr.children[SKILL_COLUMN_INDEX.WOR].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.POS].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.PAS].children[0].style.color = TRAIN_DRILL_COLOR;
				break;
			case TRAIN_DRILL.FINISHING:
				tr.children[SKILL_COLUMN_INDEX.FIN].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.LON].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.HEA].children[0].style.color = TRAIN_DRILL_COLOR;
				break;
			case TRAIN_DRILL.DEFENDING:
				tr.children[SKILL_COLUMN_INDEX.MAR].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.TAC].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.POS].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.HEA].children[0].style.color = TRAIN_DRILL_COLOR;
				break;
			case TRAIN_DRILL.WINGER:
				tr.children[SKILL_COLUMN_INDEX.CRO].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.PAC].children[0].style.color = TRAIN_DRILL_COLOR;
				tr.children[SKILL_COLUMN_INDEX.TEC].children[0].style.color = TRAIN_DRILL_COLOR;
				break;
			}
		}
	}

	function addNewStyle(newStyle) {
		var styleElement = document.getElementById('style_js');
		if (!styleElement) {
			styleElement = document.createElement('style');
			styleElement.type = 'text/css';
			styleElement.id = 'style_js';
			document.getElementsByTagName('head')[0].appendChild(styleElement);
		}
		styleElement.appendChild(document.createTextNode(newStyle));
	}
	function shortWord(word){
        if (shortFlag) {
            switch (word) {
                case BLOOM_STATUS_TEXT.IN_LATE_BLOOM:
                    return BLOOM_STATUS_TEXT.IN_LATE_BLOOM_SHORT;
                case BLOOM_STATUS_TEXT.IN_MIDDLE_BLOOM:
                    return BLOOM_STATUS_TEXT.IN_MIDDLE_BLOOM_SHORT;
                case BLOOM_STATUS_TEXT.IN_START_BLOOM:
                    return BLOOM_STATUS_TEXT.IN_START_BLOOM_SHORT;
                case BLOOM_STATUS_TEXT.NOT_YET_LATE_BLOOMER:
                    return BLOOM_STATUS_TEXT.NOT_YET_LATE_BLOOMER_SHORT;
                case BLOOM_STATUS_TEXT.NOT_YET_NORMAL_BLOOMER:
                    return BLOOM_STATUS_TEXT.NOT_YET_NORMAL_BLOOMER_SHORT;
                case BLOOM_STATUS_TEXT.NOT_YET_EARLY_BLOOMER:
                    return BLOOM_STATUS_TEXT.NOT_YET_EARLY_BLOOMER_SHORT;
                case BLOOM_STATUS_TEXT.BLOOMED:
                    return BLOOM_STATUS_TEXT.BLOOMED_SHORT;
                case DEVELOPMENT_STATUS_TEXT.MOSTLY_AHEAD:
                    return DEVELOPMENT_STATUS_TEXT.MOSTLY_AHEAD_SHORT;
                case DEVELOPMENT_STATUS_TEXT.MIDDLE:
                    return DEVELOPMENT_STATUS_TEXT.MIDDLE_SHORT;
                case DEVELOPMENT_STATUS_TEXT.MOSTLY_DONE:
                    return DEVELOPMENT_STATUS_TEXT.MOSTLY_DONE_SHORT;
                case DEVELOPMENT_STATUS_TEXT.DONE:
                    return DEVELOPMENT_STATUS_TEXT.DONE_SHORT;
                default:
                    return word;
            }
        }
        else {
            return word;
        }
    }
})();