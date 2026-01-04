// ==UserScript==
// @name         Chinese Zero To Hero subtitles
// @namespace    https://greasyfork.org/users/125127
// @version      1.0
// @description  Reposition and restyle subtitles to enable them to be visible and text-selectable
// @author       @teacup
// @match        https://player.hotmart.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teachable.com
// @downloadURL https://update.greasyfork.org/scripts/445606/Chinese%20Zero%20To%20Hero%20subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/445606/Chinese%20Zero%20To%20Hero%20subtitles.meta.js
// ==/UserScript==
 
(function() {
    'use strict'
 
    let target = document.querySelector('.vjs-text-track-display')
 
    // Create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            let subtitle = target.querySelector('.vjs-text-track-cue div')
 
            if (subtitle) {
                let text = subtitle.innerHTML
                handleNewSubtitle(text)
                subtitle.parentElement.removeChild(subtitle)
            }
        }
      });
    });
 
    var config = { attributes: true, childList: true, characterData: true }
    observer.observe(target, config)
 
    // Build a new subtitle overlay
    function makeSubtitleOverlay(subtitleText) {
        let subtitleDiv = document.createElement("div")
        subtitleDiv.classList.add('new-subtitle')
        let subtitleContent = document.createTextNode(subtitleText)
        subtitleDiv.appendChild(subtitleContent)
        setNewSubtitleOverlayStyle(subtitleDiv)
 
        let mainBody = document.getElementById("__next")
        document.body.insertBefore(subtitleDiv, mainBody)
    }
 
    // Style the overlay (JS, sorry)
    function setNewSubtitleOverlayStyle(element) {
        element.style.backgroundColor = 'black'
        element.style.borderRadius = '5px'
        element.style.color = 'white'
        element.style.fontSize = '25px'
        element.style.height = 'fit-content'
        element.style.padding = '8px'
        element.style.position = 'absolute'
        element.style.left = '50%'
        element.style.top = '0px'
        element.style.transform = 'translateX(-50%)'
        element.style.width = 'fit-content'
        element.style.zIndex = '1'
    }
 
    // Create or update the new subtitle overlay
    function handleNewSubtitle(subtitleText) {
        let newSubtitle = document.querySelector('.new-subtitle')
 
        // If subtitle doesn't already exist
        if (!newSubtitle) {
            // ...then create it and add it to the DOM
            makeSubtitleOverlay(subtitleText)
        } else {
            // ...otherwise update text property
            newSubtitle.textContent = subtitleText
        }
    }
})();