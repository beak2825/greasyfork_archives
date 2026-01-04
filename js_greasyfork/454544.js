// ==UserScript==
// @name         Animixplay Fast Forward
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a button to fast forward by a large amount to skip openings
// @match        https://plyr.link/p/player.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animixplay.to
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454544/Animixplay%20Fast%20Forward.user.js
// @updateURL https://update.greasyfork.org/scripts/454544/Animixplay%20Fast%20Forward.meta.js
// ==/UserScript==

let seconds = 85
// New button with the same style
let newFastForward = `<button id="new-fast-forward" class="plyr__controls__item plyr__control" type="button" data-plyr="fast-forward">
<svg aria-hidden="true" focusable="false"><use xlink:href="/assets/lib/plyr3.6.9.svg#plyr-fast-forward"></use></svg>
<span class="plyr__tooltip">Forward ${seconds}s</span>
</button>`

//Observe changes to the DOM
const observer = new MutationObserver((mutationsList, observer) => {
    let fastForward = document.querySelector('#videocontainer > div > div.plyr__controls > button:nth-child(3)')
    //keep trying until found
    if(fastForward){
        fastForward.insertAdjacentHTML('afterend', newFastForward)
        //Click listener
        document.getElementById('new-fast-forward').addEventListener('click', () => {
            document.querySelector('video').currentTime += seconds
        })
        observer.disconnect() //once
    }

})

observer.observe(document, {subtree:true, childList:true, attributes:true})
