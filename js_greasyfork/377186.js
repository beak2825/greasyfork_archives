// ==UserScript==
// @name            TM Super Detailed National Club Page
// @version         0.3.7
// @description     Adds months, routine, ASI, RERECb and RatingR5 to the National club page 国家队球队概览中显示详细信息
// @author          Andrizz aka Banana aka Jimmy il Fenomeno (based on "TrophyManager - Super Club Squad" by Joao Manuel Ferreira Fernandes, and "RatingR5" by CHU-CHI), thanks also to Paolo (Pra'deCalsina') for part of the code,太原龙城足球俱乐部汉化并且修复了一个显示错误。
// @namespace       https://trophymanager.com
// @include         https://trophymanager.com/national-teams/*/squad/
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/377186/TM%20Super%20Detailed%20National%20Club%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/377186/TM%20Super%20Detailed%20National%20Club%20Page.meta.js
// ==/UserScript==

// R5 weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
var weightR5 = [[	0.41029304	,	0.18048062	,	0.56730138	,	1.06344654	,	1.02312672	,	0.40831256	,	0.58235457	,	0.12717479	,	0.05454137	,	0.09089830	,	0.42381693	,	0.04626272	,	0.02199046	,	0.00000000	],	// DC
                [	0.42126371	,	0.18293193	,	0.60567629	,	0.91904794	,	0.89070915	,	0.40038476	,	0.56146633	,	0.15053902	,	0.15955429	,	0.15682932	,	0.42109742	,	0.09460329	,	0.03589655	,	0.00000000	],	// DL/R
                [	0.23412419	,	0.32032289	,	0.62194779	,	0.63162534	,	0.63143081	,	0.45218831	,	0.47370658	,	0.55054737	,	0.17744915	,	0.39932519	,	0.26915814	,	0.16413124	,	0.07404301	,	0.00000000	],	// DMC
                [	0.27276905	,	0.26814289	,	0.61104798	,	0.39865092	,	0.42862643	,	0.43582015	,	0.46617076	,	0.44931076	,	0.25175412	,	0.46446692	,	0.29986350	,	0.43843061	,	0.21494592	,	0.00000000	],	// DML/R
                [	0.25219260	,	0.25112993	,	0.56090649	,	0.18230261	,	0.18376490	,	0.45928749	,	0.53498118	,	0.59461481	,	0.09851189	,	0.61601950	,	0.31243959	,	0.65402884	,	0.29982016	,	0.00000000	],	// MC
                [	0.28155678	,	0.24090675	,	0.60680245	,	0.19068879	,	0.20018012	,	0.45148647	,	0.48230007	,	0.42982389	,	0.26268609	,	0.57933805	,	0.31712419	,	0.65824985	,	0.29885649	,	0.00000000	],	// ML/R
                [	0.22029884	,	0.29229690	,	0.63248227	,	0.09904394	,	0.10043602	,	0.47469498	,	0.52919791	,	0.77555880	,	0.10531819	,	0.71048302	,	0.27667115	,	0.56813972	,	0.21537826	,	0.00000000	],	// OMC
                [	0.21151292	,	0.35804710	,	0.88688492	,	0.14391236	,	0.13769621	,	0.46586605	,	0.34446036	,	0.51377701	,	0.59723919	,	0.75126119	,	0.16550722	,	0.29966502	,	0.12417045	,	0.00000000	],	// OML/R
                [	0.35479780	,	0.14887553	,	0.43273380	,	0.00023928	,	0.00021111	,	0.46931131	,	0.57731335	,	0.41686333	,	0.05607604	,	0.62121195	,	0.45370457	,	1.03660702	,	0.43205492	,	0.00000000	],	// F
                [	0.45462811	,	0.30278232	,	0.45462811	,	0.90925623	,	0.45462811	,	0.90925623	,	0.45462811	,	0.45462811	,	0.30278232	,	0.15139116	,	0.15139116	]];	// GK

