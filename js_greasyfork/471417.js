// ==UserScript==
// @name         Flight Rising Archeology (Tweaked)
// @version      0.8.0
// @description  Automatically digs for you! Does Precise or Rugged work. Various completion/repeat options available. Based on the original by Triggernometry
// @author       DMR
// @match        https://www1.flightrising.com/trading/archaeology/dig-site/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @namespace    https://github.com/dmr-coding
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/471417/Flight%20Rising%20Archeology%20%28Tweaked%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471417/Flight%20Rising%20Archeology%20%28Tweaked%29.meta.js
// ==/UserScript==

// default values are the key name, will be overwritten by user-specific unfo later
var user_vars = {'toggleState': 'toggleState',
                 'workTypeKey': 'workTypeKey',
                 'ruggedWorkTypeKey': 'ruggedWorkTypeKey',
                 'preciseWorkTypeKey': 'preciseWorkTypeKey'};

// whole process on or off
var toggleState;
// on/off button display
var toggleDisplay = ["OFF (click to toggle)",
                     "ON (click to toggle)"];
// rugged or precise options
var workTypeStatus;
// rugged-specific options
var ruggedWorkTypeStatus;
// precise-specific options
var preciseWorkTypeStatus;

function setGlobals() {
    // get last item of page URL, which is the digsite ID
    var digsite = window.location.href.split("/").pop();
    // get last item of the user's clan URL, which is the user ID
    var user = $('#namespan > a')[0].attributes['href'].value.split("/").pop();

    // set new user
    for (var key in user_vars) {
        user_vars[key] = `${key}_${user}_${digsite}`
    }

    // set global variables by user and digsite
    toggleState = GM_getValue(user_vars.toggleState, false);
    workTypeStatus = GM_getValue(user_vars.workTypeKey);
    ruggedWorkTypeStatus = GM_getValue(user_vars.ruggedWorkTypeKey);
    preciseWorkTypeStatus = GM_getValue(user_vars.preciseWorkTypeKey);
}

function buildGUI() {
    // set up GUI box
    $('body').prepend("<div id=\"toggleBox\">" +
                      "    <div style=\"text-align: center; color: #e8cc9f; font: bold 7.8pt/30px tahoma; background: #731d08; margin: -10px -10px 10px;\">Auto Archeology</div>" +
                      // set toggle display to whatever it was before new page was loaded (or off, if page has never beeen loaded this session)
                      "    <button id=\"onOffDisplay\">OFF (click to toggle)</button>" +
                      "</div>" +
                      "<style>" +
                      "    #toggleBox label {" +
                      "        float: inherit;" +
                      "    }" +
                      "    #toggleBox {" +
                      "        padding: 10px;" +
                      "        border: 1px solid #000;" +
                      "        position: fixed;" +
                      "        top: 0;" +
                      "        left: 0;" +
                      "        background: #fff;" +
                      "        z-index: 1002;" +
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
                      "    #onOffDisplay:hover {" +
                      "        background-color: #bfb9ac;" +
                      "        color: #731d08;" +
                      "    }" +
                      "</style>"
                     );

    // set the toggle click behavior
    $('#onOffDisplay').click(function(){
        toggleState = !toggleState;
        GM_setValue(user_vars.toggleState, toggleState);

        if(toggleState) {
            $('#onOffDisplay').html(toggleDisplay[1]);
        }
        else {
            $('#onOffDisplay').html(toggleDisplay[0]);
        }
    });

    // set selected state of toggle button
    if(toggleState) {
        $('#onOffDisplay').html(toggleDisplay[1]);
    }
    else {
        $('#onOffDisplay').html(toggleDisplay[0]);
    }

    $('#toggleBox').append("<br>What type of work?" +
                           "<br>" +
                           "<form id=\"workTypeForm\">" +
                           "	<input type=\"radio\"" +
                           "		   id=\"ruggedWork\"" +
                           "		   name=\"workType\">" +
                           "	<label class=\"ruggedWork\">Rugged</label>" +
                           "	<br>" +
                           "	<input type=\"radio\"" +
                           "		   id=\"preciseWork\"" +
                           "		   name=\"workType\">" +
                           "	<label class=\"preciseWork\">Precise</label>" +
                           "</form>"
                          );

    // set on changed behavior
    $("#workTypeForm").change(function() {
        if($('#ruggedWork').is(':checked')) {
            workTypeStatus = 0;
            GM_setValue(user_vars.workTypeKey, workTypeStatus);
            $( "#ruggedOptions" ).show();
            $( "#preciseOptions" ).hide();
        }
        else {
            workTypeStatus = 1;
            GM_setValue(user_vars.workTypeKey, workTypeStatus);
            $( "#ruggedOptions" ).hide();
            $( "#preciseOptions" ).show();
        }
    });

    // set selected radio button
    if (workTypeStatus == 0) {
        $( "#ruggedWork" ).prop( "checked", true );
    } else {
        $( "#preciseWork" ).prop( "checked", true );
    }

    $('#toggleBox').append("<div id=\"ruggedOptions\">" +
                           "	<br>Rugged Work Options:" +
                           "	<br>" +
                           "	<form id=\"ruggedWorkForm\">" +
                           // "		<input type=\"radio\"" +
                           // "			   id=\"ruggedLimit\"" +
                           // "			   name=\"ruggedWorkType\">" +
                           // "		<label class=\"ruggedWork\">Until Pickaxes reach: (Currently: 0)</label>" +
                           // "		<br>" +
                           // "		<input type=\"radio\"" +
                           // "			   id=\"ruggedCountDown\"" +
                           // "			   name=\"ruggedWorkType\">" +
                           // "		<label class=\"preciseWork\">Until Pickaxes used: (Currently: 0)</label>" +
                           // "		<br>" +
                           "		<input type=\"radio\"" +
                           "			   id=\"ruggedForever\"" +
                           "			   name=\"ruggedWorkType\">" +
                           "		<label class=\"preciseWork\">Forever</label>" +
                           "	</form>" +
                           "</div>"
                          );

    // set on changed behavior
    $("#ruggedWorkForm").change(function() {
        if($('#ruggedLimit').is(':checked')) {
            GM_setValue(user_vars.ruggedWorkTypeKey, 2);
        }
        // currently unnecessary, but left as-is to provide template
        else if($('#ruggedCountDown').is(':checked')) {
            GM_setValue(user_vars.ruggedWorkTypeKey, 1);
        }
        else {
            GM_setValue(user_vars.ruggedWorkTypeKey, 0);
        }
    });

    // set selected radio button
    // TODO: change this into a dictionary or lookup of some sort
    if (ruggedWorkTypeStatus == 2) {
        $( "#ruggedLimit" ).prop( "checked", true );
    }
    else if (ruggedWorkTypeStatus == 1) {
        $( "#ruggedCountDown" ).prop( "checked", true );
    }
    else {
        $( "#ruggedForever" ).prop( "checked", true );
    }

    // set whether or not the box is visible
    if($('#ruggedWork').is(':checked')) {
        $( "#ruggedOptions" ).show();
    }
    else {
        $( "#ruggedOptions" ).hide();
    }

    // add extended Precise Work options
    $('#toggleBox').append("<div id=\"preciseOptions\">" +
                           "	<br>Precise Options" +
                           "	<br>" +
                           "	<form id=\"preciseWorkTypeForm\">" +
                           buildPreciseGUI() +
                           "	</form>" +
                           "</div>"
                          );

    // set on changed behavior
    $("#preciseWorkTypeForm").change(function(event) {
        preciseWorkTypeStatus = event.target.id;
        GM_setValue(user_vars.preciseWorkTypeKey, preciseWorkTypeStatus);
    });

    // set selected radio button
    // TODO: change this into a dictionary or lookup of some sort
    if (preciseWorkTypeStatus) {
        $(`#${preciseWorkTypeStatus}`).prop( "checked", true )
    }

    // set whether or not the box is visible
    if($('#preciseWork').is(':checked')) {
        $( "#preciseOptions" ).show();
    }
    else {
        $( "#preciseOptions" ).hide();
    }

}

