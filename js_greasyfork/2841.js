// ==UserScript==
// @name                WME Place tools
// @namespace           @test_Myriades
// @description         Add some buttons on different places. That makes some actions more easy to be done
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @icon                data:image/png;base64,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
// @version             0.9
// @copyright   		2014, Myriades
// @downloadURL https://update.greasyfork.org/scripts/2841/WME%20Place%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/2841/WME%20Place%20tools.meta.js
// ==/UserScript==

/* Global vars */
var WMEPT = {};
WMEPT = {'loaded': false, 'script_name': 'Places Tools', 'version': GM_info.script.version, 'script_URL': 'https://www.waze.com/forum/viewtopic.php?f=68&t=98212'};
WMEPT.options = {};
WMEPT.options = {'HL_on_off': true, 'Debug_Level': 3};
WMEPT.venue_defs = {};
//	-3 : never warn - -2 : undefined in wiki(warn the author only) - -1 : on représente pas - 0 : lieu - 1 : zone - 2 : au choix (dépends de la taille (X ou Y) > 50m )
//	Refer to : https://wiki.waze.com/wiki/Places#When_to_use_Area_or_Point
//	Car services
WMEPT.venue_defs['GAS_STATION'] = {'code': '0.0', 'type': 1};
WMEPT.venue_defs['PARKING_LOT'] = {'code': '0.1', 'type': -3};
WMEPT.venue_defs['GARAGE_AUTOMOTIVE_SHOP'] = {'code': '0.2', 'type': 0};
WMEPT.venue_defs['CAR_WASH'] = {'code': '0.3', 'type': 0};
WMEPT.venue_defs['CHARGING_STATION'] = {'code': '0.4', 'type': 0};
//	Transportation
WMEPT.venue_defs['AIRPORT'] = {'code': '1.0', 'type': 1};
WMEPT.venue_defs['BUS_STATION'] = {'code': '1.1', 'type': 0};
WMEPT.venue_defs['FERRY_PIER'] = {'code': '1.2', 'type': 0};
WMEPT.venue_defs['SEAPORT_MARINA_HARBOR'] = {'code': '1.3', 'type': 2};
WMEPT.venue_defs['SUBWAY_STATION'] = {'code': '1.4', 'type': 0};
WMEPT.venue_defs['TRAIN_STATION'] = {'code': '1.5', 'type': 0};
WMEPT.venue_defs['BRIDGE'] = {'code': '1.6', 'type': 1};
WMEPT.venue_defs['TUNNEL'] = {'code': '1.7', 'type': 1};
WMEPT.venue_defs['TAXI_STATION'] = {'code': '1.8', 'type': 0};
WMEPT.venue_defs['JUNCTION_INTERCHANGE'] = {'code': '1.9', 'type': 1};
//	PROFESSIONAL_AND_PUBLIC
WMEPT.venue_defs['COLLEGE_UNIVERSITY'] = {'code': '2.0', 'type': 1};
WMEPT.venue_defs['SCHOOL'] = {'code': '2.1', 'type': 1};
WMEPT.venue_defs['CONVENTIONS_EVENT_CENTER'] = {'code': '2.2', 'type': 2};
WMEPT.venue_defs['GOVERNMENT'] = {'code': '2.3', 'type': 0};
WMEPT.venue_defs['LIBRARY'] = {'code': '2.4', 'type': 0};
WMEPT.venue_defs['CITY_HALL'] = {'code': '2.5', 'type': 0};
WMEPT.venue_defs['ORGANIZATION_OR_ASSOCIATION'] = {'code': '2.6', 'type': 0};
WMEPT.venue_defs['PRISON_CORRECTIONAL_FACILITY'] = {'code': '2.7', 'type': 1};
WMEPT.venue_defs['COURTHOUSE'] = {'code': '2.8', 'type': 0};
WMEPT.venue_defs['CEMETERY'] = {'code': '2.9', 'type': 1};
WMEPT.venue_defs['FIRE_DEPARTMENT'] = {'code': '2.10', 'type': 0};
WMEPT.venue_defs['POLICE_STATION'] = {'code': '2.11', 'type': 0};
WMEPT.venue_defs['MILITARY'] = {'code': '2.12', 'type': 1};
WMEPT.venue_defs['HOSPITAL_MEDICAL_CARE'] = {'code': '2.13', 'type': 2};
WMEPT.venue_defs['OFFICES'] = {'code': '2.14', 'type': 2};
WMEPT.venue_defs['POST_OFFICE'] = {'code': '2.15', 'type': 0};
WMEPT.venue_defs['RELIGIOUS_CENTER'] = {'code': '2.16', 'type': 0};
WMEPT.venue_defs['KINDERGARDEN'] = {'code': '2.17', 'type': 0};
WMEPT.venue_defs['FACTORY_INDUSTRIAL'] = {'code': '2.18', 'type': 2};
WMEPT.venue_defs['EMBASSY_CONSULATE'] = {'code': '2.19', 'type': 1};
WMEPT.venue_defs['INFORMATION_POINT'] = {'code': '2.20', 'type': 0};
//	SHOPPING_AND_SERVICES
WMEPT.venue_defs['ARTS_AND_CRAFTS'] = {'code': '3.0', 'type': 0};
WMEPT.venue_defs['BANK_FINANCIAL'] = {'code': '3.1', 'type': 0};
WMEPT.venue_defs['SPORTING_GOODS'] = {'code': '3.2', 'type': 0};
WMEPT.venue_defs['BOOKSTORE'] = {'code': '3.3', 'type': 0};
WMEPT.venue_defs['PHOTOGRAPHY'] = {'code': '3.4', 'type': 0};
WMEPT.venue_defs['CAR_DEALERSHIP'] = {'code': '3.5', 'type': 2};
WMEPT.venue_defs['FASHION_AND_CLOTHING'] = {'code': '3.6', 'type': 0};
WMEPT.venue_defs['CONVENIENCE_STORE'] = {'code': '3.7', 'type': 0};
WMEPT.venue_defs['PERSONAL_CARE'] = {'code': '3.8', 'type': 0};
WMEPT.venue_defs['DEPARTMENT_STORE'] = {'code': '3.9', 'type': 0};
WMEPT.venue_defs['PHARMACY'] = {'code': '3.10', 'type': 0};
WMEPT.venue_defs['ELECTRONICS'] = {'code': '3.11', 'type': 0};
WMEPT.venue_defs['FLOWERS'] = {'code': '3.12', 'type': 0};
WMEPT.venue_defs['FURNITURE_HOME_STORE'] = {'code': '3.13', 'type': 0};
WMEPT.venue_defs['GIFTS'] = {'code': '3.14', 'type': 0};
WMEPT.venue_defs['GYM_FITNESS'] = {'code': '3.15', 'type': 0};
WMEPT.venue_defs['SWIMMING_POOL'] = {'code': '3.16', 'type': 0};
WMEPT.venue_defs['HARDWARE_STORE'] = {'code': '3.17', 'type': 0};
WMEPT.venue_defs['MARKET'] = {'code': '3.18', 'type': 0};
WMEPT.venue_defs['SUPERMARKET_GROCERY'] = {'code': '3.19', 'type': 2};
WMEPT.venue_defs['JEWELRY'] = {'code': '3.20', 'type': 0};
WMEPT.venue_defs['LAUNDRY_DRY_CLEAN'] = {'code': '3.21', 'type': 0};
WMEPT.venue_defs['SHOPPING_CENTER'] = {'code': '3.22', 'type': 1};
WMEPT.venue_defs['MUSIC_STORE'] = {'code': '3.23', 'type': 0};
WMEPT.venue_defs['PET_STORE_VETERINARIAN_SERVICES'] = {'code': '3.24', 'type': 0};
WMEPT.venue_defs['TOY_STORE'] = {'code': '3.25', 'type': 0};
WMEPT.venue_defs['TRAVEL_AGENCY'] = {'code': '3.26', 'type': 0};
WMEPT.venue_defs['ATM'] = {'code': '3.27', 'type': 0};
WMEPT.venue_defs['CURRENCY_EXCHANGE'] = {'code': '3.28', 'type': 0};
WMEPT.venue_defs['CAR_RENTAL'] = {'code': '3.29', 'type': 0};
//	FOOD_AND_DRINK
WMEPT.venue_defs['RESTAURANT'] = {'code': '4.0', 'type': 0};
WMEPT.venue_defs['BAKERY'] = {'code': '4.1', 'type': 0};
WMEPT.venue_defs['DESSERT'] = {'code': '4.2', 'type': 0};
WMEPT.venue_defs['CAFE'] = {'code': '4.3', 'type': 0};
WMEPT.venue_defs['FAST_FOOD'] = {'code': '4.4', 'type': 0};
WMEPT.venue_defs['FOOD_COURT'] = {'code': '4.5', 'type': 0};
WMEPT.venue_defs['BAR'] = {'code': '4.6', 'type': 0};
WMEPT.venue_defs['ICE_CREAM'] = {'code': '4.7', 'type': 0};
//	CULTURE_AND_ENTERTAINEMENT
WMEPT.venue_defs['ART_GALLERY'] = {'code': '5.0', 'type': 0};
WMEPT.venue_defs['CASINO'] = {'code': '5.1', 'type': 2};
WMEPT.venue_defs['CLUB'] = {'code': '5.2', 'type': 2};
WMEPT.venue_defs['TOURIST_ATTRACTION_HISTORIC_SITE'] = {'code': '5.3', 'type': 0};
WMEPT.venue_defs['MOVIE_THEATER'] = {'code': '5.4', 'type': 0};
WMEPT.venue_defs['MUSEUM'] = {'code': '5.5', 'type': 0};
WMEPT.venue_defs['MUSIC_VENUE'] = {'code': '5.6', 'type': 0};
WMEPT.venue_defs['PERFORMING_ARTS_VENUE'] = {'code': '5.7', 'type': 0};
WMEPT.venue_defs['GAME_CLUB'] = {'code': '5.8', 'type': 0};
WMEPT.venue_defs['STADIUM_ARENA'] = {'code': '5.9', 'type': 1};
WMEPT.venue_defs['THEME_PARK'] = {'code': '5.10', 'type': 1};
WMEPT.venue_defs['ZOO_AQUARIUM'] = {'code': '5.11', 'type': 2};
WMEPT.venue_defs['RACING_TRACK'] = {'code': '5.12', 'type': 1};
WMEPT.venue_defs['THEATER'] = {'code': '5.13', 'type': 0};
//	OTHER
WMEPT.venue_defs['RESIDENCE_HOME'] = {'code': '6.0', 'type': 0};
WMEPT.venue_defs['CONSTRUCTION_SITE'] = {'code': '6.1', 'type': -1};
//	LODGING
WMEPT.venue_defs['HOTEL'] = {'code': '7.0', 'type': 0};
WMEPT.venue_defs['HOSTEL'] = {'code': '7.1', 'type': 0};
WMEPT.venue_defs['CAMPING_TRAILER_PARK'] = {'code': '7.2', 'type': 2};
WMEPT.venue_defs['COTTAGE_CABIN'] = {'code': '7.3', 'type': 0};
WMEPT.venue_defs['BED_AND_BREAKFAST'] = {'code': '7.4', 'type': 0};
//	OUTDOORS
WMEPT.venue_defs['PARK'] = {'code': '8.0', 'type': 1};
WMEPT.venue_defs['PLAYGROUND'] = {'code': '8.1', 'type': 0};
WMEPT.venue_defs['BEACH'] = {'code': '8.2', 'type': 1};
WMEPT.venue_defs['SPORTS_COURT'] = {'code': '8.3', 'type': 0};
WMEPT.venue_defs['GOLF_COURSE'] = {'code': '8.4', 'type': 1};
WMEPT.venue_defs['PLAZA'] = {'code': '8.5', 'type': 0};
WMEPT.venue_defs['PROMENADE'] = {'code': '8.6', 'type': 0};
WMEPT.venue_defs['POOL'] = {'code': '8.7', 'type': -2}; // undefinded in wiki
WMEPT.venue_defs['SCENIC_LOOKOUT_VIEWPOINT'] = {'code': '8.8', 'type': 0};
WMEPT.venue_defs['SKI_AREA'] = {'code': '8.9', 'type': 1};
//	NATURAL_FEATURES
WMEPT.venue_defs['ISLAND'] = {'code': '9.0', 'type': 1};
WMEPT.venue_defs['SEA_LAKE_POOL'] = {'code': '9.1', 'type': 1};
WMEPT.venue_defs['RIVER_STREAM'] = {'code': '9.2', 'type': 1};
WMEPT.venue_defs['FOREST_GROVE'] = {'code': '9.3', 'type': 1};
WMEPT.venue_defs['FARM'] = {'code': '9.4', 'type': -1};
//	Translations
WMEPT.translations = {}
WMEPT.translations.fr = {};
WMEPT.translations.fr[0] = 'Masquer';
WMEPT.translations.fr[1] = 'Visible sur le smartphone';
WMEPT.translations.fr[2] = 'Informations supplémentaires';
WMEPT.translations.fr[3] = 'Oui';
WMEPT.translations.fr[4] = 'Non';
WMEPT.translations.fr[5] = 'Afficher tout';
WMEPT.translations.fr[6] = 'Filtre';
WMEPT.translations.fr[7] = 'Options / Outils';
WMEPT.translations.fr[8] = 'Aucun';
WMEPT.translations.fr[9] = 'Par défaut';
WMEPT.translations.fr[10] = 'Tous';
WMEPT.translations.fr[11] = 'Colorisation globale';
WMEPT.translations.fr[12] = 'Coloriser les POI invisibles sur le client';
WMEPT.translations.fr[13] = 'Utiliser la colorisation du LiveMap';
WMEPT.translations.fr[14] = 'Catégories';
WMEPT.translations.fr[15] = 'Masquer cette catégorie';
WMEPT.translations.fr[16] = 'Ne <span style="font-weight: bold;">JAMAIS</span> représenter';
WMEPT.translations.fr[17] = 'Cette zone <span style="font-weight: bold;">DOIT</span> être un point';
WMEPT.translations.fr[18] = 'Ce point<span style="font-weight: bold;">DOIT</span> être une zone';
WMEPT.translations.fr[19] = 'Cette zone <span style="font-weight: bold;">DEVRAIT</span> être un point.<br>Elle est trop petite pour être affichée sur le client.';
WMEPT.translations.fr[20] = 'Cette zone <span style="font-weight: bold;">EST</span> trop petite pour être affichée sur le client.</p><p>Vous pouvez toutefois tenter de l\'agrandir en y ajoutant le parking attenant (+5m min).';
WMEPT.translations.fr[21] = 'Utilisation d\'une catégorie principale';
WMEPT.translations.fr[22] = {text:"Parking sans nom", wiki:"https://wiki.waze.com/wiki/Lieux/Parkings#Nommage", link:"Nommer en [P]"};
WMEPT.translations.fr[23] = 'On-Off';
WMEPT.translations.fr[24] = 'Hauteur de la boite (N/S)';
WMEPT.translations.fr[25] = 'Largeur de la boite (E/O)';
WMEPT.translations.fr[26] = 'Aire réelle';
WMEPT.translations.en = {};
WMEPT.translations.en[0] = 'Hide';
WMEPT.translations.en[1] = 'Venue is visible on client';
WMEPT.translations.en[2] = 'Extra informations';
WMEPT.translations.en[3] = 'Yes';
WMEPT.translations.en[4] = 'No';
WMEPT.translations.en[5] = 'Show all';
WMEPT.translations.en[6] = 'Filter';
WMEPT.translations.en[7] = 'Options / Tools';
WMEPT.translations.en[8] = 'None';
WMEPT.translations.en[9] = 'Reset to default';
WMEPT.translations.en[10] = 'All';
WMEPT.translations.en[11] = 'General highlight';
WMEPT.translations.en[12] = 'Highlight too small landmarks';
WMEPT.translations.en[13] = 'Use livemap coloration style';
WMEPT.translations.en[14] = 'Categories';
WMEPT.translations.en[15] = 'Hide this place type';
WMEPT.translations.en[16] = '<span style="font-weight: bold;">NEVER</span> draw';
WMEPT.translations.en[17] = 'This area <span style="font-weight: bold;">MUST</span> be a point';
WMEPT.translations.en[18] = 'This point<span style="font-weight: bold;">MUST</span> be an area';
WMEPT.translations.en[19] = 'This area <span style="font-weight: bold;">SHOULD</span> be a point.<br>The area is too small to be visible on the phone';
WMEPT.translations.en[20] = 'This area <span style="font-weight: bold;">IS</span> too small to be visible on the phone.</p><p>Try to increase it (+5m max).';
WMEPT.translations.en[21] = 'Do NOT uses a main categorie';
WMEPT.translations.en[22] = {text:"Unnamed parking", wiki:"https://wiki.waze.com/wiki/Places/Parking_lot#Naming", link:"Fix to [P]"};
WMEPT.translations.en[23] = 'On-Off';
WMEPT.translations.en[24] = 'Box height (N/S)';
WMEPT.translations.en[25] = 'Box width (E/O)';
WMEPT.translations.en[26] = 'Real area';
WMEPT.translations.cs = {};
WMEPT.translations.cs[0] = 'Skrýt';
WMEPT.translations.cs[1] = 'Místo je zobrazeno v klientu';
WMEPT.translations.cs[2] = 'Další informace';
WMEPT.translations.cs[3] = 'Ano';
WMEPT.translations.cs[4] = 'Ne';
WMEPT.translations.cs[5] = 'Zobrazit vše';
WMEPT.translations.cs[6] = 'Filtr';
WMEPT.translations.cs[7] = 'Nastavení';
WMEPT.translations.cs[8] = 'Nic';
WMEPT.translations.cs[9] = 'Obnovit výchozí';
WMEPT.translations.cs[10] = 'Vše';
WMEPT.translations.cs[11] = 'Obecné zvýraznění';
WMEPT.translations.cs[12] = 'Zvýraznit příliš malá místa';
WMEPT.translations.cs[13] = 'Použít barevný styl livemap';
WMEPT.translations.cs[14] = 'Kategorie';
WMEPT.translations.cs[15] = 'Skrýt tento typ míst';
WMEPT.translations.cs[16] = '<span style="font-weight: bold;">NIKDY</span> nekreslit';
WMEPT.translations.cs[17] = 'Toto místo <span style="font-weight: bold;">MUSÍ</span> být bod';
WMEPT.translations.cs[18] = 'Toto místo<span style="font-weight: bold;">MUSÍ</span> být plocha';
WMEPT.translations.cs[19] = 'Toto místo <span style="font-weight: bold;">BY MĚLO</span> být bod.<br>Plocha prvku je příliš malá pro zobrazení v klientu';
WMEPT.translations.cs[20] = 'Tato plocha <span style="font-weight: bold;">JE</span> příliš malá pro zobrazení v klientu.</p><p>Zkuste ji zvětšit (maximálně o 5 metrů).';
WMEPT.translations.cs[21] = 'NEPOUŽÍVEJTE obecné kategorie';
WMEPT.translations.cs[22] = {text:"Nepojmenované parkoviště", wiki:"https://wiki.waze.com/wiki/M%C3%ADsta#Parkovi.C5.A1t.C4.9B", link:"Pojmenovat [P]"};
WMEPT.translations.cs[23] = 'Zapnout/Vypnout';
WMEPT.translations.cs[24] = 'Výška prvku';
WMEPT.translations.cs[25] = 'Šířka prvku';
WMEPT.translations.cs[26] = 'Plocha prvku';
var HL_options = [];
var isReset = false;
var requested_div = "";
var pin_error = 'data:image/png;base64,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';
var pin_missused = 'data:image/png;base64,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';


