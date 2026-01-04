// ==UserScript==
// @name         Morgan Likes To Cheat In DHM
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  weeeeeeeeeeeeeeeeeeeeeeeeeee
// @author       Me
// @match        https://diamondhunt.app/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449937/Morgan%20Likes%20To%20Cheat%20In%20DHM.user.js
// @updateURL https://update.greasyfork.org/scripts/449937/Morgan%20Likes%20To%20Cheat%20In%20DHM.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function init() {
        // set some globally accessable values
        window.ANWIN = {
            enabled: false, // if it's turned on
            tryingExplore: null, // if we're trying to explore
            tryingFight: null, // if we're trying to fight
            fights: 0, // number of fights we started this exploration
            // destroy function is just for my easy testing
            destroy: function() {
                clearInterval(window.ANWIN.interval);
                $("#anwins-side-bar").remove();
            }
        };

        // some data
        const ZONES = {
            fields: { energy: 50, keys: 0 },
            forests: { energy: 250, keys: 0 },
            caves: { energy: 1000, keys: 0 },
            volcano: { energy: 5000, keys: 0 },
            northernFields: { energy: 8000, keys: 0 },
            hauntedMansion: { energy: 20000, keys: 0 },
            desert: { energy: 50000, keys: 0 },
            ocean: { energy: 120000, keys: 0 },
            jungle: { energy: 200000, keys: 0 },
            dungeonEntrance: { energy: 500000, keys: 0 },
            dungeon: { energy: 1000000, keys: 1 },
            castle: { energy: 3000000, keys: 999 },
            cemetery: { energy: 7000000, keys: 999 },
            factory: { energy: 10000000, keys: 999 },
            hauntedWoods: { energy: 14000000, keys: 999 },
            deepOcean: { energy: 20000000, keys: 999 },
        };

        // string to int, but ignoring fancy stuff like commas
        function parseFancyInt(s) {
            s = s.toUpperCase();
            let multiplier = 1;
            if(s.endsWith("K")) {
                multiplier = 1000;
            }
            else if(s.endsWith("M")) {
                multiplier = 1000000;
            }
            else if(s.endsWith("B")) {
                multiplier = 1000000000;
            }
            else if(s.endsWith("T")) {
                multiplier = 1000000000000;
            }
            return multiplier*parseInt( s.replace(/\D+/g, "") || '0' );
        }

        let body = $("body");
        body.append(`
		<div id="anwins-side-bar" style="border: 1px solid black; border-right: 0; background: white; color: black; position: fixed; top: 0; right: 0;">
			<div id="anwins-side-bar-max" style="min-width: 250px; min-height: 120px;">
				<div style="cursor: pointer; border: 1px solid black; width: 1.2em;" onclick="$('#anwins-side-bar-max').hide(); $('#anwins-side-bar-min').show();">&rarr;</div>
				<div style="text-align: center; margin: 6px 2px;">
					<button type="button" id="anwin-start-fighting" onclick="ANWIN.enabled=true; $('#anwin-start-fighting').hide(); $('#anwin-stop-fighting').show();">START AUTO FIGHT</button>
					<button type="button" id="anwin-stop-fighting" style="display: none" onclick="ANWIN.enabled=false; $('#anwin-stop-fighting').hide(); $('#anwin-start-fighting').show();">STOP AUTO FIGHT</button>
				</div>
				<div style="text-align: center; margin: 6px 2px;">
					<select id="anwin-zone-select">
						<option>fields</option>
						<option>forests</option>
						<option>caves</option>
						<option>volcano</option>
						<option>northernFields</option>
						<option>hauntedMansion</option>
						<option>desert</option>
						<option>ocean</option>
						<option>jungle</option>
						<option>dungeonEntrance</option>
						<option>dungeon</option>
                        <option>castle</option>
                        <option>cemetery</option>
                        <option>factory</option>
                        <option>hauntedWoods</option>
                        <option>deepOcean</option>
					</select>
				</div>
				<div id="anwin-status-enabled" style="text-align: center; margin: 6px 2px;"></div>
				<div id="anwin-status-food" style="text-align: center; margin: 6px 2px;"></div>
				<div id="anwin-status-keys" style="text-align: center; margin: 6px 2px;"></div>
				<div id="anwin-status-cooldown" style="text-align: center; margin: 6px 2px;"></div>
                <div id="anwin-status-fights" style="text-align: center; margin: 6px 2px;"></div>
                <div id="anwin-status-fighting" style="text-align: center; margin: 6px 2px;"></div>
			</div>
			<div id="anwins-side-bar-min" style="display: none; width: 1.2em; height: 1.2em;">
				<div style="cursor: pointer; border: 1px solid black; width: 1.2em;" onclick="$('#anwins-side-bar-min').hide(); $('#anwins-side-bar-max').show();">&larr;</div>
			</div>
		</div>
	    `);

        // gets run every second
        const intervalF = function() {

            try {
                // check if trying done got fucked
                let tryingExploreSeconds = window.ANWIN.tryingExplore ? (new Date().getTime()-window.ANWIN.tryingExplore.getTime())/1000 : -1;
                let tryingFightSeconds = window.ANWIN.tryingFight ? (new Date().getTime()-window.ANWIN.tryingFight.getTime())/1000 : -1;
                if(tryingExploreSeconds >= 30) {
                    // reset
                    console.log("RESET tryingExplore");
                    window.ANWIN.tryingExplore = null;
                }
                if(tryingFightSeconds >= 30) {
                    // reset
                    console.log("RESET tryingFight");
                    window.ANWIN.tryingFight = null;
                }
                tryingExploreSeconds = window.ANWIN.tryingExplore ? (new Date().getTime()-window.ANWIN.tryingExplore.getTime())/1000 : -1;
                tryingFightSeconds = window.ANWIN.tryingFight ? (new Date().getTime()-window.ANWIN.tryingFight.getTime())/1000 : -1;

                // is it enabled
                let enabled = window.ANWIN.enabled;

                // tell me if it's enabled
                $("#anwin-status-enabled").text(enabled ? "AUTO FIGHT ENABLED" : "AUTO FIGHT DISABLED");

                // what zone is selected
                let zone = $("#anwin-zone-select").val();
                let zoneInfo = ZONES[zone];

                // if something fucky
                if(!zoneInfo){
                    $("#anwin-status-enabled").text("ZONE ERROR");
                    return;
                }

                // how much food/energy/whatev
                let food = parseFancyInt($('[data-item-display="energy"]').first().text());
                let foodLabel = `ENERGY: ${food.toLocaleString()} : ${food>=zoneInfo.energy ? 'OKAY' : 'NOT ENOUGH'}`;
                $("#anwin-status-food").text(foodLabel);

                // how many dungeon keys we gots
                let keys = parseFancyInt($("#item-box-amount-dungeonKey").first().text());
                let keyLabel = `DUNGEON KEYS: ${keys.toLocaleString()} : ${keys>=zoneInfo.keys ? 'OKAY' : 'NOT ENOUGH'}`;
                $("#anwin-status-keys").text(keyLabel);

                // how many reset pots we got
                let resetPotions = parseFancyInt($("#item-box-amount-resetFightingPotion").first().text());

                // grab the cooldown label to see if we're still exploring. It doesn't get updated perfectly so gotta fuck with it a bit.
                let cooldown = $('#explorer-cooldown-label').text();
                if(cooldown) {
                    cooldown = cooldown.trim();
                }

                // is cooldown ok? i.e. can we explore again
                let cooldownOkay = false;
                if(!cooldown) { // if it's blank (right after login), we're good to go
                    cooldownOkay = true;
                }
                // otherwise see if we have <= 5 seconds left
                else if(/^\d+:\d+ .*?$/.test(cooldown)) {
                    let t = cooldown.split(" ")[0];
                    t = t.split(":");
                    let h = parseInt(t[0]);
                    let m = parseInt(t[1]);
                    if(h==0 && m <= 5) {
                        cooldownOkay = true;
                    }
                }

                // tell me what it is
                let cooldownLabel = `COOLDOWN: ${cooldown}  ${cooldownOkay ? (window.ANWIN.tryingExplore ? 'TRYING' : 'READY') : 'NOT READY'}`;
                $("#anwin-status-cooldown").text(cooldownLabel);

                let fights = window.ANWIN.fights;
                let fightsLabel = `FIGHTS: ${fights} RESETS: ${resetPotions}`;
                $("#anwin-status-fights").text(fightsLabel);

                $("#anwin-status-fighting").text("FIGHTING: NOT READY");

                // not enabled? fuck off
                if(!enabled) return;

                // if we're not trying to explore and cooldown is ok
                if(!window.ANWIN.tryingExplore && cooldownOkay) {
                    window.ANWIN.tryingExplore = new Date();

                    // in just over 5s, run this
                    setTimeout(function() {
                        // if still enabled
                        if(window.ANWIN.enabled) {
                            // tell server to explore
                            console.log("EXPLORE="+zone);
                            sendBytes("EXPLORE="+zone);
                            // reset fight count
                            window.ANWIN.fights = 0;
                        }

                        // in 1.5s, unset tryingExplore (might take some time for server to reply so this avoids trying twice each time)
                        setTimeout(function() {
                            window.ANWIN.tryingExplore = null;
                        }, 1500);
                    }, 5200);
                }

                // show what we're fighting in status thing
                let monster = $("#img-tag-monster").attr('src').replace(/^images\//, "").replace(/\.\w+$/, "").trim();
                $("#anwin-status-fighting").text(window.ANWIN.tryingFight ? "Trying..." : `FIGHTING: ${monster}`);

                // if we were trying to fight and are now fighting, increment fight count and reset tryingFight
                if(window.ANWIN.tryingFight && monster!="none") {
                    window.ANWIN.fights++;
                    window.ANWIN.tryingFight = null;
                }

                // monster is not set to "none" and the combat tab is visible
                let isFighting = monster!="none" && $("#tab-combat").is(":visible");

                // can we start a new fight
                let canFight = !window.ANWIN.tryingFight && !cooldownOkay && !isFighting && ( fights==0 || (fights==1 && resetPotions>0) );

                // ok
                if(canFight) {
                    window.ANWIN.tryingFight = new Date();
                    if(fights==1 && resetPotions>0) {
                        console.log('DRINK=resetFightingPotion');
                        sendBytes('DRINK=resetFightingPotion');
                        setTimeout(() => {
                            console.log("LOOK_FOR_FIGHT");
                            sendBytes("LOOK_FOR_FIGHT");
                        }, 1500);
                    }
                    else {
                        console.log("LOOK_FOR_FIGHT");
                        sendBytes("LOOK_FOR_FIGHT");
                    }

                }

            }
            catch(err) {
                console.log("ANWIN: interval failed", err);
            }
        };

        intervalF();
        window.ANWIN.interval = setInterval(intervalF, 1000);
    }

    $(function() {
        try {
            init();
        }
        catch(err) {
            console.log("ANWIN: init failed", err);
        }
    });

})();