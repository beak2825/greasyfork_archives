// ==UserScript==
// @name         Subeta: Auto-training
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1.8
// @description  A free substitute for Auto-Training. Leave it on running (in a separate window) and it will automatically go through the motions of training for you! You have the option of training all your pets in every stat, or training up to 4 pets in a specific stat.
// @author       AyBeCee
// @match        https://subeta.net/explore/train.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412207/Subeta%3A%20Auto-training.user.js
// @updateURL https://update.greasyfork.org/scripts/412207/Subeta%3A%20Auto-training.meta.js
// ==/UserScript==


var Pet1Key;
var Pet1 = GM_getValue('Pet1Key',0);
var Pet2Key;
var Pet2 = GM_getValue('Pet2Key',0);
var Pet3Key;
var Pet3 = GM_getValue('Pet3Key',0);
var Pet4Key;
var Pet4 = GM_getValue('Pet4Key',0);


var InputArrayKey;
var InputArray = GM_getValue('InputArrayKey',0);



var Stat1Key;
var Stat1 = GM_getValue('Stat1Key',0);
var Stat2Key;
var Stat2 = GM_getValue('Stat2Key',0);
var Stat3Key;
var Stat3 = GM_getValue('Stat3Key',0);
var Stat4Key;
var Stat4 = GM_getValue('Stat4Key',0);

var StatArrayKey;
var StatArray = GM_getValue('StatArrayKey',0);

var trainingHistoryKey;
var trainingHistory = GM_getValue('trainingHistoryKey',0);


var autoEverythingKey;
var autoEverything = GM_getValue('autoEverythingKey',0);


var BeforeStatsKey;
var BeforeStats = GM_getValue('BeforeStatsKey',0);


$('.col-md-8 .ui.message').append(`
<div style="border: 1px solid #d2d57e; padding: 20px; background: #e2e4bd;">
<b style="color:red">Auto training script</b>
<br><br>
<b>Pets to auto-train (case sensitive):</b>
<br>

  <label for="pet1input">Pet name 1:</label>
  <input type="text" id="pet1input" name="pet1input" value="${Pet1}" class="greyout">
<label for="pet1stat">Train:</label>
<select name="pet1stat" id="pet1stat" class="greyout">
  <option value="Level">Level</option>
  <option value="Strength">Strength</option>
  <option value="Defense">Defense</option>
  <option value="Health">Health</option>
  <option value="Speed">Speed</option>
  <option value="Everything">Everything</option>
</select>

<br>
  <label for="pet2input">Pet name 2:</label>
  <input type="text" id="pet2input" name="pet2input" value="${Pet2}" class="greyout">
<label for="pet2stat">Train:</label>
<select name="pet2stat" id="pet2stat" class="greyout">
  <option value="Level">Level</option>
  <option value="Strength">Strength</option>
  <option value="Defense">Defense</option>
  <option value="Health">Health</option>
  <option value="Speed">Speed</option>
  <option value="Everything">Everything</option>
</select>
<br>
  <label for="pet3input">Pet name 3:</label>
  <input type="text" id="pet3input" name="pet3input" value="${Pet3}" class="greyout">
<label for="pet3stat">Train:</label>
<select name="pet3stat" id="pet3stat" class="greyout">
  <option value="Level">Level</option>
  <option value="Strength">Strength</option>
  <option value="Defense">Defense</option>
  <option value="Health">Health</option>
  <option value="Speed">Speed</option>
  <option value="Everything">Everything</option>
</select>
<br>
  <label for="pet4input">Pet name 4:</label>
  <input type="text" id="pet4input" name="pet4input" value="${Pet4}" class="greyout">
<label for="pet4stat">Train:</label>
<select name="pet4stat" id="pet4stat" class="greyout">
  <option value="Level">Level</option>
  <option value="Strength">Strength</option>
  <option value="Defense">Defense</option>
  <option value="Health">Health</option>
  <option value="Speed">Speed</option>
  <option value="Everything">Everything</option>
</select>
<br>
<input type="checkbox" id="allpets" name="allpets">
<label for="allpets"> Auto-train all pets in everything</label>
<br>
<button id='updatePetnames'>Update settings</button>
<br><br>
<b>Training log:</b>
<div id="trainingspan">${trainingHistory}</div>
<br>
<button id='clearhistory'>Clear log</button>
<br>

<br><br>
<b>Training summary:</b>
<br>
<button id='startstats'>Reset summary</button>

<div id="summaryStats"></div>

</div>

<style>
#trainingspan {
max-height:200px;
overflow:auto;
}
.statSummaryBox {
    display: inline-block;
    width: 100px;
    padding: 10px;
    background: #efefe3;
    color: #000;
    margin: 1px;
}
</style>
`);