/* bootstrap, will call HL_init() */
function HL_bootstrap(){
	HL_addLog(1, 'info', 'init');
	// if (typeof(unsafeWindow) === "undefined"){
		// unsafeWindow = ( function () {
			// var dummyElem = document.createElement('p');
			// dummyElem.setAttribute('onclick', 'return window;');
			// return dummyElem.onclick();
		// }) ();
	// }
	// /* begin running the code! */
	setTimeout(HL_init, 1000);
}

/* helper function */
function getElementsByClassName(classname, node) {
  if(!node) node = document.getElementsByTagName("body")[0];
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = node.getElementsByTagName("*");
  for (var i=0,j=els.length; i<j; i++)
    if (re.test(els[i].className)) a.push(els[i]);
  return a;
}

function getId(node) {
  return document.getElementById(node);
}

function DOMDataFilter(obj){
	return JSON.parse(JSON.stringify(obj));
}

function getSelectedValue(node){
	var t = getId(node);
	return t.options[t.selectedIndex].value;
}

function PT_int_trans(Index_need2beTrans){
	if(typeof(WMEPT.translations[HL_cur_lng]) != 'undefined'){
		switch(typeof(WMEPT.translations[HL_cur_lng][Index_need2beTrans])){
			case 'string':
				return WMEPT.translations[HL_cur_lng][Index_need2beTrans];
			case 'object':
				if(arguments.length > 1){
					return WMEPT.translations[HL_cur_lng][Index_need2beTrans][arguments[1]];
				}
		}
	}
	switch(typeof(WMEPT.translations.en[Index_need2beTrans])){
		case 'string':
			return WMEPT.translations.en[Index_need2beTrans] + ' (u)';
		case 'object':
			if(arguments.length > 1){
				return WMEPT.translations.en[Index_need2beTrans][arguments[1]] + ' (u)';
			}
		default:
			return 'Error nothing is defined, alert author plz';
	}
}