function getPlots() {
    // get all displayed dig plots as an array
    var plots = {};

    // iterate thru all plots
    $(".archaeology-dig-plot-frame > .archaeology-dig-plot").each( function( index, element ){
        // get plot's name, if available
        var plotName = $(this).find(".archaeology-dig-plot-complete > div").attr("data-name");
        // if undefined/null/blank/etc, set to temporary label
        plotName = plotName ? plotName : `Not Completed (${index})`

        // get plot's work button, if available
        var plotButton = $(this).find(".archaeology-dig-plot-action-frame > .archaeology-dig-plot-magnifying-glass.common-ui-button");

        if (!plotButton || !plotButton.length) {
            plotButton = $(this).find(".archaeology-dig-plot-action-frame > .archaeology-dig-plot-claim.common-ui-button");
        }

        // save to key-value pair
        plots[plotName] = plotButton[0].attributes["data-plot-id"].nodeValue;
    });

    return plots;
}

function buildPreciseGUI() {
    // indentation is not necessary for parsing, but will make final product more human-readable
    var templateSeparator = "		<br>";

    var radioBlock = [];
    var plots = getPlots();

    //var re = /[:()]/ig;

    for(const key in plots) {
        //var keyHyphen = key.replaceAll(" ", "-");
        //keyHyphen = keyHyphen.replace(re, "");

        var block = preciseBlockTemplate(key, plots[key]);
        radioBlock.push(block);
    }

    radioBlock = radioBlock.join(templateSeparator);

    return radioBlock;
}

function preciseBlockTemplate(plotName, plotID) {
    var radioTemplate = `		<input type="radio"` +
        `			   id="${plotID}"` +
        `			   name="preciseWorkPlot">` +
        `		<label class="${plotID}">${plotName}</label>`;

    return radioTemplate;
}

async function sleep(ms=1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function pressConfirmation() {
    var confButton = null;

    while (!confButton || confButton.length == 0) {
        await sleep();
        confButton = $('.beigebutton.thingbutton.dialog-submit');
    }

    confButton[0].click();
}

async function main() {
    // set up global variables for user-specific values
    await setGlobals();

    // set up GUI
    await buildGUI();

    // if on
    if (toggleState) {
        // cleanup if needed
        try {
            $('#uncover-all-squares')[0].click();
        }
        catch {
            //pass
            ;
        }
        // claim if needed
        if ($('.archaeology-dig-plot-claim.common-ui-button').length) {
            $('.archaeology-dig-plot-claim.common-ui-button').each(async function(index, element) {
                element.click();
                await pressConfirmation();
            });
        }

        // if ready to work
        if ($('#archaeology-dig-timer-text')[0].innerText == "Ready!") {
            // if precise
            if (workTypeStatus == 1) {
                // start precise select
                $('#archaeology-use-magnifying-glass')[0].click();
                // start plot
                $(`.archaeology-dig-plot-magnifying-glass.common-ui-button[data-plot-id*='${preciseWorkTypeStatus}']`)[0].click();

                await pressConfirmation();
            }
            else if (workTypeStatus == 0) {
                $('#archaeology-use-pickaxe')[0].click();
                await pressConfirmation();
            } else {
              throw new Error("Invalid selection.");
            }
        }
    }
}

// wait until page load, then run main
$(main);
