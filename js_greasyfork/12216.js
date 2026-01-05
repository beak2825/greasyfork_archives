/////////////////////////////////////////////////////////////////////////////////////////////
//
// Starfleet Commander Advantage - Sleepsave
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
// * One-click fleetsave for a specified duration, like when you're ready to go to sleep.
//
// KNOWN ISSUES
// - What if no Recyclers?
// - What if no fleets?
// - If it does hang up, need to auto-abort and not resume with surprise next time ships are shown
//
// GOOD IDEAS PILE
// - Recreate in 2015
//
// DONE
// - Module started
//
// VERSION HISTORY
//
// 0.3 - This shabby mess is starting to do things
//
// 0.1 - Revive from 2010 version.
//
//
// ==UserScript==
// @name         SFCA Sleepsave-Test
// @namespace    http://your.homepage/
// @version      0.4
// @description  One-click fleetsave
// @author       Robert Leachman
// @match        http://*.playstarfleet.com/*
// @match        http://*.playstarfleetextreme.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
//
// @downloadURL https://update.greasyfork.org/scripts/12216/SFCA%20Sleepsave-Test.user.js
// @updateURL https://update.greasyfork.org/scripts/12216/SFCA%20Sleepsave-Test.meta.js
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

// From https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
// Hacked to use noConflict jQuery

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements ($,
                              selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
                              actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
                              bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
                              iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
                             ) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
        .find (selectorTxt);
    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction ($,jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                waitForKeyElements ($,
                                    selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector
                                   );
            },
                                       300
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 * MY FUNCTIONS:
 *
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
// Display a nice status or error message box
function emitNotification($, quickLink) {
    var messageBox = document.createElement("div");
    messageBox.setAttribute('class','notice'); // class error is red, could be handy
    messageBox.innerHTML=quickLink;

    $(messageBox).appendTo('#flash_messages');
}

// this is inserted Javascript, not user script!
function toggleModuleEnabled_Sleepsave() {
    console.log("TOGGLE SLEEPSAVE ENABLE");
    document.cookie="set_moduleEnabled_Sleepsave=toggle;path=/";
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
                     '<input type="checkbox" '+isEnabled+' onClick="toggleModuleEnabled_Sleepsave();"> \
Starfleet Commander Advantage -  Sleepsave \
(version ' + GM_info.script.version + '): ' + active);
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

function myAttachIt(theFunction) {

    var script = document.createElement("script");
    script.type = "application/javascript";

    //anonymous function, fires on load:
    //script.textContent = "(" + myScript + ")();";

    //we just want it available for later:
    script.textContent = theFunction;

    document.body.appendChild(script);
}

function addMyCSS() {

    myCSS += '#content.fleet #fleets_span {';
    myCSS += 'display: none;';
    myCSS += '}';       


    myCSS += '.commander {';
    myCSS += 'display:none';
    myCSS += '}';


    myCSS += '#myFleets {';
    myCSS += 'margin-left: -10px;';
    myCSS += '}';


    addGlobalStyle(myCSS);
}

function doToggleFleets() {
    var toggleFleets='none';
    var e=document.getElementById("fleetWrapper");
    if (e.getAttribute("style") !== "display:block") {
        e.setAttribute('style','display:block');
        toggleFleets='block';
    } else {
        e.setAttribute('style','display:none');
    }
    document.cookie='set_toggleFleets='+toggleFleets+';path=/';
}

// Fix up a nicer fleet count, with a button to toggle the whole section...
function addMyFleetbar($) {
    // If we have fleets out...
    if ($('#fleets_span').length) {
        var toolbarDiv = document.createElement('div');
        toolbarDiv.setAttribute('id','myFleets');
        var theirFleets = $('#fleets_used').html();
        //console.log('their fleets',theirFleets);
        var fleetsOut = theirFleets.split('>')[1].split('<')[0];
        //console.log("their fleet out:",fleetsOut);
        var totalFleets = theirFleets.split('>')[2].split(' ')[0].split('/')[1];
        //console.log('tot fleets',totalFleets);
        var fleetCounts='Fleets: '+fleetsOut+'/'+totalFleets;

        var theHTML='<span>'+fleetCounts+'</span><span style="float:right">';
        theHTML += '<a id="myFleets" href="#">[Toggle]</a></span>';
        toolbarDiv.innerHTML=theHTML;
        $('#fleets_span').before(toolbarDiv);

        var setup = document.getElementById('myFleets');
        setup.addEventListener('click', function(e) {
            doToggleFleets();
        },false);    
    }
}

function stripCoordsFromPlanetRow($,row) {
    var planet=row.children('td').first();
    var coords=planet.children('div').first().next().find('.coords');
    var theirHTML=coords.html();
    return theirHTML.split('=')[2].split('&')[0]; // for /fleet?current_planet=34287
}

// Test the list of ships and see if there's any part of it that isn't a satellite
// NOTE: works beautifully but isn't used ATM, it's all about recyclers...
function fleetIsSatelliteOnly(shipList) {
    // remove all whitespace:
    shipList=shipList.replace(/\s/g, "");
    // inspect for satellite descriptor
    var div = /<divclass="ship"><spanclass="image"><imgalt="Icon_solar.*?\/div>/;
    div.test(shipList);
    // see if the list contains more than just a satellite

    /* TODO: WebStorm simplied this, I need to ask somebody about syntax
            if (RegExp.leftContext.length === 0 && RegExp.rightContext.length === 0) {
               return true;
            }
            return false;
            */
    return !!(RegExp.leftContext.length === 0 && RegExp.rightContext.length === 0);
}

// Test the list of ships and see if there's a recycler
function fleetHasRecycler(shipList) {
    // remove all whitespace:
    shipList=shipList.replace(/\s/g, "");
    // inspect a recycler descriptor.. easy peasy
    var dionysus = /dionysus_class/; // zagreus too
    var zagreus = /zagreus_class/;
    //console.log("DEBUG Dionysis:",dionysus.test(shipList));
    //console.log("DEBUG Zagreus:",zagreus.test(shipList));
    //console.log("DEBUG RECYCLER: ",dionysus.test(shipList) || zagreus.test(shipList));
    return (dionysus.test(shipList) || zagreus.test(shipList));
}

function sleepNextPlanet($) {
    // get the next planet to process, shift out the first one, mark it and sleep it, until the list is empty
    var sleepList = JSON.parse(myGMgetValue('autoSleepPlanets','[]'));         
    var sleepPlanet = sleepList.shift();
    if (sleepPlanet != undefined) {
        myGMsetValue('autoSleepPlanets', JSON.stringify(sleepList));
        console.log("NEXT TO SLEEP:",sleepPlanet[0],sleepPlanet[1],sleepPlanet[2]);

        theName = $('#theirRow'+sleepPlanet[0]+' > td').children().first().next().children().first();
        theName.html('<font color="yellow">'+sleepPlanet[2]+'</font>');

        // now sleepsave this planet
        do_setupSleep(sleepPlanet[1]);

    } else {
        emitNotification($,"Done, have a good night!");
        myGMsetValue('auto_Sleepsave','false');
    }
}