function HL_getTranslations(){
	HL_def_translations = HL_translations[HL_def_lng];
	HL_available_translations = HL_translations[HL_cur_lng];
	if(HL_available_translations.venues){
		HL_categories_translations = HL_available_translations.venues.categories;
	}
	else{
		HL_categories_translations = HL_def_translations.venues.categories;
	}
	HL_SortTranslatedPOI(HL_categories_translations);
}

function HL_SortTranslatedPOI(theObj){
	HL_translatedPOI = [];
	for(var i in theObj){
		HL_translatedPOI.push({'key':i, 'value':theObj[i]});
    }
	HL_translatedPOI.sort(function(a,b){return a.value.localeCompare(b.value);});
}

function clacAngle(){
/*
	fA = Sqr(((Xc - Xb) ^ 2) + ((Yc - Yb) ^ 2)) 'distance entre b et c
	fB = Sqr(((Xc - Xa) ^ 2) + ((Yc - Ya) ^ 2)) 'distance entre a et c
	fC = Sqr(((Xb - Xa) ^ 2) + ((Yb - Ya) ^ 2)) 'distance entre a et b
	fAngle = ((fA ^ 2) + (fC ^ 2) - (fB ^ 2)) / (2 * fA * fC) '(a2 + c2 - b2) / (2*a*c)
	Acos(fAngle) 'inverse du cosinus
	Degrees(fAngle) 'fonction degree
*/
}

