// ==UserScript==
// @name         TM League Calculater(CN)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  联赛界面提供方便的升降级计算
// @match        https://trophymanager.com/league/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497085/TM%20League%20Calculater%28CN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497085/TM%20League%20Calculater%28CN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract league level and group number from URL
    function extractInfoFromUrl() {
        let url = $('.content_menu .calendar').attr('href').split(`/`).filter(function (el) {
            return el.length > 0
        });
        console.log(url);
        if (url) {
            return { leagueLevel: url[3],
                     groupNumber: url[4] };
        }
        return null;
    }

    // Function to calculate the league
    function calc(n1, n2, n3) {
        var result = document.getElementById('result');
        var leagueLevel = parseInt(n1);
        var groupNumber = parseInt(n2);
        var ranking = parseInt(n3);
        var y, x, n4, n5;

        if (isNaN(leagueLevel) || isNaN(groupNumber) || isNaN(ranking) || ranking > 18 || ranking < 1 || groupNumber - parseInt(groupNumber) !== 0 || ranking - parseInt(ranking) !== 0) {
            result.innerHTML = "输入有误！";
            return;
        }

        if (leagueLevel == 1 && groupNumber != 1) {
            result.innerHTML = "输入有误！";
            return;
        }

        if (leagueLevel == 2 && (groupNumber > 4 || groupNumber < 1)) {
            result.innerHTML = "输入有误！";
            return;
        }

        if (leagueLevel == 3 && (groupNumber > 16 || groupNumber < 1)) {
            result.innerHTML = "输入有误！";
            return;
        }

        if (leagueLevel == 4 && (groupNumber > 64 || groupNumber < 1)) {
            result.innerHTML = "输入有误！";
            return;
        }

        if (leagueLevel == 1 && groupNumber == 1 && ranking < 5) {
            result.innerHTML = "已经是顶级联赛，无法升级，好好准备洲际比赛吧！";
            return;
        }

        if (leagueLevel < 6 && ranking > 14 && ranking < 19) {
            result.innerHTML = `您所处联赛为${leagueLevel}.${groupNumber}目前排名第${ranking}，您将直接降级到${(leagueLevel + 1)}.${(groupNumber * 4 + ranking - 18)}。`;
            return;
        }

        if (leagueLevel > 1 && leagueLevel < 6 && ranking == 1) {
            x = groupNumber % 4;
            n4 = x === 0 ? parseInt(groupNumber / 4) : parseInt(groupNumber / 4) + 1;
            result.innerHTML = `您所处联赛为${leagueLevel}.${groupNumber}目前排名第${ranking}，您将直接升级到${(leagueLevel - 1)}.${n4}。`;
            return;
        }

        if (leagueLevel > 0 && leagueLevel < 6 && ranking >= 2 && ranking <= 4) {
            var text;
            x = groupNumber % 4;
            if (x == 0) {
                n4 = parseInt(groupNumber / 4);
                n5 = 11;
            } else if (x == 1) {
                n4 = parseInt(groupNumber / 4) + 1;
                n5 = 14;
            } else if (x == 2) {
                n4 = parseInt(groupNumber / 4) + 1;
                n5 = 13;
            } else if (x == 3) {
                n4 = parseInt(groupNumber / 4) + 1;
                n5 = 12;
            }
            switch (ranking) {
                case 2:
                    text = `您所处联赛为${leagueLevel}.${groupNumber}目前排名第${ranking}，您附加赛第一场将主场对阵同组第3，附加赛第二场客场对阵${(leagueLevel - 1)}.${Math.pow(4, (leagueLevel - 2)) - n4 + 1}的第${n5}与同组第4的胜者。如果您两场附加赛全胜，将升级到${(leagueLevel - 1)}.${Math.pow(4, (leagueLevel - 2)) - n4 + 1}。`;
                    break;
                case 3:
                    text = `您所处联赛为${leagueLevel}.${groupNumber}目前排名第${ranking}，您附加赛第一场将客场对阵同组第2，附加赛第二场客场对阵${(leagueLevel - 1)}.${Math.pow(4, (leagueLevel - 2)) - n4 + 1}的第${n5}与同组第4的胜者。如果您两场附加赛全胜，将升级到${(leagueLevel - 1)}.${Math.pow(4, (leagueLevel - 2)) - n4 + 1}。`;
                    break;
                case 4:
                    text = `您所处联赛为${leagueLevel}.${groupNumber}目前排名第${ranking}，您在附加赛第一场将客场对阵${(leagueLevel - 1)}.${Math.pow(4, (leagueLevel - 2)) - n4 + 1}的第${n5}，附加赛第二场主场对阵同组第2与第3的胜者。如果您两场附加赛全胜，将升级到${(leagueLevel - 1)}.${Math.pow(4, (leagueLevel - 2)) - n4 + 1}。`;
                    break;
            }
            result.innerHTML = text;
            return;
        }

        if (leagueLevel > 0 && leagueLevel < 6 && (ranking == 11 || ranking == 12 || ranking == 13 || ranking == 14)) {
            var num = ranking - 11;
            var desc = `您所处联赛为${leagueLevel}.${groupNumber}目前排名第${ranking}，您在附加赛第一场将主场对阵${(leagueLevel + 1)}.${((Math.pow(4, (leagueLevel - 1)) - groupNumber + 1) * 4 - num)}的第4，附加赛第二场主场对阵${(leagueLevel + 1)}.${((Math.pow(4, (leagueLevel - 1)) - groupNumber + 1) * 4 - num)}第2与第3的胜者，您如果输掉附加赛，将降级到${(leagueLevel + 1)}.${((Math.pow(4, (leagueLevel - 1)) - groupNumber + 1) * 4 - num)}。`;
            result.innerHTML = desc;
            return;
        }

        if (ranking > 4 && ranking < 11) {
            result.innerHTML = `您所处联赛为${leagueLevel}.${groupNumber}目前排名第${ranking}，您不会升级也不会降级，当然也不会有附加赛。`;
        }
    }

    // Create input elements with labels
    var input1 = createInputWithLabel("", "联赛级别");
    var input2 = createInputWithLabel("", "联赛组号");
    var input3 = createInputWithLabel("", "联赛排名");

    // Create result paragraph
    var result = document.createElement("p");
    result.id = 'result';
    result.style.textIndent = '2em';

    // Create button
    var button = document.createElement("span");
    button.id = "tm_script_button_check";
    button.className = "button";
    button.style = "margin-left: 3px;";
    button.innerHTML = '<span class="button_border">计算</span>';
    button.addEventListener("click", function() {
        var leagueLevel = input1.querySelector('input').value;
        var groupNumber = input2.querySelector('input').value;
        var ranking = input3.querySelector('input').value;
        calc(leagueLevel, groupNumber, ranking);
    });

    // Find the column1 elements
    var column1Elements = document.querySelectorAll(".column1");

    if (column1Elements.length > 0) {
        column1Elements.forEach(function(element) {
            var div = document.createElement("div");
            div.className = 'box';
            div.innerHTML = `
                <div class="box_head"><h2 class="std">联赛升降级计算器</h2></div>
                <div class="box_body" id="tm_script_head_to_head_body_id">
                    <div id="tm_script_head_to_head_input_area_id" ></div>
                    <div id="tm_script_head_to_head_button_area_id" align="center"></div>
                    <div id="tm_script_head_to_head_result_area_id"></div>
                </div>
                <div class="box_footer"></div>
            `;
            div.querySelector("#tm_script_head_to_head_button_area_id").appendChild(input1);
            div.querySelector("#tm_script_head_to_head_button_area_id").appendChild(input2);
            div.querySelector("#tm_script_head_to_head_button_area_id").appendChild(input3);
            div.querySelector("#tm_script_head_to_head_button_area_id").appendChild(button);
            div.querySelector("#tm_script_head_to_head_result_area_id").appendChild(result);
            element.appendChild(div);
        });
    }

    // Fill input fields with extracted info
    var extractedInfo = extractInfoFromUrl();
    if (extractedInfo) {
        input1.querySelector('input').value = extractedInfo.leagueLevel;
        input2.querySelector('input').value = extractedInfo.groupNumber;
    }

    // Function to create input with label
    function createInputWithLabel(inputName, labelText) {
        var container = document.createElement("div");
        container.style.marginBottom = "10px";
        container.style.paddingTop = "10px";
        container.style.marginLeft= "10px";

        var label = document.createElement("label");
        label.style.marginRight= "4px";
        label.innerHTML = labelText;
        container.appendChild(label);

        var input = document.createElement("span");
        input.style = "display: inline-block;";
        input.innerHTML = '<input type="text" class="embossed" style="line-height: 95%; padding: 3px 3px 4px 3px;">';
        input.placeholder = inputName;
        container.appendChild(input);

        return container;
    }
})();