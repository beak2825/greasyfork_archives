// ==UserScript==
// @name         TMVN Players Scout (CN beta)
// @namespace    https://trophymanager.com
// @version      3.2025030301
// @description  Trophymanager: synthesize scout information, calculate skill peak
// @include      *trophymanager.com/players/*
// @exclude	     *trophymanager.com/players/
// @exclude      *trophymanager.com/players/compare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431931/TMVN%20Players%20Scout%20%28CN%20beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/431931/TMVN%20Players%20Scout%20%28CN%20beta%29.meta.js
// ==/UserScript==


(function () {
	'use strict';

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

	const BLOOM_STATUS_TEXT = {
		IN_LATE_BLOOM: '处于快速成长的最后阶段',
		IN_MIDDLE_BLOOM: '处于快速成长的中间阶段',
		IN_START_BLOOM: '处于快速成长的初始阶段',
		NOT_YET_LATE_BLOOMER: '还未开始快速成长 - 晚熟',
		NOT_YET_NORMAL_BLOOMER: '还未开始快速成长: 正常成长',
		NOT_YET_EARLY_BLOOMER: '还未开始快速成长: 早熟',
		BLOOMED: '快速成长已经结束'
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
		DONE: '成长已完成'
	}
	const DEVELOPMENT_STATUS_COLOR = {
		MOSTLY_AHEAD: 'Darkred',
		MIDDLE: 'Black',
		MOSTLY_DONE: 'Yellow',
		DONE: 'Darkgray'
	}

	const SCOUT_LEVEL_COLOR = ['White', 'Aqua', 'Blue', 'Yellow', 'Black', 'Darkred'];
	const PERCENT_PEAK_COLOR = ['White', 'Aqua', 'Blue', 'Yellow', 'Black', 'Darkred'];

	const SCOUT_TABLE_TITLE = {
		PHYSICAL: 'Physical scout: 4 level, higher is better',
		TACTICAL: 'Tactical scout: 4 level, higher is better',
		TECHNICAL: 'Technique scout: 4 level, higher is better',
		LEADERSHIP: 'Leadership scout: 20 point, higher is better',
		PROFESSIONALISM: 'Professionalism scout: 20 point, higher is better',
		AGGRESSION: 'Aggression scout: 20 point, smaller is better',
		LAS: 'Last age scout',
		TI: 'TI'
	}

	const LOCAL_STORAGE_KEY_VALUE = 'TMVN_SCRIPT_PLAYER_TRAIN_RELIABLE_INFO';
	const GK_POSITION_TO_CHECK = 'GK';
	const SCOUT_TABLE_BODY_ID = 'tmvn_script_scout_table_body'; ;

	var playerId;
	var player = {};
	var scoutMap = new Map();
	var reportObj = {};

	present();

	function present() {
		playerId = location.href.split('/')[4];
		if (playerId != '') {
			if (playerId.endsWith('#')) {
				playerId = playerId.substring(0, playerId.length - 1);
			}
			try {
				$('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
			} catch (err) {}
			updateReliableSkillScount(); //update before query scout data
			addNewStyle('.border {border-right:1px solid #41631F !important;}');

			$.ajaxSetup({
				async: false
			});

			getPlayerSkill(playerId);

			$.ajaxSetup({
				async: true
			});

			let scoutReport =
				"<div class=\"box\">" +
				"<div class=\"box_head\">" +
				"<h2 class=\"std\">球探报告</h2>" +
				"</div>" +
				"<div class=\"box_body\">" +
				"<div class=\"box_shadow\"></div>" +
				"<div id=\"scoutReport_content\" class=\"content_menu\"></div>" +
				"</div>" +
				"<div class=\"box_footer\">" +
				"<div></div>" +
				"</div>" +
				"</div>";
			$(".column3_a").append(scoutReport);

			let scoutReport_content = "<table><tbody id='" + SCOUT_TABLE_BODY_ID + "'></tbody></table>";
			$("#scoutReport_content").append(scoutReport_content);
			let tbody = $('#' + SCOUT_TABLE_BODY_ID)[0];

			/*YouthDevelopment*/
			let trYouthDevelopment = document.createElement('tr');
			trYouthDevelopment.className = 'odd';

			let tdYouthDevelopmentLabel = document.createElement('td');
			tdYouthDevelopmentLabel.innerText = '基地潜力 [20]: ';

			let tdYouthDevelopment = document.createElement('td');
			colorTd(tdYouthDevelopment, 'Potential', reportObj.YouthDevelopment);
			tdYouthDevelopment.innerText = reportObj.YouthDevelopment == undefined ? '' : reportObj.YouthDevelopment;

			trYouthDevelopment.appendChild(tdYouthDevelopmentLabel);
			trYouthDevelopment.appendChild(tdYouthDevelopment);
			tbody.appendChild(trYouthDevelopment);

			/*Recommendation*/
			let trRec = document.createElement('tr');

			let tdRecLabel = document.createElement('td');
			tdRecLabel.innerText = '球探评星 [5]: ';

			let tdRec = document.createElement('td');
			colorTd(tdRec, 'Rec', reportObj.Rec);
			tdRec.innerText = reportObj.Rec == undefined ? '' : reportObj.Rec.toFixed(1);

			trRec.appendChild(tdRecLabel);
			trRec.appendChild(tdRec);
			tbody.appendChild(trRec);

			/*Potential*/
			let trPotential = document.createElement('tr');
			trPotential.className = 'odd';

			let tdPotentialLabel = document.createElement('td');
			tdPotentialLabel.innerText = '球探潜力 [20]: ';

			let tdPotential = document.createElement('td');
			colorTd(tdPotential, 'Potential', reportObj.Potential);
			tdPotential.innerText = reportObj.Potential == undefined ? '' : reportObj.Potential;

			trPotential.appendChild(tdPotentialLabel);
			trPotential.appendChild(tdPotential);
			tbody.appendChild(trPotential);

			/*Bloom*/
			let trBloomStatus = document.createElement('tr');

			let tdBloomStatusLabel = document.createElement('td');
			tdBloomStatusLabel.innerText = '成长状态: ';

			let tdBloomStatus = document.createElement('td');
			if(player.Age>=25) {
                tdBloomStatus.innerHTML = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + BLOOM_STATUS_TEXT.BLOOMED + '</span>';
            }
            else {
                tdBloomStatus.innerHTML = reportObj.BloomStatus == undefined ? '' : reportObj.BloomStatus;
            }

			trBloomStatus.appendChild(tdBloomStatusLabel);
			trBloomStatus.appendChild(tdBloomStatus);
			tbody.appendChild(trBloomStatus);

			/*Potential*/
			let trDevStatus = document.createElement('tr');
			trDevStatus.className = 'odd';

			let tdDevStatusLabel = document.createElement('td');
			tdDevStatusLabel.innerText = '发展空间: ';

			let tdDevStatus = document.createElement('td');
			tdDevStatus.innerHTML = reportObj.DevStatus == undefined ? '' : reportObj.DevStatus;

			trDevStatus.appendChild(tdDevStatusLabel);
			trDevStatus.appendChild(tdDevStatus);
			tbody.appendChild(trDevStatus);

			/*Specialty*/
			let trSpecialty = document.createElement('tr');

			let tdSpecialtyLabel = document.createElement('td');
			tdSpecialtyLabel.innerText = '特长: ';

			let tdSpecialty = document.createElement('td');
			tdSpecialty.innerText = reportObj.Specialty == undefined ? '' : reportObj.Specialty;

			trSpecialty.appendChild(tdSpecialtyLabel);
			trSpecialty.appendChild(tdSpecialty);
			tbody.appendChild(trSpecialty);

			/*Physical*/
			let trPeakPhysical = document.createElement('tr');
			trPeakPhysical.className = 'odd';

			let tdPeakPhysicalLabel = document.createElement('td');
			tdPeakPhysicalLabel.innerText = '身体 [4]: ';

			let tdPeakPhysical = document.createElement('td');
			colorTd(tdPeakPhysical, 'PeakPhysical', reportObj.PeakPhysical);
			tdPeakPhysical.innerText = reportObj.PeakPhysical == undefined ? '' : reportObj.PeakPhysical;

			trPeakPhysical.appendChild(tdPeakPhysicalLabel);
			trPeakPhysical.appendChild(tdPeakPhysical);
			tbody.appendChild(trPeakPhysical);

			/*Tactical*/
			let trPeakTactical = document.createElement('tr');

			let tdPeakTacticalLabel = document.createElement('td');
			tdPeakTacticalLabel.innerText = '战术 [4]: ';

			let tdPeakTactical = document.createElement('td');
			colorTd(tdPeakTactical, 'PeakTactical', reportObj.PeakTactical);
			tdPeakTactical.innerText = reportObj.PeakTactical == undefined ? '' : reportObj.PeakTactical;

			trPeakTactical.appendChild(tdPeakTacticalLabel);
			trPeakTactical.appendChild(tdPeakTactical);
			tbody.appendChild(trPeakTactical);

			/*Technical*/
			let trPeakTechnical = document.createElement('tr');
			trPeakTechnical.className = 'odd';

			let tdPeakTechnicalLabel = document.createElement('td');
			tdPeakTechnicalLabel.innerText = '技术 [4]: ';

			let tdPeakTechnical = document.createElement('td');
			colorTd(tdPeakTechnical, 'PeakTechnical', reportObj.PeakTechnical);
			tdPeakTechnical.innerText = reportObj.PeakTechnical == undefined ? '' : reportObj.PeakTechnical;

			trPeakTechnical.appendChild(tdPeakTechnicalLabel);
			trPeakTechnical.appendChild(tdPeakTechnical);
			tbody.appendChild(trPeakTechnical);

			/*Leadership*/
			let trLeadership = document.createElement('tr');

			let tdLeadershipLabel = document.createElement('td');
			tdLeadershipLabel.innerText = '领导力 [20]: ';

			let tdLeadership = document.createElement('td');
			colorTd(tdLeadership, 'Leadership', reportObj.Leadership);
			tdLeadership.innerText = reportObj.Leadership == undefined ? '' : reportObj.Leadership;

			trLeadership.appendChild(tdLeadershipLabel);
			trLeadership.appendChild(tdLeadership);
			tbody.appendChild(trLeadership);

			/*Profession*/
			let trProfession = document.createElement('tr');
			trProfession.className = 'odd';

			let tdProfessionLabel = document.createElement('td');
			tdProfessionLabel.innerText = '职业性 [20]: ';

			let tdProfession = document.createElement('td');
			colorTd(tdProfession, 'Profession', reportObj.Profession);
			tdProfession.innerText = reportObj.Profession == undefined ? '' : reportObj.Profession;

			trProfession.appendChild(tdProfessionLabel);
			trProfession.appendChild(tdProfession);
			tbody.appendChild(trProfession);

			/*Aggression*/
			let trAggression = document.createElement('tr');

			let tdAggressionLabel = document.createElement('td');
			tdAggressionLabel.innerText = '侵略性 [20]: ';

			let tdAggression = document.createElement('td');
			colorTd(tdAggression, 'Aggression', reportObj.Aggression);
			tdAggression.innerText = reportObj.Aggression == undefined ? '' : reportObj.Aggression;

			trAggression.appendChild(tdAggressionLabel);
			trAggression.appendChild(tdAggression);
			tbody.appendChild(trAggression);

			/*LastAgeScout*/
			let trLastAgeScout = document.createElement('tr');
			trLastAgeScout.className = 'odd';

			let tdLastAgeScoutLabel = document.createElement('td');
			tdLastAgeScoutLabel.innerText = '最近球探报告的球员年龄: ';

			let tdLastAgeScout = document.createElement('td');
			if (reportObj.LastAgeScout && reportObj.LastAgeScout < Math.floor(player.Age) && (tdBloomStatus.innerText != BLOOM_STATUS_TEXT.BLOOMED || tdDevStatus.innerText != DEVELOPMENT_STATUS_TEXT.DONE)) {
				tdLastAgeScout.innerHTML = '<span style="color:Darkred">' + reportObj.LastAgeScout + '</span>';
			} else {
				tdLastAgeScout.innerText = reportObj.LastAgeScout == undefined ? '' : reportObj.LastAgeScout;
			}

			trLastAgeScout.appendChild(tdLastAgeScoutLabel);
			trLastAgeScout.appendChild(tdLastAgeScout);
			tbody.appendChild(trLastAgeScout);

			/*PhySum*/
			let trPhySum = document.createElement('tr');

			let tdPhySumLabel = document.createElement('td');
			tdPhySumLabel.innerText = '身体属性和: ';

			let tdPhySum = document.createElement('td');
			colorTd(tdPhySum, 'RatioSkillSum', Math.round(player.SkillSum.PhyRatio * 100));
			tdPhySum.innerText = player.SkillSum.Phy + ' (' + Math.round(player.SkillSum.PhyRatio * 100) + '%)';

			trPhySum.appendChild(tdPhySumLabel);
			trPhySum.appendChild(tdPhySum);
			tbody.appendChild(trPhySum);

			/*TacSum*/
			let trTacSum = document.createElement('tr');
			trTacSum.className = 'odd';

			let tdTacSumLabel = document.createElement('td');
			tdTacSumLabel.innerText = '战术属性和: ';

			let tdTacSum = document.createElement('td');
			colorTd(tdTacSum, 'RatioSkillSum', Math.round(player.SkillSum.TacRatio * 100));
			tdTacSum.innerText = player.SkillSum.Tac + ' (' + Math.round(player.SkillSum.TacRatio * 100) + '%)';

			trTacSum.appendChild(tdTacSumLabel);
			trTacSum.appendChild(tdTacSum);
			tbody.appendChild(trTacSum);

			/*TecSum*/
			let trTecSum = document.createElement('tr');

			let tdTecSumLabel = document.createElement('td');
			tdTecSumLabel.innerText = '技术属性和: ';

			let tdTecSum = document.createElement('td');
			colorTd(tdTecSum, 'RatioSkillSum', Math.round(player.SkillSum.TecRatio * 100));
			tdTecSum.innerText = player.SkillSum.Tec + ' (' + Math.round(player.SkillSum.TecRatio * 100) + '%)';

			trTecSum.appendChild(tdTecSumLabel);
			trTecSum.appendChild(tdTecSum);
			tbody.appendChild(trTecSum);

			/*PhyPeak*/
			let trPhyPeak = document.createElement('tr');
			trPhyPeak.className = 'odd';

			let tdPhyPeakLabel = document.createElement('td');
			tdPhyPeakLabel.innerText = '身体属性上限与目前达到的百分比: ';

			let tdPhyPeak = document.createElement('td');
			tdPhyPeak.innerHTML = calculateSkillPeak(reportObj, player, 'Physical');

			trPhyPeak.appendChild(tdPhyPeakLabel);
			trPhyPeak.appendChild(tdPhyPeak);
			tbody.appendChild(trPhyPeak);

			/*TacPeak*/
			let trTacPeak = document.createElement('tr');

			let tdTacPeakLabel = document.createElement('td');
			tdTacPeakLabel.innerText = '战术属性上限与目前达到的百分比: ';

			let tdTacPeak = document.createElement('td');
			tdTacPeak.innerHTML = calculateSkillPeak(reportObj, player, 'Tactical');

			trTacPeak.appendChild(tdTacPeakLabel);
			trTacPeak.appendChild(tdTacPeak);
			tbody.appendChild(trTacPeak);

			/*TecPeak*/
			let trTecPeak = document.createElement('tr');
			trTecPeak.className = 'odd';

			let tdTecPeakLabel = document.createElement('td');
			tdTecPeakLabel.innerText = '技术属性上限与目前达到的百分比: ';

			let tdTecPeak = document.createElement('td');
			tdTecPeak.innerHTML = calculateSkillPeak(reportObj, player, 'Technical');

			trTecPeak.appendChild(tdTecPeakLabel);
			trTecPeak.appendChild(tdTecPeak);
			tbody.appendChild(trTecPeak);

			/*Note*/
			let trNote = document.createElement('tr');
			let tdNote = document.createElement('td');
			tdNote.colSpan = 2;
			tdNote.innerText = '在Player页面设置球探属性的可信度(需要TMVN Player Train script)';
			tdNote.style = 'color:Darkgray; font-size:smaller; font-style:italic';
			//tdNote.style.color = 'Darkgray';
			//tdNote.style.font-size = 'smaller';
			//tdNote.style.font-style = 'italic';
			trNote.appendChild(tdNote);
			tbody.appendChild(trNote);
		}
	}

	function calculateSkillPeak(report, player, type) {
		let peak,
		ratio,
		peakColor,
		ratioColor,
		reportPeak;
		if (type == 'Physical' && report.PeakPhysical != undefined) {
			reportPeak = report.PeakPhysical;
			if (player.Position != GK_POSITION_TO_CHECK) {
				peak = OUTFIELD_PEAK_PHYSICAL_SKILL_SUM[report.PeakPhysical - 1];
				ratio = Math.round(player.SkillSum.Phy / peak * 100);
			} else {
				peak = GK_PEAK_PHYSICAL_SKILL_SUM[report.PeakPhysical - 1];
				ratio = Math.round(player.SkillSum.Phy / peak * 100);
			}
		} else if (type == 'Tactical' && report.PeakTactical != undefined) {
			reportPeak = report.PeakTactical;
			if (player.Position != GK_POSITION_TO_CHECK) {
				peak = OUTFIELD_PEAK_TACTICAL_SKILL_SUM[report.PeakTactical - 1];
				ratio = Math.round(player.SkillSum.Tac / peak * 100);
			} else {
				peak = GK_PEAK_TACTICAL_SKILL_SUM[report.PeakTactical - 1];
				ratio = Math.round(player.SkillSum.Tac / peak * 100);
			}
		} else if (type == 'Technical' && report.PeakTechnical != undefined) {
			reportPeak = report.PeakTechnical;
			if (player.Position != GK_POSITION_TO_CHECK) {
				peak = OUTFIELD_PEAK_TECHNICAL_SKILL_SUM[report.PeakTechnical - 1];
				ratio = Math.round(player.SkillSum.Tec / peak * 100);
			} else {
				peak = GK_PEAK_TECHNICAL_SKILL_SUM[report.PeakTechnical - 1];
				ratio = Math.round(player.SkillSum.Tec / peak * 100);
			}
		}

		let resultText = '';
		if (peak != undefined) {
			peakColor = colorPeak(reportPeak);
			ratioColor = colorPercent(ratio);
			resultText = '<span style="color: ' + peakColor + '">' + peak + '</span><span style="color: ' + ratioColor + '"> (' + ratio + '%)</span>';
		}
		return resultText;
	}

	function colorPeak(value) {
		let color;
		if (value >= 4) {
			color = SCOUT_LEVEL_COLOR[5];
		} else if (value >= 3) {
			color = SCOUT_LEVEL_COLOR[3];
		} else if (value >= 2) {
			color = SCOUT_LEVEL_COLOR[1];
		} else {
			color = SCOUT_LEVEL_COLOR[0];
		}
		return color;
	}

	function colorPercent(value) {
		let color;
		if (value >= 90) {
			color = PERCENT_PEAK_COLOR[5];
		} else if (value >= 80) {
			color = PERCENT_PEAK_COLOR[4];
		} else if (value >= 70) {
			color = PERCENT_PEAK_COLOR[3];
		} else if (value >= 60) {
			color = PERCENT_PEAK_COLOR[2];
		} else if (value >= 50) {
			color = PERCENT_PEAK_COLOR[1];
		} else {
			color = PERCENT_PEAK_COLOR[0];
		}
		return color;
	}

	function getPlayerSkill(playerId) {
		$.post("//trophymanager.com/ajax/tooltip.ajax.php", {
			"player_id": playerId
		}, function (response) {
			let data = JSON.parse(response);
			player.Id = playerId;
			player.Age = data.player.age; //no need month
			player.Position = data.player.fp;

			let skill = {};
			let skillSum = {};
			if (player.Position != GK_POSITION_TO_CHECK) {
				skill.Strength = getSkill(data.player.skills, 'Strength');
				skill.Stamina = getSkill(data.player.skills, 'Stamina');
				skill.Pace = getSkill(data.player.skills, 'Pace');
				skill.Marking = getSkill(data.player.skills, 'Marking');
				skill.Tackling = getSkill(data.player.skills, 'Tackling');
				skill.Workrate = getSkill(data.player.skills, 'Workrate');
				skill.Positioning = getSkill(data.player.skills, 'Positioning');
				skill.Passing = getSkill(data.player.skills, 'Passing');
				skill.Crossing = getSkill(data.player.skills, 'Crossing');
				skill.Technique = getSkill(data.player.skills, 'Technique');
				skill.Heading = getSkill(data.player.skills, 'Heading');
				skill.Finishing = getSkill(data.player.skills, 'Finishing');
				skill.Longshots = getSkill(data.player.skills, 'Longshots');
				skill.SetPieces = getSkill(data.player.skills, 'Set Pieces');

				skillSum.Phy = skill.Strength + skill.Stamina + skill.Pace + skill.Heading;
				skillSum.Tac = skill.Marking + skill.Tackling + skill.Positioning + skill.Workrate;
				skillSum.Tec = skill.Passing + skill.Crossing + skill.Technique + skill.Finishing + skill.Longshots + skill.SetPieces;
				skillSum.PhyMax = 80;
				skillSum.TacMax = 80;
				skillSum.TecMax = 120;
			} else {
				skill.Strength = getSkill(data.player.skills, 'Strength');
				skill.Stamina = getSkill(data.player.skills, 'Stamina');
				skill.Pace = getSkill(data.player.skills, 'Pace');
				skill.Handling = getSkill(data.player.skills, 'Handling');
				skill.OneOnOnes = getSkill(data.player.skills, 'One on ones');
				skill.Reflexes = getSkill(data.player.skills, 'Reflexes');
				skill.AerialAbility = getSkill(data.player.skills, 'Aerial Ability');
				skill.Jumping = getSkill(data.player.skills, 'Jumping');
				skill.Communication = getSkill(data.player.skills, 'Communication');
				skill.Kicking = getSkill(data.player.skills, 'Kicking');
				skill.Throwing = getSkill(data.player.skills, 'Throwing');

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
			getScoutInfo(playerId);
		});
	}

	function getSkill(data, skill) {
		let result;
		data.forEach(element => {
			if (element.name == skill) {
				if (isNaN(element.value)) {
					if (element.value.indexOf('star_silver') >= 0) {
						result = 19;
					} else if (element.value.indexOf('star') >= 0) {
						result = 20;
					}
				} else {
					result = element.value;
				}
				return;
			}
		});
		return result;
	}

	function getScoutInfo(playerId) {
		$.post("//trophymanager.com/ajax/players_get_info.ajax.php", {
			"type": "scout",
			"player_id": playerId
		}, function (response) {
			let data = JSON.parse(response);
			getScout(data);
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
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + BLOOM_STATUS_TEXT.BLOOMED + '</span>';
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
                            if (Number(report.report_age) === 20) {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_LATE_BLOOMER + '">21/22-23/24</span>';
                            }
                            else {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_LATE_BLOOMER + '">20/22-22/24</span>';
                            }
						} else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_NORMAL_BLOOMER) {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_NORMAL_BLOOMER + '">18/19-20/21</span>';
						} else {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_EARLY_BLOOMER + '">16/17-18/19</span>';
						}

						if (report.dev_status == DEVELOPMENT_STATUS_TEXT.DONE) {
							reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.DONE + '">' + report.dev_status + '</span>';
						} else if (report.dev_status == DEVELOPMENT_STATUS_TEXT.MOSTLY_DONE) {
							reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.MOSTLY_DONE + '">' + report.dev_status + '</span>';
						} else if (report.dev_status == DEVELOPMENT_STATUS_TEXT.MIDDLE) {
							reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.MIDDLE + '">' + report.dev_status + '</span>';
						} else if (report.dev_status == DEVELOPMENT_STATUS_TEXT.MOSTLY_AHEAD) {
							reportObj.DevStatus = '<span style="color: ' + DEVELOPMENT_STATUS_COLOR.MOSTLY_AHEAD + '">' + report.dev_status + '</span>';
						} else {
							reportObj.DevStatus = '<span>' + report.dev_status + '</span>';
						}
					}
					if (Number(report.report_age) >= 25) {
                        reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + BLOOM_STATUS_TEXT.BLOOMED + '</span>';
                    }
                    if (scout.development >= SCOUT_RELIABLE_SKILL.DEVELOPMENT) {

						let startBloomAge = calculateBloomAge(report);

						if (report.bloom_status_txt == BLOOM_STATUS_TEXT.BLOOMED || (startBloomAge != null && (startBloomAge + 2 < Math.floor(player.Age)))) {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.BLOOMED + '">' + BLOOM_STATUS_TEXT.BLOOMED + '</span>';
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
                            if (Number(report.report_age) === 20) {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_LATE_BLOOMER + '">21/22-23/24</span>';
                            }
                            else {
                                reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_LATE_BLOOMER + '">20/22-22/24</span>';
                            }
						}
                        else if (report.bloom_status_txt == BLOOM_STATUS_TEXT.NOT_YET_NORMAL_BLOOMER) {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_NORMAL_BLOOMER + '">18/19-20/21</span>';
						}
                        else {
							reportObj.BloomStatus = '<span style="color: ' + BLOOM_STATUS_COLOR.NOT_YET_EARLY_BLOOMER + '">16/17-18/19</span>';
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
		for (let propt in data.scouts) {
			let scout = data.scouts[propt];
			scoutMap.set(scout.id, scout);
		}
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
			}
		}
	}
})();
