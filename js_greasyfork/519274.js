// ==UserScript==
// @name         Beatport- disable autoplay; hide unrelated tracks; remove tracklist duplicates; auto-jump from start
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  stop autoplay, auto-jump over initial X seconds of track, and more
// @author       https://puvox.software
// @match        https://*.beatport.com/*
// @icon         https://www.google.com/s2/favicons?domain=beatport.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519274/Beatport-%20disable%20autoplay%3B%20hide%20unrelated%20tracks%3B%20remove%20tracklist%20duplicates%3B%20auto-jump%20from%20start.user.js
// @updateURL https://update.greasyfork.org/scripts/519274/Beatport-%20disable%20autoplay%3B%20hide%20unrelated%20tracks%3B%20remove%20tracklist%20duplicates%3B%20auto-jump%20from%20start.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hmsToSecondsOnly(str) {
        var p = str.split(':'),
            s = 0, m = 1;
        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }
        return s;
    }


    function checkFlag (uniqueFlagName, callback) {
        uniqueFlagName = 'bpt_flag_' + uniqueFlagName;
        const table = document.querySelector('[class*="Table-style__TableData"]');
        if (table) {
            const flagDiv = table.querySelector("." + uniqueFlagName);
            if (!flagDiv) {
                const newDiv = document.createElement("div");
                newDiv.classList.add(uniqueFlagName);
                table.appendChild(newDiv);
                callback();
            }
        }
    }




    // ############################### STOP AUTOPLAY ############################### //
    {
        const stopWithinSecondsLast = 2;

        let optName = 'stopautoplay3';
        const currentValue = GM_getValue(optName, 1);
        GM_registerMenuCommand("Disable autoplay", () => {
            const newValue = prompt("After current track ends, next track will not start [0/1]", GM_getValue(optName, 1));
            if (newValue !== null) {
                GM_setValue(optName, newValue);
                if (newValue) startInterval();
                else              endInterval();
            }
        });

        function checkStopNeeded() {
            // if (!currentValue) return;
            const playState = document.querySelector('[data-testid="player-control-pause_track"]');
            if (playState) {
                const currentTimeElement = document.querySelector('[data-testid="player-clock-played_time"]');
                const currentTimeSeconds = hmsToSecondsOnly(currentTimeElement.textContent);
                const fullTimeSeconds = hmsToSecondsOnly(currentTimeElement.nextSibling.textContent);
                if (fullTimeSeconds-currentTimeSeconds < stopWithinSecondsLast) {
                    try { playState.parentNode.click(); } catch(e){}
                }
            }
        }

        let intervalCheck;
        function startInterval () {
            intervalCheck = setInterval ( checkStopNeeded, 1000);
        }

        function endInterval () {
            clearInterval (intervalCheck);
        }

        if (currentValue > 0) {
            startInterval();
        }

    }
    // ################################################################# //






    // ############################# AUTO JUMP from start ############################# //
    {
        function attachPlayEvent() {
            document.querySelectorAll('[data-testid="play-button"]').forEach(e=> e.addEventListener("click", function(x) {
                setTimeout ( execJump, 2000);
            }));
        }

        let playerElement = undefined;
        function execJump () {
            // console.log("b1");
            const currentTimeElement = document.querySelector('[data-testid="player-clock-played_time"]');
            const fullTimeSeconds = hmsToSecondsOnly(currentTimeElement.nextSibling.textContent);
            const jumpSeconds = (fullTimeSeconds/100) * currentValue;
            playerElement = document.querySelector("#bp-player canvas");
            // console.log("b2: " + jumpSeconds);
            for (let i=0; i<jumpSeconds; i++) {
                simulateKeyEvent(playerElement, 'keydown', '.');
            }
        }

        function simulateKeyEvent(playerElement, type, key) {
            const event = new KeyboardEvent(type, {
                key: key,
                code: key,
                which: key.charCodeAt(0),
                keyCode: key.charCodeAt(0),
                charCode: key.charCodeAt(0),
                bubbles: true,
                composed: true,
                cancelable: true,
            });
            playerElement.dispatchEvent(event);
        }

        // option
        let optName = 'autojumpPercentage';
        const currentValue = GM_getValue(optName, 30);
        GM_registerMenuCommand("Autojump seconds from start", () => {
            const newValue = prompt("When tracks start playing, automatically skip first initial seconds (because start period of tracks can often be meaningless). Here you can set value from 0 to 100, which is percentage period of track to be skipped from the start", GM_getValue(optName, 30));
            if (newValue !== null) {
                GM_setValue(optName, newValue);
                if (newValue) startInterval();
                else          endInterval();
            }
        });


        let intervalCheck;
        function startInterval() {
            intervalCheck = setInterval(()=> checkFlag('autostart', attachPlayEvent), 4000);
        }

        function endInterval() {
            clearInterval(intervalCheck);
        }
        // document.addEventListener('readystatechange', event => { if (event.target.readyState === "complete") { // interactive
        if (currentValue > 0) {
            startInterval();
        }


    }
    // ####################################################################### //





    // ################### shadow-color beatport remixes #################### //
    {
        function checkCurrentTracks()
        {
            if ( location.href.includes('/artist') && location.href.includes('/tracks') )
            {
                let authorName = document.querySelectorAll('h1')[0].textContent; //location.href.match(/artist\/(.*?)\//)[1].replace(/&/g, '-').replace(/-/g, ' ');
                for( var x of document.querySelectorAll('[data-testid="tracks-table-row"] .cell.title .container > div:nth-child(2)') )
                {
                    if ( x && x.textContent && !x.textContent.includes(authorName) )
                    {
                        x.parentNode.parentNode.parentNode.style.background = "#000000";
                        x.parentNode.parentNode.parentNode.style.opacity = "1";
                    }
                }
            }
        }

        // option
        let optName = 'shadowbox_remixes';
        const currentValue = GM_getValue(optName, 1);
        GM_registerMenuCommand("Shadow color the remixes (on tracks page)", () => {
            const newValue = prompt("Shadow rows on tracks page, which are remixes of the artist (useful if you don't want to emphasize on that author's remixes) [0/1]", GM_getValue(optName, 1));
            if (newValue !== null) {
                GM_setValue(optName, newValue);
                if (newValue) startInterval();
                else          endInterval();
            }
        });

        const intervalSeconds=3;
        let intervalCheck;
        function startInterval() {
            intervalCheck = setInterval(()=> checkFlag('shadowremixes', checkCurrentTracks), intervalSeconds * 1000 );
        }

        function endInterval() {
            clearInterval(intervalCheck);
        }

        if (currentValue > 0) {
            startInterval();
        }
    }
    // ######################################################################### //







    // ####################### sremove duplicate tracks from "Tracks" page######################
    {
        const trackRowSelector = '[data-testid="tracks-table-row"]';
        function checkIfHideNeeded () {
            const randomTrack = document.querySelector(trackRowSelector);
            if (randomTrack) {
                hideDuplicateTracks();
            }
        }

		function getCurrentTracksOnPage(){
			const matches = location.href.match('per_page=(.*)?|$');
			const amountString = matches[1] || '25';
			return parseInt(amountString);
		}

		function hideDuplicateTracks () {
			const all = document.querySelectorAll(trackRowSelector + ' .cell.title');
			const values = Object.values(all).reverse();
			const allTitles = [];
			for(const el of values) {
				const title = el.textContent;
				if (!allTitles.includes(title)) {
					allTitles.push(title);
				} else {
					// delete el.parentNode.parentNode.removeChild(el.parentNode); // causes exception on beatport client-side
					// el.parentNode.style.background = 'red';
					el.parentNode.style.display = 'none';
				}
			}
		}

        // option
        let optName = 'shadowbox_remixes';
        const currentValue = GM_getValue(optName, 1);
        GM_registerMenuCommand("Hide duplicate tracks (on tracks page)", () => {
            const newValue = prompt("Duplicate tracks take unnecessary waste of your vision, you can hide them [0/1]", GM_getValue(optName, 1));
            if (newValue !== null) {
                GM_setValue(optName, newValue);
                if (newValue) startInterval();
                else          endInterval();
            }
        });

        const intervalSeconds = 3;

        let intervalCheck;
        function startInterval() {
            intervalCheck = setInterval(()=> checkFlag('remove_duplicate_tracks', checkIfHideNeeded), intervalSeconds * 1000 );
        }

        function endInterval() {
            clearInterval(intervalCheck);
        }

        if (currentValue > 0) {
            startInterval();
        }
    }
    // ######################################################################### //

})();