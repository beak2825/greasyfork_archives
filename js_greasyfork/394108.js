// ==UserScript==
// @name         WME Auto Unfollow Urs
// @namespace    https://gitlab.com/WMEScripts/
// @version      1.1
// @description  Unfollow URs!
// @author       Tunisiano18
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @require         https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant           GM_info
// @downloadURL https://update.greasyfork.org/scripts/394108/WME%20Auto%20Unfollow%20Urs.user.js
// @updateURL https://update.greasyfork.org/scripts/394108/WME%20Auto%20Unfollow%20Urs.meta.js
// ==/UserScript==

// Updates informations
var UpdateNotes = "";
const _WHATS_NEW_LIST = { // New in this version
    '0.9': 'Script creation',
    '1.0': 'Sending to prod',
    '1.1': 'Updates notes'
};

// Var declaration
var ScriptName = GM_info.script.name;
var ScriptVersion = GM_info.script.version;

// Send easily logs into the console
function log(message, thisscript = ScriptName) { // Thanks to Glodenox but enhanced
    if (typeof message === 'string') {
        console.log('%c' + thisscript + ' : %c' + message, 'color:black', 'color:#d97e00');
    } else {
        console.log('%c' + thisscript + ' :', 'color:black', message);
    }
}

// Check the version of the scritpt in the browser to Warn if the script has been updates
function VersionCheck() {
    ///////////////////////////////////////
    //         Check for updates         //
    ///////////////////////////////////////
    if (localStorage.getItem('WMEUnfollow') === ScriptVersion && 'WMEUnfollow' in localStorage) {
        // Do nothing
    } else if ('WMEUnfollow' in localStorage) {
        if(!WazeWrap.Interface) {
            setTimeout(VersionCheck, 1000);
            log("WazeWrap not ready, waiting");
            return;
        }
        UpdateNotes = "";
        for (var key in _WHATS_NEW_LIST) {
            if(ScriptVersion == key) {
                UpdateNotes = "What's New ?<br />";
            }
            if(UpdateNotes != "")
            {
                UpdateNotes = UpdateNotes + "<br />" + key + ": " + _WHATS_NEW_LIST[key];
            }
        }
        UpdateNotes = UpdateNotes + "<br />&nbsp;";
        WazeWrap.Interface.ShowScriptUpdate(ScriptName, ScriptVersion, UpdateNotes, "https://gitlab.com/WMEScripts/wme-unfollow-u");
        localStorage.setItem('WMEUnfollow', ScriptVersion);
        $(".WWSUFooter a").text("Gitlab")
    } else {
        localStorage.setItem('WMEUnfollow', ScriptVersion);
    }
}

//Check and unfollow part
setInterval(function(){
        if($("input[name=follow]").length > 0) {
            //alert('exist');
            if($( "input[name=follow]:checked" ).length>0) {
                //alert('checked');
                $("input[name=follow]").click();
            };
        };
}, 5000);