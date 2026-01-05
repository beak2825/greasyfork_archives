// ==UserScript==
// @name        BOINCstatsBadges
// @namespace   http://www.cryotest.com/
// @description Add badge stats to the boincstats user page.
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include     /^https?://boincstats\.com/.*/stats/-1/user/detail/.*?/
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_log
// @grant       GM_openInTab
// @version     3.1.0
// @icon        http://s20.postimage.org/v41hivk09/bbadges.png
// @require		https://greasyfork.org/scripts/2855-gm-config/code/GM_config.js?version=9272
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5354/BOINCstatsBadges.user.js
// @updateURL https://update.greasyfork.org/scripts/5354/BOINCstatsBadges.meta.js
// ==/UserScript==

// Change Log
//----------------------------
// Version 1.0
// -Initial release.
//
// Version 1.01
// -Added updater.
// -Added icon.
//
// Version 1.02
// -Removed the updater as it's dead. :-(
//
// Version 1.03
// -Tried another updater.
//
// Version 1.04
// -Updater tweak.
//
// Version 1.05
// -Added NumberFields and Radioactive.
// -Improved error handling.
// 
// Version 1.06
// -Added WUProp.
// -Fixed an error with GPUGrid tooltips.
// 
// Version 1.07
// -Added Collatz Conjecture but left it disabled until the server is back up.
// -Added default GPUGrid badge for no publications.
//
// Version 2.0
// -Enabled Collatz Conjecture.
// -Added Wildlife@Home.
// -Changed things so that badges graphics are loaded after the AJAX call returns,
//  to prevent them not rendering if the tab is selected before the HTML finishes rendering.
// -Added failure to connect message.
// -Added delay configuration.
//
// Version 2.01
// -Fixed a bug in delay prefs.
//
// Version 2.1
// -Added Milkway@Home.
// -Added NFS@Home.
// -Added theSkyNet POGS.
// -Added Odd Weird Search to Yoyo@home.
// -Added % RAC to Collatz Conjecture.
// -Fixed breakage caused by GM 2.0 update security changes.
// -Fixed Wildlife@Home breakage after image src format change.
// -Fixed issue with badges not loading if the HTML wasn't already displayed.
// -Added Bitcoin Utopia.
// 
// Version 2.11
// -Improved tooltips for PrimeGrid projects.
// -Reduced default delay values to zero as they shouldn't really be needed now.
//
// Version 2.2.0
// -Fixed new Collatz rank badges.
// -Added Atlas@home
// -Added Citizen Science Grid
// -Added DENIS@Home
// -Added GoofyxGrid@Home
// -Added SRBase
// -Added TN-Grid
// -Added Universe@Home
// -Retired Convector, OProject and Wildlife.
// -Made icon sizes more consistent across projects.
// -Updated PrimeGrid icon tooltips.
// -Updated WUProp to support multiple badges.
// -Changed to better versioning.
// -Fixed NumberFields to work with the new site layout.
//
// Version 3.0.0
// -Had to increase to v3 to make Greasy Fork recognise it as a later version.
//
// Version 3.0.1
// -Fixed row highlighting.
// -Added Amicable Numbers.
//
// Version 3.1.0
// -Fixed tab generation after site change.
// -Removed Bitcoin Utopia due to site closure.
//

