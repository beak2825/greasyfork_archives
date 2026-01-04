// ==UserScript==
// @name         CleanerUI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  soapday ui cleanup
// @author       You
// @match        https://soap2day.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soap2day.to
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465872/CleanerUI.user.js
// @updateURL https://update.greasyfork.org/scripts/465872/CleanerUI.meta.js
// ==/UserScript==

const main = () => {
    const ScreenWidth = '65%'

    //remove the irrelevant sidebar on the side
    const sidebar = document.querySelector('.col-sm-4')
    sidebar.remove()

    // make video container 100%
    const main = document.querySelector('.col-sm-8')
    main.style.width = '100%'

    // make video centered
    const mainOuterBody = document.querySelector("body > div > div:nth-child(3) > div > div.col-sm-8 > div:nth-child(1)")
    mainOuterBody.style.display = 'flex'
    mainOuterBody.style.justifyContent = 'center'


    // set video width so that it fits on page
    const mainInnerBody = document.querySelector('.panel-body')
    mainInnerBody.style.width = ScreenWidth

    // darkify pages
    /*
    //gray color for dark mode
    const gray = '#35363a'
    const content = document.querySelector('.content')
    content.style.backgroundColor = gray
    mainOuterBody.style.backgroundColor = gray
    const seasonPanels = document.querySelectorAll('.alert-info-ex')
    seasonPanels.forEach((elem) => {
        elem.style.backgroundColor = gray
    })
    const footer = document.querySelector("body > footer > div")
    footer.remove()
    //set bG color of website to gray
    document.body.setAttribute("style", 'background: #35363a !important')
    */

    //remove alert message
    const alert = document.querySelector("body > div > div:nth-child(3) > div > div.col-sm-8 > div > div > div > div:nth-child(3) > div")
    alert.remove()

    //remove recommended section at very bottom of page
    const recommendedSection = document.querySelector("body > div > div:nth-child(3) > div > div.col-sm-8 > div:nth-child(2)")
    recommendedSection.remove()
}

const panelPlayer = document.getElementsByClassName('panel-player')
console.log(panelPlayer.length)

if (panelPlayer.length === 1) {
    console.log('running script')
    main()
} else {
    console.log('not running script')
}