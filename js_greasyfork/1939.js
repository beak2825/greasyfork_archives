// ==UserScript==
// @name           AlloCine_Zap
// @fullname       AlloCine Zap
// @author         Mike007
// @homepageURL    https://greasyfork.org/scripts/1939
// @namespace      https://greasyfork.org/scripts/1939
// @description    Supprime les publicites - Zapping entre les videos sans changer de page
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAByFJREFUeNqkVntwlNUV/517v+/bZ5LNY/MihCRAE4MESFMIah0eSqllKq0yUmkrHTvF+k8fOq3TdjpKHwMzpQ+krVintnTo2IqM70FGqzyMSKLSoIRAEwPkHQjZ3WR3v9e9vd+SlgSSEce7d3Zm795zfuf8fveec0m+Qbj28f+98lottGvaZUhvowNYEC4Yy9ipbxcQ9MkAfBJE7R3agdbgqb68lMjTguHSqL+q2Job7avMac8JSy+b6WFoWorUchAn2vmW3ca+lkAiqRGklA6XjBvhUF50fs2i25bnLJnZPD/vjVBI5UcfB4AkAvT4Ht8P/shjCTBuc0i1JkgSp7ICX0O1k5uLva9HV6754rrlvhvyd5bkj02JMRWAWgjQtl3BB3co1kWGbGhcTTdt8Xu/HNrxgOkPu6MX5Zy1NDCSali84r57bv586a9Lo/GrMdgU4Qfxz5f1B3eIaMS4tdH/y2/7nt0WKi8MpC2NQb97hfAb2nAPD4do0fUG4G85+q/f/Gn/K933xuMcXH6UyDr6e/n3HlXrcu0t/sd/MgrHBhMV0dAzh8PL6q1kktdvkH3DctOdoWULzH2HhWHoHxxr2v3ijJI7lq2uee2jMjDwh72s94KpyGk9MSYSAgkm4lgwd2zzd2JZBq17KP3eKbP/vHuoOb64VuOkQXJd0w69/tKL71b0DwehyekBOEaH+d/2q5PJOHfbu0RnnwbD9S6Ww8d6tY0/l2nL9Ome4W036ItrUwX55DiMEVlW8kDTyaNds69wya7g552T1NUndSUpo5GkbG4ntcikpJD22HO+E512baXftH0zi7QNq5xQSNbNZkKqCEhj/ExXx5ttWdKacOGvBNDw705vhcZ3uE2t6oeuMEbO47d7RG629tI2PL/VfPoXVnG+pRwtraVL/jjn6WSs9XQ6Nsomep0sssS5wUkMvt1GblrwAL3yKuvud++706ioHKkoE6pISJNISy+tC5LKMHOVpXS7ekbiKS2Sa8GlaUSe4J9zOvmhkoHA2TMHvUDvudWCJZEETPJsTaqrcgsj5LjjZolEQl336TUglBRc5k9jMjHmtJ423CQ/0orKIq26UkWgC6lfikO6VBoV182RQnCSSilusFROUGVH0wC4sq5KeDgTgnjrpNPTrw/ExVBM3Pwttv2pLPLrLtO9bap6GFgyz+NZknCFKI86kUimyk4NYFNDtSyNws6kLEmJLZrbRGc/F5Y07dT7XWPPHbKJOeof5RGCwXVvnKcCJpeUK7ayXsAvJ8Y3GcBBpFDctZxEZgcTxDVxuoMn0prhExk7fc1npXLBuEJnHhMOLai2inICri2yQrh7pfDahu+y46tEtsV314n8CLNUEuT1lr6LjmOaX12d5Tj+WSXZGz+nDQ8E3jkdNkWYcVJClZejttpWAnxznZi9UIgEho5DmOO++cMbJ9c/l3IKRV6AP38YxNSHXJeVFfJtPzQrSsLf/7qZSLkr79d+tdvuHgo0LmbHjgd27dP2H2Ez/PaPFroDh9yjO/HWkxjrQcUKxeN05dpHDz1qbN3tcsaFFJ+e52/+iwmfgwT99LGcn+2yGLMkZ9X5xn/OC8dBbtB9xJcOXhQpZap0EdB1fOUpChZP2TIV1bbc8oAdLdIeflKOxmTPWfPtPdx+zzrcyneKNDSRBVrtWp/pTzWBzl1nPFJvX9grRoBFayl7Bg7+XvqNTOuWVwOQV/KkjaEj7h1hYVTy9nfdWXHZsgV+4DRUjNYauI0QM1UYwO1RrN3q+E2x+1kvsOwyxLulkjmvEv6od161Sa4lHAt2CufbMNyLtqel3uvUj5+vTKMr893kp9s1GcliQ+cg+53Scploc1/eDietrgSan5B2WkWIuvXk/U5OBkj0InEBp16QRgSRWV6NCRejaC4+fBOWQNUyrN9suTHEzqJ5hyjJl339GB2BZVL913B4uxRJr0oGorjxLqq4BUhNLHYakoM434HEIHqPYXDAk6JqIVZtpqbfSVMgtxDLf0yJLtHyhOw4gtIazGigMx/Isx2oGUDxfLiWx9hNm+hTX4Ku2EyPlzXtUl2IdcEahS8bVhIN3yAtCKVVwRK0/RknXoN6sdSspo4DqoKi+gt08qA80wprTF6/AjOWUNlSDB2DOkuqEXANerZyN6Fcq24hhDfPNaO7Rar0zQTChSipg28f2l7wclScHvu7jDlYdb938hrWe++7RRsoUOL1qFQfBt5HMBezFyJaO87MZeLj/6DhDsS6oaIuXIDWv8rjr6JsNvo6vBeLnnm3qBEIIHcOlm6i4sb/lXQzI32GBTcFOwl/8fjzcmJHI3nQ40jJm04gdgZDnciv9I5wV5O8cArpMZQ3qklF86AEHz9PVw+Wmc50Lzs5/p7wNumwB+E68GWhpwUF1fCXXLp6GXuJjzumKRUsQ40v49TBJxn/FWAAAhQyONbghosAAAAASUVORK5CYII=
// @version        6.9.8
// @date           30/01/2018
// @source         https://greasyfork.org/scripts/1939
// @supportURL     https://greasyfork.org/scripts/1939/feedback
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @grant          unsafeWindow
// @run-at         document-end
// @match          http://www.allocine.fr/*
// @match          http://www.sensacine.com/*
// @match          https://www.sensacine.com.mx/*
// @match          http://www.filmstarts.de/*
// @match          http://www.beyazperde.com/*
// @match          http://www.adorocinema.com/*
// @exclude        http://www.allocine.fr/*.css
// @exclude        http://www.sensacine.com/*.css
// @exclude        http(|s)://www.sensacine.com.mx/*.css
// @exclude        http://www.filmstarts.de/*.css
// @exclude        http://www.beyazperde.com/*.css
// @exclude        http://www.adorocinema.com/*.css
// @exclude        http://www.allocine.fr/*.js
// @exclude        http://www.sensacine.com/*.js
// @exclude        http(|s)://www.sensacine.com.mx/*.js
// @exclude        http://www.filmstarts.de/*.js
// @exclude        http://www.beyazperde.com/*.js
// @exclude        http://www.adorocinema.com/*.js
// @compatible     firefox
// @compatible     chrome
// @compatible     opera
// @downloadURL https://update.greasyfork.org/scripts/1939/AlloCine_Zap.user.js
// @updateURL https://update.greasyfork.org/scripts/1939/AlloCine_Zap.meta.js
// ==/UserScript==

// @exclude        http://*/_video/iblogvision.aspx*
// @require        https://raw.githubusercontent.com/beatgammit/base64-js/master/lib/b64.js

//****************************************************************
//	functions for Opera
//****************************************************************
if (typeof GM_getValue === "undefined"){
	if(typeof window.localStorage == "object") {
		function GM_getValue ( key, defaultValue ) {
			var value = window.localStorage.getItem(key);
			if( value == null ) value = defaultValue;
			else if(value=='true') value = true;
			else if(value=='false') value = false;
			return value;
		}
	}
	else{
		function GM_getValue( cookieName, oDefault ) {
			var cookieJar = document.cookie.split( "; " );
			for( var x = 0; x < cookieJar.length; x++ ) {
				var oneCookie = cookieJar[x].split( "=" );
				if( oneCookie[0] == escape( cookieName ) ) {
					try {
						eval('var footm = '+unescape( oneCookie[1] ));
					} catch(e) { return oDefault; }
					return footm;
				}
			}
			return oDefault;
		}
	}
}

if (typeof GM_setValue === "undefined") {
	if(typeof window.localStorage == "object") {
		function GM_setValue( key, value ) {
			window.localStorage.setItem( key, value );
		}
	}
	else{
		function getRecoverableString(oVar,notFirst) {
			var oType = typeof(oVar);
			if( ( oType == 'null' ) || ( oType == 'object' && !oVar ) ) {
				//most browsers say that the typeof for null is 'object', but unlike a real
				//object, it will not have any overall value
				return 'null';
			}
			if( oType == 'undefined' ) { return 'window.uDfXZ0_d'; }
			if( oType == 'object' ) {
				//Safari throws errors when comparing non-objects with window/document/etc
				if( oVar == window ) { return 'window'; }
				if( oVar == document ) { return 'document'; }
				if( oVar == document.body ) { return 'document.body'; }
				if( oVar == document.documentElement ) { return 'document.documentElement'; }
			}
			if( oVar.nodeType && ( oVar.childNodes || oVar.ownerElement ) ) { return '{error:\'DOM node\'}'; }
			if( !notFirst ) {
				Object.prototype.toRecoverableString = function (oBn) {
					if( this.tempLockIgnoreMe ) { return '{\'LoopBack\'}'; }
					this.tempLockIgnoreMe = true;
					var retVal = '{', sepChar = '', j;
					for( var i in this ) {
						if( i == 'toRecoverableString' || i == 'tempLockIgnoreMe' || i == 'prototype' || i == 'constructor' ) { continue; }
						if( oBn && ( i == 'index' || i == 'input' || i == 'length' || i == 'toRecoverableObString' ) ) { continue; }
						j = this[i];
						if( !i.match(basicObPropNameValStr) ) {
							//for some reason, you cannot use unescape when defining peoperty names inline
							for( var x = 0; x < cleanStrFromAr.length; x++ ) {
								i = i.replace(cleanStrFromAr[x],cleanStrToAr[x]);
							}
							i = '\''+i+'\'';
						} else if( window.ActiveXObject && navigator.userAgent.indexOf('Mac') + 1 && !navigator.__ice_version && window.ScriptEngine && ScriptEngine() == 'JScript' && i.match(/^\d+$/) ) {
							//IE mac does not allow numerical property names to be used unless they are quoted
							i = '\''+i+'\'';
						}
						retVal += sepChar+i+':'+getRecoverableString(j,true);
						sepChar = ',';
					}
					retVal += '}';
					this.tempLockIgnoreMe = false;
					return retVal;
				};
				Array.prototype.toRecoverableObString = Object.prototype.toRecoverableString;
				Array.prototype.toRecoverableString = function () {
					if( this.tempLock ) { return '[\'LoopBack\']'; }
					if( !this.length ) {
						var oCountProp = 0;
						for( var i in this ) { if( i != 'toRecoverableString' && i != 'toRecoverableObString' && i != 'tempLockIgnoreMe' && i != 'prototype' && i != 'constructor' && i != 'index' && i != 'input' && i != 'length' ) { oCountProp++; } }
						if( oCountProp ) { return this.toRecoverableObString(true); }
					}
					this.tempLock = true;
					var retVal = '[';
					for( var i = 0; i < this.length; i++ ) {
						retVal += (i?',':'')+getRecoverableString(this[i],true);
					}
					retVal += ']';
					delete this.tempLock;
					return retVal;
				};
				Boolean.prototype.toRecoverableString = function () {
					return ''+this+'';
				};
				Date.prototype.toRecoverableString = function () {
					return 'new Date('+this.getTime()+')';
				};
				Function.prototype.toRecoverableString = function () {
					return this.toString().replace(/^\s+|\s+$/g,'').replace(/^function\s*\w*\([^\)]*\)\s*\{\s*\[native\s+code\]\s*\}$/i,'function () {[\'native code\'];}');
				};
				Number.prototype.toRecoverableString = function () {
					if( isNaN(this) ) { return 'Number.NaN'; }
					if( this == Number.POSITIVE_INFINITY ) { return 'Number.POSITIVE_INFINITY'; }
					if( this == Number.NEGATIVE_INFINITY ) { return 'Number.NEGATIVE_INFINITY'; }
					return ''+this+'';
				};
				RegExp.prototype.toRecoverableString = function () {
					return '\/'+this.source+'\/'+(this.global?'g':'')+(this.ignoreCase?'i':'');
				};
				String.prototype.toRecoverableString = function () {
					var oTmp = escape(this);
					if( oTmp == this ) { return '\''+this+'\''; }
					return 'unescape(\''+oTmp+'\')';
				};
			}
			if( !oVar.toRecoverableString ) { return '{error:\'internal object\'}'; }
			var oTmp = oVar.toRecoverableString();
			if( !notFirst ) {
				//prevent it from changing for...in loops that the page may be using
				delete Object.prototype.toRecoverableString;
				delete Array.prototype.toRecoverableObString;
				delete Array.prototype.toRecoverableString;
				delete Boolean.prototype.toRecoverableString;
				delete Date.prototype.toRecoverableString;
				delete Function.prototype.toRecoverableString;
				delete Number.prototype.toRecoverableString;
				delete RegExp.prototype.toRecoverableString;
				delete String.prototype.toRecoverableString;
			}
			return oTmp;
		}

		function GM_setValue( cookieName, cookieValue, lifeTime ) {
			if( !cookieName ) { return; }
			if( lifeTime == "delete" ) { lifeTime = -10; } else { lifeTime = 31536000; }
			document.cookie = escape( cookieName ) + "=" + escape( getRecoverableString( cookieValue ) ) +
				";expires=" + ( new Date( ( new Date() ).getTime() + ( 1000 * lifeTime ) ) ).toGMTString() + ";path=/";
		}
	}
}
if (typeof GM_xmlhttpRequest === "undefined") {
	function GM_xmlhttpRequest(details) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			var responseState = {
				responseXML:(xmlhttp.readyState==4 ? xmlhttp.responseXML : ''),
				responseText:(xmlhttp.readyState==4 ? xmlhttp.responseText : ''),
				readyState:xmlhttp.readyState,
				responseHeaders:(xmlhttp.readyState==4 ? xmlhttp.getAllResponseHeaders() : ''),
				status:(xmlhttp.readyState==4 ? xmlhttp.status : 0),
				statusText:(xmlhttp.readyState==4 ? xmlhttp.statusText : '')
			}
			if (details["onreadystatechange"]) {
				details["onreadystatechange"](responseState);
			}
			if (xmlhttp.readyState==4) {
				if (details["onload"] && xmlhttp.status>=200 && xmlhttp.status<300) {
					details["onload"](responseState);
				}
				if (details["onerror"] && (xmlhttp.status<200 || xmlhttp.status>=300)) {
					details["onerror"](responseState);
				}
			}
		}
		try {
			//cannot do cross domain
			xmlhttp.open(details.method, details.url);
//			alert(details.method +':'+ details.url)
		} catch(e) {
			if( details["onerror"] ) {
				//simulate a real error
				details["onerror"]({responseXML:'',responseText:'',readyState:4,responseHeaders:'',status:403,statusText:'Forbidden'});
			}
			return;
		}
		if (details.headers) {
			for (var prop in details.headers) {
				xmlhttp.setRequestHeader(prop, details.headers[prop]);
			}
		}
		xmlhttp.send((typeof(details.data)!='undefined')?details.data:null);
	}
}

//****************************************************************
//	Start
//****************************************************************
if (typeof unsafeWindow === "undefined") unsafeWindow = window;
if (typeof unsafeWindow !== "undefined" && unsafeWindow.ac != undefined && unsafeWindow.ac.adRenderer != undefined)
{
	// Zap page intro: http://userscripts.org:8080/scripts/show/60935
	unsafeWindow.ac.adRenderer.interstitialStop();
	window.clearInterval(unsafeWindow.ac.adRenderer.preRollInterval);
	window.clearInterval(unsafeWindow.ac.adRenderer.timePreroll);
	window.clearInterval(unsafeWindow.ac.adRenderer.__interstitial);
}

var BalisesDivPub = document.getElementsByTagName('div');
var NbBalisesDivPub = BalisesDivPub.length;
//for (i=0; i<NbBalisesDivPub ; i++)
for (i=NbBalisesDivPub-1; i>=0 ; i--)
{
	if (BalisesDivPub[i] && ( BalisesDivPub[i].id.match(/ad_((.+?)_)?(\d+)(.*?)/) || BalisesDivPub[i].id.match(/scr_(\d+)(.*?)/) || BalisesDivPub[i].id.match(/wads(.*?)/) ) )
	{
		BalisesDivPub[i].style.display='none';
		BalisesDivPub[i].parentNode.removeChild(BalisesDivPub[i]);
	}
}


//****************************************************************
//		C h e c k   u p d a t e
//****************************************************************
var AZ_id = 1939; //var AZ_id = 59373;
var AZ_today = new Date();
AZ_today_YYYYMMDD = parseInt(AZ_today.getFullYear()*10000+AZ_today.getMonth()*100+AZ_today.getDate());

var AZ_new_check = 1;
if (!GM_getValue('AZ_FreqUpdate'))	GM_setValue('AZ_FreqUpdate', 7);
if (!GM_getValue('AZ_Version'))		GM_setValue('AZ_Version', 0);
if (!GM_getValue('AZ_DateUpdate'))	GM_setValue('AZ_DateUpdate', AZ_today_YYYYMMDD);
if (!GM_getValue('AZ_DateInit') || GM_getValue('AZ_DateInit') < 20140608)
{
	GM_setValue('AZ_DateInit', 20140608);
	GM_setValue('AZ_DateUpdate', 0);
	GM_setValue('AZ_Version', 0);
}
AZ_new_check = parseInt(GM_getValue('AZ_DateUpdate'))+parseInt(GM_getValue('AZ_FreqUpdate'));
if (AZ_today_YYYYMMDD > GM_getValue('AZ_DateUpdate') && AZ_today_YYYYMMDD >= AZ_new_check)
{
	var erreur_later = false;
	if(!GM_getValue('AZ_DateLater'))
		erreur_later = true;
	if (erreur_later || GM_getValue('AZ_DateLater')<=AZ_today_YYYYMMDD)	check_AZ_version();
}

//****************************************************************
//		L a n g u a g e
//****************************************************************
//if (!GM_getValue('AZ_lng') || GM_getValue('AZ_lng')=='auto')	var AZ_LANG = navigator.language;
//else															var AZ_LANG = GM_getValue('AZ_lng');

var AZ_LANG = navigator.language;
if (AZ_LANG!='fr' && AZ_LANG!='en')								AZ_LANG = 'en';
//AZ_LANG = 'en';

switch ( AZ_LANG )
{
	case 'fr':
	AZ_LNG =
	{
		name:				'AlloCine Zap',
		show:				'Afficher',
		hide:				'Masquer',
		show_vid:			'Afficher la vidéo',
		hide_vid:			'Masquer la vidéo',
		load_vid:			'Charger cette vidéo',
		size:				'Taille',
		player:				'Lecteur',
		quality:			'Qualité|Haute|Moyenne|Faible',
		related_vid:		'Vidéos liées',
		error_vid:			'Erreur. Rechargez la page SVP.',
		position_reset:		'Réinitialiser positionnement',
		options:			'Options',
		OptBorder:			'Bordure',
		OptPosition:		'Position',
		OptOriginal:		'Originelle',
		OptFloat:			'Flottante',
		OptIcons:			'Icônes|Bleu|Rouge|Vert|Jaune',
		OptColor:			'Couleur de la police',
		OptBgcolor:			'Couleur d\'arrière-plan',
		download:			'Télécharger',
		monallocine:		'Mon AlloCin&eacute;',
		header:				'En-t&ecirc;te',
		header_fixed:		'Fixe',
		header_normal:		'Normal',
		footer:				'Pied de page',
		bydefault:			'Par défaut',
		option_close:		'Fermer',
		options_reload:		'Recharger la page ?',
		option_cancel:		'Annuler',
		title_update_new:	'Nouvelle version de',
		check_updates:		'Vérifier les mises à jour',
		check_noresult:		'Pas de nouvelle version de AlloCine Zap',
		update_button:		'Mettre à jour',
		later_button:		'Plus tard',
		autoplay:			'Lecture auto.',
		on:					'Activé',
		off:				'Désactivé',
		url:				'URL',
		server:				'fr',
		donate_title:		'Si vous trouvez AlloCine Zap utile, vous pouvez faire un don libre.'

	};
	break;
	case 'en':
	AZ_LNG =
	{
		name:				'AlloCine Zap',
		show:				'Show',
		hide:				'Hide',
		show_vid:			'Show video',
		hide_vid:			'Hide video',
		load_vid:			'Load this video',
		size:				'Size',
		player:				'Player',
		quality:			'Quality|Hight|Medium|Low',
		related_vid:		'Related videos',
		error_vid:			'Error. please, reload the page.',
		position_reset:		'Reset positioning',
		options:			'Options',
		OptBorder:			'Border',
		OptPosition:		'Position',
		OptOriginal:		'Original',
		OptFloat:			'Float',
		OptIcons:			'Icons|Blue|Red|Green|Yellow',
		OptColor:			'Font color',
		OptBgcolor:			'Background color',
		download:			'Download',
		monallocine:		'My Screenrush',
		header:				'Header',
		header_fixed:		'Fixed',
		header_normal:		'Normal',
		footer:				'Footer',
		bydefault:			'By default',
		options_reload:		'Reload page ?',
		option_close:		'Close',
		option_cancel:		'Cancel',
		title_update_new:	'New version of',
		check_updates:		'Check for updates',
		check_noresult:		'No new version of AlloCine Zap',
		update_button:		'Update',
		later_button:		'Later',
		autoplay:			'Autoplay',
		on:					'On',
		off:				'Off',
		url:				'URL',
		server:				'fr',
		donate_title:		'If you find AlloCine Zap useful, you can make a free donation.'
	};
}
switch ( location.hostname )
{
	case 'www.sensacine.com':
		AZ_LNG.monallocine = 'Mi SensaCine';
		AZ_LNG.footer = 'Pie de p&aacute;gina';
		AZ_LNG.server = 'es';
		break;
	case 'www.sensacine.com.mx':
		AZ_LNG.monallocine = 'Mi SensaCine';
		AZ_LNG.footer = 'Pie de p&aacute;gina';
		AZ_LNG.server = 'es';
		break;
	case 'www.filmstarts.de':
		AZ_LNG.monallocine = 'Mein FilmStarts';
		AZ_LNG.footer = 'Fußzeile';
		AZ_LNG.server = 'de';
		break;
	case 'www.beyazperde.com':
		AZ_LNG.monallocine = 'Beyazperdem';
		AZ_LNG.footer = 'Altbilgi';
		AZ_LNG.server = 'tr';
		break;
	case 'www.adorocinema.com':
		AZ_LNG.monallocine = 'Meu AdoroCinema';
		AZ_LNG.footer = 'Rodap&eacute;';
		AZ_LNG.server = 'br';
		break;
}

//****************************************************************
//		A j o u t   d u   M e n u
//****************************************************************
if(typeof GM_registerMenuCommand !== "undefined" && !window.location.href.match(/iblogvision/))
{
	GM_registerMenuCommand( 'AlloCine Zap: '+AZ_LNG.options , AZ_options_only);
	GM_registerMenuCommand( 'AlloCine Zap: '+AZ_LNG.check_updates , ForceCheck_AZ_version);
	GM_registerMenuCommand( 'AlloCine Zap: '+AZ_LNG.position_reset , AZ_reset_pos);
}

//****************************************************************
//		V a r i a b l e s
//****************************************************************
var AZ_Url_Page = window.location.href;
var AZ_TLBR		= '2px';
if (GM_getValue('AZ_canhidenav'))		try {GM_deleteValue('AZ_canhidenav');} catch(Err){};
if (GM_getValue('AZ_position'))			try {GM_deleteValue('AZ_position');} catch(Err){};
if (GM_getValue('AZ_header'))			try {GM_deleteValue('AZ_header');} catch(Err){};
if (GM_getValue('AZ_posOri'))			try {GM_deleteValue('AZ_posOri');} catch(Err){};
if (!GM_getValue('AZ_width'))			GM_setValue('AZ_width', 480);
if (!GM_getValue('AZ_height'))			GM_setValue('AZ_height', 300);
if (!GM_getValue('AZ_Top'))				GM_setValue('AZ_Top', AZ_TLBR);
if (!GM_getValue('AZ_Left'))			GM_setValue('AZ_Left', AZ_TLBR);
if (!GM_getValue('AZ_header'))			GM_setValue('AZ_header', 'default');
if (!GM_getValue('AZ_relVid'))			GM_setValue('AZ_relVid', 'block');
if (!GM_getValue('AZ_choix_lecteur'))	GM_setValue('AZ_choix_lecteur', 'html5');
if (!GM_getValue('AZ_quality'))			GM_setValue('AZ_quality', 'HD');
if (!GM_getValue('AZ_border'))			GM_setValue('AZ_border', '8px');
if (!GM_getValue('AZ_posOri'))			GM_setValue('AZ_posOri', false);
if (!GM_getValue('AZ_autoplay'))		GM_setValue('AZ_autoplay', false);
if (typeof GM_getValue('AZ_zap') === "undefined")
										GM_setValue('AZ_zap', true);
if (!GM_getValue('AZ_Color'))			GM_setValue('AZ_Color', '#000000');
if (!GM_getValue('AZ_BgColor'))			GM_setValue('AZ_BgColor', '#FFD515');
if (!GM_getValue('AZ_IconsColor'))		GM_setValue('AZ_IconsColor', '#028CD7');

var AZ_TypePlayer = ['','_DivX','_HTML5','_Iframe'];
var AZ_Quality = GM_getValue('AZ_quality');
var AZ_UrlVideoCplt = 'autoPlay='+GM_getValue('AZ_autoplay')+'&autoplay='+GM_getValue('AZ_autoplay')+'&';
AZ_UrlVideoCplt += 'timeToShowAdPanel=15&expandable=false&canHideNav=true&adVast=false&smartIdPrerollSet=&';
AZ_UrlVideoCplt += 'urlDirectVast=&urlDirectVastPr=&urlDirectVastDfp=&';
AZ_UrlVideoCplt += 'urlPostrollDfp1=&urlPostrollDfp2=&';
AZ_UrlVideoCplt += 'host=http://'+window.location.host+'&';
AZ_UrlVideoCplt += 'pre-roll=false&preroll=false&preRoll=false&';
AZ_UrlVideoCplt += 'post-roll=false&postroll=false&postRoll=false&';
AZ_UrlVideoCplt += 'v7=true&blog='+(GM_getValue('AZ_choix_lecteur')=='true'?'true':'false')+'&';

