// ==UserScript==
// @name         ChatGPT Benchmarking
// @namespace    http://tampermonkey.net/
// @version      2025-04-15
// @description  Script to automate benchmarking for LLM Agent UIs
// @author       You
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @license      IDO-Intl
// @downloadURL https://update.greasyfork.org/scripts/533623/ChatGPT%20Benchmarking.user.js
// @updateURL https://update.greasyfork.org/scripts/533623/ChatGPT%20Benchmarking.meta.js
// ==/UserScript==

(async function() {
    'use strict';


    // For recording, investigate https://medium.com/@anirudh.munipalli/create-a-screen-recorder-with-simple-javascript-114d0710e6bf

    /*TODO
    1. adapt to other providers (Hyperion...) that we want to benchmark. This will mainly involve just switching the selectors. Separate scripts can be made, or
    2. find a way to cycle through a list of utterances, probably with some kind of array input, and reloading the page between utterance
    3. find a way to save the output text in a csv format, both the text answer and the time taken
    4. find a way to record the screen (see above) and to save the recording, perhaps in an S3 bucket
    */
    
    
    function awaitElement(selector) {
        return new Promise((resolve) => {

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    console.log("found")
                    resolve();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    //wait for the search button to be blue, meaning the page is actually loaded
    await awaitElement('button[aria-label="Search"][aria-pressed="true"]')
    console.log("page loaded")


    //add timer
    const timer = document.createElement("div")
    timer.style.position = "absolute"
    timer.style.top = "50px"
    timer.classList.add("timer")
    timer.innerText = "0.0"

    document.querySelector(".draggable.no-draggable-children.top-0").appendChild(timer)

    //insert text
    const promptArea = document.getElementById("prompt-textarea")
    const textToTest = "who is obama"
    promptArea.innerHTML = textToTest

    //await search button
    await awaitElement("#composer-submit-button")

    // add listener to search button
    const searchButton = document.getElementById("composer-submit-button")
    let timerInterval
    searchButton.addEventListener("click", (e) => {
        const startMili = new Date().getTime()
        timerInterval = setInterval(() => {
            
            const now = new Date().getTime()
            timer.innerText = (now - startMili)/1000
            
        },1)
        })

    // start search
    searchButton.click()

    // await stop button, meaning we are writing a response
    await awaitElement("button[aria-label='Stop streaming']")
    console.log("generating answer")

    //await return of voice button, meaning we are ready for a new query
    await awaitElement("button[aria-label='Start voice mode']")
    clearInterval(timerInterval)
    console.log("stopped timer")









    await awaitElement('#composer-submit-button');




})();