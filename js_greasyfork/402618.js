// ==UserScript==
// @name         OnliTest Copy
// @version      5.2
// @description  Copy with OnliTest
// @author       Jet
// @match        *onlitest.it/studente/verifica/*
// @grant        none
// @namespace    OnliTest Copy
// @downloadURL https://update.greasyfork.org/scripts/402618/OnliTest%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/402618/OnliTest%20Copy.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    
    /******************************************/
    /*              CONFIGURATION             */
    /******************************************/
    /**/    var sendAlert = false;          /**/
    /**/    var minIntervalIndex = 15;      /**/
    /**/    var indexIncrementAmount = 450; /**/
    /**/    var intervalsToClear = 1000;    /**/
    /******************************************/

    var backSetInterval = setInterval;
    var latestInterval;
    var intervalsFired = new Array();
    
    var loadInt = setInterval(function(){
        if($("#time-bar")[0]){
            setTimeout(function(){
                setInterval = function(func, timeMs, args){
                    var innerIntId;
                    innerIntId = backSetInterval(func,timeMs);
                    latestInterval = innerIntId;
                    intervalsFired.push(innerIntId);
                    clearInterval(innerIntId);
                    //console.log("Cleared interval: " + innerIntId);
                    if(document.getElementsByTagName("app-non-altre-app")[0] && document.getElementsByTagName("app-non-altre-app")[0].getElementsByTagName("p")[0])
                        document.getElementsByTagName("app-non-altre-app")[0].getElementsByTagName("p")[0].innerHTML = "Continua pure a copiare, ho bloccato il timer (" + innerIntId + ")";
                    return innerIntId;
                }
                console.log("OnliTestC","I got your back, my friend");
                fullscreen(false);
            },1000)
            clearInterval(loadInt);
        }else{
            console.log("OnliTestC","No time-bar found, waiting to replace interval func");
        }
    },1000)
    
    function fullscreen(on) {
        var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null);
    
        var docElm = document.documentElement;
        if (on) {
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    /*var alertSent = false;
    var intervalsCleared = false;

    setTimeout(function(){
        document.body.addEventListener("DOMNodeInserted", clearAllIntervals);
    },1000);

    var precTimerValue = 6;
    var securityInterval = setInterval(function(){
        if(document.getElementsByTagName("app-non-altre-app")[0] && document.getElementsByTagName("app-non-altre-app")[0].getElementsByTagName("span")[0]){
            if(parseInt(document.getElementsByTagName("app-non-altre-app")[0].getElementsByTagName("span")[0].innerHTML) < precTimerValue){
                document.getElementsByTagName("app-non-altre-app")[0].getElementsByTagName("p")[0].innerHTML = "Stai attento cazzo";
                precTimerValue = parseInt(document.getElementsByTagName("app-non-altre-app")[0].getElementsByTagName("span")[0].innerHTML);
                //clearAllIntervals(precTimerValue);
            }

            if(parseInt(document.getElementsByTagName("app-non-altre-app")[0].getElementsByTagName("span")[0].innerHTML) == 2){
                clearAllIntervals(3);
                alert("Ultima speranza di salvarti dalla consegna automatica");
            }
        }
    },100)

    function clearAllIntervals(timerCheck = 5){
        if(!intervalsCleared){
            for(var i=minIntervalIndex; i<(intervalsToClear + minIntervalIndex); i++){
                if(i!=securityInterval)
                    clearInterval(i);
            }

            if(!alertSent && sendAlert){
                alert("Ho bloccato l'esecuzione della pagina, premi ok per riprendere la verifica. Nessuno si accorgerà di nulla ;)");
                alertSent = true;
            }else if(sendAlert){
                alertSent = false;
            }

            setTimeout(function(){
                if(document.getElementsByTagName("app-non-altre-app")[0]){
                    var currentTimerValue = parseInt(document.getElementsByTagName("app-non-altre-app")[0].getElementsByTagName("span")[0].innerHTML);

                    if( currentTimerValue < timerCheck){
                        minIntervalIndex += indexIncrementAmount;
                        clearAllIntervals(currentTimerValue);
                        console.log("devo incrementare");
                    }else{
                        document.getElementsByTagName("app-non-altre-app")[0].getElementsByTagName("p")[0].innerHTML = "Continua pure a copiare, ho bloccato il timer";
                    }
                }
            },1100);

            intervalsCleared = true;
        }else{
            intervalsCleared = false;
        }
    }*/


    
    /*function addEvent(obj, evt, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(evt, fn, false);
        }
        else if (obj.attachEvent) {
            obj.attachEvent("on" + evt, fn);
        }
    }
    addEvent(document, "mouseout", function(e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == "HTML") {
            alert("Ho bloccato l'esecuzione della pagina, premi ok per riprendere la verifica. Nessuno si accorgerà di nulla ;)");
        }
    });*/
})();