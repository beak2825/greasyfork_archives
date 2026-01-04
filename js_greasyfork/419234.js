// ==UserScript==
// @name           Transfer List
// @version        1.0.10
// @author         Shomi
// @description    You can use this script to see rating R4, REC and TI on TL.
// @match	   https://trophymanager.com/transfer/
// @namespace https://greasyfork.org/users/721529
// @downloadURL https://update.greasyfork.org/scripts/419234/Transfer%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/419234/Transfer%20List.meta.js
// ==/UserScript==

let wage_rate = 15.808;

let weightR4 = [
    [0.51872935, 0.29081119, 0.57222393, 0.89735816, 0.84487852, 0.50887940, 0.50887940, 0.13637928, 0.05248024, 0.09388931, 0.57549122, 0.00000000, 0.00000000, 0.0],	// DC
    [0.45240063, 0.31762087, 0.68150374, 0.77724031, 0.74690951, 0.50072196, 0.45947168, 0.17663123, 0.23886264, 0.18410349, 0.46453393, 0.00000000, 0.00000000, 0.0],	// DL/R
    [0.43789335, 0.31844356, 0.53515723, 0.63671706, 0.59109742, 0.51311701, 0.53184426, 0.32421168, 0.06318165, 0.27931537, 0.50093723, 0.19317517, 0.07490902, 0.0],	// DMC
    [0.42311032, 0.32315966, 0.62271745, 0.53932111, 0.51442838, 0.49835997, 0.47896659, 0.26434782, 0.22586124, 0.32182902, 0.45537227, 0.23961054, 0.09291562, 0.0],	// DML/R
    [0.31849880, 0.36581214, 0.50091016, 0.31726444, 0.28029020, 0.52022170, 0.55763723, 0.60199246, 0.10044356, 0.51811057, 0.38320838, 0.38594825, 0.14966211, 0.0],	// MC
    [0.35409971, 0.34443972, 0.64417234, 0.30427501, 0.27956082, 0.49925481, 0.46093655, 0.32887111, 0.38695101, 0.47884837, 0.37465446, 0.39194758, 0.15198852, 0.0],	// ML/R
    [0.32272636, 0.35024067, 0.48762872, 0.22888914, 0.19049636, 0.52620414, 0.57842512, 0.53330409, 0.07523792, 0.55942740, 0.39986691, 0.53866926, 0.20888391, 0.0],	// OMC
    [0.36311066, 0.33106245, 0.61831416, 0.19830147, 0.17415753, 0.50049575, 0.47737842, 0.28937553, 0.34729042, 0.52834210, 0.39939218, 0.55684664, 0.21593269, 0.0],	// OML/R
    [0.40622753, 0.29744114, 0.39446722, 0.09952139, 0.07503885, 0.50402399, 0.58505850, 0.36932466, 0.05210389, 0.53677990, 0.51998862, 0.83588627, 0.32413803, 0.0],	// F
    [0.37313433, 0.37313433, 0.37313433, 0.74626866, 0.52238806, 0.74626866, 0.52238806, 0.52238806, 0.37313433, 0.22388060, 0.22388060]
];	// GK
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
// RECb weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
let weightRb = [
    [0.10493615, 0.05208547, 0.07934211, 0.14448971, 0.13159554, 0.06553072, 0.07778375, 0.06669303, 0.05158306, 0.02753168, 0.12055170, 0.01350989, 0.02549169, 0.03887550],	// DC
    [0.07715535, 0.04943315, 0.11627229, 0.11638685, 0.12893778, 0.07747251, 0.06370799, 0.03830611, 0.10361093, 0.06253997, 0.09128094, 0.01314110, 0.02449199, 0.03726305],	// DL/R
    [0.08219824, 0.08668831, 0.07434242, 0.09661001, 0.08894242, 0.08998026, 0.09281287, 0.08868309, 0.04753574, 0.06042619, 0.05396986, 0.05059984, 0.05660203, 0.03060871],	// DMC
    [0.06744248, 0.06641401, 0.09977251, 0.08253749, 0.09709316, 0.09241026, 0.08513703, 0.06127851, 0.10275520, 0.07985941, 0.04618960, 0.03927270, 0.05285911, 0.02697852],	// DML/R
    [0.07304213, 0.08174111, 0.07248656, 0.08482334, 0.07078726, 0.09568392, 0.09464529, 0.09580381, 0.04746231, 0.07093008, 0.04595281, 0.05955544, 0.07161249, 0.03547345],	// MC
    [0.06527363, 0.06410270, 0.09701305, 0.07406706, 0.08563595, 0.09648566, 0.08651209, 0.06357183, 0.10819222, 0.07386495, 0.03245554, 0.05430668, 0.06572005, 0.03279859],	// ML/R
    [0.07842736, 0.07744888, 0.07201150, 0.06734457, 0.05002348, 0.08350204, 0.08207655, 0.11181914, 0.03756112, 0.07486004, 0.06533972, 0.07457344, 0.09781475, 0.02719742],	// OMC
    [0.06545375, 0.06145378, 0.10503536, 0.06421508, 0.07627526, 0.09232981, 0.07763931, 0.07001035, 0.11307331, 0.07298351, 0.04248486, 0.06462713, 0.07038293, 0.02403557],	// OML/R
    [0.07738289, 0.05022488, 0.07790481, 0.01356516, 0.01038191, 0.06495444, 0.07721954, 0.07701905, 0.02680715, 0.07759692, 0.12701687, 0.15378395, 0.12808992, 0.03805251],	// F
    [0.07466384, 0.07466384, 0.07466384, 0.14932769, 0.10452938, 0.14932769, 0.10452938, 0.10344411, 0.07512610, 0.04492581, 0.04479831]
];	// GK
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
let i = 0;
let posToCheck = -1;
let minRec = 0;
let minTI = null;
let ratingType = 'R5';
let firstParse = 0;
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

