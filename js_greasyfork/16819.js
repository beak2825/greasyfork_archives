// ==UserScript==
// @name              FMURR2
// @namespace  ASI REC
// @version			1.3
// @description		RatingR2, REREC, SI JP/EN
// @include			https://ultra.trophymanager.com/players/*
// @author	xxxx
// @downloadURL https://update.greasyfork.org/scripts/16819/FMURR2.user.js
// @updateURL https://update.greasyfork.org/scripts/16819/FMURR2.meta.js
// ==/UserScript==

var weightR2 = [[	0.51872935	,	0.29081119	,	0.57222393	,	0.89735816	,	0.84487852	,	0.50887940	,	0.50887940	,	0.13637928	,	0.05248024	,	0.09388931	,	0.57549122	,	0.00000000	,	0.00000000	,	0.0	],	// DC
                [	0.45240063	,	0.31762087	,	0.68150374	,	0.77724031	,	0.74690951	,	0.50072196	,	0.45947168	,	0.17663123	,	0.23886264	,	0.18410349	,	0.46453393	,	0.00000000	,	0.00000000	,	0.0	],	// DL/R
                [	0.43789335	,	0.31844356	,	0.53515723	,	0.63671706	,	0.59109742	,	0.51311701	,	0.53184426	,	0.32421168	,	0.06318165	,	0.27931537	,	0.50093723	,	0.19317517	,	0.07490902	,	0.0	],	// DMC
                [	0.42311032	,	0.32315966	,	0.62271745	,	0.53932111	,	0.51442838	,	0.49835997	,	0.47896659	,	0.26434782	,	0.22586124	,	0.32182902	,	0.45537227	,	0.23961054	,	0.09291562	,	0.0	],	// DML/R
                [	0.31849880	,	0.36581214	,	0.50091016	,	0.31726444	,	0.28029020	,	0.52022170	,	0.55763723	,	0.60199246	,	0.10044356	,	0.51811057	,	0.38320838	,	0.38594825	,	0.14966211	,	0.0	],	// MC
                [	0.35409971	,	0.34443972	,	0.64417234	,	0.30427501	,	0.27956082	,	0.49925481	,	0.46093655	,	0.32887111	,	0.38695101	,	0.47884837	,	0.37465446	,	0.39194758	,	0.15198852	,	0.0	],	// ML/R
                [	0.32272636	,	0.35024067	,	0.48762872	,	0.22888914	,	0.19049636	,	0.52620414	,	0.57842512	,	0.53330409	,	0.07523792	,	0.55942740	,	0.39986691	,	0.53866926	,	0.20888391	,	0.0	],	// OMC
                [	0.36311066	,	0.33106245	,	0.61831416	,	0.19830147	,	0.17415753	,	0.50049575	,	0.47737842	,	0.28937553	,	0.34729042	,	0.52834210	,	0.39939218	,	0.55684664	,	0.21593269	,	0.0	],	// OML/R
                [	0.40622753	,	0.29744114	,	0.39446722	,	0.09952139	,	0.07503885	,	0.50402399	,	0.58505850	,	0.36932466	,	0.05210389	,	0.53677990	,	0.51998862	,	0.83588627	,	0.32413803	,	0.0	],	// F
                [	0.37313433	,	0.37313433	,	0.37313433	,	0.74626866	,	0.52238806	,	0.74626866	,	0.52238806	,	0.52238806	,	0.37313433	,	0.22388060	,	0.22388060	]];	// GK