$('#allpets').change(function() {

    if ( $(this).prop("checked") == true ) {
        $(".greyout").attr('disabled', true);
    } else {
        $(".greyout").attr('disabled', false);
    }
});

if ( autoEverything == true ) {
    $('#allpets').prop('checked', true);
    $(".greyout").attr('disabled', true);
}
else {
    $('#allpets').prop('checked', false);
    $(".greyout").attr('disabled', false);
}

// clear history button
$("#clearhistory").click(function(){
    $(`#trainingspan`).hide();
    GM_setValue('trainingHistoryKey'," ");
});


$('#pet1stat').val(Stat1);
$('#pet2stat').val(Stat2);
$('#pet3stat').val(Stat3);
$('#pet4stat').val(Stat4);

var inputtedPets;
$("#updatePetnames").click(function() {

    // if auto-train all pets in everything
    if ( $("#allpets").prop("checked") == true ) {

        GM_setValue('autoEverythingKey',true);

    }
    // no auto-train all pets in everything
    else {

        GM_setValue('autoEverythingKey',false);

        var inputted1 = $("#pet1input").val();
        var inputted2 = $("#pet2input").val();
        var inputted3 = $("#pet3input").val();
        var inputted4 = $("#pet4input").val();

        inputtedPets = [ inputted1 , inputted2 , inputted3 , inputted4 ]

        GM_setValue('Pet1Key',inputtedPets[0]);
        GM_setValue('Pet2Key',inputtedPets[1]);
        GM_setValue('Pet3Key',inputtedPets[2]);
        GM_setValue('Pet4Key',inputtedPets[3]);

        GM_setValue('InputArrayKey',inputtedPets);


        var inputStat1 = $( "#pet1stat option:selected" ).val();
        var inputStat2 = $( "#pet2stat option:selected" ).val();
        var inputStat3 = $( "#pet3stat option:selected" ).val();
        var inputStat4 = $( "#pet4stat option:selected" ).val();


        var inputtedStats = [ inputStat1 , inputStat2 , inputStat3 , inputStat4 ]


        GM_setValue('Stat1Key',inputtedStats[0]);
        GM_setValue('Stat2Key',inputtedStats[1]);
        GM_setValue('Stat3Key',inputtedStats[2]);
        GM_setValue('Stat4Key',inputtedStats[3]);

        GM_setValue('StatArrayKey',inputtedStats);


    }
    location.reload();
});


// GETTING START STATS


