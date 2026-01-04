// ==UserScript==
// @name         DH3 FP Notification
// @namespace    com.anwinity.dh3
// @version      1.0.9
// @description  Adds fight points notification
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418431/DH3%20FP%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/418431/DH3%20FP%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FP_COSTS = {
        fields: 900,
        forest: 1800,
        caves: 3600,
        lavaDungeon: 5400,
        northernFields: 7200,
        cemetery: 9000,
        ocean: 10800,
        dungeon: 13200,
        dungeonHole: 25000
    };

    const MAP_IDS = {
        fields: 1,
        forest: 2,
        caves: 2,
        lavaDungeon: 3,
        northernFields: 4,
        cemetery: 8,
        ocean: 10,
        dungeon: 16,
        dungeonHole: 17
    }

    const scope = {
        area: "fields"
    };

    function loadPreferences() {
        let area = localStorage.getItem("fp-notificiations.area") || "fields";
        scope.area = area;
        $("#fp-area").val(scope.area);
    }

    function savePreferences() {
        localStorage.setItem("fp-notificiations.area", scope.area);
    }

    function gotoArea() {
        if(scope.area == "full") {
            return;
        }
        clicksItem("fightMonsterButton");
        changeCombatMap(MAP_IDS[scope.area]);
    }

    function fpNeeded() {
        if(scope.area == "full") {
            return parseInt(window.var_maxFightPoints);
        }
        let base = FP_COSTS[scope.area];
        let p = 1;
        if(window.var_cooldownRing1 == "1") {
            p -= 0.01;
        }
        if(window.var_cooldownRing2 == "1") {
            p -= 0.04;
        }
        if(window.var_cooldownRing3 == "1") {
            p -= 0.10;
        }
        if(window.var_cooldownRing4 == "1") {
            p -= 0.15;
        }
        return Math.ceil(base*p);
    }

    function initUI() {
        const styles = document.createElement("style");
        styles.textContent = `
        span#notification-fightPoints {
          position: relative;
        }
        span#notification-fightPoints > #fp-area {
          position: absolute;
          bottom: 1px;
          right: 1px;
          margin: 0px;
          padding: 2px;
          background-color: rgba(1,1,1,0);
          border: 0px solid rgba(1,1,1,0);
          color: white;
        }
        span#notification-fightPoints > #fp-area > option {
          background-color: rgba(102, 0, 0, 0.9);
        }
        `;
        $("head").append(styles);

        $("#notification-questsStarted").after(`
        <span id="notification-fightPoints" class="notification-red"">
        	<img src="images/fightPoints.png" class="img-50">
        	<span id="fp-timer"></span>
            <img id="fp-potion-active" src="images/combatCooldownPotion.png" style="height: 1em; display: none" title="Combat Cooldown Potion is active"></img>
        	<select id="fp-area">
        	    <option value="fields">Fields</option>
        	    <option value="forest">Forest</option>
        	    <option value="caves">Caves</option>
        	    <option value="lavaDungeon">Lava</option>
        	    <option value="northernFields">N Fields</option>
        	    <option value="cemetery">Cemetery</option>
        	    <option value="ocean">Ocean</option>
        	    <option value="dungeon">Dungeon</option>
                <option value="dungeonHole">Dung. Hole</option>
                <option value="full">Full FP</option>
        	</select>
        </span>
        `);

        $("#notification-fightPoints").click(function() {
            gotoArea();
        });
        let areaSelect = $("span#notification-fightPoints > #fp-area");
        areaSelect.click(function(e) {
            e.stopPropagation();
        });
        areaSelect.change(function() {
            let area = $(this).val();
            scope.area = area;
            savePreferences();
            updateUI(window.var_fightPoints);
        });
    }

    function updateUI(fp) {
        if(typeof fp === "string") {
            fp = parseInt(fp);
        }
        let fpPotion = parseInt(window.var_combatCooldownPotionTimer || "0") > 0;
        let fpMax = parseInt(window.var_maxFightPoints);
        let fpReq = fpNeeded();
        let count = Math.floor(fp / fpReq);
        let fpNext = fpReq * (count+1);
        if(fpNext > fpMax) {
            fpNext = fpMax;
        }
        let fpDelta = fpNext - fp;
        if(fpPotion) {
            fpDelta /= 2;
            $("#fp-potion-active").show();
        }
        else {
            $("#fp-potion-active").hide();
        }
        let time = fpDelta==0 ? "--:--" : formatTime(fpDelta);
        if(scope.area == "full") {
            $("#fp-timer").html(`${time}`);
        }
        else {
            $("#fp-timer").html(`${count}x&nbsp;&nbsp;${time}`);
        }
    }

    function overrideFunctions() {
        const originalSetItems = window.setItems;
        window.setItems = function(data) {
            originalSetItems.apply(this, arguments);
            if(data) {
                let m = data.match(/fightPoints~(\d+)/);
                if(m) {
                    updateUI(m[1]);
                }
            }
        }
    }

    function init() {
        if(!window.var_username) {
            setTimeout(init, 1000);
            return;
        }

        initUI();
        overrideFunctions();
        loadPreferences();
    }

    $(init);

})();