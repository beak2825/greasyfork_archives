// ==UserScript==
// @name            TM Super Club Tooltip
// @version         0.3
// @description     Adds RERECb and RatingR5 to the tooltip box in the "club" page
// @author          Andrizz aka Banana aka Jimmy il Fenomeno (based on "TrophyManager - Super Club Squad" by Joao Manuel Ferreira Fernandes, and "RatingR5" by CHU-CHI)
// @namespace       https://trophymanager.com
// @include         *trophymanager.com*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481914/TM%20Super%20Club%20Tooltip.user.js
// @updateURL https://update.greasyfork.org/scripts/481914/TM%20Super%20Club%20Tooltip.meta.js
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

function collect() {
    var ret = {};
    var len = arguments.length;
    for (var i=0; i<len; i++) {
        for (var p in arguments[i]) {
            if (arguments[i].hasOwnProperty(p)) {
                ret[p] = arguments[i][p];
            }
        }
    }
    return ret;
}

//Real Code

var new_player_array = [];
var team_b_id = "";

$.ajaxSetup({async: false});

$.post("/ajax/players_get_select.ajax.php",{"type":"change","club_id":SUBPAGE},function(data){

    data = JSON.parse(data);
    new_player_array = data.post;

});

$('a[player_link]').mouseenter(function() {

    var player_link = $(this).attr("player_link");
	var minigame = $(this).attr('minigame');
    if(new_player_array[player_link] == null && team_b_id === ""){

        console.log("finding team b id");

        $.post("https://trophymanager.com/ajax/tooltip.ajax.php",{"player_id":player_link, "minigame":minigame},function(data){
            data = JSON.parse(data);
            team_b_id = data.club.id;
        });

        $.post("/ajax/players_get_select.ajax.php",{"type":"change","club_id":team_b_id},function(data){
            data = JSON.parse(data);
            new_player_array = collect(new_player_array, data.post);
        });
    }

    var current_player_info = new_player_array[player_link];

    var STR=current_player_info.strength;
    var STA=current_player_info.stamina;
    var PAC=current_player_info.pace;
    var MAR=current_player_info.marking;
    var TAC=current_player_info.tackling;
    var WOR=current_player_info.workrate;
    var POS=current_player_info.positioning;
    var PAS=current_player_info.passing;
    var CRO=current_player_info.crossing;
    var TEC=current_player_info.technique;
    var HEA=current_player_info.heading;
    var FIN=current_player_info.finishing;
    var LON=current_player_info.longshots;
    var SET=current_player_info.setpieces;
    var HAN=current_player_info.handling;
    var ONE=current_player_info.oneonones;
    var REF=current_player_info.reflexes;
    var AER=current_player_info.arialability;
    var JUM=current_player_info.jumping;
    var COM=current_player_info.communication;
    var KIC=current_player_info.kicking;
    var THR=current_player_info.throwing;
    var FP=current_player_info.favposition;
    var AGE=current_player_info.age;
    var MONTH=current_player_info.month;
    var ROU=current_player_info.rutine;
    var ASI=current_player_info.asi;

    var roles = FP.split(/,/gm);
    var fp = roles[0];
    if (FP.indexOf(",") != (-1)) {
        var fp2 = roles[1];
    } else {
        fp2 = -1;
    }
    var posNames = ["dc","dl","dr","dmc","dml","dmr","mc","ml","mr","omc","oml","omr","fc","gk"];
    var pos = [0,1,1,2,3,3,4,5,5,6,7,7,8,9];
    for (var i = 0; i<posNames.length; i++) {
        if (posNames[i] == roles[0]) fp = pos[i];
        if (fp2 != -1) {
            if (posNames[i] == roles[1]) fp2 = pos[i];
        }
    }
    if (FP=="gk") {
        var weight = 48717927500;
        var skills = [STR,STA,PAC,HAN,ONE,REF,AER,JUM,COM,KIC,THR];
    } else {
        weight = 263533760000;
        skills = [STR,STA,PAC,MAR,TAC,WOR,POS,PAS,CRO,TEC,HEA,FIN,LON,SET];
    }

    var rou2 = (3/100) * (100-(100) * Math.pow(Math.E, -ROU*0.035));
    var rou = Math.pow(5/3, Math.LOG2E * Math.log(ROU * 10));

	var strRou = skills[0]*1+rou2;
	var staRou = skills[1]*1;
	var pacRou = skills[2]*1+rou2;
	var marRou = skills[3]*1+rou2;
	var tacRou = skills[4]*1+rou2;
	var worRou = skills[5]*1+rou2;
	var posRou = skills[6]*1+rou2;
	var pasRou = skills[7]*1+rou2;
	var croRou = skills[8]*1+rou2;
	var tecRou = skills[9]*1+rou2;
	var heaRou = skills[10]*1+rou2;
	var finRou = skills[11]*1+rou2;
	var lonRou = skills[12]*1+rou2;
	var setRou = skills[13]*1+rou2;

	if (heaRou > 12) var headerBonus = funFix2((Math.pow(Math.E, (heaRou-10)**3/1584.77)-1)*0.8 + Math.pow(Math.E, (strRou*strRou*0.007)/8.73021)*0.15 + Math.pow(Math.E, (posRou*posRou*0.007)/8.73021)*0.05);
	else headerBonus = 0;

	var fkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou+lonRou+tecRou*0.5, 2)*0.002)/327.92526);
	var ckBonus = funFix2(Math.pow(Math.E, Math.pow(setRou+croRou+tecRou*0.5, 2)*0.002)/983.65770);
	var pkBonus = funFix2(Math.pow(Math.E, Math.pow(setRou+finRou+tecRou*0.5, 2)*0.002)/1967.31409);
	var gainBase = funFix2((strRou**2+staRou**2*0.5+pacRou**2*0.5+marRou**2+tacRou**2+worRou**2+posRou**2)/6/22.9**2);
	var keepBase = funFix2((strRou**2*0.5+staRou**2*0.5+pacRou**2+marRou**2+tacRou**2+worRou**2+posRou**2)/6/22.9**2);
					//	0:DC			1:DL/R			2:DMC			3:DML/R			4:MC			5:ML/R			6:OMC			7:OML/R			8:F
	var posGain = [	gainBase*0.3, 	gainBase*0.3, 	gainBase*0.9, 	gainBase*0.6, 	gainBase*1.5, 	gainBase*0.9, 	gainBase*0.9, 	gainBase*0.6, 	gainBase*0.3];
	var posKeep = [	keepBase*0.3,	keepBase*0.3, 	keepBase*0.9, 	keepBase*0.6, 	keepBase*1.5, 	keepBase*0.9, 	keepBase*0.9, 	keepBase*0.6, 	keepBase*0.3];

	if (skills.length == 11) var allBonus = 0;
	else allBonus = headerBonus*1 + fkBonus*1 + ckBonus*1 + pkBonus*1;

    var rec = 0;			// RERECb
	var ratingR = 0;		// RatingR5
	var ratingR5 = 0;		// RatingR5 + routine

    var skillSum = 0;
    for (i = 0; i < skills.length; i++) {
        skillSum += parseInt(skills[i]);
	}
    var remainder = Math.round((Math.pow(2,Math.log(weight*ASI)/Math.log(Math.pow(2,7))) - skillSum)*10)/10;		// RatingR5 remainder
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
    }

    if (skills.length == 11) {
		var R5FP = funFix2(ratingR5*1 + allBonus*1);
	} else {
		R5FP = funFix2(ratingR5*1 + allBonus*1 + posGain[fp]*1 + posKeep[fp]*1);
	}

    if (fp2 != -1 && fp2 != fp) {
        if (skills.length == 11) {
            var R5FP2 = funFix2(ratingR52*1 + allBonus*1);
	    } else {
		    R5FP2 = funFix2(ratingR52*1 + allBonus*1 + posGain[fp2]*1 + posKeep[fp2]*1);
	    }
        R5FP = R5FP+"/"+R5FP2;
    }


    var RECname = "<div style='color:gold;'>RERECb</div>";
    var RR5name = "<div style='color:orange;'>RatingR5</div>";
    var REC = "<div style='color:gold;'>"+rec+"</div>";
    var RR5 = "<div style='color:orange;'>"+R5FP+"</div>";
    setTimeout(function(){
    var s = $('#tooltip').find('tr:eq(7)').text();
    if (s === "" || s === null) {
        $('#tooltip').find('tr:eq(7)').find('td:eq(0)').append(RECname);
        $('#tooltip').find('tr:eq(7)').find('td:eq(0)').append(RR5name);
        $('#tooltip').find('tr:eq(7)').find('td:eq(1)').append(REC);
        $('#tooltip').find('tr:eq(7)').find('td:eq(1)').append(RR5);
    }
    }, 1500);
});

$.ajaxSetup({async: true});