function HL_addLog(HL_Level, HL_type, HL_text){
	if(HL_Level <= WMEPT.options.Debug_Level){
		var HLaL_text = 'WME_PT_' + WMEPT.version + ' : ' + HL_text;
		switch(HL_type){
			case 'info':
				console.info(HLaL_text);
				break;
			case 'error':
				console.error(HLaL_text);
				break;
			default:
				console.log(HLaL_text);
				break;
		}
		if(typeof(arguments[3]) !== 'undefined'){
			console.debug(HLaL_text);
			console.debug(arguments[3]);
		}
	}
}

function getVenues(){
	//	les catégories
	PT_Cat = [];
	PT_Cat = DOMDataFilter(HL_config_venues.categories);
	HL_addLog(2, 'info', 'PT_Cat', PT_Cat);
	//	Les définitions de lieux et points
	var l = 0;
	var warn_author = false;
	for(var i=0; i<PT_Cat.length; i++){
		var SCat = DOMDataFilter(HL_config_venues.subcategories[PT_Cat[i]]);
		HL_addLog(2, 'info', 'SCat', SCat);
		var SCatLen = SCat.length;
		for(var j=0; j<SCatLen; j++){
			var found = false;
			var code = i+'.'+j;
			//	now search for the defined obj
			var index = 0;
			for(var k in WMEPT.venue_defs){
				//	Same subcategory
				if(k.localeCompare(SCat[j]) == 0){
					//	Different code
					if(WMEPT.venue_defs[k].code != code){
						WMEPT.venue_defs[k].code = code;
						WMEPT.venue_defs[k].comment = 'Code has changed';
						warn_author = true;
						if(HL_user.id == 39613931)HL_addLog(1, 'info', 'Some category code changed : ' + k + ' :: ' + code);
					}
					WMEPT.venue_defs[k].name = SCat[j];
					WMEPT.venue_defs[k].parent = PT_Cat[i];
					found = true;
					index++;
					break;
				}
			}
			//	or add a new obj
			if(!found){
				index++;
				WMEPT.venue_defs[SCat[j]] = {'code': code, 'type': '-2', 'name': SCat[j], 'parent': PT_Cat[i], 'comment': 'not defined in wiki'};
				if(HL_user.id == 39613931){
					warn_author = true;
					HL_addLog(1, "info", 'New subcategory; Check :' + PT_Cat[i] + ' :: ' + SCat[j] + ' ::: ' + code);
				}
			}
		}
	}
	if(warn_author && HL_user.id == 39613931)alert('There are some changes in subcategories. Check logs');
	HL_addLog(1, 'info', 'venue loaded', WMEPT);
}

function checkVenue(venue){
	//	-3 : never warn - -2 : undefined in wiki(warn the author only) - -1 : on représente pas - 0 : lieu - 1 : zone - 2 : au choix (dépends de la taille (X ou Y) > 50m ) - 3 : pas de catégorie en source - 4 : Parking sans nom
	var categorie = venue.attributes.categories[0];
	//	Cas des parkings		A FAIRE!!!
	if(categorie == "PARKING_LOT"){
		if(venue.attributes.name == ""){
			return 4;
		}
	}
	//	En général
	for(var i in WMEPT.venue_defs){
		var venue_def = WMEPT.venue_defs[i];
		//	Catégorie en type == erreur
		if(venue_def.parent == categorie){
			return 3;
		}
		//	correspond à une sous catégorie
		if(venue_def.name == categorie){
			return venue_def.type;	//	-3, -2, -1, 0, 1, 2
		}
	}
	return -3;
}

function FixParkingLot(isFree){
	switch(isFree){
		case true:
			HL_waze_model.actionManager.add(new HL_Waze.Action.UpdateObject(HL_selectionManager.selectedItems[0], {name: '[P]'}));
			break;
		case false:
			HL_waze_model.actionManager.add(new HL_Waze.Action.UpdateObject(HL_selectionManager.selectedItems[0], {name: '[P]€'}));
			break;
	}
}

function HL_POI_html_init(){
	//	Primary checks
	if(getId('HL_POI_extra_infos') != null)return;
	selVenue = HL_selectionManager.selectedItems[0];
	if(typeof(selVenue) === 'undefined')return;
	if(selVenue.type != 'venue')return;
	HL_POI_html();
}

