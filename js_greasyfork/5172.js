// ==UserScript==
// @name        Mush Profile Analyser
// @namespace   Mush Profile Analyser
// @description Analyses the profile of a Mush player
// @include     http://mush.twinoid.com/u/profile/*
// @include     http://mush.twinoid.com/me
// @version     1.2.4
// @downloadURL https://update.greasyfork.org/scripts/5172/Mush%20Profile%20Analyser.user.js
// @updateURL https://update.greasyfork.org/scripts/5172/Mush%20Profile%20Analyser.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery;

var scriptVersion = '1.2.4';

function addGlobalStyle(string){
        if(/microsoft/i.test(navigator.appName) && 
!/opera/i.test(navigator.userAgent)){
            document.createStyleSheet().cssText=string;
        }
        else {
            var ele=document.createElement('link');
            ele.rel='stylesheet';
            ele.type='text/css';
            ele.href='data:text/css;charset=utf-8,'+escape(string);
            document.getElementsByTagName('head')[0].appendChild(ele);
        }
}

addGlobalStyle('\
div.analyseProfile ul { float: left; background-color: #2E3B92; border-radius: 3px 3px 3px 3px;  border-style: solid; display: inline-block;  margin: 15px 4px; padding: 9px;  } \
div.analyseProfile ul li { font-weight: bold; text-align: center;   } \
');

function charaToClassChar(str)
{
	str = str.toLowerCase();
	str = str.replace(' ', '_');
	
	return str;
}

