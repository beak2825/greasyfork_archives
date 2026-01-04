// ==UserScript==
// @name         Blooket.Mod2
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Get All blooks in blooket in the lobby to show off to your friends!
// @author       You
// @match        https://play.blooket.com/play/lobby*
// @match        *://*.blooket.com/*
// @match        *://blooket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/481195/BlooketMod2.user.js
// @updateURL https://update.greasyfork.org/scripts/481195/BlooketMod2.meta.js
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
function findByProp(p){
return Object.values(webpackJsonp.push([
    [], {
        ['']: (_, a, b) => {
            a.cache = b.c
        },
    },
    [
        ['']
    ],
]).cache).find((x)=>{
    if(x.exports&&x.exports.a&&x.exports.a[p])return x.exports.a
}).exports.a}
getStateNode().state.unlocks = Object.keys(findByProp("Astronaut"));
getStateNode().forceUpdate();
})();