// ==UserScript==
// @name         PrisonBitch
// @namespace    http://tampermonkey.net/
// @version      0.110
// @description  Make the game your bitch
// @author       ZMonk91
// @match		 http://*.prisonblock.com/*
// @match		 https://*.prisonblock.com/*
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.3.1.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38436/PrisonBitch.user.js
// @updateURL https://update.greasyfork.org/scripts/38436/PrisonBitch.meta.js
// ==/UserScript==


//Add jQueryUICSS
$("head").append (
    '<link '+
   'href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css" ' +
   'rel="stylesheet" type="text/css">'+
    "<style>"+
  ".trainer-buttons {"+
   " text-align: center;"+
   " margin-top: 42%;"+
  "}"+
  ".trainer-button-group {"+
   " float: left;"+
  "}"+
   ".trainer-stats {"+
   " float: right;"+
  "}"+
  "</style>"
);

//--- Add custom dialog using jQuery.
$("body").append ('<div id="gmOverlayDialog"></div>');

//--- Activate
$("#gmOverlayDialog").dialog ( {
    modal:      false,
    title:       "Prison Bitch",
    position:   {
           my: "top",
           at: "top",
           of: document,
           collision: "none"
    },
    width:      "auto",
    minWidth:   50,
    minHeight:  50,
    zIndex:     3666
} )
.dialog ("widget").draggable ("option", "containment", "none");

//-- Firefox bugfix
$("#gmOverlayDialog").parent ().css ( {
    position:   "fixed",
    top:        "25em",
    left:       "3.5em",
    width:      "65ex"
} );

// Global Variables
    var nrgBar = $("#um_energy").html();
    var stmBar = $("#um_stamina").html();
    var splitSTM = stmBar.toString().split('/');
    var splitNRG = nrgBar.toString().split('/');
    var username = $("#siteHeader > div.headerContent > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > a").html();
    var item = {
    "Bottle of Water"       : 0.20,
    "Large Bottle of Water" : 0.35,
    "Energy Drink"          : 0.60,
    "Red Bull"              : 0.75,
    "Chocolate Bar"         : 3,
    "Large Chocolate Bar"   : 5,
    };
    var mem = {
        0 : 'times-trained',
        1 : 'energy-used',
        2 : 'levels-gained',
        3 : 'xp-gained',
        4 : 'average-level',
        5 : 'average-xp',
        6 : 'autorun',
        7 : 'timer',
        8 : 'attribute',
        9 : 'quickslot1',
        10: 'quickslot2',
        11: 'quickslot3',
    };

// Begin function
$(document).ready(main());

