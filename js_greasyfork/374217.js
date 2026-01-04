// ==UserScript==
// @name         TM YouthPull SkillSum
// @version      0.8
// @description  Calculates youths skill sums
// @author       Andrizz aka Banana aka Jimmy il Fenomeno (team ID = 3257254) (based on a script by Gordan S. aka Mansfield, ID = 2567501)
// @match        https://trophymanager.com/youth-development/*
// @grant        none
// @license MIT
// @namespace http://gitare.info/
// @downloadURL https://update.greasyfork.org/scripts/374217/TM%20YouthPull%20SkillSum.user.js
// @updateURL https://update.greasyfork.org/scripts/374217/TM%20YouthPull%20SkillSum.meta.js
// ==/UserScript==

setTimeout(function(){
    document.getSkills = function(table) {
    var skillArray = [];
    var tableData = skillTable[x].getElementsByTagName("td");
    if (tableData.length > 1) {
	   for (var i = 0; i < 2; i++) {
		   for (var j = i; j < tableData.length; j += 2) {
			   if (tableData[j].innerHTML.indexOf("star.png") > 0) {
                   skillArray.push(20);
               }
               else if (tableData[j].innerHTML.indexOf("star_silver.png") > 0) {
                   skillArray.push(19);
               }
               else if (tableData[j].textContent.length != 0) {
                   skillArray.push(tableData[j].textContent);
               }
           }
       }
    }
        return skillArray;
    };
    var skillTable = document.getElementsByClassName("border_bottom youth_player_skills");
    for (var x = 0; x<skillTable.length; x++) {
        var skillArray = document.getSkills(skillTable[x]);
        var SkillSum = 0;
        for (var k = 0; k<skillArray.length; k++) {
            SkillSum += parseInt(skillArray[k]);
        }
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var td = document.createElement("td");
        tr.appendChild(th);
        tr.appendChild(td);
        var th2 = document.createElement("th");
        th2.style = "font-weight:bold; font-size: 14px; color: gold;";
        th2.innerHTML = "SkillSum";
        var td2 = document.createElement("td");
        td2.style = "font-weight:bold; font-size: 14px; color: gold;";
        td2.innerHTML = SkillSum;
        tr.appendChild(th2);
        tr.appendChild(td2);
        skillTable[x].firstChild.appendChild(tr);
    }
}, 3000);