// RECb weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
var weightRb = [[	0.10493615	,	0.05208547	,	0.07934211	,	0.14448971	,	0.13159554	,	0.06553072	,	0.07778375	,	0.06669303	,	0.05158306	,	0.02753168	,	0.12055170	,	0.01350989	,	0.02549169	,	0.03887550	],	// DC
                [	0.07715535	,	0.04943315	,	0.11627229	,	0.11638685	,	0.12893778	,	0.07747251	,	0.06370799	,	0.03830611	,	0.10361093	,	0.06253997	,	0.09128094	,	0.01314110	,	0.02449199	,	0.03726305	],	// DL/R
                [	0.08219824	,	0.08668831	,	0.07434242	,	0.09661001	,	0.08894242	,	0.08998026	,	0.09281287	,	0.08868309	,	0.04753574	,	0.06042619	,	0.05396986	,	0.05059984	,	0.05660203	,	0.03060871	],	// DMC
                [	0.06744248	,	0.06641401	,	0.09977251	,	0.08253749	,	0.09709316	,	0.09241026	,	0.08513703	,	0.06127851	,	0.10275520	,	0.07985941	,	0.04618960	,	0.03927270	,	0.05285911	,	0.02697852	],	// DML/R
                [	0.07304213	,	0.08174111	,	0.07248656	,	0.08482334	,	0.07078726	,	0.09568392	,	0.09464529	,	0.09580381	,	0.04746231	,	0.07093008	,	0.04595281	,	0.05955544	,	0.07161249	,	0.03547345	],	// MC
                [	0.06527363	,	0.06410270	,	0.09701305	,	0.07406706	,	0.08563595	,	0.09648566	,	0.08651209	,	0.06357183	,	0.10819222	,	0.07386495	,	0.03245554	,	0.05430668	,	0.06572005	,	0.03279859	],	// ML/R
                [	0.07842736	,	0.07744888	,	0.07201150	,	0.06734457	,	0.05002348	,	0.08350204	,	0.08207655	,	0.11181914	,	0.03756112	,	0.07486004	,	0.06533972	,	0.07457344	,	0.09781475	,	0.02719742	],	// OMC
                [	0.06545375	,	0.06145378	,	0.10503536	,	0.06421508	,	0.07627526	,	0.09232981	,	0.07763931	,	0.07001035	,	0.11307331	,	0.07298351	,	0.04248486	,	0.06462713	,	0.07038293	,	0.02403557	],	// OML/R
                [	0.07738289	,	0.05022488	,	0.07790481	,	0.01356516	,	0.01038191	,	0.06495444	,	0.07721954	,	0.07701905	,	0.02680715	,	0.07759692	,	0.12701687	,	0.15378395	,	0.12808992	,	0.03805251	],	// F
                [	0.07466384	,	0.07466384	,	0.07466384	,	0.14932769	,	0.10452938	,	0.14932769	,	0.10452938	,	0.10344411	,	0.07512610	,	0.04492581	,	0.04479831	]];	// GK

function funFix1 (i) {
	i = (Math.round(i*10)/10).toFixed(1);
	return i;
}

function funFix2 (i) {
	i = (Math.round(i*100)/100).toFixed(2);
	return i;
}

function funFix3 (i) {
	i = (Math.round(i*1000)/1000).toFixed(3);
	return i;
}

function addCommas(nStr) {
		nStr += '';
		var x = nStr.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
				x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
}

