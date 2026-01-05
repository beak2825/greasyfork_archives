// ==UserScript==
// @name         WME-BindPoi
// @description  Create POI from keyboard (point or area).
// @namespace   https://greasyfork.org/ru/scripts/20386-wme-bindpoi
// @author      gserrg (mod - skirda)
// @include     https://www.waze.com/editor/*
// @include     https://www.waze.com/*/editor/*
// @include     https://editor-beta.waze.com/editor/*
// @include     https://editor-beta.waze.com/*/editor/*
// @grant       none
// @version     0.3
// @downloadURL https://update.greasyfork.org/scripts/20386/WME-BindPoi.user.js
// @updateURL https://update.greasyfork.org/scripts/20386/WME-BindPoi.meta.js
// ==/UserScript==

// An example of using the modified library https://greasyfork.org/ru/scripts/16071-wme-keyboard-shortcuts

var wmeBP_version="0.3"

function WmeBP_CreatePOI()
{
	if ((typeof arguments[0]) === "object")
	{
		if ((typeof (arguments[0].poiType)) === "string")
		{
			/*
				for eq(N)
			 0 = Car services
			 1 = Transportation
			 2 = Professional and public
			 3 = Shopping and services
			 4 = Food and Drink
			 5 = Culture & entertainment
			 6 = Other
			 7 = Lodging
			 8 = Outdoors
			 9 = Natural Features
			10 = Parking Lot
			*/
			$('.toolbar-group-venues').find('.dropdown-menu').find('.toolbar-group-item').eq(6).find(arguments[0].poiType).click();
		}
	}
}

function WmeBP_Initialise()
{
	var Config =[
		{handler: 'WMEBindPoi_Point', title: "Create Point",  func: WmeBP_CreatePOI, key:-1, arg:{poiType:'.point'}},
		{handler: 'WMEBindPoi_Area',  title: "Create Area",   func: WmeBP_CreatePOI, key:-1, arg:{poiType:'.polygon'}}
	];
	for(var i=0; i < Config.length; ++i)
	{
		WMEKSRegisterKeyboardShortcut('WME-BindPoi', 'WME-BindPoi', Config[i].handler, Config[i].title, Config[i].func, Config[i].key, Config[i].arg);
	}

	WMEKSLoadKeyboardShortcuts('WME-BindPoi');

	window.addEventListener("beforeunload", function() {
		WMEKSSaveKeyboardShortcuts('WME-BindPoi');
	}, false);

}

function WmeBP_bootstrap()
{
	setTimeout(WmeBP_Initialise, 100);
}

WmeBP_bootstrap();


// from: https://greasyfork.org/ru/scripts/16071-wme-keyboard-shortcuts
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
function WMEKSRegisterKeyboardShortcut(e,r,t,a,o,s,c){try{I18n.translations.en.keyboard_shortcuts.groups[e].members.length}catch(n){Waze.accelerators.Groups[e]=[],Waze.accelerators.Groups[e].members=[],I18n.translations.en.keyboard_shortcuts.groups[e]=[],I18n.translations.en.keyboard_shortcuts.groups[e].description=r,I18n.translations.en.keyboard_shortcuts.groups[e].members=[]}if(o&&"function"==typeof o){I18n.translations.en.keyboard_shortcuts.groups[e].members[t]=a,Waze.accelerators.addAction(t,{group:e});var l="-1",i={};i[l]=t,Waze.accelerators._registerShortcuts(i),null!==s&&(i={},i[s]=t,Waze.accelerators._registerShortcuts(i)),W.accelerators.events.register(t,null,function(){o(c)})}else alert("The function "+o+" has not been declared")}function WMEKSLoadKeyboardShortcuts(e){if(localStorage[e+"KBS"])for(var r=JSON.parse(localStorage[e+"KBS"]),t=0;t<r.length;t++)Waze.accelerators._registerShortcuts(r[t])}function WMEKSSaveKeyboardShortcuts(e){var r=[];for(var t in Waze.accelerators.Actions){var a="";if(Waze.accelerators.Actions[t].group==e){Waze.accelerators.Actions[t].shortcut?(Waze.accelerators.Actions[t].shortcut.altKey===!0&&(a+="A"),Waze.accelerators.Actions[t].shortcut.shiftKey===!0&&(a+="S"),Waze.accelerators.Actions[t].shortcut.ctrlKey===!0&&(a+="C"),""!==a&&(a+="+"),Waze.accelerators.Actions[t].shortcut.keyCode&&(a+=Waze.accelerators.Actions[t].shortcut.keyCode)):a="-1";var o={};o[a]=Waze.accelerators.Actions[t].id,r[r.length]=o}}localStorage[e+"KBS"]=JSON.stringify(r)}
/* ********************************************************** */
