// ==UserScript==
// @name         TrainSimulator 
// @namespace    https://trophymanager.com/
// @version      1.0.5
// @description  对训练计划给出模拟结果 依赖插件:TMVN Players Scout (CN beta)和RatingR5 CN
// @author       训练器：太原FC(246770) 自动填入：提瓦特元素反应(4731723)
// @match        https://trophymanager.com/players/*
// @match        https://trophymanager.cn/training/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494169/TrainSimulator.user.js
// @updateURL https://update.greasyfork.org/scripts/494169/TrainSimulator.meta.js
// ==/UserScript==

function insertAfter(newElement,targetElement){
    var parent = targetElement.parentNode;
    if(parent.lastChild == targetElement){
        parent.appendChild(newElement);
    }else{
        parent.insertBefore(newElement,targetElement.nextsibling);
    }
}

function sendInfoToUrl(url, data) {
    if(data == "") return
    const queryParams = new URLSearchParams(data);
    const fullUrl = `${url}?${queryParams.toString()}`;
    window.open(fullUrl, '_blank');
}

function extractInfoFromTable() {
    const table = document.querySelector('#R5table4');
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    const headers = [];
    rows[0].querySelectorAll('td').forEach(td => {
        headers.push(td.textContent.trim());
    });

    const age = rows[1].querySelector('select').value;

    const skillValue = rows[1].querySelectorAll('td')[1].textContent.trim();
    const starRating = rows[1].querySelectorAll('td')[2].textContent.trim();
    const r5Score = rows[1].querySelectorAll('td')[3].textContent.trim();

    let abilities = rows[2].querySelector('td[colspan="4"]').textContent.trim().replace("传", " 传").replace("力 :", " 力:");
    const abilityMap = {};
    abilities.split(/\s+/).forEach(pair => {
        const [key, value] = pair.split(':');
        abilityMap[key] = value;
    });

    const teamPoints = countTeamPoints();

    const swTable = document.querySelectorAll('#scoutReport_content tr');
    let adValue = "";
    let bodyValue = "";
    let tacticsValue = "";
    let techValue = "";
    console.log(swTable);
    if(swTable[5].querySelectorAll('td')[1] != null) adValue = swTable[5].querySelectorAll('td')[1].innerText;
    if(swTable[6].querySelectorAll('td')[1] != null) bodyValue = swTable[6].querySelectorAll('td')[1].innerText;
    if(swTable[7].querySelectorAll('td')[1] != null) tacticsValue = swTable[7].querySelectorAll('td')[1].innerText;
    if(swTable[8].querySelectorAll('td')[1] != null) techValue = swTable[8].querySelectorAll('td')[1].innerText;

    return {
        headers,
        age,
        skillValue,
        starRating,
        r5Score,
        teamPoints,
        adValue,
        bodyValue,
        tacticsValue,
        techValue,
        abilities: abilityMap
    };
}

function countTeamPoints() {
    const teams = {};
    for (let i = 1; i <= 6; i++) {
        const teamClass = `team${i}`;
        const teamElement = document.querySelector(`.${teamClass}`);
        if (teamElement) {
            const pointsOnCount = teamElement.querySelectorAll('.point_on').length;
            teams[teamClass] = pointsOnCount;
        } else {
            teams[teamClass] = 0;
        }
    }
    return teams;
}

function objectToQueryParams(obj) {
    if(obj.skillValue == "---"){
        let notice = document.createElement('div');
        notice.innerHTML = "<a>请先选择需要模拟的年龄</a>"
        document.querySelector('.training_custom_levels .msgbuttons').appendChild(notice);
        return ""
    }
    if(obj.skillValue == ""){
        let notice = document.createElement('div');
        notice.innerHTML = "<a>请先安装并启用依赖插件RatingR5 CN</a>"
        document.querySelector('.training_custom_levels .msgbuttons').appendChild(notice);
        return ""
    }

    const params = new URLSearchParams();

    params.append('age', obj.age);
    params.append('skillValue', obj.skillValue);
    params.append('starRating', obj.starRating);
    params.append('r5Score', obj.r5Score);
    params.append('teamPoints', obj.teamPoints);
    params.append('adValue', obj.adValue);
    params.append('bodyValue', obj.bodyValue);
    params.append('tacticsValue', obj.tacticsValue);
    params.append('techValue', obj.techValue);

    for (const [key, value] of Object.entries(obj.teamPoints)) {
        params.append(`teamPoints_${key}`, value);
    }

    for (const [key, value] of Object.entries(obj.abilities)) {
        params.append(`ability_${key}`, value);
    }

    return params.toString();
}