// Affect a single button that will cause all fleets to save when it's time to sleep
function doSetupAuto($) {
    // Process each ship row, add a sleep button... or something :)
    var saveState=[];
    var i=0;
    while($('#theirRow'+i).length) {
        //console.log($('#theirRow0').html());
        var p=stripCoordsFromPlanetRow($,$('#theirRow'+i));

        var ships=$('#theirRow'+i).children('td').first().next();
        var shipStr = ships.html();
        shipStr = shipStr.trim();

        // mark each planet that has ships with italics, and save it for processing
        if (shipStr.length > 0 && (fleetHasRecycler(shipStr))) {
            theName = $('#theirRow'+i+' > td').children().first().next().children().first();
            var thisPlanet = [i,p,theName.html()]; // row, planet, name... should be sufficient

            saveState.push(thisPlanet);
            theName.html('<i>'+theName.html()+'</i>');
        }
        i++;
    }
    i=0;
    myGMsetValue('autoSleepPlanets', JSON.stringify(saveState));
    myGMsetValue('auto_Sleepsave','true');

    sleepNextPlanet($);

    /*
    var newArray = JSON.parse(asString);
    var one = newArray.shift();
    console.log('result');
    for (var j=0;j<saveState.length;j++) {
        console.log(j,saveState[j][0],saveState[j][1],saveState[j][2]);
    }
    */

    //console.log('arr',newArray);
    //console.log('one',one);

}



// this is inserted Javascript, not user script!
function do_setupSleep(planet) {
    // this cookie shit is hokey as hell                                   TODO: must fix
    document.cookie='set_sleep_cookie='+planet+';path=/';
    //myGMsetValue('sleep_this_planet','true');
    window.location.href = '/fleet?current_planet='+planet;
}


function displayingShips($, ships) {
    console.log("SHIPS!");
    // If we're in auto mode, offer abort and do next, else offer setup
    var autosleepActive=(myGMgetValue('auto_Sleepsave','false') ==='true');
    if (autosleepActive) {
        // Display the toolbar with the abort button (not the setup button)
        toolbarAutoSleep($,false);
        // wait a couple seconds then fire the next sleep request
        setTimeout(function (){

            sleepNextPlanet($);

        }, 2);                                                            // How long do you want the delay to be (in milliseconds)?     



    } else {
        toolbarAutoSleep($,true);
    }

    // Process each ship row, add a sleep button... or something :)
    var i=-1;
    $('#overview_table > table > tbody  > tr').each(function() {
        if (i>-1) {
            $this = $(this);
            var theirRow = 'theirRow' + i;
            this.setAttribute('id',theirRow);
            //var value = $this.find(".planet").html();
            var value = $this.html();

            var ships=$this.children('td').first().next();
            var shipStr = ships.html();
            shipStr = shipStr.trim();
            //console.log("r",i,"l",shipStr.length,"s",shipStr);
            fleetHasRecycler(shipStr);
            if (shipStr.length > 0 && (fleetHasRecycler(shipStr))) {
                var p=stripCoordsFromPlanetRow($,$this);
                var myButton='<div id="button" style="float:right">&nbsp;&nbsp;<input onClick="do_setupSleep('+p+');" type="button" value="Sleepsave"></div>';

                var planet=$this.children('td').first();
                var coords=planet.children('div').first().next().find('.coords');
                coords.html(coords.html()+myButton);
            }
        }
        i++;
    });
}

function initSleepsave($,manual) {
    // Distance: negative is # of planets away, positive is # of systems away, 0 is the home planet
    var targetDist = myGMgetValue('SleepDist', 1);
    // Speed: 0=100% 9=10%
    var sleepSpeed = myGMgetValue("SleepSpeed", 1);

    //console.log("HARDCODE DIST");
    //var targetDist=20;
    //var sleepSpeed=8;

    console.log("SLEEP OPTIONS: dist", targetDist, "speed", sleepSpeed);

    if (manual) {
        // replace the offer to buy a commander, with our button to execute the sleepsave manually...
        var buttonDiv = $('#hydro_commander_notice');
        buttonDiv.html('<div id="button" style="float:right">&nbsp;&nbsp;<input onClick="do_sleepsave('+targetDist+','+sleepSpeed+',true);" type="button" value="Sleepsave"></div>');
    } else {
        console.log("Autosleep!");
        do_sleepsave(targetDist,sleepSpeed,false);
    }
}