function HL_POI_html(){
	//	Primary checks
	var LandGeometry = selVenue.geometry;
	if(typeof(LandGeometry) === 'undefined')return;
	var LandBounds = LandGeometry.bounds;
	if(typeof(LandBounds) === 'undefined')return;
	//	Landmark infos
	var WME_POI_infos = getId('landmark-edit-general');
	WME_HL_POI_addon = document.createElement('div');
	WME_HL_POI_addon.id = 'HL_POI_extra_infos';
	//	Area Vars
	var lm_width = Math.abs(LandBounds.left - LandBounds.right);
	var lm_height = Math.abs(LandBounds.bottom - LandBounds.top);
	var lm_is_visible = '<span style="color: red; font-weight: bold;">' + PT_int_trans(4) + '</span>';
	if(lm_width >= 50 || lm_height >= 50)lm_is_visible = '<span style="color: green;">' + PT_int_trans(3) + '</span>';
	//	HTML rendering
	WME_HL_POI_addon.innerHTML = '<hr><b>' + PT_int_trans(2) + '</b><br>';
	WME_HL_POI_addon.innerHTML += '- ' + PT_int_trans(1) + ' : ' + lm_is_visible + '<br>';
	if(isArea(selVenue)){
		var lm_aera = LandGeometry.getArea();
		WME_HL_POI_addon.innerHTML += '- ' + PT_int_trans(25) + ' : ' + (Math.round(lm_width * 100) / 100) + 'm<br>';
		WME_HL_POI_addon.innerHTML += '- ' + PT_int_trans(24) + ' : ' + (Math.round(lm_height * 100) / 100) + 'm<br>';
		WME_HL_POI_addon.innerHTML += '- ' + PT_int_trans(26) + ' : ' + (Math.round(lm_aera * 1) / 1) + ' m²<br>';
	}
	if(WMEPT.options['HL_on_off']){
		WME_HL_POI_addon.innerHTML += '<input type="button" id="_HL_btn_hide_all" value="' + PT_int_trans(15) + '" /><br>';
		// WME_HL_POI_addon.innerHTML += '<input type="button" id="_HL_btn_fix_geo" value="Fix place geometry" /><br>';
	}
	WME_POI_infos.appendChild(WME_HL_POI_addon);
	//	Event
	if(WMEPT.options['HL_on_off']){
		getId('_HL_btn_hide_all').onclick = HL_btn_Hider;
	}
	//	Place tools validator infos
	//	The new elem
	var showElem = false;
	var WME_POI_EC_HTML = document.createElement('div');
	WME_POI_EC_HTML.innerHTML = '<a href="' + WMEPT.script_URL + '" target="_blank">WME Places Tools</a> : validator<br/>';
	var testedVenue = checkVenue(selVenue);
	switch(testedVenue){
		case -3:
			break;
		case -2:
			break;
		case -1:
			showElem = true;
			WME_POI_EC_HTML.innerHTML += '<p style="color: red;">' + PT_int_trans(16) + '</p>';
			break;
		case 0:
			if(isArea(selVenue)){
				showElem = true;
				WME_POI_EC_HTML.innerHTML += '<p style="color: red;">' + PT_int_trans(17) + '</p>';
			}
			break;
		case 1:
			if(!isArea(selVenue)){
				showElem = true;
				WME_POI_EC_HTML.innerHTML += '<p style="color: red;">' + PT_int_trans(18) + '</p>';
			}
			break;
		case 2:
			if(isArea(selVenue)){
				showElem = true;
				switch(is2small(selVenue)){
					case 1:
						WME_POI_EC_HTML.innerHTML += '<p style="color: violet;">' + PT_int_trans(19) + '</p>';
						break;
					case 2:
						WME_POI_EC_HTML.innerHTML += '<p style="color: orange;">' + PT_int_trans(20) + '</p>';
						break;
				}
			}
			break;
		case 3:
			showElem = true;
			WME_POI_EC_HTML.innerHTML += '<p style="color: red;">' + PT_int_trans(21) + '</p>';
			break;
		case 4:
			showElem = true;
			var lang = '';
			if(typeof(HL_translations[HL_cur_lng].number) != 'object')lang = 'en';
			else if(typeof(HL_translations[HL_cur_lng].number.currency) != 'object')lang = 'en';
			else if(typeof(HL_translations[HL_cur_lng].number.currency.format) != 'object')lang = 'en';
			else lang = HL_cur_lng;
			WME_POI_EC_HTML.innerHTML += '<p><a href="' + PT_int_trans(22, 'wiki') + '" target="_blank" style="color: red;">' + PT_int_trans(22, 'text') + '</a></p><p style="text-align: center; width: 100%;"><input id="HL_Btn_fix_P" type="button" value="' + PT_int_trans(22, 'link') + '" /><span style="width: 15px;">&nbsp;</span><input id="HL_Btn_fix_PE" type="button" value="' + PT_int_trans(22, 'link') + HL_translations[lang].number.currency.format.unit + '" /></p>';
			break;
		default:
			showElem = true;
			WME_POI_EC_HTML.innerHTML += '<p>erreur</p>';
			break;
	}
	WME_POI_EC_HTML.innerHTML += '<hr />';
	//	the replacement
	if(showElem){
		var WME_edit_panel = getId('landmark-edit-general');
		var parentDiv = WME_edit_panel.parentNode;
		var theNewElem = parentDiv.insertBefore(WME_POI_EC_HTML, WME_edit_panel);
		if(testedVenue == 4){
			getId('HL_Btn_fix_P').onclick = function (){FixParkingLot(true);};
			getId('HL_Btn_fix_PE').onclick = function (){FixParkingLot(false);};
		}
	}
	HL_addLog(1, 'info', 'Renderred landmark extra infos');
}

function HL_btn_Hider(){
	getId('HL_' + selVenue.attributes.categories[0]).checked = true;
	HL_selectionManager.unselectAll();
}

