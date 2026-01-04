// ==UserScript==
// @name         Blooket Anti-Crash + Anti-Bot
// @namespace    http://tampermonkey.net/
// @version      Nrzt
// @description  Stops crasher skids
// @author       generic
// @match        https://*.blooket.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491291/Blooket%20Anti-Crash%20%2B%20Anti-Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/491291/Blooket%20Anti-Crash%20%2B%20Anti-Bot.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function noCrash() {
        var crashFire = document.querySelector('img[src="https://media.blooket.com/image/upload/v1677550882/Banners/fire.svg"]');
        var crashRainbow = document.querySelector('img[src="https://ac.blooket.com/marketassets/blooks/rainbowastronaut.svg"]');
 
        if (crashFire) {
            // dont click fire
            // crashFire.click();
        }
 
        if (crashRainbow) {
            crashRainbow.click();
        }
    }
 
    function reactHandler() {
        return Object.values(document.querySelector('#app>div>div'))[1].children[0]._owner;
    }
 
    var bannedbots = [];
 
    function skiddetector() {
        reactHandler().stateNode.props.liveGameController.getDatabaseVal("c").then(e => {
            if(e){
                window.e = e;
                var fa = Object.keys(e).filter(e=>parseInt(e.split("").reverse().join("")));
                fa.forEach(e=>{bannedbots.forEach(a=>{if(e.includes(a)){reactHandler().stateNode.props.liveGameController.blockUser(e);}})})
                var chb = checkForBots(Object.keys(e));
                if(chb.length>0){
                    console.log(chb);
                    chb.forEach(f=>{Object.keys(e).filter(a=>a.includes(f)).forEach(d=>{reactHandler().stateNode.props.liveGameController.blockUser(d);})});
                }
                for (var i in e) {
                    if(i==="constructor"){reactHandler().stateNode.props.liveGameController.blockUser(i);}
                    if (e[i].rt) {
                        reactHandler().stateNode.props.liveGameController.blockUser(i);
                    }
                    if (i.includes("sahar")){
                        reactHandler().stateNode.props.liveGameController.removeVal("c/"+i);
                    }
                }
            }
        });
    }
 
    function detectAlphaNumeric(str) {
        const alphaRegex = /[a-zA-Z]+/;
        const numericRegex = /\d+/;
        const alphaPart = str.match(alphaRegex)[0];
        const numericPart = str.match(numericRegex)[0];
        return [alphaPart, numericPart];
    }
 
    function check(array,amt) {
        const occurrences = {};
        const result = [];
        for (let str of array) {
            occurrences[str] = (occurrences[str] || 0) + 1;
            if (occurrences[str] >= amt && !result.includes(str)) {
                result.push(str);
            }
        }
        return result.length > 0 ? result : null;
    }
 
    function checkForBots(names){
        var n = names.filter(e=>parseInt(e.split("").reverse().join()));
        if(n.length>0){
            var t = n.map(e=>detectAlphaNumeric(e)[0]);
            var ch = check(t,2);
            if(ch){
                if(ch.length>0){
                    console.log(ch);
                    ch.forEach(f=>{
                        if(bannedbots.indexOf(f)===-1){
                            bannedbots.push(f);
                        }
                        n.filter(a=>a.includes(f)).forEach(d=>{
                            reactHandler().stateNode.props.liveGameController.removeVal("c/"+d);
                        })
                    });
                }
            }
        }
        return [];
    }
 
    setInterval(noCrash, 1);
    setInterval(skiddetector, 1);
})();