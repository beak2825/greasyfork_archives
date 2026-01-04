// ==UserScript==
// @name         auto unready
// @description  auto unready when calls are holding
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       Jacob Gantz
// @match        https://max.niceincontact.com/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462922/auto%20unready.user.js
// @updateURL https://update.greasyfork.org/scripts/462922/auto%20unready.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var amountHold = document.getElementsByClassName("phone-inbound-queue");
    var state = document.getElementsByClassName("state-item-template");
    var available = document.getElementsByClassName("skill-queue available");
    var recentlyChanged = false;
    let pausing = false;
    var intervalDelay = 4000;
    var pauseDelay = generateRandomInteger(4000,5000);
    var z;
    var x;
    var totalAvailabile = document.getElementsByClassName("skill-queue available");
    var totalAvailabileValues = [];
    var count = 0;

    let find = null;

    var delay = ( function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    delay(function(){
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "name";
        checkbox.value = "value";
        checkbox.id = "addedcheckbox";
        checkbox.classList.add("save-cb-state");
        document.getElementsByClassName('empty-personal-queue')[0].appendChild(checkbox);
        z = document.createElement('p'); // is a node
        z.innerHTML = 'test satu dua tiga';
        z.id="fdsa";
        x = document.createElement('p'); // is a node
        x.innerHTML = 'test satu dua tiga';
        x.id="fdsa";
        document.getElementById("coBrandingSection").appendChild(z);
        document.getElementById("coBrandingSection").appendChild(x);
        document.getElementById("addedcheckbox").checked = true;
    }, 8000); // end delay

    function checkHold() {
        count++;
        if(count>8){
            document.getElementsByClassName("phone-inbound-set queue-set")[0].click();
            delay(function(){
                console.log("closing window");
                document.getElementsByClassName("popover-panel active-queue-panel")[0].className = "popover-panel active-queue-panel hidden";
                 }, 500);
            count=0;
        }
        if (amountHold[0].innerHTML >= 1) {
            console.log("there is a call holding, get into unavailable");
            state[12].click();
            pausing=true;
            var d = new Date();
            var n = d.toLocaleTimeString();
            z.innerHTML="was ready for "+document.getElementsByClassName("timer")[0].innerHTML+" at "+ n;
            console.log("was ready for "+document.getElementsByClassName("timer")[0].innerHTML);
            pauseDelay = generateRandomInteger(420000,660000);
            x.innerHTML="pausing for "+millisToMinutesAndSeconds(pauseDelay);
            console.log("pausing for "+millisToMinutesAndSeconds(pauseDelay));
            return true;

        } else {
            pausing=false;
            //console.log("no calls holding anymore");
            document.getElementsByClassName("state")[0].click();
            return false;
        }
    }

    function generateRandomInteger(min, max) {
        return Math.floor(min + Math.random()*(max - min + 1))
    }
    function millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    function validate() {
        var remember = document.getElementById("addedcheckbox");
        if (remember.checked) {
            return true;
        } else {
            return false;
        }
    }

    function isHidden(el) {
    return (el.offsetParent === null)
}


    function intervalFunc() {
        if(document.getElementsByClassName("current-out-state")[0].innerHTML=="Refused"){
            state[11].click();
        }
        if ((document.getElementsByClassName("current-out-state")[0].innerHTML=="Working with Customer"||document.getElementsByClassName("current-state")[0].innerHTML=="Available")&&validate()) {
            checkHold();
            //console.log("conditions are met");
            clearInterval(find);
            setTimeout(function() {
                find = setInterval(intervalFunc, intervalDelay);
            }, pauseDelay - intervalDelay);

            if(!isHidden(document.getElementsByClassName("popover-panel active-queue-panel")[0])){
                console.log("no longer hidden");
                for(let i=0;i<document.getElementsByClassName("skill-queue available").length;i++){
                    totalAvailabileValues[i] = document.getElementsByClassName("skill-queue available")[i].innerHTML;
                }
                 if(totalAvailabileValues.includes('0')){
                    state[12].click();
                     console.log("no one available in queue");
                    setTimeout(function() {
                        find = setInterval(intervalFunc, intervalDelay);
                    }, pauseDelay - intervalDelay);
            }
        }
        else
        {
            //console.log("conditions are not met "+validate());
        }
    }
    }
    find = setInterval(intervalFunc, intervalDelay);
})();