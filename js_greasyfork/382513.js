// ==UserScript==
// @name         Chain watcher old
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Watch the chain
// @author       Jox [1714547]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382513/Chain%20watcher%20old.user.js
// @updateURL https://update.greasyfork.org/scripts/382513/Chain%20watcher%20old.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /************************************************************************************************************/
    /* BEGIN OF SCRIPT CONFIGURATION                                                                            */
    /************************************************************************************************************/

    //Time tiriger (set minutes and seconds)
    var minuteAlert = 2;
    var secundeAlert = 30;

    //Beep notification
    var beepAlert = true; //true for beep alerts, false to not beep alert
    var beepLength = 400; //duration of beep in milisenonds (set more then 50 and 100 less of alert interval value //Default value 400, less annoying value 50 combined with interval 1000
    var beepType = 0; //valid values 0,1,2,3 (0-sine, 1-square, 2-sawtooth, 3-triangle) //Default value 0
    var volume = 0.3; //0.5 is 50% volume, use 0.01 for really (1%) low volume and 1 for 100% volume

    //What color to display
    var colorAlert = 'rgba(255, 0, 0, 0.2)'; //color pitcker - https://htmlcolors.com/rgba-color //Default color rgba(255, 0, 0, 0.2), less annoying colour rgba(255, 180, 180, 0.2)

    //Alert interval
    var interval = 500; //time in miliseconts (1 secont = 1000 miliseconds) //Default setup 500, less annoying setup 1000, value over 2000 is not recomanded and that value is not that annoying

    /************************************************************************************************************/
    /* END OF SCRIPT CONFIGURATION                                                                              */
    /************************************************************************************************************/

    //Data validation
    if(interval < 150){
        interval = 150;
    }

    if(beepLength > interval - 100){
        beepLength = interval - 100;
    }

    if(beepLength < 10){
        beepLength = 10;
    }

    watchForChainTimer();

    function watchForChainTimer() {
        let target = document.getElementById('factions');
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let doApply = false;
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    //console.log(mutation.addedNodes.item(i));
                    if (document.querySelector('.chain-box-timeleft')) {
                        doApply = true;
                        //console.log('Have List of players');
                        break;
                    }
                    else{
                        //console.log('Not a List of players');
                    }
                }

                if (doApply) {
                    applyTracker();
                    observer.disconnect();
                }
            });
        });
        // configuration of the observer:
        //let config = { childList: true, subtree: true };
        let config = { childList: true, subtree: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    }


    function applyTracker(){
        var timer = document.querySelector('.chain-box-timeleft');

        alertMe();
    }

    function alertMe(){

        var chainInfo = document.querySelector('.chain-box-title');
        var timer = document.querySelector('.chain-box-timeleft');
        var data = timer.innerHTML.split(':');
        var blinkTarget = document.querySelector('.content');

        if(chainInfo.innerHTML == 'Chain active'){

            timer.style.backgroundColor = 'lime';
            timer.style.color = 'red';

            var currentTime = Number(data[0]) * 60 + Number(data[1]);
            var alertTIme = minuteAlert * 60 + secundeAlert;
            /*
            if(currentTime < alertTIme && currentTime > 0){
                if(blinkTarget.style.backgroundColor && blinkTarget.style.backgroundColor == colorAlert){
                    blinkTarget.style.backgroundColor = null;
                }
                else{
                    blinkTarget.style.backgroundColor = colorAlert;
                    if(beepAlert){
                        //beep(400, 2, function(){});
                        beep(beepLength, 2, function(){});
                    }
                }
            }
            else{
                blinkTarget.style.backgroundColor = null;
            }
            */
            if(currentTime < alertTIme && currentTime > 0){
                blinkTarget.classList.toggle('chainWatcherPing');

                if(blinkTarget.classList.contains('chainWatcherPing')){
                    blinkTarget.style.backgroundColor = colorAlert;
                    if(beepAlert){
                        //beep(400, 2, function(){});
                        beep(beepLength, beepType, volume, function(){});
                    }
                }
                else{
                    blinkTarget.style.backgroundColor = null;
                }
            }
            else{
                blinkTarget.classList.remove('chainWatcherPing');
                blinkTarget.style.backgroundColor = null;
            }
        }
        else{
            timer.style.backgroundColor = null;
            timer.style.color = null;
        }

        setTimeout(alertMe, interval);
    }

    var beep = (function () {
        var ctxClass = window.audioContext ||window.AudioContext || window.AudioContext || window.webkitAudioContext
        var ctx = new ctxClass();
        return function (duration, type, volume, finishedCallback) {

            duration = +duration;

            // Only 0-3 are valid types.
            type = (type % 4) || 0;

            var types = ['sine', 'square', 'sawtooth', 'triangle'];

            if (typeof finishedCallback != "function") {
                finishedCallback = function () {};
            }

            var osc = ctx.createOscillator();
            var gainNode = ctx.createGain();

            osc.type = types[type];
            gainNode.gain.value = volume || gainNode.gain.defaultValue;
            //osc.type = "sine";

            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start();

            setTimeout(function () {
                osc.stop();
                finishedCallback();
            }, duration);

        };
    })();
})();