function HL_html(){
	//	Les traductions
	HL_getTranslations();
	//	L'onglet
	newtab = document.createElement('li');
	newtab.id = 'HL_tab_selector';
	newtab.innerHTML = '<a href="#sidepanel-hidel" data-toggle="tab">' + WMEPT.script_name + '</a>';
	HL_navTabs.appendChild(newtab);
	//	Le contenant 1
	var addon = document.createElement('div');
	addon.id = "sidepanel-hidel";
	addon.className = "tab-pane";
	//	L'entête du contenu
	addon.innerHTML = '<b><a href="' + WMEPT.script_URL + '" target="_blank"><u>' + WMEPT.script_name + '</u></a></b> v ' + WMEPT.version;
	addon.innerHTML += '<span style="padding-left: 20px;"><input type="checkbox" id="HL_on_off" /><label style="padding-left: 5px;" for="HL_on_off">' + PT_int_trans(23) + '</label></span>';
	HL_tabContent.appendChild(addon);
	//	Les onglets du plugin
	myTabs = document.createElement('ul');
	myTabs.id = 'HL_tab_subselector';
	myTabs.className = "nav nav-tabs";
	myTabs.innerHTML = '<li class="active"><a href="#hidel-hidding" data-toggle="tab">' + PT_int_trans(0) + '</a></li>';
	myTabs.innerHTML += '<li class=""><a href="#hidel-tools" data-toggle="tab">' + PT_int_trans(7) + '</a></li>';
	// myTabs.innerHTML += '<li class=""><a href="#hidel-infos" data-toggle="tab">Infos</a></li>';
	addon.appendChild(myTabs);
	//	Le contenant 2
	var addon_tab_content = document.createElement('div');
	addon_tab_content.className = "tab-content";
	addon.appendChild(addon_tab_content);
	//	Le contenu 1
	var section = document.createElement('p');
	section.className = "tab-pane active";
	section.style.padding = "8px 16px";
	section.style.textIndent = "-16px";
	section.id = "hidel-hidding";
	//	Commons
	section.innerHTML = '<div style="text-align: center;">'
						+ '<input type="button" id="btn_hl_none" value="' + PT_int_trans(8) + '" /><span style="padding-left: 3px;"></span>'
						+ '<input type="button" id="btn_hl_reset" value="' + PT_int_trans(9) + '" /><span style="padding-left: 3px;"></span>'
						+ '<input type="button" id="btn_hl_all" value="' + PT_int_trans(10) + '" /></div>'
						+ '<div style="text-align: center;">'
						+ '<label for="text_hl_filter" style="padding-right: 5px;">' + PT_int_trans(6) + '</label><input type="button" id="btn_hl_FR" value="X" /><br />'
						+ '<input type="text" class="form-control" id="text_hl_filter" /></div>'
						+ '<div style="text-align: center;">'
						+ '<label for="PT_Cat_Filter" style="margin-right: 15px;" >' + PT_int_trans(14) + '</label><select id="PT_Cat_Filter">'
						+ '<option value="-1">' + PT_int_trans(5) + '</option>';
	section.innerHTML += '</select></div>'
						+ '<div id="HL_common"></div>';
	addon_tab_content.appendChild(section);
	//	populate dropdown list
	PT_sorted_Cat = DOMDataFilter(PT_Cat);
	PT_sorted_Cat.sort();
	/*		V1		*/
	var PT_select = getId('PT_Cat_Filter');
	for(var i=0; i < PT_sorted_Cat.length; i++){
		for(var j=0; j < PT_Cat.length; j++){
			if(PT_sorted_Cat[i] == PT_Cat[j]){
				var dummy = document.createElement('option');
				dummy.value = j;
				//	I18n.translations.fr.venues.categories
				if(typeof(HL_translations[HL_cur_lng]) != 'undefined'){
					if(typeof(HL_translations[HL_cur_lng].venues) != 'undefined'){
						if(typeof(HL_translations[HL_cur_lng].venues.categories) != 'undefined'){
							dummy.text = HL_translations[HL_cur_lng].venues.categories[PT_sorted_Cat[i]];
						}
					}
				}
				else{
					dummy.text = HL_translations.en.venues.categories[PT_sorted_Cat[i]];
				}
				PT_select.add(dummy);
			}
		}
	}
	//	Populate HL_common
	var Hl_common = getId('HL_common');
	for(var i=0; i<HL_translatedPOI.length; i++){
		Hl_common.innerHTML += '<div id="_HL_' + HL_translatedPOI[i].key + '" style="display: block;"><input type="checkbox" id="HL_' + HL_translatedPOI[i].key + '" >&nbsp;' + HL_translatedPOI[i].value;
		// <label style="padding-left: 20px;" for="' + HL_translatedPOI[i].key + '">' + HL_translatedPOI[i].value + '</label></<div>';
	}
	//	Le contenu 2
	var section = document.createElement('p');
	section.className = "tab-pane";
	section.style.padding = "8px 16px";
	section.style.textIndent = "-16px";
	section.id = "hidel-tools";
	section.innerHTML = '<b>' + PT_int_trans(7) + '</b><br>';
	section.innerHTML += '<input type="checkbox" id="lh_glh">&nbsp;' + PT_int_trans(11) + '<br>';
	section.innerHTML += '<input type="checkbox" id="st_sl">&nbsp;' + PT_int_trans(12) + '<br>';
	// section.innerHTML += '<input type="checkbox" id="h2l2">&nbsp;Highlight too high level landmark (not yet)<br>';
	// section.innerHTML += '<input type="button" id="d2_sl" value="Delete too small landmarks">&nbsp;(lvl 3)(not yet)<br>';
	section.innerHTML += '<input type="checkbox" id="pt_lmcs">&nbsp;' + PT_int_trans(13) + '<br>';
	addon_tab_content.appendChild(section);
	//	Events
	getId('PT_Cat_Filter').onchange = HL_HTML_filter;
	getId('btn_hl_reset').onclick = function(){	getId('PT_Cat_Filter').options[0].selected = true; isReset = true; HideDefaultOptions(); HL_HTML_filter();};
}

function HL_HTML_filter(){
	var filtre = getId('text_hl_filter').value.toLowerCase();
	for(var i=0; i<HL_translatedPOI.length; i++){
		// HL_addLog(3, 'info', 'HL_translatedPOI[i]', HL_translatedPOI[i]);
		var HL_string = HL_translatedPOI[i].value.toLowerCase();
		if(HL_string.indexOf(filtre) >= 0 && isInCat(HL_translatedPOI[i])){
			getId('_HL_' + HL_translatedPOI[i].key).style.display = 'block';
		}
		else{
			getId('_HL_' + HL_translatedPOI[i].key).style.display = 'none';
		}
	}
}

function isInCat(theSearch){
	var selCat = getId('PT_Cat_Filter');
	var selValue = selCat.value;
	if(selValue == -1)return true;
	for(var i in WMEPT.venue_defs){
		if(i == theSearch.key && selValue == WMEPT.venue_defs[i].code.split('.')[0])return true;
	}
	return false;
}

function ShowHideAll(theCheck){
	var HL_script = getId('hidel-hidding');
	var HL_script_inputs = HL_script.getElementsByTagName('input');
	var selValue = getId('PT_Cat_Filter').value;
	for(var i=0; i < HL_script_inputs.length; i++){
		if(selValue == -1){	//	tous
			HL_script_inputs[i].checked = theCheck;
			continue;
		}
		//	spécifique à la catégorie
		for(var j in WMEPT.venue_defs){
			var CatCode = WMEPT.venue_defs[j].code.split('.')[0];
			var CatName = 'HL_' + WMEPT.venue_defs[j].name;
			if(selValue == CatCode && HL_script_inputs[i].id == CatName){
				HL_script_inputs[i].checked = theCheck;
				break;
			}
		}
	}
}