// RECb weights		Str				Sta				Pac				Mar				Tac				Wor				Pos				Pas				Cro				Tec				Hea				Fin				Lon				Set
var weightRb = [[	0.10429242	,	0.05337506	,	0.07928041	,	0.14415686	,	0.13100267	,	0.06551359	,	0.07867652	,	0.06547117	,	0.05113471	,	0.02803724	,	0.12119853	,	0.01430980	,	0.02510198	,	0.03844904	],	// DC
                [	0.07660230	,	0.05043295	,	0.11528887	,	0.11701021	,	0.12737497	,	0.07681385	,	0.06343039	,	0.03777422	,	0.10320519	,	0.06396543	,	0.09155298	,	0.01367035	,	0.02554511	,	0.03733318	],	// DL/R
                [	0.07705538	,	0.08602383	,	0.09464787	,	0.09923007	,	0.08562049	,	0.09471430	,	0.09080029	,	0.08850141	,	0.04624428	,	0.05929978	,	0.04725764	,	0.04164267	,	0.05171747	,	0.03724452	],	// DMC
                [	0.06494925	,	0.06431715	,	0.10705940	,	0.08587305	,	0.09573388	,	0.09679376	,	0.08305865	,	0.05977136	,	0.10033506	,	0.07333050	,	0.04572170	,	0.04006968	,	0.05193584	,	0.03105072	],	// DML/R
                [	0.07377221	,	0.08218426	,	0.07191130	,	0.08225503	,	0.07050488	,	0.09514430	,	0.09330324	,	0.09646705	,	0.04794503	,	0.07065198	,	0.04683435	,	0.06126137	,	0.07183089	,	0.03593412	],	// MC
                [	0.06527363	,	0.06410270	,	0.09701305	,	0.07406706	,	0.08563595	,	0.09648566	,	0.08651209	,	0.06357183	,	0.10819222	,	0.07386495	,	0.03245554	,	0.05430668	,	0.06572005	,	0.03279859	],	// ML/R
                [	0.07430140	,	0.08163989	,	0.07328279	,	0.06595901	,	0.06294372	,	0.08613834	,	0.07951422	,	0.11221160	,	0.02526301	,	0.08598732	,	0.07031723	,	0.06988909	,	0.08069135	,	0.03186103	],	// OMC
                [	0.06160036	,	0.06266221	,	0.10181507	,	0.06794213	,	0.07547916	,	0.09513291	,	0.07893810	,	0.07374110	,	0.11236964	,	0.07774370	,	0.04362843	,	0.05982069	,	0.06652248	,	0.02260401	],	// OML/R
                [	0.07609323	,	0.05168160	,	0.07682437	,	0.01258519	,	0.01114101	,	0.06414529	,	0.07684240	,	0.07540262	,	0.02759913	,	0.07793503	,	0.12888657	,	0.15317941	,	0.12877305	,	0.03891110	],	// F

                [	0.07466384	,	0.07466384	,	0.07466384	,	0.14932769	,	0.10452938	,	0.14932769	,	0.10452938	,	0.10344411	,	0.07512610	,	0.04492581	,	0.04479831	]];	// GK						


var positionNames = ["D C", "D L", "D R", "DM C", "DM L", "DM R", "M C", "M L", "M R", "OM C", "OM L", "OM R", "F", "GK"];
var positionFullNames = [
/* EN */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* JP */	["ディフェンダー 中央", "ディフェンダー 左", "ディフェンダー 右", "守備的ミッドフィルダー 中央", "守備的ミッドフィルダー 左", "守備的ミッドフィルダー 右", "ミッドフィルダー 中央", "ミッドフィルダー 左", "ミッドフィルダー 右", "攻撃的ミッドフィルダー 中央", "攻撃的ミッドフィルダー 左", "攻撃的ミッドフィルダー 右", "フォワード", "ゴールキーパー"]]