function Analyse_AddTable(n)
{	
	var infos = Analyse_Analyse(n);
	if(n == 0) { var txtN = 'All flights analysed'; } else { var txtN = n + ' flights analysed'; } 
	
	var tabHtml = '\
		<div id="AnalyseProfile_Result" class="bgtablesummar">\
			<div class="twinstyle"> \
				<h3> \
					<div class="cornerright"> \
						Script "Mush Profile Analyser v' + scriptVersion + ' - ' + txtN + ' - <a style="cursor: pointer;" id="AnalyseProfile_defineN">Edit number</a>" \
					</div> \
				</h3>';
				
		//Infos globales
			//Nbr de parties
			tabHtml += '<div class="analyseProfile">';
			tabHtml += '<div style="float: left; display: inline-block; width: 30px;"> <span style="visibility: hidden;">42</span> </div><ul><li>Flights played : ' + infos['nbrGames'] + '</li> ';
				if(infos['nbrGamesBeta'] > 0)
				{
					tabHtml += '<li><img src="http://mush.vg/img/icons/ui/beta.png" /> Additional Beta flights : ' + infos['nbrGamesBeta'] + '</li>';
				}
				
			//Jours de jeu
			tabHtml += '<br /><li><img src="http://mush.vg/img/icons/ui/calendar.png" / > Days played : ' + infos['totalDay'] + '</li> ';
			tabHtml += '<li><img src="http://mush.vg/img/icons/ui/calendar.png" /> Average life expectancy : <em>' + (infos['totalDay']/infos['nbrGames']).toFixed(2) + '</em></li>';
			
			//Triomphe
			tabHtml += '<br /><li><img src="http://mush.vg/img/icons/ui/triumph.png" / > Total Glory : ' + infos['totalTriumph'] + '</li> ';
			tabHtml += '<li><img src="http://mush.vg/img/icons/ui/triumph.png" /> Average Glory : <em>' + (infos['totalTriumph']/infos['nbrGames']).toFixed(2) + '</em></li></ul>';
		
		//Recherches et Projets
			//Recherches
			tabHtml += '<ul><li><img src="http://mush.vg/img/icons/ui/microsc.png" /> Total Research : ' + infos['totalSearch'] + '</li> ';
			tabHtml += '<li><img src="http://mush.vg/img/icons/ui/research_done.png" /> Average Research : <em>' + (infos['totalSearch']/infos['nbrGames']).toFixed(2) + '</em></li>';

			//Projets
			tabHtml += '<br /><li><img src="http://mush.vg/img/icons/ui/conceptor.png" / > Total Projects : ' + infos['totalProjects'] + '</li> ';
			tabHtml += '<li><img src="http://mush.vg/img/icons/ui/projects_done.png" /> Average Projects : <em>' + (infos['totalProjects']/infos['nbrGames']).toFixed(2) + '</em></li></ul>';
		
		//Scan et explo
			//Recherches
			tabHtml += '<ul><li><img src="http://mush.vg/img/icons/ui/planet.png" /> Total planets : ' + infos['totalPlanetsScan'] + '</li> ';
			tabHtml += '<li><img src="http://mush.vg/img/icons/ui/planet_complete.png" /> Average Planets : <em>' + (infos['totalPlanetsScan']/infos['nbrGames']).toFixed(2) + '</em></li>';

			//Projets
			tabHtml += '<br /><li><img src="http://mush.vg/img/icons/ui/survival.png" / > Total Expos : ' + infos['totalExplo'] + '</li> ';
			tabHtml += '<li><img src="http://mush.vg/img/icons/ui/survival.png" /> Average Expos : <em>' + (infos['totalExplo']/infos['nbrGames']).toFixed(2) + '</em></li></ul>';
			
		
		tabHtml += '<div style="clear: both;"></div> \
		<div style="float: left; display: inline-block; width: 125px;"> <span style="visibility: hidden;">42</span> </div> \
		<table style="display: inline-block; float: left;" class="summar"> \
				<caption>Characters</caption> \
				<tbody> \
					<tr>\
						<th>Character</th> \
						<th>Flights played</th> \
					</tr> ';
					
			for(var c in infos['charaSorted'])
			{
				var l = infos['charaSorted'][c].length;
				for(var k =0; k < l; k++)
				{
					tabHtml += '\
					<tr> \
						<td><img class="char ' + charaToClassChar(infos['charaSorted'][c][k][1]) + '" src="/img/design/pixel.gif"> <span class="charname">' + infos['charaSorted'][c][k][1] + '</span></td> \
						<td>' + infos['charaSorted'][c][k][0] + ' (<em>' + (100*infos['charaSorted'][c][k][0]/infos['nbrGames']).toFixed(2) + '</em>%)</td> \
					</tr>';
				}
			} 
			tabHtml += '\
				</tbody> \
			</table> \
			<table style="display: inline-block; float: left;" class="summar"> \
				<caption>Deaths</caption> \
				<tbody> \
					<tr>\
						<th>Cause of death</th> \
						<th>Number of times</th> \
					</tr> \
				';
			for(var d in infos['deathSorted'])
			{
				var l = infos['deathSorted'][d].length;
				for(var k =0; k < l; k++)
				{
					tabHtml += '\
					<tr> \
						<td>' + infos['deathSorted'][d][k][1] + '</td> \
						<td>' + infos['deathSorted'][d][k][0] + ' (<em>' + (100*infos['deathSorted'][d][k][0]/infos['nbrGames']).toFixed(2) + '</em>%)</td> \
					</tr>';
				}
			}
		tabHtml += '\
				</tbody> \
			</table> \
			<div style="clear: both;"></div> ';
		
	tabHtml += '\
			</div> \
		</div> \
	';
	
	/* tabHtml += '\
	<div class="bgtablesummar">\
		<div class="twinstyle"> \
			<h3> \
				<div class="cornerright"> \
					Script "Mush Analyse Profile v' + scriptVersion + '" \
				</div> \
			</h3>\
			<table class="summar"> \
				<caption>Infos joueurs et vaisseaux</caption> \
				<tbody> \
					<tr>\
						<th>Nombre de parties</th> \
						<th>Jours cumulÃ©s</th> \
						<th>Jour moyen</th> \
						<th>Triomphe cumulÃ©</th> \
						<th>Triomphe moyen</th> \
						<th>Recherches cumulÃ©es</th> \
						<th>Recherches moyennes</th> \
						<th>Projets cumulÃ©s </th> \
						<th>Projets moyens</th> \
					</tr> \
					<tr>';
					if(infos['nbrGamesBeta'] > 0)
					{
						tabHtml += '<td>' + infos['nbrGames'] + ' <br /> + Beta : ' + infos['nbrGamesBeta'] + '</td>';
					}
					else
					{
						tabHtml += '<td>' + infos['nbrGames'] + '</td>';
					}
						tabHtml += '<td>' + infos['totalDay'] + '</td> \
						<td>' + (infos['totalDay']/infos['nbrGames']).toFixed(2) + '</td> \
						<td>' + infos['totalTriumph'] + '</td> \
						<td>' + (infos['totalTriumph']/infos['nbrGames']).toFixed(2) + '</td> \
						<td>' + infos['totalSearch'] + '</td> \
						<td>' + (infos['totalSearch']/infos['nbrGames']).toFixed(2) + '</td> \
						<td>' + infos['totalProjects'] + '</td> \
						<td>' + (infos['totalProjects']/infos['nbrGames']).toFixed(2) + '</td> \
					</tr> \
				</tbody> \
			</table> \
			<br /><br /> \
			<table class="summar"> \
				<caption>Infos joueurs et vaisseaux</caption> \
				<tbody> \
					<tr>\
						<th>PlanÃ¨tes scannÃ©es cumulÃ©es</th> \
						<th>PlanÃ¨tes scannÃ©es moyennes</th> \
						<th>Explorations cumulÃ©es</th> \
						<th>Explorations moyennes</th> \
					</tr> \
					<tr> \
						<td>' + infos['totalPlanetsScan'] + '</td> \
						<td>' + (infos['totalPlanetsScan']/infos['nbrGames']).toFixed(2) + '</td> \
						<td>' + infos['totalExplo'] + '</td> \
						<td>' + (infos['totalExplo']/infos['nbrGames']).toFixed(2) + '</td> \
					</tr> \
				</tbody> \
			</table> \
			<br /> \
			<table style="display: inline-block; float: left;" class="summar"> \
				<caption>Personnages</caption> \
				<tbody> \
					<tr>\
						<th>Personnage</th> \
						<th>Parties jouÃ©es</th> \
					</tr> \
				';
			for(var c in infos['charaSorted'])
			{
				var l = infos['charaSorted'][c].length;
				for(var k =0; k < l; k++)
				{
					//alert('L : ' + l + ' | K : ' + k + ' | NbrG : ' + infos['charaSorted'][c][k][0] + ' | Chara : ' + infos['charaSorted'][c][k][1]);
					tabHtml += '\
					<tr> \
						<td><img class="char ' + infos['charaSorted'][c][k][1].toLowerCase() + '" src="/img/design/pixel.gif"> <span class="charname">' + infos['charaSorted'][c][k][1] + '</span></td> \
						<td>' + infos['charaSorted'][c][k][0] + ' (<em>' + (100*infos['charaSorted'][c][k][0]/infos['nbrGames']).toFixed(2) + '</em>%)</td> \
					</tr>';
				}
			} 
			tabHtml += '\
				</tbody> \
			</table> \
			<table style="display: inline-block; float: left;" class="summar"> \
				<caption>Morts</caption> \
				<tbody> \
					<tr>\
						<th>Cause de mort</th> \
						<th>Nombre de dÃ©cÃ¨s</th> \
					</tr> \
				';
			for(var d in infos['deathSorted'])
			{
				var l = infos['deathSorted'][d].length;
				for(var k =0; k < l; k++)
				{
					tabHtml += '\
					<tr> \
						<td>' + infos['deathSorted'][d][k][1] + '</td> \
						<td>' + infos['deathSorted'][d][k][0] + ' (<em>' + (100*infos['deathSorted'][d][k][0]/infos['nbrGames']).toFixed(2) + '</em>%)</td> \
					</tr>';
				}
			}
	tabHtml += '\
				</tbody> \
			</table> \
			<div style="clear: both;"></div> \
		</div> \
	</div> \
	'; */
	
	$('#profile > div.column2 > div.data > .bgtablesummar:first').after(tabHtml);
	
	$('#AnalyseProfile_defineN').click(function() {
		var n = prompt("Number of flights to analyse (0 = all) ?");
		Analyse_Init(n);
		return false;
	});
}