function main () {

//jQueryUI Tabs & Tooltips & Slider
      $( function() {
          //tabs
    $( "#tabs" ).tabs();
          //tooltips
    $( document ).tooltip();
          //Slider
          $( "#slider" ).slider({
      value:localStorage.getItem('timer'),
      min: 0,
      max: 5000,
      step: 500,
      slide: function( event, ui ) {
        $( "#amount" ).val( " " + ui.value + " milliseconds" );
          localStorage.setItem('timer', $( "#slider" ).slider( "value" ));

      }
    });
    $( "#amount" ).val( " " + $( "#slider" ).slider( "value" ) + ' milliseconds' );
          localStorage.setItem('timer', $( "#slider" ).slider( "value" ));
  } );

    //Autorun Dialog
    var autorunDiv = document.createElement("div");
    autorunDiv.innerHTML = "<div id='tabs'>"+
      "<ul>"+
      "  <li><a href='#tabs-1' title='Automatically train skills'>Skill Trainer</a></li>"+
      "  <li><a href='#tabs-2'>Cell Raider</a></li>"+
      "  <li><a href='#tabs-3'>AutoMugger</a></li>"+
      "</ul>"+
    "<fieldset id='tabs-1' class='widget'> " +
        "<div class='trainer-button-group'>" +
    "<label for='attribute'>Select Skill</label></br>" +
    "<select name='attribute' id='attribute'>" +
        "<option value='\"Train Strength\"'> Strength </option>" +
        "<option value='\"Train Speed\"'> Speed </option>" +
        "<option value='\"Train Defense\"'> Defense </option> </select></br>" +
    "<label for='quickslot1'>Slot 1</label></br>" +
    "<select name='quickslot1' id='quickslot1'>" +
        "<option value='Bottle of Water'> Bottle of Water </option>" +
        "<option value='Large Bottle of Water'> Large Bottle of Water </option>" +
        "<option value='Other'> Other </option> </select></br>" +
    "<label for='quickslot2'>Slot 2</label></br>" +
    "<select name='quickslot2' id='quickslot2'>" +
        "<option value='Chocolate Bar'> Chocolate Bar </option>" +
        "<option value='Large Chocolate Bar'> Large Chocolate Bar </option>" +
        "<option value='Other'> Other </option> </select></br>" +
    "<label for='quickslot3'>Slot 3</label></br>" +
    "<select name='quickslot3' id='quickslot3'>" +
        "<option value='Energy Drink'> Energy Drink </option>" +
        "<option value='Red Bull'> Red Bull </option>" +
        "<option value='Other'> Other </option> </select></br>" +
        "</div>"+
    "<div class='trainer-stats' id='trainer-stats'>"+
        "<p> XP Gained: <span id='xp-gained'>0</span></p>"+
        "<p> Times Trained: <span id='times-trained'>0</span></p>"+
        "<p> Levels Gained: <span id='levels-gained'>0</span></p>"+
        "<p> NRG Used: <span id='energy-used'>0</span></p>"+
        "<p> Avg Level Gained: <span id='average-level'>0</span></p>"+
        "<p> Avg XP Gained: <span id='average-xp'>0</span></p>"+
    "</div>"+
    "<div class='trainer-buttons'>"+
    "<label for='amount'>AutoTrainer Speed:</label>"+
      "<input type='text' id='amount' readonly style='border:0; color:#f6931f; font-weight:bold;'>"+
      "<div id='slider'></div>"+
    "<label for='checkbox'> Autorun </label>" +
        "<input type='checkbox' name='autorun' id='autorun' class='ui-checkbox ui-widget ui-corner-all' value='1'>" +
        "<input id='manual' class='ui-button ui-widget ui-corner-all' type='submit' value='Manual'>"+
        "</div></fieldset>" +
        "<fieldset id='tabs-2' class='widget'> " +
        "<div><p> COMING SOON </p></div> </fieldset>" +
        "<fieldset id='tabs-3' class='widget'> " +
        "<div><p> COMING SOON </p></div> </fieldset>" ;

    $("#attribute").selectmenu();
    $("#gmOverlayDialog").append(autorunDiv);

    //Add Username to Titlebar
    $("#gmOverlayDialog").dialog ( {
        title:       username + "'s Prison Bitch",
    });

    //Update storage settings for Skill
    $("#attribute").change(function () {
        localStorage.setItem('attribute', this.value);
        console.log(localStorage.getItem('attribute'));
    });
    if (localStorage.getItem('attribute')) {
        $('#attribute').val(localStorage.getItem('attribute')).trigger('change');
    }
        //Update storage settings for QS1
    $("#quickslot1").change(function () {
        localStorage.setItem('quickslot1', this.value);
        console.log(localStorage.getItem('quickslot1'));
    });
    if (localStorage.getItem('quickslot1')) {
        $('#quickslot1').val(localStorage.getItem('quickslot1')).trigger('change');
    }

        //Update storage settings for QS2
    $("#quickslot2").change(function () {
        localStorage.setItem('quickslot2', this.value);
        console.log(localStorage.getItem('quickslot2'));
    });
    if (localStorage.getItem('quickslot2')) {
        $('#quickslot2').val(localStorage.getItem('quickslot2')).trigger('change');
    }

        //Update storage settings for QS3
    $("#quickslot3").change(function () {
        localStorage.setItem('quickslot3', this.value);
        console.log(localStorage.getItem('quickslot3'));
    });
    if (localStorage.getItem('quickslot3')) {
        $('#quickslot3').val(localStorage.getItem('quickslot3')).trigger('change');
    }
    //QS Values
    var qs1 = item[$("#quickslot1 option:selected").val()];
    var qs2 = item[$("#quickslot2 option:selected").val()];
    var qs3 = item[$("#quickslot3 option:selected").val()];


     //Update On/Off settings for Autorun
     if (localStorage.getItem('autorun')) {
        $('#autorun').val(localStorage.getItem('autorun'));
         console.log("Current Autorun Status: " + localStorage.getItem('autorun'));
         if (localStorage.getItem('autorun') == "true") {
            $('#autorun').prop('checked',true);
            window.setTimeout(autoClick(qs1,qs2,qs3),localStorage.getItem('timer'));
         }
    }
    $("#autorun").click(function () {
        if (typeof autorun !== 'undefined' && autorun !== null){
            localStorage.setItem('autorun', $('#autorun').prop('checked'));
            console.log("Autorun set to " + localStorage.getItem('autorun'));
        }
    });

    // Stat Tracker
    statTracker();

  // Manual Clicks
    $('#manual').click(function(){
    autoClick(qs1,qs2,qs3);
        console.log(splitSTM[0]);
    });
}
function infirmCheck () {

}
function getMem (memoryItem){
    return localStorage.getItem(mem[memoryItem]);
}
function autoClick (item1,item2,item3) {
    var nrgLeft = splitNRG[1]-splitNRG[0];
    var nrgRatio = splitNRG[0]/splitNRG[1];

    console.log(item1 + " + " + item2 + ' ' + nrgLeft);
    if ((nrgLeft < item2) && (splitSTM[0] === '100%')) {
        console.log('Training...');
        $("input[name='train_button'][value="+localStorage.getItem('attribute')+"]").closest("form").submit();
    } else if (nrgLeft < item2 && splitSTM[0] !== '100%') {
        console.log('Increasing Stamina...');
        $("input[name='itemid'][value='2']").closest("form").submit();
    } else {
        console.log("Low Energy");
        if (nrgRatio >= item3){
        $("input[name='itemid'][value='1']").closest("form").submit();
        } else {
            $("input[name='itemid'][value='5']").closest("form").submit();
        }
    }
}

