// ==UserScript==
// @name         TrainSimulator Plus
// @version      0.3
// @description  提供R5计算
// @match        https://trophymanager.cn/training/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trophymanager.cn
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/538500/TrainSimulator%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/538500/TrainSimulator%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const observer = new MutationObserver((mutationsList, observer) => {
        calcAllR5();
    });

    const targetNode = document.getElementById('Str');
    const config = { attributes: true, childList: true, subtree: true };

    observer.observe(targetNode, config);

    const inputs=document.getElementsByClassName("dt-col-lg-3");
    const text=document.createElement("text");
    const br=document.createElement("br");
    const input=document.createElement("input");
    text.innerHTML="经验：";
    input.type="text";
    input.name="xp";
    input.value="0.0";
    inputs[0].appendChild(text);
    inputs[0].appendChild(input);
    inputs[0].appendChild(br);

    const divs=document.getElementsByClassName("dt-g-4");
    const table=document.createElement("table");
    table.id="R5";
    divs[0].appendChild(table);

    const sit=document.getElementById("sit");
    const p=document.createElement("p");
    p.id="wage";
    p.size=5;
    p.style.textAlign="center";
    sit.after(p);
})();

function calcAllR5(){
    let Str=getValue(document.getElementById("Str").innerHTML);
    let Sta=getValue(document.getElementById("Sta").innerHTML);
    let Pac=getValue(document.getElementById("Pac").innerHTML);
    let Mar=getValue(document.getElementById("Mar").innerHTML);
    let Tac=getValue(document.getElementById("Tac").innerHTML);
    let Wor=getValue(document.getElementById("Wor").innerHTML);
    let Pos=getValue(document.getElementById("Pos").innerHTML);
    let Pas=getValue(document.getElementById("Pas").innerHTML);
    let Cro=getValue(document.getElementById("Cro").innerHTML);
    let Tec=getValue(document.getElementById("Tec").innerHTML);
    let Hea=getValue(document.getElementById("Hea").innerHTML);
    let Fin=getValue(document.getElementById("Fin").innerHTML);
    let Lon=getValue(document.getElementById("Lon").innerHTML);
    let Set=getValue(document.getElementById("Set").innerHTML);
    let SI=Number(document.getElementById("sit").innerHTML.split("→")[1]);
    let xp=Number(document.training.xp.value);
    let skills=[Str, Sta, Pac, Mar, Tac, Wor, Pos, Pas, Cro, Tec, Hea, Fin, Lon, Set];
    let PosR5=[calculateREREC(0,skills,SI,xp),
               calculateREREC(1,skills,SI,xp),
               calculateREREC(2,skills,SI,xp),
               calculateREREC(3,skills,SI,xp),
               calculateREREC(4,skills,SI,xp),
               calculateREREC(5,skills,SI,xp),
               calculateREREC(6,skills,SI,xp),
               calculateREREC(7,skills,SI,xp),
               calculateREREC(8,skills,SI,xp)]
    const table=document.getElementById("R5");
    table.innerHTML="<tr><th>位置</th><td>DC</td><td>DLR</td><td>DMC</td><td>DMLR</td><td>MC</td><td>MLR</td><td>OMC</td><td>OMLR</td><td>F</td></tr>"+
        "<tr><th>R5</th><td>"+PosR5[0]+"</td><td>"+PosR5[1]+"</td><td>"+PosR5[2]+"</td><td>"+PosR5[3]+"</td><td>"+PosR5[4]+"</td><td>"+PosR5[5]+"</td><td>"+PosR5[6]+"</td><td>"+PosR5[7]+"</td><td>"+PosR5[8]+"</td></tr>";
    const wage=document.getElementById("wage");
    wage.innerHTML="预计工资：$"+Math.floor(SI*15.808).toLocaleString();
}

function getValue(string){
    var number=string.split("→")[1].split("(")[0];
    if(number=='NaN'){
        return 0;
    }else{
        return Number(number);
    }
}