function Analyse_Analyse(n)
{
	var infos = new Array();
	infos['totalDay'] = 0;
	infos['totalSearch'] = 0;
	infos['totalProjects'] = 0;
	infos['totalPlanetsScan'] = 0;
	infos['totalExplo'] = 0;
	infos['totalTriumph'] = 0;
	infos['allDeaths'] = new Array();
	infos['allCharacters'] = new Array();
	
	infos['nbrGames'] = 0 ; //Nbr de parties
	infos['nbrGamesBeta'] = 0; //Parties en Beta
	
	$('#cdTrips > table.summar > tbody > tr.cdTripEntry').each(function(index,elem){
		//Character, Day, Explo, search, projets, scan, titres, triomphe, mort, vaisseau
		var death = $(this).children('td:eq(8)').text();
		
		if(n == 0 || infos['nbrGames'] < n)
		{
			if(death != 'No medlab available')
			{
				infos['nbrGames']++;
				
				if(infos['allDeaths'][death] > 0)
				{
					infos['allDeaths'][death]++;
				}
				else
				{
					infos['allDeaths'][death] = 1;
				}
				
				var character = $(this).children('td:eq(0)').children('span.charname').text();
				
				if(infos['allCharacters'][character] > 0)
				{
					infos['allCharacters'][character]++;
				}
				else
				{
					infos['allCharacters'][character] = 1;
				}
				
				var d = $(this).children('td:eq(1)').text();
				infos['totalDay'] += parseInt(d);
				
				var e = $(this).children('td:eq(2)').text();
				infos['totalExplo'] += parseInt(e);
				
				var s = $(this).children('td:eq(3)').text();
				infos['totalSearch'] += parseInt(s);
				
				var p = $(this).children('td:eq(4)').text();
				infos['totalProjects'] += parseInt(p);
				
				var sc = $(this).children('td:eq(5)').text();
				infos['totalPlanetsScan'] += parseInt(sc);
				
				var t = $(this).children('td:eq(7)').text();
				infos['totalTriumph'] += parseInt(t);
			}
			else
			{
				infos['nbrGamesBeta']++;
			}
		}
			
	}); 
	
	//Trie morts/persos
	infos['charaSorted'] = new Array();
	for(var c in infos['allCharacters'])
	{
		infos['charaSorted'][infos['allCharacters'][c]] = new Array();
	}
	
	for(var c in infos['allCharacters'])
	{
		infos['charaSorted'][infos['allCharacters'][c]].push(new Array(infos['allCharacters'][c], c));
	}
	
	infos['charaSorted'].sort(function(a,b){return a - b});
	
	infos['deathSorted'] = new Array();
	for(var d in infos['allDeaths'])
	{
		infos['deathSorted'][infos['allDeaths'][d]] = new Array();
	}
	
	for(var d in infos['allDeaths'])
	{
		infos['deathSorted'][infos['allDeaths'][d]].push(new Array(infos['allDeaths'][d], d));
	}
	
	infos['deathSorted'].sort(function(a,b){return a - b});
	
	
	return infos;
}

