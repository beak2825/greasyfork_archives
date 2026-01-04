// ==UserScript==
// @name         Proxima
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/loader.php?sid=viewPokerStats*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454483/Proxima.user.js
// @updateURL https://update.greasyfork.org/scripts/454483/Proxima.meta.js
// ==/UserScript==

function show(){
    const spa = `<span id="result" style="font-size: 22px; font-weight: 100;"></span>`;
    $('div.content-title > h4').append(spa);
    var netTotal = parseInt(document.querySelector("#your-stats > ul > ul > li.value").innerText.replace('$','').replaceAll(',',''));
    var legacyWon = parseInt(document.querySelector("#your-stats > ul > li:nth-child(13) > ul > li.stat-value").innerText.replace('$','').replaceAll(',',''));
    var legacyLost = parseInt(document.querySelector("#your-stats > ul > li:nth-child(14) > ul > li.stat-value").innerText.replace('$','').replaceAll(',',''));

    var customAmount = 0;

    var result = (netTotal + legacyWon - legacyLost + customAmount);

    $("#result").html(result.toLocaleString("en-US")).css('color', result >=0 ? 'green' : 'red');
}

(function() {
     if ($('div.content-title > h4').size() > 0 && $('#result').size() < 1) {
         show();
     }
    else{
        setInterval(show, 1000);
    }


    
})();