if (location.href.indexOf("/players/") != -1){
	
	document.findPositionIndex = function(position) {
		var index = -1;
		for (var i=0; i< positionFullNames.length; i++) {
			for (var j=0; j< positionFullNames[i].length; j++) {
				if (position.indexOf(positionFullNames[i][j]) == 0) return j;
			}
		}
		return index;
	};
	
	function getSI() {
		var SI = 0;
		if (document.getElementsByClassName("transfer_status_box")[0] == null) {	// 希望価格が設定されていない場合
			var button = document.getElementById("transferasking_button");
			if (button == null) {
//				SI = document.getElementsByClassName("button")[0].getAttribute("onclick");	// set asking price がないなら他チームの選手
				SI = document.getElementsByClassName("button")[2].getAttribute("onclick");	// 何らかの仕様変更に対応
//				if (document.getElementsByClassName("transfer_box small")[0].innerHTML.indexOf("expir") > -1 || document.getElementsByClassName("transfer_box small")[0].innerHTML.indexOf("締め切ら") > -1) {	// 移籍リストの選手
				if (document.getElementsByClassName("transfer_box small")[0].innerHTML.indexOf("expir") > -1 || document.getElementsByClassName("transfer_box small")[0].innerHTML.indexOf("締め切ら") > -1 || SI.indexOf("player_note") != -1) {	// 仕様変更に対応 2
					SI = 0;
					return SI;
				}
			}
			else SI = button.getAttribute("onclick");	// あるなら自分の選手
			SI = SI.match(/(\d+,)+/)[0];
			SI = new String(SI).replace(/,/g, "");
		}
		return SI;
	}
	
	function calculateREREC(positionIndex, skills){
		var SItrue = getSI();
		if (SItrue != 0) {
			if (positionIndex == 13) var weight = 48717927500;
			else var weight = 263533760000;
			var skillSum = 0;
			for (var i = 0; i < skills.length; i++) {
				skillSum += parseInt(skills[i]);
			}
			var remainder = Math.round((Math.pow(2,Math.log(weight*SItrue)/Math.log(Math.pow(2,7))) - skillSum/5)*10)/10;		// 正確な余り
		}
		var ratingR = 0;		// RatingR2
		var recb = 0;
		var weightSumb = 0;
		var not100 = 0;
		for (i = 0; 2+i <= positionIndex; i += 2) {		// TrExMaとRECのweight表のずれ修正
			positionIndex--;
		}
		for (var i = 0; i < weightRb[positionIndex].length; i++) {					// Score ここから
			ratingR += skills[i] * weightR2[positionIndex][i];
			recb += skills[i] * weightRb[positionIndex][i];
			if (skills[i] < 95) {
				weightSumb += weightRb[positionIndex][i];
				not100++;
			}
			else if (skills[i] < 100) {
				weightSumb += weightRb[positionIndex][i] * 9;
				not100 += 9;
			}
		}
		ratingR /= 5;
		if (not100 == 0) recb = 6;		// All MAX
		else if (SItrue != 0) recb = ((recb + remainder * 5 * weightSumb / not100) / 5 - 2) / 3;
		else recb = ((recb + Math.floor(not100/2) / 2 * weightSumb / not100) / 5 - 2) / 3;
		
		var recAndRating = [recb, ratingR, 0];
		return recAndRating;
	}
	
	function funFix (i) {
		i = (Math.round(i*100)/100).toFixed(2);
		return i;
	}
	
	function funFix2 (i) {
		i = (Math.round(i*1000)/1000).toFixed(3);
		return i;
	}
	var skills = [];
	var star = 0;
	var silver = 0;
	var tableData = document.getElementsByClassName("skill_table")[0].getElementsByTagName("td");
	for (var i = 0; i < 2; i++) {
		for (var j = i; j < tableData.length; j += 3) {
			if (tableData[j].innerHTML.indexOf("gold_star") > 0) {
				skills.push(100);
				star++;
			}
			else if (tableData[j].innerHTML.indexOf("silver_star") > 0) {
				skills.push(95);
				silver++;
			}
			else if (tableData[j].textContent.length != 0) {
				skills.push(tableData[j].textContent);
			}
		}
	}
	
	var SKs = [0,0,0,0];
	var REREC = [[0,0,0], [0,0,0]];
	var positionCell = document.getElementsByClassName("favposition long")[0].childNodes;
	var positionArray = [];
	if (positionCell.length == 1){
			positionArray[0] = positionCell[0].textContent;
	} else if (positionCell.length == 2){
			positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
	} else if (positionCell[1].className == "split"){
			positionArray[0] = positionCell[0].textContent + positionCell[3].textContent;
			positionArray[1] = positionCell[2].textContent + positionCell[3].textContent;
	} else if (positionCell[3].className == "f"){
			positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
			positionArray[1] = positionCell[3].textContent;
	} else {
			positionArray[0] = positionCell[0].textContent + positionCell[1].textContent;
			positionArray[1] = positionCell[0].textContent + positionCell[3].textContent;
	}
	var rou_factor = 0.00405;
	var gettr = document.getElementsByTagName("tr");
	var rou = gettr[4].getElementsByTagName("td")[1].innerHTML
	rou = Math.pow(5/3, Math.LOG2E * Math.log(rou * 10)) * 0.4;
	
	for (var i = 0; i < positionArray.length; i++){
			var positionIndex = document.findPositionIndex(positionArray[i]);
			if (positionIndex > -1) {
				REREC[i] = calculateREREC(positionIndex, skills);
				REREC[i][2] = REREC[i][1] * (1 + rou * rou_factor);
				for (var j = 0; j < 3; j++) {
					if (j == 0) REREC[i][j] = funFix2(REREC[i][j]);
					else REREC[i][j] = funFix(REREC[i][j]);
				}
			}
	}
	var dual = 0;
	if (REREC[1][0] != 0 && (REREC[0][0] != REREC[1][0] || REREC[0][1] != REREC[1][1])) dual = 1;
	
	var wage = new String(gettr[2].getElementsByTagName("td")[1].innerHTML).replace(/,/g, "");
	wage = wage.match(/\d+/);
	if (positionIndex == 13){
		var phy = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[7]*1;
		var tac = skills[4]*1 + skills[6]*1 + skills[8]*1;
		var tec = skills[3]*1 + skills[5]*1 + skills[9]*1 + skills[10]*1;
		var weight = 48717927500;
		var peak = [4,3,4];
		var skillNum = 11;
	}
	else {
		var phy = skills[0]*1 + skills[1]*1 + skills[2]*1 + skills[10]*1;
		var tac = skills[3]*1 + skills[4]*1 + skills[5]*1 + skills[6]*1;
		var tec = skills[7]*1 + skills[8]*1 + skills[9]*1 + skills[11]*1 + skills[12]*1 + skills[13]*1;
		var weight = 263533760000;
		var peak = [4,4,6];
		var skillNum = 14;
	}
	
	var allSum = phy + tac + tec;
	var SItrue = getSI();
	if (SItrue == 0) var remainder = "?";
	else var remainder = Math.round((Math.pow(2,Math.log(weight*SItrue)/Math.log(Math.pow(2,7)))*5 - allSum)*2)/2;
	var div_area = document.createElement('div');
	div_area.innerHTML="<div style=\"position: absolute; z-index: 1000; width: 226px; margin-top: 20px; padding: 10px 15px; background: #16beee; color: #ffffff; display: inline; z-index: 1; font-size: 110%;\"><p><b>Skill Sum<\p><table style=\"margin-top: -1em; margin-bottom: 0.5em;\"><tr><td>Physical: </td><td>" + phy + " (" + Math.round(phy/peak[0]) + "%)</td></tr><tr><td>Tactical: </td><td>" + tac + " (" + Math.round(tac/peak[1]) + "%)</td></tr><tr><td>Technical: </td><td>" + tec + " (" + Math.round(tec/peak[2]) + "%)</td></tr><tr><td>All Sum: </td><td>" + allSum + " + " + remainder + " </td></tr></table></b></div>";
	document.getElementsByClassName("box")[0].appendChild(div_area);
	
	if (SItrue == 0) {
		var skillSum = 0;
		for (var i=0; i< skills.length; i++) {
			if (skills[i]>0) skillSum += skills[i] * 1;
		}
		skillSum = (skillSum + Math.floor((skillNum-star+silver*8)/2)/2) / 5;
		var SI = Math.round(Math.pow(Math.pow(2,7), Math.log(skillSum) / Math.log(2)) / weight);
		var TI = Math.round((Math.pow(SI*weight,1/7)-Math.pow(wage/28.5*weight,1/7))*10);
		TI = "<font style=\"color: #B22222;\">" + TI + "</font>";
		SI = new String(SI);								// 数字を文字列に変換？
		while(SI != (SI = SI.replace(/^(-?\d+)(\d{3})/, "$1,$2")));	// カンマ挿入？
	}
	else {
		var TI = Math.round((Math.pow(SItrue*weight,1/7)-Math.pow(wage/28.5*weight,1/7))*10);
		while(SItrue != (SItrue = SItrue.replace(/^(-?\d+)(\d{3})/, "$1,$2")));	// カンマ挿入？
	}
	if (wage == 30000 || wage ==16777215) TI = "---";
	
	for (var i = 0; i < 4; i++){
		var tr = document.createElement("tr");
//		var td = document.createElement("td");
//		tr.appendChild(td);
		var td2 = document.createElement("td");
		td2.setAttribute("class", "unbold align_right");
		switch (i){
			case 0:
				td2.innerHTML = "SI:";
				break;
			case 1:
				td2.innerHTML = "Season TI:";
				break;
			case 2:
				td2.innerHTML = "REREC:";
				break;
			case 3:
				td2.innerHTML = "RatingR2:";
				break;
		}
		tr.appendChild(td2);
		var td3 = document.createElement("td");
		switch (i){
			case 0:
				if (SItrue == 0) td3.innerHTML = "<font style=\"color: #B22222;\">" + SI + "</font>";
				else td3.innerHTML = SItrue;
				break;
			case 1:
					td3.innerHTML = TI;
				break;
			case 2:
				if (dual == 1) {
					td3.innerHTML = REREC[0][0] + "/" +REREC[1][0];
				}
				else {
					td3.innerHTML = REREC[0][0];
				}
				break;
			case 3:
				if (dual == 1) {
					td3.innerHTML = REREC[0][2] + "/" + REREC[1][2] + " " + "(" + REREC[0][1] + "/" + REREC[1][1] + ")";
				}
				else {
					td3.innerHTML = REREC[0][2] + " " + "(" + REREC[0][1] + ")";
				}
				break;
		}
		tr.appendChild(td3);
		document.getElementsByClassName("info_table small")[0].appendChild(tr);
	}
}