(function()
{
	// Avoid problems due to different versions of jQuery in this script and the target page.
	this.$ = this.jQuery = jQuery.noConflict(true);

	//********************************************************************************
	// Borrowed from GM_config Extender.
	//********************************************************************************
	// ========================================================[ localization ]===
	// --------------------------------------------------------[ translations ]---
	GM_config.trans = {
		en: {
			'ButtonSave': 'Save',
			'ButtonSaveTip': 'Save options and close window',
			'ButtonCancel': 'Cancel',
			'ButtonCancelTip': 'Close window (reject changes)',
			'ResetLinkName': 'Reset to defaults',
			'ResetLinkTip': 'Reset settings to shipped defaults',
			'ConfirmOverwriteFromClipboard': 'Sure to overwrite your settings from Clipboard?',
			'SettingsSaved': 'Settings saved.',
			'SaveAborted': 'Aborted.',
			'PromptSettingsPaste': 'Please paste your settings here:',
			'ConfirmOverwriteFromPaste': 'Sure to overwrite your settings with the entered data?'
		},
		de: {
			'ButtonSave': 'Speichern',
			'ButtonSaveTip': '�nderungen speichern und Fenster schlie�en',
			'ButtonCancel': 'Abbrechen',
			'ButtonCancelTip': 'Fenster schlie�en (�nderungen verwerfen)',
			'ResetLinkName': 'Zur�cksetzen',
			'ResetLinkTip': 'Alle Werte auf Defaults zur�cksetzen',
			'ConfirmOverwriteFromClipboard': 'Sollen die Einstellungen wirklich mit den Daten vom Clipboard �berschrieben werden?',
			'SettingsSaved': 'Einstellungen gespeichert.',
			'SaveAborted': 'Aktion abgebrochen.',
			'PromptSettingsPaste': 'Bitte Einstellungen hier hineinkopieren:',
			'ConfirmOverwriteFromPaste': 'Sicher, dass die Einstellungen mit den kopierten Daten �berschrieben werden sollen?'
		},
		nl: {
			'ButtonSave': 'Opslaan',
			'ButtonSaveTip': 'Instellingen opslaan en sluit venster',
			'ButtonCancel': 'Annuleren',
			'ButtonCancelTip': 'Sluit venster (wist wijzigingen)',
			'ResetLinkName': 'Standaardinstellingen herstellen',
			'ResetLinkTip': 'Herstelt alle instellingen naar de standaardwaarden',
			'ConfirmOverwriteFromClipboard': 'Weet u zeker dat u de instellen vanaf het clipboard wil overschrijven?',
			'SettingsSaved': 'Instellingen opgeslagen.',
			'SaveAborted': 'Afgebroken.',
			'PromptSettingsPaste': 'Plak uw instellingen hier:',
			'ConfirmOverwriteFromPaste': 'Weet u zeker dat u de instellingen wilt overschrijven met de ingevoerde data?'
		},
		br: {},
		cz: {},
		cn: {},
		es: {},
		fi: {},
		fr: {},
		ro: {},
		ru: {},
		se: {},
		tw: {},
		useLang: 'en',
		fallBack: true
	};
	/* -------------------------------------------------[ adding translations ]---
	 * can be used to overwrite existing translations and/or add new ones
	 * string lang: 2 char language code
	 * object trans: translations to add in the format {'code':'translation','code2':'trans2', ...) */
	GM_config.setTranslations = function(lang, trans){
		for(attrname in trans){
			GM_config.trans[lang][attrname] = trans[attrname];
		}
	}
	/* ---------------------------------------------------[ init localization ]---
	 * string lang: language to translate into
	 * boolean fallback: return original (true) or empty string (false) on NoFound? */
	GM_config.initLocalization = function(lang, fallback){
		GM_config.trans.useLang = lang;
		GM_config.trans.fallback = fallback;
	}
	/* -------------------------------------------------[ translate something ]---
	 * string term: term to translate */
	GM_config.lang = function(term){
		if(typeof (GM_config.trans[GM_config.trans.useLang]) == 'undefined' || !GM_config.trans[GM_config.trans.useLang][term]){
			if(!GM_config.trans['en'][term]){
				if(GM_config.trans.fallback)
					return term;
				return '';
			}
			return GM_config.trans['en'][term];
		}
		return GM_config.trans[GM_config.trans.useLang][term];
	}
	/* ----------------------------------------------------[ localize Buttons ]---
	 * uses setup default language for translation - see initLocalization() */
	GM_config.localizeButtons = function(){
		if(cf = this.frame.contentWindow.document.getElementById('buttons_holder')){
			cf.childNodes[0].innerHTML = this.lang('ButtonSave');
			cf.childNodes[0].setAttribute('title', this.lang('ButtonSaveTip'));
			cf.childNodes[1].innerHTML = this.lang('ButtonCancel');
			cf.childNodes[1].setAttribute('title', this.lang('ButtonCancelTip'));
			cf.childNodes[2].childNodes[0].innerHTML = this.lang('ResetLinkName');
			cf.childNodes[2].childNodes[0].setAttribute('title', this.lang('ResetLinkTip'));
		}
	}

	/* =========================================[ Resize configuration window ]===
	 * int width: new width
	 * int height: new height */
	GM_config.resizeFrame = function(wid, hei){
		if(fid = this.frame.id){
			this.frame.style.width = wid;
			this.frame.style.height = hei;
		}
	}

	/* ====================================[ Add a border to the config frame ]===
	 * object spec { width (5px), style (ridge), color (#eae9e8) }
	 */
	GM_config.addBorder = function(){
		if(fid = this.frame.id){
			spec = arguments[0] || {};
			this.frame.style.borderWidth = (spec.width || '5px');
			this.frame.style.borderStyle = (spec.style || 'ridge');
			this.frame.style.borderColor = (spec.color || '#999999');
		}
	}

	/* -------------------------------------------------[ Sections to Tabs ]---
	 * Convert sections to tabbed pages
	 */
	var sectionTabs = 0; // holds the number of tabs we have
	GM_config.toggleSection = function(e){ // onClick handler for the tabs
		if((typeof e) == 'number')
			var objNum = e;
		else
			var objNum = /\_(\d+)\_/.exec(e.target.id)[1], tobj;
		for(var i = 0; i < sectionTabs; i++){
			tobj = GM_config.frame.contentWindow.document.getElementById('GM_config_section_' + i + '_tab');
			tdat = GM_config.frame.contentWindow.document.getElementById('GM_config_section_' + i);
			tdat.setAttribute('className', 'section_header tab'); // does not work
			if(i == objNum){ // Activate
				// tab
//         if (tobj.style.cssText.match(/font-weight/) )
//           tobj.setAttribute('style',tobj.style.cssText.replace(/font-weight:[^\;]*/,'font-weight: bold !important'));
//         else
//           tobj.setAttribute('style',tobj.style.cssText + 'font-weight: bold !important;');
				tobj.setAttribute('selected', true);
				// content
				if(tdat.style.cssText.match(/display:/))
					tdat.setAttribute('style', tdat.style.cssText.replace(/display:[^\;]*/, 'display:table !important'));
				else
					tdat.setAttribute('style', tdat.style.cssText + 'display:table !important;');
			}else{ // DeActivate
				// tab
//         if (tobj.style.cssText.match(/font-weight/) )
//           tobj.setAttribute('style',tobj.style.cssText.replace(/font-weight:[^\;]*/,'font-weight: normal !important'));
//         else
//           tobj.setAttribute('style',tobj.style.cssText + 'font-weight: normal !important;');
				tobj.setAttribute('selected', false);
				// content
				if(tdat.style.cssText.match(/display:/))
					tdat.setAttribute('style', tdat.style.cssText.replace(/display:[^\;]*/, 'display:none !important'));
				else
					tdat.setAttribute('style', tdat.style.cssText + 'display:none !important;');
			}
		}
	}

	GM_config.sections2tabs = function(){
		var divs = this.frame.contentWindow.document.getElementsByTagName('div');
		var rows = [];
		for(var i = 0; i < divs.length; i++){
			if(divs[i].id.indexOf('GM_config_section_') == 0 && divs[i].id.indexOf('GM_config_section_header_') != 0){
				rows.push(divs[i]);
			}
		}
		if(rows.length < 1)
			return;
		var anch = document.createElement('div');
		anch.style.cssText = 'border-bottom: 3px solid #cccccc;';
		anch.id = 'GM_config_tab_holder';
		sectionTabs = rows.length;
		// Tabs.
		var tab_container = document.createElement('div');
		tab_container.setAttribute('class', "tab-container");
		for(var i = 0; i < sectionTabs; i++){
			var tab = document.createElement('div');
			tab.setAttribute('class', "tab");
			tab.id = 'GM_config_section_' + i + '_tab';
			tab.addEventListener('click', GM_config.toggleSection, false);
			tab.innerHTML = GM_config.frame.contentWindow.document.getElementById('GM_config_section_header_' + i).innerHTML;
			tab_container.appendChild(tab);
		}
		anch.appendChild(tab_container);
		// Config. pages.
		for(var i = 0; i < sectionTabs; i++){
			anch.appendChild(rows[i]);
			rows[i].style.marginLeft = "auto";
			rows[i].style.marginRight = "auto";
		}
		this.frame.contentWindow.document.getElementById('GM_config_wrapper').insertBefore(anch, this.frame.contentWindow.document.getElementById('GM_config_buttons_holder'));
		this.frame.contentWindow.document.getElementById('GM_config_section_0_tab').setAttribute('selected', true);
		this.toggleSection(0);
	}
//********************************************************************************


	var BBadges = {
		idAmicableNumbers: GM_getValue('amicablenumbers'),
		idAsteroids: GM_getValue('asteroids'),
		idAtlas: GM_getValue('atlas'),
		idBitcoinUtopia: GM_getValue('bitcoinutopia'),
		idCollatz: GM_getValue('collatz'),
		idCSG: GM_getValue('csg'),
		idDENIS: GM_getValue('denis'),
		idEnigma: GM_getValue('enigma'),
		idGoofyx: GM_getValue('goofyx'),
		idGPUGrid: GM_getValue('gpugrid'),
		idMilkyway: GM_getValue('milkyway'),
		idNFS: GM_getValue('nfs'),
		idNumberFields: GM_getValue('numberfields'),
		idPOGS: GM_getValue('pogs'),
		idPrimeGrid: GM_getValue('primegrid'),
		idRadioactive: GM_getValue('radioactive'),
		idSRBase: GM_getValue('srbase'),
		idTNGrid: GM_getValue('tngrid'),
		idUniverse: GM_getValue('universe'),
		idWCG: GM_getValue('wcg'),
		idWUProp: GM_getValue('wuprop'),
		idYoyo: GM_getValue('yoyo'),
		delayAJAX: GM_getValue('stats_timeout'),
		delayTabLoad: GM_getValue('tab_load_delay'),
		userPage: "show_user.php?userid=",
		amicablenumbers: {
			name: "Amicable Numbers",
			root: "https://sech.me/boinc/Amicable/",
			badges: [],
			alt: []
		},
		asteroids: {
			name: "Asteroids@home",
			root: "http://asteroidsathome.net/boinc/",
			badges: [],
			alt: []
		},
		atlas: {
			name: "Atlas@home",
			root: "http://atlasathome.cern.ch/",
			badges: [],
			alt: []
		},
		bitcoinUtopia: {
			name: "Bitcoin Utopia",
			root: "http://www.bitcoinutopia.net/bitcoinutopia/",
			badges: [],
			alt: []
		},
		collatz: {
			name: "Collatz Conjecture",
			root: "http://boinc.thesonntags.com/collatz/",
			badges: [],
			alt: []
		},
		csg: {
			name: "Citizen Science Grid",
			root: "http://csgrid.org/csg/",
			badges: [],
			alt: []
		},
		denis: {
			name: "DENIS@Home",
			root: "http://denis.usj.es/denisathome/",
			badges: [],
			alt: []
		},
		enigma: {
			name: "Enigma@home",
			root: "http://www.enigmaathome.net/",
			badges: '',
			alt: ''
		},
		goofyx: {
			name: "GoofyxGrid@Home",
			root: "http://goofyxgridathome.net/",
			badges: [],
			alt: []
		},
		gpugrid: {
			name: "GPUGRID.net",
			root: "http://www.gpugrid.net/",
			badges: [],
			alt: [],
			ranks: [],
			citations: [],
			topics: []
		},
		milkyway: {
			name: "MilkyWay@Home",
			root: "http://milkyway.cs.rpi.edu/milkyway/",
			badges: [],
			alt: []
		},
		nfs: {
			name: "NFS@Home",
			root: "http://escatter11.fullerton.edu/nfs/",
			badges: [],
			alt: []
		},
		numberfields: {
			name: "NumberFields@home",
			root: "http://numberfields.asu.edu/NumberFields/",
			badges: [],
			alt: []
		},
		pogs: {
			name: "theSkyNet POGS",
			root: "http://pogs.theskynet.org/pogs/",
			trophies: "http://www.theskynet.org/profiles/{id}/trophies.json",
			trophy: "http://www.theskynet.org/trophies/{id}.json",
			badges: [],
			alt: []
		},
		primegrid: {
			name: "PrimeGrid",
			root: "http://www.primegrid.com/",
			badges: [],
			alt: []
		},
		radioactive: {
			name: "Radioactive@home",
			root: "http://radioactiveathome.org/boinc/",
			badges: [],
			alt: []
		},
		srbase: {
			name: "SRBase",
			root: "http://srbase.my-firewall.org/sr5/",
			badges: [],
			alt: []
		},
		tngrid: {
			name: "TN-Grid",
			root: "http://gene.disi.unitn.it/test/",
			badges: [],
			alt: []
		},
		universe: {
			name: "Universe@Home",
			root: "http://universeathome.pl/universe/",
			badges: [],
			alt: []
		},
		wcg: {
			name: "World Community Grid",
			root: "http://www.worldcommunitygrid.org/stat/viewMemberInfo.do?userName=",
			badges: [],
			alt: []
		},
		wuprop: {
			name: "WUProp@home",
			root: "http://wuprop.boinc-af.org/",
			badges: [],
			alt: []
		},
		yoyo: {
			name: "Yoyo@home",
			root: "http://www.rechenkraft.net/yoyo/",
			badges: [],
			alt: []
		},
		// Configuration management.
		config: function(){
			var configStyle = "\
        .config_var {text-align: center; padding-top: 5px;} \
        .field_label {padding-left: 5px;} \
        .reset {display: none;} \
        input {width: 50px;} \
        #GM_config_field_wcg {width: 100px;} \
        .config_var {width: 245px; text-align: left !important; margin: 0 auto 4px !important;} \
        .field_label {width: 130px; float: left; margin-top: 4px;} \
        #GM_config_asteroids_field_label {float: left;} \
        /* Tabbed */\
        #GM_config .section_header_holder{margin-top: 0;}\
        .section_header[selected=\"true\"] {\
          position: relative !important;\
          color: #000000 !important;\
          top: 1px !important;\
        }\
        #GM_config_tab_holder {\
          margin-left:5px !important;\
          margin-right:5px !important;\
          border-bottom: 1px solid #B2A293 !important;\
        }\
        .tab-container {\
          background: url(\"http://boincstats.com/css/images/ui-bg_gloss-wave_55_5c9ccc_500x100.png\") repeat-x scroll 55% 55% transparent;\
          border-radius: 5px 5px 5px 5px;\
          height: 30px;\
          margin-bottom: 1px;\
          margin-left: 4px;\
          width: 98%;\
        }\
        .tab {\
          -moz-user-select: -moz-none;\
          background: url(\"images/ui-bg_glass_85_dfeffc_1x400.png\") repeat-x scroll 50% 50% #DFEFFC;\
          border-radius: 5px 5px 0 0;\
          color: #2E6E9E;\
          cursor: pointer;\
          display:inline-block;\
          font-size: 11px;\
          font-weight: bold;\
          height: 25px;\
          line-height: 25px;\
          margin-right: 4px;\
          margin-top: 3px;\
          padding-left:10px;\
          padding-right:10px;\
          user-select: none;\
          text-align: center;\
          white-space: nowrap;\
        }\
        .tab[selected=\"true\"] {\
          background: url(\"images/ui-bg_inset-hard_100_f5f8f9_1x100.png\") repeat-x scroll 50% 50% #F5F8F9;\
          color: #E17009;\
          margin-top: 4px;\
          padding-bottom: 1px;\
        }\
        #GM_config_section_0_tab { margin-left:4px !important; }\
        ";

		GM_config.init('BoincStats Badges',
			/* Fields object */
			{
				'amicablenumbers': {
					'section': ['Project IDs', 'Enter your user ID for each project, found on your account details page.<br/>For World Community Grid, enter your user NAME.'],
					'label': 'Amicable Numbers:',
					'type': 'text',
					'default': ''
				},
				'asteroids': {
					'label': 'Asteroids@home:',
					'type': 'text',
					'default': ''
				},
				'atlas': {
					'label': 'Atlas@home:',
					'type': 'text',
					'default': ''
				},
				'bitcoinutopia': {
					'label': 'Bitcoin Utopia:',
					'type': 'text',
					'default': ''
				},
				'collatz': {
					'label': 'Collatz Conjecture:',
					'type': 'text',
					'default': ''
				},
				'csg': {
					'label': 'Citizen Science Grid:',
					'type': 'text',
					'default': ''
				},
				'denis': {
					'label': 'DENIS@Home:',
					'type': 'text',
					'default': ''
				},
				'enigma': {
					'label': 'Enigma@home:',
					'type': 'text',
					'default': ''
				},
				'goofyx': {
					'label': 'GoofyxGrid@Home:',
					'type': 'text',
					'default': ''
				},
				'gpugrid': {
					'label': 'GPUGRID.net:',
					'type': 'text',
					'default': ''
				},
				'milkyway': {
					'label': 'MilkyWay@Home:',
					'type': 'text',
					'default': ''
				},
				'nfs': {
					'label': 'NFS@Home:',
					'type': 'text',
					'default': ''
				},
				'numberfields': {
					'label': 'NumberFields@home:',
					'type': 'text',
					'default': ''
				},
				'pogs': {
					'label': 'theSkyNet POGS:',
					'type': 'text',
					'default': ''
				},
				'primegrid': {
					'label': 'PrimeGrid:',
					'type': 'text',
					'default': ''
				},
				'radioactive': {
					'label': 'Radioactive@home:',
					'type': 'text',
					'default': ''
				},
				'srbase': {
					'label': 'SRBase:',
					'type': 'text',
					'default': ''
				},
				'tngrid': {
					'label': 'TN-Grid:',
					'type': 'text',
					'default': ''
				},
				'universe': {
					'label': 'Universe@Home:',
					'type': 'text',
					'default': ''
				},
				'wcg': {
					'label': 'World Community Grid:',
					'type': 'text',
					'default': ''
				},
				'wuprop': {
					'label': 'WUProp@Home:',
					'type': 'text',
					'default': ''
				},
				'yoyo': {
					'label': 'Yoyo@home:',
					'type': 'text',
					'default': ''
				},
				'stats_timeout': {
					'section': ['Delays', 'You can adjust the maximum periods that the script will wait for AJAX badge stats and for the tab to be rendered.'],
					'label': 'AJAX Timeout (ms):',
					'type': 'text',
					'default': '0'
				},
				'tab_load_delay': {
					'label': 'Tab Load Delay (ms)',
					'type': 'text',
					'default': '0'
				}
			}, configStyle, {
				open: function(){
					GM_config.addBorder();                          // add a fancy border
					GM_config.resizeFrame('420px', '695px');        // resize the config window
					GM_config.center();
					GM_config.sections2tabs();
				},
				save: function(){
					GM_setValue('amicablenumbers', GM_config.get('amicablenumbers'));
					GM_setValue('asteroids', GM_config.get('asteroids'));
					GM_setValue('atlas', GM_config.get('atlas'));
					GM_setValue('bitcoinutopia', GM_config.get('bitcoinutopia'));
					GM_setValue('collatz', GM_config.get('collatz'));
					GM_setValue('csg', GM_config.get('csg'));
					GM_setValue('denis', GM_config.get('denis'));
					GM_setValue('enigma', GM_config.get('enigma'));
					GM_setValue('goofyx', GM_config.get('goofyx'));
					GM_setValue('gpugrid', GM_config.get('gpugrid'));
					GM_setValue('milkyway', GM_config.get('milkyway'));
					GM_setValue('nfs', GM_config.get('nfs'));
					GM_setValue('numberfields', GM_config.get('numberfields'));
					GM_setValue('pogs', GM_config.get('pogs'));
					GM_setValue('primegrid', GM_config.get('primegrid'));
					GM_setValue('radioactive', GM_config.get('radioactive'));
					GM_setValue('srbase', GM_config.get('srbase'));
					GM_setValue('tngrid', GM_config.get('tngrid'));
					GM_setValue('universe', GM_config.get('universe'));
					GM_setValue('wcg', GM_config.get('wcg'));
					GM_setValue('wuprop', GM_config.get('wuprop'));
					GM_setValue('yoyo', GM_config.get('yoyo'));
					GM_setValue('stats_timeout', GM_config.get('stats_timeout'));
					GM_setValue('tab_load_delay', GM_config.get('tab_load_delay'));
					location.reload();                              // reload the page when configuration was changed
				}

			});

			// Register the menu item.
			GM_registerMenuCommand("BoincStats Badges", function(){
				GM_config.open()
			}, 'B');
			// Open prefs on first run.
			if(!GM_getValue('hasrun')){
				GM_config.open();
				GM_setValue('hasrun', true)
			}
		},
		// Language support.
		locale: 'en',
		br: {
			"Badges": "Emblemas",
			"Project name": "Nome do projeto",
			"Unable To Connect": "N�o � poss�vel conectar ao projeto."
		},
		cz: {
			"Badges": "Odznaky",
			"Project name": "N�zev projektu",
			"Unable To Connect": "Nelze se pripojit k projektu."
		},
		cn: {
			"Badges": "??",
			"Project name": "????",
			"Unable To Connect": "????????"
		},
		de: {
			"Badges": "Abzeichen",
			"Project name": "Projektname",
			"Unable To Connect": "Es kann keine Verbindung zum Projekt."
		},
		en: {
			"Badges": "Badges",
			"Project name": "Project name",
			"Unable To Connect": "Unable to connect to project."
		},
		es: {
			"Badges": "Insignias",
			"Project name": "Nombre del proyecto",
			"Unable To Connect": "No se puede conectar al proyecto."
		},
		fi: {
			"Badges": "Merkit",
			"Project name": "Hankkeen nimi",
			"Unable To Connect": "Ei voida yhdist�� hankkeeseen."
		},
		fr: {
			"Badges": "Emblem",
			"Project name": "Nom du projet",
			"Unable To Connect": "Impossible de se connecter au projet."
		},
		nl: {
			"Badges": "Badges",
			"Project name": "Naam van het project",
			"Unable To Connect": "Kan geen verbinding maken met project."
		},
		ro: {
			"Badges": "Insigne",
			"Project name": "Proiectul nume",
			"Unable To Connect": "Nu se poate conecta la proiect."
		},
		ru: {
			"Badges": "??????",
			"Project name": "???????? ???????",
			"Unable To Connect": "?? ??????? ???????????? ? ???????."
		},
		se: {
			"Badges": "Emblem",
			"Project name": "Projektnamn",
			"Unable To Connect": "Kan inte ansluta till projektet."
		},
		tw: {
			"Badges": "??",
			"Project name": "????",
			"Unable To Connect": "????????"
		},
		getLocale: function(){
			var loc = document.URL.split('/')[3];
			if(typeof loc != 'undefined'){
				this.locale = loc;
			}
		},
		initLang: function(){
			GM_config.setTranslations('br', BBadges.br);
			GM_config.setTranslations('cz', BBadges.cz);
			GM_config.setTranslations('cn', BBadges.cn);
			GM_config.setTranslations('en', BBadges.en);
			GM_config.setTranslations('es', BBadges.es);
			GM_config.setTranslations('fi', BBadges.fi);
			GM_config.setTranslations('de', BBadges.de);
			GM_config.setTranslations('fr', BBadges.fr);
			GM_config.setTranslations('nl', BBadges.nl);
			GM_config.setTranslations('ro', BBadges.ro);
			GM_config.setTranslations('ru', BBadges.ru);
			GM_config.setTranslations('se', BBadges.se);
			GM_config.setTranslations('tw', BBadges.tw);
			GM_config.initLocalization(BBadges.locale, true);
		}
	};

	// Init language and config. settings.
	BBadges.config();
	BBadges.getLocale();
	BBadges.initLang();

	// Insert a new tab in the header.
	$("#main ul.menu_header").append("<li id=\"tabBadges\" class=\"menu_item\"><a href=\"#\"><span>" + GM_config.lang('Badges') + "</span></a></li>");
	$('#tabBadges').click(function(e){
		// Set selected styles on our tab and remove them from the currently selected one.
		var selectedTab = $(".menu_selected"),
			tabIndex = selectedTab.index();
			
		if(tabIndex == 5){
			// Badge tab already selected.
			return;
		}
		
		selectedTab.removeClass('menu_selected');
		$('#tabBadges').addClass('menu_selected');
		// Check whether the current tab is charts and, if so, remove them and create the stats table.
		if(tabIndex == 3){
			// Remove charts.
			$("img[src*='chart.png']").each(function(i){
				$(this).remove();
			});
			// Remove breaks.
			$("#main br").each(function(i){
				$(this).remove();
			});
			// Insert table.
			$('<table id="tblStats" class="dataTable"></table>').appendTo('#main');
		}
		else{
			// Remove the current data from the display.
			$('#tblStats').empty();
			if(tabIndex == 2){
				$('#tblStats').next("br").remove();
				$('#tblStats').next("b").remove();
				$('#tblStatsRetired').remove();
			}
		}

		// Insert badge data.
		$('<tr class="header"><th width="25%">' + GM_config.lang('Project name') + '</th><th>' + GM_config.lang('Badges') + '</th></tr>').appendTo('#tblStats');
		// Amicable Numbers
		var amicableNumbersHTML = '<tr class="even"><td>';
		amicableNumbersHTML += BBadges.idAmicableNumbers ? '<a href="' + BBadges.amicablenumbers.root + BBadges.userPage + BBadges.idAmicableNumbers + '">' : '';
		amicableNumbersHTML += BBadges.amicablenumbers.name;
		amicableNumbersHTML += BBadges.idAmicableNumbers ? '</a>' : '';
		amicableNumbersHTML += '</td><td id="amicablenumbers"></td></tr>\n';
		$(amicableNumbersHTML).appendTo('#tblStats');

		// Asteroids
		var asteroidsHTML = '<tr class="odd"><td>';
		asteroidsHTML += BBadges.idAsteroids ? '<a href="' + BBadges.asteroids.root + BBadges.userPage + BBadges.idAsteroids + '">' : '';
		asteroidsHTML += BBadges.asteroids.name;
		asteroidsHTML += BBadges.idAsteroids ? '</a>' : '';
		asteroidsHTML += '</td><td id="asteroids"></td></tr>\n';
		$(asteroidsHTML).appendTo('#tblStats');

		// Atlas
		var atlasHTML = '<tr class="even"><td>';
		atlasHTML += BBadges.idAtlas ? '<a href="' + BBadges.atlas.root + BBadges.userPage + BBadges.idAtlas + '">' : '';
		atlasHTML += BBadges.atlas.name;
		atlasHTML += BBadges.idAtlas ? '</a>' : '';
		atlasHTML += '</td><td id="atlas"></td></tr>\n';
		$(atlasHTML).appendTo('#tblStats');

		// Collatz Conjecture.
		var collatzHTML = '<tr class="even"><td>';
		collatzHTML += BBadges.idCollatz ? '<a href="' + BBadges.collatz.root + BBadges.userPage + BBadges.idCollatz + '">' : '';
		collatzHTML += BBadges.collatz.name;
		collatzHTML += BBadges.idCollatz ? '</a>' : '';
		collatzHTML += '</td><td id="collatz"></td></tr>\n';
		$(collatzHTML).appendTo('#tblStats');

		// Citizen Science Grid.
		var csgHTML = '<tr class="odd"><td>';
		csgHTML += BBadges.idCSG ? '<a href="' + BBadges.csg.root + BBadges.userPage + BBadges.idCSG + '">' : '';
		csgHTML += BBadges.csg.name;
		csgHTML += BBadges.idCSG ? '</a>' : '';
		csgHTML += '</td><td id="csg"></td></tr>\n';
		$(csgHTML).appendTo('#tblStats');

		// DENIS.
		var denisHTML = '<tr class="even"><td>';
		denisHTML += BBadges.idDENIS ? '<a href="' + BBadges.denis.root + BBadges.userPage + BBadges.idDENIS + '">' : '';
		denisHTML += BBadges.denis.name;
		denisHTML += BBadges.idDENIS ? '</a>' : '';
		denisHTML += '</td><td id="denis"></td></tr>\n';
		$(denisHTML).appendTo('#tblStats');

		// Enigma.
		var enigmaHTML = '<tr class="odd"><td>';
		enigmaHTML += BBadges.idEnigma ? '<a href="' + BBadges.enigma.root + BBadges.userPage + BBadges.idEnigma + '">' : '';
		enigmaHTML += BBadges.enigma.name;
		enigmaHTML += BBadges.idEnigma ? '</a>' : '';
		enigmaHTML += '</td><td id="enigma"></td></tr>\n';
		$(enigmaHTML).appendTo('#tblStats');
		
		// Goofyx
		var goofyxHTML = '<tr class="even"><td>';
		goofyxHTML += BBadges.idGoofyx ? '<a href="' + BBadges.goofyx.root + BBadges.userPage + BBadges.idGoofyx + '">' : '';
		goofyxHTML += BBadges.goofyx.name;
		goofyxHTML += BBadges.idGoofyx ? '</a>' : '';
		goofyxHTML += '</td><td id="goofyx"></td></tr>\n';
		$(goofyxHTML).appendTo('#tblStats');

		// GPUGRID
		var gpugridHTML = '<tr class="odd"><td>';
		gpugridHTML += BBadges.idGPUGrid ? '<a href="' + BBadges.gpugrid.root + BBadges.userPage + BBadges.idGPUGrid + '">' : '';
		gpugridHTML += BBadges.gpugrid.name;
		gpugridHTML += BBadges.idGPUGrid ? '</a>' : '';
		gpugridHTML += '</td><td id="gpugrid"></td></tr>\n';
		$(gpugridHTML).appendTo('#tblStats');

		// Milkyway
		var milkywayHTML = '<tr class="even"><td>';
		milkywayHTML += BBadges.idMilkyway ? '<a href="' + BBadges.milkyway.root + BBadges.userPage + BBadges.idMilkyway + '">' : '';
		milkywayHTML += BBadges.milkyway.name;
		milkywayHTML += BBadges.idMilkyway ? '</a>' : '';
		milkywayHTML += '</td><td id="milkyway"></td></tr>\n';
		$(milkywayHTML).appendTo('#tblStats');

		// NFS
		var nfsHTML = '<tr class="odd"><td>';
		nfsHTML += BBadges.idNFS ? '<a href="' + BBadges.nfs.root + BBadges.userPage + BBadges.idNFS + '">' : '';
		nfsHTML += BBadges.nfs.name;
		nfsHTML += BBadges.idNFS ? '</a>' : '';
		nfsHTML += '</td><td id="nfs"></td></tr>\n';
		$(nfsHTML).appendTo('#tblStats');

		// NumberFields
		var numberfieldsHTML = '<tr class="even"><td>';
		numberfieldsHTML += BBadges.idNumberFields ? '<a href="' + BBadges.numberfields.root + BBadges.userPage + BBadges.idNumberFields + '">' : '';
		numberfieldsHTML += BBadges.numberfields.name;
		numberfieldsHTML += BBadges.idNumberFields ? '</a>' : '';
		numberfieldsHTML += '</td><td id="numberfields"></td></tr>\n';
		$(numberfieldsHTML).appendTo('#tblStats');

		// PrimeGrid
		var primegridHTML = '<tr class="odd"><td>';
		primegridHTML += BBadges.idPrimeGrid ? '<a href="' + BBadges.primegrid.root + BBadges.userPage + BBadges.idPrimeGrid + '">' : '';
		primegridHTML += BBadges.primegrid.name;
		primegridHTML += BBadges.idPrimeGrid ? '</a>' : '';
		primegridHTML += '</td><td id="primegrid"></td></tr>\n';
		$(primegridHTML).appendTo('#tblStats');

		// Radioactive
		var radioactiveHTML = '<tr class="even"><td>';
		radioactiveHTML += BBadges.idRadioactive ? '<a href="' + BBadges.radioactive.root + BBadges.userPage + BBadges.idRadioactive + '">' : '';
		radioactiveHTML += BBadges.radioactive.name;
		radioactiveHTML += BBadges.idRadioactive ? '</a>' : '';
		radioactiveHTML += '</td><td id="radioactive"></td></tr>\n';
		$(radioactiveHTML).appendTo('#tblStats');

		// SRBase
		var srbaseHTML = '<tr class="odd"><td>';
		srbaseHTML += BBadges.idSRBase ? '<a href="' + BBadges.srbase.root + BBadges.userPage + BBadges.idSRBase + '">' : '';
		srbaseHTML += BBadges.srbase.name;
		srbaseHTML += BBadges.idSRBase ? '</a>' : '';
		srbaseHTML += '</td><td id="srbase"></td></tr>\n';
		$(srbaseHTML).appendTo('#tblStats');

		// theSkyNet POGS
		var pogsHTML = '<tr class="even"><td>';
		pogsHTML += BBadges.idPOGS ? '<a href="' + BBadges.pogs.root + BBadges.userPage + BBadges.idPOGS + '">' : '';
		pogsHTML += BBadges.pogs.name;
		pogsHTML += BBadges.idPOGS ? '</a>' : '';
		pogsHTML += '</td><td id="pogs"></td></tr>\n';
		$(pogsHTML).appendTo('#tblStats');

		// TN-Grid
		var tngridHTML = '<tr class="odd"><td>';
		tngridHTML += BBadges.idTNGrid ? '<a href="' + BBadges.tngrid.root + BBadges.userPage + BBadges.idTNGrid + '">' : '';
		tngridHTML += BBadges.tngrid.name;
		tngridHTML += BBadges.idTNGrid ? '</a>' : '';
		tngridHTML += '</td><td id="tngrid"></td></tr>\n';
		$(tngridHTML).appendTo('#tblStats');

		// Universe
		var universeHTML = '<tr class="even"><td>';
		universeHTML += BBadges.idUniverse ? '<a href="' + BBadges.universe.root + BBadges.userPage + BBadges.idUniverse + '">' : '';
		universeHTML += BBadges.universe.name;
		universeHTML += BBadges.idUniverse ? '</a>' : '';
		universeHTML += '</td><td id="universe"></td></tr>\n';
		$(universeHTML).appendTo('#tblStats');

		// WCG
		var wcgHTML = '<tr class="odd"><td>';
		wcgHTML += BBadges.idWCG ? '<a href="' + BBadges.wcg.root + BBadges.idWCG + '">' : '';
		wcgHTML += BBadges.wcg.name;
		wcgHTML += BBadges.idWCG ? '</a>' : '';
		wcgHTML += '</td><td id="wcg"></td></tr>\n';
		$(wcgHTML).appendTo('#tblStats');

		// WUProp
		var wupropHTML = '<tr class="even"><td>';
		wupropHTML += BBadges.idWUProp ? '<a href="' + BBadges.wuprop.root + BBadges.userPage + BBadges.idWUProp + '">' : '';
		wupropHTML += BBadges.wuprop.name;
		wupropHTML += BBadges.idWUProp ? '</a>' : '';
		wupropHTML += '</td><td id="wuprop"></td></tr>\n';
		$(wupropHTML).appendTo('#tblStats');

		// Yoyo.
		var yoyoHTML = '<tr class="odd"><td>';
		yoyoHTML += BBadges.idYoyo ? '<a href="' + BBadges.yoyo.root + BBadges.userPage + BBadges.idYoyo + '">' : '';
		yoyoHTML += BBadges.yoyo.name;
		yoyoHTML += BBadges.idYoyo ? '</a>' : '';
		yoyoHTML += '</td><td id="yoyo"></td></tr>\n';
		$(yoyoHTML).appendTo('#tblStats');

		try{
			// Amicable Numbers.
			if(BBadges.idAmicableNumbers){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.amicablenumbers.root + BBadges.userPage + BBadges.idAmicableNumbers,
					onload: function(response){
						$(response.responseText).find("td img[src^='img/amic']").each(function(i){
							BBadges.amicablenumbers.badges.push($(this).attr("src"));
							BBadges.amicablenumbers.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						// Amicable Numbers badge images are height-limited.
						var amicableNumbersBadges = '';
						for(var i = 0; i < BBadges.amicablenumbers.badges.length; i++){
							amicableNumbersBadges += '<img src="' + BBadges.amicablenumbers.root + BBadges.amicablenumbers.badges[i] + '" title="' + BBadges.amicablenumbers.alt[i] + '" alt="' + BBadges.amicablenumbers.alt[i] + '" height="28" />\n';
						}
						setTimeout(function(){
							$("#amicablenumbers").html(amicableNumbersBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#amicablenumbers").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#amicablenumbers").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// Asteroids.
			if(BBadges.idAsteroids){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.asteroids.root + BBadges.userPage + BBadges.idAsteroids,
					onload: function(response){
						$(response.responseText).find("td.fieldvalue img[alt|='badge']").each(function(i){
							BBadges.asteroids.badges.push($(this).attr("src"));
							BBadges.asteroids.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						var asteroidsBadges = '';
						for(var i = 0; i < BBadges.asteroids.badges.length; i++){
							asteroidsBadges += '<img src="' + BBadges.asteroids.root + BBadges.asteroids.badges[i] + '" title="' + BBadges.asteroids.alt[i] + '" alt="' + BBadges.asteroids.alt[i] + '" />\n';
						}
						setTimeout(function(){
							$("#asteroids").html(asteroidsBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#asteroids").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#asteroids").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// Atlas.
			if(BBadges.idAtlas){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.atlas.root + BBadges.userPage + BBadges.idAtlas,
					onload: function(response){
						$(response.responseText).find("td.fieldvalue img[src^='img/']").each(function(i){
							BBadges.atlas.badges.push($(this).attr("src"));
							BBadges.atlas.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						// Atlas badge images are height-limited.
						var atlasBadges = '';
						for(var i = 0; i < BBadges.atlas.badges.length; i++){
							atlasBadges += '<img src="' + BBadges.atlas.root + BBadges.atlas.badges[i] + '" title="' + BBadges.atlas.alt[i] + '" alt="' + BBadges.atlas.alt[i] + '" height="28" />\n';
						}
						setTimeout(function(){
							$("#atlas").html(atlasBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#atlas").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#atlas").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// Bitcoin Utopia.
			if(BBadges.idBitcoinUtopia){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.bitcoinUtopia.root + BBadges.userPage + BBadges.idBitcoinUtopia,
					onload: function(response){
						$(response.responseText).find("td.fieldvalue img[title*='credit']").each(function(i){
							BBadges.bitcoinUtopia.badges.push($(this).attr("src"));
							BBadges.bitcoinUtopia.alt.push($(this).attr("title"));
						});
						// Draw the badges after AJAX has returned.
						var bitcoinUtopiaBadges = '';
						for(var i = 0; i < BBadges.bitcoinUtopia.badges.length; i++){
							bitcoinUtopiaBadges += '<img src="' + BBadges.bitcoinUtopia.root + BBadges.bitcoinUtopia.badges[i] + '" title="' + BBadges.bitcoinUtopia.alt[i] + '" alt="' + BBadges.bitcoinUtopia.alt[i] + '" />\n';
						}
						setTimeout(function(){
							$("#bitcoinutopia").html(bitcoinUtopiaBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#bitcoinutopia").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#bitcoinutopia").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// Collatz Conjecture.
			if(BBadges.idCollatz){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.collatz.root + BBadges.userPage + BBadges.idCollatz,
					onload: function(response){

						// Get % RAC badges first. DON'T DO THIS NOW.
//						$(response.responseText).find("img[src^='img/pct_']").each(function(i){
//							BBadges.collatz.badges.push(BBadges.collatz.root + $(this).attr("src"));
//							BBadges.collatz.alt.push($(this).attr("title"));
//						});
//						$(response.responseText).find("img[src^='img/badge_']").each(function(i){
//							BBadges.collatz.badges.push(BBadges.collatz.root + $(this).attr("src"));
//							BBadges.collatz.alt.push($(this).attr("title"));
//						});
						// TEMP WHILE THEY SORT OUT WHETHER TO USE THE RANK BADGES.
						$(response.responseText).find("img[src^='img/']").each(function(i){
							if($(this).attr("src").match(/img\/\d+\.png/)){
							BBadges.collatz.badges.push(BBadges.collatz.root + $(this).attr("src"));
							BBadges.collatz.alt.push($(this).attr("title"));
							}
						});
							
						// Draw the badges after AJAX has returned.
						var collatzBadges = '';
						for(var i = 0; i < BBadges.collatz.badges.length; i++){
							// Collatz % RAC badge images are height-limited.
							collatzBadges += '<img src="' + BBadges.collatz.badges[i] + '" title="' + BBadges.collatz.alt[i] + '" alt="' + BBadges.collatz.alt[i] +
									(BBadges.collatz.badges[i].indexOf("img/pct_") == -1 ? '" />\n' : '" height="48" />\n');
						}
						setTimeout(function(){
							$("#collatz").html(collatzBadges);
							$("td#collatz img").css("vertical-align", "middle");
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#collatz").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#collatz").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// Citizen Science Grid.
			if(BBadges.idCSG){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.csg.root + BBadges.userPage + BBadges.idCSG,
					onload: function(response){
						$(response.responseText).find("td.fieldvalue img[title*='badge']").each(function(i){
							BBadges.csg.badges.push($(this).attr("src"));
							BBadges.csg.alt.push($(this).attr("title"));
						});
						// Draw the badges after AJAX has returned.
						var csgBadges = '';
						for(var i = 0; i < BBadges.csg.badges.length; i++){
							csgBadges += '<img src="' + BBadges.csg.root + BBadges.csg.badges[i] + '" title="' + BBadges.csg.alt[i] + '" alt="' + BBadges.csg.alt[i] + '" height="28" />\n';
						}
						setTimeout(function(){
							$("#csg").html(csgBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#csg").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#csg").html(GM_config.lang('Unable To Connect'));
					}
				});
			}
			
			// DENIS@Home
			if(BBadges.idDENIS){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.denis.root + BBadges.userPage + BBadges.idDENIS,
					onload: function(response){
						$(response.responseText).find("td.fieldvalue img[title*='credits']").each(function(i){
							BBadges.denis.badges.push($(this).attr("src"));
							BBadges.denis.alt.push($(this).attr("title"));
						});
						// Draw the badges after AJAX has returned.
						var denisBadges = '';
						for(var i = 0; i < BBadges.denis.badges.length; i++){
							denisBadges += '<img src="' + BBadges.denis.root + BBadges.denis.badges[i] + '" title="' + BBadges.denis.alt[i] + '" alt="' + BBadges.denis.alt[i] + '" height="28" />\n';
						}
						setTimeout(function(){
							$("#denis").html(denisBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#denis").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#denis").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// Enigma.
			if(BBadges.idEnigma){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.enigma.root + BBadges.userPage + BBadges.idEnigma,
					onload: function(response){
						var img = $(response.responseText).find("img[alt~='badge']");
						BBadges.enigma.badges = img.attr("src");
						BBadges.enigma.alt = img.attr("alt");

						// Draw the badges after AJAX has returned.
						var enigmaBadges = '<img src="' + BBadges.enigma.root + BBadges.enigma.badges + '" title="' + BBadges.enigma.alt + '" alt="' + BBadges.enigma.alt + '" />';
						setTimeout(function(){
							$("#enigma").html(enigmaBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#enigma").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#enigma").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// GoofyxGrid.
			if(BBadges.idGoofyx){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.goofyx.root + BBadges.userPage + BBadges.idGoofyx,
					onload: function(response){
						// Goofyx has 2 copies of the badge table on its user page.
						$(response.responseText).find("table.table.table-bordered:eq(1) td.fieldvalue img[title*='credit']").each(function(i){
							BBadges.goofyx.badges.push($(this).attr("src"));
							BBadges.goofyx.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						var goofyxBadges = '';
						for(var i = 0; i < BBadges.goofyx.badges.length; i++){
							goofyxBadges += '<img src="' + BBadges.goofyx.root + BBadges.goofyx.badges[i] + '" title="' + BBadges.goofyx.alt[i] + '" alt="' + BBadges.goofyx.alt[i] + '" height="28" />\n';
						}
						setTimeout(function(){
							$("#goofyx").html(goofyxBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#goofyx").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#goofyx").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// GPUGRID.
			if(BBadges.idGPUGrid){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.gpugrid.root + BBadges.userPage + BBadges.idGPUGrid,
					onload: function(response){
						var img = $(response.responseText).find("#level-badge img");
						// Badges.
						if(img.length > 0){
							BBadges.gpugrid.badges.push(img.attr("src"));
							BBadges.gpugrid.alt.push(img.attr("title"));
						}
						// Default badge for no publications.
						$(response.responseText).find("td img.badge").each(function(i){
							BBadges.gpugrid.badges.push($(this).attr("src"));
							BBadges.gpugrid.alt.push($(this).attr("title"));
							BBadges.gpugrid.ranks.push("None");
							BBadges.gpugrid.citations.push("None");
							BBadges.gpugrid.topics.push("None");
						});
						// Publication badges.
						$(response.responseText).find("#publication-badge").each(function(i){
							img = $(this).find("img");
							BBadges.gpugrid.badges.push(img.attr("src"));
							BBadges.gpugrid.alt.push(img.attr("title"));
						});
						$("<div>").html(response.responseText).find("#rank").each(function(i){
							BBadges.gpugrid.ranks.push($(this).text());
						});
						$("<div>").html(response.responseText).find("#citation a").each(function(i){
							BBadges.gpugrid.citations.push($(this).text());
						});
						$("<div>").html(response.responseText).find("#topic a").each(function(i){
							BBadges.gpugrid.topics.push($(this).text());
						});

						// Draw the badges after AJAX has returned.
						var gpugridBadges = '';
						for(var i = 0; i < BBadges.gpugrid.badges.length; i++){
							gpugridBadges += '<img src="' + BBadges.gpugrid.root + BBadges.gpugrid.badges[i] + '" title="' + BBadges.gpugrid.alt[i];
							if(i >= 1){
								// Only add rank, citation and topic for publication icons.
								gpugridBadges += '\nRank: ' + BBadges.gpugrid.ranks[i - 1] + '\nCitation: ' + BBadges.gpugrid.citations[i - 1] + '\nTopic: ' + BBadges.gpugrid.topics[i - 1];
							}
							gpugridBadges += '" alt="' + BBadges.gpugrid.alt[i] + '" />\n';
						}
						setTimeout(function(){
							$("#gpugrid").html(gpugridBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#gpugrid").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#gpugrid").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// Milkyway.
			if(BBadges.idMilkyway){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.milkyway.root + BBadges.userPage + BBadges.idMilkyway,
					onload: function(response){
						$(response.responseText).find("img[src*='badges']").each(function(i){
							BBadges.milkyway.badges.push(BBadges.milkyway.root + $(this).attr("src"));
							BBadges.milkyway.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						var milkywayBadges = '';
						for(var i = 0; i < BBadges.milkyway.badges.length; i++){
							milkywayBadges += '<img src="' + BBadges.milkyway.badges[i] + '" title="' + BBadges.milkyway.alt[i] + '" alt="' + BBadges.milkyway.alt[i] + '" height="28" />\n';
						}
						setTimeout(function(){
							$("#milkyway").html(milkywayBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#milkyway").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#milkyway").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// NFS.
			if(BBadges.idNFS){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.nfs.root + BBadges.userPage + BBadges.idNFS,
					onload: function(response){
						$(response.responseText).find("img[src*='img/']").each(function(i){
							BBadges.nfs.badges.push(BBadges.nfs.root + $(this).attr("src"));
							BBadges.nfs.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						var nfsBadges = '';
						for(var i = 0; i < BBadges.nfs.badges.length; i++){
							// NFS badge images are height-limited.
							nfsBadges += '<img src="' + BBadges.nfs.badges[i] + '" title="' + BBadges.nfs.alt[i] + '" alt="' + BBadges.nfs.alt[i] + '"  height="28" />\n';
						}
						setTimeout(function(){
							$("#nfs").html(nfsBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#nfs").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#nfs").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// NumberFields.
			if(BBadges.idNumberFields){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.numberfields.root + BBadges.userPage + BBadges.idNumberFields,
					onload: function(response){
						$(response.responseText).find("td img[src*='img/']").each(function(i){
							BBadges.numberfields.badges.push($(this).attr("src"));
							BBadges.numberfields.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						var numberfieldsBadges = '';
						for(var i = 0; i < BBadges.numberfields.badges.length; i++){
							// NFS badge images are height-limited.
							numberfieldsBadges += '<img src="' + BBadges.numberfields.root + BBadges.numberfields.badges[i] + '" title="' + BBadges.numberfields.alt[i] + '" alt="' + BBadges.numberfields.alt[i] + '"  height="28" />\n';
						}
						setTimeout(function(){
							$("#numberfields").html(numberfieldsBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#numberfields").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#numberfields").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			//POGS.
			// POGS is different and requires us to retrieve a set of trophy IDs first and then get the trophies separately
			if(BBadges.idPOGS){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.pogs.trophies.replace("{id}", BBadges.idPOGS),
					onload: function(response){
						var json = JSON.parse(response.responseText),
							trophySets = json["result"]["trophy sets"],
							defs = [];

						// Get a single trophy by ID.
						var getTrophy = function(id, setName, d){
							GM_xmlhttpRequest({
								method: 'GET',
								timeout: BBadges.delayAJAX,
								url: BBadges.pogs.trophy.replace("{id}", id),
								onload: function(response){
									var json = JSON.parse(response.responseText),
											trophy = json.result.trophy;
									// Let's use the tiny image size.
									BBadges.pogs.badges.push(trophy.image_url.replace("original.png", "tiny.png"));
									BBadges.pogs.alt.push(setName + " - " + trophy.title);
									d.resolve();
								},
							});
						}

						// Get a trophy, creating a deferred object for each call
						var getNextTrophy = function(setName, id){
							var d = new $.Deferred();
							getTrophy(id, setName, d);
							defs.push(d);
						};
						for(var set in trophySets){
							var id,
								setName = trophySets[set]["trophy set"].name;
							for(var i in trophySets[set]["trophy set"].trophies){
								// Show all of the specials but just the highest trophy of other groups.
								id = trophySets[set]["trophy set"].trophies[i].trophy.id;
								getNextTrophy(setName, id);
								if(setName !== "Specials"){
									break;
								}
							}
						}

						// Draw the badges after all deferred AJAX calls have returned.
						$.when.apply($, defs).done(function(value){
							var pogsBadges = '';
							for(var i = 0; i < BBadges.pogs.badges.length; i++){
								pogsBadges += '<img src="' + BBadges.pogs.badges[i] + '" title="' + BBadges.pogs.alt[i] + '" alt="' + BBadges.pogs.alt[i] + '" />\n';
							}
							setTimeout(function(){
								$("#pogs").html(pogsBadges);
							}, BBadges.delayTabLoad);
						});


					},
					onerror: function(response){
						$("#pogs").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#pogs").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// PrimeGrid.
			if(BBadges.idPrimeGrid){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.primegrid.root + BBadges.userPage + BBadges.idPrimeGrid,
					onload: function(response){
						$(response.responseText).find(".badge").each(function(i){
							var src = $(this).attr("src");
							// Strip the initial slash from the local img path.
							BBadges.primegrid.badges.push(src.substr(1));

							var alt = $(this).attr("alt");
							if(src.indexOf("sr2sieve_321_") != -1){
								alt = alt.replace('321 Sieve', '321 Prime Search Sieve');
							}
							else if(src.indexOf("gcwsieve_") != -1){
								alt = alt.replace('Cullen/Woodall Sieve', 'Cullen/Woodall Prime Search Sieve');
							}
							else if(src.indexOf("sr2sieve_pps_") != -1){
								alt = alt.replace('PPS Sieve', 'Proth Prime Search Sieve');
							}
							else if(src.indexOf("sr2sieve_psp_") != -1){
								alt = alt.replace('Sierpinski (ESP/PSP/SoB) Sieve', 'Extended Sierpinski Problem/Prime Sierpinski Problem/Seventeen or Bust Sieve');
							}
							else if(src.indexOf("sr2sieve_trp_") != -1){
								alt = alt.replace('TRP Sieve', 'The Riesel Problem Sieve');
							}
							else if(src.indexOf("321_") != -1){
								alt = alt.replace('321 LLR', '321 Prime Search LLR');
							}
							else if(src.indexOf("cul_") != -1){
								alt = alt.replace('Cullen LLR', 'Cullen Prime Search LLR');
							}
							else if(src.indexOf("esp_") != -1){
								alt = alt.replace('ESP LLR', 'Extended Sierpinski Problem LLR');
							}
							else if(src.indexOf("pps_llr_") != -1){
								alt = alt.replace('PPS LLR', 'Proth Prime Search LLR');
							}
							else if(src.indexOf("psp_llr_") != -1){
								alt = alt.replace('PSP LLR', 'Prime Sierpinski Problem LLR');
							}
							else if(src.indexOf("sob_llr_") != -1){
								alt = alt.replace('SoB LLR', 'Seventeen or Bust LLR');
							}
							else if(src.indexOf("sr5_") != -1){
								alt = alt.replace('SR5 LLR', 'Sierpinski/Riesel Base 5 Problem LLR');
							}
							else if(src.indexOf("sgs_") != -1){
								alt = alt.replace('SGS LLR', 'Sophie Germain Prime Search LLR');
							}
							else if(src.indexOf("tps_") != -1){
								alt = alt.replace('TPS LLR', 'Twin Prime Search LLR');  //13678
							}
							else if(src.indexOf("trp_llr_") != -1){
								alt = alt.replace('TRP LLR', 'The Riesel Problem LLR');
							}
							else if(src.indexOf("woo_") != -1){
								alt = alt.replace('Woodall LLR', 'Woodall Prime Search LLR');
							}
							else if(src.indexOf("ap26_") != -1){
								alt = alt.replace('AP 26/27', 'Arithmetic Progression of 26/27 Primes');
							}
							else if(src.indexOf("genefer_") != -1){
								alt = alt.replace('GFN', 'Generalized Fermat Prime Search');
							}
							else if(src.indexOf("manual_") != -1){
								alt = alt.replace('PSA', 'Project Staging Area');
							}
							BBadges.primegrid.alt.push(alt);
						});

						// Draw the badges after AJAX has returned.
						var primegridBadges = '';
						for(var i = 0; i < BBadges.primegrid.badges.length; i++){
							primegridBadges += '<img src="' + BBadges.primegrid.root + BBadges.primegrid.badges[i] + '" title="' + BBadges.primegrid.alt[i] + '" alt="' + BBadges.primegrid.alt[i] + '" />\n';
						}
						setTimeout(function(){
							$("#primegrid").html(primegridBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#primegrid").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#primegrid").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// Radioactive.
			if(BBadges.idRadioactive){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.radioactive.root + BBadges.userPage + BBadges.idRadioactive,
					onload: function(response){
						var img = $(response.responseText).find("img[src*='display_badge.php']");
						BBadges.radioactive.badges = img.attr("src");
						BBadges.radioactive.alt = img.attr("alt");

						// Draw the badges after AJAX has returned.
						var radioactiveBadges = '<img src="' + BBadges.radioactive.root + BBadges.radioactive.badges + '" title="' + BBadges.radioactive.alt + '" alt="' + BBadges.radioactive.alt + '" />';
						setTimeout(function(){
							$("#radioactive").html(radioactiveBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#radioactive").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#radioactive").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// SRBase.
			if(BBadges.idSRBase){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.srbase.root + BBadges.userPage + BBadges.idSRBase,
					onload: function(response){
						$(response.responseText).find("td.fieldvalue img[title*='credit']").each(function(i){
							BBadges.srbase.badges.push($(this).attr("src"));
							BBadges.srbase.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						var srbaseBadges = '';
						for(var i = 0; i < BBadges.srbase.badges.length; i++){
							srbaseBadges += '<img src="' + BBadges.srbase.root + BBadges.srbase.badges[i] + '" title="' + BBadges.srbase.alt[i] + '" alt="' + BBadges.srbase.alt[i] + '" />\n';
						}
						setTimeout(function(){
							$("#srbase").html(srbaseBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#srbase").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#srbase").html(GM_config.lang('Unable To Connect'));
					}
				});
			}
			
			// TN_Grid.
			if(BBadges.idTNGrid){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.tngrid.root + BBadges.userPage + BBadges.idTNGrid,
					onload: function(response){
						$(response.responseText).find("td.fieldvalue img[title*='credit']").each(function(i){
							BBadges.tngrid.badges.push($(this).attr("src"));
							BBadges.tngrid.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						var tngridBadges = '';
						for(var i = 0; i < BBadges.tngrid.badges.length; i++){
							tngridBadges += '<img src="' + BBadges.tngrid.root + BBadges.tngrid.badges[i] + '" title="' + BBadges.tngrid.alt[i] + '" alt="' + BBadges.tngrid.alt[i] + '" height="28" />\n';
						}
						setTimeout(function(){
							$("#tngrid").html(tngridBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#tngrid").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#tngrid").html(GM_config.lang('Unable To Connect'));
					}
				});
			}
			
			// Universe.
			if(BBadges.idUniverse){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.universe.root + BBadges.userPage + BBadges.idUniverse,
					onload: function(response){
						$(response.responseText).find("td.fieldvalue img[src^='img/']").each(function(i){
							BBadges.universe.badges.push($(this).attr("src"));
							BBadges.universe.alt.push($(this).attr("title"));
						});

						// Draw the badges after AJAX has returned.
						var universeBadges = '';
						for(var i = 0; i < BBadges.universe.badges.length; i++){
							universeBadges += '<img src="' + BBadges.universe.root + BBadges.universe.badges[i] + '" title="' + BBadges.universe.alt[i] + '" alt="' + BBadges.universe.alt[i] + '" height="28" />\n';
						}
						setTimeout(function(){
							$("#universe").html(universeBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#universe").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#universe").html(GM_config.lang('Unable To Connect'));
					}
				});
			}
			
			// WCG.
			if(BBadges.idWCG){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.wcg.root + BBadges.idWCG + "&xml=true",
					onload: function(response){
						$(response.responseText).find("Badge").each(function(i){
							BBadges.wcg.badges.push($(this).find("url").text());
							BBadges.wcg.alt.push($(this).find("description").text());
						});

						// Draw the badges after AJAX has returned.
						var wcgBadges = '';
						for(var i = 0; i < BBadges.wcg.badges.length; i++){
							wcgBadges += '<img src="' + BBadges.wcg.badges[i] + '" title="' + BBadges.wcg.alt[i] + '" alt="' + BBadges.wcg.alt[i] + '" />\n';
						}
						setTimeout(function(){
							$("#wcg").html(wcgBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#wcg").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#wcg").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// WUProp.
			if(BBadges.idWUProp){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.wuprop.root + BBadges.userPage + BBadges.idWUProp,
					onload: function(response){
						
						$(response.responseText).find("img[src*='img/badge/']").each(function(i){
							BBadges.wuprop.badges.push($(this).attr("src"));
							
							// Split the image name (e.g. 1000_250_100_0_0.png) and build the alt string.
							var nums = $(this).attr("src").split('/')[2].replace('.png', '').split('_');
							var apps = {
								'Sapphire': 0, // 5000
								'Emerald': 0, // 2500
								'Ruby': 0, // 1000
								'Gold': 0, // 500
								'Silver': 0, // 250
								'Bronze': 0     // 100
							};

							for(n in nums){
								switch(nums[n]){
									case '5000':
										apps.Sapphire += 20
										break;
									case '2500':
										apps.Emerald += 20
										break;
									case '1000':
										apps.Ruby += 20
										break;
									case '500':
										apps.Gold += 20
										break;
									case '250':
										apps.Silver += 20
										break;
									case '100':
										apps.Bronze += 20
										break;
								}
							}

							var alt = '';
							if(apps.Sapphire > 0){
								alt += "Sapphire " + apps.Sapphire + " apps > 5000hrs.";
							}
							if(apps.Emerald > 0){
								alt += alt.length > 0 ? '\n' : ''
								alt += "Emerald " + apps.Emerald + " apps > 2500hrs.";
							}
							if(apps.Ruby > 0){
								alt += alt.length > 0 ? '\n' : ''
								alt += "Ruby " + apps.Ruby + " apps > 1000hrs.";
							}
							if(apps.Gold > 0){
								alt += alt.length > 0 ? '\n' : ''
								alt += "Gold " + apps.Gold + " apps > 500hrs.";
							}
							if(apps.Silver > 0){
								alt += alt.length > 0 ? '\n' : ''
								alt += "Silver " + apps.Silver + " apps > 250hrs.";
							}
							if(apps.Bronze > 0){
								alt += alt.length > 0 ? '\n' : ''
								alt += "Bronze " + apps.Bronze + " apps > 100hrs.";
							}
							
							BBadges.wuprop.alt.push(alt);
						});

						// Draw the badges after AJAX has returned.
						var wupropBadges = '';
						for(var i = 0; i < BBadges.wuprop.badges.length; i++){
							wupropBadges += '<img src="' + BBadges.wuprop.root + BBadges.wuprop.badges[i] + '" title="' + BBadges.wuprop.alt[i] + '" alt="' + BBadges.wuprop.alt[i] + '" />\n';
						}
						
						setTimeout(function(){
							$("#wuprop").html(wupropBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#wuprop").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#wuprop").html(GM_config.lang('Unable To Connect'));
					}
				});
			}

			// Yoyo.
			if(BBadges.idYoyo){
				GM_xmlhttpRequest({
					method: 'GET',
					timeout: BBadges.delayAJAX,
					url: BBadges.yoyo.root + BBadges.userPage + BBadges.idYoyo,
					onload: function(response){
						$(response.responseText).find("th:contains('Badges Earned')").parent().parent().children().each(function(i){
							var img = $(this).find("img");
							// Skip the header row.
							if(img.length > 0){
								var src = img.attr('src');
								BBadges.yoyo.badges.push(src);
								var imgName = src.slice(37);
								switch(imgName[0]){
									case '2':
										alt = 'Cruncher OGR ';
										break;
									case '3':
										alt = 'Evolution@home ';
										break;
									case '4':
										alt = 'Muon ';
										break;
									case '5':
										alt = 'ECM ';
										break;
									case '6':
										alt = 'Euler 625 ';
										break;
									case '8':
										alt = 'Harmonious Trees ';
										break;
									case '9':
										alt = 'Odd Weird Search ';
										break;
								}
								switch(imgName[2]){
									case '1':
										alt += 'Bronze 10K';
										break;
									case '2':
										alt += 'Silver 100K';
										break;
									case '3':
										alt += 'Gold 500K';
										break;
									case '4':
										alt += 'Master 1M';
										break;
									case '5':
										alt += 'Grandmaster 2M';
										break;
									case '6':
										alt += 'Guru 5M';
										break;
									case '7':
										alt += 'Spirit 10M';
										break;
									case '8':
										alt += 'Held 25M';
										break;
									case '9':
										alt += 'Half God 50M';
										break;
									case '10':
										alt += 'God 100M';
										break;
								}

								BBadges.yoyo.alt.push(alt);
							}
						});

						// Draw the badges after AJAX has returned.
						var yoyoBadges = '';
						for(var i = 0; i < BBadges.yoyo.badges.length; i++){
							yoyoBadges += '<img src="' + BBadges.yoyo.badges[i] + '" title="' + BBadges.yoyo.alt[i] + '" alt="' + BBadges.yoyo.alt[i] + '" />\n';
						}
						setTimeout(function(){
							$("#yoyo").html(yoyoBadges);
						}, BBadges.delayTabLoad);
					},
					onerror: function(response){
						$("#yoyo").html(GM_config.lang('Unable To Connect'));
					},
					ontimeout: function(response){
						$("#yoyo").html(GM_config.lang('Unable To Connect'));
					}
				});
			}
		}catch(e){
			alert('An error occurred while checking your stats:\n' + e);
		}
	});
})();

