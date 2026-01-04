// ==UserScript==
// @name         Enote
// @version      0.1.3.1
// @description  Unhide answers at enotes website
// @author       z0xyz
// @match        https://www.enotes.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @namespace https://greasyfork.org/users/813029
// @downloadURL https://update.greasyfork.org/scripts/439173/Enote.user.js
// @updateURL https://update.greasyfork.org/scripts/439173/Enote.meta.js
// ==/UserScript==

function showFirstAnswer(){
    let firstAnswerDivs = document.getElementsByClassName('c-answer__body').item(0).getElementsByTagName('div')
    for (let i=0 ; i<firstAnswerDivs.length ; i++ ){
        let firstDivClass = firstAnswerDivs.item(i).classList.item(0)
        if ( firstDivClass != null && firstDivClass.slice(0,1) == '_' ){
            firstAnswerDivs.item(i).classList = ['none']
        }
    }
}

function showRestOfTheAnswers(){
    let answerLength = document.getElementsByClassName('c-answer__body').length
    for (let i=1 ; i<answerLength ; i++){
        document.getElementsByClassName('c-answer__body').item(i).firstElementChild.classList = ['none']
    }
}

function unblurArticles(){
    let divElements = document.getElementsByTagName('div')
    for (let i=0; i<divElements.length; i++){
        let currentDivElement = divElements.item(i)
        if (currentDivElement.className.slice(0,1) == '_'){
            currentDivElement.className = ''
        }
    }
}
try{
    showFirstAnswer()
    showRestOfTheAnswers()

}catch{
    console.log("This page isn't of answers type")
}
try{
    unblurArticles()
}catch{
    console.log("This page isn't of articles type")
}