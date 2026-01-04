// ==UserScript==
// @name         Woomy Mouse Movement
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Have the option to move with your mouse
// @author       Drako Hyena
// @match        https://woomy.surge.sh/
// @match        https://woomy-arras.netlify.app
// @match        https://www.woomy-arras.xyz/
// @grant        none
// @require      https://greasyfork.org/scripts/448888-woomy-modding-api/code/Woomy%20Modding%20Api.js?version=1082014
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/449028/Woomy%20Mouse%20Movement.user.js
// @updateURL https://update.greasyfork.org/scripts/449028/Woomy%20Mouse%20Movement.meta.js
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
        let interval = null;
        let button = window.WMA.createButton("Mouse Movement", "off", ()=>{
            if(interval!==null){
                clearInterval(interval)
                interval = null
            }
            if(button.children[1].innerHTML === "off"){
                button.children[1].innerHTML = "on"
                interval = setInterval(()=>{
                    console.log(window.WMA.yourPlayer.position.x-window.WMA.yourPlayer.target.x)
                    window.WMA.move.to(window.WMA.yourPlayer.position.x+window.WMA.yourPlayer.target.x, window.WMA.yourPlayer.position.y+window.WMA.yourPlayer.target.y, 30)
                },10)
            }else{
                button.children[1].innerHTML = "off"
            }
        })
        }
})();