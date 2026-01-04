// ==UserScript==
// @name         Auto Familiar Bonding
// @version      1.6
// @description  Automatically bonds with your familiars. Has a GUI and some options for handling bonds.
// @author       Triggernometry
// @namespace    https://greasyfork.org/en/users/999683
// @match        https://www1.flightrising.com/dragon/*
// @match        https://www1.flightrising.com/lair/*
// @match        https://www1.flightrising.com/dragon-familiar/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/462613/Auto%20Familiar%20Bonding.user.js
// @updateURL https://update.greasyfork.org/scripts/462613/Auto%20Familiar%20Bonding.meta.js
// ==/UserScript==

// these are used across all/most functions
var toggleState = GM_getValue('toggleState', false);
var toggleDisplay = ["OFF (click to toggle)",
                     "ON (click to toggle)"];

var skipBondKey = GM_getValue('skipBondKey', 0);

var noFamKey = GM_getValue('noFamKey', 0);

var awakenedBondKey = GM_getValue('awakenedBondKey', false);

// finds the Bond window and closes it, then clicks "next"
function closeBond(nextDrag){
    // find close button, which has all of the following classes
    var xToClose = $(".ui-button.ui-corner-all.ui-widget.ui-button-icon-only.ui-dialog-titlebar-close");
    // if element is not NULL/undefined
    if (xToClose.length) {
        // close bond window
        xToClose.click();

        if(getSwappable()) {
            swapFamiliar();
        }
        else {
            // go to Next Dragon link. no need to wait, since X doesn't re-load page like the Close button does
            window.open(nextDrag,"_self");
        }
    }
    else {
        //console.log("Not found!");
    }
}

function getFamiliarState() {
    // if familiar frame exists
    if ($('#dragon-profile-familiar-frame').length) {
        // if no familiar or not bonded, text() will just be innerText
        // accessibility message
        var famMsg = $('.dragon-profile-familiar-bond-level > div').text();
        // combined accessibility + text
        var famState = $('.dragon-profile-familiar-bond-level')[0].innerText

        // remove accessibility string from beginning of state string
        famState = famState.slice(famMsg.length).trim();

        // if empty string, change to "Unbonded" to not trigger false negative on falsy values
        return famState == "" ? "Unbonded" : famState;
    }
    // if no familiar, null
    return null;
}

function getFamiliarName() {
    return $('#dragon-profile-familiar-name > span')[0].innerText.trim();
}

// criteria for if this familiar should be swapped
function getSwappable() {
    // Awakened swapping on, familiar Awakened, and familiar NOT custom named
    return (awakenedBondKey && getFamiliarState() == "Awakened" && getFamiliarName() == 'Familiar');
}

function swapFamiliar() {
    // if dragon has no familiar... add a familiar
    $('.dragon-profile-familiar.common-column > .common-ui-button-group > a.common-ui-button')[0].click();
}

function buildGUI() {
    // set up GUI box
    $('body').prepend("<div id=\"familiarbox\">" +
                      "    <div style=\"text-align: center; color: #e8cc9f; font: bold 7.8pt/30px tahoma; background: #731d08; margin: -10px -10px 10px;\">Auto Familiar Bonding</div>" +
                      // set toggle display to whatever it was before new page was loaded (or off, if page has never beeen loaded this session)
                      "    <button id=\"onOffDisplay\">" + toggleDisplay[toggleState ? 1 : 0] + "</button>" +
                      "</div>" +
                      "<style>" +
                      "    #familiarbox label {" +
                      "        float: inherit;" +
                      "    }" +
                      "    #familiarbox {" +
                      "        padding: 10px;" +
                      "        border: 1px solid #000;" +
                      "        position: fixed;" +
                      "        top: 0;" +
                      "        left: 0;" +
                      "        background: #fff;" +
                      "        z-index: 1002;" +
                      "    }" +
                      "    #turnOff," +
                      "    #turnOn {" +
                      "        border: 0;" +
                      "        background-color: #dcd6c8;" +
                      "        padding: 5px 10px;" +
                      "        color: #731d08;" +
                      "        margin: auto;" +
                      "        box-shadow: 0 1px 3px #999;" +
                      "        border-radius: 5px;" +
                      "        text-shadow: 0 1px 1px #FFF;" +
                      "        border-bottom: 1px solid #222;" +
                      "        cursor: pointer;" +
                      "        display: block;" +
                      "        font: bold 11px arial;" +
                      "        transition: 0.1s;" +
                      "    }" +
                      "    #onOffDisplay {" +
                      "        border: 0;" +
                      "        background-color: #dcd6c8;" +
                      "        padding: 5px 10px;" +
                      "        color: #731d08;" +
                      "        margin: auto;" +
                      "        box-shadow: 0 1px 3px #999;" +
                      "        border-radius: 5px;" +
                      "        text-shadow: 0 1px 1px #FFF;" +
                      "        border-bottom: 1px solid #222;" +
                      "        cursor: pointer;" +
                      "        display: block;" +
                      "        font: bold 11px arial;" +
                      "        transition: 0.1s;" +
                      "    }" +
                      "    #turnOff:hover," +
                      "    #turnOn:hover {" +
                      "        background-color: #bfb9ac;" +
                      "        color: #731d08;" +
                      "    }" +
                      "</style>"
                     );
    // add 'Already Bonded' options
    _buildBondedGUI();

    // add 'No Familiar' options
    _buildFamiliarGUI();

    // add 'Familiar Awakened' options
    _buildAwakenedGUI();

    // set the toggle click behavior
    $('#onOffDisplay').click(function(){
        toggleState = !toggleState;
        GM_setValue('toggleState', toggleState);

        if(toggleState) {
            $('#onOffDisplay').html(toggleDisplay[1]);
        }
        else {
            $('#onOffDisplay').html(toggleDisplay[0]);
        }
    });
}