// R5 weights   [Str, Sta, Pac, Mar, Tac, Wor, Pos, Pas, Cro, Tec, Hea, Fin, Lon, Set]
var weightR5 = [
    [0.41029304, 0.18048062, 0.56730138, 1.06344654, 1.02312672, 0.40831256, 0.58235457, 0.12717479, 0.05454137, 0.09089830, 0.42381693, 0.04626272, 0.02199046, 0], // DC
    [0.42126371, 0.18293193, 0.60567629, 0.91904794, 0.89070915, 0.40038476, 0.56146633, 0.15053902, 0.15955429, 0.15682932, 0.42109742, 0.09460329, 0.03589655, 0], // DL/R
    [0.23412419, 0.32032289, 0.62194779, 0.63162534, 0.63143081, 0.45218831, 0.47370658, 0.55054737, 0.17744915, 0.39932519, 0.26915814, 0.16413124, 0.07404301, 0], // DMC
    [0.27276905, 0.26814289, 0.61104798, 0.39865092, 0.42862643, 0.43582015, 0.46617076, 0.44931076, 0.25175412, 0.46446692, 0.29986350, 0.43843061, 0.21494592, 0], // DML/R
    [0.25219260, 0.25112993, 0.56090649, 0.18230261, 0.18376490, 0.45928749, 0.53498118, 0.59461481, 0.09851189, 0.61601950, 0.31243959, 0.65402884, 0.29982016, 0], // MC
    [0.28155678, 0.24090675, 0.60680245, 0.19068879, 0.20018012, 0.45148647, 0.48230007, 0.42982389, 0.26268609, 0.57933805, 0.31712419, 0.65824985, 0.29885649, 0], // ML/R
    [0.22029884, 0.29229690, 0.63248227, 0.09904394, 0.10043602, 0.47469498, 0.52919791, 0.77555880, 0.10531819, 0.71048302, 0.27667115, 0.56813972, 0.21537826, 0], // OMC
    [0.21151292, 0.35804710, 0.88688492, 0.14391236, 0.13769621, 0.46586605, 0.34446036, 0.51377701, 0.59723919, 0.75126119, 0.16550722, 0.29966502, 0.12417045, 0], // OML/R
    [0.35479780, 0.14887553, 0.43273380, 0.00023928, 0.00021111, 0.46931131, 0.57731335, 0.41686333, 0.05607604, 0.62121195, 0.45370457, 1.03660702, 0.43205492, 0], // F
    [0.45462811, 0.30278232, 0.45462811, 0.90925623, 0.45462811, 0.90925623, 0.45462811, 0.45462811, 0.30278232, 0.15139116, 0.15139116]]; // GK

