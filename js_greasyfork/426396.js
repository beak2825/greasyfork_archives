// ==UserScript==
// @name            TM Trader's Calculator
// @version         1.6.2024121701
// @description     Calculates sell-to-bank price, max price, and TI before birthday (if the player had the birthday during the season)
// @author          Borgo Cervaro Calcio Champagne [club ID = 3257254] (based on "Rating Script plus" by Duckman and "RatingR5" by CHU-CHI)
// @include			*trophymanager.com/players/*
// @exclude			*trophymanager.com/players/compare/*
// @license MIT
// @namespace https://greasyfork.org/users/15590
// @downloadURL https://update.greasyfork.org/scripts/426396/TM%20Trader%27s%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/426396/TM%20Trader%27s%20Calculator.meta.js
// ==/UserScript==

setTimeout(function() {
/* UPDATE EACH SEASON */
var youthID = 132809178;
var botID = 132463936;
var SS = new Date("03 15 2021 08:00:00 GMT"); // s67 start
var training1 = new Date("03 15 2021 23:00:00 GMT");  // first training
/* UPDATE EACH SEASON */
var wage_rate = 15.8079;
var Season = SESSION.season;

var positionNames = ["D C", "D L", "D R", "DM C", "DM L", "DM R", "M C", "M L", "M R", "OM C", "OM L", "OM R", "F", "GK"];
var positionFullNames = [
/* EN */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* JP */	["ディフェンダー 中央", "ディフェンダー 左", "ディフェンダー 右", "守備的ミッドフィルダー 中央", "守備的ミッドフィルダー 左", "守備的ミッドフィルダー 右", "ミッドフィルダー 中央", "ミッドフィルダー 左", "ミッドフィルダー 右", "攻撃的ミッドフィルダー 中央", "攻撃的ミッドフィルダー 左", "攻撃的ミッドフィルダー 右", "フォワード", "ゴールキーパー"],
/* P  */	["Obrońca środkowy", "Obrońca lewy", "Obrońca prawy", "Defensywny pomocnik środkowy", "Defensywny pomocnik lewy", "Defensywny pomocnik prawy", "Pomocnik środkowy", "Pomocnik lewy", "Pomocnik prawy", "Ofensywny pomocnik środkowy", "Ofensywny pomocnik lewy", "Ofensywny pomocnik prawy", "Napastnik", "Bramkarz"],
/* D  */	["Forsvar Centralt", "Forsvar Venstre", "Forsvar Højre", "Defensiv Midtbane Centralt", "Defensiv Midtbane Venstre", "Defensiv Midtbane Højre", "Midtbane Centralt", "Midtbane Venstre", "Midtbane Højre", "Offensiv Midtbane Centralt", "Offensiv Midtbane Venstre", "Offensiv Midtbane Højre", "Angriber", "Målmand"],
/* I  */	["Difensore Centrale", "Difensore Sinistro", "Difensore Destro", "Centrocampista Difensivo Centrale", "Centrocampista Difensivo Sinistro", "Centrocampista Difensivo Destro", "Centrocampista Centrale", "Centrocampista Sinistro", "Centrocampista Destro", "Centrocampista Offensivo Centrale", "Centrocampista Offensivo Sinistro", "Centrocampista Offensivo Destro", "Attaccante", "Portiere"],
/* H  */	["Defensa Central", "Defensa Izquierdo", "Defensa Derecho", "Mediocampista Defensivo Central", "Mediocampista Defensivo Izquierdo", "Mediocampista Defensivo Derecho", "Mediocampista Central", "Mediocampista Izquierdo", "Mediocampista Derecho", "Mediocampista Ofensivo Central", "Mediocampista Ofensivo Izquierdo", "Mediocampista Ofensivo Derecho", "Delantero", "Portero"],
/* F  */	["Défenseur Central", "Défenseur Gauche", "Défenseur Droit", "Milieu défensif Central", "Milieu défensif Gauche", "Milieu défensif Droit", "Milieu Central", "Milieu Gauche", "Milieu Droit", "Milieu offensif Central", "Milieu offensif Gauche", "Milieu offensif Droit", "Attaquant", "Gardien de but"],
/* A  */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* C  */	["Obrambeni Sredina", "Obrambeni Lijevo", "Obrambeni Desno", "Defenzivni vezni Sredina", "Defenzivni vezni Lijevo", "Defenzivni vezni Desno", "Vezni Sredina", "Vezni Lijevo", "Vezni Desno", "Ofenzivni vezni Sredina", "Ofenzivni vezni Lijevo", "Ofenzivni vezni Desno", "Napadač", "Golman"],
/* G  */	["Verteidiger Zentral", "Verteidiger Links", "Verteidiger Rechts", "Defensiver Mittelfeldspieler Zentral", "Defensiver Mittelfeldspieler Links", "Defensiver Mittelfeldspieler Rechts", "Mittelfeldspieler Zentral", "Mittelfeldspieler Links", "Mittelfeldspieler Rechts", "Offensiver Mittelfeldspieler Zentral", "Offensiver Mittelfeldspieler Links", "Offensiver Mittelfeldspieler Rechts", "Stürmer", "Torhüter"],
/* PO */	["Defesa Centro", "Defesa Esquerdo", "Defesa Direito", "Médio Defensivo Centro", "Médio Defensivo Esquerdo", "Médio Defensivo Direito", "Medio Centro", "Medio Esquerdo", "Medio Direito", "Medio Ofensivo Centro", "Medio Ofensivo Esquerdo", "Medio Ofensivo Direito", "Avançado", "Guarda-Redes"],
/* R  */	["Fundas Central", "Fundas Stânga", "Fundas Dreapta", "Mijlocas Defensiv Central", "Mijlocas Defensiv Stânga", "Mijlocas Defensiv Dreapta", "Mijlocas Central", "Mijlocas Stânga", "Mijlocas Dreapta", "Mijlocas Ofensiv Central", "Mijlocas Ofensiv Stânga", "Mijlocas Ofensiv Dreapta", "Atacant", "Portar"],
/* T  */	["Defans Orta", "Defans Sol", "Defans Sağ", "Defansif Ortasaha Orta", "Defansif Ortasaha Sol", "Defansif Ortasaha Sağ", "Ortasaha Orta", "Ortasaha Sol", "Ortasaha Sağ", "Ofansif Ortasaha Orta", "Ofansif Ortasaha Sol", "Ofansif Ortasaha Sağ", "Forvet", "Kaleci"],
/* RU */	["Defender Center", "Defender Left", "Defender Right", "Defensive Midfielder Center", "Defensive Midfielder Left", "Defensive Midfielder Right", "Midfielder Center", "Midfielder Left", "Midfielder Right", "Offensive Midfielder Center", "Offensive Midfielder Left", "Offensive Midfielder Right", "Forward", "Goalkeeper"],
/* CE */	["Obránce Střední", "Obránce Levý", "Obránce Pravý", "Defenzivní Záložník Střední", "Defenzivní Záložník Levý", "Defenzivní Záložník Pravý", "Záložník Střední", "Záložník Levý", "Záložník Pravý", "Ofenzivní záložník Střední", "Ofenzivní záložník Levý", "Ofenzivní záložník Pravý", "Útočník", "Gólman"],
/* HU */	["Védő , középső", "Védő , bal oldali", "Védő , jobb oldali", "Védekező Középpályás , középső", "Védekező Középpályás , bal oldali", "Védekező Középpályás , jobb oldali", "Középpályás , középső", "Középpályás , bal oldali", "Középpályás , jobb oldali", "Támadó középpályás , középső", "Támadó középpályás , bal oldali", "Támadó középpályás , jobb oldali", "Csatár", "Kapus"],
/* GE */	["მცველი ცენტრალური", "მცველი მარცხენა", "მცველი მარჯვენა", "საყრდენი ნახევარმცველი ცენტრალური", "საყრდენი ნახევარმცველი მარცხენა", "საყრდენი ნახევარმცველი მარჯვენა", "ნახევარმცველი ცენტრალური", "ნახევარმცველი მარცხენა", "ნახევარმცველი მარჯვენა", "შემტევი ნახევარმცველი ცენტრალური", "შემტევი ნახევარმცველი მარცხენა", "შემტევი ნახევარმცველი მარჯვენა", "თავდამსხმელი", "მეკარე"],
/* FI */	["Puolustaja Keski", "Puolustaja Vasen", "Puolustaja Oikea", "Puolustava Keskikenttä Keski", "Puolustava Keskikenttä Vasen", "Puolustava Keskikenttä Oikea", "Keskikenttä Keski", "Keskikenttä Vasen", "Keskikenttä Oikea", "Hyökkäävä Keskikenttä Keski", "Hyökkäävä Keskikenttä Vasen", "Hyökkäävä Keskikenttä Oikea", "Hyökkääjä", "Maalivahti"],
/* SV */	["Försvarare Central", "Försvarare Vänster", "Försvarare Höger", "Defensiv Mittfältare Central", "Defensiv Mittfältare Vänster", "Defensiv Mittfältare Höger", "Mittfältare Central", "Mittfältare Vänster", "Mittfältare Höger", "Offensiv Mittfältare Central", "Offensiv Mittfältare Vänster", "Offensiv Mittfältare Höger", "Anfallare", "Målvakt"],
/* NO */	["Forsvar Sentralt", "Forsvar Venstre", "Forsvar Høyre", "Defensiv Midtbane Sentralt", "Defensiv Midtbane Venstre", "Defensiv Midtbane Høyre", "Midtbane Sentralt", "Midtbane Venstre", "Midtbane Høyre", "Offensiv Midtbane Sentralt", "Offensiv Midtbane Venstre", "Offensiv Midtbane Høyre", "Angrep", "Keeper"],
/* SC */	["Defender Centre", "Defender Left", "Defender Richt", "Defensive Midfielder Centre", "Defensive Midfielder Left", "Defensive Midfielder Richt", "Midfielder Centre", "Midfielder Left", "Midfielder Richt", "Offensive Midfielder Centre", "Offensive Midfielder Left", "Offensive Midfielder Richt", "Forward", "Goalkeeper"],
/* VL */	["Verdediger Centraal", "Verdediger Links", "Verdediger Rechts", "Verdedigende Middenvelder Centraal", "Verdedigende Middenvelder Links", "Verdedigende Middenvelder Rechts", "Middenvelder Centraal", "Middenvelder Links", "Middenvelder Rechts", "Aanvallende Middenvelder Centraal", "Aanvallende Middenvelder Links", "Aanvallende Middenvelder Rechts", "Aanvaller", "Doelman"],
/* BR */	["Zagueiro Central", "Zagueiro Esquerdo", "Zagueiro Direito", "Volante Central", "Volante Esquerdo", "Volante Direito", "Meio-Campista Central", "Meio-Campista Esquerdo", "Meio-Campista Direito", "Meia Ofensivo Central", "Meia Ofensivo Esquerdo", "Meia Ofensivo Direito", "Atacante", "Goleiro"],
/* GR */	["Αμυντικός Κεντρικός", "Αμυντικός Αριστερός", "Αμυντικός Δεξιός", "Αμυντικός Μέσος Κεντρικός", "Αμυντικός Μέσος Αριστερός", "Αμυντικός Μέσος Δεξιός", "Μέσος Κεντρικός", "Μέσος Αριστερός", "Μέσος Δεξιός", "Επιθετικός μέσος Κεντρικός", "Επιθετικός μέσος Αριστερός", "Επιθετικός μέσος Δεξιός", "Επιθετικός", "Τερματοφύλακας"],
/* BG */	["Защитник Централен", "Защитник Ляв", "Защитник Десен", "Дефанзивен Халф Централен", "Дефанзивен Халф Ляв", "Дефанзивен Халф Десен", "Халф Централен", "Халф Ляв", "Халф Десен", "Атакуващ Халф Централен", "Атакуващ Халф Ляв", "Атакуващ Халф Десен", "Нападател"],
];

if (location.href.indexOf("/players/") != -1) {
	document.findPositionIndex = function(position) {
		var index = -1;
		for (var i=0; i< positionFullNames.length; i++) {
			for (var j=0; j< positionFullNames[i].length; j++) {
				if (position.indexOf(positionFullNames[i][j]) == 0) return j;
			}
		}
		return index;
	};

	function funFix1 (i) {
		i = (Math.round(i*10)/10).toFixed(1);
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

	function CalcMaxPrice(age, si, retiring) {
    var Result = "-";
    if (!retiring)
    {
      var yearidx = age.search(/\d\d/);
      var year = age.substr(yearidx,2);
      age = age.slice(yearidx+2);
      var month = age.replace(/\D+/g,"");
      var factor = 192400/(Math.round(year) + Math.round(month)/12)-5200;
      if (factor < 400) factor = 400;
      if (year >= 18) Result = addCommas(Math.round(factor * si));
    }
    return Result;
	}

    function CalcBankPrice(TotalMonths, si, retiring, isGK) {
    var Result = "-";
    if (!retiring)
    {
        var year = Math.floor(TotalMonths / 12);
        var month = TotalMonths % 12;
		if (year >= 18)
        {
            var ageD = 25 / (year * 1 + (month / 12));
            Result = Math.round(si * 500 * Math.pow(ageD, 2.5));
            if (isGK) Result = Math.round(Result * 0.75);
            Result = addCommas(Result);
        }
    }
    return Result;
    }

    function CalcAgeMonths(age) {
      var yearidx = age.search(/\d\d/);
      var year = age.substr(yearidx, 2);
      age = age.slice(yearidx + 2);
      var month = age.replace(/\D+/g,"");
      return year * 12 + month * 1;
    }

    function get_information(link, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
    }

    var en = new Intl.NumberFormat("en-US");
    var gettr = document.getElementsByClassName("float_left info_table zebra")[0].getElementsByTagName("tr");
    var playerID = new String(location.pathname.match(/\d+/g));
    if (playerID.indexOf(",") != (-1)) {
        var pID = new String(playerID.search(/,/g));
        playerID = new String(playerID.substr(0,pID));
    }
	var AgeMonths = CalcAgeMonths(gettr[2].getElementsByTagName("td")[0].innerHTML);
    var RetireStatus = gettr[7].getElementsByTagName("td")[0].innerHTML.indexOf("retire.gif") > 0;
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
    for (var i = 0; i < positionArray.length; i++){
		var positionIndex = document.findPositionIndex(positionArray[i]);
    }
    if (gettr[8].getElementsByTagName("th")[0].innerHTML == global_content[254]) {
    //if (gettr[8].getElementsByTagName("th")[0].innerHTML == "Skill Index") {
        var SI = new String(gettr[8].getElementsByTagName("td")[0].innerHTML).replace(/,/g, "");
    } else {
        SI = new String(gettr[6].getElementsByTagName("td")[0].innerHTML);
        if (SI.indexOf("div") == (-1)) {
            SI = new String(gettr[6].getElementsByTagName("td")[0].innerHTML).replace(/,/g, "");
        } else {
            var divSI = new String(SI.search(/<div>/g));
            SI = new String(SI.substr(0,divSI).replace(/,/g, ""));
        }
    }
    //var wage = new String(gettr[4].getElementsByTagName("td")[0].innerText).replace(/,/g, "");
    var wage = new String(gettr[4].getElementsByTagName("span")[0].innerHTML).replace(/,/g, "");
    var today = new Date();
	var day = (today.getTime()-training1.getTime())/1000/3600/24;
	while (day > 84-16/24) day -= 84;
	var session = Math.floor(day/7)+1;									// training sessions
	var ageMax = 20.1 + session / 12;									// max new player age

	var age = gettr[2].getElementsByTagName("td")[0].innerHTML;
	var yearidx = age.search(/\d\d/);
	var year = age.substr(yearidx,2);
    var months = age.replace(/\D+/g,"");
	age = age.slice(yearidx+2);
	var month = age.replace(/\D+/g,"");
	age = year*1 + month/12;

	var check = today.getTime()-SS.getTime();
	var season = 84*24*3600*1000;
	var count = 0;

	while (check > season) {
		check -= season;
		count++;
	}

	if (document.getElementsByClassName("gk")[0] == null) var weight = 263533760000;
    else weight = 48717927500;
    if (wage == 30000 || (playerID > youthID && count == 0)) {	// youth player ID
		var TI1 = null;
	} else {
		TI1 = Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - Math.pow(2,Math.log(weight*wage/(wage_rate))/Math.log(Math.pow(2,7)));
		TI1 = Math.round(TI1*10);
		if (session == 0) TI1 = TI1;
		else TI1 = funFix1(TI1/session);
	}
    if (playerID > botID && age < ageMax) {		// BOT player ID
		if (wage == 30000) var TI2 = null;
		else {
			wage_rate = 23.75;
			TI2 = Math.pow(2,Math.log(weight*SI)/Math.log(Math.pow(2,7))) - Math.pow(2,Math.log(weight*wage/(wage_rate))/Math.log(Math.pow(2,7)));
			TI2 = Math.round(TI2*10);
            }
		}
    if (TI1 == null && TI2 == null) {
        var AverageTI = 0;
        var sess = parseInt(month)+1;
        var prvTI = 0;
    } else {
        if (TI2 == null) {
        AverageTI = TI1;
        prvTI = 1;
        sess = parseInt(month)+1;
            if (sess > session) sess = session;
        } else {
        AverageTI = TI2/(parseInt(month)-1);
        sess = parseInt(month)-1;
        prvTI = 0;
        }
    }

    var playerTable = document.getElementsByClassName("skill_table zebra")[0];
    var newTr = document.createElement("tr");
	var th = document.createElement("th");
	th.setAttribute("colspan", "4");
	th.setAttribute("align", "center");

    var table4 = document.createElement("table");
	var tbody = document.createElement("tbody");
	table4.setAttribute("border", "1");
	table4.setAttribute("bordercolor", "#6C9922");
    tbody.setAttribute("align", "center");
	var tr = document.createElement("tr");
    tr.style="background-color:#333333;";
    var td = document.createElement("td");
    var myTeam = SESSION["main_id"];
    var myBteam = SESSION["b_team"];
    var teamid = gettr[1].getElementsByTagName("td")[0].innerHTML.match(/\d+/);
    if (prvTI == 1 && session > 0 && (1+parseInt(month))<session) { var csp1 = 1; } else { csp1 = 2; }
    if (teamid != myTeam && teamid != myBteam) { var csp2 = 0; } else { csp2 = 1; }
    var csp = 1*csp1+1*csp2;
    td.setAttribute('colspan', ''+csp+'');
	var newdiv=document.createElement("div");
	var p=document.createElement("d");
	p.style="font-weight:bold;color:#CF0;";
	p.innerText="训练计算器"
	newdiv.appendChild(p);
	td.appendChild(newdiv);
	tr.appendChild(td);

    var td = document.createElement("td");
	var newdiv=document.createElement("div");
	var GoBtn=document.createElement("button");
	var t = document.createTextNode("计算");
	GoBtn.appendChild(t);
	GoBtn.style="width:80%;";
	GoBtn.className="button";
	GoBtn.onclick=DoCalcNewASI;
	newdiv.appendChild(GoBtn);
	td.appendChild(newdiv);
	tr.appendChild(td);

    var td = document.createElement("td");
	var newdiv=document.createElement("div");
    newdiv.innerHTML= "周数<br>";
	var NumTrainings=document.createElement("input");
	NumTrainings.name="NumTrainings";
	NumTrainings.className="embossed";
    NumTrainings.style="text-align:center;margin-bottom:5px;";
	//NumTrainings.size=2;
    NumTrainings.size=1;
	NumTrainings.maxLength=4;
	NumTrainings.value=6;
	newdiv.appendChild(NumTrainings);
	td.appendChild(newdiv);
	tr.appendChild(td);

    var td = document.createElement("td");
	var newdiv=document.createElement("div");
    newdiv.innerHTML= "<d id='TG1'>TI </d><br>";
	var NewTI=document.createElement("input");
	NewTI.name="NewTI";
	NewTI.className="embossed";
    NewTI.style="text-align:center;margin-bottom:5px;display:inline-block;";
	//NewTI.size=5;
    NewTI.size=1;
	NewTI.maxLength=4;
	NewTI.value=funFix1(AverageTI);
	newdiv.appendChild(NewTI);
    var sessDiv=document.createElement("div");
    sessDiv.style="text-transform:lowercase;font-weight:normal;margin-left:4px;margin-top: 2px;display:inline-block;";
    //var sess=1+parseInt(month);
    sessDiv.innerHTML=" x"+sess;
    newdiv.appendChild(sessDiv);
	td.appendChild(newdiv);
	tr.appendChild(td);


    if (teamid != myTeam && teamid != myBteam) {
        var td = document.createElement("td");
	    var newdiv = document.createElement("div");
        var p=document.createElement("d");
        p.id="TG2";
	    newdiv.appendChild(p);
	    td.appendChild(newdiv);
	    tr.appendChild(td);
    }

    if (prvTI == 1 && AverageTI != null && session > 0 && (1+parseInt(month))<session) {
        var td = document.createElement("td");
	    var newdiv=document.createElement("div");
        newdiv.id="PrevAge";
        td.appendChild(newdiv);
	    tr.appendChild(td);
    }

    tbody.appendChild(tr);

    var tr = document.createElement("tr");
    tr.innerHTML = "<th>赛季</th><th>年龄</th><th>SI</th><th>回收身价</th><th>工资/收益</th><th>最高挂牌价</th>";
    tbody.appendChild(tr);

    var tr = document.createElement("tr");

    var td = document.createElement("td");
    var newdiv=document.createElement("div");
    var p=document.createElement("d");
    p.id="Season";
    p.innerHTML=Season+","+session
	newdiv.appendChild(p);
	td.appendChild(newdiv);
	tr.appendChild(td);

    var td = document.createElement("td");
    var newdiv=document.createElement("div");
    var p=document.createElement("d");
    p.id="CurrAge";
    p.innerHTML=year+","+months.substr(2);
	newdiv.appendChild(p);
	td.appendChild(newdiv);
	tr.appendChild(td);

    var td = document.createElement("td");
	var newdiv=document.createElement("div");
	var p=document.createElement("d");
	p.id="CurrSI";
	p.innerHTML=addCommas(SI);
	newdiv.appendChild(p);
	td.appendChild(newdiv);
	tr.appendChild(td);

    var td = document.createElement("td");
	var newdiv=document.createElement("div");
	var p=document.createElement("d");
	p.id="CurrBankPrice";
	p.innerHTML=CalcBankPrice(AgeMonths, SI, RetireStatus, positionIndex == 13);
	newdiv.appendChild(p);
	td.appendChild(newdiv);
	tr.appendChild(td);

    var td = document.createElement("td");
	var newdiv=document.createElement("div");
	var p=document.createElement("d");
    var wage = new String(gettr[4].getElementsByTagName("span")[0].innerHTML).replace(/,/g, "");
    var totWage = wage*NumTrainings.value;
	p.id="totWage";
	p.innerHTML=addCommas(totWage);
	newdiv.appendChild(p);
	td.appendChild(newdiv);
	tr.appendChild(td);

	var td = document.createElement("td");
	var newdiv=document.createElement("div");
	var p=document.createElement("d");
	p.id="CurrMaxPrice";
	p.innerHTML=CalcMaxPrice(gettr[2].getElementsByTagName("td")[0].innerHTML, SI, RetireStatus);
	newdiv.appendChild(p);
	td.appendChild(newdiv);
	tr.appendChild(td);
    tbody.appendChild(tr);

    var tr = document.createElement("tr");
    tr.id = "HiddenTR";
    tr.style.display="none";
    var td = document.createElement("td");
    var newdiv=document.createElement("div");
	var p=document.createElement("d");
    p.id="Season2";
	newdiv.appendChild(p);
	td.appendChild(newdiv);
	tr.appendChild(td);

    var td = document.createElement("td");
    var newdiv=document.createElement("div");
	var p=document.createElement("d");
    p.id="Age2";
	newdiv.appendChild(p);
	td.appendChild(newdiv);
	tr.appendChild(td);

    var td = document.createElement("td");
	var newdiv=document.createElement("div");
	var p=document.createElement("d");
	p.id="FinalSI";

    var pIdx=document.createElement("input");
	pIdx.name="PosIdx";
	pIdx.type="hidden";
	pIdx.value=positionIndex;
	newdiv.appendChild(p);
	newdiv.appendChild(pIdx);
	td.appendChild(newdiv);
	tr.appendChild(td);

	var td = document.createElement("td");
	var newdiv=document.createElement("div");
	var p=document.createElement("d");
	p.id="FinalBankPrice";

	var pIdx=document.createElement("input");
	pIdx.name="AgeNow";
	pIdx.type="hidden";
    if (RetireStatus == true) { pIdx.value="-";
    } else { pIdx.value=AgeMonths; }
	newdiv.appendChild(p);
	newdiv.appendChild(pIdx);
	td.appendChild(newdiv);
    tr.appendChild(td);

    var td = document.createElement("td");
	var newdiv=document.createElement("div");
	var p=document.createElement("d");
	p.id="bankGain";
    newdiv.appendChild(p);
	td.appendChild(newdiv);
    tr.appendChild(td);

    var td = document.createElement("td");
	var newdiv=document.createElement("div");
	var p=document.createElement("d");
	p.id="FinalMaxPrice";
    newdiv.appendChild(p);
	td.appendChild(newdiv);
    tr.appendChild(td);
    tbody.appendChild(tr);

    table4.appendChild(tbody);
    th.appendChild(table4);
    newTr.appendChild(th);
    playerTable.appendChild(newTr);

    if (teamid == myBteam) teamid = myTeam;
    var url = "https://trophymanager.com/stadium/"+teamid;
    get_information(url, function(text) {
    var AllLevels = String(text.match(/"level":\d+/gm));
    AllLevels = String(AllLevels.match(/\d+/gm));
    var levels = AllLevels.split(/,/gm);
    var TGlev = levels[11];
    var TG=document.getElementById("TG1");
    TG.innerHTML+= "(训练等级 "+TGlev+")";
    });

    if (teamid != myTeam && teamid != myBteam) {
        var my_url = "https://trophymanager.com/stadium/"
        get_information(my_url, function(text) {
        var AllLevels = String(text.match(/"level":\d+/gm));
        AllLevels = String(AllLevels.match(/\d+/gm));
        var levels = AllLevels.split(/,/gm);
        var TGlev = levels[11];
        var TG = document.getElementById("TG1");
        var TG2 = document.getElementById("TG2");
        var tg1 = TG.textContent.match(/\d+/gm);
        var Ti = document.getElementsByName("NewTI")[0];
        var eqTI = funFix1(Ti.value/(tg1*5+50)*(TGlev*5+50));
        TG2.innerHTML += "<nobr><span style='text-transform:none;'>我的训练基地</span></nobr><br><input id='myTgTI' class='embossed' style='text-align:center;margin-bottom:5px;background-color:#3d5623;' size='1' value='"+eqTI+"' disabled>";
        });
    }
}
function DoCalcNewASI() {
var hiddTR = document.getElementById("HiddenTR");
hiddTR.style.display = ("table-row");
var Ti=document.getElementsByName("NewTI")[0];
var NumTr=document.getElementsByName("NumTrainings")[0];
var SI=document.getElementById("CurrSI").innerHTML.replace(/,/g, "");
var NewSeason=document.getElementById("Season2");
var NewAge=document.getElementById("Age2");
var FinTi=document.getElementById("FinalSI");
var FinalBP=document.getElementById("FinalBankPrice");
var FinalMP=document.getElementById("FinalMaxPrice");
var posIdx=document.getElementsByName("PosIdx")[0];
var AgeNow=document.getElementsByName("AgeNow")[0];
var bnkGain=document.getElementById("bankGain");
var tWage=document.getElementById("totWage");
var pAgeTI=document.getElementById("PrevAge");
var wage = new String(gettr[4].getElementsByTagName("span")[0].innerHTML).replace(/,/g, "");
if (posIdx.value != 13) {
   var AllSkills = Math.pow(SI * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7);
   } else {
   var AllSkills = Math.pow(SI * Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7), 1/7)/14*11;
   }
   AllSkills = AllSkills + (NumTr.value * Ti.value / 10);
AllSkils = funFix1(AllSkills);
if (posIdx.value != 13) {
   FinSi = Math.pow(AllSkills, 7)/(Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
   } else {
   FinSi = Math.pow(AllSkills / 11 * 14, 7) /(Math.pow(2, 9) * Math.pow(5, 4) * Math.pow(7, 7));
   }
var Age2 = (AgeNow.value*1 + NumTr.value*1);
var year2 = String(Age2/12).substr(0, 2);
var months2 = Math.round(Age2%12);
var Ss2 = Season*12+session*1+NumTr.value*1;
var Season2 = parseInt(Ss2/12);
var Week2 = Math.round(Ss2%12);
var twg=wage*NumTr.value;
tWage.innerHTML = addCommas(twg);
NewAge.innerHTML = year2+","+months2;
NewSeason.innerHTML = Season2+","+Week2;
FinTi.innerHTML = addCommas(Math.round(FinSi));
var FBP=CalcBankPrice(AgeNow.value*1 + NumTr.value*1, FinSi, false, posIdx.value == 13);
FinalBP.innerHTML = FBP;
var totGain = (FBP.replace(/,/g, "")-twg-6*FBP.replace(/,/g, "")/100).toFixed(0);
bnkGain.innerHTML = addCommas(totGain);
FinalMP.innerHTML = CalcMaxPrice(year2+","+months2, FinSi, false);
if (prvTI == 1 && AverageTI != null && session > 0 && (1+parseInt(month))<session) {
   var pTI = funFix1((Math.floor(AverageTI*session)-Ti.value*(1+parseInt(month)))/(session-(1+parseInt(month))));
   var pAge = year-1;
   var cSess = 1+parseInt(month);
   var pSess = session-cSess;
   pAgeTI.innerHTML = pAge+"<span style='text-transform:lowercase;'> 岁</span> TI<br><input class='embossed' style='text-align:center;margin-bottom:5px;background-color:#3d5623;display:inline-block;' size='1' value='"+pTI+"' disabled><span style='text-transform:lowercase;font-weight:normal;'> x"+pSess+"</span>";
}
if (teamid != myTeam && teamid != myBteam) {
        var my_url = "https://trophymanager.com/stadium/"
        get_information(my_url, function(text) {
        var AllLevels = String(text.match(/"level":\d+/gm));
        AllLevels = String(AllLevels.match(/\d+/gm));
        var levels = AllLevels.split(/,/gm);
        var TGlev = levels[11];
        var TG = document.getElementById("TG1");
        var TG2 = document.getElementById("TG2");
        var tg1 = TG.textContent.match(/\d+/gm);
        var Ti = document.getElementsByName("NewTI")[0];
        var eqTInew = funFix1(Ti.value/(tg1*5+50)*(TGlev*5+50));
        var myTgTI=document.getElementById("myTgTI");
        myTgTI.value = eqTInew;
        });
    }
}
;}, 100);