//****************************************************************
//		I m a g e s - B a s e 64
//****************************************************************
var IMG_B64_Empty      = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
var IMG_B64_Paypal     = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB9UlEQVQ4ja3TT2sTQRgG8IAnL54EP4GfQbyIZlZDxYh/D+JFqYIehBIPoUFqlC6xUkIVu7Ohim2pWIsgLTaol2I1iuBBFHpQ9NJ0550karKZJrtsMo8HS1lK0iL4wtxm3nl/zDORyP+sKKcss8kNL4MLaXCajY5SfNPD+4ednfFxWR8k4JoDDBKQISBd1Oj77AfxyZKKWuJ81wYHbHH43NyvhknAvQrw1AWeuUDuJ3DdAQa+Bm2D09uuDZjlpK68Uf4NAfQVlG/Ywmc26RPTFZ0WwEgZMHKkmS3mOnIMTrP9X/wguQKceV5tMpv0kckyLrxWyBCQc1o4OlXuzmGcijeLWqdW/vpvSWBIAnfKwFQV6F90cfX9amfOPnt598lHZWUSkC0BMzVgXgF5BTyhFgYKdX0wR/rU44oKcdzI6Zlta7c7Zy++rDVNAswlP2CcgtiYROy+ROyB1AYXXs9DqXoXlJchwHZabYOLpdD4YjjxoeGbBCTfKd/gVNuMk1xwPWY5iXCDxdvfgxavAJfy1WZ8otTsxJmWrXa6UPcOhcffm13e3jMm3Rd1jVerwLFx6fXmq946J5xMTp+Y5ST23P22Y8MLiCHGRWUtuh/DHGY5qa7h6RioEOfy/O/Gln8gXBs5xydknY382PWvE6xzopyyW+3/A/j/2Su76YY0AAAAAElFTkSuQmCC';
var IMG_B64_Paypal     = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAPCAYAAACvMDy4AAAACXBIWXMAAC4jAAAuIwF4pT92AAAIR0lEQVR42tVWaXBT1xU+T5Kt2OOkdiEQCoyhtjFG4A1sDIQtQFnDlrIas4TFxtjGeMOL3r7cJ9uyDUb1JlnApB1KmiHNpMAwNENCmHTapgwMhJSAsYGyNG2HFkrAi17PlWQMbTPT/mt/fHPf0z336X73fOe7BzheAEnkodwuQF6ZYsrbqzA4Mjia8kpVYFkF6h28P4bHWEHgEcL/PHCznMXOiRA9l7REpJPLERn6RcRlPybrF4a+7jg5/YfaVjsSF4V+cv8HxFSZhfxi+SUmWb8PE1QDJmgGJJIB0PcxxEhZphWpssBwHG/ig4v7M4hZN3GcYAmAt7B05AVG8B/Ef55h/3cxno6cIJoRln6wiOfn/906TsD9BWOhRmMhM1eJQxLfMMlaL1AkKX39YJKUJ8wEtfc7U7Rzop0NSnEgc3RUZB509UVo8osx/y05wlWCHoT/mS0HmWMHyD//zSBZmWcxvsK/Bup0DuZnqYvAphlMCukGG++D0TsNGJ1L4YPv7+pjRmzvC51d3bnF2RatspXQnw3MDqNIPGTulGypy0jFpLe0vZNWkoopK7XcjblSPJ3jgpsI4Pnngd/6CQ3E8DC7/tja1MaPKibuO1U+sfF02Zx9P19TojqsEmenmQnEB4EZYhT8fbPePCq18UxFWv2JAnDqPExcrpfAOM3HpOpPIaHCYKK3+2BUjsEgIGaXwQze0APb3zMGvXP1FzzL4QlxDN0Ey/IWVeIgbr5aB3Eo23G6AfEOA8aifG3639dlK+Nx3kyNR8UMiiLPyEhWkgJmRDPdn30Eg/NAxCrYo9aGQHvnn8Fz24CDdw1ov4O4a7zaev5YlSCZJY5lVMyKjGREHveD7zSjaftO5YP3a8Pa9vvPQVUEGDWPeMCG9ZXieArxpQaMyjb8WYvO9sHgDT5IKe+Fpqt9Ye6rX5RKOvhPLXCyZqwr+N4s8q4pQeueuUpfm7NbHhKRrl6AscSYvkbbXEt4yC2WI3NL5KgqNKDCYim0ZK9o2VshhuzGZ5YN1CklXLRXZkoL2fAsrWU04+7sxg127qg+MGhOw7GVjLurh3F3PChRHCZOFCGHuAYVKbWWColAvtIQTrMc7zrbYHJ3dY9t/DQHSitkiJpGzvpNIon0QPQuHzNiqw9G7vBBbJ4PflDrg/oL3Yz3dt/Qpt++768xnmcoMeqSxeWCOTydXAIb6VuVLY3ZuUcabE0l16i052Vq02yLSB2M1x/TbEZO0c5YEklX7DxSnbZC22AZq9/MWKFupeWQlSvHhKU6LkWmSKdel48uAO8fjKiWi6eqZBVmOD/YCB58b75wZpnzx0lRbV/8CryYSU/n15Gtl05bPDdvLXT+NH1E06/fA0+XsbDuZ0loHNoQaxrphETMWLLWB4XH+0A460P0miihw7d6mPYbfinMr393gW4vR00LJpZDKaEMtxXIwyBJfwhJdD155JcjuuiwWTUtw9+odkKcZoyYTY7MXa++HTGZXIExmpG8VBPQsEbQrEZO1T4rKhMgaqp+hsp46Tpu2gzXiU3QdsvHuK8/Ae/Nb+h/Q3vXk/GNH280t13vBM/NvsmNxwuTG05WQVuHAe4bxhLnkcSIlstfmtu+up+tHQiBjFX6m2gafwObbMD0/T7wdvng8C0DDqO+D+EH3fjs7vxrWsOJEkngqPwYf8Gi7WsyByu2KpNhHDFCJpG70bP0g3FzVde89dr6bflqhCWFPAxNIR0oO/DsZyF9hb4FYonvjXXaWklkwTpRvWRK0h4Nma66IIEYcQuJwyHZIdZ1rgk8t3xRzRc/iXF95rG5zuqb9abEWQ3vrwLvH42kAx+VtFTmgYj1/lLr1SshbVf/tLz2nRhwd/R8t/Xix3ZJARg2s7oOTeMxkyB2w5L2Xmi/0QvN13zhLVeuzNA/zFpcd3Rxttb4GnVDIUiK2qud5c2awsHMNVomzcKoOcSjSIEuxkk4yC8RX0YJPjEnaw8WZUnzlm+RF4Sna1/RQ1i5Vc6oR/lNfFMrQtPy35WvZOiflGHd8ZLIDG4+fxo8d4yltT9Jq2XL/DXdUFUMGftP7ID2+8bwpt8c20RaJyXt+yVHD35I8+enFzuPpFK5xv7oXJMDjQTw/noI49HRRvMGZB41mMNdT6G1qy/e9Wm1014KBINUroraqun5C9KOFzF1uviFRIEY3UhdphYqMmeuYnkrZjNEwvqzLUGGCQFpwgTHHcRjJPtoW4HwKiW2erscj7XYwySSv2TtUkY7ZDsUSLVWNImb4L3Ts0VvHqmwVWZ0Qgs6oWmnXDcozP3leWi/Z4D3nsF4OjroOMZ1rmZm/YfL4dADI6Px5PY6PARIWVJTNmFhHZc4R68Ks5+5hFJE6d02MvYfz0FLtVQKkpXe6P98KfJB88jZIw3NylUTisulMPGZdQfmRIzLzFZsyzcL0wpKpLC3C9Thm/KUGJ7joNIuWF6boX1Asz1zrfoWvdTx+jDbRdm0UW8bs8nRGsuKkv8gg10FKHjARVp16IqaI1M31LjHF6k15qxqb8Jupe7lQrn2lQ3VBxNKZIeVXgNA0O41lJCmSjDS87vmUM+1Lqv3xvXVNYdSNLaCGgXzrV0C7TrQpjXlX5vkIEGGztFN0zgVa5LaOsHfZq0mS0wJ1ffi5mv1on8ttmp8QBEa3lEUL7ZPAXK0+6B3FmEr/c80jnYcFHS/Et5rdA2VlJWCZTlrfk1DyI79zaE5ThcjclygK/iWXi/QMfj7RDQSgeknNdBNBDoInDPZA72jP46CEiksVsN37Kw3s3aJkjVx/ev9nYTE0G7ieem/UAYoTYwx9cdyzzoQ6dmafwDKti9KMW15kwAAAABJRU5ErkJggg';
var IMG_B64_ArrowRed   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAOCAYAAAAWo42rAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzQ1M0MwQjkwMDE5MTFFM0I0MDhEMjc1NjI5QzBDNDUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzQ1M0MwQkEwMDE5MTFFM0I0MDhEMjc1NjI5QzBDNDUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NDUzQzBCNzAwMTkxMUUzQjQwOEQyNzU2MjlDMEM0NSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NDUzQzBCODAwMTkxMUUzQjQwOEQyNzU2MjlDMEM0NSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ppmv1b0AAAFOSURBVHjaYmZAA34yMnW8P35oPfv79wwDLqAhJmayNyLiRw8Ly1t+BgZlZDkmGIOLhYW3JSRkkQg3N7vGv39CGQwMC4HCrBgKywMDJ5mqqWn++vWLgRnI92FgsA5jYGhGUehjYhKb6O2d8O37d7AiViguBurXZ2DwBCs0UFGx6i4pmcPMysrw/98/BkagIDPUFHEg7mBgWAqk1ZidFBWL3z17xvLqyZOfChISQn9evWL4efkyA8v//wz7GRge3QTinwwMAnBfeejoJDzo6/t/Pjb2/wEmpv/HGRj+WzAwVEKlWVhgCtnY2Bj/A035D2T/gYoB3ckIZf5hQQoqxn9A4i8Q/4Iq/ockCVf4HyoBUvATSQyrwv9IJv6FYgyFTEDAyMYGdAwLwxcg/zfEBiYMhc9evXq778CBl2+fPGF4CvQU0BeMXxkYPsPkAQIMAADUbD0YXJOVAAAAAElFTkSuQmCC';
var IMG_B64_ArrowGreen = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAOCAYAAAAWo42rAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjM4NTg4NEQwMDE4MTFFM0E0NEZDMTYxQ0VEN0ExQzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjM4NTg4NEUwMDE4MTFFM0E0NEZDMTYxQ0VEN0ExQzciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMzg1ODg0QjAwMTgxMUUzQTQ0RkMxNjFDRUQ3QTFDNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMzg1ODg0QzAwMTgxMUUzQTQ0RkMxNjFDRUQ3QTFDNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pm8VNtsAAAFVSURBVHjaZJA/SAJhGMZ/n15lQi0ZaRAW/UUDOwhcggKDiBoaC5qaWqLJsaaipUlot6EgZ4mgEGmoWSGoKSRsyKK4CuLuPLs7z/Lw+fh44Xt+PO/7vYKGethgkj0ENXlQZqBvgMJFIVkqlE4tW/oDO+hihBDtEJ2OEh+L83b/FjRB3KDAwG9WH+iSjmqoGIZRbdieJtCGrES8Lqcl0WrvBsU/6E5sd67khtyghk6bA5mvwiPQNE3/bz3MLqPM0k2/neZIN5nITGQrEAqsvJRf7jxUOGOKGEtM2J+p1UFVVUksJsY3tzfndUW/8qDwwAlrvDqItRDDGtE8QpDaTyWLt8VsfcYnLslwwLc9qw37O/3ks/nzXCZ3iLOIuspc08kcvYTloEy1Un1O76SXtR/tixb5GBLrorJ6vFoLx8ILzZbXBep8SJ/Su1JWHks3paNm61eAAQC2s2igggWONgAAAABJRU5ErkJggg';

//var IMG_B64_Download   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjE0QkI4ODYwMDI5MTFFM0I3MEJBNDdEMzhFNjUyREIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjE0QkI4ODcwMDI5MTFFM0I3MEJBNDdEMzhFNjUyREIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMTRCQjg4NDAwMjkxMUUzQjcwQkE0N0QzOEU2NTJEQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMTRCQjg4NTAwMjkxMUUzQjcwQkE0N0QzOEU2NTJEQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg5hdLkAAAH1SURBVHjaYmRAA4rMLGIbXTyOCKqqqv4D8lk+fPyWs2FtwPovH3cz4ANRrBy2/zZt/Q8HDx79TxYSrUBXxwRjMAKxCgMDr+7vX1L/GRnhCv4DmSo/fvHpMzAIsGOzqUFcOultTuHTj5l5n35evAy38O/bt/8/FVd8A+IXi7QN5mBorOAXTvt/6Oh/nODN2/+rdQxXY2jkBOKd/KIr/m7fgaHn342b/x/rGN3UZWCQhKlnBhGaDIz8q4wslhrEx7owvn/LycDCyMAsIwtW8PfuLYafG9YzsGtocbrzCDjduX373F2Gf88ZQB5eqaA25f/tu3Abfmzd8P/X6aP//9y+9v/7oln//33+BJH4+ev/Hb+Qa8rAQGQo5OYL/7Z0xR905/06d+L/z33bQA5FlXj46P88ZY1uxlO6JqeUszNMmdnYgO7+z8D8Hxg1bMwMjNxAXzMyMfz//oOB4ccvhr///zP8BUbaPw52hueLlz1iEbex0ud2d2Fg+vePgfE/JD7BBBM0LoFiDEA5FpAhQDEQV/DxE2kWFgV5NiZODoYPazYwMDMxgUOLCWg6LAmA9f39w8CspMjAoqzE8PfzFwZWBXlmFsZfvxhYxcUZRLPTGYgFP+7cYWB5dvjIFda5C3T+MzMzICc/ZPAfiQ2Se73/4FOAAAMAxcgigkpAMhQAAAAASUVORK5CYII';
//var IMG_B64_Link       = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsUlEQVR42k2STUsCYRSFrxWFBEFEPyAzHc2PccbyY4q+NCpq2biqVRq5EkeFCdRRzMiCVkUQtGhdqyBo26KonxD9jKJVvN0TjbR4meGdc+8957lDlmURTr1e52NRrVajdvuQ9vbyQ+GQ/BgKhoUclu9zud2BVqvV1xXbz2azSYZhDCbiyVuf5P9UIuoLP0UikbwuFAr017n+27larfaapkmaNnM17nILfTOzVC5XhtOpdMPrkURUmTroFrC4r3PcoVw2NzHh9rynltIb21vbLrbRXylXeiKy8hIIBAWEPbBhmvuU3cn69U1dW11ZS2rJ2QvX2LjQ9YyLz6Lk9X2pytQpB2xTySg6Z7TZSx77lk4tx+fnFo48bq/guzN+X2d7H7Hp2E2xWCTK5/MjHPAGl/jIonOIUYRiNEGzklEaYCcOYnTPkuT/QEAePQYbsANbsAebsAvbAEPgzIGeEAwBERSBERwAAAJAbDgkhyIPPq9f8HgLCDMcEEiBFoiBGp27BbzBUSwFnHnSK9P4jk3H73h5zkaj4bCF9nKJbfRig6qiNgOTQaEq0RPQgPh/Z/sX+gFi2cadq3Y6IAAAAABJRU5ErkJggg';
//var IMG_B64_Options    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ODc4NThBNDIwMDIwMTFFMzkzQzk4NUI2QUQxRjc2QzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODc4NThBNDMwMDIwMTFFMzkzQzk4NUI2QUQxRjc2QzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4Nzg1OEE0MDAwMjAxMUUzOTNDOTg1QjZBRDFGNzZDMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4Nzg1OEE0MTAwMjAxMUUzOTNDOTg1QjZBRDFGNzZDMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtpXmyYAAALNSURBVHjaPFJdSFpRHP9f79XMplNnKmLRwwxXD8M+t5hCjIlEUNSgIYwV1MAe9jhosJ62yRhEuKgNRrAeDPKlEuyhRmYFSrRoGbRw1ZaWNnPa9WOZcve/jbxw4XDO//w+D8EwDFx9Kysr4Ha7rwUCgSyXy33D5/MF0Wj0RXV1dbahoSFtNBoLs5yrxeTkJG9qaup1RUWFd2dnx9zd3f2sr6/PcnBw8FAqlXrm5+fHRkZGRIWbLKPL5eJoNBrJ8PBw4Pj4mFlbW8vg5fzu7i7j8/lSoVCImZiY+KNWq8sdDgfJ3qGcTiexsLDwanBw8H4mk0kSBAEcDoe/v79/CSqTyQQkSQJKP7FarfaNjY3vOPeURA+K9vb20a6urltarVa5ubkJeAgzMzPfkDmIIKp8Pg/Nzc03amtryxFEa7PZHCTSM4uLi4DGDblcjtze3obx8fF36OIJhvMJw0pgOA+QmUAF+f7+flsymXRx6uvr305PTz9XKBTceDwO4XA4UVJSYpubm0uin7+VlZVjKPsnTScB90m73d7b1tb2nkqlUioMRBqLxS7DQgBSIpEU0haJRIRSqeShddjb24Pz83MxMqrJSCTiX15ejul0ujtisYRSKOQ8BJFhaD6Px8Pn8XgvW1pajCRFwUkkkh8YGBhdWlqyEiaTSdLU1PSlsbFRxysqAqFQCMgIwcPDOHrOYa+yxBkNSfqMZWOD+4U29FRZWVlmdXU1iKpuYnp0XV2dCqWASCgSA8oLHR0BTdPwdX39N+JQfr8/XFpamiBOT0+hs7NT7fV61RaL5UNNTc1tdhATZfuEdDrN+oStra3DoaGhx1VVVcHZ2dkfbMSQzWahp6enKBgMOvV6/T08+Gw2m3uLi4sprOYjVvUIawpcXFyYsN+oQCD4/+TYH98ktLa2XpfL5Qb0qcK1u6OjYx39arDDuwaDQY6shfl/AgwA4btnlYYgYoIAAAAASUVORK5CYII';
//var IMG_B64_Synopsis   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjlBRUY2QjYwMDQyMTFFMzlCRTJFRTA5RjExMUIyNjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjlBRUY2QjcwMDQyMTFFMzlCRTJFRTA5RjExMUIyNjkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCOUFFRjZCNDAwNDIxMUUzOUJFMkVFMDlGMTExQjI2OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCOUFFRjZCNTAwNDIxMUUzOUJFMkVFMDlGMTExQjI2OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsZTlrwAAAOASURBVHjatFNdTJtVGH6+73z9WkpbytquVMCtCBvFdurWLMEhyjYzYHHSyDSaRc3QC73wWhOTXSzhmkRvTDRbQnQXupnMiy0m+2FmP7CyjX9ESgulQCkdtOvf9+/5ZkSzTKMXe8/FeXPynPM85znPYTRNw5MsFk+4uN7e3v8MZujICUUwRoKWBn95i7GmlRFReaks+d3twTDKTKZNrCiKCAQC/19Rg6fa/Ln34MeXze9M3MG72pSlR/u0bn/P47ChUAhcuP/cztWr43sVRVUtrsrSVz+dXRmNTyZt3qrEyFykWCwUNze8tqfZ3ce1n5MGF1/Ugi5wu10oXFvA8eXGLwzP8uLJ6Yv9UB6x6PT5H9KfsHtexve/9khqAidIE1jncxmjyREb8EzdSjxvPfXlvZ8HX2rwbzm58sKPD4bnms1vB2DwV0LNCGAdBuRms2XHF3d+zflY7sT0hVOQ/woOGZocK4x7pPOhI+2MEF54paQokPKSKb90v8qbsQSb5vn3Puzuru6wN4Y2Lkx0mI/5YfS7IE6sQbybAl/nAmMhyP62SprF6k6H17F0ZWP2LlTA5/OB6CyxuRjGKgpXu490amo43iarGliWQKIoSZJJaWg+mAvHA8RlQ/khL+SFB5DjWfBNW8BwLAy1dpCtRmQnU2RvyX3YXedaubw6M9z4J4Fe0UgUI9bcwNHXDytcOLlflKmZDKNHR78obQnUvAA1S1PEE5iC1bQXwG21QqOCxOk1KIkCSiWRDQpVnTa3eSP9tHmQ/P1BYpRk1JK7tqslsFw5kz+giIphk0SfNBZKOg+Dz0YVW8A77ZCiaWS/HadzhkLZh0CxVGKbJferrW8djJJHo6WT9I9cGbbWOyL72Np2IVfkH5L88REAmYEUyYD32CFvZJHtH4MmaGCopaA34QkLpqFi9OxTS59NOeWL5LFhpyG4vhaZMAVcQ63c9s7Cesasr2maDBO1SpIFCJEUxJE1MAo9kKXKVRVmm0nIv7G99/35Mx+cmboxVOFxF8i/farrizNRod5yY1/Vjh2Ki5817/bevqklbtXsemaOtRrjoliQUJTtUCVicluTfc7Rox/dPP1NMr0u6vv1FDFdXV3/SKBSVRp9UF/tNp7KVwwV5UpsZRk1DicgyGwutV7e0/HmtvpV9cAvqZl7feOXBnhqoYHjUCwW0dbWht8FGAC4c4FhrHzEjQAAAABJRU5ErkJggg';

