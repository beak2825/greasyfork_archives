// ==UserScript==
// @name         Crunchyroll Visited Hider
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Hide visited animes/links to more easily spot new shows
// @author       You
// @match        https://www.crunchyroll.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/454550/Crunchyroll%20Visited%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/454550/Crunchyroll%20Visited%20Hider.meta.js
// ==/UserScript==

function l(...args){
    console.log('[Visited]', ...args)
}

//Anime name
function name(target){
    return target.querySelector('.browse-card-static__title-link--EeNHn').text
}

function key(target){
    return `visited-${name(target)}`
}

//Observe changes to the DOM
const observer = new MutationObserver((mutationsList, observer) => {
    for(let mutation of mutationsList){
        let card = mutation.target
        //Filter for the relevant html element
        if(card.className == 'carousel-scroller__card--4Lrk-'){
            //Hide visited animes
            GM.getValue(key(card)).then(visited => {
                if(visited){
                    card.style.filter = 'brightness(0.1)'
                }
            })

            //Add to local storage (:visited can't be used in javascript only in css, and css can't select the parent of the a:visited element)
            mutation.target.addEventListener('click', () => {
                l(name(card), 'clicked')
                GM.setValue(key(card), true).then(() => l(`set ${key(card)}`))
            })
        }
    }
})

observer.observe(document, {subtree:true, childList:true, attributes:true})