function statTracker () {
    if ($('.siteMessage').length){
        var trainingMessage = $(".siteMessage:contains('You trained using')").html();
        if (trainingMessage !== undefined){
        var trainingArr = trainingMessage.toString().split(' ');
        console.log(trainingArr[3] + " Energy, " + trainingArr[6] + " Defense, " + trainingArr[9] + " XP");
            statsUpdater(trainingArr[3],trainingArr[6],trainingArr[9]);
        }
    }
        // Update Stats from Memory
    for (i = 0; i < 5; i++) {
        if (getMem(i) !== null){
            $('#'+mem[i]).replaceWith(getMem(i));
        } else {
            localStorage.setItem(mem[i],0);
        }
    }
}

function statsUpdater (Energy,Levels,XP) {

    var newTimes  =    parseInt(getMem(0))  + 1;
    var newEnergy =    parseInt(getMem(1))  + parseInt(Energy);
    var newLevels =    parseInt(getMem(2))  + parseInt(Levels);
    var newXp     =    parseInt(getMem(3))  + parseInt(XP);
    var avgLevel  =    newLevels / newTimes;
    var avgXp     =    newXp     / newTimes;

    localStorage.setItem('times-trained', newTimes);
    localStorage.setItem('energy-used'  , newEnergy);
    localStorage.setItem('levels-gained', newLevels);
    localStorage.setItem('xp-gained'    , newXp);
    localStorage.setItem('average-level', avgLevel.toFixed(2));
    localStorage.setItem('average-xp'   , avgXp.toFixed(2));


}