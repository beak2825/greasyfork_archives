// ==UserScript==
// @name         TM 转会助手A
// @description  基于 TM Transfer Profit Calculator by 中美两开花 和 Transfer List CN by Shomi
// @version      2.26
// @match        http://trophymanager.com/transfer/*
// @match        https://trophymanager.com/transfer/*
// @license      MIT
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/1304483
// @downloadURL https://update.greasyfork.org/scripts/502065/TM%20%E8%BD%AC%E4%BC%9A%E5%8A%A9%E6%89%8BA.user.js
// @updateURL https://update.greasyfork.org/scripts/502065/TM%20%E8%BD%AC%E4%BC%9A%E5%8A%A9%E6%89%8BA.meta.js
// ==/UserScript==

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
];
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

let posToCheck = -1;
let minR5 = 0;
let minREC = 0;
let minTI = -100;
let minSTI = -100;
let minEXP = 0;
let maxWA= 100;
let minProfit= -50000;

let i = 0 ;
var MR = Math.round;
var MP = Math.pow;
var ML = Math.log;

var myClubId;
var getHomeIdInterval = setInterval(getHomeId, 500);

/**
 * 获取home ID。
 * 该函数首先检查变量myClubId是否已定义，如果已定义，则清除定时器getHomeIdInterval。
 * 如果myClubId未定义，尝试从页面元素中获取俱乐部ID，并赋值给myClubId。
 *
 * @returns {void} 该函数没有返回值。
 */
function getHomeId() {
    // 检查myClubId是否已定义，若已定义则清除定时器
    if (myClubId != undefined) {
        clearInterval(getHomeIdInterval);
    } else {
        // 尝试捕获异常，从页面中获取俱乐部ID
        try {
            myClubId = $('.club.faux_link').attr('club');
        } catch (e) {}
    }
}

const APP_COLOR = {
    LEVEL_1: "Darkred",
    LEVEL_2: "Black",
    LEVEL_3: "Orange",
    LEVEL_4: "Yellow",
    LEVEL_5: "Blue",
    LEVEL_6: "Aqua",
    LEVEL_7: "LightGreen",
    LEVEL_8: "White",
    LEVEL_9: "LightGary",
};

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

