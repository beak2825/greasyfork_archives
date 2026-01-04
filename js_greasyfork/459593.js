// ==UserScript==
// @name         Pikabu story tile posts hide voted
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide voted tile posts on Pikabu
// @author       You
// @match        https://pikabu.ru/story/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459593/Pikabu%20story%20tile%20posts%20hide%20voted.user.js
// @updateURL https://update.greasyfork.org/scripts/459593/Pikabu%20story%20tile%20posts%20hide%20voted.meta.js
// ==/UserScript==

const storyTiles = document.querySelector(".story-tiles")
window.addEventListener('scroll', autoHide)
storyTiles.addEventListener('click', hideByVote)

function hideByVote(event){
    if(event.target.classList.contains("story-tiles__tile-vote--active")){
        const stotyTile = event.target.closest(".story-tiles__tile.story")
        $(stotyTile).mouseleave( () =>{
            $(stotyTile).fadeOut(300, function() { $(this).remove() })
        })
    }
}

function autoHide(){
    let voteButtonActive = storyTiles.querySelector(".story-tiles .story-tiles__tile-vote--active")
    if(voteButtonActive){
        const stotyTile = voteButtonActive.closest(".story-tiles__tile.story")
        stotyTile.remove()
        autoHide()
    }
}
