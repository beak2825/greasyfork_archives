// ==UserScript==
// @name         Wordle hack
// @namespace    shenburak.com
// @version      0.1
// @description  This script gives unlimited play in wordle every time the page is refreshed and prints the word of the day to the screen.
// @author       shenburak

// @match        *://www.nytimes.com/games/wordle*
// @match        *://*.nytimes.com/games/wordle*
// @match        *://nytimes.com/games/wordle*

// @match        *://www.bundle.app/wordle-tr*
// @match        *://*.bundle.app/wordle-tr*
// @match        *://bundle.app/wordle-tr*

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @license      GPLv3

// @downloadURL https://update.greasyfork.org/scripts/442404/Wordle%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/442404/Wordle%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const host = window.location.host
    const _ls=host.includes("bundle.app")?localStorage.gameState:host.includes("nytimes.com")&&localStorage["nyt-wordle-state"]
    if(!_ls)return
    const ls=JSON.parse(_ls)

    let rfrsh=false
    if(ls.lastPlayedTs) rfrsh=true

    ls.lastCompletedTs=null
    ls.lastPlayedTs=null
    localStorage.setItem("gameState",JSON.stringify(ls))
    localStorage.setItem("nyt-wordle-state",JSON.stringify(ls))

    if(rfrsh) window.location.reload()
    if(!rfrsh) alert("Solution= "+ls.solution)
})();