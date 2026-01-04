// ==UserScript==
// @name         Test
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  elo
// @author       You
// @match        https://*.plemiona.pl/game.php?village=*&screen=place
// @icon         https://www.google.com/s2/favicons?domain=plemiona.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475431/Test.user.js
// @updateURL https://update.greasyfork.org/scripts/475431/Test.meta.js
// ==/UserScript==

/*
		scriptname:	Commander Script
		version:	1.0.0
		created: June 10, 2016
 		game version:	version	8.48.1
 		author:		Tsalkapone (tsalkapone@hotmail.com)

 ==== pages where this can be used ====
 * rally point (screen=place)

 ==== changelog ====
 *	10 June 2016 - created

 ==== license ====
 *	Copyright (C) 2016 Tsalkapone ~ Apostolos Tsalkitzis

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/
 */


function tsalkaponetool_ready() {
    var get_lang = localStorage.getItem("rally_point_script_lang");
    var lang="";
	var tsal_market=game_data.market;
    if (get_lang === null) 	 {if (tsal_market=="it") {lang="italian";}
	else if (tsal_market=="gr") {lang="greek";}
  else   {lang = "english";} }
    else { lang = ""+get_lang+"";}
    var supported_languages =["greek","english","italian"];
    var lang_check = supported_languages.indexOf(lang);
    if (lang_check < 0) {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> The selected language is not supported. Please select one of the supported languages.', 5000);}
    else {
		var	shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		}
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;

			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}

			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();

			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;

			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,

				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,

				'pause':19,
				'break':19,

				'insert':45,
				'home':36,
				'delete':46,
				'end':35,

				'pageup':33,
				'page_up':33,
				'pu':33,

				'pagedown':34,
				'page_down':34,
				'pd':34,

				'left':37,
				'up':38,
				'right':39,
				'down':40,

				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}

			var modifiers = {
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};

			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;

			for(var i=0; k=keys[i],i<keys.length; i++) {
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;

				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character];
							if(character == k) kp++;
						}
					}
				}
			}

			if(kp == keys.length &&
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);

				if(!opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;

					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func,
			'target':ele,
			'event': opt['type']
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
}


var tsalkapone_trans = (function() {
				    var tsalkapone_trans = {};
    tsalkapone_trans.english= {
	 general:{
		 config: "Units Configuration",
		 all_units:"All units",
		 all_more:"All more than",
		 remaining:"All remaining",
		 specific:"Insert specific",
		 criteria:"Insert troops only if all selected criteria are met?",
		 methods:"Select the method of inserting troops",
		 off_1:"All troops",
		 off_2:"All offensive units+scouts",
		 off_3:"All offensive units+heavy+scouts",
		 off_4:"All offensive+scouts, not rams",
		 off_5:"All offensive units",
		 off_6:"All light cavalry",
		 off_7:"All cavalry units",
		 off_8:"Adjusted Settings",
		 def_1:"All defensive units+catapults+scouts",
		 def_2:"All defensive units+scouts",
		 def_3:"All defensive units",
		 def_4:"All non-cavalry defensive",
		 def_5:"All heavy",
		 def_6:"All spears and archers",
		 def_7:"All swords",
		 def_8:"All scouts",
		 qmark:"Click for more info",
		 settings:"General Settings",
		 no:"No",
		 yes:"Yes",
		 split:"Define the amount of split of the selected values",
		 cometh:"Select the method of inserting coordinates",
		 coords:"Enter the coordinates of the targets",
		 random:"Random order",
		 seq:"Consecutive & Selective order",
		 hot_nuke:"Assign a shortcut key to Nuke Settings",
		 hot_support:"Assign a shortcut key to Support Settings",
		 hot_fake:"Assign a shortcut key to Fake Settings",
		 hot_farm:"Assign a shortcut key to Farming Settings",
		 b_nuke:"Assign a shortcut key to Nuke Script button",
		 b_support:"Assign a shortcut key to Support Script button",
		 b_farm:"Assign a shortcut key to Farming Script button",
		 b_fake:"Assign a shortcut key to Fake Script button",
		 c_nuke:"Enter a title for the Nuke Button and cookie value",
		 c_support:"Enter a title for the Support Button and cookie value",
		 c_farming:"Enter a title for the Farming Button and cookie value",
		 c_fake:"Enter a title for the Fake Button and cookie value",
		 menu:"Menu",
		 fake_settings:"Fake Settings",
		 farming_settings:"Farming Settings",
		 nuke_settings:"Nuke Settings",
		 support_settings:"Support Settings",
		 button_list:"Script Buttons List",
		 speed_1:"By descending speed",
		 speed_2:"By ascending speed",
		 by:"By",
		 counting:"Click counts",
		 notification:"Notification from",
         selected_one:"Current selected language",
         available:"Available languages",
         support_list:"Support Script. Coords list",
         nuke_list:"Nuke Script. Coords list",
         farming_list:"Farming Script. Coords list",
         fake_list:"Fake Script. Coords list",
         coordsfinder:"Coords finder",
          func_list:"Available functions list",
         undef:"Undefined",
         funcs:"Assigned Function",
         shorts:"Shortcut key",
		 },
		 units: {
			 spear:"Spearman",
			 axe:"Axeman",
			 sword:"Swordsman",
			 archer:"Archer",
			 marcher:"Mounted Archer",
			 scout:"Scout",
			 light:"Light Cavalry",
			 heavy:"Heavy Cavalry",
			 ram:"Ram",
			 catapult:"Catapult",
		 },
		  buttons:{
			 save:"Save Settings",
			 reset_b:"Reset Settings",
			 hide:"Hide Settings",
			 count:"Reset Counting",
			 save_title:"Click here to save the selected settings of this script. <br><br> If you dont save the settings the selected values wont be applied.",
			 hide_title:"Click here to hide the current settings menu.",
			 reset_title:"Click here to reset the settings of this script to their default values.",
			 count_title:"Click here to reset the counting clicks of this script.",
			 nuke_click:"Click here to activate the Nuke Script",
			 support_click:"Click here to activate the Support Script",
			 farming_click:"Click here to activate the Farming Script",
			 fake_click:"Click here to activate the Fake Script",
			 time_pause:"Click to pause every time counter on the page. Click again to restart the counters.",
              lang_open:"Open language selection",
              lang_close:"Close language selection",
               func_open:"Open assigned functions",
              func_close:"Close assigned functions",
             map_info:"The functions assigned to each shortcut key are used to insert troops in every command form operated from the map screen. <br><br> The troops inserting methods used by each function are the ones saved in the Settings Menu displayed when this script is activated on the Rally Point page.",
			},
			notes:{
				values:"No saved values detected. You have to save the script settings values to operate the script.",
				coords:"No selected coords were detected. Define some targets and try again.",
				last:"These are the last selected coords. Activate the script again to restart.",
				counts:"The click counts of the script have been reseted successfully. Click the script again to restart the counting.",
				req:"Not all requirements are fulfilled to procceed. Try from a different village or define the settings again.",
				target:"Current target",
				list:"Target list",
				creator:"Created by",
				reset_all:"Your settings have been successfully reseted. This page will be refreshed automatically in 3 seconds.",
				save:"Your settings have been successfully saved. This page will be refreshed automatically in 3 seconds.",
                no_coords:"There were found no coords on this page.",
                no_units:"There were found no available units. Change village or settings and try again.",
                activated:"The Commander Script is already active.",
                no_keys:"No shortcut keys for the available functions were detected. <br><br>Go to Rally Point and assign at least one shortcut key for any of the available button-functions.",
			}


    };
	tsalkapone_trans.italian= {
        general:{
		config: "Configurazione Truppe",
		all_units:"Tutte le truppe",
		all_more:"Più di...",
		 remaining:"Rimanenti",
		 specific:"Truppe esatte",
		criteria:"Inserire le truppe solo se tutti i criteri sono soddisfatti?",
		methods:"Seleziona il metodo di inserimento truppe",
		 off_1:"Tutte le truppe",
		 off_2:"Tutte le truppe offensive + esplo",
		 off_3:"Tutte le truppe offensive + cav.pes. + esplo",
		 off_4:"Tutte le truppe offensive + esplo, NO arieti",
		 off_5:"Tutte le truppe offensive",
		 off_6:"Tutta la cav. leggera",
		 off_7:"Tutte le unità a cavallo",
		 off_8:"Settaggi personalizzati",
		 def_1:"Tutte le truppe difensive + catapulte + esplo",
		 def_2:"Tutte le truppe difensive + esplo",
		 def_3:"Tutte le truppe difensive",
		 def_4:"Tutta la fanteria difensiva",
		 def_5:"Tutta la cav. pesante",
		 def_6:"Tutte le lance e archi",
		 def_7:"Tutte le spade",
		 def_8:"Tutti gli esploratori",
		 qmark:"Clicka per + info",
		 settings:"Settaggi generali",
		 no:"No",
		 yes:"Si",
		 split:"Define the amount of split of the selected values",
		 cometh:"Seleziona il metodo di inserimento coordinate",
		 coords:"Inserisci le coordinate dei villaggi",
		 random:"Ordine casuale",
		 seq:"Ordine consecutivo & selettivo",
		 hot_nuke:"Assegna una scorciatoia per i settaggi NUKE",
		 hot_support:"Assegna una scorciatoia per i settaggi SUPPORT",
		 hot_fake:"Assegna una scorciatoia per i settaggi FAKE",
		 hot_farm:"Assegna una scorciatoia per i settaggi FARMING",
		 b_nuke:"Assegna una scorciatoia per il tasto script NUKE",
		 b_support:"Assegna una scorciatoia per il tasto script SUPPORT",
		 b_farm:"Assegna una scorciatoia per il tasto script FARMING",
		 b_fake:"Assegna una scorciatoia per il tasto script FAKE",
		 c_nuke:"Modifica il testo del tarto script NUKE",
		 c_support:"Modifica il testo del tarto script SUPPORT",
		 c_farming:"Modifica il testo del tarto script FARMING",
		 c_fake:"Modifica il testo del tarto script FAKE",
		 menu:"Menu",
		 fake_settings:"Settaggi FAKE",
		 farming_settings:"Settaggi FARMING",
		 nuke_settings:"Settaggi NUKE",
		 support_settings:"Settaggi SUPPORT",
		 button_list:"Lista tasti script",
		 speed_1:"Da velocità decrescente",
		 speed_2:"Da velocità crescente",
		 by:"da",
		 counting:"Conteggio click",
		 notification:"Notifiche da",
            selected_one:"Lingua corrente selezionata",
            available:"Lingue disponibili",
            support_list:"Support Script. Lista coordinate",
         nuke_list:"Nuke Script. Lista coordinate",
         farming_list:"Farming Script. Lista coordinate",
         fake_list:"Fake Script. Lista coordinate",
            coordsfinder:"Cerca coordinate",
            func_list:"Lista funzioni disponibili",
             undef:"Indefinito",
         funcs:"Funzione assegnata",
         shorts:"Scorciatoia",
		},
		units: {
			 spear:"Lanciere",
			 axe:"Guerriero con ascia",
			 sword:"Spadaccino",
			 archer:"Arciere",
			 marcher:"Arciere a cavallo",
			 scout:"Esploratore",
			 light:"Cavalleria Leggera",
			 heavy:"Cavalleria Pesante",
			 ram:"Ariete",
			 catapult:"Catapulta",
		 },
		 buttons:{
			 save:"Salva settaggi",
			 reset_b:"Resetta settaggi",
			 hide:"Nascondi settaggi",
			 count:"Resetta conteggio",
			 save_title:"Clicca qui per salvare i settaggi selezionati di questo script <br><br> Se non salvi i settaggi i valori selezionati non saranno applicati",
			 hide_title:"Clicca qui per nascondere il menu dei settaggi correnti",
			 reset_title:"Clicca qui per ripristinare i settaggi di questo script ai valori predefiniti",
			 count_title:"Clicca qui per resettare il conteggio dei click di questo script",
			 nuke_click:"Clicca qui per attivare il NUKE Script",
			 support_click:"Clicca qui per attivare il SUPPORT Script",
			 farming_click:"Clicca qui per attivare il FARMING Script",
			 fake_click:"Clicca qui per attivare il FAKE Script",
			 time_pause:"Clicca per freezare ogni timer in questa pagina. Clicca di nuovo per ricominciare",
              lang_open:"Apri la selezione lingua",
              lang_close:"Chiudi la selezione lingua",
             func_open:"Apri le funzioni assegnate",
              func_close:"Chiudi le funzioni assegnate",
             map_info:"Le funzioni assegnate a ciascun tasto di scelta rapida sono utilizzate per inserire le truppe in ogni forma di comando azionato dalla schermata della mappa. <br><br> I metodi di inserimento truppe usati da ciascuna funzione sono quelli salvati nei menu settaggi mostrati quando lo script è lanciato dal punto di raduno",

			},
			notes:{
				values:"Nessun valore salvato rilevato. Devi salvare i valori dello script per avviare lo stesso",
				coords:"Nessuna coordinata è stata rilevata. Definisci qualche villaggio e riprova",
				last:"Queste sono le ultime coordinate selezionate. Attiva lo script ancora per ricominciare",
				counts:"Il conteggio click dello script è stato resettato con successo. Clicca lo script di nuovo per ricominciare il conteggio.",
				req:"Non tutti i requisiti sono stati riempiti per procedere. Prova da un villaggio differente o definisci di nuovo i settaggi",
				target:"Villaggio corrente",
				list:"Lista villaggi",
				creator:"Creato da",
				reset_all:"I tuoi settaggi sono stati ripristinati con successo. Questa pagina sarà ricaricata in 3 secondi",
				save:"I tuoi settaggi sono stati salvati con successo. Questa pagina sarà ricaricato in automatico fra 3 secondi",
                 no_coords:"Non sono state trovate coordinate in questa pagina",
                no_units:"Non sono state trovate le truppe disponibili. Cambia villaggio o settaggi e riprova",
                activated:"Lo script è già attivo",
                no_keys:"Nessuna scorciatoia è stata trovata per la funzione disponibile. <br><br> Vai al punto di raduno e assegna almeno una scorciatoia per ogni tasto funzione disponibile",
			}

    };
        tsalkapone_trans.greek= {
        general:{
		config: "Ρυθμίσεις Μονάδων",
		all_units:"Όλες οι μονάδες",
		all_more:"Όλα περισσότερα από",
		 remaining:"Εισαγωγή υπόλοιπου",
		 specific:"Εισαγωγή ακριβώς",
		criteria:"Εισαγωγή στρατευμάτων μόνο όταν πληρούνται όλα τα κριτήρια;",
		methods:"Επιλέξτε μέθοδο εισαγωγής στρατευμάτων",
		 off_1:"Όλα τα στρατεύματα",
		 off_2:"Επιθετικά+ανιχνευτές",
		 off_3:"Επιθετικά+βαρύ+ανιχνευτές",
		 off_4:"Επιθετικά+ανιχνευτές, χωρίς κριούς",
		 off_5:"Όλα τα επιθετικά",
		 off_6:"Όλο το ελαφρύ",
		 off_7:"Όλα το ιππικό",
		 off_8:"Προσαρμοσμένες ρυθμίσεις",
		 def_1:"Αμυντικά+καταπέλτες+ανιχνευτές",
		 def_2:"Αμυντικά+ανιχνευτές",
		 def_3:"Όλες οι αμυντικές μονάδες",
		 def_4:"Όλο το πεζικό",
		 def_5:"Μόνο βαρύ",
		 def_6:"Δόρατα και τοξότες",
		 def_7:"Μόνο ξίφη",
		 def_8:"Μόνο ανιχνευτές",
		 qmark:"Επιλέξτε για περισσότερες πληροφορίες",
		 settings:"Γενικές Ρυθμίσεις",
		 no:"Όχι",
		 yes:"Ναι",
		 split:"Προσδιορίστε το είδος του split των επιλεγμένων μονάδων",
		 cometh:"Επιλέξτε τη μέθοδο εισαγωγής συντεταγμένων",
		 coords:"Εισάγετε τις συντεταγμένες των στόχων",
		 random:"Τυχαία επιλογή",
		 seq:"Διαδοχική & συγκεκριμένη επιλογή",
		 hot_nuke:"Ορίστε πλήκτρο συντόμευσης για τις Ρυθμίσεις Nuke",
		 hot_support:"Ορίστε πλήκτρο συντόμευσης για τις Ρυθμίσεις Support",
		 hot_fake:"Ορίστε πλήκτρο συντόμευσης για τις Ρυθμίσεις Fake",
		 hot_farm:"Ορίστε πλήκτρο συντόμευσης για τις Ρυθμίσεις Farming",
		 b_nuke:"Ορίστε πλήκτρο συντόμευσης για το πλήκτρο του Nuke Script",
		 b_support:"Ορίστε πλήκτρο συντόμευσης για το πλήκτρο του Support Script",
		 b_farm:"Ορίστε πλήκτρο συντόμευσης για το πλήκτρο του Farming Script",
		 b_fake:"Ορίστε πλήκτρο συντόμευσης για το πλήκτρο του Fake Script",
		 c_nuke:"Εισάγετε ένα τίτλο για το πλήκτρο της Nuke και για τη τιμή cookie",
		 c_support:"Εισάγετε ένα τίτλο για το πλήκτρο της Υποστήριξης και για τη τιμή cookie",
		 c_farming:"Εισάγετε ένα τίτλο για το πλήκτρο του Farming και για τη τιμή cookie",
		 c_fake:"Εισάγετε ένα τίτλο για το πλήκτρο των Fake και για τη τιμή cookie",
		 menu:"Μενού",
		 fake_settings:"Ρυθμίσεις Fake",
		 farming_settings:"Ρυθμίσεις Farming",
		 nuke_settings:"Ρυθμίσεις Nuke",
		 support_settings:"Ρυθμίσεις Support",
		 button_list:"Πίνακας πλήκτρων",
		 speed_1:"Με φθίνουσα ταχύτητα",
		 speed_2:"Με αύξουσα ταχύτητα",
		 by:"Διά",
		 counting:"Μετρητής κλικ",
		 notification:"Ειδοποίηση από τον",
            selected_one:"Ενεργή γλώσσα",
            available:"Διαθέσιμες γλώσσες",
            support_list:"Support Script. Λίστα συντεταγμένων",
         nuke_list:"Nuke Script. Λίστα συντεταγμένων",
         farming_list:"Farming Script. Λίστα συντεταγμένων",
         fake_list:"Fake Script. Λίστα συντεταγμένων",
            coordsfinder:"Εύρεση Συντεταγμένων",
            func_list:"Διαθέσιμες λειτουργίες",
             undef:"Μη προσδιορισμένο",
         funcs:"Λειτουργία",
         shorts:"Πλήκτρο συντόμευσης",
		},
		units: {
			 spear:"Δορατοφόρος",
			 axe:"Τσεκουρομάχος",
			 sword:"Ξιφομάχος",
			 archer:"Τοξότης",
			 marcher:"Έφιππος Τοξότης",
			 scout:"Ανιχνευτής",
			 light:"Ελαφρύ Ιππικό",
			 heavy:"Βαρύ Ιππικό",
			 ram:"Κριός",
			 catapult:",Καταπέλτης",
		 },
		 buttons:{
			 save:"Αποθήκευση Ρυθμίσεων",
			 reset_b:"Επανεκκίνηση Ρυθμίσεων",
			 hide:"Απόκρυψη Ρυθμίσεων",
			 count:"Επανεκκίνηση Αρίθμησης",
			 save_title:"Επιλέξτε εδώ για να αποθηκεύσετε τις επιλεγμένες τιμές του συγκεκριμένου script. <br><br> Σε περίπτωση που δεν αποθηκεύσετε τις ρυθμίσεις οι επιλεγμένες τιμές δεν θα εφαρμοστούν.",
			 hide_title:"Επιλέξτε εδώ για να κλείσετε το τρέχον μενού των ρυθμίσεων.",
			 reset_title:"Επιλέξτε εδώ για επαναφορά των προκαθορισμένων ρυθμίσεων και τιμών του συγκεκριμένου script.",
			 count_title:"Επιλέξτε εδώ για επανεκκίνηση της αρίθμησης του συγκεκριμένου script.",
			 nuke_click:"Επιλέξτε εδώ για ενεργοποίηση του Nuke Script",
			 support_click:"Επιλέξτε εδώ για ενεργοποίηση του Support Script",
			 farming_click:"Επιλέξτε εδώ για ενεργοποίηση του Farming Script",
			 fake_click:"Επιλέξτε εδώ για ενεργοποίηση του Fake Script",
			 time_pause:"Επιλέξτε εδώ για παύση κάθε λειτουργίας χρονομέτρησης στη σελίδα. Επιλέξτε και πάλι για συνέχεια της χρονομέτρησης.",
              lang_open:"Άνοιγμα επιλογής γλώσσας",
              lang_close:"Κλείσιμο επιλογής γλώσσας",
             func_open:"Άνοιγμα διαθέσιμων λειτουργιών",
              func_close:"Κλείσιμο διαθέσιμων λειτουργιών",
             map_info:"Οι διαθέσιμες λειτουργίες αξιοποιούνται για την εισαγωγή στρατευμάτων σε κάθε πλαίσιο αποστολής εντολής από το Χάρτη. <br><br> Οι μέθοδοι εισαγωγής στρατευμάτων που χρησιμοποιούνται από κάθε λειτουργία είναι οι ίδιοι με αυτοί που έχουν οριστεί στο Πίνακα Ρυθμίσεων του script από το Μέρος Συγκέντρωσης.",

			},
			notes:{
				values:"Δεν εντοπίστηκαν αποθηκευμένες τιμές. Πρέπει να αποθηκεύσετε τις ρυθμίσεις του script πριν το ενεργοποιήσετε.",
				coords:"Δεν εντοπίστηκαν αποθηκευμένες συντεταγμένες. Ορίστε μερικούς στόχους και ενεργοποιήστε εκ νέου το script.",
				last:"Αυτές είναι οι τελευταίες αποθηκευμένες συντεταγμένες. Ενεργοποιήστε εκ νέου το script για επανεκκίνηση της ακολουθίας.",
				counts:"Η μέτρηση των κλικ του script τέθηκε σε επανεκκίνηση. Ενεργοποιήστε εκ νέου το script για να ξεκινήσει η μέτρηση.",
				req:"Δεν εκπληρώνονται όλες οι αναγκαίες συνθήκες για να τεθεί το script σε λειτουργία. Ενεργοποιήστε το από άλλο χωριό ή αλλάξτε τις ρυθμίσεις.",
				target:"Τρέχων στόχος",
				list:"Λίστα στόχων",
				creator:"Δημιουργήθηκε από τον",
				reset_all:"Οι ρυθμίσεις τέθηκαν σε επαναφορά των προκαθορισμένων τιμών επιτυχώς. Η σελίδα θα ανανεωθεί αυτόματα σε 3 δευτερόλεπτα.",
				save:"Οι τρέχουσες ρυθμίσεις αποθηκεύτηκαν επιτυχώς. Η σελίδα θα ανανεωθεί αυτόματα σε 3 δευτερόλεπτα.",
                 no_coords:"Δεν βρέθηκαν συντεταγμένες στη τρέχουσα σελίδα.",
                no_units:"Δεν βρέθηκαν διαθέσιμες μονάδες. Αλλάξτε χωριό ή ρυθμίσεις και δοκιμάστε ξανά.",
                activated:"Το Script Εντολών έχει ήδη ενεργοποιηθεί.",
                no_keys:"Δεν εντοπίστηκαν πλήκτρα συντόμευσης για τις διαθέσιμες λειτουργίες. <br><br>Κατευθυνθείτε στο Μέρος Συγκέντρωσης και ορίστε τουλάχιστον ένα πλήκτρο συντόμευσης για τις διαθέσιμες λειτουργίες.",
			}



    };
    return tsalkapone_trans[lang];
    }());


var tsalrallypointpage = location.href.indexOf('screen=place') > -1;
            var Tsalrallypointpage1 = location.href.indexOf('&mode=sim') > -1;
                    var Tsalrallypointpage2 = location.href.indexOf('&mode=units') > -1;
                    var Tsalrallypointpage3 = location.href.indexOf('&mode=neighbor') > -1;
                    var Tsalrallypointpage4 = location.href.indexOf('&mode=call') > -1;
                    var Tsalrallypointpage5 = location.href.indexOf('&mode=templates') > -1;
         var Tsalrallypointpage6 = location.href.indexOf('&try=confirm') > -1;
        var Tsalrallypointpage7 = document.getElementById('troop_confirm_go');
        var Tsalfarmassistant = location.href.indexOf('screen=am_farm') > -1;
      var Tsalmap = location.href.indexOf('screen=map') > -1;
        var tsalbody="input[type='number'] {width:50px;} .tsalbutton:hover {color:yellow;} .tsalselected {color: blue; font-style: italic;}";
var tsaldiamorfwsi='<link rel="stylesheet" type="text/css" href="https://dl.dropboxusercontent.com/s/tecuyt76fiz5z9s/Tsalkapone.Commander_script.css" />';
var tsaldiamorfwsifuletikwn= "<style>"+tsalbody+"</style>";
    $("head").append(tsaldiamorfwsi+tsaldiamorfwsifuletikwn);

function getMsColor(x){
	var y="";
	if (x<200) {y="black";}
 else if (x<400) { y="blue";}
  else if (x<600) { y="darkgreen";}
   else if (x<800) { y="darkmagenta";}
    else { y="red";}
	return y;
}

function ShowTime() {
	var r = Timing.getCurrentServerTime()/ 1e3;
	var x=Format.date(r, !0, 1, 1);
	var y=x.replace(/(<([^>]+)>)/ig,"").split(' ');
	var g=y[y.length-1];
	var j=g.split(':');
	var time=[];
	var ms=j[j.length-1];
	var server_lag=Number(Timing.offset_to_server);
	for(var i=0;i<3;i++){
		time.push(j[i]);
	}
	var timing=time.join(':');
	var k="<span id='time_display'>"+timing+"</span>|<font color=darkorange><b> Ms:<span id='lag_display' class='ms_info'>"+ms+"</span><span id='tsal_tw_lag'>|<font color=red><b> Lag: "+server_lag+" ms</b></font></span>";
	$('#serverTime').hide();
	if($("#lag_display").length==0) { $('#serverTime').before(k); $(".server_info").css("font-size", "medium"); }
	else { $("#lag_display").html(ms); $("#time_display").html(timing); }
	$(".ms_info").css("color", getMsColor(ms));
}