(function() {
    'use strict';
    let added = false;

    function ShowCalButton()
    {
        if(!trainTypeIsLoaded())return;
        const calButton = document.createElement('span');
        const playerCountElement = document.querySelector('#player_training_new .msgbuttons');
        console.log(playerCountElement);
        if (playerCountElement && playerCountElement.firstChild) {
            calButton.setAttribute("class", "button");
            let innerSpan = document.createElement('span');
            innerSpan.setAttribute("class", "button_border");
            innerSpan.textContent = "模拟训练";
            calButton.appendChild(innerSpan);
            calButton.href = '#';
            calButton.addEventListener('click', function(event) {
                event.preventDefault();
                //console.log(extractInfoFromTable());
                sendInfoToUrl('https://trophymanager.cn/training/', objectToQueryParams(extractInfoFromTable()));
            })
            insertAfter(calButton, document.querySelector('#player_training_new .msgbuttons').firstChild);
        }
    }


    function trainTypeIsLoaded()
    {
        if(added) return false;
        let trainList=document.querySelector("#player_training_new .msgbuttons");
        if(trainList===null)return false;
        added = true;
        return true;
    }

    setInterval(ShowCalButton,500);
})();


(function() {
    'use strict';

    if (!(window.location.pathname === '/training/' || window.location.pathname === '/training')) {
        return;
    }

    function getQueryParams() {
        const params = {};
        const search = window.location.search.substring(1);
        if (search.length > 0) {
            const pairs = search.split("&");
            pairs.forEach(pair => {
                const [key, value] = pair.split("=");
                params[decodeURIComponent(key)] = decodeURIComponent(value || "");
            });
        }
        return params;
    }

    function fillInputs(params) {
        console.log(params);
        const [years, months] = params.age ? params.age.split(".") : [null, null];
        const ageSelect = document.getElementById("years");
        const monthSelect = document.getElementById("month");

        if (ageSelect && years) {
            ageSelect.value = parseInt(years);
        }

        if (monthSelect && months) {
            monthSelect.value = parseInt(months);
        }

        // 填入技能评值信息
        const skillInput = document.getElementsByName("si")[0];
        if (skillInput && params.skillValue) {
            skillInput.value = params.skillValue.replace(/,/g,"");
        }

        // 填入其他属性信息
        const abilityMapping = {
            "Str": "力",
            "Sta": "耐",
            "Pac": "速",
            "Mar": "盯",
            "Tac": "抢",
            "Wor": "工",
            "Pos": "位",
            "Pas": "传",
            "Cro": "中",
            "Tec": "技",
            "Hea": "头",
            "Fin": "射",
            "Lon": "远",
            "Set": "定"
        };

        for (const [key, field] of Object.entries(abilityMapping)) {
            const input = document.getElementsByName(key)[0];
            if (input && params[`ability_${field}`]) {
                input.value = params[`ability_${field}`];
            }
        }


        // 填入 teamPoints
        for (let i = 1; i <= 6; i++) {
            const selectElement = document.querySelector(`#t${i}`);
            if (selectElement && params[`teamPoints_team${i}`]) {
                selectElement.value = params[`teamPoints_team${i}`];
            }
        }

        // 填入三维
        document.querySelector(`#sp`).value = {"力量": "0", "耐力": "1", "速度": "2", "盯人": "3", "抢断": "4", "工投": "5", "站位": "6", "传球": "7", "传中": "8", "技术": "9", "头球": "10", "射门": "11", "远射": "12", "定位球": "13"}[params.adValue];
        document.querySelector(`#phy3`).value = ["0.55", "0.68", "0.80", "0.94"][parseInt(params.bodyValue) - 1];
        document.querySelector(`#tac3`).value = ["0.55", "0.68", "0.80", "0.94"][parseInt(params.tacticsValue) - 1];
        document.querySelector(`#tec3`).value = ["0.55", "0.68", "0.80", "0.94"][parseInt(params.techValue) - 1];
    }

    const queryParams = getQueryParams();
    fillInputs(queryParams);
})();