const REC_CLASS = {
    LEVEL_1: 5.5,
    LEVEL_2: 5,
    LEVEL_3: 4.5,
    LEVEL_4: 4,
    LEVEL_5: 3.5,
    LEVEL_6: 3.,
    LEVEL_7: 2.5,
    LEVEL_8: 1.5,
    LEVEL_9: 0.
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

function saveItem(key,value) {
    localStorage.setItem(key, value);
}

function getItem(key) {
    return localStorage.getItem(key) == "true";
}

let show_r5 = getItem("show_r5");
let show_rec = getItem("show_rec");
let show_ti = getItem("show_ti");
let show_xp = getItem("show_xp");
let show_profit = getItem("show_profit");
let show_wa = getItem("show_wa");
let tiType = getItem("tiType");
let r5Type = getItem("r5Type");

var trainingLevel;

let observer = new MutationObserver(updateTransferList);
observer.observe(document.querySelector('div#transfer_list'), {childList: true});

const addFilters = () => {
    document.getElementById('search_btn').innerHTML = "<span class='button_border'>刷新</span>";
    const filters1 = document.getElementById('filters');
    const el = document.createElement('div');

    const div1 = document.createElement('div');
    div1.classList.add('align_center', 'padding');

    const inputPos = document.createElement('select');
    inputPos.id = 'pos_rating';
    inputPos.classList.add('embossed')
    for (let i = -1; i <= 9; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        let positionName = 'DC';
        switch (i) {
            case -1:
                positionName = '默认位置';
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
        inputPos.appendChild(opt);
    }
    const labelPos = document.createElement('label');
    labelPos.innerText = '选择Rating评分位置'
    div1.appendChild(labelPos);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputPos);
    div1.appendChild(document.createElement('br'));

    const inputR5 = document.createElement('input');
    inputR5.id = 'min_r5';
    inputR5.type = 'number';
    inputR5.classList.add('embossed')
    inputR5.value = 0;
    const labelR5 = document.createElement('label');
    labelR5.innerText = 'Rating评分下限'
    div1.appendChild(labelR5);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputR5);
    div1.appendChild(document.createElement('br'));

    const inputREC = document.createElement('input');
    inputREC.id = 'min_rec';
    inputREC.type = 'number';
    inputREC.classList.add('embossed')
    inputREC.value = 0;
    const labelREC = document.createElement('label');
    labelREC.innerText = 'REC评分下限'
    div1.appendChild(labelREC);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputREC);
    div1.appendChild(document.createElement('br'));

    const inputTI = document.createElement('input');
    inputTI.id = 'min_ti';
    inputTI.type = 'number';
    inputTI.classList.add('embossed')
    inputTI.value = -100;
    const labelTI = document.createElement('label');
    labelTI.innerText = '训练强度TI下限'
    div1.appendChild(labelTI);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputTI);
    div1.appendChild(document.createElement('br'));

    const inputSTI = document.createElement('input');
    inputSTI.id = 'min_sti';
    inputSTI.type = 'number';
    inputSTI.classList.add('embossed')
    inputSTI.value = -100;
    const labelSTI = document.createElement('label');
    labelSTI.innerText = '赛季平均TI下限'
    div1.appendChild(labelSTI);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputSTI);
    div1.appendChild(document.createElement('br'));

    const inputXP = document.createElement('input');
    inputXP.id = 'min_exp';
    inputXP.type = 'number';
    inputXP.classList.add('embossed')
    inputXP.value = 0.0;
    const labelXP = document.createElement('label');
    labelXP.innerText = '经验下限'
    div1.appendChild(labelXP);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputXP);
    div1.appendChild(document.createElement('br'));

    const inputProfit = document.createElement('input');
    inputProfit.id = 'min_profit';
    inputProfit.type = 'number';
    inputProfit.classList.add('embossed')
    inputProfit.value = -50000;
    const labelProfit = document.createElement('label');
    labelProfit.innerText = '利润下限(M)'
    div1.appendChild(labelProfit);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputProfit);
    div1.appendChild(document.createElement('br'));

    const inputWA = document.createElement('input');
    inputWA.id = 'max_wa';
    inputWA.type = 'number';
    inputWA.classList.add('embossed')
    inputWA.value = 100;
    const labelWA = document.createElement('label');
    labelWA.innerText = '工资上限(M)'
    div1.appendChild(labelWA);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(inputWA);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(document.createElement('br'));

    const labelShow = document.createElement('label');
    labelShow.innerText = '显示内容'
    div1.appendChild(labelShow);
    div1.appendChild(document.createElement('br'));

    const inputShowR5 = document.createElement('input');
    inputShowR5.id = 'show_r5';
    inputShowR5.type = 'checkbox';
    inputShowR5.checked = show_r5;
    inputShowR5.classList.add('embossed')
    const labelShowR5 = document.createElement('label');
    labelShowR5.innerText = 'R5'
    div1.appendChild(inputShowR5);
    div1.appendChild(labelShowR5);
    div1.appendChild(document.createElement('br'));

    const inputShowREC = document.createElement('input');
    inputShowREC.id = 'show_rec';
    inputShowREC.type = 'checkbox';
    inputShowREC.checked = show_rec;
    inputShowREC.classList.add('embossed')
    const labelShowREC = document.createElement('label');
    labelShowREC.innerText = 'REC'
    div1.appendChild(inputShowREC);
    div1.appendChild(labelShowREC);
    div1.appendChild(document.createElement('br'));

    const inputShowTI = document.createElement('input');
    inputShowTI.id = 'show_ti';
    inputShowTI.type = 'checkbox';
    inputShowTI.checked = show_ti;
    inputShowTI.classList.add('embossed')
    const labelShowTI = document.createElement('label');
    labelShowTI.innerText = '赛季TI'
    div1.appendChild(inputShowTI);
    div1.appendChild(labelShowTI);
    div1.appendChild(document.createElement('br'));

    const inputShowXP = document.createElement('input');
    inputShowXP.id = 'show_xp';
    inputShowXP.type = 'checkbox';
    inputShowXP.checked = show_xp;
    inputShowXP.classList.add('embossed')
    const labelShowXP = document.createElement('label');
    labelShowXP.innerText = '经验'
    div1.appendChild(inputShowXP);
    div1.appendChild(labelShowXP);
    div1.appendChild(document.createElement('br'));

    const inputShowProfit = document.createElement('input');
    inputShowProfit.id = 'show_profit';
    inputShowProfit.type = 'checkbox';
    inputShowProfit.checked = show_profit;
    inputShowProfit.classList.add('embossed')
    const labelShowProfit = document.createElement('label');
    labelShowProfit.innerText = '利润'
    div1.appendChild(inputShowProfit);
    div1.appendChild(labelShowProfit);
    div1.appendChild(document.createElement('br'));

    const inputShowWA = document.createElement('input');
    inputShowWA.id = 'show_wa';
    inputShowWA.type = 'checkbox';
    inputShowWA.checked = show_wa;
    inputShowWA.classList.add('embossed')
    const labelShowWA = document.createElement('label');
    labelShowWA.innerText = '工资'
    div1.appendChild(inputShowWA);
    div1.appendChild(labelShowWA);
    div1.appendChild(document.createElement('br'));

    const labelChooseTI = document.createElement('label');
    labelChooseTI.innerText = '利润计算所用TI'
    labelChooseTI.style.marginBottom = '8px'
    const labelCTI = document.createElement('label');
    labelCTI.innerText = '训练TI'
    const labelCSTI = document.createElement('label');
    labelCSTI.innerText = '赛季TI'
    const inputCTI = document.createElement('input');
    inputCTI.id = 'choose_ti';
    inputCTI.type = 'radio';
    inputCTI.classList.add('embossed')
    inputCTI.value = '训练TI'
    inputCTI.checked = tiType;
    inputCTI.name = 'tiType'
    const inputCSTI = document.createElement('input');
    inputCSTI.id = 'choose_sti';
    inputCSTI.type = 'radio';
    inputCSTI.name = 'tiType';
    inputCSTI.checked = !tiType;
    inputCSTI.value = '赛季TI';
    inputCSTI.classList.add('embossed')
    inputCSTI.style.marginLeft = '8px'
    div1.appendChild(document.createElement('br'));
    div1.appendChild(labelChooseTI);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(labelCTI);
    div1.appendChild(inputCTI);
    div1.appendChild(labelCSTI);
    div1.appendChild(inputCSTI);

    const labelChooseR5 = document.createElement('label');
    labelChooseR5.innerText = '计算R5方法'
    labelChooseR5.style.marginBottom = '8px'
    const labelCFree = document.createElement('label');
    labelCFree.innerText = '含定位球'
    const labelCNoFree = document.createElement('label');
    labelCNoFree.innerText = '不含定位球'
    const inputCFree = document.createElement('input');
    inputCFree.id = 'choose_r5_free';
    inputCFree.type = 'radio';
    inputCFree.classList.add('embossed')
    inputCFree.value = 'R5含定位球'
    inputCFree.checked = r5Type;
    inputCFree.name = 'r5Type'
    const inputCNoFree = document.createElement('input');
    inputCNoFree.id = 'choose_r5_nofree';
    inputCNoFree.type = 'radio';
    inputCNoFree.name = 'r5Type';
    inputCNoFree.checked = !r5Type;
    inputCNoFree.value = 'R5不含定位球';
    inputCNoFree.classList.add('embossed')
    inputCNoFree.style.marginLeft = '8px'
    div1.appendChild(document.createElement('br'));
    div1.appendChild(labelChooseR5);
    div1.appendChild(document.createElement('br'));
    div1.appendChild(labelCFree);
    div1.appendChild(inputCFree);
    div1.appendChild(labelCNoFree);
    div1.appendChild(inputCNoFree);

    const div2 = document.createElement('div');
    div2.classList.add('align_center', 'padding');

    const buttonEl = document.createElement('button');
    buttonEl.style.padding = '0px 27px'
    buttonEl.style.marginTop = '4px'
    buttonEl.classList.add('button', 'button_icon');
    buttonEl.textContent = '筛选';
    buttonEl.addEventListener('click', () => {
        posToCheck = Number(inputPos.value);
        minR5 = inputR5.value;
        minREC = inputREC.value;
        minTI = inputTI.value;
        minSTI = inputSTI.value;
        minEXP = inputXP.value;
        minProfit = inputProfit.value;
        maxWA = inputWA.value;
        show_r5 = inputShowR5.checked;
        saveItem("show_r5",inputShowR5.checked);
        show_rec = inputShowREC.checked;
        saveItem("show_rec",inputShowREC.checked);
        show_ti = inputShowTI.checked;
        saveItem("show_ti",inputShowTI.checked);
        show_xp = inputShowXP.checked;
        saveItem("show_xp",inputShowXP.checked);
        show_profit = inputShowProfit.checked;
        saveItem("show_profit",inputShowProfit.checked);
        show_wa = inputShowWA.checked;
        saveItem("show_wa",inputShowWA.checked);
        tiType = inputCTI.checked;
        saveItem("tiType",inputCTI.checked);
        r5Type = inputCFree.checked;
        saveItem("r5Type",inputCFree.checked);
        updateTransferList();
    })
    div2.appendChild(buttonEl);

    el.appendChild(div1);
    el.appendChild(div2);
    filters1.appendChild(el);
}

