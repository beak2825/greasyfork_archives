// ==UserScript==
// @name         Wordle Hack
// @version      4.0
// @description  If you really want to cheat at Wordle, this will tell you the answer -_-
// @author       Logzilla6
// @match        https://www.nytimes.com/games/wordle/*
// @icon         https://www.google.com/s2/favicons?domain=powerlanguage.co.uk
// @grant        none
// @namespace https://greasyfork.org/users/783447
// @downloadURL https://update.greasyfork.org/scripts/439166/Wordle%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/439166/Wordle%20Hack.meta.js
// ==/UserScript==

if (confirm("Would you like the answer to the Wordle?") == true) {

    var currentDate = new Date().toISOString().slice(0, 10);
    console.log(currentDate);

    let dataUrl = 'https://www.nytimes.com/svc/wordle/v2/'+currentDate+'.json';

    fetch(dataUrl)
        .then(res => res.json())
        .then(gameData => alert(gameData.solution))
}