function setMS()
{  var element1=document.getElementById("serverTime");
 var element2=document.getElementById("tsal_tw_ms");
var time=element1.innerHTML.match(/^\d+\:\d+\:\d+/);
var date=new Date();
var ms=(date.getMilliseconds()).toString();
while(ms.length<3){ms="0"+ms;};
var x=Number(ms); if (x<200) { $("#tsal_tw_ms").css("color", "black");}
 else if (x<400) { $("#tsal_tw_ms").css("color", "blue");}
  else if (x<600) { $("#tsal_tw_ms").css("color", "darkgreen");}
   else if (x<800) { $("#tsal_tw_ms").css("color", "darkmagenta");}
    else { $("#tsal_tw_ms").css("color", "red");}
 element2.innerHTML=ms;}
 if (!document.getElementById('time_display')) {
	 /*
	 var server_ms='';
  var server_lag=Number(Timing.offset_to_server)-70;
$('.server_info').append('<span class="server_info">|<font color=darkorange><b> Ms: <span  id="tsal_tw_ms">'+server_ms+'</b></font></span><span id="tsal_tw_lag" class="server_info">|<font color=red><b> Lag: '+server_lag+' ms</b></font></span>');
 $(".server_info").css("color", "blue"); $(".server_info").css("font-size", "medium");
 */
var tnt_show_ms = window.setInterval(ShowTime,1);
 }


    if (tsalrallypointpage && !Tsalrallypointpage2 && !Tsalrallypointpage3 && !Tsalrallypointpage4 && !Tsalrallypointpage5 && !Tsalrallypointpage6 && !Tsalrallypointpage7) {

var tsalperiexomeno1 ='<div id="tsalperiexomeno1"><table class="vis"><tr><th colspan="10"><font color=maroon><center>'+tsalkapone_trans.general.config+'</center></font></th></tr>';
tsalperiexomeno1+='<tr><td><img title="'+tsalkapone_trans.units.spear+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_spear.png"></td>';
tsalperiexomeno1+='<td><img title="'+tsalkapone_trans.units.sword+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_sword.png"></td>';
tsalperiexomeno1+='<td><img title="'+tsalkapone_trans.units.axe+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_axe.png"></td>';
tsalperiexomeno1+='<td><img title="'+tsalkapone_trans.units.archer+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_archer.png"></td>';
 tsalperiexomeno1+='<td><img title="'+tsalkapone_trans.units.scout+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_scout.png"></td>';
tsalperiexomeno1+='<td><img title="'+tsalkapone_trans.units.light+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_lc.png"></td>';
tsalperiexomeno1+='<td><img title="'+tsalkapone_trans.units.heavy+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_hc.png"></td>';
tsalperiexomeno1+='<td><img title="'+tsalkapone_trans.units.marcher+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ma.png"></td>';
tsalperiexomeno1+='<td><img title="'+tsalkapone_trans.units.ram+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ram.png"></td>';
 tsalperiexomeno1+='<td><img title="'+tsalkapone_trans.units.catapult+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_cat.png"></td></tr>';
tsalperiexomeno1+='<tr><td><input id="spear1" type="number" placeholder="0" value="" min="0"><br><select id=spear1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno1+='<td><input id="sword1" type="number" placeholder="0" value="" min="0"><br><select id=sword1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
 tsalperiexomeno1+='<td><input id="axe1" type="number" placeholder="0" value="" min="0"><br><select id=axe1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
  tsalperiexomeno1+='<td><input id="archer1" type="number" placeholder="0" value="" min="0"><br><select id=archer1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno1+='<td><input id="spy1" type="number" placeholder="0" value="" min="0"><br><select id=spy1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno1+='<td><input id="light1" type="number" placeholder="0" value="" min="0"><br><select id=light1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno1+='<td><input id="heavy1" type="number" placeholder="0" value="" min="0"><br><select id=heavy1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno1+='<td><input id="marcher1" type="number" placeholder="0" value="" min="0"><br><select id=marcher1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno1+='<td><input id="ram1" type="number" placeholder="0" value="" min="0"><br><select id=ram1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno1+='<td><input id="cat1" type="number" placeholder="0" value="" min="0"><br><select id=cat1sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td></tr>';
tsalperiexomeno1+='<tr><th colspan="10"><font color=maroon><center>'+tsalkapone_trans.general.settings+'</center></font></th></tr>';
tsalperiexomeno1+='<tr><td colspan="4"><img id="method1info" src="/graphic/questionmark.png" style="height:15px; width:15px; cursor:pointer" title="'+tsalkapone_trans.general.qmark+'">&emsp;<font color=darkmagenta><b>'+tsalkapone_trans.general.methods+'</b></font></td>';
tsalperiexomeno1+='<td colspan="6"><select id="tsalscriptmethod1"><option value="All troops">'+tsalkapone_trans.general.off_1+'</option>';
tsalperiexomeno1+='<option value="All offensive units+scouts">'+tsalkapone_trans.general.off_2+'</option>';
tsalperiexomeno1+='<option value="All offensive units+heavy+scouts">'+tsalkapone_trans.general.off_3+'</option>';
    tsalperiexomeno1+='<option value="All offensive+scouts, not rams">'+tsalkapone_trans.general.off_4+'</option>';
    tsalperiexomeno1+='<option value="All offensive units">'+tsalkapone_trans.general.off_5+'</option>';
    tsalperiexomeno1+='<option value="All light cavalry">'+tsalkapone_trans.general.off_6+'</option>';
    tsalperiexomeno1+='<option value="All cavalry units">'+tsalkapone_trans.general.off_7+'</option>';
tsalperiexomeno1+='<option value="Adjusted settings">'+tsalkapone_trans.general.off_8+'</option></select></td></tr>';
tsalperiexomeno1+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.criteria+'</b></font></td>';
tsalperiexomeno1+='<td colspan="6"><select id="tsalcriteria1"><option value="Yes">'+tsalkapone_trans.general.yes+'</option><option value="No">'+tsalkapone_trans.general.no+'</option></select></td></tr>';
tsalperiexomeno1+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.coords+'</b></font></td>';
    tsalperiexomeno1+='<td colspan="6"><textarea id=tsalcoords1 value="" rows="1" cols="50"></textarea></td></tr>';
    tsalperiexomeno1+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.hot_nuke+'</b></font></td>';
    tsalperiexomeno1+='<td colspan="6"><input type="text" id=tsalkey1 value=""  size="35"></td></tr>';
    tsalperiexomeno1+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.b_nuke+'</b></font></td>';
    tsalperiexomeno1+='<td colspan="6"><input type="text" id=tsalakey1 value="" size="35"></td></tr>';
    tsalperiexomeno1+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.c_nuke+'</b></font></td>';
    tsalperiexomeno1+='<td colspan="6"><input type="text" id=tsalname1 value="" size="35"></td></tr>';
    tsalperiexomeno1+='</table></div><br>';
tsalperiexomeno1+='<span class="tsaltooltip"><input id=Tsalsave1 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.save+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.save_title+'</span></span>';
    tsalperiexomeno1+='<span class="tsaltooltip"><input id=Tsalhide type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.hide+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.hide_title+'</span></span>';
    tsalperiexomeno1+='<span class="tsaltooltip"><input id=Tsalreset1 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.reset_b+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.reset_title+'</span></span>';
    tsalperiexomeno1+='<span class="tsaltooltip"><input id=Tsalcount1 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.count+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.count_title+'</span></span>';

   var tsalperiexomeno4 ='<div id="tsalperiexomeno4"><table class="vis"><tr><th colspan="40"><font color=maroon><center>'+tsalkapone_trans.general.config+'</center></font></th></tr><tr>';
    tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.ram+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ram.png"></td>';
 tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.catapult+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_cat.png"></td>';
    tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.sword+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_sword.png"></td>';
tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.spear+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_spear.png"></td>';
tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.axe+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_axe.png"></td>';
tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.archer+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_archer.png"></td>';
    tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.heavy+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_hc.png"></td>';
    tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.marcher+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ma.png"></td>';
 tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.light+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_lc.png"></td>';
tsalperiexomeno4+='<td><img title="'+tsalkapone_trans.units.scout+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_scout.png"></td>';
tsalperiexomeno4+='</tr><tr><td><input id="ram4" type="number" placeholder="0" value="" min="0"></td>';
tsalperiexomeno4+='<td><input id="cat4" type="number" placeholder="0" value="" min="0"></td>';
    tsalperiexomeno4+='<td><input id="sword4" type="number" placeholder="0" value="" min="0"></td>';
tsalperiexomeno4+='<td><input id="spear4" type="number" placeholder="0" value="" min="0"></td>';
 tsalperiexomeno4+='<td><input id="axe4" type="number" placeholder="0" value="" min="0"></td>';
  tsalperiexomeno4+='<td><input id="archer4" type="number" placeholder="0" value="" min="0"></td>';
    tsalperiexomeno4+='<td><input id="heavy4" type="number" placeholder="0" value="" min="0"></td>';
    tsalperiexomeno4+='<td><input id="marcher4" type="number" placeholder="0" value="" min="0"></td>';
    tsalperiexomeno4+='<td><input id="light4" type="number" placeholder="0" value="" min="0"></select></td>';
tsalperiexomeno4+='<td><input id="spy4" type="number" placeholder="0" value="" min="0"></td>';
tsalperiexomeno4+='</tr><tr><th colspan="40"><font color=maroon><center>'+tsalkapone_trans.general.settings+'</center></font></th></tr>';
tsalperiexomeno4+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.cometh+'</b></font></td>';
tsalperiexomeno4+='<td colspan="6"><select id="tsalscriptmethod4"><option value="Random order">'+tsalkapone_trans.general.random+'</option>';
tsalperiexomeno4+='<option value="Consecutive & Selective order">'+tsalkapone_trans.general.seq+'</option></select></td></tr>';
tsalperiexomeno4+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.coords+'</b></font></td>';
    tsalperiexomeno4+='<td colspan="6"><textarea id=tsalcoords4 value="" rows="1" cols="50"></textarea></td></tr>';
    tsalperiexomeno4+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.hot_fake+'</b></font></td>';
    tsalperiexomeno4+='<td colspan="6"><input type="text" id=tsalkey4 value=""  size="35"></td></tr>';
    tsalperiexomeno4+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.b_fake+'</b></font></td>';
    tsalperiexomeno4+='<td colspan="6"><input type="text" id=tsalakey4 value="" size="35"></td></tr>';
    tsalperiexomeno4+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.c_fake+'</b></font></td>';
    tsalperiexomeno4+='<td colspan="6"><input type="text" id=tsalname4 value="" size="35"></td></tr>';
    tsalperiexomeno4+='</table></div><br>';
tsalperiexomeno4+='<span class="tsaltooltip"><input id=Tsalsave4 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.save+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.save_title+'</span></span>';
    tsalperiexomeno4+='<span class="tsaltooltip"><input id=Tsalhide type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.hide+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.hide_title+'</span></span>';
    tsalperiexomeno4+='<span class="tsaltooltip"><input id=Tsalreset4 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.reset_b+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.reset_title+'</span></span>';
    tsalperiexomeno4+='<span class="tsaltooltip"><input id=Tsalcount4 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.count+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.count_title+'</span></span>';



    var tsalperiexomeno2 ='<div id="tsalperiexomeno2"><table class="vis"><tr><th colspan="10"><font color=maroon><center>'+tsalkapone_trans.general.config+'</center></font></th></tr>';
tsalperiexomeno2+='<tr><td><img title="'+tsalkapone_trans.units.spear+'"   style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_spear.png"></td>';
tsalperiexomeno2+='<td><img title="'+tsalkapone_trans.units.sword+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_sword.png"></td>';
tsalperiexomeno2+='<td><img title="'+tsalkapone_trans.units.axe+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_axe.png"></td>';
tsalperiexomeno2+='<td><img title="'+tsalkapone_trans.units.archer+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_archer.png"></td>';
 tsalperiexomeno2+='<td><img title="'+tsalkapone_trans.units.scout+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_scout.png"></td>';
tsalperiexomeno2+='<td><img title="'+tsalkapone_trans.units.light+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_lc.png"></td>';
tsalperiexomeno2+='<td><img title="'+tsalkapone_trans.units.heavy+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_hc.png"></td>';
tsalperiexomeno2+='<td><img title="'+tsalkapone_trans.units.marcher+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ma.png"></td>';
tsalperiexomeno2+='<td><img title="'+tsalkapone_trans.units.ram+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ram.png"></td>';
 tsalperiexomeno2+='<td><img title="'+tsalkapone_trans.units.catapult+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_cat.png"></td></tr>';
tsalperiexomeno2+='<tr><td><input id="spear2" type="number" placeholder="0" value="" min="0"><br><select id=spear2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno2+='<td><input id="sword2" type="number" placeholder="0" value="" min="0"><br><select id=sword2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
 tsalperiexomeno2+='<td><input id="axe2" type="number" placeholder="0" value="" min="0"><br><select id=axe2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
  tsalperiexomeno2+='<td><input id="archer2" type="number" placeholder="0" value="" min="0"><br><select id=archer2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno2+='<td><input id="spy2" type="number" placeholder="0" value="" min="0"><br><select id=spy2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno2+='<td><input id="light2" type="number" placeholder="0" value="" min="0"><br><select id=light2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno2+='<td><input id="heavy2" type="number" placeholder="0" value="" min="0"><br><select id=heavy2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno2+='<td><input id="marcher2" type="number" placeholder="0" value="" min="0"><br><select id=marcher2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno2+='<td><input id="ram2" type="number" placeholder="0" value="" min="0"><br><select id=ram2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno2+='<td><input id="cat2" type="number" placeholder="0" value="" min="0"><br><select id=cat2sel><option value="All units">'+tsalkapone_trans.general.all_units+'</option><option value="All more than">'+tsalkapone_trans.general.all_more+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td></tr>';
tsalperiexomeno2+='<tr><th colspan="10"><font color=maroon><center>'+tsalkapone_trans.general.settings+'</center></font></th></tr>';
tsalperiexomeno2+='<tr><td colspan="4"><img id=method2info src="/graphic/questionmark.png" style="height:15px; width:15px; cursor:pointer" title="'+tsalkapone_trans.general.qmark+'">&emsp;<font color=darkmagenta><b>'+tsalkapone_trans.general.methods+'</b></font></td>';
tsalperiexomeno2+='<td colspan="6"><select id="tsalscriptmethod2"><option value="All troops">'+tsalkapone_trans.general.off_1+'</option>';
tsalperiexomeno2+='<option value="All defensive units+catapults+scouts">'+tsalkapone_trans.general.def_1+'</option>';
tsalperiexomeno2+='<option value="All defensive units+scouts">'+tsalkapone_trans.general.def_2+'</option>';
    tsalperiexomeno2+='<option value="All defensive units">'+tsalkapone_trans.general.def_3+'</option>';
    tsalperiexomeno2+='<option value="All non-cavalry defensive">'+tsalkapone_trans.general.def_4+'</option>';
    tsalperiexomeno2+='<option value="All heavy">'+tsalkapone_trans.general.def_5+'</option>';
    tsalperiexomeno2+='<option value="All spears and archers">'+tsalkapone_trans.general.def_6+'</option>';
    tsalperiexomeno2+='<option value="All swords">'+tsalkapone_trans.general.def_7+'</option>';
    tsalperiexomeno2+='<option value="All scouts">'+tsalkapone_trans.general.def_8+'</option>';
tsalperiexomeno2+='<option value="Adjusted settings">'+tsalkapone_trans.general.off_8+'</option></select></td></tr>';
    tsalperiexomeno2+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.criteria+'</b></font></td>';
tsalperiexomeno2+='<td colspan="6"><select id="tsalcriteria2"><option value="Yes">'+tsalkapone_trans.general.yes+'</option><option value="No">'+tsalkapone_trans.general.no+'</option></select></td></tr>';
    tsalperiexomeno2+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.split+'</b></font></td>';
tsalperiexomeno2+='<td colspan="6"><select id="tsalsplit2"><option value="No">'+tsalkapone_trans.general.no+'</option><option value="2">'+tsalkapone_trans.general.by+' 2</option><option value="3">'+tsalkapone_trans.general.by+' 3</option><option value="4">'+tsalkapone_trans.general.by+' 4</option><option value="5">'+tsalkapone_trans.general.by+' 5</option></select></td></tr>';
tsalperiexomeno2+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.coords+'</b></font></td>';
    tsalperiexomeno2+='<td colspan="6"><textarea id=tsalcoords2 value="" rows="1" cols="50"></textarea></td></tr>';
    tsalperiexomeno2+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.hot_support+'</b></font></td>';
    tsalperiexomeno2+='<td colspan="6"><input type="text" id=tsalkey2 value=""  size="35"></td></tr>';
    tsalperiexomeno2+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.b_support+'</b></font></td>';
    tsalperiexomeno2+='<td colspan="6"><input type="text" id=tsalakey2 value="" size="35"></td></tr>';
    tsalperiexomeno2+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.c_support+'</b></font></td>';
    tsalperiexomeno2+='<td colspan="6"><input type="text" id=tsalname2 value="" size="35"></td></tr>';
    tsalperiexomeno2+='</table></div><br>';
tsalperiexomeno2+='<span class="tsaltooltip"><input id=Tsalsave2 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.save+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.save_title+'</span></span>';
    tsalperiexomeno2+='<span class="tsaltooltip"><input id=Tsalhide type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.hide+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.hide_title+'</span></span>';
    tsalperiexomeno2+='<span class="tsaltooltip"><input id=Tsalreset2 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.reset_b+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.reset_title+'</span></span>';
    tsalperiexomeno2+='<span class="tsaltooltip"><input id=Tsalcount2 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.count+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.count_title+'</span></span>';

    var tsalperiexomeno3 ='<div id="tsalperiexomeno3"><table class="vis"><tr><th colspan="30"><font color=maroon><center>'+tsalkapone_trans.general.config+'</center></font></th></tr><tr>';
    tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.light+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_lc.png"></td>';
tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.heavy+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_hc.png"></td>';
tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.marcher+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ma.png"></td>';
    tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.axe+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_axe.png"></td>';
tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.spear+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_spear.png"></td>';
    tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.archer+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_archer.png"></td>';
tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.sword+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_sword.png"></td>';
tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.scout+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_scout.png"></td>';
tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.ram+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_ram.png"></td>';
 tsalperiexomeno3+='<td><img title="'+tsalkapone_trans.units.catapult+'" style="cursor:help" src="https://media.innogamescdn.com/com_DS_GR/Scripts/images/Tsalkapone_master_tool_images/Tsalkapone_cat.png"></td></tr>';
tsalperiexomeno3+='<tr><td><input id="light3" type="number" placeholder="0" value="" min="0"><br><select id=light3sel><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno3+='<td><input id="heavy3" type="number" placeholder="0" value="" min="0"><br><select id=heavy3sel><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno3+='<td><input id="marcher3" type="number" placeholder="0" value="" min="0"><br><select id=marcher3sel><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno3+='<td><input id="axe3" type="number" placeholder="0" value="" min="0"><br><select id=axe3sel><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
 tsalperiexomeno3+='<td><input id="spear3" type="number" placeholder="0" value="" min="0"><br><select id=spear3sel><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno3+='<td><input id="archer3" type="number" placeholder="0" value="" min="0"><br><select id=archer3sel><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno3+='<td><input id="sword3" type="number" placeholder="0" value="" min="0"><br><select id=sword3sel><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
  tsalperiexomeno3+='<td><input id="spy3" type="number" placeholder="0" value="" min="0"><br><select id=spy3sel><option value="None">None</option><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno3+='<td><input id="ram3" type="number" placeholder="0" value="" min="0"><br><select id=ram3sel><option value="None">None</option><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td>';
tsalperiexomeno3+='<td><input id="cat3" type="number" placeholder="0" value="" min="0"><br><select id=cat3sel><option value="None">None</option><option value="All remaining">'+tsalkapone_trans.general.remaining+'</option><option value="Insert specific">'+tsalkapone_trans.general.specific+'</option></select></td></tr>';
tsalperiexomeno3+='<tr><th colspan="30"><font color=maroon><center>'+tsalkapone_trans.general.settings+'</center></font></th></tr>';
tsalperiexomeno3+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.methods+'</b></font></td>';
tsalperiexomeno3+='<td colspan="6"><select id="tsalscriptmethod3"><option value="By ascending speed">'+tsalkapone_trans.general.speed_1+'</option>';
tsalperiexomeno3+='<option value="By descending speed">'+tsalkapone_trans.general.speed_2+'</option></select></td></tr>';
tsalperiexomeno3+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.coords+'</b></font></td>';
    tsalperiexomeno3+='<td colspan="6"><textarea id=tsalcoords3 value="" rows="1" cols="50"></textarea></td></tr>';
    tsalperiexomeno3+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.hot_farm+'</b></font></td>';
    tsalperiexomeno3+='<td colspan="6"><input type="text" id=tsalkey3 value=""  size="35"></td></tr>';
    tsalperiexomeno3+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.b_farm+'</b></font></td>';
    tsalperiexomeno3+='<td colspan="6"><input type="text" id=tsalakey3 value="" size="35"></td></tr>';
    tsalperiexomeno3+='<tr><td colspan="4"><font color=darkmagenta><b>'+tsalkapone_trans.general.c_farming+'</b></font></td>';
    tsalperiexomeno3+='<td colspan="6"><input type="text" id=tsalname3 value="" size="35"></td></tr>';
    tsalperiexomeno3+='</table></div><br>';
tsalperiexomeno3+='<span class="tsaltooltip"><input id=Tsalsave3 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.save+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.save_title+'</span></span>';
    tsalperiexomeno3+='<span class="tsaltooltip"><input id=Tsalhide type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.hide+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.hide_title+'</span></span>';
    tsalperiexomeno3+='<span class="tsaltooltip"><input id=Tsalreset3 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.reset_b+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.reset_title+'</span></span>';
    tsalperiexomeno3+='<span class="tsaltooltip"><input id=Tsalcount3 type="button" class="btn tsalbutton" value="'+tsalkapone_trans.buttons.count+'"><span class="tsalinfo" >'+tsalkapone_trans.buttons.count_title+'</span></span>';

   var contact_url = 'https://forum.tribalwars.net/index.php?members/tsalkapone.114063/';
        var change1 ='Nuke'; var change2='Support'; var change3='Farming'; var change4='Fake';
if (lang == "english") {
var content_1 ='<div>';
content_1+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">'+change1+' Settings</font></u></center></h2><hr>';
content_1+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> In the '+tsalkapone_trans.general.config+' table you can define the <b>method</b> and the <b>number</b> for each unit that the script will use to insert units in the rally point. Note that any Unit Configuration will <b>ONLY</b> be applied if you select <b>'+tsalkapone_trans.general.off_8+'</b> in the <b><font color=darkmagenta>method of inserting troops</font></b>.';
content_1+='<br><br>The avalaible method options are the following:<br><b><font color=blue>1. All units</font></b>: selecting this option the script will enter all the available units of the selected unit type regardless of the number you have saved for the particular unit type.';
content_1+='<br><b><font color=blue>2. All more than</font></b>: selecting this option the script will enter all the available units of the selected unit type if the available units are more or equal to the saved number of the particular unit type.';
content_1+='<br><b><font color=blue>3. Insert specific</font></b>: selecting this option the script will enter exactly the saved number of the particular unit type if there are available units.';
content_1+='<hr><b><font color=maroon><u>Coords Method</u></font></b><br><br> The '+change1+' Script will enter the selected targets in a consecutive way following the order you entered the coords in the <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b> textarea. You will be informed in each click about the number of the current target.<br><br> You can add as many coords as you like in the appropriate text field by separating them with space bar i.e. \'500|500 450|450 600|600\'';
content_1+='<hr><b><font color=maroon><u>Shortcut keys and script title</u></font></b><br><br> You can define your own <font color=darkgreen><b>shortcut keys</b></font> to open the '+change1+' Settings menu or click the '+change1+' Script button. In the text field assigned for each shortcut key you can enter any character from your keyboard (i.e. \'B\' or \'c\') or any combination of them using <b><font color=red>+</font></b> (i.e. \'Ctrl+1\' or \'a+s+d\'). Avoid entering numbers or characters used as shortcut keys for other functions (i.e. \'m for map\').';
content_1+='<br><br> The <font color=darkgreen><b>script title</b></font> can be used for your own ease and will be applied as a the cookie value of the '+change1+' Script and the value of the '+change1+' Script button.';
content_1+='<hr><b><font color=maroon><u>Insert troops only if all selected criteria are met</u></font></b><br><br> This option can only be applied if you select <b>'+tsalkapone_trans.general.off_8+'</b> in the <b><font color=darkmagenta>method of inserting troops</font></b>. Selecting <b><font color=red>'+tsalkapone_trans.general.yes+'</font></b> the available units of each unit type have to be more or equal to the specified number for each unit type. If not, no units will be inserted in the rally point regardless of any other selected configuration.';
content_1+='</div>';
}
if (lang == "greek") {
var content_1 ='<div>';
content_1+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Ρυθμίσεις '+change1+'</font></u></center></h2><hr>';
content_1+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> Στο πίνακα '+tsalkapone_trans.general.config+' δύναται να ορίστε τη <b>μέθοδο</b> και το <b>πλήθος</b> κάθε μονάδας που θα εισάγει το script στο μέρος συγκέντρωσης. Υπόψιν ότι οι ρυθμίσεις στο συγκεκριμένο πίνακα θα εφαρμοστούν <b>ΜΟΝΟ</b> με ενεργή την επιλογή <b>'+tsalkapone_trans.general.off_8+'</b> στο μενού επιλογής <b><font color=darkmagenta>μέθοδος εισαγωγής στρατευμάτων</font></b>.';
content_1+='<br><br>Οι διαθέσιμες επιλογές μεθόδων είναι οι εξής:<br><b><font color=blue>1. Όλες οι μονάδες</font></b>: επιλέγοντας τη συγκεκριμένη επιλογή το script θα εισάγει όλο το πλήθος της συγκεκριμένης μονάδας ανεξάρτητα με το πλήθος που έχετε εισάγει.';
content_1+='<br><b><font color=blue>2. Όλα περισσότερα από</font></b>: επιλέγοντας τη συγκεκριμένη επιλογή το script θα εισάγει όλο το πλήθος της συγκεκριμένης μονάδας εφόσον είναι ίσο η μεγαλύτερο του εισαγόμενου πλήθους.';
content_1+='<br><b><font color=blue>3. Εισαγωγή ακριβώς</font></b>: επιλέγοντας τη συγκεκριμένη επιλογή το script θα εισάγει ακριβώς την αποθηκευμένη τιμή της συγκεκριμένης μονάδας εφόσον υπάρχουν διαθέσιμες μονάδες εντός του μέρους συγκέντρωσης.';
content_1+='<hr><b><font color=maroon><u>Μέθοδος επιλογής συντεταγμένων</u></font></b><br><br> Το '+change1+' Script εισάγει τις επιλεγμένες συντεταγμένες στόχων με διαδοχική ακολουθία με τη σειρά που τις έχετε εισάγει στο αντίστοιχο πλαίσιο <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b>. Σε κάθε ενεργοποίηση του script θα ενημερώνεστε για τη σειρά του τρέχοντος στόχου.<br><br> Μπορείτε να εισάγετε όσες συντεταγμένες επιθυμείτε διαχωρίζοντάς τες με <b>κενό</b> π.χ. \'500|500 450|450 600|600\'';
content_1+='<hr><b><font color=maroon><u>Πλήκτρα συντόμευσης και τίτλος script</u></font></b><br><br> Μπορείτε να ορίσετε τα δικά σας <font color=darkgreen><b>πλήκτρα συντόμευσης</b></font> για το άνοιγμα των Ρυθμίσεων '+change1+' και της ενεργοποίησης του πλήκτρου '+change1+' Script. Στο πλαίσιο εισαγωγής του πλήκτρου συντόμευσης μπορείτε να εισάγετε οποιοδήποτε χαρακτήρα του πληκτρολογίου (π.χ. \'B\' or \'c\') ή οποιοδήποτε συνδυασμό τους προσθέτοντας <b><font color=red>+</font></b> (π.χ. \'Ctrl+1\' or \'a+s+d\'). Αποφύγετε να χρησιμοποιήσετε αριθμούς ή χαρακτήρες που αποτελούν πλήκτρα συντόμευσης του παιχνιδιού (π.χ. m για το χάρτη).';
content_1+='<br><br> Ο <font color=darkgreen><b>τίτλος script</b></font> δύναται να αξιοποιηθεί προς δική σας διευκόλυνση και αποθηκεύεται ως τιμή cookie του '+change1+' Script καθώς και ως ονομασία του πλήκτρου '+change1+' Script.';
content_1+='<hr><b><font color=maroon><u>Εισαγωγή στρατευμάτων μόνο όταν πληρούνται όλα τα κριτήρια</u></font></b><br><br> Η συγκεκριμένη επιλογή θα εφαρμοστεί μόνο με ενεργή την επιλογή <b>'+tsalkapone_trans.general.off_8+'</b> σαν <b><font color=darkmagenta>μέθοδο εισαγωγής στρατευμάτων</font></b>. Επιλέγοντας <b><font color=red>'+tsalkapone_trans.general.yes+'</font></b> τα διαθέσιμα πλήθη κάθε μονάδας θα πρέπει να είσαι ίσα ή μεγαλύτερα των επιλεγμένων τιμών. Σε αντίθετη περίπτωση καμιά μονάδα δεν θα εισαχθεί στο μέρος συγκέντρωσης ανεξάρτητα από τις υπόλοιπες ρυθμίσεις.';
content_1+='</div>';
}
if (lang == "english") {
var content_2 = '<div>';
content_2+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">'+change2+' Settings</font></u></center></h2><hr>';
content_2+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> In the '+tsalkapone_trans.general.config+' table you can define the <b>method</b> and the <b>number</b> for each unit that the script will use to insert units in the rally point. Note that any Unit Configuration will <b>ONLY</b> be applied if you select <b>'+tsalkapone_trans.general.off_8+'</b> in the <b><font color=darkmagenta>method of inserting troops</font></b>.';
content_2+='<br><br>The avalaible method options are the following:<br><b><font color=blue>1. All units</font></b>: selecting this option the script will enter all the available units of the selected unit type regardless of the number you have saved for the particular unit type.';
content_2+='<br><b><font color=blue>2. All more than</font></b>: selecting this option the script will enter all the available units of the selected unit type if the available units are more or equal to the saved number of the particular unit type.';
content_2+='<br><b><font color=blue>3. Insert specific</font></b>: selecting this option the script will enter exactly the saved number of the particular unit type if there are available units.';
content_2+='<hr><b><font color=maroon><u>Split values</u></font></b><br><br> This option can only be applied if you select <b>'+tsalkapone_trans.general.off_8+'</b> in the <b><font color=darkmagenta>method of inserting troops</font></b>. Selecting a <b><font color=red>number</font></b> from the available options (i.e. 2) every specified value for each unit type will be divided by the selected number and the result will be inserted in the rally point.';
content_2+='<hr><b><font color=maroon><u>Coords Method</u></font></b><br><br> The '+change2+' Script will enter the selected targets in a consecutive way following the order you entered the coords in the <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b> textarea. You be informed in each click about the number of the current target.<br><br> You can add as many coords as you like in the appropriate text field by separating them with space bar i.e. \'500|500 450|450 600|600\'';
content_2+='<hr><b><font color=maroon><u>Shortcut keys and script title</u></font></b><br><br> You can define your own <font color=darkgreen><b>shortcut keys</b></font> to open the '+change2+' Settings menu or click the '+change2+' Script button. In the text field assigned for each shortcut key you can enter any character from your keyboard (i.e. \'B\' or \'c\') or any combination of them using <b><font color=red>+</font></b> (i.e. \'Ctrl+1\' or \'a+s+d\'). Avoid entering numbers or characters used as shortcut keys for other functions (i.e. \'m for map\').';
content_2+='<br><br> The <font color=darkgreen><b>script title</b></font> can be used for your own ease and will be applied as a the cookie value of the '+change2+' Script and the value of the '+change2+' Script button.';
content_2+='<hr><b><font color=maroon><u>Insert troops only if all selected criteria are met</u></font></b><br><br> This option can only be applied if you select <b>'+tsalkapone_trans.general.off_8+'</b> in the <b><font color=darkmagenta>method of inserting troops</font></b>. Selecting <b><font color=red>'+tsalkapone_trans.general.yes+'</font></b> the available units of each unit type have to be more or equal to the specified number for each unit type. If not, no units will be inserted in the rally point regardless of any other selected configuration.';
content_2+='</div>';
}
if (lang == "greek") {
var content_2 ='<div>';
content_2+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Ρυθμίσεις '+change2+'</font></u></center></h2><hr>';
content_2+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> Στο πίνακα '+tsalkapone_trans.general.config+' δύναται να ορίστε τη <b>μέθοδο</b> και το <b>πλήθος</b> κάθε μονάδας που θα εισάγει το script στο μέρος συγκέντρωσης. Υπόψιν ότι οι ρυθμίσεις στο συγκεκριμένο πίνακα θα εφαρμοστούν <b>ΜΟΝΟ</b> με ενεργή την επιλογή <b>'+tsalkapone_trans.general.off_8+'</b> στο μενού επιλογής <b><font color=darkmagenta>μέθοδος εισαγωγής στρατευμάτων</font></b>.';
content_2+='<br><br>Οι διαθέσιμες επιλογές μεθόδων είναι οι εξής:<br><b><font color=blue>1. Όλες οι μονάδες</font></b>: επιλέγοντας τη συγκεκριμένη επιλογή το script θα εισάγει όλο το πλήθος της συγκεκριμένης μονάδας ανεξάρτητα με το πλήθος που έχετε εισάγει.';
content_2+='<br><b><font color=blue>2. Όλα περισσότερα από</font></b>: επιλέγοντας τη συγκεκριμένη επιλογή το script θα εισάγει όλο το πλήθος της συγκεκριμένης μονάδας εφόσον είναι ίσο η μεγαλύτερο του εισαγόμενου πλήθους.';
content_2+='<br><b><font color=blue>3. Εισαγωγή ακριβώς</font></b>: επιλέγοντας τη συγκεκριμένη επιλογή το script θα εισάγει ακριβώς την αποθηκευμένη τιμή της συγκεκριμένης μονάδας εφόσον υπάρχουν διαθέσιμες μονάδες εντός του μέρους συγκέντρωσης.';
content_2+='<hr><b><font color=maroon><u>Τιμές split</u></font></b><br><br> Η συγκεκριμένη επιλογή θα εφαρμοστεί μόνο με ενεργή την επιλογή <b>'+tsalkapone_trans.general.off_8+'</b> σαν <b><font color=darkmagenta>μέθοδο εισαγωγής στρατευμάτων</font></b>. Επιλέγοντας έναν <b><font color=red>αριθμό</font></b> από τις διαθέσιμες επιλογές (π.χ. 2) κάθε επιλεγμένη τιμή πλήθους ή τιμή ρύθμισης θα διαιρεθεί με το συγκεκριμένο αριθμό και το αποτέλεσμα θα εισαχθεί στο μέρος συγκέντρωσης.';
content_2+='<hr><b><font color=maroon><u>Μέθοδος επιλογής συντεταγμένων</u></font></b><br><br> Το '+change2+' Script εισάγει τις επιλεγμένες συντεταγμένες στόχων με διαδοχική ακολουθία με τη σειρά που τις έχετε εισάγει στο αντίστοιχο πλαίσιο <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b>. Σε κάθε ενεργοποίηση του script θα ενημερώνεστε για τη σειρά του τρέχοντος στόχου.<br><br> Μπορείτε να εισάγετε όσες συντεταγμένες επιθυμείτε διαχωρίζοντάς τες με <b>κενό</b> π.χ. \'500|500 450|450 600|600\'';
content_2+='<hr><b><font color=maroon><u>Πλήκτρα συντόμευσης και τίτλος script</u></font></b><br><br> Μπορείτε να ορίσετε τα δικά σας <font color=darkgreen><b>πλήκτρα συντόμευσης</b></font> για το άνοιγμα των Ρυθμίσεων '+change2+' και της ενεργοποίησης του πλήκτρου '+change2+' Script. Στο πλαίσιο εισαγωγής του πλήκτρου συντόμευσης μπορείτε να εισάγετε οποιοδήποτε χαρακτήρα του πληκτρολογίου (π.χ. \'B\' or \'c\') ή οποιοδήποτε συνδυασμό τους προσθέτοντας <b><font color=red>+</font></b> (π.χ. \'Ctrl+1\' or \'a+s+d\'). Αποφύγετε να χρησιμοποιήσετε αριθμούς ή χαρακτήρες που αποτελούν πλήκτρα συντόμευσης του παιχνιδιού (π.χ. m για το χάρτη).';
content_2+='<br><br> Ο <font color=darkgreen><b>τίτλος script</b></font> δύναται να αξιοποιηθεί προς δική σας διευκόλυνση και αποθηκεύεται ως τιμή cookie του '+change2+' Script καθώς και ως ονομασία του πλήκτρου '+change2+' Script.';
content_2+='<hr><b><font color=maroon><u>Εισαγωγή στρατευμάτων μόνο όταν πληρούνται όλα τα κριτήρια</u></font></b><br><br> Η συγκεκριμένη επιλογή θα εφαρμοστεί μόνο με ενεργή την επιλογή <b>'+tsalkapone_trans.general.off_8+'</b> σαν <b><font color=darkmagenta>μέθοδο εισαγωγής στρατευμάτων</font></b>. Επιλέγοντας <b><font color=red>'+tsalkapone_trans.general.yes+'</font></b> τα διαθέσιμα πλήθη κάθε μονάδας θα πρέπει να είσαι ίσα ή μεγαλύτερα των επιλεγμένων τιμών. Σε αντίθετη περίπτωση καμιά μονάδα δεν θα εισαχθεί στο μέρος συγκέντρωσης ανεξάρτητα από τις υπόλοιπες ρυθμίσεις.';
content_2+='</div>';
}
if (lang == "english") {
        var content_3 = '<div>';
content_3+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">'+change3+' Settings</font></u></center></h2><hr>';
content_3+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> In the '+tsalkapone_trans.general.config+' table you can define the <b>method</b> and the <b>number</b> for each unit that the script will use to insert units in the rally point. The script will use only one unit type to enter in the rally point. <br><br>The priority order is specified on the table. Selecting <font color=darkgreen><b>'+tsalkapone_trans.general.speed_1+'</b></font> as the <b><font color=darkmagenta>the method of inserting troops</b></font> the priority order is the one that is displayed on the table. Select <font color=darkgreen><b>'+tsalkapone_trans.general.speed_2+'</b></font> to reverse it. <br><br>You can choose to ignore a unit type by specifying its value to 0. <br>'+tsalkapone_trans.units.scout+'s, rams and catapults are an exception to this rule. '+tsalkapone_trans.units.scout+' will be inserted regardless of any other option. As for rams and catapults, the script will prioritize in inserting the selected value of rams. If the selected value isnt available, catapults will be inserted instead.';
content_3+='<br><br>The avalaible method options are the following:<br>';
content_3+='<b><font color=blue>1. All remaining</font></b>: selecting this option the script will enter all the available units of the selected unit type if the available units are less or equal to the saved number of the particular unit type. If there are more, the specified value will be inserted.';
content_3+='<br><b><font color=blue>2. Insert specific</font></b>: selecting this option the script will enter exactly the saved number of the particular unit type if there are available units.';
content_3+='<hr><b><font color=maroon><u>Coords Method</u></font></b><br><br> The '+change3+' Script will enter the selected targets in a consecutive way following the order you entered the coords in the <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b> textarea. You be informed in each click about the number of the current target.<br><br> You can add as many coords as you like in the appropriate text field by separating them with space bar i.e. \'500|500 450|450 600|600\'';
content_3+='<hr><b><font color=maroon><u>Shortcut keys and script title</u></font></b><br><br> You can define your own <font color=darkgreen><b>shortcut keys</b></font> to open the '+change3+' Settings menu or click the '+change3+' Script button. In the text field assigned for each shortcut key you can enter any character from your keyboard (i.e. \'B\' or \'c\') or any combination of them using <b><font color=red>+</font></b> (i.e. \'Ctrl+1\' or \'a+s+d\'). Avoid entering numbers or characters used as shortcut keys for other functions (i.e. \'m for map\').';
content_3+='<br><br> The <font color=darkgreen><b>script title</b></font> can be used for your own ease and will be applied as a the cookie value of the '+change3+' Script and the value of the '+change3+' Script button.';
content_3+='</div>';
}
if (lang == "greek") {
 var content_3 ='<div>';
content_3+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Ρυθμίσεις '+change3+'</font></u></center></h2><hr>';
content_3+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> Στο πίνακα '+tsalkapone_trans.general.config+' δύναται να ορίστε τη <b>μέθοδο</b> και το <b>πλήθος</b> κάθε μονάδας που θα εισάγει το script στο μέρος συγκέντρωσης. Το script θα επιλέξει μόνο ένα είδος μονάδας για να εισάγει στο μέρος συγκέντρωσης.<br><br>Η σειρά προτεραιότητας προσδιορίζεται από το πίνακα. Επιλέγοντας  <font color=darkgreen><b>Με φθίνουσα ταχύτητα</font></b> σαν <b><font color=darkmagenta>μέθοδο εισαγωγής στρατευμάτων</b></font> η σειρά προτεραιότητας θα είναι αυτή που φαίνεται στο πίνακα. Επιλέξτε <font color=darkgreen><b>Με αύξουσα ταχύτητα</b></font> για να αντιστρέψετε τη σειρά. <br><br>Μπορείτε να επιλέξετε να αγνοηθεί ένα είδος μονάδας εισάγοντας 0 στη τιμή της. Oι ανιχνευτές, κριοί και καταπέλτες αποτελούν εξαίρεση. Η επιλεγμένη τιμή των ανιχνευτών θα εισαχθεί ανεξάρτητα από άλλη επιλογή ή ρύθμιση. Όσο για τους κριούς και τους καταπέλτες το script θα εισάγει κατά προτεραιότητα τη τιμή του κριού. Αν δεν υπάρχει διαθέσιμο πλήθος θα εισαχθεί η τιμή του καταπέλτη.';
content_3+='<br><br>Οι διαθέσιμες επιλογές μεθόδων είναι οι εξής:<br>';
content_3+='<br><b><font color=blue>1. Εισαγωγή υπόλοιπου</font></b>: επιλέγοντας τη συγκεκριμένη επιλογή το script θα εισάγει όλο το πλήθος της συγκεκριμένης μονάδας εφόσον είναι ίσο η μικρότερο του εισαγόμενου πλήθους. Αν υπάρχουν περισσότερες μονάδες θα εισαχθεί η επιλεγμένη τιμή.';
content_3+='<br><b><font color=blue>2. Εισαγωγή ακριβώς</font></b>: επιλέγοντας τη συγκεκριμένη επιλογή το script θα εισάγει ακριβώς την αποθηκευμένη τιμή της συγκεκριμένης μονάδας εφόσον υπάρχουν διαθέσιμες μονάδες εντός του μέρους συγκέντρωσης.';
content_3+='<hr><b><font color=maroon><u>Μέθοδος επιλογής συντεταγμένων</u></font></b><br><br> Το '+change3+' Script εισάγει τις επιλεγμένες συντεταγμένες στόχων με διαδοχική ακολουθία με τη σειρά που τις έχετε εισάγει στο αντίστοιχο πλαίσιο <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b>. Σε κάθε ενεργοποίηση του script θα ενημερώνεστε για τη σειρά του τρέχοντος στόχου.<br><br> Μπορείτε να εισάγετε όσες συντεταγμένες επιθυμείτε διαχωρίζοντάς τες με <b>κενό</b> π.χ. \'500|500 450|450 600|600\'';
content_3+='<hr><b><font color=maroon><u>Πλήκτρα συντόμευσης και τίτλος script</u></font></b><br><br> Μπορείτε να ορίσετε τα δικά σας <font color=darkgreen><b>πλήκτρα συντόμευσης</b></font> για το άνοιγμα των Ρυθμίσεων '+change3+' και της ενεργοποίησης του πλήκτρου '+change3+' Script. Στο πλαίσιο εισαγωγής του πλήκτρου συντόμευσης μπορείτε να εισάγετε οποιοδήποτε χαρακτήρα του πληκτρολογίου (π.χ. \'B\' or \'c\') ή οποιοδήποτε συνδυασμό τους προσθέτοντας <b><font color=red>+</font></b> (π.χ. \'Ctrl+1\' or \'a+s+d\'). Αποφύγετε να χρησιμοποιήσετε αριθμούς ή χαρακτήρες που αποτελούν πλήκτρα συντόμευσης του παιχνιδιού (π.χ. m για το χάρτη).';
content_3+='<br><br> Ο <font color=darkgreen><b>τίτλος script</b></font> δύναται να αξιοποιηθεί προς δική σας διευκόλυνση και αποθηκεύεται ως τιμή cookie του '+change3+' Script καθώς και ως ονομασία του πλήκτρου '+change3+' Script.';
content_3+='</div>';
}
if (lang == "english"){
        var content_4 = '<div>';
content_4+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">'+change4+' Settings</font></u></center></h2><hr>';
content_4+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> In the '+tsalkapone_trans.general.config+' table you can define the <b>number</b> for each unit that the script will use to insert units in the rally point. The script will use only one unit type to enter in the rally point. The priority order is specified on the table. You can choose to ignore a unit type by specifying its value to 0. <br><br>'+tsalkapone_trans.units.scout+'s are an exception to this rule. Their value will be inserted regardless. If the units in the rally point are less than the units selected, all the remaining scouts will be inserted.';
content_4+='<hr><b><font color=maroon><u>Coords Method</u></font></b><br><br> The '+change4+' Script offers two possible methods of inserting coords.';
content_4+='<br>The avalaible method options are the following:<br>';
content_4+='<b><font color=blue>1. Random order</font></b>: selecting this option the script will pick a random coordinate from your selected targets to enter in the rally point.';
content_4+='<br><b><font color=blue>2. Consecutive & Selective order</font></b>: selecting this option the script will enter coords in a consecutive way following the order of the selected targets. A <b><font color=darkgreen>Target list</font></b> will be available if you wish to change your current target with another target. All you have to do is to pick an option from the target list.';
content_4+='<br><br> You can add as many coords as you like in the appropriate text field by separating them with space bar i.e. \'500|500 450|450 600|600\'';
content_4+='<hr><b><font color=maroon><u>Shortcut keys and script title</u></font></b><br><br> You can define your own <font color=darkgreen><b>shortcut keys</b></font> to open the '+change4+' Settings menu or click the '+change4+' Script button. In the text field assigned for each shortcut key you can enter any character from your keyboard (i.e. \'B\' or \'c\') or any combination of them using <b><font color=red>+</font></b> (i.e. \'Ctrl+1\' or \'a+s+d\'). Avoid entering numbers or characters used as shortcut keys for other functions (i.e. \'m for map\').';
content_4+='<br><br> The <font color=darkgreen><b>script title</b></font> can be used for your own ease and will be applied as a the cookie value of the '+change4+' Script and the value of the '+change4+' Script button.';
content_4+='</div>';
}
if (lang == "greek"){
        var content_4 = '<div>';
content_4+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Ρυθμίσεις '+change4+'</font></u></center></h2><hr>';
content_4+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> Στο πίνακα '+tsalkapone_trans.general.config+' δύναται να ορίστε τη <b>μέθοδο</b> και το <b>πλήθος</b> κάθε μονάδας που θα εισάγει το script στο μέρος συγκέντρωσης. Το script θα επιλέξει μόνο ένα είδος μονάδας για να εισάγει στο μέρος συγκέντρωσης. Η σειρά προτεραιότητας προσδιορίζεται από το πίνακα. Μπορείτε να επιλέξετε να αγνοηθεί ένα είδος μονάδας εισάγοντας 0 στη τιμή της. <br><br>Oι ανιχνευτές αποτελούν εξαίρεση. Η επιλεγμένη τιμή των ανιχνευτών θα εισαχθεί ανεξάρτητα από άλλη επιλογή ή ρύθμιση. Αν η ποσότητα που έχει επιλεχθεί είναι μεγαλύτερη των ανιχνευτών που υπάρχουν θα εισαχθούν όλοι οι ανιχνευτές.';
content_4+='<hr><b><font color=maroon><u>Μέθοδος επιλογής συντεταγμένων</u></font></b><br><br> Το '+change4+' Script προσφέρεις δυο πιθανές μεθόδους επιλογής συντεταγμένων.';
content_4+='<br>Οι διαθέσιμες μέθοδοι αποτελούν οι εξής:<br>';
content_4+='<b><font color=blue>1. Τυχαία επιλογή</font></b>: επιλέγοντας τη συγκεκριμένη μέθοδο το script θα εισάγει μια τυχαία αλληλουχία συντεταγμένων από τους επιλεγμένους στόχους.';
content_4+='<br><b><font color=blue>2. Διαδοχική και συγκεκριμένη επιλογή</font></b>: επιλέγοντας τη συγκεκριμένη μέθοδο το script θα εισάγει διαδοχικά τις συντεταγμένες ακολουθώντας τη σειρά εισαγωγής τους. Μέσω της <b><font color=darkgreen>Λίστας στόχων</font></b> μπορείτε να επιλέξετε ανά πάσα στιγμή το τρέχων στόχο επιλέγοντας τον επιθυμητό από το μενού στόχων. <br><br>Η συγκεκριμένη επιλογή είναι ενεργή μόνο αν έχετε επιλέξει <b><font color="red">Διαδοχική και συγκεκριμένη επιλογή</font></b> ως <b>μέθοδο εισαγωγής συντεταγμένων</b>.';
content_4+='<br><br> Μπορείτε να εισάγετε όσες συντεταγμένες επιθυμείτε διαχωρίζοντάς τες με <b>κενό</b> π.χ. \'500|500 450|450 600|600\'';
content_4+='<hr><b><font color=maroon><u>Πλήκτρα συντόμευσης και τίτλος script</u></font></b><br><br> Μπορείτε να ορίσετε τα δικά σας <font color=darkgreen><b>πλήκτρα συντόμευσης</b></font> για το άνοιγμα των Ρυθμίσεων '+change4+' και της ενεργοποίησης του πλήκτρου '+change4+' Script. Στο πλαίσιο εισαγωγής του πλήκτρου συντόμευσης μπορείτε να εισάγετε οποιοδήποτε χαρακτήρα του πληκτρολογίου (π.χ. \'B\' or \'c\') ή οποιοδήποτε συνδυασμό τους προσθέτοντας <b><font color=red>+</font></b> (π.χ. \'Ctrl+1\' or \'a+s+d\'). Αποφύγετε να χρησιμοποιήσετε αριθμούς ή χαρακτήρες που αποτελούν πλήκτρα συντόμευσης του παιχνιδιού (π.χ. m για το χάρτη).';
content_4+='<br><br> Ο <font color=darkgreen><b>τίτλος script</b></font> δύναται να αξιοποιηθεί προς δική σας διευκόλυνση και αποθηκεύεται ως τιμή cookie του '+change4+' Script καθώς και ως ονομασία του πλήκτρου '+change4+' Script.';
content_4+='</div>';
}
if (lang == "english"){
      var infocontent_1 = '<div>';
infocontent_1+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Nuke. Inserting Methods</font></u></center></h2><hr>';
infocontent_1+='<b><font color=maroon><u>Inserting troops methods</u></font></b><br><br>';
infocontent_1+='The available methods are the following:<br><font color=blue><b>1. '+tsalkapone_trans.general.off_1+'</b></font>: Script will enter all the available troops in the rally points.';
infocontent_1+='<br><br><font color=blue><b>2. '+tsalkapone_trans.general.off_2+'</b></font>: The script will enter all the available units of the following unit types: axe, light cavalry, mounted archer, ram, spy.';
infocontent_1+='<br><br><font color=blue><b>3. '+tsalkapone_trans.general.off_3+'</b></font>:<br>The script will enter all the available units of the following unit types: axe, light cavalry, mounted archer, ram, heavy cavalry, spy.';
infocontent_1+='<br><br><font color=blue><b>4. '+tsalkapone_trans.general.off_4+'</b></font>:<br>The script will enter all the available units of the following unit types: axe, light cavalry, mounted archer, spy.';
infocontent_1+='<br><br><font color=blue><b>5. '+tsalkapone_trans.general.off_5+'</b></font>: The script will enter all the available units of the following unit types: axe, light cavalry, mounted archer, ram.';
infocontent_1+='<br><br><font color=blue><b>5. '+tsalkapone_trans.general.off_6+'</b></font>: The script will enter all the available units of the following unit types: light cavalry.';
infocontent_1+='<br><br><font color=blue><b>6. '+tsalkapone_trans.general.off_7+'</b></font>: The script will enter all the available units of the following unit types: light cavalry, mounted archer, heavy cavalry.';
infocontent_1+='<br><br><font color=blue><b>7. '+tsalkapone_trans.general.off_8+'</b></font>: The script will use the values specified in <b><font color=maroon>'+tsalkapone_trans.general.config+'</font></b> table.';
 infocontent_1+='</div>';
        var infocontent_2 = '<div>';
infocontent_2+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Support. Inserting Methods</font></u></center></h2><hr>';
infocontent_2+='<b><font color=maroon><u>Inserting troops methods</u></font></b><br><br>';
infocontent_2+='The available methods are the following:<br><font color=blue><b>1. '+tsalkapone_trans.general.off_1+'</b></font>: Script will enter all the available troops in the rally points.';
infocontent_2+='<br><br><font color=blue><b>2. '+tsalkapone_trans.general.def_1+'</b></font>: The script will enter all the available units of the following unit types: spear, sword, archer, heavy cavalry, spy.';
infocontent_2+='<br><br><font color=blue><b>3. '+tsalkapone_trans.general.def_2+'</b></font>:<br>The script will enter all the available units of the following unit types: spear, sword, archer, heavy cavalry.';
infocontent_2+='<br><br><font color=blue><b>4. '+tsalkapone_trans.general.def_3+'</b></font>:<br>The script will enter all the available units of the following unit types: spear, sword, archer.';
infocontent_2+='<br><br><font color=blue><b>5. '+tsalkapone_trans.general.def_4+'</b></font>: The script will enter all the available units of the following unit types: heavy cavalry.';
infocontent_2+='<br><br><font color=blue><b>6. '+tsalkapone_trans.general.def_5+'</b></font>: The script will enter all the available units of the following unit types: spear, archer.';
infocontent_2+='<br><br><font color=blue><b>7. '+tsalkapone_trans.general.def_6+'</b></font>: The script will enter all the available units of the following unit types: spear, archer.';
infocontent_2+='<br><br><font color=blue><b>8. '+tsalkapone_trans.general.def_7+'</b></font>: The script will enter all the available units of the following unit types: catapults.';
infocontent_2+='<br><br><font color=blue><b>9. '+tsalkapone_trans.general.def_8+'</b></font>: The script will enter all the available units of the following unit types: spy.';
infocontent_2+='<br><br><font color=blue><b>10. '+tsalkapone_trans.general.off_8+'</b></font>: The script will use the values specified in <b><font color=maroon>'+tsalkapone_trans.general.config+'</font></b>.';
 infocontent_2+='</div>';
}
 if (lang == "greek"){
  var infocontent_1 = '<div>';
infocontent_1+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Nuke. Μέθοδοι εισαγωγής στρατευμάτων</font></u></center></h2><hr>';
infocontent_1+='<b><font color=maroon><u>Διαθέσιμες μέθοδοι εισαγωγής στρατευμάτων</u></font></b><br><br>';
infocontent_1+='The available methods are the following:<br><font color=blue><b>1. '+tsalkapone_trans.general.off_1+'</b></font>: Το script θα εισάγει όλα τα στρατεύματα εντός του μέρους συγκέντρωσης.';
infocontent_1+='<br><br><font color=blue><b>2. '+tsalkapone_trans.general.off_2+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: τσεκούρια, ελαφρύ, έφιππους, κριούς, ανιχνευτές.';
infocontent_1+='<br><br><font color=blue><b>3. '+tsalkapone_trans.general.off_3+'</b></font>:<br>Το script θα εισάγει όλες τις εξής μονάδες: τσεκούρια, ελαφρύ, έφιππους, κριούς, βαρύ, ανιχνευτές.';
infocontent_1+='<br><br><font color=blue><b>4. '+tsalkapone_trans.general.off_4+'</b></font>:<br>Το script θα εισάγει όλες τις εξής μονάδες: τσεκούρια, ελαφρύ, έφιππους, ανιχνευτές.';
infocontent_1+='<br><br><font color=blue><b>5. '+tsalkapone_trans.general.off_5+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: τσεκούρια, ελαφρύ, έφιππους, κριούς.';
infocontent_1+='<br><br><font color=blue><b>5. '+tsalkapone_trans.general.off_6+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: ελαφρύ.';
infocontent_1+='<br><br><font color=blue><b>6. '+tsalkapone_trans.general.off_7+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: ελαφρύ, έφιππους, βαρύ.';
infocontent_1+='<br><br><font color=blue><b>7. '+tsalkapone_trans.general.off_8+'</b></font>: Το script θα εισάγει τις επιλεγμένες τιμές από το πίνακα <b><font color=maroon>'+tsalkapone_trans.general.config+'</font></b>.';
 infocontent_1+='</div>';
        var infocontent_2 = '<div>';
infocontent_2+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Support. Μέθοδοι εισαγωγής στρατευμάτων</font></u></center></h2><hr>';
infocontent_2+='<b><font color=maroon><u>Διαθέσιμες μέθοδοι εισαγωγής στρατευμάτων</u></font></b><br><br>';
infocontent_2+='The available methods are the following:<br><font color=blue><b>1. '+tsalkapone_trans.general.off_1+'</b></font>: Το script θα εισάγει όλα τα στρατεύματα εντός του μέρους συγκέντρωσης.';
infocontent_2+='<br><br><font color=blue><b>2. '+tsalkapone_trans.general.def_1+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: δόρατα, ξίφη, τοξότες, βαρύ, ανιχνευτές.';
infocontent_2+='<br><br><font color=blue><b>3. '+tsalkapone_trans.general.def_2+'</b></font>:<br>Το script θα εισάγει όλες τις εξής μονάδες: δόρατα, ξίφη, τοξότες, βαρύ.';
infocontent_2+='<br><br><font color=blue><b>4. '+tsalkapone_trans.general.def_3+'</b></font>:<br>Το script θα εισάγει όλες τις εξής μονάδες: δόρατα, ξίφη, τοξότες.';
infocontent_2+='<br><br><font color=blue><b>5. '+tsalkapone_trans.general.def_4+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: βαρύ.';
infocontent_2+='<br><br><font color=blue><b>6. '+tsalkapone_trans.general.def_5+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: δόρατα, τοξότες.';
infocontent_2+='<br><br><font color=blue><b>7. '+tsalkapone_trans.general.def_6+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: ξίφη.';
infocontent_2+='<br><br><font color=blue><b>8. '+tsalkapone_trans.general.def_7+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: καταπέλτες.';
infocontent_2+='<br><br><font color=blue><b>9. '+tsalkapone_trans.general.def_8+'</b></font>: Το script θα εισάγει όλες τις εξής μονάδες: ανιχνευτές.';
infocontent_2+='<br><br><font color=blue><b>10. '+tsalkapone_trans.general.off_8+'</b></font>: Το script θα εισάγει τις επιλεγμένες τιμές από το πίνακα <b><font color=maroon>'+tsalkapone_trans.general.config+'</font></b> table.';
 infocontent_2+='</div>';
 }
 if (lang == "italian") {
var content_1 ='<div>';
content_1+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">'+change1+' Settaggi</font></u></center></h2><hr>';
content_1+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> Nella tabella di '+tsalkapone_trans.general.config+' puoi definire il <b>metodo</b> e il <b>numero</b> per ogni unità che lo script inserirà nel punto di raduno. Nota che ogni Configurazione Unità sarà applicata <b>SOLO</b> se selezioni <b>'+tsalkapone_trans.general.off_8+'</b> nel <b><font color=darkmagenta>metodo di inserimento truppe</font></b>.';
content_1+='<br><br>I metodi disponibili sono i seguenti:<br><b><font color=blue>1. Tutte le unità</font></b>: selezionando questa opzione lo script inserirà tutte le unità disponibili della unità selezionata indipendendemente dal numero che hai salvato per quella truppa in particolare.';
content_1+='<br><b><font color=blue>2. Più di...</font></b>: selezionando questa opzione lo script inserirà tutte le truppe disponibili della unità selezionata se le truppe disponibili sono maggiori o uguali al numero salvato per quel particolare tipo di truppa'
content_1+='<br><b><font color=blue>3. Truppe esatte</font></b>: selezionanto questa opzione lo script inserirà il numero esatto di quella particolare truppa se ci sono unità disponibili';
content_1+='<hr><b><font color=maroon><u>Inserimento Coordinate</u></font></b><br><br> Il '+change1+' Script inserirà i villaggi selezionati in modo consecutivo seguendo l ordine con cui hai inserito le coordinate nel <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b>. Sarai informato ad ogni click sul numero dei villaggi correnti<br><br> Puoi aggiungere quante coordinate desideri nell opportuno campo di testo separandoli con uno <b>spazio</b> Es. \'500|500 450|450 600|600\'';
content_1+='<hr><b><font color=maroon><u>Scorciatoie e titoli script</u></font></b><br><br> Puoi definire la tua personale <font color=darkgreen><b>scorciatoia</b></font> per aprire il menu '+change1+' settaggi o cliccare il '+change1+' tasto. Nel campo di testo assegnato ad ogni scorciatoia puoi inserire qualunque carattere della tua tastiera (Es. \'B\' or \'c\') od ogni loro combinazione usando <b><font color=red>+</font></b> (Es. \'Ctrl+1\' or \'a+s+d\'). Evita di inserire numeri o caratteri usati come scorciatoia per altre funzioni (Es. \'m per la mappa\').';
content_1+='<br><br> Il <font color=darkgreen><b>titolo script</b></font> può essere usato per il tuo personale gusto e verrà applicato come un valore cookie al '+change1+' Script e al valore del tasto'+change1+'';
content_1+='<hr><b><font color=maroon><u>Inserisci le truppe solo se tutti i criteri sono soddisfatti</u></font></b><br><br>Questa opzione può essere applicata solo se la selezioni nei <b>'+tsalkapone_trans.general.off_8+'</b> nel <b><font color=darkmagenta>metodo di inserimento truppe</font></b>. Selezionando <b><font color=red>'+tsalkapone_trans.general.yes+'</font></b> le unità disponibili di ogni truppa deve avere un numero maggiore o uguale a quello specificato per ogni unità. Se non lo è, nessuna unità sarà inserita nel punto di raduno, indipendendemente da ogni altra configurazione';
content_1+='</div>';

var content_2 = '<div>';
content_2+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">'+change2+' Settaggi</font></u></center></h2><hr>';
content_2+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> Nella tabella di '+tsalkapone_trans.general.config+' puoi definire il <b>metodo</b> e il <b>numero</b> per ogni unità che lo script inserirà nel punto di raduno. Nota che ogni Configurazione Unità sarà applicata <b>SOLO</b> se selezioni <b>'+tsalkapone_trans.general.off_8+'</b> nel <b><font color=darkmagenta>metodo di inserimento truppe</font></b>.';
content_2+='<br><br>I metodi disponibili sono i seguenti:<br><b><font color=blue>1. Tutte le unità</font></b>: selezionando questa opzione lo script inserirà tutte le unità disponibili della unità selezionata indipendendemente dal numero che hai salvato per quella truppa in particolare.';
content_2+='<br><b><font color=blue>2. Più di...</font></b>: selezionando questa opzione lo script inserirà tutte le truppe disponibili della unità selezionata se le truppe disponibili sono maggiori o uguali al numero salvato per quel particolare tipo di truppa'
content_2+='<br><b><font color=blue>3. Truppe esatte</font></b>: selezionanto questa opzione lo script inserirà il numero esatto di quella particolare truppa se ci sono unità disponibili';
content_2+='<hr><b><font color=maroon><u>Inserimento Coordinate</u></font></b><br><br> Il '+change2+' Script inserirà i villaggi selezionati in modo consecutivo seguendo l ordine con cui hai inserito le coordinate nel <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b>. Sarai informato ad ogni click sul numero dei villaggi correnti<br><br> Puoi aggiungere quante coordinate desideri nell opportuno campo di testo separandoli con uno <b>spazio</b> Es. \'500|500 450|450 600|600\'';
content_2+='<hr><b><font color=maroon><u>Scorciatoie e titoli script</u></font></b><br><br> Puoi definire la tua personale <font color=darkgreen><b>scorciatoia</b></font> per aprire il menu '+change2+' settaggi o cliccare il '+change2+' tasto. Nel campo di testo assegnato ad ogni scorciatoia puoi inserire qualunque carattere della tua tastiera (Es. \'B\' or \'c\') od ogni loro combinazione usando <b><font color=red>+</font></b> (Es. \'Ctrl+1\' or \'a+s+d\'). Evita di inserire numeri o caratteri usati come scorciatoia per altre funzioni (Es. \'m per la mappa\').';
content_2+='<br><br> Il <font color=darkgreen><b>titolo script</b></font> può essere usato per il tuo personale gusto e verrà applicato come un valore cookie al '+change2+' Script e al valore del tasto'+change2+'';
content_2+='<hr><b><font color=maroon><u>Inserisci le truppe solo se tutti i criteri sono soddisfatti</u></font></b><br><br>Questa opzione può essere applicata solo se la selezioni nei <b>'+tsalkapone_trans.general.off_8+'</b> nel <b><font color=darkmagenta>metodo di inserimento truppe</font></b>. Selezionando <b><font color=red>'+tsalkapone_trans.general.yes+'</font></b> le unità disponibili di ogni truppa deve avere un numero maggiore o uguale a quello specificato per ogni unità. Se non lo è, nessuna unità sarà inserita nel punto di raduno, indipendendemente da ogni altra configurazione';
content_2+='</div>';

var content_3 = '<div>';
content_3+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">'+change3+' Settaggi</font></u></center></h2><hr>';
content_3+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> Nella tabella di '+tsalkapone_trans.general.config+' puoi definire il <b>metodo</b> e il <b>numero</b> per ogni unità che lo script inserirà nel punto di raduno. Nota che ogni Configurazione Unità sarà applicata <b>SOLO</b> se selezioni <b>'+tsalkapone_trans.general.off_8+'</b> nel <b><font color=darkmagenta>metodo di inserimento truppe</font></b>.';
content_3+='<br><br>I metodi disponibili sono i seguenti:<br><b><font color=blue>1. Tutte le unità</font></b>: selezionando questa opzione lo script inserirà tutte le unità disponibili della unità selezionata indipendendemente dal numero che hai salvato per quella truppa in particolare.';
content_3+='<br><b><font color=blue>2. Più di...</font></b>: selezionando questa opzione lo script inserirà tutte le truppe disponibili della unità selezionata se le truppe disponibili sono maggiori o uguali al numero salvato per quel particolare tipo di truppa'
content_3+='<br><b><font color=blue>3. Truppe esatte</font></b>: selezionanto questa opzione lo script inserirà il numero esatto di quella particolare truppa se ci sono unità disponibili';
content_3+='<hr><b><font color=maroon><u>Inserimento Coordinate</u></font></b><br><br> Il '+change3+' Script inserirà i villaggi selezionati in modo consecutivo seguendo l ordine con cui hai inserito le coordinate nel <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b>. Sarai informato ad ogni click sul numero dei villaggi correnti<br><br> Puoi aggiungere quante coordinate desideri nell opportuno campo di testo separandoli con uno <b>spazio</b> Es. \'500|500 450|450 600|600\'';
content_3+='<hr><b><font color=maroon><u>Scorciatoie e titoli script</u></font></b><br><br> Puoi definire la tua personale <font color=darkgreen><b>scorciatoia</b></font> per aprire il menu '+change3+' settaggi o cliccare il '+change3+' tasto. Nel campo di testo assegnato ad ogni scorciatoia puoi inserire qualunque carattere della tua tastiera (Es. \'B\' or \'c\') od ogni loro combinazione usando <b><font color=red>+</font></b> (Es. \'Ctrl+1\' or \'a+s+d\'). Evita di inserire numeri o caratteri usati come scorciatoia per altre funzioni (Es. \'m per la mappa\').';
content_3+='<br><br> Il <font color=darkgreen><b>titolo script</b></font> può essere usato per il tuo personale gusto e verrà applicato come un valore cookie al '+change3+' Script e al valore del tasto'+change3+'';
content_3+='<hr><b><font color=maroon><u>Inserisci le truppe solo se tutti i criteri sono soddisfatti</u></font></b><br><br>Questa opzione può essere applicata solo se la selezioni nei <b>'+tsalkapone_trans.general.off_8+'</b> nel <b><font color=darkmagenta>metodo di inserimento truppe</font></b>. Selezionando <b><font color=red>'+tsalkapone_trans.general.yes+'</font></b> le unità disponibili di ogni truppa deve avere un numero maggiore o uguale a quello specificato per ogni unità. Se non lo è, nessuna unità sarà inserita nel punto di raduno, indipendendemente da ogni altra configurazione';
content_3+='</div>';

 var content_4 = '<div>';
content_4+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">'+change4+' Settaggi</font></u></center></h2><hr>';
content_4+='<b><font color=maroon><u>'+tsalkapone_trans.general.config+'</u></font></b><br><br> Nella tabella di '+tsalkapone_trans.general.config+' puoi definire il <b>metodo</b> e il <b>numero</b> per ogni unità che lo script inserirà nel punto di raduno. Nota che ogni Configurazione Unità sarà applicata <b>SOLO</b> se selezioni <b>'+tsalkapone_trans.general.off_8+'</b> nel <b><font color=darkmagenta>metodo di inserimento truppe</font></b>.';
content_4+='<br><br>I metodi disponibili sono i seguenti:<br><b><font color=blue>1. Tutte le unità</font></b>: selezionando questa opzione lo script inserirà tutte le unità disponibili della unità selezionata indipendendemente dal numero che hai salvato per quella truppa in particolare.';
content_4+='<br><b><font color=blue>2. Più di...</font></b>: selezionando questa opzione lo script inserirà tutte le truppe disponibili della unità selezionata se le truppe disponibili sono maggiori o uguali al numero salvato per quel particolare tipo di truppa'
content_4+='<br><b><font color=blue>3. Truppe esatte</font></b>: selezionanto questa opzione lo script inserirà il numero esatto di quella particolare truppa se ci sono unità disponibili';
content_4+='<hr><b><font color=maroon><u>Inserimento Coordinate</u></font></b><br><br> Il '+change4+' Script inserirà i villaggi selezionati in modo consecutivo seguendo l ordine con cui hai inserito le coordinate nel <b><font color=darkmagenta>'+tsalkapone_trans.general.coords+'</font></b>. Sarai informato ad ogni click sul numero dei villaggi correnti<br><br> Puoi aggiungere quante coordinate desideri nell opportuno campo di testo separandoli con uno <b>spazio</b> Es. \'500|500 450|450 600|600\'';
content_4+='<hr><b><font color=maroon><u>Scorciatoie e titoli script</u></font></b><br><br> Puoi definire la tua personale <font color=darkgreen><b>scorciatoia</b></font> per aprire il menu '+change4+' settaggi o cliccare il '+change4+' tasto. Nel campo di testo assegnato ad ogni scorciatoia puoi inserire qualunque carattere della tua tastiera (Es. \'B\' or \'c\') od ogni loro combinazione usando <b><font color=red>+</font></b> (Es. \'Ctrl+1\' or \'a+s+d\'). Evita di inserire numeri o caratteri usati come scorciatoia per altre funzioni (Es. \'m per la mappa\').';
content_4+='<br><br> Il <font color=darkgreen><b>titolo script</b></font> può essere usato per il tuo personale gusto e verrà applicato come un valore cookie al '+change4+' Script e al valore del tasto'+change4+'';
content_4+='<hr><b><font color=maroon><u>Inserisci le truppe solo se tutti i criteri sono soddisfatti</u></font></b><br><br>Questa opzione può essere applicata solo se la selezioni nei <b>'+tsalkapone_trans.general.off_8+'</b> nel <b><font color=darkmagenta>metodo di inserimento truppe</font></b>. Selezionando <b><font color=red>'+tsalkapone_trans.general.yes+'</font></b> le unità disponibili di ogni truppa deve avere un numero maggiore o uguale a quello specificato per ogni unità. Se non lo è, nessuna unità sarà inserita nel punto di raduno, indipendendemente da ogni altra configurazione';
content_4+='</div>';

var infocontent_1 = '<div>';
infocontent_1+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Nuke. Metodo di inserimento</font></u></center></h2><hr>';
infocontent_1+='<b><font color=maroon><u>Metodi inserimento truppe</u></font></b><br><br>';
infocontent_1+='The available methods are the following:<br><font color=blue><b>1. '+tsalkapone_trans.general.off_1+'</b></font>: Lo script inserirà tutte le truppe disponibili nel punto di raduno';
infocontent_1+='<br><br><font color=blue><b>2. '+tsalkapone_trans.general.off_2+'</b></font>: Lo script inserirà tutte le unità disponibili delle seguenti truppe: asce, cav. leggera, arcieri a cavallo, ariete, esploratori.';
infocontent_1+='<br><br><font color=blue><b>3. '+tsalkapone_trans.general.off_3+'</b></font>:<br>Lo script inserirà tutte le unità disponibili delle seguenti truppe: asce, cav. leggera, arcier a cavallo, ariete, cav. pesante, esploratori.';
infocontent_1+='<br><br><font color=blue><b>4. '+tsalkapone_trans.general.off_4+'</b></font>:<br>Lo script inserirà tutte le unità disponibili delle seguenti truppe: asce, cav. leggera, arcieri a cavallo, esploratori';
infocontent_1+='<br><br><font color=blue><b>5. '+tsalkapone_trans.general.off_5+'</b></font>: Lo script inserirà tutte le unità disponibili delle seguenti truppe: asce, cav. leggera, arcieri a cavallo, arieti.';
infocontent_1+='<br><br><font color=blue><b>5. '+tsalkapone_trans.general.off_6+'</b></font>: Lo script inserirà tutte le unità disponibili delle seguenti truppe: cav. leggera';
infocontent_1+='<br><br><font color=blue><b>6. '+tsalkapone_trans.general.off_7+'</b></font>: Lo script inserirà tutte le unità disponibili delle seguenti truppe: cav. leggera, arcieri a cavallo, cav. pesante';
infocontent_1+='<br><br><font color=blue><b>7. '+tsalkapone_trans.general.off_8+'</b></font>: Lo script userà i valori specificati nella tabella dei <b><font color=maroon>'+tsalkapone_trans.general.config+'</font></b>.';
 infocontent_1+='</div>';
        var infocontent_2 = '<div>';
infocontent_2+='<h2 class="popup_box_header tsalkaponefont" style="font-family: Comic Sans MS;"><center><u><font color="red">Support. Inserting Methods</font></u></center></h2><hr>';
infocontent_2+='<b><font color=maroon><u>Inserting troops methods</u></font></b><br><br>';
infocontent_2+='The available methods are the following:<br><font color=blue><b>1. '+tsalkapone_trans.general.off_1+'</b></font>: Script will enter all the available troops in the rally points.';
infocontent_2+='<br><br><font color=blue><b>2. '+tsalkapone_trans.general.def_1+'</b></font>: The script will enter all the available units of the following unit types: spear, sword, archer, heavy cavalry, spy.';
infocontent_2+='<br><br><font color=blue><b>3. '+tsalkapone_trans.general.def_2+'</b></font>:<br>The script will enter all the available units of the following unit types: spear, sword, archer, heavy cavalry.';
infocontent_2+='<br><br><font color=blue><b>4. '+tsalkapone_trans.general.def_3+'</b></font>:<br>The script will enter all the available units of the following unit types: spear, sword, archer.';
infocontent_2+='<br><br><font color=blue><b>5. '+tsalkapone_trans.general.def_4+'</b></font>: The script will enter all the available units of the following unit types: heavy cavalry.';
infocontent_2+='<br><br><font color=blue><b>6. '+tsalkapone_trans.general.def_5+'</b></font>: The script will enter all the available units of the following unit types: spear, archer.';
infocontent_2+='<br><br><font color=blue><b>7. '+tsalkapone_trans.general.def_6+'</b></font>: The script will enter all the available units of the following unit types: spear, archer.';
infocontent_2+='<br><br><font color=blue><b>8. '+tsalkapone_trans.general.def_7+'</b></font>: The script will enter all the available units of the following unit types: catapults.';
infocontent_2+='<br><br><font color=blue><b>9. '+tsalkapone_trans.general.def_8+'</b></font>: The script will enter all the available units of the following unit types: spy.';
infocontent_2+='<br><br><font color=blue><b>10. '+tsalkapone_trans.general.off_8+'</b></font>: The script will use the values specified in <b><font color=maroon>'+tsalkapone_trans.general.config+'</font></b>.';
 infocontent_2+='</div>';
}
        var lang_img='';
        if (lang=="greek") {lang_img ='<img title="Ελληνικά" style="cursor:help;" height="20px" width="30px" src="https://dl.dropboxusercontent.com/s/ivyojb6w9cb9pem/flag_greece.gif">';}
        else if (lang=="english") {lang_img ='<img height="20px" style="cursor:help;" title="English/American" width="30px" src="https://dl.dropboxusercontent.com/s/y6tn9ko0g8k2xfx/flagenglezicon.gif">';}
        else if (lang=="italian") {lang_img ='<img height="20px" style="cursor:help;" title="Italian" width="30px" src="https://dl.dropboxusercontent.com/s/ho5ks4i0z7u5bpn/flag_italiano.gif">';}


 var menu="<span id='clickcounts'></span><div><table class='vis' id=tsalkaponemagicscripttable width='100%'><tr><th colspan='4'><font color='darkgreen' style='font-family:Comic Sans MS' size='3'><b><center>Tsalkapone "+tsalkapone_trans.general.menu+"</center></b></th>";
menu+='<th><font style="font-family: \'Arial Black\', Gadget, sans-serif;"><span id="openfilter1"><input type="button" value="'+tsalkapone_trans.buttons.lang_open+'" id="openfilterbut1" class="btn tsalbutton"></span><span id="closefilter1" style="display:none"><input class="btn tsalbutton" type="button" value="'+tsalkapone_trans.buttons.lang_close+'" id="closefilterbut1"></span></th></tr>';
    menu+='<tr><td style="min-width: 80px"><img id=nukeinfo src="/graphic/questionmark.png" class="tooltip-delayed" style="height:15px; width:15px; cursor:pointer" title="'+tsalkapone_trans.general.qmark+'">&emsp;<a href="javascript:void(0);" id="Tsalnuke">'+tsalkapone_trans.general.nuke_settings+'</a></td>';
menu+='<td  style="min-width: 80px"><img id=farminfo src="/graphic/questionmark.png" class="tooltip-delayed" style="height:15px; width:15px; cursor:pointer" title="'+tsalkapone_trans.general.qmark+'">&emsp;<a href="javascript:void(0);" id="Tsalfarming">'+tsalkapone_trans.general.farming_settings+'</a></td>';
    menu+='<td  style="min-width: 80px"><img id=suppinfo src="/graphic/questionmark.png" class="tooltip-delayed" style="height:15px; width:15px; cursor:pointer" title="'+tsalkapone_trans.general.qmark+'">&emsp;<a href="javascript:void(0);" id="Tsalsupport">'+tsalkapone_trans.general.support_settings+'</a></td>';
    menu+='<td  style="min-width: 80px"><img id=fakeinfo src="/graphic/questionmark.png" class="tooltip-delayed" style="height:15px; width:15px; cursor:pointer" title="'+tsalkapone_trans.general.qmark+'">&emsp;<a href="javascript:void(0);" id="Tsalfakes">'+tsalkapone_trans.general.fake_settings+'</a></td>';
menu+='<td>';
menu+='<span id="selectedone"><font color="maroon"><b>'+tsalkapone_trans.general.selected_one+':</b></font> '+lang_img+'</span><span id="columnfilter1" style="display:none" class="vis"><font size="2">';
menu+='<br><br><center><font color="blue"><b><u>'+tsalkapone_trans.general.available+'</u></b></font></center><input type="radio"  name="language" value="greek" id="greek_lang" ><img title="Greek" style="cursor:help;" height="20px" width="30px" src="https://dl.dropboxusercontent.com/s/ivyojb6w9cb9pem/flag_greece.gif"><br>';
menu+='<input type="radio"  name="language" value="english" id="english_lang" checked><img height="20px" style="cursor:help;" title="English/American" width="30px" src="https://dl.dropboxusercontent.com/s/y6tn9ko0g8k2xfx/flagenglezicon.gif"><br>';
menu+='<input type="radio"  name="language" value="italian" id="italian_lang" checked><img height="20px" style="cursor:help;" title="Italian \n\nBy sndb & im lovin it" width="30px" src="https://dl.dropboxusercontent.com/s/ho5ks4i0z7u5bpn/flag_italiano.gif"><br>';
menu+='</span></font></td>';
        menu+='</tr></table></div>';
    menu+='<span id=tsalepilogi></span>';
 menu += "</th></tr></table></div><hr><br>";
menu+='<div class="target-select clearfix vis float_left"><h4><font color=maroon>Tsalkapone. '+tsalkapone_trans.general.button_list+'</font></h4><table class="vis" style="width: 100%"><tbody><tr><td>';
menu+='<span class="tsaltooltip"><input type="button" id="Tsalactivate1" class="attack btn tsalbutton btn tsalbutton-attack btn tsalbutton-target-action" value="Nuke Script"><span class="tsalinfo" >'+tsalkapone_trans.buttons.nuke_click+'</span></span>';
    menu+='<span class="tsaltooltip"><input type="button" id="Tsalactivate3" class="attack btn tsalbutton btn tsalbutton-attack btn tsalbutton-target-action" value="Farming Script"><span class="tsalinfo" >'+tsalkapone_trans.buttons.farming_click+'</span></span>';
menu+='<span class="tsaltooltip"><input type="button" id="Tsalactivate2" class="support btn tsalbutton btn tsalbutton-support btn tsalbutton-target-action" value="Support Script"><span class="tsalinfo" >'+tsalkapone_trans.buttons.support_click+'</span></span>';
    menu+='<span class="tsaltooltip"><input type="button" id="Tsalactivate4" class="btn tsalbutton btn tsalbutton-recruit" value="Fake Script"><span class="tsalinfo" >'+tsalkapone_trans.buttons.fake_click+'</span></span>';
    menu+="&emsp;<span class='tsaltooltip'><a onclick='Timing.pause();'><img class='tooltip' id=Tsalpausixronou1 src='https://dl.dropboxusercontent.com/s/eonrw4xocuy22xq/Tsalkapone_time.GIF' style='height: 20px; border: 20; top: +3px; position: relative; left: -1px'></a><span class='tsalinfo' >"+tsalkapone_trans.buttons.time_pause+"</span></span>";
menu+='</tr></tbody></table></div><br><br><br><br><br><hr>';

    if (tsalrallypointpage && !document.getElementById('tsalkaponemagicscripttable')) {
$("#command-data-form").prepend(menu);

		/*==== register ====*/
var script = {
	scriptname: 'Commander Script',
	version: '1.0',
	author: 'Tsalkapone',
	email: 'tsalkapone@hotmail.com',
	broken: false
};
$.post(ScriptAPI.url,script);

 }

        else { {UI.SuccessMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.activated+'', 5000);}}

        if (get_lang == "greek") {document.getElementById('greek_lang').checked = true;}
      else  if (get_lang == "english") {document.getElementById('english_lang').checked = true; }
	  else  if (get_lang == "italian") {document.getElementById('italian_lang').checked = true; }
    Timing.pause();
         $("#english_lang").click(function(){
	localStorage.setItem("rally_point_script_lang","english");
location.reload();
    });
     $("#italian_lang").click(function(){
	localStorage.setItem("rally_point_script_lang","italian");
location.reload();
    });

      $("#greek_lang").click(function(){
	localStorage.setItem("rally_point_script_lang","greek");
location.reload();
    });

    $("#openfilterbut1").click(function(){
        document.getElementById('columnfilter1').style.display="";
		document.getElementById('openfilter1').style.display="none";
		document.getElementById('closefilter1').style.display="";
    });
    $("#closefilterbut1").click(function(){
        document.getElementById('columnfilter1').style.display="none";
		document.getElementById('openfilter1').style.display="";
		document.getElementById('closefilter1').style.display="none";
    });
        var Dialog1;(function(){'use strict';Dialog1={MAX_WIDTH:1200,closeCallback:null,show:function(id,content,closeCallback,options){options=$.extend({class_name:'',close_from_fader:true},options);this.closeCallback=closeCallback;var fullscreenElement=document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement,container=fullscreenElement||'body',$container=$('.popup_box_container'),$box,$fader,$content,show_anim=false;if(!$container.length){show_anim=true;$container=$('<div class="popup_box_container" />');$box=$('<div class="popup_box" />').attr('id','popup_box_'+id).addClass(options.class_name).data('name',id).appendTo($container);$fader=$('<div class="fader" />').appendTo($container);$content=$('<div class="popup_box_content" />').appendTo($box);$container.appendTo($(container))}else{$box=$container.find('.popup_box');if($box.data('name')!==id){Dialog1.close();Dialog1.show(id,content,closeCallback,options);return};$content=$container.find('.popup_box_content');$box.css('width','auto')};$content.html(content);var height_buffer=125;if($(window).width()<500||$(window).height()<$content.height()+height_buffer){$box.addClass('mobile');$('.popup_box_content').css({'max-height':$(window).height()-(height_buffer/2)+'px'})};var border_width;if(typeof window.getComputedStyle==='function'){border_width=parseInt(getComputedStyle($box[0],null).borderLeftWidth)}else border_width=parseInt($box.css('border-left-width'));var min_width=200,width=Math.min(this.MAX_WIDTH,$content.width(),$(window).width()-border_width);if(width<min_width)width=min_width;if(!Modernizr.borderimage)width+=20;$box.css('width',width+'px');var hotkey_hint=(!mobile&&!mobiledevice&&HotKeys.enabled)?' :: ΟΟΞ½ΟΟΞΌΞ΅ΟΟΞ· ΟΞ»Ξ·ΞΊΟΟΞΏΞ»ΞΏΞ³Ξ―ΞΏΟ: <b>Esc</b>':'',tooltip_class=(!mobile&&!mobiledevice)?'tooltip-delayed':'',$close=$('<a class="popup_box_close '+tooltip_class+'" title="ΞΞ»Ξ΅Ξ―ΟΞ΅'+hotkey_hint+'" href="#">&nbsp;</a>').prependTo($content);UI.ToolTip($close,{delay:400});var close_elements=options.close_from_fader?'.fader, .popup_box_close, .popup_closer':'.popup_box_close, .popup_closer';$container.on('click',close_elements,function(){Dialog1.close(true);return false});if(show_anim)setTimeout(function(){$box.addClass('show')},50);UI.init();UnitPopup.init();setTimeout(QuestArrows.init,500)},close:function(by_user){$('.popup_box_container').remove();if(Dialog1.closeCallback)Dialog1.closeCallback(by_user);inlinePopupClose();$('.popup_style').hide();QuestArrows.init();return false},fetch:function(name,screen,get_params,callback,Dialog1_options,closeCallback){TribalWars.get(screen,get_params,function(data){Dialog1.show(name,data.Dialog1,closeCallback,Dialog1_options);if(callback)callback()})}}})();
    $("#Tsalpausixronou1").mouseover(function () {
                                document.getElementById("Tsalpausixronou1").style.border = "1px solid blue";
                               document.getElementById("Tsalpausixronou1").style.cursor = "pointer";});
                            $("#Tsalpausixronou1").mouseout(function () {
                                document.getElementById("Tsalpausixronou1").style.border = "0px"; });
    $("#nukeinfo").mouseover(function () {
                                document.getElementById("nukeinfo").style.border = "1px solid blue";
                               document.getElementById("nukeinfo").style.cursor = "pointer";});
                            $("#nukeinfo").mouseout(function () {
                                document.getElementById("nukeinfo").style.border = "0px"; });
    $("#nukeinfo").click(function () {
Dialog1.show('tsalkapone_nukeinfo', content_1);
    });
        $("#suppinfo").mouseover(function () {
                                document.getElementById("suppinfo").style.border = "1px solid blue";
                               document.getElementById("suppinfo").style.cursor = "pointer";});
                            $("#suppinfo").mouseout(function () {
                                document.getElementById("suppinfo").style.border = "0px"; });
    $("#suppinfo").click(function () {
Dialog1.show('tsalkapone_suppinfo', content_2);
    });
         $("#farminfo").mouseover(function () {
                                document.getElementById("farminfo").style.border = "1px solid blue";
                               document.getElementById("farminfo").style.cursor = "pointer";});
                            $("#farminfo").mouseout(function () {
                                document.getElementById("farminfo").style.border = "0px"; });
    $("#farminfo").click(function () {
Dialog1.show('tsalkapone_farminfo', content_3);
    });
        $("#fakeinfo").mouseover(function () {
                                document.getElementById("fakeinfo").style.border = "1px solid blue";
                               document.getElementById("fakeinfo").style.cursor = "pointer";});
                            $("#fakeinfo").mouseout(function () {
                                document.getElementById("fakeinfo").style.border = "0px"; });
    $("#fakeinfo").click(function () {
Dialog1.show('tsalkapone_fakeinfo', content_4);
    });

    var tsalname1 = document.getElementById('Tsalactivate1');
    if (localStorage.tsalname1) { tsalname1.value = localStorage.getItem('tsalname1');}
    var tsalkey1 = localStorage.getItem('tsalkey1');
    var tsalakey1 = localStorage.getItem('tsalakey1');
 shortcut.add(""+tsalkey1+"",function() {
	$('#Tsalnuke').click();
});
    shortcut.add(""+tsalakey1+"",function() {
	$('#Tsalactivate1').click();
});

    var tsalname2 = document.getElementById('Tsalactivate2');
    if (localStorage.tsalname2) { tsalname2.value = localStorage.getItem('tsalname2');}
    var tsalkey2 = localStorage.getItem('tsalkey2');
    var tsalakey2 = localStorage.getItem('tsalakey2');
 shortcut.add(""+tsalkey2+"",function() {
	$('#Tsalsupport').click();
});
    shortcut.add(""+tsalakey2+"",function() {
	$('#Tsalactivate2').click();
});
    var tsalname3 = document.getElementById('Tsalactivate3');
    if (localStorage.tsalname3) { tsalname3.value = localStorage.getItem('tsalname3');}
    var tsalkey3 = localStorage.getItem('tsalkey3');
    var tsalakey3 = localStorage.getItem('tsalakey3');
 shortcut.add(""+tsalkey3+"",function() {
	$('#Tsalfarming').click();
});
    shortcut.add(""+tsalakey3+"",function() {
	$('#Tsalactivate3').click();
});
     var tsalname4 = document.getElementById('Tsalactivate4');
    if (localStorage.tsalname4) { tsalname4.value = localStorage.getItem('tsalname4');}
    var tsalkey4 = localStorage.getItem('tsalkey4');
    var tsalakey4 = localStorage.getItem('tsalakey4');
 shortcut.add(""+tsalkey4+"",function() {
	$('#Tsalfakes').click();
});
    shortcut.add(""+tsalakey4+"",function() {
	$('#Tsalactivate4').click();
});
    $("#Tsalactivate4").click(function(){
var tsaleidos = localStorage.getItem("tsalscriptmethod4");
      var δόρυ = localStorage.getItem("spear4");
       var ξίφος = localStorage.getItem('sword4');
       var τσεκούρι = localStorage.getItem('axe4');
       var Tsalkapone_ανιχνευτές = localStorage.getItem('spy4');
       var ελαφρύ = localStorage.getItem('light4');
       var βαρύ = localStorage.getItem('heavy4');
       var κριός = localStorage.getItem('ram4');
       var καταπέλτης = localStorage.getItem('cat4');
       var τοξότης = localStorage.getItem('archer4');
       var έφιππος = localStorage.getItem('marcher4');


         if (localStorage.tsalname4) {    var scripttitle = ""+localStorage.getItem('tsalname4')+"";} else { scripttitle = "Fake Script";}
    var Tsalkapone_εισαγωγή_μονάδων={ram:κριός,catapult:καταπέλτης,sword:ξίφος,spear:δόρυ,axe:τσεκούρι,archer:τοξότης,heavy:βαρύ,marcher:έφιππος,light:ελαφρύ};
var config={Tsalkapone_στόχος:'Όνομα στόχου',Tsalkapone_πλήθος_επαναλήψεων:1,Tsalkapone_cookieID:'tsalfakescript'};
var tsalcontentid='tsalkapone_fake_content_value';var fakeonoma=''+scripttitle+'';
 var Tsalkapone_στόχοι = ""+localStorage.getItem('tsalcoords4')+"";
        var Tsalkapone_συντεταγμένες = ""+localStorage.getItem('tsalcoords4')+"";
  if(!localStorage.tsalscriptmethod4)
  {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.values+'', 5000);}
 else {
     if (localStorage.clickcount4) {
    localStorage.clickcount4 = Number(localStorage.clickcount4) + 1;
} else {
    localStorage.clickcount4 = 1;
}
 var tsalkaponehits ="<font color=red><b><i>"+scripttitle+". "+tsalkapone_trans.general.counting+":</i></b></font> <font color=darkgreen><b>" +localStorage.clickcount4 + "</b></font>";
 document.getElementById('clickcounts').innerHTML=tsalkaponehits;
if (document.getElementById('units_entry_all_spear')) {   var spear = parseInt( $('#units_entry_all_spear').text().replace(/[^0-9]/gi, ''));} else { spear = 0;}
 if (document.getElementById('units_entry_all_axe')) {   var axe = parseInt( $('#units_entry_all_axe').text().replace(/[^0-9]/gi, ''));} else { axe = 0;}
if (document.getElementById('units_entry_all_sword')) {   var sword = parseInt( $('#units_entry_all_sword').text().replace(/[^0-9]/gi, ''));} else { sword = 0;}
if (document.getElementById('units_entry_all_light')) {   var light = parseInt( $('#units_entry_all_light').text().replace(/[^0-9]/gi, ''));} else { light = 0;}
if (document.getElementById('units_entry_all_spy')) {   var spy = parseInt( $('#units_entry_all_spy').text().replace(/[^0-9]/gi, ''));} else { spy = 0;}
if (document.getElementById('units_entry_all_heavy')) {   var heavy = parseInt( $('#units_entry_all_heavy').text().replace(/[^0-9]/gi, ''));} else { heavy = 0;}
if (document.getElementById('units_entry_all_ram')) {   var ram = parseInt( $('#units_entry_all_ram').text().replace(/[^0-9]/gi, ''));} else { ram = 0;}
if (document.getElementById('units_entry_all_catapult')) {   var catapult = parseInt( $('#units_entry_all_catapult').text().replace(/[^0-9]/gi, ''));} else { catapult = 0;}
 if (document.getElementById('unit_input_archer')) {
if (document.getElementById('units_entry_all_archer')) { var archer = parseInt( $('#units_entry_all_archer').text().replace(/[^0-9]/gi, '')); }else { archer = 0;}
if (document.getElementById('units_entry_all_marcher')) { var marcher = parseInt( $('#units_entry_all_marcher').text().replace(/[^0-9]/gi, ''));} else { marcher = 0;}
}
        var d=document;
    if (tsaleidos == "Consecutive & Selective order") {
if(Tsalkapone_στόχοι.replace(/^\s\s*/,'').replace(/\s\s*$/,'')===''){UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.coords+'', 5000);}
                                var coords=Tsalkapone_στόχοι.split(' ');
   function escapeStr(text){var specials=['/','.',',','~','`','@','#','%','-','_','*','+','?','|','$','=',':','!','^','<','>','(',')','[',']','{','}','\\'];
  var sRE=new RegExp('(\\'+specials.join('|\\')+')','g');return text.replace(sRE,'\\$1');}
 function zeroPad(number,length)
{var n=number.toString();while(n.length<length){n='0'+n;}return n;}
function fnWriteCookie(index)
{var cookie_date=new Date(2099,11,11);
 eleDoc.cookie=vWorld+'$'+config.Tsalkapone_στόχος+'$'+config.Tsalkapone_cookieID+'='+(index+1)+';expires='+cookie_date.toGMTString();}
function fnAssignTsalkapone_μονάδες(index,isManualReset)
{if((index<0)||(index>=coords.length)){index=0;if(eleDoc.fakeSequence==1){UI.ErrorMessage('<span id=tsalkaponelastsyn><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.last+'', 5000);}}
 document.getElementById('fake1_Tsalkapone').selectedIndex=index;
 var villa=coords[index].split('|');
var tsalinput2 = document.getElementsByClassName("target-input-field target-input-autocomplete ui-autocomplete-input");
 tsalinput2[0].value = coords[index];
 if(!isManualReset&&(eleDoc.fakeSequence<config.Tsalkapone_πλήθος_επαναλήψεων)){eleDoc.fakeSequence++;}
 else{eleDoc.fakeSequence=(isManualReset?2:1);fnWriteCookie(isManualReset?index-1:index);}
 var eleForm=document.forms[0];
 var tsalx = $("#place_target");
 tsalx.value=coords[jj];
 eleForm.x.value=villa[0];
 eleForm.y.value=villa[1];
 var count;if(Tsalkapone_ανιχνευτές>0)
 {count=parseInt(eleForm.spy.nextSibling.nextSibling.innerHTML.match(/\d+/));
  if(count>0)
  {eleForm.spy.value=Math.min(Tsalkapone_ανιχνευτές,count);}}
 for(var Tsalkapone in Tsalkapone_εισαγωγή_μονάδων){if(Tsalkapone_εισαγωγή_μονάδων.hasOwnProperty(Tsalkapone))
 {if((Tsalkapone_εισαγωγή_μονάδων[Tsalkapone]>0)&&(typeof(eleForm[Tsalkapone])!="undefined"))
 {count=parseInt(eleForm[Tsalkapone].nextSibling.nextSibling.innerHTML.match(/\d+/));
  if(count>0){eleForm[Tsalkapone].value=Math.min(Tsalkapone_εισαγωγή_μονάδων[Tsalkapone],count);break;}}}}}
   try{var eleDoc=window.document;
  if(typeof(eleDoc.fakeSequence)=='undefined'){eleDoc.fakeSequence=1;}
  var scrape,vScreen=(scrape=eleDoc.URL.match(/\&screen=(\w+)/i))?scrape[1]:null;
 var vWorld=(scrape=eleDoc.URL.match(/\/\/(\w+)\./i))?scrape[1]:null;
   var village=eleDoc.getElementsByTagName('title')[0].innerHTML.match(/\(\d+\|\d+\)/);
 if(vScreen=='place'){var index=0;
var twCookie=eleDoc.cookie.match('[^|;]s?'+escapeStr(vWorld+'$'+config.Tsalkapone_στόχος+'$'+config.Tsalkapone_cookieID+'=')+'([^;]*)[;|$]');
 if(twCookie){index=parseInt(twCookie[1],10);}
 if(!eleDoc.getElementById('fake1_Tsalkapone'))
 {var eleInputs=eleDoc.getElementsByTagName('input');
  if(eleInputs)
  {for(var ii=0;ii<eleInputs.length;ii++)
  {if(eleInputs[ii].name=='support')
  {var optionList='';
   for(var jj=0;jj<coords.length;jj++)
   {optionList+='<option>'+zeroPad(jj+1,4)+':  '+coords[jj]+' </option>';}
   eleInputs[ii].parentNode.parentNode.innerHTML+='<TD rowspan="2"><div id="fakes"><table class="main"><tr><td id="'+tsalcontentid+'"><span style="font-weight:bold"><font color=darkgreen>'+tsalkapone_trans.notes.list+' ~ <font color=red>'+fakeonoma+'</font> :</font></span><select id="fake1_Tsalkapone" name="fake1_Tsalkapone" size="1" onchange="fnAssignTsalkapone_μονάδες(this.selectedIndex,true);">'+optionList+'</select><span style="font-weight:100;font-style:italic;text-decoration:none;font-size:x-normal;"><a href="https://forum.tribalwars.net/index.php?members/tsalkapone.114063/" target="_blank"> '+tsalkapone_trans.notes.creator+' Tsalkapone</a></span></td></tr></table></div></TD>';break;}}}}
                      fnAssignTsalkapone_μονάδες(index,false);}
       else{throw('Tsalkapone. Script επιλεκτικών fake επιθέσεων \n\n Το συγκεκριμένο script ενεργοποιείται από το Μέρος Συγκέντρωσης');}void(0);}catch(objErr){alert(objErr);};



 }

    else if (tsaleidos == "Random order") {
      var doc=document;
url=document.URL;
if(url.indexOf('screen=place')==-1)alert('Tsalkapone. Fake script v.2.0 \n  Αποστολή fake επιθέσεων με τις διαθέσιμες μονάδες\n\n Το συγκεκριμένο script ενεργοποιείται από το Μέρος Συγκέντρωσης');
 else  {function fnFillRallyPoint1(){var win=(window.frames.length>0)?window.main:window;
var eleForm=document.forms[0];
var coord=Tsalkapone_συντεταγμένες.split(' ');
var coordSplit=coord[Math.floor(Math.random()*coord.length)].match(/(\d+)\|(\d+)/);
eleForm.x.value=coordSplit[1];eleForm.y.value=coordSplit[2];win.$("input[class=unitsInput]").attr("value","0");
var count;
if(Tsalkapone_ανιχνευτές>0){count=parseInt(eleForm.spy.nextSibling.nextSibling.innerHTML.match(/\d+/));
if(count>0){eleForm.spy.value=Math.min(Tsalkapone_ανιχνευτές,count);}}
for(var Tsalkapone in Tsalkapone_εισαγωγή_μονάδων)
{if(Tsalkapone_εισαγωγή_μονάδων.hasOwnProperty(Tsalkapone))
{if((Tsalkapone_εισαγωγή_μονάδων[Tsalkapone]>0)&&(typeof(eleForm[Tsalkapone])!="undefined"))
{count=parseInt(eleForm[Tsalkapone].nextSibling.nextSibling.innerHTML.match(/\d+/));
if(count>0){eleForm[Tsalkapone].value=Math.min(Tsalkapone_εισαγωγή_μονάδων[Tsalkapone],count);break;}}}}}fnFillRallyPoint1();};


    }

 }});



    $("#Tsalfakes").click(function () {
      document.getElementById('tsalepilogi').innerHTML = tsalperiexomeno4;

if (localStorage.tsalscriptmethod4) {document.getElementById('tsalscriptmethod4').value = localStorage.getItem("tsalscriptmethod4");}else { document.getElementById('tsalscriptmethod4').value ="Random order";}
if (localStorage.tsalcoords4) {document.getElementById('tsalcoords4').value = localStorage.getItem("tsalcoords4");}else { document.getElementById('tsalcoords4').value ="";}
        if (localStorage.tsalkey4) {document.getElementById('tsalkey4').value = localStorage.getItem("tsalkey4");}else { document.getElementById('tsalkey4').value ="";}
if (localStorage.tsalakey4) {document.getElementById('tsalakey4').value = localStorage.getItem("tsalakey4");}else { document.getElementById('tsalakey4').value ="";}
    if (localStorage.tsalname4) {document.getElementById('tsalname4').value = localStorage.getItem("tsalname4");}else { document.getElementById('tsalname4').value ="Fake Script";}
      if (localStorage.spear4 !==null) {
   document.getElementById('spear4').value = localStorage.getItem('spear4');
   document.getElementById('spy4').value = localStorage.getItem('spy4');
   document.getElementById('sword4').value = localStorage.getItem('sword4');
document.getElementById('axe4').value = localStorage.getItem('axe4');
document.getElementById('archer4').value = localStorage.getItem('archer4');
document.getElementById('light4').value = localStorage.getItem('light4');
document.getElementById('heavy4').value = localStorage.getItem('heavy4');
document.getElementById('marcher4').value = localStorage.getItem('marcher4');
document.getElementById('ram4').value = localStorage.getItem('ram4');
document.getElementById('cat4').value = localStorage.getItem('cat4');
      }
        $("#Tsalcount4").click(function() {
localStorage.setItem('clickcount4',0);
 UI.SuccessMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.counts+'', 5000);

       });
        $("#Tsalhide").click(function() {
             document.getElementById('tsalepilogi').innerHTML ="";
              $("#Tsalnuke").removeClass("tsalselected");
         $("#Tsalsupport").removeClass("tsalselected");
         $("#Tsalfarming").removeClass("tsalselected");
        $("#Tsalfakes").removeClass("tsalselected");
        });
        $("#Tsalreset4").click(function() {

localStorage.removeItem("tsalscriptmethod4");
            localStorage.removeItem("tsalcoords4");
             localStorage.removeItem("tsalname4");
             localStorage.removeItem("tsalkey4");
 localStorage.removeItem("tsalakey4");
    localStorage.removeItem("spear4");
    localStorage.removeItem("sword4");
    localStorage.removeItem("axe4");
    localStorage.removeItem("archer4");
    localStorage.removeItem("spy4");
    localStorage.removeItem("light4");
    localStorage.removeItem("heavy4");
    localStorage.removeItem("marcher4");
    localStorage.removeItem("ram4");
    localStorage.removeItem("cat4");
            UI.SuccessMessage('<span id=tsalkaponesuccesssave><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.reset_all+'.', 3000);
    setTimeout(function(){ location.reload(); }, 3000);
            });
        $("#Tsalsave4").click(function() {
            var tsalscriptmethod4 = document.getElementById('tsalscriptmethod4');
            var tsalakey4 = document.getElementById('tsalakey4');
var tsalkey4 = document.getElementById('tsalkey4');
            var tsalcoords4 = document.getElementById('tsalcoords4');
            var tsalname4 = document.getElementById('tsalname4');
                var spear4 = document.getElementById('spear4');
 var sword4 = document.getElementById('sword4');
var axe4 = document.getElementById('axe4');
var archer4 = document.getElementById('archer4');
var spy4 = document.getElementById('spy4');
 var light4 = document.getElementById('light4');
var heavy4 = document.getElementById('heavy4');
var marcher4 = document.getElementById('marcher4');
var ram4 = document.getElementById('ram4');
var cat4 = document.getElementById('cat4');

localStorage.setItem("tsalscriptmethod4", tsalscriptmethod4.value);
            localStorage.setItem("tsalcoords4", tsalcoords4.value);
             localStorage.setItem("tsalname4", tsalname4.value);
             localStorage.setItem("tsalkey4", tsalkey4.value);
;
 localStorage.setItem("tsalakey4", tsalakey4.value);
    localStorage.setItem("spear4", spear4.value);
    localStorage.setItem("sword4", sword4.value);
    localStorage.setItem("axe4", axe4.value);
    localStorage.setItem("archer4", archer4.value);
    localStorage.setItem("spy4",spy4.value);
    localStorage.setItem("light4", light4.value);
    localStorage.setItem("heavy4", heavy4.value);
    localStorage.setItem("marcher4", marcher4.value);
    localStorage.setItem("ram4", ram4.value);
    localStorage.setItem("cat4", cat4.value);
 UI.SuccessMessage('<span id=tsalkaponesuccesssave><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.save+'', 3000);
    setTimeout(function(){ location.reload(); }, 3000);
    });
        $("#Tsalnuke").removeClass("tsalselected");
         $("#Tsalsupport").removeClass("tsalselected");
         $("#Tsalfarming").removeClass("tsalselected");
        $("#Tsalfakes").addClass("tsalselected");
    });

    $("#Tsalactivate1").click(function(){
           var mix = localStorage.getItem("tsalcriteria1");
           var scriptno = "tsalnuke1script";
          var tsaleidos = localStorage.getItem("tsalscriptmethod1");
      var δόρυ = localStorage.getItem("spear1");
       var ξίφος = localStorage.getItem('sword1');
       var τσεκούρι = localStorage.getItem('axe1');
       var ανιχνευτής = localStorage.getItem('spy1');
       var ελαφρύ = localStorage.getItem('light1');
       var βαρύ = localStorage.getItem('heavy1');
       var κριός = localStorage.getItem('ram1');
       var καταπέλτης = localStorage.getItem('cat1');
       var τοξότης = localStorage.getItem('archer1');
       var έφιππος = localStorage.getItem('marcher1');
       var spearall = localStorage.getItem('spear1sel');
       var swordall = localStorage.getItem('sword1sel');
var axeall = localStorage.getItem("axe1sel");
var spyall = localStorage.getItem('spy1sel');
var archerall = localStorage.getItem('archer1sel');
var marcherall = localStorage.getItem('marcher1sel');
var lightall = localStorage.getItem('light1sel');
var heavyall = localStorage.getItem('heavy1sel');
var ramall = localStorage.getItem('ram1sel');
var catapultall = localStorage.getItem('cat1sel');
         if (localStorage.tsalname1) {    var scripttitle = ""+localStorage.getItem('tsalname1')+"";} else { scripttitle = "Nuke Script";}
       var Tsalkapone_συντεταγμένες = ""+localStorage.getItem('tsalcoords1')+"";
  if(!localStorage.tsalscriptmethod1)
  {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.values+'', 5000);}
 else {
if (document.getElementById('units_entry_all_spear')) {   var spear = parseInt( $('#units_entry_all_spear').text().replace(/[^0-9]/gi, ''));} else { spear = 0;}
 if (document.getElementById('units_entry_all_axe')) {   var axe = parseInt( $('#units_entry_all_axe').text().replace(/[^0-9]/gi, ''));} else { axe = 0;}
if (document.getElementById('units_entry_all_sword')) {   var sword = parseInt( $('#units_entry_all_sword').text().replace(/[^0-9]/gi, ''));} else { sword = 0;}
if (document.getElementById('units_entry_all_light')) {   var light = parseInt( $('#units_entry_all_light').text().replace(/[^0-9]/gi, ''));} else { light = 0;}
if (document.getElementById('units_entry_all_spy')) {   var spy = parseInt( $('#units_entry_all_spy').text().replace(/[^0-9]/gi, ''));} else { spy = 0;}
if (document.getElementById('units_entry_all_heavy')) {   var heavy = parseInt( $('#units_entry_all_heavy').text().replace(/[^0-9]/gi, ''));} else { heavy = 0;}
if (document.getElementById('units_entry_all_ram')) {   var ram = parseInt( $('#units_entry_all_ram').text().replace(/[^0-9]/gi, ''));} else { ram = 0;}
if (document.getElementById('units_entry_all_catapult')) {   var catapult = parseInt( $('#units_entry_all_catapult').text().replace(/[^0-9]/gi, ''));} else { catapult = 0;}
 if (document.getElementById('unit_input_archer')) {
if (document.getElementById('units_entry_all_archer')) { var archer = parseInt( $('#units_entry_all_archer').text().replace(/[^0-9]/gi, '')); }else { archer = 0;}
if (document.getElementById('units_entry_all_marcher')) { var marcher = parseInt( $('#units_entry_all_marcher').text().replace(/[^0-9]/gi, ''));} else { marcher = 0;}
}
        var d=document;
     function tsalkapone_insert_troops() {

        if (spearall == "All units" && document.getElementById('units_entry_all_spear'))
  {d.forms[0].spear.value = spear;}
else if (spearall == "All more than" && spear > δόρυ) {  d.forms[0].spear.value = spear-δόρυ; }
else if (spearall == "Insert specific" && spear >= δόρυ) {   d.forms[0].spear.value = δόρυ; }
if (axeall == "All units" && document.getElementById('units_entry_all_axe'))
  {d.forms[0].axe.value= axe;}
else if (axeall == "All more than" && axe > τσεκούρι) {   d.forms[0].axe.value= axe-τσεκούρι; }
else if (axeall == "Insert specific" && axe >= τσεκούρι) {   d.forms[0].axe.value= τσεκούρι; }
if (swordall == "All units" && document.getElementById('units_entry_all_sword'))
  {d.forms[0].sword.value= sword;}
else if (swordall == "All more than" && sword > ξίφος) {   d.forms[0].sword.value= sword-ξίφος; }
else if (swordall == "Insert specific" && sword >= ξίφος) {   d.forms[0].sword.value= ξίφος; }
if (spyall == "All units" && document.getElementById('units_entry_all_spy'))
  {d.forms[0].spy.value= spy;}
else if (spyall == "All more than" && spy > ανιχνευτής) {   d.forms[0].spy.value= spy-ανιχνευτής; }
else if (spyall == "Insert specific" && spy >= ανιχνευτής) {   d.forms[0].spy.value= ανιχνευτής; }
if (lightall == "All units" && document.getElementById('units_entry_all_light'))
  {d.forms[0].light.value= light;}
else if (lightall == "All more than" && light > ελαφρύ) {   d.forms[0].light.value= light-ελαφρύ; }
else if (lightall == "Insert specific" && light >= ελαφρύ) {   d.forms[0].light.value= ελαφρύ; }
if (heavyall == "All units" && document.getElementById('units_entry_all_heavy'))
  {d.forms[0].heavy.value= heavy;}
else if (heavyall == "All more than" && heavy > βαρύ) {   d.forms[0].heavy.value= heavy-βαρύ; }
else if (heavyall == "Insert specific" && heavy >= βαρύ) {   d.forms[0].heavy.value= βαρύ; }
if (ramall == "All units" && document.getElementById('units_entry_all_ram'))
  {d.forms[0].ram.value= ram;}
else if (ramall == "All more than" && ram > κριός) {   d.forms[0].ram.value= ram-κριός; }
else if (ramall == "Insert specific" && ram >= κριός) {   d.forms[0].ram.value= κριός; }
if (catapultall == "All units" && document.getElementById('units_entry_all_catapult'))
  {d.forms[0].catapult.value= catapult;}
else if (catapultall == "All more than" && catapult > καταπέλτης) {   d.forms[0].catapult.value= catapult-καταπέλτης; }
else if (catapultall == "Insert specific" && catapult >= καταπέλτης) {   d.forms[0].catapult.value= καταπέλτης; }

          if (document.getElementById('unit_input_archer'))
         {
if (archerall == "All units" && document.getElementById('units_entry_all_archer'))
  {d.forms[0].archer.value= archer;}
else if (archerall == "All more than" && archer > τοξότης) {   d.forms[0].archer.value= archer-τοξότης; }
else if (archerall == "Insert specific" && archer >= τοξότης) {   d.forms[0].archer.value= τοξότης; }
if (marcherall == "All units" && document.getElementById('units_entry_all_marcher'))
  {d.forms[0].marcher.value= marcher;}
else if (marcherall == "All more than" && marcher > έφιππος) {   d.forms[0].marcher.value= marcher-έφιππος; }
else if (marcherall == "Insert specific" && marcher >= έφιππος) {   d.forms[0].marcher.value= έφιππος; }

         }}
         if (tsaleidos == "All troops") { $('#selectAllUnits').click(); }
  else if (tsaleidos == "All offensive units+scouts")
         { d.forms[0].axe.value= axe; d.forms[0].light.value= light; d.forms[0].ram.value= ram; d.forms[0].spy.value= spy; if (document.getElementById('unit_input_archer')) { d.forms[0].marcher.value= marcher;}}
   else if (tsaleidos == "All offensive units+heavy+scouts")
         { d.forms[0].axe.value= axe; d.forms[0].light.value= light; d.forms[0].heavy.value= heavy; d.forms[0].ram.value= ram; d.forms[0].spy.value= spy; if (document.getElementById('unit_input_archer')) { d.forms[0].marcher.value= marcher;}}
 else if (tsaleidos == "All offensive+scouts, not rams")
         { d.forms[0].axe.value= axe; d.forms[0].light.value= light; d.forms[0].spy.value= spy; if (document.getElementById('unit_input_archer')) { d.forms[0].marcher.value= marcher;}}
 else if (tsaleidos == "All offensive units")
         { d.forms[0].axe.value= axe; d.forms[0].light.value= light; if (document.getElementById('unit_input_archer')) { d.forms[0].marcher.value= marcher;}}
 else if (tsaleidos == "All light cavalry")
         { d.forms[0].light.value= light;}
 else if (tsaleidos == "All cavalry units")
         { d.forms[0].heavy.value= heavy; d.forms[0].light.value= light; if (document.getElementById('unit_input_archer')) { d.forms[0].marcher.value= marcher;}}
           else if (tsaleidos == "Adjusted settings")   {
               if (mix =="Yes") {
               if (!document.getElementById('unit_input_archer') && spear >= δόρυ && axe >= τσεκούρι && sword >= ξίφος && spy >= ανιχνευτής && light >= ελαφρύ && heavy >= βαρύ && ram >= κριός && catapult >= καταπέλτης)
               { tsalkapone_insert_troops(); }
               else if (document.getElementById('unit_input_archer') && archer >= τοξότης && marcher >= έφιππος && spear >= δόρυ && axe >= τσεκούρι && sword >= ξίφος && spy >= ανιχνευτής && light >= ελαφρύ && heavy >= βαρύ && ram >= κριός && catapult >= καταπέλτης)
         {  tsalkapone_insert_troops();  }
               else {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.req+'', 5000);}}
               else { tsalkapone_insert_troops(); } }
   if (Tsalkapone_συντεταγμένες.replace(/^\s\s*/,'').replace(/\s\s*$/,'')==='' || !localStorage.tsalcoords1) {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.coords+'', 5000);}
                   else {     var doc=document;url=document.URL;
                        var d=document;if(d.forms[0].x.value==="")
Tsalkapone_συντεταγμένες=Tsalkapone_συντεταγμένες.split(" ");var index=0;var farmcookie=d.cookie.match('(^|;) ?'+scriptno+'=([^;]*)(;|$)');
if(farmcookie!==null) index=parseInt(farmcookie[2]);if(index>=Tsalkapone_συντεταγμένες.length) index=0;
var coord=Tsalkapone_συντεταγμένες[index];
coord=coord.split("|");
d.forms[0].x.value=coord[0];d.forms[0].y.value=coord[1];
d.getElementsByTagName("h3")[0].innerHTML="<font color=blue>Tsalkapone. "+scripttitle+". "+tsalkapone_trans.notes.target+" (" + (index+1) + "/" + Tsalkapone_συντεταγμένες.length + ")</font>";
 if (localStorage.clickcount1) {
    localStorage.clickcount1 = Number(localStorage.clickcount1) + 1;
} else {
    localStorage.clickcount1 = 1;
}
 var tsalkaponehits ="<font color=red><b><i>"+scripttitle+". "+tsalkapone_trans.general.counting+":</i></b></font> <font color=darkgreen><b>" +localStorage.clickcount1 + "</b></font>";
 document.getElementById('clickcounts').innerHTML=tsalkaponehits;
index=index+1;
       d.cookie=""+scriptno+"=" + index + ";expires=Πέμπτη, 25 Σεπ 2064 09:55:00 GMT";
	      if (index == Tsalkapone_συντεταγμένες.length ){
UI.SuccessMessage('<span id=tsalkaponelastsyn><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.last+'', 5000);
       }  }

 }});



    $("#Tsalnuke").click(function () {
      document.getElementById('tsalepilogi').innerHTML = tsalperiexomeno1;
        $("#method1info").mouseover(function () {
                                document.getElementById("method1info").style.border = "1px solid blue";
                               document.getElementById("method1info").style.cursor = "pointer";});
                            $("#method1info").mouseout(function () {
                                document.getElementById("method1info").style.border = "0px"; });
    $("#method1info").click(function () {
Dialog1.show('tsalkapone_method1info', infocontent_1);
    });
        if (localStorage.spear1sel) {document.getElementById('spear1sel').value = localStorage.getItem("spear1sel");}else { document.getElementById('spear1sel').value ="All units";}
     if (localStorage.sword1sel) {document.getElementById('sword1sel').value = localStorage.getItem("sword1sel");}else { document.getElementById('sword1sel').value ="All units";}
if (localStorage.axe1sel) {document.getElementById('axe1sel').value = localStorage.getItem("axe1sel");}else { document.getElementById('axe1sel').value ="All units";}
if (localStorage.archer1sel) {document.getElementById('archer1sel').value = localStorage.getItem("archer1sel");}else { document.getElementById('archer1sel').value ="All units";}
if (localStorage.spy1sel) {document.getElementById('spy1sel').value = localStorage.getItem("spy1sel");}else { document.getElementById('spy1sel').value ="All units";}
if (localStorage.light1sel) {document.getElementById('light1sel').value = localStorage.getItem("light1sel");}else { document.getElementById('light1sel').value ="All units";}
if (localStorage.heavy1sel) {document.getElementById('heavy1sel').value = localStorage.getItem("heavy1sel");}else { document.getElementById('heavy1sel').value ="All units";}
if (localStorage.marcher1sel) {document.getElementById('marcher1sel').value = localStorage.getItem("marcher1sel");}else { document.getElementById('marcher1sel').value ="All units";}
if (localStorage.ram1sel) {document.getElementById('ram1sel').value = localStorage.getItem("ram1sel");}else { document.getElementById('ram1sel').value ="All units";}
if (localStorage.cat1sel) {document.getElementById('cat1sel').value = localStorage.getItem("cat1sel");}else { document.getElementById('cat1sel').value ="All units";}
if (localStorage.tsalscriptmethod1) {document.getElementById('tsalscriptmethod1').value = localStorage.getItem("tsalscriptmethod1");}else { document.getElementById('tsalscriptmethod1').value ="All offensive units";}
if (localStorage.tsalcoords1) {document.getElementById('tsalcoords1').value = localStorage.getItem("tsalcoords1");}else { document.getElementById('tsalcoords1').value ="";}
        if (localStorage.tsalkey1) {document.getElementById('tsalkey1').value = localStorage.getItem("tsalkey1");}else { document.getElementById('tsalkey1').value ="";}
if (localStorage.tsalakey1) {document.getElementById('tsalakey1').value = localStorage.getItem("tsalakey1");}else { document.getElementById('tsalakey1').value ="";}
    if (localStorage.tsalname1) {document.getElementById('tsalname1').value = localStorage.getItem("tsalname1");}else { document.getElementById('tsalname1').value ="Nuke Script";}
        if (localStorage.tsalcriteria1) {document.getElementById('tsalcriteria1').value = localStorage.getItem("tsalcriteria1");}else { document.getElementById('tsalcriteria1').value ="Yes";}
      if (localStorage.spear1 !==null) {
   document.getElementById('spear1').value = localStorage.getItem('spear1');
   document.getElementById('spy1').value = localStorage.getItem('spy1');
   document.getElementById('sword1').value = localStorage.getItem('sword1');
document.getElementById('axe1').value = localStorage.getItem('axe1');
document.getElementById('archer1').value = localStorage.getItem('archer1');
document.getElementById('light1').value = localStorage.getItem('light1');
document.getElementById('heavy1').value = localStorage.getItem('heavy1');
document.getElementById('marcher1').value = localStorage.getItem('marcher1');
document.getElementById('ram1').value = localStorage.getItem('ram1');
document.getElementById('cat1').value = localStorage.getItem('cat1');
      }
       $("#Tsalcount1").click(function() {
localStorage.setItem('clickcount1',0);
 UI.SuccessMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.counts+'', 5000);

       });
        $("#Tsalhide").click(function() {
             document.getElementById('tsalepilogi').innerHTML ="";
              $("#Tsalnuke").removeClass("tsalselected");
         $("#Tsalsupport").removeClass("tsalselected");
         $("#Tsalfarming").removeClass("tsalselected");
        $("#Tsalfakes").removeClass("tsalselected");
        });
        $("#Tsalreset1").click(function() {
        localStorage.removeItem("spear1sel");
         localStorage.removeItem("sword1sel");
localStorage.removeItem("axe1sel");
localStorage.removeItem("archer1sel");
localStorage.removeItem("spy1sel");
localStorage.removeItem("light1sel");
localStorage.removeItem("heavy1sel");
localStorage.removeItem("marcher1sel");
localStorage.removeItem("ram1sel");
localStorage.removeItem("cat1sel");
localStorage.removeItem("tsalscriptmethod1");
            localStorage.removeItem("tsalcoords1");
             localStorage.removeItem("tsalname1");
             localStorage.removeItem("tsalkey1");
            localStorage.removeItem("tsalcriteria1");
 localStorage.removeItem("tsalakey1");
    localStorage.removeItem("spear1");
    localStorage.removeItem("sword1");
    localStorage.removeItem("axe1");
    localStorage.removeItem("archer1");
    localStorage.removeItem("spy1");
    localStorage.removeItem("light1");
    localStorage.removeItem("heavy1");
    localStorage.removeItem("marcher1");
    localStorage.removeItem("ram1");
    localStorage.removeItem("cat1");
            UI.SuccessMessage('<span id=tsalkaponesuccesssave><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.reset_all+'', 3000);
    setTimeout(function(){ location.reload(); }, 3000);
            });
        $("#Tsalsave1").click(function() {
            var tsalscriptmethod1 = document.getElementById('tsalscriptmethod1');
            var tsalakey1 = document.getElementById('tsalakey1');
var tsalkey1 = document.getElementById('tsalkey1');
            var tsalcoords1 = document.getElementById('tsalcoords1');
            var tsalname1 = document.getElementById('tsalname1');
          var spear1sel = document.getElementById('spear1sel');
            var sword1sel = document.getElementById('sword1sel');
var axe1sel = document.getElementById('axe1sel');
var archer1sel = document.getElementById('archer1sel');
var spy1sel = document.getElementById('spy1sel');
var light1sel = document.getElementById('light1sel');
var heavy1sel = document.getElementById('heavy1sel');
var marcher1sel = document.getElementById('marcher1sel');
var ram1sel = document.getElementById('ram1sel');
var cat1sel = document.getElementById('cat1sel');
            var tsalcriteria1 = document.getElementById('tsalcriteria1');
                var spear1 = document.getElementById('spear1');
 var sword1 = document.getElementById('sword1');
var axe1 = document.getElementById('axe1');
var archer1 = document.getElementById('archer1');
var spy1 = document.getElementById('spy1');
 var light1 = document.getElementById('light1');
var heavy1 = document.getElementById('heavy1');
var marcher1 = document.getElementById('marcher1');
var ram1 = document.getElementById('ram1');
var cat1 = document.getElementById('cat1');
        localStorage.setItem("spear1sel", spear1sel.value);
         localStorage.setItem("sword1sel", sword1sel.value);
localStorage.setItem("axe1sel", axe1sel.value);
localStorage.setItem("archer1sel", archer1sel.value);
localStorage.setItem("spy1sel", spy1sel.value);
localStorage.setItem("light1sel", light1sel.value);
localStorage.setItem("heavy1sel", heavy1sel.value);
localStorage.setItem("marcher1sel", marcher1sel.value);
localStorage.setItem("ram1sel", ram1sel.value);
localStorage.setItem("cat1sel", cat1sel.value);
localStorage.setItem("tsalscriptmethod1", tsalscriptmethod1.value);
            localStorage.setItem("tsalcoords1", tsalcoords1.value);
             localStorage.setItem("tsalname1", tsalname1.value);
             localStorage.setItem("tsalkey1", tsalkey1.value);
            localStorage.setItem("tsalcriteria1", tsalcriteria1.value);
 localStorage.setItem("tsalakey1", tsalakey1.value);
    localStorage.setItem("spear1", spear1.value);
    localStorage.setItem("sword1", sword1.value);
    localStorage.setItem("axe1", axe1.value);
    localStorage.setItem("archer1", archer1.value);
    localStorage.setItem("spy1",spy1.value);
    localStorage.setItem("light1", light1.value);
    localStorage.setItem("heavy1", heavy1.value);
    localStorage.setItem("marcher1", marcher1.value);
    localStorage.setItem("ram1", ram1.value);
    localStorage.setItem("cat1", cat1.value);
 UI.SuccessMessage('<span id=tsalkaponesuccesssave><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.save+'', 3000);
    setTimeout(function(){ location.reload(); }, 3000);
    });
        $("#Tsalnuke").addClass("tsalselected");
         $("#Tsalsupport").removeClass("tsalselected");
         $("#Tsalfarming").removeClass("tsalselected");
        $("#Tsalfakes").removeClass("tsalselected");
    });


     $("#Tsalactivate3").click(function(){
         var scriptno ="tsalfarmingscript";
         var tsaleidos = localStorage.getItem("tsalscriptmethod3");
       var δόρυ = localStorage.getItem("spear3");
       var ξίφος = localStorage.getItem('sword3');
       var τσεκούρι = localStorage.getItem('axe3');
       var ανιχνευτής = localStorage.getItem('spy3');
       var ελαφρύ = localStorage.getItem('light3');
       var βαρύ = localStorage.getItem('heavy3');
       var κριός = localStorage.getItem('ram3');
       var καταπέλτης = localStorage.getItem('cat3');
       var τοξότης = localStorage.getItem('archer3');
       var έφιππος = localStorage.getItem('marcher3');
       var spearall = localStorage.getItem('spear3sel');
       var swordall = localStorage.getItem('sword3sel');
var axeall = localStorage.getItem("axe3sel");
var spyall = localStorage.getItem('spy3sel');
var archerall = localStorage.getItem('archer3sel');
var marcherall = localStorage.getItem('marcher3sel');
var lightall = localStorage.getItem('light3sel');
var heavyall = localStorage.getItem('heavy3sel');
var ramall = localStorage.getItem('ram3sel');
var catapultall = localStorage.getItem('cat3sel');
         var d=document;
     if (localStorage.tsalname3) {    var scripttitle = ""+localStorage.getItem('tsalname3')+"";} else { scripttitle = "Farming Script";}
       var Tsalkapone_συντεταγμένες = ""+localStorage.getItem('tsalcoords3')+"";
  if(!localStorage.tsalscriptmethod3)
  {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.values+'', 5000);}
 else {
if (document.getElementById('units_entry_all_spear')) {   var spear = parseInt( $('#units_entry_all_spear').text().replace(/[^0-9]/gi, ''));} else { spear = 0;}
 if (document.getElementById('units_entry_all_axe')) {   var axe = parseInt( $('#units_entry_all_axe').text().replace(/[^0-9]/gi, ''));} else { axe = 0;}
if (document.getElementById('units_entry_all_sword')) {   var sword = parseInt( $('#units_entry_all_sword').text().replace(/[^0-9]/gi, ''));} else { sword = 0;}
if (document.getElementById('units_entry_all_light')) {   var light = parseInt( $('#units_entry_all_light').text().replace(/[^0-9]/gi, ''));} else { light = 0;}
if (document.getElementById('units_entry_all_spy')) {   var spy = parseInt( $('#units_entry_all_spy').text().replace(/[^0-9]/gi, ''));} else { spy = 0;}
if (document.getElementById('units_entry_all_heavy')) {   var heavy = parseInt( $('#units_entry_all_heavy').text().replace(/[^0-9]/gi, ''));} else { heavy = 0;}
if (document.getElementById('units_entry_all_ram')) {   var ram = parseInt( $('#units_entry_all_ram').text().replace(/[^0-9]/gi, ''));} else { ram = 0;}
if (document.getElementById('units_entry_all_catapult')) {   var catapult = parseInt( $('#units_entry_all_catapult').text().replace(/[^0-9]/gi, ''));} else { catapult = 0;}
 if (document.getElementById('unit_input_archer')) {
if (document.getElementById('units_entry_all_archer')) { var archer = parseInt( $('#units_entry_all_archer').text().replace(/[^0-9]/gi, '')); }else { archer = 0;}
if (document.getElementById('units_entry_all_marcher')) { var marcher = parseInt( $('#units_entry_all_marcher').text().replace(/[^0-9]/gi, ''));} else { marcher = 0;}
}


function tsalkapone_insert_troops1() {
 if (lightall == "Insert specific" && light >= ελαφρύ && ελαφρύ>0) {   d.forms[0].light.value= ελαφρύ; }
else if (lightall == "All remaining" && light >= ελαφρύ && ελαφρύ>0) {   d.forms[0].light.value= ελαφρύ; }
else if (lightall == "All remaining" && light < ελαφρύ && light>0 && ελαφρύ>0) {   d.forms[0].light.value= light; }
 else if (heavyall == "Insert specific" && heavy >= βαρύ && βαρύ>0) {   d.forms[0].heavy.value= βαρύ; }
else if (heavyall == "All remaining" && heavy >= βαρύ && βαρύ>0) {   d.forms[0].heavy.value= βαρύ; }
else if (heavyall == "All remaining" && heavy < βαρύ && heavy>0 && βαρύ>0) {   d.forms[0].heavy.value= heavy; }
  else if (document.getElementById('unit_input_archer') && marcherall == "Insert specific" && marcher >= έφιππος && έφιππος>0) {   d.forms[0].marcher.value= έφιππος; }
else if (document.getElementById('unit_input_archer') && marcherall == "All remaining" && marcher >= έφιππος && έφιππος>0) {   d.forms[0].marcher.value= έφιππος; }
else if (document.getElementById('unit_input_archer') && marcherall == "All remaining" && marcher < έφιππος && marcher>0 && έφιππος>0) {   d.forms[0].marcher.value= marcher; }

else if (axeall == "Insert specific" && axe >= τσεκούρι && τσεκούρι>0) {   d.forms[0].axe.value= τσεκούρι; }
else if (axeall == "All remaining" && axe >= τσεκούρι && τσεκούρι>0) {   d.forms[0].axe.value= τσεκούρι; }
else if (axeall == "All remaining" && axe < τσεκούρι && axe>0 && τσεκούρι>0) {   d.forms[0].axe.value= axe; }
    else if (spearall == "Insert specific" && spear >= δόρυ && δόρυ>0) {   d.forms[0].spear.value= δόρυ; }
else if (spearall == "All remaining" && spear >= δόρυ && δόρυ>0) {   d.forms[0].spear.value= δόρυ; }
else if (spearall == "All remaining" && spear < δόρυ && spear>0 && δόρυ>0) {   d.forms[0].spear.value= spear; }
  else if (document.getElementById('unit_input_archer') && archerall == "Insert specific" && archer >= τοξότης && τοξότης>0) {   d.forms[0].archer.value= τοξότης; }
else if (document.getElementById('unit_input_archer') && archerall == "All remaining" && archer >= τοξότης && τοξότης>0) {   d.forms[0].archer.value= τοξότης; }
else if (document.getElementById('unit_input_archer') && archerall == "All remaining" && archer < τοξότης && archer>0 && τοξότης>0) {   d.forms[0].archer.value= archer; }

    else if (swordall == "Insert specific" && sword >= ξίφος && ξίφος>0) {   d.forms[0].sword.value= ξίφος; }
else if (swordall == "All remaining" && sword >= ξίφος && ξίφος>0) {   d.forms[0].sword.value= ξίφος; }
else if (swordall == "All remaining" && sword < ξίφος && sword>0 && ξίφος>0) {   d.forms[0].sword.value= sword; }
     if (ramall == "None" && document.getElementById('units_entry_all_ram'))
  {d.forms[0].ram.value= 0;}
    else if (ramall == "Insert specific" && ram >= κριός && κριός>0) {   d.forms[0].ram.value= κριός; }
else if (ramall == "All remaining" && ram >= κριός && κριός>0) {   d.forms[0].ram.value= κριός; }
    else if (ramall == "All remaining" && ram <= κριός && ram>0 && κριός>0) {   d.forms[0].ram.value= ram; }
if (catapultall == "None" && document.getElementById('units_entry_all_catapult'))
  {d.forms[0].catapult.value= 0;}
    else if (catapultall == "Insert specific" && catapult >= καταπέλτης && καταπέλτης>0) {   d.forms[0].catapult.value= καταπέλτης; }
    else if (catapultall == "All remaining" && catapult >= καταπέλτης && καταπέλτης>0) {   d.forms[0].catapult.value= καταπέλτης; }
else if (catapultall == "All remaining" && catapult <= καταπέλτης && catapult>0 && καταπέλτης>0) {   d.forms[0].catapult.value= catapult; }
if (spyall == "None" && document.getElementById('units_entry_all_spy'))
  {d.forms[0].spy.value= 0;}
    else if (spyall == "Insert specific" && spy >= ανιχνευτής && ανιχνευτής>0) {   d.forms[0].spy.value= ανιχνευτής; }
    else if (spyall == "All remaining" && spy >= ανιχνευτής && ανιχνευτής>0) {   d.forms[0].spy.value= ανιχνευτής; }
else if (spyall == "All remaining" && spy <= ανιχνευτής && spy>0 && ανιχνευτής>0) {   d.forms[0].spy.value= spy; }
}
     function tsalkapone_insert_troops2() {
 if (swordall == "Insert specific" && sword >= ξίφος && ξίφος>0) {   d.forms[0].sword.value= ξίφος; }
else if (swordall == "All remaining" && sword >= ξίφος && ξίφος>0) {   d.forms[0].sword.value= ξίφος; }
else if (swordall == "All remaining" && sword < ξίφος && sword>0 && ξίφος>0) {   d.forms[0].sword.value= sword; }
else if (document.getElementById('unit_input_archer') && archerall == "Insert specific" && archer >= τοξότης && τοξότης>0) {   d.forms[0].archer.value= τοξότης; }
else if (document.getElementById('unit_input_archer') && archerall == "All remaining" && archer >= τοξότης && τοξότης>0) {   d.forms[0].archer.value= τοξότης; }
else if (document.getElementById('unit_input_archer') && archerall == "All remaining" && archer < τοξότης && archer>0 && τοξότης>0) {   d.forms[0].archer.value= archer; }
 else if (spearall == "Insert specific" && spear >= δόρυ && δόρυ>0) {   d.forms[0].spear.value= δόρυ; }
else if (spearall == "All remaining" && spear >= δόρυ && δόρυ>0) {   d.forms[0].spear.value= δόρυ; }
else if (spearall == "All remaining" && spear < δόρυ && spear>0 && δόρυ>0) {   d.forms[0].spear.value= spear; }
else if (axeall == "Insert specific" && axe >= τσεκούρι && τσεκούρι>0) {   d.forms[0].axe.value= τσεκούρι; }
else if (axeall == "All remaining" && axe >= τσεκούρι && τσεκούρι>0) {   d.forms[0].axe.value= τσεκούρι; }
else if (axeall == "All remaining" && axe < τσεκούρι && axe>0 && τσεκούρι>0) {   d.forms[0].axe.value= axe; }
 else  if (document.getElementById('unit_input_archer') && marcherall == "Insert specific" && marcher >= έφιππος && έφιππος>0) {   d.forms[0].marcher.value= έφιππος; }
else if (document.getElementById('unit_input_archer') && marcherall == "All remaining" && marcher >= έφιππος && έφιππος>0) {   d.forms[0].marcher.value= έφιππος; }
else if (document.getElementById('unit_input_archer') && marcherall == "All remaining" && marcher < έφιππος && marcher>0 && έφιππος>0) {   d.forms[0].marcher.value= marcher; }
else if (heavyall == "Insert specific" && heavy >= βαρύ && βαρύ>0) {   d.forms[0].heavy.value= βαρύ; }
else if (heavyall == "All remaining" && heavy >= βαρύ && βαρύ>0) {   d.forms[0].heavy.value= βαρύ; }
else if (heavyall == "All remaining" && heavy < βαρύ && heavy>0 && βαρύ>0) {   d.forms[0].heavy.value= heavy; }
else if (lightall == "Insert specific" && light >= ελαφρύ && ελαφρύ>0) {   d.forms[0].light.value= ελαφρύ; }
else if (lightall == "All remaining" && light >= ελαφρύ && ελαφρύ>0) {   d.forms[0].light.value= ελαφρύ; }
else if (lightall == "All remaining" && light < ελαφρύ && light>0 && ελαφρύ>0) {   d.forms[0].light.value= light; }
 if (ramall == "None" && document.getElementById('units_entry_all_ram'))
  {d.forms[0].ram.value= 0;}
    else if (ramall == "Insert specific" && ram >= κριός && κριός>0) {   d.forms[0].ram.value= κριός; }
else if (ramall == "All remaining" && ram >= κριός && κριός>0) {   d.forms[0].ram.value= κριός; }
    else if (ramall == "All remaining" && ram <= κριός && ram>0 && κριός>0) {   d.forms[0].ram.value= ram; }
if (catapultall == "None" && document.getElementById('units_entry_all_catapult'))
  {d.forms[0].catapult.value= 0;}
    else if (catapultall == "Insert specific" && catapult >= καταπέλτης && καταπέλτης>0) {   d.forms[0].catapult.value= καταπέλτης; }
    else if (catapultall == "All remaining" && catapult >= καταπέλτης && καταπέλτης>0) {   d.forms[0].catapult.value= καταπέλτης; }
else if (catapultall == "All remaining" && catapult <= καταπέλτης && catapult>0 && καταπέλτης>0) {   d.forms[0].catapult.value= catapult; }
if (spyall == "None" && document.getElementById('units_entry_all_spy'))
  {d.forms[0].spy.value= 0;}
    else if (spyall == "Insert specific" && spy >= ανιχνευτής && ανιχνευτής>0) {   d.forms[0].spy.value= ανιχνευτής; }
    else if (spyall == "All remaining" && spy >= ανιχνευτής && ανιχνευτής>0) {   d.forms[0].spy.value= ανιχνευτής; }
else if (spyall == "All remaining" && spy <= ανιχνευτής && spy>0 && ανιχνευτής>0) {   d.forms[0].spy.value= spy; }
}
     if (tsaleidos == "By ascending speed") {tsalkapone_insert_troops1();    }
  else    if (tsaleidos == "By descending speed") {tsalkapone_insert_troops2();    }
   if (Tsalkapone_συντεταγμένες.replace(/^\s\s*/,'').replace(/\s\s*$/,'')==='' || !localStorage.tsalcoords3) {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.coords+'', 5000);}
                   else {     var doc=document;url=document.URL;
                        var d=document;if(d.forms[0].x.value==="")
Tsalkapone_συντεταγμένες=Tsalkapone_συντεταγμένες.split(" ");var index=0;var farmcookie=d.cookie.match('(^|;) ?'+scriptno+'=([^;]*)(;|$)');
if(farmcookie!==null) index=parseInt(farmcookie[2]);if(index>=Tsalkapone_συντεταγμένες.length) index=0;
var coord=Tsalkapone_συντεταγμένες[index];
coord=coord.split("|");
d.forms[0].x.value=coord[0];d.forms[0].y.value=coord[1];
d.getElementsByTagName("h3")[0].innerHTML="<font color=blue>Tsalkapone. "+scripttitle+". "+tsalkapone_trans.notes.target+" (" + (index+1) + "/" + Tsalkapone_συντεταγμένες.length + ")</font>";
 if (localStorage.clickcount3) {
    localStorage.clickcount3 = Number(localStorage.clickcount3) + 1;
} else {
    localStorage.clickcount3 = 1;
}
 var tsalkaponehits ="<font color=red><b><i>"+scripttitle+". "+tsalkapone_trans.general.counting+":</i></b></font> <font color=darkgreen><b>" +localStorage.clickcount3 + "</b></font>";
 document.getElementById('clickcounts').innerHTML=tsalkaponehits;

index=index+1;
       d.cookie=""+scriptno+"=" + index + ";expires=Πέμπτη, 25 Σεπ 2064 09:55:00 GMT";
	      if (index == Tsalkapone_συντεταγμένες.length ){
UI.SuccessMessage('<span id=tsalkaponelastsyn><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.last+'', 5000);
       }  }

 }});



    $("#Tsalfarming").click(function () {
      document.getElementById('tsalepilogi').innerHTML = tsalperiexomeno3;
         if (localStorage.spear3sel) {document.getElementById('spear3sel').value = localStorage.getItem("spear3sel");}else { document.getElementById('spear3sel').value ="All remaining";}
     if (localStorage.sword3sel) {document.getElementById('sword3sel').value = localStorage.getItem("sword3sel");}else { document.getElementById('sword3sel').value ="All remaining";}
if (localStorage.axe3sel) {document.getElementById('axe3sel').value = localStorage.getItem("axe3sel");}else { document.getElementById('axe3sel').value ="All remaining";}
if (localStorage.archer3sel) {document.getElementById('archer3sel').value = localStorage.getItem("archer3sel");}else { document.getElementById('archer3sel').value ="All remaining";}
if (localStorage.spy3sel) {document.getElementById('spy3sel').value = localStorage.getItem("spy3sel");}else { document.getElementById('spy3sel').value ="All remaining";}
if (localStorage.light3sel) {document.getElementById('light3sel').value = localStorage.getItem("light3sel");}else { document.getElementById('light3sel').value ="All remaining";}
if (localStorage.heavy3sel) {document.getElementById('heavy3sel').value = localStorage.getItem("heavy3sel");}else { document.getElementById('heavy3sel').value ="All remaining";}
if (localStorage.marcher3sel) {document.getElementById('marcher3sel').value = localStorage.getItem("marcher3sel");}else { document.getElementById('marcher3sel').value ="All remaining";}
if (localStorage.ram3sel) {document.getElementById('ram3sel').value = localStorage.getItem("ram3sel");}else { document.getElementById('ram3sel').value ="All remaining";}
if (localStorage.cat3sel) {document.getElementById('cat3sel').value = localStorage.getItem("cat3sel");}else { document.getElementById('cat3sel').value ="All remaining";}
if (localStorage.tsalscriptmethod3) {document.getElementById('tsalscriptmethod3').value = localStorage.getItem("tsalscriptmethod3");}else { document.getElementById('tsalscriptmethod3').value ="By ascending speed";}
if (localStorage.tsalcoords3) {document.getElementById('tsalcoords3').value = localStorage.getItem("tsalcoords3");}else { document.getElementById('tsalcoords3').value ="";}
        if (localStorage.tsalkey3) {document.getElementById('tsalkey3').value = localStorage.getItem("tsalkey3");}else { document.getElementById('tsalkey3').value ="";}
if (localStorage.tsalakey3) {document.getElementById('tsalakey3').value = localStorage.getItem("tsalakey3");}else { document.getElementById('tsalakey3').value ="";}
    if (localStorage.tsalname3) {document.getElementById('tsalname3').value = localStorage.getItem("tsalname3");}else { document.getElementById('tsalname3').value ="Farming Script";}
      if (localStorage.spear3 !==null) {
   document.getElementById('spear3').value = localStorage.getItem('spear3');
   document.getElementById('spy3').value = localStorage.getItem('spy3');
   document.getElementById('sword3').value = localStorage.getItem('sword3');
document.getElementById('axe3').value = localStorage.getItem('axe3');
document.getElementById('archer3').value = localStorage.getItem('archer3');
document.getElementById('light3').value = localStorage.getItem('light3');
document.getElementById('heavy3').value = localStorage.getItem('heavy3');
document.getElementById('marcher3').value = localStorage.getItem('marcher3');
document.getElementById('ram3').value = localStorage.getItem('ram3');
document.getElementById('cat3').value = localStorage.getItem('cat3');
      }
        $("#Tsalcount3").click(function() {
localStorage.setItem('clickcount3',0);
 UI.SuccessMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.counts+'', 5000);

       });
        $("#Tsalhide").click(function() {
             document.getElementById('tsalepilogi').innerHTML ="";
              $("#Tsalnuke").removeClass("tsalselected");
         $("#Tsalsupport").removeClass("tsalselected");
         $("#Tsalfarming").removeClass("tsalselected");
        $("#Tsalfakes").removeClass("tsalselected");
        });
        $("#Tsalreset3").click(function() {
        localStorage.removeItem("spear3sel");
         localStorage.removeItem("sword3sel");
localStorage.removeItem("axe3sel");
localStorage.removeItem("archer3sel");
localStorage.removeItem("spy3sel");
localStorage.removeItem("light3sel");
localStorage.removeItem("heavy3sel");
localStorage.removeItem("marcher3sel");
localStorage.removeItem("ram3sel");
localStorage.removeItem("cat3sel");
localStorage.removeItem("tsalscriptmethod3");
            localStorage.removeItem("tsalcoords3");
             localStorage.removeItem("tsalname3");
             localStorage.removeItem("tsalkey3");
 localStorage.removeItem("tsalakey3");
    localStorage.removeItem("spear3");
    localStorage.removeItem("sword3");
    localStorage.removeItem("axe3");
    localStorage.removeItem("archer3");
    localStorage.removeItem("spy3");
    localStorage.removeItem("light3");
    localStorage.removeItem("heavy3");
    localStorage.removeItem("marcher3");
    localStorage.removeItem("ram3");
    localStorage.removeItem("cat3");
            UI.SuccessMessage('<span id=tsalkaponesuccesssave><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.reset_all+'', 3000);
    setTimeout(function(){ location.reload(); }, 3000);
            });
        $("#Tsalsave3").click(function() {
            var tsalscriptmethod3 = document.getElementById('tsalscriptmethod3');
            var tsalakey3 = document.getElementById('tsalakey3');
var tsalkey3 = document.getElementById('tsalkey3');
            var tsalcoords3 = document.getElementById('tsalcoords3');
            var tsalname3 = document.getElementById('tsalname3');
          var spear3sel = document.getElementById('spear3sel');
            var sword3sel = document.getElementById('sword3sel');
var axe3sel = document.getElementById('axe3sel');
var archer3sel = document.getElementById('archer3sel');
var spy3sel = document.getElementById('spy3sel');
var light3sel = document.getElementById('light3sel');
var heavy3sel = document.getElementById('heavy3sel');
var marcher3sel = document.getElementById('marcher3sel');
var ram3sel = document.getElementById('ram3sel');
var cat3sel = document.getElementById('cat3sel');
                var spear3 = document.getElementById('spear3');
 var sword3 = document.getElementById('sword3');
var axe3 = document.getElementById('axe3');
var archer3 = document.getElementById('archer3');
var spy3 = document.getElementById('spy3');
 var light3 = document.getElementById('light3');
var heavy3 = document.getElementById('heavy3');
var marcher3 = document.getElementById('marcher3');
var ram3 = document.getElementById('ram3');
var cat3 = document.getElementById('cat3');
        localStorage.setItem("spear3sel", spear3sel.value);
         localStorage.setItem("sword3sel", sword3sel.value);
localStorage.setItem("axe3sel", axe3sel.value);
localStorage.setItem("archer3sel", archer3sel.value);
localStorage.setItem("spy3sel", spy3sel.value);
localStorage.setItem("light3sel", light3sel.value);
localStorage.setItem("heavy3sel", heavy3sel.value);
localStorage.setItem("marcher3sel", marcher3sel.value);
localStorage.setItem("ram3sel", ram3sel.value);
localStorage.setItem("cat3sel", cat3sel.value);
localStorage.setItem("tsalscriptmethod3", tsalscriptmethod3.value);
            localStorage.setItem("tsalcoords3", tsalcoords3.value);
             localStorage.setItem("tsalname3", tsalname3.value);
             localStorage.setItem("tsalkey3", tsalkey3.value);
 localStorage.setItem("tsalakey3", tsalakey3.value);
    localStorage.setItem("spear3", spear3.value);
    localStorage.setItem("sword3", sword3.value);
    localStorage.setItem("axe3", axe3.value);
    localStorage.setItem("archer3", archer3.value);
    localStorage.setItem("spy3",spy3.value);
    localStorage.setItem("light3", light3.value);
    localStorage.setItem("heavy3", heavy3.value);
    localStorage.setItem("marcher3", marcher3.value);
    localStorage.setItem("ram3", ram3.value);
    localStorage.setItem("cat3", cat3.value);
 UI.SuccessMessage('<span id=tsalkaponesuccesssave><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.save+'', 3000);
    setTimeout(function(){ location.reload(); }, 3000);
    });
        $("#Tsalnuke").removeClass("tsalselected");
         $("#Tsalsupport").removeClass("tsalselected");
         $("#Tsalfarming").addClass("tsalselected");
        $("#Tsalfakes").removeClass("tsalselected");
    });

    $("#Tsalactivate2").click(function(){
           var mix = localStorage.getItem("tsalcriteria2");
           var scriptno = "tsalnuke2script";
           var split = parseInt(localStorage.getItem("tsalsplit2").replace(/[^0-9]/gi, ''));
          var tsaleidos = localStorage.getItem("tsalscriptmethod2");
        var splitactive =  localStorage.getItem("tsalsplit2");
      var δόρυ = localStorage.getItem("spear2");
       var ξίφος = localStorage.getItem('sword2');
       var τσεκούρι = localStorage.getItem('axe2');
       var ανιχνευτής = localStorage.getItem('spy2');
       var ελαφρύ = localStorage.getItem('light2');
       var βαρύ = localStorage.getItem('heavy2');
       var κριός = localStorage.getItem('ram2');
       var καταπέλτης = localStorage.getItem('cat2');
       var τοξότης = localStorage.getItem('archer2');
       var έφιππος = localStorage.getItem('marcher2');
       var spearall = localStorage.getItem('spear2sel');
       var swordall = localStorage.getItem('sword2sel');
var axeall = localStorage.getItem("axe2sel");
var spyall = localStorage.getItem('spy2sel');
var archerall = localStorage.getItem('archer2sel');
var marcherall = localStorage.getItem('marcher2sel');
var lightall = localStorage.getItem('light2sel');
var heavyall = localStorage.getItem('heavy2sel');
var ramall = localStorage.getItem('ram2sel');
var catapultall = localStorage.getItem('cat2sel');
         if (localStorage.tsalname2) {    var scripttitle = ""+localStorage.getItem('tsalname2')+"";} else { scripttitle = "Support Script";}
       var Tsalkapone_συντεταγμένες = ""+localStorage.getItem('tsalcoords2')+"";
  if(!localStorage.tsalscriptmethod2)
  {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.values+'', 5000);}
 else {
if (document.getElementById('units_entry_all_spear')) {   var spear = parseInt( $('#units_entry_all_spear').text().replace(/[^0-9]/gi, ''));} else { spear = 0;}
 if (document.getElementById('units_entry_all_axe')) {   var axe = parseInt( $('#units_entry_all_axe').text().replace(/[^0-9]/gi, ''));} else { axe = 0;}
if (document.getElementById('units_entry_all_sword')) {   var sword = parseInt( $('#units_entry_all_sword').text().replace(/[^0-9]/gi, ''));} else { sword = 0;}
if (document.getElementById('units_entry_all_light')) {   var light = parseInt( $('#units_entry_all_light').text().replace(/[^0-9]/gi, ''));} else { light = 0;}
if (document.getElementById('units_entry_all_spy')) {   var spy = parseInt( $('#units_entry_all_spy').text().replace(/[^0-9]/gi, ''));} else { spy = 0;}
if (document.getElementById('units_entry_all_heavy')) {   var heavy = parseInt( $('#units_entry_all_heavy').text().replace(/[^0-9]/gi, ''));} else { heavy = 0;}
if (document.getElementById('units_entry_all_ram')) {   var ram = parseInt( $('#units_entry_all_ram').text().replace(/[^0-9]/gi, ''));} else { ram = 0;}
if (document.getElementById('units_entry_all_catapult')) {   var catapult = parseInt( $('#units_entry_all_catapult').text().replace(/[^0-9]/gi, ''));} else { catapult = 0;}
 if (document.getElementById('unit_input_archer')) {
if (document.getElementById('units_entry_all_archer')) { var archer = parseInt( $('#units_entry_all_archer').text().replace(/[^0-9]/gi, '')); }else { archer = 0;}
if (document.getElementById('units_entry_all_marcher')) { var marcher = parseInt( $('#units_entry_all_marcher').text().replace(/[^0-9]/gi, ''));} else { marcher = 0;}
}
        var d=document;
     function tsalkapone_insert_troops() {

        if (spearall == "All units" && document.getElementById('units_entry_all_spear'))
  {d.forms[0].spear.value = spear;}
else if (spearall == "All more than" && spear > δόρυ) {  d.forms[0].spear.value = spear-δόρυ; }
else if (spearall == "Insert specific" && spear >= δόρυ) {   d.forms[0].spear.value = δόρυ; }
if (axeall == "All units" && document.getElementById('units_entry_all_axe'))
  {d.forms[0].axe.value= axe;}
else if (axeall == "All more than" && axe > τσεκούρι) {   d.forms[0].axe.value= axe-τσεκούρι; }
else if (axeall == "Insert specific" && axe >= τσεκούρι) {   d.forms[0].axe.value= τσεκούρι; }
if (swordall == "All units" && document.getElementById('units_entry_all_sword'))
  {d.forms[0].sword.value= sword;}
else if (swordall == "All more than" && sword > ξίφος) {   d.forms[0].sword.value= sword-ξίφος; }
else if (swordall == "Insert specific" && sword >= ξίφος) {   d.forms[0].sword.value= ξίφος; }
if (spyall == "All units" && document.getElementById('units_entry_all_spy'))
  {d.forms[0].spy.value= spy;}
else if (spyall == "All more than" && spy > ανιχνευτής) {   d.forms[0].spy.value= spy-ανιχνευτής; }
else if (spyall == "Insert specific" && spy >= ανιχνευτής) {   d.forms[0].spy.value= ανιχνευτής; }
if (lightall == "All units" && document.getElementById('units_entry_all_light'))
  {d.forms[0].light.value= light;}
else if (lightall == "All more than" && light > ελαφρύ) {   d.forms[0].light.value= light-ελαφρύ; }
else if (lightall == "Insert specific" && light >= ελαφρύ) {   d.forms[0].light.value= ελαφρύ; }
if (heavyall == "All units" && document.getElementById('units_entry_all_heavy'))
  {d.forms[0].heavy.value= heavy;}
else if (heavyall == "All more than" && heavy > βαρύ) {   d.forms[0].heavy.value= heavy-βαρύ; }
else if (heavyall == "Insert specific" && heavy >= βαρύ) {   d.forms[0].heavy.value= βαρύ; }
if (ramall == "All units" && document.getElementById('units_entry_all_ram'))
  {d.forms[0].ram.value= ram;}
else if (ramall == "All more than" && ram > κριός) {   d.forms[0].ram.value= ram-κριός; }
else if (ramall == "Insert specific" && ram >= κριός) {   d.forms[0].ram.value= κριός; }
if (catapultall == "All units" && document.getElementById('units_entry_all_catapult'))
  {d.forms[0].catapult.value= catapult;}
else if (catapultall == "All more than" && catapult > καταπέλτης) {   d.forms[0].catapult.value= catapult-καταπέλτης; }
else if (catapultall == "Insert specific" && catapult >= καταπέλτης) {   d.forms[0].catapult.value= καταπέλτης; }

          if (document.getElementById('unit_input_archer'))
         {
if (archerall == "All units" && document.getElementById('units_entry_all_archer'))
  {d.forms[0].archer.value= archer;}
else if (archerall == "All more than" && archer > τοξότης) {   d.forms[0].archer.value= archer-τοξότης; }
else if (archerall == "Insert specific" && archer >= τοξότης) {   d.forms[0].archer.value= τοξότης; }
if (marcherall == "All units" && document.getElementById('units_entry_all_marcher'))
  {d.forms[0].marcher.value= marcher;}
else if (marcherall == "All more than" && marcher > έφιππος) {   d.forms[0].marcher.value= marcher-έφιππος; }
else if (marcherall == "Insert specific" && marcher >= έφιππος) {   d.forms[0].marcher.value= έφιππος; }
         }}
             if (tsaleidos == "All troops") { $('#selectAllUnits').click(); }
  else if (tsaleidos == "All defensive units+catapults+scouts")
  {if (splitactive != "No") {
    d.forms[0].spear.value= Math.ceil(spear/split); d.forms[0].sword.value= Math.ceil(sword/split); d.forms[0].spy.value= Math.ceil(spy/split); d.forms[0].heavy.value= Math.ceil(heavy/split); d.forms[0].catapult.value= Math.ceil(catapult/split);  if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= Math.ceil(archer/split);}
  }
   else
      { d.forms[0].spear.value= spear; d.forms[0].sword.value= sword; d.forms[0].catapult.value= catapult;  d.forms[0].heavy.value= heavy; d.forms[0].spy.value= spy; if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= archer;}
  }}
else if (tsaleidos == "All defensive units+scouts")
  {if (splitactive != "No") {
    d.forms[0].spear.value= Math.ceil(spear/split); d.forms[0].sword.value= Math.ceil(sword/split); d.forms[0].spy.value= Math.ceil(spy/split); d.forms[0].heavy.value= Math.ceil(heavy/split);  if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= Math.ceil(archer/split);}
  }
   else
      { d.forms[0].spear.value= spear; d.forms[0].sword.value= sword;  d.forms[0].heavy.value= heavy; d.forms[0].spy.value= spy; if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= archer;}
  }}
