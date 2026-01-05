(function(){
// coding: utf-8
// ==UserScript==
// @author		Ecilam
// @name		Blood Wars Analyse RC
// @version		2015.06.01
// @namespace	BWARC
// @description	Ce script analyse les combats sur Blood Wars.
// @copyright   2012-2014, Ecilam
// @license     GPL version 3 ou suivantes; http://www.gnu.org/copyleft/gpl.html
// @homepageURL https://github.com/Ecilam/BloodWarsAnalyseRC
// @supportURL  https://github.com/Ecilam/BloodWarsAnalyseRC/issues
// @include     /^http:\/\/r[0-9]*\.fr\.bloodwars\.net\/.*$/
// @include     /^http:\/\/r[0-9]*\.bloodwars\.net\/.*$/
// @include     /^http:\/\/r[0-9]*\.bloodwars\.interia\.pl\/.*$/
// @include     /^http:\/\/beta[0-9]*\.bloodwars\.net\/.*$/
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/11554/Blood%20Wars%20Analyse%20RC.user.js
// @updateURL https://update.greasyfork.org/scripts/11554/Blood%20Wars%20Analyse%20RC.meta.js
// ==/UserScript==
"use strict";

function _Type(v){
	var type = Object.prototype.toString.call(v);
	return type.slice(8,type.length-1);
	}
function _Exist(v){
	return _Type(v)!='Undefined';
	}
function clone(o){
	if(typeof o!='object'||o==null) return o;
	var newObjet = o.constructor();
	for(var i in o)	newObjet[i] = clone(o[i]);
	return newObjet;
	}
String.prototype.truncate = function(length){
	if (this.length > length) return this.slice(0, length - 3) + "...";
	else return this;
	};
/******************************************************
* OBJET JSONS - JSON
* - stringification des données
******************************************************/
var JSONS = (function(){
	function reviver(key,v){
		if (_Type(v)=='String'){
			var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(v);
			if (a!=null) return new Date(Date.UTC(+a[1],+a[2]-1,+a[3],+a[4],+a[5],+a[6]));
			}
		return v;
		}
	return {
		_Decode: function(v){
			var r = null;
			try	{
				r = JSON.parse(v,reviver);
				}
			catch(e){
				console.error('JSONS_Decode error :',v,e);
				}
			return r;
			},
		_Encode: function(v){
			return JSON.stringify(v);
			}
		};
	})();

/******************************************************
* OBJET GM - GreaseMonkey Datas Storage
******************************************************/
var GM = (function(){
	return {
		_GetVar: function(key,defaut){
			var v = GM_getValue(key,null);
			return (v!=null?JSONS._Decode(v):defaut);
			},
		_SetVar: function(key,v){
			GM_setValue(key,JSONS._Encode(v));
			return v;
			}
		};
	})();

/******************************************************
* OBJET DOM - Fonctions DOM & QueryString
* -  DOM : fonctions d'accès aux noeuds du document
* - _QueryString : accès aux arguments de l'URL
******************************************************/
var DOM = (function(){
	return {
		_GetNodes: function(path,root){
			return (_Exist(root)&&root==null)?null:document.evaluate(path,(_Exist(root)?root:document), null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			},
		_GetFirstNode: function(path,root){
			var r = this._GetNodes(path,root);
			return (r!=null&&r.snapshotLength>=1?r.snapshotItem(0):null);
			},
		_GetLastNode: function(path, root){
			var r = this._GetNodes(path,root);
			return (r!=null&&r.snapshotLength>=1?r.snapshotItem(r.snapshotLength-1):null);
			},
		_GetFirstNodeTextContent: function(path,defaultValue,root){
			var r = this._GetFirstNode(path,root);
			return (r!=null&&r.textContent!=null?r.textContent:defaultValue);
			},
		_GetFirstNodeInnerHTML: function(path,defaultValue,root){
			var r = this._GetFirstNode(path,root);
			return (r!=null&&r.innerHTML!=null?r.innerHTML:defaultValue);
			},
		_GetLastNodeInnerHTML: function(path,defaultValue,root){
			var r = this._GetLastNode(path,root);
			return (r!=null&&r.innerHTML!=null?r.innerHTML:defaultValue);
			},
		_QueryString: function(key){
			var url = window.location.search,
				reg = new RegExp("[\?&]"+key+"(=([^&$]+)|)(&|$)","i"),
				offset = reg.exec(url);
			if (offset!=null){
				offset = _Exist(offset[2])?offset[2]:true;
				}
			return offset;
			}
		};
	})();

/******************************************************
* OBJET IU - Interface Utilisateur
******************************************************/
var IU = (function(){
	return {
		_CreateElements: function(list){
			var r = {};
			for (var key in list){
				var type = _Exist(list[key][0])?list[key][0]:null,
					attributes = _Exist(list[key][1])?list[key][1]:{},
					content = _Exist(list[key][2])?list[key][2]:[],
					events = _Exist(list[key][3])?list[key][3]:{},
					node = _Exist(r[list[key][4]])?r[list[key][4]]:(_Exist(list[key][4])?list[key][4]:null);
				if (type!=null) r[key] = this._CreateElement(type,attributes,content,events,node);
				}
			return r;
			},
		_CreateElement: function(type,attributes,content,events,node){
			if (_Exist(type)&&type!=null){
				attributes = _Exist(attributes)?attributes:{};
				content = _Exist(content)?content:[];
				events = _Exist(events)?events:{};
				node = _Exist(node)?node:null;
				var r = document.createElement(type);
				for (var key in attributes){
					if (_Type(attributes[key])!='Boolean') r.setAttribute(key,attributes[key]);
					else if (attributes[key]==true) r.setAttribute(key,key.toString());
					}
				for (var key in events){
					this._addEvent(r,key,events[key][0],events[key][1]);
					}
				for (var i=0; i<content.length; i++){
					if (_Type(content[i])==='Object') r.appendChild(content[i]);
					else r.textContent+= content[i];
					}
				if (node!=null) node.appendChild(r);
				return r;
				}
			else return null;
			},
		_addEvent: function(obj,type,fn,par){
			var funcName = function(event){return fn.call(obj,event,par);};
			obj.addEventListener(type,funcName,false);
			},
		};
	})();

/******************************************************
* OBJET L - localisation des chaînes de caractères (STRING) et expressions régulières (RegExp)
******************************************************/
var L = (function(){
	var locStr = {// key:[français,anglais,polonais]
		//DATAS
		"sDeconnecte":
			["Vous avez été déconnecté en raison d`une longue inactivité.",
			"You have been logged out because of inactivity.",
			"Nastąpiło wylogowanie z powodu zbyt długiej bezczynności."],
		"sCourtePause":
			["Une courte pause est en court en raison de l`actualisation du classement général",
			"Please wait a moment while the rankings are being updated.",
			"Trwa przerwa związana z aktualizacją rankingu gry."],
		//INIT
		"sUnknowID":
			["BloodWarsAnalyseRC - Erreur :\n\nLe nom de ce vampire doit être lié à son ID. Merci de consulter la Salle du Trône pour rendre le script opérationnel.\nCe message est normal si vous utilisez ce script pour la première fois ou si vous avez changé le nom du vampire.",
			"BloodWarsAnalyseRC - Error :\n\nThe name of this vampire must be linked to her ID. Please consult the Throne Room to make the script running.\nThis message is normal if you use this script for the first time or if you changed the name of the vampire.",
			"BloodWarsAnalyseRC - Błąd :\n\nNazwa tego wampira musi być związana z jej ID. Proszę zapoznać się z sali tronowej, aby skrypt uruchomiony.\nTo wiadomość jest normalne, jeśli użyć tego skryptu po raz pierwszy lub jeśli zmienił nazwę wampira."],
		// tri
		"sTriUp":["▲"],
		"sTriDown":["▼"],
		"sTriNbTest":["^([0-9]+(?:\\.[0-9]*)?)$"],
		//RC
		"sRCname":["^([^\\(]+)(?: \\(\\*\\))?(?: \\(@\\))?$"],
		"sRCsum1":["(.+)<br>(.+)"],
		"sRCsum2":["([0-9]+) \\/ ([0-9]+)<br>([0-9]+) \\/ ([0-9]+)"],
		"sRCTest":["^([^,]+), ([^,]+)\\.$"],
		"sRCLeft":["^<b[^<>]*>([^<>]+)<\\/b>.+$"],
		"sRCDead":["^<b[^<>]*>([^<>]+)<\\/b> (?:finit|fini) sa (?:non-|)vie sur le champ de bataille\\.$",
				"^<b[^<>]*>([^<>]+)<\\/b> is slain on the battlefield\\.$",
				"^<b[^<>]*>([^<>]+)<\\/b> kończy swoje nie-życie na polu walki\\.$"],
		"sRCRight1":["^<b[^<>]*>([^<>]+)<\\/b> obtient des dommages de <b[^<>]*>(\\d+)<\\/b> PTS DE VIE$",
					"^<b[^<>]*>([^<>]+)<\\/b> takes <b[^<>]*>(\\d+)<\\/b> damage$",
					"^<b[^<>]*>([^<>]+)<\\/b> zostaje (?:zraniony|zraniona) za <b[^<>]*>(\\d+)<\\/b> PKT ŻYCIA$"],
		"sRCRight2":["^<b[^<>]*>([^<>]+)<\\/b> évite le coup$",
					"^<b[^<>]*>([^<>]+)<\\/b> dodges the strike$",
					"^<b[^<>]*>([^<>]+)<\\/b> unika ciosu$"],
		"sRCRight3":["^<b[^<>]*>([^<>]+)<\\/b> effectue une série d`esquives et évite la frappe$",
					"^<b[^<>]*>([^<>]+)<\\/b> performs a series of feints and dodges the strike$",
					"^<b[^<>]*>([^<>]+)<\\/b> wykonuje serię zwodów i unika trafienia$"],
		"sRCCrit":["<b[^<>]*>un coup critique</b>","<b[^<>]*>strikes critically</b>","<b[^<>]*>cios krytyczny</b>"],
		"sRCHeal":["^(?:Une force miraculeuse fait que |)<b[^<>]*>([^<>]+)<\\/b> regagne <b[^<>]*>(\\d+)<\\/b> PTS DE VIE\\.$",
					"^(?:A miraculous power makes |)<b[^<>]*>([^<>]+)<\\/b> regenerate[s]? <b[^<>]*>(\\d+)<\\/b> HP\\.$",
					"^(?:Cudowna siła sprawia, że |)<b[^<>]*>([^<>]+)<\\/b> odzyskuje <b[^<>]*>(\\d+)<\\/b> PKT ŻYCIA\\.$"],
		"sRCLeach":["^<b[^<>]*>([^<>]+)<\\/b> perd <b[^<>]*>(\\d+)<\\/b> PTS DE VIE\\.$",
					"^<b[^<>]*>([^<>]+)<\\/b> loses <b[^<>]*>(\\d+)<\\/b> HP\\.$",
					"^<b[^<>]*>([^<>]+)<\\/b> traci <b[^<>]*>(\\d+)<\\/b> PKT KRWI\\.$"],
		"sRCTitle1":["ANALYSE DU COMBAT","ANALYSIS OF BATTLE","ANALIZA BITWY"],
		"sRCTitle2":["DOMMAGES / MANCHE","DAMAGE / ROUND","SZKÓD / RUNDA"],
		"sRCTitle3":["INITIATIVE / MANCHE","INITIATIVE / ROUND","INICJATYWA / RUNDA"],
		"sRCTFight":["Combat","Fight","Walka"],
		"sRCTAtt":["Attaque","Attack","Atak"],
		"sRCTDmg":["Dommages","Damage","Szkód"],
		"sRCTDef":["Défense","Defence","Obrona"],
		"sRCTPV":["PV","HP","PŻ"],
		"sRCTDead":["Mort","Dead","Martwy"],
		"sRCTName":["Nom","Name","Imię"],
		"sRCTNb":["NB","NB","NM"],
		"sRCTHit":["Hit","Hit","Hit"],
		"sRCTCC":["CC","SC","CK"],
		"sRCTFail":["Raté","Miss","Unik"],
		"sRCTEsq":["Esq","Fei","Zwo"],
		"sRCTtotal":["Total","Total","łączny"],
		"sRCTMin":["Min","Min","Min"],
		"sRCTMax":["Max","Max","Mak"],
		"sRCTMoy":["Moy","Ave","Śre"],
		"sRCTLose":["-"],
		"sRCTWin":["+"],
		"sRCTRd":["Rnd","Rnd","Rnd"],
		"%":["%"]
		};
	var langue; // 0 = français par défaut, 1 = anglais, 2 = polonais
	if (/^http\:\/\/r[0-9]*\.fr\.bloodwars\.net/.test(location.href)) langue = 0;
	else if (/^http\:\/\/r[0-9]*\.bloodwars\.net/.test(location.href)) langue = 1;
	else if (/^http\:\/\/r[0-9]*\.bloodwars\.interia\.pl/.test(location.href)||/^http\:\/\/beta[0-9]*\.bloodwars\.net/.test(location.href)) langue = 2;
	else langue = 0;
	return {
	//public stuff
		// Retourne la chaine ou l'expression traduite.
		// Remplace les éléments $1,$2... par les arguments transmis en complément.
		// Le caractère d'échappement '\' doit être doublé pour être pris en compte dans une expression régulière.
		// ex: "test": ["<b>$2<\/b> a tué $1 avec $3.",]
		// L._Get('test','Dr Moutarde','Mlle Rose','le chandelier'); => "<b>Mlle Rose<\/b> a tué le Dr Moutarde avec le chandelier."
		_Get: function(key){
			var r = locStr[key];
			if (!_Exist(r)) throw new Error("L::Error:: la clé n'existe pas : "+key);
			if (_Exist(r[langue])) r = r[langue];
			else r = r[0];
			for (var i=arguments.length-1;i>=1;i--){
				var reg = new RegExp("\\$"+i,"g");
				r = r.replace(reg,arguments[i]);
				}
			return r;
			}
		};
	})();

/******************************************************
* OBJET DATAS - Fonctions d'accès aux données de la page
* Chaque fonction retourne 'null' en cas d'échec
******************************************************/
var DATAS = (function(){
	return {
	/* données du joueur */
		_PlayerName: function(){
			var playerName = DOM._GetFirstNodeTextContent("//div[@class='stats-player']/a[@class='me']", null);
			return playerName;
			},
		_Royaume: function(){
			var	royaume = DOM._GetFirstNodeTextContent("//div[@class='gameStats']/b[1]", null);
			return royaume;
			},
	/* Données diverses	*/
		_GetPage: function(){
			var p = 'null',
			// message Serveur (à approfondir)
				r = DOM._GetFirstNode("//div[@class='komunikat']");
			if (r!=null){
				var r = DOM._GetFirstNodeTextContent(".//u",r);
				if (r == L._Get('sDeconnecte')) p="pServerDeco";
				else if (r == L._Get('sCourtePause')) p="pServerUpdate";
				else p="pServerOther";
				}
			else{
				var qsA = DOM._QueryString("a"),
					qsDo = DOM._QueryString("do"),
					qsMid = DOM._QueryString("mid"),
					path = window.location.pathname;
				// page extérieur
				if (path!="/"){
					if (path=="/showmsg.php"&&qsA==null&&qsMid!=null) p="pShowMsg";
					}
				// page interne
				// Salle du Trône
				else if (qsA==null||qsA=="main") p="pMain";
				// Page des messages
				else if (qsA=="msg"){
					var qsType = DOM._QueryString("type");
					if (qsDo=="view" && qsMid!=null){
						if (qsType==null||qsType=="1") p="pMsg";
						else if (qsType=="2") p="pMsgSave";
						}
					}
				}
			return p;
			}
		};
	})();

/******************************************************
* OBJET PREF - Gestion des préférences
******************************************************/
var PREF = (function(){
	// préfèrences par défaut
	const index = 'BWARC:O:',
		defPrefs = {'RC':{'sh0':1,'sh1':1,'sh2':1,'sh3':1,'tr1':[1,1],'tr2':[1,1],'tr3':[1,1]}};
	var ID = null, prefs = {};
	return {
		_Init: function(id){
			ID = id;
			prefs = GM._GetVar(index+ID,{});
			},
		_Get: function(grp,key){
			if (_Exist(prefs[grp])&&_Exist(prefs[grp][key])) return prefs[grp][key];
			else if (_Exist(defPrefs[grp])&&_Exist(defPrefs[grp][key]))return defPrefs[grp][key];
			else return null;
			},
		_Set: function(grp,key,v){
			if (ID!=null){
				if (!_Exist(prefs[grp])) prefs[grp] = {};
				prefs[grp][key] = v;
				GM._SetVar(index+ID,prefs);
				}
			},
		};
	})();

/******************************************************
* CSS
******************************************************/
function getCssRules(selector,sheet){
    var sheets = _Exist(sheet)?[sheet]:document.styleSheets;
    for (var i = 0; i<sheets.length; i++){
        var sheet = sheets[i];
		try {
			if(!sheet.cssRules) return null;
			}
		catch(e) {
			if(e.name !== 'SecurityError') throw e;
			return null;
			}
        for (var j=0;j<sheet.cssRules.length;j++){
            var rule = sheet.cssRules[j];
            if (rule.selectorText&&rule.selectorText.split(',').indexOf(selector)!==-1) return rule.style;
			}
		}
    return null;
	}
function SetCSS(){
	const css = [
		".BWARCLeft{text-align: left;}",
		".BWARCRight{text-align: right;}",
		".BWARCMiddle{text-align: center;}",
		".BWARCtri{color:lime;}",
		".BWARCspan{width: 100%;font-weight:700;}",
		".BWARCT{table-layout: fixed;width: 100%;text-align: right;}",
		".BWARCT th{border:thin dotted black;padding:1px;white-space:nowrap;}",
		".BWARCT td{width: 100%;text-overflow: ellipsis;-o-text-overflow: ellipsis;overflow: hidden;padding:1px;white-space:nowrap;}",
		".BWARCbold{font-weight:700;}",
		"#BWARC1c th,#BWARC2c th,#BWARC3c th,.BWARCspan {cursor: pointer;}"],
		head = DOM._GetFirstNode("//head");
	if (head!=null){
		var even = getCssRules('.even'),
			selectedItem = getCssRules('.selectedItem');
		if (even!=null&&selectedItem!=null) css.push('.BWARCeven{'+even.cssText+'}','.BWARCtr:hover{'+selectedItem.cssText+'}');
		IU._CreateElement('style',{'type':'text/css'},[css.join('')],{},head);
		}
	}

/******************************************************
* FUNCTIONS
******************************************************/
function FctTriA(key,order,tbody,list){
	var list2 = [];
	for (var i=0; i<list.snapshotLength; i++){
		var col = DOM._GetFirstNode(".//td["+key+"]",list.snapshotItem(i));
		if (col!=null){
			var v = col.textContent.trim().toLowerCase();
			if (key!=1){
				var r = new RegExp(L._Get('sTriNbTest')).exec(v);
				v = r!=null?parseFloat(r[1]):Number.POSITIVE_INFINITY;
				}
			list2[i]=[v,i];
			}
		}
	list2.sort(function(a,b){return a[0]<b[0]?-1:a[0]==b[0]?0:1;});
	if (order==0) list2.reverse();
	for(var i=0; i<list2.length; i++){
		var r = list.snapshotItem(list2[i][1]);
		r.classList.add('BWARCtr');
		if (i%2==0) r.classList.remove('BWARCeven');
		else r.classList.add('BWARCeven');
		tbody.appendChild(r);
		}
	}
	
function AnalyseRC(){
	function clicRC(e,i){// i= n°RC
		var titre = DOM._GetFirstNode("//span[@id='BWARCspan"+i+"']"),
			table =  DOM._GetNodes("//table[@id='BWARCT"+i+"']");
		if (titre!=null&&table!=null){
			var show = PREF._Get('RC','sh'+i)==1?0:1;
			PREF._Set('RC','sh'+i,show);
			titre.setAttribute('style','color:'+(show==1?'lime;':'red;'));
			for (var k=0;k<table.snapshotLength;k++){table.snapshotItem(k).setAttribute('style','display:'+(show==1?'table;':'none;'))};
			}
		}
	function clickCol(e,i){// i[0]= n°RC, i[1]= col
		var header = DOM._GetNodes("//tr[@id='BWARC"+i[0]+"c']"),
			tbody =  DOM._GetNodes("//tbody[@id='BWARC"+i[0]+"b']");
		if (header!=null&&tbody!=null){
			var tri = PREF._Get('RC','tr'+i[0]);
			tri[1] = (i[1]==tri[0]&&tri[1]==1)?0:1;
			for (var k=0;k<header.snapshotLength;k++){
				var oldCol = DOM._GetFirstNode(".//th["+tri[0]+"]/span",header.snapshotItem(k)),
					newCol = DOM._GetFirstNode(".//th["+i[1]+"]",header.snapshotItem(k));
				if (oldCol!=null&&newCol!=null){
					oldCol.parentNode.removeChild(oldCol);
					IU._CreateElement('span',{'class':'BWARCtri'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},newCol);
					}
				}
			for (var k=0;k<tbody.snapshotLength;k++){
				var list = DOM._GetNodes("./tr",tbody.snapshotItem(k));
				if (list!=null) FctTriA(i[1],tri[1],tbody.snapshotItem(k),list);
				}
			tri[0] = i[1];
			PREF._Set('RC','tr'+i[0],tri);
			}
		}
	function realName(i){
		var r = new RegExp(L._Get('sRCname')).exec(i);
		return (r==null?i:r[1]);
		}
	const defPlay = {'count':1,'cl':null,'init':[],'hit':0,'cc':0,'fail':0,'esq':0,'dmin':null,'rdd':[],
					'dmax':0,'dmg':0,'dnb':0,'dfail':0,'desq':0,'pvlost':0,'pvwin':0,'dead':[]};
	var msgContent = DOM._GetFirstNode("//div[(@class='msg-content ' or @class='msg-content msg-quest')]"),
		versus = DOM._GetNodes(".//table[@class='fight']/tbody/tr[@class='versus']",msgContent),
		RCs = DOM._GetNodes(".//div[(@class='rlc fight' or @class='rlc')]",msgContent),
		summary = DOM._GetNodes(".//div[@class='ambsummary']",msgContent);
	// versus et RCs sont obligatoires, summary uniquement à plusieurs
	if (versus!=null&&RCs!=null&&PREF._Get('RC','sh0')==1){
		for (var k=0;k<versus.snapshotLength;k++){// arène 3v3 avec plusieurs combats
			var RC = RCs.snapshotItem(k);
			if (RC!=null){
				var list = {},
					rounds = DOM._GetNodes("./ul[@class='round']",RC),
					sum1 = DOM._GetLastNodeInnerHTML("./ul[@class='round']/li/div[@class='sum1']",null,RC),
					sum2 = DOM._GetLastNodeInnerHTML("./ul[@class='round']/li/div[@class='sum2']",null,RC);
				// ambu + arène solo
				if (sum1!=null&&sum2!=null){
					var r1 = new RegExp(L._Get('sRCsum1')).exec(sum1),
						r2 = new RegExp(L._Get('sRCsum2')).exec(sum2);
					if (r1!=null&&r2!=null){
						var name1 = realName(r1[1]),
							name2 = realName(r1[2]);
						list[name1] = clone(defPlay); list[name1]['cl'] = 'atkHit';
						list[name2] = clone(defPlay); list[name2]['cl'] = 'defHit';
						if (r2[1]==0) list[name1]['dead'][rounds.snapshotLength-1]=1;
						if (r2[3]==0) list[name2]['dead'][rounds.snapshotLength-1]=1;
						}
					}
				// arène multi, rdc, expé
				else if (summary!=null){
					var	prAtt = DOM._GetNodes("./table/tbody/tr/td[@class='atkHit']/b",summary.snapshotItem(k)),
						prDef = DOM._GetNodes("./table/tbody/tr/td[@class='defHit']/b",summary.snapshotItem(k));
					if (prAtt!=null&&prDef!=null){
						for (var i=0;i<prAtt.snapshotLength;i++){
							var temp = realName(prAtt.snapshotItem(i).textContent);
							if (_Exist(list[temp])) list[temp]['count']++;
							else{list[temp] = clone(defPlay); list[temp]['cl'] = 'atkHit';}
							}
						for (var i=0;i<prDef.snapshotLength;i++){
							var temp = realName(prDef.snapshotItem(i).textContent);
							if (_Exist(list[temp])) list[temp]['count']++;
							else{list[temp] = clone(defPlay); list[temp]['cl'] = 'defHit';}
							}
						}
					}
				// Analyse le RC
				for (var i=0;i<rounds.snapshotLength;i++){
					var round = rounds.snapshotItem(i),
						lignes = DOM._GetNodes("./li",round),
						init = 0;
					for (var j=0;j<lignes.snapshotLength;j++){
						var ligne = lignes.snapshotItem(j),
							ligCla = ligne.getAttribute('class');
						if (ligCla=='playerDeath'){
							var dead = new RegExp(L._Get('sRCDead')).exec(ligne.innerHTML);
							if (dead!=null){
								var name = realName(dead[1]);
								list[name]['dead'][i] = _Exist(list[name]['dead'][i])?list[name]['dead'][i]+1:1;
								}
							}
						else if (ligCla=='atkHit'||ligCla=='defHit'){
							var r = new RegExp(L._Get('sRCTest')).exec(ligne.innerHTML);
							if (r!=null){
								var left = new RegExp(L._Get('sRCLeft')).exec(r[1]);
								if (left!=null){
									var nameL = realName(left[1]),
										tempAtt = list[nameL];
									if (!_Exist(tempAtt['init'][i])){init++; tempAtt['init'][i]=init;}
									var right1 = new RegExp(L._Get('sRCRight1')).exec(r[2]);
									var right2 = new RegExp(L._Get('sRCRight2')).exec(r[2]);
									var right3 = new RegExp(L._Get('sRCRight3')).exec(r[2]);
									if (right1!=null||right2!=null||right3!=null){
										var right = right1!=null?right1:(right2!=null?right2:right3),
											nameR = realName(right[1]),
											tempDef = list[nameR];
										tempDef['dnb']++;
										if (right1!=null){
											if (_Exist(tempAtt['rdd'][i])) tempAtt['rdd'][i] += Number(right[2]);
											else tempAtt['rdd'][i] = Number(right[2]);
											tempDef['pvlost'] += Number(right[2]);
											tempAtt['hit']++;
											tempAtt['dmg'] += Number(right[2]);
											if (new RegExp(L._Get('sRCCrit')).exec(r[1])!=null) tempAtt['cc']++;
											if (tempAtt['dmin']==null||(tempAtt['dmin']!=null&&tempAtt['dmin']>Number(right[2]))) tempAtt['dmin'] = Number(right[2]);
											if (tempAtt['dmax']<Number(right[2])) tempAtt['dmax'] = Number(right[2]);
											}
										else if (right2!=null){tempAtt['fail']++;tempDef['dfail']++;}
										else{tempAtt['esq']++;tempDef['desq']++;}
										if (ligCla=='atkHit'){list[nameL] = tempAtt; list[nameR] = tempDef;}
										else{list[nameR] = tempDef; list[nameL] = tempAtt;}
										}
									}
								}
							}
						else if (ligCla=='heal'){
							var heal = new RegExp(L._Get('sRCHeal')).exec(ligne.innerHTML);
							if (heal!=null) list[realName(heal[1])]['pvwin']+= Number(heal[2]);
							var leach = new RegExp(L._Get('sRCLeach')).exec(ligne.innerHTML);
							if (leach!=null) list[realName(leach[1])]['pvlost']+= Number(leach[2]);
							}
						}
					}
				//"Dommages" total des deux camps (Arènes multis, expés, RDC ou sièges)
				if (summary!=null){
					var sum = DOM._GetFirstNode("./table[@class='fight']/tbody",summary.snapshotItem(k));
					if (sum!=null){
						var totalA = 0, totalD = 0,
							deadA = 0, deadD = 0;
						for (var key in list){
							var	total = 0, dead = 0;
							for (var j=0;j<10;j++){
								total += _Exist(list[key]['rdd'][j])?list[key]['rdd'][j]:0;
								dead += _Exist(list[key]['dead'][j])?list[key]['dead'][j]:0;
								}
							if (list[key]['cl']=='atkHit'){
								totalA += total;
								deadD += dead;
								}
							else{
								totalD += total;
								deadA += dead;
								}
							}
						var ligneIU = {
							'tr':['tr',,,,sum],
							'td01':['td',{'class':'BWARCbold'},[L._Get('sRCTtotal')],,'tr'],
							'td02':['td',{'class':'BWARCbold'},[totalA+' / '+deadA],,'tr'],
							'td03':['td',{'colspan':'2'},,,'tr'],
							'td04':['td',{'class':'BWARCbold'},[L._Get('sRCTtotal')],,'tr'],
							'td05':['td',{'class':'BWARCbold'},[totalD+' / '+deadD],,'tr'],
							'td06':['td',{'colspan':'2'},,,'tr']};
						IU._CreateElements(ligneIU);
						}
					}
				// tableau 3
				var div = DOM._GetFirstNode("//div[@id='BWARCD3']");
				if (k==0){
					var divIU = {'div':['div',{'id':'BWARCD3','style':msgContent.getAttribute('style')}],
					'span':['span',{'class':'BWARCspan','id':'BWARCspan3','style':'color:'+(PREF._Get('RC','sh3')==1?'lime;':'red;')},[L._Get('sRCTitle3')],{'click':[clicRC,'3']},'div']};
					div = msgContent.parentNode.insertBefore(IU._CreateElements(divIU)['div'],msgContent.nextSibling);
					}
				if (div!=null){
					var table3IU = {
						'table':['table',{'class':'BWARCT','id':'BWARCT3','style':'display:'+(PREF._Get('RC','sh3')==1?'table;':'none;')},,,div],
						'thead':['thead',,,,'table'],
						'tr01':['tr',{'class':'tblheader'},,,'thead'],
						'th011':['th',{'class':'BWARCLeft','style':'width:20%'},[L._Get('sRCTFight')+' n°'+(k+1)],,'tr01'],
						'th012':['th',{'class':'BWARCMiddle','style':'width:73%','colspan':'10'},[L._Get('sRCTRd')],,'tr01'],
						'th013':['th',{'style':'width:7%'},,,'tr01'],
						'tr02':['tr',{'id':'BWARC3c','class':'tblheader'},,,'thead'],
						'th021':['th',{'class':'BWARCLeft'},[L._Get('sRCTName')],{'click':[clickCol,[3,1]]},'tr02'],
						'tbody':['tbody',{'id':'BWARC3b'},,,'table']},
						table3 = IU._CreateElements(table3IU);
					for (var i=1;i<=10;i++) IU._CreateElement('th',{'class':'BWARCRight'},[i],{'click':[clickCol,[3,i+1]]},table3['tr02']);
					IU._CreateElement('th',{'class':'BWARCRight'},[L._Get('sRCTMoy')],{'click':[clickCol,[3,12]]},table3['tr02']);
					for (var key in list){
						var ligneIU = {
								'tr':['tr',,,,table3['tbody']],
								'td01':['td',{'class':(list[key]['cl']=='atkHit'?'atkHit':'defHit')+' BWARCLeft BWARCbold'},[key+(list[key]['count']>1?' x'+list[key]['count']:'')],,'tr']},
							ligne = IU._CreateElements(ligneIU),
							init = 0,count = 0;
						for (var j=0;j<10;j++){
							IU._CreateElement('td',{},[_Exist(list[key]['init'][j])?list[key]['init'][j]:'∞'],{},ligne['tr']);
							if (_Exist(list[key]['init'][j])){
								init += list[key]['init'][j];
								count++;
								}
							}
						IU._CreateElement('td',{},[count>0?(init/count).toFixed(1):''],{},ligne['tr']);
						}
					var tri = PREF._Get('RC','tr3'),
						newCol = DOM._GetFirstNode("./th["+tri[0]+"]",table3['tr02']);
					IU._CreateElement('span',{'class':'BWARCtri'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},newCol);
					FctTriA(tri[0],tri[1],table3['tbody'],DOM._GetNodes("./tr",table3['tbody']));
					}
				// tableau 2
				var div = DOM._GetFirstNode("//div[@id='BWARCD2']");
				if (k==0){
					var divIU = {'div':['div',{'id':'BWARCD2','style':msgContent.getAttribute('style')},,,msgContent.parentNode],
					'span':['span',{'class':'BWARCspan','id':'BWARCspan2','style':'color:'+(PREF._Get('RC','sh2')==1?'lime;':'red;')},[L._Get('sRCTitle2')],{'click':[clicRC,'2']},'div']};
					div = msgContent.parentNode.insertBefore(IU._CreateElements(divIU)['div'],msgContent.nextSibling);
					}
				if (div!=null){
					var table2IU = {
						'table':['table',{'class':'BWARCT','id':'BWARCT2','style':'display:'+(PREF._Get('RC','sh2')==1?'table;':'none;')},,,div],
						'thead':['thead',,,,'table'],
						'tr01':['tr',{'class':'tblheader'},,,'thead'],
						'th011':['th',{'class':'BWARCLeft','style':'width:20%'},[L._Get('sRCTFight')+' n°'+(k+1)],,'tr01'],
						'th012':['th',{'class':'BWARCMiddle','style':'width:73%','colspan':'10'},[L._Get('sRCTRd')],,'tr01'],
						'th013':['th',{'style':'width:7%'},,,'tr01'],
						'tr02':['tr',{'id':'BWARC2c','class':'tblheader'},,,'thead'],
						'th021':['th',{'class':'BWARCLeft'},[L._Get('sRCTName')],{'click':[clickCol,[2,1]]},'tr02'],
						'tbody':['tbody',{'id':'BWARC2b'},,,'table']},
						table2 = IU._CreateElements(table2IU);
					for (var i=1;i<=10;i++) IU._CreateElement('th',{'class':'BWARCRight'},[i],{'click':[clickCol,[2,i+1]]},table2['tr02']);
					IU._CreateElement('th',{'class':'BWARCRight'},[L._Get('sRCTtotal')],{'click':[clickCol,[2,12]]},table2['tr02']);
					for (var key in list){
						var ligneIU = {'tr':['tr',,,,table2['tbody']],
									'td01':['td',{'class':(list[key]['cl']=='atkHit'?'atkHit':'defHit')+' BWARCLeft BWARCbold'},[key+(list[key]['count']>1?' x'+list[key]['count']:'')],,'tr']},
							ligne = IU._CreateElements(ligneIU),
							total = 0;
						for (var j=0;j<10;j++){
							var dmg = _Exist(list[key]['rdd'][j])?list[key]['rdd'][j]:0;
							total += dmg;
							IU._CreateElement('td',{},[dmg],{},ligne['tr']);
							}
						IU._CreateElement('td',{},[total],{},ligne['tr']);
						}
					var tri = PREF._Get('RC','tr2'),
						newCol = DOM._GetFirstNode("./th["+tri[0]+"]",table2['tr02']);
					IU._CreateElement('span',{'class':'BWARCtri'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},newCol);
					FctTriA(tri[0],tri[1],table2['tbody'],DOM._GetNodes("./tr",table2['tbody']));
					if (k==versus.snapshotLength-1) div.parentNode.insertBefore(IU._CreateElement('br',{'id':'BWERCBR'},[],{}),div.nextSibling);
					}
				
				// tableau 1
				var div = DOM._GetFirstNode("//div[@id='BWARCD1']");
				if (k==0){
					var divIU = {'div':['div',{'id':'BWARCD1','style':msgContent.getAttribute('style')}],
					'span':['span',{'class':'BWARCspan','id':'BWARCspan1','style':'color:'+(PREF._Get('RC','sh1')==1?'lime;':'red;')},[L._Get('sRCTitle1')],{'click':[clicRC,'1']},'div']};
					div = msgContent.parentNode.insertBefore(IU._CreateElements(divIU)['div'],msgContent.nextSibling);
					}
				if (div!=null){
					var table1IU = {
						'table':['table',{'class':'BWARCT','id':'BWARCT1','style':'display:'+(PREF._Get('RC','sh1')==1?'table;':'none;')},,,div],
						'thead':['thead',,,,'table'],
						'tr01':['tr',{'class':'tblheader'},,,'thead'],
						'th011':['th',{'class':'BWARCLeft','style':'width:14%'},[L._Get('sRCTFight')+' n°'+(k+1)],,'tr01'],
						'th012':['th',{'style':'width:35%','colspan':'9'},[L._Get('sRCTAtt')],,'tr01'],
						'th013':['th',{'style':'width:15%','colspan':'3'},[L._Get('sRCTDmg')],,'tr01'],
						'th014':['th',{'style':'width:19%','colspan':'5'},[L._Get('sRCTDef')],,'tr01'],
						'th015':['th',{'style':'width:12%','colspan':'2'},[L._Get('sRCTPV')],,'tr01'],
						'th016':['th',{'style':'width:5%','colspan':'1'},[L._Get('sRCTDead')],,'tr01'],
						'tr02':['tr',{'id':'BWARC1c','class':'tblheader'},,,'thead'],
						'th021':['th',{'class':'BWARCLeft'},[L._Get('sRCTName')],{'click':[clickCol,[1,1]]},'tr02'],
						'tbody':['tbody',{'id':'BWARC1b'},,,'table']},
						table1 = IU._CreateElements(table1IU),
						thList = ['sRCTNb','sRCTHit','%','sRCTCC','%','sRCTFail','%','sRCTEsq','%','sRCTMin','sRCTMax','sRCTMoy','sRCTNb','sRCTFail','%','sRCTEsq','%','sRCTLose','sRCTWin','sRCTRd'];
					for (var i=0;i<thList.length;i++) IU._CreateElement('th',{'class':'BWARCRight'},[L._Get(thList[i])],{'click':[clickCol,[1,i+2]]},table1['tr02']);
					for (var key in list){
						var ligneIU = {'tr':['tr',,,,table1['tbody']],
									'td01':['td',{'class':(list[key]['cl']=='atkHit'?'atkHit':'defHit')+' BWARCLeft BWARCbold'},[key+(list[key]['count']>1?' x'+list[key]['count']:'')],,'tr'],
									'td02':['td',{'class':'atkHit'},[list[key]['hit']+list[key]['fail']+list[key]['esq']],,'tr'],
									'td03':['td',{'class':'atkHit'},[list[key]['hit'].toString()],,'tr'],
									'td03b':['td',{'class':'atkHit'},[(list[key]['hit']>0?Math.round(list[key]['hit']/(list[key]['hit']+list[key]['fail']+list[key]['esq'])*100):0)],,'tr'],
									'td04':['td',{'class':'atkHit'},[list[key]['cc'].toString()],,'tr'],
									'td04b':['td',{'class':'atkHit'},[(list[key]['hit']>0?Math.round(list[key]['cc']/list[key]['hit']*100):0)],,'tr'],
									'td05':['td',{'class':'atkHit'},[list[key]['fail'].toString()],,'tr'],
									'td05b':['td',{'class':'atkHit'},[(list[key]['hit']>0?Math.round(list[key]['fail']/(list[key]['hit']+list[key]['fail']+list[key]['esq'])*100):0)],,'tr'],
									'td06':['td',{'class':'atkHit'},[list[key]['esq'].toString()],,'tr'],
									'td06b':['td',{'class':'atkHit'},[(list[key]['hit']>0?Math.round(list[key]['esq']/(list[key]['hit']+list[key]['fail']+list[key]['esq'])*100):0)],,'tr'],
									'td07':['td',,[(list[key]['dmin']!=null?list[key]['dmin']:0)],,'tr'],
									'td08':['td',,[list[key]['dmax']],,'tr'],
									'td09':['td',,[(list[key]['hit']>0?Math.round(list[key]['dmg']/list[key]['hit']):0)],,'tr'],
									'td10':['td',{'class':'defHit'},[list[key]['dnb']],,'tr'],
									'td11':['td',{'class':'defHit'},[list[key]['dfail'].toString()],,'tr'],
									'td11b':['td',{'class':'defHit'},[(list[key]['dnb']>0?Math.round(list[key]['dfail']/list[key]['dnb']*100):0)],,'tr'],
									'td12':['td',{'class':'defHit'},[list[key]['desq'].toString()],,'tr'],
									'td12b':['td',{'class':'defHit'},[(list[key]['dnb']>0?Math.round(list[key]['desq']/list[key]['dnb']*100):0)],,'tr'],
									'td13':['td',{'class':'atkHit'},[list[key]['pvlost']],,'tr'],
									'td14':['td',{'class':'heal'},[list[key]['pvwin']],,'tr'],
									'td15':['td',{'class':'playerDeath'},,,'tr']},
							ligne = IU._CreateElements(ligneIU);
						for (var j=0;j<list[key]['dead'].length;j++) ligne['td15'].textContent+=(_Exist(list[key]['dead'][j])?(ligne['td15'].textContent.length>0?',':'')+(j+1)+(list[key]['dead'][j]>1?'x'+list[key]['dead'][j]:''):'');
						}
					var tri = PREF._Get('RC','tr1'),
						newCol = DOM._GetFirstNode("./th["+tri[0]+"]",table1['tr02']);
					IU._CreateElement('span',{'class':'BWARCtri'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},newCol);
					FctTriA(tri[0],tri[1],table1['tbody'],DOM._GetNodes("./tr",table1['tbody']));
					if (k==versus.snapshotLength-1) div.parentNode.insertBefore(IU._CreateElement('br',{'id':'BWERCBR'},[],{}),div.nextSibling);
					}
				}
			}
		}
	}

/******************************************************
* START
******************************************************/
// vérification des services
if (!JSON) throw new Error("Erreur : le service JSON n\'est pas disponible.");
//else if (!window.localStorage) throw new Error("Erreur : le service localStorage n\'est pas disponible.");
else{
	var p = DATAS._GetPage();
console.debug('BWARCpage :',p);
	// Pages gérées par le script
	if (['null','pServerDeco','pServerUpdate','pServerOther'].indexOf(p)==-1){
		// identification du joueur
		var player = DATAS._PlayerName(),
			realm = DATAS._Royaume(),
			IDs = GM._GetVar('BWARC:IDS',{}),
			lastID = GM._GetVar('BWARC:LASTID',null);
console.debug('BWARCstart: %o %o %o %o',player,realm,IDs,lastID);
		if (player!=null&&realm!=null&&p=='pMain'){
			var r = DOM._GetFirstNodeTextContent("//div[@class='throne-maindiv']/div/span[@class='reflink']",null);
			if (r!=null){
				var r2 = /r\.php\?r=([0-9]+)/.exec(r),
					ID = _Exist(r2[1])?r2[1]:null;
				if (ID!=null){
					for (var i in IDs) if (IDs[i]==ID) delete IDs[i]; // en cas de changement de nom
					IDs[realm+':'+player] = ID;
					GM._SetVar('BWARC:IDS',IDs);
					GM._SetVar('BWARC:LASTID',realm+':'+ID);
console.debug('BWARCmain: %o %o',IDs,ID);
					}
				}
			}
		else if (p=='pShowMsg'||p=='pMsg'||p=='pMsgSave'){
			if (lastID!=null&&p=='pShowMsg'){
				SetCSS();
				PREF._Init(lastID);
				AnalyseRC();
				}
			else if (player!=null&&realm!=null&&_Exist(IDs[realm+':'+player])&&p!='pShowMsg'){
				SetCSS();
				PREF._Init(realm+':'+IDs[realm+':'+player]);
				AnalyseRC();
				}
			else alert(L._Get("sUnknowID"));
			}
		}
	}
console.debug('BWARCend');
})();
