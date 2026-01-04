// ==UserScript==
// @name         Aquifer autoclicker
// @namespace    http://tampermonkey.net/
// @version      2024-09-25
// @description  Helps medical students use their time efficiently. Safe, fast, free.
// @author       A student of knowledge
// @match        http*://uindiana-md.meduapp.com/document_set_document_relations/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511413/Aquifer%20autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/511413/Aquifer%20autoclicker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const startup_time = 5000
    setTimeout(() => runLoop(), startup_time)
})();

window.summary_statement_filled = false

function runLoop(){
    const debounce_min_time = 1000
    autoScrollToPageBottom()
    if(!isSummaryStatementPresent() && !isFeedbackFormPresent()){
        console.log("clicking")
        clickSubmitButtons()
        if(isASubmitButtonPresent()){
            setTimeout(runLoop, debounce_min_time)
        }
    }
    if(isSummaryStatementPresent() && window.summary_statement_filled && !isFeedbackFormPresent()){
        console.log("clicking")
        clickSubmitButtons()
        if(isASubmitButtonPresent()){
            setTimeout(runLoop, debounce_min_time)
        }
    }
    if(hasReachedEnd()){
        console.log("All done, congrats!")
    }
    else{
        if(window.summary_statement_filled){
            console.log("clicking after summary")
            clickSubmitButtons()
            if(isASubmitButtonPresent()){
                setTimeout(runLoop, debounce_min_time)
            }
        }
        if(isFeedbackFormPresent()){
            rate5Star()
            clickSubmitButtons()
            setTimeout(runLoop, debounce_min_time)
        }
        if(isSummaryStatementPresent() && !window.summary_statement_filled){
            alert("Fill out the text box and submit an answer, then complete the summary statement to continue the autoclicker. It will be faster if you choose not to use AI feedback submission.")
            continueLoopOnAIFormSubmit()
        }



    }
}

function summaryStatementFilled(){
    return document.querySelector("textarea").disabled
}

function autoScrollToPageBottom(){
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

function continueLoopOnAIFormSubmit(){
    console.log("Ai loop submit")
    for(let i of document.querySelectorAll(".aq-button-2")){
        i.onclick = () => {
            window.summary_statement_filled = true
            runLoop()
        }
    }
}

function hasReachedEnd(){
    return document.querySelector(".finish-card-summary-body") != null
}

function clickSubmitButtons(){
    for(let i of document.querySelectorAll(".doc-button")){
        i.click()
    }
}
function isASubmitButtonPresent(){
    return document.querySelector(".doc-button") != null
}

function isFeedbackFormPresent(){
    return document.querySelector("[id*=feedback_card]") != null
}

function isSummaryStatementPresent(){
    return document.querySelector(".summary_statement_question .doc-text-input textarea") != null
}

function rate5Star(){
    Array.from(document.querySelectorAll(".feedback_card")).map(x => x.querySelectorAll(".doc-rating-bar-star"))[0][0].click()
}