if (GM_getValue('AZ_IconsColor')=='#FFB512')
{
	// Yellow
	var IMG_B64_Download   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAOCAYAAADNGCeJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAr5JREFUeNp9UktME1EUfVN+xrBwhQuJ0RDQhBVxZdQEWLgyKJpoXGiMLlyUqoAGOu3Mmw4ttCUIWioxohGDn0QkaGVSsEBXSgISQEpLi0WMH1i48AMU+rm+2woiHxc3Z+5559w57+USSZLI2jJIEqflRXL/tinTP9jU4X1td/gHmjps9cYdvE5EDbeRbw1BCaUSqZLFFC0vJLe10IPwRYpFgnQJPtHY3VviAV4nJMsGMQV1qN902LKgUm8imvJaYqvjc2OBoxDxnFhEtNfzucjrhKqVH/8vmUovyMRx72SB0npMO+ootMO7LIgO7Q3DaBaMOAobldYi7QP7hXxeb2TPIao2GYaRRZWWpWq/c6oAhgnAWw6ib7ZEoD81gayHEQKPms7kV+qq2TBBtfqq/7wVoigKRF1mJS03zmXPu9K+xtypEO5NDyFij7ym3BzXrfatS6YXKGc1V3EjbmPl57Fm++Sr8+pfz7dNQ3c6IGKP/DA7Rx3q1yWjlBGUchU6I/E6D9dAMA/Auw/Cnv2+4Iu8ktnHuzsYqrFHHs9Rh3r0xf2JYTR+9wp9DXl2s+hQzEVgvpNEQwqJhp0EFpxJs4GHu+wMZ5ZYj/wCO0cd6tG3/HaEJq7IaXUSGXp6tniyR22ZcGqqA90aKyvzZHfJ9Q89F5sZ1mPPyjKuXJYDLrUF9ehD/0oyQZCI2aQnc75r7lCQTn33GcZ/Thh8iZK9PybkMfbtZd++Ob/kj03xM4tT4jTT91mYD/3xZGxX2BLKpK7mKokOZnhne3Y+CbzcYwoq2dagkmP5W9mW95055o9dWQ2h/u3j39yZ7dGBDA/60M/WKpFML8qk1lROIl1bx6BPBdCXBOBO3qAY38fQlQbQmwRM70Ef+v+8Ge4K5US2L20Np490NRaVddqOX1JsxVc2qVKlsbgUdahHH/px2G+8oB+wMaghgQAAAABJRU5ErkJggg';
	var IMG_B64_Link       = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAOCAYAAAArMezNAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAy9JREFUeNqFlFlME1EUhs+MiBIXeFCJENxQogaNS+KDSgwSDY1LYqIP6oPRBKMRhaLYzrQzd6bUIiDSuqBCMMgSFRGJsijKIkiAAGKUKoFWROUBMC60iATa4wxaw6L4cHIyM/f/5j93/rkgCAL8vwgQIkCMjtAqhgeNRoQLxlhfqfwNZ2JAeYoHUSS0vMalmRBICBnuoihQOkmoZgmYEsUZ7Y3xabY208feVuOnnpbE8rzMmHUMK68llEszoUMZyHEEVIwGVKwIpgSt5zezsgI/KhE/hCO+D+/HjkipR/ZkXmX8GM2wlvoH2AUllOziXJyOyss2BV4xqmb3Nu2qROs2HDRv785LjwzOuBq98EvDniqnVYHNjw5EqhidpOPd/gL+A5X2UoDkJOLdZ00o62zQaG11qyrQHID2+kDL9Yvhy6PVMXBSbYCO0qArjhb/IXPRFl7N6iXGOLALytPym5OTmDk/LEdedzVGlLQXzb+ETTR+fepV9a58tzI/g1EoT8dBWdaWg856jz58AVh5M0ShYmMlPUePAP+GCjylYs5AiinK9/tLRRNaN6PlyQ72y2OvdwOV7v3NBVv3OK2h9jeP92UXpoTuxFpArAHsKFhwWSdqgOcFSmaNccxTrFZPpRqPeg88X2LG5nn4vX6pJTs5bLWjdBp23ffLs5ZsjHe2+GBr8fprnwu987EK8O29gIuSIdByOgnKgytyIxyTSXJUukt9UrARsK96xpuU84cXqzV6qEsPOtRRsEg/WDPVjg00vry75sRg4cw+S86yy7JGy+so8Q90lGMeOE6Es/rTYC/1qnfWgKM4TRF8PNoILKeHshshYY5nbg6sprDzwfzzn3P8brRmrUzkeBGkGgcd5VjeH4NODfbiWZVD5e5D5lur9Mnxx3zqMjZosGIyYrkbvrq9WrhgiPDMTdq7QnIJHBHhb9BRYIHwNKPVQ2160H4skUDF0xEfedjwoYfUp+Cr7LVEK00lT6DiDLKGdn30sdBxceOJMPxL1qRuOmrLndvWe8fXZsv1aa1N3XRMHlt6TsvJkWsi6Li4/VpE6Cg2wRW/4YNFvpbuT/ofbGT9BPWSPcfY1FrjAAAAAElFTkSuQmCC';
	var IMG_B64_Options    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAOCAYAAADABlfOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAoxJREFUeNqNk21IU1EYx8/dRtOWfigCS6KgvpRTxJIi6HsQ9CGiIqSgaBBERWxs5273nHv3ouaSldpNkSg1aCNCHIZmmUS1QqVZUlCLhF6USqOCsLa7+3TuXTXEt314OHB5zu/8n+f/v0gURTR/UUSpiCSJIhemyIkl1CrXFfV3N21tOu8rFgid8x5aGJoBewSRC9ZSc+KxLzg9VjfB6lXrRf96j4dw7EGj9rDWl6lFoJRqSilH2PkhdlSGd1WgJg59bm92lbuwgET2nfcE/vayyk0p4Xi3DzWHTq2B0ZJpJV6aSsatz8/V2E2nnfW6sv7rew4GfB4TIWIuSrUGYsDuahSW921Wh4yQilmSMGSCL/2rY20XDm942VXSkhzMnwxW2zmBSAtB6f9xJIkYnNiL5PozeeqA+asysBRS9yy/4L4Z4IHxBzxC8DG6NuoWvLqAecbPAr0M6HCJqL1FXPH9TajhffcOnIqap+G2BdI9hQC9FoC+vKkbjfvLXWyvkigY5lA6A8jZXX7UdsmxPJk4EoOxYzA5YusZ797ueNuxqXMqsi6W6Ci7Eg5VWbHHzwwjuqlzRkofmb3owLXommxbqYxuGVJHKyEVr1QgUfq7L2KrcOAAqvFihIWAXhIzk86X0wyQIMxGCcsHVqWH85+lBy2gPClQ4anp052OXRVO3qftzkioxLFegw7UMkqzGZ0BZQp1oBw8XqQ+NL1QmBmpgXyVmTHRc3lnmZ2pZxDjv5BnA7/gH0VMPNvP64g1BHeXQLq3ANg5fqtlt9WOz+ruLgabDaXEyAt+NHJ12wmlq/Dnt5vFw52Nezc6+KzCXICz3CfsklvwoYbqk8sE4kV2vo4lQTBk9pYbUKs/I1ICa+c5HFgAAAAASUVORK5CYII=';
	var IMG_B64_Synopsis   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAz5JREFUeNpdk9lPE1EUxg9UUfTBIHHhbyAmvmjig8agRIFo3CourRG3aISIimVmytxZSotQ60ahTEGKqHWjFBFFXCgiiwsGgoIKhqgxwbgkSgxb1Os9bV0fftOTM9/35Zs7U5BlGRgRvECgwp0/d/C5drP/QbH7RZuz9llr0cW3T12kvsqeeO2SfdGnl1rTh17X44+9JUjH4DOt9bQ7Px69mIFZOAAhUoQkSfChu+By9z2H+UuPUEZfcfTH6+zvA/fVkjcdjrJ3XUeqmmrtW+7W2VOa6+yr7tTYk562OAredxd40YsZ4UAJRFECRZHgW3/W/eLjZF579caD9MUiSvsWUn/51h2VmrSkulIw7s0kkM2LQTL2E/AUCcnjfYda0IsZmMUuBIiIdSUY69ncXOokCfWeZVk/uqK/I9c9yelnNPNy/+nMNE5QdRZVilIZglnVnS/NSh15YryD3lAGCTXEuopCYKwr4V5poWnxjbLE/bQdKFJbkrz7rHZgud+za6uJs4AiSzqE4y3g1dL1o52JAfSGHlkKB0oyCxRhvCO+RTu5b2HAvTT3c92sh1/qZnQ2uJKESteexJpTxjQTbwVFIjqEE3LB69qpH3k0J4BezPgTSJQIhdUdbY9tKi/cnnLBYVhwwpYZ48zLmHnOvmW+t8SwurpUbzQJh1lDUYdwZhucKzbqR9tmBNCLGf81JDDSPLXRW7RxfRZfwAQyiIwDnB2qtTVGn7Z2s4nPZ4GsoYwN88Dr3KRnntAj/9NQwoYiDDdOa/QWblov5FgnWOScKMYk1mSCz7XO4HOtNWSbbZGqnDMR4c3WSKZNRQ96MeOfQFkiMNwwPeA5lpa8jzsKfE5ukIzsY3DRuSEVwfnXHjWoRQ96/wuU8Wxg6OrshqaypXkVjm0p3uOGFYyVHse2hFvupHQEZ9zhPdSgFj2hhvKf71BkB2pRzDDkj7tN6ydTej2a0vopYaLp+NXpowjOv/dBzWSKHvSKwZcS/g7ZXydCJCo8qZjPjftjO79WxXUM++I6GY8ZA7QmhiI4h3dBDWqZh0cvZoQbyr/OEXjRCjaVB6tqBpsigJWBv1dO6OORv3dBDdOiB72YgVk/AcarHTvVj1ssAAAAAElFTkSuQmCC';
	var IMG_B64_Related    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArhJREFUeNp9k11IU2EYx5+zLT+Iuci8CpGwwoKywIuE8iboKrrooggLJAIpIsFa287OOe95zzYnQ00so4RIk2yV1so+XWQ6LPzENEsnkkgoGER1M93OztM55sdczYsHDud939//+b/P/wVRFCFREUJivkWQKAE7x0NJKaf+W1yL2aMVrA1cAUtU0LN2Ap7yMkPL3cpdHE+BUqJbESZrAcnyJoEQndNB4bLNCU6HXT/VdaoRZ49jy+3zuRdKRaCioIsVTwBbsMeYLQLU1bpMP0Y97Xeum3Onnmc14jDg2NMdtR43NXgbruQIhC6Ik0SW/yoRYO0iU1NFkn4FK5rwGzeDY4e/YEf6WH99novjRRh8fcaB30+g33v2oIWV1DMCk7BD1SbjlHiY7S++h5OnUR4t/h39fGRE6c8MNl0r3Dn0KM+FnwCn/Vm+ao85nRcoszScf2CaksXmgJZbxfkYzEP5Y35YGdqHyvCBkDKQPYofdBP4Vh8c9+bccFEr2OxO7Uxiy5TwegvrZnqaC6zKYEpU7t4QVnpNitKThkrfxvlIl3Ek6k+ZeHz12CGzvVy9a06/dE1xwOXJMja7BJO+TC++Z1DuTA4rgSSMBpKicmeSLAdS5rFj3UzIl/GuwnnJyAnSSibjgVSFWW0CNNSR3fJAQWfkVerPSFtaNNxmCkf8JkX2GxHbdTjly3ZXui4aRCIwsRlcBdTa1jJlVvMWDNhKlGDBzNyb9A6lNS2EL9YjPjPKoSebJrrr95+TRB6snGsRlPClCIyVdcHDm4V7cWQ7Yl/GLLbD+PT9rVWtNUdPNlYW7VEtprK8E3hCGaoNgqx+JfFAYFXV+uqizXMvk3u/Nm970FBVtMUtWQ1mrhxsvEsFSZoL/VL447v7n2Ww2N3gJFqwy+Ai61EzKYKD8ga6EFwCa8G0+gPcuPsNH8ZgiAAAAABJRU5ErkJggg';
}
else if (GM_getValue('AZ_IconsColor')=='#CE1C2A')
{
	// Red
	var IMG_B64_Download   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAOCAYAAADNGCeJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArFJREFUeNpjaGhoYEDHjfX1jJUNjQxza0tlrtWkbjhfm775Sk3ahol1ldLV9UA1QHls+lAF6usZ6oF0U20ta1V9A8uKsjyb72l+/95lBP76mu7/b1ZlsXV1XQNLU10daz1UPU7DYAqqWloY8ru6GCZWlGp/9rT9/9bH8SeIngzkg8RrmprgFuNzGVNtUyPD6phYx43hEZXHPb2mftTT/f/ayPA3iD7m5TVlc1h45dz0DIeq5maGxro6JuyGgZwMlKxqaWZYHhvv+FVI6v8Hcbn/L2RV/7ySUQHTIP43oPiCpBSHSqDrwYYheRUlrEB0XV0dQ15nN8Os1HTVezKqzx9LK/9/IK/+A0SD+CDxgo5OsDpkfXDDYAI1DY2MHfW1jKeKkiru1aZMPRMVlH1ZUfPhPaBBIBrEB4mD5EHqQOqRww7hMlByADr9tLdX+29jvf+fzQz/v7Mxv3HKxj7nmI7RBiCdDeKDxEHyIHUg9SB9CJdBw6qyrZVhQXi07SN+6f83xRT/3gLiu8Ly/29Lqbw8aGA5FUi/APFviSr+vQnEIHUg9SB9DdCwg7mMsaqxkWF3VGjg2bjgzhNJ4W0nE8O7gLjjVEJY37nYoDlAuh/EB+LOo8mRTSB1IPUgfbBEDA2rBob26mqGl8kBB95lBN1/lhN+7UV22A0wzgm7/jwn/AqQfR3IvvEqK/TWx1T/Fx8ygh6+TA7cD9JXAw0qkBPBibC7rIzhtZrW9Zv6JivOmtu2XjCz7jpvZt2JjM+Z2XRcNrac8Exd59pdXaN1r9S1rnaXlkESMdAcsIm1QKd2AAVvy6peeSIq+/+JmNz/p2LyWPETcfn/9yWV/j8Rlft/R1b1KkhfLcSrDPCYrGtsYJgbm+CzNDisaFFYZN7isMgCHLhwcVhEIUgdSD1IHyxGAUp/2KgE1el3AAAAAElFTkSuQmCC';
	var IMG_B64_Link       = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAOCAYAAAArMezNAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAypJREFUeNpjaGhoYCCI6+sZ6oF0U30dU0VDE0NVYxPDpIZq6YkN1cqtjfUMRY0tDI319Uz1SHoIGgaiGxvqGZvq6pgqGxsZ+msreW8UJ8x9URL95HlJ9JunRTH7V1QWmFU2NILUMtYD1eM2GGoo0BWMtUC6oq6RoaKpmaG/qpz/eYL/gZ8xHv9/RLkBsfv3r0D29xiP1/NLC2RBFoMMx24w3NA6xiqgK7rqqhlXNpbqTCkrFn3m43zom5vV/zfudq9W5mY4zivKV3wY4Hb4u4vF/5PRIQUgyxvr6lgwDYYZCvR2BSgcq8vFXxVE7LuVFVHz2ML8wGc93f/PTE3uzMzN1SpraWEobWtjuOziPP27jtafk95edZVAsYa6WjSDkQwtb25mmFxeIvY+0uPa3cSgXRcMLaZ8Fpf7/0BV+/ClIJ/CVUXZnsUdHQxb/YMS38oqf/0iJvt/h2+AZ0VrK0NjbS0TwmCEoYwVLa0M04oKpF+62Z3/YW/6/4K/V9UtVd0HT6RVvh/38Q797mzx5UxE4NJVQWF+b8Xk/r8Wlft/3tB8alNNLUNdQwNjA0bkAQ2tbm5mnJ6TI/5a3+DqZ02t/8+Mje/Mz0g3vC+r+v+8jvG6Cy4uXd/V1P6fdXaZeUVdf8NLEZn/J02sJgP1MtQ0NTKC6HqU5AZycX09Myip3NIxnvUJ6JKnShrXp2blqFQ2tzBsdfNOOm9k0fJSTvXLe0nF/4ftXfJuyKl+PWJqPbWuoZ6htrGRsRFmKIqLgYJASYb28gqGu8rap9+Iyv5dExzuWNDby1ADDO9NvoGpL6QU/74UV/h/Xt+s75SmwcJ9Fna9tY0NYEMb0AxFcTEofFoqqxiuq2ofeiSp+OeAjWPLhLx8qe2uXtVPJBT+PxGX/7/fzrmhu7CIf05svC7IIXWQdIthKIrBQFuZqluaGba4e0U/AMbybRnl//ckFT/flVL6f09C/v8eO6d6kGEgH1QBYx+ohwmXodiSG2MdkN7o7pN5TlXn9hl1vc9n1XRubXT3zga7sKGBCZRyQBifoRjJDawI6JLyrk4IH+gLEA3iA8WZCRmGjAHusAUi2c7iuwAAAABJRU5ErkJggg';
	var IMG_B64_Options    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAOCAYAAADABlfOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnNJREFUeNpjaGhoYMCJ6+sZ6oF0I5CuaGhiKG9qZpjZUCmxqyHffFJdpXRtPUQNuj4GvIZCDa5paGDsrK1mv1wQ3/0uL+z527ywmzNry5Wr6xsYG+vqmOuh6mAW4DWwHuTS+nrGOiB9Izpg2s8Ah/8fg11ezS0pMKisbwTLV7U0Q9Q21BPp0ro6xqqmJoapBQWyH4wMvr82Mf4NxJe6y8pYiru6wIZuDQ+Paq6pYalraCDCpSAFdXVMla2tDAvjEo3fSyj8fy6v/uudlNL/WzpGx2alpKuctHKY+UZG+U1nWTljbWMjHkPBEtAIAhpa0dzMMKm4iOOxtPK7R7Kq/x/Iq/94Iq38/7mEwqfXIrL/z+ubbaoB+gbkAOzeh9oEM7AMGNtzK4uFX5ZETzrj5Fh5TVL5+12ggbflVP/fAdL3JRXeLohNMKhqaYEYiuFSVAMZy1paGeYW5Qt9CHU79iXM9f+jaN/t5+ztS/eZWK0/qW14bJ+57fxZCUk61aCIqqsDhy9Wl8JcWN7WxjA/M0P0vYXJ6feWJv9fWZn/+WWo+3NLSoJROTCMWyorGapbWxiqQS4Epo56XOm0HhIx4CSyMD5J8p2M8sXX8qr/Xyqq//sopfByU0iYESh8G0DpsrGRsaGungluIFIaRXUp1MBJuXkSzyUVrz6RVvkPjJh/r0Tlnq8NCtMra28HGwgzoL4Be25CN5SlCuiSQxZ2/Q+ByecOMDIeiis8Wx4WoVPe0Q6PCHyGYTOUuRpo6HZH15xrMspfz6rrnVkQFatZ0d4GCmdmYg3EiH2QpprmJoae/AIeUGIu7+hgaKytZapHSyGEMAAn1dxiG6k2NgAAAABJRU5ErkJggg';
	var IMG_B64_Synopsis   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyxJREFUeNpdU21IU1EYPjqz3xUEppRaM2ULAlMIVEKTzC9cba50m95tuaVbbk7d7t3HvXcfaqa/gpxfzaTUoX3gjyjLD8ogQl2kRVEqZZiF9EMk+iPrvJtT88fDee97nuc5zzn3HMQwDGJoOoxkWNRNG08uUcTIO4uqw2dWD09b1N4FirANW6qzH1l1GStk2cRXipj+hoHHKcx9hTU80IIHeEGBbPiDxuOiXjI4bbxi/q4Sdq3JC/zrRP7GXLXU/bG+vGveIBsaoTSyZ1RVHkbRY7P2/IxR2bxYI+mjNz3ACzE2G7JiZxaPv4nC1zcpY8poidiwnp7i/5N2yj+gkCu7SUOW16CRau0NyESzAVyzu1BHfU3uKlE4yW56gNdWQoa2oV+C7Bdusjbz4YXi2rWYuI21mPiN+0KxxlOny/FqVITJ7uDYbbZIAGW3c3r1WvHKxXOjoN1OGDBkwmCVn5lpL9tra84MFQn1q/uj/asHov39wkvqHp02x6tSlhudTsTSNg6AdDjQHU2l6MfZ9HHQgse2IUOHsVYrWklOnnTrqtOH8gXOOS7/zftjPN9AkZDyVFVmewmCqHe58NHQHIAJm/eoVKLl1JRx0ILHDsNgwmUub6JTfTWvvUx++oa+Zl9rte5gm1yZ2itXCvolMqmxoQHOmgMgsblHrhQtJ/CDCZmdCVk2YLgUmzjmKVcU1zc1IpoJLITqrjehvhKZ9F6prNTUiBNarRwA2eBEHkIhwpqgIfb4PyGOvRCfNHabUBRTTkeE3WKJxNhLupwRd0tlEgCuw3FvDwBzwjFXDJrglnclhF/+6WjSuLtCnWtoaUZmfOgAfWsL8sgIMQDqUB84wAUNszth4B7iVWaPn3j6oEDQ2FahzusiFAWdhKLwlkqdOSgQagBQQw/mgANc0IDWGnxxwYsN7ngb6G0C//l8VKz/c1Sc/8uh+ADmcf0hLvEvYH5HHzjABQ1oQ7sMuOKnE2ZlWfQkI8s0eyTBN8PlT/m4PB/GNK4X5g5z/QCooQdzwAEu1pCgpbcu9mZUvAIyu5zISZmRw4wRGjE8lyU8QOg7NAdc0IAWPMDrHzug4Z4OHg/WAAAAAElFTkSuQmCC';
	var IMG_B64_Related    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAq5JREFUeNpjaGhoYMCK6+sZ6qE0jN0EpGvqGxgKG1og4lj0MeA0EIjr66EGA+mmujrm6oZGho7GOpaV9cW6tY2NDI31dUwweZgFuF0Hc1l9A1NzQx1DeUsLQ0tNDfP1cL/F/72s/i/PStcvaG5laKwDGgqyHKcLod4DKmQsa2himF5Xzv+sIHL/3KI8/QuG5ot/CUn+P2VpN7WzroZlSWOZRl1jA9jyelwuhIVbVUMj44TqCrbnhZHLvqX4Pv/kbnP9iaLaze32rq21QK8fjw9v/u9t9X9zWqJzRVMzQwPQAThdWFffwNhcW8twP8Z/+bcQ5/9vIz0/vfW0v/pWS/vW/MRkrSOOrq2/hCT+X9c33dBXWipc29DAiD0MIeHGWNHcwrA8PdXym7nh/1e2Fr/eWpv9f2tv8f2Nnt6NVxIKd5+Iyd86bGo9o7mqmqGqGew63GEIDDvmirZWxv2ePhWfpBX+vlTW+PVaSf3fK0W1/69VNH4+U1C/el9K6e6C6Fi3ivY2hsbaWmZ48kIxEBGzjJXAMDmjb77ilZj8/ycyKr+eyaj8fyqj8veJtMqfp7KqP59KKjy/pKR5oL20jBeUfJDTJIqBoJitAMbsvMpivVc25oduy6h+uKOg/veOgsavuwoa/+7Kq/1/Kib3/7ShRXtnSSlLPVA9LHlhGAhNKkyg9HYhOyb/i53Z87vKWgevy6p+vy2l+P+GjMqfK0qad7e4eGYBvclQ3YI9tyA4QNsqgYqWxCcaftbT/f9GVePVUxHZ28f0TfsWhkfFTE9ONegoK+OsbmlmqGtsZIRFBE4XghRUA2NsZmq69G0p5dPHjS1XzUhJU2yprGSpBAY+yEV1oOwGjDSUfI7LhVAvM1S2tQENr2Woam1hKO/sgBQKtbUsoPCFFxRorkLGAB1JzmKalgtyAAAAAElFTkSuQmCC';
}
else if (GM_getValue('AZ_IconsColor')=='#8EC454')
{
	// Green
	var IMG_B64_Download   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAOCAYAAADNGCeJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAolJREFUeNp9U11PE0EUnRL4FfrqEz9BTeTNB1+IL7SJDzbGmEBUiAS6uzOzXdjSVvoFtLBQSkEFEmJtJAa0hVaBQlsfRAstJYBEjfgP/IJx7m4lqNSHk5N755yTu3dmkSzL6BSYRIGgAc15Npkbjs8tD80mssPxXp96RhKJfn6a768GRZRSZFdonSjgWm3CdeH1p/BRZkf7nv8wcuQPqeclEdfKdlpHqaGvHkYNlkQZdbQR5PIq9aldL0tueb6l97zM7VPqoY9xJYj+f7Iaginqn6ANoSlqG5+Xg8/KCpvdUH4AR+fkgdA0tXkG6SUsGvqqYZQfYpEifwQ3PN6+x2aK7Wxqvf3n9FuDoYa+R8N6GD09DHZlNAghqKOVIEd/57ngqvWzlr/BtOzNr8BQQx8+FXT6ACd298dkGBOTo0cxxVOBzqX1seDDRblZTTbu389cZcBQQx/OQQf6fyej+i2asGBHkwvdPemPbpbYcfLF95ZCz++02J5ejnNuhhr6cA460IMP/MdhVCY1RLQj+2DLRf9aE/O8NB96X1kOfStm5l+69qUrZglyPoAa+h4O0IEefOCvhEEqNUl88YEnrY3jKck19kJyRJPYzeGMJiXvgzQOc/YZNXZF5iUFdKAHH/ghx1g6fw5dqoyWSlo6uxvZWy6ObK5sjZYqKK6UwgWdt8KlTHm0nH0fPsjuRfa5PgU+8B9PRiSKup0UxQpS8VFGmI4kbGp0UXBzuE5ibMHmHE8L/pk34ubkmhCLvZM2VKfhr0zGr5m/aLtDRL5lSyGQa2J9OQvry5urwr9qZqDj+g3wEf2PIOj3/2iC9yIN3LoiDF9vE4est0XNercKWgGgAz349BvlOb8A/kscDlFvAnIAAAAASUVORK5CYII';
	var IMG_B64_Link       = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAOCAYAAAArMezNAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwNJREFUeNqNk0tMU0EUhqfFrWGlJBIXRldGF27csyIEAytdaEBECU/xkQJt7+2d6e2TlpZaL23BKuUNpkgjIS2IpVCgSgkNIpWXiogbdQeEDWScKRYsD3VxMpmZc775z5lzAEII/I9BCIGSR2K5TAFYBgJTrTaV2Fm1mgdVEhYolUgM4Z7/P2F0JUEiGsjIOVBtUh0fCNufjs87V8fmnT+D0SdDDc2Gyyy5QwiK4vC/QwmQU0BAVTIyDuhr+GR/VAhMfHPgN6s2YvbN0Iodv/3q+GGt15xmmR34keA4lDrqqnnRs1bzBYOFP+GdMY4Els14YM743dakSbM4VGf6Isbg8BcT7hzU36ePk7hjh4JjtaRpEydjrSplfNHp758U2J4IH/AuqbBnml+qEdB5uZQD8ioIOoJKe/9n1VbLgJJj5RBABPeDySGtTxxq4U+OfBSivqlHA41+qdCzIMXtE9KgO6h/UN+iz5BXIGDrYm91z8o26J3dzWawMhrPif8Ax6FQxMogMFqVqb6oITK8UoM7A2q5c7R8uXGybNPVD68Or5jWu/z6NmOjJKt15i5ufleKG14/rCOxAHK0vnD/50GRgoEigxWmvHyPZvsWEUkbLZkc3CUhlIstr/JftA0hg++TEjcPcvXWodseeyQHW7xFj0n6gHzyDjSxK6himETr2zIubXDPVeKOqaoPeoviHK2bpqMg3zF4T/18WrreHZViW29FuXY4e0Pfe7OOqARQgUS7WScq5siLpF/VHHCGysKumaJtU3NlGiNRAcgqQW17RYErUrrtmi7GdYMlZrYvswm6r5kolOMOQhMV0/qoFMAykjciTORs1XgK1bxResrQVcII4RxsDV/HZk8pUugkyYxQeBFypIOoHQJNBCMopurU7Xdu6EKZWBfMxvqx7DXdaBbWjl3BGncepMNCfRCrpnHivZrCA22b0G4cpCNJ1pbcYsaXvsh409eILZB96W+F4tjY7lhMKTwEuk/x7stiJNPGBgUiThybQrInd0noiLQPs1+nuT2J03WhEwAAAABJRU5ErkJggg';
	var IMG_B64_Options    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAOCAYAAADABlfOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAnNJREFUeNqVU0trE1EYvZMEdOFKESriSjdCkVIX/gFXUrBSVNCVUKLxAYrUzOs+8mg60SZNMmmbtEkEXVRNVAyhkaqFUpOmMWhTjdhCCwpaFHUhSH3R652ZoAHbNC4OA3e+79xzvu9cQAgB9YAxBsRBgCQgIAoQhAaUpptpdV9vX/d2hPCqPaA+qdEEIeI8inPD6FT4SmExtlRYiM0F+j07oYw44sBm/eKa+vqkWFfKaU3pad9A/q1KJxaDH4IRd4vEVBN2DuUaRw0q5WQJg8tBsmN03r2cqbh+Msy6FWwRu4ya6C1yzOHCFqyPogGlmCATFAnoHZL3JiuX6I0Z+w/tez1nzythcdfwfT6afG7/6PJgDsF1SXF1QdgkCRj0+NHGaLHz81DxJI1OW78Nl6w09tT6JV7upOoDWxrpI0CmNewzMn0+RNu4SbRDoEY9W6bmE6Hw2BnBNd627M0dot7JDqpMtlNvvv2Te/BCC5IcrA+bVlFqEBJDISfyCAQirs0TC6F87nWYjs0GsupDW5eUOnhXyhzIw1THVaSea8ayw3C15qL0H8wyj4E/QrZm5zxPGGim0v3r0Zue74mk0qqNA7kkgGWnDm2Za+ZUu41ZAFBii4nK226/5MupFwJNlvmVO6/s7/tHYKv2AFiNmUWNI4Zdzojd34z+Yx8xK26f1JR4dqoSL9lorGhbSZStS/5r9j0Sr9eYjTFhI8NknRfFCizaFpV7J/r8hSPU9/go9RUOv/PEzzdDwQGqyqqq6qM2k2YM2dBHjp+Vx/d/Rdm2Ehk8vRsJTsPyH0L8P6RGk0YMlYubEGLnglvPqmG1MUINvwH0BwGWw+q60gAAAABJRU5ErkJggg';
	var IMG_B64_Synopsis   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwBJREFUeNpNkstPE1EUhy8Uce3Gf4KNG01caAwERRpfi9JExYgBA5GFWLB07sy9M2UqpRX6tO3UFkpFhdQYQQR5dQhTUyKQystINAT/CzdkvGdooYsvc3rm/L6eOzNIFEXEqMCcgMLxgXO53eH5ubwSn8lFp75o0YmVrQRJZ4bqUxNDl/N7I8vadnJD2zFYZ7PfWKYGsuAAFxSIElpBKUXqppKZXnmF1d1IIn8Q01f/xg5n8uHYwlossVRQPryf8j8Yn/Kbxz8Hbr/96L8+rUU82U3lHWTBcSwkAkGSJKLcn+jqS798fmSyz7a4P6AvHXj0UEpsDSov6pS0u9n2FCOHQzDo7sLIH5Ebtd/RHGTBURSW7BQt/hpa8YVdtcEx3P1pjzsEAm/4zlDc1RBNu1p4jpgkp1gN8JiYQgnZuvDTt1TuKB6ZVFD2L7O7bs0Xlq94R21dw1ttOjCQtLUH43JDeNT5kHMYW5gA3kFRIO60zOy4VciC42RDgdkliia3pdxQSL4kpdpkT9b63aNaC2LyMRdQ5PpgirZgJmFzJgBzFPkU0TK55VQhaziONiyuy5qZH9zyYEQyc4H2i9RtP0MHes5yvo4L/rh0xz8sNONeCvMmADYcVIglU+CPhCdHJohS9solgsbWbFlvDDfxvRISiWjA2yU0mMTNgwl8j3ewHiUmQOBE5I1iy9i6TYWs4WCusg0JSuSfZN3R3iaBF6vY72rGaQGLVZ7X9vsAk1Sy0CmA9SvZrBUyhpCUH9nYkKKw9kh1Be2NwnMZUSwZCD0y6o/2WAGoj/tsBmYhYxzZ2LAoJJQaR/dm78650h39Tn+3uS/87AbjJqtrXanOTgBq6ME9mIFZyED2yMGEFJ4hgQ0F1Dd/e1HWGnVZM+uuEjmzLqu3/gFQl/qyQaMOGciCA1xMCOuy88MLGLf24oW6Ap69to6/Xi0wNhj73GKtDkBd7B3NsFmWcUAWHPT4w2aFSNmVdyLahxF18og4S1ce4UhrDQB1+T1jlmWMLDiY6z8wHxRpB+8euwAAAABJRU5ErkJggg';
	var IMG_B64_Related    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAqBJREFUeNqFk01ME0EUx2fbxsSD8eDRkzdjoujRs4kRExMPxiABNGg8GCpJjdD9mpmdzW4RaKWlUKQYiiASItXiBxI+BaqGUglKAauVRA8kJiTGC6EBxtktKpAWD5OZ7L73f7//mzcAYwxyLYTQtrOiYCBLENy+Jf6LQ9tzwG6Cf4JNMYKtkgiBXqXa7ne4j0LZLGDZWfi/dGy3EFUBohMBomJr5F1te2zZTxtCal6FQ2IxyLK1eG4xBXN8pQzq/Pr+ifngiCeg5DUPOdrDXx002F/ZoLmIrTlUe9iINeNzCm7+YPa4ao+6J7oQ7Jz83rw0nHLPN8ZKPpGuyxqSMegaqFbjyw20pVs/JfLQIOVyECIAEeIUgkDf9N1H0W9+Opr0/RpMuhPhOTF5J8AfaXpeqYUXHbRtvOKpqwYfYP3kjLwsggyfWTUq1reSk4OLLvoyoaf75nX6aqFqpXcOL3TMlKd8k5eSeqS4CRMZyCIy83bpIbJKPOaCEdkZSQrrPR/EdHhW3Oj5KNAns9Lqw2lHwvP2YgoHyk4jQWW9htaMWBZCs8GsF8Z4+PvtXW0zZbR1yp4OvbfTUNy+3hovW3sQL18NTF1ZQgNnR6Hm3IcgNnKyjY2JzokCs3vPdezxLD/mnij46Y0Wr/uiJWm2NrzRIuqNFdC6/usupAs2iCCHMxBZBDPYFmPeese95cOLNUuNb66+VkbyV8jYGUpG89fI0LmU2ll6A2IZIFHJ9HyL2E5CThYQ8LTIJ/q+ENqT4H/UTxV+hs/Oe8TAtSLovXkcafxeJCmA2TRvFRkQOQmNcREx0OqdB6vHL8RqXpR2Kz7HIUgEGxY0gGV2AdCksv4V20GXzTITJUDCgjHYAPGa+R0p0GY4QJsWM88SZX1lvwHo5/q2xGOWjQAAAABJRU5ErkJggg';
}
else
{
	// Blue
	var IMG_B64_Download   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAOCAYAAADNGCeJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAr1JREFUeNp9UklME2EUftMUMV5INHpQTCqEgzYRFxKNK40ROUgiRxO5k6AgvdBCZ2lLaQfDUrEaiEA3oCJCQSJSZfEEQRablCUYJYUIRTYVTOoC4/+mxVSCHN58897/fW/efP8DjuNgazCcltJr1JBpro691DbmvvJs5Pllt8+dW2w+pKcLyDlHbaf7J2ERWRY0Wl2UXpMvzbC4Lhx8E9yI61r5Gdv7fSOztOq8ji6QajhdFPLYnZpxXIhgIFOV5eVAjsksj/GsCfs7ln8g3uEr5FjX05pwI3bHySR6hoa0iiZF6sM29Qlrv0XavirsaV36JW3/Jpy09j1IfdSuziipSTbQ+WiHZNtm+CWG5SRISi93KcAdFKBlVaCeLvyGpsUQkhxag8LNEltyEa0GmtVK2K3NNr1CZBkGzHnZcIuvSthln5mDuoBAOT8FETHHepkqR+RF6iImY/GGQEtrKJXBRCkaB1TnXn6wJDqHs6IrJ/1gnRUQMce64smACnnIZyK8i/hFljLSKjjuHDTC63UhumNNiHmxMiGrHr699/6Im2AW5ljHc+QhH3V/J8MXmnhlJB6k8Y6LYJsXoHpqHWr861A7I0Ctfz62os9CMCDmWMdzwkO+UfSOE70LLylHFRLjz1b2pJ+q8/JJ9rdFSc6h4iTHoOm0Y6g0sd77mGAZ5iT4M7Z+HfKQXyjeamiJxcm0jAby9EZI6Jzvje9anpJ3zo4d8wQmwjEu98z5QhiYOPrq86Ss+2sgrvuLn/B7UId6cTI0EJdQWXgPpC1L4wfq37vircMGmd1bfMTu5TdDhmh7Zzrs8JXvbgqM7Wv42CxtXhxFHeqxD9DkoSOLqtTxANZpHzgWBDGci9sHntlmQ2idHkUd6tnN32TJjWhZBm4YbddT+EblNVNDdgrvuvufyL0qRqMS+ahjwzf6B25a/DWfRC4QAAAAAElFTkSuQmCC';
	var IMG_B64_Link       = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAOCAYAAAArMezNAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAzBJREFUeNqFlGtIU2EYx58zI2ZlgjmlTEoSyVQsjOpDUH0p/BL0ISKKwCwqjCjF27ZzW7t1ai5vW5k673kpbWEzW+TS/JBhF80stTBTp65yoGsaytt7vDVT88PLey7v83v/7//8nwMMw8Byg+ZnmgaSlQkUkkRQkGKI5dL84rjULdKrCuCSYoFiWQG/ZrZmWRg/UwxL8FC5NBni1FqPPcaPOaHmgd6wJ9bv4bV9dad0pbv4dxTDEDRDLw3+C2UJGUWCXJIECmkSXFFpPQNrrBaRZRx5W8aQyDLm9K37hXzqnLbomwZ/OTkNXxQ8C+VVyqViSFRyRNTtstCLXIbI72F//WqzE60z/Rw6llF2IFqbG7DZ2NPg/nQc7S5uuqzENpEMu2IBeM5LhsVeJsElLs03+Knt2Q5jh9Trfp9F8MiBPKsGuqJvZG1TSxLgmjgeAkva9FAzPhGe30Qp8amw4vlgVyi/80Uu3We92f4hxPjliX9+SwYYHWhNaU9DaOn7K8d15ZGa5FjYrzNFEVXDDjA60d5btZFqDObr58AuUEKFoeeu6/1E1UNvVpp/o9CSt2KPwq7uFXetzu15L4+6m8dGI4qbiw9pKw5DhR1BxTDaaGjJlDIyzKAI+t9U8KbLSQlxhtP7rnrwvY2oHkVrKwe6TmoMO6CgF3llt1YGFb3jwDSOtha8vr3G8OkBlAyjTXea00maARklJagplksqZhS70Vi1d3FnFlSNIGF5f/sZtS5QiWMUkVp72s/QIne7ZxuFKjsKyWq8RGR/dWzWN2XSNIWhJIayc/GcA/M78bGKl6lAWNT9CsrtkwdTKw+kiS+DnJLCvvTqs1Bmm4SyH8gntzXFI7M1PyCtUcPgGpYmp5W6QOcpZrE/iawChIbP9UTh4ESQrlF+XpG6ISLdLIGiIQRFNhSsf8HEyDSeR1R5YTKah1KwGHQeGPskUFJifOzHJ8AwiCDnGwKDdQRy+xDkWlFwxnN6qlkoCajwOlwnoJeALhY3gl+4M8V0Qahr7xRmto246z504PsYFkPxVxfwyeGb53/QBXGjp68FGjJhpvuYqR+Lhoznn7stB3MdfwCUTiM2yi1CSgAAAABJRU5ErkJggg';
	var IMG_B64_Options    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAOCAYAAADABlfOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAApBJREFUeNpjaGhoYMCF60F0fT1DXUMjQ0tNBUN7dTlDbt9MidBFu8wLuydJN9TVQtSgYQZ8hsIMbqytYSxv7WS3Wne5W3Xfu+eqe9/ezOmbodxUW81Y29DIDLK4HuYIQobWNwAV19cz1tfVMeisvTGNd/+v/yK7P71K7p9r0FJdCZJjaK2tgqgFsolyaV1DA2MLUFN65zRZ9i0fv/NsevObd9PbS0Ut3Sx9VUVA+XoGlxnbo6oam1ka6usIuxSkoLa+gamttpIhtG+RMcO6j/+ZV7/8xbDuw3/hpXeOxXbNVtGYd3omy9p3b0qaOxmbkMIXq2H19ZAIqmloZAJFTnbHZA6GpS/eMSx9/p9x6dMfDMte/WdY/uYTw4oP/8XnXtrUUlcD8hUTVu8jG1gLMrCqjCF1wjxhnT0vJynMu1DJMOv+d4b5T/8zzHsExE/+M8x/9jaoa5FBGzCIQL7CcCkk+cANZOyoLmNI7psrJLHr4zHRvV//q2x+vF1m3qVSmQnH1/NNuXRMaeLR+SHt83Ra66oZ6uohkYojoiAu7AR6OaZvvijX1o+nubd8+M+/8fUfhp2/f/rM2mLUAZQrb2xlaKurAuJqcGQ2IBmIZijIwAZwEgnrXSTJtP7jRYa1b/+zrHn9j2HD55euUzcbtQEzANBVzI31dYzADMEExIzgNFrfgJIJ4AyYgRltkyQYVry5yrDsxX+mZc/+Max8/9xt0jq9LmBwgBJ6PVJOq8eRcpDTJEtrbTWD4rQT/QwLXwAjARgZC18+8+hdpdNVUwaOXUKGYTOUGRTo2hP25DDOfPCVd/q1M76dSzS7astBeZ+ZWAOxxH4dAyjN5TT18TQCE3NPLcjLTUzgiEALN3wYANnF8SVjJoOgAAAAAElFTkSuQmCC';
	var IMG_B64_Synopsis   = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxVJREFUeNptk2tIk1EYx8/cmlJIROAXi+hTgV/EtBCyUhO8UGw1nZe8UaSGCZbZbu/2TnezXVXUqZtzIuZsjblKndqUMohwDiJIK7UUbRgFhVFfZJ3nxbkZfviNw/M+/9+e857zIpIkkZgkaTIRH1U1m+NPuVfHU51vu9IdPtfFx3O2M6PL4gKTK6Ow23kuftI/nTT2xZvkXvEmja3MJrpXX1U2m+MgCw5wIQn+ISVimkQiQQkjnx+l273Ck6NrpiOeX4HYqc2tZMc7Y7Jr3pT4dNF+xTpewrZO5LD6Jlgcy2hWmn3uQcLI8gBkKQcIsRlJxQQiSCk6NvHjdc2D1qTzZs/dqLHfAab7T+Bqq+3GTUNPemH7ULHu3m0kE/AotPU1qELXnX18/PsMZMEhDp9QLCFR7Mi3F7e0xrSMVmcdGt7cAjJbHNXXDZZMbttQuVzEo4ukDUxARvDppc193KPP/M8hu3tCEOJ/Ofxk42WltvNCusFRi4Z+BoAsna2y3NCbyWm1lSmF93G/lA4oRDxUou/NjXH5pyArDQolYcJo58ZMhcaYclY7LIs2fXxzwPTJl6qxC8r0lgx2y1C5ShQSKoU8VKSz5h50/icMnzDS7p8u03TncOSm5OpGzaGqRn0MV9Z1ukDfx2YZBoubRPUhIT7ZAm1vbpT9624hESZkDq578jW9eWocxDUKjbAOsfQPi9n6gSJV2JZVBA/layy5OLP3hHBSkf0rnny1JU9OCBhCsoGJiVQQfAZLO3ANUBL8CBHZsA9QEIIIrtrChQyx95ZJxLQuT5WoOrMNgjtILhZQNAtqEUdt5QKwDtahB3ohE3TsCPGRI0IiRftNH9wpepeyRGnM4Tb1XMJcLlUa01J1jmoA1lCDZ9ADvZCBLDhC71BM0PD2UFTn/CQyrQUozEHWA6h76S8FrIP17T7IQBYcOxcbfzq0BnzTT+g9PHrHoo/R9n6W3r7gY7QveDFLqGM5AMAaatQz6MG9OMOHLDioCeGD3r6LSIHfDV8qx8gQnwyRo+qPA8JrVA/uhYx0e7vg+geBgP2g0Fr1BAAAAABJRU5ErkJggg';
	var IMG_B64_Related    = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAOCAYAAAAvxDzwAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArNJREFUeNp1U1tIFFEY/s/OaEgXH6we1IeCoEjNInqQHoMgqKcgISooqIcI0h7c28ycmVlnL2Zmkbbtmrrs6m4aXtKIlSiLBCEpCSQvCbKSrrK7RmXm4no6s6LpsvPw8x/ODN//fd/5fhBFEdIVVjvGyb5+FiQZZJ6Du/ry//cpBVqAa4U3wDhJZiycGYyKnb3qfFYkCzwIoqTbPFgTcMtPGOs42QI2sx5MciVT8HzUm/GBkNJHgeJqfRnw66B0eFrAdTBelJHVVAG37j3OLuybeXut5mlxbtMXL/QkyIHGoTpDpZ29Xu87JGIBcHI41mJIvaLdwptQuaM2s7Av3Jrb/2c2O/jrK7TMjxU9eK2ock/6Bi0ZA4ScdfWesnIGSkBE2gwFAZklCxzsnvLnvFki+cHoz92vYiNsV2y8tLr5cEHDgKIy3esb6yqz1uRIAo/Seqhe8lhENrMBLjz0lzDBvyS7JxLf0Rsju3oXlrZ1R0ehPTYJ3vnxffWDTqNoAYU3JhVpekhNZuycAZ1w9xvgxe8E2xGJ6zqiq6gjSpjO6LKubW4EeWYmzzl8p6t4PXCizKR95WSu1A+UocIZIa/hcwDaYgT5w3EIzBFaCfCHV1AgvEy9nNU5J/rvyI6dMua35HELIM0VqqRyb9Q2HtneFX0PTaEfqDmU0HlCceSZXgXPNAFvhOS6h23lchUrYIzwJnYpknEyU3ZzBZS0D9/OCi7OMt7QO3BNLYH7OwF3aCXjybfJ47V9NzlRAqtgSrstGwdqLLJRqefvtxzLfLlIUOfCPPgiE3vqPtWcsbdeumh1HaUSsxTBDDIWEFWzFn4thupLKXTqZYcrj20Mfcx3DrVdsbn360WFrRIMlFESSLWFSV03UUuyOtVOY2DCEo2DCar5CpDUPRZlVvUXp65lmvoH0cTnCrnZ6TgAAAAASUVORK5CYII';
}

//****************************************************************
//		C S S
//****************************************************************
var zapColor = GM_getValue('AZ_Color');
var zapBgColor = GM_getValue('AZ_BgColor');
document.getElementsByTagName('body')[0].appendChild(getCSS());
if (document.getElementById('header'))
{
	// On verra si cette class peu servir plus tard
	document.getElementById('header').className = 'not_pinned '+document.getElementById('header').className;
	if (document.getElementById('q'))
	{
		document.getElementById('header').appendChild(createElement('span',{id:"AZ_Login", class:"AZ_Login AZ_LoginNew"}, 'click AZ_Login false', AZ_LNG.monallocine));
		document.getElementById('header').appendChild(createElement('span',{id:"AZ_Footer", class:"AZ_Footer AZ_FooterNew"}, 'click AZ_Footer false', AZ_LNG.footer));
		document.getElementById('q').focus();
	}
}
else if (document.getElementById('main-header'))
{
	// On verra si cette class peu servir plus tard
	document.getElementById('main-header').className = 'not_pinned '+document.getElementById('main-header').className;
	if (document.getElementsByName('q')[0])
	{
		document.getElementsByName('q')[0].id = 'q';
		document.getElementById('main-header').appendChild(createElement('span',{id:"AZ_Login", class:"AZ_Login AZ_LoginNew"}, 'click AZ_Login false', AZ_LNG.monallocine));
		document.getElementById('main-header').appendChild(createElement('span',{id:"AZ_Footer", class:"AZ_Footer AZ_FooterNew"}, 'click AZ_Footer false', AZ_LNG.footer));
		document.getElementById('q').parentNode.parentNode.parentNode.className = document.getElementById('q').parentNode.parentNode.parentNode.className + ' is_open';
		document.getElementById('q').focus();
	}
}
//****************************************************************
//		T a b l e   c o u l e u r s
//****************************************************************
var ColorSelected = zapColor.substr(1);
var BgColorSelected = zapBgColor.substr(1);
//var AZ_WebColorsHexaColor = '0369CF';
var AZ_WebColorsHexaColor = '369ACE';
var AZ_WebColorsCount = AZ_WebColorsHexaColor.length;
var AZ_WebColors = '<div style="font-weight:bold;font-variant:small-caps">'+AZ_LNG.OptBgcolor+'</div>';
	AZ_WebColors += '<table class="AZ_WebColors" cellspacing="0">\n';
	for (var AZ_red=0; AZ_red<AZ_WebColorsCount; AZ_red++)
	{
		AZ_WebColors += ' <tr>\n';
		for (AZ_green=0; AZ_green<AZ_WebColorsCount; AZ_green++)
		{
			for (var AZ_blue=0; AZ_blue<AZ_WebColorsCount; AZ_blue++)
			{
				var AZ_string = AZ_WebColorsHexaColor[AZ_red] + AZ_WebColorsHexaColor[AZ_green] + AZ_WebColorsHexaColor[AZ_blue];
				var AZ_colorvalue = AZ_WebColorsHexaColor[AZ_red] + AZ_WebColorsHexaColor[AZ_red] + AZ_WebColorsHexaColor[AZ_green] + AZ_WebColorsHexaColor[AZ_green] + AZ_WebColorsHexaColor[AZ_blue] + AZ_WebColorsHexaColor[AZ_blue];
				var AZ_color = '#' + AZ_colorvalue;
				AZ_WebColors += ' <td id="TDBg_'+AZ_colorvalue+'"></td>\n';
			}
		}
		AZ_WebColors += '</tr>\n';
	}
	AZ_WebColors += '</table>\n';
