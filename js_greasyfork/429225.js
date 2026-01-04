// ==UserScript==
// @name         RONCEPOURPRE - Sauvegarder son post
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  trying to save orphee from herself. Lets you save your posts on Roncepourpre to load them later.
// @author       .1019
// @match        https://roncepourpre.forumactif.com/*
// @icon         https://www.google.com/s2/favicons?domain=forumactif.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429225/RONCEPOURPRE%20-%20Sauvegarder%20son%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/429225/RONCEPOURPRE%20-%20Sauvegarder%20son%20post.meta.js
// ==/UserScript==

// créer cette fucking fonction
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// récupérer le textArea
let textArea = document.querySelector('.sceditor-container textarea');

if(textArea) {

    // faire le style des deux boutons
    var styles = `
    .textButtons {
        position: absolute; padding: 0.5em !important; right: -85px; width: 50px; height: 50px; cursor: pointer; background: #e1baff; border: 1px solid #A326FF; border-radius: 100%; display: grid;
    }

    .textButtons img {
        margin: auto; width: 60%;
    }

    #saveButton {
        top: 0;
    }

    #loadButton {
        bottom: 0;
    }

    #saveButton:active, #loadButton:active {
        box-shadow: inset 2px 2px 5px #00000040;
    }
`

    var styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)

    // créer le bouton de sauvegarde
    let saveButton = document.createElement("div");
    saveButton.setAttribute("class", "textButtons")
    saveButton.setAttribute("id", "saveButton");
    saveButton.innerHTML = "<img src='https://i.imgur.com/FdNddt6.png' title='APPUIE SUR CE BOUTON OUBLIE PAS PTN' />";

    insertAfter(saveButton, textArea);

    document.getElementById("saveButton").addEventListener("click", function() {
        if(confirm('Le RP va être sauvegardé.')) {
            localStorage["textRP"] = textArea.value;
            console.log('Le RP a été sauvegardé.');
        } else {
            console.log('Le RP n\'a pas été sauvegardé.');
        }
    });

    let loadButton = document.createElement("div");
    loadButton.setAttribute("class", "textButtons")
    loadButton.setAttribute("id", "loadButton");
    loadButton.innerHTML = "<img src='https://i.imgur.com/nEyJpAg.png' title='tas encore fait ta connerie dont you' />";

    insertAfter(loadButton, textArea);

    document.getElementById("loadButton").addEventListener("click", function() {
        if(confirm('La sauvegarde du RP va être chargée.')) {
            textArea.value = localStorage["textRP"];
        } else {
            console.log('La sauvegarde du RP n\'a pas été chargée.');
        }
    });
}