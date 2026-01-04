// ==UserScript==
// @name         Filmweb Filmography Buttons
// @namespace    https://greasyfork.org/pl/users/636724-cml99
// @version      1.0.0
// @description  Dodaje bezpośrednie przyciski obejrzanych pozycji w filmografii na głównej stronie osoby.
// @description:en  Adds direct buttons for watched movies to filmography on main person page.
// @author       CML99
// @license      CC-BY-NC-SA-4.0
// @match        http*://www.filmweb.pl/person/*
// @exclude      http*://www.filmweb.pl/person/*/filmography*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @homepageURL  https://greasyfork.org/pl/scripts/536072-filmweb-filmography-buttons
// @supportURL   https://greasyfork.org/pl/scripts/536072-filmweb-filmography-buttons/feedback
// @downloadURL https://update.greasyfork.org/scripts/536072/Filmweb%20Filmography%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/536072/Filmweb%20Filmography%20Buttons.meta.js
// ==/UserScript==


var optionsNode = document.createElement ('div');
optionsNode.setAttribute ('id', 'optionsContainer');

var seenNode = document.createElement ('div');
seenNode.setAttribute ('id', 'seenContainer');
seenNode.innerHTML = '<button id="seenButton" type="button">' + 'Obejrzane</button>';

var wtsNode = document.createElement ('div');
wtsNode.setAttribute ('id', 'wtsContainer');
wtsNode.innerHTML = '<button id="wtsButton" type="button">' + 'Chcę zobaczyć</button>';

var unseenNode = document.createElement ('div');
unseenNode.setAttribute ('id', 'unseenContainer');
unseenNode.innerHTML = '<button id="unseenButton" type="button">' + 'Nieobejrzane</button>';


let filmographyList = document.querySelector(".personFilmographySection__nav .navList__container");
filmographyList.after(optionsNode);
optionsNode.appendChild(seenNode);
optionsNode.appendChild(unseenNode);
optionsNode.appendChild(wtsNode);


document.getElementById ("seenButton").addEventListener ("click", seenAction, false);
document.getElementById ("wtsButton").addEventListener ("click", wtsAction, false);
document.getElementById ("unseenButton").addEventListener ("click", unseenAction, false);


function seenAction (seenEvent) {
    var personUrl = window.location.href;
    window.location.href = personUrl + '/filmography#isee';
    // window.open(personUrl + '/filmography#isee', '_blank')
}

function wtsAction (wtsEvent) {
    var personUrl = window.location.href;
    window.location.href = personUrl + '/filmography#wts';
    // window.open(personUrl + '/filmography#wts', '_blank')
}

function unseenAction (unseenEvent) {
    var personUrl = window.location.href;
    window.location.href = personUrl + '/filmography#idontsee';
    // window.open(personUrl + '/filmography#idontsee', '_blank')
}


GM_addStyle ( `
    #seenContainer, #wtsContainer, #unseenContainer {
        font-size: 14px;
        display: inline;
    }
    #seenButton, #wtsButton, #unseenButton {
        cursor: pointer;
        margin: 8px 16px;
        padding: 2px 4px;
    }
    #seenButton:hover, #wtsButton:hover, #unseenButton:hover {
        color: #ecb505;
    }
` );
