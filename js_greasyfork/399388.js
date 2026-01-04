// ==UserScript==
// @name		    TM Set routine and show bonus in "compare players" page
// @version         0.1
// @description	    Adds the routine-bonus on skills in the "compare players" page. You can also select the routine from which to calculate the bonus (e.g. when the player gains routine through the sharing system)
// @author          Andrizz aka Banana aka Jimmy il Fenomeno (I made only a few small changes to the "NewMESklsRouCalcComp" script by Long Coast United)
// @include		    http://trophymanager.com/players/compare/*
// @exclude		    http://trophymanager.com/players
// @exclude		    http://trophymanager.com/players/compare
// @exclude		    http://trophymanager.com/players/compare/
// @include		    https://trophymanager.com/players/compare/*
// @exclude		    https://trophymanager.com/players
// @exclude		    https://trophymanager.com/players/compare
// @exclude		    https://trophymanager.com/players/compare/
// @license         MIT
// @namespace https://greasyfork.org/users/198348
// @downloadURL https://update.greasyfork.org/scripts/399388/TM%20Set%20routine%20and%20show%20bonus%20in%20%22compare%20players%22%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/399388/TM%20Set%20routine%20and%20show%20bonus%20in%20%22compare%20players%22%20page.meta.js
// ==/UserScript==

var routineDiv = document.getElementsByClassName("odd align_center")[0];
var dSpans = routineDiv.getElementsByTagName("span");
var routinePl1 = dSpans[1].innerHTML;
var routinePl2 = dSpans[2].innerHTML;
var skillTbl = document.getElementsByClassName("skill_table zebra")[0];
// save default document object content to variable:
var defaultSkillTbl = document.getElementsByClassName("skill_table zebra")[0].innerHTML;
// add routine toggle button:
routineDiv.innerHTML = "Rou: <input name='rou1' class='embossed' value='"+routinePl1+"' size='2' maxlength='4' style='text-align: center;'><span id='bonus1'></span> | <span id='routineToggle' class='button'><span class='button_border' style='width: 90px; text-transform: none;'>Add rou. bonus</span></span> | Rou: <input name='rou2' class='embossed' value='"+routinePl2+"' size='2' maxlength='4' style='text-align: center;'><span id='bonus2'></span>";
// add event to routine toggle button:
document.getElementById("routineToggle").addEventListener("click", toggleRoutine, false);

