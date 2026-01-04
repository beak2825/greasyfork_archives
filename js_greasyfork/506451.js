// ==UserScript==
// @name           Player Value On Skill Point Page
// @namespace      pbr/pvsp
// @match          https://glb.warriorgeneral.com/game/skill_points.pl?player_id=*
// @copyright      2024, gashouse
// @license        (CC) Attribution Share Alike; http://creativecommons.org/licenses/by-sa/3.0/
// @version        24.08.29
// @description Calculates the player value from the skill point page. Corrected and fine tuned some math and many variable global glitches.
// @downloadURL https://update.greasyfork.org/scripts/506451/Player%20Value%20On%20Skill%20Point%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/506451/Player%20Value%20On%20Skill%20Point%20Page.meta.js
// ==/UserScript==

window.setTimeout( 
    function() {
	var att = document.getElementById("attribute_list");
	    att.getElementsByClassName("medium_head")[0].addEventListener("click",main,true);

        main();
    }
, 100);

function getAbilitiesCost(level,min) {
    var cost = 0;
    for (var i=0; i<level; i++) {
    	cost += min + (Math.round((i-1)/2.0));
    }
	//console.log(level+" : "+min+" = "+cost);
    return cost;
}

function getSkillsCost(score) {
	var caps = [0,48.06,60.51,67.97,73.24,77.28,80.53,83.25,85.58,87.60,
                89.40,91.01,92.46,93.79,95.00,96.13,97.18,98.15,99.06,99.92,
                100.73,101.50,102.23,102.92,103.58,104.21,104.81,105.39,105.94,
                106.47,106.98,107.47,107.94,108.39,108.82,109.23,109.62,109.99,110.34,
                110.67,110.98,111.27,111.54,111.79,112.02,112.23,112.42,112.59,112.74,112.87,
               112.98,113.07,113.14,113.19,113.22,113.23];

	var cost = 0;
	var cost2 = 0;
	var cap = 1;
    var s=0;
console.log(" calculating for this attribute value: ",score);
	for (cap=1; cap<caps.length; cap++) {
		if (score < caps[cap]) {
			cost += (score - caps[cap-1]) * (cap);
//console.log("+++++> Caps "+cost, (score - caps[cap-1]) * cap, " with ", (score - caps[cap-1]));
			break;
		}
		else {
			cost += ((Math.floor(caps[cap]-0.01)) - Math.floor(caps[cap-1])) * cap;
//console.log("=====> "+cost);
//console.log("--------->  using: (", (caps[cap]-0.01), " - ", caps[cap-1], ") times ", cap, " = ", ((caps[cap]-0.01) - caps[cap-1]) * cap, " with ", ((caps[cap]-0.01) - caps[cap-1]));
		}
	}
    //cost += (score - caps[cap-1]) * (cap);
console.log("=====> "+cost);
//console.log("--------->  using: ("+ score, " - ", caps[cap-1], ") times ", cap, " = ", (score - caps[cap-1]) * cap, " with ", (score - caps[cap-1]));

	cap = 1;
	for (s=0; s<score; s++) {
		if (s > caps[cap]) cap++;
		if ((score - s) >= 1) {
			cost2 += (cap);
//console.log(score+": by-points1="+cost2);
		}
		else {
			cost2 += (score-s)*(cap);
//console.log(score+": by-points2="+cost2, " from ", (score-s)*cap);
			break;
		}
//console.log(" second loop: ", score, " ", s, " ", cap, " ", cost2);
	}
console.log(" end second loop: ", score, " ", s, " ", cap, " ", cost2);
	console.log(cost, " or ", cost2);
    return cost;
}

function main() {
	var costA = 0;
    var PlyVlu = 0;
	var attr_stats = document.getElementsByClassName("attribute_value");
    var i;
    var version = "29.08.2024.02";

   	console.log("MobBoss Player Value v.", version);

	for (i=0; i<attr_stats.length; i++) {
		costA +=getSkillsCost(attr_stats[i].innerHTML);

           	console.log("Name: ", attr_stats[i].getAttributeNode("id").value, " AttrVal: ", attr_stats[i].innerHTML );
            console.log(" Running PV: ", costA );
	}

	var costS = 0;
	var skills = document.getElementsByClassName("skill_level");
	for (i=0; i<skills.length; i++) {
		var v = 1;
		if ((i+1)%5 == 0) v++;
		costS += getAbilitiesCost(skills[i].innerHTML, v);
	}

	var costSP = parseFloat(document.getElementById("skill_points").innerHTML);

	var att = document.getElementById("attribute_list");
	PlyVlu = costA.toFixed(2) + " + " + costS.toFixed(2) + " + " + costSP.toFixed(2) + " = " + (costA+costS+costSP).toFixed(2);
	att.getElementsByClassName("medium_head")[0].innerHTML = "Attributes : "+PlyVlu;
	console.log(" Calculated Player Value: ", PlyVlu);
}