// this is injected into the page, it's NOT userscript!
function do_sleepsave(targetDist, sleepSpeed,manual) {
    console.log("sleeping");
    if (manual) {
        console.log("... manually");
    } else
        console.log('full auto');

    select_all_ships();

    try {
        var speedField=document.getElementById('speed');
        speedField.selectedIndex = sleepSpeed;
        speedField.options[sleepSpeed].selected=true
    } catch (err) {
        alert("No ships!");
        return false;
    }

    var availableOre = $F('max_ore');
    var availableCrystal = $F('max_crystal');
    var availableHydrogen = $F('max_hydrogen');
    var avail = parseInt(availableOre,10) + parseInt(availableCrystal,10) + parseInt(availableHydrogen,10);

    oFormObject = document.forms[1];

    //oFormObject.elements['solar_system'].value = 8;

    if (targetDist > 0) {
        targetSystem = get_inner_html('current_planet_solar_system') - targetDist;
        if (targetSystem < 1) {
            targetSystem = get_inner_html('current_planet_solar_system') + targetDist;
        }
        oFormObject.elements['solar_system'].value = targetSystem;
    } else {
        targetPlanet = get_inner_html('current_planet_position') - (targetDist * -1);
        if (targetPlanet < 1) {
            targetPlanet = get_inner_html('current_planet_position') + targetDist;
        }
        oFormObject.elements['planet'].value = targetPlanet;
    }


    //$("#mission_option_harvest").click();
    document.getElementById('mission_option_harvest').click();

    //2015: No clue what this was needed in 2010?
    update_fleet_info();
    select_max_cargo('ore');
    select_max_cargo('crystal');
    select_max_cargo('hydrogen');

    // Now let's see how it turned out... first, sum the outbound res+hydro cost to ship
    spentH = document.getElementById('task_consumption').innerHTML;
    savedO = $F('send_ore');
    savedC = $F('send_crystal');
    savedH = $F('send_hydrogen');
    tot = parseInt(savedO,10) + parseInt(savedC,10) + parseInt(savedH,10) + parseInt(spentH,10);


    // Also compute the total cargo capacity of the ships on this planet

    /*
    <div class="ship_selector">
        <div class="max">
            <input onclick="assign_max_ships('ship_quantity_676893046');;" type="button" value="Max">
                </div>

            <div class="quantity">
                <div class="increment_widget">
                    <a class="left_button" href="#" onclick="incrementWidget('ship_quantity_676893046', -1, 0, null); return false;"><img alt="<" src="/images/starfleet/layout/left_arrow.png?1439250916"></a>


                    <input autocomplete="off" class="ship_quantity" id="ship_quantity_676893046" name="ship_quantities[676893046]" onclick="select_field('ship_quantity_676893046');" type="text" value="0">

                        <a class="right_button" href="#" onclick="incrementWidget('ship_quantity_676893046', 1, 0, null); return false;"><img alt=">" src="/images/starfleet/layout/right_arrow.png?1439250916"></a>

                        <div class="clear"></div>
                        </div>

                        </div>

                        <div id="ship_quantity_676893046_group_defend_cost" class="hidden">
                            1.0
                        </div>
                        <div id="ship_quantity_676893046_cargo_capacity" class="hidden">
                            5000
                        </div>
                        <div id="ship_quantity_676893046_speed" class="hidden">
                            20000
                        </div>
                        <div id="ship_quantity_676893046_fuel_consumption" class="hidden">
                            20.0
                        </div>
                        <div id="ship_quantity_676893046_key" class="hidden">atlas_class</div>
                        </div>
                        */





    diff = avail - tot;
    if (diff > 0) {
        if (manual) {
            alert("Need to spend " + diff);
        } else {
            console.log("SLEEPSAVE AUTO: INSUFFICIENT!");
            document.cookie='set_didSleep=true;path=/';
            document.getElementById('assign_button').click();
        }
    } else {
        if (manual) {
            if (confirm("Ready to sleep?") == true) {
                document.getElementById('assign_button').click();
            }
        } else {
            console.log("SLEEPSAVE AUTO: executing...");
            document.cookie='set_didSleep=true;path=/';
            document.getElementById('assign_button').click();
        }            
    }
}

// A quick toolbar hack, for debugging... not current used                   TODO: delete it?
function debuggerBar($) {
    var toolbarDiv = document.createElement('div');
    toolbarDiv.setAttribute('id','sleepToolbar');

    var theHTML = '<a href="#">[Setup]</a></span>';
    toolbarDiv.innerHTML=theHTML;
    $('#overview_table').before(toolbarDiv);

    var setup = document.getElementById('sleepToolbar');
    setup.addEventListener('click', function(e) {
        doSetupAuto($);
    },false);

}


//////////////////////////////////////////////////////////////////////////////////////////////////// old ///////////////////////////
// Sort by travel time, that's the order we like to select by...
function sortSleepPicksByTravelTime(sleepPicks) {
    var swapIt;
    for (var i = 1; i < sleepPicks.length; i++) {
        //myLog("PICK: " + i + " percent=" + sleepPicks[i].split("/")[1].split(";")[0]);
        var j = i;
        /*
	   while ((j > 0) && ( 
	    (parseInt(sleepPicks[j].split("/"),10) < parseInt(sleepPicks[j-1].split("/"),10)) ||
	    ( (parseInt(sleepPicks[j].split("/"),10) == parseInt(sleepPicks[j-1].split("/"),10)) && ( sleepPicks[j].split("/")[1].split(";")[0] < sleepPicks[j-1].split("/")[1].split(";")[0]  ) )
	   )) {
*/
        while (j > 0) {
            //var key1 = parseInt(sleepPicks[j].split("/"),10);
            //var key2 = parseInt(sleepPicks[j-1].split("/"),10);
            var key1 = parseInt(sleepPicks[j].split("/")[1].split("~")[0],10);
            var key2 = parseInt(sleepPicks[j-1].split("/")[1].split("~")[0],10);
            if (key1 < key2) {
                swapIt = sleepPicks[j];      
                sleepPicks[j] = sleepPicks[j-1];
                sleepPicks[j-1] = swapIt;
            }
            j--;
        }
    } 	
    return sleepPicks;
}

// Sort by return time and percentage
function sortSleepPicksByReturnAndPercentage(sleepPicks) {
    var swapIt;
    for (var i = 1; i < sleepPicks.length; i++) {
        var j = i;
        /*
	   while ((j > 0) && ( 
	    (parseInt(sleepPicks[j].split("/"),10) < parseInt(sleepPicks[j-1].split("/"),10)) ||
	    ( (parseInt(sleepPicks[j].split("/"),10) == parseInt(sleepPicks[j-1].split("/"),10)) && ( sleepPicks[j].split("/")[1].split(";")[0] < sleepPicks[j-1].split("/")[1].split(";")[0]  ) )
	   )) {
*/
        while (j > 0) {
            var speed1 = parseInt(sleepPicks[j].split("~")[1].split(";")[0],10);
            var speed2 = parseInt(sleepPicks[j-1].split("~")[1].split(";")[0],10);
            var key1 = parseInt(sleepPicks[j].split("/"),10);
            var key2 = parseInt(sleepPicks[j-1].split("/"),10);
            if ((key1 < key2) || (key1==key2 && speed1 < speed2)) {
                swapIt = sleepPicks[j];      
                sleepPicks[j] = sleepPicks[j-1];
                sleepPicks[j-1] = swapIt;
            }
            j--;
        }
    } 	

    // cull duplicates
    var newList = new Array();
    var prevKey = 0;
    var prevSpeed = 0;
    for (var i = 0; i < sleepPicks.length; i++) {
        var speed1 = parseInt(sleepPicks[i].split("~")[1].split(";")[0],10);
        var key1 = parseInt(sleepPicks[i].split("/"),10);
        if (speed1 == prevSpeed && key1 == prevKey) {
            //myLog("SKIP");
        } else {
            newList[newList.length] = sleepPicks[i];
            prevKey = key1;
            prevSpeed = speed1;
        }
    }

    // get best
    var bestList = new Array();
    var prevKey = 0;
    for (var i = 0; i < newList.length; i++) {
        var key1 = parseInt(newList[i].split("/"),10);
        if (key1 == prevKey) {
            //myLog("SKIP");
            //bestList[bestList.length] = newList[i] + "*";
        } else {
            bestList[bestList.length] = newList[i];
            prevKey = key1;
        }
    }

    return bestList;
}
function addTwoTimes(t1, t2, bDoubleT1) {
    if (t1 == "-")
        return ("-");
    //myLog("INPUT: t1 " + t1 + " t2 " + t2);
    //t2 = "22:02:02";

    var t1Hours = parseInt(t1.split(':')[0],10);
    var t1Minutes = parseInt(t1.split(':')[1],10);
    var t1Seconds = parseInt(t1.split(':')[2],10);
    var t2Hours = parseInt(t2.split(':')[0],10);
    var t2Minutes = parseInt(t2.split(':')[1],10);
    var t2Seconds = parseInt(t2.split(':')[2],10);
    result = ((t1Hours + t2Hours) * 3600) + ((t1Minutes + t2Minutes) * 60) + (t1Seconds + t2Seconds);
    if (bDoubleT1)
        result = result + ( t1Hours * 3600 ) + ( t1Minutes * 60 ) + t1Seconds;
    //myLog("RESULT: " + result);
    var h = Math.floor(result / 3600);
    if (h>23) {
        h=h-24;
        result = result - (24 * 3600);
    }
    var m = Math.floor( (result - (h * 3600)) / 60);
    var s = Math.floor( (result - (h * 3600) - (m * 60)));
    //myLog("RESULTTIME: " + h + ":" + m + ":" + s);
    if (m<10)
        m="0" + m;
    if (s<10)
        s="0" + s;
    return(h + ":" + m + ":" + s);

    return result;
}








