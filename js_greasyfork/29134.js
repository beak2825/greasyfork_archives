// ==UserScript==
// @name		SklsRou Comp
// @description	        显示经验加成到属性中 重要更新,耐不计入经验加成 In TrophyManager.com S51 Skills + Routine Calculator Compare Page calculates routine contribution and adds it to players skills while comparing them
// @author      Long Coast United  CN by 太原FC
// @include		*trophymanager.com/players/compare/*
// @exclude		*trophymanager.com/players
// @exclude		*trophymanager.com/players/compare
// @exclude		*trophymanager.com/players/compare/
// @version     2017091905
// @namespace https://greasyfork.org/users/29134
// @downloadURL https://update.greasyfork.org/scripts/29134/SklsRou%20Comp.user.js
// @updateURL https://update.greasyfork.org/scripts/29134/SklsRou%20Comp.meta.js
// ==/UserScript==

var routineDiv = document.getElementsByClassName("odd align_center")[0];
var dSpans = routineDiv.getElementsByTagName("span");
var routinePl1 = dSpans[1].innerHTML;
var routinePl2 = dSpans[2].innerHTML;
var skillTbl = document.getElementsByClassName("skill_table zebra")[0];
// save default document object content to variable:
var defaultSkillTbl = document.getElementsByClassName("skill_table zebra")[0].innerHTML;

// add routine toggle button:
routineDiv.innerHTML = routineDiv.innerHTML +  "<span id='routineToggle' ><span font style='color:transparent' style='width: 90px; text-transform: none;'>经验加成</span></span>";
// add event to routine toggle button:
document.getElementById("routineToggle").addEventListener("click", toggleRoutine, false);

function applyRoutine() {
  // remove span tags with "subtle" class:
  var subtleSpans = skillTbl.getElementsByClassName('subtle');
  var subtleSpanContent, subtleSpanParent, newSubtleSpanContent;
  while (subtleSpans.length) {
    subtleSpanContent = subtleSpans[0].innerHTML;
    subtleSpanParent = subtleSpans[0].parentNode;
    newSubtleSpanContent = document.createTextNode(subtleSpanContent);
    subtleSpanParent.insertBefore(newSubtleSpanContent, subtleSpans[0]);
    subtleSpanParent.removeChild(subtleSpans[0]);
  }

  // calculate routine to skills:
  var tSkillSpans = skillTbl.getElementsByTagName("span");
  var tSkillSpan;
  for (p1 = 0; p1 < tSkillSpans.length; p1 += 2) {
    tSkillSpan = tSkillSpans[p1];
	// omit tSkillSpans[4] which stands for stamina and is not affected by routine:
    if (p1 === 4) 
	{
      if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
        tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML);
      } else {
        tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2'));
      }
    dyeStamina(tSkillSpan);
    }	else {
    if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
      tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML) + (0.03*(100-100*Math.exp(-routinePl1*0.035))))* 10)/10; 
    } else {
      tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')) + (0.03*(100-100*Math.exp(-routinePl1*0.035))))* 10)/10; 
    }
    dyeSkills(tSkillSpan);
    }
    }
  for (p2 = 1; p2 < tSkillSpans.length; p2 += 2) {
    tSkillSpan = tSkillSpans[p2];
	    // omit tSkillSpans[5] which stands for stamina and is not affected by routine:
    if (p2 === 5) {
      if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
        tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML);
      } else {
        tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2'));
      }
    dyeStamina(tSkillSpan);
    } else {
    if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
      tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML) + (0.03*(100-100*Math.exp(-routinePl2*0.035))))* 10)/10; 
    } else {
      tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')) + (0.03*(100-100*Math.exp(-routinePl2*0.035))))* 10)/10; 
    }
    dyeSkills(tSkillSpan);
  }
 }
  // add new cells with +/- skills comparison:
  var tSkillRow, pl1Skill, pl2Skill, compareSkill1, compareSkill2;
  for (tr = 0; tr < skillTbl.getElementsByTagName("tr").length; tr++) {
    tSkillRow = skillTbl.getElementsByTagName("tr")[tr];
    pl1Skill1 = tSkillRow.getElementsByTagName("span")[0].innerHTML;
    pl2SKill1 = tSkillRow.getElementsByTagName("span")[1].innerHTML;
    pl1Skill2 = tSkillRow.getElementsByTagName("span")[2].innerHTML;
    pl2SKill2 = tSkillRow.getElementsByTagName("span")[3].innerHTML;
    compareSkill1 = Math.round((parseFloat(pl1Skill1) - parseFloat(pl2SKill1)) * 10) / 10;
    compareSkill2 = Math.round((parseFloat(pl1Skill2) - parseFloat(pl2SKill2)) * 10) / 10;
    compareCell = tSkillRow.insertCell(2);
    compareCell.innerHTML = (compareSkill1 === 0 ? "=&nbsp;&nbsp;&nbsp;" : compareSkill1 < 0 ? "‒" : "+") + (compareSkill1 === 0 ? "" : Math.abs(compareSkill1));
    compareCell.style.textAlign = "left";
    compareSkill1 === 0 ? compareCell.style.color = "yellow" : compareSkill1 > 0 ? compareCell.style.color = "lime" : compareCell.style.color = "orangered";
    compareCell = tSkillRow.insertCell(5);
    compareCell.innerHTML = (compareSkill2 === 0 ? "=&nbsp;&nbsp;&nbsp;" : compareSkill2 < 0 ? "‒" : "+") + (compareSkill2 === 0 ? "" : Math.abs(compareSkill2));
    compareCell.style.textAlign = "left";
    compareSkill1 === 0 ? compareCell.style.color = "yellow" : compareSkill2 > 0 ? compareCell.style.color = "lime" : compareCell.style.color = "orangered";
  }

  // get rid of "class" in span tags
  for (i = 0; i < skillTbl.getElementsByTagName("span").length; i++) {
    skillTbl.getElementsByTagName("span")[i].removeAttribute("class");
  }
}

