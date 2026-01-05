// ==UserScript==
// @name                WME Keyboard Shortcuts Useage2
// @namespace           https://greasyfork.org/en/users/5920-rickzabel
// @description         Adds Keyboard Shortcuts to WME
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.0.3
// @require https://greasyfork.org/scripts/16071-wme-keyboard-shortcuts/code/WME%20Keyboard%20Shortcuts.js
// @downloadURL https://update.greasyfork.org/scripts/16072/WME%20Keyboard%20Shortcuts%20Useage2.user.js
// @updateURL https://update.greasyfork.org/scripts/16072/WME%20Keyboard%20Shortcuts%20Useage2.meta.js
// ==/UserScript==

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////																												//////
////// This is an example script showing how to add keyboard shortcuts to WME										//////
////// using the library file i wrote. please feel free to use the library.											//////
////// Please feel free to make any suggestions to rickzabel on waze												//////
////// 																												//////
//////	There are three main functions																				//////
//////	1. setups the keyboard shortcut section in the keyboard editor												//////
//////		and will add shortcuts when called																		//////
//////	2. loads the previously set shortcuts and reapplies them.													//////
//////	3. save the keyboard shortcut to a localstorage on page reload or exit										//////
//////																												//////
//////	replace all 'WMEAwesome' with your script's name such as 'SomeOtherScript'									//////
//////																												//////
//////	in your scripts header add (such as above)																	//////
//////	// @require https://greasyfork.org/scripts/16071-wme-keyboard-shortcuts/code/WME%20Keyboard%20Shortcuts.js	//////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Initialise function so we can wait for WME to load
function initialiseKSU() {

	/*
	when adding shortcuts each shortcut will need a uniuque name
	the command to add links is WMERegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
	ScriptName: This is the name of your script used to track all of your shortcuts on load and save. 
	ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
	ShortcutsHeader: this is the header that will show up in the keyboard editor
	NewShortcut: This is the name of the shortcut and needs to be uniuque from all of the other shortcuts, from other scripts, and WME
	ShortcutDescription: This wil show up as the text next to your shortcut
	FunctionToCall: this is the name of your function that will be called when the keyboard shortcut is presses
	ShortcutKeysObj: the is the object representing the keys watched set this to '-1' to let the users specify their own shortcuts.
	ShortcutKeysObj: The alt, shift, and ctrl keys are A=alt, S=shift, C=ctrl. for short cut to use "alt shift ctrl and l" the object would be 'ASC+l'
	*/

	//add 3 short cuts
	WMEKSRegisterKeyboardShortcut('WMEAwesome', 'WME Awesome Script', 'AwesomeShortcut1', 'Awesome Descrption 1', WMEKSKyboardShortcutToCall, '-1'); //shortcut1
	WMEKSRegisterKeyboardShortcut('WMEAwesome', 'WME Awesome Script',	'AwesomeShortcut2', 'Awesome Descrption 2', WMEKSKyboardShortcutToCall, '-1'); //shortcut1
	WMEKSRegisterKeyboardShortcut('WMEAwesome', 'WME Awesome Script',	'AwesomeShortcut3', 'Awesome Descrption 3', WMEKSKyboardShortcutToCall, 'ASC+l'); //shortcut1
	//WMERegisterKeyboardShortcut('WMEAwesome','AwesomeShortcut2','Awesome Descrption 2',doesnotexist,'-1'); //fuction does not exist


	//load the saved shortcuts 
	//ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
	WMEKSLoadKeyboardShortcuts('WMEAwesome');

	//before unloading WME save the shortcuts
	//ScriptName: replace 'WMEAwesome' with your scripts name such as 'SomeOtherScript'
	window.addEventListener("beforeunload", function() {
		WMEKSSaveKeyboardShortcuts('WMEAwesome');
	}, false);

}

//wait 3 seconds before launching the script
setTimeout(initialiseKSU, 3000);