// ==UserScript==
// @name         Blooket.Mod4(Fishing Frenzy)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Set how many lbs of fish you want in Fishing frenzy!
// @author       You
// @match        https://fishingfrenzy.blooket.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454417/BlooketMod4%28Fishing%20Frenzy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454417/BlooketMod4%28Fishing%20Frenzy%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
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
function bypass(){
    let _bypass = document.createElement("iframe");
    _bypass.style.display = 'none';
    document.body.appendChild(_bypass);
    return {window: _bypass.contentWindow, document: _bypass.contentDocument}
}
w = Number(bypass().window.prompt("Lbs?"))
getStateNode().setState({weight: w, weight2: w})
    
})();})()