// CRIB THEIR FUNCTIONS
// from their function update_distance()
function my_calc_distance(p, ss, g, tar_p, tar_ss, tar_g) {
    var distance = 0
    /*
  var p = get_inner_html('current_planet_position');
  var ss = get_inner_html('current_planet_solar_system');
  var g = get_inner_html('current_planet_galaxy');

  var tar_p = get_value('planet');
  var tar_ss = get_value('solar_system');
  var tar_g = get_value('galaxy');
*/

    if(p == tar_p && ss == tar_ss && g == tar_g) {
        distance = 5
    }
    else if(ss == tar_ss && g == tar_g) {
        distance = 1000 + Math.abs(p - tar_p) * 5
    }
    else if(g == tar_g) {
        distance = 2700 + Math.abs(ss - tar_ss) * 95
    }
    else {
        distance = Math.abs(g - tar_g) * 20000
    }

    //  $('task_distance').innerHTML = distance;
    //myLog("Distance from [" + g + ":" + ss + ":" + p + "] to [" + tar_g + ":" + tar_ss + ":" + tar_p + "] is " + distance); 
    return distance;
}

/**
 * Coded in 2010 and with sparse comments
 */
function generateSleepPicks() {

    //2015 analysis begins with seeing the date came in as a closure... was it UTC or local?
    var myDate = new Date();
    //var myHours = myDate.getUTCHours();
    //var myMinutes = myDate.getUTCMinutes();
    //var mySeconds = myDate.getUTCSeconds();   
    var myHours = myDate.getHours();
    var myMinutes = myDate.getMinutes();
    var mySeconds = myDate.getSeconds();

    var dionysusSpeed = 3600;

    // Determine all (good?) travel distances
    var sleepPicks = new Array();
    // the times to other systems?
    for (var speed=1;speed<11;speed++) {
        for (var dist=1;dist<20;dist++) {
            distCalc = my_calc_distance(1,1,1, 1, dist+1, 1);
            var duration = Math.ceil((35000.0/speed) * Math.sqrt((distCalc * 10) / dionysusSpeed) + 10); // seconds to target

            // 2x speed universe... so don't double it????????
            //duration = duration * 2;


            if (duration < 84600)
                sleepPicks[sleepPicks.length] = duration + "/" + speed + ";" + dist;
        }
    }

    // the times to other planets in local system?
    for (var speed=1;speed<11;speed++) {
        for (var dist=0;dist<8;dist++) {
            distCalc = my_calc_distance(1,1,1, 1+dist, 1, 1);
            var duration = Math.ceil((35000.0/speed) * Math.sqrt((distCalc * 10) / dionysusSpeed) + 10); // seconds to target
            duration = duration * 2;
            if (duration < 84600)
                sleepPicks[sleepPicks.length] = duration + "/" + speed + ";-" + dist;
        }
    }


    for (var i = 0; i < sleepPicks.length; i++) {
        var duration = parseInt(sleepPicks[i].split("/"),10);

        var h = Math.floor(duration / 3600);
        var minute_duration = duration - h*3600;

        var m = Math.floor(minute_duration / 60);
        if (m<10)
            m = "0" + m;
        var second_duration = minute_duration - m*60;
        if (second_duration<10)
            second_duration = "0" + second_duration;

        sleepPicks[i] = sleepPicks[i] + "(" + h + ":" + m + ":" + second_duration + ")";
    }


    // We've got all the possibilities, now round and make them into times
    var myHours = myDate.getHours();
    var myMinutes = myDate.getMinutes();
    var mySeconds = myDate.getSeconds();

    nowMinutes = parseInt(myMinutes/5,10) * 5;

    var roundIt=5;
    var roundSecs = (24*60)/roundIt;

    for (i=0;i<sleepPicks.length;i++) {
        //myLog("pick it: " + sleepPicks[i]);
        var durationRaw = parseInt(sleepPicks[i].split("/"),10);

        dur1 = durationRaw/84600*roundSecs;
        dur2 = Math.round(dur1);
        dur3 = dur2/roundSecs;
        duration = dur3 * (24*60*60);

        var h = Math.floor(duration / 3600);
        var minute_duration = duration - h*3600;

        var m = Math.floor(minute_duration / 60);
        if (m<10)
            m = "0" + m;
        var second_duration = minute_duration - m*60;
        if (second_duration<10)
            second_duration = "0" + second_duration;

        var timeDuration = h + ":" + m + ":" + second_duration;

        //myLog("ADDING: " + timeDuration + " to " + myDate.getHours() + ":" + nowMinutes + ":" + myDate.getSeconds());
        var result1 = addTwoTimes(timeDuration, myDate.getHours() + ":" + nowMinutes + ":" + myDate.getSeconds(), false);

        // Now we have the time we need, but make it back into seconds
        var result2 = parseInt(result1.split(":")[0],10) * 3600 + parseInt(result1.split(":")[1],10) * 60 + parseInt(result1.split(":")[2],10);
        var pickAsTime = result2 + "/" + durationRaw + "~" + sleepPicks[i].split("/")[1];
        //myLog("ASTIME in=" + sleepPicks[i] + " out=" + pickAsTime);
        sleepPicks[i] = pickAsTime;
    }

    sleepPicks = sortSleepPicksByReturnAndPercentage(sleepPicks);
    for (var i = 0; i < sleepPicks.length; i++) {
        //myLog("SORTEDPICK: " + sleepPicks[i]);
    }
    sleepPicks = sortSleepPicksByTravelTime(sleepPicks);

    // Now make the seconds into hh:mm and we're good
    for (var i = 0; i < sleepPicks.length; i++) {
        var duration = parseInt(sleepPicks[i].split("/"),10);

        var h = Math.floor(duration / 3600);
        var minute_duration = duration - h*3600;
        var m = Math.floor(minute_duration / 60);
        if (m<10)
            m = "0" + m;
        var second_duration = minute_duration - m*60;
        if (second_duration<10)
            second_duration = "0" + second_duration;
        var timeDuration = h + ":" + m + ":" + second_duration;

        // FORMAT appears to be [Fleet Return Time]/[Raw Duration Debug]~[Speed];[Distance]([Travel Time])
        //  if distance is negative it means the number of planets away in current system, else number of systems to travel 
        sleepPicks[i] = timeDuration + "/" + sleepPicks[i].split("/")[1];
    }
    return sleepPicks;
}


