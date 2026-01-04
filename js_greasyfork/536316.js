// ==UserScript==
// @name         Youtube Mobile Toggle Show Controls Overlay
// @version      1
// @grant        none
// @match        https://m.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @description  Adds a button below player to show/hide controls on hover
// @namespace    asleepysamurai.com
// @license      BSD Zero Clause License
// @downloadURL https://update.greasyfork.org/scripts/536316/Youtube%20Mobile%20Toggle%20Show%20Controls%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/536316/Youtube%20Mobile%20Toggle%20Show%20Controls%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const done = false

    function init(){
        const player = document.querySelector('.watch-below-the-player')
        if(!player){
            setTimeout(init, 300)
            return
        }

        let showingControls = true
        const button = document.createElement('button')
        button.addEventListener('click',()=>{
            document.querySelector('#player-control-container').setAttribute('style',`display:${showingControls? 'none':'inherit'} !important`);
            button.innerText = `${showingControls ? 'Hide': 'Show'} Controls`
            showingControls = !showingControls
        })
        button.innerText="Hide Controls"
        button.setAttribute('style','font-size:x-large;padding:10px 20px')

        player.before(button)
    }

    init();
})();