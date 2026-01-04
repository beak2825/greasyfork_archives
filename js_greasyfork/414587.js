// ==UserScript==
// @name         Subeta: Auto Battle
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.0.1
// @description  Automates Battling. Automatically clicks for Battle Quest.
// @author       AyBeCee
// @match        https://subeta.net/games/battle/*
// @match        https://subeta.net/explore/healer.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/414587/Subeta%3A%20Auto%20Battle.user.js
// @updateURL https://update.greasyfork.org/scripts/414587/Subeta%3A%20Auto%20Battle.meta.js
// ==/UserScript==


Notification.requestPermission();

var battlePetKey;
var battlePet = GM_getValue('battlePetKey',0);

var battlePetIDKey;
var battlePetID = GM_getValue('battlePetIDKey',0);

var opponentKey;
var opponent = GM_getValue('opponentKey',0);

var pauseScriptKey;
var pauseScript = GM_getValue('pauseScriptKey',0);

var autoHealFightKey;
var autoHealFight = GM_getValue('autoHealFightKey',0);

var autoHealKey;
var autoHeal = GM_getValue('autoHealKey',0);

var fightAgainKey;
var fightAgain = GM_getValue('fightAgainKey',0);

var makeTurnKey;
var makeTurn = GM_getValue('makeTurnKey',0);

var startBattleKey;
var startBattle = GM_getValue('startBattleKey',0);

var stopAtWinNumberKey;
var stopAtWinNumber = GM_getValue('stopAtWinNumberKey',0);

var showHideKey;
var showHide = GM_getValue('showHideKey',0);


$(`.battle-menu.border.rounded.p-1.text-center.mb-3`).after(`
<div id="autoBattleContainer">
 <input type="checkbox" id="pauseScript" name="pauseScript">
  <label for="pauseScript">Pause Auto Battle Script</label>

<div id="hideAutoBattle" class="ui button">Hide</div>
<div id="showAutoBattle" class="ui button">Show</div>
<br>
<div id="inputContainer" class="battleSettings">
  <label for="battlePetInput">Battle pet name:</label>
  <input type="text" id="battlePetInput" name="battlePetInput" value="${battlePet}">

  <label for="battlePetIDInput">Battle pet ID:</label>
  <input type="number" id="battlePetIDInput" name="battlePetIDInput" value="${battlePetID}">
<br>
  <label for="opponentInput">Opponent ID:</label>
  <input type="number" id="opponentInput" name="opponentInput" value="${opponent}">
<br>
  <label for="stopAtWinNumberInput">Stop at win:</label>
  <input type="number" id="stopAtWinNumberInput" name="stopAtWinNumberInput" value="${stopAtWinNumber}">
<br><br>
<div id="updateSettings">Update settings</div>
</div>
<div id="checkboxContainer" class="battleSettings">
 <input type="checkbox" id="fightAgain" name="fightAgain">
  <label for="fightAgain">Automatically click 'Fight This Opponent Again?'</label>
<br>
 <input type="checkbox" id="autoHeal" name="autoHeal">
  <label for="autoHeal">Automatically heal if beaten</label>
<br>
 <input type="checkbox" id="autoHealFight" name="autoHealFight">
  <label for="autoHealFight">Automatically fight after healed</label>
<br>
 <input type="checkbox" id="makeTurn" name="makeTurn">
  <label for="makeTurn">Automatically click 'Make Your turn'</label>
<br>
 <input type="checkbox" id="startBattle" name="startBattle">
  <label for="startBattle">Automatically click 'Start Battle' at the Select Pet/Weapons/Scroll Set page</label>
<br>
<div id="savedFade">Saved</div>
</div>
</div>
<br>
<br>
<style>
#autoBattleContainer {
    padding: 10px;
    background: #EFEFEF;
}
.battleSettings {
    padding: 20px;
max-width:600px;
display:inline-block;
height:200px;
vertical-align:top;
}
#checkboxContainer {
    border: 1px solid #c9dfe6;
    background-color: #e6f4f9;
}
#savedFade {
    text-align: center;
    color: #ffffff;
    background: #4CAF50;
    float: left;
    padding: 2px 8px;
display:none;
}
#inputContainer {
    border: 1px solid #c9dcd0;
    background-color: #e1efda;
}
#updateSettings {
text-align: center;
color: #fff;
background: red;
padding: 5px;
border-radius: 3px;
cursor:pointer
}
</style>
`)

if ( $(`.two.wide.column.center.aligned:contains('Slots Spork')`).length > 0 ) {
    window.location.href = $(`.two.wide.column.center.aligned:contains('Slots Spork'):first a.ui.button.tiny.red`).attr("href")
}


$('#pauseScript').change(function() {
    if ( $('#pauseScript:checked').length > 0 ) {
        GM_setValue('pauseScriptKey',true);
    } else {
        GM_setValue('pauseScriptKey',false);
    }
});

$('#checkboxContainer input').change(function() {

    $("#savedFade").fadeIn(500);
    setTimeout(function(){
        $("#savedFade").fadeOut(500);
    }, 1000);

    if ( $('#fightAgain:checked').length > 0 ) {
        GM_setValue('fightAgainKey',true);
    } else {
        GM_setValue('fightAgainKey',false);
    }
    if ( $('#autoHeal:checked').length > 0 ) {
        GM_setValue('autoHealKey',true);
    } else {
        GM_setValue('autoHealKey',false);
    }
    if ( $('#autoHealFight:checked').length > 0 ) {
        GM_setValue('autoHealFightKey',true);
    } else {
        GM_setValue('autoHealFightKey',false);
    }
    if ( $('#makeTurn:checked').length > 0 ) {
        GM_setValue('makeTurnKey',true);
    } else {
        GM_setValue('makeTurnKey',false);
    }
    if ( $('#startBattle:checked').length > 0 ) {
        GM_setValue('startBattleKey',true);
    } else {
        GM_setValue('startBattleKey',false);
    }
});