var TrueStats = function() {
    this.looper();
};

TrueStats.prototype.looper = function(opts) {
    opts = opts || this.opts || {};
    opts.selector = opts.selector || '.tid_goalListWrapper';
    opts.callback = opts.callback || this.init;
    this.opts = opts;
    this.wrapper = document.querySelector(opts.selector);
    if (!this.wrapper) {
        window.setTimeout(this.looper.bind(this), 500);
    }
    else {
        this.opts.callback.call(this);
    }
};

TrueStats.prototype.init = function() {
    var rows = this.wrapper.querySelectorAll('tr');
    this.stats = {};
    this.stats.ian =
	this.stats.gioele =
    this.stats.raluca =
    this.stats.roland =
    this.stats.paola =
    this.stats.stephen =
    this.stats.frieda =
    this.stats.chun =
    this.stats.eleesha =
    this.stats.hua =
    this.stats.finola =
    this.stats.chao =
    this.stats.derek =
    this.stats.andie =
    this.stats.janice =
    this.stats.jinsu =
    this.stats.kuanti =
    this.stats.terrence =
    this.stats.mush = 0;
	this.rowStepper = this.rowStepper.bind(this);
    Array.prototype.forEach.call(rows, this.rowStepper);
    this.injectStats();
};

TrueStats.prototype.rowStepper = function(el) {
    var cells = el.querySelectorAll('td');
    var text = cells[1].textContent.trim();
    var value = parseInt(cells[2].textContent.slice(1), 10);
    switch (text) {
        case 'PILGRED IS BACK!':
            this.bump('pilgred', value);
            break;
        case 'Sol':
            this.bump('sol', value);
            break;
        case 'Day 20 Reached':
            this.bump('day20', value);
            break;
        case 'Day 15 Reached':
            this.bump('day15', value);
            break;
        case 'Day 10 Reached':
            this.bump('day10', value);
            break;
        case 'Day 5 Reached':
            this.bump('day5', value);
            break;
        case 'Eden, the promised land':
            this.bump('eden', value);
            break;
        case 'You have already supported your community by sending a gift to another player, bravo!':
            this.bump('gift', value);
            break;
        case 'Supporter':
            this.bump('supporter', value);
            break;
        case 'Number of cycles spent cultivating psychotropic plants':
            this.bump('ian', Math.floor(value/8));
            break;
        case 'Number of cycles won contemplating your work':
            this.bump('kuanti', Math.floor(value/8));
            break;
        case 'Number of cycles won running round in circles':
            this.bump('roland', Math.floor(value/8));
            break;
        case 'Number of turns spent counting your cash':
            this.bump('gioele', Math.floor(value/8));
            break;
        case 'Number of cycles spent surfing the lowest frequencies':
            this.bump('paola', Math.floor(value/8));
            break;
        case 'Number of cycles won, spent with the others':
            this.bump('hua', Math.floor(value/8));
            break;
        case 'Number of cycles spent stroking your cat':
            this.bump('raluca', Math.floor(value/8));
            break;
        case 'Number of cycles spent honoring the SDF.':
            this.bump('andie', Math.floor(value/8));
            break;
        case 'Number of cycles spent as an intergalactic Don Juan.':
            this.bump('derek', Math.floor(value/8));
            break;
        case 'Number of cycles spent fungifying in a dark corner':
            this.bump('mush', Math.floor(value/8));
            break;
        case 'Number of cycles spent fixing your barnet fair.':
            this.bump('eleesha', Math.floor(value/8));
            break;
        case 'Number of cycles won reading the cards':
            this.bump('frieda', Math.floor(value/8));
            break;
        case 'Number of cycles won... listening to others':
            this.bump('janice', Math.floor(value/8));
            break;
        case "Number of cycles you've spent providing blood samples":
            this.bump('chun', Math.floor(value/8));
            break;
        case 'Number of cycles examining the infinitely small':
            this.bump('finola', Math.floor(value/8));
            break;
        case 'Number of cycles won playing as the chief':
            this.bump('jinsu', Math.floor(value/8));
            break;
        case 'Number of cycles spent taking stuff out':
            this.bump('chao', Math.floor(value/8));
            break;
        case 'Number of cycles spent sulking in a corner.':
            this.bump('terrence', Math.floor(value/8));
            break;
        case 'Number of cycles spent cooking up suspect dishes':
            this.bump('stephen', Math.floor(value/8));
            break;
        case 'Infected':
            this.bump('mushDays', Math.floor(value));
            break;
        case 'Researcher':
            this.bump('research', Math.floor(value));
            break;
        case 'Explorer':
            this.bump('expo', Math.floor(value));
            break;
        case 'Planets Detected':
            this.bump('planet', Math.floor(value));
            break;
        
        default:
            //console.log(text);
            break;
    }
};

