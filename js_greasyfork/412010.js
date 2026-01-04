// ==UserScript==
// @name         Subeta: Auto Stealth Bomber
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.2
// @description  Automatically plays Stealth Bomber. Continues indefinitely. Remember to turn it off at some stage!
// @author       AyBeCee
// @match        https://subeta.net/games/stealth_bomber.php*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412010/Subeta%3A%20Auto%20Stealth%20Bomber.user.js
// @updateURL https://update.greasyfork.org/scripts/412010/Subeta%3A%20Auto%20Stealth%20Bomber.meta.js
// ==/UserScript==



var WinLogKey;
var WinLog = GM_getValue('WinLogKey',0);

const currentTime = $('#menu-time').text();
var newHistory;
var oldHistory = WinLog;
var totalHistory;

$('.container-fluid center').prepend("<button id='clearhistory'>Clear history</button>" + WinLog)





if ( $(`body:contains("Choose one of your opponent's cards to take:")`).length > 0 ) {

    // get all opponent's cards into an array
    var theirCards = [];
    $(" .container-fluid center a" ).each(function( index ) {
        theirCards.push($( this ).attr("href"));
    });

    // pick a random of their card
    var randomcard = Math.floor((Math.random() * theirCards.length));

    window.location.href = "?act=continue&card=" + randomcard;
    console.log(`Picked their card ${randomcard}`)
}


else if ( $(`body:contains("Choose a card below if you have a matching pair")`).length > 0 ) {

    // get the href of all the cards
    var ownedCards = new Array();
    $(" .container-fluid center a" ).each(function( index ) {
        ownedCards.push($( this ).attr("href"));
    });


    // https://stackoverflow.com/questions/22979762/jquery-check-if-array-contains-duplicate-string
    // checks for duplicates
    var recipientsArray = ownedCards.sort();

    var reportRecipientsDuplicate = [];
    for (var i = 0; i < recipientsArray.length - 1; i++) {
        if (recipientsArray[i + 1] == recipientsArray[i]) {
            console.log(recipientsArray[i]);

            window.location.href = "https://subeta.net/games/stealth_bomber.php" + recipientsArray[i];
            reportRecipientsDuplicate.push(recipientsArray[i]);
            break;
        }
    }

    // if there's no duplicates

    setTimeout(function(){
        if ( reportRecipientsDuplicate = [] ) {
            window.location.href = "?act=continue";
            console.log("No duplicates. Continuing...")
        };
    }, 2000);
}

else if ( $(`body:contains("Aw, better luck next time")`).length > 0 || $(`body:contains("That's a shame, but thanks for the money!")`).length > 0 || $(`body:contains("It's not a complicated game")`).length > 0 ) {

    newHistory = currentTime + ": Lost";
    console.log(newHistory)


    totalHistory = oldHistory + '<br>' + newHistory;
    GM_setValue('WinLogKey',totalHistory);
    location.reload();
}


else if ( $(`body:contains("Nice job. Must be beginner's luck!")`).length > 0 || $(`body:contains("Man, you are robbing me blind, here")`).length > 0 || $(`body:contains("Woah, you're not a card shark in disguise, are you?")`).length > 0 ||  $(`body:contains("Beginner's luck, obviously.")`).length > 0 ||  $(`body:contains("You have some serious skills.")`).length > 0 ) {

    newHistory = currentTime + ": Win";
    console.log(newHistory)

    totalHistory = oldHistory + '<br>' + newHistory;
    GM_setValue('WinLogKey',totalHistory);
    location.reload();

}


else if ( $(`body:contains("Want to play?")`).length > 0 ) {
    window.location.href = "?act=start";
}






$("#clearhistory").click(function(){
    GM_setValue('WinLogKey',"");
});


