/////////////////////////////////////////////////////////////////////////////////////////////
//
// Starfleet Commander Advantage - Testbed
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
// * Ill-advised, this is the lair of bad ideas.
//
// KNOWN ISSUES
// - Everything.
//
// GOOD IDEAS PILE
// - Should record some notes on future direction here...
//
// DONE
// - Module started
//
// VERSION HISTORY
//
// 0.17 - Seriously shabby
// 0.15 - Getting serious.
// 0.1  - Created module! Back in the saddle in 2015 with a new intent to
//        become a better Javascript programmer.
//
//
// ==UserScript==
// @name         SFCA Testbed-Test
// @namespace    http://your.homepage/
// @version      0.18
// @description  Hacks and stuff for SFC
// @author       Robert Leachman
// @match        http://*.playstarfleet.com/*
// @match        http://*.playstarfleetextreme.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.min.js
// @grant        none
// @grant GM_setValue
// @grant GM_getValue
// @COULDgrant GM_setClipboard
// @COULDgrant unsafeWindow
//
// @COULDinclude      http://*

//
// @downloadURL https://update.greasyfork.org/scripts/12074/SFCA%20Testbed-Test.user.js
// @updateURL https://update.greasyfork.org/scripts/12074/SFCA%20Testbed-Test.meta.js
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

