// ==UserScript==
// @name         Flight Rising: Auto Dailies
// @version      0.4
// @description  Start at Gathering. When Gathering finishes, go to Trivia, then Plunder, then to Flattery, then Nesting Grounds (to incubate). Automatically collects and clicks Transmute in Baldwin. At Crim, if you can't trade, it clicks 'new offer' until you can or until you run out of offers. When you run out of offers, there will be a timer to refresh when you get new offers.
// @author       AyBeCee
// @match        *.flightrising.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/145271
// @downloadURL https://update.greasyfork.org/scripts/395071/Flight%20Rising%3A%20Auto%20Dailies.user.js
// @updateURL https://update.greasyfork.org/scripts/395071/Flight%20Rising%3A%20Auto%20Dailies.meta.js
// ==/UserScript==



var gatherLocationKey;
var gatherLocation = GM_getValue('gatherLocationKey',0);

function wait() {
    return Math.floor(Math.random() * 1001) + 1000;
}


// auto flattery
if (window.location.href.indexOf("/trading/fantastic-familiars/flattery") > -1) {
    $(".flatter-button.flatter-button-enabled.common-ui-button.common-tooltip:first").click();
    setInterval(function(){
        $("#bonding-dialog .beigebutton.thingbutton.dialog-dismiss").click();
    }, wait);
    if ( !$(".flatter-button.flatter-button-enabled.common-ui-button.common-tooltip:first").length ) {
        window.open("https://www1.flightrising.com/nest","_self")
    }
}

// auto feed
if (window.location.href.indexOf("flightrising.com/lair") > -1) {
    var energyLevels = $('.lair-page-dragon-energy-frame.common-tooltip').attr("title");

    var energyValue = energyLevels.substring(energyLevels.indexOf('Energy: ') + 8, energyLevels.indexOf('/50') );
    console.log(energyValue);
    if ( Number(energyValue) < 50 ) {
        $("#lair-action-feed.lair-action").click();
    }
}

// auto gathering
if (window.location.href.indexOf("?p=gather&action=") > -1) {
    $(".beigebutton.thingbutton[value='Repeat Gathering »'").click();
}
if (window.location.href.indexOf("?p=gather") > -1) {

    $(`div[style="position:relative; text-align:right; width:705px; height:69px; margin-left:15px;"]`).after(`
<div style="padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Auto Dailies Script</div>
<label for="gatherLocation">Default gathering location:</label>

<select name="gatherLocation" id="gatherLocation">
 <option></option>
 <option value="1">Earth</option>
 <option value="2">Plague</option>
 <option value="3">Wind</option>
 <option value="4">Water</option>
 <option value="5">Lightning</option>
 <option value="6">Ice</option>
 <option value="7">Shadow</option>
 <option value="8">Light</option>
 <option value="9">Arcane</option>
 <option value="10">Nature</option>
 <option value="11">Fire</option>
</select>
<br><br>
Click on a button below to begin the Auto Dailies Script.
</div>

`)
    $('#gatherLocation').change(function() {
        gatherLocation = $("#gatherLocation option:selected").val();
        console.log(gatherLocation)
        GM_setValue('gatherLocationKey',gatherLocation);

        location.reload();
    });
    // for default form display
    $("select#gatherLocation").val(gatherLocation);


    // go to trivia when 0 gathering turns left
    var turnsLeft = $("div[style='color:#000; margin-left:auto; margin-right:auto; font-size:20px; padding-top:2px;']").text();
    var numberTurns = parseInt(turnsLeft);
    if ( numberTurns === 0 ) {
        window.open("https://flightrising.com/main.php?p=tradepost&lot=trivia","_self")
    }

    // if selected a gatherLocation
    $(`select.input_reg > option[value="${gatherLocation}"]`).attr('selected', true);
}

// auto plunder
if (window.location.href.indexOf("/trading/pinkpile") > -1) {
    $("input[value='Grab an Item'").click();
    //
    setInterval(function(){
        if( $('#newitem').length ) {
            window.open("https://www1.flightrising.com/trading/fantastic-familiars/flattery","_self")
        }
    }, wait);
}

// auto incubate
if (window.location.href.indexOf("&tab=hatchery") == -1) {
    $("img[src*='/images/layout/button_incubate.png']").click();
    // if nothing left to incubate, go to lair
    if( $("img[src*='/images/layout/button_incubate.png']").length ) {
        window.open("https://www1.flightrising.com/lair/","_self")
    }
}



// auto baldwin
if (window.location.href.includes("trading/baldwin/transmute")) {
    $("input.redbutton.anybutton[value='Collect!']").click();
    $("input.redbutton.anybutton[value='Transmute']").click();


    setTimeout(function(){
        $('a.generic-hoard-tab[data-tab-id="mats"]').click();

        setTimeout(function(){
            $('a[data-name="Chimera Fangs"]').click();
            $('#attch').click();
            $('#transmute-confirm-ok').click();
        }, 2000);
    }, 1000);
}

// auto naming
if (window.location.href.includes("/dragon/")) {
    var unnamedSpan = $('.dragon-profile-header-name').text();

    if (unnamedSpan.includes("Unnamed")) {
        $('img[data-tooltip-source="#name-dragon-dialog-tooltip"]').click();

        function clickRandomize() {
            $(".beigebutton.thingbutton[value='Randomize'").click();
        }

        setTimeout(clickRandomize, wait);
    }
}

// auto crim - if can't trade, clicks 'new offer'
if (window.location.href.includes("trading/crim")) {
    var availableOffers = $("#counter").text();
    // convert string to integer
    var numberOffers = parseInt(availableOffers);

    if ( numberOffers > 0 ) {

        if( $('#notrade').length ) {
            $("#newoffer").click();
        } else {
            $("#trade").click();
            alert("New trade!")
        }

    } else {
        var timeRemaining = $("#crimswap p span").text();
        // get the number only
        var timeNumber = timeRemaining.substring(0, timeRemaining.indexOf(' minutes') );
        // convert string to integer and then x6000
        var integerTime = parseInt(timeNumber) * 60000;

        setTimeout(function() {location.reload();}, integerTime);
    }


}



// auto baldwin
if (window.location.href.includes("?p=tradepost&lot=trivia")) {
    if($('#tomo_speechBubble').css('display') == 'none') {
        window.open("https://www1.flightrising.com/trading/pinkpile","_self")
    };
}
