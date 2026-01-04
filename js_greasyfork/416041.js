// ==UserScript==
// @name         NotDS chess.com ad killer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  11/16/2020 - kills chess.com ads, older downloadable scripts are failing to do so it seems.
// @author       NotDS
// @match        https://*.chess.com/*
// @match        http://*.chess.com/*
// @downloadURL https://update.greasyfork.org/scripts/416041/NotDS%20chesscom%20ad%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/416041/NotDS%20chesscom%20ad%20killer.meta.js
// ==/UserScript==

 var myVar = setInterval(myTimer, 1000);

function myFunction() {

    for(let source of document.body.getElementsByTagName("iframe")){if(source.id.includes("google")){source.hidden = true;}}
    for (let dodo of document.body.getElementsByClassName("placeholder-ad-upgrade")){dodo.remove();}
    for (let poopoo of document.body.getElementsByClassName("sidebar-ad")){poopoo.remove();}
    for (let ish of document.body.getElementsByClassName("main-ad-component")){ish.remove();}
    for (let bs of document.body.getElementsByClassName("game-over-ad-component")){bs.remove();}

}


function myTimer() {
    for(let source of document.body.getElementsByTagName("iframe")){if(source.id.includes("google")){source.hidden = true;}}
    for (let dodo of document.body.getElementsByClassName("placeholder-ad-upgrade")){dodo.remove();}
    for (let poopoo of document.body.getElementsByClassName("sidebar-ad")){poopoo.remove();}
    for (let ish of document.body.getElementsByClassName("main-ad-component")){ish.remove();}
    for (let bs of document.body.getElementsByClassName("game-over-ad-component")){bs.remove();}


}


function myStopFunction() {
  clearInterval(myVar);
}

(function() {
    'use strict';

    window.addEventListener('load', function() {
    console.log('All assets are loaded');
        document.body.getElementsByTagName("iframe")[0].addEventListener("change", myFunction);
    });

})();