function getOptionsHTML() {
    var sleepPicks = new Array();
    sleepPicks = generateSleepPicks();

    /*    
    var activePlayerAlert = myGMgetValue('AlertActive', false);
    var longInactiveAlert = myGMgetValue('AlertLongInactive', false);
    var minimumRankToAlert = myGMgetValue('AlertMinRank', 999999);
    var alertEveryInactiveDiplomat = myGMgetValue('AlertIND', false);
    var alertInHeader = myGMgetValue('AlertHeader', true);
    var reProbeCount = myGMgetValue('ReProbeCount', 1);
    var theirCount = document.getElementById("current_user_default_espionage_amount").value;
    if (theirCount == "")
        theirCount=1;
    //myLog("Our count = " + reProbeCount + " theirs=" + theirCount);
    reProbeCount=theirCount;
    myGMsetValue('ReProbeCount', reProbeCount);
    var optSleepDist = myGMgetValue('SleepDist', 1);
    var optSleepSpeed = myGMgetValue('SleepSpeed', 1);
    var optSideHeader = GM_getValue('SideHeader', 0);
    var loudKlaxonURL = GM_getValue('LoudKlaxonURL', 'http://www.bitblaster.com/downloadMyCoolioScripts/supportLib/384280_SOUNDDOGS__to.mp3');
    var quietKlaxonURL = GM_getValue('QuietKlaxonURL', 'http://www.bitblaster.com/downloadMyCoolioScripts/supportLib/15788__beatbed__long_gone_siren.mp3');

    //if (quietKlaxonURL.length == 0)
    //   quietKlaxonURL = 'http://www.bitblaster.com/downloadMyCoolioScripts/supportLib/phone-calling-1.mp3';

    var loudKlaxonLoop = GM_getValue('LoudKlaxonLoop', false);
    var quietKlaxonLoop = GM_getValue('QuietKlaxonLoop', false);

    activePlayerAlert = (activePlayerAlert?'Yes':'No');
    longInactiveAlert = (longInactiveAlert?'Yes':'No');
    alertEveryInactiveDiplomat = (alertEveryInactiveDiplomat?'Yes':'No');
    alertInHeader = (alertInHeader?'Yes':'No');

    var alertRankSetting = 'Minimum ranking for alert: <a href="#" id="setAlertMinRank">{' + minimumRankToAlert + '}</a>';
    var alertActivitySetting = 'Alert on active players: <a href="#" id="setAlertActivity">{' + activePlayerAlert + '}</a>';
    var alertLongInactiveSetting = 'Alert on long-inactive players (I and i): <a href="#" id="setAlertLongInactive">{' + longInactiveAlert + '}</a>';
    var alertIndSetting  = 'Alert for every inactive diplomat regardless of rank: <a href="#" id="setAlertIND">{' + alertEveryInactiveDiplomat + '}</a>';
    var alertHeaderSetting  = 'Display alert message at top of page: <a href="#" id="setAlertHeader">{' + alertInHeader + '}</a>';
    var reProbeSetting  = 'How many probes to send on repeat espionage: ' + reProbeCount + '<br>(UPDATED: we use the game\'s count now, enable default and set value below)';

    var klaxonURLSetting_loud = 'Loud Klaxon URL: <input id="loudURL" size=65 value="' + loudKlaxonURL + '">&nbsp;<input id="loudBtn" type="submit" value="Set">';
    var klaxonLoop_loud = '&nbsp;Loop: ';
    klaxonLoop_loud += '<input id="loop_loud_checkbox" type="checkbox"';
    if (loudKlaxonLoop)
        klaxonLoop_loud += ' checked ';
    klaxonLoop_loud += ' />';
    var klaxonURLSetting_quiet = 'Quiet Klaxon URL: <input id="quietURL" size=65 value="' + quietKlaxonURL + '">&nbsp;<input id="quietBtn" type="submit" value="Set">';
    var klaxonLoop_quiet = '&nbsp;Loop: ';
    klaxonLoop_quiet += '<input id="loop_quiet_checkbox" type="checkbox"';
    if (quietKlaxonLoop)
        klaxonLoop_quiet += ' checked ';
    klaxonLoop_quiet += ' />';
    var klaxonSimulatedAttack = 'Test Klaxon Settings: <input id="simulateAttack" type="submit" value="Launch Attack Simulation">';

    var set_SideHeader  = 'Enable Side Header: ';
    set_SideHeader += '<input class="SetSideHeader_checkbox" id="set_SideHeader_checkbox" type="checkbox"';
    if (optSideHeader == 1)
        set_SideHeader += ' checked ';
    set_SideHeader += ' />';
*/

    var optSleepDist = myGMgetValue('SleepDist', 1);
    var optSleepSpeed = myGMgetValue('SleepSpeed', 1);
    var set_SleepDist  = 'How far to travel for fleet/res save auto-setup option: <a href="#" id="setSleepDist">{' + optSleepDist + '}</a>';
    var set_SleepSpeed  = 'How fast to travel for fleet/res save auto-setup option:';
    set_SleepSpeed += '&nbsp;<select id="setSleepSpeed" name="speed">';

    var hackOpt=0;
    for (var k=10;k>0;k--) {
        set_SleepSpeed += '<option ';
        if (hackOpt == optSleepSpeed)
            set_SleepSpeed += ' selected ';
        set_SleepSpeed += 'value="' + hackOpt + '">' + k + '0%</option>';
        hackOpt++;
    }
    set_SleepSpeed += '</select>';



    var prefsBox = document.createElement('div');
    var myHTML  = '<div class="myPrefs">';

    /*    
    myHTML +=   '<p>' + alertRankSetting + '</p>';
    myHTML +=   '<p>' + alertActivitySetting + '</p>';
    myHTML +=   '<p>' + alertLongInactiveSetting + '</p>';
    myHTML +=   '<p>' + alertIndSetting + '</p>';
    myHTML +=   '<p>' + alertHeaderSetting + '</p>';
    myHTML +=   '<span id="reProbeSetting"><p>' + reProbeSetting + '</p></span>';
    */

    myHTML +=   '<span id="setSleepDist"><p>' + set_SleepDist + '</p></span>';
    myHTML +=   '<span><p>' + set_SleepSpeed + '</p></span>';
    myHTML +=   '<span><p>Pick-A-Time for fleet/res save auto-setup option:&nbsp;';
    myHTML += '<select id="setPickTime" name="pickTime">';

    //var myHours = myDate.getHours();
    //var myMinutes = myDate.getMinutes();
    //var mySeconds = myDate.getSeconds();
    //myLog("LOCAL TIME:" + myHours + ":" + myMinutes + ":" + mySeconds);

    //var roundIt=5;
    //var roundSecs = (24*60)/roundIt;
    //myLog("ROUND SECS=" + roundSecs);

    for (i=0;i<sleepPicks.length;i++) {

        //2015: looks like this was all obsolete...
        //
        //var durationRaw = String(sleepPicks[i].split("/"));
        //myLog("SIGH: " +durationRaw);
        //var nowMinutes = myDate.getMinutes();
        //nowMinutes = parseInt(nowMinutes/5,10) * 5;
        //myLog("MINUTES duration: " + m + " now down: " + nowMinutes);
        //var result1 = addTwoTimes(timeDuration, myDate.getHours() + ":" + nowMinutes + ":" + myDate.getSeconds(), false);
        //
        //var displayPickPercent = sleepPicks[i].split("/")[1].split(";")[0] + "0%"; 
        //myHTML +=   '<option value="' + sleepPicks[i] + '">' + durationRaw.split(":")[0] + ":" + durationRaw.split(":")[1] + " - " + displayPickPercent + '</option>';

        myHTML +=   '<option value="' + sleepPicks[i] + '">' + sleepPicks[i] + '</option>';

    }
    myHTML += '</select>';
    myHTML +=   '</p></span>';

    /*
    myHTML +=   '<span id="setSideHeader"><p>' + set_SideHeader + '</p></span>';
    myHTML +=   '<span><p>' + klaxonURLSetting_loud;
    myHTML +=   klaxonLoop_loud + '</p></span>'; 
    myHTML +=   '<span><p>' + klaxonURLSetting_quiet;
    myHTML +=   klaxonLoop_quiet + '</p></span>'; 
    myHTML +=   '<span><p>' + klaxonSimulatedAttack + '</p></span>';
    */

    myHTML += '</div>';

    prefsBox.innerHTML = myHTML;
    return prefsBox;
}

