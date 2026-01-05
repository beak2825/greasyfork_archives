(function(){
// coding: utf-8
// ==UserScript==
// @author		Ecilam
// @name		Blood Wars Enhanced
// @version		2015.08.03
// @namespace	BWE
// @description	Ce script ajoute des fonctionnalités supplémentaires à Blood Wars.
// @copyright   2011-2015, Ecilam
// @license     GPL version 3 ou suivantes; http://www.gnu.org/copyleft/gpl.html
// @homepageURL https://github.com/Ecilam/BloodWarsEnhanced
// @supportURL  https://github.com/Ecilam/BloodWarsEnhanced/issues
// @include     /^http:\/\/r[0-9]*\.fr\.bloodwars\.net\/.*$/
// @include     /^http:\/\/r[0-9]*\.bloodwars\.net\/.*$/
// @include     /^http:\/\/r[0-9]*\.bloodwars\.interia\.pl\/.*$/
// @include     /^http:\/\/beta[0-9]*\.bloodwars\.net\/.*$/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11555/Blood%20Wars%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/11555/Blood%20Wars%20Enhanced.meta.js
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
* OBJET LS - Datas Storage
* - basé sur localStorage
* Note : localStorage est lié au domaine
******************************************************/
var LS = (function(){
	var LS = window.localStorage;
	return {
		_GetVar: function(key,defaut){
			var v = LS.getItem(key); // if key does not exist return null 
			return ((v!=null)?JSONS._Decode(v):defaut);
			},
		_SetVar: function(key,v){
			LS.setItem(key,JSONS._Encode(v));
			return v;
			},
		_Delete: function(key){
			LS.removeItem(key);
			return key;
			},
		_Length: function(){
			return LS.length;
			},
		_Key: function(index){
			return LS.key(index);
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
		// retourne la valeur de la clé "key" trouvé dans l'url
		// null: n'existe pas, true: clé existe mais sans valeur, autres: valeur
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
* OBJET IU - Interface Utilsateur
******************************************************/
var IU = (function(){
	return {
		// reçoit une liste d'éléments pour créér l'interface
		// ex: {'name':['input',{'type':'checkbox','checked':true},['coucou'],{'click':[funcname,5]},body]
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
		// IU._addEvent(obj: objet,type: eventype,fn: function,par: parameter);
		// function fn(e,par) {alert('r : ' + this.value+e.type+par);}
		// this = obj, e = event
		// ex : IU._addEvent(r,'click',test,"2");
		_addEvent: function(obj,type,fn,par){
			var funcName = function(event){return fn.call(obj,event,par);};
			obj.addEventListener(type,funcName,false);
			if (!obj.BWEListeners) {obj.BWEListeners = {};}
			if (!obj.BWEListeners[type]) obj.BWEListeners[type]={};
			obj.BWEListeners[type][fn.name]=funcName;
			},
		// voir _addEvent pour les paramètres
		_removeEvent: function(obj,type,fn){
			if (obj.BWEListeners[type]&&obj.BWEListeners[type][fn.name]){
				obj.removeEventListener(type,obj.BWEListeners[type][fn.name],false);
				delete obj.BWEListeners[type][fn.name];
				}
			},
		// voir _addEvent pour les paramètres
		_removeEvents: function(obj){
			if (obj.BWEListeners){
				for (var key in obj.BWEListeners){
					for (var key2 in obj.BWEListeners[key]){
						obj.removeEventListener(key,obj.BWEListeners[key][key2],false);
						}
					}
				delete obj.BWEListeners;
				}
			}
		};
	})();

/******************************************************
* OBJET L - localisation des chaînes de caractères (STRING) et expressions régulières (RegExp)
******************************************************/
var L = (function(){
	var locStr = {// key:[français,anglais,polonais]
		//DATAS
		"sNiveau":["NIVEAU ([0-9]+)","LEVEL ([0-9]+)","POZIOM ([0-9]+)"],
		"sXP":
			["EXPÉRIENCE: <strong>([0-9 ]+)<\\/strong> \\/ ([0-9 ]+)",
			"EXPERIENCE: <strong>([0-9 ]+)<\\/strong> \\/ ([0-9 ]+)",
			"DOŚWIADCZENIE: <strong>([0-9 ]+)<\\/strong> \\/ ([0-9 ]+)"],
		"sDeconnecte":
			["Vous avez été déconnecté en raison d`une longue inactivité.",
			"You have been logged out because of inactivity.",
			"Nastąpiło wylogowanie z powodu zbyt długiej bezczynności."],
		"sCourtePause":
			["Une courte pause est en court en raison de l`actualisation du classement général",
			"Please wait a moment while the rankings are being updated.",
			"Trwa przerwa związana z aktualizacją rankingu gry."],
		//<td><strong><u>Une pause en raison de conservation est en court.</u><br /><br />Vous êtes prié(e) de ressayer dans quelques minutes.</strong></td>
		//<td><strong><u>Une pause est en court en raison du proces de sauvegarde de la base de données.</u> <br />
		//INIT
		"sUnknowID":
			["BloorWarsEnhanced - Erreur :\n\nLe nom de ce vampire doit être lié à son ID. Merci de consulter la Salle du Trône pour rendre le script opérationnel.\nCe message est normal si vous utilisez ce script pour la première fois ou si vous avez changé le nom du vampire.",
			"BloorWarsEnhanced - Error :\n\nThe name of this vampire must be linked to her ID. Please consult the Throne Room to make the script running.\nThis message is normal if you use this script for the first time or if you changed the name of the vampire.",
			"BloorWarsEnhanced - Błąd :\n\nNazwa tego wampira musi być związana z jej ID. Proszę zapoznać się z sali tronowej, aby skrypt uruchomiony.\nTo wiadomość jest normalne, jeśli użyć tego skryptu po raz pierwszy lub jeśli zmienił nazwę wampira."],
		// pOProfile/pProfile
		"sNameTest":["Profil du vampire (.+) ","Vampire profile (.+) ","Profil wampira (.+) "],
		"sSexeHomme":["Homme","Male","Mężczyzna"],
		"sSexeH":["H","M","M"],
		"sSexeF":["F","F","K"],
		"sProfAtt":["ATT:","ATT:","ATA:"],
		"sProfDef":["DEF:","DEF:","OBR:"],
		// Groupes
		"sGrpA":["GROUPE A","GROUP A","GRUPA A"],
		"sGrpB":["GROUPE B","GROUP B","GRUPA B"],
		"sGrpAct":["ACTIONS","ACTIONS","AKCJA"],
		"sGrpPl":["$1 joueur","$1 player","$1 gracz"],
		"sGrpPls":["$1 joueurs","$1 players","$1 gracze"],
		"sGrpTt":["Somme:","Sum:","Suma:"],
		"sGrpMoy":["Moyenne:","Average:","Średnia:"],
		// Constructions
		"sBuildZone":["ZONE ([0-9]+)","ZONE ([0-9]+)","STREFA ([0-9]+)"],
		"sBuildPrgUp":["Actuellement en construction","Under construction","Aktualnie budowany"],  			 
		"sBuildPrgDown":["Démolition","Demolition","wyburzanie"],
		"sBuildNiv":["\\(NIVEAU ([0-9]+)\\)","\\(LEVEL ([0-9]+)\\)","\\(POZIOM ([0-9]+)\\)"],
		"sBuildNewOk":["FAIRE CONSTRUIRE","BUILD","ZBUDUJ"],
		"sBuildUpOk":["DÉVELOPPER JUSQU`AU NIVEAU","UPGRADE TO LEVEL","ROZBUDOWA DO POZIOMU"],
		"sBuildDownOk":["DEMOLIR UN NIVEAU DE BATIMENT","DEMOLISH ONE LEVEL","WYBURZ JEDEN POZIOM"],
		"sBuildlol":["LOL","Lgo","PLN"],
		"sBuildMdo":["de mains-d`œuvre","people","ludzi"],
		"sBuildSang":["litres de sang","litres of blood","litrów krwi"],
		"sBuildTime":["<b>Temps de construction:<\\/b>\\s*","<b>Time of construction:<\\/b>\\s*","<b>Czas budowy:<\\/b>\\s*"],
		"sBuildMaxLvl":["Niveau max","Max level","Max poziom"],
		// Divers
		"sNivFormat":["$1 ($2)"],
		"sNivFormat2":["$1 ($2)($3)"],
		// Race
		"sRaces":[["ABSORBEUR","CAPTEUR D`ESPRIT","CULTISTE","DAMNÉ","SEIGNEUR DES BÊTES"],
			["ABSORBER","THOUGHTCATCHER","CULTIST","CURSED ONE","BEASTMASTER"],
			["SSAK","ŁAPACZ MYŚLI","KULTYSTA","POTĘPIONY","WŁADCA ZWIERZĄT"]],
		// tri
		"sTriUp":["▲"],
		"sTriDown":["▼"],
		"sTriOLTest":
			["(?:([0-9]+) j\\.? ?|)(?:([0-9]+) h ?|)(?:([0-9]+) m(?:in)? ?|)(?:([0-9]+) s(?:ec\\.)? ?|)",
			"(?:([0-9]+) d(?:ay\\(s\\))? ?|)(?:([0-9]+) h(?:our\\(s\\))? ?|)(?:([0-9]+) m(?:in\\.)? ?|)(?:([0-9]+) s(?:ec\\.)? ?|)",
			"(?:([0-9]+) d\\.? ?|)(?:([0-9]+) g(?:odz\\.)? ?|)(?:([0-9]+) m(?:in\\.)? ?|)(?:([0-9]+) s(?:ek\\.)? ?|)"],
		"sTriImgTest":[".*/._(ok|not)\\.gif"],
		"sTriAdrTest":["([0-9]+)\\/([0-9]+)\\/([0-9]+)"],
		"sTriNbTest":["^([+-]?[0-9 ]+)(?:\\.?|->[0-9]+)$"],
		"sTriPtsTest":["^([0-9]+)(?:\\-[0-9]+)? \\(([0-9 ]+)\\)$"],
		// pMsgList/pMsgSaveList
		"sTitleIndex":["Titre du message","Message title","Tytuł wiadomości"],
		"sDateIndex":["Date d`envoi","Send date","Data wysłania"],
		"sAmbushMsg1":
			[".(.+) a préparé une embuscade contre toi!",
			".(.+) ambushed you!",
			".(.+) urządził[a]? na Ciebie zasadzkę!"],
		"sAmbushMsg2":
			["Tu as préparé une embuscade contre (.+)\\.",
			"You ambushed (.+)\\.",
			"Urządził[ae]ś zasadzkę na (.+)\\."],
		// pMsg/pMsgSave
		"sAmbushTest1":
			["<a[^<>]+>([^<>]+)<\\/a> a organisé une embuscade contre <a[^<>]+>([^<>]+)<\\/a> !",
			"<a[^<>]+>([^<>]+)<\\/a> ambushed <a[^<>]+>([^<>]+)<\\/a> !",
			"<a[^<>]+>([^<>]+)<\\/a> urządził[a]? zasadzkę na <a[^<>]+>([^<>]+)<\\/a> !"],
		"sAmbushTest2":
			["Chance de réussite de l`embuscade: ([0-9]+,[0-9]+) %",
			"Chance of successful ambush ([0-9]+,[0-9]+) %",
			"Szansa na udaną zasadzkę: ([0-9]+,[0-9]+) %"],
		"sAmbushTest3":
			["$1 a préparé un plan minutieux",
			"$1 prepared an elaborate plan",
			"$1 przygotował[a]? misterny plan"],
		"sAmbushTest4":
			["Grâce à une action habilement menée, ",
			"Thanks to the perfectly prepared ambush ",
			"Dzięki świetnie przeprowadzonej zasadzce "],
		"sAmbushTest5":
			["L`attaque sur <b>$1<\\/b> n`était pas une très bonne idée",
			"The attack on <b>$1<\\/b> was not a good idea",
			"Atak na <b>$1<\\/b> nie był najlepszym pomysłem"],
		"sAmbushTest6":
			["Les deux adversaires étaient très bien préparés au combat",
			  "Both sides were well prepared",
			 "Obie strony były świetnie przygotowane"],
		"sAmbushTest7":["([0-9]+) \\/ ([0-9]+)<br>([0-9]+) \\/ ([0-9]+)"],
		"sAmbushTest8":
			["(<b>([^<>]+)<\\/b> utilise l`arcane <span.+>([^<>]+)<\\/span> niveau <b>([0-9]+)<\\/b>\\.)+",
			"(<b>([^<>]+)<\\/b> uses arcana <span.+>([^<>]+)<\\/span> level <b>([0-9]+)<\\/b>\\.)+",
			"(<b>([^<>]+)<\\/b> używa arkana <span.+>([^<>]+)<\\/span> poziom <b>([0-9]+)<\\/b>\\.)+"],
		"sAmbushTest9":
			["(<b>([^<>]+)<\\/b> utilise l`évolution: (<span[^>]+>[^<>]+<\\/span>[., ]+)+)+",
			"(<b>([^<>]+)<\\/b> uses evolution: (<span[^>]+>[^<>]+<\\/span>[., ]+)+)+",
			"(<b>([^<>]+)<\\/b> korzysta z ewolucji: (<span[^>]+>[^<>]+<\\/span>[., ]+)+)+"],
		"sAmbushTest10":
			["(<span[^>]+>([^<>]+) niv. ([0-9]+)<\\/span>)+",
			 "(<span[^>]+>([^<>]+) lvl ([0-9]+)<\\/span>)+",
			 "(<span[^>]+>([^<>]+) poz. ([0-9]+)<\\/span>)+"],
		"sAmbushTest11":["<td[^<>]+><b>([^<>]+)<\\/b><\\/td><td[^<>]+>$1<\\/td><td[^<>]+><b>([^<>]+)<\\/b>"],
		"sAmbushTest12":
			["(<b>([^<>]+)<\\/b> utilise l`objet[^<>]+<span.+>([^<>]+)<\\/span>\\.)+",
			"(<b>([^<>]+)<\\/b> uses item[^<>]+<span.+>([^<>]+)<\\/span>\\.)+",
			"(<b>([^<>]+)<\\/b> używa przedmiotu[^<>]+<span.+>([^<>]+)<\\/span>\\.)+"],
		"sAEFormat":["$1 x$2"],
		"sPVFormat":["$1/$2"],
		"sAmbushTest13":
			["<b>$1<\\/b> mord le vampire vaincu dans la nuque et lui suce <b>([0-9]+)<\\/b> pts de progrès\\.",
			"<b>$1<\\/b> bit into the enemy`s neck and sucked out <b>([0-9]+)<\\/b> experience pts\\.",
			"<b>$1<\\/b> wgryza się w szyję pokonanego wroga i wysysa <b>([0-9]+)<\\/b> pkt doświadczenia\\."],
		"sAmbushTest14":
			["(?:<b>|)$1(?:<\\/b>|) mord le vampire vaincu dans la nuque, lui suce (?:<b>|)([0-9]+)(?:<\\/b>|) pts de progrès et obtient (?:<b>|)([0-9]+)(?:<\\/b>|) pts d`honneur\\.",
			"<b>$1<\\/b> bit into the enemy`s neck and sucked out <b>([0-9]+)<\\/b> experience pts and gained <b>([0-9]+)<\\/b> honour pts\\.",
			"<b>$1</b> wgryza się w szyję pokonanego wroga i wysysa <b>([0-9]+)<\\/b> pkt doświadczenia oraz otrzymuje <b>([0-9]+)<\\/b> pkt reputacji\\."],
		"sAmbushTest15":
			["(?:<b>|)$1(?:<\\/b>|) paie une rançon d`un montant de (?:<b>|)([0-9]+) LOL(?:<\\/b>|), (?:<b>|)([0-9]+)(?:<\\/b>|) litre\\(s\\) de sang et.+lui livre (?:<b>|)([0-9]+)(?:<\\/b>|) hommes comme esclaves\\.",
			"<b>$1<\\/b> paid ransom of <b>([0-9]+) Lgo<\\/b>, <b>([0-9]+)<\\/b> litres of blood and gave <b>([0-9]+)<\\/b> prisoners\\.",
			"<b>$1<\\/b> płaci okup w wysokości <b>([0-9]+) PLN<\\/b>, <b>([0-9]+)<\\/b> litrów krwi oraz oddaje <b>([0-9]+)<\\/b> ludzi w niewolę\\."],
		"sAmbushTest16":
			["<b>$1<\\/b> reçoit <b>([0-9]+)<\\/b> pts d`évolution\\!",
			"<b>$1<\\/b> gains <b>([0-9]+)<\\/b> evolution pts\\!",
			"<b>$1<\\/b> zdobywa <b>([0-9]+)<\\/b> pkt ewolucji\\!"],
		// pMkstone et autres
		"sTotal":["Total: ","Total: ","łączny: "],
		// pAmbushRoot
		"sMidMsg":["a=msg&do=view&mid=([0-9]+)"],
		"sAtkTime":["timeFields\\.atkTime = ([0-9]+)"],
		// historique
		"sLogVS":["$1 VS $2"],
		"sLogTime1":["$1s"],
		"sLogTime2":["$1m"],
		"sLogTime3":["$1h","$1h","$1g"],
		"sLogTime4":["$1j","$1d","$1d"],
		"sLogTime5":["+1an","+1y","+1rok"],
		"sLogNC":["Analyse nécessaire","Analysis required","Analiza wymagane"],
		"sNC":["INCONNUE","UNKNOW","NIEZNANY"],
		"sArc":[["Silence du Sang","Absorption de la Force","Le pouvoir du Sang","Masque d`Adonis","Masque de Caligula","La Majesté","Sang de la Vie","Voies Félines","L`Ardeur du Sang","Le Chasseur de la Nuit","Le Souffle Mortel","L`Horreur","Frénésie Sauvage","Peau de Bête","L`Ombre de la Bête"],
			["Silence of Blood","Power absorption","Power of Blood","Mask of Adonis","Mask of Caligula","Majesty","Blood of Life","Cat`s Paths","Searing Blood","Night Hunter","Breath of Death","Horror","Bloodfrenzy","Beast`s Hide","Shadow of the Beast"],
			["Cisza Krwi","Wyssanie mocy","Moc Krwi","Maska Adonisa","Maska Kaliguli","Majestat","Krew Życia","Kocie Ścieżki","Żar Krwi","Nocny Łowca","Tchnienie Śmierci","Groza","Dziki Szał","Skóra Bestii","Cień Bestii"]],
		"sEvo":[["Les Ailes","Carapace","Canines/Griffes/Pointes","Glandes à venin","Tendons renforcés","Chambre supplémentaire","Le sang du démon","Mutation ADN","Eclairé","Sixième sens","Absorption","Développement Harmonieux","Mana Purifiée","Mémoire Ancestrale","Puissance","Légèreté de l`être"],
			["Wings","Carapace","Claws/Fangs/Quills","Venom glands","Hardened tendons","Additional cavity","Daemon blood","Mutated DNA","Enlightened","Sixth sense","Absorption","Harmonious development","Mana contamination","Memory of the ancestors","Might","Lightness of being"],
			["Skrzydla","Pancerz","Kly/Pazury/Kolce","Gruczoly jadowe","Wzmocnione sciegna","Dodatkowa komora","Krew demona","Mutacja DNA","Oswiecony","Szósty zmysl","Absorpcja","Harmonijny rozwój","Skażenie Maną","Pamięć przodków","Potęga","Lekkość bytu"]],
		"sObjet":[["Sang de loup","Pomme de l`Arbre Ferreux","Nageoire de requin","Élixir des sens","Eau bénite","Larme de phénix","Cachet magique","Coeur de chauve-souris","Fleur de lotus","Venin de puce géante","Sérum d`illumination","Bouillon de chat noir","Charbon","Fourrure de taupe","Salpêtre",
			"Essence de jouvence","Ongle de troll","Belladones","Oeil de chat","Absinthe","Écaille de salamandre","Eau de source","Os de martyre","Élixir d`amour","Venin de scorpion","Racine de mandragore","Poussière d`étoile","Fiole d`acide","Soufre","Diamant noir",
			"Larme divine","Dent de ghoule","Bouillon de corail","Coeur de prophète","Griffe du basilic","Ecailles de démon","Ailes du scarabée","Masque de gargouille","Jus de mante religieuse","Souffle du dragon","Dent de sorcière","Grimoire","Appendice noire","Doigt de forgeron","Fleur de lila"],
			["Wolf Blood","Iron Tree Apple","Shark Fin","Elixir of Senses","Blessed Water","Phoenix Tear","Magic Seal","Bat Heart","Black Lotus","Gigaflea Venom","Serum of Enlightenment","Brew of the Black Cat","Coal","Mole Fur","Saltpetre",
			"Essence of Youth","Troll Nail","Deadly Nightshade","Eye of the Cat","Absinthe","Salamander Scales","Spring Water","Bone of the Martyr","Love Beverage","Scorpid Venom","Mandrake Root","Star Dust","Vial of Acid","Sulphur","Black Diamond",
			"Divine Tear","Ghoul`s Tooth","Coral Concoction","Heart of a Prophet","Basilisk`s Claw","Demon`s Scales","Beetle Wings","Gargoyle`s Mask","Mantis Juice","Dragon`s Breath","Tooth of a Witch","Grimoire","Black Bile","Blacksmith`s Finger","Elderberry Flower"],
			["Krew wilka","Jablko Zelaznego drzewa","Pletwa rekina","Eliksir zmyslów","Swiecona woda","Lza feniksa","Magiczna pieczec","Serce nietoperza","Kwiat lotosu","Jad Wielkopchly","Serum oswiecenia","Wywar z czarnego kota","Wegiel","Siersc kreta","Saletra",
			"Esencja mlodosci","Paznokiec trolla","Wilcza jagoda","Oko kota","Absynt","Luski salamandry","Woda zródlana","Kosc meczennika","Napój milosny","Jad Skorpiona","Korzen Mandragory","Gwiezdny pyl","Fiolka kwasu","Siarka","Czarny diament",
			"Boska łza","Ząb ghula","Wywar z koralowca","Serce proroka","Pazur bazyliszka","Łuski demona","Skrzydła chrząszcza","Maska gargulca","Sok z modliszki","Oddech smoka","Ząb wiedźmy","Grimoire","Czarna żółć","Palec kowala","Kwiat bzu"]],
		// Titres des colonnes
		"sColTitle": //
			[["RACE","SEXE","ADRESSE","CLAN","<vide>","NIVEAU","POINTS","NIV (PTS)","GROUPE","STATUT","Place au classement","Date d`inscription","Dernière connexion","Provenance","HISTORIQUE", // 0-14
			"Nom","En ligne","<En ligne>","<Expéditions>","<Roi de la Colline>","Grade","A-B","<SEXE - icône>","ATT","<ATTAQUER>","DEF", // 15-25
			"PLACE","NOM","<N° du quartier>","MAÎTRE DU QUARTIER","ACTIONS", // 26-30
			"N°","Divers","Arcanes","Evolutions","Caractéristiques","Ressources", // 31-36
			"Date","Emb.","PV Att","PV Déf","Objet Att","Objet Def", // 37-42
			"NIVEAU","Pts DE VIE","Défense","FORCE","AGILITÉ","RÉSISTANCE","APPARENCE","CHARISME","RÉPUTATION","PERCEPTION","INTELLIGENCE","SAVOIR","AGI+PER", // 43-55
			"PdP","PdH","Pts évo","LOL","Sang","Pop", // 56-61
			"<Checkbox>","Titre du message","Expéditeur","Date d`envoi", // 62-65
			"<Place au classement>","Nom du clan","Tag du clan","Chef","Date de la fondation","Membres", // 66-71
			"LISTE D`AMIS", //72
			"Zone","Bâtiment","Niveau","Sang","Argent","Population","Temps","Actions", // 73-80
			"Ecart"], // 81
			["RACE","SEX","ADDRESS","CLAN","<empty>","LEVEL","POINTS","LVL (PTS)","GROUP","STATUS","Standing","Date of entry","Last logged","Provenance","HISTORY",
			"Name","On-line","<On-line>","<Expedition>","King Of the hill","Rank","A-B","SEX - icon","ATT","<ATTACK>","DEF",
			"STANDING","NAME","<N° of square>","SQUARE OWNER","ACTIONS",
			"N°","Misc.","Arcana","Evolution","Characteristic","Resources",
			"Date","Emb.(%)","HP Att","HP Def","Obj.Att","Obj.Def",
			"LEVEL","HIT POINTS","Defence","STRENGTH","AGILITY","TOUGHNESS","APPEARANCE","CHARISMA","REPUTATION","PERCEPTION","INTELLIGENCE","KNOWLEDGE","AGI+PER",
			"PoP","PoH","Evo pts","Lgo","blood","People",
			"<Checkbox>","Message title","Sender","Send date",
			"<Place ranking>","Clan name","Clan tag","Leader","Creation date","Members",
			"FRIENDLIST",
			"Zone","Building","Level","Blood","Money","People","Time","Action",
			"Gap"],
			["RASA","PŁEĆ","ADRES","KLAN","<pusty>","POZIOM","PUNKTY","POZ (PKT)","GRUPA","STATUS","Miejsce w rankingu","Data dołączenia","Ostatnie logowanie","Pochodzenie","HISTORY",
			"Imię","On-line","<On-line>","<Ekspedycja>","Król Wzgórza","Ranga","A-B","PŁEĆ - ikona","ATA","<NAPADNIJ>","OBR",
			"MIEJSCE","IMIĘ","<N° kwadratu>","WŁADCA KWADRATU","DZIAŁANIA",
			"N°","Różny","Arkana","Ewolucja","Charakterystyka","Zasoby",
			"Data","Zas.(%)","PŻ Nap","PŻ Obr","Obi.Ata","Obi.Obr",
			"POZIOM","PKT. ŻYCIA","Obrona","SIŁA","ZWINNOŚĆ","ODPORNOŚĆ","WYGLĄD","CHARYZMA","WPŁYWY","SPOSTRZEGAWCZOŚĆ","INTELIGENCJA","WIEDZA","ZWI+SPO",
			"Pkt roz","Pkt rep","Pkt ewo","PLN","Krew","Ludzie",
			"<Checkbox>","Tytuł wiadomości","Nadawca","Data wysłania",
			"<Ranking umieszczać>","Nazwa klanu","Tag klanu","Przywódca","Data powstania","Członków",
			"LISTA PRZYJACIÓŁ",
			"Strefa","Budowy","Poziom","Krew","Pieniądze","Ludzie","Czas","Akcja",
			"Luka"]],
		// Menus
		"sTitleMenu1":["BWE - OPTIONS","BWE - OPTIONS","BWE - OPCJE"],
		"sTitleMenu2":["BWE - BASE DE DONNÉES","BWE - DATABASE","BWE - BAZY DANYCH"],
		"sInfoMsg":
			["Un simple clic pour afficher/masquer les colonnes souhaitées dans la liste concernée.<br>Désactiver une liste désactive aussi la collecte des données de cette liste.<br>Désactiver la colonne Groupe désactive les tableaux correspondants.<br>G M D : Aligne à Gauche, Milieu ou Droite.",
			"A single click to show/hide the columns you want on the appropriate list.<br>Disable a list also disables the collection of data from this list.<br>Disable the Group column disables the corresponding tables.<br>L M R : Align Left, Middle, or Right.",
			"Jedno kliknięcie, aby pokazać/ukryć kolumny, które mają na odpowiedniej liście.<br>Wyłącz lista wyłącza także zbierania danych z tej listy.<br>Wyłącz kolumna Grupa wyłącza odpowiednie tabele.<br>L Ś P: Wyrównaj do Lewej, Środkowy lub Prawy."],
		"sTitleList":["LISTES : ","LISTS : ","LISTY : "],
		"sTitleDivers":["DIVERS","MISCELLANEOUS","RÓŻNE"],
		"sActive":["Activer/Désactiver","Enable / Disable","Włącz / Wyłącz"],
		"sLeft":["G","L","L"],
		"sMiddle":["M","M","Ś"],
		"sRight":["D","R","P"],
		"sTitresList": [["Tableaux","Votre Profile","Autres Profiles","Vue sur la Cité","Votre Clan","Autres Clans","Liste des Clans","Classement",// 0-7
				"Messagerie","Réception","Sauvegarde","Envoi",//8-11
				"Historique","Principal","- Divers","- Caractéristiques","- Ressources"],// 12-16
			["Tables","Profile owner","Other Profiles","View of the city","Clan owner","Other Clans","List of Clans","Ranking",
			"Messaging","Reception","Safeguard","Sending",
			"History","Main","- Misc","- Characteristics","- Resources"],
			["Stoły","Twój Profil","Inne Profile","Widok na miasto","Twój Klan","Inne Klany","Lista Klanów","Ranking",
			"Wiadomości","Recepcja","Zabezpieczenie","Wysyłanie",
			"Historia","Główny","- Różny","- Charakterystyka","- Zasoby"]],
		"sTitresDiv": [["Afficher/Masquer les descriptions des clans","Tri liste des amis","Total des pierres","Historique : nombre de lignes","Historique : collecte des données",
			"Aide aux embuscades :","+ Niveau","+ Classement","- Minimum","- Maximum","- Ecart inférieur","- Ecart supérieur","Tableau des constructions"],
			["Show/Hide descriptions clans","Sort list of friends","Total stones","History: number of lines","History : data collection",
				"Help for ambushes :","Level","Ranking","- Minimum","- Maximum","- Gap lower","- Gap higher","Building array"],
			["Pokaż/Ukryj opisy klany","Sortuj listę znajomych","Całkowitej kamienie","Historia: liczba linii","Historia: zbieranie danych",
				"Pomoc dla zasadzki :","Poziom","Ranking","- Minimalny","- Maksymalny","- luka niższy","- luka wyższa","Tablica budynek"]],
		"sDefaut":["Par défaut","By default","Zaocznie"],
		"sAlertMsg":
			["ATTENTION! Cette page vous permet d'effacer les données du Script. A utiliser avec précaution.",
			"WARNING! This page allows you to delete data script. Use with caution.",
			"UWAGA! Ta strona pozwala usunąć skrypt danych. Stosować z ostrożnością."],
		"sTitleLS":["BASE DE DONNEES - LOCALSTORAGE","DATABASE - LOCALSTORAGE","BAZY DANYCH - LOCALSTORAGE"],
		"sDelete":["Supprime","Delete","Usuwa"],
		"sRAZ":["RAZ","RAZ","RESET"],
		"sRazChkLS":
			["Voulez vraiment effacer l'ensemble des données Localstorage ?",
			"Really want to erase all data localStorage?",
			"Naprawdę chcesz usunąć wszystkie dane LocalStorage?"],
		"sLabelSearch":["Filtre","Filter","Filtr"],
		"sResult":["$1 résultat(s) sur $2","$1 of $2 results","$1 z $2 wyników"],
		"sTitleIE":["IMPORT/EXPORT HISTORIQUE","IMPORT/EXPORT HISTORY","PRZYWÓZ/WYWÓZ HISTORIA"],
		"sExportText":["Zone d'exportation","Export Area","Eksport przestrzeni"],
		"sExportHelp":["Cliquer sur START pour générer les données.<br>Recopier celle-ci à partir du cadre ci dessous pour les coller dans la zone import de l\\'autre navigateur.<br>Contient uniquement l\\'historique de votre vampire.",
			"Click on START to generate the data.<br>Copy it from the frame below to paste into the import area to the other browser.<br>Contains only the history of your vampire.",
			"Kliknij na START, aby wygenerować dane.<br>Skopiuj go z ramki poniżej wkleić do obszaru na przywóz do innej przeglądarki.<br>Zawiera tylko historię swojego wampira."],
		"sImportText":["Zone d'importation","Import area","Powierzchnia importu"],
		"sImportHelp":["Coller les données en provenance d\\'un autre navigateur dans ce cadre puis cliquer sur IMPORT.<br>Ne prend en compte que l\\'historique de votre vampire.",
			"Paste data from another browser in this frame then click on IMPORT.<br>Only takes into account the history of your vampire.",
			"Wklej dane z innej przeglądarki w tej ramce a następnie kliknij Import.<br>Tylko bierze pod uwagę historię swojego wampira."],
		"sOutputLog":["START","START","START"],
		"sImportLog":["IMPORT","IMPORT","PRZYWÓZ"],
		"sIEResult":["$1 résultat(s)","$1 results","$1 wyników"]
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
	// pour _Time()
	var timeDiff = null,
		stTime = new Date(),
		r = DOM._GetFirstNodeInnerHTML("/html/body/script",null),
		r2 = /var timeDiff = ([0-9]+) - Math\.floor\(stTime\.getTime\(\)\/1000\) \+ ([0-9]+) \+ stTime\.getTimezoneOffset\(\)\*60;/.exec(r);
	if (r2!=null) timeDiff = parseInt(r2[1]) - Math.floor(stTime.getTime()/1000) + parseInt(r2[2]) + stTime.getTimezoneOffset()*60;
	var _PlayerExpBar = function(){
		var stats = DOM._GetFirstNode("//div[@class='stats-player']/div[@class='expbar']"),
			player_datas = stats?stats.getAttribute('onmouseover'):null;
		return player_datas;
		};
	return {
	/* données du serveur */
		_Time: function(){
			var stTime = new Date();
			if (timeDiff!=null)	stTime.setTime((timeDiff*1000)+stTime.getTime());
			else stTime=null;
			return stTime;
			},
	/* données du joueur */
		_PlayerName: function(){
			var playerName = DOM._GetFirstNodeTextContent("//div[@class='stats-player']/a[@class='me']", null);
			return playerName;
			},
		_PlayerLevel: function(){
			var playerLevel = new RegExp(L._Get('sNiveau')).exec(_PlayerExpBar());
			if (playerLevel!=null) playerLevel=parseInt((playerLevel[1]).replace(new RegExp(' ','g'),''));
			return playerLevel;
			},
		_PlayerXP: function(){
			var playerXP=new RegExp(L._Get('sXP')).exec(_PlayerExpBar());
			if (playerXP!=null) playerXP = parseInt((playerXP[1]).replace(/ /g,""));
			return playerXP;
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
				if (path!="/"){}
				// page interne
				// Profile
				else if (qsA=="profile"){
					var qsUid = DOM._QueryString("uid");
					var qsEdit = DOM._QueryString("edit");
					if (qsUid==null) p="pOProfile";
					else if (!qsEdit) p="pProfile";
					}
				// Salle du Trône
				else if (qsA==null||qsA=="main") p="pMain";
				// Site de construction
				else if (qsA=="build") p="pBuild";
				// Vue sur la Cité
				else if (qsA=="townview") p="pTownview";
				// Clan
				else if (qsA=="aliance"){
					if (qsDo=="list") p="pAlianceList";
					else if (qsDo==null||qsDo=="leave") p="pOAliance";
					else if (qsDo=="view"){
						var r = DOM._GetFirstNode("//div[@class='top-options']/span[@class='lnk']");
						if (r!=null) p="pOAliance";
						else p="pAliance";
						}
					} 
				// Le Puits des Âmes - Moria I
				else if (qsA=="mixer"){
					if (qsDo==null||qsDo=="mkstone") p="pMkstone";
					else if (qsDo=="upgitem") p="pUpgitem";
					else if (qsDo=="mixitem") p="pMixitem";
					else if (qsDo=="destitem") p="pDestitem";
					else if (qsDo=="tatoo") p="pTatoo";
					}
				// Préparer une embuscade
				else if (qsA=="ambush"){
					var qsOpt = DOM._QueryString("opt");
					if (qsOpt==null) p="pAmbushRoot";
					}
				// Page des messages
				else if (qsA=="msg"){
					var qsType = DOM._QueryString("type");
					if (qsDo==null||qsDo=="list"){
						if (qsType==null||qsType=="1") p="pMsgList";
						else if (qsType=="2") p="pMsgSaveList";
						else if (qsType=="3") p="pMsgSendList";
						}
					else if (qsDo=="fl") p="pMsgFriendList";
					else if (qsDo=="view" && qsMid!=null){
						if (qsType==null||qsType=="1") p="pMsg";
						else if (qsType=="2") p="pMsgSave";
						else if (qsType=="3") p="pMsgSend";
						}
					}
				// Page Classement
				else if (qsA=="rank") p="pRank";
				// Page Préférences
				else if (qsA=="settings"){
					if (qsDo==null) p="pRootSettings";
					else if (qsDo=="ai") p="pSettingsAi";
					else if (qsDo=="acc") p="pSettingsAcc";
					else if (qsDo=="vac") p="pSettingsVac";
					else if (qsDo=="delchar") p="pSettingsDelchar";
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
	const index = 'BWE:O:',
		defPrefs = {
		// Tableaux - sélection des colonnes/lignes
		// sh : Affiche (0=non,1=oui), tri (0=ascendant,1=descendant)
		// list: [n°titre des colonnes (cf sColTitle),afficher{1:0},n°colonne originale(-1 si a créer),alignement]
		// pages existantes
		'pOProfile':{'sh':1,'list':[[0,1,0,0],[1,1,1,0],[2,1,2,0],[3,1,3,0],[4,1,4,0],[5,0,5,0],[6,0,6,0],[7,1,-1,0],[8,0,-1,0],[10,1,7,0],[9,1,8,0],[4,1,9,0],[11,1,10,0],[12,1,11,0],[4,1,12,0],[13,1,13,0]]},
		'pProfile':{'sh':1,'list':[[0,1,0,0],[1,1,1,0],[2,1,2,0],[3,1,3,0],[4,1,4,0],[5,0,5,0],[6,0,6,0],[7,1,-1,0],[8,0,-1,0],[14,1,-1,0],[10,1,7,0],[9,1,8,0],[4,1,9,0],[11,1,10,0],[12,1,11,0],[4,1,12,0],[13,1,13,0]]},
		'pTownview':{'sh':1,'tri':[1,1],'list':[[28,1,1,2],[29,1,2,0],[9,1,3,0],[6,0,4,0],[5,0,-1,0],[7,1,-1,0],[23,1,-1,2],[24,1,5,1],[25,1,-1,0],[0,1,6,0],[1,0,7,0],[22,1,-1,1],[3,1,8,0],[30,1,9,0],[81,0,-1,0]]},
		'pOAliance':{'sh':1,'sh1':1,'sh2':1,'tri':[1,1],'list':[[15,1,1,0],[16,0,2,1],[17,1,-1,1],[18,1,-1,1],[19,1,-1,1],[2,1,3,0],[20,1,4,0],[5,0,5,0],[6,0,6,0],[7,1,-1,0],[21,0,-1,1],[22,1,-1,1],[0,1,-1,0],[1,0,-1,0],[11,0,7,0],[81,0,-1,0]]},
		'pAliance':{'sh':1,'sh1':1,'tri':[1,1],'list':[[15,1,1,0],[23,1,-1,2],[24,1,2,1],[25,1,-1,0],[2,1,3,0],[20,1,4,0],[5,0,5,0],[6,0,6,0],[7,1,-1,0],[21,0,-1,1],[22,1,-1,1],[0,1,-1,0],[1,0,-1,0],[11,0,7,0],[81,0,-1,0]]},
		'pAlianceList':{'sh':1,'list':[[66,1,1,2],[67,1,2,0],[68,1,3,0],[69,1,4,0],[70,1,5,0],[71,1,6,0],[6,1,7,0]]},
		'pMsgList':{'sh':0,'tri':[4,0],'list':[[62,1,1,0],[63,1,2,0],[64,1,3,0],[65,1,4,0]]},
		'pMsgSaveList':{'sh':0,'tri':[4,0],'list':[[62,1,1,0],[63,1,2,0],[64,1,3,0],[65,1,4,0]]},
		'pMsgSendList':{'sh':0,'tri':[4,0],'list':[[62,1,1,0],[63,1,2,0],[64,1,3,0],[65,1,4,0]]},
		'pMsgFriendList':{'sh':1,'tri':[1,1],'list':[[72,1,1,1],[-1,1,2,1]]},
		'pRank':{'sh':1,'tri':[1,1],'list':[[26,1,1,2],[27,1,2,0],[0,1,3,0],[1,0,4,0],[22,1,-1,1],[23,1,-1,2],[24,1,5,1],[25,1,-1,0],[2,1,6,0],[3,1,7,0],[5,0,-1,0],[6,0,8,0],[7,1,-1,0],[81,0,-1,0]]},
		'pBuild':{'sh':1,'tri':[1,0]},
		// tableaux à créer
		'grp':{'sh':1,'tri':[1,1]},
		'hlog':{'list':[[31,1],[32,1],[33,1],[34,1],[35,1],[36,1]]},
		'hdiv':{'list':[[37,1],[38,1],[39,1],[40,1],[41,1],[42,1]]},
		'hch':{'list':[[43,0],[44,0],[45,1],[46,0],[47,1],[48,1],[49,0],[50,1],[51,1],[52,1],[53,0],[54,0],[55,0]]},
		'hres':{'list':[[56,1],[57,1],[58,1],[59,1],[60,1],[61,1]]},
		// Aide Embucasde
		'AE':{'sh':0,'nMin':'','nMax':'','aMin':'','aMax':'','cMin':'','cMax':'','acMin':'','acMax':''},
		// Divers : stones, nbre de ligne du log,collecte log
		'div':{'chDe':1,'chSt':1,'nbLo':4,'chLo':1}
		};
	var ID = null, prefs = {};
	return {
		_Init: function(id){
			ID = id;
			prefs = LS._GetVar(index+ID,{});
			// mise à jour des listes si nécessaire
			for (var i in prefs){
				if (_Exist(prefs[i]['list'])&&prefs[i]['list'].length!=defPrefs[i]['list'].length){
					for (var j=0;j<defPrefs[i]['list'].length;j++){
						var y = false;
						for (var x=0;x<prefs[i]['list'].length;x++){
							if (defPrefs[i]['list'][j][0]==prefs[i]['list'][x][0]){
								y = true; break;
								}
							}
						if (y==false) prefs[i]['list'].push(defPrefs[i]['list'][j]);
						}
					LS._SetVar(index+ID,prefs);
					}
				}
			},
		_Get: function(grp,key){
			if (_Exist(prefs[grp])&&_Exist(prefs[grp][key])) return prefs[grp][key];
			else if (_Exist(defPrefs[grp])&&_Exist(defPrefs[grp][key]))return defPrefs[grp][key];
			else return null;
			},
		_GetDef: function(grp,key){
			if (_Exist(defPrefs[grp])&&_Exist(defPrefs[grp][key]))return defPrefs[grp][key];
			else return null;
			},
		_Set: function(grp,key,v){
			if (ID!=null){
				if (!_Exist(prefs[grp])) prefs[grp] = {};
				prefs[grp][key] = v;
				LS._SetVar(index+ID,prefs);
				}
			},
		_Raz: function(){
			prefs = {};
			LS._Delete(index+ID);
			}
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
	const css = 
		// Global
		[".BWELeft{text-align: left;padding: 1px;white-space: nowrap;}",
		".BWERight{text-align: right;padding: 1px;white-space: nowrap;}",
		".BWEMiddle{text-align: center;padding: 1px;white-space: nowrap;}",
		".BWELeftHeader{text-align: left;padding: 1px;white-space: nowrap;cursor: pointer;}",
		".BWERightHeader{text-align: right;padding: 1px;white-space: nowrap;cursor: pointer;}",
		".BWEMiddleHeader{text-align: center;padding: 1px;white-space: nowrap;cursor: pointer;}",
		".BWEInput{padding: 1px;margin:0px 2px;}",
		".BWEbold{font-weight: 700;}",
		".BWEtriSelect{color:lime;}",
		".BWEtriNoSelect{color:#A9A9A9;}",
		".BWEsexF{color:#AD00A5;}",
		".BWEsexH{color:#006BAD;}",
		// blink
		"@-moz-keyframes blinker {from {opacity:1;} 50% {opacity:0.1;} to {opacity:1;}}",
		"@-webkit-keyframes blinker {from {opacity:1;} to {opacity:0;}}",
		".BWEblink {-webkit-animation-name: blinker;-webkit-animation-iteration-count: infinite;-webkit-animation-timing-function: cubic-bezier(1.0,0,0,1.0);-webkit-animation-duration: 1s;",
		"-moz-animation-name: blinker;-moz-animation-iteration-count: infinite;-moz-animation-timing-function: cubic-bezier(1.0,0,0,1.0);-moz-animation-duration: 1s;}",
		// Bâtiment
		".BWEBuild{table-layout: fixed;}",
		".BWEBuild th{border:thin dotted black;}",
		".BWEBuild td{width: 100%;text-overflow: ellipsis;-o-text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}",
		".BWEBldChg{text-align: center;color: #FFF;background-color: #F07000;font-weight: 700;white-space: nowrap;cursor: pointer;padding: 1px;}",
		".BWEBldDel{text-align: center;color: #FFF;background-color: red;font-weight: 700;white-space: nowrap;cursor: pointer;padding: 1px;}",
		".BWEBldOk{text-align: center;color: #FFF;background-color: green;font-weight: 700;white-space: nowrap;cursor: pointer;padding: 1px;}",
		// Groupe
		".BWEGrp{table-layout: fixed;}",
		".BWEGrp td{width: 100%;text-overflow: ellipsis;-o-text-overflow: ellipsis;overflow:hidden;white-space: nowrap;}",
		".BWEGrpChg{text-align: center;color: #FFF;background-color: #F07000;font-weight: 700;white-space: nowrap;cursor: pointer;padding: 1px;}",
		".BWEGrpDel{text-align: center;color: #FFF;background-color: red;font-weight: 700;white-space: nowrap;cursor: pointer;padding: 1px;}",
		// historique
		".BWELog2{display: inline-block;vertical-align: middle;}",
		".BWELog3{height: 3px;width: 4px;margin: 1px 2px;}",
		".BWELogTD{border: thin dotted black;white-space: nowrap;padding: 1px;text-align: left;}",
		".BWELogTD2{width:100%;padding:1px 4px;white-space: nowrap;}",
		// Préférences
		".BWEPrefTD1{font-weight: 700;white-space: nowrap;padding: 1px;text-align: left;}",
		".BWEPrefTD2{white-space: nowrap;cursor: pointer;padding: 1px;text-align: left;}",
		".BWEPrefTD3{width: 10px;white-space: nowrap;padding: 1px;text-align: left;}",
		".BWEPrefTD3 a{cursor: pointer;}",
		".BWEHelp{border:0;vertical-align:middle;padding:3px 5px;}",
		".BWEAEButError{color:#FFF;background-color:red;}",
		".BWEMenu,.BWETabMsg{margin-left:auto;margin-right:auto;padding:0;border-collapse:collapse;}",
		".BWEselectLS,.BWEdivLS,.BWEdivIE{width:20em;height:20em;margin:0;}",
		".BWEdivLS,.BWEdivIE{overflow:auto;word-wrap:break-word;white-space:normal;}"],
		head = DOM._GetFirstNode("//head");
	if (head!=null){
		var even = getCssRules('.even'),
			selectedItem = getCssRules('.selectedItem');
		if (even!=null&&selectedItem!=null) css.push('.BWEeven{'+even.cssText+'}','.BWETR:hover{'+selectedItem.cssText+'}');
		IU._CreateElement('style',{'type':'text/css'},[css.join('')],{},head);
		}
	}
	
/******************************************************
* FUNCTIONS
******************************************************/
// Historique des embuscades
function UpdateHistory(att,def,msgId,msgDate,emb){
	var h = LS._GetVar('BWE:L:'+att+':'+def,[]),
		a = msgId,
		b = (_Type(msgDate)=='Date')?msgDate.getTime():null,
		c = emb;
	for(var i=0;i<PREF._Get('div','nbLo');i++){
		if (_Exist(h[i])){
			if (a!=h[i][0]){// message différent
				if (b!=null&&b>h[i][1]){//message plus récent.
					var temp = [a,b,c];
					a = h[i][0];
					b = h[i][1];
					c = h[i][2];
					h[i] = temp;
					}
				}
			else{// message identique.
				if (c!=null) h[i][2] = c;
				break;
				}
			}
		else{// pas de ligne à cette position.
			if (b!=null) h[i] = [a,b,c];
			break;
			}
		}
	if (h.length>PREF._Get('div','nbLo')) h = h.slice(0,PREF._Get('div','nbLo'));
	if (h.length>0) LS._SetVar('BWE:L:'+att+':'+def,h);
	}
function CreateHistory(att,def,node){
	// créé l'historique à la volée
	function CreateOverlib(e,i){ // i[0] = att, i[1] = def, i[2] = node, 
		var	histoIU = {'root':['div'],
			'table':['table',{'style':'border-collapse:collapse;'},,,'root'],
			'tr':['tr',{'class':'tblheader'},,,'table']},
			histo = IU._CreateElements(histoIU);
		var logCol = clone(PREF._Get('hlog','list'));
		for (var x=0;x<logCol.length;x++){
			if (logCol[x][1]!=1){logCol.splice(x,1);x--;}
			else{IU._CreateElement('th',{'class':'BWELogTD'},[L._Get("sColTitle")[logCol[x][0]]],{},histo['tr']);}
			}
		var j=0, h = LS._GetVar('BWE:L:'+i[0]+':'+i[1],[]);
		while (_Exist(h[j])&&j<nbLog){
			var overlib = IU._CreateElement('tr',{'class':(j%2==0?'even':'')},[],{},histo['table']);
			if (h[j][2]!=null&&_Exist(h[j][2][1])){
				for (var x=0; x<logCol.length; x++){
					var col = logCol[x][0]-31,
						newTD = IU._CreateElement('td',{'class':'BWELogTD','style':'vertical-align:top'},[],{},overlib);
					if (col==0){ // n°
						var	bgcolor = h[j][2][1]=='r'?'#707070'
								:h[j][2][1]=='n'?'#F07000'
								:h[j][2][1]=='v'?i[0]==ID?'#2A9F2A':'#DB0B32'
								:h[j][2][1]=='d'?i[0]==ID?'#DB0B32':'#2A9F2A'
								:'white';
						newTD.setAttribute('style','background-color:'+bgcolor+';vertical-align:middle;text-align:center;');
						newTD.textContent = j;
						}
					else if (col==1){ // Divers
						var div = PREF._Get('hdiv','list'),
							table = IU._CreateElement('table',{},[],{},newTD);
						for (var y=0; y<div.length; y++){
							if (div[y][1]==1){
								var ligne = div[y][0]-37,
									datas = '', tdClass = '';
								if (ligne==0){datas = (new Date(h[j][1])).toLocaleDateString();} // date
								else if (ligne==1&&h[j][2][0]!=''){datas = h[j][2][0]+'%';} // emb
								else if (ligne==2&&h[j][2][2]!=''){datas = h[j][2][2];tdClass = ' atkHit';} // PV Att.
								else if (ligne==3&&h[j][2][3]!=''){datas = h[j][2][3];tdClass = ' defHit';} // PV Déf.
								else if (ligne==4&&h[j][2][10].length>0){h[j][2][10].forEach(function(e){datas+=L._Get('sObjet')[e]+' ';});} // Objet Att.
								else if (ligne==5&&h[j][2][11].length>0){h[j][2][11].forEach(function(e){datas+=L._Get('sObjet')[e]+' ';});} // Objet Def.
								if (datas!='') IU._CreateElements({'tr':['tr',,,,table],
									'td1':['td',{'class':'BWEbold'},[L._Get('sColTitle')[div[y][0]]],,'tr'],
									'td2':['td',{'class':'BWERight BWELogTD2'+tdClass},[datas],,'tr']});
								}
							}
						}
					else if (col==2){ // Arcanes
						var table = IU._CreateElement('table',{},[],{},newTD),
							arcA = h[j][2][4], arcB = h[j][2][5], arc = {};
							for (var y=0;y<arcA.length;y++){arc[arcA[y][0]] = []; arc[arcA[y][0]][0] = arcA[y][1];}
							for (var y=0;y<arcB.length;y++){arc[arcB[y][0]] = _Exist(arc[arcB[y][0]])?arc[arcB[y][0]]:[]; arc[arcB[y][0]][1] = arcB[y][1];}
							for (var key in arc){
								IU._CreateElements({'tr':['tr',,,,table],
									'td1':['td',{'class':'BWEbold'},[L._Get('sArc')[key]],,'tr'],
									'td2':['td',{'class':'atkHit BWERight BWELogTD2'},[_Exist(arc[key][0])?arc[key][0]:''],,'tr'],
									'td3':['td',{'class':'defHit BWERight BWELogTD2'},[_Exist(arc[key][1])?arc[key][1]:''],,'tr']});
								}
						}
					else if (col==3){ // Evolutions
						var table = IU._CreateElement('table',{},[],{},newTD),
							evoA = h[j][2][6], evoB = h[j][2][7], evo = {};
							for (var y=0;y<evoA.length;y++){evo[evoA[y][0]] = []; evo[evoA[y][0]][0] = evoA[y][1];}
							for (var y=0;y<evoB.length;y++){evo[evoB[y][0]] = _Exist(evo[evoB[y][0]])?evo[evoB[y][0]]:[]; evo[evoB[y][0]][1] = evoB[y][1];}
							for (var key in evo){
								IU._CreateElements({'tr':['tr',,,,table],
									'td1':['td',{'class':'BWEbold'},[L._Get('sEvo')[key]],,'tr'],
									'td2':['td',{'class':'atkHit BWERight BWELogTD2'},[_Exist(evo[key][0])?evo[key][0]:''],,'tr'],
									'td3':['td',{'class':'defHit BWERight BWELogTD2'},[_Exist(evo[key][1])?evo[key][1]:''],,'tr']});
								}
						}
					else if (col==4){ // Caractéristiques
						var table = IU._CreateElement('table',{},[],{},newTD),
							ch = PREF._Get('hch','list'),
							chA = h[j][2][8], chB = h[j][2][9];
						for (var y=0;y<ch.length;y++){
							var index = ch[y][0]-43,
								cA = _Exist(chA[index])&&chA[index]!=null?chA[index]:'',
								cB = _Exist(chB[index])&&chB[index]!=null?chB[index]:'';
							if (ch[y][1]==1&&(cA!=''||cB!='')){
								IU._CreateElements({'tr':['tr',,,,table],
									'td1':['td',{'class':'BWEbold'},[L._Get('sColTitle')[ch[y][0]]],,'tr'],
									'td2':['td',{'class':'atkHit BWERight BWELogTD2'},[_Exist(chA[index])?chA[index]:''],,'tr'],
									'td3':['td',{'class':'defHit BWERight BWELogTD2'},[_Exist(chB[index])?chB[index]:''],,'tr']});
								}
							}
						}
					else if (col==5&&h[j][2][12].length>0){ // Ressources
						var Ga = PREF._Get('hres','list'),
							table = IU._CreateElement('table',{},[],{},newTD),
							res = h[j][2][12];
						for (var y=0;y<Ga.length;y++){
							var datas = _Exist(res[Ga[y][0]-56])?res[Ga[y][0]-56]:null;
							if (Ga[y][1]==1&&datas!=null){
								IU._CreateElements({'tr':['tr',,,,table],
									'td1':['td',{'class':'BWEbold'},[L._Get('sColTitle')[Ga[y][0]]],,'tr'],
									'td2':['td',{'class':'BWERight BWELogTD2'},[datas],,'tr']});
								}
							}
						}
					}
				}
			else if (logCol.length>=1){
				IU._CreateElement('td',{'class':'BWELogTD2','style':'background-color:white;color:black;','colspan':logCol.length},[(new Date(h[j][1])).toLocaleDateString()+' '+L._Get('sLogNC')],{},overlib);
				}
			j++;
			}
		IU._removeEvent(i[2],'mouseover',CreateOverlib);
		i[2].setAttribute('onmouseover',"return overlib('"+histo['root'].innerHTML+"',CAPTION,'"+L._Get('sLogVS',i[0]==ID?player:i[0],i[1]==ID?player:i[1])+"',CAPTIONFONTCLASS,'action-caption',RELX,10,WRAP);");
		i[2].onmouseover();
		}
	var actuTime = DATAS._Time(), 
		h = LS._GetVar('BWE:L:'+att+':'+def,[]),
		nbLog = PREF._Get('div','nbLo');
	if (actuTime!=null&&_Exist(h[0])&&_Exist(h[0][1])&&nbLog>0){
		//prépare les éléments de l'historique
		var actuH = 0, j = 0,
			delay = (actuTime.getTime()-h[0][1])/1000,
			delayABS = Math.abs(delay);
		delay = delayABS<60?L._Get('sLogTime1',Math.floor(delay))
			:delayABS<3600?L._Get('sLogTime2',Math.floor(delay/60))
			:delayABS<86400?L._Get('sLogTime3',Math.floor(delay/(3600)))
			:delayABS<31536000?L._Get('sLogTime4',Math.floor(delay/(86400)))
			:L._Get('sLogTime5');
		var rIU = {
			'span':['span',{'id':'BWElog','class':'BWEbold'},[delay],,node],
			'span2':['span',{'class':'BWELog2'},,,node]},
			r = IU._CreateElements(rIU);
		node.setAttribute('onmouseout','nd();');
		IU._addEvent(node,'mouseover',CreateOverlib,[att,def,node]);
		while (_Exist(h[j])&&_Exist(h[j][1])&&j<nbLog){
			var bgcolor = h[j][2]!=null&&_Exist(h[j][2][1])?h[j][2][1]=='r'?'#707070'
					:h[j][2][1]=='n'?'#F07000'
					:h[j][2][1]=='v'?att==ID?'#2A9F2A':'#DB0B32'
					:h[j][2][1]=='d'?att==ID?'#DB0B32':'#2A9F2A'
					:'white':'white';
			if (j==0) r['span'].setAttribute('style','color:'+bgcolor+';');
			IU._CreateElement('div',{'class':'BWELog3','style':'background-color:'+bgcolor+';'},[],{},r['span2']);
			if (new Date(h[j][1]).toDateString()==actuTime.toDateString()) actuH++;
			j++;
			}
		if (actuH>=2) r['span'].textContent = '*'+r['span'].textContent;
		}
	else{IU._CreateElement('span',{'id':'BWElog'},['-'],{},node);}
	}
// Gestion des groupes
// Pages Clan et Profil
function GroupTable(grId){
	function clickRaz(e,i){
		var	list = DOM._GetNodes("//tbody[@id='BWEgrp"+i[0]+"body']/tr");
		if (list!=null){
			for (var j=0;j<list.snapshotLength;j++){
				var name = decodeURIComponent(list.snapshotItem(j).getAttribute('id'));
				name = name.substring(10,name.length);
				checkGrp(null,[name,i[0]]);
				}
			}
		}
	function clickCol(e,i){ // i[0] = col
		var headerA = DOM._GetFirstNode("//tr[@id='BWEgrpAheader']"),
			headerB = DOM._GetFirstNode("//tr[@id='BWEgrpBheader']"),
			tbodyA =  DOM._GetFirstNode("//tbody[@id='BWEgrpAbody']"),
			tbodyB =  DOM._GetFirstNode("//tbody[@id='BWEgrpBbody']"),
			listA = DOM._GetNodes("./tr",tbodyA),
			listB = DOM._GetNodes("./tr",tbodyB),
			tri = PREF._Get('grp','tri'),
			oldColA = DOM._GetFirstNode("./th["+tri[0]+"]/span",headerA),
			oldColB = DOM._GetFirstNode("./th["+tri[0]+"]/span",headerB),
			newColA = DOM._GetFirstNode("./th["+i[0]+"]",headerA),
			newColB = DOM._GetFirstNode("./th["+i[0]+"]",headerB);
		if (oldColA!=null&&newColA!=null&&oldColB!=null&&newColB!=null){
			tri[1] = (i[0]==tri[0]&&tri[1]==1)?0:1;
			tri[0] = i[0];
			PREF._Set('grp','tri',tri);
			oldColA.parentNode.removeChild(oldColA);
			oldColB.parentNode.removeChild(oldColB);
			IU._CreateElement('span',{'class':'BWEtriSelect'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},newColA);
			IU._CreateElement('span',{'class':'BWEtriSelect'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},newColB);
			if (listA!=null) FctTriA(tri[0],tri[1],'grpA',tbodyA,listA);
			if (listB!=null) FctTriA(tri[0],tri[1],'grpB',tbodyB,listB);
			}
		}
	var r = DOM._GetFirstNode("//td[@id='BWEgrp"+grId+"']");
	if (r!=null){
		var grpIU = {
			'table':['table',{'class':'profile-stats BWEGrp','style':'width:100%','id':'BWEgrp'+grId+'table'},,,r],
			'thead':['thead',,,,'table'],
			'th00':['tr',,,,'thead'],
			'td001':['th',{'class':'BWEbold BWELeft','style':'width:79%','colspan':'3'},[L._Get('sGrp'+grId)],,'th00'],
			'td002':['th',{'style':'width:21%','colspan':'2'},,,'th00'],
			'div002':['div',{'class':'BWEGrpDel'},[L._Get('sRAZ')],{'click':[clickRaz,[grId]]},'td002'],
			'th01':['tr',{'class':'tblheader','id':'BWEgrp'+grId+'header'},,,'thead'],
			'tdh011':['th',{'id':'BWEgrp'+grId+'col27','class':'BWEbold BWELeftHeader','style':'width:33%'},[L._Get('sColTitle')[27]],{'click':[clickCol,[1]]},'th01'],
			'tdh012':['th',{'id':'BWEgrp'+grId+'col0','class':'BWEbold BWELeftHeader','style':'width:33%'},[L._Get('sColTitle')[0]],{'click':[clickCol,[2]]},'th01'],
			'tdh013':['th',{'id':'BWEgrp'+grId+'col7','class':'BWEbold BWELeftHeader','style':'width:13%'},[L._Get('sColTitle')[7]],{'click':[clickCol,[3]]},'th01'],
			'tdh015':['th',{'class':'BWEbold BWERight','style':'width:21%','colspan':'2'},[L._Get('sGrpAct')],,'th01'],
			'tbody':['tbody',{'id':'BWEgrp'+grId+'body'},,,'table'],
			'tfoot':['tfoot',,,,'table'],
			'trf00':['tr',,,,'tfoot'],
			'tdf000':['td',{'style':'height: 10px;','colspan':'5'},,,'trf00'],
			'trf01':['tr',,,,'tfoot'],
			'tdf010':['td',{'class':'BWEbold BWELeft','id':'BWEgrp'+grId+'_foot10'},,,'trf01'],
			'tdf011':['td',{'class':'BWERight'},[L._Get('sGrpTt')],,'trf01'],
			'tdf012':['td',{'class':'BWEbold BWELeft','id':'BWEgrp'+grId+'_foot12'},,,'trf01'],
			'tdf013':['td',{'class':'BWEbold BWELeft','id':'BWEgrp'+grId+'_foot13','colspan':'2'},,,'trf01'],
			'trf02':['tr',,,,'tfoot'],
			'tdf020':['td',{'class':'BWELeft','id':'BWEgrp'+grId+'_foot20'},,,'trf02'],
			'tdf021':['td',{'class':'BWERight'},[L._Get('sGrpMoy')],,'trf02'],
			'tdf022':['td',{'class':'BWEbold BWELeft','id':'BWEgrp'+grId+'_foot22'},,,'trf02'],
			'tdf023':['td',{'class':'BWEbold BWELeft','id':'BWEgrp'+grId+'_foot23','colspan':'2'},,,'trf02']
			},
			grpNode = IU._CreateElements(grpIU);
		var grp = LS._GetVar('BWE:G:'+ID,{'A':[],'B':[]});
		for (var i=0;i<grp[grId].length;i++){
			appendGrpRow(grpNode['tbody'],grp[grId][i],grId);
			}
		var tri = PREF._Get('grp','tri');
		IU._CreateElement('span',{'class':'BWEtriSelect'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},grpNode['tdh01'+tri[0]]);
		var list = DOM._GetNodes("./tr",grpNode['tbody']);
		if (list!=null) FctTriA(tri[0],tri[1],'grp'+grId,grpNode['tbody'],list);
		updateGrpFoot(grId);
		}
	}
function checkGrp(e,i){// i[0] = name, i[1] = id
	var grp = LS._GetVar('BWE:G:'+ID,{'A':[],'B':[]}),
		grId = grp['A'].indexOf(i[0])>-1?'A':grp['B'].indexOf(i[0])>-1?'B':'',
		tri = PREF._Get('grp','tri');
	if (grId!=''){
		var	grpRow = DOM._GetFirstNode("//tr[@id='"+encodeURIComponent('BWEgrp'+grId+'tr_'+i[0])+"']");
		if (grpRow!=null) grpRow.parentNode.removeChild(grpRow);
		var	tbody = DOM._GetFirstNode("//tbody[@id='BWEgrp"+grId+"body']"),
			list = DOM._GetNodes("./tr",tbody);
		if (tbody!=null&&list!=null) FctTriA(tri[0],tri[1],'grp'+grId,tbody,list);
		updateGrpFoot(grId);
		grp[grId].splice(grp[grId].indexOf(i[0]),1);
		}
	if (grId==i[1]) grId='';
	else{
		var	tbody = DOM._GetFirstNode("//tbody[@id='BWEgrp"+i[1]+"body']");
		if (tbody!=null){
			appendGrpRow(tbody,i[0],i[1]);
			var list = DOM._GetNodes("./tr",tbody);
			if (list!=null) FctTriA(tri[0],tri[1],'grp'+i[1],tbody,list);
			}
		updateGrpFoot(i[1]);
		grp[i[1]].push(i[0]);
		grId = i[1];
		}
	LS._SetVar('BWE:G:'+ID,grp);
	var checkA = DOM._GetFirstNode("//input[@id='"+encodeURIComponent('BWEcheckA_'+i[0])+"']"),
		checkB = DOM._GetFirstNode("//input[@id='"+encodeURIComponent('BWEcheckB_'+i[0])+"']");
	if (checkA!=null) checkA.checked = grId=='A'?true:false;
	if (checkB!=null) checkB.checked = grId=='B'?true:false;
	}
function appendGrpRow(tbody,name,grId){
	var v = LS._GetVar('BWE:P:'+name,{}),
		races = L._Get('sRaces'),
		race = _Exist(v['R'])&&_Exist(races[v['R']])?races[v['R']]:'-';
	var trIU = {
		'tr01':['tr',{'id':encodeURIComponent('BWEgrp'+grId+'tr_'+name)},,,tbody],
		'td010':['td',{'class':'BWELeft'},,,'tr01'],
		'a0100':['a',(_Exist(v['U'])?{'href':'?a=profile&uid='+v['U']}:{}),[name],,'td010'],
		'td011':['td',{'class':'BWELeft'},[race],,'tr01'],
		'td012':['td',{'class':'BWELeft'},[(_Exist(v['N'])&&_Exist(v['P']))?v['N']+' ('+v['P']+')':'-'],,'tr01'],
		'td013':['td',,,,'tr01'],
		'div013':['div',{'class':'BWEGrpChg'},[('->'+(grId=='A'?'B':'A'))],{'click':[checkGrp,[name,(grId=='A'?'B':'A')]]},'td013'],
		'td014':['td',,,,'tr01'],
		'div014':['div',{'class':'BWEGrpDel'},['X'],{'click':[checkGrp,[name,grId]]},'td014']
		};
	IU._CreateElements(trIU);
	}
function updateGrpFoot(grId){
	var	list = DOM._GetNodes("//tbody[@id='BWEgrp"+grId+"body']/tr"),
		lvlsum = 0,	ptssum = 0;
	if (list!=null){
		for (var i=0;i<list.snapshotLength;i++){
			var r = new RegExp(L._Get('sTriPtsTest')).exec(DOM._GetFirstNodeTextContent("./td[3]",null,list.snapshotItem(i)));
			if (r!=null){
				lvlsum+=Number(parseInt(r[1]));
				ptssum+=Number(parseInt(r[2]));
				}
			}
		var nb = list.snapshotLength,
			fnb = DOM._GetFirstNode("//td[@id='BWEgrp"+grId+"_foot10']"),
			flvlsum = DOM._GetFirstNode("//td[@id='BWEgrp"+grId+"_foot12']"),
			fptssum = DOM._GetFirstNode("//td[@id='BWEgrp"+grId+"_foot13']"),
			flvlaverage = DOM._GetFirstNode("//td[@id='BWEgrp"+grId+"_foot22']"),
			fptsaverage = DOM._GetFirstNode("//td[@id='BWEgrp"+grId+"_foot23']");
		if (fnb!=null) fnb.textContent = (nb>1?L._Get('sGrpPls',nb):L._Get('sGrpPl',nb));
		if (flvlsum!=null) flvlsum.textContent = lvlsum;
		if (fptssum!=null) fptssum.textContent = ptssum;
		if (flvlaverage!=null) flvlaverage.textContent = nb>0?Math.floor(lvlsum/nb):0;
		if (fptsaverage!=null) fptsaverage.textContent = nb>0?Math.floor(ptssum/nb):0;
		}
	}
function showHideGr(e,i){//i[0]= node title,i[1]= node trA,i[2]= node trB
	var show = PREF._Get('grp','sh')==1?0:1;
	PREF._Set('grp','sh',show);
	i['1'].setAttribute('style','display:'+(show==1?'table-row;':'none;'));
	i['2'].setAttribute('style','display:'+(show==1?'table-row;':'none;'));
	i[0].setAttribute('style','color:'+(show==1?'lime;':'red;')+';cursor: pointer;');
	}
function BuildTable(table,list){
	function clickCol(e,i){ // i[0] = col
		var header = DOM._GetFirstNode("//tr[@id='BWE"+p+"header']"),
			tbody =  DOM._GetFirstNode("//tbody[@id='BWE"+p+"body']");
		if (header!=null&&tbody!=null){
			var tri = PREF._Get(p,'tri'),
				oldCol = DOM._GetFirstNode("./th["+tri[0]+"]/span",header),
				newCol = DOM._GetFirstNode("./th["+i[0]+"]",header);
			tri[1] = (i[0]==tri[0]&&tri[1]==1)?0:1;
			tri[0] = i[0];
			PREF._Set(p,'tri',tri);
			if (oldCol!=null&&newCol!=null){
				oldCol.parentNode.removeChild(oldCol);
				IU._CreateElement('span',{'class':'BWEtriSelect'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},newCol);
				}
			var list = DOM._GetNodes("./tr",tbody);
			if (list!=null) FctTriA(tri[0],tri[1],p,tbody,list);
			}
		}
	var	headIU = {'tr2':['tr',{'class':'tblheader','id':'BWE'+p+'header'},,,table['thead']],
			'th21':['th',{'id':'BWE'+p+'col73','class':'BWEMiddleHeader','style':'width:7%;'},[L._Get('sColTitle')[73]],{'click':[clickCol,[1]]},'tr2'],
			'th22':['th',{'id':'BWE'+p+'col74','class':'BWELeftHeader','style':'width:26%;'},[L._Get('sColTitle')[74]],{'click':[clickCol,[2]]},'tr2'],
			'th23':['th',{'id':'BWE'+p+'col75','class':'BWEMiddleHeader','style':'width:8%;'},[L._Get('sColTitle')[75]],{'click':[clickCol,[3]]},'tr2'],
			'th24':['th',{'id':'BWE'+p+'col76','class':'BWERightHeader','style':'width:12%;'},[L._Get('sColTitle')[76]],{'click':[clickCol,[4]]},'tr2'],
			'th25':['th',{'id':'BWE'+p+'col77','class':'BWERightHeader','style':'width:12%;'},[L._Get('sColTitle')[77]],{'click':[clickCol,[5]]},'tr2'],
			'th26':['th',{'id':'BWE'+p+'col78','class':'BWERightHeader','style':'width:12%;'},[L._Get('sColTitle')[78]],{'click':[clickCol,[6]]},'tr2'],
			'th27':['th',{'id':'BWE'+p+'col79','class':'BWERightHeader','style':'width:13%;'},[L._Get('sColTitle')[79]],{'click':[clickCol,[7]]},'tr2'],
			'th28':['th',{'id':'BWE'+p+'col80','style':'width:10%;','colspan':'2'},[L._Get('sColTitle')[80]],,'tr2']},
		head = IU._CreateElements(headIU),
		bldPgr = DOM._GetFirstNode("//div[@id='content-mid']/div[@class='bldprogress']"),
		bldNameUp = DOM._GetFirstNodeTextContent("./self::div[contains(.,'"+L._Get('sBuildPrgUp')+"')]/b","",bldPgr),
		bldNameDown = DOM._GetFirstNodeTextContent("./span[contains(.,'"+L._Get('sBuildPrgDown')+"')]/b","",bldPgr),
		bldPgrStop = DOM._GetFirstNode("./span[@id='bld_action_a']/a",bldPgr);
	for (var i=0;i<list.snapshotLength;i++){
		var nodeZone = DOM._GetFirstNode("./preceding-sibling::div[@class='strefaheader'][1]",list.snapshotItem(i)),
			content = DOM._GetFirstNode("(.//table)[last()]//td[2]",list.snapshotItem(i)),
			title = DOM._GetFirstNode(".//span[@class='bldheader']",list.snapshotItem(i));
		if (title!=null&&content!=null&&nodeZone!=null){
			var zone = nodeZone!=null?(new RegExp(L._Get('sBuildZone')).exec(nodeZone.textContent)):null,
				nodeLvl = DOM._GetFirstNode("./following-sibling::b",title),
				lvl = nodeLvl!=null?(new RegExp(L._Get('sBuildNiv')).exec(nodeLvl.textContent)):null,
				lvl = lvl!=null?lvl[1]:0,
				inUp = bldNameUp.replace(new RegExp('[\'"`]','g'),'')==title.textContent.replace(new RegExp('[\'"`]','g'),''),
				inDown = bldNameDown.replace(new RegExp('[\'"`]','g'),'')==title.textContent.replace(new RegExp('[\'"`]','g'),''),
				upOk = DOM._GetFirstNode(".//a[(contains(.,'"+L._Get('sBuildNewOk')+"') or contains(.,'"+L._Get('sBuildUpOk')+"')) and @class='enabled']",content),
				upNo = DOM._GetFirstNode(".//span[(contains(.,'"+L._Get('sBuildNewOk')+"') or contains(.,'"+L._Get('sBuildUpOk')+"')) and @class='disabled']",content),
				downOk = DOM._GetFirstNode(".//a[contains(.,'"+L._Get('sBuildDownOk')+"')]",list.snapshotItem(i)),
				nodeLol = DOM._GetFirstNode(".//span[contains(.,'"+L._Get('sBuildlol')+"')]",content),
				lol = nodeLol!=null?new RegExp("([0-9 ]+) "+L._Get('sBuildlol')).exec(nodeLol.textContent):null,
				nodeMdo = DOM._GetFirstNode(".//span[contains(.,'"+L._Get('sBuildMdo')+"')]",content),
				mdo = nodeMdo!=null?new RegExp("([0-9 ]+) "+L._Get('sBuildMdo')).exec(nodeMdo.textContent):null,
				nodeSang = DOM._GetFirstNode(".//span[contains(.,'"+L._Get('sBuildSang')+"')]",content),
				sang = nodeSang!=null?(new RegExp("([0-9 ]+) "+L._Get('sBuildSang')).exec(nodeSang.textContent)):null,
				t = new RegExp(L._Get('sBuildTime')+L._Get('sTriOLTest')).exec(content.innerHTML),
				time = t!=null?(t[1]?L._Get('sLogTime4',t[1])+' ':'')+(t[2]?('0'+t[2]).slice(-2):'00')+':'+(t[3]?('0'+t[3]).slice(-2):'00')+':'+(t[4]?('0'+t[4]).slice(-2):'00'):'?',
				overT = content.innerHTML.replace(new RegExp('[\x00-\x1F]','g'),'').replace(new RegExp('([\'"])','g'),'\\\$1'),
				ligneIU = {'tr':['tr',{'onmouseout':'nd();','onmouseover':'return overlib(\'<table><tbody><tr><td style=\"text-align: justify; vertical-align: top; width: 400px;\">'+overT+'</td></tr></tbody></table>\',CAPTION,\''+title.textContent+'\',CAPTIONFONTCLASS,\'action-caption\',HAUTO,WRAP);'},,,table['tbody']],
					'td1':['td',{'class':'BWEMiddle'},[(zone!=null?zone[1]:"?")],,'tr'],
					'td2':['td',{'class':((inUp||upOk!=null)?'enabled':(inDown?'disabled':''))},[title.textContent],,'tr'],
					'td3':['td',{'class':'BWEMiddle'+(inUp?' enabled':(inDown?' disabled':''))},[lvl+((inUp||inDown)?('->'+(Number(lvl)+(inUp?1:-1))):'')],,'tr'],
					'td4':['td',{'class':'BWERight'+(nodeSang!=null?' '+nodeSang.className:'')},[(sang!=null?sang[1]:"")],,'tr'],
					'td5':['td',{'class':'BWERight'+(nodeLol!=null?' '+nodeLol.className:'')},[(lol!=null?lol[1]:"")],,'tr'],
					'td6':['td',{'class':'BWERight'+(nodeMdo!=null?' '+nodeMdo.className:'')},[(mdo!=null?mdo[1]:"")],,'tr'],
					'td7':['td',{'class':'BWERight'+(upOk==null&&upNo==null?' disabled':'')},[(upOk==null&&upNo==null?L._Get('sBuildMaxLvl'):time)],,'tr'],
					'td8':['td',{'class':'BWEMiddle'},,,'tr'],
					'td9':['td',{'class':'BWEMiddle'},,,'tr']},
				ligne = IU._CreateElements(ligneIU);
			if (upOk!=null) IU._CreateElement('div',{'class':'BWEBldOk'},['->'+(Number(lvl)+1)],{'click':[function(e,link){window.location.href=link;},upOk.href]},ligne['td8']);
			else if (inUp&&bldPgrStop!=null) IU._CreateElement('div',{'class':'BWEBldChg'},['X'],{'click':[function(){window.location.href=bldPgrStop.href;}]},ligne['td8']);
			else IU._CreateElement('div',{'class':'BWEMiddle'},['-'],{},ligne['td8']);
			if (downOk!=null) IU._CreateElement('div',{'class':'BWEBldDel'},['->'+(Number(lvl)-1)],{'click':[function(e,link){window.location.href=link;},downOk.href]},ligne['td9']);
			else if (inDown&&bldPgrStop!=null) IU._CreateElement('div',{'class':'BWEBldChg'},['X'],{'click':[function(){window.location.href=bldPgrStop.href;}]},ligne['td9']);
			else IU._CreateElement('div',{'class':'BWEMiddle'},['-'],{},ligne['td9']);
			if (inUp||inDown){
				ligne['td7'].setAttribute('id','BWEBuildTime');
				ligne['td7'].classList.add('BWEbold',(inUp?'enabled':'disabled'));
				var observer = new MutationObserver(function(mutations){
					var tTime = DOM._GetFirstNode("//td[@id='BWEBuildTime']"),
						bldPgrTime = DOM._GetFirstNodeTextContent("//div[@id='content-mid']/div[@class='bldprogress']/span[@id='bld_action']","");
					if (tTime!=null) tTime.textContent = bldPgrTime;
					});
				observer.observe(bldPgr,{childList:true,subtree:true,characterData:true});
				}
			}
		}
	var tri = PREF._Get(p,'tri');
	IU._CreateElement('span',{'class':'BWEtriSelect'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},head['th2'+tri[0]]);
	var list = DOM._GetNodes("./tr",table['tbody']);
	if (list!=null) FctTriA(tri[0],tri[1],p,table['tbody'],list);
	}
// Alimente un tableau déjà créé au format suivant :
// - table ('id':'BWE'+p+'table')
// - head (child de table) -> tr ('id':'BWE'+p+'header')
// - tbody (child de table,'id':'BWE'+p+'body')
// header = ancien en-tête, list = liste des TR du tableau à copier
function MixteTable(header,list,p){
	function clickCol(e,i){ // i[0] = col, i[1] = p
		var header = DOM._GetFirstNode("//tr[@id='BWE"+i[1]+"header']"),
			tbody =  DOM._GetFirstNode("//tbody[@id='BWE"+i[1]+"body']"),
			list = DOM._GetNodes("./tr",tbody),
			tri = PREF._Get(i[1],'tri'),
			oldCol = DOM._GetFirstNode("./td["+tri[0]+"]/span",header),
			newCol = DOM._GetFirstNode("./td["+i[0]+"]",header);
		if (oldCol!=null&&newCol!=null){
			tri[1] = (i[0]==tri[0]&&tri[1]==1)?0:1;
			tri[0] = i[0];
			PREF._Set(i[1],'tri',tri);
			oldCol.parentNode.removeChild(oldCol);
			IU._CreateElement('span',{'class':'BWEtriSelect'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},newCol);
			if (list!=null) FctTriA(tri[0],tri[1], i[1],tbody,list);
			}
		}
	function GetLvl(v){
		if (!isNaN(v)&&parseInt(v)==Number(v)){
			var lvl = Math.floor(Math.log(1.1*v)/Math.log(1.1)),
				lvlSup = Math.floor(Math.log(0.0011*(v*1000+999))/Math.log(1.1));
			return new Array(lvl,lvlSup,(lvl!=lvlSup?lvl+"-"+lvlSup:lvl));
			}
		else return new Array('-','-','-');
		}
	var newHead = DOM._GetFirstNode("//tr[@id='BWE"+p+"header']"),
		newBody = DOM._GetFirstNode("//tbody[@id='BWE"+p+"body']");
	if (newHead!=null&&newBody!=null){
		var newCol = clone(PREF._Get(p,'list')),
			tri = PREF._Get(p,'tri'),
			id = ['pTownview','pRank','pOAliance','pAliance'].indexOf(p)==-1?null:p,
			idx = {'pTownview':["./td[2]/a",null,4,6,7],// name,niv,pts,race,sexe
				'pRank':["./td[2]/a/b",null,8,3,4],
				'pOAliance':["./td[1]/a",5,6,null,null],
				'pAliance':["./td[1]/a",5,6,null,null]};
		// en-têtes et suppression des colonnes inutiles
		for (var i=0; i<newCol.length; i++){
			if (newCol[i][1]!=1){newCol.splice(i,1);i--;}
			else{
				var col = newCol[i][0];
				if (col!=-1){
					var	newTD = IU._CreateElement('td',{},[],{});
					if (newCol[i][2]!=-1){ // en-tête existante
						var td = DOM._GetFirstNode("./td["+newCol[i][2]+"]",header);
						if (td!=null){
							newTD = td.cloneNode(true);
							if ([62,65].indexOf(col)==-1) newTD.removeAttribute('width');
							newTD.removeAttribute('style');
							}
						}
					else{ // en-tête à créer
						if ([17,18,19,22].indexOf(col)==-1) newTD.textContent = L._Get("sColTitle")[col];
						if (col==22) IU._CreateElement('img',{'style':"width:16px; height:16px; vertical-align:middle;",'src':"data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%02%1FIDATx%DAcd%20%12%9C%3CyB%FF%F2%E5%CB5%3F%7F%FE%D2%FA%F7%FF%9F%D6%E9S%A7%E7-Z%B4(%99%91X%03v%ED%DA%C1%EF%E6%E6%F1q%CA%94I%FF%BF%7D%FF%CE%B0w%EF%DE%AE%9D%3Bv%95%E34%E0%DA%B5%AB%F6%BF%7F%FDb%F8%F9%EB%D7%0333%F3%87%13%26%F4%E9%0B%89%08%1Dx%FB%E6%9D%C0%D7%AF_%18%0E%1E8%5C%BB%7B%F7%EE%16%0C%03v%ED%DC%11%FF%EF%DF%FFI%CF%9E%3D%E1%FB%F9%E3%17%03%03P%C5%DF%7F%7FO%B0%B1%B1i%BC%FF%F0%9E%E9%E3%C7%8F~m%AD%1D%07%DD%DD%DD3w%EE%DC9%1D%C5%80%E3%C7%0F%FB%3F%7C%F8d%C3%B3%A7O.%FC%FC%F9%A3%E1%DB%B7o%1F~%FC%FC%E5%A0%A8%A8X%F0%FD%FBw%81%5B%B7n9%CC%9C9%FB%20%B2%1E%14%03%E6%CF%9B%F7%F8%DE%FD%BBo%9A%9B%5B%0D%91%C5%17%2C%9Co%FF%EB%D7%AF%03%87%0E%1FnZ%B2hI%3DV%03f%CC%9C%AE%FF%E3%DB%F7%0B%17%2F_J%98%3Fo%C1Bt%AF%B5%B4%B6%9C%BF%7F%FF%DE%87%B9s%E69b5%A0%B5%AD%D5%FE%FB%D7%AF%07._%BD%E2%B0q%C3%A6%83%E8%06%14%97%14%ED%7F%F7%F6%1D%C3%FC%F9%0B%B0%1B%60hl%C8ook%FF%E1%E6%AD%9B%0B%B6o%DB%9E%88%AC%C8%DB%CF%9B_%5DU%ED%C1%B3%E7%CF7%ACX%B6%22%11%AB%01%20%10%9F%10%3F%FF%DB%D7o%09%2C%AC%2C%05%CB%97-%9F%08%12%B3s%B0%E3WQV9%C0%CE%CEnp%FD%C6u%87%03%FB%0E%E0%0ED%0F%2F%0F~nN%AE%03%9C%9C%9C%06%BF%FF%FCy%F0%EF%DF%BF%07%2C%CC%CC%0El%EC%EC%0C%EF%DE%BDI%D8%BCi%2BF%D8%60MH%F6%0E%F6%F1%26%C6%26%09%8F%1E%3Dr%F8%FA%ED%EB%84%E7%2F%9EO8%7F%F6%FCCljq%A6%C4%9E%DE%9E%FA%FD%07%F67l%DD%BC%15or%C7*%99%98%98x%FC%C7%8F%1F%16_%BF%7CaP%D7%D0%60%B8z%EDj%FF%B6%AD%DB%8AHr%01%08%B8%B9%B9%FD%DF%B5k%17%E9.%80%01%5B%3B%DB%FF%87%0F%1D%C6%AB%06%00%A2%EE%06%20%5B%F9%3D%19%00%00%00%00IEND%AEB%60%82"},[],{},newTD);
						}
					if (tri!=null){
						IU._addEvent(newTD,'click',clickCol,[i+1,p]);
						newTD.classList.add(_Exist(newCol[i][3])?['BWELeftHeader','BWEMiddleHeader','BWERightHeader'][newCol[i][3]]:'BWELeftHeader');
						}
					else newTD.classList.add(_Exist(newCol[i][3])?['BWELeft','BWEMiddle','BWERight'][newCol[i][3]]:'BWELeft');
					newTD.setAttribute('id','BWE'+p+'col'+newCol[i][0]);
					newHead.appendChild(newTD);
					}
				}
			}
		// body
		for (var j=0; j<list.snapshotLength; j++){
			var oldTR = list.snapshotItem(j),
				newTR = IU._CreateElement('tr',{'class':'BWETR'+(j%2==0?'':' BWEeven')},[],{},newBody),
				name = id!=null?DOM._GetFirstNodeTextContent(idx[p][0]+'/text()','',oldTR).trim():'',
				v = {}; 
			if (name!=''){
				v = LS._GetVar('BWE:P:'+name,{});
				var niv = idx[p][1]!=null?DOM._GetFirstNodeTextContent("./td["+idx[p][1]+"]",null,oldTR):null,
					pts = idx[p][2]!=null?DOM._GetFirstNodeTextContent("./td["+idx[p][2]+"]",null,oldTR):null,
					race = idx[p][3]!=null?DOM._GetFirstNodeTextContent("./td["+idx[p][3]+"]",null,oldTR):null,
					sexe = idx[p][4]!=null?DOM._GetFirstNodeTextContent("./td["+idx[p][4]+"]",null,oldTR):null;
				if (niv!=null) v['N'] = niv;
				if (pts!=null){
					v['P'] = Number(pts);
					if (!_Exist(v['N'])||(_Exist(v['N'])&&v['N']<GetLvl(v['P'])[0])) v['N']=GetLvl(v['P'])[2];
					}
				if (race!=null) v['R'] = L._Get('sRaces').indexOf(race);
				if (sexe!=null) v['S'] = sexe;
				if (p=='pRank'&&name==player){
					var rank = DOM._GetFirstNodeTextContent("./td[1]",null,oldTR);
					if (rank!=null) v['C'] = Number(rank);
					}
				var uid = /^\?a=profile&uid=(\d*)$/.exec(DOM._GetFirstNode(idx[p][0],oldTR).getAttribute('href'));
				if (uid!=null) v['U'] = uid[1];
				LS._SetVar('BWE:P:'+name,v);
				}
			for (var i=0; i<newCol.length; i++){
				var newTD, col = newCol[i][0];
				if (newCol[i][2]!=-1){ // colonne existante
					var td = DOM._GetFirstNode("./td["+newCol[i][2]+"]",oldTR);
					if (td!=null){
						newTD = newTR.appendChild(td.cloneNode(true));
						newTD.removeAttribute('width');
						newTD.removeAttribute('style'); 
						}
					if (col==24){
						newTD.setAttribute('width','18px');
						if (name!=''&&PREF._Get('AE','sh')==1){
							var	img = DOM._GetFirstNode(".//img",newTD);
							if (img!=null&&img.src.indexOf('/0.gif')!=-1){
								if (_Exist(v['P'])){
									var lvl = GetLvl(v['P'])[0],
										olvl = DATAS._PlayerLevel(),
										cla = p=='pRank'?Number(DOM._GetFirstNodeTextContent("./td[1]",0,oldTR)):null,
										oCla = _Exist(plDatas['C'])?plDatas['C']:null,
										checkNiv = (PREF._Get('AE','nMin')!=''?lvl>=Number(PREF._Get('AE','nMin')):true)&&(PREF._Get('AE','nMax')!=''?lvl<=Number(PREF._Get('AE','nMax')):true)&&(PREF._Get('AE','aMin')!=''?lvl>=(olvl-(olvl*Number(PREF._Get('AE','aMin'))/100)):true)&&(PREF._Get('AE','aMax')!=''?lvl<=(olvl+(olvl*Number(PREF._Get('AE','aMax'))/100)):true),
										checkCla = p=='pRank'&&cla!=0&&oCla!=null&&(PREF._Get('AE','cMin')!=''?cla>=Number(PREF._Get('AE','cMin')):true)&&(PREF._Get('AE','cMax')!=''?cla<=Number(PREF._Get('AE','cMax')):true)&&(PREF._Get('AE','acMin')!=''?cla>=(oCla-Number(PREF._Get('AE','acMin'))):true)&&(PREF._Get('AE','acMax')!=''?cla<=(oCla+Number(PREF._Get('AE','acMax'))):true);
									if (checkNiv&&(p!='pRank'||checkCla)) img.className = 'BWEblink';
									}
								}
							}
						}
					else if (col==62){
						var	check = DOM._GetFirstNode("./input",td);
						if (check!=null) IU._addEvent(newTD,'change',function(e,i){i.checked = e.target.checked;},check);
						}
					}
				else{ // colonne à créer
					newTD = IU._CreateElement('td',{},[],{},newTR);
					if (col==0){
						var races = L._Get('sRaces');
						newTD.textContent = _Exist(v['R'])&&_Exist(races[v['R']])?races[v['R']]:'-';
						}
					else if (col==1){
						newTD.textContent = _Exist(v['S'])?v['S']:'-';
						newTD.className = 'BWELeft '+(_Exist(v['S'])?v['S']==L._Get('sSexeH')?'BWEsexH':'BWEsexF':'');
						}
					else if (col==5){
						newTD.textContent = _Exist(v['P'])?GetLvl(v['P'])[2]:'-';
						}
					else if (col==7){
						newTD.textContent = _Exist(v['P'])?L._Get('sNivFormat',(_Exist(v['N'])?v['N']:GetLvl(v['P'])[2]),v['P']):'-';
						}
					if (col==17||col==18||col==19){
						var img = DOM._GetFirstNode("./td[2]/img["+(col==17?1:(col==18?2:3))+"]",oldTR);
						if (img!=null){
							newTD.className = "";
							newTD.appendChild(img.cloneNode(true));
							}
						}
					else if (col==21){
						if (name==''){newTD.textContent = '-';}
						else{
							var grp = LS._GetVar('BWE:G:'+ID,{'A':[],'B':[]});
							IU._CreateElements({'checkA':['input',{'class':'BWEInput','type':'checkbox','id':encodeURIComponent('BWEcheckA_'+name),'checked':(grp['A'].indexOf(name)>-1)},,{'change':[checkGrp,[name,'A']]},newTD],
										'checkB':['input',{'class':'BWEInput','type':'checkbox','id':encodeURIComponent('BWEcheckB_'+name),'checked':(grp['B'].indexOf(name)>-1)},,{'change':[checkGrp,[name,'B']]},newTD]});
							}
						}
					else if (col==22){
						newTD.textContent = _Exist(v['S'])?v['S']:'-';
						newTD.className = _Exist(v['S'])?(v['S']==L._Get('sSexeH')?'BWEsexH':'BWEsexF'):'';
						}
					else if (col==23){
						if (name=='') newTD.textContent = '-';
						else CreateHistory(ID,name,newTD);
						}
					else if (col==25){
						if (name=='') newTD.textContent = '-';
						else CreateHistory(name,ID,newTD);
						}
					else if (col==81){
						var r = _Exist(v['P'])?v['P']-Math.floor(plDatas['P']/1000):null;
						newTD.textContent = r!=null?(r>0?'+':'')+r:'-';
						}
					}
				newTD.classList.add(_Exist(newCol[i][3])?['BWELeft','BWEMiddle','BWERight'][newCol[i][3]]:'BWELeft');
				}
			}
		// tri du nouveau tableau
		if (tri!=null){
			if (tri[0]>newCol.length){
				tri = [1,1];
				PREF._Set(p,'tri',tri);
				}
			var selectCol = DOM._GetFirstNode("./td["+tri[0]+"]",newHead),
				newList = DOM._GetNodes("./tr",newBody);
			IU._CreateElement('span',{'class':'BWEtriSelect'},[(tri[1]==1?L._Get('sTriUp'):L._Get('sTriDown'))],{},selectCol);
			if (newList!=null) FctTriA(tri[0],tri[1],p,newBody,newList);
			}
		else {
			}
		}
	}
// Divers
function FctTriA(key,order,p,tbody,list){
	var list2 = [],
		header = DOM._GetFirstNode("//tr[@id='BWE"+p+"header']/td["+key+"]|//tr[@id='BWE"+p+"header']/th["+key+"]"),
		id = header!=null?parseInt(header.id.replace(new RegExp('BWE'+p+'col','g'),'')):0;
	for (var i=0; i<list.snapshotLength; i++){
		var col = DOM._GetFirstNode("./td["+key+"]",list.snapshotItem(i));
		if (col!=null){
			var v = col.textContent.trim().toLowerCase(); // tri de base - texte
			if ([3,15,27,29,64,67,69,72].indexOf(id)!=-1){ // texte avec lien
				var isA = DOM._GetFirstNode("./a", col);
				if (isA!=null) v = isA.textContent.toUpperCase();
				}
			else if ([5,6,26,28,66,73,75,76,77,78,81].indexOf(id)!=-1){ // chiffre + quartier + classement
				var r = new RegExp(L._Get('sTriNbTest')).exec(v);
				if (r!=null) v = parseInt(r[1].replace(new RegExp('[ ]','g'),''));
				else if (v=='∞') v = Number.POSITIVE_INFINITY;
				else v = -1;
				}
			else if ([16,17].indexOf(id)!=-1){ // en ligne
				var isIMG = DOM._GetFirstNode("./img", col),
					r = new RegExp(L._Get('sTriOLTest')).exec(isIMG!=null?isIMG.alt:v);
				if (r!=null) v = (r[1]?parseInt(r[1]):0)*86400+(r[2]?parseInt(r[2]):0)*3600+(r[3]?parseInt(r[3]):0)*60+(r[4]?parseInt(r[4]):0);
				else v = 0;
				}
			else if ([18,19].indexOf(id)!=-1){ // Rdc + Expé
				var isIMG = DOM._GetFirstNode(".//img", col);
				if (isIMG!=null){
					var r = new RegExp(L._Get('sTriImgTest')).exec(isIMG.src);
					if (r!=null) v=(r[1]=='ok'?0:1);
					else v = isIMG.src;
					}
				}
			else if ([8,21].indexOf(id)!=-1){ // Groupe
			var isInput = DOM._GetFirstNode("./input[1]", col),
				isInput2 = DOM._GetFirstNode("./input[2]", col);
				if (isInput!=null&&isInput2!=null){
					v = (isInput.checked?"0":"1")+(isInput2.checked?"0":"1");
					}
				}
			else if ([23,25].indexOf(id)!=-1){ //ATT - DEF
				var temp = v.replace('*',''),
					r = new RegExp("^(-?[0-9]+)").exec(temp);
				if (v=='-') v = 31708800; // 367jrs
				else if (r!=null){
					if (temp==L._Get('sLogTime5')) v = 31622400; // 366jrs
					else if (temp==L._Get('sLogTime1',r[1])) v = r[1];
					else if (temp==L._Get('sLogTime2',r[1])) v = r[1]*60;
					else if (temp==L._Get('sLogTime3',r[1])) v = r[1]*3600;
					else if (temp==L._Get('sLogTime4',r[1])) v = r[1]*86400;
					}
				}
			else if (id==24){ // <ATTAQUER>
				var isIMG = DOM._GetFirstNode("./a/img|./img", col);
				if (isIMG!=null) v = isIMG.alt;
				}
			else if (id==2){ // adresse
				var isA = DOM._GetFirstNode("./a", col);
				if (isA!=null){
					var r = new RegExp(L._Get('sTriAdrTest')).exec(isA.textContent);
					if (r!=null) v = parseInt(r[1])*100000+parseInt(r[2])*100+parseInt(r[3]);
					}
				}
			else if (id==7){ // NIV (PTS)
				var r = new RegExp(L._Get('sTriPtsTest')).exec(v);
				if (r!=null) v = parseInt(r[2]);
				}
			list2[i]=[v,i];
			}
		}
	list2.sort(function(a,b){return a[0]<b[0]?-1:a[0]==b[0]?0:1;});
	if (order==0) list2.reverse();
	// mise en forme
	for(var i=0; i<list2.length; i++){
		var r = list.snapshotItem(list2[i][1]);
		r.classList.add('BWETR');
		if (i%2==0) r.classList.remove('BWEeven');
		else r.classList.add('BWEeven');
		tbody.appendChild(r);
		}
	}
// Pages 'pOAliance','pAliance'
function show_hide(e,i){
	var show = PREF._Get(p,i[2])==1?0:1;
	PREF._Set(p,i[2],show);
	i[0].setAttribute('style','display:'+(show==1?'block;':'none;'));
	i[1].setAttribute('style','color:'+(show==1?'lime;':'red;')+';cursor: pointer;');
	}
// pages 'pRootSettings','pSettingsAi','pSettingsAcc','pSettingsVac','pSettingsDelchar'
function setMenuOptions(e){
	function check(e,i){ // i[0] = ensemble ,i[1] = key
		PREF._Set(i[0],i[1],e.target.checked?1:0);
		}
	function inputNumber(e,i){ // i[0] = ensemble ,i[1] = key
		var v = e.target.value,
			r = new RegExp("^(|(?:[0-9]+|[0-9]*[.]?[0-9]+))$").exec(v);
		if (r!=null){
			e.target.setAttribute('class','BWEInput');
			PREF._Set(i[0],i[1],v);
			}
		else e.target.setAttribute('class','BWEInput BWEAEButError');
		}
	function changeCol(e,i){// i[0]= liste, i[1]= ligne, i[2]= ligne + ou -
		var col = PREF._Get(i[0],'list'),
			temp = col[i[1]];
		col[i[1]] = col[i[2]];
		col[i[2]] = temp;
		PREF._Set(i[0],'list',col);
		createColList();
		}
	function clickCol(e,i){// i[0]= liste, i[1]= ligne
		var col = PREF._Get(i[0],'list');
		col[i[1]][1] = col[i[1]][1]==1?0:1;
		PREF._Set(i[0],'list',col);
		createColList();
		}
	function clickA(e,i){// i[0]= liste, i[1]= ligne, i[2]= choix
		var col = PREF._Get(i[0],'list');
		col[i[1]][3] = i[2];
		PREF._Set(i[0],'list',col);
		createColList();
		}
	function razPrefs(e){
		PREF._Raz();
		setMenuOptions();
		}
	function createColList(){
		var liste = nodeMenu['select1'].options[nodeMenu['select1'].selectedIndex].value,
			col = PREF._Get(liste,'list'),
			colDef = PREF._GetDef(liste,'list');
		nodeMenu['tbody1'].innerHTML = "";
		if (PREF._Get(liste,'sh')!=null){
			IU._CreateElements({'tr':['tr',,,,nodeMenu['tbody1']],
			'td1':['td',,[],,'tr'],
			'td2':['td',,[],,'tr'],
			'label':['label',{'for':'BWElabel'},[L._Get("sActive")],,'td2'],
			'td3':['td',{'colspan':'4'},[],,'tr'],
			'check':['input',{'class':'BWEInput','type':'checkbox','id':'BWElabel','checked':PREF._Get(liste,'sh')==1},,{'change':[check,[liste,'sh']]},'td3']});
			}
		for (var j=0;j<col.length;j++){
			var cellIU = {'tr':['tr',{'class':(j%2==1?'even':''),'onmouseout':"this.className="+(j%2==1?"'even';":"'';"),'onmouseover':"this.className='selectedItem';"},,,nodeMenu['tbody1']],
				'td1':['td',{'class':'BWEPrefTD1'},[j],,'tr'],
				'td2':['td',{'class':'BWEPrefTD2 '+(col[j][1]==1?'defHit':'atkHit'),'style':'text-decoration:'+(col[j][1]==1?'none':'line-through')},[L._Get('sColTitle')[col[j][0]]],{'click':[clickCol,[liste,j]]},'tr']},
				cell = IU._CreateElements(cellIU);
			if (_Exist(colDef[0][3])){
				if (!_Exist(col[j][3])) col[j][3] = 0;
				IU._CreateElements({'td3':['td',{'class':'BWEPrefTD2'+(col[j][3]==0?' heal':'')},[L._Get('sLeft')],{'click':[clickA,[liste,j,0]]},cell['tr']],
				'td4':['td',{'class':'BWEPrefTD2'+(col[j][3]==1?' heal':'')},[L._Get('sMiddle')],{'click':[clickA,[liste,j,1]]},cell['tr']],
				'td5':['td',{'class':'BWEPrefTD2'+(col[j][3]==2?' heal':'')},[L._Get('sRight')],{'click':[clickA,[liste,j,2]]},cell['tr']]});
				}
			var td6 = IU._CreateElement('td',{'class':'BWEPrefTD3'},[],{},cell['tr']);
			if (j!=0) IU._CreateElement('a',{},[L._Get('sTriUp')],{'click':[changeCol,[liste,j,(j-1)]]},td6);
			if (j<col.length-1) IU._CreateElement('a',{},[L._Get('sTriDown')],{'click':[changeCol,[liste,j,(j+1)]]},td6);
			}
		}
	function createList(list,node){
		var newNode = node;
		for (var j=0;j<list.length;j++){
			if (_Type(list[j][1])=='Array'){
				newNode = IU._CreateElement('optgroup',{'label':L._Get("sTitresList")[list[j][0]]},[],{},node);
				createList(list[j][1],newNode);
				}
			else IU._CreateElement('option',{'value':list[j][1]},[L._Get("sTitresList")[list[j][0]]],{},newNode);
			}
		}
	var r = DOM._GetNodes("./a", nodeOptions);
	for (var i=0; i<r.snapshotLength; i++) r.snapshotItem(i).className = '';
	nodeTitle['2'].className = 'active';
	nodeTitle['4'].className = '';
	var menuIU = {
		'menudiv':['div',{'align':'center','style':'margin-top: 15px;'}],
		'div1':['div',,[((typeof(GM_info)=='object')?GM_info.script.name:'?')+' : '],,'menudiv'],
		'a1':['a',{'href':'https://github.com/Ecilam/BloodWarsEnhanced','TARGET':'_blank'},[((typeof(GM_info)=='object')?GM_info.script.version:'?')],,'div1'],
		'br2':['br',,,,'menudiv'],
		'table0':['table',{'style':'width:100%;','class':'BWEMenu'},,,'menudiv'],
		'tr0_0':['tr',,,,'table0'],
		'td0_0_0':['td',{'style':'vertical-align:top;'},,,'tr0_0'],
		'table1':['table',{'style':'width:80%;','class':'BWEMenu'},,,'td0_0_0'],
		'thead1':['thead',,,,'table1'],
		'tr1_0':['tr',{'class':'tblheader'},,,'thead1'],
		'td1_0_0':['td',{'class':'BWELeft','colspan':'6'},,,'tr1_0'],
		'help1':['img',{'class':'BWEHelp','src':'/gfx/hint2.png','onmouseout':'nd();','onmouseover':"return overlib('"+L._Get("sInfoMsg")+"',HAUTO,WRAP);"},,,'td1_0_0'],
		'texte1':['span',{'class':'BWELeft'},[L._Get("sTitleList")],,'td1_0_0'],
		'select1':['select',{'class':'combobox','id':'liste'},,{'change':[createColList]},'td1_0_0'],
		'tbody1':['tbody',,,,'table1'],
		'td0_0_1':['td',{'style':'vertical-align:top;'},,,'tr0_0'],
		'table2':['table',{'style':'width:80%;','class':'BWEMenu'},,,'td0_0_1'],
		'thead2':['thead',,,,'table2'],
		'tr2_0':['tr',{'class':'tblheader'},,,'thead2'],
		'td2_0_0':['td',{'class':'BWELeft','colspan':'3'},[L._Get("sTitleDivers")],,'tr2_0'],
		'tbody2':['tbody',,,,'table2'],
		'br3':['br',,,,'menudiv'],
		'reset':['input',{'class':'button','type':'button','value':L._Get("sDefaut")},,{'click':[razPrefs]},'menudiv']
		},
		nodeMenu = IU._CreateElements(menuIU),
		// n°titre du groupe ou Array:[n°titre(cf sTitresList),nom de la liste]
		menuList = [[0,[[1,'pOProfile'],[2,'pProfile'],[3,'pTownview'],[4,'pOAliance'],[5,'pAliance'],[6,'pAlianceList'],[7,'pRank']]],
				[8,[[9,'pMsgList'],[10,'pMsgSaveList'],[11,'pMsgSendList']]],
				[12,[[13,'hlog'],[14,'hdiv'],[15,'hch'],[16,'hres']]]],
		// Array:[type,n°titre,array:['ensemble','key']] 
		menuDiv = [["check",0,['div','chDe']],["check",1,['pMsgFriendList','sh']],["check",2,['div','chSt']],["inputN",3,['div','nbLo']],["check",4,['div','chLo']],["check",5,['AE','sh']],
				["",6],["inputN",8,['AE','nMin']],["inputN",9,['AE','nMax']],["inputN",10,['AE','aMin']],["inputN",11,['AE','aMax']],
				["",7],["inputN",8,['AE','cMin']],["inputN",9,['AE','cMax']],["inputN",10,['AE','acMin']],["inputN",11,['AE','acMax']],
				["check",12,['pBuild','sh']]];
	// Partie Liste
	createList(menuList,nodeMenu['select1']);
	createColList();
	// Partie Divers
	for (var j=0;j<menuDiv.length;j++){
		var cellIU = {'tr':['tr',{'class':(j%2==1?'even':'')},,,nodeMenu['tbody2']],
			'td1':['td',{'class':'BWELeft'},,,'tr'],
			'td2':['td',{'class':'BWERight'},,,'tr']},
			cell = IU._CreateElements(cellIU);
		cell['td1'].textContent = L._Get("sTitresDiv")[menuDiv[j][1]];
		if (menuDiv[j][0]=="check") IU._CreateElement('input',{'class':'BWEInput','type':'checkbox','checked':PREF._Get(menuDiv[j][2][0],menuDiv[j][2][1])==1},[],{'change':[check,[menuDiv[j][2][0],menuDiv[j][2][1]]]},cell['td2']);
		else if (menuDiv[j][0]=="inputN") IU._CreateElement('input',{'class':'BWEInput','type':'text','value':PREF._Get(menuDiv[j][2][0],menuDiv[j][2][1]),'size':'5','maxlength':'5'},[],{'change':[inputNumber,[menuDiv[j][2][0],menuDiv[j][2][1]]],'keyup':[inputNumber,[menuDiv[j][2][0],menuDiv[j][2][1]]]},cell['td2']);
		}
	var oldDiv = DOM._GetNodes("//div[@id='content-mid']/*[preceding-sibling::div[@class='top-options'] and following-sibling::script[last()]]");
	for (var i=0;i<oldDiv.snapshotLength;i++){oldDiv.snapshotItem(i).parentNode.removeChild(oldDiv.snapshotItem(i));}
	nodeOptions.parentNode.insertBefore(nodeMenu['menudiv'],nodeOptions.nextSibling);
	nodeOptions.parentNode.insertBefore(IU._CreateElement('div',{'class':'hr720'}),nodeOptions.nextSibling);
	}
// pages 'pRootSettings','pSettingsAi','pSettingsAcc','pSettingsVac','pSettingsDelchar'
function setMenuDB(e){
	function selectLSChange(e){
		if (nodeMenu['selectLS'].selectedIndex>=0)
			nodeMenu['divLS'].textContent = JSONS._Encode(LS._GetVar(decodeURIComponent(nodeMenu['selectLS'].options[nodeMenu['selectLS'].selectedIndex].value),""));
		}
	function delLS(e){
		if (nodeMenu['selectLS'].selectedIndex>=0){
			var index = nodeMenu['selectLS'].selectedIndex,
				key = decodeURIComponent(nodeMenu['selectLS'].options[index].value);
			LS._Delete(key);
			r.splice(index,1);
			LSList.splice(LSList.indexOf(key),1);
			nodeMenu['selectLS'].remove(index);
			nodeMenu['divLS'].textContent = "";
			nodeMenu['td1_2_0'].textContent = L._Get('sResult',r.length,LSList.length);
			nodeMenu['divIE'].textContent = '';
			}
		}
	function razLS(e){
		if (confirm(L._Get("sRazChkLS"))){
			nodeMenu['divLS'].textContent = "";
			nodeMenu['td1_2_0'].textContent = L._Get('sResult',0,0);
			LSList = [],
			r = [];
			while (nodeMenu['selectLS'].length>0) nodeMenu['selectLS'].remove(0);
			for (var i=LS._Length()-1;i>=0;i--) if(LS._Key(i).indexOf('BWE:')==0) LS._Delete(LS._Key(i));
			nodeMenu['divIE'].textContent = '';
			PREF._Raz();
			}
		}
	function triLSList(e){
		while (nodeMenu['selectLS'].length>0) nodeMenu['selectLS'].remove(0);
		nodeMenu['divLS'].textContent = "";
		r = [];
		for (var i=0;i<LSList.length;i++)
			if(LSList[i].toLowerCase().indexOf(nodeMenu['LSsearch'].value.toLowerCase())!=-1) r.push(i);
		r.sort(function(a,b){
			var x = LSList[a].toLowerCase(),
				y = LSList[b].toLowerCase();
			return x<y?-1:x==y?0:1;
			});
		nodeMenu['td1_2_0'].textContent = L._Get('sResult',r.length,LSList.length);
		for (var i=0;i<r.length;i++)IU._CreateElement('option',{'value':encodeURIComponent(LSList[r[i]])},[LSList[r[i]]],{},nodeMenu['selectLS']);
		nodeMenu['selectLS'].selectedIndex = 0;
		selectLSChange();
		}
	function outputLog(){
		var output = '';
		for (var i=0;i<LS._Length();i++){
			var key = LS._Key(i),
				r = new RegExp('^BWE:L:('+ID+'(:(?!'+ID+'$)(.+$))|(((?!'+ID+':)(.+:))'+ID+'$))').exec(key);
			if (r!=null) output += key+'='+JSONS._Encode(LS._GetVar(key,[]));
			}
		nodeMenu['divIE'].textContent = encodeURIComponent(output);
		}
	function importLog(e){
		var input = decodeURIComponent(nodeMenu['textIE'].value),
			x = 0,i,reg = new RegExp('BWE:L:('+ID+'(?!:'+ID+'=)|(?!'+ID+':)[^:=]+(?=:'+ID+'=)):([^:=]+)=(\\[.*?\\])(?=BWE|$)','g');
		while ((i=reg.exec(input))!=null){
			var att = i[1],def = i[2],log = i[3],
				r = JSONS._Decode(log);
			for (var j=0;j<r.length;j++){
				UpdateHistory(att,def,r[j][0],new Date(r[j][1]),r[j][2]);
				if (LS._GetVar('BWE:L:'+att+':'+def,null)!=null&&LSList.indexOf('BWE:L:'+att+':'+def)==-1) LSList.push('BWE:L:'+att+':'+def);
				x++;
				nodeMenu['td3_2_1'].textContent = L._Get('sIEResult',x);
				}
			}
		nodeMenu['divIE'].textContent = '';
		triLSList();
		}
	var r = DOM._GetNodes("./a", nodeOptions);
	for (var i=0; i<r.snapshotLength; i++) r.snapshotItem(i).className = '';
	nodeTitle['2'].className = '';
	nodeTitle['4'].className = 'active';
	var menuIU = {
		'menudiv':['div',{'align':'center','style':'margin-top: 15px;'}],
		'divalert':['div',{'class':'auBid','style':'border: 1px solid red; padding: 3px; margin: 3px;'},,,'menudiv'],
		'table':['table',{'style':'width: 100%;'},,,'divalert'],
		'tr_0':['tr',,,,'table'],
		'td_0_0':['td',{'align':'center','width':'30'},,,'tr_0'],
		'img_0_0':['img',{'src':'./gfx/infobox_fail.gif'},,,'td_0_0'],
		'td_0_1':['td',{'class':'error'},[L._Get('sAlertMsg')],,'tr_0'],
		'BR0':['br',,,,'menudiv'],
		'table0':['table',{'style':'width: 100%;','cellspacing':'0','cellpadding':'0'},,,'menudiv'],
		'tr0_0':['tr',{'class':'tblheader'},,,'table0'],
		'td0_0_0':['td',{'class':'BWELeft'},[L._Get('sTitleLS')],,'tr0_0'],
		'tr0_1':['tr',,,,'table0'],
		'td0_1_0':['td',,,,'tr0_1'],
		'table1':['table',{'style':'padding:5px;width: 100%;'},,,'td0_1_0'],
		'tr1_0':['tr',,,,'table1'],
		'td1_0_0':['td',{'colspan':'4'},,,'tr1_0'],
		'LLSSearch':['label',{'class':'BWELeft','for':'LSsearch'},[L._Get('sLabelSearch')],,'td1_0_0'],
		'tr1_1':['tr',,,,'table1'],
		'td1_1_0':['td',,,,'tr1_1'],
		'LSsearch':['input',{'class':'inputbox','type':'text'},,{'change':[triLSList],'keyup':[triLSList]},'td1_1_0'],
		'td1_1_1':['td',,,,'tr1_1'],
		'td1_1_2':['td',{'class':'BWELeft'},,,'tr1_1'],
		'delLS':['input',{'class':'button','type':'button','value':L._Get("sDelete")},,{'click':[delLS]},'td1_1_2'],
		'td1_1_3':['td',{'class':'BWERight'},,,'tr1_1'],
		'razLS':['input',{'class':'button','type':'button','value':L._Get("sRAZ")},,{'click':[razLS]},'td1_1_3'],
		'tr1_2':['tr',,,,'table1'],
		'td1_2_0':['td',{'colspan':'4'},,,'tr1_2'],
		'tr1_3':['tr',,,,'table1'],
		'td1_3_0':['td',{'colspan':'2','valign':'top','style':'width:220px;'},,,'tr1_3'],
		'selectLS':['select',{'class':'inputbox select BWEselectLS','size':'20','style':'width:200px;'},,{'change':[selectLSChange]},'td1_3_0'],
		'td1_3_1':['td',{'colspan':'2','valign':'top','style':'width:490px;'},,,'tr1_3'],
		'divLS':['div',{'class':'inputbox BWEdivLS','style':'width:490px;'},,,'td1_3_1'],
		'BR1':['br',,,,'menudiv'],
		'table2':['table',{'style':'width: 100%;','cellspacing':'0','cellpadding':'0'},,,'menudiv'],
		'tr2_0':['tr',{'class':'tblheader'},,,'table2'],
		'td2_0_0':['td',{'class':'BWELeft'},[L._Get('sTitleIE')],,'tr2_0'],
		'tr2_1':['tr',,,,'table2'],
		'td2_1_0':['td',,,,'tr2_1'],
		'table3':['table',{'style':'padding:5px;width: 100%;'},,,'td2_1_0'],
		'tr3_0':['tr',,,,'table3'],
		'td3_0_0':['td',{'class':'BWELeft'},[L._Get('sExportText')],,'tr3_0'],
		'ExportHelp':['img',{'class':'BWEHelp','src':'/gfx/hint2.png','onmouseout':'nd();','onmouseover':"return overlib('"+L._Get("sExportHelp")+"',HAUTO,WRAP);"},,,'td3_0_0'],
		'td3_0_1':['td',{'class':'BWERight'},,,'tr3_0'],
		'export':['input',{'class':'button','type':'button','value':L._Get("sOutputLog")},,{'click':[outputLog]},'td3_0_1'],
		'td3_0_2':['td',,,,'tr3_0'],
		'td3_0_3':['td',{'class':'BWELeft'},[L._Get('sImportText')],,'tr3_0'],
		'ImportHelp':['img',{'class':'BWEHelp','src':'/gfx/hint2.png','onmouseout':'nd();','onmouseover':"return overlib('"+L._Get("sImportHelp")+"',HAUTO,WRAP);"},,,'td3_0_3'],
		'td3_0_4':['td',{'class':'BWERight'},,,'tr3_0'],
		'import':['input',{'class':'button','type':'button','value':L._Get("sImportLog")},,{'click':[importLog]},'td3_0_4'],
		'tr3_1':['tr',,,,'table3'],
		'td3_1_0':['td',{'colspan':'2','valign':'top','style':'width:345px;'},,,'tr3_1'],
		'divIE':['div',{'class':'inputbox BWEdivIE','style':'width:345px;'},,,'td3_1_0'],
		'td3_1_1':['td',{'style':'width:20px;'},,,'tr3_1'],
		'td3_1_2':['td',{'colspan':'2','valign':'top','style':'width:345px;'},,,'tr3_1'],
		'textIE':['textarea',{'class':'textarea BWEdivIE','style':'width:345px;'},,,'td3_1_2'],
		'tr3_2':['tr',,,,'table3'],
		'td3_2_0':['td',{'colspan':'2'},,,'tr3_2'],
		'td3_2_1':['td',{'colspan':'2'},,,'tr3_2']
		},
		nodeMenu = IU._CreateElements(menuIU);
	var oldDiv = DOM._GetNodes("//div[@id='content-mid']/*[preceding-sibling::div[@class='top-options'] and following-sibling::script[last()]]");
	for (var i=0;i<oldDiv.snapshotLength;i++){oldDiv.snapshotItem(i).parentNode.removeChild(oldDiv.snapshotItem(i));}
	nodeOptions.parentNode.insertBefore(nodeMenu['menudiv'],nodeOptions.nextSibling);
	nodeOptions.parentNode.insertBefore(IU._CreateElement('div',{'class':'hr720'}),nodeOptions.nextSibling);
	// LS
	var LSList = [],
		r = [];
	for (var i=0;i<LS._Length();i++){
		var key = LS._Key(i);
		LSList.push(key); //if(key.indexOf('BWE:')==0)
		}
	triLSList();
	}

/******************************************************
* START
*
******************************************************/
// vérification des services
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
if (!JSON) throw new Error("Erreur : le service JSON n\'est pas disponible.");
else if (!MutationObserver) throw new Error("Erreur : le service MutationObserver n\'est pas disponible.");
else if (!window.localStorage) throw new Error("Erreur : le service localStorage n\'est pas disponible.");
else{
	var p = DATAS._GetPage(),
		player = DATAS._PlayerName(),
		IDs = LS._GetVar('BWE:IDS',{});
console.debug('BWEpage :',p);
	// Pages gérées par le script
	if (['null','pServerDeco','pServerUpdate','pServerOther'].indexOf(p)==-1&&player!=null){
console.debug('BWEstart: %o %o',player,IDs);
		if (p=='pMain'){
			var r = DOM._GetFirstNodeTextContent("//div[@class='throne-maindiv']/div/span[@class='reflink']",null);
			if (r!=null){
				var r2 = /r\.php\?r=([0-9]+)/.exec(r),
					ID = _Exist(r2[1])?r2[1]:null;
				if (ID!=null){
					for (var i in IDs) if (IDs[i]==ID) delete IDs[i]; // en cas de changement de nom
					IDs[player] = ID;
					LS._SetVar('BWE:IDS',IDs);
					}
				}
			}
		// Autre pages nécessitant l'ID
		else if (_Exist(IDs[player])){
			var ID = IDs[player];
			PREF._Init(ID);
			SetCSS();
			//Update player datas
			var plDatas = LS._GetVar('BWE:P:'+player,{});
			plDatas['N'] = DATAS._PlayerLevel();
			plDatas['P'] = Number(DATAS._PlayerXP());
			LS._SetVar('BWE:P:'+player,plDatas);
			if  ((p=='pOProfile'||p=='pProfile')&&PREF._Get(p,'sh')==1){
				var name = new RegExp(L._Get('sNameTest')).exec(DOM._GetFirstNodeTextContent("//div[@id='content-mid']/div[@class='profile-hdr']",null)),
					ttable = DOM._GetFirstNode("//div[@id='content-mid']/div[@style='float: left; width: 49%;']/fieldset[1]/table"),
					trList = DOM._GetNodes("./tbody/tr",ttable);
				if (name!=null&&ttable!=null&&trList!=null&&trList.snapshotLength==14){
					// récupère les données
					var v = LS._GetVar('BWE:P:'+name[1],{}),
						uid = /.*\?a=profile&uid=(\d*)$/.exec(DOM._GetFirstNodeTextContent("//div[@id='content-mid']/div/a[@target='_blank']",null)),
						race = DOM._GetFirstNodeTextContent("./td[2]",null,trList.snapshotItem(0)),
						sexe = DOM._GetFirstNodeTextContent("./td[2]",null,trList.snapshotItem(1)),
						niv = DOM._GetFirstNodeTextContent("./td[2]",null,trList.snapshotItem(5)),
						pts = DOM._GetFirstNodeTextContent("./td[2]",null,trList.snapshotItem(6));
					if (uid!=null) v['U'] = uid[1];
					if (race!=null) v['R'] = L._Get('sRaces').indexOf(race);
					if (sexe!=null) v['S'] = sexe==L._Get("sSexeHomme")?L._Get("sSexeH"):L._Get("sSexeF");
					if (niv!=null) v['N'] = niv;
					if (pts!=null) v['P'] = Number(pts);
					LS._SetVar('BWE:P:'+name[1],v);
					// nouveau tableau
					var newTableIU = {
						'table':['table',{'id':'BWE'+p+'table','style':'margin: 10px;','cellspacing':'0'}],
						'tbody':['tbody',{'id':'BWE'+p+'body'},,,'table']},
						newTable = IU._CreateElements(newTableIU);
					ttable.parentNode.insertBefore(newTable['table'],ttable.nextSibling);
					// garde uniquement les lignes sélectionnées
					var newLig = PREF._Get(p,'list');
					for (var j=0;j<newLig.length;j++){
						if (newLig[j][1]==1){
							var ligne;
							// ligne existante
							if (newLig[j][2]!=-1) ligne = newTable['tbody'].appendChild(trList.snapshotItem(newLig[j][2]).cloneNode(true));
							else{ // ligne à créer
								var trIU = {'tr':['tr',,,,newTable['tbody']],
											'td1':['td',,,,'tr'],'b':['b',,[L._Get("sColTitle")[newLig[j][0]]],,'td1'],
											'td2':['td',,,,'tr']},
									newTR = IU._CreateElements(trIU),
									line = newLig[j][0];
								ligne = newTR['tr'];
								if (line==7) newTR['td2'].textContent = L._Get('sNivFormat',niv,pts);
								else if (line==8){
									var show = PREF._Get('grp','sh')==1,
										grp = LS._GetVar('BWE:G:'+ID,{'A':[],'B':[]}),
										grpIU = {'tr0':['tr',{'style':'display:'+(show?'table-row;':'none;')},,,newTable['tbody']],
												'td00':['td',{'id':'BWEgrpA','colspan':'2'},,,'tr0'],
												'tr1':['tr',{'style':'display:'+(show?'table-row;':'none;')},,,newTable['tbody']],
												'td10':['td',{'id':'BWEgrpB','colspan':'2'},,,'tr1']},
										grpTR = IU._CreateElements(grpIU);
									newTR['td1'].setAttribute('style','color:'+(show?'lime;':'red;')+';cursor: pointer;');
									IU._addEvent(newTR['td1'],'click',showHideGr,[newTR['td1'],grpTR['tr0'],grpTR['tr1']]);
									var grTDIU = {'labelA':['label',{'for':encodeURIComponent('BWEcheckA_'+name[1])},['A'],,newTR['td2']],
												'checkA':['input',{'class':'BWEInput','type':'checkbox','id':encodeURIComponent('BWEcheckA_'+name[1]),
													'checked':(grp['A'].indexOf(name[1])>-1)},,
													{'change':[checkGrp,[name[1],'A']]},newTR['td2']],
												'labelB':['label',{'for':encodeURIComponent('BWEcheckB_'+name[1])},['B'],,newTR['td2']],
												'checkB':['input',{'class':'BWEInput','type':'checkbox','id':encodeURIComponent('BWEcheckB_'+name[1]),
													'checked':(grp['B'].indexOf(name[1])>-1)},,
													{'change':[checkGrp,[name[1],'B']]},newTR['td2']]},
										grTD = IU._CreateElements(grTDIU);
									GroupTable('A');
									GroupTable('B');
									}
								else if (line==14){
									var trIU = {'table':['table',{'style':'width:90%;'},,,newTR['td2']],
												'tr10':['tr',,,,'table'],
													'td11':['td',,[L._Get('sProfAtt')],,'tr10'],
													'td12':['td',{'style':'min-width:4em;'},,,'tr10'],
													'td13':['td',,[L._Get('sProfDef')],,'tr10'],
													'td14':['td',{'style':'min-width:4em;'},,,'tr10']},
										embTR = IU._CreateElements(trIU);
									CreateHistory(ID,name[1],embTR['td12']);
									CreateHistory(name[1],ID,embTR['td14']);
									}
								}
							ligne.classList.add(_Exist(newLig[j][3])?['BWELeft','BWEMiddle','BWERight'][newLig[j][3]]:'BWELeft');
							}
						}
					ttable.setAttribute('style','display:none');
					}
				}
			else if (p=='pBuild'&&PREF._Get(p,'sh')==1){
				var target = DOM._GetFirstNode("//div[@id='content-mid']"),
					builds = DOM._GetNodes("./div[@class='building']",target),
					allnode = DOM._GetNodes("./div[(@class='bldprogress' or @class='strefaheader' or @class='building' or @class='hr720' or @class='hr620')]",target);
				if (target!=null&&builds!=null&&allnode!=null){
					var newTableIU = {
						'div':['div',{'id':'BWE'+p+'div','align':'center'}],
						'hr1':['div',{'class':'hr720'},,,'div'],
						'table':['table',{'id':'BWE'+p+'table','class':'BWEBuild','style':'width:100%;'},,,'div'],
						'thead':['thead',,,,'table'],
						'tbody':['tbody',{'id':'BWE'+p+'body'},,,'table'],
						'hr2':['div',{'class':'hr720'},,,'div']},
						newTable = IU._CreateElements(newTableIU);
					target.insertBefore(newTable['div'],target.childNodes[0]);
					BuildTable(newTable,builds);
					for (var i=0;i<allnode.snapshotLength;i++){allnode.snapshotItem(i).setAttribute('style','display:none');}
					}
				}
			else if (p=='pTownview'&&PREF._Get(p,'sh')==1){
				var target = DOM._GetFirstNode("//div[@id='content-mid']//div[@id='tw_table']"),
					theader = DOM._GetFirstNode(".//tr[@class='tblheader']",target),
					ttable = DOM._GetFirstNode("(./ancestor::table)[last()]",theader);
				if (target!=null&&theader!=null&&ttable!=null){
					// recréé le tableau en cas de changement
					var observer = new MutationObserver(function(mutations){
							var theader = DOM._GetFirstNode("//div[@id='content-mid']//div[@id='tw_table']//tr[@class='tblheader']"),
								ttable = DOM._GetFirstNode("(./ancestor::table)[last()]",theader),
								tlist = DOM._GetNodes("./following-sibling::tr",theader);
							if (ttable!=null&&tlist!=null){
								observer.disconnect();
								var oldTable = DOM._GetFirstNode("//div[@id='BWE"+p+"div']");
								if (oldTable!=null) oldTable.parentNode.removeChild(oldTable);
								var newTableIU = {
									'div':['div',{'id':'BWE'+p+'div','align':'center'},],
									'table':['table',{'id':'BWE'+p+'table','style':'width:95%;'},,,'div'],
									'thead':['thead',,,,'table'],
									'tr':['tr',{'id':'BWE'+p+'header','class':'tblheader'},,,'thead'],
									'tbody':['tbody',{'id':'BWE'+p+'body'},,,'table']},
									newTable = IU._CreateElements(newTableIU);
								target.parentNode.insertBefore(newTable['div'],target.nextSibling);
								MixteTable(theader,tlist,p);
								ttable.setAttribute('style','display:none');
								observer.observe(target,{childList: true});
								}
							});
					observer.observe(target,{childList:true,attributes:true,subtree:true});
					ttable.setAttribute('style','display:none'); // provoque observer
					}
				}
			else if (p=='pOAliance'||p=='pAliance'){
				// options pour afficher/masquer
				var td = DOM._GetNodes("//div[@id='content-mid']//div[@class='clan-desc']");
				if (td!=null&&PREF._Get('div','chDe')==1){
					if (_Exist(td.snapshotItem(0))){
						var td1prev = DOM._GetFirstNode("./parent::td/preceding-sibling::td/b",td.snapshotItem(0));
						if (td1prev!=null){
							var show = PREF._Get(p,'sh1')==1;
							td.snapshotItem(0).setAttribute('style','display:'+(show?'block;':'none;'));
							td1prev.setAttribute('style','color:'+(show?'lime;':'red;')+';cursor: pointer;');
							IU._addEvent(td1prev,'click',show_hide,[td.snapshotItem(0),td1prev,'sh1']);
							}
						}
					if (_Exist(td.snapshotItem(1))){
						var td2prev = DOM._GetFirstNode("//div[@id='content-mid']//td[@style='padding-top: 10px; padding-bottom: 4px; vertical-align: top;']/b");
						if (td2prev!=null){
							var show = PREF._Get(p,'sh2')==1;
							td.snapshotItem(1).setAttribute('style','display:'+(show?'block;':'none;'));
							td2prev.setAttribute('style','color:'+(show?'lime;':'red;')+';cursor: pointer;');
							IU._addEvent(td2prev,'click',show_hide,[td.snapshotItem(1),td2prev,'sh2']);
							}
						}
					}
				// liste des vampires
				if (PREF._Get(p,'sh')==1){
					var ttable = DOM._GetFirstNode("//div[@id='content-mid']//table[@class='sortable']"),
						theader = DOM._GetFirstNode("./thead/tr[@class='tblheader']",ttable),
						tlist = DOM._GetNodes("./tbody/tr",ttable);
					if (ttable!=null&&theader!=null&&tlist!=null){
						var newTableIU = {
							'div':['div',{'id':'BWE'+p+'div','align':'center'},],
							'table':['table',{'id':'BWE'+p+'table','style':'width:95%;'},,,'div'],
							'thead':['thead',,,,'table'],
							'tr':['tr',{'id':'BWE'+p+'header','class':'tblheader'},,,'thead'],
							'tbody':['tbody',{'id':'BWE'+p+'body'},,,'table']},
							newTable = IU._CreateElements(newTableIU);
						ttable.parentNode.insertBefore(newTable['div'],ttable.nextSibling);
						MixteTable(theader,tlist,p);
						ttable.setAttribute('style','display:none');
						if (DOM._GetFirstNode("//td[@id='BWE"+p+"col21']")!=null){
							var newGrpIU = {
								'tableGrp':['table',{'id':'BWEGrp','style':'width:95%;'},,,newTable['div']],
								'tr0':['tr',,,,'tableGrp'],
								'td00':['td',{'id':'BWEgrpA','class':'BWEMiddle','style':'width:45%;','valign':'top'},,,'tr0'],
								'td01':['td',{'id':'BWEgrpB','class':'BWEMiddle','style':'width:45%;','valign':'top'},,,'tr0']},
								newGrp = IU._CreateElements(newGrpIU);
							GroupTable('A');
							GroupTable('B');
							}
						}
					}
				}
			else if (p=='pAlianceList'&&PREF._Get(p,'sh')==1){
				var theader = DOM._GetFirstNode("//div[@id='content-mid']//tr[@class='tblheader']"),
					ttable = DOM._GetFirstNode("(./ancestor::table)[last()]",theader),
					tlist = DOM._GetNodes("./following-sibling::tr",theader);
				if (ttable!=null&&theader!=null&&tlist!=null){
					var newTableIU = {
						'div':['div',{'id':'BWE'+p+'div','align':'center'},],
						'table':['table',{'id':'BWE'+p+'table','style':'width:100%;'},,,'div'],
						'thead':['thead',,,,'table'],
						'tr':['tr',{'id':'BWE'+p+'header','class':'tblheader'},,,'thead'],
						'tbody':['tbody',{'id':'BWE'+p+'body'},,,'table']},
						newTable = IU._CreateElements(newTableIU);
					ttable.parentNode.insertBefore(newTable['div'],ttable.nextSibling);
					MixteTable(theader,tlist,p);
					ttable.setAttribute('style','display:none');
					}
				}
			else if (p=='pMkstone'||p=='pUpgitem'||p=='pMixitem'||p=='pDestitem'||p=='pTatoo'){
				if (PREF._Get('div','chSt')==1){
					var cost = new Array(['disp_stone_blood',1],['disp_stone_heart',10],['disp_stone_life',50],['disp_stone_change',150],['disp_stone_soul',500]),
						sum = 0;
					for (var i=0;i<cost.length;i++){
						var r = DOM._GetFirstNodeTextContent("//div[@id='content-mid']//span[@id='"+cost[i][0]+"']",null);
						if (r!=null) sum = sum + (cost[i][1]*parseInt(r));
						}
					var r = DOM._GetFirstNode("//div[@id='content-mid']//fieldset[@class='profile mixer']");
					if (r!=null){
						var totalIU = {'div1':['div',{'align':'center'}],
										'div2':['div',{'style':'padding:2px;'},[L._Get("sTotal")],,'div1'],
										'b':['b',,[sum],,'div2']},
							total = IU._CreateElements(totalIU);
						r.parentNode.insertBefore(total['div1'],r.nextSibling);
						}
					}
				}
			else if (p=='pAmbushRoot'&&PREF._Get('div','chLo')==1){
				var atkaction = DOM._GetFirstNode("//div[@id='content-mid']//tr[@class='tblheader']/td/a[@class='clanOwner']");
				if (atkaction!=null){
					var ambushScript = DOM._GetFirstNodeInnerHTML("//div[@id='content-mid']/script",null);
					if (ambushScript!=null){
						var r = new RegExp(L._Get('sAtkTime')).exec(ambushScript);
						if (r!=null){
							var msgDate = DATAS._Time(),
								r2 = new RegExp(L._Get('sMidMsg')).exec(ambushScript),
								playerVS = DOM._GetFirstNodeTextContent("//div[@id='content-mid']//tr[@class='tblheader']/td/a[@class='players']",null);
							if (msgDate!=null&&r2!=null&&playerVS!=null){
								msgDate.setTime(msgDate.getTime()+r[1]*1000);
								UpdateHistory(ID,playerVS,r2[1],msgDate,null);
								}
							}
						}
					}
				}
			else if (p=='pMsgList'||p=='pMsgSaveList'||p=='pMsgSendList'){
				var theader = DOM._GetFirstNode("//div[@id='content-mid']//tr[@class='tblheader']"),
					ttable = DOM._GetFirstNode("(./ancestor::table)[last()]",theader),
					tlist = DOM._GetNodes("./following-sibling::tr",theader);
				if (tlist!=null&&PREF._Get('div','chLo')==1){
					for (var i=0;i<tlist.snapshotLength;i++){
						var node = tlist.snapshotItem(i),
							msg = DOM._GetFirstNodeTextContent("./td[2]/a",null,node),
							msgDate = DOM._GetFirstNodeTextContent("./td[4]",null,node),
							msgId = DOM._GetFirstNode("./td[1]/input",node);
						var v = new RegExp("([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})").exec(msgDate);
						msgDate = (v!=null)?new Date(v[1],v[2]-1,v[3],v[4],v[5],v[6]):null;
						if (msg!=null&&msgDate!=null&&msgId!=null){
							var msgId = msgId.getAttribute('id').replace('msgid_', ''),
								m1 = new RegExp(L._Get('sAmbushMsg1')).exec(msg),
								m2 = new RegExp(L._Get('sAmbushMsg2')).exec(msg);
							if (m1!=null) UpdateHistory(m1[1],ID,msgId,msgDate,null);
							else if (m2!=null) UpdateHistory(ID,m2[1],msgId,msgDate,null);
							}
						}
					}
				if (ttable!=null&&theader!=null&&tlist!=null&&PREF._Get(p,'sh')==1){
					var newTableIU = {
						'div':['div',{'id':'BWE'+p+'div','align':'center'},],
						'table':['table',{'id':'BWE'+p+'table','class':'BWETabMsg','style':'width:100%;'},,,'div'],
						'thead':['thead',,,,'table'],
						'tr':['tr',{'id':'BWE'+p+'header','class':'tblheader'},,,'thead'],
						'tbody':['tbody',{'id':'BWE'+p+'body'},,,'table']},
						newTable = IU._CreateElements(newTableIU);
					ttable.parentNode.insertBefore(newTable['div'],ttable.nextSibling);
					MixteTable(theader,tlist,p);
					ttable.setAttribute('style','display:none');
					}
				}
			else if (p=='pMsg'||p=='pMsgSave'){
				// Analyse le message d'embuscade
				var msgContent = DOM._GetFirstNodeInnerHTML("//div[@class='msg-content ']", null);
				if (msgContent!=null&&PREF._Get('div','chLo')==1){
					// embuscade
					var r = new RegExp(L._Get('sAmbushTest1')).exec(msgContent);
					if (r!=null){
						var att = r[1],
							def = r[2],
							emb = ['','','','',[],[],[],[],[],[],[],[],[]], //[%,réussite,PV att,PV def,aa,ad,ea,ed,ca,cd,pa,pd,ressources]
							qsMid = DOM._QueryString("mid");
						// liste des éléments à récupérer suivant les options
						var logShow = [], divShow = [], GaShow = [],
							logCol = PREF._Get('hlog','list'), // 31-36
							div = PREF._Get('hdiv','list'), // 37-42
							Ga = PREF._Get('hres','list'); //56-61
						for (var i=0;i<logCol.length;i++){logShow[logCol[i][0]-31]=logCol[i][1];}
						for (var i=0;i<div.length;i++){divShow[div[i][0]-37]=div[i][1];}
						for (var i=0;i<Ga.length;i++){GaShow[Ga[i][0]-56]=Ga[i][1];}
						// Chance de réussite
						var r = new RegExp(L._Get('sAmbushTest2')).exec(msgContent);
						if (r!=null&&divShow[1]==1) emb[0] = r[1];
						// embuscade réussie
						var r = new RegExp(L._Get('sAmbushTest3',att)).exec(msgContent);
						if (r!=null){
							// résultat
							var r1 = new RegExp(L._Get('sAmbushTest4')).exec(msgContent),
								r2 = new RegExp(L._Get('sAmbushTest5',def)).exec(msgContent),
								r3 = new RegExp(L._Get('sAmbushTest6')).exec(msgContent);
							if (r1!=null){
								emb[1] = 'v';
								if (logShow[5]==1){
									// ressources (pdp,pdh,lol,sang,pop,évo)
									var r = new RegExp(L._Get('sAmbushTest13',att)).exec(msgContent);
									if (r!=null&&GaShow[0]==1) emb[12][0] = Number(r[1]);
									var r = new RegExp(L._Get('sAmbushTest14',att)).exec(msgContent);
									if (r!=null){
										if (GaShow[0]==1) emb[12][0] = Number(r[1]);
										if (GaShow[1]==1) emb[12][1] = Number(r[2]);
										}
									var r = new RegExp(L._Get('sAmbushTest15',def)).exec(msgContent);
									if (r!=null){
										if (GaShow[3]==1) emb[12][3] = Number(r[1]);
										if (GaShow[4]==1) emb[12][4] = Number(r[2]);
										if (GaShow[5]==1) emb[12][5] = Number(r[3]);
										}
									var r = new RegExp(L._Get('sAmbushTest16',att)).exec(msgContent);
									if (r!=null&&GaShow[2]==1) emb[12][2] = Number(r[1]);
									}
								}
							else if (r2!=null){
								emb[1] = 'd';
								if (logShow[5]==1){
									// ressources (pdp,lol,sang,pop)
									var r = new RegExp(L._Get('sAmbushTest13',def)).exec(msgContent);
									if (r!=null&&GaShow[0]==1) emb[12][0] = Number(r[1]);
									var r = new RegExp(L._Get('sAmbushTest15',att)).exec(msgContent);
									if (r!=null){
										if (GaShow[3]==1) emb[12][3] = Number(r[1]);
										if (GaShow[4]==1) emb[12][4] = Number(r[2]);
										if (GaShow[5]==1) emb[12][5] = Number(r[3]);
										}
									}
								}
							else if (r3!=null) emb[1] = 'n';
							// PV en fin de combat
							var sommaire = DOM._GetLastNodeInnerHTML("//div[@class='sum2']",null);
							if (sommaire!=null){
								var r = new RegExp(L._Get('sAmbushTest7')).exec(sommaire);
								if (r!=null){
									if (logShow[1]==1&&divShow[2]==1) emb[2] = L._Get('sPVFormat',r[1],r[2]);
									if (logShow[1]==1&&divShow[3]==1) emb[3] = L._Get('sPVFormat',r[3],r[4]);
									}
								}
							}
						// embuscade ratée : "Tu as été remarquée..."
						else emb[1] = 'r';
						// Arcanes
						if (logShow[2]==1){
							var i,model = new RegExp(L._Get('sAmbushTest8'),'g'),
								arc = L._Get('sArc');
							while ((i=model.exec(msgContent))!=null){
								if (i[2]==att) emb[4].push([arc.indexOf(i[3]),Number(i[4])]);
								else if (i[2]==def) emb[5].push([arc.indexOf(i[3]),Number(i[4])]);
								}
							}
						// Evolutions
						if (logShow[3]==1){
							var i,model = new RegExp(L._Get('sAmbushTest9'),'g'),
								evo = L._Get('sEvo');
							while ((i=model.exec(msgContent))!=null){
								var y, model2 = new RegExp(L._Get('sAmbushTest10'),'g');
								while ((y=model2.exec(i[1]))!=null){
									if (i[2]==att) emb[6].push([evo.indexOf(y[2]),Number(y[3])]);
									else if (i[2]==def) emb[7].push([evo.indexOf(y[2]),Number(y[3])]);
									}
								}
							}
						// Caracs - sauvegarde l'ensemble - titres 43-55
						if (logShow[4]==1){
							var table = DOM._GetFirstNodeInnerHTML("//table[@class='fight']");
							if (table!=null){
								for (var i=0;i<13; i++){
								var r = new RegExp(L._Get('sAmbushTest11',L._Get('sColTitle')[i+43])).exec(table);
									if (r!=null){
										emb[8][i] = i==1?r[1]:Number(r[1]);
										emb[9][i] = i==1?r[2]:Number(r[2]);
										}
									}
								}
							}
						// Objets
						if (logShow[1]==1){
							var i,model = new RegExp(L._Get('sAmbushTest12'),'g'),
								obj = L._Get('sObjet');
							while ((i=model.exec(msgContent))!=null){
								if (i[2]==att&&divShow[4]==1) emb[10].push(obj.indexOf(i[3]));
								else if (i[2]==def&&divShow[5]==1) emb[11].push(obj.indexOf(i[3]));
								}
							}
						UpdateHistory(att==player?ID:att,def==player?ID:def,qsMid,null,emb);
						}
					}
				}
			else if (p=='pMsgFriendList'&&PREF._Get(p,'sh')==1){
				var theader = DOM._GetFirstNode("//div[@id='content-mid']//tr[@class='tblheader']"),
					ttable = DOM._GetFirstNode("(./ancestor::table)[last()]",theader),
					tlist = DOM._GetNodes("./following-sibling::tr",theader);
				if (ttable!=null&&theader!=null&&tlist!=null){
					var newTableIU = {
						'div':['div',{'id':'BWE'+p+'div','align':'center'},],
						'table':['table',{'id':'BWE'+p+'table','style':'width: 300px; margin-top: 20px;'},,,'div'],
						'thead':['thead',,,,'table'],
						'tr':['tr',{'id':'BWE'+p+'header','class':'tblheader'},,,'thead'],
						'tbody':['tbody',{'id':'BWE'+p+'body'},,,'table'],},
						newTable = IU._CreateElements(newTableIU);
					ttable.parentNode.insertBefore(newTable['div'],ttable.nextSibling);
					MixteTable(theader,tlist,p);
					ttable.setAttribute('style','display:none');
					}
				}
			else if (p=='pRank'&&PREF._Get(p,'sh')==1){
				var ttable = DOM._GetFirstNode("//div[@id='content-mid']//table[@class='rank']"),
					theader = DOM._GetFirstNode("./tbody/tr[@class='tblheader']",ttable),
					tlist = DOM._GetNodes("./following-sibling::tr",theader);
				if (ttable!=null&&theader!=null&&tlist!=null){
					var newTableIU = {
						'div':['div',{'id':'BWE'+p+'div','align':'center'},],
						'table':['table',{'id':'BWE'+p+'table','style':'width:95%;'},,,'div'],
						'thead':['thead',,,,'table'],
						'tr':['tr',{'id':'BWE'+p+'header','class':'tblheader'},,,'thead'],
						'tbody':['tbody',{'id':'BWE'+p+'body'},,,'table'],},
						newTable = IU._CreateElements(newTableIU);
					ttable.parentNode.insertBefore(newTable['div'],ttable.nextSibling);
					MixteTable(theader,tlist,p);
					ttable.setAttribute('style','display:none');
					}
				}
			else if (p=='pRootSettings'||p=='pSettingsAi'||p=='pSettingsAcc'||p=='pSettingsVac'||p=='pSettingsDelchar'){
				var nodeOptions = DOM._GetFirstNode("//div[@id='content-mid']//div[@class='top-options']");
				if (nodeOptions!=null){
					var titleMenuIU = {
						'1':['div',,[' - [ '],,nodeOptions],
						'2':['a',{'href':'#','onclick':'return false;'},[L._Get("sTitleMenu1")],{'click':[setMenuOptions]},'1'],
						'3':['span',,[' ] - [ '],,'1'],
						'4':['a',{'href':'#','onclick':'return false;'},[L._Get("sTitleMenu2")],{'click':[setMenuDB]},'1'],
						'5':['span',,[' ]'],,'1']},
						nodeTitle = IU._CreateElements(titleMenuIU);
					}
				}
			}
		else alert(L._Get("sUnknowID"));
		}
	}
console.debug('BWEEnd');
})();
