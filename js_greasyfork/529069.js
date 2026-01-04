// ==UserScript==
// @name         Auto HI
// @namespace    http://tampermonkey.net/
// @version      2025-06-05
// @description  Automatically adding "Hi, " into chat
// @author       You
// @match        https://chatgpt.com/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529069/Auto%20HI.user.js
// @updateURL https://update.greasyfork.org/scripts/529069/Auto%20HI.meta.js
// ==/UserScript==

function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    {
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}

function AutoHI(){
    let inputPlace = document.querySelector("#prompt-textarea")
    const ChatID = window.location.pathname;
    if (inputPlace && inputPlace.textContent.length===0 && document.querySelector("div.markdown") === null && ChatID.length < 16) {
        inputPlace.textContent = "Привет, ";
        setEndOfContenteditable(inputPlace);
    }
}
setInterval(AutoHI, 250)