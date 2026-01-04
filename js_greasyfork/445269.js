// ==UserScript==
// @name         Reformat F95 game pages URLs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reformat F95 game pages URLs so the blue star showing the page is already bookmarked is still shown even if game updates
// @author       lifeAnime / Yhria
// @match        https://f95zone.to/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445269/Reformat%20F95%20game%20pages%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/445269/Reformat%20F95%20game%20pages%20URLs.meta.js
// ==/UserScript==

function find_text_not_capsuled(str){
    let i = 0;
    let new_str = "";

    while (i < str.length){
        if (str[i] == '['){
            while (i < str.length && str[i] != ']'){
                i++;
            }
            i++;
        }
        if (/\S/.test(str[i])){
            while (i < str.length && str[i] != '['){
                if (i + 1 < str.length && str[i + 1] == '[' && str[i] == ' '){
                    ;}
                else if (str[i] == ' '){
                    new_str += '-'}
                else{
                    new_str += str[i];}
                i++;
            }
            return new_str;
        }
        i++;
    }
}

(function() {
    'use strict';

    let url = window.location.href;
    let regexp = /(https:\/\/f95zone\.to)(\/threads\/)([^.]+)(\.[0-9]+)(.*)/
    let match = url.match(regexp)
    let game_name = find_text_not_capsuled(document.getElementsByClassName("p-title-value")[0].textContent)
    let new_url = match[2] + game_name.toLowerCase() + match[4] + match[5]

    console.log(match)
    console.log(new_url)
    history.pushState({}, null, new_url);
})();