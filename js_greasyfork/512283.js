// ==UserScript==
// @name         No accidental google meeting raise hand
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds preventive measures to ensure you do not raise your hand in a meeting by mistake, now when the button to raise hand is clicked a browser popup will open to ask if you really want to do it, it also adds a checkbox on the bottom right that makes the raise hand button hidden.
// @author       Fernando (https://github.com/Fernando-R)
// @match        https://meet.google.com/*
// @icon         https://www.brandeis.edu/its/_files/google-meet-logo.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512283/No%20accidental%20google%20meeting%20raise%20hand.user.js
// @updateURL https://update.greasyfork.org/scripts/512283/No%20accidental%20google%20meeting%20raise%20hand.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hasRun = false
    const setUp = () =>{
        const raiseHandButton = document.getElementsByClassName('p2SYhf')?.[0]
        const raiseHandElement = raiseHandButton?.parentElement?.parentElement

        if(!raiseHandElement){
            setTimeout(setUp, 1000)
            return
        }
        let isHandRaised = false;
        raiseHandElement.addEventListener("click",(event)=>{
            if(isHandRaised){
                isHandRaised = false
            }else{
                event.preventDefault()
                const response = confirm('Do you really want to raise your hand?')
                if(response){
                    isHandRaised = true
                }else{
                    event.stopPropagation()
                }
            }
        })

        const toggleButton = document.createElement("input");
        toggleButton.setAttribute('type', 'checkbox')

        const toggleButtonHolder = document.createElement("span");
        toggleButtonHolder.setAttribute('data-is-tooltip-wrapper','true')
        toggleButtonHolder.appendChild(toggleButton)
        const toggleButtonHolderHolder = document.createElement("div");
        toggleButtonHolderHolder.appendChild(toggleButtonHolder)
        const toggleButtonHolderHolderHolder = document.createElement("div");
        toggleButtonHolderHolderHolder.appendChild(toggleButtonHolderHolder)
        const toggleButtonHolderHolderHolderHolder = document.createElement("div");
        toggleButtonHolderHolderHolderHolder.appendChild(toggleButtonHolderHolderHolder)

        const isActive = localStorage.getItem("isRaiseHandButtonActive");
        if(isActive === 'false'){
            raiseHandElement.style.display = 'none'
        }else{
            toggleButton.checked = true
        }

        const toggleRaiseHandButton = () =>{
            if(toggleButton.checked){
                raiseHandElement.style.display = 'block'
                localStorage.setItem("isRaiseHandButtonActive", "true");
            }else{
                raiseHandElement.style.display = 'none'
                localStorage.setItem("isRaiseHandButtonActive", "false");
            }
        }
        toggleButton.addEventListener("click",toggleRaiseHandButton)

        document.getElementsByClassName('tMdQNe')[0].appendChild(toggleButtonHolderHolderHolderHolder);
    }

    setUp()
})();