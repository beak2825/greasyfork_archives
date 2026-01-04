// ==UserScript==
// @name		    TM COMPARE PLAYERS R6
// @version         0.2
// @description	    Adds the routine-bonus on skills in the "compare players" page. You can also select the routine from which to calculate the bonus (e.g. when the player gains routine through the sharing system) and change the player's position. It also shows RatingR5 infos (by CHU-CHI).
// @author          Metalist Dominia by Domenico Federico
// @include		    http://trophymanager.com/players/compare/*
// @exclude		    http://trophymanager.com/players
// @exclude		    http://trophymanager.com/players/compare
// @exclude		    http://trophymanager.com/players/compare/
// @include		    https://trophymanager.com/players/compare/*
// @exclude		    https://trophymanager.com/players
// @exclude		    https://trophymanager.com/players/compare
// @exclude		    https://trophymanager.com/players/compare/
// @license         MIT
// @namespace https://greasyfork.org/users/1353541
// @downloadURL https://update.greasyfork.org/scripts/515818/TM%20COMPARE%20PLAYERS%20R6.user.js
// @updateURL https://update.greasyfork.org/scripts/515818/TM%20COMPARE%20PLAYERS%20R6.meta.js
// ==/UserScript==

// R6 weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
var weightR5 = [
    [0.5375, 0.00, 0.5925, 0.9500, 0.9206, 0.5274, 0.5825, 0.1313, 0.0656, 0.0937, 0.5282, 0.0491, 0.0216, 0.00], // DC
    [0.5140, 0.00, 0.6825, 0.8280, 0.8063, 0.5026, 0.5825, 0.1313, 0.2337, 0.1752, 0.4762, 0.0491, 0.0216, 0.00], // DL/R
    [0.4520, 0.00, 0.5683, 0.6864, 0.6727, 0.5780, 0.5720, 0.5105, 0.1095, 0.3504, 0.2850, 0.1050, 0.1102, 0.00], // DMC
    [0.4523, 0.00, 0.6666, 0.5765, 0.5499, 0.5327, 0.5120, 0.3255, 0.2949, 0.3226, 0.4547, 0.2230, 0.0893, 0.00], // DML/R
    [0.3291, 0.00, 0.4548, 0.3515, 0.3236, 0.5648, 0.5907, 0.6467, 0.0952, 0.6042, 0.2850, 0.5001, 0.2543, 0.00], // MC
    [0.2958, 0.00, 0.6709, 0.2840, 0.3039, 0.5042, 0.5420, 0.4126, 0.4244, 0.6020, 0.2580, 0.4501, 0.2521, 0.00], // ML/R
    [0.3363, 0.00, 0.4932, 0.2035, 0.1910, 0.5619, 0.5719, 0.6670, 0.0675, 0.6016, 0.4225, 0.6053, 0.2783, 0.00], // OMC
    [0.3585, 0.00, 0.6621, 0.1105, 0.1025, 0.5359, 0.5192, 0.3313, 0.4250, 0.6258, 0.4212, 0.6000, 0.3080, 0.00], // OML/R
    [0.4225, 0.00, 0.4500, 0.0003, 0.0002, 0.3845, 0.5015, 0.4050, 0.0010, 0.5825, 0.7000, 0.9500, 0.6025, 0.00], // F
    [0.35, 0.00, 0.35, 1.0, 0.6, 1.0, 0.5, 0.6, 0.3, 0.0, 0.3]]; // GK

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
$(".column2_a").css("width","657px");
var routineDiv = document.getElementsByClassName("odd align_center")[0];
var dSpans = routineDiv.getElementsByTagName("span");
var routinePl1 = dSpans[1].innerHTML;
var routinePl2 = dSpans[2].innerHTML;
var skillTbl = document.getElementsByClassName("skill_table zebra")[0];
$("table.skill_table").css("padding","5px 0 5px 0");
// save default document object content to variable:
var defaultSkillTbl = document.getElementsByClassName("skill_table zebra")[0].innerHTML;
// add routine toggle button:
routineDiv.innerHTML = "<label for='role1_select'>Role: </label><select id='role1_select' autocomplete='off' aria-disabled='false' style='display: none;'><option value='0' selected='true'>&nbsp;</option><option value='1'>DC</option><option value='2'>DLR</option><option value='3'>DMC</option><option value='4'>DMLR</option><option value='5'>MC</option><option value='6'>MLR</option><option value='7'>OMC</option><option value='8'>OMLR</option><option value='9'>F</option></select>"+
    " | Rou: <input name='rou1' class='embossed' value='"+routinePl1+"' size='2' maxlength='4' style='text-align: center;'><span id='bonus1'></span> | <span id='routineToggle' class='button'><span class='button_border' style='width: 90px; text-transform: none;'>Add routine</span></span>"+
    "<label for='role2_select'> | Role: </label><select id='role2_select' autocomplete='off' aria-disabled='false' style='display: none;'><option value='0' selected='true'>&nbsp;</option><option value='1'>DC</option><option value='2'>DLR</option><option value='3'>DMC</option><option value='4'>DMLR</option><option value='5'>MC</option><option value='6'>MLR</option><option value='7'>OMC</option><option value='8'>OMLR</option><option value='9'>F</option></select>"+
    " | Rou: <input name='rou2' class='embossed' value='"+routinePl2+"' size='2' maxlength='4' style='text-align: center;'><span id='bonus2'></span>";