// colour skills depending on their value
function dyeStamina(tSkillSpan) {
  if (20 <= parseInt(tSkillSpan.innerHTML)) tSkillSpan.style.color = "#FF4500";
  if (19 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 20) tSkillSpan.style.color = "#FFA500";
  if (17 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 19) tSkillSpan.style.color = "#FFD700";
  if (15 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 17) tSkillSpan.style.color = "#FFFF00";
  if (5 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 10) tSkillSpan.style.opacity = "0.75";
  if (1 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 5) tSkillSpan.style.opacity = "0.5";
}
function dyeSkills(tSkillSpan) {
  if (24 <= parseInt(tSkillSpan.innerHTML)) tSkillSpan.style.color = "#FF4500";
  if (22 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 24) tSkillSpan.style.color = "#FFA500";
  if (20 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 22) tSkillSpan.style.color = "#FFD700";
  if (15 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 20) tSkillSpan.style.color = "#FFFF00";
  if (5 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 10) tSkillSpan.style.opacity = "0.75";
  if (1 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 5) tSkillSpan.style.opacity = "0.5";
}

// add/remove routine & comparison to/from skills:
function toggleRoutine() {
  if (document.getElementById("routineToggle").innerHTML.includes("经验加成")) {
    applyRoutine();
    document.getElementById("routineToggle").innerHTML = "<span font style='color:transparent' style='width: 90px; text-transform: none;'>还原显示</span>";
  } else if (document.getElementById("routineToggle").innerHTML.includes("还原显示")) {
    skillTbl.innerHTML = defaultSkillTbl;
    document.getElementById("routineToggle").innerHTML = "<span font style='color:transparent' style='width: 90px; text-transform: none;'>经验加成</span>";
  } else {
    alert("错误!");
  }
}