//	On masque/affiche les places et +
function HideL(){
	getId('HL_on_off').checked?HL_landmarkLayer.setVisibility(true):HL_landmarkLayer.setVisibility(false);
	if(HL_waze_venues.active === true){
		for(var venue in HL_waze_venues.objects){
			var landmark = HL_waze_venues.get(venue);
			if(landmark.state == 'Insert')continue;
			var poly = getId(landmark.geometry.id);
			if(poly !== null){
				if(getId('HL_on_off').checked){
					WMEPT.options['HL_on_off'] = true;
					//	Check if visibility is allowed
					var theId = 'HL_' + landmark.attributes.categories[0];
					if(getId(theId).checked){
						poly.setAttribute("visibility", "hidden");
						continue;
					}
					else{
						poly.setAttribute("visibility", "visible");
					}
					//	General highlight
					if(getId('lh_glh').checked){
						var fillColor = "#999";
						var stroke = "#ccc";
						var fillOpacity = 0.5;
						//	Highlight 2 small valid landmark
						var isOk = true;
						if(getId('st_sl').checked){
							switch(is2small(landmark)){
								case 1:
									stroke = "#FF0000";
									fillColor = "#FF4D4D";
									isOk = false;
									break;
								case 2:
									stroke = "#FF0000";
									fillColor = "#FF9900";
									isOk = false;
									break;
							}
						}
						//	-3 : never warn - -2 : undefined in wiki(warn the author only) - -1 : on représente pas - 0 : lieu - 1 : zone - 2 : au choix (ou dépendent de la taille (X ou Y) > 50m ) - 3 : pas de catégorie en source
						var POI_type = checkVenue(landmark);
						switch(POI_type){
							case -3:	//	never warn
							case -2:	//	warn author, problem in defs
							case -1:	//	never represent
								break;
							case 0:	//	point
								if(isArea(landmark)){
									stroke = "#7821AD";
									fillColor = "#AD41F0";
									isOk = false;
								}
								break;
							case 1:	//	area
								if(!isArea(landmark)){
									var poi = getId(landmark.geometry.id);
									poi.setAttribute('href', pin_error);
									isOk = false;
								}
								break;
							case 2: // both but size dependent
								if(isArea(landmark)){
									switch(is2small(landmark)){
										case 1:
											stroke = "#7821AD";
											fillColor = "#AD41F0";
											isOk = false;
											break;
										case 2:
											stroke = "#FF0000";
											fillColor = "#FF9900";
											isOk = false;
											break;
									}
								}
								break;
							case 3:	//	error, do NOT use a main category as a subcategory
								isOk = false;
								if(isArea(landmark)){
									stroke = "#3737C4";
									fillColor = "#A1A1F6";
								}
								else{
									var poi = getId(landmark.geometry.id);
									poi.setAttribute('href', pin_missused);
								}
								break;
							case 4:	//	unnamed parking lot
								stroke = "#00A";
								fillColor = "#FF4D4D";
								break;
						}
						//	Default coloring (livemap style)
						if(isOk && getId('pt_lmcs').checked){
							switch(landmark.attributes.categories[0]){
								case 'PARKING_LOT':
									stroke = "#00A";
									// fillColor = "#E7E7E7";
									break;
								case 'RIVER_STREAM':
								case 'SEA_LAKE_POOL':
									stroke = "#4C6198";
									fillColor = "#03B9DA";
									break;
								case 'HOSPITAL_MEDICAL_CARE':
								case 'PET_STORE_VETERINARIAN_SERVICES':
									stroke = "#ED10E6";
									fillColor = "#E39AE1";
									break;
								case 'CEMETERY':
									stoke = "#B6BFB1";
									fillcolor = "#D6DED2";
									break;
							}
						}
						poly.setAttribute("stroke", stroke);
						poly.setAttribute("fill", fillColor);
						poly.setAttribute("fill-opacity",fillOpacity);
						continue;
					}
					else{
						poly.setAttribute("visibility", "visible");
						poly.setAttribute("fill", "#d191d6");
						poly.setAttribute("stroke", "#d191d6");
						poly.setAttribute("fill-opacity", 0.3);
					}
				}
				else{
					WMEPT.options['HL_on_off'] = false;
					poly.setAttribute("visibility", "visible");
					poly.setAttribute("fill", "#d191d6");
					poly.setAttribute("stroke", "#d191d6");
					poly.setAttribute("fill-opacity", 0.3);
				}
			}
		}
	}
}

function is2small(landmark){
	if(HL_waze_Map.zoom < 5)return 0;
	if(!getId('st_sl').checked)return 0;
	var LandBounds = landmark.geometry.bounds;
	var v_Dist = Math.abs(LandBounds.bottom - LandBounds.top);
	var h_Dist = Math.abs(LandBounds.left - LandBounds.right);
	if(v_Dist < 45 && h_Dist < 45)return 1;
	if(v_Dist < 50 && h_Dist < 50)return 2;
	return 0;
}

function isArea(venue){
	var LandBounds = venue.geometry.bounds;
	return ((LandBounds.left == LandBounds.right) && (LandBounds.bottom == LandBounds.top))? false : true;
}

//	On vérifie les options pour la sauvegarde
function HL_CheckOptions(){
	getInputs('hidel-hidding');
	getInputs('hidel-tools');
	//	On-Off
	addRemove(getId('HL_on_off'));
}

function getInputs(divId){
	var HL_script = getId(divId);
	var HL_script_inputs = HL_script.getElementsByTagName('input');
	for(var i=0; i < HL_script_inputs.length; i++){
		addRemove(HL_script_inputs[i]);
	}
}

function addRemove(DOMinput){
	//	Ajout
	if(DOMinput.checked === true){
		if(HL_options.indexOf(DOMinput.id) == -1){
			HL_options.push(DOMinput.id);
		}
	}
	//	Retrait
	else{
		if(HL_options.indexOf(DOMinput.id) > -1){
			HL_options.splice(HL_options.indexOf(DOMinput.id),1);
		}
	}
}

//	restore saved settings
function HL_restoreOptions(){
	if(localStorage.WMEPTScript) {
		HL_options = JSON.parse(localStorage.WMEPTScript);
		for(var i=0; i < HL_options.length; i++){
			getId(HL_options[i]).checked = true;
		}
	}
	//	Default options
	else{
		getId('HL_on_off').checked = true;
		getId('lh_glh').checked = true;
		getId('st_sl').checked = true;
		getId('pt_lmcs').checked = true;
		HideDefaultOptions();
	}
}

function HideDefaultOptions(){
	if(isReset === true){
		var HL_script = getId('hidel-hidding');
		var HL_script_inputs = HL_script.getElementsByTagName('input');
		for(var i=0; i < HL_script_inputs.length; i++){
			HL_script_inputs[i].checked = false;
		}
	}
	getId('HL_PARK').checked = true;
	getId('HL_FOREST_GROVE').checked = true;
	getId('HL_SEA_LAKE_POOL').checked = true;
	getId('HL_RIVER_STREAM').checked = true;
	isReset = false;
	HL_CheckOptions();
}

//	overload the WME exit function
function HL_saveOptions(){
	if(localStorage){
		HL_CheckOptions();
		var HL_options_JSON = JSON.stringify(HL_options);
		localStorage.WMEPTScript = HL_options_JSON;
		HL_addLog(1, 'info', 'options saved');
	}
}