addFilters();

const setStyle = () => {
    GM_addStyle(`
    td div.player_name {
        width: fit-content !important;
        width: -moz-fit-content;
    }
    div.main_center.top_user_info {
        width: 990px;
    }
    div.main_center {
        width:unset;
    }
    .column1_d {
        width: unset;
    }
    .box_body .std{
        display: flex;
        justify-content: center;
    }
    .routine {
        width: 200px;
    }`);
}

setStyle();

function updateTransferList() {
    getTrainingLevel();
    var header = $("tr.header");
    header.find("th.r5").remove();
    header.find("th.rec").remove();
    header.find("th.ti").remove();
    header.find("th.profit0").remove();
    header.find("th.profit1").remove();
    header.find("th.routine").remove();
    header.find("th.wage").remove();
    $("th.align_center").text("SI(TI)");
    if (show_profit) {
        $("th.align_center").after("<th class='profit0' title='Profit after 6 weeks or until end of age (normalized to 6 weeks)' style='cursor: pointer;'><nobr>6周利润</nobr></th>");
        $("th.profit0").after("<th class='profit1' title='Profit after one additional year of blooming (normalized to 6 weeks)' style='cursor: pointer;'><nobr>爆发利润</nobr></th>");
    }
    if (show_xp) {
        $("th.align_center").after("<th class='routine' title='EXP' style='cursor: pointer;'>经验</th>");
    }
    if (show_rec) {
        $("th.align_center").after("<th class='rec' title='REC' style='cursor: pointer;'><nobr>REC</nobr></th>");
    }
    if (show_r5) {
        $("th.align_center").after("<th class='r5' title='R5' style='cursor: pointer;'><nobr>R5</nobr></th>");
    }
    if (show_ti) {
        $("th.align_center").after("<th class='ti' title='赛季平均TI' style='cursor: pointer;'><nobr>赛季TI</nobr></th>");
    }
    if (show_wa) {
        $("tr.header").append("<th class='wage' title='Wage' style='cursor: pointer;'>工资</th>");
    }

    var playerIds = $("div.player_name > a").map(function() {
        return $(this).attr("player_link");
    }).get();

    playerIds.forEach(function(playerId) {
        $.post("https://trophymanager.com/ajax/tooltip.ajax.php", { player_id: playerId }, function(result) {
            updatePlayerRow(result);
        }, 'json');
    });
}