const calculateREREC = (positionIndex, skills, SI, rou) => {
    const remainders = calculateRemainders(positionIndex, skills, SI);
    let rou2 = (3 / 100) * (100 - (100) * Math.pow(Math.E, -rou * 0.035));
    let ratingR4 = calculateRERECOld(remainders, rou2);
    var goldstar = 0;
    var skillsB = [];
    for (let j = 0; j < 2; j++) {
        for (let i = 0; i < skills.length; i++) {
            if (j == 0 && skills[i] == 20) goldstar++;
            if (j == 1) {
                if (skills[i] != 20) skillsB[i] = skills[i] * 1 + remainders[0] / (skills.length - goldstar);
                else skillsB[i] = skills[i];
            }
        }
    }

    var skillsB_rou = [];
    for (let i = 0; i < skills.length; i++) {
        if (i == 1) skillsB_rou[1] = skillsB[1];
        else skillsB_rou[i] = skillsB[i] * 1 + rou2;
    }
    var headerBonus = skillsB_rou[10] > 12 ? funFix2((MP(Math.E, (skillsB_rou[10] - 10) ** 3 / 1584.77) - 1) * 0.8 + MP(Math.E, (skillsB_rou[0] * skillsB_rou[0] * 0.007) / 8.73021) * 0.15 + MP(Math.E, (skillsB_rou[6] * skillsB_rou[6] * 0.007) / 8.73021) * 0.05) : 0;
    var fkBonus = funFix2(MP(Math.E, MP(skillsB_rou[13] + skillsB_rou[12] + skillsB_rou[9] * 0.5, 2) * 0.002) / 327.92526);
    var ckBonus = funFix2(MP(Math.E, MP(skillsB_rou[13] + skillsB_rou[8] + skillsB_rou[9] * 0.5, 2) * 0.002) / 983.65770);
    var pkBonus = funFix2(MP(Math.E, MP(skillsB_rou[13] + skillsB_rou[11] + skillsB_rou[9] * 0.5, 2) * 0.002) / 1967.31409);
    var gainBase = funFix2((skillsB_rou[0] ** 2 + skillsB_rou[1] ** 2 * 0.5 + skillsB_rou[2] ** 2 * 0.5 + skillsB_rou[3] ** 2 + skillsB_rou[4] ** 2 + skillsB_rou[5] ** 2 + skillsB_rou[6] ** 2) / 6 / 22.9 ** 2);
    var keepBase = funFix2((skillsB_rou[0] ** 2 * 0.5 + skillsB_rou[1] ** 2 * 0.5 + skillsB_rou[2] ** 2 + skillsB_rou[3] ** 2 + skillsB_rou[4] ** 2 + skillsB_rou[5] ** 2 + skillsB_rou[6] ** 2) / 6 / 22.9 ** 2);
    var posGain = [gainBase * 0.3, gainBase * 0.3, gainBase * 0.9, gainBase * 0.6, gainBase * 1.5, gainBase * 0.9, gainBase * 0.9, gainBase * 0.6, gainBase * 0.3];
    var posKeep = [keepBase * 0.3, keepBase * 0.3, keepBase * 0.9, keepBase * 0.6, keepBase * 1.5, keepBase * 0.9, keepBase * 0.9, keepBase * 0.6, keepBase * 0.3];
    var allBonus = skills.length == 11 ? 0 : headerBonus * 1 + fkBonus * 1 + ckBonus * 1 + pkBonus * 1;

    if (positionIndex === 9) {
        ratingR4 = funFix2(ratingR4 + allBonus);
    } else {
        ratingR4 = funFix2(ratingR4 + allBonus + posGain[positionIndex] + posKeep[positionIndex]);
    }
    return ratingR4;
};

const calculateRERECOld = (remainders, rou2) => {
    const remainder = remainders[0] * remainders[1] / remainders[2];
    let ratingR = remainders[3] + remainder;
    return Number(funFix2(ratingR + rou2 * 5));
};

const calculateRemainders = (positionIndex, skills, SI) => {
    let weight = 263533760000;
    if (positionIndex === 9) weight = 48717927500;
    let rec = 0;
    let ratingR = 0;
    let skillSum = 0;

    for (let i = 0; i < skills.length; i++) {
        skillSum += Number(skills[i]);
    }

    let remainder = Math.round((Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - skillSum) * 10) / 10;		// RatingR4 remainder
    let remainderWeight2 = 0;
    let not20 = 0;

    weightR5[positionIndex].forEach((value, index) => {
        ratingR += skills[index] * weightR5[positionIndex][index];
        if (skills[index] != 20) {
            remainderWeight2 += weightR5[positionIndex][index];
            not20++;
        }
    })
    if (remainder / not20 > 0.9 || !not20) {
        if (positionIndex === 9) not20 = 11;
        else not20 = 14;
        remainderWeight2 = 5;
    }
    return [remainder, Math.round(remainderWeight2), not20, ratingR];
}

const funFix2 = i => {
    i = (Math.round(i * 100) / 100).toFixed(2);
    return i;
}

var MP = Math.pow;