else if (tsaleidos == "All defensive units")
  {if (splitactive != "No") {
    d.forms[0].spear.value= Math.ceil(spear/split); d.forms[0].sword.value= Math.ceil(sword/split);  d.forms[0].heavy.value= Math.ceil(heavy/split);  if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= Math.ceil(archer/split);}
  }
   else
      { d.forms[0].spear.value= spear; d.forms[0].sword.value= sword;  d.forms[0].heavy.value= heavy;  if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= archer;}
  }}
     else if (tsaleidos == "All non-cavalry defensive")
           {if (splitactive != "No")
{ d.forms[0].spear.value= Math.ceil(spear/split); d.forms[0].sword.value= Math.ceil(sword/split);  if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= Math.ceil(archer/split);}}
else   { d.forms[0].spear.value= spear; d.forms[0].sword.value= sword;  if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= archer;}}}
          else if (tsaleidos == "All heavy")
     {
         if (splitactive != "No") {d.forms[0].heavy.value= Math.ceil(heavy/split);}
   else {         d.forms[0].heavy.value= heavy;}}
    else if (tsaleidos == "All spears and archers")
    {   if (splitactive != "No")    { d.forms[0].spear.value= Math.ceil(spear/split);  if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= Math.ceil(archer/split);}}
 else   { d.forms[0].spear.value= spear;  if (document.getElementById('unit_input_archer')) { d.forms[0].archer.value= archer;}}   }
      else if (tsaleidos == "All swords")
           { if (splitactive != "No") {d.forms[0].sword.value= Math.ceil(sword/split);} else {d.forms[0].sword.value= sword;}}
            else if (tsaleidos == "All catapults")
           { if (splitactive != "No") {d.forms[0].catapult.value= Math.ceil(catapult/split);} else {d.forms[0].catapult.value= catapult;}}
             else if (tsaleidos == "All scouts")
           { if (splitactive != "No") {d.forms[0].spy.value= Math.ceil(spy/split);}  else {d.forms[0].spy.value= spy;}}
           else if (tsaleidos == "Adjusted settings")   {
               if (mix =="Yes") {
               if (!document.getElementById('unit_input_archer') && spear >= δόρυ && axe >= τσεκούρι && sword >= ξίφος && spy >= ανιχνευτής && light >= ελαφρύ && heavy >= βαρύ && ram >= κριός && catapult >= καταπέλτης)
               { tsalkapone_insert_troops(); }
               else if (document.getElementById('unit_input_archer') && archer >= τοξότης && marcher >= έφιππος && spear >= δόρυ && axe >= τσεκούρι && sword >= ξίφος && spy >= ανιχνευτής && light >= ελαφρύ && heavy >= βαρύ && ram >= κριός && catapult >= καταπέλτης)
         {  tsalkapone_insert_troops();  }
               else {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.req+'', 5000);}}
               else { tsalkapone_insert_troops(); } }
   if (Tsalkapone_συντεταγμένες.replace(/^\s\s*/,'').replace(/\s\s*$/,'')==='' || !localStorage.tsalcoords2) {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.coords+'', 5000);}
                   else {     var doc=document;url=document.URL;
                        var d=document;if(d.forms[0].x.value==="")
Tsalkapone_συντεταγμένες=Tsalkapone_συντεταγμένες.split(" ");var index=0;var farmcookie=d.cookie.match('(^|;) ?'+scriptno+'=([^;]*)(;|$)');
if(farmcookie!==null) index=parseInt(farmcookie[2]);if(index>=Tsalkapone_συντεταγμένες.length) index=0;
var coord=Tsalkapone_συντεταγμένες[index];
coord=coord.split("|");
d.forms[0].x.value=coord[0];d.forms[0].y.value=coord[1];
d.getElementsByTagName("h3")[0].innerHTML="<font color=blue>Tsalkapone. "+scripttitle+". "+tsalkapone_trans.notes.target+" (" + (index+1) + "/" + Tsalkapone_συντεταγμένες.length + ")</font>";
                         if (localStorage.clickcount2) {
    localStorage.clickcount2 = Number(localStorage.clickcount2) + 1;
} else {
    localStorage.clickcount2 = 1;
}
 var tsalkaponehits ="<font color=red><b><i>"+scripttitle+". "+tsalkapone_trans.general.counting+":</i></b></font> <font color=darkgreen><b>" +localStorage.clickcount2 + "</b></font>";
 document.getElementById('clickcounts').innerHTML=tsalkaponehits;
index=index+1;
       d.cookie=""+scriptno+"=" + index + ";expires=Πέμπτη, 25 Σεπ 2064 09:55:00 GMT";
	      if (index == Tsalkapone_συντεταγμένες.length ){
UI.SuccessMessage('<span id=tsalkaponelastsyn><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.last+'', 5000);
       }  }

 }});



    $("#Tsalsupport").click(function () {
      document.getElementById('tsalepilogi').innerHTML = tsalperiexomeno2;
        $("#method2info").mouseover(function () {
                                document.getElementById("method2info").style.border = "1px solid blue";
                               document.getElementById("method2info").style.cursor = "pointer";});
                            $("#method2info").mouseout(function () {
                                document.getElementById("method2info").style.border = "0px"; });
    $("#method2info").click(function () {
Dialog1.show('tsalkapone_method2info', infocontent_2);
    });
        if (localStorage.spear2sel) {document.getElementById('spear2sel').value = localStorage.getItem("spear2sel");}else { document.getElementById('spear2sel').value ="All units";}
     if (localStorage.sword2sel) {document.getElementById('sword2sel').value = localStorage.getItem("sword2sel");}else { document.getElementById('sword2sel').value ="All units";}
if (localStorage.axe2sel) {document.getElementById('axe2sel').value = localStorage.getItem("axe2sel");}else { document.getElementById('axe2sel').value ="All units";}
if (localStorage.archer2sel) {document.getElementById('archer2sel').value = localStorage.getItem("archer2sel");}else { document.getElementById('archer2sel').value ="All units";}
if (localStorage.spy2sel) {document.getElementById('spy2sel').value = localStorage.getItem("spy2sel");}else { document.getElementById('spy2sel').value ="All units";}
if (localStorage.light2sel) {document.getElementById('light2sel').value = localStorage.getItem("light2sel");}else { document.getElementById('light2sel').value ="All units";}
if (localStorage.heavy2sel) {document.getElementById('heavy2sel').value = localStorage.getItem("heavy2sel");}else { document.getElementById('heavy2sel').value ="All units";}
if (localStorage.marcher2sel) {document.getElementById('marcher2sel').value = localStorage.getItem("marcher2sel");}else { document.getElementById('marcher2sel').value ="All units";}
if (localStorage.ram2sel) {document.getElementById('ram2sel').value = localStorage.getItem("ram2sel");}else { document.getElementById('ram2sel').value ="All units";}
if (localStorage.cat2sel) {document.getElementById('cat2sel').value = localStorage.getItem("cat2sel");}else { document.getElementById('cat2sel').value ="All units";}
if (localStorage.tsalscriptmethod2) {document.getElementById('tsalscriptmethod2').value = localStorage.getItem("tsalscriptmethod2");}else { document.getElementById('tsalscriptmethod2').value ="All defensive units";}
if (localStorage.tsalcoords2) {document.getElementById('tsalcoords2').value = localStorage.getItem("tsalcoords2");}else { document.getElementById('tsalcoords2').value ="";}
        if (localStorage.tsalsplit2) {document.getElementById('tsalsplit2').value = localStorage.getItem("tsalsplit2");}else { document.getElementById('tsalsplit2').value ="No";}
        if (localStorage.tsalkey2) {document.getElementById('tsalkey2').value = localStorage.getItem("tsalkey2");}else { document.getElementById('tsalkey2').value ="";}
if (localStorage.tsalakey2) {document.getElementById('tsalakey2').value = localStorage.getItem("tsalakey2");}else { document.getElementById('tsalakey2').value ="";}
    if (localStorage.tsalname2) {document.getElementById('tsalname2').value = localStorage.getItem("tsalname2");}else { document.getElementById('tsalname2').value ="Support Script";}
        if (localStorage.tsalcriteria2) {document.getElementById('tsalcriteria2').value = localStorage.getItem("tsalcriteria2");}else { document.getElementById('tsalcriteria2').value ="Yes";}
      if (localStorage.spear2 !==null) {
   document.getElementById('spear2').value = localStorage.getItem('spear2');
   document.getElementById('spy2').value = localStorage.getItem('spy2');
   document.getElementById('sword2').value = localStorage.getItem('sword2');
document.getElementById('axe2').value = localStorage.getItem('axe2');
document.getElementById('archer2').value = localStorage.getItem('archer2');
document.getElementById('light2').value = localStorage.getItem('light2');
document.getElementById('heavy2').value = localStorage.getItem('heavy2');
document.getElementById('marcher2').value = localStorage.getItem('marcher2');
document.getElementById('ram2').value = localStorage.getItem('ram2');
document.getElementById('cat2').value = localStorage.getItem('cat2');
      }
        $("#Tsalcount2").click(function() {
localStorage.setItem('clickcount2',0);
 UI.SuccessMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.counts+'', 5000);

       });
        $("#Tsalhide").click(function() {
             document.getElementById('tsalepilogi').innerHTML ="";
              $("#Tsalsupport").removeClass("tsalselected");
         $("#Tsalsupport").removeClass("tsalselected");
         $("#Tsalfarming").removeClass("tsalselected");
        $("#Tsalfakes").removeClass("tsalselected");
        });
        $("#Tsalreset2").click(function() {
        localStorage.removeItem("spear2sel");
         localStorage.removeItem("sword2sel");
localStorage.removeItem("axe2sel");
localStorage.removeItem("archer2sel");
localStorage.removeItem("spy2sel");
localStorage.removeItem("light2sel");
localStorage.removeItem("heavy2sel");
localStorage.removeItem("marcher2sel");
localStorage.removeItem("ram2sel");
localStorage.removeItem("cat2sel");
localStorage.removeItem("tsalscriptmethod2");
            localStorage.removeItem("tsalcoords2");
            localStorage.removeItem("tsalsplit2");
             localStorage.removeItem("tsalname2");
             localStorage.removeItem("tsalkey2");
            localStorage.removeItem("tsalcriteria2");
 localStorage.removeItem("tsalakey2");
    localStorage.removeItem("spear2");
    localStorage.removeItem("sword2");
    localStorage.removeItem("axe2");
    localStorage.removeItem("archer2");
    localStorage.removeItem("spy2");
    localStorage.removeItem("light2");
    localStorage.removeItem("heavy2");
    localStorage.removeItem("marcher2");
    localStorage.removeItem("ram2");
    localStorage.removeItem("cat2");
            UI.SuccessMessage('<span id=tsalkaponesuccesssave><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.reset_all+'', 3000);
    setTimeout(function(){ location.reload(); }, 3000);
            });
        $("#Tsalsave2").click(function() {
            var tsalscriptmethod2 = document.getElementById('tsalscriptmethod2');
            var tsalakey2 = document.getElementById('tsalakey2');
var tsalkey2 = document.getElementById('tsalkey2');
            var tsalcoords2 = document.getElementById('tsalcoords2');
            var tsalsplit2 = document.getElementById('tsalsplit2');
            var tsalname2 = document.getElementById('tsalname2');
          var spear2sel = document.getElementById('spear2sel');
            var sword2sel = document.getElementById('sword2sel');
var axe2sel = document.getElementById('axe2sel');
var archer2sel = document.getElementById('archer2sel');
var spy2sel = document.getElementById('spy2sel');
var light2sel = document.getElementById('light2sel');
var heavy2sel = document.getElementById('heavy2sel');
var marcher2sel = document.getElementById('marcher2sel');
var ram2sel = document.getElementById('ram2sel');
var cat2sel = document.getElementById('cat2sel');
            var tsalcriteria2 = document.getElementById('tsalcriteria2');
                var spear2 = document.getElementById('spear2');
 var sword2 = document.getElementById('sword2');
var axe2 = document.getElementById('axe2');
var archer2 = document.getElementById('archer2');
var spy2 = document.getElementById('spy2');
 var light2 = document.getElementById('light2');
var heavy2 = document.getElementById('heavy2');
var marcher2 = document.getElementById('marcher2');
var ram2 = document.getElementById('ram2');
var cat2 = document.getElementById('cat2');
        localStorage.setItem("spear2sel", spear2sel.value);
         localStorage.setItem("sword2sel", sword2sel.value);
localStorage.setItem("axe2sel", axe2sel.value);
localStorage.setItem("archer2sel", archer2sel.value);
localStorage.setItem("spy2sel", spy2sel.value);
localStorage.setItem("light2sel", light2sel.value);
localStorage.setItem("heavy2sel", heavy2sel.value);
localStorage.setItem("marcher2sel", marcher2sel.value);
localStorage.setItem("ram2sel", ram2sel.value);
localStorage.setItem("cat2sel", cat2sel.value);
localStorage.setItem("tsalscriptmethod2", tsalscriptmethod2.value);
            localStorage.setItem("tsalcoords2", tsalcoords2.value);
            localStorage.setItem("tsalsplit2", tsalsplit2.value);
             localStorage.setItem("tsalname2", tsalname2.value);
             localStorage.setItem("tsalkey2", tsalkey2.value);
            localStorage.setItem("tsalcriteria2", tsalcriteria2.value);
 localStorage.setItem("tsalakey2", tsalakey2.value);
    localStorage.setItem("spear2", spear2.value);
    localStorage.setItem("sword2", sword2.value);
    localStorage.setItem("axe2", axe2.value);
    localStorage.setItem("archer2", archer2.value);
    localStorage.setItem("spy2",spy2.value);
    localStorage.setItem("light2", light2.value);
    localStorage.setItem("heavy2", heavy2.value);
    localStorage.setItem("marcher2", marcher2.value);
    localStorage.setItem("ram2", ram2.value);
    localStorage.setItem("cat2", cat2.value);
 UI.SuccessMessage('<span id=tsalkaponesuccesssave><b><font color=gold><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></font></b></span><br><br>'+tsalkapone_trans.notes.save+'', 3000);
    setTimeout(function(){ location.reload(); }, 3000);
    });
        $("#Tsalsupport").addClass("tsalselected");
         $("#Tsalnuke").removeClass("tsalselected");
         $("#Tsalfarming").removeClass("tsalselected");
        $("#Tsalfakes").removeClass("tsalselected");
    });
    }

   else   if (Tsalmap) {

       var tsalakey1 = localStorage.getItem('tsalakey1');
                var tsalakey2 = localStorage.getItem('tsalakey2');
                var tsalakey3 = localStorage.getItem('tsalakey3');
                var tsalakey4 = localStorage.getItem('tsalakey4');
       if (tsalakey1 !== null) { var tsalakey_title1 = tsalakey1;} else {tsalakey_title1=""+tsalkapone_trans.general.undef+"";}
       if (tsalakey2 !== null) { var tsalakey_title2 = tsalakey2;} else {tsalakey_title2=""+tsalkapone_trans.general.undef+"";}
if (tsalakey3 !== null) { var tsalakey_title3 = tsalakey3;} else {tsalakey_title3=""+tsalkapone_trans.general.undef+"";}
if (tsalakey4 !== null) { var tsalakey_title4 = tsalakey4;} else {tsalakey_title4=""+tsalkapone_trans.general.undef+"";}
       if (localStorage.tsalname1) {    var scripttitle1 = ""+localStorage.getItem('tsalname1')+"";} else { scripttitle1 = "Nuke Script";}
 if (localStorage.tsalname2) {    var scripttitle2 = ""+localStorage.getItem('tsalname2')+"";} else { scripttitle2 = "Support Script";}
 if (localStorage.tsalname3) {    var scripttitle3 = ""+localStorage.getItem('tsalname3')+"";} else { scripttitle3 = "Farming Script";}
if (localStorage.tsalname4) {    var scripttitle4 = ""+localStorage.getItem('tsalname4')+"";} else { scripttitle4 = "Fake Script";}
       if (tsalakey1 !== null || tsalakey2 !== null || tsalakey3 !== null || tsalakey4 !== null) {
var  menu='<div id="tsalkaponemagicscripttable" class="target-select clearfix vis float_left"><h4 height="20px;"><span class="tsaltooltip"><img src="/graphic/questionmark.png" style="height:15px; width:15px; cursor:help;"><span class="tsalinfo" >'+tsalkapone_trans.buttons.map_info+'</span></span>';
menu+='&emsp;<font color=maroon>Tsalkapone. '+tsalkapone_trans.general.func_list+'</font></h4>';
menu+='<table class="vis" style="width: 100%"><tbody><tr colspan="2"><td>';
menu+='<center><font style="font-family: \'Arial Black\', Gadget, sans-serif;"><span id="openfilter1"><input type="button" value="'+tsalkapone_trans.buttons.func_open+'" id="openfilterbut1" class="btn tsalbutton"></span><span id="closefilter1" style="display:none"><input class="btn tsalbutton" type="button" value="'+tsalkapone_trans.buttons.func_close+'" id="closefilterbut1"></span></center></td></tr>';
menu+='</tbody></table>';
menu+='<table id="columndis" style="display:none;width: 100%" class="vis"><tbody>';
menu+='<tr><th>'+tsalkapone_trans.general.shorts+'</th><th>'+tsalkapone_trans.general.funcs+'</th></tr>';
menu+='<tr><td>'+tsalakey_title1+'</td><td>'+scripttitle1+'</td></tr>';
menu+='<tr><td>'+tsalakey_title2+'</td><td>'+scripttitle2+'</td></tr>';
menu+='<tr><td>'+tsalakey_title3+'</td><td>'+scripttitle3+'</td></tr>';
menu+='<tr><td>'+tsalakey_title4+'</td><td>'+scripttitle4+'</td></tr>';
menu+='</tbody></table></span></div><br><br>';

    if (!document.getElementById('tsalkaponemagicscripttable')) {
$("#content_value").prepend(menu);  }

        else { {UI.SuccessMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.activated+'', 5000);}}
 $("#openfilterbut1").click(function(){
    document.getElementById('columndis').style.display="";
		document.getElementById('openfilter1').style.display="none";
		document.getElementById('closefilter1').style.display="";
    });
    $("#closefilterbut1").click(function(){
document.getElementById('columndis').style.display="none";
		document.getElementById('openfilter1').style.display="";
		document.getElementById('closefilter1').style.display="none";
    });
            $("#Tsalpausixronou1").mouseover(function () {
                                document.getElementById("Tsalpausixronou1").style.border = "1px solid blue";
                               document.getElementById("Tsalpausixronou1").style.cursor = "pointer";});
                            $("#Tsalpausixronou1").mouseout(function () {
                                document.getElementById("Tsalpausixronou1").style.border = "0px"; });

          shortcut.add(""+tsalakey1+"",function(){
                    var input_axe = document.getElementById('unit_input_axe');
var input_spear = document.getElementById('unit_input_spear');
var input_sword = document.getElementById('unit_input_sword');
var input_spy = document.getElementById('unit_input_spy');
var input_light = document.getElementById('unit_input_light');
var input_heavy = document.getElementById('unit_input_heavy');
var input_ram = document.getElementById('unit_input_ram');
var input_catapult = document.getElementById('unit_input_catapult');
if (document.getElementById('unit_input_archer')) {
var input_archer = document.getElementById('unit_input_archer');
var input_marcher = document.getElementById('unit_input_marcher');
}
           var mix = localStorage.getItem("tsalcriteria1");
           var scriptno = "tsalnuke1script";
          var tsaleidos = localStorage.getItem("tsalscriptmethod1");
      var δόρυ = localStorage.getItem("spear1");
       var ξίφος = localStorage.getItem('sword1');
       var τσεκούρι = localStorage.getItem('axe1');
       var ανιχνευτής = localStorage.getItem('spy1');
       var ελαφρύ = localStorage.getItem('light1');
       var βαρύ = localStorage.getItem('heavy1');
       var κριός = localStorage.getItem('ram1');
       var καταπέλτης = localStorage.getItem('cat1');
       var τοξότης = localStorage.getItem('archer1');
       var έφιππος = localStorage.getItem('marcher1');
       var spearall = localStorage.getItem('spear1sel');
       var swordall = localStorage.getItem('sword1sel');
var axeall = localStorage.getItem("axe1sel");
var spyall = localStorage.getItem('spy1sel');
var archerall = localStorage.getItem('archer1sel');
var marcherall = localStorage.getItem('marcher1sel');
var lightall = localStorage.getItem('light1sel');
var heavyall = localStorage.getItem('heavy1sel');
var ramall = localStorage.getItem('ram1sel');
var catapultall = localStorage.getItem('cat1sel');

       var Tsalkapone_συντεταγμένες = ""+localStorage.getItem('tsalcoords1')+"";
  if(!localStorage.tsalscriptmethod1)
  {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.values+'', 5000);}
 else {
if (document.getElementById('units_entry_all_spear')) {   var spear = parseInt( $('#units_entry_all_spear').text().replace(/[^0-9]/gi, ''));} else { spear = 0;}
 if (document.getElementById('units_entry_all_axe')) {   var axe = parseInt( $('#units_entry_all_axe').text().replace(/[^0-9]/gi, ''));} else { axe = 0;}
if (document.getElementById('units_entry_all_sword')) {   var sword = parseInt( $('#units_entry_all_sword').text().replace(/[^0-9]/gi, ''));} else { sword = 0;}
if (document.getElementById('units_entry_all_light')) {   var light = parseInt( $('#units_entry_all_light').text().replace(/[^0-9]/gi, ''));} else { light = 0;}
if (document.getElementById('units_entry_all_spy')) {   var spy = parseInt( $('#units_entry_all_spy').text().replace(/[^0-9]/gi, ''));} else { spy = 0;}
if (document.getElementById('units_entry_all_heavy')) {   var heavy = parseInt( $('#units_entry_all_heavy').text().replace(/[^0-9]/gi, ''));} else { heavy = 0;}
if (document.getElementById('units_entry_all_ram')) {   var ram = parseInt( $('#units_entry_all_ram').text().replace(/[^0-9]/gi, ''));} else { ram = 0;}
if (document.getElementById('units_entry_all_catapult')) {   var catapult = parseInt( $('#units_entry_all_catapult').text().replace(/[^0-9]/gi, ''));} else { catapult = 0;}
 if (document.getElementById('unit_input_archer')) {
if (document.getElementById('units_entry_all_archer')) { var archer = parseInt( $('#units_entry_all_archer').text().replace(/[^0-9]/gi, '')); }else { archer = 0;}
if (document.getElementById('units_entry_all_marcher')) { var marcher = parseInt( $('#units_entry_all_marcher').text().replace(/[^0-9]/gi, ''));} else { marcher = 0;}
}
     function tsalkapone_insert_troops() {

        if (spearall == "All units" && document.getElementById('units_entry_all_spear'))
  {d.forms[0].spear.value = spear;}
else if (spearall == "All more than" && spear > δόρυ) {  d.forms[0].spear.value = spear-δόρυ; }
else if (spearall == "Insert specific" && spear >= δόρυ) {   d.forms[0].spear.value = δόρυ; }
if (axeall == "All units" && document.getElementById('units_entry_all_axe'))
  {d.forms[0].axe.value= axe;}
else if (axeall == "All more than" && axe > τσεκούρι) {   d.forms[0].axe.value= axe-τσεκούρι; }
else if (axeall == "Insert specific" && axe >= τσεκούρι) {   d.forms[0].axe.value= τσεκούρι; }
if (swordall == "All units" && document.getElementById('units_entry_all_sword'))
  {d.forms[0].sword.value= sword;}
else if (swordall == "All more than" && sword > ξίφος) {   d.forms[0].sword.value= sword-ξίφος; }
else if (swordall == "Insert specific" && sword >= ξίφος) {   d.forms[0].sword.value= ξίφος; }
if (spyall == "All units" && document.getElementById('units_entry_all_spy'))
  {d.forms[0].spy.value= spy;}
else if (spyall == "All more than" && spy > ανιχνευτής) {   d.forms[0].spy.value= spy-ανιχνευτής; }
else if (spyall == "Insert specific" && spy >= ανιχνευτής) {   d.forms[0].spy.value= ανιχνευτής; }
if (lightall == "All units" && document.getElementById('units_entry_all_light'))
  {d.forms[0].light.value= light;}
else if (lightall == "All more than" && light > ελαφρύ) {   d.forms[0].light.value= light-ελαφρύ; }
else if (lightall == "Insert specific" && light >= ελαφρύ) {   d.forms[0].light.value= ελαφρύ; }
if (heavyall == "All units" && document.getElementById('units_entry_all_heavy'))
  {d.forms[0].heavy.value= heavy;}
else if (heavyall == "All more than" && heavy > βαρύ) {   d.forms[0].heavy.value= heavy-βαρύ; }
else if (heavyall == "Insert specific" && heavy >= βαρύ) {   d.forms[0].heavy.value= βαρύ; }
if (ramall == "All units" && document.getElementById('units_entry_all_ram'))
  {d.forms[0].ram.value= ram;}
else if (ramall == "All more than" && ram > κριός) {   d.forms[0].ram.value= ram-κριός; }
else if (ramall == "Insert specific" && ram >= κριός) {   d.forms[0].ram.value= κριός; }
if (catapultall == "All units" && document.getElementById('units_entry_all_catapult'))
  {d.forms[0].catapult.value= catapult;}
else if (catapultall == "All more than" && catapult > καταπέλτης) {   d.forms[0].catapult.value= catapult-καταπέλτης; }
else if (catapultall == "Insert specific" && catapult >= καταπέλτης) {   d.forms[0].catapult.value= καταπέλτης; }

          if (document.getElementById('unit_input_archer'))
         {
if (archerall == "All units" && document.getElementById('units_entry_all_archer'))
  {d.forms[0].archer.value= archer;}
else if (archerall == "All more than" && archer > τοξότης) {   d.forms[0].archer.value= archer-τοξότης; }
else if (archerall == "Insert specific" && archer >= τοξότης) {   d.forms[0].archer.value= τοξότης; }
if (marcherall == "All units" && document.getElementById('units_entry_all_marcher'))
  {d.forms[0].marcher.value= marcher;}
else if (marcherall == "All more than" && marcher > έφιππος) {   d.forms[0].marcher.value= marcher-έφιππος; }
else if (marcherall == "Insert specific" && marcher >= έφιππος) {   d.forms[0].marcher.value= έφιππος; }
         }}
         if (tsaleidos == "All troops") { $('#selectAllUnits').click(); }
  else if (tsaleidos == "All offensive units+scouts")
         { input_axe.value= axe; input_light.value= light; input_ram.value= ram; input_spy.value= spy; if (document.getElementById('unit_input_archer')) { input_marcher.value= marcher;}}
   else if (tsaleidos == "All offensive units+heavy+scouts")
         { input_axe.value= axe; input_light.value= light; input_heavy.value= heavy; input_ram.value= ram; input_spy.value= spy; if (document.getElementById('unit_input_archer')) { input_marcher.value= marcher;}}
 else if (tsaleidos == "All offensive+scouts, not rams")
         { input_axe.value= axe; input_light.value= light; input_spy.value= spy; if (document.getElementById('unit_input_archer')) { input_marcher.value= marcher;}}
 else if (tsaleidos == "All offensive units")
         { input_axe.value= axe; input_light.value= light; if (document.getElementById('unit_input_archer')) { input_marcher.value= marcher;}}
 else if (tsaleidos == "All light cavalry")
         { input_light.value= light;}
 else if (tsaleidos == "All cavalry units")
         { input_heavy.value= heavy; input_light.value= light; if (document.getElementById('unit_input_archer')) { input_marcher.value= marcher;}}
           else if (tsaleidos == "Adjusted settings")   {
               if (mix =="Yes") {
               if (!document.getElementById('unit_input_archer') && spear >= δόρυ && axe >= τσεκούρι && sword >= ξίφος && spy >= ανιχνευτής && light >= ελαφρύ && heavy >= βαρύ && ram >= κριός && catapult >= καταπέλτης)
               { tsalkapone_insert_troops(); }
               else if (document.getElementById('unit_input_archer') && archer >= τοξότης && marcher >= έφιππος && spear >= δόρυ && axe >= τσεκούρι && sword >= ξίφος && spy >= ανιχνευτής && light >= ελαφρύ && heavy >= βαρύ && ram >= κριός && catapult >= καταπέλτης)
         {  tsalkapone_insert_troops();  }
               else {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.req+'', 5000);}}
               else { tsalkapone_insert_troops(); } }

 }});

          shortcut.add(""+tsalakey2+"",function(){
                    var input_axe = document.getElementById('unit_input_axe');
var input_spear = document.getElementById('unit_input_spear');
var input_sword = document.getElementById('unit_input_sword');
var input_spy = document.getElementById('unit_input_spy');
var input_light = document.getElementById('unit_input_light');
var input_heavy = document.getElementById('unit_input_heavy');
var input_ram = document.getElementById('unit_input_ram');
var input_catapult = document.getElementById('unit_input_catapult');
if (document.getElementById('unit_input_archer')) {
var input_archer = document.getElementById('unit_input_archer');
var input_marcher = document.getElementById('unit_input_marcher');
}
           var mix = localStorage.getItem("tsalcriteria2");
           var scriptno = "tsalnuke2script";
           var split = parseInt(localStorage.getItem("tsalsplit2").replace(/[^0-9]/gi, ''));
          var tsaleidos = localStorage.getItem("tsalscriptmethod2");
        var splitactive =  localStorage.getItem("tsalsplit2");
      var δόρυ = localStorage.getItem("spear2");
       var ξίφος = localStorage.getItem('sword2');
       var τσεκούρι = localStorage.getItem('axe2');
       var ανιχνευτής = localStorage.getItem('spy2');
       var ελαφρύ = localStorage.getItem('light2');
       var βαρύ = localStorage.getItem('heavy2');
       var κριός = localStorage.getItem('ram2');
       var καταπέλτης = localStorage.getItem('cat2');
       var τοξότης = localStorage.getItem('archer2');
       var έφιππος = localStorage.getItem('marcher2');
       var spearall = localStorage.getItem('spear2sel');
       var swordall = localStorage.getItem('sword2sel');
var axeall = localStorage.getItem("axe2sel");
var spyall = localStorage.getItem('spy2sel');
var archerall = localStorage.getItem('archer2sel');
var marcherall = localStorage.getItem('marcher2sel');
var lightall = localStorage.getItem('light2sel');
var heavyall = localStorage.getItem('heavy2sel');
var ramall = localStorage.getItem('ram2sel');
var catapultall = localStorage.getItem('cat2sel');

       var Tsalkapone_συντεταγμένες = ""+localStorage.getItem('tsalcoords2')+"";
  if(!localStorage.tsalscriptmethod2)
  {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.values+'', 5000);}
 else {
if (document.getElementById('units_entry_all_spear')) {   var spear = parseInt( $('#units_entry_all_spear').text().replace(/[^0-9]/gi, ''));} else { spear = 0;}
 if (document.getElementById('units_entry_all_axe')) {   var axe = parseInt( $('#units_entry_all_axe').text().replace(/[^0-9]/gi, ''));} else { axe = 0;}
if (document.getElementById('units_entry_all_sword')) {   var sword = parseInt( $('#units_entry_all_sword').text().replace(/[^0-9]/gi, ''));} else { sword = 0;}
if (document.getElementById('units_entry_all_light')) {   var light = parseInt( $('#units_entry_all_light').text().replace(/[^0-9]/gi, ''));} else { light = 0;}
if (document.getElementById('units_entry_all_spy')) {   var spy = parseInt( $('#units_entry_all_spy').text().replace(/[^0-9]/gi, ''));} else { spy = 0;}
if (document.getElementById('units_entry_all_heavy')) {   var heavy = parseInt( $('#units_entry_all_heavy').text().replace(/[^0-9]/gi, ''));} else { heavy = 0;}
if (document.getElementById('units_entry_all_ram')) {   var ram = parseInt( $('#units_entry_all_ram').text().replace(/[^0-9]/gi, ''));} else { ram = 0;}
if (document.getElementById('units_entry_all_catapult')) {   var catapult = parseInt( $('#units_entry_all_catapult').text().replace(/[^0-9]/gi, ''));} else { catapult = 0;}
 if (document.getElementById('unit_input_archer')) {
if (document.getElementById('units_entry_all_archer')) { var archer = parseInt( $('#units_entry_all_archer').text().replace(/[^0-9]/gi, '')); }else { archer = 0;}
if (document.getElementById('units_entry_all_marcher')) { var marcher = parseInt( $('#units_entry_all_marcher').text().replace(/[^0-9]/gi, ''));} else { marcher = 0;}
}
     function tsalkapone_insert_troops() {

        if (spearall == "All units" && document.getElementById('units_entry_all_spear'))
  {d.forms[0].spear.value = spear;}
else if (spearall == "All more than" && spear > δόρυ) {  d.forms[0].spear.value = spear-δόρυ; }
else if (spearall == "Insert specific" && spear >= δόρυ) {   d.forms[0].spear.value = δόρυ; }
if (axeall == "All units" && document.getElementById('units_entry_all_axe'))
  {d.forms[0].axe.value= axe;}
else if (axeall == "All more than" && axe > τσεκούρι) {   d.forms[0].axe.value= axe-τσεκούρι; }
else if (axeall == "Insert specific" && axe >= τσεκούρι) {   d.forms[0].axe.value= τσεκούρι; }
if (swordall == "All units" && document.getElementById('units_entry_all_sword'))
  {d.forms[0].sword.value= sword;}
else if (swordall == "All more than" && sword > ξίφος) {   d.forms[0].sword.value= sword-ξίφος; }
else if (swordall == "Insert specific" && sword >= ξίφος) {   d.forms[0].sword.value= ξίφος; }
if (spyall == "All units" && document.getElementById('units_entry_all_spy'))
  {d.forms[0].spy.value= spy;}
else if (spyall == "All more than" && spy > ανιχνευτής) {   d.forms[0].spy.value= spy-ανιχνευτής; }
else if (spyall == "Insert specific" && spy >= ανιχνευτής) {   d.forms[0].spy.value= ανιχνευτής; }
if (lightall == "All units" && document.getElementById('units_entry_all_light'))
  {d.forms[0].light.value= light;}
else if (lightall == "All more than" && light > ελαφρύ) {   d.forms[0].light.value= light-ελαφρύ; }
else if (lightall == "Insert specific" && light >= ελαφρύ) {   d.forms[0].light.value= ελαφρύ; }
if (heavyall == "All units" && document.getElementById('units_entry_all_heavy'))
  {d.forms[0].heavy.value= heavy;}
else if (heavyall == "All more than" && heavy > βαρύ) {   d.forms[0].heavy.value= heavy-βαρύ; }
else if (heavyall == "Insert specific" && heavy >= βαρύ) {   d.forms[0].heavy.value= βαρύ; }
if (ramall == "All units" && document.getElementById('units_entry_all_ram'))
  {d.forms[0].ram.value= ram;}
else if (ramall == "All more than" && ram > κριός) {   d.forms[0].ram.value= ram-κριός; }
else if (ramall == "Insert specific" && ram >= κριός) {   d.forms[0].ram.value= κριός; }
if (catapultall == "All units" && document.getElementById('units_entry_all_catapult'))
  {d.forms[0].catapult.value= catapult;}
else if (catapultall == "All more than" && catapult > καταπέλτης) {   d.forms[0].catapult.value= catapult-καταπέλτης; }
else if (catapultall == "Insert specific" && catapult >= καταπέλτης) {   d.forms[0].catapult.value= καταπέλτης; }

          if (document.getElementById('unit_input_archer'))
         {
if (archerall == "All units" && document.getElementById('units_entry_all_archer'))
  {d.forms[0].archer.value= archer;}
else if (archerall == "All more than" && archer > τοξότης) {   d.forms[0].archer.value= archer-τοξότης; }
else if (archerall == "Insert specific" && archer >= τοξότης) {   d.forms[0].archer.value= τοξότης; }
if (marcherall == "All units" && document.getElementById('units_entry_all_marcher'))
  {d.forms[0].marcher.value= marcher;}
else if (marcherall == "All more than" && marcher > έφιππος) {   d.forms[0].marcher.value= marcher-έφιππος; }
else if (marcherall == "Insert specific" && marcher >= έφιππος) {   d.forms[0].marcher.value= έφιππος; }
         }}
             if (tsaleidos == "All troops") { $('#selectAllUnits').click(); }
  else if (tsaleidos == "All defensive units+catapults+scouts")
  {if (splitactive != "No") {
    input_spear.value= Math.ceil(spear/split); input_sword.value= Math.ceil(sword/split); input_spy.value= Math.ceil(spy/split); input_heavy.value= Math.ceil(heavy/split); input_catapult.value= Math.ceil(catapult/split);  if (document.getElementById('unit_input_archer')) { input_archer.value= Math.ceil(archer/split);}
  }
   else
      { input_spear.value= spear; input_sword.value= sword; input_catapult.value= catapult;  input_heavy.value= heavy; input_spy.value= spy; if (document.getElementById('unit_input_archer')) { input_archer.value= archer;}
  }}
else if (tsaleidos == "All defensive units+scouts")
  {if (splitactive != "No") {
    input_spear.value= Math.ceil(spear/split); input_sword.value= Math.ceil(sword/split); input_spy.value= Math.ceil(spy/split); input_heavy.value= Math.ceil(heavy/split);  if (document.getElementById('unit_input_archer')) { input_archer.value= Math.ceil(archer/split);}
  }
   else
      { input_spear.value= spear; input_sword.value= sword;  input_heavy.value= heavy; input_spy.value= spy; if (document.getElementById('unit_input_archer')) { input_archer.value= archer;}
  }}
else if (tsaleidos == "All defensive units")
  {if (splitactive != "No") {
    input_spear.value= Math.ceil(spear/split); input_sword.value= Math.ceil(sword/split);  input_heavy.value= Math.ceil(heavy/split);  if (document.getElementById('unit_input_archer')) { input_archer.value= Math.ceil(archer/split);}
  }
   else
      { input_spear.value= spear; input_sword.value= sword;  input_heavy.value= heavy;  if (document.getElementById('unit_input_archer')) { input_archer.value= archer;}
  }}
     else if (tsaleidos == "All non-cavalry defensive")
           {if (splitactive != "No")
{ input_spear.value= Math.ceil(spear/split); input_sword.value= Math.ceil(sword/split);  if (document.getElementById('unit_input_archer')) { input_archer.value= Math.ceil(archer/split);}}
else   { input_spear.value= spear; input_sword.value= sword;  if (document.getElementById('unit_input_archer')) { input_archer.value= archer;}}}
          else if (tsaleidos == "All heavy")
     {
         if (splitactive != "No") {input_heavy.value= Math.ceil(heavy/split);}
   else {         input_heavy.value= heavy;}}
    else if (tsaleidos == "All spears and archers")
    {   if (splitactive != "No")    { input_spear.value= Math.ceil(spear/split);  if (document.getElementById('unit_input_archer')) { input_archer.value= Math.ceil(archer/split);}}
 else   { input_spear.value= spear;  if (document.getElementById('unit_input_archer')) { input_archer.value= archer;}}   }
      else if (tsaleidos == "All swords")
           { if (splitactive != "No") {input_sword.value= Math.ceil(sword/split);} else {input_sword.value= sword;}}
            else if (tsaleidos == "All catapults")
           { if (splitactive != "No") {input_catapult.value= Math.ceil(catapult/split);} else {input_catapult.value= catapult;}}
             else if (tsaleidos == "All scouts")
           { if (splitactive != "No") {input_spy.value= Math.ceil(spy/split);}  else {input_spy.value= spy;}}
           else if (tsaleidos == "Adjusted settings")   {
               if (mix =="Yes") {
               if (!document.getElementById('unit_input_archer') && spear >= δόρυ && axe >= τσεκούρι && sword >= ξίφος && spy >= ανιχνευτής && light >= ελαφρύ && heavy >= βαρύ && ram >= κριός && catapult >= καταπέλτης)
               { tsalkapone_insert_troops(); }
               else if (document.getElementById('unit_input_archer') && archer >= τοξότης && marcher >= έφιππος && spear >= δόρυ && axe >= τσεκούρι && sword >= ξίφος && spy >= ανιχνευτής && light >= ελαφρύ && heavy >= βαρύ && ram >= κριός && catapult >= καταπέλτης)
         {  tsalkapone_insert_troops();  }
               else {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.req+'', 5000);}}
               else { tsalkapone_insert_troops(); } }

 }});

       shortcut.add(""+tsalakey3+"",function(){
                    var input_axe = document.getElementById('unit_input_axe');
var input_spear = document.getElementById('unit_input_spear');
var input_sword = document.getElementById('unit_input_sword');
var input_spy = document.getElementById('unit_input_spy');
var input_light = document.getElementById('unit_input_light');
var input_heavy = document.getElementById('unit_input_heavy');
var input_ram = document.getElementById('unit_input_ram');
var input_catapult = document.getElementById('unit_input_catapult');
if (document.getElementById('unit_input_archer')) {
var input_archer = document.getElementById('unit_input_archer');
var input_marcher = document.getElementById('unit_input_marcher');
}
         var scriptno ="tsalfarmingscript";
         var tsaleidos = localStorage.getItem("tsalscriptmethod3");
       var δόρυ = localStorage.getItem("spear3");
       var ξίφος = localStorage.getItem('sword3');
       var τσεκούρι = localStorage.getItem('axe3');
       var ανιχνευτής = localStorage.getItem('spy3');
       var ελαφρύ = localStorage.getItem('light3');
       var βαρύ = localStorage.getItem('heavy3');
       var κριός = localStorage.getItem('ram3');
       var καταπέλτης = localStorage.getItem('cat3');
       var τοξότης = localStorage.getItem('archer3');
       var έφιππος = localStorage.getItem('marcher3');
       var spearall = localStorage.getItem('spear3sel');
       var swordall = localStorage.getItem('sword3sel');
var axeall = localStorage.getItem("axe3sel");
var spyall = localStorage.getItem('spy3sel');
var archerall = localStorage.getItem('archer3sel');
var marcherall = localStorage.getItem('marcher3sel');
var lightall = localStorage.getItem('light3sel');
var heavyall = localStorage.getItem('heavy3sel');
var ramall = localStorage.getItem('ram3sel');
var catapultall = localStorage.getItem('cat3sel');

       var Tsalkapone_συντεταγμένες = ""+localStorage.getItem('tsalcoords3')+"";
  if(!localStorage.tsalscriptmethod3)
  {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.values+'', 5000);}
 else {
if (document.getElementById('units_entry_all_spear')) {   var spear = parseInt( $('#units_entry_all_spear').text().replace(/[^0-9]/gi, ''));} else { spear = 0;}
 if (document.getElementById('units_entry_all_axe')) {   var axe = parseInt( $('#units_entry_all_axe').text().replace(/[^0-9]/gi, ''));} else { axe = 0;}
if (document.getElementById('units_entry_all_sword')) {   var sword = parseInt( $('#units_entry_all_sword').text().replace(/[^0-9]/gi, ''));} else { sword = 0;}
if (document.getElementById('units_entry_all_light')) {   var light = parseInt( $('#units_entry_all_light').text().replace(/[^0-9]/gi, ''));} else { light = 0;}
if (document.getElementById('units_entry_all_spy')) {   var spy = parseInt( $('#units_entry_all_spy').text().replace(/[^0-9]/gi, ''));} else { spy = 0;}
if (document.getElementById('units_entry_all_heavy')) {   var heavy = parseInt( $('#units_entry_all_heavy').text().replace(/[^0-9]/gi, ''));} else { heavy = 0;}
if (document.getElementById('units_entry_all_ram')) {   var ram = parseInt( $('#units_entry_all_ram').text().replace(/[^0-9]/gi, ''));} else { ram = 0;}
if (document.getElementById('units_entry_all_catapult')) {   var catapult = parseInt( $('#units_entry_all_catapult').text().replace(/[^0-9]/gi, ''));} else { catapult = 0;}
 if (document.getElementById('unit_input_archer')) {
if (document.getElementById('units_entry_all_archer')) { var archer = parseInt( $('#units_entry_all_archer').text().replace(/[^0-9]/gi, '')); }else { archer = 0;}
if (document.getElementById('units_entry_all_marcher')) { var marcher = parseInt( $('#units_entry_all_marcher').text().replace(/[^0-9]/gi, ''));} else { marcher = 0;}
}


function tsalkapone_insert_troops1() {
 if (lightall == "Insert specific" && light >= ελαφρύ) {   input_light.value= ελαφρύ; }
else if (lightall == "All remaining" && light >= ελαφρύ) {   input_light.value= ελαφρύ; }
else if (lightall == "All remaining" && light < ελαφρύ && light>0) {   input_light.value= light; }
 else if (heavyall == "Insert specific" && heavy >= βαρύ) {   input_heavy.value= βαρύ; }
else if (heavyall == "All remaining" && heavy >= βαρύ) {   input_heavy.value= βαρύ; }
else if (heavyall == "All remaining" && heavy < βαρύ && heavy>0 ) {   input_heavy.value= heavy; }
     else if (document.getElementById('unit_input_archer'))
         {  if (marcherall == "Insert specific" && marcher >= έφιππος) {   input_marcher.value= έφιππος; }
else if (marcherall == "All remaining" && marcher >= έφιππος) {   input_marcher.value= έφιππος; }
else if (marcherall == "All remaining" && marcher < έφιππος && marcher>0) {   input_marcher.value= marcher; }
         }
else if (axeall == "Insert specific" && axe >= τσεκούρι) {   input_axe.value= τσεκούρι; }
else if (axeall == "All remaining" && axe >= τσεκούρι) {   input_axe.value= τσεκούρι; }
else if (axeall == "All remaining" && axe < τσεκούρι && axe>0) {   input_axe.value= axe; }
    else if (spearall == "Insert specific" && spear >= δόρυ) {   input_spear.value= δόρυ; }
else if (spearall == "All remaining" && spear >= δόρυ) {   input_spear.value= δόρυ; }
else if (spearall == "All remaining" && spear < δόρυ && spear>0) {   input_spear.value= spear; }
  else if (document.getElementById('unit_input_archer'))
         {
 if (archerall == "Insert specific" && archer >= τοξότης) {   input_archer.value= τοξότης; }
else if (archerall == "All remaining" && archer >= τοξότης) {   input_archer.value= τοξότης; }
else if (archerall == "All remaining" && archer < τοξότης && archer>0) {   input_archer.value= archer; }
}
    else if (swordall == "Insert specific" && sword >= ξίφος) {   input_sword.value= ξίφος; }
else if (swordall == "All remaining" && sword >= ξίφος) {   input_sword.value= ξίφος; }
else if (swordall == "All remaining" && sword < ξίφος && sword>0) {   input_sword.value= sword; }
     if (ramall == "None" && document.getElementById('units_entry_all_ram'))
  {input_ram.value= 0;}
    else if (ramall == "Insert specific" && ram >= κριός) {   input_ram.value= κριός; }
else if (ramall == "All remaining" && ram >= κριός) {   input_ram.value= κριός; }
    else if (ramall == "All remaining" && ram <= κριός && ram>0) {   input_ram.value= ram; }
if (catapultall == "None" && document.getElementById('units_entry_all_catapult'))
  {input_catapult.value= 0;}
    else if (catapultall == "Insert specific" && catapult >= καταπέλτης) {   input_catapult.value= καταπέλτης; }
    else if (catapultall == "All remaining" && catapult >= καταπέλτης) {   input_catapult.value= καταπέλτης; }
else if (catapultall == "All remaining" && catapult <= καταπέλτης && catapult>0) {   input_catapult.value= catapult; }
if (spyall == "None" && document.getElementById('units_entry_all_spy'))
  {input_spy.value= 0;}
    else if (spyall == "Insert specific" && spy >= ανιχνευτής) {   input_spy.value= ανιχνευτής; }
    else if (spyall == "All remaining" && spy >= ανιχνευτής) {   input_spy.value= ανιχνευτής; }
else if (spyall == "All remaining" && spy <= ανιχνευτής && spy>0) {   input_spy.value= spy; }
}
     function tsalkapone_insert_troops2() {
 if (swordall == "Insert specific" && sword >= ξίφος) {   input_sword.value= ξίφος; }
else if (swordall == "All remaining" && sword >= ξίφος) {   input_sword.value= ξίφος; }
else if (swordall == "All remaining" && sword < ξίφος && sword>0) {   input_sword.value= sword; }
else if (document.getElementById('unit_input_archer') && archerall == "Insert specific" && archer >= τοξότης) {   input_archer.value= τοξότης; }
else if (document.getElementById('unit_input_archer') && archerall == "All remaining" && archer >= τοξότης) {   input_archer.value= τοξότης; }
else if (document.getElementById('unit_input_archer') && archerall == "All remaining" && archer < τοξότης && archer>0) {   input_archer.value= archer; }
 else if (spearall == "Insert specific" && spear >= δόρυ) {   input_spear.value= δόρυ; }
else if (spearall == "All remaining" && spear >= δόρυ) {   input_spear.value= δόρυ; }
else if (spearall == "All remaining" && spear < δόρυ && spear>0) {   input_spear.value= spear; }
else if (axeall == "Insert specific" && axe >= τσεκούρι) {   input_axe.value= τσεκούρι; }
else if (axeall == "All remaining" && axe >= τσεκούρι) {   input_axe.value= τσεκούρι; }
else if (axeall == "All remaining" && axe < τσεκούρι && axe>0) {   input_axe.value= axe; }
  else if (document.getElementById('unit_input_archer'))
         {  if (marcherall == "Insert specific" && marcher >= έφιππος) {   input_marcher.value= έφιππος; }
else if (marcherall == "All remaining" && marcher >= έφιππος) {   input_marcher.value= έφιππος; }
else if (marcherall == "All remaining" && marcher < έφιππος && marcher>0) {   input_marcher.value= marcher; }
         }
else if (heavyall == "Insert specific" && heavy >= βαρύ) {   input_heavy.value= βαρύ; }
else if (heavyall == "All remaining" && heavy >= βαρύ) {   input_heavy.value= βαρύ; }
else if (heavyall == "All remaining" && heavy < βαρύ && heavy>0 ) {   input_heavy.value= heavy; }
else if (lightall == "Insert specific" && light >= ελαφρύ) {   input_light.value= ελαφρύ; }
else if (lightall == "All remaining" && light >= ελαφρύ) {   input_light.value= ελαφρύ; }
else if (lightall == "All remaining" && light < ελαφρύ && light>0) {   input_light.value= light; }
 if (ramall == "None" && document.getElementById('units_entry_all_ram'))
  {input_ram.value= 0;}
    else if (ramall == "Insert specific" && ram >= κριός) {   input_ram.value= κριός; }
else if (ramall == "All remaining" && ram >= κριός) {   input_ram.value= κριός; }
    else if (ramall == "All remaining" && ram <= κριός && ram>0) {   input_ram.value= ram; }
if (catapultall == "None" && document.getElementById('units_entry_all_catapult'))
  {input_catapult.value= 0;}
    else if (catapultall == "Insert specific" && catapult >= καταπέλτης) {   input_catapult.value= καταπέλτης; }
    else if (catapultall == "All remaining" && catapult >= καταπέλτης) {   input_catapult.value= καταπέλτης; }
else if (catapultall == "All remaining" && catapult <= καταπέλτης && catapult>0) {   input_catapult.value= catapult; }
if (spyall == "None" && document.getElementById('units_entry_all_spy'))
  {input_spy.value= 0;}
    else if (spyall == "Insert specific" && spy >= ανιχνευτής) {   input_spy.value= ανιχνευτής; }
    else if (spyall == "All remaining" && spy >= ανιχνευτής) {   input_spy.value= ανιχνευτής; }
else if (spyall == "All remaining" && spy <= ανιχνευτής && spy>0) {   input_spy.value= spy; }
}
     if (tsaleidos == "By ascending speed") {tsalkapone_insert_troops1();    }
  else    if (tsaleidos == "By descending speed") {tsalkapone_insert_troops2();    }


 }});


        shortcut.add(""+tsalakey4+"",function(){
                    var input_axe = document.getElementById('unit_input_axe');
var input_spear = document.getElementById('unit_input_spear');
var input_sword = document.getElementById('unit_input_sword');
var input_spy = document.getElementById('unit_input_spy');
var input_light = document.getElementById('unit_input_light');
var input_heavy = document.getElementById('unit_input_heavy');
var input_ram = document.getElementById('unit_input_ram');
var input_catapult = document.getElementById('unit_input_catapult');
if (document.getElementById('unit_input_archer')) {
var input_archer = document.getElementById('unit_input_archer');
var input_marcher = document.getElementById('unit_input_marcher');
}
var tsaleidos = localStorage.getItem("tsalscriptmethod4");
      var spear_in = localStorage.getItem("spear4");
       var sword_in = localStorage.getItem('sword4');
       var axe_in = localStorage.getItem('axe4');
       var spy_in = localStorage.getItem('spy4');
       var light_in = localStorage.getItem('light4');
       var heavy_in = localStorage.getItem('heavy4');
       var ram_in = localStorage.getItem('ram4');
       var catapult_in = localStorage.getItem('cat4');
       var archer_in = localStorage.getItem('archer4');
       var marcher_in = localStorage.getItem('marcher4');


  if(!localStorage.tsalscriptmethod4)
  {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.values+'', 5000);}
 else {

if (document.getElementById('units_entry_all_spear')) {   var spear = parseInt( $('#units_entry_all_spear').text().replace(/[^0-9]/gi, ''));} else { spear = 0;}
 if (document.getElementById('units_entry_all_axe')) {   var axe = parseInt( $('#units_entry_all_axe').text().replace(/[^0-9]/gi, ''));} else { axe = 0;}
if (document.getElementById('units_entry_all_sword')) {   var sword = parseInt( $('#units_entry_all_sword').text().replace(/[^0-9]/gi, ''));} else { sword = 0;}
if (document.getElementById('units_entry_all_light')) {   var light = parseInt( $('#units_entry_all_light').text().replace(/[^0-9]/gi, ''));} else { light = 0;}
if (document.getElementById('units_entry_all_spy')) {   var spy = parseInt( $('#units_entry_all_spy').text().replace(/[^0-9]/gi, ''));} else { spy = 0;}
if (document.getElementById('units_entry_all_heavy')) {   var heavy = parseInt( $('#units_entry_all_heavy').text().replace(/[^0-9]/gi, ''));} else { heavy = 0;}
if (document.getElementById('units_entry_all_ram')) {   var ram = parseInt( $('#units_entry_all_ram').text().replace(/[^0-9]/gi, ''));} else { ram = 0;}
if (document.getElementById('units_entry_all_catapult')) {   var catapult = parseInt( $('#units_entry_all_catapult').text().replace(/[^0-9]/gi, ''));} else { catapult = 0;}
 if (document.getElementById('unit_input_archer')) {
if (document.getElementById('units_entry_all_archer')) { var archer = parseInt( $('#units_entry_all_archer').text().replace(/[^0-9]/gi, '')); }else { archer = 0;}
if (document.getElementById('units_entry_all_marcher')) { var marcher = parseInt( $('#units_entry_all_marcher').text().replace(/[^0-9]/gi, ''));} else { marcher = 0;}
}

if (ram>=ram_in && ram_in!=0) {input_ram.value = ram_in;}
else if (catapult>=catapult_in && catapult_in!=0) {input_catapult.value = catapult_in;}
else if (sword>=sword_in && sword_in!=0) {input_sword.value = sword_in;}
else if (spear>=spear_in && spear_in!=0) {input_spear.value = spear_in;}
else if (axe>=axe_in && axe_in!=0) {input_axe.value = axe_in;}
else if (archer>=archer_in && document.getElementById('unit_input_archer') && archer_in!=0) {input_archer.value = archer_in;}
else if (heavy>=heavy_in && heavy_in!=0) {input_heavy.value = heavy_in;}
else if (marcher>=marcher_in && document.getElementById('unit_input_marcher') && marcher_in!=0) {input_marcher.value = marcher_in;}
else if (light>=light_in && light_in!=0) {input_light.value = light_in;}
else {UI.ErrorMessage('<font color=gold><b><center><u>'+tsalkapone_trans.general.notification+' Tsalkapone</u></center></b></font> <br><br> '+tsalkapone_trans.notes.no_units+'', 5000);}

if (spy>=spy_in && spy_in!=0) {input_spy.value=spy_in;}




 }


 });

        }
       else     { UI.ErrorMessage("<font color=gold><b><center>"+tsalkapone_trans.general.notification+" Tsalkapone</center></b></font> <br><br>"+tsalkapone_trans.notes.no_keys+"",8000); }
   }

    else if (!tsalrallypointpage && !Tsalrallypointpage2 && !Tsalrallypointpage3 && !Tsalrallypointpage4 && !Tsalrallypointpage5 && !Tsalrallypointpage6 && !Tsalrallypointpage7 && !Tsalmap){
        var contact_url ="https://forum.tribalwars.net/index.php?members/tsalkapone.114063/";
          var villas=$("table[class=content-border]").clone();
                       $('tr', villas).filter(function() { return $(this).css('display') == 'none'; }).remove();
                        var χωριά = villas.html().match(/\d+\|\d+/g);

                        if (χωριά&&(χωριά.length>0))
                        {var  συντεταγμένες= χωριά.join(" ");

                              if (lang == "english") {
       var content = '<div style=max-width:1000px;>' +
'<h2 class="popup_box_header"><center><u><font color="darkgreen">Tsalkapone. '+tsalkapone_trans.general.coordsfinder+'</font></u></center></h2>' +
'<p>There were found <font color=maroon><b>'+χωριά.length+'</b></font> coordinates in this page, excluding the coordinates of your current active village.</p>' +
'<p>The coords are listed below:</p><textarea id="tsalxwria" rows="5" cols="100">'+συντεταγμένες+'</textarea>' +
'<hr><center><font size="3" color="maroon"><b><u>Available actions</u></b></font></center><br>'+
'<p align="justify"><font  color="maroon">Each function refers to the coords existing in the displayed textarea. You may modify it by adding or erasing coords. Notice that you can\'t add the coords more than once in each script. Also, don\'t be afraid if you accidentally click to replace when you want to add or if you didn\'t modify the coords as needed. The coords will be saved when you close this window.</font></p>'+
'<input type="button" class="btn tsalbutton float_left" id="add_nuke" value="Add to nuke script coords">&emsp;<input type="button" class="btn tsalbutton float_right" id="replace_nuke" value="Replace the nuke script coords">'+
'<br><br><input type="button" class="btn tsalbutton float_left" id="add_support" value="Add to support script coords">&emsp;<input type="button" class="btn tsalbutton float_right" id="replace_support" value="Replace the support script coords">'+
'<br><br><input type="button" class="btn tsalbutton float_left" id="add_farming" value="Add to farming script coords">&emsp;<input type="button" class="btn tsalbutton float_right" id="replace_farming" value="Replace the farming script coords">'+
'<br><br><input type="button" class="btn tsalbutton float_left" id="add_fake" value="Add to fake script coords">&emsp;<input type="button" class="btn tsalbutton float_right" id="replace_fake" value="Replace the fake script coords">'+
'<br><br><hr><span id="result"></span>'+
'<br><br><center><img class="tooltip-delayed" title="<font color=darkgreen>Tsalkapone. Coords Finder</font>" src="https://dl.dropboxusercontent.com/s/dt6t7jl1dqkjja9/Tsalkapone_joker.jpg" style="cursor:help; position: relative"></center><br><center><p>Feel free to communicate for any idea or subject concerning scripts with <a href="'+contact_url+'" title="Open in a new tab the profile of Tsalkapone in the official forum" target="_blank">Tsalkapone</a>.</p></center>' +
'</div>';
            }
             else if (lang == "greek") {
       var content = '<div style=max-width:1000px;>' +
'<h2 class="popup_box_header"><center><u><font color="darkgreen">Tsalkapone. '+tsalkapone_trans.general.coordsfinder+'</font></u></center></h2>' +
'<p>Βρέθηκαν συνολικά <font color=maroon><b>'+χωριά.length+'</b></font> συντεταγμένες στη τρέχουσα σελίδα, εκτός από τις συντεταγμένες του ενεργού σας χωριού.</p>' +
'<p>Οι εξαχθέντες συντεταγμένες είναι οι εξής:</p><textarea id="tsalxwria" rows="5" cols="100">'+συντεταγμένες+'</textarea>' +
'<hr><center><font size="3" color="maroon"><b><u>Διαθέσιμες ενέργειες</u></b></font></center><br>'+
'<p align="justify"><font  color="maroon">Κάθε διαθέσιμη ενέργεια αναφέρεται στις συντεταγμένες του παραπάνω πλαισίου. Μπορείτε να αλλάξετε το περιεχόμενό του προσθέτοντας ή αφαιρώντας συντεταγμένες. Υπόψιν, ότι κάθε λειτουργία δεν έχει επαναλαμβανόμενη ενέργεια. Μην ανησυχείτε αν επιλέξετε κατά λάθος μια λειτουργία που δεν επιθυμείτε. Η αποθήκευση των συντεταγμένων λαμβάνει χώρα μετά την έξοδο από το συγκεκριμένο παράθυρο. </font></p>'+
'<input type="button" class="btn tsalbutton float_left" id="add_nuke" value="Προσθήκη στους στόχους του nuke script">&emsp;<input type="button" class="btn tsalbutton float_right" id="replace_nuke" value="Ορισμός ως στόχοι στο nuke script">'+
'<br><br><input type="button" class="btn tsalbutton float_left" id="add_support" value="Προσθήκη στους στόχους του support script">&emsp;<input type="button" class="btn tsalbutton float_right" id="replace_support" value="Ορισμός ως στόχοι στο support script">'+
'<br><br><input type="button" class="btn tsalbutton float_left" id="add_farming" value="Προσθήκη στους στόχους του farming script">&emsp;<input type="button" class="btn tsalbutton float_right" id="replace_farming" value="Ορισμός ως στόχοι στο farming script">'+
'<br><br><input type="button" class="btn tsalbutton float_left" id="add_fake" value="Προσθήκη στους στόχους του fake script">&emsp;<input type="button" class="btn tsalbutton float_right" id="replace_fake" value="Ορισμός ως στόχοι στο fake script">'+
'<br><br><hr><span id="result"></span>'+
'<br><br><center><img class="tooltip-delayed" title="<font color=darkgreen>Tsalkapone. Εύρεση συντεταγμένων</font>" src="https://dl.dropboxusercontent.com/s/dt6t7jl1dqkjja9/Tsalkapone_joker.jpg" style="cursor:help; position: relative"></center><br><center><p>Επικοινωνήστε ανά πάσα στιγμή για οποιαδήποτε ιδέα ή πρόταση σχετικά με τα scripts με τον <a href="'+contact_url+'" title="Άνοιγμα σε νέα καρτέλα του προφίλ του Tsalkapone στο εξωτερικό φόρουμ" target="_blank">Tsalkapone</a>.</p></center>' +
'</div>';
            }


Dialog.show('tsalkapone_syntetagmenes_no_map', content);
if  (localStorage.getItem('tsalcoords1') !== null) {      var gettsalcoords1 = localStorage.getItem('tsalcoords1'); } else { gettsalcoords1 ="";}
if  (localStorage.getItem('tsalcoords2') !== null) {      var gettsalcoords2 = localStorage.getItem('tsalcoords2'); }  else { gettsalcoords2 ="";}
if  (localStorage.getItem('tsalcoords3') !== null) {      var gettsalcoords3 = localStorage.getItem('tsalcoords3'); }  else { gettsalcoords3 ="";}
if  (localStorage.getItem('tsalcoords4') !== null) {      var gettsalcoords4 = localStorage.getItem('tsalcoords4'); }  else { gettsalcoords4 ="";}
  $("#add_nuke").click(function () {
      var excoords = document.getElementById('tsalxwria').value;
      localStorage.setItem("tsalcoords1", gettsalcoords1+" "+excoords);
document.getElementById('result').innerHTML = '<u><font color="darkgreen"><b>'+tsalkapone_trans.general.nuke_list+' </font><font color="maroon">(<span id="synsun"></span>)</font></b></u>:<br><textarea id="tsalxwria1" rows="5" cols="100">'+localStorage.getItem('tsalcoords1')+'</textarea><hr>';
      var σύνολο_χωριών= document.getElementById("tsalxwria1").value;
                  var count = σύνολο_χωριών.match(/\d+\|\d+/g);
                 if (count && count.length>0) {
             document.getElementById('synsun').innerHTML = count.length;}
    });
                         $("#add_support").click(function () {
      var excoords = document.getElementById('tsalxwria').value;
      localStorage.setItem("tsalcoords2", gettsalcoords2+" "+excoords);
document.getElementById('result').innerHTML = '<u><font color="darkgreen"><b>'+tsalkapone_trans.general.support_list+' </font><font color="maroon">(<span id="synsun"></span>)</font></b></u>:<br><textarea id="tsalxwria1" rows="5" cols="100">'+localStorage.getItem('tsalcoords2')+'</textarea><hr>';
                             var σύνολο_χωριών= document.getElementById("tsalxwria1").value;
                  var count = σύνολο_χωριών.match(/\d+\|\d+/g);
                 if (count && count.length>0) {
             document.getElementById('synsun').innerHTML = count.length;}
    });
                         $("#add_farming").click(function () {
      var excoords = document.getElementById('tsalxwria').value;
      localStorage.setItem("tsalcoords3", gettsalcoords3+" "+excoords);
document.getElementById('result').innerHTML = '<u><font color="darkgreen"><b>'+tsalkapone_trans.general.support_list+' </font><font color="maroon">(<span id="synsun"></span>)</font></b></u>:<br><textarea id="tsalxwria1" rows="5" cols="100">'+localStorage.getItem('tsalcoords3')+'</textarea><hr>';
                             var σύνολο_χωριών= document.getElementById("tsalxwria1").value;
                  var count = σύνολο_χωριών.match(/\d+\|\d+/g);
                 if (count && count.length>0) {
             document.getElementById('synsun').innerHTML = count.length;}
    });
                         $("#add_fake").click(function () {
      var excoords = document.getElementById('tsalxwria').value;
      localStorage.setItem("tsalcoords4", gettsalcoords4+" "+excoords);
document.getElementById('result').innerHTML = '<u><font color="darkgreen"><b>'+tsalkapone_trans.general.fake_list+' </font><font color="maroon">(<span id="synsun"></span>)</font></b></u>:<br><textarea id="tsalxwria1" rows="5" cols="100">'+localStorage.getItem('tsalcoords4')+'</textarea><hr>';
                             var σύνολο_χωριών= document.getElementById("tsalxwria1").value;
                  var count = σύνολο_χωριών.match(/\d+\|\d+/g);
                 if (count && count.length>0) {
             document.getElementById('synsun').innerHTML = count.length;}
    });
                          $("#replace_nuke").click(function () {
      var excoords = document.getElementById('tsalxwria').value;
      localStorage.setItem("tsalcoords1", excoords);
document.getElementById('result').innerHTML = '<u><font color="darkgreen"><b>'+tsalkapone_trans.general.nuke_list+' </font><font color="maroon">(<span id="synsun"></span>)</font></b></u>:<br><textarea id="tsalxwria1" rows="5" cols="100">'+localStorage.getItem('tsalcoords1')+'</textarea><hr>';
                              var σύνολο_χωριών= document.getElementById("tsalxwria1").value;
                  var count = σύνολο_χωριών.match(/\d+\|\d+/g);
                 if (count && count.length>0) {
             document.getElementById('synsun').innerHTML = count.length;}
    });
                         $("#replace_support").click(function () {
      var excoords = document.getElementById('tsalxwria').value;
      localStorage.setItem("tsalcoords2", excoords);
document.getElementById('result').innerHTML = '<u><font color="darkgreen"><b>'+tsalkapone_trans.general.support_list+' </font><font color="maroon">(<span id="synsun"></span>)</font></b></u>:<br><textarea id="tsalxwria1" rows="5" cols="100">'+localStorage.getItem('tsalcoords2')+'</textarea><hr>';
                             var σύνολο_χωριών= document.getElementById("tsalxwria1").value;
                  var count = σύνολο_χωριών.match(/\d+\|\d+/g);
                 if (count && count.length>0) {
             document.getElementById('synsun').innerHTML = count.length;}
    });
                         $("#replace_farming").click(function () {
      var excoords = document.getElementById('tsalxwria').value;
      localStorage.setItem("tsalcoords3", excoords);
document.getElementById('result').innerHTML = '<u><font color="darkgreen"><b>'+tsalkapone_trans.general.support_list+' </font><font color="maroon">(<span id="synsun"></span>)</font></b></u>:<br><textarea id="tsalxwria1" rows="5" cols="100">'+localStorage.getItem('tsalcoords3')+'</textarea><hr>';
                             var σύνολο_χωριών= document.getElementById("tsalxwria1").value;
                  var count = σύνολο_χωριών.match(/\d+\|\d+/g);
                 if (count && count.length>0) {
             document.getElementById('synsun').innerHTML = count.length;}
    });
                         $("#replace_fake").click(function () {
      var excoords = document.getElementById('tsalxwria').value;
      localStorage.setItem("tsalcoords4", excoords);
document.getElementById('result').innerHTML = '<u><font color="darkgreen"><b>'+tsalkapone_trans.general.fake_list+' </font><font color="maroon">(<span id="synsun"></span>)</font></b></u>:<br><textarea id="tsalxwria1" rows="5" cols="100">'+localStorage.getItem('tsalcoords4')+'</textarea><hr>';
                             var σύνολο_χωριών= document.getElementById("tsalxwria1").value;
                  var count = σύνολο_χωριών.match(/\d+\|\d+/g);
                 if (count && count.length>0) {
             document.getElementById('synsun').innerHTML = count.length;}
    });
}
                        else
                        { UI.ErrorMessage("<font color=gold><b><center>"+tsalkapone_trans.general.notification+" Tsalkapone</center></b></font> <br><br>"+tsalkapone_trans.notes.no_coords+"",3000); }

                     villas.remove();

    }




    }   };

(function (func, GM_xmlhttpRequest) {

    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    if (window.mozInnerScreenX !== undefined) {
        // Firefox has troubles with renaming commands, villages, ... (it works some of the time)
        // But waiting for document.ready slows down the script so only wait for this on FF
        // An optimization could be to put document.readys only around those blocks that are
        // problematic.
        script.textContent = '$(document).ready(' + func + ');';

    } else {
        script.textContent = '(' + func + ')();';
    }



     document.head.appendChild(script); // run the script
    document.head.removeChild(script); // clean up




    }(tsalkaponetool_ready, (typeof GM_xmlhttpRequest === "undefined" ? undefined : GM_xmlhttpRequest)));