function doSetPickTime() {
    console.log("SET PICK TIME");
    var setPickTimeOption = document.getElementById("setPickTime");
    var theOption = setPickTimeOption.options[setPickTimeOption.selectedIndex].value;
    var opts = theOption.split("~")[1];
    console.log("  opts=" + opts);
    var speedOpt = opts.split(";")[0];

    // I'm tired and need to sleep, rather the point of this exercise... so here's some shit:
    var sleepSpeed;
    if (speedOpt == 10) sleepSpeed=0;
    if (speedOpt == 9) sleepSpeed=1;
    if (speedOpt == 8) sleepSpeed=2;
    if (speedOpt == 7) sleepSpeed=3;
    if (speedOpt == 6) sleepSpeed=4;
    if (speedOpt == 5) sleepSpeed=5;
    if (speedOpt == 4) sleepSpeed=6;
    if (speedOpt == 3) sleepSpeed=7;
    if (speedOpt == 2) sleepSpeed=8;
    if (speedOpt == 1) sleepSpeed=9;

    var distOpt = opts.split(";")[1].split("(")[0];
    //console.log("PICK TIME: speedOpt=" + speedOpt + " sleepSpeed=" + sleepSpeed + " dist=" + distOpt);
    console.log("Selected speed=" + sleepSpeed + " dist=" + distOpt);
    myGMsetValue('SleepDist', distOpt);
    myGMsetValue("SleepSpeed", sleepSpeed);
}


function doSetSleepDist() {
    var optSleepDist = prompt("Travel how many solar systems when doing auto-setup of fleet/res save?", "");
    myGMsetValue('SleepDist', optSleepDist);
    var fixSleepDist = document.getElementById('setSleepDist');
    var fixedSleepDist = document.createElement('span');
    var set_SleepDist  = 'How far to travel for fleet/res save auto-setup option: <a href="#" id="setSleepDist">{' + optSleepDist + '}</a>';
    var myHTML = "";
    myHTML +=   '<span id="setSleepDist"><p>' + set_SleepDist + '</p></span>';
    fixedSleepDist.innerHTML = myHTML;
    fixSleepDist.parentNode.replaceChild(fixedSleepDist, fixSleepDist);

    var setSleepDist = 
        document.getElementById('setSleepDist');
    setSleepDist.addEventListener('click', function(e) {
        doSetSleepDist();
    },false);
}

function doSetSleepSpeed() {
    console.log("SET SLEEP SPEED");
    var setSleepSpeed = document.getElementById("setSleepSpeed");
    myGMsetValue("SleepSpeed", setSleepSpeed.options[setSleepSpeed.selectedIndex].value);
}