TrueStats.prototype.bump = function(stat, num) {
    this.stats[stat] = this.stats[stat] || 0;
    this.stats[stat] += num;
};

TrueStats.prototype.injectStats = function() {
    var results = document.querySelector('.analyseProfile'),
        uls = results.querySelectorAll('ul'),
        daysWrap = uls[0],
        daysPlayed = daysWrap.querySelectorAll('li')[2],
        daysAlive = document.createElement('li'),
        researchWrap = uls[1],
        researchDone = researchWrap.querySelectorAll('li')[1],
        researchPersonally = document.createElement('li'),
        expoWrap = uls[2],
        planetsDone = expoWrap.querySelectorAll('li')[1],
        planetsPersonally = document.createElement('li'),
        expoDone = expoWrap.querySelectorAll('li')[3],
        expoPersonally = document.createElement('li'),
        mushRow = document.createElement('tr'),
        charTable = results.querySelector('table.summar'),
        charRows = charTable.querySelectorAll('tr'),
        totals = this.stats.ian
    		   + this.stats.gioele
    		   + this.stats.raluca
    		   + this.stats.roland
    		   + this.stats.paola
    		   + this.stats.stephen
    		   + this.stats.frieda
    		   + this.stats.chun
    		   + this.stats.eleesha
    		   + this.stats.hua
    		   + this.stats.finola
    		   + this.stats.chao
    		   + this.stats.derek
    		   + this.stats.andie
    		   + this.stats.janice
    		   + this.stats.jinsu
    		   + this.stats.kuanti
    		   + this.stats.terrence;
    daysAlive.innerHTML = '<img src="http://mush.vg/img/icons/ui/calendar.png"> Days alive : ' + totals;
    researchPersonally.innerHTML = '<img src="http://mush.vg/img/icons/ui/research_done.png"> Research finished : ' + (this.stats.research || 0);
    planetsPersonally.innerHTML = '<img src="http://mush.vg/img/icons/ui/planet_complete.png"> Personally detected : ' + (this.stats.planet || 0);
    expoPersonally.innerHTML = '<img src="http://mush.vg/img/icons/ui/survival.png"> Personal expos : ' + (this.stats.expo || 0);
    daysWrap.insertBefore(daysAlive, daysPlayed);
    researchWrap.insertBefore(researchPersonally, researchDone);
    expoWrap.insertBefore(planetsPersonally, planetsDone);
    expoWrap.insertBefore(expoPersonally, expoDone);
    Array.prototype.forEach.call(charRows, this.injectStepper.bind(this));
    mushRow.innerHTML = '<td><img class="char mush" src="/img/design/pixel.gif"><span class="charname">Mush</span></td><td>' + this.stats.mushDays + '</td><td>' + this.stats.mush + '</td>';
    charTable.appendChild(mushRow);
};

TrueStats.prototype.injectStepper = function(el, i) {
    var inject = document.createElement('td'),
        charName;
    if (i === 0) {
        inject = document.createElement('th');
        inject.innerText = 'Days alive';
    }
    else {
        charName = el.querySelector('.charname').textContent.toLowerCase().split(' ').join('');
        inject.textContent = this.stats[charName]; 
    }
    el.appendChild(inject);
}

function Analyse_Init(n)
{
	if(n < 0) { n = 0; }
	
	$('#AnalyseProfile_Result').remove();
	
	Analyse_AddTable(n);
	//alert('Test');
    var trueStats = new TrueStats();
}

Analyse_Init(0);