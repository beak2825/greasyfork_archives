// ==UserScript==
// @name         Woomy Rename
// @namespace    http://tampermonkey.net/
// @version      1.91
// @description  Have the option to pick a name upon respawning
// @author       Drako Hyena
// @match        https://woomy.surge.sh/
// @match        https://woomy-arras.netlify.app
// @match        https://www.woomy-arras.xyz/
// @grant        none
// @require      https://greasyfork.org/scripts/448888-woomy-modding-api/code/Woomy%20Modding%20Api.js?version=1082014
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448942/Woomy%20Rename.user.js
// @updateURL https://update.greasyfork.org/scripts/448942/Woomy%20Rename.meta.js
// ==/UserScript==
(function(){
    'use strict'
    // Wait for the api to load
    if(window.WMA&&window.WMA.loaded){
        run()
    }else{
        if(window.WMALoadQueue){
            window.WMALoadQueue.push(run)
        }else{
            window.WMALoadQueue = [run]
        }
    }

    // Once the api is loaded run this function
    function run(){
        let button = window.WMA.createButton("Change Name (on respawn)", "None", ()=>{
            let name = window.prompt("What should your new name be? (Leave blank for a random name)")
            if(name==="") name = Math.random().toString(36).substr(2, 7)
            button.children[1].innerHTML = name
            window.WMA.global.playerName = name
        })
        }
})();