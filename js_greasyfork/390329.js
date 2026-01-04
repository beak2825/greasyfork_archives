// ==UserScript==
// @name        	thb_match_formations_average
// @namespace   	csi416_namespace
// @description 	get average value for defense and attack in formation tabs in match reports and set tooltip to players match rating stars
// @include     	*teamhb.org/index.php?page=match_formations&match_id=*
// @version     	1
// @grant       	none
// @downloadURL https://update.greasyfork.org/scripts/390329/thb_match_formations_average.user.js
// @updateURL https://update.greasyfork.org/scripts/390329/thb_match_formations_average.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	var formation_0 = document.getElementById("formation_0");
	var formation_1 = document.getElementById("formation_1");
	var formation_2 = document.getElementById("formation_2");

	SetFormationStars(formation_0);
	SetFormationStars(formation_1);
	SetFormationStars(formation_2);

	function SetFormationStars (formation) {
		for (var i = 3; i < formation.children.length; i = i + 3) {
			var div_star = formation.children[i];
			var div_star_left = div_star.style.left;
			var div_star_left_int = parseInt(div_star_left.substring(0, div_star_left.length - 2));
			var div_star_width = div_star.style.width;
			var div_star_width_int = parseInt(div_star_width.substring(0, div_star_width.length - 2));
			// const for div star width: 70
			const new_div_star_width = 70;
			div_star.style.width = new_div_star_width + "px";
			var new_left_star = div_star_left_int + (div_star_width_int - new_div_star_width) / 2;
			div_star.style.left = new_left_star + "px";
			var star_img = div_star.children[0];
			var src = star_img.getAttribute("src");
			var star = src.substring(26, 28);
			if (star.substring(1, 2) == ".") {
			    star = star.substring(0, 1);
			}
			var fele = parseInt(star) / 2;
			star_img.setAttribute("title", fele);
			var div_name = formation.children[i - 1];
			var div_name_left = div_name.style.left;
			var div_name_left_int = parseInt(div_name_left.substring(0, div_name_left.length - 2));
			var div_name_width = div_name.style.width;
			var div_name_width_int = parseInt(div_name_width.substring(0, div_name_width.length - 2));
			// const for div name width: 140
			const new_div_name_width = 140;
			div_name.style.width = new_div_name_width + "px";
			var new_left_name = div_name_left_int + (div_name_width_int - new_div_name_width) / 2;
			div_name.style.left = new_left_name + "px";
		}
	}

	function CalcAvgAtt(formation){
		var avg_attack = 0;
		for (var i = 24; i < formation.children.length; i = i + 3) {
			var x = formation.children[i].children[0].getAttribute("src").substring(26, 28);
			if (x.substring(1, 2) == ".") {
			  x = x.substring(0, 1);
			}
			var fele = parseInt(x) / 2;
			avg_attack += fele;
		}
		avg_attack /= 6;
		avg_attack = Math.round(avg_attack * 100) / 100;
		return avg_attack;
	}

	function CalcAvgDef(formation){
		var avg_defense = 0;
		for (var i = 6; i < 23; i = i + 3) {
			var x = formation.children[i].children[0].getAttribute("src").substring(26, 28);
			if (x.substring(1, 2) == ".") {
			  x = x.substring(0, 1);
			}
			var fele = parseInt(x) / 2;
			avg_defense += fele;
		}
		avg_defense /= 6;
		avg_defense = Math.round(avg_defense * 100) / 100;
		return avg_defense;
	}

	function SetAvgControl(formation) {
		var att = CalcAvgAtt(formation);
		if (att != 0) {
			var img_att = Math.round(att * 2);
			var border_attack1 = CreateBorder(60, att, img_att);
			formation.appendChild(border_attack1);
			var def = CalcAvgDef(formation);
			var img_def = Math.round(def * 2);
			var border_defense1 = CreateBorder(250, def, img_def);
			formation.appendChild(border_defense1);
		}
	}

	function SetAvgControl1() {
		SetAvgControl(formation_0);
	}

	function SetAvgControl2() {
		SetAvgControl(formation_1);
	}

	function SetAvgControl3() {
		SetAvgControl(formation_2);
	}

	SetAvgControl1();
	var form_button1 = document.getElementById("form_button1");
	var form_button2 = document.getElementById("form_button2");
	var form_button3 = document.getElementById("form_button3");
	form_button1.addEventListener("click", SetAvgControl1);
	form_button2.addEventListener("click", SetAvgControl2);
	form_button3.addEventListener("click", SetAvgControl3);

	function CreateBorder(top, avg, img) {
		var border = document.createElement("div");
		border.setAttribute("style", "border:1px solid black;border-radius:8px;position:absolute;top:" + top + "px;left:500px;width:58px;height:44px");

		var div_attack = document.createElement("div");
		div_attack.setAttribute("style", "margin:2px");
		div_attack.setAttribute("align", "center");
		div_attack.innerHTML = avg;

		var div_img_attack = document.createElement("div");
		div_img_attack.setAttribute("align", "center");
		var img_attack = document.createElement("img");
		var img_src = "http://www.teamhb.org/images/match/ratings/stars" + img + ".gif"
		img_attack.setAttribute("src", img_src);
		img_attack.setAttribute("align", "center");
		div_img_attack.appendChild(img_attack)
		border.appendChild(div_attack);
		border.appendChild(div_img_attack);
		return border;
	}

})();
