// ==UserScript==
// @name         TM 转会助手B（Beta）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bid界面优化
// @match        https://trophymanager.com/bids/
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497724/TM%20%E8%BD%AC%E4%BC%9A%E5%8A%A9%E6%89%8BB%EF%BC%88Beta%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/497724/TM%20%E8%BD%AC%E4%BC%9A%E5%8A%A9%E6%89%8BB%EF%BC%88Beta%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    div.main_center.top_user_info {
        width: 990px;
        display: block;
    }
    div.main_center {
        width:unset;
        display: flex;
        justify-content: center;
    }
    .column2_c {
        width: unset;
    }

    .cell-age {
        width: 40px;
        text-align: center;
    }
    .cell-pos {
        width: 50px;
        text-align: center;
    }
    .cell-si {
        width: 70px;
        text-align: center;
    }
    .cell-wa {
        width: 50px;
        text-align: center;
    }
    .cell-xp {
        width: 30px;
        text-align: center;
    }
    .cell-r5 {
        width: 80px;
        text-align: center;
    }`);
})();

// 等待页面完全加载
window.addEventListener('load', function() {

    var headerRow = document.querySelectorAll('.header-row');
    headerRow.forEach(function(row) {
        var ageHeader = document.createElement('ib');
        ageHeader.className = 'p-cell cell-age';
        ageHeader.textContent = '年龄';

        var posHeader = document.createElement('ib');
        posHeader.className = 'p-cell cell-pos';
        posHeader.textContent = '位置';

        var siHeader = document.createElement('ib');
        siHeader.className = 'p-cell cell-si';
        siHeader.textContent = 'SI';

        var waHeader = document.createElement('ib');
        waHeader.className = 'p-cell cell-wa';
        waHeader.textContent = '工资';

        var xpHeader = document.createElement('ib');
        xpHeader.className = 'p-cell cell-xp';
        xpHeader.textContent = '经验';

        var r5Header = document.createElement('ib');
        r5Header.className = 'p-cell cell-r5';
        r5Header.textContent = 'R5';

        // 获取目标列cell-bid
        var targetHeader = row.querySelector('.cell-bid');
        // 将新的列元素插入
        if (targetHeader) {
            row.insertBefore(ageHeader, targetHeader);
            row.insertBefore(posHeader, targetHeader);
            row.insertBefore(siHeader, targetHeader);
            row.insertBefore(waHeader, targetHeader);
            row.insertBefore(xpHeader, targetHeader);
            row.insertBefore(r5Header, targetHeader);
        }
    })
    // 获取所有的player-row元素
    var playerRows = document.querySelectorAll('.player-row');

    playerRows.forEach(function(row) {

        // 创建新的列元素
        var ageColumn = document.createElement('ib');
        ageColumn.className = 'p-cell cell-age';

        var posColumn = document.createElement('ib');
        posColumn.className = 'p-cell cell-pos';

        var siColumn = document.createElement('ib');
        siColumn.className = 'p-cell cell-si';

        var waColumn = document.createElement('ib');
        waColumn.className = 'p-cell cell-wa';

        var xpColumn = document.createElement('ib');
        xpColumn.className = 'p-cell cell-xp';

        var r5Column = document.createElement('ib');
        r5Column.className = 'p-cell cell-r5';

        getPlayer(row.id.match(/\d+/)[0]).then(result =>{
            ageColumn.textContent = result.age + '.' + result.months;
            posColumn.innerHTML = result.fp;
            siColumn.textContent = result.skill_index;
            waColumn.style.color = WAcolor(Number(result.wage.match(/<span[^>]*>(.*?)<\/span>/)[1].replace(/,/g, '')));
            waColumn.textContent = (Number(result.wage.match(/<span[^>]*>(.*?)<\/span>/)[1].replace(/,/g, ''))/1000000).toFixed(2) + "M";
            xpColumn.style.color = EXPcolor(result.routine);
            xpColumn.textContent = result.routine;
            r5Column.innerHTML = calcR5(result);
        })

        // 获取目标列cell-bid
        var targetColumn = row.querySelector('.cell-bid');
        // 将新的列元素插入
        if (targetColumn) {
            row.insertBefore(ageColumn, targetColumn);
            row.insertBefore(posColumn, targetColumn);
            row.insertBefore(siColumn, targetColumn);
            row.insertBefore(waColumn, targetColumn);
            row.insertBefore(xpColumn, targetColumn);
            row.insertBefore(r5Column, targetColumn);
        }
    });
});

function getPlayer(pid) {
    return new Promise((resolve, reject) => {
        $.post("https://trophymanager.com/ajax/tooltip.ajax.php", { player_id: pid }, function(result) {
            resolve(result.player);
        }, 'json').fail(function(error) {
            reject(error);
        });
    });
}

const APP_COLOR = {
    LEVEL_1: "Darkred",
    LEVEL_2: "Black",
    LEVEL_3: "Orange",
    LEVEL_4: "Yellow",
    LEVEL_5: "Blue",
    LEVEL_6: "Aqua",
    LEVEL_7: "Green",
    LEVEL_8: "White",
    LEVEL_9: "GRAY",
};

const WA_CLASS = {
	LEVEL_1: 7000000,
	LEVEL_2: 6000000,
	LEVEL_3: 5000000,
	LEVEL_4: 4000000,
	LEVEL_5: 3000000,
	LEVEL_6: 2000000,
	LEVEL_7: 1000000,
	LEVEL_8: 0
};

const XP_CLASS = {
	LEVEL_1: 90,
	LEVEL_2: 70,
	LEVEL_3: 50,
	LEVEL_4: 40,
	LEVEL_5: 30,
	LEVEL_6: 20,
	LEVEL_7: 10,
	LEVEL_8: 0
};

function WAcolor(value){
    if (value >= WA_CLASS.LEVEL_1) {
        return APP_COLOR.LEVEL_1;
    }
    else if (value >= WA_CLASS.LEVEL_2) {
        return APP_COLOR.LEVEL_2;
    }
    else if (value >= WA_CLASS.LEVEL_3) {
        return APP_COLOR.LEVEL_3;
    }
    else if (value >= WA_CLASS.LEVEL_4) {
        return APP_COLOR.LEVEL_4;
    }
    else if (value >= WA_CLASS.LEVEL_5) {
        return APP_COLOR.LEVEL_5;
    }
    else if (value >= WA_CLASS.LEVEL_6) {
        return APP_COLOR.LEVEL_6;
    }
    else if (value >= WA_CLASS.LEVEL_7) {
        return APP_COLOR.LEVEL_7;
    }
    else {
        return APP_COLOR.LEVEL_8;
    }
}

function EXPcolor(value){
    if (value >= XP_CLASS.LEVEL_1) {
        return APP_COLOR.LEVEL_1;
    }
    else if (value >= XP_CLASS.LEVEL_2) {
        return APP_COLOR.LEVEL_2;
    }
    else if (value >= XP_CLASS.LEVEL_3) {
        return APP_COLOR.LEVEL_3;
    }
    else if (value >= XP_CLASS.LEVEL_4) {
        return APP_COLOR.LEVEL_4;
    }
    else if (value >= XP_CLASS.LEVEL_5) {
        return APP_COLOR.LEVEL_5;
    }
    else if (value >= XP_CLASS.LEVEL_6) {
        return APP_COLOR.LEVEL_6;
    }
    else if (value >= XP_CLASS.LEVEL_7) {
        return APP_COLOR.LEVEL_7;
    }
    else {
        return APP_COLOR.LEVEL_8;
    }
}

let weightR5 = [
        [0.41029304, 0.18048062, 0.56730138, 1.06344654, 1.02312672, 0.40831256, 0.58235457, 0.12717479, 0.05454137, 0.09089830, 0.42381693, 0.04626272, 0.02199046, 0],	// DC
        [0.42126371, 0.18293193, 0.60567629, 0.91904794, 0.89070915, 0.40038476, 0.56146633, 0.15053902, 0.15955429, 0.15682932, 0.42109742, 0.09460329, 0.03589655, 0],	// DL/R
        [0.23412419, 0.32032289, 0.62194779, 0.63162534, 0.63143081, 0.45218831, 0.47370658, 0.55054737, 0.17744915, 0.39932519, 0.26915814, 0.16413124, 0.07404301, 0],	// DMC
        [0.27276905, 0.26814289, 0.61104798, 0.39865092, 0.42862643, 0.43582015, 0.46617076, 0.44931076, 0.25175412, 0.46446692, 0.29986350, 0.43843061, 0.21494592, 0],	// DML/R
        [0.25219260, 0.25112993, 0.56090649, 0.18230261, 0.18376490, 0.45928749, 0.53498118, 0.59461481, 0.09851189, 0.61601950, 0.31243959, 0.65402884, 0.29982016, 0],	// MC
        [0.28155678, 0.24090675, 0.60680245, 0.19068879, 0.20018012, 0.45148647, 0.48230007, 0.42982389, 0.26268609, 0.57933805, 0.31712419, 0.65824985, 0.29885649, 0],	// ML/R
        [0.22029884, 0.29229690, 0.63248227, 0.09904394, 0.10043602, 0.47469498, 0.52919791, 0.77555880, 0.10531819, 0.71048302, 0.27667115, 0.56813972, 0.21537826, 0],	// OMC
        [0.21151292, 0.35804710, 0.88688492, 0.14391236, 0.13769621, 0.46586605, 0.34446036, 0.51377701, 0.59723919, 0.75126119, 0.16550722, 0.29966502, 0.12417045, 0],	// OML/R
        [0.35479780, 0.14887553, 0.43273380, 0.00023928, 0.00021111, 0.46931131, 0.57731335, 0.41686333, 0.05607604, 0.62121195, 0.45370457, 1.03660702, 0.43205492, 0],	// F
        [0.45462811, 0.30278232, 0.45462811, 0.90925623, 0.45462811, 0.90925623, 0.45462811, 0.45462811, 0.30278232, 0.15139116, 0.15139116]
    ]
// REC weights Str				   Sta				  Pac				 Mar				 Tac				 Wor				Pos				   Pas				  Cro				 Tec				Hea				   Fin				  Lon				 Set
let weightR = [
    [0.653962303361921, 0.330014238020285, 0.562994547223387, 0.891800163983125, 0.871069095865164, 0.454514672470839, 0.555697278549252, 0.42777598627972, 0.338218821750765, 0.134348455965202, 0.796916786677566, 0.048831870932616, 0.116363443378865, 0.282347752982916],	//DC
    [0.565605120229193, 0.430973382039533, 0.917125432457378, 0.815702528287723, 0.99022325015212, 0.547995876625372, 0.522203232914265, 0.309928898819518, 0.837365352274204, 0.483822472259513, 0.656901420858592, 0.137582588344562, 0.163658117596413, 0.303915447383549],	//DL/R
    [0.55838825558912, 0.603683502357502, 0.563792314670998, 0.770425088563048, 0.641965853834719, 0.675495235675077, 0.683863478201805, 0.757342915150728, 0.473070797767482, 0.494107823556837, 0.397547163237438, 0.429660916538242, 0.56364174077388, 0.224791093448809],	//DMC
    [0.582074038075056, 0.420032202680124, 0.7887541874616, 0.726221389774063, 0.722972329840151, 0.737617252827595, 0.62234458453736, 0.466946909655194, 0.814382915598981, 0.561877829393632, 0.367446981999576, 0.360623408340649, 0.390057769678583, 0.249517737311268],	//DML/R
    [0.578431939417021, 0.778134685048085, 0.574726322388294, 0.71400292078636, 0.635403391007978, 0.822308254446722, 0.877857040588335, 0.864265671245476, 0.433450219618618, 0.697164252367046, 0.412568516841575, 0.586627586272733, 0.617905053049757, 0.308426814834866],	//MC
    [0.497429376361348, 0.545347364699553, 0.788280917110089, 0.578724574327427, 0.663235306043286, 0.772537143243647, 0.638706135095199, 0.538453108494387, 0.887935381275257, 0.572515970409641, 0.290549550901104, 0.476180499897665, 0.526149424898544, 0.287001645266184],	//ML/R
    [0.656437768926678, 0.617260722143117, 0.656569986958435, 0.63741054520629, 0.55148452726771, 0.922379789905246, 0.790553566121791, 0.999688557334153, 0.426203575603164, 0.778770912265944, 0.652374065121788, 0.662264393455567, 0.73120100926333, 0.274563618133769],	//OMC
    [0.483341947292063, 0.494773052635464, 0.799434804259974, 0.628789194186491, 0.633847969631333, 0.681354437033551, 0.671233869875345, 0.536121458625519, 0.849389745477645, 0.684067723274814, 0.389732973354501, 0.499972692291964, 0.577231818355874, 0.272773352088982],	//OML/R
    [0.493917051093473, 0.370423904816088, 0.532148929996192, 0.0629206658586336, 0.0904950078155216, 0.415494774080483, 0.54106107545574, 0.468181146095801, 0.158106484131194, 0.461125738338018, 0.83399612271067, 0.999828328674183, 0.827171977606305, 0.253225855459207],	//F
    //			   For  Rez    Vit  Ind  One  Ref Aer  Sar  Com    Deg    Aru
    [0.5, 0.333, 0.5, 1, 0.5, 1, 0.5, 0.5, 0.333, 0.333, 0.333]
]; //GK

let i = 0 ;
var MR = Math.round;
var MP = Math.pow;
var ML = Math.log;

const funFix2 = i => {
    i = (Math.round(i * 100) / 100).toFixed(2);
    return i;
}

const funFix3 = i => {
    i = (Math.round(i * 1000) / 1000).toFixed(3);
    return i;
}

const calculateRemainders = (player, positionIndex, skills, SI) => {
    let weight = 263533760000;
    if (positionIndex === 9) weight = 48717927500;
    let ratingR = 0;
    let skillSum = 0;

    for (let i = 0; i < skills.length; i++) {
        skillSum += parseInt(skills[i]);
    }

    let remainder = Math.round((Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - skillSum) * 10) / 10;		// RatingR4 remainder
    let remainderWeight = 0;
    let remainderWeight2 = 0;
    let not20 = 0;

    weightR[positionIndex].forEach((value, index) => {
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

const calculateRERECOld = (player, positionIndex, skills, SI, rou) => {
    const remainders = calculateRemainders(player, positionIndex, skills, SI);
    let rou2 = (3 / 100) * (100 - (100) * Math.pow(Math.E, -rou * 0.035));
    const remainder = remainders[0] * remainders[1] / remainders[2];
    let ratingR = remainders[3] + remainder;
    return Number(funFix2(ratingR + rou2 * 5));
};

const calculateREREC = (player, positionIndex, skills, SI, rou) => {
    let ratingR4 = calculateRERECOld(player, positionIndex, skills, SI, rou);
    let rou2 = (3 / 100) * (100 - (100) * Math.pow(Math.E, -rou * 0.035));
    const remainders = calculateRemainders(player, positionIndex, skills, SI);
    var goldstar = 0;
    var skillsB = [];
    for (let j = 0; j < 2; j++) {
        for (i = 0; i < skills.length; i++) {
            if (j == 0 && skills[i] == 20) goldstar++;
            if (j == 1) {
                if (skills[i] != 20) skillsB[i] = skills[i] * 1 + remainders[0] / (skills.length - goldstar);
                else skillsB[i] = skills[i];
            }
        }
    }

    var skillsB_rou = [];
    for (i = 0; i < skills.length; i++) {
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

const getPosition = pos => {
    switch (pos) {
        case 'gk':
            return 9;
        case 'dc':
            return 0;
        case 'dr':
        case 'dl':
            return 1;
        case 'dmr':
        case 'dml':
            return 3;
        case 'dmc':
            return 2;
        case 'mr':
        case 'ml':
            return 5;
        case 'mc':
            return 4;
        case 'omr':
        case 'oml':
            return 7;
        case 'omc':
            return 6;
        case 'fc':
            return 8;
    }
}

function calcR5(result) {
    let player = result;
    player.asi = Number(player.skill_index.split(',').join(''));
    player.xp = Number(player.routine.split(',').join(''));
    player.rating = [];
    let positions = player.favposition.split(',');
    positions.forEach(pos => {
        let position = getPosition(pos);
        let skills = [];
        const checkSkills = player.skills.filter(skill => skill.value);
        if (position === 9) {
            skills = [checkSkills[0].value, checkSkills[2].value, checkSkills[4].value, checkSkills[1].value, checkSkills[3].value, checkSkills[5].value, checkSkills[6].value, checkSkills[7].value, checkSkills[8].value, checkSkills[9].value, checkSkills[10].value]
        } else {
            for (let i = 0; i <= checkSkills.length; i = i + 2) {
                if (checkSkills[i]) {
                    skills.push(checkSkills[i].value)
                }
            }
            for (let i = 1; i <= checkSkills.length; i = i + 2) {
                if (checkSkills[i]) {
                    skills.push(checkSkills[i].value)
                }
            }
        }
        skills.forEach((skill, index) => {
            if (typeof (skill) === 'string') {
                if (skill.includes('silver')) skills[index] = 19
                else skills[index] = 20
            }
        })
        const params = [player, position, skills, player.asi, player.xp];
        player.rating.push(calculateREREC(...params));
    })
    return setR5color(player.rating);
}


function setR5color(rating){
    let text = [];
    rating.forEach((value, index)=> {
       text.push("<ib style='color:"+R5color(value)+";'>"+value+"</ib>");
    })
    return text.join('/');
}

const R5_CLASS = {
    LEVEL_1: 110,
    LEVEL_2: 100,
    LEVEL_3: 90,
    LEVEL_4: 80,
    LEVEL_5: 70,
    LEVEL_6: 60,
    LEVEL_7: 50,
    LEVEL_8: 40,
    LEVEL_9: 0
};

function R5color(value){
    if (value >= R5_CLASS.LEVEL_1) {
        return APP_COLOR.LEVEL_1;
    }
    else if (value >= R5_CLASS.LEVEL_2) {
        return APP_COLOR.LEVEL_2;
    }
    else if (value >= R5_CLASS.LEVEL_3) {
        return APP_COLOR.LEVEL_3;
    }
    else if (value >= R5_CLASS.LEVEL_4) {
        return APP_COLOR.LEVEL_4;
    }
    else if (value >= R5_CLASS.LEVEL_5) {
        return APP_COLOR.LEVEL_5;
    }
    else if (value >= R5_CLASS.LEVEL_6) {
        return APP_COLOR.LEVEL_6;
    }
    else if (value >= R5_CLASS.LEVEL_7) {
        return APP_COLOR.LEVEL_7;
    }
    else if (value >= R5_CLASS.LEVEL_8) {
        return APP_COLOR.LEVEL_8;
    }
    else {
        return APP_COLOR.LEVEL_9;
    }
}