$(`#startstats`).click ( function() {
    var beforeStartsObject = {};

    // keeping record of 'before' stats
    $(`.training-center-pet.col-3.p-3`).each( function() {
        var beforeLevel = parseInt( $(this).find(`.p-1:contains('Level:') b:eq(0)`).html() );
        var beforeStrength = parseInt( $(this).find(`.p-1:contains('Level:') b:eq(1)`).html() );
        var beforeDefense = parseInt( $(this).find(`.p-1:contains('Level:') b:eq(2)`).html() );
        var beforeHealth = $(this).find(`.p-1:contains('Level:') b:eq(3)`).html() ;
        beforeHealth = parseInt( beforeHealth.substring(
            beforeHealth.lastIndexOf("/") + 1
        ) );
        var beforeSpeed = parseInt( $(this).find(`.p-1:contains('Level:') b:eq(4)`).html() );

        var beforeStatsAll = {
            "Level": beforeLevel,
            "Strength": beforeStrength,
            "Defense": beforeDefense,
            "Health": beforeHealth,
            "Speed": beforeSpeed,
        };

        var thisName = $(this).find(`center b`).text();
        beforeStartsObject[thisName] = beforeStatsAll;
    });
    console.log(beforeStartsObject);
    GM_setValue('BeforeStatsKey',beforeStartsObject);
});


// after stats
var afterStatsObject = {}
$(`.training-center-pet.col-3.p-3`).each( function() {
    var beforeStartsObject = {};
    // if the pet box stat is NOT pink. (when it's pink, the script breaks)
    if ( ! $(`.p-1[style="background-color:#ffd9d9"]`).length > 0 ) {
        // keeping record of 'before' stats
        $(`.training-center-pet.col-3.p-3`).each( function() {
            var afterLevel = parseInt( $(this).find(`.p-1:contains('Level:') b:eq(0)`).html() );
            var afterStrength = parseInt( $(this).find(`.p-1:contains('Level:') b:eq(1)`).html() );
            var afterDefense = parseInt( $(this).find(`.p-1:contains('Level:') b:eq(2)`).html() );
            var afterHealth = $(this).find(`.p-1:contains('Level:') b:eq(3)`).html() ;
            afterHealth = parseInt( afterHealth.substring(
                afterHealth.lastIndexOf("/") + 1
            ) );
            var afterSpeed = parseInt( $(this).find(`.p-1:contains('Level:') b:eq(4)`).html() );

            var afterStatsAll = {
                "Level": afterLevel,
                "Strength": afterStrength,
                "Defense": afterDefense,
                "Health": afterHealth,
                "Speed": afterSpeed,
            };

            var thisName = $(this).find(`center b`).text();
            afterStatsObject[thisName] = afterStatsAll;
        });
    }
});


for (var petName in afterStatsObject) {

    // get the difference with the beforeStat
    var differenceLevel = afterStatsObject[petName]["Level"] - BeforeStats[petName]["Level"];
    var differenceStrength = afterStatsObject[petName]["Strength"] - BeforeStats[petName]["Strength"]
    var differenceDefense = afterStatsObject[petName]["Defense"] - BeforeStats[petName]["Defense"]
    var differenceHealth = afterStatsObject[petName]["Health"] - BeforeStats[petName]["Health"]
    var differenceSpeed = afterStatsObject[petName]["Speed"] - BeforeStats[petName]["Speed"]


    $(`#summaryStats`).append(`<div class="statSummaryBox">
<b>${petName}:</b> <br>
<div style="${ (differenceLevel > 0) ? 'color:red' : '' }"> Level +${differenceLevel} </div>
<div style="${ (differenceStrength > 0) ? 'color:red' : '' }">Strength +${differenceStrength} </div>
<div style="${ (differenceDefense > 0) ? 'color:red' : '' }">Defense +${differenceDefense} </div>
<div style="${ (differenceHealth > 0) ? 'color:red' : '' }">Health +${differenceHealth} </div>
<div style="${ (differenceSpeed > 0) ? 'color:red' : '' }">Speed +${differenceSpeed} </div>
</div>`)
}


// click when there is 'Pet is Done' button
if ( $(`input[value$="is Done!"]`).length > 0  ) {
    $(`input[value$="is Done!"]:first`).click();
}