function updatePlayerRow(result) {
    var id = result.player.player_id;
    var asi_old = parseInt($("tr#player_row_" + id + " td.align_center.align_right").text().replace(/,/g, ""));
    var asi_new = parseInt(result.player.skill_index.replace(/,/g, ""));

    var role = $("tr#player_row_" + id + " span.favposition.short.nowrap").text();
    var isGK = (role === "GK");
    var skill_old = calculateSkill(asi_old, isGK);
    var skill_new = calculateSkill(asi_new, isGK);
    var TI = Math.round((skill_new - skill_old) * 10);
    var sTI = seasonTI(result);

    var mon = Number(result.player.months);
    var year = Number(result.player.age);
    var blooming = (mon < 5.1 && TI > 5.9);
    var xtraMon = blooming ? 5 - mon : 0;

    if (trainingLevel==0) trainingLevel=10;
    var trainEffect = 1 - (10 - trainingLevel) * 0.05;
    var newSkill,newSkill_bloom;
    if (tiType) {
        newSkill = calculateNewSkill(skill_new, TI, trainEffect, mon, blooming, year);
        newSkill_bloom = calculateNewSkill_bloom(skill_new, TI, trainEffect, mon, blooming, year);
    }
    else {
        newSkill = calculateNewSkill(skill_new, sTI, trainEffect, mon, blooming, year);
        newSkill_bloom = calculateNewSkill_bloom(skill_new, sTI, trainEffect, mon, blooming, year);
    }

    var newSI = calculateSI(newSkill, isGK);
    var newSI1 = calculateSI(newSkill_bloom, isGK);

    var wage = parseInt(result.player.wage.replace(/<\/?span[^>]*>/g, "").replace(/,/g, ""));
    var age = year + mon / 12;
    var bankPrice = calculateBankPrice(age + 0.5 + xtraMon / 12, newSI, isGK);
    var bankPrice1 = calculateBankPrice(age + 1.5 + xtraMon / 12, newSI1, isGK);
    var cost = parseInt($("td.bid_" + id).closest("td").text().replace(/,/g, ""));

    var revenue = Math.round(bankPrice * 0.94) - ((7 + xtraMon) * wage);
    var revenue1 = Math.round(bankPrice1 * 0.94) - ((19 + xtraMon) * wage);
    var P0 = (revenue - cost) * (6 / (6 + xtraMon)) / 1000000;
    var P1 = (revenue1 - cost) * (6 / (18 + xtraMon)) / 1000000;

    updateDOM(id, result, TI, sTI, P0, P1, blooming);
}