//                                               W H A T I S T H I S ????
// their's, so nice...
function get_inner_html(id) {
    //myLog("Looking for: " + id);
    /*
  if($(id)) {
    return parseInt($(id).innerHTML,10);
  }
*/
    var field=document.getElementById( id );
    console.log("content=" + field.innerHTML);
    return parseInt(document.getElementById( id ).innerHTML,10); // bugfix "08 09"
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




// still great all these years later...
// http://notetodogself.blogspot.com/2009/08/javascript-insert-table-rows-table-body.html
//    (makes the point that jQuery needs to check a lot of cases we are not concerned about, so use straight JS)
function appendTableRows(node, html){
    var temp = document.createElement("div");
    var tbody = node.parentNode;
    var nextSib = node.nextSibling;
    temp.innerHTML = "<table><tbody>"+html;
    var rows = temp.firstChild.firstChild.childNodes;
    while(rows.length){
        tbody.insertBefore(rows[0], nextSib);
    }
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

// Display a nice status or error message box
function emitStatusMessage(message, bGold) {

    // CSS NEEDS HELP!

    var messageBox = document.createElement("div");
    if (bGold)
        messageBox.setAttribute('class','myStatusBox');
    else
        messageBox.setAttribute('class','myLessFancyStatusBox');
    messageBox.innerHTML=message;
    //var nav=document.getElementById("sticky_notices");
    var nav=document.getElementById("user_planets");
    nav.parentNode.insert(messageBox,nav.nextSibling);
}

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

// Extend the base function to provide separation between the differnet versions...
function myGMsetValue(param, value) {
    var uni=window.location.href.split('.')[0].split('/')[2];
    //console.log('Setting '+uni+'-'+param+'='+value);
    GM_setValue(uni+'-'+param, value);
}

function myGMgetValue(param, def) {
    var uni=window.location.href.split('.')[0].split('/')[2];
    var needDefault = "NoSuchValueStoredHere";
    //console.log('fetching '+uni+'-'+param);
    var val = GM_getValue(uni+'-'+param, needDefault);
    if (val == needDefault)
        return def;
    else
        return val;
}

function addMyCSS() {
    // Status messages...
    myCSS  = ".myStatusBox {";
    myCSS += "color: #FF9219;";
    //myCSS += "background-image:url(/images/starfleet/layout/transparent_grey_bg.png);";
    myCSS += "border:1px solid #006C82;";
    myCSS += "padding:5px;";
    myCSS +=" margin-bottom:3em;";
    myCSS += "vertical-align: top;";
    myCSS +="}";
    myCSS += ".myLessFancyStatusBox {";
    myCSS += "color: white;";
    //myCSS += "background-image:url(/images/starfleet/layout/transparent_grey_bg.png);";
    myCSS += "border:1px solid #006C82;";
    myCSS += "padding:10px;";
    myCSS +=" margin-bottom:1em;";
    myCSS +="}";

    myCSS += '#myStuff {';
    //myCSS += 'background-image: url(/images/starfleet/layout/transparent_grey_bg.png);';
    myCSS += 'border: 1px solid yellow;';
    myCSS += 'margin-left: -10px;';
    myCSS += 'margin-bottom: 5px;';
    myCSS += 'padding: 10px 10px 10px 20px;';
    myCSS += '}';  

    addGlobalStyle(myCSS);
}

// Display BOJ message on Profile screen
function insertProfileHeader($) {
    emitNotification($,'Starfleet Commander Advantage -  Testbed (version ' + GM_info.script.version + '): ACTIVE!');
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

function confirmIfFree($,popup) {
    //console.log(popup.html());
    var isFreeText = /This task will complete in less than five minutes/;

    var isFree = isFreeText.exec(popup.text());
    if (isFree) {
        // I don't like how the form flashes but it's fine for now...
        var stupidConfirm = $('#confirm_popup');
        stupidConfirm.hide();

        var confirm = $(".confirm_button");
        console.log("sel len "+confirm.length);
        var theButton = $('.confirm_button').first();

        // I considered working the HTML as strings, ugh...
        //var popupHTML = popup.html();
        //console.log("HTML: " + popupHTML);

        // Just find the form and submit it
        /***
         * DEV NOTE:
         * This was tricky for me, the form has unique ID numbers:
         *    <form action="/store/buy_speedup/30764191?current_planet=34511&amp;ref_action=index&amp;ref_controller=home" 
         *           id="confirm_popup_form_buy_speedup_30764191_178100" method="post">
         * So we search for any form that starts with the ID we need, and submit it.
         ***/
        var theForm=$('[id^=confirm_popup_form]');
        theForm.submit();
    } 
}

// displaying the Resources tab, as evidenced by the fields column...
function displayingResources($, fields) {
    console.log("GOT RES");
    
    /******** Finish this! *******************
    var comments = new Array('First','Second','Third');
    console.log("ONE" + comments[0]);
    console.log("THREE" + comments[2]);

    // now process the rows... or something
    var i=-1;
    $('#overview_table > table > tbody  > tr').each(function() {
        if (i>-1) {
            $this = $(this);
            var theirRow = 'theirRow' + i;
            this.setAttribute('id',theirRow);
            //var value = $this.find(".planet").html();

            var tr = document.getElementById("theirRow"+i); //this is an id of some td in some existing table
            var displayRow = '<tr id="displayRow' + i + '" style="border-top: 0px solid grey"><td>&nbsp;</td><td colspan="4" style="text-align:left"><a href="#">&gt;</a>&nbsp;';
            displayRow += comments[i];
            displayRow += '</td></tr>';



            var inputRow = '<tr id="inputRow' + i + '" style="border-top: 0px solid grey"><td>&nbsp;</td><td colspan="4" style="text-align:left">';

            inputRow += '<textarea id="inField' + i + '" rows="1" cols="70">';
            inputRow += comments[i];
            inputRow += '</textarea>';
            inputRow += '</td></tr>';

            // old-school JS way:
            appendTableRows(tr, displayRow);
            appendTableRows(tr, inputRow);

            var value = $this.html();

            // terrific, except it appends to the end of the current row
            //$(this).append(newRow);
            // well yes, this appends the row to the bottom of the table...
            //$(this).parent().append(newRow);

            //console.log("row " + i + ":" + value );

            if (i > 2)
                return false;
        }
        i++;
    });
    $('#inField0').focus();
    $('#inField0').blur(function() {
        console.log( "Lost focus..." );
    });
    ************ needs to be finished ***********/
}

function displayingMines($, tasks) {
    console.log("GOT MINES");
}

function displayingTasks($, tasks) {
    console.log("GOT TASKS");
}
function displayingDefenses($, tasks) {
    console.log("GOT DEFENSES");
}
function displayingShips($, tasks) {
    console.log("GOT SHIPS");
}


/*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
 *
 *             M A I N L I N E
 *
 *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
jQuery( document ).ready(function( $ ) {
    var myVersion = GM_info.script.version; 
    console.log ('Testbed ver', myVersion);

    //emitStatusMessage("FOO", false);
    //emitNotification("Some important message", true);
    //    addMyCSS();

    // Watch for the confirmation popup message, be prepared to auto-submit it
    // NOTE: the Fleets screen has some sort of hidden popup, not an issue right now but...
    waitForKeyElements ($,"#confirm_popup", confirmIfFree);   

    waitForKeyElements ($,"th.tasks.alt", displayingTasks);  
    waitForKeyElements ($,"th.defenses.alt", displayingDefenses);
    waitForKeyElements ($,"th.fields", displayingResources); 
    waitForKeyElements ($,"th.hyd.alt", displayingMines);
    //waitForKeyElements ($,"th.ships.alt", displayingShips);
    



    if ($('#overview_table').length) {
        console.log('Is overview!');
        var tableMarker = $('#overview_table');
        var theTable = tableMarker.first();
        //console.log('TABLE:' + theTable.html());
        //        tableMarker.first().setAttribute('id','foo');

        //$('#overview_table').first().setAttribute('id','foo');

        //        $('#foo > tbody  > tr').each(function() {

    }    


    // Display BOJ message on Profile screen
    if ($('#content.options.index').length) {
        insertProfileHeader($);
    }
});

//console.log("BOJ Testbed");
addMyCSS();







/* ADD A NOTE... need to iterate each row, and $this=$(this) doesn't translate well if using noConflict workaround with assigning a new variable name to replace the $ alias.
   $("tr.item").each(function() {
     $this = $(this)
     var value = $this.find("span.value").html();
     var quantity = $this.find("input.quantity").val();
   });
*/



// INSERT after every TD (not TH) row of #overview_table 
//<tr><td colspan="5" style="text-align:left"><a href="#">My note.</td></tr>

//myGMsetValue('fintest2', 'did2SetUni');
//var foo = myGMgetValue('fintest1');

/*
Stupid confirm speedup box:

<a href="#" onclick="new Ajax.Request('/store/confirm_speedup/30192381?current_planet=34352&amp;ref_action=build&amp;ref_controller=home', {asynchronous:true, evalScripts:true}); return false;">    
    <span id="speedup_30192381_credits_per_second" style="display:none;">1.12</span>
      <span id="speedup_30192381" class="speedup">
        Complete now for
        <span id="speedup_30192381_cost" class="speedup_cost free">FREE</span>
      <span id="speedup_30192381_label" style="display: none;">credits</span>
      </span>
</a>
*/


/* 
Droid screen, need to highlight unassigned:

<div id="from_worker_selector" class="small worker_selector popup" style="left: 95px; top: 236px;">
  <form action="/buildings/unassigned/transfer?current_planet=34287" method="post">    <input id="location" name="location" type="hidden" value="633925">
.
.
  <div class="worker_name">Mine Droid <br> (Unassigned)</div>
.
.
  <div class="worker_name">Mine Droid <br> (Hydrogen Synthesizer)</div>
.
.

*/
