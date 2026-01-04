// ==UserScript==
// @name         Subeta: Scratchcard Helper
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1.1
// @description  Automatically buys scratchcards. Automatically scratches scratchcards.
// @author       AyBeCee
// @match        https://subeta.net/games/scratchcards.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412753/Subeta%3A%20Scratchcard%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/412753/Subeta%3A%20Scratchcard%20Helper.meta.js
// ==/UserScript==


var currentTime = $('#menu-time').text();

var buyScratchKey;
var buyScratch = GM_getValue('buyScratchKey',0);

var scratchHistoryKey;
var scratchHistory = GM_getValue('scratchHistoryKey',0);

$(`.row.w-100.mx-auto`).after(`
<br>
<center>
<div id="scratchcardHelper">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Scratchcard Helper Script</div>
<label for="buyScratch">Auto buy or scratch:</label>

<select name="buyScratch" id="buyScratch">
  <option></option>
  <option value="buy">Buy</option>
  <option value="scratch">Scratch</option>
</select>
<div id="scratchHistory"></div>
<br><div id="clearScratchcard" class="ui button">Clear history</div>
<div id="savedFade3">Saved</div>
</div>
</center>

<style>
#scratchcardHelper {
padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3;
margin-bottom: 10px;
display:inline-block;
background: #e3e3e3;
}
#savedFade3 {
    text-align: center;
    color: #ffffff;
    background: #4CAF50;
    padding: 2px 8px;
display:none;
margin-top:5px;
}
</style>
`);

function flashySaved () {
    $("#savedFade3").fadeIn(500);
    setTimeout(function(){
        $("#savedFade3").fadeOut(500);
    }, 1000);
}
$('#buyScratch').change(function() {
    GM_setValue('buyScratchKey',$(this).val());
    flashySaved ()
});
$('#clearScratchcard').click(function() {
    GM_setValue('scratchHistoryKey',"");
    $(`#scratchHistory`).hide()
    flashySaved ()
});

// default view
$('#buyScratch').val(buyScratch);


if ( buyScratch == "buy" ) {
    $(`input.btn.btn-info.btn-lg[value="Buy a scratchcard for 1000sP"]`).click()
}
else if ( buyScratch == "scratch" ) {
    $(`input[value="Scratch!"]`).click();
}

$(`#scratchHistory`).html(scratchHistory)



if ( $(`.alert.alert-danger:contains("You can't purchase another scratchcard yet!")`).length > 0 ) {
    var alertText = $(`.alert.alert-danger`).text()
    var alertArray = alertText.split(" ");
    console.log(alertArray)

    var cooldownTime;
    if ( alertArray.includes("Minute") || alertArray.includes("Minutes") ) {
        cooldownTime = ( Number(alertArray[9]) * 60000 ) + ( Number(alertArray[12]) * 1000 ) ;
        console.log(cooldownTime)
    } else {
        cooldownTime = ( Number(alertArray[9]) * 1000);
        console.log(cooldownTime)
    }

    setTimeout(function(){
        window.location.href = "https://subeta.net/games/scratchcards.php";
    }, cooldownTime);
}

if ( window.location.href.includes("?act=play")  ) {
    if ( ! $(`body:contains("You've finished with this game!")`).length > 0 ) {
        var scratchHereArray = [];

        // add each scratchible option to an array
        $( `.container-fluid table a` ).each(function() {
            scratchHereArray.push($( this ).attr("href"));
        });

        // randomise one of the scratchible options from the array
        console.log( scratchHereArray[Math.floor(Math.random() * scratchHereArray.length)] );

        if ($( `.container-fluid table a` ).length > 0 ) {
            window.location.href = scratchHereArray[Math.floor(Math.random() * scratchHereArray.length)] ;
        }
    }
    else if ( $(`body:contains("You've finished with this game!")`).length > 0 ) {
        var prizeText = $(`center:contains("You've finished with this game!")`).text();
        prizeText = prizeText.substring(
            prizeText.lastIndexOf("You've finished with this game!") + 31,
            prizeText.lastIndexOf("Click Here to go Back")
        );
        console.log(prizeText)


        if ( prizeText.includes("Oh no! You didn't win anything, sorry!") || prizeText.includes("That's 3 blanks, you don't win a thing")) {
        //    scratchHistory += `<br><b>${currentTime}</b>: ${prizeText}`;
        } else {
            scratchHistory += `<br><b>${currentTime}</b>: <font color="red">${prizeText}</font>`;
        }
        GM_setValue('scratchHistoryKey',scratchHistory);

        window.location.href = "https://subeta.net/games/scratchcards.php";

    }
}

