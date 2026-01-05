// ==UserScript==
// @name                WME Keyboard Shortcuts
// @namespace           https://greasyfork.org/en/users/5920-rickzabel
// @description         Adds Keyboard Shortcuts to WME
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.0.8
// ==/UserScript==

//setup keyboard shortcut's header and add a keyboard shortcuts
function WMEKSRegisterKeyboardShortcut(ScriptName, ShortcutsHeader, NewShortcut, ShortcutDescription, FunctionToCall, ShortcutKeysObj) {
    // Figure out what language we are using
    var language = I18n.currentLocale();
    //check for and add keyboard shourt group to WME
    try {
        var x = I18n.translations[language].keyboard_shortcuts.groups[ScriptName].members.length;
    } catch (e) {
        //setup keyboard shortcut's header
        W.accelerators.Groups[ScriptName] = []; //setup your shortcut group
        W.accelerators.Groups[ScriptName].members = []; //set up the members of your group
        I18n.translations[language].keyboard_shortcuts.groups[ScriptName] = []; //setup the shortcuts text
        I18n.translations[language].keyboard_shortcuts.groups[ScriptName].description = ShortcutsHeader; //Scripts header
        I18n.translations[language].keyboard_shortcuts.groups[ScriptName].members = []; //setup the shortcuts text
    }
    //check if the function we plan on calling exists
    if (FunctionToCall && (typeof FunctionToCall == "function")) {
        I18n.translations[language].keyboard_shortcuts.groups[ScriptName].members[NewShortcut] = ShortcutDescription; //shortcut's text
        W.accelerators.addAction(NewShortcut, {
            group: ScriptName
        }); //add shortcut one to the group
        //clear the short cut other wise the previous shortcut will be reset MWE seems to keep it stored
        var ClearShortcut = '-1';
        var ShortcutRegisterObj = {};
        ShortcutRegisterObj[ClearShortcut] = NewShortcut;
        W.accelerators._registerShortcuts(ShortcutRegisterObj);
        if (ShortcutKeysObj !== null) {
            //add the new shortcut
            ShortcutRegisterObj = {};
            ShortcutRegisterObj[ShortcutKeysObj] = NewShortcut;
            W.accelerators._registerShortcuts(ShortcutRegisterObj);
        }
        //listen for the shortcut to happen and run a function
        W.accelerators.events.register(NewShortcut, null, function() {
            FunctionToCall();
        });
    } else {
        alert('The function ' + FunctionToCall + ' has not been declared');
    }

}
//if saved load and set the shortcuts
function WMEKSLoadKeyboardShortcuts(ScriptName) {
   if (localStorage[ScriptName + 'KBS']) {
      var LoadedKBS = JSON.parse(localStorage[ScriptName + 'KBS']); //JSON.parse(localStorage['WMEAwesomeKBS']);
      for (var i = 0; i < LoadedKBS.length; i++) {
         W.accelerators._registerShortcuts(LoadedKBS[i]);
      }
   }
}

function WMEKSSaveKeyboardShortcuts(ScriptName) {
   //return function() {
   var TempToSave = [];
   for (var name in W.accelerators.Actions) {
      //console.log(name);
      var TempKeys = "";
      if (W.accelerators.Actions[name].group == ScriptName) {
         if (W.accelerators.Actions[name].shortcut) {
            if (W.accelerators.Actions[name].shortcut.altKey === true) {
               TempKeys += 'A';
            }
            if (W.accelerators.Actions[name].shortcut.shiftKey === true) {
               TempKeys += 'S';
            }
            if (W.accelerators.Actions[name].shortcut.ctrlKey === true) {
               TempKeys += 'C';
            }
            if (TempKeys !== "") {
               TempKeys += '+';
            }
            if (W.accelerators.Actions[name].shortcut.keyCode) {
               TempKeys += W.accelerators.Actions[name].shortcut.keyCode;
            }
         } else {
            TempKeys = "-1";
         }
         var ShortcutRegisterObj = {};
         ShortcutRegisterObj[TempKeys] = W.accelerators.Actions[name].id;
         TempToSave[TempToSave.length] = ShortcutRegisterObj;
      }
   }
   localStorage[ScriptName + 'KBS'] = JSON.stringify(TempToSave);
   //}
}

//example function show show the shortcuts have been pressed
function WMEKSKyboardShortcutToCall() {
   alert('Awesome keyboard shortcut was pressed');
}

///////////////////////
//// Example Usage ////
///////////////////////

/*
//add two short cuts
WMERegisterKeyboardShortcut('WMEAwesome', 'WME Awesome Script', 'AwesomeShortcut1', 'Awesome Descrption 1', WMEKyboardShortcutToCall, '-1'); //shortcut1
WMERegisterKeyboardShortcut('WMEAwesome', 'WME Awesome Script',   'AwesomeShortcut2', 'Awesome Descrption 2', WMEKyboardShortcutToCall, '-1'); //shortcut1
WMERegisterKeyboardShortcut('WMEAwesome', 'WME Awesome Script',   'AwesomeShortcut3', 'Awesome Descrption 3', WMEKyboardShortcutToCall, 'ASC+l'); //shortcut1
//WMERegisterKeyboardShortcut('WMEAwesome','AwesomeShortcut2','Awesome Descrption 2',doesnotexist,'-1'); //fuction does not exist


//load the saved shortcuts
WMELoadKeyboardShortcuts('WMEAwesome');

//before unloading WME save the shortcuts
window.addEventListener("beforeunload", function() {
   WMESaveKeyboardShortcuts('WMEAwesome');
}, false);

//displays all of the shortcuts in the console
//W.accelerators.Actions;

//saved shortcuts to console
//JSON.parse(localStorage['WMEAwesomeKBS']);

//enjoy

*/