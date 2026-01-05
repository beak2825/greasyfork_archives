/////////////////////////////////////////////////////////////////////////////////////////////
//
// Starfleet Commander Advantage - All Planets
// Copyright (c) Robert Leachman
//
// ------------------------------------------------------------------------------------------
//
// This is a Tampermonkey script, tested for use with Chrome.
// (TODO: Expand on this instruction)
//
// Install Chrome, then Tampermonkey, then this script.
//
// ------------------------------------------------------------------------------------------
//
// USAGE:
//
// * Enhances the UI to provide one-click access to the information tabs provided by SFC 
//   from Home > All Planets.
// * Provides the toolbar for Starfleet Commander Advantage; this script must be installed
//   to provide the foundation for the other SFCA scripts.
//
//
// KNOWN ISSUES
// - Need to fix the hardcoded planet number!
// - Need some sort of global module enablement function...
//
// GOOD IDEAS PILE
// - Enhance to not flash the Resources tab when the others are requested. Sort?
//
// DONE
// - Module started
//
// VERSION HISTORY
//
// 0.7 - Just bring current
//
// 0.5 - Worked on module enable/disable
//
// 0.3 - Use the more advanced method of avoiding jQuery conflicts.
//     - One cookie is sufficient.
//
// 0.1 - Created module! Back in the saddle in 2015 with a new intent to
//       become a better Javascript programmer.
//
//
// ==UserScript==
// @name         SFCA AllPlanets-Test
// @namespace    http://your.homepage/
// @version      0.8
// @description  Immediate access to the All Planets tabs
// @author       Robert Leachman
// @match        http://*.playstarfleet.com/*
// @match        http://*.playstarfleetextreme.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
//
// @downloadURL https://update.greasyfork.org/scripts/12153/SFCA%20AllPlanets-Test.user.js
// @updateURL https://update.greasyfork.org/scripts/12153/SFCA%20AllPlanets-Test.meta.js
// ==/UserScript==
/////////////////////////////////////////////////////////////////////////////////////////////


/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 *             U S E R S C R I P T  F U N C T I O N S
 *
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
// per https://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/
jQuery.noConflict();

// from Dive Into Greasemonkey (2010)
// http://diveintogreasemonkey.org/patterns/add-css.html
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// Basic cookie getter, I don't need anything more than this sample code
// http://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

// Copies user script into the page, as javascript accessible to onClick...
// The 2010 comment was "Like the original except don't fire the script 
// on load, just make it available".
//
// 2015, I don't recall what all that meant.
function myAttachIt(theFunction) {

    var script = document.createElement("script");
    script.type = "application/javascript";

    //anonymous function, fires on load:
    //script.textContent = "(" + myScript + ")();";

    //we just want it available for later:
    script.textContent = theFunction;

    document.body.appendChild(script);
}
/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * MY FUNCTIONS:
 *
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
// Display a nice status or error message box
function emitNotification($, quickLink) {
    var messageBox = document.createElement("div");
    messageBox.setAttribute('class','notice');
    messageBox.innerHTML=quickLink;

    $(messageBox).appendTo('#flash_messages');
}

// Add a toolbar to all screens, to allow handy access to the All Planets tabs.
function addMyToolbar($, moduleEnabled) {
    var toolbarDiv = document.createElement('div');
    toolbarDiv.setAttribute('id','myToolbar');
    //    myStuffDiv.innerHTML='All: <a href="/overview?current_planet=34287">[ All Tasks ]</a>';
    var toolbar="All: ";

    if (moduleEnabled) {
        toolbar +="<a onClick='displayAllTasks(\"resources\");'>[Resources]</a>";
        toolbar +=" <a onClick='displayAllTasks(\"mines\");'>[Mines]</a>";
        toolbar +=" <a onClick='displayAllTasks(\"ships\");'>[Ships]</a>";
        toolbar +=" <a onClick='displayAllTasks(\"defenses\");'>[Defenses]</a>";      
        toolbar +=" <a onClick='displayAllTasks(\"tasks\");'>[Tasks]</a>";
    }

    toolbarDiv.innerHTML=toolbar;

    $('#flash_messages').before(toolbarDiv);
}

// this is inserted Javascript, not user script!
function displayAllTasks(tabName) {
    // It's a mistake to do anything at all for the Resources tab, it's the default and we only make it flicker and redisplay...
    if (tabName !== "resources") {
        document.cookie="allItemsTab="+tabName+";path=/";
    }
    window.location.href = "/overview?current_planet=34287";
}

