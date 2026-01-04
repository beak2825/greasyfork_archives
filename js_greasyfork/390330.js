// ==UserScript==
// @name        	thb_player_details
// @namespace   	csi416_namespace
// @description 	many useful functions to individual players pages
// @include     	*teamhb.org/index.php?page=team&subpage=pldetails*&playerid=*
// @version     	1
// @grant       	none
// @downloadURL https://update.greasyfork.org/scripts/390330/thb_player_details.user.js
// @updateURL https://update.greasyfork.org/scripts/390330/thb_player_details.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var profile_tab = document.getElementById("profile");
	var stats_tab = document.getElementById("stats");
	var trdetails_tab = document.getElementById("trdetails");

	var tbody_profile = profile_tab.children[0].children[0];

	var WE = profile_tab.children[0].children[0].children[8].children[1].children[0].innerHTML;
	// xy is right-handed/left-handed ...
	var preferred_hand = tbody_profile.children[12].children[0].children[0].innerHTML;

	var home_wrapper = document.getElementById("home_wrapper");
	var idx = 2;
	if (home_wrapper.children[0].children.length != 4) {
		idx = 4;
	}
	var td_AgeAndPosition = home_wrapper.children[0].children[idx].children[0].children[0].children[0].children[1].children[0].children[0].children[2].children[0].innerHTML
	var Age = parseInt(td_AgeAndPosition.substring(0, 2));
	var td_AgeAndPosition_Length = td_AgeAndPosition.length;
	var Position = td_AgeAndPosition.substring(td_AgeAndPosition_Length - 10);
	
	var Bc = tbody_profile.children[1].children[1].children[0].innerHTML;
	var Pa = tbody_profile.children[2].children[1].children[0].innerHTML;
	var Sh = tbody_profile.children[3].children[1].children[0].innerHTML;
	var Ob = tbody_profile.children[4].children[1].children[0].innerHTML;
	var Tq = tbody_profile.children[5].children[1].children[0].innerHTML;
	var Pm = tbody_profile.children[1].children[3].children[0].innerHTML;
	var Ma = tbody_profile.children[2].children[3].children[0].innerHTML;
	var Bl = tbody_profile.children[3].children[3].children[0].innerHTML;
	var Ag = tbody_profile.children[1].children[5].children[0].innerHTML;
	var Sp = tbody_profile.children[2].children[5].children[0].innerHTML;
	var St = tbody_profile.children[3].children[5].children[0].innerHTML;
	var Ju = tbody_profile.children[4].children[5].children[0].innerHTML;
	var Sm = tbody_profile.children[5].children[5].children[0].innerHTML;
	var Re = tbody_profile.children[4].children[3].children[0].innerHTML;
	var Oo = tbody_profile.children[5].children[3].children[0].innerHTML;

	// profile tab
	SetLefhanders();
	SetNervousColor();
	
	// stats tab
	SetStatsPercent();
	SetOther();
	
	// default coach level
	var coach = 20;
	// trainig details tab
	CreateCoachLevelSelectList();
	
	var tr_trdetails = trdetails_tab.children[0].children[0].children;
	
	for (var i = 1; i < tr_trdetails.length; i++) {
		
		var img = tr_trdetails[i].children[2].children[0].getAttribute("src");
		
		//"images/icons/progress_not.png"
		if (img == "images/icons/progress_not.png") {
			SetLimitedSkillColor(tr_trdetails[i]);
		}
		
		var tr_trprogress = tr_trdetails[i].children[1].children[0].children[0].children[0];
		var training = 0;
		
		while (tr_trprogress.children[training].getAttribute('bgcolor') != null) {
			training++;
		}
		
		/*var focusValue = 0;
		if (i > 0 && i <= 4) {
			focusValue = parseInt(WE) + parseInt(coach) * 2 + 10;
			focusValue = focusValue * 0.9 * 0.7;
		}
		if (i > 4 && i <= 10) {
			focusValue = parseInt(WE) + parseInt(coach) * 2 + 10;
			focusValue = focusValue * 0.9 * 0.75;
		}
		if (i > 10) {
			focusValue = parseInt(WE) + parseInt(coach) * 2 + 10;
			focusValue = focusValue * 0.9 * 0.65;
		}
		var trcalc = parseInt(training) + parseInt(focusValue);
		var title = training + " -> " + trcalc.toFixed(0);*/
		
		tr_trprogress.setAttribute('title', training);
		
		tr_trprogress.onmouseover = SetTrainingCalculated;
		tr_trprogress.onmouseout = SetOriginalBackgroundColors;
	}

	function SetLimitedSkillColor(tr) {
		var act_skill = tr.children[0].innerHTML;
		var k = 1;
		while (k <= 5) {
			for (var l = 0; l < 6; l = l + 2) {
				var act_html = tbody_profile.children[k].children[l].innerHTML;
				if (act_html == act_skill) {
					tbody_profile.children[k].children[l + 1].children[0].style.color = "#FF00FF";
					l = 6;
					k = 6;
				}
			}
			k++;
		}
	}

	function SetTrainingCalculated() {
		var training = parseInt(this.getAttribute("title").substring(0, 2));
		var originalBgColor = this.children[training].getAttribute("bgcolor");
		this.children[training].setAttribute("original_bgcolor", originalBgColor);
		this.children[training].setAttribute("bgcolor", "#00a0ff");
		var i = training + 1;
		var trainingType = this.parentNode.parentNode.parentNode.parentNode.children[0].innerHTML;
		var focusValue = 0;
		coach = document.getElementById("coach_level").value;
		focusValue = parseInt(WE) + parseInt(coach) * 2 + 10;
		if (trainingType == "Ball control"
		   || trainingType == "Passing"
		   || trainingType == "Shooting"
		   || trainingType == "Off the ball") {
			focusValue = focusValue * 0.7;
		}
		if (trainingType == "Blocking"
		   || trainingType == "Marking"
		   || trainingType == "Technique"
		   || trainingType == "Playmaking"
		   || trainingType == "Reflexes"
		   || trainingType == "One on one") {
			focusValue = focusValue * 0.75;
		}
		if (trainingType == "Agility"
		   || trainingType == "Speed"
		   || trainingType == "Strength"
		   || trainingType == "Jumping"
		   || trainingType == "Stamina") {
			focusValue = focusValue * 0.65;
				  // +20% from phys centre
				  focusValue = focusValue * 1.2;
		}
		// Age influence
		if (Age == 28) {
			focusValue = focusValue * 0.9;
		}
		if (Age == 29) {
			focusValue = focusValue * 0.8;
		}
		if (Age == 30) {
			focusValue = focusValue * 0.6;
		}
		if (Age == 31) {
			focusValue = focusValue * 0.4;
		}
		if (Age == 32) {
			focusValue = focusValue * 0.2;
		}
		if (Age > 32) {
			focusValue = 0;
		}
		
		focusValue = Math.round(focusValue);
		var j = training + focusValue - 1;
		
		while (i < 100 && i < j) {
			originalBgColor = this.children[i].getAttribute("bgcolor");
			this.children[i].setAttribute("original_bgcolor", originalBgColor);
			var mod = i % 2;
			if (mod == 0) {
				this.children[i].setAttribute("bgcolor", "#ffffff");
			}
			else {
				this.children[i].setAttribute("bgcolor", "#000000");
			}
			i++;
		}
		if (j >= 100) {
			j -= 100;
			for (i = 0; i < j; i++) {
				originalBgColor = this.children[i].getAttribute("bgcolor");
				this.children[i].setAttribute("original_bgcolor", originalBgColor);
				mod = i % 2;
				if (mod == 0) {
					this.children[i].setAttribute("bgcolor", "#ffffff");
				}
				else {
					this.children[i].setAttribute("bgcolor", "#000000");
				}
			}
		}
		originalBgColor = this.children[i].getAttribute("bgcolor");
		this.children[i].setAttribute("original_bgcolor", originalBgColor);
		this.children[i].setAttribute("bgcolor", "#00a0ff");
		var title = training + " -> " + (training + focusValue).toString();
		this.setAttribute("title", title);
	}

	function SetOriginalBackgroundColors () {
		for (i = 0; i < 100; i++) {
			var originalBgColor = this.children[i].getAttribute("original_bgcolor");
			if (originalBgColor != null) {
				if (originalBgColor == "null") {
					this.children[i].removeAttribute("bgcolor");
				}
				else {
					this.children[i].setAttribute("bgcolor", originalBgColor);
				}
			}
		}
	}
	function SetLefhanders() {
		if (preferred_hand == "left-handed") {
			var pos_tr = tbody_profile.children[11].children[0].children[0].children[0].children[0];
			var pos_tr_1 = pos_tr.children[0];
			pos_tr.removeChild(pos_tr_1);
			pos_tr.appendChild(pos_tr_1);
			pos_tr.children[0].setAttribute("align", "left");
			pos_tr.children[1].setAttribute("align", "right");
			
			var han_tr = tbody_profile.children[12].children[0];
			han_tr.setAttribute("align", "right");
			
			var ner_tr = tbody_profile.children[13].children[0];
			ner_tr.setAttribute("align", "right");
		}
	}

	function SetNervousColor() {
		var ner_td = tbody_profile.children[13].children[0];
		var ner = ner_td.children[0].innerHTML;

		if (ner == "ice-cold") {
			ner_td.style.color = "#009900";
		}
		if (ner == "a bit nervous") {
			ner_td.style.color = "#0000FF";
		}
		if (ner == "very nervous") {
			ner_td.style.color = "#CC0000";
		}
	}

	function SetOther() {
	    var talent_stars;
		var talent;
	    if (idx == 2) {
			talent_stars = home_wrapper.children[0].children[2].children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[2].children[1].children[0].getAttribute("src").substring(13,16); 
			var alap = parseInt(talent_stars.substring(0,1)) * 2;  
			if (talent_stars.substring(2) == "h") {
				alap-=1;
			}
			talent = alap + 10;
	    }
	    else {
			CreateTranferListedPlayerTalentSelectList();
			talent = document.getElementById("transfer_listed_player_talent").value;
	    }
		
		var need_to_max_talent = CalculateNeedToMaxTalent(talent, Position);
		
		// 2019.09.09. 04:00:00
		// month parameter is between 0..11, 0 -> January, ...8 -> September
		// var s27LastTrainingDate = new Date(2019, 8, 9, 4, 0);
		// 2024.06.10. 04:00:00
        	var s41LastTrainingDate = new Date(2024, 5, 10, 4, 0);

		var milliseconds = (new Date()).valueOf() - s41LastTrainingDate.valueOf();
		var days = milliseconds / (1000 * 60 * 60 * 24);
		var weeks = Math.floor(days / 7);
		var weeksInActualSeason = weeks % 19;
		var trainingsInActualSeason = 19 - weeksInActualSeason;
		var trainingPointsInActualSeason = (parseInt(WE) + 50) * trainingsInActualSeason;

		var remainingFullSeasons = 0;
		if (Age < 28) {
			// without this year
			remainingFullSeasons = 27 - Age + 2.9;
		}
		else if (Age == 28) {
			// widthout this year
			remainingFullSeasons = 0.8 + 0.6 + 0.4 + 0.2;
			trainingPointsInActualSeason *= 0.9;
		}
		else if (Age == 29) {
			// widthout this year
			remainingFullSeasons = 0.6 + 0.4 + 0.2;
			trainingPointsInActualSeason *= 0.8;
		}
		else if (Age == 30) {
			// widthout this year
			remainingFullSeasons = 0.4 + 0.2;
			trainingPointsInActualSeason *= 0.6;
			}
		else if (Age == 31) {
			// widthout this year
			remainingFullSeasons = 0.2;
			trainingPointsInActualSeason *= 0.4;
		}
		else if (Age == 32) {
			trainingPointsInActualSeason *= 0.2;
			}
		else if (Age > 32){
			trainingPointsInActualSeason = 0;
		}
		remainingFullSeasons *= 19;
		var trainingPointsInRemainingFullSeasons = (parseInt(WE) + 50) * remainingFullSeasons;
		var from_training = Math.floor((trainingPointsInRemainingFullSeasons / 100) + (trainingPointsInActualSeason / 100));
		
		var sum_of_all_skills = 0;
        	if (Position == "goalkeeper") {
			// Tq + GK + Physical
			sum_of_all_skills = parseInt(Tq) + parseInt(Oo) + parseInt(Re) + parseInt(Ag) + parseInt(Sp) + parseInt(St) + parseInt(Ju) + parseInt(Sm);
		}
		else if (Position == "enter back") {
			// Attack + Playmaker + Defense + Physical
			sum_of_all_skills = parseInt(Bc) + parseInt(Pa) + parseInt(Sh) + parseInt(Ob) + parseInt(Tq) + parseInt(Pm) + 
				parseInt(Bl) + parseInt(Ma) + parseInt(Ag) + parseInt(Sp) + parseInt(St) + parseInt(Ju) + parseInt(Sm);
		}
		else {
			// Attack + Tq + Defense + Physical
			sum_of_all_skills = parseInt(Bc) + parseInt(Pa) + parseInt(Sh) + parseInt(Ob) + parseInt(Tq) + 
				parseInt(Bl) + parseInt(Ma) + parseInt(Ag) + parseInt(Sp) + parseInt(St) + parseInt(Ju) + parseInt(Sm);
		}
		
		var td_SetOther01 = CreateTd1("Need to max talent", "#edeae1");
		var td_SetOther02 = CreateTd2(need_to_max_talent, "#e8e6d4", "font_need_to_max_talent");
		var talent_skills = GetNeedToMaxTalentByPosition(talent, Position);
		var nyuggerPhis = GetNeedToMinPhysical();
		var sum = talent_skills + nyuggerPhis;
		td_SetOther02.setAttribute("title", sum);
		var td_SetOther03 = CreateTd1("From training", "#edeae1");
		var td_SetOther04 = CreateTd2(from_training, "#e8e6d4", "");
		var td_SetOther05 = CreateTd1("Sum of all skills", "#edeae1");
		var td_SetOther06 = CreateTd2(sum_of_all_skills, "#e8e6d4", "");
		var tr_dummy = document.createElement("tr");
		tr_dummy.appendChild(td_SetOther01);
		tr_dummy.appendChild(td_SetOther02);
		tr_dummy.appendChild(td_SetOther03);
		tr_dummy.appendChild(td_SetOther04);
		tr_dummy.appendChild(td_SetOther05);
		tr_dummy.appendChild(td_SetOther06);
		tbody_profile.insertBefore(tr_dummy, tbody_profile.children[9]);
		
	}

	function CreateTd1(innerHtml, bgColor) {
		var td_CreateTd = document.createElement("td");
		td_CreateTd.setAttribute("valign", "middle");
		td_CreateTd.setAttribute("bgcolor", bgColor);
		td_CreateTd.setAttribute("align", "left");
		td_CreateTd.setAttribute("style", "font-family: verdana, arial, sans-serif; font-size: 12px; padding-left: 2px;");
		td_CreateTd.innerHTML = innerHtml;
		return td_CreateTd;
	}

	function CreateTd2(innerHtml, bgColor, id) {
		var td_CreateTd = document.createElement("td");
		td_CreateTd.setAttribute("valign", "middle");
		td_CreateTd.setAttribute("bgcolor", bgColor);
		td_CreateTd.setAttribute("align", "center");
		//td_CreateTd.setAttribute("style", "font-family: verdana, arial, sans-serif; font-size: 12px; padding-left: 2px;");
		var font_CreateTd = document.createElement("font");
		font_CreateTd.setAttribute("style", "font-family: verdana, arial, sans-serif; font-size: 12px; color: #008800; font-weight: bold;");
		font_CreateTd.innerHTML = innerHtml;
		if (id != "") {
			font_CreateTd.id = id;
		}
		td_CreateTd.appendChild(font_CreateTd);
		return td_CreateTd;
	}

	function SetStatsPercent() {
		var statsLength = stats_tab.children.length;

		for (var i = 1; i < statsLength; i++) {
			SetStatsPercentOneSeason(stats_tab.children[i]);
		}
	}

	function SetStatsPercentOneSeason(div_stats) {
		var tr_stats = div_stats.children[0].children[0].children;

		var stat_games = tr_stats[0].children[1].innerHTML;

		if (stat_games != "0") {
			var times_played = tr_stats[0].children[3].innerHTML;
			var percent = (parseInt(times_played) * 10) / (parseInt(stat_games) * 6);
			var td_games = document.createElement("td");
			td_games.setAttribute("width", "64");
			td_games.setAttribute("valign", "middle");
			td_games.setAttribute("bgcolor", "#edeae1");
			td_games.setAttribute("align", "center");
			td_games.setAttribute("style", "font-family: verdana, arial, sans-serif; font-size: 12px; color: #000000; font-weight: bold;");
			var s = percent.toString();
			if (s.length > 2) {
				if (s.substring(1, 2) == ".") {
					//s.substring(0, 5)
					s = s.substring(0, 4);
				}
				else {
					s = s.substring(0, 5);
				}
			}
			s = s + "%";
			td_games.innerHTML = s;
			tr_stats[0].appendChild(td_games);
			
			for (var tr_index = 1; tr_index < 5; tr_index++) {
				var osszes = tr_stats[tr_index].children[1].innerHTML;
				if (osszes != "0") {
					var szazalek = tr_stats[tr_index].children[3].innerHTML;
					percent = (parseInt(szazalek) * 100) / parseInt(osszes);
					
					var td_stats = document.createElement("td");
					td_stats.setAttribute("width", "64");
					td_stats.setAttribute("valign", "middle");
					var bgcolor = tr_stats[tr_index].children[1].getAttribute("bgcolor");
					td_stats.setAttribute("bgcolor", bgcolor);
					td_stats.setAttribute("align", "center");
					td_stats.setAttribute("style", "font-family: verdana, arial, sans-serif; font-size: 12px; color: #000000; font-weight: bold;");
					s = percent.toString();
					if (s.length > 2) {
						if (s.substring(1, 2) == ".") {
							//s.substring(0, 5)
							s = s.substring(0, 4);
						}
						else {
							s = s.substring(0, 5);
						}
					}
					s = s + "%";
					td_stats.innerHTML = s;
					tr_stats[tr_index].appendChild(td_stats);
					
				}
			}
			
			for (tr_index = 6; tr_index < 10; tr_index++) {
				var conceded = tr_stats[tr_index].children[1].innerHTML;
				var saved = tr_stats[tr_index].children[3].innerHTML;
				osszes = parseInt(conceded) + parseInt(saved);
				if (osszes != 0) {
					//szazalek = tr_stats[tr_index].children[3].innerHTML;
					percent = (parseInt(saved) * 100) / parseInt(osszes);

					td_stats = document.createElement("td");
					td_stats.setAttribute("width", "64");
					td_stats.setAttribute("valign", "middle");
					td_stats.setAttribute("bgcolor", "#edeae1");
					td_stats.setAttribute("align", "center");
					td_stats.setAttribute("style", "font-family: verdana, arial, sans-serif; font-size: 12px; color: #000000; font-weight: bold;");
					s = percent.toString();
					if (s.length > 2) {
						if (s.substring(1, 2) == ".") {
							//s.substring(0, 5)
							s = s.substring(0, 4);
						}
						else {
							s = s.substring(0, 5);
						}
					}
					s = s + "%";
					td_stats.innerHTML = s;
					tr_stats[tr_index].appendChild(td_stats);
					
				}
			}
			
			tr_stats[10].children[0].style.color = "#A68400";
			tr_stats[10].children[1].style.color = "#A68400";
			tr_stats[10].children[2].style.color = "#FF0000";
			tr_stats[10].children[3].style.color = "#FF0000";
			tr_stats[11].children[0].style.color = "#C67D33";
			tr_stats[11].children[1].style.color = "#C67D33";
			
		}
		
	}
	
	function CreateCoachLevelSelectList() {
		var label = document.createElement("label");
		label.innerHTML = "coach level:";
		label.setAttribute("style", "margin-left:115px");
		var selectList = document.createElement("select");
		selectList.id = "coach_level";
		var elem = trdetails_tab.children[0].children[0].children[0].children[0];
		elem.appendChild(label);
		elem.appendChild(selectList);
		
		for (var i = 1; i < 21; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.text = i;
			selectList.appendChild(option);
		}
		
		selectList.children[coach - 1].setAttribute("selected", "selected");
	}
	
	function CreateTranferListedPlayerTalentSelectList() {
		var talentSelectList = document.createElement("select");
		talentSelectList.id = "transfer_listed_player_talent";
		var positionSelectList = document.createElement("select");
		positionSelectList.id = "transfer_listed_player_position";
		var elem = home_wrapper.children[0].children[idx].children[0].children[0].children[0].children[2].children[0].children[0].children[0].children[2].children[1];
		elem.removeChild(elem.children[0]);
		elem.appendChild(talentSelectList);
		elem.appendChild(positionSelectList);
		var minTalent = CalculateMinimumTalent();
		for (var i = minTalent; i < 21; i++) {
			var option = document.createElement("option");
			option.value = i;
			option.text = i;
			talentSelectList.appendChild(option);
		}
		
		talentSelectList.children[0].setAttribute("selected", "selected");
		talentSelectList.onchange = RefreshNeedToMaxTalent;
		
		var option1 = document.createElement("option");
		option1.value = "goalkeeper";
		option1.text = "Goalkeeper";
		positionSelectList.appendChild(option1);
		var option2 = document.createElement("option");
		option2.value = "enter back";
		option2.text = "Playmaker";
		positionSelectList.appendChild(option2);
		var option3 = document.createElement("option");
		option3.value = "fieldplayer";
		option3.text = "Fieldplayer";
		positionSelectList.appendChild(option3);
		
		var selected_idx;
        	if (Position == "goalkeeper") {
			selected_idx = 0;
		}
		else if (Position == "enter back") {
			selected_idx = 1;
		}
		else {
			selected_idx = 2;
		}
		positionSelectList.children[selected_idx].setAttribute("selected", "selected");
		positionSelectList.onchange = RefreshNeedToMaxTalent;
	}
	
	function RefreshNeedToMaxTalent() {
		var font_need_to_max_talent = document.getElementById("font_need_to_max_talent");
		var talent = document.getElementById("transfer_listed_player_talent").value;
		var position = document.getElementById("transfer_listed_player_position").value;
		var need_to_max_talent = CalculateNeedToMaxTalent(talent, position);
		font_need_to_max_talent.innerHTML = need_to_max_talent;
		var talent_skills = GetNeedToMaxTalentByPosition(talent, position);
		var nyuggerPhis = GetNeedToMinPhysical();
		var sum = talent_skills + nyuggerPhis;
		font_need_to_max_talent.parentNode.setAttribute("title", sum);
	}
	
	function GetNeedToMaxTalentByPosition(talent, position) {
		// skills needed to max talent by position
		var talent_skills;
		if (position == "goalkeeper") {
			talent_skills = 3 * talent - Re - Oo - Tq;
		}
		else if (position == "enter back") {
			talent_skills = 8 * talent - Bc - Pa - Sh - Ob - Tq - Pm - Ma - Bl;
		}
		else {
			talent_skills = 7 * talent - Bc - Pa - Sh - Ob - Tq - Ma - Bl;
		}
		return talent_skills;
	}
	
	function GetNeedToMinPhysical() {
		var nyuggerAg = 13 - Ag;
		if (nyuggerAg < 0) nyuggerAg = 0;
		var nyuggerSp = 13 - Sp;
		if (nyuggerSp < 0) nyuggerSp = 0;
		var nyuggerSt = 13 - St;
		if (nyuggerSt < 0) nyuggerSt = 0;
		var nyuggerJu = 13 - Ju;
		if (nyuggerJu < 0) nyuggerJu = 0;
		var nyuggerSm = 13 - Sm;
		if (nyuggerSm < 0) nyuggerSm = 0;
		
		var nyuggerPhis = nyuggerAg + nyuggerSp + nyuggerSt + nyuggerJu + nyuggerSm;
		return nyuggerPhis;
	}
	
	function CalculateNeedToMaxTalent(talent, position) {
		var talent_skills = GetNeedToMaxTalentByPosition(talent, position);
		
		var nyuggerPhis = GetNeedToMinPhysical();
		
		var str_talent_skills = talent_skills.toString();
		var str_nyuggerPhis = nyuggerPhis.toString();
		
		return str_talent_skills + "(" + str_nyuggerPhis + ")";
	}
	
	function CalculateMinimumTalent() {
		var retval;
		
		retval = 11;
		if (retval < parseInt(Bc)) retval = parseInt(Bc);
		if (retval < parseInt(Pa)) retval = parseInt(Pa);
		if (retval < parseInt(Sh)) retval = parseInt(Sh);
		if (retval < parseInt(Ob)) retval = parseInt(Ob);
		if (retval < parseInt(Tq)) retval = parseInt(Tq);
		if (retval < parseInt(Pm)) retval = parseInt(Pm);
		if (retval < parseInt(Ma)) retval = parseInt(Ma);
		if (retval < parseInt(Bl)) retval = parseInt(Bl);
		if (retval < parseInt(Re)) retval = parseInt(Re);
		if (retval < parseInt(Oo)) retval = parseInt(Oo);
		
		return retval;
	}
	
})();