function updateDOM(id, result, TI, sTI, P0, P1, blooming) {
    calcR5(result);

    var playerRow = $("tr#player_row_" + id);
    var timeCell = playerRow.find("td[id=time_" + id + "]");
    var wageValue = (Number(result.player.wage.match(/<span[^>]*>(.*?)<\/span>/)[1].replace(/,/g, '')) / 1000000).toFixed(2) + "M";

    // 隐藏不需要的列
    playerRow.find("td.align_center.align_right").hide();
    playerRow.find("td.right.align_center.asi2, td.right.align_center.r5, td.right.align_center.rec, td.right.align_center.ti, td.right.align_right.profit, td.right.align_right.routine, td.right.align_right.wage").remove();
    // 更新年龄
    playerRow.find("td.left + td.align_center").closest("td").text(result.player.age + "." + result.player.months);

    // 构建新列的 HTML
    var newColumns = [
        "<td class='right align_center asi2' style='padding-left:5px;color:" + getColor(TI) + ";'><span>" + result.player.skill_index + " (<b class='ti'>" + TI + "</b>)</span></td>",
        "<td class='right align_center ti' style='padding-left:5px;color:" + getColor(sTI) + ";'><span>" + sTI + "</span></td>",
        "<td class='right align_center r5' style='padding-left:5px;'><span>" + setR5color(result.player.rating) + "</span></td>",
        "<td class='right align_center rec' style='padding-left:5px;'><span>" + setRECcolor(result.player.rec) + "</span></td>",
        "<td class='right align_right routine' style='padding-left:10px;color:" + EXPcolor(result.player.routine) + "'><span>" + result.player.routine + "</span></td>"
    ];

    if (blooming) {
        newColumns.push(
            "<td class='right align_right profit' style='padding-left:5px;color:" + profitColor(P0) + ";'><span>" + revenueBold1(P0) + P0.toFixed(2) + "M" + revenueBold2(P0) + "</span></td>",
            "<td class='right align_right profit' style='padding-left:5px;padding-right:5px;color:" + profitColor(P1) + ";'><span>" + revenueBold1(P1) + P1.toFixed(2) + "M" + revenueBold2(P1) + "</span></td>"
        );
    } else {
        newColumns.push(
            "<td class='right align_right profit' style='padding-left:5px;color:" + profitColor(P0) + ";'><span>" + revenueBold1(P0) + P0.toFixed(2) + "M" + revenueBold2(P0) + "</span></td>",
            "<td class='right align_right profit' style='padding-left:5px;padding-right:5px;'><span>--</span></td>"
        );
    }

    // 一次性插入所有新列
    timeCell.before(newColumns.join(""));
    playerRow.append("<td class='right align_right wage' style='padding-left:5px;'><span>" + wageValue + "</span></td>");

    // 根据条件显示或隐藏列
    playerRow.find("td.right.align_center.r5").toggle(show_r5);
    playerRow.find("td.right.align_center.rec").toggle(show_rec);
    playerRow.find("td.right.align_center.ti").toggle(show_ti);
    playerRow.find("td.right.align_right.routine").toggle(show_xp);
    playerRow.find("td.right.align_right.profit").toggle(show_profit);
    playerRow.find("td.right.align_right.wage").toggle(show_wa);

    // 根据条件隐藏或显示整个行
    var shouldHide = (
        result.player.rating.every(function(element) {
            return minR5 > Number(element) || element == 'NaN';
        }) ||
        TI < minTI ||
        Number(sTI) < minSTI ||
        Number(result.player.routine) < minEXP ||
        Number(result.player.wage.match(/<span[^>]*>(.*?)<\/span>/)[1].replace(/,/g, '')) / 1000000 > maxWA ||
        (P0 + P1) < minProfit && blooming ||
        P0 < minProfit && !blooming ||
        result.player.rec.every(function(element) {
            return minREC > Number(element);
        })
    );

    playerRow.toggle(!shouldHide);
}