const seasonTI = (player, SI, positionIndex) => {
    var wage = Number(player.wage.split("<span class='coin'>")[1].split('</span>')[0].replace(/,/g, ""))
    var today = new Date();
    var SS = new Date("07 10 2017 08:00:00 GMT");				// s50 start
    var training1 = new Date("07 10 2017 23:00:00 GMT");				// first training
    var day = (today.getTime() - training1.getTime()) / 1000 / 3600 / 24;
    while (day > 84 - 16 / 24) day -= 84;
    var session = Math.floor(day / 7) + 1;							// training sessions
    var ageMax = 20.1 + session / 12;							// max new player age

    var age = Number(player.age) * 1 + Number(player.months) / 12;
    var check = today.getTime() - SS.getTime();
    var season = 84 * 24 * 3600 * 1000;
    var count = 0;
    var Result = 0;


    while (check > season) {
        check -= season;
        count++;
    }
    let weight = 263533760000;
    if (positionIndex === 9) weight = 48717927500;

    if (!(wage == 30000 || (Number(player.player_id) > 120359295 && count == 0))) {	// s50 youth player ID
        wage_rate = 15.808;
        var TI1 = Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - Math.pow(2, Math.log(weight * wage / (wage_rate)) / Math.log(Math.pow(2, 7)));
        TI1 = Math.round(TI1 * 10);

        return funFix2(TI1 / session)
    }
    Result = TI1 / session;
    if (Number(player.player_id) > 124048574 && age < ageMax) {		// s55 BOT player ID
        wage_rate = 23.75;
        var TI2 = Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - Math.pow(2, Math.log(weight * wage / (wage_rate)) / Math.log(Math.pow(2, 7)));
        return funFix2(TI2 / session)
    }
    return null
}


const calculateRemainders = (player, positionIndex, skills, SI) => {
    let weight = 263533760000;
    if (positionIndex === 9) weight = 48717927500;
    let rec = 0;
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
        rec += skills[index] * weightRb[positionIndex][index];
        const weight = ratingType === 'R5' ? weightR5 : weightR4;
        ratingR += skills[index] * weight[positionIndex][index];
        if (skills[index] != 20) {
            remainderWeight += weightRb[positionIndex][index];
            remainderWeight2 += weight[positionIndex][index];
            not20++;
        }
    })
    if (remainder / not20 > 0.9 || !not20) {
        if (positionIndex === 9) not20 = 11;
        else not20 = 14;
        remainderWeight = 1;
        remainderWeight2 = 5;
    }
    rec = funFix2((rec + remainder * remainderWeight / not20 - 2) / 3);
    return [remainder, Math.round(remainderWeight2), not20, ratingR, rec];
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
let f = 0;
const GetPlayerData = (playerID) => {
    return new Promise((resolve, reject) => {
        $.post("/ajax/tooltip.ajax.php", {"player_id": playerID, minigame: undefined})
            .done((data) => {
                let player = JSON.parse(data).player;
                player.asi = Number(player.skill_index.split(',').join(''));
                player.xp = Number(player.routine.split(',').join(''));
                player.rec = [];
                player.rating = [];
                player.ti = null;
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
                    f = 1;
                    const selectedPosition = posToCheck > -1 ? posToCheck : position;
                    const params = [player, selectedPosition, skills, player.asi, player.xp];
                    const playerRating = ratingType === 'R5' ? calculateREREC(...params) : calculateRERECOld(...params);
                    player.rating.push(playerRating);
                    player.rec.push(Number(calculateRemainders(player, selectedPosition, skills, player.asi)[4]));
                    player.ti = seasonTI(player, player.asi, selectedPosition);
                })
                const {rec, rating, ti, months, age} = player;
                resolve({rec, rating, ti, months, age});
            }).fail((error) => {
            reject(error);
        });
    });
}

