// ==UserScript==
// @name         TM Skill Index Calculator CN
// @namespace    https://trophymanager.com
// @version      1.0.2023120901
// @description  TrophyManager: Calculate future skill index (SI) & skill sum
// @author       UNITE eM (Club ID: 551050) 翻译 by 太原龙城足球俱乐部
// @namespace    https://trophymanager.com
// @match        *trophymanager.com/players/*
// @exclude      *trophymanager.com/players/
// @exclude      *trophymanager.com/players/compare/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481370/TM%20Skill%20Index%20Calculator%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/481370/TM%20Skill%20Index%20Calculator%20CN.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let skillIndexCalculator =
        "<div class='box'>" +
        "<div class='box_head'>" +
        "<h2 class='std'>技能评值(SI) 计算器</h2>" +
        "</div>" +
        "<div class='box_body'>" +
        "<div class='box_shadow'></div>" +
        "<div id='skillIndexCalculator_content' class='std align_center'></div>" +
        "</div>" +
        "<div class='box_footer'>" +
        "<div></div>" +
        "</div>" +
        "</div>";
    $(".column3_a").prepend(skillIndexCalculator);

    var gettr = document.getElementsByClassName("float_left info_table zebra")[0].getElementsByTagName("tr");
    for (let i = 0; i < gettr.length; i++) {
        if (gettr[i].getElementsByTagName("th").length > 0) {
            if (gettr[i].getElementsByTagName("th")[0].innerHTML == global_content["skill_index"]) {
                var SI = gettr[i].getElementsByTagName("td")[0].innerHTML;
                break;
            }
        }
    }
    for (let i = 0; i < gettr.length; i++) {
        if (gettr[i].getElementsByTagName("th").length > 0) {
            if (gettr[i].getElementsByTagName("th")[0].innerHTML == global_content["age"]) {
                var ageMonth = parseInt(gettr[i].getElementsByTagName("td")[0].innerHTML.split(" ")[2]);
                break;
            }
        }
    }

    let trainingInputTable =
        "<table id='trainingInput_table' align='center' style='width:100%'>" +
        "<tr>" +
        "<td style='width:30%'>原始技能评值(SI)</td>" +
        "<td style='width:30%'>训练周数</td>" +
        "<td style='width:30%'>平均训练强度(TI)</td>" +
        "<td id='addRow_button' class='align_center'><a class='button'><span class='button_border' style='padding: 0px 8px'><img src='/pics/cf_mini_plus.png'></a></span></td>" +
        "</tr>" +
        "<tr>" +
        "<td><input type='text' name='currentSkillIndex' class='embossed' size='5' style='text-align: center; margin-bottom: 1px;' value=" + SI + "></td>" +
        "<td><input type='text' name='trainingSession' class='embossed' size='5' style='text-align: center; margin-bottom: 1px;' value=" + (ageMonth == 11 ? 12 : 11 - ageMonth) + "></td>" +
        "<td><input type='text' name='trainingIntensity' class='embossed' size='5' style='text-align: center; margin-bottom: 1px;' value=''></td>" +
        "<td id='doCalculate_button' class='align_center'><a class='button'><span class='button_border' style='padding: 0px 6px'><img src='/pics/feed/feed_icons/3.gif'></a></span></td>" +
        "</tr>" +
        "</table>";
    $("#skillIndexCalculator_content").append(trainingInputTable);

    document.getElementById("addRow_button").addEventListener("click", (e) => {
        addRow();
    });

    document.getElementById("doCalculate_button").addEventListener("click", (e) => {
        doCalculate();
    });

    function addRow() {
        var trainingInputRow =
            "<tr>" +
            "<td></td>" +
            "<td><input type='text' name='trainingSession' class='embossed' size='5' style='text-align: center; margin-bottom: 1px;' value=''></td>" +
            "<td><input type='text' name='trainingIntensity' class='embossed' size='5' style='text-align: center; margin-bottom: 1px;' value=''></td>" +
            "<td></td>" +
            "</tr>";
        $("#trainingInput_table").append(trainingInputRow);
    }

    function doCalculate() {
        var MR = Math.round;
        var MP = Math.pow;
        var ML = Math.log;

        var elem = document.getElementById("skillIndexCalculator_content");
        while (elem.childElementCount > 1) {
            elem.removeChild(elem.lastChild);
        }

        var notGK = document.getElementsByClassName("favposition long")[0].innerText != global_content["goalkeeper"] ? true: false;
        var currentSI = document.getElementsByName("currentSkillIndex")[0].value.replace(/,/g, "");

        var currentSkillSum = "";
        if (notGK) {
            currentSkillSum = MR(MP(currentSI * MP(2, 9) * MP(5, 4) * MP(7, 7), 1 / 7) * 10) / 10;
        } else {
            currentSkillSum = MR((MP(currentSI * MP(2, 9) * MP(5, 4) * MP(7, 7), 1 / 7) / 14) * 11 * 10) / 10;
        }

        var futureSkillSum = currentSkillSum;
        for (let i = 0; i < document.getElementsByName("trainingSession").length; i++) {
            var session = document.getElementsByName("trainingSession")[i].value;
            if (session > 0) {
                var TI = document.getElementsByName("trainingIntensity")[i].value;
                futureSkillSum = MR((futureSkillSum + (TI / 10) * session) * 10) / 10;
            }
        }

        var futureSI = "";
        if (notGK) {
            futureSI = MR(MP(futureSkillSum, 7) / (MP(2, 9) * MP(5, 4) * MP(7, 7)));
        } else {
            futureSI = MR(MP((futureSkillSum / 11) * 14, 7) / (MP(2, 9) * MP(5, 4) * MP(7, 7)));
        }

        let trainingOutputTable = "<table id='trainingOutput_table' style='border-top:2px solid #6c9922; margin-top:4px;'></table>";
        let currentSkillSumRow = "<tr><td align='left'>原始属性总和</td><td align='right'><b>" + currentSkillSum.toFixed(1) + "</b></td></tr>";
        let futureSkillSumRow = "<tr class='odd'><td align='left'>训练后属性总和</td><td align='right'><b>" + futureSkillSum.toFixed(1) + "</b></td></tr>";
        let futureSIRow = "<tr><td align='left'>训练后技能评值(SI)</td><td align='right'><b>" + addCommas(futureSI) + "</b></td></tr>";

        $("#skillIndexCalculator_content").append(trainingOutputTable);
        $("#trainingOutput_table").append(currentSkillSumRow, futureSkillSumRow, futureSIRow);
    }

    function addCommas(num) {
        var numParts = num.toString().split(".");
        numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return numParts.join(".");
    }

})();
