// ==UserScript==
// @name         status setzen mit h
// @namespace    blablabla
// @version      69.69.69.69
// @description  wenn man h drückt, wird der status auf hand heben gesetzt, bzw zurückgesetzt; funzt auf deutsch und englisch
// @author       matze
// @match        https://*.videoconference.iserv.eu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421710/status%20setzen%20mit%20h.user.js
// @updateURL https://update.greasyfork.org/scripts/421710/status%20setzen%20mit%20h.meta.js
// ==/UserScript==

alert('Update: jetzt kann man sich mit g oder m muten/unmuten. sorra falls du das zweimal siehst')

//checkt welchen index das Hand heben in der span tag liste hat
function getRaise(){

    let spanTags = document.getElementsByTagName('span')

    let raiseIndex;

    for(let i = 0; i<spanTags.length;i++){
        if(spanTags[i].innerHTML.includes('Raise') || spanTags[i].innerHTML.includes('Hand heben')){
            raiseIndex = i
            break;
        }
    }
    return raiseIndex
}

//checkt welchen index der name bzw das (Sie) dahinter in der i tag liste hat
function getYou(){

    let youIndex;

    let iTags = document.getElementsByTagName('i')

    for(let i = 0; i<iTags.length;i++){
        if(iTags[i].innerHTML.includes('You') || iTags[i].innerHTML.includes('Sie') || iTags[i].innerHTML.includes('Du')){
            youIndex = i
            break;
        }
    }
    return youIndex;
}

//guckt welchen index das status zurücksetzen in der span tag liste hat
function getClear(){

    let clearIndex;

    let spanTags = document.getElementsByTagName('span')

    for(let i = 0; i<spanTags.length;i++){
        if(spanTags[i].innerHTML.includes('Clear status') || spanTags[i].innerHTML.includes('Status zurücksetzen')){
            clearIndex = i
            break;
        }
    }
    return clearIndex;
}

//guckt welchen index das status setzen in der span tag liste hat
function getSet(){

    let setIndex

    let spanTags = document.getElementsByTagName('span')

    for(let i = 0; i<spanTags.length;i++){
        if(spanTags[i].innerHTML.includes('Set status') || spanTags[i].innerHTML.includes('Status setzen')){
            setIndex = i
            break;
        }
    }
    return setIndex
}

function setStatus(){
    //klickt den eigenen namen
    document.getElementsByTagName('i')[getYou()].click()
    //klickt auf status setzen
    document.getElementsByTagName('span')[getSet()].click()
    //klickt auf hand heben
    document.getElementsByTagName('span')[getRaise()].click()
}

//guckt ob ein status aktiv ist
function getIfStatusActive(){

    let statusActive

    if(getClear()){
        statusActive = true
    }

    return statusActive
}

//set den status zurück
function clearStatus(){

    document.getElementsByTagName('span')[getClear()].click()
}

window.addEventListener('keydown', function(e){

    //verhindert dass der status auch geändert wird wenn man in den chat schreibt
    if (document.activeElement.type == 'text' || document.activeElement.type == 'password' || document.activeElement.type == 'textarea') {
        return;
    }

// falls h gedrückt wird
    else if(e.keyCode == 72){
        //falls es einen status gibt, setze ihn zurück
        if(getIfStatusActive()){
            clearStatus()
        }else{
            // ansonsten setze den status (aus raise / hand heben)
            setStatus()
        }
    }else if(e.keyCode == 71 || e.keyCode == 77){
    let muteButton = document.getElementsByClassName('icon--2q1XXw icon-bbb-unmute')[0] || document.getElementsByClassName('icon--2q1XXw icon-bbb-mute')[0]
    muteButton.click()
    }
})