function _buildBondedGUI() {
    $('#familiarbox').append("<br>If already bonded..." +
                             "<br>" +
                             "<form id=\"alreadybondedform\">" +
                             "	<input type=\"radio\"" +
                             "		   id=\"skipbond\"" +
                             "		   name=\"alreadybonded\">" +
                             "	<label class=\"skipbond\">Skip to next Dragon</label>" +
                             "	<br>" +
                             "	<input type=\"radio\"" +
                             "		   id=\"stopbond\"" +
                             "		   name=\"alreadybonded\">" +
                             "	<label class=\"stopbond\">Stop</label>" +
                             "</form>"
                            );


    // set behavior for 'Already Bonded' radio buttons
    $("#alreadybondedform").change(function() {
        // set status locally
        skipBondKey = $('#skipbond').is(':checked');

        // save status to remote
        GM_setValue('skipBondKey', skipBondKey);
    });

    // set inital status of radio button(s)
    $( "#skipbond" ).prop( "checked", skipBondKey );
    // this will need to be changed if more options are added in the future
    $( "#stopbond" ).prop( "checked", !skipBondKey );
}

function _buildFamiliarGUI() {
    $('#familiarbox').append("<br>If No Familiar..." +
                             "<br>" +
                             "<form id=\"nofamform\">" +
                             "    <input type=\"radio\"" +
                             "           id=\"addfam\"" +
                             "           name=\"nofam\">" +
                             "    <label class=\"addfam\">Add Familiar</label>" +
                             "    <br>" +
                             "    <input type=\"radio\"" +
                             "           id=\"skipfam\"" +
                             "           name=\"nofam\">" +
                             "    <label class=\"skipfam\">Skip to next Dragon</label>" +
                             "    <br>" +
                             "    <input type=\"radio\"" +
                             "           id=\"stopfam\"" +
                             "           name=\"nofam\">" +
                             "    <label class=\"stopfam\">Stop</label>" +
                             "</form>"
                            );

    // set behavior for 'No Familiar' radio buttons
    if (noFamKey == 'addfam') {
        $( "#addfam" ).prop( "checked", true );
    }
    else if (noFamKey == 'skipfam') {
        $( "#skipfam" ).prop( "checked", true );
    }
    else if (noFamKey == 'stopfam') {
        $( "#stopfam" ).prop( "checked", true );
    }
    // by default
    else {
        $( "#stopfam" ).prop( "checked", true );
    }


    $("#nofamform").change(function() {
        if($('#addfam').is(':checked')) {
            GM_setValue('noFamKey','addfam');
        }
        else if($('#skipfam').is(':checked')) {
            GM_setValue('noFamKey','skipfam');
        }
        else if($('#stopfam').is(':checked')) {
            GM_setValue('noFamKey','stopfam');
        }
    });
}

function _buildAwakenedGUI() {
    $('#familiarbox').append("<br>If familiar is awakened..." +
                             "<br>" +
                             "<form id=\"alreadybondedform\">" +
                             "	<input type=\"checkbox\"" +
                             "		   id=\"awakenedbond\"" +
                             "		   name=\"awakenedbond\">" +
                             "	<label class=\"awakenedbond\">Swap familiars after bonding</label>" +
                             "</form>"
                            );

    // set behavior for checkbox
    $("#awakenedbond").change(function() {
        awakenedBondKey = $('#awakenedbond').is(':checked');
        GM_setValue('awakenedBondKey', awakenedBondKey);
    });

    // set initial state of checkbox
    $("#awakenedbond").prop( "checked", awakenedBondKey);
}

function main() {
    buildGUI();
    // on, and on a dragon profile page, and NOT on a hibDen dragon
    if (toggleState == true && window.location.href.includes("/dragon/") && Object.values($(".breadcrumbs > a")).every( (link) => link.text != "Hibernal Den" ) ) {
        // find the next dragon's link
        const nextDrag = $('#dragon-profile-dragon-next').attr("href");
        // seach link for HibDen
        const isBelowThreshold = (link) => link.text != "Hibernal Den";

        // if not empty string, if dragon has a familiar
        if( getFamiliarState() ) {
            // if already bonded
            if( $('img[src="/static/layout/profile/button-bond-disabled.png"]').length ) {

                if (getSwappable()) {
                    swapFamiliar();
                }
                else if (skipBondKey) {
                    window.open(nextDrag,"_self");
                }
            } else {
                // click the 'bond' button with id=
                $("#dragon-profile-button-bond").click();

                setInterval(closeBond, 1000, nextDrag);

            }
        }
        // if dragon has no familiar...
        else {
            if (noFamKey == 'addfam') {
                swapFamiliar();
            } else if (noFamKey == 'skipfam') {
                // if dragon has no familiar... skip to next dragon
                window.open(nextDrag,"_self")
            } else if (noFamKey == 'stopfam') {
                // if dragon has no familiar... stop

                new Notification("Auto Familiar Bonding stopped because dragon has no familiar.");
            }
        }
    }
}

// wait until page load, then run main
$(document).ready(main);