//Real Code
var wagetotale = 0;
var etatotale = 0;
var routotale = 0;
var asitotale = 0;
var rectotale = 0;
var rr5totale = 0;
var valoretotale = 0;
$(".column2_a").width("750px");
var sheet = window.document.styleSheets[0];
sheet.insertRule('#player_table tr:hover{background:#333333;}', sheet.cssRules.length);
$('#player_table tr:first').html('<th class="align_center player_no" style="width:30px"><b>#</b></th><th style="padding:0 0 0 5px"><b>姓名</b></th><th class="align_center"><b>年龄</b></th><th class="align_center"><b>位置</b></th><th></th><th class="align_center" title="经验(属性加成)"><b>经验</b></th><th class="align_center"><b>SI</b></th><th class="align_center"><b>评星</b></th><th class="align_center"><b>RatingR5</b></th><th></th>');
$('#player_table tr:last').after('<tr style="background:#333333;line-height:25px;"><td class=align_center"><b>平均</b></td><td id="avgWages" class="align_center"></td><td id="avgAge" title="平均工资" class="align_center"></td><td colspan="2"></td><td id="avgRou" title="平均经验" class="align_center"></td><td id="avgASI" title="平均SI" class="align_center" style="color:moccasin;"></td><td id="avgREC" title="平均评星" class="align_center" style="color:gold;"></td><td id="avgRR5" title="平均RR5" class="align_center" style="color:orange;"></td></tr>');
var tableRow = $('#player_table tr:not(:first-of-type)');
$(tableRow).each(function(index) {
    var playerID = $(this).find('a').attr('player_link');
    $(this).find("td:eq(1)").css('padding','0 0 0 5px');
    var name = $(this).find("td:eq(1)").find("a"); // get each player's name
    if ($(name).text().indexOf("'") != -1) {
        $(name).text($(name).text().replace(/[?<='].*?[?=']\s/,''));
    }
    if (name.text().indexOf(" ") != -1) {
        $(name).text($(name).text().replace($(name).text().match(/[^ ]+/), $(name).text().match(/^./)+".")); // abbreviate the name
    }
    $.post("/ajax/tooltip.ajax.php",{async:false,"player_id":playerID},function(data){ // get each player's info
        data = JSON.parse(data);
        var Number = data.player.no;
        var Age = data.player.age;
        var Months = data.player.months;
        var ROU = data.player.routine;
        var ASI = data.player.skill_index;
        var Wage = String(data.player.wage).replace(/<span class='coin'>/,'').replace(/<\/span>/,'').replace(/,/g,'');
        Wage = parseInt(Wage);
        var FP = data.player.favposition;
        var ROLE = data.player.fp;

        var STR = String(data.player.skills[0].value);
        var STA = String(data.player.skills[2].value);
        var PAC = String(data.player.skills[4].value);
        if (ROLE == "GK") {
            var HAN = String(data.player.skills[1].value);
            var ONE = String(data.player.skills[3].value);
            var REF = String(data.player.skills[5].value);
            var AER = String(data.player.skills[7].value);
            var JUM = String(data.player.skills[9].value);
            var COM = String(data.player.skills[11].value);
            var KIC = String(data.player.skills[13].value);
            var THR = String(data.player.skills[15].value);
            var skills = [STR,STA,PAC,HAN,ONE,REF,AER,JUM,COM,KIC,THR];
        } else {
            var MAR = String(data.player.skills[6].value);
            var TAC = String(data.player.skills[8].value);
            var WOR = String(data.player.skills[10].value);
            var POS = String(data.player.skills[12].value);
            var PAS = String(data.player.skills[1].value);
            var CRO = String(data.player.skills[3].value);
            var TEC = String(data.player.skills[5].value);
            var HEA = String(data.player.skills[7].value);
            var FIN = String(data.player.skills[9].value);
            var LON = String(data.player.skills[11].value);
            var SET = String(data.player.skills[13].value);
            skills = [STR,STA,PAC,MAR,TAC,WOR,POS,PAS,CRO,TEC,HEA,FIN,LON,SET];
        }
        for (var i = 0; i<skills.length; i++) {
            if (skills[i].indexOf("<img") != -1) {
                skills[i] = skills[i].match(/\d+/);
            }
        }
        if (ROLE.indexOf("/") != -1) { // "M/DM C"
            ROLE = ROLE.split(/\//);
            var ROLE1 = ROLE[0]; // "M"
            var ROLE2 = ROLE[1]; // "DM C"
            var SIDE = ROLE[1].match(/\D$/); // "C"
            ROLE2 = ROLE2.replace(/\s/g,""); // "DMC"
            ROLE1 = ROLE[0]+SIDE; // "MC"
        } else if (ROLE.indexOf(",") != -1) { // "F, OM C" || "M C, F"
            ROLE = ROLE.split(/,/);
            ROLE1 = ROLE[0].replace(/\s/g,""); // "F" || "MC"
            ROLE2 = ROLE[1].replace(/\s/g,""); // " OMC" || "F"
        } else if (ROLE.indexOf(" ") != -1) { // "DM LC" || "D R"
            if (ROLE.substring(ROLE.indexOf(" ")+1).length > 1) { // "DM LC"
                ROLE = ROLE.split(/\s/); // "DM" || "LC"
                ROLE1 = ROLE[0]; // "DM"
                SIDE = ROLE[1]; // "LC"
                ROLE2 = ROLE1+SIDE.substring(1); // "DMC"
                ROLE1 = ROLE1+SIDE.substring(0,1); // "DML"
            } else { // D R
                ROLE1 = ROLE.replace(" ","");
                ROLE2 = -1;
            }
        } else if (ROLE == "GK") {
            ROLE1 = "GK";
            ROLE2 = -1;
        } else if (ROLE == "F") {
            ROLE1 = "F";
            ROLE2 = -1;
        }
        var posNames = ["DC","DL","DR","DMC","DML","DMR","MC","ML","MR","OMC","OML","OMR","F","GK"];
        var pos = [0,1,1,2,3,3,4,5,5,6,7,7,8,9];
        for (i = 0; i<posNames.length; i++) {
            if (posNames[i] == ROLE1) var fp = pos[i];
            if (ROLE2 != -1) {
                if (posNames[i] == ROLE2) var fp2 = pos[i];
            } else fp2 = -1;
        }
        var skillSum = 0;
        for (i = 0; i < skills.length; i++) {
            skillSum += parseInt(skills[i]);
        }

        if (ROLE == "GK") {
            var weight = 48717927500;
        } else {
            weight = 263533760000;
        }
        var asi = ASI.replace(",","");
        var remainder = Math.round((Math.pow(2,Math.log(weight*asi)/Math.log(Math.pow(2,7))) - skillSum)*10)/10;		// RatingR5 remainder
        var rou2 = (3/100) * (100-(100) * Math.pow(Math.E, -ROU*0.035));

        var goldstar = 0;
        var skillsB = [];
        for (var j = 0; j < 2; j++) {
            for (i = 0; i < 14; i++) {
                if (j == 0 && skills[i] == 20) goldstar++;
                if (j == 1) {
                    if (skills[i] != 20) skillsB[i] = skills[i] * 1 + remainder / (14 - goldstar);
                    else skillsB[i] = skills[i];
                }
            }
        }
        var strRou = skillsB[0]*1+rou2;
        var staRou = skillsB[1]*1+rou2;
        var pacRou = skillsB[2]*1+rou2;
        var marRou = skillsB[3]*1+rou2;
        var tacRou = skillsB[4]*1+rou2;
        var worRou = skillsB[5]*1+rou2;
        var posRou = skillsB[6]*1+rou2;
        var pasRou = skillsB[7]*1+rou2;
        var croRou = skillsB[8]*1+rou2;
        var tecRou = skillsB[9]*1+rou2;
        var heaRou = skillsB[10]*1+rou2;
        var finRou = skillsB[11]*1+rou2;
        var lonRou = skillsB[12]*1+rou2;
        var setRou = skillsB[13]*1+rou2;

        if (heaRou > 12) var headerBonus = funFix2((Math.pow(Math.E, (heaRou-10)**3/1584.77)-1)*0.8 + Math.pow(Math.E, (strRou*strRou*0.007)/8.73021)*0.15 + Math.pow(Math.E, (posRou*posRou*0.007)/8.73021)*0.05);
        else headerBonus = 0;

        var fkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou+lonRou+tecRou*0.5, 2)*0.002)/327.92526);
        var ckBonus = funFix2(Math.pow(Math.E, Math.pow(setRou+croRou+tecRou*0.5, 2)*0.002)/983.65770);
        var pkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou+finRou+tecRou*0.5, 2)*0.002)/1967.31409);
        var gainBase = funFix2((strRou**2+staRou**2*0.5+pacRou**2*0.5+marRou**2+tacRou**2+worRou**2+posRou**2)/6/22.9**2);
        var keepBase = funFix2((strRou**2*0.5+staRou**2*0.5+pacRou**2+marRou**2+tacRou**2+worRou**2+posRou**2)/6/22.9**2);
                      //   0:DC			  1:DL/R		   2:DMC		   3:DML/R		   4:MC			  5:ML/R		  6:OMC			 7:OML/R			8:F
        var posGain = [	gainBase*0.3, 	gainBase*0.3, 	gainBase*0.9, 	gainBase*0.6, 	gainBase*1.5, 	gainBase*0.9, 	gainBase*0.9, 	gainBase*0.6, 	gainBase*0.3];
        var posKeep = [	keepBase*0.3,	keepBase*0.3, 	keepBase*0.9, 	keepBase*0.6, 	keepBase*1.5, 	keepBase*0.9, 	keepBase*0.9, 	keepBase*0.6, 	keepBase*0.3];

        if (skills.length == 11) var allBonus = 0;
        else allBonus = headerBonus*1 + fkBonus*1 + ckBonus*1 + pkBonus*1;

        var rec = 0;			// RERECb
        var ratingR = 0;		// RatingR5
        var ratingR5 = 0;		// RatingR5 + routine

        var remainderWeight = 0;		// REREC remainder weight sum
        var remainderWeight2 = 0;		// RatingR5 remainder weight sum
        var not20 = 0;					// 20以外のスキル数
        for (i = 0; i < weightRb[fp].length; i++) { // weightR[fp].length = n.pesi[pos] cioè le skill: 14 o 11
            rec += skills[i] * weightRb[fp][i];
            ratingR += skills[i] * weightR5[fp][i];
            if (skills[i] != 20) {
                remainderWeight += weightRb[fp][i];
                remainderWeight2 += weightR5[fp][i];
                not20++;
            }
        }
        if (remainder/not20 > 0.9 || not20 == 0) {
            if (fp == 9) not20 = 11;
            else not20 = 14;
            remainderWeight = 1;
            remainderWeight2 = 5;
        }
        rec = funFix3((rec + remainder * remainderWeight / not20 - 2) / 3);
        ratingR += remainder * remainderWeight2 / not20;

        ratingR5 = funFix2(ratingR*1 + rou2 * 5);
        ratingR = funFix2(ratingR);
        var bestREC = rec;

        if (fp2 != -1 && fp2 != fp) {
            var rec2 = 0;
            var ratingR2 = 0;
            var ratingR52 = 0;
            remainderWeight = 0;		// REREC remainder weight sum
            remainderWeight2 = 0;		// RatingR5 remainder weight sum
            not20 = 0;					// 20以外のスキル数

            for (i = 0; i < weightRb[fp2].length; i++) { // weightR[fp].length = n.pesi[pos] cioè le skill: 14 o 11
                rec2 += skills[i] * weightRb[fp2][i];
                ratingR2 += skills[i] * weightR5[fp2][i];
                if (skills[i] != 20) {
                    remainderWeight += weightRb[fp2][i];
                    remainderWeight2 += weightR5[fp2][i];
                    not20++;
                }
            }
            if (remainder/not20 > 0.9 || not20 == 0) {
                if (fp2 == 9) not20 = 11;
                else not20 = 14;
                remainderWeight = 1;
                remainderWeight2 = 5;
            }
            rec2 = funFix3((rec2 + remainder * remainderWeight / not20 - 2) / 3);
            ratingR2 += remainder * remainderWeight2 / not20;
            ratingR52 = funFix2(ratingR2 + rou2 * 5);
            ratingR2 = funFix2(ratingR2);
            rec = rec+"/"+rec2;
            ratingR = ratingR+"/"+ratingR2;
            if (rec2 > rec) bestREC = rec2;
        }
        if (skills.length == 11) {
            var R5FP = funFix2(ratingR5*1 + allBonus*1);
        } else {
            R5FP = funFix2(ratingR5*1 + allBonus*1 + posGain[fp]*1 + posKeep[fp]*1);
        }
        var bestRR5 = R5FP;
        if (fp2 != -1 && fp2 != fp) {
            if (skills.length == 11) {
                var R5FP2 = funFix2(ratingR52*1 + allBonus*1);
            } else {
                R5FP2 = funFix2(ratingR52*1 + allBonus*1 + posGain[fp2]*1 + posKeep[fp2]*1);
            }
            R5FP = R5FP+"/"+R5FP2;
            if (R5FP2 > R5FP) bestRR5 = R5FP2;
        }

        $('#player_table tr:nth-of-type('+ (index+2) + ')').find('td:eq(0)').addClass('align_center minishirt small');
        $('#player_table tr:nth-of-type('+ (index+2) + ')').find('td:eq(0)').css('padding','0');
        $('#player_table tr:nth-of-type('+ (index+2) + ')').find('td:eq(0)').html(Number);
        $('#player_table tr:nth-of-type('+ (index+2) + ')').find('td:eq(2)').html(Age+"."+Months);
        $('#player_table tr:nth-of-type('+ (index+2) + ')').find('td:eq(5)').html('<div title="+'+rou2.toFixed(2)+'">'+ROU+'<div>');
        $('#player_table tr:nth-of-type('+ (index+2) + ')').find('td:eq(5)').after('<td style="text-align:center;color:moccasin;padding: 0 5px 0 5px;">'+ASI+'</td>');
        $('#player_table tr:nth-of-type('+ (index+2) + ')').find('td:eq(6)').after('<td style="text-align:center;color:gold;padding: 0 5px 0 5px;">'+rec+'</td>');
        $('#player_table tr:nth-of-type('+ (index+2) + ')').find('td:eq(7)').after('<td style="text-align:center;color:orange;padding: 0 5px 0 5px;">'+R5FP+'</td>');

        var totPlayers = $('#player_table tr').length-2;
        wagetotale += Wage*1;
        var asidaaggiungere = asi;
        var asi2 = asidaaggiungere;
        var mesi = Months/12;
        var eta = Age*1+mesi;
        if (fp != 9) {
            asi2 = Math.round(asi2 * 1);
        } else {
            asi2 = Math.round(asi2 * 0.75);
        }
        valoretotale = valoretotale+500*asi2*Math.pow(25/eta,2.5);
        etatotale += eta;
        routotale += ROU*1;
        asitotale += asi*1;
        rectotale += bestREC*1;
        rr5totale += bestRR5*1;

        $('#avgWages').html('<span class="coin" title="平均身价">'+addCommas((valoretotale/totPlayers).toFixed(0))+'</span></br> <span class="coin" title="平均工资">'+addCommas((wagetotale/totPlayers).toFixed(0))+'</span>');
        $('#avgAge').html((etatotale/totPlayers).toFixed(1));
        $('#avgRou').html((routotale/totPlayers).toFixed(1));
        $('#avgASI').html(addCommas((asitotale/totPlayers).toFixed(0)));
        $('#avgREC').html((rectotale/totPlayers).toFixed(3));
        $('#avgRR5').html((rr5totale/totPlayers).toFixed(2));

    });
});