var AZ_ColorSup = ['#FFFFFF','#DDDDDD','#C0C0C0','#969696','#808080','#646464','#4B4B4B','#242424','#FFD515','#000000'];
	AZ_WebColors += '<table class="AZ_WebColors" cellspacing="0"><tr>\n';
	for (var AZ_icolor=0; AZ_icolor<AZ_ColorSup.length; AZ_icolor++)
	{
		AZ_WebColors += ' <td id="TDBg_'+AZ_ColorSup[AZ_icolor].substr(1)+'" '+(AZ_icolor==-1 ? 'style="display:none"':'')+'></td>\n';
		//<button id="BgColorSelected'+AZ_ColorSup[AZ_icolor].replace('#','_')+'" value="'+AZ_ColorSup[AZ_icolor]+'" title="'+AZ_ColorSup[AZ_icolor]+'" onclick="document.getElementById(\'AZ_container\').style.backgroundColor=this.value;" style="color:'+(AZ_icolor<4 ? '#000':'#FFF')+';background-color:'+AZ_ColorSup[AZ_icolor]+'"></button>
	}
	AZ_WebColors += '</tr></table><br />\n';

//****************************************************************
//		D i v   o p t i o n s
//****************************************************************
var AZ_N = '\n';
var Choice_options = AZ_N+'<div id="AZ_options" class="AZ_Options_Hide">';
//		Choice_options += '<span style="float:left;text-align:right;width:25%;">'+AZ_LNG.header+' : &nbsp;</span><span id="AZ_LinkHeader"></span>';
//		Choice_options += '<span style="float:left;text-align:right;width:25%;">'+AZ_LNG.OptPosition+' : &nbsp;</span><span id="AZ_LinkPosOri"></span>';
//		Choice_options += '<br style="clear:both;" />';
		Choice_options += '<span style="float:left;text-align:right;width:25%;">Zap : &nbsp;</span><span id="AZ_LinkZap"></span>';
		Choice_options += '<span style="float:left;text-align:right;width:25%;">'+AZ_LNG.related_vid+' : &nbsp;</span><span id="AZ_LinkRelatedVideos"></span>';
		Choice_options += '<br style="clear:both;" />';
		Choice_options += '<span style="float:left;text-align:right;width:25%;">'+AZ_LNG.OptIcons.split('|')[0]+' : &nbsp;</span><span id="AZ_IconsColor"></span>';
		Choice_options += '<span style="float:left;text-align:right;width:25%;">'+AZ_LNG.player+' : &nbsp;</span><span id="AZ_choix_lecteur"></span>';
		Choice_options += '<br style="clear:both;" />';
		Choice_options += '<span style="float:left;text-align:right;width:25%;">'+AZ_LNG.OptBorder+' : &nbsp;</span><span id="AZ_LinkBorder"></span>';
		Choice_options += '<span style="float:left;text-align:right;width:25%;">'+AZ_LNG.quality.split('|')[0]+' : &nbsp;</span><span id="AZ_Quality" title="HTML5 &amp; DivX"></span>';
		Choice_options += '<br style="clear:both;" />';
		Choice_options += '<span style="float:left;text-align:right;width:25%;">'+AZ_LNG.autoplay+' : &nbsp;</span><span id="AZ_LinkAutoplay"></span>';
		Choice_options += '<span style="float:left;text-align:right;width:25%;">'+AZ_LNG.size+' : &nbsp;</span><span id="AZ_size"></span>';
		Choice_options += '<br style="clear:both;" />';
		Choice_options += '<span id="AZ_LinkColor"></span>';
		Choice_options += '<span id="AZ_LinkBgColor"></span>';
		Choice_options += '<br style="clear:both;" />';
		Choice_options += '<hr />';
		Choice_options += '<div id="AZ_AllDivColors" style="display:none"></div>';
	Choice_options += '</div>';

var FormPaypal = '';
	FormPaypal += AZ_N+'<form title="'+AZ_LNG.donate_title+'" target="_blank" action="https://www.paypal.com/cgi-bin/webscr" method="post">';
		FormPaypal += AZ_N+'<input type="hidden" name="cmd" value="_s-xclick" />';
		FormPaypal += AZ_N+'<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----MIIHPwYJKoZIhvcNAQcEoIIHMDCCBywCAQExggEwMIIBLAIBADCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwDQYJKoZIhvcNAQEBBQAEgYCT8hqjjO0t/XSh1dfEal3k4YXQR8E5iJA86tu0x4ggAb0+ieOOvscvkpDWAPZU+8aZ+IDIXez1ISQ+SE1JffPW8tk+IOnRM+zZOud2nqEnxWFh4u8HmgVAkL9/THoBXouOKdbWYt9+VW/TXKnAT4MnwYo/P4+ZzAfPls2y1/eWlTELMAkGBSsOAwIaBQAwgbwGCSqGSIb3DQEHATAUBggqhkiG9w0DBwQIE1xsOs1g6m6AgZh6TSl/8qk4sgtiD6HsB3dDEbjXpwWC7fwyXM4E6czMdfIhFZuJhg61BddNMyREvQctml5fbD8F0l0KmE3KbF2zIe0nA3KCPx5PTGY9gN3QFnLIFF/M4Pu8XpOvtIsWqQ7NBWRJSP5Nl5+W38rSz8/5X2ZTQCcpNYdgjuHJVG6lwhnoqKQesmhu4Pxh/5JQJycSRKQU6JlOLKCCA4cwggODMIIC7KADAgECAgEAMA0GCSqGSIb3DQEBBQUAMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbTAeFw0wNDAyMTMxMDEzMTVaFw0zNTAyMTMxMDEzMTVaMIGOMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ0ExFjAUBgNVBAcTDU1vdW50YWluIFZpZXcxFDASBgNVBAoTC1BheVBhbCBJbmMuMRMwEQYDVQQLFApsaXZlX2NlcnRzMREwDwYDVQQDFAhsaXZlX2FwaTEcMBoGCSqGSIb3DQEJARYNcmVAcGF5cGFsLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAwUdO3fxEzEtcnI7ZKZL412XvZPugoni7i7D7prCe0AtaHTc97CYgm7NsAtJyxNLixmhLV8pyIEaiHXWAh8fPKW+R017+EmXrr9EaquPmsVvTywAAE1PMNOKqo2kl4Gxiz9zZqIajOm1fZGWcGS0f5JQ2kBqNbvbg2/Za+GJ/qwUCAwEAAaOB7jCB6zAdBgNVHQ4EFgQUlp98u8ZvF71ZP1LXChvsENZklGswgbsGA1UdIwSBszCBsIAUlp98u8ZvF71ZP1LXChvsENZklGuhgZSkgZEwgY4xCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChMLUGF5UGFsIEluYy4xEzARBgNVBAsUCmxpdmVfY2VydHMxETAPBgNVBAMUCGxpdmVfYXBpMRwwGgYJKoZIhvcNAQkBFg1yZUBwYXlwYWwuY29tggEAMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEFBQADgYEAgV86VpqAWuXvX6Oro4qJ1tYVIT5DgWpE692Ag422H7yRIr/9j/iKG4Thia/Oflx4TdL+IFJBAyPK9v6zZNZtBgPBynXb048hsP16l2vi0k5Q2JKiPDsEfBhGI+HnxLXEaUWAcVfCsQFvd2A1sxRr67ip5y2wwBelUecP3AjJ+YcxggGaMIIBlgIBATCBlDCBjjELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQKEwtQYXlQYWwgSW5jLjETMBEGA1UECxQKbGl2ZV9jZXJ0czERMA8GA1UEAxQIbGl2ZV9hcGkxHDAaBgkqhkiG9w0BCQEWDXJlQHBheXBhbC5jb20CAQAwCQYFKw4DAhoFAKBdMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTA5MTAwNzIzNDMwOFowIwYJKoZIhvcNAQkEMRYEFFzDrJ9go8Ug0zzAwNwxNNg/rQ/MMA0GCSqGSIb3DQEBAQUABIGAZQ8peylksoz3JUOkt8VEZ0DXSY9ADsETHVWFlq2tDtiM0sFPYBqCh9Pp7Tlkl46ANj5zR9oL74So1JWaIz2s0+pCqSzwVh/T4kuxM1wDDh1zSA87q7/XJDh5bBPDQVNvPFvZVfvvUND5ghgbo77TDMVw1WlXiBdkvsOMsYzqZGc=-----END PKCS7-----">';

var player_no_pub_title = AZ_N;
	player_no_pub_title += AZ_N+'<div id="AZ_div_title" style="text-align:left;">';
		player_no_pub_title += AZ_N+'<div id="AZ_zap_name" style="float:left;height:30px;padding:5px;">&nbsp;</div>';
		player_no_pub_title += AZ_N+'<div style="height:30px;padding:5px;">';
			player_no_pub_title += AZ_N+FormPaypal;
			player_no_pub_title += AZ_N+'<input style="border:none;max-height:15px;float:right;margin:-3px 10px 0px 0px;" type="image" name="submit" alt="PayPal!" src="'+IMG_B64_Paypal+'" />';
			player_no_pub_title += AZ_N+'</form>';
			player_no_pub_title += AZ_N+'<br />';
			player_no_pub_title += AZ_N+'<a style="display:none;float:left" id="AZ_DLhtml5" title="'+AZ_LNG.download+'" href="#" download><img alt="Dl" class="AZ_MiniImg" src="'+IMG_B64_Download+'" /></a>';
			player_no_pub_title += AZ_N+'<img src="" id="AZ_zap_See" title="'+AZ_LNG.show_vid+'" alt="&darr;&darr;" class="AZ_MiniImg" style="display:none;" ';
				player_no_pub_title += 'onclick="document.getElementById(\'AZ_Zap_Hr\').style.display=\'none\'; document.getElementById(\'lecteur_allocine\').style.height=\''+GM_getValue('AZ_height')+'px\'; document.getElementById(\'lecteur_allocine_HTML5\').style.height=\''+GM_getValue('AZ_height')+'px\'; document.getElementById(\'lecteur_allocine_DivX\').style.height=\''+GM_getValue('AZ_height')+'px\'; document.getElementById(\'AZ_zap_noSee\').style.display=\'block\'; this.style.display=\'none\';" />';
			player_no_pub_title += AZ_N+'<img src="" id="AZ_zap_noSee" title="'+AZ_LNG.hide_vid+'" alt="&uarr;&uarr;" class="AZ_MiniImg" style="display:block;" ';
				player_no_pub_title += 'onclick="document.getElementById(\'AZ_Zap_Hr\').style.display=\'block\'; document.getElementById(\'lecteur_allocine\').style.height=\'0px\'; document.getElementById(\'lecteur_allocine_HTML5\').style.height=\'0px\'; document.getElementById(\'lecteur_allocine_DivX\').style.height=\'0px\'; document.getElementById(\'AZ_zap_See\').style.display=\'block\'; this.style.display=\'none\';" />';
			player_no_pub_title += AZ_N+'<img alt="'+AZ_LNG.options+'" title="'+AZ_LNG.options+'" class="AZ_MiniImg" onclick="if (document.getElementById(\'AZ_options\').className == \'AZ_Options_Hide\') document.getElementById(\'AZ_options\').className = \'AZ_Options_Show\'; else document.getElementById(\'AZ_options\').className = \'AZ_Options_Hide\';" src="'+IMG_B64_Options+'" />';
		player_no_pub_title += AZ_N+'</div>';
	player_no_pub_title += AZ_N+'<hr id="AZ_Zap_Hr" style="clear:both;display:none;" />';
	player_no_pub_title += AZ_N+'</div>';

var player_no_pub_select = AZ_N+'<span id="spanselectvid"></span>';

var player_no_pub = AZ_N;
	player_no_pub += AZ_N+'<div id="AZ_container">';
		player_no_pub += AZ_N+'<div id="AZ_div_top">&nbsp;</div>';
		player_no_pub += AZ_N+'<div id="lecteur_allocine_AllPlayers">';
			player_no_pub += AZ_N+'<object id="lecteur_allocine" style="display:none;margin:auto;width:'+GM_getValue('AZ_width')+'px;height:'+0.625*GM_getValue('AZ_width')+'px;" type="application/x-shockwave-flash" data="" >';
				player_no_pub += AZ_N+'<param name="menu" value="true" />';
				player_no_pub += AZ_N+'<param name="wmode" value="transparent" />';
				player_no_pub += AZ_N+'<param name="quality" value="high" />';
				player_no_pub += AZ_N+'<param name="allowFullScreen" value="true" />';
				player_no_pub += AZ_N+'<param name="allowScriptAccess" value="always" />';
				player_no_pub += AZ_N+'<param name="flashvars" value="'+AZ_UrlVideoCplt+'" id="flashvars" />';
				player_no_pub += AZ_N+'<p class="AZ_ObjectError" style="line-height:'+GM_getValue('AZ_height')+'px;">'+AZ_LNG.error_vid+'</p>';
			player_no_pub += AZ_N+'</object>';

			player_no_pub += AZ_N+'<div id="lecteur_allocine_DivHTML5">';
				player_no_pub += AZ_N+'<video style="display:none;" onplay="this.className=\'AZ_VideoHTML5 AZ_VideoHTML5_Play\'" class="AZ_VideoHTML5" id="lecteur_allocine_HTML5"></video>';
			player_no_pub += AZ_N+'</div>';

			player_no_pub += AZ_N+'<object class="AZ_VideoHTML5" id="lecteur_allocine_DivX" style="display:none;margin:auto;width:'+GM_getValue('AZ_width')+'px;height:'+0.625*GM_getValue('AZ_width')+'px;" type="video/divx" data="">';
				player_no_pub += AZ_N+'<param name="src" value="" id="lecteur_allocine_DivXSrc" />';
				player_no_pub += AZ_N+'<param name="previewImage" value="" id="lecteur_allocine_PreviewDivX" />';
				player_no_pub += AZ_N+'<param name="movieTitle" value="" id="lecteur_allocine_TitleDivX" />';
				player_no_pub += AZ_N+'<param name="autoPlay" value="'+GM_getValue('AZ_autoplay')+'" />';
				player_no_pub += AZ_N+'<param name="AutoStart" value="'+GM_getValue('AZ_autoplay')+'" />';
				player_no_pub += AZ_N+'<param name="loop" value="false" />';
				player_no_pub += AZ_N+'<param name="custommode" value="none" />';
				player_no_pub += AZ_N+'<param name="wmode" value="transparent" />';
				player_no_pub += AZ_N+'<param name="bannerEnabled" value="false" />';
				player_no_pub += AZ_N+'<param name="minVersion" value="3.4" />';
				player_no_pub += AZ_N+'<param name="pluginspage" value="http://go.divx.com/plugin/download/" />';
				player_no_pub += AZ_N+'<p class="AZ_ObjectError" style="line-height:'+GM_getValue('AZ_height')/2+'px;">';
					player_no_pub += AZ_N+AZ_LNG.error_vid;
					player_no_pub += AZ_N+'<br />';
					player_no_pub += AZ_N+'<a href="http://www.divx.com/software/web-player/features" title="'+AZ_LNG.download+' DivX Web Player" target="_blank">';
						player_no_pub += AZ_N+'<img style="border:none" src="http://labs.divx.com/files/dwp-d-s.gif" alt="'+AZ_LNG.download+' DivX Web Player" />';
					player_no_pub += AZ_N+'</a>';
				player_no_pub += AZ_N+'</p>';
			player_no_pub += AZ_N+'</object>';

			player_no_pub += AZ_N+'<iframe class="AZ_VideoIframe" id="lecteur_allocine_Iframe" style="display:none;margin:auto;width:'+GM_getValue('AZ_width')+'px;height:'+GM_getValue('AZ_height')+'px;" src="" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" allowfullscreen></iframe>';

		player_no_pub += AZ_N+'</div>';
		player_no_pub += AZ_N+'<div id="AZ_div_bottom">&nbsp;</div>';
	player_no_pub += AZ_N+'</div>';

if (getElementsByClassName('colgeneral','div')!='') document.getElementsByClassName('colgeneral')[0].id = 'col_general';
if (getElementsByClassName('mainfooter','div')!='') document.getElementsByClassName('mainfooter')[0].id = 'footer';

	var AZ_SelectOK = false;
	var AZ_CmediasOptionsSelect = '';
	var AZ_OptNames = [];
	var BaliseA = [];
	var BalisesDivBlog = [];
	var CmediaGlobalMulti = [];
	var AZ_ZapId = [];

