
// ==UserScript==
// @name         10ff speed hack
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  JS script to automate the input of characters at 10ff.net
// @author       z0xyz
// @match        https://10ff.net/*
// @run-at       document
// @downloadURL https://update.greasyfork.org/scripts/432054/10ff%20speed%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/432054/10ff%20speed%20hack.meta.js
// ==/UserScript==

function sleep(milliseocnds) {
    const date = Date.now()
    let currentDate
    do {
        currentDate = Date.now()
    } while ((currentDate - date) - milliseocnds)
}

function promptValueCheck() {
    desiredSpeedWpm = window.prompt('add the desired Speed Wpm')
    if (desiredSpeedWpm != null && typeof(desiredSpeedWpm*1) == "number") {
        return (true)
    }else {
        return (false)
    }
}

function addWord() {
    try {
        let hightlightedWord = document.querySelector(".highlight").textContent
        let hWordLength = hightlightedWord.length

        for (let i = 0; i < hWordLength; i++) {
            inputField.value += hightlightedWord[i];
            inputField.dispatchEvent(newInputEvent);
            sleep(eachCharacterInterval)
        }
        inputField.value += " ";
        inputField.dispatchEvent(newInputEvent);
        inputField.value = ''
    }catch {
        clearInterval(intervalMethod)
    }
}

function checkSite() {
    if (promptValueCheck()) {
        let charactersCount = document.querySelector(".place").textContent.length
        let totalTypingTimeSec = (charactersCount /5) / desiredSpeedWpm*1
        eachCharacterInterval = Math.round((totalTypingTimeSec * 60000) / charactersCount)

        inputField = document.getElementsByTagName("input")[0]
        newInputEvent = new InputEvent("input")

        intervalMethod = setInterval(addWord, eachCharacterInterval)
    }
    else {
        console.log("No valid value was entered!")
    }
}

(() =>  {
    let overlayNode = document.getElementsByClassName('overlayer').item(0)
    let config = {
        subtree:true,
        characterData: true
    }

    layerObserver = new MutationObserver(mutated)

    function mutated(mutations){
        mutations.forEach(function(mutation){
            if ( mutation.target.wholeText == "false" ) {
                console.log("The contest is now opened!")
                checkSite()
            }
        })
    }

    layerObserver.observe(overlayNode , config)
})()