function calculateSkill(asi, isGK) {
    if (isGK) {
        return Math.pow(asi * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1 / 7) / 14 * 11;
    }
    return Math.pow(asi * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1 / 7);
}

function calculateNewSkill(sk2, TI, trainEffect, mon, blooming, year) {
    if (TI < 5.1) {
        return sk2 + TI * 6 / 10;
    }
    if (blooming) {
        var newSkill = sk2 + Math.floor(trainEffect * TI) * (11 - mon) / 10;
        if (year < 19) {
            newSkill -= Math.ceil(0.3 * TI) * 12 / 10;
        }
        return newSkill;
    }
    return sk2 + (Math.floor(trainEffect * TI) * (11 - mon) + 5 * (mon - 5)) / 10;
}

function calculateNewSkill_bloom(sk2, TI, trainEffect, mon, blooming, year) {
    if (blooming) {
        var newSkill1 = sk2 + Math.floor(trainEffect * TI) * (23 - mon) * 0.9 / 10;
        if (year < 19) {
            newSkill1 -= Math.ceil(0.3 * TI) * 12 / 10;
        }
        return newSkill1;
    }
    return sk2;
}

function calculateSI(skill, isGK) {
    if (isGK) {
        return Math.pow(skill / 11 * 14, 7) / (Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
    }
    return Math.pow(skill, 7) / (Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
}

function calculateBankPrice(age, si, isGK) {
    var result = Math.floor(si * 500 * Math.pow(25 / age, 2.5));
    return isGK ? Math.floor(result * 0.75) : result;
}

function getColor(TI) {
    if (TI > 9) return 'gold';
    if (TI > 0) return 'khaki';
    if (TI === 0) return 'silver';
    return 'chocolate';
}

function profitColor(profit) {
    if (profit > 10) return 'gold';
    if (profit > 6) return 'khaki';
    if (profit > 4) return 'beige';
    if (profit > 2) return 'darkkhaki';
    if (profit > 0) return 'silver';
    return 'chocolate';
}

function revenueBold1(profit) {
    return profit > 6 ? '<b>' : '';
}

function revenueBold2(profit) {
    return profit > 6 ? '</b>' : '';
}

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
        ratingR += skills[index] * weightR5[positionIndex][index];
        if (skills[index] != 20) {
            remainderWeight += weightRb[positionIndex][index];
            remainderWeight2 += weightR5[positionIndex][index];
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

    var freeFlag = 1;
    if (r5Type == 0) {
        freeFlag = 0;
    }
    if (positionIndex === 9) {
        ratingR4 = funFix2(ratingR4 + allBonus * freeFlag);
    } else {
        ratingR4 = funFix2(ratingR4 + allBonus * freeFlag + posGain[positionIndex] + posKeep[positionIndex]);
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

function calcR5(result,flag) {
    let player = result.player;
    player.asi = Number(player.skill_index.split(',').join(''));
    player.xp = Number(player.routine.split(',').join(''));
    player.rating = [];
    player.rec = [];
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
        const selectedPosition = posToCheck > -1 ? posToCheck : position;
        const params = [player, selectedPosition, skills, player.asi, player.xp];
        player.rating.push(calculateREREC(...params));
        player.rec.push((Number(calculateRemainders(player, selectedPosition, skills, player.asi)[4])).toFixed(2));
    })
}

function setR5color(rating){
    let text = [];
    rating.forEach((value, index)=> {
       text.push("<span style='color:"+R5color(value)+";'>"+value+"</span>");
    })
    return text.join('/');
}

function setRECcolor(rec){
    let text = [];
    rec.forEach((value, index)=> {
       text.push("<span style='color:"+RECcolor(value)+";'>"+value+"</span>");
    })
    return text.join('/');
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

function RECcolor(value){
    if (value >= REC_CLASS.LEVEL_1) {
        return APP_COLOR.LEVEL_1;
    }
    else if (value >= REC_CLASS.LEVEL_2) {
        return APP_COLOR.LEVEL_2;
    }
    else if (value >= REC_CLASS.LEVEL_3) {
        return APP_COLOR.LEVEL_3;
    }
    else if (value >= REC_CLASS.LEVEL_4) {
        return APP_COLOR.LEVEL_4;
    }
    else if (value >= REC_CLASS.LEVEL_5) {
        return APP_COLOR.LEVEL_5;
    }
    else if (value >= REC_CLASS.LEVEL_6) {
        return APP_COLOR.LEVEL_6;
    }
    else if (value >= REC_CLASS.LEVEL_7) {
        return APP_COLOR.LEVEL_7;
    }
    else if (value >= REC_CLASS.LEVEL_8) {
        return APP_COLOR.LEVEL_8;
    }
    else {
        return APP_COLOR.LEVEL_9;
    }
}

function getTrainingLevel() {
    $.ajax('https://trophymanager.com/stadium/' + myClubId, {
			type: "GET",
			dataType: 'html',
			crossDomain: true,
			success: function (response) {
				let facility = $('map[name="facility_map"]', response)[0];
				let trainingGrounds = facility.children[10];
                trainingLevel = identifyFacilityLevel(trainingGrounds);
            }
    })
    $.ajaxSetup({
			async: true
    });
}

function identifyFacilityLevel(facility) {
    let tooltip = facility.getAttribute('tooltip');
    let fromIndex = tooltip.search('等级:');
    let toIndex = tooltip.search(']</p>');
    let strLength = '等级:'.length + 1;
    return Number(tooltip.substr(fromIndex + strLength, toIndex - fromIndex - strLength).replace(/,/g, ''));
}

const seasonTI = (result) => {
    var player = result.player;
    var positions = player.favposition.split(',');
    var SI = parseInt(player.skill_index.replace(/,/g, ""));
    var wage = Number(player.wage.split("<span class='coin'>")[1].split('</span>')[0].replace(/,/g, ""))
    var today = new Date();
    var SS = new Date("07 10 2017 08:00:00 GMT");				// s50 start
    var training1 = new Date("07 10 2017 23:00:00 GMT");				// first training
    var day = (today.getTime() - training1.getTime()) / 1000 / 3600 / 24;
    while (day > 84 - 16 / 24) day -= 84;
    var session = Math.floor(day / 7) + 1;							// training sessions
    if (session===0) return 0;//赛季第一天默认为0
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
    if (positions.includes('gk')) weight = 48717927500;

    if (!(wage == 30000 || count == 0)) {
        var TI1 = Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - Math.pow(2, Math.log(weight * wage / 15.808) / Math.log(Math.pow(2, 7)));
        TI1 = Math.round(TI1 * 10);

        return funFix2(TI1 / session)
    }
    Result = TI1 / session;
    if (age < ageMax) {
        var TI2 = Math.pow(2, Math.log(weight * SI) / Math.log(Math.pow(2, 7))) - Math.pow(2, Math.log(weight * wage / 23.75) / Math.log(Math.pow(2, 7)));
        return funFix2(TI2 / session)
    }
    return null
}