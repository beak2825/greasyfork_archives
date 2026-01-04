// ==UserScript==
// @name         Quotes Filter - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      3
// @description  Hide quotes from ignored users.
// @author       hacker09
// @match        https://myanimelist.net/forum/?topicid=*
// @match        https://myanimelist.net/editprofile.php?go=forumoptions
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/446889/Quotes%20Filter%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/446889/Quotes%20Filter%20-%20MAL.meta.js
// ==/UserScript==
(function() {
    'use strict';
    if (location.href.match('topicid') === null) //If the user is on the forum settings page
    { //Starts the if condition
        setTimeout(function() {
            document.querySelectorAll("ul.ignored-user-list > li > a:nth-child(2)").forEach(el => GM_setValue(el.innerText, 'Ignored-User')); //Store each ignored user username on tampermonkey
        }, 0);
    } //Finishes the if condition

    if (location.href.match('topicid') !== null) //If the user is on a forum topic
    { //Starts the if condition
        var StoredUsersArray = []; //Creates a new blank array
        GM_listValues().forEach(a => StoredUsersArray.push('^' + a)); //Add all user names on tampermonkey to the array
        if (StoredUsersArray.length > 0) //Check if array is still blank
        { //Starts the if chondition
            const StoredUsersRegex = new RegExp(StoredUsersArray.join('|')); //Create a new variable and regex containing all the values saved on tampermonkey and replace the , separator with the or | regex symbol
            document.querySelectorAll("div.quotetext").forEach(function(el) { //Foreach quote
                if (el.innerText.match(StoredUsersRegex) !== null) //If the current quote matches any user name stored on tampermonkey
                { //Starts the if condition
                    el.remove(); //Remove the quote
                } //Finishes the if condition
            }); //Finishes the foreach condition
        } //Finishes the if condition
    } //Finishes the if condition
})();