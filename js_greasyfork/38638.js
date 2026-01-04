// ==UserScript==

/* eslint-disable no-case-declarations, no-fallthrough, indent, no-mixed-spaces-and-tabs, no-multi-spaces, no-return-assign, no-useless-escape, quotes */
/* jshint esversion: 6 */

// @name			Supercharged Local Directory File Browser
// @version			8.1.8
// @description		Makes directory index pages (either local or remote open directories) actually useful. Adds sidebar and content preview pane; keyboard navigation; sorting; light/dark UI; preview images/fonts in navigable grids; browse subdirectories w/o page reload (“tree view”); media playback, shuffle/loop options; basic playlist (m3u, extm3u) & cuesheet (.cue) support; create, edit, preview, save markdown/plain text files; open font files, view complete glyph repertoire, save glyphs as .svg; more.
// @author			gaspar_schot
// @license			GPL-3.0-or-later
// @homepageURL		https://openuserjs.org/scripts/gaspar_schot/Supercharged_Local_Directory_File_Browser
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAgMAAAC+UIlYAAAACVBMVEUmRcmZzP8zmf8pVcWPAAAAAXRSTlMAQObYZgAAAFBJREFUeF7tyqERwDAMBEE3mX5UiqDmqwwziTPHjG7xrmzrLFtRaApDIRiKQlMYCsFQFJrCUAiGotAU5hTA1WB4fhkMBsOJwWAwgHvB8CHpBcTbpxy4RZNvAAAAAElFTkSuQmCC
// @match			file://*/*
// @match			https://www.example.com/path/to/directory/*

// @require https://cdn.jsdelivr.net/npm/markdown-it@13.0.1/dist/markdown-it.min.js
// @require https://cdn.jsdelivr.net/npm/markdown-it-footnote@3.0.2/dist/markdown-it-footnote.min.js
// @require https://cdn.jsdelivr.net/npm/markdown-it-toc-done-right@2.1.0/dist/markdown-it-toc-made-right.min.js
// @require https://cdn.jsdelivr.net/npm/markdown-it-sub@1.0.0/dist/markdown-it-sub.min.js
// @require https://cdn.jsdelivr.net/npm/markdown-it-sup@1.0.0/dist/markdown-it-sup.min.js
// @require https://cdn.jsdelivr.net/npm/markdown-it-deflist@2.0.3/dist/markdown-it-deflist.min.js
// @require https://cdn.jsdelivr.net/npm/markdown-it-multimd-table@4.0.2/dist/markdown-it-multimd-table.min.js
// @require https://cdn.jsdelivr.net/npm/markdown-it-center-text@1.0.4/dist/markdown-it-center-text.min.js
// @require https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js
// @require https://cdn.jsdelivr.net/npm/@gerhobbelt/markdown-it-checkbox@1.2.0-3/dist/markdownItCheckbox.umd.js


// @namespace https://greasyfork.org/users/16170
// @downloadURL https://update.greasyfork.org/scripts/38638/Supercharged%20Local%20Directory%20File%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/38638/Supercharged%20Local%20Directory%20File%20Browser.meta.js
// ==/UserScript==

(function() {
	// ************ J + M + J ************* //
	'use strict';
	// ***** UI SETTINGS ***** //
	const UI_Prefs_Bool = {
		alternate_background:true,  apps_as_dirs:true,  autoload_index_files:true,  iframe_theme:true,  ignore_ignored_items:true,  media_autoload:true,  media_autoplay:true,  media_play_all:true,  show_details:true,  show_ignored_items:true,  show_image_thumbnails:true,  show_large_image_thumbnails:true,  show_invisibles:true,  show_media_name_in_window_title:true,  show_numbers:true,  show_sidebar:true,  text_editing_enable:true,  texteditor_split_view:true,  texteditor_sync_scroll:true,  use_custom_icons:true,  audio_player_on_top:true
	}
	const UI_Prefs_Non_Bool = {
		grid_font_size:	1,								// Default = 1
		grid_image_size:	184,						// Default = 184 (200px - 16px)
		sort_by:			'default',					// Choose from: 'name', 'size', 'date', 'kind', 'ext', 'default ( = Chrome sorting: dirs on top, files alphabetical).
		sort_direction:		'ascending',				// Choose from: 'ascending' (A-Z) [default] or 'descending' (Z-A).
		texteditor_view:	'styled',					// Options: 'raw','styled','html'
		theme:				'light',					// Options: 'light' or 'dark'
		ui_font:			'system-ui, sans-serif',	// Choose an installed font for the UI; if undefined, use browser defaults instead. [system-ui, sans-serif]
		ui_font_size:		'13px',						// Choose a default UI font size; use any standard CSS units.
		ui_scale:			'100',
	}
	let UI_Settings = {...UI_Prefs_Bool, ...UI_Prefs_Non_Bool};
	const Item_Kinds = {
		dir:			['/'],																																// loaded in iframe#content_iframe
		app:			['app/','app','appimage','apk','exe','ipa','ipk','jar','msi','wsf'],																// generally ignored; some apps may be opened as directories
		alias:			['alias','desktop','directory','lnk','symlink','symlink/'],
		archive:		['7z','archive','b6z','bin','bzip','bz2','cbr','dmg','gz','iso','mpkg','pkg','rar','sit','sitx','tar','tar.gz','zip','zipx','zxp'], // ignored
		audio:			['aac','aif','aiff','ape','flac','m4a','mka','mp3','ogg','opus','wav'],																// loaded in audio#audio
		bin:			['a','ase','bundle','dll','dyld','dylib','gem','icc','msi','profraw','pyc','pyo','o','rakefile','ri','so','torrent','xml','2','opml','qm','scpt','uo','vsix','zwc'], // ignored
		code:			['bak','bash','bash_profile','bashrc','bat','cgi','com','c','cfg','cnf','codes','coffee','conf','csh','cshrc','cson','css','cuetxt','custom_aliases','d','default','description','dist','editorconfig', 'emacs','example','gemspec','gitconfig','gitignore','gitignore_global','h','hd','ini','js','json','jsx','less','list','local','login','logout','lua','mkshrc','old','pc','php','pl','plist','pre-oh-my-zsh','profile','pth','py','rb','rc','rdoc','sass','settings','sh','strings','taskrc','tcl','viminfo','vimrc','vue','vtt','yaml','yml','zlogin','zlogout','zpreztorc','zprofile','zsh','zshenv','zshrc'],				// treated as text, opened in iframe#content_iframe text editor
		database:		['accdb','db','dbf','mdb','pdb','sql', 'sqlite','sqlitedb','sqlite3'],																// ignored
		ebook:			['azw','azw1','azw3','azw4','epub','ibook','kfx','mobi','tpz'],																		// ignored
		font:			['otf','ttf','woff','woff2','afm','pfb','pfm','tfm'],																				// opened in div#content_font
		graphics:		['afdesign','afpub','ai','book','dtp','eps','fm','icml','icns','idml','indb','indd','indt','inx','mif','pmd','pub','qxb','qxd','qxp','sla','swf','ai','arw','cr2','dng','eps','jpf','nef','psd','psd','raw', 'tif','tiff'], // ignored
		htm:			['htm','html','xhtm','xhtml'],																										// opened in iframe#content_iframe
		image:			['apng','avif','bmp','gif','ico','jpeg','jpg','png','svg','webp'],
		link:			['url','webloc','inetloc'],
		markdown:		['md','markdown','mdown','mkdn','mkd','mdwn','mdtxt','mdtext','mk'],																// treated as text, opened in iframe#content_iframe text editor
		other_ignored:	['alias','cue','dat','dic','idx','xmp'],
		office:			['csv','doc','docx','key','numbers','odf','ods','odt','pages','rtf','scriv','wpd','wps','xlr','xls','xlsx','xlm'],					// ignored
		playlist:		['m3u','m3u8','pls','asx','wpl','xspf'],
		pdf:			['pdf'],																															// open in #content_pdf
		system:			['DS_Store','ds_store','icon','ics','spotlight-v100/','temporaryitems/','documentrevisions-v100/','trashes/','fseventsd/','dbfseventsd','file','programdata','localized'], // ignored system items
		text:			['log','nfo','txt','text','readme'],																								// opened in iframe#content_iframe text editor
		video:			['m4v','mkv','mov','mp4','mpeg','webm']																								// loaded in video#content_video
	};
	const Item_Settings = {		// ITEM_SETTINGS: Ignore or Exclude files by extension (prevents browser from attempting to download the file).
		ignored: [...Item_Kinds.archive,...Item_Kinds.bin,...Item_Kinds.database,...Item_Kinds.graphics,...Item_Kinds.other_ignored,...Item_Kinds.office,...Item_Kinds.playlist,...Item_Kinds.system]
	};

	// ***** UTILITIES ***** //
	function loadFileURL() {																												// ===> LOAD FILE URL
		// if window.location points to a file, change the location to the file's container dir, add search_param of file name; then load the file's container dir and load file in content pane.
		let search_params = searchParamsGet();
			search_params.set( 'file', window.location.pathname.split('/').reverse()[0]);
			window.location = window.location.pathname.slice( 0,window.location.pathname.lastIndexOf('/') ) +'/?'+ search_params ;
		return;
	}
	if ( !window.location.pathname.endsWith('/') && window.top === window.self ) { loadFileURL(); }										// load file urls
	//==============================//
	function isTopWindow() { return ( window.top === window.self || false ) }																// ===> TOP WINDOW OR IFRAME
	function getBrowser() { //*** needs testing for new userAgentData object --> what are possible brand names?; combine with getOS()		// ===> GET BROWSER
		let brand = ( navigator.userAgentData !== undefined ? navigator.userAgentData.brands[1].brand.toLowerCase() : navigator.userAgent );
		switch(true) {
			case brand === 'chromium' || ( /chrome?chromium/.test(brand) ):	return 'is_chrome';
			case brand === 'msie'	  || ( /msie/.test(brand) ):	return 'is_explorer';
			// case brand === 'edge'	  || ( /edge/.test(brand) ):	return 'is_edge'; // need case for ms edge
			case brand === 'opera'    || ( /opera/.test(brand) ):	return 'is_opera';
			case brand === 'safari'   || ( /safari/.test(brand) ):	return 'is_safari';
			case brand === 'firefox'  || ( !/chrome|chromium/.test(brand) ):	return 'is_gecko';
		}
	}
	function getOS() { // modded from https://***stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js	// ===> GET OS
		let platform = ( navigator.userAgentData !== undefined ? navigator.userAgentData.platform : window.navigator.platform ).toLowerCase();
		let macos_platforms = ['macos','macintosh','macintel','macppc','mac68k'], windows_platforms = ['win32','win64','windows','wince'], os = null;
		switch(true) {
			case macos_platforms.indexOf(platform) !== -1:		os = 'macos';	break;
			case windows_platforms.indexOf(platform) !== -1:	os = 'windows';	break;
			// case iosPlatforms.indexOf(platform) !== -1:		os = 'ios';		break; // just in case;
			// case /Android/.test(userAgent):					os = 'android';	break; // just in case;
			case !os && /Linux/.test(platform):					os = 'linux';	break;
		}
	  return os;
	}
	function newURL(link) { try { return new URL(link,document.baseURI); } catch( error ) { return new URL(encodeURI(link) ); } }							// ===> NEW URL
	function decodeURIComponentSafe(str) { if ( !str ) { return str; } // ===> DECODE URI COMPONENT SAFE; // Fix "%" error in file name; see stackoverflow.com/questions/7449588/why-does-decodeuricomponent-lock-up-my-browser
		try { return decodeURIComponent(str.replace(/%(?![0-9a-fA-F]{2})/g,'%25') ).replace(/\"/g,'\&quot;');  } catch(e) { return str; }	// replace % with %25 if not followed by two a-f/number; replace " with html entity
	}
	//function sanitizeReservedChars(str) { let chars = ['#','$','&','+',',','/',':',';','=','?','@','[',']']; }
	//function escapeStr(str) { str = str.replace(/([$?*+()[]|^])/g,'\\$1'); return str; }																	// ===> ESCAPE STRING
	function convertHex2Decimal(d) { return parseInt(d, 16); }
	function convertDecimal2Hex(d, padding) { let hex = Number(d).toString(16); hex = ( isNaN(hex) ? null :  "000000".substr(0, padding - hex.length) + hex ); return hex; }
	//==============================//
	const window_protocol = window.location.protocol;																										// GLOBAL: protocol
	//const window_origin = window_protocol +'//'+ window.location.host;																					// GLOBAL: origin
	  let window_location = decodeURIComponentSafe( [location.protocol, '//', location.host, location.pathname].join('') );									// GLOBAL: current location
	const current_dir_path = window_location.replace(/([/|_|—])/g,'$1<wbr>').replace(/\\/g,'/');															// GLOBAL: current dir path w/o query string for display
	// const current_dir = window_location.split('/').slice(-2,-1).toString();																				// GLOBAL: current dir
	//==============================//
	function setLocation(link) { link = ( Array.isArray(link) ? link[0] : link); window.location = link; }
	function changeLocation(args) { // args[0] === href, args[1] === 'external || ok'
		switch(true) {
			case args[1] === 'external':										window.open(args[0]);											break;	// open external menu links: about, coffee, contact
			case args[1] === 'ok':												window.location = args[0];										break;
			case ( /has_\w+list/.test(getClassNames('body'))):					args = window.location.href;											// nobreak; show playlist warning
			default:															showWarning( 'setLocation',args );
		}
	}
	function searchParamsGet()					{ let search_params = new URL(window.location)?.searchParams; search_params.sort(); return search_params; }			// ===> GET SEARCH PARAMS
	function searchParamSet(key,value,bool)		{ let search_params = searchParamsGet(); search_params.set( key, value ); if ( bool !== false ) { updateSearchParams(search_params);} }	// ===> SET SEARCH PARAM (bool false = don't update)
	function searchParamDelete(key)		{ let search_params = searchParamsGet(); search_params.delete(key);		updateSearchParams(search_params); }				// ===> REMOVE SEARCH PARAM
	function updateSearchParams(search_params) {																													// ===> UPDATE SEARCH PARAMS
		search_params = sanitizeSearchParams(search_params);		search_params.sort();																				// sort and sanitize params
		let search_params_str = search_params.toString().replace(/%2F/g,'').replace('/','').replace(/%2Cfalse/g,'');													// further sanitization
		let new_location = ( search_params_str.length === 0 ? window.location.pathname : window.location.pathname +'?'+ search_params_str );							// don't add ? if no search params
		window.history.replaceState({}, document.title, new_location);																									// set new location
		if ( isTopWindow() ) { updateParentLinks(); }
	}
	function sanitizeSearchParams(search_params_str) {																													// remove search_params that are not in UI_Settings
		for ( let entry of search_params_str.entries() ) { if ( !UI_Settings[entry[0]] && !/selected|history|width/.test(entry[0]) ) { search_params_str.delete(entry[0]); } }		return search_params_str;
	}
	function getCurrentUIPref(pref_id) {																															// ===> GET SEARCH PARAM value by key
		let search_params = searchParamsGet(), value = '';
		switch(true) {
			case pref_id === 'width': if ( !isTopWindow() ) { return; }																								// width: set the stored sidebar width or use default 30%
				value = ( !search_params.has(pref_id) || window.innerWidth === 0 ? 30 : Math.round(100 * Number.parseInt(search_params.get('width'))/window.innerWidth) );	break;	// percentage
			case pref_id === 'parent_id':
				value = ( search_params.has(pref_id) ? search_params.get(pref_id) : UI_Settings?.[pref_id] ? UI_Settings[pref_id]?.toString() : '' );						break;	//
			default:																												// if query_string has key/value pair, use it, else use key/value pair from UI_Settings
				value = ( search_params.has(pref_id) ? search_params.get(pref_id) : UI_Settings?.[pref_id] ? UI_Settings[pref_id]?.toString() : pref_id )?.toString();
				value = ( value?.replace('%2F','')?.replace('/','') || '' );															// some servers add a '/' to end of query string
		}																																									return value;
	}
	function getNewUIPref(key) {
		let value, bool_prefs = Object.keys(UI_Prefs_Bool);
		let non_bool_prefs = {
			'sort_direction_ascending':		{'sort_direction':'descending'},		'sort_direction_descending':	{'sort_direction':'ascending'},			'sort_by_name':					{'sort_by':'name'},
			'sort_by_default':				{'sort_by':'default'},					'sort_by_duration':				{'sort_by':'duration'},					'sort_by_size':					{'sort_by':'size'},
			'sort_by_date':					{'sort_by':'date'},						'sort_by_kind':					{'sort_by':'kind'},						'sort_by_ext':					{'sort_by':'ext'},
			'texteditor_view':				{'texteditor_view':getCurrentUIPref('texteditor_view')},
			'texteditor_view_raw':			{'texteditor_view':'raw'},				'texteditor_view_styled':		{'texteditor_view':'styled'},			'texteditor_view_html':			{'texteditor_view':'html'},
			'theme':						{'theme':(getCurrentUIPref('theme') === 'light' ? 'dark' : 'light') },
			'theme_dark':					{'theme':'dark'},						'theme_light':					{'theme':'light'},
			'ui_font':						{'ui_font':getCurrentUIPref('ui_font')},'ui_scale':						{'ui_scale':getCurrentUIPref('ui_scale')}
		}
		switch(true) {
			case bool_prefs.includes(key):	return ( getCurrentUIPref(key) === 'true' ? [key,'false'] : [key,'true']);								 // toggle bool prefs
			default: value = Object.values( non_bool_prefs[key] ).toString(); key = Object.keys(non_bool_prefs[key]).toString(); return [key,value]; // get value for key; then key (i.e., don't redefine key before getting value)
		}
	}
	let setWarningItemNotLoadedID;
	let str = '';																																	// global str var;
	function timeoutID() { return window.setTimeout( () => { str = ''; }, 1000 ); }															// ===> TIMEOUT ID: reset typed string to '' after 1.5 sec.
	//==============================//
	function getEl(sel)				{ try { return document.querySelector(sel); } catch (error) { return null; } }
	function getEls(sel)			{ try { return document.querySelectorAll(sel); } catch (error) { return null; } }
	function elExists(sel)			{ return ( document.querySelector(sel) !== null ? true : false ); }
	function getVisibleElsBySelector(sel) {																									// ===> GET VISIBLE ELS BY SELECTOR // remove els with display:none or 0 width/height
		let els = Array.from( getEls(sel) ).filter( (el) => { let el_styles = window.getComputedStyle(el); return ( el_styles.getPropertyValue('display') !== 'none' || ( el?.offsetWidth > 0 || el?.offsetHeight > 0 ) ); });
		return els;
	}
	function getContentPaneData() { return getAttr('#content_pane','data-content'); }														// ===> GET CONTENT_PANE DATA content
	function hasContent(args) {																												// ===> HAS CONTENT?
		switch(true) {
			case args === undefined:		return ( hasClass('#content_pane','has_audio') || getContentPaneData() !== 'has_null' ? true : false );	// has any content
			case args.includes('audio'):	return ( hasClass('#content_pane','has_audio') && ( args.includes('ignore') || getContentPaneData() === 'has_null') ? true : false );	// has audio only or ignore other content
			case args.includes('_'):		return hasClass('#content_pane','has_'+args);
			default: return ( args.split(',').includes( getContentPaneData()?.split('_')[1] ) ? true : false );								// has named content (e.g., pdf, iframe)
		}
	}
	//==============================//
	function getClassNames(sel)			{ return getEl(sel)?.className; }
	function hasClass(sel,classname)	{ let el = getEl(sel); return el?.classList.contains(classname); }																					// ===> HAS CLASS
	function addClass(sel,classname)	{ let els = Array.from(getEls(sel)), classes = classname.split(' ').filter(item => item);	els?.forEach( el => el.classList.add(...classes) ); }	// ===> ADD CLASS
	function removeClass(sel,classname) {																																					// ===> REMOVE CLASS
		let els = Array.from(getEls(sel)), classes = ( classname?.split(' ')?.filter(item => item) || null );
		if ( classname === undefined || classes === null ) { els?.forEach( el => el.removeAttribute('class') ); } else { els?.forEach( el => el.classList.remove(...classes) ); }			// if no className, remove all classes
	}
	function addRemoveClassSiblings(sel,classname) {																																	// ===> ADD/REMOVE CLASS SIBLINGS
		let el = document.querySelector(sel), siblings =  el?.parentElement.children;
		if ( el !== null ) { Array.from(siblings).forEach( sibling => sibling.classList.remove(...classname.replace(/\s{2,}/g,' ').split(' ') ) ); addClass(sel,classname); } // remove class from els & add class to selected el
	}
	//==============================//
	function getAttr(sel,attributeName)						{ return getEl(sel)?.getAttribute(attributeName); }														// ===> GET ATTRIBUTE
	function hasAttr(sel,attributeName)						{ return getEl(sel)?.hasAttribute(attributeName); }														// ===> HAS ATTRIBUTE
	function setAttr(sel,attributeName,value)				{ getEl(sel)?.setAttribute(attributeName,value); }														// ===> SET ATTRIBUTE
	function removeAttr(sel,attributeNamesArr)	{																													// ===> REMOVE ATTRIBUTE
		if ( typeof attributeNamesArr === 'string' ) { attributeNamesArr = [attributeNamesArr]; }
		let els = getEls(sel);	Array.from(els)?.forEach( el => attributeNamesArr.forEach( attributeName => el.removeAttribute(attributeName) ) );
	}
	function getData(sel,keyname)							{ let el = ( typeof sel === 'string' ? getEl(sel) : sel ); return el?.getAttribute('data-'+keyname); }	// ===> GET DATASET
	function setData(sel,keyname,value)						{ if ( elExists(sel) ) { setAttr(sel,'data-'+keyname, value); } }										// ===> SET DATASET
	function deleteData(sel,keyname)						{ removeAttr(sel,'data-'+keyname); }																	// ===> REMOVE DATASET
	function setStyle(sel,property,value)					{ getEl(sel)?.style.setProperty(property,value); }														// ===> SET STYLE
	function setValue(sel,value)							{ getEl(sel).value = value; }																			// ===> SET VALUE
	//==============================//
	function clickThis(sel)									{ let el = getEl(sel); ( el?.querySelector('a')?.click() || el?.click() ) }								// ===> CLICK THIS by CSS selector
	// function dblclick(el,func)							{ var evt = new MouseEvent('dblclick'); el.addEventListener(evt,func); el.dispatchEvent(evt); }			// ===> DOUBLE CLICK
	function altKey(e)										{ return ( !e.metaKey && !e.ctrlKey && e.altKey && !e.shiftKey ); }										// ===> ALT KEY test
	function altShiftKey(e)									{ return ( !e.metaKey && !e.ctrlKey && e.altKey && e.shiftKey ); }										// ===> ALT SHIFT KEY test
	function cmdKey(e)										{ return ( (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey ); }									// ===> CMD/CTRL KEY test
	function cmdAltKey(e)									{ return ( (e.metaKey || e.ctrlKey) && e.altKey && !e.shiftKey ); }										// ===> CMD/CTRL ALT KEY test
	function cmdShiftKey(e)									{ return ( (e.metaKey || e.ctrlKey) && !e.altKey && e.shiftKey ); }										// ===> CMD/CTRL SHIFT KEY test
	// function cmdAltShiftKey(e)							{ return ( (e.metaKey || e.ctrlKey) && e.altKey && e.shiftKey; }										// ===> CMD/CTRL ALT SHIFT KEY test (not used)
	function eStopPrevent(e)								{ e?.preventDefault(); e?.stopPropagation(); }
	//============================//
	// ***** BASIC UI FUNCTIONS ***** //
	function scrollThis(container_ID,sel,bool) {																							// ===> SCROLL to Selected Item
		let container = getEl(container_ID);
		const isInViewport = (sel) => { 
			const rect = ( getEl(sel) !== null ? getEl(sel).getBoundingClientRect() : null ); if ( rect === null ) { return false; }
			return ( 
				rect.top >= getEl('#sidebar_header').offsetHeight && rect.bottom <= (window.innerHeight - getEl('#sidebar_footer').offsetHeight || document.documentElement.clientHeight - getEl('#sidebar_footer').offsetHeight) 
			);
		}
		if ( container?.height === 0 || isInViewport(sel) ) { return; }	// don't scroll hidden elements
		let scroll_el = container?.querySelector(sel), scroll_behavior = ( ( bool !== undefined || bool === true ) ? 'instant' : 'smooth' ), scroll_block = ( hasClass('body','is_gecko') ? 'start' : 'center' );
		scroll_el?.scrollIntoView({ behavior:scroll_behavior, block:scroll_block, inline:'nearest' });
	}
	function mouseMove(e,sel,startX,startY,elOffsetLeft,elOffsetTop) {																		// ===> Init events to allow glyphs to be dragged into view
		let scale_factor = ( sel === '#font_specimen_glyph' ? 2 : 1 );																				// scale_factor needed for svg glyphs
		setStyle(sel,'left',elOffsetLeft + (e.pageX - startX)*scale_factor + 'px'); setStyle(sel,'top',elOffsetTop + (e.pageY - startY)*scale_factor +'px');
	}
	//==============================// OPEN/SAVE FILES
	function openFile(args) { menuClose();																									// ===> OPEN FILE; type: font or playlist.
		if ( window.File && window.FileReader && window.FileList && window.Blob ) {																						// if browser supports file API...
			let files = args[0].target.files[0], id = args[1], reader = new FileReader();
			switch(id) { case 'open_font': reader.readAsArrayBuffer(files);	break;		case 'open_playlist': reader.readAsText(files);						break; }	// get the file reader
			reader.onload = () => {																																		// on file reader load
				switch(true) {
					case id === 'open_font':	 openFontFile(files,reader);					break;
					case id === 'open_playlist': openPlaylist(files.name,'',reader.result);		break;
				}	// open the file
				return true;
			}
			getEl('#'+id).value = '';																										// reset input to allow same item to be reopened immediately after closing
		} else { alert('Can\'t open file: file APIs are not fully supported in this browser.'); }											// else error
	}
	function saveFile(content,mimetype,file_name) {																							// ===> SAVE FILE
		let blob = new Blob([content], {type: mimetype});
		let download_el = window.document.createElement('a'); download_el.style = "display:none"; download_el.href = window.URL.createObjectURL(blob); download_el.download = file_name;	// define & style download_el
		document.body.appendChild(download_el);		download_el.click();	document.body.removeChild(download_el);		URL.revokeObjectURL(blob);											// add download_el, click, & remove
	}
	// END UTILITIES
	//==============================//
	// ***** SET UP UI ELEMENTS ***** //
	function updateParentLinkSearchParams(str) { //*** decrement selected and history values ***//											// ===> UPDATE PARENT LINK SEARCH PARAMS
		let query_str = new URLSearchParams(str);	query_str.sort();																				// make new search params from window.location.search
		let history = ( query_str.has('history') ? query_str.get('history') : undefined );
		switch(true) {
			case history !== undefined:
				history = history.split(' ');
				switch(true) {
					case history.length > 1:	query_str.set('selected',history[0]);	history.shift();	query_str.set('history',history.join('+')); break;
					case history.length === 1:	query_str.set('selected',history[0]);	history.shift();	query_str.delete('history'); break;
				}
				break;
			default: query_str.delete('selected');
		}
		return decodeURIComponentSafe(query_str.toString());
	}
	function createParentLinks() {																											// ===> CREATE PARENT LINKS
		let link, links = [], search_params = searchParamsGet();	search_params.sort();
		let query_str = search_params.toString();
		let link_pieces = window_location.split('/');	link_pieces = link_pieces.slice(2,-2);	// make array of parent directories; remove beginning and ending empty elements and current directory
		while ( link_pieces.length > 0 ) {																											// while there are link pieces...
			query_str = updateParentLinkSearchParams(query_str);																					// update selected and history
			link = window_protocol +'//'+ link_pieces.join('/') + '/?' + query_str;		links.push(link);	link_pieces.pop();						// assemble link; add to link array; remove last link piece and repeat...
		}
		return links;
	}
	function createParentLinkItems() {																										// ===> CREATE PARENT LINK ITEMS
		let parent_link_menu_items = [], links = createParentLinks();
		for ( let i = 0; i < links.length; i++ ) {
			let display_name = links[i].split('/?')[0];	display_name = display_name.replace(/\//g,'\/<wbr>');
			let menu_item = `<li><a id="parents_link_${i}" href="${ links[i] }" class="display_block padding_4_8">${ display_name }/</a></li>`;
			parent_link_menu_items.push(menu_item);
		}
		let parent_link = ( links[0] === undefined ? window.location.href : links[0]);	parent_link = parent_link.replace(/parents_link_/,'parent_link_');
		return [parent_link_menu_items.join(''),parent_link];																										// return parents link items
	}
	function updateParentLinks() {																															// ===> UPDATE PARENT LINKS and init new item events
		let links = createParentLinkItems();	getEl('#parents_links').innerHTML = links[0];		getEl('#parent_dir_nav a').href = links[1];						// add the links
		getEls('#sidebar_menu_parent a,#parents_links a').forEach( el => el.onclick = function(e) { eStopPrevent(e); showWarning('changeLocation',[this.href,'false']); });		// reinit onclick
	}
	//==============================//
	// SVG UI ICONS
	const SVG_UI_Icons = {
		'arrow':				'<svg class="icon_arrow invert" viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\' class=\'invert\'><path fill=\'%23888\' fill-opacity=\'.75\' d=\'m4 4 12 6-12 6z\'/></svg>',
		'bookmark':				'<svg viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\' class=\'invert\'><path fill=\'%23888\' d=\'m2 2c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v18l-8-4-8 4zm2 0v15l6-3 6 3v-15z\'/></svg>',
		'check_mark':			'<svg viewBox=\'0 0 12 9\' xmlns=\'http://www.w3.org/2000/svg\'><path fill=\'currentColor\' d=\'m-.071 10.929 2.571-2.571 4.5 4.499 10.285-10.285 2.571 2.572-12.856 12.856z\' transform=\'matrix(.55 0 0 .55 .578932 -1.01245)\'/></svg>',
		'chevron':				'<svg viewBox=\'0 0 24 14\' id=\'svg_chevron\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m0 0v14h3v-11h11v-3z\' transform=\'matrix(.707107 .707107 -.707107 .707107 11.8995 1)\'/></svg>',
		'document':				'<svg viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'><path fill=\'%23222222\' d=\'M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z\' /></svg>',
		'error':				'<svg viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'><g fill-opacity=\'.75\'><path d=\'m1.075 18.05 8.146-16.683c.236-.484.924-.491 1.169-.011l8.537 16.683c.223.435-.093.952-.582.952h-16.683c-.483 0-.799-.507-.587-.941z\' fill=\'%23ffb636\' /><path d=\'m11.055 7.131-.447 6.003c-.034.45-.425.787-.874.753-.408-.03-.724-.356-.753-.753l-.447-6.003c-.052-.696.47-1.302 1.167-1.354.696-.052 1.302.47 1.354 1.166.005.061.004.129 0 .188zm-1.26 8.037c-.641 0-1.159.518-1.159 1.158 0 .641.518 1.159 1.159 1.159.64 0 1.158-.518 1.158-1.159 0-.64-.518-1.158-1.158-1.158z\'/></g></svg>',
		'external_link':		'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M10.443,2.5l-3.439,-0l0,-1.5l5.996,0l0,6.02l-1.5,0l0,-3.455l-5.716,5.715l-1.06,-1.06l5.719,-5.72Zm1.057,5.5l-0,5l-10.5,0l-0,-10.5l5,0l-0,1.5l-3.5,0l-0,7.5l7.5,0l-0,-3.5l1.5,0Z\' style=\'fill:%23888;\'/></svg>',
		'folder':				'<svg viewBox=\'0 0 20 20\'><path fill=\'%23222\' d=\'m0 4c0-1.1.9-2 2-2h7l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2-2zm2 2v10h16v-10z\'/></svg>',
		'grid':					'<svg viewBox=\'0 0 20 20\'><path fill=\'currentColor\' d=\'M0 0h9v9H0V0zm2 2v5h5V2H2zm-2 9h9v9H0v-9zm2 2v5h5v-5H2zm9-13h9v9h-9V0zm2 2v5h5V2h-5zm-2 9h9v9h-9v-9zm2 2v5h5v-5h-5z\' /></svg>',
		'menu':					'<svg viewBox=\'0 0 13 10\'><g fill=\'%23222\'><path d=\'m0 0h13v2h-13z\'/><path d=\'m0 4h13v2h-13z\'/><path d=\'m0 8h13v2h-13z\'/></g></svg>',
		'minus':				'<svg viewBox=\'0 0 20 20\'><path fill=\'%23222\' d=\'m1 8h18v4h-18z\'/></svg>',
		'multiply':				'<svg viewBox=\'0 0 20 20\' id=\'svg_multiply\'><path fill=\'%23222\' d=\'m10 7 6-6 3 3-6 6 6 6-3 3-6-6-6 6-3-3 6-6-6-6 3-3z\'/></svg>',
		'music':				'<svg width=\'100%\' height=\'100%\' viewBox=\'0 0 84 84\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' xml:space=\'preserve\' style=\'fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;\'><path d=\'M66.613,58.258c-0,3.775 -1.721,6.934 -5.163,9.475c-3.154,2.309 -6.683,3.463 -10.588,3.463c-2.283,-0 -4.158,-0.538 -5.616,-1.617c-1.621,-1.229 -2.429,-2.95 -2.429,-5.158c-0,-3.492 1.658,-6.558 4.966,-9.204c3.134,-2.488 6.496,-3.734 10.088,-3.734c3.029,0 5.237,0.605 6.625,1.809l-0,-39.538l-28.146,7.584l-0,44.891c-0,3.775 -1.721,6.929 -5.158,9.471c-3.159,2.313 -6.688,3.467 -10.588,3.467c-2.287,-0 -4.158,-0.542 -5.625,-1.617c-1.617,-1.233 -2.425,-2.954 -2.425,-5.158c0,-3.492 1.658,-6.559 4.967,-9.204c3.133,-2.488 6.496,-3.734 10.087,-3.734c3.029,0 5.238,0.604 6.621,1.809l0,-48.355l32.383,-8.741l0.001,54.091Z\' style=\'fill:%23888;fill-opacity:0.4;fill-rule:nonzero;\'/></svg>',
		'plus':					'<svg viewBox=\'0 0 20 20\'><path fill=\'%23222\' d=\'m8.001 1h3.999v7h7v4h-7l-.001 7h-3.999v-7h-7v-4h7z\'/></svg>',
		'prev_next_track':		'<svg viewBox=\'0 0 20 20\'><path fill=\'%23222\' d=\'m13 5h2v10h-2zm-8 0 8 5-8 5z\'/></svg>',
		'spinner':				'<svg viewBox=\'0 0 100 100\' class=\'display_none invert\' preserveAspectRatio=\'xMidYMid\' width=\'32\' height=\'32\' xmlns=\'http://www.w3.org/2000/svg\' id=\'loading_spinner\'><animateTransform attributeName=\'transform\' type=\'rotate\' values=\'0;45\' keyTimes=\'0;1\' dur=\'0.25s\' repeatCount=\'indefinite\'/><path fill=\'%23000\' fill-opacity=\'.66\' d=\'m29.49-5.5h8v11h-8a30 30 0 0 1 -4.75 11.46l5.66 5.66-7.78 7.78-5.66-5.66a30 30 0 0 1 -11.46 4.75v8h-11v-8a30 30 0 0 1 -11.46-4.75l-5.66 5.66-7.78-7.78 5.66-5.66a30 30 0 0 1 -4.75-11.46h-8v-11h8a30 30 0 0 1 4.75-11.46l-5.66-5.66 7.78-7.78 5.66 5.66a30 30 0 0 1 11.46-4.75v-8h11v8a30 30 0 0 1 11.46 4.75l5.66-5.66 7.78 7.78-5.66 5.66a30 30 0 0 1 4.75 11.46m-29.49-14.5a20 20 0 1 0 0 40 20 20 0 1 0 0-40\' transform=\'matrix(.7189408 .69507131 -.69507131 .7189408 50 50)\'/></svg>',
		'toggle':				'<svg viewBox=\'0 0 20 20\'><g fill=\'%23222\'><path d=\'m10.207 9.293-.707.707 5.657 5.657 1.414-1.414-4.242-4.243 4.242-4.243-1.414-1.414z\'/><path d=\'m4.207 9.293-.707.707 5.657 5.657 1.414-1.414-4.242-4.243 4.242-4.243-1.414-1.414z\'/></g></svg>',
		'ui_layout':			'<svg width=\'100px\' height=\'100%\' viewBox=\'0 0 50 39\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' xml:space=\'preserve\' xmlns:serif=\'http://www.serif.com/\' style=\'fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;\'><rect x=\'0.5\' y=\'0.5\' width=\'14.5\' height=\'38\' style=\'fill:rgb(204,204,204);\'/><path d=\'M50,0L50,39L0,39L0,0L50,0ZM49,1L1,1L1,38L49,38L49,1Z\'/><path d=\'M15,0.5L15,38.5\' style=\'fill:none;stroke:black;stroke-width:1px;\'/><g transform=\'matrix(1,0,0,1,0,1.5)\'><path d=\'M0.5,5L15,5\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,15.0936,-0.5)\'><path d=\'M0,5L34.406,5\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g><g transform=\'matrix(1,0,0,1,0,1.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,1.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,3.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,5.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,7.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,9.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,11.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,13.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,15.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,17.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,19.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,21.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,23.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,25.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,27.5)\'><path d=\'M2.5,7L3,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><path d=\'M0.5,36.5L15,36.5\' style=\'fill:none;stroke:black;stroke-width:1px;\'/><g transform=\'matrix(1,0,0,1,0,1.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,3.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,5.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,7.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,9.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,11.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,13.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,15.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,17.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,19.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,21.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,23.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,25.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g><g transform=\'matrix(1,0,0,1,0,27.5)\'><path d=\'M5,7L13,7\' style=\'fill:none;stroke:black;stroke-width:1px;\'/></g></g><g class=\'invert\'><g transform=\'matrix(1.42857,0,0,1.42857,22.5,10.5)\'><path d=\'M0.369,9.141C0.117,8.463 0,7.745 0,7C0,3.137 3.137,0 7,0C10.863,0 14,3.137 14,7L13.863,8.353L10.01,4.5L6.51,8L4.01,5.5L0.369,9.141Z\' style=\'fill:rgb(128,128,255);fill-rule:nonzero;\'/></g><g transform=\'matrix(1.42857,0,0,1.42857,22.5,10.5)\'><path d=\'M0.839,10.151L0.369,9.141L4.01,5.5L6.51,8L10.01,4.5L13.863,8.353C13.787,8.748 13.662,9.131 13.522,9.5L3.151,12.845C2.858,12.651 2.572,12.429 2.313,12.194L0.839,10.151Z\' style=\'fill:white;fill-rule:nonzero;\'/></g><g transform=\'matrix(1.42857,0,0,1.42857,22.5,10.5)\'><path d=\'M13.522,9.5C12.532,12.14 9.983,14 7,14C5.574,14 4.247,13.579 3.151,12.845L10.01,5.979L13.522,9.5Z\' style=\'fill:rgb(51,51,204);fill-rule:nonzero;\'/></g><g transform=\'matrix(1.42857,0,0,1.42857,22.5,10.5)\'><path d=\'M0.839,10.151L4.01,6.979L5.771,8.74L2.312,12.194C1.721,11.562 1.233,10.881 0.839,10.151Z\' style=\'fill:rgb(51,51,204);fill-rule:nonzero;\'/></g><g transform=\'matrix(1.42857,0,0,1.42857,22.5,10.5)\'><circle cx=\'6\' cy=\'3.5\' r=\'1.5\' style=\'fill:white;\'/></g></g></svg>'
	};
	function get_SVG_UI_Icon(icon_name)				{ return `url("data:image/svg+xml;utf8,${ SVG_UI_Icons[icon_name] }")`; }
	const SVG_UI_File_Icons = { // n.b.: order is important
		'file_icon_dir':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m6 2.5-1-1.5h-5v12h14v-10.5z\' fill=\'%2339f\'/><path d=\'m1.5 4h11v7.5h-11z\' fill=\'%239cf\'/></svg>',
		'file_icon_dir_open':		'<svg viewBox=\'0 0 14 14\' clip-rule=\'evenodd\' fill-rule=\'evenodd\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m6.1 2.7-1.3-1.7h-4.8v12h14v-10.3z\' fill=\'%2339f\' fill-rule=\'nonzero\'/><path d=\'m7 6h5.5v5.5h-11z\' fill=\'%239cf\'/></svg>',
		'file_icon_file':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m8.3 0h-6.8v14h11v-9.8l-4.2-4.2z\' fill=\'%23888\'/><g fill=\'%23fff\'><path d=\'m11 12.5h-8v-11h3.8v4.2h4.2z\'/><path d=\'m8.3 4.2h1.9l-1.9-2z\'/></g></svg>',
		'file_icon_invisible':		'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m8.3 0h-6.8v14h11v-9.8l-4.2-4.2z\' fill=\'%23888\'/><path d=\'m11 12.5h-8v-11h3.8v4.2h4.2z\' fill=\'%23bbb\'/><path d=\'m8.3 4.2h1.9l-1.9-2z\' fill=\'%23bbb\'/><circle cx=\'7\' cy=\'9\' fill=\'%23878787\' r=\'1.5\'/></svg>',
		'file_icon_ignored':		'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M 10.695,1.774 1.856,10.613 3.482,12.239 12.321,3.4 Z M 7,2 c 2.8,0 5,2.2 5,5 0,2.8 -2.2,5 -5,5 C 4.2,12 2,9.8 2,7 2,4.2 4.2,2 7,2 M 7,0 C 3.1,0 0,3.1 0,7 c 0,3.9 3.1,7 7,7 3.9,0 7,-3.1 7,-7 C 14,3.1 10.9,0 7,0 Z\' style=\'fill:%23888888;fill-opacity:1\' /></svg>',
		'file_icon_dirinvisible':	'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m6 2.5-1-1.5h-5v12h14v-10.5z\' fill=\'%23888\'/><path d=\'m1.5 4h11v7.5h-11z\' fill=\'%23bbb\'/><circle cx=\'7\' cy=\'7.5\' fill=\'%23888\' r=\'1.5\'/></svg>',
		'file_icon_alias':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m0 0h14v14h-14z\' fill=\'%23808080\'/><path d=\'m3 12.5c0-3.863 2.253-7.5 6.259-7.5\' fill=\'none\' stroke=\'%23fc6\' stroke-width=\'3\'/><path d=\'m13 5-4-4v8z\' fill=\'%23fc6\'/></svg>',
		'file_icon_archive':		'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m11 8.5v-1h2v2l-5 1h-2v1.5h4v1h-4v1h-3v-1h-2v-1h2v-1.5h-2v-2h2v-6.5h-2v-2h7l5 1v2h-2v-1h-5v6.5z\' fill=\'%23666\'/></svg>',
		'file_icon_app':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m6.125 0-.292 1.859c-.587.135-1.146.38-1.64.693v-.018l-1.532-1.094-1.221 1.221 1.094 1.532h.018c-.313.495-.559 1.051-.693 1.64l-1.859.292v1.75l1.859.292c.134.589.38 1.145.693 1.64h-.018l-1.094 1.532 1.221 1.221 1.532-1.094v-.018c.494.313 1.053.558 1.64.693l.292 1.859h1.75l.292-1.859c.596-.137 1.14-.372 1.64-.693l1.532 1.112 1.221-1.221-1.112-1.532c.309-.492.523-1.057.656-1.64l1.896-.292v-1.75l-1.896-.292c-.133-.583-.347-1.148-.656-1.64h.018l1.094-1.532-1.221-1.221-1.532 1.094v.018c-.5-.321-1.044-.556-1.64-.693l-.292-1.859h-1.75zm.875 4.667c1.288 0 2.333 1.036 2.333 2.333s-1.045 2.333-2.333 2.333-2.333-1.036-2.333-2.333 1.045-2.333 2.333-2.333z\' fill=\'%237a7ab8\'/></svg>',
		'file_icon_audio':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><circle cx=\'7\' cy=\'7\' fill=\'%230f8a8a\' r=\'7\'/><g fill=\'%23fff\'><path d=\'m11 9.5c-.019.681-.796 1.339-1.75 1.475-.966.138-1.75-.31-1.75-1s.784-1.362 1.75-1.5c.268-.038.523-.031.75.013v-4.488h-4v6.5c-.019.681-.796 1.339-1.75 1.475-.966.138-1.75-.31-1.75-1s.784-1.362 1.75-1.5c.268-.038.523-.031.75.013v-6.488l6-1z\'/><path d=\'m11 2-6 1v2l6-1z\'/></g></svg>',
		'file_icon_code':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m14 0h-14v14h14z\' fill=\'%2372d\'/><g fill=\'%23fff\'><path d=\'m5.923 12.965c-1.049 0-1.784-.161-2.209-.48-.425-.317-.638-.82-.638-1.503v-2.067c0-.446-.146-.764-.438-.95-.292-.188-.709-.281-1.256-.281v-1.368c.547 0 .967-.094 1.259-.28s.438-.5.438-.938v-2.092c0-.675.217-1.172.65-1.491.432-.32 1.164-.479 2.195-.479v1.312c-.401.01-.718.09-.952.24-.233.15-.348.426-.348.827v1.985c0 .876-.511 1.396-1.532 1.559v.083c1.021.154 1.532.67 1.532 1.544v1.997c0 .41.116.688.349.835.233.146.55.223.951.232z\'/><path d=\'m8.076 12.965v-1.313c.392-.009.706-.089.944-.239.236-.15.355-.426.355-.829v-1.996c0-.867.511-1.382 1.531-1.545v-.084c-1.02-.164-1.53-.679-1.53-1.546v-1.997c0-.41-.116-.688-.349-.834-.232-.146-.549-.224-.951-.233v-1.313c1.049 0 1.785.159 2.21.479.423.319.637.821.637 1.505v2.065c0 .447.146.765.438.951.292.187.711.28 1.257.28v1.367c-.546.012-.967.107-1.259.287-.293.183-.438.5-.438.945v2.08c0 .674-.217 1.172-.65 1.491-.432.319-1.165.479-2.195.479z\'/></g></svg>',
		'file_icon_database':		'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m14 2.5v9c0 1.38-3.137 2.5-7 2.5s-7-1.12-7-2.5v-9\' fill=\'%23808080\'/><path d=\'m13 2.5v9c0 .828-2.689 1.5-6 1.5s-6-.672-6-1.5v-9\' fill=\'%23b4b4b4\'/><path d=\'m14 8.5c0 1.38-3.137 2.5-7 2.5s-7-1.12-7-2.5\' fill=\'%23808080\'/><path d=\'m13 8.5c0 .828-2.689 1.5-6 1.5s-6-.672-6-1.5\' fill=\'%23b4b4b4\'/><path d=\'m14 5.5c0 1.38-3.137 2.5-7 2.5s-7-1.12-7-2.5\' fill=\'%23808080\'/><path d=\'m13 5.5c0 .828-2.689 1.5-6 1.5s-6-.672-6-1.5\' fill=\'%23b4b4b4\'/><ellipse cx=\'7\' cy=\'2.5\' fill=\'%23808080\' rx=\'7\' ry=\'2.5\'/><ellipse cx=\'7\' cy=\'2.5\' fill=\'%23b4b4b4\' rx=\'5.5\' ry=\'1.5\'/></svg>',
		'file_icon_ebook':			'<svg clip-rule=\'evenodd\' fill-rule=\'evenodd\' stroke-linejoin=\'round\' stroke-miterlimit=\'2\' viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m2.668-.001c1.705.001 3.492.35 4.332 1.257.84-.908 2.627-1.256 4.332-1.257h2.668v12.541c-.818 0-2.181.005-3 .023-1.184.026-3.008.42-3 1.437l-1-.017-1 .017c.008-1.017-2-1.437-3-1.437-.819 0-2.182-.023-3-.023v-12.541zm-1.168 1.5v9.501h1.286c1.086.025 2.213.081 3.204.568l.01.006v-8.576c0-1.136-1.49-1.398-2.336-1.47-.708-.059-1.438-.029-2.164-.029zm11 0c-.726 0-1.456-.03-2.164.029-.846.072-2.336.334-2.336 1.47v8.576l.01-.006c.991-.487 2.118-.543 3.204-.568h1.286z\' fill=\'%23222\' fill-rule=\'nonzero\'/></svg>',
		'file_icon_font':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m14 0h-14v14h14z\' fill=\'%23709\'/><path d=\'m4.678 11.179h1.393v-8.266h-2.616v1.052h-1.455v-2.553h10v2.554h-1.456v-1.053h-2.599v8.266h1.347v1.409h-4.614z\' fill=\'%23fff\'/></svg>',
		'file_icon_graphics':		'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m0 0h14v14h-14z\' fill=\'%23808080\'/><path d=\'m7.774 8.285 4.726 4.715-8-3.525-1.5-4.975h-2v-3.5h3.525l-.025 2 5 1.5 3.5 8-4.7-4.752c.127-.22.2-.476.2-.748 0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5c.283 0 .548-.079.774-.215z\' fill=\'%23ccc\'/></svg>',
		'file_icon_htm':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m6.967.5c-3.553.018-6.467 2.947-6.467 6.5 0 3.566 2.934 6.5 6.5 6.5s6.5-2.934 6.5-6.5c0-3.553-2.914-6.482-6.467-6.5zm.033 0v13m6.5-6.5h-13m1.467-4c3.004 2.143 7.062 2.143 10.066 0m0 8c-3.004-2.143-7.062-2.143-10.066 0m4.533-10.333c-1.874 1.582-2.957 3.914-2.957 6.366 0 2.453 1.083 4.785 2.957 6.367m1 0c1.874-1.582 2.957-3.914 2.957-6.367 0-2.452-1.083-4.784-2.957-6.366\' fill=\'%23fff\' stroke=\'%23e44d26\'/></svg>',
		'file_icon_ignoredimage':	'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m.369 9.141c-.252-.678-.369-1.396-.369-2.141 0-3.863 3.137-7 7-7s7 3.137 7 7l-.137 1.353-3.853-3.853-3.5 3.5-2.5-2.5z\' fill=\'%23808080\'/><path d=\'m.839 10.151-.47-1.01 3.641-3.641 2.5 2.5 3.5-3.5 3.853 3.853c-.076.395-.201.778-.341 1.147l-10.371 3.345c-.293-.194-.579-.416-.838-.651z\' fill=\'%23fff\'/><path d=\'m13.522 9.5c-.99 2.64-3.539 4.5-6.522 4.5-1.426 0-2.753-.421-3.849-1.155l6.859-6.866z\' fill=\'%23808080\'/><path d=\'m.839 10.151 3.171-3.172 1.761 1.761-3.459 3.454c-.591-.632-1.079-1.313-1.473-2.043z\' fill=\'%23808080\'/><circle cx=\'6\' cy=\'3.5\' fill=\'%23fff\' r=\'1.5\'/></svg>',
		'file_icon_image':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m.369 9.141c-.252-.678-.369-1.396-.369-2.141 0-3.863 3.137-7 7-7s7 3.137 7 7l-.137 1.353-3.853-3.853-3.5 3.5-2.5-2.5z\' fill=\'%238080ff\'/><path d=\'m.839 10.151-.47-1.01 3.641-3.641 2.5 2.5 3.5-3.5 3.853 3.853c-.076.395-.201.778-.341 1.147l-10.371 3.345c-.293-.194-.579-.416-.838-.651z\' fill=\'%23fff\'/><path d=\'m13.522 9.5c-.99 2.64-3.539 4.5-6.522 4.5-1.426 0-2.753-.421-3.849-1.155l6.859-6.866z\' fill=\'%2333c\'/><path d=\'m.839 10.151 3.171-3.172 1.761 1.761-3.459 3.454c-.591-.632-1.079-1.313-1.473-2.043z\' fill=\'%2333c\'/><circle cx=\'6\' cy=\'3.5\' fill=\'%23fff\' r=\'1.5\'/></svg>',
		'file_icon_markdown':		'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m14 0h-14v14h14z\' fill=\'%236a6a95\'/><path d=\'m12 11.5h-2.5v-5.143l-2.5 2.948-2.5-2.948v5.143h-2.5v-9h2.273l2.721 3.377 2.733-3.377h2.273z\' fill=\'%23ddd\'/></svg>',
		'file_icon_office':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m0 0h14v14h-14z\' fill=\'%23808080\'/><g fill=\'%23cdcdcd\'><path d=\'m10 1.5h2.5v1h-2.5z\'/><path d=\'m10 4h2.5v1h-2.5z\'/><path d=\'m10 6.5h2.5v1h-2.5z\'/><path d=\'m10 9h2.5v1h-2.5z\'/><path d=\'m10 11.5h2.5v1h-2.5z\'/><path d=\'m6.5 1.5h2.5v1h-2.5z\'/><path d=\'m6.5 4h2.5v1h-2.5z\'/><path d=\'m6.5 6.5h2.5v1h-2.5z\'/><path d=\'m6.5 9h2.5v1h-2.5z\'/><path d=\'m6.5 11.5h2.5v1h-2.5z\'/><path d=\'m1.5 1.5h4v11h-4z\'/></g></svg>',
		'file_icon_pdf':			'<svg clip-rule=\'evenodd\' fill-rule=\'evenodd\' viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m0 0h13.999986v13.999986h-13.999986z\' fill=\'%23e0382d\' stroke-width=\'.259259\'/><path d=\'m45 31.2c-2.6-2.7-9.7-1.6-11.4-1.4-2.5-2.4-4.2-5.3-4.8-6.3.9-2.7 1.5-5.4 1.6-8.3 0-2.5-1-5.2-3.8-5.2-1 0-1.9.6-2.4 1.4-1.2 2.1-.7 6.3 1.2 10.6-1.1 3.1-2.1 6.1-4.9 11.4-2.9 1.2-9 4-9.5 7-.2.9.1 1.8.8 2.5.7.6 1.6.9 2.5.9 3.7 0 7.3-5.1 9.8-9.4 2.1-.7 5.4-1.7 8.7-2.3 3.9 3.4 7.3 3.9 9.1 3.9 2.4 0 3.3-1 3.6-1.9.5-1 .2-2.1-.5-2.9zm-2.5 1.7c-.1.7-1 1.4-2.6 1-1.9-.5-3.6-1.4-5.1-2.6 1.3-.2 4.2-.5 6.3-.1.8.2 1.6.7 1.4 1.7zm-16.7-20.6c.2-.3.5-.5.8-.5.9 0 1.1 1.1 1.1 2-.1 2.1-.5 4.2-1.2 6.2-1.5-4-1.2-6.8-.7-7.7zm-.2 19.4c.8-1.6 1.9-4.4 2.3-5.6.9 1.5 2.4 3.3 3.2 4.1 0 .1-3.1.7-5.5 1.5zm-5.9 4c-2.3 3.8-4.7 6.2-6 6.2-.2 0-.4-.1-.6-.2-.3-.2-.4-.5-.3-.9.3-1.4 2.9-3.3 6.9-5.1z\' fill=\'%23fff\' fill-rule=\'nonzero\' transform=\'matrix(.344737 0 0 .35503 -2.77114 -2.5503)\'/></svg>',
		'file_icon_playlist':		'<svg viewBox=\'0 0 14 14\' clip-rule=\'evenodd\' fill-rule=\'evenodd\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m0 0h14v14h-14z\' fill=\'%23888\' fill-rule=\'nonzero\'/><path d=\'m1.5 1.5h8v1h-8zm0 2.5h8v1h-8zm0 2.5h8v1h-8zm0 2.5h7v1h-7zm0 2.5h5.5v1h-5.5zm9.5-10h1v10c-.019.681-.796 1.339-1.75 1.475-.966.138-1.75-.31-1.75-1s.784-1.362 1.75-1.5a2.28 2.28 0 0 1 .75.013z\' fill=\'%23fff\'/></svg>',
		'file_icon_text':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m14 0h-14v14h14z\' fill=\'%236a6a95\'/><g fill=\'%23fff\'><path d=\'m6.5 1.5h6v1h-6z\'/><path d=\'m1.5 1.5h3.5v3.5h-3.5z\'/><path d=\'m1.5 6.5h11v1h-11z\'/><path d=\'m6.5 4h6v1h-6z\'/><path d=\'m1.5 11.5h8v1h-8z\'/><path d=\'m1.5 9h11v1h-11z\'/></g></svg>',
		'file_icon_video':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m14 14v-14h-14v14z\'/><g fill=\'%23fff\'><path d=\'m9.5 3v-2h-2v2z\'/><path d=\'m3.5 3v-2h-2v2z\'/><path d=\'m6.5 3v-2h-2v2z\'/><path d=\'m12.5 3v-2h-2v2z\'/><path d=\'m9.5 13v-2h-2v2z\'/><path d=\'m3.5 13v-2h-2v2z\'/><path d=\'m6.5 13v-2h-2v2z\'/><path d=\'m12.5 13v-2h-2v2z\'/></g><path d=\'m12.5 10v-6h-11v6z\' fill=\'%23eda412\'/></svg>',
		'file_icon_bin': '',		'file_icon_other': '',		// <-- these two use file_icon_system:
		'file_icon_system':			'<svg viewBox=\'0 0 14 14\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m0 0h14v14h-14z\' fill=\'%23808080\'/><g fill=\'%23ccc\'><path d=\'m1.247 6.495h3.263v-1.067h-.881v-3.835h-.974c-.371.232-.727.371-1.284.479v.82h.928v2.536h-1.052z\'/><path d=\'m7 6.588c1.082 0 1.825-.89 1.825-2.567 0-1.67-.743-2.521-1.825-2.521s-1.825.843-1.825 2.521c0 1.677.743 2.567 1.825 2.567zm0-1.021c-.309 0-.572-.247-.572-1.546s.263-1.5.572-1.5.572.201.572 1.5-.263 1.546-.572 1.546z\'/><path d=\'m9.598 6.495h3.263v-1.067h-.882v-3.835h-.974c-.371.232-.727.371-1.283.479v.82h.927v2.536h-1.051z\'/><path d=\'m2.825 12.588c1.082 0 1.824-.89 1.824-2.567 0-1.67-.742-2.521-1.824-2.521-1.083 0-1.825.843-1.825 2.521 0 1.677.742 2.567 1.825 2.567zm0-1.021c-.31 0-.572-.247-.572-1.546s.262-1.5.572-1.5c.309 0 .572.201.572 1.5s-.263 1.546-.572 1.546z\'/><path d=\'m5.423 12.495h3.263v-1.067h-.882v-3.835h-.974c-.371.232-.727.371-1.284.479v.82h.928v2.536h-1.051z\'/><path d=\'m11.175 12.588c1.083 0 1.825-.89 1.825-2.567 0-1.67-.742-2.521-1.825-2.521-1.082 0-1.824.843-1.824 2.521 0 1.677.742 2.567 1.824 2.567zm0-1.021c-.309 0-.572-.247-.572-1.546s.263-1.5.572-1.5c.31 0 .572.201.572 1.5s-.262 1.546-.572 1.546z\'/></g></svg>'
	};
	const SVG_Text_Editing_UI_Icons = {
		'toggle_theme':		'<svg viewBox=\'0 0 16 16\' clip-rule=\'evenodd\' fill-rule=\'evenodd\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'m8 0c4.415 0 8 3.585 8 8s-3.585 8-8 8-8-3.585-8-8 3.585-8 8-8zm0 2c3.311 0 6 2.689 6 6s-2.689 6-6 6z\' fill=\'%23333\'/></svg>',
		'text_editing':			'<svg version=\'1.1\' id=\'Layer_1\' xmlns:serif=\'http://www.serif.com/\'  xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' x=\'0px\' y=\'0px\' viewBox=\'0 0 1297.6 1301.6\'  style=\'enable-background:new 0 0 1297.6 1301.6;\' xml:space=\'preserve\'><polygon style=\'fill:%23222;\' points=\'1049,600.6 1049,1150.6 149,1150.6 149,250.6 699,250.6 699,101.6 0,101.6 0,1301.6  1200,1301.6 1200,600.6 \'/><rect x=\'421.7\' y=\'375.9\' transform=\'matrix(0.7071 -0.7071 0.7071 0.7071 -95.8103 720.4032)\' style=\'fill:%23222;\' width=\'800\' height=\'200\'/><rect x=\'1113.4\' y=\'17.7\' transform=\'matrix(0.7071 -0.7071 0.7071 0.7071 262.3587 868.8007)\' style=\'fill:%23222;\' width=\'133\' height=\'200\'/><polyline style=\'fill:%23222;\' points=\'345.9,951.8 439.9,716.3 581.3,857.7 \'/></svg>',
		'show_markdown':	'<svg viewBox=\'0 0 100 60\' xmlns=\'http://www.w3.org/2000/svg\' width=\'100\'><g fill=\'%23333\'><path d=\'M42.215 60l.17-46.24h-.255L30.06 60h-7.99L10.255 13.76H10L10.169 60H.905V-.18H14.59l11.56 44.03h.34L37.794-.18H52.16V60h-9.945zM99.589 29.996c0 9.519-1.997 16.901-5.992 22.142C89.602 57.38 83.722 60 75.959 60H60.914V-.18h15.13c7.706 0 13.558 2.65 17.553 7.948 3.995 5.299 5.992 12.708 5.992 22.228zm-10.2 0c0-3.57-.326-6.686-.978-9.35-.651-2.663-1.572-4.873-2.762-6.63-1.19-1.756-2.607-3.073-4.25-3.953-1.645-.878-3.43-1.317-5.355-1.317h-4.845v42.33h4.845c1.926 0 3.711-.438 5.355-1.317 1.643-.878 3.06-2.195 4.25-3.953 1.189-1.756 2.11-3.952 2.762-6.587.651-2.637.978-5.709.978-9.223z\'/></g></svg>',
		'show_source':		'<svg viewBox=\'0 0 22 14\' xmlns=\'http://www.w3.org/2000/svg\' fill-rule=\'evenodd\' clip-rule=\'evenodd\'><path fill=\'none\' d=\'M0 0h21.996v14H0z\'/><clipPath id=\'a\'><path d=\'M0 0h21.996v14H0z\'/></clipPath><g clip-path=\'url(%23a)\' fill=\'%23333\'><path d=\'M0 7.393v-.786l6.062-3.5.75 1.3L2.32 7l4.492 2.593-.75 1.3L0 7.393zM21.996 6.607v.786l-6.062 3.5-.75-1.3L19.676 7l-4.492-2.593.75-1.3 6.062 3.5zM15.15 1.313l-1.3-.75-7 12.124 1.3.75 7-12.124z\'/></g></svg>',
		'show_preview':		'<svg viewBox=\'0 0 16 16\' xmlns=\'http://www.w3.org/2000/svg\' fill-rule=\'evenodd\' clip-rule=\'evenodd\'><path d=\'M10 2.5V1H0v1.5h4V15h2V2.5h4zM9 6.5V8h2v4.053c0 2.211 1.547 3.442 3 3.442.989 0 1.556-.258 2-.495v-1.5c-.565.257-.882.376-1.507.376-.847 0-1.493-.474-1.493-1.876V8h2.5V6.5H13v-3h-1.98v3H9z\' fill=\'%23333\' fill-rule=\'nonzero\'/></svg>',
		'show_html':		'<svg viewBox=\'0 0 22 16\' xmlns=\'http://www.w3.org/2000/svg\' fill-rule=\'evenodd\' clip-rule=\'evenodd\'><path fill=\'none\' d=\'M0 0h21.022v16H0z\'/><clipPath id=\'a\'><path d=\'M0 0h21.022v16H0z\'/></clipPath><g clip-path=\'url(%23a)\' fill=\'%23333\'><path d=\'M7.732.222L9.5 1.99 3.49 8l6.01 6.01-1.768 1.768L-.046 8 7.732.222zM13.268 15.778L11.5 14.01 17.51 8 11.5 1.99 13.268.222 21.046 8l-7.778 7.778z\'/></g></svg>',
		'toggle_split':		'<svg viewBox=\'0 0 16 16\' xmlns=\'http://www.w3.org/2000/svg\' fill-rule=\'evenodd\' clip-rule=\'evenodd\'><path d=\'M0 0v16h16V0H0zm14 14H9V2h5v12zm-7 0H2V2h5v12z\' fill=\'%23333\' fill-rule=\'nonzero\'/></svg>',
		'save_btn':			'<svg viewBox=\'0 0 16 16\' xmlns=\'http://www.w3.org/2000/svg\' fill-rule=\'evenodd\' clip-rule=\'evenodd\'><g fill=\'currentColor\'><path d=\'M16 0v10.02L14 10V2H2v8l-2 .02V0h16z\' fill-rule=\'nonzero\'/><path d=\'M7 5h2v9H7z\'/><path d=\'M3.757 11.757l1.415-1.414L8 13.172l2.828-2.829 1.415 1.414L8 16l-4.243-4.243z\'/></g></svg>',
		'save_btn_edited':	'<svg viewBox=\'0 0 16 16\' xmlns=\'http://www.w3.org/2000/svg\' fill-rule=\'evenodd\' clip-rule=\'evenodd\'><g fill=\'%23DD2222\'><path d=\'M16 0v10.02L14 10V2H2v8l-2 .02V0h16z\' fill-rule=\'nonzero\'/><path d=\'M7 5h2v9H7z\'/><path d=\'M3.757 11.757l1.415-1.414L8 13.172l2.828-2.829 1.415 1.414L8 16l-4.243-4.243z\'/></g></svg>'
	};
// ===> GET SVG UI ICON by name
	function get_SVG_UI_File_Icon(icon_name) {																								// ===> GET SVG UI FILE Icon by name
		switch(icon_name) {
			case 'favicon': return '<link href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAgMAAAC+UIlYAAAACVBMVEUmRcmZzP8zmf8pVcWPAAAAAXRSTlMAQObYZgAAAFBJREFUeF7tyqERwDAMBEE3mX5UiqDmqwwziTPHjG7xrmzrLFtRaApDIRiKQlMYCsFQFJrCUAiGotAU5hTA1WB4fhkMBsOJwWAwgHvB8CHpBcTbpxy4RZNvAAAAAElFTkSuQmCC" rel="icon" sizes="16x16" />';
			case 'file_icon_dir_default': return 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAd5JREFUeNqMU79rFUEQ/vbuodFEEkzAImBpkUabFP4ldpaJhZXYm/RiZWsv/hkWFglBUyTIgyAIIfgIRjHv3r39MePM7N3LcbxAFvZ2b2bn22/mm3XMjF+HL3YW7q28YSIw8mBKoBihhhgCsoORot9d3/ywg3YowMXwNde/PzGnk2vn6PitrT+/PGeNaecg4+qNY3D43vy16A5wDDd4Aqg/ngmrjl/GoN0U5V1QquHQG3q+TPDVhVwyBffcmQGJmSVfyZk7R3SngI4JKfwDJ2+05zIg8gbiereTZRHhJ5KCMOwDFLjhoBTn2g0ghagfKeIYJDPFyibJVBtTREwq60SpYvh5++PpwatHsxSm9QRLSQpEVSd7/TYJUb49TX7gztpjjEffnoVw66+Ytovs14Yp7HaKmUXeX9rKUoMoLNW3srqI5fWn8JejrVkK0QcrkFLOgS39yoKUQe292WJ1guUHG8K2o8K00oO1BTvXoW4yasclUTgZYJY9aFNfAThX5CZRmczAV52oAPoupHhWRIUUAOoyUIlYVaAa/VbLbyiZUiyFbjQFNwiZQSGl4IDy9sO5Wrty0QLKhdZPxmgGcDo8ejn+c/6eiK9poz15Kw7Dr/vN/z6W7q++091/AQYA5mZ8GYJ9K0AAAAAASUVORK5CYII= ")';
			case 'file_icon_file_default': return 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMAAAAAAABupgeRAAABHUlEQVR42o2RMW7DIBiF3498iHRJD5JKHurL+CRVBp+i2T16tTynF2gO0KSb5ZrBBl4HHDBuK/WXACH4eO9/CAAAbdvijzLGNE1TVZXfZuHg6XCAQESAZXbOKaXO57eiKG6ft9PrKQIkCQqFoIiQFBGlFIB5nvM8t9aOX2Nd18oDzjnPgCDpn/BH4zh2XZdlWVmWiUK4IgCBoFMUz9eP6zRN75cLgEQhcmTQIbl72O0f9865qLAAsURAAgKBJKEtgLXWvyjLuFsThCSstb8rBCaAQhDYWgIZ7myM+TUBjDHrHlZcbMYYk34cN0YSLcgS+wL0fe9TXDMbY33fR2AYBvyQ8L0Gk8MwREBrTfKe4TpTzwhArXWi8HI84h/1DfwI5mhxJamFAAAAAElFTkSuQmCC ")';
			default: return 'url("data:image/svg+xml;utf8,'+ SVG_UI_File_Icons[icon_name] +'")';
		}
	}
	function CSS_UI_Icon_Rules() {	// programatically add File icon CSS rules																// ===> CSS UI ICON RULES
		let rules = '', kind, class_name;
		for ( let icon in SVG_UI_File_Icons ) {
			kind = icon.slice(icon.lastIndexOf('_') + 1);
			class_name = kind;
			if ( class_name !== ('file') ) {		// exceptions:
				if ( kind === 'dirinvisible' )		{ class_name = 'dir.invisible'; }
				if ( kind === 'ignoredimage' )		{ class_name = 'ignored_image'; }
				if ( kind === 'open' )				{ class_name = 'has_subdirectory'; kind = 'dir_open'; }
				if ( /alias|symlink/.test(kind) )	{ class_name = 'link'; }
				if ( /bin|other/.test(kind) )		{ kind = 'system'; }
				// add rules for dir_list items, content_header, stats details:
				rules += `body:not(.use_custom_icons_false) .${ class_name } .has_icon_before_before, #content_pane[data-content^="has_${ class_name }"] #content_title span::before,body:not(.use_custom_icons_false) .${ class_name }.has_icon_before::before, .${ class_name } .has_icon_before::before { background-image: url("data:image/svg+xml;utf8,${ SVG_UI_File_Icons['file_icon_'+kind] }"); }`;	// add custom file icons
			}
		}
		return rules;
	}
	// END SVG UI ICONS
	//==============================// UI HTML
	// SIDEBAR ELEMENTS
	function Sidebar_Elements(body_id,parent_link) {									// Assemble directory elements for both top and iframe directories
		const sidebar_header_menu_elements = `
		<li id="go_to_item" class="no_checkmark border_bottom" title="Go to item..."><span class="menu_item">Go to item&hellip; (&#8984;&#8679;J)</span><input id="go_to_item_input" class="display_none resize_none whitespace_pre" rows="1" placeholder="Item row number" spellcheck="false" /></li>
		<li id="menu_sort_by" class="has_submenu border_bottom error_display_none"><span class="menu_item">Sort by&hellip;</span>${SVG_UI_Icons.arrow}
			<ul id="sort_menu" class="submenu box_shadow_menu background_grey_80 border_all">     <li id="menu_sort_by_name" class="is_submenu_item toggle_UI_pref sorting" data-ui_pref="sort_by_name"><span class="menu_item">Name</span></li>     <li id="menu_sort_by_duration" class="is_submenu_item toggle_UI_pref sorting" data-ui_pref="sort_by_duration"><span class="menu_item">Duration</span></li>     <li id="menu_sort_by_size" class="is_submenu_item toggle_UI_pref sorting" data-ui_pref="sort_by_size"><span class="menu_item">Size</span></li>     <li id="menu_sort_by_date" class="is_submenu_item toggle_UI_pref sorting" data-ui_pref="sort_by_date"><span class="menu_item">Date</span></li>     <li id="menu_sort_by_kind" class="is_submenu_item toggle_UI_pref sorting" data-ui_pref="sort_by_kind"><span class="menu_item">Kind</span></li>     <li id="menu_sort_by_ext" class="is_submenu_item toggle_UI_pref sorting" data-ui_pref="sort_by_ext"><span class="menu_item">Extension</span></li>     <li id="menu_sort_by_default" class="is_submenu_item toggle_UI_pref sorting" data-ui_pref="sort_by_default"><span class="menu_item">Default</span></li>     </ul></li>
		<li id="UI_settings" class="has_submenu"><span class="menu_item">UI Preferences</span>${SVG_UI_Icons.arrow}
			<ul id="UI_settings_submenu" class="submenu box_shadow_menu background_grey_80 border_all">		<li id="menu_theme_container" class="is_submenu_item" title="Set the main UI theme (light or dark)."><span id="menu_theme" class="toggle_UI_pref menu_item checkmark ignore_warning" data-ui_pref="theme"><span> Theme</span></span></li>		<li id="alternate_background" class="is_submenu_item toggle_UI_pref ignore_warning border_top" data-ui_pref="alternate_background" title="Alternate backgrounds of directory items."><span class="menu_item checkmark">Alternate Backgrounds</span></li>		<li id="show_numbers" class="is_submenu_item toggle_UI_pref ignore_warning error_display_none" data-ui_pref="show_numbers" title="Number directory list items."><span class="menu_item checkmark">Show Numbers</span></li>		<li id="use_custom_icons" class="is_submenu_item toggle_UI_pref ignore_warning border_top" data-ui_pref="use_custom_icons" title="Use custom or browser/server default file and dir icons"><span class="menu_item checkmark">Use Custom Icons</span></li>		<li id="show_image_thumbnails" class="is_submenu_item toggle_UI_pref ignore_warning" data-ui_pref="show_image_thumbnails" title="Show image thumbnails in directory list items."><span class="menu_item checkmark">Show Image Thumbnails</span></li>		<li id="show_large_image_thumbnails" class="is_submenu_item toggle_UI_pref ignore_warning" data-ui_pref="show_large_image_thumbnails" title="Use large image thumbnails."><span class="menu_item checkmark">Use Large Image Thumbnails</span></li>		<li id="audio_player_on_top" class="is_submenu_item toggle_UI_pref" data-ui_pref="audio_player_on_top border_top" title="Toggle off to place the audio player at the bottom of the content pane."><span class="menu_item checkmark">Audio Player at Top</span></li>		<li id="ui_font" class="is_submenu_item ignore_warning no_checkmark border_top" data-ui_pref="ui_font" title="Enter the name of an installed font."><span class="menu_item">Set UI Font&hellip;</span><input id="ui_font_input" class="display_none resize_none whitespace_pre" rows="1" placeholder="CSS Font Family" spellcheck="false" /></li>		<li id="ui_scale" class="is_submenu_item ignore_warning display_flex flex_column no_checkmark" data-ui_pref="ui_scale" title="Scale the UI. Double-click to reset."><span class="menu_item">Scale UI&hellip;</span><span id="ui_scale_input_container" class="flex_justify_center_row padding_4_6"><input id="ui_scale_input" class="width_100 whitespace_pre display_block resize_none" type="range" min="75" max="125" step="1" placeholder="Scale UI"></span></li>			</ul></li>
		<li id="file_handling" class="has_submenu error_display_none"><span class="menu_item">File Handling Preferences</span>${SVG_UI_Icons.arrow}
			<ul id="file_handling_submenu" class="submenu box_shadow_menu background_grey_80 border_all">		<li id="show_invisible_items" class="is_submenu_item toggle_UI_pref" data-ui_pref="show_invisibles" title="Show/hide invisible items"><span class="menu_item checkmark">Show Invisible Items  (&#8984;&#8679;I)</span></li>		<li id="show_ignored_items" class="is_submenu_item toggle_UI_pref" data-ui_pref="show_ignored_items" title="Show/hide ignored items (from the list of ignored file types in the user settings)."><span class="menu_item checkmark">Show Ignored Items</span></li>		<li id="ignore_ignored_items" class="is_submenu_item toggle_UI_pref border_bottom" data-ui_pref="ignore_ignored_items" title="If checked, the browser will not attempt to load ignored items (from the list of ignored file types in the user settings). It is recommended to leave this checked."><span class="menu_item checkmark">Ignore Ignored Items</span></li>	<li id="iframe_theme" class="is_submenu_item border_bottom" title="HTML/PDF files will use the main UI theme."><span id="iframe_theme_menu" class="toggle_UI_pref menu_item checkmark ignore_warning" data-ui_pref="iframe_theme"><span>HTML/PDF Files Use UI Theme</span></span></li>		<li id="autoload_index_files" class="is_submenu_item toggle_UI_pref" data-ui_pref="autoload_index_files" title="Automatically load html index file."><span id="autoload_index_files_menu" class="menu_item checkmark">Autoload Index Files</span></li>		</ul></li>
		<li id="media_settings" class="has_submenu error_display_none"><span class="menu_item">Media Preferences</span>${SVG_UI_Icons.arrow}
			<ul id="UI_settings_submenu" class="submenu box_shadow_menu background_grey_80 border_all">		<li id="media_autoload" class="is_submenu_item toggle_UI_pref" data-ui_pref="media_autoload" title="Automatically select and load the first media item in a directory and cover art (if any)."><span id="media_autoload_menu" class="menu_item checkmark">Autoload Media</span></li>		<li id="media_autoplay" class="is_submenu_item toggle_UI_pref" data-ui_pref="media_autoplay" title="Automatically play the next media item."><span id="media_autoload_menu" class="menu_item checkmark">Autoplay Media</span></li>		<li id="media_play_all" class="is_submenu_item toggle_UI_pref border_bottom" data-ui_pref="media_play_all" title="If checked, autoplay all media types (i.e., audio and video), else just autoplay the currently selected/playing media type."><span class="menu_item checkmark">Play All Media Files</span></li>		<li id="loop_media_files" class="is_submenu_item" title="If checked, loop media playback."><span id="loop_media_menu" class="menu_item">Loop Media Playback</span></li>		<li id="shuffle_media_files" class="is_submenu_item border_bottom" title="If checked, shuffle media playback."><span id="shuffle_media_menu" class="menu_item">Shuffle Media Playback</span></li>		<li id="show_media_name_in_window_title" class="is_submenu_item toggle_UI_pref border_bottom" data-ui_pref="show_media_name_in_window_title" title="Show media name in window title"><span id="show_media_name_in_window_title_menu" class="menu_item checkmark">Show media name in window title</span></li>		<li id="refresh_media_durations" class="is_submenu_item border_bottom" title=""><span id="refresh_media_durations_menu" class="menu_item">Refresh Media Durations</span></li>		</ul></li>
		<li id="text_editing" class="has_submenu error_display_none"><span class="menu_item">Text Editing Preferences</span>${SVG_UI_Icons.arrow}     <ul id="text_editing_menu" class="submenu box_shadow_menu background_grey_80 border_all">		<li id="texteditor_menu_item" class="is_submenu_item border_bottom" title="Toggle the main text editor."><span id="texteditor" class="menu_item">Toggle Main Text Editor</span></li>		<li id="toggle_text_editing" class="error_display_none border_bottom" title="Enable/disable editing of text files. Does not effect main text editor."><span id="text_editing_enable" class="menu_item checkmark" data-ui_pref="text_editing_enable"><span id="disable">Text File Editing </span></span></li>		<li id="texteditor_split_view" class="is_submenu_item toggle_UI_pref border_bottom" data-ui_pref="texteditor_split_view" title="Toggle display of default text view and both source and rendered text."><span class="menu_item checkmark">Split View</span></li>		<li id="toggle_texteditor_raw_menu" class="is_submenu_item toggle_UI_pref" data-ui_pref="texteditor_view_raw"><span id="toggle_texteditor_raw" class="menu_item">View Source Text</span></li>		<li id="toggle_texteditor_preview_menu" class="is_submenu_item toggle_UI_pref" data-ui_pref="texteditor_view_styled"><span id="toggle_texteditor_preview" class="menu_item">View Styled Text</span></li>		<li id="toggle_texteditor_html_menu" class="is_submenu_item toggle_UI_pref" data-ui_pref="texteditor_view_html"><span id="toggle_texteditor_html" class="menu_item">View Rendered HTML</span></li></ul>
	<li id="default_settings" class="menu_item border_bottom"><span class="" href="#" title="Delete custom UI preferences stored in the URL query string and reload page.">Default Preferences</span></li>
		<li id="playlist_options" class="has_submenu border_bottom error_display_none"><span class="menu_item">Playlists</span>${SVG_UI_Icons.arrow}     <ul id="playlist_menu" class="submenu box_shadow_menu background_grey_80 border_all">		<li id="open_playlist_container" class="is_submenu_item"><label id="open_playlist_label" class="menu_item" for="open_playlist" title="Open local .m3u playlist/filelist file.">Open Playlist/Filelist File&hellip;</label><input type="file" id="open_playlist" name="open_playlist" accept=".m3u,.m3u8"></li>    <li id="close_playlist_container" class="is_submenu_item display_none"><span id="close_playlist" class="menu_item" href="#">Close Playlist/Filelist</span></li>     <li class="is_submenu_item"><span id="make_playlist" class="menu_item border_top error_display_none" href="#" title="Make an .m3u playlist/filelist of the items in the current directory (if any).">Make Playlist/Filelist&hellip;</span></li>     </ul></li>
		<li id="open_font_file" class="border_bottom error_display_none"><label id="open_font_label" class="menu_item" for="open_font" title="Open font file (.oft, .ttf, .woff) to view glyph repertoire and font info; save individual glyphs as .svg.">Open Font File&hellip;</label><input type="file" id="open_font" name="open_font" accept=".otf,.ttf,.woff"></li>
		<li id="about" class="menu_item" title="Go to script home page."><a id="about_link" class="flex_grow_1 ignore_warning" href="https://openuserjs.org/scripts/gaspar_schot/Supercharged_Local_Directory_File_Browser" target="_blank"><span class="icon_container"></span>Script Home &#8599;</a></li>
		<li id="show_help" class="menu_item" title="Show help."><span class="flex_grow_1"><span class="icon_container"></span>Help</span></li>
		<li id="donate" class="menu_item" title="Buy me a coffee!"><a id="donate_link" class="flex_grow_1 ignore_warning" href="https://www.buymeacoffee.com/fiLtliTFxQ" target="_blank" rel="noopener"><span class="icon_container"></span>Buy me a Coffee <svg xmlns="http://www.w3.org/2000/svg" width="14px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><path d="m32 2c-16.568 0-30 13.432-30 30 0 16.568 13.432 30 30 30s30-13.432 30-30c0-16.568-13.432-30-30-30m0 48c-1.371-1.814-20.53-12.883-16.602-25.218 3.53-11.073 15.094-6.597 16.602-.594 1.094-5.635 12.949-10.694 16.604.584 3.925 12.136-15.237 23.785-16.604 25.228" fill="#757575"/></svg></a></li>
		<li id="contact" class="menu_item" title="Send me an email."><a id="contact_link" class="flex_grow_1 ignore_warning" href="mailto:mshroud@protonmail.com"><span class="icon_container"></span>Contact</a></li>
	`;
		const sidebar_header_elements = function(body_id,parent_link) {
			let parent_links = createParentLinkItems(), sidebar_header_title_element = '', sidebar_header_menus ='', sidebar_texteditor_element ='';
			let checked = ( getCurrentUIPref('show_invisibles') === 'true' ? 'checked="true"' : '' );
			const sidebar_header_utilities_row_1 = `<div id="sidebar_header_utilities_row_1" class="background_grey_80">	<ul class="display_flex flex_row position_relative background_grey_80 border_bottom">					<li id="directory_buttons_left" class="display_flex no_highlight">     <button id="show_details" class="toggle_UI_pref pointer outline_none" data-ui_pref="show_details" tabindex="-1" title="Toggle display of directory item detail information (&#8984;&#8679;D)"><span id="show"> details</span></button></li>     <li class="display_flex no_highlight"><label id="show_invisibles_container" for="inv_checkbox" class="margin_0 padding_0 flex_justify_center_row"><input class="toggle_UI_pref margin_0" type="checkbox" id="show_invisibles" data-ui_pref="show_invisibles" title="Toggle display of invisible items (&#8984&#8679;;I)" name="inv_checkbox" tabindex="-1"${ checked } /><span>&nbsp;Show Invisibles</span></label>     </li>								<li id="show_grid_btn" class="has_flyout_menu width_24px display_none position_relative pointer margin_0 padding_0 z_index_9997 no_highlight" tabindex="-1" title="Show Grid (&#8984;G)"><div class="display_flex width_14px_contents background_grey_80">${ SVG_UI_Icons.grid}</div>     <ul class="menu has_popout_menu display_none position_absolute margin_0 padding_0 box_shadow_menu border_all background_grey_80"><div class="display_flex width_24px width_14px_contents">${ SVG_UI_Icons.grid}</div>     <li id="show_image_grid" class="item_1 border_right border_bottom background_grey_80">Show Image Grid</li>     <li id="show_font_grid" class="item_2 border_right background_grey_80">Show Font Grid</li>     </ul>								</li></ul></div>`;
			const sidebar_header_utilities_row_2 = `<div id="sidebar_header_utilities_row_2" class="background_grey_80">							<ul id="sorting_row_1" class="whitespace_pre pointer container display_flex flex_justify_contents border_bottom">     <li id="sort_by_name" class="whitespace_pre pointer toggle_UI_pref name sorting align_left no_highlight" data-ui_pref="sort_by_name" title="Sort by name"><span><input id="play_toggle" class="whitespace_pre pointer display_none position_relative" type="checkbox" tabindex="-1" checked="true" />Name</span></li>     <li id="sort_by_default" class="whitespace_pre pointer toggle_UI_pref sorting align_right no_highlight" data-ui_pref="sort_by_default" title="Default sort"><span>Default</span></li>     <li id="sort_by_duration" class="whitespace_pre pointer toggle_UI_pref sorting align_right display_none no_highlight" data-ui_pref="sort_by_duration" title="Sort by media duration"><span>Duration</span></li>     </ul>
					<ul id="sorting_row_2" class="whitespace_pre pointer iframe_item border_bottom display_none">     <li id="sort_by_ext" class="whitespace_pre pointer toggle_UI_pref details sorting align_left no_highlight" data-ui_pref="sort_by_ext" title="Sort by extension"><span>Ext</span></li>     <li id="sort_by_duration" class="whitespace_pre pointer toggle_UI_pref sorting align_right display_none no_highlight" data-ui_pref="sort_by_duration" title="Sort by media duration"><span>Duration</span></li>     <li id="sort_by_size" class="whitespace_pre pointer toggle_UI_pref details sorting align_center no_highlight" data-ui_pref="sort_by_size" title="Sort by size"><span>Size</span></li>     <li id="sort_by_date" class="whitespace_pre pointer toggle_UI_pref details sorting align_center no_highlight" data-ui_pref="sort_by_date" title="Sort by date"><span>Date</span></li>     <li id="sort_by_kind" class="whitespace_pre pointer toggle_UI_pref details sorting align_right no_highlight" data-ui_pref="sort_by_kind" title="Sort by kind"><span>Kind</span></li>     </ul>						</div>`;
			switch(body_id) {
				case 'top_body':
					sidebar_header_title_element = `<div id="sidebar_header_title" class="display_flex flex_row border_bottom background_grey_75 normal"><div id="sidebar_header_title_div" class="align_center padding_4_6"></div></div>`;
					sidebar_header_menus = `<div id="sidebar_menus" class="display_flex flex_row background_grey_75 border_bottom pointer">
					<div id="sidebar_menu_parent" class="menu_container flex_justify_center width_24px padding_0">     <nav id="parent_dir_nav" class="flex_justify_center invert"><a href="${ parent_links[1] }" title="Parent Directory (&#8984;&uarr;)" class="flex_justify_center"><div class="display_flex">${ SVG_UI_Icons.chevron }${ SVG_UI_Icons.multiply }</div></a></nav>     </div>
					<div id="sidebar_menu_parents" class="menu_container padding_0 flex_grow_1">     <nav id="parents_dir_nav" class="display_flex border_right line_height_1_4 border_left">     <div id="current_dir_path" class="bold flex_justify_center hyphens_none pointer z_index_9998" title="Parent Directories"><span class="has_icon_before">${ current_dir_path }</span></div>     </nav>     <ul id="parents_links" class="menu background_grey_85 position_absolute position_LR_0 border_top border_bottom margin_0 padding_0 display_none box_shadow_menu z_index_9998">${ parent_links[0] }</ul>     </div>
					<div id="sidebar_menu_main_container" class="menu_container width_24px flex_justify_center margin_0 padding_0">     <nav id="dir_menu_main_container_nav" class="invert pointer width_14px_contents" title="Show main menu (&#8984;E); navigate by arrow keys or typed string."><div class="display_flex">${ SVG_UI_Icons.menu }</div></nav>     <ul id="sidebar_menu_main" class="menu position_absolute background_grey_80 border_top border_bottom margin_0 padding_0 display_none box_shadow_menu position_LR_0 z_index_9998">     ${ sidebar_header_menu_elements }     </ul>     </div>		</div>`;
					sidebar_texteditor_element = `<ul id="show_texteditor" class="bold border_bottom display_none"><li class="padding_4_6 width_100 background_grey_80" title="Toggle Text Editor (&#8984;&#8679;E)"><span>Text Editor</span></li></ul>`;							break;
					case 'iframe': sidebar_header_menus = `<ul id="change_dirs" class="flex_justify_center_row flex_justify_contents border_bottom background_grey_75">     <li id="parent" class="flex_grow_1 no_highlight"><a href="${ parent_link }" id="iframe_parent_link" class="display_inline_flex" title="Go to parent directory"><span class="width_14px_contents invert">${ SVG_UI_Icons.chevron }</span>Parent Directory</a></li>     <li id="open_in_sidebar" class="align_right flex_grow_1 no_highlight"><a href="#" title="Open this directory in sidebar">Open in Sidebar<span class="width_14px_contents invert transform_rotate_270_contents">${ SVG_UI_Icons.chevron }</span></a></li>     </ul>`;				break;
			}
			return `<header id="sidebar_header" class="display_flex flex_column text_color_default font_size_small user_select_none z_index_3">		${ sidebar_header_title_element }
					<div id="sidebar_header_utilities" class="display_flex flex_column"> ${ sidebar_header_menus } ${ sidebar_header_utilities_row_1 } ${ sidebar_header_utilities_row_2 } ${ sidebar_texteditor_element } </div>
					</header>`;
		}
		let sidebar_footer_utilities = '', sidebar_utilities = '';
		if ( body_id === 'top_body' ) {															// various elements not needed in iframe directories
			sidebar_footer_utilities = `<div id="sidebar_footer_utilities" class="width_24px flex_justify_center position_relative pointer z_index_1 background_grey_80 border_left border_right"><div class="width_18px_contents display_flex transform_rotate_180"><span class="invert">${ SVG_UI_Icons.toggle }</span></div>     <ul class="has_popout_menu margin_0 padding_0 display_none border_all position_absolute background_grey_80">     <li id="open_in_content_pane" class="align_right border_bottom padding_4_6">Open Sidebar in Content Pane</li>     <li id="show_directory_source" class="align_right padding_4_6" data-kind="show_directory_source">View Sidebar Directory Source</li>     </ul>     </div>`;
			sidebar_utilities = `<div id="sidebar_utilities"><div id="handle" class="position_absolute z_index_1"></div>     <div id="show_sidebar" class="toggle_UI_pref width_24px width_18px_contents position_absolute flex_justify_center invert pointer z_index_9997" data-ui_pref="show_sidebar" title="Toggle Sidebar (&#8984;\\)">${ SVG_UI_Icons.toggle }</div></div>     </div>`;
		}
		const sidebar_nav = `<nav id="sidebar_nav" class="display_flex flex_column background_grey_85 font_size_small"><div id="dir_nav_inner" class="position_relative">		<div id="directory_list_outer" class="position_relative"><ol id="directory_list" class="display_flex flex_column margin_0 padding_0 text_color_default border_bottom" tabindex="0">insert_prepped_index</ol></div>			</div></nav>`;
		const sidebar_footer = `<footer id="sidebar_footer" class="display_flex flex_row position_relative background_grey_85 border_top text_color_default error_display_none font_size_small user_select_none">insert_stats${ sidebar_footer_utilities }</footer>`;
		return `<div id="sidebar" class="${body_id} display_flex flex_column position_relative border_right padding_0 z_index_1" style="width:${ Number(getCurrentUIPref("width")) }%">	${ sidebar_header_elements(body_id,parent_link) } ${ sidebar_nav } ${ sidebar_footer } ${ sidebar_utilities }		</div>`;
	}
	//==============================//
	// CONTENT PANE ELEMENTS
	function Content_Pane_Elements(id) {
		const content_audio_elements = `<div id="content_audio_title" class="flex_justify_center_row background_grey_80 bold align_center" title="Click to toggle .m3u playlist entry."><span class="pointer line_height_1_4"></span></div>
		<div id="content_audio_container" class="content_el track_title_container display_flex flex_row border_bottom background_grey_80">
			<div id="audio_container" class="display_flex flex_row border_all">
				<nav id="cuesheet_track_list_container_audio" class="cuesheet_track_list_container border_right" title="Cue sheet track list">			<div class="box_shadow_menu display_none font_size_small position_absolute position_LR_0 z_index_1"><ul id="cuesheet_track_list_audio" class="cuesheet_track_list background_grey_85 border_bottom margin_0 padding_0">    </ul></div>     </nav>
				<div id="prev_track" class="prev_next_btn audio_controls flex_justify_center pointer" title="Previous track"><div class="display_flex width_24px_contents transform_rotate_180">${ SVG_UI_Icons.prev_next_track }</div></div>	<div id="next_track" class="prev_next_btn audio_controls flex_justify_center border_right pointer" title="Next track"><div class="display_flex width_24px_contents">${ SVG_UI_Icons.prev_next_track }</div></div>
				<audio id="content_audio" class="media_player outline_none" preload="auto" tabindex="0" controls>Sorry, your browser does not support HTML5 audio.</audio>
				<div id="close_audio" class="audio_controls border_left flex_justify_center position_relative pointer" title="Close audio"><div class="display_flex width_14px_contents">${ SVG_UI_Icons.multiply }</div></div>
				<div id="audio_options" class="display_flex flex_column">		<label id="loop_label" for="loop"><input type="checkbox" id="loop" name="loop" tabindex="0" />Loop</label>		<label id="shuffle_label" class="whitespace_pre" for="shuffle"><input type="checkbox" id="shuffle" name="shuffle" tabindex="0" />Shuffle</label>		</div>
			</div>
		</div>
		<div id="content_audio_playlist_item" class="playlist_entry_container border_bottom background_grey_85 align_center display_none"><textarea id="content_audio_playlist_item_textarea" class="text_color_default padding_4_6 border_0 outline_none" rows="3" spellcheck="false"></textarea></div>`;
		const text_editing_ui_elements = `<div id="texteditor_toolbar" class="border_bottom background_grey_80 position_relative text_color_default display_flex user_select_none width_100">
				<ul id="toolbar_buttons" class="display_flex flex_row flex_grow_1 margin_0 padding_0">     <li id="toggle_texteditor_view_raw" class="toggle_UI_pref toolbar_icon display_flex no_highlight" data-ui_pref="texteditor_view_raw" title="Show source"><div class="display_flex width_16px_contents invert">${ SVG_Text_Editing_UI_Icons.show_markdown }</div></li>     <li id="toggle_texteditor_view_styled" class="toggle_UI_pref toolbar_icon display_flex no_highlight" data-ui_pref="texteditor_view_styled" title="Show rendered markdown"><div class="display_flex width_14px_contents invert">${ SVG_Text_Editing_UI_Icons.show_preview }</div></li>     <li id="toggle_texteditor_view_html" class="toggle_UI_pref toolbar_icon display_flex no_highlight" data-ui_pref="texteditor_view_html" title="Show formatted HTML"><div class="display_flex width_18px_contents invert">${ SVG_Text_Editing_UI_Icons.show_html }</div></li>     <li id="toggle_texteditor_split_view" class="toggle_UI_pref toolbar_icon display_flex no_highlight" data-ui_pref="texteditor_split_view" title="Toggle Split View"><div class="display_flex width_14px_contents invert">${ SVG_Text_Editing_UI_Icons.toggle_split }</div></li>     <li id="texteditor_sync_scroll" class="toggle_UI_pref checkbox_container flex_justify_center_row no_highlight" data-ui_pref="texteditor_sync_scroll"><input id="texteditor_sync_scroll_input" class="toggle_UI_pref flex_justify_center_row position_relative" data-ui_pref="texteditor_sync_scroll" name="texteditor_sync_scroll" type="checkbox"><label id="texteditor_sync_scroll_label" for="texteditor_sync_scroll" class="toggle_UI_pref flex_justify_center_row whitespace_pre" data-ui_pref="texteditor_sync_scroll">Sync Scroll</label></li>     <li class="display_flex flex_grow_1 no_highlight">&nbsp;</li>     <li id="clear_text" class="toolbar_icon no_highlight" title="Clear Text">Clear</li>     <li id="save_btn" class="has_flyout_menu width_24px display_flex position_relative pointer margin_0 padding_0 z_index_9997" title=""><div class="display_flex width_14px_contents">${ SVG_Text_Editing_UI_Icons.save_btn}</div><ul class="menu has_popout_menu display_none position_absolute margin_0 padding_0 box_shadow_menu border_top border_bottom border_left background_grey_80">     <li id="save_text" class="item_1 border_right border_bottom background_grey_85" title="Save source text"><span id="save_text_link" target="_blank">Save Source</span></li>     <li id="save_btn_icon" class="item_1 no_highlight">${ SVG_Text_Editing_UI_Icons.save_btn}</li>     <li id="save_HTML" class="item_2 border_right background_grey_85" title="Save rendered html"><span id="save_HTML_link" target="_blank">Save HTML</span></li>         </ul></li>     </ul>		</div>
		<div id="text_container" class="display_flex flex_grow_1 overflow_hidden">     <textarea id="texteditor_raw_pane" class="texteditor_pane margin_0 border_0 height_100 line_height_1_2 text_color_default resize_none display_none z_index_1 outline_none" tabindex="0"></textarea>     <div id="texteditor_styled_pane" class="texteditor_pane margin_0 border_0 line_height_1_2 text_color_default height_100 display_none markdown_body z_index_1" tabindex="0"></div>     <textarea id="texteditor_html_pane" class="texteditor_pane margin_0 height_100 line_height_1_2 border_0 text_color_default resize_none display_none z_index_1 outline_none" tabindex="0" readonly></textarea>		<div id="text_editing_handle" class="position_absolute z_index_3"></div>					</div>
	`;
		const content_text_elements = `<div id="content_texteditor" class="background_grey_85 margin_0 padding_0 width_100 height_100 overflow_hidden position_absolute z_index_1 flex_column flex_grow_1 display_none">${ text_editing_ui_elements }</div>`;
		const content_font_toolbar = `<div id="font_toolbar" class="display_none margin_0 position_relative background_grey_80 border_bottom user_select_none z_index_3">
		<ol id="font_specimen_variants" class="display_none flex_row flex_grow_1 border_bottom"><li id="font_variants" class="flex_justify_center no_highlight" title="Font Variants"><select id="font_variant_select" data-tab_order="10" name="Font Variants">
			<option value="">OpenType Feature Tags</option>
			<optgroup label="Caps">    <option value="normal" data-prop="font-variant-caps" data-value="normal">Normal </option>    <option value="smcp" title="smcp" data-prop="font-variant-caps" data-value="small-caps">Small Caps </option>    <option value="c2sc" title="c2sc" data-prop="font-variant-caps" data-value="all-small-caps">All Small Caps </option>    <option value="pcap" title="pcap" data-prop="font-variant-caps" data-value="petite-caps">Petite Caps </option>    <option value="c2pc" title="c2pc" data-prop="font-variant-caps" data-value="all-petit-caps">All Petite Caps </option>    <option value="unic" title="unic" data-prop="font-variant-caps" data-value="unicase">Unicase </option>    <option value="titl" title="titl" data-prop="font-variant-caps" data-value="titling-caps">Titling Caps </option>    <option value="case" title="case">Case Sensitive Forms </option>    <option value="ordn" title="ordn">Ordinals </option>    </optgroup>
			<optgroup label="Alternatives">    <option value="normal" data-prop="font-variant-alternates" data-value="normal">Normal </option>    <option value="aalt" title="aalt">Access All Alternates </option>    <option value="nalt" title="nalt" data-prop="font-variant-alternates" data-value="'nalt'">Annotation 1&ndash;99 </option>    <option value="cv01" title="cv01" data-prop="font-variant-alternates" data-value="'cv01'">Character Variant 1&ndash;99 </option>    <option value="calt" title="calt" data-prop="font-variant-alternates" data-value="cv01">Contextual Alts 1&ndash;99 </option>    <option value="hist" title="hist">Historical Forms </option>    <option value="ornm" title="ornm" data-prop="font-variant-alternates" data-value="ornm">Ornaments 1&ndash;99 </option>    <option value="salt" title="salt" data-prop="font-variant-alternates" data-value="salt">Stylistic Alternates 1&ndash;99 </option>    <option value="ss01" title="ss01" data-prop="font-variant-alternates" data-value="ss01">Stylistic Set 1&ndash;20 </option>    <option value="swsh" title="swsh" data-prop="font-variant-alternates" data-value="'swsh'">Swash 1&ndash;99 </option>    <option value="cswh" title="cswh">Contextual Swash </option>    </optgroup>
			<optgroup label="Ligatures">    <option value="normal" data-prop="font-variant-ligatures" data-value="normal">Normal </option>    <option value="liga" title="liga" data-prop="font-variant-ligatures" data-value="common-ligatures">Common Ligatures </option>    <option value="clig" title="clig" data-prop="font-variant-ligatures" data-value="contextual">Contextual Ligatures </option>    <option value="dlig" title="dlig" data-prop="font-variant-ligatures" data-value="discretionary-ligatures">Discretionary Ligatures </option>    <option value="hlig" title="hlig" data-prop="font-variant-ligatures" data-value="historical-ligatures">Historical Ligatures </option>    </optgroup>
			<optgroup label="Numbers">    <option value="normal"  data-prop="font-variant-numeric" data-value="normal">Normal </option>    <option value="dnom" title="dnom" data-prop="font-variant-numeric" data-value="ordinal">Ordinal </option>    <option value="zero" title="zero" data-prop="font-variant-numeric" data-value="slashed-zero">Slashed Zero </option>    <option value="lnum" title="lnum" data-prop="font-variant-numeric" data-value="lining-nums">Lining Figures </option>    <option value="onum" title="onum" data-prop="font-variant-numeric" data-value="oldstyle-nums">Oldstyle Figures </option>    <option value="pnum" title="pnum" data-prop="font-variant-numeric" data-value="proportional-nums">Proportional Figures </option>    <option value="tnum" title="tnum" data-prop="font-variant-numeric" data-value="tablular-nums">Tabular Figures </option>    <option value="frac" title="frac" data-prop="font-variant-numeric" data-value="diagonal-fractions">Fractions </option>    <option value="afrc" title="afrc" data-prop="font-variant-numeric" data-value="stacked-fractions">Alternative Fractions </option>    <option value="numr" title="numr">Numerator </option>    <option value="sinf" title="sinf">Scientific Inferiors </option>    <option value="mgrk" title="mgrk">Mathematical Greek </option>    </optgroup>
			<optgroup label="Position">    <option value="normal"  data-prop="font-variant-position" data-value="normal">Normal </option>    <option value="subs" title="subs" data-prop="font-variant-position" data-value="sub">Subscript </option>    <option value="sups" title="sups" data-prop="font-variant-position" data-value="super">Superscript </option>    </optgroup>
		</select></li>
		<li id="font_tag" class="flex_justify_center no_highlight" data-salt=""><span class="flex_justify_center position_relative"><textarea id="font_tag_textarea" data-tab_order="12" class="resize_none outline_none" rows="1" cols="5" spellcheck="false" maxlength="8" placeholder="otftag" title="Enter an OpenType Feature Tag (e.g.: &ldquo;smcp&rdquo;)"></textarea></span></li>
		<li class="spacer no_highlight width_100"></li>
		<li id="unicode_char_planes" class="flex_justify_center no_highlight" title="Unicode Code Ranges"><select id="unicode_char_ranges_select" data-tab_order="13">
			<option value="">Unicode Code Ranges</option>
			<optgroup label="Basic Multilingual Plane">     <option id="BMP_Range_01" value="BMP_Range_01" data-block_start="0000" data-block_end="0FFF">BMP-01: U+0000&ndash;U+0FFF</option>    <option id="BMP_Range_02" value="BMP_Range_02" data-block_start="1000" data-block_end="1FFF">BMP-02: U+1000&ndash;U+1FFF</option>    <option id="BMP_Range_03" value="BMP_Range_03" data-block_start="2000" data-block_end="2FFF">BMP-03: U+2000&ndash;U+2FFF</option>    <option id="BMP_Range_04" value="BMP_Range_04" data-block_start="3000" data-block_end="3FFF">BMP-04: U+3000&ndash;U+3FFF</option>    <option id="BMP_Range_05" value="BMP_Range_05" data-block_start="4000" data-block_end="4FFF">BMP-05: U+4000&ndash;U+4FFF</option>    <option id="BMP_Range_06" value="BMP_Range_06" data-block_start="5000" data-block_end="5FFF">BMP-06: U+5000&ndash;U+5FFF</option>    <option id="BMP_Range_07" value="BMP_Range_07" data-block_start="6000" data-block_end="6FFF">BMP-07: U+6000&ndash;U+6FFF</option>    <option id="BMP_Range_08" value="BMP_Range_08" data-block_start="7000" data-block_end="7FFF">BMP-08: U+7000&ndash;U+7FFF</option>    <option id="BMP_Range_09" value="BMP_Range_09" data-block_start="8000" data-block_end="8FFF">BMP-09: U+8000&ndash;U+8FFF</option>    <option id="BMP_Range_10" value="BMP_Range_10" data-block_start="9000" data-block_end="9FFF">BMP-10: U+9000&ndash;U+9FFF</option>    <option id="BMP_Range_11" value="BMP_Range_11" data-block_start="A000" data-block_end="AFFF">BMP-11: U+A000&ndash;U+AFFF</option>    <option id="BMP_Range_12" value="BMP_Range_12" data-block_start="B000" data-block_end="BFFF">BMP-12: U+B000&ndash;U+BFFF</option>    <option id="BMP_Range_13" value="BMP_Range_13" data-block_start="C000" data-block_end="CFFF">BMP-13: U+C000&ndash;U+CFFF</option>    <option id="BMP_Range_14" value="BMP_Range_14" data-block_start="D000" data-block_end="DFFF">BMP-14: U+D000&ndash;U+DFFF</option>    <option id="BMP_Range_15" value="BMP_Range_15" data-block_start="E000" data-block_end="EFFF">BMP-15: U+E000&ndash;U+EFFF</option>    <option id="BMP_Range_16" value="BMP_Range_16" data-block_start="F000" data-block_end="FFFF">BMP-16: U+F000&ndash;U+FFFF</option>    </optgroup>
			<optgroup label="Supplementary Multilingual Plane" data-block_start="10000" data-block_end="10FFF">     <option id="SMP_Range_01" value="SMP_Range_01">SMP-01: U+10000&ndash;U+10FFF</option>    <option id="SMP_Range_02" value="SMP_Range_02" data-block_start="11000" data-block_end="11FFF">SMP-02: U+11000&ndash;U+11FFF</option>    <option id="SMP_Range_03" value="SMP_Range_03" data-block_start="12000" data-block_end="12FFF">SMP-03: U+12000&ndash;U+12FFF</option>    <option id="SMP_Range_04" value="SMP_Range_04" data-block_start="13000" data-block_end="13FFF">SMP-04: U+13000&ndash;U+13FFF</option>    <option id="SMP_Range_05" value="SMP_Range_05" data-block_start="14000" data-block_end="14FFF">SMP-05: U+14000&ndash;U+14FFF</option>    <option id="SMP_Range_06" value="SMP_Range_06" data-block_start="15000" data-block_end="15FFF">SMP-06: U+15000&ndash;U+15FFF</option>    <option id="SMP_Range_07" value="SMP_Range_07" data-block_start="16000" data-block_end="16FFF">SMP-07: U+16000&ndash;U+16FFF</option>    <option id="SMP_Range_08" value="SMP_Range_08" data-block_start="17000" data-block_end="17FFF">SMP-08: U+17000&ndash;U+17FFF</option>    <option id="SMP_Range_09" value="SMP_Range_09" data-block_start="18000" data-block_end="18FFF">SMP-09: U+18000&ndash;U+18FFF</option>    <option id="SMP_Range_10" value="SMP_Range_10" data-block_start="19000" data-block_end="19FFF">SMP-10: U+19000&ndash;U+19FFF</option>    <option id="SMP_Range_11" value="SMP_Range_11" data-block_start="1A000" data-block_end="1AFFF">SMP-11: U+1A000&ndash;U+1AFFF</option>    <option id="SMP_Range_12" value="SMP_Range_12" data-block_start="1B000" data-block_end="1BFFF">SMP-12: U+1B000&ndash;U+1BFFF</option>    <option id="SMP_Range_13" value="SMP_Range_13" data-block_start="1C000" data-block_end="1CFFF">SMP-13: U+1C000&ndash;U+1CFFF</option>    <option id="SMP_Range_14" value="SMP_Range_14" data-block_start="1D000" data-block_end="1DFFF">SMP-14: U+1D000&ndash;U+1DFFF</option>    <option id="SMP_Range_15" value="SMP_Range_15" data-block_start="1E000" data-block_end="1EFFF">SMP-15: U+1E000&ndash;U+1EFFF</option>    <option id="SMP_Range_16" value="SMP_Range_16" data-block_start="1F000" data-block_end="1FFFF">SMP-16: U+1F000&ndash;U+1FFFF</option>    </optgroup>
			<optgroup label="Supplementary Ideographic Plane" data-block_start="20000" data-block_end="20FFF">     <option id="SIP_Range_01" value="SIP_Range_01">SIP-01: U+20000&ndash;U+20FFF</option>    <option id="SIP_Range_02" value="SIP_Range_02" data-block_start="21000" data-block_end="21FFF">SIP-02: U+21000&ndash;U+21FFF</option>    <option id="SIP_Range_03" value="SIP_Range_03" data-block_start="22000" data-block_end="22FFF">SIP-03: U+22000&ndash;U+22FFF</option>    <option id="SIP_Range_04" value="SIP_Range_04" data-block_start="23000" data-block_end="23FFF">SIP-04: U+23000&ndash;U+23FFF</option>    <option id="SIP_Range_05" value="SIP_Range_05" data-block_start="24000" data-block_end="24FFF">SIP-05: U+24000&ndash;U+24FFF</option>    <option id="SIP_Range_06" value="SIP_Range_06" data-block_start="25000" data-block_end="25FFF">SIP-06: U+25000&ndash;U+25FFF</option>    <option id="SIP_Range_07" value="SIP_Range_07" data-block_start="26000" data-block_end="26FFF">SIP-07: U+26000&ndash;U+26FFF</option>    <option id="SIP_Range_08" value="SIP_Range_08" data-block_start="27000" data-block_end="27FFF">SIP-08: U+27000&ndash;U+27FFF</option>    <option id="SIP_Range_09" value="SIP_Range_09" data-block_start="28000" data-block_end="28FFF">SIP-09: U+28000&ndash;U+28FFF</option>    <option id="SIP_Range_10" value="SIP_Range_10" data-block_start="29000" data-block_end="29FFF">SIP-10: U+29000&ndash;U+29FFF</option>    <option id="SIP_Range_11" value="SIP_Range_11" data-block_start="2A000" data-block_end="2AFFF">SIP-11: U+2A000&ndash;U+2AFFF</option>    <option id="SIP_Range_12" value="SIP_Range_12" data-block_start="2B000" data-block_end="2BFFF">SIP-12: U+2B000&ndash;U+2BFFF</option>    <option id="SIP_Range_13" value="SIP_Range_13" data-block_start="2C000" data-block_end="2CFFF">SIP-13: U+2C000&ndash;U+2CFFF</option>    <option id="SIP_Range_14" value="SIP_Range_14" data-block_start="2D000" data-block_end="2DFFF">SIP-14: U+2D000&ndash;U+2DFFF</option>    <option id="SIP_Range_15" value="SIP_Range_15" data-block_start="2E000" data-block_end="2EFFF">SIP-15: U+2E000&ndash;U+2EFFF</option>    <option id="SIP_Range_16" value="SIP_Range_16" data-block_start="2F000" data-block_end="2FFFF">SIP-16: U+2F000&ndash;U+2FFFF</option>    </optgroup>
			<optgroup label="Tertiary Ideographic Plane" data-block_start="30000" data-block_end="30FFF">     <option id="TIP_Range_01" value="TIP_Range_01">TIP-01: U+30000&ndash;U+30FFF</option>    <option id="TIP_Range_02" value="TIP_Range_02" data-block_start="31000" data-block_end="31FFF">TIP-02: U+31000&ndash;U+31FFF</option>    </optgroup>
			<optgroup label="Supplementary Special-Purpose Plane" data-block_start="E0000" data-block_end="E0FFF">     <option id="SSP_Range_01" value="SSP_Range_01">SSP-01: U+E0000&ndash;U+E0FFF</option>     </optgroup>
		</select></li>    </ol>
		<ol id="font_specimen_adjustments" class="display_flex flex_row flex_grow_1">
			<li class="no_highlight" data-inputid="font_size"><span class="flex_justify_center"><input type="range" id="font_size" data-tab_order="14" name="font_size" min="0" max="2" step="any"><label for="font_size">Font Size</label></span></li>     <li class="no_highlight display_none" data-inputid="line_height"><span class="flex_justify_center"><input type="range" id="line_height" data-tab_order="15" name="line_height" min="-1.2" max="1.2" step="any"><label for="line_height">Line Height</label></span></li>    <li class="no_highlight display_none" data-inputid="letter_spacing"><span class="flex_justify_center"><input type="range" id="letter_spacing" data-tab_order="16" name="letter_spacing" min="-100" max="100" step="1"><label for="letter_spacing">Letter Spacing</label></span></li>        <li class="spacer no_highlight width_100"></li>        <li data-inputid="text_color" class="display_flex no_highlight"><span class="flex_justify_center position_relative"><textarea id="text_color" class="whitespace_pre resize_none outline_none" data-tab_order="17" rows="1" cols="7" spellcheck="false" placeholder="CSS color"></textarea> Text Color</span></li>     <li data-inputid="text_stroke_width" class="display_flex no_highlight"><span class="flex_justify_center"><input type="range" id="text_stroke_width" data-tab_order="18" name="font_size" min="-0.5" max="0.5" step="any" title="In supported browsers only."><label for="text_stroke_width">Text Stroke Width</label></span></li>     <li data-inputid="text_stroke_color" class="display_flex no_highlight"><span class="flex_justify_center position_relative"><textarea id="text_stroke_color" class="whitespace_pre resize_none outline_none" data-tab_order="19" rows="1" cols="7" spellcheck="false" placeholder="CSS color"></textarea>Text Stroke Color</span></li>
		</ol></div>`;
		const content_font_sample_string = `ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789<br />!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
		const content_font_lorem_string = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
		const content_font_viewer = '<div id="font_file_viewer" class="position_absolute position_0 display_none"><div id="font_file_glyph_viewer" class="invert margin_0 padding_0 position_absolute position_0 display_none z_index_2"></div><ol id="font_file_grid" class="font_grid position_relative padding_0 align_center display_grid overflow_x_hidden"></ol></div>';
		const content_font_elements = `<div id="font_specimen_viewer" class="padding_0 display_none">
	<ol id="font_specimen_grid" class="font_grid display_grid overflow_visible"></ol>
	<div id="font_specimen">        <div id="font_specimen_1" class="specimen border_bottom_x margin_0 overflow_visible normal" data-tab_order="1" contenteditable="true">${ content_font_sample_string }</div>    <div id="font_specimen_2" class="specimen border_bottom_x align_left overflow_visible normal" data-tab_order="2" contenteditable="true" tabindex="0"><h2 id="specimen_2" class="margin_0 line_height_1 normal">Typography</h2><p id="specimen_2H4">The art of using types to produce impressions on paper, vellum, &amp;c.</p></div>    <div id="font_specimen_3" class="specimen border_bottom_x align_justify overflow_visible normal line_height_1" data-tab_order="3" contenteditable="true"><h3 id="specimen_3" class="margin_0 normal">S P E C I M E N</h3><p id="specimen_3H3" class="margin_0">Typography is the work of typesetters (also known as compositors), typographers, graphic designers, art directors, manga artists, comic book artists, graffiti artists, and, now, anyone who arranges words, letters, numbers, and symbols for publication, display, or distribution.</p></div>    <div id="font_specimen_4" class="specimen overflow_visible normal" data-tab_order="4" contenteditable="true" tabindex="0"><div id="lorem" class="lorem align_justify">${ content_font_lorem_string }</div><div id="lorem_2" class="lorem align_justify">${ content_font_lorem_string }</div><div id="lorem_3" class="lorem align_justify">${ content_font_lorem_string }</div></div>        </div>
	<div id="font_specimen_glyph_viewer" class="background_grey_90 display_none overflow_visible normal">    <div id="font_specimen_glyph" class="flex_justify_center position_fixed position_0 z_index_2" data-scale="1"></div><div id="font_specimen_glyph_overlay" class="position_fixed position_0 background_grey_100 user_select_none z_index_1"></div>    </div>
</div>    ${ content_font_viewer }`;
		const content_header_elements = `<header id="content_header" class="font_size_small z_index_3">
			<div id="audio_wrapper" class="text_color_default background_grey_80 display_none">${ content_audio_elements }</div>
			<div id="content_title_container" class="title display_flex text_color_default border_bottom">
				<div id="title_buttons_left" class="display_flex padding_4_6 align_left">            <nav id="cuesheet_track_list_container_video" class="cuesheet_track_list_container background_grey_75" title="Cue sheet track list"><div class="box_shadow_menu display_none font_size_small position_absolute position_LR_0 z_index_1"><ul id="cuesheet_track_list_video" class="cuesheet_track_list border_bottom margin_0 padding_0 display_none"></ul></div></nav>                <button id="reload_btn" class=" outline_none" tabindex="-1"><span></span></button>     <button id="prev_next_btns" class="split_btn padding_0 position_relative display_none outline_none" tabindex="-1"><span id="prev_btn" class="prev_next_btn flex_justify_center"><span class="transform_rotate_270_contents">${ SVG_UI_Icons.chevron }</span></span><span id="next_btn" class="prev_next_btn flex_justify_center"><span class="display_flex transform_rotate_90_contents">${ SVG_UI_Icons.chevron }</span></span></button>                </div>
				<div id="content_title" class="pointer align_center hyphens_none line_height_1_4 flex_justify_center_row flex_grow_1"><div><span class="has_icon_before has_icon_after bold"></span></div></div>
				<div id="title_buttons_right" class="display_flex padding_4_6 align_right">     <button id="scale" class="split_btn padding_0 position_relative display_none outline_none" tabindex="-1"><span id="decrease" class="flex_justify_center" title="Reduce"><span class="display_flex width_10px_contents">${ SVG_UI_Icons.minus }</span></span><span id="increase" class="flex_justify_center" title="Enlarge"><span class="display_flex width_10px_contents">${ SVG_UI_Icons.plus }</span></span></button>     <button id="open_in_texteditor" class="display_none outline_none" title="Open in Text Editor" tabindex="-1"><span>Edit</span></button>     <button id="save_svg" class="display_none whitespace_pre outline_none" title="Save glyph as svg"><span>Save SVG</span></button>     <button id="close_btn" class="outline_none" tabindex="-1" title="Close Content"><span></span></button></div>
			</div>
			<div id="content_playlist_item" class="playlist_entry_container border_bottom background_grey_85 align_center display_none"><textarea id="content_playlist_item_textarea" class="text_color_default padding_4_6 border_0 outline_none" rows="3" spellcheck="false"></textarea></div>
			${ content_font_toolbar }
		</header>`;
		switch(true) { // ASSEMBLE CONTENT ELEMENTS
			case id === 'content_font_viewer':		return content_font_viewer;
			case id === 'content_text_elements':	return content_text_elements;
			default:								return `<div id="content_pane" class="display_flex flex_column flex_grow_1 position_relative padding_0" data-content="has_null">		${ content_header_elements }	<main id="content_container" class="display_flex position_relative background_grey_90 no_hover margin_0 padding_0">     ${ SVG_UI_Icons.spinner }     <ol id="content_grid" class="content_el" data-kind="grid"></ol>     ${ content_text_elements }     <div id="content_font" class="content_el background_grey_90 hyphens_none position_relative text_color_default" spellcheck="false" data-kind="font">${ content_font_elements }</div>     <div id="content_image_container" class="content_el background_grey_95 position_relative margin_0" data-kind="image"><img id="content_image" class="content_el position_relative" src="#" alt="" tabindex="0" /></div>     <embed id="content_pdf" class="content_el position_relative border_0" tabindex="0" data-kind="pdf">     <div id="content_video_container" class="display_none track_title_container"><video id="content_video" class="content_el media_player background_grey_95 media" controls data-kind="video">Your browser does not support the video tag.</video></div>     <iframe id="content_iframe" class="content_el position_relative border_0 background_grey_85" name="content_iframe" sandbox="allow-scripts allow-same-origin allow-modals allow-popups" tabindex="0"></iframe>     <iframe id="content_iframe_utility" class="display_none" name="content_iframe_utility" sandbox="allow-scripts allow-same-origin allow-modals allow-popups" tabindex="0"></iframe>     </main></div>`;
		}
	}
	//==============================//
	// UTILITIES HTML (warnings and help)
	function Utilities_Elements(body_id) {
		let utilities_warning_elements = `<header id="warnings_header" class="text_color_default background_grey_85"><h3 id="warning_header" class="display_none margin_0"><span>Warning:</span></h3><h3 id="make_playlist_header" class="display_none margin_0 normal"><span>Make Playlist/Filelist (.m3u)</span></h3></header>
		<ul id="warnings" class="text_color_default background_grey_85">    <li id="warning_open_font" class="warning">Are you sure you want to close the font file?</li>    <li id="warning_close_font" class="warning">Are you sure you want to close the font file?</li>    <li id="warning_unsaved_text" class="warning">You have unsaved changes.</li>    <li id="warning_clear_text" class="warning">Are you sure you want to clear all your text?</li>    <li id="warning_local_file" class="warning">Can&rsquo;t load local file from non-local page.</li>    <li id="warning_close_playlist" class="warning">Are you sure you want to close the playlist?</li>    <li id="warning_local_playlist" class="warning">This playlist contains local files. <br />&emsp;Please reload this playlist from a local page in order to play them.</li>    <li id="warning_non_local_file" class="warning">This is a non-local file/dir/link. Would you like to open it in a new window?</li>            <li id="warning_make_playlist" class="warning"><form id="make_playlist_form" action="#"><fieldset class="margin_0 padding_0 border_0">            <ul id="make_playlist_options_sublist"><li><input name="make_playlist" type="radio" id="all_items" checked><label for="all_items">All items</label></li>    <li class="indent"><input name="make_playlist" type="radio" id="directories_only"><label for="directories_only">Directories only</label></li>    <li class="indent"><input name="make_playlist" type="radio" id="files_only"><label for="files_only">Files only</label></li>    <li><input name="make_playlist" type="radio" id="media_files_only"><label for="media_files_only">All media files</label></li>    <li class="indent"><input name="make_playlist" type="radio" id="audio_files_only"><label for="audio_files_only">Audio files only</label></li>    <li class="indent"><input name="make_playlist" type="radio" id="video_files_only"><label for="video_files_only">Video files only</label></li>    <li><input name="make_playlist" type="radio" id="all_non_media_files"><label for="all_non_media_files">All non-media items</label></li></ul></fieldset></form></li>            </ul>
		<div id="warning_buttons_container" class="display_flex flex_column background_grey_90"><div id="warning_buttons" class="display_flex flex_row">     <button id="warning_btn_dont_save" class="warning_button">Don&rsquo;t Save</button>     <button id="warning_btn_cancel" class="warning_button">Cancel</button>     <button id="warning_btn_clear" class="warning_button">Clear</button>     <button id="warning_btn_save" class="warning_button">Save</button>     <button id="warning_btn_ok" class="warning_button">OK</button>     </div></div>`;
		let utilities_help_elements = `
	<header id="help_header" class="title padding_4_6 position_LR_0 text_color_default border_bottom background_grey_75 align_center position_fixed z_index_3"><button style="visibility:hidden;float:left"><span>Close</span></button><span class="bold">HELP</span><button id="close_help" class="focus outline_none" style="float:right;"><span>Close</span></button></header>
	<nav id="help_contents" class="align_center background_grey_85 no_hover border_bottom"><h2 id="contents" style="margin-bottom:0;"><strong>CONTENTS</strong></h2>        <ul class="margin_0 no_highlight bold"><li class="no_highlight"><a class="internal" href="#about">I. About this Script</a></li><li class="no_highlight"><a class="internal" href="#shortcuts">II. Keyboard Shortcuts</a></li><li class="no_highlight"><a class="internal" href="#usage">III. Usage</a></li><li class="no_highlight"><a class="internal" href="#other">IV. Other Script Functions</a></li><li class="no_highlight"><a class="internal" href="#troubleshooting">V. Troubleshooting</a></li></ul>        </nav>
	<section class="line_height_1_4">
		<article><h2 id="about"><strong>I. ABOUT THIS SCRIPT</strong></h2>
			<dl><dt><a href="https://openuserjs.org/scripts/gaspar_schot/Supercharged_Local_Directory_File_Browser" class="has_icon_before link" target="_blank">Script home: openuserjs.org</a></dt></dl>            <dl><dt>GENERAL INFORMATION</dt>    <dd>This script works on <strong>local directories</strong>, as well as many remote server-generated index pages or &ldquo;<strong>open directories</strong>&rdquo;.</dd>    <dd>By default, userscripts do not run on local file:/// urls, so for this script to work on local directories you will need to enable it in your browser&rsquo;s extension settings (e.g.: For Tampermonkey in Chrome, open the Chrome extensions page, click the details button for Tampermonkey and check &lsquo;Allow access to file URLs&rsquo;).</dd>    <dd>To make the script work on a remote <strong>open directory</strong>, you must add its URL to the list of allowed sites in the settings for this userscript, as provided by your userscript manager.</dd>    <dd>Because server configurations vary, the script may not work perfectly (or at all) on some open directories, particularly those with a restrictive Content Security Policy (CSP). You may also need to allow&mdash;or block&mdash;javascript on some ODs, and/or allow cookies. Please let me know if you encounter any problems.</dd>    <dd>This script was developed in the latest version of Vivaldi, running on the latest MacOS. It has been <em>minimally</em> tested in other Chrome-based browsers, Safari, and Firefox, and has been <strong>not</strong> been tested in any other browsers or OSes. No effort has been made to ensure compatibility with older browsers. Please report any issues. </dd></dl>            <dl><dt><span class="invert" style="float:left; margin:4px 6px 0 0;">${ SVG_UI_Icons.ui_layout }</span>The UI consists of two main parts:</dt>   <dd>(1) the directory list <strong>SIDEBAR</strong> on the left and </dd>    <dd>(2) the <strong>CONTENT PANE</strong> on the right.</dd>    <dd>The Sidebar shows all the items in the current directory, while the Content Pane shows a preview of items selected in the Sidebar.</dd></dl>            <dl><dt>1. The <strong>SIDEBAR</strong> comprises a <strong>HEADER</strong>, the <strong>DIRECTORY LIST</strong> itself, and a <strong>FOOTER</strong>.</dt>    <dd>The <strong>Sidebar</strong> is resizeable; it can be hidden completely by clicking the double-chevron icon at the Sidebar top right or typing <b>&#8984;\</b>.</dd></dl>    
			<dl><dt>1A. The <strong>SIDEBAR HEADER</strong> contains a <strong>Parent Directory</strong> button, a <strong>Parent Directories</strong> menu which displays separate links for all the parent directories, and the <strong>Main Menu</strong>.</dt>   <dd>Below these are <strong>Show Details</strong> and <strong>Show Invisibles</strong> items, a <strong>Show Grid</strong> button (when appropriate), and sort by <strong>Name</strong> or <strong>Default</strong> items.</dd>    <dd>If <strong>Show Details</strong> is selected, additional sorting options are shown, along with the <strong>Text Editor</strong> item.</dd>    <dd>All of these items are also available in the Main Menu, and some can be toggled via keyboard shortcuts (see below).</dd></dl>            <dl><dt>1B. The <strong>DIRECTORY LIST</strong> displays the items in the current directory.</dt>    <dd>Directory items can be selected with the arrow keys or by clicking.</dd>    <dd>Selecting an item will preview it in the content pane.</dd>    <dd>Multiple directories, fonts, or images can be selected with shift+arrowkey, cmd+click, or shift+click.</dd>    <dd>Directories can be previewed in the content pane or toggled open in the sidebar to create a &ldquo;tree view&rdquo; of the directory by clicking the folder icon or typing Cmd&rarr;.</dd></dl>            <dl><dt>1C. The <strong>SIDEBAR FOOTER</strong> displays <strong>Stats</strong> for the items in the current directory.</dt>     <dd>Detailed stats can be shown by clicking the footer.</dd>    <dd>There is also a popup menu on the right of the footer with options to display the Sidebar directory or the raw directory index in the Content Pane.</dd></dl>            <dl><dt>2. The <strong>CONTENT PANE</strong> displays the selected sidebar item.</dt>    <dd>The content pane can be focused by tabbing from the sidebar or clicking. Links in HTML files can be navigated via the tab key.</dd>    <dd>Clicking the title of the content pane title reveals an EXTM3U-formatted playlist item for use in an EXTM3U file.</dd></dl>            <dl><dt>Previewed Content</dt></dl>            <dl><dt>Previewed Directories</dt>		<dd>Previewed directories in the Content Pane inherit the sorting and other UI preferences from the Sidebar directory list. They can be navigated independently from the Sidebar via the &ldquo;Parent Directory&rdquo; link in the header or Cmd-Up Arrow.</dd>		<dd>An item in the content pane header allows previewed directories to be opened into the sidebar.</dd>    <dd>A selected item can be previewed by pressing the spacebar. This is similar to the &ldquo;quicklook&rdquo; function in MacOS.</dd>    <dd>Double-clicking a selected directory list item or typing Cmd-Down Arrow will open it in the content pane, replacing the previewed directory. Closing the item via the Close Button or Cmd-W will restore the original previewed directory.</dd></dl>            </article>
		<article><h2 id="shortcuts" class="border_top_x padding_top_1rem"><strong>II. KEYBOARD SHORTCUTS</strong></h2>
			<ul id="utilities_help" class="info_list background_grey_80 font_size_small border_all padding_0 no_highlight">    <li class="info_list_header display_grid align_center bold no_hover no_highlight"><span class="col_1">SHORTCUT</span><span class="col_2">DESCRIPTION</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&uarr;</kbd> or <kbd>&darr;</kbd></span><span class="col_2">Select the previous/next sidebar item or previewed directory item.<br />If audio is playing, and the previous/next file is also audio, the file will be highlighted but not loaded in the audio player; press <kbd>return</kbd> to load it.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&larr;</kbd> or <kbd>&rarr;</kbd></span><span class="col_2">Select prev/next item of the same kind as the current selection.<br />If current selection is a media file, select and begin playback of the next media item.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8997;</kbd><kbd>&larr;</kbd> or <kbd>&#8594;</kbd></span><span class="col_2">Skip media &plusmn;10 seconds.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8997;</kbd><kbd>&#8679;</kbd><kbd>&larr;</kbd> or <kbd>&rarr;</kbd></span><span class="col_2">Skip media &plusmn;30 seconds.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&uarr;</kbd></span><span class="col_2">Go to parent directory.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&darr;</kbd></span><span class="col_2">Go to selected sidebar directory.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&rarr;</kbd></span><span class="col_2">Open selected sidebar directory as subdirectory.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&larr;</kbd></span><span class="col_2">1. Close selected subdirectory, or <br />2. jump from selected subdirectory item to parent directory, or <br />3. jump up to closest open subdirectory, or <br />4. jump up to top of directory list.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8679;</kbd><kbd>&uarr;</kbd> or <kbd>&darr;</kbd> or <kbd>&larr;</kbd> or <kbd>&rarr;</kbd></span><span class="col_2">Select multiple sidebar items: only works if a directory, image, or font is selected. Multiple images and fonts will open a grid view in the content pane.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8679;</kbd><kbd>Click</kbd></span><span class="col_2">Select a range of sidebar items: directories, images, or fonts only. Multiple images and fonts will open a grid view in the content pane.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>Escape</kbd></span><span class="col_2">Close menus and help, unfocus textareas and content pane, etc.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>Return</kbd></span><span class="col_2">Open selected sidebar directory, select file, or pause/play media.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>Space</kbd></span><span class="col_2">Pause/Play media files (if media player loaded).<br />&ldquo;Quicklook&rdquo; selected content pane directory list item.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>A</kbd></span><span class="col_2">Select all sidebar items of selected type; works with dirs, images, and fonts. Images and fonts will open a grid view in the content pane.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>Tab</kbd></span><span class="col_2">Toggle focus between sidebar and content pane.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&#8679;</kbd><kbd>D</kbd></span><span class="col_2">Toggle file details (size, date modified, kind) in some index page types.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>E</kbd></span><span class="col_2">Toggle main menu.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&#8679;</kbd><kbd>E</kbd></span><span class="col_2">Show text editor.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>G</kbd></span><span class="col_2">Show or reload image or font grids.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&#8679;</kbd><kbd>I</kbd></span><span class="col_2">Toggle invisible files.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&#8679;</kbd><kbd>J</kbd></span><span class="col_2">Go to item by row number.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&#8679;</kbd><kbd>O</kbd></span><span class="col_2">Open selected sidebar item in new window/tab.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>R</kbd></span><span class="col_2">Reload grids and previewed content, reset scaled images/fonts, reset media files to beginning.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&#8997;</kbd><kbd>W</kbd></span><span class="col_2">Close previewed content.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>&#8679;</kbd><kbd>&lt;</kbd> or <kbd>&gt;</kbd></span><span class="col_2">Scale preview items and grids.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8984;</kbd><kbd>\\</kbd></span><span class="col_2">Toggle sidebar.</span></li>    <li class="display_grid no_hover no_highlight"><span class="col_1"><kbd>&#8679;</kbd><kbd>&#8984;</kbd><kbd>\\</kbd></span><span class="col_2">Toggle text editor split view.</span></li></ul>            </article>
		<article><h2 id="usage" class="border_top_x padding_top_1rem"><strong>III. USAGE</strong></h2>
			<p><span class="width_14px_contents">${ SVG_UI_Icons.menu }</span><strong> MAIN MENU</strong> (&#8984;+E)<br />The Main Menu contains the following top-level items:<p>
			<ul class="border_all no_highlight bold" style="display:inline-block;">    <li class="no_highlight padding_4_6 border_bottom">1. Go to item... (&#8984;+&#8679;+J)</li>    <li class="no_highlight padding_4_6 border_bottom">2. Sort by... ${SVG_UI_Icons.arrow}</li>    <li class="no_highlight padding_4_6">3. UI Preferences ${SVG_UI_Icons.arrow}</li>    <li class="no_highlight padding_4_6">4. File Handling Preferences ${SVG_UI_Icons.arrow}</li>    <li class="no_highlight padding_4_6">5. Media Preferences ${SVG_UI_Icons.arrow}</li>    <li class="no_highlight padding_4_6">6. Text Editing Preferences ${SVG_UI_Icons.arrow}</li>    <li class="no_highlight padding_4_6 border_bottom">7. Default Preferences</li>    <li class="no_highlight padding_4_6 border_bottom">8. Playlists ${SVG_UI_Icons.arrow}</li>    <li class="no_highlight padding_4_6 border_bottom">9. Open Font File...</li>    <li class="no_highlight padding_4_6">10. Script Home</li>    <li class="no_highlight padding_4_6">11. Help</li>    <li class="no_highlight padding_4_6">12. Buy me a Coffee</li>    <li class="no_highlight padding_4_6">13. Contact</li></ul>
			<dl class="border_top_x padding_top_1rem"><dt>1. Go to Item...</dt> <dd>Select a sidebar item by its row number (displayed if "Show Numbers" pref is set). Useful especially for large directories. Directory list can also be navigated by typed strings.</dd></dl>
			<p class="border_top_x"><strong>2. SORT BY...</strong> ${SVG_UI_Icons.arrow}<br />Sort directory items by <strong>Name</strong>, <strong>Size</strong>, <strong>Date</strong>, <strong>Kind</strong>, <strong>Extension</strong>, <strong>Duration</strong> (media items only). <strong>Default</strong> sort = sort items by Name, with directories on top.</p>
			<dl><dd>Clicking the sort preference again will reverse the sort.</dd>    <dd>Sorting preferences are also available in the Sidebar Header.</dd>    <dd>Note that many server configurations don&rsquo;t report directory size, so when sorting by size, directories will be on top, sorted by name.</dd></dl>
			<p class="border_top_x"><strong>3. UI PREFERENCES</strong> ${SVG_UI_Icons.arrow}<br />Selecting these preferences items will add the new setting to the URL query string, so that the setting will persist as you navigate within the same window, or if you bookmark the page.</p>
			<dl><dt>a. Light Theme/Dark Theme</dt>    <dd>Change the UI theme.</dd></dl>            <dl><dt>b. Alternate Backgrounds</dt>    <dd>Alternate background colors for directory list items.</dd></dl>            <dl><dt>c. Show Numbers</dt>    <dd>Show numbers for directory list items.</dd></dl>            <dl><dt>d. Use Custom Icons</dt>    <dd>If enabled, use custom file and directory icons provided by the script; if disabled, use the browser&rsquo;s default icons.</dd></dl>            <dl><dt>e. Show Image Thumbnails</dt>    <dd>Replace image file icons with a thumbnail icon of the image itself. Enabling this setting may slow down page load, because each image file in the directory must be downloaded.</dd></dl>            <dl><dt>f. Use Large Image Thumbnails</dt>    <dd>If &ldquo;Show Image Thumbnails&rdquo; is also enabled, a larger version of the image thumbnail is displayed.</dd></dl>            <dl><dt>g. Always Show Image Thumbnails</dt>    <dd>Image thumbnails are always shown, no matter how many images are in the directory. This overrides the default behavior which automatically disables thumbnail display for directories containing more than 2000 items in order to improve performance.</dd></dl>            <dl><dt>h. Audio Player at Top</dt>    <dd>Disable this item in order to position the audio player at the bottom of the content pane.</dd></dl>            <dl><dt>i. Set UI Font</dt>    <dd>Set a custom font for the UI.</dd></dl>            <dl><dt>j. Scale UI</dt>    <dd>Scale the entire UI (50%&ndash;150%). Double-click the label to quickly reset the scale to 100%.</dd></dl>
			<p class="border_top_x"><strong>4. FILE HANDLING PREFERENCES</strong> ${SVG_UI_Icons.arrow}</p>
			<dl><dt>a. Show/Hide Invisible Items</dt>    <dd>It does what it says on the tin&hellip;</dd></dl>            <dl><dt>b. Show/Hide Ignored Items</dt>		<dd>Ignored items include files that the browser cannot handle natively (e.g., common Office and graphics files, various binary files, etc.). Hide them to reduce clutter.</dd></dl>            <dl><dt>c. Ignore Ignored Items</dt>	<dd>Prevent normal browser behavior for handling such files, which is to open a download file dialog.</dd></dl>            <dl><dt>d. Autoload Index Files</dt>    <dd>Automatically load &ldquo;index.html&rdquo; or similar files in the Content Pane when the directory loads.</dd></dl>
			<p class="border_top_x"><strong>5. MEDIA PREFERENCES</strong> ${SVG_UI_Icons.arrow}</p>
			<dl><dt>a. Autoload Media</dt>    <dd>If enabled, automatically load the first media file (audio or video) when the directory loads.</dd>    <dd>For audio files, this will also automatically load any &ldquo;cover art&rdquo; (image file) found in the same directory. The script will first look for an image file with <i>exactly</i> the same name as the currently selected/playing audio file, followed in order by files containing the words &ldquo;cover&rdquo;, &ldquo;front&rdquo;, &ldquo;album&rdquo;, &ldquo;jacket&rdquo;, &ldquo;sleeve&rdquo;, &ldquo;cd&rdquo;, &ldquo;disc&rdquo;, &ldquo;insert&rdquo;, &ldquo;liner&rdquo;, or &ldquo;notes.&rdquo; If it finds no matching files, it will load the first image file it finds. Cover art will be automatically loaded whenever a new audio file is selected for playback.</dd></dl>            <dl><dt>b. Autoplay Media</dt>    <dd>If enabled, play the next media file when the currently playing media file ends.</dd></dl>            <dl><dt>c. Play All Media Files</dt>    <dd>If disabled (and Autoplay Media enabled), only play media of the same type (audio or video) as the currently playing media file.</dd></dl>            <dl><dt>d. Loop Media Playback</dt>    <dd>Loop media playback to the first media item when the last media item ends and continue playing. This option can also be enabled from the audio player.</dd></dl>            <dl><dt>e. Shuffle Media Playback</dt>    <dd>Randomize the order of media playback. This option can also be enabled from the audio player.</dd>     <dd>A media item selected via the up/down arrow keys will be played after the currently playing item. This give you the option to play a specific item while continuing with shuffle play.</dd></dl>
			<p class="border_top_x"><strong>6. TEXT EDITING PREFERENCES</strong> ${SVG_UI_Icons.arrow}</p>
			<dl><dt>a. Text Editing Enabled/Disabled</dt><dd>If text editing is disabled, text files are displayed as normal files.</dd></dl>            <dl><dt>b. Text Editing Options</dt><dd>Toggle the Text Editor. Select Editor UI theme: Default = same as main UI. Toggle split view. Select view of raw text, preview text, rendered HTML.</dd></dl>            <dl class="border_top_x padding_top_1rem padding_bottom_1rem"><dt>7. DEFAULT PREFERENCES</dt><dd>Resets UI to defaults by removing manually set preferences from the URL query string.</dd></dl>
			<p class="border_top_x"><strong>8. PLAYLISTS</strong> ${SVG_UI_Icons.arrow}</p>
			<dl><dt>a. Open Playlist/Filelist&hellip;</dt>    <dd>Click to load a local .m3u file. See below for more details.</dd></dl>            <dl><dt>b. Make Playlist/Filelist&hellip;</dt><dd>Make an .m3u playlist/filelist of the items in the current sidebar directory, with option to include audio only, video only, all media, all non-media, all items, directories or files only.</dd></dl>            <dl class="border_top_x padding_top_1rem"><dt><strong>9. OPEN FONT FILE&hellip;</strong></dt>    <dd>Load a local font file to view its complete glyph repertoire in a grid and information about the font.</dd>    <dd>Note that this function is different from previewing a font from the sidebar.</dd>    <dd>Font file glyph grids can be navigated with the arrow keys. Individual glyphs can be selected by clicking them or pressing <strong>Return</strong>.</dd>    <dd>Individual glyphs may be saved as .svg files.</dd></dl>            <dl class="border_top_x padding_top_1rem"><dt><strong>10. SCRIPT HOME</strong></dt> <dd><strong><a href="https://openuserjs.org/scripts/gaspar_schot/Supercharged_Local_Directory_File_Browser" class="link text_color_default" target="_blank">openuserjs.org</a></strong>.</dd></dl>            <dl><dt><strong>11. HELP</strong></dt><dd>Show this help page.</dd></dl>            <dl><dt><strong>12. BUY ME A COFFEE</strong></dt><dd><strong><a id="donate_link" class="ignore_warning" href="https://www.buymeacoffee.com/fiLtliTFxQ" target="_blank" rel="noopener">Coding is a lot of work...</a></strong></dd></dl>            <dl><dt><strong>13. CONTACT</strong></dt><dd><strong><a id="contact_link" class="ignore_warning" href="mailto:mshroud@protonmail.com">Email</a></strong> me about anything to do with the script.</dd></dl>            </article>
		<article><h2 id="other" class=" border_top_x padding_top_1rem"><strong>IV. OTHER SCRIPT FUNCTIONS</strong></h2>
			<dl><dt>NAVIGATION</dt>    <dd>Use the up and down arrow keys to navigate items in the sidebar and previewed directories in the content pane.</dd>    <dd>Use the left and right arrow keys to navigate items of the same kind as the currently selected item.</dd>    <dd>Use the Tab key to toggle the focus between the sidebar and the content pane.</dd>    <dd>Type a letter or letters to navigate the directory by file name.</dd>    <dd>Type <b>&#8984;&darr;</b> to navigate to the selected directory.</dd>    <dd>Click a directory icon in the sidebar or select it and type <b>&#8984;&rarr;</b> to open subdirectory; to close, click the icon again or type <b>&#8984;&larr;</b>.</dd></dl>            <dl><dt>IMAGES, FONTS, and FONT GLYPHS</dt><dd>These previewed items can be scaled with <b>&#8984;+/&ndash;</b> keys.</dd></dl>     <dl><dt>FONT and IMAGE GRIDS</dt><dd>If a directory contains fonts and/or image files, the &ldquo;Show Grid&rdquo; icon will appear in the sidebar. Click it or type <b>&#8984;G</b> to show a grid of the available items.</dd>    <dd>Grids can be navigated with the arrow keys, and individual grid items may be viewed by clicking them or pressing <b>Return</b>.</dd>    <dd>When a grid item is being viewed, the grid can still be navigated with the arrow keys.</dd>    <dd>Closing a selected grid item will show the grid again.</dd></dl>            <dl><dt>PLAYLISTS AND FILELISTS (m3u)</dt><dd>The script supports basic .m3u playlists containing links to audio or video files, but it also has custom support for &ldquo;filelists,&rdquo; which are standard .m3u files that contain links to <i>any</i> type of file or directory.</dd>    <dd>Playlist files can be opened via the menu item.</dd>    <dd>However, for ease of use, if you change the extension of an ordinary .m3u file to .txt, the script will read it normally as an editable text file. Double-clicking such a file in the sidebar or typing <b>&#8984;&darr;</b> or <b>&#8984;+Return</b> will open it as a playlist/filelist. Please note that the text file must begin with &ldquo;#EXTM3U&sdquo; for this work.</dd></dl>            <dl><dt>CUE SHEETS (cue)</dt><dd>When a media file (audio or video) is loaded, the script will look for a .cue file in the same directory with <i>EXACTLY</i> the same name as the media file.</dd>    <dd>If it finds one, it will load the Track ID, the PERFORMER, the TITLE, and the INDEX (time position) into a menu next to the audio player; there is no support for other commands.</dd>    <dd>Tracks can be selected by clicking the item, and played or paused by clicking the selected item.</dd>    <dd>.cue files can also be selected independently in the sidebar and edited and saved (locally). This may be handy for creating &ldquo;on the fly&rdquo; bookmarks for a long media track before closing the page.</dd>    <dd>Note that you can also create and save (locally) a new .cue file by using the Text Editor.</dd>    <dd>Note (MacOS): If you prefer not to clutter the sidebar with .cue files, you may make them invisible by adding a dot to beginning of the file name; the script will still find them.</dd></dl>            </article>
		<article><h2 id="troubleshooting" class="border_top_x padding_top_1rem"><strong>V. TROUBLESHOOTING</strong></h2>
<dl><dt>The script doesn&rsquo;t work with a specific directory.</dt><dd>If you have a javascript blocker installed in your browser (and if you don&rsquo;t, you should), try disabling some of the site-specific scripts and XHR requests, as they may be interfering with the execution of this script.</dd>    <dd>Alternately, if you do have a javascript blocker installed, you may need to allow some scripts and XHR requests instead.</dd>    <dd>If the open directory still does not display correctly, check to see if cookies from the site are blocked.</dd>    <dd>Try deleting preferences from the Main Menu or removing the query string from the URL in the browser.</dd></dl>            <dl><dt>A specific item in a directory does not display correctly.</dt><dd>Confirm that the file is one that browser is capable of rendering. This script cannot display files that the browser itself cannot display.</dd>    <dd>If the item is from a playlist (m3u) and links to a remote site (e.g., archive.org), check your javascript blocker and cookies for any that need to be allowed from that site.</dd></dl>            <dl><dt>If you think you have found a bug, please <a class="ignore_warning" href="mailto:mshroud@protonmail.com"><b><i>contact me</i></b></a>.</dt></dl><p>&nbsp;</p>
		</article></section>`;
		let help_elements = '';		if ( body_id === 'top_body' ) { help_elements = `<aside id="help_container" class="background_grey_95 text_color_default no_hover display_none">${ utilities_help_elements }</aside>`; }
		return `<div id="utilities" class="position_absolute display_none position_LR_0 z_index_9999"> <aside id="warnings_container" class="overflow_hidden background_grey_90 hyphens_none z_index_9999">${ utilities_warning_elements }</aside> ${ help_elements } </div>`;
	}
	// ===> END UI HTML
	//==============================//
	// ===> STYLES
	const background_images = `
		.menu_item::before										{ content:""; width:12px; max-width:12px; min-width:12px; height:9px; margin:2px 0 -2px; background-position:center; background-repeat:no-repeat; display:flex; }
		.submenu .menu_item::before								{ width:24px; max-width:24px; min-width:24px; }
		.has_background, .has_background_before::before, .has_background_after::after	{ background-repeat:no-repeat; background-position:center; background-color:transparent !important; }
		.bookmark > a::before															{ background-image:${ get_SVG_UI_Icon("bookmark") }; }
		:is(.sort_by_default #menu_sort_by_default, .sort_by_name #menu_sort_by_name, .sort_by_duration #menu_sort_by_duration, .sort_by_size #menu_sort_by_size, .sort_by_date #menu_sort_by_date, .sort_by_kind #menu_sort_by_kind, .sort_by_ext #menu_sort_by_ext, #menu_theme_container, #toggle_text_editing)  .menu_item::before,     :is(.sort_by_default #sort_by_default, .sort_by_name #sort_by_name, .sort_by_duration #sort_by_duration, .sort_by_size #sort_by_size, .sort_by_date #sort_by_date, .sort_by_kind #sort_by_kind, .sort_by_ext #sort_by_ext) span::before,     .loop_media #loop_media_menu::before, .shuffle_media #shuffle_media_menu::before, .background_color_check_mark::before,     .texteditor_view_raw #toggle_texteditor_raw::before, .texteditor_view_styled #toggle_texteditor_preview::before, .texteditor_view_html #toggle_texteditor_html::before,     body:not(.text_editing_enable_false) #text_editing_enable::before, .texteditor_view_html #texteditor_view_html::before, .cuesheet_track.selected .cue_track_id::before, .menu_item.checkmark::before
																						{ background-image:${ get_SVG_UI_Icon("check_mark") }; }
		:is( .show_invisibles_false #show_invisible_items, .alternate_background_false #alternate_background, .show_numbers_false #show_numbers, .use_custom_icons_false #use_custom_icons, .show_image_thumbnails_false #show_image_thumbnails, .show_large_image_thumbnails_false #show_large_image_thumbnails, .show_ignored_items_false #show_ignored_items, .ignore_ignored_items_false #ignore_ignored_items, .autoload_index_files_false #autoload_index_files, .media_autoload_false #media_autoload, .media_autoplay_false #media_autoplay, .media_play_all_false #media_play_all, .texteditor_split_view_false:not(.has_texteditor) #texteditor_split_view, .show_media_name_in_window_title_false #show_media_name_in_window_title, .audio_player_on_top_false #audio_player_on_top, .iframe_theme_false #iframe_theme) .menu_item.checkmark::before
																						{ background-image:none; }
		.sort_by_default #sort_by_default span::after, .sort_by_name #sort_by_name span::after, .sort_by_duration #sort_by_duration span::after, .sort_by_size #sort_by_size span::after, .sort_by_date #sort_by_date span::after, .sort_by_kind #sort_by_kind span::after, .sort_by_ext #sort_by_ext span::after			{ background-image:${ get_SVG_UI_Icon("chevron") }; background-size:75%; transform:rotate(180deg); }
		.is_error #sidebar_nav, .is_error #current_dir_path span::before				{ background-image:${ get_SVG_UI_Icon("error") }; }
		.is_error #sidebar_nav															{ background-repeat:no-repeat; background-position:center top 6rem; background-size:6rem;}
		.is_error #current_dir_path span::before										{ float:none; display:inline-flex; margin:0 0 -2px 0; width:24px; }
		#content_pane[data-content="has_ignored"] #content_container					{ background-image:${ get_SVG_UI_File_Icon('file_icon_ignored') }; background-size:28px; }
		#content_pane.has_audio[data-content="has_null"]:not([data-loaded="unloaded"]) #content_container, #content_pane.has_audio:not([data-content]) #content_container, .has_audio #content_pane[data-content="has_null"]:not([data-loaded="unloaded"]) #content_container, .has_audio #content_pane:not([data-content])[data-loaded="loaded"] #content_container
																						{ background-image:${ get_SVG_UI_Icon("music") }; }
			${ CSS_UI_Icon_Rules() }
		#sidebar_menu_main ul a::before													{ background-image:${ get_SVG_UI_File_Icon('file_icon_file') }; }
		#sidebar_menu_main ul a[href^="file"]::before, #current_dir_path span::before	{ background-image:${ get_SVG_UI_File_Icon('file_icon_dir') }; margin-bottom:-3px; }
		#sidebar_menu_main ul a[href^="http"]::before									{ background-image:${ get_SVG_UI_File_Icon('file_icon_htm') }; }
		body.use_custom_icons_false .dir .has_icon_before_before						{ background-image:${ get_SVG_UI_File_Icon('file_icon_dir_default') }; background-size:auto 13px; }
		body.use_custom_icons_false.show_image_thumbnails_false .file:not(.app) .has_icon_before_before, body.use_custom_icons_false:not(.show_image_thumbnails_false) .file:not(.app) .has_icon_before_before
																						{ background-image:${ get_SVG_UI_File_Icon('file_icon_file_default') }; background-size:auto 13px; }
		body:not(.use_custom_icons_false).show_image_thumbnails_false .image .has_icon_before_before	{ background-image:${ get_SVG_UI_File_Icon('file_icon_image') } }
		.has_playlist #current_dir_path span::before									{ background-image:${get_SVG_UI_File_Icon('file_icon_playlist')}; display:inline-flex; margin:-2px 0 0; width:24px; vertical-align:middle;}
		.dirlist_item.dir:not(.has_subdirectory) .has_icon_before_before:hover			{ background-image:${ get_SVG_UI_Icon('chevron') }; transform:rotate(90deg);  filter:invert(1); }
		.dirlist_item.dir.has_subdirectory .has_icon_before_before:hover				{ background-image:${ get_SVG_UI_Icon('chevron') }; transform:rotate(180deg); filter:invert(1); }
		.dirlist_item.non_local .name_span span::before									{ background-image:${ get_SVG_UI_Icon('external_link') }; content:""; width:20px; min-width:20px; height:14px; margin-top:-3px; margin-bottom:-3px; background-position:left center; background-repeat:no-repeat; background-blend-mode:screen; display:inline-block; }
		.dirlist_item:is(.dir,.other,.system,.bin,.invisible,.markdown):is(.selected,:hover) a .has_icon_before_before												{ filter:brightness(var(--brightness_low)); }
		.theme_light .dirlist_item.audio:is(.selected,:hover) a .has_icon_before_before													{ mix-blend-mode: hard-light; filter:brightness(0.75) contrast(2) saturate(2.66); }
		.theme_dark  .dirlist_item.audio:is(.selected,:hover) a .has_icon_before_before, .dirlist_item.content_loaded.non_local .name_span span::before				{ filter:brightness(1.33); }
		.dirlist_item.selected:is(.archive,.app) a .has_icon_before_before, .dirlist_item:is(.archive,.app):hover a .has_icon_before_before							{ filter:brightness(var(--brightness_high)) saturate(6); }
		.dirlist_item.non_local:is(.selected,.audio_loaded) .name_span span::before, body:not(.no_hover) .dirlist_item.non_local:hover .name_span span::before		{ filter:brightness(2); }
		.dirlist_subdir_loading .has_icon_before_before									{ background-image:${ get_SVG_UI_Icon('spinner') } !important; filter:invert(1); background-size:20px; }
	`;
	const global_styles = `
		.theme_light {	--percent_100:100%; --percent_95:95%; --percent_90:90%; --percent_85:85%; --percent_80:80%; --percent_75:75%; --percent_70:70%; --percent_65:65%; --percent_60:60%; --percent_55:55%;
						--percent_50:50%;   --percent_45:45%; --percent_40:40%; --percent_35:35%; --percent_30:30%; --percent_25:25%; --percent_20:20%; --percent_15:15%; --percent_10:10%; --percent_05:05%; --percent_00:00%;
						--border_lum:40%;	--border_lum_inverted:40%;			--brightness_low:1.15;	--brightness_med:1.33;	--brightness_high:1.875;
						--non_media_item_background_h:216deg;	--non_media_item_background_s:100%;		--non_media_item_background_l:50%;	--non_media_item_background_a:0.8;
						--media_item_background_h:180deg;		--media_item_background_s:100%;			--media_item_background_l:33%;		--media_item_background_a:1;
						--texteditor_item_background_h:250deg;	--texteditor_item_background_s:66%;		--texteditor_item_background_l:66%; --texteditor_item_background_a:1.00; }
		.theme_dark {	--percent_100:00%;	--percent_95:05%; --percent_90:10%;	--percent_85:15%; --percent_80:20%; --percent_75:25%; --percent_70:30%; --percent_65:35%; --percent_60:40%; --percent_55:45%;
						--percent_50:50%;	--percent_45:55%; --percent_40:60%;	--percent_35:65%; --percent_30:70%; --percent_25:75%; --percent_20:80%; --percent_15:85%; --percent_10:90%; --percent_05:95%; --percent_00:100%;
						--border_lum:05%;	--border_lum_inverted:40%;			--brightness_low:1.15;	--brightness_med:1.5;	--brightness_high:1.66;
						--non_media_item_background_h:216deg;	--non_media_item_background_s:80%;		--non_media_item_background_l:60%;	--non_media_item_background_a:0.8;
						--media_item_background_h:180deg;		--media_item_background_s:50%;			--media_item_background_l:40%;		--media_item_background_a:1;
						--texteditor_item_background_h:250deg;	--texteditor_item_background_s:50%;		--texteditor_item_background_l:60%; --texteditor_item_background_a:1.00; }
		li, div {		--non_media_background:			hsla(var(--non_media_item_background_h),	var(--non_media_item_background_s),		var(--non_media_item_background_l),		var(--non_media_item_background_a));
						--media_background:				hsla(var(--media_item_background_h),		var(--media_item_background_s),			var(--media_item_background_l),			var(--media_item_background_a));
						--texteditor_item_background:	hsla(var(--texteditor_item_background_h),	var(--texteditor_item_background_s),	var(--texteditor_item_background_l),	var(--texteditor_item_background_a)); }
		:root		 {	--font_size_small:0.875rem; --font_size_smaller:0.75rem; color-scheme:none; }
		:root, html, body																		{ margin:0; padding:0; border:0; border-radius:0; overflow:hidden; display:flex; flex-direction:row; width:100%; height:100vh; font-family:${UI_Prefs_Non_Bool.ui_font}; font-size:${ UI_Prefs_Non_Bool.ui_font_size}; hyphens:auto; transform-origin:0 0; }
		a, a:hover																				{ color:inherit; font-weight:inherit; text-decoration:none !important; }
		ul, li																					{ list-style:none; }
		svg																						{ margin:auto; }
		button, .warning_button				{ background-color:hsl(0,0%,95%); border:solid 1px #333; border-radius:3px; height:18px; font-size:0.875em; font-family:${UI_Prefs_Non_Bool.ui_font} !important; cursor:pointer; }
		button.focus, button:focus, .warning_button		{ border-radius:3px !important; border-style:solid !important; border-width:1px !important; border-color:#222 !important; }
		.selected, .audio_loaded { --background_opacity:1; }				:hover, .hovered	{ --background_opacity:0.75; }
		.focus_content #sidebar .selected,	.focus_content #sidebar .audio_loaded				{ --background_opacity:0.50; opacity:1; }
		.focus_content #sidebar :hover,	.focus_content #sidebar .hovered					{ --background_opacity:0.25; }
		.align_left { text-align:left; }    .align_center { text-align:center; }    .align_right { text-align:right; }    .align_justify { text-align:justify; text-justify:inter-character; hyphens:auto; }
		.background_grey_60				{ background-color:hsl(0,0%,var(--percent_60)); }				.background_grey_65						{ background-color:hsl(0,0%,var(--percent_65)); }
		.background_grey_70				{ background-color:hsl(0,0%,var(--percent_70)); }				.background_grey_75, body				{ background-color:hsl(0,0%,var(--percent_75)); }
		.background_grey_80				{ background-color:hsl(0,0%,var(--percent_80)); }
		.background_grey_85, .dirlist_item:nth-of-type(odd), .cuesheet_track:not(.header):nth-of-type(odd), #utilities_help li:nth-of-type(even), body.alternate_background_false .dirlist_item:nth-of-type(even)
										{ background-color:hsl(0,0%,var(--percent_85)); }
		.background_grey_90, .dirlist_item:nth-of-type(even), .cuesheet_track:not(.header):nth-of-type(even), #stats li:nth-of-type(even)		{ background-color:hsl(0,0%,var(--percent_90)); }
		.background_grey_95,  .background_grey_90:not(.no_hover):hover, .background_grey_90.hovered, .background_grey_90.selected, .background_grey_90:focus	{ background-color:hsl(0,0%,var(--percent_95)); }
		.background_grey_100, .background_grey_95:not(.no_hover):hover, .background_grey_95.hovered, .background_grey_95.selected								{ background-color:hsl(0,0%,var(--percent_100)); }
		${ background_images }
		.border_0			{ border:			none; }												.border_all			{ border:		solid 1px hsl(0,0%,var(--border_lum)); }
		.border_top			{ border-top:		solid 1px hsl(0,0%,var(--border_lum)); }			.border_right		{ border-right:	solid 1px hsl(0,0%,var(--border_lum)); }
		.border_bottom		{ border-bottom:	solid 1px hsl(0,0%,var(--border_lum)); }			.border_left		{ border-left:	solid 1px hsl(0,0%,var(--border_lum)); }
		.border_top_x		{ border-top:		solid 1px hsl(0,0%,var(--border_lum_inverted)); }	.border_right_x		{ border-right:	solid 1px hsl(0,0%,var(--border_lum_inverted)); } /* "x" = inverted for theme_dark */
		.border_bottom_x	{ border-bottom:	solid 1px hsl(0,0%,var(--border_lum_inverted)); }	.border_left_x		{ border-left:	solid 1px hsl(0,0%,var(--border_lum_inverted)); }
		.box_shadow_menu											{ box-shadow:0px 4px 6px -3px #000; }
		.display_grid, .info_list:hover li, .has_flyout_menu:hover ul	{ display:grid; }
		.display_none, .error_display_none { display:none; }    .display_block { display:block; }    .display_flex { display:flex; }    .display_inline_flex { display:inline-flex; }    .flex_column { flex-direction:column; } flex-direction:column; }    .flex_row { flex-direction:row; }
		.flex_justify_center										{ display:flex;  flex-direction:column;  justify-content:center;  flex-grow:1;  align-items:center;  align-self:stretch; text-align:center; }
		.flex_justify_center_row									{ display:flex;  flex-direction:row;     justify-content:center;  flex-grow:1;  align-items:center; }
		.flex_justify_contents										{ justify-content:space-between; }
		.flex_grow_1												{ flex-grow:1; }
		.font_size_small											{ font-size:var(--font_size_small); }
		.has_flyout_menu											{ outline:none; justify-content:center; align-content:center; }
		.has_flyout_menu ul li										{ width:100%; margin:0; padding:4px 6px; text-align:right; box-sizing:border-box; white-space:pre; grid-column:1; }
		.has_flyout_menu ul div										{ grid-column:2; padding-top:8px; }
		.has_flyout_menu .item_1 { grid-row:1; }    .has_flyout_menu .item_2 { grid-row:2; }
		.height_100													{ height:100%; }
		.hyphens_none												{ hyphens:none; }
		.info_list													{ color:hsl(0,0%,var(--percent_10)); }
		.info_list li												{ grid-template-columns:minmax(33%,100%) min(66%); border-top:solid 1px hsl(0,0%,var(--border_lum)); }
		.info_list li.info_list_header								{ border-top:none;  }
		.info_list li .col_1										{ font-weight:bold; text-align:right; border-right:solid 1px hsl(0,0%,var(--border_lum)); }
		.info_list span												{ display:inline-block; padding:4px 6px; }
		.line_height_1 { line-height:1; }    .line_height_1_2, .info_list span { line-height:1.2; }    .line_height_1_4 { line-height:1.4; }
		.margin_0, header, footer, nav, ol, ul, li					{ margin:0; }
		.media.local input											{ cursor:not-allowed; }
		.normal														{ font-weight:normal; }
		.outline_none, .outline_none:focus, .outline_none:focus-visible		{ outline:none; }
		.overflow_auto { overflow:auto; }    .overflow_hidden { overflow:hidden; }    .overflow_visible { overflow:visible; }    .overflow_x_hidden { overflow-x:hidden; }
		.padding_0, header, footer, nav, a, ol, ul, li				{ padding:0; }
		 .padding_4_6 { padding:4px 6px; }    .padding_4_8 { padding:4px 8px; }    .padding_6_8 { padding:6px 8px; }    .padding_top_1rem { padding-top:1rem; }    .padding_bottom_1rem { padding-bottom:1rem; }
		.pointer, label, input										{ cursor:pointer; }			.cursor_default { cursor:default; }
		div:has(> input[disabled]), input[disabled], input[disabled] + label									{ cursor:not-allowed; }
		.position_absolute { position:absolute; }    .position_relative { position:relative; }    .position_fixed { position:fixed; }    .position_0 { top:0; right:0; bottom:0; left:0; }    .position_LR_0 { left:0; right:0; }
		.resize_none												{ resize:none; }
		.theme_dark .invert											{ filter:invert(1); }
		.transform_rotate_90,	.transform_rotate_90_contents > *	{ transform:rotate(90deg);  }		.transform_rotate_180, .transform_rotate_180_contents > *	{ transform:rotate(180deg); }
		.transform_rotate_270, .transform_rotate_270_contents > *	{ transform:rotate(270deg); }
		.user_select_none											{ -webkit-user-select:none; -moz-user-select:none; user-select:none; }
		.whitespace_pre												{ white-space:pre; }
		.width_10px, .width_10px_contents > * { width:10px; max-width:10px; min-width:10px; }    .width_12px, .width_12px_contents > * { width:12px; max-width:12px; min-width:12px; }
		.width_14px, .width_14px_contents > * { width:14px; max-width:14px; min-width:14px; }    .width_16px, .width_16px_contents > * { width:16px; max-width:16px; min-width:16px; }
		.width_18px, .width_18px_contents > * { width:18px; max-width:18px; min-width:18px; }    .width_24px, .width_24px_contents > * { width:24px; max-width:24px; min-width:24px; }
		.width_100							  { width:100% !important; }
		.z_index_1 { z-index:1; }    .z_index_2 { z-index:2; }    .z_index_3 { z-index:3; }    .z_index_9997 { z-index:9997; }    .z_index_9998 { z-index:9998; }    .z_index_9999 { z-index:9999; }

			/* NON-MEDIA ITEMS BACKGROUND */
		li.selected:not(.media), li:not(.media):not(.no_highlight):hover, li.hovered, li.content_loaded
																							{ background-color:var(--non_media_background) !important; }	/* all selected items, hovered non-dirlist items */
		li.grid_item:hover, li.grid_item.hovered											{ --non_media_item_background_a:0.40;  background-color:var(--non_media_background); }	/* hovered grid items */
		#sidebar_nav li:not(.media):hover													{ --non_media_item_background_a:0.5;  background-color:var(--non_media_background); }	/* hovered dirlist items */
		li.grid_item.selected																{ --non_media_item_background_a:0.75; background-color:var(--non_media_background); }	/* selected grid items */
		body.no_hover li.grid_item:is(:not(.selected):hover,.hovered), body.no_hover li.grid_item:is(:not(.selected):hover,.hovered) *		{ background-color:transparent !important; color:initial !important; }
		li.selected + li.selected:nth-of-type(even), li.dir.hovered + li.hovered:nth-of-type(even), li.file.hovered + li.hovered:nth-of-type(odd), .info_list li:nth-of-type(even)	{ --non_media_item_background_a:0.60; }		/* alternate highlight background with multiple selections, show stats*/
			/* MEDIA ITEMS BACKGROUND */
		li.media[class*="loaded"]															{ --media_item_background_a:0.9;		background-color:var(--media_background) !important; }		/* loaded audio, selected video */
		li.media.selected:not([class*="loaded"])											{ --media_item_background_a:0.7;		background-color:var(--media_background) !important; }		/* selected audio */
		li.media:hover																		{ --media_item_background_a:0.5;		background-color:var(--media_background) !important; }		/* hovered media */
			/* UNHIGHLIGHTED ITEMS: menu visible, .focus_content, .no_hover */
		body[class*="has_menu"] #sidebar_nav, body.focus_content #sidebar_nav				{ --non_media_item_background_s:0%; --media_item_background_s:0%; }
		body.theme_light[class*="has_menu"] #sidebar_nav, body.focus_content #sidebar_nav	{ --media_item_background_l:50%; --non_media_item_background_l:50%; }
		body.theme_dark[class*="has_menu"]	#sidebar_nav, body.focus_content #sidebar_nav	{ --media_item_background_l:40%; --non_media_item_background_l:30%; }
		body.no_hover #sidebar_menus li:not(.selected):not(.hovered):hover					{ background-color:inherit !important; color:unset !important; }
		body.no_hover #sidebar_nav li:nth-of-type(even):not(.selected):hover				{ background-color:hsl(0,0%,var(--percent_80)) !important; }
		body.no_hover #sidebar_nav li:nth-of-type(odd):not(.selected):hover					{ background-color:hsl(0,0%,var(--percent_85)) !important; }
		body.no_hover #sidebar_nav li:not(.selected):hover									{ color:unset !important; }
			/* TEXTEDITOR ITEMS*/
		body:is(.has_texteditor,.texteditor_edited) #show_texteditor li						{ background-color:var(--texteditor_item_background); }
		#show_texteditor li:hover															{ --texteditor_item_background_a:0.7; background-color:var(--texteditor_item_background) !important; }

			/* TEXT COLOR */
		li:where(.selected,:hover,.hovered),
		li:where(.hovered,:hover) li:is(.selected:hover,.selected),
		.content_loaded, .audio_loaded, body.has_texteditor #show_texteditor, body.texteditor_edited #show_texteditor,
		.no_hover .grid_item:is(.selected,:hover,.hovered), .no_hover .grid_item:is(.selected,:hover,.hovered) *, .grid_item:is(.selected,:hover,.hovered), .grid_item:is(.selected,:hover,.hovered) *, .grid_item.selected::before, .grid_item.selected::after
			{ color:white !important; }	/* white */

		.text_color_default,
		body.no_hover.theme_dark li.grid_item:is(:not(.selected):hover,.hovered), body.no_hover.theme_dark li.grid_item:is(:not(.selected):hover,.hovered) *,
		li:is(.selected,:hover,.hovered) li:not(.selected), body.no_hover #sidebar_menus li:is(.selected,:hoever,.hovered) li:not(.selected):hover,
		.no_highlight,
		.no_highlight:hover,
		.no_highlight > li:hover,
		:hover:not(#svg_container) > svg,
		.font_glyph_item::before,.font_glyph_item::after,#font_specimen_viewer::before,.has_font_specimen_glyph #font_specimen_viewer::after,#font_file_glyph_viewer::before,#font_file_glyph_viewer::after
			{ color:hsl(0,0%,var(--percent_10)) !important; }	/* default */

			/* FONT WEIGHT */
		li:is(.selected,:hover,.hovered) li, body.no_hover li:hover, li:not(.grid_item).no_hover:hover, body.no_hover #sidebar_menus li.hovered li:not(.selected):hover, li:is(.selected,:hover,.hovered) li:not(.selected), body.no_hover #sidebar_menus li:is(.selected,:hoever,.hovered) li:not(.selected):hover																					{ font-weight:normal !important; }
		.bold, li:not(.grid_item):hover,li.hovered,li.hovered li:is(:hover,.selected),li:not(.grid_item):not(.audio).selected,li.selected li:hover, li.media[class*="_loaded"], #show_image_grid:hover, #show_font_grid:hover,dt
																																										{ font-weight:bold !important; }
		#content_pane[data-content="has_ignored"]::before																												{ opacity:0.3; }
		.has_warning #sidebar, .has_warning #content_pane, .focus_content .dirlist_item, body:is(.has_menu,.has_menu_parents,.has_menu_stats,.has_menu_grid.has_images.has_fonts)  .dirlist_item:not(.hovered), body:is(.has_menu,.has_menu_parents,.has_menu_stats,.has_menu_grid.has_images.has_fonts)  #content_pane, #sidebar_menu_parent:not(:hover), #sidebar_menu_main_container:not(:hover) nav, #show_grid_btn, .split_btn span, .disabled:not(.local)																																					{ opacity:0.75; }
		body.has_menu_footer .dirlist_item.hovered, .disabled:not(.local).selected																						{ opacity:0.84; }
		#show_grid_btn:hover, #prev_next_btns span:hover, #sidebar_footer_utilities:hover, .split_btn span:hover														{ opacity:1.0; }
	`;
	const utilities_styles = `
		#utilities															{ top:0; justify-content:center; }
		#warnings_container													{ width:26em; flex-direction:column; border-radius:0 0 3px 3px; box-shadow:0px 2px 12px #333; font-size:0.875em; color:#111; display:none; }
		#warnings_header													{ padding:1rem 1.5rem; background-position:left 1.25rem center; background-repeat:no-repeat; background-size:24px; }
		#warnings_container:not(.warning_make_playlist) #warnings_header	{ background-image:${ get_SVG_UI_Icon("error") }; }
		#warnings_header h3													{ text-indent:2.25em; }
		#warnings_container:not(.warning_make_playlist) h3#warning_header, #warnings_container.warning_make_playlist h3#make_playlist_header, .warning_button.show, #warnings div.show, .has_warning #utilities, .has_warning #warnings_container, .has_help #utilities, .has_help #help_container, .warning_open_font #warnings #warning_open_font, .warning_unsaved_text #warnings #warning_unsaved_text, .warning_clear_text #warnings #warning_clear_text, .warning_local_file #warnings #warning_local_file, .warning_close_playlist #warnings #warning_close_playlist, .warning_local_playlist #warnings #warning_local_playlist, .warning_non_local_file #warnings #warning_non_local_file, .warning_close_font #warnings #warning_close_font		{ display:flex;}
		#warnings .warning													{ padding:0 1.5rem 1rem; display:none; }
		#warning_buttons_container											{ padding:1rem 1.5rem; }
		button.focus, button:focus											{ background-color:#0E4399; color:#EEE; outline:none; }
		.warning_button														{ min-width:4em; display:none; font-size:1em; justify-content:center; }
		#warning_btn_cancel + #warning_btn_save, #warning_btn_dont_save + #warning_btn_cancel, #warning_btn_clear		{ margin-right:auto; }
		#warning_btn_cancel, #warning_btn_clear, #warning_btn_save			{ margin-left:0.5rem; }
		#warnings_container.clear #warning_buttons							{ justify-content:space-between; }
		#warning_make_playlist fieldset div { padding:0 0 2px; }			#warning_make_playlist .indent { text-indent:2em; }					#warning_make_playlist input { margin-right:6px; }
		.has_warning::before, .has_overlay::before							{ content:""; position:fixed; top:0; right:0; bottom:0; left:0; z-index:9998;-webkit-user-select:none;-moz-user-select:none; user-select:none; }
		#help_container		{ padding:0 1em 1em; overflow:auto; flex-direction:column; }		#help_container > header { grid-template-columns:5em auto fit-content(100%); }
		#help_contents			{ margin: 1em -1em 0; padding:1em; }		#help_container dt		{ color:var(--media_background); }
		#help_container h2		{ color: var(--non_media_background); }		#help_container dd		{ margin-inline-start:1em; }				#help_container dd:before { content:"\u2219"; margin-right:6px; }
		#help_container dl + p	{ margin-top:1rem; padding-top:1rem; }		#help_container ol li { list-style:decimal; }
		#help_container kbd	{ min-width:1em; height:fit-content; padding:2px 6px; display:inline-block; border:solid 1px #888; border-radius:3px; text-align:center; font-family:inherit; font-size:0.875em; background-color:hsl(0,0%,var(--percent_90)); }								#help_main_menu svg { margin: 0 0 -2px; width:12px; }		#help_container svg.icon_arrow { height:14px; margin-bottom:-2px; }
		#help_bookmarks::before	{ background-image: ${ get_SVG_UI_Icon("bookmark") }; }
		.has_help #utilities, .has_help #help_container { bottom:0; }
	`;
	const sidebar_header_menu_styles = `
			/* PARENTS MENU */
		#parent_dir_nav #svg_chevron	{ width:18px; }					#parent_dir_nav #svg_multiply { width:14px; }
		#parent_dir_nav #svg_multiply, body:is(.has_playlist,.has_filelist) #svg_chevron, body:is(:not(.has_playlist),:not(.has_filelist)) #sidebar_header #close_playlist_container		{ display:none; }
		body.has_playlist #parent_dir_nav #svg_multiply, body.has_filelist #parent_dir_nav #svg_multiply, body:is(.has_playlist,.has_filelist) #sidebar_header #close_playlist_container	{ display:flex; }
		#current_dir_path												{ padding:3px 6px; word-break:break-word; }
			/* MAIN MENU */
		#sidebar_menu_main li											{ display:flex; }
		.has_menu #sidebar_menu_main, .has_menu_parents #parents_links, body:not(.no_hover) #sidebar_menus .has_submenu:hover .submenu, #sidebar_menu_main .has_submenu.hovered .submenu, #sidebar_menu_main li.has_submenu.selected .submenu										{ display:block; }
		#sidebar_menu_main li.has_submenu								{ position:relative; justify-content:space-between; }
		#sidebar_menu_main li.bookmark a::before						{ content:""; width:24px; max-width:24px; min-width:24px; height:12px; background-size:12px; }
		.submenu														{ width:100%; max-width:240px; display:none; margin:0; padding:0; box-sizing:border-box; position:absolute; left:100%; }
		#sidebar_menu_main ul.submenu li a								{ padding:6px 8px 6px 0; }
		#sidebar_menu_main input										{ width:0; float:left; }
		.menu_item														{ margin:0; padding:5px 8px 5px 0; display:flex; flex-grow:1; text-align:left; }
		#sidebar_menu_main .selected ~ li:hover .submenu, #sidebar_menu_main .selected ~ li .submenu:hover, .has_open, #sidebar_menu_main .show_input span.menu_item, .text_editing_enable_false:not(.has_texteditor) #sidebar_menu_main li#texteditor_split_view, .text_editing_enable_false:not(.has_texteditor) #toggle_texteditor_html_menu		{ display:none; }
		#sidebar_menu_main .show_input input							{ display:unset; margin:2px 6px; width:100%; }
			/* menu right arrow */
		#sidebar_menu_main svg		{ margin: 0 6px; width:12px; }
		#sidebar_menu_main li:is(.selected,.hovered:not(:hover),:hover) svg { filter:invert(1); }	body.no_hover:not(.theme_dark) #sidebar_menu_main li:not(.selected):not(.hovered):hover svg  { filter:invert(0); }
		#ui_scale span.menu_item::after { content:attr(data-value); }		#ui_scale_input_container, #ui_scale.show_input span + span	{ display:flex; }		#ui_scale_input_container { padding-left:18px; padding-right:8px; }
			/* IFRAME MENUS */
		#parent 			{ padding:5px 3px 5px 0; }					#parent span { padding:0px 1px; }
		#open_in_sidebar	{ padding:5px 2px 5px 3px; }
	`;
	const sidebar_header_styles = `	/* for both sidebar and content_iframe */
		#sidebar { font-variant-numeric:tabular-nums; }    #sidebar.top_body { min-width:200px; }     #sidebar.iframe { min-width:500px; flex-basis:100%; }
		#sidebar_header_title_div																	{ letter-spacing:0.5em; text-indent:0.75em; flex-basis:100%; }
		#sidebar_header_title_div:before { content:"INDEX OF"; }    .has_playlist #sidebar_header_title_div:before { content:"PLAYLIST"; }    .has_filelist #sidebar_header_title_div:before { content:"FILELIST"; }
		${ sidebar_header_menu_styles }
			/* SIDEBAR BUTTONS */
		#directory_buttons_left																	{ padding:6px; }
		#show_details																			{ margin-top:0; margin-right:8px; padding:0 4px; }
		#show::before																			{ content:"Show "; }
			/* GRID BTN ---> combine style with save_btn */
		#show_grid_btn																			{ margin:0 0 0 auto; }
		#show_grid_btn ul																		{ padding-left:0px; top:-1px; right:-1px; }
		#show_grid_btn ul:after																	{ content:""; position:absolute; z-index:-1; top:0; bottom:0; left:0; right:0; background-color:hsl(0,0%,var(--percent_80)); }
		#show_grid_btn ul:not(:has(li:hover)):hover												{ background-color:var(--non_media_background); }
		#show_grid_btn ul:not(:has(li:hover)):hover svg											{ color:white !important; }
		#show_grid_btn.has_grid div																{ color:#118888; }
		#top_body:is(.has_images,.has_fonts) #show_grid_btn										{ display:flex; }
		#top_body.has_images.has_fonts #show_grid_btn:hover ul									{ display:grid; }
			/* SORTING ITEMS */
		#sidebar_header_utilities_row_2 .sorting												{ grid-row:1; }
		body:not(.show_details_false) #sorting_row_2											{ display:grid; }
		#sorting_row_1 span, #sorting_row_2 span, .sorting span::before, .sorting span::after	{ display:inline-block; }
		#sorting_row_1 span, #sorting_row_2 span												{ padding:6px 0; }
		#sorting_row_1.iframe span, #sorting_row_2.iframe span									{ padding:4px 0; }
		#sidebar_header_utilities_row_2 span::before, #sidebar_header_utilities_row_2 span::after, .sorting .menu_item::after					{ content:""; width:16px; height:8px; color:#CCC; background-position:center; background-repeat:no-repeat; background-size:10px; }
		.sorting.down span::after, .sort_direction_descending .sorting span::after				{ transform:rotate(0deg) !important; }
		#sort_by_name input																		{ margin:-2px 6px -2px 0; bottom:-2px; }
		#sort_by_ext																			{ grid-column: span 2; }
		.has_media #sort_by_ext																	{ grid-column: span 1; }
		.has_media #sort_by_default																{ text-align:center; }
		#sort_by_default.iframe, .iframe #sort_by_size, .iframe #sort_by_date					{ text-align:right; }
		.has_media #sort_by_duration, .has_playlist #sort_by_duration, #content_body.has_media #sorting_row_2 #sort_by_duration	{ display:unset; }
		#content_body #sorting_row_1 #sort_by_duration, #top_body #sorting_row_2 #sort_by_duration								{ display:none; }
			/* TEXT EDITOR ITEM */
		body:not(.show_details_false) #show_texteditor, body.has_texteditor #show_texteditor	{ display:flex; }
		#show_texteditor a																		{ padding-left:10px; }
	`;
	const sidebar_nav_styles = `	/* for both sidebar and content dirlists */
		#sidebar_nav																			{ overflow-y:hidden; flex-basis:100%; margin-bottom:-1px; }
		#dir_nav_inner																			{ overflow:auto; }
		#sidebar_nav ol																			{ -webkit-margin-before:0em !important; -webkit-margin-after:0em !important; -webkit-padding-start:0em; }
		#directory_list																			{ counter-reset:item; transition:opacity .125s; }
		#directory_list:empty																	{ border-bottom:0; padding:100%; }
		.dirlist_item_input,     .dirlist_item_details,     .dirlist_item_details span,     .dirlist_item_media_duration,     .details.ext,     .dirlist_item.error::before,    .dirlist_item_name_a::before,
		body.show_invisibles_false:not(.has_menu_stats) .dirlist_item.invisible.ignored,	body.show_invisibles_false:not(.show_ignored_false):not(.has_menu_stats) .dirlist_item.invisible:not(.ignored),
		body.show_invisibles_false.show_ignored_items_false:not(.has_menu_stats) .dirlist_item.ignored,		body.show_invisibles_false.show_ignored_items_false:not(.has_menu_stats) .dirlist_item.invisible,
		body.show_ignored_items_false:not(.show_invisibles_false):not(.has_menu_stats) .dirlist_item.ignored:not(.invisible)														{ display:none; }
		.dirlist_item													{ margin-inline-start:0; display:grid; grid-gap:0; }
		.top_item														{ grid-template-columns:minmax(8rem,auto) minmax(6em,1fr) minmax(auto,6em); }
							.dirlist_item_name							{ grid-row:1; display:flex; -webkit-padding-start:0; -moz-padding-start:0; word-break:break-word; }
		.top_item			.dirlist_item_name							{ grid-column:1 / span 3; padding:6px 12px 6px 0; }
							.dirlist_item_name::before					{ counter-increment:item; content:counter(item); min-width:36px; height:14px; max-height:14px; min-height:14px; text-align:right; padding:0 3px 0 0; text-indent:6px; }
							.dirlist_item_input							{ margin:1px 6px 0 0; max-height:13px; }
							.dirlist_item .desc.dirlist_item_details					{ padding:0 6px 4px 40px; grid-column:1 / span 3; text-align:left; white-space:unset; }
		.has_icon_before::before, .has_icon_before_before, .has_icon_after::after		{ content:""; display:inline-block; background-position:center; background-repeat:no-repeat; background-size:14px,0px; }
		.has_icon_before::before, .has_icon_before_before, .show_large_image_thumbnails_false .dirlist_item.image .has_icon_before_before, .show_image_thumbnails_false .dirlist_item.image .has_icon_before_before, .has_icon_after:not([data-after])::after						{ width:14px; height:14px; max-width:20px; max-height:14px; min-width:14px; min-height:14px; margin:0 6px; }
		.dirlist_item.image .has_icon_before_before				{ width:56px; height:56px; max-width:56px; max-height:56px; min-width:56px; min-height:56px; margin:0 6px; background-position:top; background-size:contain,0px; }
		.ignored:not(.selected) .has_icon_before::before, .ignored:not(.selected) .has_icon_before_before, .focus_content .has_icon_before_before, .has_quicklook #sidebar	{ filter:grayscale(100%); }
		.focus_content li:is(.selected,.hovered,:hover) .has_icon_before_before																								{ filter:grayscale(0%); }
			/* MEDIA ITEMS */
		.top_item.media	.dirlist_item_name								{ grid-column:1 / span 2; padding-right:0; }
		.top_item.media		.dirlist_item_media_duration				{ grid-column:3; padding:6px 12px 6px 0; }
		.dirlist_item.media	.dirlist_item_media_duration				{ grid-row:1; }
		.iframe_item.media	.dirlist_item_media_duration				{ grid-column:2; }
		.media:not(.local)	.dirlist_item_media_duration				{ display:unset; }
		.dirlist_item.media	.dirlist_item_media_duration:not([data-duration="NaN"]):empty
																		{ background-image:${ get_SVG_UI_Icon('spinner') } !important; background-position:top 3px right 10px; background-repeat:no-repeat; background-size:20px; }
		.dirlist_item_media_duration[data-duration="NaN"]::after		{ content:"[Error]"; }
			/* SORTING BORDERS */
		.sort_by_default:not(.show_invisibles_false) .dir.invisible + .dir:not(.invisible), .sort_by_default:not(.show_invisibles_false) .dir:not(.invisible) + .dir.invisible	{border-top:solid 1px hsl(0,0%,var(--border_lum));}
			/* ITEM DETAILS */
							.dirlist_item_details						{ text-align:right; white-space:nowrap; }
		.top_item			.dirlist_item_details						{ padding:0 12px 4px 0; }
							.dirlist_item_details.size					{ padding-left:12px; }
							.dirlist_item_details.date					{ overflow:hidden; height:calc(1em - 2px); }
							.dirlist_item_details.kind::first-letter	{ text-transform:uppercase; }
		#content_body .iframe_item										{ grid-template-columns: minmax(20em,100%) minmax(4em,6em) minmax(6em,8em) minmax(6em,14em) minmax(6em,8em); }
		#content_body .iframe_item.non_media .dirlist_item_name			{ grid-column:1 / span 2; }
		#content_body .iframe_item .dirlist_item_details				{ grid-row:1; overflow:hidden; height:calc(1em - 2px); }
		#content_body .iframe_item .desc.dirlist_item_details			{ grid-row:2; grid-column:1 / span 6; height:auto; padding:0 6px 4px 40px; }
		#content_body .iframe_item .dirlist_item_name_a, #content_body .iframe_item > span		{ padding:5px 16px 5px 0; }

		body:not(.show_numbers_false) .dirlist_item_name_a::before						{ display:initial; }
		body:not(.show_details_false) .dirlist_item_details, .media .dirlist_item_input	{ display:unset; }
		.disabled, .ignore_ignored_items li.ignored, .has_filelist [id$="sort_by_size"], .has_playlist [id$="sort_by_size"], .has_filelist [id$="sort_by_date"], .has_playlist [id$="sort_by_date"]
																		{ cursor:not-allowed; opacity:0.75; }
		.dirlist_item.error												{ display:block; padding:6px 8px; }
		.dirlist_item.ignored.local .dirlist_item_name_a::after			{ content:"\\00a0[local file]"; display:contents; font-style:italic; }
		.is_error #is_error												{ display:block !important; grid:none !important; grid-template-columns:none !important; }
		.is_error #is_error_items										{ display:block; }

	`;
	const iframe_dir_styles = `${ global_styles }
		#content_body																{ overflow-x:auto; font-size:${ (parseFloat(UI_Prefs_Non_Bool.ui_font_size) * 0.875) + UI_Prefs_Non_Bool.ui_font_size.replace(/\d*/,'') }; }
		.theme_dark .sorting span::before, .theme_dark .sorting span::after			{ filter:invert(1); }
		#content_body:not(.show_details_false) #show::before						{ content:"Hide "; }
		#content_body.show_details_false .iframe_item								{ grid-template-columns:auto; }
		#content_body.show_details_false .media .dirlist_item_media_duration, #content_body #content_pane, #content_body .content_el,
			#content_body.has_quicklook div[id^="title_buttons"],									#content_body.has_quicklook #content_pane.has_audio :is(#content_title_container,#content_container),
			#content_body.has_quicklook #content_pane[data-content="has_ignored"] #content_iframe,	#content_body.has_quicklook #content_pane[data-content="has_pdf"] #content_pdf	{ display:none; }
		#content_body.has_quicklook #sidebar_nav		{ opacity:0.6; }
		#content_body.has_quicklook #content_pane		{ display:flex; padding:2em; position:absolute; z-index:1; left:0; right:0; top:0; bottom:0; justify-content:center; }
		#content_body.has_quicklook #content_header		{ background-color:hsl(0,0%,var(--percent_85)); border-radius: 3px 3px 0 0; border:solid 1px hsl(0,0%,var(--border_lum)); border-bottom:0; }
		#content_body.has_quicklook #content_container								{ padding:6px; background-color:hsl(0,0%,var(--percent_85)); box-shadow:0 0 12px #000; border-radius: 0 0 3px 3px; border:solid 1px hsl(0,0%,var(--border_lum)); border-top:0; contain:unset; flex-basis:unset; }
		#content_body.has_quicklook .content_el																								{ width:100%; }
		#content_body.has_quicklook .content_el.has_content																					{ border:solid 1px hsl(0,0%,var(--border_lum)); box-sizing:border-box; }
		#content_body.has_quicklook .content_el.has_content, #content_body.has_quicklook .content_el:has(.has_content), #content_body.has_quicklook #content_pane.has_audio #content_audio_container
																																			{ display:flex; z-index:1; }
		#content_body.has_quicklook #content_pane.has_audio #content_header				{ margin:auto; }		#content_body.has_quicklook #content_pane.has_audio #audio_wrapper	{ padding:0 6px; }
		#content_body.has_quicklook #content_pane.has_audio #content_audio_container	{ padding:0; }			#content_body.has_quicklook #content_pane.has_audio #audio_options	{ display:none; }																																	
		#content_body.has_quicklook #content_container:has(#content_font.has_content, #content_pdf.has_content,#content_iframe.has_content),#content_body.has_quicklook #content_pane[data-content="has_ignored"] #content_container																															{ height:50%; flex-basis:unset; }
		#content_body.has_quicklook #content_container:has(#content_image.has_content)														{ display:table; flex-basis:unset; }
		#content_body.has_quicklook #content_video.has_content																				{ position:static; }
		#content_body.has_quicklook #content_pane:not([data-content="has_ignored"]) #content_font.has_content								{ display:grid; }
		#content_body.has_quicklook #content_pane[class*="has_font_specimen"] #font_specimen_viewer											{ display:flex; }
		#content_body.has_quicklook #content_image_container, #content_body.has_quicklook #content_iframe									{ max-height:88vh; }
		#content_header, #content_body.has_quicklook #content_image_container, #content_body.has_quicklook #content_container:has(#content_video.has_content)	{ padding:0; z-index:11; }
		#content_pane[data-content="has_pdf"] #content_container					{ background-image:${ get_SVG_UI_File_Icon('file_icon_ignored') }; background-size:28px; }
	`;
	const sidebar_footer_styles = `	/* for both sidebar and content_iframe */
		.has_menu_stats #stats_summary, .stats_kind span.file, .stats_kind span.media, .has_menu_stats #sidebar_footer_utilities			{ display:none; }
		#stats_container										{ max-height:33vh; }
		.theme_light #sidebar_footer_utilities:hover ul, .theme_light #sidebar_footer:hover, .theme_light #stats_details_summary			{ box-shadow:0px -4px 4px 0px rgba(128,128,128,0.6); }
		.theme_dark #sidebar_footer_utilities:hover ul,  .theme_dark #sidebar_footer:hover,  .theme_dark #stats_details_summary				{ box-shadow:0px -4px 4px 0px rgba(32,32,32,0.6); }
		#stats_details_summary_dirs  .stats_kind::before		{ background-image:${ get_SVG_UI_File_Icon("file_icon_dir") }; }
		#stats_details_summary_files .stats_kind::before		{ background-image:${ get_SVG_UI_File_Icon("file_icon_file_default") }; }
		#stats_details_summary, #stats_details_items_container	{ overflow-y:scroll; }
		#stats_summary_totals, .has_media #total_duration		{ display:flex; text-align:left; white-space:normal; padding-right:1em; }
		#stats a												{ padding:3px 12px 3px 0; }
		#stats a::before										{ content:attr(data-count); width:36px; text-align:right; }
		.stats_kind span										{ margin-right:0.5em; white-space:pre; display:flex; }
		.stats_kind > span::first-letter						{ text-transform:uppercase; }
		#stats_details_items li.audio a span span::after		{ content:attr(data-audio_duration); white-space:pre; }
		#stats_details_items li.video a span span::after		{ content:attr(data-video_duration); white-space:pre; }
		#total_duration::after									{ content:attr(data-time_remaining); white-space:pre; }
		.has_media #total_duration::before						{ content:"Total Time:\\00a0"; }
		.stats_list_item_name_a									{ -webkit-padding-start:0; padding:1px 0; }		.stats_list_item span::first-letter { text-transform:uppercase; }
		#stats_summary, #stats_details_summary					{ margin-block-start:0; margin-block-end:0; }
		#stats a.dirlist_item_name_a:before						{ display:inline-block; }
		#stats_details_items									{ max-height:25vh; }
		#stats_container, .has_menu_stats #stats_details_summary, .has_menu_stats #stats_details_items		{ display:block; }
		#sidebar_footer_utilities								{ right:-1px; }																			#sidebar_footer_utilities svg		{ margin:2px 2px 0 0; opacity:0.75; }
		#sidebar_footer_utilities ul							{ bottom:0; right:-1px; white-space:nowrap; box-shadow:-0px -3px 6px -3px #333; }		#sidebar_footer_utilities:hover ul	{ display:block; }
	`;
	const sidebar_utilities_styles = `
		#show_sidebar { top:0; right:0; height:21px; opacity:0.75; }					#show_sidebar:hover { opacity:1; }
		body.show_sidebar_false #handle { display:none; }								body.show_sidebar_false #show_sidebar { left:2px; transform:rotate(180deg); }
		body.show_sidebar_false #sidebar { width:0 !important; min-width:0; position:absolute; top:2px; left:-1px; }
		body.show_sidebar_false #sidebar_header, body.show_sidebar_false #sidebar_footer { z-index:unset; display:none; }		body.show_sidebar_false #sidebar_nav { visibility:hidden; }
		body.show_sidebar_false #directory_list_outer { min-width:0; }					body.show_sidebar_false #content_pane { width:100% !important; }
		body.show_sidebar_false #title_buttons_left { padding-left:24px; }				#handle { top:0; bottom:0; right:-4px; width:7px; cursor:col-resize; }
		.has_overlay #handle { z-index:9999; }
	`;
	const sidebar_styles = `${ sidebar_header_styles }     ${ sidebar_nav_styles }     ${ sidebar_footer_styles }     ${ sidebar_utilities_styles }`;
	/* CONTENT PANE STYLES */
	const content_pane_header_styles = `
			/***** CONTENT TITLE *****/
		#content_title_container																											{ overflow-x:scroll; }
		#content_title		{ min-width:16em; min-height:18px; padding:4px 8px; word-break:break-word; }	#content_title *:empty			{ display:none; }
		#content_title span	{ pointer-events:none; }														#content_title span::before, #content_title span::after { font-weight:normal; margin-bottom:-3px; }
		#content_pane.has_font_specimen																		#content_title div::before		{ content:"Font"; }
		#content_pane.has_font_file #content_title div::before,		#content_pane.has_font_file_glyph	#content_title div::before			{ content:"Glyphs from font"; }
		.has_directory_source																				#content_title div::before		{ content:"Source of" !important; }
		.has_directory_source											#content_title span::before	{ background-image:${ get_SVG_UI_File_Icon("file_icon_dir_default") }; height:14px !important; background-size:contain; }
		#content_pane[data-content="has_grid"]																#content_title div::before		{ content:"Fonts and Images from"; }
		#content_pane[data-content="has_grid"].has_font_grid												#content_title div::before		{ content:"Fonts from"; }
		#content_pane[data-content="has_grid"].has_image_grid												#content_title div::before		{ content:"Images from"; }
		#content_pane[data-content="has_ignored"]															#content_title div::before		{ content:"Ignored content"; }
		#content_pane[data-content="has_dir"]																#content_title div::before		{ content:"Index of"; }
		body.has_texteditor.texteditor_view_raw.texteditor_split_view_false									#content_title div::after		{ content:" (Source Text)"; }
		body.has_texteditor.texteditor_view_styled.texteditor_split_view_false								#content_title div::after		{ content:" (Text Preview)"; }
		body.has_texteditor.texteditor_view_html.texteditor_split_view_false								#content_title div::after		{ content:" (HTML Preview)"; }
		body.has_texteditor																					#content_title div::before		{ content:"Text Editor" !important ; font-weight:bold; }
		body.texteditor_edited.has_texteditor																#content_title div::before		{ content:"Text Editor (edited)" !important; font-weight:bold; }
		body.has_texteditor																					#content_title span				{ display:none; }
		body.has_texteditor																					#content_title span::before		{ background-image:${ get_SVG_UI_File_Icon("file_icon_markdown") }; }
		#content_pane:is([data-content="has_htm"]) #content_title span::after	{ display:none; }
		body:not(.text_editing_enable_false):not(.has_quicklook) #content_pane:is([data-content="has_text"],[data-content="has_code"],[data-content="has_markdown"]) #content_title span::after
																								{ background-image:url("data:image/svg+xml;utf8,${ SVG_UI_File_Icons.file_icon_ebook}"); pointer-events:all; opacity:0.66; }
		body.text_editing_enable_false #content_pane:is([data-content="has_text"],[data-content="has_code"],[data-content="has_markdown"]) #content_title span::after
																								{ background-image:url("data:image/svg+xml;utf8,${ SVG_Text_Editing_UI_Icons.text_editing }"); pointer-events:all; opacity:0.66; }
		#content_pane:is([data-content="has_text"],[data-content="has_code"],[data-content="has_markdown"]) #content_title:hover span::after { opacity:1 !important; }
		body.theme_dark	#content_pane:not([data-content="has_image"]):not([data-content="has_grid"])		#content_title span::after		{ filter:invert(1) !important; }
		#content_pane[data-loaded="unloaded"]																#content_title					{ display:flex; justify-content:center; align-items:center; }
		#content_pane[data-loaded="unloaded"]																#content_title div::before		{ content:"Loading..." }
		#content_pane[data-loaded="unloaded"]																#content_title span				{ display:none; }
		#content_pane[data-content="has_grid"]																#content_title span::before		{ background-image:${ get_SVG_UI_File_Icon("file_icon_dir") }; height:14px !important;}
		#content_pane[data-content="has_grid"]																#content_title span::after		{ content:attr(data-grid_item_count); font-weight:normal; white-space:pre; margin:0; }
		#content_pane[data-content="has_image"]																#content_title span::after		{ content:attr(data-after); font-weight:normal; white-space:pre; margin:0; }
		#content_pane.content_error #content_title span::before, #content_pane.content_error #content_container, #content_pane.has_audio_error #content_audio_title span::before {background-image:${ get_SVG_UI_Icon("error")}; }
		body.is_error:not(.has_directory_source) #content_title span::before, #content_pane.content_error #content_title div::before	{ content:"ERROR:"; white-space:pre; display:inline; }
			/* CONTENT TITLE BUTTONS LEFT */
		#reload_btn { width:52px; }				#reload_btn::before { content:"Reload"; }
		#prev_next_btns { margin-left:4px; }    #prev_next_btns span { width:2em; height:16px; }    #prev_next_btns span:active { background-color:#0E4399; }    #prev_next_btns:focus { background-color:white; }
		#prev_next_btns svg { width:12px; }
			/* CONTENT TITLE BUTTONS RIGHT */
		#scale { margin-right:4px; background-color:#FFF; }    #scale span { width:2em; }
		#close_btn { width:52px; }    #close_btn::before { content:"Close"; }    body.has_texteditor #close_btn::before { content:"Hide"; }    #content_pane[data-content="has_null"] #close_btn { display:none !important; }
		.split_btn::after			{ content:""; position:absolute; top:0; bottom:0; left:calc(50% - 1px); border-left:solid 1px #333; }      .split_btn span { display:inline-flex; }
		#open_in_texteditor					{ margin-right:4px; }
	`;
	const content_pane_audio_styles = `
			/* CONTENT AUDIO TITLE */
		#content_audio_title span									{ padding:4px 6px 0; }
		#content_audio_title span::before							{ content:""; padding-right:22px; height:14px !important; font-weight:normal; background-image:${ get_SVG_UI_File_Icon("file_icon_audio") }; background-position:center; background-position:right 4px center; background-repeat:no-repeat; }
		#content_pane.has_audio #content_audio_title span::before, #content_pane[data-content="has_video"] #content_title div::before	{ content:"Playing:"; }
		#content_pane.has_audio.has_audio_error #content_audio_title span::before														{ content:"ERROR:"; }
		#content_pane.has_audio.has_audio_error #content_audio_container		{ padding-top:0; }
		#content_pane.has_audio.has_audio_error #audio_container	{ display:none; }
			/* CONTENT AUDIO PLAYER */
		#content_audio_container									{ justify-content:center; padding:2px 6px 6px; overflow-x:auto; flex-wrap:wrap; display:flex; }
		#audio_container											{ margin:0 100%; height:32px; background-color:rgb(241, 243, 244); }
		#prev_track, #next_track									{ width:2rem; }
		#content_audio												{ height:32px; }
		audio::-webkit-media-controls-enclosure						{ border-radius:0; }
		#close_audio												{ width:32px; }
		#audio_options												{ margin-top:0; margin-right:calc(-6em - 8px); padding:0 4px; width:6em; justify-content:start; }
		#loop_label input											{ margin:0px 4px 2px; }
		#shuffle_label input										{ margin:2px 4px 0px; }							#shuffle_label::after	{ content:attr(data-shufflecount); }
			/* CUE SHEET MENU */
		#content_pane.has_audio .cuesheet_track .icon.has_icon_before_before { background-image:${ get_SVG_UI_File_Icon("file_icon_audio") }; }
		#content_pane.has_video .cuesheet_track .icon.has_icon_before_before { background-image:${ get_SVG_UI_File_Icon("file_icon_video") }; }
		.cuesheet_track_list_container								{ background-image:${get_SVG_UI_File_Icon("file_icon_playlist")}; background-repeat:no-repeat; background-size:18px; background-color:inherit; display:none; }
		.cuesheet_track_list_container:hover > div, .cuesheet_track_list_container.has_menu > div					{ display:flex; flex-direction:column; margin-top:-1px; overflow:hidden; max-height:100%; }
		.cuesheet_track_list_container:hover .cuesheet_track_list, .cuesheet_track_list_container.has_menu, .cuesheet_track_list, #content_grid a	{ display:block; }
		#cuesheet_track_list_container_audio						{ width:32px; background-position:center; }		
		#cuesheet_track_list_container_video						{ width:24px; background-position:top left; }
		#cuesheet_track_list_container_audio > div					{ padding-top:13px; }							#cuesheet_track_list_container_video > div { padding-top:10px; }
		.cuesheet_track_list										{ overflow:scroll; }
		.cuesheet_track												{ justify-content:space-between; grid-template-columns: 2rem 20px minmax(6rem,1fr) minmax(6em,1fr) minmax(auto,6em) minmax(auto,6em); }
		.cuesheet_track.selected .cue_track_id::before				{ content:""; width:16px; height:8px; display:flex; }
		.cuesheet_track span										{ padding:4px 0 4px 8px; font-variant-numeric:tabular-nums; }
		.cue_index, .cue_position									{ text-align:right; }
		#cuesheet_title												{ padding:4px 8px; font-variant-numeric:tabular-nums; text-align:center; }
		.track_title_container::after								{ content:attr(data-track_title); padding-top:4px; text-align:center; color:hsl(0,0%,var(--percent_10)); }
			/* CONTENT TITLE PLAYLIST ENTRY (#content_playlist_item and #content_audio_playlist_item) */
		.playlist_entry_container									{ flex-direction:row; }
		.playlist_entry_container textarea							{ resize:vertical; background-color:transparent; }
		.theme_light .playlist_entry_container:has(textarea:focus)	{ box-shadow:inset 0px 0px 2px 2px var(--non_media_item_background); }
		.theme_dark .playlist_entry_container:has(textarea:focus)	{ box-shadow:inset 0px 0px 4px 1px hsl(0,0%,var(--percent_95)); }
		#content_pane.has_audio #audio_wrapper, .playlist_entry_container.has_content	{ display:flex; flex-direction:column; }
		audio::-webkit-media-controls-panel							{ padding:0; }
		.audio_player_on_top_false #audio_wrapper					{ position:absolute; left:0; right:0; bottom:0; border-top:solid 1px hsl(0,0%,var(--border_lum)); }
	`;
	const content_pane_styles = `${ content_pane_header_styles } ${ content_pane_audio_styles }
		#content_pane												{ transform:scale(1); contain:strict; }
		#content_container				{ align-items:center; justify-content:center; bottom:0; background-position:center; background-repeat:no-repeat; background-size:33.33%; contain:strict; flex-basis:100%; overflow:auto; }
		.content_el													{ width:100%; height:100%; margin:0; padding:0; overflow:auto; display:none; z-index:11; }
		#content_pane[data-loaded="unloaded"] .content_el:not(#content_audio_container)				{ display:none !important; }
		#content_pane[data-loaded="unloaded"]:not([data-content="has_ignored"]) #loading_spinner	{ display:block; }
			/* CONTENT DISPLAY */
		#content_pane:not([data-content="has_ignored"]) #content_font.has_content, #content_pane[data-content="has_image"] #content_image_container, body:not(.has_texteditor) #content_pane[data-content="has_grid"] #content_grid
																	{ display:grid; }
		#content_pane[data-content="has_grid"] .split_btn, #content_pane[data-content="has_image"] .split_btn, #content_pane[data-content="has_font"] .split_btn, #content_body:not(.text_editing_enable_false) #content_pane[data-content="has_htm"] #open_in_texteditor, #content_pane:not([data-content="has_ignored"]) .content_el:not(#content_font).has_content, body.has_texteditor #content_texteditor, #content_pane[class*="has_font_specimen"] #font_specimen_viewer, .has_font_specimen_glyph #font_specimen_glyph_viewer, #content_pane[class*="has_font_file"] #font_file_viewer, .has_font_file_glyph #font_file_glyph_viewer
																	{ display:flex; }
			/* CONTENT GRID (div) */
		#content_grid		{ font-size:1rem; grid-gap:0; grid-template-columns:repeat(auto-fill, minmax(${ ( UI_Prefs_Non_Bool.grid_image_size + 16) }px, auto)); grid-auto-rows:minmax(min-content, max-content); counter-reset:count; }
		#content_pane.has_hidden_grid #content_grid					{ max-height:100%; overflow:hidden; position:absolute; display:grid; margin-left:-100%; }
		.grid_item							{ counter-increment:count; position:relative; }
		.image_grid_item::before, .font_grid_item_info:before			{ content:counter(count,decimal); color:hsl(0,0%,var(--percent_20));  font-size: var(--font_size_smaller); margin-right:6px; display:inline-block; background-color:hsl(0,0%,var(--percent_80)); z-index:10; }
		.image_grid_item::before			{ padding:8px 4px; }								.font_grid_item_info:before			{ padding:4px; }
		.theme_dark .image_grid_item::before, .theme_dark .font_grid_item_info:before { color:hsl(0,0%,var(--percent_20)); }
		.image_grid_item::before			{ position:absolute; top:6px; left:6px; }
			/* FONT & IMAGE GRID ITEMS */
		.image_grid_item					{ padding:6px; grid-column:auto; line-height:0; }
		.image_grid_item img				{ width:auto; max-width:${ (UI_Prefs_Non_Bool.grid_image_size).toString() }px; max-height:${ (UI_Prefs_Non_Bool.grid_image_size) }px; position:relative; opacity:0.9; }
		.image_grid_item img[src$=".svg"]	{ width:100%; height:100%; }
		.image_grid_item.selected    { box-shadow:inset 0px 0px 4px hsl(0,0%,var(--percent_60)); }    .font_grid_item.selected p { font-weight:bold; }    .font_grid_item.selected a { font-weight:unset; }
		.image_grid_item.selected img, .font_grid_item.selected, .image_grid_item:hover, .font_grid_item:hover { opacity:1; }
		.font_grid		{ font-size:4em !important; margin:0 0 20px; grid-gap:0; grid-template-columns:repeat(auto-fit, minmax(max(60px,1.33em), 1.5fr)); grid-auto-rows:minmax(max(60px,1.33em), max-content); line-height:unset !important; letter-spacing:unset !important; }
		.font_grid_item						{ line-height:1; padding:8px 20px; grid-column:1 / -1; opacity:0.9; }
		.font_grid_item_info				{ padding:0 0 6px 0; letter-spacing:0.1em; text-indent:0.1em; }
		.font_grid_item h2					{ font-size:${ UI_Prefs_Non_Bool.grid_font_size * 4 }em; font-weight:normal; }
		.image_grid_item + .font_grid_item	{ margin-top:-1px; border-top:solid 1px hsl(0,0%,var(--border_lum_inverted)); }
			/* CONTENT FONT.content */
		#content_font						{ font-size:${ UI_Prefs_Non_Bool.grid_font_size }em; overflow-wrap:break-word; align-content:start; flex-direction:column; }
		#content_pane.has_font_specimen #content_container, .has_font_specimen_glyph #content_container, .has_font_specimen_glyph #font_specimen, .has_font_file_glyph #content_container	{ overflow:hidden; }
		#content_pane[data-content*="has_font"] #font_toolbar		{ display:grid; overflow-x:scroll; overflow-y:hidden; }
		#content_pane.has_font_specimen #font_specimen_variants		{ display:flex; }			#content_pane.has_font_specimen #font_specimen_adjustments li.display_none { display:unset; }
		#content_pane.has_font_file_glyph	#content_font	{ background-color:hsl(0,0%,var(--percent_100)); }
		#font_toolbar li					{ margin:2px; padding:0 4px; white-space:pre; }
		#font_toolbar li.text				{ width:50%; font-size:var(--font_size_small); }
		#font_variant_select				{ width:13em; }
		#unicode_char_ranges_select			{ width:12em; }
		#font_specimen_adjustments			{ font-size:0.75rem; padding-bottom:2px; }
		#font_specimen_adjustments input	{ width:8em; }
		#font_specimen_viewer				{ min-width:100%; flex-direction:column; }
		#font_specimen_viewer .specimen		{ padding:20px; outline:none; color:inherit; font-weight:normal; }
		#font_specimen_viewer .specimen:focus,    #font_specimen_viewer .specimen:focus-visible	{ box-shadow:inset 0 0 2px 2px hsl(212deg 50% 60%); border-radius:3px; outline:none !important; }
		.specimen:focus, specimen:focus-visible													{ background-color: hsl(0,0%,var(--percent_100)); }
		#font_specimen_grid:empty,    #font_specimen_glyph:empty,    #font_specimen_grid:empty + hr	{ display:none; }
		.font_glyph_item					{ grid-column:auto; display:flex; justify-content:center; position:relative; cursor:pointer; -webkit-text-stroke:inherit !important; letter-spacing:initial; line-height:initial; }
		.font_glyph_item div				{ color:inherit; }
		.font_glyph_item::before,    .font_glyph_item::after,    #font_specimen_viewer::before,    #font_specimen_viewer::after							{ display:inline-block; position:absolute; font-size:0.75rem; top:0; font-family:${UI_Prefs_Non_Bool.ui_font}; opacity:0.75; font-feature-settings:normal; font-variant:normal; line-height:1.2; letter-spacing:normal; -webkit-text-stroke:0 !important; }
		.font_glyph_item::before,    #font_specimen_viewer::before																						{ content:attr(data-unicode_dec); left:2px; }
		.font_glyph_item::after,     #font_specimen_viewer::after																						{ content:attr(data-unicode_hex); right:2px; }
		.has_font_specimen_glyph #font_specimen_viewer::before,    .has_font_specimen_glyph #font_specimen_viewer::after,    .has_font_file_glyph #font_file_glyph_viewer::before,    .has_font_file_glyph #font_file_glyph_viewer::after				{ display:inline-block; padding:4px 6px; font-size:0.875rem; position:fixed; white-space:pre; opacity:1; z-index:2; }
		#font_specimen_1 { font-size:4em;}		#specimen_2 { font-size:8em; }		#specimen_3 { font-size:6em; }		#specimen_2H4 { font-size:1.618em; }		#specimen_3H3 { font-size:2em; }
		.lorem								{ font-size:1em; column-gap:1.5em; overflow-wrap:normal; }
		#lorem::first-line					{ letter-spacing:0.1em; text-indent:0.1em; font-size:${ UI_Prefs_Non_Bool.grid_font_size * 1.33 }em; font-variant:small-caps; }
		#lorem_2							{ padding:12px 0 0; columns:2; }
		#lorem_3							{ padding:12px 0 0; columns:3; }
					/* FONT GLYPHS */
		#font_specimen_viewer, #font_file_viewer				{ line-height:1.5; background-color:inherit; }
		.glyph_container:hover, .glyph_container.selected		{ z-index:1; }
		#font_specimen_glyph, #font_specimen_glyph:not(:empty) + #font_specimen_glyph_overlay				{ display:flex; justify-content:center; font-size:64vw; overflow:visible; }
		#font_file_viewer										{ font-family:unset; flex-direction:column; }
		#content_pane.has_font_file_glyph #font_file_grid		{ visibility:hidden; }
		#content_pane.has_font_file_glyph #font_file_viewer		{ overflow:hidden; }
		#font_file_grid											{ margin-bottom:21px; }
		.font_glyph_item svg									{ width:1em; height:1em; display:block; overflow:visible; }
		.font_glyph_item g, #font_file_glyph_viewer svg g		{ transform-origin:center; }
		#font_file_glyph_viewer									{ background-color:#FFF; }
		#font_file_glyph_viewer::before, #font_file_glyph_viewer::after		{ position:absolute; color:hsl(0,0%,var(--percent_65)); }
		#font_file_glyph_viewer::before							{ content:attr(data-unicode_dec); }
		#font_file_glyph_viewer::after							{ content:attr(data-unicode_hex); right:0; }
		.has_font_file_glyph #save_svg							{ display:initial; margin-right:4px; }
		#font_info												{ max-height:${ (window.innerHeight * 0.75) }px; left:-1px; right:0; bottom:-1px; overflow-y:auto; }
		#font_info:hover										{ box-shadow:0px 4px 6px 3px #333; }
			/* OTHER CONTENT ELEMENTS */
		#content_image_container								{ padding:2rem 2.5rem; box-sizing:border-box; }
		.has_zoom_image #content_image_container, .has_scaled_image #content_image_container { padding:0; }
		#content_image											{ margin:auto; width:auto; max-width:100%; height:auto; max-height:100%; object-fit:contain; cursor:zoom-in; }
		#content_image:focus-visible							{ outline:none; }
		#content_pane.has_zoom_image #content_image				{ width:fit-content; height:fit-content; max-width:unset; max-height:unset; cursor:zoom-out; }
		#content_pane[data-content="has_video"] #content_video_container		{ display:flex;  flex-direction:column;  justify-content:center;  flex-grow:1;  align-items:center;  align-self:stretch; text-align:center; }
		#content_video											{ background:transparent; height:auto; max-width:calc(100% - 4em); max-height:calc(100% - 4em); }
		#content_pane[data-content="has_htm"] #content_iframe	{ background:rgba(255,255,255,0); }
		#content_pane.has_emptycontent #content_iframe			{ background:unset; }
		.theme_dark:not(.iframe_theme_false) #content_pane[data-content="has_htm"] #content_iframe, .theme_dark:not(.iframe_theme_false) #content_pane[data-content="has_pdf"] #content_pdf	{ filter:invert(1) hue-rotate(180deg) saturate(2); }
	`;
	const conditional_styles = `
			/* PSEUDO-ELEMENTS */
		#reload_btn.reset::before, #content_pane:is(.has_font_specimen,.has_font_specimen_glyph,.has_font_file,.has_font_file_glyph,.has_zoom_image,.has_scaled_image) #reload_btn::before			{ content:"Reset"; }
		.texteditor_edited #show_texteditor span:after, .iframe_edited:not(.has_texteditor) #content_pane.has_iframe #content_title div::after														{ content:" (edited)"; }
		.theme_light #menu_theme span::before														{ content:"Light "; }
		.theme_dark #menu_theme span::before														{ content:"Dark "; }
		body:not(.show_details_false) #show::before													{ content:"Hide "; }
		body.text_editing_enable_false #disable::after												{ content:"Disabled"; }
		#disable::after																				{ content:"Enabled"; }
		.is_error #sidebar_header_utilities															{ border-bottom:0; }
		#is_error																					{ display:block !important; grid:none !important; grid-template-columns:none !important; }
		.theme_dark #is_error_items, .theme_dark #sidebar_menu_main li > span::before, .theme_dark #sidebar_header_utilities_row_2 span::before, .theme_dark #sidebar_header_utilities_row_2 span::after, .theme_light #sidebar_menu_main li.selected > span::before	{ filter:invert(1); }
			/* CONDITIONAL DISPLAY */
		body:not(.alternate_background_false).is_error #alternate_background, .is_error #sidebar_header_utilities > div:not(:first-of-type), .is_non_local #show_invisibles_container					{ display:none; }
		.has_media #play_toggle, .theme_dark #theme_dark, .theme_light #theme_light, #content_pane[class^="has_"] #close_btn, #content_pane[data-content="has_texteditor"] #close_btn				{ display:unset; }
		.has_playlist #stats_summary_playlist_files, .has_filelist #stats_summary_playlist_files																									{ display:table-row; }
		#sidebar_footer li, .has_warning #overlay_container, .cuesheet_track_list_container.has_cue_sheet, .has_playlist #close_playlist_container, .has_filelist #close_playlist_container																		{ display:block; }
		.has_menu_stats .dirlist_item.invisible, .has_menu_stats .dirlist_item.ignored, .has_menu_stats .dirlist_item.ignored.hovered, body:not(.show_ignored_items_false).has_menu_stats .dirlist_item.ignored, body:not(.show_ignored_items) .dirlist_item.ignored:not(.invisible)																																	{ display:grid; }
		#content_pane[data-content="has_texteditor"] .content_el.has_content, #content_pane[data-content="has_texteditor"] #content_grid, body:not(.has_texteditor) #content_pane[data-content="has_grid"] #content_texteditor, #content_pane[data-content="has_grid"] .content_el.has_content																																		{ display:none !important; }
	`;
	const texteditor_styles = `
		html, body, #content_body							{ margin:0; padding:0; height:100%; overflow:hidden; position:relative; font-family:${ UI_Prefs_Non_Bool.ui_font }; font-size:${ UI_Prefs_Non_Bool.ui_font_size }; }
		button.focus, button:focus							{ outline:none; border-radius:3px !important; border-style:solid !important; border-width:1px !important; border-color:#222 !important; }
		.is_texteditor #content_texteditor, body.is_text #content_texteditor					{ display:flex; }
			/* TOOLBAR */
		#texteditor_toolbar									{ overflow:visible; z-index:100; font-size:${ parseFloat(UI_Prefs_Non_Bool.ui_font_size) * 0.875 + UI_Prefs_Non_Bool.ui_font_size.replace(/\d*/,'') }; }
		.toolbar_icon										{ margin:0 4px; padding:4px; min-width:16px; height:16px; cursor:pointer; opacity:0.5; }
		#texteditor_sync_scroll								{ opacity:1; height:24px; padding:0 8px; flex-grow:unset; }
		#texteditor_sync_scroll input						{ margin:0 4px 0 0; z-index:-1; }
		#save_btn ul										{ top:-3px; right:-4px; }
		#save_html, #save_text								{ grid-column:1; }
		#save_btn_icon										{ grid-column:2; grid-row:span 2; width:32px; }
		#save_btn_icon svg									{ margin:3px; }
		.texteditor_edited #save_btn svg					{ color:red !important; }
		#texteditor_toolbar li:hover, .texteditor_view_raw #toggle_texteditor_view_raw, body:not(.texteditor_split_view_false) #toggle_texteditor_view_raw, body:not(.texteditor_split_view_false):not(.texteditor_view_html) #toggle_texteditor_view_styled, .texteditor_view_styled #toggle_texteditor_view_styled, .texteditor_view_html #toggle_texteditor_view_html, body:not(.texteditor_split_view_false) #toggle_texteditor_split_view							{ opacity:1; }
			/* TEXT CONTENT CONTAINERS */
		.texteditor_pane																{ padding:1em; overflow-y:scroll; box-sizing:border-box; background:transparent; font-size:${ parseFloat(UI_Prefs_Non_Bool.ui_font_size) + UI_Prefs_Non_Bool.ui_font_size.replace(/\d*/,'') }; }
		body:not(.text_editing_enable_false) .texteditor_pane, body:not(.texteditor_split_view_false) .texteditor_pane		{ width:50%; }
		body:is(.text_editing_enable_false,.texteditor_split_view_false) .texteditor_pane									{ width:100% !important; }
		#text_container .texteditor_pane:focus											{ background-color:hsl(0,0%,var(--percent_90)); outline:none; box-shadow:inset 0px 0px 4px hsl(0,0%,var(--percent_95)); }
		#text_container textarea														{ font-family:monospace; }
			/* EDITOR PANES */
		.texteditor_split_view_false.texteditor_view_raw		#texteditor_raw_pane,					.texteditor_split_view_false.texteditor_view_styled						#texteditor_styled_pane,
		.texteditor_split_view_false.texteditor_view_html		#texteditor_html_pane,					.texteditor_split_view_false.texteditor_view_html.texteditor_view_raw	#texteditor_raw_pane,
		.texteditor_split_view_false.texteditor_view_styled.texteditor_view_raw #texteditor_raw_pane,
		.texteditor_split_view_true								#texteditor_raw_pane,					.texteditor_split_view_true:not(.texteditor_view_styled):not(.texteditor_view_html) #texteditor_styled_pane,
		.texteditor_split_view_true.texteditor_view_styled		#texteditor_styled_pane,				.texteditor_split_view_true.texteditor_view_html		#texteditor_html_pane,
		.text_editing_enable_true								#reading_btn_icon,						.text_editing_enable_false:not(.texteditor_view_styled)	#texteditor_raw_pane,
		.text_editing_enable_false.texteditor_view_raw			#texteditor_raw_pane,					.text_editing_enable_false.texteditor_view_styled		#texteditor_styled_pane
																						{ display:block !important; }
		.text_editing_enable_false:not(.has_texteditor)	:is(#text_editing_handle,#texteditor_toolbar,#save_btn,#texteditor_sync_scroll,#toggle_texteditor_html_menu,#texteditor_html_pane),
		.texteditor_split_view_false						:is(#texteditor_sync_scroll,#text_editing_handle),	.texteditor_split_view_false.texteditor_view_raw	:is(#texteditor_styled_pane,#texteditor_html_pane),
		.texteditor_split_view_false.texteditor_view_styled :is(#texteditor_raw_pane,#texteditor_html_pane),	.texteditor_split_view_false.texteditor_view_html	:is(#texteditor_raw_pane,#texteditor_styled_pane),
		.texteditor_split_view_true.texteditor_view_styled	#texteditor_html_pane,								.texteditor_split_view_true.texteditor_view_html	#texteditor_styled_pane
																						{ display:none !important; }
			/* THEMES & COLORS */
		.texteditor_theme_default #content_texteditor .background_grey_95, .background_grey_90:focus, #texteditor_styled_pane table th				{ background-color:hsl(0,0%,var(--percent_95)); }
		.theme_dark.texteditor_theme_light #content_texteditor .text_color_default, .theme_light.texteditor_theme_default #content_texteditor .text_color_default	{ color:hsl(0,0%,var(--percent_05)); }
		.theme_dark #content_texteditor .text_color_default, .texteditor_theme_dark #content_texteditor .text_color_default											{ color:#EEE; }
			/* custom previewed text styles */
		#texteditor_styled_pane															{ word-break:break-word; }
		#texteditor_styled_pane pre														{ font-size:${ parseFloat(UI_Prefs_Non_Bool.ui_font_size) + UI_Prefs_Non_Bool.ui_font_size.replace(/\d*/,'') }; border:solid 1px #CCC; border-radius:3px; white-space:pre-wrap; word-break:break-word; }
		#texteditor_styled_pane th, #texteditor_styled_pane td							{ vertical-align:top; }
		#texteditor_styled_pane blockquote												{ margin-top:1em; margin-bottom:1em; color:#555; }
		#texteditor_styled_pane blockquote + blockquote									{ margin-top:0; }
		#texteditor_styled_pane img														{ max-width:100%; height:auto; }
		.markdown_body input[type="checkbox"]											{ margin-top:0.375em; margin-right:6px; float:left; }
		h1 .uplink,h2 .uplink,h3 .uplink,h4 .uplink,h5 .uplink,h6 .uplink				{ display:inline-block; font-size:0.875em; transition:opacity 0.25s; opacity:0; cursor:pointer; margin:0; padding:0; }
		h1:hover .uplink,h2:hover .uplink,h3:hover .uplink,h4:hover .uplink,h5:hover .uplink,h6:hover .uplink		{ transition:opacity 0.25s; opacity:0.5; }
		#texteditor_styled_pane table													{ font-size:inherit; }
		.markdown_body table tr, .markdown_body .highlight pre, .markdown_body pre		{ background-color:transparent !important; }
		.markdown_body::before, .markdown_body::after									{ display:none !important; background:transparent; }
		#content_body.has_warning::after												{ content:""; position:absolute; top:0; right:0; bottom:0; left:0; background:rgba(0,0,0,0.33); z-index:9998; }
		#text_editing_handle															{ width:8px; top:0; bottom:0; left:calc(50% - 4px); cursor:col-resize; }
		#text_editing_handle::before													{ content:""; width:1px; background:hsl(0,0%,var(--border_lum)); position:absolute; top:0; bottom:0; left:calc(50%); }
		.texteditor_theme_dark #text_editing_handle::before, .theme_dark.texteditor_theme_default #text_editing_handle::before					{ background:#111; }
		.is_link #texteditor_styled_pane a	{ font-size:0.875rem; }						.is_link #texteditor_styled_pane a:hover	{ font-weight:bold; }
	`;
	// Gecko (Firefos) Styles:
	const gecko_style_rules = `
		.dir::before																	{ content:"" !important; display:none !important; }
		.is_gecko button																{ padding:revert; }
		.is_gecko #show_grid_btn .menu													{ top:-7px; left:-120px; }
		.is_gecko thead																	{ font-size:100%; }
		.is_gecko .dirlist_item.dir::before												{ position:absolute; }
		.is_gecko .dirlist_item_name span												{ display:-webkit-box; width:auto; white-space:normal; }
		.dirlist_item.dir td:not(:first-child), .dirlist_item.file td:not(:first-child)	{ width:unset !important; }
		.is_gecko .dirlist_item td														{ min-width:calc(100% - 24px); }
		.is_gecko .dir::before															{ content:"" !important; display:none !important; }
		.is_gecko.use_default_icons:not(.is_converted_list) .dirlist_item.file .icon	{ padding-left:4px; background:none; }
		.is_gecko.use_default_icons .dirlist_item.file .icon img						{ margin-right:6px; height:14px; }
		.is_gecko #directory_list > tr > td:not(:first-of-type)							{ float:left }
		.is_gecko #content_audio_title span												{ padding-top:6px;, padding-bottom:0; }
		.is_gecko #content_audio,.is_gecko #audio_container								{ background-color:rgba(26,26,26,1); }
		.is_gecko #prev_track, .is_gecko #next_track, .is_gecko #close_audio			{ filter:invert(1); border:none !important; }
		.is_gecko #content_pane.has_zoom_image #content_image_container					{ display:block !important; }
	`;
	const safari_style_rules = `
		.is_safari button { background-color:#FFF; }
		.is_safari.theme_dark #prev_track, .is_safari.theme_dark #next_track, .is_safari.theme_dark #close_audio	{ filter:invert(1); }
	`;
	const chrome_style_rules = `video::-webkit-media-controls-enclosure					{ border-radius:0 !important; }`;
	const html_style_rules = `a:focus, a:focus-visible { font-weight:bold; border-radius:1px; outline:currentcolor solid 1px; outline-offset:1px; display:inline-block; padding:0 2px; text-decoration:none; }`
	//==============================//
	function addStyles(user_agent) {																										// ===> ADD STYLES
		let default_styles = `<style id="main_styles">${ global_styles } ${ sidebar_styles } ${ content_pane_styles } ${ utilities_styles }</style>     <style id="conditional_styles">${ conditional_styles }</style>     <style id="font_styles"></style>     <style id="font_grid_styles"></style>`;
		switch(user_agent) {
			case user_agent === 'is_gecko':		default_styles += `<style id="gecko_style_rules">${ gecko_style_rules }</style>`;	break;
			case user_agent === 'is_safari':	default_styles += `<style id="safari_style_rules">${ safari_style_rules }</style>`;	break;
			case user_agent === 'is_chrome':	default_styles += `<style id="chrome_style_rules">${ chrome_style_rules }</style>`;	break;
		}
		return default_styles																														// return styles
	}
	// ***** END STYLES ***** //
	//==============================//
	// ***** INDEX PREP ***** //
	// Try to determine index type from parent directory link container, with fallbacks for indexes that don't have parent directories, or for parent directory links that aren't siblings or ancestors of the index itself.
	function getIndexType() {																											// ===> GET INDEX TYPE
		let index_el = getEls('body > ul, body ul, body > pre, body > table:last-of-type, body div table');
		if ( index_el.length > 1 ) { index_el = ( Array.from(index_el).filter( el => el?.nodeName?.toLowerCase() === 'table') || index_el.reverse()[0] ) } // some index pages have pre and table elements; list is usually table
		index_el = index_el[0];
		let node_name = ( index_el !== undefined ? index_el.nodeName.toLowerCase() : 'body' );														// "body" is likely to be an error page
		let types = {'gecko':'gecko','ul':'list','pre':'pre','table':'table','th':'table','td':'table','div':'default','error':'error','body':'error','permission_denied':'permission_denied'}; // object array of types
		return types[node_name];																													// return index type
	}
	function getIndexItems(agent) { let type = getIndexType(agent), items;																			// ===> GET INDEX ITEMS // get index type, define items
		switch(type) {
			case 'error':								items = document.getElementsByTagName('html')[0].outerHTML;							break;	// error type
			case 'pre':									items = getEl('body > pre').innerHTML;												break;	// pre type
			case 'list':								items = getEls('body > ul li, body > * > ul li');									break;	// list type
			case 'table': case 'td':																												// table types
				switch(true) {
					case elExists('table > tbody'):		items = getEls('body table > tbody tr');											break;	// ordinary tables
					case !elExists('table > tbody'):	items = getEls('body table tr');													break;	// tables without tbody element
				}
				break;
			case 'gecko':								items = getEls('body > table > tbody > tr');										break;	// gecko type
			case 'default':								items = getEls('body > table > tbody tr');											break;	// default: how is this different from table type?
		}
		return [items,type];																														// return index items and index type
	}
	//==============================//
	function prepPreType(items_str) {																										// ===> PREP PRE TYPE
		let prepped_index = [], parser = new DOMParser(), items_HTML = parser.parseFromString(items_str, "text/html");								// convert items_str to DOM html
		items_HTML.querySelectorAll('hr,img').forEach( el => el.remove() );																			// remove junk elements
		items_HTML.querySelectorAll('a').forEach(																									// remove junk links (sorting and parent links) or define item_link
			el => { if ( /^\?|^\./m.test(el.getAttribute('href')) || /^Parent$|^Parent Directory$|^\s*Up\s*$|^\s*Root\s*$/im.test(el.innerText) ) { el.remove(); } }
		);
		items_str = items_HTML.querySelector('body').innerHTML;																					// convert DOM html back to str
		// remove header elements | link text nodes | links with empty text nodes (which are sometimes duplicated) | name, last modified, size, description)
		items_str = items_str.replace(/\&lt;dir\&gt;/gm,'  ').replace(/<br>/gi,'\n').replace(/[ ]*<h\d>[^<]*<\/h\d>[ ]*/gmi,'').replace(/[ ]*(<a[^>]+?>)[^<]*(<\/a>)/g,'$1$2  ').replace(/(\w)<a /g,'$1  <a '); // clean string
		const items = items_str.split('\n');																										// create array of item strings from items
		for ( let i = items.length; i--; ) {
			let prepped_item = [], link;
			let cells = items[i].split(/\s{2,}/);
			for ( let j = cells.length; j--; ) {
				let cell = cells[j];
				if ( cell.trim().length > 0 && cell.trim() !== '-' ) {
					if ( !cell.startsWith('<a ') ) { prepped_item.push(cell); } else { link = cell.split('"')[1]; }								// extract link
				}
			}
			if ( link === undefined || ( /^\.\.$|^\.\.\/$|^\/$|^\?|\?sort=|\?path=\&/mi.test(link) ) ) { prepped_item = []; } else {  prepped_item.unshift(link); } // exclude some items (e.g., parent directory links)
			if ( prepped_item.length > 0 ) { prepped_index.push(prepped_item); }																	// add prepped item to index
		}
		return prepped_index;																														// return prepped index
	}
	function prepListType(items) {																											// ===> PREP LIST TYPE
		let prepped_index = [];
		for ( let i = items.length; i--; ) {
			let item = items[i];
			if ( item.innerHTML.indexOf('Parent Directory') === -1 ) {
				let prepped_item = [], link = item.querySelector('a')?.href;
				item.querySelector('a')?.remove();		Array.from(item.children).forEach( child => { if ( child.innerText === '' ) { child.remove(); } })		// remove link and empty child elements
				let cells = item.innerHTML.split(' ');																											//	create array from remaining elements
				for ( let cell of cells ) { prepped_item.push(cell); }
				if ( link === undefined || ( /^\.\.$|^\.\.\/$|^\/$|^\?|\?sort=|\?path=\&/mi.test(link) ) ) { prepped_item = []; } else {  prepped_item.unshift(link); } // exclude some items (e.g., parent directory links)
				if ( prepped_item.length > 0 ) { prepped_index.push(prepped_item); }
			}
		}
		return prepped_index;																														// return prepped index
	}
	function prepGeckoType(items) {																											// ===> PREP GECKO TYPE
		let prepped_index = [];
		for ( let item of items ) {
			let prepped_item = [], cellContents = '', cells = item.cells, link = item.innerHTML.split('href=\"')[1].split('\">')[0];
			for ( let cell of cells ) {
				cellContents = cell.innerText;
				cellContents = ( cellContents !== undefined ? cellContents.trim() : '');
				prepped_item.push(cellContents);
			}
			prepped_item[1] = prepped_item[1].replace(/\s*KB/,'000');																				// convert reported size in KB to total bytes
			prepped_item[2] = prepped_item[2] + ' '+ prepped_item[3];
			prepped_item = prepped_item.slice(1,-1);
			if ( link === undefined || ( /^\.\.$|^\.\.\/$|^\/$|^\?|\?sort=|\?path=\&/mi.test(link) ) ) { prepped_item = []; } else {  prepped_item.unshift(link); } // exclude some items (e.g., parent directory links)
			if ( prepped_item.length > 0 ) { prepped_index.push(prepped_item); }
		}
		return prepped_index;																														// return prepped index
	}
	function prepTableType(items) { //*** for local chrome indexes and server-generated table-type indexes								// ===> PREP TABLE TYPE
		// const testString = new RegExp(/alt=\"\[PARENTDIR\]|>\s*\&nbsp;\s*<|^\s*\&nbsp;\s*$|^\s*-\s*$|\?sort=|\?path=\&/,'mi');
		let prepped_index = [], prepped_item, item, cell, cell_text;
		for ( item of items ) {
			if ( item.querySelector('td a') !== null ) { let link; prepped_item = [];															// get legitimate items (i.e., those containing a link)
				for ( cell of item.cells ) {																									// get text from remaining cells (date & size)
					switch(true) {
						case cell.querySelector('a') !== null && link === undefined: link = item.querySelector('a')?.getAttribute('href');		// get link; add to prepped_item; ignore if link already defined
							if ( !/^\?|^\.\.\/$|^\|\"\/\".$/m.test(link) && !/^\s*parent directory\*$|^\*up\s*$/m.test(item.innerText.toLowerCase()) ) { prepped_item.unshift(link); }// else { prepped_item.unshift(''); }
							break;
						default:
							cell_text = cell.innerText.trim().replace(/(^[ ]*-[ ]*$|[ ]*-[ ]*\&nbsp;[ ]*$)|\&nbsp;/m,'');						// prep cells and clean cell text
							if ( !/<td\s*[^>]*>dir|directory|file<\/td>|>\w*\s*file<|>\w*\s*unknown</i.test(cell.outerHTML.toLowerCase()) && cell_text !== '' ) { prepped_item.push( cell_text ); }	// exclude various cells
					}
				}
				if ( prepped_item.length >= 1 && prepped_item[0] !== '' ) { prepped_index.push(prepped_item); }										// prepped_item.length > 2 in order to omit parent directory item
			}
		}
		return prepped_index;																														// return prepped index
	}
	function prepErrorType(items) { return items; }																							// ===> PREP ERROR TYPE; receives and returns html string
	function prepPlaylist(items) {																											// ===> PREP PLAYLIST items
		let prepped_index = []; let prepped_item, link, duration, name, info; let items_arr, type;
			items = items.replace(/\s*#EXTM3U.*\s*/g,'').replace(/^\*\n{2,}/gm,'\n').replace(/\.pdf\?.+?\n/g,'.pdf\n');//.replace(/\?/g,'%3F');		// remove header comment and multiple returns
		switch(true) {																																// determine playlist type;
			case ( /#EXTINF:/i.test(items) ):	type = 'extm3u';	items_arr = items.split('#EXTINF:');									break;	// rows made by splitting at "#EXTIMG:" prefix
			default:							type = 'm3u';		items_arr = items.split('\n');											break;	// rows are just naked links
		}
		items_arr.forEach( (item) => {
			switch(true) { // get entry information: title, link, etc.
				case type === 'extm3u':	item = item.trim().split('\n'); link = item[1]; info = item[0].split(','); duration = info.shift(); name = info.join(',');
					if ( item[1] !== undefined ) { prepped_item = [link,duration,'',name]; }	break;
				case type === 'm3u':	prepped_item = [item,'',''];																		break;	// m3u with urls only
			}
			if ( prepped_item !== undefined ) { prepped_index.push(prepped_item); }
		});
		return prepped_index;																														// return prepped index
	}
	function convertIndexItems(items,type) { let converted = [];																					// ===> CONVERT INDEX ITEMS by type; returns [prepped_index]
		switch(type) {
			case 'gecko':	converted = prepGeckoType(items);		break;
			case 'list':	converted = prepListType(items);		break;
			case 'pre':		converted = prepPreType(items);			break;
			case 'table':
			case 'default': converted = prepTableType(items,type);	break;
			case 'error':	converted = prepErrorType(items);		break;
		}
		return converted;
	}
	//==============================//
	function buildNewIndex(id,prepped_index,sort,type,body_id) {																				// ===> BUILD NEW INDEX from prepped rows
		let i, new_index_items = [], body_classes = new Set();
		let index_html = '';
		let new_item, item, item_info = [], item_link, item_name, item_sort_name, item_size_and_date, item_size, item_sort_size, item_date, item_sort_date, item_ext, item_description, item_sort_kind, item_classes;
		let name_span, cell_link, cell_name, cell_size, cell_date, cell_kind, cell_ext, cell_time, prepped_index_length = prepped_index.length, item_disabled, item_input;
		let stats, stats_classes = [], stats_kinds = [], stats_total_size = 0, media_count = 0;
		let dir_list_parent_class = ( (body_id === ( null || 'top_body') || type === 'playlist') ? 'top_item' : 'iframe_item' ), is_playlist = (type === 'playlist' ? type +'_' : '');	// id used to set dir list details style
		let parent_id = ( getCurrentUIPref('parent_id') || '' ), connector = ( getCurrentUIPref('parent_id') ? '_' : '' ), level = ( Number(getCurrentUIPref('level')) || 0 ), level_style = ( level === 0 ? '' : `style="padding-left:${ Number(level) * 22 }px;"` );																								// ensure unique ids (with parent_id) and set indents for subdirectory items
		if ( prepped_index_length > 5000 ) { if ( confirm(`This directory contains ${prepped_index_length} items; it may take a long time to process and could cause your browser to crash. Are you sure you want to open it?`) === false ) { return } }
		switch(type) {																																// add body classes according to index type
			case 'error':				body_classes.add('is_error');			break;
			case 'pre':					body_classes.add('is_converted_pre');	break;
			case 'list':				body_classes.add('is_converted_list');	break;
			case 'table': case 'td':	body_classes.add('is_converted_table');	break;
			case 'default':				body_classes.add('is_default');			break;
		}
		// create and format directory item
		for ( i = 0; i < prepped_index_length; i++ ) {
			item				= prepped_index[i];
			item_info			= getLinkInfo(item[0]);																							// returns [link,name,ext,kind,item_classes,body_classes];
			item_link			= item_info[0];
			item_name			= item_info[1] || item[3];																							// prep display name, with word breaks added after unbreakable chars
			item_sort_name		= item_name.toLocaleLowerCase(navigator.language);
			item_size_and_date	= getItemSizeAndDate(item);
			item_size			= item_size_and_date[0];
			item_sort_size		= item_size_and_date[1];
			item_date			= item_size_and_date[2];
			item_sort_date		= item_size_and_date[3];
			item_ext			= item_info[2];
			item_sort_kind		= item_info[3];
			item_classes		= item_info[4] +" "+ dir_list_parent_class;
			item_disabled		= ( /local/.test(item_classes) ? ' disabled="disabled"' : '' );														// disable media if local file on non_local page or vice versa
			item_input			= ( /audio|video/.test(item_sort_kind) && /top/.test(body_id) || type === 'playlist' ? `<input class="dirlist_item_input" type="checkbox" tabindex="-1" checked="true" ${item_disabled} autocomplete="off" />` : '' );
			// Assemble item elements
			name_span			= `<span class="icon has_icon_before_before"></span><span class="name_span display_flex">${ item_input }<span>${ item_name }</span></span>`;
			cell_link			= `<a href="${ item_link }" class="icon dirlist_item_name name dirlist_item_name_a position_relative">${ name_span }</a>`;
			cell_name			= `${ cell_link }`;
			cell_time			= `<span class="dirlist_item_media_duration align_right" data-duration=""></span>`;
			cell_size			= `<span class="dirlist_item_details size details" data-size="${ item_sort_size }">${ item_size }</span>`;
			cell_date			= `<span class="dirlist_item_details date details overflow_hidden" data-date="${ item_sort_date }">${ item_date }</span>`;
			cell_kind			= `<span class="dirlist_item_details kind details" data-kind="${ item_sort_kind }">${ item_sort_kind }</span>`;
			cell_ext			= `<span class="ext details" data-ext="${ item_ext }"></span>`;
			item_description	= ( item[3] !== undefined ? `<span class="desc dirlist_item_details"><i>Description</i>: ${ item[3] } </span>` : '' );	// some servers provide a description of the item
			// Assemble item
			new_item			= `<li id="${ parent_id }${ connector }${ is_playlist }rowid-${ (prepped_index.length - i) }" class="dirlist_item ${ item_classes }" data-title="${ item_name }" data-name="${ item_sort_name.split("/")[0] }" data-kind="${ item_sort_kind }" data-ext="${ item_ext }" data-level="${ level }" ${ level_style }>${ cell_name } ${ cell_time } ${ cell_size } ${ cell_date } ${ cell_kind } ${ cell_ext } ${ item_description }</li>\n`;
			if ( /audio|video/.test(item_sort_kind) ) {	media_count += 1;																				// if media item...
				let media_kind = item_sort_kind, media_item_id = parent_id + connector + is_playlist + 'rowid-'+ ( prepped_index.length - i), is_subdir = ( /subdirectory/.test(window.location.search) ? true : false );
																																						// get media duration, not in utility subdir (limit to 1000 calls):
				if ( media_count < 1000 && is_subdir !== true ) { getMediaDuration( item_link, media_kind, media_item_id, is_subdir ); } else { new_item = new_item.replace(/data-duration="">/,'data-duration="NaN">'); } 
			}
			new_index_items.push(new_item);																												// add item to index items
			body_classes.add(item_info[5].join(' '));																									// add item classes to body_classes
			stats_kinds.push(item_sort_kind);  stats_total_size += Number(item_sort_size);  stats_classes.push(item_info[6]);							// STATS: add item kind; update total size; add to stats classes
		}
		body_classes = [...body_classes].filter(body_class => body_class).sort();																		// BODY CLASSES: body_classes to array, filter empty items, sort
		stats = buildStats(stats_classes,stats_kinds,stats_total_size);																					// STATS: build stats
		if ( sort === '' || sort === undefined ) { sort = getCurrentUIPref('sort_by'); }																// SORT ITEMS: get sort_by pref
		let sort_direction = getCurrentUIPref('sort_direction');																						// get sort_direction pref
		let sorted_index_items = sortDirListItems(new_index_items, 'sort_by_'+ sort, sort_direction);													// make initial sort
		return [sorted_index_items, body_classes.join(' '),stats,index_html];																			// RETURN [sorted_index_items, body_classes, stats, index_html]
	}
	//==============================//
	function getLinkInfo(link) {																										// ===> GET LINK INFO; returns [link,name,ext,kind,item_classes,body_classes,link_protocol]
		switch(true) {
			case link === undefined:																											return;	// return if link undefined
			case link === null:																		link = getEl('#content_iframe').src;	break;	// link from opening local link files links in iframe
			case link.startsWith('file://') && window.location.protocol === 'file:':					link = link.split('file://')[1];		break;	// local links
			case link.startsWith('/') && window.location.protocol === 'file:':							link = 'file://'+ link;				break;	// local links
			case !link.startsWith('/') && !link.endsWith('/') && !/\./.test(link):						link = '/'+ link +'';					break;
		}
		link = link.replace(/%3C/g,'\&lt;').replace(/\.pdf\..+/,'.pdf');																				// fix and sanitize links
//		if ( /\.php\?(\w+)=/.test(link) )		{ link = link.split('\.php')[1]; }																		// attempt to deal with some php links
		let URL = newURL(decodeURIComponentSafe(encodeURIComponent(link)));
		let prepped_link, display_name, kind, ext, item_classes = [], body_classes = [], stats_classes = [], aliases = new RegExp(/(symlink|alias|symbolic link)$/,'m'), link_protocol = URL.protocol;
		switch(true) {																																	// prep link
			case window_protocol !== 'file:':																											// for non-local pages
				switch(true) {
					case URL.protocol === 'file:': case URL.protocol === undefined: prepped_link = link; item_classes.push('local','ignored');	break;	// local links from non-local pages
					default: prepped_link = URL.href;																									// non-local pages
				}																																break;
			case window_protocol === 'file:':																											// for non-local pages
				switch(true) {
					case URL.protocol !== 'file:': prepped_link = URL.href; item_classes.push('non_local');										break;
					default: prepped_link = URL.pathname;
				}
		}
		switch(true) {																																	// prepare display name, body_classes, and item_classes
			case ( /youtube.com|youtu.be/.test(link) && !link.indexOf('/.') ):
				prepped_link = link.replace(/watch%3F/,'watch?');	kind = 'video'; item_classes.push('video','media'); display_name = undefined;	break;	// youtube videos from playlists
			case URL.pathname.endsWith('/'):	case ( /\.php\?/.test(link) ):																				// nobreak; dirs, apps and index.php? links
				display_name = ( URL.pathname.endsWith('/') ? URL.pathname.split('/').reverse()[1] + '/' : /\.php\?/.test(link) ? link : null );
				switch(true) {
					case ( /\.app$|\.app\/$|\.exe$/m.test(display_name) ):		ext = 'app';	kind = ext;												// apps
						if ( UI_Prefs_Bool.apps_as_dirs === false ) { item_classes.sort().unshift('file','app'); } else { item_classes.sort().unshift('dir','app'); }		break;
					default:													ext = 'dir';	kind = 'dir';	item_classes.unshift(kind);				// dirs; remove kind from item_classes
				}
				item_classes.push('non_media');																											// add "non_media" to item_classes
				if ( display_name.startsWith('.') ) { item_classes.push('invisible'); stats_classes.push('invisible'); }						break;
			default:																																	// files
				display_name = prepped_link.trim().split('/?')[0].split('/').reverse()[0];
				switch(true) {
					case display_name.toLowerCase().endsWith('symlink'):		ext = 'symlink';												break;
					case !/\./.test(display_name):								ext = display_name.toLowerCase();								break;	// if no '.' in link (typical for bin files), ...
					default:																															// find the last . and get the remaining characters
						ext = display_name.slice(display_name.lastIndexOf('.') + 1).toLowerCase();
						for ( let item_kind in Item_Kinds ) { if ( Item_Kinds[item_kind].includes( ext ) ) { kind = item_kind; } }						// kind = types
						if ( /url|url\/|webloc|webloc\//.test(ext) ) { kind = 'link'; }																	// links
						switch(true) {
							case kind === 'audio': item_classes.push('media');		body_classes.push('has_media','has_audio');					break;
							case kind === 'video': item_classes.push('media');		body_classes.push('has_media','has_video');					break;
							case kind === 'font' : body_classes.push('has_fonts');																break;
							case kind === 'image': body_classes.push('has_images');																break;
						}
						if ( Item_Settings.ignored.includes( ext ) )	{ item_classes.push('ignored'); stats_classes.push('ignored'); }
						if ( display_name.startsWith('.') )			{ item_classes.push('invisible'); stats_classes.push('invisible'); }
				}
				if ( kind === undefined ) { kind = 'other'; }
				if ( !/audio|video/.test(kind) ) { item_classes.push('non_media'); }
				item_classes.unshift(kind); item_classes.unshift('file');
				prepped_link = decodeURIComponentSafe(encodeURIComponent(prepped_link))?.trim();
		}
		stats_classes.push(kind);
		if ( ext === undefined ) { ext = ''; }
		if ( aliases.test(display_name) ) { item_classes.push('alias'); }
		for ( let item_kind_system of Item_Kinds.system ) { if ( display_name?.endsWith(item_kind_system) ) { item_classes.push('ignored'); } }		// ignore various system items
		item_classes = Array.from(new Set(item_classes)).filter(item => item).join(' ');															// remove dupe or empty classes, join
		return [prepped_link,decodeURIComponentSafe(display_name)?.trim(),ext,kind,item_classes,body_classes,stats_classes.join(' '),link_protocol,URL.origin + URL.pathname];
	}
	//==============================//
	function getItemSizeAndDate(item) {																										// ===> GET ITEM SIZE AND DATE
		let item_size_and_date = [], item_display_size, item_sort_size, item_display_date, item_sort_date, size_units = /[BYTES|B|K|KB|MB|GB|TB|PB|EB|ZB|YB]/;
		if ( item.length > 1 ) {																													// test for typical date/time separators.
			if ( /[-:\/]/.test(item[1]) ) { item_display_date = item[1]; item_display_size = item[2]; } else { item_display_date = item[2]; item_display_size = item[1]; }
		}
		switch(true) {																																// get size
			case item_display_size !== undefined && item_display_size.toLowerCase() === 'dir':	case ( /undefined|—|-|,|\*/.test(item_display_size) ):	case item_display_size === '':
																					item_display_size = '&mdash;'; item_sort_size = '0';	break;	// if size is undefined, empty, or punctuation, use these defaults
			default:
				item_sort_size = getItemSortSize(item_display_size);
				switch(true) {
					case !item_display_size.toUpperCase().match(size_units) :	item_display_size = formatBytes(item_display_size,1);		break;	// if provided size is only numeric, format byte size
					default: item_display_size = item_display_size.replace('K','k').replace(/(\d+)\s*([A-z])/,'$1 $2');								// default: format and ensure display size has space between number and units
					}																														break;
		}
		if ( item_display_size === 'NaN undefined' ) { item_display_size = '0 B'; }
																																					// get date
		if ( [undefined,'','-'].includes(item_display_date) ) { item_display_date = '&mdash;'; item_sort_date = '0'; } else { item_sort_date = getItemDate(item_display_date); }
		item_display_date = item_display_date.replace(/, (.+)/,'<wbr>,&nbsp$1').replace(/ (AM|PM)$/im,'<wbr> $1').replace(/\s/g,'&nbsp;');			// ensure that time acts as a block for wrapping in narrow sidebar
		item_size_and_date.push( item_display_size, item_sort_size, item_display_date, item_sort_date );
		return item_size_and_date;
	}
	function getItemSortSize(val) {																											// GET ITEM SORT SIZE
		let sort_size, values = val.replace(/(\d+)\s*([A-z]+)/,'$1 $2').split(' '), size = values[0], unit = values[1];
		const factor = { undefined:1, '':1, B:1, K:1000, KB:1000, M:1000000, MB:1000000, G:1000000000, GB:1000000000, T:1000000000000, TB:1000000000000, P:1000000000000000, PB:1000000000000000, E:1000000000000000000, EB:1000000000000000000, Z:1000000000000000000000, ZB:1000000000000000000000 }; // unit to file size
		if ( unit !== undefined ) { unit = unit.toUpperCase(); }
		sort_size = size * factor[unit]; // convert byte size to multiplication factor
		return sort_size;
	}
	function formatBytes(val, decimals) {																									// ===> FORMAT BYTES: format numeric sizes for display
		const k = 1024, dm = (decimals < 0 ? 0 : decimals), sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(val) / Math.log(k));
		if (val === 0) { return '0 Bytes'; } else { return parseFloat((val / Math.pow(k, i)).toFixed(dm)) +' '+ sizes[i]; }
	}
	function processDate(match,p1,p2,p3) { //***date formats: 2017-10-09 13:12 || 2015-07-25T02:02:57.000Z || 12-Mon-2017 21:11 ***//		// ===> PROCESS DATE
		const mo = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(p2)/3 + 1;																		// e.g., convert month into number, or use number
		return p3 +'-'+ mo +'-'+ p1;																												// return assembled date: YYYY-MM-DD
	}
	function getItemDate(val) {																												// ===> GET ITEM DATE: for sorting (YYYY-MM-DD)
		let sort_date = val.replace(/^(\d{2})-(\w{3})-(\d{4})/m, processDate)	// convert Month to number
						   .replace(/\b(\d{1})[-:/]/g,'0$1/')					// add leading 0 for single digit numbers
						   .replace(/(\d{2})\/(\d{2})\/(\d{2}),/,'$3$1$2')		// reorder MM/DD/YY dates to YY/MM/DD
						   .replace(/-|:|\s+|\//g,'');							// remove spacing characters
		return sort_date;
	}
	//==============================//
	// FETCH MEDIA DURATIONS
	var getFormattedDuration = (secs) => { if ( isNaN(secs) ) { return Number.NaN; }														// ===> GET FORMATTED TIME
		let sec_num = parseInt(secs, 10), hours = Math.floor(sec_num / 3600), minutes = Math.floor(sec_num / 60) % 60, seconds = sec_num % 60;
		let formattedTime = [hours,minutes,seconds].map( v => v < 10 ? "0" + v : v ).filter( (v,i) => v !== "00" || i > 0 ).join(":");
			formattedTime = formattedTime.replace(/^0/m,'');	return formattedTime;																// remove initial 0 and return formatted time
	};
	async function fetchMediaDuration(link,kind) {																							// ===> ASYNC FETCH MEDIA DURATION
		return new Promise((resolve, reject) => {
			const media = ( kind === 'audio' ? new Audio() : document.createElement('video') );
			media.addEventListener('loadedmetadata', () => { resolve(media.duration); });		media.addEventListener('error', reject);	media.src = link.replace(/\&amp;/g,'&');
		});
	}
	async function getMediaDuration(link,media_kind,id) {																					// ===> ASYNC GET MEDIA DURATION (not utility iframe subdir items; see buildNewIndex)
		try { const duration = await fetchMediaDuration(link,media_kind);	setMediaDuration( id,media_kind,duration );								// await media duration; set media duration
		} catch (error) {
			if ( id?.indexOf('playlist') && hasClass('body','has_playlist') || !id?.indexOf('playlist') && !hasClass('body','has_playlist') ) { setMediaDuration( id,media_kind,Number.NaN ); }		// on error, set dur = NaN
		}
	}
	// SET MEDIA DURATIONS
	function getThisDuration(id) { let item_dur = Number(getData('#'+id +' .dirlist_item_media_duration','duration') );	if ( id !== undefined ) { return ( isNaN(item_dur) ? Number.NaN : item_dur ); } } // return dur or NaN
	function setThisDuration(id,dur) { getEl('#'+id).querySelector('.dirlist_item_media_duration').dataset.duration = dur; }
	function setMediaDuration(id,kind,duration) { let el;						// ===>  SET MEDIA DURATION
		if ( id === 'content_iframe_file' || /youtube.com|youtu.be/.test(getEl('#'+id+' a')?.href) ) { return; }							// do not attempt to set duration for iframe files or youtube playlist items
		try { el = getEl('#'+id);	setThisDuration(id,duration);
			switch(true) {
				case Number(duration) === 0: case isNaN(Number(duration)):												el.classList.add('disabled');			break;	// if duration is NaN, disable and show spinner
				default: el.querySelector('.dirlist_item_media_duration').innerText = getFormattedDuration(duration);	el.classList.remove('disabled'); el.querySelector('input')?.removeAttribute('disabled');
					statsSetTotalDuration(duration,kind);																										break;	// if duration is a number, update stats
			}
		} catch (error) { null }
	}
	function statsSetTotalDuration(duration,kind) {	let media_items = getEls('.dirlist_item.media');	if ( !media_items ) { return; }					// if no media items, or total times already calculated, abort
		let total_duration = Number(getEl('#total_duration')?.dataset.total_duration), audio_duration = 0, video_duration = 0;
		switch(true) {
			case kind !== 'refresh_all':	addClass('body','has_'+ kind);																								// after opening subdir
				total_duration = Number(total_duration) + Number(duration);
				getEl('#total_duration').dataset.total_duration = total_duration; getEl('#total_duration').innerText = getFormattedDuration(total_duration);	break;	// set display total duration
			default:
				for ( let i = 0; i < media_items.length; i++ ) { duration = getThisDuration(media_items[i].id);															// get duration from dirlist item
					if ( !isNaN(Number(duration)) ) { total_duration = Number(total_duration) + Number(duration); } else { return }										// update total duration
					switch(true) {																																		// update audio and video total durations
						case kind === 'audio': audio_duration = Number(audio_duration) + Number(duration);								// add has_audio class, increment total audio duration
							setAttr('#stats_details_items span.audio','data-audio_duration',' (Total Time: '+ getFormattedDuration(audio_duration) +')');		break;
						case kind === 'video': video_duration = Number(video_duration) + Number(duration);								// add has_video class, increment total video duration
							setAttr('#stats_details_items span.video','data-video_duration',' (Total Time: '+ getFormattedDuration(video_duration) +')');		break;
					}
					setAttr('#total_duration','data-total_duration',total_duration);	getEl('#total_duration').innerText = getFormattedDuration(total_duration);		// set display total duration
				}
		}
	}
	// REFRESH MEDIA DURATIONS
	function refreshMediaDurations(id) { let media_items, item = getEl('#'+id), link = item?.querySelector('a')?.href, kind = item?.dataset?.kind;	// ===> REFRESH MEDIA DURATIONS from menu or selecting [Error] media file
		switch(true) {
			case id === 'refresh_media_durations':																									// refresh all durations; from click refresh media durations menu item
				media_items = Array.from(getEls('.dirlist_item.media')); media_items = media_items.filter( (el) => { return ( isNaN(getThisDuration(el?.id)) || getThisDuration(el?.id) === 0) }); // only update if dur is falsey
				media_items.forEach( el => refreshMediaDurations(el?.id) );																			// send each media item with id back to function for default processing
				if ( isTopWindow() ) { messageSend('iframe','refresh_media_durations'); }													break;	// send refresh message to iframe
			default:	 if ( isNaN(getThisDuration(id)) || getThisDuration(id) === 0 ) { setThisDuration(id,0); getMediaDuration( link,kind,id ); }	break;	// refresh dur by id; first set dur to 0 to show loading spinner
		}
	}
	//==============================//
	function buildStats(stats_classes,stats_kinds,stats_total_size) {																			//*** BUILD STATS
		stats_classes.sort();
		let total_items = stats_classes.length, counts = {}, kinds = [], stats_items = [], total_dirs = 0, total_files = 0, total_dirs_invisible = 0, total_files_invisible = 0, total_invisibles = '';
		for ( let i = 0; i < total_items; i++ ) {																								// Get counts
			stats_classes[i] = stats_classes[i].split(' ').reverse().join(' ')																	// reorder classes to make invisible/ignored last
			counts[stats_classes[i]] = 1 + ( counts[stats_classes[i]] || 0 );																	// get key/value pairs for item_classes/total counts
			switch(true) {
				case ( !/invisible|ignored/.test(stats_classes[i]) ):																	break;	// don't count :not(.invisible) and :not(.ignored)
				case (getCurrentUIPref('show_invisibles') === 'true' ) && ( getCurrentUIPref('show_ignored_items') === 'false' ):				// show_invisibles && hide_ignored
					if ( /invisible/.test(stats_classes[i]) && /ignored/.test(stats_classes[i]) ) { break; }									// don't count .invisible.ignored
					if ( /dir/.test(stats_classes[i]) ) { total_dirs_invisible++; } else { total_files_invisible++; }					break;	// else count .ignored
				case (getCurrentUIPref('show_invisibles') === 'false' ) && ( getCurrentUIPref('show_ignored_items') === 'false' ):				// hide_invisibles && hide_ignored (hide all)
					if ( /dir/.test(stats_classes[i]) ) { total_dirs_invisible++; } else { total_files_invisible++; }					break;	// count .invisible and .ignored (count all)
				case (getCurrentUIPref('show_invisibles') === 'true' ) && ( getCurrentUIPref('show_ignored_items') === 'true' ):		break;	// don't count .invisible or .ignored (count none)
				case (getCurrentUIPref('show_invisibles') === 'false' ) && ( getCurrentUIPref('show_ignored_items') === 'true' ):				// hide_invisibles && show_ignored
					if ( !/invisible/.test(stats_classes[i]) && /ignored/.test(stats_classes[i]) ) { break; }									// don't count .ignored:not(.invisible)
					if ( /dir/.test(stats_classes[i]) ) { total_dirs_invisible++; } else { total_files_invisible++; }					break;	// else count .invisible and .invisible.ignored
			}
		}
		for ( let i = 0; i < stats_kinds.length; i++ ) { kinds[stats_kinds[i]] = 1 + ( kinds[stats_kinds[i]] || 0 ); }							// get key/value pairs for item kinds/counts
		total_dirs = ( kinds.dir || 0 );		total_files = ( total_items - total_dirs );														// total dirs && files count
		if ( getCurrentUIPref('show_invisibles') === 'false' || getCurrentUIPref('show_ignored_items') === 'false' ) {
			total_invisibles = ' (+'+ (total_dirs_invisible + total_files_invisible) +')';
			total_items = total_items - (total_dirs_invisible + total_files_invisible);
			total_dirs = total_dirs - total_dirs_invisible;
			total_files = total_files - total_files_invisible;
		}
		for ( let count in counts ) {																											// make detail item for each kind of dirlist item --> doesn't preserve order
			let kinds_items = count.split(' '), temp_items = [], stats_Item_Kinds = '';
			kinds_items.forEach( item => ( !/ignored|invisible/.test(item) ? temp_items.unshift(item) : temp_items.push(item) ) );		kinds_items = temp_items;
			kinds_items.forEach( item => ( stats_Item_Kinds += (`<span class="${ item }" >`+ (/ignored|invisible/.test(item) ? ' ('+item+')' : item.trim() ) +`</span>`)) );
			let stats_item = `<li class="stats_list_item display_grid ${ kinds_items[0] }" data-kind="${ kinds_items[0] }"><a class="icon stats_list_item_name_a display_flex"  data-count="${ counts[count] }"><span class="has_icon_before_before"></span><span class="stats_list_item_name_a_span">${ stats_Item_Kinds }</span></a></li>`;
				stats_items.push(stats_item);
		}
		stats_items.sort();
		return `<nav id="stats_container" class="display_flex width_100"><div id="stats" class="normal pointer overflow_hidden font_size_small">    <ol id="stats_summary" class="background_grey_80 text_color_default margin_0 padding_0">    <li class="stats_list_item line_height_1_2 no_highlight padding_4_8"><span id="stats_summary_totals" class="display_flex align_left" data-size="${ stats_total_size }">${ total_items } Items${ total_invisibles }: ${ total_dirs } Dirs, ${ total_files } Files (${ formatBytes(stats_total_size,2) })</span><span id="total_duration" class="display_none" data-total_duration=""></span></li>    </ol>    <ol id="stats_details_summary" class="border_bottom position_relative background_grey_80 text_color_default margin_0 padding_0 display_none">    <li id="stats_details_summary_total" class="summary_detailed border_bottom padding_4_8 no_highlight"><span>${ total_items } Items (${ total_dirs_invisible + total_files_invisible } invisible or ignored)</span></li>    <li id="stats_details_summary_dirs" class="stats_list_item line_height_1_2 dir summary_detailed background_grey_85 padding_0"><a class="icon stats_list_item_name_a display_flex" data-count="${ total_dirs }"> <span class="stats_list_item_name_a_span display_flex has_icon_before stats_kind">Dirs (${ total_dirs_invisible } invisible or ignored)</span> </a></li>    <li id="stats_details_summary_files" class="stats_list_item line_height_1_2 file summary_detailed background_grey_85 padding_0"><a class="icon stats_list_item_name_a display_flex" data-count="${ total_files }"><span class="stats_list_item_name_a_span display_flex has_icon_before stats_kind">Files (${ total_files_invisible } invisible or ignored)</span></a></li>    </ol>    <div id="stats_details_items_container">    <ol id="stats_details_items" class="margin_0 padding_0 position_relative display_none">    ${ stats_items.join('\n') }    </ol>    </div>    </div></nav>`;
	}
	function updateStats(bool) {																												// ===> UPDATE STATS (bool: add or subtract size from total)
		let items = getEls('.dirlist_item'), item_info, total_item_size, stats_classes = [], stats_kinds = [], item_classlist = [], total_size = 0;		// get all dir_list items
		getEls('.dirlist_item_details.size').forEach(el => total_size += Number(el.dataset.size));
		total_item_size = ( bool === false ? total_size : Number(getData('#stats_summary_totals','size')) );
		for ( let i = 0; i < items.length; i++ ) {																										// get classes and kind for each item
			item_info = getLinkInfo( items[i].getElementsByClassName('dirlist_item_name_a')[0].href );													// get item info = [link,name,ext,kind,item_classes,body_classes];
			item_classlist = item_info[4];	item_classlist = item_classlist.replace(/file|media|audio_loaded|content_loaded|has_subdirectory|selected|non_/g,'').trim();	// get item_classlist; remove unwanted classes
			stats_classes.push(item_classlist);		stats_kinds.push( item_info[3] );																	// add item_classlist to stats_classes;  add Item_Kinds to stats_kinds
			total_item_size += Number(items[i].querySelector('.size').dataset.size);
		}
		getEl('#stats_container').remove(); getEl('#sidebar_footer').insertAdjacentHTML('afterbegin',buildStats(stats_classes,stats_kinds,total_item_size,2));	// remove old stats; build new stats and add to sidebar_footer
		statsSetTotalDuration(null,'refresh_all');		initStatsEvents();																						// initial event listeners for new stats items
	}
	// ***** END DIR_LIST SETUP ***** //
	//============================//
	// ***** UI SETUP ***** //
	function prepDocHead(agent) {																														// ===> PREP DOC HEAD
		document.title = 'Index of '+ window_location;																											// change the doc title to current location
		for ( let attr_name of getEl('html').getAttributeNames() ) { getEl('html').removeAttribute(attr_name); }												// remove html attributes, if any
		getEl('head title').removeAttribute('id');
		getEls('head meta, head base, head link, style, script, noscript').forEach( headEl => headEl.remove() );												// remove various head elements
		let head_content = '<meta charset="utf-8"><base href="'+ window.location.origin  +'">' + getEl('head').innerHTML.replace(/<!--(?!>)[\S\s]*?-->/g,'');	// add meta and remove conditional comments
		if ( window.location.protocol.startsWith('file') ) { head_content = get_SVG_UI_File_Icon('favicon') + head_content; }									// add custom favicon for local directories
		getEl('head').innerHTML = head_content + addStyles(agent);																								// replace head content with prepped content
	}
	function getUIPrefBodyClasses(agent) {																												// ===> GET UI PREF BODY CLASSES and other initial settings
		let queries = new URLSearchParams(window.location.search).entries();	queries = Object.fromEntries(queries);											// make new search params from window.location.search
		let body_classes = [], settings = Object.assign({},queries,UI_Settings);																				// merge UI_Settings and query settings
		for ( let key in settings ) {
			switch(true) {
				case ['grid_font_size','grid_image_size','ui_font','ui_scale','show_image_thumbnails'].includes(key):									break;  // ignore these keys (values set in css or by buildTextEditorUI)
				case ['sort_by','sort_direction','theme','texteditor_view'].includes(key):	body_classes.push( key +'_'+ getCurrentUIPref(key) );		break;	// other non-booleans: class = key + value
				case getCurrentUIPref(key) === 'false':										body_classes.push( key +'_false' );							break;	// booleans: only add false values
				}
		}
		body_classes.push(agent); body_classes.push('is_'+getOS());																								// add browser and os classes
		return body_classes.sort().join(' ');
	}
	function makeNewIndex(el,sort,agent,body_id) {																										// ===> MAKE NEW INDEX
		const index_items = getIndexItems(agent), items = index_items[0], type = index_items[1];
		const converted_index = convertIndexItems( items, type );																								// = array of rows: ["link","date","size"]
		switch(type) {
			case 'error':	return [[['<tr id="is_error"><td id="is_error_items" class="padding_6_8">'+ ( items === undefined ? '' : items ) +'</td></tr>'],'is_error'],'','',index_items];
			default:		return [buildNewIndex( el.id, converted_index, sort, type, body_id )];
		}
	}
	// ===> BUILD IFRAME DIR LIST UI, with utility iframe for subdirectories add
	function buildIframeUI(src,file_name,agent) {
		let parent_link = src.split('/').slice(0,-2).join('/') + '/', query_str = new URLSearchParams(window.location.search.toString().slice(1));
		let subdirectory = query_str.get('subdirectory') || null, body_id = query_str.get('body_id');
		let iframe_directory, iframe_head, iframe_dir_list, content_body, gecko_styles, body_classes, iframe_utility_iframe, new_index, make_new_index, additional_classes;
		window.onmessage = function(e) { messageReceive(e); return; }																							// init receive messages
		switch(true) {
			case window.location.search === "":																													// nobreak; case is true when opening dirs from sidebar source dir
			case ( query_str.get('show_directory_source') || query_str.get('is_error') ) === 'true':
				if ( elExists('#iframe_dir_styles') ) { getEl('#iframe_dir_styles').remove(); }															break;	// do nothing when viewing directory source or if error page...
			default:																																			// ...else set up iframe directory:
				iframe_head = getEl('head');  content_body = getEl('body'); iframe_dir_list = ''; gecko_styles = ''; body_classes = [];
				iframe_utility_iframe = '<iframe id="content_iframe_utility" sandbox="allow-scripts allow-same-origin allow-modals allow-popups" style="display:none;"></iframe>';
				if ( /\.php\?/.test(src) ) { query_str = new URLSearchParams(makeSrcSearchParams('dir')); }														// define default params for index.php?folder=... pages
				for ( let key of query_str.keys() ) {																											// add various body_classes...
					switch(true) {
						case ( /show_details|ui_font/.test(key) ):																						break;	// show details by default
						case query_str.get(key) === 'true':																								break;	// ignore true booleans
						case query_str.get(key) === 'false':	body_classes.push(key+'_false');														break;	// add body classes for false boolean params
						default:								body_classes.push(key+'_'+getCurrentUIPref(key));										break;	// non-boolean params (theme, sort)
					}
				}
				if ( agent === 'is_gecko' ) { gecko_styles = ('<style id="gecko_style_rules">'+ gecko_style_rules +'</style>'); }
				new_index = makeNewIndex(content_body, query_str.get('sort_by'),'',body_id);																	// make new index
				make_new_index = new_index[0];
				additional_classes = (new_index[0][1].trim().split(/\s+/)).concat(body_classes);																// define additional body classes
				if ( !/is_error/.test(new_index[0][1]) ) {																										// if not an a error page...build the ui
					iframe_head.querySelectorAll('style,script,meta,link[rel="stylesheet"],link[href$="css"]').forEach( el => el.remove() );					// remove any existing directory index styles
					iframe_head.insertAdjacentHTML('beforeend',`<style id="iframe_dir_styles">${iframe_dir_styles }</style><style id="sidebar_styles">${ sidebar_styles }</style><style>${ content_pane_styles }</style><style id="font_styles"></style><style id="font_grid_styles"></style>${gecko_styles}`);	// assemble the iframe head
					switch(true) {																																// Assemble content_iframe and utility_iframe content
						case subdirectory === 'true':	iframe_dir_list = `<div id="directory_list_outer"><ol id="directory_list" class="border_bottom text_color_default">${ make_new_index[0] }</ol></div>`;	break;
						default:
							iframe_directory = Sidebar_Elements('iframe',parent_link);																			// create iframe directory elements
							iframe_dir_list = iframe_directory.replace(/insert_prepped_index/,make_new_index[0]).replace(/insert_stats/,make_new_index[2]);		// assemble iframe directory
							content_body.removeAttribute('style');	content_body.style.fontFamily = getCurrentUIPref('ui_font');								// remove any body inline styles; set ui_font
							content_body.classList.add(...additional_classes);																					// add body styles
					}
					content_body.innerHTML = iframe_dir_list + Content_Pane_Elements();																			// append iframe_dir_list and content_pane for quicklook
				}
				if ( subdirectory === null ) { content_body.insertAdjacentHTML('beforeend',iframe_utility_iframe); initIframeEvents(); }						// don't multiply utility_iframes; init iframe event listeners
				if ( subdirectory === 'true' ) {
					messageSend('top_body','dirlist_subdir_loaded','',[getEl('#directory_list').innerHTML,make_new_index[1],getCurrentUIPref('parent_id')] );	// send prepped subdir to parent window
				} else {
					messageSend('top_body','iframe_loaded','',[src,file_name,'dir']);																			// else send iframe_loaded message
				}
		}
	}
	// ===> BUILD TEXT EDITOR UI
	function buildTextEditorUI(kind) { let raw_markdown, body_classes = [], content;
		if ( document.body === null ) {										// process remote webloc files
			content = document.documentElement.textContent;
			//messageSend('top_body','iframe_loaded','',[window_location,'',kind,null,content]);
			return;
		}
		if ( !hasClass('body','has_texteditorUI') ) {																		// add classes, styles, and scripts; only add once
			getEl('head').insertAdjacentHTML('beforeend','<style id="texteditor_styles">'+ texteditor_styles +'</style>');
			getEl('head').insertAdjacentHTML('beforeend','<link id="github_markdown_css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css"></link>');
			body_classes.push('has_texteditorUI', 'texteditor_view_'+getCurrentUIPref('texteditor_view'));
		}
		switch(true) {																																// get source text and append UI elements
			case !isTopWindow():																													// iframe text editing UI
				window.onmessage = function(e) { messageReceive(e); return false; }																	// init receive messages is_link
				getEl('head').insertAdjacentHTML('afterbegin','<meta charset="utf-8" /><meta http-equiv="Content-Type" content="text/plain; charset="utf-8">');
				getEl('head').insertAdjacentHTML('beforeend','<style id="global_styles">'+ global_styles +'</style><style id="utilities_styles">'+ utilities_styles +'</style>');	// add iframe text editing styles
				if ( kind === 'link' ) { tempHideTexteditor(); }																					// prevent FOUC for some kinds of content...
				raw_markdown = decodeURIComponentSafe( getEl('body').innerText );																	// get source text and decode Unicode chars.
				document.body.innerHTML = Content_Pane_Elements('content_text_elements') + Utilities_Elements('texteditor');						// add the UI
				getEl('#texteditor_raw_pane').value = raw_markdown;																					// set the source text value
				getEl('#texteditor_raw_pane').setSelectionRange(0,0);																				// set the insertion point to the beginning of the text
				if ( /^\#EXTM3U/m.test(getEl('#texteditor_raw_pane').value) ) { content = getEl('#texteditor_raw_pane').value.trim(); messageSend('top_body','iframe_playlist','',content); }	// playlists & filelists
				addClass('body','is_text');		searchParamsGet().forEach((key, value) => { addClass('body',value+"_"+key); });						// add text editor body classes
				break;
		}
		switch(true) {																																// assemble text editing body classes
			case getCurrentUIPref('text_editing_enable') === 'false' && !isTopWindow():																// if text editing disabled...
				if ( hasClass('body','texteditor_view_html') ) { searchParamSet('texteditor_view','raw'); }
				removeClass('body','texteditor_view_html texteditor_split_view_true');																// remove split_view and view_html classes
				body_classes.push('text_editing_enable_false','texteditor_split_view_false','texteditor_view_'+getCurrentUIPref('texteditor_view'));// show the raw text, no split view
				setAttr('#texteditor_raw_pane','readonly','');																				break;	// disable textarea editing
			default:																																// ...otherwise set up text editing
				textEditorTogglePrefs('texteditor_split_view', ( getCurrentUIPref('texteditor_split_view')	=== 'false' ? 'false' : 'true' ));		// set split view
				textEditorTogglePrefs('texteditor_sync_scroll',( getCurrentUIPref('texteditor_sync_scroll') === 'false' ? 'false' : 'true' ));		// set sync scroll
		}
		TextEditing();	initTextEditorEvents();																										// text editing functions & init text editor event listeners
	}
	// ===> BUILD UI: Append all assembled elements to body
	function buildUI() { let make_new_index, body_classes, main_content, agent = getBrowser(), link_info, file_name, kind, iframe_src;
		switch(true) {
			case isTopWindow():																														// if it's not an iframe...
				make_new_index = makeNewIndex('body','',agent,'top_body');																			// make index
				if ( make_new_index[0] === undefined ) { return; }																					// in case user cancels processing of large directory > 5000 items
				body_classes = make_new_index[0][1] +' '+ getUIPrefBodyClasses(agent);																// delete extra spaces, create array of body class names
				main_content = `${ Sidebar_Elements('top_body') }     ${ Content_Pane_Elements() }     ${ Utilities_Elements('top_body') }`;		// assemble html elements
				if ( make_new_index[0][1] !== 'is_error' ) {
					main_content = main_content.replace(/insert_prepped_index/,make_new_index[0][0]).replace(/insert_stats/,make_new_index[0][2]);	// build dir_index and stats, add to MainContent
				} else {
					main_content = main_content.replace(/insert_prepped_index/,'').replace(/<ul id=\"sidebar_header_utilities_row_1[\s\S]+Show Font Grid<\/li>\s*<\/ul>\s*<\/li>\s*<\/ul>/m,'').replace(/<ul id=\"show_texteditor[\s\S]+Text Editor<\/span><\/li><\/ul>/,'').replace(/<footer[\s\S]+footer>/,'');												// build error ui
				}
				document.body.innerHTML = '';																										// remove body contents
				prepDocHead(agent);																													// add title, favicon, meta tags, styles to head
				setAttr('body','id','top_body');																									// add body id
				setAttr('body','lang','en');																										// add body lang attr
				if ( document.body.getAttribute('class') !== null ) { document.body.removeAttribute('class'); }										// remove body classes, if any
				addClass('body',body_classes);																										// add body classes
				document.body.innerHTML = main_content;																								// add main content to body
				uiPrefFontSet();	uiPrefScaleSet(null,Number(getCurrentUIPref('ui_scale')),true);													// set ui font and scale
				if ( make_new_index[0][1] !== 'is_error' ) { initEvents(); autoLoadItems(); }
				else { initBaseEvents(); showDirectorySource(window.location.origin + window.location.pathname + '?error=is_error'); addClass('#content_iframe','has_content'); }		break;
			case !isTopWindow() && !/\.pdf$/.test(window.location.pathname):																		// if iframe and not pdf (i.e. embed el), setup iframe UI
				iframe_src = window.location.href;     link_info = getLinkInfo(iframe_src);     file_name = link_info[1];     kind = link_info[3];
				setAttr('body','id','content_body');																														// add iframe body id
				switch(true) {																																				// determine UI type...
					case ( /\.php\?/.test(iframe_src) ):																													// attempt to deal with some .php?folder links
					case ( /app|dir/.test(kind) && !/is_error/.test(iframe_src)):			buildIframeUI(iframe_src,file_name,agent);	addClass('body','is_dir');	break;	// if dir, set up iframe dir list UI
					case kind === 'link': case link_info[2] === 'cuetxt':					main_content = ( document.body?.innerText || document.documentElement.textContent ); // nobreak; if link or cuetxt, send file content
																if ( link_info[2].startsWith('webloc') && window_protocol !== 'file:' )  { kind = 'remote_webloc'; break }	// if remote webloc file w/o document.body
					case ( /code|text|markdown|other/.test(kind) ) && !(window.parent !== window.top):		buildTextEditorUI(kind);	addClass('body','is_text');			// if text file, set up iframe text editor
																		main_content = getEl('#texteditor_raw_pane')?.value;
																		break;	// get text content for optional processing (cuetxt)
					case kind === 'htm':
						main_content = getEl('html').outerHTML; addClass('body','is_html'); 
						if ( document.head.querySelector('#supercharged_styles') === null ) { 
							getEl('head').insertAdjacentHTML('beforeend','<style id="supercharged_styles">body.theme_dark img { filter:invert(1) hue-rotate(180deg) saturate(0.5) !important; }</style>');
						}
						if ( getCurrentUIPref('theme') === 'dark' ) { addClass('body','theme_dark'); } else { removeClass('body','theme_dark'); }		// nobreak; if html file, get innerHTML
					default:											initIframeEvents();																			break;	// if any other iframe content
				}
				messageSend('top_body','iframe_loaded','',[iframe_src,file_name,kind,null,main_content]);															// send iframe_loaded message (not dir|link file) with args
				break;
		}
		uiPrefImgThumbsToggle(getCurrentUIPref('show_image_thumbnails'));													// load image thumbnails after building ui
	}
	buildUI();
	//============================//
	// INITIALIZE EVENT LISTENERS
	function initEvents() { if ( window.parent !== window.top ) { return; }
		initBaseEvents();    initDirListEvents();    initStatsEvents();    initWarningEvents();								// ===> INIT EVENT LISTENERS // init base events, stats events, and dir list events
		getEl('#default_settings').onclick = function(e)												{ uiPrefsReset(e); };													// settings to default
		getEl('#show_directory_source').onclick = function(e)											{ e.stopPropagation();	showWarning('showDirectorySource'); };			// toggle show directory source
		getEl('#open_in_content_pane').onclick = function(e)											{ e.stopPropagation();	showWarning('openSidebarInContentPane'); };		// open sidebar in content pane
		getEl('#open_in_texteditor').onclick = function(e)												{ e.preventDefault();	openInTextEditor(); };							// openInTextEditor
		getEls('#open_font_label, #open_playlist_label, textarea, div[contenteditable], select, #scale').forEach( el => el.onclick = function(e) { e.stopPropagation(); });		// stopProp on various clicks
		getEls('#show_font_grid, #show_grid_btn, #show_image_grid, #show_texteditor, #texteditor').forEach( el => el.onclick = function(e) { eStopPrevent(e); showThis( el.id,false,true ); });	// show grids or text editor
		getEl('#show_grid_btn').onmouseenter = function() { addClass('body','has_menu_grid'); };		getEl('#show_grid_btn').onmouseleave = function() { removeClass('body','has_menu_grid'); };
		getEl('#close_audio').onclick = function(e)														{ e.stopPropagation();	showMedia('close_audio'); };					// close audio button click
		getEl('#sidebar_footer').onclick = function()													{ removeClass('.dirlist_item','hovered'); };							//
		getEl('#content_image').onclick = function(e)													{ e.stopPropagation();	scaleImages(e); };								// Zoom image on click
		getEls('#content_title,#content_audio_title').forEach( el => el.onclick = function()			{ playlistShowItem(el.id); });
		window.onresize = function(e)																	{ if ( hasClass('body','audio_player_on_top_false') ) { audioPlayerPositionToggle('reset'); }
																											menuShow(e,'cuesheet_track_list_container_audio')};					// reset text editor split
		getEls('#open_font,#open_playlist').forEach( el => el.onclick = function(e)						{ openFiles(e,el.id); });												// Open files (onclick show warnings)
		getEls('#open_font,#open_playlist').forEach( el => el.onchange = function(e)					{ e.preventDefault(); e.stopPropagation();	openFiles(e,el.id); });		// Open font and playlist files
		getEl('#go_to_item').onclick = function(e)														{ goToItem(e); };														// Go to item
		getEl('#show_invisible_items').onclick = function()												{ getEl('#show_invisibles').click();	getEl('#show_invisibles').blur(); }					//
		getEl('#play_toggle').onclick = function(e)														{ toggleAllChecked(e); };												// toggle media checkboxes
		getEl('#make_playlist').onclick = function(e)													{ eStopPrevent(e);	showWarning('warning_make_playlist'); };			// make playlist
		getEl('#save_svg').onclick = function(e)														{ e.stopPropagation();	fontGlyphSave(); };								// save glyph as svg
		getEl('#sidebar_footer_utilities').onmouseenter = function()									{ addClass('body:not(.has_menu), body:not(.has_menu_parents)','has_menu_footer'); };
		getEl('#sidebar_footer_utilities').onmouseleave = function()									{ removeClass('body:not(.has_menu), body:not(.has_menu_parents)','has_menu_footer'); };
		getEls('.prev_next_btn').forEach( el => el.onclick = function(e)								{ contentHeaderButtons(e,el.id); });									// ============> combine with next?
		getEls('#increase,#decrease').forEach( el => el.onmousedown = function(e)						{ e.preventDefault(); contentHeaderButtons(e,this.id); });				// onclick scale buttons
		getEls('.media_player').forEach( el => el.onplay = function()									{ toggleMediaNameInWindowTitle('Playing: '); });						// autoplay media onended
		getEls('.media_player').forEach( el => el.onpause = function()									{ toggleMediaNameInWindowTitle('Paused: '); });							// autoplay media onended
		getEls('.media_player').forEach( el => el.onended = function()									{ navigateByArrowKey(['ArrowRight',true]); toggleMediaNameInWindowTitle(); });		// autoplay media onended
		getEls('#loop_media_files,#shuffle_media_files,#audio_options input,#audio_options label').forEach( el => el.onclick = function(e)	{ el.blur(); mediaPlaybackOptions(e,el.id); });	// media loop/shuffle options
		getEl('#refresh_media_durations').onclick = function()											{ refreshMediaDurations('refresh_media_durations'); };
		getEls('#parent_dir_nav #svg_multiply,#close_playlist').forEach(el => el.onclick = function(e)	{ e.preventDefault(); e.stopPropagation(); showWarning('closePlaylist','close_playlist'); });
		getEl('#text_editing_enable').onclick = function()												{ textEditorTogglePrefs('text_editing_enable'); menuClose(); };
		// getEl('#audio').ontimeupdate =																getMediaTimeRemaining;			// update remaining media time; !!!disabled until remaining time fixed
	}
	function initBaseEvents() {																// ===> INIT BASE EVENT LISTENERS: minimal listeners needed for error pages
		window.onmessage = function(e) { messageReceive(e); return false; }																										// init receive messages
		document.body.onclick = function()																{ menuClose(); };														// close menu click
		getEls('.menu_container').forEach( el => el.onclick = function(e)								{ e.stopPropagation(); menuShow(e,el.id); });							// toggle menus on click
		getEls('#sidebar_menu_main li').forEach( el => el.onclick = function(e)							{ e.stopPropagation(); menuClick(); menuClose(e); });
		getEls('#sidebar_menu_main li').forEach( el => el.onmouseenter = function()						{ removeClass('#sidebar_menu_main li','selected hovered');  addClass('#sidebar_menu_main li:hover','selected'); });
		getEls('.toggle_UI_pref').forEach( el => el.onclick = function(e)								{ uiPrefToggleOnClick(e,this.id); menuClose(e); });						// toggle UI prefs click
		getEl('#font_toolbar').onclick = function(e) { e.stopPropagation(); }
		getEls('#sidebar,#content_header').forEach( el => el.onclick = function(e)						{ e.stopPropagation(); focusEl('#top_body'); });						// focus sidebar on click
		getEls('#content_pane, #content_pane .content_el').forEach( el => el.onclick = function(e)		{ e.stopPropagation(); focusEl('#'+ el.id); });							// focus content on click
		getEls('#content_audio,#content_font,#content_image,#content_video').forEach( el => el.onerror = function(e) { setWarningItemNotLoaded([null,el.id.split('_')[1]]) });	// audio,font,image,video load error
		getEl('#ui_font').onclick = function(e)															{ uiPrefFontSet(e,this.id) };											// show the UI font textarea
		getEl('#ui_scale input').oninput = function(e)	{ e.stopPropagation(); setData('#ui_scale span.menu_item','value',Math.round(this.value)+'%'); };						// show scale %
		getEl('#ui_scale input').onmouseup = function(e)												{ uiPrefScaleSet(e,this.value); };										// scale UI
		getEl('#ui_scale').ondblclick = function(e)														{ uiPrefScaleSet(e,100) };												// set 100% scale on dblclick
		getEl('#show_help').onclick = function(e)														{ e.preventDefault(); addClass('#top_body','has_help'); };				// show help click
		getEl('#close_help').onclick = function(e)														{ e.preventDefault(); removeClass('body','has_help'); };				// close help click
		getEl('#help_container').onclick = function(e)													{ e.stopPropagation(); };												// help container: ignore clicks
		getEl('#close_btn').onclick = function(e)														{ eStopPrevent(e); closeContent(); this.blur(); };						// close button
		getEl('#reload_btn').onclick = function(e)														{ eStopPrevent(e); resetContent(); this.blur(); this.classList.remove('reset'); };	// reset btn
		getEl('#handle').onmousedown = function(e)														{ resizeSidebar(e); }													// resize sidebar
		getEls('a.internal').forEach( el => el.onclick = function(e)									{ e.preventDefault(); scrollThis('#help_container',this.getAttribute('href')); });
		document.addEventListener('mouseup',function()													{ document.onmousemove = null; });										// revoke drag on mouseup
		document.addEventListener('mousemove',function()												{ removeClass('body','no_hover'); });									// remove no_hover class
		document.addEventListener("DOMContentLoaded", lazyLoadImageThumbs() );
	}
	function initWarningEvents() {
		getEls('#warnings_container button')?.forEach( el => el.onclick = function(e)					{ eStopPrevent(e); warningButtons( el.id ); });
		getEls('body.has_overlay, body.has_warning').forEach( el => el.onclick = function(e)			{ eStopPrevent(e); return; });								// prevent user actions with warning or overlay
		getEls('body.has_overlay, body.has_warning').forEach( el => el.onmousedown = function(e)		{ eStopPrevent(e); return; });								// prevent user actions with warning or overlay
		getEls('body.has_overlay, body.has_warning').forEach( el => el.onmouseup = function(e)			{ eStopPrevent(e); return; });								// prevent user actions with warning or overlay
	}
	function initDirListEvents() { if ( !isTopWindow() ) { return; }													// ===> INIT DIR_LIST EVENT LISTENERS; called whenever new dir list items added
		getEls('.dirlist_item')?.forEach( el => el.onclick = function(e)								{ clickDirListItem(e,el.id); });										// show item or play/pause media
		getEls('.dirlist_item.dir .has_icon_before_before')?.forEach( el => el.onclick = function(e)	{ subDirOpenClose(e,el.closest('.dirlist_item').id); });				// open/close subdirectories
		getEls('.dirlist_item.dir')?.forEach( el => el.ondblclick = function(e)							{ e.preventDefault(); showWarning('dirOpen', [el.id, el.querySelector('a').href] ); });
		getEls('.dirlist_item.link')?.forEach( el => el.ondblclick = function(e)						{ openLinkFile(e,el.id); });											// open link files on dblclick
		getEls('.dirlist_item.media input')?.forEach( el => el.onmousedown = function(e)				{ toggleChecked(e,el.closest('.dirlist_item').id); });					// toggle media checkboxes
		getEls('.dirlist_item.media input')?.forEach( el => el.onclick = function(e)					{ el.blur(); e.preventDefault(); e.stopPropagation();  });				// Click media checkboxes
		getEls('.dirlist_item.playlist')?.forEach( el => el.ondblclick = function(e)					{ eStopPrevent(e); clickThis('#open_playlist'); });						// open playlist
		getEls('.dirlist_item.non_local')?.forEach( el => el.onmouseenter = function()					{ el.title = 'Non-local file'; });										// add non-local title prop
		getEl('#show_invisibles_container')?.addEventListener('click',function(e)						{ e.stopPropagation(); clickThis('#show_invisibles_container input'); });
	}
	function initStatsEvents() {																																		// ===> INIT STATS EVENT LISTENERS
		getEl('#stats')?.addEventListener('mouseleave',function()										{ menuClose(); });
		getEl('#stats_summary')?.addEventListener('click',function(e)									{ e.stopPropagation(); menuShow(e,'stats_summary'); });					// show stats
		getEls('#stats_details_items li, #stats_details_summary_dirs, #stats_details_summary_files')?.forEach( el => el.onmouseenter = function() {
			getEls('.dirlist_item'+ statsGetHoveredListClass(el))?.forEach( el => el.classList.add('hovered'));																	// add the hovered class
			getEl('.dirlist_item.hovered')?.scrollIntoView({ behavior:'smooth',block:'nearest',inline:'nearest' });																// scroll 1st matched el
		});
		getEl('#stats_details_summary_total')?.addEventListener('click',function() { menuClose(); });
		getEls('#stats_details_items li, #stats_details_summary_dirs, #stats_details_summary_files')?.forEach( el => el.onmouseleave = function() { removeClass('.dirlist_item.hovered','hovered'); });
		getEls('#stats_details_items li, #stats_details_summary_dirs, #stats_details_summary_files')?.forEach( el => el.onclick = function() {									// onclick stats footer detail items
			if ( !hasClass('body','sort_by_kind') ) { clickThis('#sort_by_kind'); }																								// sort by kind
			if ( getEl('.dirlist_item'+ statsGetHoveredListClass(el)) !== null ) {
				if ( el.classList.contains('invisible') && getCurrentUIPref('show_invisibles') === 'false' )	{ clickThis('#show_invisibles'); }
				if ( el.classList.contains('ignored') && getCurrentUIPref('show_ignored_items') === 'true' )	{ clickThis('#show_ignored_items'); }
				if ( isTopWindow() ) { showThis( getEl('.dirlist_item'+ statsGetHoveredListClass(el)).id ); } else { showThis(getEl('.dirlist_item'+ statsGetHoveredListClass(el)).id,true,false); } // click first matched item
			}
		});
	}
	function initGridItemEvents() {																																	// ===> INIT GRID ITEM EVENT LISTENERS
		getEls('#content_grid .grid_item')?.forEach( el => el.onclick = function(e) { e.preventDefault(); e.stopPropagation(); showContentGridItem(el.dataset.id,el.querySelector('a').href,el.dataset.kind); }); // grid item
		getEls('#content_grid .grid_item:not(.selected)')?.forEach( el => el.onmouseenter = function()	{ addClass('#'+el.dataset.id,'hovered'); scrollThis('#directory_list','.hovered'); });
		getEls('#content_grid .grid_item:not(.selected)')?.forEach( el => el.onmouseleave = function()	{ removeClass('#'+el.dataset.id,'hovered'); });
		getEls('.dirlist_item.image,.dirlist_item.font')?.forEach( el => el.onmouseenter = function()	{
			if ( hasContent('grid') )	{ addClass('#content_grid > .grid_item[data-id="'+ el.id +'"]','hovered'); scrollThis('#content_grid','.hovered'); } });
		getEls('.dirlist_item.image,.dirlist_item.font')?.forEach( el => el.onmouseleave = function()	{
			if ( hasContent('grid') )	{ removeClass('#content_grid > .grid_item[data-id="'+ el.id +'"]','hovered'); scrollThis('#content_grid','.hovered'); } });
	}
	function initCuesheetEvents() {																																	// ===> INIT CUESHEET EVENT LISTENERS
		getEls('.cuesheet_track_list_container').forEach( el => el.onclick = function(e)				{ e.stopPropagation(); menuShow(e,el.id); el.classList.toggle('has_menu'); });	// don't focus content on click
		getEls('.cuesheet_track_list_container li')?.forEach( el => el.onclick = function(e)			{ e.stopPropagation();
			menuShow(e,el.id); cueSheetMenuUpdate(); addClass('body','focus_content'); el.closest('nav').querySelector('.cuesheet_track_list').focus(); 
		});		
			// update the menu on track click
		getEls('.cuesheet_track_list_container')?.forEach( el => el.onmouseenter = function(e)			{ menuShow(e,el.id); });											// show track list on mouseenter
		getEl('.media_player[src]')?.addEventListener("timeupdate",cueSheetMenuUpdate);																						// update cuesheet menu selected track and title
		getEl('.media_player[src]')?.addEventListener("click",cueSheetMenuUpdate);
	}
	//============================//
	// INITIALIZE IFRAME EVENT LISTENERS
	function initIframeEvents() { initSubframeEvents(); if ( isTopWindow() || window.parent !== window.top ) { return; }													// ===> INIT IFRAME EVENT LISTENERS
		document.body.onclick = function(e)																{ e.preventDefault();  focusEl('#content_iframe'); }						// focus iframe
		document.body.querySelectorAll('body,textarea,form,select,input,option,#sidebar')?.forEach( el => el.onclick = function(e) { e.stopPropagation(); messageSend('top_body','blur_top'); el.focus(); });	// focus iframe
		if ( hasClass('body','is_html') || window.location.href.includes('.php') ) {
			getEls('a')?.forEach( el => el.onclick = function(e) { iframeClick(e,'','link',el.getAttribute('href')); });													return;	// return if html; rest unneeded
		}
		document.addEventListener('mousemove',function()												{ removeClass('body','no_hover'); });										// remove no_hover class
		getEls('.dirlist_item')?.forEach( el => el.onclick = function()									{ showThis(el.id,true,false); });											// select clicked iframe dirlist item
		getEls('.dirlist_item a')?.forEach( el => el.onclick = function(e)								{ e.preventDefault(); });													// do nothing for iframe dirlist links
		getEls('.dirlist_item.dir .has_icon_before_before')?.forEach( el => el.onclick = function(e)	{ subDirOpenClose(e,el.closest('.dirlist_item').id); });					// open/close subdirs
		getEls('.dirlist_item:not(.ignored)')?.forEach( el => el.ondblclick = function(e)				{ iframeClick( e,el.id,'link',el.querySelector('a').href ); });				// dblclick open iframe dirs/files
		getEls('ul,li')?.forEach( el => el.onmousedown = function()										{ messageSend('top_body','menu_close'); });
		getEl('#open_in_sidebar a')?.addEventListener('click',function(e) { e.preventDefault(); messageSend('top_body','open_iframe_dir_in_sidebar','',window.location.href); });	// no break;
		getEl('#iframe_parent_link')?.addEventListener('click',function(e)								{ iframeClick(e,'iframe_parent_link','link',this.href); });					// iframe parent
		getEls('.toggle_UI_pref')?.forEach( el => el.onclick = function(e)								{ uiPrefToggleOnClick(e,el.id); });											// toggle UI prefs
		initStatsEvents();																																							// initialize stats events listeners
		lazyLoadImageThumbs();
		}
	function initSubframeEvents() { if ( window.parent !== window.top ) { getEl('#content_body').addEventListener('click',function(e) { e.preventDefault(); e.stopPropagation(); }); } }	// prevent events in quicklook
	function initTextEditorEvents() { let preview = getEl('#texteditor_styled_pane');																	// ===> INIT TEXT EDITOR EVENT LISTENERS
		getEls('#content_texteditor, #content_texteditor *, #texteditor_styled_pane *').forEach( el => el.onclick = function(e)	{ let el_id;									// focus texteditor on click
			e.stopPropagation(); el_id = (el.closest('#texteditor_styled_pane') !== null ? '#texteditor_styled_pane' : el.id); focusEl(el_id); if ( !isTopWindow() ) { messageSend('top_body','focus_iframe'); } 
		});
		getEls('#toolbar_buttons .toggle_UI_pref').forEach( el => el.onmouseup = function(e)			{ uiPrefToggleOnClick(e,el.id); });								// text editing UI is not in DOM on page load;
		getEl('#texteditor_toolbar').onmousedown = function(e)											{ e.preventDefault(); };										// prevent textarea from losing focus if sidebar clicked
		window.onresize = function()																	{ texteditor_ResetSplit(); };									// reset text editor split
		getEl('#text_editing_handle').ondblclick = function(e)											{ e.stopPropagation(); texteditor_ResetSplit(); };				// reset text editor split
		getEl('#text_editing_handle').onmousedown = function(e)											{ eStopPrevent(e); texteditor_ResizeSplit(); };					// resize text editor panes
		getEl('#text_editing_handle').onmouseup = function()											{ document.onmousemove = null; }								// remove onmousemove
		getEls('.checkbox_container').forEach( el => el.onclick = function(e)							{ toggleCheckBox(e,this.id); });								// toggle checkboxes (texteditor_preview, toolbar)
		getEl('#texteditor_raw_pane').oninput = function() {																			// add edited body class; if iframe, send edited message; update live markdown preview
			if ( !hasClass('body','texteditor_edited') ) { addClass('body','texteditor_edited');	if ( !isTopWindow() ) { messageSend('top_body','iframe_edited','',''); } }    MDlivePreview();
		};  messageSend('top_body','menu_close');
		getEls('.texteditor_pane').forEach( el => el.onscroll = function(e)								{ texteditor_SyncScroll(e,this.id); });
		getEls('#save_btn li').forEach( el => el.onclick = function()									{ texteditorSaveBtn(el.id); });								// save text editor content
		getEl('#clear_text').onclick = function()														{ showWarning('texteditorClear'); };							// clear text button
		preview.querySelectorAll('.checklist input').forEach( el => el.onclick = function(e)			{ e.stopPropagation(); MDliveCheckBoxes(el); });				// Live checkboxes
		preview.querySelectorAll('.table-of-contents a').forEach( el => el.onclick = function(e)		{ e.preventDefault();  MDtocClick(el.id); });					// Preview TOC click navigation
		preview.querySelectorAll('.uplink').forEach( el => el.onclick = function(e)					{ e.stopPropagation(); MDheaderClick(); });					// Click header uplinks
		initWarningEvents();
	}
	function initFontPreviewEvents() {																													// ==> INIT FONT PREVIEW_EVENTS
		getEls('#font_toolbar select,#font_toolbar textarea,#font_toolbar input').forEach( el => el.onclick = function(e)	{ e.stopPropagation(); el.focus(); });
		getEls('#font_toolbar label').forEach( el => el.onclick = function(e)							{ e.stopPropagation(); el.parentElement.querySelector('input').focus(); });	// Stop click propagation
		getEls('#content_font *').forEach( el => el.onmousedown = function(e)							{ e.stopPropagation();  focusEl(el.id); });						// Stop click propagation
		getEls('#font_toolbar select').forEach( el => el.onchange = function(e)						{ fontOptions(e,el.id,el.value,el.options[el.selectedIndex].dataset?.prop,el.options[el.selectedIndex].dataset?.value) });
		getEls('#font_toolbar textarea').forEach( el => el.onkeydown = function(e)						{ if ( /enter/.test(e.key.toLowerCase()) ) { e.preventDefault(); } });		// prevent typing return in textareas
		getEls('#font_toolbar textarea,#font_toolbar input').forEach( el => el.oninput = function(e)	{ fontOptions(e,el.id,el.value) });								// init font toolbar specimen modifications
		getEls('#font_specimen_adjustments li').forEach( el => el.ondblclick = function(e)				{ e.stopPropagation(); fontReset(el.dataset.inputid); });		// reset adjustments
		getEls('.font_glyph_item').forEach( el => el.onclick = (e) =>									{ showFontGlyph(e,el.id) });									// show font specimen glyph on click
		getEl('#font_specimen_glyph').onmousedown = (e) => { fontGlyphMove(e,'#font_specimen_glyph'); }																	// init move glyph
	}
	//============================//
	// INITIALIZE KEYDOWN EVENTS
	function eKey_BackSlash(e) {																													// "BACKSLASH" KEY
		switch(true) {
			case cmdShiftKey(e):																																				// Cmd Shift + \ : toggle split
				switch(true) {
					case isTopWindow() && hasContent('text,code,markdown'):							messageSend('iframe','texteditor_split_view');					break;	// send toggle split view message
					case getEl('#texteditor_split_view').height > 0:									getEl('#texteditor_split_view').click();						break;	// if split view visible...click toggle split
				}																																						break;
			case cmdKey(e):		if ( !isTopWindow() ) { messageSend('top_body','show_sidebar'); } else { getEl('#show_sidebar').click(); }								break;	// Cmd + \ : toggle sidebar
		}
	}
	function eKey_Enter(e) {																																						// "ENTER" KEY
		let selected_el = (hasContent('font_file') || hasContent('font_specimen') || hasContent('grid') ? getEls('#content_font .selected,#content_grid .selected')[0] : getEls('.dirlist_item.selected')[0]);
		switch(true) {
			case hasClass('body','has_menu'):															e.preventDefault(); menuClick(); menuClose(); messageSend('iframe','menu_close');	break;	// click selected menu item
			case hasClass('body','has_warning') || hasClass('body','has_help'):							e.preventDefault();	clickThis('button.focus, button:focus');						break;	// click focused warning btn
			case hasClass('body','focus_content') && hasContent('font') && selected_el !== null:		showFontGlyph(e,selected_el.id);													break;	// show font glyph
			case !isTopWindow():																																									// if iframe...
				switch(true) {
					case hasClass('body','has_top_menu'):												messageSend('top_body','menuClick');												break;	// close main menu
					case elExists('.dirlist_item.audio.selected') && !hasClass('.dirlist_item.audio.selected','audio_loaded'):
						iframeClick(e,getEl('.dirlist_item.selected').id,'dblclick',getEl('.dirlist_item.selected a').href);																break;
					case elExists('.dirlist_item.selected') && cmdKey(e):	iframeClick(e,getEl('.dirlist_item.selected').id,'dblclick',getEl('.dirlist_item.selected a').href);			break;	// webloc or url file
					case elExists('.dirlist_item.audio_loaded') && !hasClass('.dirlist_item.selected','audio_loaded'):		eStopPrevent(e); mediaPlayPause();								break;	// play/pause media
				}																																											break;
			case selected_el?.classList.contains('app') && UI_Prefs_Bool.apps_as_dirs === false:																							break;	// don't open app folders
			default:
				switch(true) {
					case selected_el?.classList.contains('.disabled'):	case hasContent('texteditor'):																	break;	// no nothing for disabled or default behavior
					case selected_el?.classList.contains('audio') && !selected_el.classList.contains('audio_loaded'):		showMedia('audio',getEl('.dirlist_item.audio.selected').id );	break;	// show selected audio file
					case selected_el?.classList.contains('media'):															eStopPrevent(e); mediaPlayPause();								break;	// else play/pause media
					case ( /dir|link|playlist/.test(selected_el?.classList) ) && cmdKey(e): dirOpen(e,getEl('.dirlist_item.selected').id,getEl('.dirlist_item.selected a').href);			break;	// open dirs, links, playlists
					case ( /dir|link/.test(selected_el?.classList) ):																																// nobreak
					default:																		e.stopPropagation();	selected_el?.click();													// default: click selected item
				}
		}
	}
	function eKey_Escape() {																																				// "ESCAPE" KEY
		if ( getAttr('#content_pane','data-loaded') !== 'loaded' ) { removeAttr('#content_pane','data-loaded'); removeAttr('#content_iframe','src'); }				// close loading iframe
		switch(true) {
			case !isTopWindow(): if ( hasClass('body','has_quicklook') ) { quickLookThis('close'); } else { messageSend('top_body','focus_top'); }							break;	// focus top from iframe content
			case document.activeElement.tagName.toLowerCase() !== 'body':	case hasClass('body','focus_content') && !hasClass('body','has_menu'):	focusEl('#top_body');	break;	// focus top from non-iframe content
			case document.activeElement.tagName.toLowerCase() === 'body':																											// if top already focussed...
				switch(true) {
					case hasClass('body','has_menu'): case hasClass('body','has_menu_stats'):							menuClose();										break;	// close menu or
					default:																/* closeContent('esc'); */	focusEl('#top_body');										// close content
				}
		}
		document.onmousemove = null;	window.getSelection().removeAllRanges();	window.stop();							// remove text selections; stop loading; cancel mousemove event watcher
		removeClass('body','has_overlay');	removeClass('.dirlist_item','dirlist_subdir_loading');
		getEls('.dirlist_item.selected,.dirlist_item.content_loaded').forEach( el => el.classList.remove('selected','content_loaded') );
		getEls('.dirlist_item.media').forEach( (el) => { if ( el.querySelector('.dirlist_item_media_duration').innerHTML === '') { setMediaDuration( el.id,el.dataset.kind,Number.NaN )} } ); // set loading durations to error
		getEls('.show_input input')?.forEach( el => el.value = ''); removeClass('.show_input','show_input');
		if ( hasClass('body','has_warning') || hasClass('body','has_help') ) { getEls('#warning_btn_cancel,#close_help').forEach( el => el.click() ); }					// close warnings or help
	}
	function eKey_Period(e) {																																			// close loading iframe
		 window.stop(); removeClass('.dirlist_item','dirlist_subdir_loading'); if ( hasClass('body','has_warning') ) {	e.preventDefault();	getEl('#warning_btn_cancel,#close_help').click(); }
		if ( getAttr('#content_pane','data-loaded') !== 'loaded' ) { closeContent('iframe'); }
	}
	function eKey_Space(e) {																																// "SPACE" KEY
		switch(true) {
			case isTopWindow():
				switch(true) {
					case hasContent(['audio','ignore']): case hasContent('video'):								e.preventDefault(); mediaPlayPause();							break;	// media play/pause
					case ( hasContent('image') || hasContent('font_specimen')) && hasContent('hidden_grid'):	e.preventDefault(); closeContent();								break;	// close grid image
					case hasContent('font_file_glyph'):  case hasContent('font_specimen_glyph'):				e.preventDefault(); closeFont();								break;	// close glyph
					case hasContent('font') && getEl('.font_glyph_item.selected') !== null:						e.preventDefault(); showFontGlyph(null,getEl('.font_glyph_item.selected').id);		break;	// show glyph
					case hasContent('grid') && getEl('.grid_item.selected') !== null:							e.preventDefault(); getEl('.grid_item.selected').click();		break;	// show grid items
				}																																								break;
			case !isTopWindow():																																		// not top window
				switch(true) {
					case hasClass('body','is_html'):	case hasClass('body','is_text'):	return;
					case elExists('.dirlist_item.audio_loaded') && !hasClass('body','has_quicklook'):	e.preventDefault(); messageSend('top_body','iframe_play_pause_media');	break;	// play/pause top media if no quicklook
					case hasClass('body','has_quicklook'):			e.preventDefault(); quickLookThis('close');																	break;	// close quicklook
					case getEl('.dirlist_item.selected') !== null:	e.preventDefault(); quickLookThis(getEl('.dirlist_item.selected').id,getData('.dirlist_item.selected','kind'));	break;	// show quicklook
				}
		}
	}
	function eKey_Tab(e) { e.preventDefault(); let incr = ( e.shiftKey === true ? 1 : -1 ); navigateByTabKey(e,incr); }										// "TAB" KEY
	function eKey_A(e) { selectMultipleItems(e); }																											// "A" KEY Select all dir items with cmd_key
	function eKey_E(e) {																																	// "E" KEY
		switch(true) {
			case hasClass('body','has_warning'):																													break;
			case cmdShiftKey(e):				eStopPrevent(e);
				if ( !isTopWindow() ) { messageSend('top_body','toggle_texteditor'); } else { getEl('#show_texteditor a').click(); }
				addClass('#top_body','focus_content');																												break;	// toggle text editor
			case cmdKey(e):	eStopPrevent(e); if ( !isTopWindow() ) { messageSend('top_body','toggle_menu'); } else { menuShow(e,'sidebar_menu_main_container'); }	break;	// toggle main menu
		}
	}
	function eKey_R(e) {																																	// "R" KEY
			switch(true) {
				case cmdKey(e) && !isTopWindow():												e.preventDefault();		messageSend('top_body','reload');	break;	// send reload message to top
				case cmdKey(e) && hasClass('#content_body','texteditor_edited'):				e.preventDefault();		showWarning('resetContent');		break;	// warn before reloading edited iframe text files from textarea
				case cmdKey(e): if ( !hasContent('audio') && !hasContent() ) { return true; } else { e.preventDefault();	showWarning('resetContent'); }		break;	// reload window if no content open else reload/reset content
			}
	}
	function eKey_W(e) {																																	// "W" KEY
		switch(true) {
			case !isTopWindow():																e.preventDefault();		messageSend('top_body','close');	break;	// send close message to top
			case hasClass('body','has_help'):																			getEl('#close_help').click();		break;	// close help
			case hasContent('audio') && hasContent('null'):																closeContent('audio');				break;	// close audio when nothing else open
			case ( /has_\w+list/.test(getClassNames('body')) && !hasContent() ):				showWarning('closeContent',['closePlaylist','false']);		break;	// close playlist
			case !hasContent('null'):															e.preventDefault();	closeContent();							break;	// close content
			default:																																		return;	// else close window (or normal behavior)
		}
	}
	getEls('#top_body, #content_body').forEach( el => el.addEventListener('keydown', (e) => { if ( window.parent !== window.top ) { return; }				// ===> MAIN KEYDOWN EVENTS (prevent keydown in quicklooked window)
		let active_el = document.activeElement, active_el_tag = active_el.tagName.toLowerCase();															// allow default: buttons, inputs, selects, textareas
		switch(true) {
			case e.key === 'Enter':
				switch(true) {
					case (/ui_font/.test(active_el.id)):								uiPrefFontSet(e);													break;
					case (/go_to_item_input/.test(active_el.id)):						goToItem(e);														break;
					default:															eKey_Enter(e,active_el);											break;	// Key = Enter/Return
				}
			case ( /button|input|select|textarea/.test(active_el_tag) && !/escape|tab|shiftkey|metakey|altkey/.test(e.key.toLowerCase())   && !( cmdKey(e) && /r|w|-|=/.test(e.key) )): return; // prevent/allow certain key combos
			case active_el.hasAttribute('contentEditable')			  && !(/escape|tab|shiftkey|metakey|altkey/.test(e.key.toLowerCase())  && !( cmdKey(e) && /r|w|-|=/.test(e.key) )):	return; // ...in certain situations.
			case e.key === 'Escape':													eKey_Escape();														break;
			case (/has_warning|has_help/.test(getClassNames('body')) && !( cmdKey(e) || (/escape|tab|shiftkey|enter/.test(e.key.toLowerCase()) ) ) ):				// nobreak
			case e.key === 'shiftKey' && ( hasClass('body','has_warning') || hasClass('body','has_help') ):		if (e.key !== 'Enter' && e.key !== 'Tab') { e.preventDefault(); return false; }		break;	// Key = Shift
			case ( /Arrow/.test(e.key) ):												arrowKeyFunctions(e,false,el);										break;	// (e,bool,selected_el.id); id for dblclick iframe item
			case e.key === ' ':															eKey_Space(e);														break;	// Key = Space
			case ( e.key && !e.metaKey && !e.altKey && !e.ctrlKey && e.key !== 'Tab' && !/Arrow/.test(e.key) ):				navigateByTypedStr(e);			break;	// alphanumeric navigation
			case e.key === 'a' && cmdKey(e):											eKey_A(e);															break;	// Cmd + a: select all
			case e.key === 'd' && cmdShiftKey(e) && !hasClass('body','has_warning'):	e.preventDefault(); getEl('#show_details').click();					break;	// Cmd/Ctrl + D: Toggle Details
			case e.key === 'e':															eKey_E(e);															break;	// Cmd/Ctrl + E: Toggle Main Menu or Text Editor
			case e.key === 'g' && cmdKey(e) && ( hasClass('#top_body','has_images') || hasClass('#top_body','has_fonts') ):	e.preventDefault(); getEl('#show_grid_btn').click();	break;	// Show grids
			case e.key === 'i' && cmdShiftKey(e):	if ( !isTopWindow() ) { messageSend('top_body','toggle_invisibles'); } else { getEl('#show_invisibles_container input').click(); }	break;	// Toggle invisibles
			case e.key === 'j' && cmdShiftKey(e):										goToItem(e);														break;
			case e.key === 'o' && cmdShiftKey(e):										window.open( getAttr('.dirlist_item.selected a','href') );			break;	// Cmd+Shift+O: Open in new window
			case e.key === 'r':															eKey_R(e);															break;	// Cmd/Ctrl + Shift + R: Refresh
			case e.code === 'KeyW' && cmdAltKey(e):										eKey_W(e);															break;	// KEY = W && Cmd/Ctrl: close content
			case e.key === '=' && cmdKey(e) && hasContent('grid,image,font,glyph'):	e.preventDefault();	contentHeaderButtons(e,'increase');					break;	// Cmd/Ctrl + equals: scale larger
			case e.key === '-' && cmdKey(e) && hasContent('grid,image,font,glyph'):	e.preventDefault(); contentHeaderButtons(e,'decrease');					break;	// Cmd/Ctrl + hyphen: scale smaller
			case e.key === '\\':														eKey_BackSlash(e);													break;	// KEY = \ BACKSLASH
			case e.key === 'Tab':														eKey_Tab(e);														break;	// KEY = TAB
			case e.key === '.' && cmdKey(e):											eKey_Period(e);														break;	// click cancel button
		}
	}) );
	// ***** END EVENT LISTENER INITIALIZATION
	//============================//
	function menuShow(e,id) {																																					// ===> SHOW MENUS
		if ( e !== null ) { e.stopPropagation(); }
		if ( /sidebar_menu/.test(id) && /has_menu/.test(getClassNames('body')) ) { menuClose(); return; }																					// close menu on click if open
		removeClass('body','has_top_menu has_menu has_menu_parents has_menu_stats is_blurred,show_sidebar_false');	removeClass('#sidebar_menu_main *','selected hovered show_input');		// remove classes
		let el, menu_el = getEl('#'+id), menu_el_classlist = menu_el.classList, time, position = getEl('#sidebar_header_utilities_row_1').offsetTop - 1 + 'px', track, media_el;
		switch(true) {
			case id === 'sidebar_menu_main_container':	setStyle('#'+ id +' > ul','top',position);				addClass('#top_body','has_menu');								break;	// show main menu
			case id === 'sidebar_menu_parents':			setStyle('#'+ id +' > ul','top',position);				addClass('body','has_menu_parents');							break;	// show sidebar_menu_parents
			case id === 'stats_summary':			setStyle('#stats_details_items','height',getEl('#stats_container').height - getEl('#stats_details_summary').height - 4);			// show stats menu
				addClass('body','has_menu_stats');									break;	// update durations, set classes
			case menu_el_classlist.contains('has_submenu'):				removeClass('li.has_submenu','selected hovered'); menu_el.classList.toggle('selected');					break;	// toggle open submenu
			case ( /about_link|donate_link|contact_link/.test(id) ):	changeLocation([menu_el.href,'external']);																break;	// open external menu links
			case ( /cuesheet_track_list_container/.test(id) ):																															// show cue_sheet track menu
				el = getEl('#'+id);
				if ( el.id === 'cuesheet_track_list_container_video' ) { getEl('#cuesheet_track_list_video').style.top = getEl('#content_title_container').clientHeight; }
				el.querySelector('.cuesheet_track_list').style.height = getEl('#content_container').height + getEl('#content_title_container').height;									// set height of cue sheet track list
				setStyle('#'+id+' > div','top',el.offsetTop + el.clientHeight - 5 +'px');																						break;	// set y position of cuesheet track list
			case id.startsWith('cuesheet_item_'):																																		// click cuesheet track list items
				switch(true) {
					case menu_el.classList.contains('selected'): mediaPlayPause();																								break; // play/pause if already selected
					default: track = getEl('#'+id);																																// otherwise select new cuesheet track list item
						media_el = track.closest('nav').id.split('_').reverse()[0]; time = track.dataset.position;								// get the media type from the cuesheet menu nav; get position from track dataset
						addRemoveClassSiblings('#'+ id,'selected');						
						if ( time < getEl('#content_'+media_el).duration ) { getEl('#content_'+media_el).currentTime = time; }													//
						setCueSheetTrackTitle(id,media_el);																														// set cuesheet track title
					}
		}
	}
	function menuClick() { getEl('#sidebar_menu_main .selected:not(.hovered)')?.querySelectorAll('a,span,label')[0]?.click(); if ( hasClass('body','focus_content') ) { messageSend('iframe','menu_close'); } }	// ===> CLICK MENU
	function menuClose() { removeClass('body,.cuesheet_track_list_container','has_top_menu has_menu has_menu_parents has_menu_stats is_blurred'); removeClass('#sidebar_menu_main *','selected hovered show_input'); } // ==> CLOSE MENUS
	function statsGetHoveredListClass(el) { let this_class = '.'+ (el?.dataset?.kind?.split(', '));																						// ===> GET HOVERED STATS CLASS
		switch(true) {
			case el.id === 'stats_details_summary_dirs':			this_class = '.dir';											break;
			case el.id === 'stats_details_summary_files':			this_class = '.file';											break;
			case this_class === '.dir':								this_class = '.dir:not(.ignored):not(.invisible):not(.app)';	break;
			case this_class === '.dir.app':							this_class = '.dir.app:not(.ignored):not(.invisible)';			break;
		}																															return this_class;
	}
	//============================//
	// DIRLIST CLICK AND SELECT FUNCTIONS
	function clickDirListItem(e,id) { e.preventDefault(); let el = getEl('#'+ id), src = el.querySelector('a').href;											// ===> CLICK DIR LIST ITEM
		switch(true) {
			case window.parent !== window.top:																														return;
			case ( !/rowid/.test(id) ):																																break;	// null if not a dirlist item
			case e.metaKey && /'app|dir|font|image/.test(el.dataset.kind):					selectMultipleItems(e,id);												break;	// select multiple items on click
			case e.shiftKey && /'app|dir|font|image/.test(el.dataset.kind):					selectMultipleItems(e,id);												break;	// select multiple items on click
			case !isTopWindow():				e.stopPropagation();	showThis(id,true,true);																				// iframe dirlist items
												if ( hasClass('#'+id,'audio_loaded') )	{ messageSend('top_body','iframe_play_pause_media'); }						break;	// play/pause iframe audio onclick
			case hasClass('#'+id,'audio'):	if ( hasClass('#'+id,'audio_loaded') )		{ mediaPlayPause(); removeClass('.dirlist_item.selected','selected'); addClass('#'+id,'selected'); return } // else...showThis:
																						  showThis(id,true,true);													break;
			case hasClass('#'+id,'video'):	if ( /youtube.com|youtu.be/.test(src) )	{ showThis(id); return; }
											if ( hasClass('#'+id,'content_loaded') )	{ mediaPlayPause(); } else { showWarning( 'showThis',[id] ); }				break;	// ''    ''
			default:
				switch(true) {
					case hasClass('body','texteditor_edited') || ( /has_\w+list/.test(getClassNames('#top_body') ) ):		showThis(id);							break;	// if top edited, show item (i.e.hide text editor)
					case hasClass('body','iframe_edited'):									messageSend('iframe','unloading','',['showThis',id]);					break;	// if iframe edited, show warning
					default:																showWarning( 'showThis',[id] );													// default: show content with warning
				}
		}
	}
	function iframeClickLink(e,id,link) { let url, kind;																					// ===> IFRAME CLICK LINKS from html files
        if ( !link.startsWith('#') ) { url = newURL(link); if ( e !== null ) { e.preventDefault(); } }												// if link is not a link fragment, create url, prevent default
		switch(true) {
			case link.startsWith('#'):	
				( document.getElementById(link.slice(1))?.scrollIntoView({ behavior:'smooth', block:'start', inline:'nearest' }) 
				|| document.querySelector('[name="'+ link.slice(1) +'"]')?.scrollIntoView({ behavior:'smooth', block:'start', inline:'nearest' }) );  break;	// allow default link fragment behavior
			case url.href.startsWith('file:///?'):	case url === undefined:																	break;
			case id === 'tbody':		window.location = link + '?&show_directory_source=true';											break;	//
			case id === 'iframe_parent_link': messageSend('top_body','show_iframe_parent','',[getEl('#iframe_parent_link').href,'dir','iframe_parent']);	break; // send message "show_iframe_parent"
			case url.protocol === 'file:' && window.location.protocol !== 'file:':	messageSend('top_body','local_link');					break;	// show warning when attempting to open local links from non-local pages
			case url.protocol !== 'file:' && window.location.protocol === 'file:':	window.open(link,'_blank');								break;	// open remote link from local page in new tab/window
			case url.protocol === 'file:' && window.location.protocol === 'file:':																	// nobreak; open local links to local files in iframe
			case url.protocol === 'about:':																											// nobreak; document #link fragments
			case RegExp(url.hostname).test(window.location.hostname):																				// nobreak; same origin links (might not include TLD) (just covering bases)
			case RegExp(window.location.hostname).test(url.hostname):																				// no break; same origin links (might not include TLD) (just covering bases)
				kind = getLinkInfo(url.href)[3];
				if ( /dir|app/.test(kind) ) { messageSend('top_body','show_iframe_dir','',[url.href,kind,id] ); } else { messageSend('top_body','show_iframe_file','',[url.href,kind,id] ); }	break;
			default: window.open(link,'_blank');																							break;	// else open external document links in new tab
		}
	}
	function iframedblClickThis(e,id,link) { e.stopPropagation();																				// ===> IFRAME DOUBLECLICK THIS iframe dir_list items (files and dirs)
		if ( /_/.test(id) ) { id = id.split('_')[0]; }	// temp: if double-clicking a subdir item, id === top parent item id; we'd like to send full subdir item id so that it can be reopened when the subdir item is closed.
		let el = getEl('#'+id);
		let kind = el.dataset.kind, message = ( /dir|app/.test(kind) ? 'show_iframe_dir' : 'show_iframe_file' );								// get item kind
		if ( kind === 'audio' ) { removeClass('.dirlist_item.audio','audio_loaded selected'); el.classList.add('audio_loaded','selected'); }	// iframe audio
		messageSend('top_body',message,'',[link,kind,id]);																												// send message
	}
	function iframeClick(e,id,kind,link) { e.preventDefault();
		switch(true) {
			case window.parent !== window.top:								e.stopPropagation();				return;
			case kind === 'dblclick':		case e.type === 'dblclick':		iframedblClickThis(e,id,link);		break;
			case kind === 'dirlist_item':									clickDirListItem(e,id);				break;
			case kind === 'link':											iframeClickLink(e,id,link);			break;
		}
	}
	//============================//
	// ===> CLICK TOGGLE UI PREF ELEMENTS
	function uiPrefToggleOnClick(e,id) { e.stopPropagation(); e.stopImmediatePropagation(); showWarning('uiPrefToggle',getEl('#'+id).getAttribute('data-ui_pref') ); }
	function uiPrefToggle(pref_id) {																										// ===> TOGGLE UI PREFS: and update searchParams
		let settings_value = [pref_id,UI_Settings[pref_id]].join('_'), current_value = getCurrentUIPref(pref_id), new_value = getNewUIPref(pref_id);
		let message_target = ( isTopWindow() ? 'iframe' : 'top_body' ), send = 'false';
		if ( /button|label|select|input/.test( document.activeElement.tagName.toLowerCase() ) ) {  document.activeElement.blur(); }	// blur any focused form elements
		switch(true) {
			case pref_id === 'audio_player_on_top':																	audioPlayerPositionToggle();							break;
			case pref_id === 'show_image_thumbnails':																uiPrefImgThumbsToggle(new_value[1]);	send = 'true';	break;
			case pref_id === 'show_media_name_in_window_title':														toggleMediaNameInWindowTitle('toggle');					break;	// nobreak;														
			case ( /texteditor_|text_editing/.test(pref_id) ):														textEditorTogglePrefs(pref_id);			send = 'true';	break;	// Text Editor Preferences
			case !hasClass('#content_body','show_details_false') && pref_id === 'show_details' && !isTopWindow():																	// nobreak; hide iframe details on first toggle
			case new_value[1] === 'false':									addClass('body',pref_id +'_false');	searchParamSet(pref_id,'false');			send = 'true';	break;
			case new_value[1] === 'true':	case current_value === 'false':	removeClass('body',pref_id +'_false');	searchParamDelete(pref_id);				send = 'true';	break;
			case ( /sort_by_/.test(pref_id) ):																		uiPrefSortToggle(pref_id);								break;	// toggle sorting
			case ( /theme|theme_light|theme_dark/.test(pref_id) ):													uiPrefThemeToggle(new_value);							break;	// toggle light/dark theme
			case new_value.length > 1 && settings_value === new_value.join('_'):																									// nobreak; new value === settings value
			default:																																								// other non-booleans
				searchParamSet( getNewUIPref(pref_id)[0],new_value.join('_') );																										// set searchParam
				removeClass('body',[pref_id,current_value].join('_'));	addClass('body',new_value.join('_'));																		// remove old bodyclass; add new bodyclass
				send = 'true';
		}
		if ( send === 'true' && isTopWindow() && !/show_details|show_sidebar/.test(pref_id) ) { messageSend(message_target,'uiPrefToggle','',pref_id); }							// send message to iframe
		if ( /show_invisibles|show_ignored_items/.test(pref_id) ) { updateStats(); }																								// update stats if necessary
	}
	function uiPrefsReset(e) { eStopPrevent(e);																											// ===> DEFAULT SETTINGS: remove queries;
		if ( window.confirm( 'Are you sure you want to remove all your temporary UI settings from the URL query string?' ) ) {
			removeClass('body','has_menu');
			let query_str = '',selected_str = '',history_str = '';
			if ( getCurrentUIPref('selected').length && getCurrentUIPref('selected').match(/[0-9\+]+?/) )	{ selected_str += 'selected='+ getCurrentUIPref('selected'); }
			if ( getCurrentUIPref('history').length && getCurrentUIPref('history').match(/[0-9\+]+?/) )		{ history_str += 'history='+ getCurrentUIPref('history'); }
			query_str = history_str +'&'+ selected_str;
			if ( query_str.length > 1 ) { query_str = '?'+ query_str.replace(/\s/g,'+'); }
			window.location.assign(window_location + query_str);
		}
	}
	//============================//
	function uiPrefThemeToggle(new_value) { let iframe_src = getEl('#content_iframe').src;												// ===> TOGGLE UI PREF THEME
		new_value = new_value.join('_');																										// "theme_[light|dark]"
		removeClass('body','theme_dark theme_light'); addClass('body',new_value);																// set top level theme classes
		if ( new_value === 'theme_light' )	{ searchParamDelete( 'theme' ); } else { searchParamSet( 'theme','dark' ); }						// set top level theme search param
		switch( isTopWindow() ) { 
			case getContentPaneData() === 'has_htm':
				switch(true) {
					case new_value === 'theme_light': iframe_src = iframe_src.replace(/\?theme=dark/,'');	break;
					case new_value !== 'theme_light' && !/\\?theme=dark/.test(iframe_src): iframe_src = iframe_src+'?theme=dark';
				}
				getEl('#content_iframe').src = iframe_src; 						break;
			case getEl('#content_iframe').src.startsWith("data:text/html;"):																	// toggle iframe data src
				let src = getEl('#content_iframe').src; src = src.replace(/texteditor_view_styled.20theme_[^%]+?.20/,'texteditor_view_styled%20'+new_value+'%20'); getEl('#content_iframe').src = src;	break;
			default:				messageSend('iframe','uiPrefToggle','',new_value);															// else default iframe toggle: send message to iframe
		}
	}
	function uiPrefFontSet(e) { eStopPrevent(e); let value;																				// ===> SET UI FONT
		switch(true) {
			case e?.type === 'click':	getEl('#ui_font input').value = getCurrentUIPref('ui_font'); addClass('#ui_font','show_input');	getEl('#ui_font input').focus();		break;	// show input & current ui font on click
			case e?.key === 'Enter':	value = getEl('#ui_font input').value;																											// get the entered ui font
				if ( value !== '' ) { document.body.style.fontFamily = value; searchParamSet('ui_font',value); } else { document.body.style.fontFamily = null; searchParamDelete('ui_font'); }
				messageSend('iframe','set_ui_font','',value);
				removeClass('#ui_font','show_input'); menuClose();																												break;	// set the font; close menu
			default:	if ( UI_Prefs_Non_Bool.ui_font !== getCurrentUIPref('ui_font') ) { document.body.style.fontFamily = getCurrentUIPref('ui_font'); }								// set the ui font on page load
		}
	}
	function uiPrefScaleSet(e,value,bool) { // bool === true --> from buildUI																					// ===> SET UI SCALE
		if ( e !== null ) { e.stopPropagation(); }
		switch(true) {
			case Math.round(value) === 100:	document.body.style.removeProperty('transform'); document.body.style.removeProperty('width'); document.body.style.removeProperty('height');	// remove body styles
				setData('#ui_scale .menu_item','value','100%'); getEl('#ui_scale_input').value = 100;																					// reset input
				searchParamDelete('ui_scale');																																break;		// delete the searchParam
			default:
				document.body.style.transform = 'scale('+value+'%)'; document.body.style.width = Math.round(10000/Number(value))+'%'; document.body.style.height = Math.round(10000/Number(value))+'%';	// add body styles
				searchParamSet('ui_scale',Math.round(value));																															// set the searchParam
		}
		if ( Number(value) < 100 ) { document.documentElement.style.width = Math.round(10000/Number(value))+'%'; } else { document.documentElement.style.removeProperty('width'); }		// scale the html element if value < 1
		if ( bool === true ) { setData('#ui_scale .menu_item','value',value+'%'); getEl('#ui_scale_input').value = value; }																// set the input on load
	}
	function uiPrefImgThumbsToggle(bool) {																									// ===> TOGGLE UI PREF IMG THUMBS
		let image_files = getEls('.dirlist_item.image'), current_background_image, max_count = 2000;												// Add/remove image thumbnails as background icons
		switch(true) {
			case bool === 'false':	addClass('body','show_image_thumbnails_false');	searchParamSet('show_image_thumbnails','false');				break;
			default:				removeClass('body','show_image_thumbnails_false');  searchParamDelete('show_image_thumbnails');  
		}
		image_files.forEach( (image ) => {
			current_background_image = image.querySelector('a .has_icon_before_before').style.backgroundImage;										// get the current background_image, save for future toggle
			switch(true) {																															// toggle thumbnail display
				case bool === 'false':																												// show default icon, don't remove existing thumbnail
					image.querySelector('a .has_icon_before_before').style.backgroundImage = get_SVG_UI_File_Icon('file_icon_image') +','+ current_background_image;	// only first background image is visible
					break;
				default:																															// remove default image icon or load image thumbnail
					image.querySelector('a .has_icon_before_before').dataset.image_url		= 'url("'+ image.querySelector('a').href +'")';  lazyLoadImageThumbs();
			}
		});
	}
	function lazyLoadImageThumbs() {
		if ( getCurrentUIPref('show_image_thumbnails') === 'false' ) { return }
		const handleIntersection = (entries) => {
			entries.map((entry) => {
				if ( entry.isIntersecting ) { entry.target.style.backgroundImage = entry.target.dataset.image_url; observer.unobserve(entry.target); }
			});
		}
		const observer = new IntersectionObserver( handleIntersection,{ rootMargin: "100px" });
		const thumbs = document.querySelectorAll('.dirlist_item.image a .has_icon_before_before');
		thumbs.forEach(thumb => observer.observe(thumb));
	}
	function uiPrefSortToggle(pref_id) {																									// ===> TOGGLE UI SORT PREF
		let current_sort_by =		 getCurrentUIPref('sort_by'),			new_sort_by = pref_id.split('_').reverse()[0];
		let current_sort_direction = getCurrentUIPref('sort_direction'),	new_sort_direction = ( new_sort_by !== current_sort_by ? 'ascending' : getNewUIPref('sort_direction_'+ current_sort_direction)[1] );
		switch(true) {																																	// toggle sort_by
			case new_sort_by !== current_sort_by:	new_sort_by === 'default' ? searchParamDelete('sort_by') : searchParamSet('sort_by',new_sort_by);	break;
			case new_sort_by === current_sort_by:																										break;
		}
		switch(true) {																																	// toggle sort_direction
			case new_sort_by !== current_sort_by:																										// nobreak
			case current_sort_direction === 'descending':	searchParamDelete('sort_direction');				break;									// delete search_param if new sort is ascending (default)
			case current_sort_direction === 'ascending':	searchParamSet('sort_direction','descending');		break;									// add descending search_param
		}
		removeClass('body','has_menu sort_by_name sort_by_default sort_by_duration sort_by_size sort_by_date sort_by_kind sort_by_ext sort_direction_ascending sort_direction_descending'); // remove all sorting body classes
		addClass('body',pref_id,'sort_direction_'+ new_sort_direction);
		subDirClose();																																	// close subdirs
		// RE-SORT DIRECTORY ITEMS:
		let has_dir = false, sorted, iframe_src, iframe_url, iframe_params, items_html_arr = [];
		if ( isTopWindow() && hasContent('dir') ) { has_dir = true; iframe_src = getEl('#content_iframe').src; }
		Array.from(getEls('.dirlist_item')).forEach(el => items_html_arr.push(el.outerHTML.replace(/border_bottom |border_top /g,'')));			// get elements for new sort
		sorted = sortDirListItems( Array.from(items_html_arr), pref_id, new_sort_direction );													// sort the items
		getEl('#directory_list').innerHTML = sorted;																							// insert sorted items into dir_list
		initDirListEvents();		initIframeEvents();																							// re-initialize dir_list event listeners
		switch(true) {
			case hasContent('font_grid'):											showGrid('show_font_grid');							break;	// sort grids --> change this to actual sort, not reload
			case hasContent('image_grid'):											showGrid('show_image_grid');						break;	// sort grids --> change this to actual sort, not reload
			case hasContent('grid'):												showGrid('show_grid');								break;	// sort grids --> change this to actual sort, not reload
			case has_dir === true:																												// re-sort iframe directory
				 if ( elExists('.dirlist_item.selected') ) { showThis(getEl('.dirlist_item.selected').id); }									// show the selected directory
				 iframe_url = new URL(iframe_src);																								// create url obj
				 iframe_params = new URLSearchParams(iframe_url.search)																			// create url search params
				 iframe_params.set('sort_by',pref_id.slice(pref_id.lastIndexOf('_') + 1));														// set sort_by
				 iframe_params.set('sort_direction',new_sort_direction);																		// set sort_direction params
				 iframe_url.search = iframe_params.toString();																					// update url search params
				 getEl('#content_iframe').src = iframe_url.href;																		break;	// reload the iframe with new src url
			case elExists('.dirlist_item.selected:not(.audio)'): showThis(getEl('.dirlist_item.selected').id);							break;	// after sort, show selected item; don't autoloadcoverart
		}
	}
	function audioPlayerPositionToggle(option) {
		switch(true) {
			case option === 'reset':								getEl('#content_container').style.paddingBottom = Number(getEl('#audio_wrapper').offsetHeight) +'px';												break;
			case hasClass('body','audio_player_on_top_false'):		getEl('#content_container').style.paddingBottom = 0;  searchParamDelete('audio_player_on_top');	removeClass('body','audio_player_on_top_false');	break;
			default: addClass('body','audio_player_on_top_false');	getEl('#content_container').style.paddingBottom = Number(getEl('#audio_wrapper').offsetHeight) +'px';	searchParamSet('audio_player_on_top','false');
		}
	}
	function textEditorTogglePrefs(pref_id,bool) {	let args = [];																		// ===> TOGGLE TEXT EDITOR PREFERENCES (from menus or toolbar buttons); bool from UIsetup
		switch(true) {
			case ( /text_editing_enable/.test(pref_id) ):																													// toggle text editing
				bool = ( hasClass('body','text_editing_enable_false') ? 'true' : 'false' )
				switch(true) {
					case bool === 'false':
								addClass('body','text_editing_enable_false');		searchParamSet('text_editing_enable','false');	setAttr('#content_body #texteditor_raw_pane','readonly','');				// set readonly
								removeClass('body','texteditor_split_view_true');	addClass('body','texteditor_split_view_false');																		break;
					default:	removeClass('body','text_editing_enable_false texteditor_split_view_false texteditor_split_view_true texteditor_sync_scroll_false texteditor_sync_scroll_true');
								searchParamDelete('text_editing_enable');			removeAttr('#content_body #texteditor_raw_pane','readonly');				// remove readonly
								textEditorTogglePrefs('texteditor_split_view', ( getCurrentUIPref('texteditor_split_view')	!== undefined ? getCurrentUIPref('texteditor_split_view') : 'true' ) );
								textEditorTogglePrefs('texteditor_sync_scroll',( getCurrentUIPref('texteditor_sync_scroll') !== undefined ? getCurrentUIPref('texteditor_sync_scroll') : 'true' ) );	break;
				}
				if ( isTopWindow() ) { messageSend('iframe','uiPrefToggle','','text_editing_enable'); }																								break;
			case ( /texteditor_view_raw|texteditor_view_styled|texteditor_view_html/.test(pref_id) ):																		// toggle texteditor_preview & html panes
				args = ['texteditor_view',pref_id.split('_').reverse()[0]]; bool = ( hasClass('body',pref_id) ? 'true' : 'false' );											// set args
				removeClass('body','texteditor_view_raw texteditor_view_styled texteditor_view_html');	addClass('body',pref_id);
				if ( bool === 'true' && hasClass('body',pref_id) ) { textEditorTogglePrefs('texteditor_split_view'); }														// toggle split if same view clicked
				break;	// add pref_id body_class
			case ( /texteditor_split_view/.test(pref_id) ):
				bool = ( /true|false/.test(bool) ? bool : ( hasClass('body','texteditor_split_view_true') || hasClass('body','text_editing_enable_false') ) ? 'false' : 'true' );	// set bool
				args = ['texteditor_split_view',bool];		addClass('body','texteditor_split_view_'+ bool);	searchParamSet('texteditor_split_view');					// set args, add body_class, set search param
				switch(true) {
					case bool === 'true':	removeClass('body','texteditor_split_view_false');	if ( getCurrentUIPref('texteditor_view') === 'raw') { addClass('body','texteditor_view_styled'); }		break;
					case bool === 'false':	removeClass('body','texteditor_split_view_true');	focusEl('#texteditor_raw_pane');									break;
				}																																					break;
			case ( /texteditor_sync_scroll/.test(pref_id) ):																												// sync_scroll
				bool = ( /true|false/.test(bool) ? bool : getCurrentUIPref('texteditor_sync_scroll') === 'true' ? 'false' : 'true' );	args = ['texteditor_sync_scroll',bool];	// set bool and args
				searchParamSet('texteditor_sync_scroll',bool);																												// set search param
				if ( bool === 'false' ) { getEl('#texteditor_sync_scroll input').checked = false; } else { getEl('#texteditor_sync_scroll input').checked = true; }	break;
		}
		if ( !isTopWindow() ) { messageSend('top_body','searchParamSet','',args); messageSend('top_body','menu_close'); }													// send messages to top: set search param, close menu
	}
	//============================//
	function resizeSidebar(e) {	e.preventDefault();																											// ===> RESIZE SIDEBAR/Content Pane
		menuClose();
		let sidebar = getEl('#sidebar'), startX = e.pageX, window_width = window.innerWidth, sidebar_width = sidebar.offsetWidth;
		addClass('body','has_overlay');																																// prevent interference from the rest of ui
		document.onmousemove = (f) => { f.stopPropagation(); f.preventDefault(); let deltaX = f.pageX - startX;
			if ( f.pageX > 230 && f.pageX < window_width - 200 ) { sidebar.style.width = ( sidebar_width + deltaX ) + 'px'; }
			scrollThis('#directory_list','.selected',false);																										// true = instant scroll
			if ( hasClass('body','audio_player_on_top_false') ) { audioPlayerPositionToggle('reset'); }
		};
		document.onmouseup = (e) => { e.stopPropagation(); removeClass('body','has_overlay');	document.onmousemove = null;	searchParamSet('width',sidebar.offsetWidth); };
	}
	//============================//
	// ***** SORTING ***** //
	function sortAddBorders(sorted) { let item_kinds;																						// ===> ADD SORTING BORDERS
		for ( let i = 0; i < sorted.length - 1; i++ ) {
			item_kinds = sorted[i].match(/data-kind=\"\w+?\" /)[0];
			if ( sorted[i + 1].indexOf(item_kinds) === -1 ) { sorted[i] = sorted[i].replace(/class=\"/,'class="border_bottom '); }					// add border class
		}
		return sorted;
	}
	function sortItems(items_html_arr,sort_type,sort_direction) { let sort_id = sort_type.split('_').reverse()[0];									// ===> SORT INDEX ITEMS
		const new_sort = new Intl.Collator( navigator.language, { numeric: true, sensitivity: 'base' } );
		  let sorted = [], aName, bName, aData, bData;																										// aLevel, bLevel, aKind, bKind;
			  sorted = items_html_arr.sort( (a, b) => {																										// sorted items
				// aLevel = a.dataset.level;										bLevel = b.dataset.level; // subdirectory level
				if ( !/data-name/.test(a) || !/data-name/.test(b) ) { null; } else { aName = a.replace(/(.+?)data-name="([^"]+?)"(.+)/g,'$2');	bName = b.replace(/(.+?)data-name="([^"]+?)"(.+)/g,'$2'); }// get data-name
				switch(true) {																																// aData, bData = size, date, kind, ext, time
					case !( new RegExp('data-'+ sort_id) ).test(a) || !( new RegExp('data-'+ sort_id) ).test(b):	break;
					default:	aData = a.replace( ( new RegExp( '.+?data-'+ sort_id +'="([^"]+?)".+') ),'$1' );	bData = b.replace( ( new RegExp( '.+?data-'+ sort_id +'="([^"]+?)".+') ),'$1' );
				}
				switch(true) {																																// sort 'em!
					case sort_direction === 'ascending':		return ( new_sort.compare(aData, bData) === 0 ? new_sort.compare(aName, bName) : new_sort.compare(aData, bData) );	// A-Z
					case sort_direction === 'descending':		return ( new_sort.compare(bData, aData) === 0 ? new_sort.compare(bName, aName) : new_sort.compare(bData, aData) );	// Z-A
				}
			});
			return sorted;																																	// return sorted items
	}
	function sortDirListItems(items_html_arr, sort_type, sort_direction) {																			// ===> SORT DIR LIST on click
		let  sorted = [], sort_all = items_html_arr, sort_dirs = items_html_arr.filter( item => ( /data-kind=\"dir\"/.test(item) ) ), sort_files = items_html_arr.filter( item => ( !/data-kind=\"dir\"/.test(item) ) );
		switch(true) {
			case ( /sort_by_size|sort_by_date/.test(sort_type) ) && ( /has_\w+list/.test(getClassNames('#top_body')) ):	return items_html_arr.join('\n');	// don't sort playlists by size/date
			case sort_type === 'sort_by_default':																											// if sort default
				const sorted_dirs = sortItems( sort_dirs, sort_type, sort_direction ), sorted_files = sortItems( sort_files, sort_type, sort_direction );	// ...sort dirs and files separately
				switch(true) {
					case sort_direction === 'ascending':																									// if sort ascending...
						if ( sorted_files[0] !== undefined && sorted_dirs[0] !== undefined && !/sort_by_name|sort_by_kind|sort_by_ext/.test(sort_type) ) {
							sorted_files[0] = sorted_files[0].replace(/class=\"/,'class="border_top ');														// add border class
						}
						sorted = [...sorted_dirs,...sorted_files];																							//	sorted = sorted_dirs.concat(sorted_files); // ...dirs before files
						break;
					case sort_direction === 'descending':																									// sort descending...
						if ( sorted_dirs[0] !== undefined && !/sort_by_name|sort_by_kind|sort_by_ext/.test(sort_type) ) { 
							sorted_dirs[sorted_dirs.length - 1] = sorted_dirs[sorted_dirs.length - 1].replace(/class=\"/,'class="border_top ');				// add border class
						}
						sorted = [...sorted_dirs,...sorted_files];																							// ...else files before dirs
				}
				break;
			default:	sorted = sortItems( sort_all, sort_type, sort_direction );																			// other sorts (name, size, date): files and dirs together
			}
		if ( /sort_by_kind|sort_by_ext/.test(sort_type) ) { sorted = sortAddBorders(sorted); }																// add borders for sort by kind and ext
		return sorted.join('\n');
	}
	// ***** END BASIC UI FUNCTIONS ***** //
	//============================//
	// ***** CONTENT PANE ***** //
	//============================//
	function contentHeaderButtons(e,id) { eStopPrevent(e);	let incr;																										// ===> CONTENT HEADER BUTTONS
		switch(true) {
			case ( /prev|next/.test(id) ):																																			// PREV/NEXT item or audio track
				let key = ( /prev_btn|prev_track/.test(id) ? 'ArrowLeft' : /next_btn|next_track/.test(id) ? 'ArrowRight' : null );													// define arrowkey
				if ( hasClass('body','focus_content') ) { focusEl('#content_pane'); } else { getEl('#'+id).parentElement.blur(); }
				navigateGetEl([key,false]);																																	break;	// get the next item
			case ( /increase|decrease/.test(id) ):	incr = ( hasContent('font_file') ? 1.0625 : 1.125 ); scaleItems(e,incr,id,getContentPaneData());						break;	// SCALE BUTTONS; set scaling increment
		}
	}
	// ===> SHOW INDIVIDUAL CONTENT TYPES
	//============================// MEDIA
	function showMedia(kind,id,src,file_name,bool) { let title = ''; 
		removeAttr('#content_audio_container,#content_video','data-track_title'); 
		getEl('.media_player[src]')?.removeEventListener('timeupdate',cueSheetMenuUpdate);	getEl('.media_player[src]')?.removeEventListener("click",cueSheetMenuUpdate); // remove cuesheet attrs and event listener
		switch(kind) {
			case 'audio':
				showMedia('close_video');     removeClass('#content_pane','has_audio_error');
				switch(true) {
					case id === 'content_iframe_file':																										// clicked iframe audio files
						src = decodeURIComponentSafe(src); title = src.slice(src.lastIndexOf('/') + 1);
						addClass('#content_pane','has_audio has_iframe_audio'); setAttr('#content_iframe_utility','src',src.slice(0,-4));			break;
					default:																																// dir_list audio files
						switch(true) {
							case hasClass('#'+ id,'local'):																							break;
							case bool === 'true':														// bool !== undefined: if from autoLoadItems, just select file (don't add .audio_loaded class)
								if ( getEl('.dir.content_loaded') !== undefined ) { addRemoveClassSiblings('.dir.content_loaded','selected'); }			// select dir.selected instead of media
								addClass('#'+ id,'selected');																						break;
							default: addRemoveClassSiblings('#'+ id,'audio_loaded selected');																// otherwise select loaded media
						}
						title = getEl('#'+id).querySelector('a').innerText; addClass('#content_pane','has_audio'); removeClass('#content_pane','has_iframe_audio'); src = getEl('#'+id).querySelector('a').getAttribute('href');
						cuesheetGet(id,src,'audio');																										// get cuesheet
				}
				if ( hasClass('body','audio_player_on_top_false') ) { audioPlayerPositionToggle('reset'); }									
				if ( hasClass('body','has_quicklook') ) { closeContent(); }
				autoLoadCoverArt(bool,id);			setAttr('#content_audio','src', src ); setAttr('#content_audio','data-src_id', id );
				getEl('#content_audio_title span').innerText = title;		removeClass('#content_audio_playlist_item','has_content');													break;
			case 'close_audio':																															// CLOSE AUDIO; pause media; needed in each case, not outside switch
				getEl('#content_audio_title span').innerHTML = '';			removeAttr('#content_audio','data-src_id');						removeAttr('#content_container','style');
				removeClass('body','is_playing is_paused');					removeClass('.dirlist_item.audio_loaded','audio_loaded');		removeClass('#content_pane','has_audio has_iframe_audio has_audio_error');
				removeClass('#content_audio_playlist_item','has_content');	messageSend('iframe','close_iframe_audio');						mediaPlayPause('close'); 
				document.title = 'Index of: '+ decodeURIComponentSafe(window.location.pathname);																						break;
			case 'video':													setAttr('#content_video','data-src_id', id );								// SHOW VIDEO
				showMedia('close_audio'); cuesheetGet(id,src,'video');		setData('#content_pane','content','has_video');					addClass('#content_video','has_content');	break;
			case 'close_video':																															// CLOSE VIDEO; pause media; needed in each case, not outside switch
				mediaPlayPause('close');	removeClass('.dirlist_item.video.content_loaded','content_loaded');								removeClass('#content_video','has_content');
				removeAttr('#content_video','src');						removeAttr('#content_pane','data-content');																		break;
		}
	}
	function toggleMediaNameInWindowTitle(action) {
		let document_title = ( / :: /.test(document.title) ? document.title.split(' :: ')[1] : document.title );														// add playing media item to document.title
		let file_name = getEls('.dirlist_item.media.audio_loaded,.dirlist_item.media.content_loaded')[0].dataset.title || '';											// nobreak
		switch(true) {
			case ( /close/.test(action) ): 											document_title = document.title;											break;	
			case action === 'toggle': 
				if ( getCurrentUIPref('show_media_name_in_window_title') === 'true' ) {
					searchParamSet('show_media_name_in_window_title','false');		document.body.classList.add('show_media_name_in_window_title_false');				// toggle off; add searchParam and body class
				} else {
					searchParamDelete('show_media_name_in_window_title');			document.body.classList.remove('show_media_name_in_window_title_false');			// toggle on; delete searchParam and body class
				}																																				break;
			default:																document_title = (action || 'Paused: ') + file_name +' :: '+document_title;	break;	// default add name to document title
		}
		document.title = document_title;
	}
	//============================// MEDIA PLAYBACK
	function mediaShuffleListUpdate(id,bool) { let shuffle_list;																					// ===> UPDATE SHUFFLE LIST; bool === false: there is a selected media item
		const mediaGetUpdatedShuffleArray = () => { let playlist = []; Array.from(getEls('.dirlist_item.media:not(.unchecked,.disabled)')).forEach( el => playlist.push( el.id ) ); return playlist; }
		const mediaShuffleArray = (array) => { for ( let i = array.length - 1; i > 0; i-- ) { const j = Math.floor(Math.random() * (i + 1));  [array[i], array[j]] = [array[j], array[i]]; }	return array; }
		switch(true) {
			case !hasClass('body','shuffle_media'): return;																							// don't shuffle if normal playback
			case id !== undefined:	shuffle_list = getData('#content_audio_container','shufflelist').split(',');									// handle checked and unchecked media items: id = checked/unchecked item.id
				switch(true) {
					case bool === false: case hasClass('#'+ id,'unchecked'):	shuffle_list = shuffle_list.filter( shuffle_item_id => shuffle_item_id !== id );	break;	// remove selected or unchecked items
					default:													shuffle_list.push(id); shuffle_list = mediaShuffleArray( shuffle_list );					// else add re-checked items to shufflelist
				}																																					break;
			default: shuffle_list = mediaShuffleArray( mediaGetUpdatedShuffleArray() );																// reset shufflelist when shuffle option checked
				if ( !mediaIsPlaying('content_audio') || !mediaIsPlaying('content_video') ) { 
					showThis(shuffle_list[0]); shuffle_list.shift();																				// if nothing playing, load first item from list and remove it
				} else { 
					shuffle_list = shuffle_list.filter( shuffle_item_id => shuffle_item_id !== getEls('.dirlist_item.media.audio_loaded').id );		// else just remove the current item from the shuffle list
				}
		}
		setMediaShuffleListData(shuffle_list);																										// set shufflelist data and remaining count
	}
	function setMediaShuffleListData(shuffle_list) {
		shuffle_list = (typeof shuffle_list === 'string' ? shuffle_list.split(',') : shuffle_list );
		let shufflecount = ( shuffle_list[0] === '' ? '0' : shuffle_list.length );
		setData('#content_audio_container','shufflelist',shuffle_list);	setData('#shuffle_label','shufflecount',' ('+ shufflecount +' remaining)');	// set shufflelist data and remaining count
	}
	function toggleCheckBox(e,id) { let input_el = getEl('#'+id).querySelector('input');  input_el.checked = !input_el.checked; input_el.blur(); }
	function toggleChecked(e,id) { e?.stopPropagation();
		let el = getEl('#'+id), input_el = getEl('#'+id).querySelector('input'); input_el.checked = !input_el.checked; el.classList.toggle('unchecked'); mediaShuffleListUpdate(id);
	}
	function toggleAllChecked(e) { e.stopPropagation(); getEls('.dirlist_item.media').forEach( el => toggleCheckBox(e,el.id) );  mediaShuffleListUpdate(); }	// ===> TOGGLE ALL MEDIA CHECKBOXES; update shufflelist
	function mediaScrub(e,args) { let factor, skip;																							// ===> MEDIA SKIP +/-10/30 seconds
		switch(true) {
			case e !== undefined:		factor = ( e.key   === 'ArrowLeft' ? -1 : 1 );	skip = ( e.altKey && e.shiftKey ? 30 : e.altKey ? 10 : null ); break; // from top
			case args !== undefined:	factor = ( args[0] === 'ArrowLeft' ? -1 : 1 );	skip = args[1] || 0; break;									// from iframe
		}
		const player = ( hasContent('video') ? getEl('#content_video') : getEl('#content_audio') ),	time = player.currentTime;						// get current time
		player.currentTime = time + factor*(skip);																									// set new time
	}
	function mediaIsPlaying(id) {																											// ===> IS PLAYING; returns true if all conditions are true
		switch(true) {
			case !isTopWindow() && !hasClass('body','has_quicklook'):	return ( hasClass('body','is_playing') ? true : false );
			default:													return ( id !== undefined && getEl('#'+id).currentTime > 0 && !getEl('#'+id).paused && !getEl('#'+id).ended );
		}
	}
	function mediaPlayPause(task) { let player_el = ( hasContent('video') ? getEl('#content_video') : getEl('#content_audio') ), playing = mediaIsPlaying( player_el.id );	// ===> PLAY/PAUSE MEDIA
		switch(true) {
			case player_el === null:																											break;
			case task === 'close':															player_el.removeAttribute('src');							// nobreak;
			case task === 'pause':	case playing === true:									try { player_el.pause(); }	catch(e) { null; }		break;
			case task === 'play':	case playing === false:									try { player_el.play(); }	catch(e) { null; }		break;
		}
		if ( hasContent('iframe_audio') ) { messageSend('iframe','setIframePlayerStatus','',task); }
	}
	function mediaPlayPrevNextIframeItem() { if ( !isTopWindow() ) { getEl('.dirlist_item.selected.media a').trigger('dblclick'); messageSend('top_body','iframe_play_pause_media'); } } // ===> PLAY PREV/NEXT IFRAME MEDIA ITEM
	function mediaPlaybackOptions(e,id) {	e.stopPropagation();																			// ===> AUDIO PLAYBACK OPTIONS (shuffle, loop)
		let loop_el = getEl('#loop'), shuffle_el = getEl('#shuffle');
		switch(true) {
			case id === 'loop':		case id === 'loop_media_files':	document.body.classList.toggle('loop_media');									break;
			case id === 'shuffle':	case id === 'shuffle_media_files':	document.body.classList.toggle('shuffle_media');  mediaShuffleListUpdate(); break;	// set shufflelist
		}
		switch(true) {																																		// change audio checkboxes prop
			case id === 'loop_media_files':		( loop_el.checked === true ? loop_el.checked = false : loop_el.checked = true );					break;
			case id === 'shuffle_media_files':	( shuffle_el.checked === true ? shuffle_el.checked = false : shuffle_el.checked = true );
												if ( shuffle_el.checked === false ) { delete getEl('#shuffle_label').dataset('shufflecount'); }		break;	// remove shufflecount
		}
	}
	//============================// PLAYLISTS/FILELISTS
	function openPlaylist(file_name,reader,data) { let bool, list_class; // files & reader = open .m3u file; data = m3u.txtfile content//	// ===> OPEN PLAYLIST
		if ( !data.startsWith('#EXTM3U') ) { return; }																								// prevent reading non-playlist files
		if ( !/has_\w+list/.test(getClassNames('body') ) ) {																						// if body does not already have playlist or filelist...
			let body_classes = document.body.classList;																								// ...store original dir_list and body "has_"classes as data
			setData('#directory_list','dir_list',getEl('#directory_list').innerHTML); setData('#directory_list','body_classes',body_classes.value);	// store the original dir_list and body classes
			body_classes.forEach( (body_class) => { if ( body_class.startsWith('has_') ) { removeClass('body', body_class ); } });					// remove media and other body classes
		}
		file_name = ( file_name !== '' ? file_name : getEl('.dirlist_item.selected.playlist .dirlist_item_name_a').innerText );						// get the file name for the title and current_dir_path
		getEl('#current_dir_path span').innerHTML = file_name;																						// set sidebar header title
		let new_index = buildNewIndex( '', prepPlaylist(data),'','playlist' );																		// build the new dir_list
		addClass('body',new_index[1]);																												// add playlist body classes (has_media, has_audio, etc.)
		list_class = ( new_index[1].split(' ').every((el) => ['has_audio','has_media','has_video'].includes(el)) ? 'has_playlist' : 'has_filelist' );	addClass('body',list_class);	// set play- or filelist class
		if ( /file:/.test(new_index) && !/file:/.test(window_protocol) ) { addClass('body','has_warning'); addClass('#directory_list','local'); showWarning('openPlaylist','warning_local_playlist'); }	// warn local on non-local
		getEl('#directory_list').innerHTML = new_index[0];																							// replace dir_list with prepared playlist
		autoLoadItems();				// if autoload media...
		scrollThis('#directory_list','.selected',false);    document.title = 'Playlist: '+ file_name;    bool = true;
		initEvents();	updateStats(bool);
	}
	function closePlaylist() {						// files & reader = open .m3u file; data = m3u.txtfile content//						// ===> OPEN PLAYLIST
		window.stop(); closeContent('audio'); closeContent(); removeClass('body');																	// close all content, remove all body classes, stop window resource loading
		addClass('body',getData('#directory_list','body_classes'));																					// restore original body classes
		getEl('head title').innerText = 'Index of '+ window_location;																				// restore window title
		getEl('#current_dir_path span').innerHTML = current_dir_path;																				// restore current_dir_path tilte
		getEl('#directory_list').innerHTML = getData('#directory_list','dir_list');																	// restore original dir_list...
		deleteData('#directory_list','dir_list');		deleteData('#directory_list','body_classes');												// ...and remove data
		showThis(getEl('.dirlist_item.audio.audio_loaded')?.id);		showThis(getEl('.dirlist_item.content_loaded')?.id);						// reload previously loaded content
		initEvents();	updateStats(false);
	}
	function playlistMake() { let items, playlist = [];																						// ===> MAKE PLAYLIST file from directory files for export as m3u
		let playlist_type = getEl('#make_playlist_form input:checked').id;
		switch(playlist_type) {																														// get playlist items according to selected type
			case 'media_files_only':	items = getEls('.dirlist_item.media:not(.unchecked)');	break;
			case 'audio_files_only':	items = getEls('.dirlist_item.audio:not(.unchecked)');	break;
			case 'video_files_only':	items = getEls('.dirlist_item.video:not(.unchecked)');	break;
			case 'all_non_media_files':	items = getEls('.dirlist_item.non_media');				break;
			case 'all_items':			items = getEls('.dirlist_item');						break;
			case 'directories_only':	items = getEls('.dirlist_item.dir');					break;
			case 'files_only':			items = getEls('.dirlist_item.file');					break;
		}
		switch(true) {
			default:
				items.forEach( (item) => { playlist.push( playlistMakeItem(item.id,true) ); });																					// make playlist entry for each item
				playlist = '#EXTM3U\n'+ playlist.join('\n');																													// add playlist header id
				saveFile( playlist,'audio/mpeg-url',(getEl('#current_dir_path').innerText).split('/').reverse()[1] +'.m3u' );													// save m3u with default name = current dir name
				closeWarning();																																					// close warning
		}
	}
	// Make playlist entry for display in title bar
	function playlistMakeItem(id,bool) { //*** id = 'content_title' or 'content_audio_title', bool = true --> from playlistMake(), otherwise from playlistShowItem(); ***//
		let title, link, duration, full_path = window.location.protocol + window.location.hostname + window.location.pathname;
		title = ( hasContent('grid') && id === 'content_title' ? 'Files from: '+ full_path : bool === true ? getEl('#'+id).dataset.name : getEl('#'+id).innerText );			// get title txt
		switch(true) {																																							// Get link
			case bool === true:				link = getEl('#'+id).querySelector('a').href;																				break;	// get item link for filelists
			case hasContent('grid') && id === 'content_title':		link = full_path;																					break;	// grid link = dir path
			case id === 'content_title':		link = ( hasContent('image') ? getAttr('#content_image','src') : getAttr('.content_el.has_content','src') );			break;	// content link
			case id === 'content_audio_title':	link = getLinkInfo( getAttr('#content_audio','src') )[0].trim();														break;	// audio link
		}
		link = ( link.startsWith('/') ? window.location.protocol +'//'+ link : link );																							// fix links without protocols (local files)
		link = new URL(link);																																					// make new URL from link
		link = link.protocol +'//'+ link.hostname + link.pathname;																												// compose link
		duration = ( hasContent('video') ? Number.parseInt(getEl('#video').duration) : id === 'content_audio_title' ? Number.parseInt(getEl('#content_audio').duration) : '' );
		return '#EXTINF:'+ duration +','+ title +'\n'+ link +'\n';																												// return composed playlist entry
	}
	function playlistShowItem(id) {																										// ===> SHOW PLAYLIST ENTRY
		switch(true) {
			case id === 'close': removeClass('#content_playlist_item,#content_audio_playlist_item','has_content'); getEls('#content_header textarea').forEach(el => el.value = '');		return;
			case hasClass('body','has_quicklook') && id === 'content_audio_title': closeContent('audio');		case !hasContent():		case hasContent('texteditor'):					return;
		}
		let el_id = ( id === 'content_title' ? 'content_playlist_item' : id === 'content_audio_title' ? 'content_audio_playlist_item' : '' );
		document.getElementById(el_id).classList.toggle('has_content');
		document.getElementById(el_id).querySelector('textarea').value = playlistMakeItem(id);
		textareaSelectContent(document.getElementById(el_id).querySelector('textarea').id);														// add entry to the textarea
		document.getElementById(el_id).querySelector('textarea').focus();
	}
	//============================// CUESHEETS
	function cuesheetGet(id,link,kind) { // id = 'content_iframe_file' or 'dir_list.media.id', link = selected.href, kind = audio/video // ===> GET CUE SHEET
		if ( id === 'content_iframe_file' ) { return; }																							// prevent error for iframe files
		removeClass('.cuesheet_track_list_container','has_cue_sheet');																			// reset cuesheet container
		getEl('#cuesheet_track_list_audio').innerHTML = '';																						// empty existing cue sheet track list
		let media_file_name = decodeURIComponentSafe(getEl('#'+id).dataset.name);
		let cue_file_name = decodeURIComponentSafe(media_file_name).slice(0,media_file_name.lastIndexOf('.')) + '.cuetxt', cue_file_link = '';
		let cue_file = getEl('.dirlist_item.code[data-name="'+ cue_file_name +'"');																// get the cuesheet id
		if ( cue_file !== null ) {
			cue_file_link = document.getElementById( cue_file.id ).querySelector('a').href.trim();
			getEl('#content_iframe_utility').src = cue_file_link;																				// set utility iframe src for processing
			setAttr('#cuesheet_track_list_container_'+kind,'data-duration',getEl('#content_'+kind).duration);
		}
	}
	function cuesheetProcess(cuesheet_text) {																							// ===> PROCESS CUE SHEET
		let commands_arr = ['PERFORMER','TITLE','INDEX'], track_command, classes = 'cuesheet_track display_grid background_grey_85 pointer padding_4_6';
		let cuesheet_tracks, track, prepped_track, prepped_track_list = [], track_header, track_id, display_time, duration, index, position, previous_position, container_id;
		cuesheet_text = cuesheet_text.replace(/\t/g,' ');
		cuesheet_tracks = ( !cuesheet_text.startsWith('TRACK') ? cuesheet_text.slice(cuesheet_text.indexOf('TRACK ')).split('TRACK ').reverse() : cuesheet_text.split('TRACK ').reverse() );
		for ( track of cuesheet_tracks ) { prepped_track = []; track = track.trim().split(/[\n\r]/); track_id = track.shift().split(' ')[0];	// for each track in the cue sheet...
			for ( let i = 0; i < commands_arr.length; i++ ) {																					// and for each command in commands_arr...
				for ( track_command of track ) {																								// and for each command in the track
					if ( track_command.match(commands_arr[i]) ) {
						track_command = track_command.trim().replace(/^(performer|title|index\s+\d+)\s*/mgi,'').replace(/^('|\"|\&quot;)|('|\"|\&quot;)$/mgi,'');	// prep the displayed track information
						if ( commands_arr[i] === 'INDEX' ) {																		// format INDEX command; N.B.: cuesheet time format = mm:ss:ff (ff = frames @ 75fr/sec): 
							previous_position = ( position || getEl('.dirlist_item.media.content_loaded .dirlist_item_media_duration')?.dataset.duration); // first track won't have position, so use length of audio file
							display_time = track_command.replace(/INDEX\s+\d+\s+/,'');	
							index = display_time.split(':').reverse();				// split the display time
							position = index[0]/75 + index[1]*1 + index[2]*60;		// sum the parts to get total seconds for audio position
							track_command = getFormattedDuration(Math.abs(previous_position - position)) +'</span><span class="cue_position">'+getFormattedDuration(position);	// display duration of track
							duration = getFormattedDuration(Math.abs(previous_position - position));
						}
						prepped_track[i] = '<span class="cue_'+ commands_arr[i].toLowerCase()+'">'+ ( track_command.length === 0 ? '—' : track_command ) +'</span>';	// make span for each track command
					}
				}
			}
			prepped_track.unshift(`<li id="cuesheet_item_${track_id}" class="${classes}" data-duration="${duration}" data-position="${position}"><span class="cue_index align_right">${track_id}</span><span class="icon has_icon_before_before"></span>`);																												// add prepped_track prefix html (track number/index, icon)
			prepped_track_list.push(prepped_track.join(''));																					// add prepped_track to prepped_track_list
		}
		prepped_track_list.pop();		prepped_track_list = prepped_track_list.reverse().join('</li>') +'</li>';								// remove mystery empty track item; create prepped track list
		track_header = '<li class="cuesheet_track header display_grid cursor_default background_grey_85 border_top border_bottom bold"><span class="cue_track_id"></span><span class="icon"></span><span class="cue_performer">Performer</span><span class="cue_title">Title</span><span class="cue_index">Time</span><span class="cue_position">Position</span></li>';		// tracklist menu header elements
		switch(true) {
			case elExists('.dirlist_item.audio_loaded'):			case hasContent('iframe_audio'):	container_id = '#cuesheet_track_list_audio';	break;
			case elExists('.dirlist_item.video.content_loaded'):	case hasContent('iframe_file'):		container_id = '#cuesheet_track_list_video';	break;
		}
		getEl(container_id)?.closest('nav')?.classList.add('has_cue_sheet'); getEl(container_id).innerHTML = track_header + prepped_track_list;					// add cue sheet track list to menu
		initCuesheetEvents(); cueSheetMenuUpdate();																			// init cuesheet event listeners
	}
	function cueSheetMenuUpdate() { let media_el = getEl('.media_player[src]');																				// UPDATE CUESHEET MENU: continuously on timeupdate
		let current_time = media_el?.currentTime;
		let current_track = (getEl('.cuesheet_track.selected') !== null ? getEl('.cuesheet_track.selected') : getEl('#cuesheet_item_1') ); 
		let current_position = current_track?.dataset.position, next_track = current_track?.nextElementSibling, next_position = next_track?.dataset.position, track_title, bool;
		switch(true) {
			case current_time >= current_position && current_time < next_position: bool = true; if ( !current_track.classList.contains('selected') ) { current_track.classList.add('selected'); } break; // current track playing
			case current_track === null && current_position === undefined:																						// nobreak; click media player timeline with nothing selected
			case current_time < current_position || current_time > next_position:																				// nobreak; click media player timeline outside of current track
			case current_time < next_position:	bool = false;																									// or when scrubbing backwards...
				 current_track?.classList.remove('selected'); current_track = Array.from(getEls('.cuesheet_track')).reverse().find( el => el.dataset.position < current_time );	break;	// ...select current track by position
			case current_time > next_position:	bool = false;																									// when current track ends (playing or scrubbing forward...
				 current_track.classList.remove('selected'); current_track = next_track;																		// redefine current track
		}
		next_track = current_track?.nextElementSibling;																											// redefine next track
		track_title = current_track?.querySelector('.cue_performer').innerText +': '+current_track?.querySelector('.cue_title').innerText;						// get the current track title
		media_el.closest('.track_title_container').dataset.track_title = track_title;																			// else update title
		if ( bool !== true ) { current_track?.classList.add('selected'); scrollThis('#cuesheet_track_list_audio','.cuesheet_track.selected'); }					// select and scroll to current track
	}
	function updateCueSheetDisplay() { null };
	function setCueSheetTrackTitle(id,media_el) { let current_track = getEl('.cuesheet_track.selected');
		let track_title = current_track.querySelector('.cue_performer').innerText +': '+current_track.querySelector('.cue_title').innerText;					// get the current track title
		getEl('#content_'+media_el).dataset.track_title = track_title;																							// set media player data-track_title
	}
	//============================// FONTS
	function fontRestoreOptions(id) { // restore font toolbar values after closing previewed glyph with modified options values
				getEl('#font_size').value = getEl(id).dataset.scale;		getEl('#text_color').value = getEl(id).style.color;									// restore size and color
		switch(true) {																																			// restore text stroke color & width
			case id === '#font_file_grid':
				getEl('#text_stroke_width').value = getEl(id).querySelector('svg path').getAttribute('stroke-width')?.replace(/[A-z]+/,'') || '';
				getEl('#text_stroke_color').value = getEl(id).querySelector('svg path').getAttribute('stroke') || '';																			break;
			case id === '#font_specimen_viewer':
				getEl('#text_stroke_width').value = getEl(id).style.webkitTextStrokeWidth.replace(/[A-z]+/,'');		getEl('#text_stroke_color').value = getEl(id).style.webkitTextStrokeColor;	break;
		}
	}
	function setFontSpecimenViewerStyles(font_family) {
		if ( font_family !== false ) { getEl('#font_specimen_viewer').style.fontFamily = '"'+font_family+'"'; }														// set content font styles
		getEl('#font_specimen_viewer').style.fontSize = getEl('#font_size').value +'em';																			// ""    ""
		getEl('#font_specimen_viewer').style.lineHeight = ( Number(getEl('#line_height').value) === 0 ? 1.2 : Number(getEl('#line_height').value) + 1.2 );			// ""    ""
		getEl('#font_specimen_viewer').style.letterSpacing = getEl('#letter_spacing').value;																		// ""    ""
		getEl('#font_specimen_viewer').style.webkitTextStrokeWidth = getEl('#text_stroke_width').value;																// ""    ""
		getEl('#text_color').value = getEl('#font_specimen_viewer').style.color;
		getEl('#text_stroke_color').value = getEl('#font_specimen_viewer').style.webkitTextStrokeColor;
	}
	function showFont(id,bool,font_grid,link,i,font_items_length) {				// ===> SET FONT CSS rules or create font grid items (bool === true) // id from gridMakeFontItems(); link = from previewed directory
		let font_styles = getEl('#font_styles'), border_class = '', last_item_class = '', display_name,  font_grid_item_info = '', font_grid_item_el = '';
		let font_family = ( link !== '' ? link?.slice(link.lastIndexOf('/') + 1,link?.lastIndexOf('.')) : getEl('#'+id).dataset.name );	font_family = decodeURIComponentSafe(font_family);	// get CSS font family
		let font_url    = ( link !== '' ? link : getAttr('#'+ id +' a','href') );													font_url    = decodeURIComponentSafe(font_url);			// get CSS font src
		setWarningItemNotLoaded(link,'font');
		switch(true) {
			case bool === false:																																		// If bool === false, set CSS rules for previewed fonts
				font_styles.innerHTML = `@font-face { font-family: "${ font_family }"; src: url("${ font_url }"); }`;													// insert new @font-face rule
				addClass('#content_pane','has_font_specimen');
				setFontSpecimenViewerStyles(font_family);																										break;
			case font_grid === 'font_grid':																																// ...else (if bool === true) make grid font items
				display_name = font_family;
				if ( i === font_items_length - 1 ) { last_item_class = 'border_bottom_x'; }
				if ( i > 0 ) { border_class = 'border_top_x'; }
				  font_grid_item_info = `<p class="font_grid_item_info margin_0 text_color_default font_size_small line_height_1">${ display_name.toUpperCase() }</p><h2 style=\'font-family: "${ font_family }"\'; class="margin_0 normal"><a class="text_color_default" href="${ font_url }">${ display_name.slice(0,font_family.lastIndexOf(".")) }</a></h2>`;
				  font_grid_item_el = `<li class="grid_item font_grid_item ${border_class} ${last_item_class} background_grey_90" data-id="${ id }" data-kind="font">${ font_grid_item_info }</li>`;
				if ( !/font_family/.test(getEl('#font_grid_styles').innerHTML) ) {																	// only add font family style if it isn't already there
					getEl('#font_grid_styles').insertAdjacentHTML('beforeend', `@font-face { font-family: "${ font_family }"; src: url("${ font_url }"); }`);
				}
				return font_grid_item_el;
		}
		initFontPreviewEvents();
	}
	function closeFont() {
		switch(true) {
			case hasContent('iframe_file,iframe_dir'):						showThis( getEl('.dirlist_item.non_media.selected')?.id );								break;	// if iframe item, reopen sidebar dir
			case hasContent('font_file_glyph'):																																// CLOSE FONT_FILE_GLYPH font_specimen_grid
				removeClass('#content_pane','has_font_file_glyph');			addClass('#content_pane','has_font_file');
				getEl('#svg_container g').style.transform = 'scale(1)';		fontRestoreOptions('#font_file_grid');													break;	// reset font_scale slider
			case hasContent('font_specimen_glyph'):																															// CLOSE FONT_SPECIMEN_GLYPH
				removeClass('#content_pane','has_font_specimen_glyph');		addClass('#content_pane','has_font_specimen');
				removeAttr('#font_specimen_glyph','style');					removeAttr('#font_specimen_viewer',['data-char','data-unicode_hex']);
				getEl('#font_specimen_glyph').innerText = '';				fontRestoreOptions('#font_specimen_viewer');											break;	// reset font_scale slider
			case hasContent('font_file'):									showWarning( 'showFont','close' );														break;	// CLOSE FONT FILE with warning
			case getEl('#font_specimen_grid').children?.length > 0:			getEl('#font_specimen_grid').innerHTML = '';	getEl('#unicode_char_ranges_select').value = '' ; showContentPaneEl('font');	break;
			case hasContent('font_specimen'):								if ( getEl('.dirlist_item.dir.selected') ) { showThis( getEl('.dirlist_item.dir.selected').id ); }		// reopen selected sidebar dir
					else { setData('#content_pane','content','has_null');	setData('#content_pane','loaded_id','null');															// else close sidebar font
				removeClass('#content_pane','has_font_specimen has_file');	removeClass('#content_font','has_content');		setContentTitle('close');	}			break;
			default:	setAttr('#content_pane','data-content','has_null');	removeClass('#content_pane','has_font_specimen has_font_specimen_glyph has_font_file has_font_file_glyph');
						removeClass('#content_font','has_content');		removeAttr('#content_font','src');				removeAttr('#font_specimen_viewer','style');
						setContentTitle('close'); focusEl('#top_body');																								break;
		}
	}
	function showFontGlyph(e,id) { e?.stopPropagation();																											// ===> SHOW INDIVIDUAL GLYPH
		let this_glyph, glyph_viewer, data_glyph_SVG, glyph_name, unicode_dec, unicode_hex, svg_container;
		if ( ( e?.type === 'click' || e?.key === 'Enter' ) && /glyph_container/.test(id) ) { removeClass('#font_file_grid .selected','selected'); addClass('#'+id,'selected'); }		// select clicked or
		if ( !hasContent('font_file_glyph') && !hasContent('font_specimen_glyph') ) { getEl('#font_size').value = 1; }
		switch(true) {
			case id === 'close':				case id === 'close_specimen':															closeContent('font');		return;	// close font glyph
			case ( /font_specimen/.test(id) ): case hasContent('font_specimen'): case hasContent('font_specimen_glyph'):													// font specimens and font specimen glyphs
				this_glyph = getEl('#'+ id);	glyph_viewer = getEl('#font_specimen_viewer');
				getEl('#font_specimen_glyph').innerText = String.fromCodePoint(this_glyph.dataset.unicode_dec);																// add glyph to specimen glyph
				glyph_name = String.fromCodePoint(this_glyph.dataset.unicode_dec); unicode_dec = this_glyph.dataset.unicode_dec; unicode_hex = this_glyph.dataset.unicode_hex;
				removeClass('#content_pane','has_font_specimen');	addClass('#content_pane','has_font_specimen_glyph');
				focusEl('#content_pane');	getEl('#content_pane .font_glyph_item.selected')?.scrollIntoView({behavior:"smooth",block:"nearest"});					break;	// hide font_specimen, show font_specimen glyph
			case hasContent('font_file'): case hasContent('font_file_glyph'):																								// font files and font file glyphs
				this_glyph = getEl('#'+id) || getEl('#font_file_grid .selected');	glyph_viewer = getEl('#font_file_glyph_viewer');
				data_glyph_SVG = this_glyph.querySelector('svg').cloneNode(true);																							// get glyph by id, glyph path, & glyph SVG
				data_glyph_SVG.setAttribute('viewBox','0 0 50 160'); data_glyph_SVG.style.width = '100%'; data_glyph_SVG.style.height = '100%'; data_glyph_SVG.style.color = getEl('#text_color').value; // set attrs & styles
				data_glyph_SVG.classList.remove('invert');				data_glyph_SVG.classList.add('overflow_visible');	data_glyph_SVG.querySelector('g').style.transform = 'scale('+ glyph_viewer.dataset.scale +')';
				if ( elExists('#svg_container') ) {																															// if a glyph is being shown...
					getEl('#svg_container svg').remove(); getEl('#svg_container').insertAdjacentHTML('beforeend',data_glyph_SVG.outerHTML); svg_container = getEl('#svg_container').outerHTML; // get svg_container, add new svg;
				} else {																																					// ...and so preserve any added styles
					svg_container = '<div id="svg_container" class="display_flex invert position_relative width_100 height_100">'+ data_glyph_SVG.outerHTML +'</div>';		// else create new svg container
				}
				getEl('#glyph_container')?.remove();																														// remove existing glyph_container
				glyph_viewer.insertAdjacentHTML('beforeend','<div id="glyph_container" class="flex_justify_center">'+ svg_container +'</div>');								// add the glyph_container to font_file_glyph_viewer
				glyph_name = this_glyph.dataset.glyph_name; unicode_dec = this_glyph.dataset.unicode_dec; unicode_hex = this_glyph.dataset.unicode_hex;
				getEl('#svg_container').onmousedown = function(e) { fontGlyphMove(e,'#svg_container') };																	// init fontGlyphMove
				removeClass('#content_pane','has_font_file');			addClass('#content_pane','has_font_file_glyph');
				focusEl('#content_pane');	getEl('#content_pane .font_glyph_item.selected')?.scrollIntoView({behavior:"smooth",block:"nearest"});					break;	// hide font_file grid, show font_file_glyph
		}
		glyph_viewer.dataset.glyph_name = glyph_name; glyph_viewer.dataset.unicode_dec = 'Unicode Dec: '+ unicode_dec; glyph_viewer.dataset.unicode_hex = 'Unicode Hex: '+ unicode_hex;
	}
	function openFontFile(files,reader,bool) {																									// ===> OPEN FONT FILE
		getEl('#font_file_viewer').remove();		getEl('#content_font').insertAdjacentHTML( 'beforeend', Content_Pane_Elements('content_font_viewer') );						// reset font_file_viewer
		switch(true) {
			case files === 'close':																														// close font file
				removeClass('body','focus_content');
				removeAttr('#content_pane','data-content'); removeClass('#content_pane','has_font_specimen has_font_specimen_glyph has_font_file has_font_file_glyph');	// remove content_pane attrs and classes
				removeClass('#content_font','has_content');																								// remove content_font classes
				getEl('#font_file_grid').innerHTML = '';	getEl('#content_title span').innerHTML = '';												// empty font_file_grid and content_title
				if ( bool === undefined ) {																												// show previously loaded content or close content, but not if bool
					if ( getEl('.dirlist_item.content_loaded') ) { showThis(getEl('.dirlist_item.content_loaded')?.id); } else { showThis('close'); }	// (but not when opening new font file)
				}
				break;
			default:																																	// show font file
				if ( !hasContent('font_file') && !/has_\w+list/.test(getClassNames('#top_body')) )		{ showThis('close'); }							// close content & hide grids
				removeClass('#content_pane','has_font_specimen has_font_specimen_glyph has_font_file_glyph');	addClass('#content_pane','has_font_file');	// content_pane classes
				setContentPaneAttrs(files.name,'font','content_font',files.name);
				showContentPaneEl('font');
				setData('#font_file_glyph_viewer','scale','1');																							// reset font file glyph viewer
				makeFontGlyphItems('font_file',reader.result);																							// => make glyph items from font file
				getEls('.glyph_container').forEach( el => el.addEventListener('click', (e) => showFontGlyph(e,el.id)));									// init click listener for each glyph
				focusEl('#font_file_grid');																												// focus font_file_grid
			}
	}
	function getFontFileInfo(font) { let font_names = font.names, font_info_details = '', name, value;											// ===> GET FONT INFO
		for ( name in font_names ) {
			value = font_names[name].en;
			if ( name.endsWith('URL') ) {
				let href = ( !value.startsWith('http') ? 'http://'+ value : value);																	// in case url without protocol is used
				value = '<a class="bold" href="'+ href +'" target="_blank">'+ value +'</a>';
			}
			font_info_details += `<li class="display_none"><span class="col_1 font_info_name align_right"> ${name}: </span><span class="font_info_value">${value}</span></li>`;
		}
		let font_info = `<ul id="font_info" class="info_list font_size_small border_all margin_0 padding_0 text_color_default background_grey_80 position_fixed z_index_2">     <li class="info_list_header align_center bold"><span>FONT INFO:${font.names.fullName.en.toUpperCase()}</span></li>     ${font_info_details}     <li class="display_none"><span class="col_1 font_info_name align_right">numGlyphs: </span><span class="font_info_value">${font.numGlyphs}</span></li>     </ul>`;
		getEl('#font_file_viewer').insertAdjacentHTML('beforeend',font_info);
	}
	// FONT GLYPHS
	function makeFontGlyphItem(kind,index,glyph) {																					// MAKE FONT GLYPH GRID ITEM; "index" is for font_specimens, "glyph" for font_files
		let glyph_svg,glyph_index,glyph_name,glyph_dec,glyph_hex,glyph_path,glyph_boundingbox, tab_order = ( index === 0 ? 'data-tab_order="0"' : ''); // glyph_width,glyph_height,glyph_advancewidth,glyph_leftsidebearing;
		switch(kind) {
			case 'font_file':
				glyph_name = glyph.name;		glyph_index = glyph.index;
				glyph_dec = ( glyph.unicode !== undefined ? glyph.unicode : '' ); glyph_hex = ( glyph_dec !== null ? convertDecimal2Hex(glyph_dec,4) : '');	// get glyph dec and hex values
				glyph_path = glyph.getPath(0,100,72); glyph_boundingbox = glyph_path.getBoundingBox();
				glyph_path = glyph_path.toSVG().replace(/"/g,'\'').replace(/path /g,'path fill=\'currentColor\' ');	// define glyph svg path and escape "
				glyph_svg = `<svg xmlns=\'http://www.w3.org/2000/svg\' x=\'0px\' y=\'0px\' viewBox=\'${(glyph_boundingbox.x1 < 0 ? 0 : glyph_boundingbox.x1)} 20 ${Math.abs(glyph_boundingbox.x2)} ${glyph_boundingbox.y2}\' xml:space=\'preserve\' preserveAspectRatio=\'xMidYMid meet\'><g>${glyph_path}</g></svg>`;															break;
			case 'font_specimen':				glyph_index = index; glyph_dec = index; glyph_hex = convertDecimal2Hex(index,4);					break;
		}
		return `<li id="${kind}_glyph_container_${glyph_index}" data-id="glyph_container_${glyph_index}" data-glyph_name="${glyph_name || ''}" ${tab_order} data-unicode_dec="${glyph_dec}" data-unicode_hex="U+${glyph_hex}" class="grid_item font_glyph_item glyph_container flex_justify_center border_right_x border_bottom_x position_relative"><div class="glyph display_block">${glyph_svg || String.fromCharCode(glyph_index)}</div></li>`;		// return glyph item
	}
	function makeFontGlyphItems(kind,data,bool) {																					// MAKE FONT GLYPH GRIDS; kind,data === font_specimen,char_block_id or font_file,fontblob
		let glyph_items = '', font_file, font_glyphs, font_file_grid = getEl('#font_file_grid'), loop_start, loop_end;
		switch(kind) {
			case 'font_file':																																// display font_file glyphs
				font_file = window.opentype.parse(data);																									// parse font (req opentype.js)
				font_glyphs = font_file.glyphs;																												// get font glyphs
				setData('#font_file_glyph_viewer','font_name',font_file.names.fullName.en);																	// add font name to glyph viewer dataset
				loop_start = 0, loop_end = font_glyphs.length;																						break;
			case 'font_specimen':																															// for displaying unicode char_block ranges
				if ( data !== '' ) { loop_start = convertHex2Decimal(getEl('#'+data).dataset.block_start); loop_end = convertHex2Decimal(getEl('#'+data).dataset.block_end) + 1; }	break; // loop char_block start/end range
			}
			for ( let i = loop_start; i < loop_end; i++ ) { glyph_items += makeFontGlyphItem(kind,i,font_glyphs?.glyphs?.[i]); }							// loop make glyph items for glyph grids
			switch(true) {
				case bool:																																							return glyph_items;
				case data === '':				getEl('#font_specimen_grid').innerHTML = '';																						break;	// close font_specimen_grid
				case kind === 'font_file':		getFontFileInfo(font_file);				font_file_grid.insertAdjacentHTML('beforeend',glyph_items);		initFontPreviewEvents();	break;
				case kind === 'font_specimen':	getEl('#font_specimen_grid').innerHTML = glyph_items.trim();	initFontPreviewEvents();	focusEl('#content_pane');				break;
			}
	}
	function fontGlyphMove(e,sel) { e.stopPropagation();	let startX = e.pageX, startY = e.pageY, elOffsetLeft = getEl(sel).offsetLeft, elOffsetTop = getEl(sel).offsetTop;	// Move glyphs
		document.onmousemove = function(e) { mouseMove(e,sel,startX,startY,elOffsetLeft,elOffsetTop); }
	}
	function fontGlyphSave() {																													// ===> SAVE GLYPH SVG
		let data = getEl('#svg_container svg').cloneNode(true), file_name = getData('#font_file_glyph_viewer','font_name') +'_'+getData('#font_file_glyph_viewer','glyph_name');
		data.setAttribute('viewBox','0 0 120 120'); data.removeAttribute('class'); data.querySelector('g').removeAttribute('style');
		saveFile(data.outerHTML,'image/svg+xml',file_name);
	}
	// FONT UTILITIES
	function fontOptions(e,id,value,variant_prop,variant_value) { eStopPrevent(e);	// value sets select el and font-feature-settings; if variant_prop exists, it is used to set font-variant value
		let props = {'font_size':'font-size','line_height':'line-height','letter_spacing':'letter-spacing','text_color':'color','text_stroke_width':'-webkit-text-stroke-width','text_stroke_color':'-webkit-text-stroke-color'};
		let prop = (variant_prop || props[id] || 'font-feature-settings'), units = ( /font_size|letter_spacing|text_stroke_width/.test(id) ? 'em' : '' ), text_stroke_color, current_stroke_color, fontElId;
		let el = getEl('#'+id);
		switch(true) {																																								// font_toolbar row 1: #font_specimen_variants
			case (/font_variant_select/.test(id)):				setValue('#font_tag_textarea',value);			el.focus();													break;	// select variants/stylistic sets
			case id === 'font_tag_textarea':					// textarea font tags; set corresponding font_variant_select value
				switch(true) {
					case value === null:						setValue('#font_tag_textarea','');																			return;	// if value === null: reset
					case Number(value?.length) < 4:				setValue('#font_variant_select','');																		break;	//
					case value?.startsWith('cv'):				setValue('#font_variant_select','cv01');																	break;	//
					case value?.startsWith('nalt'):				setValue('#font_variant_select','nalt');																	break;	//
					case value?.startsWith('ornm'):				setValue('#font_variant_select','ornm');																	break;	//
					case value?.startsWith('salt'):				setValue('#font_variant_select','salt');																	break;	//
					case value?.startsWith('ss'):				setValue('#font_variant_select','ss01');																	break;	//
					case value?.startsWith('swsh'):				setValue('#font_variant_select','swsh');																	break;	//
					default:									setValue('#font_variant_select',value.slice(0,4));															break;	//
				}																																							break;	// focus font_tag_textarea
			case id === 'unicode_char_ranges_select':			makeFontGlyphItems('font_specimen',value);			getEl('#content_font').scroll(0,0);						return;	// unicode chars startsWith
			case id === 'font_size':																				scaleFonts(null,value,'font_size');						return;
			case id === 'line_height':			value = Number(value) + 1.2;										if ( value === 1.2 ) { el.value = 0; }					break;	// line-height; default 1.2
			case id === 'letter_spacing':		value = ( Number(value) < 0 ? value/50 : Math.pow(value/50,2) );	if ( value === 0 ) { el.value = 0; }					break;	// letter-spacing
			case id === 'text_color':																				if ( value === null ) { el.value = ''; value = ''; }	break;	// if value === null: reset
			case id === 'text_stroke_width':	current_stroke_color = getEl('#text_stroke_color').value;
												text_stroke_color = ( value < 0 ? 'white' : ( current_stroke_color === '' || /white|black/.test(current_stroke_color) ) && value > 0 ? 'black' : current_stroke_color )
												getEl('#font_specimen_viewer')?.style.setProperty('-webkit-text-stroke-color',text_stroke_color);
												value = Math.abs(Number(value));	if ( value === 0 ) { el.value = 0; getEl('#text_stroke_color').value = ''; }			break;	// if value === 0: reset
			case id === 'text_stroke_color':										if ( value === null ) { el.value = ''; fontOptions(null,'text_stroke_width',null); }			// if value === null: reset
												value = ( getEl('#text_stroke_width').value < 0 ? 'white' : getEl('#text_stroke_color').value !== '' ? getEl('#text_stroke_color').value : 'black' );	break;
		}
		switch(true) {																																								// determine element(s) to target
			case hasContent('font_file_glyph'):			fontElId = ( /text_stroke/.test(id) ? '#svg_container path' : '#svg_container' );									break;	// el = svg_container or svg path
			case hasContent('font_file'):				fontElId = ( /text_stroke/.test(id) ? '#font_file_viewer path' : '#font_file_grid' );								break;	// el = svg_container or svg path
			case hasContent('font_specimen_glyph'):		fontElId = '#font_specimen_glyph';																					break;
			case hasContent('font_specimen'):			fontElId = '#font_specimen_viewer';																					break;
		}
		switch(true) {																																								// apply style to font element
			case hasContent('font_file') && /text_stroke/.test(id):																													// if font_file and text_stroke style...
				current_stroke_color = getEl('#text_stroke_color').value;
				text_stroke_color = ( getEl('#text_stroke_width').value < 0 ? 'white' : ( current_stroke_color === '' || /white|black/.test(current_stroke_color) ) && value > 0 ? 'black' : current_stroke_color )
				prop = ( id === 'text_stroke_width' ? 'stroke-width' : 'stroke' );		getEls(fontElId).forEach( el => el.setAttribute(prop,value + units) );
				if ( id === 'text_stroke_width' ) { getEls(fontElId).forEach( el => el.setAttribute('stroke',text_stroke_color) ); }										break;	// set prop on font file svg paths
			default:
				switch(true) {
					case ( /^cv|^ss|salt|swsh|ornm|nalt/.test(value) || id === 'font_tag_textarea' ):
						prop = 'font-feature-settings';		value = '"'+value.slice(0,4) +'" '+ value.slice(4); getEl('#font_tag_textarea').focus();						break;
					case props[id] !== undefined:																															break;
					case variant_value !== undefined:																value = variant_value;									break;
					case value?.length < 4:																			value = '';												break;
				}
																													getEl(fontElId)?.style.setProperty(prop,value + units);			// default: set style properties
		}
	}
	function fontReset(id) { let el_ids = ['font_tag_textarea','font_size','line_height','letter_spacing','text_color','text_stroke_width','text_stroke_color'], current_font;
		switch(true) {
			case id === 'reset':
				setValue('#font_variant_select','');	el_ids.forEach( el_id => getEl('#'+el_id).value = null );																		// default toolbar values
				switch(true) {
					case hasContent('font_specimen'):	setFontSpecimenViewerStyles(false);																		break;	// reset font_specimen
					case hasContent('font_file'):		setData('#font_file_grid','scale','1');																			// reset font_file
						getEls('#font_file_grid, #font_file_grid svg g').forEach( el => el.removeAttribute('style'));	getEls('#font_file_grid svg path').forEach( el => el.removeAttribute('stroke') );			break;
				}
			default:	if ( id === 'font_size' && hasContent('font_file') ) {																							// reset all font options...
							getEl('#font_file_grid').removeAttribute('style'); getEl('#font_file_grid').querySelectorAll('svg g').forEach(function(el) { el.style.transform = 'none' }); getEl('#'+id).value = 1;
						} else {
							fontOptions(null,id,null);																													// or reset individual font options by id
						}
		}
	}
	//============================// GRIDS
	function showGrid(id,bool) {	let selected_ID = ( id || getEl('.dirlist_item.selected')?.id );									// ===> SHOW GRID
		if ( id !== undefined && !elExists(('#content_pane li[data-id="'+ selected_ID +'"]') ) ) { gridMake(id); }								// initial make grid items, no dupes; else just unhide existing grid (see below)
		addClass('#show_grid_btn','has_grid');																									// add class to #show_grid_btn button
		setAttr('#content_pane','data-content','has_grid');																						// set content_pane data-content attribute
		removeClass('#content_pane','has_hidden_grid has_dir has_file has_font_specimen has_zoom_image');	removeClass('#content_pane div','selected hovered');	// remove classes; show hidden grid
		setContentTitle('','grid');																												// set content title
		addClass('#content_pane div[data-id="'+ selected_ID +'"]','selected');																	// reselect selected grid item
		if ( bool !== false ) { focusEl('#content_grid'); }																						// focus grid, unless shift navigating (bool === false => selecting multiple items)
		scrollThis('#content_grid','.grid_item.selected'); 		// scroll first item into view
	}
	function closeGrid(id) {																											// ===> CLOSE GRID
		switch(true) {
			case id === 'hide':			removeAttr('#content_pane','data-content'); addClass('#content_pane','has_hidden_grid');		break;	// hide grid, e.g., when viewing a grid item or other item
			case id !== 'close' && ( hasContent('font') || hasContent('image') ):											showGrid();	break;
			default:
				removeClass('#show_grid_btn','has_grid');																				// remove #show_grid_btn button class
				if ( id === 'close' ) { removeClass('#content_pane','has_hidden_grid'); }
				removeClass('#content_pane','has_image_grid has_font_grid has_zoom_image');	
				removeAttr('#content_pane','data-content');																				// remove data-content
				removeAttr('#content_title span','data-grid_item_count');																// remove data-grid_item_count
				removeAttr('#content_grid,.image_grid_item img','style');																// remove styles
				getEl('#content_grid').innerHTML = '';																					// empty #content_grid
				focusEl('#top_body'); if ( getEl('.dirlist_item.hovered') !== null ) {
					showThis(getEl('.dirlist_item.hovered').id); removeClass('.dirlist_item.hovered','hovered'); } else { showThis(getVisibleElsBySelector('.dirlist_item')[0].id);	// focus sidebar; show 1st sidebar item
				}																												break;
		}
	}
	function showContentGridItem(id,src,kind) { closeGrid('hide');																	// ===> SHOW GRID ITEM
		switch(true) {
			case elExists('#'+id):				addRemoveClassSiblings('#'+ id,'selected','selected'); 	removeClass('.grid_item.selected','selected');
												addClass('.grid_item[data-id="'+id+'"','selected'); getEl('#'+id).click();				break;	// normal grid item display
			case !elExists('#'+id):				showThis('',false,true,[src,kind]);														break;	// show grid items from closed subdirectory
		}		
		focusEl('#content_pane .has_content');
	}
	// ***** IMAGE/FONT GRID SETUP
	function gridMakeFontItems(id) {																												// ===> FONT GRID ITEMS
		let font_grid_items = '', font_files = ( id !== undefined ? getEls('#'+id) : getEls('.dirlist_item.font') ), new_grid_item, font_items_length = font_files.length;
		for ( let i = 0; i < font_items_length; i++ ) {																										// for each font...
			new_grid_item = showFont( font_files[i].id, true, 'font_grid','',i,font_items_length );	font_grid_items += new_grid_item;						// make new font_grid_item and add it to the font_grid_items
		}
		return font_grid_items;																																// return font_grid_items
	}
	function gridMakeImageItems(id) {																												// ===> IMAGE GRID ITEMS
		let image_grid_items = '', this_id, this_link, exts, title_name;
		let image_files = ( id !== undefined ? getEls('#'+id) : getEls('.dirlist_item.image:not(.ignored)') );
		let image_files_length = image_files.length, classes = 'grid_item image_grid_item flex_justify_center border_right_x border_bottom_x';
		for ( let i = 0; i < image_files_length; i++ ) {
			this_id = image_files[i].id;	this_link = image_files[i].querySelector('a').href;		title_name = this_link.slice(this_link.lastIndexOf('/') + 1);
			exts = Item_Kinds.image.filter( ext => !Item_Settings.ignored.includes(ext) );																	// decide which image files can be displayed
			if ( exts.includes(image_files[i].dataset.ext) ) {																								// if item ext is in the image extension array...
				let item = `<li class="${ classes } background_grey_90" data-ID="${ this_id }" data-index="${ i }" data-kind="image"><a href="${ this_link }"><img src="${ this_link }" title="${ title_name }" loading="lazy" /></a></li>`;																																				// make new image_grid_item
				image_grid_items += item;																													// ...add it to the image_grid_items
			}
		}
		return image_grid_items;																															// return image_grid_items
	}
	function gridMake(id) {	let el, kind;																											// ===> MAKE GRIDS
		const gridItemCount = () => {
			let count = getEl('#content_grid')?.children?.length, str = ( count !== 1 ? ' items' : ' item' );
			setAttr('#content_title span','data-grid_item_count',' ['+ count.toString() + str +']' );
		}
		if ( /rowid/.test(id) ) { el = getEl('#'+id); kind = el.dataset.kind; } else { getEl('#content_grid').innerHTML = ''; }								// remove previous grid items or make single grid item
		removeClass('#content_pane','has_hidden_grid has_image_grid has_font_grid'); removeAttr('#content_title span','data-grid_item_count');				// reset content_pane grid classes and data
		switch(true) {																																		// determine which grid type to make
			case el !== undefined:
				switch(kind) {																																// make single grid items on cmd-click
					case 'font':			getEl('#content_grid').insertAdjacentHTML('beforeend',gridMakeFontItems(id));							break;	// make single font grid item
					case 'image':			getEl('#content_grid').insertAdjacentHTML('beforeend',gridMakeImageItems(id));							break;	// make single image grid item
				} break;
			case id === 'show_font_grid':	addClass('#content_pane','has_font_grid');	getEl('#content_grid').innerHTML = gridMakeFontItems();		break;	// make font grid
			case id === 'show_image_grid':	addClass('#content_pane','has_image_grid');	getEl('#content_grid').innerHTML = gridMakeImageItems();	break;	// make image grid
			default:						getEl('#content_grid').innerHTML = gridMakeImageItems() + gridMakeFontItems();									// make image and font grid
		}
		gridItemCount();																																	// add grid item count to content_title
		initGridItemEvents();																																// register event watchers for added grid elements
	}
	// ***** IMAGE/FONT/GLYPH SCALE
	function scaleItems(e,incr,id,kind) { addClass('#reload_btn','reset');																					// add reset class to reload button
		switch(kind) {
			case 'has_grid':	scaleFonts(e,incr,id);		scaleImages(e,incr,id);																	break;	// scale grids
			case 'has_font':	scaleFonts(e,incr,id);																								break;	// scale glyphs
			case 'has_image':	scaleImages(e,incr,id);																								break;	// scale glyphs or images and fonts
		}
	}
	function scaleFonts(e,scale,id) { scale = ( scale <= 0 ? (1, getEl('#font_size').value = 1 ) : scale ); let incr = Number(scale).toFixed(4); if ( id === 'decrease' ) { incr = 1/incr; scale = 1/scale }	// ===> SCALE FONT
		let content_grid = getEl('#content_grid'), font_specimen_viewer = getEl('#font_specimen_viewer'), font_file_glyph, font_file_grid = getEl('#font_file_grid'), value, font_input_value, data_scale, transform_scale, translateY, el_id;
		let font_size = parseInt(getComputedStyle(document.body).fontSize).toFixed(4),	fontGetSize = function(el) { return Number.parseFloat(window.getComputedStyle(el).fontSize).toFixed(4); };
		switch(true) {
			case hasContent('grid'):								setStyle('#content_grid','font-size', ( fontGetSize(content_grid)/font_size * incr ) +'em');		break;	// scale grid font items
			// font files
			case hasContent('font_file_glyph'):	font_file_glyph = getEl('#font_file_glyph_viewer g');																				// scale font file glyph
				data_scale = font_file_glyph.style.transform;	data_scale = Number( data_scale.match(/[\.\d]+/g));   if ( data_scale === 0 ) { data_scale = 1; }					// define data_scale...
				switch(true) {
					case scale === null: data_scale = 1; font_input_value = 1; break;
					case ( /increase|decrease/.test(id) ):			data_scale = incr * data_scale;	font_input_value = Math.pow(data_scale,0.2);							break;	// ...for +/- buttons; set #font-size value
					default:										data_scale = ( data_scale >= 1? Math.pow(incr,5) : Math.pow(incr,1.25) );										// ...for #font_size slider
				}													font_file_glyph.style.transform = 'scale('+ data_scale +')';											break;	// scale glyph
			case hasContent('font_file'):
				if ( /increase|decrease/.test(id) ) {
					scale = ( font_file_grid.dataset.scale === undefined ? scale : Number(font_file_grid.dataset.scale) <= 0 ? 1 : Number(font_file_grid.dataset.scale) + Number(scale) - 1 );  // scale
					scale = Number(scale) * Number(incr);					font_input_value = scale;																							// set slider value
				}
				transform_scale = ( scale >= 1? Math.pow(scale,4) : Math.pow(scale,1.125) );	translateY = ( Number(scale) < 0.5 ? 0.5 : Number(scale) < 1.5 ? (1 - scale) : -0.5 );		// transform_scale & translateY
				font_file_grid.querySelectorAll('svg g').forEach(function(el) { el.style.transform = 'scale('+ transform_scale +') translateY('+ translateY +'em)'; });						// set transform scale & translateY
				if ( scale > 0.33 ) {
					font_file_grid.style.gridTemplateColumns	= 'repeat(auto-fit, minmax(max(52px,'+ Math.pow(scale,3) * 1.33 +'em ), 1.5fr))';											// scale font file grid cols
					font_file_grid.style.gridAutoRows							= 'minmax(max(52px,'+ Math.pow(scale,3.33) * 1.33 +'em), max-content)';										// scale font file grid rows
				}
				font_file_grid.dataset.scale = scale;																																break;
			// font specimens
			case hasContent('font_specimen_glyph'):	el_id = '#font_specimen_glyph';																											// scale font specimen glyph (in vw)
				switch(id) {
					case 'font_size':																																						// from font_size input slider
						if ( incr === null ) { value = 64; } else { value = 64 * Math.pow(incr,3) }	// max value of incr = 64 * 2^3 = 512													// reset if scale is 0
						setStyle(el_id,'font-size', value +'vw');			getEl(el_id).dataset.scale = Number(value/64).toFixed(4);												break;
					default:																																								// from increase/decrease buttons
						getEl(el_id).dataset.scale = Number(getEl(el_id).dataset.scale) * incr;		data_scale = Number(getEl(el_id).dataset.scale);										// update data-scale; define data_scale
						value = (64 * data_scale) +'vw';	setStyle(el_id,'font-size',value);		font_input_value = Math.pow(data_scale,0.3333);											// set the font-size using data-scale
				}																																									break;
			case hasContent('font_specimen'):			el_id = '#font_specimen_viewer';
				switch(id) {																																								// scale font specimen
					case 'font_size':																																						// from font_size input slider
						if ( Number(incr) === Number(0.0000) ) { incr = 1; getEl('#'+id).value = 1; }																						// reset font size
						setStyle(el_id,'font-size', ( Math.pow(incr,4) +'em' ));	getEl(el_id).dataset.scale = Number(incr).toFixed(4);											break;	// set the font size
					default:																																								// from increase/decrease buttons
						if ( Number(fontGetSize(font_specimen_viewer)) === 0 ) { incr = 1; } else { incr = Number(fontGetSize(font_specimen_viewer)/font_size * incr); }					// reset if scale is 0
						getEl(el_id).dataset.scale = incr.toFixed(4);	setStyle(el_id,'font-size', incr.toFixed(4) +'em');
						font_input_value = Math.pow(incr,0.25);
					}																																								break;
		}
		if ( (id === 'font_size' && scale === null) || id !== 'font_size' ) { getEl('#font_size').value = font_input_value }																// set #font_size input value
		scrollThis('#content_container','#content_font');																																	// scroll content_font
	}
	function scaleImages(e,incr,id) {																										// ===> ZOOM IMAGES ON CLICK
		let content_el = ( elExists('#content_body') && elExists('#content_body > img') ? getEl('#content_body') : getEl('#content_container') );
		let this_img = ( elExists('#content_body > img') ? getEl('#content_body > img') : getEl('#content_image') );								// define this_img
		let CC_width = Math.round(content_el.offsetWidth),	CC_height = Math.round(content_el.offsetHeight);										// content_container dimensions
		let img_width = Math.round(this_img.offsetWidth), img_height = Math.round(this_img.offsetHeight);											// this_img dimensions
		let CC_offset, img_offset, percentX, percentY, scrollX, scrollY;
		const iframe_delta = ( getEls('#content_body > img').length === 1 ? Number.parseInt(getEl('#content_body').style.padding) : 0 );
		switch(true) {
			case hasContent('grid'):		scaleImageGrid(incr,id); break;																			// scale grid images
			default:																																// scale single images
				imageGetDimensions( this_img.src, ( width,height ) => {
				switch(true) {
					case incr !== undefined && id !== undefined:																					// scale images by increment
						addClass('#content_pane','has_scaled_image'); removeClass('#content_pane','has_zoom_image');								// remove zoom classes in case window resized after zoom
						switch(true) {
							case id === 'increase':												this_img.style.cssText = `width:${img_width * incr}px; height:auto; max-width:none; max-height:none;`;	break;
							case id === 'decrease' && ( img_width >= 1 && img_height >= 1 ):	this_img.style.cssText = `width:${img_width / incr}px; height:auto; max-width:none; max-height:none;`;	break;
						}
						if ( Math.round(this_img.offsetWidth) >= CC_width ) { getEl('#content_image_container').scrollLeft = ( Math.round( this_img.offsetWidth ) - CC_width )/2; }			// keep scaled img centered
						switch(true) {																																							// keep scaled img centered
							case Math.round(this_img.offsetHeight) <= CC_height: getEl('#content_image_container').scrollTop = ( CC_height - Math.round( this_img.offsetHeight ) )/2;	break;
							default: getEl('#content_image_container').scrollTop = ( Math.round(this_img.offsetHeight) - CC_height )/2;													break;
						}																												break;
					default:																													// else zoom single image on click
						if ( width <= CC_width && height <= CC_height ) {																		// click to toggle small images between 100% and full size
							if ( /100%/.test(this_img.getAttribute('style')) ) { this_img.removeAttribute('style'); } else { this_img.style.width = '100%'; }
							removeClass('#content_pane','has_zoom_image has_scaled_image');											return;	// no need to set scroll position
						}
						CC_offset = content_el.getBoundingClientRect();		img_offset = this_img.getBoundingClientRect();						// get offsets
						percentX = Number((e.pageX - img_offset.left)/img_width).toFixed(2);	percentY = Number((e.pageY - img_offset.top)/img_height).toFixed(2)	// x,y coordinates of zoom click as % of image width/height
						scrollX = (width * percentX) - e.pageX + CC_offset.left - (iframe_delta * width / img_width);							// calculate clicked x-coordinates for full-size image
						scrollY = (height * percentY) - e.pageY + CC_offset.top - (iframe_delta * height / img_height);							// calculate clicked y-coordinate for full-size image
						removeClass('#content_pane','has_scaled_image');																		// in case image scaled already
						getEl('#content_pane').classList.toggle('has_zoom_image');
						getEl('#content_image_container').scrollTo(scrollX,scrollY);															// scroll to clicked position
				}
			});
			imageSetDimensions();		focusEl('#content_image_container');																	// set image dimensions
		}
	}
	function scaleImageGrid(incr,id) {																									// ===> SCALE IMAGE GRID ITEMS
		if ( id === 'decrease' ) { incr = 1/incr; }
		let grid_container =  getEl('#content_grid'), grid_items = getEls('.image_grid_item img');
		if ( !grid_items?.length ) { return; }
		let grid_item_width =		Number.parseFloat( grid_items[0].offsetWidth,10) * incr;
		let grid_item_height =		Number.parseFloat( grid_items[0].offsetHeight,10) * incr;
		let grid_item_max_width =	Number.parseFloat( grid_items[0].style.maxWidth,10) * incr;
		let grid_item_max_height =	Number.parseFloat( grid_items[0].style.maxHeight,10) * incr;
		if ( grid_item_width < grid_item_max_width ) { grid_item_width = grid_item_max_width; }													// don't reduce grid image size on first scale click
		if ( grid_item_height < grid_item_max_height ) { grid_item_height = grid_item_max_height; }												// don't reduce grid image size on first scale click
		grid_container.style.gridTemplateColumns = 'repeat(auto-fill, minmax('+ (grid_item_width + 16) +'px, auto ) )';							// set grid properties
		grid_items.forEach( (el) => { el.style.maxWidth = grid_item_width +'px'; el.style.maxHeight = grid_item_height +'px'; });				// set grid properties
		return;
	}
	function imageGetDimensions(link, callback) { if ( link !== undefined ) { let img = new Image();  img.src = link; img.onload = function() { callback( this.width, this.height ); }; img = null; } }	// GET IMG DIMENSIONS
	function imageSetDimensions() { if ( !isTopWindow() ) { return; }																	// ===> SET IMAGE DIMENSIONS; // ignore iframe image
		switch(true) {
			case hasContent('image'):
				imageGetDimensions( getAttr('#content_image','src'), function( width,height ) {													// imageGetDimensions()
					let percentage = (( getEl('#content_image').width/width ) * 100 ).toFixed(1);												// define percentage
						setAttr('#content_title span','data-after',' ('+ width +'px × '+ height +'px) ('+ percentage +'%)' );					// set dataset.after for content_title
				});																														break;
			default: removeAttr('#content_title span','data-after');																			// remove image dimensions
		}
	}
	//============================// SHOW TEXT EDITOR
	function showTextEditor(bool) {																										// ===> SHOW TEXT EDITOR; bool === false => hide editor
		switch(true) {
			case bool === false: case hasClass('body','has_texteditor'):	removeClass('body','has_texteditor'); if ( elExists('.dirlist_item.selected') ) { null } else { focusEl('#top_body'); }		break;	// close editor
			case !hasClass('body','has_texteditorUI'):						buildTextEditorUI();												// no break; add the text editor UI if needed
			default:				addClass('body','has_texteditor');		addClass('#top_body','focus_content'); getEl('#texteditor_raw_pane').focus();								// show editor: add class, focus texteditor
		}
	}
	function tempHideTexteditor() { getEl('head').insertAdjacentHTML('beforeend','<style id="temp_styles">#text_container {display:none;}</style>'); }	// ...hide editor UI for link files until formatted_link received from top
	// to prevent FOUC for some kinds of content...
	function showTexteditorPreview(content) {																							// ===> SHOW TEXTEDITOR PREVIEW
		removeClass('#content_body','texteditor_view_raw texteditor_view_html');																// remove classes
		addClass('#content_body','is_link texteditor_split_view_false texteditor_view_styled text_editing_enable_false');						// add classes to prevent editing without changing UI_Pref
		getEl('#texteditor_styled_pane').innerHTML = content;																					// insert processed text from top
		getEl('#temp_styles').remove();																											// show texteditor after hiding it until processed content received
	}
	//============================// PDF
	function showPDF() {																												// ===> SET UP CONTENT_PDF
		let pdf_container = `<embed id="content_pdf" class="content_el position_relative border_0" tabindex="0" data-kind="pdf">`;				// replace content_pdf for each pdf
		getEl('#content_pdf').remove();																											// remove existing content_pdf el
		getEl('#content_image_container').insertAdjacentHTML('afterend',pdf_container);															// add new content_pdf el
	}
	//============================// LINK FILES
	function openLinkFile(e,id) {	eStopPrevent(e);																					// ===> OPEN LINK FILES: on cmd-arrowdown or dblclick (webloc, url)
		let link = getEl('#'+id).dataset.link;																									// get the link
		switch(true) {
			case link === undefined:																																	break;
			case !hasClass('#'+id,'non_local'):		if ( !isTopWindow() ) {	window.location = link; } else { showThis('open_link_file',false,true,[link,'link']); }		break;
			default:								window.open(link);																			// else open link file links in new window
		}
	}
	function linkFileProcess(kind,content) {																							// ===> LINK FILE PROCESS: on "iframe_loaded" message received
		let link_item = getEl('.dirlist_item.content_loaded.link'), link_content = content || getData(link_item,'html_content') || '', regex = /URL\=(.+?)$|<key>URL<\/key>\s*<string\>(.+?)<\/string\>/im;
		let link = ( link_content?.match(regex)?.[1] || link_content?.match(regex)?.[2] );
		let link_class = '', link_target = '', formatted_link;		// get the link; define link elements
		switch(true) {
			case kind === 'remote_webloc' && window_protocol !== 'file:': content = content.trim().replace(/^URL[\s\W\t\n\r]+/i,''); 
				getEl('#content_iframe').src = "data:text/html;charset=utf-8," + escape(`<html><head><meta name="color-scheme" content="light dark"><style id="texteditor_styles">${texteditor_styles}</style><style id="global_styles">${global_styles}</style><style id="utilities_styles">${utilities_styles}</style></head><body id="content_body" class="is_text text_editing_enable_true texteditor_split_view_true texteditor_sync_scroll_true texteditor_view_styled theme_${getCurrentUIPref('theme')} is_link texteditor_split_view_false text_editing_enable_false"><div id="content_texteditor" class="background_grey_85 margin_0 padding_0 width_100 height_100 overflow_hidden position_absolute z_index_1 flex_column flex_grow_1 display_none"><div id="text_container" class="display_flex flex_grow_1 overflow_hidden"><div id="texteditor_styled_pane" class="texteditor_pane margin_0 border_0 line_height_1_2 text_color_default height_100 display_none markdown_body z_index_1"><a href="${ content }">${ content }</a></div></div></div></body></html>`);
										return;
			case window_protocol === 'file:' && !link?.startsWith('file'): getEl('.dirlist_item.selected').classList.add('non_local'); link_class = ' class="non_local"'; link_target = ' target="_blank"'; break;
			case window_protocol !== 'file:' && link?.startsWith('file'): getEl('.dirlist_item.selected').classList.add('local'); link_class = ' class="local"'; break;
		}
		formatted_link = '<a id="link_file_01" href="'+ link +'"'+ link_class + link_target +'>'+ link +'</a>';									// assemble formatted link
		link_item.dataset.link = link;																											// set data-link on sidebar item
		link_item.dataset.html_content = null;																									// remove data-html_content
		messageSend('iframe','show_texteditor_preview','',formatted_link);																		// send formatted link to iframe for display
	}
	//============================// DIRECTORY SOURCE
	function showDirectorySource(link) {																								// ===> SHOW DIRECTORY SOURCE
		switch(true) {
			case hasClass('body','has_directory_source'):		removeClass('body','has_directory_source');			showThis(getEl('.dirlist_item.non_media.selected').id); break;			// close if open
			default: addClass('body','has_directory_source');	showThis('show_directory_source',false,true,[(link || window_location)]); setAttr('#content_pane','data-loaded','loaded');	// else show directory source
		}
	}
	function openSidebarInContentPane() { showThis('open_sidebar_in_content_pane',false,true,[window_location,'dir']); addClass('#top_body','open_sidebar_in_content_pane'); }			// ===> OPEN SIDEBAR IN CONTENT PANE
	function openInTextEditor() {																										// ===> OPEN IN TEXT EDITOR
		let html = getData('.dirlist_item.htm.content_loaded','html_content');
		showTextEditor(true);
		if ( html !== undefined ) { getEl('#texteditor_raw_pane').value = html; getEl('#texteditor_styled_pane').value = html; getEl('#texteditor_html_pane').value = html; }	// set previewed text
		getEl('#open_in_texteditor')?.blur();
	}
	// END SHOW INDIVIDUAL CONTENT TYPES
	//============================// AUTOLOAD CONTENT
	function autoLoadItems() {																									// ===> AUTOLOAD FILE: index files or files from the file shortcut list
		let selected_el = getEl('.dirlist_item.dir[id="rowid-'+ Number(getCurrentUIPref("selected")) +'"]');
		switch(true) {
			case ( selected_el !== null && isTopWindow() && searchParamsGet().has('selected') ):			showThis(selected_el.id);	break;	// select from searchParam; prevents being overridden by autoload media
			case ( getCurrentUIPref('autoload_index_files') !== 'false' && elExists('.dirlist_item.file.htm a[href*="/index."]') ):				// load index file
				showThis( getEl('.dirlist_item.file.htm a[href*="/index."]').closest('.dirlist_item').id );								break;
			case selected_el !== null && selected_el.classList.contains('local'):	case !isTopWindow():								break;	// do nothing for local files or iframes
			case searchParamsGet().has('file'): {																								// load files (from bookmark or url)
					let file_name = decodeURIComponentSafe(getCurrentUIPref('file'));
					let file = Array.from(getEls('.dirlist_item.file')).filter ( el => el.dataset.name === file_name );
					if ( file[0] !== undefined ) { showThis( file[0].id ); }
					searchParamDelete('file');
				}																														break;
			case hasClass('body','has_video'):	getEl('video').volume = '0.5';																	// video; set video volume
				if ( getCurrentUIPref('media_autoload') === 'true' && !hasClass('body','has_audio') ) { showThis(getEl('.dirlist_item.video')?.id ); break; }	// load video only if no audio
			case hasClass('body','has_audio'):	getEl('#content_audio').volume = '0.5';															// audio; set audio volume
				if ( getCurrentUIPref('media_autoload') === 'true' ) { showThis(getEl('.dirlist_item.audio')?.id ); }					break;	// load audio
			case selected_el !== null:														showThis( selected_el.id,false,true );		break;
		}
		if ( getEl('.content_el.has_content') === null ) { setData('#content_pane','content','has_null'); }
		if ( selected_el !== null ) { scrollThis('#directory_list','.selected'); }
	}
	function getImageNames(id) {																														// ===> GET IMAGE NAMES (for cover art)
		let images = getEls('.dirlist_item.image'), image_names = [], image_name, subdir_prefix;
		if ( id.includes('_') ) {
			subdir_prefix = RegExp("^"+id.slice(0,id.lastIndexOf('_') + 1),'m');    images = Array.from(images).filter( image => subdir_prefix.test(image.id) ); // filter images by subdir of selected item
		}
		for ( let image of images ) {
			if ( image.id.split('_').length === id.split('_').length ) {																										// if audio and found image in same dir level...
				image_name = image.dataset.name;    image_name = image_name.slice(0,image_name.lastIndexOf('.') );    image_names.push( {'id':image.id,'name':image_name} );	// get image name w/o extension, add to image_names
			}
		}
		return image_names;
	}
	function getCoverArtID(id) {																														// ===> GET COVER ART ID
		let cover_art_id, match, exact_match, cover_names = ['cover','front','album','jacket','sleeve','cd','disc','insert','liner','notes'];
		let selected_audio_name = ( getData('.file.audio.selected','name') || undefined );	// is there an image file with the same name?
		if ( selected_audio_name !== undefined ) { selected_audio_name = selected_audio_name.slice(0,selected_audio_name.lastIndexOf('.'));	cover_names.unshift(selected_audio_name); }	// prep the name & add to cover names
		const image_names = getImageNames(id);																													// get names of all image files
		if ( image_names?.length === 0 ) { closeContent('image'); return; }																						// close existing image if no cover art found
		for ( let cover_name of cover_names ) {																													// test available image names against cover names
			exact_match = image_names.filter( el => el.name === cover_name );	match = image_names.filter( el => el.name.indexOf(cover_name) > -1 );			// check for exact and partial matches
			switch(true) {
				case exact_match.length > 0:	return cover_art_id = exact_match[0].id;																		// if exact match, return
				case match.length > 0:			return cover_art_id = match[0].id;																				// else return first match
			}
		}
		if  (cover_art_id === undefined ) { return cover_art_id = image_names[0].id; }																			// if no matches, return first image id
	}
	function autoLoadCoverArt(bool,id) {																												// ===> AUTOLOAD COVER ART if dir contains audio & images
		if ( bool === false || !isTopWindow() ) { setData('#content_pane','content','has_null'); return; } if ( !hasClass('body','has_images') ) { return; }	// do nothing if no audio or images
		let cover_ID = getCoverArtID(id), selected_ID = ( getCurrentUIPref('selected').length > 0 ? 'rowid-'+ getCurrentUIPref('selected') : undefined);
		if ( cover_ID !== undefined ) {
			showThis(cover_ID,true,true,[getEl('#'+cover_ID).querySelector('a').href,false]);	removeClass('#'+cover_ID,'selected'); addClass('.dirlist_item.audio_loaded','selected')
		} else { removeClass('.dirlist_item.image','content_loaded');		}
		//if ( selected_ID !== undefined && typeof selected_ID === 'number' ) { removeClass('.dirlist_item.media','selected'); addClass('#'+selected_ID,'selected'); }
	}
	//============================//
	// ***** MAIN SHOW CONTENT FUNCTIONS ***** //
	//============================//
	// LINKS, SEARCH PARAMS, AND QUERIES
	function makeSrcSearchParams(kind) {																									// ===> GET LINK QUERIES
		let query_str = '', params;
		const makeSearchParams = (params,query_str) => { query_str = new URLSearchParams(); for ( let param of params ) { query_str.append(param,getCurrentUIPref(param)); } return query_str; }	// ===> MAKE SEARCH PARAMS
		switch(true) {
			case ( /audio|font|image|video/.test(kind) ):																					break;	// no query_str for audio, fonts, images, video, or htm
			case kind === 'show_directory_source':								query_str = '?&show_directory_source=true';					break;	// view directory source
			case kind === 'pdf':												query_str = '#view=fitB&scrollbar=1&toolbar=1&navpanes=1';	break;	// query_str for pdfs
			case kind === 'htm':												query_str = '?theme='+getCurrentUIPref('theme');					break;	// query_str for htm files; allow improved dark mode styles
			case ( /text|markdown|code|other|link/.test(kind) ):																					// editable text files (including dot and plaintext files ["other"])
				params = ['theme','text_editing_enable','texteditor_view','texteditor_split_view','texteditor_sync_scroll'];						// define array of required params for text editing
																				query_str = '?'+ makeSearchParams(params).toString();		break;	// compose query_str for text files
			case ( /app|dir/.test(kind) ):
				params = ['sort_by', 'sort_direction', 'show_details', 'show_image_thumbnails', 'show_large_image_thumbnails', 'show_numbers', 'use_custom_icons', 'show_invisibles', 'show_ignored_items', 'ignore_ignored_items', 'alternate_background', 'theme', 'media_play_all'];
				if (searchParamsGet().has('ui_font')) {params.push('ui_font');}	query_str = '?'+ makeSearchParams(params).toString();		break;	// define array of params for dirs; compose query_str for dirs
		}
		return query_str;																															// return query_str
	}
	//============================// DIRS & SUBDIRS
	function dirOpen(args) {	// args: [dir.selected.id,dir.selected a.href]																// ===> OPEN DIR (dirs only): update selected and history searchParam in querystring
		const updateHistory = function(id) { let id_arr = id.split('_'); id_arr = id_arr.map(el => el.split('-')[1] ); return id_arr.reverse().join('+'); }	// get numerical part(s) of selected dir/subdir id
		let item = document.getElementById(args[0]), history = updateHistory(args[0]), searchParams = searchParamsGet();							// get selected item, history, and searchParams object
		if ( item.classList.contains('dir') && item.classList.contains('invisible') && item.classList.contains('ignored') ) { return; }				// don't attempt to open ignored invisible dirs (chiefly system dirs)
		searchParams.delete('selected');																											// delete 'selected' searchParam
		history = ( searchParams.has('history') ? history +'+'+ searchParams.get('history') : history );	searchParams.set('history',history);	// configure and set 'history' searchParam
console.log(args)
console.log(window.location.protocol);
console.log(newURL(args[1]));
		window.location = newURL(args[1]).href +'?'+ searchParams.toString().replace(/%2B/g,'+');																// set the window location, replacing encoded + sign.
	}
	function subDirOpen(parent_id) {																										// ===> OPEN SUDIRECTORY
		let parent_el = document.getElementById(parent_id), parent_link = parent_el.querySelector('a').href, level = Number(parent_el.dataset.level) + 1, body_id = document.body.id;	// define subdir level
		let content_iframe_utility_src = parent_link + makeSrcSearchParams('dir') + '&parent_id='+ parent_id +'&subdirectory=true&level='+ level +'&body_id='+ body_id;					// assemble src link for utility_iframe
		setAttr('#content_iframe_utility','src',content_iframe_utility_src);																		// set src for utility_iframe (which processes dir & sends it back to top)
		parent_el.classList.add('dirlist_subdir_loading');																							// removed when iframe_utility sends loaded message with subdir data
	}
	function subDirClose(subdir_id) { subdir_id = [subdir_id];																				// ===> CLOSE SUBDIRECTOY
		if ( !elExists('.dirlist_item.has_subdirectory') ) { return; }
		let classes = [{ font:'has_fonts'},{image:'has_images'},{media:'has_media'},{audio:'has_audio'}];											// if no items with these classes found, remove the body class
		if ( subdir_id[0] === undefined ) { subdir_id = []; Array.from(getEls('.dirlist_item.has_subdirectory')).forEach( el => subdir_id.push(el.id) ) }	// close all subdirs if no id given
		subdir_id.forEach( (el_id) => {
			removeClass('#'+el_id,'has_subdirectory content_loaded');
			getEls('.dirlist_item').forEach( (el) => { if (el.id.startsWith(el_id + '_')) { el.remove(); } });										// remove all items whose id begins with subdirectory parent id
			classes.forEach ( (item) => { let key = Object.keys(item).toString(); if ( !elExists('#directory_list li.'+ key)) { removeClass('body',item[key].toString()) } });
			if ( !elExists('.dirlist_item.selected') ) { getEl('#'+ el_id).classList.add('selected'); }												// select closed dir if no other selected item exists
		});
		updateStats(false);
	}
	function subDirOpenClose(e,id) { if ( e !== null ) { eStopPrevent(e); e.stopImmediatePropagation();  }									// ===> OPEN CLOSE SUBDIRECTORY; e === null when opening multiple subdirs
		let parent_el = getEl('#'+id);		removeClass('body','has_menu_stats');
		switch(true) {
			case ( parent_el.querySelector('.name') !== null && /\.trashes|\.temporaryitems|\.spotlight-v\d+/.test(parent_el.querySelector('.name').dataset.name ) ):
				parent_el.classList.remove('dirlist_subdir_loading');																	break;
			default: if ( parent_el.classList.contains('has_subdirectory') ) { subDirClose(id); } else { subDirOpen(id); }	// if ( e !== null ) { showThis(id,true,false); } // select parent dir	// open/close the subdir
		}
	}
	function subDirInsert(args) {	// args = [items,classes,parent_id]; message received: add the subdirectory to the dir_list, update stats, check for additional selected dirs
		let parent_item, source_el;
		if ( !elExists('.dirlist_item.dirlist_subdir_loading') ) { return; } else { parent_item = document.getElementById(args[2]); }				// select loading dir by id (args[2])
		parent_item.classList.remove('dirlist_subdir_loading');		parent_item.classList.add('has_subdirectory');									// remove "loading" class, add "has_subdirectory" class
		parent_item.insertAdjacentHTML('afterend',args[0]);																							// insert subdir items
		if ( getCurrentUIPref('show_image_thumbnails') === 'true' ) { uiPrefImgThumbsToggle('true'); }
		updateStats(true);																															// update stats
		['has_fonts','has_images','has_media','has_audio'].forEach( (subdir_class) => { if ( args[1].split(' ').includes(subdir_class) ) { addClass('body',subdir_class) } });	// add new body classes
		initDirListEvents();	initIframeEvents();		 if ( /media/.test(args[1]) ) { refreshMediaDurations('refresh_media_durations'); }			// init dir_list event listeners
		if ( elExists('.dir.selected:not(.has_subdirectory)') && parent_item.classList.contains('selected') ) {		// open multiple selected subdirs, but don't open selected if current item is not selected
			subDirOpenClose(null,getEl('.dir.selected:not(.has_subdirectory)').id);									// i.e., allow unselected dirs to be opened by icon click without also opening selected dirs
		}
		if ( isTopWindow() ) {																						// reselect current content (audio or content_pane) if it was originally in newly-reopened subdirectory:
			if ( /media/.test(args[1]) ) {
				if ( !hasContent() ) { showThis(getEl('.dirlist_item.media[id^="'+ parent_item.id +'"]').id); }	// autoload media from new subdirs, if no media or other content currently loaded
				else if ( hasClass('#content_pane','has_audio') ) { addClass('#'+ getData('#content_audio','src_id'),'audio_loaded'); }					// else reselect loaded audio file
			}
			if ( !hasContent('null') ) {
				source_el = getEl('#'+ getData('#content_pane','loaded_id') );																		// get content_el by content_source
				if ( source_el !== null ) {
					removeClass('.dirlist_item.file.non_media.selected,.dirlist_item.file.non_media.content_loaded','selected content_loaded'); source_el.classList.add('selected','content_loaded');
				}
			}
		}
		lazyLoadImageThumbs();
	}
	//============================//
	// FOCUS ELS
	function focusEl(sel,e) { let content_pane_data = getContentPaneData(), content_el_id = ( 'content'+ content_pane_data?.slice(3) || '' ), bool = false, incr = 1;	// ===> FOCUS CONTENT
		sel = ( sel === null || sel === undefined ? '#top_body' : !sel.startsWith('#') ? '#'+ sel : sel );																		// enforce correct sel format
		menuClose();	document.activeElement.blur();																															// close menus, blur active element
		switch(true) {
			case sel === '#top_body':	case sel === undefined:																													// focus sidebar
				switch(true) {
					case isTopWindow():  removeClass('body','focus_content');   getEl(sel).focus();    scrollThis('#directory_list','.selected');				break;
					case !isTopWindow(): messageSend('top_body','focus_top');																					break;
				}
				break;
			case sel === '#content_iframe': selectThisItem(getData('#content_pane','loaded_id'));
				switch(true) {
					case isTopWindow():												addClass('body','focus_content');	getEl('#content_iframe').focus();
						if ( e !== undefined && e.key === 'Tab' ) {
							if ( e.shiftKey ) { bool = true; incr = -1; }
							switch(true) {
								case hasContent('dir'):									messageSend('iframe','iframe_navigation','',[e.key,bool]);				break;
								case hasContent('code,htm,markdown,text,other,link'):	messageSend('iframe','navigateTabKeyFocus',null,['texteditor',incr]);	break;
							}
						}																																		break;
					case !isTopWindow():	quickLookThis('close');			messageSend('top_body','focus_iframe');												break;
				}
				break;
			case sel === '#content_pane':	selectThisItem(getData('#content_pane','loaded_id'));																break;	// <-- test and clean this    focusEl\('#content_pane
			case sel !== '#top_body':		selectThisItem(getData('#content_pane','loaded_id'));																																// All other sel
				addClass('#top_body','focus_content'); removeClass('body','is_blurred');
				switch(true) {																																			// switch according to content_pane_data
					case content_pane_data === undefined && isTopWindow():										removeClass('body','focus_content');	document.body.focus();	break;	// don't focus undefined content
					case hasContent('font'):
						getEl(sel)?.focus();
						if ( !hasContent('font_specimen_glyph') && !hasContent('font_file_glyph') ) { removeClass('#content_font .selected','selected'); }
						switch(true) {
							case sel === '#font_file_glyph_container_0':		addClass(sel,'selected'); scrollThis('#font_file_grid','.selected');		getEl(sel)?.focus();		break;
							case sel === '#font_specimen_glyph_container_0':	addClass(sel,'selected'); scrollThis('#font_specimen_grid','.selected');		break;
						}
						switch(true) {
							default: getEl(sel)?.focus();																										break;
							case sel === '#font_toolbar':												getEl(sel)?.focus();									break;
							case e?.key === 'Tab' || sel === '#font_specimen_1':						getEl('#font_specimen_1')?.focus();						break;
							}																																	break;
					case hasContent('grid,image,video,pdf'):											document.getElementById(content_el_id).focus();			break;
					default:																			getEl(sel)?.focus();
				}
				break;
		}
	}
	//============================//
	// SELECT DIR LIST ITEMS
	function selectThisItem(id,args) {	let el = getEl('#'+id), kind = ( el?.dataset?.kind ?? null ); //, id_arr;					// ===> SELECT THIS on click and set classes for content_pane; args = bool scroll or not
		switch(true) {
			case id === 'close':	case getEl('#'+id) || id === 'open_sidebar_in_content_pane':									return;
			//case ( /_/.test(id) && !isTopWindow() ): id_arr === id.split('_');
				//id_arr.forEach( id => { subDirOpenClose(null,id); id_arr.shift(); } );	break;	// we'd like to reopen iframe subdirs when iframe file/dir item from a subdir is closed
			case el === null:																										break;
			case kind === 'audio':	removeClass('.audio','selected'); el.classList.add('selected'); if (!isTopWindow() ) { removeClass('.non_media','selected content_loaded'); }	break;	// audio; iframe dirlists
			default:	removeClass('body','has_directory_source'); addRemoveClassSiblings('#'+ id +':not(.audio)','selected content_loaded');	// select dir_list item; remove classes from siblings, leave .audio with .playing
		}
		if ( !/audio/.test(kind) && !/grid|/.test(id) ) { addRemoveClassSiblings('#'+ id,'content_loaded','content_loaded'); }	// only remove siblings content_loaded class and change content_pane data-source if not audio
		if ( /audio|video/.test(kind) && id !== undefined && (Number(getThisDuration(id)) === 0 || isNaN(Number(getThisDuration(id))) )) { refreshMediaDurations(id); }	// reset media duration if necessary.
		if ( args?.[1] !== false ) { scrollThis('#directory_list','.selected'); }																						// bool = false from autoloadcover art
	}
	function selectMultipleItems(e,id) { e?.preventDefault();																					// ===> SELECT MULTIPLE ITEMS (dirs, fonts, images only)
		if ( e?.key !== 'a' && id === undefined || !/app|dir|font|image/.test(getEl('.dirlist_item.selected').dataset.kind )) { return; }
		let el = getEl('#'+id), els, kind = ( el?.dataset.kind || 'dir' ), selected_el, selected_el_index, el_index;
		switch(true) {
			case e?.shiftKey:																															// shiftKey: range select
				selected_el = getEl('.dirlist_item.selected.'+kind ); els = Array.from(getEls('.dirlist_item.'+kind));
				el_index = els.indexOf(el); selected_el_index = els.indexOf(selected_el);
				els = ( el_index > selected_el_index ? els.slice(selected_el_index,el_index + 1) : els.slice(el_index,selected_el_index + 1) );			// select up or down from selected item
				els.forEach( el => selectMultipleItems(null,el.id) );
				break;
			case e.key === 'a':	e.preventDefault(); 														// cmd + a: select all	
				if ( isTopWindow() ) { closeContent(); }
				kind = ( getEls('.dirlist_item.dir.selected,.dirlist_item.app.selected,.dirlist_item.image.selected,.dirlist_item.font.selected')[0]?.dataset.kind || 'dir');
				getEls('.dirlist_item.selected,.dirlist_item.content_loaded').forEach( el => el.classList.remove('selected','content_loaded') );
				els = getEls('.dirlist_item.'+kind);	els?.forEach( el => el.classList.add('selected') );
				if ( /image|font/.test(kind) ) { showGrid('show_'+kind+'_grid'); }																break;	// show grid of all fonts/images
			case ( /image|font/.test(kind) ) && isTopWindow():																							// select font or image
				removeClass('.dirlist_item.selected:not(.font):not(.image)','selected');  removeClass('.dirlist_item.content_loaded','content_loaded');  el.classList.add('selected');  showGrid(id,false);		break;	// grids
			case ( /dir|app/.test(kind) ):	closeContent(); removeClass('.dirlist_item.file.selected','selected'); removeClass('.dirlist_item.content_loaded','content_loaded'); el.classList.add('selected');	break;	// dirs
		}
	}
	//============================//
	// ===> SHOW CONTENT FUNCTIONS
	function openFiles(e,id) { let funcName = id; // id/funcName === 'open_font' or 'open_playlist'
		switch(e.type) {
			case 'click':
				switch(true) {												// These cases are only for when a playlist or font file is already open (check for edited content_iframe...)
					case (/has_\w+list/.test(getClassNames('body') )):		e.preventDefault(); showWarning(funcName,'close_playlist');			break;	// showWarning('openFile');
					case hasContent('font_file'):							e.preventDefault(); showWarning(funcName,'close_font');				break;	// showWarning('openFile');
				}																																break;
			case 'change':																	openFile([e,id]);									break;
		}
	}
	// ===> SET CONTENT TITLE
	function setContentTitle(id,kind,file_name,src,bool) {																						// ===> SET CONTENT TITLE
		let title_text = '', selected_title = getData('.dirlist_item.selected','title'), selected_item = getEl('.dirlist_item.selected'), selected_link, content_link, content_link_info = getLinkInfo(src);
		let title_span = ( kind === 'has_audio_error' ? getEl('#content_audio_title span') : getEl('#content_title span') );
		switch(true) {
			case id === 'close':											removeAttr('#content_title span','data-after'); removeAttr('#content_title span','data-grid_item_count');	break;
			default:
				selected_link =	( selected_item !== null ? decodeURIComponentSafe( selected_item.querySelector('a').pathname ).trim() : '' );			// get selected item link
				content_link =	( content_link_info !== undefined ? decodeURIComponentSafe( content_link_info[0] ).trim() : '' );						// get content link
				switch(true) {
					case kind === 'has_audio_error':						title_text = "Audio file not found";								break;	// audio error title
					case kind === 'content_error':							title_text = "File not found";										break;	// content error title
					case kind === 'grid':									title_text = current_dir_path;										break;	// grid title
					case selected_link !== content_link && bool !== false:																				// nav unsynced iframe items and...
						try { title_text = decodeURIComponentSafe(content_link_info[8]) } catch(error) { title_text = content_link; }			break;	// ...error pages
					default:												title_text = file_name || selected_title;									// nav synced iframe items
				}
				if ( kind !== 'grid' )	{ title_text = title_text?.split('/').join('/<wbr>')?.split('_').join('_<wbr>'); removeAttr('#content_title span','data-after'); }	// allow nice line breaks in title
				if ( kind === 'image' ) { imageSetDimensions(); }																						// show images; set image dimensions
		}
		if ( title_span !== null ) { title_span.innerHTML = title_text; }																				// set title text
	}
	function showContentPaneEl(id) { setAttr('#content_pane','data-content','has_'+id); addClass('#content_'+id,'has_content'); getEl('#content_title span').innerHTML = getData('#content_pane','loaded_id'); }
	function setContentPaneAttrs(id,kind,content_el_id) {																// ===> SET CONTENT PANE ATTRIBUTES
		let class_str_iframe = ( id === 'content_iframe_file' ? 'iframe_' : '' ), class_str_kind = ( /app|dir/.test(kind) ? 'dir' : 'file' );			// set strings to insert in content_pane class
		switch(true) {
			case id === 'close':
				removeClass('#content_pane','content_error has_file has_dir has_zoom_image has_scaled_image has_emptycontent');							// removeclass	various iframe_item_src
				removeAttr('#content_pane .has_content','style');		removeAttr('#content_pane','data-loaded_id');									// remove		inline styles and data-loaded_id
				   setAttr('#content_pane','data-content','has_null');	setAttr('#content_pane','data-loaded','loaded');								// set			data-content=has_null, data-loaded=loaded (remove spinner)
					break;
			default:
				switch(true) {
					case ( /content_iframe_dir|content_iframe_parent|open_link_file/.test(id) ):	removeClass('#content_pane','has_iframe_file'); addClass('#content_pane','has_iframe_dir');		break;	// iframe_dirs
					case ( /content_iframe_file/.test(id) ):										removeClass('#content_pane','has_dir');			addClass('#content_pane','has_iframe_file');	break;	// iframe files
					case ( /^rowid/.test(id) ):	default:											removeClass('#content_pane','has_dir has_file has_iframe_dir has_iframe_file');					break;	// all sidebar items
				}
				removeClass('#content_pane','content_error has_emptycontent');																			// removeclass	#content_pane error
				addClass('#content_pane','has_'+ class_str_iframe + class_str_kind );																	// addclass		#content_pane "has_"+ kind
				setAttr('#content_pane','data-content','has_'+ kind);																					// add data.content to content_pane
				setAttr('#content_pane','data-loaded_id',id);																							// hide all iframe content until loaded, show loading spinner:
				if ( kind !== 'video' ) { removeAttr('#content_video','data-src_id'); }
				if ( /content_iframe/.test(content_el_id) && !/ignored/.test(kind) ) { 
					setAttr('#content_pane','data-loaded','unloaded'); } else { setAttr('#content_pane','data-loaded','loaded'); }
		}
	}
	function setContentElAttrs(id,content_el_id,kind,src,selected_id) {																				// ===> SET CONTENT EL ATTRIBUTES
		switch(true) {
			case ( /content_iframe_dir|content_iframe_parent|open_link_file/.test(id) ):																	// iframe_dirs
				setAttr('#content_pane','data-iframe_item_src',src);																						// if iframe_dir, set iframe_item_src attr
				if ( !hasAttr('#content_pane','data-iframe_selected_id') ) { setAttr('#content_pane','data-iframe_selected_id',selected_id); }		break;	// select iframe_dirlist selected if iframe_dir
			case ( /content_iframe_file/.test(id) ):						 setAttr('#content_pane','data-iframe_selected_id',selected_id);		break;	// iframe files
			case kind === 'ignored':																												return;	// ignored
		}
		removeAttr('.content_el','src');									setAttr(content_el_id,'src',src);												// set content el source
		removeClass('.content_el.has_content','has_content');				addClass(content_el_id,'has_content');											// addclass .has_content to content_el & remove from siblings
		if ( kind === 'image' ) { imageSetDimensions(); }																									// set image dimensions if necessary
	}
	function iframeLoadedFunctions(id,kind,file_name,content) {	let focus_el;												// ===> IFRAME LOADED FUNCTIONS
		setAttr('#content_pane','data-loaded','loaded'); 
		clearTimeout(setWarningItemNotLoadedID);																					// set data-loaded (remove loading spinner)
		if ( hasAttr('#content_pane','data-iframe_selected_id') ) {																	// select iframe_dirlist selected IFF is iframe_dir
			messageSend('iframe','select_iframe_item','',getData('#content_pane','iframe_selected_id') );							// tell iframe to reselect original item
			focus_el = '#content_iframe';
		}
		deleteData('.dirlist_item[data-html_content]','html_content');																// remove existing data-html_content
		getEl('.dirlist_item.selected')?.classList.add('content_loaded');															// add content_loaded class to dirlist_item
		setData('.dirlist_item.content_loaded','html_content',content);																// set data-html_content for sidebar items (for processing cue, playlist, link files, htm, &c.)
		switch (true) {
			case file_name.endsWith('.cuetxt'):	cuesheetProcess(content);													break;	// process cuesheet files; name must end with ".cuetxt"
			case kind === 'link':	case kind === 'remote_webloc':	linkFileProcess(kind,content);							break;	// process link files
			case kind === 'htm':
				switch(true) {
					case getData('#content_pane','content') !== 'has_htm': setData('#content_pane','content','has_'+kind);	break;
					case content === '':	addClass('#content_pane','has_emptycontent');									break;	// if htm content === '', set empty content class for proper iframe display
				}																											break;
			case hasClass('#top_body','open_sidebar_in_content_pane'): addClass('#top_body','no_hover'); removeClass('#top_body','open_sidebar_in_content_pane'); focus_el = '#content_iframe';	break;
		}
		if ( focus_el !== undefined ) { focusEl(focus_el); }																		// focus element after iframe loaded
	}
	
	
	
	
// TESTING	
	function fileNotFound(e,id)	{
		if ( e.type === 'error')	{ 
			if (id === 'content_audio') { addClass('#content_pane','has_audio_error'); setContentTitle('has_audio_error'); } else { addClass('#content_pane','content_error'); closeContent(); setContentTitle('error'); } 
		}
	}
	function initContentError(id,content_el_id) { if ( id !== 'close' ) { getEl(content_el_id).addEventListener('error',(e) => { fileNotFound(e,content_el_id); }); } }					// ===> INIT CONTENT ERROR

	const testFontLoaded = async (src) => {
		let font = new FontFace("myfont", "url("+src+")");
		let fontFile = new FontFace( "FontName","url("+src+")");
		fontFile.load().then(
			() => { console.log("LOADED") }, (err) => { console.log(err); }
		);
	}
	const testItemLoaded = (src,kind) => {
		switch(true) {
			case kind === 'font':	testFontLoaded(src);			break;
		}
	}
	function setWarningItemNotLoaded(args) { return; 
			let src = args?.[0]; let kind = args?.[1];											// Show warning if item is not found; typically after clicking a bad link in an html file
			let warning_message = "data:text/html;charset=utf-8," + escape(`<!DOCTYPE html><html><head><style>html,body { background:transparent; }</style></head><body style="text-align: center;" id="content_body" class="is_html">  <h1 style="font-family: Georgia, serif; color: #4a4a4a; margin-top: 4em; line-height: 1.5;">Sorry, this page doesn't exist.<br>Please check the URL or go back a page.</h1>  <h2 style="  font-family: Verdana, sans-serif; color: #7d7d7d; font-weight: 300;">404 Error. Page Not Found.</h2>  <button onclick="window.parent.postMessage( {\'messageContent\':\'go_back\'},\'*\')">Go back</button></body></html>`);
			switch(true) {
				case ( !/audio|video|font|image|pdf/.test(kind) ):																		// Show warning for iframe items not found
					setWarningItemNotLoadedID = setTimeout( () => { if ( getEl('#content_pane').dataset.loaded === 'unloaded' ) { 
						removeClass('#content_pane','has_file');
						delete getEl('#content_pane').dataset.iframe_selected_id;  delete getEl('#content_pane').dataset.iframe_item_src;
						setData('#content_pane','loaded','loaded');  setData('#content_pane','content','has_htm');  addClass('#content_iframe','has_content'); 
						getEl('#content_iframe').src = warning_message;
					} },5000); 
					break;
				case kind === 'font': testItemLoaded(src,kind);	break;
				default:
					//console.log("NOT FOUND");					
				} 
	}
// END TESTING	
	
	
	// ===> SHOW THIS ITEM	// file_name = link_info[1], file_ext = link_info[2], kind = link_info[3], item_classes = link_info[4], body_classes = link_info[5], stats_classes = link_info[6];
	function showThisItem(id,args) {							// ===> SHOW CONTENT // args = [link,kind,selected_id (for iframe dirs/files)] or "close"; bool === false for proper content title for autoload_coverart
		let link_info = ( /rowid/.test(id) ? ( getLinkInfo( getAttr('#'+ id +' a','href') ) ) : args !== undefined ? getLinkInfo(args[0]) : id );
		let src, file_name, kind, content_el_id, selected_id = ( args?.[2] || undefined), content = ( args?.[4] || '' ), link_protocol = link_info?.[7];
		if ( typeof link_info !== 'string' && link_info !== undefined ) { src = link_info[0]; file_name = link_info[1]; kind = ( link_info[4].includes('ignored') ? 'ignored' : args?.[2] === 'remote_webloc' ? args[2] : link_info[3] ); } // src, file_name, kind
		let bool = ( args?.[1] || true );																								// bool: tell set_content_title to use name for cover art, not file path
		if ( !/editor/.test(id) ) { removeClass('body','has_texteditor'); }					playlistShowItem('close');					// close texteditor and make_playlist item textarea
		if ( !/video/.test(kind) && hasContent('video') ) {	mediaPlayPause('close'); toggleMediaNameInWindowTitle('close'); }			// nobreak; close video when opening any other content
		switch(true) {																											// MAKE CONTENT SRC STRING
			case id === 'close':															id = 'close';	kind = 'close';		break;	// close
			case ( /\.php\?/.test(src) ):																						break;	// do nothing for php files
			case id === '':										src = args[0];								kind = args[1];		break;	// id = '' typically when grid items remain after closing subdirectory
			case ( /open_sidebar_in_content_pane/.test(id) ):	src = args[0] + makeSrcSearchParams('dir'); kind = args[1];		break;	// open in sidebar
			case ( /iframe_parent|iframe_dir/.test(id) ):		src += makeSrcSearchParams('dir');								break;	// prep for iframe dirs
			case ( /rowid/.test(id) ):	case ( /link/.test(kind) ):	case id === 'content_iframe_file':	src += makeSrcSearchParams(kind);	break;	// dirlist_items, link files, content_iframe_files
		}
		content_el_id = ( ['audio','font','image','pdf','video'].includes(kind) ? '#content_'+ kind : id === 'close' ? 'close' : '#content_iframe' );
		switch(true) {																											// SHOW INDIVIDUAL CONTENT TYPES
			case hasContent('font_file') && !/audio/.test(kind):			showWarning('closeContent');						break;	// prevent accidentally closing font file
			case ( /audio/.test(kind) ):									showMedia(kind,id,src,file_name);					break;	// show audio or audio_close
			case ( /editor/.test(id) ):										showTextEditor();									return;	// show top text editor; don't change any other content pane params and attrs
			case ( /iframe_loaded/.test(id) ):								iframeLoadedFunctions(id,kind,file_name,content);	break;	// iframe_loaded
			case ( /grid/.test(id) ):										showGrid(id);										break;	// show grid
			case ( window.location.protocol !== link_protocol ) && link_protocol !== undefined && !['audio','font','image','pdf','video','dir','app'].includes(kind):	// replace this text with test has non_local class?
				switch(true) {
					case link_protocol !== 'file:':							showWarning('non_local_file',[src]);				break;	// warning non-local file on local page (for playlist pages)
					case link_protocol === 'file:':							showWarning('local_file');							break;	// warning local file on non-local page (for playlist pages)
				}															showThis('close');									break;	// close previous content
			case kind === 'ignored' && getCurrentUIPref('ignore_ignored_items') === 'false':	window.location = src;			break;	// attempt to open ignored files if ignore ignored items enabled
			default:
				switch(true) {
					case ( /font/.test(kind) ):								showFont(id,false,'',src);							break;	// show font specimen; init font preview event listeners
					case ( /pdf/.test(kind) ):								showPDF();											break;	// show pdf: setup new #content_pdf el
					case ( /video/.test(kind) ):							if ( getData('#content_video','src_id') !== id ) { showMedia('video',id,src,file_name); break; } else { return; }	// show video
				}
				if ( /font|image/.test(kind) && hasContent('grid') )		{ closeGrid('hide'); showContentGridItem(id,getEl("#"+id).querySelector('a').href,getEl("#"+id).dataset.kind); }
				if ( !hasContent('font_file_glyph') ) { 
					setContentPaneAttrs(id,kind,content_el_id); setContentElAttrs(id,content_el_id,kind,src,selected_id); setContentTitle(id,kind,file_name,src,bool); initContentError(id,content_el_id); 
				}
		}
		setWarningItemNotLoaded([src,kind]);
	}
	// ===> SHOW THIS																																	// bool_1 !== false: select item; bool_2 !== false: show item
	function showThis(id,bool_1,bool_2,args) { if (bool_1 !== false) { selectThisItem(id,args); }  if (bool_2 !== false) { showThisItem(id,args); } }	// ===> SHOW THIS (args = [src,kind,selected_id])
	function quickLookThis(id,kind) { getEl('#content_audio')?.blur(); getEl('#content_video')?.blur();													// prevent media play on space key if focused
		switch(true) {
			case window.parent !== window.top:																																	break; // prevent infinite quicklook regression
			case id === 'close': closeContent(); removeClass('body','has_quicklook'); getEl('#content_pane .selected')?.scrollIntoView({behavior:"smooth",block:"nearest"});	break; // close; scroll grid item into view
			default:	addClass('body','has_quicklook'); 
						showMedia('close_audio');	if (getEl('#'+id).classList.contains('ignored') ) { closeContent(); }	showThis(id);	if ( /audio|video/.test(kind) ) { mediaPlayPause('play'); }
		}
	}
	//============================//
	// ===> CLOSE CONTENT
	function closeContent(kind) { // Close all .content elements before opening any new .content from sidebar.									// ===> CLOSE CONTENT
		let content_el_id = ( getEl('.content_el.has_content')?.id || '' ); kind = ( kind || content_el_id.split('_')[1] );
		switch(true) {																																			// additional actions for specific cases
			case hasContent('hidden_grid'):																										showGrid();										break;	// show hidden grid
			case kind === 'grid':		case hasContent('grid'):																				closeGrid();									break;	// close grid
			case kind === 'font':		case hasContent('font_file_glyph'): case hasContent('font_specimen_glyph'):	case hasContent('font'):	showWarning('close_font','close_font');			break;	// close font specimen
			// case kind === 'image':	break;	// case kind === 'audio':	break;	// case kind === 'video':	break;	// case kind === 'pdf':	break;	// case kind === 'iframe':	break;
			case kind === 'playlist':															showWarning('closePlaylist');						break;	// close playlist/filelist
			case kind === 'texteditor': case hasClass('body','has_texteditor'):					showTextEditor(false);								break;	// hide text editor
			case hasContent('audio'):															showMedia('close_audio');							break;	// close audio if content pane empty
			case hasClass('body','iframe_edited'):												messageSend('iframe','unloading','closeContent');	break;	// close edited iframe file with warning
			case hasClass('body','has_directory_source') && !hasClass('body','is_error'):		showDirectorySource();								break;	// close directory source, reopen selected sidebar item
			case kind === 'esc':	removeClass('.selected,.content_loaded,.hovered,.is_blurred','selected content_loaded hovered,is_blurred'); removeClass('body','focus_content');	break;
			default:																			showThis('close');	removeClass('body','focus_content has_directory_source');			break; //
			case hasClass('#content_pane','has_iframe_file') && !hasClass('#content_pane','has_iframe_dir'):												// if content has iframe file opened from sidebar dir
			case !hasClass('#content_pane','has_iframe_file') && hasClass('#content_pane','has_iframe_dir'):												// or if content has iframe dir...
				removeClass('#content_pane','has_iframe_file');																								// remove has_iframe_file class
				showThis( getEl('.dirlist_item.non_media.selected')?.id );																			break;	// show the selected sidebar dir
			case hasClass('#content_pane','has_iframe_file') && hasClass('#content_pane','has_iframe_dir'):													// if content has iframe file from iframe dir...
				removeClass('#content_pane','has_iframe_dir');																								// remove has_iframe_dir class
				showThis('content_iframe_dir',false,true,[getAttr('#content_pane','data-iframe_item_src'),'dir']);											// show the iframe dir
				removeAttr('#content_pane','data-iframe_item_src');																					break;
		}
	}
	//============================//
	// ===> RESET CONTENT (Reset button or Cmd/Ctrl + R)
	function resetContent() { let content_pane_data = getContentPaneData(), grid_btn_id;																	// ===> RELOAD CONTENT
		switch(true) {
			case !hasContent('audio') && !hasContent():										location.reload();								break;	// reload window if no content visible
			case hasContent('audio ignore'):	getEl('#content_audio').currentTime = 0;	getEl('#content_audio').pause();						// nobreak;  pause audio, reset time to 0
			case hasContent('video'):			getEl('#content_video').currentTime = 0;	getEl('#content_video').pause();	
												refreshMediaDurations('refresh_media_durations');											break;	// pause video, reset time to 0
		}		
		switch(true) {																																// reset other content
			case hasContent('texteditor'):		case ( /has_\w+list/.test(getClassNames('#top_body')) ):									break;	// do nothing for audio, video, text editor, playlist content.
			case hasContent('grid'):	grid_btn_id = ( hasClass('#content_pane','has_image_grid') ? '#show_image_grid'	: hasClass('#content_pane','has_font_grid') ? '#show_font_grid' : '#show_grid_btn' );
										closeGrid('close');	getEl(grid_btn_id).click();														break;	// reset grid
			case hasContent('font'):					fontReset('reset');																	break;
			case hasContent('image'):					closeContent();	if ( elExists('.image.selected') || elExists('.image.content_loaded') ) { showThis(getEl('.dirlist_item.image.content_loaded').id); }	 break;
			case hasContent('text,markdown,htm,iframe,dir'):
				switch(true) {
					case hasClass('body','iframe_edited'):	messageSend('iframe','reloading','resetContent');								break;
					default: showThis(getEl('.dirlist_item.content_loaded').id);
				}
			case hasContent('audio') || hasContent('video'):																				break;	// don't do anything else for audio, video, text editor, playlist content.
			case ( /has_ignored|undefined/.test( content_pane_data ) ):	window.location = window.location.href;								break;	// reload page
		}
		deleteData('#content_pane','loaded');																										// remove dataset.loaded in case file can't be read by utility iframe
	}
	//**********************// ===> NAVIGATION
	function navigationGetType() { let content_pane_data = ( elExists('#content_pane') ? getContentPaneData() : 'iframe'), nav_type;		// ===> GET NAVIGATION TYPE
		switch(true) {
			case elExists('.cuesheet_track_list_container.has_menu') && hasClass('body','focus_content'):									nav_type = '.cuesheet_track_list_container.has_menu .cuesheet_track_list';	break;
			case hasClass('body','has_menu'):										nav_type = ( getEl('#sidebar_menu_main .hovered') ? '#sidebar_menu_main .hovered ul' : '#sidebar_menu_main');	break;	// submenu or menu
			case content_pane_data === 'iframe' && elExists('#directory_list'):																nav_type = '#directory_list';				break;	// iframe dir_list
			case ( hasContent('font_file_glyph') || hasContent('font_file') ) && hasClass('body','focus_content'):							nav_type = '#font_file_grid';				break;	// font file glyphs
			case getEl('#font_specimen_grid').children.length > 0 && hasClass('body','focus_content') && document.activeElement.contentEditable !== true:
																																			nav_type = '#font_specimen_grid';			break;	// font specimen glyphs
			case hasContent('image,font') && hasClass('#content_pane','has_hidden_grid') && hasClass('body','focus_content'):
			case hasContent('grid') && hasClass('body','focus_content'):																	nav_type = '#content_grid';					break;	// grids
			default:																														nav_type = '#directory_list';						// default: dir_list
		}
		return nav_type;																															// = selector of container of items to be navigated
	}
	function getNavigatedElID(e,sel,bool) {																											// bool === false: don't cycle selection
		let els = Array.from(document.querySelectorAll(sel)), selected_els = els.filter( el => el.classList.contains('selected'));					// get els to navigate and currently selected el(s)
		let navigatedElIndex = ( /ArrowDown|ArrowRight/.test(e.key) ? els.indexOf(selected_els[selected_els.length - 1]) + 1 : /ArrowUp|ArrowLeft/.test(e.key) ? els.indexOf(selected_els[0]) - 1 : null );	// navigated el index
		if ( bool !== false ) {																														// cycle round to first or last item (but not for selectMultiple via arrows)
			navigatedElIndex = ( /ArrowDown|ArrowRight/.test(e.key) && els[navigatedElIndex] === undefined ? 0 : /ArrowUp|ArrowLeft/.test(e.key) && els[navigatedElIndex] === undefined ? els.length - 1 : navigatedElIndex ); 
		}
		return els[navigatedElIndex]?.id;																											// return the id of the navigated item
	}
	function navigateGetEl(args) {																											// ===> GET NEXT NAVIGATED ITEM
		let els, els_length, selected_el_index, key = args[0], bool = args[1], nav_type = navigationGetType(), selected_el, selected_el_kind, navigated_el;
		switch(true) {																																// Get selected_el
			case bool === true:		selected_el = getEl('.media.selected') || getEls('.audio_loaded,.media.content_loaded,.dirlist_item.is_blurred')[0] || getEl('.media'); break;	// bool === true: autoplay media
			default:				selected_el = getEl(nav_type).querySelector('.selected');																						// get currently selected item
		}
		if ( selected_el !== null ) { 
			selected_el.classList.remove('selected');						// If there is a selected item...remove its selected class unless shuffle
			if ( !/warning_buttons/.test(nav_type) ) {
				switch(true) {																														// get both images and fonts from mixed grids for L/R navigation...
					case nav_type === '#content_grid' && elExists('.image_grid_item') && elExists('.font_grid_item'):	selected_el_kind = new RegExp(/image|font/);				break;
					default:																							selected_el_kind = new RegExp(selected_el.dataset.kind);	// or get selected_el kind (for L/R navigation)
				}
			}
			if ( /audio|video/.test(selected_el_kind) && hasClass('body','media_play_all') )	{ selected_el_kind = /audio|video/; }				// but if media_play_all, get both media kinds
			if ( selected_el?.classList.contains('hovered') && /ArrowUp|ArrowDown/.test(key) )	{ getEl('#sidebar_menu_main .hovered')?.classList.remove('hovered'); }
		}
		els = Array.from(getEl(nav_type).children).filter( (el) => {																				// Get all navigable elements and filter
			if ( /font_specimen_grid|font_file_grid|content_grid/.test(nav_type) || el.offsetWidth > 0 && el.offsetHeight > 0 ) {					// only return visible items (or glyphs grid items)
				switch(true) {
					case ( /cuesheet/.test(nav_type) ): return !el.classList.contains('header');													// ignore header row in cuesheet menu
					case selected_el !== null && /ArrowLeft|ArrowRight/.test(key) && !/warning_buttons|menu/.test(nav_type):						// if L/R arrow and not menu or warning, and selected_el !== null...
														return selected_el_kind.test(el.dataset.kind) && !el.classList.contains('unchecked');		// ...return all unchecked items of same kind as selected_el
					default:							return true;																				// else return all items
				}
			}
		});
		els_length = els.length;	selected_el_index = ( selected_el === null ? -1 : els.indexOf(selected_el) );									// get index of selected item from filtered els or -1 if null
		switch(true) {																																// GET NEXT NAVIGATED ELEMENT
			case hasClass('body','has_directory_source'):																							// if viewing directory source, arrows will reopen selected sidebar item
				if ( elExists('.dirlist_item.content_loaded') ) { showThis( getEl('.dirlist_item.content_loaded').id ); } else { showThis(selected_el.id); }							return;
			case key === 'Tab': if (selected_el === null ) { navigated_el = ( bool !== true ? els[0] : els[els_length - 1] ) } else { navigated_el = selected_el; }						break;	// navigation from tab into iframe
			case key === 'ArrowUp':		case key === 'ArrowLeft':																					// ArrowUp / ArrowDown
				switch(true) {
					case ( /audio|video/.test(selected_el_kind) && key === 'ArrowLeft' ):
						switch(true) {
							case hasClass('body','shuffle_media') && getEl('#content_audio_container').dataset.shufflelist === '':	 mediaShuffleListUpdate(); break;
							case hasClass('body','shuffle_media') && !/loaded/.test(selected_el.className):	navigated_el = selected_el;	mediaShuffleListUpdate(selected_el.id,false);	break;	// allow selected to be played next
							default:																		navigated_el = navigateGetMediaLeftRightEl(els,selected_el,selected_el_index,key);	// media
						}																																			break;
					case ( /font_file|grid/.test(nav_type) && !hasClass('body','has_menu')):				navigated_el = els[navigateGetGridItemIndex(selected_el_index,els_length,nav_type,key)];	break;
					case ( hasClass('body','has_menu') && selected_el === null && key === 'ArrowLeft'):		navigated_el = getEl('#sidebar_menu_parents');			break;	// select parents menu if no main menu item selected
					case ( selected_el?.classList.contains('is_submenu_item') && key === 'ArrowLeft' ):		navigated_el = navigateGetSubMenuEl(selected_el,key);	break;	// go to parent menu
					case ( selected_el === null || ( selected_el_index === 0 && !key === 'ArrowLeft' ) ):	navigated_el = els[els_length - 1];						break;	// select last if nothing selected
					case ( selected_el_index === 0 ):														navigated_el = els[els_length - 1];						break;	// additional case for menus
					default:																				navigated_el = els[selected_el_index - 1];						// default dir_list and menu items
				}																																					break;
			case key === 'ArrowDown':	case key === 'ArrowRight':																									// ArrowLeft / ArrowRight
				switch(true) {
					case ( /audio|video/.test(selected_el_kind) && key === 'ArrowRight' ):
						switch(true) {																										// if autoplay off, navigated_el = selected_el, else navigated_el = next media item
							case hasClass('body','shuffle_media') && getEl('#content_audio_container').dataset.shufflelist === '':	 mediaShuffleListUpdate();				// end of shuffle items
								if ( hasClass('body','shuffle_media') && hasClass('body','loop_media') ) { navigated_el = getEl('#'+getEl('#content_audio_container').dataset.shufflelist.split(',')[0]); }	// if shuffle & loop 
																																									break;
							case hasClass('body','shuffle_media') && !/loaded/.test(selected_el.className):	mediaShuffleListUpdate(selected_el.id,false);					// no break: allow selected item to be played next
							case hasClass('body','media_autoplay_false') && bool === true:					navigated_el = selected_el;								break;	// shuffle play
							default:																		navigated_el = navigateGetMediaLeftRightEl(els,selected_el,selected_el_index,key);
						}																																												break;
					case ( /font_file|grid/.test(nav_type) && !hasClass('body','has_menu') ):				navigated_el = els[navigateGetGridItemIndex(selected_el_index,els_length,nav_type,key)];	break;
					case ( selected_el === null || selected_el_index === els_length - 1 ):					navigated_el = els[0];									break;	// select first if nothing selected
					case ( selected_el?.classList.contains('has_submenu') && key === 'ArrowRight' ):		navigated_el = navigateGetSubMenuEl(selected_el,key);	break;	// open submenu
					default:																				navigated_el = els[selected_el_index + 1];						// default dir_list and menu items
				}																																					break;
		}
		switch(true) {																																				// WHAT TO DO WITH NAVIGATED ELEMENT:
			case navigated_el === undefined:
				navigated_el = ( /ArrowUp|ArrowLeft/.test(key) ? els[els_length - 1] : /ArrowDown|ArrowRight/.test(key) ? els[0] : null ); showThis(navigated_el?.id || navigated_el?.dataset.id);	break;
			case ( /cuesheet/.test(nav_type) ):	 navigated_el.click();																								break;	// if cuesheet track list menu is open
			case ( /grid|menu/.test(nav_type) ): removeClass('#sidebar_menu_main li','selected');			navigated_el?.classList.add('selected');				// for grids and menus; ...add selected class to navigated_el
				switch(true) {
					case hasClass('body','has_menu'): case hasClass('body','has_menu_parents'):																							break;
					case navigated_el.id === 'sidebar_menu_parents':										menuShow(null,'sidebar_menu_parents');					break;
					case hasContent('font_specimen_glyph'):												showFontGlyph(null,navigated_el.id);						break;
					case hasContent('font_file_glyph'):														showFontGlyph(null,navigated_el.id);					break;	// show the navigated font file glyph
					case hasClass('#content_pane','has_hidden_grid') && /image|font/.test(navigated_el.dataset.kind): 
						removeClass('.grid_item.selected','selected');   navigated_el?.classList.add('selected');	showThis(navigated_el.dataset.id);						// no break
					case ( /grid/.test(nav_type) ): 
						getEl('#directory_list .selected')?.scrollIntoView({block:"nearest"});																				// scroll dir_list item into view
						getEl('#content_pane .selected')?.scrollIntoView({behavior:"smooth",block:"nearest"});														break;	// scroll grid item into view
				}																																					break;
			case !isTopWindow(): 
				switch(true) {
					case hasClass('#content_body','has_quicklook'):									quickLookThis(navigated_el.id,navigated_el.dataset.kind);		break; // either quicklook or select item
					default:																			showThis(navigated_el.id,true,false);
				}																																					break;
			case ( /ArrowUp|ArrowDown/.test(key) && getData(navigated_el,'kind') === 'audio' && !hasClass('#content_body','has_quicklook') ): 
																										showThis(navigated_el.id,true,false);						break;	// only select audio on U/D arrow
			case ( /ArrowLeft|ArrowRight/.test(key) && navigated_el?.classList.contains('media') ):
				switch(true) {
					case hasClass('body','media_autoplay_false') && bool === 'true':					showThis(selected_el.id,true,false);						break;
					default: showThis(navigated_el.id);																														// L/R arrow: load and play media
						if ( selected_el_index === els_length - 1 && !hasClass('body','loop_media') && bool === true ) { null; } else { mediaPlayPause('play'); }			// if last item & !loop, select first item, else play
				}																																					break;
			default: showThis(navigated_el.id);																																// default: show item
		}
	}
	function navigateGetSubMenuEl(selected_el,key) { let navigated_el;																		// ===> SUBMENU NAVIGATION
		switch(true) {
			case selected_el?.classList.contains('has_submenu') && key === 'ArrowRight':
				selected_el.classList.add('hovered');	selected_el.querySelector('ul li.selected')?.classList.remove('selected');
				navigated_el = selected_el.querySelector('ul li');	navigated_el.classList.add('selected');															break;
			case selected_el?.classList.contains('is_submenu_item') && key === 'ArrowLeft':
				removeClass('#sidebar_menu_main li.is_submenu_item.selected','selected');
				navigated_el = getEl('#sidebar_menu_main .hovered');	navigated_el.classList.add('selected');		navigated_el.classList.remove('hovered');		break;
			}
		return navigated_el;
	}
	function navigateGetGridItemIndex(selected_el_index,els_length,nav_type,key) { let grid_col_count, grid_row_count, grid_item_index;		// ===> GRID NAVIGATION
		if ( /ArrowUp|ArrowDown/.test(key) ) {																										// calculate number of grid rows and columns
			grid_col_count = ( Math.round( getEl( nav_type ).offsetWidth / getEl( nav_type +' > li').offsetWidth ) );								// number of grid items per row
			grid_row_count = Math.floor(els_length / grid_col_count);																				// number of full grid rows
		}
		switch(true) {
			case key === 'ArrowUp':																													// ArrowUp
				switch(true) {
					case selected_el_index === -1:														grid_item_index = els_length - 1;	break;	// if nothing selected
					case selected_el_index < grid_col_count:																						// if selected el is in first grid row...
						switch(true) {																												// ...and if it is in a column to the right of last item in last row get...
							case (grid_col_count * grid_row_count) + selected_el_index >= els_length:	grid_item_index = selected_el_index + (grid_col_count * (grid_row_count - 1)); break;	// last in penultimate col or...
							default:																	grid_item_index = selected_el_index + (grid_col_count * grid_row_count);				// last in last row
						}
						break;
					default: grid_item_index = selected_el_index - grid_col_count;																	// default: grid_item_index = selected_el_index - length of grid row
				}																															break;
			case key === 'ArrowDown':																												// ArrowDown
				switch(true) {
					case selected_el_index === -1:								grid_item_index = 0;										break;	// if nothing selected, get first item
					case selected_el_index + 1 + grid_col_count > els_length:	grid_item_index = ( selected_el_index - (grid_col_count * ( grid_row_count - 1)) ) % grid_col_count; break; // if selected is last in column
					default:													grid_item_index = Number(selected_el_index) + Number(grid_col_count);	// default: index = selected_el_index plus the length of the grid row
				}																															break;
			case key === 'ArrowLeft':	grid_item_index = ( ( selected_el_index === -1 || selected_el_index === 0 ) ? els_length - 1 : selected_el_index - 1 ); break;	// if first or nothing selected, get last or prev
			case key === 'ArrowRight':	grid_item_index = ( ( selected_el_index === -1 || selected_el_index + 1 === els_length ) ? 0 : selected_el_index + 1 ); break;	// if last or nothing selected, get first or next
			}
		if ( !hasContent('font_file') && nav_type !== '#font_specimen_grid' && nav_type !== '#font_file_grid' ) {									// select corresponding dir_list item for image/font grids, but not font files
			removeClass('.dirlist_item','selected hovered');		removeClass('.dirlist_item.content_loaded','content_loaded');					// remove classes from dir_list items
			let selected_id = getEl(nav_type).querySelectorAll('.grid_item')?.[grid_item_index]?.dataset.id;										// get the data-id from the currently selected grid item
			if ( selected_id ) { getEl('#'+selected_id)?.classList.add('selected'); getEl('.dirlist_item.selected')?.scrollIntoView({behavior:"smooth",block:"nearest"}); }	// select & scroll dir_list item into view
		}
		return grid_item_index;
	}
	function navigateGetMediaLeftRightEl(els,selected_el,selected_el_index,key) { let navigated_el, navigated_el_id;											// ===> MEDIA LEFT/RIGHT NAVIGATION (Audio)
		const mediaShuffleGetNextItem = () => {																													// ===> GET NEXT SHUFFLED ITEM
			let shuffle_list = getData('#content_audio_container','shufflelist').split(','), shuffled_item_id = shuffle_list.pop();	setData('#content_audio_container','shufflelist',shuffle_list); return shuffled_item_id;
		}
		switch(true) {
			case hasClass('body','shuffle_media'):	navigated_el_id = mediaShuffleGetNextItem();	// if shuffle play enabled...get the next shuffled item id
				switch(true) {												// but if all shuffled items have been played (i.e., navigated_el_id === ''): if loop, update shufflelist, get next item; else get first item.
					case navigated_el_id === '':	mediaShuffleListUpdate();
													navigated_el = ( hasClass('body','loop_media') ? ( navigated_el = getEl('#'+ mediaShuffleGetNextItem()) ) : navigated_el = els[0] );	break;
					default:						navigated_el = getEl('#'+ navigated_el_id );																	// else get next item in the shufflelist
				}
				setMediaShuffleListData(getAttr('#content_audio_container','data-shufflelist'));
				break;
			case !selected_el.classList.contains('audio_loaded') && selected_el.classList.contains('audio') && isTopWindow(): navigated_el = selected_el;	break;	// if selected audio item not loaded, select it
			case key === 'ArrowRight': navigated_el = ( selected_el_index + 1 < els.length ? els[selected_el_index + 1] : navigated_el = els[0] );			break;	// if selected not last, select next, else select first
			case key === 'ArrowLeft':  navigated_el = ( selected_el_index - 1 !== -1 ? els[selected_el_index - 1] : navigated_el = els[els.length - 1] );	break;	// if selected not first, select prev item, else last
		}
		selected_el.classList.remove('audio_loaded','content_loaded');																								// deselect currently selected media item class
		return navigated_el;
	}
	function navigateWarningBtns(e) {																									// ===> NAVIGATE WARNING BUTTONS
		let buttons = getVisibleElsBySelector('#warning_buttons button');
		let focused_button = getVisibleElsBySelector('#warning_buttons :focus,#warning_buttons .focus')[0], focused_btn_index = buttons.indexOf(focused_button);
			removeClass('#warning_buttons button','focus');
		switch(true) {
			case e.shiftKey:
				switch(true) {
					case focused_button === null || buttons.indexOf(focused_button) === 0:
						  buttons[buttons.length - 1].focus(); buttons[buttons.length - 1].classList.add('focus');						break;	// focus last button
					default: buttons[focused_btn_index - 1].classList.add('focus'); buttons[focused_btn_index - 1].focus();						// else focus previous button
				}
				break;
			default: // e.Tab
				switch(true) {
					case focused_button === null || buttons.indexOf(focused_button) === buttons.length - 1:
						  buttons[0].focus(); buttons[0].classList.add('focus');														break;  // focus first button
					default: buttons[focused_btn_index + 1].classList.add('focus'); buttons[focused_btn_index + 1].focus();						// else focus next button
				}
		}
	}
	function navigateByArrowModKey(e,id) { let args = [e.key], selected_el, navigated_el_id, selected_kind = getEl('.dirlist_item.selected')?.dataset.kind;		// ===> ARROW KEY MODIFIER FUNCTIONS
		if ( cmdAltKey(e) && ( /ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(e.key) ) ) { return; } else { e.preventDefault(); }				// prevents starting audio play when changing tabs; allows browser tab cycling
		switch(true) {
			case ( /Up|Down|Left|Right/.test(e.key) && /dir|font|image/.test(selected_kind) && e.shiftKey && !cmdKey(e) && !altKey(e) && !altShiftKey(e) ):// e.shiftKey => select multiple items
				switch(true) {
					case getEl('#content_grid').children.length === 0 && /font|image/.test(selected_kind):
						showGrid(getEls('.dirlist_item.font.selected,.dirlist_item.image.selected')[0]?.id);									break;	// show first selected font or image in grid;
					default:	navigated_el_id = getNavigatedElID(e,'.dirlist_item.'+ selected_kind,false);	selectMultipleItems(e,navigated_el_id);	// else get next navigated el id and select it
				}																																break;
			case ( /ArrowLeft|ArrowRight/.test(e.key) && ( altKey(e) || altShiftKey(e) ) ):																// alt/shift + L/R => mediaScrub(e)
				if ( e.shiftKey ) { args.push(30); } else { args.push(10); }																			// scrub 10s or 30s
				if (!isTopWindow()) { messageSend('top_body','mediaScrub','mediaScrub',args); } else { mediaScrub(e); }
				break;
			case cmdKey(e) && e.key === 'ArrowUp':																								// Cmd/Ctrl + Up
				switch(true) {
					case hasClass('body','is_dir'): case !isTopWindow():	iframeClick(e,'iframe_parent_link','link',getEl('#iframe_parent_link').href);			break;	// go to iframe parent
					case isTopWindow() && hasClass('body','focus_content') && hasClass('#content_iframe','has_content'):
																			messageSend('iframe','open_iframe_parent_dir');						break;	// fallback for go to iframe parent in case top is incorrectly focused
					default:	e.preventDefault(); showWarning('changeLocation',[getEl('#parent_dir_nav a').href,'false']);					break;	// go to parent (with warning for playlists/fonts/edited text)
				}																																break;
			case cmdKey(e) && e.key === 'ArrowDown':																							// Cmd/Ctrl + Down
				switch(true) {
					case !elExists('.selected'):																														break;	// do nothing if nothing selected
					case elExists('#content_body #directory_list') && cmdKey(e):	iframeClick( e,id,'dblclick',getEl('#'+id).querySelector('a').href );				break;
					case hasClass('.dirlist_item.selected','link'):				openLinkFile(e,getEl('.dirlist_item.selected.link').id);								break;	// open webloc or url files
					case hasClass('.dirlist_item.selected','playlist'):			openPlaylist('','',getData('.dirlist_item.selected.playlist','playlist'));				break;	// open playlist or filelist
					case isTopWindow() && hasClass('body','focus_content'):			focusEl('#content_iframe',e);														break;	// select first item if nothing selected in iframe
					case isTopWindow() && hasClass('.dirlist_item.selected','file') && !hasClass('.dirlist_item.selected','link'):										break;	// ? do nothing for link files
					case isTopWindow() && hasClass('.dirlist_item.selected','dir') && hasClass('.dirlist_item.selected','app') && UI_Prefs_Bool.apps_as_dirs === false:	break;	// break if not viewing apps as dirs
					default: showWarning('dirOpen', [getAttr('.dirlist_item.selected','id'), getAttr('.dirlist_item.selected a','href')]);										// else open dirs & all iframe items with dbl-click
				}																																						break;
			case cmdKey(e) && e.key === 'ArrowLeft':																															// Cmd/Ctrl + Left
				switch(true) {
					case elExists('.dirlist_item.dir.selected.has_subdirectory'):
						getEls('.dirlist_item.dir.selected.has_subdirectory').forEach( dir => subDirClose(dir.id) );													break;	//  close all selected subdirectories
					case !hasClass('.dirlist_item.selected','has_subdirectory') && elExists('.dirlist_item.has_subdirectory'):													// if selected item is in subdirectory...
						selected_el = getEl('.dirlist_item.selected');
						if ( selected_el === null || selected_el.previousElementSibling === null )																	{ break; }	// do nothing if no selection or prev element
						while ( !selected_el.previousElementSibling.classList.contains('has_subdirectory') ) { selected_el = selected_el.previousElementSibling; }				// find subdir "parent" === prev .has_subdirectory
						if ( selected_el !== null && selected_el.previousElementSibling !== null )			 { showThis( selected_el.previousElementSibling.id ); }		break;	// select and show parent dir
					default: showThis( getVisibleElsBySelector('.dirlist_item')[0].id);																						// select first visible item
				}																																						break;
			case cmdKey(e) && e.key === 'ArrowRight': try { subDirOpen(getEl('.dirlist_item.dir.selected:not(.has_subdirectory)').id); } catch(e) { null; }				break;	// Cmd/Ctrl + R: open (1st) selected subdirectory
		}
	}
	function navigateByArrowKey(args) { navigateGetEl(args); }						// args[0] = key, args[1] = bool (for autoplay media),bool = shift								// ===> ARROW KEY NAVIGATION
	function arrowKeyFunctions(e,bool,el) { addClass('body','no_hover');			// 'e' = keyboardEvent or string (e.g. 'ArrowLeft/Right' from clickPrevNextButtons()			// ===> ARROW KEY FUNCTIONS
		if ( hasClass('body','has_help') ) { getEl('#help_container').focus(); return true; }
		let id = ( /ArrowUp|ArrowLeft/.test(e.key) ? el?.querySelector('.selected')?.id : Array.from(el?.querySelectorAll('.selected'))?.reverse()[0]?.id );						// get first or last selected item
		if ( !/texteditor/.test(document.activeElement.id) && !/textarea/.test(document.activeElement.tagName.toLowerCase() )) { window.getSelection().removeAllRanges(); document.activeElement.blur(); } // TEST all situations
		switch(true) {
			case ( /a|input|select|textarea/.test(document.activeElement.tagName.toLowerCase())) && !cmdKey(e):																		// nobreak: allow normal arrow key functions
			case ( /texteditor/.test(document.activeElement.id)) && !cmdKey(e):																										// nobreak //  "  "
			case document.activeElement.hasAttribute('contentEditable') && !cmdKey(e):																								// nobreak //  "  "
			case !isTopWindow() && !elExists('#content_body #directory_list') && !cmdKey(e):																				return;	// iframe is not a dir_list
			case hasContent('pdf') && hasClass('body','focus_content'):													focusEl('#content_pdf');							break;	// focus content_pdf
			case ( ( hasContent('zoom_image') || hasContent('scaled_image') ) && hasClass('body','focus_content') ):	focusEl('#content_image');							return;	// scroll imgs
			case e.altKey: case e.ctrlKey: case e.metaKey: case e.shiftKey: navigateByArrowModKey(e,id);																	break;	// arrow keys + modifiers
			case isTopWindow() && hasClass('body','iframe_edited'):			e.preventDefault();	messageSend('iframe','unloading','',['arrow_key_navigation',e.key]);		break;
			case isTopWindow() && hasClass('body','focus_content') && hasContent('dir'):	e.preventDefault();																		// req. after nav to iframe dir_list parent dir
				switch(true) {
					case hasClass('body'):							navigateByArrowKey([e.key,false]);																		break;
					default:										messageSend('iframe','iframe_navigation','',[e.key,false]); getEl('#content_iframe').focus();
				}																																							break;
			case hasClass('body','has_top_menu') && !isTopWindow(): e.preventDefault();	messageSend('top_body','arrow_key_navigation','navigateByArrowKey',[e.key,false]);	break;	// menu navigation from focused iframe
			case hasClass('body','has_quicklook'):					e.preventDefault();	navigateByArrowKey([e.key,bool]);													break;
			default:												e.preventDefault();	showWarning( 'navigateByArrowKey',[e.key,bool] );											// normal arrow key navigation, with warning
		}
	}
	// NAVIGATION Go to Item
	function goToItem(e) { e.stopPropagation(); e.preventDefault(); let value, input_el = getEl('#go_to_item input');
		switch(true) {
			case e.key === 'j' && cmdShiftKey(e):																			menuShow(e,'sidebar_menu_main_container');								// nobreak; show menu
			case e?.type === 'click' && document.activeElement.id !== 'go_to_item_input': addClass('#go_to_item','show_input');	getEl('#go_to_item input').focus();						break;	// show input on click
			case e?.key === 'Enter':	default:
				value = input_el.value - 1; removeClass('#go_to_item','show_input'); input_el.value = null; menuClose(); showThis(getEls('#directory_list .dirlist_item')[value]?.id);	break;	// get the entered ui font
		}
	}
	// NAVIGATION Tab Key
	function navigateTabKeyFocus(kind,incr) {
		let sel = { 'font':'#content_font .selected,#content_font *[data-tab_order],#font_toolbar *[data-tab_order]', 'grid':'#content_grid,#top_body', 'html':'a,button,input,select,textarea,div[contenteditable]', 'link':'#texteditor_styled_pane a', 'texteditor':'#content_texteditor .texteditor_pane' }																									// tab-able elements by nav type
		let els = Array.from( getEls(sel[kind]) ).filter( el => el.offsetWidth > 0 && el.offsetHeight > 0 ), el_ids, next_item_id, font_els = [];											// get tab-able elements; other vars
		let active_el = (kind === 'font' ? getEls('#content_font .selected,#content_font *:focus,#font_toolbar *:focus')[0] : document.activeElement );
		if ( els !== null ) { el_ids = ( kind !== 'html' ? els.map( el => el.id ) : els.map( el => els.indexOf(el) ) ) } else { return null }												// get ids or define ids by index
		if ( kind === 'font' && incr === 1 ) {																																				// reorder font_specimen items
			font_els = el_ids.filter(id => (/font_specimen/.test(id)) ); el_ids = el_ids.filter(id => (!/font_specimen/.test(id)) ); if ( incr === -1 ) { el_ids.reverse(); } el_ids = font_els.concat(el_ids);
			if ( getEl('#font_file_grid .selected') ) { null; }
		}
		switch(true) {																																			// get first or last item...
			case active_el === undefined && kind === 'font' && incr === 1:		case ( active_el?.tagName.toLowerCase() === 'body' || active_el === null ) && incr === 1:		next_item_id = el_ids[0];					break;
			case active_el === undefined && kind === 'font' && incr === -1:		case ( active_el?.tagName.toLowerCase() === 'body' || active_el === null ) && incr === -1:		next_item_id = el_ids[el_ids.length - 1];	break;
			default:	next_item_id = ( kind !== 'html' ? el_ids[el_ids.indexOf( active_el.id ) + incr] : el_ids[els.indexOf( active_el ) + incr] );	break;	// or tab to next item for any other content
		}
		switch(true) {
			case next_item_id === undefined: if ( kind === 'font' && !hasClass('body','focus_content') ) { addClass('body','focus_content'); } else { focusEl('#top_body'); }	break;	//focus top or font
			case kind === 'grid':													focusEl('#content_grid');																	break;
			case kind !== 'html':													focusEl('#'+next_item_id);																	break;
			case kind === 'html': if ( !getEl('#html_styles') ) { document.head.insertAdjacentHTML('beforeend','<style id="html_styles">'+ html_style_rules +'</style>'); } els[next_item_id].focus({focusVisible:true}); break; }
	}
	function navigateByTabKey(e,incr) {																												// ===> NAVIGATION TAB KEY
		if ( e === null ) { null } else { incr = ( e.shiftKey ? -1 : 1 ); }																					// e === null if from message navigateTabKeyFocus;
		let content_pane_data = getContentPaneData(), content_el_id = 'content'+ content_pane_data?.slice(3) || null, next_item_id;
		switch(true) {
			case hasClass('body','has_warning'):													navigateWarningBtns(e);									break;	// nav warning buttons
			case hasContent('texteditor'):															navigateTabKeyFocus('texteditor',incr);					break;	// focus font preview, grid, text editor els
			case hasContent('font,grid'):															navigateTabKeyFocus(content_pane_data.slice(4),incr);	break;	// focus font preview, grid, text editor els
			case !isTopWindow():
				switch(true) {
					case hasClass('body','is_dir'):													messageSend('top_body','focus_top');					break;
					case hasClass('body','is_link'):												navigateTabKeyFocus('link',incr);						break;	// nav link file
					case hasClass('body','is_html'):												navigateTabKeyFocus('html',incr);						break;	// nav html file els (links, etc.)
					case hasClass('body','is_text'):												navigateTabKeyFocus('texteditor',incr);					break;	// nav html file els (links, etc.)
				}																																			break;
			default:
				switch(true) {
					case hasContent('image,pdf,video') && !hasClass('body','focus_content'):		next_item_id = content_el_id;							break;	// tab into images, pdf, video
					case hasClass('body','has_texteditor') && !hasClass('body','focus_content'):																	// tab into text editor
					case hasContent('dir,htm,markdown,text,code,other,link'):						next_item_id = '#content_iframe';						break;	// tab into iframe dirs and text files
					case hasClass('body','focus_content'):											next_item_id = '#top_body';								break;	// tab into top
				}
				focusEl(next_item_id,e);																							// focusEl
		}
	}
	// NAVIGATION Other
	function navigateByTypedStr(e) { let items, item, timer;																									// ===> NAVIGATE BY TYPED STRING
		switch(true) {
			case ( /textarea|input/.test(document.activeElement.tagName.toLowerCase()) || document.activeElement.getAttribute('contentEditable') === true ):		return;	// ignore editable textareas
			default:
				timer = timeoutID();	if ( typeof timer === 'number' ) { window.clearTimeout( timer ); timer = 0; }	timeoutID();							// set timer for typed string
				str += e.key.toLowerCase();																														// define typed string
				switch(true) {
					case hasClass('#top_body','has_menu'):																										// navigate main menu
						items = ( getEls('#sidebar_menu_main > li.has_submenu.hovered').length > 0 ? getEls('#sidebar_menu_main > li.has_submenu.hovered li') : getEls('#sidebar_menu_main > li') );	// get menu/submenu items
						items = Array.from(items).filter( item => item.innerText.toLowerCase().startsWith(str) );												// get menu items and filter items that match typed string
						if ( items.length > 0 ) { item = items[0]; item?.parentNode.querySelector('.selected')?.classList.remove('selected'); item?.classList.add('selected'); }	break;	// select if matching menu item found
					default: if ( elExists('.dirlist_item[data-name^="'+ str +'"]') ) { showThis(getEl('.dirlist_item[data-name^="'+ str +'"]').id); scrollThis('#directory_list','.selected'); }	// select dir_list item
				}
		}
	}
	// ===> END NAVIGATION
	//============================//
	// ===> TEXT EDITING
	function TextEditing() {																												// ===> TEXT EDITING Function: create Markdown Preview
		let raw_markdown = ( elExists('#texteditor_raw_pane') ? getEl('#texteditor_raw_pane').value.toString() : '' );
		MDmarkdown( raw_markdown, getEl('#texteditor_html_pane') );
		MDsetChecklistClass();																														// set checklist class in case any added
	}
	function textareaSelectContent(id) { let textarea_el = getEl('#'+id);  focusEl('#'+ id); textarea_el.select(); textarea_el.scrollTop = 0; }		// ===> SELECT TEXTAREA CONTENT
	function texteditorClear() {																													// ===> CLEAR TEXT
		if ( !isTopWindow() ) { messageSend('top_body','iframe_edited'); addClass('body','texteditor_edited'); } else { removeClass('body','texteditor_edited'); }
		getEl('#texteditor_raw_pane').value = '';				getEl('#texteditor_styled_pane').innerHTML = '';	getEl('#texteditor_html_pane').value = '';
		getEl('#texteditor_raw_pane').style.width = '';			focusEl('#texteditor_raw_pane');
	}
	function texteditorSaveBtn(id) { let data, file_name, ext = ''; // let Text_Files = Text_Files.map( item => '.'+item );							// ===> SAVE BUTTON
		file_name = ( hasContent('texteditor') ? 'untitled' :  decodeURIComponentSafe(window.location.pathname.split('/').reverse()[0]) );
		switch(true) {
			case id === 'save_text':							data = getEl('#texteditor_raw_pane').value;											break; // if ( Text_Files.() ) { ext = '.md'; }	break;
			case id === 'save_HTML':							data = MDprepHTML( getEl('#texteditor_styled_pane').innerHTML );	ext = '.html';	break;
		}
		saveMD( data, file_name + ext );
	}
	function MDprepHTML(data) {																												// ===> MD PREP HTML for saving
		let save_HTML_open = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title></title> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.min.css"></link>    <style></style><script></script></head><body lang="en" class="markdown_body">`, save_HTML_close = '</body></html>';
		data = data.replace(/<span\sclass="uplink">.<\/span>/g,'');
		return save_HTML_open + data + save_HTML_close;
	}
	function saveMD(data,file_name) {																										// ===> SAVE MD
		if ( !isTopWindow() ) { messageSend('top_body','save_text','',[data,file_name]); } else { saveFile(data,'text/plain',file_name); }	// #top_body must save text, else a new window opens containing blob content
		removeClass('body,#texteditor_raw_pane,#content_texteditor','texteditor_edited');
	}
	function MDmarkdown(raw_markdown) {																										// ===> MDMARKDOWN: Render markdown from processed source text
		const MDcustomPreProcess = function(src) { return src; }																						// MD CUSTOM PREPROCESS (we're not doing anything here just yet...)
		const MDcustomPostProcess = function(html) {																									// MD CUSTOM POSTPROCESS
			html = html.replace(/<(p|li|dt|dd)>-*\s*\[\s*x\s*\]\s*(.+?)<\/(p|li|dt|dd)>$/gm,'<$1 class="checklist"><input type="checkbox" checked><label>$2</label></$3>')	// checkboxes in p,li,dt,dd
					   .replace(/<(p|li|dt|dd)>-*\s*\[\s{1,}\]\s*(.+?)<\/(p|li|dt|dd)>$/gm,'<$1 class="checklist"><input type="checkbox"><label>$2</label></$3>')			// checkboxes
					   .replace(/<li><p class="checklist">"/g,'<li class="checklist"><p>');
			return html;
		}
		const MDit = window.markdownit( { linkify:false, typography:false, html:true } ).use( window.markdownitMultimdTable, { enableMultilineRows:true })
			.use(window.markdownitCheckbox).use(window.markdownitSub).use(window.markdownitSup).use(window.markdownitFootnote).use(window.markdownitCentertext).use(window.markdownitDeflist).use(window.markdownitTocDoneRight);
		let MD_Preview = MDcustomPostProcess( MDit.render( MDcustomPreProcess( raw_markdown ) ) );
		let MD_script = `<style>body{margin:0;padding:0;}</style>`;																						// inline scripts to permit sync scrolling and focus
			getEl('#texteditor_styled_pane').innerHTML = MD_script + MD_Preview;																		// set previewed text
		let source_HTML = MD_Preview.toString();
			getEl('#texteditor_html_pane').value = source_HTML;																							// set raw html view
	}
	function MDlivePreview() { MDmarkdown( getEl('#texteditor_raw_pane').value ); MDsetChecklistClass(); }										// ===> MD LIVE PREVIEW
	function MDliveCheckBoxes(checkbox,source_el,preview_el) {																					// ===> MD LIVE CHECKBOXES
		const MDreplaceNthSubStr = function(str,substr,replacement,index) {
			const MDreplaceAt = function(str, replacement, position) { str = str.substring(0, position) + replacement + str.substring(position + replacement.length); return str; }
			let count = 0, found = substr.exec(str);
			while ( found !== null ) { if ( count === index ) { return MDreplaceAt(str, replacement, found.index ); } else { count++; found = substr.exec(str); } }
		}
		removeClass('.checklist','clicked');
		checkbox.closest('p,li,dt,dd').classList.add('clicked');
		const this_index = preview_el.querySelector('.checklist').index( preview_el.querySelector('.checklist .clicked') );
		const src_text = source_el.value;
		const substr = new RegExp(/\[\s*.\s*\]/g);
		const replacement = ( checkbox.is(':checked') ? '[x]' : '[ ]' );
		source_el.value = MDreplaceNthSubStr(src_text, substr, replacement, this_index);
	}
	function MDsetChecklistClass() { getEls('#text_container input[type="checkbox"]').forEach( el => el.closest('ul').style.cssText = 'list-style:none;padding:0;' ); }	// ===> MD SET CHECKBOX LIST CLASS
	function texteditor_ResizeSplit() {																																	// ===> MD RESIZE SPLIT VIEW
		let page_width = window.innerWidth, editor_width = getEl('#content_texteditor').offsetWidth, editor_offsetLeft = ( document.body.id === 'top_body' ? getEl('#content_pane').offsetLeft : 0);
		document.onmousemove = function(e) { eStopPrevent(e);
			let pageX = e.pageX;
			if ( pageX > editor_offsetLeft + 150 && pageX < page_width - 150 ) {																		// min split pane widths
				setStyle('#text_editing_handle','left', pageX - editor_offsetLeft - 4 + 'px');
				setStyle('#texteditor_raw_pane','width', pageX - editor_offsetLeft + 'px');
				setStyle('#texteditor_styled_pane','width', editor_width + editor_offsetLeft - pageX + 'px');
				setStyle('#texteditor_html_pane','width', editor_width + editor_offsetLeft - pageX + 'px');
			}
		}
	}
	function texteditor_ResetSplit() { getEls('#text_container .texteditor_pane,#text_editing_handle').forEach( el => el.removeAttribute('style') ); }
	function texteditor_SyncScroll(e) {																		// ===> MD SYNC SCROLL
		if ( !getEl('input[name="texteditor_sync_scroll"').checked || hasClass('body','texteditor_split_view_false') || hasClass('body','text_editing_enable_false') ) { return; }	// ignore if no split or no sync scroll
		let scrolled = e.currentTarget, scrolled_scrollTop = scrolled.scrollTop, scrolled_height = scrolled.scrollHeight,
			scrolled_percentage = (scrolled_scrollTop/scrolled_height).toFixed(4);
		let synced_id = ['texteditor_raw_pane','texteditor_styled_pane','texteditor_html_pane'].filter(el => el !== scrolled.id).filter(el => document.getElementById(el).offsetHeight > 0).toString();
		let synced = document.getElementById(synced_id);			// the element to be sync scrolled
		synced.scrollTo(0, (scrolled_percentage * synced.scrollHeight).toFixed(0), {behavior:'smooth'});
	}
	function MDtocClick(id) { let thisId = getEl('#'+id).href; if ( thisId !== null ) { getEl('#texteditor_styled_pane').scrollTop = getEl('#'+id).offset().top - 48; } }	// ===> MD TOC CLICK anchors
	function MDheaderClick() {																																				// ===> MD HEADER CLICK
		switch(true) {
			case elExists('#texteditor_styled_pane .table-of-contents'):	getEl('#texteditor_styled_pane').getElementsByClassName('table-of-contents')[0].scrollIntoView({behavior:"smooth",block:"nearest"}); break;
			default:														getEl('#texteditor_styled_pane').scroll(0,0);
		}
	}
	//***********************//
	// MESSAGES
	function messageSend(target,message,funcName,args) {																					// ===> SEND MESSAGE to iframe or parent
		let messageObj = { 'messageContent': message, 'functionName': funcName, 'arguments': args };
		switch(target) {
			case 'iframe':		getEl('#content_iframe').contentWindow.postMessage( messageObj, '*' );	break;
			case 'top_body':	window.parent.postMessage( messageObj,'*');							break;
		}
	}
	function messageReceive(e) {																											// ===> RECEIVE MESSAGE from iframe or parent, do appropriate action
		if ( e.data.messageContent === 'iframe_loaded' ) { showThis('iframe_loaded',false,true,e.data.arguments); }
		else if ( e.origin === 'null' || e.origin === origin ) { let message = e.data.messageContent, args = e.data.arguments;
			switch( message ) {
				case 'uiPrefToggle':				uiPrefToggle(args);																				break;
				case 'searchParamSet':				searchParamSet(args[0],args[1]);																break;
				case 'set_ui_font':					if ( args !== '' ) { document.body.style.fontFamily = args; } else { document.body.style.fontFamily = null; }	break;	// set iframe ui font
				case 'arrow_key_navigation':		removeClass('body','iframe_edited');	navigateByArrowKey(args);								break;	// class_name, key
				case 'iframe_navigation':			addClass('body','no_hover'); navigateByArrowKey(args);											break;	// get first or last iframe dirlist item
				case 'show_sidebar':				document.body.classList.toggle(getNewUIPref('show_sidebar')[0]);								break;
				case 'toggle_menu':					menuShow(null,'sidebar_menu_main_container'); messageSend('iframe','has_top_menu');				break;	// show menu, tell iframe to allow menu arrow navigation
				case 'menu_close':					menuClose();																					break;
				case 'has_top_menu':				addClass('#content_body','has_top_menu is_blurred');											break;	// tell iframe top has menu to allow arrow navigation
				case 'menu_selection':	case 'menuClick':	menuClick();																			break;	// show menu
				case 'menu_navigation':			navigateByArrowKey(args);																			break;	// menu navigation from iframe
				case 'toggle_invisibles':			getEl('#show_invisibles input').click();	getEl('#show_invisibles input').blur();				break;
				case 'blur_top':					addClass('#top_body','focus_content');		menuClose();	selectThisItem(getData('#content_pane','loaded_id'));									break;
				case 'focus_top':																															// close menus and refocus content or focus sidebar
					switch(true) {
						case hasClass('#top_body','focus_content') && hasClass('#top_body','has_menu'):	focusEl('#content_pane');					break;
						default:					focusEl('#top_body');																			break;
						}																															break;
				case 'focus_iframe':				addClass('body','focus_content');			menuClose();										break;	// focusEl('#content_iframe');	break;
				case 'theme_light': case 'theme_dark':																										// toggle iframe UI theme and iframe Text Editor theme
					getEl('#content_body').classList.remove('theme_dark','theme_light');
					getEl('#content_body').classList.add(message,'texteditor_'+ message);															break;	// change iframe dir theme
				case 'show_iframe_parent':			showThis('content_iframe_parent',false,true,args);												break;	// args[0] === item link, args[1] === item kind
				case 'show_iframe_dir':				showThis('content_iframe_dir',false,true,args);													break;	// args[0] === item link, args[1] === item kind
				case 'show_iframe_file':			showThis('content_iframe_file',false,true,args);												break;	// args[0] === item link, args[1] === item kind
				case 'select_iframe_item':			getEl('#'+args)?.classList.add('selected'); scrollThis('#directory_list','.selected',false);	break;
				case 'open_iframe_dir_in_sidebar':	window.location = args;																			break;	// tell top to open iframe directory in sidebar; args: iframe dir url
				case 'open_iframe_parent_dir':		iframeClick(e,'parent','link',getAttr('#iframe_parent_link','href'));							break;	// getEl('##parent').find('a').click();
				case 'go_back':						showThis(getEl('.dirlist_item.selected')?.id);													break;
				case 'close':						clickThis('#close_btn');																		break;	// escape content_iframe and close content
				case 'close_content':				showThis('close'); removeClass('body','iframe_edited'); focusEl('#top_body');					break;	// close edited_iframe text after clicking "Save/Don't Save" buttons
				case 'reload':						showWarning('resetContent');																	break;	// reload content
				case 'reloading':					showWarning('resetContent');																	break;
				case 'resetContent':				showThis(getEl('.dirlist_item.content_loaded').id); removeClass('body','iframe_edited');		break; // reload iframe content after "Save/Don't Save" buttons
				case 'showThis':					removeClass('body','iframe_edited');					focusEl('#top_body'); showThis(args);	break;	// show clicked/navigated sidebar item after "Save/Don't Save" buttons
				case 'show_numbers': case 'show_invisibles': case 'alternate_background': case 'show_ignored_items': case 'ignore_ignored_items':
													getEl('#content_body').classList.toggle(message);												break;	// toggle iframe dir_list UI prefs from main menu:
				case 'show_image_thumbnails':		uiPrefImgThumbsToggle();																		break;	// toggle image thumbnails in iframe
				case 'iframe_play_pause_media':		mediaPlayPause();																				break;	// tell top to play/pause audio from iframe click
				case 'mediaScrub':					mediaScrub(undefined,args);																		break;	// tell top to mediaScrub from focused iframe
				case 'play_prev_next_iframe_audio': mediaPlayPrevNextIframeItem(args);																break;	// play next iframe track
				case 'close_iframe_audio':			removeClass('.audio_loaded','audio_loaded');													break;	// remove iframe audio loaded class
				case 'set_media_duration':			setMediaDuration(args[0],args[1],args[2],true);													break;	// set media durations for subdirs [id, item_sort_kind, duration]
				case 'refresh_media_durations':		refreshMediaDurations('refresh_media_durations');												break;
				case 'navigateTabKeyFocus':			navigateTabKeyFocus(args[0],args[1]);															break;	// args[0] = kind, args[1] = incr (tab:1,shift+tab:-1)
				case 'texteditor_split_view':		uiPrefToggle('texteditor_split_view');															break;
				case 'iframe_edited':				if ( !hasClass('#top_body','iframe_edited') ) { addClass('#top_body','iframe_edited'); }		break;	// let top know iframe text has been edited
				case 'texteditor_toolbar_button':	if ( !isTopWindow() ) { document.body.classList.toggle(args); } else { uiPrefToggle(args); }	break;
				case 'clear':						addClass('#top_body','iframe_edited');															break;	// add edited class after clearing text from edited iframe file
				case 'save_text':					removeClass('body','iframe_edited'); saveFile(args[0],'text/plain',args[1]);					break;
				case 'iframe_text_saved':			removeClass('body','iframe_edited');															break;
				case 'toggle_texteditor':			showTextEditor(true);																			break;
				case 'unloading':					showWarning('closeContent',args);																break;	// show unsaved changes warning in iframe
				case 'iframe_loaded':				showThis('iframe_loaded',false,true,args);														break;	// args = [iframe_src,file_name,kind,content]
				case 'dirlist_subdir_loaded':		subDirInsert(args);																				break;	// when subdirs processed, insert subdirs in dirlist
				case 'show_texteditor_preview':		showTexteditorPreview(args);																	break;	// only show previewed text for certain files (e.g., webloc, url)
				case 'local_link':					showWarning('warning_local_file');																break;	// local link warning
				case 'iframe_playlist':				getEls('.dirlist_item.text').forEach( el => el.removeAttribute('data-playlist'));						// iframe_playlist
					removeClass('.dirlist_item.text','playlist'); addClass('.dirlist_item.text.selected','playlist'); setData('.dirlist_item.text.selected','playlist',args);			break;
				case 'setIframePlayerStatus': // for iframe audio playback
					if ( args === 'play' ) { removeClass('body','is_paused'); addClass('body','is_playing'); } else { removeClass('body','is_playing'); addClass('body','is_paused'); } break;
			}
		}
	}

	// END MESSAGES
	//============================//
	// WARNINGS
	function doFunction(funcName,args) {																									// ===> DO FUNCTION
		let funcDictionary = { 'navigateByArrowKey':navigateByArrowKey, 'showThis':showThis, 'dirOpen':dirOpen, 'null':null, 'menuClick':menuClick, 'clickThis':clickThis, 'texteditorClear':texteditorClear, 'closeContent':closeContent, 'showFont':showFont, 'showFontGlyph':showFontGlyph, 'mediaScrub':mediaScrub, 'closePlaylist':closePlaylist, 'openSidebarInContentPane':openSidebarInContentPane, 'resetContent':resetContent, 'setLocation':setLocation, 'showDirectorySource':showDirectorySource, 'uiPrefToggle':uiPrefToggle, 'openInTextEditor':openInTextEditor, 'playlistMake':playlistMake,'changeLocation':changeLocation };																		// list of functions to remember and execute after warning button click
		return funcName === 'null' ? null : funcDictionary[funcName](args);																		// return the function and call it with args
	}
	function showWarning(funcName,args) {																														// ===> SHOW WARNING
		switch(true) {
			case funcName === null:																																			break;
			case ( /warning_make_playlist/.test(funcName) ):
				getEls('#directories_only,#files_only,#audio_files_only,#video_files_only,#media_files_only,#all_non_media_files').forEach(el => el.removeAttribute('disabled')); // setup makeplaylist alert
				if ( getEl('.dirlist_item.dir') === null )	{ getEl('#directories_only').disabled = 'disabled'; }	if ( getEl('.dirlist_item.file') === null )			{ getEl('#files_only').disabled = 'disabled'; }
				if ( !hasClass('body','has_audio') )		{ getEl('#audio_files_only').disabled = 'disabled'; }	if ( !hasClass('body','has_video') )				{ getEl('#video_files_only').disabled = 'disabled'; }
				if ( !hasClass('body','has_media') )		{ getEl('#media_files_only').disabled = 'disabled'; }	if ( getEl('.dirlist_item.non_media') === null )	{ getEl('#all_non_media_files').disabled = 'disabled'; }
				openWarning('warning_make_playlist',['warning_btn_ok','warning_btn_cancel'],'playlistMake',args);														break;	// make playlist/filelist
			case ( /open_font|open_playlist|close_font|closePlaylist/.test(funcName) ): // close playlist or font file; args === close_font, close_playlist; if funcName[close_] === args, close item, else open file
				if ( !hasContent('font_file_glyph') && !hasContent('font_specimen') && !hasContent('font_specimen_glyph') && !hasClass('body','has_quicklook') )
					{ openWarning('warning_'+args,['warning_btn_cancel','warning_btn_ok'],funcName,args); } else { closeFont(); /*i.e., glyphs*/ }						break;	// close font or font glyphs
			case ( /texteditorClear/.test(funcName) ):		openWarning('warning_clear_text',['warning_btn_ok','warning_btn_save','warning_btn_cancel'],funcName);		break;
			case ( /non_local_file/.test(funcName) ):		openWarning('warning_non_local_file',['warning_btn_ok','warning_btn_cancel'],null,args);					break;
			case ( /local_file/.test(funcName) ):			openWarning('warning_local_file',['warning_btn_ok']);														break;
			case ( /showThis|closeContent|resetContent|changeLocation|setLocation/.test(funcName) ):																			// warnings for various cases
				switch(true) {
					case !isTopWindow():
						switch(true) {
							case args?.length === 2:		openWarning('unloading',['warning_btn_save','warning_btn_dont_save','warning_btn_cancel'],args[0],args[1]); break;	// iframe edited warning for dirlist_item click
							default:						openWarning('unloading',['warning_btn_save','warning_btn_dont_save','warning_btn_cancel'],funcName,args);			// iframe unload warning for close/resetContent
						}																																				break;
					default:								doFunction(funcName,args);																				break;	// default: perform requested function w/o warning
				}
				break;
			default:
				switch(true) {
					case hasClass('body','iframe_edited'):	messageSend('iframe','unloading',funcName,args);															break;	// send unloading message for close or resetContent
					case hasClass('body','texteditor_edited') && !/navigateByArrowKey|uiPrefToggle/.test(funcName):	case funcName === 'texteditorClear':
														if ( isTopWindow() ) { removeClass('#content_pane','has_hidden_texteditor'); setData('#content_pane','content','has_texteditor'); }
														openWarning('texteditorClear',['warning_btn_save','warning_btn_dont_save','warning_btn_cancel']);				break;
					default:							doFunction(funcName,args);																						break;
				}
		}
	}
	function openWarning(id,buttonids,funcName,args)	{																		// ===> OPEN WARNING
		addClass('body','has_warning');    removeAttr('#warnings_container','class');    addClass('#warnings_container',id);
		addClass('#'+id,'show');		   buttonids.forEach( el => addClass('#'+el,'show') );											// show warning buttons and message
		getEl('#'+ buttonids[0]).focus(); getEl('#'+ buttonids[0]).classList.add('focus');																				// focus default warning button
		if ( funcName !== undefined )		{ setData('#warnings_container','funcname',funcName); }									// store funcName and args to complete after clicking warning button
		if ( args !== undefined )			{ setData('#warnings_container','args',args); }
	}
	function closeWarning() {																										// ===> CLOSE WARNINGS
		removeClass('body','has_warning'); getEls('#warnings_container .show,#warnings_container .focus').forEach( el => el.classList.remove('show','focus') ); removeAttr('#warnings_container',['class','data-funcname']);
	}
	function warningButtons(id) {																																// ===> WARNING BUTTONs: what to do after warning button click
		let funcName = getData('#warnings_container','funcname') || '', args = getData('#warnings_container','args') || '';
		switch(id) {
			case 'warning_btn_save':																																	// Save/Don't Save Buttons
				switch(true) {																																			// After clicking Save/Don't Save Button...
					case !isTopWindow(): messageSend('top_body',getData('#warnings_container','funcname'),getData('#warnings_container','funcname'),[getData('#warnings_container','args')]); break; // funcName to top
					default: removeClass('body','iframe_edited'); doFunction(funcName,args);	focusEl('#top_body');	// remove iframe_edited class; do the function, if any; focus sidebar
				}
				deleteData('#warnings_container','funcname'); deleteData('#warnings_container',args);																	// remove warnings_container data
				if (id === 'warning_btn_save') { getEl('#save_text_link').click(); }																			break;	// if id = save button, click save text link
			case 'warning_btn_dont_save':	if ( !isTopWindow() ) { messageSend('top_body','close_content'); } else { doFunction(funcName,[args,'ok']); }		break;
			case 'warning_btn_cancel':
				switch(true) {
					case isTopWindow():		if ( hasClass('body','focus_content') ) { focusEl('#content_pane'); } else { focusEl('#top_body'); }				break;	// Cancel Button
					case !isTopWindow():
						if ( getData('#warnings_container','args') === 'warning_btn_save' && getData('#warnings_container','funcname') === 'closeContent' ) { messageSend('top_body','close_content'); } break;
				}																																				break;
			case 'warning_btn_clear':													texteditorClear();														break;	// Clear text editor
			case 'warning_btn_ok':																																		// OK Button
				switch(true) {
					case hasClass('#warnings_container','warning_close_font'):			closeWarning();  openFontFile('close');
						if ( funcName !== args && !/close_playlist|close_font/.test(args) )
										{ getEl('#'+funcName).click(); } else { getEl('.dirlist_item.selected').click(); }						return;	// close font file, open file by funcName (if funcName !== args)
					case hasClass('#warnings_container','warning_close_playlist'):		window.stop();  closeWarning();  closePlaylist();  closeContent();  showThis(getEl('.dirlist_item.selected').id);
						if ( funcName !== args && !/close_playlist|close_font/.test(args) ) { getEl('#'+funcName).click(); }					return;	// close playlist, open file by
					case hasClass('#warnings_container','warning_local_playlist'):																		// no break; local playlist
					case hasClass('#warnings_container','warning_local_file'):			closeWarning();											return;	// local file
					case hasClass('#warnings_container','warning_non_local_file'):		open(args,'_blank');									break;	// no break; open non_local file in new window
				}
				doFunction(funcName,args);																										break;	// do the function, if any, after clicking OK button
		}
		closeWarning();
	}
	// END WARNINGS
	//============================//
	// FINIS! † DEO GRATIAS † //
})();

/* 
### **VERSION 8.1.4** (2024-01-03)  
**IMPROVED:** Sorting should now honor browser language setting.
TODO: check international date formats

* INVESTIGATE:
ADD: Total size of files to stats? subtract when hiding hidden, closing subdirs or get new total from remaining visible items
*/

