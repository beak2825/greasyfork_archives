// ==UserScript==
// @name         speedrun timer (death%)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  stop time alive percicely
// @author       Marlis
// @match        https://takepoint.io/
// @icon         https://www.google.com/s2/favicons?domain=takepoint.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426476/speedrun%20timer%20%28death%25%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426476/speedrun%20timer%20%28death%25%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let foot = document.getElementById("footers");
    let play = document.getElementById("p");
    let timer;
    let gTime, rTime; //gameTime (lag dependend), realTime
    let pB = 10000; //in milliseconds, just to have a starting value. Can be adjusted
    let attemps = 0;

    let observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation){
            if(mutation.type == "attributes"){
                if(document.getElementById("footers").style.display == "flex"){
                    stopTimer(); //stops timer on death
                }
            }
        });
    });
    observer.observe(foot, {
        attributes: true //configure it to listen to attribute changes
    });

    setTimeout(function(){ //to give the page time to load
        play.onclick = function(){eg(); restartTimer();}; //restart the timer when the play-button is pressed
    }, 5000);



    function restartTimer(){
        gTime = 0;
        rTime = new Date().getTime(); //get starting time
        clearInterval(timer);
        timer = setInterval(function(){ //restart the timer function
            let elem = document.getElementById("show_global");
            if(elem){
                elem.innerHTML = gTime + "</br>Personal best: " + pB/1000 + "</br>attemps: " + attemps;
            }
            else{
                createHUD();
            }
            gTime = ((gTime*10)+1) / 10; //to prevent rounding errors
            if(gTime*1000 > pB+2000){ //restart, when you pass 2 seconds afte your personal Best
                Module.switchServers("Frankfurt|tak-fra-pggcj.io-8.com"); //reload the page
                attemps++;
            }
        }, 100); //gTime updates every 100ms

    }

    function stopTimer(){
        clearInterval(timer);
        rTime = new Date().getTime() - rTime; //get the passed time
        attemps++;
        if(pB > rTime){ //if you got a new personal Best..
            pB = rTime;
            timer = setInterval(function(){ //shows the new time
                let elem = document.getElementById("show_global");
                if(elem){
                    elem.innerHTML = gTime + "</br> After re-time: " + rTime/1000;
                }
                else{
                    createHUD();
                }
            }, 1000);
        }
        else{ //else just restart
            restartTimer();
            Module.switchServers("Frankfurt|tak-fra-pggcj.io-8.com");
        }
    }

    function createHUD(){ //create the overlay to display the time, credits go to pureskillz (KiranV)
        let elem1 = document.createElement("div");
        //#overlay {display: block;z-index: 10;position: absolute;top: 50px; left: 10px;}
        elem1.id = "show_global";
        elem1.style.display = "block";
        elem1.style.zIndex = "10";
        elem1.style.position = "absolute";
        elem1.style.top = "50px";
        elem1.style.left = "10px";
        elem1.style.backgroundColor = "black";
        elem1.style.color = "white";
        document.body.appendChild(elem1);
    }

    // Your code here...
})();