function doSetField(field) {
    console.log('TWO: ', field);
    switch (field) {
        case 'setSleepDist':
            var optSleepDist = prompt("Travel how many solar systems when doing auto-setup of fleet/res save?", "");
            myGMsetValue('SleepDist', optSleepDist);
            var fixSleepDist = document.getElementById('setSleepDist');
            var fixedSleepDist = document.createElement('span');
            var set_SleepDist  = 'How far to travel for fleet/res save auto-setup option: <a href="#" id="setSleepDist">{' + optSleepDist + '}</a>';
            var myHTML = "";
            myHTML +=   '<span id="setSleepDist"><p>' + set_SleepDist + '</p></span>';
            fixedSleepDist.innerHTML = myHTML;
            fixSleepDist.parentNode.replaceChild(fixedSleepDist, fixSleepDist);

            var setSleepDist = 
                document.getElementById('setSleepDist');
            setSleepDist.addEventListener('click', function(e) {
                doSetSleepDist();
            },false);
            break;
        case 'setPickTime':
            console.log('setPickTime');
            console.log("SET PICK TIME");
            var setPickTimeOption = document.getElementById("setPickTime");
            var theOption = setPickTimeOption.options[setPickTimeOption.selectedIndex].value;
            var opts = theOption.split("~")[1];
            console.log("  opts=" + opts);
            var speedOpt = opts.split(";")[0];

            // I'm tired and need to sleep, rather the point of this exercise... so here's some shit:
            var sleepSpeed;
            if (speedOpt == 10) sleepSpeed=0;
            if (speedOpt == 9) sleepSpeed=1;
            if (speedOpt == 8) sleepSpeed=2;
            if (speedOpt == 7) sleepSpeed=3;
            if (speedOpt == 6) sleepSpeed=4;
            if (speedOpt == 5) sleepSpeed=5;
            if (speedOpt == 4) sleepSpeed=6;
            if (speedOpt == 3) sleepSpeed=7;
            if (speedOpt == 2) sleepSpeed=8;
            if (speedOpt == 1) sleepSpeed=9;

            var distOpt = opts.split(";")[1].split("(")[0];
            //console.log("PICK TIME: speedOpt=" + speedOpt + " sleepSpeed=" + sleepSpeed + " dist=" + distOpt);
            console.log("Selected speed=" + sleepSpeed + " dist=" + distOpt);
            myGMsetValue('SleepDist', distOpt);
            myGMsetValue("SleepSpeed", sleepSpeed);
            break;
        case 'setSleepSpeed':
            console.log('setSleepSpeed');
            var setSleepSpeed = document.getElementById("setSleepSpeed");
            myGMsetValue("SleepSpeed", setSleepSpeed.options[setSleepSpeed.selectedIndex].value);
            break;
        default:
            console.log("NO FIELD",field);
    }
}


function addOptionsButtonListeners($) {

    /* ARGH couldn't get the jQuery way to work, and I need to move on for now........                    FIX
    $('#setPickTime').on('change', function() {
        doSetPickTime;
    });
    */
    /*
    document.getElementById('setPickTime').addEventListener(
        'change',
        function() {doSetPickTime();},
        false
    );
    */

    var setSleepDist = document.getElementById('setSleepDist');
    setSleepDist.addEventListener('click', function(e) {
        doSetField('setSleepDist');
    },false);

    document.getElementById('setPickTime').addEventListener(
        'change',
        function() {doSetField('setPickTime');},
        false
    );
    document.getElementById('setSleepSpeed').addEventListener(
        'change',
        function() {doSetField('setSleepSpeed');},
        false
    );

    /*
    var setSleepSpeed = 
        document.getElementById('setSleepSpeed');
    setSleepSpeed.addEventListener('click', function(e) {
        doSetSleepSpeed();
    },false);
    */

    // 2010:
    //document.getElementById('setPickTime').addEventListener('click', function(e) {
    //   doSetPickTime();
    //},false);


    /******************************* other button listeners *********************

	// listen for a click on the link to change prefs
	var setMinRank = document.getElementById('setAlertMinRank');
        setMinRank.addEventListener('click', function(e) {
		doSetMinRank();
 	},false);
	var setMaxActive = document.getElementById('setAlertActivity');
        setMaxActive.addEventListener('click', function(e) {
		doSetMaxActive();
 	},false);
	document.getElementById('setAlertLongInactive').addEventListener('click', function(e) {
	   doSetLongInactive();
 	},false);
	document.getElementById('setAlertIND').addEventListener('click', function(e) {
	   doSetAlertIND();
 	},false);
	var setAlertHeader = document.getElementById('setAlertHeader');
        setAlertHeader.addEventListener('click', function(e) {
		doSetAlertHeader();
 	},false);

    //var setReProbeCount = 
	//document.getElementById('setReProbeCount');
    //                             setReProbeCount.addEventListener('click', function(e) {
	//                       doSetReProbeCount();
 	//},false);

	                     var setSleepDist = 
	document.getElementById('setSleepDist');
                                 setSleepDist.addEventListener('click', function(e) {
	                       doSetSleepDist();
 	},false);
	                     var set_SideHeader_checkbox = 
	document.getElementById('set_SideHeader_checkbox');
                                 set_SideHeader_checkbox.addEventListener('click', function(e) {
	                       doSetSideHeader();
 	},false);


	                     var loudBtn = 
	document.getElementById('loudBtn');
                                 loudBtn.addEventListener('click', function(e) {
	                       doLoudBtn();
 	},false);
	                     var loop_loud_checkbox = 
	document.getElementById('loop_loud_checkbox');
                                 loop_loud_checkbox.addEventListener('click', function(e) {
	                       doLoopLoudCheckbox();
 	},false);
	                     var quietBtn = 
	document.getElementById('quietBtn');
                                 quietBtn.addEventListener('click', function(e) {
	                       doQuietBtn();
 	},false);
	                     var loop_quiet_checkbox = 
	document.getElementById('loop_quiet_checkbox');
                                 loop_quiet_checkbox.addEventListener('click', function(e) {
	                       doLoopQuietCheckbox();
 	},false);

	document.getElementById('simulateAttack').addEventListener('click', function(e) {
	   doAttackSimulation();
 	},false);

    ******************************* /other button listeners *********************/

}



function doOptionsPage($) {
    var myDate = new Date();
    var myHours = myDate.getUTCHours();
    var myMinutes = myDate.getUTCMinutes();
    var mySeconds = myDate.getUTCSeconds();

    var opt = '<h3>Status Report App Options</h3>';
    var myOptionsDiv = document.createElement('div');
    myOptionsDiv.innerHTML=opt;

    var planet_order = document.getElementById('default_esp');              // where was this before?
    planet_order.parentNode.insertBefore(myOptionsDiv, planet_order);

    /** I forget what this was about. I recall developing an interface between
      * userscripts and Java applets... and I don't think there was more happening?
	if (Gagent_state == 1) {
	   doLoadApplet();

	   opt = '<p>';
	   opt += 'Setter: <a id="mySetterButton">call applet to set</a>';
	   opt += '</p>';

	   myOptionsDiv = document.createElement('div');
	   myOptionsDiv.innerHTML=opt;

	   var planet_order = document.getElementById('planet_order');
	   planet_order.parentNode.insertBefore(myOptionsDiv, planet_order);

	   var setterButton = document.getElementById('mySetterButton');
	       setterButton.addEventListener('click', function(e) {
	         		doMySetterButton();
 	       },false);
	}
    **/

    var prefsBox = getOptionsHTML();
    var planet_order = document.getElementById('default_esp');           // where was this before?
    planet_order.parentNode.insertBefore(prefsBox, planet_order);

    addOptionsButtonListeners($);
}

function doAutoAbort($) {
    setTimeout(function (){

        // Something you want delayed.
        myGMsetValue('auto_Sleepsave','false');
        emitNotification($,"Aborted");


    }, 5); // How long do you want the delay to be (in milliseconds)?                     // TODO: No delay, we just want this code somewhere...
}




