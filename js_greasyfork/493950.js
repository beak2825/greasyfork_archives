// ==UserScript==
// @name         Icedrive keep going
// @version      0.2
// @match        https://icedrive.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icedrive.net
// @grant        none
// @license      MIT
// @description  simple script to keep changing tracks
// @namespace https://greasyfork.org/users/1012060
// @downloadURL https://update.greasyfork.org/scripts/493950/Icedrive%20keep%20going.user.js
// @updateURL https://update.greasyfork.org/scripts/493950/Icedrive%20keep%20going.meta.js
// ==/UserScript==

function onNodeInsertedOrRemoved(element, f){
    var contentObserver = new MutationObserver(f.bind(element));
    contentObserver.observe(element, { childList: true, subtree: true });
}

function onTreeModified(element, f){
    var contentObserver = new MutationObserver(f.bind(element));
    contentObserver.observe(element, { childList: true, characterData: true, subtree: true, attributes: true });
}

function checkIfFinished(mutationsList, observer){
    var text = this.innerText
    if(text.split("\n")[2] == "00:00"){
        setTimeout(() => {
            var plyr_button = document.getElementsByClassName("plyr__control")[0];
            if(plyr_button == undefined){
                return;
            }
            if(plyr_button.innerText == "Play"){
                console.log("Next track")
                observer.disconnect();
                document.getElementsByClassName("icon-chev-right-thin")[0].click();
            }
        }, 500);
    }
}

function playerIsClosing(mutationsList, observer){
    var audio = document.getElementsByClassName("audio-wrap")
    if(audio.length == 0){
        console.log("Player has closed")
        observer.disconnect();
        onNodeInsertedOrRemoved(this, playerIsOpening);
    }
}

function playerIsOpening(mutationsList, observer){
    var audio = document.getElementsByClassName("audio-wrap")
    if(audio.length == 0){
        return;
    }
    var controls = audio[0].getElementsByClassName("plyr__controls")
    if(controls.length){
        console.log("Player has opened")
        observer.disconnect();
        controls = controls[0];
        onNodeInsertedOrRemoved(this, playerIsClosing)
        onTreeModified(controls, checkIfFinished);
    }
}

(function() {
    setTimeout(() => {
        onNodeInsertedOrRemoved(document.getElementsByClassName("content")[0], playerIsOpening);
    }, 500);
})();