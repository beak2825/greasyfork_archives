// ==UserScript==
// @name         Blooket.Mod3(crypto)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Get every password in crypto correct!
// @author       You
// @match        https://play.blooket.com/play/hack*
// @match        *://*.blooket.com/*
// @match        *://blooket.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @License      MIT
// @downloadURL https://update.greasyfork.org/scripts/453664/BlooketMod3%28crypto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453664/BlooketMod3%28crypto%29.meta.js
// ==/UserScript==

(function(){
    function getStateNode(){
    for(let i of Object.keys(document.querySelector("#app>div>div"))){
        if(i.toString().includes("__reactEventHandlers")){
            for(let p of Object.values(document.querySelector("#app>div>div")[i].children.filter(n=>n))){
                if(p._owner&&p._owner.stateNode)return p._owner.stateNode
            }
        }
    }
}
    window.setInterval(()=>{
        try{
            Array.from(document.querySelectorAll("div")).find(n=>n.innerText===getStateNode().state.correctPassword).click()}
        catch{
            
        }
    },10);
})();