const addColumn = (row, text, color = '#000', classList = 'align_center') => {
    let el = document.createElement('td');
    el.style.color = color;
    el.style.fontWeight = 'bold';
    el.classList.add(classList);
    el.innerText = text;
    row.appendChild(el);
}

const updateRow = (player, index) => {
    let row = document.querySelectorAll('div#transfer_list table tr[id]')[index];
    if (!row) return;
    if(row.childNodes[2]) row.childNodes[2].innerText = player.age + '.' + player.months;
    if ((!player.rating.find(skill => Number(skill) >= Number(minRec))) || (minTI && Number(player.ti) < Number(minTI))) {
        row.style.display = 'none';
    } else {
        row.style.display = 'table-row';
        const span = row.childNodes[7].querySelector('span');
        if (span) {
            let price = Number(span.getAttribute('sort'));
            price = Math.round(price / 1000 / 100) / 10 + 'M';
            row.childNodes[7].innerText = price;
            row.childNodes[7].classList.remove('align_right');
            row.childNodes[7].classList.add('align_center');
        }
        row.childNodes[6].style.textAlign = 'center'
        const spanAsi = row.childNodes[5].querySelector('span');
        if (spanAsi) {
            let asi = Number(spanAsi.getAttribute('sort'));
            asi = Math.round(asi / 100) / 10 + 'K';
            row.childNodes[5].innerText = asi
        }
        if (row.childNodes.length == '10') {
            row.lastChild.remove();
            row.lastChild.remove();
        } else {
            row.lastChild.remove();
            row.lastChild.remove();
            row.lastChild.remove();
        }
        addColumn(row, player.rating.join(' - '), '#ffb354');
        addColumn(row, player.rec.join(' - '));
        addColumn(row, player.ti, '#fff');
    }
}

const resizeTable = () => {
    const thead = document.querySelectorAll('div#transfer_list tr')[0];
    thead.childNodes[1].innerText = 'Name'
    thead.childNodes[1].style.textAlign = 'left'
    thead.childNodes[2].innerText = 'Age'
    thead.childNodes[6].innerText = 'Time'
    thead.childNodes[7].innerText = 'Price'
    if (thead.childNodes.length == '10') {
        thead.lastChild.remove();
        thead.lastChild.remove();
        addColumn(thead, 'Rating', '#fff');
        addColumn(thead, 'REC', '#fff');
        addColumn(thead, 'TI', '#fff');
    }

    [...document.querySelectorAll('.main_center')].forEach(el => {
        el.style.width = '1210px'
    })
    document.querySelectorAll('.column1_d')[0].style.width = '1200px';
    document.querySelectorAll('.transfer_list_outer')[0].style.width = '936px';
}