$("#updateSettings").click(function(){
    GM_setValue('battlePetKey', $(`#battlePetInput`).val() );
    GM_setValue('battlePetIDKey', $(`#battlePetIDInput`).val() );
    GM_setValue('opponentKey', $(`#opponentInput`).val() );
    GM_setValue('stopAtWinNumberKey', $(`#stopAtWinNumberInput`).val() );

    // because location.reload doesn't work
    window.location.href = "https://subeta.net/games/battle/challenge.php";
});

if ( showHide == "hide" ) {
    $(".battleSettings").hide();
    $("#hideAutoBattle").hide();
    $("#showAutoBattle").show();
} else if ( showHide == "true" ) {
    $(".battleSettings").show();
    $("#hideAutoBattle").show();
    $("#showAutoBattle").hide();
}

$("#hideAutoBattle").click(function(){
    $("#hideAutoBattle").hide();
    $("#showAutoBattle").show();
    $(".battleSettings").hide();

    GM_setValue('showHideKey','hide');
});
$("#showAutoBattle").click(function(){
    $("#hideAutoBattle").show();
    $("#showAutoBattle").hide();
    $(".battleSettings").show();

    GM_setValue('showHideKey','show');
});

// for default form display
if ( pauseScript == true ) {
    $('#pauseScript').prop('checked', true);
}
if ( autoHeal == true ) {
    $('#autoHeal').prop('checked', true);
}
if ( autoHealFight == true ) {
    $('#autoHealFight').prop('checked', true);
}
if ( fightAgain == true ) {
    $('#fightAgain').prop('checked', true);
}
if ( makeTurn == true ) {
    $('#makeTurn').prop('checked', true);
}
if ( startBattle == true ) {
    $('#startBattle').prop('checked', true);
}


if (window.location.href.includes("/games/battle/battle.php") ) {
    $(`.battle-image img`).attr("style","height:50px")
}

if ( pauseScript == false ) {
    if (window.location.href.includes("/games/battle/challenge.php")) {
        $(`select.mt-2.mb-2`).val(battlePetID);
        //     $('.card.m-3:contains("Buttwing Bomber")').find('input.btn.btn-primary.mt-2[value="Choose Weapons"]').click();
    }

    if ( ( window.location.href.includes("?act=battle&id=") ) && ( startBattle == true ) ) {
        if ( $('#preselect-setting-button:contains("ON")').length > 0 ) {
            $('#preselect-setting-toggle').click();
        }
        $('input#start-battle-button').click();
    }

    // after battle
    if (window.location.href.includes("/games/battle/battle.php?act=end_game&id=") ) {

        if ( $(`.container-fluid center p:contains('You have defeated ')`).length > 0 ) {
            var defeatedTimes = $(`.container-fluid center p:contains('You have defeated ')`).html();
            defeatedTimes = parseInt ( defeatedTimes.substring(
                defeatedTimes.lastIndexOf("</b>") + 4,
                defeatedTimes.lastIndexOf(" times!")
            ) );
        }
        if ( ( ! $(`h2:contains('You Won!')`).length > 0 ) && ( autoHeal == true ) ) {
            new Notification(`You did not win. Going to Healer.`);
            window.location.href = `https://subeta.net/explore/healer.php?act=heal&petid=${battlePetID}`

        } else if ( $(`body:contains('headquarters to finish up this quest!')`).length > 0 && $(`h2:contains('You Won!')`).length > 0 ) {
            window.location.href = "https://subeta.net/games/battle/quest.php"
        } else if ( defeatedTimes > stopAtWinNumber ) {
            new Notification(`You have reached ${stopAtWinNumber} wins!`);

        }else if ( fightAgain == true ) {
            // if you win
           window.location.href = $(`button.btn.btn-info:contains("Fight This Opponent Again!")`).parent().attr("href") ;

        }
    }

    // at the healer page
    if (window.location.href.includes("/explore/healer.php")) {
        console.log(autoHealFight)
        if  ( autoHealFight == true ) {
            if ( ! $(`.healing-pet.col-sm-6.col-md-3.col-lg-2.p-3.text-center:contains('${battlePet}')`).length > 0 || ( $(`body:contains('That pet does not need my healing!')`).length > 0) ) {
                window.location.href = `https://subeta.net/games/battle/challenge.php?act=battle&id=${opponent}&pet=${battlePetID}`
            }
        } else if ( $(`.healing-pet.col-sm-6.col-md-3.col-lg-2.p-3.text-center:contains('${battlePet}')`).length > 0 ) {
            window.location.href = `https://subeta.net/explore/healer.php?act=heal&petid=${battlePetID}`
        }
    }

    // during the actual battle
    if (window.location.href.includes("/games/battle/battle.php") ) {
        setInterval(function(){
            if ( $(`h2:contains('Game Over')`).length > 0 ) {
                window.location.href = $(`a.btn.btn-large.btn-danger.end-game-btn`).attr("href");
            } else if ( ( $(`input#turn_button`).length > 0 ) && ( makeTurn == true ) ) {
                $(`input#turn_button`).click();
            }
        }, 2000);
    }

    if (window.location.href.includes("/games/battle/quest.php") && $(`a.ui.button.blue:contains("Start Level")`).length > 0 ) {
        window.location.href = $(`a.ui.button.blue:contains("Start Level")`).attr("href")

    }
}