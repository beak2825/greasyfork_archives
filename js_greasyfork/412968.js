// ==UserScript==
// @name         Subeta: Auto Random
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1.1
// @description  Automatically plays Random.
// @author       AyBeCee
// @match        https://subeta.net/games/random.php*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412968/Subeta%3A%20Auto%20Random.user.js
// @updateURL https://update.greasyfork.org/scripts/412968/Subeta%3A%20Auto%20Random.meta.js
// ==/UserScript==


var currentTime = $('#menu-time').text();

var randomKey;
var random = GM_getValue('randomKey', 0);

$(`.container-fluid center:first`).append(random)
// Random
if ($('a.awesome.blue.large:contains("Play Random")').length > 0) {
    window.location.href = "https://subeta.net/games/random.php/play";
}

if (window.location.href.includes("/games/random.php/play") || $('body:contains("some cool ways to earn more?")').length > 0 || $('body:contains("to see what you can use it for!")').length > 0 ) {
    // winnings page
    var moneyAmount = $(".container-fluid center b").text();
    var itemName = "";
    if ( $("img.hover-item.tpd-delegation-uid-3").length > 0 ) {
        itemName = $("img.hover-item.tpd-delegation-uid-3").attr("alt");
    }
    console.log(moneyAmount)
    console.log(itemName)
    var winningsText = `<br>${currentTime}: ${moneyAmount} ${+ itemName}`;

    console.log(winningsText)

    random += winningsText;
    GM_setValue('randomKey', random);

    window.location.href = $("a:contains('Leave an Alert')").attr("href");

};


if ( $(`.container-fluid:contains('Oh no')`).length > 0 ) {
    var timeLeft;
    timeLeft = $(`.container-fluid center b:contains('seconds')`).text();
    var hours = parseInt( timeLeft.substring( 0, timeLeft.lastIndexOf(" hour") ) );
    var minutes = parseInt( timeLeft.substring( timeLeft.lastIndexOf(" minute") - 2, timeLeft.lastIndexOf(" minute") ) );
    var seconds = parseInt( timeLeft.substring( timeLeft.lastIndexOf(" second") - 2, timeLeft.lastIndexOf(" second") ) );

    var refreshTime = hours * 3600000 + minutes * 60000 + seconds * 1000;
    console.log( `refreshing in ${refreshTime} milliseconds or
    ${hours} hours
    ${minutes} minutes
    ${seconds} seconds
` )

    setTimeout(function(){
        window.location.href = "https://subeta.net/games/random.php";
    }, refreshTime);

}