function HL_init(){
	//	Waze object needed
	if(typeof(unsafeWindow.Waze) == 'undefined'){
		HL_addLog(1, 'error', 'unsafeWindow.W NOK', unsafeWindow.Waze);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_Waze = unsafeWindow.Waze;
	if(typeof(HL_Waze.Config) == 'undefined'){
		HL_addLog(1, 'error', 'Config NOK', HL_Waze.Config);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_waze_config = HL_Waze.Config;
	if(typeof(HL_waze_config.ready) == 'undefined'){
		HL_addLog(1, 'error', 'Config NOK', HL_waze_config.ready);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_config_ready = HL_waze_config.ready;
	var HL_status = HL_config_ready.state();
	if(HL_status != 'resolved'){
		HL_addLog(1, 'error', 'Config status', HL_status);
		window.setTimeout(HL_init, 500);
		return;
	}
	if(typeof(HL_Waze.location) == 'undefined'){
		HL_addLog(1, 'error', 'HL_env NOK', HL_Waze.location);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_env = HL_Waze.location;
	if(typeof(HL_Waze.map) == 'undefined'){
		HL_addLog(1, 'error', 'map NOK', HL_Waze.map);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_waze_Map = HL_Waze.map;
	if(typeof(HL_waze_Map.landmarkLayer) == 'undefined'){
		HL_addLog(1, 'error', 'landmarkLayer NOK', HL_waze_Map.landmarkLayer);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_landmarkLayer = HL_waze_Map.landmarkLayer;
	if(typeof(HL_Waze.model) == 'undefined'){
		HL_addLog(1, 'error', 'model NOK', HL_Waze.model);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_waze_model = HL_Waze.model;
	HL_selectionManager = HL_Waze.selectionManager;
	if(typeof(HL_selectionManager) == 'undefined'){
		HL_addLog(1, 'error', 'selectionManager NOK', HL_selectionManager);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_loginManager = HL_Waze.loginManager;
	if(typeof(HL_loginManager) == 'undefined'){
		HL_addLog(1, 'error', 'loginManager NOK', HL_loginManager);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_user = HL_loginManager.user;
	if(typeof(HL_user) == 'undefined'){
		HL_addLog(1, 'error', 'user NOK', HL_user);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_waze_venues = HL_waze_model.venues;
	if(typeof(HL_waze_venues) == 'undefined'){
		HL_addLog(1, 'error', 'venues NOK');
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_config_venues = HL_Waze.Config.venues;
	if(typeof(HL_config_venues) == 'undefined'){
		HL_addLog(1, 'error', 'HL_config_venues NOK', HL_config_venues);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_addLog(1, 'info', 'Waze OK');
	//	Waze GUI needed
	HL_userTabs = getId('user-info');
	if(typeof(HL_userTabs) == 'undefined'){
		HL_addLog('error', 'userTabs NOK', HL_userTabs);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_editPanel = getId('edit-panel');
	if(typeof(HL_editPanel) == 'undefined'){
		HL_addLog(1, 'error', 'editPanel NOK', HL_editPanel);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_navTabs = HL_userTabs.getElementsByTagName('ul')[0];
	if(typeof(HL_navTabs) == 'undefined'){
		HL_addLog(1, 'error', 'navTabs NOK', HL_navTabs);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_tabContent = HL_userTabs.getElementsByTagName('div')[0];
	if(typeof(HL_tabContent) == 'undefined'){
		HL_addLog(1, 'error', 'tabContent NOK', HL_tabContent);
		window.setTimeout(HL_init, 500);
		return;
	}
	HL_addLog(1, 'info', 'GUI OK');
	//	Traductions
	if(typeof(unsafeWindow.I18n) == 'undefined'){
		HL_addLog(1, 'error', 'translations system NOK');
		setTimeout(HL_init, 500);
		return;
	}
	HL_I18n = unsafeWindow.I18n;
	if(typeof(HL_I18n.translations) == 'undefined'){
		HL_addLog(1, 'error', 'translations NOK');
		setTimeout(HL_init, 500);
		return;
	}
	HL_translations = HL_I18n.translations;
	if(typeof(HL_I18n.locale) == 'undefined'){
		setTimeout(HL_init, 500);
		return;
	}
	HL_cur_lng = HL_I18n.locale;
	HL_def_lng = 'en';
	HL_addLog(1, 'info', 'Traductions OK');
	//	Then do the job
	getVenues();
	HL_html();
	//	restore saved settings
	HL_restoreOptions();
	//	Btn / radio Events
	getId('lh_glh').onchange = HideL;
	getId('st_sl').onchange = HideL;
	getId('HL_on_off').onchange = HideL;
	getId('btn_hl_none').onclick = function (){ShowHideAll(false);};
	getId('btn_hl_all').onclick = function (){ShowHideAll(true);};
	getId('btn_hl_FR').onclick = function (){getId('text_hl_filter').value=''; getId('PT_Cat_Filter').options[0].selected = true;
HL_HTML_filter();};
	getId('text_hl_filter').onkeyup = HL_HTML_filter;
	//	Waze events
	HL_selectionManager.events.register("selectionchanged", null, HL_POI_html_init);
	HL_selectionManager.events.register("selectionchanged", null, HideL);
	HL_waze_Map.events.register("mergeend", null, HideL);
	HL_waze_Map.events.register("zoomeend", null, HideL);
	//	Periodics updates
	window.setInterval(HideL, 250);
	//	beforeunload WME overload
	window.addEventListener("beforeunload", HL_saveOptions, false);
	WMEPT.loaded = true;
	HL_addLog(1, 'info', 'WMEPT loaded');
}

/* engage! =================================================================== */
HL_bootstrap();
/* end ======================================================================= */

/*	Version 0.9
	Add : category filtering in places tools tab : 0.9b1
	Add : translations FR, EN, CS (thx Zirland) : 0.9b4
	Add : simple venue layer activation, toggle the on-off checkbox (user request) : 0.9b2
	Fix : bug with chrome (thx zirland who found it) : 0.9b4
	Fix : bug in hide venue filtering on chrome (thx DummyD2) : 0.9b1
	Improvement : Extend none and all buttons functionalities (only cat filter ability) : 0.9b2
	Improvement : reset buttons (filter and defaults) now performs cat reset : 0.9b2
	Update : Other/RESIDENCE_HOME -> point (do not represent before) (28/07/2014) : 0.9b2
*/

/*	Version 0.8
	Add : blue pin; point misused main category instead of category
	Add : new area colouring : blue border, red background : unnamed parking lot
	Add : what to do on a problematic pin or area (validator style).
	Add : 2 default buttons to fix unnamed parking lot
	Fix : bug in venues acquisition (thx DummyD2)
	Fix : bug in chrome venues (thx DummyD2)
*/

/*	Version 0.7
	Add : livemap colouration style on/off (on by default)
	Fix : script crash on untranslated venues (thx tkr85)
*/

/*	Version 0.6
	Fix : 2 bugs in tab options
	Fix : bug in colouration rules(thx PHIL-IP63)
*/

/*	Version 0.5
	Add : area general highlight inspired from livemap
	Improvement : better system detection on WME changes
*/

/*	Version 0.4
	Add : detect changes in venue definitions (new one added by waze)
	Add : venue type selection depending on venue size
	Fix : bug in definitions
	Update : Hôpital / Centre médical :: from area to both
*/

/*	Version 0.3.1
-	fix : bug selection (once again :/)
*/

/*	Version 0.3
-	add : red pin for incorrect pin usage
-	fix : bug selection, thx to DummyD2
*/

/*	Version 0.2.1
- update : changed the misused main category. from red to blue
*/

/*	Version 0.2
- Add : colouring venue (areas) according to the wiki recommendations.
- Fix : some bug and non senses
*/

/*	Version 0.1
- First release
*/

/*	TODO
-1 : détecter zone dans une zone
-2 : determine if roads running threw parking lots are set as parking lot roads
-3 : removing useless geometrical nodes
-4 : merge 2 POI (landmark)
*/