function AZ_Start()
{
	if (document.getElementById('allocine-player-0'))
	{
		document.getElementById('allocine-player-0').parentNode.parentNode.parentNode.removeAttribute('class');
		document.getElementById('allocine-player-0').parentNode.parentNode.parentNode.removeAttribute('data-model');
		if (!GM_getValue('AZ_posOri'))
		{
			document.getElementsByTagName('body')[0].appendChild(createElement('div',{id:"New_lecteur_Allocine"}, '', ''));
			document.getElementById('allocine-player-0').parentNode.parentNode.parentNode.innerHTML = '';
		}
		else
		{
			document.getElementById('allocine-player-0').parentNode.parentNode.parentNode.innerHTML = '<a class="AZ_Ancre" name="AZ_Play"></a><div id="New_lecteur_Allocine"></div>';
		}
	}
	else if (document.getElementById('content_player'))
	{
		document.getElementById('content_player').parentNode.parentNode.innerHTML = '<a class="AZ_Ancre" name="AZ_Play"></a><div id="New_lecteur_Allocine"></div><div id="V6_player_Old"></div>';
	}
	else if (document.getElementById('col_general'))
	{
		document.getElementById('col_general').appendChild(createElement('a',{class:"AZ_Ancre", name:"AZ_Play"}, '', ''));
		document.getElementById('col_general').appendChild(createElement('div',{id:"New_lecteur_Allocine"}, '', ''));
	}
	else
	{
		document.getElementsByTagName('body')[0].appendChild(createElement('a',{class:"AZ_Ancre", name:"AZ_Play"}, '', ''));
		document.getElementsByTagName('body')[0].appendChild(createElement('div',{id:"New_lecteur_Allocine"}, '', ''));
	}

	document.getElementById('New_lecteur_Allocine').innerHTML = player_no_pub;
	document.getElementById('New_lecteur_Allocine').addEventListener('mousedown', dragHandler, false);

	// Bouton fermeture player
//	document.getElementById('AZ_container').appendChild(createElement('input',{id:"AZ_XcloseButton", type:"button", value:"X"}, 'click AZ_Xclose false', ''));
	document.getElementById('AZ_container').appendChild(createElement('span',{id:"AZ_XcloseTxt", title:""+AZ_LNG.option_close+""}, 'click AZ_Xclose false', 'X'));

	var BalisesTagA = document.getElementsByTagName('a');
	var NbBalisesTagA = BalisesTagA.length;
	//alert(NbBalisesTagA);

if (!AZ_Url_Page.match(/iblogvision/))
{
	for (var i=0; i<NbBalisesTagA ; i++)
	{
		BaliseA[i] = BalisesTagA[i];
		BaliseA[i].removeAttribute('onclick');
		if (BaliseA[i].href.match(/cliccommand/) || BaliseA[i].href.match(/clickcmd/))
		{
			AZ_TransformClicCommand(BaliseA[i].href,i);
		}
		else if (BaliseA[i].href.match(/smart\.allocine\.fr/))
		{
			BaliseA[i].parentNode.removeChild(BaliseA[i]);
		}
		else if (	( BaliseA[i].href.match('cmedia=') || BaliseA[i].href.match(/(video(s)?|trailer|fragman)(-|\/)(\d+)/) )
				&& !BaliseA[i].href.match(/\/secure(.+?)account\//)
				&& !BaliseA[i].innerHTML.match('<img ')
				&& !BaliseA[i].parentNode.className.match('ac_autopromo')
				&& !BaliseA[i].parentNode.className.match('extralinks')
//				&& !BaliseA[i].innerHTML.match(/class="play"/)
				&& !BaliseA[i].href.match(/#(.*?)$/)
			)
		{
			AZ_ZapId[i] = AZ_Cmedia(BaliseA[i].href)+'_'+i;
			BaliseA[i].parentNode.appendChild(createElement('input',{type:"button", id:""+AZ_ZapId[i]+"", value:"Zap", dataseturl_ba:""+BaliseA[i].href+"", title:""+BaliseA[i].innerHTML.replace(/(<([^>]+)>)/ig,'').replace(/(?:^\s+|\s+$)/g, '')+"", class:"AZ_Zap"}, 'click AZ_ZapVideoSpan false'));

			if (BaliseA[i].className=='btn')
			{
				document.getElementById(AZ_ZapId[i]).style.position = 'absolute';
				document.getElementById(AZ_ZapId[i]).style.bottom = '45px';
				document.getElementById(AZ_ZapId[i]).style.right = '20px';
			}
			else if (BaliseA[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
			&& BaliseA[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className != 'carousel_inner'
			&& BaliseA[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className != 'slider')
			{
//				BaliseA[i].parentNode.parentNode.style.backgroundColor = 'rgba(227,231,236,0.75)';
				BaliseA[i].parentNode.parentNode.style.backgroundColor = '';
//				BaliseA[i].parentNode.parentNode.style.position = 'static';
//				BaliseA[i].parentNode.parentNode.style.margin = '20px auto';
//				alert(BaliseA[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className);
			}

			if (BaliseA[i].parentNode.parentNode.parentNode.className.match('tabs_main'))
			{
				document.getElementById(AZ_ZapId[i]).style.position = 'absolute';
				document.getElementById(AZ_ZapId[i]).style.marginTop = '-25px';
				document.getElementById(AZ_ZapId[i]).parentNode.firstChild.style.paddingLeft = '45px';
				document.getElementById(AZ_ZapId[i]).parentNode.firstChild.style.setProperty('font-size', '7px', 'important');
			}
			else if (BaliseA[i].parentNode.className.match('third-nav'))
			{
				var NbBalisesTagA_Nav = BaliseA[i].parentNode.getElementsByTagName('a').length;
				document.getElementById(AZ_ZapId[i]).style.position = 'absolute';
				document.getElementById(AZ_ZapId[i]).style.left = '190px';
				if (NbBalisesTagA_Nav==5)
					document.getElementById(AZ_ZapId[i]).style.left = '300px';
				//document.getElementById(AZ_ZapId[i]).parentNode.firstChild.style.paddingLeft = '45px';
				//document.getElementById(AZ_ZapId[i]).parentNode.firstChild.style.setProperty('font-size', '7px', 'important');
			}
			if (BaliseA[i].href == AZ_Url_Page)
			{
				if (document.getElementById('OldZap'))
				{
					document.getElementById('OldZap').removeAttribute('id');
				}
				iLinkId = i;
				IdBeforeOldZap = BaliseA[i].parentNode.id;
				BaliseA[i].parentNode.id = 'OldZap';
			}

			innerHTML_BaliseA = BaliseA[i].innerHTML.replace(/<(.*?)>/g,'').replace(/(?:^\s+|\s+$)/g, '');

			if (!innerHTML_BaliseA.match(/^(\s)?(Bande-annonce|Tr(a|á)iler|Fragman|Voir la bande-annonce|Ver o trailer|Ver el tráiler|Zum Trailer|Die Reportage ansehen|Fragmanı izle|Voir le teaser)$/))
				AZ_OptNames[i] = innerHTML_BaliseA;
			else
			{
				if (innerHTML_BaliseA.match(/^(\s)?(Bande-annonce|Tr(a|á)iler|Fragman)$/))
					AZ_OptNames[i] = BaliseA[i].parentNode.parentNode.getElementsByTagName('a')[0].innerHTML.replace(/<(.*?)>/g,'').replace(/(?:^\s+|\s+$)/g, '');
				else
					AZ_OptNames[i] = BaliseA[i].parentNode.getElementsByTagName('a')[0].innerHTML.replace(/<(.*?)>/g,'').replace(/(?:^\s+|\s+$)/g, '');

				AZ_OptNames[i] += ' : '+innerHTML_BaliseA;
			}
		}
	}
	AZ_BuildOptionsSelect(GM_getValue('AZ_width'));

	var BalisesTagObject = document.getElementsByTagName('object');
	var NbBalisesTagObject = BalisesTagObject.length;
	for (var i=0; i<NbBalisesTagObject ; i++)
	{
		FindCmedia = '';
		RegexFindCmedia = /cmedia=(\d+)/;
		if (RegexFindCmedia.test(BalisesTagObject[i].innerHTML))
		{
			FindCmedia = RegexFindCmedia.exec(BalisesTagObject[i].innerHTML)[1];
		}
		if (FindCmedia != '' && !window.location.href.match('partner'))
		{
			CmediaGlobalMulti[i+'-TagObject'] = FindCmedia;
			ReplaceOtherPlayerByAZ(i,BalisesTagObject[i].parentNode,520,'auto','TagObject');
		}
/*
		if (BalisesTagObject[i].data.match('blogvision'))
		{
			RegexFindIdFlashvars = /id="flashvars_(\d+)"/;
			if (!RegexFindIdFlashvars.test(BalisesTagObject[i].innerHTML))
			{
				BalisesTagObject[i].innerHTML += '<param name="flashvars" value="'+AZ_UrlVideoCplt+'&autoPlay=false" id="flashvars2_'+i+'" />';
			}
		}
		else if(BalisesTagObject[i].data.match('AcPlayer'))
		{
			RegexFindIdFlashvars = /id="flashvars_(\d+)"/;
			if (!RegexFindIdFlashvars.test(BalisesTagObject[i].innerHTML))
			{
				BalisesTagObject[i].data = 'http://images.allocine.fr/commons/player/AcV4/AcPlayer_v4.4.swf';
				BalisesTagObject[i].getElementsByTagName('param')['flashvars'].value += AZ_UrlVideoCplt+'&autoPlay=false&blog=true';
			}
		}
*/
	}

	var BalisesDivBlog = document.getElementsByTagName('div');
	var NbBalisesDivBlog = BalisesDivBlog.length;
	for (var i=0; i<NbBalisesDivBlog ; i++)
	{
		if (BalisesDivBlog[i] && ( BalisesDivBlog[i].id == 'blogvision' || BalisesDivBlog[i].id == 'player-emergence' || BalisesDivBlog[i].className.match(/challenger(One|Two)/) ) )
		{
			FindCmedia = VersionBlog = '';

			if (BalisesDivBlog[i].className.match(/challenger(One|Two)/))
			{
				FindCmedia = BalisesDivBlog[i].id;
				VersionBlog = 'Challengers'
			}
			BalisesDivBlog[i].id = 'blogvision_'+i;
			RegexFindCmedia1 = /blogvision\/(\d+)"/;
			RegexFindCmedia2 = /cmedia=(\d+)"/;
			if (RegexFindCmedia1.test(document.getElementById(BalisesDivBlog[i].id).innerHTML))
			{
				FindCmedia = RegexFindCmedia1.exec(document.getElementById(BalisesDivBlog[i].id).innerHTML)[1];
			}
			else if (RegexFindCmedia2.test(document.getElementById(BalisesDivBlog[i].id).innerHTML))
			{
				FindCmedia = RegexFindCmedia2.exec(document.getElementById(BalisesDivBlog[i].id).innerHTML)[1];
			}
			if (document.getElementById(BalisesDivBlog[i].id).innerHTML.match('lecteur_allocine')) FindCmedia='';

			//RegexFindStyle = /style="(.+?)"/;
			//FindStyle = RegexFindStyle.exec(document.getElementById('blogvision_'+i).innerHTML)[1];
			if (BalisesDivBlog[i].className == 'player-emergence')
			{
				AZ_DataSetPlayer = BalisesDivBlog[i].dataset.player;
				RegexFindCmediaFooter = /"idMedia":(\d+)/;
				if (RegexFindCmediaFooter.test(AZ_DataSetPlayer))
				{
					FindCmedia = RegexFindCmediaFooter.exec(AZ_DataSetPlayer)[1];
                    VersionBlog = 'Footer';
				}
			}
			if (FindCmedia != '')
			{

				if (VersionBlog == '')
				{
					CmediaGlobalMulti[i+'-TagDiv'] = FindCmedia;
					ReplaceOtherPlayerByAZ(i,document.getElementById(BalisesDivBlog[i].id),520,'auto auto 50px','TagDiv');
				}
				else if (VersionBlog == 'Footer')
				{
					CmediaGlobalMulti[i+'-TagDivFooter'] = FindCmedia;
					ReplaceOtherPlayerByAZ(i,document.getElementById(BalisesDivBlog[i].id),1024,'auto auto 50px','TagDivFooter');
				}
				else
				{
					CmediaGlobalMulti[i+'-'+VersionBlog] = FindCmedia;
					ReplaceOtherPlayerByAZ(i,document.getElementById(BalisesDivBlog[i].id).getElementsByTagName('div')[0],448,'auto',VersionBlog);
					document.getElementById(BalisesDivBlog[i].id).style.transform = 'none';
				}
			}
		}
	}

	var BalisesIframe = document.getElementsByTagName('iframe');
	var NbBalisesIframe = BalisesIframe.length;
	for (var ifr=0; ifr<NbBalisesIframe ; ifr++)
	{
		if (BalisesIframe[ifr] && (BalisesIframe[ifr].src.match('iblogvision') || BalisesIframe[ifr].src.match('partner')) )
		{
			FindCmedia = '';
			RegexFindCmediaIB = /cmedia=(\d+)/;
			RegexFindCmediaP = /partner(.+?)(\d+)/;
			if (RegexFindCmediaIB.test(BalisesIframe[ifr].dataset.url))
			{
				FindCmedia = RegexFindCmediaIB.exec(BalisesIframe[ifr].dataset.url)[1];
			}
			else if (RegexFindCmediaIB.test(BalisesIframe[ifr].src))
			{
				FindCmedia = RegexFindCmediaIB.exec(BalisesIframe[ifr].src)[1];
			}
			else if (RegexFindCmediaP.test(BalisesIframe[ifr].src))
			{
				FindCmedia = RegexFindCmediaP.exec(BalisesIframe[ifr].src)[2];
			}
			if (FindCmedia != '')
			{
//				alert(FindCmedia);
				CmediaGlobalMulti[ifr+'-TagIframe'] = FindCmedia;
				ReplaceOtherPlayerByAZ(ifr,BalisesIframe[ifr].parentNode,520,'auto auto 25px','TagIframe');
			}
		}
	}

/*
	var BalisesFigure = document.getElementsByTagName('figure');
	var NbBalisesFigure = BalisesFigure.length;
	for (var f=0; f<NbBalisesFigure ; f++)
	{
		if (BalisesFigure[f] && BalisesFigure[f].id.match('player'))
		{
			FindCmedia = '';

			RegexFindCmedia = /refMedia(.*?)(\d+)/;
			if (RegexFindCmedia.test(document.getElementById(BalisesFigure[f].id).innerHTML))
			{
				//FindCmedia = RegexFindCmedia.exec(document.getElementById(BalisesFigure[f].id).innerHTML)[2];
			}
			if (FindCmedia != '')
			{
				//CmediaGlobalMulti[f+'-TagFigure'] = FindCmedia;
				//ReplaceOtherPlayerByAZ(f,document.getElementById(BalisesFigure[f].id),520,'auto','TagFigure');
			}
		}
	}
*/
	var BalisesFigure = document.getElementsByTagName('figure');
	var NbBalisesFigure = BalisesFigure.length;
	for (var f=0; f<NbBalisesFigure ; f++)
	{
		if (BalisesFigure[f].className.match('player js-player') || BalisesFigure[f].className.match('player player-auto-play js-player'))
		{
			FindCmedia = '';

			RegexFindCmedia_1 = /"id":(\d+)/;
			RegexFindCmedia_2 = /cmedia=(\d+)/;
			if (RegexFindCmedia_1.test(BalisesFigure[f].dataset.model))
			{
				BalisesFigure[f].className = 'OldOriPlayer';
				FindCmedia = RegexFindCmedia_1.exec(BalisesFigure[f].dataset.model)[1];
				BalisesFigure[f].dataset.model = '';
				BalisesFigure[f].id = 'PlayerJW_'+f;
//				alert(FindCmedia);
			}
			else if (RegexFindCmedia_2.test(BalisesFigure[f].dataset.model))
			{
				BalisesFigure[f].className = '';
				FindCmedia = RegexFindCmedia_2.exec(BalisesFigure[f].dataset.model)[1];
				BalisesFigure[f].dataset.model = '';
				BalisesFigure[f].id = 'PlayerJW_'+f;
//				alert(FindCmedia);
			}
			if (FindCmedia != '')
			{
				CmediaGlobalMulti[f+'-TagFigure'] = FindCmedia;
				ReplaceOtherPlayerByAZ(f,document.getElementById(BalisesFigure[f].id),520,'auto','TagFigure');
			}
		}
	}
	var BalisesAcvideo = document.getElementsByTagName('acvideo');
	var NbBalisesAcvideo = BalisesAcvideo.length;
	for (var ac=0; ac<NbBalisesAcvideo ; ac++)
	{
		if (BalisesAcvideo[ac] && BalisesAcvideo[ac].id.match(/(\d+)/))
		{
			FindCmedia = BalisesAcvideo[ac].id;
			if (FindCmedia != '')
			{
				CmediaGlobalMulti[ac+'-TagAcvideo'] = FindCmedia;
				ReplaceOtherPlayerByAZ(ac,BalisesAcvideo[ac],520,'auto','TagAcvideo');
			}
		}
	}
}
	Player_Format();

	AZ_cmedia = AZ_Cmedia(AZ_Url_Page);
	if (AZ_cmedia!='')
	{
		AZ_ZapVideo(AZ_cmedia);
		if (!AZ_Url_Page.match('/partner/'))
		{
			AZ_TitreVideo(AZ_Url_Page);
		}
		else
			AZ_TitreVideo('http://www.allocine.fr/video/player_gen_cmedia='+AZ_cmedia+'.html');

		document.getElementById('New_lecteur_Allocine').style.display = 'block';
	}

	if (AZ_Url_Page.match('fichefilm_gen_cfilm') || AZ_Url_Page.match('ficheserie_gen_cserie'))
	{
		if (AZ_Url_Page.match('ficheserie_gen_cserie'))
			var TitleAlloCine= document.getElementsByClassName('titlebar_01')[0].getElementsByTagName('meta')[0].content;
		else
			var TitleAlloCine= document.getElementById('content-layout').getElementsByTagName('meta')[0].content;

		TitleAlloCine = TitleAlloCine.replace(/(?:^\s+|\s+$)/g, '').replace(/ \(TV\)$/g, '');
		var TitleAlloCineLink = encodeURIComponent(TitleAlloCine);
		TitleAlloCineLink = TitleAlloCineLink.replace(/%26amp%3B/g, '%26');

		if (getElementsByClassName('ovw-synopsis-info') != '')
		{
			var EltTitreVO = document.getElementsByClassName('ovw-synopsis-info')[0];
			if (EltTitreVO.getElementsByTagName('span')[0].innerHTML.match('Titre original'))
			{
				var TitreVO = EltTitreVO.getElementsByTagName('h2')[0].innerHTML
				TitreVO = TitreVO.replace(/(?:^\s+|\s+$)/g, '').replace(/ \(TV\)$/g, '');
				var TitreVOLink = encodeURIComponent(TitreVO);
				TitreVOLink = TitreVOLink.replace(/%26amp%3B/g, '%26');
			}
		}
		var NewTitleAlloCine = '<div style="font-size:12px;color:#68C42B">SensCritique : ';
		NewTitleAlloCine += '<a style="font-size:12px;text-decoration:underline;" href="http://www.senscritique.com/recherche?query='+TitleAlloCineLink+'&filter='+(AZ_Url_Page.match('fichefilm_gen_cfilm')?'movies':'tvshows')+'" target="_blank">'+TitleAlloCine+'</a>';
		if (TitreVO)
			NewTitleAlloCine += ' - <a style="font-size:12px;text-decoration:underline;" href="http://www.senscritique.com/recherche?query='+TitreVOLink+'&filter='+(AZ_Url_Page.match('fichefilm_gen_cfilm')?'movies':'tvshows')+'" target="_blank">'+TitreVO+'</a>';
		NewTitleAlloCine += '</div>';
		NewTitleAlloCine += '<div style="font-size:12px;color:darkred">IMDb : ';
		NewTitleAlloCine += '<a style="font-size:12px;text-decoration:underline;" href="http://www.imdb.com/find?s=tt&exact=true&q='+TitleAlloCineLink.replace(/%20/g, '+')+'" target="_blank">'+TitleAlloCine+'</a>';
		if (TitreVO)
			NewTitleAlloCine += ' - <a style="font-size:12px;;text-decoration:underline;" href="http://www.imdb.com/find?s=tt&exact=true&q='+TitreVOLink.replace(/%20/g, '+')+'" target="_blank">'+TitreVO+'</a>';
		NewTitleAlloCine += '</div>';
/*		NewTitleAlloCine += '<div style="font-size:12px;color:#0A6277">CineMovies : ';
		NewTitleAlloCine += '<a style="font-size:12px;text-decoration:underline;" href="http://www.cinemovies.fr/rechercher/?q='+TitleAlloCineLink+'&e=m" target="_blank">'+TitleAlloCine+'</a>';
		if (TitreVO)
			NewTitleAlloCine += ' - <a style="font-size:12px;text-decoration:underline;" href="http://www.cinemovies.fr/rechercher/?q='+TitreVOLink+'&e=m" target="_blank">'+TitreVO+'</a>';
		NewTitleAlloCine += '</div>';
*/
		if (AZ_Url_Page.match('ficheserie_gen_cserie'))
			document.getElementsByClassName('titlebar_01')[0].getElementsByTagName('span')[0].innerHTML = TitleAlloCine+NewTitleAlloCine
		else
			document.getElementById('content-layout').getElementsByClassName('titlebar-page')[0].style.setProperty('margin-top','0.5rem');
			document.getElementById('content-layout').getElementsByClassName('titlebar-page')[0].style.setProperty('background','rgba(227,231,236,0.75)');
			document.getElementById('content-layout').getElementsByClassName('titlebar-title-lg')[0].style.setProperty('font-size','1.6rem');
			document.getElementById('content-layout').getElementsByClassName('titlebar')[0].innerHTML += NewTitleAlloCine
	}
	else if (AZ_Url_Page.match(/recherche(.*?)q=/))
	{
		var NewTitleSearch = encodeURIComponent(document.getElementById('q').value.replace(/(?:^\s+|\s+$)/g, ''));
			NewTitleSearch = NewTitleSearch.replace(/%26amp%3B/g, '%26');

		NewTitleSearchEnd = '<a href="http://www.senscritique.com/recherche?query='+NewTitleSearch+'" target="_blank">SensCritique</a>';
		NewTitleSearchEnd += ' - <a href="http://www.imdb.com/find?s=tt&q='+NewTitleSearch.replace(/%20/g, '+')+'" target="_blank">IMDb</a>';
//		NewTitleSearchEnd += ' - <a href="http://www.cinemovies.fr/rechercher/?q='+NewTitleSearch+'" target="_blank">CineMovies</a>';

		if (document.getElementById('title'))
			document.getElementById('title').innerHTML += '<div class="titlebar"><h1>'+document.getElementById('q').value.replace(/(?:^\s+|\s+$)/g, '')+' : '+NewTitleSearchEnd+'</h1></div>';
		else if (document.getElementsByTagName('h1')[0] != undefined && document.getElementsByTagName('h1')[0].innerHTML.match('sur AlloCiné'))
			document.getElementsByTagName('h1')[0].innerHTML += ' - '+NewTitleSearchEnd;
		else
			document.getElementById('col_general').getElementsByClassName('title')[0].innerHTML += ' <br /> '+NewTitleSearchEnd;
	}
	if (document.getElementById('PlayerJW'))
	{
		FindCmedia = '';

		RegexFindCmedia = /refMedia(.*?)(\d+)/;
		if (RegexFindCmedia.test(InnerHtmlPlayerJW))
		{
			FindCmedia = RegexFindCmedia.exec(InnerHtmlPlayerJW)[2];
		}
		if (FindCmedia != '')
		{
			CmediaGlobalMulti['JW1'] = FindCmedia;
			ReplaceOtherPlayerByAZ('JW1',document.getElementById('PlayerJW'),520,'auto','TagJW');
		}
	}
}
function AZ_CleanV6Player(Elt)
{
	if (document.getElementById('V6_player').innerHTML.match(/iframe/)) document.getElementById('V6_player').innerHTML = '';
	else if (typeof Elt === "undefined") setTimeout(AZ_CleanV6Player, 1000);
	//alert('Clean');
}
// CAS PARTICULIER PLAYER JW
if (getElementsByClassName('media-meta large player-container','article')!='')
{
	InnerHtmlPlayerJW = document.getElementsByClassName('media-meta large player-container')[0].innerHTML.replace(/\n/g,'');
	document.getElementsByClassName('media-meta large player-container')[0].id = 'PlayerJW';
	document.getElementsByClassName('media-meta large player-container')[0].className = 'PlayerJW';
	document.getElementById('PlayerJW').innerHTML = '';
}
setTimeout(AZ_Start, 500);


//****************************************************************
//		F O N C T I O N S
//****************************************************************
/*
var incrementer = (function() {
	var i = 0;
	return function() {
		i++;
		return i;
	};
})();
*/
function ReplaceOtherPlayerByAZ(Compteur,EltId,SizeId,MarginId,ParamSup)
{
	ParamTest = ParamSup;
    Compteur = Compteur+'-'+ParamSup;
	if (ParamSup!='Challengers') ParamSup='';

	NewObjectTag = '';

	if (ParamTest == 'TagDivFooter')
		NewObjectTag += '<div style="width:800px; margin:auto">';

	NewObjectTag += '<div id="lecteur_allocine_'+Compteur+'_Title" class="lecteur_allocine_Title">&nbsp;</div>';

	NewObjectTag += AZ_N+'<object id="lecteur_allocine_'+Compteur+'" style="width:100%;height:'+(SizeId/1.6)+'px;margin:auto;" type="application/x-shockwave-flash" data="">';
		NewObjectTag += document.getElementById('lecteur_allocine').innerHTML.replace(/blog=false/g,'blog=true').replace(/autoPlay=true/g,'autoPlay=false').replace(/autoplay=true/g,'autoplay=false').replace('id="flashvars"','id="flashvars_'+Compteur+'"');
	NewObjectTag += '</object>';

	NewObjectTag += AZ_N+'<video onplay="this.className=\'AZ_VideoHTML5 AZ_VideoHTML5_Play\'" class="AZ_VideoHTML5" id="lecteur_allocine_'+Compteur+'_HTML5" style="width:100%;height:'+(SizeId/1.6)+'px"';
		NewObjectTag += ' src="" poster="'+IMG_B64_Empty+'" preload="none" controls="controls"';
	NewObjectTag += AZ_N+'></video>';

	NewObjectTag += AZ_N+'<object class="AZ_VideoHTML5" id="lecteur_allocine_'+Compteur+'_DivX" style="margin:auto;width:100%;height:'+(SizeId/1.6)+'px;z-index:0" type="video/divx" data="">';
		NewObjectTag += document.getElementById('lecteur_allocine_DivX').innerHTML.replace(/value="true"/g,'value="false"').replace(/lecteur_allocine/g,'lecteur_allocine_'+Compteur).replace(/line-height:(\d+)px/,'line-height:'+Math.round(SizeId/3.2)+'px');
	NewObjectTag += AZ_N+'</object>';

	NewObjectTag += AZ_N+'<iframe class="AZ_VideoIframe" id="lecteur_allocine_'+Compteur+'_Iframe" style="margin:auto;width:100% !important;height:'+(SizeId/1.6)+'px !important" src="" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" allowfullscreen></iframe>';

	NewObjectTag += AZ_N+'<div id="AZ_QuickPlayerChoice_'+Compteur+'" class="AZ_QuickPlayerChoice'+ParamSup+'"></div>';

	if (ParamTest=='TagDiv' && EltId.getElementsByTagName('a')[0])
		NewObjectTag += '<div style="text-align:center;"><a href="'+EltId.getElementsByTagName('a')[0].href+'">'+EltId.getElementsByTagName('a')[0].innerHTML+'</a></div>';

	if (ParamTest == 'TagDivFooter')
		NewObjectTag += '</div>';

	if (EltId.parentNode.parentNode.className.match('richTextPlayer')) EltId.parentNode.parentNode.className='';
	if (EltId.parentNode.className.match('richTextPlayer')) EltId.parentNode.className='';
	if (EltId.className.match('richTextPlayer')) EltId.className='';
	EltId.style.setProperty('clear', 'both');
	EltId.style.setProperty('text-align', 'left');
	EltId.style.setProperty('margin', MarginId);
	EltId.style.setProperty('width', SizeId+'px', 'important');
	EltId.style.setProperty('height', (SizeId/1.6)+'px', 'important');

	if (ParamTest == 'TagDivFooter')
		EltId.innerHTML = '<div class="titlebar-title titlebar-title-lg titlebar-top-border titlebar-page">Ça sort la semaine prochaine !</div>'+NewObjectTag;
	else
		EltId.innerHTML = NewObjectTag;

	EltId.outerHTML = EltId.outerHTML.replace(/acvideo/g,'div');

	AZ_ZapVideo(FindCmedia,'lecteur_allocine_'+Compteur)

	document.getElementById('AZ_QuickPlayerChoice_'+Compteur).appendChild(createElement('span',{id:"AZ_QuickPlayerBlog_"+Compteur+"", title:""+AZ_LNG.player+" Blog", class:"AZ_Link"}, 'click AZ_QuickPlayerChoice false', 'Blog'));
	document.getElementById('AZ_QuickPlayerChoice_'+Compteur).appendChild(createElement('span',{id:"AZ_QuickPlayerNormal_"+Compteur+"", title:""+AZ_LNG.player+" Normal", class:"AZ_Link"}, 'click AZ_QuickPlayerChoice false', 'Normal'));
	document.getElementById('AZ_QuickPlayerChoice_'+Compteur).appendChild(createElement('span',{id:"AZ_QuickPlayerHTML5_"+Compteur+"", title:""+AZ_LNG.player+" "+AZ_Quality+" HTML 5", class:"AZ_Link"}, 'click AZ_QuickPlayerChoice false', 'HTML5'));
//	document.getElementById('AZ_QuickPlayerChoice_'+Compteur).appendChild(createElement('span',{id:"AZ_QuickPlayerDX_"+Compteur+"", title:""+AZ_LNG.player+" "+AZ_Quality+" DivX", class:"AZ_Link"}, 'click AZ_QuickPlayerChoice false', 'DivX'));

}
function Player_Format(evt)
{
	if (document.getElementById('AZ_select_video')) AZ_SelectOK = true;
	if (AZ_SelectOK) AZ_ValueSelect = document.getElementById('AZ_select_video').value;

	document.getElementById('AZ_div_bottom').appendChild(createElement('span',{id:"AZ_QuickPlayerChoice"}, '', ''));
	document.getElementById('AZ_div_bottom').appendChild(createElement('span',{id:"spanselectvid"} , '', ''));
	if (AZ_Quality!='HDF')
		document.getElementById('AZ_div_bottom').appendChild(createElement('span',{id:"AZ_QualityHTML5", class:"AZ_QualityHTML5", title:""+AZ_LNG.quality.split('|')[0]+""}));
	else
		document.getElementById('AZ_div_bottom').appendChild(createElement('span',{id:"AZ_QualityHTML5", class:"AZ_QualityHTML5", title:""+AZ_LNG.quality.split('|')[0]+"", datasetnbplay:""}, 'click AZ_ForceLoadHD false'));
	if (AZ_CmediasOptionsSelect != '')
	{
		document.getElementById('spanselectvid').appendChild(createElement('select',{id:"AZ_select_video", style:"font-size:10px;"}, 'change AZ_ZapVideoSelect false', AZ_CmediasOptionsSelect));
		if (AZ_SelectOK) document.getElementById('AZ_select_video').value = AZ_ValueSelect;
	}

	document.getElementById('AZ_div_bottom').appendChild(createElement('img',{title:"Synopsis", class:"AZ_MiniImg", style:"margin-top:4px", src:""+IMG_B64_Synopsis+""}, 'click AZ_ShowHide_Synopsis false'));
	document.getElementById('AZ_div_bottom').appendChild(createElement('hr',{id:"AZ_Synopsis_Hr", style:"display:none;clear:both;"}, '', ''));
	document.getElementById('AZ_div_bottom').appendChild(createElement('div',{id:"AZ_Synopsis"}, '', ''));
	if (GM_getValue('AZ_relVid')!='off')
	{
		document.getElementById('AZ_div_bottom').appendChild(createElement('div',{id:"AZ_RelatedVideosT", style:"display:"+GM_getValue('AZ_relVid')+";clear:both;font-weight:bold;font-variant:small-caps;"}, '', '<hr />'+AZ_LNG.related_vid+' :<hr style="border-style:none none dashed" />'));
		document.getElementById('AZ_div_bottom').appendChild(createElement('aside',{id:"AZ_RelatedVideosL", style:"display:"+GM_getValue('AZ_relVid')+""}, '', ''));
	}
	document.getElementById('AZ_QuickPlayerChoice').appendChild(createElement('span',{id:"AZ_QuickPlayerBlog", title:""+AZ_LNG.player+" Blog", class:"AZ_Link"}, 'click AZ_QuickPlayerChoice false', 'Bg'));
	document.getElementById('AZ_QuickPlayerChoice').appendChild(createElement('span',{id:"AZ_QuickPlayerNormal", title:""+AZ_LNG.player+" Normal", class:"AZ_Link"}, 'click AZ_QuickPlayerChoice false', 'Nl'));
	document.getElementById('AZ_QuickPlayerChoice').appendChild(createElement('span',{id:"AZ_QuickPlayerHTML5", title:""+AZ_LNG.player+" "+AZ_Quality+" HTML 5", class:"AZ_Link"}, 'click AZ_QuickPlayerChoice false', 'H5'));
//	document.getElementById('AZ_QuickPlayerChoice').appendChild(createElement('span',{id:"AZ_QuickPlayerDX", title:""+AZ_LNG.player+" "+AZ_Quality+" DivX", class:"AZ_Link"}, 'click AZ_QuickPlayerChoice false', 'DX'));
	if (GM_getValue('AZ_relVid')!='off')
		document.getElementById('AZ_QuickPlayerChoice').appendChild(createElement('img',{title:""+AZ_LNG.related_vid+"", style:"vertical-align:middle;cursor:pointer;", src:""+IMG_B64_Related+""}, 'click AZ_ShowHide_RelatedVideos false'));

	document.getElementById('AZ_div_top').innerHTML = Choice_options + player_no_pub_title;

	header_AZ = '<option'+(GM_getValue('AZ_header')=='fixed' ? ' selected="selected"':'')+' value="fixed">'+AZ_LNG.header_fixed+'</option>';
	header_AZ += '<option'+(GM_getValue('AZ_header')=='normal' ? ' selected="selected"':'')+' value="normal">'+AZ_LNG.header_normal+'</option>';
	header_AZ += '<option'+(GM_getValue('AZ_header')=='default' ? ' selected="selected"':'')+' value="default">'+AZ_LNG.bydefault+'</option>';
	//document.getElementById('AZ_LinkHeader').appendChild(createElement('select',{id:"AZ_Header", style:"width:100px;"}, 'change Header_Options false', header_AZ));

	zap_AZ = '<option'+(GM_getValue('AZ_zap') ? ' selected="selected"':'')+' value="On">'+AZ_LNG.on+'</option>';
	zap_AZ += '<option'+(!GM_getValue('AZ_zap') ? ' selected="selected"':'')+' value="Off">'+AZ_LNG.off+'</option>';
	document.getElementById('AZ_LinkZap').appendChild(createElement('select',{id:"AZ_zap", style:"width:100px;"}, 'change Zap_Options false', zap_AZ));

	IconsColor_AZ = '<option style="background:#028CD7" value="#028CD7">'+AZ_LNG.OptIcons.split('|')[1]+'</option>';
	IconsColor_AZ += '<option style="background:#CE1C2A"'+(GM_getValue('AZ_IconsColor')== '#CE1C2A' ? ' selected="selected"':'')+' value="#CE1C2A">'+AZ_LNG.OptIcons.split('|')[2]+'</option>';
	IconsColor_AZ += '<option style="background:#8EC454"'+(GM_getValue('AZ_IconsColor')== '#8EC454' ? ' selected="selected"':'')+' value="#8EC454">'+AZ_LNG.OptIcons.split('|')[3]+'</option>';
	IconsColor_AZ += '<option style="background:#FFB512"'+(GM_getValue('AZ_IconsColor')== '#FFB512' ? ' selected="selected"':'')+' value="#FFB512">'+AZ_LNG.OptIcons.split('|')[4]+'</option>';
	document.getElementById('AZ_IconsColor').appendChild(createElement('select',{id:"AZ_select_icons_color", style:"width:100px;background:"+GM_getValue('AZ_IconsColor')+";"}, 'change IconsColor_Options false', IconsColor_AZ));

	border_AZ = '';
	for (var i_border=0; i_border<=12; i_border+=2)
		border_AZ += '<option'+(GM_getValue('AZ_border')==i_border+'px' ? ' selected="selected"':'')+' value="'+i_border+'px">'+i_border+'px</option>';
	document.getElementById('AZ_LinkBorder').appendChild(createElement('select',{id:"AZ_border", style:"width:100px;"}, 'change Border_Options false', border_AZ));

	autoplay_AZ = '<option'+(GM_getValue('AZ_autoplay') ? ' selected="selected"':'')+' value="On">'+AZ_LNG.on+'</option>';
	autoplay_AZ += '<option'+(!GM_getValue('AZ_autoplay') ? ' selected="selected"':'')+' value="Off">'+AZ_LNG.off+'</option>';
	document.getElementById('AZ_LinkAutoplay').appendChild(createElement('select',{id:"AZ_autoplay", style:"width:100px;"}, 'change Autoplay_Options false', autoplay_AZ));

	Size_AZ = '<option'+(GM_getValue('AZ_width')==288 ? ' selected="selected"':'')+' value="288x180">288x180</option>';
	Size_AZ += '<option'+(GM_getValue('AZ_width')==320 ? ' selected="selected"':'')+' value="320x200">320x200</option>';
	Size_AZ += '<option'+(GM_getValue('AZ_width')==400 ? ' selected="selected"':'')+' value="400x250">400x250</option>';
	Size_AZ += '<option'+(GM_getValue('AZ_width')==480 ? ' selected="selected"':'')+' value="480x300">480x300</option>';
	Size_AZ += '<option'+(GM_getValue('AZ_width')==560 ? ' selected="selected"':'')+' value="560x350">560x350</option>';
	Size_AZ += '<option'+(GM_getValue('AZ_width')==640 ? ' selected="selected"':'')+' value="640x400">640x400</option>';
	Size_AZ += '<option'+(GM_getValue('AZ_width')==800 ? ' selected="selected"':'')+' value="800x500">800x500</option>';
	Size_AZ += '<option'+(GM_getValue('AZ_width')==960 ? ' selected="selected"':'')+' value="960x600">960x600</option>';
	//Size_AZ += '<option'+(GM_getValue('AZ_width')==1120 ? ' selected="selected"':'')+' value="1120x700">1120x700</option>';
	//Size_AZ += '<option'+(GM_getValue('AZ_width')==1280 ? ' selected="selected"':'')+' value="1280x800">1280x800</option>';
	//Size_AZ += '<option'+(GM_getValue('AZ_width')==1440 ? ' selected="selected"':'')+' value="1440x900">1440x900</option>';
	//Size_AZ += '<option'+(GM_getValue('AZ_width')==1600 ? ' selected="selected"':'')+' value="1600x1000">1600x1000</option>';
	document.getElementById('AZ_size').appendChild(createElement('select',{id:"AZ_select_size", style:"width:100px;"}, 'change Size_Options false', Size_AZ));

	RelatedVideos_AZ = '<option value="block">'+AZ_LNG.on+' ('+AZ_LNG.show+')</option>';
	RelatedVideos_AZ += '<option'+(GM_getValue('AZ_relVid')== 'none' ? ' selected="selected"':'')+' value="none">'+AZ_LNG.on+' ('+AZ_LNG.hide+')</option>';
	RelatedVideos_AZ += '<option'+(GM_getValue('AZ_relVid')== 'off' ? ' selected="selected"':'')+' value="off">'+AZ_LNG.off+'</option>';
	document.getElementById('AZ_LinkRelatedVideos').appendChild(createElement('select',{id:"AZ_select_related_videos", style:"width:100px;"}, 'change RelatedVideos_Options false', RelatedVideos_AZ));

	ChoixLecteur_AZ = '<option value="true">Blog (LD)</option>';
	ChoixLecteur_AZ += '<option'+(GM_getValue('AZ_choix_lecteur')== 'false' ? ' selected="selected"':'')+' value="false">Normal</option>';
	ChoixLecteur_AZ += '<option'+(GM_getValue('AZ_choix_lecteur')== 'html5' ? ' selected="selected"':'')+' value="html5">HTML5</option>';
//	ChoixLecteur_AZ += '<option'+(GM_getValue('AZ_choix_lecteur')== 'divx' ? ' selected="selected"':'')+' value="divx">DivX</option>';
	document.getElementById('AZ_choix_lecteur').appendChild(createElement('select',{id:"AZ_select_choix_lecteur", style:"width:100px;"}, 'change ChoixLecteur_Options false', ChoixLecteur_AZ));

	if (!window.location.host.match(/filmstarts/))
	{
		Quality_AZ = '<option value="HD">'+AZ_LNG.quality.split('|')[1]+':HD</option>';
		Quality_AZ += '<option'+(GM_getValue('AZ_quality')== 'MD' ? ' selected="selected"':'')+' value="MD">'+AZ_LNG.quality.split('|')[2]+':MD</option>';
	}
	else
	{
		Quality_AZ = '<option value="HD">'+AZ_LNG.quality.split('|')[1]+':HD (Auto)</option>';
		Quality_AZ += '<option'+(GM_getValue('AZ_quality')== 'HDF' ? ' selected="selected"':'')+' value="HDF">'+AZ_LNG.quality.split('|')[1]+':HD (Forced)</option>';
		Quality_AZ += '<option'+(GM_getValue('AZ_quality')== 'MD' ? ' selected="selected"':'')+' value="MD">'+AZ_LNG.quality.split('|')[2]+':MD</option>';
		Quality_AZ += '<option'+(GM_getValue('AZ_quality')== 'LD' ? ' selected="selected"':'')+' value="LD">'+AZ_LNG.quality.split('|')[3]+':LD</option>';
	}
	document.getElementById('AZ_Quality').appendChild(createElement('select',{id:"AZ_select_quality", style:"width:100px;"}, 'change Quality_Options false', Quality_AZ));

	posOri_AZ = '<option'+(GM_getValue('AZ_posOri') ? ' selected="selected"':'')+' value="true" disabled="disabled">'+AZ_LNG.OptOriginal+'</option>';
	posOri_AZ += '<option'+(!GM_getValue('AZ_posOri') ? ' selected="selected"':'')+' value="false">'+AZ_LNG.OptFloat+'</option>';
	//document.getElementById('AZ_LinkPosOri').appendChild(createElement('select',{id:"AZ_posOri", style:"width:100px;"}, 'change PosOri_Options false', posOri_AZ));

	document.getElementById('AZ_LinkColor').appendChild(createElement('input',{id:"AZ_Color", value:""+AZ_LNG.OptColor+"", type:"button", class:"AZ_buttonOpt"}, 'click Colors_Options false'));
	document.getElementById('AZ_LinkBgColor').appendChild(createElement('input',{id:"AZ_BgColor", value:""+AZ_LNG.OptBgcolor+"", type:"button", class:"AZ_buttonOpt"}, 'click Colors_Options false'));

	document.getElementById('AZ_zap_See').src = IMG_B64_ArrowGreen;
	document.getElementById('AZ_zap_noSee').src = IMG_B64_ArrowRed;

	document.getElementById('AZ_AllDivColors').appendChild(createElement('div',{id:"AZ_DivBgColor", style:"display:none;"}, '', AZ_WebColors));
	document.getElementById('AZ_AllDivColors').appendChild(createElement('div',{id:"AZ_DivColor", style:"display:none;"}, '', AZ_WebColors.replace(AZ_LNG.OptBgcolor,AZ_LNG.OptColor).replace(/TDBg_/g,'TD_')));
	for (var AZ_red=0; AZ_red<AZ_WebColorsCount; AZ_red++)
	{
		for (AZ_green=0; AZ_green<AZ_WebColorsCount; AZ_green++)
		{
			for (var AZ_blue=0; AZ_blue<AZ_WebColorsCount; AZ_blue++)
			{
				var AZ_colorvalue =  AZ_WebColorsHexaColor[AZ_red] + AZ_WebColorsHexaColor[AZ_red] + AZ_WebColorsHexaColor[AZ_green] + AZ_WebColorsHexaColor[AZ_green] + AZ_WebColorsHexaColor[AZ_blue] + AZ_WebColorsHexaColor[AZ_blue];
				var AZ_color = '#' + AZ_colorvalue;
				document.getElementById('TDBg_'+AZ_colorvalue).appendChild(createElement('button',{id:"BgColorSelected_"+AZ_colorvalue+"", value:""+AZ_color+"", title:""+AZ_color+"", style:"color:"+(AZ_green<3 ? "#FFF":"#000")+";background-color:"+AZ_color+""}, 'click ChoiceColors false', ''));
				document.getElementById('TD_'+AZ_colorvalue).appendChild(createElement('button',{id:"ColorSelected_"+AZ_colorvalue+"", value:""+AZ_color+"", title:""+AZ_color+"", style:"color:"+(AZ_green<3 ? "#FFF":"#000")+";background-color:"+AZ_color+""}, 'click ChoiceColors false', ''));
			}
		}
	}
	for (var AZ_icolor=0; AZ_icolor<AZ_ColorSup.length; AZ_icolor++)
	{
		document.getElementById('TDBg_'+AZ_ColorSup[AZ_icolor].substr(1)).appendChild(createElement('button',{id:"BgColorSelected_"+AZ_ColorSup[AZ_icolor].substr(1)+"", value:""+AZ_ColorSup[AZ_icolor]+"", title:""+AZ_ColorSup[AZ_icolor]+"", style:"color:"+(AZ_icolor<5 ? "#000":"#FFF")+";background-color:"+AZ_ColorSup[AZ_icolor]+""}, 'click ChoiceColors false', ''));
		document.getElementById('TD_'+AZ_ColorSup[AZ_icolor].substr(1)).appendChild(createElement('button',{id:"ColorSelected_"+AZ_ColorSup[AZ_icolor].substr(1)+"", value:""+AZ_ColorSup[AZ_icolor]+"", title:""+AZ_ColorSup[AZ_icolor]+"", style:"color:"+(AZ_icolor<5 ? "#000":"#FFF")+";background-color:"+AZ_ColorSup[AZ_icolor]+""}, 'click ChoiceColors false', ''));
	}

	if (document.getElementById('ColorSelected_'+zapColor.substr(1)))
		document.getElementById('ColorSelected_'+zapColor.substr(1)).innerHTML = '&curren;';
	if (document.getElementById('BgColorSelected_'+zapBgColor.substr(1)))
		document.getElementById('BgColorSelected_'+zapBgColor.substr(1)).innerHTML = '&curren;';
	document.getElementById('AZ_AllDivColors').appendChild(createElement('input',{id:"AZ_LoadColors", class:"AZ_button", type:"button", value:"OK"}, 'click LoadColors false', ''));
	document.getElementById('AZ_AllDivColors').appendChild(createElement('input',{id:"AZ_defaultColors", class:"AZ_button", type:"button", value:""+AZ_LNG.bydefault+""}, 'click LoadColors false', ''));
	document.getElementById('AZ_AllDivColors').appendChild(createElement('input',{id:"AZ_CancelColors", class:"AZ_button", type:"button", value:"X"}, 'click LoadColors false', ''));
	document.getElementById('AZ_AllDivColors').appendChild(createElement('hr'));
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function Header_Options(evt)
{
	GM_setValue('AZ_header', this.options[this.selectedIndex].value);
	document.location.reload(false);
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function Zap_Options(evt)
{
	if (this.options[this.selectedIndex].value == 'On')
	{
		GM_setValue('AZ_zap', true);
		ZapDisplay = 'block';
	}
	else
	{
		GM_setValue('AZ_zap', false);
		ZapDisplay = 'none';
	}
	for (var i=0; i<getElementsByClassName('AZ_Zap').length; i++)
		document.getElementsByClassName('AZ_Zap')[i].style.display = ZapDisplay;
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function IconsColor_Options(evt)
{
	GM_setValue('AZ_IconsColor', this.options[this.selectedIndex].value);
	document.getElementById('AZ_select_icons_color').style.background = this.options[this.selectedIndex].value;
	document.location.reload(false);
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function Border_Options(evt)
{
	GM_setValue('AZ_border', this.options[this.selectedIndex].value);
	document.location.reload(false);
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function Autoplay_Options(evt)
{
	if (this.options[this.selectedIndex].value == 'On')
		GM_setValue('AZ_autoplay', true);
	else
		GM_setValue('AZ_autoplay', false);

	document.location.reload(false);

}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function Size_Options(evt)
{
	Width_AZ = parseInt(this.options[this.selectedIndex].value.split('x')[0]);
	Height_AZ = parseInt(this.options[this.selectedIndex].value.split('x')[1]);
	document.getElementById('AZ_options').style.width	= Width_AZ+'px';
	document.getElementById('AZ_Synopsis').style.width	= (Width_AZ-10)+'px';
	document.getElementById('AZ_RelatedVideosL').style.width	= (Width_AZ-20)+'px';

	for (var key=0; key < AZ_TypePlayer.length; key++)
	{
		document.getElementById('lecteur_allocine'+AZ_TypePlayer[key]).style.width					= Width_AZ+'px';
		if (document.getElementById('lecteur_allocine'+AZ_TypePlayer[key]).style.height != '0px')
			document.getElementById('lecteur_allocine'+AZ_TypePlayer[key]).style.height				= Height_AZ+'px';
	}
	if (document.getElementById('lecteur_allocine_Iframe').src!='' && document.getElementById('lecteur_allocine_Iframe').src.match('player.ina.fr'))
	{
		document.getElementById('lecteur_allocine_Iframe').src = document.getElementById('lecteur_allocine_Iframe').src.replace(GM_getValue('AZ_width')+'/'+GM_getValue('AZ_height'),Width_AZ+'/'+Height_AZ);
	}

	GM_setValue('AZ_width', Width_AZ);
	GM_setValue('AZ_height', Height_AZ);
	document.getElementById('AZ_zap_See').setAttribute('onclick',"document.getElementById('AZ_Zap_Hr').style.display='none';  document.getElementById('lecteur_allocine').style.height='"+Height_AZ+"px'; document.getElementById('lecteur_allocine_HTML5').style.height='"+Height_AZ+"px'; document.getElementById('lecteur_allocine_DivX').style.height='"+Height_AZ+"px'; document.getElementById('AZ_zap_noSee').style.display='block'; this.style.display='none'");
	AZ_BuildOptionsSelect(Width_AZ);

	if (document.getElementById('AZ_LinkUrlVideo'))
		AZ_TitreVideo(document.getElementById('AZ_LinkUrlVideo').href);
	else
		AZ_TitreVideo(window.location.href);
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function RelatedVideos_Options(evt)
{
	GM_setValue('AZ_relVid', this.options[this.selectedIndex].value);
	document.location.reload(false);
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function ChoixLecteur_Options(evt)
{
	GM_setValue('AZ_choix_lecteur', this.options[this.selectedIndex].value);
	if (typeof CmediaGlobal === "undefined")	document.location.reload(false);
	else										AZ_ZapVideo(CmediaGlobal);
	//document.location.reload(false);
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function Quality_Options(evt)
{
	GM_setValue('AZ_quality', this.options[this.selectedIndex].value);
	document.location.reload(false);
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function PosOri_Options(evt)
{
	if (evt == 'EnCours')
	{
		posOriEnCours = true;
		document.getElementById('AZ_select_size').disabled = 'disabled';
		document.getElementById('AZ_select_size').getElementsByTagName('option')[4].selected = 'selected';
		document.getElementById('New_lecteur_Allocine').removeEventListener('mousedown', dragHandler, false);
		document.getElementById('New_lecteur_Allocine').style.position = 'static';
		document.getElementById('New_lecteur_Allocine').style.cursor = 'default';
		document.getElementById('New_lecteur_Allocine').style.width = '560px';
		document.getElementById('AZ_options').style.width = '560px';
		document.getElementById('AZ_zap_noSee').style.display = 'none';
		document.getElementById('AZ_container').style.zIndex = 1000;
		document.getElementById('AZ_container').style.width = '560px';
		document.getElementById('AZ_XcloseTxt').style.display = 'none';

		for (var key=0; key < AZ_TypePlayer.length; key++)
		{
			document.getElementById('lecteur_allocine'+AZ_TypePlayer[key]).style.width = '560px';
			document.getElementById('lecteur_allocine'+AZ_TypePlayer[key]).style.height = '350px';
		}
		if (document.getElementById('lecteur_allocine_Iframe').src.match('player.ina.fr'))
			document.getElementById('lecteur_allocine_Iframe').src = document.getElementById('lecteur_allocine_Iframe').src.replace(GM_getValue('AZ_width')+'/'+GM_getValue('AZ_height'),'560/350');

		document.getElementById('AZ_Synopsis').style.width = '545px';
		if (document.getElementById('AZ_select_video'))
		{
			var SelectOptionTmp = document.getElementById('AZ_select_video').selectedIndex;
			AZ_BuildOptionsSelect(560);
			document.getElementById('AZ_select_video').options[SelectOptionTmp].selected = 'selected';
		}
		if (urlReferer != AZ_Url_Page && !AZ_Url_Page.match('#AZ_Play'))
			window.location.href = AZ_Url_Page+'#AZ_Play';
		else if (AZ_Url_Page.match('#AZ_Play'))
			window.location.href = AZ_Url_Page;
	}
	else
	{
		if (this.options[this.selectedIndex].value == 'true')
			GM_setValue('AZ_posOri', true);
		else
			GM_setValue('AZ_posOri', false);

		document.location.reload(false);
	}
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function Colors_Options(evt)
{
	var IdDiv = this.id.replace('AZ_','');
	if (IdDiv == 'BgColor' )	document.getElementById('AZ_DivColor').style.display = 'none';
	else if (IdDiv == 'Color' )	document.getElementById('AZ_DivBgColor').style.display = 'none';
	if (document.getElementById('AZ_Div'+IdDiv).style.display == 'none')
	{
		document.getElementById('AZ_AllDivColors').style.display = 'block';
		document.getElementById('AZ_Div'+IdDiv).style.display = 'block';
//		document.getElementById('AZ_options').style.minWidth = '440px';
	}
	else
	{
		document.getElementById('AZ_AllDivColors').style.display = 'none';
		document.getElementById('AZ_Div'+IdDiv).style.display = 'none';
//		document.getElementById('AZ_options').style.minWidth = '0px';
	}
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function ChoiceColors(evt)
{
	if (this.id.match('BgColorSelected'))
	{
		if (document.getElementById('BgColorSelected_'+BgColorSelected))
			document.getElementById('BgColorSelected_'+BgColorSelected).innerHTML = '';
		document.getElementById('AZ_container').style.setProperty('background-color',this.value, 'important');
		BgColorSelected = this.id.substr(16);
		document.getElementById(this.id).innerHTML = '&curren;';
	}
	else
	{
		if (document.getElementById('ColorSelected_'+ColorSelected))
			document.getElementById('ColorSelected_'+ColorSelected).innerHTML = '';
		ColorSelected = this.id.substr(14);
		document.getElementById('AZ_container').style.color=this.value;
		document.getElementById(this.id).innerHTML = '&curren;';
	}
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function LoadColors(evt)
{
	ReloaD = true;
	if (this.id == 'AZ_LoadColors' || this.id == 'AZ_CancelColors')
	{
		AZ_NewColor = zapColor;
		AZ_NewBgColor = zapBgColor;
		if (this.id == 'AZ_LoadColors')
		{
			if (document.getElementById('AZ_container').style.color!='')
				AZ_NewColor = RGBToHex(document.getElementById('AZ_container').style.color);
			if (document.getElementById('AZ_container').style.backgroundColor!='')
				AZ_NewBgColor = RGBToHex(document.getElementById('AZ_container').style.backgroundColor);
		}
		else ReloaD = false;
	}
	else
	{
		var AZ_NewColor = '#000000';
		var AZ_NewBgColor = '#FFD515';
	}

	if (document.getElementById('ColorSelected_'+ColorSelected))
		document.getElementById('ColorSelected_'+ColorSelected).innerHTML = '';
	if (document.getElementById('ColorSelected_'+AZ_NewColor.substr(1)))
		document.getElementById('ColorSelected_'+AZ_NewColor.substr(1)).innerHTML = '&curren;';
	if (document.getElementById('BgColorSelected_'+BgColorSelected))
		document.getElementById('BgColorSelected_'+BgColorSelected).innerHTML = '';
	if (document.getElementById('BgColorSelected_'+AZ_NewBgColor.substr(1)))
		document.getElementById('BgColorSelected_'+AZ_NewBgColor.substr(1)).innerHTML = '&curren;';

	ColorSelected = AZ_NewColor.substr(1);
	BgColorSelected = AZ_NewBgColor.substr(1);

	document.getElementById('AZ_container').style.color = AZ_NewColor;
	document.getElementById('AZ_container').style.backgroundColor = AZ_NewBgColor;
	GM_setValue('AZ_Color', AZ_NewColor);
	GM_setValue('AZ_BgColor', AZ_NewBgColor);

	document.getElementById('AZ_AllDivColors').style.display = 'none';
	document.getElementById('AZ_DivBgColor').style.display = 'none';
	document.getElementById('AZ_DivColor').style.display = 'none';
	document.getElementById('AZ_options').style.minWidth = '0px'

	if (ReloaD)
		if (confirm(AZ_LNG.options_reload))
			window.location.reload(false);
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function RGBToHex(ColorString)
{
	HexDigits = "0123456789ABCDEF";
	if (ColorString.charAt(0) == '#')	return ColorString;
	else
	{
		ColorString = ColorString.substr(4);
		pos = ColorString.indexOf(',');
		Result = '#' + HexDigits.substr(Math.floor(ColorString.substr(0, pos) / 16), 1) + HexDigits.substr(ColorString.substr(0, pos) % 16, 1);
		ColorString = ColorString.substr(pos + 1);
		pos = ColorString.indexOf(',');
		Result = Result + HexDigits.substr(Math.floor(ColorString.substr(0, pos) / 16), 1) + HexDigits.substr(ColorString.substr(0, pos) % 16, 1);
		ColorString = ColorString.substr(pos + 1);
		pos = ColorString.length - 1;
		Result = Result + HexDigits.substr(Math.floor(ColorString.substr(0, pos) / 16), 1) + HexDigits.substr(ColorString.substr(0, pos) % 16, 1);
		return Result;
	}
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_reset_pos(evt)
{
	GM_setValue('AZ_Top', AZ_TLBR);
	GM_setValue('AZ_Left', AZ_TLBR);
	GM_setValue('AZ_width', 480);
	GM_setValue('AZ_height', 300);
	GM_setValue('AZ_posOri', false);
	document.location.reload(false);
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_Login(evt)
{
	if (document.getElementById('header-account'))
		var AZ_ConnectMember = document.getElementById('header-account');
	else if (document.getElementById('header__account'))
		var AZ_ConnectMember = document.getElementById('header__account');

	if (!GM_getValue('AZ_MonAlloCine'))
	{
		GM_setValue('AZ_MonAlloCine', true);
		AZ_ConnectMember.style.display = 'block';
	}
	else
	{
//		try {GM_deleteValue('AZ_MonAlloCine');} catch(Err){GM_setValue('AZ_MonAlloCine', false);};
		GM_setValue('AZ_MonAlloCine', false);
		AZ_ConnectMember.style.display = 'none';
	}
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_Footer(evt)
{
	if (document.getElementById('main-footer'))
		var MainFooter = document.getElementById('main-footer');
	else if (document.getElementById('footer'))
		var MainFooter = document.getElementById('footer');

	if (MainFooter.style.display == 'block')
	{
		MainFooter.style.display = 'none';
		document.location.href = document.location.href.split('#')[0]+'#';
	}
	else
	{
		MainFooter.style.display = 'block';
		// setTimeout pour Opera qui refuse le direct ds ce cas
		if (document.getElementById('main-footer'))
			setTimeout("document.location.href = document.location.href.split('#')[0]+'#main-footer'", 50);
		else if (document.getElementById('footer'))
			setTimeout("document.location.href = document.location.href.split('#')[0]+'#footer'", 50);
	}
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_options_only(evt)
{
	if(document.getElementById('New_lecteur_Allocine'))
	{
		document.getElementById('New_lecteur_Allocine').style.display = 'block';
		document.getElementById('AZ_options').className = 'AZ_Options_Show';
		document.getElementById('AZ_div_title').style.display = 'none';
		document.getElementById('AZ_div_bottom').style.display = 'none';
		document.getElementById('lecteur_allocine').style.display = 'none';
		document.getElementById('lecteur_allocine_HTML5').style.display = 'none';
		document.getElementById('lecteur_allocine_DivX').style.display = 'none';
		document.getElementById('lecteur_allocine_Iframe').style.display = 'none';
	}
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function Zap_Choice(ThisElt)
{
	if(document.getElementById('New_lecteur_Allocine'))
		document.getElementById('New_lecteur_Allocine').style.display = 'block';
	if(document.getElementById('AZ_Zap_Hr'))
		document.getElementById('AZ_Zap_Hr').style.display='none';
	if(document.getElementById('lecteur_allocine') && document.getElementById('lecteur_allocine').style.height == '0px')
	{
		document.getElementById('lecteur_allocine').style.height = ''+GM_getValue('AZ_height')+'px';
		document.getElementById('AZ_zap_See').style.display = 'none';
		document.getElementById('AZ_zap_noSee').style.display = 'block';
	}
	if(document.getElementById('lecteur_allocine_HTML5') && document.getElementById('lecteur_allocine_HTML5').style.height == '0px')
	{
		document.getElementById('lecteur_allocine_HTML5').style.height = ''+GM_getValue('AZ_height')+'px';
		document.getElementById('AZ_zap_See').style.display = 'none';
		document.getElementById('AZ_zap_noSee').style.display = 'block';
	}
	if(document.getElementById('lecteur_allocine_DivX') && document.getElementById('lecteur_allocine_DivX').style.height == '0px')
	{
		document.getElementById('lecteur_allocine_DivX').style.height = ''+GM_getValue('AZ_height')+'px';
		document.getElementById('AZ_zap_See').style.display = 'none';
		document.getElementById('AZ_zap_noSee').style.display = 'block';
	}
	//AZ_TitreVideo(ThisElt.parentNode.getElementsByTagName('a')[0].href);
	AZ_TitreVideo(ThisElt.dataset.url_ba);

	AZ_RestoreBgC();

	if(ThisElt.parentNode.parentNode.id != 'AZ_RelatedVideosL')
	{
		IdBeforeOldZap = ThisElt.parentNode.id;
		ThisElt.parentNode.id='OldZap';
		if (ThisElt.parentNode.parentNode.className == 'thumbnail-layer')
		{
			ThisElt.parentNode.parentNode.style.bottom = 0;
		}
	}
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_TransformClicCommand(url,nb)
{
	AZ_ZapIdTmp = '';
	GM_xmlhttpRequest({
		method: 'GET',
		url: url,
		onload: function(responseDetails)
		{
			try
			{
				AZ_Test_FinalUrl = responseDetails.finalUrl;
				BaliseAtmp = document.getElementsByTagName('a')[nb];
				BaliseAtmp.href = AZ_Test_FinalUrl;
				AZ_ZapIdTmp = AZ_Cmedia(AZ_Test_FinalUrl);
				if (AZ_ZapIdTmp != '')
				{
					AZ_ZapIdTmp += '_'+nb;
					BaliseAtmp.parentNode.appendChild(createElement('input',{type:"button", id:""+AZ_ZapIdTmp+"", value:"Zap(Cc)", title:""+AZ_Test_FinalUrl+"", class:"AZ_Zap"}, 'click AZ_ZapVideoSpan false'));
					if (BaliseAtmp.className=='btn')
					{
						document.getElementById(AZ_ZapIdTmp).style.position = 'absolute';
						document.getElementById(AZ_ZapIdTmp).style.bottom = '45px';
						document.getElementById(AZ_ZapIdTmp).style.right = '20px';
					}
				}
				else
				{
					BaliseAtmp.title = 'Lien ClickCommand:\n'+url;
					BaliseAtmp.style.fontStyle = 'italic';
				}

			}
			catch(Err) {}
		}
	});
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_Cmedia(url)
{
	if (url.match('player_gen_cmedia'))
	{
		RegexFindCmedia = /(.*?)player_gen_cmedia=(\d+)(.*?)/;
		AZ_cmedia = RegexFindCmedia.exec(url)[2];
	}
	else if (url.match(/(video(s)?|trailer|fragman)(-|\/)(\d+)/))
	{
		RegexFindCmedia = /(.*?)(video(s)?|trailer|fragman)(-|\/)(\d+)(.*?)/;
		AZ_cmedia = RegexFindCmedia.exec(url)[5];
		//alert(AZ_cmedia);
	}
	else if (url.match(/(\/partner\/)(.*?)(\d+)/))
	{
		RegexFindCmedia = /(.*?)(\/partner\/)(.*?)(\d+)(.*?)/;
		AZ_cmedia = RegexFindCmedia.exec(url)[4];
		AZ_FullScreen();
	}
	else
	{
		AZ_cmedia = gup('cmedia',url);
	}
	return AZ_cmedia;
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_FullScreen(url)
{
	document.getElementsByTagName('body')[0].style.marginTop = 0;
	if(document.getElementById('V6_player'))
		document.getElementById('V6_player').style.display = 'none';
	if (document.getElementById('logoPartner'))
	{
		document.getElementById('logoPartner').style.removeProperty('top');
		document.getElementById('logoPartner').style.bottom = '0px';
	}
	document.getElementById('New_lecteur_Allocine').style.position = 'static';
	document.getElementById('New_lecteur_Allocine').style.width = Math.floor(window.innerWidth)+'px';
	document.getElementById('New_lecteur_Allocine').style.height = Math.floor(window.innerHeight)+'px';
	document.getElementById('AZ_container').style.width = Math.floor(window.innerWidth)+'px';
	document.getElementById('AZ_container').style.height = Math.floor(window.innerHeight)+'px';
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_BuildOptionsSelect(Largeur)
{
	AZ_CmediasOptionsSelect = '';
	AZ_SelectWidth = ((Largeur/10)*1.5)-15;
	for (i=0; i<AZ_OptNames.length ; i++)
	{
		if (AZ_OptNames[i]!= undefined)
		{
			AZ_OptName = AZ_OptNames[i];
			if (AZ_OptName.length > AZ_SelectWidth)
				AZ_OptName = AZ_OptName.substring(0,Math.round((AZ_SelectWidth-5)/2))+'[...]'+AZ_OptName.substring(AZ_OptName.length-Math.round((AZ_SelectWidth-5)/2),AZ_OptName.length);
			AZ_CmediasOptionsSelect += '<option title="'+AZ_OptNames[i].replace(/\n/g,'').replace(/"/g,'&quot;')+'" value="'+AZ_ZapId[i]+'">'+AZ_OptName+'</option>';
		}
	}
	if (document.getElementById('AZ_select_video')) document.getElementById('AZ_select_video').innerHTML = AZ_CmediasOptionsSelect;
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_ZapVideoSelect(evt)
{
	AZ_IdCmedia = this.options[this.selectedIndex].value;
	AZ_ZapVideoSpan(document.getElementById(AZ_IdCmedia));
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_ZapVideoSpan(ThisElt)
{
	if (typeof ThisElt.id == 'undefined') ThisElt = this;
	Zap_Choice(ThisElt);

	if (document.getElementById('lecteur_allocine'))
		AZ_ZapVideo(ThisElt.id);
	if (document.getElementById('AZ_select_video'))
		document.getElementById('AZ_select_video').value = ThisElt.id;
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_ZapVideo(Allcmedia,idObject,player)
{
	AZ_ReplacePlayer = 'AcV4/AcPlayer_v4.4';
	//AZ_ReplacePlayer = 'AcV5/AcPlayer_v5.4.6';

	if (Allcmedia!='')
	{
		urlReferer = AZ_Url_Page;
		if (document.getElementById(Allcmedia)) urlReferer = document.getElementById(Allcmedia).dataset.url_ba;
		if (typeof idObject === "undefined") idObject = 'lecteur_allocine'
		if (typeof player === "undefined")
		{
			CmediaGlobal = Allcmedia;
			AZ_CheckSynopsis(urlReferer);
			player = GM_getValue('AZ_choix_lecteur');
		}

		cmedia = Allcmedia.split('_')[0];
		var flashvarsObject = idObject.replace('lecteur_allocine','flashvars');

		GM_xmlhttpRequest({
			method: 'GET',
			//url: 'http://'+window.location.host+'/blogvision/'+cmedia+'',
			url: 'http://'+window.location.host+'/_video/iblogvision.aspx?cmedia='+cmedia+'',
			onload: function(responseDetails)
			{
				AZ_blogvision_FinalUrl = AZ_Provider = AZ_FindCmedia = AZ_FindRef = AZ_FindTypeRef = AZ_FindSrcHTML5 = AZ_QualityHTML5 = AZ_FindSrcIframe = AZ_PlayerVisu = AZ_PlayerPoster = AZ_NbPlay = '';
				try
				{
					//AZ_blogvision_FinalUrl = responseDetails.finalUrl;
					//alert(AZ_blogvision_FinalUrl);
					//alert(responseDetails.responseText);
					AZ_blogvision_FinalUrl = responseDetails.responseText.replace(/\n/g,'');

					AZ_PageLink = AZ_PlayerVisu = AZ_PlayerTitle = AZ_blogvision_FinalUrl;
					if (AZ_blogvision_FinalUrl.match(/data-model="\{(.*?)\}"/))
					{
						AZ_blogvision_FinalUrl = AZ_blogvision_FinalUrl.match(/data-model="\{(.*?)\}"/)[1];
						AZ_blogvision_FinalUrl = AZ_blogvision_FinalUrl.replace(/&quot;/g,'');//.replace(/\{/g,'').replace(/\}/g,'').replace(/\\/g,'');
//						alert(AZ_blogvision_FinalUrl);
					}
					else if (AZ_blogvision_FinalUrl.match(/data-player='\{(.*?)\}'/))
						AZ_blogvision_FinalUrl = AZ_blogvision_FinalUrl.match(/data-player='\{(.*?)\}'/)[1];
					else if (AZ_blogvision_FinalUrl.match(/flashvars = \{(.*?)\}/))
						AZ_blogvision_FinalUrl = AZ_blogvision_FinalUrl.match(/flashvars = \{(.*?)\}/)[1];

					AZ_blogvision_FinalUrl = AZ_blogvision_FinalUrl.replace(/"/g,'');

					if (AZ_blogvision_FinalUrl.match(/provider:(.*?),/))
						AZ_Provider = AZ_blogvision_FinalUrl.match(/provider:(.*?),/)[1];

					if (AZ_Provider.replace('\\\/\\\/fr.vid.web.acsta.net','') == 'DailymotionVideo')
					{
						if (AZ_blogvision_FinalUrl.match(/embedUrl:(.*?),/))
						{
//							AZ_blogvision_embedUrl = AZ_blogvision_FinalUrl.match(/embedUrl:(.*?),/)[1];
//							AZ_blogvision_embedUrl = AZ_AlloCineHex2Asc(AZ_blogvision_embedUrl);
//							alert(AZ_blogvision_embedUrl);
						}
//						AZ_blogvision_FinalUrl = 'http://www.dailymotion.com/swf/video/'+AZ_blogvision_FinalUrl.match(/entityPartnerID:(.*?),/)[1]+'?autoplay='+(GM_getValue('AZ_autoplay')?1:0)+'&related=0';
//						document.getElementById(flashvarsObject).value = '';
//						AZ_FindSrcIframe = 'http://www.dailymotion.com/embed/video/'+AZ_blogvision_FinalUrl.match(/entityPartnerID:(.*?),/)[1]+'?autoplay='+(GM_getValue('AZ_autoplay')?1:0)+'&related=0&html=1&highlight='+zapColor.replace('#','')+'&foreground='+zapBgColor.replace('#','');
						AZ_FindSrcIframe = 'http://www.dailymotion.com/embed/video/'+AZ_blogvision_FinalUrl.match(/id_provider:(.*?),/)[1].replace('\\\/\\\/fr.vid.web.acsta.net','')+'?autoplay='+(GM_getValue('AZ_autoplay')?1:0)+'&related=0&html=1&highlight='+zapColor.replace('#','')+'&foreground='+zapBgColor.replace('#','');
					}
					else if (AZ_Provider == 'M6')
					{
						M6ID = AZ_blogvision_FinalUrl.match(/entityPartnerID:(.*?),/)[1];
						if (document.getElementById(flashvarsObject))
						{
							if (document.getElementById('V6_player')) AZ_CleanV6Player('M6');
							document.getElementById(flashvarsObject).value = 'AUTOPLAY='+GM_getValue('AZ_autoplay')+'&ID.VIDEO='+M6ID+'&VIDEO.LOCATION=http://www.m6.fr/v/'+M6ID+'&CONFIG.URL=config/config_allocine&ESTATDOM=allocine.fr&SHOW.CONTROL=true&THEME.COLOR='+zapBgColor.replace('#','0x')+'&BTNPLAY.COLOR='+zapColor.replace('#','0x')+'&FONT.COLOR='+zapColor.replace('#','0x')+'';
							AZ_blogvision_FinalUrl = 'http://player.cdn.m6web.fr/generique/PlayerGeneriqueM6.swf';
							setTimeout(function(){LoadFlvM6(M6ID,idObject,flashvarsObject)}, 500);
						}
					}
					else if (AZ_Provider == 'MySkreen')
					{
						MySkreenID = AZ_blogvision_FinalUrl.match(/entityPartnerID:(.*?),/)[1];
						AZ_FindSrcIframe = 'http://embed.myskreen.com/video/'+MySkreenID+'/?noPub=1';
					}
					else if (AZ_Provider == 'EmbedCode')
					{
							AZ_FindSrcIframe = AZ_blogvision_FinalUrl.match(/embedCode:(.*?),/)[1];
							AZ_FindSrcIframe = AZ_AlloCineHex2Asc(AZ_FindSrcIframe);
							if (AZ_FindSrcIframe.match('player.ina.fr'))
							{
								AZ_FindWIframe = AZ_FindSrcIframe.match(/width="(.*?)"/)[1];
								AZ_FindHIframe = AZ_FindSrcIframe.match(/height="(.*?)"/)[1];
								AZ_FindSrcIframe = AZ_FindSrcIframe.match(/src="(.*?)"/)[1];
								AZ_FindSrcIframe = AZ_FindSrcIframe.replace(AZ_FindWIframe+'/'+AZ_FindHIframe,GM_getValue('AZ_width')+'/'+GM_getValue('AZ_height'));
							}
							else
								AZ_FindSrcIframe = AZ_FindSrcIframe.match(/src="(.*?)"/)[1];
					}
					else
					{
						if(AZ_blogvision_FinalUrl.match(/id:(\d+),/))
							AZ_FindCmedia = AZ_blogvision_FinalUrl.match(/id:(\d+),/)[1];
						else if(AZ_blogvision_FinalUrl.match(/refMedia:(\d+),/))
							AZ_FindCmedia = AZ_blogvision_FinalUrl.match(/refMedia:(\d+),/)[1];
						else
							AZ_FindCmedia = AZ_blogvision_FinalUrl.match(/cmedia : '(\d+)',/)[1];

						if (AZ_blogvision_FinalUrl.match(/relatedEntityId:(\d+),/))
							AZ_FindRef = AZ_blogvision_FinalUrl.match(/relatedEntityId:(\d+),/)[1];
						else
							AZ_FindRef = AZ_blogvision_FinalUrl.match(/ref : '(\d+)',/)[1];

						if (AZ_blogvision_FinalUrl.match(/relatedEntityType:(.*?),/))
							AZ_FindTypeRef = AZ_blogvision_FinalUrl.match(/relatedEntityType:(.*?),/)[1];
						else
							AZ_FindTypeRef = AZ_blogvision_FinalUrl.match(/typeRef : '(.*?)',/)[1];

						if (AZ_FindRef == '') AZ_FindRef = AZ_FindCmedia;
						if (AZ_FindTypeRef == '') AZ_FindTypeRef = 'video';

						if (!window.location.host.match(/filmstarts/))
						{
							AZ_blogvision_FinalUrl = AZ_blogvision_FinalUrl.replace(/\}/g,'');
							if (AZ_Quality=='HD' && AZ_blogvision_FinalUrl.match(/high:(.*?),/))
							{
								AZ_FindSrcHTML5 = AZ_blogvision_FinalUrl.match(/high:(.*?),/)[1];
								AZ_FindSrcHTML5 = AZ_FindSrcHTML5.replace(/\\/g,'');
								AZ_QualityHTML5 = 'HD';
							}
							if ((AZ_Quality=='MD' || AZ_FindSrcHTML5 == '') && AZ_blogvision_FinalUrl.match(/medium:(.*?),/))
							{
								AZ_FindSrcHTML5 = AZ_blogvision_FinalUrl.match(/medium:(.*?),/)[1];
								AZ_FindSrcHTML5 = AZ_FindSrcHTML5.replace(/\\/g,'');
								AZ_QualityHTML5 = 'MD';
							}
						}
						else
						{
							if (AZ_Quality=='HD' && AZ_blogvision_FinalUrl.match(/html5PathHD:(.*?),/))
							{
								AZ_FindSrcHTML5 = AZ_blogvision_FinalUrl.match(/html5PathHD:(.*?),/)[1];
								AZ_FindSrcHTML5 = AZ_AlloCineHex2Asc(AZ_FindSrcHTML5);
								AZ_QualityHTML5 = 'HD';
							}
							if ( (AZ_Quality=='HDF' || AZ_Quality=='MD' || AZ_FindSrcHTML5=='') && AZ_blogvision_FinalUrl.match(/html5PathM:(.*?),/))
							{
								AZ_FindSrcHTML5 = AZ_blogvision_FinalUrl.match(/html5PathM:(.*?),/)[1];
								AZ_FindSrcHTML5 = AZ_AlloCineHex2Asc(AZ_FindSrcHTML5);
								AZ_QualityHTML5 = 'MD';
								if (AZ_Quality=='HDF')
								{
									AZ_FindSrcHTML5 = AZ_FindSrcHTML5.replace('480p','720p').replace('_m_','_hd_');
									AZ_QualityHTML5 = 'HD';
								}
							}
							if ( (AZ_Quality=='LD' || AZ_FindSrcHTML5=='') && AZ_blogvision_FinalUrl.match(/html5PathL:(.*?),/))
							{
								AZ_FindSrcHTML5 = AZ_blogvision_FinalUrl.match(/html5PathL:(.*?),/)[1];
								AZ_FindSrcHTML5 = AZ_AlloCineHex2Asc(AZ_FindSrcHTML5);
								AZ_QualityHTML5 = 'LD';
							}
						}
						if (AZ_blogvision_FinalUrl.match(/playerUrl:(.*?),/))
						{
//							AZ_FindPlayerUrl = AZ_blogvision_FinalUrl.match(/playerUrl:(.*?),/)[1];
//							AZ_FindPlayerUrl = AZ_AlloCineHex2Asc(AZ_FindPlayerUrl);
//							alert(AZ_FindPlayerUrl);
						}
						//alert(AZ_FindSrcHTML5);
						AZ_blogvision_FinalUrl = 'http://images.allocine.fr/commons/player/'+AZ_ReplacePlayer+'.swf?cmedia='+AZ_FindCmedia+'&ref='+AZ_FindRef+'&typeRef='+AZ_FindTypeRef;

						if (player == 'allocineNormal')
							document.getElementById(flashvarsObject).value = AZ_UrlVideoCplt.replace(/blog=true/g,'blog=false');
						else if (player == 'allocineBlog' || player == 'true' || AZ_FindSrcHTML5 == '')
							document.getElementById(flashvarsObject).value = AZ_UrlVideoCplt.replace(/blog=false/g,'blog=true');
						if (flashvarsObject != 'flashvars')
							document.getElementById(flashvarsObject).value = document.getElementById(flashvarsObject).value.replace(/autoPlay=true/g,'autoPlay=false').replace(/autoplay=true/g,'autoplay=false');
					}
					if (player!='html5' && player!='divx') AZ_FindSrcHTML5 = '';

					document.getElementById('AZ_div_title').style.display = 'block';
					document.getElementById('AZ_div_bottom').style.display = 'block';
					document.getElementById('AZ_QuickPlayerChoice').style.display = 'block';

					document.getElementById(idObject).style.display = 'none';
					document.getElementById(idObject).data = '';

					document.getElementById(idObject+'_HTML5').style.display = 'none';
					document.getElementById(idObject+'_HTML5').src = '';
					document.getElementById(idObject+'_HTML5').className = 'AZ_VideoHTML5';

					document.getElementById(idObject+'_DivX').style.display = 'none';
					document.getElementById(idObject+'_DivX').data = '';
					document.getElementById(idObject+'_DivXSrc').value = '';

					document.getElementById(idObject+'_Iframe').style.display = 'none';
					document.getElementById(idObject+'_Iframe').src = '';

					AZ_NbPlay = idObject.replace('lecteur_allocine','');

//					AZ_PlayerTitleTmp = AZ_PlayerTitle.match(/<title>(.*?)<\/title>/)[1].replace(/"/g,'');
					AZ_PlayerTitleTmp = AZ_PlayerTitle.replace(/\\&quot;/g,'\&quote;');
					AZ_PlayerTitleTmp = AZ_PlayerTitleTmp.match(/&quot;title&quot;:&quot;(.*?)&quot;/)[1].replace(/"/g,'').replace(/&quote;/g,'&quot;').replace(/\\\//g,'/');
					AZ_PlayerTitle = '<div title="'+unicodeToChar(AZ_PlayerTitleTmp)+'" style="width:85%;float:left;margin:auto;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">';
					if(AZ_PageLink.match(/mediaUrl&quot;:&quot;(.+?)&quot;/))
					{
						AZ_PageLink = AZ_PageLink.match(/mediaUrl&quot;:&quot;(.+?)&quot;/)[1].replace(/\\/g,'').replace(/&amp;/g,'&');

						if (AZ_PageLink.match('ACr'))
							AZ_PageLink = decodeBase64(AZ_PageLink.replace(/ACr/g,''));

//						alert('OK : '+AZ_PageLink);
						AZ_PlayerTitle += '<a href="'+AZ_PageLink+'" title="'+AZ_LNG.url+' :\n'+AZ_PageLink+'"><img src="'+IMG_B64_Link+'" alt="URL" style="border:none; margin:auto 5px 3px; width:22px;"/></a>';
						if (GM_getValue('AZ_relVid')!='off' && !AZ_Url_Page.match(/iblogvision/) && !AZ_Url_Page.match(/partner/))
							AZ_RelatedVideos(AZ_PageLink);
					}
					else if(!AZ_PageLink.match(/player-1(.+?)href=""/) && AZ_PageLink.match(/player-1(.+?)href="(.+?)"/))
					{
						AZ_PageLink = AZ_PageLink.match(/player-1(.+?)href="(.+?)"/)[2];
						AZ_PlayerTitle += '<a href="'+AZ_PageLink+'" title="'+AZ_LNG.url+' :\n'+AZ_PageLink+'"><img src="'+IMG_B64_Link+'" alt="URL" style="border:none; margin:auto 5px 3px; width:22px;"/></a>';
						if (GM_getValue('AZ_relVid')!='off' && !AZ_Url_Page.match(/iblogvision/) && !AZ_Url_Page.match(/partner/))
							AZ_RelatedVideos(AZ_PageLink);
					}
					AZ_PlayerTitle += unicodeToChar(AZ_PlayerTitleTmp)+'</div>';

					if (document.getElementById(idObject+'_Title'))
					{
						document.getElementById(idObject+'_Title').innerHTML = AZ_PlayerTitle;
					}

					// HTML 5
					if (AZ_FindSrcHTML5!='')
					{
/*
						if (AZ_Quality=='HD' && AZ_QualityHTML5=='MD')
						{
							AZ_FindSrcHTML5HD = AZ_FindSrcHTML5.replace('480p','720p').replace('_m_','_hd_');
							AZ_ForceVerifHDResult = AZ_ForceVerifHD(AZ_FindSrcHTML5HD,idObject,player);
							if (AZ_ForceVerifHDResult == true)
							{
								AZ_FindSrcHTML5 = AZ_FindSrcHTML5HD;
								AZ_QualityHTML5 = 'HD';
							}
						}
*/
						if(AZ_PlayerVisu.match(/image_main_movie&quot;:&quot;(.*?)&quot;/))
						{
							AZ_PlayerPoster = AZ_PlayerVisu.match(/image_main_movie&quot;:&quot;(.*?)&quot;/)[1];
							AZ_PlayerPoster = 'http://'+AZ_LNG.server+'.web.img2.acsta.net/r_'+Math.round(GM_getValue('AZ_height')*2/3)+'_'+GM_getValue('AZ_height')+'/'+AZ_PlayerPoster;
							//AZ_PlayerPoster.replace(/\/c_(\d+)_(\d+)\//,'/r_'+Math.round(GM_getValue('AZ_height')*2/3)+'_'+GM_getValue('AZ_height')+'/');
						}
						else if(AZ_PlayerVisu.match(/class="poster"><img src='(.*?)'/))
						{
							AZ_PlayerPoster = AZ_PlayerVisu.match(/class="poster"><img src='(.*?)'/)[1];
							AZ_PlayerPoster = AZ_PlayerPoster.replace(/\/c_(\d+)_(\d+)\//,'/r_'+Math.round(GM_getValue('AZ_height')*2/3)+'_'+GM_getValue('AZ_height')+'/');
						}
						if(AZ_PlayerVisu.match(/data-src="(.*?)"/))
						{
							AZ_PlayerVisu = AZ_PlayerVisu.match(/data-src="(.*?)"/)[1];
						}
						else if(AZ_PlayerVisu.match(/id="player_visu" src='(.*?)'/))
						{
							AZ_PlayerVisu = AZ_PlayerVisu.match(/id="player_visu" src='(.*?)'/)[1];
						}
						//alert(AZ_PlayerVisu);

//						AZ_PlayerTitle += '<a id="AZ_DLhtml5'+AZ_NbPlay+'" title="'+AZ_LNG.download+'" href="'+AZ_FindSrcHTML5+'" download><img alt="Dl" class="AZ_MiniImg" style="border:none;width:19px;" src="'+IMG_B64_Download+'" /></a>';
//						AZ_PlayerTitle += '<span class="AZ_QualityHTML5" class="AZ_QualityHTML5" style="float:right" title="'+AZ_LNG.quality.split('|')[0]+'">'+AZ_QualityHTML5+'</span>';
						if (document.getElementById(idObject+'_Title') && AZ_NbPlay!='')
						{
							document.getElementById(idObject+'_Title').appendChild(createElement('a',{id:"AZ_DLhtml5"+AZ_NbPlay+"", title:""+AZ_LNG.download+"", href:""+AZ_FindSrcHTML5+"", download:"download"}, '', '<img alt="Dl" class="AZ_MiniImg" style="border:none;width:19px;" src="'+IMG_B64_Download+'" />'));
							if (AZ_Quality!='HDF')
								document.getElementById(idObject+'_Title').appendChild(createElement('span',{id:"AZ_QualityHTML5"+AZ_NbPlay+"", title:""+AZ_LNG.quality.split('|')[0]+"", class:"AZ_QualityHTML5", style:"float:right"}, '', AZ_QualityHTML5));
							else
								document.getElementById(idObject+'_Title').appendChild(createElement('span',{id:"AZ_QualityHTML5"+AZ_NbPlay+"", title:""+AZ_LNG.quality.split('|')[0]+"", class:"AZ_QualityHTML5 AZ_ZapQl", style:"float:right;cursor:pointer", datasetplayer:""+player+"", datasetnbplay:""+AZ_NbPlay+""}, 'click AZ_ForceLoadHD false', AZ_QualityHTML5));
						}

						if (player == 'html5')
						{
							if(idObject == 'lecteur_allocine')
							{
								document.getElementById(idObject+'_AllPlayers').removeChild(document.getElementById(idObject+'_DivHTML5'))
								AZ_VidH5 = '<video onplay="this.className=\'AZ_VideoHTML5 AZ_VideoHTML5_Play\'" class="AZ_VideoHTML5" id="'+idObject+'_HTML5" style="width:'+GM_getValue('AZ_width')+'px;height:'+0.625*GM_getValue('AZ_width')+'px;"';
									AZ_VidH5 += ' src="" poster="'+IMG_B64_Empty+'"';
									AZ_VidH5 += (GM_getValue('AZ_autoplay')? ' autoplay="true"' : '')+' preload="none" controls="controls"';
								AZ_VidH5 += '></video>';
								base_AZ_VidH5 = createElement('div', {id:""+idObject+"_DivHTML5"},'',AZ_VidH5);
								document.getElementById(idObject+'_AllPlayers').appendChild(base_AZ_VidH5);
							}

							document.getElementById(idObject+'_HTML5').style.backgroundImage = 'url('+AZ_PlayerPoster+'), url('+AZ_PlayerVisu+')';
							//document.getElementById(idObject+'_HTML5').poster = AZ_PlayerPoster;
							document.getElementById(idObject+'_HTML5').src = AZ_FindSrcHTML5;
							document.getElementById(idObject+'_HTML5').style.display = 'block';
							if (document.getElementById(idObject+'_HTML5').volume == 1)
								document.getElementById(idObject+'_HTML5').volume = 0.4;
						}
						else if (player == 'divx')
						{
							document.getElementById(idObject+'_DivX').style.backgroundImage = 'url('+AZ_PlayerPoster+'), url('+AZ_PlayerVisu+')';
							if (idObject == 'lecteur_allocine' && AZ_PlayerPoster!= '')
								document.getElementById(idObject+'_PreviewDivX').value = AZ_PlayerPoster;
							else
								document.getElementById(idObject+'_PreviewDivX').value = AZ_PlayerVisu;

							document.getElementById(idObject+'_TitleDivX').value = AZ_PlayerTitleTmp;
							document.getElementById(idObject+'_DivXSrc').value = AZ_FindSrcHTML5;
							document.getElementById(idObject+'_DivX').data = AZ_FindSrcHTML5;
							document.getElementById(idObject+'_DivX').style.display = 'block';
						}

						if (AZ_PlayerPoster == '' || AZ_PlayerVisu == '')
						{
							document.getElementById(idObject+'_HTML5').style.backgroundSize = 'auto 100%';
							document.getElementById(idObject+'_DivX').style.backgroundSize = 'auto 100%';
							document.getElementById(idObject+'_HTML5').style.backgroundPosition = 'center';
							document.getElementById(idObject+'_DivX').style.backgroundPosition = 'center';
						}

						if(idObject == 'lecteur_allocine')
						{
							document.getElementById('AZ_DLhtml5').style.display = 'block';
							document.getElementById('AZ_QualityHTML5').innerHTML = AZ_QualityHTML5;
							document.getElementById('AZ_QualityHTML5').dataset.player = player;
							document.getElementById('AZ_DLhtml5').href = AZ_FindSrcHTML5;
							if (AZ_Quality=='HDF')
							{
								if (!document.getElementById('AZ_QualityHTML5').className.match('AZ_ZapQl'))
								{
									document.getElementById('AZ_QualityHTML5').className += ' AZ_ZapQl' ;
									document.getElementById('AZ_QualityHTML5').style.cursor = 'pointer';
								}
							}
						}
					}
					else
					{
						if(idObject == 'lecteur_allocine')
						{
							document.getElementById('AZ_QualityHTML5').innerHTML = '';
							document.getElementById('AZ_QualityHTML5').className = document.getElementById('AZ_QualityHTML5').className.replace(' AZ_ZapQl','');
							document.getElementById('AZ_DLhtml5').style.display = 'none';
							document.getElementById('AZ_DLhtml5').href = '#';
						}
						document.getElementById(idObject).style.display = 'none';

						if (AZ_Provider != '')
						{
							document.getElementById('AZ_QuickPlayerChoice').style.display = 'none';
							if(AZ_NbPlay!='')
							{
								document.getElementById('AZ_QuickPlayerChoice'+AZ_NbPlay).style.display = 'none';
							}
						}
						if (AZ_FindSrcIframe!='')
						{
							document.getElementById(idObject+'_Iframe').src = AZ_FindSrcIframe;
							document.getElementById(idObject+'_Iframe').style.display = 'block';
						}
						else
						{
							document.getElementById(idObject).data = AZ_blogvision_FinalUrl;
							document.getElementById(idObject).style.display = 'block';
						}
					}

					if (GM_getValue('AZ_posOri') && ( (idObject=='lecteur_allocine' && Allcmedia == cmedia) || posOriEnCours) && !AZ_Url_Page.match('/partner/') && !AZ_Url_Page.match('/iblogvision'))
						PosOri_Options('EnCours');
				}
				catch(Err) {}
			},
			onerror: function(responseDetails)
			{
				alert('Error: '+url);
				//document.getElementById(idObject).style.display = 'none';
				//document.getElementById(idObject).data = 'http://'+window.location.host+'/blogvision/'+cmedia+'';
				//document.getElementById(idObject).style.display = 'block';
			}
		});
	}
}
/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_ForceLoadHD (evt)
{
	AZ_NbPlay = this.dataset.nbplay;
	if (this.dataset.player == 'html5')
		NewUrl = document.getElementById('lecteur_allocine'+AZ_NbPlay+'_HTML5').src;
	else if (this.dataset.player == 'divx')
		NewUrl = document.getElementById('lecteur_allocine'+AZ_NbPlay+'_DivX').data;

	if (this.innerHTML == 'MD')
	{
		NewUrl = NewUrl.replace('480p','720p').replace('_m_','_hd_');
		this.innerHTML = 'HD';
	}
	else if (this.innerHTML == 'HD')
	{
		NewUrl = NewUrl.replace('720p','480p').replace('_hd_','_m_');
		this.innerHTML = 'MD';
	}
	document.getElementById('AZ_DLhtml5'+AZ_NbPlay).href = NewUrl;
	if (this.dataset.player == 'html5')
	{
		document.getElementById('lecteur_allocine'+AZ_NbPlay+'_HTML5').className = 'AZ_VideoHTML5';
		document.getElementById('lecteur_allocine'+AZ_NbPlay+'_HTML5').src = NewUrl;
	}
	else if (this.dataset.player == 'divx')
	{
		document.getElementById('lecteur_allocine'+AZ_NbPlay+'_DivXSrc').value = NewUrl;
		document.getElementById('lecteur_allocine'+AZ_NbPlay+'_DivX').data = NewUrl;
	}
}
/*
function AZ_ForceVerifHD(UrlHD,idObject,player)
{
	GM_xmlhttpRequest({
		method: 'GET',
		url: UrlHD,
		onload: function(responseDetails)
		{
			try
			{
				if(idObject == 'lecteur_allocine')
				{
					if (responseDetails.status == 200)
					{
						document.getElementById('AZ_QualityHTML5').innerHTML = 'HD';
						document.getElementById('AZ_DLhtml5').href = UrlHD;
						if (player == 'html5')
							document.getElementById(idObject+'_HTML5').src = UrlHD;
						else if (player == 'divx')
						{
							document.getElementById(idObject+'_DivXSrc').value = UrlHD;
							document.getElementById(idObject+'_DivX').data = UrlHD;
						}
					}
					//return true;
					//else						return false;
				}
			}
			catch(Err) {}
		}
	});
}
*/
/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_RelatedVideos(RelatedUrl)
{
	if (RelatedUrl.match('ACr'))
		RelatedUrl = decodeBase64(RelatedUrl.replace(/ACr/g,''));

	GM_xmlhttpRequest({
		method: 'GET',
		url: RelatedUrl,
		onload: function(responseDetails)
		{
			try
			{
				AZ_HTML_Related = responseDetails.responseText.replace(/\n/g,'');
				AZ_HTML_RelatedSection = AZ_HTML_Related.match(/<section(.+?)<\/section>/g);
//				AZ_HTML_RelatedSection = AZ_HTML_Related.match(/<section(\s+)class="section(\s+)section\-trailer">(.+?)<\/section>/g);
//				alert(AZ_HTML_RelatedSection);
				if (AZ_HTML_RelatedSection)
				{
					document.getElementById('AZ_RelatedVideosL').innerHTML = '';
					for (var Srv in AZ_HTML_RelatedSection)
					{
						AZ_CMediaRV_Test = false;
						AZ_HTML_RelatedSpans = AZ_HTML_RelatedSection[Srv].match(/<span(\s+)class="acLnk(\s+)([A-F0-9]{10,})">(.+?)<\/span>/g);
//						AZ_HTML_RelatedSpans = AZ_HTML_RelatedSection[Srv].match(/<span(\s+)class="thumbnail-container thumbnail-link"(\s+)data-ac="([A-z0-9=]{10,})"(.+?)<\/span>/g);
//						alert(AZ_HTML_RelatedSpans);
						if (AZ_HTML_RelatedSpans)
						{
							for (var Irv in AZ_HTML_RelatedSpans)
							{
								AZ_UrlRV = AZ_AlloCineHex2Asc(AZ_HTML_RelatedSpans[Irv].match(/([A-F0-9]{10,})/)[0]);

//								AZ_CMediaRV = AZ_UrlRV.match(/cmedia=(\d+)/)[1];
								AZ_CMediaRV = AZ_Cmedia(AZ_UrlRV);
								if (AZ_CMediaRV!='')
								{
									AZ_CMediaRV_Test = true;
									AZ_HTML_RelatedSpans[Irv] = AZ_HTML_RelatedSpans[Irv].replace(/span/g,'a').replace('class="acLnk ','href="').replace(/([A-F0-9]{10,})/,AZ_UrlRV);
									document.getElementById('AZ_RelatedVideosL').appendChild(createElement('div',{id:"RV_"+Srv+"_"+Irv+""}, '', AZ_HTML_RelatedSpans[Irv]));
									document.getElementById('RV_'+Srv+'_'+Irv+'').appendChild(createElement('input',{type:"button", id:""+AZ_CMediaRV+"_"+Srv+"_"+Irv+"", value:"Zap", dataseturl_ba:""+AZ_UrlRV+"", class:"AZ_Zap"}, 'click AZ_ZapVideoSpan false'));
								}
							}
						}
						AZ_HTML_RelatedSpans = AZ_HTML_RelatedSection[Srv].match(/<span(\s+)class="meta(-|__)title-link"(\s+)data-ac="([A-z0-9=]{10,})"(.+?)<\/span>/g);
						if (AZ_HTML_RelatedSpans)
						{
							for (var Irv in AZ_HTML_RelatedSpans)
							{
//								alert(decodeBase64(AZ_HTML_RelatedSpans[Irv].match(/ac="([A-z0-9=]{10,})"/)[1]));
								AZ_UrlRV = decodeBase64(AZ_HTML_RelatedSpans[Irv].match(/ac="([A-z0-9=]{10,})"/)[1]);

//								AZ_CMediaRV = AZ_UrlRV.match(/cmedia=(\d+)/)[1];
								AZ_CMediaRV = AZ_Cmedia(AZ_UrlRV);
								if (AZ_CMediaRV!='')
								{
									AZ_CMediaRV_Test = true;
									AZ_HTML_RelatedSpans[Irv] = AZ_HTML_RelatedSpans[Irv].replace(/span/g,'a').replace('data-ac','href').replace(/([A-z0-9=]{15,})/g,AZ_UrlRV);
									document.getElementById('AZ_RelatedVideosL').appendChild(createElement('div',{id:"RV_"+Srv+"_"+Irv+""}, '', AZ_HTML_RelatedSpans[Irv]));
									document.getElementById('RV_'+Srv+'_'+Irv+'').appendChild(createElement('input',{type:"button", id:""+AZ_CMediaRV+"_"+Srv+"_"+Irv+"", value:"Zap", dataseturl_ba:""+AZ_UrlRV+"", class:"AZ_Zap"}, 'click AZ_ZapVideoSpan false'));
								}
							}
						}
						AZ_HTML_RelatedSpans = AZ_HTML_RelatedSection[Srv].match(/<span(\s+)class="meta(-|__)title-link"(\s+)data-ac="ACr([A-z0-9=]{10,})"(.+?)<\/span>/g);
						if (AZ_HTML_RelatedSpans)
						{
							for (var Irv in AZ_HTML_RelatedSpans)
							{
//								alert(decodeBase64(AZ_HTML_RelatedSpans[Irv].match(/ac="ACr([A-z0-9=]{10,})"/)[1].replace(/ACr/,'')));
								AZ_UrlRV = decodeBase64(AZ_HTML_RelatedSpans[Irv].match(/ac="ACr([A-z0-9=]{10,})"/)[1].replace(/ACr/,''));

//								AZ_CMediaRV = AZ_UrlRV.match(/cmedia=(\d+)/)[1];
								AZ_CMediaRV = AZ_Cmedia(AZ_UrlRV);
								if (AZ_CMediaRV!='')
								{
									AZ_CMediaRV_Test = true;
									AZ_HTML_RelatedSpans[Irv] = AZ_HTML_RelatedSpans[Irv].replace(/span/g,'a').replace('data-ac','href').replace(/([A-z0-9=]{15,})/g,AZ_UrlRV);
									document.getElementById('AZ_RelatedVideosL').appendChild(createElement('div',{id:"RV_"+Srv+"_"+Irv+""}, '', AZ_HTML_RelatedSpans[Irv]));
									document.getElementById('RV_'+Srv+'_'+Irv+'').appendChild(createElement('input',{type:"button", id:""+AZ_CMediaRV+"_"+Srv+"_"+Irv+"", value:"Zap", dataseturl_ba:""+AZ_UrlRV+"", class:"AZ_Zap"}, 'click AZ_ZapVideoSpan false'));
								}
							}
						}
						AZ_HTML_RelatedSpans = AZ_HTML_RelatedSection[Srv].match(/<span(\s+)class="ACr([A-z0-9=]{10,})(\s+)meta(-|__)title-link"(.+?)<\/span>/g);
						if (AZ_HTML_RelatedSpans)
						{
							for (var Irv in AZ_HTML_RelatedSpans)
							{
//								alert(decodeBase64(AZ_HTML_RelatedSpans[Irv].match(/class="ACr([A-z0-9=]{10,})(.+?)"/)[1].replace(/ACr/,'')));
								AZ_UrlRV = decodeBase64(AZ_HTML_RelatedSpans[Irv].match(/class="ACr([A-z0-9=]{10,})(.+?)"/)[1].replace(/ACr/,''));

//								AZ_CMediaRV = AZ_UrlRV.match(/cmedia=(\d+)/)[1];
								AZ_CMediaRV = AZ_Cmedia(AZ_UrlRV);
								if (AZ_CMediaRV!='')
								{
									AZ_CMediaRV_Test = true;
									AZ_HTML_RelatedSpans[Irv] = AZ_HTML_RelatedSpans[Irv].replace(/span/g,'a').replace('class','href').replace(/"([A-z0-9=]{15,}(.+?))"/g,'"'+AZ_UrlRV+'"');
									document.getElementById('AZ_RelatedVideosL').appendChild(createElement('div',{id:"RV_"+Srv+"_"+Irv+""}, '', AZ_HTML_RelatedSpans[Irv]));
									document.getElementById('RV_'+Srv+'_'+Irv+'').appendChild(createElement('input',{type:"button", id:""+AZ_CMediaRV+"_"+Srv+"_"+Irv+"", value:"Zap", dataseturl_ba:""+AZ_UrlRV+"", class:"AZ_Zap"}, 'click AZ_ZapVideoSpan false'));
								}
							}
						}

						if (AZ_CMediaRV_Test) document.getElementById('AZ_RelatedVideosL').appendChild(createElement('hr',{style:"border-style:none none dotted"}));
					}
				}
			}
			catch(Err) {}
		}
	});
}
/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function LoadFlvM6(M6ID,idObject,flashvarsObject)
{
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://player.m6web.fr/v1/player/allocine/'+M6ID+'.html',
		onload: function(responseDetails)
		{
			try
			{
				AZ_M6_FinalUrl = responseDetails.responseText.replace(/\n/g,'');
				AZ_M6_Poster = AZ_M6_FinalUrl;
				if (AZ_M6_FinalUrl.match(/"src":"(.*?)"/))
				{
					if(AZ_PlayerVisu.match(/id="player_visu" src='(.*?)'/))
					{
						AZ_PlayerVisu = AZ_PlayerVisu.match(/id="player_visu" src='(.*?)'/)[1];
					}
					if (AZ_M6_Poster.match(/"poster":"(.*?)"/))
					{
						AZ_M6_Poster = AZ_M6_Poster.match(/"poster":"(.*?)"/)[1];
						if (AZ_M6_Poster.match('http')) AZ_PlayerVisu = AZ_M6_Poster.replace(/\\\//g,'/');
					}
					AZ_M6_FinalUrl = AZ_M6_FinalUrl.match(/"src":"(.*?)"/)[1];
					AZ_M6_FinalUrl = AZ_M6_FinalUrl.replace(/\\\//g,'/');
					document.getElementById(idObject).data = 'http://flv-player.net/medias/player_flv_maxi.swf';
					AZ_M6_FinalFlashVars = 'flv='+AZ_M6_FinalUrl+'&autoplay='+(GM_getValue('AZ_autoplay')? 1:0)+'&autoload=0&startimage='+AZ_PlayerVisu+'&margin=0';
					AZ_M6_FinalFlashVars += '&showstop=1&showvolume=1&showtime=1&showplayer=autohide&showfullscreen=1';
					AZ_M6_FinalFlashVars += '&playercolor='+zapColor.replace('#','')+'&buttoncolor='+zapBgColor.replace('#','');
					AZ_M6_FinalFlashVars += '&loadingcolor='+zapBgColor.replace('#','')+(zapColor=='#FFFFFF' ? '&buttonovercolor=000000&sliderovercolor=000000':'&buttonovercolor=FFFFFF&sliderovercolor=FFFFFF');
					AZ_M6_FinalFlashVars += '&showiconplay=1&iconplaybgcolor='+zapColor.replace('#','')+'&iconplaycolor='+zapBgColor.replace('#','');

					document.getElementById(flashvarsObject).value = AZ_M6_FinalFlashVars;
				}
			}
			catch(Err) {}
		}
	});
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_AlloCineHex2Asc(AZ_HexAlloCine)
{
	AZ_HexAlloCine2Hex = AZ_HexAlloCineDecrypt = '';
	AZ_AlloCode = {'0':'0', 'A':'1', '1':'2', '2':'3', 'B':'4', '3':'5', '4':'6', 'C':'7', '5':'8', '6':'9', 'D':'A', '7':'B', '8':'C', 'E':'D', '9':'E', 'F':'F'};

	for (var i = 0; i < AZ_HexAlloCine.length; i++)
		AZ_HexAlloCine2Hex += AZ_AlloCode[AZ_HexAlloCine.substr(i, 1)];
	for (var i = 0; i < AZ_HexAlloCine2Hex.length; i += 2)
		AZ_HexAlloCineDecrypt += String.fromCharCode(parseInt(AZ_HexAlloCine2Hex.substr(i, 2), 16));

	return AZ_HexAlloCineDecrypt;
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_QuickPlayerChoice(evt)
{
	IdEnCours = '';
	CmediaEnCours = CmediaGlobal;
	ThisId = this.id.split('_');

	if (typeof ThisId[2] != "undefined")
	{
		CmediaEnCours = CmediaGlobalMulti[ThisId[2]];
		IdEnCours = '_'+ThisId[2];
	}

	if (this.id == 'AZ_QuickPlayerBlog'+IdEnCours)
		AZ_ZapVideo(CmediaEnCours+IdEnCours,'lecteur_allocine'+IdEnCours,'allocineBlog');
	else if (this.id == 'AZ_QuickPlayerNormal'+IdEnCours)
		AZ_ZapVideo(CmediaEnCours+IdEnCours,'lecteur_allocine'+IdEnCours,'allocineNormal');
	else if (this.id == 'AZ_QuickPlayerDX'+IdEnCours)
		AZ_ZapVideo(CmediaEnCours+IdEnCours,'lecteur_allocine'+IdEnCours,'divx');
	else
		AZ_ZapVideo(CmediaEnCours+IdEnCours,'lecteur_allocine'+IdEnCours,'html5');
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_TitreVideo(UrlVideo)
{
	//alert(UrlVideo);
	AZ_Title = AZ_Title1 = AZ_Title_Final = '';
	document.getElementById('AZ_zap_name').innerHTML = 	AZ_Title_Final;
	GM_xmlhttpRequest({
		method: 'GET',
		url: UrlVideo,
		onload: function(responseDetails)
		{
			try
			{
				AZ_Title = responseDetails.responseText.replace(/\n/g,'');
				RegexFindTitle1 = /<title>(.*?)<\/title>/;
				RegexFindTitle2 = /<meta name="item-title" content="(.*?)" \/>/;
				if (RegexFindTitle1.test(AZ_Title))
					AZ_Title1 = RegexFindTitle1.exec(AZ_Title)[1];
				if (RegexFindTitle2.test(AZ_Title))
					AZ_Title2 = RegexFindTitle2.exec(AZ_Title)[1];

				AZ_TitleL0 = AZ_Title1.split(' - ')[0];
				AZ_TitleL1 = AZ_Title1.split(' - ')[1];
				AZ_TitleL1b = AZ_Title1.split(' - ')[2];
				AZ_TitleL1c = AZ_Title1.split(' - ')[3];
				if (typeof AZ_TitleL1b != "undefined" && typeof AZ_TitleL1c != "undefined")
				{
					AZ_TitleL0 += ' - '+AZ_TitleL1;
					AZ_TitleL1 = AZ_TitleL1b+' - '+AZ_TitleL1c;
				}
				if (typeof AZ_TitleL1 === "undefined" || AZ_TitleL1 == 'AlloCiné')
				{
					if (typeof AZ_Title2 != "undefined")
						AZ_TitleL1 = AZ_Title2;
					else
						AZ_TitleL1 = AZ_TitleL0;
				}
				AZ_TitleWidth = ((GM_getValue('AZ_width')/10)*1.5)-5;
				if (AZ_TitleL0.length > AZ_TitleWidth)
				{
					AZ_TitleL0_Tronque = AZ_TitleL0.substring(0,Math.round((AZ_TitleWidth-5)/2))+' [...] '+AZ_TitleL0.substring(AZ_TitleL0.length-Math.round((AZ_TitleWidth-5)/2,AZ_TitleL0.length));
					AZ_Title_Final = '<strong style="cursor:help" title="'+AZ_TitleL0.replace(/"/g,'&quot;')+'">'+AZ_TitleL0_Tronque+'</strong>';
				}
				else
					AZ_Title_Final = '<strong style="cursor:default;">'+AZ_TitleL0+'</strong>';

				if (AZ_TitleL1.length > AZ_TitleWidth)
				{
					AZ_TitleL1_Tronque = AZ_TitleL1.substring(0,Math.round((AZ_TitleWidth-5)/2))+' [...] '+AZ_TitleL1.substring(AZ_TitleL1.length-Math.round((AZ_TitleWidth-5)/2,AZ_TitleL1.length));
					AZ_Title_Final += '<br /><span id="AZ_VideoName" style="cursor:help;" title="'+AZ_TitleL1.replace(/"/g,'&quot;')+'">'+AZ_TitleL1_Tronque+'</span>';
				}
				else
					AZ_Title_Final += '<br /><span id="AZ_VideoName" style="cursor:default;">'+AZ_TitleL1+'</span>';

				if (UrlVideo != AZ_Url_Page)
					AZ_Title_Final += '<a id="AZ_LinkUrlVideo" href="'+UrlVideo+'" target="_top" title="'+AZ_LNG.url+' :\n'+UrlVideo+'"><img src="'+IMG_B64_Link+'" alt="URL" style="border:none; vertical-align:middle; margin:auto 5px 3px;" /></a>';

				document.getElementById('AZ_zap_name').innerHTML = 	AZ_Title_Final;
			}
			catch(Err) {}
		}
	});
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_Xclose(evt)
{
	document.getElementById('lecteur_allocine').data = '';
	document.getElementById('lecteur_allocine_HTML5').src = '';
	document.getElementById('lecteur_allocine_DivX').data = '';
	document.getElementById('lecteur_allocine_DivXSrc').value = '';
	document.getElementById('lecteur_allocine_Iframe').src = '';
	document.getElementById('AZ_options').className = 'AZ_Options_Hide';
	document.getElementById('New_lecteur_Allocine').style.display = 'none';
	AZ_RestoreBgC();
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_ShowHide_Synopsis()
{
	if(document.getElementById('AZ_Synopsis').style.display == 'block')
	{
		document.getElementById('AZ_Synopsis').style.display = 'none';
		document.getElementById('AZ_Synopsis_Hr').style.display = 'none';
	}
	else
	{
		document.getElementById('AZ_Synopsis_Hr').style.display = 'block';
		document.getElementById('AZ_Synopsis').style.display = 'block';
	}
}
function AZ_ShowHide_RelatedVideos()
{
	if(document.getElementById('AZ_RelatedVideosL').style.display == 'block')
	{
		document.getElementById('AZ_RelatedVideosT').style.display = 'none';
		document.getElementById('AZ_RelatedVideosL').style.display = 'none';
	}
	else
	{
		document.getElementById('AZ_RelatedVideosT').style.display = 'block';
		document.getElementById('AZ_RelatedVideosL').style.display = 'block';
	}
}
function AZ_ShowHide(IdS)
{
	IdS = IdS.split(',');
	for (var i = 0; i < IdS.lenght; i++)
	{
		if(document.getElementById(IdS))
		{
			if(document.getElementById(IdS).style.display == 'block')
				document.getElementById(IdS).style.display = 'none';
			else
				document.getElementById(IdS).style.display = 'block';
		}
	}
}
function AZ_RestoreBgC()
{
	if (document.getElementById('OldZap'))
	{
		if (IdBeforeOldZap == '')
		{
			if (document.getElementById('OldZap').parentNode.className == 'thumbnail-layer')
				document.getElementById('OldZap').parentNode.removeAttribute('style');
			document.getElementById('OldZap').removeAttribute('id');
		}
		else
			document.getElementById('OldZap').setAttribute('id',IdBeforeOldZap);

	}
}
/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_CheckSynopsis(UrlPage)
{
	if ( location.hostname == 'www.allocine.fr')
	{
		UrlPage = UrlPage.replace(/video\/player_gen_cmedia=\d+&cfilm=/,'film/fichefilm_gen_cfilm=');
		UrlPage = UrlPage.replace(/video\/player_gen_cmedia=\d+&cserie=/,'series/ficheserie_gen_cserie=');
	}
	else
		UrlPage = UrlPage.replace(/\/(video(s)?|trailer|fragman)(-|\/)(\d+)/,'');

	//alert(UrlPage);

	GM_xmlhttpRequest({
		method: 'GET',
		url: UrlPage,
		onload: function(responseDetails)
		{
			try
			{
				AZ_synopsis = responseDetails.responseText.replace(/\n/g,'');
				RegexFindSynopsis = /itemprop="description">(<\/p><p>|<\/div><div>)?(.*?)(<\/p>|<\/div>)/;
				if (RegexFindSynopsis.test(AZ_synopsis))
				{
					AZ_synopsis = RegexFindSynopsis.exec(AZ_synopsis)[2];
				}
				else
					AZ_synopsis = 'Pas de description';

				AZ_synopsis = AZ_synopsis.replace(/(<([^>]+)>)/ig,"");

				document.getElementById('AZ_Synopsis').innerHTML = AZ_synopsis;
				//document.getElementById('AZ_Synopsis').style.display = 'block';
			}
			catch(Err) {}
		}
	});
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function AZ_AlertBox(AZ_TextAlertBox)
{
	if(document.getElementById('div_AZ_AlertBox'))	return;

	base_AZ_AlertBox = createElement('div', {id:"div_AZ_AlertBox"},'',AZ_TextAlertBox);
	document.body.appendChild(base_AZ_AlertBox);
	document.getElementById('div_AZ_AlertBox').appendChild(createElement('input', {type:"button", value:""+AZ_LNG.option_close+"",onclick:"this.parentNode.parentNode.removeChild(document.getElementById(\'div_AZ_AlertBox\'))", class:"AZ_button"}));
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function gup(name,url_in)
{
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
//	var tmpURL = window.location.href;
	var tmpURL = url_in;
	var results = regex.exec( tmpURL );
	if( results == null )
		return "";
	else
		return results[1];
}

/////----------------------------------------------------------------------------------------/////
/////----------------------------------------------------------------------------------------/////
function getElementsByClassName(className, tag, elm){
	var testClass = new RegExp("(^|s)" + className + "(s|$)");
	var tag = tag || "*";
	var elm = elm || document;
	var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);
	var returnElements = [];
	var current;
	var length = elements.length;
	for(var i=0; i<length; i++)
	{
		current = elements[i];
		if(testClass.test(current.className))
		{
			returnElements.push(current);
		}
	}
	return returnElements;
}

//****************************************************************
//	functions by Userscripts Updater - http://userscripts.org:8080/scripts/show/26062
//****************************************************************
function createElement(type, attrArray, evtListener, html)
{
	var node = document.createElement(type);

	for (var attr in attrArray) if (attrArray.hasOwnProperty(attr)){
		node.setAttribute(attr.replace('dataset','data-'), attrArray[attr]);
	}

	if(evtListener){
		var a = evtListener.split(' ');
		node.addEventListener(a[0], eval(a[1]), eval(a[2]));
	}

	if(html)
		node.innerHTML = html;

	return node;
}
function getCSS()
{
	var AZ_Border = GM_getValue('AZ_border');
	var html_css = '';
	html_css += 'html, body {background:none !important;background-color:#1E1E1E !important}';
	if ((document.getElementById('header') || document.getElementById('main-header')) && (document.getElementById('header-account') || document.getElementById('header__account')))
	{
		if (GM_getValue('AZ_header') == 'fixed')
		{
			html_css += 'body {margin-top:123px !important;}';
			html_css += '#header, #main-header {margin:auto;position:fixed !important;top:0px;width:980px;z-index:2000;}';
			html_css += '.header-is-pinned #main-header {position:relative !important;top :50px;}';
			html_css += '#main-header {width:1024px; left:calc(50% - 512px)}';
			html_css += '#header.is_pinned, #main-header.is_pinned {height:auto;}';

			//html_css += '#nav {border-bottom:37px solid '+zapBgColor+';}';
			if (AZ_Url_Page.match('allocine.fr/communaute/forum'))
			{
				html_css += '#header, #main-header {width:100%;}';
				html_css += '#center_habillage {margin:0 -15px;}';
				html_css += 'body {margin-top:90px !important;;}';
				//html_css += '.AZ_Login, .AZ_Footer {float:left !important;top:-40px !important;left:850px !important;}';
			}
			else if (document.getElementById('header') && getElementsByClassName('subnav navHP')[0])
			{
				html_css += 'body {margin-top:120px !important;}';
				html_css += '.navHP {margin-top:-340px;}';
				html_css += '.acSlider {margin-top:40px !important; margin-bottom:20px !important;}';
			}
			else if (document.getElementById('header__nav') && AZ_Url_Page.match(/\/(recherche|suche|busqueda|ara|busca)\//))
			{
				html_css += 'body {margin-top:105px !important;}';
			}
			else if (document.getElementById('header') && getElementsByClassName('subnav ')[0] && getElementsByClassName('subnav ')[0].innerHTML.replace(/^\s+/g,'').replace(/\s+$/g,'') == '')
			{
				html_css += 'body {margin-top:115px !important;}';
				//html_css += '#nav {border-bottom:8px solid '+zapBgColor+';}';
			}
			else
			{
				html_css += 'body[id^="community_"] {margin-top:115px;}';
				if (document.getElementById('main-header'))
					html_css += 'body {margin-top:138px !important;}';
				else
					html_css += 'body {margin-top:155px !important;}';
			}
		}
		else
		{
//			html_css += 'body {margin-top:-14px;}';
			html_css += '.carousel_inner {width:100%;}';
			html_css += '.subheader {height:0px}';
			if (GM_getValue('AZ_header') == 'normal')
			{
				html_css += '.main-header.is_pinned #header__nav, .main-header.is_pinned #header__logo, .pagelayout .spacer:nth-child(2){display: none !important;}';
				if (AZ_Url_Page.match(/\/(recherche|suche|busqueda|ara|busca)\//))
					html_css += '.pagelayout .spacer:nth-child(2) {display:block !important}';
//					html_css += '.colgeneral, .colright{margin-top:-34px;} .pagelayout .spacer:nth-child(2) {display:block !important}';
			}
		}
	}
	else
	{
		if (GM_getValue('AZ_header') == 'fixed')
		{
			html_css += 'body {margin-top:80px;}';
			html_css += '.header_V6 {position:fixed;top:0px;width:970px;z-index:2000;border-bottom:4px solid '+zapBgColor+';}';
			html_css += '.mainheader {position:fixed;top:0px;width:980px;z-index:2000;border-bottom:4px solid '+zapBgColor+';}';
		}
		else if (document.getElementsByTagName('body')[0].innerHTML.length>200)
		{
			if (!document.getElementsByTagName('title')[0].innerHTML.match('404'))
				html_css += 'body {margin-top:-34px;}';
		}
	}
	//html_css += '.btn_trailer .btn span {font-size:10px;}';
	html_css += '#topheader, #content_player, .mainfooter, #footer, #main-footer, .AZ_VideoIframe {display:none;}';
	html_css += '#preRoll, #pub_ist_layer, .adBgClick, div[id$="=="], div[id^="wbdds"],#content-start figure.OldOriPlayer, .hnadszone, .acresults li.ad, .autocomplete-result-sponsored, .adBgClick, div[id^="clickCommand"], div[id^="playerFooter"], div[class^="player-footer"], .purePeople, .easyvoyage {height:0px !important; display:none !important;}';
	if (!GM_getValue('AZ_MonAlloCine'))
		html_css += '#header__account, #header-account {display:none;}';

	html_css += '.AZ_Zap, .AZ_ZapQl, .AZ_Login, .AZ_Footer {cursor:pointer;color:'+zapColor+' !important;background-color:'+zapBgColor+' !important;text-align:center;font-size:10px;font-weight:bold;font-variant:small-caps;margin-left:5px;padding:1px 5px;border:0.25em outset !important;z-index:1000;}';
	html_css += '.AZ_Zap, .AZ_ZapQl, .AZ_Login, .AZ_Footer {border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;transition:0.3s;-moz-transition:0.3s;-webkit-transition:0.3s;}';
	html_css += '.AZ_Zap {position:relative;float:right;width:35px;}';
	html_css += '.layer-link-holder .AZ_Zap {float:left;}';
	html_css += '.carrousel .AZ_Zap {position:inherit;}';

	if (!GM_getValue('AZ_zap'))
		html_css += '.AZ_Zap{display:none}';
	html_css += '.AZ_Zap:hover, .AZ_ZapQl:hover, .AZ_Login:hover, .AZ_Footer:hover {border-style:inset !important;color:'+zapBgColor+' !important;background-color:'+zapColor+' !important;}';
	html_css += '.AZ_Login, .AZ_Footer {/*clear:both;*/float:right;position:relative;top:-98px;right:550px;width:90px;}';
	html_css += '.header-is-pinned .AZ_Login, .header-is-pinned .AZ_Footer {position:fixed; top:2px;}';
	html_css += '.header-is-pinned .AZ_Footer {top:25px;}';
	html_css += '#main-header .AZ_Login, #main-header .AZ_Footer {clear:both;right:35px;}';
//	html_css += '.is_pinned .AZ_Login, .is_pinned .AZ_Footer {float:left;top:-40px;left:2px;}';
	html_css += '.is_pinned .AZ_Login, .is_pinned .AZ_Footer {clear:both;width:80px;font-size:9px;top:0px;right:-95px;}';
	html_css += '#main-header.is_pinned .AZ_Login, #main-header.is_pinned .AZ_Footer {width:80px;font-size:9px;top:-7px;right:-80px;}';
	html_css += '.is_pinned #logo{display:none}';
	html_css += '.AZ_LoginNew, .AZ_FooterNew {}';
	html_css += '#AZ_LinkHeader, #AZ_IconsColor, #AZ_choix_lecteur, #AZ_size, #AZ_LinkRelatedVideos, #AZ_Quality, #AZ_LinkBorder, #AZ_LinkPosOri, #AZ_LinkAutoplay, #AZ_LinkZap {float:left;text-align:left;width:25%;}';
	html_css += '.AZ_Options_Hide {display:none}';
	html_css += '.AZ_Options_Show {min-width:440px;width:'+GM_getValue('AZ_width')+'px;cursor:default;}';
	html_css += '.AZ_Options_Show span, .AZ_Options_Show select {font-size:11px !important;}';
	html_css += '#AZ_LinkColor, #AZ_LinkBgColor {float:left;width:50%;}';
	html_css += '.AZ_WebColors {border:none;padding:0px;margin:auto;}';
	html_css += '.AZ_WebColors td {border:none;padding:0px;height:12px;width:12px;line-height:12px;vertical-align:middle;}';
	html_css += '.AZ_WebColors button {border:none;padding:0px;height:11px;width:11px;line-height:11px;font-size:9px;cursor:pointer;}';
	html_css += '#div_AZ_update {text-align:center;font-size:22px;font-variant:small-caps;position:fixed; margin:auto;width:100%;height:100%;top:0;z-index:100000;background-color:'+zapBgColor+';color:'+zapColor+';opacity: 0.95;padding-top:'+((window.innerHeight-280)/2)+'px;}';
	html_css += '#div_AZ_update input[type=button] {font-size:18px;width:150px;height:40px;}';
//	html_css += '#div_AZ_AlertBox {text-align:center; position:fixed; margin:auto;width:100%;height:100%;top:2px;z-index:100000;background-color:'+zapBgColor+';color:'+zapColor+';opacity: 0.95;padding-top:'+((window.innerHeight-150)/2)+'px;}';
	html_css += 'input.AZ_button {width:100px; height:25px; background-color:'+zapBgColor+'; color:'+zapColor+'; font-size:11px; font-variant:small-caps; border-color:'+zapColor+';border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px; cursor:pointer;}';
	html_css += 'input.AZ_button:hover {font-weight:bold; background-color:'+zapColor+'; color:'+zapBgColor+';border-color:'+zapBgColor+'}';
	html_css += 'input.AZ_buttonOpt {width:200px; background-color:#FFD515; font-size:10px; cursor:pointer; margin-top:1px}';
	html_css += '#New_lecteur_Allocine {z-index:50000; margin:auto; cursor:move; position:fixed; top:'+GM_getValue('AZ_Top')+'; left:'+GM_getValue('AZ_Left')+'; display:none;}';
	html_css += '#New_lecteur_Allocine hr {border: 1px solid; margin:5px 10px;color:'+zapColor+';}';
	html_css += '#New_lecteur_Allocine select {background-color:#FFD515}';
	html_css += '#New_lecteur_Allocine object, #New_lecteur_Allocine select {text-align:center;}';
	html_css += '#New_lecteur_Allocine object {transition:1s;background-color:#000;}';
	html_css += '#AZ_container, .player_video {color:'+zapColor+';background-color:'+zapBgColor+' !important;text-align:center;margin:auto;font-size:10px;border-radius:'+AZ_Border+';-moz-border-radius:'+AZ_Border+';-webkit-border-radius:'+AZ_Border+';}';
	html_css += '#AZ_container{z-index:10000;}';
	html_css += '#AZ_div_top {border-radius:'+AZ_Border+' '+AZ_Border+' 0px 0px;-moz-border-radius:'+AZ_Border+' '+AZ_Border+' 0px 0px;-webkit-border-radius:'+AZ_Border+' '+AZ_Border+' 0px 0px;padding:0 2px;}';
	html_css += '#AZ_div_bottom {border-radius:0px 0px '+AZ_Border+' '+AZ_Border+';-moz-border-radius:0px 0px '+AZ_Border+' '+AZ_Border+';-webkit-border-radius:0px 0px '+AZ_Border+' '+AZ_Border+';min-height:20px;}';
//	html_css += '.AZ_VideoHTML5 {transition:1s;display:none;margin:auto;cursor:default; background-color:#000 !important; background-position:left center, right center; background-size:30%,70%; background-repeat: no-repeat;}';
	html_css += '.AZ_VideoHTML5 {transition:1s;display:none;margin:auto;cursor:default; background-color:#000 !important; background-position:5% 85%, center; background-size:17%,100%; background-repeat: no-repeat;}';
	html_css += 'video:hover {transition:1s;background-position:center top, 95% 85%; background-size:43%,24%;}';
	html_css += '.AZ_VideoHTML5:-moz-full-screen {background-position:30% center, 70% center; background-size:15%,35% !important;}';
	html_css += '.AZ_VideoHTML5:-webkit-full-screen {background-position:30% center, 70% center; background-size:15%,35% !important;}';
	html_css += '.AZ_VideoHTML5_Play:not(:-moz-full-screen) {background:black !important;}';
	html_css += '.AZ_VideoHTML5_Play:not(:-webkit-full-screen) {background:black !important;}';
	html_css += '.AZ_VideoHTML5_Play {background:black !important;}';
	html_css += '.AZ_QualityHTML5 {cursor:help; font-weight:bolder; font-style:italic; margin:auto 5px;}';
	html_css += '.AZ_ObjectError {text-align:center;font-weight:bold;color:'+zapColor+';background-color:'+zapBgColor+';opacity:0.75;}';
	html_css += '#OldZap {border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;background-color:'+zapBgColor+' !important;color:'+zapColor+' !important;}';
	html_css += '#OldZap a{color:'+zapColor+' !important;text-decoration:underline;} #OldZap a:hover{font-style:italic}';
	html_css += '#OldZap span{color:'+zapColor+' !important;}';
	html_css += '#AZ_Synopsis{display:none;margin:auto;width:'+(GM_getValue('AZ_width')-15)+'px;padding-right:5px;text-align:justify;cursor:default;overflow-y:auto;max-height:150px;}';
	html_css += '#AZ_RelatedVideosL {margin:auto;padding:5px;overflow-y:auto;max-height:150px;width:'+(GM_getValue('AZ_width')-20)+'px;}';
	html_css += '#AZ_RelatedVideosL div {text-align:left;}';
	html_css += '#AZ_RelatedVideosL a{color:'+zapColor+'; text-decoration:underline} #AZ_RelatedVideosL .AZ_Zap{float:none;}';
	html_css += '#AZ_XcloseTxt {float:right;position:absolute;top:0px;right:0px;cursor:pointer;margin:0px 5px 0px 0px;font-weight:bold;}';
	html_css += '#AZ_XcloseButton {width:15px;height:15px;font-size:8px;color:'+zapBgColor+';background-color:'+zapColor+';float:right;position:absolute;top:0px;right:0px;cursor:pointer;margin:2px;font-weight:bold;}';
	html_css += '.AZ_Link {cursor:pointer;font-weight:bold;text-decoration:underline;color:'+zapColor+';}';
	html_css += '.AZ_MiniImg {float:right;cursor:pointer;margin-right:5px;vertical-align:middle;}';
	html_css += '#AZ_QuickPlayerChoice {float:left;font-size:8px;line-height:20px;cursor:default}';
	html_css += '#AZ_QuickPlayerChoice span{margin:auto 2px;font-weight:bold;}';
   	html_css += '[id^="lecteur_allocine"][id*="-TagDivFooter"] {height:500px !important;}';
   	html_css += '[id^="lecteur_allocine"][id$="-TagDivFooter_Title"] {height:auto !important;}';
	html_css += '.lecteur_allocine_Title {text-align:center;font-size:11px;cursor:default;padding:2px 0px;width:100%;background:'+zapBgColor+';color:'+zapColor+';border-radius:'+AZ_Border+' '+AZ_Border+' 0px 0px;-moz-border-radius:'+AZ_Border+' '+AZ_Border+' 0px 0px;-webkit-border-radius:'+AZ_Border+' '+AZ_Border+' 0px 0px; overflow:hidden}';
	html_css += '.AZ_QuickPlayerChoice {position:relative;left:-50px;bottom:232px;text-align:center;width:50px;/*height:130px*/;background:'+zapBgColor+';padding:5px 0px;border-radius:'+AZ_Border+' 0px 0px '+AZ_Border+';-moz-border-radius:'+AZ_Border+' 0px 0px '+AZ_Border+';-webkit-border-radius:'+AZ_Border+' 0px 0px '+AZ_Border+';}';
	html_css += '.AZ_QuickPlayerChoice span{display:block;padding:7px 0px;font-size:12px}';
	html_css += '.AZ_QuickPlayerChoiceChallengers {text-align:center;cursor:default;width:100%;height:18px;background:'+zapBgColor+';padding:5px 0px;border-radius:0px 0px '+AZ_Border+' '+AZ_Border+';-moz-border-radius:0px 0px '+AZ_Border+' '+AZ_Border+';-webkit-border-radius:0px 0px '+AZ_Border+' '+AZ_Border+';}';
	html_css += '.AZ_QuickPlayerChoiceChallengers span{padding:0px 14px;font-size:12px}';
	//html_css += '.challenger {transform:none !important;}';
	html_css += '.challenger .vote {margin-top:58px;}';
	//html_css += '.richText.editorial p{margin:5px 0px; text-align: justify;} .richText.editorial {padding: 0px;} .richText.editorial [class*="media-banner"] {margin:0px;}';
	html_css += '.richText.editorial p{margin:5px 0px; text-align: justify;}';
	//html_css += '#AZ_Dedic {float:left; position:relative; left:10px; top:10px; font-size:11px; font-variant:normal;}';
	html_css += '#col_right .col_inner {border-bottom: 6px solid #FC0;}';
	html_css += '.player-info {position:static; margin: 20px auto}';
	html_css += 'figure[id^="PlayerJW_"]{margin-bottom: 50px !important}';

	if (GM_getValue('AZ_posOri'))
	{
		html_css += '.player_video {background-color:transparent !important}';
		html_css += '#AZ_RelatedVideosL {width:540px;}';
		html_css += '.AZ_Ancre {padding-top:80px;}';

	}

	if (AZ_Url_Page.match(/iblogvision/) || AZ_Url_Page.match(/partner/))
	{
		html_css += '#preloadPlayer,#AZ_div_top,#AZ_XcloseTxt,#AZ_div_bottom img,#AZ_RelatedVideosT {display:none !important;}';
		html_css += '#New_lecteur_Allocine{top:0px;left:0px;cursor:default;}';
		html_css += '#New_lecteur_Allocine,#lecteur_allocine,#lecteur_allocine_HTML5,#lecteur_allocine_DivX,#lecteur_allocine_Iframe';
			html_css += '{width:'+(innerWidth)+'px !important;height:'+Math.round((innerHeight-20))+'px !important;}';
	}

	var css = createElement('style',{type:"text/css"},null,html_css);
	return css;
}

//****************************************************************
//		U p d a t e
//****************************************************************
function check_AZ_version(evt)
{
	GM_xmlhttpRequest({
		method: 'GET',
//		url: 'http://userscripts.org:8080/scripts/source/'+AZ_id+'.meta.js',
		url: 'https://greasyfork.org/scripts/'+AZ_id+'/code/AlloCine_Zap.meta.js',
		onload: function(responseDetails)
		{
			try
			{
//				AZ_currentVersion = parseInt(responseDetails.responseText.match(/\@uso\:version\s+(\d+)/)[1]);
				AZ_currentVersion = responseDetails.responseText.match(/\@version\s+(\d+\.\d+\.?\d?)/)[1];
				AZ_currentVersion = AZ_currentVersion.replace(/\./g,'');
				for (i_cV = AZ_currentVersion.length; i_cV < 4; i_cV++) AZ_currentVersion +=0;
				AZ_currentVersion = parseInt(AZ_currentVersion);
				if(GM_getValue('AZ_Version') == 0) GM_setValue('AZ_Version', AZ_currentVersion);
				if (GM_getValue('AZ_Version') < AZ_currentVersion)
				{
					new_AZ_version();
				}
				else if(evt=='menu')
				{
					alert (AZ_LNG.check_noresult);
				}
				else
				{
					GM_setValue('AZ_DateUpdate', AZ_today_YYYYMMDD);
					try {GM_deleteValue('AZ_DateLater');} catch(Err){};
				}
			}
			catch(Err) {}
		}
	});
}
function ForceCheck_AZ_version(evt)
{
	check_AZ_version('menu');
}
function new_AZ_version(evt)
{
	if(document.getElementById('div_AZ_update'))	return;

	html_AZ_update = AZ_LNG.title_update_new+' '+AZ_LNG.name+'<br /><br />';
	html_AZ_update += '<span style="font-size:16px">'+AZ_LNG.donate_title+'</span><br />';
	html_AZ_update += FormPaypal+'<input style="height:25px;" type="image" name="submit" alt="PayPal!" src="'+IMG_B64_Paypal+'" /></form><br />';

	base_AZ_update = createElement('div', {id:"div_AZ_update"},'',html_AZ_update);
	document.body.appendChild(base_AZ_update);
	// update "button"
	document.getElementById('div_AZ_update').appendChild(createElement('input', {type:"button", value:""+AZ_LNG.update_button+"", class:"AZ_button"}, 'click update_AZ false'));
	// later "button"
	document.getElementById('div_AZ_update').appendChild(createElement('span','','','&nbsp;&nbsp;&nbsp;'));
	document.getElementById('div_AZ_update').appendChild(createElement('input', {type:"button", value:""+AZ_LNG.later_button+"", class:"AZ_button"}, 'click update_later_AZ false'));
	document.getElementById('div_AZ_update').appendChild(createElement('div', {onclick:"this.parentNode.parentNode.removeChild(document.getElementById(\'div_AZ_update\'))", class:"AZ_Link"}, '', '<br />'+AZ_LNG.option_close+''));
}
//new_AZ_version();
function update_AZ()
{
	base_AZ_update.parentNode.removeChild(base_AZ_update);
	GM_setValue('AZ_Version', AZ_currentVersion);
	GM_setValue('AZ_DateUpdate', AZ_today_YYYYMMDD);
	try {GM_deleteValue('AZ_DateLater');} catch(Err){};
//	GM_openInTab('http://userscripts.org:8080/scripts/source/'+AZ_id+'.user.js');
	GM_openInTab('https://greasyfork.org/scripts/'+AZ_id+'/code/AlloCine_Zap.user.js');
}
function update_later_AZ()
{
	GM_setValue('AZ_DateLater', AZ_today_YYYYMMDD+1);
	base_AZ_update.parentNode.removeChild(base_AZ_update);
}

//****************************************************************
//		D r a g  &  D r o p
//****************************************************************
//	Adapted from http://www.hunlock.com/blogs/Javascript_Drag_and_Drop
//	And Userscripts Updater : http://userscripts.org:8080/scripts/show/26062
var savedTarget=null;                           // The target layer (effectively vidPane)
var orgCursor=null;                             // The original mouse style so we can restore it
var dragOK=false;                               // True if we're allowed to move the element under mouse
var dragXoffset=0;                              // How much we've moved the element on the horozontal
var dragYoffset=0;                              // How much we've moved the element on the verticle

function moveHandler(e){
	if (e == null) return;// { e = window.event }
	if ( e.button<=1 && dragOK ){
		savedTarget.style.left = e.clientX - dragXoffset + 'px';
		savedTarget.style.top = e.clientY - dragYoffset + 'px';
		return false;
	}
}

function cleanup(e) {
	document.removeEventListener('mousemove',moveHandler,false);
	document.removeEventListener('mouseup',cleanup,false);

	savedTarget.style.cursor=orgCursor;
	GM_setValue('AZ_Left', savedTarget.style.left);
	GM_setValue('AZ_Top',  savedTarget.style.top);

	dragOK=false; //its been dragged now
}

function dragHandler(e){
	if (AZ_Url_Page.match(/iblogvision/))
		return false;

	var htype='-moz-grabbing';
	if (e == null) return;//{ e = window.event;}  // htype='move';}
	var target = e.target;// != null ? e.target : e.srcElement;
	orgCursor=target.style.cursor;

	if(target.nodeName!='DIV')
		return;

	if (target = document.getElementById('New_lecteur_Allocine')) {
		savedTarget=target;
		target.style.cursor=htype;
		dragOK=true;
		dragXoffset = e.clientX-target.offsetLeft;
		dragYoffset = e.clientY-target.offsetTop;

		//set the left before removing the right
		target.style.left = e.clientX - dragXoffset + 'px';
		target.style.right = null;

		document.addEventListener('mousemove',moveHandler,false);
		document.addEventListener('mouseup',cleanup,false);
		return false;
	}
}
//end drag handling

function unicodeToChar(text) {
   return text.replace(/\\u[\dA-Fa-f]{4}/g,
          function (match) {
               return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
          });
}

/**
*
*  Base64 encode / decode
*  http://www.devkb.org/javascript/8-Encoder-decoder-du-texte-en-Base64-en-JavaScript
*
**/


var END_OF_INPUT = -1;

var base64Chars = new Array(
	"A","B","C","D","E","F","G","H",
	"I","J","K","L","M","N","O","P",
	"Q","R","S","T","U","V","W","X",
	"Y","Z","a","b","c","d","e","f",
	"g","h","i","j","k","l","m","n",
	"o","p","q","r","s","t","u","v",
	"w","x","y","z","0","1","2","3",
	"4","5","6","7","8","9","+","/"
);

var reverseBase64Chars = new Array();
for (var i=0; i < base64Chars.length; i++){
	reverseBase64Chars[base64Chars[i]] = i;
}

var base64Str;
var base64Count;
function setBase64Str(str){
	base64Str = str;
	base64Count = 0;
}
function readBase64(){
	if (!base64Str) return END_OF_INPUT;
	if (base64Count >= base64Str.length) return END_OF_INPUT;
	var c = base64Str.charCodeAt(base64Count) & 0xff;
	base64Count++;
	return c;
}
function encodeBase64(str){
	setBase64Str(str);
	var result = "";
	var inBuffer = new Array(3);
	var lineCount = 0;
	var done = false;
	while (!done && (inBuffer[0] = readBase64()) != END_OF_INPUT){
		inBuffer[1] = readBase64();
		inBuffer[2] = readBase64();
		result += (base64Chars[ inBuffer[0] >> 2 ]);
		if (inBuffer[1] != END_OF_INPUT){
			result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30) | (inBuffer[1] >> 4) ]);
			if (inBuffer[2] != END_OF_INPUT){
				result += (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6) ]);
				result += (base64Chars [inBuffer[2] & 0x3F]);
			} else {
				result += (base64Chars [((inBuffer[1] << 2) & 0x3c)]);
				result += ("=");
				done = true;
			}
		} else {
			result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30)]);
			result += ("=");
			result += ("=");
			done = true;
		}
		lineCount += 4;
		if (lineCount >= 76){
			result += ("n");
			lineCount = 0;
		}
	}
	return result;
}


function readReverseBase64(){
	if (!base64Str) return END_OF_INPUT;
	while (true){
		if (base64Count >= base64Str.length) return END_OF_INPUT;
		var nextCharacter = base64Str.charAt(base64Count);
		base64Count++;
		if (reverseBase64Chars[nextCharacter]){
			return reverseBase64Chars[nextCharacter];
		}
		if (nextCharacter == "A") return 0;
	}
	return END_OF_INPUT;
}

function ntos(n){
	n=n.toString(16);
	if (n.length == 1) n="0"+n;
	n="%"+n;
	return unescape(n);
}

function decodeBase64(str){
	setBase64Str(str);
	var result = "";
	var inBuffer = new Array(4);
	var done = false;
	while (!done && (inBuffer[0] = readReverseBase64()) != END_OF_INPUT
		&& (inBuffer[1] = readReverseBase64()) != END_OF_INPUT){
		inBuffer[2] = readReverseBase64();
		inBuffer[3] = readReverseBase64();
		result += ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
		if (inBuffer[2] != END_OF_INPUT){
			result +=  ntos((((inBuffer[1] << 4) & 0xff)| inBuffer[2] >> 2));
			if (inBuffer[3] != END_OF_INPUT){
				result +=  ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
			} else {
				done = true;
			}
		} else {
			done = true;
		}
	}
	return result;
}


/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/javascript-base64.html
*
**/

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while ( i < utftext.length ) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}
}