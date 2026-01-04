// ==UserScript==
// @name      Sound for fussballcup AT
// @include  http://fussballcup.at/*
// @author   Sempervivum, mot33
// @version    0.1.8
// @description  Spielt verschiedene Sounds ab.
// @copyright Sempervivum, mot33 - 2018
// @grant       GM_addStyle
// @connect <value>
// @namespace https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/40017/Sound%20for%20fussballcup%20AT.user.js
// @updateURL https://update.greasyfork.org/scripts/40017/Sound%20for%20fussballcup%20AT.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle("#soundonoffbtn {cursor: pointer; width: 40px; height: auto;}");
    GM_addStyle("#header {position: relative;}");
    GM_addStyle("#soundonoffbtn {position: absolute; right: -25px; bottom: 0px;}");
    
   
    var audiogoal = document.createElement("audio");
    audiogoal.src = "https://open-mouthed-enviro.000webhostapp.com/Tor%20Tor%20Tor.mp3";

    var whistles = [
        "https://open-mouthed-enviro.000webhostapp.com/Anpfiff.mp3",
        "https://open-mouthed-enviro.000webhostapp.com/Halbzeitpfiff.mp3",
        "https://open-mouthed-enviro.000webhostapp.com/Abpfiff.mp3",
    ];
    var audiowhistles = [];
    whistles.forEach(function(item, idx) {
        var audiowhistle = document.createElement("audio");
        audiowhistle.src = whistles[idx];
        audiowhistles.push(audiowhistle);
    });
    
    var audiocash = document.createElement("audio");
    audiocash.src = "https://open-mouthed-enviro.000webhostapp.com/Cash%20Register.mp3";
    
    var audiofangesang = document.createElement("audio");
    audiofangesang.src = "https://open-mouthed-enviro.000webhostapp.com/small%20football%20crowd%20by%20FNC.mp3";
    audiofangesang.setAttribute("loop", true);
    
    var init = true, balance = 0, match = false, creating = false;
    var home = "", away = "";

    function getClub(part) {
        return document.querySelector("." + part + " h3 a").innerHTML;
    }
    function checkForMatch() {
        if (document.getElementById("match-messages")) {
            if (!match) {
                match = true;
                audiofangesang.play();
                creating = true;
                setTimeout(function () {
                    creating = false;
                }, 500);
                home = getClub("home");
                away = getClub("away");
                console.log(home, away);
            } else {
                if (getClub("home") != home || getClub("away") != away) {
                    // switched to another game
                    console.log("match switched");
                    creating = true;
                    setTimeout(function () {
                        creating = false;
                    }, 500);
                    home = getClub("home");
                    away = getClub("away");
                }
            }
        } else {
            match = false;
            audiofangesang.pause();
        }
    }
    
    function checkForWhistle() {
        var items = document.querySelectorAll("ul#match-messages .info");
        var iWhistle = items.length - 1;
        items.forEach(function(item, idx) {
            if (!item.classList.contains("whistledone")) {
                item.classList.add("whistledone");
                if (iWhistle < whistles.length) {
                    if (soundon && !creating) audiowhistles[iWhistle].play();
                }
            }
       });
    }
    
    function checkForGoal() {
        var items = document.querySelectorAll("ul#match-messages li");
        items.forEach(function(item, idx) {
            if (item.classList.contains("goal") && !item.classList.contains("goaldone")) {
               item.classList.add("goaldone");
               if (soundon && !creating) audiogoal.play();
            }
       });
    }
    
    function checkForCash() {
        var cbalance = document.querySelector("#information-balance .currency-number");
        if (cbalance) {
            if (init) {
                init = false;
                balance = cbalance.innerHTML;
            } else {
                var newbalance = cbalance.innerHTML;
                if (newbalance != balance) {
                    balance = newbalance;
                    if (soundon) audiocash.play();
                    console.log("balance changed", cbalance.innerHTML);
                }
            }
        }
        else console.log("nobalance");
    }
    
    function checkForSounds() {
        checkForMatch();
        checkForWhistle();
        checkForGoal();
        checkForCash();
    }
    
    var soundonoffbtn = document.createElement("img");
    soundonoffbtn.id = "soundonoffbtn";
    soundonoffbtn.src= "https://mot96.lima-city.de/sound/speaker_on.png";
    header.appendChild(soundonoffbtn);

    var soundon = true;
    soundonoffbtn.addEventListener("click", function() {
        if (soundon) {
            soundon = false;
            audiofangesang.pause();
            soundonoffbtn.src= "https://mot96.lima-city.de/sound/speaker_off.png";
        } else {
            soundon = true;
            if (match) audiofangesang.play();
            soundonoffbtn.src= "https://mot96.lima-city.de/sound/speaker_on.png";
        }
    });

    var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
            eventListenerSupported = window.addEventListener;

        return function(obj, callback){
            if( MutationObserver ){
                // define a new observer
                var obs = new MutationObserver(function(mutations, observer){
                    // if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                        callback();
                });
                // have the observer observe foo for changes in children
                obs.observe( obj, { characterData: true, childList:true, subtree:true });
            }
            else if( eventListenerSupported ){
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        };
    })();

    //observeDOM(document.getElementById('content'), checkForSounds);
    observeDOM(document.body, checkForSounds);
     /*setInterval(function() {
                    audiowhistle.src = whistles[iWhistle];
                    if (soundon && !creating) audiowhistle.play();
    }, 5000);*/
})();