// if auto train all pets
if ( autoEverything == true ) {
    if ( $(`input[value="Train your Pet"]`).length > 0 ) {
        $(`input[value="Train your Pet"]:first`).click();
    }


    if ( !$(`input[value$="is Done!"]`).length > 0  ) {
        $(".training-center-pet.col-3.p-3" ).each(function( ) {
            var timeLeft = $( this ).find(".p-1:nth-child(6) b:nth-child(2)").text();
            var timeLeftinMilliseconds = parseInt(timeLeft) * 60000;
            console.log(`Refreshing in ${timeLeftinMilliseconds}ms`);

            setTimeout(function () {
                location.reload();
            }, timeLeftinMilliseconds);
        });
    }

}

// if auto train only 4 pets
else if ( autoEverything == false ) {
    // get all the current available pets
    $(".training-center-pet.col-3.p-3" ).each(function( ) {
        var potentialPet = $( this ).find("center b:first").text();


        // if this pet is NOT selected
        if ( ! InputArray.includes(potentialPet) ) {
            console.log("ignore " + potentialPet)
        }

        // if this pet is selected
        else {
            console.log("don't ignore " + potentialPet)

            // check the index of the pet in the array
            // https://www.w3schools.com/JSREF/jsref_indexof_array.asp
            var petIndex = InputArray.indexOf(potentialPet)

            // check this pet needs to be trained
            if ( $( this ).find('input[value="Train your Pet"]').length > 0 ) {
                console.log(potentialPet + " needs to be trained in " + StatArray[petIndex])

                // if the pet is trained in 'Everything'
                if ( StatArray[petIndex] == "Everything" ) {

                    // click Train your Pet (goes with the first stat option)
                    $( this ).find(`input[value="Train your Pet"]`).click();
                }

                // if the pet is to be trained in a specific stat
                else {
                    // if the correct stat option exists
                    if ( $( this ).find(`select[name="stat"] option:contains(${StatArray[petIndex]})`).length > 0 ) {

                        // select the correct stat
                        $( this ).find(`select[name="stat"] option:contains(${StatArray[petIndex]})`).prop('selected', true);

                        // click Train your Pet
                        $( this ).find(`input[value="Train your Pet"]`).click();

                    } else {
                        // if the stat option does not exist

                        trainingHistory += "<span style='color:red'><br><b>" + $("#menu-time").text() + `:</b> ${potentialPet} has maxed out their ${StatArray[petIndex]}</span>`;
                        GM_setValue('trainingHistoryKey',trainingHistory);

                        $(`#pet${petIndex + 1}input`).val("");
                        $( `#pet${petIndex + 1}stat option:selected` ).val("");
                        $("#updatePetnames").click();

                    }
                }


            } else if ( $(this).find('div[style="background-color:#76BCDD"]').length > 0 ) {
                // if pet is already in training
                console.log(potentialPet + " is already in training!");

                var timeLeft = $( this ).find(".p-1:nth-child(6) b:nth-child(2)").text();
                console.log(timeLeft);
                var timeLeftinMilliseconds = parseInt(timeLeft) * 60000;
                console.log(`Refreshing in ${timeLeftinMilliseconds}ms`);

                setTimeout(function () {
                    location.reload();
                }, timeLeftinMilliseconds);

            }
        }
    });


}



/////// finished training page


if ( $('body:contains("Put pet in for another session?")').length > 0  ) {
    // get substring of what the pet gained
    var petGainedText = $(".container-fluid center").text();
    var petText = petGainedText.substring( 9, petGainedText.lastIndexOf("Back to Training Center") );
    console.log(petText)

    trainingHistory += "<br><b>" + $("#menu-time").text() + ":</b> " + petText;
    GM_setValue('trainingHistoryKey',trainingHistory);
    console.log(trainingHistory);

    window.location.href = "https://subeta.net/explore/train.php";
}



// page after Train your Pet has been clicked
if ( $('body:contains("Your pet has been put in for a lesson of")').length > 0  ) {
    window.location.href = $("a:contains('Add an Alert')").attr("href");
}







