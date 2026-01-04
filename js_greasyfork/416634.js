// ==UserScript==
// @name        Calculate Average - scrumpoker-online.org
// @namespace   Violentmonkey Scripts
// @match       https://www.scrumpoker-online.org/*
// @grant       none
// @version     1.0
// @author      JasperV <jasper@vanveenhuizen.nl>
// @description 20/11/2020, 12:44:05
// @downloadURL https://update.greasyfork.org/scripts/416634/Calculate%20Average%20-%20scrumpoker-onlineorg.user.js
// @updateURL https://update.greasyfork.org/scripts/416634/Calculate%20Average%20-%20scrumpoker-onlineorg.meta.js
// ==/UserScript==

function initAverageCalc() {
    let p1 = document.createElement("p")
    p1.innerHTML = "aantal mensen: "
    let peopleSpan = document.createElement("span")
    peopleSpan.innerHTML = "?"
    p1.appendChild(peopleSpan)

    let p2 = document.createElement("p")
    p2.innerHTML = "gemiddelde: "
    let average = document.createElement("span")
    average.innerHTML = "?"
    p2.appendChild(average)

    let results = document.getElementsByClassName("results-content")[0]
    results.prepend(p1)
    results.prepend(p2)

    let button = document.createElement("button")
    button.innerHTML = "Calculate Average"

    button.addEventListener("click", function()
    {
        let elements = document.getElementsByClassName("mat-column-storyPoints")
        let people = 0
        let points = 0
        for(let i=0; i<elements.length; ++i)
        {
            let value = parseInt(elements[i].innerText, 10)
            if(typeof value != 'number' || isNaN(value)) {
                continue
            }
            people += 1
            points += value
        }
        peopleSpan.innerText = people
        average.innerText = points/people
    })

    document.getElementsByClassName("results-buttons")[0].appendChild(button)
}

function waitForElement() {
    let results = document.getElementsByClassName("results-content")[0]
    if(typeof results !== "undefined") {
        initAverageCalc()
    }
    else{
        setTimeout(waitForElement, 250)
    }
}
waitForElement()