// this is inserted Javascript, not user script!
function toggleModuleEnabled() {
    console.log("TOGGLE ENABLE");
    document.cookie="toggleModuleEnabled=toggle;path=/";
    location.reload();
}

// Display BOJ message on Profile screen
function insertProfileHeader($,moduleEnabled) {

    var isEnabled='';
    var active='DISABLED';
    if (moduleEnabled) {
        isEnabled='checked';
        active='ACTIVE';
    }
    emitNotification($,
                     '<input type="checkbox" '+isEnabled+' onClick="toggleModuleEnabled();"> \
Starfleet Commander Advantage -  All Planets \
(version ' + GM_info.script.version + '): ' + active);
}


function addMyCSS() {
    // Status messages...
    myCSS  = ".myStatusBox {";
    myCSS += "color: #FF9219;";
    myCSS += "background-image:url(/images/starfleet/layout/transparent_grey_bg.png);";
    myCSS += "border:1px solid #006C82;";
    myCSS += "padding:5px;";
    myCSS +=" margin-bottom:3em;";
    myCSS += "vertical-align: top;";
    myCSS +="}";
    myCSS += ".myLessFancyStatusBox {";
    myCSS += "color: white;";
    myCSS += "background-image:url(/images/starfleet/layout/transparent_grey_bg.png);";
    myCSS += "border:1px solid #006C82;";
    myCSS += "padding:10px;";
    myCSS +=" margin-bottom:1em;";
    myCSS +="}";

    myCSS += '#myToolbar {';
    myCSS += 'background-image: url(/images/starfleet/layout/transparent_grey_bg.png);';
    myCSS += 'border: 1px solid yellow;';
    myCSS += 'margin-left: -10px;';
    myCSS += 'margin-bottom: 5px;';
    myCSS += 'padding: 10px 10px 10px 20px;';
    myCSS += '}';    

    addGlobalStyle(myCSS);
}


// Extend the base function to provide separation between the differnet versions...
function myGMsetValue(param, value) {
    var uni=window.location.href.split('.')[0].split('/')[2];
    //console.log('Setting '+uni+'-'+param+'='+value);
    GM_setValue(uni+'-'+param, value);
}

function myGMgetValue(param, def) {
    var uni=window.location.href.split('.')[0].split('/')[2];
    var needDefault = "NoSuchValueStoredHere";
    var val = GM_getValue(uni+'-'+param, needDefault);
    //console.log('fetched '+uni+'-'+param+'='+val);
    if (val == needDefault)
        return def;
    else
        return val;
}
/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 *             M A I N L I N E
 *
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
jQuery( document ).ready(function( $ ) {

    var m = myGMgetValue('enabled_AllPlanets','true');
    moduleEnabled=(m ==='true');    
    
    var doToggle = getCookie('toggleModuleEnabled');
    if (doToggle === 'toggle') {
        document.cookie = "toggleModuleEnabled=; expires=Sun, 04 Jul 1970 00:00:00 UTC";
        if (moduleEnabled) {
            myGMsetValue('enabled_AllPlanets','false');
            moduleEnabled=false;
        } else {
            myGMsetValue('enabled_AllPlanets','true');
            moduleEnabled=true;
        }
    }    

    var displayEnabled='DISABLED';
    if (moduleEnabled)
        displayEnabled='enabled';
    var myVersion = GM_info.script.version; 
    console.log ('AllPlanets ver', myVersion, displayEnabled);

    /***
     * When the All Planets overview is displayed, if we got here from a click on our toolbar, switch to the appropriate tab.
     *
     * Developer note: Plain javascript cookies are employed to track what the user wants to do, from the onClick event to the
     * subsequent page load. The onClick handler is injected into the page so is not userscript, and has no access to GM_setValue.
     ***/
    if ( $('#content.overview.index').length ) {
        var showAllTasks = getCookie('alltasks');
        var tabName = getCookie('allItemsTab');
        document.cookie = "alltasks=; expires=Sun, 04 Jul 1976 00:00:00 UTC";
        document.cookie = "allItemsTab=; expires=Sun, 04 Jul 1976 00:00:00 UTC";

        if (tabName.length) {
            disable_ajax_links();; 
            new Ajax.Request('/overview/'+ tabName + '?current_planet=34287', {asynchronous:true, evalScripts:true});
        }
    }


    // Display BOJ message with version on Profile screen
    if ( $('#content.options.index').length ) {
        insertProfileHeader($,moduleEnabled);
    } else {
        addMyToolbar($,moduleEnabled);
    }
});

//console.log("BOJ AllPlanets");
addMyCSS();
myAttachIt(displayAllTasks);
myAttachIt(toggleModuleEnabled);