// add event to routine toggle button:
document.getElementById("routineToggle").addEventListener("click", toggleRoutine, false);
$("#role1_select").selectmenu({ style: "popup", width: 30 });
$("#role1_select").on('change', function() { RECandRating() });
$("#role2_select").selectmenu({ style: "popup", width: 30 });
$("#role2_select").on('change', function() { RECandRating() });
$(".ui-selectmenu").css("font-size","9px");
$("ul.ui-widget").css({"width":"50px","font-size":"9px"});
// create REC and RatingR5 div:
var RECdiv = document.createElement("div");
RECdiv.className="odd align_center";
RECdiv.innerHTML="<table cellspacing='0' cellpadding='0' border='1' bordercolor='#6C9922' style='text-align:center;'><tbody><tr style='color:black;'><td colspan='5' id='rec1'></td><th>REC</th><td colspan='5' id='rec2'></td></tr><tr style='color:black;'><td colspan='5' id='rating1'></td><th>RatingR6</th><td colspan='5' id='rating2'></td></tr>"+
    "<tr id='Hbon' style='font-size:10px;'><th style='width:50px;'>Direct</th><th style='width:50px;'>Wings</th><th style='width:50px;'>Short</th><th style='width:50px;'>Long</th><th style='width:50px;'>Through</th><th></th><th style='width:50px;'>Direct</th><th style='width:50px;'>Wings</th><th style='width:50px;'>Short</th><th style='width:50px;'>Long</th><th style='width:50px;'>Through</th></tr>"+
    "<tr id='Dbon' style='color:blue;'><td id='Ddir1'></td><td id='Dwin1'></td><td id='Dsho1'></td><td id='Dlon1'></td><td id='Dthr1'></td><td>Defense</td><td id='Ddir2'></td><td id='Dwin2'></td><td id='Dsho2'></td><td id='Dlon2'></td><td id='Dthr2'></td></tr>"+
    "<tr id='Abon' style='color:orange;'><td id='Adir1'></td><td id='Awin1'></td><td id='Asho1'></td><td id='Alon1'></td><td id='Athr1'></td><td>Assist</td><td id='Adir2'></td><td id='Awin2'></td><td id='Asho2'></td><td id='Alon2'></td><td id='Athr2'></td></tr>"+
    "<tr id='Fbon' style='color:red;'><td id='Fdir1'></td><td id='Fwin1'></td><td id='Fsho1'></td><td id='Flon1'></td><td id='Fthr1'></td><td>Finish</td><td id='Fdir2'></td><td id='Fwin2'></td><td id='Fsho2'></td><td id='Flon2'></td><td id='Fthr2'></td></tr></tbody></table>";
