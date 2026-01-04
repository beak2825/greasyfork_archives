// ==UserScript==
// @name         Dragonrip Server Time
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Server time display for Dragonrip.com
// @author       Kronos1
// @match         *://*.dragonrip.com/*
// @icon         https://i.imgur.com/Vn0ku7D.png
// @grant        none
// @license      GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/533554/Dragonrip%20Server%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/533554/Dragonrip%20Server%20Time.meta.js
// ==/UserScript==


(() => {
    'use strict';

    const settings = {
        clockLabel:"Server time",
        runningClock: true, // Keep updating clock time (updates every second)
        enableSeconds: false, // Include seconds in the time
        use24HourClock: true, // Toggle between 12h/24h time format
        fancyBox: false, // Additional styling for the time box element
       
    }
    
    const mainCss = `
        .dragonrip-server-time-cont > * {
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            user-select:none;
        }

        .dragonrip-server-time-cont {
            border-radius:3px;
            float:right;
            display:flex;
            flex-direction:row;
            align-items:center;
            justify-content:space-between;
            background-repeat:repeat;
            background-size:contain;
            padding:3px 5px 3px 5px;
            font-size:0.8em;
            font-family:consolas,monospace;
            color:grey;
            text-shadow: 
                0px 0px 3px black,
                0px 0px 3px black,
                0px 0px 3px black,
                0px 0px 3px black,
                0px 0px 3px black,
                0px 0px 3px black,
                0px 0px 3px black
            ;
            position:absolute;
            bottom:0;
            right:0;
        }

        .dragonrip-server-time-cont > .label {
            margin-right:10px;
        }

        .dragonrip-server-time-cont > .time {
            color:#de6c09;
        }

        body > .logo {
            position:relative;
        }
    `;

    const fancyBoxCss = `    
        .dragonrip-server-time-cont {
            border:2px solid rgba(255,255,255,0.15);
            background-image: url('https://i.imgur.com/vjJ8ugC.jpeg');
            box-shadow:0px 0px 5px 0px rgba(0,0,0,0.5);
        }
    `;

    const getTime = () => {
        let options = {
            timeZone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }

        if (settings.enableSeconds) { options.second = 'numeric'; }
        if (settings.use24HourClock) { options.hour12 = false; }
        
        const currentLocalDate  = new Date (Date.now());
        const time = new Intl.DateTimeFormat([], options).format(currentLocalDate);
        return time;
    }


    const createClock = () => {
        const target = document.querySelector('body > div.logo');

        const elem = document.createElement('div');
        elem.classList.add('dragonrip-server-time-cont');
   
        // Create text label
        const label = document.createElement('div');
        label.classList.add('label');
        label.innerHTML = settings.clockLabel;

        // Create time
        const time = document.createElement('div');
        time.classList.add('time');
     
        elem.append(label);
        elem.append(time);
        target.append(elem);

        updateClock();
 
        if (settings.runningClock) {
            setInterval( () => {
                updateClock();
            }, 1000);
        }
    }

    const updateClock = () => {
        const elem = document.querySelector('body > .logo > .dragonrip-server-time-cont > .time');
        elem.innerText = getTime();
    }


    // Wait for game UI to load, then insert custom element
    const waitForElem = () => {
        const checkElem = setInterval( () => {
            if (document.querySelector('ul.navbar') !== null) {
                clearInterval(checkElem); 
                createClock();
            }
        }, 5);
    }


    const setCustomCss = str => {
        const styleElem = document.createElement("style");
        styleElem.textContent = str;
        document.body.appendChild(styleElem);
    }


    setCustomCss(mainCss);    
    if (settings.fancyBox) { setCustomCss(fancyBoxCss); }

    waitForElem();
})();