(function () {
    'use strict';
    const addFilters = () => {
        document.getElementById('search_btn').remove();

        const filtersEl = document.getElementById('filters');
        const el = document.createElement('div');

        const div1 = document.createElement('div');
        div1.classList.add('align_center', 'padding');


        const inputPosEl = document.createElement('select');
        inputPosEl.id = 'pos_rating';
        inputPosEl.classList.add('embossed')
        for (let i = -1; i <= 9; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            let positionName = 'DC';
            switch (i) {
                case -1:
                    positionName = 'Default Position';
                    break;
                case 0:
                    positionName = 'DC';
                    break;
                case 1:
                    positionName = 'DR/L';
                    break;
                case 2:
                    positionName = 'DMC';
                    break;
                case 3:
                    positionName = 'DMR/L';
                    break;
                case 4:
                    positionName = 'MC';
                    break;
                case 5:
                    positionName = 'MR/L';
                    break;
                case 6:
                    positionName = 'OMC';
                    break;
                case 7:
                    positionName = 'OMR/L';
                    break;
                case 8:
                    positionName = 'FC';
                    break;
                case 9:
                    positionName = 'GK';
                    break;
            }
            opt.innerHTML = positionName;
            inputPosEl.appendChild(opt);
        }
        const labelPosEl = document.createElement('label');
        labelPosEl.innerText = 'Select Position for Rating'
        const breakPosEl = document.createElement('br');
        const breakPosEl2 = document.createElement('br');
        div1.appendChild(labelPosEl);
        div1.appendChild(breakPosEl);
        div1.appendChild(inputPosEl);
        div1.appendChild(breakPosEl2);


        const inputEl = document.createElement('input');
        inputEl.id = 'min_r4';
        inputEl.type = 'number';
        inputEl.classList.add('embossed')
        const labelEl = document.createElement('label');
        labelEl.innerText = 'Min Rating'
        const breakEl = document.createElement('br');
        const breakEl2 = document.createElement('br');
        div1.appendChild(labelEl);
        div1.appendChild(breakEl);
        div1.appendChild(inputEl);
        div1.appendChild(breakEl2);

        const inputTIEl = document.createElement('input');
        inputTIEl.id = 'min_ti';
        inputTIEl.type = 'number';
        inputTIEl.classList.add('embossed')
        const labelTiEl = document.createElement('label');
        labelTiEl.innerText = 'Min TI'
        const breakTiEl = document.createElement('br');
        div1.appendChild(labelTiEl);
        div1.appendChild(breakTiEl);
        div1.appendChild(inputTIEl);

        const labelR = document.createElement('label');
        labelR.innerText = 'Rating Type'
        labelR.style.marginBottom = '8px'
        const labelR4 = document.createElement('label');
        labelR4.innerText = 'R4'
        const labelR5 = document.createElement('label');
        labelR5.innerText = 'R5'
        const inputR4 = document.createElement('input');
        inputR4.id = 'r4';
        inputR4.type = 'radio';
        inputR4.classList.add('embossed')
        inputR4.value = 'R4'
        inputR4.name = 'ratingType'
        const inputR5 = document.createElement('input');
        inputR5.id = 'r5';
        inputR5.type = 'radio';
        inputR5.name = 'ratingType'
        inputR5.value = 'R5'
        inputR5.checked = true;
        inputR5.classList.add('embossed')
        labelR5.style.marginLeft = '8px'
        const breakR4El = document.createElement('br');
        const breakREl = document.createElement('br');
        div1.appendChild(breakREl);
        div1.appendChild(labelR);
        div1.appendChild(breakR4El);
        div1.appendChild(labelR4);
        div1.appendChild(inputR4);
        div1.appendChild(labelR5);
        div1.appendChild(inputR5);

        const div2 = document.createElement('div');
        div2.classList.add('align_center', 'padding');

        const buttonEl = document.createElement('button');
        buttonEl.style.padding = '4px 60px'
        buttonEl.style.marginTop = '4px'
        buttonEl.classList.add('button', 'button_icon');
        buttonEl.textContent = 'Filter';
        buttonEl.addEventListener('click', () => {
            posToCheck = Number(inputPosEl.value);
            minRec = inputEl.value;
            minTI = inputTIEl.value;
            ratingType = inputR4.checked ? 'R4' : 'R5';
            firstParse++;
            init();
        })
        div2.appendChild(buttonEl);

        el.appendChild(div1);
        el.appendChild(div2);
        filtersEl.appendChild(el);
    }

    addFilters();

    function init(mutationRecords) {
        if (document.querySelector('div#transfer_list table') === null) return;
        resizeTable();
        let playersIDs = [];
        [...document.querySelectorAll('div#transfer_list tr[id^=player_row]')].forEach(el => {
            playersIDs.push(el.id.split('_')[2]);
        })
        playersIDs.map(GetPlayerData).map((promise, index) => {
            promise.then(player => updateRow(player, index))
        });
    }

    let observer = new MutationObserver(init);
    observer.observe(document.querySelector('div#transfer_list'), {childList: true});
})();
