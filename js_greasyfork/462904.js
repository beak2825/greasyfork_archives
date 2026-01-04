// ==UserScript==
// @name         MouseHunt Sunken City HUD Enhancer
// @description  Add information to the Sunken City HUD that's available on the app.
// @author       LethalVision
// @version      0.7
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/683695-lethalvision
// @downloadURL https://update.greasyfork.org/scripts/462904/MouseHunt%20Sunken%20City%20HUD%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/462904/MouseHunt%20Sunken%20City%20HUD%20Enhancer.meta.js
// ==/UserScript==

(function() {
    const DEBUG = false;
    const UPDATED_TAG = 'sc_hud_enhancer';
    const SD_ITEM_TYPE = 'sand_dollar_stat_item';
    // yes this script uses a disgusting mix of both web and app data to make pretty numbers

    var quest;
    var appZoneData;

    /**
	 * adapted from Brad's style adder
	 *
	 * @param {string} styles The styles to add.
	 */
	function addStyles(styles) {
        const STYLE_ID = 'mh-sc-hud';
		const existingStyles = document.getElementById(STYLE_ID);
		if (existingStyles) {
			return;
		}
		const style = document.createElement('style');
		style.id = STYLE_ID;
		style.innerHTML = styles;
		document.head.appendChild(style);
	};

    // listen to HUD/Sonar render functions, and call the respective updaters
    function addHooks() {
        const originalRender = app.views.HeadsUpDisplayView.hud.render;
        app.views.HeadsUpDisplayView.hud.render = function(tmpUser) {
            const value = originalRender(tmpUser);
            debugLog('SC HUD: render');
            setTimeout(updateHud, 100);
            return value;
        };
        const originalSonar = app.views.HeadsUpDisplayView.hud.sunkenCitySonar;
        app.views.HeadsUpDisplayView.hud.sunkenCitySonar = function() {
            originalSonar();
            setTimeout(updateSonar, 100);
        };
    }

    // fetch SC data through app endpoint
    function fetchAppZoneData() {
        debugLog('SC HUD: fetchAppZoneData');
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "https://www.mousehuntgame.com/api/action/passiveturn", true);
        xhr.onload = () => {
            const parsedResponse = JSON.parse(xhr.response);
            const locationStats = parsedResponse?.user?.location_stats;
            if (!locationStats) {
                console.log('SC HUD: Cannot get location stats from app API response');
                return;
            }
            appZoneData = locationStats;
            updateHud();
        };
        xhr.send();
    }

    // main update function for HUD
    function updateHud() {
        if (user.environment_type != 'sunken_city') {
            return;
        }
        quest = user.quests.QuestSunkenCity;
        if (!quest.is_diving) {
            // skip HUD update if not diving
            return;
        }
        // fetch app data if not present/outdated
        if (!appZoneData || appZoneData.zones[0].num != quest.active_zone) {
            fetchAppZoneData();
            return;
        }
        const HUD = document.getElementById('hudLocationContent');
        // try again later if HUD is animating
        const player = HUD.querySelector('.player');
        if (!player || player.classList.contains('animate') || player.classList.contains('launch')) {
            setTimeout(updateHud, 250);
            return;
        }
        // add distance/length
        const hudZones = HUD.querySelectorAll('.zone');
        updateZoneElems(hudZones);
        // change current zone display
        const hudDistance = HUD.querySelector('.distanceContainer');
        if (!hudDistance.classList.contains(UPDATED_TAG)) {
            // save and replace current dive
            const currentDiveElem = hudDistance.querySelector('.distance');
            const currentDive = currentDiveElem.innerText;
            currentDiveElem.remove();
            hudDistance.innerHTML = '<span class="zone_progress"></span>' + hudDistance.innerHTML;
            // update tooltip
            const tooltipElem = hudDistance.querySelector('.toolTip');
            tooltipElem.innerHTML = `<b>Current:</b> <span class="distance">${currentDive}</span><br>` + tooltipElem.innerHTML;
            hudDistance.classList.add(UPDATED_TAG);
        }
        const currentZone = appZoneData.zones[0];
        hudDistance.querySelector('.zone_progress').innerText = `${quest.distance - currentZone.start}m / ${currentZone.length}m`;
        // add sand dollars
        const hudCraftingItems = HUD.querySelector('.craftingItems');
        if (!hudCraftingItems.classList.contains(UPDATED_TAG)) {
            const sdName = 'Sand Dollars';
            const sdDesc = 'Used as currency in the Sunken City!';
            const tooltip = `<div class="toolTip"><b>${sdName}</b><br>${sdDesc}<div class="arrow"><span></span></div></div>`;
            hudCraftingItems.innerHTML += `<a href="#" onclick="hg.views.ItemView.show('${SD_ITEM_TYPE}'); return false;"><img src=""><span class="item quantity" data-item-type="${SD_ITEM_TYPE}"></span>${tooltip}</a>`;
            hudCraftingItems.querySelectorAll('a').forEach(elem => {elem.style.lineHeight = '24px'});
            hudCraftingItems.classList.add(UPDATED_TAG);
        }
        hudCraftingItems.querySelectorAll('.item.quantity').forEach(elem => {
            if (!elem.innerText.includes(',')) {
                elem.innerText = numberFormat(elem.innerText);
            }
        });
        // fetch SD item, then handle UI update in the callback function
        hg.utils.UserInventory.getItem(SD_ITEM_TYPE, (data) => {updateSandDollar(data, HUD)}, true);
    }

    // update function for Sonar
    function updateSonar() {
        if (!document.querySelector('.sonar') || !appZoneData) {
            return;
        }
        const sonarZones = document.querySelectorAll('.sonar .zone');
        updateZoneElems(sonarZones);
        // show extra zones that can't be seen on sonar
        const sonarWater = document.querySelector('.sonar .water');
        var extraZoneElem = sonarWater.querySelector('.hidden_zone');
        if (!extraZoneElem) {
            // create a tooltip styled box
            extraZoneElem = document.createElement('div');
            extraZoneElem.className = 'hidden_zone';
            extraZoneElem.style.display = 'none';
            sonarWater.appendChild(extraZoneElem);
        }
        const hiddenZones = getUnseenZones();
        extraZoneElem.style.fontSize = hiddenZones.length > 2 ? '8px' : '';
        extraZoneElem.innerHTML = '';
        if (hiddenZones.length > 0) {
            hiddenZones.forEach(zone => {
                extraZoneElem.innerHTML += `<div><b>${zone.name} (${zone.length}m)</b><br>${zone.start - quest.distance}m away</div>`;
            });
            extraZoneElem.style.display = '';
        }
    }

    // === Helpers ===
    // updater for zones, generalized for both HUD and sonar
    function updateZoneElems(zoneElems) {
        for (var i = 0; i < zoneElems.length; i++) {
            // assume hud zones are arranged sequentially
            const zoneElem = zoneElems[i];
            if (!zoneElem.classList.contains(UPDATED_TAG)) {
                // create spans to be updated later
                zoneElem.querySelector('.length')?.remove();
                zoneElem.querySelector('.name').innerHTML += '<span class="length"></span><br><span class="distance_to_zone"></span>';
                zoneElem.classList.add(UPDATED_TAG);
            }
            // update zone length
            const lengthElem = zoneElem.querySelector('.length');
            const distanceAwayElem = zoneElem.querySelector('.distance_to_zone');
            if (zoneElem.classList.contains('past')) {
                lengthElem.innerText = '';
                distanceAwayElem.innerText = '';
            } else if (zoneElem.classList.contains('active')) {
                lengthElem.innerText = ` (${getZoneByElem(zoneElem).length}m)`;
                distanceAwayElem.innerText = 'Current zone';
            } else {
                const zoneData = getZoneByElem(zoneElem);
                lengthElem.innerText = ` (${zoneData.length}m)`;
                distanceAwayElem.innerText = `${zoneData.start - quest.distance}m away`;
            }
        }
    }

    // util to query zone by its num
    function getZoneByNum(zoneNum) {
        return appZoneData.zones.find(zone => zone.num == zoneNum);
    }

    // return zone data for given zone DOM elem
    function getZoneByElem(zoneElem) {
        const elemZoneNum = parseInt(zoneElem.getAttribute('data-zone-num'));
        var zoneData = getZoneByNum(elemZoneNum);
        if (!zoneData) {
            // quest data can have more entries than app data if upcoming zones are short
            // forge zone data in the app format using quest data
            const questZone = quest.zones.find(zone => zone.num == elemZoneNum);
            const prevZone = getZoneByNum(elemZoneNum - 1);
            if (questZone && prevZone) {
                const newZoneData = {};
                newZoneData.num = elemZoneNum;
                newZoneData.type = questZone.type;
                newZoneData.name = questZone.name;
                newZoneData.length = questZone.length;
                newZoneData.start = prevZone.start + prevZone.length;
                appZoneData.zones.push(newZoneData);
                return newZoneData;
            }
        }
        return zoneData;
    }

    // returns zones that cannot be completely seen
    function getUnseenZones() {
        const unseenZones = [];
        appZoneData.zones.forEach(zone => {
            if (zone.start - quest.distance >= 1000) {
                // arbitrary distance, set at where the sonar starts cutting off zone info
                unseenZones.push(zone);
            }
        });
        // hidden zone debug
        if (DEBUG && unseenZones.length == 0) {
            unseenZones.push(appZoneData.zones[2]);
            unseenZones.push(appZoneData.zones[3]);
        }
        return unseenZones;
    }

    // update Sand Dollar image + count
    function updateSandDollar(data, HUD) {
        var sdElem;
        HUD.querySelectorAll('.craftingItems a').forEach((elem) => {
            const itemType = elem.querySelector('.item.quantity')?.getAttribute('data-item-type');
            if (itemType == SD_ITEM_TYPE) {
                sdElem = elem;
            }
        });
        if (!sdElem) {
            return;
        }
        sdElem.querySelector('img').src = data.thumbnail;
        // numberFormat is defined by Mousehunt
        sdElem.querySelector('.item.quantity').innerText = numberFormat(data.quantity);
    }

    // debug logger
    function debugLog(logItem){
        if (DEBUG) console.log(logItem);
    }

    // === Init ===
    // I don't want to mess with styles, but the !important tags leave me no choice
    addStyles(`
    .hidden_zone{
        position:absolute;
        top:28px;
        right:2px;
        padding:5px;
        border:2px solid #000;
        background:#fff;
        color:#000;
        font-size:9px;
        border-radius:10px;
        z-index:20;
    }
    .hidden_zone div{
        padding-bottom:2px;
    }
    .sunkenCityHud .craftingItems a .toolTip{
        left:61px;
    }
    .sunkenCityHud .sunkenCharms a .toolTip{
        display:none!important;
    }
    .sunkenCityHud .sunkenCharms a:hover .toolTip{
        display:block!important;
    }
    .sunkenCityHud.murky_depths .water .zone .name{
        text-shadow:0px 0px 1px #d0bbf6,1px 1px 1px #8330a2;
    }`);
    addHooks();
    updateHud();
})();