function toolbarAutoSleep($,offerSleepSetup) {
    if (offerSleepSetup) {
        var theHTML = 'Auto: <a href="#" id="setupSleepButton">[Setup]</a>';
        emitNotification($,theHTML);
        document.getElementById('setupSleepButton').addEventListener('click', function(e) {
            doSetupAuto($);
        },false); 
    } else {
        var m = myGMgetValue('auto_Sleepsave','false');
        var autosleepActive=(m ==='true');
        if (autosleepActive) {
            var theHTML = 'Auto: <span id="toolbarAuto_functions_abort"><a href="#" id="abortAuto">[Abort]</a></span> <a href="#" id="setupSleepButtonNEXT">[NEXT PLANET]</a>';
            emitNotification($,theHTML);
            document.getElementById('abortAuto').addEventListener('click', function(e) {
                doAutoAbort($);
            },false); 
            document.getElementById('setupSleepButtonNEXT').addEventListener('click', function(e) {
                sleepNextPlanet($);
            },false);             
            console.log('good');
        }
    }
}


/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 *             M A I N L I N E
 *
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
jQuery( document ).ready(function( $ ) {
    // <enabled>
    var m = myGMgetValue('enabled_Sleepsave','true');
    var moduleEnabled=(m ==='true');    
    var doToggle = getCookie('set_moduleEnabled_Sleepsave');
    if (doToggle === 'toggle') {
        document.cookie = "set_moduleEnabled_Sleepsave=; expires=Sun, 04 Jul 1976 00:00:00 UTC";
        if (moduleEnabled) {
            myGMsetValue('enabled_Sleepsave','false');
            moduleEnabled=false;
        } else {
            myGMsetValue('enabled_Sleepsave','true');
            moduleEnabled=true;
        }
    }    
    var displayEnabled='DISABLED';
    if (moduleEnabled)
        displayEnabled='enabled';
    var myVersion = GM_info.script.version; 
    console.log ('Sleepsave ver', myVersion, displayEnabled);
    // </enabled>

    // Need a way to abort automatic sleep state
    toolbarAutoSleep($);


    var menu = myGMgetValue('sfcaMenu_register','');                                                            // WTF is this?!
    var pos = menu.search(/Fleet dispatched to harvest/);
    if (pos > -1) {
        console.log('Sleepsave: Menu registered');
    }



    //// OLD ///
    // Calculate drift... their clock might not match ours, probably won't... and add a friend into the mix and we really need this!
    var myDate = new Date();
    var myHours = myDate.getUTCHours();
    var myMinutes = myDate.getUTCMinutes();
    var mySeconds = myDate.getUTCSeconds();
    /**
	var theirTime=$x("/html/body/div[2]/div/div/div[3]/div[2]/table/tbody/tr/td[2]", XPathResult.FIRST_ORDERED_NODE_TYPE);
	theirTime = theirTime.innerHTML;
	var myTime = myHours + ":" + myMinutes + ":" + mySeconds;
	//myLog("My time:    " + myTime);
	var theirHours = parseInt(theirTime.split(':')[0],10);
	var theirMinutes = parseInt(theirTime.split(':')[1],10);
	var theirSeconds = parseInt(theirTime.split(':')[2],10);
	var theirTime = theirHours + ":" + theirMinutes + ":" + theirSeconds;
	//myLog("Their time: " + theirTime);
	GclockDrift = ((myHours - theirHours) * 3600) + ((myMinutes - theirMinutes) * 60) + (mySeconds - theirSeconds);
	//myLog("Clock drift: " + GclockDrift);
**/


    // Watch for the ships overview
    waitForKeyElements ($,"th.ships.alt", displayingShips);

    // Toggle to show/hide any fleets in flight...
    var toggleFleetDisplay=myGMgetValue('fleetDisplay','block');    
    var setToggleFleets = getCookie('set_toggleFleets');
    if (setToggleFleets.length) {
        myGMsetValue('fleetDisplay',setToggleFleets);
        document.cookie = "set_toggleFleets=; expires=Sun, 04 Jul 1976 00:00:00 UTC";
        toggleFleetDisplay=setToggleFleets;
    }

    // On the fleet screen, display the toggle option ...
    if ($('#content.fleet.index').length) {
        // Wrap the table in a div for easier hide                                                      Do we really need this?
        $("#tasks").wrap( "<div id='fleetWrapper' style='display:"+toggleFleetDisplay+"'></div>" );
        addMyFleetbar($);

        // if we got here from the ships overview, handle the request to sleepsave this fleet
        var doSleep = getCookie('set_sleep_cookie');
        if (doSleep.length) {
            //if (myGMgetValue('sleep_this_planet','false') === 'true') {
            console.log("SLEEP...");
            document.cookie = "set_sleep_cookie=; expires=Sun, 04 Jul 1976 00:00:00 UTC";
            myGMsetValue('sleep_this_planet','false');
            // not manual, we're full auto baby!
            initSleepsave($,false);
        } else {
            // add a button to the fleet screen to offer the feature
            initSleepsave($,true);
        }

        var error = $('.error').first();
        if (error.length) {
            console.log("ERROR!");
            if (myGMgetValue('auto_Sleepsave','false') ==='true') {
               myGMsetValue('auto_Sleepsave','false');
               emitNotification($,"Aborted on error");
            }
        }
        
        var sleepAck = $('.notice').first();
        if (sleepAck.length) {
            var notice = sleepAck.html();
            var pos = notice.search(/Fleet dispatched to harvest/);
            if (pos > -1) {
                console.log("Harvest ack!");

                // We saw a notice that a fleet was sent to harvest, if from auto go to overview
                var didSleep = getCookie('set_didSleep');
                if (didSleep.length) {
                    console.log("SLEPT...");
                    document.cookie = "set_didSleep=; expires=Sun, 04 Jul 1976 00:00:00 UTC";
                    // use the AllPlanets userscript to get back to the ships screen...
                    document.cookie="allItemsTab=ships;path=/";
                    window.location.href = "/overview?current_planet=34287";                
                }
            }
            else {
                console.log("NOTICE: ",notice);
                var didSleep = getCookie('set_didSleep');
                if (didSleep.length) {
                    console.log("There may have been trouble?!");
                }
            }
        }
    }



    // Display BOJ message with version on Profile screen
    if ( $('#content.options.index').length ) {
        insertProfileHeader($,moduleEnabled);
        doOptionsPage($);
    }
});

//console.log("BOJ Sleepsave");
addMyCSS();
myAttachIt(toggleModuleEnabled_Sleepsave);
myAttachIt(do_setupSleep);
myAttachIt(do_sleepsave);
myAttachIt(my_calc_distance);
myAttachIt(addTwoTimes);