$(skillTbl).before(RECdiv);
RECandRating();
function RECandRating(){
// get player link:
$("td.large").find("a").each(function(index){
    var playerID = Number($(this).attr("href").match(/\d+/));
    // get each player's info:
    $.post("/ajax/tooltip.ajax.php",{async:false,"player_id":playerID},function(data){
        data = JSON.parse(data);
        var ASI = data.player.skill_index;
        var Age = data.player.age;
        var Months = data.player.months;
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
        var posFullNames = [global_content[455],global_content[455],global_content[456],global_content[456],global_content[457],global_content[457],global_content[458],global_content[458],global_content[460],global_content[459]];
        var newFP = $('#role'+ (index+1) +'_select').val()-1;
        if (fp!=9 && newFP>=0) {
            fp = newFP;
            fp2 = -1;
            var newPosFull = posFullNames[fp];
            if (fp!=8) {
                if (fp%2==0) newPosFull += " "+global_content[462];
                else newPosFull += " "+global_content[461]+"/"+global_content[463];
            }
            if($(RECdiv).find('table tr#newPos').length==0) {
                $(RECdiv).find('table').prepend('<tr id="newPos"><td id="newPos1" colspan="5"></td><th>New role</th><td id="newPos2" colspan="5"></td></tr>');
            }
            $(RECdiv).find('td#newPos'+ (index+1) +'').text(newPosFull);
        }
        if($(RECdiv).find('table tr#newPos').length=1 && newFP<0) $(RECdiv).find('td#newPos'+ (index+1) +'').text('');
        if (fp==9) {
            $(RECdiv).find('tr#Hbon').remove();
            $(RECdiv).find('tr#Dbon').remove();
            $(RECdiv).find('tr#Abon').remove();
            $(RECdiv).find('tr#Fbon').remove();
            $(RECdiv).find('td#rec1').css("width","48%");
            $(RECdiv).find('td#rec2').css("width","48%");

        }
        var ROU = $('input[name=rou'+ (index+1) +']').val();
        var rou2 = (3/100) * (100-(100) * Math.pow(Math.E, -ROU*0.035));

        if (ROLE == "GK") {
            var weight = 48717927500;
        } else {
            weight = 263533760000;
        }
        var skillSum = 0;
        for (i = 0; i < skills.length; i++) {
            skillSum += parseInt(skills[i]);
        }
        var asi = ASI.replace(",","");
        var remainder = Math.round((Math.pow(2,Math.log(weight*asi)/Math.log(Math.pow(2,7))) - skillSum)*10)/10; // RatingR5 remainder

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
		var staRou = skillsB[1]*1;
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

        // R5 Assist    		0:Str			1:Sta			2:Pac			3:Mar			4:Tac			5:Wor			6:Pos			7:Pas			8:Cro			9:Tec
        var weightADir = [[	0.00000000	,	0.02032826	,	0.04743261	,	0.00000000	,	0.00000000	,	0.01355217	,	0.01355217	,	0.04065652	,	0.00000000	,	0.02710435	],	//DC
                          [	0.00000000	,	0.03709181	,	0.08654755	,	0.00000000	,	0.00000000	,	0.02472787	,	0.02472787	,	0.07418362	,	0.00000000	,	0.04945574	],	//DLR
                          [	0.00000000	,	0.04099186	,	0.09564768	,	0.00000000	,	0.00000000	,	0.02732791	,	0.02732791	,	0.08198373	,	0.00000000	,	0.05465582	],	//DMC
                          [	0.00000000	,	0.05537191	,	0.12920113	,	0.00000000	,	0.00000000	,	0.03691461	,	0.03691461	,	0.11074383	,	0.00000000	,	0.07382922	],	//DMLR
                          [	0.00000000	,	0.12500000	,	0.29166667	,	0.00000000	,	0.00000000	,	0.08333333	,	0.08333333	,	0.25000000	,	0.00000000	,	0.16666667	],	//MC
                          [	0.00000000	,	0.01565766	,	0.03653455	,	0.00000000	,	0.00000000	,	0.01043844	,	0.01043844	,	0.03131533	,	0.00000000	,	0.02087689	],	//MLR
                          [	0.00000000	,	0.04289270	,	0.10008296	,	0.00000000	,	0.00000000	,	0.02859513	,	0.02859513	,	0.08578540	,	0.00000000	,	0.05719026	],	//OMC
                          [	0.00000000	,	0.08686786	,	0.20269168	,	0.00000000	,	0.00000000	,	0.05791191	,	0.05791191	,	0.17373573	,	0.00000000	,	0.11582382	],	//OMLR
                          [	0.00000000	,	0.02105888	,	0.04913738	,	0.00000000	,	0.00000000	,	0.01403925	,	0.01403925	,	0.04211775	,	0.00000000	,	0.02807850	]];	//F

        var weightAWin = [[	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                          [	0.01258035	,	0.02516069	,	0.07548208	,	0.00000000	,	0.00000000	,	0.02516069	,	0.00000000	,	0.00000000	,	0.10064277	,	0.05032138	],	//DLR
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                          [	0.00805548	,	0.01611096	,	0.04833289	,	0.00000000	,	0.00000000	,	0.01611096	,	0.00000000	,	0.00000000	,	0.06444385	,	0.03222193	],	//DMLR
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                          [	0.01571086	,	0.03142171	,	0.09426514	,	0.00000000	,	0.00000000	,	0.03142171	,	0.00000000	,	0.00000000	,	0.12568685	,	0.06284342	],	//MLR
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                          [	0.04347826	,	0.08695652	,	0.26086957	,	0.00000000	,	0.00000000	,	0.08695652	,	0.00000000	,	0.00000000	,	0.34782609	,	0.17391304	],	//OMLR
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        var weightASho = [[	0.00000000	,	0.01087937	,	0.01087937	,	0.00000000	,	0.00000000	,	0.01087937	,	0.01087937	,	0.03807781	,	0.00000000	,	0.03263812	],	//DC
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                          [	0.00000000	,	0.02620518	,	0.02620518	,	0.00000000	,	0.00000000	,	0.02620518	,	0.02620518	,	0.09171812	,	0.00000000	,	0.07861553	],	//DMC
                          [	0.00000000	,	0.01720760	,	0.01720760	,	0.00000000	,	0.00000000	,	0.01720760	,	0.01720760	,	0.06022661	,	0.00000000	,	0.05162281	],	//DMLR
                          [	0.00000000	,	0.06519303	,	0.06519303	,	0.00000000	,	0.00000000	,	0.06519303	,	0.06519303	,	0.22817562	,	0.00000000	,	0.19557910	],	//MC
                          [	0.00000000	,	0.02776433	,	0.02776433	,	0.00000000	,	0.00000000	,	0.02776433	,	0.02776433	,	0.09717515	,	0.00000000	,	0.08329299	],	//MLR
                          [	0.00000000	,	0.09523810	,	0.09523810	,	0.00000000	,	0.00000000	,	0.09523810	,	0.09523810	,	0.33333333	,	0.00000000	,	0.28571429	],	//OMC
                          [	0.00000000	,	0.04793546	,	0.04793546	,	0.00000000	,	0.00000000	,	0.04793546	,	0.04793546	,	0.16777412	,	0.00000000	,	0.14380639	],	//OMLR
                          [	0.00000000	,	0.05306295	,	0.05306295	,	0.00000000	,	0.00000000	,	0.05306295	,	0.05306295	,	0.18572031	,	0.00000000	,	0.15918884	]];	//F

        var weightALon = [[	0.00000000	,	0.06111197	,	0.00000000	,	0.00000000	,	0.00000000	,	0.06111197	,	0.06111197	,	0.24444789	,	0.18333592	,	0.12222395	],	//DC
                          [	0.00000000	,	0.06073556	,	0.00000000	,	0.00000000	,	0.00000000	,	0.06073556	,	0.06073556	,	0.24294223	,	0.18220667	,	0.12147111	],	//DLR
                          [	0.00000000	,	0.08279697	,	0.00000000	,	0.00000000	,	0.00000000	,	0.08279697	,	0.08279697	,	0.33118787	,	0.24839090	,	0.16559393	],	//DMC
                          [	0.00000000	,	0.08333333	,	0.00000000	,	0.00000000	,	0.00000000	,	0.08333333	,	0.08333333	,	0.33333333	,	0.25000000	,	0.16666667	],	//DMLR
                          [	0.00000000	,	0.02461107	,	0.00000000	,	0.00000000	,	0.00000000	,	0.02461107	,	0.02461107	,	0.09844428	,	0.07383321	,	0.04922214	],	//MC
                          [	0.00000000	,	0.04562034	,	0.00000000	,	0.00000000	,	0.00000000	,	0.04562034	,	0.04562034	,	0.18248134	,	0.13686101	,	0.09124067	],	//MLR
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        var weightAThr = [[	0.00000000	,	0.01101727	,	0.02754316	,	0.00000000	,	0.00000000	,	0.01101727	,	0.01101727	,	0.02754316	,	0.01101727	,	0.01101727	],	//DC
                          [	0.00000000	,	0.02257878	,	0.05644695	,	0.00000000	,	0.00000000	,	0.02257878	,	0.02257878	,	0.05644695	,	0.02257878	,	0.02257878	],	//DLR
                          [	0.00000000	,	0.01456869	,	0.03642173	,	0.00000000	,	0.00000000	,	0.01456869	,	0.01456869	,	0.03642173	,	0.01456869	,	0.01456869	],	//DMC
                          [	0.00000000	,	0.01499281	,	0.03748203	,	0.00000000	,	0.00000000	,	0.01499281	,	0.01499281	,	0.03748203	,	0.01499281	,	0.01499281	],	//DMLR
                          [	0.00000000	,	0.03120800	,	0.07801999	,	0.00000000	,	0.00000000	,	0.03120800	,	0.03120800	,	0.07801999	,	0.03120800	,	0.03120800	],	//MC
                          [	0.00000000	,	0.01788146	,	0.04470366	,	0.00000000	,	0.00000000	,	0.01788146	,	0.01788146	,	0.04470366	,	0.01788146	,	0.01788146	],	//MLR
                          [	0.00000000	,	0.10000000	,	0.25000000	,	0.00000000	,	0.00000000	,	0.10000000	,	0.10000000	,	0.25000000	,	0.10000000	,	0.10000000	],	//OMC
                          [	0.00000000	,	0.00741912	,	0.01854781	,	0.00000000	,	0.00000000	,	0.00741912	,	0.00741912	,	0.01854781	,	0.00741912	,	0.00741912	],	//OMLR
                          [	0.00000000	,	0.02761910	,	0.06904776	,	0.00000000	,	0.00000000	,	0.02761910	,	0.02761910	,	0.06904776	,	0.02761910	,	0.02761910	]];	//F
        // R5 Defence   		0:Str			1:Sta			2:Pac			3:Mar			4:Tac			5:Wor			6:Pos			7:Pas			8:Cro			9:Tec			10:Hea
        var weightDSho = [[	0.00000000	,	0.04953226	,	0.04953226	,	0.24766129	,	0.39625806	,	0.09906452	,	0.14859677	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                          [	0.00000000	,	0.04838710	,	0.04838710	,	0.24193548	,	0.38709677	,	0.09677419	,	0.14516129	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                          [	0.00000000	,	0.04608295	,	0.04608295	,	0.23041475	,	0.36866359	,	0.09216590	,	0.13824885	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                          [	0.00000000	,	0.03870968	,	0.03870968	,	0.19354839	,	0.30967742	,	0.07741935	,	0.11612903	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                          [	0.00000000	,	0.05000000	,	0.05000000	,	0.25000000	,	0.40000000	,	0.10000000	,	0.15000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                          [	0.00000000	,	0.04032258	,	0.04032258	,	0.20161290	,	0.32258065	,	0.08064516	,	0.12096774	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                          [	0.00000000	,	0.02258065	,	0.02258065	,	0.11290323	,	0.18064516	,	0.04516129	,	0.06774194	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                          [	0.00000000	,	0.01935484	,	0.01935484	,	0.09677419	,	0.15483871	,	0.03870968	,	0.05806452	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        var weightDThr = [[	0.00000000	,	0.07142857	,	0.35714286	,	0.21428571	,	0.21428571	,	0.07142857	,	0.07142857	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                          [	0.00000000	,	0.06773578	,	0.33867889	,	0.20320734	,	0.20320734	,	0.06773578	,	0.06773578	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                          [	0.00000000	,	0.05827311	,	0.29136554	,	0.17481932	,	0.17481932	,	0.05827311	,	0.05827311	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                          [	0.00000000	,	0.05393967	,	0.26969835	,	0.16181901	,	0.16181901	,	0.05393967	,	0.05393967	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                          [	0.00000000	,	0.06236157	,	0.31180785	,	0.18708471	,	0.18708471	,	0.06236157	,	0.06236157	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                          [	0.00000000	,	0.05666119	,	0.28330596	,	0.16998358	,	0.16998358	,	0.05666119	,	0.05666119	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                          [	0.00000000	,	0.03526825	,	0.17634123	,	0.10580474	,	0.10580474	,	0.03526825	,	0.03526825	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                          [	0.00000000	,	0.02282063	,	0.11410315	,	0.06846189	,	0.06846189	,	0.02282063	,	0.02282063	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                          [	0.00000000	,	0.02696984	,	0.13484918	,	0.08090951	,	0.08090951	,	0.02696984	,	0.02696984	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        var weightDWin = [[	0.03872217	,	0.03872217	,	0.19361084	,	0.19361084	,	0.30977735	,	0.03872217	,	0.03872217	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                          [	0.04545455	,	0.04545455	,	0.22727273	,	0.22727273	,	0.36363636	,	0.04545455	,	0.04545455	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                          [	0.01444096	,	0.01444096	,	0.07220482	,	0.07220482	,	0.11552771	,	0.01444096	,	0.01444096	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                          [	0.04360171	,	0.04360171	,	0.21800857	,	0.21800857	,	0.34881370	,	0.04360171	,	0.04360171	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                          [	0.01187368	,	0.01187368	,	0.05936840	,	0.05936840	,	0.09498945	,	0.01187368	,	0.01187368	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                          [	0.03872217	,	0.03872217	,	0.19361084	,	0.19361084	,	0.30977735	,	0.03872217	,	0.03872217	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                          [	0.00704039	,	0.00704039	,	0.03520197	,	0.03520197	,	0.05632315	,	0.00704039	,	0.00704039	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                          [	0.02715581	,	0.02715581	,	0.13577903	,	0.13577903	,	0.21724645	,	0.02715581	,	0.02715581	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                          [	0.00352020	,	0.00352020	,	0.01760099	,	0.01760099	,	0.02816158	,	0.00352020	,	0.00352020	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        var weightDDir = [[	0.00000000	,	0.05263158	,	0.10526316	,	0.42105263	,	0.15789474	,	0.15789474	,	0.10526316	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DC
                          [	0.00000000	,	0.05232603	,	0.10465205	,	0.41860820	,	0.15697808	,	0.15697808	,	0.10465205	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DLR
                          [	0.00000000	,	0.04938021	,	0.09876041	,	0.39504166	,	0.14814062	,	0.14814062	,	0.09876041	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMC
                          [	0.00000000	,	0.03182820	,	0.06365641	,	0.25462564	,	0.09548461	,	0.09548461	,	0.06365641	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//DMLR
                          [	0.00000000	,	0.04928989	,	0.09857978	,	0.39431913	,	0.14786967	,	0.14786967	,	0.09857978	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MC
                          [	0.00000000	,	0.04000000	,	0.08000000	,	0.32000000	,	0.12000000	,	0.12000000	,	0.08000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//MLR
                          [	0.00000000	,	0.02105263	,	0.04210526	,	0.16842105	,	0.06315789	,	0.06315789	,	0.04210526	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMC
                          [	0.00000000	,	0.01684211	,	0.03368421	,	0.13473684	,	0.05052632	,	0.05052632	,	0.03368421	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	],	//OMLR
                          [	0.00000000	,	0.01263158	,	0.02526316	,	0.10105263	,	0.03789474	,	0.03789474	,	0.02526316	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        var weightDLon = [[	0.20000000	,	0.04000000	,	0.08000000	,	0.20000000	,	0.12000000	,	0.08000000	,	0.08000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.20000000	],	//DC
                          [	0.15450127	,	0.03090025	,	0.06180051	,	0.15450127	,	0.09270076	,	0.06180051	,	0.06180051	,	0.00000000	,	0.00000000	,	0.00000000	,	0.15450127	],	//DLR
                          [	0.16404575	,	0.03280915	,	0.06561830	,	0.16404575	,	0.09842745	,	0.06561830	,	0.06561830	,	0.00000000	,	0.00000000	,	0.00000000	,	0.16404575	],	//DMC
                          [	0.14045570	,	0.02809114	,	0.05618228	,	0.14045570	,	0.08427342	,	0.05618228	,	0.05618228	,	0.00000000	,	0.00000000	,	0.00000000	,	0.14045570	],	//DMLR
                          [	0.12641013	,	0.02528203	,	0.05056405	,	0.12641013	,	0.07584608	,	0.05056405	,	0.05056405	,	0.00000000	,	0.00000000	,	0.00000000	,	0.12641013	],	//MC
                          [	0.09831899	,	0.01966380	,	0.03932759	,	0.09831899	,	0.05899139	,	0.03932759	,	0.03932759	,	0.00000000	,	0.00000000	,	0.00000000	,	0.09831899	],	//MLR
                          [	0.07022785	,	0.01404557	,	0.02809114	,	0.07022785	,	0.04213671	,	0.02809114	,	0.02809114	,	0.00000000	,	0.00000000	,	0.00000000	,	0.07022785	],	//OMC
                          [	0.05618228	,	0.01123646	,	0.02247291	,	0.05618228	,	0.03370937	,	0.02247291	,	0.02247291	,	0.00000000	,	0.00000000	,	0.00000000	,	0.05618228	],	//OMLR
                          [	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	,	0.00000000	]];	//F

        if (fp != 9) {
            var Ddir = (staRou*0.052631579+(pacRou+posRou)*0.105263158+marRou*0.421052632+(tacRou+worRou)*0.157894737)*5;
            var Dwin = ((strRou+staRou+worRou+posRou)*0.045454545+(pacRou+marRou)*0.227272727+tacRou*0.363636364)*5;
            var Dsho = ((staRou+pacRou)*0.05+marRou*0.25+tacRou*0.4+worRou*0.1+posRou*0.15)*5;
            var Dlon = ((strRou+marRou+heaRou)*0.2+staRou*0.04+(pacRou+worRou+posRou)*0.08+tacRou*0.12)*5;
            var Dthr = ((staRou+worRou+posRou)*0.071428571+pacRou*0.357142857+(marRou+tacRou)*0.214285714)*5;
            var Dbal = (Ddir+Dwin+Dsho+Dlon+Dthr)/5;

            var Adir = (staRou*0.125+pacRou*0.29166666+(worRou+posRou)*0.08333333+pasRou*0.25+tecRou*0.16666666)*5;
            var Awin = (strRou*0.04347826+(staRou+worRou)*0.08695652+pacRou*0.26086956+croRou*0.34782608+tecRou*0.17391304)*5;
            var Asho = ((staRou+pacRou+worRou+posRou)*0.09523809+pasRou*0.33333333+tecRou*0.28571428)*5;
            var Alon = ((staRou+worRou+posRou)*0.08333333+pasRou*0.33333333+croRou*0.25+tecRou*0.16666666)*5;
            var Athr = ((staRou+worRou+posRou+croRou+tecRou)*0.1+(pacRou+pasRou)*0.25)*5;
            var Abal = (Adir+Awin+Asho+Alon+Athr)/5;

            var shotregular = funFix2(skillsB[11]*0.5+(skillsB[9]*1+skillsB[6]*1+skillsB[2]*1)/3*0.4+(skillsB[0]*1+skillsB[5]*1)/2*0.1+rou2);
            var shotlong = funFix2(skillsB[12]*0.5+(skillsB[9]*1+skillsB[11]*1+skillsB[6]*1)/3*0.4+(skillsB[0]*1+skillsB[5]*1)/2*0.1+rou2);
            var shothead = funFix2(skillsB[10]*0.5+(skillsB[0]*2+skillsB[6]*1)/3*0.4+(skillsB[2]*1+skillsB[5]*1)/2*0.1+rou2);

            var Fdir = (shotregular*0.339+shotlong*0.342+shothead*0.319)*5;
            var Fwin = (shotregular*0.252+shotlong*0.035+shothead*0.713)*5;
            var Fsho = (shotregular*0.534+shotlong*0.339+shothead*0.127)*5;
            var Flon = (shotregular*0.271+shotlong*0.037+shothead*0.692)*5;
            var Fthr = (shotregular*0.703+shotlong*0.151+shothead*0.146)*5;
            var Fbal = (Fdir+Fwin+Fsho+Flon+Fthr)/5;
        } else { Dbal=Ddir=Dwin=Dsho=Dlon=Dthr=Abal=Adir=Awin=Asho=Alon=Athr=Fbal=Fdir=Fwin=Fsho=Flon=Fthr=0; }

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
        $(RECdiv).find('#rec'+ (index+1) +'').text(rec);
            $(RECdiv).find('#rating'+ (index+1) +'').text(R5FP);
            $(RECdiv).find('#Ddir'+ (index+1) +'').text(funFix2(Ddir));
            $(RECdiv).find('#Dwin'+ (index+1) +'').text(funFix2(Dwin));
            $(RECdiv).find('#Dsho'+ (index+1) +'').text(funFix2(Dsho));
            $(RECdiv).find('#Dlon'+ (index+1) +'').text(funFix2(Dlon));
            $(RECdiv).find('#Dthr'+ (index+1) +'').text(funFix2(Dthr));
            $(RECdiv).find('#Adir'+ (index+1) +'').text(funFix2(Adir));
            $(RECdiv).find('#Awin'+ (index+1) +'').text(funFix2(Awin));
            $(RECdiv).find('#Asho'+ (index+1) +'').text(funFix2(Asho));
            $(RECdiv).find('#Alon'+ (index+1) +'').text(funFix2(Alon));
            $(RECdiv).find('#Athr'+ (index+1) +'').text(funFix2(Athr));
            $(RECdiv).find('#Fdir'+ (index+1) +'').text(funFix2(Fdir));
            $(RECdiv).find('#Fwin'+ (index+1) +'').text(funFix2(Fwin));
            $(RECdiv).find('#Fsho'+ (index+1) +'').text(funFix2(Fsho));
            $(RECdiv).find('#Flon'+ (index+1) +'').text(funFix2(Flon));
            $(RECdiv).find('#Fthr'+ (index+1) +'').text(funFix2(Fthr));
    });

});
}
function applyRoutine() {
    // remove span tags with "subtle" class:
    var Rou1 = document.getElementsByName("rou1")[0].value;
    var Rou2 = document.getElementsByName("rou2")[0].value;
    var skBonus1 = (3/100) * (100-(100) * Math.pow(Math.E, -Rou1*0.035));
    var skBonus2 = (3/100) * (100-(100) * Math.pow(Math.E, -Rou2*0.035));
    var newSkBns1 = document.getElementById("bonus1");
    var newSkBns2 = document.getElementById("bonus2");
    newSkBns1.textContent = " +"+skBonus1.toFixed(2);
    newSkBns2.textContent = " +"+skBonus2.toFixed(2);
    var subtleSpans = skillTbl.getElementsByClassName('subtle');
    var subtleSpanContent, subtleSpanParent, newSubtleSpanContent;
    while (subtleSpans.length) {
        subtleSpanContent = subtleSpans[0].innerHTML;
        subtleSpanParent = subtleSpans[0].parentNode;
        newSubtleSpanContent = document.createTextNode(subtleSpanContent);
        subtleSpanParent.insertBefore(newSubtleSpanContent, subtleSpans[0]);
        subtleSpanParent.removeChild(subtleSpans[0]);
    }

    // calculate routine to skills:
    var tSkillSpans = skillTbl.getElementsByTagName("span");
    var tSkillSpan;
    //var skill1 = [];
    for (var p1 = 0; p1 < tSkillSpans.length; p1 += 2) {
        tSkillSpan = tSkillSpans[p1];
        // omit tSkillSpans[4] which stands for stamina and is not affected by routine:
        if (p1 === 4) {
            if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
                tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML);
            } else {
                tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2'));
            }
            //skill1 = skill1.concat(tSkillSpan.innerHTML);
            dyeStamina(tSkillSpan);
        } else {
            if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
                //skill1 = skill1.concat(parseFloat(tSkillSpan.innerHTML));
                tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML) + (3 / 100) * (100 - (100) * Math.exp(-Rou1* 0.035))) * 100) / 100;
            } else {
                //skill1 = skill1.concat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2'));
                tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')) + (3 / 100) * (100 - (100) * Math.exp(-Rou1 * 0.035))) * 100) / 100;
            }
            dyeSkills(tSkillSpan);
        }
    }
    //var skill2 = [];
    for (var p2 = 1; p2 < tSkillSpans.length; p2 += 2) {
        tSkillSpan = tSkillSpans[p2];
        // omit tSkillSpans[5] which stands for stamina and is not affected by routine:
        if (p2 === 5) {
            if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
                tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML);
            } else {
                tSkillSpan.innerHTML = parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2'));
            }
            //skill2 = skill2.concat(tSkillSpan.innerHTML);
            dyeStamina(tSkillSpan);
        } else {
            if (0 < parseFloat(tSkillSpan.innerHTML) && parseFloat(tSkillSpan.innerHTML) < 19) {
                //skill2 = skill2.concat(parseFloat(tSkillSpan.innerHTML));
                tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML) + (3 / 100) * (100 - (100) * Math.exp(-Rou2 * 0.035))) * 100) / 100;
            } else {
                //skill2 = skill2.concat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2'));
                tSkillSpan.innerHTML = Math.round((parseFloat(tSkillSpan.innerHTML.replace(/(^.+\D)(\d+)(\D.+$)/i, '$2')) + (3 / 100) * (100 - (100) * Math.exp(-Rou2 * 0.035))) * 100) / 100;
            }
            dyeSkills(tSkillSpan);
        }
    }

    // add new cells with +/- skills comparison:
    var tSkillRow, pl1Skill, pl2Skill, compareSkill1, compareSkill2;
    for (var tr = 0; tr < skillTbl.getElementsByTagName("tr").length; tr++) {
        tSkillRow = skillTbl.getElementsByTagName("tr")[tr];
        if (tSkillRow.getElementsByTagName("span")[2] && tSkillRow.getElementsByTagName("span")[3]) {
            var pl1Skill1 = tSkillRow.getElementsByTagName("span")[0].innerHTML;
            var pl2SKill1 = tSkillRow.getElementsByTagName("span")[1].innerHTML;
            var pl1Skill2 = tSkillRow.getElementsByTagName("span")[2].innerHTML;
            var pl2SKill2 = tSkillRow.getElementsByTagName("span")[3].innerHTML;
            compareSkill1 = Math.round((parseFloat(pl1Skill1) - parseFloat(pl2SKill1)) * 100) / 100;
            compareSkill2 = Math.round((parseFloat(pl1Skill2) - parseFloat(pl2SKill2)) * 100) / 100;
            var compareCell1 = tSkillRow.insertCell(2);
            compareCell1.innerHTML = (compareSkill1 === 0 ? "=&nbsp;&nbsp;&nbsp;" : compareSkill1 < 0 ? "‒" : "+") + (compareSkill1 === 0 ? "" : Math.abs(compareSkill1));
            compareCell1.style.textAlign = "left";
            compareSkill1 === 0 ? compareCell1.style.color = "yellow" : compareSkill1 > 0 ? compareCell1.style.color = "lime" : compareCell1.style.color = "orangered";
            var compareCell2 = tSkillRow.insertCell(5);
            compareCell2.innerHTML = (compareSkill2 === 0 ? "=&nbsp;&nbsp;&nbsp;" : compareSkill2 < 0 ? "‒" : "+") + (compareSkill2 === 0 ? "" : Math.abs(compareSkill2));
            compareCell2.style.textAlign = "left";
            compareSkill2 === 0 ? compareCell2.style.color = "yellow" : compareSkill2 > 0 ? compareCell2.style.color = "lime" : compareCell2.style.color = "orangered";
        } else {
            pl1Skill1 = tSkillRow.getElementsByTagName("span")[0].innerHTML;
            pl2SKill1 = tSkillRow.getElementsByTagName("span")[1].innerHTML;
            compareSkill1 = Math.round((parseFloat(pl1Skill1) - parseFloat(pl2SKill1)) * 100) / 100;
            compareCell2 = tSkillRow.insertCell(2);
            compareCell1 = tSkillRow.insertCell(5);
            compareCell1.innerHTML = (compareSkill1 === 0 ? "=&nbsp;&nbsp;&nbsp;" : compareSkill1 < 0 ? "‒" : "+") + (compareSkill1 === 0 ? "" : Math.abs(compareSkill1));
            compareCell1.style.textAlign = "left";
            compareSkill1 === 0 ? compareCell1.style.color = "yellow" : compareSkill1 > 0 ? compareCell1.style.color = "lime" : compareCell1.style.color = "orangered";
        }
    }

    // get rid of "class" in span tags
    for (var i = 0; i < skillTbl.getElementsByTagName("span").length; i++) {
        skillTbl.getElementsByTagName("span")[i].removeAttribute("class");
    }
}

// colour skills depending on their value:
function dyeStamina(tSkillSpan) {
    if (20 <= parseInt(tSkillSpan.innerHTML)) tSkillSpan.style.color = "#FF4500";
    if (19 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 20) tSkillSpan.style.color = "#FFA500";
    if (17 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 19) tSkillSpan.style.color = "#FFD700";
    if (15 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 17) tSkillSpan.style.color = "#FFFF00";
    if (5 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 10) tSkillSpan.style.opacity = "0.75";
    if (1 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 5) tSkillSpan.style.opacity = "0.5";
}
function dyeSkills(tSkillSpan) {
    if (22 <= parseInt(tSkillSpan.innerHTML)) tSkillSpan.style.color = "#FF4500";
    if (21 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 22) tSkillSpan.style.color = "#FFA500";
    if (19 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 21) tSkillSpan.style.color = "#FFD700";
    if (15 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 19) tSkillSpan.style.color = "#FFFF00";
    if (5 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 10) tSkillSpan.style.opacity = "0.75";
    if (1 <= parseInt(tSkillSpan.innerHTML) && parseInt(tSkillSpan.innerHTML) < 5) tSkillSpan.style.opacity = "0.5";
}

// add/remove routine & comparison to/from skills:
function toggleRoutine() {
    if (document.getElementById("routineToggle").innerHTML.includes("Add")) {
        applyRoutine();
        RECandRating();
        document.getElementById("routineToggle").innerHTML = "<span class='button_border' style='width: 90px; text-transform: none;'>Remove bonus</span>";
    } else if (document.getElementById("routineToggle").innerHTML.includes("Remove")) {
        skillTbl.innerHTML = defaultSkillTbl;
        document.getElementById("routineToggle").innerHTML = "<span class='button_border' style='width: 90px; text-transform: none;'>Add routine</span>";
    } else {
        alert("CAUTION: The script may not work properly!");
    }
}