function applyRoutine() {
    // remove span tags with "subtle" class:
    var Rou1 = document.getElementsByName("rou1")[0].value;
    var Rou2 = document.getElementsByName("rou2")[0].value;
    var skBonus1 = (3/100) * (100-(100) * Math.pow(Math.E, -Rou1*0.035));
    var skBonus2 = (3/100) * (100-(100) * Math.pow(Math.E, -Rou2*0.035));
    var newSkBns1 = document.getElementById("bonus1");
    var newSkBns2 = document.getElementById("bonus2");
    newSkBns1.textContent = " +"+skBonus1.toFixed(2);
    newSkBns2.textContent = " +"+skBonus2.toFixed(2);
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
    for (var p1 = 0; p1 < tSkillSpans.length; p1 += 2) {
        tSkillSpan = tSkillSpans[p1];
        // omit tSkillSpans[4] which stands for stamina and is not affected by routine:
        if (p1 === 4) {
            if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
                tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML);
            } else {
                tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2'));
            }
            dyeStamina(tSkillSpan);
        } else {
            if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
                tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML) + (3 / 100) * (100 - (100) * Math.exp(-Rou1* 0.035))) * 100) / 100;
            } else {
                tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')) + (3 / 100) * (100 - (100) * Math.exp(-Rou1 * 0.035))) * 100) / 100;
            }
            dyeSkills(tSkillSpan);
        }
    }
    for (var p2 = 1; p2 < tSkillSpans.length; p2 += 2) {
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
                tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML) + (3 / 100) * (100 - (100) * Math.exp(-Rou2 * 0.035))) * 100) / 100;
            } else {
                tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')) + (3 / 100) * (100 - (100) * Math.exp(-Rou2 * 0.035))) * 100) / 100;
            }
            dyeSkills(tSkillSpan);
        }
    }

    // add new cells with +/- skills comparison:
    var tSkillRow, pl1Skill, pl2Skill, compareSkill1, compareSkill2;
    for (var tr = 0; tr < skillTbl.getElementsByTagName("tr").length; tr++) {
        tSkillRow = skillTbl.getElementsByTagName("tr")[tr];
        if (tSkillRow.getElementsByTagName("span")[2] && tSkillRow.getElementsByTagName("span")[3]) {
            var pl1Skill1 = tSkillRow.getElementsByTagName("span")[0].innerHTML;
            var pl2SKill1 = tSkillRow.getElementsByTagName("span")[1].innerHTML;
            var pl1Skill2 = tSkillRow.getElementsByTagName("span")[2].innerHTML;
            var pl2SKill2 = tSkillRow.getElementsByTagName("span")[3].innerHTML;
            compareSkill1 = Math.round((parseFloat(pl1Skill1) - parseFloat(pl2SKill1)) * 100) / 100;
            compareSkill2 = Math.round((parseFloat(pl1Skill2) - parseFloat(pl2SKill2)) * 100) / 100;
            var compareCell1 = tSkillRow.insertCell(2);
            compareCell1.innerHTML = (compareSkill1 === 0 ? "=&nbsp;&nbsp;&nbsp;" : compareSkill1 < 0 ? "‒" : "+") + (compareSkill1 === 0 ? "" : Math.abs(compareSkill1));
            compareCell1.style.textAlign = "left";
            compareSkill1 === 0 ? compareCell1.style.color = "yellow" : compareSkill1 > 0 ? compareCell1.style.color = "lime" : compareCell1.style.color = "orangered";
            var compareCell2 = tSkillRow.insertCell(5);
            compareCell2.innerHTML = (compareSkill2 === 0 ? "=&nbsp;&nbsp;&nbsp;" : compareSkill2 < 0 ? "‒" : "+") + (compareSkill2 === 0 ? "" : Math.abs(compareSkill2));
            compareCell2.style.textAlign = "left";
            compareSkill2 === 0 ? compareCell2.style.color = "yellow" : compareSkill2 > 0 ? compareCell2.style.color = "lime" : compareCell2.style.color = "orangered";
        } else {
            pl1Skill1 = tSkillRow.getElementsByTagName("span")[0].innerHTML;
            pl2SKill1 = tSkillRow.getElementsByTagName("span")[1].innerHTML;
            compareSkill1 = Math.round((parseFloat(pl1Skill1) - parseFloat(pl2SKill1)) * 100) / 100;
            compareCell2 = tSkillRow.insertCell(2);
            compareCell1 = tSkillRow.insertCell(5);
            compareCell1.innerHTML = (compareSkill1 === 0 ? "=&nbsp;&nbsp;&nbsp;" : compareSkill1 < 0 ? "‒" : "+") + (compareSkill1 === 0 ? "" : Math.abs(compareSkill1));
            compareCell1.style.textAlign = "left";
            compareSkill1 === 0 ? compareCell1.style.color = "yellow" : compareSkill1 > 0 ? compareCell1.style.color = "lime" : compareCell1.style.color = "orangered";
        }
    }

    // get rid of "class" in span tags
    for (var i = 0; i < skillTbl.getElementsByTagName("span").length; i++) {
        skillTbl.getElementsByTagName("span")[i].removeAttribute("class");
    }
}

// colour skills depending on their value:
function dyeStamina(tSkillSpan) {
    if (20 <= parseInt(tSkillSpan.innerHTML)) tSkillSpan.style.color = "#FF4500";
    if (19 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 20) tSkillSpan.style.color = "#FFA500";
    if (17 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 19) tSkillSpan.style.color = "#FFD700";
    if (15 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 17) tSkillSpan.style.color = "#FFFF00";
    if (5 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 10) tSkillSpan.style.opacity = "0.75";
    if (1 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 5) tSkillSpan.style.opacity = "0.5";
}
function dyeSkills(tSkillSpan) {
    if (22 <= parseInt(tSkillSpan.innerHTML)) tSkillSpan.style.color = "#FF4500";
    if (21 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 22) tSkillSpan.style.color = "#FFA500";
    if (19 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 21) tSkillSpan.style.color = "#FFD700";
    if (15 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 19) tSkillSpan.style.color = "#FFFF00";
    if (5 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 10) tSkillSpan.style.opacity = "0.75";
    if (1 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 5) tSkillSpan.style.opacity = "0.5";
}

// add/remove routine & comparison to/from skills:
function toggleRoutine() {
    if (document.getElementById("routineToggle").innerHTML.includes("Add")) {
        applyRoutine();
        document.getElementById("routineToggle").innerHTML = "<span class='button_border' style='width: 90px; text-transform: none;'>Remove bonus</span>";
    } else if (document.getElementById("routineToggle").innerHTML.includes("Remove")) {
        skillTbl.innerHTML = defaultSkillTbl;
        document.getElementById("routineToggle").innerHTML = "<span class='button_border' style='width: 90px; text-transform: none;'>Add rou. bonus</span>";
    } else {
        alert("CAUTION: The script may not work properly!");
    }
}