// ==UserScript==
// @name         Microsoft Teams Status Token Grabber
// @namespace    ricardocolom
// @version      0.1
// @license      MIT
// @description  This script adds a Copy Status Token button to the Microsoft Teams app bar at the top.
// @author       You
// @match        https://teams.microsoft.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hibbard.eu
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/456296/Microsoft%20Teams%20Status%20Token%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/456296/Microsoft%20Teams%20Status%20Token%20Grabber.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

function onCopyButtonClick() {

    const items = {...localStorage}

    var myToken = ""

    Object.keys(items).forEach(key => {
        if(key.contains("cache.token.https://presence.teams"))
        {
            myToken = JSON.parse(items[key]).token
        }
    })

    navigator.clipboard.writeText(myToken)
}

function addCopyButton(){

    const appTopPowerBar = document.querySelector('.app-top-power-bar')
    const tsSearchOuter = document.querySelector('.ts-search-outer')

    tsSearchOuter.style.width = "100%"
    tsSearchOuter.style.paddingRight = "20px"

    appTopPowerBar.style.display = "flex"
    appTopPowerBar.style.flexDirection = "row"
    appTopPowerBar.style.width = "100%"

    console.log(appTopPowerBar)

    const copyButton = document.createElement('button')
    copyButton.id = 'copyStatusTokenButton'
    copyButton.style.color = "white"
    copyButton.style.width = "200px"
    copyButton.style.borderRadius = "4px"
    copyButton.style.borderColor ='white'
    copyButton.style.borderWidth = "1px"
    copyButton.style.fontFamily = 'Segoe UI'
    copyButton.style.fontWeight = 'bold'
    copyButton.style.backgroundColor = '#444791'
    copyButton.addEventListener('mouseenter', function() {copyButton.style.backgroundColor = '#5b5fc7'})
    copyButton.addEventListener('mouseleave', function() {copyButton.style.backgroundColor = '#444791'})
    copyButton.appendChild(document.createTextNode('Copy Status Token'))

    copyButton.onclick = () => {onCopyButtonClick()}

    appTopPowerBar.appendChild(copyButton)
}

const observer = new MutationObserver(function() {
    if($('.app-top-power-bar').length > 0){
        addCopyButton()
        observer.disconnect()
    }
    console.log('Run')
})

const target = document.querySelector('body')

const config = {childList: true}

observer.observe(target, config)